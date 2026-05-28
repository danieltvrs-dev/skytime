"""Rotas de clima do Skytime."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.weather import ForecastData, GeocodingResult, WeatherResponse
from app.services.forecast import ForecastServiceError, fetch_forecast
from app.services.geocoding import (
    CityNotFoundError,
    GeocodingServiceError,
    geocode,
    reverse_geocode,
)
from app.services.history import record_search

router = APIRouter(prefix="/weather", tags=["weather"])
logger = logging.getLogger(__name__)


async def _try_record(session: AsyncSession, location: GeocodingResult) -> None:
    """Registra a busca em background, sem deixar falhar a resposta principal."""
    try:
        await record_search(session, location)
    except Exception as exc:  # noqa: BLE001 (queremos ser permissivos aqui)
        logger.warning("Falha ao registrar histórico: %s", exc)
        try:
            await session.rollback()
        except Exception:  # noqa: BLE001
            pass


@router.get("/geocode", response_model=GeocodingResult)
async def geocode_city(
    city: str = Query(..., min_length=1, description="Nome da cidade a buscar"),
) -> GeocodingResult:
    """Resolve um nome de cidade em coordenadas geográficas."""
    try:
        return await geocode(city)
    except CityNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except GeocodingServiceError as exc:
        raise HTTPException(
            status_code=502, detail="Serviço de geocoding indisponível."
        ) from exc


@router.get("/forecast", response_model=ForecastData)
async def forecast_by_coords(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
) -> ForecastData:
    """Retorna clima atual, hora a hora e diário para um par de coordenadas."""
    try:
        return await fetch_forecast(lat, lon)
    except ForecastServiceError as exc:
        raise HTTPException(
            status_code=502, detail="Serviço de previsão indisponível."
        ) from exc


@router.get("", response_model=WeatherResponse)
async def weather_by_city(
    city: str = Query(..., min_length=1, description="Nome da cidade"),
    session: AsyncSession = Depends(get_session),
) -> WeatherResponse:
    """Endpoint principal: recebe um nome de cidade e devolve clima completo.

    Pipeline: geocoda → busca previsão → combina num só payload.
    Registra a busca no histórico em background (sem travar a resposta).
    """
    try:
        location = await geocode(city)
    except CityNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except GeocodingServiceError as exc:
        raise HTTPException(
            status_code=502, detail="Serviço de geocoding indisponível."
        ) from exc

    try:
        forecast = await fetch_forecast(location.latitude, location.longitude)
    except ForecastServiceError as exc:
        raise HTTPException(
            status_code=502, detail="Serviço de previsão indisponível."
        ) from exc

    await _try_record(session, location)

    return WeatherResponse(
        location=location,
        current=forecast.current,
        hourly=forecast.hourly,
        daily=forecast.daily,
        timezone=forecast.timezone,
    )


@router.get("/by-coords", response_model=WeatherResponse)
async def weather_by_coords(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    session: AsyncSession = Depends(get_session),
) -> WeatherResponse:
    """Recebe coordenadas (geralmente do GPS do navegador) e devolve clima completo.

    Pipeline: reverse geocode (lat/lon → cidade) → forecast → combina.
    Registra a busca no histórico em background (sem travar a resposta).
    """
    try:
        location = await reverse_geocode(lat, lon)
    except CityNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except GeocodingServiceError as exc:
        raise HTTPException(
            status_code=502, detail="Serviço de geocoding indisponível."
        ) from exc

    try:
        forecast = await fetch_forecast(lat, lon)
    except ForecastServiceError as exc:
        raise HTTPException(
            status_code=502, detail="Serviço de previsão indisponível."
        ) from exc

    await _try_record(session, location)

    return WeatherResponse(
        location=location,
        current=forecast.current,
        hourly=forecast.hourly,
        daily=forecast.daily,
        timezone=forecast.timezone,
    )
