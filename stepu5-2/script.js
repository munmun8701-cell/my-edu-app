// 全問題データ
const problems = {
    1: { id: 1, op1: "1000", op2: "521", ans: "479" },
    2: { id: 2, op1: "1000", op2: "382", ans: "618" },
    3: { id: 3, op1: "1000", op2: " 46", ans: "954" }
};

// ★重要：問題切り替え時に記録が消えないためのデータ保存ステート
let appState = {
    currentProbId: 1,
    cardMode: 'exchange',
    problems: {
        1: { cleared: false, secretCleared: false, ans100: '', ans10: '', ans1: '', sec100: '', sec10: '', sec1: '', crossed: [], memoValues: {} },
        2: { cleared: false, secretCleared: false, ans100: '', ans10: '', ans1: '', sec100: '', sec10: '', sec1: '', crossed: [], memoValues: {} },
        3: { cleared: false, secretCleared: false, ans100: '', ans10: '', ans1: '', sec100: '', sec10: '', sec1: '', crossed: [], memoValues: {} }
    }
};

let cards1000 = [], cards100 = [], cards10 = [], cards1 = [];

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
    if(el) {
        el.classList.remove('pulse-anim');
        void el.offsetWidth; 
        el.classList.add('pulse-anim');
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-btn-${tabId}`).classList.add('active');
    document.getElementById('tab-content-1').classList.add('hidden');
    document.getElementById('tab-content-2').classList.add('hidden');
    document.getElementById(`tab-content-${tabId}`).classList.remove('hidden');
}

// 問題のセレクトボックスが変わったとき、現在の状態を保存して次を読み込む
function changeProblem() {
    saveCurrentProblemState();
    const select = document.getElementById('prob-select');
    loadProblem(parseInt(select.value));
}

// 現在の画面の入力内容を記憶に保存する
function saveCurrentProblemState() {
    const pid = appState.currentProbId;
    const store = appState.problems[pid];

    store.ans100 = document.getElementById('ans-100').value;
    store.ans10 = document.getElementById('ans-10').value;
    store.ans1 = document.getElementById('ans-1').value;

    store.sec100 = document.getElementById('sec-100').value;
    store.sec10 = document.getElementById('sec-10').value;
    store.sec1 = document.getElementById('sec-1').value;

    // 斜線メモの状態を保存
    store.crossed = [];
    ['base-1000', 'base-100', 'base-10'].forEach(id => {
        if(document.getElementById(id).classList.contains('crossed')) {
            store.crossed.push(id);
        }
    });

    // くり下がり数字のテキストを保存
    store.memoValues = {
        'memo-top-100': document.getElementById('memo-top-100').innerText,
        'memo-top-10': document.getElementById('memo-top-10').innerText,
        'memo-mid-100': document.getElementById('memo-mid-100').innerText,
        'memo-mid-10': document.getElementById('memo-mid-10').innerText,
        'memo-mid-1': document.getElementById('memo-mid-1').innerText,
        'memo-mid-100-crossed': document.getElementById('memo-mid-100').classList.contains('crossed'),
        'memo-mid-10-crossed': document.getElementById('memo-mid-10').classList.contains('crossed')
    };
}

// 記憶から画面へデータを完全に復元する
function loadProblem(id = 1) {
    appState.currentProbId = id;
    const p = problems[id];
    const store = appState.problems[id];

    document.getElementById('prob-select').value = id;

    // ひく数のリセット表示
    const op2Pad = p.op2.padStart(3, ' ');
    document.getElementById('sub-100').innerText = op2Pad[0] === ' ' ? '' : op2Pad[0];
    document.getElementById('sub-10').innerText = op2Pad[1] === ' ' ? '' : op2Pad[1];
    document.getElementById('sub-1').innerText = op2Pad[2];

    // 入力欄の復元
    document.getElementById('ans-100').value = store.ans100;
    document.getElementById('ans-10').value = store.ans10;
    document.getElementById('ans-1').value = store.ans1;
    document.getElementById('ans-100').disabled = store.cleared;
    document.getElementById('ans-10').disabled = store.cleared;
    document.getElementById('ans-1').disabled = store.cleared;

    document.getElementById('sec-100').value = store.sec100;
    document.getElementById('sec-10').value = store.sec10;
    document.getElementById('sec-1').value = store.sec1;
    document.getElementById('sec-100').disabled = store.secretCleared;
    document.getElementById('sec-10').disabled = store.secretCleared;
    document.getElementById('sec-1').disabled = store.secretCleared;

    // 斜線状態の復元
    ['base-1000', 'base-100', 'base-10'].forEach(id => {
        const el = document.getElementById(id);
        if(store.crossed.includes(id)) el.classList.add('crossed');
        else el.classList.remove('crossed');
    });

    // メモ数字の復元
    const mv = store.memoValues;
    document.getElementById('memo-top-100').innerText = mv['memo-top-100'] || '';
    document.getElementById('memo-top-10').innerText = mv['memo-top-10'] || '';
    document.getElementById('memo-mid-100').innerText = mv['memo-mid-100'] || '';
    document.getElementById('memo-mid-10').innerText = mv['memo-mid-10'] || '';
    document.getElementById('memo-mid-1').innerText = mv['memo-mid-1'] || '';
    
    if(mv['memo-mid-100-crossed']) document.getElementById('memo-mid-100').classList.add('crossed');
    else document.getElementById('memo-mid-100').classList.remove('crossed');
    
    if(mv['memo-mid-10-crossed']) document.getElementById('memo-mid-10').classList.add('crossed');
    else document.getElementById('memo-mid-10').classList.remove('crossed');

    // ボタン表示制御
    const checkBtn = document.getElementById('btn-check');
    if(store.cleared) {
        checkBtn.disabled = true; checkBtn.innerText = "正解！";
    } else {
        checkBtn.disabled = false; checkBtn.innerText = "答え合わせ";
    }

    const sBtn = document.getElementById('btn-check-secret');
    if(store.secretCleared) {
        sBtn.disabled = true; sBtn.innerText = "クリア！";
    } else {
        sBtn.disabled = false; sBtn.innerText = "ひみつ はっけん！";
    }

    // 各セクションの表示切り替え
    if(store.cleared) {
        setupSecretArea();
        document.getElementById('secret-area').classList.remove('hidden');
    } else {
        document.getElementById('secret-area').classList.add('hidden');
    }

    document.getElementById('hint-area').classList.add('hidden');
    document.getElementById('btn-hint-toggle').style.display = 'block';

    updateProgressBadges();
    initCards();

    if(store.cleared) {
        updateNav("🎉 このもんだいはクリアしているよ！", "ひみつの法則の計算や、次の問題にチャレンジしよう！", "#10b981");
    } else {
        updateNav("めあて：計算をして、たしかめの式から「ひみつ」を見つけよう", "まずは、1000からのひき算をしよう。<br>筆算の数字（1や0）をタップすると、<strong>くり下がりのメモ</strong>が書けるよ！", "#0ea5e9");
    }
}

// 進捗状況マーク（💮など）を更新する機能
function updateProgressBadges() {
    for(let i=1; i<=3; i++) {
        const badge = document.getElementById(`badge-${i}`);
        if(appState.problems[i].cleared) {
            badge.innerText = `①②③`[i-1] + ` 💮`;
            badge.classList.add('cleared');
        } else {
            badge.innerText = `①②③`[i-1] + ` 🔘`;
            badge.classList.remove('cleared');
        }
    }
}

function handleHissanTap(place) {
    const store = appState.problems[appState.currentProbId];
    if(store.cleared) return; // クリア後は動かさない

    const b1000 = document.getElementById('base-1000');
    const b100 = document.getElementById('base-100');
    const b10 = document.getElementById('base-10');
    
    const mMid100 = document.getElementById('memo-mid-100');
    const mMid10 = document.getElementById('memo-mid-10');
    const mMid1 = document.getElementById('memo-mid-1');
    const mTop100 = document.getElementById('memo-top-100');
    const mTop10 = document.getElementById('memo-top-10');

    if (place === 1000) {
        if (!b1000.classList.contains('crossed')) {
            b1000.classList.add('crossed');
            mMid100.innerText = '10';
            pulseAnim('memo-mid-100');
            updateNav("💡 1000をくずしたね！", "百の位に10がきたよ。<br>次は <strong>百の位の「0」</strong> をタップして、十の位に貸してあげよう！", "#0ea5e9");
        }
    } 
    else if (place === 100) {
        if (!b1000.classList.contains('crossed')) {
            updateNav("あれ？", "百の位も「0」だから かりられないよ。<br>まずは <strong>千の位の「1」</strong> をタップしよう！", "#ef4444");
            return;
        }
        if (mMid100.innerText === '10' && !b100.classList.contains('crossed')) {
            b100.classList.add('crossed');
            mMid100.classList.add('crossed');
            mTop100.innerText = '9';
            mMid10.innerText = '10';
            pulseAnim('memo-top-100');
            pulseAnim('memo-mid-10');
            updateNav("💡 十の位へ貸したよ！", "百の位の10が「9」になって、十の位に10がきたね！<br>次は <strong>十の位の「0」</strong> をタップして一の位に貸そう！", "#f59e0b");
        }
    } 
    else if (place === 10) {
        if (!b100.classList.contains('crossed')) {
            updateNav("まだだよ！", "十の位に まだ お金が届いていないよ。<br>まずは <strong>百の位の「0」</strong> をタップしてくずしてね！", "#ef4444");
            return;
        }
        if (mMid10.innerText === '10' && !b10.classList.contains('crossed')) {
            b10.classList.add('crossed');
            mMid10.classList.add('crossed');
            mTop10.innerText = '9';
            mMid1.innerText = '10';
            pulseAnim('memo-top-10');
            pulseAnim('memo-mid-1');
            updateNav("✨ 一の位まで届いた！", "十の位の10が「9」になって、一の位にやっと10が届いたね！<br>これで計算ができるよ。答えを入れよう！", "#10b981");
        }
    }
    saveCurrentProblemState();
}

function checkHissan() {
    const p = problems[appState.currentProbId];
    const store = appState.problems[appState.currentProbId];
    
    const ansArr = p.ans.padStart(3, ' ');
    const a100 = toHalfWidth(document.getElementById('ans-100').value);
    const a10 = toHalfWidth(document.getElementById('ans-10').value);
    const a1 = toHalfWidth(document.getElementById('ans-1').value);

    let isCorrect = true;
    const checkDigit = (input, ansChar) => (ansChar === ' ') ? (input === '' || input === '0') : (input === ansChar);

    if (!checkDigit(a100, ansArr[0])) { document.getElementById('ans-100').classList.add('is-wrong'); isCorrect = false; }
    if (!checkDigit(a10, ansArr[1])) { document.getElementById('ans-10').classList.add('is-wrong'); isCorrect = false; }
    if (!checkDigit(a1, ansArr[2])) { document.getElementById('ans-1').classList.add('is-wrong'); isCorrect = false; }

    if (isCorrect && !document.getElementById('base-10').classList.contains('crossed')) {
        updateNav("おしい！", "答えは合っているよ。<br>でも、<strong>筆算の数字をタップしてくり下がりのメモ</strong>を完成させてね！", "#f59e0b");
        return;
    }

    if (isCorrect) {
        store.cleared = true; // クリアを記憶
        saveCurrentProblemState();
        updateProgressBadges();

        updateNav("🎉 大正解！ 🎉", "ひき算ができたね！<br>次は、右下の<strong>「たしかめの式」</strong>を見て、おもしろい ひみつを探そう！", "#10b981");
        document.getElementById('ans-100').disabled = true;
        document.getElementById('ans-10').disabled = true;
        document.getElementById('ans-1').disabled = true;
        document.getElementById('btn-check').disabled = true;
        document.getElementById('btn-check').innerText = "正解！";
        
        setupSecretArea();
        document.getElementById('secret-area').classList.remove('hidden');
        setTimeout(() => { document.getElementById('secret-area').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
        
        checkAllClearCondition(); // 全問クリアしたか判定
    } else {
        updateNav("もういちど たしかめよう", "計算がどこかちがうみたい。<br>「💡 ヒント」ボタンをおして、カードを操作しながら考えてみよう！", "#ef4444");
        setTimeout(() => { document.querySelectorAll('.ans-input').forEach(el => el.classList.remove('is-wrong')); }, 800);
    }
}

function setupSecretArea() {
    const p = problems[appState.currentProbId];
    const ans = p.ans.padStart(3, '0');
    const sub = p.op2.padStart(3, '0');

    document.getElementById('chk-ans-100').innerText = ans[0] === '0' ? '' : ans[0];
    document.getElementById('chk-ans-10').innerText = ans[1];
    document.getElementById('chk-ans-1').innerText = ans[2];

    document.getElementById('chk-sub-100').innerText = sub[0] === '0' ? '' : sub[0];
    document.getElementById('chk-sub-10').innerText = sub[1];
    document.getElementById('chk-sub-1').innerText = sub[2];

    document.getElementById('s-val-100a').innerText = ans[0] === '0' ? '0' : ans[0];
    document.getElementById('s-val-100b').innerText = sub[0] === '0' ? '0' : sub[0];
    document.getElementById('s-val-10a').innerText = ans[1];
    document.getElementById('s-val-10b').innerText = sub[1];
    document.getElementById('s-val-1a').innerText = ans[2];
    document.getElementById('s-val-1b').innerText = sub[2];
}

function checkSecret() {
    const store = appState.problems[appState.currentProbId];
    const v100 = toHalfWidth(document.getElementById('sec-100').value);
    const v10 = toHalfWidth(document.getElementById('sec-10').value);
    const v1 = toHalfWidth(document.getElementById('sec-1').value);

    let ok = true;
    if (v100 !== "9") { document.getElementById('sec-100').classList.add('is-wrong'); ok = false; }
    if (v10 !== "9") { document.getElementById('sec-10').classList.add('is-wrong'); ok = false; }
    if (v1 !== "10") { document.getElementById('sec-1').classList.add('is-wrong'); ok = false; }

    if (ok) {
        store.secretCleared = true;
        saveCurrentProblemState();
        updateNav("💡 ひみつ はっけん！", "すごい！ 答えと引く数をたすと、<strong>一の位は10、十と百の位は9</strong> になるんだね！<br>上のメニューから<strong>「② 1000メーカー」</strong>をえらんで遊んでみよう！", "#d946ef");
        document.getElementById('sec-100').disabled = true;
        document.getElementById('sec-10').disabled = true;
        document.getElementById('sec-1').disabled = true;
        document.getElementById('btn-check-secret').disabled = true;
        document.getElementById('btn-check-secret').innerText = "クリア！";
        checkAllClearCondition();
    } else {
        setTimeout(() => { document.querySelectorAll('.sec-input').forEach(el => el.classList.remove('is-wrong')); }, 800);
    }
}

// 💮 3問題すべてクリアしたか確認するロジック
function checkAllClearCondition() {
    const allDone = Object.values(appState.problems).every(p => p.cleared === true);
    if (allDone) {
        setTimeout(() => {
            document.getElementById('clear-screen').classList.remove('hidden');
        }, 1200);
    }
}

// ヒント数カード系の関数
function initCards() {
    cards1000 = [{ subtracted: false }]; cards100 = []; cards10 = []; cards1 = [];
    renderCards();
}
function resetCards() { initCards(); }
function setMode(mode) { cardMode = mode; document.getElementById('mode-exchange').classList.toggle('active', mode==='exchange'); document.getElementById('mode-subtract').classList.toggle('active', mode==='subtract'); }
function renderCards() {
    const cols = { 1000: document.getElementById('col-1000'), 100: document.getElementById('col-100'), 10: document.getElementById('col-10'), 1: document.getElementById('col-1') };
    cols[1000].innerHTML = ''; cols[100].innerHTML = ''; cols[10].innerHTML = ''; cols[1].innerHTML = '';
    let act = { 100: 0, 10: 0, 1: 0 };
    cards1000.forEach((c, idx) => { let el = document.createElement('div'); el.className = 'math-card c-1000' + (c.subtracted ? ' subtracted' : ''); el.innerText = '1000'; el.onclick = () => handleCardClick(1000, idx); cols[1000].appendChild(el); });
    cards100.forEach((c, idx) => { let el = document.createElement('div'); el.className = 'math-card c-100' + (c.subtracted ? ' subtracted' : ''); el.innerText = '100'; el.onclick = () => handleCardClick(100, idx); cols[100].appendChild(el); if(!c.subtracted) act[100]++; });
    cards10.forEach((c, idx) => { let el = document.createElement('div'); el.className = 'math-card c-10' + (c.subtracted ? ' subtracted' : ''); el.innerText = '10'; el.onclick = () => handleCardClick(10, idx); cols[10].appendChild(el); if(!c.subtracted) act[10]++; });
    cards1.forEach((c, idx) => { let el = document.createElement('div'); el.className = 'math-card c-1' + (c.subtracted ? ' subtracted' : ''); el.innerText = '1'; el.onclick = () => handleCardClick(1, idx); cols[1].appendChild(el); if(!c.subtracted) act[1]++; });
    document.getElementById('count-100').innerText = act[100]; document.getElementById('count-10').innerText = act[10]; document.getElementById('count-1').innerText = act[1];
}
function handleCardClick(type, idx) {
    if (cardMode === 'exchange') {
        if (type === 1000) { cards1000.splice(idx, 1); for(let i=0; i<10; i++) cards100.push({subtracted: false}); }
        else if (type === 100) { cards100.splice(idx, 1); for(let i=0; i<10; i++) cards10.push({subtracted: false}); }
        else if (type === 10) { cards10.splice(idx, 1); for(let i=0; i<10; i++) cards1.push({subtracted: false}); }
        renderCards();
    } else {
        let arr = type === 1000 ? cards1000 : (type === 100 ? cards100 : (type === 10 ? cards10 : cards1));
        if(arr[idx]) { arr[idx].subtracted = !arr[idx].subtracted; renderCards(); }
    }
}


// ----------------------------------------------------
// タブ2：1000メーカー＆たしかめシミュレーション
// ----------------------------------------------------
const makerInputs = ['m-a1', 'm-a2', 'm-a3', 'm-b1', 'm-b2', 'm-b3'];
makerInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateMakerIndicatorsOnly);
});

// 数字が入った時にメーター（目標数値）の枠だけをリアルタイムで色変えする
function updateMakerIndicatorsOnly() {
    const a1 = parseInt(toHalfWidth(document.getElementById('m-a1').value)) || 0;
    const a2 = parseInt(toHalfWidth(document.getElementById('m-a2').value)) || 0;
    const a3 = parseInt(toHalfWidth(document.getElementById('m-a3').value)) || 0;
    const b1 = parseInt(toHalfWidth(document.getElementById('m-b1').value)) || 0;
    const b2 = parseInt(toHalfWidth(document.getElementById('m-b2').value)) || 0;
    const b3 = parseInt(toHalfWidth(document.getElementById('m-b3').value)) || 0;

    updateMakerBox('100', a1 + b1, 9);
    updateMakerBox('10', a2 + b2, 9);
    updateMakerBox('1', a3 + b3, 10);
}

function updateMakerBox(place, sum, target) {
    const box = document.getElementById(`sum-box-${place}`);
    document.getElementById(`sum-val-${place}`).innerText = sum;
    box.classList.toggle('achieved', sum === target);
}

// ★児童の「本当に1000になる？」を解決するステップたしかめアニメーション機能★
function runVerifySimulation() {
    const a1 = parseInt(toHalfWidth(document.getElementById('m-a1').value)) || 0;
    const a2 = parseInt(toHalfWidth(document.getElementById('m-a2').value)) || 0;
    const a3 = parseInt(toHalfWidth(document.getElementById('m-a3').value)) || 0;
    const b1 = parseInt(toHalfWidth(document.getElementById('m-b1').value)) || 0;
    const b2 = parseInt(toHalfWidth(document.getElementById('m-b2').value)) || 0;
    const b3 = parseInt(toHalfWidth(document.getElementById('m-b3').value)) || 0;

    // 右側の検証用ボードに値をセット
    document.getElementById('v-num-a1').innerText = a1;
    document.getElementById('v-num-a2').innerText = a2;
    document.getElementById('v-num-a3').innerText = a3;
    document.getElementById('v-num-b1').innerText = b1;
    document.getElementById('v-num-b2').innerText = b2;
    document.getElementById('v-num-b3').innerText = b3;

    // 一旦クリア表示
    ['v-kuri-1000', 'v-kuri-100', 'v-kuri-10', 'v-ans-1000', 'v-ans-100', 'v-ans-10', 'v-ans-1'].forEach(id => {
        const el = document.getElementById(id); el.innerText = ''; el.classList.remove('animate-total');
    });

    const resBox = document.getElementById('maker-result');
    resBox.innerText = "🧐 たしかめ中……";
    resBox.className = "maker-result";

    // 🚀 タイマー連動で、一の位 ➡ 十の位 ➡ 百の位へと繰り上がっていくアニメーション
    // ステップ1: 一の位の足し算 (a3 + b3)
    setTimeout(() => {
        const sum1 = a3 + b3;
        const ans1 = sum1 % 10;
        const kuri10 = Math.floor(sum1 / 10);
        
        const cellAns1 = document.getElementById('v-ans-1');
        cellAns1.innerText = ans1; cellAns1.classList.add('animate-total');

        if(kuri10 > 0) {
            const cellKuri10 = document.getElementById('v-kuri-10');
            cellKuri10.innerText = kuri10; cellKuri10.classList.add('animate-total');
        }
    }, 600);

    // ステップ2: 十の位の足し算 (a2 + b2 + 繰り上がり)
    setTimeout(() => {
        const preKuri10 = Math.floor((a3 + b3) / 10);
        const sum10 = a2 + b2 + preKuri10;
        const ans10 = sum10 % 10;
        const kuri100 = Math.floor(sum10 / 10);

        const cellAns10 = document.getElementById('v-ans-10');
        cellAns10.innerText = ans10; cellAns10.classList.add('animate-total');

        if(kuri100 > 0) {
            const cellKuri100 = document.getElementById('v-kuri-100');
            cellKuri100.innerText = kuri100; cellKuri100.classList.add('animate-total');
        }
    }, 1400);

    // ステップ3: 百の位の足し算と、千の位への繰り上がり (a1 + b1 + 繰り上がり)
    setTimeout(() => {
        const preKuri10 = Math.floor((a3 + b3) / 10);
        const preKuri100 = Math.floor((a2 + b2 + preKuri10) / 10);
        const sum100 = a1 + b1 + preKuri100;
        
        const ans100 = sum100 % 10;
        const kuri1000 = Math.floor(sum100 / 10);

        const cellAns100 = document.getElementById('v-ans-100');
        cellAns100.innerText = ans100; cellAns100.classList.add('animate-total');

        if(kuri1000 > 0) {
            const cellAns1000 = document.getElementById('v-ans-1000');
            cellAns1000.innerText = kuri1000; cellAns1000.classList.add('animate-total');
        }

        // 最終判定の出力
        const finalSum = (a1*100 + a2*10 + a3) + (b1*100 + b2*10 + b3);
        if(finalSum === 1000) {
            resBox.innerHTML = `✨ すごい！たし算すると <strong>${finalSum}</strong> になった！大成功！ ✨`;
            resBox.className = "maker-result success";
        } else {
            resBox.innerHTML = `あれれ？たし算すると <strong>${finalSum}</strong> になったよ。<br>「9・9・10」のひみつに合わせて直してみよう！`;
            resBox.className = "maker-result";
        }
    }, 2200);
}

function setRandomMaker() {
    document.getElementById('m-a1').value = Math.floor(Math.random() * 9) + 1; 
    document.getElementById('m-a2').value = Math.floor(Math.random() * 10);    
    document.getElementById('m-a3').value = Math.floor(Math.random() * 9) + 1; 
    document.getElementById('m-b1').value = '';
    document.getElementById('m-b2').value = '';
    document.getElementById('m-b3').value = '';
    updateMakerIndicatorsOnly();
    document.getElementById('maker-result').innerText = "数字が変わったよ。たしかめボタンをおしてね！";
}

function clearMaker() {
    makerInputs.forEach(id => document.getElementById(id).value = '');
    updateMakerIndicatorsOnly();
    document.getElementById('maker-result').innerText = "マスをきれいにしたよ！";
}

function closeClearScreen() { document.getElementById('clear-screen').classList.add('hidden'); }
function resetApp() { location.reload(); }

window.onload = () => { loadProblem(1); };