let currentNum1 = 0; let currentNum2 = 0;
let currentAnswer = 0; 
let currentRem = 0; 
let stageMin = 1; let stageMax = 9;
let stageType = "kuku"; 

let level = 1; let exp = 0; let nextExp = 10;
let gold = 0; let playerMaxHp = 5; let currentPlayerHp = 5; 
let weaponLevel = 0; let armorLevel = 0;
let potions = 0; 

let isHardMode = false; let isTrapEncounter = false; 
let isBossBattle = false; let isMimic = false;
let companions = []; let currentCombo = 0; 

let battleTimer = null; 

let materials = { shizuku: 0, hone: 0, kouseki: 0, maseki: 0, hoshisuna: 0, tsukiishi: 0 };
const matNames = { shizuku: "💧", hone: "🦴", kouseki: "🔸", maseki: "🔮", hoshisuna: "⏳", tsukiishi: "🌙" };

const unicornImg = '<img src="https://assets.st-note.com/img/1772717157-GtXJnFpu6siA9KL1VzdxfDOI.png" title="ユニコーン">';
const rareCompanions = [unicornImg, "🦊", "🤖", "👼", "🌟", "🦄", "🦍", "🐕", "🦖", "🐯", "🐮", "🐘", "🦚", "🦎", "🐠"];

const allCompanionsList = [
  '<img src="https://assets.st-note.com/img/1772716673-Siqp1vmwzbGXTeft39UNAlak.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
  '<img src="https://assets.st-note.com/img/1772716684-n8GKJt3TveugpY0hd415Rczx.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
  '<img src="https://assets.st-note.com/img/1772716438-8LIRbVviCus0HExf1lUKM6aQ.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
  '👿', 
  '<img src="https://assets.st-note.com/img/1772718044-dse6U2pFv8PnioBVKMayJqZ4.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">',
  unicornImg, "🦊", "🤖", "👼", "🌟", "🦄", "🦍", "🐕", "🦖", "🐯", "🐮", "🐘", "🦚", "🦎", "🐠"
];

const weaponData = [
  { name: "木のえだ", req: null, reqText: "" },
  { name: "どうの つるぎ", req: {shizuku: 5, hone: 2, kouseki: 0, maseki: 0}, reqText: "(💧x5, 🦴x2)" },
  { name: "てつの けん", req: {shizuku: 5, hone: 5, kouseki: 1, maseki: 0}, reqText: "(💧x5, 🦴x5, 🔸x1)" },
  { name: "はがねの けん", req: {shizuku: 10, hone: 10, kouseki: 3, maseki: 0}, reqText: "(💧x10, 🦴x10, 🔸x3)" },
  { name: "ほのおの けん", req: {shizuku: 0, hone: 15, kouseki: 8, maseki: 2}, reqText: "(🦴x15, 🔸x8, 🔮x2)" },
  { name: "でんせつの けん", req: {shizuku: 0, hone: 0, kouseki: 15, maseki: 5}, reqText: "(🔸x15, 🔮x5)" },
  { name: "ゆうしゃの けん", req: {shizuku: 0, hone: 0, kouseki: 30, maseki: 10}, reqText: "(🔸x30, 🔮x10)" },
  { name: "けんじゃの つえ", req: {shizuku: 0, hone: 0, kouseki: 50, maseki: 20}, reqText: "(🔸x50, 🔮x20)" },
  { name: "神の やり", req: {shizuku: 0, hone: 0, kouseki: 80, maseki: 40}, reqText: "(🔸x80, 🔮x40)" },
  { name: "そうぞう神の けん", req: {shizuku: 0, hone: 0, kouseki: 120, maseki: 80}, reqText: "(🔸x120, 🔮x80)" }
];

const armorData = [
  { name: "ふつうの ふく", hpBonus: 0, req: null, reqText: "" },
  { name: "かわの たて", hpBonus: 3, req: {shizuku: 5, hone: 2, kouseki: 0, maseki: 0}, reqText: "(💧x5, 🦴x2)" },
  { name: "てつの たて", hpBonus: 6, req: {shizuku: 5, hone: 5, kouseki: 1, maseki: 0}, reqText: "(💧x5, 🦴x5, 🔸x1)" },
  { name: "はがねの よろい", hpBonus: 10, req: {shizuku: 10, hone: 10, kouseki: 3, maseki: 0}, reqText: "(💧x10, 🦴x10, 🔸x3)" },
  { name: "ドラゴンメイル", hpBonus: 15, req: {shizuku: 0, hone: 15, kouseki: 8, maseki: 2}, reqText: "(🦴x15, 🔸x8, 🔮x2)" },
  { name: "ひかりの よろい", hpBonus: 22, req: {shizuku: 0, hone: 0, kouseki: 15, maseki: 5}, reqText: "(🔸x15, 🔮x5)" },
  { name: "ゆうしゃの たて", hpBonus: 30, req: {shizuku: 0, hone: 0, kouseki: 30, maseki: 10}, reqText: "(🔸x30, 🔮x10)" },
  { name: "ミスリルの たて", hpBonus: 40, req: {shizuku: 0, hone: 0, kouseki: 50, maseki: 20}, reqText: "(🔸x50, 🔮x20)" },
  { name: "オリハルコンよろい", hpBonus: 55, req: {shizuku: 0, hone: 0, kouseki: 80, maseki: 40}, reqText: "(🔸x80, 🔮x40)" },
  { name: "そうぞう神の ころも", hpBonus: 80, req: {shizuku: 0, hone: 0, kouseki: 120, maseki: 80}, reqText: "(🔸x120, 🔮x80)" }
];

const add3x3Carry1List = [
  [208,139], [436,345], [305,187], [408,546], [314,278], [328,462], [506,418], [757,238], [127,346], [201,609],
  [237,157], [324,468], [173,717], [406,285], [257,528], [528,259], [635,126], [326,568], [269,719], [312,439],
  [467,413], [328,605], [409,259], [626,357], [153,409], [169,423], [648,327], [415,279], [148,735], [317,455],
  [438,347], [519,145], [384,509], [709,165], [306,489], [206,385], [227,653], [518,172], [419,563], [728,118],
  [325,136], [258,216], [418,249], [154,137], [463,429], [535,217], [377,214], [129,532], [284,108], [156,527],
  [239,112], [313,578], [437,315], [617,243], [265,407], [389,202], [318,633], [149,223], [318,368], [718,175],
  [219,476], [234,307], [787,107], [261,319], [109,608], [128,334], [526,416], [119,674], [115,448], [309,351]
];

const add3x3Carry10sList = [
  [475,382], [391,535], [252,583], [463,272], [285,472], [593,291], [156,361], [263,282], [572,135], [160,382],
  [132,385], [361,597], [640,172], [225,383], [191,762], [281,563], [753,164], [437,481], [392,233], [180,453],
  [295,372], [362,575], [691,165], [476,443], [680,255], [471,338], [123,780], [532,292], [348,380], [655,293],
  [490,393], [675,152], [570,369], [283,573], [312,496], [335,381], [274,673], [521,182], [353,492], [798,171],
  [395,380], [242,592], [142,781], [374,493], [153,650], [441,287], [375,462], [262,173], [384,594], [130,479],
  [396,273], [470,388], [161,672], [461,298], [370,482], [799,190], [265,362], [677,141], [294,513], [183,742],
  [399,460], [183,275], [582,151], [332,491], [193,560], [290,527], [241,662], [150,352], [170,773], [480,259]
];

const add3x3Carry2List = [
  [154,496], [528,294], [387,393], [468,186], [255,357], [594,206], [629,283], [197,786], [549,265], [682,178],
  [234,266], [149,586], [694,239], [435,287], [378,196], [237,695], [389,336], [295,465], [167,758], [584,367],
  [354,476], [239,593], [147,785], [199,475], [273,697], [168,735], [397,368], [687,159], [356,274], [188,726],
  [497,315], [145,779], [398,552], [177,643], [458,275], [589,157], [296,645], [368,443], [179,738], [387,375],
  [376,264], [185,239], [546,255], [468,393], [254,278], [452,269], [367,153], [659,253], [532,378], [285,466],
  [226,284], [394,127], [478,258], [587,136], [395,257], [567,345], [135,765], [259,653], [483,318], [798,182],
  [158,745], [319,281], [538,164], [358,267], [523,279], [376,256], [195,647], [386,579], [489,152], [773,198]
];

const add3x3Over1000List = [
  [711,438], [724,535], [634,612], [913,263], [774,555], [586,472], [945,273], [285,715], [445,927], [953,278],
  [819,575], [635,421], [287,937], [594,708], [333,678], [897,748], [817,253], [563,592], [124,876], [567,442],
  [487,756], [912,345], [268,853], [610,509], [495,912], [536,527], [110,890], [924,236], [783,357], [672,514],
  [631,462], [394,840], [901,278], [365,705], [623,596], [676,324], [185,915], [547,663], [851,432], [211,789],
  [304,728], [283,862], [999,123], [578,619], [841,457], [532,523], [496,647], [810,890], [451,986], [765,235]
];

const addLargeList = [
  [3126,4253], [2341,1859], [6986,2103], [5865,1359], [6493,2562], [2307,4958], [3476,2048], [4538,1226],
  [1192,2960], [3765,5192], [2649,6273], [114,8931], [8972,651], [685,9314], [1058,7626], [2510,4832],
  [1615,794], [7352,678], [3246,6587], [3065,5935], [1048,8516], [2860,4282], [9621,279], [1907,7853],
  [6979,2253], [8031,969], [3515,5420], [4182,5717], [1872,7128], [3692,4387], [2457,6643], [1234,8765],
  [5928,3817], [537,7240], [6375,2989], [707,8293], [5258,4063], [2942,1739], [9531,426], [3864,4987]
];

const sub3x3Borrow1List = [
  [495,237], [574,218], [720,413], [591,325], [693,265], [432,126], [363,114], [761,318], [273,125], [592,328],
  [587,439], [853,624], [372,148], [731,517], [543,234], [921,313], [678,349], [493,258], [876,427], [382,125],
  [782,654], [561,123], [643,328], [365,127], [851,332], [471,239], [864,528], [380,135], [552,243], [953,327],
  [357,138], [632,214], [561,143], [426,217], [773,546], [555,238], [833,515], [395,167], [754,439], [932,617],
  [585,356], [272,153], [724,406], [663,348], [538,219], [741,423], [392,165], [895,347], [463,156], [987,458]
];

const sub3x3Borrow2List = [
  [765, 567], [938, 479], [510, 255], [973, 398], [356, 167], [532, 267], [444, 245], [815, 427], [642, 289], [922, 777],
  [875, 596], [432, 295], [323, 178], [712, 354], [560, 293], [753, 357], [531, 255], [843, 665], [678, 499], [987, 789],
  [960, 367], [576, 289], [642, 355], [421, 256], [733, 567], [611, 278], [864, 578], [523, 128], [910, 372], [345, 179],
  [412, 239], [321, 177], [511, 222], [730, 252], [834, 569], [390, 194], [988, 389], [714, 525], [630, 156], [516, 289]
];

// ★今回追加したデータ
const subLargeList = [
  [7325, 4873], [3042, 1250], [5505, 2857], [8413, 1298], [6582, 2756], [4631, 1356], [9876, 6789], [3000, 1987], [6214, 3869], [7000, 3667],
  [7192, 4985], [3280, 1397], [6321, 2569], [4860, 1795], [5703, 1136], [3516, 1726], [8357, 3978], [9135, 1278], [7654, 4567], [3000, 1457],
  [3405, 1035], [9312, 3658], [5137, 1273], [4723, 1678], [6000, 2547], [5846, 2878], [8903, 3905], [3151, 1346], [7035, 2489], [8212, 5990],
  [9010, 1753], [4895, 2796], [3000, 1927], [7070, 1717], [6721, 2023], [7632, 3579], [5347, 2895], [8125, 2378], [5000, 3766], [9713, 6905],
  [7516, 2483], [5012, 2483], [3762, 1483], [6305, 1748], [3925, 2639], [3007, 1593], [4175, 1089], [7865, 2588], [8642, 3149], [9000, 4951]
];

const hissan2x2List = [
  [52, 87], [79, 26], [98, 54], [15, 73], [72, 97], [64, 25], [51, 19], [39, 58], [64, 45], [48, 32],
  [48, 57], [55, 75], [71, 83], [93, 32], [32, 54], [24, 76], [73, 41], [94, 23], [56, 95], [83, 42],
  [27, 42], [39, 17], [97, 29], [40, 95], [58, 73], [62, 68], [85, 74], [48, 23], [73, 56], [76, 38],
  [86, 25], [50, 38], [72, 87], [97, 18], [85, 62], [64, 44], [93, 83], [24, 51], [31, 49], [39, 76],
  [42, 73], [14, 28], [37, 60], [86, 51], [71, 76], [41, 59], [59, 17], [53, 82], [28, 39], [85, 95]
];

