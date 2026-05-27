import api from './api'

/**
 * Busca o pacote completo de clima para uma cidade.
 * Retorna { location, current, hourly, daily, timezone }.
 * Erros (404, 502, rede) sobem como AxiosError para o caller tratar.
 */
export async function getWeather(city) {
  const { data } = await api.get('/weather', { params: { city } })
  return data
}

/**
 * Variante: busca o clima a partir de coordenadas (lat/lon).
 * Usado pelo botão "minha localização", que pega coords do GPS do navegador.
 * O backend faz reverse geocoding pra resolver o nome da cidade.
 */
export async function getWeatherByCoords(lat, lon) {
  const { data } = await api.get('/weather/by-coords', { params: { lat, lon } })
  return data
}
