import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { CloudOff, RotateCw } from 'lucide-react'

import Card from './components/Card'
import CityMap from './components/CityMap'
import DailyForecast from './components/DailyForecast'
import Footer from './components/Footer'
import GoldenHourCard from './components/GoldenHourCard'
import HourlyForecast from './components/HourlyForecast'
import NextEventCard from './components/NextEventCard'
import RainTimeline from './components/RainTimeline'
import SearchBar from './components/SearchBar'
import SearchHistory from './components/SearchHistory'
import SkeletonDashboard from './components/SkeletonDashboard'
import WeatherCard from './components/WeatherCard'
import WhatToWearCard from './components/WhatToWearCard'
import { useDefaultCity } from './hooks/useDefaultCity'
import { useGeolocation } from './hooks/useGeolocation'
import {
  deleteHistoryEntry,
  getHistory,
  getWeather,
  getWeatherByCoords,
} from './services/weather'
import { buildDailySummary } from './utils/dailySummary'
import { deslugify, slugify } from './utils/slug'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Skytime />} />
      <Route path="/c/:slug" element={<Skytime />} />
    </Routes>
  )
}

function Skytime() {
  const { slug } = useParams()
  const navigate = useNavigate()
  // Cidade padrão persistida em localStorage. Se nunca foi setada,
  // cai em "São Paulo" como fallback.
  const [defaultCity, setDefaultCity] = useDefaultCity()
  // query.type: 'city' (busca por nome) ou 'coords' (geolocalização).
  // Um useEffect decide qual endpoint chamar baseado nisso.
  const [query, setQuery] = useState(() => ({
    type: 'city',
    value: slug ? deslugify(slug) : defaultCity,
  }))
  // Rastreia o slug visto na última sincronização pra não reagir
  // quando o slug não mudou de fato.
  const lastSlugRef = useRef(slug)
  const [data, setData] = useState(null)
  const [fetchedAt, setFetchedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  // Incrementa toda vez que o histórico precisa ser revalidado.
  const [historyVersion, setHistoryVersion] = useState(0)
  const geo = useGeolocation()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const promise =
      query.type === 'city'
        ? getWeather(query.value)
        : getWeatherByCoords(query.value.lat, query.value.lon)

    promise
      .then((d) => {
        if (!cancelled) {
          setData(d)
          setFetchedAt(Date.now())
          setHistoryVersion((v) => v + 1)
        }
      })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query])

  // Sincroniza slug da URL pro query. Quando o usuário navega (search,
  // chip do histórico, back/forward), a URL muda e este efeito puxa o
  // novo estado. Geolocalização não passa por aqui — atualiza query direto.
  useEffect(() => {
    if (slug === lastSlugRef.current) return
    lastSlugRef.current = slug
    setQuery({
      type: 'city',
      value: slug ? deslugify(slug) : defaultCity,
    })
  }, [slug, defaultCity])

  // Re-tentar é só forçar uma nova referência de `query` pra reexecutar o useEffect.
  // Mais simples que um state separado só pra incrementar contador.
  const handleRetry = () => setQuery((prev) => ({ ...prev }))

  useEffect(() => {
    let cancelled = false
    getHistory()
      .then((h) => { if (!cancelled) setHistory(h) })
      .catch(() => { /* histórico é best-effort, falha silenciosa */ })
    return () => { cancelled = true }
  }, [historyVersion])

  // Busca por cidade navega pra /c/slug; o useEffect de slug atualiza query.
  // Mantém o histórico do browser funcionando (back/forward).
  const handleSearch = (cityName) => {
    navigate(`/c/${slugify(cityName)}`)
  }

  const handleUseLocation = async () => {
    try {
      const coords = await geo.getLocation()
      setQuery({ type: 'coords', value: coords })
    } catch (geoError) {
      // Erros do hook (permissão negada, timeout, etc.) entram no estado geral
      // pra usar o mesmo ErrorState que erros de rede.
      setError(geoError)
    }
  }

  // "Definir cidade atual como padrão" — usa o nome resolvido pelo backend
  // (vai ser o que o geocoding decidiu, mesmo se o usuário digitou variantes).
  const handleSetDefaultCity = () => {
    if (data?.location?.name) setDefaultCity(data.location.name)
  }

  const handleDeleteHistoryEntry = async (id) => {
    try {
      await deleteHistoryEntry(id)
    } catch {
      /* silencioso; pior caso, o item reaparece na próxima carga */
    }
    setHistoryVersion((v) => v + 1)
  }

  return (
    <main className="mx-auto max-w-6xl px-5 lg:px-8 py-10 space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink shrink-0">
          Skytime
        </h1>
        <SearchBar
          onSearch={handleSearch}
          onUseLocation={handleUseLocation}
          isLocating={geo.loading}
        />
      </header>

      <SearchHistory
        entries={history}
        onSelectCity={handleSearch}
        onDelete={handleDeleteHistoryEntry}
      />

      {loading && <SkeletonDashboard />}
      {error && !loading && (
        <ErrorState error={error} onRetry={handleRetry} />
      )}
      {data && !loading && !error && (
        <Dashboard
          data={data}
          fetchedAt={fetchedAt}
          isDefaultCity={data.location.name === defaultCity}
          onSetDefault={handleSetDefaultCity}
        />
      )}
    </main>
  )
}

function Dashboard({ data, fetchedAt, isDefaultCity, onSetDefault }) {
  // Frase editorial sobre o dia inteiro, reutilizada em dois lugares
  // (no AtmosphericPanel em desktop e como texto solto em mobile).
  // Função pura síncrona barata; useMemo aqui só somava cerimônia.
  const summary = buildDailySummary(data.hourly, data.daily[0])
  // Key isolada no wrapper das seções animadas: ao trocar de cidade,
  // só essa subárvore remonta (e reexecuta o stagger). O CityMap fica
  // FORA, preservando a instância do Leaflet entre buscas.
  const animationKey = `${data.location.name}-${data.location.latitude}`

  return (
    <div className="space-y-8">
      <div className="animate-stagger space-y-8" key={animationKey}>
        {/* Zona 1: hero card único (dados + foto reativa). */}
        <WeatherCard
          location={data.location}
          current={data.current}
          today={data.daily[0]}
          summary={summary}
          fetchedAt={fetchedAt}
          isDefaultCity={isDefaultCity}
          onSetDefault={onSetDefault}
        />

        {/* Resumo do dia em mobile (no desktop ele vive dentro do WeatherCard). */}
        {summary && (
          <p className="lg:hidden font-serif italic text-ink/75 text-lg tracking-tight leading-snug -mt-2 px-1">
            {summary}
          </p>
        )}

        {/* Zona 2: features editoriais.
         * Coluna esquerda tem dois cards empilhados (vestir + próximo evento),
         * coluna direita tem o GoldenHourCard (mais alto). As duas colunas
         * estiram juntas pra manter equilíbrio. */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <WhatToWearCard today={data.daily[0]} />
            <NextEventCard
              hourly={data.hourly}
              currentTime={data.current.time}
              currentIcon={data.current.icon}
              fetchedAt={fetchedAt}
              today={data.daily[0]}
              tomorrow={data.daily[1]}
            />
          </div>
          <GoldenHourCard today={data.daily[0]} />
        </div>

        {/* Strip horária + previsão dos próximos dias. */}
        <HourlyForecast hourly={data.hourly} currentTime={data.current.time} />
        <DailyForecast daily={data.daily} />
      </div>

      {/* Zona 3 (editorial dark): mapa pesa mais visualmente, então recebe
       * 60% da largura (3fr) contra 40% (2fr) do gráfico de chuva.
       * Estável entre buscas pra o Leaflet não re-inicializar — a nova posição
       * é animada pelo próprio mapa via setView. */}
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        <CityMap
          latitude={data.location.latitude}
          longitude={data.location.longitude}
          cityName={data.location.name}
        />
        <RainTimeline
          hourly={data.hourly}
          currentTime={data.current.time}
        />
      </div>

      <Footer />
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  // FastAPI devolve { detail: "..." } em HTTPException; axios coloca em response.data.
  const detail = error.response?.data?.detail || error.message || 'Erro desconhecido'

  return (
    <Card
      variant="lightHero"
      className="p-10 flex flex-col items-center text-center max-w-lg mx-auto"
    >
      <CloudOff
        className="w-12 h-12 text-ink/30 mb-5"
        strokeWidth={1.25}
        aria-hidden="true"
      />
      <p className="font-serif italic text-2xl text-ink/80 leading-snug">
        O céu não respondeu.
      </p>
      <p className="text-ink/60 text-sm mt-3 max-w-sm">{detail}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm font-medium hover:bg-ink/85 transition"
        >
          <RotateCw className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          Tentar de novo
        </button>
      )}
    </Card>
  )
}

export default App
