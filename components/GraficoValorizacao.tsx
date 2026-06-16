'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp } from 'lucide-react'

const dados = [
  { ano: '2021', preco: 280 },
  { ano: '2022', preco: 320 },
  { ano: '2023', preco: 365 },
  { ano: '2024', preco: 410 },
  { ano: '2025', preco: 460 },
]

const cores = ['#FFCCCB', '#FF9999', '#FF6666', '#E51E23', '#C0181C']

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const idx = dados.findIndex((d) => d.ano === label)
  const yoy = idx > 0
    ? `+${(((dados[idx].preco - dados[idx-1].preco) / dados[idx-1].preco) * 100).toFixed(1)}%`
    : null
  return (
    <div className="bg-white border border-amf-border rounded-xl p-4 shadow-lg">
      <p className="text-amf-red font-bold text-lg">R$ {payload[0].value}/kg</p>
      <p className="text-amf-muted text-xs">{label}</p>
      {yoy && <p className="text-amf-red text-xs mt-1 font-medium">Alta anual: {yoy}</p>}
    </div>
  )
}

export default function GraficoValorizacao() {
  return (
    <section className="py-20 bg-amf-navy px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amf-red text-xs tracking-widest uppercase font-medium mb-3">Mercado</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Valorização do Preço da Estopa
          </h2>
          <p className="text-white/50 max-w-lg mx-auto text-sm">
            Preço médio de mercado por kg nos últimos 5 anos — quem compra direto da fábrica protege seu orçamento.
          </p>
        </div>

        <div className="text-center mb-10">
          <span className="font-display text-7xl md:text-8xl font-bold text-amf-red">+64%</span>
          <p className="text-white/40 text-sm mt-2">de alta no preço médio entre 2021 e 2025</p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 mb-10">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dados} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
              <XAxis dataKey="ano" tick={{ fill: '#717171', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#717171', fontSize: 12 }}
                tickFormatter={(v) => `R$${v}`}
                axisLine={false} tickLine={false}
                domain={[200, 520]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(229,30,35,0.05)' }} />
              <Bar dataKey="preco" radius={[8, 8, 0, 0]}>
                {dados.map((_, i) => <Cell key={i} fill={cores[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { titulo: 'Alta em 4 anos', valor: '+R$ 180/kg', sub: 'de 2021 a 2025' },
            { titulo: 'Média anual',    valor: '+13,5%',      sub: 'de valorização' },
            { titulo: 'Previsão 2026',  valor: '~R$ 510/kg',  sub: 'estimativa de mercado' },
          ].map((card) => (
            <div key={card.titulo} className="bg-white/10 border border-white/20 hover:border-white/40 rounded-2xl p-5 flex items-start gap-4 transition-all duration-300">
              <div className="w-10 h-10 bg-amf-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-amf-green-light" />
              </div>
              <div>
                <p className="text-amf-red font-bold text-lg leading-none mb-1">{card.valor}</p>
                <p className="text-white/60 text-xs">{card.titulo}</p>
                <p className="text-white/30 text-xs">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
