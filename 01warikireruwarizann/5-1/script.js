const poolKouta = document.getElementById('pool-kouta');
const poolShiho = document.getElementById('pool-shiho');
const msgKouta = document.getElementById('msg-kouta');
const msgShiho = document.getElementById('msg-shiho');
const resetBtn = document.getElementById('reset-btn');

// あめを作る関数
function createCandies(container, owner, count) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const candy = document.createElement('div');
    candy.className = 'candy';
    candy.textContent = '🍬';
    candy.dataset.owner = owner; // どっちのあめかを記録

    // タッチ＆マウス両対応のドラッグ処理をセット
    setupTouchAndDrag(candy);
    container.appendChild(candy);
  }
}

// 初期化
function init() {
  createCandies(poolKouta, 'kouta', 6);
  createCandies(poolShiho, 'shiho', 6);
  
  // お盆の中のあめを消す
  document.querySelectorAll('.tray').forEach(zone => {
    Array.from(zone.children).forEach(child => {
      if (child.classList.contains('candy')) child.remove();
    });
  });

  msgKouta.textContent = 'あめを ドラッグして 2人に わけてね。';
  msgKouta.style.color = '#333';
  msgShiho.textContent = 'あめを ドラッグして 2こずつ おいてね。';
  msgShiho.style.color = '#333';
}

// 指（タッチ）とマウスの両方に確実に対応する処理
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
        // 1. こうたのあめは、しほのエリアには置けないようにする
        const zoneOwner = dropZone.dataset.owner;
        const candyOwner = el.dataset.owner;
        
        if (zoneOwner && zoneOwner !== candyOwner) {
          originalParent.appendChild(el);
        } 
        // 2. しほの問題（最大2個まで）の制限ブロック
        else if (dropZone.dataset.max && !dropZone.classList.contains('pool')) {
          const max = parseInt(dropZone.dataset.max);
          const currentCandies = Array.from(dropZone.children).filter(c => c.classList.contains('candy')).length;
          
          if (currentCandies >= max) {
            msgShiho.textContent = '1人に 2こまで だよ！';
            msgShiho.style.color = '#d84315';
            originalParent.appendChild(el);
          } else {
            dropZone.appendChild(el);
          }
        } 
        // 条件をすべてクリアしたら入れる
        else {
          dropZone.appendChild(el);
        }
      } else {
        originalParent.appendChild(el);
      }
    } else {
      originalParent.appendChild(el);
    }
    
    // 正解チェック
    checkKouta();
    checkShiho();
  }
}

// こうたの正解チェック（等分除）
function checkKouta() {
  if (poolKouta.querySelectorAll('.candy').length > 0) {
    msgKouta.textContent = 'あめを ドラッグして 2人に わけてね。';
    msgKouta.style.color = '#333';
    return;
  }
  
  const trays = document.querySelectorAll('.tray[data-owner="kouta"]');
  const count1 = Array.from(trays[0].children).filter(c => c.classList.contains('candy')).length;
  const count2 = Array.from(trays[1].children).filter(c => c.classList.contains('candy')).length;
  
  if (count1 === 3 && count2 === 3) {
    msgKouta.innerHTML = 'せいかい！ 1人分は 3こ ( 6 ÷ 2 = 3 )';
    msgKouta.style.color = '#1565c0';
  } else {
    msgKouta.textContent = 'おなじ かずずつに なっていないよ！';
    msgKouta.style.color = '#c62828';
  }
}

// しほの正解チェック（包含除）
function checkShiho() {
  if (poolShiho.querySelectorAll('.candy').length > 0) {
    msgShiho.textContent = 'あめを ドラッグして 2こずつ おいてね。';
    msgShiho.style.color = '#333';
    return;
  }
  
  const trays = document.querySelectorAll('.tray[data-owner="shiho"]');
  let fullTrays = 0;
  let hasOdd = false;

  trays.forEach(tray => {
    const count = Array.from(tray.children).filter(c => c.classList.contains('candy')).length;
    if (count === 2) fullTrays++;
    else if (count > 0) hasOdd = true; // 1個だけ入っているお盆がある
  });

  if (!hasOdd && fullTrays === 3) {
    msgShiho.innerHTML = 'せいかい！ 3人に わけられたね ( 6 ÷ 2 = 3 )';
    msgShiho.style.color = '#d84315';
  } else {
    msgShiho.textContent = 'きちんと 2こずつ わけてみよう！';
    msgShiho.style.color = '#c62828';
  }
}

resetBtn.addEventListener('click', init);
init();