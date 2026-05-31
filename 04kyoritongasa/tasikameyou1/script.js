// クイズデータ（全30問）
// category: 'unit'(単位), 'concept'(概念), 'convert'(変換), 'calc'(計算), 'apply'(応用)
const quizData = [
    // 【単位の選び方】
    { q: "算数のノートの あつさは、どれくらい？", options: ["3 mm", "3 cm", "3 m", "3 km"], answer: 0, category: "unit", hint: "じょうぎの 1番小さい メモリを思いだしてね。" },
    { q: "水そうの 横の長さは、どれくらい？", options: ["60 mm", "60 cm", "60 m", "60 km"], answer: 1, category: "unit", hint: "30cmじょうぎ 2本ぶん くらいだよ。" },
    { q: "教室の たての長さは、どれくらい？", options: ["7 mm", "7 cm", "7 m", "7 km"], answer: 2, category: "unit", hint: "先生や みんなの身長（約1mちょっと）が 何人か ならんだ長さだよ。" },
    { q: "ハイキングコースの 道のりは、どれくらい？", options: ["4 mm", "4 cm", "4 m", "4 km"], answer: 3, category: "unit", hint: "歩いて 何十分も かかるような とても長い長さ だよ。" },
    { q: "新しい えんぴつの 長さは、どれくらい？", options: ["18 mm", "18 cm", "18 m", "18 km"], answer: 1, category: "unit", hint: "ふでばこに 入る長さ だね。" },
    
    // 【きょりと道のり】
    { q: "「家から学校まで まっすぐにはかった長さ」を 何という？", options: ["道のり", "きょり", "キロメートル", "まっすぐ線"], answer: 1, category: "concept", hint: "定規で ピッと まっすぐ引いた 線のことだよ。" },
    { q: "「家から学校まで 道にそってはかった長さ」を 何という？", options: ["道のり", "きょり", "キロメートル", "まがり線"], answer: 0, category: "concept", hint: "実際に 道路を歩いたときの 長さのことだよ。" },
    { q: "同じ場所に行くとき、いつも 短くなる（数が小さくなる）のは どっち？", options: ["道のり", "きょり", "同じになる", "わからない"], answer: 1, category: "concept", hint: "まっすぐ つきぬける方が 近道になるよね。" },
    { q: "家〜公園が400m、公園〜学校が300m。家から学校までの「道のり」は？", options: ["100 m", "300 m", "400 m", "700 m"], answer: 3, category: "concept", hint: "「道のり」だから、２つの長さを たし算するよ。" },
    { q: "家から図書館まで、道のりは 1030m、きょりは 800mでした。ちがいは 何m？", options: ["230 m", "800 m", "1030 m", "1830 m"], answer: 0, category: "concept", hint: "「ちがい」は、ひき算（1030 - 800）で 求めよう。" },

    // 【単位のへんしん（変換）】
    { q: "1 km は、何 m ですか？", options: ["10 m", "100 m", "1000 m", "10000 m"], answer: 2, category: "convert", hint: "キロ（k）は「1000」の まとまり という意味だよ。" },
    { q: "3 km は、何 m ですか？", options: ["30 m", "300 m", "3000 m", "30000 m"], answer: 2, category: "convert", hint: "1km が 1000m。それが 3つ分 だよ。" },
    { q: "2000 m は、何 km ですか？", options: ["2 km", "20 km", "200 km", "2000 km"], answer: 0, category: "convert", hint: "1000m で 1km に 変身するよ。" },
    { q: "1 km 200 m は、何 m ですか？", options: ["120 m", "1020 m", "1200 m", "12000 m"], answer: 2, category: "convert", hint: "1kmを 1000mに変身させて、200mと ガッタイさせよう！" },
    { q: "1 km 50 m は、何 m ですか？", options: ["150 m", "1050 m", "1500 m", "10050 m"], answer: 1, category: "convert", hint: "引っかけ注意！ 100mの おへやは「0」になるよ。" },
    { q: "1300 m は、何 km 何 m ですか？", options: ["1 km 3 m", "1 km 30 m", "1 km 300 m", "13 km"], answer: 2, category: "convert", hint: "「1000」のまとまりだけを、km に 変身させよう。" },
    { q: "2080 m は、何 km 何 m ですか？", options: ["2 km 8 m", "2 km 80 m", "20 km 80 m", "2 km 800 m"], answer: 1, category: "convert", hint: "2000m を 2kmに変身！ 残りは 80mだね。" },
    { q: "4005 m は、何 km 何 m ですか？", options: ["4 km 5 m", "4 km 50 m", "40 km 5 m", "4 km 500 m"], answer: 0, category: "convert", hint: "4000m と 5m に 分けられるね。" },
    { q: "1000 m を 2回 走ると、何 km になる？", options: ["1 km", "2 km", "10 km", "20 km"], answer: 1, category: "convert", hint: "1000m + 1000m = 2000m。2000mは 何kmかな？" },
    { q: "1 km の 半分（はんぶん）は、何 m ですか？", options: ["50 m", "100 m", "500 m", "5000 m"], answer: 2, category: "convert", hint: "1kmは 1000m。1000 の半分は いくつかな？" },

    // 【長さの計算】
    { q: "400 m ＋ 600 m ＝ ？", options: ["100 m", "1000 m (1km)", "10 km", "10000 m"], answer: 1, category: "calc", hint: "400 + 600 は 1000 だね。1000m は 何に変身できる？" },
    { q: "1 km 300 m ＋ 200 m ＝ ？", options: ["1 km 100 m", "1 km 500 m", "3 km 500 m", "1500 km"], answer: 1, category: "calc", hint: "m（メートル）どうしを たし算しよう。" },
    { q: "2 km 800 m ＋ 200 m ＝ ？", options: ["2 km 1000 m", "3 km", "3 km 100 m", "4 km"], answer: 1, category: "calc", hint: "800+200=1000m。1000mできたから、1km に 繰り上がる（へんしんする）よ！" },
    { q: "1 km － 300 m ＝ ？", options: ["70 m", "700 m", "1 km 300 m", "7 km"], answer: 1, category: "calc", hint: "1km を 1000m に 戻してから、ひき算（1000 - 300）をしよう。" },
    { q: "1 km 400 m － 400 m ＝ ？", options: ["1 m", "100 m", "1 km", "1000 km"], answer: 2, category: "calc", hint: "m（メートル）が ぴったり なくなるね。" },

    // 【応用・文章問題】
    { q: "A町からB町まで 2km、B町からC町まで 3km。AからCまでの道のりは？", options: ["1 km", "5 km", "6 km", "50 km"], answer: 1, category: "apply", hint: "2km と 3km を たし算しよう。" },
    { q: "家から駅まで 1km200m。往復（いって、帰ってくる）すると 何km何m？", options: ["1 km 200 m", "2 km 200 m", "2 km 400 m", "12 km"], answer: 2, category: "apply", hint: "「往復（おうふく）」は 2回分のこと。1km200m ＋ 1km200m だよ。" },
    { q: "1周 400mの トラックを 2周 走りました。あと何mで 1kmになる？", options: ["200 m", "400 m", "600 m", "800 m"], answer: 0, category: "apply", hint: "まず 400+400 で 今走った長さを出そう。1km(1000m)までは あとどれくらい？" },
    { q: "1km 歩くのに 15分 かかります。2km 歩くと 何分かかる？", options: ["15 分", "20 分", "30 分", "45 分"], answer: 2, category: "apply", hint: "距離が 2倍になると、かかる時間も 2倍になるよ。15 ＋ 15 は？" },
    { q: "タワーの高さは 634mです。1kmより 何m 低いですか？", options: ["366 m", "434 m", "634 m", "1634 m"], answer: 0, category: "apply", hint: "「どれだけ低いか」は ひき算。1000m － 634m を 筆算でやってみよう。" }
];

