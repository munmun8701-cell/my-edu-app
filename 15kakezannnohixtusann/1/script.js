// --- 状態管理 ---
let currentId = 1;
let probData = {
  1: { base: 5, m1: 3, m2: 10, totalM: 30, hasStory: true },
  2: { base: 12, m1: 3, m2: 10, totalM: 30, hasStory: false }
};

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputHandlers();
  setProblem(1);
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
function setProblem(id) {
  currentId = id;
  const data = probData[id];
  
  // UI更新
  document.querySelectorAll('.mission-bar .btn-outline').forEach(b => b.classList.remove('active-prob'));
  document.getElementById(`prob1-btn`).classList.toggle('active-prob', id === 1);
  document.getElementById(`prob2-btn`).classList.toggle('active-prob', id === 2);

  const wpArea = document.getElementById('word-problem-area');
  if (data.hasStory) {
    wpArea.style.display = 'block';
    document.getElementById('wp-base').innerText = data.base;
    document.getElementById('wp-total').innerText = data.totalM;
  } else {
    wpArea.style.display = 'none';
  }
  document.getElementById('math-equation').innerText = `${data.base} × ${data.totalM}`;

  // 1. 数直線のリセット
  renderNumberLineMarks();
  extendTo(0); // 初期状態は0

  // 2. アレイ図のリセット
  document.getElementById('array-stage').innerHTML = '';
  document.getElementById('array-base-num').innerText = data.base;
  document.getElementById('array-m1-num').innerText = data.m1;
  document.getElementById('btn-step1').disabled = false;
  document.getElementById('btn-step2').disabled = true;
  document.getElementById('array-msg').innerText = "どうすれば、今までに学習した計算を使えるかな。左のボタンをおしてみよう！";

  // 3. 式と関係図のリセット
  document.getElementById('char-base-1').innerText = data.base;
  document.getElementById('f-base1').innerText = data.base;
  document.getElementById('f-total-m').innerText = data.totalM;
  document.getElementById('f-base2').innerText = data.base;
  document.getElementById('f-m1').innerText = data.m1;
  document.getElementById('f-base3').innerText = data.base;
  document.getElementById('f-m1-2').innerText = data.m1;
  
  const f1 = document.getElementById('f-ans1'); const f2 = document.getElementById('f-ans2');
  f1.value = ''; f2.value = '';
  f1.classList.remove('correct'); f2.classList.remove('correct');
  
  document.getElementById('rel-base').innerText = data.base;
  document.getElementById('rel-m1-label').innerText = `×${data.m1}`;
  document.getElementById('rel-total-label').innerText = `×${data.totalM}`;
  
  const relMid = document.getElementById('rel-mid');
  const relFin = document.getElementById('rel-final');
  relMid.innerText = data.base * data.m1; relMid.className = 'fixed-num val-hidden';
  relFin.innerText = data.base * data.totalM; relFin.className = 'fixed-num val-hidden';
  
  document.getElementById('formula-feedback').innerText = '';
  document.getElementById('summary-box').classList.remove('visible');

  // まとめ枠
  document.getElementById('sum-b1').innerText = data.base;
  document.getElementById('sum-t1').innerText = data.totalM;
  document.getElementById('sum-b2').innerText = data.base;
  document.getElementById('sum-m1').innerText = data.m1;
  document.getElementById('sum-b3').innerText = data.base;
  document.getElementById('sum-m2').innerText = data.m1;
  document.getElementById('sum-a1').innerText = data.base * data.m1;
  document.getElementById('sum-a2').innerText = data.base * data.m1;
  document.getElementById('sum-a3').innerText = data.base * data.totalM;
  document.getElementById('sum-b4').innerText = data.base;
  document.getElementById('sum-m3').innerText = data.m1;
}

// --- 1. 二重数直線の処理（リニューアル） ---
function renderNumberLineMarks() {
  const data = probData[currentId];
  const topContainer = document.getElementById('dnl-ticks-top');
  const bottomContainer = document.getElementById('dnl-ticks-bottom');
  topContainer.innerHTML = '';
  bottomContainer.innerHTML = '';

  const steps = [0, 1, 10, 20, 30];

  steps.forEach(step => {
    const percent = (step / 30) * 100;
    
    // 下の目盛り（いすの数）
    const bTick = document.createElement('div');
    bTick.className = 'dnl-tick';
    bTick.style.left = `${percent}%`;
    const bLabel = document.createElement('span');
    bLabel.className = 'dnl-label label-bottom';
    
    // 0と1が被らないよう、0の位置を少し左にずらす処理
    if(step === 0) bLabel.style.marginLeft = "-5px";
    if(step === 1) bLabel.style.marginLeft = "5px";
    bLabel.innerText = step;
    
    bTick.appendChild(bLabel);
    bottomContainer.appendChild(bTick);

    // 上の目盛り（人数）
    const tTick = document.createElement('div');
    tTick.className = 'dnl-tick';
    tTick.style.left = `${percent}%`;
    
    if (step === 30) {
      // 30の場所だけ入力欄
      const tInput = document.createElement('input');
      tInput.type = 'text';
      tInput.id = 'dnl-ans';
      tInput.className = 'num-input small-input';
      tInput.placeholder = '？';
      tInput.oninput = checkDnl;
      tTick.appendChild(tInput);
    } else {
      const tLabel = document.createElement('span');
      tLabel.className = 'dnl-label label-top';
      if(step === 0) tLabel.style.marginLeft = "-5px";
      if(step === 1) tLabel.style.marginLeft = "5px";
      tLabel.innerText = step * data.base;
      tTick.appendChild(tLabel);
    }
    topContainer.appendChild(tTick);
  });
}

