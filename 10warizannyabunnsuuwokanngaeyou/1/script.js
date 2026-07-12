// 全角数字を半角数字に変換・不要な空白を除去する関数
function validateInput(element) {
  let val = element.value;
  // 全角数字を半角に変換
  val = val.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  // 空白や全角記号（＋ー／＊など、今回は不要なもの）を除去
  val = val.replace(/[^0-9\+\-\*\/÷=]/g, ''); 
  // 式の入力欄の「÷」のゆらぎ対応（/ も許容するかどうかですが、今回はシンプルに数字と記号のみ）
  element.value = val;
}

// ヒントの表示切り替え
function toggleHint(id) {
  const hint = document.getElementById(id);
  if (hint.classList.contains('hidden')) {
    hint.classList.remove('hidden');
  } else {
    hint.classList.add('hidden');
  }
}

// ドラッグ＆ドロップの実装
const bundles = document.querySelectorAll('.bundle');
const dropZones = document.querySelectorAll('.drop-zone');
const sourceArea = document.getElementById('source-bundles');
let draggedItem = null;

bundles.forEach(bundle => {
  bundle.addEventListener('dragstart', function() {
    draggedItem = this;
    setTimeout(() => this.style.display = 'none', 0);
  });
  
  bundle.addEventListener('dragend', function() {
    setTimeout(() => {
      draggedItem.style.display = 'flex';
      draggedItem = null;
      checkDistribution();
    }, 0);
  });
});

dropZones.forEach(zone => {
  zone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('hover');
  });
  
  zone.addEventListener('dragleave', function() {
    this.classList.remove('hover');
  });
  
  zone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('hover');
    if (draggedItem) {
      this.appendChild(draggedItem);
    }
  });
});

// 元の場所にも戻せるようにする
sourceArea.addEventListener('dragover', function(e) {
  e.preventDefault();
});
sourceArea.addEventListener('drop', function(e) {
  e.preventDefault();
  if (draggedItem) {
    this.appendChild(draggedItem);
  }
});

// 均等に配れたかどうかのチェック
function checkDistribution() {
  const p1Count = document.getElementById('person-1').querySelector('.drop-zone').children.length;
  const p2Count = document.getElementById('person-2').querySelector('.drop-zone').children.length;
  const p3Count = document.getElementById('person-3').querySelector('.drop-zone').children.length;
  const feedback = document.getElementById('distribution-feedback');
  
  if (p1Count === 2 && p2Count === 2 && p3Count === 2) {
    feedback.innerHTML = "🎉 3人に2たばずつ、おなじ数ずつ分けられたね！<br>1人分は「10が2こ」になったよ。";
    feedback.style.color = "#d32f2f";
    feedback.style.fontWeight = "bold";
    // 成功したら数直線の色を変える連動ギミック
    document.getElementById('bar-1').style.backgroundColor = "#ef9a9a";
  } else {
    feedback.innerHTML = "";
  }
}

// メイン問題の答え合わせ
function checkMainAnswer() {
  const equation = document.getElementById('main-equation').value.replace(/ /g, '');
  const answer = document.getElementById('main-answer').value;
  const resultText = document.getElementById('main-result');
  
  let isEqCorrect = (equation === '60÷3' || equation === '60/3');
  let isAnsCorrect = (answer === '20');
  
  if (isEqCorrect && isAnsCorrect) {
    resultText.innerHTML = "💮 だいせいかい！10をもとにすると、大きな数も計算しやすいね。";
    resultText.className = "result-text correct";
  } else if (!isEqCorrect && isAnsCorrect) {
    resultText.innerHTML = "おしい！答えは合っているよ。「式」には 60÷3 をいれよう。";
    resultText.className = "result-text incorrect";
  } else if (isEqCorrect && !isAnsCorrect) {
    resultText.innerHTML = "式はバッチリ！ 6÷3=2 だから、10が2こでいくつになるか見直してみよう。";
    resultText.className = "result-text incorrect";
  } else {
    resultText.innerHTML = "もういちど考えてみよう！「ヒントを見る」ボタンもおしてみてね。";
    resultText.className = "result-text incorrect";
  }
}

// 練習問題の答え合わせ
function checkPractice() {
  const answers = { p1: '20', p2: '20', p3: '30', p4: '10' };
  let allCorrect = true;
  
  for (let key in answers) {
    const inputVal = document.getElementById(key).value;
    const resultDiv = document.getElementById('r' + key.replace('p', ''));
    
    if (inputVal === answers[key]) {
      resultDiv.innerHTML = "⭕";
      resultDiv.style.color = "red";
    } else {
      resultDiv.innerHTML = "❌";
      resultDiv.style.color = "blue";
      allCorrect = false;
    }
  }
  
  if (allCorrect) {
    alert("💮 ぜんもんせいかい！ 10をもとにして考えるわり算は、もうカンペキだね！");
  }
}