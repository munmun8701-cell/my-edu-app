/* ============================================================
   むん先生の 三年算数クエスト  （パワーアップ版）
   ・問題データ と 出題ロジック は もとの コードを そのまま 使っています
   ============================================================ */
"use strict";
// ============================================================
// 【もとの コードから そのまま うつした 部分】 問題データ・装備データ
// ※ 問題の内容は 1文字も 変えていません
// ============================================================
let materials = {
  shizuku: 0,
  hone: 0,
  kouseki: 0,
  maseki: 0,
  hoshisuna: 0,
  tsukiishi: 0
};
const matNames = {
  shizuku: "💧",
  hone: "🦴",
  kouseki: "🔸",
  maseki: "🔮",
  hoshisuna: "⏳",
  tsukiishi: "🌙"
};

const unicornImg =
  '<img src="https://assets.st-note.com/img/1772717157-GtXJnFpu6siA9KL1VzdxfDOI.png" title="ユニコーン">';
const rareCompanions = [
  unicornImg,
  "🦊",
  "🤖",
  "👼",
  "🌟",
  "🦄",
  "🦍",
  "🐕",
  "🦖",
  "🐯",
  "🐮",
  "🐘",
  "🦚",
  "🦎",
  "🐠"
];

const allCompanionsList = [
  '<img src="https://assets.st-note.com/img/1772716673-Siqp1vmwzbGXTeft39UNAlak.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
  '<img src="https://assets.st-note.com/img/1772716684-n8GKJt3TveugpY0hd415Rczx.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
  '<img src="https://assets.st-note.com/img/1772716438-8LIRbVviCus0HExf1lUKM6aQ.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
  "👿",
  '<img src="https://assets.st-note.com/img/1772718044-dse6U2pFv8PnioBVKMayJqZ4.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
  unicornImg,
  "🦊",
  "🤖",
  "👼",
  "🌟",
  "🦄",
  "🦍",
  "🐕",
  "🦖",
  "🐯",
  "🐮",
  "🐘",
  "🦚",
  "🦎",
  "🐠"
];

const weaponData = [
  { name: "木のえだ", req: null, reqText: "" },
  {
    name: "どうの つるぎ",
    req: { shizuku: 5, hone: 2, kouseki: 0, maseki: 0 },
    reqText: "(💧x5, 🦴x2)"
  },
  {
    name: "てつの けん",
    req: { shizuku: 5, hone: 5, kouseki: 1, maseki: 0 },
    reqText: "(💧x5, 🦴x5, 🔸x1)"
  },
  {
    name: "はがねの けん",
    req: { shizuku: 10, hone: 10, kouseki: 3, maseki: 0 },
    reqText: "(💧x10, 🦴x10, 🔸x3)"
  },
  {
    name: "ほのおの けん",
    req: { shizuku: 0, hone: 15, kouseki: 8, maseki: 2 },
    reqText: "(🦴x15, 🔸x8, 🔮x2)"
  },
  {
    name: "でんせつの けん",
    req: { shizuku: 0, hone: 0, kouseki: 15, maseki: 5 },
    reqText: "(🔸x15, 🔮x5)"
  },
  {
    name: "ゆうしゃの けん",
    req: { shizuku: 0, hone: 0, kouseki: 30, maseki: 10 },
    reqText: "(🔸x30, 🔮x10)"
  },
  {
    name: "けんじゃの つえ",
    req: { shizuku: 0, hone: 0, kouseki: 50, maseki: 20 },
    reqText: "(🔸x50, 🔮x20)"
  },
  {
    name: "神の やり",
    req: { shizuku: 0, hone: 0, kouseki: 80, maseki: 40 },
    reqText: "(🔸x80, 🔮x40)"
  },
  {
    name: "そうぞう神の けん",
    req: { shizuku: 0, hone: 0, kouseki: 120, maseki: 80 },
    reqText: "(🔸x120, 🔮x80)"
  }
];

const armorData = [
  { name: "ふつうの ふく", hpBonus: 0, req: null, reqText: "" },
  {
    name: "かわの たて",
    hpBonus: 3,
    req: { shizuku: 5, hone: 2, kouseki: 0, maseki: 0 },
    reqText: "(💧x5, 🦴x2)"
  },
  {
    name: "てつの たて",
    hpBonus: 6,
    req: { shizuku: 5, hone: 5, kouseki: 1, maseki: 0 },
    reqText: "(💧x5, 🦴x5, 🔸x1)"
  },
  {
    name: "はがねの よろい",
    hpBonus: 10,
    req: { shizuku: 10, hone: 10, kouseki: 3, maseki: 0 },
    reqText: "(💧x10, 🦴x10, 🔸x3)"
  },
  {
    name: "ドラゴンメイル",
    hpBonus: 15,
    req: { shizuku: 0, hone: 15, kouseki: 8, maseki: 2 },
    reqText: "(🦴x15, 🔸x8, 🔮x2)"
  },
  {
    name: "ひかりの よろい",
    hpBonus: 22,
    req: { shizuku: 0, hone: 0, kouseki: 15, maseki: 5 },
    reqText: "(🔸x15, 🔮x5)"
  },
  {
    name: "ゆうしゃの たて",
    hpBonus: 30,
    req: { shizuku: 0, hone: 0, kouseki: 30, maseki: 10 },
    reqText: "(🔸x30, 🔮x10)"
  },
  {
    name: "ミスリルの たて",
    hpBonus: 40,
    req: { shizuku: 0, hone: 0, kouseki: 50, maseki: 20 },
    reqText: "(🔸x50, 🔮x20)"
  },
  {
    name: "オリハルコンよろい",
    hpBonus: 55,
    req: { shizuku: 0, hone: 0, kouseki: 80, maseki: 40 },
    reqText: "(🔸x80, 🔮x40)"
  },
  {
    name: "そうぞう神の ころも",
    hpBonus: 80,
    req: { shizuku: 0, hone: 0, kouseki: 120, maseki: 80 },
    reqText: "(🔸x120, 🔮x80)"
  }
];

const add3x3Carry1List = [
  [208, 139],
  [436, 345],
  [305, 187],
  [408, 546],
  [314, 278],
  [328, 462],
  [506, 418],
  [757, 238],
  [127, 346],
  [201, 609],
  [237, 157],
  [324, 468],
  [173, 717],
  [406, 285],
  [257, 528],
  [528, 259],
  [635, 126],
  [326, 568],
  [269, 719],
  [312, 439],
  [467, 413],
  [328, 605],
  [409, 259],
  [626, 357],
  [153, 409],
  [169, 423],
  [648, 327],
  [415, 279],
  [148, 735],
  [317, 455],
  [438, 347],
  [519, 145],
  [384, 509],
  [709, 165],
  [306, 489],
  [206, 385],
  [227, 653],
  [518, 172],
  [419, 563],
  [728, 118],
  [325, 136],
  [258, 216],
  [418, 249],
  [154, 137],
  [463, 429],
  [535, 217],
  [377, 214],
  [129, 532],
  [284, 108],
  [156, 527],
  [239, 112],
  [313, 578],
  [437, 315],
  [617, 243],
  [265, 407],
  [389, 202],
  [318, 633],
  [149, 223],
  [318, 368],
  [718, 175],
  [219, 476],
  [234, 307],
  [787, 107],
  [261, 319],
  [109, 608],
  [128, 334],
  [526, 416],
  [119, 674],
  [115, 448],
  [309, 351]
];

const add3x3Carry10sList = [
  [475, 382],
  [391, 535],
  [252, 583],
  [463, 272],
  [285, 472],
  [593, 291],
  [156, 361],
  [263, 282],
  [572, 135],
  [160, 382],
  [132, 385],
  [361, 597],
  [640, 172],
  [225, 383],
  [191, 762],
  [281, 563],
  [753, 164],
  [437, 481],
  [392, 233],
  [180, 453],
  [295, 372],
  [362, 575],
  [691, 165],
  [476, 443],
  [680, 255],
  [471, 338],
  [123, 780],
  [532, 292],
  [348, 380],
  [655, 293],
  [490, 393],
  [675, 152],
  [570, 369],
  [283, 573],
  [312, 496],
  [335, 381],
  [274, 673],
  [521, 182],
  [353, 492],
  [798, 171],
  [395, 380],
  [242, 592],
  [142, 781],
  [374, 493],
  [153, 650],
  [441, 287],
  [375, 462],
  [262, 173],
  [384, 594],
  [130, 479],
  [396, 273],
  [470, 388],
  [161, 672],
  [461, 298],
  [370, 482],
  [799, 190],
  [265, 362],
  [677, 141],
  [294, 513],
  [183, 742],
  [399, 460],
  [183, 275],
  [582, 151],
  [332, 491],
  [193, 560],
  [290, 527],
  [241, 662],
  [150, 352],
  [170, 773],
  [480, 259]
];

const add3x3Carry2List = [
  [154, 496],
  [528, 294],
  [387, 393],
  [468, 186],
  [255, 357],
  [594, 206],
  [629, 283],
  [197, 786],
  [549, 265],
  [682, 178],
  [234, 266],
  [149, 586],
  [694, 239],
  [435, 287],
  [378, 196],
  [237, 695],
  [389, 336],
  [295, 465],
  [167, 758],
  [584, 367],
  [354, 476],
  [239, 593],
  [147, 785],
  [199, 475],
  [273, 697],
  [168, 735],
  [397, 368],
  [687, 159],
  [356, 274],
  [188, 726],
  [497, 315],
  [145, 779],
  [398, 552],
  [177, 643],
  [458, 275],
  [589, 157],
  [296, 645],
  [368, 443],
  [179, 738],
  [387, 375],
  [376, 264],
  [185, 239],
  [546, 255],
  [468, 393],
  [254, 278],
  [452, 269],
  [367, 153],
  [659, 253],
  [532, 378],
  [285, 466],
  [226, 284],
  [394, 127],
  [478, 258],
  [587, 136],
  [395, 257],
  [567, 345],
  [135, 765],
  [259, 653],
  [483, 318],
  [798, 182],
  [158, 745],
  [319, 281],
  [538, 164],
  [358, 267],
  [523, 279],
  [376, 256],
  [195, 647],
  [386, 579],
  [489, 152],
  [773, 198]
];

const add3x3Over1000List = [
  [711, 438],
  [724, 535],
  [634, 612],
  [913, 263],
  [774, 555],
  [586, 472],
  [945, 273],
  [285, 715],
  [445, 927],
  [953, 278],
  [819, 575],
  [635, 421],
  [287, 937],
  [594, 708],
  [333, 678],
  [897, 748],
  [817, 253],
  [563, 592],
  [124, 876],
  [567, 442],
  [487, 756],
  [912, 345],
  [268, 853],
  [610, 509],
  [495, 912],
  [536, 527],
  [110, 890],
  [924, 236],
  [783, 357],
  [672, 514],
  [631, 462],
  [394, 840],
  [901, 278],
  [365, 705],
  [623, 596],
  [676, 324],
  [185, 915],
  [547, 663],
  [851, 432],
  [211, 789],
  [304, 728],
  [283, 862],
  [999, 123],
  [578, 619],
  [841, 457],
  [532, 523],
  [496, 647],
  [810, 890],
  [451, 986],
  [765, 235]
];

const addLargeList = [
  [3126, 4253],
  [2341, 1859],
  [6986, 2103],
  [5865, 1359],
  [6493, 2562],
  [2307, 4958],
  [3476, 2048],
  [4538, 1226],
  [1192, 2960],
  [3765, 5192],
  [2649, 6273],
  [114, 8931],
  [8972, 651],
  [685, 9314],
  [1058, 7626],
  [2510, 4832],
  [1615, 794],
  [7352, 678],
  [3246, 6587],
  [3065, 5935],
  [1048, 8516],
  [2860, 4282],
  [9621, 279],
  [1907, 7853],
  [6979, 2253],
  [8031, 969],
  [3515, 5420],
  [4182, 5717],
  [1872, 7128],
  [3692, 4387],
  [2457, 6643],
  [1234, 8765],
  [5928, 3817],
  [537, 7240],
  [6375, 2989],
  [707, 8293],
  [5258, 4063],
  [2942, 1739],
  [9531, 426],
  [3864, 4987]
];

const sub3x3Borrow1List = [
  [495, 237],
  [574, 218],
  [720, 413],
  [591, 325],
  [693, 265],
  [432, 126],
  [363, 114],
  [761, 318],
  [273, 125],
  [592, 328],
  [587, 439],
  [853, 624],
  [372, 148],
  [731, 517],
  [543, 234],
  [921, 313],
  [678, 349],
  [493, 258],
  [876, 427],
  [382, 125],
  [782, 654],
  [561, 123],
  [643, 328],
  [365, 127],
  [851, 332],
  [471, 239],
  [864, 528],
  [380, 135],
  [552, 243],
  [953, 327],
  [357, 138],
  [632, 214],
  [561, 143],
  [426, 217],
  [773, 546],
  [555, 238],
  [833, 515],
  [395, 167],
  [754, 439],
  [932, 617],
  [585, 356],
  [272, 153],
  [724, 406],
  [663, 348],
  [538, 219],
  [741, 423],
  [392, 165],
  [895, 347],
  [463, 156],
  [987, 458]
];

const sub3x3Borrow2List = [
  [765, 567],
  [938, 479],
  [510, 255],
  [973, 398],
  [356, 167],
  [532, 267],
  [444, 245],
  [815, 427],
  [642, 289],
  [922, 777],
  [875, 596],
  [432, 295],
  [323, 178],
  [712, 354],
  [560, 293],
  [753, 357],
  [531, 255],
  [843, 665],
  [678, 499],
  [987, 789],
  [960, 367],
  [576, 289],
  [642, 355],
  [421, 256],
  [733, 567],
  [611, 278],
  [864, 578],
  [523, 128],
  [910, 372],
  [345, 179],
  [412, 239],
  [321, 177],
  [511, 222],
  [730, 252],
  [834, 569],
  [390, 194],
  [988, 389],
  [714, 525],
  [630, 156],
  [516, 289]
];

// ★今回追加したデータ
const subLargeList = [
  [7325, 4873],
  [3042, 1250],
  [5505, 2857],
  [8413, 1298],
  [6582, 2756],
  [4631, 1356],
  [9876, 6789],
  [3000, 1987],
  [6214, 3869],
  [7000, 3667],
  [7192, 4985],
  [3280, 1397],
  [6321, 2569],
  [4860, 1795],
  [5703, 1136],
  [3516, 1726],
  [8357, 3978],
  [9135, 1278],
  [7654, 4567],
  [3000, 1457],
  [3405, 1035],
  [9312, 3658],
  [5137, 1273],
  [4723, 1678],
  [6000, 2547],
  [5846, 2878],
  [8903, 3905],
  [3151, 1346],
  [7035, 2489],
  [8212, 5990],
  [9010, 1753],
  [4895, 2796],
  [3000, 1927],
  [7070, 1717],
  [6721, 2023],
  [7632, 3579],
  [5347, 2895],
  [8125, 2378],
  [5000, 3766],
  [9713, 6905],
  [7516, 2483],
  [5012, 2483],
  [3762, 1483],
  [6305, 1748],
  [3925, 2639],
  [3007, 1593],
  [4175, 1089],
  [7865, 2588],
  [8642, 3149],
  [9000, 4951]
];

const hissan2x2List = [
  [52, 87],
  [79, 26],
  [98, 54],
  [15, 73],
  [72, 97],
  [64, 25],
  [51, 19],
  [39, 58],
  [64, 45],
  [48, 32],
  [48, 57],
  [55, 75],
  [71, 83],
  [93, 32],
  [32, 54],
  [24, 76],
  [73, 41],
  [94, 23],
  [56, 95],
  [83, 42],
  [27, 42],
  [39, 17],
  [97, 29],
  [40, 95],
  [58, 73],
  [62, 68],
  [85, 74],
  [48, 23],
  [73, 56],
  [76, 38],
  [86, 25],
  [50, 38],
  [72, 87],
  [97, 18],
  [85, 62],
  [64, 44],
  [93, 83],
  [24, 51],
  [31, 49],
  [39, 76],
  [42, 73],
  [14, 28],
  [37, 60],
  [86, 51],
  [71, 76],
  [41, 59],
  [59, 17],
  [53, 82],
  [28, 39],
  [85, 95]
];

const timeCalcList = [
  { time: "午前9時30分", offset: "40分前", ans: 850 },
  { time: "午前9時30分", offset: "35分後", ans: 1005 },
  { time: "午前11時25分", offset: "40分前", ans: 1045 },
  { time: "午前11時25分", offset: "50分後", ans: 1215 },
  { time: "午後5時40分", offset: "55分前", ans: 445 },
  { time: "午後5時40分", offset: "30分後", ans: 610 },
  { time: "午前5時35分", offset: "45分前", ans: 450 },
  { time: "午前5時35分", offset: "30分後", ans: 605 },
  { time: "午前10時20分", offset: "35分前", ans: 945 },
  { time: "午前10時20分", offset: "55分後", ans: 1115 },
  { time: "午後7時15分", offset: "50分前", ans: 625 },
  { time: "午後7時15分", offset: "55分後", ans: 810 },
  { time: "午前4時15分", offset: "30分前", ans: 345 },
  { time: "午前4時15分", offset: "50分後", ans: 505 },
  { time: "午後3時30分", offset: "45分前", ans: 245 },
  { time: "午後3時30分", offset: "35分後", ans: 405 },
  { time: "午後8時45分", offset: "50分前", ans: 755 },
  { time: "午後8時45分", offset: "25分後", ans: 910 },
  { time: "午前9時20分", offset: "25分前", ans: 855 },
  { time: "午前9時20分", offset: "50分後", ans: 1010 },
  { time: "午前10時50分", offset: "55分前", ans: 955 },
  { time: "午前10時50分", offset: "25分後", ans: 1115 },
  { time: "午後8時45分", offset: "55分前", ans: 750 },
  { time: "午後8時45分", offset: "15分後", ans: 900 },
  { time: "午前8時30分", offset: "40分前", ans: 750 },
  { time: "午前8時30分", offset: "35分後", ans: 905 },
  { time: "午後5時15分", offset: "20分前", ans: 455 },
  { time: "午後5時15分", offset: "55分後", ans: 610 },
  { time: "午後10時20分", offset: "30分前", ans: 950 },
  { time: "午後10時20分", offset: "40分後", ans: 1100 },
  { time: "午前7時20分", offset: "25分前", ans: 655 },
  { time: "午前7時20分", offset: "50分後", ans: 810 },
  { time: "午前9時15分", offset: "25分前", ans: 850 },
  { time: "午前9時15分", offset: "45分後", ans: 1000 },
  { time: "午後2時40分", offset: "45分前", ans: 155 },
  { time: "午後2時40分", offset: "30分後", ans: 310 },
  { time: "午前4時35分", offset: "40分前", ans: 355 },
  { time: "午前4時35分", offset: "35分後", ans: 510 },
  { time: "午前8時40分", offset: "40分前", ans: 800 },
  { time: "午前8時40分", offset: "30分後", ans: 910 },
  { time: "午後3時25分", offset: "30分前", ans: 255 },
  { time: "午後3時25分", offset: "45分後", ans: 410 }
];

const timeCalcMinutesList = [
  { q: "10分 ＋ 20分 ＝ ", a: 30 },
  { q: "60分 － 10分 ＝ ", a: 50 },
  { q: "50分 － 30分 ＝ ", a: 20 },
  { q: "23分 ＋ 25分 ＝ ", a: 48 },
  { q: "15分 ＋ 15分 ＝ ", a: 30 },
  { q: "35分 － 16分 ＝ ", a: 19 },
  { q: "20分 ＋ 30分 ＝ ", a: 50 },
  { q: "40分 － 12分 ＝ ", a: 28 },
  { q: "40分 － 10分 ＝ ", a: 30 },
  { q: "23分 ＋ 17分 ＝ ", a: 40 },
  { q: "20分 ＋ 30分 ＝ ", a: 50 },
  { q: "60分 － 13分 ＝ ", a: 47 },
  { q: "14分 ＋ 22分 ＝ ", a: 36 },
  { q: "55分 － 32分 ＝ ", a: 23 },
  { q: "19分 － 7分 ＝ ", a: 12 },
  { q: "24分 ＋ 13分 ＝ ", a: 37 },
  { q: "29分 ＋ 12分 ＝ ", a: 41 },
  { q: "50分 － 19分 ＝ ", a: 31 },
  { q: "31分 ＋ 21分 ＝ ", a: 52 },
  { q: "25分 ＋ 35分 ＝ ", a: 60 },
  { q: "14分 ＋ 17分 ＝ ", a: 31 },
  { q: "28分 ＋ 12分 ＝ ", a: 40 },
  { q: "29分 － 19分 ＝ ", a: 10 },
  { q: "36分 － 7分 ＝ ", a: 29 },
  { q: "51分 － 13分 ＝ ", a: 38 },
  { q: "37分 － 18分 ＝ ", a: 19 },
  { q: "30分 ＋ 15分 ＝ ", a: 45 },
  { q: "22分 ＋ 28分 ＝ ", a: 50 },
  { q: "45分 － 12分 ＝ ", a: 33 },
  { q: "56分 － 34分 ＝ ", a: 22 },
  { q: "36分 ＋ 14分 ＝ ", a: 50 },
  { q: "57分 － 41分 ＝ ", a: 16 },
  { q: "21分 － 9分 ＝ ", a: 12 },
  { q: "26分 ＋ 32分 ＝ ", a: 58 },
  { q: "25分 ＋ 18分 ＝ ", a: 43 },
  { q: "33分 ＋ 27分 ＝ ", a: 60 },
  { q: "7分 ＋ 48分 ＝ ", a: 55 },
  { q: "49分 ＋ 11分 ＝ ", a: 60 },
  { q: "42分 － 13分 ＝ ", a: 29 },
  { q: "60分 － 53分 ＝ ", a: 7 },
  { q: "50分 － 10分 ＝ ", a: 40 },
  { q: "47分 － 29分 ＝ ", a: 18 },
  { q: "30分 － 12分 ＝ ", a: 18 },
  { q: "53分 ＋ 7分 ＝ ", a: 60 },
  { q: "45分 ＋ 15分 ＝ ", a: 60 },
  { q: "23分 ＋ 32分 ＝ ", a: 55 },
  { q: "18分 ＋ 34分 ＝ ", a: 52 },
  { q: "55分 － 16分 ＝ ", a: 39 },
  { q: "60分 － 25分 ＝ ", a: 35 },
  { q: "38分 ＋ 11分 ＝ ", a: 49 },
  { q: "49分 － 24分 ＝ ", a: 25 },
  { q: "26分 ＋ 21分 ＝ ", a: 47 },
  { q: "13分 ＋ 17分 ＝ ", a: 30 },
  { q: "5分 ＋ 55分 ＝ ", a: 60 },
  { q: "60分 － 15分 ＝ ", a: 45 },
  { q: "58分 － 34分 ＝ ", a: 24 },
  { q: "22分 ＋ 38分 ＝ ", a: 60 },
  { q: "31分 ＋ 17分 ＝ ", a: 48 },
  { q: "41分 ＋ 9分 ＝ ", a: 50 },
  { q: "39分 ＋ 8分 ＝ ", a: 47 }
];

const timeConversionList = [
  { q: "1分8秒 ＝ ", a: 68 },
  { q: "1分11秒 ＝ ", a: 71 },
  { q: "2分 ＝ ", a: 120 },
  { q: "2分36秒 ＝ ", a: 156 },
  { q: "1分30秒 ＝ ", a: 90 },
  { q: "2分9秒 ＝ ", a: 129 },
  { q: "2分5秒 ＝ ", a: 125 },
  { q: "3分 ＝ ", a: 180 },
  { q: "1分13秒 ＝ ", a: 73 },
  { q: "1分22秒 ＝ ", a: 82 },
  { q: "1分23秒 ＝ ", a: 83 },
  { q: "2分7秒 ＝ ", a: 127 },
  { q: "1分34秒 ＝ ", a: 94 },
  { q: "1分29秒 ＝ ", a: 89 },
  { q: "2分19秒 ＝ ", a: 139 },
  { q: "2分51秒 ＝ ", a: 171 },
  { q: "2分46秒 ＝ ", a: 166 },
  { q: "1分50秒 ＝ ", a: 110 },
  { q: "1分20秒 ＝ ", a: 80 },
  { q: "2分48秒 ＝ ", a: 168 },
  { q: "2分4秒 ＝ ", a: 124 },
  { q: "2分59秒 ＝ ", a: 179 },
  { q: "1分11秒 ＝ ", a: 71 },
  { q: "2分36秒 ＝ ", a: 156 },
  { q: "2分19秒 ＝ ", a: 139 },
  { q: "1分48秒 ＝ ", a: 108 },
  { q: "1分33秒 ＝ ", a: 93 },
  { q: "1分27秒 ＝ ", a: 87 },
  { q: "2分28秒 ＝ ", a: 148 },
  { q: "2分43秒 ＝ ", a: 163 },
  { q: "1分16秒 ＝ ", a: 76 },
  { q: "2分20秒 ＝ ", a: 140 },
  { q: "2分35秒 ＝ ", a: 155 },
  { q: "2分11秒 ＝ ", a: 131 },
  { q: "2分24秒 ＝ ", a: 144 },
  { q: "1分10秒 ＝ ", a: 70 },
  { q: "1分47秒 ＝ ", a: 107 },
  { q: "2分55秒 ＝ ", a: 175 },
  { q: "1分36秒 ＝ ", a: 96 },
  { q: "2分22秒 ＝ ", a: 142 },
  { q: "1分 ＝ ", a: 60 },
  { q: "2分5秒 ＝ ", a: 125 },
  { q: "1分10秒 ＝ ", a: 70 },
  { q: "1分40秒 ＝ ", a: 100 },
  { q: "1分30秒 ＝ ", a: 90 },
  { q: "1分8秒 ＝ ", a: 68 },
  { q: "2分 ＝ ", a: 120 },
  { q: "2分30秒 ＝ ", a: 150 },
  { q: "2分20秒 ＝ ", a: 140 },
  { q: "2分3秒 ＝ ", a: 123 },
  { q: "1分2秒 ＝ ", a: 62 },
  { q: "2分1秒 ＝ ", a: 121 },
  { q: "2分4秒 ＝ ", a: 124 },
  { q: "1分30秒 ＝ ", a: 90 },
  { q: "1分5秒 ＝ ", a: 65 },
  { q: "2分26秒 ＝ ", a: 146 },
  { q: "2分20秒 ＝ ", a: 140 },
  { q: "3分 ＝ ", a: 180 },
  { q: "1分35秒 ＝ ", a: 95 },
  { q: "1分50秒 ＝ ", a: 110 }
];

const timeConversion2List = [
  { q: 60, m: 1, s: 0 },
  { q: 100, m: 1, s: 40 },
  { q: 65, m: 1, s: 5 },
  { q: 136, m: 2, s: 16 },
  { q: 87, m: 1, s: 27 },
  { q: 169, m: 2, s: 49 },
  { q: 120, m: 2, s: 0 },
  { q: 73, m: 1, s: 13 },
  { q: 148, m: 2, s: 28 },
  { q: 152, m: 2, s: 32 },
  { q: 90, m: 1, s: 30 },
  { q: 123, m: 2, s: 3 },
  { q: 180, m: 3, s: 0 },
  { q: 69, m: 1, s: 9 },
  { q: 77, m: 1, s: 17 },
  { q: 171, m: 2, s: 51 },
  { q: 103, m: 1, s: 43 },
  { q: 158, m: 2, s: 38 },
  { q: 126, m: 2, s: 6 },
  { q: 115, m: 1, s: 55 },
  { q: 165, m: 2, s: 45 },
  { q: 130, m: 2, s: 10 },
  { q: 129, m: 2, s: 9 },
  { q: 157, m: 2, s: 37 },
  { q: 108, m: 1, s: 48 },
  { q: 176, m: 2, s: 56 },
  { q: 63, m: 1, s: 3 },
  { q: 134, m: 2, s: 14 },
  { q: 147, m: 2, s: 27 },
  { q: 91, m: 1, s: 31 },
  { q: 79, m: 1, s: 19 },
  { q: 111, m: 1, s: 51 },
  { q: 142, m: 2, s: 22 },
  { q: 76, m: 1, s: 16 },
  { q: 95, m: 1, s: 35 },
  { q: 128, m: 2, s: 8 },
  { q: 154, m: 2, s: 34 },
  { q: 164, m: 2, s: 44 },
  { q: 83, m: 1, s: 23 },
  { q: 139, m: 2, s: 19 },
  { q: 140, m: 2, s: 20 },
  { q: 89, m: 1, s: 29 },
  { q: 168, m: 2, s: 48 },
  { q: 172, m: 2, s: 52 },
  { q: 106, m: 1, s: 46 },
  { q: 153, m: 2, s: 33 },
  { q: 62, m: 1, s: 2 },
  { q: 106, m: 1, s: 46 },
  { q: 125, m: 2, s: 5 },
  { q: 97, m: 1, s: 37 },
  { q: 127, m: 2, s: 7 },
  { q: 99, m: 1, s: 39 },
  { q: 84, m: 1, s: 24 },
  { q: 70, m: 1, s: 10 },
  { q: 159, m: 2, s: 39 },
  { q: 163, m: 2, s: 43 },
  { q: 110, m: 1, s: 50 },
  { q: 132, m: 2, s: 12 },
  { q: 178, m: 2, s: 58 },
  { q: 105, m: 1, s: 45 }
];

