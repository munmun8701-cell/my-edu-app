// 全角数字を半角に変換する関数
function toHalfWidth(str) {
  if (!str) return "";
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// 教科書p.85の適応問題に基づくデータ
const problems = [
  { div: 7, dsr: 2, text: "7 ÷ 2 ＝", type: "calc", hint: "2のだんの九九を おもいだそう！ 2 × 3 ＝ 6 だね。" },
  { div: 23, dsr: 3, text: "23 ÷ 3 ＝", type: "calc", hint: "3のだんの九九で、23に いちばん 近いのは 3 × 〇 ？" },
  { div: 31, dsr: 7, text: "31 ÷ 7 ＝", type: "calc", hint: "7のだんの九九を つかおう！ 7 × 4 は いくつかな？" },
  { div: 40, dsr: 6, text: "40 ÷ 6 ＝", type: "calc", hint: "6のだんの九九！ 40を こえないように 気をつけてね。" },
  { 
    div: 43, dsr: 5, type: "word",
    text: "クッキーが <ruby>43<rt>よんじゅうさん</rt></ruby>こ あります。<ruby>1<rt>ひと</rt></ruby>つの <ruby>箱<rt>はこ</rt></ruby>に <ruby>5<rt>ご</rt></ruby>こずつ 入れると、<ruby>箱<rt>はこ</rt></ruby>は いくつ できて、<ruby>何<rt>なん</rt></ruby>こ あまりますか。",
    displayEq: "43 ÷ 5 ＝", hint: "式は 43 ÷ 5 だね。5のだんの 九九で 考えよう！" 
  },
  { 
    div: 58, dsr: 6, type: "word",
    text: "<ruby>折<rt>お</rt></ruby>り<ruby>紙<rt>がみ</rt></ruby>が <ruby>58<rt>ごじゅうはち</rt></ruby><ruby>枚<rt>まい</rt></ruby> あります。<ruby>6<rt>ろく</rt></ruby><ruby>人<rt>にん</rt></ruby>に <ruby>同<rt>おな</rt></ruby>じ <ruby>数<rt>かず</rt></ruby>ずつ <ruby>分<rt>わ</rt></ruby>けると、<ruby>1<rt>ひと</rt></ruby><ruby>人<rt>り</rt></ruby> <ruby>何<rt>なん</rt></ruby><ruby>枚<rt>まい</rt></ruby>になって、<ruby>何<rt>なん</rt></ruby><ruby>枚<rt>まい</rt></ruby> あまりますか。",
    displayEq: "58 ÷ 6 ＝", hint: "式は 58 ÷ 6 だよ。6のだんで 58に いちばん 近いのは？" 
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
  qTitle: document.getElementById('q-title'),
  qText: document.getElementById('q-text'),
  eqDisplay: document.getElementById('eq-display'),
  inQ: document.getElementById('input-q'),
  inR: document.getElementById('input-r'),
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
  poolItems = currentP.div;
  
  const maxGroups = Math.ceil(currentP.div / currentP.dsr) + 1;
  groupItems = Array(maxGroups).fill(0);
  
  els.prog.textContent = `もんだい ${idx + 1} / ${problems.length}`;
  els.totalCountText.textContent = currentP.div;
  els.divisorCountText.textContent = currentP.dsr;
  
  if(currentP.type === "calc") {
    els.qTitle.textContent = "計算しましょう";
    els.qText.innerHTML = "";
    els.eqDisplay.textContent = currentP.text;
  } else {
    els.qTitle.textContent = "文章もんだい";
    els.qText.innerHTML = currentP.text;
    els.eqDisplay.textContent = currentP.displayEq;
  }
  
  els.inQ.value = '';
  els.inR.value = '';
  els.inQ.style.borderColor = '#ccc';
  els.inR.style.borderColor = '#ccc';
  els.msg.className = 'msg hidden';
  els.hintArea.classList.add('hidden');
  els.hintText.innerHTML = currentP.hint;
  els.btnNext.classList.add('hidden');
  els.btnCheck.classList.remove('hidden');
  els.btnHint.classList.remove('hidden');
  
  renderVisualizer();
}

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

// 魔法のボタン：1グループを自動で埋める
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
els.btnHint.addEventListener('click', () => els.hintArea.classList.remove('hidden'));

function showMsg(text, type) {
  els.msg.textContent = text;
  els.msg.className = `msg ${type}`;
}

els.btnCheck.addEventListener('click', () => {
  const userQStr = toHalfWidth(els.inQ.value);
  const userRStr = toHalfWidth(els.inR.value);
  const uQ = parseInt(userQStr);
  const uR = parseInt(userRStr);
  
  const correctQ = Math.floor(currentP.div / currentP.dsr);
  const correctR = currentP.div % currentP.dsr;

  if (isNaN(uQ) || isNaN(uR)) {
    return showMsg("こたえを 入力してね！", "error");
  }

  // ルール違反のチェック（あまり ≧ わる数）
  if (uR >= currentP.dsr) {
    els.inR.style.borderColor = '#f44336';
    return showMsg(`【ルールを おもいだして！】\nあまり（${uR}）が、わる数（${currentP.dsr}）より 大きくなっているよ。\nまだ 分けられるから、もういちど 計算しよう！`, "warning");
  }

  // 完全正解
  if (uQ === correctQ && uR === correctR) {
    els.inQ.style.borderColor = '#4caf50';
    els.inR.style.borderColor = '#4caf50';
    showMsg("大正解！🎉\nあまりが わる数より 小さくなっているね！バッチリ！", "success");
    els.btnCheck.classList.add('hidden');
    els.btnHint.classList.add('hidden');
    els.btnNext.classList.remove('hidden');
  } else {
    // 単純な計算ミス
    els.inQ.style.borderColor = '#f44336';
    showMsg("おしい！ どこかで 計算を まちがえているかも。\n上の おはじきを 動かして、たしかめてみよう！", "error");
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