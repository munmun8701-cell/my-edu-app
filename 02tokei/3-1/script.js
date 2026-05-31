// 時間を「分」の総数で管理します（計算を簡単にするため）
const START_MINUTES = (11 * 60) + 10; // 11時10分
let currentTotalMinutes = START_MINUTES;

function createNumbers() {
  const clockFace = document.getElementById('clockFace');
  // 古い数字が残らないようにクリア
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
  box.className = 'instruction-box'; // リセット
  if (type !== "normal") box.classList.add(type);
}

// ① 11時まで戻る（10分）のチェック
function checkStep1() {
  const inputVal = parseInt(document.getElementById('in-step1').value);
  
  if (inputVal === 10) {
    currentTotalMinutes -= 10; // 11時にする
    updateClock(currentTotalMinutes);
    
    // 正解時のUI更新
    document.getElementById('in-step1').disabled = true;
    document.getElementById('btn-step1').disabled = true;
    document.getElementById('group-step2').style.visibility = 'visible';
    
    setInstruction("正解！11時までもどったね。<br>全部で「30分」もどるから、残りはあと何分もどればいい？", "success");
  } else {
    setInstruction("おしい！<br>11時10分から「ちょうどの11時」にするには、何分もどるかな？", "error");
  }
}

// ② 残りの時間（20分）のチェック
function checkStep2() {
  const inputVal = parseInt(document.getElementById('in-step2').value);
  
  // 30分もどる問題なので、残りは 30 - 10 = 20分
  if (inputVal === 20) {
    currentTotalMinutes -= 20; // 10時40分にする
    updateClock(currentTotalMinutes);
    
    document.getElementById('in-step2').disabled = true;
    document.getElementById('btn-step2').disabled = true;
    document.getElementById('tp-answer').innerText = "10時40分";
    document.getElementById('tp-answer').style.color = "#d32f2f";
    
    setInstruction("大正解！<br>公園を出た時こくは「10時40分」だね！よくできました！", "success");
  } else {
    setInstruction("うーん、ちがうみたい。<br>全部で30分もどるんだよ。もう10分はもどったから、残りは？", "error");
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
  
  setInstruction("「ちょうどの時こく（11時）」にそろえよう。<br>11時にするには、何分もどればいいかな？");
}

// 初期化処理
createNumbers();
updateClock(currentTotalMinutes);