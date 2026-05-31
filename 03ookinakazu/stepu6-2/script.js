let state = {
    sign: '＋', // '＋' or '－'
    n1: 0,
    n2: 0,
    ans: 0
};

function toHalfWidth(str) {
    if (!str) return "";
    return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).trim();
}

function changeTheme() {
    const theme = document.getElementById('theme-select').value;
    const signBtn = document.getElementById('btn-toggle-sign');
    
    // テーマに合わせて記号を自動変更
    if(theme === 'add_carry') { state.sign = '＋'; signBtn.innerText = '＋'; }
    if(theme === 'sub_borrow') { state.sign = '－'; signBtn.innerText = '－'; }
}

function toggleSign() {
    const btn = document.getElementById('btn-toggle-sign');
    if(state.sign === '＋') { state.sign = '－'; btn.innerText = '－'; }
    else { state.sign = '＋'; btn.innerText = '＋'; }
    document.getElementById('theme-select').value = 'free'; // 手動で変えたら自由に
}

// ---------------------------
// フェーズ1 -> 2 へ
// ---------------------------
function goToPhase2() {
    // 桁ごとの値を取得して数値化
    const getVal = (id) => document.getElementById(id).value.trim();
    const str1 = getVal('b-a3') + getVal('b-a2') + getVal('b-a1') + getVal('b-a0');
    const str2 = getVal('b-b3') + getVal('b-b2') + getVal('b-b1') + getVal('b-b0');

    if(str1 === '' || str2 === '') {
        alert("数字を入力して、式を完成させてね！");
        return;
    }

    state.n1 = parseInt(str1) || 0;
    state.n2 = parseInt(str2) || 0;

    if(state.sign === '－' && state.n1 < state.n2) {
        alert("ひき算のときは、上の数字を大きくしてね！");
        return;
    }

    // 正解を計算
    state.ans = state.sign === '＋' ? state.n1 + state.n2 : state.n1 - state.n2;

    // 筆算ボードのセットアップ
    setupHissanBoard();

    // 画面切り替え
    document.getElementById('phase-1').classList.add('hidden');
    document.getElementById('phase-2').classList.remove('hidden');
    
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.add('active');
}

function backToPhase1() {
    document.getElementById('phase-2').classList.add('hidden');
    document.getElementById('phase-1').classList.remove('hidden');
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
}

// 筆算ボードに値をセット
function setupHissanBoard() {
    const s1 = state.n1.toString().padStart(4, ' ');
    const s2 = state.n2.toString().padStart(4, ' ');

    document.getElementById('h-sign').innerText = state.sign;

    for(let i=0; i<4; i++) {
        document.getElementById(`h-a${3-i}`).innerText = s1[i] === ' ' ? '' : s1[i];
        document.getElementById(`h-b${3-i}`).innerText = s2[i] === ' ' ? '' : s2[i];
        
        // 入力・メモ欄リセット
        document.getElementById(`h-ans-${i}`).value = '';
        document.getElementById(`h-ans-${i}`).disabled = false;
        document.getElementById(`h-ans-${i}`).classList.remove('is-wrong');
        
        document.getElementById(`h-m${i}`).value = '';
        document.getElementById(`h-a${i}`).classList.remove('crossed');
    }
    document.getElementById(`h-ans-4`).value = '';
    document.getElementById(`h-ans-4`).disabled = false;
    document.getElementById(`h-ans-4`).classList.remove('is-wrong');
    document.getElementById(`h-m4`).value = '';

    const btn = document.getElementById('btn-check-hissan');
    btn.disabled = false;
    btn.innerText = "答え合わせ";
}

function checkHissan() {
    const ansStr = state.ans.toString().padStart(5, ' ');
    let isCorrect = true;

    for(let i=0; i<=4; i++) {
        const inputEl = document.getElementById(`h-ans-${i}`);
        const userVal = toHalfWidth(inputEl.value);
        const correctVal = ansStr[4-i];

        if(correctVal === ' ') {
            if(userVal !== '' && userVal !== '0') { inputEl.classList.add('is-wrong'); isCorrect = false; }
            else { inputEl.classList.remove('is-wrong'); }
        } else {
            if(userVal !== correctVal) { inputEl.classList.add('is-wrong'); isCorrect = false; }
            else { inputEl.classList.remove('is-wrong'); }
        }
    }

    if(isCorrect) {
        document.querySelectorAll('#phase-2 .ans-input').forEach(el => el.disabled = true);
        const btn = document.getElementById('btn-check-hissan');
        btn.disabled = true; btn.innerText = "正解！";
        
        // 1秒後にフェーズ3へ自動遷移
        setTimeout(() => { goToPhase3(); }, 1000);
    } else {
        setTimeout(() => { document.querySelectorAll('.ans-input').forEach(el => el.classList.remove('is-wrong')); }, 800);
    }
}

