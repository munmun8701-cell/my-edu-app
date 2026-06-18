let canvas;
let currentPage = 1;
let maxPage = 1;
let currentColor = '#000000'; 
let trashBin = []; 
let isDrawingShape = false;
let origX, origY, currentShape;
let timerInterval;

let localPagesData = {}; 

const SAVES_KEY = 'edu_whiteboard_saves_list'; // 複数セーブを管理するためのキー

function getEl(id) { return document.getElementById(id); }
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

const customProps = ['linkedId', 'linkRole', 'relX', 'relY', 'isVerticalText', 'minW', 'minH', 'objectId'];
const bgGrid = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ffffff"/><path d="M 40 0 L 0 0 0 40" fill="none" stroke="%23e0e0e0" stroke-width="1"/></svg>';
const bgRuled = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ffffff"/><path d="M 39 0 L 39 40" fill="none" stroke="%23cccccc" stroke-width="1"/></svg>';

// --- 名前をつけて保存 ＆ 履歴一覧管理 ---
function saveAsDataLocally() {
    const title = prompt("保存する題名を入力してください\n（例：3年算数 角の大きさ 1時目）");
    if (!title) return; // キャンセル時

    saveCurrentPageLocally(); 
    const dataToSave = {
        title: title,
        date: new Date().toLocaleString(),
        maxPage: maxPage,
        currentPage: currentPage,
        pages: localPagesData
    };

    try {
        let saves = JSON.parse(localStorage.getItem(SAVES_KEY) || '{}');
        const id = 'save_' + Date.now();
        saves[id] = dataToSave;
        localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
        alert(`「${title}」として保存しました！`);
    } catch (e) {
        alert('保存に失敗しました。画像の貼りすぎ等で容量がオーバーしている可能性があります。不要な履歴を削除してください。');
        console.error(e);
    }
}

function openLoadModal() {
    const saves = JSON.parse(localStorage.getItem(SAVES_KEY) || '{}');
    const list = getEl('save-list');
    list.innerHTML = '';

    if (Object.keys(saves).length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#666; padding: 20px;">保存された履歴はありません。</p>';
    } else {
        // 新しい順に並び替え
        const sortedIds = Object.keys(saves).sort((a, b) => b.localeCompare(a));
        
        sortedIds.forEach(id => {
            const s = saves[id];
            list.innerHTML += `
            <div class="save-item">
                <div class="save-item-info">
                    <span class="save-item-title">${s.title}</span>
                    <span class="save-item-date">保存日時: ${s.date} / 全${s.maxPage}ページ</span>
                </div>
                <div class="save-item-actions">
                    <button onclick="loadSaveData('${id}')" class="btn-base btn-blue">開く</button>
                    <button onclick="deleteSaveData('${id}')" class="btn-base btn-red">削除</button>
                </div>
            </div>`;
        });
    }
    getEl('save-load-modal').style.display = 'block';
}

function loadSaveData(id) {
    if(!confirm("現在編集中の内容は失われます。よろしいですか？")) return;
    const saves = JSON.parse(localStorage.getItem(SAVES_KEY) || '{}');
    const savedData = saves[id];
    
    if (savedData) {
        maxPage = savedData.maxPage || 1;
        currentPage = savedData.currentPage || 1;
        localPagesData = savedData.pages || {};
        
        renderPageButtons();
        loadPageLocally(currentPage);
        
        if(localPagesData[currentPage] && localPagesData[currentPage].bg) {
            getEl('bgSelect').value = localPagesData[currentPage].bg;
        }
        getEl('save-load-modal').style.display = 'none';
    }
}

function deleteSaveData(id) {
    if(!confirm("本当にこの履歴を削除しますか？\n（この操作は取り消せません）")) return;
    let saves = JSON.parse(localStorage.getItem(SAVES_KEY) || '{}');
    delete saves[id];
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
    openLoadModal(); // 一覧を再描画
}

function saveCurrentPageLocally() {
    if (canvas) {
        localPagesData[currentPage] = {
            bg: getEl('bgSelect').value,
            objects: canvas.getObjects().map(o => o.toObject(customProps))
        };
    }
}

