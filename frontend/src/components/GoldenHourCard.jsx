import { useMemo } from 'react'
import { Sunrise, Sunset } from 'lucide-react'
import Card from './Card'
import SectionLabel from './SectionLabel'
import { getSunWindows } from '../utils/goldenHour'

/**
 * Card "A luz hoje" — feature de assinatura da Zona 2.
 * Mostra nascer/pôr do sol e as janelas de hora dourada/azul de hoje.
 * Conceito casa com o nome da paleta "Hora Dourada".
 *
 * Props:
 *   today: objeto daily[0] do backend (precisa de sunrise e sunset)
 */
export default function GoldenHourCard({ today }) {
  const windows = useMemo(() => getSunWindows(today), [today])

  if (!windows) return null

  return (
    <Card as="section" className="p-6">
      <SectionLabel className="mb-5">A luz hoje</SectionLabel>

      <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-ink/10">
        <SunMoment icon={Sunrise} label="Nascer" time={windows.sunrise} />
        <SunMoment icon={Sunset} label="Pôr" time={windows.sunset} />
      </div>

      <div className="space-y-4">
        <WindowGroup
          label="Hora dourada"
          morning={windows.morningGolden}
          evening={windows.eveningGolden}
          accent="amber"
        />
        <WindowGroup
          label="Hora azul"
          morning={windows.morningBlue}
          evening={windows.eveningBlue}
        />
      </div>
    </Card>
  )
}

function SunMoment({ icon: Icon, label, time }) {
  return (
    <div className="flex items-center gap-3">
      <Icon
        className="w-5 h-5 text-amber shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div>
        <p className="text-[11px] text-ink/55 uppercase tracking-wider">{label}</p>
        <p className="font-serif text-xl text-ink tabular-nums leading-none mt-0.5">
          {time}
        </p>
      </div>
    </div>
  )
}

function WindowGroup({ label, morning, evening, accent }) {
  const titleColor = accent === 'amber' ? 'text-amber' : 'text-ink/70'
  return (
    <div>
      <p
        className={`text-[11px] font-medium uppercase tracking-wider mb-2 ${titleColor}`}
      >
        {label}
      </p>
      <div className="flex flex-col gap-1.5 text-sm text-ink/75 tabular-nums">
        <WindowLine period="manhã" start={morning.start} end={morning.end} />
        <WindowLine period="tarde" start={evening.start} end={evening.end} />
      </div>
    </div>
  )
}

function WindowLine({ period, start, end }) {
  return (
    <span>
      <span className="text-ink/45 mr-2 inline-block w-10">{period}</span>
      {start} <span className="text-ink/35">→</span> {end}
    </span>
  )
}
