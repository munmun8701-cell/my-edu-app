document.addEventListener("DOMContentLoaded", () => {
  
  // ----------------------------------------------------
  // 入力文字の正規化（全角を半角に、演算子を統一）
  // ----------------------------------------------------
  function toHalfWidthMath(str) {
    return str.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  // 式の判定用に空白や記号をきれいにする関数
  function cleanEquation(str) {
    let cleanStr = toHalfWidthMath(str);
    return cleanStr.replace(/\s+/g, '')       // 空白を削除
                   .replace(/[＋]/g, '+')     // プラスを半角に
                   .replace(/[ー−]/g, '-')    // マイナスを半角に
                   .replace(/[×ｘxX＊]/g, '*') // かけるをアスタリスクに統一
                   .replace(/[＝]/g, '=')     // イコールを半角に
                   .replace(/[口〇◯]/g, '□'); // 似た記号を□に統一
  }

  // 数値入力欄の制限
  document.querySelectorAll('.num-input').forEach(input => {
    input.addEventListener('input', function() {
      this.value = toHalfWidthMath(this.value).replace(/[^0-9]/g, '');
    });
  });

  // □挿入ボタンの動作
  document.querySelectorAll('.insert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      targetInput.value += '□';
      targetInput.focus();
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
  // タブ1：たしかめよう（4問）の答え合わせ
  // ====================================================
  const btnCheck1 = document.getElementById('btn-check1');
  const result1 = document.getElementById('result1');

  btnCheck1.addEventListener('click', () => {
    let allCorrect = true;

    // Q1: 色紙 45+□=62
    const eq1 = cleanEquation(document.getElementById('q1-eq').value);
    const ans1 = document.getElementById('q1-ans').value;
    if (!(eq1 === '45+□=62' || eq1 === '□+45=62') || ans1 !== '17') allCorrect = false;

    // Q2: あめ 8×□=48
    const eq2 = cleanEquation(document.getElementById('q2-eq').value);
    const ans2 = document.getElementById('q2-ans').value;
    if (!(eq2 === '8*□=48' || eq2 === '□*8=48') || ans2 !== '6') allCorrect = false;

    // Q3: おつり 500-□=180
    const eq3 = cleanEquation(document.getElementById('q3-eq').value);
    const ans3 = document.getElementById('q3-ans').value;
    if (!(eq3 === '500-□=180') || ans3 !== '320') allCorrect = false;

    // Q4: 公園 □-12=18
    const eq4 = cleanEquation(document.getElementById('q4-eq').value);
    const ans4 = document.getElementById('q4-ans').value;
    if (!(eq4 === '□-12=18') || ans4 !== '30') allCorrect = false;

    if (allCorrect) {
      result1.textContent = "ぜんぶ大せいかい！ ばっちりだね！";
      result1.className = "result-message correct";
    } else {
      result1.innerHTML = "おしい！ 式や計算がまちがっているところがあるよ。<br><span style='font-size:1rem;font-weight:normal;'>※式には「＋」や「＝」の記号もわすれずに入れよう。</span>";
      result1.className = "result-message wrong";
    }
  });

  // ====================================================
  // タブ2：算数の目の答え合わせ
  // ====================================================
  const btnCheck2 = document.getElementById('btn-check2');
  const result2 = document.getElementById('result2');
  const koutaMsg = document.getElementById('kouta-message');

  btnCheck2.addEventListener('click', () => {
    const eq5 = cleanEquation(document.getElementById('q5-eq').value);
    const ans5 = document.getElementById('q5-ans').value;

    // Q5: 学級文庫 □+15=40
    if ((eq5 === '□+15=40' || eq5 === '15+□=40') && ans5 === '25') {
      result2.textContent = "大せいかい！ わからない数を□にして式にできたね！";
      result2.className = "result-message correct";
      koutaMsg.style.display = 'flex'; // こうたのアドバイスを表示
    } else {
      result2.textContent = "おしい！ 「はじめにあった数」を□にして式を書いてみよう。";
      result2.className = "result-message wrong";
      koutaMsg.style.display = 'none';
    }
  });

});