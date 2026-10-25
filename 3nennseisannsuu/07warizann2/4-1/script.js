// --- 全角数字を半角に変換 ---
function toHalfWidth(str) {
  if (!str) return "";
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// --- 状態管理 ---
const TOTAL_ITEMS = 23;
const GROUP_SIZE = 6;
let poolItems = TOTAL_ITEMS;
let groupItems = [0, 0, 0, 0, 0]; // 5人分の枠

// --- DOM要素 ---
const els = {
  pool: document.getElementById('pool'),
  btnDistribute: document.getElementById('btn-distribute'),
  btnReset: document.getElementById('btn-reset-items')
};

// --- ビジュアライザ初期化・描画 ---
function renderVisualizer() {
  els.pool.innerHTML = '';
  for(let i = 0; i < poolItems; i++) {
    const item = document.createElement('div');
    item.className = 'item';
    item.onclick = moveFromPool;
    els.pool.appendChild(item);
  }

  const personBoxes = document.querySelectorAll('.person-box');
  for(let i = 0; i < groupItems.length; i++) {
    const area = personBoxes[i].querySelector('.items-area');
    area.innerHTML = '';
    
    // グループがいっぱいになったら色を変える
    if (groupItems[i] === GROUP_SIZE) {
      personBoxes[i].classList.add('active');
    } else {
      personBoxes[i].classList.remove('active');
    }

    for(let j = 0; j < groupItems[i]; j++) {
      const item = document.createElement('div');
      item.className = 'item';
      item.onclick = () => moveFromPerson(i);
      area.appendChild(item);
    }
  }
}

// プールから未完成のグループへ移動（包含除の動き：6個たまるまで同じ人へ）
function moveFromPool() {
  if (poolItems > 0) {
    for(let i = 0; i < groupItems.length; i++) {
      if(groupItems[i] < GROUP_SIZE) {
        groupItems[i]++;
        poolItems--;
        renderVisualizer();
        return;
      }
    }
  }
}

// 人からプールへ戻す
function moveFromPerson(personIndex) {
  if (groupItems[personIndex] > 0) {
    groupItems[personIndex]--;
    poolItems++;
    renderVisualizer();
  }
}

// 魔法のボタン：1人に6枚ずつ配る
els.btnDistribute.addEventListener('click', () => {
  if (poolItems >= GROUP_SIZE) {
    for(let i = 0; i < groupItems.length; i++) {
      if (groupItems[i] === 0) {
        groupItems[i] = GROUP_SIZE;
        poolItems -= GROUP_SIZE;
        renderVisualizer();
        return;
      }
    }
  } else {
    showMsg(1, "もう 1人に 6枚ずつ 配れるだけの 色紙が 残っていないよ！", "warning");
  }
});

// リセットボタン
els.btnReset.addEventListener('click', () => {
  poolItems = TOTAL_ITEMS;
  groupItems = [0, 0, 0, 0, 0];
  renderVisualizer();
});

// --- ステップ制御と判定 ---
function showMsg(stepId, text, type) {
  const msgEl = document.getElementById(`msg${stepId}`);
  msgEl.innerHTML = text;
  msgEl.className = `msg ${type}`;
}

function nextStep(currentStep) {
  setTimeout(() => {
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    document.getElementById(`step${currentStep + 1}`).classList.remove('hidden');
    document.getElementById('step-indicator').textContent = `ステップ ${currentStep + 1} / 4`;
  }, 1500);
}

// Step 1: 正しい答えを見つける
function checkStep1() {
  const q = parseInt(toHalfWidth(document.getElementById('s1-q').value));
  const r = parseInt(toHalfWidth(document.getElementById('s1-r').value));
  
  if (isNaN(q) || isNaN(r)) return showMsg(1, "数字を 入力してね！", "error");
  
  let fullGroups = 0;
  for(let g of groupItems) if (g === GROUP_SIZE) fullGroups++;

  if (q !== fullGroups || r !== poolItems) {
    return showMsg(1, "上の 色紙の 図と 答えが ちがうみたい。\n色紙を 動かして、しっかり 配りきってから 数えてみよう。", "warning");
  }

  if (q === 3 && r === 5) {
    showMsg(1, "大正解！🎉\nりくさんの 答えが 正しかったね！\n次は、この答えが 本当に 合っているか「計算」で たしかめるよ。", "success");
    nextStep(1);
  } else {
    showMsg(1, "おしい！ 計算が まちがっているかも。もういちど 考えてみよう。", "error");
  }
}

// Step 2: たしかめの式をつくる
function checkStep2() {
  const div = parseInt(toHalfWidth(document.getElementById('s2-divisor').value));
  const q = parseInt(toHalfWidth(document.getElementById('s2-quotient').value));
  const r = parseInt(toHalfWidth(document.getElementById('s2-remainder').value));
  const tot = parseInt(toHalfWidth(document.getElementById('s2-dividend').value));
  
  if (isNaN(div) || isNaN(q) || isNaN(r) || isNaN(tot)) return showMsg(2, "すべての 四角に 数字を 入れてね！", "error");

  // かけ算の順序（わる数 × 答え）を指導する
  if (div === 3 && q === 6) {
    return showMsg(2, "おしい！ かけ算の 順番に 気をつけて。\n「1人分の数（わる数）× 配れた人数（答え）」の 順番で 書こうね！", "warning");
  }

  if (div === 6 && q === 3 && r === 5 && tot === 23) {
    showMsg(2, "かんぺき！🌟\n「6 × 3 ＋ 5 ＝ 23」\nこれで、わり算の 答えが 正しいか 自分で たしかめられるね！", "success");
    nextStep(2);
  } else {
    showMsg(2, "どこかが ちがうみたい。\n四角の 色（緑、赤、オレンジ、青）と、上の 文字の 色を くらべて みてね。", "error");
  }
}

// Step 4: れんしゅう問題 (34 ÷ 4 = 8 r 2 -> 4 * 8 + 2 = 34)
function checkStep4() {
  const q = parseInt(toHalfWidth(document.getElementById('s4-q').value));
  const r = parseInt(toHalfWidth(document.getElementById('s4-r').value));
  const chkDiv = parseInt(toHalfWidth(document.getElementById('s4-chk-div').value));
  const chkQ = parseInt(toHalfWidth(document.getElementById('s4-chk-q').value));
  const chkR = parseInt(toHalfWidth(document.getElementById('s4-chk-r').value));
  const chkTot = parseInt(toHalfWidth(document.getElementById('s4-chk-tot').value));

  let allCorrect = true;
  let msgText = "";

  // ① 答えのチェック
  if (q !== 8 || r !== 2) {
    allCorrect = false;
    document.getElementById('s4-q').style.borderColor = '#d32f2f';
    msgText += "①の わり算の 答えが まちがっているよ。4のだんの 九九を おもいだそう！\n";
  } else {
    document.getElementById('s4-q').style.borderColor = '#ccc';
  }

  // ② たしかめの式のチェック
  if (chkDiv === 8 && chkQ === 4) {
    allCorrect = false;
    msgText += "②の かけ算の 順番に 気をつけて！「わる数 × 答え」だよ。\n";
  } else if (chkDiv !== 4 || chkQ !== 8 || chkR !== 2 || chkTot !== 34) {
    allCorrect = false;
    msgText += "②の たしかめの 式に まちがいが あるよ。色を ヒントに してみてね。\n";
  }

  if (allCorrect) {
    showMsg(4, "パーフェクト！！🏆\n計算も、たしかめも バッチリだね！", "success");
    setTimeout(() => {
      document.getElementById('clear-screen').classList.remove('hidden');
    }, 2000);
  } else {
    showMsg(4, msgText, "error");
  }
}

// 初期化
renderVisualizer();