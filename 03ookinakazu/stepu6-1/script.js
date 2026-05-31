let appState = {
    mode: 'add', // 'add' or 'sub'
    cards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 0: in pool, 1: used
    slots: [null, null, null, null, null, null, null, null], // 0-3: Num1, 4-7: Num2
    num1: 0,
    num2: 0,
    ans: 0
};

function toHalfWidth(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).trim();
}

function updateNav(phase, title, msg, color) {
    const titleEl = document.getElementById(`nav-title${phase}`);
    const msgEl = document.getElementById(`nav-msg${phase}`);
    const board = document.getElementById(`nav-board${phase}`);
    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerHTML = msg;
    if (board) board.style.borderColor = color;
    if (titleEl) titleEl.style.backgroundColor = color;
}

// -------------------------------------------------------------------
// フェーズ1：式ビルダー
// -------------------------------------------------------------------

function initBuilder() {
    const pool = document.getElementById('cards-pool');
    pool.innerHTML = '';
    for (let i = 0; i <= 9; i++) {
        const card = document.createElement('div');
        card.className = 'num-card';
        card.id = `card-${i}`;
        card.innerText = i;
        card.onclick = () => selectCard(i);
        pool.appendChild(card);
    }
    renderBuilder();
}

function setMode(mode) {
    appState.mode = mode;
    document.getElementById('btn-mode-add').classList.toggle('active', mode === 'add');
    document.getElementById('btn-mode-sub').classList.toggle('active', mode === 'sub');
    document.getElementById('eq-sign').innerText = mode === 'add' ? '＋' : '－';
    validateFormula();
}

function selectCard(num) {
    // 既に使用済みなら無視
    if (appState.slots.includes(num)) return;
    
    // 空いている最初のスロットを探す
    const emptyIdx = appState.slots.findIndex(val => val === null);
    if (emptyIdx !== -1) {
        appState.slots[emptyIdx] = num;
        renderBuilder();
        validateFormula();
    }
}

function returnCard(slotIdx) {
    if (appState.slots[slotIdx] !== null) {
        appState.slots[slotIdx] = null;
        renderBuilder();
        validateFormula();
    }
}

function renderBuilder() {
    // スロットの描画
    for (let i = 0; i < 8; i++) {
        const slot = document.getElementById(`slot-${i}`);
        const val = appState.slots[i];
        slot.innerText = val !== null ? val : '';
        slot.classList.toggle('filled', val !== null);
    }
    
    // プールの描画
    for (let i = 0; i <= 9; i++) {
        const card = document.getElementById(`card-${i}`);
        if (appState.slots.includes(i)) {
            card.classList.add('used');
        } else {
            card.classList.remove('used');
        }
    }
}

function validateFormula() {
    const alertBox = document.getElementById('builder-alert');
    const btnStart = document.getElementById('btn-start-hissan');
    
    // 全て埋まっているか
    const isFull = !appState.slots.includes(null);
    if (!isFull) {
        alertBox.innerText = "カードをえらんで、すべてのマスをうめよう！";
        alertBox.style.color = "#ef4444";
        btnStart.disabled = true;
        return;
    }

    // 千の位が0でないかチェック
    if (appState.slots[0] === 0 || appState.slots[4] === 0) {
        alertBox.innerText = "千の位に「0」は おけないよ。やりなおそう！";
        alertBox.style.color = "#ef4444";
        btnStart.disabled = true;
        return;
    }

    // 数値の計算
    const n1 = appState.slots[0]*1000 + appState.slots[1]*100 + appState.slots[2]*10 + appState.slots[3];
    const n2 = appState.slots[4]*1000 + appState.slots[5]*100 + appState.slots[6]*10 + appState.slots[7];
    appState.num1 = n1;
    appState.num2 = n2;

    // ひき算の場合、引かれる数 > 引く数 かチェック
    if (appState.mode === 'sub' && n1 <= n2) {
        alertBox.innerText = "ひき算は「大きい数 － 小さい数」にしてね！";
        alertBox.style.color = "#ef4444";
        btnStart.disabled = true;
        return;
    }

    // すべてOK！
    alertBox.innerText = "✨ ばっちり！ 式ができたね！ ✨";
    alertBox.style.color = "#10b981";
    btnStart.disabled = false;
}


// -------------------------------------------------------------------
// フェーズ2：筆算エリア
// -------------------------------------------------------------------

function startHissan() {
    document.getElementById('phase-builder').classList.add('hidden');
    document.getElementById('phase-hissan').classList.remove('hidden');

    // 筆算の初期化
    setupHissanGrid();
    
    updateNav(
        "-hissan", 
        "自分たちでつくった式を、筆算でとこう！", 
        "位をそろえて計算しよう。むずかしい時は「💡 サポート」ボタンをおすと、くり上がりや くり下がりのメモを自動で書いてくれるよ！", 
        "#f59e0b"
    );
}