const timeCalcList = [
  { time: "午前9時30分", offset: "40分前", ans: 850 }, { time: "午前9時30分", offset: "35分後", ans: 1005 },
  { time: "午前11時25分", offset: "40分前", ans: 1045 }, { time: "午前11時25分", offset: "50分後", ans: 1215 },
  { time: "午後5時40分", offset: "55分前", ans: 445 }, { time: "午後5時40分", offset: "30分後", ans: 610 },
  { time: "午前5時35分", offset: "45分前", ans: 450 }, { time: "午前5時35分", offset: "30分後", ans: 605 },
  { time: "午前10時20分", offset: "35分前", ans: 945 }, { time: "午前10時20分", offset: "55分後", ans: 1115 },
  { time: "午後7時15分", offset: "50分前", ans: 625 }, { time: "午後7時15分", offset: "55分後", ans: 810 },
  { time: "午前4時15分", offset: "30分前", ans: 345 }, { time: "午前4時15分", offset: "50分後", ans: 505 },
  { time: "午後3時30分", offset: "45分前", ans: 245 }, { time: "午後3時30分", offset: "35分後", ans: 405 },
  { time: "午後8時45分", offset: "50分前", ans: 755 }, { time: "午後8時45分", offset: "25分後", ans: 910 },
  { time: "午前9時20分", offset: "25分前", ans: 855 }, { time: "午前9時20分", offset: "50分後", ans: 1010 },
  { time: "午前10時50分", offset: "55分前", ans: 955 }, { time: "午前10時50分", offset: "25分後", ans: 1115 },
  { time: "午後8時45分", offset: "55分前", ans: 750 }, { time: "午後8時45分", offset: "15分後", ans: 900 },
  { time: "午前8時30分", offset: "40分前", ans: 750 }, { time: "午前8時30分", offset: "35分後", ans: 905 },
  { time: "午後5時15分", offset: "20分前", ans: 455 }, { time: "午後5時15分", offset: "55分後", ans: 610 },
  { time: "午後10時20分", offset: "30分前", ans: 950 }, { time: "午後10時20分", offset: "40分後", ans: 1100 },
  { time: "午前7時20分", offset: "25分前", ans: 655 }, { time: "午前7時20分", offset: "50分後", ans: 810 },
  { time: "午前9時15分", offset: "25分前", ans: 850 }, { time: "午前9時15分", offset: "45分後", ans: 1000 },
  { time: "午後2時40分", offset: "45分前", ans: 155 }, { time: "午後2時40分", offset: "30分後", ans: 310 },
  { time: "午前4時35分", offset: "40分前", ans: 355 }, { time: "午前4時35分", offset: "35分後", ans: 510 },
  { time: "午前8時40分", offset: "40分前", ans: 800 }, { time: "午前8時40分", offset: "30分後", ans: 910 },
  { time: "午後3時25分", offset: "30分前", ans: 255 }, { time: "午後3時25分", offset: "45分後", ans: 410 }
];

const timeCalcMinutesList = [
  {q: "10分 ＋ 20分 ＝ ", a: 30}, {q: "60分 － 10分 ＝ ", a: 50},
  {q: "50分 － 30分 ＝ ", a: 20}, {q: "23分 ＋ 25分 ＝ ", a: 48},
  {q: "15分 ＋ 15分 ＝ ", a: 30}, {q: "35分 － 16分 ＝ ", a: 19},
  {q: "20分 ＋ 30分 ＝ ", a: 50}, {q: "40分 － 12分 ＝ ", a: 28},
  {q: "40分 － 10分 ＝ ", a: 30}, {q: "23分 ＋ 17分 ＝ ", a: 40},
  {q: "20分 ＋ 30分 ＝ ", a: 50}, {q: "60分 － 13分 ＝ ", a: 47},
  {q: "14分 ＋ 22分 ＝ ", a: 36}, {q: "55分 － 32分 ＝ ", a: 23},
  {q: "19分 － 7分 ＝ ", a: 12}, {q: "24分 ＋ 13分 ＝ ", a: 37},
  {q: "29分 ＋ 12分 ＝ ", a: 41}, {q: "50分 － 19分 ＝ ", a: 31},
  {q: "31分 ＋ 21分 ＝ ", a: 52}, {q: "25分 ＋ 35分 ＝ ", a: 60},
  {q: "14分 ＋ 17分 ＝ ", a: 31}, {q: "28分 ＋ 12分 ＝ ", a: 40},
  {q: "29分 － 19分 ＝ ", a: 10}, {q: "36分 － 7分 ＝ ", a: 29},
  {q: "51分 － 13分 ＝ ", a: 38}, {q: "37分 － 18分 ＝ ", a: 19},
  {q: "30分 ＋ 15分 ＝ ", a: 45}, {q: "22分 ＋ 28分 ＝ ", a: 50},
  {q: "45分 － 12分 ＝ ", a: 33}, {q: "56分 － 34分 ＝ ", a: 22},
  {q: "36分 ＋ 14分 ＝ ", a: 50}, {q: "57分 － 41分 ＝ ", a: 16},
  {q: "21分 － 9分 ＝ ", a: 12}, {q: "26分 ＋ 32分 ＝ ", a: 58},
  {q: "25分 ＋ 18分 ＝ ", a: 43}, {q: "33分 ＋ 27分 ＝ ", a: 60},
  {q: "7分 ＋ 48分 ＝ ", a: 55}, {q: "49分 ＋ 11分 ＝ ", a: 60},
  {q: "42分 － 13分 ＝ ", a: 29}, {q: "60分 － 53分 ＝ ", a: 7},
  {q: "50分 － 10分 ＝ ", a: 40}, {q: "47分 － 29分 ＝ ", a: 18},
  {q: "30分 － 12分 ＝ ", a: 18}, {q: "53分 ＋ 7分 ＝ ", a: 60},
  {q: "45分 ＋ 15分 ＝ ", a: 60}, {q: "23分 ＋ 32分 ＝ ", a: 55},
  {q: "18分 ＋ 34分 ＝ ", a: 52}, {q: "55分 － 16分 ＝ ", a: 39},
  {q: "60分 － 25分 ＝ ", a: 35}, {q: "38分 ＋ 11分 ＝ ", a: 49},
  {q: "49分 － 24分 ＝ ", a: 25}, {q: "26分 ＋ 21分 ＝ ", a: 47},
  {q: "13分 ＋ 17分 ＝ ", a: 30}, {q: "5分 ＋ 55分 ＝ ", a: 60},
  {q: "60分 － 15分 ＝ ", a: 45}, {q: "58分 － 34分 ＝ ", a: 24},
  {q: "22分 ＋ 38分 ＝ ", a: 60}, {q: "31分 ＋ 17分 ＝ ", a: 48},
  {q: "41分 ＋ 9分 ＝ ", a: 50}, {q: "39分 ＋ 8分 ＝ ", a: 47}
];

const timeConversionList = [
  {q: "1分8秒 ＝ ", a: 68}, {q: "1分11秒 ＝ ", a: 71},
  {q: "2分 ＝ ", a: 120}, {q: "2分36秒 ＝ ", a: 156},
  {q: "1分30秒 ＝ ", a: 90}, {q: "2分9秒 ＝ ", a: 129},
  {q: "2分5秒 ＝ ", a: 125}, {q: "3分 ＝ ", a: 180},
  {q: "1分13秒 ＝ ", a: 73}, {q: "1分22秒 ＝ ", a: 82},
  {q: "1分23秒 ＝ ", a: 83}, {q: "2分7秒 ＝ ", a: 127},
  {q: "1分34秒 ＝ ", a: 94}, {q: "1分29秒 ＝ ", a: 89},
  {q: "2分19秒 ＝ ", a: 139}, {q: "2分51秒 ＝ ", a: 171},
  {q: "2分46秒 ＝ ", a: 166}, {q: "1分50秒 ＝ ", a: 110},
  {q: "1分20秒 ＝ ", a: 80}, {q: "2分48秒 ＝ ", a: 168},
  {q: "2分4秒 ＝ ", a: 124}, {q: "2分59秒 ＝ ", a: 179},
  {q: "1分11秒 ＝ ", a: 71}, {q: "2分36秒 ＝ ", a: 156},
  {q: "2分19秒 ＝ ", a: 139}, {q: "1分48秒 ＝ ", a: 108},
  {q: "1分33秒 ＝ ", a: 93}, {q: "1分27秒 ＝ ", a: 87},
  {q: "2分28秒 ＝ ", a: 148}, {q: "2分43秒 ＝ ", a: 163},
  {q: "1分16秒 ＝ ", a: 76}, {q: "2分20秒 ＝ ", a: 140},
  {q: "2分35秒 ＝ ", a: 155}, {q: "2分11秒 ＝ ", a: 131},
  {q: "2分24秒 ＝ ", a: 144}, {q: "1分10秒 ＝ ", a: 70},
  {q: "1分47秒 ＝ ", a: 107}, {q: "2分55秒 ＝ ", a: 175},
  {q: "1分36秒 ＝ ", a: 96}, {q: "2分22秒 ＝ ", a: 142},
  {q: "1分 ＝ ", a: 60}, {q: "2分5秒 ＝ ", a: 125},
  {q: "1分10秒 ＝ ", a: 70}, {q: "1分40秒 ＝ ", a: 100},
  {q: "1分30秒 ＝ ", a: 90}, {q: "1分8秒 ＝ ", a: 68},
  {q: "2分 ＝ ", a: 120}, {q: "2分30秒 ＝ ", a: 150},
  {q: "2分20秒 ＝ ", a: 140}, {q: "2分3秒 ＝ ", a: 123},
  {q: "1分2秒 ＝ ", a: 62}, {q: "2分1秒 ＝ ", a: 121},
  {q: "2分4秒 ＝ ", a: 124}, {q: "1分30秒 ＝ ", a: 90},
  {q: "1分5秒 ＝ ", a: 65}, {q: "2分26秒 ＝ ", a: 146},
  {q: "2分20秒 ＝ ", a: 140}, {q: "3分 ＝ ", a: 180},
  {q: "1分35秒 ＝ ", a: 95}, {q: "1分50秒 ＝ ", a: 110}
];

const timeConversion2List = [
  {q: 60, m: 1, s: 0}, {q: 100, m: 1, s: 40}, {q: 65, m: 1, s: 5}, {q: 136, m: 2, s: 16}, {q: 87, m: 1, s: 27},
  {q: 169, m: 2, s: 49}, {q: 120, m: 2, s: 0}, {q: 73, m: 1, s: 13}, {q: 148, m: 2, s: 28}, {q: 152, m: 2, s: 32},
  {q: 90, m: 1, s: 30}, {q: 123, m: 2, s: 3}, {q: 180, m: 3, s: 0}, {q: 69, m: 1, s: 9}, {q: 77, m: 1, s: 17},
  {q: 171, m: 2, s: 51}, {q: 103, m: 1, s: 43}, {q: 158, m: 2, s: 38}, {q: 126, m: 2, s: 6}, {q: 115, m: 1, s: 55},
  {q: 165, m: 2, s: 45}, {q: 130, m: 2, s: 10}, {q: 129, m: 2, s: 9}, {q: 157, m: 2, s: 37}, {q: 108, m: 1, s: 48},
  {q: 176, m: 2, s: 56}, {q: 63, m: 1, s: 3}, {q: 134, m: 2, s: 14}, {q: 147, m: 2, s: 27}, {q: 91, m: 1, s: 31},
  {q: 79, m: 1, s: 19}, {q: 111, m: 1, s: 51}, {q: 142, m: 2, s: 22}, {q: 76, m: 1, s: 16}, {q: 95, m: 1, s: 35},
  {q: 128, m: 2, s: 8}, {q: 154, m: 2, s: 34}, {q: 164, m: 2, s: 44}, {q: 83, m: 1, s: 23}, {q: 139, m: 2, s: 19},
  {q: 140, m: 2, s: 20}, {q: 89, m: 1, s: 29}, {q: 168, m: 2, s: 48}, {q: 172, m: 2, s: 52}, {q: 106, m: 1, s: 46},
  {q: 153, m: 2, s: 33}, {q: 62, m: 1, s: 2}, {q: 106, m: 1, s: 46}, {q: 125, m: 2, s: 5}, {q: 97, m: 1, s: 37},
  {q: 127, m: 2, s: 7}, {q: 99, m: 1, s: 39}, {q: 84, m: 1, s: 24}, {q: 70, m: 1, s: 10}, {q: 159, m: 2, s: 39},
  {q: 163, m: 2, s: 43}, {q: 110, m: 1, s: 50}, {q: 132, m: 2, s: 12}, {q: 178, m: 2, s: 58}, {q: 105, m: 1, s: 45}
];

const wordProblems = {
  kuku: [
    { q: "エルフの まほう使いが 1日に 3回、かいふくの まほうを 使います。7日間では 何回 使いますか？", a: 21, suffix: "回" },
    { q: "1ぱこに 8個の やくそうが 入っています。4ぱこでは やくそうは ぜんぶで 何個ですか？", a: 32, suffix: "個" },
    { q: "ゆう者が スライムを 1回の こうげきで 5ひき たおします。9回 こうげきすると 何ひき たおせますか？", a: 45, suffix: "ひき" },
    { q: "商人が 1つの 町で 6さつの まどう書を 売りました。8つの 町を めぐると、ぜんぶで 何さつ 売れますか？", a: 48, suffix: "さつ" },
    { q: "1つの チームは 4人で 組まれています。ギルドに 6チーム いるとき、人は ぜんぶで 何人ですか？", a: 24, suffix: "人" },
    { q: "ドラゴンが 1日に 2時間 空を 飛びます。1週間(7日)で 何時間 飛びますか？", a: 14, suffix: "時間" },
    { q: "宝ばこに お金が 9枚ずつ 入っています。宝ばこが 3つ あると、お金は ぜんぶで 何枚ですか？", a: 27, suffix: "枚" }
  ],
  weight: [
    { q: "鉄の けん は 800g、木の たて は 400gです。合わせると 何gですか？", a: 1200, suffix: "g" },
    { q: "ゴーレムの 重さは 1t200kgです。これは 何kgですか？", a: 1200, suffix: "kg" },
    { q: "やくそう 1つは 50gです。3つ 集めると 何gに なりますか？", a: 150, suffix: "g" },
    { q: "馬車（ばしゃ）に 500kgの 石と、700kgの 木を つみました。ぜんぶで 何kgですか？", a: 1200, suffix: "kg" },
    { q: "体重が 70kgの 人が、6kgの 服を 着ました。ぜんぶの 重さは 何kgですか？", a: 76, suffix: "kg" },
    { q: "2kgの 石から、500gを けずりました。残りは 何gですか？", a: 1500, suffix: "g" },
    { q: "馬車の 重さは 1100kgです。これは 1tと 何kgですか？", a: 100, suffix: "kg" }
  ],
  add_sub: [
    { q: "HPが 150の ま物に、ゆう者が 85の ダメージを あたえました。ま物の 残りの HPは いくつ？", a: 65, suffix: "" },
    { q: "村に お金が 350円 ありました。お祭りで 120円 使いました。残りは 何円？", a: 230, suffix: "円" },
    { q: "エルフが 1200年の ねむりから さめ、さらに 350年 旅を しました。ぜんぶで 何年？", a: 1550, suffix: "年" },
    { q: "お店で けん を 450円、たて を 280円で 買いました。お金は ぜんぶで いくら？", a: 730, suffix: "円" },
    { q: "大ま王の おしろ まで 2000kmあります。今日までに 850km進みました。残りは 何km？", a: 1150, suffix: "km" },
    { q: "王さまの たから物こ に お金が 3140円 ありました。1500円を へい士に 分けました。残りは 何円？", a: 1640, suffix: "円" },
    { q: "1日目に モンスターを 145ひき、2日目に 268ひき たおしました。合わせて 何ひき？", a: 413, suffix: "ひき" }
  ],
  large_mult: [
    { q: "1ぱこに 12個の かいふくやく が 入っています。15ぱこ では ぜんぶで 何個ですか？", a: 180, suffix: "個" },
    { q: "1回の まほう で 25ダメージを あたえます。14回 まほうを 使うと ぜんぶで いくつ？", a: 350, suffix: "" },
    { q: "1日に 24km進む 馬車が あります。12日間では 何km進みますか？", a: 288, suffix: "km" },
    { q: "お金が 1ふくろに 50枚 入っています。25ふくろ では ぜんぶで 何枚ですか？", a: 1250, suffix: "枚" },
    { q: "1さつ 350円の まどう書を、チームの 4人分 買いました。お金は いくら？", a: 1400, suffix: "円" },
    { q: "町から 村まで 15kmあります。60回 行ったり 来たり すると 何km？", a: 900, suffix: "km" },
    { q: "1時間の しゅぎょう で けいけんちが 120 入ります。24時間 しゅぎょう すると いくつ？", a: 2880, suffix: "" }
  ],
  decimal: [
    { q: "まほうの 水を 0.3L、くすりの 粉を 0.5L 入れました。合わせて 何L？", a: 0.8, suffix: "L" },
    { q: "1.5kmある 森の 道の うち、0.7km 歩きました。残りは 何km？", a: 0.8, suffix: "km" },
    { q: "水とう に 1.2Lの 水が 入っています。0.4L 飲みました。残りは 何L？", a: 0.8, suffix: "L" },
    { q: "0.2kgの 鉱石（こうせき）が 4つ あります。ぜんぶで 何kg？", a: 0.8, suffix: "kg" },
    { q: "2.4mの まほうの つなを 3つに 分けました。1つ分は 何m？", a: 0.8, suffix: "m" },
    { q: "背の高さが 1.8mの せん士が、0.2mの 台に 乗りました。高さは 合わせて 何m？", a: 2.0, suffix: "m" },
    { q: "1.5Lの れいやく を 5人で 同じように 分けます。1人分は 何L？", a: 0.3, suffix: "L" }
  ],
  fraction: [
    { q: "かいふくの ケーキを 5つに 分けました。2つ 食べると、残りは ぜん体の ◯/5 です。◯は？", a: 3, suffix: "" },
    { q: "まほうの 水を 1/4 Lと 2/4 L 混ぜました。ぜんぶで ◯/4 Lに なります。◯は？", a: 3, suffix: "" },
    { q: "どうくつの 3/7 を 進みました。残りは 道のりの ◯/7 です。◯は？", a: 4, suffix: "" },
    { q: "1mの まほう陣の 4/6 を かき、その後 1/6 を かきました。合わせて ◯/6 かいた。", a: 5, suffix: "" },
    { q: "HPが 8/10 あります。てきの こうげきで 3/10 減りました。残りは ◯/10 です。", a: 5, suffix: "" },
    { q: "MPを 2/9 使って まほうを うち、さらに 5/9 使って 大きな まほうを うちました。合わせて ◯/9 使った。", a: 7, suffix: "" },
    { q: "宝の 地図の 6/8 が 見つかりました。あと ◯/8 で 完成します。", a: 2, suffix: "" }
  ],
  div_rem: [
    { q: "23個の 魔石（ませき）を、3人で 同じ 数ずつ 分けます。1人 何個で、何個 あまる？", a: 7, rem: 2 },
    { q: "17枚の お金を、5つの ふくろに 同じ 数ずつ 入れます。1ふくろ 何枚で、何枚 あまる？", a: 3, rem: 2 },
    { q: "30個の やくそうを、4つの チームで 同じように 分けました。1チーム 何個で、何個 あまる？", a: 7, rem: 2 },
    { q: "40ひきの スライムを、6人の ゆう者で 同じ 数ずつ たおします。1人 何ひきで、何ひき あまる？", a: 6, rem: 4 },
    { q: "ギルドに 28人の 人が います。5人ずつの チームを 作ると、何チーム できて 何人 あまる？", a: 5, rem: 3 },
    { q: "50個の リンゴを、8個ずつ 箱に つめます。何箱 できて、何個 あまる？", a: 6, rem: 2 },
    { q: "まどう書を 35ページ 読みます。1日に 4ページずつ 読むと、何日 かかって 何ページ あまる？", a: 8, rem: 3 }
  ],
  area_calc: [
    { q: "たて 5cm、よこ 8cmの 長方形の 形を した おふだの 広さ(めんせき)は？", a: 40, suffix: "㎠" },
    { q: "1辺が 6cmの 正方形の けっかいの 広さは？", a: 36, suffix: "㎠" },
    { q: "たて 4m、よこ 7mの 部屋の 広さは？", a: 28, suffix: "㎡" },
    { q: "底辺が 10cm、高さが 4cmの 三角形の 石の 広さは？", a: 20, suffix: "㎠" },
    { q: "たて 9cm、よこ 3cmの 長方形の 鏡の 広さは？", a: 27, suffix: "㎠" },
    { q: "1辺が 10mの 正方形の 形を した ボスの 部屋の 広さは？", a: 100, suffix: "㎡" },
    { q: "底辺が 8cm、高さが 5cmの 三角形の たて の 広さは？", a: 20, suffix: "㎠" }
  ],
  time_seconds: [
    { q: "まほうを となえるのに 1分20秒 かかりました。これは 何秒ですか？", a: 80, suffix: "秒" },
    { q: "ゆう者が 100秒間、息を 止めました。これは 1分◯秒です。◯は？", a: 40, suffix: "秒" },
    { q: "くんれん所で 1時間30分 くんれん しました。これは 何分ですか？", a: 90, suffix: "分" },
    { q: "どうくつを クリアするのに 90秒 かかりました。これは 1分◯秒です。◯は？", a: 30, suffix: "秒" },
    { q: "70秒間、てきの こうげきを たえました。これは 1分◯秒です。◯は？", a: 10, suffix: "秒" },
    { q: "朝の 7時50分に 町を 出て、8時10分に 森に 着きました。かかった 時間は 何分？", a: 20, suffix: "分" },
    { q: "カップめん(3分)と やくそう作り(2分)。待つ 時間は 合わせて 何秒ですか？", a: 300, suffix: "秒" }
  ],
  sun_shadow: [
    { q: "朝、太陽が 東に あるとき、かげは どの 方角に できますか？(1:東 2:西 3:南 4:北)", a: 2, suffix: "" },
    { q: "昼、太陽が 南の 空 高くに あるとき、かげは どの 方角に できますか？(1:東 2:西 3:南 4:北)", a: 4, suffix: "" },
    { q: "夕方、かげが 東に のびているとき、太陽は どの 方角に ありますか？(1:東 2:西 3:南 4:北)", a: 2, suffix: "" },
    { q: "太陽が 高い ところに あるほど、かげの 長さは どう なりますか？(1:長くなる 2:短くなる)", a: 2, suffix: "" },
    { q: "1日の 中で、かげが 一番 短く なるのは いつごろ ですか？(1:朝 2:昼 3:夕方)", a: 2, suffix: "" },
    { q: "日なた と 日かげで、地面が あたたかいのは どちら ですか？(1:日なた 2:日かげ)", a: 1, suffix: "" },
    { q: "光を 鏡で はね返して まとに 当てました。鏡の 数を 増やすと まとの 明るさは？(1:明るくなる 2:暗くなる)", a: 1, suffix: "" }
  ],
  missing_multdiv: [
    { q: "スライムを ◯ひき たおすと、けいけんちが 5ずつ 入り、合わせて 35に なりました。◯は？", a: 7, suffix: "ひき" },
    { q: "8人に やくそうを ◯個ずつ 配ると、ぜんぶで 32個 いりました。◯は？", a: 4, suffix: "個" },
    { q: "◯ × 6 ＝ 54 のとき、◯に 入る 数は いくつですか？", a: 9, suffix: "" },
    { q: "42枚の お金を ◯人で 分けると、1人 7枚に なりました。◯は？", a: 6, suffix: "人" },
    { q: "◯ ÷ 5 ＝ 8 のとき、◯に 入る 数は いくつですか？", a: 40, suffix: "" },
    { q: "宝ばこが ◯個 あり、それぞれに 9個の 魔石（ませき）が 入っています。合わせて 63個です。◯は？", a: 7, suffix: "個" },
    { q: "36 ÷ ◯ ＝ 4 のとき、◯に 入る 数は いくつですか？", a: 9, suffix: "" }
  ],
  large_mental: [
    { q: "王国軍の へい士が 300人、まほう使いが 400人 います。合わせて 何人？", a: 700, suffix: "人" },
    { q: "1000円 持っていて、600円の まどう書を 買いました。おつりは いくら？", a: 400, suffix: "円" },
    { q: "1ぱこ に 200本 入りの 矢が あります。3ぱこ では ぜんぶで 何本 ですか？", a: 600, suffix: "本" },
    { q: "HPが 1500の ゴーレムに、800の ダメージを あたえました。残りの HPは？", a: 700, suffix: "" },
    { q: "400枚の お金が 入った ふくろが 2つ あります。お金は ぜんぶで 何枚？", a: 800, suffix: "枚" },
    { q: "1200kmの 旅のうち、500km 進みました。残りは 何km？", a: 700, suffix: "km" },
    { q: "1日に 300の けいけんちを 手に 入れます。3日間で いくつ 手に 入れますか？", a: 900, suffix: "" }
  ]
};

