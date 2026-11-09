/* =====================================================================
   むんラボ：ドット絵アバターとマイルームの絵（lab-avatar.js）
===================================================================== */
(function () {
  'use strict';
  /* ---------- アバター（16×20 ドット） ---------- */
  const BASE = [
    '................',
    '................',
    '.....OOOOOO.....',
    '....OSSSSSSO....',
    '...OSSSSSSSSO...',
    '...OSSSSSSSSO...',
    '...OSSESSSESO...',
    '...OSSESSSESO...',
    '...OSSSSSSSSO...',
    '...OSRSSSSRSO...',
    '....OSSMMSSO....',
    '.....OOSSOO.....',
    '....OCCCCCCO....',
    '...OCCCCCCCCO...',
    '..OSOCCCCCCOSO..',
    '..OSOCCCCCCOSO..',
    '...OOCCCCCCOO...',
    '....OPPPPPPO....',
    '....OPPOOPPO....',
    '...OBBBOOBBBO...'
  ];
  const HAIR = {
    short: ['................', '.....HHHHHH.....', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HH......HH...', '...H........H...'],
    spiky: ['....H..H..H.....', '....HHHHHHHH.H..', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '...HHHHHHHHHH...', '...HHH.HH.HHH...', '...H........H...'],
    bob: ['................', '.....HHHHHH.....', '....HHHHHHHH....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '..HHH......HHH..', '..HH........HH..', '..HH........HH..', '..HH........HH..', '..HH........HH..', '..HH........HH..'],
    long: ['................', '.....HHHHHH.....', '....HHHHHHHH....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '..HHH......HHH..', '..HH........HH..', '..HH........HH..', '..HH........HH..', '..HH........HH..', '..HH........HH..', '..HHH......HHH..', '..HHH......HHH..', '..HH........HH..', '..HH........HH..'],
    pony: ['................', '.....HHHHHH..H..', '....HHHHHHHHHHH.', '...HHHHHHHHHHHH.', '...HHHHHHHHHH.HH', '...HH......HH..H', '...H........H..H', '..............HH', '..............H.'],
    buzz: ['................', '................', '.....HHHHHH.....', '....HHHHHHHH....', '...HH......HH...']
  };
  const OUTFIT = {
    tee: { c: null },
    hoodie: { c: null, add: ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '....DDOSSODD....', '....DCCWWCCD....', '...ODCCWWCCDO...', '................', '................', '.....CCKKCC.....'] },
    labcoat: { c: '#f1f5f9', add: ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '.....WWTTWW.....', '....WWWTTWWW....', '.....WWTTWW.....', '.....WWTTWW.....', '....WWWTTWWW....', '....WWW..WWW....'] },
    jersey: { c: null, add: ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '.....WWCCWW.....', '....CCCCCCCC....', '.....CCWWCC.....', '.....CCWWCC.....', '.....WWWWWW.....'] },
    armor: { c: '#1e293b', add: ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '....LLLLLLLL....', '...LLNNCCNNLL...', '..OLOCCNNCCOLO..', '..OLOCCNNCCOLO..', '...OOLLLLLLOO...', '....LNNNNNNL....'] }
  };
  const ACC = {
    none: [],
    glasses: ['................', '................', '................', '................', '................', '.....GGG.GGG....', '.....G.GGG.G....', '.....G.G.G.G....', '.....GGG.GGG....'],
    headset: ['................', '.....AAAAAA.....', '....A......A....', '...A........A...', '..AA........AA..', '..AA........AA..', '..AA........AA..', '..AA........AA..', '...........AA...', '..........AA....'],
    cap: ['................', '....YYYYYYY.....', '...YYYYYYYYY....', '...YYYYYYYYYYYYY', '................'],
    catears: ['..KK........KK..', '..KQK......KQK..', '..KKKK....KKKK..'],
    crown: ['....F.F..F.F....', '....FFFFFFFF....', '....FJFFFFJF....']
  };
  const SKIN = ['#fde2c4', '#f5c79e', '#d6a072', '#a8704a'];
  const HAIRC = ['#1f2937', '#78350f', '#f59e0b', '#ec4899', '#00e5ff', '#a855f7', '#e5e7eb', '#22c55e'];
  const SHIRT = ['#00e5ff', '#a855f7', '#ec4899', '#22c55e', '#f59e0b', '#ef4444', '#334155', '#f8fafc'];
  const EYE = ['#0f172a', '#2563eb', '#16a34a', '#9333ea'];
  const DEF = { skin: 0, hair: 'short', hairC: 1, eye: 0, outfit: 'tee', shirt: 0, acc: 'none' };

  function svg(a, opt) {
    a = Object.assign({}, DEF, a || {}); opt = opt || {};
    const pal = {
      O: '#0b1020', S: SKIN[a.skin] || SKIN[0], E: EYE[a.eye] || EYE[0], M: '#be185d', R: '#fda4af', C: (OUTFIT[a.outfit] && OUTFIT[a.outfit].c) || SHIRT[a.shirt] || SHIRT[0],
      P: '#1e3a8a', B: '#0f172a', H: HAIRC[a.hairC] || HAIRC[0], W: '#ffffff', D: '#0b1020', K: '#0b1020', T: SHIRT[a.shirt] || SHIRT[0],
      L: '#00e5ff', N: SHIRT[a.shirt] || '#a855f7', G: '#38bdf8', A: '#475569', Y: SHIRT[a.shirt] || '#ef4444', Q: '#f9a8d4', F: '#fbbf24', J: '#ef4444'
    };
    if (a.acc === 'catears') pal.K = HAIRC[a.hairC] || HAIRC[0];
    const px = [];
    const draw = (map, oy = 0) => map.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.' && pal[ch]) px[(y + oy) * 16 + x] = pal[ch]; }));
    draw(BASE);
    const o = OUTFIT[a.outfit]; if (o && o.add) draw(o.add);
    const hairBack = a.hair === 'long' || a.hair === 'bob';
    draw(HAIR[a.hair] || HAIR.short);
    // 顔の部分は髪の上から肌・目を描きなおす（前髪が顔をかくさないように）
    if (hairBack) BASE.forEach((row, y) => { if (y >= 5 && y <= 11) [...row].forEach((ch, x) => { if ('SEMR'.includes(ch) && x >= 4 && x <= 11) px[y * 16 + x] = pal[ch]; }); });
    draw(ACC[a.acc] || []);
    let r = '';
    px.forEach((c, i) => { if (c) r += `<rect x="${i % 16}" y="${Math.floor(i / 16)}" width="1.02" height="1.02" fill="${c}"/>`; });
    const w = opt.w || '100%';
    return `<svg viewBox="-2 -1 20 22" width="${w}" height="${w}" shape-rendering="crispEdges" role="img" aria-label="アバター">${r}</svg>`;
  }

  /* ---------- マイルーム（320×200） ---------- */
  const R = (x, y, w, h, f, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${extra}/>`;
  const WALL = {
    'wall-night': () => R(0, 0, 320, 140, '#0b1430') + Array.from({ length: 10 }, (_, i) => R(i * 32, 0, 1, 140, 'rgba(0,229,255,.12)')).join('') + Array.from({ length: 5 }, (_, i) => R(0, i * 28, 320, 1, 'rgba(0,229,255,.12)')).join(''),
    'wall-neon': () => R(0, 0, 320, 140, '#1a0b2e') + R(0, 18, 320, 3, '#ec4899') + R(0, 24, 320, 2, '#00e5ff') + R(0, 118, 320, 2, '#a855f7'),
    'wall-space': () => R(0, 0, 320, 140, '#030712') + Array.from({ length: 40 }, (_, i) => R((i * 73) % 320, (i * 37) % 136, i % 5 ? 1 : 2, i % 5 ? 1 : 2, i % 3 ? '#fff' : '#a5f3fc')).join('') + `<circle cx="270" cy="30" r="14" fill="#f59e0b"/><rect x="250" y="28" width="40" height="3" fill="#fde68a"/>`,
    'wall-sakura': () => R(0, 0, 320, 140, '#fce7f3') + Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 47) % 320}" cy="${(i * 29) % 130 + 5}" r="3" fill="#f9a8d4"/>`).join(''),
    'wall-forest': () => R(0, 0, 320, 140, '#064e3b') + Array.from({ length: 9 }, (_, i) => `<path d="M${i * 38 + 6} 140 l16 -50 l16 50z" fill="#10b981" opacity=".55"/>`).join('')
  };
  const FLOOR = {
    'floor-wood': () => R(0, 140, 320, 60, '#7c4a1e') + Array.from({ length: 5 }, (_, i) => R(0, 140 + i * 12, 320, 1, '#5b3413')).join('') + Array.from({ length: 8 }, (_, i) => R((i * 45 + (i % 2) * 20) % 320, 140 + (i % 5) * 12, 1, 12, '#5b3413')).join(''),
    'floor-tile': () => R(0, 140, 320, 60, '#cbd5e1') + Array.from({ length: 11 }, (_, i) => R(i * 32, 140, 1, 60, '#94a3b8')).join('') + Array.from({ length: 3 }, (_, i) => R(0, 140 + i * 20, 320, 1, '#94a3b8')).join(''),
    'floor-carpet': () => R(0, 140, 320, 60, '#312e81') + Array.from({ length: 30 }, (_, i) => R((i * 53) % 320, 142 + (i * 17) % 56, 2, 2, '#4338ca')).join('')
  };
  const ITEMS = {
    // 窓
    'win-city': { slot: 'window', name: '夜の街の窓', price: 0, d: () => R(20, 18, 70, 56, '#1e293b') + R(23, 21, 64, 50, '#0f172a') + [[28, 40, 10, 31], [42, 30, 12, 41], [58, 45, 9, 26], [70, 35, 12, 36]].map(([x, y, w, h]) => R(x, y, w, h, '#334155') + R(x + 2, y + 4, 2, 2, '#fde047') + R(x + 6, y + 10, 2, 2, '#fde047')).join('') + R(54, 18, 2, 56, '#1e293b') },
    'win-space': { slot: 'window', name: '宇宙の見える窓', price: 4000, d: () => `<circle cx="55" cy="46" r="32" fill="#1e293b"/><circle cx="55" cy="46" r="28" fill="#030712"/><circle cx="66" cy="38" r="9" fill="#3b82f6"/><path d="M60 35q5 2 4 7q-4 1-6-3z" fill="#22c55e"/>` + Array.from({ length: 10 }, (_, i) => R(35 + (i * 13) % 40, 25 + (i * 7) % 40, 1, 1, '#fff')).join('') },
    'win-sea': { slot: 'window', name: '海の見える窓', price: 3000, d: () => R(20, 18, 70, 56, '#1e293b') + R(23, 21, 64, 30, '#7dd3fc') + R(23, 51, 64, 20, '#0284c7') + R(23, 51, 64, 2, '#e0f2fe') + `<circle cx="72" cy="32" r="6" fill="#fde047"/>` + R(54, 18, 2, 56, '#1e293b') },
    // 机・PC
    'desk-basic': { slot: 'desk', name: 'シンプルな机', price: 0, d: () => R(150, 112, 96, 6, '#a16207') + R(154, 118, 5, 40, '#78350f') + R(237, 118, 5, 40, '#78350f') },
    'desk-gamer': { slot: 'desk', name: 'ゲーミングデスク', price: 6000, d: () => R(146, 112, 104, 7, '#0f172a') + R(146, 119, 104, 2, '#00e5ff') + R(152, 121, 8, 38, '#111827') + R(236, 121, 8, 38, '#111827') + R(152, 150, 92, 3, '#ec4899') },
    'pc-laptop': { slot: 'pc', name: 'ノートパソコン', price: 3000, d: () => R(176, 92, 40, 20, '#334155') + R(179, 95, 34, 14, '#0ea5e9') + R(182, 98, 12, 2, '#e0f2fe') + R(182, 102, 20, 2, '#bae6fd') + R(170, 111, 52, 3, '#64748b') },
    'pc-tower': { slot: 'pc', name: 'ゲーミングPC（2画面）', price: 8000, d: () => R(158, 84, 42, 26, '#0f172a') + R(161, 87, 36, 20, '#7c3aed') + R(204, 84, 42, 26, '#0f172a') + R(207, 87, 36, 20, '#0891b2') + R(176, 110, 6, 3, '#0f172a') + R(222, 110, 6, 3, '#0f172a') + R(250, 120, 18, 38, '#0f172a') + R(253, 124, 12, 2, '#ec4899') + R(253, 130, 12, 2, '#00e5ff') + R(253, 136, 12, 2, '#a855f7') },
    // 本だな
    'shelf-books': { slot: 'shelf', name: '本だな', price: 2000, d: () => R(262, 60, 48, 98, '#78350f') + [70, 102, 134].map(y => R(265, y + 18, 42, 3, '#5b3413') + ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#e5e7eb'].map((c, i) => R(267 + i * 7, y, 5, 18, c)).join('')).join('') },
    'shelf-trophy': { slot: 'shelf', name: 'トロフィーだな', price: 5000, d: (st) => R(262, 60, 48, 98, '#1e293b') + R(262, 60, 48, 2, '#fbbf24') + [72, 104, 136].map((y, k) => R(265, y + 18, 42, 3, '#0f172a') + [0, 1, 2].map(i => (k * 3 + i < Math.max(1, Math.min(9, st.trophies || 0))) ? `<path d="M${269 + i * 13} ${y + 2}h9v5q0 5-4.5 6q-4.5-1-4.5-6z" fill="#fbbf24"/>` + R(272 + i * 13, y + 13, 3, 3, '#fbbf24') + R(270 + i * 13, y + 16, 7, 2, '#b45309') : '').join('')).join('') },
    // 植物
    'plant-mini': { slot: 'plant', name: 'ミニサボテン', price: 800, d: () => `<g transform="translate(-80 0)">` + R(226, 98, 12, 14, '#c2410c') + R(229, 82, 6, 16, '#16a34a') + R(225, 86, 4, 6, '#16a34a') + R(235, 88, 4, 5, '#16a34a') + R(231, 79, 2, 3, '#f472b6') + `</g>` },
    'plant-monstera': { slot: 'floorleft', name: 'モンステラ', price: 2500, d: () => R(130, 142, 18, 18, '#e5e7eb') + R(130, 142, 18, 3, '#cbd5e1') + `<g fill="#15803d"><ellipse cx="132" cy="122" rx="11" ry="7"/><ellipse cx="146" cy="116" rx="10" ry="7"/><ellipse cx="138" cy="106" rx="9" ry="7"/></g>` + R(138, 112, 2, 30, '#166534') },
    // ポスター
    'poster-planet': { slot: 'poster', name: '惑星ポスター', price: 1000, d: () => R(110, 20, 30, 40, '#f8fafc') + R(112, 22, 26, 36, '#1e1b4b') + `<circle cx="125" cy="40" r="8" fill="#f59e0b"/>` + R(114, 39, 22, 2, '#fde68a') },
    'poster-dino': { slot: 'poster', name: '恐竜ポスター', price: 1000, d: () => R(110, 20, 30, 40, '#f8fafc') + R(112, 22, 26, 36, '#ecfccb') + `<path d="M116 52q2-10 8-12l6-8q2-2 4 0l-2 6q4 4 2 14h-3l-1-5h-6l-1 5z" fill="#4d7c0f"/>` },
    'poster-pixel': { slot: 'poster', name: 'ドット絵ポスター', price: 1500, d: () => R(110, 20, 30, 40, '#0f172a') + R(110, 20, 30, 2, '#00e5ff') + [[0, 1, 0, 0, 1, 0], [1, 1, 1, 1, 1, 1], [1, 0, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1], [0, 1, 0, 0, 1, 0]].map((row, y) => row.map((v, x) => v ? R(116 + x * 3, 30 + y * 3, 3, 3, '#a855f7') : '').join('')).join('') + R(114, 50, 22, 3, '#ec4899') },
    // 照明
    'lamp-neon': { slot: 'lamp', name: 'ネオンサイン', price: 1500, d: () => `<text x="160" y="40" font-family="monospace" font-weight="700" font-size="16" fill="none" stroke="#ec4899" stroke-width="1.5" style="filter:drop-shadow(0 0 3px #ec4899)">STUDY</text>` },
    'lamp-lava': { slot: 'lamp2', name: 'ラバランプ', price: 2500, d: () => `<g transform="translate(122 -46)">` + R(158, 104, 10, 2, '#94a3b8') + `<path d="M160 104l-3-22h12l-3 22z" fill="#7c3aed" opacity=".9"/><circle cx="162" cy="96" r="2.5" fill="#f472b6"/><circle cx="164" cy="88" r="2" fill="#f472b6"/>` + R(157, 80, 12, 2, '#94a3b8') + `</g>` },
    // ラグ
    'rug-round': { slot: 'rug', name: 'まるいラグ', price: 1200, d: () => `<ellipse cx="80" cy="176" rx="56" ry="12" fill="#0e7490"/><ellipse cx="80" cy="176" rx="44" ry="8" fill="#155e75"/>` },
    'rug-game': { slot: 'rug', name: 'コントローラーのラグ', price: 2000, d: () => `<rect x="30" y="166" width="100" height="22" rx="11" fill="#4c1d95"/>` + R(44, 175, 10, 3, '#e9d5ff') + R(47, 172, 3, 10, '#e9d5ff') + `<circle cx="110" cy="174" r="2.5" fill="#f472b6"/><circle cx="116" cy="178" r="2.5" fill="#22d3ee"/>` },
    // ペット
    'pet-robocat': { slot: 'pet', name: 'ロボねこ', price: 10000, d: () => `<g transform="translate(110 22)">` + R(60, 150, 22, 14, '#cbd5e1') + R(58, 136, 18, 14, '#e2e8f0') + R(58, 132, 4, 4, '#e2e8f0') + R(72, 132, 4, 4, '#e2e8f0') + R(62, 141, 3, 3, '#00e5ff') + R(69, 141, 3, 3, '#00e5ff') + R(82, 152, 8, 2, '#cbd5e1') + R(62, 164, 4, 4, '#64748b') + R(76, 164, 4, 4, '#64748b') + `</g>` },
    'pet-fish': { slot: 'pet2', name: '水そうと金魚', price: 4000, d: () => R(270, 162, 40, 4, '#334155') + R(272, 136, 36, 26, 'rgba(125,211,252,.45)', 'stroke="#e0f2fe" stroke-width="1"') + `<path d="M284 148q5-4 10 0q-5 4-10 0z" fill="#f97316"/><path d="M284 148l-4-3v6z" fill="#f97316"/>` + R(296, 152, 2, 8, '#16a34a') },
    // ベッド
    'bed-basic': { slot: 'bed', name: 'ベッド', price: 3000, d: () => R(6, 140, 70, 22, '#1d4ed8') + R(6, 136, 22, 10, '#e2e8f0') + R(4, 128, 4, 38, '#78350f') + R(74, 140, 4, 26, '#78350f') },
    'bed-capsule': { slot: 'bed', name: 'カプセルベッド', price: 12000, d: () => `<rect x="4" y="112" width="78" height="52" rx="16" fill="#0f172a" stroke="#00e5ff" stroke-width="2"/>` + R(12, 140, 62, 16, '#7c3aed') + R(12, 134, 18, 8, '#e2e8f0') + R(16, 118, 54, 3, '#22d3ee', 'opacity=".7"') }
  };
  const SKINS = { // 着せかえ（アバター）の有料パーツ
    hoodie: { name: 'パーカー', price: 1500 }, labcoat: { name: '白衣', price: 3000 }, jersey: { name: 'ユニフォーム', price: 2000 }, armor: { name: 'サイバースーツ', price: 8000 },
    glasses: { name: 'メガネ', price: 800 }, headset: { name: 'ヘッドセット', price: 1500 }, cap: { name: 'キャップ', price: 1200 }, catears: { name: 'ねこみみ', price: 2000 }, crown: { name: '王冠', price: 20000 }
  };
  const WALLS = { 'wall-night': ['ナイトグリッド', 0], 'wall-neon': ['ネオンライン', 2000], 'wall-space': ['宇宙のかべ', 5000], 'wall-sakura': ['さくら', 3000], 'wall-forest': ['森のかべ', 3000] };
  const FLOORS = { 'floor-wood': ['木のゆか', 0], 'floor-tile': ['タイル', 1500], 'floor-carpet': ['カーペット', 2000] };
  const ORDER = ['window', 'poster', 'lamp', 'shelf', 'bed', 'rug', 'floorleft', 'desk', 'pc', 'plant', 'lamp2', 'pet2', 'pet'];

  function room(place, avatar, st) {
    place = Object.assign({ wall: 'wall-night', floor: 'floor-wood', window: 'win-city', desk: 'desk-basic' }, place || {});
    let s = (WALL[place.wall] || WALL['wall-night'])() + (FLOOR[place.floor] || FLOOR['floor-wood'])() + R(0, 138, 320, 3, 'rgba(0,0,0,.35)');
    ORDER.forEach(slot => { const id = place[slot]; if (id && ITEMS[id]) s += ITEMS[id].d(st || {}); });
    const av = avatar ? `<g transform="translate(84 98) scale(3)">${svg(avatar).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` : '';
    return `<svg viewBox="0 0 320 200" role="img" aria-label="マイルーム" shape-rendering="crispEdges" style="width:100%;height:auto;display:block;border-radius:16px">${s}${av}</svg>`;
  }
  window.LAB_AVATAR = { svg, room, ITEMS, SKINS, WALLS, FLOORS, HAIR: Object.keys(HAIR), OUTFITS: Object.keys(OUTFIT), ACCS: Object.keys(ACC), SKIN, HAIRC, SHIRT, EYE, DEF };
})();