function loadPageLocally(pageNumber) {
    canvas.clear();
    const data = localPagesData[pageNumber];
    if (!data || !data.objects || data.objects.length === 0) {
        getEl('bgSelect').value = 'white';
        changeBackground(true);
        return;
    }

    getEl('bgSelect').value = data.bg || 'white';
    if (data.bg === 'grid') canvas.backgroundColor = { source: bgGrid, repeat: 'repeat' };
    else if (data.bg === 'ruled') canvas.backgroundColor = { source: bgRuled, repeat: 'repeat' };
    else canvas.backgroundColor = '#ffffff';

    canvas.loadFromJSON(data, () => {
        const linkedMap = {};
        canvas.getObjects().forEach(obj => {
            if (obj.isVerticalText) obj.on('changed', () => fixVerticalText(obj));
            if (obj.linkedId) {
                if (!linkedMap[obj.linkedId]) linkedMap[obj.linkedId] = {};
                linkedMap[obj.linkedId][obj.linkRole] = obj;
            }
        });
        Object.values(linkedMap).forEach(pair => { if (pair.frame && pair.text) setupLink(pair.frame, pair.text); });
        canvas.renderAll();
    });
}

function changeFontSize() {
    if(!canvas) return;
    const size = parseInt(getEl('fontSizeSelect').value, 10);
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
        activeObjects.forEach(obj => {
            if (obj.type === 'i-text' || obj.type === 'textbox') {
                obj.set('fontSize', size);
                if (obj.isVerticalText) obj.set('width', size + 10);
            }
        });
        canvas.renderAll();
    }
}

function fixVerticalText(obj) {
    if (!obj || !obj.text || !obj.isVerticalText) return;
    if (obj.text.includes('\n')) {
        const parts = obj.text.split('\n');
        obj.set('text', parts[0]);
        let currentObj = obj;
        for (let i = 1; i < parts.length; i++) {
            const offsetLeft = currentObj.fontSize + 16;
            const newObj = new fabric.Textbox(parts[i] || '', {
                left: currentObj.left - offsetLeft, top: currentObj.top,
                width: currentObj.fontSize + 10, fontSize: currentObj.fontSize,
                fill: currentObj.fill, splitByGrapheme: true, isVerticalText: true, objectId: generateId()
            });
            canvas.add(newObj);
            newObj.on('changed', () => fixVerticalText(newObj));
            currentObj = newObj;
        }
        canvas.setActiveObject(currentObj);
        currentObj.enterEditing();
        let fixed = obj.text.replace(/、/g, '︑').replace(/。/g, '︒').replace(/「/g, '﹃').replace(/」/g, '﹄').replace(/ー/g, '丨');
        if (obj.text !== fixed) obj.set('text', fixed);
        canvas.renderAll();
        return;
    }
    const MAX_HEIGHT = 400; 
    if (obj.height > MAX_HEIGHT && obj.text.length > 1) {
        const lastChar = obj.text.slice(-1);
        obj.set('text', obj.text.slice(0, -1)); 
        const offsetLeft = obj.fontSize + 16;
        const newObj = new fabric.Textbox(lastChar, {
            left: obj.left - offsetLeft, top: obj.top,
            width: obj.fontSize + 10, fontSize: obj.fontSize,
            fill: obj.fill, splitByGrapheme: true, isVerticalText: true, objectId: generateId()
        });
        canvas.add(newObj);
        newObj.on('changed', () => fixVerticalText(newObj));
        canvas.setActiveObject(newObj);
        newObj.enterEditing();
        newObj.selectionStart = 1; newObj.selectionEnd = 1;
        canvas.renderAll();
        return;
    }
    let fixed = obj.text.replace(/、/g, '︑').replace(/。/g, '︒').replace(/「/g, '﹃').replace(/」/g, '﹄').replace(/ー/g, '丨');
    if (obj.text !== fixed) { obj.set('text', fixed); canvas.renderAll(); }
}

function setColor(color, btnElement) {
    currentColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    
    if(canvas) {
        const activeObj = canvas.getActiveObject();
        if(activeObj && (activeObj.type === 'i-text' || activeObj.type === 'textbox')) {
            activeObj.set('fill', color);
            canvas.renderAll();
        } else if (activeObj && ['line', 'rect', 'circle'].includes(activeObj.type)) {
            activeObj.set('stroke', color);
            canvas.renderAll();
        }
        changeTool(); 
    }
}

