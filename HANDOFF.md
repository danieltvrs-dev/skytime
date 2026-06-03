# Handoff — Skytime

Documento de transferência de contexto entre sessões. Cole isso como primeira mensagem da nova conversa, depois peça pro Claude ler também `~/.claude/projects/C--Users-campo-OneDrive-projetos-skytime/memory/MEMORY.md` (índice das memórias persistidas) e os arquivos referenciados nele.

## Estado do projeto

**Skytime** é um dashboard de clima fullstack em produção contínua. Visualmente segue a **identidade V1 oficial** (paleta Sky Deep / Sky / Sun / Navy / Cream / Sky Soft), com tipografia Fraunces (serif editorial) + Inter (UI) + Outfit (wordmark).

Repositório: <https://github.com/danieltvrs-dev/skytime> (branch `main`).

### Stack

- **Frontend:** React 19, Vite 8, TailwindCSS 4 (tokens semânticos via `@theme` + variant dark via classe), React Router DOM, Axios, Leaflet, vite-plugin-pwa
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

## Fases

```
✓ Fase 1   Setup do projeto
✓ Fase 2   Integração Open-Meteo
✓ Fase 3   Tela de clima atual
✓ Fase 4   Previsão diária e por hora
✓ Fase 4.5 Base do design system
✓ Fase 4.6 Features editoriais (vestir, resumo do dia, hora dourada/azul)
✓ Fase 4.7 Layout desktop em 2 colunas
✓ Fase 5   Busca por cidade + geolocalização
✓ Fase 6   Histórico no PostgreSQL
✓ Fase 6.5 Mapa Leaflet + timeline de chuva
✓ Fase 7   Design pass (fechada em 2026-06-02): identidade V1 + dark mode +
            sidebar + UnitsMenu + auto-refresh + 6 animações + README
● Fase 8   PWA + responsividade + deploy:
            - PWA pronto (manifest + service worker)
            - Falta gravar vídeo demo (planejado pós-deploy)
            - Falta testar responsividade mobile real
            - Falta fazer deploy de frontend + backend
```

## Funcionalidades em produção

### Hero (Zona 1)
- WeatherCard hero unificado (dados + foto reativa lado a lado)
- Foto de céu reativa ao `icon_key` (8 fotos WebP em `frontend/public/sky/`)
- CityClock analógico mini com hora digital ticando a cada 30s, **pulsa âmbar quando auto-refresh roda**
- Indicador "atualizado há X" via hook `useRelativeTime`
- Botões "Definir como padrão" (persiste cidade favorita em localStorage) e "Compartilhar" (Web Share API + clipboard fallback)
- **Temperatura grande anima com `useAnimatedNumber`** ao trocar cidade ou auto-refresh
- **Engrenagem (UnitsMenu)** sobre divisor das stats abre popover com °C/°F + km/h/mph (popover abre pra cima pra evitar overlap)
- Foto do céu **faz fade-in** ao trocar de cidade ou condição

### Zona 2
- WhatToWearCard com chips + frase italic editorial (regras em `utils/dayMood.js`)
- NextEventCard com contagem regressiva (`utils/nextEvent.js` + hook `useCountdown`)
- GoldenHourCard com nascer, pôr, hora dourada e hora azul

### Strip + Zona 3
- HourlyForecast em variant dark
- DailyForecast em variant dark com "Hoje" em italic sun
- CityMap (Leaflet + CartoDB Dark + pin SVG sun). **Pin cai com spring overshoot** ao trocar de cidade
- RainTimeline com 12 barras de probabilidade
- Footer editorial com tagline "Seu céu, minuto a minuto."

### Sidebar (frontend/src/components/Sidebar.jsx)
- Painel lateral esquerdo, slide 300ms, backdrop com blur, fecha por X / ESC / clique fora
- Header: tile do logo + "Skytime" wordmark + subtítulo "PREFERÊNCIAS"
- Seções (com stagger ao abrir):
  - **Tema** com ThemeToggle (pílula sol/lua animada)
  - **Acessibilidade** com Switch "Reduzir animações"
  - **Sobre** com créditos das APIs (Open-Meteo, OpenStreetMap, CARTO) + link do GitHub
- Footer interno: "Skytime" italic + tagline + "v1.0 · ano"

### Sistema
- React Router DOM com rotas `/c/:slug` por cidade (compartilhável)
- PWA instalável (manifest, service worker via vite-plugin-pwa)
- **Auto-refresh silencioso a cada 5 minutos** (pausa quando aba escondida, refaz ao voltar se passou metade do intervalo, erros silenciosos)
- **Dashboard mantida montada durante transições** entre cidades (skeleton só no primeiro carregamento, transições suaves)
- SearchBar com autocomplete (debounce 250ms), sugestões empilhadas verticalmente (nome em linha cheia + região), spinner discreto quando carrega
- SearchHistory com chips de cidades recentes (em texto, inline abaixo da search)
- ErrorState editorial
- OG meta tags + favicon SVG corrigido conforme design oficial (path da nuvem em curva Bézier, ponteiros corretos, sol cream)
- **Hover lift em todos os cards** (200ms transform + shadow)

### Tema (Dark Mode)
- ThemeContext com persistência em localStorage chave `skytime:theme`
- Default light, não segue OS (decisão de produto)
- Classe `.dark` aplicada no `<html>` quando dark ativo
- Body gradient transiciona em 400ms entre sky-soft→navy (light) e navy→quase-preto (dark)
- Tokens semânticos no `@theme` mudam por modo: `surface`, `surface-hero`, `surface-deep`, `text`, `text-soft`, `border`, `body-top`, `body-bottom`
- Aliases legados ressignificados (`ink`→text, `paper`→surface, `graphite`→surface-deep)
- Cores de marca fixas em ambos modos (sky-deep, sky, sun, navy, cream, sky-soft)

### Acessibilidade
- MotionContext + classe `.reduce-motion` no html + toggle na sidebar
- Animações respeitam `prefers-reduced-motion` do OS E o toggle manual
- ARIA em pontos chave (role="switch", aria-checked, aria-expanded, aria-haspopup, role="menu")

## Contextos e providers (`frontend/src/contexts/`)

- **ThemeContext** — light/dark + persistência + classe `.dark`
- **MotionContext** — reduceMotion + persistência + classe `.reduce-motion`
- **UnitsContext** — tempUnit (C/F) + windUnit (kmh/mph) + persistência

Hierarquia em `main.jsx`: ThemeProvider → MotionProvider → UnitsProvider → App.

## Hooks customizados (`frontend/src/hooks/`)

- `useAnimatedNumber(target, duration)` — interpola float entre frames com requestAnimationFrame, respeita reduce-motion
- `useCountdown(target, current, fetchedAt)` — contagem regressiva pra próximo evento climático
- `useDefaultCity()` — cidade padrão persistida em localStorage
- `useGeolocation()` — geo do browser com gestão de loading/erro
- `useLiveCityTime(baseTime, fetchedAt)` — hora local ticando a cada 30s
- `useRelativeTime(timestamp)` — "atualizado há X minutos"

## O que ainda falta

### Antes do deploy
- **Vídeo demo** (15-20s, MP4) mostrando dashboard + dark mode + animações + sidebar. Gravar APÓS deploy pra mostrar URL real `skytime.app`. Salvar em `docs/demo.mp4`, embedar via `<video>` tag no README.
- **Testar responsividade mobile** real (estreitar < 1024px + abrir no celular). Provavelmente alguns ajustes finos no header ou cards.

### Deploy operacional

**Caminho decidido (zero custo, sem cartão):**

- **Frontend:** Netlify free. `netlify.toml` na raiz já configurado (rewrite SPA + cache). Setar env var `VITE_API_URL` apontando pra URL do backend Render.
- **Backend:** Render free (web service Python). Roda `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Env vars: `DATABASE_URL` (driver asyncpg) e `ALLOWED_ORIGINS=https://skytime.netlify.app` (ou domínio próprio). Rodar `alembic upgrade head` no shell deles uma vez após primeiro deploy.
- **Banco:** Neon free (Postgres serverless). Cria projeto, copia connection string, cola no `DATABASE_URL` do backend (precisa do prefixo `postgresql+asyncpg://`, não `postgresql://`).
- **Keep-alive:** Render free dorme após 15min de inatividade (cold start de ~30s na próxima requisição). Configurar **cron-job.org** ou **UptimeRobot** pingando `https://skytime-api.onrender.com/health` (ou rota equivalente) a cada 14 minutos pra evitar o sleep. Esse hack é gray area no TOS do Render mas amplamente usado pela comunidade sem repercussão prática.
- **Domínio (opcional):** subdomínio Netlify free (`skytime.netlify.app`) basta pra começar. Se quiser domínio próprio (`skytime.app`), R$50-80/ano, aponta DNS pro Netlify.

**Por que esse caminho:**
- Zero risco de cobrança surpresa (sem cartão exigido em nenhum dos 3)
- Mantém o stack fullstack completo (vale o trabalho do Docker + Postgres + Alembic + FastAPI investidos)
- Keep-alive resolve o cold start, então visitante não vê 30s de espera
- Trade-off aceito: viola TOS leve do Render. Risco prático baixo.

**Ordem de execução:**
1. Criar Postgres no Neon → copiar connection string
2. Criar backend no Render → conectar repo → setar env vars → deploy → rodar alembic
3. Criar site no Netlify → conectar repo → setar `VITE_API_URL` → deploy
4. Cadastrar URL do backend no cron-job.org com ping a cada 14min
5. Testar tudo end-to-end (busca, geolocalização, histórico, dark mode, share)
6. Gravar vídeo demo (com URL real) → adicionar ao README via `<video>` tag

