// --- 状態管理 ---
let currentDividend = 0;
let currentDivisor = 0;
let remainingDots = 0;
let groupsFormed = 0;
let jumpsMade = 0;

// --- DOM要素 ---
const hintText = document.getElementById('character-message');
const eqDividend = document.getElementById('eq-dividend');
const eqDivisor = document.getElementById('eq-divisor');

// ツール1
const poolCount = document.getElementById('pool-count');
const blockPool = document.getElementById('block-pool');
const groupCount = document.getElementById('group-count');
const blockGroups = document.getElementById('block-groups');
const groupBtn = document.getElementById('group-btn');
const btnDivisorVal = document.getElementById('btn-divisor-val');

// ツール2
const jumpArcs = document.getElementById('jump-arcs');
const lineMaxVal = document.getElementById('line-max-val');
const jumpedTotal = document.getElementById('jumped-total');
const jumpRemain = document.getElementById('jump-remain');
const jumpBtn = document.getElementById('jump-btn');
const btnJumpVal = document.getElementById('btn-jump-val');

// ツール3
const checkDiv = document.getElementById('check-div');
const checkDsr = document.getElementById('check-dsr');
const inputQuotient = document.getElementById('input-quotient');
const inputRemainder = document.getElementById('input-remainder');
const checkDsr2 = document.getElementById('check-dsr-2');
const mirrorQuotient = document.getElementById('mirror-quotient');
const mirrorRemainder = document.getElementById('mirror-remainder');
const calcResult = document.getElementById('calc-result');

// --- タブ切り替え処理 ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tool-content').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById(e.target.dataset.target).classList.add('active');
  });
});

// --- 全角数字を半角に変換する処理（入力の正規化） ---
function toHalfWidthNumber(str) {
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/[^0-9]/g, ''); // 数字以外も除去
}

// --- 問題の読み込みと初期化 ---
function loadProblem(dividend, divisor, hint) {
  if(!dividend || !divisor) return;
  currentDividend = parseInt(dividend);
  currentDivisor = parseInt(divisor);
  
  eqDividend.textContent = currentDividend;
  eqDivisor.textContent = currentDivisor;
  btnDivisorVal.textContent = currentDivisor;
  btnJumpVal.textContent = currentDivisor;
  checkDiv.textContent = currentDividend;
  checkDsr.textContent = currentDivisor;
  checkDsr2.textContent = currentDivisor;
  
  hintText.textContent = hint || "「まとめる」ボタンや、「すすむ」ボタンを おしてみよう！";
  
  resetSimulator();
}

function resetSimulator() {
  // ツール1リセット
  remainingDots = currentDividend;
  groupsFormed = 0;
  blockPool.innerHTML = '';
  blockGroups.innerHTML = '';
  for(let i=0; i<currentDividend; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    blockPool.appendChild(dot);
  }
  updateBlockUI();

  // ツール2リセット
  jumpsMade = 0;
  jumpArcs.innerHTML = '';
  lineMaxVal.textContent = currentDividend;
  updateLineUI();

  // ツール3リセット
  inputQuotient.value = '';
  inputRemainder.value = '';
  updateCheckFormula();
}

// --- ツール1：ブロック分けのロジック ---
function updateBlockUI() {
  poolCount.textContent = remainingDots;
  groupCount.textContent = groupsFormed;
  groupBtn.disabled = remainingDots < currentDivisor;
  if(groupsFormed > 0 && remainingDots < currentDivisor) {
    hintText.textContent = `もう ${currentDivisor}こ では まとめられないね。あまり はいくつかな？`;
  }
}

groupBtn.addEventListener('click', () => {
  if (remainingDots >= currentDivisor) {
    remainingDots -= currentDivisor;
    groupsFormed++;
    
    // UI更新（プールから削除）
    for(let i=0; i<currentDivisor; i++) {
      blockPool.removeChild(blockPool.lastChild);
    }
    
    // グループエリアに追加
    const group = document.createElement('div');
    group.className = 'group-box';
    for(let i=0; i<currentDivisor; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      group.appendChild(dot);
    }
    blockGroups.appendChild(group);
    
    updateBlockUI();
  }
});
document.getElementById('reset-blocks-btn').addEventListener('click', resetSimulator);


// --- ツール2：数直線のロジック ---
function updateLineUI() {
  const currentPos = jumpsMade * currentDivisor;
  jumpedTotal.textContent = currentPos;
  jumpRemain.textContent = currentDividend - currentPos;
  
  jumpBtn.disabled = (currentDividend - currentPos) < currentDivisor;
  if(jumpsMade > 0 && (currentDividend - currentPos) < currentDivisor) {
    hintText.textContent = `わられる数（${currentDividend}）を こえちゃうから、もう ジャンプできないね。`;
  }
}

jumpBtn.addEventListener('click', () => {
  const currentPos = jumpsMade * currentDivisor;
  if ((currentDividend - currentPos) >= currentDivisor) {
    jumpsMade++;
    
    // Arcの描画（%で幅を指定し、ズレを防止）
    const arcWidthPercent = (currentDivisor / currentDividend) * 100;
    const arc = document.createElement('div');
    arc.className = 'arc';
    arc.style.width = `${arcWidthPercent}%`;
    jumpArcs.appendChild(arc);
    
    updateLineUI();
  }
});
document.getElementById('reset-line-btn').addEventListener('click', resetSimulator);

// --- ツール3：たしかめ算のロジック ---
function updateCheckFormula() {
  let qVal = toHalfWidthNumber(inputQuotient.value) || "?";
  let rVal = toHalfWidthNumber(inputRemainder.value) || "?";
  
  // 入力欄の値を半角数字に上書き
  if(inputQuotient.value !== "" && qVal !== "?") inputQuotient.value = qVal;
  if(inputRemainder.value !== "" && rVal !== "?") inputRemainder.value = rVal;

  mirrorQuotient.textContent = qVal;
  mirrorRemainder.textContent = rVal;
  
  if(qVal !== "?" && rVal !== "?") {
    const calc = (currentDivisor * parseInt(qVal)) + parseInt(rVal);
    calcResult.textContent = calc;
    
    if (calc === currentDividend) {
      calcResult.style.color = "green";
      hintText.textContent = "たしかめの式が わられる数と ピッタリ合ったね！ノートにかいておこう。";
    } else {
      calcResult.style.color = "red";
      hintText.textContent = "あれ？わられる数と ちがうみたい。ブロックや数直線で もういちど確認してみよう。";
    }
  } else {
    calcResult.textContent = "?";
    calcResult.style.color = "inherit";
  }
}

inputQuotient.addEventListener('input', updateCheckFormula);
inputRemainder.addEventListener('input', updateCheckFormula);


// --- イベントリスナー（問題選択） ---
const selects = document.querySelectorAll('.problem-select');
selects.forEach(select => {
  select.addEventListener('change', (e) => {
    if(!e.target.value) return;
    // 他のセレクトボックスをリセット
    selects.forEach(s => { if(s !== e.target) s.value = ""; });
    const [dividend, divisor] = e.target.value.split(',');
    loadProblem(dividend, divisor, "どうやって 答えを みつけようか？ ツールをさわってみよう。");
  });
});

const btns = document.querySelectorAll('.problem-btn');
btns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    selects.forEach(s => s.value = ""); // セレクトボックスリセット
    loadProblem(e.target.dataset.dividend, e.target.dataset.divisor, e.target.dataset.hint);
  });
});

// 初期化（何も選ばれていない状態）
hintText.textContent = "まずは左から問題を選んでみよう！";