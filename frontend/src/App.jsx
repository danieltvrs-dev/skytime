import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'

import AtmosphericPanel from './components/AtmosphericPanel'
import CityMap from './components/CityMap'
import DailyForecast from './components/DailyForecast'
import Footer from './components/Footer'
import GoldenHourCard from './components/GoldenHourCard'
import HourlyForecast from './components/HourlyForecast'
import RainTimeline from './components/RainTimeline'
import SearchBar from './components/SearchBar'
import SearchHistory from './components/SearchHistory'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  // Incrementa toda vez que o histórico precisa ser revalidado
  // (carga inicial, após nova busca, após delete).
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
          // Backend registrou a busca; pede pro histórico se atualizar.
          setHistoryVersion((v) => v + 1)
        }
      })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query])

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
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        <h1 className="font-serif text-4xl tracking-tight text-ink shrink-0">
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

      {loading && <LoadingState />}
      {error && !loading && <ErrorState error={error} />}
      {data && !loading && !error && <Dashboard data={data} />}
    </main>
  )
}

function Dashboard({ data }) {
  // Frase editorial sobre o dia inteiro, reutilizada em dois lugares
  // (no AtmosphericPanel em desktop e como texto solto em mobile).
  const summary = useMemo(
    () => buildDailySummary(data.hourly, data.daily[0]),
    [data],
  )

  return (
    <>
      {/* Zona 1: WeatherCard + AtmosphericPanel lado a lado em desktop. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <WeatherCard location={data.location} current={data.current} />
        <AtmosphericPanel current={data.current} summary={summary} />
      </div>

      {/* Resumo do dia em mobile (no desktop ele vive dentro do AtmosphericPanel). */}
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

      {/* Zona 3 (editorial dark): mapa da cidade + timeline de chuva. */}
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
    </>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center gap-3 text-ink/60">
      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      <span>Carregando clima...</span>
    </div>
  )
}

function ErrorState({ error }) {
  // FastAPI devolve { detail: "..." } em HTTPException; axios coloca em response.data.
  const detail = error.response?.data?.detail || error.message || 'Erro desconhecido'

  return (
    <div className="rounded-2xl p-6 bg-ink/5 border border-ink/10">
      <p className="font-medium text-ink">Não foi possível carregar o clima.</p>
      <p className="text-ink/60 text-sm mt-2">{detail}</p>
    </div>
  )
}

export default App
