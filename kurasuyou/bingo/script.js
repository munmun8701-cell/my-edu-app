const appContainer = document.getElementById("appContainer");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const soundToggle = document.getElementById("soundToggle");
const soundLabel = document.getElementById("soundLabel");

// 画面切り替え
const modeSelection = document.getElementById("modeSelection");
const teacherView = document.getElementById("teacherView");
const studentView = document.getElementById("studentView");
const btnTeacherMode = document.getElementById("btnTeacherMode");
const btnStudentMode = document.getElementById("btnStudentMode");

// 先生用要素
const drawBtn = document.getElementById("drawBtn");
const currentNumberEl = document.getElementById("currentNumber");
const drawResultText = document.getElementById("drawResultText");
const numberBoard = document.getElementById("numberBoard");
const resetTeacherBtn = document.getElementById("resetTeacherBtn");

// 子ども用要素
const generateCardBtn = document.getElementById("generateCardBtn");
const bingoBtn = document.getElementById("bingoBtn");
const bingoGrid = document.getElementById("bingoGrid");

// データ
const MAX_NUMBER = 99;
let drawnNumbers = [];
let isDrawing = false;
let studentCardData = [];
let markedCells = [];

// 音声関連
let audioCtx = null;
let drumrollGain = null;
let drumrollSource = null;

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

function playDrumroll() {
  if (!soundToggle.checked || !audioCtx) return;
  drumrollGain.gain.setTargetAtTime(0.3, audioCtx.currentTime, 0.05);
}
function stopDrumroll() {
  if (!drumrollGain) return;
  drumrollGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
}

function playWinSound() {
  if (!soundToggle.checked || !audioCtx) return;
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

function playMarkSound() {
  if (!soundToggle.checked || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

// 演出：紙吹雪
function startConfetti() {
  const oldCanvas = document.getElementById("effect-canvas");
  if (oldCanvas) oldCanvas.remove();
  const eCanvas = document.createElement("canvas");
  eCanvas.id = "effect-canvas";
  document.body.appendChild(eCanvas);
  const eCtx = eCanvas.getContext("2d");
  eCanvas.width = window.innerWidth; eCanvas.height = window.innerHeight;
  const particles = [];
  const colors = ["#ff6b6b", "#4ecdc4", "#ffb86c", "#ffd700", "#ff69b4"];
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random() * eCanvas.width, y: Math.random() * eCanvas.height - eCanvas.height,
      size: Math.random() * 10 + 5, color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 4 + 2, angle: Math.random() * 360, rotation: Math.random() * 10 - 5
    });
  }
  function animate() {
    eCtx.clearRect(0, 0, eCanvas.width, eCanvas.height);
    let alive = false;
    particles.forEach(p => {
      p.y += p.speed; p.angle += p.rotation;
      if (p.y < eCanvas.height) {
        alive = true;
        eCtx.save(); eCtx.translate(p.x, p.y); eCtx.rotate(p.angle * Math.PI / 180);
        eCtx.fillStyle = p.color; eCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6); eCtx.restore();
      }
    });
    if (alive) requestAnimationFrame(animate); else eCanvas.remove();
  }
  animate();
}

// ============== 👩‍🏫 先生モードの処理 ==============
function initTeacherBoard() {
  numberBoard.innerHTML = "";
  for (let i = 1; i <= MAX_NUMBER; i++) {
    const cell = document.createElement("div");
    cell.className = "board-cell";
    cell.id = `board-cell-${i}`;
    cell.innerText = i;
    if (drawnNumbers.includes(i)) cell.classList.add("drawn");
    numberBoard.appendChild(cell);
  }
}

function drawNumber() {
  if (isDrawing || drawnNumbers.length >= MAX_NUMBER) return;
  initAudio();
  isDrawing = true;
  drawBtn.disabled = true;
  drawResultText.innerText = "🌀 抽選中... 🌀";
  
  const availableNumbers = [];
  for (let i = 1; i <= MAX_NUMBER; i++) {
    if (!drawnNumbers.includes(i)) availableNumbers.push(i);
  }

  let counter = 0;
  playDrumroll();
  const slotInterval = setInterval(() => {
    const randomTemp = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    currentNumberEl.innerText = randomTemp;
    counter++;
    if (counter > 30) {
      clearInterval(slotInterval);
      stopDrumroll();
      finishDraw(availableNumbers);
    }
  }, 50);
}

function finishDraw(availableNumbers) {
  const winner = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
  currentNumberEl.innerText = winner;
  drawResultText.innerHTML = `🎉 決定： <strong>${winner}</strong> 番 🎉`;
  
  playWinSound();
  
  drawnNumbers.push(winner);
  localStorage.setItem("bingo_teacher_drawn", JSON.stringify(drawnNumbers));
  document.getElementById(`board-cell-${winner}`).classList.add("drawn");
  
  isDrawing = false;
  drawBtn.disabled = false;
  if(drawnNumbers.length >= MAX_NUMBER) drawBtn.innerText = "すべての数字が出ました";
}

