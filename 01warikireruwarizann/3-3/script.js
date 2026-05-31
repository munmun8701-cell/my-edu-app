const pool = document.getElementById('pool');
const baskets = document.querySelectorAll('.basket');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');

const TOTAL_BALLS = 24;
const BALLS_PER_BASKET = 4;

// 初期化関数
function init() {
  const existingBalls = pool.querySelectorAll('.ball');
  existingBalls.forEach(ball => ball.remove());
  
  baskets.forEach(bq => {
      const existingBallsInBasket = bq.querySelectorAll('.ball');
      existingBallsInBasket.forEach(ball => ball.remove());
  });

  messageEl.textContent = 'ボールを ドラッグして、4こずつ かごに いれてね。かごは いくつ ひつようかな？';
  messageEl.style.color = '#333';

  // ボールを24個生成
  for (let i = 0; i < TOTAL_BALLS; i++) {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.textContent = '⚽'; // ボールのアイコン
    
    // タッチ＆マウス両対応のドラッグ処理をセット
    setupTouchAndDrag(ball);
    pool.appendChild(ball);
  }
}

// 指（タッチ）とマウスの両方に確実に対応する処理
function setupTouchAndDrag(el) {
  let originalParent = null;

  // タッチ（指）で触ったとき
  el.addEventListener('touchstart', handleStart, { passive: false });
  // マウスでクリックしたとき
  el.addEventListener('mousedown', handleStart);

  function handleStart(e) {
    e.preventDefault(); // 画面のスクロールを防ぐ
    originalParent = el.parentNode;
    el.classList.add('dragging');

    // タッチとマウスで座標の取り方を変える
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    moveAt(clientX, clientY);

    if (e.type.includes('touch')) {
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    } else {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
    }
  }

  function handleMove(e) {
    e.preventDefault();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    moveAt(clientX, clientY);
  }

  function moveAt(clientX, clientY) {
    el.style.left = clientX - el.offsetWidth / 2 + 'px';
    el.style.top = clientY - el.offsetHeight / 2 + 'px';
  }

  function handleEnd(e) {
    if (e.type.includes('touch')) {
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    } else {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    }

    el.classList.remove('dragging');
    el.style.left = '';
    el.style.top = '';

    // 指を離した場所の座標を取得
    let clientX, clientY;
    if (e.type.includes('touch')) {
      // タッチの場合は、最後に指があった場所を取得
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const elemBelow = document.elementFromPoint(clientX, clientY);
    
    if (elemBelow) {
      const dropZone = elemBelow.closest('.drop-zone');
      if (dropZone) {
        // かごの枠には4個までしか入らない制限
        if (dropZone.classList.contains('basket')) {
          const ballCount = Array.from(dropZone.children).filter(c => c.classList.contains('ball')).length;
          
          if (ballCount >= BALLS_PER_BASKET) {
            messageEl.textContent = '1つの かごは 4こまで だよ！';
            messageEl.style.color = '#00695c';
            originalParent.appendChild(el); 
          } else {
            dropZone.appendChild(el);
            messageEl.textContent = 'ボールを ドラッグして、4こずつ かごに いれてね。かごは いくつ ひつようかな？';
            messageEl.style.color = '#333';
          }
        } else {
          dropZone.appendChild(el);
        }
      } else {
        originalParent.appendChild(el);
      }
    } else {
      originalParent.appendChild(el);
    }
    
    checkAnswer();
  }
}

// 正解チェック関数
function checkAnswer() {
  const poolCount = pool.querySelectorAll('.ball').length;
  
  if (poolCount > 0) return;

  let validBasketsCount = 0;
  let isInvalid = false;

  baskets.forEach(bq => {
    const count = bq.querySelectorAll('.ball').length;
    if (count === BALLS_PER_BASKET) {
      validBasketsCount++;
    } else if (count > 0) {
      isInvalid = true; 
    }
  });

  if (!isInvalid && validBasketsCount === (TOTAL_BALLS / BALLS_PER_BASKET)) {
    messageEl.innerHTML = 'せいかい！ 24 ÷ 4 = 6<br>(かごは 6つ だね！)';
    messageEl.style.color = '#2e8b57'; 
  } else {
    messageEl.textContent = 'きちんと 4こずつに なっているか たしかめよう！';
    messageEl.style.color = '#d9534f'; 
  }
}

resetBtn.addEventListener('click', init);
init();