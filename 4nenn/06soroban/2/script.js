const RODS = 21; // 小数第二位〜百京まで対応
let state = Array(RODS).fill(null).map(() => ({ go: 0, ichi: 0 }));
let currentMode = 'examples';
let currentProblemIndex = -1;
let currentStepIndex = 0;
let targetValueStr = "";

// 桁の名前（内部判定・ヒント用）
const placeNames = [
  "1/100", "1/10", "一", "十", "百", "千", "一万", "十万", "百万", "千万",
  "一億", "十億", "百億", "千億", "一兆", "十兆", "百兆", "千兆", "一京", "十京", "百京"
];

// 教科書内容の完全網羅データ
const problems = {
  examples: [
    {
      title: "8.42 ＋ 1.3",
      steps: [
        { instruction: "まずは「8.42」をそろばんに入れよう。", target: "8.42", hint: "一の位に8、1/10の位に4、1/100の位に2だよ。" },
        { instruction: "大きい位から計算するよ。1.3の「1」をたそう。", target: "9.42", hint: "一の位の珠を1つ上げよう。" },
        { instruction: "次に「0.3」をたそう。", target: "9.72", hint: "1/10の位で、五だまを入れて、一だまを2こ取ろう。" }
      ]
    },
    {
      title: "8 ＋ 4.6",
      steps: [
        { instruction: "まずは「8」をそろばんに入れよう。", target: "8", hint: "一の位に8を入れよう。" },
        { instruction: "4.6の「4」をたすよ。どうする？", target: "12", hint: "一の位に4はそのまま足せないね。6を取って、十の位に1（10）を入れよう。" },
        { instruction: "最後に4.6の「0.6」をたそう。", target: "12.6", hint: "1/10の位に6（五だまと一だま1つ）を入れよう。" }
      ]
    },
    {
      title: "8.42 － 1.3",
      steps: [
        { instruction: "まずは「8.42」をそろばんに入れよう。", target: "8.42", hint: "一の位に8、1/10の位に4、1/100の位に2だよ。" },
        { instruction: "大きい位からひくよ。1.3の「1」をひこう。", target: "7.42", hint: "一の位の珠を1つ下げよう。" },
        { instruction: "次に「0.3」をひこう。", target: "7.12", hint: "1/10の位の珠を3つ下げよう。" }
      ]
    },
    {
      title: "8 － 4.6",
      steps: [
        { instruction: "まずは「8」をそろばんに入れよう。", target: "8", hint: "一の位に8を入れよう。" },
        { instruction: "4.6の「4」をひくよ。どうする？", target: "4", hint: "一だまが無いね。一だまを1入れて、五だまを取ろう。" },
        { instruction: "最後に「0.6」をひくよ。", target: "3.4", hint: "1/10の位に何もないね。一の位から1を取って、1/10の位に0.4を入れよう。" }
      ]
    }
  ],
  practice: [
    { title: "① 3.3 ＋ 5.47", target: "8.77" },
    { title: "② 3.6 ＋ 9", target: "12.6" },
    { title: "③ 7.8 － 3.25", target: "4.55" },
    { title: "④ 6 － 2.8", target: "3.2" },
    { title: "⑤ 4兆 ＋ 3兆", target: "7000000000000" },
    { title: "⑥ 21億 ＋ 13億", target: "3400000000" },
    { title: "⑦ 6億 － 2億", target: "400000000" },
    { title: "⑧ 34兆 － 21兆", target: "13000000000000" }
  ]
};

