/* =====================================================================
   むん先生の学習クエスト　サービスワーカー（sw.js）  2026.11
   ---------------------------------------------------------------------
   ・「ホーム画面に入れる」と、アプリのように開けるようにするためのファイルです。
   ・いつもは、ふつうにネットから最新のページを読みます（ネット優先）。
     ネットがつながらないときだけ、前にひらいたページを、この端末の中から出します。
   ・このサイトのページだけをあつかいます。ほかのサイト（広告・フォントなど）にはさわりません。
   ・学習の記録（コイン・レベルなど）には、いっさいさわりません。
   ・とめたいとき：このファイルの中身を、下の「とめるとき」の3行だけにしてアップロードしてください。
       self.addEventListener('install', () => self.skipWaiting());
       self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))).then(() => self.registration.unregister())));
       // （ここまで）
   ===================================================================== */
const CACHE = 'mq-pages-v3';
const CORE = ['/', '/index.html', '/mun-link.js', '/manifest.webmanifest', '/icons/icon-192.png', '/search.html', '/search-index.json'];
const MAX_ITEMS = 1200;                 // とっておくファイルの数の上限
const MAX_BYTES = 8 * 1024 * 1024;      // 8MB より大きいファイルは、とっておかない

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mq-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function trim() {
  const c = await caches.open(CACHE); const ks = await c.keys();
  for (let i = 0; i < ks.length - MAX_ITEMS; i++) await c.delete(ks[i]);
}

/* ---- 古い形の「このアプリについて」ブロックを、ページを開く前に取りのぞく ----
   アプリの画面にかぶさって使えなくなる、古い形のブロック（mq-about）だけを取りのぞきます。
   ・新しい形（右下の小さな📘ボタン）のブロックは、そのまま残します。
   ・ページの中身が読めなかったとき・見つからなかったときは、何も変えずに通します。 */
async function cleanHit(res) { return clean(res, true); }
async function clean(res, fromCache) {
  try {
    if (!res || !res.ok || (!fromCache && res.type !== 'basic')) return res;
    const ct = res.headers.get('content-type') || '';
    if (ct.indexOf('text/html') < 0) return res;
    const len = parseInt(res.headers.get('content-length') || '0', 10);
    if (len > 6 * 1024 * 1024) return res;
    const buf = await res.clone().arrayBuffer();
    const txt = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(buf);
    if (txt.indexOf('mq-about:start') < 0) return res;
    const out = txt.replace(/<!-- mq-about:start[\s\S]*?<!-- mq-about:end -->/g, m => (m.indexOf('all:initial') >= 0 ? m : ''));
    if (out === txt) return res;
    const h = new Headers(res.headers); h.delete('content-length'); h.delete('content-encoding');
    return new Response(new TextEncoder().encode(out), { status: res.status, statusText: res.statusText, headers: h });
  } catch (err) { return res; }
}

const OFFLINE = '<!DOCTYPE html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>オフライン｜むん先生の学習クエスト</title>' +
  '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#050914;color:#e2e8f0;font-family:sans-serif;text-align:center;padding:20px">' +
  '<div><div style="font-size:48px">📡</div><h1 style="font-size:22px">ネットにつながっていません</h1><p style="line-height:1.8">このページは、まだこの端末にとってありません。<br>ネットにつながってから、もう一度ひらいてください。</p>' +
  '<p><a href="/index.html" style="color:#00e5ff;font-weight:bold">トップページへ</a></p></div></body></html>';

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // ほかのサイトにはさわらない
  if (url.pathname === '/sw.js') return;
  e.respondWith((async () => {
    try {
      const raw = await fetch(req);
      const res = await clean(raw);
      if (raw && raw.ok && raw.type === 'basic') {
        const len = parseInt(raw.headers.get('content-length') || '0', 10);
        if (!len || len < MAX_BYTES) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).then(trim).catch(() => {});
        }
      }
      return res;
    } catch (err) {
      const c = await caches.open(CACHE);
      const hit = await c.match(req) || await c.match(req, { ignoreSearch: true });
      if (hit) return await cleanHit(hit);
      if (req.mode === 'navigate') return new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      return Response.error();
    }
  })());
});

/* ---- 「オフライン用にまとめて保存」（offline.html から呼ばれます） ---- */
self.addEventListener('message', e => {
  const d = e.data || {}, port = e.ports && e.ports[0];
  const say = m => { try { port && port.postMessage(m); } catch (err) {} };
  if (d.type === 'precache' && Array.isArray(d.urls)) {
    e.waitUntil((async () => {
      const c = await caches.open(CACHE); const urls = d.urls.filter(u => typeof u === 'string' && u.startsWith('/')).slice(0, 600);
      let done = 0, ok = 0, ng = 0;
      for (let i = 0; i < urls.length; i += 4) {
        await Promise.all(urls.slice(i, i + 4).map(async u => {
          try { const r = await fetch(new Request(u, { cache: 'reload' })); if (r && r.ok && r.type === 'basic') { await c.put(u, r); ok++; } else ng++; } catch (err) { ng++; }
          done++; say({ done, total: urls.length });
        }));
      }
      say({ fin: 1, total: urls.length, ok, ng });
    })());
  } else if (d.type === 'clear') {
    e.waitUntil((async () => {
      const c = await caches.open(CACHE); const ks = await c.keys();
      for (const k of ks) { const p = new URL(k.url).pathname; if (!CORE.includes(p)) await c.delete(k); }
      say({ fin: 1 });
    })());
  }
});