// ---------------------------
// フェーズ2 -> 3 へ（たしかめ算）
// ---------------------------
function goToPhase3() {
    document.getElementById('phase-2').classList.add('hidden');
    document.getElementById('phase-3').classList.remove('hidden');
    
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-3').classList.add('active');

    generateVerifyGrid();
}

function backToPhase2() {
    document.getElementById('phase-3').classList.add('hidden');
    document.getElementById('phase-2').classList.remove('hidden');
    document.getElementById('step-3').classList.remove('active');
    document.getElementById('step-2').classList.add('active');
}

function generateVerifyGrid() {
    const grid = document.getElementById('verify-grid');
    grid.innerHTML = '';

    // たしかめ算の式：
    // たし算だった場合： 答え(ans) － ひく数(n2) ＝ もとの数(n1)
    // ひき算だった場合： 答え(ans) ＋ ひく数(n2) ＝ もとの数(n1)
    const vSign = state.sign === '＋' ? '－' : '＋';
    const sTop = state.ans.toString().padStart(5, ' ');
    const sSub = state.n2.toString().padStart(5, ' ');

    let html = `
        <div class="cell blank"></div>
        <div class="cell memo-wrapper"><input type="text" inputmode="numeric" class="memo-input"></div>
        <div class="cell memo-wrapper"><input type="text" inputmode="numeric" class="memo-input"></div>
        <div class="cell memo-wrapper"><input type="text" inputmode="numeric" class="memo-input"></div>
        <div class="cell memo-wrapper"><input type="text" inputmode="numeric" class="memo-input"></div>
        <div class="cell memo-wrapper"><input type="text" inputmode="numeric" class="memo-input"></div>

        <div class="cell blank"></div>
        <div class="cell num-base" onclick="this.classList.toggle('crossed')">${sTop[0] === ' ' ? '' : sTop[0]}</div>
        <div class="cell num-base" onclick="this.classList.toggle('crossed')">${sTop[1] === ' ' ? '' : sTop[1]}</div>
        <div class="cell num-base" onclick="this.classList.toggle('crossed')">${sTop[2] === ' ' ? '' : sTop[2]}</div>
        <div class="cell num-base" onclick="this.classList.toggle('crossed')">${sTop[3] === ' ' ? '' : sTop[3]}</div>
        <div class="cell num-base" onclick="this.classList.toggle('crossed')">${sTop[4] === ' ' ? '' : sTop[4]}</div>

        <div class="cell blank"></div>
        <div class="cell sign">${vSign}</div>
        <div class="cell num-sub line">${sSub[1] === ' ' ? '' : sSub[1]}</div>
        <div class="cell num-sub line">${sSub[2] === ' ' ? '' : sSub[2]}</div>
        <div class="cell num-sub line">${sSub[3] === ' ' ? '' : sSub[3]}</div>
        <div class="cell num-sub line">${sSub[4] === ' ' ? '' : sSub[4]}</div>

        <div class="cell blank"></div>
        <div class="cell input-wrapper"><input type="text" inputmode="numeric" class="ans-input v-ans" id="v-ans-4" maxlength="1"></div>
        <div class="cell input-wrapper"><input type="text" inputmode="numeric" class="ans-input v-ans" id="v-ans-3" maxlength="1"></div>
        <div class="cell input-wrapper"><input type="text" inputmode="numeric" class="ans-input v-ans" id="v-ans-2" maxlength="1"></div>
        <div class="cell input-wrapper"><input type="text" inputmode="numeric" class="ans-input v-ans" id="v-ans-1" maxlength="1"></div>
        <div class="cell input-wrapper"><input type="text" inputmode="numeric" class="ans-input v-ans" id="v-ans-0" maxlength="1"></div>
    `;
    grid.innerHTML = html;
}

function checkVerify() {
    // 確かめの答えは「もとの数(n1)」になるはず
    const ansStr = state.n1.toString().padStart(5, ' ');
    let isCorrect = true;

    for(let i=0; i<=4; i++) {
        const inputEl = document.getElementById(`v-ans-${i}`);
        const userVal = toHalfWidth(inputEl.value);
        const correctVal = ansStr[4-i];

        if(correctVal === ' ') {
            if(userVal !== '' && userVal !== '0') { inputEl.classList.add('is-wrong'); isCorrect = false; }
            else { inputEl.classList.remove('is-wrong'); }
        } else {
            if(userVal !== correctVal) { inputEl.classList.add('is-wrong'); isCorrect = false; }
            else { inputEl.classList.remove('is-wrong'); }
        }
    }

    if(isCorrect) {
        document.getElementById('clear-screen').classList.remove('hidden');
    } else {
        setTimeout(() => { document.querySelectorAll('.v-ans').forEach(el => el.classList.remove('is-wrong')); }, 800);
    }
}

function closeClearScreen() {
    document.getElementById('clear-screen').classList.add('hidden');
}