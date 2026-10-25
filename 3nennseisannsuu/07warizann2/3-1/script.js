// --- 全角数字を半角に変換する ---
function toHalfWidth(str) {
  if (!str) return "";
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// --- 状態管理 ---
const TOTAL_SEEDS = 16;
const NUM_PEOPLE = 3;
let poolItems = TOTAL_SEEDS;
let personItems = [0, 0, 0]; // 3人の箱の中身

// --- DOM要素 ---
const els = {
  pool: document.getElementById('pool'),
  btnDistribute: document.getElementById('btn-distribute'),
  btnReset: document.getElementById('btn-reset-items')
};

// --- ビジュアライザ初期化・描画 ---
function renderVisualizer() {
  // プール描画
  els.pool.innerHTML = '';
  for(let i = 0; i < poolItems; i++) {
    const item = document.createElement('div');
    item.className = 'item';
    item.onclick = moveFromPool;
    els.pool.appendChild(item);
  }

  // 3人の箱描画
  for(let i = 0; i < NUM_PEOPLE; i++) {
    const area = document.querySelector(`#person-${i} .items-area`);
    area.innerHTML = '';
    for(let j = 0; j < personItems[i]; j++) {
      const item = document.createElement('div');
      item.className = 'item';
      item.onclick = () => moveFromPerson(i);
      area.appendChild(item);
    }
  }
}

// プールから一番少ない箱へ移動（等分除の動きを再現）
function moveFromPool() {
  if (poolItems > 0) {
    // 一番たねが少ない人を探す
    let minIndex = 0;
    for(let i = 1; i < NUM_PEOPLE; i++) {
      if(personItems[i] < personItems[minIndex]) {
        minIndex = i;
      }
    }
    personItems[minIndex]++;
    poolItems--;
    renderVisualizer();
  }
}

// 箱からプールへ戻す
function moveFromPerson(personIndex) {
  if (personItems[personIndex] > 0) {
    personItems[personIndex]--;
    poolItems++;
    renderVisualizer();
  }
}

// 魔法のボタン：3人に1個ずつ配る
els.btnDistribute.addEventListener('click', () => {
  if (poolItems >= NUM_PEOPLE) {
    for(let i = 0; i < NUM_PEOPLE; i++) {
      personItems[i]++;
    }
    poolItems -= NUM_PEOPLE;
    renderVisualizer();
  } else {
    showMsg(2, "もう 全員に 同じ数ずつ 配れるだけの たねが 残っていないよ！", "warning");
  }
});

// リセットボタン
els.btnReset.addEventListener('click', () => {
  poolItems = TOTAL_SEEDS;
  personItems = [0, 0, 0];
  renderVisualizer();
});

// --- ステップ制御と判定 ---
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
  }, 1500);
}

// Step 1: 立式 (16 ÷ 3)
function checkStep1() {
  const div = parseInt(toHalfWidth(document.getElementById('s1-div').value));
  const dsr = parseInt(toHalfWidth(document.getElementById('s1-dsr').value));
  
  if (isNaN(div) || isNaN(dsr)) return showMsg(1, "数字を 入力してね！", "error");
  
  if (div === 16 && dsr === 3) {
    showMsg(1, "正解！🎉\n「ぜんぶの数 ÷ 分ける人数」の 式が できたね！", "success");
    nextStep(1);
  } else {
    showMsg(1, "おしい！\n「ぜんぶの数」は 16こ、「分ける人数」は 3人 だよ。", "error");
  }
}

// Step 2: 具体物操作 (5 remainder 1)
function checkStep2() {
  const q = parseInt(toHalfWidth(document.getElementById('s2-q').value));
  const r = parseInt(toHalfWidth(document.getElementById('s2-r').value));
  
  if (isNaN(q) || isNaN(r)) return showMsg(2, "数字を 入力してね！", "error");

  // 操作状態と入力内容の一致を確認
  const isEqualShare = personItems[0] === personItems[1] && personItems[1] === personItems[2];
  
  if (!isEqualShare) {
    return showMsg(2, "3人の たねの 数が バラバラだよ！\n「同じ数ずつ」になるように 配りなおしてね。", "warning");
  }
  
  if (q !== personItems[0] || r !== poolItems) {
    return showMsg(2, "上の たねの 数と 入力した 答えが ちがうよ。\nたねを しっかり 配り終わってから、数を かぞえてね。", "error");
  }

  // 完全正解
  if (q === 5 && r === 1) {
    showMsg(2, "大正解！🎉\n1人分は 5こ、あまりは 1こ だね！\n次は、この答えを「九九」で 見つける 方法を 考えるよ。", "success");
    nextStep(2);
  } else if (poolItems >= 3) {
    showMsg(2, "あまりの 中から、まだ 3人に 同じ数ずつ 配れそうだよ！", "warning");
  } else {
    showMsg(2, "まちがっては いないけど…もっと 考えられるかな？", "warning");
  }
}

// Step 3: 九九の活用
function checkStep3() {
  const r1 = parseInt(toHalfWidth(document.getElementById('s3-r1').value));
  const r2 = parseInt(toHalfWidth(document.getElementById('s3-r2').value));
  const r3 = parseInt(toHalfWidth(document.getElementById('s3-r3').value));
  
  let allCorrect = true;
  if (r1 !== 4) { document.getElementById('s3-r1').style.borderColor = '#f44336'; allCorrect = false; } else { document.getElementById('s3-r1').style.borderColor = '#ccc'; }
  if (r2 !== 1) { document.getElementById('s3-r2').style.borderColor = '#f44336'; allCorrect = false; } else { document.getElementById('s3-r2').style.borderColor = '#ccc'; }
  if (r3 !== 2) { document.getElementById('s3-r3').style.borderColor = '#f44336'; allCorrect = false; } else { document.getElementById('s3-r3').style.borderColor = '#ccc'; }

  if (allCorrect) {
    showMsg(3, "バッチリ！🌟\n九九を 使えば、1人分を「5こ」に したとき、あまりが わる数（3）より 小さくなることが わかるね！", "success");
    nextStep(3);
  } else {
    showMsg(3, "計算が まちがっている ところが あるよ。16から ひいてみよう！", "error");
  }
}

// Step 4: 最終解答
function checkStep4() {
  const q = parseInt(toHalfWidth(document.getElementById('s4-q').value));
  const r = parseInt(toHalfWidth(document.getElementById('s4-r').value));
  
  if (q === 5 && r === 1) {
    showMsg(4, "パーフェクト！！🏆\n包含除（何人に分けられるか）でも、等分除（1人分は何個か）でも、同じように 九九を使って 答えが 見つけられるんだね！", "success");
    setTimeout(() => {
      document.getElementById('clear-screen').classList.remove('hidden');
    }, 2000);
  } else {
    showMsg(4, "さいごの 答えだよ。ステップ2や3を おもいだして！", "error");
  }
}

// 初期化
renderVisualizer();