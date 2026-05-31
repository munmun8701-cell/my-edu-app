const data = {
    2: { startH: 10, startM: 30, endH: 11, endM: 10, ans1: 30, ans2: 10, total: 40 },
    3: { startH: 10, startM: 40, endH: 11, endM: 15, ans1: 20, ans2: 15, total: 35 }
};

let currentProb = 2;
let step = 0;

// 時計の数字を配置
function createNumbers() {
    const face = document.getElementById('clockFace');
    for (let i = 1; i <= 12; i++) {
        const num = document.createElement('div');
        num.className = 'number';
        num.innerText = i;
        const angle = i * 30;
        num.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-80px) rotate(-${angle}deg)`;
        face.appendChild(num);
    }
}

// 時計の針と時間を更新
function updateClock(h, m) {
    const mAngle = m * 6;
    const hAngle = (h % 12) * 30 + m * 0.5;
    document.getElementById('minuteHand').style.transform = `rotate(${mAngle}deg)`;
    document.getElementById('hourHand').style.transform = `rotate(${hAngle}deg)`;
    
    const formattedMinute = m < 10 ? '0' + m : m;
    document.getElementById('timeDisplay').innerText = `${h}時${formattedMinute}分`;
}

// 問題の切り替え
function switchProblem(id) {
    currentProb = id;
    document.getElementById('tab2').className = id === 2 ? 'tab-btn active' : 'tab-btn';
    document.getElementById('tab3').className = id === 3 ? 'tab-btn active' : 'tab-btn';
    
    const p = data[id];
    document.getElementById('questionText').innerText = `問題${id === 2 ? '②' : '③'}：${p.startH}時${p.startM}分から${p.endH}時${p.endM}分までの時間をもとめよう。`;
    document.getElementById('startLabel').innerText = `${p.startH}時${p.startM}分`;
    document.getElementById('endLabel').innerText = `${p.endH}時${p.endM}分`;
    
    resetCurrent();
}

// ステップ1の確認（11時まで）
function checkStep1() {
    const input = parseInt(document.getElementById('in1').value);
    const p = data[currentProb];
    
    if (input === p.ans1) {
        step = 1;
        updateClock(11, 0); // 11時に針を進める
        document.getElementById('in1').classList.add('correct');
        document.getElementById('in1').disabled = true;
        document.getElementById('btn1').disabled = true;
        
        document.getElementById('in2').disabled = false;
        document.getElementById('btn2').disabled = false;
        document.getElementById('msg').innerText = "正解！次は、11時から終わりの時こくまで何分かな？";
        document.getElementById('msg').style.color = "var(--success)";
    } else {
        document.getElementById('msg').innerText = "おしい！長い針が12のところ（11時）に行くまで、あと何分かな？";
        document.getElementById('msg').style.color = "var(--warning)";
    }
}

// ステップ2の確認（残りの時間）
function checkStep2() {
    const input = parseInt(document.getElementById('in2').value);
    const p = data[currentProb];
    
    if (input === p.ans2) {
        step = 2;
        updateClock(p.endH, p.endM); // 終わりの時刻に針を進める
        document.getElementById('in2').classList.add('correct');
        document.getElementById('in2').disabled = true;
        document.getElementById('btn2').disabled = true;
        
        document.getElementById('totalArea').style.opacity = "1";
        document.getElementById('inTotal').disabled = false;
        document.getElementById('btnTotal').disabled = false;
        document.getElementById('msg').innerText = "バッチリ！最後に、ぜんぶで何分か計算しよう。";
        document.getElementById('msg').style.color = "var(--success)";
    } else {
        document.getElementById('msg').innerText = "ちがうみたい。11時から何分進んだかな？";
        document.getElementById('msg').style.color = "var(--warning)";
    }
}

// 最後の合計時間の確認
function checkTotal() {
    const input = parseInt(document.getElementById('inTotal').value);
    const p = data[currentProb];
    
    if (input === p.total) {
        document.getElementById('msg').innerText = "おめでとう！大正解です！よく考えたね！";
        document.getElementById('msg').style.color = "var(--success)";
        document.getElementById('inTotal').style.color = "var(--success)";
        document.getElementById('inTotal').disabled = true;
        document.getElementById('btnTotal').disabled = true;
    } else {
        document.getElementById('msg').innerText = "さっきの2つの時間をたしてみよう。";
        document.getElementById('msg').style.color = "var(--warning)";
    }
}

// リセット処理
function resetCurrent() {
    const p = data[currentProb];
    step = 0;
    updateClock(p.startH, p.startM);
    
    const ids = ['in1', 'in2', 'inTotal'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.disabled = (id !== 'in1');
        el.classList.remove('correct');
        el.style.color = "";
    });
    
    document.getElementById('btn1').disabled = false;
    document.getElementById('btn2').disabled = true;
    document.getElementById('btnTotal').disabled = true;
    document.getElementById('totalArea').style.opacity = "0.3";
    
    document.getElementById('msg').innerText = "11時まで何分かな？数字を入力して「確認」をおしてね。";
    document.getElementById('msg').style.color = "var(--primary)";
}

// 起動時の初期化
createNumbers();
switchProblem(2);