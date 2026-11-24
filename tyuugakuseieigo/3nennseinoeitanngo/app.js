// 中3の単語：アプリの動作（通信なし・きろくは端末内のlocalStorageのみ）
const $ = id => document.getElementById(id);
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => s.toLowerCase().replace(/[.,!?'’"]/g, '').replace(/\s+/g, ' ').trim();
const starsFor = p => p >= 90 ? 3 : p >= 75 ? 2 : p >= 60 ? 1 : 0;
const starStr = n => '★'.repeat(n) + '☆'.repeat(3 - n);
const LVS = [1, 2, 3, 4];
const LVN = {1:'★1 日本語→英語（3択）', 2:'★2 英語→日本語（3択）', 3:'★3 聞いて選ぶ（3択）', 4:'★4 英語を書く（入力）'};

const ALLW = STAGES.flatMap((s, si) => s.words.map(w => ({...w, si, stage: s.name})));

// ---- きろく（端末内のみ）----
const KEY = 'munmun-eigo-vocab-g3-v1';
let P;
try { P = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { P = {}; }
P.st = P.st || {};
P.tags = P.tags || {};
function saveP() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }
function stBest(si, lv) { return (P.st[si] && P.st[si][lv]) || {stars:0, pct:0}; }
function stageStars(si) { return Math.max(...LVS.map(lv => stBest(si, lv).stars)); }
function totalStars() { let t = 0; STAGES.forEach((_, si) => LVS.forEach(lv => { t += stBest(si, lv).stars; })); return t; }
function recordTag(tag, ok) { const r = P.tags[tag] || {c:0, t:0}; r.t += 1; if (ok) r.c += 1; P.tags[tag] = r; saveP(); }

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
  u.lang = 'en-US'; u.rate = 0.85;
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
  let lastG = '';
  STAGES.forEach((s, si) => {
    if (s.g !== lastG) {
      lastG = s.g;
      const h = document.createElement('h3');
      h.className = 'grp';
      h.textContent = s.g;
      list.appendChild(h);
    }
    const bs = stageStars(si);
    list.appendChild(mk(`<span class="num">${si + 1}</span><span class="info"><b>${s.name}</b><small><span class="stars">${starStr(bs)}</span>　${s.words.length}語</small></span>`,
      'stage-card' + (bs === 3 ? ' perfect' : ''), () => openStage(si)));
  });
}

// ---- 単元（おぼえる・レベル選択）----
function openStage(si) {
  const s = STAGES[si];
  const body = $('stageBody');
  body.innerHTML = '';
  body.append(mk('← ホーム', 'back', goHome));
  body.append(card(`<div class="kicker">単元 ${si + 1}</div><h2>${s.name}</h2><p class="muted">まずは「おぼえる」で単語を確認してから、れんしゅうをしよう。</p>`));
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('📖 おぼえる', 'primary', () => openLearn(si)));
  body.append(row);
  body.append(card('<h3>れんしゅうをえらぶ</h3>'));
  LVS.forEach(lv => {
    const r = stBest(si, lv);
    body.append(mk(`<span class="num">${lv}</span><span class="info"><b>${LVN[lv]}</b><small><span class="stars">${starStr(r.stars)}</span>　${r.pct ? 'ベスト ' + r.pct + '%' : 'まだ挑戦していません'}</small></span>`,
      'stage-card', () => startLevel(si, lv)));
  });
  show('stage');
}

// ---- おぼえる ----
function openLearn(si) {
  const s = STAGES[si];
  const body = $('learnBody');
  body.innerHTML = '';
  body.append(mk('← 単元へ', 'back', () => openStage(si)));
  body.append(card(`<div class="kicker">おぼえる｜単元 ${si + 1}</div><h2>${s.name}</h2><p class="muted">🔊 を押すと英語の発音を聞けます。</p>`));
  const box = card('');
  s.words.forEach(w => {
    const row = document.createElement('div'); row.className = 'ex';
    row.innerHTML = `<div class="ex-ja">${w.ja}</div><div class="ex-en">${w.en}</div><div class="muted">${w.ex}</div>`;
    row.append(mk('🔊', '', () => speak(w.en)));
    box.append(row);
  });
  body.append(box);
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('✏️ れんしゅうへ', 'primary', () => openStage(si)));
  body.append(row);
  show('learn');
}

