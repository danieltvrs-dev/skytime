import { useEffect, useRef, useState } from 'react'

const DEFAULT_DURATION_MS = 600

// Easing easeOutCubic — começa rápido, desacelera no final.
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Interpola um número entre o valor atual e o target em duration ms,
 * usando requestAnimationFrame. Quando o consumidor formata o resultado
 * com Math.round, o display "tica" pelos inteiros entre os dois valores.
 *
 * Respeita reduce-motion: se a classe .reduce-motion estiver no <html>
 * ou o OS pedir movimento reduzido, o valor pula direto pro target sem
 * animar.
 *
 * Uso: const temp = useAnimatedNumber(current.temperature)
 *      <p>{formatTemp(temp, tempUnit)}°</p>
 */
export function useAnimatedNumber(target, duration = DEFAULT_DURATION_MS) {
  const [current, setCurrent] = useState(target)
  // Refs evitam que mudanças mid-animação refresquem o effect.
  const currentRef = useRef(target)

  useEffect(() => {
    currentRef.current = current
  }, [current])

  useEffect(() => {
    if (target == null) return undefined
    if (target === currentRef.current) return undefined

    // Snap direto se motion estiver reduzido.
    const reduceMotion =
      document.documentElement.classList.contains('reduce-motion') ||
      (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

    if (reduceMotion) {
      setCurrent(target)
      return undefined
    }

    const startValue = currentRef.current
    const startTime = performance.now()
    let rafId

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      const value = startValue + (target - startValue) * eased
      setCurrent(value)

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [target, duration])

  return current
}