const largeMapSize = 21; 
const viewRadius = 3; 
let playerX = 10; let playerY = 10; 

let bossX = 0; let bossY = 0; 
let currentBoss = null;

let mapGrid = []; let fogGrid = []; 
let mapTheme = "theme-cave";
let wallIcon = "🌲"; 

let chests = []; let springs = []; let fieldItems = []; 
let enemiesOnMap = []; let trapsOnMap = []; let currentEnemyIndex = -1; 

const monsterData = [
  { name: "スライム", hp: 2, atk: 1, icon: '<img src="https://assets.st-note.com/img/1772716673-Siqp1vmwzbGXTeft39UNAlak.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">', reward: 5, expBonus: 2, drop: "shizuku" },
  { name: "コウモリ", hp: 3, atk: 2, icon: '<img src="https://assets.st-note.com/img/1772716684-n8GKJt3TveugpY0hd415Rczx.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">', reward: 8, expBonus: 4, drop: "hone" },
  { name: "がいこつ", hp: 5, atk: 3, icon: '<img src="https://assets.st-note.com/img/1772716438-8LIRbVviCus0HExf1lUKM6aQ.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">', reward: 10, expBonus: 6, drop: "hone" },
  { name: "ゴーレム", hp: 8, atk: 5, icon: "👿", reward: 15, expBonus: 8, drop: "kouseki" },
  { name: "ドラゴン", hp: 12, atk: 8, icon: '<img src="https://assets.st-note.com/img/1772718044-dse6U2pFv8PnioBVKMayJqZ4.png" class="map-entity enemy-img" style="width: 100%; height: 100%; object-fit: contain;">', reward: 25, expBonus: 10, drop: "maseki" }
];

let currentMonsterHp = 0;
let currentMonsterAtk = 1; 

// --- 追加機能：テンキーとまほう ---
let currentFocusInput = null;

function setFocus(el) { currentFocusInput = el; }

function numIn(key) {
  if (!currentFocusInput) {
    if (document.getElementById("math-vertical-addsub").style.display === "block") currentFocusInput = document.getElementById("va-answer");
    else if (document.getElementById("math-vertical").style.display === "block") currentFocusInput = document.getElementById("v-step1");
    else currentFocusInput = document.getElementById("h-answer");
  }
  if (key === 'BS') {
    currentFocusInput.value = currentFocusInput.value.slice(0, -1);
  } else {
    currentFocusInput.value += key;
  }
}

function useMagic(type) {
  if (gold < 50) {
    let msgEl = document.getElementById("battle-area").style.display === "block" ? document.getElementById("battle-message") : document.getElementById("map-message");
    msgEl.innerText = "お金が たりない！(50円 ひつよう)";
    return;
  }
  gold -= 50; updateStatus();
  if (type === 'hint') {
    document.getElementById("battle-message").innerText = `🔮みやぶる：さいごの こたえは「 ${currentAnswer} 」だ！`;
  }
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

document.addEventListener("keydown", function(event) {
  if (document.getElementById("explore-screen").style.display === "block") {
    if (event.key === "ArrowUp") { event.preventDefault(); movePlayer(0, -1); } 
    else if (event.key === "ArrowDown") { event.preventDefault(); movePlayer(0, 1); } 
    else if (event.key === "ArrowLeft") { event.preventDefault(); movePlayer(-1, 0); } 
    else if (event.key === "ArrowRight") { event.preventDefault(); movePlayer(1, 0); }
  }
});

function cleanData() {
  level = Number(level) || 1; exp = Number(exp) || 0; nextExp = Number(nextExp) || 10;
  gold = Number(gold) || 0; playerMaxHp = Number(playerMaxHp) || 5; currentPlayerHp = Number(currentPlayerHp) || playerMaxHp;
  weaponLevel = Number(weaponLevel) || 0; armorLevel = Number(armorLevel) || 0;
  potions = Number(potions) || 0;
  weaponLevel = Math.min(Math.max(0, weaponLevel), weaponData.length - 1);
  armorLevel = Math.min(Math.max(0, armorLevel), armorData.length - 1);
  if (!Array.isArray(companions)) companions = [];
  if (!materials || typeof materials !== 'object') materials = {};
  materials.shizuku = Number(materials.shizuku) || 0; materials.hone = Number(materials.hone) || 0;
  materials.kouseki = Number(materials.kouseki) || 0; materials.maseki = Number(materials.maseki) || 0;
  materials.hoshisuna = Number(materials.hoshisuna) || 0; materials.tsukiishi = Number(materials.tsukiishi) || 0;
}

function saveData() {
  cleanData();
  localStorage.setItem("quest_level", level); localStorage.setItem("quest_exp", exp); localStorage.setItem("quest_nextExp", nextExp);
  localStorage.setItem("quest_gold", gold); localStorage.setItem("quest_maxHp", playerMaxHp); localStorage.setItem("quest_currentHp", currentPlayerHp);
  localStorage.setItem("quest_weaponLevel", weaponLevel); localStorage.setItem("quest_armorLevel", armorLevel);
  localStorage.setItem("quest_potions", potions);
  localStorage.setItem("quest_companions", JSON.stringify(companions)); localStorage.setItem("quest_materials", JSON.stringify(materials)); 
}

function loadData() {
  try {
    if (localStorage.getItem("quest_gold") !== null) {
      level = parseInt(localStorage.getItem("quest_level")); exp = parseInt(localStorage.getItem("quest_exp")); nextExp = parseInt(localStorage.getItem("quest_nextExp"));
      gold = parseInt(localStorage.getItem("quest_gold")); playerMaxHp = parseInt(localStorage.getItem("quest_maxHp")); currentPlayerHp = parseInt(localStorage.getItem("quest_currentHp"));
      weaponLevel = parseInt(localStorage.getItem("quest_weaponLevel")); armorLevel = parseInt(localStorage.getItem("quest_armorLevel"));
      potions = parseInt(localStorage.getItem("quest_potions")) || 0;
      if (localStorage.getItem("quest_companions")) companions = JSON.parse(localStorage.getItem("quest_companions"));
      if (localStorage.getItem("quest_materials")) materials = JSON.parse(localStorage.getItem("quest_materials"));
    }
  } catch(e) {}
  cleanData();
  goToTown();
}

function resetData() { if (confirm("本当に データを けして 最初から はじめますか？")) { localStorage.clear(); location.reload(); } }

function updateStatus() {
  cleanData();
  document.getElementById("player-level").innerText = level; document.getElementById("player-exp").innerText = exp; document.getElementById("next-exp").innerText = nextExp;
  document.getElementById("player-hp-value").innerText = currentPlayerHp; document.getElementById("max-hp-value").innerText = playerMaxHp; document.getElementById("gold-value").innerText = gold;
  document.getElementById("potion-count").innerText = potions;
  
  document.getElementById("companions-list").innerHTML = companions.length > 0 ? companions.join("") : "なし";
  
  document.getElementById("mat-shizuku").innerText = materials.shizuku; document.getElementById("mat-hone").innerText = materials.hone;
  document.getElementById("mat-kouseki").innerText = materials.kouseki; document.getElementById("mat-maseki").innerText = materials.maseki;
  document.getElementById("mat-hoshisuna").innerText = materials.hoshisuna; document.getElementById("mat-tsukiishi").innerText = materials.tsukiishi;
  
  document.getElementById("equip-name").innerText = `${weaponData[weaponLevel].name}, ${armorData[armorLevel].name}`;

  const btnWeapon = document.getElementById("btn-craft-weapon");
  if (weaponLevel < weaponData.length - 1) { btnWeapon.innerHTML = `ぶきを きたえる<br><span style="font-size:10px; color:#ffeb3b;">${weaponData[weaponLevel + 1].reqText}</span>`;
  } else { btnWeapon.innerHTML = `さいこう の ぶき`; }

  const btnArmor = document.getElementById("btn-craft-armor");
  if (armorLevel < armorData.length - 1) { btnArmor.innerHTML = `ぼうぐを きたえる<br><span style="font-size:10px; color:#ffeb3b;">${armorData[armorLevel + 1].reqText}</span>`;
  } else { btnArmor.innerHTML = `さいこう の ぼうぐ`; }

  for (let i = 1; i <= 9; i++) {
    const btns = document.querySelectorAll(`.req-lv-${i}`);
    if (weaponLevel >= i) {
      btns.forEach(b => b.classList.remove('locked'));
    } else {
      btns.forEach(b => b.classList.add('locked'));
    }
  }
  saveData(); 
}

function checkTelescope() {
  document.getElementById("shop-message").innerText = "「星が きれい だね！ これで 新しい とびらが 開くかも！」";
}

function goToTown() {
  stopTimer();
  document.getElementById("town-screen").style.display = "block"; document.getElementById("explore-screen").style.display = "none"; document.getElementById("battle-screen").style.display = "none"; document.getElementById("controls-area").style.display = "none";
  updateStatus();
}

function goToExplore() {
  stopTimer();
  document.getElementById("town-screen").style.display = "none"; document.getElementById("explore-screen").style.display = "block"; document.getElementById("battle-screen").style.display = "none"; document.getElementById("controls-area").style.display = "block";
  drawMap();
}

function goToBattle() {
  document.getElementById("town-screen").style.display = "none"; document.getElementById("explore-screen").style.display = "none"; document.getElementById("battle-screen").style.display = "block"; document.getElementById("controls-area").style.display = "none";
}

function checkLevelUp() {
  if (exp >= nextExp) {
    level += 1; exp = exp - nextExp; nextExp = Math.floor(nextExp * 1.5);
    playerMaxHp += 2; currentPlayerHp = playerMaxHp; 
    alert(`🎉 レベルアップ！ LV${level} に なった！\n最大HPが アップして ぜんかいふく した！`);
  }
}

function stayInn() {
  if (currentPlayerHp === playerMaxHp) { document.getElementById("shop-message").innerText = "「HPは 満タン みたいだね！」"; return; }
  if (gold >= 10) { gold -= 10; currentPlayerHp = playerMaxHp; document.getElementById("shop-message").innerText = `おはよう！ HPが ぜんかいふく したよ！`; updateStatus();
  } else { document.getElementById("shop-message").innerText = `お金が たりない みたいだね･･･`; }
}

function buyPotion() {
  if (gold >= 30) { gold -= 30; potions++; document.getElementById("shop-message").innerText = `「やくそうを 買ったよ！ どうぐ として 使える からね！」`; updateStatus();
  } else { document.getElementById("shop-message").innerText = `お金が たりない みたいだね･･･`; }
}

function usePotion() {
  if (potions <= 0) {
    let msgEl = document.getElementById("battle-area").style.display === "block" ? document.getElementById("battle-message") : document.getElementById("map-message");
    msgEl.innerText = "やくそうを 持っていない！";
    return;
  }
  if (currentPlayerHp >= playerMaxHp) {
    let msgEl = document.getElementById("battle-area").style.display === "block" ? document.getElementById("battle-message") : document.getElementById("map-message");
    msgEl.innerText = "HPは 満タンだ！";
    return;
  }
  potions--;
  currentPlayerHp += 15;
  if (currentPlayerHp > playerMaxHp) currentPlayerHp = playerMaxHp;
  updateStatus();
  
  document.body.classList.add("heal-flash-bg");
  setTimeout(() => document.body.classList.remove("heal-flash-bg"), 150);

  if (document.getElementById("battle-area").style.display === "block") {
    document.getElementById("battle-message").innerText = "やくそうを 使った！ HPが かいふく した！";
  } else {
    document.getElementById("map-message").innerText = "やくそうを 使った！ HPかいふく！";
  }
}

function craftArmor() {
  if (armorLevel >= armorData.length - 1) { document.getElementById("shop-message").innerText = `これ以上 ぼうぐ は きたえられないぜ！`; return; }
  const req = armorData[armorLevel + 1].req;
  if (materials.shizuku >= req.shizuku && materials.hone >= req.hone && materials.kouseki >= req.kouseki && materials.maseki >= req.maseki) {
    materials.shizuku -= req.shizuku; materials.hone -= req.hone; materials.kouseki -= req.kouseki; materials.maseki -= req.maseki; 
    armorLevel++; playerMaxHp += armorData[armorLevel].hpBonus; currentPlayerHp = playerMaxHp; 
    document.getElementById("shop-message").innerText = `「カンカン…できた！ ${armorData[armorLevel].name} だ！ 最大HPが アップしたぞ！」`; updateStatus();
  } else { document.getElementById("shop-message").innerText = `アイテムが たりない みたいだな。どうくつで 集めてきな！`; }
}

function craftWeapon() {
  if (weaponLevel >= weaponData.length - 1) { document.getElementById("shop-message").innerText = `これ以上 ぶき は きたえられないぜ！`; return; }
  const req = weaponData[weaponLevel + 1].req;
  if (materials.shizuku >= req.shizuku && materials.hone >= req.hone && materials.kouseki >= req.kouseki && materials.maseki >= req.maseki) {
    materials.shizuku -= req.shizuku; materials.hone -= req.hone; materials.kouseki -= req.kouseki; materials.maseki -= req.maseki; 
    weaponLevel++; document.getElementById("shop-message").innerText = `「カンカン…できた！ ${weaponData[weaponLevel].name} だ！」`; updateStatus();
  } else { document.getElementById("shop-message").innerText = `アイテムが たりないな。どうくつで 集めてきな！`; }
}

function playGacha() {
  if (gold < 100) { document.getElementById("shop-message").innerText = `「ガチャは 1回 100円 だよ。お金が たりないね」`; return; }
  gold -= 100; updateStatus();
  const r = Math.random();
  if (r < 0.15) {
    const rare = rareCompanions[Math.floor(Math.random() * rareCompanions.length)];
    const rareName = (rare === unicornImg) ? "ユニコーン" : rare; 
    if (!companions.includes(rare)) {
      companions.push(rare); document.getElementById("shop-message").innerText = `「大当たり！！ げきレアな ${rareName} が なかまに なった！」`; 
    } else {
      gold += 100; document.getElementById("shop-message").innerText = `「大当たり！…だけど ${rareName} は もう いるね。100円 お返し するよ！」`; 
    }
  } else if (r < 0.35) {
    materials.kouseki += 1; materials.maseki += 1; document.getElementById("shop-message").innerText = "「当たり！ レアな アイテム【🔸x1】【🔮x1】が 出た！」";
  } else {
    materials.shizuku += 1; materials.hone += 1; document.getElementById("shop-message").innerText = "「アイテム【💧x1】【🦴x1】が 出た！」";
  }
  updateStatus();
}

function tryStartGame(type, min, max, reqLv) {
  if (weaponLevel < reqLv) { 
    document.getElementById("shop-message").innerText = `「そこへ 行くには【${weaponData[reqLv].name}】以上が ひつようだぜ！」`; 
    return; 
  }
  stageType = type; stageMin = min; stageMax = max;
  isHardMode = (type === "kuku_boss" || type === "kuku_all" || type.startsWith("hissan") || type.startsWith("add") || type.startsWith("sub") || type === "mixed_hard" || type === "missing_multdiv" || type === "large_mental");
  isTrapEncounter = false; isBossBattle = false; isMimic = false; currentCombo = 0; 
  if (currentPlayerHp <= 0) currentPlayerHp = playerMaxHp; 
  updateStatus(); 
  
  const mapEl = document.getElementById("mini-map");
  mapEl.className = ""; 
  
  if (type.startsWith("hissan")) { mapTheme = "theme-boss"; }
  else if (type === "weight") { mapTheme = "theme-cave"; }
  else if (type === "decimal" || type === "dec_multdiv") { mapTheme = "theme-grass"; }
  else if (type === "fraction" || type === "area_calc") { mapTheme = "theme-lava"; }
  else if (type === "time_seconds" || type === "sun_shadow" || type === "time_calc" || type === "time_calc_minutes" || type === "time_conversion" || type === "time_conversion2") { mapTheme = "theme-star"; }
  else if (type === "missing_multdiv" || type === "large_mental" || type === "div_rem" || type === "mixed_hard") { mapTheme = "theme-boss"; }
  else if (type.startsWith("add") || type.startsWith("sub")) { mapTheme = "theme-lava"; }
  else if (isHardMode) { mapTheme = "theme-boss"; }
  else if (max <= 3) { mapTheme = "theme-grass"; }
  else if (max <= 6) { mapTheme = "theme-cave"; } 
  else if (type === "kuku_puzzle") { mapTheme = "theme-cave"; }
  else { mapTheme = "theme-lava"; }
  
  mapEl.classList.add(mapTheme);
  generateMap(); 
}

function generateMap() {
  document.getElementById("dungeon-info").innerText = "たんけん中...";
  document.getElementById("map-message").innerText = "マップの どこかに いる ボスを さがせ！"; 
  
  mapGrid = []; fogGrid = [];
  for (let y = 0; y < largeMapSize; y++) {
    mapGrid[y] = []; fogGrid[y] = [];
    for (let x = 0; x < largeMapSize; x++) {
      if (x === 0 || x === largeMapSize-1 || y === 0 || y === largeMapSize-1) { mapGrid[y][x] = 1; }
      else { mapGrid[y][x] = Math.random() < 0.2 ? 1 : 0; } 
      fogGrid[y][x] = true; 
    }
  }

  playerX = Math.floor(largeMapSize / 2); playerY = Math.floor(largeMapSize / 2);
  mapGrid[playerY][playerX] = 0; 

  let emptySpots = [];
  for (let y = 1; y < largeMapSize - 1; y++) {
    for (let x = 1; x < largeMapSize - 1; x++) {
      if (mapGrid[y][x] === 0 && (Math.abs(x - playerX) > 3 || Math.abs(y - playerY) > 3)) {
         emptySpots.push({x: x, y: y});
      }
    }
  }

  for (let i = emptySpots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emptySpots[i], emptySpots[j]] = [emptySpots[j], emptySpots[i]];
  }
  function getSpot() { return emptySpots.length > 0 ? emptySpots.pop() : {x: 1, y: 1}; }

  let bSpot = getSpot();
  bossX = bSpot.x; bossY = bSpot.y;
  mapGrid[bossY][bossX] = 0;
  
  let bHp = 20; let bRwd = 50; let bXp = 30; let bIcon = '👿'; let bName = "ボス"; let bAtk = 3;
  if (stageType === "kuku") { bHp = 15; bIcon = '👑'; bAtk = 2; }
  else if (stageType === "kuku_boss") { bHp = 40; bRwd = 100; bXp = 50; bAtk = 5; }
  else if (stageType === "kuku_all") { bHp = 60; bRwd = 200; bXp = 100; bIcon = '👹'; bName = "しん・だいまおう"; bAtk = 8; }
  else if (stageType === "kuku_puzzle") { bHp = 35; bRwd = 80; bXp = 40; bIcon = '🧩'; bName = "パズルキューブ"; bAtk = 5; }
  else if (stageType.startsWith("hissan")) { bHp = 80; bRwd = 400; bXp = 200; bIcon = '🐲'; bName = "まくうの 王"; bAtk = 12; }
  else if (stageType === "weight") { bHp = 30; bIcon = '🗿'; bName = "ゴーレムキング"; bAtk = 6; }
  else if (stageType === "decimal" || stageType === "dec_multdiv") { bHp = 50; bIcon = '🧚'; bName = "せいれいの 王"; bAtk = 8; }
  else if (stageType === "fraction") { bHp = 60; bIcon = '🧞'; bName = "分数の 大王"; bAtk = 10; }
  else if (stageType === "add3x3_carry1") { bHp = 45; bIcon = '🔥'; bName = "フレイムナイト"; bAtk = 7; } 
  else if (stageType === "add3x3_carry10") { bHp = 50; bIcon = '🌋'; bName = "マグマゴーレム"; bAtk = 8; } 
  else if (stageType === "add3x3_carry2") { bHp = 60; bIcon = '☄️'; bName = "メテオドラゴン"; bAtk = 9; } 
  else if (stageType === "add3x3_over1000") { bHp = 70; bIcon = '🐺'; bName = "ヘルハウンド"; bAtk = 10; } 
  else if (stageType === "add_large") { bHp = 80; bIcon = '🦖'; bName = "ギガントドラゴン"; bAtk = 12; } 
  else if (stageType === "sub3x3_borrow1") { bHp = 45; bIcon = '🦇'; bName = "シャドウバット"; bAtk = 7; }
  else if (stageType === "sub3x3_borrow2") { bHp = 55; bIcon = '🧛'; bName = "ヴァンパイアロード"; bAtk = 9; }
  else if (stageType === "sub_large") { bHp = 80; bIcon = '🦅'; bName = "ダークグリフォン"; bAtk = 12; }
  else if (stageType.startsWith("add") || stageType.startsWith("sub")) { bHp = 50; bIcon = '💠'; bName = "けいさんの 神"; bAtk = 8; }
  else if (stageType === "div_rem") { bHp = 60; bIcon = '➗'; bName = "ワリザン・レム"; bAtk = 10; }
  else if (stageType === "area_calc") { bHp = 90; bIcon = '📐'; bName = "ずけいの まじん"; bAtk = 15; }
  else if (stageType === "time_seconds") { bHp = 70; bIcon = '⏳'; bName = "時の ばんにん"; bAtk = 10; }
  else if (stageType === "sun_shadow") { bHp = 70; bIcon = '🌞'; bName = "太陽の 神"; bAtk = 10; }
  else if (stageType === "time_calc") { bHp = 80; bIcon = '🕰️'; bName = "クロックマスター"; bAtk = 12; }
  else if (stageType === "time_calc_minutes") { bHp = 80; bIcon = '⏳'; bName = "タイムイーター"; bAtk = 12; }
  else if (stageType === "time_conversion") { bHp = 80; bIcon = '🌠'; bName = "流れ星の ま女"; bAtk = 12; }
  else if (stageType === "time_conversion2") { bHp = 85; bIcon = '🌀'; bName = "ギャラクシー"; bAtk = 12; }
  else if (stageType === "mixed_hard") { bHp = 200; bRwd = 1500; bXp = 800; bIcon = '🌌'; bName = "そうぞうの 神"; bAtk = 25; }
  else if (stageType === "missing_multdiv") { bHp = 100; bRwd = 500; bXp = 300; bIcon = '👁️'; bName = "きょむの 目"; bAtk = 20; }
  else if (stageType === "large_mental") { bHp = 120; bRwd = 600; bXp = 350; bIcon = '🧠'; bName = "ブレインロード"; bAtk = 22; }
  
  currentBoss = { name: bName, hp: bHp, icon: bIcon, reward: bRwd, expBonus: bXp, atk: bAtk };

  chests = []; springs = []; fieldItems = []; trapsOnMap = []; enemiesOnMap = [];
  
  let chestCount = Math.floor(Math.random() * 3) + 2;
  for(let i=0; i<chestCount; i++) chests.push(getSpot());

  if (Math.random() < 0.5) springs.push(getSpot());
  for(let i=0; i<3; i++) trapsOnMap.push(getSpot());

  const itemCount = Math.floor(Math.random() * 4) + 2; 
  for(let i=0; i<itemCount; i++) {
      let s = getSpot();
      let rv = Math.random();
      let pDrop;
      if (mapTheme === "theme-star") {
        if (rv < 0.5) pDrop = {type: "hoshisuna", icon: "⏳", name: "⏳"};
        else pDrop = {type: "tsukiishi", icon: "🌙", name: "🌙"};
      } else {
        if (rv < 0.3) pDrop = {type: "shizuku", icon: "💧", name: "💧"};
        else if (rv < 0.6) pDrop = {type: "hone", icon: "🦴", name: "🦴"};
        else if (rv < 0.85) pDrop = {type: "kouseki", icon: "🔸", name: "🔸"};
        else pDrop = {type: "maseki", icon: "🔮", name: "🔮"};
      }
      fieldItems.push({x: s.x, y: s.y, type: pDrop.type, icon: pDrop.icon, name: pDrop.name});
  }

  const enemyCount = 15; 
  for(let i=0; i<enemyCount; i++) {
      let s = getSpot();
      let baseEnemy = monsterData[Math.floor(Math.random() * monsterData.length)];
      let eHp = baseEnemy.hp;
      let eAtk = baseEnemy.atk;
      if (level > 5) { eHp *= 2; eAtk += 1; }
      if (level > 10) { eHp *= 3; eAtk += 2; }
      if (level > 15) { eHp *= 5; eAtk += 5; }
      enemiesOnMap.push({ x: s.x, y: s.y, name: baseEnemy.name, icon: baseEnemy.icon, drop: baseEnemy.drop, reward: baseEnemy.reward, expBonus: baseEnemy.expBonus, hp: eHp, atk: eAtk });
  }

  updateFog(); goToExplore(); 
}

