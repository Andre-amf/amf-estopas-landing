import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FichaTecnica from '@/components/FichaTecnica'
import PrecosCTA from '@/components/PrecosCTA'
import SobreEmpresa from '@/components/SobreEmpresa'
import Ambientes from '@/components/Ambientes'
import ComodidasesGrid from '@/components/ComodidasesGrid'
import LocalizacaoMapa from '@/components/LocalizacaoMapa'
import GraficoValorizacao from '@/components/GraficoValorizacao'
import SimuladorOrcamento from '@/components/SimuladorOrcamento'
import FormularioInteresse from '@/components/FormularioInteresse'
import CartaoVendedor from '@/components/CartaoVendedor'
import Footer from '@/components/Footer'
import BotaoFlutuante from '@/components/BotaoFlutuante'

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <FichaTecnica />
      <PrecosCTA />
      <SobreEmpresa />
      <Ambientes />
      <ComodidasesGrid />
      <GraficoValorizacao />
      <SimuladorOrcamento />
      <LocalizacaoMapa />
      <FormularioInteresse />
      <CartaoVendedor />
      <Footer />
      <BotaoFlutuante />
    </main>
  )
}
