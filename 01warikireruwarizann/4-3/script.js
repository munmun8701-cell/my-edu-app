const pourBtn = document.getElementById('pour-btn');
const resetBtn = document.getElementById('reset-btn');
const juiceLevel = document.getElementById('juice-level');
const jugLabel = document.getElementById('jug-label');
const cupsContainer = document.getElementById('cups-container');
const messageEl = document.getElementById('message');

const TOTAL_JUICE = 15;
const POUR_AMOUNT = 3;
let currentJuice = TOTAL_JUICE;

// 入れ物の見た目を更新する関数
function updateJugVisuals() {
  const percentage = (currentJuice / TOTAL_JUICE) * 100;
  juiceLevel.style.height = `${percentage}%`;
  jugLabel.textContent = `${currentJuice}dL`;
}

// 初期化関数
function init() {
  currentJuice = TOTAL_JUICE;
  cupsContainer.innerHTML = ''; // コップを空にする
  messageEl.textContent = '15dLの ジュースが あります。「3dL つぐ」ボタンを おしてね。';
  messageEl.style.color = '#333';
  pourBtn.disabled = false;
  updateJugVisuals();
}

// つぐボタンを押したときの処理
pourBtn.addEventListener('click', () => {
  if (currentJuice >= POUR_AMOUNT) {
    // 1. メインのジュースを減らす
    currentJuice -= POUR_AMOUNT;
    updateJugVisuals();

    // 2. コップを追加する
    const wrapper = document.createElement('div');
    wrapper.className = 'cup-wrapper';

    const cup = document.createElement('div');
    cup.className = 'cup';

    const label = document.createElement('div');
    label.className = 'cup-label';
    label.textContent = '3dL';

    wrapper.appendChild(cup);
    wrapper.appendChild(label);
    cupsContainer.appendChild(wrapper);

    // 3. 全部注ぎ終わったかの判定
    if (currentJuice === 0) {
      pourBtn.disabled = true;
      messageEl.innerHTML = 'せいかい！ 15 ÷ 3 = 5<br>（コップは 5こ ひつようだね！）';
      messageEl.style.color = '#e65100';
    } else {
      messageEl.textContent = `のこりは ${currentJuice}dL だよ。もっと つごう！`;
      messageEl.style.color = '#333';
    }
  }
});

// やりなおすボタン
resetBtn.addEventListener('click', init);

// 最初にアプリを起動
init();