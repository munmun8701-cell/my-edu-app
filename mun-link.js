/* =====================================================================
   むんクエスト連携キット（mun-link.js）  v1.2  2026.10
   ---------------------------------------------------------------------
   単元アプリやゲームの </body> の直前に、次の1行を入れるだけで使えます。
     <script src="/mun-link.js"></script>

   ■ 自動でできること（1行入れるだけ）
   ・画面の左下に「もどる」ボタンが出て、トップページのその学年のコーナーへ戻れます。
       3nennseisannsuu → 3年算数 / 4nennseisannsuu → 4年算数 / 5nenseisannsuu → 5年算数
       6nennseisannsuu → 6年算数（ほかのフォルダはトップページへ）
     ボタンの場所を変えたいとき： <script src="/mun-link.js" data-back="top-left"></script>
       （bottom-left ＝左下〔ふつう〕 / bottom-right / top-left / top-right / off ＝出さない）
   ・保護者が設定した「休けいのお知らせ」が、アプリの中でも出ます。
   ・学習した時間でコインがもらえます：5分ごとに +100 C / +10 EXP
       （画面を見ながら操作している時間だけ数えます。ひらいたままの放置や、別のタブにいる間は数えません）
   ・学習でもらえるコインは 1日 3000 C まで（時間・クリアのごほうびを合わせて）

   ■ プログラムから使えること
   1) 授業（1時間目など）をクリアしたら、トップページのワールドマップに★が光り、
      EXP とコインがたまります（はじめてクリア +10 EXP / +100 C、★がふえたら ★1つ +5 EXP / +30 C）。
        MunQuest.complete('app-math6-2', 3, 2);   // 単元ID, 何時間目, ★の数(0〜3)
      ・単元ID はトップページのカードの data-id（例：app-math6-2 ＝ 6年「文字と式」）
      ・同じ授業でごほうびがもらえるのは「はじめてクリア」と「★がふえたとき」だけ
      ・EXP のごほうびは 1日 30回まで、コインは学習コインの上限（1日 3000 C）まで
   2) 単元の授業の数を教えると、ワールドマップに「何時間中いくつクリアしたか」が出ます。
        MunQuest.setTotal('app-math6-2', 6);

   ■ 保存の場所（トップページと共通・この端末の中だけ）
     mun_exp / mun_coins / mun_daily_exp … EXP・コイン（トップページと同じ）
     mun_progress … 単元ごとのクリア記録
     mun_reward_day … 1日のごほうび回数
     mun_learn_coin … 今日の学習コイン（上限 3000 C）
     mun_study_day / mun_study_tick … 今日の学習時間
     mun_break / mun_session … 休けいのお知らせ
   ===================================================================== */
(function () {
  'use strict';
  if (window.MunQuest) return;
  var LS = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  function load(k, d) { try { var v = JSON.parse(LS.get(k)); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { LS.set(k, JSON.stringify(v)); }
  function today() { return new Date().toDateString(); }
  var APP_CAP = 30;

  function useAppReward() {
    var r = load('mun_reward_day', null);
    if (!r || r.date !== today()) r = { date: today() };
    if ((r.app || 0) >= APP_CAP) return false;
    r.app = (r.app || 0) + 1; save('mun_reward_day', r); return true;
  }
  /* ---------- 学習コイン（1日 3000 C まで）---------- */
  var LEARN_CAP = 3000;                // ← 1日にもらえる学習コインの上限
  var STUDY_STEP = 5 * 60;             // ← 何秒ごとにごほうびか（5分）
  var STUDY_COIN = 100, STUDY_EXP = 10; // ← 5分ごとのコイン・EXP
  function learnLog() { var r = load('mun_learn_coin', null); if (!r || r.date !== today()) r = { date: today(), c: 0 }; return r; }
  function learnCoins(n) {
    var r = learnLog(), g = Math.max(0, Math.min(n, LEARN_CAP - r.c));
    if (g > 0) { r.c += g; save('mun_learn_coin', r); var c = (parseInt(LS.get('mun_coins')) || 0) + g; LS.set('mun_coins', c); }
    return g;
  }
  function addExp(e) {
    if (!(e > 0)) return;
    LS.set('mun_exp', (parseInt(LS.get('mun_exp')) || 0) + e);
    var log = load('mun_daily_exp', {}); log[today()] = (log[today()] || 0) + e; save('mun_daily_exp', log);
  }

  /* ---------- 小さなお知らせ表示 ---------- */
  function ensureStyle() {
    if (document.getElementById('mq-link-style')) return;
    var st = document.createElement('style'); st.id = 'mq-link-style';
    st.textContent =
      '.mq-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483000;padding:12px 20px;border-radius:14px;background:rgba(10,15,30,.95);color:#fff;font:800 15px/1.5 "M PLUS Rounded 1c","Hiragino Maru Gothic ProN",Meiryo,sans-serif;border:1px solid #fbbf24;box-shadow:0 10px 30px rgba(0,0,0,.4),0 0 16px rgba(251,191,36,.3);animation:mqUp .35s ease}' +
      '@keyframes mqUp{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}' +
      '.mq-back{position:fixed;right:16px;bottom:16px;z-index:2147482000;display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:999px;background:linear-gradient(135deg,#00e5ff,#a855f7);color:#04121a;font:900 14px/1 "M PLUS Rounded 1c",Meiryo,sans-serif;text-decoration:none;box-shadow:0 6px 20px rgba(0,229,255,.35)}' +
      '.mq-back-auto{right:auto;bottom:auto;padding:8px 14px;font-size:13px;opacity:.92}.mq-back-auto:hover{opacity:1}' +
      '.mq-bottom-left{left:12px;bottom:calc(12px + env(safe-area-inset-bottom))}.mq-bottom-right{right:12px;bottom:calc(12px + env(safe-area-inset-bottom))}.mq-top-left{left:12px;top:12px}.mq-top-right{right:12px;top:12px}' +
      '@media print{.mq-back{display:none}}' +
      '.mq-break{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:20px;background:rgba(3,7,18,.82);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:"M PLUS Rounded 1c","Hiragino Maru Gothic ProN",Meiryo,sans-serif}' +
      '.mq-break-box{max-width:440px;width:100%;text-align:center;padding:30px 26px;border-radius:24px;background:#0b1222;color:#e2e8f0;border:1px solid rgba(16,185,129,.5);box-shadow:0 0 40px rgba(16,185,129,.25)}' +
      '.mq-break-box .ic{font-size:56px;line-height:1}.mq-break-box h2{margin:12px 0 8px;font-size:22px;color:#fff}.mq-break-box p{margin:0 0 6px;font-size:15px;line-height:1.8;color:#cbd5e1}' +
      '.mq-break-box button{margin:14px 6px 0;padding:12px 20px;border-radius:14px;border:0;font:900 15px/1 inherit;cursor:pointer}' +
      '.mq-break-box .ok{background:#10b981;color:#002015}.mq-break-box .later{background:rgba(148,163,184,.16);color:#e2e8f0}';
    (document.head || document.documentElement).appendChild(st);
  }
  function toast(msg) {
    ensureStyle();
    var t = document.createElement('div'); t.className = 'mq-toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200);
  }

  /* ---------- 単元のクリア記録 ---------- */
  function complete(unitId, lesson, stars) {
    if (!unitId) return { exp: 0, coins: 0 };
    stars = Math.max(0, Math.min(3, parseInt(stars) || 0));
    var all = load('mun_progress', {}), u = all[unitId] || { lessons: {} };
    if (!u.lessons) u.lessons = {};
    var key = String(lesson == null ? 1 : lesson), prev = u.lessons[key], exp = 0, coins = 0;
    if (!prev) { exp = 10; coins = 100; }
    else if (stars > (prev.stars || 0)) { exp = 5 * (stars - (prev.stars || 0)); coins = 30 * (stars - (prev.stars || 0)); }
    u.lessons[key] = { stars: Math.max(stars, prev ? prev.stars || 0 : 0), date: new Date().toISOString().slice(0, 10) };
    u.last = Date.now(); all[unitId] = u; save('mun_progress', all);
    if (!exp && !coins) return { exp: 0, coins: 0 };
    var e = useAppReward() ? exp : 0, c = learnCoins(coins);
    addExp(e);
    if (e || c) {
      toast((prev ? '★がふえた！' : 'クリア！') + (e ? ' +' + e + ' EXP' : '') + (c ? ' / +' + c + ' C' : '') + coinNote());
      return { exp: e, coins: c };
    }
    return { exp: 0, coins: 0 };
  }
  function setTotal(unitId, total) {
    var all = load('mun_progress', {}), u = all[unitId] || { lessons: {} };
    u.total = Math.max(1, parseInt(total) || 1); all[unitId] = u; save('mun_progress', all);
  }
  function getProgress(unitId) { return load('mun_progress', {})[unitId] || null; }
  function visit(unitId) {
    var v = load('mun_visits', {}), x = v[unitId] || { n: 0 };
    x.n++; x.last = Date.now(); v[unitId] = x; save('mun_visits', v);
  }

  /* ---------- トップへ戻るボタン ---------- */
  function backButton(opts) {
    opts = opts || {};
    ensureStyle();
    var a = document.createElement('a'); a.className = 'mq-back';
    a.href = location.origin + '/index.html' + (opts.cat ? '?cat=' + encodeURIComponent(opts.cat) : '');
    a.textContent = opts.label || '◀ トップへ';
    var put = function () { document.body.appendChild(a); };
    if (document.body) put(); else document.addEventListener('DOMContentLoaded', put);
    return a;
  }

  /* ---------- 学習時間をはかって、5分ごとにごほうび ---------- */
  function coinNote() { var r = learnLog(); return r.c >= LEARN_CAP ? '（今日の学習コインは上限です）' : '（今日 ' + r.c + ' / ' + LEARN_CAP + ' C）'; }
  var lastAct = 0;
  ['pointerdown', 'keydown', 'touchstart', 'wheel', 'input'].forEach(function (ev) { addEventListener(ev, function () { lastAct = Date.now(); }, { passive: true, capture: true }); });
  function studyTick() {
    var now = Date.now();
    if (document.hidden || now - lastAct > 60000) return;            // 1分以上さわっていないときは数えない
    var last = parseInt(LS.get('mun_study_tick')) || 0;
    if (now - last < 14000) return;                                   // 2つのタブで同時に数えないように
    LS.set('mun_study_tick', now);
    var d = load('mun_study_day', null); if (!d || d.date !== today()) d = { date: today(), sec: 0, paid: 0 };
    d.sec += 15;
    var steps = Math.floor(d.sec / STUDY_STEP);
    if (steps > d.paid) {
      d.paid = steps; save('mun_study_day', d);
      var e = STUDY_EXP, c = learnCoins(STUDY_COIN); addExp(e);
      toast('学習' + steps * 5 + '分！ +' + e + ' EXP' + (c ? ' / +' + c + ' C' : '') + coinNote());
    } else save('mun_study_day', d);
  }

  /* ---------- 自動の「もどる」ボタン ---------- */
  var ME = document.currentScript;
  var CAT = { '3nennseisannsuu': 'math3', '4nennseisannsuu': 'math4', '4nenn': 'math4', '5nenseisannsuu': 'math5', '5nennseisannsuu': 'math5',
              '6nennseisannsuu': 'math6', 'kokugo': 'kokugo', 'syakai': 'social', 'tanosikugakusyuusiyou': 'game', 'kurasuyou': 'class',
              '1nennseiyougakusyuugame': 'grade1', 'sienngaxtukyuu': 'support', 'kakari': 'duty' };
  function autoBack() {
    var pos = (ME && ME.getAttribute('data-back')) || 'bottom-left';
    if (pos === 'off' || window.top !== window.self) return;
    var seg = location.pathname.split('/').filter(Boolean);
    if (seg.length < 2) return;                       // トップページ（/index.html）では出さない
    var cat = CAT[decodeURIComponent(seg[0])] || '';
    var a = document.createElement('a');
    a.className = 'mq-back mq-back-auto mq-' + pos;
    a.href = location.origin + '/index.html' + (cat ? '?cat=' + cat : '');
    a.setAttribute('aria-label', 'トップページにもどる');
    a.innerHTML = '<span aria-hidden="true">◀</span> もどる';
    ensureStyle();
    var put = function () { if (!document.body.contains(a)) document.body.appendChild(a); };
    put(); setInterval(put, 2000);                     // アプリが画面を書きかえても、ボタンが消えないように
  }

  /* ---------- 休けいのお知らせ（保護者が設定したときだけ） ---------- */
  var IDLE = 20 * 60 * 1000;   // 20分さわらなければ「休けいした」とみなす
  function sessionTick() {
    var cfg = load('mun_break', null), now = Date.now();
    var s = load('mun_session', null);
    if (!s || now - (s.last || 0) > IDLE) s = { start: now, last: now, snooze: 0 };
    s.last = now; save('mun_session', s);
    if (!cfg || !(cfg.min > 0) || document.hidden) return;
    if (document.querySelector('.mq-break')) return;
    if (now < (s.snooze || 0)) return;
    if (now - s.start >= cfg.min * 60000) showBreak(cfg.min);
  }
  function showBreak(min) {
    ensureStyle();
    var o = document.createElement('div'); o.className = 'mq-break'; o.setAttribute('role', 'dialog');
    o.innerHTML = '<div class="mq-break-box"><div class="ic">🌿</div><h2>ひと休みしよう！</h2>' +
      '<p>' + min + '分 つづけて がんばったね。</p><p>目を とおくの みどりに むけて、<br>のびを したり、水を のんだり しよう。</p>' +
      '<button class="ok" type="button">休けいした！</button><button class="later" type="button">あと5分だけ</button></div>';
    o.querySelector('.ok').onclick = function () { var s = load('mun_session', {}); s.start = Date.now(); s.snooze = 0; save('mun_session', s); o.remove(); };
    o.querySelector('.later').onclick = function () { var s = load('mun_session', {}); s.snooze = Date.now() + 5 * 60000; save('mun_session', s); o.remove(); };
    document.body.appendChild(o);
  }
  function startSession() { sessionTick(); setInterval(sessionTick, 30000); document.addEventListener('visibilitychange', function () { if (!document.hidden) sessionTick(); }); }
  function boot() { startSession(); autoBack(); if (location.pathname.split('/').filter(Boolean).length >= 2) setInterval(studyTick, 15000); }
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);

  window.MunQuest = { complete: complete, setTotal: setTotal, getProgress: getProgress, visit: visit, backButton: backButton, toast: toast, version: '1.2', learnCoins: function () { return learnLog().c; } };
})();
