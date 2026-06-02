import { useEffect } from 'react'
import { X } from 'lucide-react'

import ThemeToggle from './ThemeToggle'

/**
 * Painel lateral de preferências do Skytime.
 *
 * Comportamento:
 *   - Desliza da esquerda quando isOpen vira true
 *   - Backdrop translúcido por trás; clique nele fecha a sidebar
 *   - Tecla ESC fecha a sidebar
 *   - Scroll do body fica travado enquanto aberta (evita scroll do dashboard
 *     por trás disputar com a sidebar)
 *   - Em telas pequenas (<sm) ocupa 100% da largura; >= sm fica em 320px
 *
 * Conteúdo nesta primeira iteração: só a seção Tema com o toggle pílula.
 * Outras preferências (°C/°F, cidade padrão, histórico) ficam onde estão
 * até decidirmos se a sidebar vale a pena.
 */
export default function Sidebar({ isOpen, onClose }) {
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
        className={`fixed top-0 left-0 h-full w-full sm:w-80 bg-surface shadow-2xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabeçalho da sidebar — título + botão fechar */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-serif text-xl text-ink">Preferências</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="p-2 rounded-xl text-ink/70 hover:text-amber hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-amber/30 transition"
          >
            <X className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </header>

        {/* Conteúdo — uma seção por preferência */}
        <div className="px-5 py-6 space-y-6">
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-ink/55 mb-3">
              Tema
            </h3>
            <ThemeToggle />
          </section>
        </div>
      </aside>
    </>
  )
}
