let allData = [];
// 絞り込み後のデータを保持する変数（エクセル出力で使用）
let currentFilteredData = []; 

document.getElementById('file-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById('file-name-display').textContent = `読み込み中: ${file.name}`;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, {header: 1, defval: ""});
    
    document.getElementById('file-name-display').textContent = `完了: ${file.name}`;
    parseData(json);
  };
  reader.readAsArrayBuffer(file);
});

function parseData(rows) {
  if (rows.length < 2) {
    alert('データが正しく読み込めませんでした。');
    return;
  }
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  allData = [];

  let classCols = [];
  let attCols = [];
  let nameCols = [];
  
  let participationIdx = -1;
  let relationshipIdx = -1;
  let kanaNameIdx = -1;
  let courseIdx = -1;
  let noteIdx = -1;

  headers.forEach((h, i) => {
    const text = String(h || "").trim();
    if (text.includes('点数') || text.includes('フィードバック')) return;

    if (text.includes('学年とクラスを選んでください') || text.includes('学年組')) classCols.push(i);
    if (text.includes('出席番号')) attCols.push(i);
    if (text.includes('お子様の名前を入力してください')) nameCols.push(i);

    if (text.includes('参加の可否')) participationIdx = i;
    if (text.includes('続柄')) relationshipIdx = i;
    if (text.includes('ひらがな')) kanaNameIdx = i;
    if (text.includes('コース') || text.includes('下校')) courseIdx = i;
    if (text.includes('連絡事項') || text.includes('その他')) noteIdx = i;
  });

  const siblingCount = Math.min(classCols.length, attCols.length, nameCols.length);
  const siblingColumns = [];
  for (let i = 0; i < siblingCount; i++) {
    siblingColumns.push({ cIdx: classCols[i], aIdx: attCols[i], nIdx: nameCols[i] });
  }

  dataRows.forEach(row => {
    if (!row.some(cell => cell)) return;

    let pVal = participationIdx !== -1 ? String(row[participationIdx] || "").trim() : "未回答";
    let rVal = relationshipIdx !== -1 ? String(row[relationshipIdx] || "").trim() : "-";
    let kVal = kanaNameIdx !== -1 ? String(row[kanaNameIdx] || "").trim() : "-";
    let cRoute = courseIdx !== -1 ? String(row[courseIdx] || "").trim() : "指定なし";
    let nVal = noteIdx !== -1 ? String(row[noteIdx] || "").trim() : "なし";

    siblingColumns.forEach(sib => {
      let className = String(row[sib.cIdx] || "").trim();
      let attNo = String(row[sib.aIdx] || "").trim();
      let childName = String(row[sib.nIdx] || "").trim();

      if (className && childName) {
        allData.push({
          className: className,
          attendanceNo: attNo || "-",
          childName: childName,
          participation: pVal,
          relationship: rVal,
          kanaName: kVal,
          course: cRoute || "※記載なし",
          note: nVal || "なし"
        });
      }
    });
  });

  allData.sort((a, b) => {
    const classCompare = a.className.localeCompare(b.className, 'ja', { numeric: true });
    if (classCompare !== 0) return classCompare;
    
    const getNum = (str) => {
      const hankaku = str.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
      const match = hankaku.match(/\d+/);
      return match ? parseInt(match[0], 10) : 999;
    };
    return getNum(a.attendanceNo) - getNum(b.attendanceNo);
  });

  document.getElementById('controls').style.display = 'flex';
  document.getElementById('result-table').style.display = 'table';
  renderTable(''); // 最初は全件表示
}

const searchInput = document.getElementById('search-input');
const tbody = document.getElementById('table-body');
const countSpan = document.getElementById('count');

searchInput.addEventListener('input', (e) => {
  renderTable(e.target.value);
});

function renderTable(filterText) {
  tbody.innerHTML = '';
  
  // 絞り込んだ結果を global 変数（currentFilteredData）に保存する
  currentFilteredData = allData.filter(d => {
    if (!filterText) return true;
    const txt = filterText.toLowerCase();
    return d.className.toLowerCase().includes(txt) || 
           d.childName.toLowerCase().includes(txt) ||
           d.attendanceNo.toLowerCase().includes(txt) ||
           d.course.toLowerCase().includes(txt) ||
           d.kanaName.toLowerCase().includes(txt);
  });

  countSpan.textContent = currentFilteredData.length;

  currentFilteredData.forEach(d => {
    const tr = document.createElement('tr');
    
    let badgeClass = 'bg-unknown';
    if (d.participation.includes('参加します') || d.participation.includes('可') || d.participation === 'はい') {
      badgeClass = 'bg-yes';
    } else if (d.participation.includes('参加しません') || d.participation.includes('否') || d.participation.includes('いいえ')) {
      badgeClass = 'bg-no';
    }

    if (badgeClass === 'bg-no') tr.style.opacity = '0.6';

    tr.innerHTML = `
      <td>${escapeHTML(d.className)}</td>
      <td>${escapeHTML(d.attendanceNo)}番</td>
      <td>${escapeHTML(d.childName)}</td>
      <td><span class="badge ${badgeClass}">${escapeHTML(d.participation)}</span></td>
      <td>${escapeHTML(d.relationship)}</td>
      <td>${escapeHTML(d.kanaName)}</td>
      <td class="text-wrap">${escapeHTML(d.course)}</td>
      <td class="text-wrap">${escapeHTML(d.note)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 【改良】表示中のデータのみExcel出力処理
document.getElementById('download-btn').addEventListener('click', () => {
  if (currentFilteredData.length === 0) {
    alert("出力するデータがありません。");
    return;
  }
  
  const exportData = [
    ["学年・クラス", "出席番号", "児童氏名", "引き渡し訓練参加可否", "引き取り者の続柄", "引き取り者氏名（ひらがな）", "集団下校コース", "その他連絡事項等"]
  ];
  
  // 全件(allData)ではなく、画面に表示されている絞り込みデータ(currentFilteredData)を使用
  currentFilteredData.forEach(d => {
    exportData.push([
      d.className,
      d.attendanceNo ? d.attendanceNo + "番" : "-",
      d.childName,
      d.participation,
      d.relationship,
      d.kanaName,
      d.course,
      d.note
    ]);
  });
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  
  ws['!cols'] = [
    { wch: 15 }, { wch: 10 }, { wch: 18 }, { wch: 22 }, 
    { wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 40 }
  ];

  // シート名とファイル名を検索キーワードに応じて変更する
  const keyword = searchInput.value.trim();
  const sheetName = keyword ? keyword.substring(0, 30) : "全体名簿";
  const fileName = keyword ? `引き渡し訓練_名簿(${keyword}).xlsx` : "引き渡し訓練_全校名簿.xlsx";

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
});

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}