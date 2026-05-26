"""Serviço de geocoding usando a Open-Meteo Geocoding API.

Converte nome de cidade em coordenadas geográficas e metadados (país, fuso, etc.).
Documentação: https://open-meteo.com/en/docs/geocoding-api
"""

import httpx

from app.schemas.weather import GeocodingResult
from app.services.cache import TTLCache

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
TIMEOUT_SECONDS = 10.0
CACHE_TTL_SECONDS = 24 * 60 * 60  # cidades não se movem, cache longo

_cache: TTLCache[GeocodingResult] = TTLCache(ttl_seconds=CACHE_TTL_SECONDS)


class CityNotFoundError(Exception):
    """Cidade pesquisada não retornou resultados na Open-Meteo."""

    def __init__(self, city: str):
        self.city = city
        super().__init__(f"Cidade não encontrada: {city}")


class GeocodingServiceError(Exception):
    """Falha de comunicação com a Open-Meteo (timeout, 5xx, rede)."""


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

    params = {
        "name": city,
        "count": 1,
        "language": "pt",
        "format": "json",
    }
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            response = await client.get(GEOCODING_URL, params=params)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as exc:
        raise GeocodingServiceError(
            f"Falha ao consultar geocoding: {exc}"
        ) from exc

    results = data.get("results") or []
    if not results:
        raise CityNotFoundError(city)

    top = results[0]
    result = GeocodingResult(
        name=top["name"],
        country=top.get("country", ""),
        latitude=top["latitude"],
        longitude=top["longitude"],
        admin1=top.get("admin1"),
        timezone=top.get("timezone"),
    )
    _cache.set(cache_key, result)
    return result
