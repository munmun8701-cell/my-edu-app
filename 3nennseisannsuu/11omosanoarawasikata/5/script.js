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

// 2kg用はかりのSVG生成
function generateScaleGraphics() {
  let circHTML = '';
  
  // 0〜2000gまで、10gきざみでループ
  for (let w = 0; w <= 2000; w += 10) {
    const angle = (w / 2000) * 360 - 90;
    const rad = angle * Math.PI / 180;
    
    let tickLength = 0;
    let strokeWidth = 1;
    let isMajor = false;
    
    // 100g, 50g, 10gのめもり線の長さ調整
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
    
    // 数字の描画 (教科書に寄せてシンプルに)
    if (isMajor && w > 0 && w < 2000) {
      const tx = 200 + 135 * Math.cos(rad);
      const ty = 200 + 135 * Math.sin(rad) + 6;
      
      if (w === 1000) {
        circHTML += `<text x="${tx}" y="${ty}" font-size="20" font-weight="bold" text-anchor="middle" fill="#2c3e50">1kg</text>`;
      } else if (w === 500 || w === 1500) {
        const lbl = w === 1500 ? '1kg500g' : '500g';
        circHTML += `<text x="${tx}" y="${ty}" font-size="14" font-weight="bold" text-anchor="middle" fill="#2c3e50">${lbl}</text>`;
      } else if (w % 200 === 0) {
        // 200, 400, 600, 800 (1kgを超えても同じ数字の並びにする)
        const displayW = w > 1000 ? w - 1000 : w;
        circHTML += `<text x="${tx}" y="${ty}" font-size="16" font-weight="bold" text-anchor="middle" fill="#2c3e50">${displayW}</text>`;
      }
    }
  }
  
  // 0 / 2kg の表記
  circHTML += `<text x="200" y="55" font-size="22" font-weight="bold" text-anchor="middle" fill="#2c3e50">0</text>`;
  circHTML += `<text x="200" y="105" font-size="24" font-weight="bold" text-anchor="middle" fill="#2c3e50">2<tspan font-size="16">kg</tspan></text>`;
  
  // メインはかりに描画
  document.getElementById('scale-ticks').innerHTML = circHTML;

  // はりのSVGパーツ
  const needleSVG = (weight) => {
    const rot = (weight / 2000) * 360;
    return `<g transform="rotate(${rot}, 200, 200)">
              <polygon points="190,200 210,200 200,40" fill="#e74c3c" />
              <circle cx="200" cy="200" r="15" fill="#f1c40f" stroke="#e67e22" stroke-width="3"/>
              <circle cx="200" cy="200" r="5" fill="#333" />
            </g>`;
  };

  // 練習① 書道セット (1kg200g = 1200g)
  const shodoSvg = document.getElementById('shodo-scale');
  shodoSvg.innerHTML = circHTML + needleSVG(1200);

  // 練習② 黒板消しクリーナー (1kg600g = 1600g)
  const cleanerSvg = document.getElementById('cleaner-scale');
  cleanerSvg.innerHTML = circHTML + needleSVG(1600);
}

// スライダー連動アニメーション
const slider = document.getElementById('weight-slider');
const valDisplay = document.getElementById('slider-val');
const kgDisplay = document.getElementById('slider-val-kg');
const needle = document.getElementById('scale-needle-group');

slider.addEventListener('input', function() {
  const w = parseInt(this.value);
  valDisplay.innerText = w;
  
  // kgとgの表記に変換して表示
  const kg = Math.floor(w / 1000);
  const g = w % 1000;
  let textKg = "";
  if(kg > 0) textKg += kg + "kg ";
  textKg += g + "g";
  if(w === 0) textKg = "0kg 0g";
  kgDisplay.innerText = "（" + textKg + "）";
  
  // 針の回転 (0g = 0度, 2000g = 360度)
  const angle = (w / 2000) * 360;
  needle.setAttribute('transform', `rotate(${angle}, 200, 200)`);
});

// 初期化実行
window.onload = generateScaleGraphics;