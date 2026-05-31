import { Droplets, Thermometer, Wind } from 'lucide-react'
import Card from './Card'
import CityClock from './CityClock'
import { getWeatherIcon } from '../utils/weatherIcons'
import { useRelativeTime } from '../hooks/useRelativeTime'

/**
 * Hero da Zona 1 — Skytime.
 * Card único com dados à esquerda e foto reativa ao clima à direita (lg+).
 * Em mobile, a coluna direita some e o card fica só com os dados; o resumo
 * editorial entra como texto solto abaixo (controlado pelo App).
 *
 * Props:
 *   location:  { name, country, admin1?, ... }
 *   current:   objeto current do backend
 *   today:     daily[0] (precisa de sunrise/sunset pra escolher foto dia/noite)
 *   summary:   frase resumo do dia (opcional); fallback é current.description
 *   fetchedAt: timestamp ms de quando o frontend recebeu os dados
 */
export default function WeatherCard({
  location,
  current,
  today,
  summary,
  fetchedAt,
}) {
  const Icon = getWeatherIcon(current.icon)
  const region = location.admin1
    ? `${location.admin1}, ${location.country}`
    : location.country
  const relativeTime = useRelativeTime(fetchedAt)
  const photo = photoFor(current.icon, isNight(current.time, today))
  const phrase = summary || `${capitalize(current.description)}.`

  return (
    <Card as="article" variant="lightHero" className="overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Coluna esquerda: dados */}
        <div className="p-8 flex flex-col">
          <header className="flex items-start justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div>
                <h2 className="font-serif text-3xl text-ink leading-none tracking-tight">
                  {location.name}
                </h2>
                <p className="text-ink/55 text-sm mt-1.5">{region}</p>
              </div>
              <CityClock baseTime={current.time} fetchedAt={fetchedAt} size={56} />
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

          <dl className="grid grid-cols-3 gap-4 pt-6 border-t border-ink/10 mt-auto">
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
        </div>

        {/* Coluna direita: foto com borda própria + frase editorial (desktop only) */}
        <div
          className="hidden lg:flex p-8"
          aria-label="Painel atmosférico"
        >
          <div className="relative flex-1 min-h-[20rem] overflow-hidden rounded-2xl flex items-end">
            <img
              src={photo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent" />
            <p className="relative p-8 font-serif italic text-paper text-2xl tracking-tight leading-snug drop-shadow-md">
              {phrase}
            </p>
          </div>
        </div>
      </div>
    </Card>
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

// Mapeia icon_key do backend pro nome de arquivo em /public/sky/.
// `clear` tem variantes dia/noite tratadas separadamente em photoFor().
const PHOTO_MAP = {
  'mostly-clear': 'mostly-clear',
  'partly-cloudy': 'partly-cloudy',
  'cloudy': 'cloudy',
  'fog': 'fog',
  'drizzle': 'rain',
  'rain': 'rain',
  'rain-showers': 'rain',
  'snow': 'snow',
  'snow-showers': 'snow',
  'thunderstorm': 'thunderstorm',
}

function photoFor(iconKey, isNightTime) {
  if (iconKey === 'clear') {
    return isNightTime ? '/sky/clear-night.webp' : '/sky/clear-day.webp'
  }
  const name = PHOTO_MAP[iconKey] || 'cloudy'
  return `/sky/${name}.webp`
}

// current.time, sunrise e sunset vêm no fuso da cidade sem offset.
// Comparamos apenas "HH:MM" — robusto e sem cair em parsing de timezone.
function isNight(currentTime, today) {
  if (!currentTime || !today?.sunrise || !today?.sunset) return false
  const now = currentTime.slice(11, 16)
  const rise = today.sunrise.slice(11, 16)
  const set = today.sunset.slice(11, 16)
  return now < rise || now >= set
}

function capitalize(s) {
  if (!s) return s
  return s[0].toUpperCase() + s.slice(1).toLowerCase()
}
