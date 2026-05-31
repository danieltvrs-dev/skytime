import { useMemo } from 'react'
import Card from './Card'
import SectionLabel from './SectionLabel'
import { getDayMood } from '../utils/dayMood'
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
  const mood = useMemo(() => getDayMood(today), [today])

  return (
    <Card as="section" className="p-6">
      <SectionLabel className="mb-4">O que levar hoje</SectionLabel>

      {recommendations.length > 0 && (
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

      {mood && (
        <p
          className={`font-serif italic text-ink/65 text-sm leading-relaxed ${
            recommendations.length > 0 ? 'mt-5' : ''
          }`}
        >
          {mood}
        </p>
      )}
    </Card>
  )
}
