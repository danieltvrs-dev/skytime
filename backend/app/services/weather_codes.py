"""Tradução dos códigos WMO da Open-Meteo.

Cada código vira (descrição em português, chave semântica de ícone).
A chave de ícone é o que o frontend usa pra escolher qual desenho mostrar,
mantendo a separação entre dado bruto (código WMO) e apresentação.

Referência: https://open-meteo.com/en/docs#weathervariables (tabela WMO Weather interpretation codes)
"""

WeatherDescription = tuple[str, str]  # (descrição, icon_key)

_WEATHER_CODES: dict[int, WeatherDescription] = {
    0: ("Céu limpo", "clear"),
    1: ("Predominantemente limpo", "mostly-clear"),
    2: ("Parcialmente nublado", "partly-cloudy"),
    3: ("Nublado", "cloudy"),
    45: ("Neblina", "fog"),
    48: ("Neblina com geada", "fog"),
    51: ("Garoa fraca", "drizzle"),
    53: ("Garoa moderada", "drizzle"),
    55: ("Garoa intensa", "drizzle"),
    56: ("Garoa congelante fraca", "drizzle"),
    57: ("Garoa congelante intensa", "drizzle"),
    61: ("Chuva fraca", "rain"),
    63: ("Chuva moderada", "rain"),
    65: ("Chuva intensa", "rain"),
    66: ("Chuva congelante fraca", "rain"),
    67: ("Chuva congelante intensa", "rain"),
    71: ("Neve fraca", "snow"),
    73: ("Neve moderada", "snow"),
    75: ("Neve intensa", "snow"),
    77: ("Grãos de neve", "snow"),
    80: ("Pancadas de chuva fracas", "rain-showers"),
    81: ("Pancadas de chuva moderadas", "rain-showers"),
    82: ("Pancadas de chuva intensas", "rain-showers"),
    85: ("Pancadas de neve fracas", "snow-showers"),
    86: ("Pancadas de neve intensas", "snow-showers"),
    95: ("Trovoada", "thunderstorm"),
    96: ("Trovoada com granizo leve", "thunderstorm"),
    99: ("Trovoada com granizo intenso", "thunderstorm"),
}

_UNKNOWN: WeatherDescription = ("Condição desconhecida", "unknown")


def describe(code: int) -> WeatherDescription:
    """Retorna (descrição em português, chave de ícone) para o código WMO."""
    return _WEATHER_CODES.get(code, _UNKNOWN)
