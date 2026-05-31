import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

/**
 * Botão de compartilhar a URL atual da cidade.
 *
 * - Em mobile com Web Share API (Android/iOS modernos): abre o menu nativo
 *   de compartilhamento — WhatsApp, Twitter, mensagens, etc.
 * - Em desktop ou navegadores sem suporte: copia a URL pro clipboard e
 *   mostra "Link copiado" por 2s.
 */
export default function ShareButton({ cityName }) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    const url = window.location.href
    const shareData = {
      title: `Skytime — ${cityName}`,
      text: `Confira o clima em ${cityName}`,
      url,
    }

    // Tenta Web Share primeiro (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        // Usuário cancelou o menu de share — não é erro.
        if (err?.name === 'AbortError') return
        // Outras falhas: cai pro clipboard.
      }
    }

    // Fallback: copia URL pro clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard indisponível — silencioso */
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-[11px] tracking-wide uppercase text-ink/45 hover:text-ink transition"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" strokeWidth={2.5} aria-hidden="true" />
          Link copiado
        </>
      ) : (
        <>
          <Share2 className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
          Compartilhar
        </>
      )}
    </button>
  )
}
