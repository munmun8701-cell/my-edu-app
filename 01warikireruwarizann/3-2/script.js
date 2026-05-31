const problems = {
    1: {
        text: "花が <strong>18本</strong> あります。<br><strong>6本</strong> ずつたばにして花たばを作ります。<br>花たばはいくつできますか。",
        total: 18,
        perGroup: 6,
        unitGroup: "たば",
        groupName: "花たば",
        ansGroup: 3
    },
    2: {
        text: "<strong>24こ</strong> のボールを <strong>4こ</strong> ずつかごに入れると、<br>かごはいくつひつようですか。",
        total: 24,
        perGroup: 4,
        unitGroup: "こ",  // 教科書では「いくつ必要か」に対して「○こ」などと答えることが多い
        groupName: "かご",
        ansGroup: 6
    }
};

let currentProbId = 1;
let stockCount = 0;
let itemGroups = []; // 各まとまりに入っているおはじきの数

function toHalfWidth(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
}

function updateNav(title, msg, color = "#0ea5e9") {
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
    document.getElementById('ans-unit').innerText = p.unitGroup;
    
    // ボタンのテキスト変更
    const btnIcon = id === 1 ? "💐" : "🧺";
    document.getElementById('btn-add-text').innerText = `${btnIcon} 1つめの${p.groupName}を作る`;

    stockCount = p.total;
    itemGroups = [];

    document.getElementById('matome-box').classList.add('hidden');
    
    // 入力欄リセット
    ['ans-total', 'ans-per', 'ans-group', 'ans-final'].forEach(inputId => {
        const el = document.getElementById(inputId);
        el.value = ''; el.disabled = false; el.classList.remove('is-wrong', 'is-correct');
    });
    document.getElementById('btn-check').disabled = false;
    document.getElementById('btn-check').innerText = "答え合わせ";

    renderStock();
    renderGroups();
    checkState();
}

// ストックのおはじきを描画
function renderStock() {
    document.getElementById('stock-num').innerText = stockCount;
    const container = document.getElementById('stock-items');
    container.innerHTML = '';
    for (let i = 0; i < stockCount; i++) {
        const div = document.createElement('div');
        div.className = 'ohajiki';
        // クリックで自動割り当て
        div.onclick = () => autoDistributeOne();
        container.appendChild(div);
    }
}

// 新しいまとまりを追加
function addGroup() {
    itemGroups.push(0);
    renderGroups();
    checkState();
}

// まとまりにおはじきを追加
function addToGroup(idx) {
    if (stockCount > 0) {
        stockCount--;
        itemGroups[idx]++;
        renderStock();
        renderGroups();
        checkState();
    }
}

// まとまりからおはじきを戻す
function removeFromGroup(idx) {
    if (itemGroups[idx] > 0) {
        stockCount++;
        itemGroups[idx]--;
        renderStock();
        renderGroups();
        checkState();
    }
}

// まとまり自体を削除する
function removeGroup(idx) {
    stockCount += itemGroups[idx];
    itemGroups.splice(idx, 1);
    renderStock();
    renderGroups();
    checkState();
}

// 自動割り当て（空きがあるまとまりへ）
function autoDistributeOne() {
    const p = problems[currentProbId];
    // 規定数（6個や4個）に達していないまとまりを探す
    let targetIdx = itemGroups.findIndex(c => c < p.perGroup);
    if (targetIdx !== -1) {
        addToGroup(targetIdx);
    } else {
        // 全部のまとまりがいっぱいの場合
        updateNav(`あふれちゃうよ！`, `もう全部の${p.groupName}がいっぱいだよ！新しい${p.groupName}を作ろう。`, "#ef4444");
    }
}

