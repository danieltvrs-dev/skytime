import { Droplets, Thermometer, Wind } from 'lucide-react'
import { getWeatherIcon } from '../utils/weatherIcons'

/**
 * Card visual com o clima atual de uma localização.
 * Sem lógica de fetch: recebe dados prontos por props.
 *
 * Props:
 *   location: { name, country, admin1?, ... }
 *   current:  { temperature, apparent_temperature, humidity, wind_speed, description, icon }
 */
export default function WeatherCard({ location, current }) {
  const Icon = getWeatherIcon(current.icon)
  const region = location.admin1 ? `${location.admin1}, ${location.country}` : location.country

  return (
    <article className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-white shadow-xl">
      <header className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-medium leading-tight">{location.name}</h2>
          <p className="text-white/70 text-sm">{region}</p>
        </div>
        <Icon className="w-20 h-20 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      </header>

      <div className="mb-6">
        <p className="text-7xl font-light tracking-tight">
          {Math.round(current.temperature)}°
        </p>
        <p className="text-white/80 mt-1">{current.description}</p>
      </div>

      <dl className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
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
    <div className="flex flex-col items-center text-center">
      <Icon className="w-5 h-5 mb-1 text-white/70" strokeWidth={1.5} aria-hidden="true" />
      <dt className="text-white/60 text-xs">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
