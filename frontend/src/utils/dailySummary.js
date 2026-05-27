/**
 * Gera uma frase resumo do dia atual em português, a partir do hourly forecast.
 *
 * Estratégia:
 *   1. Filtra as horas de hoje (datas iguais a today.date)
 *   2. Agrupa em manhã / tarde / noite
 *   3. Identifica a condição predominante de cada período (icon mais frequente)
 *   4. Combina períodos consecutivos com mesma condição
 *   5. Monta a frase
 *
 * Exemplos de saída:
 *   "Dia inteiro nublado."
 *   "Ensolarado pela manhã, chuvoso à tarde e à noite."
 *   "Nublado pela manhã, parcialmente nublado à tarde, com pancadas à noite."
 */

const PERIODS = [
  { name: 'manhã', start: 6, end: 11, label: 'pela manhã' },
  { name: 'tarde', start: 12, end: 17, label: 'à tarde' },
  { name: 'noite', start: 18, end: 23, label: 'à noite' },
]

const CONDITION_LABELS = {
  'clear': 'ensolarado',
  'mostly-clear': 'sol entre nuvens',
  'partly-cloudy': 'parcialmente nublado',
  'cloudy': 'nublado',
  'fog': 'com neblina',
  'drizzle': 'com garoa',
  'rain': 'chuvoso',
  'rain-showers': 'com pancadas de chuva',
  'snow': 'com neve',
  'snow-showers': 'com pancadas de neve',
  'thunderstorm': 'com trovoadas',
}

const FALLBACK_LABEL = 'instável'

function hourOf(isoString) {
  return parseInt(isoString.slice(11, 13), 10)
}

function dateOf(isoString) {
  return isoString.slice(0, 10)
}

function mostCommon(items) {
  if (items.length === 0) return null
  const counts = {}
  for (const i of items) counts[i] = (counts[i] || 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function labelFor(icon) {
  return CONDITION_LABELS[icon] || FALLBACK_LABEL
}

function capitalize(s) {
  if (!s) return s
  return s[0].toUpperCase() + s.slice(1)
}

export function buildDailySummary(hourly, today) {
  if (!today || !hourly) return null
  const todayDate = today.date
  const todayHours = hourly.filter((h) => dateOf(h.time) === todayDate)
  if (todayHours.length === 0) return null

  const periodIcons = PERIODS.map((p) => {
    const hours = todayHours.filter((h) => {
      const hr = hourOf(h.time)
      return hr >= p.start && hr <= p.end
    })
    return { ...p, icon: mostCommon(hours.map((h) => h.icon)) }
  }).filter((p) => p.icon !== null)

  if (periodIcons.length === 0) return null

  // Todos os períodos com a mesma condição
  if (periodIcons.every((p) => p.icon === periodIcons[0].icon)) {
    return `Dia inteiro ${labelFor(periodIcons[0].icon)}.`
  }

  // Combina períodos consecutivos com mesma condição em um só segmento
  const segments = []
  let current = null
  for (const p of periodIcons) {
    if (current && current.icon === p.icon) {
      current.periods.push(p.label)
    } else {
      current = { icon: p.icon, periods: [p.label] }
      segments.push(current)
    }
  }

  const parts = segments.map((s) => {
    const condition = labelFor(s.icon)
    const periodPhrase =
      s.periods.length === 1
        ? s.periods[0]
        : s.periods.slice(0, -1).join(', ') + ' e ' + s.periods[s.periods.length - 1]
    return `${condition} ${periodPhrase}`
  })

  return capitalize(parts.join(', ')) + '.'
}
