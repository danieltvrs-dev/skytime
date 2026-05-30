/**
 * Rodapé editorial — encerra a jornada vertical no graphite escuro
 * com atribuições às APIs públicas e link do repositório.
 */
export default function Footer() {
  return (
    <footer className="mt-8 pt-8 border-t border-paper/10 text-paper/55 text-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-serif italic text-lg text-paper/75 leading-snug">
            Skytime
          </p>
          <p className="mt-1 text-xs text-paper/45 tracking-wide">
            Seu céu, minuto a minuto.
          </p>
        </div>

        <div className="text-xs leading-relaxed">
          <p>
            Dados meteorológicos da{' '}
            <Link href="https://open-meteo.com">Open-Meteo</Link>.
          </p>
          <p>
            Mapas da{' '}
            <Link href="https://www.openstreetmap.org">OpenStreetMap</Link>
            {' & '}
            <Link href="https://carto.com">CARTO</Link>.
          </p>
          <p className="mt-2">
            <Link href="https://github.com/danieltvrs-dev/skytime">
              Código no GitHub
            </Link>
            <span className="text-paper/30 mx-2">·</span>
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

function Link({ href, children }) {
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
