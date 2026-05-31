// ステップ管理（1:一の位, 2:十の位, 3:百の位, 4:完了）
let currentStep = 1;

// 全角数字を半角に変換する関数
function toHalfWidth(str) {
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

// 画面のナビゲーションを更新する関数
function updateNav(title, msg, bgColor) {
    document.getElementById('nav-title').innerText = title;
    document.getElementById('nav-msg').innerHTML = msg;
    if(bgColor) {
        document.getElementById('nav-board').style.borderColor = bgColor;
        document.getElementById('nav-title').style.backgroundColor = bgColor;
    }
}

// 入力をチェックして次のステップへ進む関数
function checkCurrentStep() {
    let inputEl, val, expected;

    if (currentStep === 1) {
        inputEl = document.getElementById('ans-1');
        val = toHalfWidth(inputEl.value.trim());
        expected = "7"; // 5 + 2 = 7

        if (val === expected) {
            // 一の位クリア！
            inputEl.classList.add('correct-input');
            inputEl.disabled = true;
            inputEl.parentElement.classList.remove('active-col');
            
            // 次のステップ（十の位）へ
            currentStep = 2;
            const nextInput = document.getElementById('ans-10');
            nextInput.disabled = false;
            nextInput.parentElement.classList.add('active-col');
            nextInput.focus();
            
            updateNav(
                "ステップ ② ： 十の位（じゅうのくらい）",
                "一の位はカンペキ！次は黄色の「十の位」だね。<br><strong>6 ＋ 7 ＝ 13</strong><br>あれ？ 10をこえちゃったね。「3」を黄色のマスに入れよう。",
                "#ca8a04" // 黄色系
            );
        } else {
            inputEl.classList.add('wrong-input');
            setTimeout(() => inputEl.classList.remove('wrong-input'), 800);
            updateNav("ステップ ① ： 一の位", "ちがうみたい。もう一度「5＋2」を計算してみよう！", "#e11d48");
        }
    } 
    else if (currentStep === 2) {
        inputEl = document.getElementById('ans-10');
        val = toHalfWidth(inputEl.value.trim());
        expected = "3"; // 6 + 7 = 13 のうちの 3

        if (val === expected) {
            // 十の位クリア＆くり上がり発生！
            inputEl.classList.add('correct-input');
            inputEl.disabled = true;
            inputEl.parentElement.classList.remove('active-col');
            
            // くり上がりの「1」を表示
            document.getElementById('carry-100').innerText = "1";
            
            // 次のステップ（百の位）へ
            currentStep = 3;
            const nextInput = document.getElementById('ans-100');
            nextInput.disabled = false;
            nextInput.parentElement.classList.add('active-col');
            nextInput.focus();
            
            updateNav(
                "ステップ ③ ： 百の位（ひゃくのくらい）",
                "正解！13の「1」は、百の位の部屋に<strong>『くり上がり』</strong>したよ。<br>さいごは水色の「百の位」のたし算だ。<br>くり上がった 1 と、3 と 4 を全部たすと…？",
                "#0284c7" // 水色系
            );
        } else {
            inputEl.classList.add('wrong-input');
            setTimeout(() => inputEl.classList.remove('wrong-input'), 800);
            updateNav("ステップ ② ： 十の位", "6＋7＝13 だよ。はみ出した「1」は隣の部屋に行くから、ここには何を書く？", "#e11d48");
        }
    }
    else if (currentStep === 3) {
        inputEl = document.getElementById('ans-100');
        val = toHalfWidth(inputEl.value.trim());
        expected = "8"; // 1(くり上がり) + 3 + 4 = 8

        if (val === expected) {
            // 全問クリア！
            inputEl.classList.add('correct-input');
            inputEl.disabled = true;
            inputEl.parentElement.classList.remove('active-col');
            
            document.getElementById('btn-check').disabled = true;
            document.getElementById('btn-check').innerText = "クリア！";
            document.getElementById('final-ans-display').innerText = "837";
            document.getElementById('final-ans-display').style.color = "#e11d48";
            
            updateNav(
                "✨ 大正解！ 筆算マスター！ ✨",
                "すばらしい！ 1＋3＋4＝8 で、答えは「837」だね。<br>3けたになっても、位をそろえて順番にたし算すればカンタンだ！",
                "#10b981" // 緑系
            );
        } else {
            inputEl.classList.add('wrong-input');
            setTimeout(() => inputEl.classList.remove('wrong-input'), 800);
            updateNav("ステップ ③ ： 百の位", "おしい！ くり上がってきた小さな「1」をたすのを忘れていないかな？", "#e11d48");
        }
    }
}

function resetApp() {
    currentStep = 1;
    
    // UIリセット
    ['ans-1', 'ans-10', 'ans-100'].forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.disabled = true;
        el.classList.remove('correct-input', 'wrong-input');
        el.parentElement.classList.remove('active-col');
    });
    
    document.getElementById('carry-100').innerText = '';
    document.getElementById('final-ans-display').innerText = '？';
    document.getElementById('final-ans-display').style.color = "inherit";
    
    const btn = document.getElementById('btn-check');
    btn.disabled = false;
    btn.innerText = "かくにん";
    
    // 初期状態に戻す
    document.getElementById('ans-1').disabled = false;
    document.getElementById('ans-1').parentElement.classList.add('active-col');
    
    updateNav(
        "ステップ ① ： 一の位（いちのくらい）",
        "まずは一番右の「一の位」から計算しよう。<br><strong>5 ＋ 2 ＝ ？</strong><br>ピンクのマスに答えを入れて、「かくにん」を押してね。",
        "#10b981"
    );
}

// 初期化時に一の位をフォーカス
window.onload = () => {
    document.getElementById('ans-1').focus();
};