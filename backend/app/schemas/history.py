from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SearchHistoryItem(BaseModel):
    """Entrada do histórico de buscas, do jeito que o frontend consome."""

    model_config = ConfigDict(from_attributes=True)  # permite ler de modelo SQLAlchemy

    id: int
    city_name: str
    country: str | None = None
    admin1: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    searched_at: datetime
