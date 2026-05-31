const pool = document.getElementById('pool');
const trays = document.querySelectorAll('.tray');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');

const TOTAL_FLOWERS = 12;

// 初期化関数
function init() {
  pool.innerHTML = '';
  trays.forEach(tray => tray.innerHTML = '');
  messageEl.textContent = 'おはじきを ドラッグして おさらに わけてね。';
  messageEl.style.color = '#d9534f';

  for (let i = 0; i < TOTAL_FLOWERS; i++) {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.textContent = '🌸';
    
    // タッチ＆ドラッグの仕組みをセット
    setupPointerDrag(flower);
    pool.appendChild(flower);
  }
}

// タッチ＆ドラッグを処理する専用関数
function setupPointerDrag(el) {
  let originalParent = null;

  // 指（またはマウス）で押したとき
  el.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    originalParent = el.parentNode;

    // 掴んでいる最中のデザインに変更
    el.classList.add('dragging');

    // 最初から指の中心にくるように移動
    moveAt(e.clientX, e.clientY);

    // 画面のどこをなぞってもついてくるように登録
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  });

  // 指を動かしているとき
  function onPointerMove(e) {
    moveAt(e.clientX, e.clientY);
  }

  // おはじきを指の座標へ移動させる計算
  function moveAt(clientX, clientY) {
    el.style.left = clientX - el.offsetWidth / 2 + 'px';
    el.style.top = clientY - el.offsetHeight / 2 + 'px';
  }

  // 指を離したとき
  function onPointerUp(e) {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    // デザインを元に戻す
    el.classList.remove('dragging');
    el.style.left = '';
    el.style.top = '';

    // 指を離した場所の下に「お皿（drop-zone）」があるかチェック
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    
    if (elemBelow) {
      const dropZone = elemBelow.closest('.drop-zone');
      if (dropZone) {
        // お皿、またはおはじき置き場の上で離したらそこに入れる
        dropZone.appendChild(el);
      } else {
        // 何もない場所で離したら元の場所に戻す
        originalParent.appendChild(el);
      }
    } else {
      originalParent.appendChild(el);
    }
    
    // 答え合わせ
    checkAnswer();
  }
}

// 正解チェック関数
function checkAnswer() {
  const poolCount = pool.children.length;
  
  if (poolCount > 0) {
    messageEl.textContent = 'すべてのおはじきを おさらに わけてね。';
    messageEl.style.color = '#333';
    return;
  }

  let isCorrect = true;
  trays.forEach(tray => {
    if (tray.children.length !== 4) {
      isCorrect = false;
    }
  });

  if (isCorrect) {
    messageEl.textContent = 'せいかい！ 12 ÷ 3 = 4（1つのおさらに 4こ だね！）';
    messageEl.style.color = '#5cb85c';
  } else {
    messageEl.textContent = 'おなじ かずずつ に なるように わけよう！';
    messageEl.style.color = '#d9534f';
  }
}

resetBtn.addEventListener('click', init);
init();