const wordProblems = {
  kuku: [
    {
      q:
        "エルフの まほう使いが 1日に 3回、かいふくの まほうを 使います。7日間では 何回 使いますか？",
      a: 21,
      suffix: "回"
    },
    {
      q:
        "1ぱこに 8個の やくそうが 入っています。4ぱこでは やくそうは ぜんぶで 何個ですか？",
      a: 32,
      suffix: "個"
    },
    {
      q:
        "ゆう者が スライムを 1回の こうげきで 5ひき たおします。9回 こうげきすると 何ひき たおせますか？",
      a: 45,
      suffix: "ひき"
    },
    {
      q:
        "商人が 1つの 町で 6さつの まどう書を 売りました。8つの 町を めぐると、ぜんぶで 何さつ 売れますか？",
      a: 48,
      suffix: "さつ"
    },
    {
      q:
        "1つの チームは 4人で 組まれています。ギルドに 6チーム いるとき、人は ぜんぶで 何人ですか？",
      a: 24,
      suffix: "人"
    },
    {
      q:
        "ドラゴンが 1日に 2時間 空を 飛びます。1週間(7日)で 何時間 飛びますか？",
      a: 14,
      suffix: "時間"
    },
    {
      q:
        "宝ばこに お金が 9枚ずつ 入っています。宝ばこが 3つ あると、お金は ぜんぶで 何枚ですか？",
      a: 27,
      suffix: "枚"
    }
  ],
  weight: [
    {
      q: "鉄の けん は 800g、木の たて は 400gです。合わせると 何gですか？",
      a: 1200,
      suffix: "g"
    },
    {
      q: "ゴーレムの 重さは 1t200kgです。これは 何kgですか？",
      a: 1200,
      suffix: "kg"
    },
    {
      q: "やくそう 1つは 50gです。3つ 集めると 何gに なりますか？",
      a: 150,
      suffix: "g"
    },
    {
      q:
        "馬車（ばしゃ）に 500kgの 石と、700kgの 木を つみました。ぜんぶで 何kgですか？",
      a: 1200,
      suffix: "kg"
    },
    {
      q:
        "体重が 70kgの 人が、6kgの 服を 着ました。ぜんぶの 重さは 何kgですか？",
      a: 76,
      suffix: "kg"
    },
    {
      q: "2kgの 石から、500gを けずりました。残りは 何gですか？",
      a: 1500,
      suffix: "g"
    },
    {
      q: "馬車の 重さは 1100kgです。これは 1tと 何kgですか？",
      a: 100,
      suffix: "kg"
    }
  ],
  add_sub: [
    {
      q:
        "HPが 150の ま物に、ゆう者が 85の ダメージを あたえました。ま物の 残りの HPは いくつ？",
      a: 65,
      suffix: ""
    },
    {
      q:
        "村に お金が 350円 ありました。お祭りで 120円 使いました。残りは 何円？",
      a: 230,
      suffix: "円"
    },
    {
      q:
        "エルフが 1200年の ねむりから さめ、さらに 350年 旅を しました。ぜんぶで 何年？",
      a: 1550,
      suffix: "年"
    },
    {
      q:
        "お店で けん を 450円、たて を 280円で 買いました。お金は ぜんぶで いくら？",
      a: 730,
      suffix: "円"
    },
    {
      q:
        "大ま王の おしろ まで 2000kmあります。今日までに 850km進みました。残りは 何km？",
      a: 1150,
      suffix: "km"
    },
    {
      q:
        "王さまの たから物こ に お金が 3140円 ありました。1500円を へい士に 分けました。残りは 何円？",
      a: 1640,
      suffix: "円"
    },
    {
      q:
        "1日目に モンスターを 145ひき、2日目に 268ひき たおしました。合わせて 何ひき？",
      a: 413,
      suffix: "ひき"
    }
  ],
  large_mult: [
    {
      q:
        "1ぱこに 12個の かいふくやく が 入っています。15ぱこ では ぜんぶで 何個ですか？",
      a: 180,
      suffix: "個"
    },
    {
      q:
        "1回の まほう で 25ダメージを あたえます。14回 まほうを 使うと ぜんぶで いくつ？",
      a: 350,
      suffix: ""
    },
    {
      q: "1日に 24km進む 馬車が あります。12日間では 何km進みますか？",
      a: 288,
      suffix: "km"
    },
    {
      q:
        "お金が 1ふくろに 50枚 入っています。25ふくろ では ぜんぶで 何枚ですか？",
      a: 1250,
      suffix: "枚"
    },
    {
      q: "1さつ 350円の まどう書を、チームの 4人分 買いました。お金は いくら？",
      a: 1400,
      suffix: "円"
    },
    {
      q: "町から 村まで 15kmあります。60回 行ったり 来たり すると 何km？",
      a: 900,
      suffix: "km"
    },
    {
      q:
        "1時間の しゅぎょう で けいけんちが 120 入ります。24時間 しゅぎょう すると いくつ？",
      a: 2880,
      suffix: ""
    }
  ],
  decimal: [
    {
      q: "まほうの 水を 0.3L、くすりの 粉を 0.5L 入れました。合わせて 何L？",
      a: 0.8,
      suffix: "L"
    },
    {
      q: "1.5kmある 森の 道の うち、0.7km 歩きました。残りは 何km？",
      a: 0.8,
      suffix: "km"
    },
    {
      q: "水とう に 1.2Lの 水が 入っています。0.4L 飲みました。残りは 何L？",
      a: 0.8,
      suffix: "L"
    },
    {
      q: "0.2kgの 鉱石（こうせき）が 4つ あります。ぜんぶで 何kg？",
      a: 0.8,
      suffix: "kg"
    },
    {
      q: "2.4mの まほうの つなを 3つに 分けました。1つ分は 何m？",
      a: 0.8,
      suffix: "m"
    },
    {
      q:
        "背の高さが 1.8mの せん士が、0.2mの 台に 乗りました。高さは 合わせて 何m？",
      a: 2.0,
      suffix: "m"
    },
    {
      q: "1.5Lの れいやく を 5人で 同じように 分けます。1人分は 何L？",
      a: 0.3,
      suffix: "L"
    }
  ],
  fraction: [
    {
      q:
        "かいふくの ケーキを 5つに 分けました。2つ 食べると、残りは ぜん体の ◯/5 です。◯は？",
      a: 3,
      suffix: ""
    },
    {
      q:
        "まほうの 水を 1/4 Lと 2/4 L 混ぜました。ぜんぶで ◯/4 Lに なります。◯は？",
      a: 3,
      suffix: ""
    },
    {
      q: "どうくつの 3/7 を 進みました。残りは 道のりの ◯/7 です。◯は？",
      a: 4,
      suffix: ""
    },
    {
      q:
        "1mの まほう陣の 4/6 を かき、その後 1/6 を かきました。合わせて ◯/6 かいた。",
      a: 5,
      suffix: ""
    },
    {
      q:
        "HPが 8/10 あります。てきの こうげきで 3/10 減りました。残りは ◯/10 です。",
      a: 5,
      suffix: ""
    },
    {
      q:
        "MPを 2/9 使って まほうを うち、さらに 5/9 使って 大きな まほうを うちました。合わせて ◯/9 使った。",
      a: 7,
      suffix: ""
    },
    {
      q: "宝の 地図の 6/8 が 見つかりました。あと ◯/8 で 完成します。",
      a: 2,
      suffix: ""
    }
  ],
  div_rem: [
    {
      q:
        "23個の 魔石（ませき）を、3人で 同じ 数ずつ 分けます。1人 何個で、何個 あまる？",
      a: 7,
      rem: 2
    },
    {
      q:
        "17枚の お金を、5つの ふくろに 同じ 数ずつ 入れます。1ふくろ 何枚で、何枚 あまる？",
      a: 3,
      rem: 2
    },
    {
      q:
        "30個の やくそうを、4つの チームで 同じように 分けました。1チーム 何個で、何個 あまる？",
      a: 7,
      rem: 2
    },
    {
      q:
        "40ひきの スライムを、6人の ゆう者で 同じ 数ずつ たおします。1人 何ひきで、何ひき あまる？",
      a: 6,
      rem: 4
    },
    {
      q:
        "ギルドに 28人の 人が います。5人ずつの チームを 作ると、何チーム できて 何人 あまる？",
      a: 5,
      rem: 3
    },
    {
      q: "50個の リンゴを、8個ずつ 箱に つめます。何箱 できて、何個 あまる？",
      a: 6,
      rem: 2
    },
    {
      q:
        "まどう書を 35ページ 読みます。1日に 4ページずつ 読むと、何日 かかって 何ページ あまる？",
      a: 8,
      rem: 3
    }
  ],
  area_calc: [
    {
      q: "たて 5cm、よこ 8cmの 長方形の 形を した おふだの 広さ(めんせき)は？",
      a: 40,
      suffix: "㎠"
    },
    { q: "1辺が 6cmの 正方形の けっかいの 広さは？", a: 36, suffix: "㎠" },
    { q: "たて 4m、よこ 7mの 部屋の 広さは？", a: 28, suffix: "㎡" },
    {
      q: "底辺が 10cm、高さが 4cmの 三角形の 石の 広さは？",
      a: 20,
      suffix: "㎠"
    },
    { q: "たて 9cm、よこ 3cmの 長方形の 鏡の 広さは？", a: 27, suffix: "㎠" },
    {
      q: "1辺が 10mの 正方形の 形を した ボスの 部屋の 広さは？",
      a: 100,
      suffix: "㎡"
    },
    {
      q: "底辺が 8cm、高さが 5cmの 三角形の たて の 広さは？",
      a: 20,
      suffix: "㎠"
    }
  ],
  time_seconds: [
    {
      q: "まほうを となえるのに 1分20秒 かかりました。これは 何秒ですか？",
      a: 80,
      suffix: "秒"
    },
    {
      q: "ゆう者が 100秒間、息を 止めました。これは 1分◯秒です。◯は？",
      a: 40,
      suffix: "秒"
    },
    {
      q: "くんれん所で 1時間30分 くんれん しました。これは 何分ですか？",
      a: 90,
      suffix: "分"
    },
    {
      q:
        "どうくつを クリアするのに 90秒 かかりました。これは 1分◯秒です。◯は？",
      a: 30,
      suffix: "秒"
    },
    {
      q: "70秒間、てきの こうげきを たえました。これは 1分◯秒です。◯は？",
      a: 10,
      suffix: "秒"
    },
    {
      q:
        "朝の 7時50分に 町を 出て、8時10分に 森に 着きました。かかった 時間は 何分？",
      a: 20,
      suffix: "分"
    },
    {
      q:
        "カップめん(3分)と やくそう作り(2分)。待つ 時間は 合わせて 何秒ですか？",
      a: 300,
      suffix: "秒"
    }
  ],
  sun_shadow: [
    {
      q:
        "朝、太陽が 東に あるとき、かげは どの 方角に できますか？(1:東 2:西 3:南 4:北)",
      a: 2,
      suffix: ""
    },
    {
      q:
        "昼、太陽が 南の 空 高くに あるとき、かげは どの 方角に できますか？(1:東 2:西 3:南 4:北)",
      a: 4,
      suffix: ""
    },
    {
      q:
        "夕方、かげが 東に のびているとき、太陽は どの 方角に ありますか？(1:東 2:西 3:南 4:北)",
      a: 2,
      suffix: ""
    },
    {
      q:
        "太陽が 高い ところに あるほど、かげの 長さは どう なりますか？(1:長くなる 2:短くなる)",
      a: 2,
      suffix: ""
    },
    {
      q:
        "1日の 中で、かげが 一番 短く なるのは いつごろ ですか？(1:朝 2:昼 3:夕方)",
      a: 2,
      suffix: ""
    },
    {
      q:
        "日なた と 日かげで、地面が あたたかいのは どちら ですか？(1:日なた 2:日かげ)",
      a: 1,
      suffix: ""
    },
    {
      q:
        "光を 鏡で はね返して まとに 当てました。鏡の 数を 増やすと まとの 明るさは？(1:明るくなる 2:暗くなる)",
      a: 1,
      suffix: ""
    }
  ],
  missing_multdiv: [
    {
      q:
        "スライムを ◯ひき たおすと、けいけんちが 5ずつ 入り、合わせて 35に なりました。◯は？",
      a: 7,
      suffix: "ひき"
    },
    {
      q: "8人に やくそうを ◯個ずつ 配ると、ぜんぶで 32個 いりました。◯は？",
      a: 4,
      suffix: "個"
    },
    { q: "◯ × 6 ＝ 54 のとき、◯に 入る 数は いくつですか？", a: 9, suffix: "" },
    {
      q: "42枚の お金を ◯人で 分けると、1人 7枚に なりました。◯は？",
      a: 6,
      suffix: "人"
    },
    { q: "◯ ÷ 5 ＝ 8 のとき、◯に 入る 数は いくつですか？", a: 40, suffix: "" },
    {
      q:
        "宝ばこが ◯個 あり、それぞれに 9個の 魔石（ませき）が 入っています。合わせて 63個です。◯は？",
      a: 7,
      suffix: "個"
    },
    { q: "36 ÷ ◯ ＝ 4 のとき、◯に 入る 数は いくつですか？", a: 9, suffix: "" }
  ],
  large_mental: [
    {
      q: "王国軍の へい士が 300人、まほう使いが 400人 います。合わせて 何人？",
      a: 700,
      suffix: "人"
    },
    {
      q: "1000円 持っていて、600円の まどう書を 買いました。おつりは いくら？",
      a: 400,
      suffix: "円"
    },
    {
      q:
        "1ぱこ に 200本 入りの 矢が あります。3ぱこ では ぜんぶで 何本 ですか？",
      a: 600,
      suffix: "本"
    },
    {
      q: "HPが 1500の ゴーレムに、800の ダメージを あたえました。残りの HPは？",
      a: 700,
      suffix: ""
    },
    {
      q: "400枚の お金が 入った ふくろが 2つ あります。お金は ぜんぶで 何枚？",
      a: 800,
      suffix: "枚"
    },
    {
      q: "1200kmの 旅のうち、500km 進みました。残りは 何km？",
      a: 700,
      suffix: "km"
    },
    {
      q:
        "1日に 300の けいけんちを 手に 入れます。3日間で いくつ 手に 入れますか？",
      a: 900,
      suffix: ""
    }
  ]
};

const monsterData = [
  {
    name: "スライム",
    hp: 2,
    atk: 1,
    icon:
      '<img src="https://assets.st-note.com/img/1772716673-Siqp1vmwzbGXTeft39UNAlak.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
    reward: 5,
    expBonus: 2,
    drop: "shizuku"
  },
  {
    name: "コウモリ",
    hp: 3,
    atk: 2,
    icon:
      '<img src="https://assets.st-note.com/img/1772716684-n8GKJt3TveugpY0hd415Rczx.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
    reward: 8,
    expBonus: 4,
    drop: "hone"
  },
  {
    name: "がいこつ",
    hp: 5,
    atk: 3,
    icon:
      '<img src="https://assets.st-note.com/img/1772716438-8LIRbVviCus0HExf1lUKM6aQ.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
    reward: 10,
    expBonus: 6,
    drop: "hone"
  },
  {
    name: "ゴーレム",
    hp: 8,
    atk: 5,
    icon: "👿",
    reward: 15,
    expBonus: 8,
    drop: "kouseki"
  },
  {
    name: "ドラゴン",
    hp: 12,
    atk: 8,
    icon:
      '<img src="https://assets.st-note.com/img/1772718044-dse6U2pFv8PnioBVKMayJqZ4.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
    reward: 25,
    expBonus: 10,
    drop: "maseki"
  }
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PWD_CHARS =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼ";

// ============================================================
// 02  プレイヤーの じょうたい と セーブ
// ※ セーブのキー名（quest_〜）は もとの ゲームと 同じなので、
//   いま あそんでいる 子の データは そのまま 引きつがれます。
// ============================================================
let currentNum1 = 0;
let currentNum2 = 0;
let currentAnswer = 0;
let currentRem = 0;
let stageMin = 1;
let stageMax = 9;
let stageType = "kuku";

let level = 1;
let exp = 0;
let nextExp = 10;
let gold = 0;
let playerMaxHp = 20;
let currentPlayerHp = 20;
let weaponLevel = 0;
let armorLevel = 0;
let potions = 0;

let isHardMode = false;
let isTrapEncounter = false;
let isBossBattle = false;
let isMimic = false;
let companions = [];
let currentCombo = 0;
let battleTimer = null;
let currentMonsterHp = 0;
let currentMonsterAtk = 1;
let currentEnemyIndex = -1;

let records = {}; // ステージごとの きろく { clears, stars, correct, total }
let stats = { correct: 0, wrong: 0, monsters: 0, bosses: 0, unit: {} };
let soundMode = "all"; // all = BGM+こうかおん / se = こうかおんだけ / off = なし
let currentFocusInput = null;
let pendingLevelUps = 0;

const SAVE_KEYS = [
  "quest_level",
  "quest_exp",
  "quest_nextExp",
  "quest_gold",
  "quest_maxHp",
  "quest_currentHp",
  "quest_weaponLevel",
  "quest_armorLevel",
  "quest_potions",
  "quest_companions",
  "quest_materials",
  "quest_records",
  "quest_stats",
  "quest_sound"
];

function lsGet(k) {
  try {
    return localStorage.getItem(k);
  } catch (e) {
    return null;
  }
}
function lsSet(k, v) {
  try {
    localStorage.setItem(k, v);
  } catch (e) {}
}
function lsDel(k) {
  try {
    localStorage.removeItem(k);
  } catch (e) {}
}

// さいだいHP は レベルと ぼうぐ から きまる
function calcMaxHp() {
  const a = armorData[armorLevel] || armorData[0];
  return 20 + (level - 1) * 4 + a.hpBonus;
}

function cleanData() {
  level = Math.max(1, Math.min(99, Math.floor(Number(level) || 1)));
  exp = Math.max(0, Math.floor(Number(exp) || 0));
  nextExp = Math.max(10, Math.floor(Number(nextExp) || 10));
  gold = Math.max(0, Math.floor(Number(gold) || 0));
  weaponLevel = Math.min(
    Math.max(0, Math.floor(Number(weaponLevel) || 0)),
    weaponData.length - 1
  );
  armorLevel = Math.min(
    Math.max(0, Math.floor(Number(armorLevel) || 0)),
    armorData.length - 1
  );
  potions = Math.max(0, Math.floor(Number(potions) || 0));
  playerMaxHp = calcMaxHp();
  currentPlayerHp = Number(currentPlayerHp);
  if (!isFinite(currentPlayerHp)) currentPlayerHp = playerMaxHp;
  currentPlayerHp = Math.max(
    0,
    Math.min(playerMaxHp, Math.round(currentPlayerHp))
  );
  if (!Array.isArray(companions)) companions = [];
  // なかまは もとの リスト（allCompanionsList）に あるものだけ のこす
  const seen = new Set();
  companions = companions.filter(
    (c) =>
      typeof c === "string" &&
      allCompanionsList.includes(c) &&
      !seen.has(c) &&
      seen.add(c)
  );
  if (!materials || typeof materials !== "object") materials = {};
  for (const k of [
    "shizuku",
    "hone",
    "kouseki",
    "maseki",
    "hoshisuna",
    "tsukiishi"
  ]) {
    materials[k] = Math.max(0, Math.floor(Number(materials[k]) || 0));
  }
  if (!records || typeof records !== "object") records = {};
  if (!stats || typeof stats !== "object") stats = {};
  stats.correct = Number(stats.correct) || 0;
  stats.wrong = Number(stats.wrong) || 0;
  stats.monsters = Number(stats.monsters) || 0;
  stats.bosses = Number(stats.bosses) || 0;
  if (!stats.unit || typeof stats.unit !== "object") stats.unit = {};
}

function saveData() {
  cleanData();
  lsSet("quest_level", level);
  lsSet("quest_exp", exp);
  lsSet("quest_nextExp", nextExp);
  lsSet("quest_gold", gold);
  lsSet("quest_maxHp", playerMaxHp);
  lsSet("quest_currentHp", currentPlayerHp);
  lsSet("quest_weaponLevel", weaponLevel);
  lsSet("quest_armorLevel", armorLevel);
  lsSet("quest_potions", potions);
  lsSet("quest_companions", JSON.stringify(companions));
  lsSet("quest_materials", JSON.stringify(materials));
  lsSet("quest_records", JSON.stringify(records));
  lsSet("quest_stats", JSON.stringify(stats));
  lsSet("quest_sound", soundMode);
}

function hasSaveData() {
  return lsGet("quest_gold") !== null;
}

function loadData() {
  try {
    if (lsGet("quest_gold") !== null) {
      level = parseInt(lsGet("quest_level"));
      exp = parseInt(lsGet("quest_exp"));
      nextExp = parseInt(lsGet("quest_nextExp"));
      gold = parseInt(lsGet("quest_gold"));
      currentPlayerHp = parseInt(lsGet("quest_currentHp"));
      weaponLevel = parseInt(lsGet("quest_weaponLevel"));
      armorLevel = parseInt(lsGet("quest_armorLevel"));
      potions = parseInt(lsGet("quest_potions")) || 0;
      if (lsGet("quest_companions"))
        companions = JSON.parse(lsGet("quest_companions"));
      if (lsGet("quest_materials"))
        materials = JSON.parse(lsGet("quest_materials"));
      if (lsGet("quest_records")) records = JSON.parse(lsGet("quest_records"));
      if (lsGet("quest_stats")) stats = JSON.parse(lsGet("quest_stats"));
      // たおれたままの データは ふっかつ させてあげる
      if (!(currentPlayerHp > 0)) currentPlayerHp = 99999;
    }
    const s = lsGet("quest_sound");
    if (s === "all" || s === "se" || s === "off") soundMode = s;
  } catch (e) {}
  cleanData();
}

// レベルアップ（もらった EXP が おおいときは 何回でも あがる）
function checkLevelUp() {
  let ups = 0;
  while (exp >= nextExp && level < 99) {
    level += 1;
    exp = exp - nextExp;
    nextExp = Math.floor(nextExp * 1.5);
    ups++;
  }
  if (ups > 0) {
    playerMaxHp = calcMaxHp();
    currentPlayerHp = playerMaxHp;
    pendingLevelUps += ups;
  }
  return ups;
}

function recordAnswer(isCorrect) {
  const st = currentStage;
  if (isCorrect) stats.correct++;
  else stats.wrong++;
  if (st) {
    const u = stats.unit[st.unit] || (stats.unit[st.unit] = { c: 0, t: 0 });
    u.t++;
    if (isCorrect) u.c++;
  }
}

// ============================================================
// 03  おと（こうかおん と BGM）  ※ すべて その場で 合成するので 音声ファイルは いりません
// ============================================================
const Sound = (() => {
  let ac = null,
    master = null,
    seBus = null,
    bgmBus = null,
    noiseBuf = null;
  let bgmTimer = null,
    bgmName = null,
    wantBgm = null,
    song = null,
    bgmStep = 0,
    bgmNext = 0;

  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midi(n) {
    const m = /^([A-G])(#|b)?(\d)$/.exec(n);
    if (!m) return null;
    return (
      NOTE[m[1]] +
      (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) +
      (parseInt(m[3], 10) + 1) * 12
    );
  }
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function ensure() {
    if (ac) {
      if (ac.state === "suspended") ac.resume();
      return true;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ac = new AC();
    } catch (e) {
      return false;
    }
    master = ac.createGain();
    master.gain.value = 0.55;
    master.connect(ac.destination);
    seBus = ac.createGain();
    seBus.gain.value = 0.6;
    seBus.connect(master);
    bgmBus = ac.createGain();
    bgmBus.gain.value = 0.2;
    bgmBus.connect(master);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.6, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }

  function osc(type, f, t0, dur, vol, bus, f2) {
    const o = ac.createOscillator(),
      g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(bus || seBus);
    o.start(t0);
    o.stop(t0 + dur + 0.03);
  }
  function noise(t0, dur, vol, cutoff, type, bus) {
    const s = ac.createBufferSource(),
      f = ac.createBiquadFilter(),
      g = ac.createGain();
    s.buffer = noiseBuf;
    f.type = type || "lowpass";
    f.frequency.value = cutoff || 2000;
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f);
    f.connect(g);
    g.connect(bus || seBus);
    s.start(t0);
    s.stop(t0 + dur + 0.02);
  }
  const arp = (t, notes, gap, len, type, vol) =>
    notes.forEach((n, i) =>
      osc(type || "square", hz(midi(n)), t + i * gap, len, vol || 0.12)
    );

  const SE = {
    cursor: (t) => osc("square", 1046, t, 0.045, 0.07),
    select: (t) => {
      osc("square", 784, t, 0.05, 0.09);
      osc("square", 1175, t + 0.05, 0.08, 0.09);
    },
    step: (t) => osc("triangle", 190, t, 0.035, 0.05, null, 130),
    bump: (t) => osc("square", 120, t, 0.09, 0.09, null, 80),
    hit: (t) => {
      noise(t, 0.12, 0.35, 1800);
      osc("square", 360, t, 0.1, 0.1, null, 110);
    },
    crit: (t) => {
      noise(t, 0.3, 0.5, 900);
      osc("sawtooth", 1100, t, 0.28, 0.13, null, 120);
      osc("square", 1600, t + 0.04, 0.16, 0.07, null, 500);
    },
    damage: (t) => {
      noise(t, 0.24, 0.45, 420);
      osc("square", 160, t, 0.22, 0.18, null, 55);
    },
    correct: (t) => {
      osc("square", 1046, t, 0.07, 0.1);
      osc("square", 1568, t + 0.07, 0.13, 0.1);
    },
    wrong: (t) => {
      osc("square", 233, t, 0.12, 0.1);
      osc("square", 196, t + 0.13, 0.22, 0.1);
    },
    heal: (t) =>
      arp(t, ["C5", "E5", "G5", "C6", "E6"], 0.055, 0.14, "triangle", 0.14),
    coin: (t) => {
      osc("square", 988, t, 0.06, 0.08);
      osc("square", 1319, t + 0.06, 0.2, 0.08);
    },
    item: (t) => arp(t, ["G5", "C6", "E6"], 0.07, 0.12, "triangle", 0.13),
    chest: (t) => {
      noise(t, 0.08, 0.2, 900);
      arp(t + 0.08, ["C5", "G5", "C6", "E6", "G6"], 0.05, 0.1, "square", 0.07);
    },
    trap: (t) => {
      osc("sawtooth", 1400, t, 0.3, 0.12, null, 90);
      noise(t, 0.3, 0.3, 3000, "highpass");
    },
    encounter: (t) => {
      for (let i = 0; i < 6; i++)
        osc("square", 900 - i * 110, t + i * 0.045, 0.06, 0.08);
      noise(t + 0.28, 0.25, 0.3, 700);
    },
    boss: (t) => {
      for (let i = 0; i < 3; i++) {
        osc("sawtooth", 98, t + i * 0.42, 0.36, 0.18, null, 92);
        osc("square", 880, t + i * 0.42, 0.18, 0.08);
        osc("square", 659, t + i * 0.42 + 0.2, 0.18, 0.08);
      }
    },
    win: (t) =>
      arp(
        t,
        ["C5", "E5", "G5", "C6", "G5", "C6", "E6"],
        0.1,
        0.16,
        "square",
        0.1
      ),
    bigwin: (t) => {
      arp(
        t,
        ["G4", "C5", "E5", "G5", "E5", "G5", "C6"],
        0.11,
        0.18,
        "square",
        0.1
      );
      arp(t + 0.8, ["C6", "D6", "E6", "G6"], 0.09, 0.4, "triangle", 0.12);
    },
    levelup: (t) => {
      arp(t, ["C5", "E5", "G5", "C6"], 0.08, 0.12, "square", 0.1);
      arp(t + 0.36, ["D6", "E6", "G6", "C7"], 0.06, 0.2, "triangle", 0.12);
    },
    dead: (t) =>
      arp(
        t,
        ["E5", "D5", "C5", "B4", "A4", "G#4", "E4"],
        0.14,
        0.24,
        "triangle",
        0.13
      ),
    craft: (t) => {
      for (let i = 0; i < 3; i++) {
        noise(t + i * 0.2, 0.08, 0.35, 5000, "highpass");
        osc("square", 1760, t + i * 0.2, 0.07, 0.06);
      }
      arp(t + 0.65, ["C6", "E6", "G6"], 0.07, 0.16, "triangle", 0.12);
    },
    gacha: (t) => {
      for (let i = 0; i < 10; i++)
        osc("square", 400 + i * 70, t + i * 0.07, 0.05, 0.06);
    },
    rare: (t) => {
      arp(t, ["E6", "G6", "B6", "E7"], 0.06, 0.3, "triangle", 0.1);
      arp(t + 0.3, ["C6", "E6", "G6", "C7"], 0.06, 0.4, "square", 0.06);
    },
    potion: (t) => {
      osc("sine", 300, t, 0.25, 0.15, null, 900);
      arp(t + 0.2, ["E5", "G5", "C6"], 0.06, 0.12, "triangle", 0.12);
    },
    whoosh: (t) => noise(t, 0.35, 0.3, 1200, "bandpass"),
    stamp: (t) => osc("triangle", 880, t, 0.12, 0.12, null, 1320)
  };

  // ---------- BGM（オリジナルの 曲） ----------
  // 1こ = 8分音符。 "." は のばす、 "-" は やすみ
  const SONGS = {
    title: {
      bpm: 92,
      lw: "square",
      bw: "triangle",
      lead:
        "C5 . . . G4 . C5 . E5 . . . D5 . C5 . F5 . . . E5 . D5 . G5 . . . . . - - A5 . . . G5 . F5 . E5 . . . D5 . C5 . D5 . . . E5 . D5 . C5 . . . . . - -",
      bass:
        "C3 . . . G2 . . . C3 . . . G2 . . . F2 . . . C3 . . . G2 . . . G2 . . . F2 . . . F2 . . . C3 . . . A2 . . . G2 . . . G2 . . . C3 . . . C3 . . ."
    },
    town: {
      bpm: 104,
      lw: "square",
      bw: "triangle",
      lead:
        "E5 . G5 . C6 . B5 A5 G5 . E5 . C5 . D5 E5 F5 . A5 . G5 . F5 E5 D5 . . . . . - - E5 . G5 . C6 . D6 E6 D6 . C6 . A5 . G5 . F5 . E5 . D5 . G5 . C5 . . . . . - -",
      bass:
        "C3 - G3 - C3 - G3 - C3 - G3 - C3 - E3 - F2 - C3 - F2 - C3 - G2 - D3 - G2 - B2 - C3 - G3 - C3 - G3 - A2 - E3 - A2 - E3 - F2 - C3 - G2 - D3 - C3 - G3 - C3 . . -"
    },
    field: {
      bpm: 126,
      lw: "square",
      bw: "triangle",
      drum: "k-h-s-h-k-k-s-h-",
      lead:
        "G4 . B4 . D5 . G5 . F#5 . D5 . E5 . D5 . C5 . E5 . A5 . G5 . F#5 . . . D5 . . . G4 . B4 . D5 . G5 . A5 . G5 . F#5 . E5 . D5 . E5 . C5 . A4 . G4 . . . . . - -",
      bass:
        "G2 - D3 - G2 - D3 - D2 - A2 - D2 - A2 - C3 - G3 - C3 - G3 - D3 - A3 - D3 - F#3 - G2 - D3 - G2 - D3 - E2 - B2 - E2 - B2 - A2 - E3 - D3 - A3 - G2 - D3 - G2 . . -"
    },
    dungeon: {
      bpm: 112,
      lw: "square",
      bw: "triangle",
      drum: "k---h---s---h---",
      lead:
        "A4 . C5 . E5 . A5 . G5 . E5 . D5 . E5 . F5 . E5 . D5 . C5 . B4 . . . E4 . . . A4 . C5 . E5 . A5 . B5 . A5 . G5 . A5 . F5 . G5 . E5 . D5 . E5 . . . . . - -",
      bass:
        "A2 - A3 - A2 - A3 - C3 - C4 - C3 - G3 - D3 - D4 - D3 - A3 - E2 - E3 - E2 - B2 - A2 - A3 - A2 - A3 - G2 - G3 - G2 - D3 - F2 - F3 - F2 - C3 - E2 - E3 - G#2 - B2 -"
    },
    battle: {
      bpm: 156,
      lw: "square",
      bw: "square",
      drum: "k-hsk-hs",
      lead:
        "E5 E5 - E5 G5 . E5 - D5 D5 - D5 F#5 . D5 - C5 C5 - C5 E5 . G5 . B4 . D#5 . F#5 . B5 . E5 E5 - E5 G5 . B5 - A5 . G5 . F#5 . E5 . C6 . B5 . A5 . F#5 . G5 . F#5 . D#5 . B4 .",
      bass:
        "E2 E3 E2 E3 E2 E3 E2 E3 D2 D3 D2 D3 D2 D3 D2 D3 C2 C3 C2 C3 C2 C3 C2 C3 B1 B2 B1 B2 B1 B2 B1 B2 E2 E3 E2 E3 E2 E3 E2 E3 A2 A3 A2 A3 A2 A3 A2 A3 C2 C3 C2 C3 D2 D3 D2 D3 B1 B2 B1 B2 B1 B2 B1 B2"
    },
    boss: {
      bpm: 168,
      lw: "sawtooth",
      bw: "square",
      drum: "kkhskkhs",
      lead:
        "D5 . F5 . A5 . D6 . C#6 . . . A5 . . . Bb5 . A5 . G5 . F5 . E5 . G5 . C#5 . E5 . D5 . F5 . A5 . D6 . E6 . D6 . C6 . A5 . Bb5 . G5 . E5 . C#5 . D5 . . . . . A4 .",
      bass:
        "D2 D2 D3 D2 D2 D3 D2 D3 A1 A1 A2 A1 A1 A2 A1 A2 Bb1 Bb1 Bb2 Bb1 Bb1 Bb2 Bb1 Bb2 A1 A1 A2 A1 A1 A2 C#2 E2 D2 D2 D3 D2 D2 D3 D2 D3 C2 C2 C3 C2 F2 F2 F3 F2 G1 G1 G2 G1 A1 A1 A2 A1 D2 D2 D3 D2 A1 A1 A2 A1"
    }
  };
  function parseTrack(str) {
    const tk = str.trim().split(/\s+/);
    const ev = [];
    for (let i = 0; i < tk.length; i++) {
      if (tk[i] === "." || tk[i] === "-") continue;
      let len = 1;
      while (tk[i + len] === ".") len++;
      ev.push({ s: i, len, m: midi(tk[i]) });
    }
    return { len: tk.length, ev };
  }
  const parsed = {};
  function getSong(name) {
    if (parsed[name]) return parsed[name];
    const s = SONGS[name];
    if (!s) return null;
    parsed[name] = {
      bpm: s.bpm,
      lw: s.lw,
      bw: s.bw,
      lead: parseTrack(s.lead),
      bass: parseTrack(s.bass),
      drum: s.drum || ""
    };
    return parsed[name];
  }
  function schedule() {
    if (!song || !ac) return;
    const stepDur = 60 / song.bpm / 2;
    while (bgmNext < ac.currentTime + 0.15) {
      for (const [tr, wave, vol, oct] of [
        [song.lead, song.lw, 0.09, 0],
        [song.bass, song.bw, 0.11, 0]
      ]) {
        const pos = bgmStep % tr.len;
        for (const e of tr.ev)
          if (e.s === pos && e.m)
            osc(
              wave,
              hz(e.m + oct),
              bgmNext,
              Math.max(0.08, e.len * stepDur * 0.92),
              vol,
              bgmBus
            );
      }
      if (song.drum) {
        const d = song.drum[bgmStep % song.drum.length];
        if (d === "k") osc("sine", 140, bgmNext, 0.12, 0.25, bgmBus, 45);
        else if (d === "s") noise(bgmNext, 0.1, 0.14, 2600, "highpass", bgmBus);
        else if (d === "h")
          noise(bgmNext, 0.035, 0.06, 7000, "highpass", bgmBus);
      }
      bgmNext += stepDur;
      bgmStep++;
    }
  }
  function startBgm(name) {
    if (bgmName === name && bgmTimer) return;
    stopBgmInner();
    if (!ensure()) return;
    song = getSong(name);
    if (!song) return;
    bgmName = name;
    bgmStep = 0;
    bgmNext = ac.currentTime + 0.08;
    bgmTimer = setInterval(schedule, 30);
  }
  function stopBgmInner() {
    if (bgmTimer) clearInterval(bgmTimer);
    bgmTimer = null;
    bgmName = null;
    song = null;
  }

  return {
    ensure,
    play(name) {
      if (soundMode === "off") return;
      if (!ensure()) return;
      const f = SE[name];
      if (!f) return;
      try {
        f(ac.currentTime + 0.01);
      } catch (e) {}
    },
    playBgm(name) {
      wantBgm = name;
      if (soundMode === "all" && ac) startBgm(name);
      else if (soundMode !== "all") stopBgmInner();
    },
    stopBgm() {
      wantBgm = null;
      stopBgmInner();
    },
    refresh() {
      if (soundMode === "all" && wantBgm) startBgm(wantBgm);
      else stopBgmInner();
    }
  };
})();

// ============================================================
// 04  キャラクター・モンスター・ステージ の いちらん
// ============================================================

// ---- がぞう（むん先生の オリジナル キャラクター）----
const IMG_BASE = "https://assets.st-note.com/img/";
const IMG_FILES = {
  hero: "1772715050-weFPDcTmlSpasC3KMInuG0Hy.png",
  slime: "1772716673-Siqp1vmwzbGXTeft39UNAlak.png",
  bat: "1772716684-n8GKJt3TveugpY0hd415Rczx.png",
  skeleton: "1772716438-8LIRbVviCus0HExf1lUKM6aQ.png",
  dragon: "1772718044-dse6U2pFv8PnioBVKMayJqZ4.png",
  unicorn: "1772717157-GtXJnFpu6siA9KL1VzdxfDOI.png"
};
const IMGS = {};
function loadImages() {
  for (const k in IMG_FILES) {
    const im = new Image();
    const rec = { img: im, ok: false, fail: false };
    im.onload = () => {
      rec.ok = im.naturalWidth > 0;
    };
    im.onerror = () => {
      rec.fail = true;
    };
    im.src = IMG_BASE + IMG_FILES[k];
    IMGS[k] = rec;
  }
}

// がぞうが よめない ときは 絵文字で 代わりに 出す
const SPR = {
  hero: { img: "hero", emoji: "🤺" },
  slime: { img: "slime", emoji: "🟢" },
  bat: { img: "bat", emoji: "🦇" },
  skeleton: { img: "skeleton", emoji: "💀" },
  golem: { emoji: "👿" },
  dragon: { img: "dragon", emoji: "🐉" },
  unicorn: { img: "unicorn", emoji: "🦄" }
};
const E = (e) => ({ emoji: e });

// なかま（ふっかつの じゅもんの じゅんばんと 同じ ならび）
const COMPANION_META = [
  { spr: SPR.slime, name: "スライム" },
  { spr: SPR.bat, name: "コウモリ" },
  { spr: SPR.skeleton, name: "がいこつ" },
  { spr: SPR.golem, name: "ゴーレム" },
  { spr: SPR.dragon, name: "ドラゴン" },
  { spr: SPR.unicorn, name: "ユニコーン" },
  { spr: E("🦊"), name: "キツネ" },
  { spr: E("🤖"), name: "ロボット" },
  { spr: E("👼"), name: "てんし" },
  { spr: E("🌟"), name: "ほしのこ" },
  { spr: E("🦄"), name: "にじウマ" },
  { spr: E("🦍"), name: "ゴリラ" },
  { spr: E("🐕"), name: "いぬ" },
  { spr: E("🦖"), name: "きょうりゅう" },
  { spr: E("🐯"), name: "とら" },
  { spr: E("🐮"), name: "うし" },
  { spr: E("🐘"), name: "ぞう" },
  { spr: E("🦚"), name: "クジャク" },
  { spr: E("🦎"), name: "トカゲ" },
  { spr: E("🐠"), name: "さかな" }
];
function companionMeta(str) {
  const i = allCompanionsList.indexOf(str);
  return i >= 0 ? COMPANION_META[i] : null;
}

// ---- モンスター（もとの 5ひき ＋ ちいきの モンスター）----
const MONSTERS = {
  slime: Object.assign({}, monsterData[0], { spr: SPR.slime, join: 0 }),
  bat: Object.assign({}, monsterData[1], { spr: SPR.bat, join: 1 }),
  skeleton: Object.assign({}, monsterData[2], { spr: SPR.skeleton, join: 2 }),
  golem: Object.assign({}, monsterData[3], { spr: SPR.golem, join: 3 }),
  dragon: Object.assign({}, monsterData[4], { spr: SPR.dragon, join: 4 }),
  bee: {
    name: "キラービー",
    hp: 3,
    atk: 2,
    reward: 7,
    expBonus: 3,
    drop: "shizuku",
    spr: E("🐝")
  },
  mushroom: {
    name: "おばけキノコ",
    hp: 4,
    atk: 2,
    reward: 8,
    expBonus: 4,
    drop: "shizuku",
    spr: E("🍄")
  },
  bear: {
    name: "もりの くま",
    hp: 7,
    atk: 4,
    reward: 12,
    expBonus: 7,
    drop: "hone",
    spr: E("🐻")
  },
  owl: {
    name: "よるの フクロウ",
    hp: 4,
    atk: 2,
    reward: 8,
    expBonus: 4,
    drop: "hone",
    spr: E("🦉")
  },
  spider: {
    name: "ダークスパイダー",
    hp: 5,
    atk: 3,
    reward: 10,
    expBonus: 5,
    drop: "hone",
    spr: E("🕷️")
  },
  turtle: {
    name: "いわガメ",
    hp: 7,
    atk: 3,
    reward: 12,
    expBonus: 6,
    drop: "kouseki",
    spr: E("🐢")
  },
  fire: {
    name: "ほのおの せいれい",
    hp: 6,
    atk: 4,
    reward: 12,
    expBonus: 6,
    drop: "kouseki",
    spr: E("🔥")
  },
  croc: {
    name: "マグマワニ",
    hp: 8,
    atk: 4,
    reward: 14,
    expBonus: 7,
    drop: "kouseki",
    spr: E("🐊")
  },
  snowman: {
    name: "ゆきだるマン",
    hp: 5,
    atk: 3,
    reward: 9,
    expBonus: 5,
    drop: "shizuku",
    spr: E("⛄")
  },
  penguin: {
    name: "こおりペンギン",
    hp: 4,
    atk: 2,
    reward: 8,
    expBonus: 4,
    drop: "shizuku",
    spr: E("🐧")
  },
  wolf: {
    name: "アイスウルフ",
    hp: 7,
    atk: 4,
    reward: 13,
    expBonus: 7,
    drop: "hone",
    spr: E("🐺")
  },
  scorpion: {
    name: "サソリぐんそう",
    hp: 5,
    atk: 3,
    reward: 10,
    expBonus: 5,
    drop: "hone",
    spr: E("🦂")
  },
  snake: {
    name: "サンドスネーク",
    hp: 6,
    atk: 3,
    reward: 11,
    expBonus: 6,
    drop: "kouseki",
    spr: E("🐍")
  },
  mummy: {
    name: "ミイラおとこ",
    hp: 7,
    atk: 4,
    reward: 13,
    expBonus: 7,
    drop: "hone",
    spr: E("🧟")
  },
  ghost: {
    name: "ゴースト",
    hp: 5,
    atk: 3,
    reward: 11,
    expBonus: 6,
    drop: "maseki",
    spr: E("👻")
  },
  mage: {
    name: "やみの まどうし",
    hp: 6,
    atk: 4,
    reward: 14,
    expBonus: 7,
    drop: "maseki",
    spr: E("🧙")
  },
  alien: {
    name: "うちゅうじん",
    hp: 5,
    atk: 3,
    reward: 11,
    expBonus: 6,
    drop: "kouseki",
    spr: E("👽")
  },
  ufo: {
    name: "なぞの UFO",
    hp: 6,
    atk: 3,
    reward: 13,
    expBonus: 7,
    drop: "maseki",
    spr: E("🛸")
  },
  invader: {
    name: "インベーダー",
    hp: 4,
    atk: 3,
    reward: 10,
    expBonus: 5,
    drop: "kouseki",
    spr: E("👾")
  }
};

// ---- ちいき（テーマ）----
const THEMES = {
  grass: {
    name: "みどりの そうげん",
    style: "organic",
    wall: "tree",
    liquid: "water",
    light: 8.5,
    dark: 0,
    bgm: "field",
    deco: ["flower", "flower", "tuft", "tuft", "rock"],
    frame: "#3d8b2f",
    pool: { slime: 4, bat: 2, bee: 3, mushroom: 3, skeleton: 1 }
  },
  forest: {
    name: "ようせいの もり",
    style: "organic",
    wall: "pine",
    liquid: "swamp",
    light: 7.5,
    dark: 0.35,
    bgm: "field",
    deco: ["mush", "fern", "tuft", "flower"],
    frame: "#1f5a32",
    pool: {
      slime: 2,
      bat: 2,
      mushroom: 3,
      bear: 2,
      owl: 3,
      skeleton: 1,
      golem: 1
    }
  },
  cave: {
    name: "いわの どうくつ",
    style: "rooms",
    wall: "rock",
    liquid: "water",
    light: 7,
    dark: 0.7,
    bgm: "dungeon",
    torches: true,
    deco: ["pebble", "bone", "crystal", "pebble"],
    frame: "#5a5049",
    pool: { bat: 3, skeleton: 3, spider: 3, turtle: 2, golem: 2, dragon: 1 }
  },
  lava: {
    name: "ほのおの かざん",
    style: "rooms",
    wall: "basalt",
    liquid: "lava",
    light: 7,
    dark: 0.6,
    bgm: "dungeon",
    deco: ["ember", "pebble", "skull"],
    frame: "#8e2a12",
    pool: { bat: 2, skeleton: 2, fire: 3, croc: 2, golem: 2, dragon: 2 }
  },
  ice: {
    name: "こおりの ほらあな",
    style: "rooms",
    wall: "ice",
    liquid: "icewater",
    light: 7,
    dark: 0.45,
    bgm: "dungeon",
    deco: ["snow", "crystal", "snow"],
    frame: "#6aa9d6",
    pool: { slime: 2, snowman: 3, penguin: 3, wolf: 2, golem: 1, dragon: 1 }
  },
  desert: {
    name: "さばくの いせき",
    style: "organic",
    wall: "sandstone",
    liquid: "oasis",
    light: 8.5,
    dark: 0,
    bgm: "field",
    deco: ["cactus", "skull", "pebble", "cactus"],
    frame: "#b07a3c",
    pool: { scorpion: 3, snake: 3, mummy: 2, skeleton: 2, bat: 1, golem: 1 }
  },
  castle: {
    name: "まおうの しろ",
    style: "rooms",
    wall: "brick",
    liquid: "moat",
    light: 7,
    dark: 0.68,
    bgm: "dungeon",
    torches: true,
    deco: ["bone", "pebble", "crystal"],
    frame: "#4a3b7a",
    pool: { ghost: 3, mage: 2, skeleton: 3, bat: 2, golem: 2, dragon: 2 }
  },
  star: {
    name: "ほしぞらの とう",
    style: "organic",
    wall: "crystal",
    liquid: "void",
    light: 7.5,
    dark: 0.5,
    bgm: "dungeon",
    deco: ["star", "sparkle", "star"],
    frame: "#3f51b5",
    pool: { alien: 3, ufo: 3, invader: 2, slime: 1, dragon: 2, golem: 1 }
  }
};

// ---- たんげん と ステージ（もとの ゲームと 同じ ならび・同じ 出題タイプ）----
const UNITS = [
  {
    no: 1,
    title: "九九（くく）と かけ算",
    icon: "✖️",
    color: "#f6c343",
    stages: [
      {
        id: "kuku13",
        type: "kuku_boss",
        min: 1,
        max: 3,
        label: "1〜3の段",
        theme: "grass"
      },
      {
        id: "kuku46",
        type: "kuku_boss",
        min: 4,
        max: 6,
        label: "4〜6の段",
        theme: "forest"
      },
      {
        id: "kuku79",
        type: "kuku_boss",
        min: 7,
        max: 9,
        label: "7〜9の段",
        theme: "cave"
      },
      {
        id: "kukuall",
        type: "kuku_all",
        min: 1,
        max: 9,
        label: "九九 全段",
        theme: "castle"
      },
      {
        id: "kukupz",
        type: "kuku_puzzle",
        min: 0,
        max: 0,
        label: "九九表パズル",
        theme: "desert"
      }
    ]
  },
  {
    no: 2,
    title: "たし算の 筆算（ひっさん）",
    icon: "➕",
    color: "#8bc34a",
    stages: [
      { id: "add23", type: "add23", label: "2〜3けた", theme: "lava" },
      {
        id: "add_c1",
        type: "add3x3_carry1",
        label: "3けた(一→十 くり上がり)",
        theme: "lava"
      },
      {
        id: "add_c10",
        type: "add3x3_carry10",
        label: "3けた(十→百 くり上がり)",
        theme: "lava"
      },
      {
        id: "add_c2",
        type: "add3x3_carry2",
        label: "3けた(くり上がり 2回)",
        theme: "lava"
      },
      {
        id: "add_o1000",
        type: "add3x3_over1000",
        label: "答えが 4けた",
        theme: "lava"
      },
      { id: "add_large", type: "add_large", label: "大きな数", theme: "lava" }
    ]
  },
  {
    no: 3,
    title: "ひき算の 筆算（ひっさん）",
    icon: "➖",
    color: "#ff9800",
    stages: [
      { id: "sub23", type: "sub23", label: "2〜3けた", theme: "ice" },
      {
        id: "sub_b1",
        type: "sub3x3_borrow1",
        label: "3けた(くり下がり 1回)",
        theme: "ice"
      },
      {
        id: "sub_b2",
        type: "sub3x3_borrow2",
        label: "3けた(くり下がり 2回)",
        theme: "ice"
      },
      { id: "sub34", type: "sub34", label: "3〜4けた", theme: "ice" },
      {
        id: "sub_large",
        type: "sub_large",
        label: "大きな数(4けた)",
        theme: "ice"
      }
    ]
  },
  {
    no: 4,
    title: "時こくと 時間",
    icon: "🕰️",
    color: "#7986cb",
    stages: [
      {
        id: "time_sec",
        type: "time_seconds",
        label: "時間と 秒",
        theme: "star"
      },
      {
        id: "time_calc",
        type: "time_calc",
        label: "時こく(前・後)",
        theme: "star"
      },
      {
        id: "time_min",
        type: "time_calc_minutes",
        label: "時間の計算(＋・－)",
        theme: "star"
      },
      {
        id: "time_conv",
        type: "time_conversion",
        label: "たんい(分・秒→秒)",
        theme: "star"
      },
      {
        id: "time_conv2",
        type: "time_conversion2",
        label: "たんい(秒→分・秒)",
        theme: "star"
      }
    ]
  },
  {
    no: 5,
    title: "長さと 重さ",
    icon: "⚖️",
    color: "#bc8f6f",
    stages: [
      { id: "weight", type: "weight", label: "重さ (g, kg, t)", theme: "cave" }
    ]
  },
  {
    no: 6,
    title: "わり算",
    icon: "➗",
    color: "#26a69a",
    stages: [
      {
        id: "div_rem",
        type: "div_rem",
        label: "あまりのある わり算",
        theme: "desert"
      }
    ]
  },
  {
    no: 7,
    title: "かけ算の 筆算",
    icon: "📝",
    color: "#ba68c8",
    stages: [
      { id: "h2x1", type: "hissan2x1", label: "2けた×1けた", theme: "castle" },
      { id: "h2x2", type: "hissan2x2", label: "2けた×2けた", theme: "castle" },
      { id: "h3x2", type: "hissan3x2", label: "3けた×2けた", theme: "castle" }
    ]
  },
  {
    no: 8,
    title: "小数（しょう数）と 分数（ぶん数）",
    icon: "🔢",
    color: "#4fc3f7",
    stages: [
      {
        id: "decimal",
        type: "decimal",
        label: "小数の たし・ひき",
        theme: "forest"
      },
      {
        id: "dec_md",
        type: "dec_multdiv",
        label: "小数のかけ・わり",
        theme: "forest"
      },
      { id: "fraction", type: "fraction", label: "分数の計算", theme: "lava" }
    ]
  },
  {
    no: 9,
    title: "図形（ずけい）と 太陽",
    icon: "📐",
    color: "#ffb74d",
    stages: [
      { id: "sun", type: "sun_shadow", label: "太陽と かげ", theme: "grass" },
      {
        id: "area",
        type: "area_calc",
        label: "広さ(めんせき)",
        theme: "desert"
      }
    ]
  },
  {
    no: 10,
    title: "まほうの しれん",
    icon: "🔮",
    color: "#f06292",
    stages: [
      {
        id: "missing",
        type: "missing_multdiv",
        label: "虫食い算(×・÷)",
        theme: "castle"
      },
      {
        id: "final",
        type: "mixed_hard",
        label: "さいごの しれん",
        theme: "star",
        special: true
      },
      {
        id: "mental",
        type: "large_mental",
        label: "大数の あんざん",
        theme: "castle"
      }
    ]
  }
];
const ALL_STAGES = [];
UNITS.forEach((u) =>
  u.stages.forEach((s) => {
    s.unit = u.no;
    s.min = s.min || 0;
    s.max = s.max || 0;
    ALL_STAGES.push(s);
  })
);
let currentStage = null;

// ---- ボスの いちらん（もとの ゲームの ボス名・すがた・ごほうび を そのまま つかう）----
function getOriginalBoss(stageType) {
  let bHp = 20;
  let bRwd = 50;
  let bXp = 30;
  let bIcon = "👿";
  let bName = "ボス";
  let bAtk = 3;
  if (stageType === "kuku") {
    bHp = 15;
    bIcon = "👑";
    bAtk = 2;
  } else if (stageType === "kuku_boss") {
    bHp = 40;
    bRwd = 100;
    bXp = 50;
    bAtk = 5;
  } else if (stageType === "kuku_all") {
    bHp = 60;
    bRwd = 200;
    bXp = 100;
    bIcon = "👹";
    bName = "しん・だいまおう";
    bAtk = 8;
  } else if (stageType === "kuku_puzzle") {
    bHp = 35;
    bRwd = 80;
    bXp = 40;
    bIcon = "🧩";
    bName = "パズルキューブ";
    bAtk = 5;
  } else if (stageType.startsWith("hissan")) {
    bHp = 80;
    bRwd = 400;
    bXp = 200;
    bIcon = "🐲";
    bName = "まくうの 王";
    bAtk = 12;
  } else if (stageType === "weight") {
    bHp = 30;
    bIcon = "🗿";
    bName = "ゴーレムキング";
    bAtk = 6;
  } else if (stageType === "decimal" || stageType === "dec_multdiv") {
    bHp = 50;
    bIcon = "🧚";
    bName = "せいれいの 王";
    bAtk = 8;
  } else if (stageType === "fraction") {
    bHp = 60;
    bIcon = "🧞";
    bName = "分数の 大王";
    bAtk = 10;
  } else if (stageType === "add3x3_carry1") {
    bHp = 45;
    bIcon = "🔥";
    bName = "フレイムナイト";
    bAtk = 7;
  } else if (stageType === "add3x3_carry10") {
    bHp = 50;
    bIcon = "🌋";
    bName = "マグマゴーレム";
    bAtk = 8;
  } else if (stageType === "add3x3_carry2") {
    bHp = 60;
    bIcon = "☄️";
    bName = "メテオドラゴン";
    bAtk = 9;
  } else if (stageType === "add3x3_over1000") {
    bHp = 70;
    bIcon = "🐺";
    bName = "ヘルハウンド";
    bAtk = 10;
  } else if (stageType === "add_large") {
    bHp = 80;
    bIcon = "🦖";
    bName = "ギガントドラゴン";
    bAtk = 12;
  } else if (stageType === "sub3x3_borrow1") {
    bHp = 45;
    bIcon = "🦇";
    bName = "シャドウバット";
    bAtk = 7;
  } else if (stageType === "sub3x3_borrow2") {
    bHp = 55;
    bIcon = "🧛";
    bName = "ヴァンパイアロード";
    bAtk = 9;
  } else if (stageType === "sub_large") {
    bHp = 80;
    bIcon = "🦅";
    bName = "ダークグリフォン";
    bAtk = 12;
  } else if (stageType.startsWith("add") || stageType.startsWith("sub")) {
    bHp = 50;
    bIcon = "💠";
    bName = "けいさんの 神";
    bAtk = 8;
  } else if (stageType === "div_rem") {
    bHp = 60;
    bIcon = "➗";
    bName = "ワリザン・レム";
    bAtk = 10;
  } else if (stageType === "area_calc") {
    bHp = 90;
    bIcon = "📐";
    bName = "ずけいの まじん";
    bAtk = 15;
  } else if (stageType === "time_seconds") {
    bHp = 70;
    bIcon = "⏳";
    bName = "時の ばんにん";
    bAtk = 10;
  } else if (stageType === "sun_shadow") {
    bHp = 70;
    bIcon = "🌞";
    bName = "太陽の 神";
    bAtk = 10;
  } else if (stageType === "time_calc") {
    bHp = 80;
    bIcon = "🕰️";
    bName = "クロックマスター";
    bAtk = 12;
  } else if (stageType === "time_calc_minutes") {
    bHp = 80;
    bIcon = "⏳";
    bName = "タイムイーター";
    bAtk = 12;
  } else if (stageType === "time_conversion") {
    bHp = 80;
    bIcon = "🌠";
    bName = "流れ星の ま女";
    bAtk = 12;
  } else if (stageType === "time_conversion2") {
    bHp = 85;
    bIcon = "🌀";
    bName = "ギャラクシー";
    bAtk = 12;
  } else if (stageType === "mixed_hard") {
    bHp = 200;
    bRwd = 1500;
    bXp = 800;
    bIcon = "🌌";
    bName = "そうぞうの 神";
    bAtk = 25;
  } else if (stageType === "missing_multdiv") {
    bHp = 100;
    bRwd = 500;
    bXp = 300;
    bIcon = "👁️";
    bName = "きょむの 目";
    bAtk = 20;
  } else if (stageType === "large_mental") {
    bHp = 120;
    bRwd = 600;
    bXp = 350;
    bIcon = "🧠";
    bName = "ブレインロード";
    bAtk = 22;
  }
  return { bHp, bRwd, bXp, bIcon, bName, bAtk };
}

// ---- つよさの ちょうせい ----
// どの ステージにも いつでも 行けるように、てきの つよさは「プレイヤーの レベル」に あわせる。
// （むずかしい たんげんの ボスほど HPが 多く、ごほうびも 大きい）
function scaleBoss(ob) {
  const lv = level - 1;
  return {
    hp: Math.round((10 + ob.bHp * 0.15) * (1 + lv * 0.2)),
    atk: Math.max(1, Math.round((2 + ob.bAtk * 0.25) * (1 + lv * 0.15)))
  };
}
function scaleMonster(m) {
  const lv = level - 1;
  return {
    hp: Math.max(1, Math.round(m.hp * 0.85 * (1 + lv * 0.22))),
    atk: Math.max(1, Math.round((1 + m.atk * 0.5) * (1 + lv * 0.12))),
    reward: Math.round(m.reward * (1 + lv * 0.08)),
    expBonus: Math.round(m.expBonus * (1 + lv * 0.1))
  };
}

// ============================================================
// 05  ドット絵タイル（マップの 地面・かべ・水・かざり を プログラムで 描く）
// ============================================================
const TS = 16; // ドット絵 1マス = 16×16 ドット

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function mkCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}
function px(g, x, y, c, w, h) {
  g.fillStyle = c;
  g.fillRect(x, y, w || 1, h || 1);
}
function speck(g, r, cols, n) {
  for (let i = 0; i < n; i++)
    px(g, (r() * TS) | 0, (r() * TS) | 0, cols[(r() * cols.length) | 0]);
}
function disc(g, cx, cy, rad, c) {
  for (let y = 0; y < TS; y++)
    for (let x = 0; x < TS; x++) {
      const dx = x + 0.5 - cx,
        dy = y + 0.5 - cy;
      if (dx * dx + dy * dy <= rad * rad) px(g, x, y, c);
    }
}
function tile(fn) {
  const c = mkCanvas(TS, TS);
  fn(c.getContext("2d"));
  return c;
}

