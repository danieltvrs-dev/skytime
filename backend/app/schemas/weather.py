from datetime import date, datetime

from pydantic import BaseModel


class GeocodingResult(BaseModel):
    """Resultado de uma busca por cidade no serviço de geocoding."""

    name: str
    country: str
    latitude: float
    longitude: float
    admin1: str | None = None  # estado/província, quando disponível
    timezone: str | None = None


class CurrentWeather(BaseModel):
    """Condições atuais no local consultado."""

    time: datetime
    temperature: float
    apparent_temperature: float
    humidity: int
    wind_speed: float
    weather_code: int
    description: str
    icon: str


class HourlyPoint(BaseModel):
    """Um ponto da previsão hora a hora."""

    time: datetime
    temperature: float
    weather_code: int
    icon: str


class DailyPoint(BaseModel):
    """Um ponto da previsão diária."""

    date: date
    temperature_max: float
    temperature_min: float
    weather_code: int
    description: str
    icon: str


class ForecastData(BaseModel):
    """Pacote completo de clima para um par de coordenadas."""

    current: CurrentWeather
    hourly: list[HourlyPoint]
    daily: list[DailyPoint]
    timezone: str


class WeatherResponse(BaseModel):
    """Resposta consolidada do endpoint público /weather.

    Junta a localização resolvida (geocoding) com o pacote de previsão
    para que o frontend consuma tudo em uma chamada só.
    """

    location: GeocodingResult
    current: CurrentWeather
    hourly: list[HourlyPoint]
    daily: list[DailyPoint]
    timezone: str
