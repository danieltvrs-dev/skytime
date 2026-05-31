import { createContext, useCallback, useContext, useState } from 'react'

const STORAGE_TEMP = 'skytime:temp-unit'
const STORAGE_WIND = 'skytime:wind-unit'

const UnitsContext = createContext(null)

/**
 * Disponibiliza as preferências de unidade (temperatura + vento) globalmente
 * com persistência em localStorage. Falha silenciosa quando o storage está
 * indisponível (modo privado) — state local mantém a sessão.
 */
export function UnitsProvider({ children }) {
  const [tempUnit, setTempUnitState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_TEMP) || 'C'
    } catch {
      return 'C'
    }
  })
  const [windUnit, setWindUnitState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_WIND) || 'kmh'
    } catch {
      return 'kmh'
    }
  })

  const setTempUnit = useCallback((unit) => {
    try {
      localStorage.setItem(STORAGE_TEMP, unit)
    } catch {
      /* sem storage */
    }
    setTempUnitState(unit)
  }, [])

  const setWindUnit = useCallback((unit) => {
    try {
      localStorage.setItem(STORAGE_WIND, unit)
    } catch {
      /* sem storage */
    }
    setWindUnitState(unit)
  }, [])

  return (
    <UnitsContext.Provider
      value={{ tempUnit, windUnit, setTempUnit, setWindUnit }}
    >
      {children}
    </UnitsContext.Provider>
  )
}

export function useUnits() {
  const ctx = useContext(UnitsContext)
  if (!ctx) {
    throw new Error('useUnits precisa estar dentro de <UnitsProvider>')
  }
  return ctx
}
