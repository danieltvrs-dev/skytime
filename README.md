## Skytime

Tempo agora, previsão dos próximos dias e localização automática numa interface clara.
Construído como um produto editorial: jornada vertical do céu ao chão, paleta autoral,
tipografia trabalhada.

### O que faz

- Condições atuais: temperatura, sensação térmica, umidade, vento e estado do céu.
- Previsão para os próximos cinco dias com mínimas e máximas.
- Próximas 24 horas em strip horizontal.
- Janelas de hora dourada e hora azul calculadas a partir do nascer e pôr do sol.
- Sugestão do que levar (guarda-chuva, protetor solar, casaco) baseada em UV, chuva e amplitude térmica.
- Frase editorial sobre o dia inteiro ("Ensolarado pela manhã, chuvoso à tarde").
- Busca por cidade com autocomplete.
- Botão "minha localização" via GPS do navegador.
- Histórico das últimas cidades pesquisadas, persistido em PostgreSQL.
- Mapa da cidade em tiles escuros e gráfico de chance de chuva por hora.
- Instalável como PWA (funciona offline com a última consulta cacheada).

### Stack

**Frontend**
- React 19 + Vite 8
- TailwindCSS 4 (paleta e tipografia em `@theme` no próprio CSS)
- Fraunces (serif variável) + Inter, via Google Fonts
- Lucide React para ícones
- Leaflet + CartoDB Dark para o mapa
- Axios como cliente HTTP

**Backend**
- Python 3.13 + FastAPI
- httpx (assíncrono) consumindo APIs externas
- SQLAlchemy 2.0 + asyncpg + Alembic
- Cache em memória com TTL próprio (~24h pra geocoding, 10min pro forecast)

**Banco** PostgreSQL 16 em container Docker.

**APIs externas, todas gratuitas e sem chave**
- [Open-Meteo](https://open-meteo.com) para clima e geocoding direto
- [Nominatim](https://nominatim.openstreetmap.org) para reverse geocoding
- [OpenStreetMap + CARTO](https://carto.com) para tiles do mapa

### Executando localmente

Pré-requisitos:
- Python 3.10+
- Node 18+
- Docker Desktop (pra o banco)

**1. Banco**

Na raiz do projeto:

```bash
docker compose up -d
```

Sobe um Postgres 16 na porta `5433` do host (a 5432 fica livre pra qualquer outro Postgres nativo que você já tenha).

**2. Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1          # Windows; no macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head                 # aplica as migrations no banco
uvicorn app.main:app --reload
```

Disponível em `http://localhost:8000`. Documentação interativa em `/docs`.

**3. Frontend**

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite imprime a URL (geralmente `http://localhost:5173`).

### Estrutura do código

```
skytime/
├── backend/
│   └── app/
│       ├── core/         configuração e conexão com o banco
│       ├── models/       modelos SQLAlchemy
│       ├── routes/       endpoints FastAPI
│       ├── schemas/      modelos Pydantic
│       └── services/     integrações externas e regras de negócio
└── frontend/
    └── src/
        ├── components/   componentes React (Card, WeatherCard, CityMap...)
        ├── hooks/        hooks customizados (useGeolocation, useRelativeTime)
        ├── services/     cliente HTTP e funções de API
        └── utils/        formatadores e regras puras
```

### Comandos úteis

```bash
# Banco
docker compose up -d            # sobe Postgres
docker compose down             # para (preserva dados)
docker compose down -v          # para e apaga dados

# Backend
alembic upgrade head            # aplica migrations pendentes
alembic revision --autogenerate -m "mensagem"   # gera nova migration após mudar modelo

# Frontend
npm run dev                     # servidor dev
npm run build                   # build de produção (inclui service worker do PWA)
npm run preview                 # serve o build local
```

### Licença

Código sob a MIT, à disposição pra estudo ou reuso.
