import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

/**
 * Botão de alternar tema (claro/escuro).
 *
 * Esta etapa cobre só o visual: o botão troca de sol pra lua com animação,
 * mas o tema do site ainda não muda. O `isDark` é estado local provisório —
 * no próximo commit ele migra pra um contexto global (similar ao UnitsContext)
 * e passa a controlar a classe .dark no <html>.
 *
 * Animações:
 *   - Hover: wrapper do ícone roda 180° suave (~500ms)
 *   - Clique: sol sai com fade + scale 0 + rotação; lua entra do outro lado,
 *     mesma duração. Os dois ícones ficam empilhados absolutamente no mesmo
 *     ponto e alternam por opacity/scale/rotate baseados no estado.
 *
 * Estilo do botão replica o de geolocalização do SearchBar pra simetria.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  const handleClick = () => {
    setIsDark((prev) => !prev)
    // placeholder — wiring real (classe .dark + persistência) entra no próximo commit
    console.log('toggle theme')
  }

  const label = isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className="group p-2.5 rounded-2xl bg-white/75 backdrop-blur-sm border border-navy/20 text-ink/70 hover:text-amber hover:border-amber/40 focus:outline-none focus:ring-2 focus:ring-amber/20 transition"
    >
      <span className="relative block w-5 h-5 transition-transform duration-500 group-hover:rotate-180">
        <Sun
          className={`absolute inset-0 transition-all duration-500 ${
            isDark
              ? 'opacity-0 scale-0 rotate-90'
              : 'opacity-100 scale-100 rotate-0'
          }`}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <Moon
          className={`absolute inset-0 transition-all duration-500 ${
            isDark
              ? 'opacity-100 scale-100 rotate-0'
              : 'opacity-0 scale-0 -rotate-90'
          }`}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </span>
    </button>
  )
}
