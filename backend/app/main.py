from fastapi import FastAPI

from app.routes import weather

app = FastAPI(
    title="Skytime API",
    description="API do dashboard de clima Skytime.",
    version="0.1.0",
)

app.include_router(weather.router)


@app.get("/")
def root():
    return {"app": "Skytime API", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}