// ---------- 地面 ----------
const FLOOR = {
  grass(g, r, v) {
    px(g, 0, 0, "#58a443", 16, 16);
    speck(g, r, ["#4f9a3c", "#63b04d", "#4a9136", "#6cba54"], 42);
    if (v % 3 === 0)
      for (let i = 0; i < 3; i++) {
        const x = (2 + r() * 12) | 0,
          y = (4 + r() * 10) | 0;
        px(g, x, y, "#86d566");
        px(g, x, y + 1, "#3f8a30");
        px(g, x + 1, y - 1, "#86d566");
      }
  },
  forest(g, r, v) {
    px(g, 0, 0, "#3d7a35", 16, 16);
    speck(g, r, ["#356d2e", "#46873d", "#2f6328", "#4f8f42"], 48);
    if (v % 2)
      for (let i = 0; i < 3; i++)
        px(
          g,
          (r() * 15) | 0,
          (r() * 15) | 0,
          i % 2 ? "#8d6e3a" : "#7f9a2c",
          2,
          1
        );
  },
  cave(g, r, v) {
    px(g, 0, 0, "#5e5752", 16, 16);
    speck(g, r, ["#57504b", "#67605a", "#514a45"], 44);
    if (v % 2 === 0)
      for (let i = 0; i < 2; i++) {
        const x = (1 + r() * 12) | 0,
          y = (1 + r() * 12) | 0;
        px(g, x, y, "#7a726b", 3, 1);
        px(g, x, y + 1, "#4a433e", 3, 1);
      }
  },
  lava(g, r, v) {
    px(g, 0, 0, "#463838", 16, 16);
    speck(g, r, ["#3d3030", "#514242", "#3a2d2d"], 44);
    if (v % 3 === 0) {
      let x = (2 + r() * 10) | 0,
        y = (2 + r() * 10) | 0;
      for (let i = 0; i < 6; i++) {
        px(g, x, y, i % 2 ? "#ff7a1a" : "#b3361b");
        x += r() < 0.5 ? 1 : 0;
        y += r() < 0.6 ? 1 : 0;
      }
    }
  },
  ice(g, r, v) {
    px(g, 0, 0, "#d3eaf7", 16, 16);
    speck(g, r, ["#c3e1f3", "#e6f5fd", "#b9dbef"], 38);
    if (v % 2) {
      const x = (2 + r() * 9) | 0,
        y = (2 + r() * 9) | 0;
      for (let i = 0; i < 3; i++) px(g, x + i, y + i, "#ffffff");
    }
  },
  desert(g, r, v) {
    px(g, 0, 0, "#e1bb6c", 16, 16);
    speck(g, r, ["#d6ae5f", "#ebc883", "#d2a757"], 40);
    const base = 4 + ((v * 3) % 8);
    for (let x = 0; x < 16; x++)
      px(g, x, base + Math.round(Math.sin((x + v) * 0.7)), "#cfa253");
  },
  castle(g, r, v) {
    for (let y = 0; y < 2; y++)
      for (let x = 0; x < 2; x++)
        px(g, x * 8, y * 8, (x + y) % 2 ? "#433d5a" : "#4b4563", 8, 8);
    speck(g, r, ["#3e3954", "#524b6c"], 16);
    px(g, 0, 0, "#2c283d", 16, 1);
    px(g, 0, 0, "#2c283d", 1, 16);
    px(g, 8, 0, "#36314b", 1, 16);
    px(g, 0, 8, "#36314b", 16, 1);
    px(g, 1, 1, "#5b5479", 7, 1);
    px(g, 9, 9, "#5b5479", 7, 1);
  },
  star(g, r, v) {
    px(g, 0, 0, "#1e2256", 16, 16);
    speck(g, r, ["#232864", "#1a1e4c", "#262b6b"], 30);
    px(g, 0, 0, "#2c3378", 16, 1);
    px(g, 0, 0, "#2c3378", 1, 16);
    px(g, (r() * 14 + 1) | 0, (r() * 14 + 1) | 0, "#9fb1ff");
    if (v % 3 === 0) px(g, (r() * 14 + 1) | 0, (r() * 14 + 1) | 0, "#ffffff");
    if (v % 4 === 1) {
      px(g, 7, 6, "#5d6bff", 1, 4);
      px(g, 5, 7, "#5d6bff", 5, 1);
      px(g, 7, 7, "#a9b4ff");
    }
  }
};

// ---------- かべ ----------
// tree / pine は 1マス まるごと、 それ以外は「上から見た面(top)」と「かべの 正面(face)」の 2しゅるい
const WALL = {
  tree: {
    full(g, r, v) {
      FLOOR.grass(g, r, v);
      px(g, 3, 13, "#3c7f2c", 10, 2);
      px(g, 7, 10, "#6b4423", 2, 5);
      px(g, 8, 10, "#4e3018", 1, 5);
      disc(g, 8, 7.6, 6.6, "#1d5a21");
      disc(g, 8, 6.9, 6.1, "#2e7d32");
      disc(g, 7.2, 6, 4.6, "#3d9140");
      disc(g, 6.2, 5, 2.6, "#57ad4f");
      px(g, 5, 3, "#8fd47a");
      px(g, 4, 4, "#8fd47a");
      if (v % 3 === 0) {
        px(g, 10, 8, "#e53935");
        px(g, 4, 9, "#e53935");
        px(g, 11, 5, "#e53935");
      }
    }
  },
  pine: {
    full(g, r, v) {
      FLOOR.forest(g, r, v);
      px(g, 4, 14, "#2a5524", 8, 2);
      px(g, 7, 12, "#5b3a1e", 2, 4);
      for (const [top, h, hw] of [
        [1, 5, 3],
        [4, 5, 5],
        [7, 6, 7]
      ]) {
        for (let i = 0; i < h; i++) {
          const w = Math.max(1, Math.round((hw * (i + 1)) / h));
          for (let x = 8 - w; x < 8 + w; x++)
            px(
              g,
              x,
              top + i,
              x < 7 ? "#2f7d4a" : x < 9 ? "#21663a" : "#14492a"
            );
        }
      }
      px(g, 7, 1, "#5fae6e");
      if (v % 2) {
        px(g, 5, 9, "#cfe9d4");
        px(g, 10, 6, "#cfe9d4");
      }
    }
  },
  rock: {
    top(g, r) {
      px(g, 0, 0, "#2b2522", 16, 16);
      speck(g, r, ["#342d29", "#241f1c", "#3b332e"], 34);
    },
    face(g, r, v) {
      px(g, 0, 0, "#6c6058", 16, 16);
      speck(g, r, ["#7a6d64", "#5f544d"], 30);
      px(g, 0, 0, "#8b7e74", 16, 2);
      px(g, 0, 15, "#3d3530", 16, 1);
      px(g, 0, 6, "#463d37", 16, 1);
      px(g, 0, 11, "#463d37", 16, 1);
      px(g, (v * 5) % 16, 2, "#463d37", 1, 4);
      px(g, (v * 5 + 8) % 16, 7, "#463d37", 1, 4);
      px(g, (v * 3 + 4) % 16, 12, "#463d37", 1, 3);
    }
  },
  basalt: {
    top(g, r) {
      px(g, 0, 0, "#1d1313", 16, 16);
      speck(g, r, ["#2a1b1b", "#140d0d"], 30);
    },
    face(g, r, v) {
      px(g, 0, 0, "#4d2b26", 16, 16);
      speck(g, r, ["#5a332d", "#41241f"], 30);
      px(g, 0, 0, "#6e3c33", 16, 2);
      px(g, 0, 15, "#2a1612", 16, 1);
      px(g, 0, 7, "#2e1915", 16, 1);
      px(g, (v * 5) % 16, 2, "#2e1915", 1, 5);
      px(g, (v * 5 + 7) % 16, 8, "#2e1915", 1, 7);
      if (v % 2) {
        px(g, 3 + (v % 9), 11, "#ff6a1a");
        px(g, 4 + (v % 9), 12, "#ffb04a");
      }
    }
  },
  ice: {
    top(g, r) {
      px(g, 0, 0, "#76aed6", 16, 16);
      speck(g, r, ["#88bde0", "#679fc8", "#9acbe9"], 30);
    },
    face(g, r, v) {
      px(g, 0, 0, "#a5d4f0", 16, 16);
      speck(g, r, ["#b6dcf3", "#94c6e6"], 24);
      px(g, 0, 0, "#e9f8ff", 16, 2);
      px(g, 0, 15, "#5f9fca", 16, 1);
      px(g, 0, 8, "#7ab4dd", 16, 1);
      for (let i = 0; i < 4; i++)
        px(g, 2 + i + ((v * 4) % 8), 3 + i, "#ffffff");
      px(g, (v * 7) % 16, 9, "#7ab4dd", 1, 6);
    }
  },
  sandstone: {
    top(g, r) {
      px(g, 0, 0, "#8c5b2c", 16, 16);
      speck(g, r, ["#9a6634", "#7a4f25"], 30);
    },
    face(g, r, v) {
      px(g, 0, 0, "#c98e4e", 16, 16);
      speck(g, r, ["#d39a5a", "#bb8143"], 26);
      px(g, 0, 0, "#e2aa6c", 16, 2);
      px(g, 0, 15, "#8a5a2c", 16, 1);
      px(g, 0, 6, "#9a6533", 16, 1);
      px(g, 0, 11, "#9a6533", 16, 1);
      px(g, (v * 6) % 16, 2, "#9a6533", 1, 4);
      px(g, (v * 6 + 8) % 16, 7, "#9a6533", 1, 4);
      if (v % 3 === 0) {
        px(g, 6, 8, "#7a4a22", 1, 2);
        px(g, 8, 8, "#7a4a22", 2, 1);
        px(g, 9, 9, "#7a4a22", 1, 1);
      }
    }
  },
  brick: {
    top(g, r) {
      px(g, 0, 0, "#1c1828", 16, 16);
      speck(g, r, ["#231f33", "#16131f"], 28);
    },
    face(g, r, v) {
      px(g, 0, 0, "#2a2638", 16, 16);
      for (let row = 0; row < 4; row++) {
        const off = row % 2 ? 4 : 0;
        for (let bx = -1; bx < 3; bx++) {
          const x = bx * 8 + off;
          px(
            g,
            x + 1,
            row * 4,
            (row + bx + v) % 3 ? "#5d5579" : "#544c6e",
            7,
            3
          );
          px(g, x + 1, row * 4, "#6f6790", 7, 1);
        }
      }
      px(g, 0, 15, "#1f1b2b", 16, 1);
    }
  },
  crystal: {
    top(g, r) {
      px(g, 0, 0, "#0d0e2a", 16, 16);
      speck(g, r, ["#14163a", "#0a0b21"], 26);
      px(g, (r() * 16) | 0, (r() * 16) | 0, "#5a64c8");
    },
    face(g, r, v) {
      px(g, 0, 0, "#3b2e8d", 16, 16);
      for (let i = 0; i < 16; i++) {
        px(g, i, (i + v * 3) % 16, "#7a68ee");
        px(g, (i + 5) % 16, 15 - i, "#22195a");
      }
      px(g, 0, 0, "#b0a4ff", 16, 1);
      px(g, 3 + (v % 8), 4, "#e2dcff", 2, 2);
    }
  }
};

// ---------- 水・マグマ など（4コマ アニメ） ----------
const LIQ = {
  water: ["#2f7fc4", "#4a98d8", "#bfe4fb"],
  swamp: ["#2e5a4a", "#3c725e", "#7fae8c"],
  lava: ["#d9421a", "#ff8f1c", "#ffe066"],
  icewater: ["#3b80c2", "#5c9fd8", "#e6f6ff"],
  oasis: ["#2aa3c4", "#53bfdc", "#d2f5fc"],
  moat: ["#2a2258", "#3e3482", "#9b8ff0"],
  void: ["#06061c", "#17174a", "#ffffff"]
};
function paintLiquid(g, type, f) {
  const [a, b, c] = LIQ[type];
  px(g, 0, 0, a, 16, 16);
  if (type === "lava") {
    for (let i = 0; i < 4; i++) {
      const cx = (i * 5 + f * 1.3) % 16,
        cy = (i * 7 + f) % 16;
      disc(g, cx, cy, 2.6, b);
    }
    px(g, (f * 3 + 2) % 16, (f * 5 + 4) % 16, c, 2, 1);
    px(g, (f * 5 + 9) % 16, (f * 3 + 11) % 16, c, 1, 2);
  } else if (type === "void") {
    disc(g, 5 + f, 8, 5, b);
    for (let i = 0; i < 5; i++)
      px(
        g,
        (i * 7 + f * 2) % 16,
        (i * 5 + 3) % 16,
        (i + f) % 3 ? "#8c95ff" : c
      );
  } else {
    for (const y of [3, 8, 13])
      for (let x = 0; x < 16; x++)
        if ((x + f * 2 + y) % 8 < 3) px(g, x, y + ((x >> 2) % 2), b);
    px(g, (f * 4 + 3) % 16, (f * 3 + 5) % 16, c);
    px(g, (f * 4 + 11) % 16, (f * 5 + 10) % 16, c);
  }
}

