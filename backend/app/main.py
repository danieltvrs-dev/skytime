from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import history, weather

# Origens autorizadas a chamar a API a partir do navegador.
# Em produção, adicionar o domínio do frontend hospedado.
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI(
    title="Skytime API",
    description="API do dashboard de clima Skytime.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
