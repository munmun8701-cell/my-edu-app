let totalCards = 20;
let perBundle = 5;
let selectedIds = [];
let bundlesMade = 0;
let stockIds = Array.from({length: 20}, (_, i) => i);

function toHalfWidth(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
}

function updateNav(title, msg, color = "#10b981") {
    const titleEl = document.getElementById('nav-title');
    const msgEl = document.getElementById('nav-msg');
    const board = document.getElementById('nav-board');
    if (title) titleEl.innerText = title;
    if (msg) msgEl.innerHTML = msg;
    board.style.borderColor = color;
    titleEl.style.backgroundColor = color;
}

// カードの描画
function renderCards() {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';
    stockIds.forEach(id => {
        const card = document.createElement('div');
        card.className = 'card-item' + (selectedIds.includes(id) ? ' selected' : '');
        card.onclick = () => toggleSelect(id);
        grid.appendChild(card);
    });
    document.getElementById('stock-num').innerText = stockIds.length;
}

// カードの選択・解除
function toggleSelect(id) {
    if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter(sid => sid !== id);
    } else {
        if (selectedIds.length < perBundle) {
            selectedIds.push(id);
        }
    }
    
    // UI更新
    document.getElementById('select-count').innerText = selectedIds.length;
    document.getElementById('btn-make-bundle').disabled = (selectedIds.length !== perBundle);
    renderCards();
    
    if (selectedIds.length === perBundle) {
        updateNav("いいぞ！", "5まいえらべたね！「配る」ボタンをおして、1人分をまとめよう。", "#f59e0b");
    } else {
        updateNav("えらんでみよう", "あと " + (perBundle - selectedIds.length) + " まいえらぼう。", "#10b981");
    }
}

// たばを作る操作
function makeBundle() {
    bundlesMade++;
    // 選択したIDをストックから消す
    stockIds = stockIds.filter(id => !selectedIds.includes(id));
    selectedIds = [];
    
    // UI更新
    document.getElementById('select-count').innerText = "0";
    document.getElementById('btn-make-bundle').disabled = true;
    renderCards();
    addBundleToUI();
    
    if (stockIds.length === 0) {
        updateNav("ぜんぶ配った！", "20まいを 5まいずつ 配りおわったね。わり算の式を書こう！", "#3b82f6");
        document.getElementById('answer-section').classList.remove('locked-section');
        document.getElementById('answer-section').scrollIntoView({ behavior: 'smooth' });
    } else {
        updateNav("つぎの「たば」は？", bundlesMade + "人に配れたよ。のこりは " + stockIds.length + "まい。まだ配れるかな？", "#10b981");
    }
}

// たばの表示
function addBundleToUI() {
    const container = document.getElementById('bundles-container');
    const box = document.createElement('div');
    box.className = 'bundle-box';
    
    const icon = document.createElement('div');
    icon.style.fontSize = '24px';
    icon.innerText = '👤';
    
    const label = document.createElement('div');
    label.style.fontWeight = 'bold';
    label.innerText = bundlesMade + "人目";
    
    const cardsRow = document.createElement('div');
    cardsRow.className = 'bundle-cards';
    for(let i=0; i<5; i++) {
        const sc = document.createElement('div');
        sc.className = 'small-card';
        cardsRow.appendChild(sc);
    }
    
    box.appendChild(icon);
    box.appendChild(cardsRow);
    box.appendChild(label);
    container.appendChild(box);
}

// 答え合わせ
function checkAnswer() {
    const total = toHalfWidth(document.getElementById('ans-total').value);
    const per = toHalfWidth(document.getElementById('ans-per').value);
    const group = toHalfWidth(document.getElementById('ans-group').value);
    const final = toHalfWidth(document.getElementById('ans-final').value);

    let ok = (total == "20" && per == "5" && group == "4" && final == "4");

    if (ok) {
        updateNav("🎉 大正解！ 🎉", "「20の中に5がいくつあるか」をさがすのも、わり算なんだね！", "#10b981");
        document.getElementById('btn-check').innerText = "クリア！";
        document.getElementById('btn-check').disabled = true;
    } else {
        if (total != "20") document.getElementById('ans-total').classList.add('is-wrong');
        if (per != "5") document.getElementById('ans-per').classList.add('is-wrong');
        if (group != "4") document.getElementById('ans-group').classList.add('is-wrong');
        if (final != "4") document.getElementById('ans-final').classList.add('is-wrong');
        updateNav("たしかめよう", "数字をよく見て、もういちど考えてみてね。", "#ef4444");
        setTimeout(() => {
            ['ans-total', 'ans-per', 'ans-group', 'ans-final'].forEach(id => {
                document.getElementById(id).classList.remove('is-wrong');
            });
        }, 1000);
    }
}

function resetApp() {
    location.reload();
}

window.onload = renderCards;