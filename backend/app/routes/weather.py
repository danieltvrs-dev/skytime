"""Rotas de clima do Skytime."""

from fastapi import APIRouter, HTTPException, Query

from app.schemas.weather import ForecastData, GeocodingResult
from app.services.forecast import ForecastServiceError, fetch_forecast
from app.services.geocoding import (
    CityNotFoundError,
    GeocodingServiceError,
    geocode,
)

router = APIRouter(prefix="/weather", tags=["weather"])


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
