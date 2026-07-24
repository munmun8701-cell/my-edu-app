let excelData = [];
let classList = [];
let questionHeaders = []; // エクセルから動的に取得する質問リスト

// 全角数字（１、２など）を半角（1, 2）に変換する関数
function toHalfWidth(str) {
    if (str == null) return '';
    return String(str).replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

// ファイル読み込み処理
document.getElementById('excel-file').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    // Excelファイルを読み込む
    const workbook = XLSX.read(data, {type: 'array'});
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // JSONデータに変換（空欄は空文字にする）
    const rawData = XLSX.utils.sheet_to_json(worksheet, {defval: ""});
    
    if(rawData.length === 0) {
        alert("データが見つかりません。エクセルの中身を確認してください。");
        return;
    }

    // 1行目の項目名（ヘッダー）を取得
    const headers = Object.keys(rawData[0]);
    
    // アップロードいただいたファイルの列名に合わせて設定
    const gradeCol = "学年を選択してください。";
    const classCol = "クラスを選択してください。";
    const numberCol = "出席番号を選択してください。";
    
    // 質問項目の抽出（学年・クラス・出席番号以外の列を質問として扱う）
    questionHeaders = headers.filter(h => h !== gradeCol && h !== classCol && h !== numberCol);

    const classSet = new Set();
    
    // データ整形
    excelData = rawData.map(row => {
        // 学年とクラスを結合 (例: "3" + "年" + "3" + "組")
        const grade = toHalfWidth(row[gradeCol] || '');
        const cls = toHalfWidth(row[classCol] || '');
        const className = (grade && cls) ? `${grade}年${cls}組` : '不明';
        
        if (className !== '不明') {
            classSet.add(className);
        }
        
        // 新しいオブジェクトに整形
        const formattedRow = { 'クラス名': className };
        questionHeaders.forEach(q => {
            // 回答を半角数字に変換してから数値として保存
            const answer = toHalfWidth(row[q]);
            formattedRow[q] = parseInt(answer, 10);
        });
        return formattedRow;
    });

    // プルダウンの更新
    classList = Array.from(classSet).sort();
    const select = document.getElementById('class-select');
    select.innerHTML = '';
    classList.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
    });
    
    alert("エクセルファイルの読み込みが完了しました。対象クラスを選択して「集計を実行する」を押してください。");
  };
  
  // ファイルをArrayBufferとして読み込む
  reader.readAsArrayBuffer(file);
});

// 集計ボタン処理
document.getElementById('calc-btn').addEventListener('click', function() {
  if (excelData.length === 0) {
      alert('エクセルファイルを読み込んでください。');
      return;
  }
  
  const targetClass = document.getElementById('class-select').value;
  if (!targetClass) return;

  generateTable(targetClass);
});

// 表生成処理
function generateTable(targetClass) {
  const classData = excelData.filter(row => row['クラス名'] === targetClass);
  const totalData = excelData.filter(row => row['クラス名'] !== '不明'); // 全体のデータ

  let html = `<table>
      <thead>
          <tr>
              <th rowspan="2"></th>
              <th>１</th>
              <th>２</th>
              <th>３</th>
              <th>４</th>
              <th colspan="2">１＋２</th>
          </tr>
          <tr>
              <th class="header-small">あてはまる</th>
              <th class="header-small">どちらかといえば<br>あてはまる</th>
              <th class="header-small">どちらかといえば<br>あてはまらない</th>
              <th class="header-small">あてはまらない</th>
              <th class="header-small">${targetClass}<br>（％）</th>
              <th class="header-small">全体<br>（％）</th>
          </tr>
      </thead>
      <tbody>`;

  questionHeaders.forEach((q, index) => {
      // 対象クラスのカウント
      let c1=0, c2=0, c3=0, c4=0;
      classData.forEach(row => {
          if(row[q] === 1) c1++;
          if(row[q] === 2) c2++;
          if(row[q] === 3) c3++;
          if(row[q] === 4) c4++;
      });
      
      const classTotal = c1 + c2 + c3 + c4;
      let classPct = 0;
      if(classTotal > 0) {
          classPct = ((c1 + c2) / classTotal) * 100;
      }

      // 学年全体のカウント
      let t1=0, t2=0, t3=0, t4=0;
      totalData.forEach(row => {
          if(row[q] === 1) t1++;
          if(row[q] === 2) t2++;
          if(row[q] === 3) t3++;
          if(row[q] === 4) t4++;
      });
      const totalTotal = t1 + t2 + t3 + t4;
      let totalPct = 0;
      if(totalTotal > 0) {
          totalPct = ((t1 + t2) / totalTotal) * 100;
      }

      html += `<tr>
          <td class="question-col">${index + 1}. ${q}</td>
          <td>${c1 || ''}</td>
          <td>${c2 || ''}</td>
          <td>${c3 || ''}</td>
          <td>${c4 || ''}</td>
          <td>${classTotal > 0 ? classPct.toFixed(1) : ''}</td>
          <td>${totalTotal > 0 ? totalPct.toFixed(1) : ''}</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById('table-container').innerHTML = html;
}