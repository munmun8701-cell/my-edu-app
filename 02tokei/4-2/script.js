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
    setTimeout(() => el.classList.remove('wrong-input'), 600);
}

// ステップ1：単純な足し算のチェック
function checkStep1() {
    const v1 = window.toHalfWidth(document.getElementById('val1').value.trim());
    const v2 = window.toHalfWidth(document.getElementById('val2').value.trim());
    const v3 = window.toHalfWidth(document.getElementById('val3').value.trim());
    const total = window.toHalfWidth(document.getElementById('total-min').value.trim());

    let isCorrect = true;
    if (v1 !== "30") { flashError('val1'); isCorrect = false; }
    if (v2 !== "20") { flashError('val2'); isCorrect = false; }
    if (v3 !== "30") { flashError('val3'); isCorrect = false; }
    if (total !== "80") { flashError('total-min'); isCorrect = false; }

    if (isCorrect) {
        // 入力ロック
        ['val1', 'val2', 'val3', 'total-min'].forEach(id => {
            document.getElementById(id).classList.add('correct-input');
            document.getElementById(id).disabled = true;
        });
        document.getElementById('btn-step1').disabled = true;

        // ステップ2の表示
        document.getElementById('step2-area').classList.remove('hidden');
        
        updateNav("ステップ ②：時間をまとめよう", "ぜんぶで 80分 だね！<br>でも、<strong>60分＝1時間</strong> だよね？<br>下のボタンをおして、10分ブロックを「1時間のへや」にまとめよう！", "#f59e0b");
    } else {
        updateNav("ステップ ①：ぜんぶで何分？", "ちがうみたい。上の表をよく見て、3つの時間をたし算しよう！", "#ef4444");
    }
}

// ステップ2：ブロックを1時間の部屋に移動させるアニメーション
function groupBlocks() {
    const minGrid = document.getElementById('min-grid');
    const hourGrid = document.getElementById('hour-grid');
    const blocks = Array.from(minGrid.children);

    // 60分（6ブロック）を1時間の部屋へ移動
    for(let i = 0; i < 6; i++) {
        // 少しずつ時間差で移動させる
        setTimeout(() => {
            hourGrid.appendChild(blocks[i]);
        }, i * 200);
    }

    document.getElementById('btn-group').classList.add('hidden');

    // 移動が終わった頃（1.2秒後）にステップ3を表示
    setTimeout(() => {
        document.getElementById('step3-area').classList.remove('hidden');
        document.getElementById('ans-h').focus();
        
        updateNav("ステップ ③：答えを作ろう", "60分が「1時間」のへやに入ったね！<br>それじゃあ、<strong>「1時間」のへやにあるかたまりの数</strong> と、<strong>「分」のへやにのこっている時間</strong> を答えのマスに入れよう。", "#10b981");
    }, 1500);
}

// ステップ3：最終回答のチェック
function checkStep3() {
    const h = window.toHalfWidth(document.getElementById('ans-h').value.trim());
    const m = window.toHalfWidth(document.getElementById('ans-m').value.trim());
    
    let isCorrect = true;
    if (h !== "1") { flashError('ans-h'); isCorrect = false; }
    if (m !== "20") { flashError('ans-m'); isCorrect = false; }

    if (isCorrect) {
        document.getElementById('ans-h').classList.add('correct-input');
        document.getElementById('ans-m').classList.add('correct-input');
        
        ['ans-h', 'ans-m', 'btn-step3'].forEach(id => document.getElementById(id).disabled = true);
        
        updateNav("🎉 ぜんぶ大正解！ 🎉", "すばらしい！ 80分は「1時間20分」だね。<br><strong>『60分で1時間になる』</strong>というきまりを使えば、どんな時間も計算できるよ！", "#10b981");
    } else {
        updateNav("ステップ ③：答えを作ろう", "おしい！ブロックのへやをよく見て。<br>1時間のへやには「1」つのかたまり、分のへやには10ブロックが「2つ（20）」のこっているよ。", "#ef4444");
    }
}

function resetApp() {
    location.reload();
}