function renderPageButtons() {
    const container = getEl('page-list');
    container.innerHTML = '';
    for (let i = 1; i <= maxPage; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => switchPage(i);
        container.appendChild(btn);
    }
}

function switchPage(pageNumber) {
    if (currentPage === pageNumber) return;
    saveCurrentPageLocally();
    currentPage = pageNumber;
    renderPageButtons();
    trashBin = []; 
    loadPageLocally(pageNumber);
}

function addPage() {
    saveCurrentPageLocally();
    maxPage++;
    currentPage = maxPage;
    renderPageButtons();
    canvas.clear();
    getEl('bgSelect').value = 'white';
    changeBackground(true);
}

function changeTool() {
    if(!canvas) return;
    const tool = getEl('tool').value;
    canvas.isDrawingMode = (tool === 'draw' || tool === 'highlight');
    
    if (tool === 'highlight') {
        canvas.freeDrawingBrush.width = parseInt(getEl('fontSizeSelect').value, 10) * 1.2 || 20;
        let hex = currentColor.replace('#', '');
        let r = parseInt(hex.substring(0,2), 16);
        let g = parseInt(hex.substring(2,4), 16);
        let b = parseInt(hex.substring(4,6), 16);
        canvas.freeDrawingBrush.color = `rgba(${r}, ${g}, ${b}, 0.3)`;
    } else if (tool === 'draw') {
        canvas.freeDrawingBrush.width = 4;
        canvas.freeDrawingBrush.color = currentColor;
    }
}

function changeBackground(skipSave = false) {
    if(!canvas) return;
    const bgType = getEl('bgSelect').value;
    const cb = () => canvas.renderAll();
    if (bgType === 'white') canvas.setBackgroundColor('#ffffff', cb); 
    else if (bgType === 'grid') canvas.setBackgroundColor({ source: bgGrid, repeat: 'repeat' }, cb);
    else if (bgType === 'ruled') canvas.setBackgroundColor({ source: bgRuled, repeat: 'repeat' }, cb);
}

function startTimer() {
    clearInterval(timerInterval);
    let btn = getEl('startTimerBtn');
    if (btn.textContent === '■') {
        btn.textContent = '▶';
        return;
    }
    let min = parseInt(getEl('timerMin').value) || 3;
    let time = min * 60;
    btn.textContent = '■';
    const display = getEl('timerDisplay');
    
    display.textContent = `${min.toString().padStart(2, '0')}:00`;
    
    timerInterval = setInterval(() => {
        time--;
        let m = Math.floor(time / 60).toString().padStart(2, '0');
        let s = (time % 60).toString().padStart(2, '0');
        display.textContent = `${m}:${s}`;
        
        if (time <= 0) {
            clearInterval(timerInterval);
            btn.textContent = '▶';
            alert('時間になりました！');
        }
    }, 1000);
}

function setupLink(frame, text) {
    frame.off('moving'); text.off('moving'); text.off('changed');
    frame.on('moving', () => { text.set({ left: frame.left + frame.relX, top: frame.top + frame.relY }); text.setCoords(); });
    text.on('moving', () => { frame.set({ left: text.left - frame.relX, top: text.top - frame.relY }); frame.setCoords(); });
    text.on('changed', () => {
        fixVerticalText(text); 
        const rect = frame.getObjects()[0]; 
        const minW = frame.minW || 0; const minH = frame.minH || 0;
        const newW = Math.max(minW, text.width + 60); const newH = Math.max(minH, text.height + 60);
        if (rect.width !== newW || rect.height !== newH) {
            rect.set({ width: newW, height: newH });
            const oldLeft = frame.left; const oldTop = frame.top;
            frame.addWithUpdate(); frame.set({ left: oldLeft, top: oldTop }); frame.setCoords();
            canvas.renderAll();
        }
    });
}

function getScrollOffset() {
    const wrapper = getEl('canvas-wrapper'); 
    if (!wrapper) return { x: 100, y: 100 };
    return { x: wrapper.scrollLeft + 100, y: wrapper.scrollTop + 100 };
}

