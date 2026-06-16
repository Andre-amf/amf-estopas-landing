import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AMF Estopas | Fabricante de Estopas e Panos Industriais em BH',
  description:
    'AMF Resíduos Têxteis LTDA — fabricante direto de estopas, panos de limpeza, flanelas e tapetes industriais desde 1990. Belo Horizonte/MG. Entrega nacional. Solicite orçamento.',
  keywords: 'estopa industrial, panos de limpeza industrial, flanela industrial, tapete industrial, fabricante estopa BH, estopa algodão belo horizonte',
  openGraph: {
    title: 'AMF Estopas | Fabricante desde 1990',
    description: 'Fabricante direto de estopas e materiais de limpeza industrial. +500 clientes. Entrega nacional.',
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
