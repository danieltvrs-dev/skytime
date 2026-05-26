import { formatHour } from '../utils/dateFormat'
import { getWeatherIcon } from '../utils/weatherIcons'

const HOURS_TO_SHOW = 24

/**
 * Tira horizontal com a previsão das próximas N horas, contadas a partir
 * de `currentTime` (que vem do `current.time` do backend, no fuso da cidade).
 */
export default function HourlyForecast({ hourly, currentTime }) {
  const startIndex = Math.max(0, hourly.findIndex((h) => h.time === currentTime))
  const next = hourly.slice(startIndex, startIndex + HOURS_TO_SHOW)

  return (
    <section className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white">
      <h3 className="text-xs font-medium text-white/70 mb-4 uppercase tracking-wider">
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
    <li className="flex flex-col items-center min-w-12">
      <span className="text-xs text-white/70 mb-2 tabular-nums">{label}</span>
      <Icon className="w-6 h-6 mb-2" strokeWidth={1.5} aria-hidden="true" />
      <span className="font-medium tabular-nums">{Math.round(hour.temperature)}°</span>
    </li>
  )
}
