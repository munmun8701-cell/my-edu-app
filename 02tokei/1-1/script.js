// 初期設定：8時40分
const START_MINUTES = (8 * 60) + 40; 
let currentTotalMinutes = START_MINUTES;

function initClock() {
  const clockFace = document.getElementById('clockFace');
  const existingNumbers = clockFace.querySelectorAll('.number');
  existingNumbers.forEach(n => n.remove());
  
  for (let i = 1; i <= 12; i++) {
    const num = document.createElement('div');
    num.className = 'number';
    num.innerText = i;
    const angle = i * 30; 
    num.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-72px) rotate(-${angle}deg)`;
    clockFace.appendChild(num);
  }
}

function updateClock(totalMins) {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  
  const minuteAngle = m * 6; 
  const hourAngle = ((h % 12) * 30) + (m * 0.5); 
  
  document.getElementById('minuteHand').style.transform = `rotate(${minuteAngle}deg)`;
  document.getElementById('hourHand').style.transform = `rotate(${hourAngle}deg)`;
  
  const formattedMinute = m === 0 ? "00" : m;
  document.getElementById('timeDisplay').innerText = `${h}時${formattedMinute}分`;
}

function setInstruction(text, type="normal") {
  const box = document.getElementById('instruction');
  box.innerHTML = text;
  box.className = 'instruction-box'; 
  if (type !== "normal") box.classList.add(type);
}

// ① 9時まで進める（20分）のチェック
function checkStep1() {
  const inputVal = parseInt(document.getElementById('in-step1').value);
  
  // 8時40分から9時にするには 20分 進める
  if (inputVal === 20) {
    currentTotalMinutes += 20; // 9時にする
    updateClock(currentTotalMinutes);
    
    document.getElementById('in-step1').disabled = true;
    document.getElementById('btn-step1').disabled = true;
    document.getElementById('group-step2').style.visibility = 'visible';
    
    setInstruction("正解！針が「ちょうどの9時」まで進んだね。<br>全部で「30分」進むから、残りはあと何分進める？", "success");
  } else {
    setInstruction("おしい！<br>8時40分から「ちょうどの9時」にするには、長い針をあと何分進めるかな？", "error");
  }
}

// ② 残りの時間（10分）のチェック
function checkStep2() {
  const inputVal = parseInt(document.getElementById('in-step2').value);
  
  // 30分のうち20分進めたので、残りは 10分
  if (inputVal === 10) {
    currentTotalMinutes += 10; // 9時10分にする
    updateClock(currentTotalMinutes);
    
    document.getElementById('in-step2').disabled = true;
    document.getElementById('btn-step2').disabled = true;
    document.getElementById('tp-answer').innerText = "9時10分";
    document.getElementById('tp-answer').style.color = "#d32f2f";
    
    setInstruction("大正解！<br>お店に着いた時こくは「9時10分」だね！よくできました！", "success");
  } else {
    setInstruction("うーん、ちがうみたい。<br>全部で30分進むんだよ。もう20分は進んだから、残りは？", "error");
  }
}

function resetApp() {
  currentTotalMinutes = START_MINUTES;
  updateClock(currentTotalMinutes);
  
  document.getElementById('in-step1').value = "";
  document.getElementById('in-step1').disabled = false;
  document.getElementById('btn-step1').disabled = false;
  
  document.getElementById('in-step2').value = "";
  document.getElementById('in-step2').disabled = false;
  document.getElementById('btn-step2').disabled = false;
  document.getElementById('group-step2').style.visibility = 'hidden';
  
  document.getElementById('tp-answer').innerText = "？時？分";
  document.getElementById('tp-answer').style.color = "inherit";
  
  setInstruction("まずは「ちょうどの時こく（9時）」まで進めよう。<br>9時にするには、何分進めればいいかな？");
}

// 初期化
initClock();
updateClock(currentTotalMinutes);