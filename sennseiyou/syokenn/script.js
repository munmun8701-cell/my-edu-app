// ====== アプリケーションの状態管理 ======
let episodes = [];
const LOCAL_STORAGE_KEY = 'school_episodes_data_v3'; // キーを更新してリフレッシュ
const SUBJECT_DATA_KEY = 'school_subjects_data';

// 教科と単元の初期データ
let subjectUnitData = {
  "国語": ["ローマ字", "物語文", "説明文"],
  "算数": ["かけ算", "わり算", "大きな数", "あまりのあるわり算"],
  "理科": ["昆虫と植物", "太陽と影"],
  "社会": ["わたしたちのまち", "地図記号", "店ではたらく人"],
  "生活": ["町たんけん", "生き物"],
  "図画工作": ["絵画", "工作"],
  "音楽": ["歌唱", "器楽"],
  "体育": ["器械運動", "走・跳の運動"],
  "道徳": ["共通"],
  "総合的な学習": ["共通"],
  "その他": ["共通"]
};

// ====== DOM要素の取得 ======
const editIdInput = document.getElementById('edit-id');
const nameInput = document.getElementById('student-name');
const subjectSelect = document.getElementById('subject');
const unitSelect = document.getElementById('unit');
const newUnitInput = document.getElementById('new-unit-name');
const addUnitBtn = document.getElementById('add-unit-btn');
const tagInput = document.getElementById('tag');
const dateInput = document.getElementById('date');
const contentInput = document.getElementById('content');
const charCount = document.getElementById('char-count');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const tableBody = document.getElementById('table-body');
const toastEl = document.getElementById('toast');

// 検索フィルター
const searchName = document.getElementById('search-name');
const searchSubject = document.getElementById('search-subject');
const searchTag = document.getElementById('search-tag');
const searchKeyword = document.getElementById('search-keyword');

// ====== 初期化 ======
document.addEventListener('DOMContentLoaded', () => {
  dateInput.value = new Date().toISOString().split('T')[0];
  loadData();
  initSubjectData();
  renderTable();
  setupEventListeners();
});

function initSubjectData() {
  const savedSubjects = localStorage.getItem(SUBJECT_DATA_KEY);
  if (savedSubjects) {
    try {
      subjectUnitData = JSON.parse(savedSubjects);
    } catch (e) {
      console.error("教科データの読み込みに失敗しました");
    }
  }
  updateSubjectDropdowns();
}

function updateSubjectDropdowns() {
  const currentSubject = subjectSelect.value;
  subjectSelect.innerHTML = '';
  searchSubject.innerHTML = '<option value="">すべての教科</option>';
  
  Object.keys(subjectUnitData).forEach(subject => {
    subjectSelect.add(new Option(subject, subject));
    searchSubject.add(new Option(subject, subject));
  });

  if (currentSubject && subjectUnitData[currentSubject]) {
    subjectSelect.value = currentSubject;
  }
  updateUnitDropdown();
}

function updateUnitDropdown(selectedUnit = '') {
  const subject = subjectSelect.value;
  unitSelect.innerHTML = '';
  
  if (subject && subjectUnitData[subject]) {
    subjectUnitData[subject].forEach(unit => {
      unitSelect.add(new Option(unit, unit));
    });
  }
  
  if (selectedUnit) {
    unitSelect.value = selectedUnit;
  }
}

// ====== イベントリスナーの設定 ======
function setupEventListeners() {
  contentInput.addEventListener('input', () => {
    charCount.textContent = `文字数: ${contentInput.value.length} 文字`;
  });

  document.querySelectorAll('.phrase-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const phrase = e.target.getAttribute('data-text');
      const start = contentInput.selectionStart;
      const end = contentInput.selectionEnd;
      const text = contentInput.value;
      contentInput.value = text.slice(0, start) + phrase + text.slice(end);
      contentInput.focus();
      contentInput.selectionStart = contentInput.selectionEnd = start + phrase.length;
      contentInput.dispatchEvent(new Event('input'));
    });
  });

  subjectSelect.addEventListener('change', () => updateUnitDropdown());

  addUnitBtn.addEventListener('click', () => {
    const newUnit = newUnitInput.value.trim();
    const currentSubject = subjectSelect.value;
    
    if (!newUnit) {
      alert("追加する単元名を入力してください。");
      return;
    }
    if (!subjectUnitData[currentSubject].includes(newUnit)) {
      subjectUnitData[currentSubject].push(newUnit);
      localStorage.setItem(SUBJECT_DATA_KEY, JSON.stringify(subjectUnitData));
      updateUnitDropdown(newUnit);
      newUnitInput.value = '';
      showToast(`「${newUnit}」を追加しました`);
    } else {
      alert("その単元は既に存在します。");
    }
  });

  // 保存ボタンの処理（リロード防止のためクリックイベントに変更）
  saveBtn.addEventListener('click', () => {
    if (!nameInput.value.trim() || !contentInput.value.trim()) {
      alert("「児童名」と「エピソード本文」は必須入力です。");
      return;
    }
    saveEpisode();
  });

  // クリアボタンの処理（全クリア）
  clearBtn.addEventListener('click', () => {
    resetForm(true);
  });

  searchName.addEventListener('input', renderTable);
  searchSubject.addEventListener('change', renderTable);
  searchTag.addEventListener('change', renderTable);
  searchKeyword.addEventListener('input', renderTable);

  document.getElementById('export-btn').addEventListener('click', exportCSV);
}