function createBoardFrame(type) {
    if (!canvas) return;
    const isVertical = (getEl('textDirection').value === 'v');
    
    let color = '#dc3545'; 
    if (type === '学') color = '#1e88e5'; 
    else if (type === '問') color = '#333333'; 

    const offset = getScrollOffset();
    const rw = isVertical ? 120 : 450; const rh = isVertical ? 450 : 120;
    const bx = isVertical ? rw - 20 : -20; const by = -20;

    const circle = new fabric.Circle({ radius: 20, fill: 'white', stroke: color, strokeWidth: 4, originX: 'center', originY: 'center' });
    const textBadge = new fabric.Text(type, { fontSize: 24, fill: color, fontWeight: 'bold', originX: 'center', originY: 'center' });
    const badge = new fabric.Group([circle, textBadge], { left: bx, top: by });
    const rect = new fabric.Rect({ left: 0, top: 0, width: rw, height: rh, fill: 'transparent', stroke: color, strokeWidth: 4, rx: 8, ry: 8 });

    const frameGroup = new fabric.Group([rect, badge], { left: offset.x, top: offset.y, objectId: generateId() });

    const tx = offset.x + (isVertical ? 45 : 40); const ty = offset.y + (isVertical ? 40 : 30);
    
    let placeholder = 'テキストを入力...';
    if (type === '問') placeholder = '問題を入力...';
    else if (type === '学') placeholder = '学習課題を入力...';
    else if (type === 'ま') placeholder = 'まとめを入力...';
    else if (type === 'め') placeholder = 'めあてを入力...';
    else if (type === 'ポ') placeholder = 'ポイントを入力...';

    if (isVertical) placeholder = placeholder.replace('を', 'を\n');
    
    const fontSize = parseInt(getEl('fontSizeSelect').value, 10);
    let innerText;
    if (isVertical) {
        innerText = new fabric.Textbox(placeholder, { left: tx, top: ty, fontSize: fontSize, fill: '#333', width: fontSize+10, splitByGrapheme: true, isVerticalText: true, objectId: generateId() });
        innerText.on('changed', () => fixVerticalText(innerText));
        fixVerticalText(innerText);
    } else {
        innerText = new fabric.IText(placeholder.replace('\n',''), { left: tx, top: ty, fontSize: fontSize, fill: '#333', objectId: generateId() });
    }

    const linkedId = Date.now().toString();
    const relX = tx - offset.x; const relY = ty - offset.y;
    frameGroup.set({ linkedId: linkedId, linkRole: 'frame', relX: relX, relY: relY, minW: rw, minH: rh });
    innerText.set({ linkedId: linkedId, linkRole: 'text', relX: relX, relY: relY });

    setupLink(frameGroup, innerText);
    canvas.add(frameGroup, innerText);
    getEl('tool').value = 'select'; canvas.isDrawingMode = false;
}

function addSticky() {
    if (!canvas) return;
    const isVertical = (getEl('textDirection').value === 'v');
    const fontSize = parseInt(getEl('fontSizeSelect').value, 10);
    const offset = getScrollOffset();

    const commonOpts = { left: offset.x + 50, top: offset.y + 50, fontSize: fontSize, padding: 15, backgroundColor: '#fff9c4', fill: currentColor, shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 5, offsetX: 3, offsetY: 3 }), objectId: generateId() };
    
    let stickyText;
    if (isVertical) {
        commonOpts.width = fontSize + 10; commonOpts.splitByGrapheme = true; commonOpts.isVerticalText = true;
        stickyText = new fabric.Textbox('ここに入力', commonOpts);
        stickyText.on('changed', () => fixVerticalText(stickyText));
        fixVerticalText(stickyText);
    } else {
        stickyText = new fabric.IText('ここに入力', commonOpts);
    }

    canvas.add(stickyText); canvas.setActiveObject(stickyText);
    stickyText.enterEditing(); stickyText.selectAll();
    getEl('tool').value = 'select'; canvas.isDrawingMode = false;
}

