window.toHalfWidth = function(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};

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

// 状態管理
let phase = 'formula'; // formula -> calc1 -> borrow -> calc10 -> calc100 -> check

function checkFormula() {
    const op1 = toHalfWidth(document.getElementById('f-op1').value);
    const op2 = toHalfWidth(document.getElementById('f-op2').value);
    
    if (op1 === "315" && op2 === "194") {
        document.getElementById('f-op1').classList.add('correct-input');
        document.getElementById('f-op2').classList.add('correct-input');
        document.getElementById('btn-formula').disabled = true;
        
        // 次のフェーズへ
        document.getElementById('section-calc').classList.remove('hidden');
        phase = 'calc1';
        document.getElementById('ans-1').disabled = false;
        document.getElementById('wrap-1').classList.add('active-col');
        document.getElementById('ans-1').focus();
        
        updateNav("ステップ ②：一の位のひき算", "右はしの「一の位」から計算するよ。<br><strong>5 － 4 ＝ ？</strong> ピンクのマスに入れよう。", "#f472b6");
    } else {
        flashError('f-op1'); flashError('f-op2');
        updateNav("ステップ ①：式", "もえさんが持っているお金から、のりのお金を引くよ。数字をたしかめよう。", "#ef4444");
    }
}

function updateCoins(type, usedCount) {
    const area = document.getElementById(`blocks-${type}`);
    const coins = area.querySelectorAll('.coin');
    // 後ろから指定数だけグレーアウトさせる
    let count = 0;
    for(let i = coins.length - 1; i >= 0; i--) {
        if(count < usedCount) {
            coins[i].classList.add('used');
            count++;
        }
    }
}

function doBorrow() {
    // ブロックのアニメーション（100が1個消えて、10が10個増える）
    const blocks100 = document.getElementById('blocks-100');
    blocks100.querySelector('.coin-100:not(.used)').classList.add('used'); // 1つ使う
    
    const blocks10 = document.getElementById('blocks-10');
    for(let i=0; i<10; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin coin-10';
        coin.innerText = '10';
        blocks10.appendChild(coin);
    }
    
    // UIの更新
    document.getElementById('btn-borrow').classList.add('hidden');
    document.getElementById('op1-100').classList.add('crossed-out');
    
    // メモ欄の解放
    document.getElementById('memo-100').classList.remove('hidden');
    document.getElementById('memo-10').classList.remove('hidden');
    document.getElementById('memo-100').disabled = false;
    document.getElementById('memo-10').disabled = false;
    document.getElementById('memo-100').focus();
    
    phase = 'memo';
    document.getElementById('btn-calc').innerText = "メモをかくにん";
    updateNav("ステップ ③：くり下がりのメモを書こう", "両がえしたから、百の位は「3」から<strong>「2」</strong>になったね。<br>十の位は「1」に「10」が来て<strong>「11」</strong>になったよ。<br>赤いてんせんのマスにメモを書こう！", "#e11d48");
}

