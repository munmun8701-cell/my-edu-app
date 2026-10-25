// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputHandlers();
  setPractice(0);
});

// --- タブ切り替え ---
function switchTab(tabId) {
  document.querySelectorAll('.mission-bar .btn-outline').forEach(t => t.classList.remove('active-prob'));
  document.querySelectorAll('.visual-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active-prob');
  document.getElementById(`vis-${tabId}`).classList.add('active');
}

// --- 全角→半角変換 ＆ 自動フォーカス移動 ---
function toHalfWidthNum(str) {
  let half = str.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  return half.replace(/[^0-9]/g, '');
}

function setupInputHandlers() {
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = toHalfWidthNum(e.target.value);
      // 1文字入力されたら次のnum-boxへ自動フォーカス（maxlength=1のもののみ）
      if (e.target.value.length === 1 && e.target.classList.contains('num-box')) {
        let boxes = Array.from(e.target.closest('.math-grid').querySelectorAll('.num-box:not([readonly])'));
        let idx = boxes.indexOf(e.target);
        if (idx > -1 && idx < boxes.length - 1) {
          boxes[idx + 1].focus();
        }
      }
    });
  });
}

// 値取得ヘルパー
function getVal(id) { return document.getElementById(id).value || ""; }
function checkCell(id, expected) {
  const el = document.getElementById(id);
  if (el.value === expected.toString()) { el.classList.add('correct'); return true; }
  else { el.classList.remove('correct'); return false; }
}

// --- 1. ひっ算のしくみ ---
function checkMechanism() {
  let ok20 = checkCell('m-ans20', 240);
  let ok3  = checkCell('m-ans3', 36);
  
  let p1_10 = checkCell('m-p1-10', 3);
  let p1_1  = checkCell('m-p1-1', 6);
  
  let p2_100= checkCell('m-p2-100', 2);
  let p2_10 = checkCell('m-p2-10', 4);
  // 0 is handled visually
  
  let s100 = checkCell('m-sum-100', 2);
  let s10  = checkCell('m-sum-10', 7);
  let s1   = checkCell('m-sum-1', 6);

  if(ok20 && ok3 && p1_10 && p1_1 && p2_100 && p2_10 && s100 && s10 && s1) {
    document.getElementById('mech-feedback').innerText = "✨ 大正解！ 12×20の「240」の「0」をはぶいて書いているのが筆算のポイントだね。";
    document.getElementById('m-p2-0').innerText = "0"; // 正解したら0を表示してあげる
    document.getElementById('m-p2-0').style.color = "#ff922b";
    document.getElementById('mech-summary').classList.add('visible');
  } else {
    document.getElementById('mech-feedback').innerText = "";
    document.getElementById('m-p2-0').innerText = "";
    document.getElementById('mech-summary').classList.remove('visible');
  }
}

// --- 2. まちがいさがし ---
function checkMistake() {
  // 32 x 21
  let p1_10 = checkCell('e-p1-10', 3);
  let p1_1  = checkCell('e-p1-1', 2);
  let p2_100= checkCell('e-p2-100', 6);
  let p2_10 = checkCell('e-p2-10', 4);
  let s100  = checkCell('e-sum-100', 6);
  let s10   = checkCell('e-sum-10', 7);
  let s1    = checkCell('e-sum-1', 2);

  if(p1_10 && p1_1 && p2_100 && p2_10 && s100 && s10 && s1) {
    document.getElementById('mistake-feedback').innerText = "✨ バッチリ！ 32×1 と 32×20 を分けて計算できたね！";
  } else {
    document.getElementById('mistake-feedback').innerText = "";
  }
}

// --- 3. ワークシート（練習問題） ---
const practiceData = [
  { a: 23, b: 13, p1: 69, p2: 23, sum: 299 },
  { a: 12, b: 24, p1: 48, p2: 24, sum: 288 },
  { a: 32, b: 12, p1: 64, p2: 32, sum: 384 },
  { a: 40, b: 12, p1: 80, p2: 40, sum: 480 },
  { a: 13, b: 24, p1: 52, p2: 26, sum: 312 },
  { a: 19, b: 43, p1: 57, p2: 76, sum: 817 }
];
let currPIndex = 0;

function setPractice(idx) {
  currPIndex = idx;
  const d = practiceData[idx];
  
  // UIボタン更新
  document.querySelectorAll('.prob-selector .btn-gray').forEach((b, i) => {
    if(i === idx) b.classList.add('active-pbtn');
    else b.classList.remove('active-pbtn');
  });

  // 問題セット
  document.getElementById('p-m1-10').innerText = Math.floor(d.a / 10);
  document.getElementById('p-m1-1').innerText  = d.a % 10;
  document.getElementById('p-m2-10').innerText = Math.floor(d.b / 10);
  document.getElementById('p-m2-1').innerText  = d.b % 10;

  // おたすけモードの式テキスト更新
  document.getElementById('h-n1').innerText = d.a;
  document.getElementById('h-n2').innerText = d.b % 10;
  document.getElementById('h-n3').innerText = d.a;
  document.getElementById('h-n4').innerText = Math.floor(d.b / 10) * 10;

  // 入力クリア
  document.querySelectorAll('#practice-grid .num-box, #practice-grid .memo-box').forEach(i => {
    i.value = ''; i.classList.remove('correct');
  });
  document.getElementById('practice-feedback').innerText = '';
}

