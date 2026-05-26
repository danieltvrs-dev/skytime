/**
 * Formatação de datas vindas do backend para exibição em português.
 *
 * Importante: o backend devolve timestamps no fuso da cidade consultada
 * (ex.: "2026-05-26T15:00:00" = 15h locais de lá). Não convertemos para
 * o fuso do navegador, então quem está em São Paulo vendo Lisboa
 * enxerga "15h" mesmo que seu relógio marque outra coisa.
 *
 * Por isso muitas funções aqui leem a string como texto, sem `new Date()`,
 * evitando que o fuso do browser interfira.
 */

const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS_SHORT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

/**
 * "2026-05-26T15:00:00" → "15h"
 */
export function formatHour(isoString) {
  const hourPart = isoString.slice(11, 13)
  return `${parseInt(hourPart, 10)}h`
}

/**
 * "2026-05-26" → "Ter, 26 mai"
 * Constrói a Date local para extrair o dia da semana, mas só usando os
 * componentes ano/mês/dia da string, ignorando qualquer fuso.
 */
export function formatDailyLabel(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return `${WEEKDAYS_SHORT[date.getDay()]}, ${day} ${MONTHS_SHORT[month - 1]}`
}
