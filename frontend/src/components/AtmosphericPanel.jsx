/**
 * Painel atmosférico — coluna direita da Zona 1 em telas lg+.
 * Foto de céu reativa ao clima, com overlay escuro embaixo pra o texto
 * em itálico serif sobreviver sobre fotos de qualquer cor.
 *
 * Props:
 *   current:  objeto current do backend (com description, icon)
 *   summary:  frase resumo do dia (opcional); se ausente, cai em current.description
 */
export default function AtmosphericPanel({ current, summary }) {
  const phrase = summary || `${capitalize(current.description)}.`
  const photo = photoFor(current.icon)

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
// As 8 fotos cobrem as condições principais; variantes (rain-showers, etc.)
// caem na mais próxima sem inflar o bundle de imagens.
const PHOTO_MAP = {
  'clear': 'clear',
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

function photoFor(iconKey) {
  const name = PHOTO_MAP[iconKey] || 'cloudy' // fallback seguro
  return `/sky/${name}.webp`
}

function capitalize(s) {
  if (!s) return s
  return s[0].toUpperCase() + s.slice(1).toLowerCase()
}
