import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 flex flex-col items-center px-4 py-12">
      <main className="w-full max-w-md">
        <h1 className="text-white text-3xl font-bold mb-6 tracking-tight">
          Skytime
        </h1>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} />}
        {data && !loading && !error && (
          <WeatherCard location={data.location} current={data.current} />
        )}
      </main>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-white/80 flex items-center justify-center gap-3">
      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      <span>Carregando clima...</span>
    </div>
  )
}

function ErrorState({ error }) {
  // FastAPI devolve { detail: "..." } em HTTPException; axios coloca em response.data.
  // Se nem chegou no servidor (rede, CORS, timeout), cai em error.message.
  const detail = error.response?.data?.detail || error.message || 'Erro desconhecido'

  return (
    <div className="bg-red-500/20 backdrop-blur-md rounded-3xl p-8 border border-red-400/40 text-white">
      <p className="font-medium">Não foi possível carregar o clima.</p>
      <p className="text-white/80 text-sm mt-2">{detail}</p>
    </div>
  )
}

export default App
