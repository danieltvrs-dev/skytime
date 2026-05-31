import { Sun } from 'lucide-react'

/**
 * Botão de alternar tema (claro/escuro).
 *
 * Nesta primeira etapa o botão é puramente visual — clique só registra no
 * console como placeholder. A funcionalidade real (tokens semânticos, classe
 * .dark no <html>, persistência em localStorage) entra num commit separado,
 * depois que a posição e o visual forem aprovados.
 *
 * Estilo replica o botão de geolocalização do SearchBar pra simetria visual.
 */
export default function ThemeToggle() {
  const handleClick = () => {
    // placeholder — wiring real entra no próximo commit
    console.log('toggle theme')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Alternar tema claro e escuro"
      title="Alternar tema"
      className="p-2.5 rounded-2xl bg-white/75 backdrop-blur-sm border border-navy/20 text-ink/70 hover:text-amber hover:border-amber/40 focus:outline-none focus:ring-2 focus:ring-amber/20 transition"
    >
      <Sun className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}