function updateFog() {
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      let nx = playerX + dx; let ny = playerY + dy;
      if (nx >= 0 && nx < largeMapSize && ny >= 0 && ny < largeMapSize) { fogGrid[ny][nx] = false; }
    }
  }
}

function drawMap() {
  const mapEl = document.getElementById("mini-map");
  mapEl.innerHTML = ""; 
  
  for (let dy = -viewRadius; dy <= viewRadius; dy++) {
    for (let dx = -viewRadius; dx <= viewRadius; dx++) {
      const vx = playerX + dx;
      const vy = playerY + dy;
      const cell = document.createElement("div");
      cell.className = "map-cell";
      
      if (vx < 0 || vx >= largeMapSize || vy < 0 || vy >= largeMapSize) {
        cell.innerHTML = `<span class="wall-entity">${wallIcon}</span>`;
      } else if (fogGrid[vy][vx]) {
        cell.classList.add("fog");
      } else {
        const isWall = mapGrid[vy][vx] === 1;
        const isChest = chests.find(c => c.x === vx && c.y === vy);
        const isSpring = springs.find(s => s.x === vx && s.y === vy);
        const fieldItem = fieldItems.find(f => f.x === vx && f.y === vy);
        const enemy = enemiesOnMap.find(e => e.x === vx && e.y === vy);
        
        if (dx === 0 && dy === 0) { 
          cell.innerHTML = `<img src="https://assets.st-note.com/img/1772715050-weFPDcTmlSpasC3KMInuG0Hy.png" class="map-entity player-anim" style="width: 100%; height: 100%; object-fit: contain;">`; 
        } 
        else if (isWall) { cell.innerHTML = `<span class="wall-entity">${wallIcon}</span>`; }
        else if (enemy) { cell.innerHTML = enemy.icon; } 
        else if (vx === bossX && vy === bossY) { cell.innerHTML = `<span class="map-entity">${currentBoss.icon}</span>`; } 
        else if (isChest) { cell.innerHTML = `<span class="map-entity">🎁</span>`; } 
        else if (isSpring) { cell.innerHTML = `<span class="map-entity" style="color:#03a9f4;">⛲</span>`; } 
        else if (fieldItem) { cell.innerHTML = `<span class="map-entity ${mapTheme === 'theme-star' ? 'star-entity' : ''}">${fieldItem.icon}</span>`; } 
      }
      mapEl.appendChild(cell);
    }
  }
}

function movePlayer(dx, dy) {
  document.getElementById("map-message").innerText = ""; 
  const newX = playerX + dx; const newY = playerY + dy;
  
  if (newX >= 0 && newX < largeMapSize && newY >= 0 && newY < largeMapSize) {
    if (mapGrid[newY][newX] === 1) return; 

    playerX = newX; playerY = newY; 
    updateFog(); 
    
    if (playerX === bossX && playerY === bossY) {
      encounterBoss(); return; 
    }
    
    const chestIndex = chests.findIndex(c => c.x === playerX && c.y === playerY);
    if (chestIndex !== -1) {
      chests.splice(chestIndex, 1); 
      if (Math.random() < 0.20) {
        encounterMimic(); return;
      } else {
        const bonusGold = Math.floor(Math.random() * 50) + 20;
        gold += bonusGold; document.getElementById("map-message").innerText = `🎁 宝箱！ ${bonusGold}円 ゲット！`;
        updateStatus();
      }
    }

    const springIndex = springs.findIndex(s => s.x === playerX && s.y === playerY);
    if (springIndex !== -1) {
      currentPlayerHp += Math.floor(playerMaxHp / 2); if (currentPlayerHp > playerMaxHp) currentPlayerHp = playerMaxHp;
      document.getElementById("map-message").innerText = `⛲ いずみ！ HPが 大きく かいふく した！`;
      updateStatus(); springs.splice(springIndex, 1); 
    }

    const fItemIndex = fieldItems.findIndex(f => f.x === playerX && f.y === playerY);
    if (fItemIndex !== -1) {
      const item = fieldItems[fItemIndex]; materials[item.type]++;
      document.getElementById("map-message").innerText = `🖐️ 【${matNames[item.type]}】を ひろった！`;
      updateStatus(); fieldItems.splice(fItemIndex, 1); 
    }
    
    const trapIndex = trapsOnMap.findIndex(t => t.x === playerX && t.y === playerY);
    if (trapIndex !== -1) { trapsOnMap.splice(trapIndex, 1); encounterTrap(); return; }

    let hitEnemyIndex = enemiesOnMap.findIndex(e => e.x === playerX && e.y === playerY);
    if (hitEnemyIndex !== -1) { encounterVisibleMonster(hitEnemyIndex); return; }

    if (Math.random() < 0.20) { encounterRandomMonster(); return; }

    for(let i = 0; i < enemiesOnMap.length; i++) {
      let enemy = enemiesOnMap[i];
      if(Math.abs(playerX - enemy.x) <= 4 && Math.abs(playerY - enemy.y) <= 4) {
        let diffX = playerX - enemy.x; let diffY = playerY - enemy.y;
        let nextEx = enemy.x; let nextEy = enemy.y;
        if (Math.abs(diffX) > Math.abs(diffY)) { nextEx += Math.sign(diffX); } 
        else if (Math.abs(diffY) > Math.abs(diffX)) { nextEy += Math.sign(diffY); } 
        else {
          if (Math.random() < 0.5 && diffX !== 0) nextEx += Math.sign(diffX);
          else if (diffY !== 0) nextEy += Math.sign(diffY);
        }
        if (mapGrid[nextEy][nextEx] !== 1 && !(nextEx === bossX && nextEy === bossY)) { 
          enemy.x = nextEx; enemy.y = nextEy; 
        }
      }
    }

    hitEnemyIndex = enemiesOnMap.findIndex(e => e.x === playerX && e.y === playerY);
    if (hitEnemyIndex !== -1) { encounterVisibleMonster(hitEnemyIndex); return; }

    drawMap(); 
  }
}

function startTimer() { clearInterval(battleTimer); document.getElementById("timer-display").style.display = "none"; }
function stopTimer() { clearInterval(battleTimer); document.getElementById("timer-display").style.display = "none"; }

function encounterTrap() {
  isTrapEncounter = true; currentEnemyIndex = -1; isBossBattle = false; isMimic = false;
  currentMonsterAtk = 1 + Math.floor(level / 3); 
  goToBattle();
  document.getElementById("battle-area").style.display = "block"; document.getElementById("clear-area").style.display = "none";
  document.getElementById("monster-img").innerHTML = "⚡"; 
  document.getElementById("battle-message").innerText = "わなが さどう した！\n急いで けいさん しろ！"; 
  generateQuestion();
}

function encounterMimic() {
  isTrapEncounter = false; currentEnemyIndex = -1; isBossBattle = false; isMimic = true;
  currentMonsterHp = 50 + (level * 2);
  currentMonsterAtk = 8 + Math.floor(level / 2); 
  goToBattle();
  document.getElementById("battle-area").style.display = "block"; document.getElementById("clear-area").style.display = "none";
  document.getElementById("monster-img").innerHTML = "📦"; 
  document.getElementById("battle-message").innerText = "宝ばこ は ミミック だった！\nおそい かかって きた！"; 
  generateQuestion();
}

function encounterBoss() {
  isTrapEncounter = false; currentEnemyIndex = -1; isBossBattle = true; isMimic = false;
  currentMonsterHp = currentBoss.hp;
  currentMonsterAtk = currentBoss.atk; 
  goToBattle();
  document.getElementById("battle-area").style.display = "block"; document.getElementById("clear-area").style.display = "none";
  document.getElementById("monster-img").innerHTML = `<span style="font-size: 80px;">${currentBoss.icon}</span>`; 
  document.getElementById("battle-message").innerText = `ボスの ${currentBoss.name} が たち はだかった！`;
  generateQuestion();
}

function encounterVisibleMonster(index) {
  isTrapEncounter = false; currentEnemyIndex = index; isBossBattle = false; isMimic = false;
  let enemy = enemiesOnMap[index]; 
  currentMonsterHp = enemy.hp; 
  currentMonsterAtk = enemy.atk; 
  goToBattle();
  document.getElementById("battle-area").style.display = "block"; document.getElementById("clear-area").style.display = "none";
  document.getElementById("monster-img").innerHTML = enemy.icon; 
  document.getElementById("battle-message").innerText = `${enemy.name} が あらわれた！`;
  generateQuestion();
}

function encounterRandomMonster() {
  isTrapEncounter = false; currentEnemyIndex = -1; isBossBattle = false; isMimic = false;
  let baseEnemy = monsterData[Math.floor(Math.random() * monsterData.length)];
  let eHp = baseEnemy.hp;
  let eAtk = baseEnemy.atk;
  if (level > 5) { eHp *= 2; eAtk += 1; } 
  if (level > 10) { eHp *= 3; eAtk += 2; }
  if (level > 15) { eHp *= 5; eAtk += 5; }
  currentMonsterHp = eHp;
  currentMonsterAtk = eAtk; 
  
  goToBattle();
  document.getElementById("battle-area").style.display = "block"; document.getElementById("clear-area").style.display = "none";
  document.getElementById("monster-img").innerHTML = baseEnemy.icon; 
  document.getElementById("battle-message").innerText = `とつぜん ${baseEnemy.name} が あらわれた！`;
  generateQuestion();
}

