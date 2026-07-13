/* 全体設定・パステルカラー基調 */
:root {
  --bg-color: #FDF9F1;
  --primary-color: #74B9FF;
  --secondary-color: #FF7675;
  --accent-color: #FFEAA7;
  --text-main: #2D3436;
  --border-light: #DFE6E9;
  --box-bg: #FFFFFF;
  --font-base: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-base); background-color: var(--bg-color); color: var(--text-main); }

.app-wrapper { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

/* ヘッダー */
.header { background: var(--box-bg); padding: 10px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); z-index: 10; }
.character-area { display: flex; align-items: center; gap: 15px; }
.character-icon { font-size: 2.5rem; }
.speech-bubble {
  background: var(--accent-color); padding: 12px 20px; border-radius: 20px;
  position: relative; font-weight: bold; font-size: 1.1rem;
}
.speech-bubble::before {
  content: ''; position: absolute; left: -10px; top: 50%; transform: translateY(-50%);
  border: 10px solid transparent; border-right-color: var(--accent-color);
}

/* メインレイアウト */
.main-content { display: flex; flex: 1; overflow: hidden; }

/* サイドバー */
.sidebar {
  width: 280px; background: var(--box-bg); border-right: 2px solid var(--border-light);
  padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;
}
.sidebar h2 { font-size: 1.1rem; text-align: center; color: #555; padding-bottom: 10px; border-bottom: 2px dashed var(--border-light); }
.problem-group { display: flex; flex-direction: column; gap: 5px; }
.problem-group label { font-size: 0.9rem; font-weight: bold; color: #666; }
.problem-select, .problem-btn {
  width: 100%; padding: 12px; font-size: 1rem; border: 2px solid var(--primary-color);
  border-radius: 8px; background: var(--box-bg); cursor: pointer; min-height: 48px;
}
.problem-btn { background: var(--primary-color); color: #fff; border: none; font-weight: bold; transition: 0.2s; }
.problem-btn:active { transform: scale(0.97); }
/* クリア済みのボタンスタイル */
.problem-btn.completed { background: #00B894; border-color: #00B894; }

/* シミュレーターエリア */
.simulator-area { flex: 1; display: flex; flex-direction: column; background: #F5F6FA; position: relative; }
.tabs { display: flex; background: #E0E0E0; }
.tab-btn {
  flex: 1; padding: 15px; border: none; background: #E0E0E0; font-size: 1.1rem;
  font-weight: bold; cursor: pointer; color: #555; transition: 0.2s; min-height: 56px;
}
.tab-btn.active { background: #F5F6FA; color: #0984E3; border-top: 4px solid #0984E3; }

.current-equation { text-align: center; font-size: 2.8rem; font-weight: bold; padding: 15px; background: #F5F6FA; letter-spacing: 5px; }

/* ツール共通 */
.tool-content { flex: 1; display: none; flex-direction: column; padding: 10px 20px; overflow-y: auto; }
.tool-content.active { display: flex; }

/* 操作バー */
.instruction-bar {
  display: flex; align-items: center; justify-content: flex-start; gap: 15px;
  background: var(--box-bg); padding: 10px 20px; border-radius: 10px;
  font-weight: bold; font-size: 1.1rem; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  flex-wrap: wrap;
}
.mini-btn {
  background: #00B894; color: white; border: none; padding: 10px 20px;
  border-radius: 20px; font-weight: bold; cursor: pointer; font-size: 1rem;
  box-shadow: 0 3px 0 #009477; transition: 0.1s;
}
.mini-btn:active { transform: translateY(3px); box-shadow: none; }
.mini-btn.reset { background: #B2BEC3; box-shadow: 0 3px 0 #636E72; }

/* ツール1：ブロック（タップ操作） */
.blocks-workspace { display: flex; flex-direction: column; gap: 20px; flex: 1; }
.pool-area, .groups-area { background: var(--box-bg); padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); min-height: 180px;}
.pool-area h3, .groups-area h3 { font-size: 1.2rem; color: #2D3436; margin-bottom: 15px; border-bottom: 2px solid var(--border-light); padding-bottom: 5px;}
.dots-container { display: flex; flex-wrap: wrap; gap: 12px; }

.dot { 
  width: 36px; height: 36px; background: var(--primary-color); 
  border-radius: 50%; cursor: pointer; box-shadow: 0 3px 5px rgba(0,0,0,0.2);
  transition: transform 0.1s;
}
.dot:hover { transform: scale(1.15); }
.dot:active { transform: scale(0.9); }

.groups-container { display: flex; flex-wrap: wrap; gap: 15px; }
.group-box { 
  border: 3px dashed #A29BFE; padding: 15px; border-radius: 12px; 
  display: flex; gap: 8px; background: #F8F9FA; min-width: 60px; min-height: 70px;
  transition: 0.3s;
}
.group-box.full { border-color: #00B894; background: #E8F8F5; border-style: solid; }

/* ツール2：数直線 */
.number-line-workspace { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 30px; background: var(--box-bg); border-radius: 12px; padding: 20px;}
.line-status { font-size: 1.5rem; font-weight: bold; background: #FFF; padding: 15px 30px; border-radius: 30px; border: 2px solid var(--border-light);}
.highlight-text { color: var(--secondary-color); font-size: 1.8rem; }
.line-container { position: relative; width: 90%; height: 120px; margin-top: 30px; }
.number-line { position: absolute; bottom: 30px; left: 0; width: 100%; height: 6px; background: #2D3436; border-radius: 3px;}
.line-labels { position: absolute; bottom: 0; left: 0; width: 100%; display: flex; justify-content: space-between; font-weight: bold; font-size: 1.3rem; }
.jump-arcs { position: absolute; bottom: 36px; left: 0; width: 100%; height: 70px; display: flex; }
.arc { height: 100%; border: 4px solid var(--secondary-color); border-bottom: none; border-radius: 50px 50px 0 0; position: relative; }
.arc::after { content: '▶'; position: absolute; right: -10px; bottom: -8px; color: var(--secondary-color); font-size: 16px; }

/* ツール3：たしかめ算 */
.check-workspace { text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; background: var(--box-bg); border-radius: 12px; padding: 20px;}
.equation-inputs { font-size: 2.2rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;}
.num-input { width: 90px; height: 70px; font-size: 1.8rem; text-align: center; border: 4px solid var(--primary-color); border-radius: 12px; outline: none; }
.num-input:focus { border-color: var(--secondary-color); }
.formula-box { background: var(--accent-color); padding: 20px 40px; border-radius: 15px; font-size: 1.6rem; font-weight: bold; display: inline-block; line-height: 1.8;}

/* フッター */
.footer { background: var(--box-bg); padding: 15px; text-align: center; border-top: 2px solid var(--border-light); z-index: 10; }
.notebook-message { font-size: 1.3rem; color: #D35400; background: #FFF3E0; display: inline-block; padding: 10px 30px; border-radius: 30px; }

/* クリア画面（ポップアップ） */
.clear-screen {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(253, 249, 241, 0.95);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.5s ease;
}
.clear-screen.show { opacity: 1; pointer-events: auto; }
.clear-content {
  background: #FFF; padding: 50px; border-radius: 20px; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 6px solid #00B894;
}
.clear-title { font-size: 2.5rem; color: #00B894; margin-bottom: 20px; }
.clear-messages p { font-size: 1.8rem; margin: 20px 0; font-weight: bold; color: #2D3436; }
.action-btn { 
  background: var(--primary-color); border: none; padding: 15px 30px; 
  font-size: 1.2rem; border-radius: 30px; font-weight: bold; cursor: pointer; 
  color: #fff; box-shadow: 0 4px 0 #0984E3; margin-top: 20px;
}
.action-btn:active { transform: translateY(4px); box-shadow: none; }