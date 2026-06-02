import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'skytime:theme'
const VALID_THEMES = new Set(['light', 'dark'])

const ThemeContext = createContext(null)

/**
 * Disponibiliza o tema atual ('light' | 'dark') globalmente, com persistência
 * em localStorage e aplicação da classe .dark no <html>. O Tailwind 4 reage
 * a essa classe via @custom-variant dark definido no index.css.
 *
 * Default é 'light'. O usuário escolhe explicitamente pelo botão de tema —
 * o sistema operacional NÃO é consultado (decisão de produto: previsibilidade).
 *
 * Falha silenciosa no localStorage (modo privado) — o estado em memória
 * mantém a escolha durante a sessão.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return VALID_THEMES.has(saved) ? saved : 'light'
    } catch {
      return 'light'
    }
  })

  // Aplica a classe .dark no <html> sempre que o tema muda. O Tailwind 4 usa
  // a classe via @custom-variant dark pra resolver os utilitários `dark:`.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (!VALID_THEMES.has(next)) return
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* sem storage */
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme precisa estar dentro de <ThemeProvider>')
  }
  return ctx
}
