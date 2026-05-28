"""Rotas do histórico de buscas."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.history import SearchHistoryItem
from app.services.history import delete_entry, list_recent

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[SearchHistoryItem])
async def get_history(
    limit: int = Query(10, ge=1, le=50, description="Quantidade máxima de entradas"),
    session: AsyncSession = Depends(get_session),
) -> list[SearchHistoryItem]:
    """Retorna as cidades mais recentes pesquisadas (ordem decrescente por data)."""
    entries = await list_recent(session, limit=limit)
    return entries  # FastAPI serializa via response_model com from_attributes


@router.delete("/{entry_id}", status_code=204)
async def remove_history_entry(
    entry_id: int,
    session: AsyncSession = Depends(get_session),
) -> None:
    """Remove uma entrada do histórico."""
    deleted = await delete_entry(session, entry_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Entrada não encontrada")
