// 全角を半角に変換する関数
window.toHalfWidth = function(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};

// タブを切り替える関数
window.switchTab = function(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active-content'));
    document.getElementById('btn-tab' + type).classList.add('active');
    document.getElementById('tab' + type).classList.add('active-content');
};

// 問1の答えをチェックする関数
window.checkConcept = function() {
    const inputEl = document.getElementById('ans-concept');
    if (!inputEl) return;
    
    const val = window.toHalfWidth(inputEl.value.trim());
    const msgEl = document.getElementById('msg-concept');
    
    // 正解の時の処理
    if (val === "100" || val === "百" || val === "１００") {
        msgEl.innerHTML = "✨大正解！ 百の位の 9 は、「100が9こ」という意味だね！";
        msgEl.style.color = "#10b981";
        inputEl.style.backgroundColor = "#dcfce7";
        inputEl.style.borderColor = "#22c55e";
        inputEl.style.color = "#15803d";
    } 
    // まちがいの時の処理
    else {
        msgEl.innerHTML = "おしい！青、黄色、ピンクのどの部屋に入っているかな？一番左の青い部屋だよ。";
        msgEl.style.color = "#ef4444";
        inputEl.classList.add('wrong-input');
        
        // 1秒後に赤色を消す
        setTimeout(() => {
            inputEl.classList.remove('wrong-input');
        }, 1000);
    }
};

// 問2のデータ
const problems = {
    1: { op1: "243", op2: "625", ans: "868", c10: false, c100: false },
    2: { op1: "327", op2: "164", ans: "491", c10: true,  c100: false },
    3: { op1: "408", op2: "369", ans: "777", c10: true,  c100: false },
    4: { op1: "134", op2: "592", ans: "726", c10: false, c100: true },
    5: { op1: "743", op2:  "65", ans: "808", c10: true,  c100: true },
    6: { op1:  "81", op2: "630", ans: "711", c10: false, c100: true }
};

let currentProb = 1;
let phase = 'setup';

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

window.loadProblem = function() {
    const selectEl = document.getElementById('prob-select');
    if(selectEl) currentProb = parseInt(selectEl.value);
    phase = 'setup';
    
    // すべての入力マスをリセット
    ['op1-100','op1-10','op1-1','op2-100','op2-10','op2-1','ans-100','ans-10','ans-1','carry-10','carry-100'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = '';
            el.classList.remove('correct-input', 'wrong-input', 'active-col');
            if(id.startsWith('op')) el.disabled = false;
            else el.disabled = true;
            if(id.startsWith('carry')) el.classList.add('hidden');
        }
    });
    
    const btn = document.getElementById('btn-calc');
    if(btn) {
        btn.innerText = "かくにん";
        btn.disabled = false;
    }

    window.updateNav("ステップ ①：式をたてよう", "上の問題を見て、マスに数字を入れよう。<br><strong>右はし（一の位）をピタッとそろえる</strong>のがポイントだよ！", "#3b82f6");
};

window.flashError = function(elId) {
    const el = document.getElementById(elId);
    if(el) {
        el.classList.add('wrong-input');
        setTimeout(() => el.classList.remove('wrong-input'), 800);
    }
};

