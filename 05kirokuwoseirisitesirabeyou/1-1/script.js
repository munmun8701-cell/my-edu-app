// 教科書に合わせた項目の設定
const categories = [
  { name: "休み時間", msg: "ろうかを 歩こう" },
  { name: "始業前・放か後", msg: "しずかに あそぼう" },
  { name: "じゅ業中", msg: "道具を 正しくつかおう" },
  { name: "そうじ時間", msg: "足元に ちゅういしよう" }
];

let counts = [0, 0, 0, 0];

// SVGの「正」の字のパスデータ（教科書の書き順）
const STROKE_PATHS = [
  "M 20,20 L 80,20", // 1画目: 一
  "M 50,20 L 50,80", // 2画目: ｜
  "M 50,50 L 80,50", // 3画目: 右のー
  "M 20,50 L 20,80", // 4画目: 左の｜
  "M 10,80 L 90,80"  // 5画目: 下のー
];

// 画面が読み込まれたら最初に実行される関数
function init() {
  renderCategories();
  updateDisplay();
}

// 画面左側の「正の字を書くエリア」を作る
function renderCategories() {
  const list = document.getElementById('category-list');
  if (!list) return; // HTMLがない場合はエラーを防ぐ
  
  list.innerHTML = categories.map((cat, i) => `
    <div class="cat-card">
      <div class="cat-header">
        <span class="cat-name">${cat.name}</span>
        <div class="btn-group">
          <button class="sub-btn" onclick="subCount(${i})">ー</button>
          <button class="add-btn" onclick="addCount(${i})">＋</button>
        </div>
      </div>
      <div class="sei-area" id="sei-area-${i}"></div>
    </div>
  `).join('');
}

// ＋ボタンが押された時
window.addCount = function(index) {
  counts[index]++;
  updateDisplay();
};

// ーボタンが押された時（間違えた時用）
window.subCount = function(index) {
  if (counts[index] > 0) {
    counts[index]--;
    updateDisplay();
  }
};

// 画面全体の表示を更新する
function updateDisplay() {
  let total = 0;
  let maxCount = -1;
  let topIndex = -1;

  counts.forEach((count, i) => {
    total += count;
    // 一番多い項目を見つける
    if (count > maxCount) {
      maxCount = count;
      topIndex = i;
    }
    
    // 正の字を描画
    const area = document.getElementById(`sei-area-${i}`);
    if (area) {
      area.innerHTML = renderSei(count);
    }
  });

  // 表の数字と合計を更新
  renderTable();
  const totalVal = document.getElementById('total-val');
  if (totalVal) totalVal.innerText = total;

  // ポスターのヒントを更新
  const hintBox = document.getElementById('hint-box');
  if (hintBox) {
    if (total > 0 && maxCount > 0) {
      hintBox.style.display = 'block';
      document.getElementById('top-cat').innerText = categories[topIndex].name;
      document.getElementById('top-msg').innerText = categories[topIndex].msg;
    } else {
      hintBox.style.display = 'none';
    }
  }
}

// 正の字をSVGで作る関数
function renderSei(count) {
  const fullSei = Math.floor(count / 5); // 完成した「正」の数
  const remainder = count % 5;           // 余りの画数
  let html = '';

  for (let i = 0; i < fullSei; i++) {
    html += createSeiSvg(5);
  }
  
  if (remainder > 0 || count === 0) {
    html += createSeiSvg(remainder);
  }
  
  return html;
}

function createSeiSvg(activeStrokes) {
  let paths = STROKE_PATHS.map((path, i) => 
    `<path d="${path}" class="sei-stroke ${i < activeStrokes ? 'active' : ''}" />`
  ).join('');
  return `<svg class="sei-box" viewBox="0 0 100 100">${paths}</svg>`;
}

// 画面右側の「表」を作る
function renderTable() {
  const body = document.getElementById('table-body');
  if (!body) return;
  
  body.innerHTML = categories.map((cat, i) => `
    <tr>
      <td>${cat.name}</td>
      <td class="count-cell">${counts[i]}</td>
    </tr>
  `).join('');
}

// リセットボタンが押された時
window.resetAll = function() {
  if (confirm('ぜんぶ 0 にもどしますか？')) {
    counts = [0, 0, 0, 0];
    updateDisplay();
  }
};

// ページの読み込みが終わったらアプリを起動する（重要）
document.addEventListener('DOMContentLoaded', init);