function setupHissanGrid() {
    // 記号
    document.getElementById('hissan-sign').innerText = appState.mode === 'add' ? '＋' : '－';

    // ひかれる数
    document.getElementById('base-3').innerText = appState.slots[0];
    document.getElementById('base-2').innerText = appState.slots[1];
    document.getElementById('base-1').innerText = appState.slots[2];
    document.getElementById('base-0').innerText = appState.slots[3];

    // ひく数
    document.getElementById('sub-3').innerText = appState.slots[4];
    document.getElementById('sub-2').innerText = appState.slots[5];
    document.getElementById('sub-1').innerText = appState.slots[6];
    document.getElementById('sub-0').innerText = appState.slots[7];

    // 答えとメモのリセット
    for (let i = 0; i <= 4; i++) {
        const ansInput = document.getElementById(`ans-${i}`);
        if(ansInput) { ansInput.value = ''; ansInput.disabled = false; ansInput.classList.remove('is-wrong'); }
        
        const memoTop = document.getElementById(`memo-top-${i}`);
        if(memoTop) { memoTop.value = ''; memoTop.classList.remove('auto-fill-anim'); }
        
        const memoMid = document.getElementById(`memo-mid-${i}`);
        if(memoMid) { memoMid.value = ''; memoMid.classList.remove('auto-fill-anim'); }
    }

    // 斜線のリセット
    document.querySelectorAll('.num-base').forEach(el => el.classList.remove('crossed'));
    
    const checkBtn = document.getElementById('btn-check');
    checkBtn.disabled = false;
    checkBtn.innerText = "答え合わせ";
}

// 💡 魔法の「自動メモ機能」
function autoMemo() {
    const s = appState.slots;
    const n1 = [s[3], s[2], s[1], s[0], 0]; // 1, 10, 100, 1000, 10000
    const n2 = [s[7], s[6], s[5], s[4], 0];

    // 一旦メモや斜線をクリア
    document.querySelectorAll('.memo-input').forEach(el => el.value = '');
    document.querySelectorAll('.num-base').forEach(el => el.classList.remove('crossed'));

    if (appState.mode === 'add') {
        // たし算のくり上がり
        let carry = 0;
        for (let i = 0; i < 4; i++) {
            let sum = n1[i] + n2[i] + carry;
            if (sum >= 10) {
                carry = 1;
                const targetId = `memo-mid-${i+1}`;
                const el = document.getElementById(targetId);
                el.value = '1';
                el.classList.add('auto-fill-anim');
            } else {
                carry = 0;
            }
        }
    } else {
        // ひき算の波及的くり下がり（アルゴリズムで完全再現）
        let currentN1 = [...n1];
        
        for (let i = 0; i < 4; i++) {
            if (currentN1[i] < n2[i]) {
                // 借りる場所を探す
                let borrowIdx = i + 1;
                while (borrowIdx < 4 && currentN1[borrowIdx] === 0) {
                    borrowIdx++;
                }
                
                if (borrowIdx < 4) {
                    // 借りる場所の処理
                    document.getElementById(`base-${borrowIdx}`).classList.add('crossed');
                    currentN1[borrowIdx]--;
                    let elTop = document.getElementById(`memo-top-${borrowIdx}`);
                    elTop.value = currentN1[borrowIdx];
                    elTop.classList.add('auto-fill-anim');

                    // 間の0を9にする処理
                    for (let k = borrowIdx - 1; k > i; k--) {
                        document.getElementById(`base-${k}`).classList.add('crossed');
                        currentN1[k] = 9;
                        let elK = document.getElementById(`memo-top-${k}`);
                        elK.value = '9';
                        elK.classList.add('auto-fill-anim');
                    }
                    
                    // 現在の桁に10を渡す
                    currentN1[i] += 10;
                    let elMid = document.getElementById(`memo-mid-${i}`);
                    elMid.value = '10';
                    elMid.classList.add('auto-fill-anim');
                }
            }
        }
    }
    
    // アニメーションクラスを後で外す
    setTimeout(() => {
        document.querySelectorAll('.memo-input').forEach(el => el.classList.remove('auto-fill-anim'));
    }, 600);
}

function checkAnswer() {
    // 正解の計算
    const trueAns = appState.mode === 'add' ? appState.num1 + appState.num2 : appState.num1 - appState.num2;
    const ansStr = trueAns.toString().padStart(5, ' '); // 最大5桁をスペース埋め
    const ansArr = ansStr.split('').reverse(); // [1, 10, 100, 1000, 10000]

    let isCorrect = true;

    for (let i = 0; i <= 4; i++) {
        const inputEl = document.getElementById(`ans-${i}`);
        const userVal = toHalfWidth(inputEl.value);
        const correctVal = ansArr[i];
        
        if (correctVal === ' ') {
            // 空白であるべき場所は、未入力か0ならOK
            if (userVal !== '' && userVal !== '0') {
                inputEl.classList.add('is-wrong');
                isCorrect = false;
            } else {
                inputEl.classList.remove('is-wrong');
            }
        } else {
            if (userVal !== correctVal) {
                inputEl.classList.add('is-wrong');
                isCorrect = false;
            } else {
                inputEl.classList.remove('is-wrong');
            }
        }
    }

    if (isCorrect) {
        updateNav(
            "-hissan", 
            "🎉 大正解！すごいぞ！ 🎉", 
            "自分たちでつくった式を、正しく計算できたね！<br>もどって、ちがう式をつくってみよう！", 
            "#10b981"
        );
        document.querySelectorAll('.ans-input').forEach(el => el.disabled = true);
        document.getElementById('btn-check').disabled = true;
        document.getElementById('btn-check').innerText = "クリア！";
    } else {
        updateNav(
            "-hissan", 
            "もういちど たしかめよう", 
            "どこか計算がちがうみたい。「💡 サポート」ボタンをおして メモを見直してみよう！", 
            "#ef4444"
        );
        setTimeout(() => {
            document.querySelectorAll('.ans-input').forEach(el => el.classList.remove('is-wrong'));
        }, 800);
    }
}

function backToBuilder() {
    document.getElementById('phase-hissan').classList.add('hidden');
    document.getElementById('phase-builder').classList.remove('hidden');
}

// 初期化
window.onload = initBuilder;