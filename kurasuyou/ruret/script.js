const appContainer = document.getElementById("appContainer");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const updateBtn = document.getElementById("updateBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const itemsInput = document.getElementById("itemsInput");
const resultText = document.getElementById("resultText");
const itemCountSpan = document.getElementById("itemCount");
const soundToggle = document.getElementById("soundToggle");
const soundLabel = document.getElementById("soundLabel");

const eventTitleInput = document.getElementById("eventTitle");
const effectSelect = document.getElementById("effectSelect");
const resultModal = document.getElementById("resultModal");
const modalTitle = document.getElementById("modalTitle");
const modalWinner = document.getElementById("modalWinner");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const winnerList = document.getElementById("winnerList");

let items = [];
let currentAngle = 0;
let velocity = 0;
let isSpinning = false;
let animationId;
let effectAnimationId;
let lastSoundIndex = -1; 
let audioCtx = null;
let drumrollGain = null;
let drumrollSource = null;

// --- 🎧 音声関連 ---
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    drumrollGain = audioCtx.createGain();
    drumrollGain.connect(audioCtx.destination);
    drumrollGain.gain.setValueAtTime(0, audioCtx.currentTime);
    startDrumrollSynthesis();
  }
}

function startDrumrollSynthesis() {
  const bufferSize = 2 * audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
  drumrollSource = audioCtx.createBufferSource();
  drumrollSource.buffer = buffer;
  drumrollSource.loop = true;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, audioCtx.currentTime);
  drumrollSource.connect(filter);
  filter.connect(drumrollGain);
  drumrollSource.start();
}

function setDrumrollVolume(volume) {
  if (!soundToggle.checked || !drumrollGain) return;
  drumrollGain.gain.setTargetAtTime(volume * 0.3, audioCtx.currentTime, 0.05);
}

function playTickSound() {
  if (!soundToggle.checked || !audioCtx || velocity > 0.1) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.03);
}

function playWinSound() {
  if (!soundToggle.checked || !audioCtx) return;
  setDrumrollVolume(0);
  const now = audioCtx.currentTime;
  const chord = [392.00, 523.25, 659.25, 783.99]; 
  chord.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = (index === 3) ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(now + 1.5);
  });
}

// --- 📺 全画面切り替え ---
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (appContainer.requestFullscreen) appContainer.requestFullscreen();
    else if (appContainer.webkitRequestFullscreen) appContainer.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
}
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) { document.body.classList.add('is-fullscreen'); fullscreenBtn.innerText = "❌"; } 
  else { document.body.classList.remove('is-fullscreen'); fullscreenBtn.innerText = "📺"; }
  setTimeout(drawWheel, 100);
});

// --- ✨ 演出エフェクト (紙吹雪 & 花火) ---
function startEffect(type) {
  if (type === "none") return;
  
  const oldCanvas = document.getElementById("effect-canvas");
  if (oldCanvas) oldCanvas.remove();
  if (effectAnimationId) cancelAnimationFrame(effectAnimationId);

  const eCanvas = document.createElement("canvas");
  eCanvas.id = "effect-canvas";
  document.body.appendChild(eCanvas);
  const eCtx = eCanvas.getContext("2d");
  eCanvas.width = window.innerWidth;
  eCanvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#ff6b6b", "#4ecdc4", "#ffb86c", "#ffd700", "#ff69b4"];

  if (type === "confetti") {
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * eCanvas.width,
        y: Math.random() * eCanvas.height - eCanvas.height,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 360,
        rotation: Math.random() * 10 - 5
      });
    }
    function animateConfetti() {
      eCtx.clearRect(0, 0, eCanvas.width, eCanvas.height);
      let alive = false;
      particles.forEach(p => {
        p.y += p.speed;
        p.angle += p.rotation;
        if (p.y < eCanvas.height) {
          alive = true;
          eCtx.save();
          eCtx.translate(p.x, p.y);
          eCtx.rotate(p.angle * Math.PI / 180);
          eCtx.fillStyle = p.color;
          eCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
          eCtx.restore();
        }
      });
      if (alive) effectAnimationId = requestAnimationFrame(animateConfetti);
      else eCanvas.remove();
    }
    animateConfetti();
  } 
  else if (type === "fireworks") {
    for(let f=0; f<5; f++) {
       const originX = eCanvas.width/2 + (Math.random()*400 - 200);
       const originY = eCanvas.height/2 + (Math.random()*200 - 100);
       for (let i = 0; i < 60; i++) {
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * 10 + 2;
          particles.push({
            x: originX, y: originY,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: Math.random() * 0.02 + 0.015
          });
       }
    }
    function animateFireworks() {
      eCtx.fillStyle = "rgba(0,0,0,0.1)"; 
      eCtx.fillRect(0, 0, eCanvas.width, eCanvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1; 
          p.life -= p.decay;
          eCtx.beginPath();
          eCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          eCtx.fillStyle = p.color;
          eCtx.globalAlpha = Math.max(0, p.life);
          eCtx.fill();
          eCtx.globalAlpha = 1;
        }
      });
      if (alive) effectAnimationId = requestAnimationFrame(animateFireworks);
      else eCanvas.remove();
    }
    animateFireworks();
  }
}

function stopEffect() {
    const eCanvas = document.getElementById("effect-canvas");
    if(eCanvas) eCanvas.remove();
    if(effectAnimationId) cancelAnimationFrame(effectAnimationId);
}

// --- 🎡 ルーレット基本ロジック ---
function shuffleList() {
  if (isSpinning) return;
  let lines = itemsInput.value.split("\n").filter(item => item.trim() !== "");
  if (lines.length < 2) return;
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }
  itemsInput.value = lines.join("\n");
  updateItems(false);
}

function updateItems(shouldAlert = true) {
  items = itemsInput.value.split("\n").map(item => item.trim()).filter(item => item !== "");
  itemCountSpan.innerText = items.length;
  currentAngle = 0;
  
  localStorage.setItem("school_roulette_items_v3", items.join("\n"));
  localStorage.setItem("school_roulette_title", eventTitleInput.value);
  localStorage.setItem("school_roulette_effect", effectSelect.value);
  
  if (shouldAlert) {
      winnerList.innerHTML = "";
  }
  
  drawWheel();
  if (shouldAlert) alert("リストと設定を保存・更新しました！");
}

function drawWheel() {
  const size = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight, 500);
  canvas.width = size; canvas.height = size;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = centerX - 10;

  if (items.length === 0) {
    ctx.fillStyle = "#ccc"; ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI); ctx.fill();
    return;
  }
  
  const arc = (2 * Math.PI) / items.length;
  
  for (let i = 0; i < items.length; i++) {
    const angle = currentAngle + i * arc;
    
    // 背景の扇形を描画
    ctx.beginPath(); ctx.fillStyle = `hsl(${i * (360 / items.length)}, 80%, 70%)`;
    ctx.moveTo(centerX, centerY); ctx.arc(centerX, centerY, radius, angle, angle + arc); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1; ctx.stroke();

    // 文字の描画
    ctx.save(); 
    ctx.translate(centerX, centerY); 
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right"; 
    ctx.fillStyle = "#333";
    
    const fontSize = Math.min(22, Math.max(10, Math.floor((radius * 1.5) / items.length)));
    ctx.font = `bold ${fontSize}px sans-serif`;
    
    let text = items[i];
    
    // ✅ 修正ポイント：文字が中心の円に食い込まないよう、最大幅を計算して自動省略
    const centerCircleRadius = radius * 0.1;
    const padding = 30; // 外側20px + 内側10pxの余白
    const maxWidth = radius - centerCircleRadius - padding;

    // 描画幅が最大幅を超えている場合、1文字ずつ削って「…」にする
    if (ctx.measureText(text).width > maxWidth) {
      for (let j = text.length; j > 0; j--) {
        let truncated = text.substring(0, j) + "…";
        if (ctx.measureText(truncated).width <= maxWidth) {
          text = truncated;
          break;
        }
      }
    }
    
    ctx.fillText(text, radius - 20, fontSize / 3);
    ctx.restore();
  }
  
  // 中心の白い円を描画
  ctx.beginPath(); ctx.fillStyle = "white"; ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI); ctx.fill();
  ctx.strokeStyle = "#ddd"; ctx.lineWidth = 2; ctx.stroke();
}

