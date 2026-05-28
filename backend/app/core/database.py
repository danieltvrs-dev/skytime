"""Conexão assíncrona ao Postgres.

Expõe:
  - engine: AsyncEngine singleton compartilhado por toda a app
  - AsyncSessionLocal: factory de sessões
  - get_session: dependência do FastAPI que abre/fecha uma sessão por request
"""

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False, future=True)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncIterator[AsyncSession]:
    """Dependência do FastAPI: abre uma sessão e garante o fechamento."""
    async with AsyncSessionLocal() as session:
        yield session
