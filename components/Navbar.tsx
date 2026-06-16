'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Menu, X } from 'lucide-react'

const links = [
  { label: 'Produtos',    href: '#produtos'   },
  { label: 'Sobre',       href: '#sobre'       },
  { label: 'Orçamento',   href: '#formulario' },
  { label: 'Localização', href: '#localizacao'},
]

const WA = 'https://wa.me/5531986239665?text=Olá!%20Vim%20pelo%20site%20da%20AMF%20Estopas%20e%20gostaria%20de%20um%20orçamento.'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md shadow-black/5 border-b border-amf-border'
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            {scrolled ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/logo-amf.png" alt="AMF Estopas" className="h-10 w-auto" />
            ) : (
              <span className="font-display text-2xl font-bold">
                <span className="text-amf-red">AMF</span>
                <span className="text-white"> Estopas</span>
              </span>
            )}
          </a>

          {/* Links desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-amf-muted hover:text-amf-navy' : 'text-white/80 hover:text-white'
                }`}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://loja.amfestopas.com.br" target="_blank" rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors border px-4 py-2 rounded-xl ${
                scrolled
                  ? 'text-amf-navy border-amf-border hover:border-amf-red/40'
                  : 'text-white border-white/30 hover:border-white'
              }`}>
              Loja Virtual
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-amf-green hover:bg-amf-green-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-green-900/30">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>

          {/* Hamburger mobile */}
          <button onClick={() => setMenuOpen(o => !o)}
            className={`md:hidden p-2 rounded-xl transition-colors ${scrolled ? 'text-amf-navy' : 'text-white'}`}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-amf-border px-6 py-4 space-y-1 shadow-lg">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="block py-3 text-amf-text font-medium border-b border-amf-border last:border-0 hover:text-amf-green transition-colors">
                {l.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <a href="https://loja.amfestopas.com.br" target="_blank" rel="noopener noreferrer"
                className="text-center py-3 border border-amf-border rounded-xl text-amf-navy font-medium text-sm">
                Loja Virtual
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-amf-green text-white rounded-xl font-semibold text-sm">
                <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
      <div className="h-0" />
    </>
  )
}