window.processStep = function() {
    const data = problems[currentProb];
    
    const padStr = (str) => str.padStart(3, ' ').split('');
    const op1Arr = padStr(data.op1);
    const op2Arr = padStr(data.op2);
    const ansArr = padStr(data.ans);

    if (phase === 'setup') {
        let isCorrect = true;
        ['100','10','1'].forEach((col, idx) => {
            const el1 = document.getElementById('op1-'+col);
            const el2 = document.getElementById('op2-'+col);
            if(!el1 || !el2) return;
            
            const v1 = window.toHalfWidth(el1.value.trim()) || ' ';
            const v2 = window.toHalfWidth(el2.value.trim()) || ' ';
            
            if(v1 !== op1Arr[idx]) { window.flashError('op1-'+col); isCorrect = false; }
            if(v2 !== op2Arr[idx]) { window.flashError('op2-'+col); isCorrect = false; }
        });

        if (isCorrect) {
            ['op1-100','op1-10','op1-1','op2-100','op2-10','op2-1'].forEach(id => {
                const el = document.getElementById(id);
                if(el) { el.classList.add('correct-input'); el.disabled = true; }
            });
            
            phase = 'calc1';
            const ans1 = document.getElementById('ans-1');
            if(ans1) {
                ans1.disabled = false;
                ans1.classList.add('active-col');
                ans1.focus();
            }
            window.updateNav("ステップ ②：一の位を計算しよう", `右はしからスタート！<br><strong>${op1Arr[2]} ＋ ${op2Arr[2]} ＝ ？</strong><br>ピンクのマスに入れよう。`, "#f472b6");
        } else {
            window.updateNav("ステップ ①：式をたてよう", "ちがうみたい。とくに<strong>空っぽのマス（見えないゼロ）</strong>の位置に気をつけて！右はしをそろえるよ。", "#ef4444");
        }
    }
    
    else if (phase === 'calc1') {
        const ans1 = document.getElementById('ans-1');
        const v = window.toHalfWidth(ans1.value.trim());
        
        if (v === ansArr[2]) {
            ans1.classList.replace('active-col', 'correct-input');
            ans1.disabled = true;
            
            phase = 'calc10';
            const ans10 = document.getElementById('ans-10');
            ans10.disabled = false;
            ans10.classList.add('active-col');
            
            let msg = `次は真ん中の黄色いマスだね。<br><strong>${op1Arr[1]===' '?'0':op1Arr[1]} ＋ ${op2Arr[1]===' '?'0':op2Arr[1]} ＝ ？</strong>`;
            
            if (data.c10) {
                const c10 = document.getElementById('carry-10');
                c10.classList.remove('hidden');
                c10.disabled = false;
                c10.focus();
                msg = "あ、一の位が10をこえたね！<br><strong>十の位への「くり上がりの 1 」</strong>を、小さな赤いマスにわすれずに書こう！<br>それから黄色のマスを計算してね。";
            } else {
                ans10.focus();
            }
            
            window.updateNav("ステップ ③：十の位を計算しよう", msg, "#eab308");
        } else {
            window.flashError('ans-1');
            window.updateNav("ステップ ②：一の位を計算しよう", "たし算をもう一度たしかめよう！", "#ef4444");
        }
    }

    else if (phase === 'calc10') {
        const ans10 = document.getElementById('ans-10');
        const v = window.toHalfWidth(ans10.value.trim());
        let carryCorrect = true;
        
        if (data.c10) {
            const cVal = window.toHalfWidth(document.getElementById('carry-10').value.trim());
            if (cVal !== "1") { carryCorrect = false; window.flashError('carry-10'); }
        }

        if (v === ansArr[1] && carryCorrect) {
            ans10.classList.replace('active-col', 'correct-input');
            ans10.disabled = true;
            if(data.c10) document.getElementById('carry-10').disabled = true;
            
            phase = 'calc100';
            const ans100 = document.getElementById('ans-100');
            ans100.disabled = false;
            ans100.classList.add('active-col');
            
            let msg = `さいごは一番左の水色のマスだ。<br><strong>${op1Arr[0]===' '?'0':op1Arr[0]} ＋ ${op2Arr[0]===' '?'0':op2Arr[0]} ＝ ？</strong>`;
            
            if (data.c100) {
                const c100 = document.getElementById('carry-100');
                c100.classList.remove('hidden');
                c100.disabled = false;
                c100.focus();
                msg = "ここでも10をこえたね！<br><strong>百の位への「くり上がりの 1 」</strong>を赤いマスに書いてから、計算しよう。";
            } else {
                ans100.focus();
            }

            window.updateNav("ステップ ④：百の位を計算しよう", msg, "#0ea5e9");
        } else {
            if (!carryCorrect) {
                window.updateNav("ステップ ③：十の位", "小さな赤いマスには、くり上がりの「1」が入るよ！", "#ef4444");
            } else {
                window.flashError('ans-10');
                let hint = data.c10 ? "くり上がりの「1」をたすのをわすれてないかな？" : "たし算をもう一度たしかめよう！";
                window.updateNav("ステップ ③：十の位", hint, "#ef4444");
            }
        }
    }

    else if (phase === 'calc100') {
        const ans100 = document.getElementById('ans-100');
        const v = window.toHalfWidth(ans100.value.trim());
        let carryCorrect = true;
        
        if (data.c100) {
            const cVal = window.toHalfWidth(document.getElementById('carry-100').value.trim());
            if (cVal !== "1") { carryCorrect = false; window.flashError('carry-100'); }
        }

        if (v === ansArr[0] && carryCorrect) {
            ans100.classList.replace('active-col', 'correct-input');
            ans100.disabled = true;
            if(data.c100) document.getElementById('carry-100').disabled = true;
            
            phase = 'done';
            document.getElementById('btn-calc').innerText = "クリア！";
            document.getElementById('btn-calc').disabled = true;
            
            window.updateNav("✨ 大正解！ 筆算マスター！ ✨", `答えは「${data.ans}」だね！<br>どんな問題でも、位をそろえて右から順番に計算すればだいじょうぶ！`, "#10b981");
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
};

// 画面が表示された時に動かすおまじない
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('prob-select')) {
        window.loadProblem();
    }
});