document.addEventListener("DOMContentLoaded", () => {
  
  // ====================================================
  // 全角数字を半角に自動変換する機能
  // ====================================================
  function toHalfWidthMath(str) {
    return str.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  // 動的生成されるinputにも対応するため、イベント委譲を使用
  document.body.addEventListener('input', function(e) {
    if (e.target.classList.contains('num-input')) {
      e.target.value = toHalfWidthMath(e.target.value).replace(/[^0-9]/g, '');
    }
  });

  // ====================================================
  // タブ切り替え処理
  // ====================================================
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
  // タブ1：テープ図シミュレーター
  // ====================================================
  const sliderDiv = document.getElementById('slider-div');
  const sliderTapeA = document.getElementById('slider-tape-a');
  const sliderTapeB = document.getElementById('slider-tape-b');
  const valDiv = document.getElementById('val-div');
  const valTapeA = document.getElementById('val-tape-a');
  const valTapeB = document.getElementById('val-tape-b');
  const simTapeA = document.getElementById('sim-tape-a');
  const simTapeB = document.getElementById('sim-tape-b');
  
  function updateTapes() {
    let div = parseInt(sliderDiv.value);
    
    // 最大値を現在の等分数に設定
    sliderTapeA.max = div;
    sliderTapeB.max = div;
    
    let tapeA = parseInt(sliderTapeA.value);
    let tapeB = parseInt(sliderTapeB.value);
    if(tapeA > div) { tapeA = div; sliderTapeA.value = div; }
    if(tapeB > div) { tapeB = div; sliderTapeB.value = div; }

    valDiv.textContent = div;
    valTapeA.textContent = tapeA;
    valTapeB.textContent = tapeB;
    
    // 背景の等分線を描画する処理（CSS背景で実現）
    const gradient = `repeating-linear-gradient(to right, transparent, transparent calc(100% / ${div} - 1px), #777 calc(100% / ${div} - 1px), #777 calc(100% / ${div}))`;
    
    document.querySelectorAll('.tape-ruler').forEach(ruler => {
      ruler.style.backgroundImage = gradient;
    });

    simTapeA.style.width = div > 0 ? `${(tapeA / div) * 100}%` : '0%';
    simTapeB.style.width = div > 0 ? `${(tapeB / div) * 100}%` : '0%';
  }

  sliderDiv.addEventListener('input', updateTapes);
  sliderTapeA.addEventListener('input', updateTapes);
  sliderTapeB.addEventListener('input', updateTapes);
  updateTapes(); // 初期化

  // ====================================================
  // タブ2：数直線シミュレーター
  // ====================================================
  const sliderLineDiv = document.getElementById('slider-line-div');
  const valLineDiv = document.getElementById('val-line-div');
  const numberLineContainer = document.getElementById('number-line-container');
  const fractionInputsRow = document.getElementById('fraction-inputs-row');
  const btnCheck2 = document.getElementById('btn-check2');
  const result2 = document.getElementById('result2');

  function updateNumberLine() {
    let div = parseInt(sliderLineDiv.value);
    valLineDiv.textContent = div;
    
    // 数直線のめもり生成
    numberLineContainer.innerHTML = '';
    for(let i = 0; i <= div; i++) {
      let tick = document.createElement('div');
      tick.className = 'nl-tick';
      if (i === 0 || i === div) tick.classList.add('main');
      tick.style.left = `${(i / div) * 100}%`;
      
      if (i === 0) {
        let label = document.createElement('div');
        label.className = 'nl-label';
        label.textContent = '0';
        tick.appendChild(label);
      } else if (i === div) {
        let label = document.createElement('div');
        label.className = 'nl-label';
        label.textContent = '1';
        tick.appendChild(label);
      }
      numberLineContainer.appendChild(tick);
    }

    // 入力欄の生成（5等分の時だけ教科書の空欄問題を表示）
    fractionInputsRow.innerHTML = '';
    result2.textContent = '';
    
    if (div === 5) {
      for(let i = 1; i <= 4; i++) {
        let box = document.createElement('div');
        box.className = 'fraction-input-box';
        box.innerHTML = `
          <div class="fraction-input small">
            <input type="text" id="nl-num-${i}" class="num-input">
            <div class="fraction-line"></div>
            <span style="font-size: 1.3rem; font-weight:bold;">5</span>
          </div>
        `;
        fractionInputsRow.appendChild(box);
      }
      btnCheck2.style.display = 'inline-block';
    } else {
      fractionInputsRow.innerHTML = '<p style="color:#777;">スライダーを動かして「5等分」にしてみよう。</p>';
      btnCheck2.style.display = 'none';
    }
  }

  sliderLineDiv.addEventListener('input', updateNumberLine);
  updateNumberLine(); // 初期化

  btnCheck2.addEventListener('click', () => {
    if (parseInt(sliderLineDiv.value) !== 5) return;
    
    let allCorrect = true;
    for(let i = 1; i <= 4; i++) {
      const input = document.getElementById(`nl-num-${i}`);
      if (input && input.value !== String(i + 1)) { // 教科書は 2/5, 3/5, 4/5, 5/5 の枠（実際は1/5は書かれているがここでは連続して入力させる構成）
         // 設問構成の簡略化：左から 1, 2, 3, 4 を入力させる
      }
      // 上記のコメントを訂正し、1/5, 2/5, 3/5, 4/5 を入力させる
      if (input && input.value !== String(i)) {
          allCorrect = false;
      }
    }

    if (allCorrect) {
      result2.textContent = "大せいかい！ 1めもりが 1/5m になっているね。";
      result2.className = "result-message correct";
    } else {
      result2.textContent = "おしい！ 左から順番に 1/5 のいくつ分か考えてみよう。";
      result2.className = "result-message wrong";
    }
  });


  // ====================================================
  // タブ3：大きさくらべ・まとめ
  // ====================================================
  const btnCheck3 = document.getElementById('btn-check3');
  const result3 = document.getElementById('result3');
  const quizFeedback = document.getElementById('quiz-feedback');
  const tool3Msg = document.getElementById('tool3-message');

  btnCheck3.addEventListener('click', () => {
    // ❶ の判定
    const q3Parts = document.getElementById('q3-parts').value;
    const q3AnsNum1 = document.getElementById('q3-ans-num1').value;
    const q3AnsDen1 = document.getElementById('q3-ans-den1').value;
    
    // ❷ の判定
    const q3AnsNum2 = document.getElementById('q3-ans-num2').value;
    const q3AnsDen2 = document.getElementById('q3-ans-den2').value;
    const q3AnsInt = document.getElementById('q3-ans-int').value;

    const isQ1Correct = (q3Parts === "1" && q3AnsNum1 === "1" && q3AnsDen1 === "5");
    const isQ2Correct = (q3AnsNum2 === "5" && q3AnsDen2 === "5" && q3AnsInt === "1");

    if (isQ1Correct && isQ2Correct) {
      result3.textContent = "ばっちり！ 大せいかい！";
      result3.className = "result-message correct";
      quizFeedback.style.display = 'flex';
      tool3Msg.innerHTML = "<strong>【ノートにまとめよう】</strong><br>分数も、整数や小数のときと同じように、「1めもりの大きさ（単位分数）」をもとにすると、数直線に表したり、大きさをくらべたりできるね。<br>分母と分子が同じ数になると「1」になることも、ノートに書いておこう！";
    } else {
      result3.textContent = "どこかがちがうみたい。数直線をもう一度かくにんしてみよう。";
      result3.className = "result-message wrong";
      quizFeedback.style.display = 'none';
    }
  });

});