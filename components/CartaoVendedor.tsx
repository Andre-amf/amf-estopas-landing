import { Phone, MessageCircle, Star, Clock } from 'lucide-react'

const WA = 'https://wa.me/5531986239665?text=Olá!%20Gostaria%20de%20falar%20com%20um%20consultor%20da%20AMF%20Estopas.'

export default function CartaoVendedor() {
  return (
    <section className="py-20 bg-amf-light px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-amf-red" />
            <span className="text-amf-red text-xs tracking-widest uppercase font-semibold">Atendimento</span>
            <div className="h-px w-8 bg-amf-red" />
          </div>
          <h2 className="font-display text-3xl font-bold text-amf-navy">Fale com um Consultor</h2>
        </div>

        <div className="bg-white border border-amf-border rounded-3xl p-8 text-center shadow-sm">

          {/* Logo AMF no lugar da foto genérica */}
          <div className="relative w-28 h-28 mx-auto mb-5 bg-amf-light rounded-full flex items-center justify-center border-2 border-amf-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-amf.png" alt="AMF Estopas" className="w-20 h-20 object-contain" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amf-green rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
          </div>

          <h3 className="text-amf-navy font-bold text-xl mb-1">Equipe AMF Estopas</h3>
          <p className="text-amf-muted text-sm mb-1">Especialistas em materiais de limpeza industrial</p>
          <div className="h-0.5 w-12 bg-amf-red rounded-full mx-auto mb-5" />

          <div className="flex justify-center gap-6 mb-7 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amf-green fill-amf-green" />
              <span className="text-amf-navy font-semibold">4.9</span>
            </div>
            <div className="h-4 w-px bg-amf-border" />
            <span className="text-amf-muted">+500 clientes</span>
            <div className="h-4 w-px bg-amf-border" />
            <span className="text-amf-muted">+30 anos</span>
          </div>

          <div className="space-y-3">
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-amf-green hover:bg-amf-green-dark text-white font-semibold py-3.5 rounded-2xl transition-all hover:scale-105 shadow-md shadow-green-200">
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <a href="tel:+553134113509"
              className="flex items-center justify-center gap-2 w-full bg-white border border-amf-border hover:border-amf-green/50 text-amf-navy font-semibold py-3.5 rounded-2xl transition-all hover:scale-105">
              <Phone className="w-5 h-5 text-amf-green" /> (31) 3411-3509
            </a>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-5 text-amf-muted text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>Seg–Sex 8h–18h · Sáb 8h–12h</span>
          </div>
        </div>
      </div>
    </section>
  )
}
