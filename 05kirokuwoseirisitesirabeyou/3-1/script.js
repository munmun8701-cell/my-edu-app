// 正解データ（149ページの集計結果）
const correctData = [
  { name: "校庭", value: 13 },
  { name: "体育館", value: 9 },
  { name: "ろう下", value: 6 },
  { name: "教室", value: 2 },
  { name: "その他", value: 4 } // げんかん, トイレ, 花だん, 階だんの合計
];
const TOTAL_VALUE = 34;

// ユーザーの入力状態
let tallyCounts = [0, 0, 0, 0, 0];
let graphCounts = [0, 0, 0, 0, 0];

// 正の字のSVG描画パス
const strokePaths = [
  "M10,10 L40,10", // 一
  "M25,10 L25,40", // ｜
  "M25,25 L40,25", // 右ー
  "M10,25 L10,40", // 左｜
  "M5,40 L45,40"   // 下ー
];

window.onload = () => {
  renderTallyBoard();
};

// --- ミッション1：正の字集計 ---
function renderTallyBoard() {
  const board = document.getElementById("tally-board");
  board.innerHTML = correctData.map((d, i) => `
    <div class="tally-row">
      <div class="tally-name">${d.name}</div>
      <div class="tally-svgs" id="svg-area-${i}"></div>
      <div class="tally-controls">
        <button onclick="changeTally(${i}, -1)">ー</button>
        <button class="add-btn" onclick="changeTally(${i}, 1)">＋</button>
      </div>
    </div>
  `).join("");
  updateAllTallySVGs();
}

function changeTally(index, amount) {
  if (tallyCounts[index] + amount >= 0) {
    tallyCounts[index] += amount;
    updateTallySVG(index);
  }
}

function updateAllTallySVGs() {
  tallyCounts.forEach((_, i) => updateTallySVG(i));
}

function updateTallySVG(index) {
  const count = tallyCounts[index];
  const full = Math.floor(count / 5);
  const remainder = count % 5;
  let html = "";
  
  for (let i = 0; i < full; i++) html += getSVG(5);
  if (remainder > 0) html += getSVG(remainder);
  
  document.getElementById(`svg-area-${index}`).innerHTML = html;
}

function getSVG(strokes) {
  let paths = "";
  for (let i = 0; i < strokes; i++) paths += `<path d="${strokePaths[i]}" />`;
  return `<svg width="40" height="40" viewBox="0 0 50 50" style="stroke: #333; stroke-width: 4; stroke-linecap: round; fill: none;">${paths}</svg>`;
}

function checkMission1() {
  const isOk = tallyCounts.every((val, i) => val === correctData[i].value);
  const msg = document.getElementById("msg-m1");
  if (isOk) {
    msg.className = "feedback-msg ok-msg";
    msg.innerHTML = "✨ ばっちり！数が少ない場所を「その他」にまとめられたね！";
    unlockMission(1, 2);
  } else {
    msg.className = "feedback-msg ng-msg";
    msg.innerHTML = "おしい！「その他」の数えわすれはないかな？もう一度かくにんしよう。";
  }
}

// --- ミッション2：表への変換 ---
function checkMission2() {
  let isOk = true;
  correctData.forEach((d, i) => {
    if (parseInt(document.getElementById(`num-${i}`).value) !== d.value) isOk = false;
  });
  if (parseInt(document.getElementById("num-total").value) !== TOTAL_VALUE) isOk = false;

  const msg = document.getElementById("msg-m2");
  if (isOk) {
    msg.className = "feedback-msg ok-msg";
    msg.innerHTML = "✨ 大正解！計算もバッチリだね！";
    unlockMission(2, 3);
  } else {
    msg.className = "feedback-msg ng-msg";
    msg.innerHTML = "「正」の字をよく見て、数字が合っているかたしかめよう。";
  }
}

// --- ミッション3：グラフの作成 ---
function moveBar(index, amount) {
  const MAX = 15;
  if (graphCounts[index] + amount >= 0 && graphCounts[index] + amount <= MAX) {
    graphCounts[index] += amount;
    const percent = (graphCounts[index] / MAX) * 100;
    document.getElementById(`bar-${index}`).style.height = `${percent}%`;
  }
}

function checkMission3() {
  const isOk = graphCounts.every((val, i) => val === correctData[i].value);
  const msg = document.getElementById("msg-m3");
  if (isOk) {
    msg.className = "feedback-msg ok-msg";
    msg.innerHTML = "🎉 かんぺき！正しいぼうグラフができたね！";
    document.getElementById("btn-m3").style.display = "none";
    document.getElementById("clear-screen").classList.remove("hidden");
    // ボタン無効化
    document.querySelectorAll('.control-btn-group button').forEach(b => b.disabled = true);
  } else {
    msg.className = "feedback-msg ng-msg";
    msg.innerHTML = "表の数字と、グラフの高さが同じになっているか確認しよう。";
  }
}

// --- 共通ユーティリティ ---
function unlockMission(current, next) {
  document.getElementById(`btn-m${current}`).style.display = "none";
  document.getElementById(`mission${current}`).classList.remove("active");
  const nextMission = document.getElementById(`mission${next}`);
  nextMission.classList.remove("hidden");
  nextMission.classList.add("active");
}

function toggleHint(id) {
  const el = document.getElementById(id);
  el.classList.toggle("hidden");
}