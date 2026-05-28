import { MapPin, X } from 'lucide-react'

/**
 * Linha discreta de chips com as cidades pesquisadas recentemente.
 * Posicionada logo abaixo da SearchBar, sem card ao redor, pra não
 * competir visualmente com a hierarquia da Zona 1.
 *
 * Props:
 *   entries:      array vindo de getHistory() do backend
 *   onSelectCity: callback (cityName) ao clicar num chip
 *   onDelete:     callback (id) ao clicar no "×" do chip
 */
export default function SearchHistory({ entries, onSelectCity, onDelete }) {
  if (!entries || entries.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-ink/45 uppercase tracking-[0.14em] mr-1">
        Recentes
      </span>
      {entries.map((entry) => (
        <HistoryChip
          key={entry.id}
          entry={entry}
          onSelect={onSelectCity}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

function HistoryChip({ entry, onSelect, onDelete }) {
  return (
    <div className="group flex items-center gap-1.5 rounded-full bg-ink/5 border border-ink/10 hover:bg-ink/10 hover:border-ink/20 transition">
      <button
        type="button"
        onClick={() => onSelect(entry.city_name)}
        className="flex items-center gap-1.5 pl-3 pr-1 py-1.5 text-ink"
        title={`Buscar ${entry.city_name}`}
      >
        <MapPin
          className="w-3 h-3 text-amber"
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="font-medium">{entry.city_name}</span>
      </button>
      <button
        type="button"
        onClick={() => onDelete(entry.id)}
        aria-label={`Remover ${entry.city_name} do histórico`}
        title="Remover do histórico"
        className="pr-2.5 py-1.5 text-ink/40 hover:text-ink/80 opacity-60 group-hover:opacity-100 transition"
      >
        <X className="w-3 h-3" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  )
}
