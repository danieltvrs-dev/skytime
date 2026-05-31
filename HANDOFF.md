# Handoff — Skytime

Documento de transferência de contexto entre sessões. Cole isso como primeira mensagem da nova conversa, depois peça pro Claude ler também `~/.claude/projects/C--Users-campo-OneDrive-projetos-skytime/memory/MEMORY.md` (índice das memórias persistidas) e os arquivos referenciados nele.

## Estado do projeto

**Skytime** é um dashboard de clima fullstack em produção contínua. Visualmente, segue a **identidade V1** do design (paleta Sky Deep / Sky / Sun / Navy / Cream / Sky Soft), com tipografia Fraunces (serif editorial) + Inter (UI) + Outfit (wordmark).

Repositório: <https://github.com/danieltvrs-dev/skytime> (branch `main`).

### Stack

- **Frontend:** React 19, Vite 8, TailwindCSS 4, React Router DOM, Axios, Leaflet, vite-plugin-pwa
- **Backend:** Python 3.13, FastAPI, httpx (cliente compartilhado via lifespan), SQLAlchemy 2.0 + asyncpg, Alembic
- **Banco:** PostgreSQL 16 em Docker (`docker-compose.yml` na raiz, porta 5433)
- **APIs externas:** Open-Meteo (clima + geocoding), Nominatim (reverse geocoding), CartoDB Dark (tiles do mapa)

### Setup local

```powershell
# Banco
cd C:\Users\campo\OneDrive\projetos\skytime
docker compose up -d

# Backend
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

Frontend em `http://localhost:5173`, backend em `http://localhost:8000`.

## Fases concluídas

```
✓ Fase 1   Setup do projeto
✓ Fase 2   Integração Open-Meteo
✓ Fase 3   Tela de clima atual
✓ Fase 4   Previsão diária e por hora
✓ Fase 4.5 Base do design system (Hora Dourada inicial)
✓ Fase 4.6 Features editoriais (vestir, resumo do dia, hora dourada/azul)
✓ Fase 4.7 Layout desktop em 2 colunas
✓ Fase 5   Busca por cidade + geolocalização
✓ Fase 6   Histórico no PostgreSQL
✓ Fase 6.5 Mapa Leaflet + timeline de chuva
● Fase 7   Design pass — quase fechada. Identidade V1 aplicada, refinos
            visuais feitos. Falta light/dark mode.
● Fase 8   PWA + responsividade + deploy — PWA pronto, falta testar mobile
            e fazer deploy.
```

## Funcionalidades em produção (todas commitadas)

### Hero (Zona 1)
- WeatherCard hero unificado (dados + foto reativa lado a lado num só card)
- Foto de céu reativa ao `icon_key` do backend (clear-day, clear-night, rain, snow, etc — 8 fotos otimizadas em WebP em `frontend/public/sky/`)
- CityClock analógico mini com hora digital "ticando" a cada 30s (referência ao logo da marca)
- Indicador "atualizado há X" com hook `useRelativeTime`
- Botões "Definir como padrão" (persiste cidade favorita em localStorage) e "Compartilhar" (Web Share API + clipboard fallback)
- Toggles `°C/°F · km/h/mph` no rodapé do card (persiste em localStorage via `UnitsContext`)

### Zona 2
- WhatToWearCard com chips de recomendações (guarda-chuva, protetor solar, casaco, etc) + frase italic editorial baseada em condições (regras em `utils/dayMood.js`)
- NextEventCard com contagem regressiva pro próximo evento climático ("Chuva em 0h 49min") ou mensagem amigável quando estável. Usa `utils/nextEvent.js` + hook `useCountdown`
- GoldenHourCard com nascer, pôr, hora dourada e hora azul (manhã + tarde)

### Strip + Zona 3
- HourlyForecast em variant dark (bg-navy + texto cream)
- DailyForecast em variant dark com "Hoje" em itálico sun-orange
- CityMap (Leaflet + CartoDB Dark + pin SVG sun)
- RainTimeline com 12 barras de probabilidade
- Footer editorial com tagline "Seu céu, minuto a minuto."

### Sistema
- React Router DOM com rotas `/c/:slug` por cidade (compartilhável)
- PWA instalável (manifest, service worker via vite-plugin-pwa)
- Skeleton loading + stagger animation cascading ao trocar de cidade
- SearchBar com autocomplete (debounce 250ms, dropdown)
- SearchHistory com chips de cidades recentes
- ErrorState editorial com botão "Tentar de novo"
- OG meta tags + favicon SVG próprio do logo Skytime

## O que falta

### Foco principal pendente: **Light/dark mode**

