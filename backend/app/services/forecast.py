"""Serviço de previsão do tempo usando a Open-Meteo Forecast API.

Recebe lat/lon e devolve clima atual, previsão hora a hora e previsão diária,
já traduzidos para a estrutura interna do Skytime.

Documentação: https://open-meteo.com/en/docs
"""

import httpx

from app.schemas.weather import (
    CurrentWeather,
    DailyPoint,
    ForecastData,
    HourlyPoint,
)
from app.services.cache import TTLCache
from app.services.weather_codes import describe

FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
TIMEOUT_SECONDS = 10.0
FORECAST_DAYS = 5
CACHE_TTL_SECONDS = 10 * 60  # 10 minutos: dados parecem ao vivo, sem queimar a API

_cache: TTLCache[ForecastData] = TTLCache(ttl_seconds=CACHE_TTL_SECONDS)

_CURRENT_VARS = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "wind_speed_10m",
    "weather_code",
]
_HOURLY_VARS = [
    "temperature_2m",
    "weather_code",
    "precipitation_probability",
]
_DAILY_VARS = [
    "temperature_2m_max",
    "temperature_2m_min",
    "weather_code",
    "uv_index_max",
    "precipitation_probability_max",
    "sunrise",
    "sunset",
]


class ForecastServiceError(Exception):
    """Falha ao consultar a Open-Meteo (rede, timeout, resposta inválida)."""


async def fetch_forecast(latitude: float, longitude: float) -> ForecastData:
    """Busca o pacote de previsão completo para um par de coordenadas.

    Resultado fica em cache por 10 minutos, indexado pelas coordenadas
    arredondadas a 2 casas (resolução de ~1km, suficiente para clima).
    """
    cache_key = f"{round(latitude, 2)},{round(longitude, 2)}"
    cached = _cache.get(cache_key)
    if cached is not None:
        return cached

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ",".join(_CURRENT_VARS),
        "hourly": ",".join(_HOURLY_VARS),
        "daily": ",".join(_DAILY_VARS),
        "timezone": "auto",  # Open-Meteo deduz o fuso pelas coordenadas
        "forecast_days": FORECAST_DAYS,
    }
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            response = await client.get(FORECAST_URL, params=params)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as exc:
        raise ForecastServiceError(
            f"Falha ao consultar forecast: {exc}"
        ) from exc

    result = _parse(data)
    _cache.set(cache_key, result)
    return result


def _parse(data: dict) -> ForecastData:
    """Transforma o JSON cru da Open-Meteo na nossa estrutura interna.

    A API devolve vetores paralelos (ex.: hourly.time[i] casa com hourly.temperature_2m[i]).
    Aqui combinamos esses vetores em listas de objetos, mais natural para o frontend.
    """
    current = data["current"]
    current_code = int(current["weather_code"])
    current_desc, current_icon = describe(current_code)

    current_weather = CurrentWeather(
        time=current["time"],
        temperature=current["temperature_2m"],
        apparent_temperature=current["apparent_temperature"],
        humidity=int(current["relative_humidity_2m"]),
        wind_speed=current["wind_speed_10m"],
        weather_code=current_code,
        description=current_desc,
        icon=current_icon,
    )

    hourly = data["hourly"]
    hourly_points: list[HourlyPoint] = []
    for time, temp, code, prob in zip(
        hourly["time"],
        hourly["temperature_2m"],
        hourly["weather_code"],
        hourly["precipitation_probability"],
    ):
        _, icon = describe(int(code))
        hourly_points.append(
            HourlyPoint(
                time=time,
                temperature=temp,
                weather_code=int(code),
                icon=icon,
                precipitation_probability=int(prob) if prob is not None else None,
            )
        )

    daily = data["daily"]
    daily_points: list[DailyPoint] = []
    for d, tmax, tmin, code, uv, prcp, sun_rise, sun_set in zip(
        daily["time"],
        daily["temperature_2m_max"],
        daily["temperature_2m_min"],
        daily["weather_code"],
        daily["uv_index_max"],
        daily["precipitation_probability_max"],
        daily["sunrise"],
        daily["sunset"],
    ):
        desc, icon = describe(int(code))
        daily_points.append(
            DailyPoint(
                date=d,
                temperature_max=tmax,
                temperature_min=tmin,
                weather_code=int(code),
                description=desc,
                icon=icon,
                uv_index_max=uv,
                precipitation_probability_max=int(prcp) if prcp is not None else None,
                sunrise=sun_rise,
                sunset=sun_set,
            )
        )

    return ForecastData(
        current=current_weather,
        hourly=hourly_points,
        daily=daily_points,
        timezone=data.get("timezone", "UTC"),
    )
