// --- 状態管理 ---
let probType = ''; // 'add' or 'sub'
let valA = 0; // はじめの数 (内部的には10倍した整数で管理)
let valB = 0; // 次の数
let blocks = { tens: 0, ones: 0, tenths: 0 }; 
let brokenTens = 0; // バラした10の数
let brokenOnes = 0; // バラした1の数

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputFilters();
});

// --- 筆算ボードの入力制御 ---
function setupInputFilters() {
  document.querySelectorAll('.num-in, .memo-in').forEach(input => {
    input.setAttribute('maxlength', '1');
    input.addEventListener('input', (e) => {
      let val = e.target.value;
      // 全角数字を半角に変換、数字以外は除去
      val = val.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/[^0-9]/g, '');
      e.target.value = val;
    });
  });
}

// ★ 小数点ボタンのトグル（確実に動作するように修正） ★
function toggleDot(btn) {
  btn.classList.toggle('active');
}

function clearHissan() {
  document.querySelectorAll('.num-in, .memo-in').forEach(el => el.value = '');
  document.querySelectorAll('.dot-btn').forEach(el => el.classList.remove('active'));
}

// --- 問題のセット ---
function setProblem(type, a, b) {
  probType = type;
  valA = Math.round(a * 10); 
  valB = Math.round(b * 10);
  
  let sign = type === 'add' ? '＋' : '－';
  document.getElementById('problem-display').innerText = `${a} ${sign} ${b}`;
  document.getElementById('op-sign').innerText = sign;
  
  // ブロック状態の初期化
  brokenTens = 0;
  brokenOnes = 0;
  
  let tempA = valA;
  blocks.tens = Math.floor(tempA / 100); tempA %= 100;
  blocks.ones = Math.floor(tempA / 10);  tempA %= 10;
  blocks.tenths = tempA;
  
  // 10の位を使う問題なら、10の位エリアを表示
  document.getElementById('col-tens').style.display = (blocks.tens > 0 || Math.floor(valB/100) > 0) ? 'flex' : 'none';

  updateBlockUI();
}

// --- ブロックのロジック ---
function updateBlockUI() {
  const msg = document.getElementById('block-message');
  const btnBreak = document.getElementById('btn-break');
  const btnBreakTen = document.getElementById('btn-break-ten');
  const btnMerge = document.getElementById('btn-merge');
  
  btnBreak.classList.add('hidden');
  btnBreakTen.classList.add('hidden');
  btnMerge.classList.add('hidden');

  if (probType === '') return;

  let drawTens = blocks.tens;
  let drawOnes = blocks.ones + (brokenTens * 10);
  let drawTenths = blocks.tenths + (brokenOnes * 10);

  let targetB_tens = Math.floor(valB / 100);
  let targetB_ones = Math.floor((valB % 100) / 10);
  let targetB_tenths = valB % 10;

  if (probType === 'add') {
    drawTens += targetB_tens;
    drawOnes += targetB_ones;
    drawTenths += targetB_tenths;
    
    msg.innerText = "青とオレンジをあわせよう。10こ集まったらまとめるよ。";
    if (drawTenths >= 10) btnMerge.classList.remove('hidden');
    
  } else if (probType === 'sub') {
    msg.innerText = "青からオレンジの分をひくよ。ひけないときはバラそう。";
    
    if (drawTenths < targetB_tenths && drawOnes > 0) {
      btnBreak.classList.remove('hidden');
      msg.innerHTML = "<span style='color:#e03131;'>⚠️ 0.1のブロックが足りなくて ひけないよ！</span>";
    }
    if (drawOnes < targetB_ones && drawTens > 0) {
      btnBreakTen.classList.remove('hidden');
      msg.innerHTML = "<span style='color:#e03131;'>⚠️ 1のブロックが足りなくて ひけないよ！</span>";
    }
  }

  renderArea('area-tens', drawTens, probType === 'sub' ? targetB_tens : 0, 'b-10', targetB_tens);
  renderArea('area-ones', drawOnes, probType === 'sub' ? targetB_ones : 0, 'b-1', targetB_ones);
  renderArea('area-tenths', drawTenths, probType === 'sub' ? targetB_tenths : 0, 'b-01', targetB_tenths);
}

function renderArea(elementId, totalCount, subCount, baseClass, addOrangeCount) {
  const area = document.getElementById(elementId);
  area.innerHTML = '';
  
  if (probType === 'add') {
    let blueCount = totalCount - addOrangeCount;
    for(let i=0; i<blueCount; i++) {
      let b = document.createElement('div'); b.className = baseClass; area.appendChild(b);
    }
    for(let i=0; i<addOrangeCount; i++) {
      let b = document.createElement('div'); b.className = `${baseClass} b-orange`; area.appendChild(b);
    }
  } else {
    for(let i=0; i<totalCount; i++) {
      let b = document.createElement('div');
      if (i >= totalCount - subCount && totalCount >= subCount) {
        b.className = `${baseClass} b-orange`; 
      } else {
        b.className = baseClass;
      }
      area.appendChild(b);
    }
  }
}

function breakBlock() {
  brokenOnes++;
  blocks.ones--;
  updateBlockUI();
}

function breakTenBlock() {
  brokenTens++;
  blocks.tens--;
  updateBlockUI();
}

function mergeBlock() {
  blocks.tenths -= 10;
  blocks.ones += 1;
  updateBlockUI();
}

function showHint() {
  let text = "";
  if (probType === 'add') {
    text = "0.1のブロックが10こ集まったら、「1」に繰り上がるよ。筆算では、上の小数点にそろえて答えの小数点を打つのを忘れないでね！";
  } else if (probType === 'sub') {
    text = "引くための0.1ブロックが足りないときは、「1」のブロックをバラして0.1を10こにしよう（繰り下がり）。5のように小数点がない数は、5.0と考えて筆算を書くよ。";
  } else {
    text = "まずは上の「もんだい」ボタンから、やりたい計算をえらんでね。";
  }
  document.getElementById('hint-text').innerText = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }