<<<<<<< HEAD
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
=======
:root {
  --bg-color: #FDF9F1;
  --primary-color: #74B9FF;
  --secondary-color: #FF7675;
  --accent-color: #FFEAA7;
  --text-main: #2D3436;
  --border-light: #DFE6E9;
  --box-bg: #FFFFFF;
  --correct-bg: #D4EFDF;
  --font-base: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-base); background-color: var(--bg-color); color: var(--text-main); }
.app-wrapper { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

/* ヘッダー */
.header { background: var(--box-bg); padding: 10px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); z-index: 10; }
.character-area { display: flex; align-items: center; gap: 15px; }
.character-icon { font-size: 2rem; }
.speech-bubble { background: var(--accent-color); padding: 10px 20px; border-radius: 20px; position: relative; font-weight: bold; }
.speech-bubble::before { content: ''; position: absolute; left: -10px; top: 50%; transform: translateY(-50%); border: 10px solid transparent; border-right-color: var(--accent-color); }

/* メインレイアウト */
.main-content { display: flex; flex: 1; overflow: hidden; }

/* 左側ナビゲーション */
.sidebar { width: 260px; background: var(--box-bg); border-right: 2px solid var(--border-light); padding: 15px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
.sidebar h2 { font-size: 1.2rem; text-align: center; border-bottom: 2px dashed var(--border-light); padding-bottom: 10px; }
.nav-btn { width: 100%; padding: 15px 10px; text-align: left; font-size: 1.1rem; border: 2px solid transparent; border-radius: 8px; background: #F5F6FA; cursor: pointer; font-weight: bold; transition: 0.2s; }
.nav-btn:hover { background: #E1E8ED; }
.nav-btn.active { background: #fff; border-color: var(--primary-color); color: #0984E3; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.nav-btn.cleared { background: var(--correct-bg); border-color: #27AE60; color: #1E8449; }

/* 右側エリア（上下分割） */
.right-pane { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* 上段：問題シート */
.worksheet-area { flex: 0 0 45%; padding: 20px 30px; overflow-y: auto; background: #fff; }
.worksheet-view { display: none; animation: fadeIn 0.3s ease; }
.worksheet-view.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.question-header { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; }
.q-num { background: #D35400; color: #fff; padding: 5px 15px; border-radius: 8px; font-size: 1.5rem; font-weight: bold; }
.question-header h3 { font-size: 1.4rem; line-height: 1.5; }
.load-sim-btn { margin-left: auto; background: var(--primary-color); color: #fff; border: none; padding: 10px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1rem; box-shadow: 0 2px 0 #0984E3;}
.load-sim-btn:active { transform: translateY(2px); box-shadow: none; }
.mini-sim-btn { background: #E1E8ED; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1.1rem; }

/* 入力欄スタイル */
.ans-input { border: none; border-bottom: 3px solid #636E72; font-size: 1.4rem; text-align: center; width: 60px; padding: 5px; background: #F8F9FA; outline: none; font-weight: bold; transition: 0.3s; }
.ans-input.short { width: 45px; }
.ans-input:focus { border-bottom-color: var(--primary-color); background: #fff; }
.ans-input.correct { background: var(--correct-bg); border-bottom-color: #27AE60; }
.answer-box { background: #FFF3E0; padding: 20px; border-radius: 12px; font-size: 1.4rem; font-weight: bold; display: inline-block; }

/* Q1 ボタングリッド */
.q1-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 600px; }
.q1-choice { padding: 15px; font-size: 1.3rem; border: 3px solid var(--border-light); border-radius: 10px; background: #fff; cursor: pointer; font-weight: bold; transition: 0.2s; }
.q1-choice.selected { border-color: var(--secondary-color); background: #FFE8E8; }
.q1-choice.correct-selection { border-color: #27AE60; background: var(--correct-bg); }

/* Q3, Q5 グリッド */
.q3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.calc-row { font-size: 1.3rem; font-weight: bold; }
.q5-container { display: flex; flex-direction: column; gap: 20px; }
.q5-box { background: #F8F9FA; padding: 15px; border-radius: 10px; border: 2px solid var(--border-light); }
.check-line { margin-top: 10px; font-size: 1.2rem; color: #555; }

/* 下段：シミュレーター */
.simulator-area { flex: 1; display: flex; flex-direction: column; background: #F5F6FA; border-top: 4px solid var(--border-light); overflow-y: auto;}
.simulator-header { display: flex; justify-content: space-between; align-items: center; background: #E0E0E0; }
.tabs { display: flex; }
.tab-btn { padding: 10px 20px; border: none; background: #E0E0E0; font-size: 1rem; font-weight: bold; cursor: pointer; color: #555; }
.tab-btn.active { background: #F5F6FA; color: #0984E3; border-top: 3px solid #0984E3; }
.current-sim-eq { padding-right: 20px; font-size: 1.5rem; font-weight: bold; color: #2D3436; letter-spacing: 2px; }

/* ツール共通 */
.tool-content { flex: 1; display: none; flex-direction: column; padding: 15px; }
.tool-content.active { display: flex; }
.instruction-bar { display: flex; align-items: center; gap: 15px; background: #fff; padding: 10px 15px; border-radius: 8px; font-weight: bold; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.mini-btn { background: #00B894; color: white; border: none; padding: 8px 15px; border-radius: 15px; font-weight: bold; cursor: pointer; font-size: 0.9rem; }
.mini-btn.reset { background: #B2BEC3; }

/* ブロック・数直線スタイル（前回踏襲・コンパクト化） */
.blocks-workspace { display: flex; gap: 20px; flex: 1; }
.pool-area, .groups-area { background: #fff; padding: 15px; border-radius: 10px; flex: 1; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.dots-container { display: flex; flex-wrap: wrap; gap: 8px; }
.dot { width: 30px; height: 30px; background: var(--primary-color); border-radius: 50%; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: 0.1s; }
.dot:active { transform: scale(0.9); }
.groups-container { display: flex; flex-wrap: wrap; gap: 10px; }
.group-box { border: 2px dashed #A29BFE; padding: 10px; border-radius: 10px; display: flex; flex-wrap: wrap; gap: 5px; background: #F8F9FA; min-width: 50px; min-height: 50px; }
.group-box.full { border-color: #00B894; background: #E8F8F5; border-style: solid; }

.number-line-workspace { display: flex; flex-direction: column; align-items: center; gap: 30px; padding: 20px; background: #fff; border-radius: 10px; }
.line-status { font-size: 1.3rem; font-weight: bold; }
.highlight-text { color: var(--secondary-color); font-size: 1.5rem; }
.line-container { position: relative; width: 90%; height: 80px; }
.number-line { position: absolute; bottom: 20px; width: 100%; height: 4px; background: #2D3436; }
.line-labels { position: absolute; bottom: -5px; width: 100%; display: flex; justify-content: space-between; font-weight: bold; }
.jump-arcs { position: absolute; bottom: 24px; width: 100%; height: 50px; display: flex; }
.arc { height: 100%; border: 3px solid var(--secondary-color); border-bottom: none; border-radius: 50px 50px 0 0; position: relative; }

.check-workspace { text-align: center; background: #fff; padding: 20px; border-radius: 10px; }
.equation-inputs { font-size: 1.8rem; font-weight: bold; margin-bottom: 20px; }
.num-input { width: 70px; font-size: 1.5rem; text-align: center; border: 3px solid var(--primary-color); border-radius: 8px; }
.formula-box { background: var(--accent-color); padding: 15px; border-radius: 10px; font-size: 1.5rem; font-weight: bold; display: inline-block; }

/* フッター・クリア画面 */
.footer { background: var(--box-bg); padding: 12px; text-align: center; border-top: 2px solid var(--border-light); z-index: 10; }
.notebook-message { font-size: 1.2rem; color: #D35400; display: inline-block; }
.clear-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(253, 249, 241, 0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; opacity: 0; pointer-events: none; transition: 0.5s; }
.clear-screen.show { opacity: 1; pointer-events: auto; }
.clear-content { background: #FFF; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 6px solid #00B894; }
.clear-title { font-size: 2.5rem; color: #00B894; margin-bottom: 20px; }
.clear-messages p { font-size: 1.6rem; margin: 15px 0; font-weight: bold; }
.action-btn { background: var(--primary-color); border: none; padding: 15px 30px; font-size: 1.2rem; border-radius: 30px; font-weight: bold; color: #fff; margin-top: 20px; cursor: pointer;}
>>>>>>> dab01cf64e1f894f42ffc4b53e7f14216635ece6
