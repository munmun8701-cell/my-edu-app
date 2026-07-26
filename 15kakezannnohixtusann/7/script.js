// --- 状態管理 ---
let sessionData = {}; 
let currPIndex = 0;   

// --- 練習問題データ (文章問題 3問) ---
const practiceData = [
  { 
    id: 1, 
    text: "1まい 125円 の 画用紙を 24まい 買います。<br>代金は いくらですか。",
    a: 125, b: 24, p1: 500, p2: 250, sum: 3000, unit: "円"
  },
  { 
    id: 2, 
    text: "1はこに 208こ の いちごが 入っています。<br>この はこが 35はこ あります。いちごは ぜんぶで 何こ ありますか。",
    a: 208, b: 35, p1: 1040, p2: 624, sum: 7280, unit: "こ"
  },
  { 
    id: 3, 
    text: "1日に 315ページ の 本を 読みます。<br>14日間で 何ページ 読むことができますか。",
    a: 315, b: 14, p1: 1260, p2: 315, sum: 4410, unit: "ページ"
  }
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

// --- 1. 587x34 のしくみ ---
function checkKufu1() {
  let ok_p1_1000 = checkCell('k1-p1-1000', '2');
  let ok_p1_100  = checkCell('k1-p1-100', '3');
  let ok_p1_10   = checkCell('k1-p1-10', '4');
  let ok_p1_1    = checkCell('k1-p1-1', '8');

  let ok_p2_1000 = checkCell('k1-p2-1000', '1');
  let ok_p2_100  = checkCell('k1-p2-100', '7');
  let ok_p2_10   = checkCell('k1-p2-10', '6');
  let ok_p2_1    = checkCell('k1-p2-1', '1'); // 1761

  let ok_s_10000 = checkCell('k1-s-10000', '1');
  let ok_s_1000  = checkCell('k1-s-1000', '9');
  let ok_s_100   = checkCell('k1-s-100', '9');
  let ok_s_10    = checkCell('k1-s-10', '5');
  let ok_s_1     = checkCell('k1-s-1', '8');

  if(ok_p1_1000 && ok_p1_100 && ok_p1_10 && ok_p1_1 && ok_p2_1000 && ok_p2_100 && ok_p2_10 && ok_p2_1 && ok_s_10000 && ok_s_1000 && ok_s_100 && ok_s_10 && ok_s_1) {
    document.getElementById('kufu1-feedback').innerText = "✨ 大正解！ かけられる数が大きくなっても計算のしかたは同じだね！";
    document.getElementById('board-summary1').classList.add('visible');
  } else {
    document.getElementById('kufu1-feedback').innerText = "";
    document.getElementById('board-summary1').classList.remove('visible');
  }
}

// --- 2. 703x25 のしくみ ---
function checkKufu2() {
  let ok_p1_1000 = checkCell('k2-p1-1000', '3');
  let ok_p1_100  = checkCell('k2-p1-100', '5');
  let ok_p1_10   = checkCell('k2-p1-10', '1');
  let ok_p1_1    = checkCell('k2-p1-1', '5');

  let ok_p2_1000 = checkCell('k2-p2-1000', '1');
  let ok_p2_100  = checkCell('k2-p2-100', '4');
  let ok_p2_10   = checkCell('k2-p2-10', '0');
  let ok_p2_1    = checkCell('k2-p2-1', '6'); // 1406

  let ok_s_10000 = checkCell('k2-s-10000', '1');
  let ok_s_1000  = checkCell('k2-s-1000', '7');
  let ok_s_100   = checkCell('k2-s-100', '5');
  let ok_s_10    = checkCell('k2-s-10', '7');
  let ok_s_1     = checkCell('k2-s-1', '5');

  if(ok_p1_1000 && ok_p1_100 && ok_p1_10 && ok_p1_1 && ok_p2_1000 && ok_p2_100 && ok_p2_10 && ok_p2_1 && ok_s_10000 && ok_s_1000 && ok_s_100 && ok_s_10 && ok_s_1) {
    document.getElementById('kufu2-feedback').innerText = "✨ 大正解！ 途中に0があっても、落ち着いて今まで通りに計算すればOK！";
    document.getElementById('board-summary2').classList.add('visible');
  } else {
    document.getElementById('kufu2-feedback').innerText = "";
    document.getElementById('board-summary2').classList.remove('visible');
  }
}

// --- セーブ＆ロード機能 ---
function saveData() {
  localStorage.setItem('math3x2Data', JSON.stringify(sessionData));
  alert("いま書いている数字を保存（セーブ）したよ！");
}

function loadData() {
  let data = localStorage.getItem('math3x2Data');
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

  // 問題文のセット
  document.getElementById('word-problem-text').innerHTML = d.text;

  // ひっ算の準備
  document.querySelectorAll('#practice-grid .val').forEach(el => el.innerText = "");
  document.getElementById('p-a-100').innerText = Math.floor(d.a / 100);
  document.getElementById('p-a-10').innerText = Math.floor((d.a % 100) / 10);
  document.getElementById('p-a-1').innerText  = d.a % 10;
  
  document.getElementById('p-b-10').innerText = Math.floor(d.b / 10);
  document.getElementById('p-b-1').innerText  = d.b % 10;

  // おたすけテキスト
  document.getElementById('h-a1').innerText = d.a;
  document.getElementById('h-b1').innerText = d.b % 10;
  document.getElementById('h-a2').innerText = d.a;
  document.getElementById('h-b2').innerText = Math.floor(d.b / 10) * 10;

  // 桁数に応じた入力欄の有効化
  const p1Str = d.p1.toString();
  toggleInput('p-p1-1000', p1Str.length >= 4);

  const p2Str = d.p2.toString();
  toggleInput('p-p2-1000', p2Str.length >= 4);

  const sumStr = d.sum.toString();
  toggleInput('p-sum-10000', sumStr.length >= 5);

  // 入力欄の初期化と復元
  const savedInputs = sessionData[currPIndex] || {};
  document.querySelectorAll('#vis-practice input[type="text"]').forEach(input => {
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

  // 式の判定
  let ok_eq_a = checkCell('eq-a', d.a.toString());
  let ok_eq_b = checkCell('eq-b', d.b.toString());
  let ok_eq_ans = checkCell('eq-ans', d.sum.toString());

  // ひっ算の判定
  const p1Str = d.p1.toString().padStart(4, ' '); 
  let ok_p1_1000 = checkCell('p-p1-1000', p1Str[0].trim());
  let ok_p1_100  = checkCell('p-p1-100', p1Str[1]);
  let ok_p1_10   = checkCell('p-p1-10', p1Str[2]);
  let ok_p1_1    = checkCell('p-p1-1', p1Str[3]);

  const p2Str = d.p2.toString().padStart(4, ' '); 
  let ok_p2_1000 = checkCell('p-p2-1000', p2Str[0].trim());
  let ok_p2_100  = checkCell('p-p2-100', p2Str[1]);
  let ok_p2_10   = checkCell('p-p2-10', p2Str[2]);
  let ok_p2_1    = checkCell('p-p2-1', p2Str[3]);

  const sumStr = d.sum.toString().padStart(5, ' '); 
  let ok_sum_10000 = checkCell('p-sum-10000', sumStr[0].trim());
  let ok_sum_1000  = checkCell('p-sum-1000', sumStr[1].trim());
  let ok_sum_100   = checkCell('p-sum-100', sumStr[2]);
  let ok_sum_10    = checkCell('p-sum-10', sumStr[3]);
  let ok_sum_1     = checkCell('p-sum-1', sumStr[4]);

  let allOk = ok_eq_a && ok_eq_b && ok_eq_ans && 
              ok_p1_1000 && ok_p1_100 && ok_p1_10 && ok_p1_1 && 
              ok_p2_1000 && ok_p2_100 && ok_p2_10 && ok_p2_1 && 
              ok_sum_10000 && ok_sum_1000 && ok_sum_100 && ok_sum_10 && ok_sum_1;

  if (allOk) {
    document.getElementById('practice-feedback').innerText = `✨ 大正解！ 答えは ${d.sum} ${d.unit} だね！`;
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
          document.getElementById('practice-feedback').innerText = "🎉 ぜんぶの文章問題をクリアしました！おめでとう！";
        }
      }, 500);
    }
  } else {
    document.getElementById('practice-feedback').innerText = "";
  }
}

