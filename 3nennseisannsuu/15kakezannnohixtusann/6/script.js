// --- 状態管理 ---
let sessionData = {}; 
let currPIndex = 0;   

// --- 練習問題データ (全8問) ---
const practiceData = [
  { id: 1, type: 'A', orig_a: 14, orig_b: 20, a: 14, b: 20, ans: 280 },
  { id: 2, type: 'A', orig_a: 27, orig_b: 30, a: 27, b: 30, ans: 810 },
  { id: 3, type: 'A', orig_a: 87, orig_b: 60, a: 87, b: 60, ans: 5220 },
  { id: 4, type: 'A', orig_a: 56, orig_b: 90, a: 56, b: 90, ans: 5040 },
  { id: 5, type: 'B', orig_a: 7,  orig_b: 48, a: 48, b: 7,  ans: 336 }, 
  { id: 6, type: 'B', orig_a: 8,  orig_b: 95, a: 95, b: 8,  ans: 760 },
  { id: 7, type: 'B', orig_a: 4,  orig_b: 27, a: 27, b: 4,  ans: 108 },
  { id: 8, type: 'B', orig_a: 5,  orig_b: 32, a: 32, b: 5,  ans: 160 }
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

// --- 1. 86x30 のくふう ---
function checkKufu1() {
  let ok1000 = checkCell('k1-1000', '2');
  let ok100  = checkCell('k1-100', '5');
  let ok10   = checkCell('k1-10', '8');
  let ok1    = checkCell('k1-1', '0');

  if(ok1000 && ok100 && ok10 && ok1) {
    document.getElementById('kufu1-feedback').innerText = "✨ 大正解！ 0の計算をはぶくと、1だんで計算できるね！";
    document.getElementById('board-summary1').classList.add('visible');
  } else {
    document.getElementById('kufu1-feedback').innerText = "";
    document.getElementById('board-summary1').classList.remove('visible');
  }
}

// --- 2. 3x46 のくふう ---
function checkKufu2() {
  let ok100  = checkCell('k2-100', '1');
  let ok10   = checkCell('k2-10', '3');
  let ok1    = checkCell('k2-1', '8');

  if(ok100 && ok10 && ok1) {
    document.getElementById('kufu2-feedback').innerText = "✨ 大正解！ 入れかえて計算すると、1だんで終わってかんたんだね！";
    document.getElementById('board-summary2').classList.add('visible');
  } else {
    document.getElementById('kufu2-feedback').innerText = "";
    document.getElementById('board-summary2').classList.remove('visible');
  }
}

// --- セーブ＆ロード機能 ---
function saveData() {
  localStorage.setItem('mathKufuData', JSON.stringify(sessionData));
  alert("いま書いている数字を保存（セーブ）したよ！");
}

function loadData() {
  let data = localStorage.getItem('mathKufuData');
  if (data) {
    sessionData = JSON.parse(data);
    loadPractice();
    alert("保存したデータを読み込んだよ！");
  } else {
    alert("保存されたデータがありませんでした。");
  }
}

// --- 3. 練習問題の制御 ---
function loadPractice() {
  currPIndex = parseInt(document.getElementById('prob-select').value) - 1;
  const d = practiceData[currPIndex];

  // 練習問題グリッド内の .val 要素のみをリセット (修正ポイント)
  document.querySelectorAll('#practice-grid .val').forEach(el => el.innerText = "");
  document.getElementById('prac-hint-msg').innerHTML = "";

  if (d.type === 'A') {
    document.getElementById('prac-hint-msg').innerHTML = `💡 おたすけ：0をはぶいて「${d.a}×${Math.floor(d.b/10)}」を計算し、一の位に「0」を書こう！`;
    document.getElementById('p-a-10').innerText = Math.floor(d.a / 10);
    document.getElementById('p-a-1').innerText  = d.a % 10;
    document.getElementById('p-b-10').innerText = Math.floor(d.b / 10);
    document.getElementById('p-b-1').innerText  = d.b % 10;
  } else {
    document.getElementById('prac-hint-msg').innerHTML = `💡 おたすけ：かけ算のきまりを使って「${d.a}×${d.b}」に入れかえて計算しよう！`;
    document.getElementById('p-a-10').innerText = Math.floor(d.a / 10);
    document.getElementById('p-a-1').innerText  = d.a % 10;
    document.getElementById('p-b-1').innerText  = d.b;
  }

  const sumStr = d.ans.toString();
  toggleInput('p-ans-1000', sumStr.length >= 4);
  toggleInput('p-ans-100', sumStr.length >= 3);

  const savedInputs = sessionData[currPIndex] || {};
  document.querySelectorAll('#practice-grid input[type="text"]').forEach(input => {
    input.value = savedInputs[input.id] || "";
    input.classList.remove('correct');
  });

  document.getElementById('practice-feedback').innerText = '';
  document.getElementById('advice-msg').style.display = 'none';

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
  if(!d) return;

  const sumStr = d.ans.toString().padStart(4, ' '); 
  let ok_1000 = checkCell('p-ans-1000', sumStr[0].trim());
  let ok_100  = checkCell('p-ans-100', sumStr[1].trim());
  let ok_10   = checkCell('p-ans-10', sumStr[2]);
  let ok_1    = checkCell('p-ans-1', sumStr[3]);

  let allOk = ok_1000 && ok_100 && ok_10 && ok_1;

  if (allOk) {
    document.getElementById('practice-feedback').innerText = "✨ 大正解！ ばっちりです！";
    document.getElementById('advice-msg').style.display = 'none';

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

function giveAdvice() {
  const d = practiceData[currPIndex];
  const sumStr = d.ans.toString().padStart(4, ' '); 
  let ok_1000 = checkCell('p-ans-1000', sumStr[0].trim());
  let ok_100  = checkCell('p-ans-100', sumStr[1].trim());
  let ok_10   = checkCell('p-ans-10', sumStr[2]);
  let ok_1    = checkCell('p-ans-1', sumStr[3]);

  let allOk = ok_1000 && ok_100 && ok_10 && ok_1;
  let msg = "";

  if (allOk) {
    msg = "ぜんぶ合っているよ！すばらしい！";
  } else {
    if (d.type === 'A') {
      let isZeroOk = getVal('p-ans-1') === "0";
      if (!isZeroOk) {
        msg = "かける数の末尾が0だから、答えの一の位には「0」が来るよ！";
      } else {
        msg = `「${d.a} × ${Math.floor(d.b/10)}」の計算をたしかめよう。くり上がりは正しくできたかな？`;
      }
    } else {
      msg = `「${d.a} × ${d.b}」の計算になっているね。くり上がりのたし算をたしかめよう！`;
    }
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

function showHint(tool) {
  let text = "";
  if (tool === 'kufu1') text = `こうたさんは「86×3」を計算したあと、一の位に「0」をつけているよ。`;
  else if (tool === 'kufu2') text = `あみさんは「3×46」を「46×3」に入れかえて計算しているよ。`;
  
  document.getElementById('hint-text').innerHTML = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }