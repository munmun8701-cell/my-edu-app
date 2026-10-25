// 全角数字を半角に変換
function toHalfWidth(str) {
  if (!str) return "";
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// ミッションのデータ
const missions = [
  { type: 'cake', total: 23, perGroup: 4, q: 5, r: 3, itemName: 'ケーキ', groupName: '箱', btnAddText: '📦 新しい箱を もってくる', ansCheckFunc: checkMission1Final },
  { type: 'tire', total: 30, perGroup: 4, q: 7, r: 2, itemName: 'タイヤ', groupName: '車', btnAddText: '🚗 新しい車を もってくる', ansCheckFunc: checkMission2Final }
];

let currMIdx = 0;
let currentM = missions[currMIdx];
let poolItems = 0;
let groupItems = []; 
let step2Unlocked = false;

// DOM要素
const els = {
  body: document.body,
  app: document.getElementById('app'),
  header: document.querySelector('header'),
  visualizer: document.querySelector('.visualizer'),
  poolNum: document.getElementById('pool-num'),
  itemTitle: document.getElementById('item-title'),
  groupTitle: document.getElementById('group-title'),
  pool: document.getElementById('pool'),
  groups: document.getElementById('groups'),
  
  btnAuto: document.getElementById('btn-auto-group'),
  btnReset: document.getElementById('btn-reset-items'),
  btnAddGroup: document.getElementById('btn-add-group'),
  
  progText: document.getElementById('progress-text')
};

function loadMission(idx) {
  currMIdx = idx;
  currentM = missions[idx];
  poolItems = currentM.total;
  groupItems = Array(currentM.q).fill(0); // 最初のグループ数は「商」の数
  step2Unlocked = false;
  
  // テキスト・テーマの更新
  els.progText.textContent = `ミッション ${idx + 1} / 2`;
  els.itemTitle.textContent = `${currentM.itemName}（ぜんぶで ${currentM.total} こ）`;
  els.groupTitle.innerHTML = `<ruby>${currentM.groupName}<rt>${currentM.type==='cake'?'はこ':'くるま'}</rt></ruby>（1${currentM.type==='cake'?'箱':'台'}に ${currentM.perGroup}こ まで）`;
  els.btnAddGroup.textContent = currentM.btnAddText;
  
  if (currentM.type === 'tire') {
    els.body.classList.add('theme-tire');
    els.app.classList.add('theme-tire');
    els.header.classList.add('theme-tire');
    els.visualizer.classList.add('theme-tire');
    els.btnAddGroup.classList.add('theme-tire');
    els.poolNum.classList.add('theme-tire');
  }
  
  els.btnAddGroup.classList.add('hidden');
  renderVisualizer();
}

function renderVisualizer() {
  els.poolNum.textContent = poolItems;
  
  // プール描画
  els.pool.innerHTML = '';
  for(let i = 0; i < poolItems; i++) {
    const item = document.createElement('div');
    item.className = `item type-${currentM.type}`;
    item.onclick = moveFromPool;
    els.pool.appendChild(item);
  }

  // グループ描画
  els.groups.innerHTML = '';
  for(let i = 0; i < groupItems.length; i++) {
    const box = document.createElement('div');
    box.className = `group-box type-${currentM.type} ${groupItems[i] === currentM.perGroup ? 'full' : ''}`;
    // ケーキミッションで、追加された箱（6箱目）をハイライト
    if (currentM.type === 'cake' && groupItems.length > currentM.q && i === currentM.q) {
      box.classList.add('new-box');
    }
    
    for(let j = 0; j < groupItems[i]; j++) {
      const item = document.createElement('div');
      item.className = `item type-${currentM.type}`;
      item.onclick = () => moveFromPerson(i);
      box.appendChild(item);
    }
    els.groups.appendChild(box);
  }
}

function moveFromPool() {
  if (poolItems > 0) {
    for(let i = 0; i < groupItems.length; i++) {
      if(groupItems[i] < currentM.perGroup) {
        groupItems[i]++;
        poolItems--;
        renderVisualizer();
        checkAutoUnlockStep2();
        return;
      }
    }
    showMsg(`用意された ${groupItems.length}つの ${currentM.groupName}は もう いっぱいだ！`, "warning", currentM.type === 'cake' ? 1 : 2);
  }
}

function moveFromPerson(boxIndex) {
  if (groupItems[boxIndex] > 0) {
    groupItems[boxIndex]--;
    poolItems++;
    renderVisualizer();
  }
}

// 魔法のボタン
els.btnAuto.addEventListener('click', () => {
  for(let i = 0; i < groupItems.length; i++) {
    while (groupItems[i] < currentM.perGroup && poolItems > 0) {
      groupItems[i]++;
      poolItems--;
    }
  }
  renderVisualizer();
  checkAutoUnlockStep2();
});

// 新しいグループを追加するボタン
els.btnAddGroup.addEventListener('click', () => {
  if (currentM.type === 'cake') {
    // ケーキの場合は箱を追加できる
    groupItems.push(0);
    renderVisualizer();
    els.btnAddGroup.classList.add('hidden');
    showMsg("新しい箱を もってきたよ！ あまった ケーキも しまおう。", "success", 1);
  } else if (currentM.type === 'tire') {
    // 【重要】タイヤの場合は、残り2個なので車が作れないというエラーを出す
    showMsg("🚨 エラー！<br>タイヤが 4こ ないと 車は 作れないよ！<br>あまった 2こ では たりないね。", "error", 2);
  }
});

els.btnReset.addEventListener('click', () => {
  loadMission(currMIdx);
  const msgEl = document.getElementById(`msg${currMIdx + 1}`);
  if(msgEl) msgEl.classList.add('hidden');
});

// 満杯になったら自動でステップ2のヒントやボタンを出す
function checkAutoUnlockStep2() {
  if (!step2Unlocked) return; // まだ計算が終わってない時は何もしない
  
  let fullGroups = 0;
  for(let b of groupItems) if (b === currentM.perGroup) fullGroups++;
  
  if (fullGroups === currentM.q && poolItems === currentM.r) {
    els.btnAddGroup.classList.remove('hidden');
  }
}

function showMsg(text, type, missionNum) {
  const msgEl = document.getElementById(`msg${missionNum}`);
  msgEl.innerHTML = text;
  msgEl.className = `msg ${type}`;
}

// ================= ミッション1（ケーキ）のロジック =================
const btnM1Check = document.getElementById('btn-m1-check');
btnM1Check.addEventListener('click', () => {
  if (!step2Unlocked) {
    // 計算チェック
    const q = parseInt(toHalfWidth(document.getElementById('m1-q').value));
    const r = parseInt(toHalfWidth(document.getElementById('m1-r').value));
    if (q === 5 && r === 3) {
      showMsg("計算 ばっちり！🎉<br>では、上の ケーキを 動かして 箱に つめてみよう。", "success", 1);
      document.getElementById('m1-step2').classList.remove('hidden');
      step2Unlocked = true;
      btnM1Check.textContent = "さいごの 答えあわせ ✨";
      checkAutoUnlockStep2(); // 既に操作済みだった場合のため
    } else {
      showMsg("計算が まちがっているみたい。4のだんの 九九だよ。", "error", 1);
    }
  } else {
    // 最終解答チェック
    currentM.ansCheckFunc();
  }
});

function checkMission1Final() {
  const ans = parseInt(toHalfWidth(document.getElementById('m1-ans').value));
  if (ans === 6) {
    if (poolItems > 0) {
      showMsg("答えは 合っているけど、上の ケーキが まだ しまえてないよ！", "warning", 1);
      return;
    }
    showMsg("大正解！！🏆<br>あまった分も 「ぜんぶ入れる」から、答えに ＋1 したね！", "success", 1);
    btnM1Check.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('mission1-card').classList.add('hidden');
      document.getElementById('mission2-card').classList.remove('hidden');
      loadMission(1); // ミッション2へ
    }, 2500);
  } else if (ans === 5) {
    showMsg("5箱だと、あまった 3この ケーキが 入らないよ！", "error", 1);
  } else {
    showMsg("上の 箱の 数を かぞえてみてね。", "error", 1);
  }
}

