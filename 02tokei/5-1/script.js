const ANSWERS = {
    unit: ["秒", "びょう"],
    secInMin: 60,
    analogTarget: 15,
    digitalTarget: 25
};

let status = { analogCorrect: false, digitalCorrect: false };
let freePlayTimer = null;
let freePlaySeconds = 0;

function setMsg(text, isSuccess = false) {
    const msgBox = document.getElementById('msg');
    msgBox.innerHTML = text;
    if (isSuccess) {
        msgBox.style.backgroundColor = '#dcfce7';
        msgBox.style.borderColor = '#4ade80';
        msgBox.style.color = '#15803d';
    } else {
        msgBox.style.backgroundColor = '#e0f2fe';
        msgBox.style.borderColor = '#7dd3fc';
        msgBox.style.color = '#0369a1';
    }
}

// ステップ1：単位の確認
function checkStep1() {
    const val = document.getElementById('in-unit').value.trim();
    if (ANSWERS.unit.includes(val)) {
        document.getElementById('in-unit').classList.add('correct');
        document.getElementById('in-unit').disabled = true;
        document.getElementById('btn-step1').disabled = true;
        
        document.getElementById('conversion-row').classList.remove('hidden');
        setMsg("大正解！1分より短い時間を「秒（びょう）」というんだね。<br>じゃあ、1分は何秒かな？", true);
    } else {
        setMsg("おしい！「びょう」という言葉を入れてみてね。");
    }
}

// ステップ1-2：1分=60秒の確認
function checkStep1_2() {
    const val = parseInt(document.getElementById('in-sec').value);
    if (val === ANSWERS.secInMin) {
        document.getElementById('in-sec').classList.add('correct');
        document.getElementById('in-sec').disabled = true;
        document.getElementById('btn-step1-2').disabled = true;
        
        document.getElementById('step2-card').classList.remove('disabled-card');
        setMsg("バッチリ！ 1分＝60秒 だね。<br>次はストップウォッチの読み方を練習しよう！", true);
        
        // ストップウォッチのアニメーション開始
        animateStopwatchesToTarget();
    } else {
        setMsg("時計の長い針が1周すると1分だよね。短い目盛りはいくつあるかな？");
    }
}

// ストップウォッチを目標値までアニメーションさせる
function animateStopwatchesToTarget() {
    let currentA = 0;
    let currentD = 0;
    
    // アナログ用アニメーション
    const intervalA = setInterval(() => {
        currentA += 1;
        document.getElementById('sw-hand-a').style.transform = `rotate(${currentA * 6}deg)`;
        if (currentA >= ANSWERS.analogTarget) clearInterval(intervalA);
    }, 50);

    // デジタル用アニメーション
    const intervalD = setInterval(() => {
        currentD += 1;
        const formatted = currentD < 10 ? '0' + currentD : currentD;
        document.getElementById('digital-display').innerText = `00:00:${formatted} 00`;
        if (currentD >= ANSWERS.digitalTarget) clearInterval(intervalD);
    }, 50);
}

// アナログの確認
function checkAnalog() {
    const val = parseInt(document.getElementById('in-ans-a').value);
    if (val === ANSWERS.analogTarget) {
        document.getElementById('in-ans-a').classList.add('correct');
        document.getElementById('in-ans-a').disabled = true;
        document.getElementById('btn-ans-a').disabled = true;
        status.analogCorrect = true;
        checkAllDone();
    } else {
        setMsg("㋐がちがうみたい。赤い針がどこで止まったか、数字をよく見てね。");
    }
}

// デジタルの確認
function checkDigital() {
    const val = parseInt(document.getElementById('in-ans-i').value);
    if (val === ANSWERS.digitalTarget) {
        document.getElementById('in-ans-i').classList.add('correct');
        document.getElementById('in-ans-i').disabled = true;
        document.getElementById('btn-ans-i').disabled = true;
        status.digitalCorrect = true;
        checkAllDone();
    } else {
        setMsg("㋑がちがうみたい。右から2番目のかたまりの数字を読んでみよう。");
    }
}

// すべて正解したらフリープレイエリアを開放
function checkAllDone() {
    if (status.analogCorrect && status.digitalCorrect) {
        setMsg("🎉 大正解！ 🎉<br>ストップウォッチの読み方はカンペキだね！", true);
        document.getElementById('step3-card').classList.remove('hidden');
        document.getElementById('stopwatch-hint').innerText = "下にあるボタンで、自由にストップウォッチを動かせるよ！";
    } else {
        setMsg("いいね！もう1つのストップウォッチも読んでみよう。", true);
    }
}

// --- フリープレイ用機能 ---
function updateFreePlayDisplay() {
    // アナログ更新
    document.getElementById('sw-hand-a').style.transform = `rotate(${freePlaySeconds * 6}deg)`;
    // デジタル更新
    const formatted = freePlaySeconds < 10 ? '0' + freePlaySeconds : freePlaySeconds;
    document.getElementById('digital-display').innerText = `00:00:${formatted} 00`;
}

function startFreePlay() {
    if (freePlayTimer !== null) return;
    freePlayTimer = setInterval(() => {
        freePlaySeconds++;
        if(freePlaySeconds >= 60) freePlaySeconds = 0; // 60秒で0に戻る
        updateFreePlayDisplay();
    }, 1000); // 実際の1秒間隔
}

function stopFreePlay() {
    clearInterval(freePlayTimer);
    freePlayTimer = null;
}

function resetFreePlay() {
    stopFreePlay();
    freePlaySeconds = 0;
    updateFreePlayDisplay();
}

function resetApp() {
    // 状態リセット
    status.analogCorrect = false;
    status.digitalCorrect = false;
    stopFreePlay();
    freePlaySeconds = 0;

    // UIリセット
    const inputs = ['in-unit', 'in-sec', 'in-ans-a', 'in-ans-i'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.classList.remove('correct');
        el.disabled = false;
    });

    document.getElementById('btn-step1').disabled = false;
    document.getElementById('btn-step1-2').disabled = false;
    document.getElementById('btn-ans-a').disabled = false;
    document.getElementById('btn-ans-i').disabled = false;

    document.getElementById('conversion-row').classList.add('hidden');
    document.getElementById('step2-card').classList.add('disabled-card');
    document.getElementById('step3-card').classList.add('hidden');

    document.getElementById('sw-hand-a').style.transform = `rotate(0deg)`;
    document.getElementById('digital-display').innerText = `00:00:00`;
    document.getElementById('stopwatch-hint').innerText = "針や数字が動いて止まるよ。よく見てね！";

    setMsg("1分より短い時間のたんいを、ひらがな か 漢字で入力してね。");
}