// 高校受験：アプリの動作（通信なし・きろくは端末内のlocalStorageのみ）
const $ = id => document.getElementById(id);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => s.toLowerCase().replace(/[.,!?'’"]/g, '').replace(/\s+/g, ' ').trim();
const starsFor = p => p >= 90 ? 3 : p >= 75 ? 2 : p >= 60 ? 1 : 0;
const starStr = n => '★'.repeat(n) + '☆'.repeat(3 - n);
const LV_NAME = {1:'★1 基礎（3択）', 2:'★2 標準（文脈で選ぶ）', 3:'★3 応用（並べかえ）', 4:'★4 発展（和文英訳）', 5:'★5 実戦（英作文・書きかえ）'};
const TYPE_BY_LV = {1:'choice', 2:'choice', 3:'order', 4:'type', 5:'type'};
const LVS = [1, 2, 3, 4, 5];
const CYCLE = ['choice', 'order', 'type'];

const ALL = STAGES.flatMap((s, si) => s.items.map(it => ({...it, si})));
const TAG_STAGE = {};
ALL.forEach(it => { if (!(it.t in TAG_STAGE)) TAG_STAGE[it.t] = it.si; });

// ---- きろく（端末内のみ）----
const KEY = 'munmun-eigo-koukou-v1';
let P;
try { P = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { P = {}; }
P.stages = P.stages || {};
P.tags = P.tags || {};
function saveP() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }
function recordTag(tag, ok) { const r = P.tags[tag] || {c:0, t:0}; r.t += 1; if (ok) r.c += 1; P.tags[tag] = r; saveP(); }
function lvBest(si, lv) { return (P.stages[si] && P.stages[si][lv]) || {stars:0, pct:0}; }
function bestStars(si) { return Math.max(...LVS.map(lv => lvBest(si, lv).stars)); }
function cleared(si) { return bestStars(si) >= 1; }
function stageUnlocked(si) { return si === 0 || cleared(si - 1); }
function bossUnlocked() { return STAGES.every((_, si) => cleared(si)); }
function totalStars() {
  let t = 0;
  STAGES.forEach((_, si) => { t += LVS.reduce((sum, lv) => sum + lvBest(si, lv).stars, 0); });
  return t + (P.boss ? P.boss.stars : 0);
}
function weakTags() { return Object.keys(P.tags).filter(k => { const r = P.tags[k]; return r.t > 0 && r.c / r.t < 0.7; }); }
function weakItems() { const w = weakTags(); return ALL.filter(it => w.includes(it.t)); }

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

// 音声（端末の読み上げ機能）と効果音（Web Audio）
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
  const list = $('stageList');
  list.innerHTML = '';
  STAGES.forEach((s, si) => {
    const open = stageUnlocked(si), bs = bestStars(si);
    const b = mk(`<span class="num">${si + 1}</span><span class="info"><b>${s.name}</b><small>${open ? `<span class="stars">${starStr(bs)}</span>` : '🔒 前のステージをクリアで開くよ'}</small></span>`,
      'stage-card' + (open ? '' : ' locked') + (bs === 3 ? ' perfect' : ''),
      () => { if (open) openStage(si); });
    list.appendChild(b);
  });
  const bo = bossUnlocked();
  const boss = mk(`<span class="num">👾</span><span class="info"><b>ボス戦：総合実力テスト</b><small>${bo ? `<span class="stars">${starStr(P.boss ? P.boss.stars : 0)}</span>　12問のミックス` : '🔒 全ステージをクリアで挑戦'}</small></span>`,
    'stage-card boss' + (bo ? '' : ' locked'), () => { if (bo) startBoss(); });
  list.appendChild(boss);
}

// ---- ステージ（レベル選択）----
function openStage(si) {
  const s = STAGES[si];
  const body = $('stageBody');
  body.innerHTML = '';
  body.append(mk('← ホーム', 'back', goHome));
  body.append(card(`<div class="kicker">ステージ ${si + 1}</div><h2>${s.name}</h2><p class="muted">まずは「おぼえる」でポイントを確認してから、レベルを選ぼう。</p>`));
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('📖 おぼえる', 'primary', () => openLearn(si)));
  body.append(row);
  body.append(card('<h3>レベルをえらぶ</h3>'));
  LVS.forEach(lv => {
    const r = lvBest(si, lv);
    body.append(mk(`<span class="num">${lv}</span><span class="info"><b>${LV_NAME[lv]}</b><small><span class="stars">${starStr(r.stars)}</span>　${r.pct ? 'ベスト ' + r.pct + '%' : 'まだ挑戦していません'}</small></span>`,
      'stage-card', () => startStage(si, lv)));
  });
  show('stage');
}

