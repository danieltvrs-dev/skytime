/**
 * Estado de carregamento do dashboard — "fantasma" que reproduz a estrutura
 * das seções reais com blocos translúcidos pulsantes. Substitui o spinner antigo.
 * Animação `animate-pulse` do Tailwind dá a sensação de "vivo, carregando".
 */
export default function SkeletonDashboard() {
  return (
    <>
      {/* Zona 1: WeatherCard + AtmosphericPanel */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <SkeletonWeatherCard />
        <SkeletonAtmosphericPanel />
      </div>

      {/* Zona 2: 2 cards lado a lado */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-48" />
      </div>

      <SkeletonHourly />
      <SkeletonDaily />
    </>
  )
}

function SkeletonWeatherCard() {
  return (
    <div className="rounded-3xl p-8 bg-white/55 backdrop-blur-sm border border-ink/5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-7 w-44 bg-ink/10 rounded" />
          <div className="h-3 w-28 bg-ink/10 rounded mt-3" />
        </div>
        <div className="h-14 w-14 bg-ink/10 rounded-full" />
      </div>
      <div className="h-24 w-36 bg-ink/15 rounded mb-3" />
      <div className="h-4 w-32 bg-ink/10 rounded mb-8" />
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ink/10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 w-4 bg-ink/10 rounded" />
            <div className="h-3 w-12 bg-ink/10 rounded" />
            <div className="h-4 w-10 bg-ink/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonAtmosphericPanel() {
  return (
    <div
      className="hidden lg:block rounded-3xl min-h-[28rem] relative overflow-hidden border border-ink/5 shadow-sm animate-pulse"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-paper via-sand/30 to-ink/15" />
    </div>
  )
}

function SkeletonCard({ height }) {
  return (
    <div
      className={`rounded-3xl p-6 bg-white/45 backdrop-blur-sm border border-ink/5 shadow-sm animate-pulse ${height}`}
    >
      <div className="h-3 w-24 bg-ink/10 rounded mb-4" />
      <div className="h-4 w-3/4 bg-ink/10 rounded mb-2" />
      <div className="h-4 w-2/3 bg-ink/10 rounded" />
    </div>
  )
}

function SkeletonHourly() {
  return (
    <div className="rounded-3xl px-6 py-4 bg-white/45 backdrop-blur-sm border border-ink/5 shadow-sm animate-pulse">
      <div className="h-3 w-32 bg-ink/10 rounded mb-3" />
      <div className="flex gap-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 min-w-12">
            <div className="h-3 w-8 bg-ink/10 rounded" />
            <div className="h-5 w-5 bg-ink/10 rounded-full" />
            <div className="h-3 w-7 bg-ink/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonDaily() {
  return (
    <div className="rounded-3xl p-6 bg-ink border border-paper/10 shadow-md animate-pulse">
      <div className="h-3 w-32 bg-paper/15 rounded mb-4" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-3.5 border-t border-paper/10 first:border-t-0"
        >
          <div className="h-4 w-20 bg-paper/15 rounded" />
          <div className="h-6 w-6 bg-paper/15 rounded-full" />
          <div className="flex-1" />
          <div className="h-4 w-20 bg-paper/15 rounded" />
        </div>
      ))}
    </div>
  )
}
