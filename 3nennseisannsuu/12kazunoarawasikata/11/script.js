// --- 状態管理・初期化 ---
let helpOnes = 0;
let helpTenths = 0;

// 正答データ（自動採点用）
// 小数点ボタン(.dot-btn)も true か false で判定します。
const answers = {
  q1_1: "1.8", q1_2: "3.6",
  q2_1: "0.1",
  q2_2_a: "1", q2_2_i: "0.7", q2_2_u: "2.3", q2_2_e: "3.9",
  q2_3_a: "10", q2_3_i: "7", q2_3_u: "23", q2_3_e: "39",
  q3_1: "3.2", q3_2: "3.8", q3_3: "6.4", q3_4: "2.7",
  q4_1: ">", q4_2: ">", q4_3: "<",
  q5_1: "1.5", q5_2: "2", q5_3: "2.9", q5_4: "1.4", q5_5: "0.9", q5_6: "0.5",
  h7_1: "8", h7_2: "4", dot7: true,  // 5.6+2.8=8.4
  h8_1: "8", h8_2: "3", dot8: true,  // 2+6.3=8.3
  h9_1: "4", h9_2: "5", dot9: true,  // 8.2-3.7=4.5
  h10_1: "5", h10_2: "6", dot10: true // 8-2.4=5.6
};

document.addEventListener('DOMContentLoaded', () => {
  setupInputFilters();
  drawRuler();
  drawNumberLine();
  loadData();
});

// --- タブ切り替え ---
function switchTab(tabId) {
  document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// --- 入力制御（自動半角変換） ---
function setupInputFilters() {
  document.querySelectorAll('.ans-in').forEach(input => {
    input.addEventListener('input', (e) => {
      let val = e.target.value;
      // 全角数字・記号を半角へ
      val = val.replace(/[０-９．＜＞]/g, function(s) {
        if(s === '．') return '.';
        if(s === '＜') return '<';
        if(s === '＞') return '>';
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      });
      // 筆算の枠は1文字制限
      if (e.target.classList.contains('h-in')) {
        val = val.replace(/[^0-9]/g, '').substring(0, 1);
      }
      e.target.value = val;
      e.target.classList.remove('correct', 'incorrect');
      saveData();
    });
  });
}

// ★ 小数点を打つギミック ★
function toggleDot(btn) {
  btn.classList.toggle('active');
  btn.classList.remove('correct', 'incorrect');
  saveData();
}

// --- 描画処理 ---
function drawRuler() {
  const ruler = document.getElementById('ruler-cm');
  for (let i = 0; i <= 50; i++) { 
    let tick = document.createElement('div');
    tick.className = `r-tick ${i % 10 === 0 ? 'major' : (i % 5 === 0 ? 'half' : 'minor')}`;
    tick.style.left = `${(i / 50) * 100}%`;
    ruler.appendChild(tick);
    
    if (i % 10 === 0) {
      let label = document.createElement('div');
      label.className = 'r-label'; label.innerText = i / 10;
      label.style.left = `${(i / 50) * 100}%`;
      ruler.appendChild(label);
    }
  }
}

function drawNumberLine() {
  const container = document.getElementById('main-number-line');
  for (let i = 0; i <= 40; i++) { 
    let tick = document.createElement('div');
    tick.className = `nl-tick ${i % 10 === 0 ? 'major' : (i % 5 === 0 ? 'minor' : 'minor')}`;
    tick.style.left = `${(i / 40) * 100}%`;
    if (i % 5 !== 0) tick.style.height = '6px';
    container.appendChild(tick);
    
    if (i % 10 === 0) {
      let label = document.createElement('div');
      label.className = 'nl-label'; label.innerText = i / 10;
      label.style.left = `${(i / 40) * 100}%`;
      container.appendChild(label);
    }
  }
}

// --- おたすけブロックシミュレーター ---
function addHelp(amount) {
  if (amount === 1) helpOnes++;
  if (amount === 0.1) helpTenths++;
  if (helpTenths >= 10) { helpTenths -= 10; helpOnes++; } // 自動まとまり
  updateHelpUI();
}
function resetHelp() { helpOnes = 0; helpTenths = 0; updateHelpUI(); }
function updateHelpUI() {
  const area = document.getElementById('helper-stage');
  area.innerHTML = '';
  let total = Math.round((helpOnes + helpTenths * 0.1) * 10) / 10;
  document.getElementById('help-val').innerText = total.toFixed(1);

  for (let i = 0; i < helpOnes; i++) {
    let b = document.createElement('div'); b.className = 'b-1'; b.innerText = '1'; area.appendChild(b);
  }
  for (let i = 0; i < helpTenths; i++) {
    let b = document.createElement('div'); b.className = 'b-01'; area.appendChild(b);
  }
}

// --- 自動採点機能 ---
function checkAnswers() {
  let allCorrect = true;
  
  for (const [id, correctAns] of Object.entries(answers)) {
    const el = document.getElementById(id);
    if (!el) continue;
    
    // 小数点ボタンの判定
    if (el.classList.contains('dot-btn')) {
      let isCorrect = (el.classList.contains('active') === correctAns);
      if (isCorrect) {
        el.classList.add('correct');
        el.classList.remove('incorrect');
      } else {
        el.classList.add('incorrect');
        el.classList.remove('correct');
        allCorrect = false;
      }
      continue;
    }
    
    // テキスト入力の判定
    const userAns = el.value.trim();
    if (userAns === "") {
      el.classList.remove('correct', 'incorrect');
      allCorrect = false;
      continue;
    }
    
    let isCorrect = false;
    if (correctAns === ">" || correctAns === "<") {
      isCorrect = (userAns === correctAns);
    } else {
      isCorrect = (parseFloat(userAns) === parseFloat(correctAns));
    }

    if (isCorrect) {
      el.classList.add('correct');
      el.classList.remove('incorrect');
    } else {
      el.classList.add('incorrect');
      el.classList.remove('correct');
      allCorrect = false;
    }
  }

  if (allCorrect) {
    alert("🎉 すばらしい！ ぜんぶ大せいかいです！\n小数点の位置も、しっかり考えて打てましたね！");
  } else {
    alert("おしい！ 赤くなったところをもういちど見直してみよう。\n（※ 小数点を打ち忘れているところはないかな？）");
  }
}

// --- ローカルストレージ（自動保存） ---
function saveData() {
  const inputs = {};
  document.querySelectorAll('.ans-in').forEach(el => { inputs[el.id] = el.value; });
  const dots = {};
  document.querySelectorAll('.dot-btn').forEach(el => { dots[el.id] = el.classList.contains('active'); });
  localStorage.setItem('mathApp_finalTest_v2', JSON.stringify({inputs, dots}));
}

function loadData() {
  const saved = localStorage.getItem('mathApp_finalTest_v2');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if(data.inputs) {
        for (const [id, val] of Object.entries(data.inputs)) {
          const el = document.getElementById(id);
          if (el && val) el.value = val;
        }
      }
      if(data.dots) {
        for (const [id, isActive] of Object.entries(data.dots)) {
          const el = document.getElementById(id);
          if (el && isActive) el.classList.add('active');
        }
      }
    } catch (e) { console.warn("Load failed"); }
  }
}