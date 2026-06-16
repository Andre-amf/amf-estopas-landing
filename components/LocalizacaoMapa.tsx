import { MapPin, Phone, Globe, Clock, Truck, Gift } from 'lucide-react'

const infos = [
  { icon: MapPin, titulo: 'Fábrica',           texto: 'Rua Rita Ferreira, 40 – Jd Montanhes\nBelo Horizonte – MG · CEP 30.750-190' },
  { icon: Phone,  titulo: 'Comercial',         texto: '(31) 9.8623-9665\n(31) 3411-3509' },
  { icon: Globe,  titulo: 'Loja Online',       texto: 'loja.amfestopas.com.br\nwww.amfestopas.com.br' },
  { icon: Clock,  titulo: 'Atendimento',       texto: 'Seg a Sex: 8h – 18h\nSábado: 8h – 12h' },
  { icon: Truck,  titulo: 'Prazo de entrega',  texto: 'BH: 1 dia útil\nDemais regiões: 3 a 7 dias' },
  { icon: Gift,   titulo: 'Frete Grátis BH',   texto: 'Pedidos acima de R$ 300\npara Belo Horizonte e região' },
]

export default function LocalizacaoMapa() {
  return (
    <section className="py-20 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amf-red text-xs tracking-widest uppercase font-medium mb-3">Onde estamos</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-amf-navy">Localização</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {infos.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="bg-amf-light border border-amf-border hover:border-amf-red/40 rounded-2xl p-5 transition-all duration-300 group">
              <div className="w-9 h-9 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <Icon className="w-4 h-4 text-amf-red" />
              </div>
              <p className="text-amf-red text-xs font-semibold uppercase tracking-wider mb-1">{titulo}</p>
              <p className="text-amf-muted text-sm leading-relaxed whitespace-pre-line">{texto}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-amf-border shadow-sm" style={{ height: '400px' }}>
          <iframe
            title="Localização AMF Estopas"
            src="https://maps.google.com/maps?q=Rua+Rita+Ferreira+40+Jardim+Montanhes+Belo+Horizonte+MG&output=embed"
            width="100%" height="100%" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </section>
  )
}
