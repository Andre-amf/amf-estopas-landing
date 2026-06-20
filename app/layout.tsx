import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AMF Estopas | Estopa Industrial e Panos para Limpeza',
  description:
    'AMF Resíduos Têxteis LTDA — fabricante direto de estopa industrial, panos de limpeza e algodão para enchimento desde 1990. Atacado e varejo. Pronta entrega para todo o Brasil. Solicite orçamento.',
  keywords: 'estopa industrial, panos de limpeza industrial, algodão para enchimento, flanela industrial, tapete industrial, fabricante estopa BH, atacado estopa belo horizonte',
  openGraph: {
    title: 'AMF Estopas | Estopa Industrial e Panos para Limpeza',
    description: 'Fabricante direto de estopa industrial, panos de limpeza e algodão para enchimento. Atacado e varejo. Pronta entrega para todo o Brasil.',
    url: 'https://www.amfestopas.com.br',
    siteName: 'AMF Estopas',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: { index: true, follow: true },
  themeColor: '#0D0D0D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
