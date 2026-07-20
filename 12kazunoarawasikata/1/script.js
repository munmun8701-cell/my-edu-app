// ページ読み込み時に最初からグリッドが必要なマスにグリッドを描画
document.addEventListener('DOMContentLoaded', () => {
  const gridCups = document.querySelectorAll('.with-grid');
  gridCups.forEach(cup => {
    drawGridLines(cup);
  });

  // すべての入力フィールドにイベントリスナーを追加（リアルタイム判定）
  const inputs = document.querySelectorAll('.ans-input');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      checkSingleAnswer(this);
    });
  });
});

// 全角数字・記号を半角に変換する補助関数（表記揺れ対応）
function toHalfWidth(str) {
  // 全角英数字を半角に
  let half = str.replace(/[！-～]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  // 全角スペースを半角スペースに、カンマや空白を除去
  return half.replace(/ /g, " ").trim();
}

// 個別の入力チェック
function checkSingleAnswer(inputElement) {
  const rawValue = inputElement.value;
  if (rawValue === "") {
    inputElement.classList.remove('correct', 'incorrect');
    return false;
  }

  const userValue = toHalfWidth(rawValue);
  const correctAnswers = inputElement.getAttribute('data-ans').split(','); // カンマ区切りで複数の正解を許容

  // 数値の場合は文字列として比較、よみかたの場合は完全一致かチェック
  let isCorrect = false;
  correctAnswers.forEach(ans => {
    if (userValue === ans) {
      isCorrect = true;
    }
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
  if (hintEl.style.display === 'block') {
    hintEl.style.display = 'none';
  } else {
    hintEl.style.display = 'block';
  }
}

// ますにメモリ（グリッド線）を追加するアニメーション
function addGridLines(cupId) {
  const cup = document.getElementById(cupId);
  // すでに線がある場合は処理しない
  if (cup.querySelector('.grid-line')) return;

  drawGridLines(cup);
  
  // ボタンのテキストを変更
  const btn = cup.parentElement.nextElementSibling.querySelector('.action-btn');
  if(btn) btn.innerText = "✨ 10こに分かれた！";
}

// グリッド線描画関数
function drawGridLines(cupElement) {
  for (let i = 1; i <= 9; i++) {
    const line = document.createElement('div');
    line.className = 'grid-line';
    if (i === 5) line.classList.add('bold'); // 0.5Lのところを少し太くする工夫
    line.style.bottom = `${i * 10}%`;
    cupElement.appendChild(line);
  }
}

// 水を注ぐアニメーション
function addWater(waterId, targetPercentage) {
  const water = document.getElementById(waterId);
  water.style.height = `${targetPercentage}%`;
}

// 全体チェックボタン
function checkAll() {
  const inputs = document.querySelectorAll('.ans-input');
  let allCorrect = true;
  let emptyCount = 0;

  inputs.forEach(input => {
    if (input.value === "") {
      emptyCount++;
      allCorrect = false;
    } else {
      const isCorrect = checkSingleAnswer(input);
      if (!isCorrect) allCorrect = false;
    }
  });

  const msg = document.getElementById('final-message');
  if (allCorrect) {
    msg.innerText = "🎉 すばらしい！すべてかんぺきに解けました！💯";
    msg.style.color = "#e91e63";
  } else if (emptyCount > 0) {
    msg.innerText = "✍️ まだ入力していないところがあるよ。がんばれ！";
    msg.style.color = "#ff9800";
  } else {
    msg.innerText = "👀 おや？どこかまちがっているみたい。赤くなっているところを直してみよう。";
    msg.style.color = "#f44336";
  }
}