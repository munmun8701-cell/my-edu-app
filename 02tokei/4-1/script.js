const problems = {
  4: {
    text: "④ 11時30分から40分前の時こくをもとめましょう。",
    startH: 11, startM: 30, totalBack: 40,
    step1Back: 30, midH: 11, midM: 0,
    step2Back: 10, finalH: 10, finalM: 50
  },
  5: {
    text: "⑤ さえさんの家から病院まで20分かかります。<br>10時10分までに病院に着くためには、おそくとも何時何分までに家を出なければならないでしょうか。",
    startH: 10, startM: 10, totalBack: 20,
    step1Back: 10, midH: 10, midM: 0,
    step2Back: 10, finalH: 9, finalM: 50
  }
};

let currentProblemId = 4;
let currentTotalMinutes = 0;

function initClock() {
  const clockFace = document.getElementById('clockFace');
  const existingNumbers = clockFace.querySelectorAll('.number');
  existingNumbers.forEach(n => n.remove());
  
  for (let i = 1; i <= 12; i++) {
    const num = document.createElement('div');
    num.className = 'number';
    num.innerText = i;
    const angle = i * 30; 
    num.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-64px) rotate(-${angle}deg)`;
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

function loadProblem(id) {
  currentProblemId = id;
  const p = problems[id];
  
  document.getElementById('tab-prob4').classList.remove('active');
  document.getElementById('tab-prob5').classList.remove('active');
  document.getElementById(`tab-prob${id}`).classList.add('active');
  
  document.getElementById('questionText').innerHTML = p.text;
  document.getElementById('tp-start').innerText = `${p.startH}時${p.startM}分`;
  
  const formattedMidM = p.midM === 0 ? "00" : p.midM;
  document.getElementById('tp-mid').innerText = `${p.midH}時${formattedMidM}分`;
  
  resetApp();
}

function setInstruction(text, type="normal") {
  const box = document.getElementById('instruction');
  box.innerHTML = text;
  box.className = 'instruction-box'; 
  if (type !== "normal") box.classList.add(type);
}

function checkStep1() {
  const p = problems[currentProblemId];
  const inputVal = parseInt(document.getElementById('in-step1').value);
  
  if (inputVal === p.step1Back) {
    currentTotalMinutes -= p.step1Back;
    updateClock(currentTotalMinutes);
    
    document.getElementById('in-step1').disabled = true;
    document.getElementById('btn-step1').disabled = true;
    document.getElementById('group-step2').style.visibility = 'visible';
    
    setInstruction(`正解！${p.midH}時までもどったね。<br>全部で「${p.totalBack}分」もどるから、残りはあと何分？`, "success");
  } else {
    setInstruction(`おしい！<br>${p.startH}時${p.startM}分から「ちょうどの${p.midH}時」にするには、何分もどるかな？`, "error");
  }
}

function checkStep2() {
  const p = problems[currentProblemId];
  const inputVal = parseInt(document.getElementById('in-step2').value);
  
  if (inputVal === p.step2Back) {
    currentTotalMinutes -= p.step2Back;
    updateClock(currentTotalMinutes);
    
    document.getElementById('in-step2').disabled = true;
    document.getElementById('btn-step2').disabled = true;
    
    const formattedFinalM = p.finalM === 0 ? "00" : p.finalM;
    document.getElementById('tp-answer').innerText = `${p.finalH}時${formattedFinalM}分`;
    document.getElementById('tp-answer').style.color = "#d32f2f";
    
    setInstruction(`大正解！<br>答えは「${p.finalH}時${formattedFinalM}分」だね！よくできました！`, "success");
  } else {
    setInstruction(`うーん、ちがうみたい。<br>全部で${p.totalBack}分もどるよ。もう${p.step1Back}分もどったから、残りは？`, "error");
  }
}

function resetApp() {
  const p = problems[currentProblemId];
  currentTotalMinutes = (p.startH * 60) + p.startM;
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
  
  setInstruction(`まずは「ちょうどの時こく（${p.midH}時）」にもどそう。<br>何分もどればいいかな？`);
}

// 初期化
initClock();
loadProblem(4);