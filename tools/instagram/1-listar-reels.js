/**
 * PASSO 1 — Listar Reels publicados
 *
 * Roda uma vez para ver todos os Reels e gerar o schedule.json
 *
 * Como usar:
 *   cd C:\AMF\instagram-autopost
 *   node 1-listar-reels.js
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');

const TOKEN = process.env.IG_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN;

if (!TOKEN) {
  console.error('ERRO: IG_ACCESS_TOKEN não encontrado no .env');
  process.exit(1);
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('\n📱 Buscando dados do usuário...');
  const me = await get(
    `https://graph.facebook.com/v19.0/me?fields=id,username&access_token=${TOKEN}`
  );

  if (me.error) {
    console.error('ERRO na API:', me.error.message);
    process.exit(1);
  }

  const userId = me.id;
  console.log(`✅ Conta: @${me.username} (ID: ${userId})\n`);

  // Salva o userId no .env automaticamente se não estiver lá
  const envPath = '.env';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (!envContent.includes('IG_BUSINESS_ID') && !envContent.includes('INSTAGRAM_USER_ID')) {
      fs.appendFileSync(envPath, `\nIG_BUSINESS_ID=${userId}\n`);
      console.log('✅ INSTAGRAM_USER_ID adicionado ao .env\n');
    }
  }

  console.log('🎬 Buscando Reels...\n');
  const media = await get(
    `https://graph.facebook.com/v19.0/${userId}/media?fields=id,media_type,timestamp,permalink,thumbnail_url&limit=50&access_token=${TOKEN}`
  );

  if (media.error) {
    console.error('ERRO:', media.error.message);
    process.exit(1);
  }

  const reels = media.data.filter(m => m.media_type === 'VIDEO' || m.media_type === 'REEL');

  if (reels.length === 0) {
    console.log('Nenhum Reel encontrado. Verifique se a conta tem Reels publicados.');
    process.exit(0);
  }

  console.log(`Encontrados ${reels.length} Reels:\n`);
  console.log('Nº  | Data        | ID                  | Link');
  console.log('----+-------------+---------------------+----------------------------------');

  reels.forEach((r, i) => {
    const date = new Date(r.timestamp).toLocaleDateString('pt-BR');
    const num = String(i + 1).padStart(3);
    console.log(`${num} | ${date.padEnd(11)} | ${r.id} | ${r.permalink}`);
  });

  // Gera schedule.json com os próximos 30 dias (1 Reel por dia, cíclico)
  const schedule = [];
  const hoje = new Date();
  for (let d = 0; d < 30; d++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + d);
    const dateStr = data.toISOString().split('T')[0];
    const reel = reels[d % reels.length];
    schedule.push({
      date: dateStr,
      reel_id: reel.id,
      reel_url: reel.permalink,
      hora: '09:00',
      ativo: true,
    });
  }

  fs.writeFileSync('schedule.json', JSON.stringify(schedule, null, 2));
  console.log('\n✅ Arquivo schedule.json gerado!');
  console.log('   Edite-o para definir quais Reels postar em quais dias.');
  console.log('   Depois rode: node 2-postar-story-hoje.js\n');
}

main().catch(err => {
  console.error('Erro inesperado:', err.message);
  process.exit(1);
});