// ---- おぼえる ----
function openLearn(si) {
  const s = STAGES[si];
  const body = $('learnBody');
  body.innerHTML = '';
  body.append(mk('← ステージへ', 'back', () => openStage(si)));
  body.append(card(`<div class="kicker">おぼえる｜ステージ ${si + 1}</div><h2>${s.name}</h2><div class="point">${s.p}</div>`));
  const ex = card('<h3>れいぶん（ピンクの所がポイント）</h3>');
  s.items.forEach(it => {
    const row = document.createElement('div'); row.className = 'ex';
    row.innerHTML = `<div class="ex-ja">${it.ja}</div><div class="ex-en">${it.en.replace(new RegExp('\\b' + esc(it.b) + '\\b'), m => `<mark>${m}</mark>`)}</div>`;
    row.append(mk('🔊', '', () => speak(it.en)));
    ex.append(row);
  });
  body.append(ex);
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('✏️ れんしゅうへ', 'primary', () => openStage(si)));
  body.append(row);
  show('learn');
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
  body.append(card(`<div class="kicker">苦手マップ</div><h2>つまずきが一目でわかる</h2>
    <p class="muted">「つまずき」ごとの正答率です。赤は苦手、黄色はもう少し、緑は得意です。</p>` +
    (totT ? `<p>これまでの正答率：<b>${Math.round(totC / totT * 100)}%</b>（${totC}/${totT}問）</p>` : '<p class="muted">まだデータがありません。ステージに挑戦してみよう！</p>')));
  const weak = weakItems();
  const wb = mk(`🎯 苦手だけ集中れんしゅう（${weak.length ? weak.length + '問' : 'いまはなし'}）`, 'primary', startWeak);
  wb.disabled = !weak.length;
  body.append(wb);
  rows.forEach(r => {
    const cls = r.pct < 60 ? 'lo' : r.pct < 80 ? 'mid' : '';
    const c = card(`<div class="tagrow"><b>${r.tag}</b><span>${r.pct}%</span></div>
      <div class="bar"><span class="${cls}" style="width:${r.pct}%"></span></div>
      <div class="tagrow"><small class="muted">${r.c}/${r.t}問</small></div>`);
    c.append(mk('📖 おぼえる', '', () => openLearn(TAG_STAGE[r.tag])));
    body.append(c);
  });
  show('map');
}

// ---- クイズ ----
let Q = null;
function startStage(si, lv) {
  const s = STAGES[si];
  startQuiz(shuffle(s.items.filter(it => it.lv === lv).map(it => ({...it, si}))),
    {kind:'stage', si, lv, label:`ステージ${si + 1}｜${s.name}・${LV_NAME[lv]}`},
    () => TYPE_BY_LV[lv]);
}
function startBoss() {
  startQuiz(shuffle(ALL).slice(0, 12), {kind:'boss', label:'👾 ボス戦｜総合実力テスト'}, i => CYCLE[i % 3]);
}
function startWeak() {
  const items = shuffle(weakItems()).slice(0, 12);
  if (!items.length) return;
  startQuiz(items, {kind:'weak', label:'🎯 苦手れんしゅう'}, i => CYCLE[i % 3]);
}
function retry(ctx) {
  if (ctx.kind === 'stage') startStage(ctx.si, ctx.lv);
  else if (ctx.kind === 'boss') startBoss();
  else startWeak();
}
function startQuiz(items, ctx, typeFn) {
  Q = {ctx, label: ctx.label, list: items.map((it, i) => ({it, type: typeFn(i, it)})), i: 0, c: 0, wrong: [], answered: false};
  show('quiz');
  renderQ();
}
function nextQ() { if (!Q) return; Q.i++; renderQ(); }
function renderQ() {
  if (Q.i >= Q.list.length) return finishQuiz();
  const q = Q.list[Q.i], it = q.it;
  Q.answered = false; Q.bank = []; Q.built = [];
  $('qLabel').textContent = Q.label;
  $('qCount').textContent = `${Q.i + 1} / ${Q.list.length}`;
  $('qProg').style.width = (Q.i / Q.list.length * 100) + '%';
  const box = $('qBox');
  box.innerHTML = '';
  if (q.type === 'choice') renderChoice(box, it);
  else if (q.type === 'order') renderOrder(box, it);
  else renderType(box, it);
}

