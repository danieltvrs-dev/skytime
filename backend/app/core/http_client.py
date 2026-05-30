"""Cliente HTTP assíncrono compartilhado pelo backend inteiro.

Por que um singleton: criar `httpx.AsyncClient` por request reabre o pool
de conexões a cada chamada, somando ~30ms de handshake TCP/TLS toda vez.
Com pool compartilhado, Open-Meteo e Nominatim ficam em keep-alive entre
requisições, e o autocomplete (uma chamada por tecla) deixa de pagar
esse custo a cada keystroke.

Inicializado no `lifespan` do FastAPI, fechado no shutdown.
"""

import httpx

DEFAULT_TIMEOUT_SECONDS = 10.0

_client: httpx.AsyncClient | None = None


def get_http_client() -> httpx.AsyncClient:
    """Retorna o singleton já inicializado.

    Levanta se chamado antes do lifespan ter iniciado — o que só aconteceria
    em testes mal isolados, vale o ruído pra pegar o bug cedo.
    """
    if _client is None:
        raise RuntimeError(
            "HTTP client não inicializado. Verifique o lifespan da aplicação."
        )
    return _client


async def startup() -> None:
    """Cria o pool. Chamado no lifespan startup."""
    global _client
    _client = httpx.AsyncClient(timeout=DEFAULT_TIMEOUT_SECONDS)


async def shutdown() -> None:
    """Fecha o pool de forma limpa. Chamado no lifespan shutdown."""
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None
