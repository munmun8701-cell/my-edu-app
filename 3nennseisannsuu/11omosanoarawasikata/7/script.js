// 全角→半角変換と正誤判定
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

// --- シミュレーターロジック ---

// 動物のデータ定義
const animalData = {
  childRhino: { name: '子サイ (1000kg)', blocks: [{type: '1000', label: '1000kg'}] },
  parentRhino: { name: '親サイ (3000kg)', blocks: [{type: '1000', label: '1000kg'}, {type: '1000', label: '1000kg'}, {type: '1000', label: '1000kg'}] },
  elephant: { name: 'ゾウ (6000kg)', blocks: [{type: '1000', label: '1000kg'}, {type: '1000', label: '1000kg'}, {type: '1000', label: '1000kg'}, {type: '1000', label: '1000kg'}, {type: '1000', label: '1000kg'}, {type: '1000', label: '1000kg'}] },
  hippo: { name: 'カバ (2100kg)', blocks: [{type: '1000', label: '1000kg'}, {type: '1000', label: '1000kg'}, {type: 'small', label: '100kg'}] }
};

let currentAnimalId = null;
let isConverted = false;

// 動物を選択したときの処理
function selectAnimal(animalId) {
  currentAnimalId = animalId;
  isConverted = false;
  
  // ボタンのアクティブ状態を更新
  document.querySelectorAll('.animal-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
  
  // 表示エリアの更新
  const data = animalData[animalId];
  document.getElementById('animal-name-display').innerText = data.name;
  
  const container = document.getElementById('weight-blocks');
  container.innerHTML = ''; // クリア
  
  // ブロックの生成
  data.blocks.forEach(blockInfo => {
    const div = document.createElement('div');
    div.className = `mass-block block-${blockInfo.type === 'small' ? 'small' : '1000kg'}`;
    div.innerText = blockInfo.label;
    
    // アニメーション用のデータ属性を付与
    if (blockInfo.type === '1000') {
      div.setAttribute('data-convertible', 'true');
    }
    
    container.appendChild(div);
  });
  
  // 変換ボタンを有効化
  document.getElementById('convert-btn').disabled = false;
  document.getElementById('convert-btn').innerText = '✨ 1000kg を「1t(トン)」にまとめる ✨';
}

// 単位変換アニメーション処理
function convertUnits() {
  if (!currentAnimalId || isConverted) return;
  
  const blocks = document.querySelectorAll('.mass-block[data-convertible="true"]');
  
  blocks.forEach((block, index) => {
    // 少し時間差をつけてアニメーションさせる
    setTimeout(() => {
      block.classList.remove('block-1000kg');
      block.classList.add('block-1t');
      block.innerText = '1t';
    }, index * 150); // 150msごとに変換
  });
  
  isConverted = true;
  
  // ボタンのテキストと状態を変更
  const btn = document.getElementById('convert-btn');
  btn.innerText = '✅ t(トン) にまとまりました！';
  btn.disabled = true;
}