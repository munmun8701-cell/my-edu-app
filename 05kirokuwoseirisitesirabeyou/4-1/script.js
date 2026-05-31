// --- データ定義 ---
// 原因グラフ（ステップ1で使用）
const causeData = [16, 8, 6, 4];

// ミニグラフ用データ（ステップ2で使用）
const graphsData = {
  time:  { max: 20, values: [14, 7, 10, 3], labels: ['休み', '始業前', '授業中', 'そうじ'] },
  place: { max: 20, values: [13, 9, 6, 2, 4], labels: ['校庭', '体育館', 'ろう下', '教室', 'その他'] },
  cause: { max: 20, values: [16, 8, 6, 4], labels: ['ぶつかる', '転ぶ', 'ひねる', '落ちる'] }
};

// --- 初期化 ---
window.onload = () => {
  // 初期設定：1目盛り5人（最大50人）
  changeScale(50, 5);
  
  // ミニグラフの描画
  drawMiniGraph('mini-graph-time', graphsData.time);
  drawMiniGraph('mini-graph-place', graphsData.place);
  drawMiniGraph('mini-graph-cause', graphsData.cause);
};

// --- ステップ1：目盛りの動的変更 ---
function changeScale(maxVal, stepVal) {
  // ボタンの見た目切り替え
  document.querySelectorAll('.scale-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(maxVal === 50 ? 'btn-scale50' : 'btn-scale20').classList.add('active');
  document.getElementById('btn-scale20').classList.remove('highlight'); // クリックでハイライト解除

  // Y軸ラベルの再生成
  const yAxis = document.getElementById('dynamic-y-axis');
  yAxis.innerHTML = '';
  if (maxVal === 50) {
    [50, 40, 30, 20, 10, 0].forEach((val, i) => {
      yAxis.innerHTML += `<span style="top: ${i * 20}%">${val}</span>`;
    });
  } else {
    [20, 10, 0].forEach((val, i) => {
      yAxis.innerHTML += `<span style="top: ${i * 50}%">${val}</span>`;
    });
  }

  // 棒グラフのアニメーション
  causeData.forEach((val, index) => {
    const bar = document.getElementById(`bar-cause-${index}`);
    const percent = (val / maxVal) * 100;
    bar.style.height = `${percent}%`;
  });
}

// --- ヒントの表示切替 ---
function toggleHint(id) {
  document.getElementById(id).classList.toggle('hidden');
}

// --- ステップ2：ミニグラフの描画（レイアウト修正版） ---
function drawMiniGraph(containerId, dataObj) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  dataObj.values.forEach((val, i) => {
    // 棒とラベルを包むラッパー（flex: 1 で均等配置）
    const wrapper = document.createElement('div');
    wrapper.className = 'mini-bar-wrap';

    // グラフの棒
    const bar = document.createElement('div');
    bar.className = 'mini-bar';
    bar.style.height = `${(val / dataObj.max) * 100}%`;

    // グラフ下のラベル（縦書き）
    const label = document.createElement('div');
    label.className = 'mini-label';
    label.innerText = dataObj.labels[i];

    wrapper.appendChild(bar);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

// --- ステップ3：ポスター発表（モーダル） ---
function showPresentation() {
  // 入力されたテキストを取得
  const txtTime = document.getElementById('txt-time').value || '（時間が書かれていません）';
  const txtPlace = document.getElementById('txt-place').value || '（場所が書かれていません）';
  const txtCause = document.getElementById('txt-cause').value || '（原因が書かれていません）';

  // モーダル内にテキストをセット
  document.getElementById('result-time').innerText = txtTime;
  document.getElementById('result-place').innerText = txtPlace;
  document.getElementById('result-cause').innerText = txtCause;

  // ミニグラフをクローンしてモーダル内に表示
  document.getElementById('clone-time').innerHTML = document.getElementById('mini-graph-time').innerHTML;
  document.getElementById('clone-place').innerHTML = document.getElementById('mini-graph-place').innerHTML;
  document.getElementById('clone-cause').innerHTML = document.getElementById('mini-graph-cause').innerHTML;

  // モーダルを表示
  document.getElementById('presentation-modal').classList.remove('hidden');
}

function closePresentation() {
  document.getElementById('presentation-modal').classList.add('hidden');
}