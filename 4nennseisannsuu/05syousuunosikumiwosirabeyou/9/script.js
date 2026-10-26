// 全角から半角への変換辞書
const zenToHan = {
  '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
  '５': '5', '６': '6', '７': '7', '８': '8', '９': '9',
  '．': '.', '。': '.', 'ー': '-'
};

// 入力イベントの監視
document.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT') {
    let val = e.target.value;
    // 全角を半角に変換
    for (let key in zenToHan) {
      val = val.replace(new RegExp(key, 'g'), zenToHan[key]);
    }
    e.target.value = val;
  }
});

// ひっ算の判定
function checkHissan(gridId, nextId) {
  const grid = document.getElementById(gridId);
  const inputs = grid.querySelectorAll('input');
  let isAllCorrect = true;

  inputs.forEach(input => {
    if (input.value === input.getAttribute('data-ans')) {
      input.style.backgroundColor = "#c8e6c9";
    } else {
      input.style.backgroundColor = "#ffcdd2";
      isAllCorrect = false;
    }
  });

  if (isAllCorrect) {
    alert("正解！すばらしいです。");
    document.getElementById(nextId).classList.remove('hidden');
    document.getElementById(nextId).scrollIntoView({ behavior: 'smooth' });
  } else {
    alert("おしい！数字や位を確認してみてね。");
  }
}

// まとめ判定
function checkSummary() {
  const val = document.getElementById('sum-input').value;
  if (val === "小数点" || val === "しょうすうてん") {
    alert("正解！一番大切なルールだね。");
    document.getElementById('step-practice').classList.remove('hidden');
    initPractice();
    document.getElementById('step-practice').scrollIntoView({ behavior: 'smooth' });
  } else {
    alert("何をそろえて書くのが大切だったかな？（ヒント：小○○）");
  }
}

// 練習問題の初期化
const practices = [
  { q: "2.67 - 1.3", a: "1.37" },
  { q: "4.35 - 2.8", a: "1.55" },
  { q: "9.562 - 0.88", a: "8.682" },
  { q: "10.5 - 9.61", a: "0.89" },
  { q: "52.8 - 0.84", a: "51.96" },
  { q: "1.14 - 1.137", a: "0.003" },
  { q: "8 - 3.54", a: "4.46" },
  { q: "7 - 6.38", a: "0.62" },
  { q: "42 - 0.96", a: "41.04" },
  { q: "5 - 0.093", a: "4.907" },
  { q: "1 - 0.097", a: "0.903" }
];

function initPractice() {
  const list = document.getElementById('practice-list');
  list.innerHTML = "";
  practices.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'practice-item';
    div.innerHTML = `
      <span>(${index + 1}) ${item.q}</span>
      <input type="text" placeholder="答え" onchange="checkAns(this, '${item.a}')">
    `;
    list.appendChild(div);
  });
}

function checkAns(el, correct) {
  if (el.value === correct) {
    el.classList.add('correct-anim');
    el.style.borderColor = "var(--primary)";
  } else {
    el.style.borderColor = "var(--accent)";
  }
}

function showHint(id) {
  document.getElementById(id).classList.toggle('hidden');
}