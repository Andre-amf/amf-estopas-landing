'use client'

import Image from 'next/image'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

const categorias = ['Todos', 'Estopas', 'Cadilhos', 'Fraldas', 'Toalhas', 'Trapos', 'Sacos', 'Outros']

const produtos = [
  // ESTOPAS
  { nome: 'Estopa Branca Superextra',          tagline: 'Absorção máxima para um trabalho impecável!',                          img: '/produtos/101.png', cat: 'Estopas',  destaque: true  },
  { nome: 'Estopa Branca para Limpeza Geral',  tagline: '100% algodão para uma remoção eficiente e sem fiapos.',                img: '/produtos/102.png', cat: 'Estopas'  },
  { nome: 'Estopa de Cor Extra (Colorida/Azul)',tagline: 'Ideal para absorver graxa e óleo com facilidade.',                    img: '/produtos/103.png', cat: 'Estopas'  },
  { nome: 'Estopa Branca 1ª (Mista)',           tagline: 'Ideal para limpeza pesada e produtos químicos.',                      img: '/produtos/104.png', cat: 'Estopas'  },
  // CADILHOS
  { nome: 'Cadilho Azul',                      tagline: 'O melhor aliado para impermeabilização e vedação de tubulações.',      img: '/produtos/105.png', cat: 'Cadilhos' },
  { nome: 'Cadilho Branco',                    tagline: 'Ideal para vedação e acabamento com alta durabilidade.',               img: '/produtos/106.png', cat: 'Cadilhos' },
  // FRALDAS
  { nome: 'Fralda para Limpeza',               tagline: 'Absorção superior para uma limpeza impecável.',                       img: '/produtos/107.png', cat: 'Fraldas'  },
  { nome: 'Fraldinha de Limpeza Fina',         tagline: 'Delicadeza e precisão na limpeza.',                                   img: '/produtos/108.png', cat: 'Fraldas'  },
  { nome: 'Retalhos de Fralda',                tagline: 'Retalhos macios e superabsorventes.',                                 img: '/produtos/109.png', cat: 'Fraldas'  },
  { nome: 'Retalhos Alvejados',                tagline: 'Absorção e resistência para limpeza pesada.',                         img: '/produtos/114.png', cat: 'Fraldas'  },
  { nome: 'Retalho Cru',                       tagline: 'Absorção e resistência no dia a dia. Um aliado versátil.',            img: '/produtos/126.png', cat: 'Fraldas'  },
  // TOALHAS
  { nome: 'Toalha Industrial Branca – Rolo',   tagline: 'Limpeza ágil e sem desperdício para o dia a dia industrial.',         img: '/produtos/118.png', cat: 'Toalhas', destaque: true  },
  { nome: 'Toalha Industrial Branca (Wiper)',  tagline: 'Rendimento e performance superiores.',                                 img: '/produtos/119.png', cat: 'Toalhas'  },
  { nome: 'Toalha Azul Recuperada',            tagline: 'Um toque de responsabilidade ambiental na sua limpeza.',              img: '/produtos/120.png', cat: 'Toalhas'  },
  { nome: 'Toalha Bobina Cortada',             tagline: 'O aliado perfeito para limpeza industrial.',                          img: '/produtos/121.png', cat: 'Toalhas'  },
  { nome: 'Toalha Flanelada Recuperada',       tagline: 'Suavidade e absorção incomparáveis para superfícies delicadas.',      img: '/produtos/122.png', cat: 'Toalhas'  },
  { nome: 'Toalha Nova Revenda',               tagline: 'Alta qualidade para um acabamento impecável.',                        img: '/produtos/123.png', cat: 'Toalhas'  },
  { nome: 'Toalha para Serviços Gerais',       tagline: 'Versátil, absorvente e resistente para todas as situações.',          img: '/produtos/124.png', cat: 'Toalhas'  },
  // TRAPOS
  { nome: 'Trapo Branco Lavado',               tagline: 'A escolha certa para acabamentos finos!',                             img: '/produtos/127.png', cat: 'Trapos'   },
  { nome: 'Trapo Colorido (Brim)',             tagline: 'Força e absorção para os serviços mais exigentes.',                   img: '/produtos/128.png', cat: 'Trapos'   },
  { nome: 'Trapo de Malha Costurado Branco',   tagline: 'Máxima eficiência na remoção de sujeiras pesadas.',                  img: '/produtos/129.png', cat: 'Trapos'   },
  { nome: 'Trapo de Malha Sem Costura',        tagline: 'Superabsorção para qualquer necessidade!',                            img: '/produtos/130.png', cat: 'Trapos'   },
  // SACOS
  { nome: 'Saco Alvejado',                     tagline: 'Absorve líquidos com eficiência e praticidade.',                      img: '/produtos/115.png', cat: 'Sacos'    },
  { nome: 'Sacos Coloridos',                   tagline: 'Praticidade e versatilidade para qualquer superfície!',               img: '/produtos/116.png', cat: 'Sacos'    },
  { nome: 'Capa de Fardo',                     tagline: 'Proteção reforçada para seu negócio!',                                img: '/produtos/125.png', cat: 'Sacos'    },
  // OUTROS
  { nome: 'Algodão Colorido p/ Enchimento',    tagline: 'Conforto e sustentabilidade para seu estofado!',                      img: '/produtos/110.png', cat: 'Outros'   },
  { nome: 'Americano Cru',                     tagline: 'Um tecido resistente e durável para qualquer projeto.',               img: '/produtos/111.png', cat: 'Outros'   },
  { nome: 'Rayon',                             tagline: 'Ideal para artesanato e enchimentos confortáveis.',                   img: '/produtos/113.png', cat: 'Outros'   },
  { nome: 'Tapete Recuperado',                 tagline: 'Proteção eficiente para ambientes movimentados.',                     img: '/produtos/117.png', cat: 'Outros'   },
  { nome: 'Algodão para Polimento',            tagline: 'Acabamento impecável sem arranhões!',                                 img: '/produtos/131.png', cat: 'Outros'   },
  { nome: 'Flanelas',                          tagline: 'Brilho e limpeza em um só produto!',                                 img: '/produtos/132.png', cat: 'Outros'   },
  { nome: 'Guardanapos Sintéticos',            tagline: 'Eficiência na limpeza com responsabilidade ambiental.',               img: '/produtos/133.png', cat: 'Outros'   },
]

const WA = 'https://wa.me/5531986239665?text=Olá!%20Tenho%20interesse%20nos%20produtos%20da%20AMF%20Estopas.%20Pode%20me%20enviar%20um%20orçamento%3F'

export default function Ambientes() {
  const [catAtiva, setCatAtiva] = useState('Todos')

  const filtrados = catAtiva === 'Todos' ? produtos : produtos.filter(p => p.cat === catAtiva)

  return (
    <section id="produtos" className="py-20 bg-white px-6">
      <div className="max-w-6xl mx-auto">

        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-amf-red" />
            <span className="text-amf-red text-xs tracking-widest uppercase font-semibold">Linha completa</span>
            <div className="h-px w-8 bg-amf-red" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-amf-navy mb-3">
            Nossos Produtos
          </h2>
          <p className="text-amf-muted max-w-xl mx-auto">
            +30 anos fabricando materiais de limpeza industrial em Belo Horizonte/MG.
            <span className="text-amf-navy font-semibold"> {produtos.length} produtos disponíveis.</span>
          </p>
        </div>

        {/* Abas de categoria */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCatAtiva(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                catAtiva === cat
                  ? 'bg-amf-green text-white border-amf-green shadow-md shadow-green-200'
                  : 'bg-white text-amf-muted border-amf-border hover:border-amf-green/50 hover:text-amf-green'
              }`}
            >
              {cat}
              {cat !== 'Todos' && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  ({produtos.filter(p => p.cat === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
          {filtrados.map((prod) => (
            <div
              key={prod.nome}
              className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[3/4]"
            >
              <Image
                src={prod.img}
                alt={prod.nome}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Badge AMF */}
              <div className="absolute top-3 left-3 bg-amf-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                AMF
              </div>

              {/* Destaque */}
              {prod.destaque && (
                <div className="absolute top-3 right-3 bg-amf-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Top
                </div>
              )}

              {/* Nome + tagline */}
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <h3 className="text-white font-bold text-xs md:text-sm leading-snug mb-1 group-hover:text-amf-green transition-colors duration-300">
                  {prod.nome}
                </h3>
                <p className="text-white/70 text-[10px] leading-snug opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {prod.tagline}
                </p>
              </div>

              {/* Borda verde no hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amf-green transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amf-green hover:bg-amf-green-dark text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-200"
          >
            <MessageCircle className="w-5 h-5" />
            Solicitar orçamento de qualquer produto
          </a>
          <p className="text-amf-muted text-sm mt-3">
            Fabricante direto · Entrega para todo o Brasil · Melhor preço garantido
          </p>
        </div>
      </div>
    </section>
  )
}
