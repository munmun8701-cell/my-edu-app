// 全角数字・記号を半角に変換する関数（児童の入力ゆれ対策）
function toHalfWidth(str) {
  return str.replace(/[！-～]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/ /g, ' ').trim();
}

// すべてのinputタグに全角→半角の自動変換イベントを追加
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function(e) {
    let cursorPosition = this.selectionStart;
    this.value = toHalfWidth(this.value);
    this.setSelectionRange(cursorPosition, cursorPosition);
  });
});

// 共通チェック関数（セル入力用）
function checkCells(containerSelector) {
  const inputs = document.querySelectorAll(`${containerSelector} .cell-input`);
  let allCorrect = true;
  inputs.forEach(input => {
    if (input.value === input.dataset.correct) {
      input.classList.add('correct');
      input.classList.remove('wrong');
    } else {
      input.classList.add('wrong');
      input.classList.remove('correct');
      allCorrect = false;
    }
  });
  return allCorrect;
}

function showHint(stage) {
  document.getElementById(`hint${stage}`).classList.remove('hidden');
}

// Stage 1 チェック
function checkStage1() {
  const isCorrect = checkCells('#stage1');
  const resultDiv = document.getElementById('result1');
  if (isCorrect) {
    resultDiv.innerHTML = '<span style="color: #4CAF50;">大正解！ 最後の「0」は斜線で消すのがルールだね！</span>';
    setTimeout(() => document.getElementById('stage2').classList.remove('hidden'), 1500);
  } else {
    resultDiv.innerHTML = '<span style="color: #f44336;">おしい！空いているマスや計算を見直してみよう。</span>';
  }
}

// Stage 2 選択肢チェック
function checkChoice(choice) {
  const resultDiv = document.getElementById('result2');
  if (choice === 'イ') {
    resultDiv.innerHTML = '<span style="color: #4CAF50;">せいかい！ 小数点を縦にそろえるのがポイントだね。</span>';
    document.getElementById('stage2-calc').classList.remove('hidden');
  } else {
    resultDiv.innerHTML = '<span style="color: #f44336;">ちがうよ！ 右はしをそろえると、位がバラバラになっちゃうね。</span>';
  }
}

// Stage 2 計算チェック
function checkStage2Calc() {
  const isCorrect = checkCells('#stage2-calc');
  const resultDiv = document.getElementById('result2-calc');
  if (isCorrect) {
    resultDiv.innerHTML = '<span style="color: #4CAF50;">かんぺき！ 空いているところは「0」があると考えて計算できたね！</span>';
    setTimeout(() => document.getElementById('stage3').classList.remove('hidden'), 1500);
  } else {
    resultDiv.innerHTML = '<span style="color: #f44336;">計算ミスがないか、くり上がりに気をつけてもう一度やってみよう。</span>';
  }
}

// Stage 3 まとめチェック
function checkSummary() {
  const input = document.getElementById('summary-input');
  const resultDiv = document.getElementById('result-summary');
  if (input.value.includes('小数点')) {
    resultDiv.innerHTML = '<span style="color: #4CAF50;">すばらしい！「小数点をそろえて」書くのがいちばん大事なルールだね！</span>';
    input.style.borderColor = '#4CAF50';
    input.style.backgroundColor = '#e8f5e9';
    setTimeout(() => {
      document.getElementById('stage4').classList.remove('hidden');
      renderPractice();
    }, 1500);
  } else {
    resultDiv.innerHTML = '<span style="color: #f44336;">「小」から始まる言葉だよ。何をそろえるんだったかな？</span>';
  }
}

// Stage 4 練習問題データ（画像2枚目より抜粋・網羅）
const practices = [
  { no: "2-①", q: "8.47 ＋ 6.73", a: "15.2" }, // 15.20 -> 15.2
  { no: "2-②", q: "0.074 ＋ 0.586", a: "0.66" }, // 0.660 -> 0.66
  { no: "2-③", q: "0.053 ＋ 0.047", a: "0.1" },   // 0.100 -> 0.1
  { no: "3-①", q: "5.92 ＋ 2.8", a: "8.72" },
  { no: "3-②", q: "18.3 ＋ 4.05", a: "22.35" },
  { no: "3-⑤", q: "23 ＋ 9.46", a: "32.46" }
];

let currentPracticeIdx = 0;

function renderPractice() {
  if (currentPracticeIdx >= practices.length) {
    document.getElementById('practice-container').innerHTML = '<h3 style="color:#4CAF50;">★すべてのクエストをクリアしました！★</h3>';
    document.getElementById('next-practice-btn').style.display = 'none';
    return;
  }
  
  const p = practices[currentPracticeIdx];
  const container = document.getElementById('practice-container');
  container.innerHTML = `
    <div class="practice-item">
      <div class="practice-formula">問題 ${p.no} :  ${p.q} ＝ </div>
      <div class="practice-input-area">
        <input type="text" id="practice-ans" class="ans-input" placeholder="こたえ">
        <button class="check-btn" onclick="checkPractice('${p.a}')">判定</button>
      </div>
      <div id="practice-hint-btn-area" style="margin-top: 10px;">
        <button class="hint-btn" onclick="document.getElementById('p-hint').classList.remove('hidden')">💡 筆算のヒントを見る</button>
      </div>
      <div id="p-hint" class="hint-box hidden">
        <p>ノートに小数点をそろえて筆算を書いてみよう！ 終わりの「0」は消すのを忘れないでね。</p>
      </div>
      <div id="practice-result" class="result-message"></div>
    </div>
  `;
  
  // 入力欄にも再度イベントリスナーを付与
  document.getElementById('practice-ans').addEventListener('input', function(e) {
    let cursorPosition = this.selectionStart;
    this.value = toHalfWidth(this.value);
    this.setSelectionRange(cursorPosition, cursorPosition);
  });
  
  document.getElementById('next-practice-btn').style.display = 'none';
}

function checkPractice(correctAnswer) {
  const input = document.getElementById('practice-ans');
  const resultDiv = document.getElementById('practice-result');
  // 余分なスペース等を除去して比較
  if (input.value === correctAnswer) {
    resultDiv.innerHTML = '<span style="color: #4CAF50;">大正解！ばっちりだね！</span>';
    input.style.borderColor = '#4CAF50';
    input.style.backgroundColor = '#e8f5e9';
    document.getElementById('next-practice-btn').style.display = 'inline-block';
  } else {
    // 0が残っている場合などの簡易チェック
    if (parseFloat(input.value) === parseFloat(correctAnswer)) {
      resultDiv.innerHTML = '<span style="color: #ff9800;">おしい！末尾の「0」は消して書くのがルールだったね。</span>';
    } else {
      resultDiv.innerHTML = '<span style="color: #f44336;">ちがうみたい。ノートの筆算の「位」がずれていないか確認しよう！</span>';
    }
  }
}

function nextPractice() {
  currentPracticeIdx++;
  renderPractice();
}