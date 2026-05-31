const problemData = {
    4: {
        text: "④ 11時30分から40分前の時こくをもとめましょう。",
        startH: 11, startM: 30, midH: 11, midM: 0,
        ans1: 30, // 11時までもどる分
        ans2: 10, // 残りもどる分 (40 - 30)
        finalH: 10, finalM: 50
    },
    5: {
        text: "⑤ さえさんの家から病院まで20分かかります。10時10分までに病院に着くためには、おそくとも何時何分までに家を出ればよいでしょうか。",
        startH: 10, startM: 10, midH: 10, midM: 0,
        ans1: 10, // 10時までもどる分
        ans2: 10, // 残りもどる分 (20 - 10)
        finalH: 9, finalM: 50
    }
};

let currentProb = 4;

function createNumbers() {
    const face = document.getElementById('clockFace');
    for (let i = 1; i <= 12; i++) {
        const num = document.createElement('div');
        num.className = 'number';
        num.innerText = i;
        const angle = i * 30;
        num.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-70px) rotate(-${angle}deg)`;
        face.appendChild(num);
    }
}

function updateClock(h, m) {
    const mAngle = m * 6;
    const hAngle = (h % 12) * 30 + m * 0.5;
    document.getElementById('minuteHand').style.transform = `rotate(${mAngle}deg)`;
    document.getElementById('hourHand').style.transform = `rotate(${hAngle}deg)`;
    document.getElementById('timeDisplay').innerText = `${h}:${m === 0 ? '00' : (m < 10 ? '0'+m : m)}`;
}

function switchProblem(id) {
    currentProb = id;
    document.getElementById('tab4').className = id === 4 ? 'tab-btn active' : 'tab-btn';
    document.getElementById('tab5').className = id === 5 ? 'tab-btn active' : 'tab-btn';
    
    const p = problemData[id];
    document.getElementById('questionText').innerHTML = p.text;
    document.getElementById('startTimeLabel').innerText = `${p.startH}時${p.startM}分`;
    document.getElementById('midTimeLabel').innerText = `${p.midH}時00分`;
    
    resetCurrent();
}

// ステップ1：ちょうどの時間までもどる
function checkStep1() {
    const val = parseInt(document.getElementById('in1').value);
    const p = problemData[currentProb];
    if (val === p.ans1) {
        updateClock(p.midH, 0);
        document.getElementById('in1').classList.add('correct');
        document.getElementById('in1').disabled = true;
        document.getElementById('btn1').disabled = true;
        document.getElementById('in2').disabled = false;
        document.getElementById('btn2').disabled = false;
        document.getElementById('msg').innerText = `正解！${p.midH}時になったね。次は、残りあと何分もどればいいかな？`;
    } else {
        document.getElementById('msg').innerText = `ちがうみたい。長い針が12のところ（${p.midH}時）にいくには何分もどる？`;
    }
}

// ステップ2：残りの時間をもどる
function checkStep2() {
    const val = parseInt(document.getElementById('in2').value);
    const p = problemData[currentProb];
    if (val === p.ans2) {
        updateClock(p.finalH, p.finalM);
        document.getElementById('in2').classList.add('correct');
        document.getElementById('in2').disabled = true;
        document.getElementById('btn2').disabled = true;
        document.getElementById('answerArea').style.opacity = "1";
        document.getElementById('ansH').disabled = false;
        document.getElementById('ansM').disabled = false;
        document.getElementById('btnFinal').disabled = false;
        document.getElementById('msg').innerText = "バッチリ！最後に、今の時計が何時何分か答えてみよう！";
    } else {
        const total = (currentProb === 4) ? 40 : 20;
        document.getElementById('msg').innerText = `ぜんぶで${total}分もどるよ。あと何分かな？（${total} － ${p.ans1} ＝ ？）`;
    }
}

// 最終回答
function checkFinal() {
    const h = parseInt(document.getElementById('ansH').value);
    const m = parseInt(document.getElementById('ansM').value);
    const p = problemData[currentProb];
    if (h === p.finalH && m === p.finalM) {
        document.getElementById('msg').innerText = "大正解！！時間をさかのぼる問題、マスターしたね！";
        document.getElementById('msg').style.color = "var(--success)";
    } else {
        document.getElementById('msg').innerText = "時計の針をよく見てごらん。短い針と長い針はどこを指してる？";
    }
}

function resetCurrent() {
    const p = problemData[currentProb];
    updateClock(p.startH, p.startM);
    document.getElementById('msg').style.color = "var(--primary)";
    document.getElementById('msg').innerText = `まずは、ちょうどの時こく（${p.midH}時00分）まで何分もどればいいかな？`;
    
    ['in1', 'in2', 'ansH', 'ansM'].forEach(id => {
        const el = document.getElementById(id);
        el.value = ''; el.disabled = (id !== 'in1');
        el.classList.remove('correct');
    });
    document.getElementById('btn1').disabled = false;
    document.getElementById('btn2').disabled = true;
    document.getElementById('btnFinal').disabled = true;
    document.getElementById('answerArea').style.opacity = "0.3";
}

createNumbers();
switchProblem(4);