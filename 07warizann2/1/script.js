const problems = [
  { // 導入問題（教科書p.82-83）
    text: 'ゼリーが <ruby>14<rt>じゅうよん</rt></ruby>こ あります。<ruby>1<rt>ひと</rt></ruby>人に <ruby>3<rt>さん</rt></ruby>こずつ 分けると、<ruby>何<rt>なん</rt></ruby>人に 分けられますか。',
    dividend: 14, divisor: 3, itemIcon: '🍮', groupLabel: '人',
    hint: 'わる数「3」の だんの 九九を つかおう！<br>3 × 4 ＝ 12<br>3 × 5 ＝ 15（14をこえちゃうね）',
    isDivisible: false
  },
  { // 適応問題① 27÷4
    text: '<ruby>27<rt>にじゅうなな</rt></ruby>この りんごがあります。<br><ruby>1<rt>ひと</rt></ruby>つの はこに <ruby>4<rt>よん</rt></ruby>こずつ 入れると、はこは いくつ できて、<ruby>何<rt>なん</rt></ruby>こ あまりますか。',
    dividend: 27, divisor: 4, itemIcon: '🍎', groupLabel: 'はこ',
    hint: 'わる数「4」の だんの 九九を つかおう！<br>こたえが 27に いちばん ちかくなるのは 4 × 〇？',
    isDivisible: false
  },
  { // 適応問題② 56÷7
    text: 'クッキーが <ruby>56<rt>ごじゅうろく</rt></ruby>まい あります。<br><ruby>1<rt>ひと</rt></ruby>つの ふくろに <ruby>7<rt>なな</rt></ruby>まいずつ 入れると、ふくろは いくつ できますか。',
    dividend: 56, divisor: 7, itemIcon: '🍪', groupLabel: 'ふくろ',
    hint: 'わる数「7」の だんの 九九を つかおう！<br>7 × 〇 ＝ 56 になるかな？',
    isDivisible: true
  },
  { // 適応問題③ 25÷5
    text: 'あめが <ruby>25<rt>にじゅうご</rt></ruby>こ あります。<br><ruby>1<rt>ひと</rt></ruby>人に <ruby>5<rt>ご</rt></ruby>こずつ 分けると、<ruby>何<rt>なん</rt></ruby>人に 分けられますか。',
    dividend: 25, divisor: 5, itemIcon: '🍬', groupLabel: '人',
    hint: 'わる数「5」の だんの 九九を つかおう！',
    isDivisible: true
  },
  { // 適応問題④ 43÷6
    text: 'えんぴつが <ruby>43<rt>よんじゅうさん</rt></ruby><ruby>本<rt>ほん</rt></ruby> あります。<br><ruby>6<rt>ろく</rt></ruby><ruby>本<rt>ほん</rt></ruby>ずつ たばに すると、たばは いくつ できて、<ruby>何<rt>なん</rt></ruby><ruby>本<rt>ほん</rt></ruby> あまりますか。',
    dividend: 43, divisor: 6, itemIcon: '✏️', groupLabel: 'たば',
    hint: 'わる数「6」の だんの 九九を つかおう！<br>43を こえないように 気をつけてね。',
    isDivisible: false
  }
];

let currentIndex = 0;

const D = document;
const els = {
  progress: D.getElementById('progress-text'),
  question: D.getElementById('question-box'),
  hintBox: D.getElementById('hint-box'),
  hintText: D.getElementById('hint-text'),
  poolArea: D.getElementById('pool-area'),
  groupsArea: D.getElementById('groups-area'),
  poolLabel: D.getElementById('pool-label'),
  eqDividend: D.getElementById('eq-dividend'),
  eqDivisor: D.getElementById('eq-divisor'),
  ansQuotient: D.getElementById('ans-quotient'),
  ansRemainder: D.getElementById('ans-remainder'),
  msg: D.getElementById('message'),
  checkBtn: D.getElementById('check-btn'),
  nextBtn: D.getElementById('next-btn'),
  resetBtn: D.getElementById('reset-btn'),
  hintBtn: D.getElementById('hint-btn')
};

