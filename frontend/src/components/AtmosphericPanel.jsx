/**
 * Painel atmosférico — coluna direita da Zona 1 em telas lg+.
 * Hoje é um gradiente suave; na Fase 7 vira a foto de céu reativa ao clima.
 *
 * Props:
 *   current:  objeto current do backend (com description, etc.)
 *   location: { name, country, admin1?, ... }
 *   summary:  frase resumo do dia (opcional); se ausente, cai em current.description
 */
export default function AtmosphericPanel({ current, location, summary }) {
  // Frase exibida: prioriza o resumo do dia (multi-período). Sem ele,
  // usa a descrição da condição atual como fallback.
  const phrase = summary || `${capitalize(current.description)}.`

  return (
    <aside
      className="hidden lg:flex items-end rounded-3xl p-10 min-h-[28rem] relative overflow-hidden border border-ink/5 shadow-sm"
      aria-label="Painel atmosférico"
    >
      {/* Placeholder. Quando a Fase 7 chegar, a foto substitui este gradiente. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-paper via-sand/30 to-ink/15" />

      <div>
        <p className="font-serif italic text-ink/75 text-2xl tracking-tight leading-snug">
          {phrase}
        </p>
        <p className="text-ink/50 text-xs mt-3 uppercase tracking-[0.18em]">
          {location.name}
        </p>
      </div>
    </aside>
  )
}

function capitalize(s) {
  if (!s) return s
  return s[0].toUpperCase() + s.slice(1).toLowerCase()
}