function addBiLingualSticky() {
    if (!canvas) return;
    const fontSize = parseInt(getEl('fontSizeSelect').value, 10);
    const offset = getScrollOffset();

    // 日本語とモンゴル語を入力しやすいテンプレートテキスト
    const textTemplate = "🇯🇵 日本語：\nここに入力\n\n🇲🇳 モンゴル語：\nここに入力";
    
    const stickyText = new fabric.Textbox(textTemplate, { 
        left: offset.x + 50, top: offset.y + 50, 
        fontSize: fontSize, padding: 15, 
        backgroundColor: '#e3f2fd', // 通常ふせんと区別するため薄い青色
        fill: currentColor, width: 350,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 5, offsetX: 3, offsetY: 3 }), 
        objectId: generateId() 
    });

    canvas.add(stickyText); canvas.setActiveObject(stickyText);
    getEl('tool').value = 'select'; canvas.isDrawingMode = false;
}

function deleteSelected() {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    
    let removedItems = [];
    const idsToDelete = activeObjects.map(o => o.linkedId).filter(id => id);

    canvas.getObjects().forEach(obj => {
        if (activeObjects.includes(obj) || idsToDelete.includes(obj.linkedId)) {
            removedItems.push(obj);
            canvas.remove(obj);
        }
    });

    if (removedItems.length > 0) {
        trashBin.push(removedItems);
        if(trashBin.length > 10) trashBin.shift(); 
        canvas.discardActiveObject(); 
    }
}

function restoreDeleted() {
    if (!canvas || trashBin.length === 0) return;
    trashBin.pop().forEach(obj => canvas.add(obj));
}

function clearAll() {
    if (!canvas) return;
    if (confirm(`ほんとうに ページ ${currentPage} を ぜんぶ けしますか？`)) {
        canvas.clear();
        changeBackground(true);
        trashBin = [];
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`全画面表示をオンにできませんでした: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function exportPDF() {
    if (!canvas) return;
    
    if (!canvas.backgroundColor) {
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', format: 'a3' });
    canvas.renderAll();
    const imgData = canvas.toDataURL({ format: 'jpeg', quality: 0.9 }); 
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ボード記録_P${currentPage}.pdf`);
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (image) => {
            const offset = getScrollOffset(); 
            image.set({ left: offset.x, top: offset.y, objectId: generateId() });
            if (image.width > 600) image.scaleToWidth(600);
            canvas.add(image); canvas.setActiveObject(image);
            getEl('tool').value = 'select'; canvas.isDrawingMode = false;
        });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; 
}

window.addEventListener('DOMContentLoaded', () => {
    getEl('addPageBtn').addEventListener('click', addPage);
    getEl('deleteObjBtn').addEventListener('click', deleteSelected);
    getEl('addStickyBtn').addEventListener('click', addSticky);
    getEl('addBiLingualBtn').addEventListener('click', addBiLingualSticky);
    getEl('exportPdfBtn').addEventListener('click', exportPDF);
    getEl('clearBtn').addEventListener('click', clearAll);
    getEl('fullScreenBtn').addEventListener('click', toggleFullScreen);
    
    // 保存・ロード機能のボタン紐付け
    getEl('saveDataBtn').addEventListener('click', saveAsDataLocally);
    getEl('loadDataBtn').addEventListener('click', openLoadModal);
    
    getEl('viewGalleryBtn').addEventListener('click', () => {
        saveCurrentPageLocally();
        const grid = getEl('gallery-grid');
        grid.innerHTML = '';
        
        const offscreenCanvas = document.createElement('canvas');
        const offscreen = new fabric.StaticCanvas(offscreenCanvas, { width: 2000, height: 1500, backgroundColor: '#ffffff' });

        for(let pNum = 1; pNum <= maxPage; pNum++) {
            const data = localPagesData[pNum];
            if (!data || !data.objects || data.objects.length === 0) {
                grid.innerHTML += `<div class="gallery-item" onclick="switchPage(${pNum}); getEl('gallery-modal').style.display='none'"><h3>📄 ページ ${pNum}</h3><p style="padding:50px 0;">(白紙です)</p></div>`;
                continue;
            }
            
            offscreen.clear();
            if (data.bg === 'grid') offscreen.backgroundColor = { source: bgGrid, repeat: 'repeat' };
            else if (data.bg === 'ruled') offscreen.backgroundColor = { source: bgRuled, repeat: 'repeat' };
            else offscreen.backgroundColor = '#ffffff';

            offscreen.loadFromJSON(data, () => {
                offscreen.renderAll();
                grid.innerHTML += `<div class="gallery-item" onclick="switchPage(${pNum}); getEl('gallery-modal').style.display='none'"><h3>📄 ページ ${pNum}</h3><img src="${offscreen.toDataURL({ format: 'png' })}"></div>`;
            });
        }
        getEl('gallery-modal').style.display = 'block';
    });
    
    getEl('closeGalleryBtn').addEventListener('click', () => getEl('gallery-modal').style.display = 'none');

    initCanvas();
    renderPageButtons();
});

