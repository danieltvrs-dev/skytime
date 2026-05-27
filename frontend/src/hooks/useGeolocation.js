import { useCallback, useState } from 'react'

/**
 * Hook fino sobre navigator.geolocation.getCurrentPosition.
 *
 * Retorna { getLocation, loading, error } onde:
 *   - getLocation() é uma Promise que resolve com { lat, lon } ou rejeita
 *     com Error contendo mensagem amigável em português.
 *   - loading vira true enquanto o navegador pede permissão / resolve.
 *   - error guarda a última falha (útil pra exibir mensagem).
 */
export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        const err = new Error('Geolocalização não suportada neste navegador.')
        setError(err)
        reject(err)
        return
      }

      setLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false)
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (geoError) => {
          setLoading(false)
          let message = 'Não foi possível obter sua localização.'
          if (geoError.code === geoError.PERMISSION_DENIED) {
            message = 'Permissão de localização negada.'
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            message = 'Localização indisponível no momento.'
          } else if (geoError.code === geoError.TIMEOUT) {
            message = 'Tempo esgotado ao obter localização.'
          }
          const err = new Error(message)
          setError(err)
          reject(err)
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60_000, // aceita posição cacheada de até 1 min
        },
      )
    })
  }, [])

  return { getLocation, loading, error }
}
