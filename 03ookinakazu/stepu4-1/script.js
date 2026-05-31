let state = {
    h: 4,
    t: 0,
    o: 2
};

// 全角を半角にする
function toHalfWidth(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).trim();
}

function updateNav(title, msg, color = "#10b981") {
    const titleEl = document.getElementById('nav-title');
    const msgEl = document.getElementById('nav-msg');
    const board = document.getElementById('nav-board');
    titleEl.innerText = title;
    msgEl.innerHTML = msg;
    board.style.borderColor = color;
    titleEl.style.backgroundColor = color;
}

// カードの描画
function renderCards(animateType = null) {
    const col100 = document.getElementById('col-100');
    const col10 = document.getElementById('col-10');
    const col1 = document.getElementById('col-1');

    col100.innerHTML = '';
    col10.innerHTML = '';
    col1.innerHTML = '';

    // 100のカード
    for(let i=0; i < state.h; i++) {
        const card = document.createElement('div');
        card.className = 'math-card c-100';
        card.innerText = '100';
        card.onclick = () => exchange100();
        col100.appendChild(card);
    }

    // 10のカード
    for(let i=0; i < state.t; i++) {
        const card = document.createElement('div');
        card.className = 'math-card c-10';
        card.innerText = '10';
        card.onclick = () => exchange10();
        if(animateType === '10' && i >= state.t - 10) card.classList.add('anim-pop');
        col10.appendChild(card);
    }

    // 1のカード
    for(let i=0; i < state.o; i++) {
        const card = document.createElement('div');
        card.className = 'math-card c-1';
        card.innerText = '1';
        // 1は両替できないのでonclickなし
        if(animateType === '1' && i >= state.o - 10) card.classList.add('anim-pop');
        col1.appendChild(card);
    }
}

// 100を10に両替
function exchange100() {
    if (state.h > 0) {
        state.h--;
        state.t += 10;
        renderCards('10');
        
        // 児童への声かけをアップデート
        updateNav("💡 百の位からかりられたね！", "100のカードが、10のカード10まいに変身したよ！<br>これで、<strong>一の位（2－5）</strong>のために、10をかりてこれるかな？", "#0ea5e9");
        
        // 筆算の斜線ガイド（自動ではなく、気づきを促す）
        document.getElementById('base-100').classList.add('crossed');
    }
}

// 10を1に両替
function exchange10() {
    if (state.t > 0) {
        state.t--;
        state.o += 10;
        renderCards('1');
        
        updateNav("✨ 準備OK！", "10のカードをくずして、1の位に10かりてこれたね！<br>これで「12－5」が計算できるよ。<strong>筆算のメモと答え</strong>を書いてみよう！", "#f59e0b");
        
        document.getElementById('base-10').classList.add('crossed');
    }
}

function resetCards() {
    state = { h: 4, t: 0, o: 2 };
    renderCards();
    updateNav("話し合ってみよう！", "「2－5」はできないね。十の位からかりようとしたけど、十の位は「0」だ！<br><strong>こんなとき、どうすれば計算できるかな？</strong><br>左の数カードをさわって、友だちとためしてみよう！", "#10b981");
    
    // 斜線を消す
    document.getElementById('base-100').classList.remove('crossed');
    document.getElementById('base-10').classList.remove('crossed');
}

// 筆算の数字をクリックしても斜線を引けるようにする（手書きの代わり）
document.querySelectorAll('.num-base').forEach(el => {
    el.addEventListener('click', function() {
        this.classList.toggle('crossed');
    });
});

// 答え合わせ
function checkAnswer() {
    // 答えのチェック
    const a100 = toHalfWidth(document.getElementById('ans-100').value);
    const a10 = toHalfWidth(document.getElementById('ans-10').value);
    const a1 = toHalfWidth(document.getElementById('ans-1').value);

    let isCorrect = true;

    if (a100 !== "2") { document.getElementById('ans-100').classList.add('is-wrong'); isCorrect = false; }
    if (a10 !== "2") { document.getElementById('ans-10').classList.add('is-wrong'); isCorrect = false; }
    if (a1 !== "7") { document.getElementById('ans-1').classList.add('is-wrong'); isCorrect = false; }

    // メモ欄は自由度を持たせるため、厳密にすべて弾くことはしないが、
    // 全く書いていなかったら促す機能をつけても良い。
    // 今回は「答えが合っているか」を最優先し、合っていればクリア。

    if (isCorrect) {
        updateNav("🎉 大正解！ 🎉", "すばらしい！<br>「十の位が0」のときは、百の位からじゅんばんにかりてくれば計算できるんだね！", "#10b981");
        
        document.querySelectorAll('.ans-input').forEach(el => el.disabled = true);
        document.getElementById('matome-box').classList.remove('hidden');
        document.querySelector('.btn-check').disabled = true;
        document.querySelector('.btn-check').innerText = "クリア！";
        document.querySelector('.btn-check').style.background = "#94a3b8";
        document.querySelector('.btn-check').style.boxShadow = "none";
    } else {
        updateNav("もういちど たしかめよう", "計算がどこかちがうみたい。<br>メモの数字（かりてきた数や、のこった数）が正しく書けているか見直そう。", "#ef4444");
        
        setTimeout(() => {
            document.querySelectorAll('.ans-input').forEach(el => el.classList.remove('is-wrong'));
        }, 800);
    }
}

// 初期化
window.onload = () => {
    renderCards();
};