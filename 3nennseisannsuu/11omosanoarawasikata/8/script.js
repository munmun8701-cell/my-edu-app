// 全角→半角変換（数字およびアルファベット対応）
function toHalfWidth(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).trim().toLowerCase(); // 単位入力のため小文字化も行う
}

document.querySelectorAll('input[type="text"]').forEach(input => {
  input.addEventListener('blur', function() {
    let val = toHalfWidth(this.value);
    this.value = val;

    const answer = this.getAttribute('data-answer');
    if (answer) {
      if (val === answer.toLowerCase()) {
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
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.tool-content').forEach(content => content.style.display = 'none');
  document.getElementById('tool-' + toolId).style.display = 'block';
}

// 魔法のマシーン アニメーション
function runPrefixMachine(type) {
  const resultDiv = document.getElementById('machine-result');
  
  if (type === 'k') {
    resultDiv.innerHTML = '✨ 1000 m (1000倍になった！) ✨';
    resultDiv.style.color = '#e74c3c';
  } else if (type === 'm') {
    // 1000mmからmを取る想定の表現
    document.getElementById('machine-base').innerText = 'mm';
    resultDiv.innerHTML = '✨ 1 m (1000こ集まって1になった！) ✨';
    resultDiv.style.color = '#9b59b6';
    
    // 少ししたら元に戻す
    setTimeout(() => {
      document.getElementById('machine-base').innerText = 'm';
    }, 3000);
  }
}

// 2kg用はかりのSVG生成（たしかめよう用）
const MAX_WEIGHT = 2000;
const markersData = [
  { w: 300, label: 'ア' },
  { w: 950, label: 'イ' },
  { w: 1450, label: 'ウ' },
  { w: 1700, label: 'エ' }
];

function generateReviewScale() {
  let circHTML = '';
  
  // めもり線の描画
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
        circHTML += `<text x="${tx}" y="${ty}" font-size="14" font-weight="bold" text-anchor="middle" fill="#2c3e50">500g</text>`;
      } else if (w % 200 === 0) {
        const displayW = w > 1000 ? w - 1000 : w;
        circHTML += `<text x="${tx}" y="${ty}" font-size="16" font-weight="bold" text-anchor="middle" fill="#2c3e50">${displayW}</text>`;
      }
    }
  }
  circHTML += `<text x="200" y="55" font-size="22" font-weight="bold" text-anchor="middle" fill="#2c3e50">0</text>`;
  circHTML += `<text x="200" y="105" font-size="24" font-weight="bold" text-anchor="middle" fill="#2c3e50">2<tspan font-size="16">kg</tspan></text>`;
  
  document.getElementById('scale-ticks-review').innerHTML = circHTML;

  // ア〜エのマーカー描画
  let markerHTML = '';
  markersData.forEach(m => {
    const angle = (m.w / MAX_WEIGHT) * 360 - 90;
    const rad = angle * Math.PI / 180;
    // めもりの外側に配置
    const tx = 200 + 195 * Math.cos(rad);
    const ty = 200 + 195 * Math.sin(rad) + 5;
    
    markerHTML += `<circle cx="${tx}" cy="${ty-5}" r="12" fill="#e84393" />`;
    markerHTML += `<text x="${tx}" y="${ty}" font-size="14" font-weight="bold" text-anchor="middle" fill="#fff">${m.label}</text>`;
  });
  document.getElementById('scale-markers').innerHTML = markerHTML;
}

// スライダー連動とはかりの正誤判定
const slider = document.getElementById('review-slider');
const valDisplay = document.getElementById('review-val');
const needle = document.getElementById('scale-needle-review');
const hitMsg = document.getElementById('marker-hit-msg');

slider.addEventListener('input', function() {
  const w = parseInt(this.value);
  valDisplay.innerText = w;
  
  const angle = (w / MAX_WEIGHT) * 360;
  needle.setAttribute('transform', `rotate(${angle}, 200, 200)`);
  
  // マーカー位置に一致したかチェック
  const hit = markersData.find(m => m.w === w);
  if (hit) {
    hitMsg.innerText = `🎉 「${hit.label}」の場所にぴったり！`;
  } else {
    hitMsg.innerText = '';
  }
});

// 初期化実行
window.onload = function() {
  generateReviewScale();
};