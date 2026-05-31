import { useEffect, useState } from 'react'
import { CloudOff, RotateCw } from 'lucide-react'

import Card from './components/Card'
import CityMap from './components/CityMap'
import DailyForecast from './components/DailyForecast'
import Footer from './components/Footer'
import GoldenHourCard from './components/GoldenHourCard'
import HourlyForecast from './components/HourlyForecast'
import RainTimeline from './components/RainTimeline'
import SearchBar from './components/SearchBar'
import SearchHistory from './components/SearchHistory'
import SkeletonDashboard from './components/SkeletonDashboard'
import WeatherCard from './components/WeatherCard'
import WhatToWearCard from './components/WhatToWearCard'
import { useGeolocation } from './hooks/useGeolocation'
import {
  deleteHistoryEntry,
  getHistory,
  getWeather,
  getWeatherByCoords,
} from './services/weather'
import { buildDailySummary } from './utils/dailySummary'

const DEFAULT_QUERY = { type: 'city', value: 'São Paulo' }

function App() {
  // query.type: 'city' (busca por nome) ou 'coords' (geolocalização).
  // Um useEffect decide qual endpoint chamar baseado nisso.
  const [query, setQuery] = useState(DEFAULT_QUERY)
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

  const handleSearch = (cityName) => {
    setQuery({ type: 'city', value: cityName })
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
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
          Skytime
        </h1>
      </header>

      <SearchBar
        onSearch={handleSearch}
        onUseLocation={handleUseLocation}
        isLocating={geo.loading}
      />

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
        <Dashboard data={data} fetchedAt={fetchedAt} />
      )}
    </main>
  )
}

function Dashboard({ data, fetchedAt }) {
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
        />

        {/* Resumo do dia em mobile (no desktop ele vive dentro do WeatherCard). */}
        {summary && (
          <p className="lg:hidden font-serif italic text-ink/75 text-lg tracking-tight leading-snug -mt-2 px-1">
            {summary}
          </p>
        )}

        {/* Zona 2: features editoriais lado a lado em desktop. */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <WhatToWearCard today={data.daily[0]} />
          <GoldenHourCard today={data.daily[0]} />
        </div>

        {/* Strip horária + previsão dos próximos dias. */}
        <HourlyForecast hourly={data.hourly} currentTime={data.current.time} />
        <DailyForecast daily={data.daily} />
      </div>

      {/* Zona 3 (editorial dark): estável entre buscas pra o Leaflet não
       * re-inicializar. A nova posição é animada pelo próprio mapa via setView. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
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
