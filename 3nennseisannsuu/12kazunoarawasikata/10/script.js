// --- 状態管理 ---
let targetVal = 2.8;
let maxLineVal = 4; // 数直線の最大値

// 数直線の状態
let linePos = 0.0;
let jumpHistory = []; 

// ブロックの状態
let blockOnes = 0;
let blockTenths = 0;

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputFilters();
  setTarget(2.8);
});

// --- タブ切り替え ---
function switchVisual(tabId) {
  document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.visual-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(`vis-${tabId}`).classList.add('active');
}

// --- 入力制御（全角→半角） ---
function setupInputFilters() {
  document.querySelectorAll('.num-in').forEach(input => {
    input.addEventListener('input', (e) => {
      let val = e.target.value;
      val = val.replace(/[０-９．]/g, s => s === '．' ? '.' : String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
      e.target.value = val;
    });
  });
}

function clearWords() {
  document.querySelectorAll('.num-in').forEach(el => el.value = '');
}

// --- 問題（目標値）のセット ---
function setTarget(val) {
  targetVal = val;
  maxLineVal = val > 4 ? 6 : 4; // 4.9の場合は数直線を長くする
  
  document.getElementById('target-display').innerText = val.toFixed(1);
  document.querySelectorAll('.target-span').forEach(el => el.innerText = val.toFixed(1));
  
  resetLine();
  resetBlock();
  clearWords();
  renderNumberLine();
}

function checkGoal(current) {
  if (Math.round(current * 10) === Math.round(targetVal * 10)) {
    setTimeout(() => alert(`🎉 ピッタリ！ ${targetVal} になったね！\nこの「作り方（見方）」を見方メーカーやノートにメモしよう！`), 100);
  }
}

// --- 1. 数直線シミュレーター ---
function renderNumberLine() {
  const container = document.getElementById('num-line');
  container.innerHTML = '';
  
  let steps = maxLineVal * 10;
  for (let i = 0; i <= steps; i++) {
    let tick = document.createElement('div');
    tick.className = `nl-tick ${i % 10 === 0 ? 'major' : (i % 5 === 0 ? 'minor' : 'minor')}`;
    tick.style.left = `${(i / steps) * 100}%`;
    if (i % 5 !== 0) tick.style.height = '6px';
    container.appendChild(tick);
    
    if (i % 10 === 0) {
      let label = document.createElement('div');
      label.className = 'nl-label'; label.innerText = i / 10;
      label.style.left = `${(i / steps) * 100}%`;
      container.appendChild(label);
    }
  }

  // ゴールの旗
  let flag = document.createElement('div');
  flag.className = 'goal-flag';
  flag.innerText = '🏁';
  flag.style.left = `${(targetVal / maxLineVal) * 100}%`;
  container.appendChild(flag);
}

function jumpLine(amount) {
  let start = linePos;
  let end = Math.round((linePos + amount) * 10) / 10;
  
  if (end < 0) end = 0;
  if (end > maxLineVal) end = maxLineVal;
  
  if (start !== end) {
    jumpHistory.push({ start: start, end: end, val: amount });
    linePos = end;
    updateLineUI();
    checkGoal(linePos);
  }
}

function resetLine() {
  linePos = 0.0;
  jumpHistory = [];
  updateLineUI();
}

function updateLineUI() {
  document.getElementById('line-val').innerText = linePos.toFixed(1);
  
  // 既存の軌跡と矢印を削除
  document.querySelectorAll('.jump-path, .current-arrow').forEach(el => el.remove());
  const container = document.getElementById('num-line');
  
  // 軌跡の描画
  jumpHistory.forEach((jump, index) => {
    let path = document.createElement('div');
    path.className = `jump-path ${jump.val > 0 ? 'plus' : 'minus'}`;
    
    let leftPercent = Math.min(jump.start, jump.end) / maxLineVal * 100;
    let widthPercent = Math.abs(jump.end - jump.start) / maxLineVal * 100;
    
    path.style.left = `${leftPercent}%`;
    path.style.width = `${widthPercent}%`;
    
    // 重なりを防ぐために高さを変える
    let h = 30 + (index % 4) * 20; 
    path.style.height = `${h}px`;
    path.style.bottom = '4px';

    let valLabel = document.createElement('div');
    valLabel.className = 'jump-val';
    valLabel.innerText = jump.val > 0 ? `+${jump.val}` : jump.val;
    valLabel.style.color = jump.val > 0 ? 'var(--primary)' : 'var(--danger)';
    path.appendChild(valLabel);

    container.appendChild(path);
  });

  // 現在地の矢印
  let arrow = document.createElement('div');
  arrow.className = 'current-arrow';
  arrow.innerText = '▼';
  arrow.style.left = `${(linePos / maxLineVal) * 100}%`;
  container.appendChild(arrow);
}

// --- 2. ブロックシミュレーター ---
function addBlock(amount) {
  if (amount === 1) blockOnes++;
  if (amount === 0.1) blockTenths++;
  if (amount === -1 && blockOnes > 0) blockOnes--;
  if (amount === -0.1 && blockTenths > 0) blockTenths--;
  updateBlockUI();
}

function breakBlock() {
  if (blockOnes > 0) {
    blockOnes--;
    blockTenths += 10;
    updateBlockUI();
  }
}

function mergeBlock() {
  if (blockTenths >= 10) {
    blockTenths -= 10;
    blockOnes++;
    updateBlockUI();
  }
}

function resetBlock() {
  blockOnes = 0;
  blockTenths = 0;
  updateBlockUI();
}

function updateBlockUI() {
  const container = document.getElementById('block-area');
  container.innerHTML = '';
  
  let total = Math.round((blockOnes + blockTenths * 0.1) * 10) / 10;
  document.getElementById('block-val').innerText = total.toFixed(1);

  if (blockOnes === 0 && blockTenths === 0) {
    container.innerHTML = '<span class="placeholder">ボタンをおしてブロックをだそう</span>';
  } else {
    for (let i = 0; i < blockOnes; i++) {
      let b = document.createElement('div'); b.className = 'b-1'; b.innerText = '1'; container.appendChild(b);
    }
    for (let i = 0; i < blockTenths; i++) {
      let b = document.createElement('div'); b.className = 'b-01'; container.appendChild(b);
    }
  }

  // アクションボタンの表示制御
  document.getElementById('btn-break').classList.toggle('hidden', blockOnes === 0);
  document.getElementById('btn-merge').classList.toggle('hidden', blockTenths < 10);

  checkGoal(total);
}

// --- ヒント ---
function showHint(tool) {
  let text = "";
  if (tool === 'line') {
    text = `「+1」を2回、「+0.1」を8回ジャンプすると「こうた・あみ」の考えに。「+1」を3回ジャンプしてから「-0.1」を2回もどると「みさき」の考えになるよ。`;
  } else if (tool === 'block') {
    text = `「+0.1」をひたすら押して28こ出すと「はると」の考えになるよ。「+1」を2こ、「+0.1」を8こ出すと「あみ」の考えだね。`;
  }
  document.getElementById('hint-text').innerText = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }