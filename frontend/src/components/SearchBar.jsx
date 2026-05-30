import { useEffect, useRef, useState } from 'react'
import { Loader2, MapPin, Search } from 'lucide-react'

import { geocodeSuggestions } from '../services/weather'

const DEBOUNCE_MS = 250
const MIN_QUERY_LENGTH = 2

/**
 * Barra de busca por cidade com autocomplete + botão de geolocalização opcional.
 *
 * Props:
 *   onSearch:       callback (city: string) chamado ao escolher uma sugestão
 *                   ou submeter o form com o texto livre.
 *   onUseLocation:  callback () opcional; se ausente, o botão não aparece.
 *   isLocating:     boolean opcional; troca o ícone do botão por spinner.
 */
export default function SearchBar({ onSearch, onUseLocation, isLocating }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  // Quando o usuário escolhe uma sugestão, preenchemos o input com o nome dela.
  // Sem esse flag, o useEffect abaixo dispararia outra busca pra exatamente
  // aquele nome e a resposta seria descartada quando o dropdown fecha.
  const skipNextFetchRef = useRef(false)

  // Busca sugestões com debounce a cada keystroke depois de N caracteres.
  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false
      return
    }
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([])
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      geocodeSuggestions(query.trim(), 5)
        .then((data) => { if (!cancelled) setSuggestions(data) })
        .catch(() => { if (!cancelled) setSuggestions([]) })
    }, DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  // Fecha o dropdown ao clicar fora. Só monta o listener enquanto o
  // dropdown está aberto — evita listener global ocioso o resto do tempo.
  useEffect(() => {
    if (!isOpen) return undefined
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length === 0) return
    onSearch(trimmed)
    setIsOpen(false)
  }

  const handleSelectSuggestion = (suggestion) => {
    skipNextFetchRef.current = true
    setQuery(suggestion.name)
    setIsOpen(false)
    onSearch(suggestion.name)
  }

  const showDropdown = isOpen && suggestions.length > 0

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className="flex-1 flex items-center gap-2 lg:max-w-md relative"
    >
      <div className="relative flex-1">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 pointer-events-none"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar outra cidade..."
          aria-label="Buscar cidade"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          autoComplete="off"
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/75 backdrop-blur-sm border border-navy/20 text-ink placeholder:text-ink/45 focus:outline-none focus:border-amber/50 focus:ring-2 focus:ring-amber/20 transition"
        />

        {showDropdown && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-paper/95 backdrop-blur-sm border border-ink/10 shadow-lg overflow-hidden z-20"
          >
            {suggestions.map((suggestion, index) => (
              <li key={`${suggestion.name}-${suggestion.latitude}-${index}`}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  role="option"
                  aria-selected={false}
                  className="w-full flex items-baseline gap-2 px-4 py-2.5 text-left hover:bg-ink/5 transition"
                >
                  <span className="font-medium text-ink truncate">
                    {suggestion.name}
                  </span>
                  <span className="text-ink/55 text-xs truncate">
                    {[suggestion.admin1, suggestion.country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {onUseLocation && (
        <button
          type="button"
          onClick={onUseLocation}
          disabled={isLocating}
          aria-label="Usar minha localização"
          title="Usar minha localização"
          className="p-2.5 rounded-2xl bg-white/75 backdrop-blur-sm border border-navy/20 text-ink/70 hover:text-amber hover:border-amber/40 focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-50 disabled:cursor-wait transition"
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
