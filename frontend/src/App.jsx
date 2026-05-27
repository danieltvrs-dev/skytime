import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import AtmosphericPanel from './components/AtmosphericPanel'
import DailyForecast from './components/DailyForecast'
import HourlyForecast from './components/HourlyForecast'
import WeatherCard from './components/WeatherCard'
import { getWeather } from './services/weather'

const DEFAULT_CITY = 'São Paulo'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getWeather(DEFAULT_CITY)
      .then((d) => { if (!cancelled) setData(d) })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-5 lg:px-8 py-10 space-y-8">
      <header>
        <h1 className="font-serif text-4xl tracking-tight text-ink">Skytime</h1>
      </header>

      {loading && <LoadingState />}
      {error && !loading && <ErrorState error={error} />}
      {data && !loading && !error && (
        <>
          {/* Zona 1: WeatherCard + AtmosphericPanel lado a lado em desktop. */}
          <div className="grid gap-6 lg:grid-cols-2">
            <WeatherCard location={data.location} current={data.current} />
            <AtmosphericPanel location={data.location} current={data.current} />
          </div>

          {/* Zonas 2 e 3: full-width abaixo, descem no gradiente. */}
          <HourlyForecast hourly={data.hourly} currentTime={data.current.time} />
          <DailyForecast daily={data.daily} />
        </>
      )}
    </main>
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
