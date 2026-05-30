from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import http_client
from app.core.config import settings
from app.routes import history, weather


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Sobe e derruba recursos compartilhados (pool HTTP, etc.)."""
    await http_client.startup()
    try:
        yield
    finally:
        await http_client.shutdown()


app = FastAPI(
    title="Skytime API",
    description="API do dashboard de clima Skytime.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=False,  # não usamos cookies/sessão
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(weather.router)
app.include_router(history.router)


@app.get("/")
def root():
    return {"app": "Skytime API", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}
