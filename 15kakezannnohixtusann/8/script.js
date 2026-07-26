// --- 状態管理 ---
let sessionData = {}; 
let currPIndex = 0;   
let customA = null;
let customB = null;

// --- 練習問題データ (全10問 + カスタム1問) ---
const practiceData = [
  { id: 1, a: 132, b: 23 },
  { id: 2, a: 231, b: 32 },
  { id: 3, a: 316, b: 43 },
  { id: 4, a: 214, b: 47 },
  { id: 5, a: 498, b: 75 },
  { id: 6, a: 754, b: 69 },
  { id: 7, a: 501, b: 48 }, // 途中に0
  { id: 8, a: 907, b: 93 }, // 途中に0
  { id: 9, a: 604, b: 60 }, // 途中に0 ＆ 末尾0
  { id: 10, a: 208, b: 50 },// 途中に0 ＆ 末尾0
  { id: 11, isCustom: true } // チャレンジ問題
];

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputHandlers();
  loadPractice();
});

function toHalfWidthNum(str) {
  let half = str.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  return half.replace(/[^0-9]/g, '');
}

function setupInputHandlers() {
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = toHalfWidthNum(e.target.value);
      if (e.target.value.length === 1 && e.target.classList.contains('num-box')) {
        let boxes = Array.from(e.target.closest('.math-grid').querySelectorAll('.num-box:not([disabled])'));
        let idx = boxes.indexOf(e.target);
        if (idx > -1 && idx < boxes.length - 1) {
          boxes[idx + 1].focus();
        }
      }
    });
  });
}

function getVal(id) { return document.getElementById(id) ? document.getElementById(id).value : ""; }
function checkCell(id, expectedStr) {
  const el = document.getElementById(id);
  if (!el || el.disabled) return true;
  if (el.value === expectedStr) { el.classList.add('correct'); return true; }
  else { el.classList.remove('correct'); return false; }
}

// --- セーブ＆ロード ---
function saveData() {
  localStorage.setItem('mathMatomeData', JSON.stringify(sessionData));
  alert("いま書いている数字を保存（セーブ）したよ！");
}

function loadData() {
  let data = localStorage.getItem('mathMatomeData');
  if (data) {
    sessionData = JSON.parse(data);
    loadPractice();
    alert("保存したデータを読み込んだよ！");
  } else {
    alert("保存されたデータがありませんでした。");
  }
}

// --- 練習問題の制御 ---
function loadPractice() {
  currPIndex = parseInt(document.getElementById('prob-select').value) - 1;
  const d = practiceData[currPIndex];

  document.getElementById('custom-error').innerText = "";
  document.getElementById('practice-feedback').innerText = '';
  document.getElementById('advice-msg').style.display = 'none';

  if (d.isCustom) {
    document.getElementById('custom-setup').classList.remove('hidden');
    document.getElementById('practice-stage').style.opacity = '0.3';
    document.getElementById('practice-stage').style.pointerEvents = 'none';
    
    // 復元
    if(sessionData[currPIndex] && sessionData[currPIndex].a && sessionData[currPIndex].b) {
      document.getElementById('custom-a').value = sessionData[currPIndex].a;
      document.getElementById('custom-b').value = sessionData[currPIndex].b;
      applyCustom();
    } else {
      document.querySelectorAll('#practice-grid .val').forEach(el => el.innerText = "");
      document.querySelectorAll('#practice-grid input').forEach(el => { el.value = ""; el.classList.remove('correct'); });
    }
  } else {
    document.getElementById('custom-setup').classList.add('hidden');
    document.getElementById('practice-stage').style.opacity = '1';
    document.getElementById('practice-stage').style.pointerEvents = 'auto';
    renderGrid(d.a, d.b);
  }
}

function applyCustom() {
  const aStr = document.getElementById('custom-a').value;
  const bStr = document.getElementById('custom-b').value;
  
  if(aStr.length !== 3 || bStr.length !== 2) {
    document.getElementById('custom-error').innerText = "3けた と 2けた の数字をいれてね！";
    return;
  }
  if(aStr[0] === '0' || bStr[0] === '0') {
    document.getElementById('custom-error').innerText = "一番大きい位に 0 は入れられないよ！";
    return;
  }

  document.getElementById('custom-error').innerText = "";
  document.getElementById('practice-stage').style.opacity = '1';
  document.getElementById('practice-stage').style.pointerEvents = 'auto';

  customA = parseInt(aStr);
  customB = parseInt(bStr);

  sessionData[currPIndex] = sessionData[currPIndex] || {};
  sessionData[currPIndex].a = customA;
  sessionData[currPIndex].b = customB;

  renderGrid(customA, customB);
}

