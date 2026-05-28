import { Droplets, Thermometer, Wind } from 'lucide-react'
import { getWeatherIcon } from '../utils/weatherIcons'
import { useRelativeTime } from '../hooks/useRelativeTime'

/**
 * Card do clima atual — Zona 1 da jornada Hora Dourada.
 * Tom atmosférico, base clara, tipografia editorial (Fraunces no número grande).
 *
 * Props:
 *   location:  { name, country, admin1?, ... }
 *   current:   { temperature, apparent_temperature, humidity, wind_speed, description, icon }
 *   fetchedAt: timestamp (ms) de quando o frontend recebeu esses dados
 */
export default function WeatherCard({ location, current, fetchedAt }) {
  const Icon = getWeatherIcon(current.icon)
  const region = location.admin1
    ? `${location.admin1}, ${location.country}`
    : location.country
  const relativeTime = useRelativeTime(fetchedAt)

  return (
    <article className="rounded-3xl p-8 bg-white/55 backdrop-blur-sm border border-ink/5 shadow-sm">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-ink leading-none tracking-tight">
            {location.name}
          </h2>
          <p className="text-ink/55 text-sm mt-1.5">{region}</p>
        </div>
        <Icon
          className="w-14 h-14 shrink-0 text-ink/75"
          strokeWidth={1.25}
          aria-hidden="true"
        />
      </header>

      <div className="mb-8">
        <p className="font-serif text-ink tracking-tight leading-none text-8xl lg:text-9xl">
          {Math.round(current.temperature)}
          <span className="text-amber">°</span>
        </p>
        <p className="text-ink/70 mt-3 text-base">{current.description}</p>
        {relativeTime && (
          <p className="text-ink/40 text-xs mt-2">
            atualizado {relativeTime}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-3 gap-4 pt-6 border-t border-ink/10">
        <Stat
          icon={Thermometer}
          label="Sensação"
          value={`${Math.round(current.apparent_temperature)}°`}
        />
        <Stat
          icon={Droplets}
          label="Umidade"
          value={`${current.humidity}%`}
        />
        <Stat
          icon={Wind}
          label="Vento"
          value={`${Math.round(current.wind_speed)} km/h`}
        />
      </dl>
    </article>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <Icon className="w-4 h-4 text-ink/45" strokeWidth={1.5} aria-hidden="true" />
      <dt className="text-ink/55 text-[11px] uppercase tracking-wider">{label}</dt>
      <dd className="font-medium text-ink tabular-nums">{value}</dd>
    </div>
  )
}
