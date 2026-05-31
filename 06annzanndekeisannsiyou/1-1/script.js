// お菓子のデータ（絵文字付きで楽しく！）
const items = [
  { id: 1, name: 'ラムネ', price: 60, emoji: '🍬' },
  { id: 2, name: 'いちごチョコ', price: 44, emoji: '🍓' },
  { id: 3, name: 'ジュース', price: 95, emoji: '🧃' },
  { id: 4, name: 'するめ', price: 56, emoji: '🦑' },
  { id: 5, name: 'チョコレート', price: 38, emoji: '🍫' },
  { id: 6, name: 'あめ', price: 8, emoji: '🍭' },
  { id: 7, name: 'ガム', price: 27, emoji: '🟩' },
  { id: 8, name: 'えびせんべい', price: 79, emoji: '🦐' },
  { id: 9, name: 'ドーナツ', price: 62, emoji: '🍩' },
  { id: 10, name: 'あられ', price: 48, emoji: '🍘' }
];

let selected = [];

// HTMLの要素を取得
const itemGrid = document.getElementById('item-grid');
const actionArea = document.getElementById('action-area');
const selectedSummary = document.getElementById('selected-summary');
const answerInput = document.getElementById('answer-input');
const checkBtn = document.getElementById('check-btn');
const resultMessage = document.getElementById('result-message');
const hintSplitBtn = document.getElementById('hint-split-btn');
const hintRoundBtn = document.getElementById('hint-round-btn');
const hintText = document.getElementById('hint-text');
const resetBtn = document.getElementById('reset-btn');

// お菓子リストを画面に表示する関数
function renderItems() {
  itemGrid.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    // 選ばれているお菓子には 'selected' クラスをつける
    div.className = `item-card ${selected.includes(item) ? 'selected' : ''}`;
    div.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <div class="name">${item.name}</div>
      <div class="price">${item.price}円</div>
    `;
    div.onclick = () => toggleItem(item);
    itemGrid.appendChild(div);
  });
}

// お菓子をクリックしたときの処理
function toggleItem(item) {
  if (selected.includes(item)) {
    // すでに選ばれていたら外す
    selected = selected.filter(i => i.id !== item.id);
  } else {
    // まだ選ばれていなくて、2つ未満なら追加する
    if (selected.length < 2) {
      selected.push(item);
    }
  }
  renderItems();
  updateActionArea();
}

// 計算エリアの表示・非表示を切り替える
function updateActionArea() {
  if (selected.length === 2) {
    actionArea.classList.remove('hidden');
    selectedSummary.textContent = `${selected[0].name}（${selected[0].price}円）と ${selected[1].name}（${selected[1].price}円）ですね！`;
    resultMessage.textContent = '';
    resultMessage.className = 'message';
    answerInput.value = '';
    hintText.textContent = '';
    hintText.style.display = 'none';
  } else {
    actionArea.classList.add('hidden');
  }
}

// 「たしかめる」ボタンを押したときの処理
checkBtn.onclick = () => {
  const total = selected[0].price + selected[1].price;
  const userAns = parseInt(answerInput.value, 10);
  
  if (isNaN(userAns)) {
    resultMessage.textContent = 'こたえを入力してね！';
    resultMessage.className = 'message error';
    return;
  }

  if (userAns === total) {
     resultMessage.textContent = '大せいかい！🎉 どうやって計算したか、お友だちに説明してみよう！';
     resultMessage.className = 'message success';
  } else {
     resultMessage.textContent = 'おしい！もういちど計算してみよう。';
     resultMessage.className = 'message error';
  }
};

// 「数を分ける」ヒントボタン
hintSplitBtn.onclick = () => {
  const p1 = selected[0].price;
  const p2 = selected[1].price;
  hintText.style.display = 'block';
  // 選んだ数字に合わせてヒントの数字を変える工夫
  hintText.textContent = `十の位（${Math.floor(p1/10)*10} と ${Math.floor(p2/10)*10}）と、一の位（${p1%10} と ${p2%10}）を別々に分けて たし算してみよう！`;
};

// 「何十とみる」ヒントボタン
hintRoundBtn.onclick = () => {
  hintText.style.display = 'block';
  hintText.innerHTML = 'どちらかの数を、キリのいい<strong>『〇十』</strong>とみて計算してみよう。<br>多くたした分は、あとで引くのをわすれずにね！（例：38なら40とみる）';
};

// リセットボタン
resetBtn.onclick = () => {
  selected = [];
  renderItems();
  updateActionArea();
  // 画面の一番上に戻る
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 最初にお菓子リストを描画する
renderItems();