Decisões pendentes:
1. **Abordagem:** toggle manual (botão no header), seguir sistema (`prefers-color-scheme`), ou combinação (segue sistema com override manual)
2. **Escopo:** dark dos cards claros (light/lightHero do Card.jsx) ou redesign mais profundo?
3. **Aliases CSS:** atualmente o `@theme` em `frontend/src/index.css` tem aliases legados (`--color-ink` aponta pra `--color-navy`, etc). Precisa pensar como dark mode vai mapear esses tokens.
4. **Persistência:** localStorage (chave sugerida: `skytime:theme`)

Trabalho necessário:
- Definir paleta dark complementar (navy escuro → cinza claro? Cream → cinza profundo?)
- Adicionar `dark:` variants em todos os componentes que usam cores
- Toggle UI (botão sol/lua)
- Hook `useTheme` ou Context, similar ao `UnitsContext`

Componentes que precisam de tratamento dark:
- Card.jsx (variants light, lightHero, dark)
- WeatherCard.jsx, HourlyForecast.jsx, GoldenHourCard.jsx, WhatToWearCard.jsx, DailyForecast.jsx, RainTimeline.jsx, NextEventCard.jsx, SearchBar.jsx, SearchHistory.jsx, Footer.jsx, SkeletonDashboard.jsx
- index.css (gradiente do body)

### Polish menor (lista opcional)

- Ícones com variante dia/noite no clima atual e na hourly strip (sol vira lua à noite)
- Lazy load do Leaflet (bundle JS atual ~510KB)
- Divisor "amanhã" entre horas na strip horária
- Footer testar visibilidade
- Teste mobile (estreitar janela < 1024px ou abrir no celular)
- Acessibilidade (foco visível, screen reader)

### Operacional

- Deploy do frontend no Netlify (já tem `netlify.toml` com rewrite SPA + cache configurado)
- Deploy do backend em Railway/Render/Fly.io (precisa decidir; `requirements.txt` e estrutura prontos)
- Setup de domínio próprio (skytime.app ou similar)

## Preferências do usuário (importantes)

- **Português brasileiro** em tudo (commits, comentários, UI)
- **Commits conventional impessoais** (`feat: adiciona X`, `fix: corrige Y`, `refactor: extrai Z`)
- **Sempre `git push` após commit** (repo público, mostra evolução em tempo real)
- **Sem hífens soltos** em textos (usar `:` ou `,`)
- **Sem cara de IA** em texts visíveis ao público (README, footer, tagline)
- **Ritmo lento** após o feedback "20+ commits num dia é muito" — 1 frente por vez, mostrar, perguntar, seguir
- **Não tratar como projeto de portfólio** publicamente — é produto profissional
- **Editar uma frente até confirmação antes de partir pra outra**
- **Não opinar com ideias visuais sem ter sido pedido** — explica trade-offs e deixa o usuário escolher

## Memórias persistidas

Em `~/.claude/projects/C--Users-campo-OneDrive-projetos-skytime/memory/`:

- `MEMORY.md` — índice
- `user_profile.md` — perfil de estudante de ADS aprendendo fullstack
- `project_skytime.md` — visão, roteiro, decisões cronológicas, paleta Hora Dourada original + identidade V1
- `feedback_commits.md` — padrão de commits + volume por sessão
- `feedback_git_push.md` — sempre push após commit
- `feedback_writing_style.md` — sem hífens, sem cara de IA
- `feedback_project_framing.md` — produto profissional, não portfólio

Lê esses arquivos pra recuperar contexto completo do projeto.

## Últimos commits (referência)

```
c9bdcbb  refactor: nexteventcard sempre renderiza com mensagem simples se sem evento
2b6a18c  fix: nexteventcard com fallback solar e threshold menor pra chuva
9763598  fix: nexteventcard nowraining so pelo icone evitando lock em sempre chovendo
1f40b9e  fix: nexteventcard considera precipitation_probability nao so o icone
73cef81  feat: nexteventcard com contagem regressiva pra chuva ou sol
5839819  style: empurra frase do dia pro rodape e equaliza altura dos dois cards
aca29b3  feat: adiciona frase editorial do dia no whattowearcard com regras
144744a  feat: botao compartilhar com web share api e fallback de copiar link
412cd10  feat: rotas por cidade c slug com react router e sync bidirecional
f5f2ffa  feat: toggles de unidades temperatura e vento com persistencia
7946d16  feat: cidade padrao persistida em localstorage com botao no weathercard
```

## Próximo passo concreto

Quando começar a nova sessão, fala algo como:

> "Vamos continuar o projeto Skytime. Lê o HANDOFF.md na raiz e as memórias em ~/.claude/projects/C--Users-campo-OneDrive-projetos-skytime/memory/. Próximo trabalho: implementar light/dark mode (Foco 2 da Fase 7). Quero discutir as opções de abordagem antes de você partir pra código."

Isso garante que a nova sessão pega contexto + começa pela conversa de design da feature, evitando começar codando direto.
