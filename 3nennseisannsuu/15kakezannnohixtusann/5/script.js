// --- 状態管理 ---
let sessionData = {}; // 各問題の入力状況を保存するオブジェクト
let currPIndex = 0;   // 現在開いている練習問題のインデックス

// --- 練習問題データ (15問) ---
const practiceData = [
  { a: 36, b: 47, p1: 252, p2: 144, sum: 1692 },
  { a: 32, b: 48, p1: 256, p2: 128, sum: 1536 },
  { a: 76, b: 59, p1: 684, p2: 380, sum: 4484 },
  { a: 70, b: 86, p1: 420, p2: 560, sum: 6020 },
  { a: 52, b: 83, p1: 156, p2: 416, sum: 4316 },
  { a: 23, b: 26, p1: 138, p2: 46,  sum: 598 },  
  { a: 42, b: 17, p1: 294, p2: 42,  sum: 714 },  
  { a: 25, b: 36, p1: 150, p2: 75,  sum: 900 },  
  { a: 38, b: 25, p1: 190, p2: 76,  sum: 950 },  
  { a: 57, b: 19, p1: 513, p2: 57,  sum: 1083 }, 
  { a: 24, b: 83, p1: 72,  p2: 192, sum: 1992 }, 
  { a: 45, b: 82, p1: 90,  p2: 360, sum: 3690 }, 
  { a: 27, b: 73, p1: 81,  p2: 189, sum: 1971 }, 
  { a: 16, b: 75, p1: 80,  p2: 120, sum: 1200 }, 
  { a: 39, b: 62, p1: 78,  p2: 234, sum: 2418 }  
];

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputHandlers();
  loadPractice();
});

// --- タブ切り替え ---
function switchTab(tabId) {
  document.querySelectorAll('.mission-bar .btn-outline').forEach(t => t.classList.remove('active-prob'));
  document.querySelectorAll('.visual-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active-prob');
  document.getElementById(`vis-${tabId}`).classList.add('active');
}

// --- 全角→半角変換 ---
function toHalfWidthNum(str) {
  let half = str.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  return half.replace(/[^0-9]/g, '');
}

