window.toHalfWidth = function(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};

const problems = {
    1: { op1: ["", "3", "4", "7"], op2: ["", "1", "7", "8"], ans: ["", "5", "2", "5"], c10: true, c100: true, c1000: false },
    2: { op1: ["", "7", "6", "3"], op2: ["", "4", "5", "9"], ans: ["1", "2", "2", "2"], c10: true, c100: true, c1000: true }
};

let currentProb = 1;
let phase = 'calc1';

window.updateNav = function(title, msg, color) {
    const titleEl = document.getElementById('nav-title');
    const msgEl = document.getElementById('nav-msg');
    const boardEl = document.getElementById('nav-board');
    if(titleEl) titleEl.innerText = title;
    if(msgEl) msgEl.innerHTML = msg;
    if(boardEl && color) {
        boardEl.style.borderColor = color;
        titleEl.style.backgroundColor = color;
    }
};

window.flashError = function(elId) {
    const el = document.getElementById(elId);
    if(el) {
        el.classList.add('wrong-input');
        setTimeout(() => el.classList.remove('wrong-input'), 800);
    }
};

window.loadProblem = function(probId) {
    currentProb = probId;
    phase = 'calc1';

    // タブの切り替え
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-tab' + probId).classList.add('active');

    const data = problems[probId];

    // 問題のセット
    ['1000', '100', '10', '1'].forEach((col, idx) => {
        document.getElementById('op1-' + col).innerText = data.op1[idx];
        document.getElementById('op2-' + col).innerText = data.op2[idx];
        
        // 入力マスとくり上がりマスのリセット
        const ansInput = document.getElementById('ans-' + col);
        ansInput.value = '';
        ansInput.disabled = true;
        ansInput.classList.remove('correct-input', 'wrong-input');
        document.getElementById('wrap-' + col).classList.remove('active-col');
        
        if(document.getElementById('carry-' + col)) {
            const carryInput = document.getElementById('carry-' + col);
            carryInput.value = '';
            carryInput.disabled = true;
            carryInput.classList.remove('correct-input', 'wrong-input');
            carryInput.classList.add('hidden');
        }
    });

    // 答えの千の位の入力枠の表示/非表示（問1は不要なので隠す）
    if(probId === 1) {
        document.getElementById('ans-1000').classList.add('hidden');
    } else {
        document.getElementById('ans-1000').classList.remove('hidden');
    }

    // 初期状態：一の位をアクティブに
    document.getElementById('ans-1').disabled = false;
    document.getElementById('wrap-1').classList.add('active-col');
    
    document.getElementById('btn-calc').innerText = "かくにん";
    document.getElementById('btn-calc').disabled = false;

    window.updateNav(
        "ステップ ①：一の位（いちのくらい）",
        `右はしからスタート！<br><strong>${data.op1[3]} ＋ ${data.op2[3]} ＝ ？</strong><br>ピンクのマスに入れよう。`, 
        "#f472b6"
    );
};

