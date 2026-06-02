import Card from './Card'

/**
 * Estado de carregamento do dashboard — "fantasma" que reproduz a estrutura
 * das seções reais com blocos translúcidos pulsantes. Usa o mesmo primitivo
 * Card que as seções reais, garantindo que o skeleton não saia do tom quando
 * o design dos cards muda.
 */
export default function SkeletonDashboard() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <SkeletonWeatherCard />
        <SkeletonAtmosphericPanel />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <SkeletonTextCard height="h-28" />
        <SkeletonTextCard height="h-48" />
      </div>

      <SkeletonHourly />
      <SkeletonDaily />
    </>
  )
}

function SkeletonWeatherCard() {
  return (
    <Card variant="lightHero" className="p-8 animate-pulse">
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
    </Card>
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

function SkeletonTextCard({ height }) {
  return (
    <Card className={`p-6 animate-pulse ${height}`}>
      <div className="h-3 w-24 bg-ink/10 rounded mb-4" />
      <div className="h-4 w-3/4 bg-ink/10 rounded mb-2" />
      <div className="h-4 w-2/3 bg-ink/10 rounded" />
    </Card>
  )
}

function SkeletonHourly() {
  return (
    <Card className="px-6 py-4 animate-pulse">
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
    </Card>
  )
}

function SkeletonDaily() {
  return (
    <Card variant="dark" className="p-6 animate-pulse">
      <div className="h-3 w-32 bg-cream/15 rounded mb-4" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-3.5 border-t border-cream/10 first:border-t-0"
        >
          <div className="h-4 w-20 bg-cream/15 rounded" />
          <div className="h-6 w-6 bg-cream/15 rounded-full" />
          <div className="flex-1" />
          <div className="h-4 w-20 bg-cream/15 rounded" />
        </div>
      ))}
    </Card>
  )
}
