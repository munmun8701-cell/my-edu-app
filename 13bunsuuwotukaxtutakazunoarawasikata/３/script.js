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

  // ----------------------------------------------------
  // ビーカーを描画する共通関数
  // ----------------------------------------------------
  function drawBeaker(marksContainer, waterElement, divisions, filledCount) {
    // 水の高さを計算
    const percentage = divisions > 0 ? (filledCount / divisions) * 100 : 0;
    waterElement.style.height = `${percentage}%`;

    // めもりを描画
    marksContainer.innerHTML = '';
    for(let i = 0; i < divisions; i++) {
      const mark = document.createElement('div');
      mark.className = 'mark-segment';
      marksContainer.appendChild(mark);
    }
  }

  // ====================================================
  // タブ1：かさを分数で表そう
  // ====================================================
  const sliderDiv = document.getElementById('slider-div');
  const sliderWater = document.getElementById('slider-water');
  const valDiv = document.getElementById('val-div');
  const valWater = document.getElementById('val-water');
  const simMarks = document.getElementById('sim-marks');
  const simWater = document.getElementById('sim-water');
  
  function updateSimBeaker() {
    let div = parseInt(sliderDiv.value);
    
    // 水の量は等分数を超えないようにする
    sliderWater.max = div;
    let water = parseInt(sliderWater.value);
    if(water > div) {
      water = div;
      sliderWater.value = div;
    }

    valDiv.textContent = div;
    valWater.textContent = water;
    
    drawBeaker(simMarks, simWater, div, water);
  }

  sliderDiv.addEventListener('input', updateSimBeaker);
  sliderWater.addEventListener('input', updateSimBeaker);
  updateSimBeaker(); // 初期化

  const btnCheck1 = document.getElementById('btn-check1');
  const result1 = document.getElementById('result1');

  btnCheck1.addEventListener('click', () => {
    // スライダーで正しく図を作れたか
    const isFigureCorrect = parseInt(sliderDiv.value) === 5 && parseInt(sliderWater.value) === 2;
    
    // 入力値の取得
    const n1 = document.getElementById('q1-num1').value;
    const d1 = document.getElementById('q1-den1').value;
    const parts = document.getElementById('q1-parts').value;
    const n2 = document.getElementById('q1-num2').value;
    const d2 = document.getElementById('q1-den2').value;

    if (!isFigureCorrect) {
      result1.textContent = "図がちがうよ。スライダーで「5等分」「2こ分」をつくってみよう。";
      result1.className = "result-message wrong";
      return;
    }

    if (n1 === "1" && d1 === "5" && parts === "2" && n2 === "2" && d2 === "5") {
      result1.innerHTML = "大せいかい！ 長さと同じように<br>「1Lの5等分が2こ分で、2/5L」だね。";
      result1.className = "result-message correct";
    } else {
      result1.textContent = "おしい！ 1めもりは何Lか、何こ分あるか、かくにんしよう。";
      result1.className = "result-message wrong";
    }
  });

  // ====================================================
  // タブ2：分母と分子
  // ====================================================
  const sliderTermDiv = document.getElementById('slider-term-div');
  const sliderTermWater = document.getElementById('slider-term-water');
  const valTermDiv = document.getElementById('val-term-div');
  const valTermWater = document.getElementById('val-term-water');
  const termMarks = document.getElementById('term-marks');
  const termWater = document.getElementById('term-water');
  const dispNum = document.getElementById('disp-num');
  const dispDen = document.getElementById('disp-den');

  function updateTermBeaker() {
    let div = parseInt(sliderTermDiv.value);
    
    sliderTermWater.max = div;
    let water = parseInt(sliderTermWater.value);
    if(water > div) {
      water = div;
      sliderTermWater.value = div;
    }

    valTermDiv.textContent = div;
    valTermWater.textContent = water;
    dispDen.textContent = div;
    dispNum.textContent = water;
    
    drawBeaker(termMarks, termWater, div, water);
  }

  sliderTermDiv.addEventListener('input', updateTermBeaker);
  sliderTermWater.addEventListener('input', updateTermBeaker);
  updateTermBeaker(); // 初期化

  // ====================================================
  // タブ3：練習問題
  // ====================================================
  const btnCheck3 = document.getElementById('btn-check3');
  const result3 = document.getElementById('result3');
  const quizFeedback = document.getElementById('quiz-feedback');
  const tool3Msg = document.getElementById('tool3-message');

  btnCheck3.addEventListener('click', () => {
    const den1 = document.getElementById('q3-den1').value;
    const num1 = document.getElementById('q3-num1').value;
    const den2 = document.getElementById('q3-den2').value;
    const num2 = document.getElementById('q3-num2').value;

    if (den1 === "4" && num1 === "1" && den2 === "8" && num2 === "5") {
      result3.textContent = "ばっちり！ 大せいかい！";
      result3.className = "result-message correct";
      quizFeedback.style.display = 'flex';
      tool3Msg.innerHTML = "<strong>【ノートに書こう】</strong><br>「分母」は下の数、「分子」は上の数だね。<br>分母と分子がそれぞれ何を表しているか、説明できるかな？";
    } else {
      result3.textContent = "おしい！ 上と下、どっちが分母でどっちが分子だったかな？";
      result3.className = "result-message wrong";
      quizFeedback.style.display = 'none';
    }
  });

});