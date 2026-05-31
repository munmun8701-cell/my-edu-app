const problems = {
    1: {
        text: "パイが <strong>12こ</strong> あります。<br>1人に <strong>3こ</strong> ずつ分けると、何人に分けられますか。",
        total: 12,
        perPerson: 3,
        unit: "人",
        ansGroup: 4
    },
    2: {
        text: "クッキーが <strong>15こ</strong> あります。<br>1人に <strong>5こ</strong> ずつ分けると、何人に分けられますか。",
        total: 15,
        perPerson: 5,
        unit: "人",
        ansGroup: 3
    }
};

let currentProbId = 1;
let stockCount = 0;
let plates = []; // 各お皿に入っているおはじきの数

function toHalfWidth(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
}

function updateNav(title, msg, color = "#059669") {
    const titleEl = document.getElementById('nav-title');
    const msgEl = document.getElementById('nav-msg');
    const board = document.getElementById('nav-board');
    if (title) titleEl.innerText = title;
    if (msg) msgEl.innerHTML = msg;
    board.style.borderColor = color;
    titleEl.style.backgroundColor = color;
}

function loadProblem(id) {
    currentProbId = id;
    const p = problems[id];

    // UIリセット
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-btn-${id}`).classList.add('active');
    document.getElementById('problem-text').innerHTML = p.text;
    document.getElementById('ans-unit').innerText = p.unit;

    stockCount = p.total;
    plates = [];

    document.getElementById('matome-box').classList.add('hidden');
    
    // 入力欄リセット
    ['ans-total', 'ans-per', 'ans-group', 'ans-final'].forEach(inputId => {
        const el = document.getElementById(inputId);
        el.value = ''; el.disabled = false; el.classList.remove('is-wrong', 'is-correct');
    });
    document.getElementById('btn-check').disabled = false;
    document.getElementById('btn-check').innerText = "答え合わせ";

    renderStock();
    renderPlates();
    checkState();
}

// ストック（配る前のおはじき）を描画
function renderStock() {
    document.getElementById('stock-num').innerText = stockCount;
    const container = document.getElementById('stock-items');
    container.innerHTML = '';
    for (let i = 0; i < stockCount; i++) {
        const div = document.createElement('div');
        div.className = 'ohajiki';
        // おはじきをクリックしたら、一番入りそうなお皿に自動で入る親切機能
        div.onclick = () => autoDistributeOne();
        container.appendChild(div);
    }
}

// お皿を追加する
function addPlate() {
    plates.push(0);
    renderPlates();
    checkState();
}

// お皿におはじきを追加する
function addToPlate(idx) {
    if (stockCount > 0) {
        stockCount--;
        plates[idx]++;
        renderStock();
        renderPlates();
        checkState();
    }
}

// お皿からおはじきを戻す
function removeFromPlate(idx) {
    if (plates[idx] > 0) {
        stockCount++;
        plates[idx]--;
        renderStock();
        renderPlates();
        checkState();
    }
}

// お皿自体を削除する（間違えてお皿を出しすぎた時用）
function removePlate(idx) {
    stockCount += plates[idx];
    plates.splice(idx, 1);
    renderStock();
    renderPlates();
    checkState();
}

// ストックのおはじきをクリックした時の自動割り当て
function autoDistributeOne() {
    const p = problems[currentProbId];
    // 規定数（3個など）未満のお皿を探す
    let targetIdx = plates.findIndex(c => c < p.perPerson);
    if (targetIdx !== -1) {
        addToPlate(targetIdx);
    } else {
        // すべてのお皿がいっぱいの場合
        updateNav("お皿がないよ！", "「1人分のお皿を出す」ボタンをおして、新しいお皿をじゅんびしよう。", "#ef4444");
    }
}

// お皿と吹き出しの描画
function renderPlates() {
    const container = document.getElementById('plates-area');
    container.innerHTML = '';
    
    plates.forEach((count, idx) => {
        const group = document.createElement('div');
        group.className = 'plate-group';
        
        // ×ボタン（削除）
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close';
        closeBtn.innerText = '×';
        closeBtn.onclick = () => removePlate(idx);
        
        // お皿
        const plate = document.createElement('div');
        plate.className = 'plate';
        plate.onclick = () => addToPlate(idx);
        
        // おはじき
        for(let i=0; i<count; i++) {
            const item = document.createElement('div');
            item.className = 'ohajiki';
            item.onclick = (e) => { e.stopPropagation(); removeFromPlate(idx); };
            plate.appendChild(item);
        }
        
        // 人数ラベル
        const label = document.createElement('div');
        label.className = 'person-label';
        label.innerText = `${idx + 1}人`;
        
        group.appendChild(closeBtn);
        group.appendChild(plate);
        group.appendChild(label);
        
        // 最後の1皿にだけ吹き出しをつける（教科書の表現を再現）
        if (idx === plates.length - 1) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.id = 'status-bubble';
            group.appendChild(bubble);
        }
        
        container.appendChild(group);
    });
}

// 操作状況をチェックし、メッセージとロックを管理する
function checkState() {
    const p = problems[currentProbId];
    let allPerPerson = true;
    for (let c of plates) {
        if (c !== p.perPerson) allPerPerson = false;
    }
    
    const isFinished = (stockCount === 0);
    const hasEmptyPlate = plates.some(c => c === 0);
    
    let navTitle = "めあて：1人分（同じ数）のまとまりを作ろう";
    let navMsg = "";
    let color = "#059669";
    let isLocked = true;
    let bubbleMsg = "";
    let bubbleFinish = false;
    
    if (plates.length === 0) {
        navMsg = "まずは「1人分のお皿を出す」ボタンをおして、お皿をじゅんびしよう。";
    } else {
        if (isFinished) {
            if (plates.length > 0 && allPerPerson) {
                // 完全クリア
                navTitle = "ステップ ②：式と答えを書こう";
                navMsg = "ぜんぶ分けられたね！<br><strong>何人に配れたか（お皿の数）</strong>を数えて、式と答えを完成させよう。";
                color = "#f59e0b";
                isLocked = false;
                bubbleMsg = "ぜんぶ<br>分けられた。";
                bubbleFinish = true;
            } else {
                // ストックは0だが、配り方が間違っている
                navTitle = "考えてみよう";
                navMsg = `おはじきがなくなったけど、1人に<strong>${p.perPerson}こずつ</strong>になっていないお皿があるよ。<br>おはじきを動かしたり、あまったお皿の「×」を押して消してね。`;
                color = "#ef4444";
                bubbleMsg = "あれ？";
            }
        } else {
            // ストックあり
            if (allPerPerson && plates.length > 0) {
                // 綺麗に配れているが、まだおはじきが残っている
                navMsg = `1人に ${p.perPerson}こずつ になったね！<br>まだおはじきが ${stockCount}こ のこっているから、<strong>新しいお皿</strong>を出そう。`;
                bubbleMsg = "まだ<br>分けられる。";
            } else {
                // 配っている途中
                navMsg = `お皿をクリックして、1人に<strong>${p.perPerson}こずつ</strong>配ろう！`;
                bubbleMsg = "配る途中...";
            }
        }
    }
    
    updateNav(navTitle, navMsg, color);
    
    // 式入力エリアのロック切り替え
    const section = document.getElementById('answer-section');
    if (isLocked) section.classList.add('locked-section');
    else {
        section.classList.remove('locked-section');
        // クリア時のみスクロール
        if(bubbleFinish) {
            setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
        }
    }
    
    // 吹き出しの更新
    const bubbleEl = document.getElementById('status-bubble');
    if (bubbleEl) {
        if (bubbleMsg) {
            bubbleEl.innerHTML = bubbleMsg;
            bubbleEl.style.display = 'block';
            if (bubbleFinish) bubbleEl.classList.add('bubble-finish');
            else bubbleEl.classList.remove('bubble-finish');
        } else {
            bubbleEl.style.display = 'none';
        }
    }
}

// 答え合わせ
function checkAnswer() {
    const p = problems[currentProbId];
    const total = toHalfWidth(document.getElementById('ans-total').value);
    const per = toHalfWidth(document.getElementById('ans-per').value);
    const group = toHalfWidth(document.getElementById('ans-group').value);
    const final = toHalfWidth(document.getElementById('ans-final').value);

    let correct = true;
    
    // 12 ÷ 3 = 4
    if (total != p.total) { document.getElementById('ans-total').classList.add('is-wrong'); correct = false; }
    else { document.getElementById('ans-total').classList.remove('is-wrong'); document.getElementById('ans-total').classList.add('is-correct'); }

    if (per != p.perPerson) { document.getElementById('ans-per').classList.add('is-wrong'); correct = false; }
    else { document.getElementById('ans-per').classList.remove('is-wrong'); document.getElementById('ans-per').classList.add('is-correct'); }

    if (group != p.ansGroup) { document.getElementById('ans-group').classList.add('is-wrong'); correct = false; }
    else { document.getElementById('ans-group').classList.remove('is-wrong'); document.getElementById('ans-group').classList.add('is-correct'); }

    if (final != p.ansGroup) { document.getElementById('ans-final').classList.add('is-wrong'); correct = false; }
    else { document.getElementById('ans-final').classList.remove('is-wrong'); document.getElementById('ans-final').classList.add('is-correct'); }

    if (correct) {
        updateNav("🎉 大正解！ 🎉", "バッチリだね！<br>「いくつ分」をもとめる時もわり算が使えることがわかったね。", "#10b981");
        document.getElementById('btn-check').innerText = "クリア！";
        document.getElementById('btn-check').disabled = true;
        document.getElementById('matome-box').classList.remove('hidden');
        
        ['ans-total', 'ans-per', 'ans-group', 'ans-final'].forEach(id => {
            document.getElementById(id).disabled = true;
        });
    } else {
        updateNav("もういちど たしかめよう", "数字がどこかちがうみたい。<br>「ぜんぶの数 ÷ 1人分 ＝ 人数」になるよ。", "#ef4444");
    }
}

function resetCurrent() {
    loadProblem(currentProbId);
}

window.onload = () => loadProblem(1);