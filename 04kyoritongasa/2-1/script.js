// 拠点のデータ (x, y座標)
const pointsData = {
    'asami': { name: 'あさみの家', x: 420, y: 70 },
    'post': { name: 'ゆうびん局', x: 120, y: 140 },
    'tatsuki': { name: 'たつきの家', x: 80, y: 350 },
    'super': { name: 'スーパー', x: 450, y: 260 },
    'school': { name: '学校', x: 700, y: 240 },
    'hospital': { name: '病院', x: 730, y: 80 },
    'park': { name: '東山公園', x: 500, y: 410 }
};

// 線のデータ（タイプと長さ）
const edges = [
    // 道のり
    { p1: 'asami', p2: 'post', type: 'michinori', length: 660 },
    { p1: 'post', p2: 'tatsuki', type: 'michinori', length: 630 },
    { p1: 'asami', p2: 'super', type: 'michinori', length: 400 },
    { p1: 'super', p2: 'school', type: 'michinori', length: 400 },
    { p1: 'school', p2: 'hospital', type: 'michinori', length: 430 },
    { p1: 'tatsuki', p2: 'park', type: 'michinori', length: 800 },
    { p1: 'super', p2: 'park', type: 'michinori', length: 600 },
    // きょり（直線）
    { p1: 'asami', p2: 'school', type: 'kyori', length: 700 },
    { p1: 'school', p2: 'park', type: 'kyori', length: 920 }
];

let currentMode = 'michinori'; // 初期モード
let selectedNodes = [];
let currentPathDistances = [];

const mapDiv = document.getElementById('map');
const canvas = document.getElementById('linesCanvas');
const ctx = canvas.getContext('2d');

// イベントリスナーの登録
document.getElementById('mode-kyori').addEventListener('click', () => setMode('kyori'));
document.getElementById('mode-michinori').addEventListener('click', () => setMode('michinori'));
document.getElementById('reset-btn').addEventListener('click', resetSelection);

// 初期化関数
function initMap() {
    drawMap();
    
    // 拠点のHTML要素を生成
    for (const [id, data] of Object.entries(pointsData)) {
        const pt = document.createElement('div');
        pt.className = 'point';
        pt.id = 'pt-' + id;
        pt.style.left = data.x + 'px';
        pt.style.top = data.y + 'px';
        pt.addEventListener('click', () => selectNode(id));
        mapDiv.appendChild(pt);

        const lbl = document.createElement('div');
        lbl.className = 'label';
        lbl.innerText = data.name;
        lbl.style.left = (data.x - 30) + 'px';
        lbl.style.top = (data.y - 35) + 'px';
        if(id === 'tatsuki') lbl.style.top = (data.y + 15) + 'px'; // 重なり回避
        mapDiv.appendChild(lbl);
    }
}

// 地図（道）を描画する処理
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 全ての道を薄く描画
    edges.forEach(edge => {
        const p1 = pointsData[edge.p1];
        const p2 = pointsData[edge.p2];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        
        if (edge.type === 'kyori') {
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffcdd2'; 
        } else {
            ctx.setLineDash([]);
            ctx.lineWidth = 12;
            ctx.strokeStyle = '#e0e0e0';
        }
        ctx.stroke();

        // 長さのテキストを描画
        ctx.setLineDash([]);
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.fillStyle = '#555';
        ctx.font = 'bold 16px sans-serif';
        
        const text = edge.length + 'm';
        const metrics = ctx.measureText(text);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(midX - metrics.width/2 - 2, midY - 14, metrics.width + 4, 18);
        
        ctx.fillStyle = edge.type === 'kyori' ? '#e57373' : '#555';
        ctx.fillText(text, midX - metrics.width/2, midY);
    });

    // 選択されたルートを色付きで強調
    if (selectedNodes.length > 1) {
        ctx.setLineDash([]);
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for(let i=0; i < selectedNodes.length - 1; i++) {
            const n1 = selectedNodes[i];
            const n2 = selectedNodes[i+1];
            const p1 = pointsData[n1];
            const p2 = pointsData[n2];
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = currentMode === 'kyori' ? '#f44336' : '#2196f3';
            ctx.stroke();
            
            drawArrow(p1, p2, ctx.strokeStyle);
        }
    }
}

// 矢印を描画
function drawArrow(p1, p2, color) {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX - 15 * Math.cos(angle - Math.PI / 6), midY - 15 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(midX - 15 * Math.cos(angle + Math.PI / 6), midY - 15 * Math.sin(angle + Math.PI / 6));
    ctx.fill();
}

