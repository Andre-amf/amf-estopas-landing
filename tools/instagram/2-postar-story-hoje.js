/**
 * PASSO 2 — Postar Reel como Story (roda todo dia)
 *
 * Lê o schedule.json, encontra o Reel de hoje e posta como Story.
 * Configure no Agendador de Tarefas do Windows para rodar todo dia às 9h.
 *
 * Como usar manualmente:
 *   cd C:\AMF\instagram-autopost
 *   node 2-postar-story-hoje.js
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');

const TOKEN   = process.env.IG_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN;
const USER_ID = process.env.IG_BUSINESS_ID || process.env.INSTAGRAM_USER_ID;

if (!TOKEN || !USER_ID) {
  console.error('ERRO: IG_ACCESS_TOKEN ou IG_BUSINESS_ID não encontrado no .env');
  console.error('Rode primeiro: node 1-listar-reels.js');
  process.exit(1);
}

if (!fs.existsSync('schedule.json')) {
  console.error('ERRO: schedule.json não encontrado. Rode primeiro: node 1-listar-reels.js');
  process.exit(1);
}

function apiPost(path, params) {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({ ...params, access_token: TOKEN }).toString();
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v19.0${path}?${query}`,
      method: 'POST',
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function apiGet(url) {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function aguardarProcessamento(containerId, tentativas = 10) {
  for (let i = 0; i < tentativas; i++) {
    await sleep(5000);
    const status = await apiGet(
      `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${TOKEN}`
    );
    console.log(`   Processando... (${status.status_code})`);
    if (status.status_code === 'FINISHED') return true;
    if (status.status_code === 'ERROR') return false;
  }
  return false;
}

async function main() {
  const hoje = new Date().toISOString().split('T')[0];
  const schedule = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
  const entrada = schedule.find(e => e.date === hoje && e.ativo !== false);

  if (!entrada) {
    console.log(`📅 Nenhum story agendado para hoje (${hoje}).`);
    process.exit(0);
  }

  console.log(`\n📅 Data: ${hoje}`);
  console.log(`🎬 Reel ID: ${entrada.reel_id}`);
  console.log(`🔗 Link: ${entrada.reel_url}\n`);

  // Busca a URL do vídeo do Reel
  console.log('1️⃣  Buscando URL do vídeo...');
  const reelData = await apiGet(
    `https://graph.facebook.com/v19.0/${entrada.reel_id}?fields=id,media_type,media_url,video_url&access_token=${TOKEN}`
  );

  if (reelData.error) {
    console.error('ERRO ao buscar Reel:', reelData.error.message);
    process.exit(1);
  }

  const videoUrl = reelData.video_url || reelData.media_url;
  if (!videoUrl) {
    console.error('ERRO: URL do vídeo não encontrada.');
    console.error('Dados retornados:', JSON.stringify(reelData, null, 2));
    process.exit(1);
  }

  console.log(`   URL: ${videoUrl.substring(0, 80)}...`);

  // Cria o container do Story
  console.log('\n2️⃣  Criando container do Story...');
  const container = await apiPost(`/${USER_ID}/media`, {
    media_type: 'VIDEO',
    video_url: videoUrl,
  });

  if (container.error) {
    console.error('ERRO ao criar Story:', container.error.message);
    process.exit(1);
  }

  console.log(`   Container ID: ${container.id}`);

  // Aguarda processamento do vídeo
  console.log('\n3️⃣  Aguardando processamento do vídeo (pode levar ~30s)...');
  const ok = await aguardarProcessamento(container.id);

  if (!ok) {
    console.error('ERRO: Processamento do vídeo falhou.');
    process.exit(1);
  }

  // Publica o Story
  console.log('\n4️⃣  Publicando Story...');
  const publicacao = await apiPost(`/${USER_ID}/media_publish`, {
    creation_id: container.id,
  });

  if (publicacao.error) {
    console.error('ERRO ao publicar:', publicacao.error.message);
    process.exit(1);
  }

  console.log(`\n✅ Story publicado com sucesso! ID: ${publicacao.id}`);
  console.log(`   Acesse: https://www.instagram.com/stories/amfestopas/\n`);

  // Marca como postado no schedule.json
  const updated = schedule.map(e =>
    e.date === hoje ? { ...e, postado: true, postado_em: new Date().toISOString() } : e
  );
  fs.writeFileSync('schedule.json', JSON.stringify(updated, null, 2));
}

main().catch(err => {
  console.error('Erro inesperado:', err.message);
  process.exit(1);
});
