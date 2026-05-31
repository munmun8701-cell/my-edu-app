// 考え方ボタンの開閉機能
function toggleIdea(id) {
  const element = document.getElementById(id);
  element.classList.toggle('hidden');
}

// 練習問題のデータ（解答と、つまずきやすい児童向けの専用ヒント）
const problems = [
  { id: 1, q: "51 + 27", a: 78, hint: "50と20、1と7をそれぞれ足してみよう！" },
  { id: 2, q: "39 + 28", a: 67, hint: "39を「40」とみて計算し、あとで1を引いてみよう。" },
  { id: 3, q: "19 + 64", a: 83, hint: "19を「20」とみて計算し、あとで1を引いてみよう。" },
  { id: 4, q: "15 + 65", a: 80, hint: "一の位の5と5を足すと10になるね。" },
  { id: 5, q: "87 - 63", a: 24, hint: "80-60 と 7-3 に分けて計算してみよう。" },
  { id: 6, q: "60 - 29", a: 31, hint: "29を「30」とみて引いて、ひきすぎた1を足そう。" },
  { id: 7, q: "57 - 18", a: 39, hint: "18を「20」とみて引いて、あとで2を足そう。" },
  { id: 8, q: "75 - 49", a: 26, hint: "49を「50」とみて引いて、あとで1を足そう。" },
  { id: 9, q: "61 - 56", a: 5, hint: "56から61までは、あといくつかな？（数え足し）" },
  { id: 10, q: "72 - 64", a: 8, hint: "64から72までは、あといくつかな？" },
  { id: 11, q: "33 - 28", a: 5, hint: "33を「30と3」に分けて、30から28を引いてみよう。" },
  { id: 12, q: "42 - 36", a: 6, hint: "42から、ひきやすい「32」を引いて、残りを引こう。" }
];

const quizGrid = document.getElementById('quiz-grid');

// 問題を画面に生成する関数
function renderQuizzes() {
  problems.forEach((prob, index) => {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.innerHTML = `
      <div class="quiz-row">
        <span class="quiz-number">①～⑫の${index + 1}</span>
        <span>${prob.q} = </span>
        <input type="text" id="input-${prob.id}" data-answer="${prob.a}">
        <button class="hint-btn" onclick="toggleHint('hint-${prob.id}')">💡ヒント</button>
      </div>
      <div id="hint-${prob.id}" class="hint-text hidden">${prob.hint}</div>
    `;
    quizGrid.appendChild(card);

    const inputField = document.getElementById(`input-${prob.id}`);
    
    // 入力中の判定（全角半角変換 ＆ 正解なら緑、桁が足りていて間違っていれば赤）
    inputField.addEventListener('input', function() {
      validateInput(this, prob.a, false);
    });

    // 入力欄から離れた時の判定（間違っていれば空欄でない限り赤）
    inputField.addEventListener('blur', function() {
      validateInput(this, prob.a, true);
    });
  });
}

// ヒントの開閉
function toggleHint(id) {
  const hintEl = document.getElementById(id);
  hintEl.classList.toggle('hidden');
}

// 入力値のチェックと色変更
function validateInput(inputElement, correctAnswer, isBlur) {
  // 全角数字を半角数字に変換
  let val = inputElement.value;
  val = val.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  inputElement.value = val;

  // 空欄の場合は色をリセット
  if (val === '') {
    inputElement.classList.remove('correct', 'incorrect');
    return;
  }

  const userAnswer = parseInt(val, 10);
  const correctStr = correctAnswer.toString();

  if (userAnswer === correctAnswer) {
    // 正解
    inputElement.classList.remove('incorrect');
    inputElement.classList.add('correct');
    checkAllComplete();
  } else {
    // 不正解
    inputElement.classList.remove('correct');
    
    // 答えの桁数以上入力しているか、フォーカスが外れた場合は赤くする
    if (val.length >= correctStr.length || isBlur) {
      inputElement.classList.add('incorrect');
    } else {
      inputElement.classList.remove('incorrect');
    }
  }
}

// 全問正解かどうかのチェック
function checkAllComplete() {
  const inputs = document.querySelectorAll('input[type="text"]');
  let allCorrect = true;
  
  inputs.forEach(input => {
    if (!input.classList.contains('correct')) {
      allCorrect = false;
    }
  });

  // 全てに 'correct' クラスがついていればモーダルを表示
  if (allCorrect) {
    setTimeout(() => {
      document.getElementById('success-modal').classList.remove('hidden');
    }, 300); // 最後の入力から少しだけ遅らせて表示
  }
}

// 初期化実行
renderQuizzes();