let currentQ = 0;
let scores = { unit: 0, concept: 0, convert: 0, calc: 0, apply: 0 };
let totalScore = 0;
let isAnswered = false;

// DOM要素
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const qText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const qNumber = document.getElementById('q-number');
const progressBar = document.getElementById('progress-bar');
const hintBtn = document.getElementById('hint-btn');
const hintBox = document.getElementById('hint-box');
const hintText = document.getElementById('hint-text');

// スタートボタン
document.getElementById('start-btn').addEventListener('click', () => {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
});

// リトライボタン
document.getElementById('retry-btn').addEventListener('click', () => {
    currentQ = 0; totalScore = 0;
    scores = { unit: 0, concept: 0, convert: 0, calc: 0, apply: 0 };
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
});

// ヒントボタン
hintBtn.addEventListener('click', () => {
    hintBox.classList.remove('hidden');
    hintBtn.classList.add('hidden');
});

// 問題読み込み
function loadQuestion() {
    isAnswered = false;
    hintBox.classList.add('hidden');
    hintBtn.classList.remove('hidden');
    
    const qData = quizData[currentQ];
    qText.innerText = qData.q;
    hintText.innerText = qData.hint;
    qNumber.innerText = `第 ${currentQ + 1} 問 / 30`;
    progressBar.style.width = `${((currentQ) / 30) * 100}%`;
    
    optionsContainer.innerHTML = '';
    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => checkAnswer(index, btn));
        optionsContainer.appendChild(btn);
    });
}

