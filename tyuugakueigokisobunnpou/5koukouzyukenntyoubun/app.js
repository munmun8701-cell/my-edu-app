// 長文読解：アプリの動作（通信なし・きろくは端末内のlocalStorageのみ）
const $ = id => document.getElementById(id);
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => s.toLowerCase().replace(/[.,!?'’"]/g, '').replace(/\s+/g, ' ').trim();
const starsFor = p => p >= 90 ? 3 : p >= 75 ? 2 : p >= 60 ? 1 : 0;
const starStr = n => '★'.repeat(n) + '☆'.repeat(3 - n);
const LVS = [1, 2, 3, 4, 5];
const LV_NAME = {1:'★1 基礎（本文が短い・3択）', 2:'★2 標準（指示語・時制）', 3:'★3 応用（語句補充・要旨）', 4:'★4 発展（長め・文脈）', 5:'★5 実戦（長文・英問英答）'};

// 設問ごとの問題（本文ごとに展開）
const ALLQ = READ.flatMap(p => p.qs.map(q => ({p, q, lv: p.lv})));
const TAG_LV = {};
ALLQ.forEach(x => { if (!(x.q.t in TAG_LV)) TAG_LV[x.q.t] = x.lv; });

// ---- きろく（端末内のみ）----
const KEY = 'munmun-eigo-reading-v1';
let P;
try { P = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { P = {}; }
P.lv = P.lv || {};
P.tags = P.tags || {};
function saveP() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }
function recordTag(tag, ok) { const r = P.tags[tag] || {c:0, t:0}; r.t += 1; if (ok) r.c += 1; P.tags[tag] = r; saveP(); }
function lvBest(lv) { return P.lv[lv] || {stars:0, pct:0}; }
function totalStars() { return LVS.reduce((s, lv) => s + lvBest(lv).stars, 0); }

// ---- 共通の部品 ----
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === 'scr-' + id));
  $('totalStars').textContent = totalStars();
  window.scrollTo(0, 0);
}
function mk(html, cls, fn) {
  const b = document.createElement('button');
  if (cls) b.className = cls;
  b.innerHTML = html;
  if (fn) b.onclick = fn;
  return b;
}
function card(html) { const d = document.createElement('div'); d.className = 'card'; d.innerHTML = html; return d; }
function goHome() { renderHome(); show('home'); }
function speak(t) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = 'en-US'; u.rate = 0.9;
  speechSynthesis.speak(u);
}
let AC = null;
function beep(ok) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime;
    const seq = ok ? [660, 880, 1320] : [220, 160];
    seq.forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = ok ? 'triangle' : 'sawtooth';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.09 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.12);
      o.connect(g).connect(AC.destination);
      o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.13);
    });
  } catch (e) {}
}

// ---- ホーム ----
function renderHome() {
  const list = $('levelList');
  list.innerHTML = '';
  LVS.forEach(lv => {
    const r = lvBest(lv);
    const n = READ.filter(p => p.lv === lv).length;
    list.appendChild(mk(`<span class="num">${lv}</span><span class="info"><b>${LV_NAME[lv]}</b><small><span class="stars">${starStr(r.stars)}</span>　${r.pct ? 'ベスト ' + r.pct + '%' : 'まだ挑戦していません'}　（本文${n}本）</small></span>`,
      'stage-card', () => startLevel(lv)));
  });
}

