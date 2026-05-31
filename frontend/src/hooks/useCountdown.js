import { useEffect, useState } from 'react'

/**
 * Conta regressivamente até um momento alvo no fuso da cidade.
 *
 *   targetTime: ISO string "YYYY-MM-DDTHH:MM:SS" no fuso da cidade
 *   baseTime:   ISO no fuso da cidade — equivale ao "agora" do backend
 *   fetchedAt:  Date.now() do momento do fetch
 *
 * Retorna { hours, minutes, totalMinutes } ou null se já passou.
 * Re-renderiza a cada 30s pra manter o contador andando sem refresh.
 */
export function useCountdown(targetTime, baseTime, fetchedAt) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!targetTime || !baseTime || !fetchedAt) return undefined
    const interval = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(interval)
  }, [targetTime, baseTime, fetchedAt])

  if (!targetTime || !baseTime || !fetchedAt) return null

  // baseTime e targetTime são strings "naive" sem fuso. Tratamos como UTC
  // pra evitar interferência do fuso do navegador — só queremos a diferença
  // de minutos entre os dois, em segundos do mundo real.
  const baseMs = parseAsUtc(baseTime)
  const targetMs = parseAsUtc(targetTime)
  if (baseMs == null || targetMs == null) return null

  // Quanto tempo passou desde fetchedAt, em ms reais.
  const elapsedMs = now - fetchedAt
  const liveMs = baseMs + elapsedMs

  const diffMs = targetMs - liveMs
  if (diffMs <= 0) return null

  const totalMinutes = Math.floor(diffMs / 60_000)
  return {
    totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  }
}

function parseAsUtc(iso) {
  if (!iso) return null
  const [datePart, timePart] = iso.split('T')
  if (!datePart || !timePart) return null
  const [y, m, d] = datePart.split('-').map(Number)
  const [h, min, s = 0] = timePart.split(':').map(Number)
  return Date.UTC(y, m - 1, d, h, min, s)
}
