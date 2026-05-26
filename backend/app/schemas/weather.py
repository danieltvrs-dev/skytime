from pydantic import BaseModel


class GeocodingResult(BaseModel):
    """Resultado de uma busca por cidade no serviço de geocoding."""

    name: str
    country: str
    latitude: float
    longitude: float
    admin1: str | None = None  # estado/província, quando disponível
    timezone: str | None = None
