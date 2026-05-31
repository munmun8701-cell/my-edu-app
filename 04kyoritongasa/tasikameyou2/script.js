// --- クリア状態を管理する変数 ---
const clearedMissions = {
    m1: false,
    m2: false,
    m3: false,
    m4: false
};

// --- イベントリスナーの登録（ボタンが確実に押せるようにする） ---
document.addEventListener("DOMContentLoaded", () => {
    // タブ切り替えボタン
    document.getElementById('tab-1').addEventListener('click', () => switchTab(1));
    document.getElementById('tab-2').addEventListener('click', () => switchTab(2));
    document.getElementById('tab-3').addEventListener('click', () => switchTab(3));
    document.getElementById('tab-4').addEventListener('click', () => switchTab(4));

    // ヒントボタン
    document.getElementById('btn-hint-1').addEventListener('click', () => showHint(1));
    document.getElementById('btn-hint-2').addEventListener('click', () => showHint(2));
    document.getElementById('btn-hint-3').addEventListener('click', () => showHint(3));
    document.getElementById('btn-hint-4').addEventListener('click', () => showHint(4));

    // 答え合わせボタン
    document.getElementById('btn-check-1').addEventListener('click', checkM1);
    document.getElementById('btn-check-2').addEventListener('click', checkM2);
    document.getElementById('btn-check-3').addEventListener('click', checkM3);
    document.getElementById('btn-check-4').addEventListener('click', checkM4);
});

// --- タブ切り替え機能 ---
function switchTab(tabNum) {
    for(let i = 1; i <= 4; i++) {
        document.getElementById(`tab-${i}`).classList.remove('active-tab');
        document.getElementById(`mission-${i}`).classList.add('hidden');
    }
    document.getElementById(`tab-${tabNum}`).classList.add('active-tab');
    document.getElementById(`mission-${tabNum}`).classList.remove('hidden');
}

// --- ヒント表示機能 ---
function showHint(missionNum) {
    document.getElementById(`hint-${missionNum}`).classList.remove('hidden');
    document.getElementById(`btn-hint-${missionNum}`).classList.add('hidden');
}

// --- 全クリをチェックする機能 ---
function checkAllClear() {
    if (clearedMissions.m1 && clearedMissions.m2 && clearedMissions.m3 && clearedMissions.m4) {
        // 少し遅らせて全クリ画面を表示
        setTimeout(() => {
            document.getElementById('all-clear-screen').classList.remove('hidden');
        }, 1000);
    }
}

// --- ミッション1（まきじゃく）の判定 ---
function checkM1() {
    const aM = parseInt(document.getElementById('ans-m1-a-m').value);
    const aCm = parseInt(document.getElementById('ans-m1-a-cm').value);
    const bM = parseInt(document.getElementById('ans-m1-b-m').value);
    const bCm = parseInt(document.getElementById('ans-m1-b-cm').value);
    const fb = document.getElementById('fb-1');
    
    if (aM === 7 && aCm === 85 && bM === 8 && bCm === 15) {
        fb.innerText = '🌸 ばっちり！ メモリの小さな「1」もしっかり読めたね！';
        fb.className = 'feedback correct';
        clearedMissions.m1 = true;
        document.getElementById('tab-1').classList.add('cleared'); // タブの色を変える
        checkAllClear();
    } else {
        fb.innerText = '× おしい！ 8mの線を基準に、何cm前か、何cm後か 数えてみよう。';
        fb.className = 'feedback incorrect';
    }
}

// --- ミッション2（単位）の判定 ---
function checkM2() {
    const a1 = document.getElementById('ans-m2-1').value;
    const a2 = document.getElementById('ans-m2-2').value;
    const a3 = document.getElementById('ans-m2-3').value;
    const a4 = document.getElementById('ans-m2-4').value;
    const fb = document.getElementById('fb-2');
    
    if (a1 === 'cm' && a2 === 'm' && a3 === 'mm' && a4 === 'km') {
        fb.innerText = '🌸 大せいかい！ たんいマスター だね！';
        fb.className = 'feedback correct';
        clearedMissions.m2 = true;
        document.getElementById('tab-2').classList.add('cleared');
        checkAllClear();
    } else {
        fb.innerText = '× どれかが ちがうみたい。身の回りにある物の大きさを 思い出してみて。';
        fb.className = 'feedback incorrect';
    }
}

// --- ミッション3（きょりと道のり）の判定 ---
function checkM3() {
    const kM = parseInt(document.getElementById('ans-m3-kyori').value);
    const mTotal = parseInt(document.getElementById('ans-m3-michinori-m').value);
    const mKm = parseInt(document.getElementById('ans-m3-michinori-km').value);
    const mM2 = parseInt(document.getElementById('ans-m3-michinori-m2').value);
    const fb = document.getElementById('fb-3');
    
    const isKyoriOk = (kM === 1000);
    const isMichiOk = (mTotal === 1400 && mKm === 1 && mM2 === 400);

    if (isKyoriOk && isMichiOk) {
        fb.innerText = '🌸 すごい！ きょり と 道のり のちがいが わかったね！';
        fb.className = 'feedback correct';
        clearedMissions.m3 = true;
        document.getElementById('tab-3').classList.add('cleared');
        checkAllClear();
    } else if (!isKyoriOk) {
        fb.innerText = '× きょり（赤い線）の長さは 1km。1km は 何m かな？';
        fb.className = 'feedback incorrect';
    } else {
        fb.innerText = '× 道のり のたし算（600+800）と、kmへのへんしん をかくにんしよう。';
        fb.className = 'feedback incorrect';
    }
}

// --- ミッション4（へんしんと算数の目）の判定 ---
function checkM4() {
    const a1 = parseInt(document.getElementById('ans-m4-1').value);
    const a2km = parseInt(document.getElementById('ans-m4-2-km').value);
    const a2m = parseInt(document.getElementById('ans-m4-2-m').value);
    const a3 = document.getElementById('ans-m4-3').value;
    const fb = document.getElementById('fb-4');
    
    if (a1 === 2040 && a2km === 3 && a2m === 50 && a3 === '1km') {
        fb.innerText = '🌸 パーフェクト！！ よくできました！';
        fb.className = 'feedback correct';
        clearedMissions.m4 = true;
        document.getElementById('tab-4').classList.add('cleared');
        checkAllClear();
    } else {
        fb.innerText = '× 数字の「0」が ぬけたり、へんな場所に入ったり していないか 見直してみよう。';
        fb.className = 'feedback incorrect';
    }
}