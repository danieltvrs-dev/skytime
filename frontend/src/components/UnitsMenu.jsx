import { useEffect, useRef, useState } from 'react'
import { Settings } from 'lucide-react'

import { useUnits } from '../contexts/UnitsContext'

/**
 * Menu de preferências de unidades — botão de engrenagem que abre um popover
 * com seleção de temperatura (°C/°F) e vento (km/h/mph).
 *
 * Posicionado pelo consumidor (ex: WeatherCard ancora ele no topo-direito do
 * divisor das stats). O componente em si só lida com o gear + popover; o
 * posicionamento absoluto fica com quem usa.
 *
 * Fecha por: clique fora, tecla ESC, ou clique em uma das opções.
 */
export default function UnitsMenu({ className = '' }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const { tempUnit, windUnit, setTempUnit, setWindUnit } = useUnits()

  // Clique fora fecha. Listener só ativo enquanto aberto.
  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // ESC fecha.
  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  // Estrutura aninhada: o wrapper externo recebe className do consumidor
  // (geralmente posicionamento absolute). O wrapper interno é relative pra
  // o popover ancorar. Sem isso, Tailwind tem conflito entre `relative` e
  // `absolute` no mesmo elemento.
  return (
    <div ref={containerRef} className={className}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Preferências de unidades"
          aria-expanded={open}
          aria-haspopup="menu"
          title="Unidades"
          className="p-1.5 rounded-lg bg-surface text-ink/55 hover:text-ink hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-amber/30 transition"
        >
          <Settings className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-surface/95 backdrop-blur-sm border border-border shadow-lg py-2 z-20"
          >
          <UnitGroup
            label="Temperatura"
            current={tempUnit}
            onChange={setTempUnit}
            options={[
              { value: 'C', label: '°C' },
              { value: 'F', label: '°F' },
            ]}
          />
          <div className="border-t border-border my-1.5" />
          <UnitGroup
            label="Vento"
            current={windUnit}
            onChange={setWindUnit}
            options={[
              { value: 'kmh', label: 'km/h' },
              { value: 'mph', label: 'mph' },
            ]}
          />
          </div>
        )}
      </div>
    </div>
  )
}

function UnitGroup({ label, current, onChange, options }) {
  return (
    <div className="px-2 py-1">
      <div className="px-2 text-[10px] uppercase tracking-wider text-ink/55 mb-1.5">
        {label}
      </div>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="menuitemradio"
            aria-checked={current === opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-2 py-1.5 rounded-md text-sm transition ${
              current === opt.value
                ? 'bg-ink/10 text-ink font-medium'
                : 'text-ink/55 hover:bg-ink/5 hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
