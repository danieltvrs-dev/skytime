import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'skytime:reduce-motion'

const MotionContext = createContext(null)

/**
 * Disponibiliza globalmente a preferência de "reduzir animações", com
 * persistência em localStorage e aplicação da classe .reduce-motion no <html>.
 * O CSS no index.css reage a essa classe pra desligar animações pesadas
 * (stagger principalmente). Também respeita prefers-reduced-motion do OS
 * via media query separada — então mesmo sem o usuário tocar nada, OS já
 * cuida do caso óbvio.
 *
 * Falha silenciosa no storage (modo privado) — state em memória mantém
 * a escolha durante a sessão.
 */
export function MotionProvider({ children }) {
  const [reduceMotion, setReduceMotionState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  // Aplica .reduce-motion no <html> sempre que o estado muda.
  useEffect(() => {
    const root = document.documentElement
    if (reduceMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
  }, [reduceMotion])

  const setReduceMotion = useCallback((next) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Boolean(next)))
    } catch {
      /* sem storage */
    }
    setReduceMotionState(Boolean(next))
  }, [])

  return (
    <MotionContext.Provider value={{ reduceMotion, setReduceMotion }}>
      {children}
    </MotionContext.Provider>
  )
}

export function useMotion() {
  const ctx = useContext(MotionContext)
  if (!ctx) {
    throw new Error('useMotion precisa estar dentro de <MotionProvider>')
  }
  return ctx
}
