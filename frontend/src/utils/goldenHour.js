/**
 * Calcula as janelas de hora dourada e hora azul de hoje a partir
 * dos timestamps sunrise/sunset que vêm da Open-Meteo no fuso da cidade.
 *
 * Convenções práticas (usadas por fotógrafos casuais, não a definição
 * astronômica baseada no ângulo do sol):
 *   - Hora dourada da manhã: nascer → nascer + 60min
 *   - Hora azul da manhã:    nascer − 30min → nascer
 *   - Hora dourada da tarde: pôr − 60min → pôr
 *   - Hora azul da tarde:    pôr → pôr + 30min
 */

function timeOf(isoString) {
  return isoString.slice(11, 16) // "HH:MM"
}

function addMinutes(isoString, mins) {
  const [datePart, timePart] = isoString.split('T')
  const [h, m] = timePart.split(':').map(Number)
  const totalMinutes = h * 60 + m + mins
  // Janelas ficam dentro do mesmo dia (não cruzam meia-noite na prática)
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440
  const newH = Math.floor(wrapped / 60)
  const newM = wrapped % 60
  return `${datePart}T${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

export function getSunWindows(today) {
  if (!today?.sunrise || !today?.sunset) return null

  const sunrise = today.sunrise
  const sunset = today.sunset

  return {
    sunrise: timeOf(sunrise),
    sunset: timeOf(sunset),

    morningGolden: {
      start: timeOf(sunrise),
      end: timeOf(addMinutes(sunrise, 60)),
    },
    morningBlue: {
      start: timeOf(addMinutes(sunrise, -30)),
      end: timeOf(sunrise),
    },
    eveningGolden: {
      start: timeOf(addMinutes(sunset, -60)),
      end: timeOf(sunset),
    },
    eveningBlue: {
      start: timeOf(sunset),
      end: timeOf(addMinutes(sunset, 30)),
    },
  }
}
