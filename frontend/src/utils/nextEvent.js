/**
 * Identifica o próximo evento climatológico significativo nas próximas 24h.
 *
 * Lógica:
 *   - Se está chovendo agora -> procura quando vai parar (sol/seco)
 *   - Se não está chovendo -> procura quando vai começar (chuva/trovoada)
 *   - Se nenhum dos dois aparece no horizonte -> retorna null
 *
 * Returns: { type, targetTime } onde
 *   type ∈ { 'rain', 'storm', 'sun', 'dry' }
 *   targetTime: ISO string no fuso da cidade ("YYYY-MM-DDTHH:MM:SS")
 */

const RAIN_ICONS = new Set([
  'drizzle',
  'rain',
  'rain-showers',
  'thunderstorm',
  'snow',
  'snow-showers',
])

const SUN_ICONS = new Set(['clear', 'mostly-clear'])

// A Open-Meteo às vezes mantém icon "cloudy" mesmo com 70-80% de chuva
// (intensidade baixa). Considerar precipitation_probability evita esse cego.
const RAIN_PROB_THRESHOLD = 30

function isRainyHour(hour) {
  if (RAIN_ICONS.has(hour.icon)) return true
  return (
    typeof hour.precipitation_probability === 'number' &&
    hour.precipitation_probability >= RAIN_PROB_THRESHOLD
  )
}

export function getNextWeatherEvent(hourly, currentTime, currentIcon) {
  if (!hourly || !currentTime) return null

  const startIdx = Math.max(
    0,
    hourly.findIndex((h) => h.time === currentTime),
  )
  // Olha 24h pra frente.
  const horizon = Math.min(startIdx + 24, hourly.length)
  const upcoming = hourly.slice(startIdx + 1, horizon)

  // "Agora chovendo" só pelo ícone — usar probabilidade aqui trancaria dias
  // com 50%+ de chance num "sempre chovendo" sem janela seca pra anunciar.
  const nowRaining = RAIN_ICONS.has(currentIcon)

  if (nowRaining) {
    const next = upcoming.find((h) => !isRainyHour(h))
    if (!next) return null
    return {
      type: SUN_ICONS.has(next.icon) ? 'sun' : 'dry',
      targetTime: next.time,
    }
  }

  const next = upcoming.find((h) => isRainyHour(h))
  if (!next) return null
  return {
    type: next.icon === 'thunderstorm' ? 'storm' : 'rain',
    targetTime: next.time,
  }
}

/**
 * Fallback quando não há mudança de chuva no horizonte: aponta pro próximo
 * marco solar (pôr ou nascer do sol). Sempre tem um nas próximas 24h.
 */
export function getNextSolarEvent(today, tomorrow, currentTime) {
  if (!today || !currentTime) return null

  const sunrise = today.sunrise
  const sunset = today.sunset

  if (sunset && currentTime < sunset) {
    return { type: 'sunset', targetTime: sunset }
  }
  if (sunrise && currentTime < sunrise) {
    return { type: 'sunrise', targetTime: sunrise }
  }
  // Já passou do pôr de hoje — procura amanhã
  if (tomorrow?.sunrise) {
    return { type: 'sunrise', targetTime: tomorrow.sunrise }
  }
  return null
}
