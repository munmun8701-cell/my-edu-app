document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input.box');
  const btnHint = document.getElementById('btn-hint');
  const btnCheck = document.getElementById('btn-check');
  const messageArea = document.getElementById('message-area');
  
  let hintStage = 0;

  // 入力時の自動フォーカス移動（右から左へ、下から上へ）
  inputs.forEach((input) => {
    input.addEventListener('input', function() {
      // 数字以外は削除
      this.value = this.value.replace(/[^0-9]/g, '');
      
      if (this.value.length === 1) {
        // 次の入力欄へ移動するロジック（自由に入力しやすくするため簡易化）
        const nextIds = {
          't1': 'b1', 'b1': 't10', 't10': 'b10', 'b10': 't100',
          't100': 'b100', 'b100': 't1000', 't1000': 'b1000'
        };
        const nextId = nextIds[this.id];
        if (nextId) document.getElementById(nextId).focus();
      }
    });
  });

  function showMessage(text, type) {
    messageArea.textContent = text;
    messageArea.className = `message-area msg-${type}`;
  }

  // ヒント機能（段階的に詳しいヒントを出す）
  btnHint.addEventListener('click', () => {
    hintStage++;
    let hintText = "";
    
    if (hintStage === 1) {
      hintText = "【ヒント①】\n一の位（いちばん右のたて）の 2つの数をたして「10」になるようにしよう！\n（例：3 と 7）";
    } else if (hintStage === 2) {
      hintText = "【ヒント②】\n十の位と百の位は、右から「1」くり上がってくるよ。\nだから、2つの数をたして「9」になるようにしよう！";
    } else {
      hintText = "【ヒント③】\n・一の位は たして「10」\n・十と百の位は たして「9」\n・千の位は たして「8」\nになるように 数字を入れてみてね！";
      hintStage = 0; // ループさせる
    }
    
    showMessage(hintText, 'hint');
  });

  // 答え合わせ機能
  btnCheck.addEventListener('click', () => {
    // 値の取得
    const getVal = (id) => parseInt(document.getElementById(id).value, 10);
    
    // 空欄チェック
    let isComplete = true;
    inputs.forEach(input => {
      if (input.value === '') isComplete = false;
    });

    if (!isComplete) {
      showMessage("空いている 四角（□）があるよ。ぜんぶのマスに 数字を入れてね！", "error");
      return;
    }

    const t1000 = getVal('t1000'), t100 = getVal('t100'), t10 = getVal('t10'), t1 = getVal('t1');
    const b1000 = getVal('b1000'), b100 = getVal('b100'), b10 = getVal('b10'), b1 = getVal('b1');

    const topNumber = t1000 * 1000 + t100 * 100 + t10 * 10 + t1;
    const bottomNumber = b1000 * 1000 + b100 * 100 + b10 * 10 + b1;
    const sum = topNumber + bottomNumber;

    if (sum === 9000) {
      // 全て正解のときの特別な判定（千の位が0にならないように一応チェック）
      if (t1000 === 0 && b1000 === 0) {
        showMessage("おしい！ 一番上の位が 0 にならないように してみよう。", "error");
      } else {
        showMessage(`だいせいかい！🎉\n${topNumber} ＋ ${bottomNumber} ＝ 9000\nバッチリ くり上がりの 計算が できているね！`, "success");
      }
    } else {
      // どこが間違っているかの具体的なフィードバック
      if (t1 + b1 !== 10) {
        showMessage("おしい！ 一の位（いちばん右）の 2つの数をたして「10」になるか かくにんしよう。", "error");
      } else if (t10 + b10 !== 9) {
        showMessage("十の位が ちがうみたい。一の位からの くり上がり「1」をわすれていないかな？", "error");
      } else if (t100 + b100 !== 9) {
        showMessage("百の位が ちがうみたい。十の位からの くり上がり「1」をわすれていないかな？", "error");
      } else if (t1000 + b1000 !== 8) {
        showMessage("千の位が ちがうみたい。百の位からの くり上がり「1」をいれて 計算してみよう。", "error");
      } else {
        showMessage(`おしい！ 今の答えは ${sum} だよ。どこがちがうか 見直してみよう。`, "error");
      }
    }
  });
});