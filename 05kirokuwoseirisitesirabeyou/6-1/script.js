// ================= 復習エリア (SVG生成と判定) =================
const paths = [
  "M10,10 L40,10", "M25,10 L25,40", "M25,25 L40,25", "M10,25 L10,40", "M5,40 L45,40"
];

function getSVG(strokes) {
  let p = "";
  for (let i = 0; i < strokes; i++) p += `<path d="${paths[i]}" />`;
  return `<svg width="35" height="35" viewBox="0 0 50 50" style="stroke: #333; stroke-width: 4; stroke-linecap: round; fill: none;">${p}</svg>`;
}

document.addEventListener('DOMContentLoaded', () => {
  // 教科書画像1の再現 (14, 7, 10, 3)
  document.getElementById('m1-tally-1').innerHTML = getSVG(5) + getSVG(5) + getSVG(4);
  document.getElementById('m1-tally-2').innerHTML = getSVG(5) + getSVG(2);
  document.getElementById('m1-tally-3').innerHTML = getSVG(5) + getSVG(5);
  document.getElementById('m1-tally-4').innerHTML = getSVG(3);
});

function checkFukushuu() {
  const ans = [14, 7, 10, 3, 34];
  const inputs = [
    parseInt(document.getElementById('fuku-1').value),
    parseInt(document.getElementById('fuku-2').value),
    parseInt(document.getElementById('fuku-3').value),
    parseInt(document.getElementById('fuku-4').value),
    parseInt(document.getElementById('fuku-total').value)
  ];
  
  const msg = document.getElementById('fb-fuku');
  if (inputs.every((v, i) => v === ans[i])) {
    msg.className = "feedback-msg ok";
    msg.innerHTML = "✨ 大正解！ 次の本番に進もう！";
    document.getElementById('mission-1').classList.remove('active');
    document.getElementById('mission-2').classList.remove('hidden');
    document.getElementById('mission-2').classList.add('active');
  } else {
    msg.className = "feedback-msg ng";
    msg.innerHTML = "おしい！画数をよくかぞえて計算しなおそう。";
  }
}

// ================= 本番エリア (ハイライト機能) =================
// 入力欄にフォーカスが当たった時、上の表の該当箇所を光らせる
function hl(grade, cause) {
  clearHl(); // 一旦すべてクリア

  let gradesToHighlight = grade === 'all' ? ['1', '2', '3'] : [grade];
  let causesToHighlight = cause === 'all' ? ['butsukaru', 'korobu', 'hineru', 'sonota'] : [cause];

  // 合計マスが選択された場合の特殊処理
  if (grade === 'all' && cause === 'all') {
    // 全体の合計が選択されたら、上の3つの表の「合計」マスを光らせる
    document.getElementById('s-1-total').classList.add('is-highlighted');
    document.getElementById('s-2-total').classList.add('is-highlighted');
    document.getElementById('s-3-total').classList.add('is-highlighted');
    return;
  }
  
  if (cause === 'all') {
    // 縦の合計（ある学年の全原因）
    gradesToHighlight.forEach(g => {
      document.getElementById(`s-${g}-butsukaru`).classList.add('is-highlighted');
      document.getElementById(`s-${g}-korobu`).classList.add('is-highlighted');
      document.getElementById(`s-${g}-hineru`).classList.add('is-highlighted');
      document.getElementById(`s-${g}-sonota`).classList.add('is-highlighted');
    });
    return;
  }

  // 通常のマス、または横の合計（原因ごとの全学年）
  gradesToHighlight.forEach(g => {
    causesToHighlight.forEach(c => {
      const el = document.getElementById(`s-${g}-${c}`);
      if (el) el.classList.add('is-highlighted');
    });
  });
}

function clearHl() {
  document.querySelectorAll('.is-highlighted').forEach(el => {
    el.classList.remove('is-highlighted');
  });
}

// ================= まとめの表の判定 =================
function checkCombinedTable() {
  // 正解データ
  const ans = {
    'c-butsukaru-total': 29, // 8+9+12
    'c-korobu-2': 10, 'c-korobu-3': 6, 'c-korobu-total': 22,
    'c-hineru-1': 2, 'c-hineru-2': 5, 'c-hineru-3': 4, 'c-hineru-total': 11, // hineru-3 is (あ)
    'c-sonota-1': 5, 'c-sonota-2': 8, 'c-sonota-3': 7, 'c-sonota-total': 20,
    'c-total-1': 21, 'c-total-2': 32, 'c-total-3': 29, 'c-total-total': 82 // total-2 is (い), total-total is (う)
  };

  let isOk = true;
  for (let id in ans) {
    if (parseInt(document.getElementById(id).value) !== ans[id]) isOk = false;
  }

  const msg = document.getElementById('fb-combined');
  if (isOk) {
    msg.className = "feedback-msg ok";
    msg.innerHTML = "✨ かんぺき！ 1つの表にまとめられたね！下の問題も考えよう。";
    document.getElementById('thinking-area').classList.remove('hidden');
  } else {
    msg.className = "feedback-msg ng";
    msg.innerHTML = "どこかがちがうみたい。上の表が光るのをヒントにして、数字を確認しよう！";
  }
}

// ================= 思考問題の判定 =================
function checkThinking() {
  const selA = document.getElementById('sel-a').value;
  const selI = document.getElementById('sel-i').value;
  const selU = document.getElementById('sel-u').value;
  const word = document.getElementById('ans-matome').value.trim();

  const msg = document.getElementById('fb-thinking');
  if (selA === "1" && selI === "2" && selU === "3" && (word === "全体" || word === "ぜんたい" || word === "ぜん体")) {
    msg.className = "feedback-msg ok";
    msg.innerHTML = "🎉 すばらしい！二次元表のマスターだ！";
  } else {
    msg.className = "feedback-msg ng";
    msg.innerHTML = "もう少し！表の「たて」と「よこ」が交わるところは、両方の意味を持っているよ。";
  }
}