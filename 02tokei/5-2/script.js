// --- タブ切り替え ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active-content'));
    
    document.getElementById('tab' + tabId).classList.add('active');
    document.getElementById('content' + tabId).classList.add('active-content');
}

// --- チャレンジ①：単位のへんかん ---
function setMsg(id, text, isSuccess) {
    const el = document.getElementById(id);
    el.innerHTML = text;
    el.style.backgroundColor = isSuccess ? '#dcfce7' : '#f1f5f9';
    el.style.color = isSuccess ? '#15803d' : '#475569';
}

function checkQ1() {
    const m = parseInt(document.getElementById('in-min1').value);
    const s = parseInt(document.getElementById('in-sec1').value);
    
    if (m === 1 && s === 20) {
        document.getElementById('in-min1').classList.add('correct');
        document.getElementById('in-sec1').classList.add('correct');
        document.getElementById('btn-q1').disabled = true;
        setMsg('msg-q1', '大正解！ 80秒 ＝ 60秒(1分) ＋ 20秒 だね！', true);
    } else if (m === 1 && isNaN(s)) {
        setMsg('msg-q1', '1分は合っているよ！残りは何秒かな？ (80 - 60 = ?)', false);
    } else {
        setMsg('msg-q1', 'おしい！ 1分は60秒だよ。80秒から60秒を引くと…？', false);
    }
}

function checkQ2() {
    const s = parseInt(document.getElementById('in-sec2').value);
    
    if (s === 120) {
        document.getElementById('in-sec2').classList.add('correct');
        document.getElementById('btn-q2').disabled = true;
        setMsg('msg-q2', 'バッチリ！ 60秒 ＋ 60秒 ＝ 120秒 だね！', true);
    } else {
        setMsg('msg-q2', 'ちがうみたい。 60 ＋ 60 を計算してみよう！', false);
    }
}

// --- チャレンジ②：時間あてゲーム ---
let startTime = 0;
let isPlaying = false;

function toggleGame() {
    const btn = document.getElementById('btn-game');
    const resultBox = document.getElementById('game-result');
    const targetSelect = document.getElementById('target-time');
    
    if (!isPlaying) {
        // スタート処理
        isPlaying = true;
        startTime = Date.now();
        btn.innerText = "ストップ！！";
        btn.classList.add('stop');
        resultBox.classList.add('hidden');
        targetSelect.disabled = true;
    } else {
        // ストップ処理
        isPlaying = false;
        const stopTime = Date.now();
        const elapsed = (stopTime - startTime) / 1000; // 秒に変換
        const target = parseInt(targetSelect.value);
        
        btn.innerText = "目を閉じて もう1回スタート！";
        btn.classList.remove('stop');
        targetSelect.disabled = false;
        
        showGameResult(elapsed, target);
    }
}

function showGameResult(elapsed, target) {
    const resultBox = document.getElementById('game-result');
    const recordSpan = document.getElementById('record-time');
    const feedbackSpan = document.getElementById('game-feedback');
    
    resultBox.classList.remove('hidden');
    recordSpan.innerText = elapsed.toFixed(1);
    
    const diff = Math.abs(target - elapsed).toFixed(1);
    
    if (diff <= 1.0) {
        feedbackSpan.innerHTML = `🎉 ピッタリまで あと ${diff}秒！ スゴイ！！ 天才だね！`;
        feedbackSpan.style.color = "#15803d";
    } else if (diff <= 3.0) {
        feedbackSpan.innerHTML = `👏 ピッタリまで あと ${diff}秒！ かなりおしい！`;
        feedbackSpan.style.color = "#d97706";
    } else {
        let msg = elapsed > target ? "少しおそかったね！" : "少し早かったね！";
        feedbackSpan.innerHTML = `${msg} ピッタリまで あと ${diff}秒！`;
        feedbackSpan.style.color = "#ea580c";
    }
}

// --- チャレンジ③：単位えらび ---
function checkUnit1(selected) {
    const blank = document.getElementById('ans-unit1');
    blank.innerText = selected;
    
    if (selected === '秒') {
        blank.style.color = "#15803d";
        setMsg('msg-u1', '大正解！コマーシャルは「15秒」など、短い時間だね！', true);
    } else if (selected === '分') {
        blank.style.color = "#ea580c";
        setMsg('msg-u1', '15分だと、給食を食べるくらいの時間だよ。コマーシャルはもっと短いね。', false);
    } else {
        blank.style.color = "#ea580c";
        setMsg('msg-u1', '15時間だと、半日以上テレビがコマーシャルになっちゃうよ！', false);
    }
}

function checkUnit2(selected) {
    const blank = document.getElementById('ans-unit2');
    blank.innerText = selected;
    
    if (selected === '時間') {
        blank.style.color = "#15803d";
        setMsg('msg-u2', '大正解！朝から夜まで、起きているのは「15時間」くらいだね！', true);
    } else {
        blank.style.color = "#ea580c";
        setMsg('msg-u2', `15${selected}だと短すぎるよ。朝起きてすぐ夜になっちゃうね！`, false);
    }
}

// --- 全体リセット ---
function resetAll() {
    // タブ1
    ['in-min1', 'in-sec1', 'in-sec2'].forEach(id => {
        const el = document.getElementById(id);
        el.value = ''; el.classList.remove('correct'); el.disabled = false;
    });
    document.getElementById('btn-q1').disabled = false;
    document.getElementById('btn-q2').disabled = false;
    setMsg('msg-q1', 'ヒント：1分は 60秒 だよ。80の中から60を取り出してみよう。', false);
    setMsg('msg-q2', 'ヒント：1分が 60秒。2分は、60秒が2つ分だね。', false);

    // タブ2
    isPlaying = false;
    document.getElementById('btn-game').innerText = "目を閉じて スタート！";
    document.getElementById('btn-game').classList.remove('stop');
    document.getElementById('game-result').classList.add('hidden');
    document.getElementById('target-time').disabled = false;

    // タブ3
    document.getElementById('ans-unit1').innerText = "？";
    document.getElementById('ans-unit1').style.color = "var(--purple)";
    setMsg('msg-u1', 'コマーシャルは、とても短い時間で終わるよね。', false);
    
    document.getElementById('ans-unit2').innerText = "？";
    document.getElementById('ans-unit2').style.color = "var(--purple)";
    setMsg('msg-u2', '一日の中で、起きている時間はどれくらいの長さかな？', false);

    switchTab(1);
}