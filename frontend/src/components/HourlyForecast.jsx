import { formatHour } from '../utils/dateFormat'
import { getWeatherIcon } from '../utils/weatherIcons'

const HOURS_TO_SHOW = 24

/**
 * Tira horizontal das próximas 24 horas — Zona 2 (transição) da jornada.
 * Card translúcido claro que vive no gradiente cream → sand.
 */
export default function HourlyForecast({ hourly, currentTime }) {
  const startIndex = Math.max(
    0,
    hourly.findIndex((h) => h.time === currentTime),
  )
  const next = hourly.slice(startIndex, startIndex + HOURS_TO_SHOW)

  return (
    <section className="rounded-3xl px-6 py-4 bg-white/45 backdrop-blur-sm border border-ink/5 shadow-sm">
      <h3 className="text-[11px] font-medium text-ink/55 mb-3 tracking-[0.14em] uppercase">
        Próximas horas
      </h3>
      <div className="overflow-x-auto -mx-6 px-6 pb-1">
        <ul className="flex gap-5 min-w-fit">
          {next.map((hour, index) => (
            <HourPoint key={hour.time} hour={hour} isNow={index === 0} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function HourPoint({ hour, isNow }) {
  const Icon = getWeatherIcon(hour.icon)
  const label = isNow ? 'Agora' : formatHour(hour.time)

  return (
    <li className="flex flex-col items-center min-w-12 gap-1.5">
      <span
        className={`text-xs tabular-nums ${
          isNow ? 'text-amber font-medium' : 'text-ink/55'
        }`}
      >
        {label}
      </span>
      <Icon
        className="w-5 h-5 text-ink/75"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-ink tabular-nums">
        {Math.round(hour.temperature)}°
      </span>
    </li>
  )
}