// ============== 👦👧 子どもモードの処理 ==============
function generateNewCard() {
  if (studentCardData.length > 0) {
    if (!confirm("今のカードを消して、新しいカードを作りますか？（やり直しはできません）")) return;
  }
  
  const ranges = [
    { min: 1, max: 20 }, { min: 21, max: 40 }, { min: 41, max: 60 }, { min: 61, max: 80 }, { min: 81, max: 99 }
  ];
  
  studentCardData = [[], [], [], [], []]; 
  markedCells = [];
  
  for (let col = 0; col < 5; col++) {
    let columnNumbers = [];
    while (columnNumbers.length < 5) {
      let num = Math.floor(Math.random() * (ranges[col].max - ranges[col].min + 1)) + ranges[col].min;
      if (!columnNumbers.includes(num)) columnNumbers.push(num);
    }
    for (let row = 0; row < 5; row++) {
      if (row === 2 && col === 2) {
        studentCardData[row][col] = "FREE"; 
        markedCells.push("2-2"); 
      } else {
        studentCardData[row][col] = columnNumbers[row];
      }
    }
  }
  
  saveStudentData();
  renderStudentCard();
}

function renderStudentCard() {
  bingoGrid.innerHTML = "";
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement("div");
      cell.className = "bingo-cell";
      const cellId = `${row}-${col}`;
      
      cell.innerText = studentCardData[row][col];
      
      // 真ん中のFREEマスの特別対応
      if (cellId === "2-2") {
        cell.classList.add("free-cell");
      }
      
      if (markedCells.includes(cellId)) {
        cell.classList.add("marked");
      }
      
      // クリックでマーク付け/外し
      cell.addEventListener("click", () => {
        if (cellId === "2-2") return; // FREEはさわれない
        initAudio();
        if (cell.classList.contains("marked")) {
          cell.classList.remove("marked");
          markedCells = markedCells.filter(id => id !== cellId);
        } else {
          playMarkSound();
          cell.classList.add("marked");
          markedCells.push(cellId);
        }
        saveStudentData();
        checkBingoReady();
      });
      
      bingoGrid.appendChild(cell);
    }
  }
  checkBingoReady();
}

function saveStudentData() {
  localStorage.setItem("bingo_student_card", JSON.stringify(studentCardData));
  localStorage.setItem("bingo_student_marked", JSON.stringify(markedCells));
}

function checkBingoReady() {
  if (markedCells.length >= 5) {
    bingoBtn.disabled = false;
  } else {
    bingoBtn.disabled = true;
  }
}

// ============== 初期化とイベントリスナー ==============
function loadData() {
  const savedDrawn = localStorage.getItem("bingo_teacher_drawn");
  if (savedDrawn) {
    drawnNumbers = JSON.parse(savedDrawn);
    if(drawnNumbers.length > 0) {
      currentNumberEl.innerText = drawnNumbers[drawnNumbers.length - 1];
      drawResultText.innerHTML = `前回の続きです`;
    }
  }
  initTeacherBoard();

  const savedCard = localStorage.getItem("bingo_student_card");
  const savedMarked = localStorage.getItem("bingo_student_marked");
  if (savedCard) {
    studentCardData = JSON.parse(savedCard);
    markedCells = savedMarked ? JSON.parse(savedMarked) : ["2-2"];
    renderStudentCard();
  }
}

btnTeacherMode.addEventListener("click", () => {
  modeSelection.classList.remove("active");
  teacherView.classList.add("active");
});
btnStudentMode.addEventListener("click", () => {
  modeSelection.classList.remove("active");
  studentView.classList.add("active");
  if(studentCardData.length === 0) generateNewCard();
});

drawBtn.addEventListener("click", drawNumber);
generateCardBtn.addEventListener("click", generateNewCard);
bingoBtn.addEventListener("click", () => {
  initAudio(); playWinSound(); startConfetti();
  alert("✨✨ BINGOおめでとう！！！ ✨✨");
});

resetTeacherBtn.addEventListener("click", () => {
  if(confirm("本当に出た数字をすべてリセットしますか？\n（新しいゲームを始めるときだけ押してください）")) {
    drawnNumbers = [];
    localStorage.removeItem("bingo_teacher_drawn");
    currentNumberEl.innerText = "?";
    drawResultText.innerText = "スタートを押してね！";
    initTeacherBoard();
  }
});

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    if (appContainer.requestFullscreen) appContainer.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
});
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) { document.body.classList.add('is-fullscreen'); fullscreenBtn.innerText = "❌"; } 
  else { document.body.classList.remove('is-fullscreen'); fullscreenBtn.innerText = "📺"; }
});
soundToggle.addEventListener("change", () => {
  initAudio(); soundLabel.innerText = soundToggle.checked ? "🔊 ON" : "🔇 OFF";
  if(!soundToggle.checked) stopDrumroll();
});

loadData();