// 全角数字を半角に変換する関数
function toHalfWidth(str) {
  if (!str) return "";
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// 教科書（p.88 第5時）に基づくデータ
const problems = [
  { 
    type: "normal",
    title: "① シールの もんだい",
    text: "シールが 26まい あります。1人に 6まいずつ 分けると、何人に 分けられて、何まい あまりますか。",
    div: 26, dsr: 6, q: 4, r: 2, icon: "⭐", itemName: "シール",
    eqLeft: "26 ÷ 6 ＝", hint: "6のだんの 九九で、26に 一番 近いものを さがそう！"
  },
  { 
    type: "zero-trap",
    title: "② わなに 気をつけて！",
    text: "計算を しましょう。<br>24 ÷ 8 ＝",
    div: 24, dsr: 8, q: 3, r: 0, icon: "🍎", itemName: "アイテム",
    eqLeft: "24 ÷ 8 ＝", hint: "8のだんの 九九だね。8 × 3 ＝ 24... あれ？あまりは どうなるかな？"
  },
  { 
    type: "continuous",
    title: "③ 長さの もんだい",
    text: "60cmの リボンを 8cmずつ 切ります。<br>8cmの リボンは 何本できて、何cm あまりますか。",
    div: 60, dsr: 8, q: 7, r: 4, icon: "🟪", itemName: "1cmブロック",
    eqLeft: "60 ÷ 8 ＝", hint: "60 ÷ 8 を 計算するよ。8のだんの 九九で、60を こえない 最大の数は？"
  },
  { 
    type: "shiho-trap",
    title: "④ 名探偵 出動！ しほさんの せつめい",
    text: "右の 計算が 正しいか どうかを せつめい しましょう。<br><span class='quote'>17 ÷ 3 ＝ 4 あまり 5<br>👩 しほさん『答えの たしかめを すると、3 × 4 ＋ 5 ＝ 17 だから、この 答えは 正しいです！』</span>",
    div: 17, dsr: 3, q: 5, r: 2, icon: "🍬", itemName: "あめ",
    hint: "上の おはじき（あめ）を 見てごらん。プールの 中に「5こ」あまっているね。まだ 3この グループを 作れないかな？"
  }
];

let currIdx = 0;
let poolItems = 0;
let groupItems = []; 
let currentP = null;

const els = {
  pool: document.getElementById('pool'),
  poolNum: document.getElementById('pool-num'),
  groups: document.getElementById('groups'),
  totalCountText: document.getElementById('total-count'),
  divisorCountText: document.getElementById('divisor-count'),
  itemName: document.getElementById('item-name'),
  btnReset: document.getElementById('btn-reset-items'),
  btnAuto: document.getElementById('btn-auto-group'),
  qTitle: document.getElementById('q-title'),
  qText: document.getElementById('q-text'),
  
  stdAnsArea: document.getElementById('standard-answer-area'),
  eqLeft: document.getElementById('eq-left'),
  inQ: document.getElementById('input-q'),
  inR: document.getElementById('input-r'),
  
  shihoJudgArea: document.getElementById('shiho-judgment-area'),
  btnShihoCor: document.getElementById('btn-shiho-correct'),
  btnShihoWro: document.getElementById('btn-shiho-wrong'),
  shihoCorrArea: document.getElementById('shiho-correction-area'),
  shihoReason: document.getElementById('shiho-reason'),
  shihoInQ: document.getElementById('shiho-input-q'),
  shihoInR: document.getElementById('shiho-input-r'),
  
  mainActions: document.getElementById('main-actions'),
  msg: document.getElementById('msg'),
  hintArea: document.getElementById('hint-area'),
  hintText: document.getElementById('hint-text'),
  btnHint: document.getElementById('btn-hint'),
  btnCheck: document.getElementById('btn-check'),
  btnNext: document.getElementById('btn-next'),
  prog: document.getElementById('progress-text'),
  clearScreen: document.getElementById('clear-screen')
};

function loadProblem(idx) {
  currentP = problems[idx];
  
  els.prog.textContent = `もんだい ${idx + 1} / ${problems.length}`;
  els.qTitle.textContent = currentP.title;
  els.qText.innerHTML = currentP.text;
  els.itemName.textContent = currentP.itemName;
  els.totalCountText.textContent = currentP.div;
  els.divisorCountText.textContent = currentP.dsr;
  
  // UIリセット
  els.msg.className = 'msg hidden';
  els.hintArea.classList.add('hidden');
  els.hintText.innerHTML = currentP.hint;
  els.btnNext.classList.add('hidden');
  els.inQ.style.borderColor = '#ccc';
  els.inR.style.borderColor = '#ccc';
  els.inQ.value = '';
  els.inR.value = '';
  els.shihoInQ.value = '';
  els.shihoInR.value = '';
  els.shihoReason.value = '';
  
  if (currentP.type === "shiho-trap") {
    // しほさん問題の特殊設定
    els.stdAnsArea.classList.add('hidden');
    els.mainActions.classList.add('hidden');
    els.shihoJudgArea.classList.remove('hidden');
    els.shihoCorrArea.classList.add('hidden');
    
    // 【重要】しほさんの間違った状態（4グループできて5個余る）を初期描画
    poolItems = 5;
    groupItems = [3, 3, 3, 3, 0, 0]; // 余裕を持って6枠
  } else {
    // 通常問題の設定
    els.stdAnsArea.classList.remove('hidden');
    els.mainActions.classList.remove('hidden');
    els.btnCheck.classList.remove('hidden');
    els.btnHint.classList.remove('hidden');
    els.shihoJudgArea.classList.add('hidden');
    els.shihoCorrArea.classList.add('hidden');
    els.eqLeft.textContent = currentP.eqLeft;
    
    poolItems = currentP.div;
    const maxGroups = Math.ceil(currentP.div / currentP.dsr) + 1;
    groupItems = Array(maxGroups).fill(0);
  }
  
  renderVisualizer();
}

function renderVisualizer() {
  els.poolNum.textContent = poolItems;
  
  els.pool.innerHTML = '';
  for(let i = 0; i < poolItems; i++) {
    const item = document.createElement('div');
    item.className = 'item';
    item.textContent = currentP.icon;
    item.onclick = moveFromPool;
    els.pool.appendChild(item);
  }

  els.groups.innerHTML = '';
  for(let i = 0; i < groupItems.length; i++) {
    const box = document.createElement('div');
    box.className = `group-box ${groupItems[i] === currentP.dsr ? 'full' : ''}`;
    
    for(let j = 0; j < groupItems[i]; j++) {
      const item = document.createElement('div');
      item.className = 'item';
      item.textContent = currentP.icon;
      item.onclick = () => moveFromPerson(i);
      box.appendChild(item);
    }
    els.groups.appendChild(box);
  }
}

// プールから未完成のグループへ移動（包含除）
function moveFromPool() {
  if (poolItems > 0) {
    for(let i = 0; i < groupItems.length; i++) {
      if(groupItems[i] < currentP.dsr) {
        groupItems[i]++;
        poolItems--;
        renderVisualizer();
        return;
      }
    }
  }
}

function moveFromPerson(groupIndex) {
  if (groupItems[groupIndex] > 0) {
    groupItems[groupIndex]--;
    poolItems++;
    renderVisualizer();
  }
}

// 魔法のボタン：1グループ自動作成
els.btnAuto.addEventListener('click', () => {
  if (poolItems >= currentP.dsr) {
    for(let i = 0; i < groupItems.length; i++) {
      if (groupItems[i] === 0) {
        groupItems[i] = currentP.dsr;
        poolItems -= currentP.dsr;
        renderVisualizer();
        return;
      }
    }
  } else {
    showMsg("もう 1つの グループを 作るだけの アイテムが 残っていないよ！", "warning");
  }
});

els.btnReset.addEventListener('click', () => loadProblem(currIdx));
els.btnHint.addEventListener('click', () => els.hintArea.classList.remove('hidden'));

function showMsg(text, type) {
  els.msg.innerHTML = text;
  els.msg.className = `msg ${type}`;
}

// --- 通常問題の答え合わせ ---
els.btnCheck.addEventListener('click', () => {
  const uQ = parseInt(toHalfWidth(els.inQ.value));
  const rStr = toHalfWidth(els.inR.value).trim();
  const uR = rStr === '' ? 0 : parseInt(rStr); // 空欄は0として扱う
  
  if (isNaN(uQ)) return showMsg("答えの 数字を 入力してね！", "error");

  // Zero-trap (あまり0) の特別判定
  if (currentP.type === "zero-trap") {
    if (uQ === currentP.q && uR === 0) {
      if (rStr === '') {
        showMsg("大正解！🎉\n「あまり 0」のときは、あまりを 書かなくても いいんだね！ すばらしい 気づきだ！", "success");
      } else {
        showMsg("大正解！🎉\nあまりが 0 のときは、あまりを 書かずに 「答え 3」だけでも はなまる だよ！", "success");
      }
      return finishStep();
    }
  }

  // 通常判定
  if (uR >= currentP.dsr) {
    els.inR.style.borderColor = '#f44336';
    return showMsg(`【ルール違反！】\nあまり（${uR}）が、わる数（${currentP.dsr}）より 大きくなっているよ。\nまだ グループが 作れるから やりなおそう。`, "warning");
  }

  if (uQ === currentP.q && uR === currentP.r) {
    els.inQ.style.borderColor = '#4caf50';
    els.inR.style.borderColor = '#4caf50';
    showMsg("大正解！🎉 バッチリだね！", "success");
    finishStep();
  } else {
    els.inQ.style.borderColor = '#f44336';
    showMsg("おしい！ 計算ミスかも。上の アイテムを 動かして たしかめよう！", "error");
  }
});

function finishStep() {
  els.btnCheck.classList.add('hidden');
  els.btnHint.classList.add('hidden');
  els.btnNext.classList.remove('hidden');
}

// --- しほさん問題のロジック ---
els.btnShihoCor.addEventListener('click', () => {
  showMsg("うーん…たしかめの式（3×4+5=17）は 合っているけど、わり算の ルールを 思い出して！\n上の おはじき（あめ）の プールを見てごらん。まだ グループ作れないかな？", "error");
});

els.btnShihoWro.addEventListener('click', () => {
  showMsg("その通り！🔍 まちがいを 見ぬいたね。<br>では、なぜ 正しくないのか 理由を 教えて！", "success");
  els.shihoJudgArea.classList.add('hidden');
  els.shihoCorrArea.classList.remove('hidden');
  els.mainActions.classList.remove('hidden');
});

// しほさんの理由選択＆修正の答え合わせ（btnCheckをフック）
els.btnCheck.addEventListener('click', () => {
  if (currentP.type !== "shiho-trap") return; // 通常問題の場合は無視
  
  const reason = els.shihoReason.value;
  const sQ = parseInt(toHalfWidth(els.shihoInQ.value));
  const sR = parseInt(toHalfWidth(els.shihoInR.value));

  if (reason === "") return showMsg("正しくない 理由を えらんでね！", "error");
  if (isNaN(sQ) || isNaN(sR)) return showMsg("正しい こたえの 数字を 入力してね！", "error");

  let allCorrect = true;
  let msgText = "";

  if (reason !== "remainder") {
    allCorrect = false;
    msgText += "理由が ちがうみたい。たしかめの式（3×4+5=17）の 計算は 合っているよ。注目するのは「あまりの大きさ」だね！\n";
  }
  if (sQ !== currentP.q || sR !== currentP.r) {
    allCorrect = false;
    msgText += "正しい 答えの 計算が まちがっているよ。おはじきを 動かして 17÷3 を やりなおしてみよう。\n";
  }

  if (allCorrect) {
    showMsg("かんぺき！🌟\n「あまりは わる数より 小さくする」ルールを しっかり おぼえていたね！ 名探偵だ！", "success");
    finishStep();
  } else {
    showMsg(msgText, "error");
  }
});

els.btnNext.addEventListener('click', () => {
  currIdx++;
  if (currIdx < problems.length) {
    loadProblem(currIdx);
  } else {
    els.clearScreen.classList.remove('hidden');
    els.btnNext.classList.add('hidden');
  }
});

// 初期化
loadProblem(currIdx);