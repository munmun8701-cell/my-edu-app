// --- 状態管理 ---
let currentProblem = { a: "?", b: "?" };
let valA = 0.0;
let valB = 0.0;
let mergedOnes = 0; 

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  renderNumberLine();
  updateAllVisuals();
});

// --- タブ切り替え ---
function switchVisual(tabId) {
  document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.visual-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(`vis-${tabId}`).classList.add('active');
}

// --- 問題セット ---
function setProblem(a, b) {
  currentProblem = { a, b };
  document.getElementById('problem-display').innerText = `${a} ＋ ${b}`;
  resetAll();
}

// --- 数値の操作 ---
function addVal(type, amount) {
  if (type === 'A') {
    valA = Math.round((valA + amount) * 10) / 10;
    if (valA < 0) valA = 0;
    if (valA > 2) valA = 2; // 最大2.0まで
  } else if (type === 'B') {
    valB = Math.round((valB + amount) * 10) / 10;
    if (valB < 0) valB = 0;
    if (valB > 2) valB = 2;
  }
  
  // ブロックを減らしたときに、まとめた「1」を崩す処理
  let total01s = Math.round((valA + valB) * 10);
  if (total01s < mergedOnes * 10) {
    mergedOnes = Math.floor(total01s / 10);
  }

  updateAllVisuals();
}

function resetAll() {
  valA = 0.0;
  valB = 0.0;
  mergedOnes = 0;
  updateAllVisuals();
}

// --- 全ビジュアルの同期更新 ---
function updateAllVisuals() {
  let total = Math.round((valA + valB) * 10) / 10;
  document.getElementById('total-val').innerText = total.toFixed(1);

  updateBeaker();
  updateLine(total);
  updateBlock();
}

// --- 1. リットルます（絶対配置） ---
function updateBeaker() {
  // ます1 (0L ~ 1L)
  let b1_a = Math.min(1.0, valA); // ます1に入る青
  let b1_b = Math.min(1.0 - b1_a, valB); // ます1に入るオレンジ（青の上）
  
  // %指定で絶対的な高さを適用
  document.getElementById('beak1-a').style.height = `${(b1_a / 1.0) * 100}%`;
  document.getElementById('beak1-b').style.bottom = `${(b1_a / 1.0) * 100}%`;
  document.getElementById('beak1-b').style.height = `${(b1_b / 1.0) * 100}%`;

  // ます2 (1L ~ 2L)
  let b2_a = Math.max(0, valA - 1.0); // 1Lから溢れた青
  let b2_b = Math.max(0, valB - b1_b); // 1Lから溢れたオレンジ
  
  document.getElementById('beak2-a').style.height = `${(b2_a / 1.0) * 100}%`;
  document.getElementById('beak2-b').style.bottom = `${(b2_a / 1.0) * 100}%`;
  document.getElementById('beak2-b').style.height = `${(b2_b / 1.0) * 100}%`;
}

// --- 2. 数直線 ---
function renderNumberLine() {
  const container = document.getElementById('num-line');
  for (let i = 0; i <= 20; i++) { 
    let tick = document.createElement('div');
    tick.className = `nl-tick ${i % 10 === 0 ? 'major' : (i % 5 === 0 ? 'minor' : 'minor')}`;
    tick.style.left = `${(i / 20) * 100}%`;
    if (i % 5 !== 0) tick.style.height = '6px';
    container.appendChild(tick);
    
    if (i % 10 === 0) {
      let label = document.createElement('div');
      label.className = 'nl-label'; label.innerText = i / 10;
      if (i === 10) { label.style.color = '#fa5252'; label.style.fontSize = '1.3rem'; label.style.top = '10px'; }
      label.style.left = `${(i / 20) * 100}%`;
      container.appendChild(label);
    }
  }
}

function updateLine(total) {
  const rangeA = document.getElementById('nl-range-a');
  rangeA.style.width = `${(valA / 2.0) * 100}%`;

  const rangeB = document.getElementById('nl-range-b');
  rangeB.style.left = `${(valA / 2.0) * 100}%`;
  rangeB.style.width = `${(valB / 2.0) * 100}%`;

  document.getElementById('jump-arrow').style.left = `${(total / 2.0) * 100}%`;
}

// --- 3. ブロック ---
function updateBlock() {
  const container = document.getElementById('block-area');
  container.innerHTML = '';
  
  if (valA === 0 && valB === 0) {
    container.innerHTML = '<span class="placeholder">上のボタンをおして、ブロックをだそう</span>';
    document.getElementById('merge-action').classList.add('hidden');
    return;
  }

  let blockQueue = [];
  for(let i=0; i<Math.round(valA*10); i++) blockQueue.push('a-color');
  for(let i=0; i<Math.round(valB*10); i++) blockQueue.push('b-color');

  let total01s = blockQueue.length;
  for (let i = 0; i < mergedOnes; i++) {
    let b = document.createElement('div'); b.className = 'b-1'; b.innerText = '1'; container.appendChild(b);
    blockQueue.splice(0, 10);
  }
  
  blockQueue.forEach(colorClass => {
    let b = document.createElement('div'); b.className = `b-01 ${colorClass}`; container.appendChild(b);
  });

  if (blockQueue.length >= 10) {
    document.getElementById('merge-action').classList.remove('hidden');
  } else {
    document.getElementById('merge-action').classList.add('hidden');
  }
}

function mergeBlocks() {
  mergedOnes++;
  updateBlock();
}

// --- ヒント機能 ---
function showHint(tool) {
  let text = "";
  let a = currentProblem.a === "?" ? "最初の数" : currentProblem.a;
  let b = currentProblem.b === "?" ? "次の数" : currentProblem.b;

  if (tool === 'beaker') {
    text = `まずは【🟦青】の水で「${a} L」まで入れよう。次に、【🟧オレンジ】の水を「${b} L」分追加すると、水は1Lの線をこえるかな？`;
  } else if (tool === 'line') {
    text = `まずは【🟦青】のボタンをおして「${a}」まで進もう。そのあと、【🟧オレンジ】のボタンをおして「${b}」分進むと、矢印はどこに着くかな？`;
  } else if (tool === 'block') {
    text = `【🟦青】のブロックを ${a*10}こ だして、次に【🟧オレンジ】のブロックを ${b*10}こ だしてみよう。全部で10こ集まったら「まとめる」をおしてみてね。`;
  }
  
  document.getElementById('hint-text').innerText = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }