/**
 * Painel atmosférico — coluna direita da Zona 1 em telas lg+.
 * Foto de céu reativa ao clima (e à hora do dia para `clear`),
 * com overlay escuro embaixo pra o texto em itálico serif sobreviver
 * sobre fotos de qualquer cor.
 *
 * Props:
 *   current:  objeto current do backend (com description, icon, time)
 *   today:    daily[0] do backend (precisa de sunrise/sunset pra detectar noite)
 *   summary:  frase resumo do dia (opcional); se ausente, cai em current.description
 */
export default function AtmosphericPanel({ current, today, summary }) {
  const phrase = summary || `${capitalize(current.description)}.`
  const photo = photoFor(current.icon, isNight(current.time, today))

  return (
    <aside
      className="hidden lg:flex items-end rounded-3xl p-10 min-h-[28rem] relative overflow-hidden border border-ink/5 shadow-md"
      aria-label="Painel atmosférico"
    >
      <img
        src={photo}
        alt=""
        className="absolute inset-0 w-full h-full object-cover -z-20"
        loading="eager"
      />
      {/* Overlay escuro de baixo pra cima: a foto continua visível em cima
       * e o texto na base ganha contraste suficiente. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent" />

      <p className="font-serif italic text-paper text-2xl tracking-tight leading-snug drop-shadow-md">
        {phrase}
      </p>
    </aside>
  )
}

// Mapeia `icon_key` do backend pro nome de arquivo em /public/sky/.
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
  const name = PHOTO_MAP[iconKey] || 'cloudy' // fallback seguro
  return `/sky/${name}.webp`
}

// `current.time` e os sunrise/sunset vêm no fuso da cidade, sem offset.
// Comparamos apenas a string "HH:MM" — robusto e sem cair em parsing de timezone.
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
