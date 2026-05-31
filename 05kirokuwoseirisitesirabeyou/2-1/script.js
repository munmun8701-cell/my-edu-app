// 教科書のデータと画数
const dataSets = [
  { name: "休み時間", value: 14, tallies: [5, 5, 4] },
  { name: "始業前・放か後", value: 7, tallies: [5, 2] },
  { name: "じゅ業中", value: 10, tallies: [5, 5] },
  { name: "そうじ時間", value: 3, tallies: [3] }
];

const TOTAL_VALUE = 34;
const MAX_GRAPH = 15;
let currentGraph = [0, 0, 0, 0];

// 教科書の「正」の書き順（1:上, 2:中縦, 3:中右横, 4:左縦, 5:下）
const tallyPaths = [
  "M10,10 L40,10", // 1画目
  "M25,10 L25,40", // 2画目
  "M25,25 L40,25", // 3画目
  "M10,25 L10,40", // 4画目
  "M5,40 L45,40"   // 5画目
];

// 指定された画数分のSVGを生成する関数（正確な表記のため）
function createTallySVG(strokes) {
  let paths = "";
  for (let i = 0; i < strokes; i++) {
    paths += `<path d="${tallyPaths[i]}" />`;
  }
  return `<svg width="45" height="45" viewBox="0 0 50 50" style="stroke: #37474f; stroke-width: 4; stroke-linecap: round; fill: none;">${paths}</svg>`;
}

// 起動時の初期化
window.onload = () => {
  const tbody = document.getElementById("tally-tbody");
  dataSets.forEach((d, index) => {
    // 正の字のSVGを並べる
    const svgs = d.tallies.map(strokes => createTallySVG(strokes)).join("");
    
    tbody.innerHTML += `
      <tr>
        <td>${d.name}</td>
        <td><div class="tally-area">${svgs}</div></td>
        <td><input type="number" id="input-val-${index}" class="num-input"></td>
      </tr>
    `;
  });
};

// ステップ1：表の答え合わせ
function checkStep1() {
  let allCorrect = true;
  dataSets.forEach((d, index) => {
    const val = parseInt(document.getElementById(`input-val-${index}`).value) || 0;
    if (val !== d.value) allCorrect = false;
  });
  const total = parseInt(document.getElementById("ans-total").value) || 0;
  if (total !== TOTAL_VALUE) allCorrect = false;

  const fb = document.getElementById("feedback1");
  if (allCorrect) {
    fb.innerHTML = "✨ ばっちり大正解！ 下のグラフ作成に進もう！";
    fb.className = "feedback correct-txt";
    document.getElementById("step2").classList.remove("hidden");
    document.getElementById("btn-step1").style.display = "none";
  } else {
    fb.innerHTML = "おしい！「正」は5人分だよ。もう一度数えてみよう。";
    fb.className = "feedback error-txt";
  }
}

// ステップ2：グラフの棒を動かす
function changeBar(index, amount) {
  let newVal = currentGraph[index] + amount;
  // 0〜15の範囲内でのみ動かす
  if (newVal >= 0 && newVal <= MAX_GRAPH) {
    currentGraph[index] = newVal;
    const bar = document.getElementById(`bar-${index}`);
    // 高さのパーセンテージ計算 (例: 15マス中15なら100%)
    const heightPercent = (newVal / MAX_GRAPH) * 100;
    bar.style.height = `${heightPercent}%`;
  }
}

// ステップ2：グラフの答え合わせ
function checkStep2() {
  let isCorrect = true;
  dataSets.forEach((d, index) => {
    if (currentGraph[index] !== d.value) isCorrect = false;
  });

  const fb = document.getElementById("feedback2");
  if (isCorrect) {
    fb.innerHTML = "🎉 グラフが完成したね！ 最後の問題に進もう！";
    fb.className = "feedback correct-txt";
    document.getElementById("step3").classList.remove("hidden");
    document.getElementById("btn-step2").style.display = "none";
    // ボタンを押せなくする
    document.querySelectorAll('.control-slot button').forEach(btn => btn.disabled = true);
  } else {
    fb.innerHTML = "表の数字と、グラフの高さが合っているか確認しよう！";
    fb.className = "feedback error-txt";
  }
}

// ステップ3：ヒントの表示切替
function toggleHint(id) {
  const el = document.getElementById(id);
  if (el.classList.contains("hidden")) {
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}