function loadProblem() {
  const p = problems[currentIndex];
  els.progress.textContent = `もんだい ${currentIndex + 1} / ${problems.length}`;
  els.question.innerHTML = p.text;
  els.hintText.innerHTML = p.hint;
  els.eqDividend.textContent = p.dividend;
  els.eqDivisor.textContent = p.divisor;
  els.poolLabel.textContent = `ぜんぶの数（${p.dividend}）`;
  
  // 入力リセット
  els.ansQuotient.value = '';
  els.ansRemainder.value = '';
  els.msg.className = 'message hidden';
  els.hintBox.classList.add('hidden');
  els.checkBtn.classList.remove('hidden');
  els.nextBtn.classList.add('hidden');
  
  // ラジオボタンリセット
  D.querySelectorAll('input[name="divisibility"]').forEach(rb => rb.checked = false);

  createObjects(p);
}

function createObjects(p) {
  els.poolArea.innerHTML = '';
  els.groupsArea.innerHTML = '';

  // 必要なグループ（箱など）の最大数（余裕をもって多めに用意）
  const maxGroups = Math.floor(p.dividend / p.divisor) + 1;
  for(let i=0; i<maxGroups; i++) {
    const group = D.createElement('div');
    group.className = 'group-box';
    group.dataset.label = `${i+1}${p.groupLabel}め`;
    els.groupsArea.appendChild(group);
  }

  // 具体物の生成
  for (let i = 0; i < p.dividend; i++) {
    const item = D.createElement('div');
    item.className = 'item';
    item.textContent = p.itemIcon;
    item.addEventListener('click', () => moveItem(item, p.divisor));
    els.poolArea.appendChild(item);
  }
}

function moveItem(item, divisor) {
  if (item.parentElement.id === 'pool-area') {
    const groups = Array.from(D.querySelectorAll('.group-box'));
    const targetGroup = groups.find(g => g.children.length < divisor);
    if (targetGroup) targetGroup.appendChild(item);
  } else {
    els.poolArea.appendChild(item);
  }
}

function checkAnswer() {
  const p = problems[currentIndex];
  const q = parseInt(els.ansQuotient.value, 10);
  const rStr = els.ansRemainder.value.trim();
  const r = rStr === '' ? 0 : parseInt(rStr, 10);
  const correctQ = Math.floor(p.dividend / p.divisor);
  const correctR = p.dividend % p.divisor;
  
  const radioChecked = D.querySelector('input[name="divisibility"]:checked');

  if (isNaN(q) || els.ansQuotient.value === '') {
    showMessage('こたえの 数字を いれてね！', 'error');
    return;
  }
  if (!radioChecked) {
    showMessage('「わりきれる」か「わりきれない」か えらんでね！', 'error');
    return;
  }

  const isDivisibleSelected = radioChecked.value === 'divisible';
  
  if (q === correctQ && r === correctR && isDivisibleSelected === p.isDivisible) {
    showMessage('大正解！🎉 ばっちりだね！', 'success');
    els.checkBtn.classList.add('hidden');
    if (currentIndex < problems.length - 1) {
      els.nextBtn.classList.remove('hidden');
    } else {
      els.nextBtn.classList.remove('hidden');
      els.nextBtn.textContent = 'ぜんぶ クリア！🌟';
      els.nextBtn.onclick = () => {
        currentIndex = 0;
        els.nextBtn.textContent = 'つぎの もんだいへ ➡';
        els.nextBtn.onclick = nextProblem;
        loadProblem();
      };
    }
  } else {
    showMessage('おしい！具体物（絵）をうごかして、かくにんしてみよう！', 'error');
  }
}

function nextProblem() {
  currentIndex++;
  loadProblem();
}

function showMessage(text, type) {
  els.msg.textContent = text;
  els.msg.className = `message ${type}`;
}

els.hintBtn.addEventListener('click', () => els.hintBox.classList.toggle('hidden'));
els.resetBtn.addEventListener('click', () => loadProblem());
els.checkBtn.addEventListener('click', checkAnswer);
els.nextBtn.addEventListener('click', nextProblem);

// 初回読み込み
loadProblem();