// ---------- かざり（とうめいの 上に 描く） ----------
const DECO = {
  flower(g) {
    for (const [x, y, c] of [
      [3, 4, "#ffffff"],
      [10, 9, "#ffd54f"],
      [6, 12, "#f48fb1"]
    ]) {
      px(g, x - 1, y, c);
      px(g, x + 1, y, c);
      px(g, x, y - 1, c);
      px(g, x, y + 1, c);
      px(g, x, y, "#ff9800");
    }
  },
  tuft(g) {
    for (const [x, y] of [
      [4, 10],
      [9, 6],
      [12, 12]
    ]) {
      px(g, x, y, "#86d566", 1, 3);
      px(g, x - 1, y + 1, "#5fb648", 1, 2);
      px(g, x + 1, y + 1, "#5fb648", 1, 2);
    }
  },
  rock(g) {
    px(g, 5, 9, "#9e9e9e", 5, 3);
    px(g, 6, 8, "#bdbdbd", 3, 1);
    px(g, 5, 12, "#5f5f5f", 5, 1);
  },
  mush(g) {
    px(g, 7, 9, "#f5e6c8", 2, 4);
    px(g, 4, 6, "#d32f2f", 8, 3);
    px(g, 5, 5, "#d32f2f", 6, 1);
    px(g, 5, 6, "#ffffff");
    px(g, 9, 7, "#ffffff");
    px(g, 4, 9, "#8e1c1c", 8, 1);
  },
  fern(g) {
    for (let i = 0; i < 6; i++) {
      px(g, 7, 6 + i, "#2f8f46");
      px(g, 6 - (i >> 1), 7 + i, "#3fae58");
      px(g, 9 + (i >> 1), 7 + i, "#3fae58");
    }
  },
  pebble(g) {
    px(g, 4, 10, "#8a817a", 3, 2);
    px(g, 10, 5, "#7c746d", 2, 2);
    px(g, 4, 10, "#a39a92");
  },
  bone(g) {
    px(g, 4, 9, "#efe6d2", 8, 2);
    px(g, 3, 8, "#efe6d2", 2, 2);
    px(g, 3, 10, "#efe6d2", 2, 2);
    px(g, 11, 8, "#efe6d2", 2, 2);
    px(g, 11, 10, "#efe6d2", 2, 2);
    px(g, 4, 11, "#b8ad97", 8, 1);
  },
  crystal(g) {
    px(g, 7, 5, "#7ee7ff", 2, 7);
    px(g, 5, 8, "#48c4ea", 2, 4);
    px(g, 9, 7, "#48c4ea", 2, 5);
    px(g, 7, 5, "#e2fbff", 1, 3);
    px(g, 4, 12, "#1d6f8c", 8, 1);
  },
  ember(g) {
    px(g, 3, 8, "#a3301a", 4, 1);
    px(g, 6, 9, "#ff7a1a", 4, 1);
    px(g, 9, 10, "#a3301a", 3, 1);
    px(g, 7, 9, "#ffd166");
  },
  skull(g) {
    px(g, 5, 6, "#efe6d2", 6, 5);
    px(g, 6, 11, "#efe6d2", 4, 2);
    px(g, 6, 8, "#2b2b2b", 1, 2);
    px(g, 9, 8, "#2b2b2b", 1, 2);
    px(g, 7, 12, "#2b2b2b");
  },
  snow(g) {
    px(g, 3, 10, "#ffffff", 9, 3);
    px(g, 5, 9, "#ffffff", 5, 1);
    px(g, 3, 13, "#b9dbef", 9, 1);
  },
  cactus(g) {
    px(g, 7, 4, "#3f9a3a", 3, 10);
    px(g, 4, 7, "#3f9a3a", 2, 4);
    px(g, 4, 10, "#3f9a3a", 3, 1);
    px(g, 11, 6, "#3f9a3a", 2, 4);
    px(g, 10, 9, "#3f9a3a", 2, 1);
    px(g, 7, 4, "#6cc35f", 1, 10);
    px(g, 6, 14, "#b98b48", 5, 1);
  },
  star(g) {
    px(g, 7, 4, "#ffe082", 1, 7);
    px(g, 4, 7, "#ffe082", 7, 1);
    px(g, 6, 6, "#fff8e1", 3, 3);
  },
  sparkle(g) {
    px(g, 4, 4, "#b39ddb");
    px(g, 11, 6, "#ffffff");
    px(g, 8, 11, "#90caf9");
    px(g, 8, 10, "#90caf9");
    px(g, 7, 11, "#90caf9");
  }
};

// ---------- たからばこ ----------
function paintChest(g, open) {
  px(g, 2, 7, "#3e2410", 12, 8);
  px(g, 3, 8, "#9a6232", 10, 6);
  px(g, 3, 8, "#b87a40", 10, 1);
  px(g, 3, 10, "#ffd54f", 10, 1);
  px(g, 7, 9, "#ffd54f", 2, 4);
  px(g, 7, 11, "#3e2410", 2, 1);
  if (!open) {
    px(g, 2, 3, "#3e2410", 12, 5);
    px(g, 3, 4, "#8a5428", 10, 3);
    px(g, 3, 4, "#c48a4c", 10, 1);
    px(g, 7, 3, "#ffd54f", 2, 5);
  } else {
    px(g, 2, 1, "#3e2410", 12, 4);
    px(g, 3, 2, "#6e421d", 10, 2);
    px(g, 3, 6, "#1d1208", 10, 2);
  }
}

// ---------- テーマごとの タイル一式 を つくる ----------
const tilesetCache = {};
function buildTileset(themeKey) {
  if (tilesetCache[themeKey]) return tilesetCache[themeKey];
  const th = THEMES[themeKey];
  const r = mulberry32(themeKey.length * 977 + 13);
  const ts = { floor: [], top: [], face: [], full: [], liq: [], deco: {} };
  for (let v = 0; v < 6; v++)
    ts.floor.push(tile((g) => FLOOR[themeKey](g, r, v)));
  const w = WALL[th.wall];
  for (let v = 0; v < 4; v++) {
    if (w.full) ts.full.push(tile((g) => w.full(g, r, v)));
    else {
      ts.top.push(tile((g) => w.top(g, r, v)));
      ts.face.push(tile((g) => w.face(g, r, v)));
    }
  }
  for (let f = 0; f < 4; f++)
    ts.liq.push(tile((g) => paintLiquid(g, th.liquid, f)));
  for (const k of new Set(th.deco)) ts.deco[k] = tile((g) => DECO[k](g));
  ts.chest = tile((g) => paintChest(g, false));
  ts.chestOpen = tile((g) => paintChest(g, true));
  tilesetCache[themeKey] = ts;
  return ts;
}

// ============================================================
// 06  ダンジョン（マップ）を つくる
//   ・へやと ろうか / しぜんの ちけい の 2しゅるい
//   ・かならず ボスまで たどりつける ように つながりを チェック
// ============================================================
const MAP_W = 37,
  MAP_H = 29;
let mapGrid = [],
  explored = [],
  visibleGrid = [],
  tileVar = [],
  decoGrid = [],
  distGrid = [];
let torchList = [];
let mapTheme = "grass",
  TH = THEMES.grass,
  TSET = null;
let mapCanvas = null,
  fogCanvas = null,
  fogCtx = null,
  fogImg = null;
let playerX = 10,
  playerY = 10;
let bossX = 0,
  bossY = 0;
let currentBoss = null;
let chests = [],
  springs = [],
  fieldItems = [],
  trapsOnMap = [],
  enemiesOnMap = [];

function makeGrid(v) {
  return Array.from({ length: MAP_H }, () => new Array(MAP_W).fill(v));
}
function inMap(x, y) {
  return x >= 0 && y >= 0 && x < MAP_W && y < MAP_H;
}
function isWalkable(x, y) {
  return inMap(x, y) && mapGrid[y][x] === 0;
}
function shuffleR(arr, R) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---- へやと ろうか ----
function genRooms(R) {
  const g = makeGrid(1);
  const rooms = [];
  for (let tries = 0; tries < 400 && rooms.length < 12; tries++) {
    const w = 4 + ((R() * 5) | 0),
      h = 4 + ((R() * 4) | 0);
    const x = 1 + ((R() * (MAP_W - w - 2)) | 0),
      y = 1 + ((R() * (MAP_H - h - 2)) | 0);
    if (
      rooms.some(
        (r) =>
          x < r.x + r.w + 1 &&
          x + w + 1 > r.x &&
          y < r.y + r.h + 1 &&
          y + h + 1 > r.y
      )
    )
      continue;
    rooms.push({ x, y, w, h, cx: x + (w >> 1), cy: y + (h >> 1) });
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++) g[yy][xx] = 0;
  }
  const carve = (a, b) => {
    let x = a.cx,
      y = a.cy;
    const hFirst = R() < 0.5;
    const goX = () => {
      while (x !== b.cx) {
        g[y][x] = 0;
        x += Math.sign(b.cx - x);
      }
    };
    const goY = () => {
      while (y !== b.cy) {
        g[y][x] = 0;
        y += Math.sign(b.cy - y);
      }
    };
    if (hFirst) {
      goX();
      goY();
    } else {
      goY();
      goX();
    }
    g[b.cy][b.cx] = 0;
  };
  const linked = [rooms[0]],
    rest = rooms.slice(1);
  while (rest.length) {
    let best = null,
      bi = -1,
      bd = 1e9;
    for (const a of linked)
      rest.forEach((b, i) => {
        const d = Math.abs(a.cx - b.cx) + Math.abs(a.cy - b.cy);
        if (d < bd) {
          bd = d;
          best = [a, b];
          bi = i;
        }
      });
    carve(best[0], best[1]);
    linked.push(rest.splice(bi, 1)[0]);
  }
  for (let i = 0; i < 3 && rooms.length > 2; i++) {
    const a = rooms[(R() * rooms.length) | 0],
      b = rooms[(R() * rooms.length) | 0];
    if (a !== b) carve(a, b);
  }
  return { g, rooms };
}

// ---- しぜんの ちけい（森・草原・さばく・星空）----
function genOrganic(R) {
  let g = makeGrid(1);
  for (let y = 1; y < MAP_H - 1; y++)
    for (let x = 1; x < MAP_W - 1; x++) g[y][x] = R() < 0.46 ? 1 : 0;
  for (let it = 0; it < 5; it++) {
    const n = makeGrid(1);
    for (let y = 1; y < MAP_H - 1; y++)
      for (let x = 1; x < MAP_W - 1; x++) {
        let c = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) c += g[y + dy][x + dx] === 1 ? 1 : 0;
        n[y][x] = c >= 5 ? 1 : 0;
      }
    g = n;
  }
  return g;
}

function bfs(sx, sy) {
  const d = makeGrid(-1);
  const q = [[sx, sy]];
  d[sy][sx] = 0;
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i];
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ]) {
      const nx = x + dx,
        ny = y + dy;
      if (inMap(nx, ny) && mapGrid[ny][nx] === 0 && d[ny][nx] < 0) {
        d[ny][nx] = d[y][x] + 1;
        q.push([nx, ny]);
      }
    }
  }
  return d;
}

function nearestFloor(cx, cy) {
  let best = null,
    bd = 1e9;
  for (let y = 1; y < MAP_H - 1; y++)
    for (let x = 1; x < MAP_W - 1; x++)
      if (mapGrid[y][x] === 0) {
        const d = Math.abs(x - cx) + Math.abs(y - cy);
        if (d < bd) {
          bd = d;
          best = { x, y };
        }
      }
  return best || { x: cx, y: cy };
}

function generateDungeon(stage) {
  mapTheme = stage.theme;
  TH = THEMES[mapTheme];
  TSET = buildTileset(mapTheme);
  const R = mulberry32((Date.now() ^ (Math.random() * 1e9)) >>> 0);
  let start = { x: 18, y: 14 };
  for (let attempt = 0; attempt < 25; attempt++) {
    if (TH.style === "rooms") {
      const res = genRooms(R);
      mapGrid = res.g;
      start = { x: res.rooms[0].cx, y: res.rooms[0].cy };
    } else {
      mapGrid = genOrganic(R);
      start = nearestFloor(MAP_W >> 1, MAP_H >> 1);
      mapGrid[start.y][start.x] = 0;
    }
    distGrid = bfs(start.x, start.y);
    let reach = 0;
    for (let y = 0; y < MAP_H; y++)
      for (let x = 0; x < MAP_W; x++) {
        if (mapGrid[y][x] === 0 && distGrid[y][x] < 0) mapGrid[y][x] = 1;
        // とどかない 地面は かべに する
        else if (mapGrid[y][x] === 0) reach++;
      }
    if (reach > MAP_W * MAP_H * 0.28) break;
  }
  playerX = start.x;
  playerY = start.y;

  // ボスは スタートから いちばん とおい ところ
  let far = start,
    fd = -1;
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++)
      if (distGrid[y][x] > fd) {
        fd = distGrid[y][x];
        far = { x, y };
      }
  bossX = far.x;
  bossY = far.y;
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const x = bossX + dx,
        y = bossY + dy;
      if (x > 0 && y > 0 && x < MAP_W - 1 && y < MAP_H - 1) mapGrid[y][x] = 0;
    }
  distGrid = bfs(start.x, start.y);

  // 水・マグマ など
  const seeds = [];
  for (let y = 2; y < MAP_H - 2; y++)
    for (let x = 2; x < MAP_W - 2; x++) {
      if (mapGrid[y][x] !== 1) continue;
      const nearFloor = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ].some(
        ([dx, dy]) =>
          mapGrid[y + dy][x + dx] === 0 && distGrid[y + dy][x + dx] > 3
      );
      if (nearFloor && Math.abs(x - bossX) + Math.abs(y - bossY) > 3)
        seeds.push([x, y]);
    }
  shuffleR(seeds, R);
  const nLiquid = 5 + ((R() * 4) | 0);
  for (let i = 0; i < Math.min(nLiquid, seeds.length); i++) {
    const q = [seeds[i]];
    const size = 3 + ((R() * 8) | 0);
    for (let k = 0; k < q.length && k < size; k++) {
      const [x, y] = q[k];
      if (mapGrid[y][x] !== 1) continue;
      mapGrid[y][x] = 2;
      for (const [dx, dy] of shuffleR(
        [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1]
        ],
        R
      )) {
        const nx = x + dx,
          ny = y + dy;
        if (
          nx > 1 &&
          ny > 1 &&
          nx < MAP_W - 2 &&
          ny < MAP_H - 2 &&
          mapGrid[ny][nx] === 1
        )
          q.push([nx, ny]);
      }
    }
  }

  // おく ばしょ
  let spots = [];
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) {
      if (
        mapGrid[y][x] === 0 &&
        distGrid[y][x] >= 4 &&
        (Math.abs(x - bossX) > 2 || Math.abs(y - bossY) > 2)
      )
        spots.push({ x, y });
    }
  shuffleR(spots, R);
  const used = new Set();
  const getSpot = (minDist) => {
    for (let i = spots.length - 1; i >= 0; i--) {
      const s = spots[i];
      if (distGrid[s.y][s.x] >= (minDist || 0)) {
        spots.splice(i, 1);
        used.add(s.x + "," + s.y);
        return s;
      }
    }
    const s = spots.pop() || { x: start.x, y: start.y };
    used.add(s.x + "," + s.y);
    return s;
  };

  chests = [];
  springs = [];
  fieldItems = [];
  trapsOnMap = [];
  enemiesOnMap = [];
  const chestCount = 3 + ((R() * 3) | 0);
  for (let i = 0; i < chestCount; i++) {
    const s = getSpot(6);
    chests.push({ x: s.x, y: s.y, opened: false });
  }
  const springCount = 1 + (R() < 0.5 ? 1 : 0);
  for (let i = 0; i < springCount; i++) {
    const s = getSpot(8);
    springs.push({ x: s.x, y: s.y, used: false });
  }
  for (let i = 0; i < 4; i++) {
    const s = getSpot(5);
    trapsOnMap.push({ x: s.x, y: s.y, done: false });
  }

  // そざい（もとの ゲームと 同じ 出かた）
  const itemCount = 5 + ((R() * 4) | 0);
  for (let i = 0; i < itemCount; i++) {
    let s = getSpot(3);
    let rv = Math.random();
    let pDrop;
    if (mapTheme === "star") {
      if (rv < 0.5) pDrop = { type: "hoshisuna", icon: "⏳", name: "⏳" };
      else pDrop = { type: "tsukiishi", icon: "🌙", name: "🌙" };
    } else {
      if (rv < 0.3) pDrop = { type: "shizuku", icon: "💧", name: "💧" };
      else if (rv < 0.6) pDrop = { type: "hone", icon: "🦴", name: "🦴" };
      else if (rv < 0.85) pDrop = { type: "kouseki", icon: "🔸", name: "🔸" };
      else pDrop = { type: "maseki", icon: "🔮", name: "🔮" };
    }
    fieldItems.push({
      x: s.x,
      y: s.y,
      type: pDrop.type,
      icon: pDrop.icon,
      name: pDrop.name,
      ph: R() * 6
    });
  }

  const enemyCount = 9 + ((R() * 3) | 0);
  for (let i = 0; i < enemyCount; i++) {
    const s = getSpot(7);
    enemiesOnMap.push(createMapEnemy(s.x, s.y, R));
  }

  // かざり・たいまつ・タイルの もよう
  tileVar = makeGrid(0);
  decoGrid = makeGrid(null);
  torchList = [];
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) {
      tileVar[y][x] = (R() * 6) | 0;
      if (
        mapGrid[y][x] === 0 &&
        !used.has(x + "," + y) &&
        !(x === start.x && y === start.y) &&
        R() < 0.09
      )
        decoGrid[y][x] = TH.deco[(R() * TH.deco.length) | 0];
      if (
        TH.torches &&
        mapGrid[y][x] === 1 &&
        y + 1 < MAP_H &&
        mapGrid[y + 1][x] === 0 &&
        R() < 0.16 &&
        !torchList.some((t) => t.y === y && Math.abs(t.x - x) < 3)
      )
        torchList.push({ x, y, ph: R() * 6 });
    }

  explored = makeGrid(false);
  visibleGrid = makeGrid(false);
  fogCanvas = mkCanvas(MAP_W, MAP_H);
  fogCtx = fogCanvas.getContext("2d");
  fogImg = fogCtx.createImageData(MAP_W, MAP_H);
  bakeMap();
}

function pickMonsterKey(R) {
  const pool = TH.pool;
  let total = 0;
  for (const k in pool) total += pool[k];
  let v = (R ? R() : Math.random()) * total;
  for (const k in pool) {
    v -= pool[k];
    if (v <= 0) return k;
  }
  return "slime";
}
function createMapEnemy(x, y, R) {
  const key = pickMonsterKey(R);
  const m = MONSTERS[key];
  const sc = scaleMonster(m);
  return {
    x,
    y,
    key,
    name: m.name,
    spr: m.spr,
    drop: m.drop,
    join: m.join,
    reward: sc.reward,
    expBonus: sc.expBonus,
    hp: sc.hp,
    atk: sc.atk,
    anim: null,
    flip: false,
    alert: false,
    alertT: 0,
    ph: Math.random() * 6
  };
}

// マップの 地面・かべを 1まいの 絵に まとめて おく（毎フレーム かるく 描ける）
function bakeMap() {
  mapCanvas = mkCanvas(MAP_W * TS, MAP_H * TS);
  const g = mapCanvas.getContext("2d");
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) {
      const t = mapGrid[y][x],
        v = tileVar[y][x],
        X = x * TS,
        Y = y * TS;
      if (t === 0) {
        g.drawImage(TSET.floor[v % TSET.floor.length], X, Y);
        if (decoGrid[y][x]) g.drawImage(TSET.deco[decoGrid[y][x]], X, Y);
      } else if (t === 2) {
        g.drawImage(TSET.liq[0], X, Y);
      } else if (TSET.full.length) {
        g.drawImage(TSET.full[v % TSET.full.length], X, Y);
      } else {
        const below = y + 1 < MAP_H ? mapGrid[y + 1][x] : 1;
        g.drawImage(
          below !== 1
            ? TSET.face[v % TSET.face.length]
            : TSET.top[v % TSET.top.length],
          X,
          Y
        );
        if (below === 1) {
          g.fillStyle = "rgba(0,0,0,0.45)";
          if (x > 0 && mapGrid[y][x - 1] !== 1) g.fillRect(X, Y, 1, TS);
          if (x < MAP_W - 1 && mapGrid[y][x + 1] !== 1)
            g.fillRect(X + TS - 1, Y, 1, TS);
          if (y > 0 && mapGrid[y - 1][x] !== 1) g.fillRect(X, Y, TS, 1);
        }
      }
      // かべの 足もとに かげ
      if (t === 0 && y > 0 && mapGrid[y - 1][x] === 1 && !TSET.full.length) {
        g.fillStyle = "rgba(0,0,0,0.28)";
        g.fillRect(X, Y, TS, 3);
      }
    }
}

// 見えている はんい の 計算
function updateVisibility() {
  const r = TH.light,
    r2 = r * r;
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) {
      const dx = x - playerX,
        dy = y - playerY;
      const v = dx * dx + dy * dy <= r2;
      visibleGrid[y][x] = v;
      if (v) explored[y][x] = true;
    }
  const d = fogImg.data;
  const dim = TH.dark > 0.5 ? 165 : 120;
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) {
      const i = (y * MAP_W + x) * 4;
      d[i] = 2;
      d[i + 1] = 2;
      d[i + 2] = 12;
      d[i + 3] = !explored[y][x] ? 255 : visibleGrid[y][x] ? 0 : dim;
    }
  fogCtx.putImageData(fogImg, 0, 0);
  miniDirty = true;
}

// ============================================================
// 07  たんけん（いどう・イベント・てきの うごき）
// ============================================================
const MOVE_MS = 135;
let pAnim = { fx: 0, fy: 0, tx: 0, ty: 0, t0: 0 };
let facing = 1;
let stepLock = false;
let autoPath = [];
let heldDir = null;
let graceSteps = 0;
let stepCount = 0;
let trail = [];
let followers = [];
let bumpAnim = { dx: 0, dy: 0, t0: -1e9 };
let run = null; // この ダンジョンでの せいせき

function startDungeon(stage) {
  battle = null;
  currentStage = stage;
  const type = stage.type;
  stageType = type;
  stageMin = stage.min;
  stageMax = stage.max;
  // ↓ もとの ゲームと 同じ きまり
  isHardMode =
    type === "kuku_boss" ||
    type === "kuku_all" ||
    type.startsWith("hissan") ||
    type.startsWith("add") ||
    type.startsWith("sub") ||
    type === "mixed_hard" ||
    type === "missing_multdiv" ||
    type === "large_mental";
  isTrapEncounter = false;
  isBossBattle = false;
  isMimic = false;
  currentCombo = 0;
  if (currentPlayerHp <= 0) currentPlayerHp = playerMaxHp;
  run = {
    correct: 0,
    total: 0,
    monsters: 0,
    gold: 0,
    exp: 0,
    items: 0,
    mistakes: [],
    start: Date.now()
  };

  generateDungeon(stage);
  const ob = getOriginalBoss(stageType);
  const sc = scaleBoss(ob);
  let spr = E(ob.bIcon),
    name = ob.bName;
  if (stage.id === "kuku13") {
    spr = Object.assign({}, SPR.slime, { crown: true });
    name = "キングスライム";
  } else if (stage.id === "kuku46") {
    spr = Object.assign({}, SPR.skeleton, { crown: true });
    name = "がいこつ しょうぐん";
  } else if (stage.id === "kuku79") {
    spr = Object.assign({}, SPR.dragon, { crown: true });
    name = "やみの ドラゴン";
  }
  currentBoss = {
    name,
    icon: ob.bIcon,
    spr,
    hp: sc.hp,
    atk: sc.atk,
    reward: ob.bRwd,
    expBonus: ob.bXp
  };

  pAnim = { fx: playerX, fy: playerY, tx: playerX, ty: playerY, t0: 0 };
  trail = [];
  autoPath = [];
  heldDir = null;
  stepLock = false;
  graceSteps = 5;
  stepCount = 0;
  followers = companions
    .slice(-3)
    .reverse()
    .map((c) => ({
      spr: companionMeta(c).spr,
      x: playerX,
      y: playerY,
      fx: playerX,
      fy: playerY,
      t0: 0
    }));
  updateVisibility();
  updateStatus();
  showScreen("explore");
  document.getElementById(
    "dungeon-info"
  ).innerHTML = `<b>【${stage.unit}】${stage.label}</b><span>${TH.name}</span>`;
  showAreaTitle(`【${stage.unit}】 ${stage.label}`, TH.name);
  mapMsg(
    "マップの どこかに いる ボスを さがせ！ 👑の 矢じるしが ボスの ほうがく だよ"
  );
  Sound.playBgm(TH.bgm);
}

function goToExplore() {
  stopTimer();
  showScreen("explore");
  Sound.playBgm(TH.bgm);
}
function returnToMap() {
  stopTimer();
  battle = null;
  currentCombo = 0;
  document.getElementById("combo-display").classList.remove("show");
  graceSteps = 4;
  goToExplore();
}

// ボタン・キーボード から よばれる（もとの 名前の まま）
function movePlayer(dx, dy) {
  autoPath = [];
  tryStep(dx, dy);
}

function tryStep(dx, dy) {
  if (screenName !== "explore" || stepLock || battle || isModalOpen())
    return false;
  if (dx) facing = dx > 0 ? 1 : -1;
  const nx = playerX + dx,
    ny = playerY + dy;
  if (!isWalkable(nx, ny)) {
    bumpAnim = { dx, dy, t0: performance.now() };
    Sound.play("bump");
    autoPath = [];
    return false;
  }
  const now = performance.now();
  trail.unshift({ x: playerX, y: playerY });
  if (trail.length > 6) trail.pop();
  followers.forEach((f, i) => {
    const t = trail[i];
    if (t) {
      f.fx = f.x;
      f.fy = f.y;
      f.x = t.x;
      f.y = t.y;
      f.t0 = now;
    }
  });
  pAnim = { fx: playerX, fy: playerY, tx: nx, ty: ny, t0: now };
  playerX = nx;
  playerY = ny;
  stepCount++;
  updateVisibility();
  if (stepCount % 2 === 0) Sound.play("step");
  stepLock = true;
  setTimeout(afterStep, MOVE_MS);
  return true;
}

function afterStep() {
  stepLock = false;
  if (screenName !== "explore" || battle) return;

  // ↓ ここからは もとの movePlayer と 同じ じゅんばんで しらべる
  if (playerX === bossX && playerY === bossY) {
    encounterBoss();
    return;
  }

  const chest = chests.find(
    (c) => !c.opened && c.x === playerX && c.y === playerY
  );
  if (chest) {
    chest.opened = true;
    if (Math.random() < 0.2) {
      encounterMimic();
      return;
    }
    const bonusGold = Math.floor(Math.random() * 50) + 20;
    gold += bonusGold;
    run.gold += bonusGold;
    mapMsg(`🎁 宝箱！ ${bonusGold}円 ゲット！`);
    Sound.play("chest");
    popOnMap(playerX, playerY, `+${bonusGold}円`, "#ffd84a");
    updateStatus();
  }

  const spring = springs.find(
    (s) => !s.used && s.x === playerX && s.y === playerY
  );
  if (spring) {
    currentPlayerHp += Math.floor(playerMaxHp / 2);
    if (currentPlayerHp > playerMaxHp) currentPlayerHp = playerMaxHp;
    spring.used = true;
    mapMsg(`⛲ いずみ！ HPが 大きく かいふく した！`);
    Sound.play("heal");
    flash("heal");
    popOnMap(playerX, playerY, "HP かいふく！", "#7dffa0");
    updateStatus();
  }

  const fIdx = fieldItems.findIndex((f) => f.x === playerX && f.y === playerY);
  if (fIdx !== -1) {
    const item = fieldItems[fIdx];
    materials[item.type]++;
    run.items++;
    mapMsg(`🖐️ 【${matNames[item.type]}】を ひろった！`);
    Sound.play("item");
    popOnMap(playerX, playerY, `${matNames[item.type]} +1`, "#bfe4ff");
    fieldItems.splice(fIdx, 1);
    updateStatus();
  }

  const trap = trapsOnMap.find(
    (t) => !t.done && t.x === playerX && t.y === playerY
  );
  if (trap) {
    trap.done = true;
    encounterTrap();
    return;
  }

  let hit = enemiesOnMap.findIndex((e) => e.x === playerX && e.y === playerY);
  if (hit !== -1) {
    encounterVisibleMonster(hit, false);
    return;
  }

  if (graceSteps > 0) graceSteps--;
  else if (Math.random() < 0.03) {
    encounterRandomMonster();
    return;
  }

  moveEnemies();

  hit = enemiesOnMap.findIndex((e) => e.x === playerX && e.y === playerY);
  if (hit !== -1) {
    stepLock = true;
    autoPath = [];
    setTimeout(() => {
      stepLock = false;
      if (screenName === "explore" && !battle && enemiesOnMap[hit])
        encounterVisibleMonster(hit, true);
    }, MOVE_MS);
    return;
  }
  continueWalking();
}

function continueWalking() {
  if (autoPath.length) {
    const s = autoPath.shift();
    tryStep(s[0], s[1]);
    return;
  }
  if (heldDir) tryStep(heldDir[0], heldDir[1]);
}

function canEnemyMove(x, y, self) {
  return (
    isWalkable(x, y) &&
    !(x === bossX && y === bossY) &&
    !enemiesOnMap.some((o) => o !== self && o.x === x && o.y === y) &&
    !chests.some((c) => !c.opened && c.x === x && c.y === y) &&
    !springs.some((s) => s.x === x && s.y === y)
  );
}

function moveEnemies() {
  const now = performance.now();
  for (const e of enemiesOnMap) {
    const dX = playerX - e.x,
      dY = playerY - e.y;
    const opts = [];
    if (Math.abs(dX) <= 4 && Math.abs(dY) <= 4) {
      if (!e.alert) {
        e.alert = true;
        e.alertT = now;
      }
      const ax = [Math.sign(dX), 0],
        ay = [0, Math.sign(dY)];
      if (Math.abs(dX) > Math.abs(dY)) {
        opts.push(ax);
        if (dY) opts.push(ay);
      } else if (Math.abs(dY) > Math.abs(dX)) {
        opts.push(ay);
        if (dX) opts.push(ax);
      } else if (Math.random() < 0.5) {
        opts.push(ax, ay);
      } else {
        opts.push(ay, ax);
      }
    } else {
      e.alert = false;
      if (Math.random() < 0.35)
        opts.push(
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
          ][(Math.random() * 4) | 0]
        );
    }
    for (const [mx, my] of opts) {
      if (!mx && !my) continue;
      const nx = e.x + mx,
        ny = e.y + my;
      if (canEnemyMove(nx, ny, e)) {
        if (mx) e.flip = mx < 0;
        e.anim = { fx: e.x, fy: e.y, t0: now };
        e.x = nx;
        e.y = ny;
        break;
      }
    }
  }
}

// マップを タップした ところまで あるく
function findPath(tx, ty) {
  if (!isWalkable(tx, ty) || !explored[ty][tx]) return null;
  const prev = makeGrid(null);
  const q = [[playerX, playerY]];
  prev[playerY][playerX] = [-1, -1];
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i];
    if (x === tx && y === ty) break;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ]) {
      const nx = x + dx,
        ny = y + dy;
      if (isWalkable(nx, ny) && explored[ny][nx] && !prev[ny][nx]) {
        prev[ny][nx] = [x, y];
        q.push([nx, ny]);
      }
    }
  }
  if (!prev[ty][tx]) return null;
  const path = [];
  let cx = tx,
    cy = ty;
  while (!(cx === playerX && cy === playerY)) {
    const [px2, py2] = prev[cy][cx];
    path.unshift([cx - px2, cy - py2]);
    cx = px2;
    cy = py2;
  }
  return path.slice(0, 40);
}

function onMapTap(ev) {
  if (screenName !== "explore" || battle || isModalOpen()) return;
  const rect = mapCv.getBoundingClientRect();
  const sx = ev.clientX - rect.left,
    sy = ev.clientY - rect.top;
  const tx = Math.floor((sx + camX) / tileSize),
    ty = Math.floor((sy + camY) / tileSize);
  if (tx === playerX && ty === playerY) return;
  const path = findPath(tx, ty);
  if (!path || !path.length) {
    mapMsg("そこへは いけないよ");
    return;
  }
  tapMarker = { x: tx, y: ty, t0: performance.now() };
  autoPath = path;
  if (!stepLock) {
    const s = autoPath.shift();
    tryStep(s[0], s[1]);
  }
}

function escapeDungeon() {
  openModal(
    "にげる？",
    "<p>ダンジョンから にげて 町に もどりますか？<br><small>（ここまでの お金と そざいは もっていけるよ）</small></p>",
    [
      {
        label: "町に もどる",
        cls: "btn-gray",
        onClick: () => {
          closeModal();
          goToTown();
        }
      },
      { label: "たんけんを つづける", cls: "btn-gold", onClick: closeModal }
    ]
  );
}

// マップの 上の メッセージ
let mapMsgTimer = null;
function mapMsg(text) {
  const el = document.getElementById("map-message");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(mapMsgTimer);
  mapMsgTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
let areaTitleTimer = null;
function showAreaTitle(a, b) {
  const el = document.getElementById("area-title");
  el.innerHTML = `<small>${a}</small><b>${b}</b>`;
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
  clearTimeout(areaTitleTimer);
  areaTitleTimer = setTimeout(() => el.classList.remove("show"), 2400);
}
const mapPops = [];
function popOnMap(x, y, text, color) {
  mapPops.push({ x, y, text, color, t0: performance.now() });
}

// ---- そうさ（ボタン・キーボード・タップ）----
function setupExploreControls() {
  document.querySelectorAll("#controls-area [data-dir]").forEach((btn) => {
    const dir = btn.dataset.dir.split(",").map(Number);
    const down = (e) => {
      e.preventDefault();
      Sound.ensure();
      autoPath = [];
      heldDir = dir;
      btn.classList.add("pressed");
      tryStep(dir[0], dir[1]);
    };
    const up = () => {
      if (heldDir === dir) heldDir = null;
      btn.classList.remove("pressed");
    };
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointerleave", up);
    btn.addEventListener("pointercancel", up);
    btn.addEventListener("contextmenu", (e) => e.preventDefault());
  });
  const keyDirs = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    w: [0, -1],
    s: [0, 1],
    a: [-1, 0],
    d: [1, 0]
  };
  document.addEventListener("keydown", (e) => {
    if (screenName !== "explore" || isModalOpen()) return;
    const dir = keyDirs[e.key];
    if (!dir) return;
    e.preventDefault();
    if (e.repeat) return;
    autoPath = [];
    heldDir = dir;
    tryStep(dir[0], dir[1]);
  });
  document.addEventListener("keyup", (e) => {
    const dir = keyDirs[e.key];
    if (dir && heldDir && heldDir[0] === dir[0] && heldDir[1] === dir[1])
      heldDir = null;
  });
  mapCv.addEventListener("pointerdown", (e) => {
    Sound.ensure();
    onMapTap(e);
  });
}