function initCanvas() {
    canvas = new fabric.Canvas('canvas', { 
        isDrawingMode: false, 
        preserveObjectStacking: true,
        backgroundColor: '#ffffff'
    });
    getEl('tool').value = 'select';

    canvas.on('mouse:move', (options) => {
        const tool = getEl('tool').value;
        if (isDrawingShape && currentShape) {
            let pointer = canvas.getPointer(options.e);
            if (tool === 'line') currentShape.set({ x2: pointer.x, y2: pointer.y });
            else if (tool === 'rect') {
                currentShape.set({ width: Math.abs(origX - pointer.x), height: Math.abs(origY - pointer.y) });
                if (origX > pointer.x) currentShape.set({ left: pointer.x });
                if (origY > pointer.y) currentShape.set({ top: pointer.y });
            } else if (tool === 'circle') {
                let radius = Math.abs(origX - pointer.x) / 2;
                currentShape.set({ radius: radius });
                if (origX > pointer.x) currentShape.set({ left: pointer.x });
                if (origY > pointer.y) currentShape.set({ top: pointer.y });
            }
            canvas.renderAll();
        }
    });

    canvas.on('mouse:down', (options) => {
        const tool = getEl('tool').value;
        const pointer = canvas.getPointer(options.e);
        if (['line', 'rect', 'circle'].includes(tool)) {
            isDrawingShape = true; origX = pointer.x; origY = pointer.y;
            if (tool === 'line') currentShape = new fabric.Line([origX, origY, origX, origY], { stroke: currentColor, strokeWidth: 4, objectId: generateId() });
            else if (tool === 'rect') currentShape = new fabric.Rect({ left: origX, top: origY, width: 0, height: 0, fill: 'transparent', stroke: currentColor, strokeWidth: 4, objectId: generateId() });
            else if (tool === 'circle') currentShape = new fabric.Circle({ left: origX, top: origY, radius: 0, fill: 'transparent', stroke: currentColor, strokeWidth: 4, objectId: generateId() });
            canvas.add(currentShape);
        } else if (tool === 'stamp') {
            const stamp = new fabric.Text('💮', { left: pointer.x - 25, top: pointer.y - 25, fontSize: 50, objectId: generateId() });
            canvas.add(stamp);
            getEl('tool').value = 'select'; canvas.isDrawingMode = false;
        } else if (tool === 'text' && !canvas.isDrawingMode) {
            const isVertical = (getEl('textDirection').value === 'v');
            const fontSize = parseInt(getEl('fontSizeSelect').value, 10);
            const opts = { left: pointer.x, top: pointer.y, fill: currentColor, fontSize: fontSize, objectId: generateId() };
            let textObj;
            if (isVertical) {
                opts.splitByGrapheme = true; opts.width = fontSize + 10; opts.isVerticalText = true;
                textObj = new fabric.Textbox('ここに入力', opts);
                textObj.on('changed', () => fixVerticalText(textObj));
                fixVerticalText(textObj);
            } else {
                textObj = new fabric.IText('ここに入力', opts);
            }
            canvas.add(textObj); canvas.setActiveObject(textObj);
            textObj.enterEditing(); textObj.selectAll();
            getEl('tool').value = 'select'; canvas.isDrawingMode = false;
        }
    });

    canvas.on('mouse:up', () => {
        if (isDrawingShape && currentShape) {
            isDrawingShape = false; currentShape.setCoords(); getEl('tool').value = 'select'; currentShape = null;
        }
    });

    window.addEventListener('keydown', (e) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') && e.target.tagName !== 'INPUT' && !canvas.getActiveObject()?.isEditing) {
            deleteSelected();
        }
    });
}