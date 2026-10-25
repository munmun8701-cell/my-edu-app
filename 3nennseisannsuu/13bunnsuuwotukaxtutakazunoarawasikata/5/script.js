document.addEventListener("DOMContentLoaded", () => {
  
  // ====================================================
  // 全角数字を半角に自動変換する機能
  // ====================================================
  function toHalfWidthMath(str) {
    return str.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  document.body.addEventListener('input', function(e) {
    if (e.target.classList.contains('num-input') && !e.target.readOnly) {
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
  // タブ1：1mをこえるテープ図シミュレーター
  // ====================================================
  const sliderParts = document.getElementById('slider-parts');
  const valParts = document.getElementById('val-parts');
  const simTape = document.getElementById('sim-tape');
  const simRuler = document.getElementById('sim-ruler');
  const fractionDisplay = document.getElementById('tape-fraction-display');
  
  // 背景のめもり（10等分、つまり0〜2mまでで1/5が10個）を生成
  for(let i=0; i<10; i++){
    let mark = document.createElement('div');
    mark.className = 'tape-mark';
    mark.style.width = '10%';
    simRuler.appendChild(mark);
  }

  function updateTape() {
    let parts = parseInt(sliderParts.value);
    valParts.textContent = parts;
    
    // 全体(2m)を100%としたとき、1パーツ(1/5m)は10%
    simTape.style.width = `${parts * 10}%`;

    if(parts === 0) {
      fractionDisplay.innerHTML = `0 m`;
    } else {
      fractionDisplay.innerHTML = `<span class="inline-frac"><span class="top">${parts}</span><span class="bottom">5</span></span> m`;
    }
  }

  sliderParts.addEventListener('input', updateTape);
  updateTape(); // 初期化

  // ====================================================
  // 共通：数直線生成関数
  // ====================================================
  function createNumberLine(containerId, divisionsPerMeter, totalMeters, pointsToLabel) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const totalTicks = divisionsPerMeter * totalMeters;

    for(let i = 0; i <= totalTicks; i++) {
      let tick = document.createElement('div');
      tick.className = 'nl-tick';
      
      // 1mごとの主めもり
      if (i % divisionsPerMeter === 0) {
        tick.classList.add('main');
        let labelTop = document.createElement('div');
        labelTop.className = 'nl-label-top';
        labelTop.textContent = i / divisionsPerMeter;
        tick.appendChild(labelTop);
      }
      
      // 指定された記号（ア、イなど）の配置
      if (pointsToLabel && pointsToLabel[i]) {
        let labelBottom = document.createElement('div');
        labelBottom.className = 'nl-label-bottom';
        labelBottom.innerHTML = `<span class="nl-point-name">↑<br>${pointsToLabel[i]}</span>`;
        tick.appendChild(labelBottom);
      }

      tick.style.left = `${(i / totalTicks) * 100}%`;
      container.appendChild(tick);
    }
  }

  // ====================================================
  // タブ2：5等分の数直線（0〜2m）
  // ====================================================
  createNumberLine('number-line-5', 5, 2, {
    1: '1/5', 2: '2/5', 3: '3/5', 4: '4/5', 5: '5/5', 6: '6/5'
  }); // 途中までの分数を固定表示（教科書の図を再現）

  const btnCheck2 = document.getElementById('btn-check2');
  const result2 = document.getElementById('result2');

  btnCheck2.addEventListener('click', () => {
    const num7 = document.getElementById('q2-num7').value;
    const num8 = document.getElementById('q2-num8').value;
    const num9 = document.getElementById('q2-num9').value;
    const num10 = document.getElementById('q2-num10').value;
    const intAns = document.getElementById('q2-int').value;

    if (num7 === "7" && num8 === "8" && num9 === "9" && num10 === "10" && intAns === "2") {
      result2.textContent = "大せいかい！ 1mをこえる長さも同じように表せるね。";
      result2.className = "result-message correct";
    } else {
      result2.textContent = "おしい！ 1mをこえても、分子の数は順番に増えていくよ。";
      result2.className = "result-message wrong";
    }
  });

  // ====================================================
  // タブ3：練習問題（3等分の数直線）
  // ====================================================
  createNumberLine('number-line-3', 3, 2, {
    1: 'ア', 3: 'イ', 4: 'ウ', 5: 'エ', 6: 'オ'
  });

  const btnCheck3 = document.getElementById('btn-check3');
  const result3 = document.getElementById('result3');
  const quizFeedback = document.getElementById('quiz-feedback');
  const tool3Msg = document.getElementById('tool3-message');

  btnCheck3.addEventListener('click', () => {
    // 全て分母は3
    const isDenCorrect = ['a','i','u','e','o'].every(id => document.getElementById(`q3-den-${id}`).value === "3");
    
    // 分子の確認 (ア=1, イ=3, ウ=4, エ=5, オ=6)
    const isNumCorrect = 
      document.getElementById('q3-num-a').value === "1" &&
      document.getElementById('q3-num-i').value === "3" &&
      document.getElementById('q3-num-u').value === "4" &&
      document.getElementById('q3-num-e').value === "5" &&
      document.getElementById('q3-num-o').value === "6";

    if (isDenCorrect && isNumCorrect) {
      result3.textContent = "ばっちり！ 全問せいかい！";
      result3.className = "result-message correct";
      quizFeedback.style.display = 'flex';
      tool3Msg.innerHTML = "<strong>【ノートにまとめよう】</strong><br>どんな数直線でも、<strong>「0から1までが何等分されているか」</strong>を見つけることが一番大切だね。<br>3等分なら分母は3になるよ。分数のものさしの見方がしっかり身についたね！";
    } else {
      if (!isDenCorrect) {
        result3.textContent = "ざんねん！ 分母がちがうみたい。「0から1の間」はいくつに分かれているかな？";
      } else {
        result3.textContent = "おしい！ 分子がちがうところがあるよ。めもりを0から数えてみよう。";
      }
      result3.className = "result-message wrong";
      quizFeedback.style.display = 'none';
    }
  });

});