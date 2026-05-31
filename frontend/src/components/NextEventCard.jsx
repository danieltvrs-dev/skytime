import { CloudRain, CloudSun, Sunrise, Sun, Sunset, Zap } from 'lucide-react'
import Card from './Card'
import SectionLabel from './SectionLabel'
import { useCountdown } from '../hooks/useCountdown'
import { getNextSolarEvent, getNextWeatherEvent } from '../utils/nextEvent'

/**
 * Card pequeno com contagem regressiva pro próximo evento.
 * Prioriza eventos climáticos (chuva/sol/trovoada); na ausência, cai no
 * próximo marco solar (pôr ou nascer do sol) — sempre tem um.
 */
export default function NextEventCard({
  hourly,
  currentTime,
  currentIcon,
  fetchedAt,
  today,
  tomorrow,
}) {
  const weatherEvent = getNextWeatherEvent(hourly, currentTime, currentIcon)
  const solarEvent = getNextSolarEvent(today, tomorrow, currentTime)
  const event = weatherEvent || solarEvent

  const countdown = useCountdown(event?.targetTime, currentTime, fetchedAt)

  if (!event || !countdown) return null

  const { icon: EventIcon, label } = describeEvent(event.type)
  const hh = String(countdown.hours).padStart(2, '0')
  const mm = String(countdown.minutes).padStart(2, '0')

  return (
    <Card as="section" className="p-6">
      <SectionLabel className="mb-4">Próximo evento</SectionLabel>

      <div className="flex items-center gap-4">
        <EventIcon
          className="w-10 h-10 text-amber shrink-0"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <div>
          <p className="font-serif italic text-ink/70 text-sm leading-tight">
            {label} em aproximadamente
          </p>
          <p className="font-serif text-ink text-3xl tabular-nums leading-tight mt-1">
            {hh}h {mm}min
          </p>
        </div>
      </div>
    </Card>
  )
}

function describeEvent(type) {
  switch (type) {
    case 'rain':
      return { icon: CloudRain, label: 'Chuva' }
    case 'storm':
      return { icon: Zap, label: 'Trovoada' }
    case 'sun':
      return { icon: Sun, label: 'Sol' }
    case 'dry':
      return { icon: CloudSun, label: 'Tempo seco' }
    case 'sunset':
      return { icon: Sunset, label: 'Pôr do sol' }
    case 'sunrise':
      return { icon: Sunrise, label: 'Nascer do sol' }
    default:
      return { icon: CloudSun, label: 'Próximo evento' }
  }
}
