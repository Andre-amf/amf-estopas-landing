/**
 * PASSO 2 — Postar Reel como Story (roda todo dia)
 *
 * Lê schedule.json, baixa o vídeo do Reel localmente,
 * faz upload para host público e cria o Story via API.
 *
 * Como usar:
 *   cd C:\AMF\instagram-autopost
 *   node 2-postar-story-hoje.js
 */

require('dotenv').config();
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOKEN   = process.env.IG_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN;
const USER_ID = process.env.IG_BUSINESS_ID  || process.env.INSTAGRAM_USER_ID;

if (!TOKEN || !USER_ID) {
  console.error('ERRO: IG_ACCESS_TOKEN ou IG_BUSINESS_ID não encontrado no .env');
  process.exit(1);
}
if (!fs.existsSync('schedule.json')) {
  console.error('ERRO: schedule.json não encontrado. Rode primeiro: node 1-listar-reels.js');
  process.exit(1);
}

// Pasta para guardar vídeos baixados
const VIDEOS_DIR = path.join(__dirname, 'videos');
if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR);

function apiPost(path_, params) {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({ ...params, access_token: TOKEN }).toString();
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v19.0${path_}?${query}`,
      method: 'POST',
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    });
    req.on('error', reject);
    req.end();
  });
}

function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

// Baixa arquivo de uma URL com suporte a redirecionamentos
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const request = (u) => {
      const lib = u.startsWith('https') ? https : http;
      lib.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          return request(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Download falhou: HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(destPath)));
        file.on('error', reject);
      }).on('error', reject);
    };
    request(url);
  });
}

// Upload para host público temporário (0x0.st)
function uploadToPublicHost(filePath) {
  return new Promise((resolve, reject) => {
    const fileData = fs.readFileSync(filePath);
    const filename  = path.basename(filePath);
    const boundary  = 'amf' + Date.now();
    const header    = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: video/mp4\r\n\r\n`;
    const footer    = `\r\n--${boundary}--\r\n`;
    const body      = Buffer.concat([Buffer.from(header), fileData, Buffer.from(footer)]);

    const options = {
      hostname: '0x0.st',
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
        'User-Agent': 'AMF-Estopas-AutoPost/1.0',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const url = data.trim();
        if (url.startsWith('http')) resolve(url);
        else reject(new Error('Upload falhou: ' + url));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function aguardarProcessamento(containerId, tentativas = 12) {
  for (let i = 0; i < tentativas; i++) {
    await sleep(5000);
    const status = await apiGet(
      `https://graph.facebook.com/v19.0/${containerId}?fields=status_code,status&access_token=${TOKEN}`
    );
    console.log(`   Processando... (${status.status_code || status.status})`);
    if (status.status_code === 'FINISHED') return true;
    if (status.status_code === 'ERROR') {
      console.error('   Detalhe:', JSON.stringify(status));
      return false;
    }
  }
  return false;
}

async function main() {
  const hoje     = new Date().toISOString().split('T')[0];
  const schedule = JSON.parse(fs.readFileSync('schedule.json', 'utf8'));
  const entrada  = schedule.find(e => e.date === hoje && e.ativo !== false);

  if (!entrada) {
    console.log(`📅 Nenhum story agendado para hoje (${hoje}).`);
    process.exit(0);
  }

  console.log(`\n📅 Data: ${hoje}`);
  console.log(`🎬 Reel ID: ${entrada.reel_id}`);
  console.log(`🔗 Link: ${entrada.reel_url}\n`);

  // 1. Busca a URL do vídeo
  console.log('1️⃣  Buscando URL do vídeo...');
  const reelData = await apiGet(
    `https://graph.facebook.com/v19.0/${entrada.reel_id}?fields=id,media_type,media_url&access_token=${TOKEN}`
  );
  if (reelData.error) {
    console.error('ERRO ao buscar Reel:', reelData.error.message);
    process.exit(1);
  }
  const cdnUrl = reelData.media_url;
  if (!cdnUrl) {
    console.error('ERRO: media_url não encontrada.');
    process.exit(1);
  }
  console.log('   CDN URL obtida.');

  // 2. Baixa o vídeo localmente
  const videoPath = path.join(VIDEOS_DIR, `reel_${entrada.reel_id}.mp4`);
  if (fs.existsSync(videoPath)) {
    console.log('\n2️⃣  Vídeo já baixado, reutilizando...');
  } else {
    console.log('\n2️⃣  Baixando vídeo...');
    await downloadFile(cdnUrl, videoPath);
    const size = (fs.statSync(videoPath).size / 1024 / 1024).toFixed(1);
    console.log(`   Baixado: ${size} MB → ${videoPath}`);
  }

  // 3. Faz upload para host público
  console.log('\n3️⃣  Fazendo upload para host público (0x0.st)...');
  const publicUrl = await uploadToPublicHost(videoPath);
  console.log(`   URL pública: ${publicUrl}`);

  // 4. Cria o container do Story
  console.log('\n4️⃣  Criando container do Story...');
  const container = await apiPost(`/${USER_ID}/media`, {
    media_type: 'STORIES',
    video_url: publicUrl,
  });
  if (container.error) {
    console.error('ERRO ao criar Story:', container.error.message);
    console.error('Detalhe:', JSON.stringify(container.error));
    process.exit(1);
  }
  console.log(`   Container ID: ${container.id}`);

  // 5. Aguarda processamento
  console.log('\n5️⃣  Aguardando processamento...');
  const ok = await aguardarProcessamento(container.id);
  if (!ok) {
    console.error('ERRO: Processamento falhou.');
    process.exit(1);
  }

  // 6. Publica
  console.log('\n6️⃣  Publicando Story...');
  const pub = await apiPost(`/${USER_ID}/media_publish`, { creation_id: container.id });
  if (pub.error) {
    console.error('ERRO ao publicar:', pub.error.message);
    process.exit(1);
  }

  console.log(`\n✅ Story publicado! ID: ${pub.id}`);
  console.log(`   Acesse: https://www.instagram.com/stories/amfestopas/\n`);

  // Marca como postado
  const updated = schedule.map(e =>
    e.date === hoje ? { ...e, postado: true, postado_em: new Date().toISOString() } : e
  );
  fs.writeFileSync('schedule.json', JSON.stringify(updated, null, 2));
}

main().catch(err => {
  console.error('Erro inesperado:', err.message);
  process.exit(1);
});