function generateQuestion() {
  stopTimer(); 
  document.getElementById("h-answer").value = "";
  document.getElementById("h-answer-rem").value = "";
  document.getElementById("v-step1").value = "";
  document.getElementById("v-step2").value = "";
  document.getElementById("v-answer").value = "";
  document.getElementById("va-answer").value = "";
  document.getElementById("rem-area").style.display = "none";
  
  document.querySelectorAll('.memo-input').forEach(m => m.value = "");

  let actualStageType = stageType;
  if (stageType === "mixed_hard") {
    const types = ["hissan3x2", "dec_multdiv", "area_calc", "div_rem", "fraction"];
    actualStageType = types[Math.floor(Math.random() * types.length)];
  }

  let isWordProblem = Math.random() < 0.3; 
  let wpCategory = null;
  
  if (actualStageType.startsWith("kuku") && actualStageType !== "kuku_puzzle") wpCategory = "kuku"; 
  else if (actualStageType === "weight") wpCategory = "weight";
  else if (actualStageType.startsWith("add") || actualStageType.startsWith("sub")) wpCategory = "add_sub";
  else if (actualStageType.startsWith("hissan")) wpCategory = "large_mult";
  else if (actualStageType.includes("dec")) wpCategory = "decimal";
  else if (actualStageType === "fraction") wpCategory = "fraction";
  else if (actualStageType === "div_rem") wpCategory = "div_rem";
  else if (actualStageType === "area_calc") wpCategory = "area_calc";
  else if (actualStageType === "time_seconds") wpCategory = "time_seconds";
  else if (actualStageType === "sun_shadow") wpCategory = "sun_shadow";
  else if (actualStageType === "missing_multdiv") wpCategory = "missing_multdiv";
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

  if (actualStageType.startsWith("kuku") || actualStageType === "kuku_puzzle" || actualStageType === "weight" || actualStageType.includes("dec") || actualStageType === "fraction" || actualStageType === "div_rem" || actualStageType === "area_calc" || actualStageType === "time_seconds" || actualStageType === "sun_shadow" || actualStageType === "time_calc" || actualStageType === "time_calc_minutes" || actualStageType === "time_conversion" || actualStageType === "time_conversion2" || actualStageType === "missing_multdiv" || actualStageType === "large_mental") {
    
    document.getElementById("math-horizontal").style.display = "block";
    document.getElementById("math-vertical").style.display = "none";
    document.getElementById("math-vertical-addsub").style.display = "none";
    
    let qText = ""; let qSuffix = "";

    if (actualStageType === "time_conversion2") {
      let p = timeConversion2List[Math.floor(Math.random() * timeConversion2List.length)];
      qText = `${p.q}秒 ＝ `;
      currentAnswer = p.m; 
      currentRem = p.s;    
      qSuffix = " 分";
      document.getElementById("rem-area").style.display = "inline";
      document.getElementById("rem-label").innerText = "";
      document.getElementById("rem-suffix").innerText = "秒";
    }
    else if (actualStageType === "time_conversion") {
      let p = timeConversionList[Math.floor(Math.random() * timeConversionList.length)];
      qText = p.q;
      currentAnswer = p.a;
      qSuffix = " 秒";
    }
    else if (actualStageType === "time_calc_minutes") {
      let p = timeCalcMinutesList[Math.floor(Math.random() * timeCalcMinutesList.length)];
      qText = p.q;
      currentAnswer = p.a;
      qSuffix = " 分";
    }
    else if (actualStageType === "time_calc") {
      let p = timeCalcList[Math.floor(Math.random() * timeCalcList.length)];
      qText = `${p.time}より\n${p.offset}の 時こくは？\n(例: 8時5分 なら 805 )`;
      currentAnswer = p.ans;
      qSuffix = "";
    }
    else if (actualStageType === "kuku_puzzle") {
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
          [r * c, r * (c+1), r * (c+2)],
          [(r+1) * c, (r+1) * (c+1), (r+1) * (c+2)],
          [(r+2) * c, (r+2) * (c+1), (r+2) * (c+2)]
        ];
        
        let missingR = rand(0, 2); let missingC = rand(0, 2);
        currentAnswer = grid[missingR][missingC];
        grid[missingR][missingC] = "? ";
        
        let emptyCount = 0;
        while(emptyCount < 3) {
          let er = rand(0, 2); let ec = rand(0, 2);
          if(grid[er][ec] !== "? " && grid[er][ec] !== "  ") {
            grid[er][ec] = "  "; emptyCount++;
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
          [r * c, r * (c+1)],
          [(r+1) * c, (r+1) * (c+1)]
        ];
        let missingR = rand(0, 1); let missingC = rand(0, 1);
        currentAnswer = grid[missingR][missingC];
        grid[missingR][missingC] = "? ";
        
        if (Math.random() < 0.5) {
          let er = rand(0, 1); let ec = rand(0, 1);
          if(grid[er][ec] !== "? ") grid[er][ec] = "  ";
        }

        qText = "九九表の 一部だ！\n？に 入る 数は？\n\n";
        qText += ` ${pad(grid[0][0])}|${pad(grid[0][1])}\n`;
        qText += ` ---+---\n`;
        qText += ` ${pad(grid[1][0])}|${pad(grid[1][1])}`;
      }
      qSuffix = "";
    }
    else if (actualStageType.startsWith("kuku")) {
      currentNum1 = rand(stageMin, stageMax); currentNum2 = rand(1, 9);
      qText = `${currentNum1} × ${currentNum2} ＝ `; currentAnswer = currentNum1 * currentNum2;

    } else if (actualStageType === "weight") {
      const rv = Math.random();
      if (rv < 0.33) {
        let kg = rand(1, 5); let g = rand(10, 990); qText = `${kg}kg ${g}g ＝ `; qSuffix = " g"; currentAnswer = kg * 1000 + g;
      } else if (rv < 0.66) {
        let kg = rand(1, 5); qText = `${kg * 1000}g ＝ `; qSuffix = " kg"; currentAnswer = kg;
      } else {
        let t = rand(1, 5); qText = `${t}t ＝ `; qSuffix = " kg"; currentAnswer = t * 1000;
      }

    } else if (actualStageType === "decimal") {
      const isAdd = Math.random() < 0.5;
      if (isAdd) { let a = rand(10, 99); let b = rand(10, 99); qText = `${a/10} ＋ ${b/10} ＝ `; currentAnswer = (a + b) / 10;
      } else { let a = rand(10, 99); let b = rand(1, a); qText = `${a/10} － ${b/10} ＝ `; currentAnswer = (a - b) / 10; }

    } else if (actualStageType === "dec_multdiv") {
      const isMult = Math.random() < 0.5;
      if (isMult) { let a = rand(11, 99); let b = rand(2, 9); qText = `${a/10} × ${b} ＝ `; currentAnswer = (a * b) / 10;
      } else { let a = rand(11, 99); let b = rand(2, 9); let prod = a * b; qText = `${prod/10} ÷ ${b} ＝ `; currentAnswer = a / 10; }

    } else if (actualStageType === "fraction") {
      const isAdd = Math.random() < 0.5;
      const den = rand(3, 9);
      if (isAdd) { let num1 = rand(1, den - 1); let num2 = rand(1, den - num1); qText = `${num1}/${den} ＋ ${num2}/${den} ＝ `; qSuffix = ` / ${den}`; currentAnswer = num1 + num2;
      } else { let num1 = rand(2, den - 1); let num2 = rand(1, num1 - 1); qText = `${num1}/${den} － ${num2}/${den} ＝ `; qSuffix = ` / ${den}`; currentAnswer = num1 - num2; }

    } else if (actualStageType === "div_rem") {
      document.getElementById("rem-area").style.display = "inline";
      document.getElementById("rem-label").innerText = "あまり ";
      document.getElementById("rem-suffix").innerText = "";
      let d = rand(2, 9); let q = rand(1, 9); let r = rand(1, d - 1); let n = d * q + r;
      qText = `${n} ÷ ${d} ＝ `; qSuffix = " "; currentAnswer = q; currentRem = r;

    } else if (actualStageType === "area_calc") {
      const isRect = Math.random() < 0.5;
      if (isRect) { let w = rand(2, 12); let h = rand(2, 12); qText = `たて ${h}cm よこ ${w}cmの\n長方形の 広さは？`; qSuffix = " ㎠"; currentAnswer = w * h;
      } else { let b = rand(2, 10)*2; let h = rand(2, 12); qText = `底辺 ${b}cm 高さ ${h}cmの\n三角形の 広さは？`; qSuffix = " ㎠"; currentAnswer = (b * h) / 2; }
    
    } else if (actualStageType === "time_seconds") {
      let min = rand(1, 3); let sec = rand(10, 50);
      qText = `${min}分${sec}秒 ＝ `; qSuffix = " 秒"; currentAnswer = min * 60 + sec;

    } else if (actualStageType === "sun_shadow") {
      let r = Math.random();
      if (r < 0.33) { qText = "太陽が 東に あるとき\nかげは どこ？\n(1:東 2:西 3:南 4:北)"; currentAnswer = 2; }
      else if (r < 0.66) { qText = "太陽が 南に あるとき\nかげは どこ？\n(1:東 2:西 3:南 4:北)"; currentAnswer = 4; }
      else { qText = "かげが 一番 短いのは\n太陽が どこの とき？\n(1:東 2:西 3:南 4:北)"; currentAnswer = 3; }
      qSuffix = "";

    } else if (actualStageType === "missing_multdiv") {
      const isMult = Math.random() < 0.5;
      if (isMult) {
        let a = rand(2, 9); let b = rand(2, 9); let prod = a * b;
        if (Math.random() < 0.5) { qText = `？ × ${b} ＝ ${prod}\n？に 入る 数は？`; currentAnswer = a; } 
        else { qText = `${a} × ？ ＝ ${prod}\n？に 入る 数は？`; currentAnswer = b; }
      } else {
        let a = rand(2, 9); let b = rand(2, 9); let prod = a * b; 
        qText = `${prod} ÷ ？ ＝ ${a}\n？に 入る 数は？`; currentAnswer = b;
      }
      qSuffix = "";

    } else if (actualStageType === "large_mental") {
      const r = Math.random();
      if (r < 0.33) {
        let a = rand(1, 9) * 100; let b = rand(1, 9) * 100;
        qText = `${a} ＋ ${b} ＝ `; currentAnswer = a + b;
      } else if (r < 0.66) {
        let a = rand(11, 20) * 100; let b = rand(1, 9) * 100;
        qText = `${a} － ${b} ＝ `; currentAnswer = a - b;
      } else {
        let a = rand(2, 9) * 100; let b = rand(2, 9);
        qText = `${a} × ${b} ＝ `; currentAnswer = a * b;
      }
      qSuffix = "";
    }

    document.getElementById("q-text").innerText = qText;
    document.getElementById("q-suffix").innerText = qSuffix;
    startTimer(); let input = document.getElementById("h-answer"); setFocus(input); input.focus(); setTimeout(() => input.focus(), 10);
    
  } 
  else if (actualStageType.startsWith("add") || actualStageType.startsWith("sub")) {
    document.getElementById("math-horizontal").style.display = "none";
    document.getElementById("math-vertical").style.display = "none";
    document.getElementById("math-vertical-addsub").style.display = "block";

    let isAdd = actualStageType.startsWith("add");
    let is34 = actualStageType.endsWith("34");
    let n1, n2;

    if (isAdd) {
      if (actualStageType === "add3x3_carry1") {
        let p = add3x3Carry1List[Math.floor(Math.random() * add3x3Carry1List.length)];
        n1 = p[0]; n2 = p[1];
      }
      else if (actualStageType === "add3x3_carry10") {
        let p = add3x3Carry10sList[Math.floor(Math.random() * add3x3Carry10sList.length)];
        n1 = p[0]; n2 = p[1];
      } 
      else if (actualStageType === "add3x3_carry2") {
        let p = add3x3Carry2List[Math.floor(Math.random() * add3x3Carry2List.length)];
        n1 = p[0]; n2 = p[1];
      }
      else if (actualStageType === "add3x3_over1000") {
        let p = add3x3Over1000List[Math.floor(Math.random() * add3x3Over1000List.length)];
        n1 = p[0]; n2 = p[1];
      }
      else if (actualStageType === "add_large") {
        let p = addLargeList[Math.floor(Math.random() * addLargeList.length)];
        n1 = p[0]; n2 = p[1];
      }
      else if (is34) { n1 = rand(100, 9999); n2 = rand(100, 9999); } 
      else { n1 = rand(10, 999); n2 = rand(10, 999); }
      currentAnswer = n1 + n2; document.getElementById("va-sign").innerText = "＋";
    } else {
      if (actualStageType === "sub3x3_borrow1") {
        let p = sub3x3Borrow1List[Math.floor(Math.random() * sub3x3Borrow1List.length)];
        n1 = p[0]; n2 = p[1];
      }
      else if (actualStageType === "sub3x3_borrow2") {
        let p = sub3x3Borrow2List[Math.floor(Math.random() * sub3x3Borrow2List.length)];
        n1 = p[0]; n2 = p[1];
      }
      // ★★★ 今回追加した「大きな数のひき算」ロジック ★★★
      else if (actualStageType === "sub_large") {
        let p = subLargeList[Math.floor(Math.random() * subLargeList.length)];
        n1 = p[0]; n2 = p[1];
      }
      // ------------------------------------------
      else if (is34) { n1 = rand(1000, 9999); n2 = rand(100, n1 - 1); } 
      else { n1 = rand(20, 999); n2 = rand(10, n1 - 1); }
      currentAnswer = n1 - n2; document.getElementById("va-sign").innerText = "－";
    }

    document.getElementById("va-num1").innerText = n1;
    document.getElementById("va-num2").innerText = n2;
    startTimer(); let input = document.getElementById("va-answer"); setFocus(input); input.focus(); setTimeout(() => input.focus(), 10);
  }
  else {
    document.getElementById("math-horizontal").style.display = "none";
    document.getElementById("math-vertical").style.display = "block";
    document.getElementById("math-vertical-addsub").style.display = "none";

    let inputToFocus = document.getElementById("v-step1");
    if (actualStageType === "hissan2x1") {
      currentNum1 = rand(10, 99); currentNum2 = rand(2, 9);   
      document.getElementById("v-step2-area").style.display = "none"; document.getElementById("v-line2").style.display = "none"; document.getElementById("v-ans-area").style.display = "none";
    } else {
      if (actualStageType === "hissan2x2") { 
        let p = hissan2x2List[Math.floor(Math.random() * hissan2x2List.length)];
        currentNum1 = p[0]; currentNum2 = p[1]; 
      } else if (actualStageType === "hissan3x2") { 
        currentNum1 = rand(100, 999); currentNum2 = rand(10, 99); 
      }
      document.getElementById("v-step2-area").style.display = "block"; document.getElementById("v-line2").style.display = "block"; document.getElementById("v-ans-area").style.display = "block";
    }
    document.getElementById("v-num1").innerText = currentNum1; document.getElementById("v-num2").innerText = currentNum2;
    startTimer(); setFocus(inputToFocus); inputToFocus.focus(); setTimeout(() => inputToFocus.focus(), 10);
  }
}

