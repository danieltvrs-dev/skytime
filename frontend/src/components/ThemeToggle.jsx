import { useState } from 'react'

/**
 * Botão de alternar tema (claro/escuro), refeito fiel à referência do Figma.
 *
 * Estrutura em camadas (de trás pra frente):
 *   1. Pílula com cor de fundo que transita (azul-petróleo ↔ grafite)
 *   2. Três arcos circulares grandes em baixa opacidade — efeito "horizonte"
 *      que dá profundidade radial
 *   3. Oito estrelas brancas (presentes em ambos os estados como no Figma,
 *      mas só visíveis no escuro porque no claro o azul-petróleo cobre)
 *   4. Duas camadas de nuvem azul-clara (uma cheia + uma translúcida atrás)
 *      no canto inferior — só no modo claro
 *   5. Sol amarelo à esquerda no claro, ou lua cinza com 3 crateras à direita
 *      no escuro, com slide + crossfade entre os dois
 *
 * Tamanho 110×44 — alinhado à altura do botão de geolocalização do header.
 *
 * Esta etapa cobre só o visual; o tema do site ainda não muda. O `isDark` é
 * estado local provisório — próximo commit migra pra contexto global.
 *
 * Assets em frontend/public/theme-toggle/.
 */

// 8 estrelas espalhadas em padrão de constelação, em % da pílula.
// Distribuídas pra cobrir tanto a esquerda (sob o sol no claro) quanto direita.
const STARS = [
  { top: '18%', left: '10%', size: 4 },
  { top: '62%', left: '6%', size: 3 },
  { top: '28%', left: '22%', size: 3 },
  { top: '72%', left: '18%', size: 4 },
  { top: '20%', left: '38%', size: 3 },
  { top: '58%', left: '34%', size: 3 },
  { top: '32%', left: '52%', size: 4 },
  { top: '70%', left: '48%', size: 3 },
]

// 3 crateras da lua, posições e tamanhos em px relativos à lua de 32×32.
// Replicam o desenho original onde tem uma cratera maior + duas menores.
const CRATERS = [
  { top: 6, left: 5, size: 6 },    // crater-1 (pequena, topo-esquerda)
  { top: 14, left: 13, size: 12 }, // crater-2 (grande, centro-direita)
  { top: 19, left: 4, size: 4 },   // crater-3 (mini, base-esquerda)
]

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  const handleClick = () => {
    setIsDark((prev) => !prev)
    // placeholder — wiring real entra no próximo commit
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
      className="relative w-[110px] h-[44px] rounded-full overflow-hidden transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-amber/40 shrink-0"
      style={{
        backgroundColor: isDark ? '#32383A' : '#006786',
        boxShadow: [
          'inset -1px 3px 4px rgba(0,0,0,0.45)',
          'inset 0 -2px 2px rgba(0,0,0,0.4)',
          '0 2px 2px rgba(0,0,0,0.35)',
          '0 -1px 2px rgba(0,0,0,0.25)',
        ].join(', '),
      }}
    >
      {/* Arcos do fundo — 3 círculos grandes em baixa opacidade. */}
      <img
        src="/theme-toggle/arc-3.svg"
        alt=""
        aria-hidden="true"
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[140px] pointer-events-none"
      />
      <img
        src="/theme-toggle/arc-2.svg"
        alt=""
        aria-hidden="true"
        className="absolute -top-7 left-1/2 -translate-x-1/2 w-[110px] pointer-events-none"
      />
      <img
        src="/theme-toggle/arc-1.svg"
        alt=""
        aria-hidden="true"
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-[80px] pointer-events-none"
      />

      {/* Estrelas — sempre renderizadas, só visíveis no escuro. */}
      {STARS.map((pos, i) => (
        <img
          key={i}
          src="/theme-toggle/star.svg"
          alt=""
          aria-hidden="true"
          className={`absolute pointer-events-none transition-opacity duration-500 ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: pos.top,
            left: pos.left,
            width: `${pos.size}px`,
            height: `${pos.size}px`,
          }}
        />
      ))}

      {/* Nuvens — duas camadas (frente + trás translúcida), só no claro. */}
      <img
        src="/theme-toggle/cloud-back.svg"
        alt=""
        aria-hidden="true"
        className={`absolute -bottom-0.5 -right-3 w-[100px] pointer-events-none transition-opacity duration-500 ${
          isDark ? 'opacity-0' : 'opacity-70'
        }`}
      />
      <img
        src="/theme-toggle/cloud.svg"
        alt=""
        aria-hidden="true"
        className={`absolute bottom-0 -right-2 w-[90px] pointer-events-none transition-opacity duration-500 ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Sol — esquerda no claro, desliza pra fora pela esquerda no escuro. */}
      <img
        src="/theme-toggle/sun.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 w-8 h-8 transition-all duration-500 ease-out pointer-events-none"
        style={{
          left: isDark ? '-30%' : '6px',
          opacity: isDark ? 0 : 1,
        }}
      />

      {/* Lua + crateras — direita no escuro, desliza pra fora pela direita no claro. */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-8 h-8 transition-all duration-500 ease-out pointer-events-none"
        style={{
          right: isDark ? '6px' : '-30%',
          opacity: isDark ? 1 : 0,
        }}
      >
        <img
          src="/theme-toggle/moon.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
        />
        {CRATERS.map((crater, i) => (
          <img
            key={i}
            src={`/theme-toggle/crater-${i + 1}.svg`}
            alt=""
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: `${crater.top}px`,
              left: `${crater.left}px`,
              width: `${crater.size}px`,
              height: `${crater.size}px`,
            }}
          />
        ))}
      </div>
    </button>
  )
}
