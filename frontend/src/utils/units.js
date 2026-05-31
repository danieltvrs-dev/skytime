/**
 * Conversões e formatação de unidades.
 * O backend sempre devolve em métrico (°C, km/h); essas funções convertem
 * pra unidade escolhida pelo usuário e arredondam pra exibição.
 */

export function formatTemp(celsius, unit = 'C') {
  if (celsius == null) return ''
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32)
  return Math.round(celsius)
}

export function formatWind(kmh, unit = 'kmh') {
  if (kmh == null) return ''
  if (unit === 'mph') return `${Math.round(kmh * 0.6213711922)} mph`
  return `${Math.round(kmh)} km/h`
}