function showCombo() {
  const comboEl = document.getElementById("combo-display");
  if (currentCombo >= 2) {
    comboEl.innerText = `${currentCombo}連けい!`;
    comboEl.style.display = "block";
    comboEl.style.animation = 'none'; comboEl.offsetHeight; comboEl.style.animation = null; 
  }
}

function playAttackEffect(wLv, isCrit) {
  const effectLayer = document.getElementById("effect-layer"); effectLayer.innerHTML = ""; const effect = document.createElement("div");
  if (wLv >= 8) { effect.innerHTML = `<div class="effect-slash" style="transform: rotate(45deg); box-shadow: 0 0 25px #e91e63, 0 0 50px #e91e63;"></div><div class="effect-slash" style="transform: rotate(-45deg); animation-delay: 0.1s;"></div><div class="effect-slash" style="transform: rotate(90deg); animation-delay: 0.2s;"></div><div class="effect-boom" style="animation-delay: 0.25s;">🌌💥</div>`; }
  else if (wLv >= 6) { effect.innerHTML = `<div class="effect-slash" style="transform: rotate(45deg); box-shadow: 0 0 15px #ffeb3b, 0 0 30px #ffeb3b;"></div><div class="effect-slash" style="transform: rotate(-45deg); animation-delay: 0.1s;"></div><div class="effect-boom" style="animation-delay: 0.15s;">⚡💥</div>`; }
  else if (wLv >= 4) { effect.innerHTML = `<div class="effect-slash" style="transform: rotate(45deg); box-shadow: 0 0 15px #ff5722, 0 0 30px #ff5722;"></div><div class="effect-boom" style="animation-delay: 0.1s;">🔥💥</div>`; }
  else if (wLv >= 1) { effect.innerHTML = `<div class="effect-slash" style="transform: rotate(45deg);"></div>`; }
  else { effect.innerHTML = `<div class="effect-slash" style="width: 80px; height: 5px; box-shadow: none; background: #ccc; transform: rotate(0deg);"></div>`; }
  effectLayer.appendChild(effect);
  if (isCrit) { document.body.classList.add("crit-flash-bg"); setTimeout(() => document.body.classList.remove("crit-flash-bg"), 150); }
}

function checkAnswer() {
  if (currentPlayerHp <= 0) return;
  if (!isTrapEncounter && currentMonsterHp <= 0) return; 

  let isCorrect = false; let failMessage = "";
  if (document.getElementById("math-vertical-addsub").style.display === "block") {
    const ans = document.getElementById("va-answer").value;
    if (ans === "") return;
    if (parseInt(ans) === currentAnswer) isCorrect = true; else failMessage = `けいさんが ちがうぞ！`;

  } else if (document.getElementById("rem-area").style.display === "inline") {
    const ans = document.getElementById("h-answer").value; const rAns = document.getElementById("h-answer-rem").value;
    if (ans === "" || rAns === "") return;
    
    if (parseInt(ans) === currentAnswer && parseInt(rAns) === currentRem) {
      isCorrect = true;
    } else {
      let isTime = document.getElementById("rem-suffix").innerText === "秒";
      if (parseInt(ans) !== currentAnswer) {
          failMessage = isTime ? `「分」が ちがうぞ！` : `わり算の こたえが ちがうぞ！`;
      } else {
          failMessage = isTime ? `「秒」が ちがうぞ！` : `あまり が ちがうぞ！`;
      }
    }

  } else if (document.getElementById("math-horizontal").style.display === "block") {
    const ans = document.getElementById("h-answer").value;
    if (ans === "") return;
    if (Math.abs(parseFloat(ans) - currentAnswer) < 0.01) isCorrect = true; else failMessage = `ちがうぞ！`;
    
  } else if (document.getElementById("v-step2-area").style.display === "none") {
    const ans = document.getElementById("v-step1").value;
    if (ans === "") return;
    if (parseInt(ans) === currentNum1 * currentNum2) isCorrect = true; else failMessage = `けいさんが ちがうぞ！`;
  } else {
    const s1 = document.getElementById("v-step1").value; const s2 = document.getElementById("v-step2").value; const ans = document.getElementById("v-answer").value;
    if (s1 === "" || s2 === "" || ans === "") return; 
    const trueS1 = currentNum1 * (currentNum2 % 10); const trueS2 = currentNum1 * Math.floor(currentNum2 / 10); const trueAns = currentNum1 * currentNum2;
    if (parseInt(s1) !== trueS1) failMessage = `1だんめの かけ算が ちがうぞ！`;
    else if (parseInt(s2) !== trueS2) failMessage = `2だんめの かけ算が ちがうぞ！`;
    else if (parseInt(ans) !== trueAns) failMessage = `さいごの たし算が ちがうぞ！`;
    else isCorrect = true;
  }

  stopTimer();

  if (isCorrect) {
    currentCombo++; showCombo();

    if (isTrapEncounter) {
      document.getElementById("monster-img").innerText = "💨"; document.getElementById("battle-message").innerText = "見事に わなを よけた！";
      document.getElementById("battle-area").style.display = "none"; setTimeout(returnToMap, 1500); return;
    }

    document.getElementById("monster-img").classList.add("hit-anim");
    setTimeout(() => { document.getElementById("monster-img").classList.remove("hit-anim"); }, 300);

    let damage = 1 + weaponLevel; 
    if (weaponLevel >= 6) damage += 1; 
    if (weaponLevel >= 9) damage += 2; 
    if (currentCombo >= 3) damage += 1; if (currentCombo >= 5) damage += 2;
    
    let isCrit = false;
    if (Math.random() < 0.20 + (currentCombo * 0.05)) { damage += 3; isCrit = true; } 
    
    let assistMsg = "";
    if (companions.length > 0) {
      if (Math.random() < 0.3) { damage += 2; assistMsg += `\nなかまの ついげき(+2ダメ)!`; }
      if (companions.some(c => rareCompanions.includes(c)) && Math.random() < 0.15) {
        currentPlayerHp += 2; if(currentPlayerHp > playerMaxHp) currentPlayerHp = playerMaxHp;
        assistMsg += ` なかまの かいふく(+2HP)!`; updateStatus();
      }
    }
    
    playAttackEffect(weaponLevel, isCrit);
    currentMonsterHp -= damage; 
    
    if (currentMonsterHp > 0) {
      if (isCrit) { document.getElementById("battle-message").innerText = `かいしんの いちげき！${assistMsg}\n(残りHP：${currentMonsterHp})`;
      } else { document.getElementById("battle-message").innerText = `ヒット！${assistMsg}\n(残りHP：${currentMonsterHp})`; }
      generateQuestion();
    } else {
      if (isBossBattle || isMimic) {
        let rwd = isMimic ? 150 : currentBoss.reward; 
        let xpb = isMimic ? 80 : currentBoss.expBonus;
        gold += rwd; exp += xpb; 
        document.getElementById("monster-img").innerHTML = "💥"; 
        document.getElementById("battle-message").innerText = `${isMimic ? "ミミック" : "ボス"}を たおした！${assistMsg}\n${xpb}EXPと ${rwd}円 ゲット！`;
        checkLevelUp(); updateStatus(); document.getElementById("battle-area").style.display = "none";
        setTimeout(isMimic ? returnToMap : stageClear, 2500); 
      } else {
        let monster = (currentEnemyIndex !== -1) ? enemiesOnMap[currentEnemyIndex] : monsterData[Math.floor(Math.random() * monsterData.length)]; 
        gold += monster.reward; exp += monster.expBonus; 
        document.getElementById("monster-img").innerHTML = "💥"; 
        if (currentEnemyIndex !== -1) { enemiesOnMap.splice(currentEnemyIndex, 1); currentEnemyIndex = -1; }

        let dropMessage = "";
        if (monster.drop && Math.random() < 0.6) { const matKey = monster.drop; materials[matKey]++; dropMessage = `\n【${matNames[matKey]}】を ひろった！`; }
        let joinMessage = "";
        if (Math.random() < 0.2 && !companions.includes(monster.icon) && monster.name !== "だいまおう") { companions.push(monster.icon); joinMessage = `\n${monster.name} が なかまに なった！`; }

        document.getElementById("battle-message").innerText = `たおした！${assistMsg}\n${monster.expBonus}EXPと ${monster.reward}円！${dropMessage}${joinMessage}`;
        checkLevelUp(); updateStatus(); document.getElementById("battle-area").style.display = "none";
        setTimeout(returnToMap, (dropMessage !== "" || joinMessage !== "") ? 2500 : 1500); 
      }
    }
  } else {
    document.body.classList.add("damage-flash-bg"); setTimeout(() => document.body.classList.remove("damage-flash-bg"), 150);
    
    let dmg = Math.max(1, currentMonsterAtk);
    currentPlayerHp -= dmg; 
    shakeScreen(); updateStatus();
    currentCombo = 0; document.getElementById("combo-display").style.display = "none";
    
    if (currentPlayerHp > 0) {
      if (isTrapEncounter) {
        document.getElementById("battle-message").innerText = failMessage + `\nわなに はまり ${dmg} の ダメージ！`;
        document.getElementById("battle-area").style.display = "none"; setTimeout(returnToMap, 1500);
      } else {
        document.getElementById("battle-message").innerText = failMessage + `\n${dmg} の ダメージを うけた！`;
        generateQuestion();
      }
    } else { gameOver(); }
  }
}

function returnToMap() { stopTimer(); goToExplore(); document.getElementById("combo-display").style.display = "none"; }
function shakeScreen() { const container = document.getElementById("game-container"); container.classList.add("shake-effect"); setTimeout(() => { container.classList.remove("shake-effect"); }, 400); }

function gameOver() {
  stopTimer(); document.getElementById("monster-img").innerHTML = "🪦"; 
  document.getElementById("battle-message").innerText = `あなたは たおれて しまった...`;
  document.getElementById("battle-area").style.display = "none"; document.getElementById("clear-area").style.display = "block";
}

function stageClear() {
  stopTimer();
  if (isHardMode) { document.getElementById("monster-img").innerHTML = "👑"; document.getElementById("battle-message").innerText = `【ゲームクリア！】\nボスを たおし、しれんを のりこえた！`;
  } else { document.getElementById("monster-img").innerHTML = "🎁"; gold += 50; updateStatus(); document.getElementById("battle-message").innerText = `ダンジョン クリア！\nおまけ 50円 ゲット！`; }
  document.getElementById("battle-area").style.display = "none"; document.getElementById("clear-area").style.display = "block";
}

function escapeDungeon() { if (confirm("本当にダンジョンから逃げ出して町に戻りますか？")) { goToTown(); } }

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// ★ ふっかつのじゅもん（データ引き継ぎ）処理 ★
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
const PWD_CHARS = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼ";

function exportData() {
  saveData();
  let cValue = 0;
  for (let i = 0; i < allCompanionsList.length; i++) {
    if (companions.includes(allCompanionsList[i])) { cValue += Math.pow(2, i); }
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
  alert(`ふっかつのじゅもん を 作成しました！\n\n「 ${displayStr} 」\n\nわすれないように ノートに メモしておいてね！`);
}

function importData() {
  let ta = document.getElementById("backup-input");
  let str = ta.value.replace(/\s+/g, "").trim(); 
  if (str.length !== 8) {
    alert("じゅもんは 8文字の ひらがな です。かくにんしてね！");
    return;
  }
  
  let n = 0;
  for (let i = 7; i >= 0; i--) {
    let char = str[i];
    let idx = PWD_CHARS.indexOf(char);
    if (idx === -1) {
      alert("つかえない文字が あります。ひらがな を かくにんしてね。");
      return;
    }
    n = n * 64 + idx;
  }

  let wl = n % 16; n = Math.floor(n / 16);
  let al = n % 16; n = Math.floor(n / 16);
  let lv = n % 128; n = Math.floor(n / 128);
  let pt = n % 8; n = Math.floor(n / 8);
  let gld = n % 1024; n = Math.floor(n / 1024);
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
  
  exp = 0; nextExp = 10;
  for (let i = 1; i < level; i++) { nextExp = Math.floor(nextExp * 1.5); }
  playerMaxHp = 5 + ((level - 1) * 2) + armorData[armorLevel].hpBonus;
  currentPlayerHp = playerMaxHp;
  materials = { shizuku: 0, hone: 0, kouseki: 0, maseki: 0, hoshisuna: 0, tsukiishi: 0 };
  
  saveData();
  updateStatus();
  ta.value = "";
  document.getElementById("password-display").innerText = "--------";
  alert("ふっかつのじゅもん が となえられた！\nデータが もとに もどったよ！");
}

loadData();