// ============================================================
// 【もとの コードから そのまま うつした 部分】 出題ロジック generateQuestion
// ※ 出題の しかた・問題の えらび方は 1文字も 変えていません
// ============================================================
function generateQuestion() {
  stopTimer();
  document.getElementById("h-answer").value = "";
  document.getElementById("h-answer-rem").value = "";
  document.getElementById("v-step1").value = "";
  document.getElementById("v-step2").value = "";
  document.getElementById("v-answer").value = "";
  document.getElementById("va-answer").value = "";
  document.getElementById("rem-area").style.display = "none";

  document.querySelectorAll(".memo-input").forEach((m) => (m.value = ""));

  let actualStageType = stageType;
  if (stageType === "mixed_hard") {
    const types = [
      "hissan3x2",
      "dec_multdiv",
      "area_calc",
      "div_rem",
      "fraction"
    ];
    actualStageType = types[Math.floor(Math.random() * types.length)];
  }

  let isWordProblem = Math.random() < 0.3;
  let wpCategory = null;

  if (actualStageType.startsWith("kuku") && actualStageType !== "kuku_puzzle")
    wpCategory = "kuku";
  else if (actualStageType === "weight") wpCategory = "weight";
  else if (
    actualStageType.startsWith("add") ||
    actualStageType.startsWith("sub")
  )
    wpCategory = "add_sub";
  else if (actualStageType.startsWith("hissan")) wpCategory = "large_mult";
  else if (actualStageType.includes("dec")) wpCategory = "decimal";
  else if (actualStageType === "fraction") wpCategory = "fraction";
  else if (actualStageType === "div_rem") wpCategory = "div_rem";
  else if (actualStageType === "area_calc") wpCategory = "area_calc";
  else if (actualStageType === "time_seconds") wpCategory = "time_seconds";
  else if (actualStageType === "sun_shadow") wpCategory = "sun_shadow";
  else if (actualStageType === "missing_multdiv")
    wpCategory = "missing_multdiv";
  else if (actualStageType === "large_mental") wpCategory = "large_mental";

  if (isWordProblem && wpCategory && wordProblems[wpCategory]) {
    let wpList = wordProblems[wpCategory];
    let wp = wpList[Math.floor(Math.random() * wpList.length)];

    document.getElementById("math-horizontal").style.display = "block";
    document.getElementById("math-vertical").style.display = "none";
    document.getElementById("math-vertical-addsub").style.display = "none";

    document.getElementById("q-text").innerText = wp.q;
    document.getElementById("q-suffix").innerText = wp.suffix || "";
    currentAnswer = wp.a;

    if (wp.rem !== undefined) {
      document.getElementById("rem-area").style.display = "inline";
      document.getElementById("rem-label").innerText = "あまり ";
      document.getElementById("rem-suffix").innerText = "";
      currentRem = wp.rem;
    } else {
      document.getElementById("rem-area").style.display = "none";
    }

    startTimer();
    let input = document.getElementById("h-answer");
    setFocus(input);
    input.focus();
    setTimeout(() => input.focus(), 10);
    return;
  }

  if (
    actualStageType.startsWith("kuku") ||
    actualStageType === "kuku_puzzle" ||
    actualStageType === "weight" ||
    actualStageType.includes("dec") ||
    actualStageType === "fraction" ||
    actualStageType === "div_rem" ||
    actualStageType === "area_calc" ||
    actualStageType === "time_seconds" ||
    actualStageType === "sun_shadow" ||
    actualStageType === "time_calc" ||
    actualStageType === "time_calc_minutes" ||
    actualStageType === "time_conversion" ||
    actualStageType === "time_conversion2" ||
    actualStageType === "missing_multdiv" ||
    actualStageType === "large_mental"
  ) {
    document.getElementById("math-horizontal").style.display = "block";
    document.getElementById("math-vertical").style.display = "none";
    document.getElementById("math-vertical-addsub").style.display = "none";

    let qText = "";
    let qSuffix = "";

    if (actualStageType === "time_conversion2") {
      let p =
        timeConversion2List[
          Math.floor(Math.random() * timeConversion2List.length)
        ];
      qText = `${p.q}秒 ＝ `;
      currentAnswer = p.m;
      currentRem = p.s;
      qSuffix = " 分";
      document.getElementById("rem-area").style.display = "inline";
      document.getElementById("rem-label").innerText = "";
      document.getElementById("rem-suffix").innerText = "秒";
    } else if (actualStageType === "time_conversion") {
      let p =
        timeConversionList[
          Math.floor(Math.random() * timeConversionList.length)
        ];
      qText = p.q;
      currentAnswer = p.a;
      qSuffix = " 秒";
    } else if (actualStageType === "time_calc_minutes") {
      let p =
        timeCalcMinutesList[
          Math.floor(Math.random() * timeCalcMinutesList.length)
        ];
      qText = p.q;
      currentAnswer = p.a;
      qSuffix = " 分";
    } else if (actualStageType === "time_calc") {
      let p = timeCalcList[Math.floor(Math.random() * timeCalcList.length)];
      qText = `${p.time}より\n${p.offset}の 時こくは？\n(例: 8時5分 なら 805 )`;
      currentAnswer = p.ans;
      qSuffix = "";
    } else if (actualStageType === "kuku_puzzle") {
      let is3x3 = Math.random() < 0.4;
      let r = rand(1, is3x3 ? 7 : 8);
      let c = rand(1, is3x3 ? 7 : 8);

      function pad(v) {
        if (v === "? ") return " ? ";
        if (v === "  ") return "   ";
        return v < 10 ? " " + v + " " : v + " ";
      }

      if (is3x3) {
        let grid = [
          [r * c, r * (c + 1), r * (c + 2)],
          [(r + 1) * c, (r + 1) * (c + 1), (r + 1) * (c + 2)],
          [(r + 2) * c, (r + 2) * (c + 1), (r + 2) * (c + 2)]
        ];

        let missingR = rand(0, 2);
        let missingC = rand(0, 2);
        currentAnswer = grid[missingR][missingC];
        grid[missingR][missingC] = "? ";

        let emptyCount = 0;
        while (emptyCount < 3) {
          let er = rand(0, 2);
          let ec = rand(0, 2);
          if (grid[er][ec] !== "? " && grid[er][ec] !== "  ") {
            grid[er][ec] = "  ";
            emptyCount++;
          }
        }

        qText = "九九表の 一部だ！\n？に 入る 数は？\n\n";
        qText += ` ${pad(grid[0][0])}|${pad(grid[0][1])}|${pad(grid[0][2])}\n`;
        qText += ` ---+---+---\n`;
        qText += ` ${pad(grid[1][0])}|${pad(grid[1][1])}|${pad(grid[1][2])}\n`;
        qText += ` ---+---+---\n`;
        qText += ` ${pad(grid[2][0])}|${pad(grid[2][1])}|${pad(grid[2][2])}`;
      } else {
        let grid = [
          [r * c, r * (c + 1)],
          [(r + 1) * c, (r + 1) * (c + 1)]
        ];
        let missingR = rand(0, 1);
        let missingC = rand(0, 1);
        currentAnswer = grid[missingR][missingC];
        grid[missingR][missingC] = "? ";

        if (Math.random() < 0.5) {
          let er = rand(0, 1);
          let ec = rand(0, 1);
          if (grid[er][ec] !== "? ") grid[er][ec] = "  ";
        }

        qText = "九九表の 一部だ！\n？に 入る 数は？\n\n";
        qText += ` ${pad(grid[0][0])}|${pad(grid[0][1])}\n`;
        qText += ` ---+---\n`;
        qText += ` ${pad(grid[1][0])}|${pad(grid[1][1])}`;
      }
      qSuffix = "";
    } else if (actualStageType.startsWith("kuku")) {
      currentNum1 = rand(stageMin, stageMax);
      currentNum2 = rand(1, 9);
      qText = `${currentNum1} × ${currentNum2} ＝ `;
      currentAnswer = currentNum1 * currentNum2;
    } else if (actualStageType === "weight") {
      const rv = Math.random();
      if (rv < 0.33) {
        let kg = rand(1, 5);
        let g = rand(10, 990);
        qText = `${kg}kg ${g}g ＝ `;
        qSuffix = " g";
        currentAnswer = kg * 1000 + g;
      } else if (rv < 0.66) {
        let kg = rand(1, 5);
        qText = `${kg * 1000}g ＝ `;
        qSuffix = " kg";
        currentAnswer = kg;
      } else {
        let t = rand(1, 5);
        qText = `${t}t ＝ `;
        qSuffix = " kg";
        currentAnswer = t * 1000;
      }
    } else if (actualStageType === "decimal") {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        let a = rand(10, 99);
        let b = rand(10, 99);
        qText = `${a / 10} ＋ ${b / 10} ＝ `;
        currentAnswer = (a + b) / 10;
      } else {
        let a = rand(10, 99);
        let b = rand(1, a);
        qText = `${a / 10} － ${b / 10} ＝ `;
        currentAnswer = (a - b) / 10;
      }
    } else if (actualStageType === "dec_multdiv") {
      const isMult = Math.random() < 0.5;
      if (isMult) {
        let a = rand(11, 99);
        let b = rand(2, 9);
        qText = `${a / 10} × ${b} ＝ `;
        currentAnswer = (a * b) / 10;
      } else {
        let a = rand(11, 99);
        let b = rand(2, 9);
        let prod = a * b;
        qText = `${prod / 10} ÷ ${b} ＝ `;
        currentAnswer = a / 10;
      }
    } else if (actualStageType === "fraction") {
      const isAdd = Math.random() < 0.5;
      const den = rand(3, 9);
      if (isAdd) {
        let num1 = rand(1, den - 1);
        let num2 = rand(1, den - num1);
        qText = `${num1}/${den} ＋ ${num2}/${den} ＝ `;
        qSuffix = ` / ${den}`;
        currentAnswer = num1 + num2;
      } else {
        let num1 = rand(2, den - 1);
        let num2 = rand(1, num1 - 1);
        qText = `${num1}/${den} － ${num2}/${den} ＝ `;
        qSuffix = ` / ${den}`;
        currentAnswer = num1 - num2;
      }
    } else if (actualStageType === "div_rem") {
      document.getElementById("rem-area").style.display = "inline";
      document.getElementById("rem-label").innerText = "あまり ";
      document.getElementById("rem-suffix").innerText = "";
      let d = rand(2, 9);
      let q = rand(1, 9);
      let r = rand(1, d - 1);
      let n = d * q + r;
      qText = `${n} ÷ ${d} ＝ `;
      qSuffix = " ";
      currentAnswer = q;
      currentRem = r;
    } else if (actualStageType === "area_calc") {
      const isRect = Math.random() < 0.5;
      if (isRect) {
        let w = rand(2, 12);
        let h = rand(2, 12);
        qText = `たて ${h}cm よこ ${w}cmの\n長方形の 広さは？`;
        qSuffix = " ㎠";
        currentAnswer = w * h;
      } else {
        let b = rand(2, 10) * 2;
        let h = rand(2, 12);
        qText = `底辺 ${b}cm 高さ ${h}cmの\n三角形の 広さは？`;
        qSuffix = " ㎠";
        currentAnswer = (b * h) / 2;
      }
    } else if (actualStageType === "time_seconds") {
      let min = rand(1, 3);
      let sec = rand(10, 50);
      qText = `${min}分${sec}秒 ＝ `;
      qSuffix = " 秒";
      currentAnswer = min * 60 + sec;
    } else if (actualStageType === "sun_shadow") {
      let r = Math.random();
      if (r < 0.33) {
        qText = "太陽が 東に あるとき\nかげは どこ？\n(1:東 2:西 3:南 4:北)";
        currentAnswer = 2;
      } else if (r < 0.66) {
        qText = "太陽が 南に あるとき\nかげは どこ？\n(1:東 2:西 3:南 4:北)";
        currentAnswer = 4;
      } else {
        qText =
          "かげが 一番 短いのは\n太陽が どこの とき？\n(1:東 2:西 3:南 4:北)";
        currentAnswer = 3;
      }
      qSuffix = "";
    } else if (actualStageType === "missing_multdiv") {
      const isMult = Math.random() < 0.5;
      if (isMult) {
        let a = rand(2, 9);
        let b = rand(2, 9);
        let prod = a * b;
        if (Math.random() < 0.5) {
          qText = `？ × ${b} ＝ ${prod}\n？に 入る 数は？`;
          currentAnswer = a;
        } else {
          qText = `${a} × ？ ＝ ${prod}\n？に 入る 数は？`;
          currentAnswer = b;
        }
      } else {
        let a = rand(2, 9);
        let b = rand(2, 9);
        let prod = a * b;
        qText = `${prod} ÷ ？ ＝ ${a}\n？に 入る 数は？`;
        currentAnswer = b;
      }
      qSuffix = "";
    } else if (actualStageType === "large_mental") {
      const r = Math.random();
      if (r < 0.33) {
        let a = rand(1, 9) * 100;
        let b = rand(1, 9) * 100;
        qText = `${a} ＋ ${b} ＝ `;
        currentAnswer = a + b;
      } else if (r < 0.66) {
        let a = rand(11, 20) * 100;
        let b = rand(1, 9) * 100;
        qText = `${a} － ${b} ＝ `;
        currentAnswer = a - b;
      } else {
        let a = rand(2, 9) * 100;
        let b = rand(2, 9);
        qText = `${a} × ${b} ＝ `;
        currentAnswer = a * b;
      }
      qSuffix = "";
    }

    document.getElementById("q-text").innerText = qText;
    document.getElementById("q-suffix").innerText = qSuffix;
    startTimer();
    let input = document.getElementById("h-answer");
    setFocus(input);
    input.focus();
    setTimeout(() => input.focus(), 10);
  } else if (
    actualStageType.startsWith("add") ||
    actualStageType.startsWith("sub")
  ) {
    document.getElementById("math-horizontal").style.display = "none";
    document.getElementById("math-vertical").style.display = "none";
    document.getElementById("math-vertical-addsub").style.display = "block";

    let isAdd = actualStageType.startsWith("add");
    let is34 = actualStageType.endsWith("34");
    let n1, n2;

    if (isAdd) {
      if (actualStageType === "add3x3_carry1") {
        let p =
          add3x3Carry1List[Math.floor(Math.random() * add3x3Carry1List.length)];
        n1 = p[0];
        n2 = p[1];
      } else if (actualStageType === "add3x3_carry10") {
        let p =
          add3x3Carry10sList[
            Math.floor(Math.random() * add3x3Carry10sList.length)
          ];
        n1 = p[0];
        n2 = p[1];
      } else if (actualStageType === "add3x3_carry2") {
        let p =
          add3x3Carry2List[Math.floor(Math.random() * add3x3Carry2List.length)];
        n1 = p[0];
        n2 = p[1];
      } else if (actualStageType === "add3x3_over1000") {
        let p =
          add3x3Over1000List[
            Math.floor(Math.random() * add3x3Over1000List.length)
          ];
        n1 = p[0];
        n2 = p[1];
      } else if (actualStageType === "add_large") {
        let p = addLargeList[Math.floor(Math.random() * addLargeList.length)];
        n1 = p[0];
        n2 = p[1];
      } else if (is34) {
        n1 = rand(100, 9999);
        n2 = rand(100, 9999);
      } else {
        n1 = rand(10, 999);
        n2 = rand(10, 999);
      }
      currentAnswer = n1 + n2;
      document.getElementById("va-sign").innerText = "＋";
    } else {
      if (actualStageType === "sub3x3_borrow1") {
        let p =
          sub3x3Borrow1List[
            Math.floor(Math.random() * sub3x3Borrow1List.length)
          ];
        n1 = p[0];
        n2 = p[1];
      } else if (actualStageType === "sub3x3_borrow2") {
        let p =
          sub3x3Borrow2List[
            Math.floor(Math.random() * sub3x3Borrow2List.length)
          ];
        n1 = p[0];
        n2 = p[1];
      }
      // ★★★ 今回追加した「大きな数のひき算」ロジック ★★★
      else if (actualStageType === "sub_large") {
        let p = subLargeList[Math.floor(Math.random() * subLargeList.length)];
        n1 = p[0];
        n2 = p[1];
      }
      // ------------------------------------------
      else if (is34) {
        n1 = rand(1000, 9999);
        n2 = rand(100, n1 - 1);
      } else {
        n1 = rand(20, 999);
        n2 = rand(10, n1 - 1);
      }
      currentAnswer = n1 - n2;
      document.getElementById("va-sign").innerText = "－";
    }

    document.getElementById("va-num1").innerText = n1;
    document.getElementById("va-num2").innerText = n2;
    startTimer();
    let input = document.getElementById("va-answer");
    setFocus(input);
    input.focus();
    setTimeout(() => input.focus(), 10);
  } else {
    document.getElementById("math-horizontal").style.display = "none";
    document.getElementById("math-vertical").style.display = "block";
    document.getElementById("math-vertical-addsub").style.display = "none";

    let inputToFocus = document.getElementById("v-step1");
    if (actualStageType === "hissan2x1") {
      currentNum1 = rand(10, 99);
      currentNum2 = rand(2, 9);
      document.getElementById("v-step2-area").style.display = "none";
      document.getElementById("v-line2").style.display = "none";
      document.getElementById("v-ans-area").style.display = "none";
    } else {
      if (actualStageType === "hissan2x2") {
        let p = hissan2x2List[Math.floor(Math.random() * hissan2x2List.length)];
        currentNum1 = p[0];
        currentNum2 = p[1];
      } else if (actualStageType === "hissan3x2") {
        currentNum1 = rand(100, 999);
        currentNum2 = rand(10, 99);
      }
      document.getElementById("v-step2-area").style.display = "block";
      document.getElementById("v-line2").style.display = "block";
      document.getElementById("v-ans-area").style.display = "block";
    }
    document.getElementById("v-num1").innerText = currentNum1;
    document.getElementById("v-num2").innerText = currentNum2;
    startTimer();
    setFocus(inputToFocus);
    inputToFocus.focus();
    setTimeout(() => inputToFocus.focus(), 10);
  }
}

// ============================================================
// 08  マップの 描画（カメラ・あかり・きり・ミニマップ）
// ============================================================
let mapCv = null,
  mapCtx = null,
  lightCv = null,
  lightCtx = null;
let miniCv = null,
  miniCtx = null,
  miniBase = null,
  miniDirty = true;
let tileSize = 40,
  viewW = 360,
  viewH = 300,
  DPR = 1,
  camX = 0,
  camY = 0;
let tapMarker = null;

function initMapCanvas() {
  mapCv = document.getElementById("map-canvas");
  mapCtx = mapCv.getContext("2d");
  lightCv = mkCanvas(10, 10);
  lightCtx = lightCv.getContext("2d");
  miniCv = document.getElementById("minimap");
  miniCtx = miniCv.getContext("2d");
  miniCv.width = MAP_W * 3;
  miniCv.height = MAP_H * 3;
  miniBase = mkCanvas(MAP_W * 3, MAP_H * 3);
}

function resizeMap() {
  const wrap = document.getElementById("map-wrap");
  const W = wrap.clientWidth || 360;
  tileSize = W >= 500 ? 40 : 32;
  const reserve = 310;
  const H = Math.round(
    Math.max(250, Math.min(W * 1.05, window.innerHeight - reserve))
  );
  DPR = Math.min(3, window.devicePixelRatio || 1);
  viewW = W;
  viewH = H;
  mapCv.style.height = H + "px";
  mapCv.width = Math.round(W * DPR);
  mapCv.height = Math.round(H * DPR);
  lightCv.width = mapCv.width;
  lightCv.height = mapCv.height;
}

// 絵文字を きれいに 描くための キャッシュ
const emojiCache = new Map();
function emojiCanvas(e, px) {
  const res = Math.round(px * DPR);
  const key = e + "|" + res;
  let c = emojiCache.get(key);
  if (c) return c;
  const s = Math.ceil(res * 1.3);
  c = mkCanvas(s, s);
  const g = c.getContext("2d");
  g.font = `${res}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(e, s / 2, s / 2 + res * 0.05);
  emojiCache.set(key, c);
  return c;
}

// キャラクターを 描く（cx = まんなか, by = 足もと, size = 高さ）
function drawSprite(ctx, spr, cx, by, size, flip, alpha) {
  const im = spr.img && IMGS[spr.img];
  ctx.save();
  if (alpha != null) ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = true;
  if (im && im.ok) {
    const iw = im.img.naturalWidth,
      ih = im.img.naturalHeight,
      sc = size / Math.max(iw, ih);
    const w = iw * sc,
      h = ih * sc;
    if (flip) {
      ctx.translate(cx, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(im.img, -w / 2, by - h, w, h);
    } else ctx.drawImage(im.img, cx - w / 2, by - h, w, h);
  } else {
    const c = emojiCanvas(spr.emoji, size * 0.82);
    const s = c.width / DPR;
    if (flip) {
      ctx.translate(cx, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(c, -s / 2, by - s + s * 0.08, s, s);
    } else ctx.drawImage(c, cx - s / 2, by - s + s * 0.08, s, s);
  }
  ctx.restore();
  if (spr.crown) {
    const c = emojiCanvas("👑", size * 0.36),
      s = c.width / DPR;
    ctx.drawImage(c, cx - s / 2, by - size - s * 0.45, s, s);
  }
}

function shadow(ctx, cx, by, w) {
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath();
  ctx.ellipse(cx, by - 1, w / 2, w / 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

function lerpPos(fx, fy, tx, ty, t0, now) {
  const t = Math.min(1, Math.max(0, (now - t0) / MOVE_MS));
  return [fx + (tx - fx) * t, fy + (ty - fy) * t, t < 1];
}

function renderMap(now) {
  if (!mapCanvas) return;
  const ctx = mapCtx,
    T = tileSize;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  const [prx, pry, pMoving] = lerpPos(
    pAnim.fx,
    pAnim.fy,
    pAnim.tx,
    pAnim.ty,
    pAnim.t0,
    now
  );
  let bx = 0,
    by = 0;
  const bt = (now - bumpAnim.t0) / 160;
  if (bt < 1) {
    const k = Math.sin(bt * Math.PI) * 0.18;
    bx = bumpAnim.dx * k;
    by = bumpAnim.dy * k;
  }

  // カメラ
  const mw = MAP_W * T,
    mh = MAP_H * T;
  camX = Math.min(
    Math.max(0, (prx + 0.5) * T - viewW / 2),
    Math.max(0, mw - viewW)
  );
  camY = Math.min(
    Math.max(0, (pry + 0.5) * T - viewH / 2),
    Math.max(0, mh - viewH)
  );
  if (mw < viewW) camX = (mw - viewW) / 2;
  if (mh < viewH) camY = (mh - viewH) / 2;
  camX = Math.round(camX * DPR) / DPR;
  camY = Math.round(camY * DPR) / DPR;

  ctx.fillStyle = "#05060f";
  ctx.fillRect(0, 0, viewW, viewH);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(mapCanvas, -camX, -camY, mw, mh);

  const x0 = Math.max(0, Math.floor(camX / T)),
    x1 = Math.min(MAP_W - 1, Math.ceil((camX + viewW) / T));
  const y0 = Math.max(0, Math.floor(camY / T)),
    y1 = Math.min(MAP_H - 1, Math.ceil((camY + viewH) / T));
  const SX = (x) => x * T - camX,
    SY = (y) => y * T - camY;

  // 水・マグマの アニメ
  const fr = Math.floor(now / 280);
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      if (mapGrid[y][x] !== 2) continue;
      ctx.drawImage(TSET.liq[(fr + x * 3 + y) % 4], SX(x), SY(y), T, T);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      if (y > 0 && mapGrid[y - 1][x] !== 2)
        ctx.fillRect(SX(x), SY(y), T, T * 0.12);
      if (x > 0 && mapGrid[y][x - 1] !== 2)
        ctx.fillRect(SX(x), SY(y), T * 0.08, T);
    }

  // ボスの まほうじん
  if (explored[bossY] && explored[bossY][bossX]) {
    const cx = SX(bossX) + T / 2,
      cy = SY(bossY) + T * 0.72;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.45);
    ctx.rotate(now / 1400);
    ctx.strokeStyle = "rgba(255,70,120,0.85)";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#ff3d7f";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, T * 1.25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, T * 0.95, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const a = (i * Math.PI * 4) / 5;
      const fx = Math.cos(a) * T * 0.95,
        fy = Math.sin(a) * T * 0.95;
      i ? ctx.lineTo(fx, fy) : ctx.moveTo(fx, fy);
    }
    ctx.stroke();
    ctx.restore();
  }

  // いずみ・たからばこ・アイテム・わなの あと
  ctx.imageSmoothingEnabled = false;
  for (const s of springs) {
    if (!explored[s.y][s.x]) continue;
    const cx = SX(s.x) + T / 2,
      cy = SY(s.y) + T * 0.62;
    ctx.fillStyle = "#6f7c86";
    ctx.beginPath();
    ctx.ellipse(cx, cy, T * 0.46, T * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a9b6bf";
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, T * 0.42, T * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = s.used ? "#5e8fb0" : "#3fa9f5";
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, T * 0.32, T * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!s.used) {
      const h = T * (0.35 + 0.08 * Math.sin(now / 160));
      ctx.fillStyle = "rgba(170,225,255,0.9)";
      ctx.fillRect(cx - 2, cy - 2 - h, 4, h);
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 3; i++) {
        const a = now / 300 + i * 2.1;
        ctx.fillRect(
          cx + Math.cos(a) * T * 0.22,
          cy - 4 + Math.sin(a) * T * 0.08 - h * 0.6,
          2,
          2
        );
      }
    }
  }
  for (const c of chests) {
    if (!explored[c.y][c.x]) continue;
    ctx.drawImage(
      c.opened ? TSET.chestOpen : TSET.chest,
      SX(c.x) + T * 0.1,
      SY(c.y) + T * 0.06,
      T * 0.8,
      T * 0.8
    );
    if (!c.opened && Math.floor(now / 500 + c.x) % 4 === 0) {
      ctx.fillStyle = "#fff8c4";
      ctx.fillRect(SX(c.x) + T * 0.72, SY(c.y) + T * 0.22, 3, 3);
    }
  }
  for (const t of trapsOnMap) {
    if (!t.done || !explored[t.y][t.x]) continue;
    ctx.fillStyle = "rgba(20,10,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(
      SX(t.x) + T / 2,
      SY(t.y) + T * 0.6,
      T * 0.36,
      T * 0.18,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  for (const f of fieldItems) {
    if (!visibleGrid[f.y][f.x] && !explored[f.y][f.x]) continue;
    const bob = Math.sin(now / 300 + f.ph) * T * 0.06;
    const c = emojiCanvas(f.icon, T * 0.52),
      s = c.width / DPR;
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.ellipse(
      SX(f.x) + T / 2,
      SY(f.y) + T * 0.78,
      T * 0.22,
      T * 0.07,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.drawImage(
      c,
      SX(f.x) + T / 2 - s / 2,
      SY(f.y) + T * 0.42 - s / 2 + bob,
      s,
      s
    );
    if (Math.floor(now / 220 + f.ph * 3) % 6 === 0) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(SX(f.x) + T * 0.68, SY(f.y) + T * 0.2 + bob, 2, 2);
    }
  }
  if (tapMarker && now - tapMarker.t0 < 700) {
    const k = (now - tapMarker.t0) / 700;
    ctx.strokeStyle = `rgba(255,216,74,${1 - k})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      SX(tapMarker.x) + 3 + k * 4,
      SY(tapMarker.y) + 3 + k * 4,
      T - 6 - k * 8,
      T - 6 - k * 8
    );
  }

  // キャラクター（おくから じゅんに 描く）
  const list = [];
  for (const e of enemiesOnMap) {
    if (!visibleGrid[e.y][e.x]) continue;
    let ex = e.x,
      ey = e.y,
      mv = false;
    if (e.anim)
      [ex, ey, mv] = lerpPos(e.anim.fx, e.anim.fy, e.x, e.y, e.anim.t0, now);
    list.push({
      y: ey,
      draw: () => {
        const cx = ex * T - camX + T / 2,
          bY = ey * T - camY + T * 0.92;
        const hop = mv
          ? Math.sin(((now - e.anim.t0) / MOVE_MS) * Math.PI) * T * 0.12
          : Math.abs(Math.sin(now / 420 + e.ph)) * T * 0.05;
        shadow(ctx, cx, bY, T * 0.7);
        drawSprite(ctx, e.spr, cx, bY - hop, T * 1.05, e.flip);
      }
    });
  }
  if (visibleGrid[bossY][bossX]) {
    list.push({
      y: bossY + 0.01,
      draw: () => {
        const cx = SX(bossX) + T / 2,
          bY = SY(bossY) + T * 0.95;
        const pulse = 1 + Math.sin(now / 300) * 0.04;
        const g = ctx.createRadialGradient(
          cx,
          bY - T * 0.8,
          2,
          cx,
          bY - T * 0.8,
          T * 1.4
        );
        g.addColorStop(0, "rgba(255,60,120,0.55)");
        g.addColorStop(1, "rgba(255,60,120,0)");
        ctx.fillStyle = g;
        ctx.fillRect(cx - T * 1.5, bY - T * 2.3, T * 3, T * 3);
        shadow(ctx, cx, bY, T * 1.2);
        drawSprite(ctx, currentBoss.spr, cx, bY, T * 1.65 * pulse, false);
      }
    });
  }
  followers.forEach((f, i) => {
    const [fx, fy] = lerpPos(f.fx, f.fy, f.x, f.y, f.t0, now);
    if (f.x === playerX && f.y === playerY && !pMoving) return;
    list.push({
      y: fy - 0.001 * (i + 1),
      draw: () => {
        const cx = fx * T - camX + T / 2,
          bY = fy * T - camY + T * 0.9;
        const hop =
          Math.abs(Math.sin(now / 160 + i)) * (pMoving ? T * 0.08 : T * 0.02);
        shadow(ctx, cx, bY, T * 0.55);
        drawSprite(ctx, f.spr, cx, bY - hop, T * 0.82, false);
      }
    });
  });
  list.push({
    y: pry + 0.002,
    draw: () => {
      const cx = (prx + bx) * T - camX + T / 2,
        bY = (pry + by) * T - camY + T * 0.94;
      const hop = pMoving
        ? Math.sin(((now - pAnim.t0) / MOVE_MS) * Math.PI) * T * 0.1
        : Math.sin(now / 500) * T * 0.015;
      if (weaponLevel >= 4) {
        const col =
          weaponLevel >= 8
            ? "255,120,220"
            : weaponLevel >= 6
            ? "255,230,90"
            : "255,140,60";
        const g = ctx.createRadialGradient(
          cx,
          bY - T * 0.6,
          2,
          cx,
          bY - T * 0.6,
          T * 0.9
        );
        g.addColorStop(0, `rgba(${col},0.35)`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(cx - T, bY - T * 1.6, T * 2, T * 2);
      }
      shadow(ctx, cx, bY, T * 0.7);
      drawSprite(ctx, SPR.hero, cx, bY - hop, T * 1.28, facing < 0);
    }
  });
  list.sort((a, b) => a.y - b.y).forEach((o) => o.draw());

  // たいまつ
  for (const t of torchList) {
    if (
      t.x < x0 - 1 ||
      t.x > x1 + 1 ||
      t.y < y0 - 1 ||
      t.y > y1 + 1 ||
      !explored[t.y][t.x]
    )
      continue;
    const cx = SX(t.x) + T / 2,
      cy = SY(t.y) + T * 0.42;
    ctx.fillStyle = "#3a2a1a";
    ctx.fillRect(cx - 2, cy, 4, T * 0.32);
    const fl =
      1 + Math.sin(now / 90 + t.ph) * 0.15 + Math.sin(now / 37 + t.ph) * 0.08;
    ctx.fillStyle = "#ff6a00";
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy - T * 0.08,
      T * 0.13 * fl,
      T * 0.2 * fl,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.fillStyle = "#ffd54f";
    ctx.beginPath();
    ctx.ellipse(cx, cy - T * 0.04, T * 0.07, T * 0.11 * fl, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // くらやみ と あかり
  if (TH.dark > 0) {
    const L = lightCtx;
    L.setTransform(1, 0, 0, 1, 0, 0);
    L.globalCompositeOperation = "source-over";
    L.clearRect(0, 0, lightCv.width, lightCv.height);
    L.fillStyle = `rgba(3,3,16,${TH.dark})`;
    L.fillRect(0, 0, lightCv.width, lightCv.height);
    L.setTransform(DPR, 0, 0, DPR, 0, 0);
    L.globalCompositeOperation = "destination-out";
    const light = (x, y, r, a) => {
      const g = L.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${a})`);
      g.addColorStop(0.6, `rgba(0,0,0,${a * 0.75})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      L.fillStyle = g;
      L.beginPath();
      L.arc(x, y, r, 0, Math.PI * 2);
      L.fill();
    };
    const flick = 1 + Math.sin(now / 170) * 0.025;
    light(
      (prx + 0.5) * T - camX,
      (pry + 0.5) * T - camY,
      TH.light * T * flick,
      1
    );
    for (const t of torchList)
      if (
        t.x >= x0 - 3 &&
        t.x <= x1 + 3 &&
        t.y >= y0 - 3 &&
        t.y <= y1 + 3 &&
        explored[t.y][t.x]
      )
        light(
          SX(t.x) + T / 2,
          SY(t.y) + T * 0.4,
          T * (2.8 + Math.sin(now / 90 + t.ph) * 0.15),
          0.9
        );
    let n = 0;
    if (TH.liquid === "lava")
      for (let y = y0; y <= y1 && n < 40; y++)
        for (let x = x0; x <= x1 && n < 40; x++)
          if (mapGrid[y][x] === 2 && explored[y][x]) {
            light(SX(x) + T / 2, SY(y) + T / 2, T * 1.6, 0.7);
            n++;
          }
    for (const s of springs)
      if (explored[s.y][s.x])
        light(SX(s.x) + T / 2, SY(s.y) + T / 2, T * 2, 0.6);
    if (explored[bossY][bossX])
      light(SX(bossX) + T / 2, SY(bossY) + T / 2, T * 2.4, 0.8);
    ctx.drawImage(lightCv, 0, 0, viewW, viewH);
  }

  // まだ 行っていない ところ（きり）
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(fogCanvas, -camX, -camY, mw, mh);

  // てきが 気づいた！
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const e of enemiesOnMap) {
    if (!e.alert || now - e.alertT > 900 || !visibleGrid[e.y][e.x]) continue;
    const cx = SX(e.x) + T / 2,
      cy = SY(e.y) - T * 0.25;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, T * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#e53935";
    ctx.font = `bold ${Math.round(T * 0.36)}px sans-serif`;
    ctx.fillText("!", cx, cy + 1);
  }

  // ひろった ものの ポップアップ
  for (let i = mapPops.length - 1; i >= 0; i--) {
    const p = mapPops[i],
      k = (now - p.t0) / 1100;
    if (k >= 1) {
      mapPops.splice(i, 1);
      continue;
    }
    ctx.globalAlpha = 1 - k * k;
    ctx.font = `bold ${Math.round(T * 0.42)}px DotGothic16, sans-serif`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = p.color;
    const yy = SY(p.y) - T * 0.3 - k * T * 0.8;
    ctx.strokeText(p.text, SX(p.x) + T / 2, yy);
    ctx.fillText(p.text, SX(p.x) + T / 2, yy);
    ctx.globalAlpha = 1;
  }

  drawBossArrow(ctx, now, prx, pry);
  drawMinimap(now);
}

