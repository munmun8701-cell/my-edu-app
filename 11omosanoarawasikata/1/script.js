// --- 共通：ヒントの表示切り替え ---
function toggleHint(hintId) {
  const hintBox = document.getElementById(hintId);
  if (hintBox.style.display === 'block') {
    hintBox.style.display = 'none';
  } else {
    hintBox.style.display = 'block';
  }
}

// --- ① 大きさと重さ のロジック ---
function checkWeight(type) {
  const resultDiv = document.getElementById('result1');
  if (type === 'dodge') {
    resultDiv.innerHTML = "「ふわり…」<br>大きいのに、意外と軽いね！";
    resultDiv.style.color = "#3498db";
  } else if (type === 'soft') {
    resultDiv.innerHTML = "「ずっしり！」<br>小さいのに、中身がつまっていて重いぞ！";
    resultDiv.style.color = "#e74c3c";
  }
}

// --- ② 形と重さ のロジック ---
function runClayExperiment() {
  const resultDiv = document.getElementById('result2');
  resultDiv.innerHTML = "てんびんが つりあった！<br>形がかわっても、重さは【かわらない】んだね。";
  resultDiv.style.color = "#27ae60";
}

// --- ③ てんびんマスター のロジック ---
let leftCupData = null;
let rightCupData = null;

function selectItem(element, id, weight) {
  // 左カップが空なら左へ
  if (!leftCupData) {
    leftCupData = { id, weight, elementHTML: element.innerHTML, originalNode: element };
    document.getElementById('left-cup').innerHTML = element.innerHTML;
    element.classList.add('hidden');
    updateScale();
  } 
  // 左が埋まっていて右が空なら右へ
  else if (!rightCupData) {
    rightCupData = { id, weight, elementHTML: element.innerHTML, originalNode: element };
    document.getElementById('right-cup').innerHTML = element.innerHTML;
    element.classList.add('hidden');
    updateScale();
  }
  // 両方埋まっている場合は何もしない
}

function emptyCup(side) {
  if (side === 'left' && leftCupData) {
    leftCupData.originalNode.classList.remove('hidden');
    document.getElementById('left-cup').innerHTML = '左';
    leftCupData = null;
    updateScale();
  } else if (side === 'right' && rightCupData) {
    rightCupData.originalNode.classList.remove('hidden');
    document.getElementById('right-cup').innerHTML = '右';
    rightCupData = null;
    updateScale();
  }
}

function updateScale() {
  const beam = document.getElementById('scale-beam');
  const leftWeight = leftCupData ? leftCupData.weight : 0;
  const rightWeight = rightCupData ? rightCupData.weight : 0;
  
  // 重さの差に応じて角度を計算 (最大傾きを20度とする)
  let angle = 0;
  if (leftWeight > rightWeight) {
    angle = -15; // 左が重いと反時計回り
  } else if (rightWeight > leftWeight) {
    angle = 15;  // 右が重いと時計回り
  }
  
  beam.style.transform = `rotate(${angle}deg)`;
  
  // カップを常に垂直に保つための逆回転（おまけのこだわり表現）
  const cups = document.querySelectorAll('.scale-string');
  cups.forEach(cup => {
    cup.style.transform = `rotate(${-angle}deg)`;
  });
}