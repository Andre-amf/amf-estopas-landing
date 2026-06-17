'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const textoBase = `A AMF Resíduos Têxteis LTDA nasceu em 1990 com uma missão clara: fornecer materiais de limpeza industrial de alta qualidade diretamente da fábrica para a indústria. Ao longo de mais de três décadas, construímos uma reputação sólida no setor industrial de Minas Gerais e em todo o Brasil.`

const textoExtra = `
Nossa fábrica está localizada em Belo Horizonte/MG, no Jardim Montanhes, onde produzimos diariamente estopas, panos de limpeza, flanelas, tapetes industriais e muito mais. Todo o processo produtivo é controlado internamente, garantindo padrão de qualidade consistente em cada lote.

Trabalhamos com fibras naturais e recicladas, contribuindo para uma cadeia têxtil mais sustentável. Nossos produtos atendem indústrias metalúrgicas, automotivas, alimentícias, químicas e de manutenção predial.

Com mais de 500 clientes ativos e uma taxa de recompra superior a 90%, nossa maior conquista é a confiança que as indústrias depositam em nós ano após ano.
`

export default function SobreEmpresa() {
  const [expandido, setExpandido] = useState(false)

  return (
    <section id="sobre" className="py-20 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-amf-red" />
            <span className="text-amf-red text-xs tracking-widest uppercase font-semibold">Nossa história</span>
            <div className="h-px w-8 bg-amf-red" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-amf-navy">Sobre a Empresa</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-amf-muted leading-relaxed mb-4">{textoBase}</p>
            <div className={`overflow-hidden transition-all duration-500 ${expandido ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-amf-muted leading-relaxed whitespace-pre-line">{textoExtra}</p>
            </div>
            {/* botão verde */}
            <button onClick={() => setExpandido(!expandido)}
              className="flex items-center gap-2 bg-amf-green hover:bg-amf-green-dark text-white text-sm font-medium mt-5 px-4 py-2 rounded-xl transition-all">
              {expandido ? <><ChevronUp className="w-4 h-4" /> Mostrar menos</> : <><ChevronDown className="w-4 h-4" /> Mostrar mais</>}
            </button>
          </div>

          <div className="space-y-4">
            {[
              { titulo: 'Nossa Fábrica', texto: 'Rua Rita Ferreira, 40 – Jd Montanhes, Belo Horizonte/MG' },
              { titulo: 'Desde',         texto: '1990 — mais de 30 anos fornecendo para a indústria brasileira' },
              { titulo: 'Especialidade', texto: 'Estopas, panos, flanelas, tapetes e trapos industriais' },
              { titulo: 'Diferencial',   texto: 'Fabricação própria = preço competitivo e qualidade rastreável' },
            ].map(item => (
              <div key={item.titulo} className="bg-amf-light border-l-2 border-amf-red rounded-r-2xl rounded-l-sm pl-4 pr-5 py-4 transition-all hover:border-amf-green">
                <p className="text-amf-red text-xs font-semibold uppercase tracking-wider mb-1">{item.titulo}</p>
                <p className="text-amf-text text-sm">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
