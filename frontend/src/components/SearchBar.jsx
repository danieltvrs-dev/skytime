import { useState } from 'react'
import { Search } from 'lucide-react'

/**
 * Barra de busca por cidade. Visível sempre no topo da página.
 *
 * Props:
 *   onSearch: callback chamado com o nome da cidade ao submeter o form.
 */
export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length === 0) return
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 lg:max-w-md">
      <div className="relative">
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
    </form>
  )
}