// モード切替
function setMode(mode) {
    currentMode = mode;
    document.getElementById('mode-kyori').className = mode === 'kyori' ? 'active-kyori' : '';
    document.getElementById('mode-michinori').className = mode === 'michinori' ? 'active-michinori' : '';
    resetSelection();
}

// 道のデータを検索
function getEdge(n1, n2, type) {
    return edges.find(e => 
        ((e.p1 === n1 && e.p2 === n2) || (e.p1 === n2 && e.p2 === n1)) && e.type === type
    );
}

// 丸（拠点）をクリックしたときの処理
function selectNode(id) {
    const ptElement = document.getElementById('pt-' + id);

    if (selectedNodes.length > 0) {
        const lastNode = selectedNodes[selectedNodes.length - 1];
        if (lastNode === id) return;

        if (currentMode === 'kyori' && selectedNodes.length >= 2) {
            resetSelection();
        }

        const edge = getEdge(lastNode, id, currentMode);
        if (!edge) {
            alert('そこは 直接 つながっていないよ。別の道をえらんでね。');
            return;
        }
        currentPathDistances.push(edge.length);
    }

    selectedNodes.push(id);
    ptElement.classList.add('selected');
    
    drawMap();
    buildEquationUI();
}

// 計算式エリアの作成
function buildEquationUI() {
    const container = document.getElementById('equation-area');
    
    if (selectedNodes.length < 2) {
        container.innerHTML = '<span style="color: #666; font-size: 18px;">つぎの場所をタッチしてね。</span>';
        return;
    }

    container.innerHTML = ''; // クリア
    const textSpan = document.createElement('span');
    textSpan.innerText = 'はかったながさ： ';
    container.appendChild(textSpan);
    
    if (currentMode === 'kyori') {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'ans';
        input.className = 'eq-input';
        input.placeholder = 'きょり';
        container.appendChild(input);
        container.appendChild(document.createTextNode(' m'));
    } else {
        for (let i = 0; i < currentPathDistances.length; i++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = 'val' + i;
            input.className = 'eq-input';
            container.appendChild(input);
            
            if (i < currentPathDistances.length - 1) {
                container.appendChild(document.createTextNode(' ＋ '));
            }
        }
        container.appendChild(document.createTextNode(' ＝ '));
        const ansInput = document.createElement('input');
        ansInput.type = 'number';
        ansInput.id = 'ans';
        ansInput.className = 'eq-input';
        ansInput.placeholder = 'こたえ';
        container.appendChild(ansInput);
        container.appendChild(document.createTextNode(' m'));
    }
    
    container.appendChild(document.createElement('br'));
    
    const checkBtn = document.createElement('button');
    checkBtn.className = 'check-btn';
    checkBtn.innerText = 'たしかめる';
    checkBtn.addEventListener('click', checkAnswer);
    container.appendChild(checkBtn);
    
    const feedback = document.createElement('span');
    feedback.id = 'feedback';
    container.appendChild(feedback);
}

// 答え合わせ処理
function checkAnswer() {
    const feedback = document.getElementById('feedback');
    let isCorrect = true;
    let expectedTotal = 0;

    if (currentMode === 'kyori') {
        expectedTotal = currentPathDistances[0];
        const ansInput = parseInt(document.getElementById('ans').value);
        if (ansInput !== expectedTotal) isCorrect = false;
    } else {
        let userVals = [];
        for (let i = 0; i < currentPathDistances.length; i++) {
            const val = parseInt(document.getElementById(`val${i}`).value);
            userVals.push(val);
            expectedTotal += currentPathDistances[i];
        }
        
        const ansInput = parseInt(document.getElementById('ans').value);
        
        // 足し算の順番が逆でも正解にする
        let sortedExpected = [...currentPathDistances].sort();
        let sortedUser = [...userVals].sort();
        for(let i=0; i<sortedExpected.length; i++) {
            if(sortedExpected[i] !== sortedUser[i]) isCorrect = false;
        }
        if (ansInput !== expectedTotal) isCorrect = false;
    }

    if (isCorrect) {
        feedback.innerHTML = '〇 せいかい！ ばっちりだね！';
        feedback.className = 'correct';
    } else {
        feedback.innerHTML = '× もういちど 地図の数字をみてみよう。';
        feedback.className = 'incorrect';
    }
}

// リセット処理
function resetSelection() {
    selectedNodes = [];
    currentPathDistances = [];
    document.querySelectorAll('.point').forEach(el => el.classList.remove('selected'));
    drawMap();
    document.getElementById('equation-area').innerHTML = '<span style="color: #666; font-size: 18px;">地図をタッチして、道をえらんでね。</span>';
}

// 実行
initMap();