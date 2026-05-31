import { useEffect, useState } from 'react'

/**
 * Devolve a hora local da cidade "ao vivo", atualizando sozinha a cada 30s.
 *
 * O backend devolve `current.time` no formato "YYYY-MM-DDTHH:MM:SS" no fuso
 * da cidade, sem offset. Tratamos esse instante como UTC fictício pra evitar
 * conversões de timezone do navegador, e adicionamos o tempo que passou
 * desde `fetchedAt` (que é Date.now() do momento da resposta no frontend).
 *
 * Resultado: "HH:MM" no fuso da cidade, sempre atual.
 */
export function useLiveCityTime(baseTime, fetchedAt) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!baseTime || !fetchedAt) return undefined
    const interval = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(interval)
  }, [baseTime, fetchedAt])

  if (!baseTime || !fetchedAt) return null

  const [datePart, timePart = '00:00:00'] = baseTime.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)

  // Trata como UTC pra ler de volta sem mexer no fuso do navegador
  const baseMs = Date.UTC(year, month - 1, day, hours, minutes)
  const elapsedMs = now - fetchedAt
  const liveDate = new Date(baseMs + elapsedMs)

  const hh = String(liveDate.getUTCHours()).padStart(2, '0')
  const mm = String(liveDate.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
