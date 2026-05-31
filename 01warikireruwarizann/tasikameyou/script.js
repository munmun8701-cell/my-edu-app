// --- すべての問題データ（18問） ---
// 文章題(word)には、式(formula)と答え(answer)の両方を設定します。
const allQuestions = [
  { id: 1, category: "計算", type: "number", text: "① 24 ÷ 4 =", answer: "6" },
  { id: 2, category: "計算", type: "number", text: "② 8 ÷ 2 =", answer: "4" },
  { id: 3, category: "計算", type: "number", text: "③ 14 ÷ 7 =", answer: "2" },
  { id: 4, category: "計算", type: "number", text: "④ 25 ÷ 5 =", answer: "5" },
  { id: 5, category: "計算", type: "number", text: "⑤ 54 ÷ 6 =", answer: "9" },
  { id: 6, category: "計算", type: "number", text: "⑥ 16 ÷ 2 =", answer: "8" },
  { id: 7, category: "計算", type: "number", text: "⑦ 63 ÷ 9 =", answer: "7" },
  { id: 8, category: "計算", type: "number", text: "⑧ 12 ÷ 6 =", answer: "2" },
  { id: 9, category: "計算", type: "number", text: "⑨ 49 ÷ 7 =", answer: "7" },
  { id: 10, category: "計算", type: "number", text: "⑩ 32 ÷ 4 =", answer: "8" },
  { id: 11, category: "計算", type: "number", text: "⑪ 21 ÷ 3 =", answer: "7" },
  { id: 12, category: "計算", type: "number", text: "⑫ 72 ÷ 8 =", answer: "9" },
  { id: 13, category: "計算", type: "number", text: "⑬ 7 ÷ 7 =", answer: "1" },
  { id: 14, category: "計算", type: "number", text: "⑭ 3 ÷ 1 =", answer: "3" },
  { id: 15, category: "計算", type: "number", text: "⑮ 0 ÷ 5 =", answer: "0" },
  { id: 16, category: "文章題", type: "word", text: "① 32人の 子どもを、同じ人数ずつ 8つのチームに 分けます。<br>1チームは 何人に なりますか。", formula: "32÷8", answer: "4" },
  { id: 17, category: "文章題", type: "word", text: "② チューリップを 6本ずつ たばにして、花たばを作ります。<br>チューリップは 48本 あります。<br>花たばは いくつ できますか。", formula: "48÷6", answer: "8" },
  { id: 18, category: "式の意味", type: "multiselect", text: "答えを もとめる式が、「8 ÷ 2」に なるのは どれですか。（あてはまるものを すべて えらびましょう）", 
    options: [
      { key: "ア", text: "1ふくろ 8まい入りの パンが 2ふくろ あります。パンは、全部で 何まい ありますか。" },
      { key: "イ", text: "色紙が 8まい あります。1人に 2まいずつ 分けると、何人に 分けられますか。" },
      { key: "ウ", text: "クッキーが 8まい あります。2まい 食べると、のこりは 何まい ですか。" },
      { key: "エ", text: "8人の 子どもに、あめを 2こずつ 分けます。あめは 何こ ひつよう ですか。" },
      { key: "オ", text: "8人を、同じ人数ずつ 2つのチームに 分けます。1チームは 何人に なりますか。" }
    ],
    answer: ["イ", "オ"]
  }
];

// --- 状態管理 ---
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = []; 
let selectedOptions = [];
let isRetryMode = false;

// 入力先の管理（calc, formula, answerのどれがアクティブか）
let activeInputId = "calc-answer"; 

// --- DOM要素 ---
const screens = { start: document.getElementById('start-screen'), quiz: document.getElementById('quiz-screen'), result: document.getElementById('result-screen') };
const ui = {
  qText: document.getElementById('question-text'), progress: document.getElementById('progress-text'), badge: document.getElementById('category-badge'),
  answerArea: document.getElementById('answer-area'), optionsArea: document.getElementById('options-area'),
  calcInputArea: document.getElementById('calc-input-area'), wordInputArea: document.getElementById('word-input-area'),
  canvasArea: document.getElementById('canvas-area'), submitChoiceBtn: document.getElementById('submit-choice-btn'),
  boxes: {
    "calc-answer": document.getElementById('calc-answer'),
    "word-formula": document.getElementById('word-formula'),
    "word-answer": document.getElementById('word-answer')
  }
};

