let cardMode = 'exchange'; 

let cards1000 = [];
let cards100 = [];
let cards10 = [];
let cards1 = [];

function toHalfWidth(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).trim();
}

function updateNav(title, msg, color = "#0ea5e9") {
    document.getElementById('nav-title').innerText = title;
    document.getElementById('nav-msg').innerHTML = msg;
    document.getElementById('nav-board').style.borderColor = color;
    document.getElementById('nav-title').style.backgroundColor = color;
}

function pulseAnim(id) {
    const el = document.getElementById(id);
    el.classList.remove('pulse-anim');
    void el.offsetWidth; 
    el.classList.add('pulse-anim');
}

// ★ノートと同じように動く「波及的くり下がり」の連動タップロジック★
function handleHissanTap(place) {
    const b1000 = document.getElementById('base-1000');
    const b100 = document.getElementById('base-100');
    const b10 = document.getElementById('base-10');
    
    const mMid100 = document.getElementById('memo-mid-100');
    const mMid10 = document.getElementById('memo-mid-10');
    const mMid1 = document.getElementById('memo-mid-1');
    const mTop100 = document.getElementById('memo-top-100');
    const mTop10 = document.getElementById('memo-top-10');

    if (place === 1000) {
        // 千の位の「1」を消したとき
        if (!b1000.classList.contains('crossed')) {
            b1000.classList.add('crossed');
            mMid100.innerText = '10';
            pulseAnim('memo-mid-100');
            updateNav("💡 1000をバラしたね！", "1000がなくなって、百の位に10がきたよ。<br>次は <strong>百の位の「0」</strong> をタップして、十の位に貸してあげよう！", "#0ea5e9");
        }
    } 
    else if (place === 100) {
        // 百の位の「0」を消したとき
        if (!b1000.classList.contains('crossed')) {
            updateNav("あれ？", "百の位から借りたいけど、まだ千の位から借りてきていないよ。<br>まずは <strong>千の位の「1」</strong> をタップしよう！", "#ef4444");
            return;
        }
        if (mMid100.innerText === '10' && !b100.classList.contains('crossed')) {
            b100.classList.add('crossed');
            mMid100.classList.add('crossed'); // 10に斜線を入れる
            mTop100.innerText = '9';
            mMid10.innerText = '10';
            pulseAnim('memo-top-100');
            pulseAnim('memo-mid-10');
            updateNav("💡 となりの十の位へ貸したよ！", "百の位の10が「9」にへって、十の位に10がきたね！<br>次は <strong>十の位の「0」</strong> をタップして一の位に貸そう！", "#f59e0b");
        }
    } 
    else if (place === 10) {
        // 十の位の「0」を消したとき
        if (!b100.classList.contains('crossed')) {
            updateNav("まだ借りられないよ", "十の位にまだお金が届いていないよ。<br>まずは <strong>百の位の「0」</strong> をタップして崩してね！", "#ef4444");
            return;
        }
        if (mMid10.innerText === '10' && !b10.classList.contains('crossed')) {
            b10.classList.add('crossed');
            mMid10.classList.add('crossed'); // 10に斜線を入れる
            mTop10.innerText = '9';
            mMid1.innerText = '10';
            pulseAnim('memo-top-10');
            pulseAnim('memo-mid-1');
            updateNav("✨ 一の位まで届いた！", "十の位の10が「9」にへって、一の位にやっと10が届いたね！<br>これで一の位の計算（10－5）ができるよ。答えを入れよう！", "#10b981");
        }
    }
}