function setupInputHandlers() {
  // 自動フォーカスのみ設定 (データ保存は handlePracticeInput で実施)
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

// --- 1. ひっ算のしかた (比較) ---
function checkComp() {
  let ok_p1_100 = checkCell('c-p1-100', '3');
  let ok_p1_10  = checkCell('c-p1-10', '4');
  let ok_p1_1   = checkCell('c-p1-1', '8');
  let ok_p2_1000 = checkCell('c-p2-1000', '2');
  let ok_p2_100  = checkCell('c-p2-100', '3');
  let ok_p2_10   = checkCell('c-p2-10', '2');
  let ok_s_1000 = checkCell('c-sum-1000', '2');
  let ok_s_100  = checkCell('c-sum-100', '6');
  let ok_s_10   = checkCell('c-sum-10', '6');
  let ok_s_1    = checkCell('c-sum-1', '8');

  if(ok_p1_100 && ok_p1_10 && ok_p1_1 && ok_p2_1000 && ok_p2_100 && ok_p2_10 && ok_s_1000 && ok_s_100 && ok_s_10 && ok_s_1) {
    document.getElementById('comp-feedback').innerText = "✨ 大正解！ 部分積が3けたになっても、やり方は同じだね！";
    document.getElementById('c-zero').innerText = "0"; 
    document.getElementById('board-summary').classList.add('visible');
  } else {
    document.getElementById('comp-feedback').innerText = "";
    document.getElementById('c-zero').innerText = "";
    document.getElementById('board-summary').classList.remove('visible');
  }
}

// --- セーブ＆ロード機能 ---
function saveData() {
  localStorage.setItem('mathPracticeData', JSON.stringify(sessionData));
  alert("いま書いている数字を保存（セーブ）したよ！");
}

function loadData() {
  let data = localStorage.getItem('mathPracticeData');
  if (data) {
    sessionData = JSON.parse(data);
    loadPractice();
    alert("保存したデータを読み込んだよ！");
  } else {
    alert("保存されたデータがありませんでした。");
  }
}

// --- 2. 練習問題の制御 ---
function loadPractice() {
  currPIndex = parseInt(document.getElementById('prob-select').value) - 1;
  const d = practiceData[currPIndex];

  // 問題セット
  document.getElementById('p-a-10').innerText = Math.floor(d.a / 10);
  document.getElementById('p-a-1').innerText  = d.a % 10;
  document.getElementById('p-b-10').innerText = Math.floor(d.b / 10);
  document.getElementById('p-b-1').innerText  = d.b % 10;

  // おたすけテキスト
  document.getElementById('h-a1').innerText = d.a;
  document.getElementById('h-b1').innerText = d.b % 10;
  document.getElementById('h-a2').innerText = d.a;
  document.getElementById('h-b2').innerText = Math.floor(d.b / 10) * 10;

  // 桁数に応じた入力欄の有効化
  toggleInput('p-p1-100', d.p1.toString().length >= 3);
  toggleInput('p-p2-1000', d.p2.toString().length >= 3);
  toggleInput('p-sum-1000', d.sum.toString().length >= 4);

  // 入力欄の初期化と復元
  const savedInputs = sessionData[currPIndex] || {};
  document.querySelectorAll('#practice-grid input[type="text"]').forEach(input => {
    input.value = savedInputs[input.id] || "";
    input.classList.remove('correct');
  });

  document.getElementById('practice-feedback').innerText = '';
  document.getElementById('advice-msg').style.display = 'none';

  // 復元したデータで判定を走らせる（自動進行はさせない）
  checkPractice(false);
}

function toggleInput(id, isEnabled) {
  const el = document.getElementById(id);
  if (isEnabled) {
    el.disabled = false;
    el.style.visibility = 'visible';
  } else {
    el.disabled = true;
    el.style.visibility = 'hidden';
  }
}

// 入力イベント（データ保存と判定）
function handlePracticeInput(el) {
  // sessionDataに現在値を記憶
  sessionData[currPIndex] = sessionData[currPIndex] || {};
  sessionData[currPIndex][el.id] = el.value;
  
  checkPractice(true);
}

function checkPractice(isUserTriggered = false) {
  const d = practiceData[currPIndex];
  if(!d) return;

  const p1Str = d.p1.toString().padStart(3, ' '); 
  let ok_p1_100 = checkCell('p-p1-100', p1Str[0].trim());
  let ok_p1_10  = checkCell('p-p1-10', p1Str[1]);
  let ok_p1_1   = checkCell('p-p1-1', p1Str[2]);

  const p2Str = d.p2.toString().padStart(3, ' ');
  let ok_p2_1000 = checkCell('p-p2-1000', p2Str[0].trim());
  let ok_p2_100  = checkCell('p-p2-100', p2Str[1]);
  let ok_p2_10   = checkCell('p-p2-10', p2Str[2]);

  const sumStr = d.sum.toString().padStart(4, ' '); 
  let ok_sum_1000 = checkCell('p-sum-1000', sumStr[0].trim());
  let ok_sum_100  = checkCell('p-sum-100', sumStr[1].trim());
  let ok_sum_10   = checkCell('p-sum-10', sumStr[2]);
  let ok_sum_1    = checkCell('p-sum-1', sumStr[3]);

  let allOk = ok_p1_100 && ok_p1_10 && ok_p1_1 && ok_p2_1000 && ok_p2_100 && ok_p2_10 && ok_sum_1000 && ok_sum_100 && ok_sum_10 && ok_sum_1;

  if (allOk) {
    document.getElementById('practice-feedback').innerText = "✨ 大正解！ ばっちりです！";
    document.getElementById('advice-msg').style.display = 'none';

    // 自動進行機能（ユーザーが入力して正解になった場合のみ発動）
    if (isUserTriggered) {
      document.getElementById('practice-feedback').innerText = "✨ 大正解！ 次の問題にすすむよ！";
      setTimeout(() => {
        if (currPIndex < practiceData.length - 1) {
          document.getElementById('prob-select').value = currPIndex + 2;
          loadPractice();
        } else {
          document.getElementById('practice-feedback').innerText = "🎉 ぜんぶの問題をクリアしました！おめでとう！";
        }
      }, 1500);
    }
  } else {
    document.getElementById('practice-feedback').innerText = "";
  }
}

// アドバイス機能（AI先生）
function giveAdvice() {
  const d = practiceData[currPIndex];
  
  const p1Str = d.p1.toString().padStart(3, ' '); 
  let ok_p1 = (getVal('p-p1-100') === p1Str[0].trim()) && (getVal('p-p1-10') === p1Str[1]) && (getVal('p-p1-1') === p1Str[2]);

  const p2Str = d.p2.toString().padStart(3, ' ');
  let ok_p2 = (getVal('p-p2-1000') === p2Str[0].trim()) && (getVal('p-p2-100') === p2Str[1]) && (getVal('p-p2-10') === p2Str[2]);

  const sumStr = d.sum.toString().padStart(4, ' '); 
  let ok_sum = (getVal('p-sum-1000') === sumStr[0].trim()) && (getVal('p-sum-100') === sumStr[1].trim()) && (getVal('p-sum-10') === sumStr[2]) && (getVal('p-sum-1') === sumStr[3]);

  let msg = "";
  if (!ok_p1) {
    msg = `1だん目の計算（${d.a} × ${d.b%10}）がちがうみたい。かけ算のくり上がりをたしかめよう！`;
  } else if (!ok_p2) {
    msg = `1だん目はOK！ 2だん目の計算（${d.a} × ${Math.floor(d.b/10)}）がちがうみたい。位をずらして書けているかな？`;
  } else if (!ok_sum) {
    msg = `かけ算はバッチリ！ 最後の「たし算」がちがうみたい。くらいをそろえてたし算しよう！`;
  } else {
    msg = "ぜんぶ合っているよ！すばらしい！";
  }

  const adviceEl = document.getElementById('advice-msg');
  adviceEl.innerText = "🤖 アドバイス： " + msg;
  adviceEl.style.display = 'block';
  adviceEl.style.animation = "fadeIn 0.3s";
}

// おたすけモード
function toggleSupport() {
  const isChecked = document.getElementById('support-check').checked;
  const grid = document.getElementById('practice-grid');
  if (isChecked) grid.classList.add('support-on');
  else grid.classList.remove('support-on');
}