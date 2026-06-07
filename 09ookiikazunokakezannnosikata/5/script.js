// --- 全角英数字を半角に変換するユーティリティ関数 ---
function toHalfWidth(str) {
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/\s+/g, ''); // 空白も除去
}

// --- Step 1: 式の確認 ---
function checkEquation() {
  const input = document.getElementById('eq-input').value;
  const normalizedInput = toHalfWidth(input);
  const feedback = document.getElementById('eq-feedback');
  
  if (normalizedInput === '16*4' || normalizedInput === '16×4') {
    feedback.textContent = '⭕ 正解！次は計算のしかたを考えよう。';
    feedback.className = 'feedback correct';
    document.getElementById('step2').style.display = 'block';
  } else if (normalizedInput.length >= 4) {
    feedback.textContent = '❌ おしい！「16cm」が「4つ分」だから…？';
    feedback.className = 'feedback incorrect';
  } else {
    feedback.textContent = '';
  }
}

// --- ヒントの表示切り替え ---
function toggleHint(hintId) {
  const hintEl = document.getElementById(hintId);
  if (hintEl.classList.contains('hidden')) {
    hintEl.classList.remove('hidden');
  } else {
    hintEl.classList.add('hidden');
  }
}

// --- Step 2: 筆算の確認 ---
function checkHissan() {
  const ansTens = toHalfWidth(document.getElementById('ans-tens').value);
  const ansOnes = toHalfWidth(document.getElementById('ans-ones').value);
  const carry = toHalfWidth(document.getElementById('carry-input').value);
  const feedback = document.getElementById('hissan-feedback');
  
  // 正解: 十の位=6, 一の位=4, 繰り上がり=2
  if (ansTens === '6' && ansOnes === '4' && carry === '2') {
    feedback.textContent = '⭕ ばっちり！繰り上がりの「2」もきちんと書けたね。';
    feedback.className = 'feedback correct';
    document.getElementById('hissan-explanation').classList.remove('hidden');
  } else {
    feedback.textContent = '❌ もう一度確認しよう。一の位「6×4=24」の「2」はどこに書くかな？';
    feedback.className = 'feedback incorrect';
  }
}

function showPractice() {
  document.getElementById('step3').style.display = 'block';
  // スムーズスクロール
  document.getElementById('step3').scrollIntoView({ behavior: 'smooth' });
}

// --- Step 3: 練習問題（画像2枚目の適応問題） ---
const practiceData = [
  { id: 1, eq: "28 × 3", ans: "84", hint: "8×3=24、2を十の位に繰り上げよう。" },
  { id: 2, eq: "13 × 7", ans: "91", hint: "3×7=21、2を繰り上げよう。" },
  { id: 3, eq: "26 × 3", ans: "78", hint: "6×3=18、1を繰り上げよう。" },
  { id: 4, eq: "17 × 4", ans: "68", hint: "7×4=28、2を繰り上げよう。" },
  { id: 5, eq: "12 × 8", ans: "96", hint: "2×8=16、1を繰り上げよう。" },
  { id: 6, eq: "49 × 2", ans: "98", hint: "9×2=18、1を繰り上げよう。" },
  { id: 7, eq: "16 × 5", ans: "80", hint: "6×5=30、3を繰り上げよう。" },
  { id: 8, eq: "35 × 2", ans: "70", hint: "5×2=10、1を繰り上げよう。" }
];

let correctCount = 0;

function renderPractice() {
  const container = document.getElementById('practice-container');
  practiceData.forEach((prob, index) => {
    const div = document.createElement('div');
    div.className = 'practice-item';
    div.innerHTML = `
      <div class="equation">① ${prob.eq} = </div>
      <input type="text" id="prac-input-${prob.id}" class="num-input" style="width:60px;" placeholder="答え" onchange="checkPractice(${prob.id})">
      <div id="prac-feedback-${prob.id}" class="feedback"></div>
      <button class="hint-btn" style="font-size:0.8rem; padding: 5px 10px;" onclick="toggleHint('prac-hint-${prob.id}')">ヒント</button>
      <div id="prac-hint-${prob.id}" class="hint-content hidden">${prob.hint}</div>
    `;
    // 問題番号を正しく表示（①, ②...）
    div.querySelector('.equation').textContent = `${String.fromCharCode(0x2460 + index)} ${prob.eq} = `;
    container.appendChild(div);
  });
}

function checkPractice(id) {
  const prob = practiceData.find(p => p.id === id);
  const inputEl = document.getElementById(`prac-input-${id}`);
  const feedbackEl = document.getElementById(`prac-feedback-${id}`);
  const userInput = toHalfWidth(inputEl.value);

  if (userInput === prob.ans) {
    if (!inputEl.disabled) { // 重複カウント防止
      correctCount++;
      inputEl.disabled = true; 
      feedbackEl.textContent = '⭕';
      feedbackEl.className = 'feedback correct';
      checkAllCompleted();
    }
  } else {
    feedbackEl.textContent = '❌ 計算ミスがないか、もう一度たしかめよう。';
    feedbackEl.className = 'feedback incorrect';
  }
}

function checkAllCompleted() {
  if (correctCount === practiceData.length) {
    document.getElementById('completion-message').classList.remove('hidden');
  }
}

// 初期化実行
renderPractice();