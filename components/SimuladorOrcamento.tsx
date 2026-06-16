'use client'
import { useState } from 'react'
import { MessageCircle, Sparkles } from 'lucide-react'

const tabs = [
  { id: 'varejo',      label: 'Varejo',      badge: null },
  { id: 'atacado',     label: 'Atacado',     badge: 'Desconto especial' },
  { id: 'corporativo', label: 'Corporativo', badge: 'Contrato mensal' },
]

const produtos: Record<string, { label: string; precos: Record<string, number> }> = {
  estopa:  { label: 'Estopa Branca',     precos: { varejo: 18,  atacado: 14,  corporativo: 11 } },
  pano:    { label: 'Pano de Limpeza',   precos: { varejo: 22,  atacado: 17,  corporativo: 13 } },
  flanela: { label: 'Flanela',           precos: { varejo: 28,  atacado: 22,  corporativo: 17 } },
  tapete:  { label: 'Tapete Industrial', precos: { varejo: 35,  atacado: 27,  corporativo: 21 } },
  trapo:   { label: 'Trapo',            precos: { varejo: 10,  atacado: 7.5, corporativo: 5.5 } },
}

function desconto(tab: string, qty: number): number {
  if (tab === 'varejo')  return qty >= 50 ? 0.05 : 0
  if (tab === 'atacado') return qty >= 200 ? 0.15 : qty >= 100 ? 0.10 : 0.07
  return 0.25
}

export default function SimuladorOrcamento() {
  const [tab, setTab]         = useState('varejo')
  const [produto, setProduto] = useState('estopa')
  const [qty, setQty]         = useState(50)

  const precoUnitario    = produtos[produto].precos[tab]
  const desc             = desconto(tab, qty)
  const precoComDesconto = precoUnitario * (1 - desc)
  const total            = precoComDesconto * qty
  const economia         = precoUnitario * qty * desc

  const msg = encodeURIComponent(
    `Olá! Fiz uma simulação no site da AMF Estopas:\n\nProduto: ${produtos[produto].label}\nQuantidade: ${qty} kg\nModalidade: ${tab}\nTotal estimado: R$ ${total.toFixed(2)}\n\nGostaria de confirmar o orçamento.`
  )

  return (
    <section id="simulador" className="py-20 bg-white px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-amf-red" />
            <span className="text-amf-red text-xs tracking-widest uppercase font-semibold">Calcule agora</span>
            <div className="h-px w-8 bg-amf-red" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-amf-navy">Simulador de Orçamento</h2>
        </div>

        <div className="bg-white border border-amf-border rounded-3xl p-6 md:p-8 shadow-sm">
          {/* Tabs — ativo em verde */}
          <div className="flex gap-2 mb-8 bg-amf-light p-1 rounded-2xl">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  tab === t.id ? 'bg-amf-green text-white shadow' : 'text-amf-muted hover:text-amf-navy'
                }`}>
                <span>{t.label}</span>
                {t.badge && <span className={`text-[10px] mt-0.5 ${tab === t.id ? 'text-white/70' : 'text-amf-red'}`}>{t.badge}</span>}
              </button>
            ))}
          </div>

          {tab === 'corporativo' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amf-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amf-green font-semibold text-sm mb-1">Contrato Mensal Corporativo</p>
                <p className="text-amf-muted text-xs">Para indústrias com consumo recorrente. Inclui preço fixo mensal, entrega programada e suporte dedicado. Desconto de 25% garantido.</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-amf-muted text-xs font-medium uppercase tracking-wider mb-2">Produto</label>
                <select value={produto} onChange={e => setProduto(e.target.value)}
                  className="w-full bg-amf-light border border-amf-border text-amf-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amf-green transition-colors">
                  {Object.entries(produtos).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-amf-muted text-xs font-medium uppercase tracking-wider mb-2">
                  Quantidade: <span className="text-amf-green font-bold">{qty} kg</span>
                </label>
                <input type="range" min={1} max={500} value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-amf-muted text-xs mt-1"><span>1 kg</span><span>500 kg</span></div>
              </div>
            </div>

            <div className="bg-amf-light border border-amf-border rounded-2xl p-5 space-y-3">
              {[
                { label: 'Preço unitário', valor: `R$ ${precoComDesconto.toFixed(2)}/kg` },
                { label: 'Quantidade',     valor: `${qty} kg` },
                { label: 'Desconto',       valor: desc > 0 ? `${(desc*100).toFixed(0)}%` : '—', red: desc > 0 },
                { label: 'Economia',       valor: desc > 0 ? `R$ ${economia.toFixed(2)}` : '—', green: desc > 0 },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm border-b border-amf-border pb-2 last:border-0">
                  <span className="text-amf-muted">{row.label}</span>
                  <span className={(row as any).green ? 'text-amf-green font-semibold' : (row as any).red ? 'text-amf-red' : 'text-amf-navy'}>
                    {row.valor}
                  </span>
                </div>
              ))}
              <div className="pt-2 text-center">
                <p className="text-amf-muted text-xs mb-1">Total estimado</p>
                <p className="font-display text-3xl font-bold text-amf-navy">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* CTA verde */}
          <a href={`https://wa.me/5531986239665?text=${msg}`} target="_blank" rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full bg-amf-green hover:bg-amf-green-dark text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-green-200">
            <MessageCircle className="w-5 h-5" /> Confirmar orçamento no WhatsApp
          </a>
          <p className="text-amf-muted text-xs text-center mt-3">* Valores estimados. Orçamento oficial emitido pelo vendedor.</p>
        </div>
      </div>
    </section>
  )
}
