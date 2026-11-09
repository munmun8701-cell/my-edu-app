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

  /* ---------- むんラボの記録 ---------- */
  const KEY = 'mun_lab';
  const blank = () => ({ v: 1, trophies: {}, nazo: {}, ghost: {}, boss: {}, robot: {}, creator: { made: 0, played: 0 }, room: { owned: [], avatar: null, place: {} }, zatsu: { seen: [] }, events: {}, season: { hist: {} }, stats: { correct: 0, streak: 0, best: 0, answered: 0 }, day: { date: '', c: 0, e: 0 } });
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
  function answered(ok) {
    update(d => { d.stats.answered++; if (ok) { d.stats.correct++; d.stats.streak++; d.stats.best = Math.max(d.stats.best, d.stats.streak); } else d.stats.streak = 0; });
    if (ok) checkTrophies();
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
      bestTier: lab.season.bestTier || 0, bestStreak: lab.stats.best || 0
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
    { id: 'sm', g: 'ラボ', r: 'platinum', ic: 'fa-trophy', t: 'マスターランク', d: 'シーズンでマスターに上がった', f: c => c.bestTier >= 4 }
  ];
  let checking = false;
  function checkTrophies(quiet) {
    if (checking) return []; checking = true;
    const c = ctx(), got = [];
    TROPHIES.forEach(t => { if (!c.lab.trophies[t.id] && t.f(c)) got.push(t); });
    if (got.length) {
      update(d => got.forEach(t => { d.trophies[t.id] = ymd(); }));
      got.forEach((t, i) => setTimeout(() => {
        if (!quiet) toast(`<b>トロフィー獲得！</b>「${esc(t.t)}」<small>${R[t.r].n} ／ ${esc(t.d)}</small>`, t.ic, 'trophy', true);
        reward({ coins: R[t.r].coin, silent: true, nocap: true });
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
        ${inLab ? '' : '<a class="chip link" href="./index.html"><i class="fa-solid fa-flask"></i><span class="lbl">ラボ</span></a>'}
        <a class="chip link" href="../index.html"><i class="fa-solid fa-house"></i><span class="lbl">トップ</span></a>
      </nav></div>`;
    document.body.prepend(h);
    const f = document.createElement('footer'); f.className = 'lab-foot';
    f.innerHTML = `<p>© むん先生の学習クエスト ／ むんラボの記録は、この端末の中だけに保存されます。<br><a href="../kiyaku.html">利用規約</a> ・ <a href="../privacy.html">プライバシーポリシー</a> ・ <a href="../houkoku.html">うまく動かないとき</a></p>`;
    // ページの本文より下に置く（header() は body の先頭で呼ばれるので、読みこみが終わってから足す）
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => document.body.appendChild(f)); else document.body.appendChild(f);
    refreshHead();
    setTimeout(() => checkTrophies(), 600);
  }
  function refreshHead() {
    const c = $('#lh-coins'); if (c) c.textContent = coins().toLocaleString();
    const r = $('#lh-rank'); if (r) { const s = season(); r.innerHTML = `${BADGE(s.tier, 18)}<span class="lbl">${esc(s.label)}</span>`; r.style.display = 'inline-flex'; r.style.alignItems = 'center'; r.style.gap = '6px'; }
  }
  addEventListener('storage', e => { if (e.key === 'mun_coins' || e.key === 'mun_daily_exp') refreshHead(); });

  /* ---------- 問題バンク ---------- */
  const N = s => String(s == null ? '' : s).normalize('NFKC').trim().toLowerCase().replace(/\s+/g, '').replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)).replace(/[。、．，]/g, '');
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
  const dec = x => String(Math.round(x * 1000) / 1000);
  const MATH = {
    1: [() => { const a = rnd(1, 9), b = rnd(1, 9); return [`${a} ＋ ${b}`, a + b]; }, () => { const a = rnd(10, 18), b = rnd(1, 9); return [`${a} − ${b}`, a - b]; }],
    2: [() => { const a = rnd(2, 9), b = rnd(2, 9); return [`${a} × ${b}`, a * b]; }, () => { const a = rnd(12, 68), b = rnd(11, 31); return [`${a} ＋ ${b}`, a + b]; }, () => { const a = rnd(40, 99), b = rnd(11, 39); return [`${a} − ${b}`, a - b]; }],
    3: [() => { const b = rnd(2, 9), q = rnd(2, 9); return [`${b * q} ÷ ${b}`, q]; }, () => { const a = rnd(12, 49), b = rnd(2, 9); return [`${a} × ${b}`, a * b]; }, () => { const a = rnd(120, 680), b = rnd(105, 299); return [`${a} ＋ ${b}`, a + b]; }, () => { const b = rnd(3, 9), q = rnd(2, 9), r = rnd(1, b - 1); return [`${b * q + r} ÷ ${b} のあまり`, r]; }],
    4: [() => { const b = rnd(2, 6), q = rnd(11, 29); return [`${b * q} ÷ ${b}`, q]; }, () => { const a = rnd(11, 59), b = rnd(11, 39); return [`${a / 10} ＋ ${b / 10}`, dec((a + b) / 10)]; }, () => { const x = rnd(20, 160); return [`一直線は180°。${x}° のとなりの角は何度？`, 180 - x]; }, () => { const a = rnd(21, 89), b = rnd(11, 19); return [`${a} × ${b}`, a * b]; }],
    5: [() => { const a = rnd(12, 48), b = rnd(2, 9); return [`${a / 10} × ${b}`, dec(a * b / 10)]; }, () => { const ds = pick([[2, 3], [3, 4], [2, 5], [4, 6], [3, 6]]); const a = 1, b = 1; return [`${a}/${ds[0]} ＋ ${b}/${ds[1]}（分数で）`, frac(ds[1] + ds[0], ds[0] * ds[1])]; }, () => { const bse = rnd(3, 12) * 2, h = rnd(3, 12); return [`底辺${bse}cm、高さ${h}cmの三角形の面積（cm²）`, bse * h / 2]; }, () => { const avg = rnd(4, 9), arr = [avg - 2, avg + 1, avg, avg + 1]; return [`${arr.join('、')} の平均`, (arr.reduce((p, q) => p + q, 0)) / 4]; }],
    6: [() => { const d = pick([3, 4, 5, 7]), n = rnd(1, d - 1), k = rnd(2, 5); return [`${n}/${d} × ${k}（分数で）`, frac(n * k, d)]; }, () => { const g = rnd(2, 6), a = rnd(1, 5), b = rnd(a + 1, 7); if (gcd(a, b) !== 1) return [`${2 * g}:${3 * g} をかんたんな比に`, '2:3']; return [`${a * g}:${b * g} をかんたんな比に`, `${a}:${b}`]; }, () => { const r = rnd(2, 10); return [`半径${r}cmの円の面積（円周率3.14）`, dec(r * r * 3.14)]; }, () => { const v = pick([40, 50, 60, 80]), t = pick([2, 3, 4]); return [`時速${v}kmで${t}時間進むと何km？`, v * t]; }]
  };
  // 4択の問題（漢字・歴史・理科・地理・英語）
  const BANK = [
    ...[['春', 'はる', 2], ['朝', 'あさ', 2], ['歌', 'うた', 2], ['船', 'ふね', 2], ['雪', 'ゆき', 2], ['湖', 'みずうみ', 3], ['港', 'みなと', 3], ['豆', 'まめ', 3], ['宮', 'みや', 3], ['旅', 'たび', 3], ['鏡', 'かがみ', 4], ['街', 'まち', 4], ['巣', 'す', 4], ['束', 'たば', 4], ['梅', 'うめ', 4], ['志', 'こころざし', 5], ['暴れる', 'あばれる', 5], ['導く', 'みちびく', 5], ['築く', 'きずく', 5], ['険しい', 'けわしい', 5], ['誤る', 'あやまる', 6], ['幼い', 'おさない', 6], ['縦', 'たて', 6], ['宝', 'たから', 6], ['敬う', 'うやまう', 6]]
      .map(([k, y, g], i, all) => ({ s: '漢字', g, q: `「${k}」の読みは？`, a: y, w: all.filter(x => x[1] !== y && x[1].length === y.length).map(x => x[1]).concat(all.filter(x => x[1] !== y).map(x => x[1])) })),
    { s: '歴史', g: 6, q: '十七条の憲法を定め、法隆寺を建てたとされる人物は？', a: '聖徳太子', w: ['中大兄皇子', '聖武天皇', '小野妹子'] },
    { s: '歴史', g: 6, q: '奈良の大仏をつくることを命じた天皇は？', a: '聖武天皇', w: ['天智天皇', '推古天皇', '桓武天皇'] },
    { s: '歴史', g: 6, q: '『源氏物語』を書いた人物は？', a: '紫式部', w: ['清少納言', '小野小町', '藤原道長'] },
    { s: '歴史', g: 6, q: '『枕草子』を書いた人物は？', a: '清少納言', w: ['紫式部', '与謝野晶子', '樋口一葉'] },
    { s: '歴史', g: 6, q: '鎌倉に幕府を開いた人物は？', a: '源頼朝', w: ['足利尊氏', '平清盛', '徳川家康'] },
    { s: '歴史', g: 6, q: '元（モンゴル）が攻めてきたときの鎌倉幕府の執権は？', a: '北条時宗', w: ['北条政子', '源義経', '足利義満'] },
    { s: '歴史', g: 6, q: '京都の北山に金閣を建てた将軍は？', a: '足利義満', w: ['足利義政', '足利尊氏', '徳川家光'] },
    { s: '歴史', g: 6, q: '京都の東山に銀閣を建てた将軍は？', a: '足利義政', w: ['足利義満', '織田信長', '豊臣秀吉'] },
    { s: '歴史', g: 6, q: '検地と刀狩を行い、全国を統一した人物は？', a: '豊臣秀吉', w: ['織田信長', '徳川家康', '武田信玄'] },
    { s: '歴史', g: 6, q: '江戸に幕府を開いた人物は？', a: '徳川家康', w: ['徳川家光', '豊臣秀吉', '徳川吉宗'] },
    { s: '歴史', g: 6, q: '参勤交代を制度として定めた将軍は？', a: '徳川家光', w: ['徳川家康', '徳川綱吉', '徳川慶喜'] },
    { s: '歴史', g: 6, q: 'オランダ語の医学書をほん訳し『解体新書』を出版した人物は？', a: '杉田玄白', w: ['本居宣長', '伊能忠敬', '野口英世'] },
    { s: '歴史', g: 6, q: '全国を歩いて測量し、正確な日本地図をつくった人物は？', a: '伊能忠敬', w: ['杉田玄白', '歌川広重', '坂本龍馬'] },
    { s: '歴史', g: 6, q: '1853年、黒船を率いて浦賀に来航したアメリカの人物は？', a: 'ペリー', w: ['ザビエル', 'ハリス', 'リンカン'] },
    { s: '歴史', g: 6, q: '『学問のすすめ』を書いた人物は？', a: '福沢諭吉', w: ['大隈重信', '板垣退助', '伊藤博文'] },
    { s: '歴史', g: 6, q: '1911年、関税自主権の回復に成功した外務大臣は？', a: '小村寿太郎', w: ['陸奥宗光', '伊藤博文', '大久保利通'] },
    { s: '理科', g: 3, q: 'こん虫の体は、頭・むねと、もう1つは？', a: 'はら', w: ['しっぽ', 'こし', 'せなか'] },
    { s: '理科', g: 3, q: '方位磁針のN極がさす方位は？', a: '北', w: ['南', '東', '西'] },
    { s: '理科', g: 3, q: '太陽がしずむのは、どの方位？', a: '西', w: ['東', '南', '北'] },
    { s: '理科', g: 4, q: '水がふっとうする温度は、およそ何℃？', a: '100℃', w: ['50℃', '80℃', '0℃'] },
    { s: '理科', g: 4, q: '空気をあたためると、体積はどうなる？', a: '大きくなる', w: ['小さくなる', '変わらない', 'なくなる'] },
    { s: '理科', g: 4, q: '夏の大三角をつくる星ではないものは？', a: 'ベテルギウス', w: ['ベガ', 'アルタイル', 'デネブ'] },
    { s: '理科', g: 5, q: 'ふりこが1往復する時間を変えるのは？', a: 'ふりこの長さ', w: ['おもりの重さ', 'ふれはば', '糸の色'] },
    { s: '理科', g: 5, q: '電磁石を強くする方法は？', a: 'コイルのまき数をふやす', w: ['導線を短く切る', '鉄心をぬく', '電池を1こへらす'] },
    { s: '理科', g: 6, q: '植物が日光を受けて、でんぷんをつくるはたらきは？', a: '光合成', w: ['呼吸', '蒸散', '発芽'] },
    { s: '理科', g: 6, q: '石灰水を白くにごらせる気体は？', a: '二酸化炭素', w: ['酸素', 'ちっ素', '水素'] },
    { s: '理科', g: 6, q: '血液を全身に送り出す臓器は？', a: '心臓', w: ['肺', '胃', 'かん臓'] },
    { s: '理科', g: 6, q: 'てこで、小さな力で物を持ち上げるには？', a: '力点を支点から遠くする', w: ['力点を支点に近づける', '作用点を支点から遠くする', '支点をなくす'] },
    ...[['宮城県', '仙台市'], ['石川県', '金沢市'], ['愛媛県', '松山市'], ['兵庫県', '神戸市'], ['神奈川県', '横浜市'], ['愛知県', '名古屋市'], ['香川県', '高松市'], ['岩手県', '盛岡市'], ['栃木県', '宇都宮市'], ['島根県', '松江市']]
      .map(([p, c], i, all) => ({ s: '地理', g: 4, q: `${p}の県庁所在地は？`, a: c, w: all.filter(x => x[1] !== c).map(x => x[1]) })),
    { s: '地理', g: 4, q: '日本でいちばん面積が大きい都道府県は？', a: '北海道', w: ['岩手県', '長野県', '新潟県'] },
    { s: '地理', g: 4, q: '日本でいちばん面積が小さい都道府県は？', a: '香川県', w: ['大阪府', '東京都', '沖縄県'] },
    { s: '地理', g: 5, q: '日本でいちばん長い川は？', a: '信濃川', w: ['利根川', '石狩川', '最上川'] },
    { s: '地理', g: 5, q: '日本でいちばん高い山は？', a: '富士山', w: ['北岳', '奥穂高岳', '槍ヶ岳'] },
    ...[['apple', 'りんご'], ['library', '図書館'], ['Wednesday', '水曜日'], ['summer', '夏'], ['teacher', '先生'], ['river', '川'], ['station', '駅'], ['breakfast', '朝ごはん']]
      .map(([e, j], i, all) => ({ s: '英語', g: 5, q: `「${e}」の意味は？`, a: j, w: all.filter(x => x[1] !== j).map(x => x[1]) }))
  ];
  function mathQ(g) { const f = pick(MATH[g] || MATH[3]); const [q, a] = f(); return { s: '算数', g, q, a: String(a), kind: 'num' }; }
  function bankQ(g, subj) {
    let pool = BANK.filter(b => (!subj || subj.includes(b.s)) && (g === 'mix' || b.g <= g));
    if (!pool.length) pool = BANK;
    const b = pick(pool);
    const wrong = shuffle([...new Set(b.w)]).filter(x => x !== b.a).slice(0, 3);
    return { s: b.s, g: b.g, q: b.q, a: b.a, choices: shuffle([b.a, ...wrong]), kind: 'choice' };
  }
  function numChoices(a) {
    const s = String(a), out = new Set([s]);
    if (/^\d+:\d+$/.test(s)) { const [x, y] = s.split(':').map(Number); [[y, x], [x + 1, y], [x, y + 1], [x * 2, y * 2]].forEach(([p, q]) => out.add(`${p}:${q}`)); }
    else if (/^\d+\/\d+$/.test(s)) { const [n, d] = s.split('/').map(Number); [[n + 1, d], [n, d + 1], [Math.max(1, n - 1), d], [d, n]].forEach(([p, q]) => out.add(frac(p, q))); }
    else { const v = Number(s), isDec = s.includes('.'); const st = isDec ? 0.1 : 1; [v + st, v - st, v + 10 * st, v * 2, v + 2 * st, v - 10 * st].forEach(x => { if (x >= 0) out.add(dec(x)); }); }
    out.delete(s); return shuffle([s, ...shuffle([...out]).slice(0, 3)]);
  }
  // g: 1〜6 または 'mix'、mode: 'choice'（4択にそろえる）
  function question(g = 'mix', opt = {}) {
    const gg = g === 'mix' ? rnd(2, 6) : g;
    const useMath = opt.subj ? opt.subj.includes('算数') : Math.random() < .55;
    let q = useMath ? mathQ(gg) : bankQ(g === 'mix' ? 'mix' : gg, opt.subj && opt.subj.filter(x => x !== '算数'));
    if (opt.choice && q.kind === 'num') { q.choices = numChoices(q.a); q.kind = 'choice'; }
    return q;
  }
  const check = (q, v) => N(v) === N(q.a) || (q.kind === 'num' && Number(N(v)) === Number(N(q.a)) && N(v) !== '');

  /* ---------- 4択の画面をつくる ---------- */
  function renderChoice(box, q, onAnswer) {
    box.innerHTML = `<div class="q-box"><span class="q-tag">${esc(q.s)}${q.g ? `・${q.g}年` : ''}</span><div class="q-text">${esc(q.q)}</div><div class="choices">${q.choices.map((c, i) => `<button type="button" class="choice" data-v="${esc(c)}"><span class="k">${'ABCD'[i]}</span>${esc(c)}</button>`).join('')}</div><div class="feedback" aria-live="polite"></div></div>`;
    let done = false;
    $$('.choice', box).forEach(b => b.addEventListener('click', () => {
      if (done) return; done = true;
      const ok = check(q, b.dataset.v);
      b.classList.add(ok ? 'ok' : 'ng');
      if (!ok) $$('.choice', box).forEach(x => { if (check(q, x.dataset.v)) x.classList.add('ok'); });
      const fb = $('.feedback', box); fb.className = 'feedback ' + (ok ? 'ok' : 'ng'); fb.textContent = ok ? 'せいかい！' : `ざんねん… 答えは「${q.a}」`;
      answered(ok); onAnswer && onAnswer(ok, q);
    }));
    const keyH = e => { if (done || !box.isConnected) return removeEventListener('keydown', keyH); const i = 'abcd1234'.indexOf(e.key.toLowerCase()) % 4; if (i >= 0 && e.key.length === 1) { const b = $$('.choice', box)[i]; b && b.click(); } };
    addEventListener('keydown', keyH);
  }

  /* ---------- 週の計算 ---------- */
  function mondayOf(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; }
  const weekNo = (d = today()) => Math.round((mondayOf(d) - new Date(2026, 0, 5)) / 604800000);
  const weekKey = (d = today()) => ymd(mondayOf(d));

  window.LAB = { dayKeyParts, mondayOf, weekNo, weekKey, LS, load, save, get, put, update, ymd, p2, esc, $, $$, rnd, pick, shuffle, today, reward, spend, coins, exp, level, season, rankOf, TIERS, BADGE, TROPHIES, RAR: R, checkTrophies, ctx, toast, header, refreshHead, question, mathQ, bankQ, numChoices, check, N, renderChoice, answered, frac, dec };
})();
