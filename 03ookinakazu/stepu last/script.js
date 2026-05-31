// --- 答え合わせの共通ロジック（大問1, 3用） ---
function checkAnswers(inputClass, feedbackId) {
  const inputs = document.querySelectorAll(`.${inputClass}`);
  let allCorrect = true;

  inputs.forEach(input => {
    const userAnswer = input.value.trim();
    const correctAnswer = input.dataset.ans;

    if (userAnswer === correctAnswer) {
      input.classList.add('correct');
    } else {
      input.classList.remove('correct');
      if (userAnswer !== "") allCorrect = false;
    }
  });

  const feedback = document.getElementById(feedbackId);
  const emptyExists = Array.from(inputs).some(input => input.value.trim() === "");

  if (emptyExists) {
    feedback.textContent = "まだ 入力していない ところが あるよ。";
    feedback.style.color = "#f59e0b";
  } else if (allCorrect) {
    feedback.textContent = "💮 ぜんぶ 正解！ すばらしい！";
    feedback.style.color = "#16a34a";
  } else {
    feedback.textContent = "ちがう ところが あるみたい。ひっ算を たしかめよう！";
    feedback.style.color = "#ef4444";
  }
}

// --- ヒントの開閉 ---
function toggleHint(hintId) {
  const hint = document.getElementById(hintId);
  hint.classList.toggle('hidden');
}

// --- 大問2の答え合わせ ---
function checkQ2() {
  const eq1 = document.getElementById('q2-eq1');
  const eq2 = document.getElementById('q2-eq2');
  const eq3 = document.getElementById('q2-eq3');
  const ans = document.getElementById('q2-ans');
  const feedback = document.getElementById('q2-feedback');

  // 式：382 - 95 = 287
  let isEqCorrect = (eq1.value.trim() === "382" && eq2.value.trim() === "95" && eq3.value.trim() === "287");
  let isAnsCorrect = (ans.value.trim() === "287");

  [eq1, eq2, eq3].forEach(el => el.classList.toggle('correct', isEqCorrect));
  ans.classList.toggle('correct', isAnsCorrect);

  if (isEqCorrect && isAnsCorrect) {
    feedback.textContent = "💮 大正解！ 図から 正しい式が つくれたね！";
    feedback.style.color = "#16a34a";
  } else {
    feedback.textContent = "おや？ ヒントの 図を もう一度 見てみよう。";
    feedback.style.color = "#ef4444";
  }
}

// --- 大問4の答え合わせ ---
function checkQ4() {
  const q1Eq1 = document.getElementById('q4-1-eq1');
  const q1Eq2 = document.getElementById('q4-1-eq2');
  const q1Eq3 = document.getElementById('q4-1-eq3');
  const q1Ans = document.getElementById('q4-1-ans');
  
  const q2Eq1 = document.getElementById('q4-2-eq1');
  const q2Eq2 = document.getElementById('q4-2-eq2');
  const q2Eq3 = document.getElementById('q4-2-eq3');
  const q2Who = document.getElementById('q4-2-who');
  const q2Ans = document.getElementById('q4-2-ans');
  const feedback = document.getElementById('q4-feedback');

  // ① 435 + 283 = 718 (順不同許容)
  const isQ1EqCorrect = ((q1Eq1.value.trim() === "435" && q1Eq2.value.trim() === "283") || (q1Eq1.value.trim() === "283" && q1Eq2.value.trim() === "435")) && q1Eq3.value.trim() === "718";
  const isQ1AnsCorrect = (q1Ans.value.trim() === "718");
  
  [q1Eq1, q1Eq2, q1Eq3].forEach(el => el.classList.toggle('correct', isQ1EqCorrect));
  q1Ans.classList.toggle('correct', isQ1AnsCorrect);

  // ② 435 - 283 = 152
  const isQ2EqCorrect = (q2Eq1.value.trim() === "435" && q2Eq2.value.trim() === "283" && q2Eq3.value.trim() === "152");
  const isQ2WhoCorrect = (q2Who.value === "aki");
  const isQ2AnsCorrect = (q2Ans.value.trim() === "152");

  [q2Eq1, q2Eq2, q2Eq3].forEach(el => el.classList.toggle('correct', isQ2EqCorrect));
  q2Who.classList.toggle('correct', isQ2WhoCorrect);
  q2Ans.classList.toggle('correct', isQ2AnsCorrect);

  if (isQ1EqCorrect && isQ1AnsCorrect && isQ2EqCorrect && isQ2WhoCorrect && isQ2AnsCorrect) {
    feedback.textContent = "💮 カンペキ！ 2つの 問いに 答えられたね！";
    feedback.style.color = "#16a34a";
  } else {
    feedback.textContent = "「あわせる」と「ちがい」で、たし算・ひき算を つかいわけよう！";
    feedback.style.color = "#ef4444";
  }
}

// --- 大問5の答え合わせ ---
function checkQ5() {
  const sel1 = document.getElementById('q5-sel1');
  const sel2 = document.getElementById('q5-sel2');
  const ans = document.getElementById('q5-ans');
  const feedback = document.getElementById('q5-feedback');

  const isSel1Correct = (sel1.value === "nai");
  const isSel2Correct = (sel2.value === "4");
  const isAnsCorrect = (ans.value.trim() === "245");

  sel1.classList.toggle('correct', isSel1Correct);
  sel2.classList.toggle('correct', isSel2Correct);
  ans.classList.toggle('correct', isAnsCorrect);

  if (isSel1Correct && isSel2Correct && isAnsCorrect) {
    feedback.textContent = "💮 大正解！ くり下がりの 意味が しっかり わかっているね！";
    feedback.style.color = "#16a34a";
  } else {
    feedback.textContent = "一の位の 計算（9-4）で、本当に となりから 借りる ひつようが あったかな？";
    feedback.style.color = "#ef4444";
  }
}

// --- ひっ算メモ（キャンバス）のロジック ---
const modal = document.getElementById('memo-modal');
const openBtn = document.getElementById('open-memo-btn');
const closeBtn = document.getElementById('close-memo');
const clearBtn = document.getElementById('clear-memo');
const canvas = document.getElementById('memo-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth - 30; // padding分引く
  canvas.height = canvas.parentElement.clientHeight - 80; // ヘッダー分引く
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#3b82f6'; // 見やすい青色
}

openBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  resizeCanvas(); // 表示されたタイミングでサイズ確定
});
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

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