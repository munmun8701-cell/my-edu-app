window.toHalfWidth = function(str) {
    if (!window.toHalfWidth = function(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};

// 全9問のデータ
const problems = {
    1: { op1: "196", op2: "739" },
    2: { op1: "264", op2: "148" },
    3: { op1: "379", op2:  "62" },
    4: { op1:  "26", op2: "785" },
    5: { op1: "205", op2: "398" },
    6: { op1: "487", op2:  "17" },
    7: { op1: "623", op2: "514" },
    8: { op1: "407", op2: "834" },
    9: { op1: "942", op2:  "58" }
};

let currentProb = 1;
let phase = 'setup'; // setup -> calc_1 -> group_1 -> input_1 -> calc_10...
let targetPlace = 1; // 現在計算中の位（1, 10, 100, 1000）
let coinsCount = { 1000: 0, 100: 0, 10: 0, 1: 0 };
let currentData = { op1Arr: [], op2Arr: [], ansArr: [] };

function updateNav(title, msg, color) {
    document.getElementById('nav-title').innerText = title;
    document.getElementById('nav-msg').innerHTML = msg;
    document.getElementById('nav-board').style.borderColor = color;
    document.getElementById('nav-title').style.backgroundColor = color;
}

function flashError(elId) {
    const el = document.getElementById(elId);
    el.classList.add('wrong-input');
    setTimeout(() => el.classList.remove('wrong-input'), 800);
}

// コインを描画する
function renderCoins() {
    [1000, 100, 10, 1].forEach(place => {
        const area = document.getElementById(`blocks-${place}`);
        area.innerHTML = '';
        for(let i=0; i<coinsCount[place]; i++) {
            const coin = document.createElement('div');
            coin.className = `coin coin-${place}`;
            coin.innerText = place;
            area.appendChild(coin);
        }
    });
}

function loadProblem() {
    currentProb = parseInt(document.getElementById('prob-select').value);
    const data = problems[currentProb];
    
    // 計算結果の準備
    const padStr = (str) => str.padStart(3, ' ').split('');
    currentData.op1Arr = padStr(data.op1);
    currentData.op2Arr = padStr(data.op2);
    
    const total = parseInt(data.op1.trim()) + parseInt(data.op2.trim());
    currentData.ansArr = total.toString().padStart(4, ' ').split('');

    // コインの初期枚数セット
    coinsCount = {
        1000: 0,
        100: (parseInt(currentData.op1Arr[0])||0) + (parseInt(currentData.op2Arr[0])||0),
        10:  (parseInt(currentData.op1Arr[1])||0) + (parseInt(currentData.op2Arr[1])||0),
        1:   (parseInt(currentData.op1Arr[2])||0) + (parseInt(currentData.op2Arr[2])||0)
    };
    renderCoins();

    phase = 'setup';
    targetPlace = 1;
    
    // UIのフルリセット
    ['op1-100','op1-10','op1-1','op2-100','op2-10','op2-1','ans-1000','ans-100','ans-10','ans-1','carry-1000','carry-100','carry-10'].forEach(id => {
        const el = document.getElementById(id);
        el.value = ''; el.classList.remove('correct-input', 'wrong-input');
        if(id.startsWith('ans')) { el.disabled = true; document.getElementById(id.replace('ans', 'wrap')).classList.remove('active-col'); }
        else if(id.startsWith('op')) { el.disabled = false; }
        else if(id.startsWith('carry')) { el.classList.add('hidden'); el.disabled = true; }
    });
    
    document.getElementById('ans-1000').classList.add('hidden');
    document.getElementById('btn-group').classList.add('hidden');
    document.getElementById('btn-calc').innerText = "かくにん";
    document.getElementById('btn-calc').disabled = false;

    updateNav("ステップ ①：式をたてよう", "上の問題を見て、マスに数字を入れよう。<br><strong>右はし（一の位）をピタッとそろえる</strong>のがポイントだよ！<br>何もない位は空っぽのままにしてね。", "#3b82f6");
}

function checkSetup() {
    const getVal = (id) => window.toHalfWidth(document.getElementById(id).value.trim()) || ' ';
    let isCorrect = true;
    ['100','10','1'].forEach((col, idx) => {
        if(getVal('op1-'+col) !== currentData.op1Arr[idx]) { flashError('op1-'+col); isCorrect = false; }
        if(getVal('op2-'+col) !== currentData.op2Arr[idx]) { flashError('op2-'+col); isCorrect = false; }
    });

    if (isCorrect) {
        ['op1-100','op1-10','op1-1','op2-100','op2-10','op2-1'].forEach(id => {
            document.getElementById(id).classList.add('correct-input'); document.getElementById(id).disabled = true;
        });
        startCalcPhase(1);
    } else {
        updateNav("ステップ ①：式をたてよう", "ちがうみたい。数字を入れる場所に気をつけて！<br><strong>右はしをそろえて</strong>、何もない所は空っぽにするよ。", "#ef4444");
    }
}

function startCalcPhase(place) {
    targetPlace = place;
    const colors = { 1: '#f472b6', 10: '#eab308', 100: '#0ea5e9', 1000: '#10b981' };
    const placeNames = { 1: '一', 10: '十', 100: '百', 1000: '千' };
    
    // 答えの千の位が必要な場合のみ表示
    if (place === 1000 && currentData.ansArr[0] !== ' ') {
        document.getElementById('ans-1000').classList.remove('hidden');
    } else if (place === 1000) {
        // 1000の位がなく、計算完了の場合
        phase = 'done';
        document.getElementById('btn-calc').innerText = "クリア！";
        document.getElementById('btn-calc').disabled = true;
        updateNav("✨ 大正解！ ✨", `答えは「${currentData.ansArr.join('').trim()}」だね！よくできました！`, "#10b981");
        return;
    }

    document.getElementById(`wrap-${place}`).classList.add('active-col');
    
    // コインが10枚以上あるかチェック
    if (coinsCount[place] >= 10) {
        phase = `group_${place}`;
        document.getElementById('btn-group').classList.remove('hidden');
        document.getElementById('btn-calc').disabled = true;
        updateNav(`ステップ ②：${placeNames[place]}の位の計算`, `${place}が10こ集まったよ！<br>右の「両がえボタン」をおして、となりの位へくり上げよう！`, colors[place]);
    } else {
        phase = `input_${place}`;
        document.getElementById(`ans-${place}`).disabled = false;
        document.getElementById(`ans-${place}`).focus();
        updateNav(`ステップ ②：${placeNames[place]}の位の計算`, `${placeNames[place]}の位を計算して、答えのマスに入れよう。`, colors[place]);
    }
}

// 両替ボタンを押した時
function doGroup() {
    const nextPlace = targetPlace * 10;
    
    // コインのデータを更新
    coinsCount[targetPlace] -= 10;
    coinsCount[nextPlace] += 1;
    
    // アニメーション付きで再描画
    const area = document.getElementById(`blocks-${targetPlace}`);
    const coins = area.querySelectorAll('.coin');
    for(let i=0; i<10; i++) {
        coins[i].classList.add('grouped');
    }
    
    setTimeout(() => {
        renderCoins();
        // 新しいコインを光らせる
        const nextArea = document.getElementById(`blocks-${nextPlace}`);
        if(nextArea.lastChild) nextArea.lastChild.classList.add('new-coin');
    }, 500);

    // くり上がり入力マスの表示
    if (nextPlace <= 1000) {
        const carryId = `carry-${nextPlace}`;
        if (document.getElementById(carryId)) {
            document.getElementById(carryId).classList.remove('hidden');
            document.getElementById(carryId).disabled = false;
            document.getElementById(carryId).focus();
        }
    }

    document.getElementById('btn-group').classList.add('hidden');
    document.getElementById('btn-calc').disabled = false;
    document.getElementById(`ans-${targetPlace}`).disabled = false;
    
    phase = `input_${targetPlace}`;
    updateNav(`ステップ ③：くり上がりのメモと答え`, `両がえできたね！<br>赤いマスに「くり上がりの 1 」を書いて、のこりの数を答えのマスに入れよう。`, "#e11d48");
}

function processStep() {
    if (phase === 'setup') {
        checkSetup();
        return;
    }
    
    const getVal = (id) => window.toHalfWidth(document.getElementById(id).value.trim());
    const ansIdx = { 1: 3, 10: 2, 100: 1, 1000: 0 };
    
    if (phase.startsWith('input_')) {
        let isCorrect = true;
        
        // 答えのチェック
        const ansVal = getVal(`ans-${targetPlace}`);
        if (ansVal !== currentData.ansArr[ansIdx[targetPlace]]) {
            flashError(`ans-${targetPlace}`);
            isCorrect = false;
        }

        // くり上がりのメモのチェック（両替が発生した直後のみ）
        const nextPlace = targetPlace * 10;
        let carryChecked = false;
        const carryEl = document.getElementById(`carry-${nextPlace}`);
        
        if (carryEl && !carryEl.classList.contains('hidden') && !carryEl.disabled) {
            carryChecked = true;
            if (getVal(`carry-${nextPlace}`) !== "1") {
                flashError(`carry-${nextPlace}`);
                isCorrect = false;
            }
        }

        if (isCorrect) {
            document.getElementById(`ans-${targetPlace}`).classList.add('correct-input');
            document.getElementById(`ans-${targetPlace}`).disabled = true;
            document.getElementById(`wrap-${targetPlace}`).classList.remove('active-col');
            if (carryChecked) {
                carryEl.classList.add('correct-input');
                carryEl.disabled = true;
            }
            
            // 次の位へ進む
            startCalcPhase(nextPlace);
        } else {
            if (carryChecked && getVal(`carry-${nextPlace}`) !== "1") {
                updateNav("おっと！", "小さな赤いマスには、くり上がりの「1」が入るよ！わすれずに書こう。", "#ef4444");
            } else {
                updateNav("もう一度！", "計算をもう一度たしかめよう。右のブロックの数と同じになるよ。", "#ef4444");
            }
        }
    }
}

window.onload = loadProblem;str) return "";
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};

