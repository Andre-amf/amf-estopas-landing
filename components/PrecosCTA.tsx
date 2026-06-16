import { MessageCircle, Phone, Percent, Truck, Factory } from 'lucide-react'

export default function PrecosCTA() {
  return (
    <section className="py-20 bg-amf-navy px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Toque vermelho fino */}
        <div className="inline-flex items-center gap-2 border border-amf-red/40 text-amf-red text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <Factory className="w-3.5 h-3.5" /> Fabricante Direto
        </div>

        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
          Preço de Fábrica
        </h2>
        <p className="text-white/50 mb-8">Sem intermediários · Você compra direto de quem fabrica</p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <span className="flex items-center gap-2 bg-amf-green/20 border border-amf-green/40 text-amf-green-light text-sm px-4 py-2 rounded-full">
            <Percent className="w-3.5 h-3.5" /> 3% desconto no Pix
          </span>
          <span className="flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-sm px-4 py-2 rounded-full">
            <Truck className="w-3.5 h-3.5" /> Frete grátis em BH
          </span>
        </div>

        {/* Linha vermelha fina divisória */}
        <div className="h-px bg-amf-red/30 mb-10 max-w-xs mx-auto" />

        {/* Botões verdes — induzem clique */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/5531986239665?text=Olá!%20Vim%20pelo%20site%20da%20AMF%20Estopas%20e%20gostaria%20de%20um%20orçamento."
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-amf-green hover:bg-amf-green-dark text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-900/40"
          >
            <MessageCircle className="w-5 h-5" /> Solicitar orçamento
          </a>
          <a
            href="tel:+553134113509"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <Phone className="w-5 h-5" /> Ligar agora
          </a>
        </div>

        <p className="text-white/30 text-xs mt-6">
          (31) 9.8623-9665 · (31) 3411-3509 · vendas@amfestopas.com.br
        </p>
      </div>
    </section>
  )
}
