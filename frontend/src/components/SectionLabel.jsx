/**
 * Label de seção: maiúsculo pequeno, tracking generoso.
 * Usado como h3 padrão dentro de Cards.
 *
 * Tom:
 *   light — sobre fundos claros (text-ink/55)
 *   dark  — sobre fundos escuros (text-paper/50)
 */
const TONES = {
  light: 'text-ink/55',
  dark: 'text-paper/50',
}

export default function SectionLabel({
  tone = 'light',
  className = '',
  children,
}) {
  return (
    <h3
      className={`text-[11px] font-medium tracking-[0.14em] uppercase ${TONES[tone]} ${className}`}
    >
      {children}
    </h3>
  )
}