// 問題データ（全9問）
// ans: [千, 百, 十, 一], c10: 10の位への繰り上がり, c100: 100の位への繰り上がり
const problems = {
    1: { op1: "196", op2: "739", ans: [" ", "9", "3", "5"], c10: true, c100: true },
    2: { op1: "264", op2: "148", ans: [" ", "4", "1", "2"], c10: true, c100: true },
    3: { op1: "379", op2:  "62", ans: [" ", "4", "4", "1"], c10: true, c100: true },
    4: { op1:  "26", op2: "785", ans: [" ", "8", "1", "1"], c10: true, c100: true },
    5: { op1: "205", op2: "398", ans: [" ", "6", "0", "3"], c10: true, c100: true },
    6: { op1: "487", op2:  "17", ans: [" ", "5", "0", "4"], c10: true, c100: true },
    7: { op1: "623", op2: "514", ans: ["1", "1", "3", "7"], c10: false, c100: false },
    8: { op1: "407", op2: "834", ans: ["1", "2", "4", "1"], c10: true, c100: false },
    9: { op1: "942", op2:  "58", ans: ["1", "0", "0", "0"], c10: true, c100: true }
};

let currentProb = 1;
let phase = 'setup';

window.updateNav = function(title, msg, color) {
    document.getElementById('nav-title').innerText = title;
    document.getElementById('nav-msg').innerHTML = msg;
    document.getElementById('nav-board').style.borderColor = color;
    document.getElementById('nav-title').style.backgroundColor = color;
};

