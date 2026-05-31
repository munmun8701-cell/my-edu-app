// タブの切り替え
function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active-content'));
    
    document.querySelector('.' + type + '-tab').classList.add('active');
    document.getElementById('tab-' + type).classList.add('active-content');
}

// 問題の正解データ定義
const problemData = {
    1: { form: ["2", "9", "1", "4"], ans: ["", "4", "3"] },
    2: { form: ["6", "9", "5", "4"], ans: ["1", "2", "3"] },
    3: { form: ["4", "2", "9", "", "6", "5"], ans: ["", "4", "9", "4"] },
    4: { form: ["4", "3", "1", "5"], ans: ["", "2", "8"] },
    5: { form: ["1", "2", "3", "", "5", "4"], ans: ["", "", "6", "9"] },
    6: { form: ["4", "9", "3", "", "6", "5"], ans: ["", "4", "2", "8"] }
};

// ★全角数字（１、２など）を半角数字（1、2）に変換するおまじない
function toHalfWidth(str) {
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

function checkMath(pId) {
    const data = problemData[pId];
    const isGrid4 = (pId === 3 || pId === 5 || pId === 6);
    const cols = isGrid4 ? 3 : 2; 
    
    let isFormCorrect = true;
    let isAnsCorrect = true;

    // 上2段（式の立て方）のチェック
    let formIdx = 0;
    for (let row = 1; row <= 2; row++) {
        for (let col = 1; col <= cols; col++) {
            const inputEl = document.getElementById(`p${pId}-${row}-${col}`);
            const expected = data.form[formIdx];
            
            // 入力された文字の空白を消して、全角を半角に直す
            const rawVal = inputEl.value;
            const val = toHalfWidth(rawVal).replace(/\s+/g, '');
            
            inputEl.classList.remove('correct-cell', 'wrong-cell');
            
            if (!inputEl.readOnly) {
                if (val === expected) {
                    if (val !== "") inputEl.classList.add('correct-cell');
                } else {
                    inputEl.classList.add('wrong-cell');
                    isFormCorrect = false;
                }
            }
            formIdx++;
        }
    }

    // 下段（答え）のチェック
    for (let col = 0; col <= cols; col++) {
        const inputEl = document.getElementById(`p${pId}-3-${col}`);
        const expected = data.ans[col];
        
        // 入力された文字の空白を消して、全角を半角に直す
        const rawVal = inputEl.value;
        const val = toHalfWidth(rawVal).replace(/\s+/g, '');
        
        inputEl.classList.remove('correct-cell', 'wrong-cell');
        
        if (val === expected) {
            if (val !== "") inputEl.classList.add('correct-cell');
        } else {
            inputEl.classList.add('wrong-cell');
            isAnsCorrect = false;
        }
    }

    // メッセージの出し分け
    const msgEl = document.getElementById(`msg-${pId}`);
    if (!isFormCorrect) {
        msgEl.innerText = "位（くらい）をそろえて、正しく式を書けているかな？";
        msgEl.style.color = "#ef4444";
    } else if (isFormCorrect && !isAnsCorrect) {
        msgEl.innerText = "式の立て方はバッチリ！計算をもう一度たしかめてみよう！";
        msgEl.style.color = "#f59e0b";
    } else {
        msgEl.innerText = "✨ 大正解！ 完璧だね！ ✨";
        msgEl.style.color = "#3b82f6"; // メッセージも青系に変更
    }
}