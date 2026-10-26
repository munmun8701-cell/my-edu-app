// ====== 便利関数 ======
// 児童がタブレット等で全角入力しても半角に自動変換する機能
function toHalfWidth(str) {
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

// ヒントの表示切り替え
function toggleHint(id) {
  const hintEl = document.getElementById(id);
  hintEl.classList.toggle('hidden');
}

// 正解・不正解の表示UI
function showResult(elementId, isCorrect) {
  const el = document.getElementById(elementId);
  if (isCorrect) {
    el.innerHTML = '<span style="color:#e53935;">💮 大正解！ばっちりだね！</span>';
  } else {
    el.innerHTML = '<span style="color:#1e88e5;">惜しい！もういちど 見直してみよう。</span>';
  }
}

// ====== p.93 導入問題の判定 ======
function checkPage93() {
  const q1_1000 = toHalfWidth(document.getElementById('q1-1000').value).trim();
  const q1_100 = toHalfWidth(document.getElementById('q1-100').value).trim();
  const q1_10 = toHalfWidth(document.getElementById('q1-10').value).trim();
  const q1_1 = toHalfWidth(document.getElementById('q1-1').value).trim();
  const q1_10000 = toHalfWidth(document.getElementById('q1-10000').value).trim();

  // 教科書通りの答え: 24, 1, 5, 3 と 10000の束は2こ
  const isCorrect = (q1_1000 === '24' && q1_100 === '1' && q1_10 === '5' && q1_1 === '3' && q1_10000 === '2');
  showResult('result93', isCorrect);
}

// ====== p.94 シミュレーター機能 ======
const state = { man: 0, sen: 0, hyaku: 0, ju: 0, ichi: 0 };
const places = ['man', 'sen', 'hyaku', 'ju', 'ichi'];
const values = { man: 10000, sen: 1000, hyaku: 100, ju: 10, ichi: 1 };

function updateSimulator() {
  let total = 0;
  
  places.forEach(place => {
    const count = state[place];
    total += count * values[place];

    // ドットの描画 (最大9個まで)
    const dotDisplay = document.getElementById(`dots-${place}`);
    dotDisplay.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'sim-dot';
      dotDisplay.appendChild(dot);
    }

    // 数字の描画
    document.getElementById(`digit-${place}`).innerText = count;
  });

  document.getElementById('sim-total-num').innerText = total;
}

// ボタンイベントの登録
document.querySelectorAll('.ctrl-btn.plus').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const place = e.target.getAttribute('data-place');
    if (state[place] < 9) {
      state[place]++;
      updateSimulator();
    } else {
      alert('これ以上は位が上がるから置けないよ！');
    }
  });
});

document.querySelectorAll('.ctrl-btn.minus').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const place = e.target.getAttribute('data-place');
    if (state[place] > 0) {
      state[place]--;
      updateSimulator();
    }
  });
});

// 24153 セットボタン
document.getElementById('set-example').addEventListener('click', () => {
  state.man = 2; state.sen = 4; state.hyaku = 1; state.ju = 5; state.ichi = 3;
  updateSimulator();
});

// リセットボタン
document.getElementById('sim-reset').addEventListener('click', () => {
  places.forEach(p => state[p] = 0);
  updateSimulator();
});

// p.94 Q4の判定
function checkPage94Q4() {
  const ans = toHalfWidth(document.getElementById('q4-ans').value).trim();
  showResult('result94', ans === '2');
}

// ====== p.94 練習問題の判定 ======
function checkPractice() {
  const p1_num = toHalfWidth(document.getElementById('prac1-num').value).trim();
  const p1_read = document.getElementById('prac1-read').value.trim(); // 漢字は全角のまま
  
  const p2_num = toHalfWidth(document.getElementById('prac2-num').value).trim();
  const p2_read = document.getElementById('prac2-read').value.trim();

  // 空白除去などの揺れを許容
  const formatRead = (str) => str.replace(/\s+/g, '');

  const q1_ok = (p1_num === '36254') && (formatRead(p1_read) === '三万六千二百五十四');
  const q2_ok = (p2_num === '62030') && (formatRead(p2_read) === '六万二千三十');

  showResult('result-prac', q1_ok && q2_ok);
}

// 初期化
updateSimulator();