import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const N8N_WEBHOOK = 'https://amfestopas.app.n8n.cloud/webhook/amf-site-form'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { nome, telefone, email, prazo_compra, mensagem, utm_source, utm_medium, utm_campaign, gclid, fbclid, pagina, referrer } = body

  if (!nome?.trim() || !telefone?.trim()) {
    return NextResponse.json({ ok: false, error: 'nome e telefone são obrigatórios' }, { status: 400 })
  }

  // Salva no Supabase
  const { error: sbError } = await supabase.from('leads').insert([{
    nome: nome.trim(),
    telefone: telefone.trim(),
    email: email?.trim() || null,
    prazo_compra,
    mensagem: mensagem?.trim() || null,
    empresa: 'AMF Estopas',
  }])

  if (sbError) {
    console.error('[AMF] Supabase error:', sbError.message)
  }

  // Envia para n8n (fire-and-forget, não bloqueia a resposta)
  fetch(N8N_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email?.trim() || '',
      prazo_compra,
      mensagem: mensagem?.trim() || '',
      utm_source: utm_source || '',
      utm_medium: utm_medium || '',
      utm_campaign: utm_campaign || '',
      gclid: gclid || '',
      fbclid: fbclid || '',
      pagina: pagina || '',
      referrer: referrer || '',
    }),
  }).catch(e => console.error('[AMF] n8n webhook error:', e.message))

  return NextResponse.json({ ok: true })
}
