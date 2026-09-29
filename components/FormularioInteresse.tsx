'use client';

import { useState } from 'react';
import { Check, ChevronRight, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, type Lead } from '@/lib/supabase';

const WA_NUMBER = '5531986239665';
const EMPRESA   = 'AMF Estopas';

const PRAZO_OPTIONS = [
  'Preciso agora / urgente',
  'Nos próximos 7 dias',
  'Este mês',
  'Em até 3 meses',
  'Ainda estou pesquisando',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

function buildWhatsAppURL(lead: Lead): string {
  const msg = [
    `Olá! Me chamo *${lead.nome}* e tenho interesse nos produtos da *${EMPRESA}*.`,
    `📦 Prazo: ${lead.prazo_compra}`,
    lead.mensagem ? `📝 Obs: ${lead.mensagem}` : '',
  ].filter(Boolean).join('\n');
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function FormularioInteresse() {
  const [passo,    setPasso]    = useState(1);
  const [prazo,    setPrazo]    = useState('');
  const [nome,     setNome]     = useState('');
  const [telefone, setTelefone] = useState('');
  const [email,    setEmail]    = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status,   setStatus]   = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const progresso = (passo / 4) * 100;

  async function handleSubmit() {
    setStatus('loading');
    setErrorMsg('');
    const lead: Lead = {
      nome: nome.trim(), telefone: telefone.trim(),
      email: email.trim() || undefined,
      prazo_compra: prazo,
      mensagem: mensagem.trim() || undefined,
      empresa: EMPRESA,
    };
    // Origem do lead (UTMs / gclid) para saber qual campanha converteu
    const qs = new URLSearchParams(window.location.search);
    const origem: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
      const v = qs.get(k);
      if (v) origem[k] = v;
    });
    origem.pagina = window.location.href;

    try {
      // Grava no Kommo e no Supabase em paralelo: basta um dar certo para o lead não se perder
      const [kommo, banco] = await Promise.allSettled([
        fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...lead, origem }),
        }).then(async (r) => { if (!r.ok) throw new Error(`Kommo ${r.status}`); return r.json(); }),
        supabase.from('leads').insert([lead]).then(({ error }) => { if (error) throw new Error(error.message); }),
      ]);
      if (kommo.status === 'rejected') console.error('[AMF] Kommo:', kommo.reason);
      if (banco.status === 'rejected') console.error('[AMF] Supabase:', banco.reason);
      if (kommo.status === 'rejected' && banco.status === 'rejected') throw new Error('Nenhum destino salvou o lead');

      // Evento para GTM / Google Ads / Meta (conversão)
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'lead_formulario', prazo_compra: prazo });

      setStatus('success');
      setTimeout(() => window.open(buildWhatsAppURL(lead), '_blank'), 1200);
    } catch (err: any) {
      console.error('[AMF] Erro ao salvar lead:', err);
      setStatus('error');
      setErrorMsg('Não conseguimos salvar seus dados agora. Mas você pode nos chamar diretamente no WhatsApp! 😊');
    }
  }

  const inputCls = 'w-full bg-white border border-amf-border rounded-xl px-4 py-3 text-amf-text placeholder-gray-300 focus:outline-none focus:border-amf-green transition-colors';
  const h3Cls   = 'text-amf-navy font-semibold text-lg mb-5';
  const labelCls = 'block text-amf-muted text-sm mb-1.5';

  if (status === 'success') {
    return (
      <section id="formulario" className="py-16 md:py-24 bg-amf-light border-y border-amf-border">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 border border-green-300 flex items-center justify-center mx-auto mb-6 animate-fade-up">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-amf-navy mb-3 animate-fade-up">
            Recebemos seu interesse!
          </h2>
          <p className="text-amf-muted text-lg mb-2 animate-fade-up">
            Obrigado, <strong className="text-amf-navy">{nome}</strong>!
          </p>
          <p className="text-amf-muted mb-8 animate-fade-up">
            Nossa equipe vai te chamar no WhatsApp em breve.<br />Abrindo o WhatsApp agora…
          </p>
          <a
            href={buildWhatsAppURL({ nome, telefone, email, prazo_compra: prazo, mensagem, empresa: EMPRESA })}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all"
          >
            <MessageCircle size={18} /> Abrir WhatsApp manualmente
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="formulario" className="py-16 md:py-24 bg-amf-light border-y border-amf-border">
      <div className="container mx-auto px-4 max-w-2xl">

        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-px bg-amf-red" />
          <span className="text-amf-red text-sm font-medium uppercase tracking-widest">Contato rápido</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-amf-navy mb-2">
          Tenho interesse · Fale com nosso time
        </h2>
        <p className="text-amf-muted mb-8">Preencha em menos de 1 minuto e receba atendimento prioritário</p>

        {/* Barra de progresso */}
        <div className="w-full h-1 bg-amf-border rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-amf-green rounded-full transition-all duration-500" style={{ width: `${progresso}%` }} />
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-8">
          {(['Prazo', 'Nome', 'Contato', 'Finalizar'] as const).map((label, i) => {
            const s = i + 1;
            return (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s < passo  ? 'bg-amf-green text-white' :
                  s === passo ? 'bg-green-50 border border-amf-green text-amf-green' :
                  'bg-amf-border text-amf-muted'
                }`}>
                  {s < passo ? <Check size={12} /> : s}
                </div>
                <span className="text-amf-muted text-xs hidden md:block">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-white border border-amf-border shadow-sm">

          {/* Passo 1 */}
          {passo === 1 && (
            <div className="space-y-3 animate-fade-up">
              <h3 className={h3Cls}>Quando você precisa dos produtos?</h3>
              {PRAZO_OPTIONS.map((op) => (
                <button key={op} onClick={() => { setPrazo(op); setPasso(2); }}
                  className="w-full text-left px-5 py-4 rounded-xl border border-amf-border text-amf-muted hover:border-amf-red/40 hover:text-amf-navy hover:bg-red-50 transition-all flex items-center justify-between group">
                  <span>{op}</span>
                  <ChevronRight size={16} className="text-amf-red opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Passo 2 */}
          {passo === 2 && (
            <div className="space-y-5 animate-fade-up">
              <h3 className={h3Cls}>Como podemos te chamar?</h3>
              <div>
                <label className={labelCls}>Nome completo *</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && nome.trim() && setPasso(3)}
                  placeholder="Ex: João Silva" autoFocus className={inputCls} />
              </div>
              <button onClick={() => nome.trim() && setPasso(3)} disabled={!nome.trim()}
                className="w-full py-3.5 rounded-xl bg-amf-green hover:bg-amf-green-dark disabled:opacity-40 text-white font-semibold transition-all">
                Continuar →
              </button>
            </div>
          )}

          {/* Passo 3 */}
          {passo === 3 && (
            <div className="space-y-5 animate-fade-up">
              <h3 className={h3Cls}>Dados de contato</h3>
              <div>
                <label className={labelCls}>WhatsApp / Telefone *</label>
                <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(31) 9 xxxx-xxxx" autoFocus className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>E-mail <span className="text-gray-300">(opcional)</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" className={inputCls} />
              </div>
              <button onClick={() => telefone.trim() && setPasso(4)} disabled={!telefone.trim()}
                className="w-full py-3.5 rounded-xl bg-amf-green hover:bg-amf-green-dark disabled:opacity-40 text-white font-semibold transition-all">
                Continuar →
              </button>
            </div>
          )}

          {/* Passo 4 */}
          {passo === 4 && (
            <div className="space-y-5 animate-fade-up">
              <h3 className={h3Cls}>Quase lá! Alguma observação?</h3>
              <div>
                <label className={labelCls}>Produto / quantidade / comentário <span className="text-gray-300">(opcional)</span></label>
                <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={4}
                  placeholder="Ex: Preciso de 50 kg de estopa branca e 100 flanelas por mês para nossa oficina…"
                  className={`${inputCls} resize-none`} />
              </div>

              {/* Resumo */}
              <div className="p-4 rounded-xl bg-amf-light border border-amf-red/20 space-y-1.5">
                <p className="text-amf-muted text-xs uppercase tracking-widest mb-2">Resumo do seu pedido</p>
                {[
                  ['Prazo', prazo], ['Nome', nome], ['Telefone', telefone],
                  email ? ['E-mail', email] : null,
                ].filter(Boolean).map(([k, v]: any) => (
                  <p key={k} className="text-amf-text text-sm">
                    <span className="text-amf-muted">{k}: </span>{v}
                  </p>
                ))}
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <AlertCircle size={18} className="text-amf-red shrink-0 mt-0.5" />
                  <p className="text-amf-red text-sm">{errorMsg}</p>
                </div>
              )}

              <button onClick={handleSubmit} disabled={status === 'loading'}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-semibold text-lg transition-all shadow-lg shadow-green-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed">
                {status === 'loading' ? (
                  <><Loader2 size={20} className="animate-spin" /> Enviando…</>
                ) : (
                  <><MessageCircle size={20} /> Enviar e falar no WhatsApp</>
                )}
              </button>

              <p className="text-center text-amf-muted text-xs">
                Seus dados são usados apenas para contato comercial. Não compartilhamos com terceiros.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
