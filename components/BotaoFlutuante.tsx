'use client'
import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function BotaoFlutuante() {
  const [visivel, setVisivel] = useState(false)
  const [fechado, setFechado] = useState(false)

  useEffect(() => {
    function onScroll() {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (pct >= 0.3 && !fechado) setVisivel(true)
      else if (pct < 0.3) setVisivel(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [fechado])

  if (!visivel) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-2 animate-fade-up">
      <div className="bg-white border border-amf-border rounded-2xl px-4 py-3 shadow-xl mb-1">
        {/* toque vermelho no label */}
        <p className="text-amf-red text-xs font-semibold">Fabricante direto · Melhor preço</p>
        <p className="text-amf-muted text-xs mb-2">Resposta em minutos</p>
        {/* botão verde para induzir clique */}
        <a href="https://wa.me/5531986239665?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20um%20orçamento."
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-amf-green hover:bg-amf-green-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-green-200">
          <MessageCircle className="w-4 h-4" /> Falar agora
        </a>
      </div>
      <button onClick={() => { setVisivel(false); setFechado(true) }}
        className="w-7 h-7 bg-white border border-amf-border rounded-full flex items-center justify-center text-amf-muted hover:text-amf-navy transition-colors self-start shadow">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