// --- キャンバス（図解）設定 ---
const canvas = document.getElementById('memo-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

function resizeCanvas() {
  if(ui.canvasArea.classList.contains('hidden')) return;
  canvas.width = canvas.parentElement.clientWidth - 4; // 枠線分を引く
  canvas.height = 160;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = '#2563eb';
}
window.addEventListener('resize', resizeCanvas);

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { if(!isDrawing) return; e.preventDefault(); const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); }, { passive: false });
canvas.addEventListener('touchend', () => { isDrawing = false; });
canvas.addEventListener('mousedown', (e) => { isDrawing = true; const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); });
canvas.addEventListener('mousemove', (e) => { if(!isDrawing) return; const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); });
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseout', () => { isDrawing = false; });
document.getElementById('clear-canvas-btn').addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); });


// --- アプリのロジック ---
function switchScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function startQuiz(retryMistakes = false) {
  isRetryMode = retryMistakes;
  if (isRetryMode) {
    currentQuestions = userAnswers.filter(a => !a.isCorrect).map(a => a.q);
  } else {
    currentQuestions = [...allQuestions];
  }
  currentQuestionIndex = 0; userAnswers = [];
  switchScreen('quiz');
  loadQuestion();
}

// 入力ボックスの切り替え
function setActiveBox(boxId) {
  Object.values(ui.boxes).forEach(b => b.classList.remove('active-input'));
  ui.boxes[boxId].classList.add('active-input');
  activeInputId = boxId;
}
Object.keys(ui.boxes).forEach(id => {
  ui.boxes[id].addEventListener('click', () => setActiveBox(id));
});

