import { NextResponse } from 'next/server';

// Cria o lead (com contato + nota) direto no Kommo.
// Variáveis de ambiente na Vercel:
//   KOMMO_TOKEN        (obrigatória) token de longa duração da integração "amf automação claude"
//   KOMMO_SUBDOMAIN    (opcional)    padrão: amfestopas
//   KOMMO_PIPELINE_ID  (opcional)    id do funil de destino; sem ele, vai para o funil principal

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  nome?: string;
  telefone?: string;
  email?: string;
  prazo_compra?: string;
  mensagem?: string;
  origem?: Record<string, string>;
};

const clean = (v: unknown, max = 500) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export async function POST(req: Request) {
  const token = process.env.KOMMO_TOKEN;
  const sub = process.env.KOMMO_SUBDOMAIN || 'amfestopas';
  if (!token) {
    return NextResponse.json({ ok: false, error: 'KOMMO_TOKEN não configurado' }, { status: 500 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 });
  }

  const nome = clean(body.nome, 120);
  const telefone = clean(body.telefone, 40).replace(/[^\d+]/g, '');
  const email = clean(body.email, 120);
  const prazo = clean(body.prazo_compra, 80);
  const mensagem = clean(body.mensagem, 2000);

  if (!nome || telefone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ ok: false, error: 'Nome e telefone são obrigatórios' }, { status: 400 });
  }

  // Normaliza telefone BR para +55...
  const digits = telefone.replace(/\D/g, '');
  const fone = digits.startsWith('55') && digits.length >= 12 ? `+${digits}` : `+55${digits}`;

  const contactFields: any[] = [
    { field_code: 'PHONE', values: [{ value: fone, enum_code: 'WORK' }] },
  ];
  if (email) contactFields.push({ field_code: 'EMAIL', values: [{ value: email, enum_code: 'WORK' }] });

  const lead: any = {
    name: `LP Formulário - ${nome}`,
    _embedded: {
      tags: [{ name: 'Landing Page' }, { name: 'Formulário LP' }],
      contacts: [{ first_name: nome, custom_fields_values: contactFields }],
    },
  };
  const pipelineId = Number(process.env.KOMMO_PIPELINE_ID);
  if (pipelineId) lead.pipeline_id = pipelineId;

  const base = `https://${sub}.kommo.com/api/v4`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  try {
    const r = await fetch(`${base}/leads/complex`, {
      method: 'POST',
      headers,
      body: JSON.stringify([lead]),
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !Array.isArray(data) || !data[0]?.id) {
      console.error('[Kommo] erro ao criar lead', r.status, JSON.stringify(data));
      return NextResponse.json({ ok: false, error: 'Falha no Kommo', status: r.status }, { status: 502 });
    }
    const leadId = data[0].id;

    // Nota com os detalhes do formulário + origem (UTM / gclid)
    const origem = body.origem && typeof body.origem === 'object'
      ? Object.entries(body.origem).map(([k, v]) => `${clean(k, 30)}: ${clean(v, 200)}`).filter((l) => !l.endsWith(': ')).join('\n')
      : '';
    const texto = [
      'Lead do formulário da landing page (lp.amfestopas.com.br)',
      `Nome: ${nome}`,
      `Telefone: ${fone}`,
      email && `E-mail: ${email}`,
      prazo && `Prazo de compra: ${prazo}`,
      mensagem && `Mensagem: ${mensagem}`,
      origem && `\nOrigem:\n${origem}`,
    ].filter(Boolean).join('\n');

    await fetch(`${base}/leads/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify([{ entity_id: leadId, note_type: 'common', params: { text: texto } }]),
    }).catch((e) => console.error('[Kommo] erro ao criar nota', e));

    return NextResponse.json({ ok: true, lead_id: leadId });
  } catch (e) {
    console.error('[Kommo] exceção', e);
    return NextResponse.json({ ok: false, error: 'Erro de conexão com o Kommo' }, { status: 502 });
  }
}