function loadProblem() {
    const id = parseInt(document.getElementById('prob-select').value);
    const p = problems.find(prob => prob.id === id);
    currentProb = p;

    // 筆算の下段（ひく数）の書き換え
    const op2Pad = p.op2.padStart(3, ' ');
    document.getElementById('sub-100').innerText = op2Pad[0] === ' ' ? '' : op2Pad[0];
    document.getElementById('sub-10').innerText = op2Pad[1] === ' ' ? '' : op2Pad[1];
    document.getElementById('sub-1').innerText = op2Pad[2];

    // 筆算上段（1000）の表示リセット
    document.getElementById('base-1000').classList.remove('crossed');
    document.getElementById('base-100').classList.remove('crossed');
    document.getElementById('base-10').classList.remove('crossed');
    
    // メモと答え欄の完全リセット
    document.querySelectorAll('.memo-div').forEach(el => {
        el.innerText = ''; el.classList.remove('crossed', 'pulse-anim');
    });
    document.querySelectorAll('.ans-input').forEach(el => {
        el.value = ''; el.disabled = false; el.classList.remove('is-wrong');
    });

    document.getElementById('btn-check').disabled = false;
    document.getElementById('btn-check').innerText = "答え合わせ";
    document.getElementById('hint-area').classList.add('hidden');
    document.getElementById('btn-hint-toggle').style.display = 'block';

    initCards();
    updateNav("めあて：0がたくさんのときの 計算のしかたを考えよう", "筆算の数字（1や0）をタップすると、<strong>ノートのように斜線が引けて、くり下がりの数字が出るよ！</strong><br>どこからかりてくればいいか考えて、順番にタップしよう！", "#0ea5e9");
}