// 画面の そとに いる ボスの ほうがくを 矢じるしで しめす
function drawBossArrow(ctx, now, prx, pry) {
  const T = tileSize;
  const bxs = (bossX + 0.5) * T - camX,
    bys = (bossY + 0.5) * T - camY;
  if (bxs > 0 && bxs < viewW && bys > 0 && bys < viewH) return;
  const pxs = (prx + 0.5) * T - camX,
    pys = (pry + 0.5) * T - camY;
  const ang = Math.atan2(bys - pys, bxs - pxs);
  const m = 26;
  const k = Math.min(
    (viewW / 2 - m) / Math.abs(Math.cos(ang) || 1e-6),
    (viewH / 2 - m) / Math.abs(Math.sin(ang) || 1e-6)
  );
  const ax = viewW / 2 + Math.cos(ang) * k,
    ay = viewH / 2 + Math.sin(ang) * k;
  const pulse = 1 + Math.sin(now / 250) * 0.08;
  ctx.save();
  ctx.translate(ax, ay);
  ctx.fillStyle = "rgba(10,12,40,0.75)";
  ctx.strokeStyle = "#ffd84a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 17 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.rotate(ang);
  ctx.fillStyle = "#ffd84a";
  ctx.beginPath();
  ctx.moveTo(26 * pulse, 0);
  ctx.lineTo(17, -7);
  ctx.lineTo(17, 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  const c = emojiCanvas("👑", 16),
    s = c.width / DPR;
  ctx.drawImage(c, ax - s / 2, ay - s / 2, s, s);
}

function paintMiniBase(g, scale) {
  const fl = {
    grass: "#7fcf5f",
    forest: "#5f9e52",
    cave: "#9d948c",
    lava: "#8a6a5e",
    ice: "#e6f5ff",
    desert: "#f0d090",
    castle: "#7d74a6",
    star: "#5a63c9"
  }[mapTheme];
  const lq = {
    water: "#3f9ae0",
    swamp: "#3c725e",
    lava: "#ff7a1a",
    icewater: "#5c9fd8",
    oasis: "#53bfdc",
    moat: "#5a4ab0",
    void: "#22225a"
  }[TH.liquid];
  g.clearRect(0, 0, MAP_W * scale, MAP_H * scale);
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) {
      if (!explored[y][x]) continue;
      const t = mapGrid[y][x];
      g.fillStyle = t === 0 ? fl : t === 2 ? lq : "rgba(20,20,30,0.85)";
      g.fillRect(x * scale, y * scale, scale, scale);
    }
}

function drawMinimap(now) {
  if (miniDirty) {
    paintMiniBase(miniBase.getContext("2d"), 3);
    miniDirty = false;
  }
  const g = miniCtx;
  g.clearRect(0, 0, miniCv.width, miniCv.height);
  g.fillStyle = "rgba(4,6,24,0.55)";
  g.fillRect(0, 0, miniCv.width, miniCv.height);
  g.drawImage(miniBase, 0, 0);
  for (const c of chests)
    if (!c.opened && explored[c.y][c.x]) {
      g.fillStyle = "#ffd84a";
      g.fillRect(c.x * 3, c.y * 3, 3, 3);
    }
  for (const s of springs)
    if (!s.used && explored[s.y][s.x]) {
      g.fillStyle = "#4fd2ff";
      g.fillRect(s.x * 3, s.y * 3, 3, 3);
    }
  if (explored[bossY][bossX]) {
    g.fillStyle = Math.floor(now / 300) % 2 ? "#ff3d7f" : "#ffffff";
    g.fillRect(bossX * 3 - 1, bossY * 3 - 1, 5, 5);
  }
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 1;
  g.strokeRect(
    (camX / tileSize) * 3 + 0.5,
    (camY / tileSize) * 3 + 0.5,
    (viewW / tileSize) * 3,
    (viewH / tileSize) * 3
  );
  if (Math.floor(now / 250) % 2) {
    g.fillStyle = "#ffffff";
    g.fillRect(playerX * 3 - 1, playerY * 3 - 1, 5, 5);
  }
}

function openBigMap() {
  if (screenName !== "explore") return;
  const scale = 9;
  const c = mkCanvas(MAP_W * scale, MAP_H * scale);
  const g = c.getContext("2d");
  g.fillStyle = "#05060f";
  g.fillRect(0, 0, c.width, c.height);
  paintMiniBase(g, scale);
  for (const ch of chests)
    if (explored[ch.y][ch.x]) {
      g.fillStyle = ch.opened ? "#7a6a3a" : "#ffd84a";
      g.fillRect(ch.x * scale + 2, ch.y * scale + 2, scale - 4, scale - 4);
    }
  for (const s of springs)
    if (explored[s.y][s.x]) {
      g.fillStyle = "#4fd2ff";
      g.beginPath();
      g.arc(
        s.x * scale + scale / 2,
        s.y * scale + scale / 2,
        scale / 2 - 1,
        0,
        7
      );
      g.fill();
    }
  if (explored[bossY][bossX]) {
    g.font = `${scale * 1.6}px sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("👑", bossX * scale + scale / 2, bossY * scale + scale / 2);
  }
  g.fillStyle = "#fff";
  g.strokeStyle = "#000";
  g.lineWidth = 2;
  g.beginPath();
  g.arc(
    playerX * scale + scale / 2,
    playerY * scale + scale / 2,
    scale * 0.6,
    0,
    7
  );
  g.fill();
  g.stroke();
  const pct = Math.round(
    (100 * explored.flat().filter(Boolean).length) / (MAP_W * MAP_H)
  );
  openModal(
    "🗺️ ちず",
    `<div class="bigmap-wrap"></div><p class="bigmap-legend">⚪ じぶん　🟨 たからばこ　🔵 いずみ　👑 ボス<br>たんけん した ところ：${pct}%</p>`,
    [{ label: "とじる", cls: "btn-gold", onClick: closeModal }]
  );
  c.className = "bigmap-canvas";
  document.querySelector("#modal .bigmap-wrap").appendChild(c);
}

// ============================================================
// 09  バトル（エンカウント・こたえあわせ・こうげき・ごほうび）
// ============================================================
let battle = null;
let correctionTimer = null;
let continueTimer = null;
const $ = (id) => document.getElementById(id);

// ミミックの ドット絵
let mimicSrc = null;
function getMimicSprite() {
  if (!mimicSrc) {
    const c = tile((g) => {
      paintChest(g, true);
      px(g, 3, 6, "#1d1208", 10, 2);
      for (let x = 3; x < 13; x += 2) {
        px(g, x, 5, "#ffffff");
        px(g, x + 1, 8, "#ffffff");
      }
      px(g, 6, 8, "#e53950", 4, 2);
      px(g, 4, 2, "#ffeb3b", 2, 1);
      px(g, 10, 2, "#ffeb3b", 2, 1);
      px(g, 5, 2, "#d50000");
      px(g, 10, 2, "#d50000");
    });
    mimicSrc = c.toDataURL();
  }
  return { src: mimicSrc, emoji: "📦", pixel: true };
}

// ---------------- エンカウント ----------------
function prepareBattle(kind, enemy, intro) {
  if (battle) return;
  autoPath = [];
  heldDir = null;
  stepLock = true;
  battle = { kind, enemy, busy: true, over: false };
  currentMonsterHp = enemy.hp;
  currentMonsterAtk = enemy.atk;
  enemy.maxHp = enemy.hp;
  const isBoss = kind === "boss";
  Sound.stopBgm();
  Sound.play(isBoss ? "boss" : kind === "trap" ? "trap" : "encounter");
  playEncounterTransition(kind, enemy).then(() => {
    stepLock = false;
    showScreen("battle");
    setupBattleScene(kind, enemy);
    Sound.playBgm(isBoss ? "boss" : "battle");
    setBattleMessage(intro);
    generateQuestion();
    afterQuestion();
    revealTransition();
    setTimeout(() => {
      if (battle) battle.busy = false;
    }, 380);
  });
}

function encounterTrap() {
  isTrapEncounter = true;
  currentEnemyIndex = -1;
  isBossBattle = false;
  isMimic = false;
  currentMonsterAtk = Math.max(1, Math.round(playerMaxHp * 0.12));
  prepareBattle(
    "trap",
    { name: "わな", spr: E("⚡"), hp: 1, atk: currentMonsterAtk },
    "わなが さどう した！\n急いで けいさん しろ！"
  );
}

function encounterMimic() {
  isTrapEncounter = false;
  currentEnemyIndex = -1;
  isBossBattle = false;
  isMimic = true;
  const lv = level - 1;
  const hp = Math.round(10 * (1 + lv * 0.22)),
    atk = Math.max(1, Math.round(4 * (1 + lv * 0.12)));
  prepareBattle(
    "mimic",
    {
      name: "ミミック",
      spr: getMimicSprite(),
      hp,
      atk,
      reward: 150,
      expBonus: 80
    },
    "宝ばこ は ミミック だった！\nおそい かかって きた！"
  );
}

function encounterBoss() {
  isTrapEncounter = false;
  currentEnemyIndex = -1;
  isBossBattle = true;
  isMimic = false;
  prepareBattle(
    "boss",
    {
      name: currentBoss.name,
      spr: currentBoss.spr,
      hp: currentBoss.hp,
      atk: currentBoss.atk,
      reward: currentBoss.reward,
      expBonus: currentBoss.expBonus
    },
    `ボスの ${currentBoss.name} が たち はだかった！`
  );
}

function encounterVisibleMonster(index, ambush) {
  isTrapEncounter = false;
  currentEnemyIndex = index;
  isBossBattle = false;
  isMimic = false;
  const e = enemiesOnMap[index];
  prepareBattle(
    "normal",
    Object.assign({}, e),
    ambush ? `${e.name} が おそいかかって きた！` : `${e.name} が あらわれた！`
  );
}

function encounterRandomMonster() {
  isTrapEncounter = false;
  currentEnemyIndex = -1;
  isBossBattle = false;
  isMimic = false;
  const key = pickMonsterKey();
  const m = MONSTERS[key];
  const sc = scaleMonster(m);
  prepareBattle(
    "normal",
    {
      name: m.name,
      spr: m.spr,
      drop: m.drop,
      join: m.join,
      hp: sc.hp,
      atk: sc.atk,
      reward: sc.reward,
      expBonus: sc.expBonus
    },
    `とつぜん ${m.name} が あらわれた！`
  );
}

// ---------------- バトル画面の じゅんび ----------------
function setupBattleScene(kind, enemy) {
  const stage = $("battle-stage");
  stage.className =
    "theme-" +
    mapTheme +
    (kind === "boss" ? " is-boss" : "") +
    (kind === "trap" ? " is-trap" : "");
  paintBattleBackground();
  setMonsterSprite(enemy.spr, kind);
  const mi = $("monster-img");
  mi.className = "appear";
  $("enemy-name").textContent = (kind === "boss" ? "👑 " : "") + enemy.name;
  $("enemy-plate").style.display = kind === "trap" ? "none" : "";
  updateEnemyHp(true);
  renderPartyRow();
  $("combo-display").classList.remove("show");
  $("battle-area").style.display = "block";
  $("clear-area").style.display = "none";
  $("reward-panel").style.display = "none";
  $("correction").classList.remove("show");
  $("battle-screen").classList.remove("defeated");
  fxReset();
}

function setMonsterSprite(spr, kind) {
  const mi = $("monster-img");
  mi.style.setProperty(
    "--msize",
    kind === "boss"
      ? "var(--msize-boss)"
      : kind === "trap"
      ? "var(--msize-trap)"
      : "var(--msize-normal)"
  );
  mi.innerHTML = `<div class="mon-inner">${spriteHTML(spr, "mon-spr")}</div>`;
}

function updateEnemyHp(instant) {
  const e = battle && battle.enemy;
  if (!e) return;
  const pct = (Math.max(0, currentMonsterHp) / e.maxHp) * 100;
  const fill = $("enemy-hp-fill");
  if (instant) {
    fill.style.transition = "none";
    fill.style.width = pct + "%";
    void fill.offsetWidth;
    fill.style.transition = "";
  } else fill.style.width = pct + "%";
  fill.className = pct < 25 ? "low" : pct < 55 ? "mid" : "";
  $("enemy-hp-text").textContent = `${Math.max(0, currentMonsterHp)} / ${
    e.maxHp
  }`;
}

function renderPartyRow() {
  const shown = companions.slice(-4);
  $("party-row").innerHTML =
    `<div class="party-hero">${spriteHTML(SPR.hero, "")}</div>` +
    shown
      .map(
        (c, i) =>
          `<div class="party-mate" data-i="${i}">${spriteHTML(
            companionMeta(c).spr,
            ""
          )}</div>`
      )
      .join("");
}

let msgTimer = null;
function setBattleMessage(text) {
  const el = $("battle-message");
  el.textContent = text;
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
}

// ---------------- 問題の あとしまつ（見た目だけ） ----------------
function afterQuestion() {
  const qt = $("q-text");
  const raw = qt.innerText;
  const isGrid = raw.includes("|");
  const long = raw.length > 26 || raw.includes("\n");
  qt.classList.toggle("long", long && !isGrid);
  qt.classList.toggle("grid", isGrid);
  // 九九表パズルの もじの 表を、見やすい マスめに して 表示する（問題そのものは そのまま）
  if (isGrid) {
    const lines = raw.split("\n");
    const head = lines.filter(
      (l) => l.trim() && !l.includes("|") && !/^[\s\-+]+$/.test(l)
    );
    const rows = lines
      .filter((l) => l.includes("|"))
      .map((l) => l.split("|").map((c) => c.trim()));
    qt.dataset.raw = raw;
    qt.innerHTML = `<span class="grid-head">${head
      .map(escapeHtml)
      .join("<br>")}</span><table class="kuku-grid">${rows
      .map(
        (r) =>
          `<tr>${r
            .map(
              (c) =>
                `<td class="${c === "?" ? "q" : c === "" ? "blank" : ""}">${
                  c === "" ? "" : escapeHtml(c)
                }</td>`
            )
            .join("")}</tr>`
      )
      .join("")}</table>`;
  } else delete qt.dataset.raw;
  const twoStep = $("v-step2-area").style.display !== "none";
  $("v-step1").placeholder = twoStep ? "1だんめ" : "こたえ";
  $("question-box").dataset.mode = currentMode();
  markActiveInput();
}

function currentMode() {
  if ($("math-vertical-addsub").style.display === "block") return "va";
  if ($("math-vertical").style.display === "block")
    return $("v-step2-area").style.display === "none" ? "v1" : "v2";
  return $("rem-area").style.display === "inline" ? "rem" : "h";
}
function answerFields() {
  const m = currentMode();
  return {
    va: ["va-answer"],
    v1: ["v-step1"],
    v2: ["v-step1", "v-step2", "v-answer"],
    rem: ["h-answer", "h-answer-rem"],
    h: ["h-answer"]
  }[m].map($);
}

// ---------------- こたえの もじ（まちがえた時 と みやぶる で つかう） ----------------
function buildAnswerText() {
  const m = currentMode();
  if (m === "va") {
    const q = `${$("va-num1").innerText} ${$("va-sign").innerText} ${
      $("va-num2").innerText
    }`;
    return { q, a: `${currentAnswer}`, full: `${q} ＝ ${currentAnswer}` };
  }
  if (m === "v1" || m === "v2") {
    const p = currentNum1 * currentNum2,
      q = `${currentNum1} × ${currentNum2}`;
    const r = { q, a: `${p}`, full: `${q} ＝ ${p}` };
    if (m === "v2")
      r.detail = `1だんめ ${currentNum1 * (currentNum2 % 10)}　2だんめ ${
        currentNum1 * Math.floor(currentNum2 / 10)
      }　こたえ ${p}`;
    return r;
  }
  const q = $("q-text").dataset.raw
    ? "九九表パズル：？に 入る 数は？"
    : $("q-text").innerText.trim();
  const suf = $("q-suffix").innerText;
  let a;
  if (m === "rem")
    a =
      $("rem-suffix").innerText === "秒"
        ? `${currentAnswer}分 ${currentRem}秒`
        : `${currentAnswer} あまり ${currentRem}`;
  else if (/^\s*\/\s*\d+/.test(suf))
    a = `${currentAnswer}${suf.replace(/\s+/g, "")}`;
  else
    a = `${Math.round(currentAnswer * 100) / 100}${
      suf.trim() ? " " + suf.trim() : ""
    }`;
  if (q.includes("(例:")) {
    const h = Math.floor(currentAnswer / 100),
      mm = currentAnswer % 100;
    a += `（${h}時${mm}分）`;
  }
  const choices = {};
  q.replace(/(\d):([^\s)]+)/g, (_, n, l) => {
    choices[n] = l;
    return "";
  });
  if (choices[String(currentAnswer)] && m === "h")
    a += `（${choices[String(currentAnswer)]}）`;
  const shortQ = !q.includes("\n") && q.length <= 22 && /＝\s*$/.test(q);
  return {
    q: shortQ ? q.replace(/＝\s*$/, "").trim() : q,
    a,
    full: shortQ ? `${q} ${a}` : `こたえ： ${a}`,
    long: !shortQ
  };
}

// ---------------- こたえあわせ（もとの はんてい と 同じ） ----------------
function evaluateAnswer() {
  let isCorrect = false;
  let failMessage = "";
  if (
    document.getElementById("math-vertical-addsub").style.display === "block"
  ) {
    const ans = document.getElementById("va-answer").value;
    if (ans === "") return null;
    if (parseInt(ans) === currentAnswer) isCorrect = true;
    else failMessage = `けいさんが ちがうぞ！`;
  } else if (document.getElementById("rem-area").style.display === "inline") {
    const ans = document.getElementById("h-answer").value;
    const rAns = document.getElementById("h-answer-rem").value;
    if (ans === "" || rAns === "") return null;

    if (parseInt(ans) === currentAnswer && parseInt(rAns) === currentRem) {
      isCorrect = true;
    } else {
      let isTime = document.getElementById("rem-suffix").innerText === "秒";
      if (parseInt(ans) !== currentAnswer) {
        failMessage = isTime
          ? `「分」が ちがうぞ！`
          : `わり算の こたえが ちがうぞ！`;
      } else {
        failMessage = isTime ? `「秒」が ちがうぞ！` : `あまり が ちがうぞ！`;
      }
    }
  } else if (
    document.getElementById("math-horizontal").style.display === "block"
  ) {
    const ans = document.getElementById("h-answer").value;
    if (ans === "") return null;
    if (Math.abs(parseFloat(ans) - currentAnswer) < 0.01) isCorrect = true;
    else failMessage = `ちがうぞ！`;
  } else if (document.getElementById("v-step2-area").style.display === "none") {
    const ans = document.getElementById("v-step1").value;
    if (ans === "") return null;
    if (parseInt(ans) === currentNum1 * currentNum2) isCorrect = true;
    else failMessage = `けいさんが ちがうぞ！`;
  } else {
    const s1 = document.getElementById("v-step1").value;
    const s2 = document.getElementById("v-step2").value;
    const ans = document.getElementById("v-answer").value;
    if (s1 === "" || s2 === "" || ans === "") return null;
    const trueS1 = currentNum1 * (currentNum2 % 10);
    const trueS2 = currentNum1 * Math.floor(currentNum2 / 10);
    const trueAns = currentNum1 * currentNum2;
    if (parseInt(s1) !== trueS1) failMessage = `1だんめの かけ算が ちがうぞ！`;
    else if (parseInt(s2) !== trueS2)
      failMessage = `2だんめの かけ算が ちがうぞ！`;
    else if (parseInt(ans) !== trueAns)
      failMessage = `さいごの たし算が ちがうぞ！`;
    else isCorrect = true;
  }
  return { isCorrect, failMessage };
}

function checkAnswer() {
  if (!battle || battle.busy || battle.over) return;
  if (currentPlayerHp <= 0) return;
  const ev = evaluateAnswer();
  if (!ev) {
    nudgeEmpty();
    return;
  }
  battle.busy = true;
  stopTimer();
  const at = buildAnswerText();
  run.total++;
  recordAnswer(ev.isCorrect);
  if (ev.isCorrect) onCorrect();
  else onWrong(ev.failMessage, at);
}

function nudgeEmpty() {
  const empty = answerFields().find((el) => el.value === "");
  if (!empty) return;
  setFocus(empty);
  empty.classList.remove("nudge");
  void empty.offsetWidth;
  empty.classList.add("nudge");
  Sound.play("bump");
}

function stamp(ok) {
  const s = $("stamp");
  s.textContent = ok ? "⭕" : "❌";
  s.className = "";
  void s.offsetWidth;
  s.className = ok ? "ok" : "ng";
  Sound.play("stamp");
}

// ---------------- せいかい！ ----------------
function onCorrect() {
  currentCombo++;
  showCombo();
  run.correct++;
  stamp(true);
  Sound.play("correct");

  if (battle.kind === "trap") {
    battle.over = true;
    setTimeout(() => {
      setMonsterSprite(E("💨"), "trap");
      setBattleMessage("見事に わなを よけた！");
      $("battle-area").style.display = "none";
      setTimeout(returnToMap, 1300);
    }, 300);
    return;
  }

  // ↓ ダメージの けいさんは もとの ゲームと 同じ
  let damage = 1 + weaponLevel;
  if (weaponLevel >= 6) damage += 1;
  if (weaponLevel >= 9) damage += 2;
  if (currentCombo >= 3) damage += 1;
  if (currentCombo >= 5) damage += 2;

  let isCrit = false;
  if (Math.random() < 0.2 + currentCombo * 0.05) {
    damage += 3;
    isCrit = true;
  }

  let assistMsg = "";
  let assist = 0;
  let healed = 0;
  if (companions.length > 0) {
    if (Math.random() < 0.3) {
      assist = 2;
      assistMsg += `\nなかまの ついげき(+2ダメ)!`;
    }
    if (
      companions.some((c) => rareCompanions.includes(c)) &&
      Math.random() < 0.15
    ) {
      healed = Math.max(2, Math.round(playerMaxHp * 0.1));
      currentPlayerHp += healed;
      if (currentPlayerHp > playerMaxHp) currentPlayerHp = playerMaxHp;
      assistMsg += ` なかまの かいふく(+${healed}HP)!`;
    }
  }

  setTimeout(() => {
    playAttackEffect(weaponLevel, isCrit);
    hitMonster(isCrit);
    popDamage(String(damage), isCrit ? "crit" : "");
    currentMonsterHp -= damage;
    updateEnemyHp();
    if (assist) {
      currentMonsterHp -= assist;
      setTimeout(() => companionAssist(assist), 330);
    }
    if (healed)
      setTimeout(() => {
        popPlayer(`+${healed}`, "heal");
        Sound.play("heal");
      }, 500);
    updateStatus();

    if (currentMonsterHp > 0) {
      if (isCrit)
        setBattleMessage(
          `かいしんの いちげき！${assistMsg}\n(残りHP：${currentMonsterHp})`
        );
      else
        setBattleMessage(`ヒット！${assistMsg}\n(残りHP：${currentMonsterHp})`);
      setTimeout(nextQuestion, assist ? 950 : 720);
    } else {
      setTimeout(() => defeatEnemy(assistMsg), assist ? 850 : 520);
    }
  }, 240);
}

function nextQuestion() {
  if (!battle || battle.over) return;
  clearTimeout(correctionTimer);
  $("correction").classList.remove("show");
  generateQuestion();
  afterQuestion();
  battle.busy = false;
}

// ---------------- たおした！ ----------------
function defeatEnemy(assistMsg) {
  battle.over = true;
  const mi = $("monster-img");
  mi.className = "dying";
  burstAtMonster(battle.kind === "boss" ? 70 : 34);
  $("battle-area").style.display = "none";
  $("correction").classList.remove("show");

  if (battle.kind === "boss" || battle.kind === "mimic") {
    const mimic = battle.kind === "mimic";
    let rwd = mimic ? 150 : currentBoss.reward;
    let xpb = mimic ? 80 : currentBoss.expBonus;
    gold += rwd;
    exp += xpb;
    run.gold += rwd;
    run.exp += xpb;
    if (!mimic) stats.bosses++;
    Sound.stopBgm();
    Sound.play(mimic ? "win" : "bigwin");
    if (!mimic) flash("white");
    setBattleMessage(
      `${
        mimic ? "ミミック" : "ボス"
      }を たおした！${assistMsg}\n${xpb}EXPと ${rwd}円 ゲット！`
    );
    checkLevelUp();
    updateStatus();
    showRewardPanel(
      [`✨ ${xpb} EXP`, `💰 ${rwd} 円`],
      mimic ? returnToMap : stageClear,
      mimic ? 2600 : 3000
    );
  } else {
    const e = battle.enemy;
    gold += e.reward;
    exp += e.expBonus;
    run.gold += e.reward;
    run.exp += e.expBonus;
    run.monsters++;
    stats.monsters++;
    if (currentEnemyIndex !== -1) {
      enemiesOnMap.splice(currentEnemyIndex, 1);
      currentEnemyIndex = -1;
    }
    const lines = [`✨ ${e.expBonus} EXP`, `💰 ${e.reward} 円`];
    let dropMessage = "";
    if (e.drop && Math.random() < 0.6) {
      const matKey = e.drop;
      materials[matKey]++;
      run.items++;
      dropMessage = `\n【${matNames[matKey]}】を ひろった！`;
      lines.push(`${matNames[matKey]} そざい +1`);
    }
    let joinMessage = "";
    const joinStr = e.join != null ? allCompanionsList[e.join] : null;
    if (joinStr && Math.random() < 0.2 && !companions.includes(joinStr)) {
      companions.push(joinStr);
      joinMessage = `\n${e.name} が なかまに なった！`;
      lines.push(`🤝 ${e.name} が なかまに！`);
      followers.unshift({
        spr: companionMeta(joinStr).spr,
        x: playerX,
        y: playerY,
        fx: playerX,
        fy: playerY,
        t0: 0
      });
      if (followers.length > 3) followers.pop();
    }
    Sound.play("win");
    setBattleMessage(
      `たおした！${assistMsg}\n${e.expBonus}EXPと ${e.reward}円！${dropMessage}${joinMessage}`
    );
    checkLevelUp();
    updateStatus();
    showRewardPanel(
      lines,
      returnToMap,
      dropMessage !== "" || joinMessage !== "" ? 2600 : 1800
    );
  }
  if (pendingLevelUps) setTimeout(showLevelUp, 700);
}

function showRewardPanel(lines, next, wait) {
  const p = $("reward-panel");
  p.innerHTML = `<div class="reward-lines">${lines
    .map((l, i) => `<span style="animation-delay:${i * 0.12}s">${l}</span>`)
    .join("")}</div>
    <button class="btn btn-gold" id="btn-continue">つぎへ ▶</button>`;
  p.style.display = "block";
  clearTimeout(continueTimer);
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    clearTimeout(continueTimer);
    p.style.display = "none";
    next();
  };
  $("btn-continue").onclick = () => {
    Sound.play("select");
    go();
  };
  continueTimer = setTimeout(go, wait + (pendingLevelUps ? 1200 : 0));
}

// ---------------- まちがい ----------------
function onWrong(failMessage, at) {
  currentCombo = 0;
  $("combo-display").classList.remove("show");
  stamp(false);
  Sound.play("wrong");
  const key = at.full;
  if (!run.mistakes.some((m) => m.full === key)) run.mistakes.push(at);

  setTimeout(() => {
    monsterAttack();
    let dmg = Math.max(1, currentMonsterAtk);
    currentPlayerHp -= dmg;
    if (currentPlayerHp < 0) currentPlayerHp = 0;
    updateStatus();
    popPlayer(`-${dmg}`, "hurt");

    if (currentPlayerHp > 0) {
      showCorrection(at);
      if (battle.kind === "trap") {
        battle.over = true;
        setBattleMessage(failMessage + `\nわなに はまり ${dmg} の ダメージ！`);
        correctionTimer = setTimeout(returnToMap, 2300);
      } else {
        setBattleMessage(failMessage + `\n${dmg} の ダメージを うけた！`);
        correctionTimer = setTimeout(nextQuestion, 2100);
      }
    } else {
      setBattleMessage(failMessage + `\n${dmg} の ダメージを うけた！`);
      battle.over = true;
      setTimeout(gameOver, 900);
    }
  }, 260);
}

function showCorrection(at) {
  const c = $("correction");
  c.innerHTML = `<div class="corr-head">❌ ざんねん！ せいかいは…</div>
    <div class="corr-main ${at.long ? "small" : ""}">${escapeHtml(
    at.full
  )}</div>
    ${
      at.detail ? `<div class="corr-detail">${escapeHtml(at.detail)}</div>` : ""
    }
    <div class="corr-tap">タップで つぎへ</div>`;
  c.classList.add("show");
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"]/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch])
  );
}

// ---------------- まほう・やくそう ----------------
function useMagic(type) {
  if (!battle || battle.over) return;
  if (gold < 50) {
    setBattleMessage("お金が たりない！(50円 ひつよう)");
    Sound.play("bump");
    return;
  }
  gold -= 50;
  updateStatus();
  if (type === "hint") {
    const at = buildAnswerText();
    setBattleMessage(
      `🔮みやぶる：さいごの こたえは「 ${at.a} 」だ！${
        at.detail ? "\n" + at.detail : ""
      }`
    );
    Sound.play("rare");
  }
}

function usePotion() {
  const inBattle = screenName === "battle";
  const say = (t) => (inBattle ? setBattleMessage(t) : mapMsg(t));
  if (inBattle && (!battle || battle.over)) return;
  if (potions <= 0) {
    say("やくそうを 持っていない！");
    Sound.play("bump");
    return;
  }
  if (currentPlayerHp >= playerMaxHp) {
    say("HPは 満タンだ！");
    Sound.play("bump");
    return;
  }
  potions--;
  const heal = Math.max(15, Math.round(playerMaxHp * 0.4));
  currentPlayerHp += heal;
  if (currentPlayerHp > playerMaxHp) currentPlayerHp = playerMaxHp;
  updateStatus();
  flash("heal");
  Sound.play("potion");
  if (inBattle) {
    setBattleMessage("やくそうを 使った！ HPが かいふく した！");
    popPlayer(`+${heal}`, "heal");
  } else {
    mapMsg("やくそうを 使った！ HPかいふく！");
    popOnMap(playerX, playerY, `+${heal}`, "#7dffa0");
  }
}

// ---------------- コンボ ----------------
function showCombo() {
  const comboEl = $("combo-display");
  if (currentCombo >= 2) {
    comboEl.innerHTML = `<b>${currentCombo}</b>連けい!`;
    comboEl.classList.remove("show");
    void comboEl.offsetWidth;
    comboEl.classList.add("show");
    comboEl.classList.toggle("hot", currentCombo >= 5);
  }
}

// ---------------- ゲームオーバー と クリア ----------------
function gameOver() {
  stopTimer();
  Sound.stopBgm();
  Sound.play("dead");
  $("monster-img").className = "";
  $("battle-screen").classList.add("defeated");
  setBattleMessage(`あなたは たおれて しまった...`);
  $("battle-area").style.display = "none";
  showResult(false);
}

function stageClear() {
  stopTimer();
  let title, sub;
  if (isHardMode) {
    title = "ゲームクリア！";
    sub = "ボスを たおし、しれんを のりこえた！";
  } else {
    gold += 50;
    run.gold += 50;
    updateStatus();
    title = "ダンジョン クリア！";
    sub = "おまけ 50円 ゲット！";
  }
  setBattleMessage(`【${title}】\n${sub}`);
  const acc = run.total ? run.correct / run.total : 1;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const r =
    records[currentStage.id] ||
    (records[currentStage.id] = { clears: 0, stars: 0 });
  r.clears++;
  r.stars = Math.max(r.stars || 0, stars);
  saveData();
  showResult(true, title, sub, stars);
}

function showResult(win, title, sub, stars) {
  const secs = Math.round((Date.now() - run.start) / 1000);
  const acc = run.total ? Math.round((run.correct / run.total) * 100) : 0;
  const mist = run.mistakes.slice(-8);
  const el = $("clear-area");
  el.innerHTML = `<div class="result-card ${win ? "win" : "lose"}">
    <div class="result-title">${win ? escapeHtml(title) : "ぜんめつ…"}</div>
    ${
      win
        ? `<div class="result-stars">${[1, 2, 3]
            .map(
              (i) =>
                `<span class="${
                  i <= stars ? "on" : ""
                }" style="animation-delay:${0.25 + i * 0.22}s">★</span>`
            )
            .join("")}</div>
             <p class="result-sub">${escapeHtml(sub)}</p>`
        : `<p class="result-sub">だいじょうぶ！ 町で HPを かいふく して、もういちど ちょうせん しよう。</p>`
    }
    <ul class="result-stats">
      <li><span>せいかい</span><b>${run.correct} / ${
    run.total
  } もん（${acc}%）</b></li>
      <li><span>たおした モンスター</span><b>${
        run.monsters + (win ? 1 : 0)
      } ひき</b></li>
      <li><span>もらった お金</span><b>${run.gold} 円</b></li>
      <li><span>もらった EXP</span><b>${run.exp}</b></li>
      <li><span>かかった じかん</span><b>${Math.floor(secs / 60)}分 ${
    secs % 60
  }秒</b></li>
    </ul>
    ${
      mist.length
        ? `<div class="result-mistakes"><p>📒 まちがえた もんだいを ふくしゅう しよう！</p>
      <ul>${mist
        .map(
          (m) =>
            `<li>${
              m.long
                ? `<span class="mq">${escapeHtml(
                    m.q.replace(/\n/g, " ")
                  )}</span><b>${escapeHtml(m.a)}</b>`
                : `<b>${escapeHtml(m.full)}</b>`
            }${m.detail ? `<small>${escapeHtml(m.detail)}</small>` : ""}</li>`
        )
        .join("")}</ul></div>`
        : win
        ? `<p class="result-perfect">🎉 まちがい なし！ すごい！</p>`
        : ""
    }
    <div class="result-btns">
      <button class="btn" onclick="retryStage()">🔁 もういちど</button>
      <button class="btn btn-gold" onclick="goToTown()">🏠 町へ もどる</button>
    </div>
  </div>`;
  el.style.display = "block";
  setTimeout(
    () => el.scrollIntoView({ behavior: "smooth", block: "nearest" }),
    200
  );
}

function retryStage() {
  if (currentPlayerHp <= 0) currentPlayerHp = playerMaxHp;
  Sound.play("select");
  startDungeon(currentStage);
}

// ---------------- えんしゅつ ----------------
function hitMonster(isCrit) {
  const mi = $("monster-img");
  mi.className = "";
  void mi.offsetWidth;
  mi.className = isCrit ? "hit crit" : "hit";
  Sound.play(isCrit ? "crit" : "hit");
  if (isCrit) {
    flash("white");
    shake();
  }
}

function monsterAttack() {
  const mi = $("monster-img");
  mi.className = "";
  void mi.offsetWidth;
  mi.className = "attack";
  setTimeout(() => {
    Sound.play("damage");
    flash("red");
    shake();
  }, 170);
}

function companionAssist(dmg) {
  const mates = document.querySelectorAll("#party-row .party-mate");
  if (mates.length) {
    const m = mates[(Math.random() * mates.length) | 0];
    m.classList.remove("assist");
    void m.offsetWidth;
    m.classList.add("assist");
  }
  Sound.play("hit");
  popDamage(`+${dmg}`, "assist");
  sparkAtMonster(["#ffffff", "#9be7ff"], 12);
}

function popDamage(text, cls) {
  const layer = $("dmg-layer");
  const d = document.createElement("div");
  d.className = "dmg-num " + (cls || "");
  d.textContent = text;
  d.style.left = 50 + (Math.random() * 16 - 8) + "%";
  d.style.top = cls === "assist" ? "30%" : "38%";
  if (cls === "crit") d.innerHTML = `<small>かいしん！</small>${text}`;
  layer.appendChild(d);
  setTimeout(() => d.remove(), 1100);
}
function popPlayer(text, cls) {
  const layer = $("dmg-layer");
  const d = document.createElement("div");
  d.className = "dmg-num player " + cls;
  d.textContent = text;
  d.style.left = "14%";
  d.style.top = "62%";
  layer.appendChild(d);
  setTimeout(() => d.remove(), 1100);
}

