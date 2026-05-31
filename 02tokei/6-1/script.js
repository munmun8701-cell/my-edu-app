let currentTab = 1;
let clock1Mins = 2 * 60 + 20; // 2:20
let clock2Mins = 8 * 60 + 40; // 8:40

function switchTab(t) {
    currentTab = t;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active-content'));
    document.getElementById('btn-tab'+t).classList.add('active');
    document.getElementById('tab'+t).classList.add('active-content');
    if(t===1) drawNumbers('clock1'), updateClock(1, clock1Mins);
    if(t===2) drawNumbers('clock2'), updateClock(2, clock2Mins);
}

function drawNumbers(id) {
    const face = document.getElementById(id);
    face.querySelectorAll('.number').forEach(n => n.remove());
    for(let i=1; i<=12; i++) {
        const num = document.createElement('div');
        num.className = 'number'; num.innerText = i;
        num.style.position = 'absolute'; num.style.top = '50%'; num.style.left = '50%';
        num.style.fontSize = '12px'; num.style.fontWeight = 'bold'; num.style.color = '#333';
        const angle = i * 30;
        num.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-48px) rotate(-${angle}deg)`;
        face.appendChild(num);
    }
}

function updateClock(idNum, totalMins) {
    const h = Math.floor(totalMins / 60); const m = totalMins % 60;
    document.getElementById(`m-hand${idNum}`).style.transform = `rotate(${m * 6}deg)`;
    document.getElementById(`h-hand${idNum}`).style.transform = `rotate(${(h%12)*30 + m*0.5}deg)`;
    document.getElementById(`dt${idNum}`).innerText = `${h}:${m<10?'0'+m:m}`;
}

function setMsg(id, txt, success=false) {
    const el = document.getElementById(id); el.innerHTML = txt;
    el.style.background = success ? '#dcfce7' : '#f1f5f9';
    el.style.color = success ? '#15803d' : '#475569';
}

// --- Tab 1: 2:20 ---
function check1_A1() {
    if(parseInt(document.getElementById('in1-a1').value) === 40) {
        document.getElementById('in1-a1').classList.add('correct'); document.getElementById('chk1-a1').disabled = true;
        document.getElementById('row1-a2').classList.remove('hidden'); updateClock(1, 3*60);
        setMsg('msg1-a', '正解！3時になったね。ぜんぶで50分進むから、残りは？', true);
    } else setMsg('msg1-a', 'おしい！ 長い針が12のところ（3時）に行くまで何分？');
}
function check1_A2() {
    if(parseInt(document.getElementById('in1-a2').value) === 10) {
        document.getElementById('in1-a2').classList.add('correct'); document.getElementById('chk1-a2').disabled = true;
        document.getElementById('row1-a3').classList.remove('hidden'); updateClock(1, 3*60 + 10);
        setMsg('msg1-a', 'バッチリ！最後に、いまの時計の時間を答えよう。', true);
    } else setMsg('msg1-a', '50分から、さっき進めた40分を引いてみよう！');
}
function check1_A3() {
    if(document.getElementById('ans1-ah').value == '3' && document.getElementById('ans1-am').value == '10') {
        document.getElementById('ans1-ah').classList.add('correct'); document.getElementById('ans1-am').classList.add('correct'); document.getElementById('chk1-a3').disabled = true;
        setMsg('msg1-a', '大正解！ 50分後は「3時10分」だね！', true);
    } else setMsg('msg1-a', '時計の数字をよく見てね。');
}

function check1_B1() {
    if(parseInt(document.getElementById('in1-b1').value) === 20) {
        document.getElementById('in1-b1').classList.add('correct'); document.getElementById('chk1-b1').disabled = true;
        document.getElementById('row1-b2').classList.remove('hidden'); updateClock(1, 2*60);
        setMsg('msg1-b', '正解！2時にもどったね。ぜんぶで50分もどるから、残りは？', true);
    } else setMsg('msg1-b', '2時20分から、ちょうどの2時にするには何分もどす？');
}
function check1_B2() {
    if(parseInt(document.getElementById('in1-b2').value) === 30) {
        document.getElementById('in1-b2').classList.add('correct'); document.getElementById('chk1-b2').disabled = true;
        document.getElementById('row1-b3').classList.remove('hidden'); updateClock(1, 1*60 + 30);
        setMsg('msg1-b', 'バッチリ！最後に、いまの時計の時間を答えよう。', true);
    } else setMsg('msg1-b', '50分もどるうち、もう20分もどったよ。残りは？');
}
function check1_B3() {
    if(document.getElementById('ans1-bh').value == '1' && document.getElementById('ans1-bm').value == '30') {
        document.getElementById('ans1-bh').classList.add('correct'); document.getElementById('ans1-bm').classList.add('correct'); document.getElementById('chk1-b3').disabled = true;
        setMsg('msg1-b', '大正解！ 50分前は「1時30分」だね！', true);
    } else setMsg('msg1-b', '時計の数字をよく見てね。短い針は1と2の間だよ。');
}

// --- Tab 2: 8:40 to 9:30 ---
function check2_1() {
    if(parseInt(document.getElementById('in2-1').value) === 20) {
        document.getElementById('in2-1').classList.add('correct'); document.getElementById('chk2-1').disabled = true;
        document.getElementById('row2-2').classList.remove('hidden'); updateClock(2, 9*60);
        setMsg('msg2', '正解！9時になったね。次は9時から9時30分までを考えよう。', true);
    } else setMsg('msg2', '8時40分から9時になるには、あと何分かな？');
}
function check2_2() {
    if(parseInt(document.getElementById('in2-2').value) === 30) {
        document.getElementById('in2-2').classList.add('correct'); document.getElementById('chk2-2').disabled = true;
        document.getElementById('row2-3').classList.remove('hidden'); updateClock(2, 9*60 + 30);
        setMsg('msg2', 'バッチリ！最後に、2つの時間をたし算しよう。', true);
    } else setMsg('msg2', '9時から9時30分まで…そのまま数字を読んでみて！');
}
function check2_3() {
    if(parseInt(document.getElementById('ans2').value) === 50) {
        document.getElementById('ans2').classList.add('correct'); document.getElementById('chk2-3').disabled = true;
        setMsg('msg2', '大正解！さんぽの時間は「50分」だね！', true);
    } else setMsg('msg2', 'さっき計算した「20分」と「30分」をたしてみよう。');
}

// --- Tab 3: Units ---
function check3_1() {
    if(document.getElementById('in3-1m').value == '1' && document.getElementById('in3-1s').value == '40') {
        document.getElementById('in3-1m').classList.add('correct'); document.getElementById('in3-1s').classList.add('correct'); document.getElementById('chk3-1').disabled=true;
        setMsg('msg3-1', '大正解！ 100秒は 1分40秒 だね。', true);
    } else setMsg('msg3-1', '1分=60秒。 100 - 60 = ? を計算してみよう。');
}
function check3_2() {
    if(document.getElementById('in3-2h').value == '1' && document.getElementById('in3-2m').value == '30') {
        document.getElementById('in3-2h').classList.add('correct'); document.getElementById('in3-2m').classList.add('correct'); document.getElementById('chk3-2').disabled=true;
        setMsg('msg3-2', '大正解！ 90分は 1時間30分 だね。', true);
    } else setMsg('msg3-2', '1時間=60分。 90 - 60 = ? を計算してみよう。');
}

// --- Tab 4: Unit Select ---
function check4(q, unit) {
    document.getElementById(`ub${q}`).innerText = unit;
    if((q===1 && unit==='分') || (q===2 && unit==='秒') || (q===3 && unit==='時間') || (q===4 && unit==='分')) {
        document.getElementById(`ub${q}`).style.color = '#15803d';
        setMsg(`msg4-${q}`, '大正解！ピッタリのたんいだね！', true);
    } else {
        document.getElementById(`ub${q}`).style.color = '#ea580c';
        let hint = "";
        if(q===1) hint = unit==='時間'?'45時間は長すぎるよ！':'45秒だとすぐ終わっちゃうね。';
        if(q===2) hint = '10分や10時間も走り続けたらたおれちゃうよ！';
        if(q===3) hint = '9分や9秒しかねないのは、短すぎるね。';
        if(q===4) hint = unit==='時間'?'20時間も休みがあったら帰れちゃうね！':'20秒じゃ外に遊びに行けないよ。';
        setMsg(`msg4-${q}`, hint);
    }
}

function resetAll() {
    // 画面のリロード（手軽に全リセットするため）
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => { input.value = ''; input.classList.remove('correct'); input.disabled = false; });
    const btns = document.querySelectorAll('.btn-check');
    btns.forEach(btn => btn.disabled = false);
    document.querySelectorAll('.hidden.calc-row').forEach(row => row.classList.add('hidden'));
    
    // タブ固有のリセット
    clock1Mins = 2*60+20; updateClock(1, clock1Mins);
    clock2Mins = 8*60+40; updateClock(2, clock2Mins);
    
    setMsg('msg1-a', 'ちょうどの時こく（3時）で区切って考えよう！'); setMsg('msg1-b', '時間をさかのぼるよ。まずは2時にしよう！');
    setMsg('msg2', 'ちょうどの時こく（9時）をとおって考えよう！');
    setMsg('msg3-1', 'ヒント：1分は 60秒。100の中から60をわけてみよう。'); setMsg('msg3-2', 'ヒント：1時間は 60分。90の中から60をわけてみよう。');
    
    for(let i=1;i<=4;i++) { document.getElementById(`ub${i}`).innerText = '？'; document.getElementById(`ub${i}`).style.color = '#8b5cf6'; }
    setMsg('msg4-1', 'いつもの授業はどれくらいの長さかな？'); setMsg('msg4-2', '走る時間はあっという間だね。');
    setMsg('msg4-3', '夜から朝まで、たっぷり休む時間だよ。'); setMsg('msg4-4', '中休みや昼休みの長さを思い出してみよう。');
}

// 初期化
switchTab(1);