document.addEventListener('DOMContentLoaded', () => {
  // グリッド線の描画
  const gridCups = document.querySelectorAll('.with-grid');
  gridCups.forEach(cup => {
    for (let i = 1; i <= 9; i++) {
      const line = document.createElement('div');
      line.className = 'grid-line';
      if (i === 5) line.classList.add('bold');
      line.style.bottom = `${i * 10}%`;
      cup.appendChild(line);
    }
  });

  // テキスト入力のリアルタイム判定
  const inputs = document.querySelectorAll('.ans-input');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      checkSingleAnswer(this);
    });
  });
});

// 全角文字を半角に変換、ひらがななどのゆれを吸収
function toHalfWidth(str) {
  let half = str.replace(/[！-～]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return half.replace(/ /g, " ").trim();
}

function checkSingleAnswer(inputElement) {
  const rawValue = inputElement.value;
  if (rawValue === "") {
    inputElement.classList.remove('correct', 'incorrect');
    return false;
  }

  const userValue = toHalfWidth(rawValue);
  const correctAnswers = inputElement.getAttribute('data-ans').split(','); 

  let isCorrect = false;
  correctAnswers.forEach(ans => {
    if (userValue === ans) isCorrect = true;
  });

  if (isCorrect) {
    inputElement.classList.add('correct');
    inputElement.classList.remove('incorrect');
    return true;
  } else {
    inputElement.classList.add('incorrect');
    inputElement.classList.remove('correct');
    return false;
  }
}

// ヒントの表示切り替え
function toggleHint(hintId) {
  const hintEl = document.getElementById(hintId);
  hintEl.style.display = hintEl.style.display === 'none' ? 'block' : 'none';
}

// マスをクリックして水を塗る（具体物操作）
function fillWater(event, cupElement) {
  const rect = cupElement.getBoundingClientRect();
  // クリックしたY座標から、下から何パーセントの位置かを計算
  const clickY = event.clientY - rect.top;
  let percentage = 100 - ((clickY / rect.height) * 100);
  
  // 10%単位にスナップ（四捨五入して10の倍数にする）
  percentage = Math.round(percentage / 10) * 10;
  
  // 0未満や100超えを防ぐ
  if(percentage < 0) percentage = 0;
  if(percentage > 100) percentage = 100;

  // 水の高さを変更
  const water = cupElement.querySelector('.water');
  water.style.height = `${percentage}%`;
  
  // 現在の値をデータ属性に保存（答え合わせ用）
  cupElement.dataset.currentValue = percentage;
  
  // クリックするたびに正誤判定のスタイルをリセット
  cupElement.classList.remove('correct', 'incorrect');
}

// 全体チェック
function checkAll() {
  let allCorrect = true;
  let emptyCount = 0;

  // 1. テキスト入力のチェック
  const inputs = document.querySelectorAll('.ans-input');
  inputs.forEach(input => {
    if (input.value === "") {
      emptyCount++;
      allCorrect = false;
    } else {
      if (!checkSingleAnswer(input)) allCorrect = false;
    }
  });

  // 2. 水の色のチェック（クリック式）
  const cups = document.querySelectorAll('.clickable-cup');
  cups.forEach(cup => {
    const targetAns = parseInt(cup.getAttribute('data-ans'));
    const currentValue = cup.dataset.currentValue ? parseInt(cup.dataset.currentValue) : 0;
    
    if (currentValue === 0) {
      emptyCount++;
      allCorrect = false;
    } else if (currentValue === targetAns) {
      cup.classList.add('correct');
      cup.classList.remove('incorrect');
    } else {
      cup.classList.add('incorrect');
      cup.classList.remove('correct');
      allCorrect = false;
    }
  });

  const msg = document.getElementById('final-message');
  if (allCorrect) {
    msg.innerText = "🎉 たいへんよくできました！かんぺきです！💯";
    msg.style.color = "#e91e63";
  } else if (emptyCount > 0) {
    msg.innerText = "✍️ まだ答えていないところや、色をぬっていないマスがあるよ。";
    msg.style.color = "#ff9800";
  } else {
    msg.innerText = "👀 おや？赤くなっているところをもう一度たしかめてみよう。";
    msg.style.color = "#f44336";
  }
}