// 答え合わせ
function checkAnswer(selectedIndex, btnElement) {
    if (isAnswered) return;
    isAnswered = true;
    
    const qData = quizData[currentQ];
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    
    if (selectedIndex === qData.answer) {
        // 正解
        btnElement.classList.add('correct-anim');
        scores[qData.category]++;
        totalScore++;
    } else {
        // 不正解
        btnElement.classList.add('wrong-anim');
        buttons[qData.answer].classList.add('correct-anim'); // 正解を教える
    }
    
    // 1.5秒後に次の問題へ
    setTimeout(() => {
        currentQ++;
        if (currentQ < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// 結果発表と課題の分析
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    document.getElementById('final-score').innerText = totalScore;
    
    // 各カテゴリの計算 (各5問ずつ)
    const labels = {
        unit: "たんいの 選び方",
        concept: "きょり と 道のり",
        convert: "m と km のへんしん", // 10問ある
        calc: "長さの 計算",
        apply: "おうよう問題"
    };
    
    const totals = { unit: 5, concept: 5, convert: 10, calc: 5, apply: 5 };
    const listElement = document.getElementById('category-results');
    listElement.innerHTML = '';
    
    let lowestCategory = '';
    let lowestRate = 1.0;
    
    for (const key in scores) {
        const rate = scores[key] / totals[key];
        const li = document.createElement('li');
        li.innerText = `${labels[key]}： ${scores[key]} / ${totals[key]} 問せいかい`;
        if (rate < 1.0) li.style.color = '#d32f2f'; // 満点じゃない箇所を赤っぽく
        listElement.appendChild(li);
        
        // 一番ニガテなカテゴリを判定
        if (rate < lowestRate) {
            lowestRate = rate;
            lowestCategory = key;
        }
    }
    
    // アドバイスの作成
    const adviceElement = document.getElementById('advice-text');
    if (totalScore === 30) {
        adviceElement.innerText = "🌸 パーフェクト！ 君は 長さのたんいマスター だ！この調子で がんばろう！";
    } else if (lowestRate >= 0.8) {
        adviceElement.innerText = "✨ あと少しで パーフェクト！ うっかりミスに 気をつけて 見直しをする クセをつけよう。";
    } else {
        // 課題（ニガテ）にあわせたアドバイス
        switch(lowestCategory) {
            case 'unit':
                adviceElement.innerText = "💡 【たんいの 選び方】が 課題みたいだね。じょうぎ（mm, cm）や、手を広げた長さ（1m）など、実際の大きさを 思い出してみよう！";
                break;
            case 'concept':
                adviceElement.innerText = "💡 【きょり と 道のり】が 課題みたいだね。「きょり」は 定規で引いた まっすぐな線、「道のり」は 実際に歩く クネクネした道 だよ。";
                break;
            case 'convert':
                adviceElement.innerText = "💡 【m と km のへんしん】が 課題みたいだね。「1 km ＝ 1000 m」だよ。1000の まとまりを 見つける 練習をしよう！";
                break;
            case 'calc':
                adviceElement.innerText = "💡 【長さの計算】が 課題みたいだね。たし算をして「1000」を こえたら、「1 km」に くり上げる（へんしんさせる）のを わすれないでね！";
                break;
            case 'apply':
                adviceElement.innerText = "💡 【おうよう問題】が 課題みたいだね。文章を読むときに、図や 絵を かいてみると 答えが わかりやすくなるよ！";
                break;
        }
    }
}