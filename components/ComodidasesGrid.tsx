import { Droplets, Leaf, LayoutGrid, Truck, ShieldCheck, Factory, Sliders, CalendarCheck } from 'lucide-react'

const razoes = [
  { icon: Droplets,      titulo: 'Alta absorção',        texto: 'Materiais com capacidade de absorção superior à média do mercado.' },
  { icon: Leaf,          titulo: 'Produção sustentável', texto: 'Fibras recicladas e processo produtivo com baixo impacto ambiental.' },
  { icon: LayoutGrid,    titulo: 'Múltiplas linhas',     texto: 'Estopas, flanelas, panos, tapetes e retalhos em uma só fornecedora.' },
  { icon: Truck,         titulo: 'Entrega nacional',     texto: 'Enviamos para todo o Brasil com agilidade e segurança.' },
  { icon: ShieldCheck,   titulo: 'Qualidade garantida',  texto: 'Controle de qualidade interno em cada lote produzido.' },
  { icon: Factory,       titulo: 'Fabricante direto',    texto: 'Sem intermediários. Preço de fábrica para o cliente final.' },
  { icon: Sliders,       titulo: 'Produtos sob medida',  texto: 'Gramatura, tamanho e embalagem personalizados para sua necessidade.' },
  { icon: CalendarCheck, titulo: 'Desde 1990',           texto: 'Mais de 30 anos de experiência no segmento têxtil industrial.' },
]

export default function ComodidasesGrid() {
  return (
    <section className="py-20 bg-amf-light px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-amf-red" />
            <span className="text-amf-red text-xs tracking-widest uppercase font-semibold">Diferenciais</span>
            <div className="h-px w-8 bg-amf-red" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-amf-navy">
            8 razões para escolher a AMF
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {razoes.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="bg-white border border-amf-border hover:border-amf-green/50 rounded-2xl p-6 transition-all duration-300 group shadow-sm">
              {/* ícone verde */}
              <div className="w-11 h-11 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-5 h-5 text-amf-green" />
              </div>
              {/* toque vermelho no título */}
              <h3 className="text-amf-navy font-semibold text-sm mb-1">{titulo}</h3>
              <div className="h-0.5 w-6 bg-amf-red rounded-full mb-2" />
              <p className="text-amf-muted text-xs leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
