import { useEffect } from 'react'
import { X } from 'lucide-react'

import Switch from './Switch'
import ThemeToggle from './ThemeToggle'
import { useMotion } from '../contexts/MotionContext'

/**
 * Painel lateral de preferências e informações do Skytime.
 *
 * Comportamento:
 *   - Desliza da esquerda quando isOpen vira true
 *   - Backdrop translúcido por trás; clique nele fecha a sidebar
 *   - Tecla ESC fecha a sidebar
 *   - Scroll do body fica travado enquanto aberta (evita scroll do dashboard
 *     por trás disputar com a sidebar)
 *   - Em telas pequenas (<sm) ocupa 100% da largura; >= sm fica em 320px
 *
 * Seções:
 *   - Tema: toggle pílula light/dark
 *   - Sobre: créditos das APIs externas + link do repositório no GitHub
 *   - Rodapé com tagline editorial (espelha o Footer da página)
 *
 * Layout flex-col: header fixo no topo, conteúdo no meio (com scroll se
 * precisar), rodapé colado no bottom da sidebar.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { reduceMotion, setReduceMotion } = useMotion()

  // ESC fecha a sidebar. Listener só ativo enquanto aberta.
  useEffect(() => {
    if (!isOpen) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Trava o scroll do body enquanto a sidebar está aberta pra evitar que
  // o dashboard atrás role junto com a sidebar.
  useEffect(() => {
    if (!isOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop — semitransparente navy + blur sutil. Clique fecha. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Painel — desliza da esquerda. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Preferências"
        className={`fixed top-0 left-0 h-full w-full sm:w-80 bg-surface shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabeçalho da sidebar — lockup completo da marca + botão fechar.
         * Logo tile + wordmark "Skytime" em destaque; "Preferências" entra
         * como subtítulo discreto pra não competir com a marca. */}
        <header className="flex items-start justify-between px-5 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt=""
              aria-hidden="true"
              className="w-11 h-11 shrink-0"
            />
            <div className="leading-tight">
              <p className="font-display text-xl font-bold tracking-tight text-ink">
                Skytime
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-ink/55 mt-0.5">
                Preferências
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="p-2 rounded-xl text-ink/70 hover:text-amber hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-amber/30 transition -mr-1"
          >
            <X className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </header>

        {/* Conteúdo — flex-1 ocupa todo o espaço disponível, com scroll
         * se precisar quando a sidebar ganhar mais seções. */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-ink/55 mb-3">
              Tema
            </h3>
            <ThemeToggle />
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-ink/55 mb-3">
              Acessibilidade
            </h3>
            <Switch
              checked={reduceMotion}
              onChange={setReduceMotion}
              label="Reduzir animações"
            />
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-ink/55 mb-3">
              Sobre
            </h3>
            <div className="text-sm text-ink/70 space-y-2 leading-relaxed">
              <p>
                Dados meteorológicos da{' '}
                <SidebarLink href="https://open-meteo.com">
                  Open-Meteo
                </SidebarLink>
                .
              </p>
              <p>
                Mapas da{' '}
                <SidebarLink href="https://www.openstreetmap.org">
                  OpenStreetMap
                </SidebarLink>
                {' & '}
                <SidebarLink href="https://carto.com">CARTO</SidebarLink>.
              </p>
              <p className="pt-1">
                <SidebarLink href="https://github.com/danieltvrs-dev/skytime">
                  Código no GitHub
                </SidebarLink>
              </p>
            </div>
          </section>
        </div>

        {/* Rodapé editorial — fica colado no bottom da sidebar */}
        <footer className="px-5 py-5 border-t border-border shrink-0">
          <p className="font-serif italic text-lg text-ink/75 leading-snug">
            Skytime
          </p>
          <p className="text-xs text-ink/45 tracking-wide mt-1">
            Seu céu, minuto a minuto.
          </p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-ink/35 mt-3 tabular-nums">
            v1.0 · {new Date().getFullYear()}
          </p>
        </footer>
      </aside>
    </>
  )
}

function SidebarLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-amber hover:text-amber/80 underline-offset-2 hover:underline transition"
    >
      {children}
    </a>
  )
}
