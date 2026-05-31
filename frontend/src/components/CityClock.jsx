import { useLiveCityTime } from '../hooks/useLiveCityTime'

/**
 * Relógio analógico minúsculo com a hora digital pequena dentro.
 * Referência direta ao logo do Skytime (nuvem + relógio).
 *
 * Props:
 *   baseTime:  string ISO "YYYY-MM-DDTHH:MM:SS" no fuso da cidade
 *   fetchedAt: timestamp ms de quando o frontend recebeu os dados
 *   size:      diâmetro em pixels (default 64)
 */
export default function CityClock({ baseTime, fetchedAt, size = 64 }) {
  const time = useLiveCityTime(baseTime, fetchedAt)
  if (!time) return null

  const [hh, mm] = time.split(':').map(Number)
  // 30° por hora + ajuste fino dos minutos. Minuteiro avança 6°/min.
  const hourAngle = ((hh % 12) + mm / 60) * 30
  const minuteAngle = mm * 6

  return (
    <div
      className="relative inline-block text-ink/75"
      style={{ width: size, height: size }}
      aria-label={`Hora local: ${time}`}
      role="img"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Aro do relógio */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.25"
        />
        {/* Ponteiro das horas (mais curto e grosso) */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="28"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 50 50)`}
        />
        {/* Ponteiro dos minutos (mais longo e fino) */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 50 50)`}
        />
        {/* Pino central */}
        <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      </svg>

      {/* Digital miúdo na parte inferior do relógio (dentro do aro) */}
      <span
        className="absolute left-1/2 -translate-x-1/2 text-[8px] font-medium tabular-nums text-ink/50 bg-white/80 px-1 rounded leading-none py-0.5"
        style={{ bottom: '15%' }}
      >
        {time}
      </span>
    </div>
  )
}
