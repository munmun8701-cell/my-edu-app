document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // ミッション1: 計器の選択判定ロジック
  // ==========================================
  const correctAnswers = { 1: '30cm', 2: 'makijaku', 3: 'makijaku' };
  const feedbackMessages = {
    1: {
      '30cm': "✨ 大正解！ 短いものは 30cmものさしが はかりやすいね。",
      '1m': "🤔 はかれるけれど、ものさしが 長すぎて あつかいにくいかも？",
      'makijaku': "🤔 まきじゃくでも はかれるけれど、0のメモリを 合わせるのが 少しむずかしいよ。"
    },
    2: {
      '30cm': "💦 何回も つぎたして はかることになって、大変だね！",
      '1m': "🤔 はかれるけれど、ろうかは とっても長いから 何回も つぎたすよ。",
      'makijaku': "✨ 大正解！ 長いものを はかるときは「まきじゃく」が ピッタリだね！"
    },
    3: {
      '30cm': "💦 まっすぐな ものさしでは、まるいものは はかれないよ！",
      '1m': "💦 まっすぐな 1mものさしは、まげることが できないよ！",
      'makijaku': "✨ 大正解！ まきじゃくは まがるから、まるいものも はかれるんだね！"
    }
  };

  const toolBtns = document.querySelectorAll('.tool-btn');
  toolBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const qNum = e.target.getAttribute('data-q');
      const selectedTool = e.target.getAttribute('data-tool');
      
      // 同じ問題のボタンをリセット
      document.querySelectorAll(`#q${qNum}-btns .tool-btn`).forEach(b => {
        b.classList.remove('active-correct', 'active-wrong');
      });

      const fbBox = document.getElementById(`fb-${qNum}`);
      fbBox.classList.remove('hidden', 'fb-success', 'fb-error');

      // 正解・不正解の判定
      if (selectedTool === correctAnswers[qNum]) {
        e.target.classList.add('active-correct');
        fbBox.classList.add('fb-success');
      } else {
        e.target.classList.add('active-wrong');
        fbBox.classList.add('fb-error');
      }
      fbBox.textContent = feedbackMessages[qNum][selectedTool];
    });
  });

  // ==========================================
  // ミッション2: 測定表の行追加
  // ==========================================
  const addRowBtn = document.getElementById('add-row-btn');
  const tableBody = document.getElementById('table-body');

  addRowBtn.addEventListener('click', () => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="text" class="input-text" placeholder="はかるもの"></td>
      <td><input type="text" class="input-text" placeholder="見当（よそう）"></td>
      <td><input type="text" class="input-text" placeholder="はかった 長さ"></td>
      <td>
        <select class="input-select">
          <option value="">えらぶ</option>
          <option value="good">よそうと ピッタリ！</option>
          <option value="far">よそうと ちがった</option>
        </select>
      </td>
    `;
    tableBody.appendChild(newRow);
  });

  // ==========================================
  // エクセル用ファイル（CSV）の作成とダウンロード
  // ==========================================
  const exportBtn = document.getElementById('btn-export');
  
  exportBtn.addEventListener('click', () => {
    const studentName = document.getElementById('student-name').value.trim();
    
    if (!studentName) {
      alert("【おねがい】いちばん上の「なまえ」を いれてから ボタンを おしてね！");
      document.getElementById('student-name').focus();
      return;
    }

    // クイズの回答を取得する関数
    const getQuizAns = (num) => {
      const activeBtn = document.querySelector(`#q${num}-btns .active-correct, #q${num}-btns .active-wrong`);
      return activeBtn ? activeBtn.textContent : "未回答";
    };

    // 表のデータを取得
    let tableData = "";
    const rows = document.querySelectorAll('#table-body tr');
    rows.forEach((row, i) => {
      const inputs = row.querySelectorAll('input');
      const select = row.querySelector('select');
      const item = inputs[0]?.value || '';
      const estimate = inputs[1]?.value || '';
      const actual = inputs[2]?.value || '';
      const reflection = select ? select.options[select.selectedIndex].text : '';
      
      // どれか一つでも入力されていれば記録する
      if (item || estimate || actual) {
        tableData += `[${i+1}]物:${item} 予:${estimate} 実:${actual} 振:${reflection} / `;
      }
    });
    if (!tableData) tableData = "未入力";

    // 振り返りのテキスト
    const finalReflection = document.getElementById('reflection-text').value.trim() || "未入力";

    // エクセルで文字化けしないための設定（BOM付きUTF-8）
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); 
    const header = "なまえ,Q1(えんぴつ),Q2(ろうか),Q3(バケツ),はかったもの(表),ふりかえり\n";
    
    // セル内でカンマや改行があっても崩れないようにする処理
    const escapeStr = (str) => `"${str.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    
    const rowData = [
      escapeStr(studentName),
      escapeStr(getQuizAns(1)),
      escapeStr(getQuizAns(2)),
      escapeStr(getQuizAns(3)),
      escapeStr(tableData),
      escapeStr(finalReflection)
    ].join(",") + "\n";

    // CSVファイルの生成とダウンロード実行
    const blob = new Blob([bom, header + rowData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName}_長さたんけん.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    alert("エクセル用の ファイルが できました！\n先生の いったとおりに ていしゅつ してね🌟");
    exportBtn.innerHTML = "ファイル作成かんりょう！";
    exportBtn.style.backgroundColor = "#10b981";
  });
});