function renderChoice(box, it) {
  const shown = it.en.replace(new RegExp('\\b' + esc(it.b) + '\\b'), '（　　）');
  box.innerHTML = `<div class="q-ja">${it.ja}</div><div class="q-en">${shown}</div><div class="choices" id="choices"></div><div id="fb"></div>`;
  const wrap = $('choices');
  shuffle([it.b, ...it.d]).forEach(o => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = o;
    b.onclick = () => answerChoice(b, o, it);
    wrap.appendChild(b);
  });
}
function answerChoice(btn, o, it) {
  if (Q.answered) return;
  const ok = o === it.b;
  document.querySelectorAll('#choices .choice').forEach(c => {
    c.disabled = true;
    if (c.textContent === it.b) c.classList.add('right');
  });
  if (!ok) btn.classList.add('wrong');
  judge(ok, it);
}

function renderOrder(box, it) {
  box.innerHTML = `<div class="q-ja">${it.ja}</div><div class="slot" id="slot"></div><div class="bank" id="bank"></div>
    <div class="btn-row"><button id="btnUndo">↶ やりなおし</button><button class="primary" id="btnCheck">こたえる</button></div><div id="fb"></div>`;
  const toks = it.en.split(' ');
  Q.bank = shuffle(toks.map((t, k) => ({t, k})));
  if (toks.length > 1 && Q.bank.every((x, i) => x.k === i)) Q.bank.reverse();
  drawOrder();
  $('btnUndo').onclick = () => { if (Q.answered) return; Q.built = []; drawOrder(); };
  $('btnCheck').onclick = () => {
    if (Q.answered) return;
    const s = Q.built.map(bi => Q.bank[bi].t).join(' ');
    judge(s === it.en, it);
  };
}
function drawOrder() {
  const slot = $('slot'), bank = $('bank');
  slot.innerHTML = Q.built.length ? '' : '<span class="ph">ここにことばを並べよう</span>';
  Q.built.forEach((bi, pos) => {
    const b = mk(Q.bank[bi].t, 'chip chip on', () => { if (Q.answered) return; Q.built.splice(pos, 1); drawOrder(); });
    slot.appendChild(b);
  });
  bank.innerHTML = '';
  Q.bank.forEach((x, bi) => {
    if (Q.built.includes(bi)) return;
    bank.appendChild(mk(x.t, 'chip', () => { if (Q.answered) return; Q.built.push(bi); drawOrder(); }));
  });
}

function renderType(box, it) {
  box.innerHTML = `<div class="q-ja">${it.ja}</div>
    <input id="typeIn" class="typein" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="英語で入力してね">
    <div class="btn-row"><button id="btnHint">💡 ヒント</button><button class="primary" id="btnCheckType">こたえる</button></div>
    <div id="hintBox"></div><div id="fb"></div>`;
  $('btnHint').onclick = () => { $('hintBox').innerHTML = `<div class="hint">💡 ${it.h}</div>`; };
  // 英作文は、正解の英文のほかに「別解」も正解にする
  const answers = [it.en, ...(it.alt || [])];
  $('btnCheckType').onclick = () => {
    if (Q.answered) return;
    const v = norm($('typeIn').value);
    judge(answers.some(a => norm(a) === v), it);
  };
  setTimeout(() => { const i = $('typeIn'); if (i) i.focus(); }, 50);
}