// ---- 苦手マップ ----
function openMap() {
  const body = $('mapBody');
  body.innerHTML = '';
  body.append(mk('← ホーム', 'back', goHome));
  const rows = Object.entries(P.tags).filter(([, r]) => r.t > 0)
    .map(([tag, r]) => ({tag, c: r.c, t: r.t, pct: Math.round(r.c / r.t * 100)}))
    .sort((a, b) => a.pct - b.pct || b.t - a.t);
  const totC = rows.reduce((s, r) => s + r.c, 0), totT = rows.reduce((s, r) => s + r.t, 0);
  body.append(card(`<div class="kicker">苦手マップ</div><h2>設問の種類ごとの正答率</h2>
    <p class="muted">赤は苦手、黄色はもう少し、緑は得意です。苦手な種類の設問は、本文を読み直すところから始めましょう。</p>` +
    (totT ? `<p>これまでの正答率：<b>${Math.round(totC / totT * 100)}%</b>（${totC}/${totT}問）</p>` : '<p class="muted">まだデータがありません。練習してみよう！</p>')));
  rows.forEach(r => {
    const cls = r.pct < 60 ? 'lo' : r.pct < 80 ? 'mid' : '';
    const c = card(`<div class="tagrow"><b>${r.tag}</b><span>${r.pct}%</span></div>
      <div class="bar"><span class="${cls}" style="width:${r.pct}%"></span></div>
      <div class="tagrow"><small class="muted">${r.c}/${r.t}問</small></div>`);
    c.append(mk('✏️ この種類の設問を練習（★' + TAG_LV[r.tag] + '）', '', () => startLevel(TAG_LV[r.tag])));
    body.append(c);
  });
  show('map');
}

// ---- クイズ ----
let Q = null;
function startLevel(lv) {
  const list = ALLQ.filter(x => x.lv === lv);
  startQuiz(list, {kind:'level', lv, label:`長文読解｜${LV_NAME[lv]}`});
}
function retry(ctx) { startLevel(ctx.lv); }
function startQuiz(list, ctx) {
  Q = {ctx, label: ctx.label, list, i: 0, c: 0, wrong: [], answered: false};
  show('quiz');
  renderQ();
}
function nextQ() { if (!Q) return; Q.i++; renderQ(); }
function renderQ() {
  if (Q.i >= Q.list.length) return finishQuiz();
  const x = Q.list[Q.i];
  Q.answered = false;
  $('qLabel').textContent = Q.label;
  $('qCount').textContent = `${Q.i + 1} / ${Q.list.length}`;
  $('qProg').style.width = (Q.i / Q.list.length * 100) + '%';
  const box = $('qBox');
  box.innerHTML = `<div class="kicker">${x.p.title}</div><div class="passage">${x.p.passage}</div>`;
  const qd = document.createElement('div');
  if (x.q.eq) renderEq(box, x.q); else renderChoice(box, x.q);
  return qd;
}

function renderChoice(box, q) {
  const q1 = document.createElement('div');
  q1.innerHTML = `<div class="q-ja">${q.q}</div><div class="choices col1" id="choices"></div><div id="fb"></div>`;
  box.append(q1);
  const wrap = $('choices');
  shuffle([q.ok, ...q.d]).forEach(o => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = o;
    b.onclick = () => answerChoice(b, o, q);
    wrap.appendChild(b);
  });
}
function answerChoice(btn, o, q) {
  if (Q.answered) return;
  const ok = o === q.ok;
  document.querySelectorAll('#choices .choice').forEach(c => {
    c.disabled = true;
    if (c.textContent === q.ok) c.classList.add('right');
  });
  if (!ok) btn.classList.add('wrong');
  judge(ok, q, q.ok);
}

function renderEq(box, q) {
  const q1 = document.createElement('div');
  q1.innerHTML = `<div class="eq-q">${q.q}</div>
    <input id="typeIn" class="typein" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="英語で答えてね">
    <div class="btn-row"><button id="btnCheckType" class="primary">こたえる</button><button id="btnHint">💡 ヒント</button></div>
    <div id="hintBox"></div><div id="fb"></div>`;
  box.append(q1);
  $('btnHint').onclick = () => { $('hintBox').innerHTML = `<div class="hint">💡 ${q.h}</div>`; };
  $('btnCheckType').onclick = () => {
    if (Q.answered) return;
    const v = norm($('typeIn').value);
    judge(q.answers.some(a => norm(a) === v), q, q.answers[0]);
  };
  setTimeout(() => { const i = $('typeIn'); if (i) i.focus(); }, 50);
}