window.processStep = function() {
    const data = problems[currentProb];

    if (phase === 'calc1') {
        const v = window.toHalfWidth(document.getElementById('ans-1').value.trim());
        if (v === data.ans[3]) {
            document.getElementById('ans-1').classList.add('correct-input');
            document.getElementById('ans-1').disabled = true;
            document.getElementById('wrap-1').classList.remove('active-col');
            
            phase = 'calc10';
            document.getElementById('ans-10').disabled = false;
            document.getElementById('wrap-10').classList.add('active-col');
            
            let msg = `次は真ん中の黄色いマスだね。<br><strong>${data.op1[2]} ＋ ${data.op2[2]} ＝ ？</strong>`;
            
            if (data.c10) {
                document.getElementById('carry-10').classList.remove('hidden');
                document.getElementById('carry-10').disabled = false;
                document.getElementById('carry-10').focus();
                msg = `10をこえたね！<br><span class="highlight-text">十の位への「くり上がりの 1 」</span>を、小さな赤いマスにわすれずに書こう！<br>それから黄色のマスを計算してね。`;
            } else {
                document.getElementById('ans-10').focus();
            }
            window.updateNav("ステップ ②：十の位を計算しよう", msg, "#eab308");
        } else {
            window.flashError('ans-1');
            window.updateNav("ステップ ①：一の位", `おしい！ <strong>${data.op1[3]} ＋ ${data.op2[3]}</strong> をもう一度計算してみて！`, "#ef4444");
        }
    }

    else if (phase === 'calc10') {
        const v = window.toHalfWidth(document.getElementById('ans-10').value.trim());
        let carryCorrect = true;
        
        if (data.c10) {
            const cVal = window.toHalfWidth(document.getElementById('carry-10').value.trim());
            if (cVal !== "1") { carryCorrect = false; window.flashError('carry-10'); }
        }

        if (v === data.ans[2] && carryCorrect) {
            document.getElementById('ans-10').classList.add('correct-input');
            document.getElementById('ans-10').disabled = true;
            document.getElementById('wrap-10').classList.remove('active-col');
            if(data.c10) document.getElementById('carry-10').disabled = true;
            
            phase = 'calc100';
            document.getElementById('ans-100').disabled = false;
            document.getElementById('wrap-100').classList.add('active-col');
            
            let msg = `左の水色のマスだ。<br><strong>${data.op1[1]} ＋ ${data.op2[1]} ＝ ？</strong>`;
            
            if (data.c100) {
                document.getElementById('carry-100').classList.remove('hidden');
                document.getElementById('carry-100').disabled = false;
                document.getElementById('carry-100').focus();
                msg = `ここでも10をこえたね！<br><span class="highlight-text">百の位への「くり上がりの 1 」</span>を赤いマスに書いてから、計算しよう。`;
            } else {
                document.getElementById('ans-100').focus();
            }

            window.updateNav("ステップ ③：百の位を計算しよう", msg, "#0ea5e9");
        } else {
            if (!carryCorrect) {
                window.updateNav("ステップ ②：十の位", "小さな赤いマスには、くり上がりの「1」が入るよ！", "#ef4444");
            } else {
                window.flashError('ans-10');
                let hint = data.c10 ? "くり上がりの「1」をたすのをわすれてないかな？" : "たし算をもう一度たしかめよう！";
                window.updateNav("ステップ ②：十の位", hint, "#ef4444");
            }
        }
    }

    else if (phase === 'calc100') {
        const v = window.toHalfWidth(document.getElementById('ans-100').value.trim());
        let carryCorrect = true;
        
        if (data.c100) {
            const cVal = window.toHalfWidth(document.getElementById('carry-100').value.trim());
            if (cVal !== "1") { carryCorrect = false; window.flashError('carry-100'); }
        }

        if (v === data.ans[1] && carryCorrect) {
            document.getElementById('ans-100').classList.add('correct-input');
            document.getElementById('ans-100').disabled = true;
            document.getElementById('wrap-100').classList.remove('active-col');
            if(data.c100) document.getElementById('carry-100').disabled = true;
            
            // 答えが4桁になる場合（問2）は、千の位へ
            if (currentProb === 2) {
                phase = 'calc1000';
                document.getElementById('ans-1000').disabled = false;
                document.getElementById('wrap-1000').classList.add('active-col');
                document.getElementById('ans-1000').focus();
                window.updateNav("ステップ ④：千の位にくり上がり！", `百の位も10をこえたね！<br>あふれた「1」は、新しい<strong>「千の位」</strong>の部屋に入るよ。緑のマスに書こう。`, "#10b981");
            } else {
                phase = 'done';
                document.getElementById('btn-calc').innerText = "クリア！";
                document.getElementById('btn-calc').disabled = true;
                window.updateNav("✨ 大正解！ ✨", `答えは「${data.ans.join('')}」だね！<br>くり上がりが2回あっても、順番に計算すればだいじょうぶ！`, "#10b981");
            }
        } else {
            if (!carryCorrect) {
                window.updateNav("ステップ ③：百の位", "小さな赤いマスには、くり上がりの「1」が入るよ！", "#ef4444");
            } else {
                window.flashError('ans-100');
                let hint = data.c100 ? "くり上がりの「1」をたすのをわすれてないかな？" : "たし算をもう一度たしかめよう！";
                window.updateNav("ステップ ③：百の位", hint, "#ef4444");
            }
        }
    }

    else if (phase === 'calc1000') {
        const v = window.toHalfWidth(document.getElementById('ans-1000').value.trim());
        if (v === data.ans[0]) {
            document.getElementById('ans-1000').classList.add('correct-input');
            document.getElementById('ans-1000').disabled = true;
            document.getElementById('wrap-1000').classList.remove('active-col');
            
            phase = 'done';
            document.getElementById('btn-calc').innerText = "クリア！";
            document.getElementById('btn-calc').disabled = true;
            
            window.updateNav("🎉 すごい！ 4けたの筆算マスター！ 🎉", `答えは「${data.ans.join('')}」だね！<br>百の位がくり上がると、答えが4けたになるんだね。よくできました！`, "#10b981");
        } else {
            window.flashError('ans-1000');
            window.updateNav("ステップ ④：千の位", "百の位からあふれた数はいくつかな？", "#ef4444");
        }
    }
};

// 起動時に問1をロード
window.onload = function() {
    window.loadProblem(1);
};