function renderGrid(a, b) {
  // グリッドのリセット
  document.querySelectorAll('#practice-grid .val').forEach(el => el.innerText = "");
  document.getElementById('prac-hint-msg').innerHTML = "";

  document.getElementById('p-a-100').innerText = Math.floor(a / 100);
  document.getElementById('p-a-10').innerText = Math.floor((a % 100) / 10);
  document.getElementById('p-a-1').innerText  = a % 10;
  
  document.getElementById('p-b-10').innerText = Math.floor(b / 10);
  document.getElementById('p-b-1').innerText  = b % 10;

  let p1 = a * (b % 10);
  let p2 = a * Math.floor(b / 10);
  let sum = a * b;

  let isKufu = (b % 10 === 0);

  if (isKufu) {
    document.getElementById('prac-hint-msg').innerHTML = `💡 おたすけ：かける数の末尾が0なので、0をはぶいて「${a}×${Math.floor(b/10)}」を計算しよう！`;
    document.getElementById('row-p1').style.display = 'none';
    document.getElementById('row-p2').style.display = 'none';
    document.getElementById('h-a1').innerText = "";
  } else {
    document.getElementById('prac-hint-msg').innerHTML = "";
    document.getElementById('row-p1').style.display = 'flex';
    document.getElementById('row-p2').style.display = 'flex';
    document.getElementById('h-a1').innerText = a;
    document.getElementById('h-b1').innerText = b % 10;
    document.getElementById('h-a2').innerText = a;
    document.getElementById('h-b2').innerText = Math.floor(b / 10) * 10;
  }

  // 桁数に応じた入力欄の有効化
  if (!isKufu) {
    toggleInput('p-p1-1000', p1.toString().length >= 4);
    toggleInput('p-p2-10000', p2.toString().length >= 4); // p2は左に1桁ずれるので、元の文字数が4なら10000の位に入る
  }
  
  toggleInput('p-sum-10000', sum.toString().length >= 5);

  // 復元
  const savedInputs = sessionData[currPIndex] || {};
  document.querySelectorAll('#practice-grid .num-box, #practice-grid .memo-box').forEach(input => {
    if(!input.disabled) {
      input.value = savedInputs[input.id] || "";
      input.classList.remove('correct');
    }
  });

  checkPractice(false);
}

function toggleInput(id, isEnabled) {
  const el = document.getElementById(id);
  if (isEnabled) {
    el.disabled = false;
    el.parentElement.style.display = 'flex';
  } else {
    el.disabled = true;
    el.parentElement.style.display = 'none'; 
    el.value = "";
  }
}

function handlePracticeInput(el) {
  sessionData[currPIndex] = sessionData[currPIndex] || {};
  sessionData[currPIndex][el.id] = el.value;
  checkPractice(true);
}