function judge(ok, q, correctText) {
  if (Q.answered) return;
  Q.answered = true;
  if (ok) Q.c += 1; else Q.wrong.push(q.t);
  recordTag(q.t, ok);
  beep(ok);
  document.querySelectorAll('#qBox input').forEach(i => i.disabled = true);
  const last = Q.i + 1 >= Q.list.length;
  const fb = document.createElement('div');
  fb.className = 'fb ' + (ok ? 'ok' : 'ng');
  fb.innerHTML = `<div class="fb-title">${ok ? '⭕ せいかい！' : '❌ おしい！'}</div>` +
    (ok ? '' : `<div>正解：<b class="ans">${correctText}</b></div>`) +
    `<div class="hint">💡 ${q.h}</div>`;
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk(last ? 'けっかを見る ▶' : 'つぎへ ▶', 'primary', nextQ));
  fb.append(row);
  const holder = $('fb');
  if (holder) holder.replaceWith(fb);
}

function finishQuiz() {
  const n = Q.list.length, pct = Math.round(Q.c / n * 100), stars = starsFor(pct), ctx = Q.ctx;
  const prev = lvBest(ctx.lv);
  P.lv[ctx.lv] = {stars: Math.max(prev.stars, stars), pct: Math.max(prev.pct, pct)};
  saveP();
  renderResult({pct, stars, c: Q.c, n, wrong: [...new Set(Q.wrong)], ctx});
  Q = null;
}

function renderResult(r) {
  const body = $('resultBody');
  body.innerHTML = '';
  const msg = r.pct >= 90 ? 'かんぺき！本文の読み取りがしっかりできています。'
    : r.pct >= 75 ? 'よくできました！'
    : r.pct >= 60 ? 'クリア！まちがえた設問の種類を確認しよう。'
    : 'だいじょうぶ。本文を一文ずつ読み直すと、答えが見つかりやすくなります。';
  body.append(card(`<div class="kicker">けっか｜${r.ctx.label}</div><div class="big">${starStr(r.stars)}</div>
    <p class="center"><b style="font-size:1.6rem">${r.pct}%</b><br>${r.c} / ${r.n} 問 正解</p><p class="center">${msg}</p>`));
  if (r.wrong.length) {
    const c = card('<h3>🔍 まちがえた設問の種類</h3>');
    const wrap = document.createElement('div'); wrap.className = 'tagwrap';
    r.wrong.forEach(t => wrap.append(mk(t, 'tagbtn', () => startLevel(TAG_LV[t]))));
    c.append(wrap);
    body.append(c);
  } else {
    body.append(card('<h3>🎉 まちがいなし！</h3><p class="muted">次のレベルにチャレンジしよう！</p>'));
  }
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('🔁 もう一度', 'primary', () => retry(r.ctx)));
  if (r.ctx.lv < 5) row.append(mk('▶ つぎのレベル', '', () => startLevel(r.ctx.lv + 1)));
  row.append(mk('🏠 ホームへ', 'ghost', goHome));
  body.append(row);
  show('result');
}

// ---- キーボード（Enterで次へ・答え合わせ）----
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !Q || e.target.tagName === 'BUTTON') return;
  if (!$('scr-quiz').classList.contains('active')) return;
  if (Q.answered) nextQ();
  else if ($('btnCheckType')) $('btnCheckType').click();
});

// ---- 初期化 ----
$('toMap').onclick = openMap;
$('quitBtn').onclick = () => { Q = null; goHome(); };
let resetArmed = 0;
$('resetBtn').onclick = () => {
  const b = $('resetBtn');
  if (Date.now() - resetArmed < 4000) {
    P = {lv: {}, tags: {}};
    saveP();
    resetArmed = 0;
    b.textContent = 'きろくをリセット';
    goHome();
    return;
  }
  resetArmed = Date.now();
  b.textContent = 'もう一度押すと消えます';
};
goHome();
