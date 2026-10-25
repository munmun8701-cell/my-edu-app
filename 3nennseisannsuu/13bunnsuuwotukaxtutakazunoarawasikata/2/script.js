document.addEventListener("DOMContentLoaded", () => {
  
  // ----------------------------------------------------
  // 全角数字を半角に自動変換する機能
  // ----------------------------------------------------
  function toHalfWidthMath(str) {
    return str.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  document.querySelectorAll('.num-input').forEach(input => {
    input.addEventListener('input', function() {
      // 半角変換後、数字以外は消去
      this.value = toHalfWidthMath(this.value).replace(/[^0-9]/g, '');
    });
  });

  // ----------------------------------------------------
  // タブ切り替え処理
  // ----------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });

  // ====================================================
  // タブ1：はじめの課題
  // ====================================================
  const btnCheck1 = document.getElementById('btn-check1');
  const result1 = document.getElementById('result1');

  btnCheck1.addEventListener('click', () => {
    const q1_1 = document.getElementById('q1-1').value;
    const q1_2 = document.getElementById('q1-2').value;

    if (q1_1 === "2" && q1_2 === "2") {
      result1.textContent = "大せいかい！ 1mを3等分した2こ分だから「2/3 m」だね。";
      result1.className = "result-message correct";
    } else {
      result1.textContent = "おしい！ テープ図のピンク色の部分は、いくつ分あるか数えてみよう。";
      result1.className = "result-message wrong";
    }
  });

  // ====================================================
  // タブ2：ほかの長さ
  // ====================================================
  const btnCheck2 = document.getElementById('btn-check2');
  const result2 = document.getElementById('result2');
  const summary2 = document.getElementById('tab2-summary');

  btnCheck2.addEventListener('click', () => {
    const num = document.getElementById('q2-num').value;
    const den = document.getElementById('q2-den').value;

    if (num === "3" && den === "5") {
      result2.textContent = "ばっちり！ 大せいかい！";
      result2.className = "result-message correct";
      summary2.style.display = "flex"; // りくくんのまとめを表示
    } else {
      result2.textContent = "おしい！ 1mを「何等分」して、「何こ分」色がついているか確認しよう。";
      result2.className = "result-message wrong";
      summary2.style.display = "none";
    }
  });

  // ====================================================
  // タブ3：練習問題
  // ====================================================
  
  // クリックして色を塗るインタラクション
  document.querySelectorAll('.interactive .tape-part').forEach(part => {
    part.addEventListener('click', function() {
      this.classList.toggle('colored');
    });
  });

  const btnCheck3 = document.getElementById('btn-check3');
  const result3 = document.getElementById('result3');
  const quizFeedback = document.getElementById('quiz-feedback');
  const tool3Msg = document.getElementById('tool3-message');

  btnCheck3.addEventListener('click', () => {
    // 練習1の入力取得
    const parts1 = document.getElementById('q3-1-parts').value;
    const num1 = document.getElementById('q3-1-num').value;
    const den1 = document.getElementById('q3-1-den').value;
    
    const parts2 = document.getElementById('q3-2-parts').value;
    const num2 = document.getElementById('q3-2-num').value;
    const den2 = document.getElementById('q3-2-den').value;

    // 練習2の塗りつぶし状態取得
    const tape1Colored = document.querySelectorAll('#interactive-tape-1 .colored').length;
    const tape2Colored = document.querySelectorAll('#interactive-tape-2 .colored').length;

    let allCorrect = true;

    // 判定① 4/9
    if (!(parts1 === "4" && num1 === "4" && den1 === "9")) allCorrect = false;
    // 判定② 9/10
    if (!(parts2 === "9" && num2 === "9" && den2 === "10")) allCorrect = false;
    // 判定③ 色塗り 2/4 (4等分中2こ塗る)
    if (tape1Colored !== 2) allCorrect = false;
    // 判定④ 色塗り 3/6 (6等分中3こ塗る)
    if (tape2Colored !== 3) allCorrect = false;

    if (allCorrect) {
      result3.textContent = "ぜんぶ大せいかい！ すばらしい！";
      result3.className = "result-message correct";
      quizFeedback.style.display = 'flex';
      tool3Msg.innerHTML = "<strong>【先生から】</strong><br>色をぬった <strong>2/4 m</strong> と <strong>3/6 m</strong> のテープを見くらべてみよう。<br>分母と分子の数はちがうけれど、どちらも「1mの半分」で <strong>同じ長さ</strong> になっていることに気づけたかな？";
    } else {
      result3.innerHTML = "おしい！ まちがっているところがあるよ。<br><span style='font-size:1rem;font-weight:normal;'>※色ぬり問題は、左はしから分数の数だけクリックして色をつけよう。</span>";
      result3.className = "result-message wrong";
      quizFeedback.style.display = 'none';
    }
  });

});