window.flashError = function(elId) {
    const el = document.getElementById(elId);
    el.classList.add('wrong-input');
    setTimeout(() => el.classList.remove('wrong-input'), 800);
};

window.loadProblem = function() {
    currentProb = parseInt(document.getElementById('prob-select').value);
    phase = 'setup';
    
    // UIのフルリセット
    ['op1-100','op1-10','op1-1','op2-100','op2-10','op2-1','ans-1000','ans-100','ans-10','ans-1','carry-100','carry-10'].forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.classList.remove('correct-input', 'wrong-input');
        if(id.startsWith('ans')) {
            el.disabled = true;
            document.getElementById(id.replace('ans', 'wrap')).classList.remove('active-col');
        }
        else if(id.startsWith('op')) el.disabled = false;
        else if(id.startsWith('carry')) {
            el.classList.add('hidden');
            el.disabled = true;
        }
    });
    
    document.getElementById('ans-1000').classList.add('hidden');
    document.getElementById('btn-calc').innerText = "かくにん";
    document.getElementById('btn-calc').disabled = false;

    window.updateNav(
        "ステップ ①：式をたてよう", 
        "上の問題を見て、マスに数字を入れよう。<br><strong>右はし（一の位）をピタッとそろえる</strong>のがポイントだよ！<br>何もない位は空っぽのままにしてね。", 
        "#3b82f6"
    );
};

