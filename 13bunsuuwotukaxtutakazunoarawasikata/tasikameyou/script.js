document.addEventListener("DOMContentLoaded", () => {
  
  // ----------------------------------------------------
  // 全角数字を半角に自動変換
  // ----------------------------------------------------
  function toHalfWidthMath(str) {
    return str.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  document.querySelectorAll('.num-input').forEach(input => {
    input.addEventListener('input', function() {
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
  // 問題1：水のかさ
  // ====================================================
  const marks1a = document.getElementById('marks-1a');
  const marks1b = document.getElementById('marks-1b');

  // メモリ描画
  function drawMarks(container, divisions) {
    for(let i=0; i<divisions; i++) {
      const seg = document.createElement('div');
      seg.className = 'mark-segment';
      container.appendChild(seg);
    }
  }
  drawMarks(marks1a, 5); // ㋐: 5等分
  drawMarks(marks1b, 4); // ㋑: 4等分

  let selectedBeaker = "";
  const btnA = document.getElementById('choice-a');
  const btnI = document.getElementById('choice-i');

  btnA.addEventListener('click', () => {
    selectedBeaker = "a";
    btnA.classList.add('selected');
    btnI.classList.remove('selected');
  });
  btnI.addEventListener('click', () => {
    selectedBeaker = "i";
    btnI.classList.add('selected');
    btnA.classList.remove('selected');
  });

  document.getElementById('btn-check1').addEventListener('click', () => {
    const den = document.getElementById('q1-den').value;
    const num = document.getElementById('q1-num').value;
    const res1 = document.getElementById('result1');

    if (selectedBeaker === "a" && den === "5" && num === "3") {
      res1.textContent = "大せいかい！ 1Lを5等分した3こ分だね。";
      res1.className = "result-message correct";
    } else {
      res1.textContent = "おしい！ 1Lを「何等分」しているか、よく見てみよう。";
      res1.className = "result-message wrong";
    }
  });

  // ====================================================
  // 問題2：長さを分数で表す
  // ====================================================
  const tape2_1 = document.getElementById('tape-2-1');
  const tape2_2 = document.getElementById('tape-2-2');

  function drawTape(container, divisions, coloredCount) {
    for(let i=0; i<divisions; i++) {
      const seg = document.createElement('div');
      seg.className = 'tape-segment';
      if(i < coloredCount) {
        seg.classList.add(i === 0 ? 'colored-red' : 'colored');
      }
      container.appendChild(seg);
    }
  }

  // ① 1mを6等分して5つ塗る
  drawTape(tape2_1, 6, 5);
  // ② 2m分(1m×2)をそれぞれ3等分(計6等分)して5つ塗る
  drawTape(tape2_2, 6, 5);

  document.getElementById('btn-check2').addEventListener('click', () => {
    const n1 = document.getElementById('q2-1-num').value;
    const d1 = document.getElementById('q2-1-den').value;
    const n2 = document.getElementById('q2-2-num').value;
    const d2 = document.getElementById('q2-2-den').value;
    const res2 = document.getElementById('result2');

    if (n1 === "5" && d1 === "6" && n2 === "5" && d2 === "3") {
      res2.textContent = "ばっちり！ どちらも正解です！";
      res2.className = "result-message correct text-right";
    } else {
      res2.innerHTML = "おしい！ <strong>1mの長さ</strong> を何等分しているか（分母）に気をつけて！";
      res2.className = "result-message wrong text-right";
    }
  });

  // ====================================================
  // 問題3：数直線
  // ====================================================
  const numLine3 = document.getElementById('num-line-3');
  
  function initNumLine() {
    const label0 = document.createElement('div');
    label0.className = 'tick-label-0';
    label0.textContent = '0';
    numLine3.appendChild(label0);

    const kigou = ["ア", "イ", "ウ", "エ"];
    
    // 0〜1までを7等分、少し余裕を持たせて9目盛り描く
    for(let i=1; i<=9; i++){
      const seg = document.createElement('div');
      seg.className = 'tick-segment';
      
      if (i === 7) {
        seg.innerHTML = '<div class="tick-label" style="top:25px;">1</div>';
        seg.style.borderRight = "3px solid #333"; // 1の目盛りを強調
      }

      // ア(1), イ(3), ウ(6), エ(8)
      let kIndex = -1;
      if(i===1) kIndex = 0;
      if(i===3) kIndex = 1;
      if(i===6) kIndex = 2;
      if(i===8) kIndex = 3;

      if(kIndex !== -1) {
        const kLabel = document.createElement('div');
        kLabel.className = 'kigou-label';
        kLabel.textContent = kigou[kIndex];
        seg.appendChild(kLabel);
        
        const arrow = document.createElement('div');
        arrow.className = 'kigou-arrow';
        arrow.textContent = '⬆';
        seg.appendChild(arrow);
      }
      numLine3.appendChild(seg);
    }
  }
  initNumLine();

  document.getElementById('btn-check3').addEventListener('click', () => {
    const na = document.getElementById('q3-num-a').value;
    const da = document.getElementById('q3-den-a').value;
    const ni = document.getElementById('q3-num-i').value;
    const di = document.getElementById('q3-den-i').value;
    const nu = document.getElementById('q3-num-u').value;
    const du = document.getElementById('q3-den-u').value;
    const ne = document.getElementById('q3-num-e').value;
    const de = document.getElementById('q3-den-e').value;
    const res3 = document.getElementById('result3');

    const isA = (na === "1" && da === "7");
    const isI = (ni === "3" && di === "7");
    const isU = (nu === "6" && du === "7");
    const isE = (ne === "8" && de === "7");

    if (isA && isI && isU && isE) {
      res3.textContent = "全問せいかい！ 1より大きい分数も読めたね！";
      res3.className = "result-message correct text-right";
    } else {
      res3.textContent = "おしい！ 0と1の間が何等分されているか、めもりを数えよう。";
      res3.className = "result-message wrong text-right";
    }
  });

  // ====================================================
  // 問題4：計算
  // ====================================================
  document.getElementById('btn-check4').addEventListener('click', () => {
    const n1 = document.getElementById('q4-num1').value; const d1 = document.getElementById('q4-den1').value;
    const n2 = document.getElementById('q4-num2').value; const d2 = document.getElementById('q4-den2').value;
    const n3 = document.getElementById('q4-num3').value; const d3 = document.getElementById('q4-den3').value; const i3 = document.getElementById('q4-int3').value;
    const n4 = document.getElementById('q4-num4').value; const d4 = document.getElementById('q4-den4').value;
    const n5 = document.getElementById('q4-num5').value; const d5 = document.getElementById('q4-den5').value;
    const n6 = document.getElementById('q4-num6').value; const d6 = document.getElementById('q4-den6').value;
    const res4 = document.getElementById('result4');

    const c1 = (n1 === "5" && d1 === "6");
    const c2 = (n2 === "7" && d2 === "9");
    const c3 = (n3 === "5" && d3 === "5" && i3 === "1");
    const c4 = (n4 === "2" && d4 === "4");
    const c5 = (n5 === "6" && d5 === "10");
    const c6 = (n6 === "4" && d6 === "7");

    if (c1 && c2 && c3 && c4 && c5 && c6) {
      res4.textContent = "ばっちり！ すべての計算ができました！ 学習のしあげ、かんぺきだね！";
      res4.className = "result-message correct text-center";
    } else {
      res4.textContent = "おしい！ 計算まちがいがないか、もう一度たしかめよう。";
      res4.className = "result-message wrong text-center";
    }
  });

});