function processCalc() {
    const btn = document.getElementById('btn-calc');

    if (phase === 'calc1') {
        const v = toHalfWidth(document.getElementById('ans-1').value);
        if (v === "1") {
            document.getElementById('ans-1').classList.add('correct-input');
            document.getElementById('ans-1').disabled = true;
            document.getElementById('wrap-1').classList.remove('active-col');
            updateCoins(1, 4); // 4つ使う
            
            phase = 'borrowWait';
            document.getElementById('wrap-10').classList.add('active-col');
            document.getElementById('btn-borrow').classList.remove('hidden');
            btn.disabled = true; // 両替するまでボタンは押せない
            
            updateNav("ステップ ③：十の位のひき算", "次は黄色のマスだね。<br><strong>1 － 9 は、引けないね！</strong><br>右の「両がえボタン」をおして、百の位からかりてこよう。", "#eab308");
        } else {
            flashError('ans-1');
            updateNav("ステップ ②：一の位", "5 － 4 をもう一度計算してね。", "#ef4444");
        }
    }
    else if (phase === 'memo') {
        const m100 = toHalfWidth(document.getElementById('memo-100').value);
        const m10 = toHalfWidth(document.getElementById('memo-10').value);
        
        // 十の位のメモは「10」と書く子と、合わせて「11」と書く子がいるので両方正解にする
        if (m100 === "2" && (m10 === "10" || m10 === "11")) {
            document.getElementById('memo-100').classList.add('correct-input');
            document.getElementById('memo-100').disabled = true;
            document.getElementById('memo-10').classList.add('correct-input');
            document.getElementById('memo-10').disabled = true;
            
            phase = 'calc10';
            document.getElementById('ans-10').disabled = false;
            document.getElementById('ans-10').focus();
            btn.innerText = "十の位をかくにん";
            
            updateNav("ステップ ③：十の位のひき算（つづき）", "メモが書けたね！<br>十の位は全部で11あるから、<strong>11 － 9 ＝ ？</strong><br>黄色のマスに入れよう。", "#eab308");
        } else {
            if(m100 !== "2") flashError('memo-100');
            if(m10 !== "10" && m10 !== "11") flashError('memo-10');
            updateNav("ステップ ③：メモ", "百の位は3から1つ減ったよ。十の位には10が来たよ！", "#ef4444");
        }
    }
    else if (phase === 'calc10') {
        const v = toHalfWidth(document.getElementById('ans-10').value);
        if (v === "2") {
            document.getElementById('ans-10').classList.add('correct-input');
            document.getElementById('ans-10').disabled = true;
            document.getElementById('wrap-10').classList.remove('active-col');
            updateCoins(10, 9); // 9つ使う
            
            phase = 'calc100';
            document.getElementById('wrap-100').classList.add('active-col');
            document.getElementById('ans-100').disabled = false;
            document.getElementById('ans-100').focus();
            btn.innerText = "百の位をかくにん";
            
            updateNav("ステップ ④：百の位のひき算", "さいごは水色のマス！<br>百の位は両がえして 2 になっているから、<strong>2 － 1 ＝ ？</strong>", "#0ea5e9");
        } else {
            flashError('ans-10');
            updateNav("ステップ ③：十の位", "11 － 9 をもう一度計算してね。", "#ef4444");
        }
    }
    else if (phase === 'calc100') {
        const v = toHalfWidth(document.getElementById('ans-100').value);
        if (v === "1") {
            document.getElementById('ans-100').classList.add('correct-input');
            document.getElementById('ans-100').disabled = true;
            document.getElementById('wrap-100').classList.remove('active-col');
            updateCoins(100, 1); // 1つ使う
            
            phase = 'check';
            btn.innerText = "筆算クリア！";
            btn.disabled = true;
            
            document.getElementById('section-check').classList.remove('hidden');
            document.getElementById('check-ans').focus();
            
            updateNav("✨ 筆算クリア！ ✨", "くり下がりのひき算ができたね！<br>さいごに、下の「たしかめ算」をやってみよう。", "#10b981");
        } else {
            flashError('ans-100');
            updateNav("ステップ ④：百の位", "2 － 1 をもう一度計算してね。3 － 1 じゃないよ！", "#ef4444");
        }
    }
}

function checkFinal() {
    const v = toHalfWidth(document.getElementById('check-ans').value);
    if (v === "121") {
        document.getElementById('check-ans').classList.add('correct-input');
        document.getElementById('btn-check-ans').disabled = true;
        updateNav("🎉 ぜんぶ大正解！ 🎉", "たしかめ算もバッチリだね！<br>「引けないときは、となりの位からかりてくる」これでもうカンペキだ！", "#10b981");
    } else {
        flashError('check-ans');
        updateNav("ステップ ⑤：たしかめ算", "筆算で出た答え（121）を入れてみよう。", "#ef4444");
    }
}

function resetApp() {
    location.reload(); // 手軽に全体を初期状態に戻すためリロード
}