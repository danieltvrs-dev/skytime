import { useState } from 'react'

/**
 * Botão de alternar tema (claro/escuro), inspirado em referência do Figma.
 *
 * Design pílula com cenário:
 *   - light:  pílula azul-petróleo + sol amarelo à esquerda + silhueta de nuvens
 *   - dark:   pílula grafite + lua cinza à direita + 6 estrelas espalhadas
 *
 * O sol e a lua deslizam horizontalmente entre as duas posições com crossfade,
 * dando a leitura de "amanhecer/anoitecer" no clique. O fundo da pílula
 * transita de cor junto. Sombras 3D vieram do Figma e foram reduzidas pra
 * caber na escala (144×56).
 *
 * Esta etapa cobre só o visual — o tema do site ainda não muda. O `isDark` é
 * estado local provisório; no próximo commit ele migra pra contexto global
 * e passa a controlar a classe .dark no <html>.
 *
 * Assets em frontend/public/theme-toggle/ (sun, moon, cloud, star).
 */

// Posições das estrelas, em % da pílula, espalhadas pra parecer constelação.
// Evitam a metade direita onde a lua aterrissa pra não competir visualmente.
const STARS = [
  { top: '22%', left: '14%' },
  { top: '58%', left: '8%' },
  { top: '32%', left: '28%' },
  { top: '72%', left: '24%' },
  { top: '20%', left: '44%' },
  { top: '62%', left: '40%' },
]

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
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      className="relative w-36 h-14 rounded-full overflow-hidden transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-amber/40 shrink-0"
      style={{
        backgroundColor: isDark ? '#32383A' : '#006786',
        boxShadow: [
          'inset -1px 3px 4px rgba(0,0,0,0.45)',
          'inset 0 -2px 2px rgba(0,0,0,0.4)',
          '0 2px 3px rgba(0,0,0,0.35)',
        ].join(', '),
      }}
    >
      {/* Nuvens — só visíveis no modo claro, ancoradas no canto inferior direito */}
      <img
        src="/theme-toggle/cloud.svg"
        alt=""
        aria-hidden="true"
        className={`absolute -bottom-1 -right-2 w-28 pointer-events-none transition-opacity duration-500 ${
          isDark ? 'opacity-0' : 'opacity-90'
        }`}
      />

      {/* Estrelas — só visíveis no modo escuro */}
      {STARS.map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`absolute pointer-events-none transition-opacity duration-500 ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ top: pos.top, left: pos.left }}
        >
          <img src="/theme-toggle/star.svg" alt="" className="w-1.5 h-1.5" />
        </span>
      ))}

      {/* Sol — esquerda no modo claro, desliza pra fora no escuro */}
      <img
        src="/theme-toggle/sun.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 w-9 h-9 transition-all duration-500 ease-out pointer-events-none"
        style={{
          left: isDark ? '-30%' : '6px',
          opacity: isDark ? 0 : 1,
        }}
      />

      {/* Lua — direita no modo escuro, desliza pra fora no claro */}
      <img
        src="/theme-toggle/moon.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 w-9 h-9 transition-all duration-500 ease-out pointer-events-none"
        style={{
          right: isDark ? '6px' : '-30%',
          opacity: isDark ? 1 : 0,
        }}
      />
    </button>
  )
}
