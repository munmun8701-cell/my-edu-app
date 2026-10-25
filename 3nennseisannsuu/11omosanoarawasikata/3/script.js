:root {
  --main-green: #2ecc71;
  --dark-green: #27ae60;
  --light-green: #eafaf1;
  --wood-color: #d4a373;
  --text-dark: #333;
  --practice-blue: #3498db;
}

body {
  font-family: "Hiragino Maru Gothic ProN", "Meiryo", sans-serif;
  background-color: #f4f7f6;
  color: var(--text-dark);
  margin: 0;
  padding: 20px;
}

.app-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

header {
  border-bottom: 4px solid var(--main-green);
  padding-bottom: 10px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.practice-header {
  border-bottom: 4px solid var(--practice-blue);
  margin-top: 40px;
}

.page-num {
  background: var(--main-green);
  color: white;
  font-size: 28px;
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 8px;
  margin-right: 15px;
}

h1 { margin: 0; font-size: 22px; color: var(--dark-green); flex: 1; }
h2 { color: var(--dark-green); font-size: 18px; border-left: 5px solid var(--main-green); padding-left: 10px; }
h3 { font-size: 16px; color: #333; }
.subtitle { width: 100%; margin: 10px 0 0 0; font-size: 16px; padding-left: 60px; }

.mission-card {
  background: white;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

/* 入力欄の共通スタイル */
input[type="text"] {
  font-family: inherit;
  font-size: 16px;
  text-align: center;
  border: 2px solid #bdc3c7;
  border-radius: 4px;
  padding: 5px;
  transition: all 0.3s;
}
input[type="text"]:focus {
  border-color: var(--main-green);
  outline: none;
  background: #f0fdf4;
}
.correct-input {
  background-color: #d4edda !important;
  border-color: #28a745 !important;
  color: #155724;
}

.fill-in-blank { width: 100px; background: #e0f7fa; border: none; border-bottom: 2px solid #00acc1; }
.intro-box { background: #fff9c4; padding: 15px; border-radius: 8px; border-left: 5px solid #fbc02d; margin-bottom: 20px;}

.flex-container { display: flex; justify-content: space-around; align-items: center; }
.coin-img { font-size: 50px; text-align: center; }
.writing-box {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><line x1="0" y1="50%" x2="100%" y2="50%" stroke="%233498db" stroke-dasharray="4,4" stroke-width="2"/></svg>');
  border: 2px solid #bdc3c7;
  padding: 20px 40px;
  text-align: center;
  border-radius: 5px;
}
.writing-guide { font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 40px; margin: 0; color: #2c3e50; }
.small-text { font-size: 12px; color: #7f8c8d; margin-top: 10px; }

/* ヒント */
.hint-btn { background: #fff; border: 2px solid #f1c40f; padding: 5px 15px; border-radius: 20px; font-weight: bold; cursor: pointer; color: #d35400; }
.hint-box { display: none; background: #fff3cd; border-radius: 10px; padding: 15px; margin-top: 10px; line-height: 1.6; }

/* 表 */
.data-table { width: 100%; border-collapse: collapse; margin-top: 15px; text-align: center; }
.data-table th, .data-table td { border: 2px solid #bdc3c7; padding: 12px; }
.data-table th { background-color: #ebedef; }
.table-input { width: 60px; }

/* まとめ */
.summary-box { background: white; padding: 15px; border-radius: 20px; border: 3px solid var(--main-green); font-size: 18px; font-weight: bold; position: relative; }
.character-icon { position: absolute; right: -10px; bottom: -15px; font-size: 40px; background: white; border-radius: 50%; }
.mt-20 { margin-top: 20px; }

/* クリップボード風テーブル */
.clipboard-table-container {
  background: #f4f7f6; padding: 30px 20px 20px; border-radius: 5px; border: 1px solid #ccc;
  position: relative; margin-top: 30px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
}
.clip {
  position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
  width: 120px; height: 30px; background: #7f8c8d; border-radius: 5px; border: 2px solid #2c3e50;
}
.clipboard-table { width: 100%; border-collapse: collapse; background: white; }
.clipboard-table th, .clipboard-table td { border: 1px solid #333; padding: 10px; text-align: center; }
.clipboard-table th { border-bottom: 3px double #333; }

.warning-icon { color: #d35400; font-weight: bold; margin-right: 5px; }

/* てんびんUI（練習用） */
.experiment-area { background: #fff; border: 2px dashed #3498db; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
.select-group { text-align: center; margin-bottom: 20px; }
.select-group select { font-size: 16px; padding: 5px; border: 2px solid #3498db; border-radius: 5px; }

.scale-area { margin: 20px auto; width: 300px; position: relative; height: 180px; }
.scale-beam-container { position: absolute; top: 30px; left: 0; width: 100%; height: 20px; display: flex; justify-content: center; }
.scale-beam { width: 260px; height: 12px; background: var(--wood-color); position: relative; transition: transform 0.5s; border-radius: 6px; z-index: 2; }
.scale-string { position: absolute; width: 2px; height: 70px; background: #e74c3c; top: 12px; }
.scale-string::before, .scale-string::after { content: ''; position: absolute; width: 2px; height: 70px; background: #e74c3c; top: 0; }
.scale-string::before { transform: rotate(15deg); transform-origin: top; }
.scale-string::after { transform: rotate(-15deg); transform-origin: top; }
.scale-string.left { left: 15px; }
.scale-string.right { right: 15px; }
.cup { position: absolute; bottom: -35px; left: -24px; width: 50px; height: 40px; border: 2px solid rgba(255,255,255,0.7); background: rgba(173, 216, 230, 0.5); border-radius: 5px 5px 15px 15px; display: flex; justify-content: center; align-items: center; }
.item-icon { font-size: 24px; }
.count-display { font-size: 12px; font-weight: bold; background: white; padding: 2px 5px; border-radius: 10px; position: absolute; bottom: -15px; white-space: nowrap; border: 1px solid #ccc; }
.scale-pivot { position: absolute; top: 40px; left: 140px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 90px solid #34495e; z-index: 1; }
.scale-base { position: absolute; top: 130px; left: 100px; width: 100px; height: 15px; background: #34495e; border-radius: 5px; }

.action-buttons { display: flex; justify-content: center; gap: 10px; margin-top: 10px; }
.add-btn { border: none; padding: 8px 15px; border-radius: 15px; font-weight: bold; cursor: pointer; color: white; box-shadow: 0 4px #ccc; transition: transform 0.1s; }
.add-btn:active { transform: translateY(4px); box-shadow: 0 0 #ccc; }
.add-btn.ten { background: #e67e22; box-shadow: 0 4px #d35400; }
.add-btn.one { background: #f1c40f; color: #333; box-shadow: 0 4px #f39c12; }
.reset-btn { background: #95a5a6; color: white; border: none; border-radius: 15px; padding: 8px 15px; cursor: pointer;}
.feedback-message { text-align: center; font-weight: bold; font-size: 16px; margin-top: 15px; height: 24px; color: #333;}