function zenkakuToHankaku(str) {
  return str.replace(/[０-９．]/g, s => s === '．' ? '.' : String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
}

function initSoroban() {
  const container = document.getElementById('rods-container');
  container.innerHTML = '';

  for (let i = RODS - 1; i >= 0; i--) {
    const col = document.createElement('div');
    col.className = 'rod-col';
    
    // 定位点 (i=2が一の位。3桁ごとに表示)
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
}

function toggleIchiBead(rodIndex, beadIndex) {
  if (state[rodIndex].ichi >= beadIndex) {
    state[rodIndex].ichi = beadIndex - 1;
  } else {
    state[rodIndex].ichi = beadIndex;
  }
  updateUI();
}

function getSorobanString() {
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
  return decPart.length > 0 ? `${intPart}.${decPart}` : intPart;
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
  
  const valStr = getSorobanString();
  const parts = valStr.split('.');
  // カンマ区切りの見やすい表示（兆などの大きな数も読みやすく）
  let displayStr = BigInt(parts[0] || "0").toLocaleString('ja-JP');
  if (parts.length > 1) displayStr += '.' + parts[1];
  
  document.getElementById('current-val').innerText = displayStr;
}

function resetSoroban() {
  state = Array(RODS).fill(null).map(() => ({ go: 0, ichi: 0 }));
  updateUI();
}

function renderProblemList() {
  const list = document.getElementById('problem-list');
  list.innerHTML = '';
  document.getElementById('section-title').innerText = currentMode === 'examples' ? '教科書の例題' : '適応問題（練習）';
  
  if (currentMode === 'free') {
    document.getElementById('problem-area').classList.add('hidden');
    document.getElementById('instruction-box').classList.add('hidden');
    document.getElementById('free-input-area').classList.remove('hidden');
    document.getElementById('btn-check').classList.remove('hidden');
    return;
  }

  document.getElementById('problem-area').classList.remove('hidden');
  document.getElementById('instruction-box').classList.remove('hidden');
  document.getElementById('free-input-area').classList.add('hidden');
  document.getElementById('btn-check').classList.remove('hidden');

  problems[currentMode].forEach((prob, idx) => {
    const div = document.createElement('div');
    div.className = 'problem-item';
    div.innerText = prob.title;
    div.onclick = () => selectProblem(idx, div);
    list.appendChild(div);
  });
}

function selectProblem(index, element) {
  document.querySelectorAll('.problem-item').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');
  
  currentProblemIndex = index;
  currentStepIndex = 0;
  resetSoroban();
  updateInstruction();
}

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  currentProblemIndex = -1;
  targetValueStr = "";
  resetSoroban();
  renderProblemList();
  
  if(mode !== 'free') {
    document.getElementById('step-instruction').innerText = "左から問題を選んでね。";
    document.getElementById('step-hint').innerText = "";
    document.getElementById('btn-check').classList.add('hidden');
  }
}

function updateInstruction() {
  if (currentProblemIndex === -1) return;
  document.getElementById('btn-check').classList.remove('hidden');

  if (currentMode === 'examples') {
    const step = problems.examples[currentProblemIndex].steps[currentStepIndex];
    document.getElementById('step-instruction').innerText = step.instruction;
    document.getElementById('step-hint').innerText = ""; // はじめはヒントを見せない（主体性）
    targetValueStr = step.target;
  } else if (currentMode === 'practice') {
    const prob = problems.practice[currentProblemIndex];
    document.getElementById('step-instruction').innerText = prob.title + " を計算しよう。";
    document.getElementById('step-hint').innerText = "答えがわかったら「できた！」をおしてね。";
    targetValueStr = prob.target;
  }
}

function handleFreeInput() {
  const input = document.getElementById('free-input').value;
  const normalized = zenkakuToHankaku(input).replace(/,/g, '');
  if (!isNaN(Number(normalized)) && normalized !== "") {
    targetValueStr = normalized;
  } else {
    targetValueStr = "";
  }
}

function checkAnswer() {
  if (!targetValueStr) return;
  
  const currentValStr = getSorobanString();

  if (currentValStr === targetValueStr) {
    handleCorrectAnswer();
  } else {
    generateHint(targetValueStr);
  }
}

function handleCorrectAnswer() {
  const overlay = document.getElementById('success-overlay');
  const msg = document.getElementById('success-message');

  if (currentMode === 'examples') {
    const steps = problems.examples[currentProblemIndex].steps;
    if (currentStepIndex < steps.length - 1) {
      msg.innerText = "その調子！次の計算に進むよ。";
      overlay.classList.remove('hidden');
      currentStepIndex++;
      updateInstruction();
    } else {
      msg.innerText = "この問題はかんぺきだね！";
      overlay.classList.remove('hidden');
    }
  } else {
    msg.innerText = "大正解！よくできました！";
    overlay.classList.remove('hidden');
  }
}

function generateHint(targetStr) {
  // 自分で気づけるように、間違っている位の名前だけを教える
  let targetArray = Array(RODS).fill(0);
  let parts = targetStr.split('.');
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
      let hintText = `💡 あれ？『${placeNames[i]}』の位の珠がちがうみたい。`;
      
      // 例題モードの場合は、教科書通りのヒントを追記する
      if (currentMode === 'examples') {
         hintText += " (" + problems.examples[currentProblemIndex].steps[currentStepIndex].hint + ")";
      }
      
      document.getElementById('step-hint').innerText = hintText;
      
      // ボタンを一瞬揺らして気づかせる
      const btn = document.getElementById('btn-check');
      btn.style.transform = "translateX(5px)";
      setTimeout(() => btn.style.transform = "translateX(-5px)", 100);
      setTimeout(() => btn.style.transform = "translateX(0)", 200);
      return; 
    }
  }
}

function closeSuccessOverlay() {
  document.getElementById('success-overlay').classList.add('hidden');
}

window.onload = () => {
  initSoroban();
  renderProblemList();
};