function judge(ok, it) {
  if (Q.answered) return;
  Q.answered = true;
  if (ok) Q.c += 1; else Q.wrong.push(it.t);
  recordTag(it.t, ok);
  beep(ok);
  document.querySelectorAll('#qBox input').forEach(i => i.disabled = true);
  // 空らんを正しい文にして見せる
  const qen = document.querySelector('#qBox .q-en');
  if (qen) qen.innerHTML = it.en.replace(new RegExp('\\b' + esc(it.b) + '\\b'), m => `<mark>${m}</mark>`);
  const last = Q.i + 1 >= Q.list.length;
  const fb = document.createElement('div');
  fb.className = 'fb ' + (ok ? 'ok' : 'ng');
  fb.innerHTML = `<div class="fb-title">${ok ? '⭕ せいかい！' : '❌ おしい！'}</div>` +
    (ok ? '' : `<div>正解：<b class="ans">${it.en}</b></div>`) +
    `<div class="hint">💡 ${it.h}</div>`;
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('🔊 もういちど聞く', '', () => speak(it.en)));
  row.append(mk(last ? 'けっかを見る ▶' : 'つぎへ ▶', 'primary', nextQ));
  fb.append(row);
  const holder = $('fb');
  if (holder) holder.replaceWith(fb);
  speak(it.en);
}

function finishQuiz() {
  const n = Q.list.length, pct = Math.round(Q.c / n * 100), stars = starsFor(pct), ctx = Q.ctx;
  if (ctx.kind === 'stage') {
    const prev = lvBest(ctx.si, ctx.lv);
    P.stages[ctx.si] = P.stages[ctx.si] || {};
    P.stages[ctx.si][ctx.lv] = {stars: Math.max(prev.stars, stars), pct: Math.max(prev.pct, pct)};
  }
  if (ctx.kind === 'boss') {
    const prev = P.boss || {stars:0, pct:0};
    P.boss = {stars: Math.max(prev.stars, stars), pct: Math.max(prev.pct, pct)};
  }
  saveP();
  renderResult({pct, stars, c: Q.c, n, wrong: [...new Set(Q.wrong)], ctx});
  Q = null;
}

function renderResult(r) {
  const body = $('resultBody');
  body.innerHTML = '';
  const msg = r.pct >= 90 ? 'かんぺき！すばらしい！'
    : r.pct >= 75 ? 'よくできました！'
    : r.pct >= 60 ? 'クリア！まちがえた所をもう一度おぼえよう。'
    : 'だいじょうぶ。まちがいは伸びしろ。おぼえるで見なおして、もう一度チャレンジしよう！';
  body.append(card(`<div class="kicker">けっか｜${r.ctx.label}</div><div class="big">${starStr(r.stars)}</div>
    <p class="center"><b style="font-size:1.6rem">${r.pct}%</b><br>${r.c} / ${r.n} 問 正解</p><p class="center">${msg}</p>`));
  if (r.wrong.length) {
    const c = card('<h3>🔍 つまずいたところ（タップで おぼえるへ）</h3>');
    const wrap = document.createElement('div'); wrap.className = 'tagwrap';
    r.wrong.forEach(t => wrap.append(mk(t, 'tagbtn', () => openLearn(TAG_STAGE[t]))));
    c.append(wrap);
    body.append(c);
  } else {
    body.append(card('<h3>🎉 まちがいなし！</h3><p class="muted">このちょうしで次のステージへ！</p>'));
  }
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('🔁 もう一度', 'primary', () => retry(r.ctx)));
  if (r.ctx.kind === 'stage') {
    row.append(mk('📖 おぼえる', '', () => openLearn(r.ctx.si)));
    row.append(mk('🗺 ステージへ', '', () => openStage(r.ctx.si)));
  }
  row.append(mk('🏠 ホームへ', 'ghost', goHome));
  body.append(row);
  show('result');
}

// ---- キーボード（Enterで次へ・答え合わせ）----
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !Q || e.target.tagName === 'BUTTON') return;
  if (!$('scr-quiz').classList.contains('active')) return;
  const q = Q.list[Q.i];
  if (!q) return;
  if (Q.answered) nextQ();
  else if (q.type === 'type' && $('btnCheckType')) $('btnCheckType').click();
});

// ---- 初期化 ----
$('toMap').onclick = openMap;
$('quitBtn').onclick = () => { Q = null; goHome(); };
let resetArmed = 0;
$('resetBtn').onclick = () => {
  const b = $('resetBtn');
  if (Date.now() - resetArmed < 4000) {
    P = {stages: {}, tags: {}};
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
