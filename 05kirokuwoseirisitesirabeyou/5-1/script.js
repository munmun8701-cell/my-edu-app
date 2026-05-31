// タブ切り替え
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.mission-section').forEach(sec => sec.classList.add('hidden'));
  
  document.querySelector(`.tabs button:nth-child(${tabId})`).classList.add('active');
  document.getElementById(`mission-${tabId}`).classList.remove('hidden');
}

// ヒント切り替え
function toggleHint(id) {
  document.getElementById(id).classList.toggle('hidden');
}

// フィードバック表示
function showFeedback(id, isCorrect, msg = "") {
  const el = document.getElementById(id);
  if (isCorrect) {
    el.className = "feedback ok";
    el.innerHTML = "✨ 大正解！ばっちりです！";
  } else {
    el.className = "feedback ng";
    el.innerHTML = msg || "おしい！もう一度かくにんしてみよう。";
  }
}

// ==================== 問題1 (SVGによる正確な正の字の描画) ====================
// 教科書の書き順パス: 1:一, 2:｜, 3:右ー, 4:左｜, 5:下ー
const strokePaths = [
  "M10,10 L40,10",
  "M25,10 L25,40",
  "M25,25 L40,25",
  "M10,25 L10,40",
  "M5,40 L45,40"
];

function getSVG(strokes) {
  let paths = "";
  for (let i = 0; i < strokes; i++) {
    paths += `<path d="${strokePaths[i]}" />`;
  }
  return `<svg width="35" height="35" viewBox="0 0 50 50" style="stroke: #333; stroke-width: 4; stroke-linecap: round; fill: none;">${paths}</svg>`;
}

document.addEventListener('DOMContentLoaded', () => {
  // 教科書のあ表を正確に再現 (14人:5,5,4 / 7人:5,2 / 10人:5,5 / 3人:3)
  document.getElementById('m1-tally-1').innerHTML = getSVG(5) + getSVG(5) + getSVG(4);
  document.getElementById('m1-tally-2').innerHTML = getSVG(5) + getSVG(2);
  document.getElementById('m1-tally-3').innerHTML = getSVG(5) + getSVG(5);
  document.getElementById('m1-tally-4').innerHTML = getSVG(3);
});

function checkM1() {
  const ans = [14, 7, 10, 3, 34];
  const inputs = [
    parseInt(document.getElementById('m1-1').value),
    parseInt(document.getElementById('m1-2').value),
    parseInt(document.getElementById('m1-3').value),
    parseInt(document.getElementById('m1-4').value),
    parseInt(document.getElementById('m1-total').value)
  ];
  const isOk = inputs.every((v, i) => v === ans[i]);
  showFeedback('fb-m1', isOk, "「正」の画数をしっかりかぞえよう。計算まちがいはないかな？");
}

// ==================== 問題2 ====================
function checkM2() {
  const q1 = parseInt(document.getElementById('m2-q1').value);
  const q2 = [
    parseInt(document.getElementById('m2-q2-1').value),
    parseInt(document.getElementById('m2-q2-2').value),
    parseInt(document.getElementById('m2-q2-3').value),
    parseInt(document.getElementById('m2-q2-4').value),
    parseInt(document.getElementById('m2-q2-5').value)
  ];
  const q3 = parseInt(document.getElementById('m2-q3').value);

  const ansQ2 = [12, 9, 6, 3, 7];
  const isQ2Ok = q2.every((v, i) => v === ansQ2[i]);

  if (q1 === 1 && isQ2Ok && q3 === 4) {
    showFeedback('fb-m2', true);
  } else {
    showFeedback('fb-m2', false, "グラフのめもりを、もう一度しっかり読んでみよう！");
  }
}

// ==================== 問題3 ====================
let m3Data = [0, 0, 0, 0, 0];
const m3Ans = [1200, 950, 650, 500, 400]; // 図書館, 市役所, 交番, 駅, 公園
const M3_MAX = 1500;

function moveM3Bar(index, amount) {
  let val = m3Data[index] + amount;
  if (val >= 0 && val <= M3_MAX) {
    m3Data[index] = val;
    document.getElementById(`m3-bar${index}`).style.width = `${(val / M3_MAX) * 100}%`;
  }
}

function checkM3() {
  const isOk = m3Data.every((v, i) => v === m3Ans[i]);
  if (isOk) {
    showFeedback('fb-m3', true);
    document.querySelectorAll('.btn-group button').forEach(b => b.disabled = true);
  } else {
    showFeedback('fb-m3', false, "表の数字とグラフの長さが合っているか、かくにんしよう！");
  }
}

// ==================== 問題4 ====================
function checkM4() {
  const q1 = parseInt(document.getElementById('m4-q1').value);
  const q2 = parseInt(document.getElementById('m4-q2').value);
  const q3d = document.getElementById('m4-q3-day').value;
  const q3t = parseInt(document.getElementById('m4-q3-time').value);

  if (q1 === 5 && q2 === 50 && q3d === "土" && q3t === 55) {
    showFeedback('fb-m4', true);
  } else {
    showFeedback('fb-m4', false);
  }
}

// ==================== 問題5 ====================
function checkM5() {
  const q1 = parseInt(document.getElementById('m5-q1').value);
  const q2 = parseInt(document.getElementById('m5-q2').value);
  const q3 = parseInt(document.getElementById('m5-q3').value);
  const q4a = document.getElementById('m5-q4-a').value;
  const q4b = document.getElementById('m5-q4-b').value;

  if (q1 === 2 && q2 === 16 && q3 === 64 && q4a === "正しくない" && q4b === "正しい") {
    showFeedback('fb-m5', true);
  } else {
    showFeedback('fb-m5', false, "めもりの読みまちがいは無いかな？㋐と㋑もよく考えてみよう。");
  }
}