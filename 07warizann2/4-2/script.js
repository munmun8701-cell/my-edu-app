// 全角数字を半角に変換する関数
function toHalfWidth(str) {
  if (!str) return "";
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// 教科書画像に基づく問題データ
const problems = [
  { div: 31, dsr: 8, fakeQ: 4, fakeR: 1, isCorrect: false, realQ: 3, realR: 7, 
    text: "31 ÷ 8 ＝", hint: "九九の こたえを たしかめて！ 8 × 4 は いくつになるかな？" },
  { div: 16, dsr: 5, fakeQ: 3, fakeR: 1, isCorrect: true, realQ: 3, realR: 1, 
    text: "16 ÷ 5 ＝", hint: "あまりの 大きさと、九九の こたえを たしかめよう！" },
  { div: 29, dsr: 3, fakeQ: 8, fakeR: 5, isCorrect: false, realQ: 9, realR: 2, 
    text: "29 ÷ 3 ＝", hint: "あまりの 大きさに ちゅうもく！ わる数(3)と くらべてどうかな？" },
  { div: 62, dsr: 7, fakeQ: 9, fakeR: 1, isCorrect: false, realQ: 8, realR: 6, 
    text: "62 ÷ 7 ＝", hint: "九九の こたえを たしかめて！ 7 × 9 は 62を こえないかな？" },
  { 
    div: 38, dsr: 4, fakeQ: 8, fakeR: 6, isCorrect: false, realQ: 9, realR: 2,
    text: "えんぴつが 38本 あります。4本ずつ ふくろに 入れると、ふくろは いくつ できて、何本 あまりますか。", 
    displayEq: "38 ÷ 4 ＝", hint: "あまりの 大きさは、わる数(4)より 小さいかな？" 
  },
  { 
    div: 50, dsr: 6, fakeQ: 9, fakeR: 1, isCorrect: false, realQ: 8, realR: 2, // 6*9=54でオーバーする間違い
    text: "<ruby>色紙<rt>いろがみ</rt></ruby>が <ruby>50<rt>ごじゅう</rt></ruby><ruby>枚<rt>まい</rt></ruby> あります。<ruby>1<rt>ひと</rt></ruby>人に <ruby>6<rt>ろく</rt></ruby><ruby>枚<rt>まい</rt></ruby>ずつ <ruby>分<rt>わ</rt></ruby>けると、<ruby>何<rt>なん</rt></ruby>人に <ruby>分<rt>わ</rt></ruby>けられて、<ruby>何<rt>なん</rt></ruby><ruby>枚<rt>まい</rt></ruby> あまりますか。", 
    displayEq: "50 ÷ 6 ＝", hint: "6のだんの 九九で たしかめよう。6 × 9 は 50を こえちゃうよ！" 
  }
];

let currIdx = 0;
let poolItems = 0;
let groupItems = []; 
let currentP = null;

const els = {
  pool: document.getElementById('pool'),
  groups: document.getElementById('groups'),
  totalCountText: document.getElementById('total-count'),
  divisorCountText: document.getElementById('divisor-count'),
  btnReset: document.getElementById('btn-reset'),
  btnAuto: document.getElementById('btn-auto-group'),
  qText: document.getElementById('q-text'),
  eqDisplay: document.getElementById('eq-display'),
  judgmentArea: document.getElementById('judgment-area'),
  correctionArea: document.getElementById('correction-area'),
  correctEqDisplay: document.getElementById('correct-eq-display'),
  inQ: document.getElementById('input-q'),
  inR: document.getElementById('input-r'),
  msg: document.getElementById('msg'),
  btnCorrect: document.getElementById('btn-correct'),
  btnWrong: document.getElementById('btn-wrong'),
  btnCheckCorr: document.getElementById('btn-check-correction'),
  btnNext: document.getElementById('btn-next'),
  prog: document.getElementById('progress-text'),
  clearScreen: document.getElementById('clear-screen')
};

function loadProblem(idx) {
  currentP = problems[idx];
  poolItems = currentP.div;
  
  const maxGroups = Math.ceil(currentP.div / currentP.dsr) + 1;
  groupItems = Array(maxGroups).fill(0);
  
  els.prog.textContent = `じけん ${idx + 1} / ${problems.length}`;
  els.totalCountText.textContent = currentP.div;
  els.divisorCountText.textContent = currentP.dsr;
  
  els.qText.innerHTML = currentP.text;
  const eqStr = currentP.displayEq || currentP.text;
  els.eqDisplay.textContent = `${eqStr} ${currentP.fakeQ} あまり ${currentP.fakeR}`;
  els.correctEqDisplay.textContent = eqStr;
  
  // UIリセット
  els.inQ.value = '';
  els.inR.value = '';
  els.inQ.style.borderColor = '#ccc';
  els.inR.style.borderColor = '#ccc';
  els.msg.className = 'msg hidden';
  els.correctionArea.classList.add('hidden');
  els.judgmentArea.classList.remove('hidden');
  els.btnNext.classList.add('hidden');
  
  renderVisualizer();
}

// --- 具体物操作ロジック ---
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
    box.className = `group-box ${groupItems[i] === currentP.dsr ? 'full' : ''}`;
    
    for(let j = 0; j < currentP.dsr; j++) {
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
    if(groupItems[i] < currentP.dsr) {
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

els.btnAuto.addEventListener('click', () => {
  if (poolItems >= currentP.dsr) {
    for(let i = 0; i < groupItems.length; i++) {
      if(groupItems[i] === 0) {
        groupItems[i] = currentP.dsr;
        poolItems -= currentP.dsr;
        renderVisualizer();
        return;
      }
    }
  } else {
    showMsg("もう 1つのグループを 作るだけの おはじきが 残っていないよ！", "warning");
  }
});

els.btnReset.addEventListener('click', () => loadProblem(currIdx));

function showMsg(text, type) {
  els.msg.innerHTML = text;
  els.msg.className = `msg ${type}`;
}

// --- 判定ロジック ---
els.btnCorrect.addEventListener('click', () => handleJudgment(true));
els.btnWrong.addEventListener('click', () => handleJudgment(false));

function handleJudgment(userSaysCorrect) {
  if (userSaysCorrect === currentP.isCorrect) {
    if (userSaysCorrect) {
      // 最初から正しい問題を見破った場合
      showMsg("大正解！🎉<br>この こたえは まちがいなし！ 名探偵だね。", "success");
      els.judgmentArea.classList.add('hidden');
      els.btnNext.classList.remove('hidden');
    } else {
      // まちがいを見破った場合 -> 修正へ
      showMsg("するどい！🔍 まちがいを 見ぬいたね。<br>では、正しい こたえに 直してあげよう。", "success");
      els.judgmentArea.classList.add('hidden');
      els.correctionArea.classList.remove('hidden');
    }
  } else {
    // 判定ミス
    showMsg(`ちがうみたいだぞ…🕵️‍♂️<br>💡 ヒント：${currentP.hint}`, "error");
  }
}

// --- 修正ロジック ---
els.btnCheckCorr.addEventListener('click', () => {
  const uQ = parseInt(toHalfWidth(els.inQ.value));
  const uR = parseInt(toHalfWidth(els.inR.value));

  if (isNaN(uQ) || isNaN(uR)) {
    return showMsg("数字を 入力してね！", "error");
  }

  if (uQ === currentP.realQ && uR === currentP.realR) {
    els.inQ.style.borderColor = '#27ae60';
    els.inR.style.borderColor = '#27ae60';
    showMsg("かんぺき！🌟<br>正しい こたえに なおせたね。じけん 解決！", "success");
    els.btnCheckCorr.classList.add('hidden');
    els.btnNext.classList.remove('hidden');
  } else {
    els.inQ.style.borderColor = '#e74c3c';
    showMsg(`おしい！ もういちど 計算を たしかめよう。<br>💡 ヒント：${currentP.hint}`, "error");
  }
});

els.btnNext.addEventListener('click', () => {
  currIdx++;
  if (currIdx < problems.length) {
    loadProblem(currIdx);
  } else {
    els.clearScreen.classList.remove('hidden');
  }
});

// 初期化
loadProblem(currIdx);