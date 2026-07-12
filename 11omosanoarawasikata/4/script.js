// --- 共通：全角→半角変換と自動判定 ---
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

// --- はかりと数直線のSVG自動生成 ---
function generateScaleGraphics() {
  const circTicks = document.getElementById('scale-ticks');
  const strTicks = document.getElementById('straight-ticks');
  
  let circHTML = '';
  let strHTML = '';
  
  // 0〜1000gまで、5gきざみでループ (200回)
  for (let w = 0; w <= 1000; w += 5) {
    // 【円形はかりの計算】
    // 0gが真上(-90度)。1000gで360度一周。
    const angle = (w / 1000) * 360 - 90;
    const rad = angle * Math.PI / 180;
    
    // 【直線はかりの計算】
    // 0〜1000を、SVGのwidth 0〜1000 にマッピング（1g = 1pxでピッタリ）
    const x = w;
    
    let tickLengthCirc = 0;
    let tickLengthStr = 0;
    let strokeWidth = 1;
    let isMajor = false;
    
    if (w % 100 === 0) {
      tickLengthCirc = 25; tickLengthStr = 20; strokeWidth = 3; isMajor = true;
    } else if (w % 50 === 0) {
      tickLengthCirc = 15; tickLengthStr = 12; strokeWidth = 2;
    } else {
      tickLengthCirc = 8; tickLengthStr = 6; strokeWidth = 1;
    }
    
    // 円形のめもり線描画
    const cx1 = 200 + 175 * Math.cos(rad);
    const cy1 = 200 + 175 * Math.sin(rad);
    const cx2 = 200 + (175 - tickLengthCirc) * Math.cos(rad);
    const cy2 = 200 + (175 - tickLengthCirc) * Math.sin(rad);
    
    circHTML += `<line x1="${cx1}" y1="${cy1}" x2="${cx2}" y2="${cy2}" stroke="#333" stroke-width="${strokeWidth}" />`;
    
    // 直線のめもり線描画
    strHTML += `<line x1="${x}" y1="40" x2="${x}" y2="${40 - tickLengthStr}" stroke="#333" stroke-width="${strokeWidth}" />`;
    
    // 100g単位のテキスト描画
    if (isMajor && w < 1000) { // 1000は0と重なるため円形では少し調整が必要ですが今回はシンプルに
      const txCirc = 200 + 130 * Math.cos(rad);
      const tyCirc = 200 + 130 * Math.sin(rad) + 6; // +6は縦位置微調整
      circHTML += `<text x="${txCirc}" y="${tyCirc}" font-size="18" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#2c3e50">${w}</text>`;
      strHTML += `<text x="${x}" y="70" font-size="16" font-family="sans-serif" text-anchor="middle" fill="#2c3e50">${w}</text>`;
    }
    if (w === 1000) {
        strHTML += `<text x="${x}" y="70" font-size="16" font-family="sans-serif" text-anchor="middle" fill="#2c3e50">1000</text>`;
    }
  }
  
  // 0gと1000gの特別配置（円形）
  circHTML += `<text x="200" y="55" font-size="22" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#2c3e50">0</text>`;
  circHTML += `<text x="200" y="110" font-size="26" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#2c3e50">1000<tspan font-size="16">g</tspan></text>`;
  
  circTicks.innerHTML = circHTML;
  strTicks.innerHTML = strHTML;
  
  // --- 拡大数直線の描画 (0〜50g) ---
  const zoomTicks = document.getElementById('zoom-ticks');
  let zoomHTML = '';
  // 50gを幅460px(20から480)に割り当て。1g = 460/50 = 9.2px
  for (let w = 0; w <= 50; w += 5) {
    const zx = 20 + (w * 9.2);
    let zLen = (w % 50 === 0) ? 25 : (w % 10 === 0 ? 15 : 10);
    let zWidth = (w % 50 === 0) ? 3 : 2;
    zoomHTML += `<line x1="${zx}" y1="50" x2="${zx}" y2="${50 - zLen}" stroke="#e91e63" stroke-width="${zWidth}" />`;
    if (w === 0 || w === 50) {
      zoomHTML += `<text x="${zx}" y="20" font-size="20" font-weight="bold" text-anchor="middle" fill="#333">${w}</text>`;
    }
  }
  zoomTicks.innerHTML = zoomHTML;

  // --- 練習問題用スケール（250g固定）のコピーと設定 ---
  const practiceSvg = document.getElementById('practice-scale');
  const mainSvgContent = document.getElementById('circular-scale').innerHTML;
  practiceSvg.innerHTML = mainSvgContent;
  // ID重複を避けるための処理は簡易化し、針の角度だけ250g（90度）に設定
  practiceSvg.querySelector('#scale-needle-group').setAttribute('transform', 'rotate(90, 200, 200)');
}

// --- スライダー連動アニメーション ---
const slider = document.getElementById('weight-slider');
const valDisplay = document.getElementById('slider-val');
const needle = document.getElementById('scale-needle-group');
const straightMarker = document.getElementById('straight-marker');

slider.addEventListener('input', function() {
  const w = parseInt(this.value);
  valDisplay.innerText = w;
  
  // 針の回転 (0g = 0度, 1000g = 360度)
  const angle = (w / 1000) * 360;
  needle.setAttribute('transform', `rotate(${angle}, 200, 200)`);
  
  // 直線マーカーの移動 (1g = 1px)
  straightMarker.setAttribute('transform', `translate(${w}, 0)`);
});

// 初期化実行
window.onload = generateScaleGraphics;