function loadQuestion() {
  const q = currentQuestions[currentQuestionIndex];
  ui.progress.textContent = `もんだい ${currentQuestionIndex + 1} / ${currentQuestions.length}`;
  ui.badge.textContent = q.category;
  ui.qText.innerHTML = q.text;
  selectedOptions = [];
  
  // 入力を空にする
  Object.values(ui.boxes).forEach(b => b.textContent = "");

  if (q.type === 'number') {
    ui.optionsArea.classList.add('hidden'); ui.submitChoiceBtn.classList.add('hidden'); ui.wordInputArea.classList.add('hidden'); ui.canvasArea.classList.add('hidden');
    ui.answerArea.classList.remove('hidden'); ui.calcInputArea.classList.remove('hidden');
    setActiveBox("calc-answer");
  } 
  else if (q.type === 'word') {
    ui.optionsArea.classList.add('hidden'); ui.submitChoiceBtn.classList.add('hidden'); ui.calcInputArea.classList.add('hidden');
    ui.answerArea.classList.remove('hidden'); ui.wordInputArea.classList.remove('hidden'); ui.canvasArea.classList.remove('hidden');
    setActiveBox("word-formula"); // 最初は「式」に入力させる
    setTimeout(resizeCanvas, 50); // 表示されてからサイズ調整
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } 
  else if (q.type === 'multiselect') {
    ui.answerArea.classList.add('hidden'); ui.canvasArea.classList.add('hidden');
    ui.optionsArea.classList.remove('hidden'); ui.submitChoiceBtn.classList.remove('hidden');
    ui.optionsArea.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<strong>${opt.key}</strong>：${opt.text}`;
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        if (selectedOptions.includes(opt.key)) selectedOptions = selectedOptions.filter(k => k !== opt.key);
        else selectedOptions.push(opt.key);
      });
      ui.optionsArea.appendChild(btn);
    });
  }
}

// ナンバーパッドの処理
document.querySelectorAll('.num-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetBox = ui.boxes[activeInputId];
    if (btn.classList.contains('clear-btn')) {
      targetBox.textContent = "";
    } else {
      // 式は少し長く、答えは短く制限
      const maxLen = (activeInputId === "word-formula") ? 6 : 3;
      if (targetBox.textContent.length < maxLen) {
        targetBox.textContent += btn.textContent;
      }
    }
  });
});

// 解答の判定と次の問題へ
function submitAnswer() {
  const q = currentQuestions[currentQuestionIndex];
  let isCorrect = false;
  let userAnswerData = "";

  if (q.type === 'number') {
    const input = ui.boxes["calc-answer"].textContent;
    if (input === "") return;
    isCorrect = (input === q.answer);
    userAnswerData = input;
  } 
  else if (q.type === 'word') {
    const f = ui.boxes["word-formula"].textContent;
    const a = ui.boxes["word-answer"].textContent;
    if (f === "" || a === "") return; // 両方入力必須
    isCorrect = (f === q.formula && a === q.answer);
    userAnswerData = `式: ${f} , 答え: ${a}`;
  } 
  else if (q.type === 'multiselect') {
    if (selectedOptions.length === 0) return;
    const sortedSelected = [...selectedOptions].sort();
    const sortedAnswer = [...q.answer].sort();
    isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedAnswer);
    userAnswerData = sortedSelected.join(' と ');
  }

  userAnswers.push({ q: q, isCorrect: isCorrect, userAnswer: userAnswerData });

  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) loadQuestion();
  else showResult();
}

document.getElementById('submit-btn').addEventListener('click', submitAnswer);
ui.submitChoiceBtn.addEventListener('click', submitAnswer);

// --- 結果画面 ---
function showResult() {
  switchScreen('result');
  const total = currentQuestions.length;
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const accuracy = Math.round((correctCount / total) * 100);
  
  document.getElementById('score-text').textContent = accuracy;
  const fbMsg = document.getElementById('feedback-message');
  if (accuracy === 100) { fbMsg.textContent = "かんぺき！ わり算マスターだね！🎉"; fbMsg.style.color = "#16a34a"; } 
  else if (accuracy >= 80) { fbMsg.textContent = "あともうすこし！ すごい！✨"; fbMsg.style.color = "#eab308"; } 
  else { fbMsg.textContent = "まちがえたところを ふくしゅうしよう！💪"; fbMsg.style.color = "#ef4444"; }

  const mistakes = userAnswers.filter(a => !a.isCorrect);
  const mistakeCategories = { "計算": 0, "文章題": 0, "式の意味": 0 };
  mistakes.forEach(m => { mistakeCategories[m.q.category]++; });
  
  const analysisText = document.getElementById('analysis-text');
  if (mistakes.length === 0) {
    analysisText.textContent = "にがてな ところは ありません！ すばらしい！";
  } else {
    let weakPoint = Object.keys(mistakeCategories).reduce((a, b) => mistakeCategories[a] > mistakeCategories[b] ? a : b);
    let advice = "";
    if (weakPoint === "計算") advice = "九九（くく）を 思い出して 計算しよう。「0のわり算」にも 気をつけてね！";
    if (weakPoint === "文章題") advice = "図をかいて「ぜんぶの数 ÷ 1つ分の数」なのかを よく考えよう！";
    if (weakPoint === "式の意味") advice = "「かけ算」になるお話と、「わり算」になるお話を まちがえないように 気をつけよう！";
    analysisText.innerHTML = `とくに <strong>「${weakPoint}」</strong> の もんだいで まちがえが 多かったようです。<br>${advice}`;
  }

  const mistakeUl = document.getElementById('mistake-ul');
  mistakeUl.innerHTML = '';
  mistakes.forEach(m => {
    const li = document.createElement('li');
    let qTextClean = m.q.text.replace(/<br>/g, ' ');
    let correctAns = "";
    if (m.q.type === 'word') correctAns = `式: ${m.q.formula} , 答え: ${m.q.answer}`;
    else correctAns = Array.isArray(m.q.answer) ? m.q.answer.join(' と ') : m.q.answer;
    
    li.innerHTML = `<strong>【${m.q.category}】</strong><br>
                    <span style="font-size:0.95rem;">${qTextClean}</span><br>
                    <span style="color:#ef4444; font-weight:bold;">あなたの答え：${m.userAnswer}</span><br>
                    <span style="color:#16a34a; font-weight:bold;">➡ 正解：${correctAns}</span>`;
    mistakeUl.appendChild(li);
  });

  const retryBtn = document.getElementById('retry-btn');
  if (mistakes.length > 0) retryBtn.classList.remove('hidden');
  else retryBtn.classList.add('hidden');
}

document.getElementById('start-btn').addEventListener('click', () => startQuiz(false));
document.getElementById('home-btn').addEventListener('click', () => { switchScreen('start'); });
document.getElementById('retry-btn').addEventListener('click', () => startQuiz(true));