"""Cache em memória com expiração por tempo (TTL).

Implementação intencionalmente simples: um dicionário onde cada valor é
acompanhado do timestamp em que expira. Sem locking, sem persistência,
sem distribuição. Suficiente para um único processo do FastAPI.

Quando o app crescer para múltiplos workers ou instâncias, este módulo
é o ponto único a substituir por Redis ou similar.
"""

import time
from typing import Generic, TypeVar

T = TypeVar("T")


class TTLCache(Generic[T]):
    """Cache chave/valor com expiração individual por entrada."""

    def __init__(self, ttl_seconds: float):
        self._ttl = ttl_seconds
        self._store: dict[str, tuple[float, T]] = {}

    def get(self, key: str) -> T | None:
        """Retorna o valor se ainda válido, senão None (e remove se expirou)."""
        entry = self._store.get(key)
        if entry is None:
            return None
        expires_at, value = entry
        if expires_at <= time.monotonic():
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: T) -> None:
        """Armazena `value` sob `key`, válido pelos próximos `ttl_seconds`."""
        self._store[key] = (time.monotonic() + self._ttl, value)

    def clear(self) -> None:
        """Esvazia o cache. Útil para testes."""
        self._store.clear()
