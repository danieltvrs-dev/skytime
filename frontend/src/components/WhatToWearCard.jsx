import { useMemo } from 'react'
import { getRecommendations } from '../utils/whatToWear'

/**
 * Card "O que levar hoje" — feature editorial da Zona 2.
 * Lista chips de recomendações; se nada dispara, mostra mensagem de "tudo tranquilo".
 *
 * Props:
 *   today: objeto daily[0] do backend (com uv_index_max, precipitation_probability_max, etc.)
 */
export default function WhatToWearCard({ today }) {
  const recommendations = useMemo(() => getRecommendations(today), [today])

  return (
    <section className="rounded-3xl p-6 bg-white/45 backdrop-blur-sm border border-ink/5 shadow-sm">
      <h3 className="text-[11px] font-medium text-ink/55 mb-4 tracking-[0.14em] uppercase">
        O que levar hoje
      </h3>

      {recommendations.length === 0 ? (
        <p className="text-sm text-ink/60 font-serif italic">
          Sem alertas. Tempo confortável.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2.5">
          {recommendations.map((rec) => {
            const Icon = rec.icon
            return (
              <li
                key={rec.key}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-ink/5 border border-ink/10"
              >
                <Icon
                  className="w-4 h-4 text-amber"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="text-sm text-ink font-medium">{rec.label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
