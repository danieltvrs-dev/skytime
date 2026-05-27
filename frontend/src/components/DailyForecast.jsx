import { getWeatherIcon } from '../utils/weatherIcons'
import { formatDailyLabel } from '../utils/dateFormat'

/**
 * Previsão dos próximos dias — Zona 3 (editorial) da jornada.
 * Card sólido escuro (ink sobre graphite do fundo), texto paper.
 * Densidade editorial: linhas separadas por divisores sutis, máxima com mais peso que mínima.
 */
export default function DailyForecast({ daily }) {
  return (
    <section className="rounded-3xl p-6 bg-ink text-paper border border-paper/10 shadow-md">
      <h3 className="text-[11px] font-medium text-paper/50 mb-5 tracking-[0.14em] uppercase">
        Próximos dias
      </h3>
      <ul className="divide-y divide-paper/10">
        {daily.map((day, index) => (
          <DailyRow key={day.date} day={day} isToday={index === 0} />
        ))}
      </ul>
    </section>
  )
}

function DailyRow({ day, isToday }) {
  const Icon = getWeatherIcon(day.icon)
  const label = isToday ? 'Hoje' : formatDailyLabel(day.date)

  return (
    <li className="flex items-center gap-4 py-3.5">
      <span
        className={`w-20 text-sm ${
          isToday ? 'font-serif italic text-amber' : 'font-medium text-paper'
        }`}
      >
        {label}
      </span>
      <Icon
        className="w-6 h-6 shrink-0 text-paper/80"
        strokeWidth={1.5}
        aria-label={day.description}
      />
      <span className="flex-1" />
      <span className="text-sm tabular-nums">
        <span className="font-medium text-paper">
          {Math.round(day.temperature_max)}°
        </span>
        <span className="text-paper/50 ml-3">
          {Math.round(day.temperature_min)}°
        </span>
      </span>
    </li>
  )
}