function checkPractice() {
  const d = practiceData[currPIndex];
  
  // 部分積1 (p1)
  const p1_str = d.p1.toString().padStart(3, ' '); // max 3 digits
  let ok_p1_100 = getVal('p-p1-100') === (p1_str[0] !== ' ' ? p1_str[0] : "");
  let ok_p1_10  = getVal('p-p1-10') === p1_str[1];
  let ok_p1_1   = getVal('p-p1-1') === p1_str[2];
  
  if(ok_p1_100) document.getElementById('p-p1-100').classList.add('correct'); else document.getElementById('p-p1-100').classList.remove('correct');
  if(ok_p1_10) document.getElementById('p-p1-10').classList.add('correct'); else document.getElementById('p-p1-10').classList.remove('correct');
  if(ok_p1_1) document.getElementById('p-p1-1').classList.add('correct'); else document.getElementById('p-p1-1').classList.remove('correct');

  // 部分積2 (p2)
  const p2_str = d.p2.toString().padStart(3, ' ');
  let ok_p2_1000 = getVal('p-p2-1000') === (p2_str[0] !== ' ' ? p2_str[0] : "");
  let ok_p2_100  = getVal('p-p2-100') === p2_str[1];
  let ok_p2_10   = getVal('p-p2-10') === p2_str[2];

  if(ok_p2_1000) document.getElementById('p-p2-1000').classList.add('correct'); else document.getElementById('p-p2-1000').classList.remove('correct');
  if(ok_p2_100) document.getElementById('p-p2-100').classList.add('correct'); else document.getElementById('p-p2-100').classList.remove('correct');
  if(ok_p2_10) document.getElementById('p-p2-10').classList.add('correct'); else document.getElementById('p-p2-10').classList.remove('correct');

  // たし算 (sum)
  const s_str = d.sum.toString().padStart(4, ' ');
  let ok_s_1000 = getVal('p-sum-1000') === (s_str[0] !== ' ' ? s_str[0] : "");
  let ok_s_100  = getVal('p-sum-100') === (s_str[1] !== ' ' ? s_str[1] : "");
  let ok_s_10   = getVal('p-sum-10') === s_str[2];
  let ok_s_1    = getVal('p-sum-1') === s_str[3];

  if(ok_s_1000) document.getElementById('p-sum-1000').classList.add('correct'); else document.getElementById('p-sum-1000').classList.remove('correct');
  if(ok_s_100) document.getElementById('p-sum-100').classList.add('correct'); else document.getElementById('p-sum-100').classList.remove('correct');
  if(ok_s_10) document.getElementById('p-sum-10').classList.add('correct'); else document.getElementById('p-sum-10').classList.remove('correct');
  if(ok_s_1) document.getElementById('p-sum-1').classList.add('correct'); else document.getElementById('p-sum-1').classList.remove('correct');

  let allOk = ok_p1_100 && ok_p1_10 && ok_p1_1 && ok_p2_1000 && ok_p2_100 && ok_p2_10 && ok_s_1000 && ok_s_100 && ok_s_10 && ok_s_1;
  
  if (allOk) {
    document.getElementById('practice-feedback').innerText = "✨ すばらしい！ 位をそろえて正しく計算できたね！";
  } else {
    document.getElementById('practice-feedback').innerText = "";
  }
}

// おたすけモードの切替
function toggleSupport() {
  const isChecked = document.getElementById('support-check').checked;
  const grid = document.getElementById('practice-grid');
  if (isChecked) {
    grid.classList.add('support-on');
  } else {
    grid.classList.remove('support-on');
    // メモ欄のクリア
    document.querySelectorAll('.memo-box').forEach(b => b.value = "");
  }
}

// --- ヒント ---
function showHint(tool) {
  let text = "";
  if (tool === 'mechanism') text = `左の式で計算した答えを、右の筆算の四角にも入れてみよう。<br>12×3 の答えは上の段に、12×20 の「24」は下の段に入るよ！`;
  else if (tool === 'mistake') text = `32×21 は、「32×1」の答えと「32×20」の答えをたし算しないといけないよ。<br>2段目には「32×2」の答えを、位を1つずらして書こう！`;
  
  document.getElementById('hint-text').innerHTML = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }