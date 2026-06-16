import { Instagram, MessageCircle, Mail, ExternalLink, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-amf-navy text-white py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">

          {/* Logo + info */}
          <div>
            <div className="bg-white rounded-xl px-5 py-3 inline-block mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-amf.png" alt="AMF Estopas e Panos para Limpeza" className="h-12 w-auto" />
            </div>
            <p className="text-white/40 text-xs mb-1">AMF Resíduos Têxteis LTDA</p>
            <div className="h-0.5 w-16 bg-amf-green rounded-full mb-4" />
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Rua Rita Ferreira, 40<br />
              Jd Montanhes · Belo Horizonte/MG<br />
              CEP 30.750-190
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://www.instagram.com/amfestopas', Icon: Instagram,     label: 'Instagram', hover: 'hover:border-pink-400/50'   },
                { href: 'https://wa.me/5531986239665',           Icon: MessageCircle, label: 'WhatsApp',  hover: 'hover:border-amf-green/60' },
                { href: 'mailto:vendas@amfestopas.com.br',       Icon: Mail,          label: 'E-mail',    hover: 'hover:border-amf-red/50'   },
              ].map(({ href, Icon, label, hover }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  className={`w-9 h-9 bg-white/10 border border-white/20 ${hover} rounded-xl flex items-center justify-center transition-all`}>
                  <Icon className="w-4 h-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-amf-red text-xs uppercase tracking-widest font-semibold mb-4">Links</p>
            <ul className="space-y-3">
              {[
                { label: 'Loja virtual',         href: 'https://loja.amfestopas.com.br' },
                { label: 'Catálogo de produtos',  href: '#produtos'   },
                { label: 'Sobre a empresa',       href: '#sobre'      },
                { label: 'Solicitar orçamento',   href: '#formulario' },
                { label: 'Como chegar',           href: '#localizacao'},
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href}
                    className="text-white/50 hover:text-amf-green text-sm transition-colors flex items-center gap-1.5 group">
                    {link.label}
                    {link.href.startsWith('http') && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <p className="text-amf-red text-xs uppercase tracking-widest font-semibold mb-4">Contato</p>
            <div className="space-y-3 text-sm">
              <a href="https://wa.me/5531986239665" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 hover:text-amf-green transition-colors">
                <MessageCircle className="w-4 h-4 text-amf-green" /> (31) 9.8623-9665
              </a>
              <a href="tel:+553134113509"
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-white/30" /> (31) 3411-3509
              </a>
              <a href="mailto:vendas@amfestopas.com.br"
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-white/30" /> vendas@amfestopas.com.br
              </a>
              <p className="text-white/25 text-xs pt-2">Seg–Sex: 8h–18h · Sáb: 8h–12h</p>
            </div>

            <a href="https://wa.me/5531986239665?text=Olá!%20Vim%20pelo%20site%20da%20AMF%20Estopas%20e%20gostaria%20de%20um%20orçamento."
              target="_blank" rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 bg-amf-green hover:bg-amf-green-dark text-white text-sm font-semibold py-3 px-5 rounded-xl transition-all shadow-lg shadow-green-900/30">
              <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/20 text-xs">
          <p>© 2026 AMF Resíduos Têxteis LTDA · Todos os direitos reservados.</p>
          <p>Fabricante desde 1990 · Belo Horizonte/MG</p>
        </div>
      </div>
    </footer>
  )
}
