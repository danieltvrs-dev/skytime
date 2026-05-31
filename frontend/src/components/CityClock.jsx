import { useLiveCityTime } from '../hooks/useLiveCityTime'

/**
 * Relógio analógico mini com hora digital dentro do aro.
 * Referência direta ao logo do Skytime: aro + ponteiros + sol no canto superior
 * direito (igual ao sol no canto do tile do logo).
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
      className="relative inline-block text-ink"
      style={{ width: size, height: size }}
      aria-label={`Hora local: ${time}`}
      role="img"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Aro do relógio */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />

        {/* 12 marcadores de hora ao redor do aro */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="8"
            x2="50"
            y2="13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}

        {/* Sol no canto superior direito — assinatura visual do logo */}
        <circle cx="82" cy="18" r="8" fill="#F9A03F" />

        {/* Ponteiro de horas — tapered (triangular), sky-deep */}
        <polygon
          points="47,53 53,53 50,28"
          fill="#0A4DA3"
          transform={`rotate(${hourAngle} 50 50)`}
        />

        {/* Ponteiro de minutos — tapered, mais longo, ink */}
        <polygon
          points="48.5,53 51.5,53 50,16"
          fill="currentColor"
          transform={`rotate(${minuteAngle} 50 50)`}
        />

        {/* Pino central */}
        <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      </svg>

      {/* Digital miúdo na parte inferior do relógio (dentro do aro) */}
      <span
        className="absolute left-1/2 -translate-x-1/2 text-[8px] font-medium tabular-nums text-ink/55 bg-white/85 px-1 rounded leading-none py-0.5"
        style={{ bottom: '15%' }}
      >
        {time}
      </span>
    </div>
  )
}
