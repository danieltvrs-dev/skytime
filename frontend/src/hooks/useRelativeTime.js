import { useEffect, useState } from 'react'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

/**
 * Retorna uma string em português dizendo há quanto tempo `timestamp` aconteceu.
 * Se atualiza sozinho a cada 30s pra o texto não ficar parado.
 *
 *   useRelativeTime(Date.now() - 5000)   → "agora há pouco"
 *   useRelativeTime(Date.now() - 2*MINUTE) → "há 2 min"
 *   useRelativeTime(Date.now() - 3*HOUR)   → "há 3 h"
 */
export function useRelativeTime(timestamp) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!timestamp) return undefined
    const interval = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(interval)
  }, [timestamp])

  if (!timestamp) return null

  const diff = now - timestamp
  if (diff < MINUTE) return 'agora há pouco'
  if (diff < HOUR) {
    const minutes = Math.round(diff / MINUTE)
    return `há ${minutes} min`
  }
  const hours = Math.round(diff / HOUR)
  return `há ${hours} h`
}
