/* =====================================================================
   むんラボ（MUN LAB）共通プログラム  lab-core.js  2026.11
   ---------------------------------------------------------------------
   ・記録はこの端末のブラウザ（localStorage）の中だけ。外部には送りません。
   ・コインとEXPは、トップページと同じ mun_coins / mun_exp / mun_daily_exp を使います。
   ・むんラボの記録は mun_lab の1つにまとめています。
===================================================================== */
(function () {
  'use strict';
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const load = (k, d) => { try { const v = JSON.parse(LS.get(k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => LS.set(k, JSON.stringify(v));
  const p2 = n => String(n).padStart(2, '0');
  const ymd = (d = new Date()) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  // 日付（テスト用に ?d=2026-12-24 で日付を変えられる）
  const today = () => { const q = new URLSearchParams(location.search).get('d'); if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) { const [y, m, d] = q.split('-').map(Number); return new Date(y, m - 1, d, 12); } return new Date(); };

  const FX = () => window.LAB_FX || { play() {}, celebrate() {}, pop() {}, shake() {}, count(el, v) { if (el) el.textContent = v.toLocaleString(); }, confetti() {}, flash() {} };
  /* ---------- むんラボの記録 ---------- */
  const KEY = 'mun_lab';
  const blank = () => ({ v: 1, trophies: {}, nazo: {}, ghost: {}, boss: {}, robot: {}, creator: { made: 0, played: 0 }, room: { owned: [], avatar: null, place: {} }, zatsu: { seen: [] }, events: {}, season: { hist: {} }, stats: { correct: 0, streak: 0, best: 0, answered: 0 }, day: { date: '', c: 0, e: 0 }, units: {}, drill: {}, grade: null, teams: 0, classQ: 0 });
  function get() { const d = load(KEY, null); const b = blank(); if (!d || typeof d !== 'object') return b; for (const k in b) if (d[k] == null) d[k] = b[k]; return d; }
  function put(d) { save(KEY, d); }
  function update(fn) { const d = get(); fn(d); put(d); return d; }

  /* ---------- コイン・EXP（1日の上限つき） ---------- */
  const DAY_COIN_CAP = 8000, DAY_EXP_CAP = 300;
  const coins = () => parseInt(LS.get('mun_coins')) || 0;
  const exp = () => parseInt(LS.get('mun_exp')) || 0;
  const level = () => Math.floor(exp() / 100) + 1;
  function addExpRaw(e) {
    if (!(e > 0)) return;
    LS.set('mun_exp', exp() + e);
    const log = load('mun_daily_exp', {}), k = new Date().toDateString(); log[k] = (log[k] || 0) + e; save('mun_daily_exp', log);
  }
  function reward(o) {
    o = o || {};
    let gc = 0, ge = 0;
    update(d => {
      if (d.day.date !== ymd()) d.day = { date: ymd(), c: 0, e: 0 };
      // トロフィーのごほうび（1回きり）は、1日の上限に関係なくもらえる
      gc = o.nocap ? Math.max(0, o.coins || 0) : Math.max(0, Math.min(o.coins || 0, DAY_COIN_CAP - d.day.c));
      ge = Math.max(0, Math.min(o.exp || 0, DAY_EXP_CAP - d.day.e));
      if (!o.nocap) d.day.c += gc; d.day.e += ge;
    });
    if (gc) LS.set('mun_coins', coins() + gc);
    if (ge) addExpRaw(ge);
    if (gc && !o.quiet) FX().play('coin');
    if (!o.silent && (gc || ge || o.reason)) toast(`${o.reason || 'ごほうび'}${gc ? ` +${gc.toLocaleString()} C` : ''}${ge ? ` +${ge} EXP` : ''}${(o.coins && !gc) ? '（今日のラボのコインは上限です）' : ''}`, 'fa-coins');
    refreshHead();
    return { coins: gc, exp: ge };
  }
  function spend(n) { if (coins() < n) return false; LS.set('mun_coins', coins() - n); refreshHead(); return true; }

  /* ---------- 学習時間（メーターに入る） ---------- */
  let lastAct = Date.now();
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true }));
  setInterval(() => {
    if (document.hidden || Date.now() - lastAct > 60000) return;
    const lg = load('mun_study_log', {}), k = ymd(); lg[k] = (lg[k] || 0) + 15;
    const ks = Object.keys(lg).sort(); while (ks.length > 120) delete lg[ks.shift()];
    save('mun_study_log', lg);
  }, 15000);

  /* ---------- 正解の連続記録 ---------- */
  function answered(ok, q) {
    update(d => {
      d.stats.answered++; if (ok) { d.stats.correct++; d.stats.streak++; d.stats.best = Math.max(d.stats.best, d.stats.streak); } else d.stats.streak = 0;
      // 単元ごとの記録（最近10問の正誤）→「にがて」を見つける
      if (q && q.u) { const u = d.units[q.u] || { a: 0, w: 0, r: '' }; u.a++; if (!ok) u.w++; u.r = (u.r + (ok ? '1' : '0')).slice(-10); u.t = ymd(); d.units[q.u] = u; }
    });
    track('answer'); if (ok) { track('correct'); track('combo', get().stats.streak, true); }
    if (ok) checkTrophies();
  }

  /* ---------- 今日のミッション（毎日3つ。日付で決まるので、だれでも同じ日には同じミッション） ---------- */
  const MISSIONS = [
    { id: 'correct', n: 10, ic: 'fa-circle-check', t: '問題に10問正解する', href: 'drill.html', learn: 1 },
    { id: 'answer', n: 20, ic: 'fa-pen', t: '問題に20問答える', href: 'drill.html', learn: 1 },
    { id: 'drill', n: 1, ic: 'fa-bullseye', t: '単元ミニテストを1回うける', href: 'drill.html', learn: 1 },
    { id: 'combo', n: 5, ic: 'fa-fire', t: '5問連続で正解する', href: 'ghost.html', learn: 1 },
    { id: 'zatsu', n: 1, ic: 'fa-lightbulb', t: '今日の雑学カードを読む', href: 'zatsugaku.html' },
    { id: 'robot', n: 1, ic: 'fa-robot', t: 'ロボットを1ステージクリア', href: 'robot.html' },
    { id: 'nazo', n: 2, ic: 'fa-door-closed', t: '謎解きのなぞを2つ解く', href: 'nazo.html' },
    { id: 'ghost', n: 1, ic: 'fa-ghost', t: 'ゴーストレースを1回走る', href: 'ghost.html' },
    { id: 'boss', n: 5, ic: 'fa-dragon', t: 'ボスに5回攻撃を当てる', href: 'boss.html' }
  ];
  const MIS_EACH = { coins: 200, exp: 5 }, MIS_ALL = { coins: 500, exp: 10 };
  function seedRand(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; }
  function todayMissions(d = today()) {
    const r = seedRand('mis' + ymd(d)), learn = MISSIONS.filter(m => m.learn), other = MISSIONS.filter(m => !m.learn);
    const a = learn[Math.floor(r() * learn.length)];
    const rest = MISSIONS.filter(m => m !== a && !(m.learn && a.learn && (m.id === 'answer' || a.id === 'answer') && (m.id === 'correct' || a.id === 'correct')));
    const b = rest.splice(Math.floor(r() * rest.length), 1)[0];
    const c = other.filter(m => m !== b)[Math.floor(r() * (other.length - 1))];
    return [a, b, c];
  }
  function missionState() {
    const d = get(), k = ymd(today());
    const st = d.mis && d.mis.date === k ? d.mis : { date: k, c: {}, done: [], all: false };
    return { list: todayMissions().map(m => ({ ...m, cur: Math.min(m.n, st.c[m.id] || 0), done: st.done.includes(m.id) })), all: st.all, days: d.misDays || 0 };
  }
  function track(id, n = 1, asMax = false) {
    const ms = todayMissions(); if (!ms.some(m => m.id === id)) return;
    const k = ymd(today()); let newly = [], allNow = false;
    update(d => {
      if (!d.mis || d.mis.date !== k) d.mis = { date: k, c: {}, done: [], all: false };
      const c = d.mis.c; c[id] = asMax ? Math.max(c[id] || 0, n) : (c[id] || 0) + n;
      ms.forEach(m => { if (!d.mis.done.includes(m.id) && (c[m.id] || 0) >= m.n) { d.mis.done.push(m.id); newly.push(m); } });
      if (!d.mis.all && d.mis.done.length >= ms.length) { d.mis.all = true; d.misDays = (d.misDays || 0) + 1; allNow = true; }
    });
    newly.forEach(m => reward({ ...MIS_EACH, reason: `ミッション達成「${m.t}」` }));
    if (allNow) {
      reward({ ...MIS_ALL, silent: true });
      FX().celebrate({ kicker: 'DAILY MISSION // COMPLETE', title: '今日のミッション コンプリート！', sub: `ボーナス +${MIS_ALL.coins} C ・ +${MIS_ALL.exp} EXP<br>また明日も新しいミッションがとどきます。`, icon: 'fa-list-check', color: '#34d399', auto: 4200 });
    }
    if (newly.length) dispatchEvent(new CustomEvent('lab:mission'));
  }

  /* ---------- シーズン（1か月ごとのランク） ---------- */
  const MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
  // mun_daily_exp のキー（"Sun Nov 08 2026" 形式）を {y,m,d} にする。ブラウザにまかせず自分で読む
  function dayKeyParts(k) { const a = String(k).split(' '); if (a.length < 4 || !MON[a[1]]) return null; const y = +a[3], m = MON[a[1]], d = +a[2]; return (y && d) ? { y, m, d } : null; }
  function monthOfKey(k) { const a = String(k).split(' '); if (a.length < 4 || !MON[a[1]]) return null; return `${a[3]}-${p2(MON[a[1]])}`; }
  function monthPoints() { const out = {}; Object.entries(load('mun_daily_exp', {})).forEach(([k, v]) => { const m = monthOfKey(k); if (m) out[m] = (out[m] || 0) + (parseInt(v) || 0); }); return out; }
  const TIERS = [
    { id: 'bronze', name: 'ブロンズ', color: '#d97706', steps: [0, 100, 200] },
    { id: 'silver', name: 'シルバー', color: '#cbd5e1', steps: [300, 450, 600] },
    { id: 'gold', name: 'ゴールド', color: '#fbbf24', steps: [800, 1000, 1200] },
    { id: 'platinum', name: 'プラチナ', color: '#67e8f9', steps: [1500, 1800, 2100] },
    { id: 'master', name: 'マスター', color: '#f472b6', steps: [2500] }
  ];
  const DIV = ['III', 'II', 'I'];
  function rankOf(pts) {
    let cur = null, next = null;
    const flat = [];
    TIERS.forEach((t, ti) => t.steps.forEach((s, si) => flat.push({ t, ti, si, s, label: t.id === 'master' ? t.name : `${t.name} ${DIV[si]}` })));
    for (let i = 0; i < flat.length; i++) if (pts >= flat[i].s) { cur = flat[i]; next = flat[i + 1] || null; }
    const prog = next ? (pts - cur.s) / (next.s - cur.s) : 1;
    return { tier: cur.t, label: cur.label, pts, next: next ? next.s : null, nextLabel: next ? next.label : null, prog: Math.max(0, Math.min(1, prog)), tierIndex: cur.ti };
  }
  function season() {
    const d = today(), key = `${d.getFullYear()}-${p2(d.getMonth() + 1)}`;
    const mp = monthPoints(), pts = mp[key] || 0;
    const r = rankOf(pts);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    r.key = key; r.daysLeft = Math.ceil((end - d) / 86400000); r.month = d.getMonth() + 1;
    // これまでのシーズンの記録
    const hist = {}; Object.entries(mp).forEach(([m, v]) => { if (m < key) hist[m] = rankOf(v).label; });
    update(x => { x.season.hist = Object.assign({}, x.season.hist, hist); x.season.bestTier = Math.max(x.season.bestTier || 0, r.tierIndex, ...Object.values(mp).map(v => rankOf(v).tierIndex)); });
    return r;
  }
  // シーズン報酬：月が変わったら、前の月のランクに合わせてコインを1回だけ受け取れる
  const SEASON_PAY = [300, 1000, 2000, 3500, 6000];
  function seasonReward() {
    const d = today(), pm = new Date(d.getFullYear(), d.getMonth() - 1, 1), key = `${pm.getFullYear()}-${p2(pm.getMonth() + 1)}`;
    const pts = monthPoints()[key] || 0; if (!pts) return null;
    const r = rankOf(pts), paid = !!((get().season.paid || {})[key]);
    return { key, month: pm.getMonth() + 1, label: r.label, tier: r.tier, ti: r.tierIndex, coins: SEASON_PAY[r.tierIndex], paid };
  }
  function claimSeason() {
    const r = seasonReward(); if (!r || r.paid) return null;
    update(x => { x.season.paid = Object.assign({}, x.season.paid, { [r.key]: r.label }); });
    reward({ coins: r.coins, exp: 0, silent: true, nocap: true });
    FX().celebrate({ kicker: `SEASON ${r.key.replace('-', '.')} // REWARD`, title: `${r.month}月のシーズン報酬`, sub: `最終ランク「${esc(r.label)}」<br><b style="color:${r.tier.color}">+${r.coins.toLocaleString()} C</b>`, html: BADGE(r.tier, 84), color: r.tier.color, big: r.ti >= 3 });
    checkTrophies(); return r;
  }
  const BADGE = (t, size = 44) => `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true"><defs><linearGradient id="bg${t.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.color}"/><stop offset="1" stop-color="#1e293b"/></linearGradient></defs><path d="M24 3l17 7v12c0 11-7 19-17 23C14 41 7 33 7 22V10z" fill="url(#bg${t.id})" stroke="${t.color}" stroke-width="2"/><path d="M24 13l3.2 6.6 7.2 1-5.2 5 1.3 7.2L24 29.4l-6.5 3.4 1.3-7.2-5.2-5 7.2-1z" fill="#fff" opacity=".92"/></svg>`;

  /* ---------- 実績トロフィー ---------- */
  const CARDS = () => (window.LAB_CARDS || []);
  function ctx() {
    const vis = load('mun_visits', {}), lab = get();
    const visited = Object.keys(vis).filter(k => (vis[k] || {}).n > 0);
    const cards = CARDS(); const catOf = {}; cards.forEach(c => { catOf[c.id] = c.cat; });
    const cats = new Set(visited.map(id => catOf[id]).filter(Boolean));
    const subj = { math: [...cats].some(c => /^math/.test(c)), kokugo: cats.has('kokugo'), social: cats.has('social') || cats.has('history'), game: cats.has('game') };
    const lg = load('mun_study_log', {}); const studyMin = Math.round(Object.values(lg).reduce((a, b) => a + (b || 0), 0) / 60);
    const goals = Object.keys(load('mun_goal_days', {})).length;
    // 連続日数（EXPか学習時間がある日）
    const days = new Set(); Object.keys(load('mun_daily_exp', {})).forEach(k => { const a = k.split(' '); if (MON[a[1]]) days.add(`${a[3]}-${p2(MON[a[1]])}-${p2(a[2])}`); }); Object.keys(lg).forEach(k => days.add(k));
    let streak = 0; const d = new Date(); if (!days.has(ymd(d))) d.setDate(d.getDate() - 1); while (days.has(ymd(d))) { streak++; d.setDate(d.getDate() - 1); }
    const nazoClear = Object.values(lab.nazo).filter(r => r && r.cleared).length;
    const nazoNoHint = Object.values(lab.nazo).some(r => r && r.cleared && !r.hintUsed);
    const ghostModes = Object.keys(lab.ghost).filter(k => lab.ghost[k] && lab.ghost[k].best).length;
    const robotStars = Object.values(lab.robot).reduce((a, b) => a + (b || 0), 0);
    const robotCleared = Object.values(lab.robot).filter(v => v > 0).length;
    return {
      lab, visited: visited.length, subj, level: level(), coins: coins(), studyMin, goals, streak,
      skillCleared: lab.skillCleared || 0, nazoClear, nazoNoHint, nazoAllOpen: lab.nazoAllOpen || false,
      ghostWins: lab.ghostWins || 0, ghostModes, ghostFast: lab.ghostFast || false,
      bossKills: lab.bossKills || 0, bestCombo: lab.bestCombo || 0,
      made: lab.creator.made || 0, played: lab.creator.played || 0, owned: (lab.room.owned || []).length, avatar: !!lab.room.avatar,
      events: Object.keys(lab.events).length, zatsu: (lab.zatsu.seen || []).length, robotCleared, robotStars, robotTotal: window.ROBOT_LEVELS ? window.ROBOT_LEVELS.length : (lab.robotTotal || 12),
      bestTier: lab.season.bestTier || 0, bestStreak: lab.stats.best || 0, answered: lab.stats.answered || 0,
      holDays: (() => { let n = 0; Object.values(lab.hol || {}).forEach(h => Object.values((h && h.days) || {}).forEach(x => { if (x && (x.d || x.l || x.m)) n++; })); return n; })(),
      holFull: (() => { let n = 0; Object.values(lab.hol || {}).forEach(h => Object.values((h && h.days) || {}).forEach(x => { if (x && x.d && x.l && x.m) n++; })); return n; })(),
      reports: lab.reports || 0,
      drillRuns: lab.drillRuns || 0, drillPerfect: lab.drillPerfect || 0, weakRuns: lab.weakRuns || 0,
      drillMaster: Object.values(lab.drill || {}).filter(x => x && x.best >= 10).length,
      unitsTried: Object.keys(lab.units || {}).length,
      classKills: lab.classKills || 0, teams: lab.teams || 0, classQ: lab.classQ || 0, timerUsed: lab.timerUsed || 0,
      misDays: lab.misDays || 0, seasonPaid: Object.keys((lab.season || {}).paid || {}).length,
      hour: new Date().getHours(), dow: new Date().getDay()
    };
  }
  const R = { bronze: { n: 'ブロンズ', c: '#d97706', coin: 300 }, silver: { n: 'シルバー', c: '#cbd5e1', coin: 800 }, gold: { n: 'ゴールド', c: '#fbbf24', coin: 2000 }, platinum: { n: 'プラチナ', c: '#67e8f9', coin: 5000 } };
  const TROPHIES = [
    // 学習
    { id: 'first', g: '学習', r: 'bronze', ic: 'fa-shoe-prints', t: 'はじめの一歩', d: 'アプリを1つひらいた', f: c => c.visited >= 1 },
    { id: 'exp10', g: '学習', r: 'silver', ic: 'fa-compass', t: '探検家', d: '10種類のアプリをひらいた', f: c => c.visited >= 10 },
    { id: 'exp30', g: '学習', r: 'gold', ic: 'fa-map', t: '大冒険家', d: '30種類のアプリをひらいた', f: c => c.visited >= 30 },
    { id: 'allsub', g: '学習', r: 'silver', ic: 'fa-shapes', t: 'オールラウンダー', d: '算数・国語・社会・学習ゲームの全部に挑戦した', f: c => c.subj.math && c.subj.kokugo && c.subj.social && c.subj.game },
    { id: 'lv10', g: '学習', r: 'silver', ic: 'fa-bolt', t: 'レベル10', d: 'レベル10になった', f: c => c.level >= 10 },
    { id: 'lv30', g: '学習', r: 'gold', ic: 'fa-bolt-lightning', t: 'レベル30', d: 'レベル30になった', f: c => c.level >= 30 },
    { id: 'lv50', g: '学習', r: 'platinum', ic: 'fa-crown', t: 'レベル50', d: 'レベル50になった', f: c => c.level >= 50 },
    { id: 'm60', g: '学習', r: 'bronze', ic: 'fa-hourglass-half', t: '1時間の積みかさね', d: '学習時間が合計60分をこえた', f: c => c.studyMin >= 60 },
    { id: 'm600', g: '学習', r: 'gold', ic: 'fa-hourglass-end', t: '10時間の積みかさね', d: '学習時間が合計10時間をこえた', f: c => c.studyMin >= 600 },
    { id: 'goal3', g: '学習', r: 'bronze', ic: 'fa-stamp', t: 'はんこ3つ', d: '今日の学習の目標を3日達成した', f: c => c.goals >= 3 },
    { id: 'goal20', g: '学習', r: 'gold', ic: 'fa-stamp', t: 'はんこ20こ', d: '今日の学習の目標を20日達成した', f: c => c.goals >= 20 },
    { id: 'st3', g: '学習', r: 'bronze', ic: 'fa-fire', t: '3日連続', d: '3日続けて学習した', f: c => c.streak >= 3 },
    { id: 'st7', g: '学習', r: 'silver', ic: 'fa-fire-flame-curved', t: '1週間連続', d: '7日続けて学習した', f: c => c.streak >= 7 },
    { id: 'st30', g: '学習', r: 'platinum', ic: 'fa-fire-flame-simple', t: '30日連続', d: '30日続けて学習した', f: c => c.streak >= 30 },
    { id: 'c20', g: '学習', r: 'silver', ic: 'fa-link', t: '20問連続正解', d: 'むんラボの問題で20問続けて正解した', f: c => c.bestStreak >= 20 },
    { id: 'c100', g: '学習', r: 'platinum', ic: 'fa-infinity', t: '100問連続正解', d: 'むんラボの問題で100問続けて正解した', f: c => c.bestStreak >= 100 },
    // むんラボ
    { id: 'sk10', g: 'ラボ', r: 'silver', ic: 'fa-diagram-project', t: 'スキル解放10', d: 'スキルツリーで10この単元をクリア', f: c => c.skillCleared >= 10 },
    { id: 'sk40', g: 'ラボ', r: 'gold', ic: 'fa-diagram-project', t: 'スキル解放40', d: 'スキルツリーで40この単元をクリア', f: c => c.skillCleared >= 40 },
    { id: 'nz1', g: 'ラボ', r: 'bronze', ic: 'fa-door-open', t: 'はじめての脱出', d: '謎解きの部屋から1回脱出した', f: c => c.nazoClear >= 1 },
    { id: 'nzh', g: 'ラボ', r: 'gold', ic: 'fa-brain', t: 'ノーヒント脱出', d: 'ヒントを使わずに脱出した', f: c => c.nazoNoHint },
    { id: 'nzall', g: 'ラボ', r: 'platinum', ic: 'fa-key', t: '研究所マスター', d: '公開中のすべての部屋から脱出した', f: c => c.nazoAllOpen },
    { id: 'gh1', g: 'ラボ', r: 'bronze', ic: 'fa-ghost', t: 'ゴーストに勝った', d: '前の自分の記録をこえた', f: c => c.ghostWins >= 1 },
    { id: 'gh5', g: 'ラボ', r: 'silver', ic: 'fa-ghost', t: '5つのコース', d: 'ゴーストレースの5コースで記録を出した', f: c => c.ghostModes >= 5 },
    { id: 'ghf', g: 'ラボ', r: 'gold', ic: 'fa-gauge-high', t: '九九マッハ', d: '九九コース20問を30秒以内', f: c => c.ghostFast },
    { id: 'bs1', g: 'ラボ', r: 'silver', ic: 'fa-dragon', t: 'ボス撃破', d: '週替わりボスをたおした', f: c => c.bossKills >= 1 },
    { id: 'bsc', g: 'ラボ', r: 'gold', ic: 'fa-burst', t: '10コンボ', d: 'ボス戦で10コンボを決めた', f: c => c.bestCombo >= 10 },
    { id: 'mk1', g: 'ラボ', r: 'bronze', ic: 'fa-pen-ruler', t: '問題クリエイター', d: '自分で問題を作った', f: c => c.made >= 1 },
    { id: 'pl1', g: 'ラボ', r: 'bronze', ic: 'fa-people-arrows', t: '挑戦者', d: 'だれかが作った問題にチャレンジした', f: c => c.played >= 1 },
    { id: 'av', g: 'ラボ', r: 'bronze', ic: 'fa-user-astronaut', t: 'アバター誕生', d: 'アバターを保存した', f: c => c.avatar },
    { id: 'rm5', g: 'ラボ', r: 'silver', ic: 'fa-couch', t: 'インテリア好き', d: 'マイルームのアイテムを5こ手に入れた', f: c => c.owned >= 5 },
    { id: 'ev1', g: 'ラボ', r: 'bronze', ic: 'fa-calendar-check', t: 'イベント参加', d: '季節イベントに参加した', f: c => c.events >= 1 },
    { id: 'zt10', g: 'ラボ', r: 'bronze', ic: 'fa-lightbulb', t: '物知り', d: '雑学カードを10枚あつめた', f: c => c.zatsu >= 10 },
    { id: 'zt40', g: 'ラボ', r: 'gold', ic: 'fa-book-open-reader', t: '雑学博士', d: '雑学カードを40枚あつめた', f: c => c.zatsu >= 40 },
    { id: 'rb5', g: 'ラボ', r: 'bronze', ic: 'fa-robot', t: 'プログラマー見習い', d: 'ロボットパズルを5ステージクリア', f: c => c.robotCleared >= 5 },
    { id: 'rball', g: 'ラボ', r: 'platinum', ic: 'fa-microchip', t: 'パーフェクトコード', d: 'ロボットパズル全ステージで★3', f: c => c.robotTotal > 0 && c.robotStars >= c.robotTotal * 3 },
    { id: 'sg', g: 'ラボ', r: 'gold', ic: 'fa-medal', t: 'ゴールドランク', d: 'シーズンでゴールドに上がった', f: c => c.bestTier >= 2 },
    { id: 'sm', g: 'ラボ', r: 'platinum', ic: 'fa-trophy', t: 'マスターランク', d: 'シーズンでマスターに上がった', f: c => c.bestTier >= 4 },
    // ===== 2026.11.09 追加 =====
    { id: 'exp60', g: '学習', r: 'gold', ic: 'fa-map-location-dot', t: 'アプリマスター', d: '60種類のアプリをひらいた', f: c => c.visited >= 60 },
    { id: 'exp100', g: '学習', r: 'platinum', ic: 'fa-globe', t: '学習クエスト制覇', d: '100種類のアプリをひらいた', f: c => c.visited >= 100 },
    { id: 'lv20', g: '学習', r: 'silver', ic: 'fa-bolt', t: 'レベル20', d: 'レベル20になった', f: c => c.level >= 20 },
    { id: 'lv100', g: '学習', r: 'platinum', ic: 'fa-crown', t: 'レベル100', d: 'レベル100になった', f: c => c.level >= 100 },
    { id: 'm180', g: '学習', r: 'silver', ic: 'fa-hourglass-start', t: '3時間の積みかさね', d: '学習時間が合計3時間をこえた', f: c => c.studyMin >= 180 },
    { id: 'm1800', g: '学習', r: 'platinum', ic: 'fa-business-time', t: '30時間の積みかさね', d: '学習時間が合計30時間をこえた', f: c => c.studyMin >= 1800 },
    { id: 'st14', g: '学習', r: 'gold', ic: 'fa-fire-flame-curved', t: '2週間連続', d: '14日続けて学習した', f: c => c.streak >= 14 },
    { id: 'st100', g: '学習', r: 'platinum', ic: 'fa-sun', t: '100日連続', d: '100日続けて学習した', f: c => c.streak >= 100 },
    { id: 'goal50', g: '学習', r: 'platinum', ic: 'fa-stamp', t: 'はんこ50こ', d: '今日の学習の目標を50日達成した', f: c => c.goals >= 50 },
    { id: 'c50', g: '学習', r: 'gold', ic: 'fa-link', t: '50問連続正解', d: 'むんラボの問題で50問続けて正解した', f: c => c.bestStreak >= 50 },
    { id: 'ans500', g: '学習', r: 'silver', ic: 'fa-pen', t: '500問の努力', d: 'むんラボで500問に答えた', f: c => c.answered >= 500 },
    { id: 'ans2000', g: '学習', r: 'gold', ic: 'fa-pen-fancy', t: '2000問の努力', d: 'むんラボで2000問に答えた', f: c => c.answered >= 2000 },
    { id: 'dr1', g: 'ラボ', r: 'bronze', ic: 'fa-bullseye', t: 'はじめてのミニテスト', d: '単元ミニテストに挑戦した', f: c => c.drillRuns >= 1 },
    { id: 'drp', g: 'ラボ', r: 'silver', ic: 'fa-check-double', t: 'パーフェクト', d: 'ミニテストで10問ぜんぶ正解した', f: c => c.drillPerfect >= 1 },
    { id: 'dr10', g: 'ラボ', r: 'gold', ic: 'fa-graduation-cap', t: '単元マスター10', d: '10の単元で★3（10問正解）をとった', f: c => c.drillMaster >= 10 },
    { id: 'dr30', g: 'ラボ', r: 'platinum', ic: 'fa-user-graduate', t: '単元マスター30', d: '30の単元で★3をとった', f: c => c.drillMaster >= 30 },
    { id: 'hol1', g: 'ラボ', r: 'bronze', ic: 'fa-sun', t: '休みのはじめの一歩', d: '夏休み・冬休みチャレンジで、はじめてスタンプをおした', f: c => c.holDays >= 1 },
    { id: 'hol7', g: 'ラボ', r: 'silver', ic: 'fa-umbrella-beach', t: '休みの習慣', d: '休みチャレンジで7日ぶんのスタンプをあつめた', f: c => c.holDays >= 7 },
    { id: 'hol21', g: 'ラボ', r: 'gold', ic: 'fa-medal', t: '休みのチャンピオン', d: '休みチャレンジで3つぜんぶのスタンプの日が15日になった', f: c => c.holFull >= 15 },
    { id: 'rep1', g: 'ラボ', r: 'bronze', ic: 'fa-file-lines', t: 'ふりかえり名人', d: 'ふりかえりレポートをひらいて、印刷した', f: c => c.reports >= 1 },
    { id: 'wk1', g: 'ラボ', r: 'silver', ic: 'fa-dumbbell', t: 'にがてに立ち向かう', d: 'にがてミックスに挑戦した', f: c => c.weakRuns >= 1 },
    { id: 'un20', g: 'ラボ', r: 'silver', ic: 'fa-layer-group', t: '20単元に挑戦', d: '20の単元の問題に答えた', f: c => c.unitsTried >= 20 },
    { id: 'un50', g: 'ラボ', r: 'gold', ic: 'fa-cubes', t: '50単元に挑戦', d: '50の単元の問題に答えた', f: c => c.unitsTried >= 50 },
    { id: 'nz6', g: 'ラボ', r: 'silver', ic: 'fa-flask', t: '研究所から脱出', d: '第1章の6部屋から脱出した', f: c => c.nazoClear >= 6 },
    { id: 'nz12', g: 'ラボ', r: 'gold', ic: 'fa-water', t: '深海からの生還', d: '12部屋から脱出した', f: c => c.nazoClear >= 12 },
    { id: 'nz18', g: 'ラボ', r: 'gold', ic: 'fa-satellite', t: '宇宙からの帰還', d: '18部屋から脱出した', f: c => c.nazoClear >= 18 },
    { id: 'nz24', g: 'ラボ', r: 'platinum', ic: 'fa-hourglass-end', t: '時空の旅人', d: '全24部屋から脱出した', f: c => c.nazoClear >= 24 },
    { id: 'rb12', g: 'ラボ', r: 'silver', ic: 'fa-robot', t: 'きほんマスター', d: 'ロボットの1〜12ステージをクリア', f: c => c.robotCleared >= 12 },
    { id: 'rb24', g: 'ラボ', r: 'gold', ic: 'fa-repeat', t: 'くりかえし名人', d: 'ロボットの24ステージをクリア', f: c => c.robotCleared >= 24 },
    { id: 'rb36', g: 'ラボ', r: 'gold', ic: 'fa-layer-group', t: '二重ループの使い手', d: 'ロボットの全36ステージをクリア', f: c => c.robotCleared >= 36 },
    { id: 'gh10', g: 'ラボ', r: 'gold', ic: 'fa-flag-checkered', t: '10コース制覇', d: 'ゴーストレースの10コースで記録を出した', f: c => c.ghostModes >= 10 },
    { id: 'ghw10', g: 'ラボ', r: 'silver', ic: 'fa-ghost', t: 'ゴーストハンター', d: 'ゴーストに10回勝った', f: c => c.ghostWins >= 10 },
    { id: 'bs5', g: 'ラボ', r: 'gold', ic: 'fa-dragon', t: 'ボスハンター', d: '週替わりボスを5体たおした', f: c => c.bossKills >= 5 },
    { id: 'bs10', g: 'ラボ', r: 'platinum', ic: 'fa-skull', t: 'ボススレイヤー', d: '週替わりボスを10体たおした', f: c => c.bossKills >= 10 },
    { id: 'cb20', g: 'ラボ', r: 'platinum', ic: 'fa-burst', t: '20コンボ', d: 'ボス戦で20コンボを決めた', f: c => c.bestCombo >= 20 },
    { id: 'cl1', g: 'ラボ', r: 'silver', ic: 'fa-people-group', t: 'クラスの力', d: '大画面モードでボスをたおした', f: c => c.classKills >= 1 },
    { id: 'tm1', g: 'ラボ', r: 'bronze', ic: 'fa-flag', t: 'チーム対戦', d: 'ボス戦のチーム対戦をはじめた', f: c => c.teams >= 1 },
    { id: 'cq50', g: 'ラボ', r: 'gold', ic: 'fa-display', t: '大画面で50問', d: '大画面モードで50問出題した', f: c => c.classQ >= 50 },
    { id: 'tmr', g: 'ラボ', r: 'bronze', ic: 'fa-stopwatch', t: 'タイムキーパー', d: '授業ツールのタイマーを最後まで使った', f: c => c.timerUsed >= 1 },
    { id: 'mk5', g: 'ラボ', r: 'silver', ic: 'fa-pen-ruler', t: '問題作家', d: '問題を5セット作った', f: c => c.made >= 5 },
    { id: 'mk20', g: 'ラボ', r: 'gold', ic: 'fa-feather-pointed', t: '問題の達人', d: '問題を20セット作った', f: c => c.made >= 20 },
    { id: 'pl10', g: 'ラボ', r: 'silver', ic: 'fa-people-arrows', t: '挑戦者10', d: 'だれかが作った問題に10回チャレンジした', f: c => c.played >= 10 },
    { id: 'rm15', g: 'ラボ', r: 'gold', ic: 'fa-couch', t: 'コーディネーター', d: 'マイルームのアイテムを15こ手に入れた', f: c => c.owned >= 15 },
    { id: 'rm30', g: 'ラボ', r: 'platinum', ic: 'fa-house-chimney', t: 'ルームマスター', d: 'マイルームのアイテムを30こ手に入れた', f: c => c.owned >= 30 },
    { id: 'zt100', g: 'ラボ', r: 'gold', ic: 'fa-book-bookmark', t: '雑学マスター', d: '雑学カードを100枚あつめた', f: c => c.zatsu >= 100 },
    { id: 'zt200', g: 'ラボ', r: 'platinum', ic: 'fa-book-atlas', t: '雑学王', d: '雑学カードを200枚あつめた', f: c => c.zatsu >= 200 },
    { id: 'ev3', g: 'ラボ', r: 'silver', ic: 'fa-calendar-days', t: 'イベントの常連', d: '3つの季節イベントに参加した', f: c => c.events >= 3 },
    { id: 'ss', g: 'ラボ', r: 'silver', ic: 'fa-medal', t: 'シルバーランク', d: 'シーズンでシルバーに上がった', f: c => c.bestTier >= 1 },
    { id: 'sp', g: 'ラボ', r: 'platinum', ic: 'fa-gem', t: 'プラチナランク', d: 'シーズンでプラチナに上がった', f: c => c.bestTier >= 3 },
    { id: 'ms1', g: 'ラボ', r: 'bronze', ic: 'fa-list-check', t: 'ミッションコンプリート', d: '今日のミッションを3つとも達成した', f: c => c.misDays >= 1 },
    { id: 'ms7', g: 'ラボ', r: 'silver', ic: 'fa-calendar-week', t: 'ミッション7日', d: '今日のミッションを7日コンプリートした', f: c => c.misDays >= 7 },
    { id: 'ms30', g: 'ラボ', r: 'gold', ic: 'fa-calendar-check', t: 'ミッション30日', d: '今日のミッションを30日コンプリートした', f: c => c.misDays >= 30 },
    { id: 'sr1', g: 'ラボ', r: 'bronze', ic: 'fa-gift', t: 'シーズン報酬', d: '月が変わって、前のシーズンの報酬を受け取った', f: c => c.seasonPaid >= 1 },
    // ひみつのトロフィー（とるまで「？？？」）
    { id: 'hEarly', g: 'ひみつ', r: 'bronze', h: 1, ic: 'fa-cloud-sun', t: '朝の研究員', d: '朝5時〜8時のあいだに、むんラボをひらいた', f: c => c.hour >= 5 && c.hour < 8 },
    { id: 'hWeek', g: 'ひみつ', r: 'bronze', h: 1, ic: 'fa-umbrella-beach', t: '週末の研究員', d: '土曜日か日曜日に、むんラボをひらいた', f: c => c.dow === 0 || c.dow === 6 },
    { id: 'hLucky', g: 'ひみつ', r: 'silver', h: 1, ic: 'fa-clover', t: 'ラッキーセブン', d: 'コインの下3けたが「777」になった', f: c => c.coins % 1000 === 777 }
  ];
  let checking = false;
  function checkTrophies(quiet) {
    if (checking) return []; checking = true;
    const c = ctx(), got = [];
    TROPHIES.forEach(t => { if (!c.lab.trophies[t.id] && t.f(c)) got.push(t); });
    if (got.length) {
      update(d => got.forEach(t => { d.trophies[t.id] = ymd(); }));
      got.forEach((t, i) => setTimeout(() => {
        if (!quiet) FX().celebrate({ kicker: `TROPHY // ${R[t.r].n}`, title: `「${esc(t.t)}」`, sub: `${esc(t.d)}<br><b style="color:${R[t.r].c}">ごほうび +${R[t.r].coin.toLocaleString()} C</b>`, icon: t.ic, color: R[t.r].c, sound: 'trophy', auto: t.r === 'bronze' ? 3200 : 0, big: t.r === 'platinum' });
        reward({ coins: R[t.r].coin, silent: true, nocap: true, quiet: true });
      }, i * 900));
      dispatchEvent(new CustomEvent('lab:trophy', { detail: got.map(t => t.id) }));
    }
    checking = false; return got;
  }

  /* ---------- お知らせ ---------- */
  function toast(msg, icon = 'fa-circle-check', cls = '', html = false) {
    let box = $('#lab-toasts'); if (!box) { box = document.createElement('div'); box.id = 'lab-toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'lab-toast ' + cls;
    t.innerHTML = `<i class="fa-solid ${icon}"></i><span>${html ? msg : esc(msg)}</span>`;
    box.appendChild(t); setTimeout(() => t.remove(), 3800);
  }

  /* ---------- ヘッダー ---------- */
  function header(opt) {
    opt = opt || {};
    const h = document.createElement('header'); h.className = 'lab-head';
    const inLab = /\/lab\/(index\.html)?$/.test(location.pathname);
    h.innerHTML = `<div class="in">
      <a class="lab-brand" href="${inLab ? '../index.html' : './index.html'}"><span class="mk">む</span><span><b>${inLab ? 'むん先生の学習クエスト' : 'むんラボ'}</b><small>MUN LAB // ${esc(opt.sub || 'EXPERIMENTS')}</small></span></a>
      <nav class="lab-nav" aria-label="むんラボのメニュー">
        <a class="chip link" href="./season.html" title="シーズンランク"><span id="lh-rank"></span></a>
        <span class="chip" title="コイン"><i class="fa-solid fa-coins"></i><span id="lh-coins">0</span></span>
        <button class="chip link" type="button" id="lh-sfx" aria-pressed="true" title="効果音のオン・オフ"><i class="fa-solid fa-volume-high"></i></button>
        ${inLab ? '' : '<a class="chip link" href="./index.html"><i class="fa-solid fa-flask"></i><span class="lbl">ラボ</span></a>'}
        <a class="chip link" href="../index.html"><i class="fa-solid fa-house"></i><span class="lbl">トップ</span></a>
      </nav></div>`;
    document.body.prepend(h);
    const sb = h.querySelector('#lh-sfx'), sfxUI = () => { const o = FX().isOn ? FX().isOn() : true; sb.innerHTML = `<i class="fa-solid ${o ? 'fa-volume-high' : 'fa-volume-xmark'}"></i>`; sb.setAttribute('aria-pressed', o); sb.setAttribute('aria-label', o ? '効果音：オン' : '効果音：オフ'); };
    sb.addEventListener('click', () => { if (window.LAB_FX) LAB_FX.setOn(!LAB_FX.isOn()); sfxUI(); }); sfxUI();
    const f = document.createElement('footer'); f.className = 'lab-foot';
    f.innerHTML = `<p>© むん先生の学習クエスト ／ むんラボの記録は、この端末の中だけに保存されます。<br><a href="../kiyaku.html">利用規約</a> ・ <a href="../privacy.html">プライバシーポリシー</a> ・ <a href="../houkoku.html">うまく動かないとき</a></p>`;
    // ページの本文より下に置く（header() は body の先頭で呼ばれるので、読みこみが終わってから足す）
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => document.body.appendChild(f)); else document.body.appendChild(f);
    refreshHead();
    setTimeout(() => checkTrophies(), 600);
  }
  let headInit = false;
  function refreshHead() {
    const c = $('#lh-coins'); if (c) { if (headInit) FX().count(c, coins()); else c.textContent = coins().toLocaleString(); }
    const r = $('#lh-rank'); let s = null; if (r) { s = season(); r.innerHTML = `${BADGE(s.tier, 18)}<span class="lbl">${esc(s.label)}</span>`; r.style.display = 'inline-flex'; r.style.alignItems = 'center'; r.style.gap = '6px'; }
    headInit = true;
    // ランクアップ・レベルアップのお祝い（同じ月の中で、前に見たときより上がったとき）
    if (!s) s = season();
    const lv = level(), d = get(), rk = s.key + ':' + s.label, flat = rankIndex(s.pts);
    if (d.seen && d.seen.m === s.key && flat > d.seen.r) FX().celebrate({ kicker: 'RANK UP', title: `${esc(s.label)} にランクアップ！`, sub: `${s.month}月のシーズン。このまま上をめざそう。`, html: BADGE(s.tier, 84), color: s.tier.color, big: true });
    if (d.seen && d.seen.lv && lv > d.seen.lv) FX().celebrate({ kicker: 'LEVEL UP', title: `レベル ${lv} になった！`, sub: '学習を続けると、どんどん上がるよ。', icon: 'fa-bolt', color: '#00e5ff' });
    if (!d.seen || d.seen.m !== s.key || d.seen.r !== flat || d.seen.lv !== lv) update(x => { x.seen = { m: s.key, r: flat, lv, k: rk }; });
  }
  function rankIndex(pts) { let i = -1, k = 0; TIERS.forEach(t => t.steps.forEach(st => { if (pts >= st) i = k; k++; })); return i; }
  addEventListener('storage', e => { if (e.key === 'mun_coins' || e.key === 'mun_daily_exp') refreshHead(); });

  /* ---------- 問題バンク ---------- */
  const N = s => String(s == null ? '' : s).normalize('NFKC').trim().toLowerCase().replace(/\s+/g, '').replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)).replace(/[。、．，]/g, '');
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
  const dec = x => String(Math.round(x * 1000) / 1000);
  function numChoices(a) {
    const s = String(a), out = new Set([s]);
    if (/^\d+:\d+$/.test(s)) { const [x, y] = s.split(':').map(Number); [[y, x], [x + 1, y], [x, y + 1], [x * 2, y * 2]].forEach(([p, q]) => out.add(`${p}:${q}`)); }
    else if (/^\d+\/\d+$/.test(s)) { const [n, d] = s.split('/').map(Number); [[n + 1, d], [n, d + 1], [Math.max(1, n - 1), d], [d, n]].forEach(([p, q]) => out.add(frac(p, q))); }
    else { const v = Number(s), isDec = s.includes('.'); const st = isDec ? 0.1 : 1; [v + st, v - st, v + 10 * st, v * 2, v + 2 * st, v - 10 * st].forEach(x => { if (x >= 0) out.add(dec(x)); }); }
    out.delete(s); return shuffle([s, ...shuffle([...out]).slice(0, 3)]);
  }
  // わたしの学年（ハブで設定。未設定なら全学年から）
  const myGrade = () => { const g = get().grade; return g >= 1 && g <= 6 ? g : null; };
  const recentQ = [];
  // 単元の正答率（最近10問）
  function unitAcc(id) { const u = get().units[id]; if (!u || !u.r) return null; const r = u.r.split(''); return { n: u.a, acc: r.filter(x => x === '1').length / r.length, recent: r.length }; }
  function weakUnits(min = 3) { const d = get().units, out = []; for (const id in d) { const u = d[id]; if (!u.r || u.r.length < min || !window.LAB_Q || !LAB_Q.BYID[id]) continue; const acc = u.r.split('').filter(x => x === '1').length / u.r.length; if (acc < .7) out.push({ id, acc, n: u.a, unit: LAB_Q.BYID[id] }); } return out.sort((a, b) => a.acc - b.acc); }
  function choicesFor(q) {
    let w = (q.c || []).slice();
    if (w.length < 3 && !q.only) w = w.concat(numChoices(q.a).filter(x => x !== q.a && !w.includes(x)));
    w = shuffle([...new Set(w)].filter(x => x !== q.a)).slice(0, q.only ? 3 : 3);
    return shuffle([q.a, ...w]);
  }
  // g: 1〜6 または 'mix'
  // opt.choice: 4択にそろえる / opt.subj: ['算数','国語',…] / opt.units: 単元idの配列 / opt.weak: にがて優先
  function question(g = 'mix', opt = {}) {
    if (!window.LAB_Q) return { s: '算数', g: 2, q: '3 × 4', a: '12', kind: 'num', choices: ['12', '7', '13', '16'] };
    let pool;
    if (opt.units && opt.units.length) pool = LAB_Q.units({ ids: opt.units });
    else if (opt.weak) { const w = weakUnits(); pool = w.length ? w.map(x => x.unit) : null; }
    if (!pool || !pool.length) {
      const mg = g === 'mix' ? myGrade() : g;
      if (mg) {
        // その学年 7割・それより前の学年 3割（ふくしゅう）
        const cur = LAB_Q.units({ g: mg, subj: opt.subj }), prev = LAB_Q.units({ g: mg - 1, upto: true, subj: opt.subj });
        pool = (Math.random() < .7 || !prev.length) && cur.length ? cur : prev.length ? prev : cur;
      } else pool = LAB_Q.units({ subj: opt.subj }).filter(u => g !== 'mix' || u.g >= 2);
      if (!pool.length) pool = LAB_Q.units({});
    }
    // 教科のかたよりをへらす：まず教科を選んでから単元を選ぶ
    const subs = [...new Set(pool.map(u => u.s))];
    let q;
    for (let k = 0; k < 6; k++) {
      const sub = opt.subj ? pick(subs) : (subs.includes('算数') && Math.random() < .5 ? '算数' : pick(subs));
      const u = pick(pool.filter(x => x.s === sub));
      q = LAB_Q.make(u);
      if (!recentQ.includes(q.q)) break;
    }
    recentQ.push(q.q); if (recentQ.length > 30) recentQ.shift();
    q.kind = q.only ? 'choice' : (/^-?\d+(\.\d+)?$/.test(q.a) ? 'num' : 'text');
    if (opt.choice || q.only) { q.choices = choicesFor(q); q.kind = 'choice'; }
    return q;
  }
  const mathQ = g => question(g, { subj: ['算数'] });
  const bankQ = g => question(g === 'mix' ? 'mix' : g, { subj: ['国語', '社会', '理科', '英語'], choice: true });
  const check = (q, v) => N(v) === N(q.a) || (/^-?[\d.]+$/.test(N(q.a)) && Number(N(v).replace(/^\./, '0.')) === Number(N(q.a)) && N(v) !== '');

  /* ---------- 4択の画面をつくる ---------- */
  function renderChoice(box, q, onAnswer, o = {}) {
    if (!q.choices) q.choices = choicesFor(q);
    box.innerHTML = `<div class="q-box"><span class="q-tag">${esc(q.s)}${q.g ? `・${q.g}年` : ''}${q.un ? `<em>${esc(q.un)}</em>` : ''}</span><div class="q-text">${esc(q.q)}</div><div class="choices ${q.choices.length === 2 ? 'two' : ''}">${q.choices.map((c, i) => `<button type="button" class="choice" data-v="${esc(c)}"><span class="k">${'ABCD'[i]}</span>${esc(c)}</button>`).join('')}</div><div class="feedback" aria-live="polite"></div></div>`;
    let done = false;
    $$('.choice', box).forEach(b => b.addEventListener('click', () => {
      if (done) return; done = true;
      const ok = check(q, b.dataset.v);
      b.classList.add(ok ? 'ok' : 'ng'); box.querySelector('.q-box').classList.add(ok ? 'is-ok' : 'is-ng');
      $$('.choice', box).forEach(x => { x.disabled = true; if (!ok && check(q, x.dataset.v)) x.classList.add('ok'); });
      if (!o.silent) FX().play(ok ? 'ok' : 'ng');
      const fb = $('.feedback', box); fb.className = 'feedback ' + (ok ? 'ok' : 'ng');
      fb.innerHTML = ok ? `<b>せいかい！</b>${q.e && o.explainOk ? ` <span class="ex">${esc(q.e)}</span>` : ''}` : `<b>ざんねん…</b> 答えは「${esc(q.a)}」${q.e ? `<span class="ex">${esc(q.e)}</span>` : ''}`;
      answered(ok, q); onAnswer && onAnswer(ok, q);
    }));
    const keyH = e => { if (done || !box.isConnected) return removeEventListener('keydown', keyH); if (e.target.closest && e.target.closest('input,textarea')) return; const i = 'abcd1234'.indexOf(e.key.toLowerCase()) % 4; if (i >= 0 && e.key.length === 1) { const b = $$('.choice', box)[i]; b && b.click(); } };
    addEventListener('keydown', keyH);
  }

  /* ---------- 週の計算 ---------- */
  function mondayOf(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; }
  const weekNo = (d = today()) => Math.round((mondayOf(d) - new Date(2026, 0, 5)) / 604800000);
  const weekKey = (d = today()) => ymd(mondayOf(d));

  window.LAB = { SEASON_PAY, seasonReward, claimSeason, MISSIONS, todayMissions, missionState, track, seedRand, FX, myGrade, unitAcc, weakUnits, choicesFor, rankIndex, dayKeyParts, mondayOf, weekNo, weekKey, LS, load, save, get, put, update, ymd, p2, esc, $, $$, rnd, pick, shuffle, today, reward, spend, coins, exp, level, season, rankOf, TIERS, BADGE, TROPHIES, RAR: R, checkTrophies, ctx, toast, header, refreshHead, question, mathQ, bankQ, numChoices, check, N, renderChoice, answered, frac, dec };
})();
