// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
  setupInputHandlers();
  renderNumberLineMarks();
  extendTo(0);
});

// --- タブ切り替え ---
function switchVisual(tabId) {
  document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.visual-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(`vis-${tabId}`).classList.add('active');
}

// --- 全角→半角変換 ---
function toHalfWidthNum(str) {
  let half = str.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  return half.replace(/[^0-9]/g, '');
}
function setupInputHandlers() {
  document.querySelectorAll('.num-input').forEach(input => {
    input.addEventListener('input', (e) => { e.target.value = toHalfWidthNum(e.target.value); });
  });
}

// --- 1. 数直線 ---
const nlSteps = [0, 1, 10, 20, 23];
const nlMax = 25; // 描画の最大幅(余裕をもたせる)

function renderNumberLineMarks() {
  const topC = document.getElementById('dnl-ticks-top');
  const botC = document.getElementById('dnl-ticks-bottom');
  
  nlSteps.forEach(step => {
    const percent = (step / nlMax) * 100;
    
    // 下の目盛り（まい）
    const bTick = document.createElement('div'); bTick.className = 'dnl-tick'; bTick.style.left = `${percent}%`;
    const bLabel = document.createElement('span'); bLabel.className = 'dnl-label label-bottom';
    bLabel.innerText = step;
    if(step===0) bLabel.style.marginLeft = "-5px";
    bTick.appendChild(bLabel); botC.appendChild(bTick);

    // 上の目盛り（円）
    const tTick = document.createElement('div'); tTick.className = 'dnl-tick'; tTick.style.left = `${percent}%`;
    const tLabel = document.createElement('span'); tLabel.className = 'dnl-label label-top';
    tLabel.innerText = step === 23 ? "？" : step * 12;
    if(step===0) tLabel.style.marginLeft = "-5px";
    tTick.appendChild(tLabel); topC.appendChild(tTick);
  });
}

function extendTo(step) {
  const percent = (step / nlMax) * 100;
  document.getElementById('dnl-fill-top').style.width = `${percent}%`;
  document.getElementById('dnl-fill-bottom').style.width = `${percent}%`;

  document.querySelectorAll('.btn-step').forEach(btn => btn.classList.remove('active-step'));
  if (step > 0) document.getElementById(`btn-nl-${step}`).classList.add('active-step');

  const msg = document.getElementById('line-msg');
  if (step === 0 || step === 1) msg.innerText = `12×20 なら暗算でできるけど…だいたいいくらかな。`;
  if (step === 10) msg.innerText = `10まいで120円だね。まだまだ買うよ。`;
  if (step === 20) msg.innerText = `12×20＝240 だから、23まいなら 240円 よりは少し高そうだね！`;
  if (step === 23) msg.innerText = `23まい分のねだんを求めるよ。20まいのときより、あと3まい多いね！`;
}

// --- 2. 図で分ける（あみさん） ---
function splitBlocks() {
  document.getElementById('block-full').classList.add('hidden');
  document.getElementById('block-parts').classList.remove('hidden');
  document.getElementById('array-msg').innerText = `「20まい」と「3まい」に分かれたね！これで計算しやすくなったよ。`;
  document.getElementById('btn-split').disabled = true;
}

// --- 3. 式で分ける（はるとさん） ---
function checkHaruto() {
  const i20 = document.getElementById('h-ans20');
  const i3 = document.getElementById('h-ans3');
  const itotal = document.getElementById('h-total');
  
  let ok20 = parseInt(i20.value) === 240;
  let ok3 = parseInt(i3.value) === 36;
  let okTot = parseInt(itotal.value) === 276;

  if(ok20) i20.classList.add('correct'); else i20.classList.remove('correct');
  if(ok3) i3.classList.add('correct'); else i3.classList.remove('correct');
  if(okTot) itotal.classList.add('correct'); else itotal.classList.remove('correct');

  if(ok20 && ok3 && okTot) {
    document.getElementById('formula-feedback').innerText = "✨ 大正解！ 2つに分けて計算して、あとで足せば答えが出るね！";
    document.getElementById('summary-box').classList.add('visible');
  } else {
    document.getElementById('formula-feedback').innerText = "";
    document.getElementById('summary-box').classList.remove('visible');
  }
}

// --- ヒント ---
function showHint(tool) {
  let text = "";
  if (tool === 'line') text = `上のボタンを順番におしてみよう。「20まい」のボタンをおすと、23まいの代金がだいたいどれくらいかわかるよ！`;
  else if (tool === 'array') text = `左のボタンをおすと、23まいのブロックが「20まい」の青いブロックと、「3まい」の赤いブロックに分かれるよ。`;
  else if (tool === 'formula') text = `まずは 12×20 の答えを入れよう。<br>次に 12×3 の答えを入れよう。<br>最後に、出た2つの答えを「たし算」して、あわせた答えを入れよう！`;
  
  document.getElementById('hint-text').innerHTML = text;
  document.getElementById('hint-modal').classList.remove('hidden');
}
function closeHint() { document.getElementById('hint-modal').classList.add('hidden'); }