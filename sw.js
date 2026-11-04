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
const CACHE = 'mq-pages-v1';
const CORE = ['/', '/index.html', '/mun-link.js', '/manifest.webmanifest', '/icons/icon-192.png'];
const MAX_ITEMS = 400;                  // とっておくファイルの数の上限
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
      const res = await fetch(req);
      if (res && res.ok && res.type === 'basic') {
        const len = parseInt(res.headers.get('content-length') || '0', 10);
        if (!len || len < MAX_BYTES) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).then(trim).catch(() => {});
        }
      }
      return res;
    } catch (err) {
      const c = await caches.open(CACHE);
      const hit = await c.match(req) || await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') return new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      return Response.error();
    }
  })());
});
