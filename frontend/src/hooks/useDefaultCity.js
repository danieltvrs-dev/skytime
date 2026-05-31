import { useCallback, useState } from 'react'

const STORAGE_KEY = 'skytime:default-city'

/**
 * Mantém a "cidade padrão" do usuário (aquela que abre quando o app carrega)
 * persistida em localStorage. Falha silenciosa se localStorage não estiver
 * disponível (modo privado de alguns navegadores), caindo no fallback.
 *
 * Retorna [cidade, setCidade].
 */
export function useDefaultCity(fallback = 'São Paulo') {
  const [city, setCity] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || fallback
    } catch {
      return fallback
    }
  })

  const updateCity = useCallback((newCity) => {
    if (!newCity) return
    try {
      localStorage.setItem(STORAGE_KEY, newCity)
    } catch {
      /* sem localStorage; o state atualiza mas perde no reload */
    }
    setCity(newCity)
  }, [])

  return [city, updateCity]
}
