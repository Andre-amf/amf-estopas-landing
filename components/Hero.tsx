'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, BadgeCheck, Factory, MessageCircle } from 'lucide-react'

const slides = [
  { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80', alt: 'Fábrica industrial AMF Estopas' },
  { url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1920&q=80', alt: 'Produção industrial de estopas' },
  { url: 'https://images.unsplash.com/photo-1565793979706-d73e9a28a78b?w=1920&q=80', alt: 'Linha de produção têxtil' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80', alt: 'Materiais de limpeza industrial' },
  { url: 'https://images.unsplash.com/photo-1527515637462-cff94aca0e83?w=1920&q=80', alt: 'Panos industriais de alta qualidade' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <Image src={slide.url} alt={slide.alt} fill className="object-cover" priority={i === 0} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />
        </div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-16">

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-up">
          {[
            { icon: <Factory className="w-3.5 h-3.5 text-amf-green" />, label: 'Fabricante Direto' },
            { icon: <BadgeCheck className="w-3.5 h-3.5 text-amf-green" />, label: 'Desde 1990 · BH/MG' },
            { icon: <Star className="w-3.5 h-3.5 text-amf-green fill-amf-green" />, label: '4.9 · +500 clientes' },
          ].map(b => (
            <span key={b.label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white px-3 py-1.5 rounded-full">
              {b.icon} {b.label}
            </span>
          ))}
        </div>

        {/* Logo real */}
        <div className="flex justify-center mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-2xl shadow-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-amf.png" alt="AMF Estopas e Panos para Limpeza" className="h-20 w-auto" />
          </div>
        </div>

        <p className="text-white/60 text-xs tracking-[0.25em] uppercase mb-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          Estopa Industrial · Panos de Limpeza · Algodão para Enchimento
        </p>

        <p className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Fabricante direto com <span className="text-amf-green font-semibold">+32 produtos</span> para limpeza industrial.
          Atacado e varejo · Pronta entrega para todo o Brasil.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <a
            href="https://wa.me/5531986239665?text=Olá!%20Vim%20pelo%20site%20da%20AMF%20Estopas%20e%20gostaria%20de%20um%20orçamento."
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-amf-green hover:bg-amf-green-dark text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-900/40"
          >
            <MessageCircle className="w-5 h-5" /> Solicitar Orçamento no WhatsApp
          </a>
          <a
            href="#produtos"
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            Ver Catálogo Completo
          </a>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <span className="text-white/30 text-xs uppercase tracking-widest">Role para ver mais</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>

      <button onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 border border-white/20 p-2 rounded-xl transition-all">
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 border border-white/20 p-2 rounded-xl transition-all">
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-amf-green' : 'w-2 h-2 bg-white/30'}`} />
        ))}
      </div>
    </section>
  )
}
