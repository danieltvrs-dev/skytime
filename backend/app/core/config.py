"""Configuração lida do ambiente.

`load_dotenv()` busca um arquivo `.env` no diretório de execução do backend.
Se faltar, caímos no default que casa com o docker-compose local.
"""

import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://skytime:skytime_dev@localhost:5433/skytime",
    )


settings = Settings()