function checkPractice(isUserTriggered = false) {
  const d = practiceData[currPIndex];
  let a = d.isCustom ? customA : d.a;
  let b = d.isCustom ? customB : d.b;
  if(!a || !b) return;

  let p1 = a * (b % 10);
  let p2 = a * Math.floor(b / 10);
  let sum = a * b;
  let isKufu = (b % 10 === 0);

  let allOk = true;

  if (!isKufu) {
    const p1Str = p1.toString().padStart(4, ' '); 
    let ok_p1_1000 = checkCell('p-p1-1000', p1Str[0].trim());
    let ok_p1_100  = checkCell('p-p1-100', p1Str[1]);
    let ok_p1_10   = checkCell('p-p1-10', p1Str[2]);
    let ok_p1_1    = checkCell('p-p1-1', p1Str[3]);

    const p2Str = p2.toString().padStart(4, ' '); 
    let ok_p2_10000 = checkCell('p-p2-10000', p2Str[0].trim());
    let ok_p2_1000  = checkCell('p-p2-1000', p2Str[1]);
    let ok_p2_100   = checkCell('p-p2-100', p2Str[2]);
    let ok_p2_10    = checkCell('p-p2-10', p2Str[3]);

    allOk = allOk && ok_p1_1000 && ok_p1_100 && ok_p1_10 && ok_p1_1 && ok_p2_10000 && ok_p2_1000 && ok_p2_100 && ok_p2_10;
  }

  const sumStr = sum.toString().padStart(5, ' '); 
  let ok_sum_10000 = checkCell('p-sum-10000', sumStr[0].trim());
  let ok_sum_1000  = checkCell('p-sum-1000', sumStr[1].trim());
  let ok_sum_100   = checkCell('p-sum-100', sumStr[2]);
  let ok_sum_10    = checkCell('p-sum-10', sumStr[3]);
  let ok_sum_1     = checkCell('p-sum-1', sumStr[4]);

  allOk = allOk && ok_sum_10000 && ok_sum_1000 && ok_sum_100 && ok_sum_10 && ok_sum_1;

  if (allOk) {
    document.getElementById('practice-feedback').innerText = "✨ 大正解！ ばっちりです！";
    document.getElementById('advice-msg').style.display = 'none';

    if (isUserTriggered) {
      setTimeout(() => {
        if (currPIndex < practiceData.length - 1) {
          document.getElementById('practice-feedback').innerText = "✨ 大正解！ 次の問題にすすむよ！";
          setTimeout(() => {
            document.getElementById('prob-select').value = currPIndex + 2;
            loadPractice();
          }, 1000);
        } else {
          document.getElementById('practice-feedback').innerText = "🎉 ぜんぶの問題をクリアしました！大天才！";
        }
      }, 500);
    }
  } else {
    document.getElementById('practice-feedback').innerText = "";
  }
}

function giveAdvice() {
  const d = practiceData[currPIndex];
  let a = d.isCustom ? customA : d.a;
  let b = d.isCustom ? customB : d.b;
  if(!a || !b) return;

  let p1 = a * (b % 10);
  let p2 = a * Math.floor(b / 10);
  let sum = a * b;
  let isKufu = (b % 10 === 0);

  const sumStr = sum.toString().padStart(5, ' '); 
  let ok_sum = (getVal('p-sum-10000') === sumStr[0].trim()) && (getVal('p-sum-1000') === sumStr[1].trim()) && (getVal('p-sum-100') === sumStr[2]) && (getVal('p-sum-10') === sumStr[3]) && (getVal('p-sum-1') === sumStr[4]);

  let msg = "";

  if (isKufu) {
    if (ok_sum) msg = "ぜんぶ合っているよ！すばらしい！";
    else if (getVal('p-sum-1') !== "0") msg = "かける数の末尾が0だから、答えの一の位には「0」が来るよ！";
    else msg = `「${a} × ${Math.floor(b/10)}」の計算をたしかめよう。くり上がりは正しくできたかな？`;
  } else {
    const p1Str = p1.toString().padStart(4, ' '); 
    let ok_p1 = (getVal('p-p1-1000') === p1Str[0].trim()) && (getVal('p-p1-100') === p1Str[1]) && (getVal('p-p1-10') === p1Str[2]) && (getVal('p-p1-1') === p1Str[3]);

    const p2Str = p2.toString().padStart(4, ' '); 
    let ok_p2 = (getVal('p-p2-10000') === p2Str[0].trim()) && (getVal('p-p2-1000') === p2Str[1]) && (getVal('p-p2-100') === p2Str[2]) && (getVal('p-p2-10') === p2Str[3]);

    if (!ok_p1) msg = `1だん目の計算（${a} × ${b%10}）がちがうみたい。くり上がりをたしかめよう！`;
    else if (!ok_p2) msg = `1だん目はOK！ 2だん目の計算（${a} × ${Math.floor(b/10)}）がちがうみたい。位はずらせているかな？`;
    else if (!ok_sum) msg = `かけ算はバッチリ！ 最後の「たし算」がちがうみたい。くらいをそろえてたし算しよう！`;
    else msg = "ぜんぶ合っているよ！すばらしい！";
  }

  const adviceEl = document.getElementById('advice-msg');
  adviceEl.innerText = "🤖 アドバイス： " + msg;
  adviceEl.style.display = 'block';
  adviceEl.style.animation = "fadeIn 0.3s";
}

function toggleSupport() {
  const isChecked = document.getElementById('support-check').checked;
  const grid = document.getElementById('practice-grid');
  if (isChecked) grid.classList.add('support-on');
  else grid.classList.remove('support-on');
}