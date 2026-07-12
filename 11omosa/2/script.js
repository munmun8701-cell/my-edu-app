// 教科書に基づく正解データ（重さの数値）
const weightData = {
  glue: { block: 68, coin: 32, icon: '🧴' },
  scissors: { block: 51, coin: 24, icon: '✂️' },
  battery: { block: 43, coin: 20, icon: '🔋' }
};

const unitIcons = {
  block: '🧱',
  coin: '🪙'
};

let currentCount = 0;
let targetWeight = 0;

// 初期化・リセット処理
function resetScale() {
  currentCount = 0;
  
  const itemKey = document.getElementById('item-select').value;
  const unitKey = document.getElementById('unit-select').value;
  
  // ターゲットとなる正解の数を取得
  targetWeight = weightData[itemKey][unitKey];
  
  // アイコンの更新
  document.getElementById('current-item-icon').innerText = weightData[itemKey].icon;
  document.getElementById('current-unit-icon').innerText = unitIcons[unitKey];
  
  updateDisplay();
}

// 単位を追加する処理
function addUnit(amount) {
  currentCount += amount;
  updateDisplay();
}

// 画面の更新（てんびんの傾きとメッセージ）
function updateDisplay() {
  document.getElementById('unit-count').innerText = currentCount;
  
  const beam = document.getElementById('scale-beam');
  const feedback = document.getElementById('scale-feedback');
  
  // てんびんの角度計算（最大傾きを20度とする）
  let angle = 0;
  
  if (currentCount === 0) {
    angle = -20; // 左（はかるもの）が完全に重い
    feedback.innerText = "右のカップにもとにするものを入れてね。";
    feedback.style.color = "#333";
  } else if (currentCount < targetWeight) {
    // 近づくにつれて傾きが緩やかになる
    angle = -20 + (currentCount / targetWeight) * 15; 
    feedback.innerText = "まだ左のほうが重いみたい。もっと入れてみよう。";
    feedback.style.color = "#e67e22";
  } else if (currentCount > targetWeight) {
    angle = 20; // 入れすぎた場合は右に傾く
    feedback.innerText = "おっと！入れすぎて右が重くなっちゃった！";
    feedback.style.color = "#e74c3c";
  } else {
    angle = 0; // ピッタリつりあう
    feedback.innerHTML = "🎉 <b>つりあった！</b> この数を表に書き写そう！";
    feedback.style.color = "#27ae60";
  }
  
  // アニメーション適用
  beam.style.transform = `rotate(${angle}deg)`;
  
  // カップが常に垂直になるように逆回転
  const strings = document.querySelectorAll('.scale-string');
  strings.forEach(str => {
    str.style.transform = `rotate(${-angle}deg)`;
  });
}

// ヒントの表示切り替え
function toggleHint(hintId) {
  const hintBox = document.getElementById(hintId);
  hintBox.style.display = hintBox.style.display === 'block' ? 'none' : 'block';
}

// 全角数字を半角数字に変換する補助機能（表の入力用）
document.querySelectorAll('.table-input').forEach(input => {
  input.addEventListener('blur', function() {
    // 全角を半角に変換
    let val = this.value.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    this.value = val;
    
    // オプション：正解判定を入れる場合はここで処理可能
    // if(val == this.getAttribute('data-answer')) { this.style.backgroundColor = '#eafaf1'; }
  });
});

// 起動時の初期化
window.onload = resetScale;