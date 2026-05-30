:root {
    --primary: #10b981; --primary-dark: #059669;
    --text: #334155; --bg: #f8fafc;
    --col-1: #fce7f3; --col-1-border: #f9a8d4; /* ピンク */
    --col-10: #fef9c3; --col-10-border: #fde047; /* 黄色 */
    --col-100: #e0f2fe; --col-100-border: #7dd3fc; /* 水色 */
    --active-border: #f472b6; --active-shadow: rgba(244, 114, 182, 0.4); 
}

body { font-family: 'Hiragino Maru Gothic ProN', sans-serif; background: var(--bg); color: var(--text); padding: 20px; display: flex; justify-content: center; }
.app-container { background: #fff; padding: 25px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); width: 100%; max-width: 850px; }
.header-title { font-size: 22px; font-weight: bold; color: var(--primary-dark); text-align: center; margin-bottom: 20px; }

/* 問題選択 */
.problem-selector { background: #eff6ff; padding: 12px; border-radius: 10px; border: 2px solid #93c5fd; font-weight: bold; margin-bottom: 20px; text-align: center; color: #1e3a8a; }
select { font-size: 16px; padding: 5px; border-radius: 5px; font-weight: bold; outline: none; border: 1px solid #93c5fd; cursor: pointer;}

/* ナビボード */
.nav-board { border: 3px solid var(--primary); border-radius: 12px; margin-bottom: 20px; overflow: hidden; transition: 0.3s; }
.nav-title { background: var(--primary); color: white; font-weight: bold; padding: 10px 15px; font-size: 16px; }
.nav-msg { padding: 15px; font-size: 16px; font-weight: bold; line-height: 1.6; background: #fff; }

/* 2カラムレイアウト */
.split-layout { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
.calc-workspace { flex: 1; min-width: 300px; display: flex; flex-direction: column; align-items: center; }
.blocks-workspace { flex: 1.5; min-width: 320px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 15px; padding: 20px; display: flex; flex-direction: column; }

/* 筆算グリッド */
.grid-paper { 
    display: grid; grid-template-columns: 45px 65px 65px 65px; gap: 0; 
    border: 2px solid #94a3b8; border-radius: 15px; padding: 15px 20px 25px; background: #fff; 
    background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px); 
    background-size: 100% 65px, 65px 100%; 
}
.cell { width: 100%; height: 65px; display: flex; justify-content: center; align-items: center; font-size: 36px; font-weight: bold; position: relative; }
.cell.blank { border: none; }
.cell.sign { font-size: 32px; justify-content: flex-end; padding-right: 5px; }
.line { border-bottom: 4px solid #1e293b; padding-bottom: 2px; }

/* くり下がり斜線とメモ */
.crossed-out::after { content: ''; position: absolute; width: 70%; height: 4px; background: #e11d48; top: 50%; left: 15%; transform: rotate(-25deg); border-radius: 2px; pointer-events: none; z-index: 5;}
.small-ten { position: absolute; top: -15px; right: -5px; font-size: 16px; font-weight: bold; color: #e11d48; background: white; border-radius: 4px; padding: 0 3px; z-index: 5; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid #fca5a5;}
@keyframes popIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }

.carry-wrapper { display: flex; justify-content: flex-end; align-items: flex-end; padding-bottom: 5px; padding-right: 5px; }
.carry-input { width: 40px; height: 40px; font-size: 18px; font-weight: bold; color: #e11d48; border: 2px dashed #fca5a5; border-radius: 50%; text-align: center; background: #fef2f2; outline: none; transition: 0.2s; }
.carry-input:focus { border-color: #ef4444; background: #fff; box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); transform: scale(1.1); z-index: 10;}

/* 入力マス */
.input-wrapper { padding: 4px; transition: 0.3s; position: relative; }
.ans-input { width: 100%; height: 100%; font-size: 36px; font-weight: bold; text-align: center; border: 3px solid #cbd5e1; border-radius: 8px; outline: none; background: #fff; color: #334155; }
.ans-input:disabled { background: #f1f5f9; color: #94a3b8; border-color: #e2e8f0; }

.active-col { transform: scale(1.05); z-index: 10; }
.active-col .ans-input { border-color: var(--active-border); box-shadow: 0 0 12px var(--active-shadow); }

.correct-input { background: #fff !important; color: #047857 !important; border-color: #10b981 !important; box-shadow: none !important; }
.wrong-input { background: #fee2e2 !important; border-color: #ef4444 !important; color: #b91c1c !important; animation: shake 0.4s; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }

/* ブロック（お金）エリア */
.blocks-title { font-weight: bold; text-align: center; margin-bottom: 15px; color: #475569; font-size: 16px; }
.block-row { display: flex; align-items: center; margin-bottom: 15px; background: white; padding: 12px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); min-height: 50px;}
.block-label { width: 55px; font-weight: bold; font-size: 14px; color: #64748b; }
.block-area { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }

.coin { width: 38px; height: 38px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 14px; color: #1e293b; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 0 rgba(0,0,0,0.1);}
.coin-100 { background: #e0f2fe; border: 2px solid #7dd3fc; }
.coin-10 { background: #fef9c3; border: 2px solid #fde047; }
.coin-1 { background: #fce7f3; border: 2px solid #f9a8d4; }
.coin.used { opacity: 0.2; transform: scale(0.8); filter: grayscale(1); box-shadow: none;}
.coin.new-coin { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

.btn-action { width: 100%; background: #f59e0b; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #d97706; margin-top: auto; font-size: 16px; animation: pulse 2s infinite; }
.btn-action:active { transform: translateY(4px); box-shadow: none; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }

/* ボタン類 */
.btn-check { width: 100%; background: var(--primary); color: white; border: none; padding: 12px 30px; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 var(--primary-dark); transition: 0.1s; }
.btn-check:active:not(:disabled) { transform: translateY(4px); box-shadow: none; }
.btn-check:disabled { background: #cbd5e1; box-shadow: 0 4px 0 #94a3b8; cursor: not-allowed; }
.btn-reset { display: block; width: 100%; margin-top: 20px; padding: 12px; background: #64748b; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
.mt-15 { margin-top: 15px; }
.hidden { display: none !important; opacity: 0; pointer-events: none; }