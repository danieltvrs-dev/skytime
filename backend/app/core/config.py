"""Configuração lida do ambiente.

`load_dotenv()` busca um arquivo `.env` no diretório de execução do backend.
Se faltar, caímos nos defaults que casam com o setup local (Docker Compose).
"""

import os

from dotenv import load_dotenv

load_dotenv()


def _parse_origins(value: str) -> list[str]:
    """Quebra "http://a,http://b" em ["http://a", "http://b"], descartando vazios."""
    return [origin.strip() for origin in value.split(",") if origin.strip()]


_DEV_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://skytime:skytime_dev@localhost:5433/skytime",
    )

    # Em produção, setar via env:
    #   ALLOWED_ORIGINS=https://skytime.netlify.app,https://outro.com
    # Em dev, sem env, libera os defaults do Vite local.
    ALLOWED_ORIGINS: list[str] = (
        _parse_origins(os.getenv("ALLOWED_ORIGINS", "")) or _DEV_ORIGINS
    )


settings = Settings()
