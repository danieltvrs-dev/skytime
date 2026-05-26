import { getWeatherIcon } from '../utils/weatherIcons'
import { formatDailyLabel } from '../utils/dateFormat'

/**
 * Lista vertical com a previsão dos próximos dias.
 * Espera o array `daily` no formato vindo do backend, onde daily[0] é hoje.
 */
export default function DailyForecast({ daily }) {
  return (
    <section className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white">
      <h3 className="text-xs font-medium text-white/70 mb-4 uppercase tracking-wider">
        Próximos dias
      </h3>
      <ul className="divide-y divide-white/10">
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
    <li className="flex items-center gap-4 py-3">
      <span className="w-20 font-medium text-sm">{label}</span>
      <Icon
        className="w-6 h-6 shrink-0"
        strokeWidth={1.5}
        aria-label={day.description}
      />
      <span className="flex-1" />
      <span className="text-sm tabular-nums">
        <span className="font-medium">{Math.round(day.temperature_max)}°</span>
        <span className="text-white/60 ml-3">{Math.round(day.temperature_min)}°</span>
      </span>
    </li>
  )
}