function extendTo(step) {
  const data = probData[currentId];
  const percent = (step / 30) * 100;
  
  // バーを伸ばす
  document.getElementById('dnl-fill-top').style.width = `${percent}%`;
  document.getElementById('dnl-fill-bottom').style.width = `${percent}%`;

  // ボタンの見た目更新
  document.querySelectorAll('.btn-step').forEach(btn => btn.classList.remove('active-step'));
  if (step > 0) {
    document.getElementById(`btn-nl-${step}`).classList.add('active-step');
  }

  // メッセージの更新
  const msg = document.getElementById('line-msg');
  if (step === 0) msg.innerText = `まずは「1こ」のときの人数をたしかめよう。`;
  if (step === 1) msg.innerText = `いすが1こで、${data.base}人すわれるね。`;
  if (step === 10) msg.innerText = `いすが10こだと、${data.base * 10}人！「10倍」になったね。`;
  if (step === 20) msg.innerText = `いすが20こだと、${data.base * 20}人！`;
  if (step === 30) {
    msg.innerText = `いすが30こ！ ぜんぶで何人になるかな？ 右の四角に入力してみよう！`;
    setTimeout(() => document.getElementById('dnl-ans').focus(), 600);
  }
  
  // 正誤メッセージのリセット
  if(step !== 30) document.getElementById('dnl-feedback').innerText = "";
}

function checkDnl() {
  const data = probData[currentId];
  const input = document.getElementById('dnl-ans');
  const ans = data.base * data.totalM;
  
  if (parseInt(input.value) === ans) {
    input.classList.add('correct');
    document.getElementById('dnl-feedback').innerText = "✨ 大正解！ いすの数が増えると、人数も同じように増えていくね！";
    // バーを確実に100%にする
    document.getElementById('dnl-fill-top').style.width = `100%`;
    document.getElementById('dnl-fill-bottom').style.width = `100%`;
  } else {
    input.classList.remove('correct');
    document.getElementById('dnl-feedback').innerText = "";
  }
}

// --- 2. アレイ図の処理 ---
function showArrayStep1() {
  const data = probData[currentId];
  const stage = document.getElementById('array-stage');
  stage.innerHTML = ''; 
  stage.appendChild(createDotGroup(data.base, data.m1));
  document.getElementById('btn-step1').disabled = true;
  document.getElementById('btn-step2').disabled = false;
  document.getElementById('array-msg').innerText = `「${data.base} × ${data.m1}」のまとまりを作ったよ！これを10こ分にしよう。`;
}

function showArrayStep2() {
  const data = probData[currentId];
  const stage = document.getElementById('array-stage');
  stage.innerHTML = ''; 
  for (let i = 0; i < 10; i++) stage.appendChild(createDotGroup(data.base, data.m1));
  document.getElementById('btn-step2').disabled = true;
  document.getElementById('array-msg').innerText = `「${data.base} × ${data.m1}」が 10こ分になったね！（×10の計算）`;
}

function createDotGroup(rows, cols) {
  const group = document.createElement('div');
  group.className = 'dot-group';
  group.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  group.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let i = 0; i < rows * cols; i++) {
    const dot = document.createElement('div'); dot.className = 'dot'; group.appendChild(dot);
  }
  return group;
}

// --- 3. 式と関係図のチェック ---
function checkFormula() {
  const data = probData[currentId];
  const f1 = document.getElementById('f-ans1');
  const f2 = document.getElementById('f-ans2');
  const ans1 = data.base * data.m1;
  const ans2 = ans1 * 10;

  let is1Ok = parseInt(f1.value) === ans1;
  let is2Ok = parseInt(f2.value) === ans2;

  if (is1Ok) {
    f1.classList.add('correct');
    document.getElementById('rel-mid').classList.add('val-revealed');
  } else {
    f1.classList.remove('correct');
  }

  if (is2Ok && is1Ok) {
    f2.classList.add('correct');
    document.getElementById('rel-final').classList.add('val-revealed');
    document.getElementById('formula-feedback').innerText = "✨ 大正解！ かけ算のきまりを使うと、かんたんに計算できるね。";
    document.getElementById('summary-box').classList.add('visible'); 
  } else {
    f2.classList.remove('correct');
  }
}

// --- ヒント機能 ---
function showHint(tool) {
  const data = probData[currentId];
  let text = "";
  if (tool === 'line') {
    text = `上のボタンを順番におしてみよう。<br>「いす10こ」のボタンをおすと、人数は「${data.base * 10}人」になるね。<br>そのまま「いす30こ」まで伸ばすと、どうなるかな？`;
  } else if (tool === 'array') {
    text = `まずは「${data.base} × ${data.m1}」のボタンをおして、1つ分のまとまりを作ろう。<br>そのあと、右のボタンでそれを10倍（10こ分）にしてみよう！`;
  } else if (tool === 'diagram') {
    text = `「${data.base} × ${data.totalM}」は、「${data.base} × ${data.m1} × 10」と同じことだよ。<br>上の四角には「${data.base} × ${data.m1}」の答えを入れよう。<br>下の四角には、それに「×10（うしろに0をつける）」をした答えを入れよう。`;
  }
  document.getElementById('hint-text').innerHTML = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }