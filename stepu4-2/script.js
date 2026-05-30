const problems = [
    { id: 1, op1: "408", op2: "279", ans: "129" },
    { id: 2, op1: "905", op2: "608", ans: "297" },
    { id: 3, op1: "603", op2: "219", ans: "384" },
    { id: 4, op1: "702", op2: "644", ans: " 58" },
    { id: 5, op1: "405", op2: "347", ans: " 58" },
    { id: 6, op1: "300", op2: "292", ans: "  8" },
    { id: 7, op1: "503", op2: " 76", ans: "427" },
    { id: 8, op1: "206", op2: " 18", ans: "188" },
    { id: 9, op1: "307", op2: " 69", ans: "238" },
    { id: 10, op1: "801", op2: "  3", ans: "798" },
    { id: 11, op1: "600", op2: "  8", ans: "592" },
    { id: 12, op1: "905", op2: "  7", ans: "898" }
];

let currentProb = null;
let hintOpen = false;
let cardMode = 'exchange'; 

let cards100 = [];
let cards10 = [];
let cards1 = [];

function toHalfWidth(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).trim();
}

function updateNav(title, msg, color = "#0ea5e9") {
    const titleEl = document.getElementById('nav-title');
    const msgEl = document.getElementById('nav-msg');
    const board = document.getElementById('nav-board');
    titleEl.innerText = title;
    msgEl.innerHTML = msg;
    board.style.borderColor = color;
    titleEl.style.backgroundColor = color;
}

// 自動入力時のアニメーション用
function pulseInput(id) {
    const el = document.getElementById(id);
    el.classList.remove('pulse-anim');
    void el.offsetWidth; // アニメーションのリセット
    el.classList.add('pulse-anim');
}

// ★筆算の数字をタップしたときの「自動くり下がり」処理★
function handleCross(el, place) {
    if (el.innerText.trim() === '') return;

    el.classList.toggle('crossed');
    const isCrossed = el.classList.contains('crossed');

    if (place === 100) {
        if (isCrossed) {
            let val = parseInt(el.innerText);
            document.getElementById('memo-mid-100').value = val - 1;
            document.getElementById('memo-mid-10').value = 10;
            pulseInput('memo-mid-100');
            pulseInput('memo-mid-10');
        } else {
            document.getElementById('memo-mid-100').value = '';
            document.getElementById('memo-mid-10').value = '';
        }
    } else if (place === 10) {
        if (isCrossed) {
            // 百の位からすでに借りてきているかチェック
            let tensMemo = document.getElementById('memo-mid-10').value;
            if (tensMemo === '10') {
                document.getElementById('memo-top-10').value = 9;
                pulseInput('memo-top-10');
            }
            
            let val1 = parseInt(document.getElementById('base-1').innerText) || 0;
            document.getElementById('memo-mid-1').value = 10 + val1;
            pulseInput('memo-mid-1');
        } else {
            document.getElementById('memo-top-10').value = '';
            document.getElementById('memo-mid-1').value = '';
        }
    }
}

function loadProblem() {
    const select = document.getElementById('prob-select');
    const id = parseInt(select.value);
    currentProb = problems.find(p => p.id === id);

    const op1Pad = currentProb.op1.padStart(3, ' ');
    const op2Pad = currentProb.op2.padStart(3, ' ');

    document.getElementById('base-100').innerText = op1Pad[0] === ' ' ? '' : op1Pad[0];
    document.getElementById('base-10').innerText = op1Pad[1] === ' ' ? '' : op1Pad[1];
    document.getElementById('base-1').innerText = op1Pad[2];

    document.getElementById('sub-100').innerText = op2Pad[0] === ' ' ? '' : op2Pad[0];
    document.getElementById('sub-10').innerText = op2Pad[1] === ' ' ? '' : op2Pad[1];
    document.getElementById('sub-1').innerText = op2Pad[2];

    // 入力・メモ欄リセット
    document.querySelectorAll('.ans-input, .memo-input').forEach(el => {
        el.value = '';
        el.disabled = false;
        el.classList.remove('is-wrong', 'pulse-anim');
    });
    
    // 斜線リセット
    document.querySelectorAll('.num-base').forEach(el => el.classList.remove('crossed'));

    const checkBtn = document.getElementById('btn-check');
    checkBtn.disabled = false;
    checkBtn.innerText = "答え合わせ";

    hintOpen = false;
    document.getElementById('hint-area').classList.add('hidden');
    document.getElementById('btn-hint-toggle').style.display = 'block';
    
    initCards();

    updateNav("めあて：くり下がりに気をつけて計算しよう", "筆算の数字（百の位や十の位）をタップすると、<strong>ノートのように斜線が引けて、くり下がりの数字が出るよ！</strong><br>もし計算のしかたが分からなくなったら、下の「💡 ヒント」ボタンをおしてね！", "#0ea5e9");
}

function toggleHint() {
    hintOpen = true;
    document.getElementById('hint-area').classList.remove('hidden');
    document.getElementById('btn-hint-toggle').style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('hint-area').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function initCards() {
    const op1Pad = currentProb.op1.padStart(3, ' ');
    const h = parseInt(op1Pad[0]) || 0;
    const t = parseInt(op1Pad[1]) || 0;
    const o = parseInt(op1Pad[2]) || 0;

    cards100 = Array.from({length: h}, () => ({ subtracted: false }));
    cards10 = Array.from({length: t}, () => ({ subtracted: false }));
    cards1 = Array.from({length: o}, () => ({ subtracted: false }));

    setMode('exchange');
    renderCards();
}

function resetCards() {
    initCards();
    updateNav("🔄 カードを元にもどしたよ", "【両がえモード】で、100のカードをさわって10にバラしてみよう！", "#f59e0b");
}

function setMode(mode) {
    cardMode = mode;
    document.getElementById('mode-exchange').classList.remove('active');
    document.getElementById('mode-subtract').classList.remove('active');
    
    if (mode === 'exchange') {
        document.getElementById('mode-exchange').classList.add('active');
    } else {
        document.getElementById('mode-subtract').classList.add('active');
    }
}

function renderCards(animType = null) {
    const cols = { 100: document.getElementById('col-100'), 10: document.getElementById('col-10'), 1: document.getElementById('col-1') };
    const counts = { 100: document.getElementById('count-100'), 10: document.getElementById('count-10'), 1: document.getElementById('count-1') };
    
    cols[100].innerHTML = ''; cols[10].innerHTML = ''; cols[1].innerHTML = '';
    
    let activeCounts = { 100: 0, 10: 0, 1: 0 };

    cards100.forEach((c, idx) => {
        const el = document.createElement('div');
        el.className = 'math-card c-100' + (c.subtracted ? ' subtracted' : '');
        el.innerText = '100';
        el.onclick = () => handleCardClick(100, idx);
        cols[100].appendChild(el);
        if(!c.subtracted) activeCounts[100]++;
    });

    cards10.forEach((c, idx) => {
        const el = document.createElement('div');
        el.className = 'math-card c-10' + (c.subtracted ? ' subtracted' : '');
        el.innerText = '10';
        el.onclick = () => handleCardClick(10, idx);
        if(animType === '10' && idx >= cards10.length - 10) el.classList.add('anim-pop');
        cols[10].appendChild(el);
        if(!c.subtracted) activeCounts[10]++;
    });

    cards1.forEach((c, idx) => {
        const el = document.createElement('div');
        el.className = 'math-card c-1' + (c.subtracted ? ' subtracted' : '');
        el.innerText = '1';
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
    let arr = type === 100 ? cards100 : (type === 10 ? cards10 : cards1);
    const card = arr[idx];

    if (cardMode === 'exchange') {
        if (card.subtracted) return;
        
        if (type === 100) {
            arr.splice(idx, 1);
            for(let i=0; i<10; i++) cards10.push({subtracted: false}); 
            renderCards('10');
            updateNav("💡 百の位からかりられたね！", "100のカードが、10のカード10まいに変身したよ！<br>次は 10のカードをさわって 1のカードに両がえしよう。", "#0ea5e9");
        } else if (type === 10) {
            arr.splice(idx, 1);
            for(let i=0; i<10; i++) cards1.push({subtracted: false});
            renderCards('1');
            updateNav("✨ 準備OK！", "一の位にも かりてこれたね！<br><strong>「❌ けすモード」</strong>に切り替えて、引く数の分だけカードを消そう！", "#f59e0b");
        }
    } else if (cardMode === 'subtract') {
        card.subtracted = !card.subtracted;
        renderCards();
    }
}

function checkAnswer() {
    const ansArr = currentProb.ans.padStart(3, ' ');
    const a100 = toHalfWidth(document.getElementById('ans-100').value);
    const a10 = toHalfWidth(document.getElementById('ans-10').value);
    const a1 = toHalfWidth(document.getElementById('ans-1').value);

    let isCorrect = true;

    const checkDigit = (input, ansChar) => {
        if (ansChar === ' ') return input === '' || input === '0'; 
        return input === ansChar;
    };

    if (!checkDigit(a100, ansArr[0])) { document.getElementById('ans-100').classList.add('is-wrong'); isCorrect = false; }
    if (!checkDigit(a10, ansArr[1])) { document.getElementById('ans-10').classList.add('is-wrong'); isCorrect = false; }
    if (!checkDigit(a1, ansArr[2])) { document.getElementById('ans-1').classList.add('is-wrong'); isCorrect = false; }

    if (isCorrect) {
        updateNav("🎉 大正解！ 🎉", "すばらしい！「十の位が0」のときは、百の位からじゅんばんにかりてくれば計算できるんだね！", "#10b981");
        document.querySelectorAll('.ans-input').forEach(el => el.disabled = true);
        document.querySelector('.btn-check').disabled = true;
        document.querySelector('.btn-check').innerText = "クリア！";
        
        setTimeout(() => {
            alert("大正解！上のメニューから次の問題にちょうせんしよう！");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
    } else {
        updateNav("もういちど たしかめよう", "計算がどこかちがうみたい。<br>「💡 ヒント」ボタンをおして、カードを操作しながら考えてみよう！", "#ef4444");
        setTimeout(() => {
            document.querySelectorAll('.ans-input').forEach(el => el.classList.remove('is-wrong'));
        }, 800);
    }
}

window.onload = loadProblem;