function animate() {
  currentAngle += velocity;
  if (velocity > 0.01) setDrumrollVolume(Math.min(1, velocity * 4)); 
  velocity *= 0.988; 

  if (items.length > 0 && velocity > 0 && velocity < 0.05) {
    setDrumrollVolume(0);
    const arc = (2 * Math.PI) / items.length;
    const currentSoundIndex = Math.floor(((1.5 * Math.PI - (currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / arc);
    if (currentSoundIndex !== lastSoundIndex) { playTickSound(); lastSoundIndex = currentSoundIndex; }
  }

  if (velocity < 0.001) {
    velocity = 0; isSpinning = false; spinBtn.disabled = false;
    setDrumrollVolume(0); drawWheel(); finishSpin(); return;
  }
  drawWheel();
  animationId = requestAnimationFrame(animate);
}

function startSpin() {
  if (isSpinning || items.length === 0) return;
  initAudio(); 
  isSpinning = true; spinBtn.disabled = true;
  resultText.innerHTML = "🌀 抽選中... 🌀";
  lastSoundIndex = -1;
  velocity = Math.random() * 0.2 + 0.3; 
  animate();
}

// 🏆 自動削除とモーダルの表示処理
function finishSpin() {
  const arc = (2 * Math.PI) / items.length;
  const target = (1.5 * Math.PI - (currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const winnerIndex = Math.floor(target / arc);
  const selectedItem = items[winnerIndex];

  let currentLines = itemsInput.value.split("\n").map(item => item.trim()).filter(item => item !== "");
  const removeIndex = currentLines.indexOf(selectedItem);
  if (removeIndex !== -1) {
    currentLines.splice(removeIndex, 1);
  }
  itemsInput.value = currentLines.join("\n");
  updateItems(false);

  const li = document.createElement("li");
  li.innerText = selectedItem;
  winnerList.appendChild(li);

  playWinSound();
  startEffect(effectSelect.value);

  const titleText = eventTitleInput.value.trim() || "結果";
  modalTitle.innerText = `今回の「${titleText}」は...`;
  modalWinner.innerText = selectedItem;
  resultText.innerHTML = `🎉 決定：<strong>${selectedItem}</strong> 🎉`;
  spinBtn.innerText = "もう一度回す";

  setTimeout(() => {
    resultModal.classList.add("active");
  }, 500);

  modalCloseBtn.onclick = () => {
    closeModal();
    if (items.length === 0) { 
      resultText.innerHTML = "全ての項目が選ばれました！"; 
      spinBtn.innerText = "リストを追加"; 
    }
  };
}

function closeModal() {
  resultModal.classList.remove("active");
  stopEffect();
}

// --- 起動と保存 ---
function loadInitialData() {
  const savedTitle = localStorage.getItem("school_roulette_title");
  if(savedTitle) eventTitleInput.value = savedTitle;
  const savedEffect = localStorage.getItem("school_roulette_effect");
  if(savedEffect) effectSelect.value = savedEffect;

  const savedCurrent = localStorage.getItem("school_roulette_items_v3");
  if (savedCurrent) { itemsInput.value = savedCurrent; updateItems(false); } 
  else {
    itemsInput.value = ["ドッジボール", "ケイドロ", "人狼ゲーム", "クイズ大会", "ビンゴ大会", "フルーツバスケット", "伝言ゲーム"].join("\n");
    updateItems(false);
  }
}

spinBtn.addEventListener("click", startSpin);
updateBtn.addEventListener("click", () => updateItems(true));
shuffleBtn.addEventListener("click", shuffleList);
fullscreenBtn.addEventListener("click", toggleFullscreen);
soundToggle.addEventListener("change", () => {
  initAudio(); soundLabel.innerText = soundToggle.checked ? "🔊 ON" : "🔇 OFF";
  if(!soundToggle.checked) setDrumrollVolume(0);
});

document.getElementById("saveHistoryBtn").addEventListener("click", () => {
    if(!itemsInput.value.trim()) return;
    localStorage.setItem("school_roulette_history_1", itemsInput.value);
    alert("保存しました！");
});
document.getElementById("loadHistoryBtn").addEventListener("click", () => {
    const data = localStorage.getItem("school_roulette_history_1");
    if(data) { itemsInput.value = data; updateItems(true); }
});

window.addEventListener('resize', drawWheel);
loadInitialData();
setTimeout(drawWheel, 100);