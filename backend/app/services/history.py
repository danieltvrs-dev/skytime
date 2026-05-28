"""Serviço de histórico de buscas.

Regras de negócio:
  - `record_search` faz upsert por nome de cidade (1 entrada por cidade,
    com `searched_at` sempre atualizado).
  - `list_recent` devolve as N cidades mais recentes, ordenadas pela última busca.
  - `delete_entry` remove uma entrada por ID.

Sessões SQLAlchemy são passadas pelo caller (FastAPI injeta via dependência).
"""

from datetime import datetime, timezone

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.history import SearchHistory
from app.schemas.weather import GeocodingResult


async def record_search(
    session: AsyncSession, location: GeocodingResult
) -> SearchHistory:
    """Insere uma busca nova ou atualiza a existente (upsert por city_name)."""
    stmt = select(SearchHistory).where(SearchHistory.city_name == location.name)
    result = await session.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing is not None:
        existing.country = location.country
        existing.admin1 = location.admin1
        existing.latitude = location.latitude
        existing.longitude = location.longitude
        # O `onupdate=func.now()` da coluna só dispara quando o ORM detecta
        # alguma mudança. Garantimos isso atualizando explicitamente.
        existing.searched_at = datetime.now(timezone.utc)
        entry = existing
    else:
        entry = SearchHistory(
            city_name=location.name,
            country=location.country,
            admin1=location.admin1,
            latitude=location.latitude,
            longitude=location.longitude,
        )
        session.add(entry)

    await session.commit()
    await session.refresh(entry)
    return entry


async def list_recent(
    session: AsyncSession, limit: int = 10
) -> list[SearchHistory]:
    """Lista as N cidades mais recentes do histórico."""
    stmt = (
        select(SearchHistory)
        .order_by(SearchHistory.searched_at.desc())
        .limit(limit)
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def delete_entry(session: AsyncSession, entry_id: int) -> bool:
    """Remove uma entrada por ID. Retorna True se algo foi removido."""
    stmt = delete(SearchHistory).where(SearchHistory.id == entry_id)
    result = await session.execute(stmt)
    await session.commit()
    return result.rowcount > 0
