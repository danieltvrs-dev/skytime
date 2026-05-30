"""Serviço de geocoding usando a Open-Meteo Geocoding API.

Converte nome de cidade em coordenadas geográficas e metadados (país, fuso, etc.).
Documentação: https://open-meteo.com/en/docs/geocoding-api
"""

import httpx

from app.core.http_client import get_http_client
from app.schemas.weather import GeocodingResult
from app.services.cache import TTLCache

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
REVERSE_GEOCODING_URL = "https://nominatim.openstreetmap.org/reverse"
CACHE_TTL_SECONDS = 24 * 60 * 60  # cidades não se movem, cache longo

# Nominatim exige User-Agent identificável (sem isso devolve 403).
# Documentação: https://operations.osmfoundation.org/policies/nominatim/
NOMINATIM_USER_AGENT = "Skytime/0.1 (https://github.com/danieltvrs-dev/skytime)"

_cache: TTLCache[GeocodingResult] = TTLCache(ttl_seconds=CACHE_TTL_SECONDS)


class CityNotFoundError(Exception):
    """Cidade pesquisada não retornou resultados na Open-Meteo."""

    def __init__(self, city: str):
        self.city = city
        super().__init__(f"Cidade não encontrada: {city}")


class GeocodingServiceError(Exception):
    """Falha de comunicação com a Open-Meteo (timeout, 5xx, rede)."""


def _to_geocoding_result(item: dict) -> GeocodingResult:
    """Mapeia uma entrada `results[i]` da Open-Meteo no nosso schema."""
    return GeocodingResult(
        name=item["name"],
        country=item.get("country", ""),
        latitude=item["latitude"],
        longitude=item["longitude"],
        admin1=item.get("admin1"),
        timezone=item.get("timezone"),
    )


async def _fetch_geocoding(name: str, count: int) -> list[GeocodingResult]:
    """Bate na API e devolve a lista mapeada. Sem cache, sem erros de domínio.

    Pisos e tetos do `count` aqui pra a única chamada externa nunca virar inválida.
    """
    params = {
        "name": name,
        "count": max(1, min(count, 10)),
        "language": "pt",
        "format": "json",
    }
    try:
        response = await get_http_client().get(GEOCODING_URL, params=params)
        response.raise_for_status()
        data = response.json()
    except httpx.HTTPError as exc:
        raise GeocodingServiceError(
            f"Falha ao consultar geocoding: {exc}"
        ) from exc

    return [_to_geocoding_result(item) for item in (data.get("results") or [])]


async def geocode(city: str) -> GeocodingResult:
    """Busca a primeira cidade que corresponde ao nome informado.

    Resultados ficam em cache por 24h, indexados pelo nome normalizado
    (case-insensitive e sem espaços nas pontas).

    Levanta:
        CityNotFoundError: nenhum resultado encontrado.
        GeocodingServiceError: falha de rede ou resposta inválida.
    """
    cache_key = city.strip().lower()
    cached = _cache.get(cache_key)
    if cached is not None:
        return cached

    results = await _fetch_geocoding(city, count=1)
    if not results:
        raise CityNotFoundError(city)

    result = results[0]
    _cache.set(cache_key, result)
    return result


async def geocode_suggest(
    city: str, count: int = 5
) -> list[GeocodingResult]:
    """Retorna até `count` cidades cujo nome casa com a busca (autocomplete).

    Diferente de `geocode`, não cacheia: o usuário digitando muda o resultado
    a cada tecla. Não levanta CityNotFoundError; lista vazia é resposta válida.
    """
    return await _fetch_geocoding(city, count=count)


async def reverse_geocode(latitude: float, longitude: float) -> GeocodingResult:
    """Resolve coordenadas em nome de cidade via Nominatim (OpenStreetMap).

    Usado quando o frontend manda lat/lon do GPS do navegador e queremos
    exibir um nome de cidade humano em vez de coordenadas cruas.

    Cache 24h indexado pelas coordenadas arredondadas (~100m de tolerância).

    Levanta:
        CityNotFoundError: Nominatim não conseguiu resolver a posição.
        GeocodingServiceError: falha de rede ou resposta inválida.
    """
    cache_key = f"reverse:{round(latitude, 3)},{round(longitude, 3)}"
    cached = _cache.get(cache_key)
    if cached is not None:
        return cached

    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "json",
        "accept-language": "pt-BR,pt,en",
        "zoom": 10,  # nível de cidade (zoom maior cai em rua/bairro)
    }
    # User-Agent custom por request — não dá pra setar no cliente compartilhado
    # porque outras chamadas (Open-Meteo) não precisam dele.
    headers = {"User-Agent": NOMINATIM_USER_AGENT}
    try:
        response = await get_http_client().get(
            REVERSE_GEOCODING_URL, params=params, headers=headers
        )
        response.raise_for_status()
        data = response.json()
    except httpx.HTTPError as exc:
        raise GeocodingServiceError(
            f"Falha ao consultar reverse geocoding: {exc}"
        ) from exc

    address = data.get("address") if isinstance(data, dict) else None
    if not address:
        raise CityNotFoundError(f"{latitude},{longitude}")

    # Nominatim distribui o nome do local em campos diferentes dependendo
    # do tipo de área. Tentamos do mais específico ao mais genérico.
    name = (
        address.get("city")
        or address.get("town")
        or address.get("village")
        or address.get("suburb")
        or address.get("municipality")
        or address.get("county")
        or "Local"
    )

    result = GeocodingResult(
        name=name,
        country=address.get("country", ""),
        latitude=float(data.get("lat", latitude)),
        longitude=float(data.get("lon", longitude)),
        admin1=address.get("state"),
        timezone=None,  # Nominatim não devolve fuso; o forecast lida com isso
    )
    _cache.set(cache_key, result)
    return result
