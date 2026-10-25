let sessionData = {};

// --- データ定義 ---
const q1Data = [
  { a: 80, b: 23, ans: 1840, type: 1, text: "① 1mのねだんが 80円 の リボンを 23m 買いました。<br>代金は いくらですか。" },
  { a: 73, b: 12, ans_mul: 876, ans_sub: 124, type: 2, text: "② 1本 73円 の えんぴつを 1ダース 買います。<br>1000円 出すと、おつりは いくらですか。" }
];

const q2Data = [
  { a: 48, b: 32, estA: 50, estB: 30, estAns: 1500, badMath: "&nbsp;&nbsp;48<br>×32<br><hr>&nbsp;&nbsp;96<br>144<br><hr>1536" },
  { a: 705, b: 40, estA: 700, estB: 40, estAns: 28000, badMath: "&nbsp;&nbsp;705<br>×&nbsp;40<br><hr>2820" }
];

const q3Data = [
  { a: 6, b: 70, ans: 420 }, { a: 3, b: 26, ans: 78 }, { a: 32, b: 40, ans: 1280 }, { a: 50, b: 90, ans: 4500 },
  { a: 14, b: 23, ans: 322 }, { a: 21, b: 19, ans: 399 }, { a: 30, b: 28, ans: 840 }, { a: 62, b: 95, ans: 5890 },
  { a: 76, b: 49, ans: 3724 }, { a: 86, b: 57, ans: 4902 }, { a: 18, b: 63, ans: 1134 }, { a: 532, b: 24, ans: 12768 },
  { a: 978, b: 48, ans: 46944 }, { a: 609, b: 34, ans: 20706 }, { a: 214, b: 80, ans: 17120 }
];

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputHandlers();
  loadQ1();
});

function switchTab(tabId) {
  document.querySelectorAll('.mission-bar .btn-outline').forEach(t => t.classList.remove('active-prob'));
  document.querySelectorAll('.visual-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active-prob');
  document.getElementById(`vis-${tabId}`).classList.add('active');
  if(tabId === 'q1') loadQ1();
  if(tabId === 'q2') loadQ2();
  if(tabId === 'q3') loadQ3();
}

function toHalfWidthNum(str) {
  return str.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/[^0-9]/g, '');
}

function setupInputHandlers() {
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', handleInput);
  });
}

function handleInput(e) {
  let el = e.target;
  el.value = toHalfWidthNum(el.value);
  sessionData[el.id] = el.value;
  
  if (el.value.length === 1 && el.classList.contains('num-box')) {
    let boxes = Array.from(el.closest('.math-grid').querySelectorAll('.num-box:not([disabled])'));
    let idx = boxes.indexOf(el);
    if (idx > -1 && idx < boxes.length - 1) boxes[idx + 1].focus();
  }

  if(el.id.startsWith('q1')) checkQ1(true);
  else if(el.id.startsWith('q2')) checkQ2(true);
  else if(el.id.startsWith('q3')) checkQ3(true);
}

// --- グリッド制御共通関数 ---
function setupGrid(prefix, a, b) {
  let isKufu = (b % 10 === 0);

  document.getElementById(`${prefix}-a-100`).innerText = Math.floor(a / 100) || "";
  document.getElementById(`${prefix}-a-10`).innerText = Math.floor((a % 100) / 10) || (a>=10?"0":"");
  document.getElementById(`${prefix}-a-1`).innerText  = a % 10;
  
  document.getElementById(`${prefix}-b-10`).innerText = Math.floor(b / 10) || "";
  document.getElementById(`${prefix}-b-1`).innerText  = b % 10;

  let p1 = a * (b % 10);
  let p2 = a * Math.floor(b / 10);
  let sum = a * b;

  if (isKufu) {
    document.getElementById(`${prefix}-row-p1`).style.display = 'none';
    document.getElementById(`${prefix}-row-p2`).style.display = 'none';
  } else {
    document.getElementById(`${prefix}-row-p1`).style.display = 'flex';
    document.getElementById(`${prefix}-row-p2`).style.display = 'flex';
    let ha1 = document.getElementById(`${prefix}-h-a1`);
    if(ha1) {
      ha1.innerText = a;
      document.getElementById(`${prefix}-h-b1`).innerText = b % 10;
      document.getElementById(`${prefix}-h-a2`).innerText = a;
      document.getElementById(`${prefix}-h-b2`).innerText = Math.floor(b / 10) * 10;
    }
  }

  if (!isKufu) {
    toggleInput(`${prefix}-p1-1000`, p1.toString().length >= 4);
    toggleInput(`${prefix}-p1-100`, p1.toString().length >= 3);
    toggleInput(`${prefix}-p1-10`, p1.toString().length >= 2);
    toggleInput(`${prefix}-p2-10000`, p2.toString().length >= 4);
    toggleInput(`${prefix}-p2-1000`, p2.toString().length >= 3);
    toggleInput(`${prefix}-p2-100`, p2.toString().length >= 2);
  }
  
  toggleInput(`${prefix}-sum-10000`, sum.toString().length >= 5);
  toggleInput(`${prefix}-sum-1000`, sum.toString().length >= 4);
  toggleInput(`${prefix}-sum-100`, sum.toString().length >= 3);
}

function toggleInput(id, isEnabled) {
  const el = document.getElementById(id);
  if(!el) return;
  if (isEnabled) {
    el.disabled = false;
    el.parentElement.style.display = 'flex';
  } else {
    el.disabled = true;
    el.parentElement.style.display = 'none'; 
    el.value = "";
  }
}

function checkGrid(prefix, a, b) {
  let isKufu = (b % 10 === 0);
  let p1 = a * (b % 10);
  let p2 = a * Math.floor(b / 10);
  let sum = a * b;
  let allOk = true;

  if (!isKufu) {
    const p1Str = p1.toString().padStart(4, ' '); 
    allOk &= checkCell(`${prefix}-p1-1000`, p1Str[0].trim());
    allOk &= checkCell(`${prefix}-p1-100`, p1Str[1].trim());
    allOk &= checkCell(`${prefix}-p1-10`, p1Str[2].trim());
    allOk &= checkCell(`${prefix}-p1-1`, p1Str[3].trim());

    const p2Str = p2.toString().padStart(4, ' '); 
    allOk &= checkCell(`${prefix}-p2-10000`, p2Str[0].trim());
    allOk &= checkCell(`${prefix}-p2-1000`, p2Str[1].trim());
    allOk &= checkCell(`${prefix}-p2-100`, p2Str[2].trim());
    allOk &= checkCell(`${prefix}-p2-10`, p2Str[3].trim());
  }

  const sumStr = sum.toString().padStart(5, ' '); 
  allOk &= checkCell(`${prefix}-sum-10000`, sumStr[0].trim());
  allOk &= checkCell(`${prefix}-sum-1000`, sumStr[1].trim());
  allOk &= checkCell(`${prefix}-sum-100`, sumStr[2].trim());
  allOk &= checkCell(`${prefix}-sum-10`, sumStr[3].trim());
  allOk &= checkCell(`${prefix}-sum-1`, sumStr[4].trim());

  return !!allOk;
}

function checkCell(id, expectedStr) {
  const el = document.getElementById(id);
  if (!el || el.disabled) return true;
  if (el.value === expectedStr) { el.classList.add('correct'); return true; }
  else { el.classList.remove('correct'); return false; }
}

function restoreInputs(prefix) {
  document.querySelectorAll(`input[id^="${prefix}"]`).forEach(el => {
    if(!el.disabled && !el.classList.contains('prob-select')) {
      el.value = sessionData[el.id] || "";
      el.classList.remove('correct');
    }
  });
}

function showFeedback(fbId, isOk, isTrigger, selectId, maxLen, loadFunc) {
  let fb = document.getElementById(fbId);
  if(isOk) {
    fb.innerText = "✨ 大正解！ ばっちりです！";
    if(isTrigger) {
      setTimeout(() => {
        let sel = document.getElementById(selectId);
        let curr = parseInt(sel.value);
        if(curr < maxLen) {
          fb.innerText = "✨ 大正解！ 次にすすむよ！";
          setTimeout(() => { sel.value = curr + 1; loadFunc(); }, 1000);
        } else {
          fb.innerText = "🎉 このコーナーはぜんぶクリア！おめでとう！";
        }
      }, 500);
    }
  } else {
    fb.innerText = "";
  }
}

// --- Q1 (文章問題) ---
function loadQ1() {
  let idx = document.getElementById('q1-select').value - 1;
  let d = q1Data[idx];
  document.getElementById('q1-text').innerHTML = d.text;
  document.getElementById('q1-advice-msg').style.display = 'none';
  
  if (d.type === 1) {
    document.getElementById('q1-eq-area-1').style.display = 'block';
    document.getElementById('q1-eq-area-2').style.display = 'none';
    document.getElementById('q1-hint').style.display = 'none';
  } else {
    document.getElementById('q1-eq-area-1').style.display = 'none';
    document.getElementById('q1-eq-area-2').style.display = 'flex';
    document.getElementById('q1-hint').style.display = 'block';
    document.getElementById('q1-hint').innerHTML = "💡 おたすけ：1ダースは 12本 だよ。「おつり」は出したお金から代金を引いた残りだね。";
  }

  setupGrid('q1', d.a, d.b);
  restoreInputs('q1');
  checkQ1(false);
}

function checkQ1(isTrigger) {
  let idx = document.getElementById('q1-select').value - 1;
  let d = q1Data[idx];
  let ok = checkGrid('q1', d.a, d.b);

  if (d.type === 1) {
    ok &= checkCell('q1-eq1-a', d.a.toString());
    ok &= checkCell('q1-eq1-b', d.b.toString());
    ok &= checkCell('q1-eq1-ans', d.ans.toString());
    ok &= checkCell('q1-ans1', d.ans.toString());
  } else {
    ok &= checkCell('q1-eq2-a', d.a.toString());
    ok &= checkCell('q1-eq2-b', d.b.toString());
    ok &= checkCell('q1-eq2-ans', d.ans_mul.toString());
    ok &= checkCell('q1-eq3-a', '1000');
    ok &= checkCell('q1-eq3-b', d.ans_mul.toString());
    ok &= checkCell('q1-eq3-ans', d.ans_sub.toString());
    ok &= checkCell('q1-ans2', d.ans_sub.toString());
  }
  showFeedback('q1-feedback', ok, isTrigger, 'q1-select', q1Data.length, loadQ1);
  return ok;
}

function giveAdvice(prefix) {
  let msg = "まずは計算をして、答えを入れてみよう！わからないときは「おたすけモード」をオンにしてね。";
  let ok = false;
  if(prefix==='q1') { ok = checkQ1(false); if(!ok) msg = "式がちがうか、筆算がちがうみたい。もう一度たしかめよう！"; }
  if(prefix==='q2') { ok = checkQ2(false); if(!ok) msg = "見当の計算か、筆算がちがうみたい。位がずれていないかたしかめよう！"; }
  if(prefix==='q3') { ok = checkQ3(false); if(!ok) msg = "筆算のどこかがまちがっているよ。くり上がりのたし算に気をつけよう！"; }
  
  if(ok) msg = "ぜんぶ合っているよ！すばらしい！";

  let el = document.getElementById(`${prefix}-advice-msg`);
  el.innerText = "🤖 " + msg;
  el.style.display = 'block';
  el.style.animation = "fadeIn 0.3s";
}

// --- Q2 (まちがいさがし) ---
function loadQ2() {
  let idx = document.getElementById('q2-select').value - 1;
  let d = q2Data[idx];
  document.getElementById('q2-bad-math').innerHTML = d.badMath;
  document.getElementById('q2-est-a').innerText = d.estA;
  document.getElementById('q2-est-b').innerText = d.estB;
  document.getElementById('q2-advice-msg').style.display = 'none';

  setupGrid('q2', d.a, d.b);
  restoreInputs('q2');
  checkQ2(false);
}

function checkQ2(isTrigger) {
  let idx = document.getElementById('q2-select').value - 1;
  let d = q2Data[idx];
  let ok = checkGrid('q2', d.a, d.b);
  ok &= checkCell('q2-est-ans', d.estAns.toString());
  showFeedback('q2-feedback', ok, isTrigger, 'q2-select', q2Data.length, loadQ2);
  return ok;
}

// --- Q3 (計算問題) ---
function loadQ3() {
  let idx = document.getElementById('q3-select').value - 1;
  let d = q3Data[idx];
  document.getElementById('q3-advice-msg').style.display = 'none';
  
  let a = d.a; let b = d.b;
  if(a < 10 && b >= 10) { let t = a; a = b; b = t; }

  let isKufu = (b % 10 === 0);
  let isSwapped = (a !== d.a);
  let hint = "";
  if (isSwapped) hint = `💡 おたすけ：かけ算のきまりを使って「${a}×${b}」に入れかえて計算しよう！`;
  else if (isKufu) hint = `💡 おたすけ：0をはぶいて「${a}×${Math.floor(b/10)}」を計算し、一の位に「0」を書こう！`;
  
  let hEl = document.getElementById('q3-hint');
  if(hint) { hEl.style.display = 'block'; hEl.innerHTML = hint; }
  else { hEl.style.display = 'none'; }

  setupGrid('q3', a, b);
  restoreInputs('q3');
  checkQ3(false);
}

function checkQ3(isTrigger) {
  let idx = document.getElementById('q3-select').value - 1;
  let d = q3Data[idx];
  let a = d.a; let b = d.b;
  if(a < 10 && b >= 10) { let t = a; a = b; b = t; }
  
  let ok = checkGrid('q3', a, b);
  showFeedback('q3-feedback', ok, isTrigger, 'q3-select', q3Data.length, loadQ3);
  return ok;
}

// --- セーブ＆ロード ---
function saveData() {
  localStorage.setItem('mathTashikameData', JSON.stringify(sessionData));
  alert('いま書いている数字を保存（セーブ）したよ！');
}
function loadData() {
  let data = localStorage.getItem('mathTashikameData');
  if (data) {
    sessionData = JSON.parse(data);
    restoreInputs('q1'); checkQ1(false);
    restoreInputs('q2'); checkQ2(false);
    restoreInputs('q3'); checkQ3(false);
    alert('保存したデータを読み込んだよ！');
  } else {
    alert('保存されたデータがありませんでした。');
  }
}

// --- おたすけモード ---
function toggleSupport() {
  const isChecked = document.getElementById('support-check').checked;
  document.querySelectorAll('.math-grid').forEach(grid => {
    if (isChecked) grid.classList.add('support-on');
    else grid.classList.remove('support-on');
  });
}