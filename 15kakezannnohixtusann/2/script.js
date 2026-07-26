// --- 状態管理 ---
let current = { id: 1, base: 3, m1: 2, m10: 20, ans1: 6, ans10: 60 };

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputHandlers();
  setProblem(1, 3, 20);
});

// --- タブ切り替え ---
function switchVisual(tabId) {
  document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.visual-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(`vis-${tabId}`).classList.add('active');
}

// --- 全角→半角変換 ---
function toHalfWidthNum(str) {
  let half = str.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  return half.replace(/[^0-9]/g, '');
}
function setupInputHandlers() {
  document.querySelectorAll('.num-input').forEach(input => {
    input.addEventListener('input', (e) => { e.target.value = toHalfWidthNum(e.target.value); });
  });
}

// --- 問題セット ---
function setProblem(id, base, m10) {
  current = { 
    id: id, 
    base: base, 
    m1: m10 / 10, 
    m10: m10, 
    ans1: base * (m10 / 10), 
    ans10: base * m10 
  };
  
  // UIボタンのアクティブ切り替え
  document.querySelectorAll('.prob-grid .btn-outline').forEach(b => b.classList.remove('active-prob'));
  document.getElementById(`pbtn-${id}`).classList.add('active-prob');
  document.getElementById('current-prob-text').innerText = `${base} × ${m10}`;

  // 1. くらべっこ（リセット）
  document.getElementById('comp-base1').innerText = current.base;
  document.getElementById('comp-m1').innerText = current.m1;
  document.getElementById('comp-base2').innerText = current.base;
  document.getElementById('comp-m10').innerText = current.m10;
  
  const c1 = document.getElementById('comp-ans1'); const c10 = document.getElementById('comp-ans10');
  c1.value = ''; c10.value = '';
  c1.classList.remove('correct'); c10.classList.remove('correct');
  
  document.getElementById('ans-arrow').classList.remove('revealed');
  document.getElementById('ans-text').classList.remove('revealed');
  document.getElementById('compare-feedback').innerText = '';
  document.getElementById('summary-box').classList.remove('visible');

  // 2. 式のへんけい（リセット）
  document.getElementById('f-base1').innerText = current.base;
  document.getElementById('f-m10').innerText = current.m10;
  document.getElementById('f-base2').innerText = current.base;
  document.getElementById('f-m1').innerText = current.m1;
  document.getElementById('f-base3').innerText = current.base;
  document.getElementById('f-m1-2').innerText = current.m1;

  const f1 = document.getElementById('f-ans1'); const f10 = document.getElementById('f-ans10');
  f1.value = ''; f10.value = '';
  f1.classList.remove('correct'); f10.classList.remove('correct');
  document.getElementById('formula-feedback').innerText = '';

  // 3. 位取り表（リセット）
  document.getElementById('pv-base-eq').innerText = `${current.base} × ${current.m1}`;
  document.getElementById('btn-pv-base').disabled = false;
  document.getElementById('btn-pv-shift').disabled = true;
  document.getElementById('pv-msg').innerText = "上のボタンをおしてみよう！";
  
  // 数字とアニメーションの初期化
  ['1000', '100', '10', '1'].forEach(place => {
    let el = document.getElementById(`dig-${place}`);
    el.innerText = '';
    el.classList.add('hidden');
    el.classList.remove('shift-left');
  });
  document.getElementById('zero-drop').classList.add('hidden');
}

// --- 1. くらべっこの判定 ---
function checkCompare() {
  const c1 = document.getElementById('comp-ans1');
  const c10 = document.getElementById('comp-ans10');

  let is1Ok = parseInt(c1.value) === current.ans1;
  let is10Ok = parseInt(c10.value) === current.ans10;

  if (is1Ok) c1.classList.add('correct'); else c1.classList.remove('correct');
  
  if (is1Ok && is10Ok) {
    c10.classList.add('correct');
    document.getElementById('ans-arrow').classList.add('revealed');
    document.getElementById('ans-text').classList.add('revealed');
    document.getElementById('compare-feedback').innerText = "✨ 大正解！ かける数が10倍になると、答えも10倍になっているね。";
    document.getElementById('summary-box').classList.add('visible');
  } else {
    c10.classList.remove('correct');
    document.getElementById('ans-arrow').classList.remove('revealed');
    document.getElementById('ans-text').classList.remove('revealed');
    document.getElementById('summary-box').classList.remove('visible');
  }
}

// --- 2. 式のへんけいの判定 ---
function checkFormula() {
  const f1 = document.getElementById('f-ans1');
  const f10 = document.getElementById('f-ans10');

  let is1Ok = parseInt(f1.value) === current.ans1;
  let is10Ok = parseInt(f10.value) === current.ans10;

  if (is1Ok) f1.classList.add('correct'); else f1.classList.remove('correct');
  
  if (is1Ok && is10Ok) {
    f10.classList.add('correct');
    document.getElementById('formula-feedback').innerText = "✨ バッチリ！ 「0をとって計算し、あとから0を1つつける」理由がこれだね！";
  } else {
    f10.classList.remove('correct');
    document.getElementById('formula-feedback').innerText = "";
  }
}

// --- 3. 位取り表のアニメーション ---
function showPvBase() {
  const ansStr = current.ans1.toString();
  
  // 桁ごとに数字を配置 (1の位から順に)
  if (ansStr.length >= 1) setupDigit('1', ansStr.slice(-1));
  if (ansStr.length >= 2) setupDigit('10', ansStr.slice(-2, -1));
  if (ansStr.length >= 3) setupDigit('100', ansStr.slice(-3, -2));

  document.getElementById('btn-pv-base').disabled = true;
  document.getElementById('btn-pv-shift').disabled = false;
  document.getElementById('pv-msg').innerText = `「${current.base} × ${current.m1} ＝ ${current.ans1}」が位取り表に入ったよ。`;
}

function setupDigit(place, val) {
  const el = document.getElementById(`dig-${place}`);
  el.innerText = val;
  el.classList.remove('hidden');
}

function shiftPv() {
  // 表示されている全ての数字に左シフトのCSSを適用
  ['1000', '100', '10', '1'].forEach(place => {
    const el = document.getElementById(`dig-${place}`);
    if (!el.classList.contains('hidden')) {
      el.classList.add('shift-left');
    }
  });

  // 少し遅れて一の位に「0」を落下させる
  setTimeout(() => {
    document.getElementById('zero-drop').classList.remove('hidden');
    document.getElementById('pv-msg').innerText = `10倍すると、すべての位が1つ上がり、一の位に「0」が入って「${current.ans10}」になるね！`;
  }, 600);

  document.getElementById('btn-pv-shift').disabled = true;
}

// --- ヒント機能 ---
function showHint(tool) {
  let text = "";
  if (tool === 'compare') {
    text = `まずは上の四角に「${current.base} × ${current.m1}」の答え（${current.ans1}）を入れよう。<br>下の四角には、その答えを「10倍（うしろに0を1つつける）」した数が入るよ！`;
  } else if (tool === 'formula') {
    text = `「${current.base} × ${current.m10}」は、「${current.base} × ${current.m1} × 10」に分けられるよ。<br>先に「${current.base} × ${current.m1}」を計算して上の四角に入れよう。そのあと、10をかけた答えを下の四角に入れよう。`;
  } else if (tool === 'placevalue') {
    text = `「×10」をすると、数字はどうなるかな？<br>まずはボタンをおして「${current.base} × ${current.m1}」の答えを出そう。<br>次に「×10」のボタンをおすと、数字の「くらい（場所）」が左に動くのを観察しよう！`;
  }
  document.getElementById('hint-text').innerHTML = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }