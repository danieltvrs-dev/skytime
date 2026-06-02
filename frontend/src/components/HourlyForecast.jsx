import Card from './Card'
import SectionLabel from './SectionLabel'
import { useUnits } from '../contexts/UnitsContext'
import { formatHour } from '../utils/dateFormat'
import { formatTemp } from '../utils/units'
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
    <Card as="section" variant="dark" className="px-6 py-4">
      <SectionLabel tone="dark" className="mb-3">Próximas horas</SectionLabel>
      <div className="overflow-x-auto -mx-6 px-6 pb-1">
        <ul className="flex gap-5 min-w-fit">
          {next.map((hour, index) => (
            <HourPoint key={hour.time} hour={hour} isNow={index === 0} />
          ))}
        </ul>
      </div>
    </Card>
  )
}

function HourPoint({ hour, isNow }) {
  const Icon = getWeatherIcon(hour.icon)
  const label = isNow ? 'Agora' : formatHour(hour.time)
  const { tempUnit } = useUnits()

  return (
    <li className="flex flex-col items-center min-w-12 gap-1.5">
      <span
        className={`text-xs tabular-nums ${
          isNow ? 'text-amber font-medium' : 'text-cream/55'
        }`}
      >
        {label}
      </span>
      <Icon
        className="w-5 h-5 text-cream/75"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-cream tabular-nums">
        {formatTemp(hour.temperature, tempUnit)}°
      </span>
    </li>
  )
}
