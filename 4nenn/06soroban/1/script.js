const RODS = 21; 
let state = Array(RODS).fill(null).map(() => ({ go: 0, ichi: 0 }));
let currentMode = 'free';
let targetValueStr = "";

// ヒント機能のためだけに位の名前を残していますが、画面には表示されません
const placeNames = [
  "100分の1", "10分の1", "一", "十", "百", "千", "一万", "十万", "百万", "千万",
  "一億", "十億", "百億", "千億", "一兆", "十兆", "百兆", "千兆", "一京", "十京", "百京"
];

const questions = {
  q1: { num: "3726522", desc: "四国4県の人口 (人)" },
  q2: { num: "107596424558000", desc: "日本の国の予算 (円)" },
  q3: { num: "0.08", desc: "この教科書に使われている紙1まいのあつさ (mm)" }
};

function zenkakuToHankaku(str) {
  return str.replace(/[０-９．]/g, function(s) {
    if (s === '．') return '.';
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

function initSoroban() {
  const container = document.getElementById('rods-container');
  container.innerHTML = '';

  for (let i = RODS - 1; i >= 0; i--) {
    const col = document.createElement('div');
    col.className = 'rod-col';
    col.dataset.index = i;

    // 定位点（一の位、千の位、百万の位...）を配置
    if (i >= 2 && (i - 2) % 3 === 0) {
      const dot = document.createElement('div');
      dot.className = 'teiiten';
      col.appendChild(dot); 
    }

    const goBead = document.createElement('div');
    goBead.className = 'bead go-bead';
    goBead.onclick = () => toggleGoBead(i);
    col.appendChild(goBead);

    for (let j = 1; j <= 4; j++) {
      const ichiBead = document.createElement('div');
      ichiBead.className = `bead ichi-bead-${j}`;
      ichiBead.onclick = () => toggleIchiBead(i, j);
      col.appendChild(ichiBead);
    }

    container.appendChild(col);
  }
  updateUI();
}

function toggleGoBead(rodIndex) {
  state[rodIndex].go = state[rodIndex].go === 0 ? 1 : 0;
  updateUI();
  checkAnswer();
}

function toggleIchiBead(rodIndex, beadIndex) {
  const currentIchi = state[rodIndex].ichi;
  
  if (currentIchi >= beadIndex) {
    state[rodIndex].ichi = beadIndex - 1;
  } else {
    state[rodIndex].ichi = beadIndex;
  }
  updateUI();
  checkAnswer();
}

function updateUI() {
  for (let i = 0; i < RODS; i++) {
    const colIndex = RODS - 1 - i;
    const col = document.querySelectorAll('.rod-col')[colIndex];
    
    const goBead = col.querySelector('.go-bead');
    if (state[i].go === 1) goBead.classList.add('active');
    else goBead.classList.remove('active');

    for (let j = 1; j <= 4; j++) {
      const ichiBead = col.querySelector(`.ichi-bead-${j}`);
      if (j <= state[i].ichi) ichiBead.classList.add('active');
      else ichiBead.classList.remove('active');
    }
  }
  
  let intPart = "";
  let decPart = "";
  let started = false;

  for (let i = RODS - 1; i >= 0; i--) {
    let val = state[i].go * 5 + state[i].ichi;
    if (i >= 2) { 
      if (val > 0 || started || i === 2) {
        intPart += val;
        started = true;
      }
    } else { 
      decPart += val;
    }
  }

  if (intPart === "") intPart = "0";
  decPart = decPart.replace(/0+$/, '');

  let displayStr = "";
  if (decPart.length > 0) {
    displayStr = BigInt(intPart).toLocaleString('ja-JP') + '.' + decPart;
  } else {
    displayStr = BigInt(intPart).toLocaleString('ja-JP');
  }

  document.getElementById('current-val').innerText = displayStr;
}

function resetSoroban() {
  state = Array(RODS).fill(null).map(() => ({ go: 0, ichi: 0 }));
  document.getElementById('hint-text').classList.add('hidden');
  updateUI();
}

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  resetSoroban();

  const qArea = document.getElementById('question-area');
  const fArea = document.getElementById('free-input-area');

  if (mode === 'free') {
    qArea.classList.add('hidden');
    fArea.classList.remove('hidden');
    targetValueStr = "";
  } else {
    fArea.classList.add('hidden');
    qArea.classList.remove('hidden');
    
    const q = questions[mode];
    document.getElementById('q-number').innerText = q.num;
    document.getElementById('q-desc').innerText = q.desc;
    targetValueStr = q.num;
  }
}

function handleFreeInput() {
  const input = document.getElementById('free-input').value;
  const normalized = zenkakuToHankaku(input).replace(/,/g, '');
  if (!isNaN(Number(normalized)) && normalized !== "") {
    targetValueStr = normalized.toString(); 
  } else {
     targetValueStr = ""; 
  }
}

function checkAnswer() {
  if (currentMode === 'free' || !targetValueStr) return;

  let intPart = "";
  let decPart = "";
  let started = false;
  for (let i = RODS - 1; i >= 0; i--) {
    let val = state[i].go * 5 + state[i].ichi;
    if (i >= 2) {
      if (val > 0 || started || i === 2) { intPart += val; started = true; }
    } else {
      decPart += val;
    }
  }
  decPart = decPart.replace(/0+$/, '');
  let currentValStr = decPart.length > 0 ? `${intPart}.${decPart}` : intPart;

  if (currentValStr === targetValueStr) {
    setTimeout(() => {
      document.getElementById('success-msg').classList.remove('hidden');
    }, 200);
  }
}

function showHint() {
  if (!targetValueStr) return;

  let targetArray = Array(RODS).fill(0);
  let parts = targetValueStr.split('.');
  let intPart = parts[0] || "0";
  let decPart = parts[1] || "";

  for (let i = 0; i < intPart.length; i++) {
    let digit = parseInt(intPart[intPart.length - 1 - i]);
    if (i + 2 < RODS) targetArray[i + 2] = digit;
  }
  for (let i = 0; i < decPart.length; i++) {
    let digit = parseInt(decPart[i]);
    if (1 - i >= 0) targetArray[1 - i] = digit;
  }

  for (let i = RODS - 1; i >= 0; i--) {
    let currentVal = state[i].go * 5 + state[i].ichi;
    if (currentVal !== targetArray[i]) {
      const hintEl = document.getElementById('hint-text');
      hintEl.innerText = `💡 ヒント：『${placeNames[i]}』の位の珠が違うみたい。もう一度よく見てみよう！`;
      hintEl.classList.remove('hidden');
      return; 
    }
  }
}

function closeSuccess() {
  document.getElementById('success-msg').classList.add('hidden');
}

window.onload = () => {
  initSoroban();
};