let flashTimer = null;
function flash(kind) {
  if (reducedMotion && kind !== "heal") return;
  const f = $("flash-layer");
  f.className = "";
  void f.offsetWidth;
  f.className = "flash-" + kind;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => {
    f.className = "";
  }, 500);
}
function shake() {
  if (reducedMotion) return;
  const app = $("mq-app");
  app.classList.remove("shake");
  void app.offsetWidth;
  app.classList.add("shake");
  setTimeout(() => app.classList.remove("shake"), 400);
}

// ---------------- 入力（テンキー） ----------------
function setFocus(el) {
  currentFocusInput = el;
  markActiveInput();
}
function markActiveInput() {
  document
    .querySelectorAll("#battle-area input")
    .forEach((i) => i.classList.toggle("is-active", i === currentFocusInput));
}

function numIn(key) {
  if (!battle || battle.busy || battle.over) return;
  if (!currentFocusInput || currentFocusInput.offsetParent === null) {
    if (
      document.getElementById("math-vertical-addsub").style.display === "block"
    )
      currentFocusInput = document.getElementById("va-answer");
    else if (document.getElementById("math-vertical").style.display === "block")
      currentFocusInput = document.getElementById("v-step1");
    else currentFocusInput = document.getElementById("h-answer");
  }
  Sound.play("cursor");
  const el = currentFocusInput;
  if (key === "BS") {
    el.value = el.value.slice(0, -1);
  } else {
    const max = el.classList.contains("memo-input") ? 2 : 8;
    if (el.value.length >= max) return;
    if (
      key === "." &&
      (el.value.includes(".") || el.classList.contains("memo-input"))
    )
      return;
    el.value += key;
  }
  markActiveInput();
}

function onEnterKey(el) {
  if (el.id === "v-step1") {
    let n =
      document.getElementById("v-step2-area").style.display !== "none"
        ? "v-step2"
        : "v-answer";
    if (
      n === "v-answer" &&
      document.getElementById("v-ans-area").style.display === "none"
    ) {
      checkAnswer();
      return;
    }
    document.getElementById(n).focus();
    setFocus(document.getElementById(n));
  } else if (el.id === "v-step2") {
    document.getElementById("v-answer").focus();
    setFocus(document.getElementById("v-answer"));
  } else if (
    el.id === "h-answer" &&
    document.getElementById("rem-area").style.display === "inline" &&
    $("h-answer-rem").value === ""
  ) {
    $("h-answer-rem").focus();
    setFocus($("h-answer-rem"));
  } else checkAnswer();
}

function setupBattleInputs() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  document.querySelectorAll("#battle-area input").forEach((inp) => {
    inp.setAttribute("inputmode", "none");
    inp.setAttribute("autocomplete", "off");
    if (coarse) {
      inp.readOnly = true;
      inp.focus = function () {}; // タブレットでは キーボードを 出さない
    } else {
      const f = HTMLElement.prototype.focus;
      inp.focus = function () {
        try {
          f.call(this, { preventScroll: true });
        } catch (e) {
          f.call(this);
        }
      };
    }
    inp.addEventListener("pointerdown", () => setFocus(inp));
    inp.addEventListener("focus", () => setFocus(inp));
    inp.addEventListener("input", () => {
      const memo = inp.classList.contains("memo-input");
      let v = inp.value.replace(memo ? /[^0-9]/g : /[^0-9.]/g, "");
      if (!memo) {
        const i = v.indexOf(".");
        if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, "");
      }
      if (v !== inp.value) inp.value = v;
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onEnterKey(inp);
      }
    });
  });
  // 入力らんを えらんでいない ときも キーボードで 入力できる
  document.addEventListener("keydown", (e) => {
    if (screenName !== "battle" || isModalOpen()) return;
    const a = document.activeElement;
    if (a && a.tagName === "INPUT" && !a.readOnly) return;
    if (/^[0-9]$/.test(e.key)) {
      numIn(e.key);
      e.preventDefault();
    } else if (e.key === ".") numIn(".");
    else if (e.key === "Backspace") {
      numIn("BS");
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (currentFocusInput) onEnterKey(currentFocusInput);
      else checkAnswer();
      e.preventDefault();
    }
  });
  $("correction").addEventListener("click", () => {
    if (!battle || battle.over) return;
    clearTimeout(correctionTimer);
    nextQuestion();
  });
  document
    .querySelectorAll("#numpad-container button")
    .forEach((b) =>
      b.addEventListener("contextmenu", (e) => e.preventDefault())
    );
}

// もとの ゲームの タイマーは かくして あるだけ（時間せいげん なし）
function startTimer() {
  clearInterval(battleTimer);
  document.getElementById("timer-display").style.display = "none";
}
function stopTimer() {
  clearInterval(battleTimer);
  document.getElementById("timer-display").style.display = "none";
}

// ============================================================
// 10  バトルの はいけい・パーティクル・こうげきの えんしゅつ・エンカウントの 画面きりかえ
// ============================================================
let bgCv = null,
  fxCv = null,
  fxCtx = null;
let fxParts = [],
  fxSlashes = [],
  fxW = 0,
  fxH = 0,
  fxDpr = 1;
const bgCache = {};

function initFx() {
  bgCv = $("battle-bg");
  fxCv = $("battle-fx");
  fxCtx = fxCv.getContext("2d");
}
function fxReset() {
  fxParts = [];
  fxSlashes = [];
}

function sizeStageCanvases() {
  const st = $("battle-stage");
  const w = st.clientWidth,
    h = st.clientHeight;
  fxDpr = Math.min(2.5, window.devicePixelRatio || 1);
  if (w !== fxW || h !== fxH) {
    fxW = w;
    fxH = h;
    fxCv.width = Math.round(w * fxDpr);
    fxCv.height = Math.round(h * fxDpr);
  }
  return [w, h];
}

// ---------- はいけい ----------
function paintBattleBackground() {
  const [w, h] = sizeStageCanvases();
  const key = mapTheme + "|" + w + "x" + h + "|" + fxDpr;
  if (!bgCache[key]) {
    const c = mkCanvas(Math.round(w * fxDpr), Math.round(h * fxDpr));
    const g = c.getContext("2d");
    g.scale(fxDpr, fxDpr);
    BG_PAINT[mapTheme](g, w, h, mulberry32(7));
    // じめんの だいざ
    const gy = h * 0.8;
    const pg = g.createRadialGradient(w / 2, gy, 4, w / 2, gy, w * 0.26);
    pg.addColorStop(0, "rgba(0,0,0,0.45)");
    pg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = pg;
    g.beginPath();
    g.ellipse(w / 2, gy, w * 0.26, h * 0.07, 0, 0, Math.PI * 2);
    g.fill();
    // ふちの かげ
    const vg = g.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.3,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.75
    );
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.45)");
    g.fillStyle = vg;
    g.fillRect(0, 0, w, h);
    bgCache[key] = c;
  }
  const src = bgCache[key];
  bgCv.width = src.width;
  bgCv.height = src.height;
  bgCv.getContext("2d").drawImage(src, 0, 0);
}

function vgrad(g, w, y0, y1, stops) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
  g.fillStyle = gr;
  g.fillRect(0, y0, w, y1 - y0);
}
function ridge(g, w, h, base, amp, freq, ph, color, jag) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(0, h);
  for (let x = 0; x <= w; x += 4) {
    let y =
      base +
      Math.sin(x * freq + ph) * amp +
      Math.sin(x * freq * 2.7 + ph * 1.7) * amp * 0.35;
    if (jag) y += (Math.abs(((x * freq * 3 + ph) % 2) - 1) - 0.5) * amp * jag;
    g.lineTo(x, y);
  }
  g.lineTo(w, h);
  g.closePath();
  g.fill();
}
function stars(g, w, h, R, n, maxY) {
  for (let i = 0; i < n; i++) {
    const x = R() * w,
      y = R() * maxY,
      s = R() < 0.1 ? 2 : 1;
    g.fillStyle = `rgba(255,255,255,${0.4 + R() * 0.6})`;
    g.fillRect(x, y, s, s);
  }
}
const BG_PAINT = {
  grass(g, w, h, R) {
    vgrad(g, w, 0, h * 0.62, ["#5fb6f2", "#a8dcff", "#e2f5ff"]);
    for (let i = 0; i < 4; i++) {
      const cx = R() * w,
        cy = h * (0.08 + R() * 0.22),
        s = 18 + R() * 22;
      g.fillStyle = "rgba(255,255,255,0.92)";
      for (let k = 0; k < 4; k++) {
        g.beginPath();
        g.ellipse(
          cx + k * s * 0.6 - s,
          cy + (k % 2) * 4,
          s * 0.6,
          s * 0.38,
          0,
          0,
          7
        );
        g.fill();
      }
    }
    ridge(g, w, h, h * 0.5, 14, 0.012, 1, "#86c56f");
    ridge(g, w, h, h * 0.58, 12, 0.02, 2.4, "#5faa4c");
    vgrad(g, w, h * 0.64, h, ["#5cb246", "#3e8a2f"]);
    for (let i = 0; i < 90; i++) {
      const x = R() * w,
        y = h * 0.66 + R() * h * 0.34;
      g.fillStyle = R() < 0.5 ? "#2f7a26" : "#79c95a";
      g.fillRect(x, y, 2, 4 + R() * 4);
    }
    for (let i = 0; i < 18; i++) {
      g.fillStyle = ["#fff", "#ffd54f", "#f48fb1"][i % 3];
      g.fillRect(R() * w, h * 0.7 + R() * h * 0.28, 3, 3);
    }
  },
  forest(g, w, h, R) {
    vgrad(g, w, 0, h, ["#0f2d1e", "#1f5235", "#2c6a3f"]);
    for (let i = 0; i < 5; i++) {
      g.fillStyle = "rgba(220,255,200,0.06)";
      g.beginPath();
      const x = R() * w;
      g.moveTo(x, 0);
      g.lineTo(x + 30, 0);
      g.lineTo(x + 90, h);
      g.lineTo(x + 40, h);
      g.fill();
    }
    for (let i = 0; i < 9; i++) {
      const x = (i / 9) * w + R() * 20,
        tw = 14 + R() * 18;
      g.fillStyle = "#16301f";
      g.fillRect(x, 0, tw, h * 0.75);
    }
    ridge(g, w, h, h * 0.15, 18, 0.03, 0.5, "rgba(18,58,32,0.85)");
    g.fillStyle = "#123a20";
    g.fillRect(0, 0, w, h * 0.12);
    for (let i = 0; i < 6; i++) {
      const x = R() * w,
        tw = 22 + R() * 14;
      g.fillStyle = "#0d2416";
      g.fillRect(x, 0, tw, h * 0.82);
    }
    vgrad(g, w, h * 0.68, h, ["#3d7034", "#24461f"]);
    for (let i = 0; i < 6; i++) {
      const x = R() * w,
        y = h * 0.72 + R() * h * 0.22;
      g.fillStyle = "#f5e6c8";
      g.fillRect(x + 3, y, 3, 6);
      g.fillStyle = "#d32f2f";
      g.fillRect(x, y - 3, 9, 4);
    }
  },
  cave(g, w, h, R) {
    vgrad(g, w, 0, h, ["#141110", "#2f2825", "#3d3430"]);
    for (let i = 0; i < 14; i++) {
      const x = R() * w,
        l = 20 + R() * 50,
        wd = 10 + R() * 14;
      g.fillStyle = i % 2 ? "#221c19" : "#2b2421";
      g.beginPath();
      g.moveTo(x - wd / 2, 0);
      g.lineTo(x + wd / 2, 0);
      g.lineTo(x, l);
      g.fill();
    }
    ridge(g, w, h, h * 0.62, 16, 0.025, 3, "#2a2320", 1.2);
    vgrad(g, w, h * 0.7, h, ["#4a413b", "#2b2521"]);
    for (let i = 0; i < 7; i++) {
      const x = R() * w,
        y = h * 0.52 + R() * h * 0.14,
        s = 6 + R() * 8;
      const gr = g.createRadialGradient(x, y, 0, x, y, s * 2.4);
      gr.addColorStop(0, "rgba(126,231,255,0.35)");
      gr.addColorStop(1, "rgba(126,231,255,0)");
      g.fillStyle = gr;
      g.fillRect(x - s * 2.4, y - s * 2.4, s * 4.8, s * 4.8);
      g.fillStyle = "#5fd3f0";
      g.beginPath();
      g.moveTo(x, y - s * 1.6);
      g.lineTo(x + s * 0.5, y);
      g.lineTo(x, y + s * 0.4);
      g.lineTo(x - s * 0.5, y);
      g.fill();
      g.fillStyle = "#d8f8ff";
      g.beginPath();
      g.moveTo(x, y - s * 1.6);
      g.lineTo(x - s * 0.5, y);
      g.lineTo(x - s * 0.1, y);
      g.fill();
    }
  },
  lava(g, w, h, R) {
    vgrad(g, w, 0, h * 0.7, ["#1a0505", "#5a1408", "#a8320e"]);
    g.fillStyle = "#1e0b08";
    g.beginPath();
    g.moveTo(w * 0.15, h * 0.62);
    g.lineTo(w * 0.42, h * 0.16);
    g.lineTo(w * 0.52, h * 0.16);
    g.lineTo(w * 0.85, h * 0.62);
    g.fill();
    g.fillStyle = "#ff7a1a";
    g.fillRect(w * 0.43, h * 0.15, w * 0.08, 4);
    const glow = g.createRadialGradient(
      w * 0.47,
      h * 0.15,
      2,
      w * 0.47,
      h * 0.15,
      h * 0.35
    );
    glow.addColorStop(0, "rgba(255,150,40,0.7)");
    glow.addColorStop(1, "rgba(255,80,20,0)");
    g.fillStyle = glow;
    g.fillRect(0, 0, w, h * 0.6);
    g.fillStyle = "rgba(255,110,20,0.85)";
    for (const [x0, x1] of [
      [0.44, 0.33],
      [0.49, 0.6]
    ]) {
      g.beginPath();
      g.moveTo(w * x0, h * 0.16);
      g.quadraticCurveTo((w * (x0 + x1)) / 2 + 6, h * 0.36, w * x1, h * 0.6);
      g.lineTo(w * x1 + 9, h * 0.6);
      g.quadraticCurveTo(
        (w * (x0 + x1)) / 2 + 12,
        h * 0.36,
        w * x0 + 6,
        h * 0.16
      );
      g.fill();
    }
    ridge(g, w, h, h * 0.6, 12, 0.03, 1, "#2a1210", 1);
    vgrad(g, w, h * 0.68, h, ["#3a2220", "#1f1210"]);
    const lg = g.createLinearGradient(0, h * 0.9, 0, h);
    lg.addColorStop(0, "#ffb300");
    lg.addColorStop(1, "#d84315");
    g.fillStyle = lg;
    g.fillRect(0, h * 0.92, w, h * 0.08);
  },
  ice(g, w, h, R) {
    vgrad(g, w, 0, h * 0.7, ["#1d3b6b", "#4c7fb8", "#b9e1f7"]);
    for (let i = 0; i < 3; i++) {
      g.strokeStyle =
        i % 2 ? "rgba(140,255,200,0.25)" : "rgba(190,140,255,0.22)";
      g.lineWidth = 10;
      g.beginPath();
      for (let x = 0; x <= w; x += 8)
        g.lineTo(x, h * (0.12 + i * 0.07) + Math.sin(x * 0.02 + i) * 10);
      g.stroke();
    }
    stars(g, w, h, R, 30, h * 0.25);
    for (let i = 0; i < 6; i++) {
      const x = (i / 5) * w,
        hh = h * (0.25 + R() * 0.2);
      g.fillStyle = "#d8eefa";
      g.beginPath();
      g.moveTo(x - 50, h * 0.66);
      g.lineTo(x, h * 0.66 - hh);
      g.lineTo(x + 50, h * 0.66);
      g.fill();
      g.fillStyle = "#9ccbe8";
      g.beginPath();
      g.moveTo(x, h * 0.66 - hh);
      g.lineTo(x + 50, h * 0.66);
      g.lineTo(x + 8, h * 0.66);
      g.fill();
    }
    vgrad(g, w, h * 0.66, h, ["#f2fbff", "#cbe6f6"]);
  },
  desert(g, w, h, R) {
    vgrad(g, w, 0, h * 0.65, ["#ff8f5a", "#ffc27a", "#ffe6a8"]);
    g.fillStyle = "rgba(255,246,200,0.9)";
    g.beginPath();
    g.arc(w * 0.78, h * 0.24, h * 0.1, 0, 7);
    g.fill();
    const pyr = (x, s) => {
      g.fillStyle = "#c88a48";
      g.beginPath();
      g.moveTo(x - s, h * 0.62);
      g.lineTo(x, h * 0.62 - s * 0.8);
      g.lineTo(x + s, h * 0.62);
      g.fill();
      g.fillStyle = "#a36d36";
      g.beginPath();
      g.moveTo(x, h * 0.62 - s * 0.8);
      g.lineTo(x + s, h * 0.62);
      g.lineTo(x + s * 0.2, h * 0.62);
      g.fill();
    };
    pyr(w * 0.22, h * 0.32);
    pyr(w * 0.42, h * 0.2);
    ridge(g, w, h, h * 0.62, 10, 0.015, 2, "#e8bd72");
    ridge(g, w, h, h * 0.72, 8, 0.022, 4, "#dcae62");
    for (let i = 0; i < 40; i++) {
      g.fillStyle = "rgba(160,110,50,0.35)";
      g.fillRect(R() * w, h * 0.75 + R() * h * 0.25, 6, 1);
    }
  },
  castle(g, w, h, R) {
    vgrad(g, w, 0, h, ["#120a24", "#2a1a4a", "#3b2463"]);
    for (let y = 0; y < h * 0.7; y += 14)
      for (let x = (y / 14) % 2 ? -14 : 0; x < w; x += 28) {
        g.fillStyle = (x + y) % 3 ? "#2a2045" : "#31264f";
        g.fillRect(x + 1, y + 1, 26, 12);
      }
    for (let i = 0; i < 4; i++) {
      const x = w * (0.08 + i * 0.28);
      g.fillStyle = "#1b1233";
      g.fillRect(x, 0, 26, h * 0.75);
      g.fillStyle = "#3d2d66";
      g.fillRect(x + 3, 0, 4, h * 0.75);
    }
    for (const x of [w * 0.22, w * 0.78]) {
      g.fillStyle = "#8e1f33";
      g.fillRect(x - 14, h * 0.06, 28, h * 0.36);
      g.fillStyle = "#d4a017";
      g.fillRect(x - 14, h * 0.06, 28, 4);
      g.beginPath();
      g.moveTo(x - 14, h * 0.42);
      g.lineTo(x, h * 0.36);
      g.lineTo(x + 14, h * 0.42);
      g.fillStyle = "#2a1a4a";
      g.fill();
      g.fillStyle = "#ffd54f";
      g.fillRect(x - 4, h * 0.16, 8, 8);
    }
    for (const x of [w * 0.06, w * 0.94]) {
      const gr = g.createRadialGradient(x, h * 0.4, 2, x, h * 0.4, 50);
      gr.addColorStop(0, "rgba(255,170,60,0.6)");
      gr.addColorStop(1, "rgba(255,170,60,0)");
      g.fillStyle = gr;
      g.fillRect(x - 50, h * 0.4 - 50, 100, 100);
      g.fillStyle = "#ffb74d";
      g.fillRect(x - 3, h * 0.38, 6, 10);
    }
    for (let y = h * 0.7; y < h; y += 12)
      for (let x = 0; x < w; x += 24) {
        g.fillStyle =
          ((x / 24 + (y - h * 0.7) / 12) | 0) % 2 ? "#3c3358" : "#2c2545";
        g.fillRect(x, y, 24, 12);
      }
    g.fillStyle = "rgba(140,30,50,0.55)";
    g.fillRect(w * 0.38, h * 0.7, w * 0.24, h * 0.3);
  },
  star(g, w, h, R) {
    vgrad(g, w, 0, h, ["#03041a", "#120d3d", "#24145a"]);
    for (const [x, y, r, c] of [
      [0.2, 0.3, 90, "rgba(160,60,255,0.25)"],
      [0.75, 0.2, 110, "rgba(40,120,255,0.22)"],
      [0.55, 0.5, 80, "rgba(255,80,180,0.15)"]
    ]) {
      const gr = g.createRadialGradient(w * x, h * y, 0, w * x, h * y, r);
      gr.addColorStop(0, c);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }
    stars(g, w, h, R, 140, h * 0.75);
    g.fillStyle = "#e0a96d";
    g.beginPath();
    g.arc(w * 0.83, h * 0.22, 22, 0, 7);
    g.fill();
    g.fillStyle = "#b9814a";
    g.beginPath();
    g.arc(w * 0.83 + 6, h * 0.22 + 4, 18, 0, 7);
    g.fill();
    g.strokeStyle = "rgba(255,230,190,0.8)";
    g.lineWidth = 3;
    g.beginPath();
    g.ellipse(w * 0.83, h * 0.22, 36, 9, -0.3, 0, 7);
    g.stroke();
    g.fillStyle = "#2d2a6e";
    g.beginPath();
    g.ellipse(w / 2, h * 0.84, w * 0.42, h * 0.1, 0, 0, 7);
    g.fill();
    g.strokeStyle = "#8c95ff";
    g.lineWidth = 2;
    g.shadowColor = "#8c95ff";
    g.shadowBlur = 12;
    g.beginPath();
    g.ellipse(w / 2, h * 0.84, w * 0.42, h * 0.1, 0, 0, 7);
    g.stroke();
    g.shadowBlur = 0;
  }
};

// ---------- パーティクル ----------
const AMBIENT = {
  grass: {
    n: 10,
    make: () => ({
      x: Math.random() * fxW,
      y: -5,
      vx: 0.3 + Math.random() * 0.4,
      vy: 0.35 + Math.random() * 0.3,
      s: 3,
      c: Math.random() < 0.5 ? "#f8bbd0" : "#aed581",
      life: 9e9,
      sway: true
    })
  },
  forest: {
    n: 16,
    make: () => ({
      x: Math.random() * fxW,
      y: fxH * (0.2 + Math.random() * 0.7),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      s: 3,
      c: "#e6ff7a",
      glow: true,
      life: 300 + Math.random() * 200
    })
  },
  cave: {
    n: 14,
    make: () => ({
      x: Math.random() * fxW,
      y: Math.random() * fxH,
      vx: (Math.random() - 0.5) * 0.15,
      vy: 0.1,
      s: 2,
      c: "rgba(220,210,190,0.5)",
      life: 400
    })
  },
  lava: {
    n: 22,
    make: () => ({
      x: Math.random() * fxW,
      y: fxH + 4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.6 - Math.random() * 0.8,
      s: 3,
      c: Math.random() < 0.5 ? "#ffb300" : "#ff6d00",
      glow: true,
      life: 260
    })
  },
  ice: {
    n: 28,
    make: () => ({
      x: Math.random() * fxW,
      y: -4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.5 + Math.random() * 0.6,
      s: Math.random() < 0.3 ? 3 : 2,
      c: "#ffffff",
      life: 9e9,
      sway: true
    })
  },
  desert: {
    n: 20,
    make: () => ({
      x: -4,
      y: fxH * (0.5 + Math.random() * 0.5),
      vx: 1.2 + Math.random() * 1.2,
      vy: (Math.random() - 0.5) * 0.2,
      s: 2,
      c: "rgba(230,190,120,0.7)",
      life: 9e9
    })
  },
  castle: {
    n: 14,
    make: () => ({
      x: Math.random() * fxW,
      y: fxH,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.3 - Math.random() * 0.4,
      s: 3,
      c: "#c58bff",
      glow: true,
      life: 350
    })
  },
  star: {
    n: 24,
    make: () => ({
      x: Math.random() * fxW,
      y: Math.random() * fxH * 0.8,
      vx: 0,
      vy: 0,
      s: 2,
      c: "#ffffff",
      twinkle: Math.random() * 6,
      life: 200 + Math.random() * 200
    })
  }
};

function monsterCenter() {
  const st = $("battle-stage").getBoundingClientRect(),
    m = $("monster-img").getBoundingClientRect();
  return [
    m.left - st.left + m.width / 2,
    m.top - st.top + m.height / 2,
    m.width
  ];
}
function spawn(x, y, n, colors, speed, life, grav, size) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2,
      sp = speed * (0.4 + Math.random() * 0.8);
    fxParts.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      c: colors[i % colors.length],
      s: size * (0.6 + Math.random() * 0.8),
      life: life * (0.6 + Math.random() * 0.6),
      age: 0,
      grav,
      glow: true,
      burst: true
    });
  }
}
function burstAtMonster(n) {
  const [x, y] = monsterCenter();
  spawn(
    x,
    y,
    n,
    ["#ffffff", "#ffd84a", "#ff8a65", "#b388ff"],
    4.5,
    55,
    0.08,
    5
  );
}
function sparkAtMonster(colors, n) {
  const [x, y] = monsterCenter();
  spawn(x, y, n, colors, 3, 30, 0.05, 3);
}

// ---------- こうげきの えんしゅつ（ぶきの つよさで かわる） ----------
function playAttackEffect(wLv, isCrit) {
  const [x, y, size] = monsterCenter();
  const now = performance.now();
  const L = Math.max(90, size * 1.1);
  const add = (ang, col, delay, wid) =>
    fxSlashes.push({ x, y, ang, len: L, col, t0: now + delay, dur: 230, wid });
  let colors;
  if (wLv >= 8) {
    add(-0.8, "#ff7ad9", 0, 12);
    add(0.8, "#ffffff", 90, 12);
    add(0, "#b388ff", 180, 10);
    colors = ["#ff7ad9", "#b388ff", "#ffffff"];
  } else if (wLv >= 6) {
    add(-0.75, "#ffe94a", 0, 11);
    add(0.75, "#ffffff", 100, 10);
    colors = ["#ffe94a", "#fff59d", "#ffffff"];
  } else if (wLv >= 4) {
    add(-0.75, "#ff7a1a", 0, 11);
    colors = ["#ff7a1a", "#ffb300", "#ffe082"];
  } else if (wLv >= 1) {
    add(-0.75, "#9be7ff", 0, 9);
    colors = ["#ffffff", "#9be7ff"];
  } else {
    add(-0.2, "#dddddd", 0, 5);
    colors = ["#ffffff", "#cccccc"];
  }
  setTimeout(
    () =>
      spawn(
        x,
        y,
        isCrit ? 40 : 18,
        colors,
        isCrit ? 6 : 4,
        isCrit ? 50 : 34,
        0.06,
        isCrit ? 6 : 4
      ),
    120
  );
  // もとの ゲームの 絵文字ばくはつ も のこす
  const effectLayer = $("effect-layer");
  effectLayer.innerHTML = "";
  const boom =
    wLv >= 8
      ? "🌌💥"
      : wLv >= 6
      ? "⚡💥"
      : wLv >= 4
      ? "🔥💥"
      : isCrit
      ? "💥"
      : "";
  if (boom) {
    const b = document.createElement("div");
    b.className = "effect-boom";
    b.textContent = boom;
    effectLayer.appendChild(b);
  }
}

function renderBattleFx(now) {
  if (!fxCtx) return;
  const g = fxCtx;
  g.setTransform(fxDpr, 0, 0, fxDpr, 0, 0);
  g.clearRect(0, 0, fxW, fxH);
  const amb = AMBIENT[mapTheme];
  if (amb) {
    const count = fxParts.filter((p) => !p.burst).length;
    if (count < amb.n && Math.random() < 0.3) {
      const p = amb.make();
      p.age = 0;
      fxParts.push(p);
    }
  }
  for (let i = fxParts.length - 1; i >= 0; i--) {
    const p = fxParts[i];
    p.age++;
    p.x += p.vx + (p.sway ? Math.sin((p.age + i) / 20) * 0.4 : 0);
    p.y += p.vy;
    if (p.grav) p.vy += p.grav;
    if (p.burst) {
      p.vx *= 0.96;
      p.vy *= 0.96;
    }
    if (
      p.age > p.life ||
      p.y > fxH + 10 ||
      p.y < -20 ||
      p.x > fxW + 10 ||
      p.x < -20
    ) {
      fxParts.splice(i, 1);
      continue;
    }
    let a = p.burst
      ? 1 - p.age / p.life
      : Math.min(1, p.age / 30, (p.life - p.age) / 30);
    if (p.twinkle != null) a *= 0.5 + 0.5 * Math.sin(now / 200 + p.twinkle);
    g.globalAlpha = Math.max(0, a);
    if (p.glow) {
      g.fillStyle = p.c;
      g.shadowColor = p.c;
      g.shadowBlur = 8;
    } else {
      g.fillStyle = p.c;
      g.shadowBlur = 0;
    }
    g.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
  }
  g.shadowBlur = 0;
  g.globalAlpha = 1;
  for (let i = fxSlashes.length - 1; i >= 0; i--) {
    const s = fxSlashes[i];
    const t = (now - s.t0) / s.dur;
    if (t < 0) continue;
    if (t > 1) {
      fxSlashes.splice(i, 1);
      continue;
    }
    const head = Math.min(1, t * 1.7),
      tail = Math.max(0, t * 1.7 - 0.7);
    const dx = Math.cos(s.ang) * s.len,
      dy = Math.sin(s.ang) * s.len;
    const x0 = s.x - dx / 2,
      y0 = s.y - dy / 2;
    g.save();
    g.lineCap = "round";
    g.shadowColor = s.col;
    g.shadowBlur = 18;
    g.strokeStyle = s.col;
    g.lineWidth = s.wid * (1 - t * 0.6);
    g.beginPath();
    g.moveTo(x0 + dx * tail, y0 + dy * tail);
    g.lineTo(x0 + dx * head, y0 + dy * head);
    g.stroke();
    g.strokeStyle = "#ffffff";
    g.lineWidth = s.wid * 0.35 * (1 - t);
    g.beginPath();
    g.moveTo(x0 + dx * tail, y0 + dy * tail);
    g.lineTo(x0 + dx * head, y0 + dy * head);
    g.stroke();
    g.restore();
  }
}

// ---------- エンカウントの 画面きりかえ ----------
let trCv = null,
  trCtx = null,
  trOrder = null,
  trCols = 0,
  trRows = 0,
  trCell = 46;
function prepTransitionGrid() {
  trCv = $("transition-canvas");
  trCtx = trCv.getContext("2d");
  const w = window.innerWidth,
    h = window.innerHeight,
    d = Math.min(2, window.devicePixelRatio || 1);
  trCv.width = Math.round(w * d);
  trCv.height = Math.round(h * d);
  trCtx.setTransform(d, 0, 0, d, 0, 0);
  trCols = Math.ceil(w / trCell);
  trRows = Math.ceil(h / trCell);
  const cx = trCols / 2,
    cy = trRows / 2,
    maxD = Math.hypot(cx, cy);
  trOrder = [];
  for (let y = 0; y < trRows; y++)
    for (let x = 0; x < trCols; x++) {
      const dx = x + 0.5 - cx,
        dy = y + 0.5 - cy;
      const ang = (Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2);
      trOrder.push({
        x,
        y,
        k: (1 - Math.hypot(dx, dy) / maxD) * 0.75 + ang * 0.25
      });
    }
  trOrder.sort((a, b) => a.k - b.k);
}
function drawTransition(p, color) {
  const w = window.innerWidth,
    h = window.innerHeight;
  trCtx.clearRect(0, 0, w, h);
  trCtx.fillStyle = color;
  const n = Math.floor(trOrder.length * p);
  for (let i = 0; i < n; i++) {
    const c = trOrder[i];
    trCtx.fillRect(c.x * trCell, c.y * trCell, trCell + 1, trCell + 1);
  }
}
function animate(dur, fn) {
  return new Promise((res) => {
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.max(0, Math.min(1, (now - t0) / dur));
      fn(p);
      if (p < 1) requestAnimationFrame(step);
      else res();
    };
    requestAnimationFrame(step);
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let trToken = 0;
async function playEncounterTransition(kind, enemy) {
  trToken++;
  prepTransitionGrid();
  trCv.style.display = "block";
  if (reducedMotion) {
    await animate(160, (p) => {
      trCtx.fillStyle = "#05060f";
      trCtx.globalAlpha = p;
      trCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      trCtx.globalAlpha = 1;
    });
    return;
  }
  if (kind === "boss") {
    const w = $("boss-warning");
    $("warn-name").textContent = enemy.name;
    $("warn-silhouette").innerHTML = spriteHTML(enemy.spr, "");
    w.classList.add("show");
    await wait(1700);
    w.classList.remove("show");
  } else if (kind === "trap") {
    flash("white");
    await wait(180);
  } else {
    flash("white");
    await wait(140);
    flash("white");
    await wait(160);
  }
  await animate(kind === "trap" ? 260 : 460, (p) =>
    drawTransition(p, kind === "boss" ? "#14000a" : "#05060f")
  );
}
function revealTransition() {
  if (!trCv || trCv.style.display === "none") return;
  if (reducedMotion) {
    trCv.style.display = "none";
    return;
  }
  const tok = trToken;
  animate(380, (p) => {
    if (tok !== trToken) return;
    const w = window.innerWidth,
      h = window.innerHeight;
    trCtx.clearRect(0, 0, w, h);
    trCtx.fillStyle = "#05060f";
    const n = Math.floor(trOrder.length * (1 - p));
    for (let i = 0; i < n; i++) {
      const c = trOrder[trOrder.length - 1 - i];
      trCtx.fillRect(c.x * trCell, c.y * trCell, trCell + 1, trCell + 1);
    }
  }).then(() => {
    if (tok === trToken) trCv.style.display = "none";
  });
}

// ============================================================
// 11  画面の きりかえ・ステータス表示・ダイアログ
// ============================================================
let screenName = "title";
const reducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function spriteHTML(spr, cls) {
  const crown = spr.crown ? `<span class="spr-crown">👑</span>` : "";
  if (spr.src)
    return `<span class="spr pixel ${cls || ""}"><img src="${
      spr.src
    }" alt="" draggable="false">${crown}</span>`;
  const im = spr.img && IMGS[spr.img];
  if (im && !im.fail)
    return `<span class="spr ${cls || ""}"><img src="${
      im.img.src
    }" alt="" draggable="false" onerror="this.parentNode.classList.add('fb')"><i>${
      spr.emoji
    }</i>${crown}</span>`;
  return `<span class="spr fb ${cls || ""}"><i>${spr.emoji}</i>${crown}</span>`;
}

function showScreen(name) {
  screenName = name;
  for (const id of [
    "title-screen",
    "town-screen",
    "explore-screen",
    "battle-screen"
  ]) {
    $(id).classList.toggle("active", id === name + "-screen");
  }
  $("hud").classList.toggle("show", name === "explore" || name === "battle");
  const app = $("mq-app");
  app.dataset.screen = name;
  if (name === "explore")
    requestAnimationFrame(() => {
      resizeMap();
      miniDirty = true;
    });
  if (name === "battle") requestAnimationFrame(sizeStageCanvases);
  const r = app.getBoundingClientRect();
  if (r.top < -4 || (name !== "town" && r.top > window.innerHeight * 0.35))
    window.scrollBy(0, r.top - 4);
}

function goToTown() {
  stopTimer();
  battle = null;
  if (currentPlayerHp <= 0) currentPlayerHp = playerMaxHp;
  showScreen("town");
  Sound.playBgm("town");
  updateStatus();
  renderStageList();
  renderFacilities();
  townSay("「おかえり！ ゆっくり 休んで いきな！」");
}

// ステータスを 画面に 反映して セーブ
function updateStatus() {
  cleanData();
  const hpPct = (currentPlayerHp / playerMaxHp) * 100;
  const hpCls = hpPct < 25 ? "low" : hpPct < 55 ? "mid" : "";
  const set = (id, v) => {
    const el = $(id);
    if (el) el.textContent = v;
  };
  set("player-level", level);
  set("player-exp", exp);
  set("next-exp", nextExp);
  set("player-hp-value", currentPlayerHp);
  set("max-hp-value", playerMaxHp);
  set("gold-value", gold);
  set("potion-count", potions);
  set("hud-level", level);
  set("hud-hp-text", `${currentPlayerHp}/${playerMaxHp}`);
  set("hud-gold", gold);
  set("hud-potion", potions);
  for (const id of ["hp-fill", "hud-hp-fill"]) {
    const el = $(id);
    if (el) {
      el.style.width = hpPct + "%";
      el.className = hpCls;
    }
  }
  const ef = $("exp-fill");
  if (ef) ef.style.width = Math.min(100, (exp / nextExp) * 100) + "%";
  for (const k of [
    "shizuku",
    "hone",
    "kouseki",
    "maseki",
    "hoshisuna",
    "tsukiishi"
  ])
    set("mat-" + k, materials[k]);
  set("equip-weapon", weaponData[weaponLevel].name);
  set("equip-armor", armorData[armorLevel].name);
  const cl = $("companions-list");
  if (cl)
    cl.innerHTML =
      companions.length > 0
        ? companions
            .map((c) => {
              const m = companionMeta(c);
              return `<span class="mate" title="${m.name}">${spriteHTML(
                m.spr,
                ""
              )}</span>`;
            })
            .join("")
        : `<span class="muted">まだ いないよ</span>`;
  const av = $("status-avatar");
  if (av && !av.dataset.done) {
    av.innerHTML = spriteHTML(SPR.hero, "");
    av.dataset.done = "1";
  }
  if (screenName === "town") renderFacilities();
  saveData();
}

// ---- ダイアログ ----
let modalOnClose = null;
function isModalOpen() {
  return !$("modal").classList.contains("hidden");
}
function openModal(title, html, buttons, onClose) {
  $("modal-title").innerHTML = title;
  $("modal-body").innerHTML = html;
  const bw = $("modal-buttons");
  bw.innerHTML = "";
  (
    buttons || [{ label: "とじる", cls: "btn-gold", onClick: closeModal }]
  ).forEach((b) => {
    const el = document.createElement("button");
    el.className = "btn " + (b.cls || "");
    el.innerHTML = b.label;
    el.onclick = () => {
      Sound.play("select");
      b.onClick();
    };
    bw.appendChild(el);
  });
  modalOnClose = onClose || null;
  $("modal").classList.remove("hidden");
  heldDir = null;
  setTimeout(() => {
    const f = bw.querySelector("button:last-child");
    if (f && !window.matchMedia("(pointer: coarse)").matches) f.focus();
  }, 30);
}
function closeModal() {
  $("modal").classList.add("hidden");
  const f = modalOnClose;
  modalOnClose = null;
  if (f) f();
}

let toastTimer = null;
function toast(text) {
  const t = $("toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---- レベルアップ ----
function showLevelUp() {
  if (!pendingLevelUps) return;
  const n = pendingLevelUps;
  pendingLevelUps = 0;
  const b = $("levelup-banner");
  b.innerHTML = `<div class="lu-title">LEVEL UP!</div><div class="lu-sub">LV ${level} に なった！${
    n > 1 ? `（${n}レベル アップ）` : ""
  }</div><div class="lu-sub2">さいだいHP ${playerMaxHp}　HPが ぜんかいふく！</div>`;
  b.classList.remove("show");
  void b.offsetWidth;
  b.classList.add("show");
  Sound.play("levelup");
  setTimeout(() => b.classList.remove("show"), 2400);
}

// ---- おと ----
function cycleSound() {
  soundMode = soundMode === "all" ? "se" : soundMode === "se" ? "off" : "all";
  Sound.ensure();
  Sound.refresh();
  refreshSoundButton();
  saveData();
  toast(
    soundMode === "all"
      ? "🎵 BGM と こうかおん オン"
      : soundMode === "se"
      ? "🔈 こうかおん だけ"
      : "🔇 おと なし"
  );
  Sound.play("select");
}
function refreshSoundButton() {
  document
    .querySelectorAll(".sound-btn")
    .forEach(
      (b) =>
        (b.textContent =
          soundMode === "all" ? "🎵" : soundMode === "se" ? "🔈" : "🔇")
    );
}

// ============================================================
// 12  はじまりの 町（しせつ・ステージえらび・ずかん・きろく・ふっかつの じゅもん）
// ============================================================
let townSayTimer = null;
function townSay(text) {
  const el = $("shop-message");
  if (!el) return;
  el.textContent = text;
  el.parentNode.classList.remove("pop");
  void el.parentNode.offsetWidth;
  el.parentNode.classList.add("pop");
}

function reqHtml(req) {
  return ["shizuku", "hone", "kouseki", "maseki"]
    .filter((k) => req[k] > 0)
    .map(
      (k) =>
        `<span class="req ${materials[k] >= req[k] ? "ok" : "ng"}">${
          matNames[k]
        }${materials[k]}/${req[k]}</span>`
    )
    .join("");
}

function renderFacilities() {
  const el = $("facility-grid");
  if (!el) return;
  const nW = weaponData[weaponLevel + 1],
    nA = armorData[armorLevel + 1];
  const owned = allCompanionsList.filter((c) => companions.includes(c)).length;
  el.innerHTML = `
    <button class="facility" onclick="stayInn()"><span class="f-icon">🛏️</span><b>やど屋</b><small>HPを ぜんかい（10円）</small></button>
    <button class="facility" onclick="buyPotion()"><span class="f-icon">🌿</span><b>どうぐ屋</b><small>やくそう（30円）</small></button>
    <button class="facility craft" onclick="craftWeapon()"><span class="f-icon">⚔️</span><b>ぶきを きたえる</b>
      <small>${nW ? `つぎ：${nW.name}` : "さいこう の ぶき"}</small>${
    nW ? `<span class="reqs">${reqHtml(nW.req)}</span>` : ""
  }</button>
    <button class="facility craft" onclick="craftArmor()"><span class="f-icon">🛡️</span><b>ぼうぐを きたえる</b>
      <small>${
        nA ? `つぎ：${nA.name}（HP+${nA.hpBonus}）` : "さいこう の ぼうぐ"
      }</small>${
    nA ? `<span class="reqs">${reqHtml(nA.req)}</span>` : ""
  }</button>
    <button class="facility" onclick="playGacha()"><span class="f-icon">🎰</span><b>なかまガチャ</b><small>1回 100円</small></button>
    <button class="facility" onclick="checkTelescope()"><span class="f-icon">🔭</span><b>てんもんだい</b><small>⏳🌙 を こうかん</small></button>
    <button class="facility" onclick="openZukan()"><span class="f-icon">📖</span><b>なかま ずかん</b><small>${owned} / ${
    allCompanionsList.length
  }</small></button>
    <button class="facility" onclick="openRecords()"><span class="f-icon">📊</span><b>がくしゅう きろく</b><small>せいかい ${
      stats.correct
    }もん</small></button>`;
}

// ---- やど屋・どうぐ屋 ----
function stayInn() {
  if (currentPlayerHp === playerMaxHp) {
    townSay("「HPは 満タン みたいだね！」");
    Sound.play("bump");
    return;
  }
  if (gold >= 10) {
    gold -= 10;
    currentPlayerHp = playerMaxHp;
    townSay(`おはよう！ HPが ぜんかいふく したよ！`);
    Sound.play("heal");
    flash("heal");
    updateStatus();
  } else {
    townSay(`お金が たりない みたいだね･･･`);
    Sound.play("bump");
  }
}

function buyPotion() {
  if (gold >= 30) {
    gold -= 30;
    potions++;
    townSay(`「やくそうを 買ったよ！ どうぐ として 使える からね！」`);
    Sound.play("coin");
    updateStatus();
  } else {
    townSay(`お金が たりない みたいだね･･･`);
    Sound.play("bump");
  }
}

// ---- ぶき・ぼうぐ（ひつような そざいは もとの ゲームと 同じ）----
function craftArmor() {
  if (armorLevel >= armorData.length - 1) {
    townSay(`これ以上 ぼうぐ は きたえられないぜ！`);
    return;
  }
  const req = armorData[armorLevel + 1].req;
  if (
    materials.shizuku >= req.shizuku &&
    materials.hone >= req.hone &&
    materials.kouseki >= req.kouseki &&
    materials.maseki >= req.maseki
  ) {
    materials.shizuku -= req.shizuku;
    materials.hone -= req.hone;
    materials.kouseki -= req.kouseki;
    materials.maseki -= req.maseki;
    armorLevel++;
    playerMaxHp = calcMaxHp();
    currentPlayerHp = playerMaxHp;
    townSay(
      `「カンカン…できた！ ${armorData[armorLevel].name} だ！ 最大HPが アップしたぞ！」`
    );
    craftShow(
      "🛡️",
      armorData[armorLevel].name,
      `さいだいHP が ${playerMaxHp} に なった！`
    );
    updateStatus();
  } else {
    townSay(`アイテムが たりない みたいだな。どうくつで 集めてきな！`);
    Sound.play("bump");
  }
}

function craftWeapon() {
  if (weaponLevel >= weaponData.length - 1) {
    townSay(`これ以上 ぶき は きたえられないぜ！`);
    return;
  }
  const req = weaponData[weaponLevel + 1].req;
  if (
    materials.shizuku >= req.shizuku &&
    materials.hone >= req.hone &&
    materials.kouseki >= req.kouseki &&
    materials.maseki >= req.maseki
  ) {
    materials.shizuku -= req.shizuku;
    materials.hone -= req.hone;
    materials.kouseki -= req.kouseki;
    materials.maseki -= req.maseki;
    weaponLevel++;
    townSay(`「カンカン…できた！ ${weaponData[weaponLevel].name} だ！」`);
    craftShow(
      "⚔️",
      weaponData[weaponLevel].name,
      `こうげき力が アップ！ ${
        weaponLevel >= 4 ? "こうげきの えんしゅつも かわるぞ！" : ""
      }`
    );
    updateStatus();
  } else {
    townSay(`アイテムが たりないな。どうくつで 集めてきな！`);
    Sound.play("bump");
  }
}

function craftShow(icon, name, sub) {
  Sound.play("craft");
  openModal(
    "⚒️ かじや",
    `<div class="craft-anim"><div class="anvil">🔨</div><div class="craft-item">${icon}</div></div>
    <p class="craft-name">「カンカン…できた！」<br><b>${name}</b></p><p class="muted">${sub}</p>`
  );
}

// ---- なかまガチャ（かくりつ・ごほうびは もとの ゲームと 同じ）----
function playGacha() {
  if (gold < 100) {
    townSay(`「ガチャは 1回 100円 だよ。お金が たりないね」`);
    Sound.play("bump");
    return;
  }
  gold -= 100;
  updateStatus();
  const r = Math.random();
  let msg, prize, rarity;
  if (r < 0.15) {
    const rare =
      rareCompanions[Math.floor(Math.random() * rareCompanions.length)];
    const meta = companionMeta(rare);
    const rareName = meta.name;
    prize = spriteHTML(meta.spr, "");
    rarity = "rare";
    if (!companions.includes(rare)) {
      companions.push(rare);
      msg = `「大当たり！！ げきレアな ${rareName} が なかまに なった！」`;
    } else {
      gold += 100;
      msg = `「大当たり！…だけど ${rareName} は もう いるね。100円 お返し するよ！」`;
    }
  } else if (r < 0.35) {
    materials.kouseki += 1;
    materials.maseki += 1;
    msg = "「当たり！ レアな アイテム【🔸x1】【🔮x1】が 出た！」";
    prize = `<span class="prize-items">🔸🔮</span>`;
    rarity = "good";
  } else {
    materials.shizuku += 1;
    materials.hone += 1;
    msg = "「アイテム【💧x1】【🦴x1】が 出た！」";
    prize = `<span class="prize-items">💧🦴</span>`;
    rarity = "normal";
  }
  updateStatus();
  Sound.play("gacha");
  openModal(
    "🎰 なかまガチャ",
    `<div class="gacha-stage ${rarity}"><div class="capsule"><span class="cap-top"></span><span class="cap-bottom"></span></div>
    <div class="gacha-prize">${prize}</div></div><p class="gacha-msg">…</p>`,
    [
      {
        label: "もう1回 (100円)",
        cls: "",
        onClick: () => {
          closeModal();
          setTimeout(playGacha, 60);
        }
      },
      { label: "とじる", cls: "btn-gold", onClick: closeModal }
    ]
  );
  setTimeout(() => {
    const st = document.querySelector(".gacha-stage");
    if (!st) return;
    st.classList.add("open");
    document.querySelector(".gacha-msg").textContent = msg;
    Sound.play(rarity === "rare" ? "rare" : "item");
    townSay(msg);
  }, 1000);
}

// ---- てんもんだい（星の そざい ⏳🌙 を こうかん）----
function checkTelescope() {
  townSay("「星が きれい だね！ これで 新しい とびらが 開くかも！」");
  const ex = [
    { id: 0, label: "⏳×3 → 🔸×2", ok: materials.hoshisuna >= 3 },
    { id: 1, label: "🌙×3 → 🔮×1", ok: materials.tsukiishi >= 3 },
    {
      id: 2,
      label: `⏳×2 + 🌙×2 → EXP +${level * 15}`,
      ok: materials.hoshisuna >= 2 && materials.tsukiishi >= 2
    }
  ];
  openModal(
    "🔭 てんもんだい",
    `<div class="telescope-sky">${"✦"
      .repeat(18)
      .split("")
      .map(
        (s, i) =>
          `<i style="left:${(i * 37) % 100}%;top:${
            (i * 53) % 90
          }%;animation-delay:${(i % 6) * 0.3}s">✦</i>`
      )
      .join("")}<span>🔭</span></div>
    <p>「星が きれい だね！ これで 新しい とびらが 開くかも！」</p>
    <p class="muted">⏳ ほしの すな と 🌙 つきの いし は「時こくと 時間」の ダンジョン（ほしぞらの とう）で ひろえるよ。</p>
    <p>いま もっている かず：⏳ <b>${materials.hoshisuna}</b>　🌙 <b>${
      materials.tsukiishi
    }</b></p>
    <div class="exchange-list">${ex
      .map(
        (e) =>
          `<button class="btn ${e.ok ? "btn-purple" : "btn-disabled"}" ${
            e.ok ? "" : "disabled"
          } onclick="starExchange(${e.id})">${e.label}</button>`
      )
      .join("")}</div>`
  );
}
function starExchange(id) {
  if (id === 0 && materials.hoshisuna >= 3) {
    materials.hoshisuna -= 3;
    materials.kouseki += 2;
    toast("🔸 こうせき を 2こ もらった！");
  } else if (id === 1 && materials.tsukiishi >= 3) {
    materials.tsukiishi -= 3;
    materials.maseki += 1;
    toast("🔮 ませき を 1こ もらった！");
  } else if (id === 2 && materials.hoshisuna >= 2 && materials.tsukiishi >= 2) {
    materials.hoshisuna -= 2;
    materials.tsukiishi -= 2;
    exp += level * 15;
    toast(`✨ EXP +${level * 15}！`);
    checkLevelUp();
    if (pendingLevelUps) setTimeout(showLevelUp, 300);
  } else return;
  Sound.play("rare");
  updateStatus();
  closeModal();
  checkTelescope();
}

// ---- ずかん・きろく ----
function openZukan() {
  const html = `<div class="zukan-grid">${allCompanionsList
    .map((c, i) => {
      const has = companions.includes(c),
        m = COMPANION_META[i];
      return `<div class="zukan-cell ${has ? "has" : ""}">${
        has ? spriteHTML(m.spr, "") : `<span class="unknown">？</span>`
      }<small>${has ? m.name : "？？？"}</small></div>`;
    })
    .join(
      ""
    )}</div><p class="muted">モンスターを たおすと なかまに なることが あるよ。ガチャでも 出るよ！<br>なかまは たたかいで ついげき したり、HPを かいふく してくれるよ。</p>`;
  openModal(
    `📖 なかま ずかん（${companions.length} / ${allCompanionsList.length}）`,
    html
  );
}

function openRecords() {
  const total = stats.correct + stats.wrong;
  const acc = total ? Math.round((stats.correct / total) * 100) : 0;
  const rows = UNITS.map((u) => {
    const s = stats.unit[u.no] || { c: 0, t: 0 };
    const a = s.t ? Math.round((s.c / s.t) * 100) : 0;
    const cleared = u.stages.filter((st) => records[st.id]).length;
    return `<div class="rec-row" style="--uc:${u.color}"><span class="rec-icon">${u.icon}</span>
      <div class="rec-main"><div class="rec-title">【${u.no}】${u.title}</div>
      <div class="bar rec-bar"><div style="width:${a}%"></div></div>
      <small>せいかい ${s.c} / ${s.t}もん（${a}%）・クリア ${cleared} / ${u.stages.length}</small></div></div>`;
  }).join("");
  openModal(
    "📊 がくしゅう きろく",
    `<div class="rec-total"><div><b>${stats.correct}</b><small>せいかい</small></div><div><b>${acc}%</b><small>せいかいりつ</small></div>
    <div><b>${stats.monsters}</b><small>たおした モンスター</small></div><div><b>${stats.bosses}</b><small>たおした ボス</small></div></div>${rows}`
  );
}

// ---- ステージ えらび（ぜんぶ いつでも えらべる！）----
function renderStageList() {
  const el = $("dungeon-list");
  if (!el) return;
  el.innerHTML = UNITS.map(
    (u) => `
    <section class="unit-card" style="--uc:${u.color}">
      <header><span class="unit-icon">${u.icon}</span><h3><small>【${
      u.no
    }】</small>${u.title}</h3></header>
      <div class="stage-grid">${u.stages
        .map((s) => {
          const r = records[s.id];
          const st = r ? r.stars : 0;
          return `<button class="stage-btn${s.special ? " special" : ""}${
            r ? " cleared" : ""
          }" onclick="tryStartGame('${s.id}')">
          <span class="st-label">${s.label}</span>
          <span class="st-meta"><span class="st-theme">${
            THEMES[s.theme].name
          }</span><span class="st-stars" aria-label="ほし ${st}こ">${"★".repeat(
            st
          )}<i>${"★".repeat(3 - st)}</i></span></span>
        </button>`;
        })
        .join("")}</div>
    </section>`
  ).join("");
}

function tryStartGame(id) {
  const s = ALL_STAGES.find((x) => x.id === id);
  if (!s) return;
  Sound.ensure();
  Sound.play("select");
  startDungeon(s);
}

// ---- ふっかつの じゅもん（もとの ゲームと 同じ しくみ → 前の じゅもんも つかえる）----
function exportData() {
  saveData();
  let cValue = 0;
  for (let i = 0; i < allCompanionsList.length; i++) {
    if (companions.includes(allCompanionsList[i])) {
      cValue += Math.pow(2, i);
    }
  }

  let n = 0;
  n += Math.min(weaponLevel, 15);
  n += Math.min(armorLevel, 15) * 16;
  n += Math.min(level, 127) * 256;
  n += Math.min(potions, 7) * 32768;
  n += Math.min(gold, 1023) * 262144;
  n += cValue * 268435456;

  let pwd = "";
  let temp = n;
  for (let i = 0; i < 8; i++) {
    let mod = temp % 64;
    pwd += PWD_CHARS[mod];
    temp = Math.floor(temp / 64);
  }

  let displayStr = pwd.slice(0, 4) + " " + pwd.slice(4, 8);
  document.getElementById("password-display").innerText = displayStr;
  Sound.play("rare");
  openModal(
    "📜 ふっかつの じゅもん",
    `<p>ふっかつのじゅもん を 作成しました！</p><div class="pw-big">${displayStr}</div><p>わすれないように ノートに メモしておいてね！</p>`
  );
}

function importData() {
  let ta = document.getElementById("backup-input");
  let str = ta.value.replace(/\s+/g, "").trim();
  if (str.length !== 8) {
    openModal(
      "📜 ふっかつの じゅもん",
      "<p>じゅもんは 8文字の ひらがな です。かくにんしてね！</p>"
    );
    return;
  }

  let n = 0;
  for (let i = 7; i >= 0; i--) {
    let char = str[i];
    let idx = PWD_CHARS.indexOf(char);
    if (idx === -1 || idx >= 64) {
      openModal(
        "📜 ふっかつの じゅもん",
        "<p>つかえない文字が あります。ひらがな を かくにんしてね。</p>"
      );
      return;
    }
    n = n * 64 + idx;
  }

  let wl = n % 16;
  n = Math.floor(n / 16);
  let al = n % 16;
  n = Math.floor(n / 16);
  let lv = n % 128;
  n = Math.floor(n / 128);
  let pt = n % 8;
  n = Math.floor(n / 8);
  let gld = n % 1024;
  n = Math.floor(n / 1024);
  let cmpFlag = n;

  weaponLevel = Math.min(wl, weaponData.length - 1);
  armorLevel = Math.min(al, armorData.length - 1);
  level = Math.max(1, lv);
  potions = pt;
  gold = gld;

  companions = [];
  for (let i = 0; i < allCompanionsList.length; i++) {
    if ((cmpFlag & Math.pow(2, i)) !== 0) {
      companions.push(allCompanionsList[i]);
    }
  }

  exp = 0;
  nextExp = 10;
  for (let i = 1; i < level; i++) {
    nextExp = Math.floor(nextExp * 1.5);
  }
  cleanData();
  playerMaxHp = calcMaxHp();
  currentPlayerHp = playerMaxHp;
  materials = {
    shizuku: 0,
    hone: 0,
    kouseki: 0,
    maseki: 0,
    hoshisuna: 0,
    tsukiishi: 0
  };

  saveData();
  updateStatus();
  ta.value = "";
  document.getElementById("password-display").innerText = "--------";
  Sound.play("levelup");
  openModal(
    "📜 ふっかつの じゅもん",
    `<p>ふっかつのじゅもん が となえられた！<br>データが もとに もどったよ！</p><p class="pw-result">LV <b>${level}</b>　💰 <b>${gold}</b>円　なかま <b>${companions.length}</b>人</p>`
  );
}

function resetData() {
  openModal(
    "⚠️ データを けす",
    "<p>本当に データを けして 最初から はじめますか？<br><small>（ふっかつの じゅもんを メモしておくと もどせるよ）</small></p>",
    [
      { label: "やめる", cls: "btn-gold", onClick: closeModal },
      {
        label: "けす",
        cls: "btn-danger",
        onClick: () => {
          SAVE_KEYS.forEach(lsDel);
          location.reload();
        }
      }
    ]
  );
}

// ============================================================
// 13  タイトル画面 と 町の けしき
// ============================================================
let titleCv = null,
  titleCtx = null,
  titleStars = [],
  shooting = null;
let townCv = null,
  townCtx = null,
  townClouds = [];

function initScenes() {
  titleCv = $("title-canvas");
  titleCtx = titleCv.getContext("2d");
  townCv = $("town-canvas");
  townCtx = townCv.getContext("2d");
  const R = mulberry32(42);
  for (let i = 0; i < 120; i++)
    titleStars.push({
      x: R(),
      y: R() * 0.7,
      s: R() < 0.15 ? 2 : 1,
      ph: R() * 6
    });
  for (let i = 0; i < 4; i++)
    townClouds.push({
      x: R(),
      y: 0.1 + R() * 0.25,
      s: 0.6 + R() * 0.6,
      v: 0.004 + R() * 0.006
    });
}

function fitCanvas(cv) {
  const w = cv.clientWidth,
    h = cv.clientHeight,
    d = Math.min(2, window.devicePixelRatio || 1);
  if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) {
    cv.width = Math.round(w * d);
    cv.height = Math.round(h * d);
  }
  const g = cv.getContext("2d");
  g.setTransform(d, 0, 0, d, 0, 0);
  return [g, w, h];
}

function renderTitle(now) {
  const [g, w, h] = fitCanvas(titleCv);
  if (!w) return;
  vgrad(g, w, 0, h, ["#070b2e", "#1b1a5c", "#4a2d7a", "#b0577a"]);
  for (const s of titleStars) {
    g.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(now / 900 + s.ph));
    g.fillStyle = "#fff";
    g.fillRect(s.x * w, s.y * h, s.s, s.s);
  }
  g.globalAlpha = 1;
  if (!shooting && Math.random() < 0.006)
    shooting = {
      x: Math.random() * w * 0.7 + w * 0.2,
      y: Math.random() * h * 0.25,
      t0: now
    };
  if (shooting) {
    const k = (now - shooting.t0) / 700;
    if (k > 1) shooting = null;
    else {
      const x = shooting.x - k * 160,
        y = shooting.y + k * 90;
      const gr = g.createLinearGradient(x, y, x + 60, y - 34);
      gr.addColorStop(0, "rgba(255,255,255,0.95)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.strokeStyle = gr;
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + 60, y - 34);
      g.stroke();
    }
  }
  // おしろ と 山
  const base = h * 0.78;
  ridge(g, w, h, base - 40, 26, 0.008, 1.2, "#2a1d55");
  g.fillStyle = "#170f33";
  const cx = w * 0.74,
    cw = Math.min(150, w * 0.32);
  g.fillRect(cx - cw / 2, base - 120, cw, 120);
  for (let i = 0; i < 3; i++) {
    const tx = cx - cw / 2 + i * (cw / 2) - 8;
    g.fillRect(tx, base - 160 - (i === 1 ? 30 : 0), 22, 60);
    g.beginPath();
    g.moveTo(tx - 4, base - 160 - (i === 1 ? 30 : 0));
    g.lineTo(tx + 11, base - 190 - (i === 1 ? 30 : 0));
    g.lineTo(tx + 26, base - 160 - (i === 1 ? 30 : 0));
    g.fill();
  }
  for (let i = 0; i < 6; i++) {
    g.fillStyle = Math.sin(now / 400 + i * 1.7) > -0.3 ? "#ffd54f" : "#a07a2a";
    g.fillRect(
      cx - cw / 2 + 14 + (i * (cw - 28)) / 5,
      base - 90 + (i % 2) * 30,
      6,
      10
    );
  }
  ridge(g, w, h, base, 14, 0.012, 3.2, "#0d0a24");
}

function skyByTime() {
  const hr = new Date().getHours();
  if (hr >= 5 && hr < 9)
    return { sky: ["#ffb38a", "#ffd9a8", "#bfe6ff"], night: false };
  if (hr >= 9 && hr < 16)
    return { sky: ["#4fb0f0", "#8fd0ff", "#d8f2ff"], night: false };
  if (hr >= 16 && hr < 19)
    return { sky: ["#3c3a7a", "#e0708a", "#ffb36b"], night: false };
  return { sky: ["#070b2e", "#18205e", "#34307a"], night: true };
}

function renderTown(now) {
  if (!townCv) return;
  const [g, w, h] = fitCanvas(townCv);
  if (!w) return;
  const tod = skyByTime();
  vgrad(g, w, 0, h, tod.sky);
  if (tod.night)
    for (const s of titleStars.slice(0, 50)) {
      g.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(now / 900 + s.ph));
      g.fillStyle = "#fff";
      g.fillRect(s.x * w, s.y * h * 0.6, 1, 1);
    }
  g.globalAlpha = 1;
  for (const c of townClouds) {
    c.x += c.v / 60;
    if (c.x > 1.2) c.x = -0.2;
    g.fillStyle = tod.night
      ? "rgba(200,200,255,0.18)"
      : "rgba(255,255,255,0.85)";
    const x = c.x * w,
      y = c.y * h,
      s = 20 * c.s;
    for (let k = 0; k < 3; k++) {
      g.beginPath();
      g.ellipse(x + k * s * 0.8, y + (k % 2) * 3, s * 0.7, s * 0.4, 0, 0, 7);
      g.fill();
    }
  }
  ridge(g, w, h, h * 0.62, 10, 0.014, 1, tod.night ? "#1d3a2a" : "#7cbf62");
  const ground = h * 0.74;
  // じめん（ドット絵の 草）
  const ts = buildTileset("grass");
  g.imageSmoothingEnabled = false;
  const T = 24;
  for (let x = 0; x < w; x += T)
    for (let y = ground; y < h; y += T)
      g.drawImage(ts.floor[(x / T + y / T) % 6 | 0], x, y, T, T);
  g.fillStyle = tod.night ? "rgba(5,8,40,0.45)" : "rgba(0,0,0,0)";
  g.fillRect(0, ground, w, h - ground);
  // みち
  g.fillStyle = "#d9c08a";
  g.fillRect(0, ground + T * 0.6, w, T * 0.8);
  g.fillStyle = "#c4a96f";
  for (let x = 0; x < w; x += 12)
    g.fillRect(x, ground + T * 0.6 + ((x / 12) % 2) * 6, 6, 3);
  // いえ
  const house = (x, wd, ht, roof) => {
    const y = ground + 4;
    g.fillStyle = "#f2e2c0";
    g.fillRect(x, y - ht, wd, ht);
    g.fillStyle = "#c9b48c";
    g.fillRect(x, y - 4, wd, 4);
    g.fillStyle = roof;
    g.beginPath();
    g.moveTo(x - 6, y - ht);
    g.lineTo(x + wd / 2, y - ht - wd * 0.42);
    g.lineTo(x + wd + 6, y - ht);
    g.fill();
    g.fillStyle = "rgba(0,0,0,0.18)";
    g.beginPath();
    g.moveTo(x + wd / 2, y - ht - wd * 0.42);
    g.lineTo(x + wd + 6, y - ht);
    g.lineTo(x + wd / 2, y - ht);
    g.fill();
    g.fillStyle = "#6b4423";
    g.fillRect(x + wd / 2 - 6, y - 20, 12, 20);
    g.fillStyle = tod.night ? "#ffd54f" : "#8fd0ff";
    g.fillRect(x + 6, y - ht + 10, 10, 9);
    g.fillRect(x + wd - 16, y - ht + 10, 10, 9);
  };
  const unit = Math.max(70, w / 6);
  house(unit * 0.25, 58, 44, "#c0392b", "🛏️");
  house(unit * 1.45, 50, 40, "#2e86c1", "🌿");
  house(w - unit * 1.9, 54, 42, "#7d3c98", "⚒️");
  house(w - unit * 0.85, 46, 38, "#d68910", "🎰");
  // えんとつの けむり
  for (let i = 0; i < 3; i++) {
    const k = (now / 1600 + i / 3) % 1;
    g.fillStyle = `rgba(255,255,255,${0.5 * (1 - k)})`;
    g.beginPath();
    g.arc(unit * 0.25 + 44 + k * 10, ground - 70 - k * 28, 4 + k * 6, 0, 7);
    g.fill();
  }
  // ふんすい
  const fx = w / 2,
    fy = ground + 6;
  g.fillStyle = "#8a96a0";
  g.beginPath();
  g.ellipse(fx, fy, 30, 10, 0, 0, 7);
  g.fill();
  g.fillStyle = "#4fb3ff";
  g.beginPath();
  g.ellipse(fx, fy - 2, 25, 7, 0, 0, 7);
  g.fill();
  const jh = 22 + Math.sin(now / 200) * 3;
  g.fillStyle = "rgba(190,235,255,0.9)";
  g.fillRect(fx - 2, fy - 2 - jh, 4, jh);
  for (let i = 0; i < 6; i++) {
    const a = now / 260 + i;
    g.fillStyle = "#e6f7ff";
    g.fillRect(
      fx + Math.cos(a) * 16,
      fy - 6 - Math.abs(Math.sin(a)) * jh * 0.6,
      2,
      2
    );
  }
  // ゆうしゃ
  const bob = Math.sin(now / 400) * 1.5;
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(fx - 58, ground + 20, 14, 4, 0, 0, 7);
  g.fill();
  drawSprite(g, SPR.hero, fx - 58, ground + 20 + bob, 50, false);
  companions.slice(-2).forEach((c, i) => {
    const m = companionMeta(c);
    g.fillStyle = "rgba(0,0,0,0.3)";
    g.beginPath();
    g.ellipse(fx - 96 - i * 30, ground + 22, 10, 3, 0, 0, 7);
    g.fill();
    drawSprite(
      g,
      m.spr,
      fx - 96 - i * 30,
      ground + 22 + Math.sin(now / 300 + i) * 1.5,
      30,
      false
    );
  });
}

// ============================================================
// 14  スタート
// ============================================================
function frame(now) {
  requestAnimationFrame(frame);
  try {
    if (screenName === "explore") renderMap(now);
    else if (screenName === "battle") renderBattleFx(now);
    else if (screenName === "title") renderTitle(now);
    else if (screenName === "town") renderTown(now);
  } catch (e) {
    if (!frame.warned) {
      frame.warned = true;
      console.error(e);
    }
  }
}

function startGameFromTitle(mode) {
  soundMode = mode === "off" ? "off" : soundMode === "se" ? "se" : "all";
  Sound.ensure();
  refreshSoundButton();
  saveData();
  Sound.play("select");
  goToTown();
}

function boot() {
  DPR = Math.min(3, window.devicePixelRatio || 1);
  loadImages();
  loadData();
  initMapCanvas();
  initFx();
  initScenes();
  setupExploreControls();
  setupBattleInputs();
  refreshSoundButton();
  renderStageList();
  renderFacilities();
  updateStatus();
  $("title-hero").innerHTML = spriteHTML(SPR.hero, "");
  $("title-count").textContent = ALL_STAGES.length;
  if (hasSaveData())
    $(
      "title-save"
    ).innerHTML = `LV <b>${level}</b> の ゆうしゃが まっているよ！`;
  showScreen("title");
  Sound.playBgm("title");
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) closeModal();
  });
  $("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });
  window.addEventListener("resize", () => {
    if (screenName === "explore") resizeMap();
    if (screenName === "battle") {
      sizeStageCanvases();
      if (battle) paintBattleBackground();
    }
  });
  // さいしょに さわった ときに おとを ON（ブラウザの きまり）
  const unlock = () => {
    Sound.ensure();
    Sound.refresh();
  };
  document.addEventListener("pointerdown", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });
  requestAnimationFrame(frame);
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", boot);
else boot();