// ================= ミッション2（タイヤ）のロジック =================
const btnM2Check = document.getElementById('btn-m2-check');
btnM2Check.addEventListener('click', () => {
  if (!step2Unlocked) {
    // 計算チェック
    const q = parseInt(toHalfWidth(document.getElementById('m2-q').value));
    const r = parseInt(toHalfWidth(document.getElementById('m2-r').value));
    if (q === 7 && r === 2) {
      showMsg("計算 ばっちり！🚗<br>では、上の タイヤを 使って 車を 完成させよう。", "success", 2);
      document.getElementById('m2-step2').classList.remove('hidden');
      step2Unlocked = true;
      btnM2Check.textContent = "さいごの 答えあわせ ✨";
      checkAutoUnlockStep2();
    } else {
      showMsg("計算ミスかな？ 4のだんの 九九だよ。", "error", 2);
    }
  } else {
    // 最終解答チェック
    currentM.ansCheckFunc();
  }
});

function checkMission2Final() {
  const ans = parseInt(toHalfWidth(document.getElementById('m2-ans').value));
  if (ans === 7) {
    showMsg("大正解！！🏆<br>あまった タイヤでは 車が 作れないから、答えは そのまま「7台」だね！", "success", 2);
    btnM2Check.classList.add('hidden');
    setTimeout(() => {
      document.getElementById('clear-screen').classList.remove('hidden');
    }, 2500);
  } else if (ans === 8) {
    showMsg("8台 作るには タイヤが たりないよ！ 上の ボタンを おして たしかめてみて。", "error", 2);
  } else {
    showMsg("上の 車の 台数を かぞえてみてね。", "error", 2);
  }
}

// 初期化
loadMission(0);