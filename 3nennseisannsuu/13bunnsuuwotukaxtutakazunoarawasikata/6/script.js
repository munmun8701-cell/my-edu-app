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
  // タブ1：予想をたしかめよう (3/4m の作成シミュレーター)
  // ====================================================
  const sliderDiv = document.getElementById('slider-div');
  const sliderParts = document.getElementById('slider-parts');
  const valDiv = document.getElementById('val-div');
  const valParts = document.getElementById('val-parts');
  const simTape = document.getElementById('sim-tape');
  const simRuler = document.getElementById('sim-ruler');
  const fractionDisplay = document.getElementById('tape-fraction-display');
  const compareResult = document.getElementById('compare-result');
  
  function updateInteractiveTape() {
    let div = parseInt(sliderDiv.value); // 1mを何等分するか
    let parts = parseInt(sliderParts.value); // その何個分か
    
    valDiv.textContent = div;
    valParts.textContent = parts;

    // めもりの再描画 (0m 〜 2m の範囲で作るため、1mの等分数を全体に反映)
    // 既存の動的目盛りを削除
    document.querySelectorAll('.tape-mark-interactive').forEach(el => el.remove());
    
    // 全体は2mなので、2倍の数の目盛りが必要
    const totalTicks = div * 2; 
    for(let i = 1; i < totalTicks; i++) {
      if (i === div) continue; // 1mの線はCSSで太線にするためスキップ
      let mark = document.createElement('div');
      mark.className = 'tape-mark-interactive';
      // コンテナ全体(2m)を100%としたときの位置
      mark.style.left = `${(i / totalTicks) * 100}%`;
      simRuler.appendChild(mark);
    }

    // 色を塗る部分の幅（1mが全体の50%）
    // 1パーツの幅 = 50% / div
    // 全体の幅 = 1パーツの幅 * parts
    const widthPercentage = (50 / div) * parts;
    simTape.style.width = `${Math.min(widthPercentage, 100)}%`; // 2m(100%)を超えないようにする

    // テキスト表示
    if (parts === 0) {
      fractionDisplay.innerHTML = `0 m`;
    } else {
      fractionDisplay.innerHTML = `<span class="inline-frac"><span class="top">${parts}</span><span class="bottom">${div}</span></span> m`;
    }

    // 「3/4m」を作った時のフィードバック
    if (div === 4 && parts === 3) {
      compareResult.innerHTML = "はっけん！👀 <strong>3/4m</strong> のテープは、テープ㋐より短いね。<br>テープ㋐は 3/4m ではないことがわかったね！";
      compareResult.className = "result-message correct";
    } else {
      compareResult.textContent = "スライダーを動かして、3/4 m を作ってみよう。";
      compareResult.className = "result-message";
      compareResult.style.color = "#777";
    }
  }

  sliderDiv.addEventListener('input', updateInteractiveTape);
  sliderParts.addEventListener('input', updateInteractiveTape);
  updateInteractiveTape(); // 初期化

  // ====================================================
  // タブ2：正しい分数の導出
  // ====================================================
  const btnCheck2 = document.getElementById('btn-check2');
  const result2 = document.getElementById('result2');

  btnCheck2.addEventListener('click', () => {
    const qDiv = document.getElementById('q2-div').value;
    const qParts = document.getElementById('q2-parts').value;
    const ansNum = document.getElementById('q2-ans-num').value;
    const ansDen = document.getElementById('q2-ans-den').value;

    // 正解：1mを「2」等分した「3」こ分で「3/2」m
    const isStep1Correct = (qDiv === "2");
    const isStep2Correct = (qParts === "3");
    const isAnsCorrect = (ansNum === "3" && ansDen === "2");

    if (isStep1Correct && isStep2Correct && isAnsCorrect) {
      result2.innerHTML = "大せいかい！✨<br>「1m」に注目すると、1mを2等分した3こ分だとわかるね！";
      result2.className = "result-message correct";
    } else {
      if (!isStep1Correct) {
        result2.textContent = "おしい！ 0mから「1m」の間は、いくつに分かれているかな？";
      } else if (!isStep2Correct) {
        result2.textContent = "おしい！ テープ㋐は、1めもりが何こ分あるか数えてみよう。";
      } else {
        result2.textContent = "分数にするには、どうすればよかったかな？";
      }
      result2.className = "result-message wrong";
    }
  });

  // ====================================================
  // タブ3：練習問題（㋑・㋒）
  // ====================================================
  const btnCheck3 = document.getElementById('btn-check3');
  const result3 = document.getElementById('result3');
  const quizFeedback = document.getElementById('quiz-feedback');
  const tool3Msg = document.getElementById('tool3-message');

  btnCheck3.addEventListener('click', () => {
    // ㋑ 正解：4/3
    const numI = document.getElementById('q3-num-i').value;
    const denI = document.getElementById('q3-den-i').value;
    // ㋒ 正解：4/6
    const numU = document.getElementById('q3-num-u').value;
    const denU = document.getElementById('q3-den-u').value;

    const isICorrect = (numI === "4" && denI === "3");
    const isUCorrect = (numU === "4" && denU === "6");

    if (isICorrect && isUCorrect) {
      result3.textContent = "ばっちり！ 全問せいかい！";
      result3.className = "result-message correct";
      quizFeedback.style.display = 'flex';
      tool3Msg.innerHTML = "<strong>【ノートにまとめよう】</strong><br>テープ㋐の長さは 2m の 3/4 だけど、3/4m ではありません。<br>3/4m とは、「<strong>1m</strong>」の 3/4 の長さです。<br>分数で長さを表すときは、<strong>1mをもとの長さにする</strong>ということをノートに書いておこう！";
    } else {
      result3.innerHTML = "どこかがちがうみたい。<br>もう一度、<strong>0から1の間</strong>が何等分されているか数えてみよう。";
      result3.className = "result-message wrong";
      quizFeedback.style.display = 'none';
    }
  });

});