// ---- 苦手マップ（単元ごとの正答率）----
function openMap() {
  const body = $('mapBody');
  body.innerHTML = '';
  body.append(mk('← ホーム', 'back', goHome));
  const rows = STAGES.map((s, si) => ({si, name: s.name, r: P.tags[s.name]}))
    .filter(x => x.r && x.r.t > 0)
    .map(x => ({...x, pct: Math.round(x.r.c / x.r.t * 100)}))
    .sort((a, b) => a.pct - b.pct);
  body.append(card(`<div class="kicker">苦手マップ</div><h2>単元ごとの正答率</h2>
    <p class="muted">赤は苦手、黄色はもう少し、緑は得意です。苦手な単元は「おぼえる」で見直しましょう。</p>` +
    (rows.length ? '' : '<p class="muted">まだデータがありません。単元のれんしゅうをしてみよう！</p>')));
  rows.forEach(x => {
    const cls = x.pct < 60 ? 'lo' : x.pct < 80 ? 'mid' : '';
    const c = card(`<div class="tagrow"><b>${x.name}</b><span>${x.pct}%</span></div>
      <div class="bar"><span class="${cls}" style="width:${x.pct}%"></span></div>
      <div class="tagrow"><small class="muted">${x.r.c}/${x.r.t}問</small></div>`);
    c.append(mk('📖 この単元を見直す', '', () => openLearn(x.si)));
    body.append(c);
  });
  show('map');
}

// ---- クイズ ----
let Q = null;
function startLevel(si, lv) {
  const s = STAGES[si];
  const list = shuffle(s.words.map(w => ({...w, si, stage: s.name})));
  Q = {ctx:{si, lv, label:`${s.name}｜${LVN[lv]}`}, label:`${s.name}｜${LVN[lv]}`, list, i:0, c:0, wrong:[], answered:false};
  show('quiz');
  renderQ();
}
function nextQ() { if (!Q) return; Q.i++; renderQ(); }

// 同じ項目（英語 or 日本語）の、まちがいの選択肢を2つ選ぶ
function distract(w, key) {
  const vals = [];
  shuffle(ALLW.filter(x => x[key] !== w[key])).forEach(x => {
    if (vals.length < 2 && !vals.includes(x[key])) vals.push(x[key]);
  });
  return vals;
}

function renderQ() {
  if (Q.i >= Q.list.length) return finishQuiz();
  const w = Q.list[Q.i], lv = Q.ctx.lv;
  Q.answered = false;
  $('qLabel').textContent = Q.label;
  $('qCount').textContent = `${Q.i + 1} / ${Q.list.length}`;
  $('qProg').style.width = (Q.i / Q.list.length * 100) + '%';
  const box = $('qBox');
  box.innerHTML = '';

  if (lv === 4) {
    box.innerHTML = `<div class="q-ja-big">「${w.ja}」を英語で書こう</div>
      <input id="typeIn" class="typein" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="英語で入力してね">
      <div class="btn-row"><button id="btnHint">💡 ヒント</button><button class="primary" id="btnCheckType">こたえる</button></div>
      <div id="hintBox"></div><div id="fb"></div>`;
    $('btnHint').onclick = () => { $('hintBox').innerHTML = `<div class="hint">💡 最初の文字は「${w.en[0]}」、全部で${w.en.length}文字（スペースを含む）</div>`; };
    $('btnCheckType').onclick = () => { if (!Q.answered) judge(norm($('typeIn').value) === norm(w.en), w.en, w); };
    setTimeout(() => { const i = $('typeIn'); if (i) i.focus(); }, 50);
    return;
  }

  let question, choices, correct;
  if (lv === 1) {
    box.innerHTML = `<div class="q-ja-big">「${w.ja}」は英語で？</div>`;
    correct = w.en; choices = shuffle([w.en, ...distract(w, 'en')]);
  } else if (lv === 2) {
    box.innerHTML = `<div class="q-word">${w.en}</div><div class="q-ja-big">この英語の意味は？</div>`;
    correct = w.ja; choices = shuffle([w.ja, ...distract(w, 'ja')]);
  } else {
    box.innerHTML = `<div class="center-btn"><button class="primary" id="btnSpeak">🔊 もう一度聞く</button></div><div class="q-ja-big">聞こえた英語の意味は？</div>`;
    $('btnSpeak').onclick = () => speak(w.en);
    setTimeout(() => speak(w.en), 200);
    correct = w.ja; choices = shuffle([w.ja, ...distract(w, 'ja')]);
  }
  const wrap = document.createElement('div');
  wrap.className = 'choices col1'; wrap.id = 'choices';
  box.append(wrap);
  const fb = document.createElement('div'); fb.id = 'fb'; box.append(fb);
  choices.forEach(o => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = o;
    b.onclick = () => answerChoice(b, o, correct, w);
    wrap.appendChild(b);
  });
}

function answerChoice(btn, o, correct, w) {
  if (Q.answered) return;
  const ok = o === correct;
  document.querySelectorAll('#choices .choice').forEach(c => {
    c.disabled = true;
    if (c.textContent === correct) c.classList.add('right');
  });
  if (!ok) btn.classList.add('wrong');
  judge(ok, correct, w);
}

function judge(ok, correctText, w) {
  if (Q.answered) return;
  Q.answered = true;
  if (ok) Q.c += 1; else Q.wrong.push(w.en);
  recordTag(w.stage, ok);
  beep(ok);
  document.querySelectorAll('#qBox input').forEach(i => i.disabled = true);
  const last = Q.i + 1 >= Q.list.length;
  const fb = document.createElement('div');
  fb.className = 'fb ' + (ok ? 'ok' : 'ng');
  fb.innerHTML = `<div class="fb-title">${ok ? '⭕ せいかい！' : '❌ おしい！'}</div>` +
    (ok ? '' : `<div>正解：<b class="ans">${correctText}</b></div>`) +
    `<div class="hint">📝 ${w.en} ＝ ${w.ja}<br>例文：${w.ex}</div>`;
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('🔊 もういちど聞く', '', () => speak(w.en)));
  row.append(mk(last ? 'けっかを見る ▶' : 'つぎへ ▶', 'primary', nextQ));
  fb.append(row);
  const holder = $('fb');
  if (holder) holder.replaceWith(fb);
  speak(w.en);
}

function finishQuiz() {
  const n = Q.list.length, pct = Math.round(Q.c / n * 100), stars = starsFor(pct), ctx = Q.ctx;
  const prev = stBest(ctx.si, ctx.lv);
  P.st[ctx.si] = P.st[ctx.si] || {};
  P.st[ctx.si][ctx.lv] = {stars: Math.max(prev.stars, stars), pct: Math.max(prev.pct, pct)};
  saveP();
  renderResult({pct, stars, c: Q.c, n, wrong: [...new Set(Q.wrong)], ctx});
  Q = null;
}

function renderResult(r) {
  const body = $('resultBody');
  body.innerHTML = '';
  const msg = r.pct >= 90 ? 'かんぺき！単語をしっかりおぼえています。'
    : r.pct >= 75 ? 'よくできました！'
    : r.pct >= 60 ? 'クリア！まちがえた単語をもう一度見直そう。'
    : 'だいじょうぶ。おぼえるで単語と発音を確かめてから、もう一度チャレンジしよう！';
  body.append(card(`<div class="kicker">けっか｜${r.ctx.label}</div><div class="big">${starStr(r.stars)}</div>
    <p class="center"><b style="font-size:1.6rem">${r.pct}%</b><br>${r.c} / ${r.n} 問 正解</p><p class="center">${msg}</p>`));
  if (r.wrong.length) {
    const c = card('<h3>🔍 まちがえた単語</h3>');
    const wrap = document.createElement('div'); wrap.className = 'tagwrap';
    r.wrong.forEach(en => {
      const w = ALLW.find(x => x.en === en);
      wrap.append(mk(`${w.en}（${w.ja}）`, 'tagbtn', () => speak(w.en)));
    });
    c.append(wrap);
    c.append(mk('📖 単元のおぼえるへ', 'primary', () => openLearn(r.ctx.si)));
    body.append(c);
  } else {
    body.append(card('<h3>🎉 まちがいなし！</h3><p class="muted">次のれんしゅうにチャレンジしよう！</p>'));
  }
  const row = document.createElement('div'); row.className = 'btn-row';
  row.append(mk('🔁 もう一度', 'primary', () => startLevel(r.ctx.si, r.ctx.lv)));
  if (r.ctx.lv < 4) row.append(mk('▶ つぎのレベル', '', () => startLevel(r.ctx.si, r.ctx.lv + 1)));
  row.append(mk('🗺 単元へ', '', () => openStage(r.ctx.si)));
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
    P = {st: {}, tags: {}};
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
