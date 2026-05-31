/**
 * Frase editorial do dia, baseada nos dados de daily[0].
 * Sempre retorna algo — usado pra dar tom + dica no card "O que levar hoje"
 * mesmo quando o array de recomendações é curto.
 *
 * Ordem das regras importa: severo > intenso > moderado > default.
 */
export function getDayMood(today) {
  if (!today) return null

  const icon = today.icon
  const maxTemp = today.temperature_max
  const minTemp = today.temperature_min
  const amplitude =
    maxTemp != null && minTemp != null ? maxTemp - minTemp : 0
  const rainProb = today.precipitation_probability_max ?? 0
  const uv = today.uv_index_max ?? 0

  // Eventos severos primeiro — segurança importa mais que conforto
  if (icon === 'thunderstorm') {
    return 'Trovoadas a caminho — fique atento ao céu.'
  }
  if (rainProb >= 70) {
    return 'Vai chover de verdade — guarda-chuva é amigo.'
  }

  // Condições intensas individuais
  if (uv >= 8) {
    return 'Sol forte demais — protetor, chapéu e óculos.'
  }
  if (maxTemp != null && maxTemp >= 32) {
    return 'Dia de calor — beba água sem esperar a sede.'
  }
  if (minTemp != null && minTemp < 8) {
    return 'Dia gelado — agasalho de verdade na hora de sair.'
  }
  if (rainProb >= 40) {
    return 'Chance boa de chuva — não custa um guarda-chuva.'
  }
  if (amplitude > 14) {
    return 'Manhã fresca, tarde quente — vista em camadas.'
  }

  // Estado normal — varia pela condição predominante
  if (icon === 'fog') {
    return 'Neblina pela frente — dirija com calma.'
  }
  if (icon === 'cloudy') {
    return 'Nublado mas tranquilo — bom dia pra qualquer plano.'
  }
  if (icon === 'clear' || icon === 'mostly-clear') {
    return 'Céu aberto, dia bom de aproveitar.'
  }

  // Fallback
  return 'Tempo tranquilo, sem grandes variações.'
}
