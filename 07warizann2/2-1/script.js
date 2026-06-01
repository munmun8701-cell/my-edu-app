// --- 全角数字を半角に変換する便利機能 ---
function toHalfWidth(str) {
  if (!str) return "";
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// --- 状態管理 ---
let currentTotal = 13;
let currentDivisor = 4;
let poolItems = 13;
let groupItems = []; 

// --- DOM要素 ---
const els = {
  pool: document.getElementById('pool'),
  groups: document.getElementById('groups'),
  totalCountText: document.getElementById('total-count'),
  divisorCountText: document.getElementById('divisor-count'),
  btnReset: document.getElementById('btn-reset-items')
};

// --- ビジュアライザ（具体物操作）の初期化 ---
function setupVisualizer(total, divisor) {
  currentTotal = total;
  currentDivisor = divisor;
  poolItems = total;
  
  const maxGroups = Math.ceil(total / divisor) + 1;
  groupItems = Array(maxGroups).fill(0);
  
  els.totalCountText.textContent = total;
  els.divisorCountText.textContent = divisor;
  
  renderVisualizer();
}

// 描画処理
function renderVisualizer() {
  els.pool.innerHTML = '';
  for(let i = 0; i < poolItems; i++) {
    const item = document.createElement('div');
    item.className = 'item';
    item.onclick = moveToGroup;
    els.pool.appendChild(item);
  }

  els.groups.innerHTML = '';
  for(let i = 0; i < groupItems.length; i++) {
    const box = document.createElement('div');
    box.className = `group-box ${groupItems[i] === currentDivisor ? 'full' : ''}`;
    
    for(let j = 0; j < currentDivisor; j++) {
      if(j < groupItems[i]) {
        const item = document.createElement('div');
        item.className = 'item';
        item.onclick = () => moveToPool(i);
        box.appendChild(item);
      } else {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        box.appendChild(slot);
      }
    }
    els.groups.appendChild(box);
  }
}

function moveToGroup() {
  for(let i = 0; i < groupItems.length; i++) {
    if(groupItems[i] < currentDivisor) {
      groupItems[i]++;
      poolItems--;
      renderVisualizer();
      return;
    }
  }
}

function moveToPool(groupIndex) {
  groupItems[groupIndex]--;
  poolItems++;
  renderVisualizer();
}

els.btnReset.addEventListener('click', () => setupVisualizer(currentTotal, currentDivisor));

// --- 各ステップの判定ロジック ---

function showMsg(stepId, text, type) {
  const msgEl = document.getElementById(`msg${stepId}`);
  msgEl.textContent = text;
  msgEl.className = `msg ${type}`;
}

function nextStep(currentStep) {
  setTimeout(() => {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${currentStep + 1}`).classList.remove('hidden');
    document.getElementById('step-indicator').textContent = `ステップ ${currentStep + 1} / 4`;
    if(currentStep + 1 === 2) setupVisualizer(12, 4);
    if(currentStep + 1 === 4) setupVisualizer(7, 2);
  }, 2000);
}

// ステップ1：導入
function checkStep1() {
  // ここで toHalfWidth を使って全角を半角に変換してからチェックします
  const qStr = toHalfWidth(document.getElementById('s1-q').value);
  const rStr = toHalfWidth(document.getElementById('s1-r').value);
  const q = parseInt(qStr);
  const r = parseInt(rStr);
  
  if(isNaN(q) || isNaN(r)) return showMsg(1, "こたえを 数字で 入力してね！", "error");

  if(q === 2 && r === 5) {
    showMsg(1, "【あみさんと同じ答えだね！】\nでも、上のおはじきを見てみて。「あまりの5こ」の中に、まだ「4このグループ」が 作れないかな？\nもう一度、おはじきを 動かしてみよう！", "error");
  } else if (q === 3 && r === 1) {
    showMsg(1, "大正解！🎉\nりくさんの 言う通りだね。あまりが わる数（4）より 大きいうちは、まだ 分けられるんだね！", "success");
    nextStep(1);
  } else {
    showMsg(1, "ちがうみたい。上のおはじきを 全部 グループに入れてから 数えてみよう！", "error");
  }
}

// ステップ2：展開（表）
function checkStep2() {
  const ids = [12, 14, 15, 16, 17];
  let allCorrect = true;

  ids.forEach(id => {
    const qInput = document.getElementById(`s2-q${id}`);
    const rInput = document.getElementById(`s2-r${id}`);
    const ansQ = parseInt(qInput.dataset.ans);
    const ansR = parseInt(rInput.dataset.ans);
    
    // 全角対応
    const userQ = parseInt(toHalfWidth(qInput.value));
    const userR = parseInt(toHalfWidth(rInput.value));
    
    if (userQ !== ansQ || userR !== ansR) {
      allCorrect = false;
      qInput.style.borderColor = "#f44336";
    } else {
      qInput.style.borderColor = "#ccc";
    }
  });

  if(allCorrect) {
    showMsg(2, "表が かんせいしたね！ ばっちり！🌟\nあまりの 数字が 「0, 1, 2, 3, 0...」と 変わっていることに 注目しよう。", "success");
    nextStep(2);
  } else {
    showMsg(2, "あいている ところが あるか、まちがっている 計算が あるよ。\n表の式を タップすると、おはじきが その数に 変わるから、たしかめながら 計算しよう！", "error");
  }
}

// ステップ3：まとめ
function checkStep3() {
  const val = document.getElementById('s3-select').value;
  if(val === "small") {
    showMsg(3, "大正解！🎉\n【わり算のあまりは、わる数より 小さくなるようにする】\nこれが 今日の いちばん 大切な ルールだよ！", "success");
    nextStep(3);
  } else {
    showMsg(3, "うーん、ちがうみたい。\nステップ2の 表を見ると、わる数が「4」のとき、あまりは「3」までしか なかったよね。", "error");
  }
}

// ステップ4：適用問題
function checkStep4() {
  let allCorrect = true;
  for(let i=1; i<=3; i++) {
    const qInput = document.getElementById(`s4-q${i}`);
    const rInput = document.getElementById(`s4-r${i}`);
    
    // 全角対応
    const userQ = parseInt(toHalfWidth(qInput.value));
    const userR = parseInt(toHalfWidth(rInput.value));

    if (userQ !== parseInt(qInput.dataset.q) || userR !== parseInt(rInput.dataset.r)) {
      allCorrect = false;
    }
  }

  if(allCorrect) {
    showMsg(4, "ぜんぶ 大正解！🏆\nあまりが わる数より 小さくなっているか、自分で チェックできたかな？\n今日の べんきょうは これで 終わりです！", "success");
  } else {
    showMsg(4, "おしい！ 計算ミスの ところが あるよ。\nもんだいを タップして、おはじきを 動かして かくにんしてみよう！", "error");
  }
}

// 初期化実行
setupVisualizer(13, 4);