### Features v2 (pendentes na task list, planejadas mas não implementadas)
- **Task 13:** Formato de hora 12h/24h — extender UnitsContext com `hourFormat`, atualizar `formatHour` e componentes (CityClock, HourlyForecast, GoldenHourCard, RainTimeline)
- **Task 14:** Frase editorial do dia (mood) na sidebar — App.jsx passa daily[0] como prop, Sidebar mostra `getDayMood(today)` italic
- Comparação com ontem
- Sparkline de tendência
- Notificação de chuva

### Polish menor (opcional)
- Ícones com variante dia/noite (sol vira lua à noite)
- Lazy load do Leaflet (bundle JS ~510KB)
- Divisor "amanhã" entre horas na strip horária
- Cores diferentes pro ponteiro de horas do CityClock (hoje sky-deep, pouco contraste no dark)
- Variantes de logo pra outros fundos (cream tile sobre sky-deep bg, navy bg com sun mark, etc — design oficial mostra na página "Sobre qualquer base")

## Preferências do usuário (importantes)

- **Português brasileiro** em tudo (commits, comentários, UI)
- **Commits conventional impessoais** (`feat: adiciona X`, `fix: corrige Y`, `refactor: extrai Z`)
- **Sempre `git push` após commit** (repo público, mostra evolução em tempo real)
- **Sem hífens soltos** em textos (usar `:` ou `,`)
- **Sem cara de IA** em textos visíveis ao público (README, footer, tagline)
- **Ritmo lento:** 1 frente por vez, mostrar, perguntar, seguir. 1 commit por mudança lógica.
- **Não tratar como projeto de portfólio** publicamente — é produto profissional
- **Editar uma frente até confirmação antes de partir pra outra**
- **Não opinar com ideias visuais sem ter sido pedido** — explica trade-offs e deixa o usuário escolher

## Memórias persistidas

Em `~/.claude/projects/C--Users-campo-OneDrive-projetos-skytime/memory/`:

- `MEMORY.md` — índice
- `user_profile.md` — perfil de estudante de ADS aprendendo fullstack
- `project_skytime.md` — visão, roteiro, decisões cronológicas, identidade V1, paleta, dark mode, sidebar, animações
- `feedback_commits.md` — padrão de commits + volume por sessão
- `feedback_git_push.md` — sempre push após commit
- `feedback_writing_style.md` — sem hífens, sem cara de IA
- `feedback_project_framing.md` — produto profissional, não portfólio

## Últimos commits (referência da sessão 2026-06-02)

```
eaeeb3c  docs: remove secao de deploy do readme
3368e8c  docs: troca header do readme por banner com browser e phone mockup
26b359e  docs: reescreve readme com identidade visual recursos atualizados e setup
9e146c3  feat: foto do ceu faz fade-in quando troca de cidade ou condicao
148e22c  feat: pin do mapa cai com leve overshoot ao trocar de cidade
1618a18  feat: secoes da sidebar entram em cascata ao abrir
a873020  fix: empilha nome e regiao nas sugestoes pra mostrar nome cheio
45458b0  feat: spinner na searchbar enquanto busca dados da cidade nova
dbfabe6  fix: mantem dashboard montada durante transicoes pra animacoes rodarem
06e278b  feat: numero da temperatura anima ao trocar cidade ou atualizar
501f303  feat: adiciona pulse no cityclock quando dados atualizam
0f6efbc  feat: adiciona hover lift nos cards
6b4e79b  feat: adiciona auto-refresh silencioso a cada 5 minutos
1b48e8b  feat: adiciona toggle de reduzir animacoes na sidebar
3a97a24  feat: adiciona logo no topo da sidebar e versao no rodape
1591640  feat: adiciona secao sobre e tagline editorial na sidebar
ebfacaf  fix: popover do unitsmenu abre pra cima evitando overlap com card vizinho
a05b10a  feat: substitui toggles de unidades por menu de engrenagem sobre o divisor
959dae5  feat: ativa dark mode com contexto tokens semanticos e persistencia
```

(40+ commits na sessão, esses são os mais marcantes.)

## Próximo passo concreto

Quando começar a nova sessão, fala algo como:

> "Vamos continuar o projeto Skytime. Lê o HANDOFF.md na raiz e as memórias em ~/.claude/projects/C--Users-campo-OneDrive-projetos-skytime/memory/. Próximo trabalho: fazer o deploy (Fase 8). Quero testar responsividade mobile antes."

Ou se quiser ir pra outra frente:

> "...Próximo trabalho: testar responsividade mobile. Estreita a tela, abre devtools, vê se quebra alguma coisa."

Ou:

> "...Próximo trabalho: gravar vídeo demo. Vou rodar local agora, fazer captura de tela, e a gente integra no README."