window.processStep = function() {
    const data = problems[currentProb];
    
    // 右詰めで配列化する処理（"26" -> [" ", "2", "6"]）
    const padStr = (str) => str.padStart(3, ' ').split('');
    const op1Arr = padStr(data.op1);
    const op2Arr = padStr(data.op2);
    const ansArr = data.ans;

    // 現在入力されている数字を取得（空白はスペースとする）
    const getVal = (id) => window.toHalfWidth(document.getElementById(id).value.trim()) || ' ';

    if (phase === 'setup') {
        let isCorrect = true;
        ['100','10','1'].forEach((col, idx) => {
            if(getVal('op1-'+col) !== op1Arr[idx]) { window.flashError('op1-'+col); isCorrect = false; }
            if(getVal('op2-'+col) !== op2Arr[idx]) { window.flashError('op2-'+col); isCorrect = false; }
        });

        if (isCorrect) {
            ['op1-100','op1-10','op1-1','op2-100','op2-10','op2-1'].forEach(id => {
                document.getElementById(id).classList.add('correct-input');
                document.getElementById(id).disabled = true;
            });
            
            phase = 'calc1';
            document.getElementById('ans-1').disabled = false;
            document.getElementById('wrap-1').classList.add('active-col');
            document.getElementById('ans-1').focus();
            window.updateNav("ステップ ②：一の位を計算しよう", `右はしからスタート！<br><strong>${op1Arr[2]} ＋ ${op2Arr[2]} ＝ ？</strong><br>ピンクのマスに入れよう。`, "#f472b6");
        } else {
            window.updateNav("ステップ ①：式をたてよう", "ちがうみたい。数字を入れる場所に気をつけて！<br><strong>右はしをそろえて</strong>、何もない所は空っぽにするよ。", "#ef4444");
        }
    }
    
    else if (phase === 'calc1') {
        if (getVal('ans-1') === ansArr[3]) {
            document.getElementById('ans-1').classList.add('correct-input');
            document.getElementById('ans-1').disabled = true;
            document.getElementById('wrap-1').classList.remove('active-col');
            
            phase = 'calc10';
            document.getElementById('ans-10').disabled = false;
            document.getElementById('wrap-10').classList.add('active-col');
            
            let num1 = op1Arr[1] === ' ' ? '0' : op1Arr[1];
            let num2 = op2Arr[1] === ' ' ? '0' : op2Arr[1];
            let msg = `次は真ん中の黄色いマスだね。<br><strong>${num1} ＋ ${num2} ＝ ？</strong>`;
            
            if (data.c10) {
                document.getElementById('carry-10').classList.remove('hidden');
                document.getElementById('carry-10').disabled = false;
                document.getElementById('carry-10').focus();
                msg = `10をこえたね！<br><span class="highlight-text">十の位への「くり上がりの 1 」</span>を、小さな赤いマスにわすれずに書こう！<br>それから黄色のマスを計算してね。`;
            } else {
                document.getElementById('ans-10').focus();
            }
            window.updateNav("ステップ ③：十の位を計算しよう", msg, "#eab308");
        } else {
            window.flashError('ans-1');
            window.updateNav("ステップ ②：一の位", `おしい！ <strong>${op1Arr[2]} ＋ ${op2Arr[2]}</strong> をもう一度計算してみて！`, "#ef4444");
        }
    }

    else if (phase === 'calc10') {
        let carryCorrect = true;
        if (data.c10 && getVal('carry-10') !== "1") { 
            carryCorrect = false; window.flashError('carry-10'); 
        }

        if (getVal('ans-10') === ansArr[2] && carryCorrect) {
            document.getElementById('ans-10').classList.add('correct-input');
            document.getElementById('ans-10').disabled = true;
            document.getElementById('wrap-10').classList.remove('active-col');
            if(data.c10) document.getElementById('carry-10').disabled = true;
            
            phase = 'calc100';
            document.getElementById('ans-100').disabled = false;
            document.getElementById('wrap-100').classList.add('active-col');
            
            let num1 = op1Arr[0] === ' ' ? '0' : op1Arr[0];
            let num2 = op2Arr[0] === ' ' ? '0' : op2Arr[0];
            let msg = `左の水色のマスだ。<br><strong>${num1} ＋ ${num2} ＝ ？</strong>`;
            
            if (data.c100) {
                document.getElementById('carry-100').classList.remove('hidden');
                document.getElementById('carry-100').disabled = false;
                document.getElementById('carry-100').focus();
                msg = `ここでも10をこえたね！<br><span class="highlight-text">百の位への「くり上がりの 1 」</span>を赤いマスに書いてから、計算しよう。`;
            } else {
                document.getElementById('ans-100').focus();
            }
            window.updateNav("ステップ ④：百の位を計算しよう", msg, "#0ea5e9");
        } else {
            if (!carryCorrect) {
                window.updateNav("ステップ ③：十の位", "あ！ くり上がりの「1」を小さな赤いマスに書くのをわすれてるよ！", "#ef4444");
            } else {
                window.flashError('ans-10');
                let hint = data.c10 ? "くり上がりの「1」をたすのをわすれてないかな？" : "たし算をもう一度たしかめよう！";
                window.updateNav("ステップ ③：十の位", hint, "#ef4444");
            }
        }
    }

    else if (phase === 'calc100') {
        let carryCorrect = true;
        if (data.c100 && getVal('carry-100') !== "1") { 
            carryCorrect = false; window.flashError('carry-100'); 
        }

        if (getVal('ans-100') === ansArr[1] && carryCorrect) {
            document.getElementById('ans-100').classList.add('correct-input');
            document.getElementById('ans-100').disabled = true;
            document.getElementById('wrap-100').classList.remove('active-col');
            if(data.c100) document.getElementById('carry-100').disabled = true;
            
            // 答えが4桁になる場合は千の位へ
            if (ansArr[0] !== ' ') {
                phase = 'calc1000';
                document.getElementById('ans-1000').classList.remove('hidden');
                document.getElementById('ans-1000').disabled = false;
                document.getElementById('wrap-1000').classList.add('active-col');
                document.getElementById('ans-1000').focus();
                window.updateNav("ステップ ⑤：千の位にくり上がり！", `百の位も10をこえたね！<br>あふれた数は、新しい<strong>「千の位」</strong>の部屋に入るよ。緑のマスにそのまま書こう。`, "#10b981");
            } else {
                phase = 'done';
                document.getElementById('btn-calc').innerText = "クリア！";
                document.getElementById('btn-calc').disabled = true;
                window.updateNav("✨ 大正解！ ✨", `答えは「${ansArr.join('').trim()}」だね！<br>むずかしい計算も、順番にやればできるね！`, "#10b981");
            }
        } else {
            if (!carryCorrect) {
                window.updateNav("ステップ ④：百の位", "小さな赤いマスには、くり上がりの「1」が入るよ！", "#ef4444");
            } else {
                window.flashError('ans-100');
                let hint = data.c100 ? "くり上がりの「1」をたすのをわすれてないかな？" : "たし算をもう一度たしかめよう！";
                window.updateNav("ステップ ④：百の位", hint, "#ef4444");
            }
        }
    }

    else if (phase === 'calc1000') {
        if (getVal('ans-1000') === ansArr[0]) {
            document.getElementById('ans-1000').classList.add('correct-input');
            document.getElementById('ans-1000').disabled = true;
            document.getElementById('wrap-1000').classList.remove('active-col');
            
            phase = 'done';
            document.getElementById('btn-calc').innerText = "クリア！";
            document.getElementById('btn-calc').disabled = true;
            
            window.updateNav("🎉 すごい！ 4けたの筆算マスター！ 🎉", `答えは「${ansArr.join('')}」だね！<br>ケタが大きくなっても計算のしかたは同じだね。よくできました！`, "#10b981");
        } else {
            window.flashError('ans-1000');
            window.updateNav("ステップ ⑤：千の位", "百の位からあふれた数はいくつかな？", "#ef4444");
        }
    }
};

window.onload = window.loadProblem;