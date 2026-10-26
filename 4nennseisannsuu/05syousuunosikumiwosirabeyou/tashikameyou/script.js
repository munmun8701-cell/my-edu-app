// 全角から半角への変換関数
function toHalfWidth(str) {
  return str.replace(/[！-～]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/ /g, ' ').trim();
}

// すべてのテキスト入力に半角変換イベントを適用
document.querySelectorAll('input[type="text"]').forEach(input => {
  input.addEventListener('input', function() {
    let cursorPosition = this.selectionStart;
    this.value = toHalfWidth(this.value);
    // カーソル位置を維持
    this.setSelectionRange(cursorPosition, cursorPosition);
  });
});

// 数直線の目盛りを生成 (100分割)
function generateNumberLine() {
  const nl = document.getElementById('nl-main');
  for (let i = 1; i <= 100; i++) {
    const tick = document.createElement('div');
    tick.className = 'tick';
    if (i % 10 === 0) tick.classList.add('major');
    else if (i % 5 === 0) tick.classList.add('mid');
    nl.appendChild(tick);
  }
}
generateNumberLine();

// 共通の入力チェック関数
function checkInputs(containerSelector) {
  const inputs = document.querySelectorAll(`${containerSelector} .ans-input, ${containerSelector} .ans-select`);
  let allCorrect = true;

  inputs.forEach(input => {
    // 複数の正解パターンを許可（カンマ区切り）
    const correctAnswers = input.dataset.ans.split(',');
    
    if (correctAnswers.includes(input.value)) {
      input.classList.add('correct');
      input.classList.remove('wrong');
    } else {
      input.classList.add('wrong');
      input.classList.remove('correct');
      allCorrect = false;
    }
  });

  return allCorrect;
}

function showResult(resultId, isCorrect) {
  const resultDiv = document.getElementById(resultId);
  if (isCorrect) {
    resultDiv.innerHTML = '<span style="color: #4caf50;">★ ばっちり大正解！ ★</span>';
  } else {
    resultDiv.innerHTML = '<span style="color: #f44336;">おしい！ 色が変わったところを見直そう。</span>';
  }
}

// ミッション1の判定
function checkMission1() {
  const inputsCorrect = checkInputs('#mission1');
  const radio = document.querySelector('input[name="bike-fit"]:checked');
  
  let radioCorrect = false;
  if (radio) {
    // サドル高(0.64m) と また下(0.63m)。かかとを少し上げるので「合っている」が正解
    if (radio.value === 'yes') {
      radio.parentElement.style.borderColor = '#4caf50';
      radio.parentElement.style.backgroundColor = '#e8f5e9';
      radioCorrect = true;
    } else {
      radio.parentElement.style.borderColor = '#f44336';
      radio.parentElement.style.backgroundColor = '#ffebee';
    }
  }

  showResult('result1', inputsCorrect && radioCorrect);
}

// ミッション2の判定
function checkMission2() {
  const isCorrect = checkInputs('#mission2');
  showResult('result2', isCorrect);
}

// ミッション3の判定
function checkMission3() {
  const isCorrect = checkInputs('#mission3');
  showResult('result3', isCorrect);
}​