import { ShieldCheck, Shirt, Sun, Umbrella } from 'lucide-react'

/**
 * Recomendações do que levar hoje, derivadas de `daily[0]` da Open-Meteo.
 * Regras determinísticas (sem ML, sem chamadas extras) baseadas em:
 *   - precipitation_probability_max
 *   - uv_index_max
 *   - temperature_min / temperature_max
 *
 * Retorna lista ordenada por relevância prática (chuva primeiro, etc.).
 * Cada item: { key, label, icon }.
 */
export function getRecommendations(today) {
  const recs = []

  const rainProb = today.precipitation_probability_max
  if (rainProb != null && rainProb >= 40) {
    recs.push({ key: 'umbrella', label: 'Guarda-chuva', icon: Umbrella })
  }

  const uv = today.uv_index_max
  if (uv != null && uv >= 5) {
    recs.push({ key: 'sunscreen', label: 'Protetor solar', icon: ShieldCheck })
  }

  if (today.temperature_min != null && today.temperature_min < 15) {
    const label = today.temperature_min < 10 ? 'Casaco pesado' : 'Casaco leve'
    recs.push({ key: 'jacket', label, icon: Shirt })
  }

  if (today.temperature_max != null && today.temperature_max >= 28) {
    recs.push({ key: 'light', label: 'Roupas leves', icon: Sun })
  }

  const amplitude =
    today.temperature_max != null && today.temperature_min != null
      ? today.temperature_max - today.temperature_min
      : 0
  const hasClothingRec = recs.some((r) => r.key === 'jacket' || r.key === 'light')
  if (amplitude > 12 && !hasClothingRec) {
    recs.push({ key: 'layers', label: 'Camadas', icon: Shirt })
  }

  return recs
}
