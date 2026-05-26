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