// ====== データ操作 ======
function loadData() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      episodes = JSON.parse(saved);
    } catch (e) {
      episodes = [];
    }
  }
}

function saveData() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(episodes));
    return true;
  } catch (e) {
    alert("保存に失敗しました。");
    return false;
  }
}

function saveEpisode() {
  const id = editIdInput.value;
  const newEpisode = {
    id: id ? id : Date.now().toString(),
    name: nameInput.value.trim(),
    subject: subjectSelect.value,
    unit: unitSelect.value,
    tag: tagInput.value,
    date: dateInput.value,
    content: contentInput.value.trim(),
    createdAt: new Date().toISOString()
  };

  if (id) {
    const index = episodes.findIndex(e => e.id === id);
    if (index > -1) episodes[index] = newEpisode;
  } else {
    episodes.push(newEpisode);
  }

  if(saveData()) {
    showToast(id ? "データを更新しました" : "記録を保存しました");
    // 保存後は連続入力しやすいように「部分クリア」にする
    resetForm(false);
    renderTable();
  }
}

function deleteEpisode(id) {
  if (confirm('本当にこのエピソードを削除しますか？')) {
    episodes = episodes.filter(e => e.id !== id);
    saveData();
    renderTable();
    showToast("削除しました");
    if (editIdInput.value === id) resetForm(true);
  }
}

function editEpisode(id) {
  const ep = episodes.find(e => e.id === id);
  if (!ep) return;

  editIdInput.value = ep.id;
  nameInput.value = ep.name;
  subjectSelect.value = ep.subject || "国語";
  updateUnitDropdown(ep.unit);
  tagInput.value = ep.tag;
  dateInput.value = ep.date;
  contentInput.value = ep.content;
  
  saveBtn.textContent = '🔄 更新する';
  contentInput.dispatchEvent(new Event('input'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// フォームのリセット処理（isFullClearがfalseの場合は連続入力モード）
function resetForm(isFullClear = true) {
  editIdInput.value = '';
  nameInput.value = '';
  contentInput.value = '';
  newUnitInput.value = '';
  
  if (isFullClear) {
    // 手動の「クリア」ボタンを押したときは日付等もリセット
    dateInput.value = new Date().toISOString().split('T')[0];
    tagInput.value = '主体性';
  }
  // ※ false（保存後）の場合は、教科・単元・日付はそのまま残す
  
  saveBtn.textContent = '💾 保存する';
  contentInput.dispatchEvent(new Event('input'));
  
  // 次の児童名にすぐ入力できるようカーソルを合わせる
  nameInput.focus();
}

// ====== 描画 ======
function renderTable() {
  const filterName = searchName.value.toLowerCase();
  const filterSubject = searchSubject.value;
  const filterTag = searchTag.value;
  const filterKeyword = searchKeyword.value.toLowerCase();

  tableBody.innerHTML = '';

  const sortedEpisodes = [...episodes].sort((a, b) => b.date.localeCompare(a.date));

  sortedEpisodes.forEach(ep => {
    const subject = ep.subject || "-";
    const unit = ep.unit || "-";

    if (filterName && !ep.name.toLowerCase().includes(filterName)) return;
    if (filterSubject && subject !== filterSubject) return;
    if (filterTag && ep.tag !== filterTag) return;
    if (filterKeyword && !ep.content.toLowerCase().includes(filterKeyword)) return;

    const summary = ep.content.length > 25 ? ep.content.substring(0, 25) + '...' : ep.content;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ep.date}</td>
      <td><strong>${ep.name}</strong></td>
      <td>
        <span class="badge-subject">${subject} : ${unit}</span><br>
        <span class="badge-tag">${ep.tag}</span>
      </td>
      <td title="${ep.content}">${summary}</td>
      <td class="action-links">
        <button class="edit-link" onclick="editEpisode('${ep.id}')">編集</button>
        <button class="delete-link" onclick="deleteEpisode('${ep.id}')">削除</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// ====== CSVエクスポート ======
function exportCSV() {
  if (episodes.length === 0) {
    alert("出力するデータがありません。");
    return;
  }
  let csvContent = '\uFEFF'; 
  csvContent += "記録日,児童名,教科,単元,評価観点・タグ,エピソード本文\n";

  const sorted = [...episodes].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach(ep => {
    let content = ep.content.replace(/"/g, '""'); 
    const subject = ep.subject || "";
    const unit = ep.unit || "";
    csvContent += `${ep.date},"${ep.name}","${subject}","${unit}","${ep.tag}","${content}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  link.setAttribute("href", url);
  link.setAttribute("download", `エピソードバックアップ_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("CSVを出力しました");
}