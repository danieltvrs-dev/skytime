import { useState } from 'react'
import { Loader2, MapPin, Search } from 'lucide-react'

/**
 * Barra de busca por cidade. Botão de geolocalização opcional ao lado.
 *
 * Props:
 *   onSearch:       callback (city: string) chamado ao submeter o form
 *   onUseLocation:  callback () opcional; se ausente, o botão não aparece
 *   isLocating:     boolean opcional; troca o ícone do botão por spinner
 */
export default function SearchBar({ onSearch, onUseLocation, isLocating }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length === 0) return
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 lg:max-w-md">
      <div className="relative flex-1">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 pointer-events-none"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar outra cidade..."
          aria-label="Buscar cidade"
          autoComplete="off"
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/55 backdrop-blur-sm border border-ink/10 text-ink placeholder:text-ink/45 focus:outline-none focus:border-amber/50 focus:ring-2 focus:ring-amber/20 transition"
        />
      </div>

      {onUseLocation && (
        <button
          type="button"
          onClick={onUseLocation}
          disabled={isLocating}
          aria-label="Usar minha localização"
          title="Usar minha localização"
          className="p-2.5 rounded-2xl bg-white/55 backdrop-blur-sm border border-ink/10 text-ink/70 hover:text-amber hover:border-amber/40 focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-50 disabled:cursor-wait transition"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <MapPin className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      )}
    </form>
  )
}
