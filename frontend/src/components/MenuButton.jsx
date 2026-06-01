/**
 * Botão de abrir a sidebar. Estilo casado com o botão de geo do SearchBar
 * (mesmo container redondo, mesmo padding, mesma altura).
 *
 * Ícone: 3 linhas horizontais (formato hambúrguer universal) com a do meio
 * em âmbar — assinatura sutil da marca, evitando o ícone totalmente genérico
 * sem virar cartoon.
 */
export default function MenuButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir menu de preferências"
      title="Menu"
      className="p-2.5 rounded-2xl bg-white/75 backdrop-blur-sm border border-navy/20 text-ink/70 hover:text-amber hover:border-amber/40 focus:outline-none focus:ring-2 focus:ring-amber/20 transition shrink-0"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="4" y1="6" x2="16" y2="6" stroke="currentColor" />
        <line x1="4" y1="10" x2="16" y2="10" stroke="#F9A03F" />
        <line x1="4" y1="14" x2="16" y2="14" stroke="currentColor" />
      </svg>
    </button>
  )
}
