// 初期設定：9時50分
const START_MINUTES = (9 * 60) + 50; 
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

// ① 9時50分から10時まで（10分）のチェック
function checkStep1() {
  const inputVal = parseInt(document.getElementById('in-step1').value);
  
  if (inputVal === 10) {
    currentTotalMinutes += 10; // 10時にする
    updateClock(currentTotalMinutes);
    
    document.getElementById('in-step1').disabled = true;
    document.getElementById('btn-step1').disabled = true;
    document.getElementById('group-step1').style.background = "#fff9c4"; // 正解したら色を変える
    document.getElementById('group-step2').style.visibility = 'visible';
    
    setInstruction("正解！針が「10時」まで進んだね。<br>次は、10時から10時10分まで何分かかったかな？", "success");
  } else {
    setInstruction("おしい！<br>9時50分から長い針が「12」のところ（10時）に行くまで、何分かな？", "error");
  }
}

// ② 10時から10時10分まで（10分）のチェック
function checkStep2() {
  const inputVal = parseInt(document.getElementById('in-step2').value);
  
  if (inputVal === 10) {
    currentTotalMinutes += 10; // 10時10分にする
    updateClock(currentTotalMinutes);
    
    document.getElementById('in-step2').disabled = true;
    document.getElementById('btn-step2').disabled = true;
    document.getElementById('group-step2').style.background = "#fff9c4";
    document.getElementById('group-step3').style.visibility = 'visible';
    
    setInstruction("いいね！公園に着いた「10時10分」になったよ。<br>最後に、かかった時間をあわせてみよう！", "success");
  } else {
    setInstruction("ちがうみたい。<br>10時から10時10分になるには、長い針は何分進むかな？", "error");
  }
}

// ③ 合計時間のチェック（10分＋10分＝20分）
function checkStep3() {
  const inputVal = parseInt(document.getElementById('in-step3').value);
  
  if (inputVal === 20) {
    document.getElementById('in-step3').disabled = true;
    document.getElementById('btn-step3').disabled = true;
    document.getElementById('group-step3').style.background = "#fce4ec";
    
    setInstruction("大正解！！<br>10分 と 10分 をあわせて、かかった時間は「20分」だね！", "success");
  } else {
    setInstruction("さいごの計算だよ。<br>1つ目の「10分」と、2つ目の「10分」をあわせると、何分になる？", "error");
  }
}

function resetApp() {
  currentTotalMinutes = START_MINUTES;
  updateClock(currentTotalMinutes);
  
  const steps = [1, 2, 3];
  steps.forEach(step => {
    document.getElementById(`in-step${step}`).value = "";
    document.getElementById(`in-step${step}`).disabled = false;
    document.getElementById(`btn-step${step}`).disabled = false;
  });
  
  document.getElementById('group-step1').style.background = "#fff";
  document.getElementById('group-step2').style.background = "#fff";
  document.getElementById('group-step2').style.visibility = 'hidden';
  document.getElementById('group-step3').style.background = "#fff";
  document.getElementById('group-step3').style.visibility = 'hidden';
  
  setInstruction("まずは「ちょうどの時こく（10時）」で区切って考えよう。<br>9時50分から10時までは、何分かな？");
}

// 初期化
initClock();
updateClock(currentTotalMinutes);