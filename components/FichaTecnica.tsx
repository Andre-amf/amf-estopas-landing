import { Package, Globe, Users, CalendarCheck } from 'lucide-react'

const stats = [
  { icon: CalendarCheck, valor: '+30 Anos', label: 'de mercado' },
  { icon: Package,       valor: '8+',       label: 'Linhas de produto' },
  { icon: Globe,         valor: 'Brasil',   label: 'Entrega nacional' },
  { icon: Users,         valor: '+500',     label: 'Clientes ativos' },
]

const tags = [
  { label: 'Algodão puro',        bg: 'bg-amf-light',   text: 'text-amf-navy',  border: 'border-amf-border' },
  { label: 'Alta absorção',       bg: 'bg-amf-light',   text: 'text-amf-navy',  border: 'border-amf-border' },
  { label: 'Sustentável',         bg: 'bg-amf-green/10',text: 'text-amf-green', border: 'border-amf-green/30' },
  { label: 'Pronto para entrega', bg: 'bg-amf-red/10',  text: 'text-amf-red',   border: 'border-amf-red/20' },
]

export default function FichaTecnica() {
  return (
    <section className="py-20 bg-amf-light px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          {/* label vermelho fino */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-amf-red" />
            <span className="text-amf-red text-xs tracking-widest uppercase font-semibold">Quem somos</span>
            <div className="h-px w-8 bg-amf-red" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-amf-navy mb-3">
            AMF Resíduos Têxteis LTDA
          </h2>
          <p className="text-amf-muted max-w-xl mx-auto">
            Fabricante direto de materiais de limpeza industrial. Sem intermediários, sem surpresas.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(({ icon: Icon, valor, label }) => (
            <div key={label} className="bg-white border border-amf-border hover:border-amf-red/30 rounded-2xl p-6 text-center transition-all duration-300 group shadow-sm">
              {/* ícone verde */}
              <div className="w-10 h-10 mx-auto mb-3 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Icon className="w-5 h-5 text-amf-green" />
              </div>
              <p className="font-display text-2xl font-bold text-amf-navy mb-1">{valor}</p>
              <p className="text-amf-muted text-xs">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {tags.map(t => (
            <span key={t.label} className={`${t.bg} ${t.text} border ${t.border} text-sm font-medium px-4 py-2 rounded-full`}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
