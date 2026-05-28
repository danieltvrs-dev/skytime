import { formatHour } from '../utils/dateFormat'

const HOURS_AHEAD = 12

/**
 * Gráfico de barras com a chance de chuva nas próximas 12 horas.
 * Reaproveita `hourly[i].precipitation_probability` que já vem do backend.
 * Escala fixa 0-100% pra o olho calibrar o que é alto.
 *
 * Props:
 *   hourly:      array hourly do backend
 *   currentTime: current.time, usado pra achar o índice inicial
 */
export default function RainTimeline({ hourly, currentTime }) {
  const startIdx = Math.max(
    0,
    hourly.findIndex((h) => h.time === currentTime),
  )
  const next = hourly.slice(startIdx, startIdx + HOURS_AHEAD)
  const maxProb = Math.max(...next.map((h) => h.precipitation_probability ?? 0))

  return (
    <section className="rounded-3xl p-6 bg-ink text-paper border border-paper/10 shadow-md">
      <h3 className="text-[11px] font-medium text-paper/50 mb-5 tracking-[0.14em] uppercase">
        Chance de chuva — próximas 12 horas
      </h3>

      {maxProb === 0 ? (
        <p className="font-serif italic text-paper/60 text-sm">
          Sem chuva prevista nas próximas 12 horas.
        </p>
      ) : (
        <div className="relative h-32">
          {/* Linha de referência em 50% */}
          <div
            className="absolute inset-x-0 top-1/2 border-t border-dashed border-paper/15 pointer-events-none"
            aria-hidden="true"
          >
            <span className="absolute -top-2 right-0 bg-ink px-1 text-[9px] text-paper/40 tabular-nums">
              50%
            </span>
          </div>

          <div className="flex items-end gap-2 h-full">
            {next.map((hour, index) => (
              <RainBar key={hour.time} hour={hour} isNow={index === 0} />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-2 px-1">
        {next.map((hour, index) => (
          <span
            key={hour.time}
            className="flex-1 text-center text-[10px] text-paper/50 tabular-nums"
          >
            {index === 0 ? 'agora' : formatHour(hour.time)}
          </span>
        ))}
      </div>
    </section>
  )
}

function RainBar({ hour }) {
  const prob = hour.precipitation_probability ?? 0

  // 3 tons de âmbar conforme a intensidade. Bar mínima de 6% pra
  // continuar visível mesmo em 0% (caso raro, geralmente cai no early return).
  const barColor =
    prob >= 60 ? 'bg-amber' : prob >= 30 ? 'bg-amber/65' : 'bg-amber/25'

  return (
    <div
      className="flex-1 flex items-end h-full"
      title={`${prob}% de chance de chuva`}
    >
      <div
        className={`w-full rounded-t ${barColor}`}
        style={{ height: `${Math.max(prob, 6)}%` }}
        role="img"
        aria-label={`${prob}%`}
      />
    </div>
  )
}
