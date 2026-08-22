// 全角数字・文字を半角に変換する処理
function toHalfWidth(str) {
  return str.replace(/[！-～]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/ /g, ' '); // 全角スペースは半角スペースへ
}

document.querySelectorAll('input.ans-input').forEach(input => {
  input.addEventListener('input', function() {
    this.value = toHalfWidth(this.value).trim();
  });
});

// ヒントの表示切り替え
function toggleHint(hintId) {
  const hintEl = document.getElementById(hintId);
  hintEl.style.display = hintEl.style.display === 'block' ? 'none' : 'block';
}

// 数直線の描画エンジン
function renderNumberLine(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  // 100等分（0.01きざみ）
  for (let i = 1; i <= 100; i++) {
    const tick = document.createElement('div');
    tick.className = 'tick';
    if (i % 10 === 0) tick.classList.add('major');
    if (i === 100) tick.classList.add('last');
    container.appendChild(tick);
  }
}

renderNumberLine('nl-stage1');
renderNumberLine('nl-stage4');

// 数直線のクリック判定処理
function attachNumberLineLogic(containerId, isSingleTarget) {
  const container = document.getElementById(containerId);
  const min = parseFloat(container.dataset.min);
  const max = parseFloat(container.dataset.max);
  
  let targets = [];
  if (isSingleTarget) {
    targets.push(parseFloat(container.dataset.target));
  } else {
    targets = container.dataset.targets.split(',').map(Number);
  }

  let foundCount = 0;

  container.addEventListener('click', function(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    
    // クリック位置から値を算出（0.01単位で丸める）
    const clickedVal = Math.round((min + ratio * (max - min)) * 100) / 100;
    
    // ターゲットに含まれているか判定
    const targetIndex = targets.findIndex(t => Math.abs(t - clickedVal) < 0.005);

    if (targetIndex !== -1) {
      // 既に配置済みかチェック
      const existingMarker = container.querySelector(`.marker[data-val="${targets[targetIndex]}"]`);
      if (!existingMarker) {
        placeMarker(container, targets[targetIndex], ratio, isSingleTarget);
        foundCount++;
        
        if (isSingleTarget) {
          document.getElementById('msg-stage1').innerText = "大正解！3.45の位置はここだね！";
          unlockStage('stage2', 25);
        } else {
          if (foundCount === targets.length) {
            document.getElementById('msg-stage4').innerText = "完全クリア！すべての場所をみつけました！";
            updateProgress(100);
          }
        }
      }
    } else {
      // 不正解時のフィードバック（優しく）
      const msgId = isSingleTarget ? 'msg-stage1' : 'msg-stage4';
      document.getElementById(msgId).innerText = `おしい！そこは ${clickedVal.toFixed(2)} だよ。`;
      document.getElementById(msgId).style.color = '#f44336';
      setTimeout(() => {
        document.getElementById(msgId).innerText = "";
        document.getElementById(msgId).style.color = '#4caf50';
      }, 2000);
    }
  });
}

function placeMarker(container, value, ratio, showLabel = true) {
  // 正確な比率を再計算して配置
  const min = parseFloat(container.dataset.min);
  const max = parseFloat(container.dataset.max);
  const exactRatio = (value - min) / (max - min);

  const marker = document.createElement('div');
  marker.className = 'marker';
  marker.dataset.val = value;
  marker.style.left = `${exactRatio * 100}%`;
  
  if (showLabel) {
    marker.innerHTML = `<span>${value}</span>`;
  } else {
    // 練習問題の時は丸数字などを出しても良いが、今回は数値
    marker.innerHTML = `<span>${value}</span>`;
  }
  
  container.appendChild(marker);
}

attachNumberLineLogic('nl-stage1', true);
attachNumberLineLogic('nl-stage4', false);


// 入力チェック共通ロジック
function checkInputs(sectionId) {
  const inputs = document.querySelectorAll(`#${sectionId} .ans-input`);
  let allCorrect = true;

  inputs.forEach(input => {
    // 複数の正解パターンを許可（カンマ区切り）
    const validAnswers = input.dataset.ans.split(',');
    if (validAnswers.includes(input.value)) {
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

function unlockStage(stageId, progress) {
  document.getElementById(stageId).classList.remove('disabled');
  updateProgress(progress);
  // 少しスクロールしてあげる
  setTimeout(() => {
    document.getElementById(stageId).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

function updateProgress(percent) {
  document.getElementById('progress-bar').style.width = `${percent}%`;
}

// 各ステージのボタン処理
function checkStage2() {
  if (checkInputs('stage2')) {
    unlockStage('stage3', 50);
  }
}

function checkStage3() {
  if (checkInputs('stage3')) {
    unlockStage('stage4', 75);
  }
}

function checkPracticeAnswers() {
  if (checkInputs('stage4')) {
    document.getElementById('practice-number-line-section').style.display = 'block';
    // 下にスクロール
    setTimeout(() => {
      document.getElementById('practice-number-line-section').scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }
}