// まとまりと吹き出しの描画
function renderGroups() {
    const p = problems[currentProbId];
    const container = document.getElementById('groups-area');
    container.innerHTML = '';
    
    // ボタンのテキスト更新（「2つめの花たばを作る」など）
    const btnIcon = currentProbId === 1 ? "💐" : "🧺";
    document.getElementById('btn-add-text').innerText = `${btnIcon} ${itemGroups.length + 1}つめの${p.groupName}を作る`;
    
    itemGroups.forEach((count, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'group-wrapper';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close';
        closeBtn.innerText = '×';
        closeBtn.onclick = () => removeGroup(idx);
        
        const groupEl = document.createElement('div');
        groupEl.className = 'item-group';
        groupEl.onclick = () => addToGroup(idx);
        
        for(let i=0; i<count; i++) {
            const item = document.createElement('div');
            item.className = 'ohajiki';
            item.onclick = (e) => { e.stopPropagation(); removeFromGroup(idx); };
            groupEl.appendChild(item);
        }
        
        const label = document.createElement('div');
        label.className = 'group-label';
        label.innerText = `${idx + 1}つめ`;
        
        wrapper.appendChild(closeBtn);
        wrapper.appendChild(groupEl);
        wrapper.appendChild(label);
        
        // 最後の1つに吹き出しをつける
        if (idx === itemGroups.length - 1) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.id = 'status-bubble';
            wrapper.appendChild(bubble);
        }
        
        container.appendChild(wrapper);
    });
}

// 状態チェック
function checkState() {
    const p = problems[currentProbId];
    let allPerfect = true;
    for (let c of itemGroups) {
        if (c !== p.perGroup) allPerfect = false;
    }
    
    const isFinished = (stockCount === 0);
    
    let navTitle = "めあて：同じ数のまとまりを作ろう";
    let navMsg = "";
    let color = "#0ea5e9";
    let isLocked = true;
    let bubbleMsg = "";
    let bubbleFinish = false;
    
    if (itemGroups.length === 0) {
        navMsg = `まずはボタンをおして、おはじきを入れる「${p.groupName}」を1つ出そう。`;
    } else {
        if (isFinished) {
            if (itemGroups.length > 0 && allPerfect) {
                navTitle = "ステップ ②：式と答えを書こう";
                navMsg = `ぜんぶ分けられたね！<br><strong>${p.groupName}がいくつできたか</strong>を数えて、式と答えを完成させよう。`;
                color = "#f59e0b";
                isLocked = false;
                bubbleMsg = "ぜんぶ<br>分けられた！";
                bubbleFinish = true;
            } else {
                navTitle = "考えてみよう";
                navMsg = `おはじきがなくなったけど、1つのまとまりが<strong>${p.perGroup}こ</strong>になっていない所があるよ。<br>おはじきを動かして、同じ数にそろえよう！`;
                color = "#ef4444";
                bubbleMsg = "あれ？";
            }
        } else {
            // ストックあり
            if (allPerfect && itemGroups.length > 0) {
                navMsg = `1つのまとまりが ${p.perGroup}こ になったね！<br>まだおはじきがのこっているから、<strong>新しい${p.groupName}</strong>を出そう。`;
                bubbleMsg = "まだ<br>分けられる！";
            } else {
                navMsg = `おはじきをクリックして、1つのまとまりを<strong>${p.perGroup}こ</strong>にしよう！`;
                bubbleMsg = "分ける途中...";
            }
        }
    }
    
    updateNav(navTitle, navMsg, color);
    
    // 式入力エリアのロック
    const section = document.getElementById('answer-section');
    if (isLocked) section.classList.add('locked-section');
    else {
        section.classList.remove('locked-section');
        if(bubbleFinish) {
            setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
        }
    }
    
    // 吹き出し更新
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
    
    if (total != p.total) { document.getElementById('ans-total').classList.add('is-wrong'); correct = false; }
    else { document.getElementById('ans-total').classList.remove('is-wrong'); document.getElementById('ans-total').classList.add('is-correct'); }

    if (per != p.perGroup) { document.getElementById('ans-per').classList.add('is-wrong'); correct = false; }
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
        updateNav("もういちど たしかめよう", "数字がどこかちがうみたい。<br>「ぜんぶの数 ÷ 1つ分の数 ＝ いくつ分」になるよ。", "#ef4444");
    }
}

function resetCurrent() {
    loadProblem(currentProbId);
}

window.onload = () => loadProblem(1);