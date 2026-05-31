/**
 * Converte um nome de cidade em slug URL-friendly.
 *   "São Paulo"          -> "sao-paulo"
 *   "Belo Horizonte"     -> "belo-horizonte"
 *   "Nossa Senhora de Lourdes" -> "nossa-senhora-de-lourdes"
 */
export function slugify(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .normalize('NFD')
    // remove diacríticos (acentos)
    .replace(/[̀-ͯ]/g, '')
    // colapsa qualquer não-alfanumérico em hífen
    .replace(/[^a-z0-9]+/g, '-')
    // remove hífens nas pontas
    .replace(/(^-|-$)/g, '')
}

/**
 * Recupera um nome aproximado a partir do slug. A geocoding da Open-Meteo é
 * tolerante e resolve "sao paulo" pra "São Paulo, Brasil" sem problemas.
 */
export function deslugify(slug) {
  if (!slug) return ''
  return slug.replace(/-/g, ' ')
}
