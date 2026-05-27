/**
 * Painel atmosférico — coluna direita da Zona 1 em telas lg+.
 * Hoje é um gradiente suave; na Fase 7 vira a foto de céu reativa ao clima.
 * Mobile não vê esse painel (oculto via `hidden lg:flex`) porque na
 * coluna única o ícone do WeatherCard já carrega o peso atmosférico.
 */
export default function AtmosphericPanel({ current, location }) {
  return (
    <aside
      className="hidden lg:flex items-end rounded-3xl p-10 min-h-[28rem] relative overflow-hidden border border-ink/5 shadow-sm"
      aria-label="Painel atmosférico"
    >
      {/* Placeholder. Quando a Fase 7 chegar, a foto substitui este gradiente. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-paper via-sand/30 to-ink/15" />

      <div>
        <p className="font-serif italic text-ink/75 text-3xl tracking-tight leading-tight">
          {current.description.toLowerCase()}
          <span className="text-amber">.</span>
        </p>
        <p className="text-ink/50 text-xs mt-3 uppercase tracking-[0.18em]">
          {location.name}
        </p>
      </div>
    </aside>
  )
}
