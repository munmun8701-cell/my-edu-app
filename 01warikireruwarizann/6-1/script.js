const pool = document.getElementById('pool');
const plates = document.querySelectorAll('.plate');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const eqTotal = document.getElementById('eq-total');
const eqAnswer = document.getElementById('eq-answer');
const zeroBtn = document.getElementById('zero-btn');

let currentProblem = 8; // 8, 4, 0 のいずれか

// タブ切り替え処理
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentProblem = parseInt(btn.dataset.problem);
    init();
  });
});

// 0こボタンの処理
zeroBtn.addEventListener('click', () => {
  eqTotal.textContent = '0';
  eqAnswer.textContent = '0';
  messageEl.innerHTML = 'せいかい！ クッキーがないから、お皿には 1こも のらないね。<br>0をわっても 答えは 0 だよ！';
  messageEl.style.color = '#2e8b57';
  zeroBtn.style.display = 'none';
});

// 初期化
function init() {
  pool.innerHTML = '';
  plates.forEach(plate => plate.innerHTML = '');
  eqTotal.textContent = '?';
  eqAnswer.textContent = '?';
  
  if (currentProblem === 0) {
    messageEl.innerHTML = 'クッキーが はこに 1こも 入っていないよ。<br>どうなるかな？';
    messageEl.style.color = '#d9534f';
    zeroBtn.style.display = 'inline-block';
    pool.style.minHeight = '100px';
  } else {
    messageEl.innerHTML = `クッキーを ドラッグして、<br>4つの おさらに ${currentProblem/4}こずつ わけてね。`;
    messageEl.style.color = '#333';
    zeroBtn.style.display = 'none';

    // クッキーを生成
    for (let i = 0; i < currentProblem; i++) {
      const cookie = document.createElement('div');
      cookie.classList.add('cookie');
      cookie.textContent = '🍪';
      setupTouchAndDrag(cookie);
      pool.appendChild(cookie);
    }
  }
}

// ★修正：指（タッチ）とマウスに確実に対応する処理
function setupTouchAndDrag(el) {
  let originalParent = null;

  el.addEventListener('touchstart', handleStart, { passive: false });
  el.addEventListener('mousedown', handleStart);

  function handleStart(e) {
    e.preventDefault();
    originalParent = el.parentNode;
    el.classList.add('dragging');

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    moveAt(clientX, clientY);

    if (e.type.includes('touch')) {
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('touchcancel', handleEnd); // タッチが途切れた時もカバー
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
      document.removeEventListener('touchcancel', handleEnd);
    } else {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    }

    el.classList.remove('dragging');
    el.style.left = ''; 
    el.style.top = '';

    let clientX, clientY;
    if (e.type.includes('touch')) {
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
        if (dropZone.classList.contains('plate')) {
          const max = currentProblem / 4;
          const count = dropZone.children.length;
          if (count >= max) {
            originalParent.appendChild(el);
          } else {
            dropZone.appendChild(el);
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
  if (currentProblem === 0) return;
  if (pool.children.length > 0) return;

  const targetPerPlate = currentProblem / 4;
  let validPlatesCount = 0;
  let isInvalid = false;

  plates.forEach(plate => {
    const count = plate.children.length;
    if (count === targetPerPlate) {
      validPlatesCount++;
    } else if (count > 0) {
      isInvalid = true;
    }
  });

  if (!isInvalid && validPlatesCount === 4) {
    eqTotal.textContent = currentProblem;
    eqAnswer.textContent = targetPerPlate;
    messageEl.innerHTML = `せいかい！ 1人分は ${targetPerPlate}こ だね！`;
    messageEl.style.color = '#2e8b57';
  }
}

resetBtn.addEventListener('click', init);
init(); // 起動