function giveAdvice() {
  const d = practiceData[currPIndex];
  
  let ok_eq = (getVal('eq-a') === d.a.toString()) && (getVal('eq-b') === d.b.toString());

  const p1Str = d.p1.toString().padStart(4, ' '); 
  let ok_p1 = (getVal('p-p1-1000') === p1Str[0].trim()) && (getVal('p-p1-100') === p1Str[1]) && (getVal('p-p1-10') === p1Str[2]) && (getVal('p-p1-1') === p1Str[3]);

  const p2Str = d.p2.toString().padStart(4, ' '); 
  let ok_p2 = (getVal('p-p2-1000') === p2Str[0].trim()) && (getVal('p-p2-100') === p2Str[1]) && (getVal('p-p2-10') === p2Str[2]) && (getVal('p-p2-1') === p2Str[3]);

  const sumStr = d.sum.toString().padStart(5, ' '); 
  let ok_sum = (getVal('p-sum-10000') === sumStr[0].trim()) && (getVal('p-sum-1000') === sumStr[1].trim()) && (getVal('p-sum-100') === sumStr[2]) && (getVal('p-sum-10') === sumStr[3]) && (getVal('p-sum-1') === sumStr[4]);

  let ok_ans = getVal('eq-ans') === d.sum.toString();

  let msg = "";

  if (!ok_eq) {
    msg = "まずは問題文を読んで、「1つ分の数」×「いくつ分」の式を作ろう！";
  } else if (!ok_p1) {
    msg = `式はOK！ 1だん目の計算（${d.a} × ${d.b%10}）がちがうみたい。くり上がりをたしかめよう！`;
  } else if (!ok_p2) {
    msg = `1だん目はOK！ 2だん目の計算（${d.a} × ${Math.floor(d.b/10)}）がちがうみたい。位はずらせているかな？`;
  } else if (!ok_sum) {
    msg = `かけ算はバッチリ！ 最後の「たし算」がちがうみたい。くらいをそろえてたし算しよう！`;
  } else if (!ok_ans) {
    msg = `ひっ算はぜんぶ合っているよ！ あとは式の横に答えを書くだけだね！`;
  } else {
    msg = "ぜんぶ合っているよ！すばらしい！";
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
  if (tool === 'kufu1') text = `今までの「87×34」とくらべてみよう。かけられる数が「587」と3けたになっても、順番に計算していくやり方は同じだよ！`;
  else if (tool === 'kufu2') text = `十の位が「0」になっているね。0の計算は必ず「0」になるから、気をつけながら今まで通りに計算しよう！`;
  
  document.getElementById('hint-text').innerHTML = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }