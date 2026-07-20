// 全角→半角変換と自動判定
function toHalfWidth(str) {
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).trim();
}

document.querySelectorAll('input[type="text"]').forEach(input => {
  input.addEventListener('blur', function() {
    let val = toHalfWidth(this.value);
    this.value = val;

    const answer = this.getAttribute('data-answer');
    if (answer) {
      if (val === answer) {
        this.classList.add('correct-input');
      } else {
        this.classList.remove('correct-input');
      }
    }
  });
});

function toggleHint(hintId) {
  const hintBox = document.getElementById(hintId);
  hintBox.style.display = hintBox.style.display === 'block' ? 'none' : 'block';
}

// ツール切り替え機能
function switchTool(toolId) {
  // ボタンのアクティブ状態切り替え
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // コンテンツの切り替え
  document.querySelectorAll('.tool-content').forEach(content => content.style.display = 'none');
  document.getElementById('tool-' + toolId).style.display = 'block';
}

// ツール1: 線分図アニメーション
function combineBars() {
  const itemBar = document.getElementById('bar-item');
  // 箱(25%)のすぐ右(left: 25%)に移動させる
  itemBar.style.left = '25%';
}
function resetBars() {
  const itemBar = document.getElementById('bar-item');
  // 画面外(右)に戻す
  itemBar.style.left = '100%';
}

// ツール3: はかり生成とアニメーション
let currentWeight = 0;
const MAX_WEIGHT = 2000;

function generateScaleGraphics() {
  let circHTML = '';
  // 0〜2000gまで、10gきざみでループ（前時のコードを利用）
  for (let w = 0; w <= MAX_WEIGHT; w += 10) {
    const angle = (w / MAX_WEIGHT) * 360 - 90;
    const rad = angle * Math.PI / 180;
    
    let tickLength = 0;
    let strokeWidth = 1;
    let isMajor = false;
    
    if (w % 100 === 0) {
      tickLength = 20; strokeWidth = 3; isMajor = true;
    } else if (w % 50 === 0) {
      tickLength = 12; strokeWidth = 2;
    } else {
      tickLength = 6; strokeWidth = 1;
    }
    
    const cx1 = 200 + 175 * Math.cos(rad);
    const cy1 = 200 + 175 * Math.sin(rad);
    const cx2 = 200 + (175 - tickLength) * Math.cos(rad);
    const cy2 = 200 + (175 - tickLength) * Math.sin(rad);
    
    circHTML += `<line x1="${cx1}" y1="${cy1}" x2="${cx2}" y2="${cy2}" stroke="#333" stroke-width="${strokeWidth}" />`;
    
    if (isMajor && w > 0 && w < MAX_WEIGHT) {
      const tx = 200 + 135 * Math.cos(rad);
      const ty = 200 + 135 * Math.sin(rad) + 6;
      
      if (w === 1000) {
        circHTML += `<text x="${tx}" y="${ty}" font-size="20" font-weight="bold" text-anchor="middle" fill="#2c3e50">1kg</text>`;
      } else if (w === 500 || w === 1500) {
        const lbl = w === 1500 ? '1kg500g' : '500g';
        circHTML += `<text x="${tx}" y="${ty}" font-size="14" font-weight="bold" text-anchor="middle" fill="#2c3e50">${lbl}</text>`;
      } else if (w % 200 === 0) {
        const displayW = w > 1000 ? w - 1000 : w;
        circHTML += `<text x="${tx}" y="${ty}" font-size="16" font-weight="bold" text-anchor="middle" fill="#2c3e50">${displayW}</text>`;
      }
    }
  }
  circHTML += `<text x="200" y="55" font-size="22" font-weight="bold" text-anchor="middle" fill="#2c3e50">0</text>`;
  circHTML += `<text x="200" y="105" font-size="24" font-weight="bold" text-anchor="middle" fill="#2c3e50">2<tspan font-size="16">kg</tspan></text>`;
  
  document.getElementById('scale-ticks').innerHTML = circHTML;
}

function updateScaleDisplay() {
  const needle = document.getElementById('scale-needle-group');
  const valDisplay = document.getElementById('scale-val');
  
  // 針の回転
  const angle = (currentWeight / MAX_WEIGHT) * 360;
  needle.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
  needle.setAttribute('transform', `rotate(${angle}, 200, 200)`);
  
  valDisplay.innerText = currentWeight;
}

function addWeight(w) {
  if (currentWeight + w <= MAX_WEIGHT) {
    currentWeight += w;
    updateScaleDisplay();
  }
}

function resetWeight() {
  currentWeight = 0;
  updateScaleDisplay();
}

// ひき算シミュレーター（スライダー連動）
const subSlider = document.getElementById('subtraction-slider');
const maoBar = document.getElementById('mao-bar');
const dogBar = document.getElementById('dog-bar');

subSlider.addEventListener('input', function() {
  const percent = this.value; // 0 to 100
  // スライダーを動かすと、まおさんのバーが徐々に消え（あるいは縮み）、犬の重さが際立つギミック
  const opacity = 1 - (percent / 100);
  maoBar.style.opacity = opacity;
  
  if (percent == 100) {
    dogBar.innerHTML = "犬<br>5kg 100g";
    dogBar.style.backgroundColor = "#8e44ad";
  } else {
    dogBar.innerHTML = "犬<br>？kg ？g";
    dogBar.style.backgroundColor = "#9b59b6";
  }
});

// 初期化実行
window.onload = function() {
  generateScaleGraphics();
};