function toggleHint() {
    document.getElementById('hint-area').classList.remove('hidden');
    document.getElementById('btn-hint-toggle').style.display = 'none';
    setTimeout(() => { document.getElementById('hint-area').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
}

function initCards() {
    cards1000 = [{ subtracted: false }];
    cards100 = []; cards10 = []; cards1 = [];
    setMode('exchange');
    renderCards();
}

function resetCards() {
    initCards();
    updateNav("🔄 カードを元にもどしたよ", "【両がえモード】で、1000円札をさわって 100円玉に両がえしてみよう！", "#0ea5e9");
}

function setMode(mode) {
    cardMode = mode;
    document.getElementById('mode-exchange').classList.remove('active');
    document.getElementById('mode-subtract').classList.remove('active');
    document.getElementById(mode === 'exchange' ? 'mode-exchange' : 'mode-subtract').classList.add('active');
}

function renderCards(animType = null) {
    const cols = { 1000: document.getElementById('col-1000'), 100: document.getElementById('col-100'), 10: document.getElementById('col-10'), 1: document.getElementById('col-1') };
    const counts = { 100: document.getElementById('count-100'), 10: document.getElementById('count-10'), 1: document.getElementById('count-1') };
    
    cols[1000].innerHTML = ''; cols[100].innerHTML = ''; cols[10].innerHTML = ''; cols[1].innerHTML = '';
    let activeCounts = { 100: 0, 10: 0, 1: 0 };

    cards1000.forEach((c, idx) => {
        const el = document.createElement('div');
        el.className = 'math-card c-1000' + (c.subtracted ? ' subtracted' : '');
        el.innerText = '1000円';
        el.onclick = () => handleCardClick(1000, idx);
        cols[1000].appendChild(el);
    });

    cards100.forEach((c, idx) => {
        const el = document.createElement('div');
        el.className = 'math-card c-100' + (c.subtracted ? ' subtracted' : '');
        el.innerText = '100円';
        el.onclick = () => handleCardClick(100, idx);
        if(animType === '100' && idx >= cards100.length - 10) el.classList.add('anim-pop');
        cols[100].appendChild(el);
        if(!c.subtracted) activeCounts[100]++;
    });

    cards10.forEach((c, idx) => {
        const el = document.createElement('div');
        el.className = 'math-card c-10' + (c.subtracted ? ' subtracted' : '');
        el.innerText = '10円';
        el.onclick = () => handleCardClick(10, idx);
        if(animType === '10' && idx >= cards10.length - 10) el.classList.add('anim-pop');
        cols[10].appendChild(el);
        if(!c.subtracted) activeCounts[10]++;
    });

    cards1.forEach((c, idx) => {
        const el = document.createElement('div');
        el.className = 'math-card c-1' + (c.subtracted ? ' subtracted' : '');
        el.innerText = '1円';
        el.onclick = () => handleCardClick(1, idx);
        if(animType === '1' && idx >= cards1.length - 10) el.classList.add('anim-pop');
        cols[1].appendChild(el);
        if(!c.subtracted) activeCounts[1]++;
    });

    counts[100].innerText = activeCounts[100] + '枚';
    counts[10].innerText = activeCounts[10] + '枚';
    counts[1].innerText = activeCounts[1] + '枚';
}

function handleCardClick(type, idx) {
    if (cardMode === 'exchange') {
        if (type === 1000) {
            cards1000.splice(idx, 1);
            for(let i=0; i<10; i++) cards100.push({subtracted: false});
            renderCards('100');
            updateNav("💡 1000円札がくずれたね！", "100円玉が10枚になったよ。次は 100円玉を1枚選んで 10円玉に両がえしよう。", "#0ea5e9");
        } else if (type === 100 && !cards100[idx].subtracted) {
            cards100.splice(idx, 1);
            for(let i=0; i<10; i++) cards10.push({subtracted: false});
            renderCards('10');
            updateNav("💡 100円玉がくずれたね！", "次は 10円玉を1枚選んで 1円玉に両がえしよう。", "#0ea5e9");
        } else if (type === 10 && !cards10[idx].subtracted) {
            cards10.splice(idx, 1);
            for(let i=0; i<10; i++) cards1.push({subtracted: false});
            renderCards('1');
            updateNav("✨ 一の位まで両がえできた！", "これで準備完了！<strong>「❌ けすモード」</strong>にして、引く数（代金）の分だけお金を消そう！", "#f59e0b");
        }
    } else {
        let arr = type === 1000 ? cards1000 : (type === 100 ? cards100 : (type === 10 ? cards10 : cards1));
        if(arr[idx]) { arr[idx].subtracted = !arr[idx].subtracted; renderCards(); }
    }
}

function checkAnswer() {
    const ansArr = currentProb.ans.padStart(3, ' ');
    const a100 = toHalfWidth(document.getElementById('ans-100').value);
    const a10 = toHalfWidth(document.getElementById('ans-10').value);
    const a1 = toHalfWidth(document.getElementById('ans-1').value);

    let isCorrect = true;
    const checkDigit = (input, ansChar) => (ansChar === ' ') ? (input === '' || input === '0') : (input === ansChar);

    if (!checkDigit(a100, ansArr[0])) { document.getElementById('ans-100').classList.add('is-wrong'); isCorrect = false; }
    if (!checkDigit(a10, ansArr[1])) { document.getElementById('ans-10').classList.add('is-wrong'); isCorrect = false; }
    if (!checkDigit(a1, ansArr[2])) { document.getElementById('ans-1').classList.add('is-wrong'); isCorrect = false; }

    // 繰り下がりメモのチェック
    if (isCorrect && !document.getElementById('base-10').classList.contains('crossed')) {
        updateNav("おしい！", "答えは合っているよ。<br>でも、<strong>筆算の数字をタップしてくり下がりのメモ</strong>を完成させてから、もう一度ボタンをおしてね！", "#f59e0b");
        return;
    }

    if (isCorrect) {
        updateNav("🎉 全問大正解！ 🎉", "お見事！ 0が並んでいても、上の位から順に借りてくれば簡単に筆算ができるね！", "#10b981");
        document.querySelectorAll('.ans-input').forEach(el => el.disabled = true);
        document.getElementById('btn-check').disabled = true;
        document.getElementById('btn-check').innerText = "クリア！";
        document.getElementById('matome-box').classList.remove('hidden');
    } else {
        updateNav("もういちど たしかめよう", "答えの数字がちがうみたい。<br>数カードを動かして、残った枚数を数えてみよう！", "#danger");
        setTimeout(() => { document.querySelectorAll('.ans-input').forEach(el => el.classList.remove('is-wrong')); }, 800);
    }
}

window.onload = loadProblem;