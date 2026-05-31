const mainRibbon = document.getElementById('main-ribbon');
const mainLabel = document.getElementById('main-label');
const piecesContainer = document.getElementById('pieces-container');
const messageEl = document.getElementById('message');
const cutBtn = document.getElementById('cut-btn');
const resetBtn = document.getElementById('reset-btn');

const TOTAL_LENGTH = 24;
const CUT_LENGTH = 8;
let currentLength = TOTAL_LENGTH;

// 初期化関数
function init() {
  currentLength = TOTAL_LENGTH;
  
  // 見た目をリセット
  mainRibbon.style.width = '100%';
  mainRibbon.style.display = 'flex';
  mainLabel.textContent = `${currentLength}cm`;
  piecesContainer.innerHTML = '';
  
  messageEl.textContent = '24cmの リボンが あります。「8cm きる」ボタンを おしてね。';
  messageEl.style.color = '#333';
  cutBtn.disabled = false;
}

// 切るボタンを押したときの処理
cutBtn.addEventListener('click', () => {
  if (currentLength >= CUT_LENGTH) {
    // 1. メインの長さを減らす
    currentLength -= CUT_LENGTH;
    
    // 2. メインリボンの見た目（幅）を更新
    const percentage = (currentLength / TOTAL_LENGTH) * 100;
    mainRibbon.style.width = `${percentage}%`;
    
    if (currentLength > 0) {
      mainLabel.textContent = `${currentLength}cm`;
    } else {
      mainRibbon.style.display = 'none'; // 0cmになったら隠す
    }

    // 3. 切り取ったリボンを下に追加する
    const piece = document.createElement('div');
    piece.className = 'piece';
    piece.textContent = '8cm';
    piecesContainer.appendChild(piece);

    // 4. 全部切り終わったかの判定
    if (currentLength === 0) {
      cutBtn.disabled = true;
      messageEl.innerHTML = 'せいかい！ 24 ÷ 8 = 3<br>（3本に なったね！）';
      messageEl.style.color = '#c71585';
    } else {
      messageEl.textContent = `のこりは ${currentLength}cm だよ。もっと きろう！`;
      messageEl.style.color = '#333';
    }
  }
});

// やりなおすボタン
resetBtn.addEventListener('click', init);

// 最初にアプリを起動
init();