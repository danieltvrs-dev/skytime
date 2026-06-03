/**
 * Switch toggle reusável (track + thumb).
 * ON: track âmbar, thumb deslizado pra direita
 * OFF: track translúcido, thumb à esquerda
 *
 * Props:
 *   checked:   boolean — estado atual
 *   onChange:  callback (next: boolean)
 *   label:     string — texto à esquerda do switch
 *   ariaLabel: string opcional — usado se label não for descritivo o suficiente
 */
export default function Switch({ checked, onChange, label, ariaLabel }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-sm text-ink/80">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber/30 ${
          checked ? 'bg-amber' : 'bg-ink/15'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-cream shadow-sm transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
          aria-hidden="true"
        />
      </button>
    </label>
  )
}
