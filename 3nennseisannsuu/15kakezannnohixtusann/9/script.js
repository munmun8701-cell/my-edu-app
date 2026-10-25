// --- 状態管理 ---
let sessionData = {}; 
let currPIndex = 0;   

// --- 練習問題データ (全8問) ---
const practiceData = [
  { id: 1, a: 21, b: 4, ans: 84, hintHTML: "<span>20×4＝80</span><br><span>1×4＝4</span><br>あわせて 80＋4" },
  { id: 2, a: 310, b: 2, ans: 620, hintHTML: "<span>31×2＝62</span><br>この答えを 10倍 する。" },
  { id: 3, a: 13, b: 20, ans: 260, hintHTML: "<span>13×2＝26</span><br>この答えを 10倍 する。" },
  { id: 4, a: 25, b: 40, ans: 1000, hintHTML: "25×40 ＝ 25×<span>4</span>×10<br>＝ <span>100</span>×10" },
  { id: 5, a: 25, b: 12, ans: 300, hintHTML: "25×12 ＝ 25×<span>4</span>×3<br>＝ <span>100</span>×3" },
  { id: 6, a: 25, b: 36, ans: 900, hintHTML: "25×36 ＝ 25×<span>4</span>×9<br>＝ <span>100</span>×9" },
  { id: 7, a: 16, b: 25, ans: 400, hintHTML: "16×25 ＝ 4×<span>4</span>×25<br>＝ 4×<span>100</span>" },
  { id: 8, a: 24, b: 25, ans: 600, hintHTML: "24×25 ＝ 6×<span>4</span>×25<br>＝ 6×<span>100</span>" }
];

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputHandlers();
  loadPractice();
});

function switchTab(tabId) {
  document.querySelectorAll('.mission-bar .btn-outline').forEach(t => t.classList.remove('active-prob'));
  document.querySelectorAll('.visual-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active-prob');
  document.getElementById(`vis-${tabId}`).classList.add('active');
}

function toHalfWidthNum(str) {
  let half = str.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  return half.replace(/[^0-9]/g, '');
}

function setupInputHandlers() {
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = toHalfWidthNum(e.target.value);
    });
  });
}

function checkCell(id, expectedStr) {
  const el = document.getElementById(id);
  if (!el || el.disabled) return true;
  if (el.value === expectedStr) { el.classList.add('correct'); return true; }
  else { el.classList.remove('correct'); return false; }
}

// --- 1. 23x3 の暗算 ---
function checkAnzan1() {
  let ok1 = checkCell('a1-p1', '60');
  let ok2 = checkCell('a1-p2', '9');
  let ok3 = checkCell('a1-sum', '69');
  let ok4 = checkCell('a1-10x-ans1', '690');
  let ok5 = checkCell('a1-10x-ans2', '690');

  if(ok1 && ok2 && ok3 && ok4 && ok5) {
    document.getElementById('anzan1-feedback').innerText = "✨ 大正解！ 数を分けたり、10倍のきまりを使うと頭の中で計算できるね！";
  } else {
    document.getElementById('anzan1-feedback').innerText = "";
  }
  checkBoardSummary();
}

// --- 2. 25x8 の暗算 ---
function checkAnzan2() {
  let ok_b1 = checkCell('a2-b1', '4');
  let ok_b2 = checkCell('a2-b2', '2');
  let ok_100 = checkCell('a2-100', '100');
  let ok_ans = checkCell('a2-ans', '200');
  let ok_r1 = checkCell('a2-r1', '8');
  let ok_r_ans = checkCell('a2-r-ans', '200');

  if(ok_b1 && ok_b2 && ok_100 && ok_ans && ok_r1 && ok_r_ans) {
    document.getElementById('anzan2-feedback').innerText = "✨ 大正解！ 25×4＝100 を見つけると、計算がとても早くなるね！";
  } else {
    document.getElementById('anzan2-feedback').innerText = "";
  }
  checkBoardSummary();
}

function checkBoardSummary() {
  // 両方のタブがクリアされたら板書を表示
  let t1_clear = document.getElementById('a1-sum').classList.contains('correct') && document.getElementById('a1-10x-ans1').classList.contains('correct');
  let t2_clear = document.getElementById('a2-ans').classList.contains('correct') && document.getElementById('a2-r-ans').classList.contains('correct');
  
  if (t1_clear || t2_clear) {
    document.getElementById('board-summary').classList.add('visible');
  }
}

// --- セーブ＆ロード機能 ---
function saveData() {
  localStorage.setItem('mathAnzanData', JSON.stringify(sessionData));
  alert("いま書いている数字を保存（セーブ）したよ！");
}

function loadData() {
  let data = localStorage.getItem('mathAnzanData');
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

  document.getElementById('p-eq-left').innerText = `${d.a} × ${d.b}`;
  document.getElementById('prac-hint-text').innerHTML = d.hintHTML;

  const savedInputs = sessionData[currPIndex] || {};
  const ansInput = document.getElementById('p-ans');
  ansInput.value = savedInputs['p-ans'] || "";
  ansInput.classList.remove('correct');

  document.getElementById('practice-feedback').innerText = '';
  document.getElementById('advice-msg').style.display = 'none';

  checkPractice(false);
}

function handlePracticeInput(el) {
  sessionData[currPIndex] = sessionData[currPIndex] || {};
  sessionData[currPIndex][el.id] = el.value;
  checkPractice(true);
}

function checkPractice(isUserTriggered = false) {
  const d = practiceData[currPIndex];
  if(!d) return;

  let isOk = checkCell('p-ans', d.ans.toString());

  if (isOk) {
    document.getElementById('practice-feedback').innerText = "✨ 大正解！ 暗算できたね！";
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
          document.getElementById('practice-feedback').innerText = "🎉 ぜんぶの問題をクリアしました！暗算マスターだ！";
        }
      }, 500);
    }
  } else {
    document.getElementById('practice-feedback').innerText = "";
  }
}

function giveAdvice() {
  const d = practiceData[currPIndex];
  let isOk = document.getElementById('p-ans').value === d.ans.toString();
  let msg = "";

  if (isOk) {
    msg = "正解しているよ！すばらしい！";
  } else {
    // ざっくりとしたアドバイス
    if (currPIndex < 3) {
      msg = "「おたすけモード」をオンにして、頭の中で計算を2つに分けるイメージをつくってみよう！";
    } else {
      msg = "25×4＝100 をつくりだすのがコツだよ。「おたすけモード」でヒントを見てみよう！";
    }
    // 未入力なら
    if (document.getElementById('p-ans').value === "") {
      msg = "まずは頭の中で計算して、答えを入れてみよう。わからなかったら「おたすけモード」を使ってね。";
    }
  }

  const adviceEl = document.getElementById('advice-msg');
  adviceEl.innerText = "🤖 アドバイス： " + msg;
  adviceEl.style.display = 'block';
  adviceEl.style.animation = "fadeIn 0.3s";
}

function toggleSupport() {
  const isChecked = document.getElementById('support-check').checked;
  const hintArea = document.getElementById('prac-hint-area');
  if (isChecked) {
    hintArea.classList.remove('hidden');
    hintArea.style.animation = "fadeIn 0.3s";
  } else {
    hintArea.classList.add('hidden');
  }
}

function showHint(tool) {
  let text = "";
  if (tool === 'anzan1') text = `「23×3」は、23を「20」と「3」に分けて、それぞれに3をかけると暗算しやすいよ！<br>「230×3」は、23×3の答えを10倍すればOK！`;
  else if (tool === 'anzan2') text = `「25×8」は、8を「4×2」に分けると、「25×4＝100」が作れてかんたんになるよ！`;
  
  document.getElementById('hint-text').innerHTML = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }