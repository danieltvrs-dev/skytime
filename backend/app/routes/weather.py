"""Rotas de clima do Skytime."""

from fastapi import APIRouter, HTTPException, Query

from app.schemas.weather import GeocodingResult
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
