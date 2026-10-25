// 全角数字を半角に変換する関数
function toHalfWidth(str) {
  if (!str) return "";
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// 教科書（p.132 練習問題 等分除）に基づくデータ
// 引っかけ問題（数字の順番が文章通りではない）に対応
const problems = [
  { 
    text: "<ruby>画用紙<rt>がようし</rt></ruby>が 54まい あります。8人で <ruby>同<rt>おな</rt></ruby>じ 数ずつ 分けると、1人分は 何まいになって、何まい あまりますか。",
    div: 54, dsr: 8, q: 6, r: 6,
    hint: "式は「ぜんぶの数 ÷ 人数」だよ。8のだんの 九九で 54に 一番 近いのは 8 × 〇 かな？",
    icon: "📄"
  },
  { 
    text: "クッキーを、9人で <ruby>同<rt>おな</rt></ruby>じ 数ずつ 分けます。クッキーは、<ruby>全部<rt>ぜんぶ</rt></ruby>で 24まい あります。1人分は 何まいになって、何まい あまりますか。",
    div: 24, dsr: 9, q: 2, r: 6,
    hint: "文章を よく読んでね。「ぜんぶの数」は いくつかな？ 式は「24 ÷ 9」になるよ！",
    icon: "🍪"
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
  btnReset: document.getElementById('btn-reset-items'),
  btnAuto: document.getElementById('btn-distribute'),
  qText: document.getElementById('q-text'),
  
  // 入力フィールド（式と答え）
  s1Div: document.getElementById('s1-div'),
  s1Dsr: document.getElementById('s1-dsr'),
  s1Q: document.getElementById('s1-q'),
  s1R: document.getElementById('s1-r'),
  
  // 入力フィールド（たしかめ）
  s2Div: document.getElementById('s2-chk-div'),
  s2Q: document.getElementById('s2-chk-q'),
  s2R: document.getElementById('s2-chk-r'),
  s2Tot: document.getElementById('s2-chk-tot'),
  
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
  groupItems = Array(currentP.dsr).fill(0);
  
  els.prog.textContent = `もんだい ${idx + 1} / ${problems.length}`;
  els.totalCountText.textContent = currentP.div;
  els.divisorCountText.textContent = currentP.dsr;
  
  els.qText.innerHTML = currentP.text;
  
  // 入力リセット
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach(input => {
    input.value = '';
    input.style.borderColor = ''; // デフォルト色（CSSで指定したクラスの色に戻る）
  });
  
  els.msg.className = 'msg hidden';
  els.hintArea.classList.add('hidden');
  els.hintText.innerHTML = currentP.hint;
  els.btnNext.classList.add('hidden');
  els.btnCheck.classList.remove('hidden');
  els.btnHint.classList.remove('hidden');
  
  renderVisualizer();
}

function renderVisualizer() {
  els.poolNum.textContent = poolItems;
  
  // プール内の具体物描画（数が多いため、最大30個程度の視覚表現に制限しても良いが、今回は全て描画）
  els.pool.innerHTML = '';
  for(let i = 0; i < poolItems; i++) {
    const item = document.createElement('div');
    item.className = 'item';
    item.textContent = currentP.icon;
    item.style.fontSize = "10px"; // 小さく表示
    item.onclick = moveFromPool;
    els.pool.appendChild(item);
  }

  // グループの描画
  els.groups.innerHTML = '';
  for(let i = 0; i < groupItems.length; i++) {
    const box = document.createElement('div');
    box.className = 'person-box';
    
    const icon = document.createElement('div');
    icon.className = 'person-icon';
    icon.textContent = (i % 2 === 0) ? '👦' : '👧';
    box.appendChild(icon);
    
    const area = document.createElement('div');
    area.className = 'items-area';
    for(let j = 0; j < groupItems[i]; j++) {
      const item = document.createElement('div');
      item.className = 'item';
      item.textContent = currentP.icon;
      item.style.fontSize = "10px";
      item.onclick = () => moveFromPerson(i);
      area.appendChild(item);
    }
    box.appendChild(area);
    els.groups.appendChild(box);
  }
}

// 等分除の動き：1個ずつ、一番少ない人に配る
function moveFromPool() {
  if (poolItems > 0) {
    let minIndex = 0;
    for(let i = 1; i < groupItems.length; i++) {
      if(groupItems[i] < groupItems[minIndex]) minIndex = i;
    }
    groupItems[minIndex]++;
    poolItems--;
    renderVisualizer();
  }
}

function moveFromPerson(personIndex) {
  if (groupItems[personIndex] > 0) {
    groupItems[personIndex]--;
    poolItems++;
    renderVisualizer();
  }
}

// 魔法のボタン：全員に1枚ずつ配る
els.btnAuto.addEventListener('click', () => {
  if (poolItems >= currentP.dsr) {
    for(let i = 0; i < groupItems.length; i++) {
      groupItems[i]++;
    }
    poolItems -= currentP.dsr;
    renderVisualizer();
  } else {
    showMsg("もう 全員に 同じ数ずつ 配れるだけの 数が 残っていないよ！", "warning");
  }
});

els.btnReset.addEventListener('click', () => loadProblem(currIdx));
els.btnHint.addEventListener('click', () => els.hintArea.classList.remove('hidden'));

function showMsg(text, type) {
  els.msg.innerHTML = text;
  els.msg.className = `msg ${type}`;
}

// --- 答え合わせロジック ---
els.btnCheck.addEventListener('click', () => {
  // 式と答えの値
  const uDiv = parseInt(toHalfWidth(els.s1Div.value));
  const uDsr = parseInt(toHalfWidth(els.s1Dsr.value));
  const uQ = parseInt(toHalfWidth(els.s1Q.value));
  const uR = parseInt(toHalfWidth(els.s1R.value));
  
  // たしかめの式の値
  const cDiv = parseInt(toHalfWidth(els.s2Div.value));
  const cQ = parseInt(toHalfWidth(els.s2Q.value));
  const cR = parseInt(toHalfWidth(els.s2R.value));
  const cTot = parseInt(toHalfWidth(els.s2Tot.value));

  if (isNaN(uDiv) || isNaN(uDsr) || isNaN(uQ) || isNaN(uR) || isNaN(cDiv) || isNaN(cQ) || isNaN(cR) || isNaN(cTot)) {
    return showMsg("すべての 四角に 数字を 入力してね！", "error");
  }

  let allCorrect = true;
  let msgText = "";

  // ① 式のチェック
  if (uDiv !== currentP.div || uDsr !== currentP.dsr) {
    allCorrect = false;
    msgText += "①の「式」が ちがうよ。文章を よく読んで、ぜんぶの数と 人数を かくにんしよう。\n";
  } else if (uQ !== currentP.q || uR !== currentP.r) {
    allCorrect = false;
    msgText += "①の「答え」の 計算が まちがっているみたい。九九を おもいだして！\n";
  }

  // ② たしかめの式のチェック
  // 順序（わる数×答え）の指導を含む
  if (cDiv === currentP.q && cQ === currentP.dsr) {
    allCorrect = false;
    msgText += "②の かけ算の 順番に 気をつけて！「わる数（人数）× 答え（1人分）」の 順番だよ。\n";
  } else if (cDiv !== currentP.dsr || cQ !== currentP.q || cR !== currentP.r || cTot !== currentP.div) {
    allCorrect = false;
    msgText += "②の「たしかめの式」に まちがいが あるよ。四角の 色を ヒントに してみてね。\n";
  }

  if (allCorrect) {
    showMsg("かんぺき！ 大正解！！🎉\n計算も、たしかめの式も バッチリだね！", "success");
    els.btnCheck.classList.add('hidden');
    els.btnHint.classList.add('hidden');
    els.btnNext.classList.remove('hidden');
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
  }
});

// 初期化
loadProblem(currIdx);