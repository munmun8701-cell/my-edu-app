// ====== タブ切り替え処理 ======
const tabs = ['q3', 'q4', 'q5', 'q6'];

tabs.forEach(tab => {
    document.getElementById(`tab-${tab}`).addEventListener('click', () => {
        // すべてのタブとパネルをリセット
        tabs.forEach(t => {
            document.getElementById(`tab-${t}`).classList.remove('active-tab');
            document.getElementById(`panel-${t}`).classList.add('hidden');
        });
        // 選択されたものをアクティブに
        document.getElementById(`tab-${tab}`).classList.add('active-tab');
        document.getElementById(`panel-${tab}`).classList.remove('hidden');
    });
});

// ====== 問3 (マラソン) の処理 ======
let currentLaps = 0;
const runBtn = document.getElementById('run-btn');
const trackVisual = document.getElementById('track-visual');
const lapCount = document.getElementById('lap-count');
const kmCount = document.getElementById('km-count');

runBtn.addEventListener('click', () => {
    if (currentLaps < 4) {
        currentLaps++;
        lapCount.innerText = currentLaps;
        kmCount.innerText = currentLaps;
        
        if (currentLaps === 1) trackVisual.innerHTML = ''; // 初期テキストを消す
        
        const box = document.createElement('div');
        box.className = 'lap-box';
        box.innerText = '1km';
        trackVisual.appendChild(box);
    }
    if (currentLaps === 4) {
        runBtn.style.backgroundColor = '#9e9e9e';
        runBtn.style.boxShadow = 'none';
        runBtn.innerText = '4しゅう 走りおわった！';
        runBtn.disabled = true;
    }
});

document.getElementById('check-q3').addEventListener('click', () => {
    const ans = parseInt(document.getElementById('ans-q3').value);
    const fb = document.getElementById('feedback-q3');
    if (ans === 4) {
        fb.innerText = '〇 大せいかい！ 1kmが4つで4kmだね！';
        fb.className = 'feedback correct';
    } else {
        fb.innerText = '× もういちど、走った数を数えてみよう。';
        fb.className = 'feedback incorrect';
    }
});

// ====== 問4 (道のり) の処理 ======
document.getElementById('check-q4').addEventListener('click', () => {
    const m1 = parseInt(document.getElementById('ans-q4-m1').value);
    const m2 = parseInt(document.getElementById('ans-q4-m2').value);
    const total = parseInt(document.getElementById('ans-q4-total').value);
    const ansKm = parseInt(document.getElementById('ans-q4-km').value);
    const ansM = parseInt(document.getElementById('ans-q4-m').value);
    
    const fb = document.getElementById('feedback-q4');
    let isCorrect = true;

    // 前半の足し算チェック (1000 + 800 = 1800 または 800 + 1000 = 1800)
    if (!((m1 === 1000 && m2 === 800) || (m1 === 800 && m2 === 1000))) isCorrect = false;
    if (total !== 1800) isCorrect = false;
    // 後半の変換チェック
    if (ansKm !== 1 || ansM !== 800) isCorrect = false;

    if (isCorrect) {
        fb.innerText = '〇 ばっちり！ 1000m を 1km に変身できたね！';
        fb.className = 'feedback correct';
    } else {
        fb.innerText = '× 足し算の数字と、1kmのまとまり を確認しよう。';
        fb.className = 'feedback incorrect';
    }
});

// ====== 問5 (m → km さくらんぼ) の処理 ======
document.getElementById('check-q5').addEventListener('click', () => {
    const split1 = parseInt(document.getElementById('q5-split1').value);
    const split2 = parseInt(document.getElementById('q5-split2').value);
    const ansKm = parseInt(document.getElementById('ans-q5-km').value);
    const ansM = parseInt(document.getElementById('ans-q5-m').value);
    
    const fb = document.getElementById('feedback-q5');
    
    // さくらんぼが 1000 と 230 に分かれているか
    const isSplitCorrect = (split1 === 1000 && split2 === 230) || (split1 === 230 && split2 === 1000);
    // 最終回答が 1km 230m か
    const isAnsCorrect = (ansKm === 1 && ansM === 230);

    if (isSplitCorrect && isAnsCorrect) {
        fb.innerText = '〇 すごい！ さくらんぼの分け方も 完璧です！';
        fb.className = 'feedback correct';
    } else {
        fb.innerText = '× さくらんぼの「1000」と「残り」に正しく分けられたかな？';
        fb.className = 'feedback incorrect';
    }
});

// ====== 問6 (km → m 位取り表) の処理 ======
document.getElementById('check-q6').addEventListener('click', () => {
    const pvKm = parseInt(document.getElementById('q6-pv-km').value);
    const pv100 = parseInt(document.getElementById('q6-pv-100').value);
    const pv10 = parseInt(document.getElementById('q6-pv-10').value);
    const pv1 = parseInt(document.getElementById('q6-pv-1').value);
    const ans = parseInt(document.getElementById('ans-q6').value);
    
    const fb = document.getElementById('feedback-q6');
    
    // 1km 50m なので、表は 1, 0, 5, 0
    const isTableCorrect = (pvKm === 1 && pv100 === 0 && pv10 === 5 && pv1 === 0);
    // 最終回答は 1050
    const isAnsCorrect = (ans === 1050);

    if (isTableCorrect && isAnsCorrect) {
        fb.innerText = '〇 大せいかい！ 100mのへやの「0」がポイントだね！';
        fb.className = 'feedback correct';
    } else {
        if (!isTableCorrect) {
            fb.innerText = '× くらいどりひょうに まちがいがあるよ。何もない所は「0」だよ！';
        } else {
            fb.innerText = '× ひょうは合っているよ！そのまま数字をならべてみよう。';
        }
        fb.className = 'feedback incorrect';
    }
});