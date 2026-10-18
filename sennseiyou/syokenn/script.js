"use strict";
/* ============================================================
   所見・指導要録バインダー  ver.5
   - データはこのブラウザの localStorage に保存されます
   - 旧バージョン（v4）のデータは初回起動時に自動で引き継ぎます
   ============================================================ */

// ====== 定数 ======
const STORE_KEY = "shoken_binder_v5";
const LEGACY_KEY = "school_episodes_data_v4";
const LEGACY_SUBJECT_KEY = "school_subjects_data";
const QUICK_DRAFT_KEY = "shoken_binder_quick_draft";
const SAFETY_KEY = "shoken_binder_v5_safety"; // 読込失敗時の退避先

const DEFAULT_SUBJECTS = {
  国語: ["ローマ字", "物語文", "説明文"],
  算数: ["かけ算", "わり算", "大きな数", "あまりのあるわり算"],
  理科: ["昆虫と植物", "太陽と影"],
  社会: ["わたしたちのまち", "地図記号", "店ではたらく人"],
  生活: ["町たんけん", "生き物"],
  図画工作: ["絵画", "工作"],
  音楽: ["歌唱", "器楽"],
  体育: ["器械運動", "走・跳の運動"],
  "外国語・外国語活動": ["共通"],
  道徳: ["共通"],
  総合的な学習: ["共通"],
  学級活動: ["係活動", "話し合い", "レクリエーション"],
  学校行事: ["運動会", "遠足・校外学習", "学習発表会", "その他の行事"],
  "委員会・クラブ": ["委員会", "クラブ"],
  生活面: [
    "生活全般",
    "朝の会・帰りの会",
    "休み時間",
    "給食",
    "清掃",
    "当番・係",
    "登下校",
    "友達関係"
  ],
  その他: ["共通", "休み時間", "給食", "登下校"]
};

// 教科 → 領域（所見の種類と結びつける）
const AREA_OF = {
  生活面: "生活",
  その他: "生活",
  学級活動: "特別活動",
  学校行事: "特別活動",
  "委員会・クラブ": "特別活動",
  道徳: "道徳",
  総合的な学習: "総合"
};
const AREA_ORDER = ["学習", "総合", "道徳", "特別活動", "生活", "未分類"];

const TAG_GROUPS = [
  { key: "学習", label: "学習の観点" },
  { key: "行動", label: "行動の記録（指導要録）" },
  { key: "その他", label: "その他" }
];
const DEFAULT_TAGS = [
  { name: "知識・技能", group: "学習" },
  { name: "思考・判断・表現", group: "学習" },
  { name: "主体的に学習に取り組む態度", group: "学習" },
  { name: "基本的な生活習慣", group: "行動" },
  { name: "健康・体力の向上", group: "行動" },
  { name: "自主・自律", group: "行動" },
  { name: "責任感", group: "行動" },
  { name: "創意工夫", group: "行動" },
  { name: "思いやり・協力", group: "行動" },
  { name: "生命尊重・自然愛護", group: "行動" },
  { name: "勤労・奉仕", group: "行動" },
  { name: "公正・公平", group: "行動" },
  { name: "公共心・公徳心", group: "行動" },
  { name: "主体性", group: "その他" },
  { name: "協調性", group: "その他" },
  { name: "タブレット活用", group: "その他" },
  { name: "係・委員会・行事", group: "その他" },
  { name: "友達関係", group: "その他" },
  { name: "その他", group: "その他" }
];

const DEFAULT_MEMO_PHRASES = [
  "〜する姿が見られた。",
  "〜において主体的に取り組んだ。",
  "友達と協力して〜を成し遂げた。",
  "自分の考えを進んで発表した。",
  "粘り強く最後まで取り組んだ。",
  "困っている友達に声をかけていた。",
  "指導を行ったが、反発する様子が見られた。",
  "事の善悪について話し合い、納得した様子だった。"
];

const SHOKEN_TYPES = [
  {
    key: "総合所見",
    label: "総合所見（通知表）",
    style: "desu",
    target: 200,
    areas: null
  },
  {
    key: "教科",
    label: "教科・単元",
    style: "desu",
    target: 100,
    areas: ["学習"],
    needSubject: true
  },
  {
    key: "生活・行動",
    label: "生活・行動",
    style: "desu",
    target: 100,
    areas: ["生活"],
    tagGroups: ["行動"]
  },
  {
    key: "特別活動",
    label: "特別活動",
    style: "desu",
    target: 80,
    areas: ["特別活動"]
  },
  {
    key: "総合的な学習",
    label: "総合的な学習の時間",
    style: "desu",
    target: 80,
    areas: ["総合"]
  },
  {
    key: "道徳",
    label: "特別の教科 道徳",
    style: "desu",
    target: 80,
    areas: ["道徳"]
  },
  {
    key: "指導要録",
    label: "指導要録（総合所見）",
    style: "dearu",
    target: 250,
    areas: null,
    yearly: true
  }
];
const SHOKEN_STATUSES = ["下書き", "完成", "確認済"];
const YEAR_TERM = "年間";

const BEHAVIOR_TYPES = [
  "友達とのトラブル",
  "暴言・からかい",
  "暴力・危険な行為",
  "物の破損・紛失",
  "授業中の離席・妨害",
  "指示が通りにくい",
  "忘れ物・提出物",
  "遅刻・欠席",
  "いじめ（疑いを含む）",
  "体調不良・けが",
  "情緒の不安定",
  "その他"
];
const BEHAVIOR_LEVELS = [
  { key: 1, label: "軽", cls: "lv1" },
  { key: 2, label: "中", cls: "lv2" },
  { key: 3, label: "重", cls: "lv3" }
];
const BEHAVIOR_STATUSES = ["対応中", "経過観察", "解決"];
const PLACES = [
  "教室",
  "廊下",
  "運動場",
  "体育館",
  "特別教室",
  "トイレ",
  "登下校中",
  "校外",
  "その他"
];

const PARENT_METHODS = [
  "電話",
  "連絡帳",
  "面談",
  "家庭訪問",
  "メール・連絡アプリ",
  "来校",
  "その他"
];
const PARENT_PARTNERS = ["母", "父", "祖父母", "保護者", "その他"];
const PARENT_DIRECTIONS = ["学校から", "保護者から"];

// グラフ色（色覚多様性に配慮した検証済みパレット）
const C = {
  s1: "#2a78d6",
  s2: "#eb6834",
  s3: "#1baf7a",
  s4: "#eda100",
  s5: "#e87ba4",
  avg: "#898781",
  grid: "#e1e0d9",
  axis: "#c3c2b7",
  ink: "#0b0b0b",
  ink2: "#52514e",
  muted: "#898781",
  ramp: ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95"],
  good: "#0ca30c",
  warning: "#fab219",
  serious: "#ec835a",
  critical: "#d03b3b"
};

// ====== 小さな道具 ======
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clone = (o) => JSON.parse(JSON.stringify(o));
const pad = (n) => String(n).padStart(2, "0");
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const nowISO = () => new Date().toISOString();

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
const nl2br = (s) => esc(s).replace(/\r?\n/g, "<br>");
const charCount = (s) => String(s || "").replace(/\r?\n/g, "").length;
const nameKey = (s) => String(s || "").replace(/[\s　]+/g, "");
const cleanName = (s) =>
  String(s || "")
    .replace(/　/g, " ")
    .replace(/\s+/g, " ")
    .trim();
function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}
function regEsc(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ====== 日付 ======
const WD = "日月火水木金土";
function ymd(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function todayStr() {
  return ymd(new Date());
} // ※ローカル時刻（朝9時前に前日になる問題を解消）
function parseYmd(s) {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
function addDays(s, n) {
  const d = parseYmd(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
}
function fmtMD(s) {
  if (!s) return "";
  const d = parseYmd(s);
  return `${d.getMonth() + 1}/${d.getDate()}(${WD[d.getDay()]})`;
}
function fmtFull(s) {
  if (!s) return "";
  const d = parseYmd(s);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${
    WD[d.getDay()]
  })`;
}
function fmtSlash(s) {
  if (!s) return "";
  const d = parseYmd(s);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}
function fmtDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
function daysAgo(s) {
  if (!s) return null;
  return Math.round((parseYmd(todayStr()) - parseYmd(s)) / 86400000);
}
function currentSchoolYear(d = new Date()) {
  return d.getMonth() + 1 >= 4 ? d.getFullYear() : d.getFullYear() - 1;
}
function nendoLabel(y) {
  y = Number(y);
  return y >= 2019 ? `令和${y - 2018}年度` : `${y}年度`;
}
function normDate(v) {
  if (v == null || v === "") return "";
  if (v instanceof Date && !isNaN(v)) {
    // Excelの日付はUTC 0時で届くのでUTCの年月日を使う
    return `${v.getUTCFullYear()}-${pad(v.getUTCMonth() + 1)}-${pad(
      v.getUTCDate()
    )}`;
  }
  if (typeof v === "number" && v > 20000 && v < 80000) {
    // Excelのシリアル値
    const d = new Date(Math.round((v - 25569) * 86400000));
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
      d.getUTCDate()
    )}`;
  }
  const s = String(v)
    .trim()
    .replace(/[年月]/g, "/")
    .replace(/日.*$/, "")
    .replace(/\(.\)/, "");
  const m = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
  if (m) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  const m2 = s.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m2) return `${m2[1]}-${m2[2]}-${m2[3]}`;
  return "";
}
function schoolMonths(year) {
  const y = Number(year),
    list = [];
  for (let i = 0; i < 12; i++) {
    const m = ((3 + i) % 12) + 1,
      yy = m >= 4 ? y : y + 1;
    list.push({ key: `${yy}-${pad(m)}`, label: `${m}月` });
  }
  return list;
}

// ====== 学期 ======
function makeTerms(y, n) {
  y = Number(y);
  if (Number(n) === 2)
    return [
      { name: "前期", start: `${y}-04-01`, end: `${y}-10-10` },
      { name: "後期", start: `${y}-10-11`, end: `${y + 1}-03-31` }
    ];
  return [
    { name: "1学期", start: `${y}-04-01`, end: `${y}-08-31` },
    { name: "2学期", start: `${y}-09-01`, end: `${y}-12-31` },
    { name: "3学期", start: `${y + 1}-01-01`, end: `${y + 1}-03-31` }
  ];
}
function yearRange() {
  const y = Number(state.settings.schoolYear);
  return { start: `${y}-04-01`, end: `${y + 1}-03-31` };
}
function termRange(name) {
  if (name === YEAR_TERM) return yearRange();
  const t = state.settings.terms.find((t) => t.name === name);
  return t ? { start: t.start, end: t.end } : yearRange();
}
function termOf(date) {
  const t = state.settings.terms.find((t) => date >= t.start && date <= t.end);
  return t ? t.name : "";
}
function currentTerm() {
  const today = todayStr(),
    terms = state.settings.terms;
  const t = terms.find((t) => today >= t.start && today <= t.end);
  if (t) return t.name;
  if (terms.length && today < terms[0].start) return terms[0].name;
  return terms.length ? terms[terms.length - 1].name : "";
}
// 期間フィルタ（全期間・学期・今月など）
function periodOptions(includeRecent = true) {
  const list = [{ key: "all", label: "全期間" }];
  state.settings.terms.forEach((t) =>
    list.push({ key: "t:" + t.name, label: t.name })
  );
  if (includeRecent) {
    list.push({ key: "month", label: "今月" });
    list.push({ key: "last14", label: "直近2週間" });
    list.push({ key: "last30", label: "直近30日" });
  }
  return list;
}
function periodRange(key) {
  const today = todayStr();
  if (!key || key === "all") return null;
  if (key.startsWith("t:")) return termRange(key.slice(2));
  if (key === "month")
    return { start: today.slice(0, 8) + "01", end: today.slice(0, 8) + "31" };
  if (key === "last14") return { start: addDays(today, -13), end: today };
  if (key === "last30") return { start: addDays(today, -29), end: today };
  return null;
}
function periodLabel(key) {
  const o = periodOptions().find((o) => o.key === key);
  return o ? o.label : "全期間";
}
function inRange(date, r) {
  return !r || (date >= r.start && date <= r.end);
}
function periodSelectHTML(id, value, includeRecent = true) {
  return `<select id="${id}">${periodOptions(includeRecent)
    .map(
      (o) =>
        `<option value="${esc(o.key)}" ${
          o.key === value ? "selected" : ""
        }>${esc(o.label)}</option>`
    )
    .join("")}</select>`;
}

// ====== 状態 ======
let state = null;

function defaultState() {
  const y = currentSchoolYear();
  return {
    version: 5,
    settings: {
      schoolYear: y,
      schoolName: "",
      grade: "",
      className: "",
      teacher: "",
      termSystem: 3,
      terms: makeTerms(y, 3),
      targets: Object.fromEntries(SHOKEN_TYPES.map((t) => [t.key, t.target])),
      maskNames: false,
      lastBackupAt: null,
      createdAt: nowISO()
    },
    students: [],
    subjects: clone(DEFAULT_SUBJECTS),
    tags: clone(DEFAULT_TAGS),
    memoPhrases: DEFAULT_MEMO_PHRASES.slice(),
    myPhrases: [],
    episodes: [],
    shoken: [],
    behaviors: [],
    parents: []
  };
}

function normStudent(s) {
  return {
    id: s.id || uid(),
    no: s.no === "" || s.no == null || isNaN(Number(s.no)) ? "" : Number(s.no),
    name: cleanName(s.name),
    kana: cleanName(s.kana || ""),
    gender: s.gender || "",
    care: s.care || "",
    handover: s.handover || "",
    memo: s.memo || "",
    createdAt: s.createdAt || nowISO()
  };
}
function normEpisode(e) {
  let tags = Array.isArray(e.tags)
    ? e.tags
    : e.tag
    ? String(e.tag).split(/[、,，／\/]/)
    : [];
  tags = tags.map((t) => String(t).trim()).filter(Boolean);
  return {
    id: e.id || uid(),
    studentId: e.studentId || "",
    date: normDate(e.date) || todayStr(),
    subject: e.subject || "",
    unit: e.unit || "",
    tags,
    content: String(e.content || ""),
    isGuidance: !!e.isGuidance,
    star: !!e.star,
    quick: !!e.quick,
    createdAt: e.createdAt || nowISO(),
    updatedAt: e.updatedAt || e.createdAt || nowISO()
  };
}
function normShoken(k) {
  return {
    id: k.id || uid(),
    studentId: k.studentId || "",
    term: k.term || "",
    type: k.type || "総合所見",
    subject: k.subject || "",
    unit: k.unit || "",
    text: String(k.text || ""),
    status: SHOKEN_STATUSES.includes(k.status) ? k.status : "下書き",
    episodeIds: Array.isArray(k.episodeIds) ? k.episodeIds : [],
    updatedAt: k.updatedAt || nowISO()
  };
}
function normBehavior(b) {
  return {
    id: b.id || uid(),
    studentId: b.studentId || "",
    date: normDate(b.date) || todayStr(),
    time: b.time || "",
    place: b.place || "",
    type: b.type || "その他",
    level: [1, 2, 3].includes(Number(b.level)) ? Number(b.level) : 1,
    situation: b.situation || "",
    response: b.response || "",
    related: b.related || "",
    followup: b.followup || "",
    parentContacted: !!b.parentContacted,
    reported: !!b.reported,
    status: BEHAVIOR_STATUSES.includes(b.status) ? b.status : "対応中",
    createdAt: b.createdAt || nowISO(),
    updatedAt: b.updatedAt || b.createdAt || nowISO()
  };
}
function normParent(p) {
  return {
    id: p.id || uid(),
    studentId: p.studentId || "",
    date: normDate(p.date) || todayStr(),
    time: p.time || "",
    method: p.method || "電話",
    partner: p.partner || "保護者",
    direction: PARENT_DIRECTIONS.includes(p.direction)
      ? p.direction
      : "学校から",
    topic: p.topic || "",
    content: p.content || "",
    response: p.response || "",
    followUp: !!p.followUp,
    followUpDate: normDate(p.followUpDate) || "",
    followUpDone: !!p.followUpDone,
    shared: p.shared || "",
    createdAt: p.createdAt || nowISO(),
    updatedAt: p.updatedAt || p.createdAt || nowISO()
  };
}
function mergeSubjects(base) {
  const out = {};
  Object.keys(base).forEach((k) => {
    if (k !== "その他" && Array.isArray(base[k])) out[k] = base[k].slice();
  });
  Object.keys(DEFAULT_SUBJECTS).forEach((k) => {
    if (k !== "その他" && !out[k]) out[k] = DEFAULT_SUBJECTS[k].slice();
  });
  out["その他"] = Array.isArray(base["その他"])
    ? base["その他"].slice()
    : DEFAULT_SUBJECTS["その他"].slice();
  return out;
}

function normalizeState(s) {
  const d = defaultState();
  s = s && typeof s === "object" ? s : {};
  const out = Object.assign({}, d, s);
  out.settings = Object.assign({}, d.settings, s.settings || {});
  out.settings.targets = Object.assign(
    {},
    d.settings.targets,
    (s.settings || {}).targets || {}
  );
  if (!Array.isArray(out.settings.terms) || !out.settings.terms.length)
    out.settings.terms = makeTerms(
      out.settings.schoolYear,
      out.settings.termSystem
    );
  [
    "students",
    "episodes",
    "shoken",
    "behaviors",
    "parents",
    "myPhrases"
  ].forEach((k) => {
    if (!Array.isArray(out[k])) out[k] = [];
  });
  if (
    !out.subjects ||
    typeof out.subjects !== "object" ||
    Array.isArray(out.subjects)
  )
    out.subjects = clone(DEFAULT_SUBJECTS);
  if (!Array.isArray(out.tags) || !out.tags.length)
    out.tags = clone(DEFAULT_TAGS);
  if (!Array.isArray(out.memoPhrases))
    out.memoPhrases = DEFAULT_MEMO_PHRASES.slice();
  out.students = out.students.filter((x) => x && x.name).map(normStudent);
  state = out; // ensureStudent などが state を参照するため先に入れる
  out.episodes = out.episodes.filter(Boolean).map((e) => {
    const n = normEpisode(e);
    if (!n.studentId && e.name) n.studentId = ensureStudent(e.name).id;
    n.tags.forEach(ensureTag);
    if (n.subject && !out.subjects[n.subject])
      out.subjects[n.subject] = n.unit ? [n.unit] : ["共通"];
    if (n.subject && n.unit && !out.subjects[n.subject].includes(n.unit))
      out.subjects[n.subject].push(n.unit);
    return n;
  });
  out.shoken = out.shoken.filter(Boolean).map(normShoken);
  out.behaviors = out.behaviors.filter(Boolean).map(normBehavior);
  out.parents = out.parents.filter(Boolean).map(normParent);
  out.myPhrases = out.myPhrases
    .filter((p) => p && p.text)
    .map((p) => ({
      id: p.id || uid(),
      group: p.group || "マイ文例",
      text: String(p.text)
    }));
  out.version = 5;
  return out;
}

// ====== 保存・読込 ======
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error(e);
    toast(
      "保存できませんでした。容量不足の可能性があります。Excel出力やバックアップで書き出してください。",
      { type: "error", duration: 9000 }
    );
    return false;
  }
}

function load() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORE_KEY);
  } catch (e) {
    raw = null;
  }
  if (raw) {
    try {
      normalizeState(JSON.parse(raw));
      return { migrated: 0 };
    } catch (e) {
      console.error(e);
      try {
        localStorage.setItem(SAFETY_KEY, raw);
      } catch (_) {
        /* noop */
      }
      normalizeState(null);
      return { error: true };
    }
  }
  normalizeState(null);
  return { migrated: migrateLegacy() };
}

// 旧バージョン（v4）からの引き継ぎ
function migrateLegacy() {
  let legacyEps = [],
    legacySubjects = null;
  try {
    legacyEps = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
  } catch (e) {
    legacyEps = [];
  }
  try {
    legacySubjects = JSON.parse(
      localStorage.getItem(LEGACY_SUBJECT_KEY) || "null"
    );
  } catch (e) {
    legacySubjects = null;
  }
  if (legacySubjects && typeof legacySubjects === "object")
    state.subjects = mergeSubjects(legacySubjects);
  if (!Array.isArray(legacyEps) || !legacyEps.length) return 0;
  importLegacyEpisodes(legacyEps);
  save(); // 旧データ（LEGACY_KEY）は消さずに残しておく
  return legacyEps.length;
}

// 旧形式（name, tag ...）のエピソード配列を取り込む
function importLegacyEpisodes(list) {
  // 名簿：最初に登場した順ではなく名前順に番号をふる
  const names = [
    ...new Set(list.map((e) => cleanName(e.name)).filter(Boolean))
  ];
  names.sort((a, b) => a.localeCompare(b, "ja"));
  names.forEach((n) => ensureStudent(n));
  let count = 0;
  list.forEach((e) => {
    if (!e || !e.name || !e.content) return;
    const ep = normEpisode(e);
    ep.studentId = ensureStudent(e.name).id;
    ep.tags.forEach(ensureTag);
    if (ep.subject && !state.subjects[ep.subject])
      state.subjects[ep.subject] = [];
    if (ep.subject && ep.unit && !state.subjects[ep.subject].includes(ep.unit))
      state.subjects[ep.subject].push(ep.unit);
    state.episodes.push(ep);
    count++;
  });
  return count;
}

// ====== 児童 ======
function studentsSorted() {
  return state.students.slice().sort((a, b) => {
    const an = a.no === "" ? 9999 : a.no,
      bn = b.no === "" ? 9999 : b.no;
    if (an !== bn) return an - bn;
    return (a.kana || a.name).localeCompare(b.kana || b.name, "ja");
  });
}
function getStudent(id) {
  return state.students.find((s) => s.id === id) || null;
}
function findStudentByName(name) {
  const k = nameKey(name);
  return k ? state.students.find((s) => nameKey(s.name) === k) || null : null;
}
function nextStudentNo() {
  return (
    state.students.reduce((m, s) => Math.max(m, s.no === "" ? 0 : s.no), 0) + 1
  );
}
function ensureStudent(name, extra = {}) {
  name = cleanName(name);
  let s = findStudentByName(name);
  if (s) return s;
  s = normStudent(Object.assign({ name, no: nextStudentNo() }, extra));
  state.students.push(s);
  return s;
}
function realName(id) {
  const s = getStudent(id);
  return s ? s.name : "（不明）";
}
// 画面表示用（「名前を隠す」モードに対応）
function dispName(s) {
  if (!s) return "（不明）";
  if (state.settings.maskNames) return s.no !== "" ? `No.${s.no}` : "No.-";
  return s.name;
}
function sLabel(id, withNo = true) {
  const s = getStudent(id);
  if (!s) return "（不明）";
  if (state.settings.maskNames) return dispName(s);
  return withNo && s.no !== "" ? `${s.no} ${s.name}` : s.name;
}
function studentMatch(s, q) {
  if (!q) return true;
  q = nameKey(q).toLowerCase();
  return (
    nameKey(s.name).toLowerCase().includes(q) ||
    nameKey(s.kana).includes(q) ||
    String(s.no) === q
  );
}

// ====== 教科・タグ ======
function areaOf(subject) {
  if (!subject) return "未分類";
  return AREA_OF[subject] || "学習";
}
function subjectList() {
  return Object.keys(state.subjects);
}
function ensureTag(name) {
  if (!name) return;
  if (!state.tags.some((t) => t.name === name))
    state.tags.push({ name, group: "その他" });
}
function tagGroupOf(name) {
  const t = state.tags.find((t) => t.name === name);
  return t ? t.group : "その他";
}
function tagsOfGroup(g) {
  return state.tags.filter((t) => t.group === g).map((t) => t.name);
}
function subjectOptionsHTML(
  selected,
  { blank = true, blankLabel = "（未選択）" } = {}
) {
  return (
    (blank ? `<option value="">${esc(blankLabel)}</option>` : "") +
    subjectList()
      .map(
        (s) =>
          `<option value="${esc(s)}" ${s === selected ? "selected" : ""}>${esc(
            s
          )}</option>`
      )
      .join("")
  );
}
function unitOptionsHTML(subject, selected) {
  const units = (state.subjects[subject] || []).slice();
  if (selected && !units.includes(selected)) units.push(selected);
  return (
    `<option value="">（なし）</option>` +
    units
      .map(
        (u) =>
          `<option value="${esc(u)}" ${u === selected ? "selected" : ""}>${esc(
            u
          )}</option>`
      )
      .join("")
  );
}

// ====== 記録の取り出し ======
function episodesOf(sid, range) {
  return state.episodes.filter(
    (e) => e.studentId === sid && inRange(e.date, range)
  );
}
function behaviorsOf(sid, range) {
  return state.behaviors.filter(
    (b) => b.studentId === sid && inRange(b.date, range)
  );
}
function parentsOf(sid, range) {
  return state.parents.filter(
    (p) => p.studentId === sid && inRange(p.date, range)
  );
}
function usedEpisodeIds() {
  const set = new Set();
  state.shoken.forEach((k) => k.episodeIds.forEach((id) => set.add(id)));
  return set;
}
function findShoken(sid, term, type, subject = "") {
  return (
    state.shoken.find(
      (k) =>
        k.studentId === sid &&
        k.term === term &&
        k.type === type &&
        (k.subject || "") === (subject || "")
    ) || null
  );
}
function shokenType(key) {
  return SHOKEN_TYPES.find((t) => t.key === key) || SHOKEN_TYPES[0];
}
function episodeFitsType(ep, typeKey) {
  const t = shokenType(typeKey);
  if (!t.areas) return true;
  if (t.areas.includes(areaOf(ep.subject))) return true;
  if (
    t.tagGroups &&
    ep.tags.some((tag) => t.tagGroups.includes(tagGroupOf(tag)))
  )
    return true;
  return false;
}
function levelInfo(lv) {
  return (
    BEHAVIOR_LEVELS.find((l) => l.key === Number(lv)) || BEHAVIOR_LEVELS[0]
  );
}
function classLabel() {
  const s = state.settings;
  const parts = [nendoLabel(s.schoolYear)];
  if (s.grade || s.className)
    parts.push(`${s.grade ? s.grade + "年" : ""}${s.className || ""}`);
  if (s.teacher) parts.push(`担任 ${s.teacher}`);
  return parts.join("　");
}

// ============================================================
//  画面の共通部品（モーダル・トースト・児童選択・タグ選択など）
// ============================================================
const ui = {
  view: "home",
  param: null,
  refresh: null,
  rec: {
    student: "",
    subject: "",
    tag: "",
    period: "all",
    q: "",
    guid: false,
    quick: false,
    star: false,
    sort: "dateDesc",
    limit: 300
  },
  recSelected: new Set(),
  stu: { q: "", sort: "no", period: "all" },
  stuTab: "overview",
  stuPeriod: "all",
  sk: {
    term: "",
    type: "総合所見",
    subject: "",
    sid: "",
    tab: "eps",
    allPeriod: false,
    allArea: false,
    style: "",
    intro: "",
    closing: "auto"
  },
  beh: { student: "", type: "", status: "", period: "all", q: "" },
  par: { student: "", method: "", period: "all", q: "", followOnly: false },
  anaPeriod: "all",
  lastQuick: { subject: "", unit: "", tags: [], kind: "episode" }
};
const VIEWS = {};
const ACTIONS = {};

// ---------- トースト ----------
function toast(msg, opt = {}) {
  const root = $("#toast-root");
  if (!root) {
    alert(msg);
    return;
  }
  const el = document.createElement("div");
  el.className = "toast " + (opt.type ? "toast-" + opt.type : "");
  el.innerHTML = `<span>${esc(msg)}</span>${
    opt.actionLabel
      ? `<button type="button" class="toast-action">${esc(
          opt.actionLabel
        )}</button>`
      : ""
  }`;
  root.appendChild(el);
  while (root.children.length > 3) root.firstElementChild.remove(); // 多くても3つまで
  requestAnimationFrame(() => el.classList.add("show"));
  const close = () => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  };
  if (opt.actionLabel)
    el.querySelector(".toast-action").addEventListener("click", () => {
      opt.onAction && opt.onAction();
      close();
    });
  setTimeout(close, opt.duration || (opt.actionLabel ? 6000 : 3000));
}

// ---------- モーダル ----------
let modalOnClose = null;
function openModal({
  title,
  body = "",
  footer = "",
  wide = false,
  onClose = null,
  cls = ""
}) {
  closeModal(true);
  const root = $("#modal-root");
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal ${
        wide ? "modal-wide" : ""
      } ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="modal-head"><h3>${esc(
          title
        )}</h3><button type="button" class="icon-btn" data-act="close-modal" aria-label="閉じる">✕</button></div>
        <div class="modal-body"></div>
        ${footer !== null ? `<div class="modal-foot"></div>` : ""}
      </div>
    </div>`;
  const m = $(".modal", root);
  const b = $(".modal-body", m);
  if (typeof body === "string") b.innerHTML = body;
  else if (body) b.appendChild(body);
  if (footer !== null && $(".modal-foot", m))
    $(".modal-foot", m).innerHTML = footer;
  modalOnClose = onClose;
  document.body.classList.add("modal-open");
  $(".modal-backdrop", root).addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("modal-backdrop")) closeModal();
  });
  setTimeout(() => {
    const f =
      $("[autofocus]", m) ||
      $("input:not([type=checkbox]):not([type=hidden]),textarea,select", m);
    if (f && !("ontouchstart" in window)) f.focus();
  }, 30);
  return m;
}
function closeModal(silent) {
  const root = $("#modal-root");
  if (!root || !root.innerHTML) return;
  const cb = modalOnClose;
  modalOnClose = null;
  root.innerHTML = "";
  document.body.classList.remove("modal-open");
  if (!silent && cb) cb();
}
function modalOpen() {
  const r = $("#modal-root");
  return !!(r && r.innerHTML);
}
function confirmModal({
  title = "確認",
  message,
  okLabel = "OK",
  danger = false,
  onOk
}) {
  const m = openModal({
    title,
    body: `<p class="confirm-msg">${nl2br(message)}</p>`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn ${
      danger ? "btn-danger" : "btn-primary"
    }" id="confirm-ok">${esc(okLabel)}</button>`
  });
  $("#confirm-ok", m).addEventListener("click", () => {
    closeModal(true);
    onOk && onOk();
  });
  $("#confirm-ok", m).focus();
}

// ---------- ツールチップ（グラフ用） ----------
function setupTooltip() {
  const tip = $("#tooltip");
  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest && e.target.closest("[data-tip]");
    if (!t) {
      tip.classList.remove("show");
      return;
    }
    tip.innerHTML = t.getAttribute("data-tip");
    tip.classList.add("show");
  });
  document.addEventListener("mousemove", (e) => {
    if (!tip.classList.contains("show")) return;
    const w = tip.offsetWidth,
      h = tip.offsetHeight;
    let x = e.clientX + 14,
      y = e.clientY + 14;
    if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
    if (y + h > window.innerHeight - 8) y = e.clientY - h - 14;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  });
}

// ---------- 日付入力（今日・昨日・一昨日ボタン付き） ----------
function dateFieldHTML(cls, value) {
  return `<div class="date-field"><input type="date" class="${cls}" value="${esc(
    value || todayStr()
  )}" required>
    <div class="date-quick"><button type="button" data-shift="0">今日</button><button type="button" data-shift="-1">昨日</button><button type="button" data-shift="-2">一昨日</button></div></div>`;
}

// ---------- 児童選択（チップ式） ----------
function studentPicker(
  el,
  {
    multi = true,
    selected = [],
    onChange = null,
    allowAdd = true,
    placeholder
  } = {}
) {
  let sel = new Set(selected.filter(Boolean));
  el.classList.add("spicker");
  el.innerHTML = `
    <div class="spicker-top">
      <input type="search" class="spicker-search" placeholder="${esc(
        placeholder ||
          (allowAdd
            ? "名前・番号で検索／Enterで新規追加"
            : "名前・番号で絞り込み")
      )}" autocomplete="off">
      <span class="spicker-count"></span>
      ${
        multi
          ? `<button type="button" class="link-btn spicker-clear">解除</button>`
          : ""
      }
    </div>
    <div class="spicker-grid"></div>`;
  const search = $(".spicker-search", el),
    grid = $(".spicker-grid", el),
    count = $(".spicker-count", el);
  function draw() {
    const q = search.value.trim();
    const list = studentsSorted().filter((s) => studentMatch(s, q));
    const exact =
      q && state.students.some((s) => nameKey(s.name) === nameKey(q));
    let html = list
      .map(
        (s) =>
          `<button type="button" class="schip ${
            sel.has(s.id) ? "on" : ""
          }" data-sid="${s.id}" aria-pressed="${sel.has(
            s.id
          )}"><span class="schip-no">${s.no === "" ? "" : s.no}</span>${esc(
            dispName(s)
          )}</button>`
      )
      .join("");
    if (allowAdd && q && !exact && !/^\d+$/.test(q))
      html += `<button type="button" class="schip schip-add" data-add="1">＋「${esc(
        q
      )}」を名簿に追加</button>`;
    if (!state.students.length && !q)
      html = `<span class="muted small">名簿が空です。上の欄に名前を入力して Enter で追加できます。</span>`;
    else if (!list.length && !(allowAdd && q))
      html = `<span class="muted small">該当する児童がいません</span>`;
    grid.innerHTML = html;
    count.textContent = sel.size ? `${sel.size}人選択` : "";
  }
  function addNew() {
    const q = cleanName(search.value);
    if (!q) return;
    const s = ensureStudent(q);
    save();
    toast(`「${s.name}」さんを名簿に追加しました（No.${s.no}）`);
    if (!multi) sel.clear();
    sel.add(s.id);
    search.value = "";
    draw();
    onChange && onChange([...sel]);
  }
  grid.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.add) {
      addNew();
      return;
    }
    const id = b.dataset.sid;
    if (multi) {
      sel.has(id) ? sel.delete(id) : sel.add(id);
    } else {
      sel = sel.has(id) ? new Set() : new Set([id]);
    }
    draw();
    onChange && onChange([...sel]);
  });
  search.addEventListener("input", draw);
  search.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.isComposing) return;
    e.preventDefault();
    const q = search.value.trim();
    if (!q) return;
    const list = studentsSorted().filter((s) => studentMatch(s, q));
    const exact = list.find(
      (s) => nameKey(s.name) === nameKey(q) || String(s.no) === q
    );
    const pick = exact || (list.length === 1 ? list[0] : null);
    if (pick) {
      if (!multi) sel.clear();
      sel.add(pick.id);
      search.value = "";
      draw();
      onChange && onChange([...sel]);
    } else if (allowAdd && !/^\d+$/.test(q)) addNew();
  });
  const clr = $(".spicker-clear", el);
  if (clr)
    clr.addEventListener("click", () => {
      sel.clear();
      draw();
      onChange && onChange([]);
    });
  draw();
  return {
    get: () => [...sel],
    set(ids) {
      sel = new Set(ids.filter(Boolean));
      if (!multi && sel.size > 1) sel = new Set([ids[0]]);
      draw();
    },
    clear() {
      sel.clear();
      search.value = "";
      draw();
    },
    focus() {
      search.focus();
    },
    setMulti(m) {
      multi = m;
      if (!m && sel.size > 1) sel = new Set([[...sel][0]]);
      draw();
    }
  };
}

// ---------- 観点タグ選択（複数可） ----------
function tagPicker(el, { selected = [], onChange = null } = {}) {
  let sel = new Set(selected);
  function draw() {
    el.innerHTML = TAG_GROUPS.map((g) => {
      const tags = tagsOfGroup(g.key);
      if (!tags.length) return "";
      return `<div class="tag-group"><span class="tag-group-label">${esc(
        g.label
      )}</span><div class="tag-chips">${tags
        .map(
          (t) =>
            `<button type="button" class="tchip ${
              sel.has(t) ? "on" : ""
            }" data-tag="${esc(t)}" aria-pressed="${sel.has(t)}">${esc(
              t
            )}</button>`
        )
        .join("")}</div></div>`;
    }).join("");
  }
  el.classList.add("tpicker");
  el.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip");
    if (!b) return;
    const t = b.dataset.tag;
    sel.has(t) ? sel.delete(t) : sel.add(t);
    draw();
    onChange && onChange([...sel]);
  });
  draw();
  return {
    get: () => [...sel],
    set(list) {
      sel = new Set(list);
      draw();
    },
    clear() {
      sel.clear();
      draw();
    }
  };
}

// ---------- 教科・単元のセレクト連動 ----------
function bindSubjectUnit(subjectSel, unitSel, unit = "") {
  const fill = (u) => {
    unitSel.innerHTML = unitOptionsHTML(subjectSel.value, u);
  };
  subjectSel.addEventListener("change", () => fill(""));
  fill(unit);
  return fill;
}

// ---------- 音声入力 ----------
function attachMic(btn, textarea) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!btn) return;
  if (!SR) {
    btn.remove();
    return;
  }
  btn.title =
    "音声入力（もう一度押すと停止）※音声はブラウザの音声認識サービスで文字にされます";
  let rec = null,
    on = false;
  btn.addEventListener("click", () => {
    if (on) {
      rec && rec.stop();
      return;
    }
    rec = new SR();
    rec.lang = "ja-JP";
    rec.interimResults = false;
    rec.continuous = true;
    rec.onresult = (ev) => {
      let txt = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++)
        if (ev.results[i].isFinal) txt += ev.results[i][0].transcript;
      if (!txt) return;
      insertAtCursor(textarea, txt);
    };
    rec.onend = () => {
      on = false;
      btn.classList.remove("recording");
    };
    rec.onerror = (ev) => {
      on = false;
      btn.classList.remove("recording");
      if (ev.error === "not-allowed")
        toast("マイクの使用が許可されていません", { type: "error" });
    };
    try {
      rec.start();
      on = true;
      btn.classList.add("recording");
      toast("🎤 話してください（もう一度押すと停止）");
    } catch (e) {
      on = false;
    }
  });
}
function insertAtCursor(ta, text) {
  const s = ta.selectionStart ?? ta.value.length,
    e = ta.selectionEnd ?? ta.value.length;
  ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = s + text.length;
  ta.dispatchEvent(new Event("input", { bubbles: true }));
}
function phraseButtonsHTML() {
  return (
    `<span class="qp-label">時短入力:</span>` +
    state.memoPhrases
      .map(
        (p) =>
          `<button type="button" class="phrase-btn" data-text="${esc(p)}">${esc(
            p.length > 14 ? p.slice(0, 13) + "…" : p
          )}</button>`
      )
      .join("")
  );
}
function bindPhraseButtons(box, ta) {
  box.addEventListener("click", (e) => {
    const b = e.target.closest(".phrase-btn");
    if (b) insertAtCursor(ta, b.dataset.text);
  });
}

// ---------- 小物 ----------
function agoLabel(date) {
  const d = daysAgo(date);
  if (d == null) return "記録なし";
  return d === 0 ? "今日" : d > 0 ? `${d}日前` : `${-d}日後`;
}
function badge(text, cls = "") {
  return `<span class="badge ${cls}">${esc(text)}</span>`;
}
function levelBadge(lv) {
  const l = levelInfo(lv);
  return `<span class="badge lvl ${l.cls}" title="程度">${l.label}</span>`;
}
function statusBadge(st) {
  const cls =
    st === "対応中" ? "st-open" : st === "経過観察" ? "st-watch" : "st-done";
  return `<span class="badge ${cls}">${
    st === "対応中" ? "● " : st === "経過観察" ? "△ " : "✓ "
  }${esc(st)}</span>`;
}
function emptyHTML(msg, sub = "") {
  return `<div class="empty"><div class="empty-icon">🗂️</div><p>${esc(
    msg
  )}</p>${sub ? `<p class="muted small">${sub}</p>` : ""}</div>`;
}
function optionsHTML(list, selected, blankLabel) {
  return (
    (blankLabel != null ? `<option value="">${esc(blankLabel)}</option>` : "") +
    list
      .map((v) => {
        const val = typeof v === "object" ? v.value : v,
          lab = typeof v === "object" ? v.label : v;
        return `<option value="${esc(val)}" ${
          String(val) === String(selected) ? "selected" : ""
        }>${esc(lab)}</option>`;
      })
      .join("")
  );
}
function studentOptionsHTML(selected, blankLabel = "すべての児童") {
  return (
    `<option value="">${esc(blankLabel)}</option>` +
    studentsSorted()
      .map(
        (s) =>
          `<option value="${s.id}" ${s.id === selected ? "selected" : ""}>${esc(
            sLabel(s.id)
          )}</option>`
      )
      .join("")
  );
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function fileStamp() {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}
function classFileLabel() {
  const s = state.settings;
  return `R${Number(s.schoolYear) - 2018}年度${
    s.grade ? "_" + s.grade + "年" : ""
  }${s.className ? s.className : ""}`;
}

// 削除（「元に戻す」付き）
function removeWithUndo(collection, id, label) {
  const arr = state[collection];
  const idx = arr.findIndex((x) => x.id === id);
  if (idx < 0) return;
  const [item] = arr.splice(idx, 1);
  save();
  refresh();
  toast(`${label}を削除しました`, {
    actionLabel: "元に戻す",
    onAction: () => {
      state[collection].splice(
        Math.min(idx, state[collection].length),
        0,
        item
      );
      save();
      refresh();
      toast("元に戻しました");
    }
  });
}

// ---------- 画面切り替え ----------
const NAV = [
  { view: "home", icon: "🏠", label: "ホーム" },
  { view: "records", icon: "📝", label: "エピソード記録" },
  { view: "students", icon: "👧", label: "児童カルテ" },
  { view: "shoken", icon: "✍️", label: "所見づくり" },
  { view: "behaviors", icon: "⚠️", label: "注意行動" },
  { view: "parents", icon: "📞", label: "保護者記録" },
  { view: "analysis", icon: "📊", label: "分析" },
  { view: "settings", icon: "⚙️", label: "設定・データ" }
];
function go(view, param = null) {
  ui.view = view;
  ui.param = param;
  const h = param ? `${view}/${param}` : view;
  if (location.hash.slice(1) !== h) {
    try {
      history.pushState(null, "", "#" + h);
    } catch (e) {
      /* iframe等 */
    }
  }
  render();
  window.scrollTo(0, 0);
}
function parseHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return;
  const [v, p] = h.split("/");
  if (VIEWS[v]) {
    ui.view = v;
    ui.param = p || null;
  }
}
function render() {
  const root = $("#view");
  ui.refresh = null;
  const fn = VIEWS[ui.view] || VIEWS.home;
  root.innerHTML = "";
  fn(root, ui.param);
  $$(".sidenav a").forEach((a) =>
    a.classList.toggle(
      "active",
      a.dataset.view === (ui.view === "student" ? "students" : ui.view)
    )
  );
  updateHeader();
  document.body.classList.remove("nav-open");
}
function refresh() {
  if (typeof ui.refresh === "function") ui.refresh();
  else render();
  updateHeader();
}
function updateHeader() {
  const lab = $("#class-label");
  if (lab) lab.textContent = classLabel();
  const mb = $("#mask-btn");
  if (mb) {
    mb.classList.toggle("on", !!state.settings.maskNames);
    mb.innerHTML = state.settings.maskNames ? "🙈 名前を表示" : "👁 名前を隠す";
  }
  // バックアップの声かけ
  const banner = $("#backup-banner");
  if (banner) {
    const total =
      state.episodes.length + state.behaviors.length + state.parents.length;
    const last = state.settings.lastBackupAt;
    const days = last
      ? Math.floor((Date.now() - new Date(last)) / 86400000)
      : null;
    if (total >= 10 && (days === null || days >= 14)) {
      banner.innerHTML = `<span>💡 ${
        days === null
          ? "まだバックアップを取っていません。"
          : `最後のバックアップから${days}日たっています。`
      }データはこのブラウザだけに保存されています。</span><button type="button" class="btn btn-sm btn-primary" data-act="export-excel">📗 Excelに保存</button><button type="button" class="btn btn-sm btn-outline" data-act="export-json">💾 バックアップ</button>`;
      banner.hidden = false;
    } else {
      banner.hidden = true;
      banner.innerHTML = "";
    }
  }
}
function buildNav() {
  $("#sidenav").innerHTML =
    NAV.map(
      (n) =>
        `<a href="#${n.view}" data-view="${n.view}"><span class="nav-icon">${n.icon}</span><span>${n.label}</span></a>`
    ).join("") +
    `<div class="nav-foot"><button type="button" class="btn btn-sm btn-outline nav-quick" data-act="quick-memo">✏️ すぐメモ <kbd>N</kbd></button><p class="muted small">データはこのパソコンのブラウザ内に保存されます。定期的にExcelやバックアップで保存してください。</p></div>`;
  $("#sidenav").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-view]");
    if (!a) return;
    e.preventDefault();
    go(a.dataset.view);
  });
}

// ---------- 共通アクション（data-act） ----------
function setupGlobalHandlers() {
  document.addEventListener("click", (e) => {
    // 日付クイックボタン
    const dq = e.target.closest(".date-quick button[data-shift]");
    if (dq) {
      const inp = dq.closest(".date-field").querySelector("input[type=date]");
      inp.value = addDays(todayStr(), Number(dq.dataset.shift));
      inp.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const fn = ACTIONS[el.dataset.act];
    if (fn) {
      e.preventDefault();
      fn(el, e);
    }
  });
  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    const typing =
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      e.target.isContentEditable;
    if (e.key === "Escape" && modalOpen()) {
      closeModal();
      return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.key === "n" || e.key === "N") && !modalOpen()) {
      e.preventDefault();
      openQuickMemo();
    }
    if (e.key === "/" && !modalOpen() && $("#rf-q")) {
      e.preventDefault();
      $("#rf-q").focus();
    }
  });
  $("#nav-toggle").addEventListener("click", () =>
    document.body.classList.toggle("nav-open")
  );
  $("#nav-scrim").addEventListener("click", () =>
    document.body.classList.remove("nav-open")
  );
  window.addEventListener("popstate", () => {
    parseHash();
    render();
  });
}

ACTIONS["close-modal"] = () => closeModal();
ACTIONS["go"] = (el) => go(el.dataset.view, el.dataset.param || null);
ACTIONS["open-student"] = (el) => go("student", el.dataset.id);
ACTIONS["quick-memo"] = () => openQuickMemo();
ACTIONS["quick-for"] = (el) =>
  openQuickMemo({
    kind: el.dataset.kind || "episode",
    studentIds: [el.dataset.id]
  });
ACTIONS["toggle-mask"] = () => {
  state.settings.maskNames = !state.settings.maskNames;
  save();
  render();
};
ACTIONS["toggle-clamp"] = (el) => el.classList.toggle("open");

// ============================================================
//  ホーム／すぐメモ／エピソード記録
// ============================================================

// ---------- ホーム ----------
VIEWS.home = (root) => {
  const today = todayStr();
  const students = studentsSorted();
  const term = currentTerm();
  const tr = termRange(term);
  const last14 = { start: addDays(today, -13), end: today };
  const todayCount = state.episodes.filter((e) => e.date === today).length;
  const weekCount = state.episodes.filter(
    (e) => e.date >= addDays(today, -6) && e.date <= today
  ).length;
  const termEps = state.episodes.filter((e) => inRange(e.date, tr));
  const cnt = {},
    cnt14 = {},
    last = {};
  termEps.forEach((e) => {
    cnt[e.studentId] = (cnt[e.studentId] || 0) + 1;
  });
  state.episodes.forEach((e) => {
    if (inRange(e.date, last14))
      cnt14[e.studentId] = (cnt14[e.studentId] || 0) + 1;
    if (!last[e.studentId] || e.date > last[e.studentId])
      last[e.studentId] = e.date;
  });
  const zero = students.filter((s) => !cnt[s.id]);
  const watch = students
    .slice()
    .sort(
      (a, b) =>
        (cnt14[a.id] || 0) - (cnt14[b.id] || 0) ||
        (last[a.id] || "").localeCompare(last[b.id] || "")
    )
    .slice(0, 8);
  const openBeh = state.behaviors
    .filter((b) => b.status === "対応中")
    .sort((a, b) => b.date.localeCompare(a.date));
  const follows = state.parents
    .filter((p) => p.followUp && !p.followUpDone)
    .sort((a, b) =>
      (a.followUpDate || "9999").localeCompare(b.followUpDate || "9999")
    );
  const done = students.filter((s) => {
    const k = findShoken(s.id, term, "総合所見");
    return k && (k.status === "完成" || k.status === "確認済");
  }).length;
  const drafts = students.filter((s) => {
    const k = findShoken(s.id, term, "総合所見");
    return k && k.status === "下書き" && k.text;
  }).length;
  const recent = state.episodes
    .slice()
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, 6);

  const onboarding = !students.length
    ? `
    <section class="panel onboarding">
      <h3>はじめに（3ステップ）</h3>
      <ol class="steps">
        <li><b>名簿を登録</b>：「児童カルテ」→「名簿を一括登録」で、Excelの名簿をコピーして貼り付けられます。<button type="button" class="btn btn-sm btn-primary" data-act="student-bulk">名簿を一括登録</button></li>
        <li><b>気づいたらすぐメモ</b>：画面右下の「✏️ すぐメモ」か、キーボードの <kbd>N</kbd> でいつでも記録できます。</li>
        <li><b>所見をつくる</b>：たまったエピソードを選ぶだけで、通知表の文章の下書きができます。</li>
      </ol>
      <p class="muted small">以前のアプリのCSVバックアップがある場合は「設定・データ」→「CSV読込」から取り込めます。</p>
    </section>`
    : "";

  root.innerHTML = `
    <div class="page-head"><div><h2>こんにちは${
      state.settings.teacher ? "、" + esc(state.settings.teacher) + "先生" : ""
    }</h2><p class="muted">${esc(fmtFull(today))}　${esc(term)}</p></div>
      <div class="page-actions"><button type="button" class="btn btn-primary btn-lg" data-act="quick-memo">✏️ すぐメモ</button></div></div>
    ${onboarding}
    <div class="kpis">
      ${kpi("今日の記録", todayCount, "件")}
      ${kpi("この7日間", weekCount, "件")}
      ${kpi(
        `${term}の記録`,
        termEps.length,
        "件",
        students.length
          ? `1人平均 ${(termEps.length / students.length).toFixed(1)}件`
          : ""
      )}
      ${kpi(
        `${term}にまだ記録がない`,
        zero.length,
        "人",
        "",
        zero.length ? "warn" : ""
      )}
      ${kpi(
        "対応中の注意行動",
        openBeh.length,
        "件",
        "",
        openBeh.length ? "warn" : ""
      )}
      ${kpi(
        "保護者 要フォロー",
        follows.length,
        "件",
        "",
        follows.some((p) => p.followUpDate && p.followUpDate < today)
          ? "warn"
          : ""
      )}
    </div>
    <div class="home-grid">
      <section class="panel">
        <div class="panel-head"><h3>👀 次に見取りたい児童 <small class="muted">直近2週間の記録が少ない順</small></h3></div>
        ${
          students.length
            ? `<div class="watch-list">${watch
                .map(
                  (s) =>
                    `<button type="button" class="watch-chip" data-act="quick-for" data-id="${
                      s.id
                    }" title="この児童のメモをとる"><span class="schip-no">${
                      s.no
                    }</span>${esc(dispName(s))}<small>${
                      cnt14[s.id] || 0
                    }件・${agoLabel(last[s.id])}</small></button>`
                )
                .join("")}</div>
        <p class="muted small">押すとその児童のメモ画面が開きます。</p>`
            : `<p class="muted">名簿を登録すると表示されます。</p>`
        }
      </section>
      <section class="panel">
        <div class="panel-head"><h3>✍️ ${esc(
          term
        )}の所見（総合所見）</h3><button type="button" class="btn btn-sm btn-outline" data-act="go" data-view="shoken">所見づくりへ</button></div>
        ${
          students.length
            ? `<div class="progress-big"><div class="meter"><div class="meter-fill" style="width:${Math.round(
                (done / students.length) * 100
              )}%"></div></div><p><b>${done}</b> / ${
                students.length
              }人 完成　<span class="muted">下書き ${drafts}人</span></p></div>`
            : `<p class="muted">名簿を登録すると表示されます。</p>`
        }
      </section>
      <section class="panel">
        <div class="panel-head"><h3>📞 保護者対応 要フォロー</h3><button type="button" class="btn btn-sm btn-outline" data-act="go" data-view="parents">一覧へ</button></div>
        ${
          follows.length
            ? `<ul class="mini-list">${follows
                .slice(0, 6)
                .map(
                  (p) =>
                    `<li class="${
                      p.followUpDate && p.followUpDate < today ? "overdue" : ""
                    }"><button type="button" class="link-btn" data-act="parent-edit" data-id="${
                      p.id
                    }"><b>${esc(
                      p.followUpDate ? fmtMD(p.followUpDate) : "日付未定"
                    )}</b> ${esc(sLabel(p.studentId))}：${esc(
                      p.topic || p.content.slice(0, 24)
                    )}</button></li>`
                )
                .join("")}</ul>`
            : `<p class="muted">フォロー予定はありません。</p>`
        }
      </section>
      <section class="panel">
        <div class="panel-head"><h3>⚠️ 対応中の注意行動</h3><button type="button" class="btn btn-sm btn-outline" data-act="go" data-view="behaviors">一覧へ</button></div>
        ${
          openBeh.length
            ? `<ul class="mini-list">${openBeh
                .slice(0, 6)
                .map(
                  (b) =>
                    `<li><button type="button" class="link-btn" data-act="behavior-edit" data-id="${
                      b.id
                    }"><b>${esc(fmtMD(b.date))}</b> ${esc(
                      sLabel(b.studentId)
                    )}：${esc(b.type)} ${levelBadge(b.level)}</button></li>`
                )
                .join("")}</ul>`
            : `<p class="muted">対応中の案件はありません。</p>`
        }
      </section>
      <section class="panel span-2">
        <div class="panel-head"><h3>🕒 最近の記録</h3><button type="button" class="btn btn-sm btn-outline" data-act="go" data-view="records">すべて見る</button></div>
        ${
          recent.length
            ? `<ul class="recent-list">${recent
                .map(
                  (e) =>
                    `<li><span class="muted">${esc(
                      fmtMD(e.date)
                    )}</span> <button type="button" class="link-btn" data-act="open-student" data-id="${
                      e.studentId
                    }">${esc(sLabel(e.studentId))}</button> ${
                      e.subject
                        ? badge(
                            e.subject + (e.unit ? "：" + e.unit : ""),
                            "b-subject"
                          )
                        : badge("未整理", "b-quick")
                    } <span class="recent-text">${esc(
                      e.content.length > 60
                        ? e.content.slice(0, 60) + "…"
                        : e.content
                    )}</span></li>`
                )
                .join("")}</ul>`
            : `<p class="muted">まだ記録がありません。右下の「✏️ すぐメモ」から始めましょう。</p>`
        }
      </section>
    </div>`;
};
function kpi(label, value, unit = "", sub = "", cls = "") {
  return `<div class="kpi ${cls}"><div class="kpi-label">${esc(
    label
  )}</div><div class="kpi-value">${esc(value)}<small>${esc(
    unit
  )}</small></div>${sub ? `<div class="kpi-sub">${esc(sub)}</div>` : ""}</div>`;
}

// ---------- すぐメモ（どの画面からでも） ----------
function openQuickMemo({ kind, studentIds = [], date } = {}) {
  let draft = null;
  try {
    draft = JSON.parse(localStorage.getItem(QUICK_DRAFT_KEY) || "null");
  } catch (e) {
    draft = null;
  }
  const restoring = !kind && !studentIds.length && draft && draft.content;
  kind = kind || (restoring ? draft.kind : ui.lastQuick.kind) || "episode";
  if (restoring) studentIds = (draft.studentIds || []).filter(getStudent);

  const m = openModal({
    title: "✏️ すぐメモ",
    wide: true,
    cls: "quick-modal",
    body: `
      <div class="seg" role="tablist">
        <button type="button" class="seg-btn" data-kind="episode">📝 エピソード</button>
        <button type="button" class="seg-btn" data-kind="behavior">⚠️ 注意行動</button>
        <button type="button" class="seg-btn" data-kind="parent">📞 保護者対応</button>
      </div>
      <div class="form-group"><label>児童 <span class="req">*</span> <small class="muted qm-multi-note"></small></label><div class="qm-students"></div></div>
      <div class="form-row">
        <div class="form-group"><label>日付</label>${dateFieldHTML(
          "qm-date",
          date || todayStr()
        )}</div>
        <div class="form-group qm-extra"></div>
      </div>
      <div class="form-group"><label class="qm-content-label">メモ</label>
        <div class="textarea-wrap"><textarea class="qm-content" rows="4"></textarea><button type="button" class="mic-btn" aria-label="音声入力">🎤</button></div>
        <div class="char-count qm-count">0 文字</div></div>
      <div class="quick-phrases qm-phrases"></div>
      <details class="qm-more"><summary></summary><div class="qm-more-body"></div></details>`,
    footer: `<span class="muted small foot-hint">Ctrl+Enter で保存</span>
      <button type="button" class="btn btn-text" data-act="close-modal">閉じる</button>
      <button type="button" class="btn btn-outline qm-save-next">保存して続ける</button>
      <button type="button" class="btn btn-primary qm-save">💾 保存</button>`
  });
  const ta = $(".qm-content", m),
    extra = $(".qm-extra", m),
    more = $(".qm-more", m),
    moreBody = $(".qm-more-body", m);
  const picker = studentPicker($(".qm-students", m), {
    multi: kind !== "parent",
    selected: studentIds,
    onChange: saveDraft
  });
  if (restoring) {
    ta.value = draft.content;
    toast("書きかけのメモを復元しました");
  }
  let tagP = null;

  function setKind(k) {
    kind = k;
    $$(".seg-btn", m).forEach((b) =>
      b.classList.toggle("on", b.dataset.kind === k)
    );
    picker.setMulti(k !== "parent");
    $(".qm-multi-note", m).textContent =
      k === "parent" ? "（1人選択）" : "（複数選ぶと一人ずつ記録されます）";
    const phrases = $(".qm-phrases", m);
    if (k === "episode") {
      $(".qm-content-label", m).textContent = "エピソード";
      ta.placeholder =
        "見たこと・聞いたことをそのままメモ（例：算数で図を使って説明していた）";
      extra.innerHTML = `<label>&nbsp;</label><div class="check-col"><label class="check star"><input type="checkbox" class="qm-star"> ★ 所見に使いたい</label><label class="check danger"><input type="checkbox" class="qm-guid"> ⚠️ 要配慮</label></div>`;
      phrases.innerHTML = phraseButtonsHTML();
      phrases.hidden = false;
      $("summary", more).textContent =
        "教科・単元・観点も入れる（あとからでもOK）";
      moreBody.innerHTML = `<div class="form-row"><div class="form-group"><label>教科・領域</label><select class="qm-subject">${subjectOptionsHTML(
        ui.lastQuick.subject
      )}</select></div><div class="form-group"><label>単元・場面</label><select class="qm-unit"></select></div></div><div class="form-group"><label>観点・タグ</label><div class="qm-tags"></div></div>`;
      bindSubjectUnit($(".qm-subject", m), $(".qm-unit", m), ui.lastQuick.unit);
      tagP = tagPicker($(".qm-tags", m), { selected: ui.lastQuick.tags });
      if (ui.lastQuick.subject || ui.lastQuick.tags.length) more.open = true;
    } else if (k === "behavior") {
      $(".qm-content-label", m).textContent = "状況・経緯";
      ta.placeholder = "いつ・どこで・誰と・何があったか（事実を簡潔に）";
      extra.innerHTML = `<div class="form-row tight"><div class="form-group"><label>種別</label><select class="qm-btype">${optionsHTML(
        BEHAVIOR_TYPES,
        "友達とのトラブル"
      )}</select></div><div class="form-group"><label>程度</label><select class="qm-level">${optionsHTML(
        BEHAVIOR_LEVELS.map((l) => ({ value: l.key, label: l.label })),
        1
      )}</select></div></div>`;
      phrases.hidden = true;
      $("summary", more).textContent = "場所・時刻・対応も入れる";
      moreBody.innerHTML = `<div class="form-row"><div class="form-group"><label>時刻</label><input type="time" class="qm-time"></div><div class="form-group"><label>場所</label><select class="qm-place">${optionsHTML(
        PLACES,
        "",
        "（未選択）"
      )}</select></div><div class="form-group"><label>状況</label><select class="qm-bstatus">${optionsHTML(
        BEHAVIOR_STATUSES,
        "対応中"
      )}</select></div></div><div class="form-group"><label>対応・指導内容</label><textarea class="qm-response" rows="2"></textarea></div>`;
      more.open = false;
    } else {
      $(".qm-content-label", m).textContent = "内容";
      ta.placeholder = "連絡の内容（保護者の話・学校からの説明など）";
      extra.innerHTML = `<div class="form-row tight"><div class="form-group"><label>方法</label><select class="qm-method">${optionsHTML(
        PARENT_METHODS,
        "電話"
      )}</select></div><div class="form-group"><label>発信</label><select class="qm-dir">${optionsHTML(
        PARENT_DIRECTIONS,
        "学校から"
      )}</select></div></div>`;
      phrases.hidden = true;
      $("summary", more).textContent = "相手・件名・フォロー予定も入れる";
      moreBody.innerHTML = `<div class="form-row"><div class="form-group"><label>相手</label><select class="qm-partner">${optionsHTML(
        PARENT_PARTNERS,
        "母"
      )}</select></div><div class="form-group"><label>件名</label><input type="text" class="qm-topic" placeholder="例：体調について"></div></div><div class="form-group"><label>学校の対応・回答</label><textarea class="qm-presponse" rows="2"></textarea></div><label class="check"><input type="checkbox" class="qm-follow"> 要フォロー</label> <input type="date" class="qm-follow-date" aria-label="フォロー予定日">`;
      more.open = false;
    }
    saveDraft();
  }
  bindPhraseButtons($(".qm-phrases", m), ta);
  $$(".seg-btn", m).forEach((b) =>
    b.addEventListener("click", () => setKind(b.dataset.kind))
  );
  ta.addEventListener("input", () => {
    $(".qm-count", m).textContent = `${ta.value.length} 文字`;
    saveDraft();
  });
  attachMic($(".mic-btn", m), ta);
  setKind(kind);
  ta.dispatchEvent(new Event("input"));
  setTimeout(
    () => (studentIds.length ? ta : $(".spicker-search", m)).focus(),
    60
  );

  function saveDraft() {
    try {
      if (ta && ta.value.trim())
        localStorage.setItem(
          QUICK_DRAFT_KEY,
          JSON.stringify({
            kind,
            studentIds: picker ? picker.get() : [],
            content: ta.value
          })
        );
      else localStorage.removeItem(QUICK_DRAFT_KEY);
    } catch (e) {
      /* noop */
    }
  }
  function doSave(keepOpen) {
    const ids = picker.get();
    const content = ta.value.trim();
    const date = $(".qm-date", m).value || todayStr();
    if (!ids.length) {
      toast("児童を選んでください", { type: "error" });
      $(".spicker-search", m).focus();
      return;
    }
    if (!content) {
      toast("内容を入力してください", { type: "error" });
      ta.focus();
      return;
    }
    const now = nowISO();
    if (kind === "episode") {
      const subject = $(".qm-subject", m).value,
        unit = $(".qm-unit", m).value,
        tags = tagP.get();
      ids.forEach((sid) =>
        state.episodes.push(
          normEpisode({
            studentId: sid,
            date,
            subject,
            unit,
            tags,
            content,
            star: $(".qm-star", m).checked,
            isGuidance: $(".qm-guid", m).checked,
            quick: !subject && !tags.length,
            createdAt: now
          })
        )
      );
      ui.lastQuick = { subject, unit, tags, kind };
    } else if (kind === "behavior") {
      ids.forEach((sid) =>
        state.behaviors.push(
          normBehavior({
            studentId: sid,
            date,
            time: $(".qm-time", m).value,
            place: $(".qm-place", m).value,
            type: $(".qm-btype", m).value,
            level: Number($(".qm-level", m).value),
            situation: content,
            response: $(".qm-response", m).value.trim(),
            related: ids
              .filter((x) => x !== sid)
              .map(realName)
              .join("、"),
            status: $(".qm-bstatus", m).value,
            createdAt: now
          })
        )
      );
      ui.lastQuick.kind = kind;
    } else {
      const follow =
        $(".qm-follow", m).checked || !!$(".qm-follow-date", m).value;
      state.parents.push(
        normParent({
          studentId: ids[0],
          date,
          method: $(".qm-method", m).value,
          direction: $(".qm-dir", m).value,
          partner: $(".qm-partner", m).value,
          topic: $(".qm-topic", m).value.trim(),
          content,
          response: $(".qm-presponse", m).value.trim(),
          followUp: follow,
          followUpDate: $(".qm-follow-date", m).value,
          createdAt: now
        })
      );
      ui.lastQuick.kind = kind;
    }
    save();
    try {
      localStorage.removeItem(QUICK_DRAFT_KEY);
    } catch (e) {
      /* noop */
    }
    const label =
      kind === "episode"
        ? "エピソード"
        : kind === "behavior"
        ? "注意行動"
        : "保護者記録";
    toast(`${label}を${ids.length > 1 ? ids.length + "人分" : ""}保存しました`);
    refresh();
    if (keepOpen) {
      ta.value = "";
      picker.clear();
      $(".qm-count", m).textContent = "0 文字";
      $$(".qm-star, .qm-guid", m).forEach((c) => {
        c.checked = false;
      });
      $(".spicker-search", m).focus();
    } else closeModal(true);
  }
  $(".qm-save", m).addEventListener("click", () => doSave(false));
  $(".qm-save-next", m).addEventListener("click", () => doSave(true));
  m.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      doSave(false);
    }
  });
}

// ---------- エピソード入力フォーム（記録画面・編集モーダル共通） ----------
function buildEpisodeForm(
  box,
  { ep = null, presetStudents = [], onDone = null, inModal = false } = {}
) {
  const isEdit = !!ep;
  box.innerHTML = `
    ${
      inModal
        ? ""
        : `<h3 class="panel-title">${
            isEdit ? "🔄 エピソードを編集" : "✏️ エピソードを記録"
          }</h3>`
    }
    <div class="form-group"><label>児童 <span class="req">*</span> ${
      isEdit
        ? ""
        : `<small class="muted">（複数選ぶと一人ずつ記録されます）</small>`
    }</label><div class="ef-students"></div></div>
    <div class="form-row">
      <div class="form-group"><label>教科・領域</label><select class="ef-subject">${subjectOptionsHTML(
        ep ? ep.subject : ui.lastQuick.subject || ""
      )}</select></div>
      <div class="form-group"><label>単元・場面</label><select class="ef-unit"></select>
        <div class="add-inline"><input type="text" class="ef-newunit" placeholder="新しい単元名"><button type="button" class="btn btn-sm btn-secondary ef-addunit">追加</button></div></div>
    </div>
    <div class="form-group"><label>観点・タグ <small class="muted">（複数選べます）</small></label><div class="ef-tags"></div></div>
    <div class="form-group"><label>記録日 <small class="muted">（後日入力するときは日付を変えてください）</small></label>${dateFieldHTML(
      "ef-date",
      ep ? ep.date : todayStr()
    )}</div>
    <div class="form-group"><label>エピソード本文 <span class="req">*</span></label>
      <div class="textarea-wrap"><textarea class="ef-content" rows="5" placeholder="日々の様子や発言をメモ…（Ctrl+Enterで保存）">${esc(
        ep ? ep.content : ""
      )}</textarea><button type="button" class="mic-btn" aria-label="音声入力">🎤</button></div>
      <div class="char-count ef-count">0 文字</div></div>
    <div class="quick-phrases ef-phrases">${phraseButtonsHTML()}</div>
    <div class="check-row">
      <label class="check star"><input type="checkbox" class="ef-star" ${
        ep && ep.star ? "checked" : ""
      }> ★ 所見に使いたい</label>
      <label class="check danger"><input type="checkbox" class="ef-guid" ${
        ep && ep.isGuidance ? "checked" : ""
      }> ⚠️ 生徒指導・要配慮として記録</label>
    </div>
    ${
      isEdit
        ? `<p class="muted small">入力：${esc(
            fmtDateTime(ep.createdAt)
          )}　最終更新：${esc(fmtDateTime(ep.updatedAt))}</p>`
        : ""
    }
    <div class="form-actions">
      ${
        isEdit
          ? `<button type="button" class="btn btn-text ef-cancel">キャンセル</button>`
          : `<button type="button" class="btn btn-text ef-clear">🧹 クリア</button>`
      }
      <button type="button" class="btn btn-primary ef-save">${
        isEdit ? "🔄 更新する" : "💾 保存する"
      }</button>
    </div>`;
  const q = (s) => $(s, box);
  const picker = studentPicker(q(".ef-students"), {
    multi: !isEdit,
    selected: ep ? [ep.studentId] : presetStudents
  });
  const fillUnit = bindSubjectUnit(
    q(".ef-subject"),
    q(".ef-unit"),
    ep ? ep.unit : ui.lastQuick.unit
  );
  const tagP = tagPicker(q(".ef-tags"), {
    selected: ep ? ep.tags : ui.lastQuick.tags
  });
  const ta = q(".ef-content");
  const updCount = () => {
    q(".ef-count").textContent = `${ta.value.length} 文字`;
  };
  ta.addEventListener("input", updCount);
  updCount();
  bindPhraseButtons(q(".ef-phrases"), ta);
  attachMic(q(".mic-btn"), ta);
  q(".ef-addunit").addEventListener("click", () => {
    const subj = q(".ef-subject").value,
      nu = q(".ef-newunit").value.trim();
    if (!subj) {
      toast("先に教科を選んでください", { type: "error" });
      return;
    }
    if (!nu) {
      toast("追加する単元名を入力してください", { type: "error" });
      return;
    }
    if (!state.subjects[subj].includes(nu)) {
      state.subjects[subj].push(nu);
      save();
      toast(`「${nu}」を追加しました`);
    }
    fillUnit(nu);
    q(".ef-newunit").value = "";
  });
  function doSave() {
    const ids = picker.get(),
      content = ta.value.trim();
    if (!ids.length || !content) {
      toast("「児童」と「エピソード本文」は必須です", { type: "error" });
      return;
    }
    const data = {
      date: q(".ef-date").value || todayStr(),
      subject: q(".ef-subject").value,
      unit: q(".ef-unit").value,
      tags: tagP.get(),
      content,
      star: q(".ef-star").checked,
      isGuidance: q(".ef-guid").checked
    };
    if (isEdit) {
      Object.assign(ep, data, { studentId: ids[0], updatedAt: nowISO() });
      if (data.subject || data.tags.length) ep.quick = false;
      save();
      toast("エピソードを更新しました");
    } else {
      ids.forEach((sid) =>
        state.episodes.push(
          normEpisode(
            Object.assign({ studentId: sid, createdAt: nowISO() }, data)
          )
        )
      );
      ui.lastQuick.subject = data.subject;
      ui.lastQuick.unit = data.unit;
      ui.lastQuick.tags = data.tags;
      save();
      toast(
        ids.length > 1
          ? `${ids.length}人分の記録を保存しました`
          : "記録を保存しました"
      );
      // 日付・教科・観点は残して、児童と本文だけクリア（続けて入力しやすく）
      picker.clear();
      ta.value = "";
      updCount();
      q(".ef-star").checked = false;
      q(".ef-guid").checked = false;
      picker.focus();
    }
    onDone && onDone();
    refresh();
  }
  q(".ef-save").addEventListener("click", doSave);
  box.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      doSave();
    }
  });
  if (q(".ef-clear"))
    q(".ef-clear").addEventListener("click", () => {
      picker.clear();
      ta.value = "";
      updCount();
      tagP.clear();
      q(".ef-subject").value = "";
      fillUnit("");
      q(".ef-date").value = todayStr();
      q(".ef-star").checked = false;
      q(".ef-guid").checked = false;
    });
  if (q(".ef-cancel"))
    q(".ef-cancel").addEventListener("click", () => {
      onDone && onDone(true);
    });
  return { picker };
}

function openEpisodeModal(ep, presetStudents = []) {
  const m = openModal({
    title: ep ? "🔄 エピソードを編集" : "✏️ エピソードを記録",
    wide: true,
    body: "",
    footer: null
  });
  buildEpisodeForm($(".modal-body", m), {
    ep,
    presetStudents,
    inModal: true,
    onDone: () => closeModal(true)
  });
}

// ---------- エピソード記録 画面 ----------
VIEWS.records = (root) => {
  root.innerHTML = `
    <div class="page-head"><h2>📝 エピソード記録</h2>
      <div class="page-actions"><button type="button" class="btn btn-outline" data-act="print-records">🖨 この一覧を印刷</button></div></div>
    <div class="records-layout">
      <section class="panel input-panel" id="ep-form-panel"></section>
      <section class="panel list-panel">
        <h3 class="panel-title">🔍 検索・一覧</h3>
        <div id="rec-filters"></div>
        <div id="rec-bulk"></div>
        <div id="rec-list"></div>
      </section>
    </div>`;
  const panel = $("#ep-form-panel");
  const newForm = () => buildEpisodeForm(panel, {});
  ui.loadEpisodeIntoForm = (ep) => {
    buildEpisodeForm(panel, { ep, onDone: () => newForm() });
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  newForm();
  renderRecFilters();
  renderRecList();
  ui.refresh = () => {
    renderRecList();
  };
};

function renderRecFilters() {
  const f = ui.rec;
  const tagOpts = TAG_GROUPS.map(
    (g) =>
      `<optgroup label="${esc(g.label)}">${tagsOfGroup(g.key)
        .map(
          (t) =>
            `<option value="${esc(t)}" ${t === f.tag ? "selected" : ""}>${esc(
              t
            )}</option>`
        )
        .join("")}</optgroup>`
  ).join("");
  $("#rec-filters").innerHTML = `
    <div class="filters">
      <select id="rf-student">${studentOptionsHTML(f.student)}</select>
      <select id="rf-subject">${subjectOptionsHTML(f.subject, {
        blankLabel: "すべての教科"
      })}</select>
      <select id="rf-tag"><option value="">すべての観点</option>${tagOpts}</select>
      ${periodSelectHTML("rf-period", f.period)}
      <input type="search" id="rf-q" placeholder="キーワード（/ で移動）" value="${esc(
        f.q
      )}">
      <select id="rf-sort">${optionsHTML(
        [
          { value: "dateDesc", label: "新しい順" },
          { value: "dateAsc", label: "古い順" },
          { value: "no", label: "出席番号順" }
        ],
        f.sort
      )}</select>
    </div>
    <div class="filter-checks">
      <label class="check danger"><input type="checkbox" id="rf-guid" ${
        f.guid ? "checked" : ""
      }> ⚠️ 要配慮のみ</label>
      <label class="check"><input type="checkbox" id="rf-quick" ${
        f.quick ? "checked" : ""
      }> 📥 未整理（教科・観点なし）のみ</label>
      <label class="check star"><input type="checkbox" id="rf-star" ${
        f.star ? "checked" : ""
      }> ★ 所見候補のみ</label>
      <button type="button" class="link-btn" data-act="rec-reset">条件をリセット</button>
    </div>`;
  const bind = (id, key, ev = "change", fn = (el) => el.value) =>
    $(id).addEventListener(ev, (e) => {
      ui.rec[key] = fn(e.target);
      ui.rec.limit = 300;
      renderRecList();
    });
  bind("#rf-student", "student");
  bind("#rf-subject", "subject");
  bind("#rf-tag", "tag");
  bind("#rf-period", "period");
  bind("#rf-sort", "sort");
  bind("#rf-q", "q", "input");
  bind("#rf-guid", "guid", "change", (el) => el.checked);
  bind("#rf-quick", "quick", "change", (el) => el.checked);
  bind("#rf-star", "star", "change", (el) => el.checked);
}
ACTIONS["rec-reset"] = () => {
  ui.rec = {
    student: "",
    subject: "",
    tag: "",
    period: "all",
    q: "",
    guid: false,
    quick: false,
    star: false,
    sort: "dateDesc",
    limit: 300
  };
  renderRecFilters();
  renderRecList();
};

function filterEpisodes(f) {
  const r = periodRange(f.period),
    q = (f.q || "").toLowerCase();
  let list = state.episodes.filter((e) => {
    if (f.student && e.studentId !== f.student) return false;
    if (f.subject && e.subject !== f.subject) return false;
    if (f.tag && !e.tags.includes(f.tag)) return false;
    if (!inRange(e.date, r)) return false;
    if (f.guid && !e.isGuidance) return false;
    if (f.quick && (e.subject || e.tags.length)) return false;
    if (f.star && !e.star) return false;
    if (q) {
      const hay = (
        e.content +
        " " +
        realName(e.studentId) +
        " " +
        e.subject +
        " " +
        e.unit +
        " " +
        e.tags.join(" ")
      ).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const noOf = (id) => {
    const s = getStudent(id);
    return s && s.no !== "" ? s.no : 9999;
  };
  if (f.sort === "dateAsc")
    list.sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt)
    );
  else if (f.sort === "no")
    list.sort(
      (a, b) =>
        noOf(a.studentId) - noOf(b.studentId) || b.date.localeCompare(a.date)
    );
  else
    list.sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
    );
  return list;
}

function episodeBadges(e, used) {
  return `${e.isGuidance ? badge("⚠️ 要配慮", "b-guid") : ""}${
    e.subject
      ? badge(e.subject + (e.unit ? "：" + e.unit : ""), "b-subject")
      : badge("未整理", "b-quick")
  }${e.tags.map((t) => badge(t, "b-tag")).join("")}${
    used && used.has(e.id) ? badge("所見に使用済", "b-used") : ""
  }`;
}

function renderRecList() {
  const box = $("#rec-list");
  if (!box) return;
  const list = filterEpisodes(ui.rec);
  const used = usedEpisodeIds();
  ui.recSelected.forEach((id) => {
    if (!state.episodes.some((e) => e.id === id)) ui.recSelected.delete(id);
  });
  const shown = list.slice(0, ui.rec.limit);
  box.innerHTML = `
    <div class="list-meta"><span>全 ${state.episodes.length} 件中 <b>${
    list.length
  }</b> 件</span>${
    ui.rec.student
      ? `<button type="button" class="link-btn" data-act="open-student" data-id="${ui.rec.student}">この児童のカルテを開く →</button>`
      : ""
  }</div>
    ${
      list.length
        ? `
    <div class="table-container"><table class="data-table rec-table">
      <thead><tr><th class="col-check"><input type="checkbox" id="rec-all" aria-label="すべて選択" ${
        shown.length && shown.every((e) => ui.recSelected.has(e.id))
          ? "checked"
          : ""
      }></th><th>記録日・児童</th><th>教科・単元／観点</th><th>内容</th><th class="col-ops">操作</th></tr></thead>
      <tbody>${shown
        .map(
          (e) => `
        <tr class="${e.isGuidance ? "row-guid" : ""}">
          <td class="col-check"><input type="checkbox" class="rec-check" data-id="${
            e.id
          }" ${
            ui.recSelected.has(e.id) ? "checked" : ""
          } aria-label="選択"></td>
          <td class="nowrap cell-who"><button type="button" class="date-chip" data-act="rec-edit-date" data-id="${
            e.id
          }" title="クリックで記録日を変更">${esc(
            fmtMD(e.date)
          )}</button><br><button type="button" class="link-btn strong" data-act="open-student" data-id="${
            e.studentId
          }">${esc(sLabel(e.studentId))}</button></td>
          <td class="cell-badges">${episodeBadges(e, used)}</td>
          <td class="cell-content"><div class="clamp" data-act="toggle-clamp" title="クリックで全文表示">${nl2br(
            e.content
          )}</div></td>
          <td class="col-ops nowrap"><button type="button" class="star-btn ${
            e.star ? "on" : ""
          }" data-act="ep-star" data-id="${e.id}" title="所見候補（★）">${
            e.star ? "★" : "☆"
          }</button><button type="button" class="op-btn" data-act="ep-edit" data-id="${
            e.id
          }" title="編集">✏️</button><button type="button" class="op-btn" data-act="ep-del" data-id="${
            e.id
          }" title="削除">🗑</button></td>
        </tr>`
        )
        .join("")}</tbody></table></div>
      ${
        list.length > shown.length
          ? `<div class="more-row"><button type="button" class="btn btn-outline" data-act="rec-more">さらに表示（残り ${
              list.length - shown.length
            } 件）</button></div>`
          : ""
      }`
        : emptyHTML(
            state.episodes.length
              ? "条件に合う記録がありません"
              : "まだ記録がありません",
            state.episodes.length
              ? ""
              : "左のフォームか、右下の「✏️ すぐメモ」から記録できます。"
          )
    }`;
  const all = $("#rec-all", box);
  if (all)
    all.addEventListener("change", () => {
      shown.forEach((e) =>
        all.checked ? ui.recSelected.add(e.id) : ui.recSelected.delete(e.id)
      );
      renderRecList();
    });
  $$(".rec-check", box).forEach((c) =>
    c.addEventListener("change", () => {
      c.checked
        ? ui.recSelected.add(c.dataset.id)
        : ui.recSelected.delete(c.dataset.id);
      renderBulkBar();
    })
  );
  renderBulkBar();
}
function renderBulkBar() {
  const bar = $("#rec-bulk");
  if (!bar) return;
  const n = ui.recSelected.size;
  bar.innerHTML = n
    ? `<div class="bulk-bar"><b>${n}件を選択中</b>
    <button type="button" class="btn btn-sm btn-outline" data-act="bulk-date">📅 記録日を変更</button>
    <button type="button" class="btn btn-sm btn-outline" data-act="bulk-subject">📚 教科・単元を設定</button>
    <button type="button" class="btn btn-sm btn-outline" data-act="bulk-tag">🏷 観点を追加</button>
    <button type="button" class="btn btn-sm btn-outline" data-act="bulk-star">★ 所見候補にする</button>
    <button type="button" class="btn btn-sm btn-danger-outline" data-act="bulk-del">🗑 削除</button>
    <button type="button" class="link-btn" data-act="bulk-clear">選択解除</button></div>`
    : "";
}
ACTIONS["rec-more"] = () => {
  ui.rec.limit += 300;
  renderRecList();
};
ACTIONS["bulk-clear"] = () => {
  ui.recSelected.clear();
  renderRecList();
};
function selectedEpisodes() {
  return state.episodes.filter((e) => ui.recSelected.has(e.id));
}
ACTIONS["bulk-date"] = () => {
  const m = openModal({
    title: "📅 記録日をまとめて変更",
    body: `<p>${ui.recSelected.size}件の記録日を変更します。</p>${dateFieldHTML(
      "bd-date",
      todayStr()
    )}`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary" id="bd-ok">変更する</button>`
  });
  $("#bd-ok", m).addEventListener("click", () => {
    const d = $(".bd-date", m).value;
    if (!d) return;
    selectedEpisodes().forEach((e) => {
      e.date = d;
      e.updatedAt = nowISO();
    });
    save();
    closeModal(true);
    toast("記録日を変更しました");
    refresh();
  });
};
ACTIONS["bulk-subject"] = () => {
  const m = openModal({
    title: "📚 教科・単元をまとめて設定",
    body: `<div class="form-row"><div class="form-group"><label>教科・領域</label><select id="bs-subject">${subjectOptionsHTML(
      ""
    )}</select></div><div class="form-group"><label>単元・場面</label><select id="bs-unit"></select></div></div>`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary" id="bs-ok">設定する</button>`
  });
  bindSubjectUnit($("#bs-subject", m), $("#bs-unit", m));
  $("#bs-ok", m).addEventListener("click", () => {
    const s = $("#bs-subject", m).value,
      u = $("#bs-unit", m).value;
    selectedEpisodes().forEach((e) => {
      e.subject = s;
      e.unit = u;
      if (s) e.quick = false;
      e.updatedAt = nowISO();
    });
    save();
    closeModal(true);
    toast("教科・単元を設定しました");
    refresh();
  });
};
ACTIONS["bulk-tag"] = () => {
  const m = openModal({
    title: "🏷 観点をまとめて追加",
    body: `<div class="bt-tags"></div>`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary" id="bt-ok">追加する</button>`
  });
  const tp = tagPicker($(".bt-tags", m));
  $("#bt-ok", m).addEventListener("click", () => {
    const add = tp.get();
    if (!add.length) return;
    selectedEpisodes().forEach((e) => {
      add.forEach((t) => {
        if (!e.tags.includes(t)) e.tags.push(t);
      });
      e.quick = false;
      e.updatedAt = nowISO();
    });
    save();
    closeModal(true);
    toast("観点を追加しました");
    refresh();
  });
};
ACTIONS["bulk-star"] = () => {
  selectedEpisodes().forEach((e) => {
    e.star = true;
  });
  save();
  toast("所見候補（★）にしました");
  refresh();
};
ACTIONS["bulk-del"] = () => {
  const n = ui.recSelected.size;
  confirmModal({
    title: "まとめて削除",
    message: `選択した${n}件の記録を削除します。よろしいですか？`,
    okLabel: "削除する",
    danger: true,
    onOk: () => {
      const removed = state.episodes.filter((e) => ui.recSelected.has(e.id));
      state.episodes = state.episodes.filter((e) => !ui.recSelected.has(e.id));
      ui.recSelected.clear();
      save();
      refresh();
      toast(`${n}件を削除しました`, {
        actionLabel: "元に戻す",
        onAction: () => {
          state.episodes.push(...removed);
          save();
          refresh();
        }
      });
    }
  });
};

// 一覧からの操作
ACTIONS["ep-edit"] = (el) => {
  const ep = state.episodes.find((e) => e.id === el.dataset.id);
  if (!ep) return;
  if (ui.view === "records" && ui.loadEpisodeIntoForm)
    ui.loadEpisodeIntoForm(ep);
  else openEpisodeModal(ep);
};
ACTIONS["ep-del"] = (el) =>
  removeWithUndo("episodes", el.dataset.id, "エピソード");
ACTIONS["ep-star"] = (el) => {
  const ep = state.episodes.find((e) => e.id === el.dataset.id);
  if (!ep) return;
  ep.star = !ep.star;
  save();
  refresh();
};
ACTIONS["ep-new"] = (el) =>
  openEpisodeModal(null, el.dataset.id ? [el.dataset.id] : []);
ACTIONS["rec-edit-date"] = (el) => {
  const ep = state.episodes.find((e) => e.id === el.dataset.id);
  if (!ep) return;
  const inp = document.createElement("input");
  inp.type = "date";
  inp.value = ep.date;
  inp.className = "inline-date";
  el.replaceWith(inp);
  inp.focus();
  let done = false,
    timer = null;
  const valid = (v) => /^(19|20|21)\d\d-\d\d-\d\d$/.test(v);
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    if (valid(inp.value) && inp.value !== ep.date) {
      ep.date = inp.value;
      ep.updatedAt = nowISO();
      save();
      toast(`記録日を ${fmtMD(ep.date)} に変更しました`);
    }
    refresh();
  };
  // 数字を打っている途中で確定しないよう、少し待ってから確定
  inp.addEventListener("change", () => {
    clearTimeout(timer);
    if (valid(inp.value)) timer = setTimeout(finish, 1200);
  });
  inp.addEventListener("blur", () => setTimeout(finish, 150));
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish();
    if (e.key === "Escape") {
      done = true;
      refresh();
    }
  });
};

// ============================================================
//  児童カルテ（名簿・児童別一覧・個人ページ）
// ============================================================
function studentStats(range) {
  const map = {};
  state.students.forEach((s) => {
    map[s.id] = {
      eps: 0,
      last: "",
      beh: 0,
      behOpen: 0,
      par: 0,
      follow: 0,
      star: 0
    };
  });
  state.episodes.forEach((e) => {
    const m = map[e.studentId];
    if (!m) return;
    if (inRange(e.date, range)) {
      m.eps++;
      if (e.star) m.star++;
    }
    if (e.date > m.last) m.last = e.date;
  });
  state.behaviors.forEach((b) => {
    const m = map[b.studentId];
    if (!m) return;
    if (inRange(b.date, range)) m.beh++;
    if (b.status === "対応中") m.behOpen++;
  });
  state.parents.forEach((p) => {
    const m = map[p.studentId];
    if (!m) return;
    if (inRange(p.date, range)) m.par++;
    if (p.followUp && !p.followUpDone) m.follow++;
  });
  return map;
}

VIEWS.students = (root) => {
  root.innerHTML = `
    <div class="page-head"><h2>👧 児童カルテ</h2>
      <div class="page-actions">
        <button type="button" class="btn btn-outline" data-act="print-all-karte">🖨 全員のカルテを印刷</button>
        <button type="button" class="btn btn-outline" data-act="student-bulk">📋 名簿を一括登録</button>
        <button type="button" class="btn btn-primary" data-act="student-new">＋ 児童を追加</button>
      </div></div>
    <div class="toolbar">
      <input type="search" id="stu-q" placeholder="名前・ふりがな・番号で検索" value="${esc(
        ui.stu.q
      )}">
      <select id="stu-sort">${optionsHTML(
        [
          { value: "no", label: "出席番号順" },
          { value: "fewest", label: "記録が少ない順" },
          { value: "oldest", label: "最終記録が古い順" },
          { value: "behavior", label: "注意行動が多い順" },
          { value: "kana", label: "五十音順" }
        ],
        ui.stu.sort
      )}</select>
      <label class="inline-label">記録数の期間 ${periodSelectHTML(
        "stu-period",
        ui.stu.period
      )}</label>
    </div>
    <div id="stu-alert"></div>
    <div class="student-grid" id="stu-grid"></div>`;
  const draw = () => {
    const range = periodRange(ui.stu.period);
    const st = studentStats(range);
    let list = studentsSorted().filter((s) => studentMatch(s, ui.stu.q));
    if (ui.stu.sort === "fewest")
      list.sort((a, b) => st[a.id].eps - st[b.id].eps);
    if (ui.stu.sort === "oldest")
      list.sort((a, b) =>
        (st[a.id].last || "").localeCompare(st[b.id].last || "")
      );
    if (ui.stu.sort === "behavior")
      list.sort((a, b) => st[b.id].beh - st[a.id].beh);
    if (ui.stu.sort === "kana")
      list.sort((a, b) =>
        (a.kana || a.name).localeCompare(b.kana || b.name, "ja")
      );
    const max = Math.max(1, ...state.students.map((s) => st[s.id].eps));
    const avg = state.students.length
      ? state.students.reduce((a, s) => a + st[s.id].eps, 0) /
        state.students.length
      : 0;
    const term = currentTerm();
    const stale = state.students.filter(
      (s) => !st[s.id].last || daysAgo(st[s.id].last) >= 14
    );
    $("#stu-alert").innerHTML =
      stale.length && state.students.length
        ? `<div class="notice notice-warn">👀 2週間以上記録がない児童が <b>${
            stale.length
          }人</b> います：${stale
            .slice(0, 12)
            .map(
              (s) =>
                `<button type="button" class="link-btn" data-act="quick-for" data-id="${
                  s.id
                }">${esc(dispName(s))}</button>`
            )
            .join("、")}${stale.length > 12 ? " ほか" : ""}</div>`
        : "";
    $("#stu-grid").innerHTML = list.length
      ? list
          .map((s) => {
            const m = st[s.id];
            const low = state.students.length >= 3 && m.eps < avg * 0.5;
            const k = findShoken(s.id, term, "総合所見");
            const ks =
              k && k.text
                ? k.status === "下書き"
                  ? `△ 下書き`
                  : `● ${k.status}`
                : "○ 未着手";
            return `<div class="stu-card ${low ? "low" : ""}">
        <button type="button" class="stu-card-main" data-act="open-student" data-id="${
          s.id
        }">
          <div class="stu-card-head"><span class="no-badge">${
            s.no === "" ? "-" : s.no
          }</span><div><div class="stu-name">${esc(
              dispName(s)
            )}</div><div class="stu-kana">${
              state.settings.maskNames ? "" : esc(s.kana)
            }</div></div></div>
          <div class="stu-bar"><div class="meter sm"><div class="meter-fill ${
            low ? "low" : ""
          }" style="width:${Math.round(
              (m.eps / max) * 100
            )}%"></div></div><span class="stu-count">${m.eps}件${
              low ? ` <em class="low-tag">少</em>` : ""
            }</span></div>
          <div class="stu-meta">最終記録：${
            m.last ? agoLabel(m.last) : "なし"
          }${m.star ? `　★${m.star}` : ""}</div>
          <div class="stu-flags">
            ${
              m.beh
                ? `<span class="flag f-beh">⚠️ ${m.beh}${
                    m.behOpen ? `（対応中${m.behOpen}）` : ""
                  }</span>`
                : ""
            }
            ${
              m.par
                ? `<span class="flag f-par">📞 ${m.par}${
                    m.follow ? `（要フォロー${m.follow}）` : ""
                  }</span>`
                : ""
            }
            ${s.care ? `<span class="flag f-care">🩺 配慮事項</span>` : ""}
            <span class="flag f-shoken">所見 ${ks}</span>
          </div>
        </button>
        <button type="button" class="stu-card-memo" data-act="quick-for" data-id="${
          s.id
        }" title="この児童のメモ">✏️</button>
      </div>`;
          })
          .join("")
      : emptyHTML(
          state.students.length
            ? "該当する児童がいません"
            : "名簿がまだありません",
          "「名簿を一括登録」でExcelからコピーして貼り付けると便利です。"
        );
  };
  $("#stu-q").addEventListener("input", (e) => {
    ui.stu.q = e.target.value;
    draw();
  });
  $("#stu-sort").addEventListener("change", (e) => {
    ui.stu.sort = e.target.value;
    draw();
  });
  $("#stu-period").addEventListener("change", (e) => {
    ui.stu.period = e.target.value;
    draw();
  });
  draw();
  ui.refresh = draw;
};

// ---------- 個人カルテ ----------
VIEWS.student = (root, id) => {
  const s = getStudent(id);
  if (!s) {
    root.innerHTML = emptyHTML("児童が見つかりません");
    return;
  }
  const list = studentsSorted();
  const idx = list.findIndex((x) => x.id === id);
  const prev = list[idx - 1],
    next = list[idx + 1];
  const cnt = {
    eps: state.episodes.filter((e) => e.studentId === id).length,
    beh: behaviorsOf(id).length,
    par: parentsOf(id).length,
    sk: state.shoken.filter((k) => k.studentId === id && k.text).length
  };
  const tabs = [
    { key: "overview", label: "📊 概要・分析" },
    { key: "episodes", label: `📝 エピソード (${cnt.eps})` },
    { key: "shoken", label: `✍️ 所見 (${cnt.sk})` },
    { key: "behaviors", label: `⚠️ 注意行動 (${cnt.beh})` },
    { key: "parents", label: `📞 保護者記録 (${cnt.par})` },
    {
      key: "care",
      label: `🩺 配慮・引き継ぎ${s.care || s.handover ? " ●" : ""}`
    }
  ];
  root.innerHTML = `
    <div class="karte-head">
      <div class="karte-nav">
        <button type="button" class="btn btn-sm btn-text" data-act="go" data-view="students">← 一覧</button>
        <button type="button" class="btn btn-sm btn-outline" ${
          prev ? `data-act="open-student" data-id="${prev.id}"` : "disabled"
        } title="前の児童">◀</button>
        <button type="button" class="btn btn-sm btn-outline" ${
          next ? `data-act="open-student" data-id="${next.id}"` : "disabled"
        } title="次の児童">▶</button>
      </div>
      <div class="karte-title"><span class="no-badge lg">${
        s.no === "" ? "-" : s.no
      }</span><div><h2>${esc(dispName(s))}</h2><div class="muted">${
    state.settings.maskNames ? "" : esc(s.kana)
  }${s.gender ? `　${esc(s.gender)}` : ""}</div></div></div>
      <div class="page-actions">
        <button type="button" class="btn btn-primary" data-act="quick-for" data-id="${
          s.id
        }">✏️ メモ</button>
        <button type="button" class="btn btn-outline" data-act="shoken-for" data-id="${
          s.id
        }">✍️ 所見を書く</button>
        <button type="button" class="btn btn-outline" data-act="print-student" data-id="${
          s.id
        }">🖨 カルテ印刷</button>
        <button type="button" class="btn btn-outline" data-act="student-edit" data-id="${
          s.id
        }">⚙️ 編集</button>
      </div>
    </div>
    <div class="tabs" role="tablist">${tabs
      .map(
        (t) =>
          `<button type="button" class="tab ${
            ui.stuTab === t.key ? "on" : ""
          }" data-tab="${t.key}">${t.label}</button>`
      )
      .join("")}</div>
    <div id="karte-body"></div>`;
  $$(".tab", root).forEach((b) =>
    b.addEventListener("click", () => {
      ui.stuTab = b.dataset.tab;
      render();
    })
  );
  const body = $("#karte-body");
  const draw = () => renderKarteTab(body, s);
  draw();
  ui.refresh = () => render();
};

function renderKarteTab(body, s) {
  const id = s.id;
  const used = usedEpisodeIds();
  if (ui.stuTab === "overview") {
    body.innerHTML = `<div class="toolbar"><label class="inline-label">期間 ${periodSelectHTML(
      "karte-period",
      ui.stuPeriod,
      false
    )}</label></div><div id="karte-analysis"></div>`;
    const drawA = () => {
      $("#karte-analysis").innerHTML = studentAnalysisHTML(
        id,
        periodRange(ui.stuPeriod)
      );
    };
    $("#karte-period").addEventListener("change", (e) => {
      ui.stuPeriod = e.target.value;
      drawA();
    });
    drawA();
  } else if (ui.stuTab === "episodes") {
    const eps = state.episodes
      .filter((e) => e.studentId === id)
      .sort((a, b) => b.date.localeCompare(a.date));
    body.innerHTML = `<div class="toolbar"><button type="button" class="btn btn-primary" data-act="ep-new" data-id="${id}">＋ エピソードを追加</button><button type="button" class="btn btn-outline" data-act="go" data-view="records" id="karte-to-records">記録画面で絞り込む</button></div>
      ${
        eps.length
          ? `<div class="card-list">${eps
              .map(
                (e) => `
        <article class="rec-card ${e.isGuidance ? "row-guid" : ""}">
          <div class="rec-card-head"><button type="button" class="date-chip" data-act="rec-edit-date" data-id="${
            e.id
          }" title="クリックで記録日を変更">${esc(
                  fmtMD(e.date)
                )}</button><span class="cell-badges">${episodeBadges(
                  e,
                  used
                )}</span>
            <span class="rec-card-ops"><button type="button" class="star-btn ${
              e.star ? "on" : ""
            }" data-act="ep-star" data-id="${e.id}" title="所見候補">${
                  e.star ? "★" : "☆"
                }</button><button type="button" class="link-btn" data-act="ep-edit" data-id="${
                  e.id
                }">編集</button><button type="button" class="link-btn danger" data-act="ep-del" data-id="${
                  e.id
                }">削除</button></span></div>
          <p>${nl2br(e.content)}</p>
        </article>`
              )
              .join("")}</div>`
          : emptyHTML("この児童のエピソードはまだありません")
      }`;
    const btn = $("#karte-to-records", body);
    if (btn)
      btn.addEventListener(
        "click",
        () => {
          ui.rec.student = id;
        },
        true
      );
  } else if (ui.stuTab === "shoken") {
    const items = state.shoken
      .filter((k) => k.studentId === id && k.text)
      .sort((a, b) => (a.term + a.type).localeCompare(b.term + b.type, "ja"));
    body.innerHTML = `<div class="toolbar"><button type="button" class="btn btn-primary" data-act="shoken-for" data-id="${id}">✍️ 所見を書く</button></div>
      ${
        items.length
          ? `<div class="card-list">${items
              .map(
                (k) => `
        <article class="rec-card">
          <div class="rec-card-head"><b>${esc(k.term)}</b>${badge(
                  shokenType(k.type).label,
                  "b-subject"
                )}${k.subject ? badge(k.subject, "b-tag") : ""}${badge(
                  k.status,
                  k.status === "下書き" ? "b-quick" : "b-used"
                )}<span class="muted small">${charCount(k.text)}字</span>
            <span class="rec-card-ops"><button type="button" class="link-btn" data-act="shoken-open" data-id="${
              k.id
            }">開く</button><button type="button" class="link-btn" data-act="shoken-copy" data-id="${
                  k.id
                }">コピー</button></span></div>
          <p class="shoken-text">${nl2br(k.text)}</p>
        </article>`
              )
              .join("")}</div>`
          : emptyHTML("まだ所見がありません")
      }`;
  } else if (ui.stuTab === "behaviors") {
    const list = behaviorsOf(id).sort((a, b) => b.date.localeCompare(a.date));
    body.innerHTML = `<div class="toolbar"><button type="button" class="btn btn-primary" data-act="behavior-new" data-id="${id}">＋ 注意行動を記録</button></div>${
      list.length
        ? `<div class="card-list">${list.map(behaviorCardHTML).join("")}</div>`
        : emptyHTML("注意行動の記録はありません")
    }`;
  } else if (ui.stuTab === "parents") {
    const list = parentsOf(id).sort((a, b) => b.date.localeCompare(a.date));
    body.innerHTML = `<div class="toolbar"><button type="button" class="btn btn-primary" data-act="parent-new" data-id="${id}">＋ 保護者記録を追加</button></div>${
      list.length
        ? `<div class="card-list">${list.map(parentCardHTML).join("")}</div>`
        : emptyHTML("保護者対応の記録はありません")
    }`;
  } else if (ui.stuTab === "care") {
    body.innerHTML = `
      <section class="panel">
        <div class="form-group"><label>🩺 配慮事項 <small class="muted">（アレルギー・健康上の注意・学習や生活の支援の手立て など）</small></label><textarea id="care-text" rows="5">${esc(
          s.care
        )}</textarea></div>
        <div class="form-group"><label>📦 次年度への引き継ぎ事項 <small class="muted">（Excel出力の「引き継ぎ」シートに入ります）</small></label><textarea id="handover-text" rows="6">${esc(
          s.handover
        )}</textarea></div>
        <div class="form-group"><label>📝 その他メモ</label><textarea id="memo-text" rows="3">${esc(
          s.memo
        )}</textarea></div>
        <div class="form-actions"><span class="muted small" id="care-state"></span><button type="button" class="btn btn-primary" id="care-save">💾 保存する</button></div>
      </section>`;
    const saveCare = () => {
      s.care = $("#care-text").value;
      s.handover = $("#handover-text").value;
      s.memo = $("#memo-text").value;
      save();
      $("#care-state").textContent =
        "保存しました " + fmtDateTime(nowISO()).slice(-5);
    };
    $("#care-save").addEventListener("click", () => {
      saveCare();
      toast("配慮・引き継ぎ事項を保存しました");
    });
    $$("#care-text,#handover-text,#memo-text").forEach((t) =>
      t.addEventListener("input", debounce(saveCare, 800))
    );
  }
}

// ---------- 児童の追加・編集 ----------
function openStudentForm(s = null) {
  const isEdit = !!s;
  const counts = s
    ? {
        e: state.episodes.filter((e) => e.studentId === s.id).length,
        b: behaviorsOf(s.id).length,
        p: parentsOf(s.id).length,
        k: state.shoken.filter((k) => k.studentId === s.id).length
      }
    : null;
  const m = openModal({
    title: isEdit ? "⚙️ 児童の情報を編集" : "＋ 児童を追加",
    wide: true,
    body: `
      <div class="form-row">
        <div class="form-group" style="max-width:120px"><label>出席番号</label><input type="number" id="sf-no" min="1" value="${esc(
          s ? s.no : nextStudentNo()
        )}"></div>
        <div class="form-group"><label>氏名 <span class="req">*</span></label><input type="text" id="sf-name" value="${esc(
          s ? s.name : ""
        )}" placeholder="例：山田 太郎" autofocus></div>
        <div class="form-group"><label>ふりがな</label><input type="text" id="sf-kana" value="${esc(
          s ? s.kana : ""
        )}" placeholder="やまだ たろう"></div>
        <div class="form-group" style="max-width:130px"><label>性別</label><select id="sf-gender">${optionsHTML(
          ["男", "女", "その他"],
          s ? s.gender : "",
          "（未設定）"
        )}</select></div>
      </div>
      <div class="form-group"><label>🩺 配慮事項</label><textarea id="sf-care" rows="3" placeholder="アレルギー、健康上の注意、支援の手立てなど">${esc(
        s ? s.care : ""
      )}</textarea></div>
      <div class="form-group"><label>📦 引き継ぎ事項</label><textarea id="sf-handover" rows="3">${esc(
        s ? s.handover : ""
      )}</textarea></div>
      ${
        isEdit
          ? `<div class="danger-zone"><p class="muted small">記録：エピソード${counts.e}件・所見${counts.k}件・注意行動${counts.b}件・保護者記録${counts.p}件</p><button type="button" class="btn btn-sm btn-danger-outline" id="sf-del">この児童を削除</button></div>`
          : ""
      }`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary" id="sf-save">💾 保存</button>`
  });
  $("#sf-save", m).addEventListener("click", () => {
    const name = cleanName($("#sf-name", m).value);
    if (!name) {
      toast("氏名を入力してください", { type: "error" });
      return;
    }
    const dup = findStudentByName(name);
    if (dup && (!s || dup.id !== s.id)) {
      toast("同じ名前の児童がすでに登録されています", { type: "error" });
      return;
    }
    const data = {
      no: $("#sf-no", m).value === "" ? "" : Number($("#sf-no", m).value),
      name,
      kana: cleanName($("#sf-kana", m).value),
      gender: $("#sf-gender", m).value,
      care: $("#sf-care", m).value,
      handover: $("#sf-handover", m).value
    };
    if (s) Object.assign(s, data);
    else state.students.push(normStudent(data));
    save();
    closeModal(true);
    toast(isEdit ? "保存しました" : `${name}さんを追加しました`);
    refresh();
  });
  if (isEdit)
    $("#sf-del", m).addEventListener("click", () => {
      confirmModal({
        title: "児童の削除",
        danger: true,
        okLabel: "削除する",
        message: `${s.name}さんを名簿から削除します。\nこの児童の記録（エピソード${counts.e}件・所見${counts.k}件・注意行動${counts.b}件・保護者記録${counts.p}件）もすべて削除されます。`,
        onOk: () => {
          const backup = {
            s,
            e: state.episodes.filter((x) => x.studentId === s.id),
            k: state.shoken.filter((x) => x.studentId === s.id),
            b: state.behaviors.filter((x) => x.studentId === s.id),
            p: state.parents.filter((x) => x.studentId === s.id)
          };
          state.students = state.students.filter((x) => x.id !== s.id);
          state.episodes = state.episodes.filter((x) => x.studentId !== s.id);
          state.shoken = state.shoken.filter((x) => x.studentId !== s.id);
          state.behaviors = state.behaviors.filter((x) => x.studentId !== s.id);
          state.parents = state.parents.filter((x) => x.studentId !== s.id);
          save();
          go("students");
          toast(`${s.name}さんを削除しました`, {
            actionLabel: "元に戻す",
            onAction: () => {
              state.students.push(backup.s);
              state.episodes.push(...backup.e);
              state.shoken.push(...backup.k);
              state.behaviors.push(...backup.b);
              state.parents.push(...backup.p);
              save();
              refresh();
            }
          });
        }
      });
    });
}
ACTIONS["student-new"] = () => openStudentForm();
ACTIONS["student-edit"] = (el) => openStudentForm(getStudent(el.dataset.id));

// ---------- 名簿の一括登録 ----------
ACTIONS["student-bulk"] = () => {
  const m = openModal({
    title: "📋 名簿を一括登録",
    wide: true,
    body: `
      <p>1行に1人ずつ入力してください。Excelの名簿（番号・氏名・ふりがな の列）をそのままコピーして貼り付けられます。</p>
      <textarea id="bulk-text" rows="12" placeholder="1&#9;山田 太郎&#9;やまだ たろう&#10;2&#9;佐藤 花子&#9;さとう はなこ&#10;鈴木 一郎"></textarea>
      <div id="bulk-preview" class="muted small"></div>
      <label class="check"><input type="checkbox" id="bulk-update" checked> すでに登録済みの名前は、番号・ふりがなを上書きする</label>`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary" id="bulk-ok">登録する</button>`
  });
  const parse = () =>
    $("#bulk-text", m)
      .value.split(/\r?\n/)
      .map((line) => {
        const cells = line
          .split(/\t|,|，/)
          .map((c) => c.trim())
          .filter((c) => c !== "");
        if (!cells.length) return null;
        let no = "",
          name = "",
          kana = "";
        if (/^\d+$/.test(cells[0])) {
          no = Number(cells[0]);
          cells.shift();
        }
        name = cleanName(cells[0] || "");
        kana = cleanName(cells[1] || "");
        if (!name) return null;
        if (/^(番号|氏名|名前|出席番号)$/.test(name)) return null; // 見出し行
        return { no, name, kana };
      })
      .filter(Boolean);
  $("#bulk-text", m).addEventListener("input", () => {
    const rows = parse();
    const exist = rows.filter((r) => findStudentByName(r.name)).length;
    $("#bulk-preview", m).textContent = rows.length
      ? `${rows.length}人を読み取りました（新規 ${
          rows.length - exist
        }人／登録済み ${exist}人）`
      : "";
  });
  $("#bulk-ok", m).addEventListener("click", () => {
    const rows = parse();
    if (!rows.length) {
      toast("名前が読み取れませんでした", { type: "error" });
      return;
    }
    const upd = $("#bulk-update", m).checked;
    let added = 0,
      updated = 0;
    rows.forEach((r) => {
      const ex = findStudentByName(r.name);
      if (ex) {
        if (upd) {
          if (r.no !== "") ex.no = r.no;
          if (r.kana) ex.kana = r.kana;
          updated++;
        }
      } else {
        state.students.push(
          normStudent({
            no: r.no === "" ? nextStudentNo() : r.no,
            name: r.name,
            kana: r.kana
          })
        );
        added++;
      }
    });
    save();
    closeModal(true);
    toast(`${added}人を追加${updated ? `、${updated}人を更新` : ""}しました`);
    refresh();
  });
};

// ============================================================
//  所見づくり（通知表・指導要録の文章）
// ============================================================

// ---------- 文例（です・ます調で記述。である調には自動変換） ----------
const PHRASE_BANK = [
  {
    group: "書き出し",
    items: [
      "明るく朗らかな性格で、学級の雰囲気を和やかにしています。",
      "何事にも誠実に取り組み、友達から厚い信頼を寄せられています。",
      "穏やかで優しい心をもち、困っている友達にそっと声をかけることができます。",
      "好奇心が旺盛で、身の回りのことに進んで興味をもって関わっています。",
      "落ち着いて物事に取り組み、自分の役割を最後までやり遂げることができます。"
    ]
  },
  {
    group: "知識・技能",
    items: [
      "学習した内容を確実に身に付け、正確に問題を解くことができました。",
      "繰り返し練習に取り組み、正確に計算できるようになりました。",
      "丁寧なノートづくりを心がけ、学習した内容を自分の言葉で整理しています。",
      "漢字の学習に根気強く取り組み、文章の中で正しく使うことができました。"
    ]
  },
  {
    group: "思考・判断・表現",
    items: [
      "自分の考えを図や言葉を使って筋道立てて説明することができました。",
      "友達の考えと比べながら、自分の考えを深めることができました。",
      "根拠をはっきりさせて、自分の考えを分かりやすく発表しました。",
      "身近な事柄から問いを見つけ、予想を立てて確かめることができました。"
    ]
  },
  {
    group: "主体的に学習に取り組む態度",
    items: [
      "分からないことをそのままにせず、進んで質問したり調べたりしています。",
      "めあてをもって粘り強く学習に取り組み、最後までやり遂げました。",
      "学習を振り返り、次に生かそうとする姿勢が見られます。",
      "タブレット端末を効果的に活用し、調べたことを工夫してまとめました。"
    ]
  },
  {
    group: "生活・行動",
    items: [
      "毎朝元気にあいさつをし、気持ちのよい一日のスタートを切っています。",
      "係の仕事に責任をもって取り組み、学級のために進んで働いています。",
      "友達の気持ちを考えて行動し、誰とでも仲よく過ごしています。",
      "決まりを守り、落ち着いて学校生活を送っています。",
      "清掃活動では、隅々まで丁寧に取り組んでいます。",
      "生き物や草花を大切にし、進んで世話をしています。"
    ]
  },
  {
    group: "特別活動",
    items: [
      "学級会では、みんなが楽しめるような意見を進んで出しました。",
      "運動会では、自分の係の仕事に最後まで責任をもって取り組みました。",
      "委員会活動に意欲的に取り組み、学校のために進んで働きました。",
      "集会では、下級生に優しく声をかけ、上級生としての役割を果たしました。"
    ]
  },
  {
    group: "課題をやわらかく伝える",
    items: [
      "今後は、身の回りの整理整頓にも気を配れるよう、学校でも声をかけていきます。",
      "自分の考えをもう少し自信をもって伝えられるよう、引き続き支援していきます。",
      "落ち着いて話を聞くことを意識すると、さらに力が伸びると考えます。"
    ]
  },
  {
    group: "締め",
    items: [
      "今後の更なる成長が楽しみです。",
      "これからも自分のよさを伸ばしていってほしいと思います。",
      "次の学期も様々な場面での活躍を期待しています。",
      "自信をもって、さらに力を伸ばしていってほしいと思います。"
    ]
  }
];
function phraseGroup(name) {
  const g = PHRASE_BANK.find((g) => g.group === name);
  return g ? g.items : [];
}

// ---------- 言い換えチェック（否定的な表現 → 肯定的な表現の候補） ----------
const NG_WORDS = [
  ["落ち着きがない", ["活動的で", "好奇心旺盛で"]],
  ["うるさい", ["元気がよく"]],
  ["おしゃべり", ["友達との会話を楽しむ"]],
  ["しつこい", ["粘り強い"]],
  ["頑固", ["自分の考えをしっかりもっている"]],
  ["わがまま", ["自分の思いをはっきり伝えられる"]],
  ["飽きっぽい", ["いろいろなことに興味をもつ"]],
  ["消極的", ["慎重に物事を考える"]],
  ["おとなしい", ["穏やかで落ち着いた"]],
  ["気が弱い", ["優しく思いやりのある"]],
  ["乱暴", ["元気いっぱいの"]],
  ["だらしない", ["（具体的な場面と手立てを書く）"]],
  ["遅い", ["丁寧に", "じっくりと"]],
  ["できない", ["〜に挑戦している", "〜できるようになってきた"]],
  ["苦手", ["〜に向けて努力している"]],
  ["集中力がない", ["興味のあることにじっくり取り組む"]],
  ["反抗的", ["自分の考えをもっている"]],
  ["ふざけ", ["ユーモアがあり、場を明るくする"]],
  ["口が悪い", ["思ったことを率直に伝える"]],
  ["やる気がない", ["自分のペースで取り組む"]],
  ["自分勝手", ["自分の思いをもって行動できる"]],
  ["目立たない", ["陰で支えることができる"]],
  ["暗い", ["物静かで"]],
  ["すぐ泣く", ["感受性が豊かな"]],
  ["こだわりが強い", ["一つのことにじっくり取り組める"]],
  ["理解が遅い", ["じっくり考えて理解する"]],
  ["問題児", ["（不適切な表現です）"]],
  ["問題行動", ["（具体的な事実と支援の経過を書く）"]],
  ["忘れ物が多い", ["持ち物の準備に取り組んでいる"]],
  ["不器用", ["一つ一つ丁寧に取り組む"]],
  ["いじわる", ["（事実と指導の経過を具体的に）"]]
];
const RANUKI = [
  ["見れる", "見られる"],
  ["来れる", "来られる"],
  ["食べれる", "食べられる"],
  ["寝れる", "寝られる"],
  ["出れる", "出られる"],
  ["起きれる", "起きられる"],
  ["着れる", "着られる"],
  ["決めれる", "決められる"],
  ["考えれる", "考えられる"]
];

// ---------- 文末の変換 ----------
const U_KANJI =
  "言思使伝笑歌拾習買払合戦争誘救洗祝失競会貰向扱補誓願吸追揃整迷疑従敬養謝";
function toDesu(s) {
  const R = [
    [
      /(ます|ました|です|でした|ません|ませんでした|ましょう|でしょう)$/,
      (m) => m
    ],
    [/(様子|姿)$/, "$1が見られました"],
    [/(て|で)いた$/, "$1いました"],
    [/(て|で)いる$/, "$1います"],
    [/([ぁ-んー])てた$/, "$1ていました"],
    [/んでた$/, "んでいました"],
    [/([ぁ-んー])てる$/, "$1ています"],
    [/んでる$/, "んでいます"],
    [/できた$/, "できました"],
    [/できる$/, "できます"],
    [/(だった|であった)$/, "でした"],
    [/である$/, "です"],
    [/向かった$/, "向かいました"],
    [/(分|わ|つ|か|助|預|授|掛)かった$/, "$1かりました"],
    [/かった$/, "かったです"],
    [/した$/, "しました"],
    [/する$/, "します"],
    [/しない$/, "しません"],
    [/(に|へ|て)(行|い)った$/, "$1$2きました"],
    [/行った$/, "行いました"],
    [/といった$/, "といいました"],
    [new RegExp(`([${U_KANJI}])った$`), "$1いました"],
    [
      /(もら|つか|てつだ|わら|うた|ひろ|なら|あら|そろ|まよ|したが|ねが|かよ|あつか|おぎな|ちか)った$/,
      "$1いました"
    ],
    [/([持待立勝育打保経放])った$/, "$1ちました"],
    [/(そだ|も)った$/, "$1ちました"],
    [/った$/, "りました"],
    [/いた$/, "きました"],
    [/いだ$/, "ぎました"],
    [
      /([学遊選運呼喜並結飛跳叫転浮及]|あそ|まな|えら|はこ|よろこ|むす|さけ|ころ|うか)んだ$/,
      "$1びました"
    ],
    [/んだ$/, "みました"],
    [/(見|着|来|居|寝|煮|似|得|出)た$/, "$1ました"],
    [/([えけげせぜてでねへべめれきぎじちにびみり])た$/, "$1ました"],
    [/だ$/, "です"],
    [/([えけげせぜてでねへべめれ])る$/, "$1ます"],
    [/いる$/, "います"],
    [/(しい|よい|いい|らしい|たい)$/, "$1です"]
  ];
  for (const [re, rep] of R) if (re.test(s)) return s.replace(re, rep);
  return s;
}
function toDearu(s) {
  const R = [
    [/(様子|姿)$/, "$1が見られた"],
    [/([ぁ-んー])てた$/, "$1ていた"],
    [/んでた$/, "んでいた"],
    [/([ぁ-んー])てる$/, "$1ている"],
    [/(て|で)いました$/, "$1いた"],
    [/(て|で)います$/, "$1いる"],
    [/できました$/, "できた"],
    [/できます$/, "できる"],
    [/かったです$/, "かった"],
    [/(しい|よい|いい|らしい|たい|ない)です$/, "$1"],
    [/でした$/, "であった"],
    [/です$/, "である"],
    [/しました$/, "した"],
    [/します$/, "する"],
    [/しません$/, "しない"],
    [/(見|着|来|居|寝|煮|似|得|出)ました$/, "$1た"],
    [/てみました$/, "てみた"],
    [/([えけげせぜてでねへべめれ])ました$/, "$1た"],
    [/じました$/, "じた"],
    [/(に|へ|て)(行|い)きました$/, "$1$2った"],
    [/きました$/, "いた"],
    [/ぎました$/, "いだ"],
    [/(び|み|に)ました$/, "んだ"],
    [/(い|ち|り)ました$/, "った"],
    [/([えけげせぜてでねへべめれ])ます$/, "$1る"],
    [/(ん|い)だ$/, (m) => m],
    [/だ$/, "である"]
  ];
  for (const [re, rep] of R) if (re.test(s)) return s.replace(re, rep);
  return s;
}
function splitSentences(text) {
  return String(text || "")
    .replace(/([。！？!?])/g, "$1\n")
    .split(/\n+/)
    .map((s) =>
      s
        .replace(/^[\s・●○◎\-－*＊]+/, "")
        .replace(/[\s。．.！!？?]+$/, "")
        .trim()
    )
    .filter(Boolean);
}
function convertEnding(s, style) {
  if (/[」』）)]$/.test(s)) return s;
  return style === "dearu" ? toDearu(s) : toDesu(s);
}
function convertStyle(text, style) {
  return splitSentences(text)
    .map((s) => convertEnding(s, style) + (/[」』）)]$/.test(s) ? "" : "。"))
    .join("");
}
// 本人の名前を消し、ほかの児童の名前は「友達」に置き換える
function cleanContent(text, sid) {
  let t = String(text || "")
    .replace(/，/g, "、")
    .replace(/．/g, "。");
  const hon = "(?:さん|くん|君|ちゃん)";
  const own = getStudent(sid);
  const variantsOf = (s) => {
    const parts = s.name.split(" ");
    return {
      full: [s.name, nameKey(s.name)],
      parts: parts.length >= 2 ? [parts[0], parts[parts.length - 1]] : []
    };
  };
  if (own) {
    const v = variantsOf(own);
    v.full.forEach((n) => {
      t = t.replace(new RegExp(regEsc(n) + hon + "?(?:は|が|も)、?", "g"), "");
    });
    v.parts
      .filter((p) => p.length >= 1)
      .forEach((n) => {
        t = t.replace(new RegExp(regEsc(n) + hon + "(?:は|が|も)、?", "g"), "");
      });
  }
  t = t.replace(/本児(?:は|が|も)、?/g, "");
  state.students.forEach((s) => {
    if (own && s.id === own.id) return;
    const v = variantsOf(s);
    v.full.forEach((n) => {
      if (n.length >= 2)
        t = t.replace(new RegExp(regEsc(n) + hon + "?", "g"), "友達");
    });
    v.parts.forEach((n) => {
      if (n.length >= 1)
        t = t.replace(new RegExp(regEsc(n) + hon, "g"), "友達");
    });
  });
  return t;
}
const SCENE_PREFIX = {
  休み時間: "休み時間には、",
  給食: "給食の時間には、",
  清掃: "清掃活動では、",
  登下校: "登下校の際には、",
  "朝の会・帰りの会": "朝の会や帰りの会では、",
  "当番・係": "係や当番の活動では、",
  係活動: "係活動では、",
  友達関係: "友達との関わりの中では、",
  話し合い: "学級会の話し合いでは、",
  レクリエーション: "学級レクリエーションでは、",
  委員会: "委員会活動では、",
  クラブ: "クラブ活動では、"
};
const SUBJECT_PHRASE = { 生活: "生活科", "外国語・外国語活動": "外国語活動" };
function contextPrefix(ep, typeKey) {
  const s = ep.subject;
  if (!s) return "";
  const u = ep.unit && !/^(共通|生活全般|その他)/.test(ep.unit) ? ep.unit : "";
  const area = areaOf(s),
    sp = SUBJECT_PHRASE[s] || s;
  if (typeKey === "教科") return u ? `「${u}」の学習では、` : "";
  if (area === "学習") return `${sp}${u ? `の「${u}」` : ""}の学習では、`;
  if (area === "総合")
    return typeKey === "総合的な学習"
      ? u
        ? `「${u}」の学習では、`
        : ""
      : u
      ? `総合的な学習の時間「${u}」では、`
      : "総合的な学習の時間では、";
  if (area === "道徳") return typeKey === "道徳" ? "" : "道徳の学習では、";
  if (SCENE_PREFIX[u]) return SCENE_PREFIX[u];
  if (s === "学校行事" && u) return `${u}では、`;
  if (s === "学級活動") return u ? `学級活動の${u}では、` : "学級活動では、";
  return "";
}
function varyEnding(s, style) {
  const d = style === "dearu";
  const R = [
    [
      /していました$|していた$/,
      d ? "している姿が見られた" : "している姿が見られました"
    ],
    [
      /ていました$|ていた$/,
      d ? "ている姿が見られた" : "ている姿が見られました"
    ],
    [
      /でいました$|でいた$/,
      d ? "でいる姿が見られた" : "でいる姿が見られました"
    ],
    [
      /([一-鿿])できました$|([一-鿿])できた$/,
      (m, a, b) => (a || b) + (d ? "することができた" : "することができました")
    ],
    [
      /([一-鿿])しました$|([一-鿿])した$/,
      (m, a, b) => (a || b) + (d ? "する姿が見られた" : "する姿が見られました")
    ]
  ];
  for (const [re, rep] of R) if (re.test(s)) return s.replace(re, rep);
  return s;
}
function generateShoken(eps, { style, intro, closing, typeKey }) {
  const order = subjectList();
  const sorted = eps
    .slice()
    .sort(
      (a, b) =>
        AREA_ORDER.indexOf(areaOf(a.subject)) -
          AREA_ORDER.indexOf(areaOf(b.subject)) ||
        order.indexOf(a.subject) - order.indexOf(b.subject) ||
        a.date.localeCompare(b.date)
    );
  const out = [];
  if (intro) out.push(convertStyle(intro, style));
  const CONN = ["また、", "さらに、", "そして、"];
  const seen = new Set();
  let lastPrefix = null,
    conn = 0,
    body = 0,
    run = 0;
  sorted.forEach((ep) => {
    const sents = splitSentences(cleanContent(ep.content, ep.studentId)).filter(
      (s0) => {
        const k = nameKey(s0);
        if (seen.has(k)) return false;
        seen.add(k);
        return true; // 同じ文は1回だけ
      }
    );
    if (!sents.length) return;
    const prefix = contextPrefix(ep, typeKey);
    const same = prefix && prefix === lastPrefix;
    sents.forEach((s0, j) => {
      let s = convertEnding(s0, style);
      // 同じ文末が3回続かないように言い回しを少し変える
      const past = style === "dearu" ? /た$/ : /ました$/;
      if (past.test(s)) {
        run++;
        if (run >= 3) {
          const v = varyEnding(s, style);
          if (v !== s) {
            s = v;
            run = 0;
          }
        }
      } else run = 0;
      if (j === 0) {
        const hasCtx =
          s.startsWith(ep.subject) ||
          /^.{0,20}(では、|には、|において)/.test(s);
        if (prefix && !same && !hasCtx) s = prefix + s;
        else if (
          body > 0 &&
          !/^(また|さらに|そして|しかし|特に|一方|その|この|まず|次に|加えて)/.test(
            s
          )
        ) {
          s = CONN[conn % CONN.length] + s;
          conn++;
        }
      }
      out.push(s + (/[」』）)]$/.test(s) ? "" : "。"));
      body++;
    });
    if (prefix) lastPrefix = prefix;
  });
  if (closing) out.push(convertStyle(closing, style));
  return out.join("");
}

// ---------- 表現チェック ----------
function checkShoken(text, { sid, term, type, subject, target }) {
  const res = [];
  const n = charCount(text);
  if (!text.trim()) return [{ lv: "info", msg: "まだ文章がありません。" }];
  NG_WORDS.forEach(([w, alts]) => {
    if (text.includes(w))
      res.push({
        lv: "warn",
        msg: `「${w}」は否定的に受け取られやすい表現です。`,
        word: w,
        alts
      });
  });
  RANUKI.forEach(([w, ok]) => {
    if (text.includes(w))
      res.push({
        lv: "warn",
        msg: `「${w}」は ら抜き言葉です。`,
        word: w,
        alts: [ok]
      });
  });
  // ほかの児童の名前
  const others = state.students.filter(
    (s) =>
      s.id !== sid &&
      (text.includes(s.name) ||
        text.includes(nameKey(s.name)) ||
        (s.name.split(" ").length >= 2 &&
          new RegExp(
            regEsc(s.name.split(" ").pop()) + "(さん|くん|君|ちゃん)"
          ).test(text)))
  );
  if (others.length)
    res.push({
      lv: "danger",
      msg: `ほかの児童の名前が入っています（${others
        .map((s) => dispName(s))
        .join("、")}）。個人情報に注意してください。`
    });
  const own = getStudent(sid);
  if (own && (text.includes(own.name) || text.includes(nameKey(own.name))))
    res.push({
      lv: "info",
      msg: "本人の名前が入っています。通知表では不要な場合が多いです。"
    });
  if (target) {
    if (n > target * 1.1)
      res.push({
        lv: "warn",
        msg: `目標（${target}字）より ${n - target}字 多くなっています。`
      });
    else if (n < target * 0.7)
      res.push({
        lv: "info",
        msg: `目標（${target}字）まで あと${target - n}字 です。`
      });
  }
  // 文末の単調さ
  const sents = text.split("。").filter((x) => x.trim());
  let run = 0,
    maxRun = 0;
  sents.forEach((x) => {
    if (/ました$/.test(x.trim())) {
      run++;
      maxRun = Math.max(maxRun, run);
    } else run = 0;
  });
  if (maxRun >= 3)
    res.push({
      lv: "info",
      msg: `「〜ました。」が${maxRun}文続いています。「〜ています」「〜姿が見られました」なども混ぜると読みやすくなります。`
    });
  const dekita = (text.match(/できました/g) || []).length;
  if (dekita >= 3)
    res.push({
      lv: "info",
      msg: `「できました」が${dekita}回あります。言い回しを変えてみましょう。`
    });
  if (/[ｦ-ﾟ]/.test(text))
    res.push({ lv: "warn", msg: "半角カタカナが含まれています。" });
  if (/[0-9A-Za-z]/.test(text))
    res.push({
      lv: "info",
      msg: "半角英数字が含まれています（学校の書式に合わせて全角にするか確認してください）。"
    });
  if (/[!！?？]/.test(text))
    res.push({ lv: "info", msg: "「！」「？」が含まれています。" });
  if ((text.match(/「/g) || []).length !== (text.match(/」/g) || []).length)
    res.push({ lv: "warn", msg: "かぎかっこ「」の数が合っていません。" });
  const ends = sents.map((x) => x.trim().replace(/[」』）)]+$/, ""));
  const politeRe = /(ます|ました|です|でした|ません|ませんでした)$/;
  const polite = ends.filter((x) => politeRe.test(x)).length;
  const plain = ends.filter(
    (x) => !politeRe.test(x) && /(た|だ|る|ない|である)$/.test(x)
  ).length;
  if (polite && plain)
    res.push({
      lv: "info",
      msg: "です・ます調と である調 が混ざっている可能性があります。"
    });
  // ほかの児童と同じ文
  const mine = new Set(
    sents.map((x) => x.trim()).filter((x) => x.length >= 15)
  );
  if (mine.size) {
    const dupWith = new Set();
    state.shoken.forEach((k) => {
      if (k.studentId === sid || k.term !== term || k.type !== type) return;
      k.text.split("。").forEach((x) => {
        if (mine.has(x.trim())) dupWith.add(k.studentId);
      });
    });
    if (dupWith.size)
      res.push({
        lv: "warn",
        msg: `ほかの児童（${[...dupWith]
          .map((id) => dispName(getStudent(id)))
          .join("、")}）と同じ文があります。`
      });
  }
  if (!res.length)
    res.push({ lv: "ok", msg: "気になる表現は見つかりませんでした。" });
  return res;
}

// ---------- 所見づくり 画面 ----------
function learningSubjects() {
  return subjectList().filter((s) => areaOf(s) === "学習");
}
VIEWS.shoken = (root, param) => {
  const S = ui.sk;
  if (param && getStudent(param)) S.sid = param;
  const type = shokenType(S.type);
  if (type.yearly) S.term = YEAR_TERM;
  else if (
    !S.term ||
    S.term === YEAR_TERM ||
    !state.settings.terms.some((t) => t.name === S.term)
  )
    S.term = currentTerm();
  if (!S.sid || !getStudent(S.sid))
    S.sid = (studentsSorted()[0] || {}).id || "";
  if (type.needSubject && (!S.subject || !state.subjects[S.subject]))
    S.subject = learningSubjects()[0] || subjectList()[0] || "";
  const style = S.style || type.style;
  const target = Number(state.settings.targets[type.key]) || type.target;
  const subjKey = () => (type.needSubject ? S.subject : "");

  root.innerHTML = `
    <div class="page-head"><h2>✍️ 所見づくり</h2>
      <div class="page-actions"><button type="button" class="btn btn-outline" data-act="sk-progress">📊 進捗一覧</button><button type="button" class="btn btn-outline" data-act="print-shoken">🖨 所見一覧を印刷</button></div></div>
    <div class="toolbar sk-toolbar">
      <label class="inline-label">学期 <select id="sk-term" ${
        type.yearly ? "disabled" : ""
      }>${
    type.yearly
      ? `<option>${YEAR_TERM}</option>`
      : optionsHTML(
          state.settings.terms.map((t) => t.name),
          S.term
        )
  }</select></label>
      <label class="inline-label">種類 <select id="sk-type">${optionsHTML(
        SHOKEN_TYPES.map((t) => ({ value: t.key, label: t.label })),
        S.type
      )}</select></label>
      ${
        type.needSubject
          ? `<label class="inline-label">教科 <select id="sk-subject">${optionsHTML(
              subjectList(),
              S.subject
            )}</select></label>`
          : ""
      }
      <label class="inline-label">文体 <select id="sk-style">${optionsHTML(
        [
          { value: "desu", label: "です・ます調" },
          { value: "dearu", label: "である調" }
        ],
        style
      )}</select></label>
      <label class="inline-label">目標 <input type="number" id="sk-target" min="20" max="2000" step="10" value="${target}" style="width:80px"> 字</label>
    </div>
    ${
      !state.students.length
        ? emptyHTML(
            "名簿が登録されていません",
            "「児童カルテ」から名簿を登録してください。"
          )
        : `
    <div class="sk-layout">
      <aside class="panel sk-students" id="sk-students"></aside>
      <section class="panel sk-editor" id="sk-editor"></section>
      <aside class="panel sk-side" id="sk-side"></aside>
    </div>`
    }`;
  $("#sk-term") &&
    $("#sk-term").addEventListener("change", (e) => {
      S.term = e.target.value;
      render();
    });
  $("#sk-type").addEventListener("change", (e) => {
    S.type = e.target.value;
    S.style = "";
    S.closing = "auto";
    render();
  });
  $("#sk-subject") &&
    $("#sk-subject").addEventListener("change", (e) => {
      S.subject = e.target.value;
      render();
    });
  $("#sk-style").addEventListener("change", (e) => {
    S.style = e.target.value;
    render();
  });
  $("#sk-target").addEventListener("change", (e) => {
    state.settings.targets[type.key] = Number(e.target.value) || type.target;
    save();
    render();
  });
  if (!state.students.length) return;

  const listBox = $("#sk-students"),
    editor = $("#sk-editor"),
    side = $("#sk-side");

  function drawStudents() {
    const list = studentsSorted();
    const done = list.filter((s) => {
      const k = findShoken(s.id, S.term, S.type, subjKey());
      return k && k.text && k.status !== "下書き";
    }).length;
    listBox.innerHTML = `<div class="sk-students-head"><b>${done}</b>/${
      list.length
    }人 完成</div><ul class="sk-stu-list">${list
      .map((s) => {
        const k = findShoken(s.id, S.term, S.type, subjKey());
        const st =
          !k || !k.text ? "none" : k.status === "下書き" ? "draft" : "done";
        const icon =
          st === "none"
            ? "○"
            : st === "draft"
            ? "△"
            : k.status === "確認済"
            ? "✔"
            : "●";
        return `<li><button type="button" class="sk-stu ${
          s.id === S.sid ? "on" : ""
        } st-${st}" data-sid="${
          s.id
        }"><span class="sk-icon">${icon}</span><span class="sk-no">${
          s.no
        }</span><span class="sk-name">${esc(
          dispName(s)
        )}</span><span class="sk-chars">${
          k && k.text ? charCount(k.text) : ""
        }</span></button></li>`;
      })
      .join(
        ""
      )}</ul><p class="muted small legend">○未着手 △下書き ●完成 ✔確認済</p>`;
  }
  listBox.addEventListener("click", (e) => {
    const b = e.target.closest(".sk-stu");
    if (!b) return;
    S.sid = b.dataset.sid;
    drawStudents();
    drawEditor();
    drawSide();
  });

  function persist(patch) {
    let k = findShoken(S.sid, S.term, S.type, subjKey());
    if (!k) {
      if (!patch.text) return null;
      k = normShoken({
        studentId: S.sid,
        term: S.term,
        type: S.type,
        subject: subjKey()
      });
      state.shoken.push(k);
    }
    Object.assign(k, patch, { updatedAt: nowISO() });
    save();
    const ss = $("#sk-save-state");
    if (ss)
      ss.textContent = "保存しました " + fmtDateTime(k.updatedAt).slice(-5);
    drawStudents();
    return k;
  }

  function drawEditor() {
    const s = getStudent(S.sid);
    const k = findShoken(S.sid, S.term, S.type, subjKey());
    const otherK = state.shoken
      .filter((x) => x.studentId === S.sid && x.text && x !== k)
      .sort((a, b) => (a.term + a.type).localeCompare(b.term + b.type, "ja"));
    editor.innerHTML = `
      <div class="sk-ed-head">
        <div><h3><span class="no-badge">${s.no}</span> ${esc(
      dispName(s)
    )}</h3><div class="muted small">${esc(S.term)}・${esc(type.label)}${
      subjKey() ? "・" + esc(subjKey()) : ""
    }・${style === "desu" ? "です・ます調" : "である調"}</div></div>
        <div class="sk-nav"><button type="button" class="btn btn-sm btn-outline" data-act="sk-move" data-dir="-1">◀ 前</button><button type="button" class="btn btn-sm btn-outline" data-act="sk-move" data-dir="1">次 ▶</button></div>
      </div>
      <textarea id="sk-text" rows="11" placeholder="右の「エピソード」から記録を選んで「✨ 文章を作る」を押すか、ここに直接書いてください。自動で保存されます。">${esc(
        k ? k.text : ""
      )}</textarea>
      <div class="sk-meter"><div class="meter"><div class="meter-fill" id="sk-fill"></div><div class="meter-target" title="目標文字数"></div></div><span id="sk-count"></span></div>
      <div class="sk-ed-actions">
        <label class="inline-label">状態 <select id="sk-status">${optionsHTML(
          SHOKEN_STATUSES,
          k ? k.status : "下書き"
        )}</select></label>
        <button type="button" class="btn btn-sm btn-outline" data-act="sk-check">🔍 表現チェック</button>
        <button type="button" class="btn btn-sm btn-outline" data-act="sk-copy">📋 コピー</button>
        <button type="button" class="btn btn-sm btn-outline" data-act="sk-ai" title="個人名を伏せた依頼文をコピーします">🤖 AI用の依頼文をコピー</button>
        <button type="button" class="btn btn-sm btn-text" data-act="sk-clear">クリア</button>
        <span class="save-state" id="sk-save-state">${
          k ? "保存済み " + esc(fmtDateTime(k.updatedAt)) : ""
        }</span>
      </div>
      <div id="sk-check-result"></div>
      ${
        otherK.length
          ? `<details class="sk-others"><summary>📚 この児童のほかの所見（${
              otherK.length
            }件）</summary>${otherK
              .map(
                (x) =>
                  `<div class="sk-other"><div class="muted small">${esc(
                    x.term
                  )}・${esc(shokenType(x.type).label)}${
                    x.subject ? "・" + esc(x.subject) : ""
                  }（${charCount(x.text)}字）</div><p>${nl2br(
                    x.text
                  )}</p></div>`
              )
              .join("")}</details>`
          : ""
      }`;
    const ta = $("#sk-text");
    const upd = () => {
      const n = charCount(ta.value);
      const ratio = n / (target * 1.2);
      const fill = $("#sk-fill");
      fill.style.width = Math.min(100, ratio * 100) + "%";
      fill.className =
        "meter-fill " +
        (n > target * 1.1
          ? "over"
          : n > target
          ? "near"
          : n >= target * 0.7
          ? "good"
          : "");
      $("#sk-count").innerHTML = `<b>${n}</b> / ${target}字 ${
        n > target
          ? `<span class="over-text">（${n - target}字オーバー）</span>`
          : `<span class="muted">（あと${target - n}字）</span>`
      }`;
    };
    $(".meter-target", editor).style.left = 100 / 1.2 + "%";
    const autosave = debounce(() => persist({ text: ta.value }), 600);
    ta.addEventListener("input", () => {
      upd();
      const ss = $("#sk-save-state");
      if (ss) ss.textContent = "入力中…";
      autosave();
    });
    $("#sk-status").addEventListener("change", (e) => {
      if (!ta.value.trim()) {
        toast("先に文章を入力してください", { type: "error" });
        e.target.value = "下書き";
        return;
      }
      persist({ text: ta.value, status: e.target.value });
      toast(`「${e.target.value}」にしました`);
    });
    upd();
  }

  function drawSide() {
    side.innerHTML = `<div class="tabs sm"><button type="button" class="tab ${
      S.tab === "eps" ? "on" : ""
    }" data-sktab="eps">📝 エピソード</button><button type="button" class="tab ${
      S.tab === "phr" ? "on" : ""
    }" data-sktab="phr">📚 文例</button></div><div id="sk-side-body"></div>`;
    $$("[data-sktab]", side).forEach((b) =>
      b.addEventListener("click", () => {
        S.tab = b.dataset.sktab;
        drawSide();
      })
    );
    const body = $("#sk-side-body");
    if (S.tab === "eps") drawEpisodes(body);
    else drawPhrases(body);
  }

  function relevantEpisodes() {
    const range = S.allPeriod ? null : termRange(S.term);
    return episodesOf(S.sid, range)
      .filter((e) => {
        if (S.allArea) return true;
        if (type.needSubject) return e.subject === S.subject;
        return episodeFitsType(e, S.type);
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  function drawEpisodes(body) {
    const eps = relevantEpisodes();
    const used = usedEpisodeIds();
    const closingDefault =
      S.closing === "auto"
        ? S.type === "総合所見"
          ? phraseGroup("締め")[0]
          : ""
        : S.closing;
    body.innerHTML = `
      <div class="sk-ep-tools">
        <label class="check"><input type="checkbox" id="sk-allp" ${
          S.allPeriod ? "checked" : ""
        }> 全期間</label>
        <label class="check"><input type="checkbox" id="sk-alla" ${
          S.allArea ? "checked" : ""
        }> ほかの教科・領域も表示</label>
        <button type="button" class="link-btn" id="sk-checkall">すべて選択</button>
      </div>
      <div class="sk-ep-list">${
        eps.length
          ? eps
              .map(
                (e) => `
        <label class="sk-ep ${
          used.has(e.id) ? "used" : ""
        }"><input type="checkbox" class="sk-ep-check" value="${e.id}" ${
                  e.star ? "checked" : ""
                }>
          <div><div class="sk-ep-meta">${esc(fmtMD(e.date))} ${
                  e.subject
                    ? esc(e.subject + (e.unit ? "：" + e.unit : ""))
                    : "未整理"
                } ${e.star ? "<b class='star'>★</b>" : ""} ${
                  used.has(e.id) ? "<span class='used-tag'>使用済</span>" : ""
                }</div>
          <div class="sk-ep-tags">${e.tags
            .map((t) => `<span class="mini-tag">${esc(t)}</span>`)
            .join("")}</div>
          <div class="sk-ep-text">${nl2br(e.content)}</div></div></label>`
              )
              .join("")
          : `<p class="muted small">この条件のエピソードがありません。「全期間」や「ほかの教科・領域も表示」にチェックを入れてみてください。</p>`
      }</div>
      <div class="sk-gen">
        <label>書き出し <select id="sk-intro">${optionsHTML(
          phraseGroup("書き出し"),
          S.intro,
          "（なし）"
        )}</select></label>
        <label>締め <select id="sk-closing">${optionsHTML(
          phraseGroup("締め"),
          closingDefault,
          "（なし）"
        )}</select></label>
        <div class="sk-gen-btns">
          <button type="button" class="btn btn-primary" data-act="sk-generate">✨ 選んだ記録から文章を作る</button>
          <button type="button" class="btn btn-sm btn-outline" data-act="sk-insert">↳ 選んだ記録をカーソル位置に追加</button>
        </div>
        <p class="muted small">自動作成は下書きです。文末や言い回しは必ず確認・修正してください。本人の名前は省き、ほかの児童の名前は「友達」に置き換えます。</p>
      </div>`;
    $("#sk-allp", body).addEventListener("change", (e) => {
      S.allPeriod = e.target.checked;
      drawSide();
    });
    $("#sk-alla", body).addEventListener("change", (e) => {
      S.allArea = e.target.checked;
      drawSide();
    });
    $("#sk-checkall", body).addEventListener("click", () => {
      const cs = $$(".sk-ep-check", body);
      const all = cs.every((c) => c.checked);
      cs.forEach((c) => {
        c.checked = !all;
      });
    });
    $("#sk-intro", body).addEventListener("change", (e) => {
      S.intro = e.target.value;
    });
    $("#sk-closing", body).addEventListener("change", (e) => {
      S.closing = e.target.value;
    });
  }
  function drawPhrases(body) {
    const mine = state.myPhrases;
    const groups = PHRASE_BANK.map((g) => ({
      group: g.group,
      items: g.items.map((t) => ({ text: t }))
    }));
    if (mine.length)
      groups.push({
        group: "マイ文例",
        items: mine.map((p) => ({ text: p.text, id: p.id }))
      });
    body.innerHTML = `
      <p class="muted small">クリックすると、カーソルの位置に入ります（文体は自動で合わせます）。</p>
      <div class="phrase-groups">${groups
        .map(
          (g) =>
            `<details class="phrase-group" ${
              g.group === "マイ文例" ? "open" : ""
            }><summary>${esc(g.group)} <span class="muted">(${
              g.items.length
            })</span></summary>${g.items
              .map(
                (it) =>
                  `<div class="phrase-item"><button type="button" class="phrase-insert" data-text="${esc(
                    it.text
                  )}">${esc(convertStyle(it.text, style))}</button>${
                    it.id
                      ? `<button type="button" class="link-btn danger small" data-act="myphrase-del" data-id="${it.id}" title="削除">✕</button>`
                      : ""
                  }</div>`
              )
              .join("")}</details>`
        )
        .join("")}</div>
      <div class="add-phrase"><textarea id="new-phrase" rows="2" placeholder="よく使う言い回しを「マイ文例」に登録"></textarea><button type="button" class="btn btn-sm btn-secondary" id="add-phrase-btn">登録</button></div>`;
    $$(".phrase-insert", body).forEach((b) =>
      b.addEventListener("click", () =>
        insertAtCursor($("#sk-text"), convertStyle(b.dataset.text, style))
      )
    );
    $("#add-phrase-btn", body).addEventListener("click", () => {
      const t = $("#new-phrase", body).value.trim();
      if (!t) return;
      state.myPhrases.push({ id: uid(), group: "マイ文例", text: t });
      save();
      toast("マイ文例に登録しました");
      drawPhrases(body);
    });
  }

  // 画面内で使うアクション
  ACTIONS["sk-move"] = (el) => {
    const list = studentsSorted();
    const i = list.findIndex((s) => s.id === S.sid);
    const n = list[i + Number(el.dataset.dir)];
    if (!n) {
      toast(Number(el.dataset.dir) > 0 ? "最後の児童です" : "最初の児童です");
      return;
    }
    S.sid = n.id;
    drawStudents();
    drawEditor();
    drawSide();
    const li = $(`.sk-stu[data-sid="${n.id}"]`);
    if (li) li.scrollIntoView({ block: "nearest" });
  };
  const selectedEps = () => {
    const ids = $$(".sk-ep-check")
      .filter((c) => c.checked)
      .map((c) => c.value);
    return state.episodes.filter((e) => ids.includes(e.id));
  };
  ACTIONS["sk-generate"] = () => {
    const eps = selectedEps();
    if (!eps.length) {
      toast("使うエピソードにチェックを入れてください", { type: "error" });
      return;
    }
    const intro = $("#sk-intro") ? $("#sk-intro").value : "",
      closing = $("#sk-closing") ? $("#sk-closing").value : "";
    const text = generateShoken(eps, {
      style,
      intro,
      closing,
      typeKey: S.type
    });
    const ta = $("#sk-text");
    const apply = (mode) => {
      ta.value = mode === "append" ? ta.value.replace(/\s+$/, "") + text : text;
      ta.dispatchEvent(new Event("input"));
      const k = persist({ text: ta.value });
      if (k)
        eps.forEach((e) => {
          if (!k.episodeIds.includes(e.id)) k.episodeIds.push(e.id);
        });
      save();
      drawSide();
      const n = charCount(ta.value);
      toast(
        `下書きを作りました（${n}字）${
          n > target ? "。目標より長いので記録を減らすか調整してください" : ""
        }`
      );
    };
    if (ta.value.trim()) {
      const m = openModal({
        title: "文章を作る",
        body: `<p>すでに文章があります。どうしますか？</p>`,
        footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-outline" id="gen-append">後ろに追加</button><button type="button" class="btn btn-primary" id="gen-replace">置き換える</button>`
      });
      $("#gen-append", m).addEventListener("click", () => {
        closeModal(true);
        apply("append");
      });
      $("#gen-replace", m).addEventListener("click", () => {
        closeModal(true);
        apply("replace");
      });
    } else apply("replace");
  };
  ACTIONS["sk-insert"] = () => {
    const eps = selectedEps();
    if (!eps.length) {
      toast("エピソードにチェックを入れてください", { type: "error" });
      return;
    }
    insertAtCursor(
      $("#sk-text"),
      generateShoken(eps, { style, intro: "", closing: "", typeKey: S.type })
    );
    const k = findShoken(S.sid, S.term, S.type, subjKey());
    if (k) {
      eps.forEach((e) => {
        if (!k.episodeIds.includes(e.id)) k.episodeIds.push(e.id);
      });
      save();
    }
  };
  ACTIONS["sk-check"] = () => {
    const ta = $("#sk-text");
    const res = checkShoken(ta.value, {
      sid: S.sid,
      term: S.term,
      type: S.type,
      subject: subjKey(),
      target
    });
    const icon = { danger: "⛔", warn: "⚠️", info: "💡", ok: "✅" };
    $("#sk-check-result").innerHTML = `<div class="check-result">${res
      .map(
        (r, i) =>
          `<div class="check-item lv-${r.lv}"><span>${icon[r.lv]} ${esc(
            r.msg
          )}</span>${
            r.alts
              ? `<span class="alts">候補：${r.alts
                  .map((a) =>
                    a.startsWith("（")
                      ? `<span class="muted">${esc(a)}</span>`
                      : `<button type="button" class="alt-btn" data-i="${i}" data-alt="${esc(
                          a
                        )}">${esc(a)}</button>`
                  )
                  .join(" ")}</span>`
              : ""
          }</div>`
      )
      .join("")}</div>`;
    $$(".alt-btn", $("#sk-check-result")).forEach((b) =>
      b.addEventListener("click", () => {
        const r = res[Number(b.dataset.i)];
        ta.value = ta.value.replace(r.word, b.dataset.alt);
        ta.dispatchEvent(new Event("input"));
        ACTIONS["sk-check"]();
      })
    );
  };
  ACTIONS["sk-copy"] = async () => {
    const ok = await copyText($("#sk-text").value);
    toast(
      ok ? "コピーしました" : "コピーできませんでした",
      ok ? {} : { type: "error" }
    );
  };
  ACTIONS["sk-clear"] = () => {
    const ta = $("#sk-text");
    if (!ta.value) return;
    confirmModal({
      title: "クリア",
      message: "この所見の文章を消しますか？",
      okLabel: "消す",
      danger: true,
      onOk: () => {
        ta.value = "";
        ta.dispatchEvent(new Event("input"));
        persist({ text: "", status: "下書き" });
      }
    });
  };
  ACTIONS["sk-ai"] = async () => {
    const eps = selectedEps().length ? selectedEps() : relevantEpisodes();
    if (!eps.length) {
      toast("エピソードがありません", { type: "error" });
      return;
    }
    const st = state.settings;
    const lines = eps.map(
      (e) =>
        `- ${fmtSlash(e.date)}${
          e.subject ? ` ${e.subject}${e.unit ? "「" + e.unit + "」" : ""}` : ""
        }${e.tags.length ? ` [${e.tags.join("・")}]` : ""}：${cleanContent(
          e.content,
          e.studentId
        ).replace(/\n/g, " ")}`
    );
    const prompt = `あなたは小学校の担任教師です。次の観察記録をもとに、${
      type.label
    }の文章を${target}字程度で作成してください。
条件：
・${style === "desu" ? "です・ます調" : "である調"}で書く
・肯定的な表現を中心に、具体的な場面が伝わるように書く
・児童の名前は書かない（記録中の「友達」はほかの児童です）
・課題に触れる場合は、今後の支援や期待につなげる
${st.grade ? `【学年】${st.grade}年\n` : ""}【時期】${S.term}${
      type.needSubject ? `\n【教科】${S.subject}` : ""
    }
【観察記録】
${lines.join("\n")}`;
    const ok = await copyText(prompt);
    toast(
      ok
        ? "AIへの依頼文をコピーしました（名前は伏せてあります）"
        : "コピーできませんでした",
      ok ? { duration: 4500 } : { type: "error" }
    );
  };

  drawStudents();
  drawEditor();
  drawSide();
  ui.refresh = () => {
    drawStudents();
    drawSide();
  };
};

ACTIONS["myphrase-del"] = (el) => {
  state.myPhrases = state.myPhrases.filter((p) => p.id !== el.dataset.id);
  save();
  refresh();
};
ACTIONS["shoken-for"] = (el) => {
  ui.sk.sid = el.dataset.id;
  go("shoken", el.dataset.id);
};
ACTIONS["shoken-open"] = (el) => {
  const k = state.shoken.find((x) => x.id === el.dataset.id);
  if (!k) return;
  Object.assign(ui.sk, {
    sid: k.studentId,
    term: k.term,
    type: k.type,
    subject: k.subject,
    style: ""
  });
  go("shoken", k.studentId);
};
ACTIONS["shoken-copy"] = async (el) => {
  const k = state.shoken.find((x) => x.id === el.dataset.id);
  if (!k) return;
  const ok = await copyText(k.text);
  toast(ok ? "コピーしました" : "コピーできませんでした");
};

// 進捗一覧（児童 × 所見の種類）
ACTIONS["sk-progress"] = () => {
  const term =
    ui.sk.term && ui.sk.term !== YEAR_TERM ? ui.sk.term : currentTerm();
  const types = SHOKEN_TYPES.filter((t) => !t.needSubject);
  const subjects = learningSubjects();
  const cell = (k) =>
    !k || !k.text
      ? `<td class="pg-none">○</td>`
      : `<td class="pg-${
          k.status === "下書き" ? "draft" : "done"
        }" title="${charCount(k.text)}字">${
          k.status === "下書き" ? "△" : k.status === "確認済" ? "✔" : "●"
        }<small>${charCount(k.text)}</small></td>`;
  const rows = studentsSorted()
    .map((s) => {
      const subjDone = subjects.filter((sub) => {
        const k = findShoken(s.id, term, "教科", sub);
        return k && k.text;
      }).length;
      return `<tr><td class="nowrap"><button type="button" class="link-btn" data-act="sk-jump" data-id="${
        s.id
      }">${esc(sLabel(s.id))}</button></td>${types
        .map((t) => cell(findShoken(s.id, t.yearly ? YEAR_TERM : term, t.key)))
        .join("")}<td>${subjDone}/${subjects.length}</td></tr>`;
    })
    .join("");
  openModal({
    title: `📊 所見の進捗一覧（${term}）`,
    wide: true,
    body: `<div class="table-container"><table class="data-table progress-table"><thead><tr><th>児童</th>${types
      .map((t) => `<th>${esc(t.label.replace("（通知表）", ""))}</th>`)
      .join(
        ""
      )}<th>教科別</th></tr></thead><tbody>${rows}</tbody></table></div><p class="muted small">○未着手 △下書き ●完成 ✔確認済（数字は文字数）。指導要録は年間の欄です。</p>`,
    footer: `<button type="button" class="btn btn-primary" data-act="close-modal">閉じる</button>`
  });
};
ACTIONS["sk-jump"] = (el) => {
  closeModal(true);
  ui.sk.sid = el.dataset.id;
  go("shoken", el.dataset.id);
};

// ============================================================
//  注意行動の記録／保護者対応の記録
// ============================================================

// ---------- 注意行動 ----------
function behaviorCardHTML(b) {
  return `<article class="rec-card beh-card lv-border-${b.level}">
    <div class="rec-card-head">
      <b>${esc(fmtMD(b.date))}${b.time ? " " + esc(b.time) : ""}</b>
      <button type="button" class="link-btn strong" data-act="open-student" data-id="${
        b.studentId
      }">${esc(sLabel(b.studentId))}</button>
      ${badge(b.type, "b-type")} ${levelBadge(b.level)} ${statusBadge(b.status)}
      ${b.place ? `<span class="muted small">📍${esc(b.place)}</span>` : ""}
      ${b.parentContacted ? badge("保護者連絡済", "b-used") : ""}${
    b.reported ? badge("管理職・学年に報告済", "b-used") : ""
  }
      <span class="rec-card-ops">
        <select class="mini-select" data-beh-status="${
          b.id
        }" aria-label="状況を変更">${optionsHTML(
    BEHAVIOR_STATUSES,
    b.status
  )}</select>
        <button type="button" class="link-btn" data-act="parent-from-behavior" data-id="${
          b.id
        }" title="この件で保護者記録を作る">📞</button>
        <button type="button" class="link-btn" data-act="behavior-edit" data-id="${
          b.id
        }">編集</button>
        <button type="button" class="link-btn danger" data-act="behavior-del" data-id="${
          b.id
        }">削除</button>
      </span>
    </div>
    <dl class="beh-dl">
      ${b.situation ? `<dt>状況・経緯</dt><dd>${nl2br(b.situation)}</dd>` : ""}
      ${b.response ? `<dt>対応・指導</dt><dd>${nl2br(b.response)}</dd>` : ""}
      ${
        b.related
          ? `<dt>関係児童</dt><dd>${
              state.settings.maskNames ? "（非表示）" : esc(b.related)
            }</dd>`
          : ""
      }
      ${b.followup ? `<dt>経過・その後</dt><dd>${nl2br(b.followup)}</dd>` : ""}
    </dl>
  </article>`;
}
document.addEventListener("change", (e) => {
  const sel = e.target.closest && e.target.closest("[data-beh-status]");
  if (!sel) return;
  const b = state.behaviors.find((x) => x.id === sel.dataset.behStatus);
  if (!b) return;
  b.status = sel.value;
  b.updatedAt = nowISO();
  save();
  toast(`状況を「${b.status}」にしました`);
  refresh();
});

VIEWS.behaviors = (root) => {
  const f = ui.beh;
  root.innerHTML = `
    <div class="page-head"><h2>⚠️ 注意すべき行動の記録</h2>
      <div class="page-actions"><button type="button" class="btn btn-outline" data-act="print-behaviors">🖨 印刷</button><button type="button" class="btn btn-primary" data-act="behavior-new">＋ 注意行動を記録</button></div></div>
    <p class="muted small page-desc">生徒指導上の出来事や、気をつけて見ていきたい行動を事実ベースで記録します。対応の経過も残せます。</p>
    <div class="filters">
      <select id="bf-student">${studentOptionsHTML(f.student)}</select>
      <select id="bf-type">${optionsHTML(
        BEHAVIOR_TYPES,
        f.type,
        "すべての種別"
      )}</select>
      <select id="bf-status">${optionsHTML(
        BEHAVIOR_STATUSES,
        f.status,
        "すべての状況"
      )}</select>
      ${periodSelectHTML("bf-period", f.period)}
      <input type="search" id="bf-q" placeholder="キーワード" value="${esc(
        f.q
      )}">
    </div>
    <div id="beh-summary"></div>
    <div id="beh-list"></div>`;
  const draw = () => {
    const r = periodRange(f.period),
      q = f.q.toLowerCase();
    const list = state.behaviors
      .filter(
        (b) =>
          (!f.student || b.studentId === f.student) &&
          (!f.type || b.type === f.type) &&
          (!f.status || b.status === f.status) &&
          inRange(b.date, r) &&
          (!q ||
            (
              b.situation +
              b.response +
              b.followup +
              b.related +
              b.place +
              realName(b.studentId)
            )
              .toLowerCase()
              .includes(q))
      )
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) ||
          (b.time || "").localeCompare(a.time || "")
      );
    const byStatus = BEHAVIOR_STATUSES.map((s) => [
      s,
      list.filter((b) => b.status === s).length
    ]);
    const byType = {};
    list.forEach((b) => {
      byType[b.type] = (byType[b.type] || 0) + 1;
    });
    const top = Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    $("#beh-summary").innerHTML = list.length
      ? `<div class="summary-row"><span><b>${list.length}</b>件</span>${byStatus
          .map(([s, n]) => `<span>${statusBadge(s)} ${n}</span>`)
          .join("")}<span class="muted">｜多い種別：${top
          .map(([t, n]) => `${esc(t)} ${n}`)
          .join("、")}</span></div>`
      : "";
    $("#beh-list").innerHTML = list.length
      ? `<div class="card-list">${list.map(behaviorCardHTML).join("")}</div>`
      : emptyHTML(
          state.behaviors.length
            ? "条件に合う記録がありません"
            : "まだ記録がありません",
          "右上の「＋ 注意行動を記録」か、「✏️ すぐメモ」の「⚠️ 注意行動」から記録できます。"
        );
  };
  const bind = (id, key, ev = "change") =>
    $(id).addEventListener(ev, (e) => {
      f[key] = e.target.value;
      draw();
    });
  bind("#bf-student", "student");
  bind("#bf-type", "type");
  bind("#bf-status", "status");
  bind("#bf-period", "period");
  bind("#bf-q", "q", "input");
  draw();
  ui.refresh = draw;
};

function openBehaviorForm(b = null, presetSid = "") {
  const isEdit = !!b;
  const m = openModal({
    title: isEdit ? "⚠️ 注意行動を編集" : "⚠️ 注意行動を記録",
    wide: true,
    body: `
      <div class="form-group"><label>児童 <span class="req">*</span> ${
        isEdit
          ? ""
          : `<small class="muted">（複数選ぶと一人ずつ記録され、関係児童が自動で入ります）</small>`
      }</label><div class="bf-students"></div></div>
      <div class="form-row">
        <div class="form-group"><label>日付</label>${dateFieldHTML(
          "bf-date",
          b ? b.date : todayStr()
        )}</div>
        <div class="form-group" style="max-width:140px"><label>時刻</label><input type="time" class="bf-time" value="${esc(
          b ? b.time : ""
        )}"></div>
        <div class="form-group"><label>場所</label><input type="text" class="bf-place" list="place-list" value="${esc(
          b ? b.place : ""
        )}" placeholder="教室・運動場など"><datalist id="place-list">${PLACES.map(
      (p) => `<option value="${esc(p)}">`
    ).join("")}</datalist></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>種別</label><select class="bf-type">${optionsHTML(
          BEHAVIOR_TYPES,
          b ? b.type : "友達とのトラブル"
        )}</select></div>
        <div class="form-group"><label>程度</label><select class="bf-level">${optionsHTML(
          BEHAVIOR_LEVELS.map((l) => ({ value: l.key, label: l.label })),
          b ? b.level : 1
        )}</select></div>
        <div class="form-group"><label>状況</label><select class="bf-status">${optionsHTML(
          BEHAVIOR_STATUSES,
          b ? b.status : "対応中"
        )}</select></div>
      </div>
      <div class="form-group"><label>状況・経緯 <span class="req">*</span> <small class="muted">（いつ・どこで・誰が・何をしたか、事実を）</small></label><div class="textarea-wrap"><textarea class="bf-situation" rows="4">${esc(
        b ? b.situation : ""
      )}</textarea><button type="button" class="mic-btn" aria-label="音声入力">🎤</button></div></div>
      <div class="form-group"><label>対応・指導内容</label><textarea class="bf-response" rows="3">${esc(
        b ? b.response : ""
      )}</textarea></div>
      <div class="form-row">
        <div class="form-group"><label>関係児童</label><input type="text" class="bf-related" value="${esc(
          b ? b.related : ""
        )}" placeholder="例：〇〇さん、△△さん"></div>
      </div>
      <div class="form-group"><label>経過・その後</label><textarea class="bf-followup" rows="2">${esc(
        b ? b.followup : ""
      )}</textarea></div>
      <div class="check-row"><label class="check"><input type="checkbox" class="bf-parent" ${
        b && b.parentContacted ? "checked" : ""
      }> 保護者に連絡済</label><label class="check"><input type="checkbox" class="bf-report" ${
      b && b.reported ? "checked" : ""
    }> 管理職・学年に報告済</label></div>
      ${
        isEdit
          ? `<p class="muted small">入力：${esc(
              fmtDateTime(b.createdAt)
            )}　最終更新：${esc(fmtDateTime(b.updatedAt))}</p>`
          : ""
      }`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary bf-save">💾 保存</button>`
  });
  const q = (s) => $(s, m);
  const picker = studentPicker(q(".bf-students"), {
    multi: !isEdit,
    selected: b ? [b.studentId] : presetSid ? [presetSid] : []
  });
  attachMic(q(".mic-btn"), q(".bf-situation"));
  q(".bf-save").addEventListener("click", () => {
    const ids = picker.get(),
      situation = q(".bf-situation").value.trim();
    if (!ids.length || !situation) {
      toast("「児童」と「状況・経緯」は必須です", { type: "error" });
      return;
    }
    const data = {
      date: q(".bf-date").value || todayStr(),
      time: q(".bf-time").value,
      place: q(".bf-place").value.trim(),
      type: q(".bf-type").value,
      level: Number(q(".bf-level").value),
      status: q(".bf-status").value,
      situation,
      response: q(".bf-response").value.trim(),
      followup: q(".bf-followup").value.trim(),
      parentContacted: q(".bf-parent").checked,
      reported: q(".bf-report").checked
    };
    const related = q(".bf-related").value.trim();
    if (isEdit)
      Object.assign(b, data, {
        studentId: ids[0],
        related,
        updatedAt: nowISO()
      });
    else
      ids.forEach((sid) => {
        const auto = ids
          .filter((x) => x !== sid)
          .map(realName)
          .join("、");
        state.behaviors.push(
          normBehavior(
            Object.assign(
              {
                studentId: sid,
                related: [auto, related].filter(Boolean).join("、"),
                createdAt: nowISO()
              },
              data
            )
          )
        );
      });
    save();
    closeModal(true);
    toast(isEdit ? "更新しました" : "記録しました");
    refresh();
  });
  m.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) q(".bf-save").click();
  });
}
ACTIONS["behavior-new"] = (el) => openBehaviorForm(null, el.dataset.id || "");
ACTIONS["behavior-edit"] = (el) =>
  openBehaviorForm(state.behaviors.find((b) => b.id === el.dataset.id));
ACTIONS["behavior-del"] = (el) =>
  removeWithUndo("behaviors", el.dataset.id, "注意行動の記録");
ACTIONS["parent-from-behavior"] = (el) => {
  const b = state.behaviors.find((x) => x.id === el.dataset.id);
  if (!b) return;
  openParentForm(null, b.studentId, {
    date: todayStr(),
    topic: `${b.type}（${fmtMD(b.date)}）について`,
    content: "",
    response: b.response,
    direction: "学校から"
  });
};

// ---------- 保護者記録 ----------
function parentCardHTML(p) {
  const today = todayStr();
  const overdue =
    p.followUp && !p.followUpDone && p.followUpDate && p.followUpDate < today;
  return `<article class="rec-card par-card ${overdue ? "overdue" : ""}">
    <div class="rec-card-head">
      <b>${esc(fmtMD(p.date))}${p.time ? " " + esc(p.time) : ""}</b>
      <button type="button" class="link-btn strong" data-act="open-student" data-id="${
        p.studentId
      }">${esc(sLabel(p.studentId))}</button>
      ${badge(p.method, "b-type")} ${badge(
    p.direction === "学校から" ? "🏫→🏠 学校から" : "🏠→🏫 保護者から",
    "b-tag"
  )} <span class="muted small">相手：${esc(p.partner)}</span>
      ${
        p.followUp
          ? p.followUpDone
            ? badge("✓ フォロー済", "b-used")
            : badge(
                `要フォロー ${p.followUpDate ? fmtMD(p.followUpDate) : ""}`,
                overdue ? "b-guid" : "b-quick"
              )
          : ""
      }
      ${
        p.shared
          ? `<span class="muted small">共有：${esc(p.shared)}</span>`
          : ""
      }
      <span class="rec-card-ops">
        ${
          p.followUp && !p.followUpDone
            ? `<button type="button" class="link-btn" data-act="parent-done" data-id="${p.id}">✓ フォロー完了</button>`
            : ""
        }
        <button type="button" class="link-btn" data-act="parent-edit" data-id="${
          p.id
        }">編集</button>
        <button type="button" class="link-btn danger" data-act="parent-del" data-id="${
          p.id
        }">削除</button>
      </span>
    </div>
    ${p.topic ? `<div class="par-topic">${esc(p.topic)}</div>` : ""}
    <dl class="beh-dl">
      ${p.content ? `<dt>内容</dt><dd>${nl2br(p.content)}</dd>` : ""}
      ${
        p.response
          ? `<dt>学校の対応・回答</dt><dd>${nl2br(p.response)}</dd>`
          : ""
      }
    </dl>
  </article>`;
}

VIEWS.parents = (root) => {
  const f = ui.par;
  root.innerHTML = `
    <div class="page-head"><h2>📞 保護者対応の記録</h2>
      <div class="page-actions"><button type="button" class="btn btn-outline" data-act="print-parents">🖨 印刷</button><button type="button" class="btn btn-primary" data-act="parent-new">＋ 保護者記録を追加</button></div></div>
    <div id="par-follow"></div>
    <div class="filters">
      <select id="pf-student">${studentOptionsHTML(f.student)}</select>
      <select id="pf-method">${optionsHTML(
        PARENT_METHODS,
        f.method,
        "すべての方法"
      )}</select>
      ${periodSelectHTML("pf-period", f.period)}
      <input type="search" id="pf-q" placeholder="キーワード" value="${esc(
        f.q
      )}">
      <label class="check"><input type="checkbox" id="pf-follow" ${
        f.followOnly ? "checked" : ""
      }> 要フォロー（未完了）のみ</label>
    </div>
    <div id="par-list"></div>`;
  const draw = () => {
    const today = todayStr();
    const pend = state.parents
      .filter((p) => p.followUp && !p.followUpDone)
      .sort((a, b) =>
        (a.followUpDate || "9999").localeCompare(b.followUpDate || "9999")
      );
    $("#par-follow").innerHTML = pend.length
      ? `<div class="notice ${
          pend.some((p) => p.followUpDate && p.followUpDate < today)
            ? "notice-danger"
            : "notice-warn"
        }"><b>🔔 フォロー予定 ${pend.length}件</b>：${pend
          .slice(0, 8)
          .map(
            (p) =>
              `<button type="button" class="link-btn" data-act="parent-edit" data-id="${
                p.id
              }">${
                p.followUpDate ? esc(fmtMD(p.followUpDate)) : "日付未定"
              } ${esc(sLabel(p.studentId, false))}${
                p.followUpDate && p.followUpDate < today ? "（期限切れ）" : ""
              }</button>`
          )
          .join("、")}</div>`
      : "";
    const r = periodRange(f.period),
      q = f.q.toLowerCase();
    const list = state.parents
      .filter(
        (p) =>
          (!f.student || p.studentId === f.student) &&
          (!f.method || p.method === f.method) &&
          inRange(p.date, r) &&
          (!f.followOnly || (p.followUp && !p.followUpDone)) &&
          (!q ||
            (p.topic + p.content + p.response + realName(p.studentId))
              .toLowerCase()
              .includes(q))
      )
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) ||
          (b.time || "").localeCompare(a.time || "")
      );
    $("#par-list").innerHTML = list.length
      ? `<div class="list-meta"><span><b>${
          list.length
        }</b>件</span></div><div class="card-list">${list
          .map(parentCardHTML)
          .join("")}</div>`
      : emptyHTML(
          state.parents.length
            ? "条件に合う記録がありません"
            : "まだ記録がありません",
          "電話・連絡帳・面談などの内容を残しておくと、年度末の引き継ぎにも使えます。"
        );
  };
  const bind = (id, key, ev = "change", fn = (el) => el.value) =>
    $(id).addEventListener(ev, (e) => {
      f[key] = fn(e.target);
      draw();
    });
  bind("#pf-student", "student");
  bind("#pf-method", "method");
  bind("#pf-period", "period");
  bind("#pf-q", "q", "input");
  bind("#pf-follow", "followOnly", "change", (el) => el.checked);
  draw();
  ui.refresh = draw;
};

function openParentForm(p = null, presetSid = "", preset = {}) {
  const isEdit = !!p;
  const v = Object.assign({}, preset, p || {});
  const sharedList = (v.shared || "").split("、");
  const m = openModal({
    title: isEdit ? "📞 保護者記録を編集" : "📞 保護者記録を追加",
    wide: true,
    body: `
      <div class="form-group"><label>児童 <span class="req">*</span></label><div class="pf-students"></div></div>
      <div class="form-row">
        <div class="form-group"><label>日付</label>${dateFieldHTML(
          "pf-date",
          v.date || todayStr()
        )}</div>
        <div class="form-group" style="max-width:140px"><label>時刻</label><input type="time" class="pf-time" value="${esc(
          v.time || ""
        )}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>方法</label><select class="pf-method">${optionsHTML(
          PARENT_METHODS,
          v.method || "電話"
        )}</select></div>
        <div class="form-group"><label>相手</label><select class="pf-partner">${optionsHTML(
          PARENT_PARTNERS,
          v.partner || "母"
        )}</select></div>
        <div class="form-group"><label>発信</label><select class="pf-dir">${optionsHTML(
          PARENT_DIRECTIONS,
          v.direction || "学校から"
        )}</select></div>
      </div>
      <div class="form-group"><label>件名</label><input type="text" class="pf-topic" value="${esc(
        v.topic || ""
      )}" placeholder="例：友達とのトラブルについて"></div>
      <div class="form-group"><label>内容 <span class="req">*</span> <small class="muted">（保護者の話・学校からの説明）</small></label><div class="textarea-wrap"><textarea class="pf-content" rows="4">${esc(
        v.content || ""
      )}</textarea><button type="button" class="mic-btn" aria-label="音声入力">🎤</button></div></div>
      <div class="form-group"><label>学校の対応・回答</label><textarea class="pf-response" rows="3">${esc(
        v.response || ""
      )}</textarea></div>
      <div class="form-row align-end">
        <div class="form-group"><label class="check"><input type="checkbox" class="pf-follow" ${
          v.followUp ? "checked" : ""
        }> 要フォロー</label><input type="date" class="pf-follow-date" value="${esc(
      v.followUpDate || ""
    )}" aria-label="フォロー予定日"></div>
        <div class="form-group"><label class="check"><input type="checkbox" class="pf-done" ${
          v.followUpDone ? "checked" : ""
        }> フォロー完了</label></div>
        <div class="form-group"><label>共有した相手</label><div class="check-row">${[
          "学年主任",
          "管理職",
          "養護教諭",
          "SC・SSW"
        ]
          .map(
            (x) =>
              `<label class="check"><input type="checkbox" class="pf-shared" value="${x}" ${
                sharedList.includes(x) ? "checked" : ""
              }> ${x}</label>`
          )
          .join("")}</div></div>
      </div>
      ${
        isEdit
          ? `<p class="muted small">入力：${esc(
              fmtDateTime(p.createdAt)
            )}　最終更新：${esc(fmtDateTime(p.updatedAt))}</p>`
          : ""
      }`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary pf-save">💾 保存</button>`
  });
  const q = (s) => $(s, m);
  const picker = studentPicker(q(".pf-students"), {
    multi: false,
    selected: p ? [p.studentId] : presetSid ? [presetSid] : []
  });
  attachMic(q(".mic-btn"), q(".pf-content"));
  q(".pf-follow-date").addEventListener("change", () => {
    if (q(".pf-follow-date").value) q(".pf-follow").checked = true;
  });
  q(".pf-save").addEventListener("click", () => {
    const ids = picker.get(),
      content = q(".pf-content").value.trim();
    if (!ids.length || !content) {
      toast("「児童」と「内容」は必須です", { type: "error" });
      return;
    }
    const data = {
      studentId: ids[0],
      date: q(".pf-date").value || todayStr(),
      time: q(".pf-time").value,
      method: q(".pf-method").value,
      partner: q(".pf-partner").value,
      direction: q(".pf-dir").value,
      topic: q(".pf-topic").value.trim(),
      content,
      response: q(".pf-response").value.trim(),
      followUp: q(".pf-follow").checked,
      followUpDate: q(".pf-follow-date").value,
      followUpDone: q(".pf-done").checked,
      shared: $$(".pf-shared", m)
        .filter((c) => c.checked)
        .map((c) => c.value)
        .join("、")
    };
    if (isEdit) Object.assign(p, data, { updatedAt: nowISO() });
    else
      state.parents.push(
        normParent(Object.assign({ createdAt: nowISO() }, data))
      );
    save();
    closeModal(true);
    toast(isEdit ? "更新しました" : "記録しました");
    refresh();
  });
  m.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) q(".pf-save").click();
  });
}
ACTIONS["parent-new"] = (el) => openParentForm(null, el.dataset.id || "");
ACTIONS["parent-edit"] = (el) =>
  openParentForm(state.parents.find((p) => p.id === el.dataset.id));
ACTIONS["parent-del"] = (el) =>
  removeWithUndo("parents", el.dataset.id, "保護者記録");
ACTIONS["parent-done"] = (el) => {
  const p = state.parents.find((x) => x.id === el.dataset.id);
  if (!p) return;
  p.followUpDone = true;
  p.updatedAt = nowISO();
  save();
  toast("フォロー完了にしました");
  refresh();
};

// ============================================================
//  分析（グラフ・表）
// ============================================================

// ---------- グラフ部品（SVG / HTML、外部ライブラリなし） ----------
function niceMax(v) {
  if (v <= 5) return Math.max(1, Math.ceil(v));
  const p = Math.pow(10, Math.floor(Math.log10(v))),
    n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}
function tickValues(max) {
  if (max <= 5) return Array.from({ length: max + 1 }, (_, i) => i);
  const step = max / 4;
  return [0, step, step * 2, step * 3, max].map((v) => Math.round(v));
}
function hBarsHTML(
  items,
  {
    avg = null,
    unit = "件",
    lowFlag = false,
    color = null,
    max = null,
    linkStudents = false
  } = {}
) {
  if (!items.length) return `<p class="muted small">データがありません</p>`;
  const mx = max || Math.max(1, ...items.map((i) => i.value), avg || 0);
  return `<div class="hbars">${items
    .map((it) => {
      const low = lowFlag && avg != null && it.value < avg * 0.5;
      const label =
        linkStudents && it.sid
          ? `<button type="button" class="link-btn" data-act="open-student" data-id="${
              it.sid
            }">${esc(it.label)}</button>`
          : esc(it.label);
      return `<div class="hbar-row" data-tip="${esc(
        it.tip || `${it.label}：${it.value}${unit}`
      )}">
      <span class="hbar-label" title="${esc(it.label)}">${label}</span>
      <div class="hbar-track"><div class="hbar-fill ${
        low ? "low" : ""
      }" style="width:${((it.value / mx) * 100).toFixed(1)}%;${
        it.color || color ? `background:${it.color || color}` : ""
      }"></div>${
        avg != null
          ? `<div class="hbar-avg" style="left:${((avg / mx) * 100).toFixed(
              1
            )}%"></div>`
          : ""
      }</div>
      <span class="hbar-val">${it.value}${
        low ? ` <em class="low-tag">少</em>` : ""
      }</span></div>`;
    })
    .join("")}</div>${
    avg != null
      ? `<div class="chart-legend"><span class="swatch sw-avg"></span>平均 ${avg.toFixed(
          1
        )}${unit}${
          lowFlag
            ? `　<span class="swatch sw-low"></span>平均の半分未満（<em class="low-tag">少</em>）`
            : ""
        }</div>`
      : ""
  }`;
}
// 2本並び（本人とクラス平均など）
function hBarsCompareHTML(items, { aName, bName, unit = "件" }) {
  const mx = Math.max(1, ...items.map((i) => Math.max(i.a, i.b)));
  return `<div class="hbars compare">${items
    .map(
      (it) => `
    <div class="hbar-row" data-tip="${esc(
      `${it.label}<br>${aName}：${it.a}${unit}<br>${bName}：${it.b.toFixed(
        1
      )}${unit}`
    )}">
      <span class="hbar-label" title="${esc(it.label)}">${esc(it.label)}</span>
      <div class="hbar-pair"><div class="hbar-track thin"><div class="hbar-fill" style="width:${(
        (it.a / mx) *
        100
      ).toFixed(
        1
      )}%"></div></div><div class="hbar-track thin"><div class="hbar-fill avg" style="width:${(
        (it.b / mx) *
        100
      ).toFixed(1)}%"></div></div></div>
      <span class="hbar-val">${it.a}<small class="muted"> / ${it.b.toFixed(
        1
      )}</small></span></div>`
    )
    .join("")}</div>
    <div class="chart-legend"><span class="swatch" style="background:${
      C.s1
    }"></span>${esc(aName)}　<span class="swatch" style="background:${
    C.avg
  }"></span>${esc(bName)}</div>`;
}
function vBarsSVG({ labels, series, height = 220, unit = "件", width = 1000 }) {
  const W = width,
    H = height,
    padL = 38,
    padR = 8,
    padT = 12,
    padB = 26;
  const maxV = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
  const ticks = tickValues(maxV);
  const plotH = H - padT - padB,
    cw = (W - padL - padR) / labels.length;
  const n = series.length,
    gap = 2;
  const bw = Math.max(4, Math.min(26, (cw * 0.7 - gap * (n - 1)) / n));
  let g = "";
  ticks.forEach((t) => {
    const y = H - padB - (t / maxV) * plotH;
    g += `<line x1="${padL}" x2="${W - padR}" y1="${y}" y2="${y}" stroke="${
      t === 0 ? C.axis : C.grid
    }" stroke-width="1"/>`;
    g += `<text x="${padL - 6}" y="${
      y + 3.5
    }" text-anchor="end" font-size="12" fill="${C.muted}">${t}</text>`;
  });
  labels.forEach((lab, i) => {
    const gx = padL + i * cw + (cw - (bw * n + gap * (n - 1))) / 2;
    series.forEach((s, j) => {
      const v = s.values[i] || 0;
      if (!v) return;
      const h = (v / maxV) * plotH,
        x = gx + j * (bw + gap),
        y = H - padB - h,
        r = Math.min(4, bw / 2, h);
      g += `<path d="M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${
        x + bw - r
      } Q${x + bw},${y} ${x + bw},${y + r} V${y + h} Z" fill="${
        s.color
      }" data-tip="${esc(`${lab}　${s.name}：${v}${unit}`)}"/>`;
    });
    g += `<text x="${padL + i * cw + cw / 2}" y="${
      H - 8
    }" text-anchor="middle" font-size="12.5" fill="${C.ink2}">${esc(
      lab
    )}</text>`;
  });
  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(
    series.map((s) => s.name).join("・")
  )}の棒グラフ">${g}</svg>
    ${
      n >= 2
        ? `<div class="chart-legend">${series
            .map(
              (s) =>
                `<span class="swatch" style="background:${
                  s.color
                }"></span>${esc(s.name)}`
            )
            .join("　")}</div>`
        : ""
    }`;
}
function radarSVG({ axes, series, size = 340 }) {
  const cx = size / 2,
    cy = size / 2 + 4,
    R = size / 2 - 62;
  const max = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
  const pt = (i, v) => [
    cx + (Math.cos(ang(i)) * R * v) / max,
    cy + (Math.sin(ang(i)) * R * v) / max
  ];
  let g = "";
  [0.25, 0.5, 0.75, 1].forEach((f) => {
    g += `<polygon points="${axes
      .map((_, i) => pt(i, max * f).join(","))
      .join(" ")}" fill="none" stroke="${C.grid}"/>`;
  });
  axes.forEach((a, i) => {
    const [x, y] = pt(i, max);
    g += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${C.grid}"/>`;
    const [lx, ly] = [
      cx + Math.cos(ang(i)) * (R + 14),
      cy + Math.sin(ang(i)) * (R + 14)
    ];
    const anchor =
      Math.abs(Math.cos(ang(i))) < 0.2
        ? "middle"
        : Math.cos(ang(i)) > 0
        ? "start"
        : "end";
    const lines =
      a.length > 6 && a.includes("・")
        ? a.split("・").map((p, k, arr) => (k < arr.length - 1 ? p + "・" : p))
        : [a];
    const dy =
      Math.sin(ang(i)) < -0.5
        ? -(lines.length - 1) * 11
        : Math.sin(ang(i)) > 0.5
        ? 6
        : -(lines.length - 1) * 5.5 + 3;
    g += `<text x="${lx}" y="${
      ly + dy
    }" text-anchor="${anchor}" font-size="10.5" fill="${C.ink2}">${lines
      .map((l, k) => `<tspan x="${lx}" dy="${k ? 11 : 0}">${esc(l)}</tspan>`)
      .join("")}</text>`;
  });
  g += `<text x="${cx + 4}" y="${cy - R + 11}" font-size="9" fill="${
    C.muted
  }">${max}</text>`;
  series.forEach((s) => {
    const pts = s.values.map((v, i) => pt(i, v));
    g += `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${
      s.fill || "none"
    }" fill-opacity="${s.fill ? 0.16 : 0}" stroke="${
      s.color
    }" stroke-width="2" ${
      s.dash ? `stroke-dasharray="5 4"` : ""
    } stroke-linejoin="round"/>`;
    pts.forEach((p, i) => {
      g += `<circle cx="${p[0]}" cy="${p[1]}" r="${s.dash ? 2.5 : 4}" fill="${
        s.dash ? C.avg : s.color
      }" stroke="#fff" stroke-width="1.5" data-tip="${esc(
        `${axes[i]}<br>${s.name}：${
          Number.isInteger(s.values[i]) ? s.values[i] : s.values[i].toFixed(1)
        }件`
      )}"/>`;
    });
  });
  return `<svg class="chart-svg radar" viewBox="0 0 ${size} ${
    size + 8
  }" role="img" aria-label="レーダーチャート">${g}</svg>
    <div class="chart-legend">${series
      .map(
        (s) =>
          `<span class="swatch ${s.dash ? "sw-dash" : ""}" style="background:${
            s.dash ? "transparent" : s.color
          };border-color:${s.color}"></span>${esc(s.name)}`
      )
      .join("　")}</div>`;
}
function heatTableHTML({
  cols,
  rows,
  corner = "児童",
  total = true,
  linkStudents = true
}) {
  const max = Math.max(1, ...rows.flatMap((r) => r.values));
  const cellStyle = (v) => {
    if (!v) return "";
    const idx = Math.min(
      C.ramp.length - 1,
      Math.max(0, Math.ceil((v / max) * C.ramp.length) - 1)
    );
    return `background:${C.ramp[idx]};color:${idx >= 3 ? "#fff" : C.ink}`;
  };
  const colTotals = cols.map((_, j) =>
    rows.reduce((a, r) => a + (r.values[j] || 0), 0)
  );
  return `<div class="table-container heat-wrap"><table class="heat-table">
    <thead><tr><th class="sticky-col">${esc(corner)}</th>${cols
    .map((c) => `<th><span>${esc(c)}</span></th>`)
    .join("")}${total ? "<th>計</th>" : ""}</tr></thead>
    <tbody>${rows
      .map((r) => {
        const sum = r.values.reduce((a, b) => a + b, 0);
        return `<tr><th class="sticky-col">${
          linkStudents && r.sid
            ? `<button type="button" class="link-btn" data-act="open-student" data-id="${
                r.sid
              }">${esc(r.label)}</button>`
            : esc(r.label)
        }</th>${r.values
          .map(
            (v, j) =>
              `<td style="${cellStyle(v)}" data-tip="${esc(
                `${r.label}・${cols[j]}：${v}件`
              )}">${v || `<span class="zero">·</span>`}</td>`
          )
          .join("")}${total ? `<td class="total">${sum}</td>` : ""}</tr>`;
      })
      .join("")}</tbody>
    ${
      total
        ? `<tfoot><tr><th class="sticky-col">合計</th>${colTotals
            .map((t) => `<td class="total">${t}</td>`)
            .join("")}<td class="total">${colTotals.reduce(
            (a, b) => a + b,
            0
          )}</td></tr></tfoot>`
        : ""
    }
  </table></div>`;
}
function monthsInRange(range) {
  return schoolMonths(state.settings.schoolYear).filter(
    (m) =>
      !range || (m.key + "-31" >= range.start && m.key + "-01" <= range.end)
  );
}
function countBy(list, keyFn) {
  const m = {};
  list.forEach((x) => {
    const ks = keyFn(x);
    (Array.isArray(ks) ? ks : [ks]).forEach((k) => {
      if (k == null || k === "") return;
      m[k] = (m[k] || 0) + 1;
    });
  });
  return m;
}

// ---------- クラス全体の分析 ----------
function classAnalysisHTML(range, { forPrint = false } = {}) {
  const students = studentsSorted();
  const n = students.length;
  const eps = state.episodes.filter((e) => inRange(e.date, range));
  const behs = state.behaviors.filter((b) => inRange(b.date, range));
  const pars = state.parents.filter((p) => inRange(p.date, range));
  if (!n) return emptyHTML("名簿が登録されていません");
  const perStu = countBy(eps, (e) => e.studentId);
  const avg = eps.length / n;
  const zero = students.filter((s) => !perStu[s.id]);
  const months = monthsInRange(range);
  const mE = countBy(eps, (e) => e.date.slice(0, 7)),
    mB = countBy(behs, (b) => b.date.slice(0, 7)),
    mP = countBy(pars, (p) => p.date.slice(0, 7));
  const tagC = countBy(eps, (e) => e.tags),
    subjC = countBy(eps, (e) => e.subject || "（未整理）");
  const learnTags = tagsOfGroup("学習"),
    actTags = tagsOfGroup("行動"),
    otherTags = tagsOfGroup("その他");
  const subjects = subjectList().filter((s) =>
    eps.some((e) => e.subject === s)
  );
  const sorted = students
    .slice()
    .sort((a, b) => (perStu[a.id] || 0) - (perStu[b.id] || 0));
  const fewSubjects = learningSubjects()
    .map((s) => [s, eps.filter((e) => e.subject === s).length])
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5);
  const behType = countBy(behs, (b) => b.type),
    behStu = countBy(behs, (b) => b.studentId),
    parMethod = countBy(pars, (p) => p.method),
    parStu = countBy(pars, (p) => p.studentId);
  const stuItems = students.map((s) => ({
    label: sLabel(s.id),
    sid: s.id,
    value: perStu[s.id] || 0
  }));

  return `
    <div class="kpis">
      ${kpi("エピソード", eps.length, "件", `1人平均 ${avg.toFixed(1)}件`)}
      ${kpi(
        "記録がある児童",
        n - zero.length,
        `/${n}人`,
        zero.length ? `まだ記録なし ${zero.length}人` : "全員に記録あり",
        zero.length ? "warn" : ""
      )}
      ${kpi(
        "最多／最少",
        `${Math.max(0, ...students.map((s) => perStu[s.id] || 0))}／${Math.min(
          ...students.map((s) => perStu[s.id] || 0)
        )}`,
        "件",
        "1人あたりの記録数"
      )}
      ${kpi("所見候補★", eps.filter((e) => e.star).length, "件")}
      ${kpi(
        "注意行動",
        behs.length,
        "件",
        `対応中 ${behs.filter((b) => b.status === "対応中").length}件`
      )}
      ${kpi(
        "保護者対応",
        pars.length,
        "件",
        `要フォロー ${
          state.parents.filter((p) => p.followUp && !p.followUpDone).length
        }件`
      )}
    </div>
    <div class="ana-grid">
      <section class="panel span-2 chart-card">
        <h3>児童別の記録数 <small class="muted">見取りの偏りをチェック</small></h3>
        <div class="two-col">
          <div>${hBarsHTML(stuItems, {
            avg,
            lowFlag: true,
            linkStudents: !forPrint
          })}</div>
          <div class="bias-box">
            <h4>👀 記録が少ない児童</h4>
            <ol class="bias-list">${sorted
              .slice(0, 8)
              .map(
                (s) =>
                  `<li>${
                    forPrint
                      ? esc(sLabel(s.id))
                      : `<button type="button" class="link-btn" data-act="quick-for" data-id="${
                          s.id
                        }">${esc(sLabel(s.id))}</button>`
                  } <span class="muted">${perStu[s.id] || 0}件</span></li>`
              )
              .join("")}</ol>
            <h4>📚 記録が少ない教科</h4>
            <ul class="bias-list">${fewSubjects
              .map(
                ([s, c]) =>
                  `<li>${esc(s)} <span class="muted">${c}件</span></li>`
              )
              .join("")}</ul>
            <p class="muted small">通知表の所見を書くときに材料が不足しやすい児童・教科です。</p>
          </div>
        </div>
      </section>
      <section class="panel span-2 chart-card">
        <h3>月別の記録数</h3>
        ${vBarsSVG({
          labels: months.map((m) => m.label),
          series: [
            {
              name: "エピソード",
              color: C.s1,
              values: months.map((m) => mE[m.key] || 0)
            },
            {
              name: "注意行動",
              color: C.s2,
              values: months.map((m) => mB[m.key] || 0)
            },
            {
              name: "保護者対応",
              color: C.s3,
              values: months.map((m) => mP[m.key] || 0)
            }
          ]
        })}
      </section>
      <section class="panel chart-card">
        <h3>観点・タグ別</h3>
        ${hBarsHTML(
          state.tags
            .map((t) => ({ label: t.name, value: tagC[t.name] || 0 }))
            .filter((x) => x.value)
            .sort((a, b) => b.value - a.value)
        )}
      </section>
      <section class="panel chart-card">
        <h3>教科・領域別</h3>
        ${hBarsHTML(
          Object.entries(subjC)
            .map(([k, v]) => ({ label: k, value: v }))
            .sort((a, b) => b.value - a.value)
        )}
      </section>
      <section class="panel span-2 chart-card">
        <h3>児童 × 学習の観点・行動の記録 <small class="muted">色が濃いほど記録が多い／「·」は記録なし</small></h3>
        ${heatTableHTML({
          cols: [...learnTags, "行動の記録（計）", "その他タグ（計）"],
          rows: students.map((s) => {
            const mine = eps.filter((e) => e.studentId === s.id);
            return {
              label: sLabel(s.id),
              sid: s.id,
              values: [
                ...learnTags.map(
                  (t) => mine.filter((e) => e.tags.includes(t)).length
                ),
                mine.filter((e) => e.tags.some((t) => actTags.includes(t)))
                  .length,
                mine.filter((e) => e.tags.some((t) => otherTags.includes(t)))
                  .length
              ]
            };
          }),
          linkStudents: !forPrint
        })}
      </section>
      <section class="panel span-2 chart-card">
        <h3>児童 × 教科・領域</h3>
        ${
          subjects.length
            ? heatTableHTML({
                cols: subjects,
                rows: students.map((s) => ({
                  label: sLabel(s.id),
                  sid: s.id,
                  values: subjects.map(
                    (sub) =>
                      eps.filter(
                        (e) => e.studentId === s.id && e.subject === sub
                      ).length
                  )
                })),
                linkStudents: !forPrint
              })
            : `<p class="muted small">教科が設定された記録がありません</p>`
        }
      </section>
      <section class="panel span-2 chart-card">
        <h3>児童 × 行動の記録（指導要録の10項目） <small class="muted">○をつけるときの参考に</small></h3>
        ${heatTableHTML({
          cols: actTags,
          rows: students.map((s) => ({
            label: sLabel(s.id),
            sid: s.id,
            values: actTags.map(
              (t) =>
                eps.filter((e) => e.studentId === s.id && e.tags.includes(t))
                  .length
            )
          })),
          linkStudents: !forPrint
        })}
      </section>
      <section class="panel chart-card">
        <h3>注意行動（種別）</h3>
        ${hBarsHTML(
          Object.entries(behType)
            .map(([k, v]) => ({ label: k, value: v }))
            .sort((a, b) => b.value - a.value),
          { color: C.s2 }
        )}
        <div class="summary-row small">${BEHAVIOR_LEVELS.map(
          (l) =>
            `<span>${levelBadge(l.key)} ${
              behs.filter((b) => b.level === l.key).length
            }件</span>`
        ).join("")}${BEHAVIOR_STATUSES.map(
    (s) =>
      `<span>${statusBadge(s)} ${
        behs.filter((b) => b.status === s).length
      }</span>`
  ).join("")}</div>
      </section>
      <section class="panel chart-card">
        <h3>注意行動（児童別）</h3>
        ${hBarsHTML(
          students
            .filter((s) => behStu[s.id])
            .map((s) => ({
              label: sLabel(s.id),
              sid: s.id,
              value: behStu[s.id]
            }))
            .sort((a, b) => b.value - a.value),
          { color: C.s2, linkStudents: !forPrint }
        )}
      </section>
      <section class="panel chart-card">
        <h3>保護者対応（方法別）</h3>
        ${hBarsHTML(
          Object.entries(parMethod)
            .map(([k, v]) => ({ label: k, value: v }))
            .sort((a, b) => b.value - a.value),
          { color: C.s3 }
        )}
        <div class="summary-row small">${PARENT_DIRECTIONS.map(
          (d) =>
            `<span>${esc(d)} ${
              pars.filter((p) => p.direction === d).length
            }件</span>`
        ).join("")}</div>
      </section>
      <section class="panel chart-card">
        <h3>保護者対応（児童別）</h3>
        ${hBarsHTML(
          students
            .filter((s) => parStu[s.id])
            .map((s) => ({
              label: sLabel(s.id),
              sid: s.id,
              value: parStu[s.id]
            }))
            .sort((a, b) => b.value - a.value),
          { color: C.s3, linkStudents: !forPrint }
        )}
      </section>
    </div>`;
}

// ---------- 個人の分析 ----------
function studentAnalysisHTML(sid, range, { forPrint = false } = {}) {
  const n = Math.max(1, state.students.length);
  const eps = episodesOf(sid, range),
    all = state.episodes.filter((e) => inRange(e.date, range));
  const behs = behaviorsOf(sid, range),
    pars = parentsOf(sid, range);
  const avg = all.length / n;
  const last = eps.reduce((m, e) => (e.date > m ? e.date : m), "");
  const months = monthsInRange(range);
  const mE = countBy(eps, (e) => e.date.slice(0, 7)),
    mB = countBy(behs, (b) => b.date.slice(0, 7));
  const learnTags = tagsOfGroup("学習"),
    actTags = tagsOfGroup("行動");
  const mineTag = countBy(eps, (e) => e.tags),
    allTag = countBy(all, (e) => e.tags);
  const subjC = countBy(eps, (e) => e.subject || "（未整理）");
  const missing = learningSubjects().filter(
    (s) => !eps.some((e) => e.subject === s)
  );
  const rank = studentsSorted()
    .map((s) => ({
      id: s.id,
      c: all.filter((e) => e.studentId === s.id).length
    }))
    .sort((a, b) => b.c - a.c);
  const myRank = rank.findIndex((r) => r.id === sid) + 1;
  const actAny = actTags.some((t) => allTag[t]);
  const behType = countBy(behs, (b) => b.type);

  return `
    <div class="kpis">
      ${kpi(
        "エピソード",
        eps.length,
        "件",
        `クラス平均 ${avg.toFixed(1)}件`,
        eps.length < avg * 0.5 ? "warn" : ""
      )}
      ${kpi(
        "記録数の順位",
        myRank || "-",
        `/${state.students.length}位`,
        "多い順"
      )}
      ${kpi(
        "最終記録",
        last ? agoLabel(last) : "-",
        "",
        last ? fmtMD(last) : "記録なし",
        !last || daysAgo(last) >= 14 ? "warn" : ""
      )}
      ${kpi("所見候補★", eps.filter((e) => e.star).length, "件")}
      ${kpi(
        "注意行動",
        behs.length,
        "件",
        `対応中 ${behs.filter((b) => b.status === "対応中").length}件`,
        behs.some((b) => b.status === "対応中") ? "warn" : ""
      )}
      ${kpi(
        "保護者対応",
        pars.length,
        "件",
        `要フォロー ${
          pars.filter((p) => p.followUp && !p.followUpDone).length
        }件`
      )}
    </div>
    <div class="ana-grid">
      <section class="panel span-2 chart-card"><h3>月別の記録</h3>
        ${vBarsSVG({
          labels: months.map((m) => m.label),
          series: [
            {
              name: "エピソード",
              color: C.s1,
              values: months.map((m) => mE[m.key] || 0)
            },
            {
              name: "注意行動",
              color: C.s2,
              values: months.map((m) => mB[m.key] || 0)
            }
          ],
          height: forPrint ? 170 : 200
        })}
      </section>
      <section class="panel chart-card"><h3>学習の観点 <small class="muted">本人とクラス平均</small></h3>
        ${hBarsCompareHTML(
          learnTags.map((t) => ({
            label: t,
            a: mineTag[t] || 0,
            b: (allTag[t] || 0) / n
          })),
          { aName: "本人", bName: "クラス平均" }
        )}
      </section>
      <section class="panel chart-card"><h3>教科・領域別</h3>
        ${hBarsHTML(
          Object.entries(subjC)
            .map(([k, v]) => ({ label: k, value: v }))
            .sort((a, b) => b.value - a.value)
        )}
        ${
          missing.length
            ? `<p class="small notice-inline">📌 記録がない教科：${missing
                .map(esc)
                .join("、")}</p>`
            : ""
        }
      </section>
      <section class="panel chart-card"><h3>行動の記録（10項目）</h3>
        ${
          actAny
            ? radarSVG({
                axes: actTags,
                series: [
                  {
                    name: "クラス平均",
                    color: C.avg,
                    dash: true,
                    values: actTags.map((t) => (allTag[t] || 0) / n)
                  },
                  {
                    name: "本人",
                    color: C.s1,
                    fill: C.s1,
                    values: actTags.map((t) => mineTag[t] || 0)
                  }
                ],
                size: forPrint ? 300 : 340
              })
            : `<p class="muted small">観点タグで「行動の記録」の項目（基本的な生活習慣、責任感 など）を選んで記録すると、ここにレーダーチャートが表示されます。</p>`
        }
      </section>
      <section class="panel chart-card"><h3>行動の記録 項目別の件数 <small class="muted">指導要録の○の参考</small></h3>
        <table class="data-table compact"><thead><tr><th>項目</th><th class="num">本人</th><th class="num">クラス平均</th><th>参考</th></tr></thead>
        <tbody>${actTags
          .map((t) => {
            const a = mineTag[t] || 0,
              b = (allTag[t] || 0) / n;
            const hi = a >= Math.max(2, b * 1.5);
            return `<tr class="${hi ? "hi-row" : ""}"><td>${esc(
              t
            )}</td><td class="num">${a}</td><td class="num">${b.toFixed(
              1
            )}</td><td>${hi ? "◎ 記録が多い" : ""}</td></tr>`;
          })
          .join("")}</tbody></table>
      </section>
      ${
        behs.length
          ? `<section class="panel chart-card"><h3>注意行動の内訳</h3>${hBarsHTML(
              Object.entries(behType)
                .map(([k, v]) => ({ label: k, value: v }))
                .sort((a, b) => b.value - a.value),
              { color: C.s2 }
            )}
        <div class="summary-row small">${BEHAVIOR_LEVELS.map(
          (l) =>
            `<span>${levelBadge(l.key)} ${
              behs.filter((b) => b.level === l.key).length
            }件</span>`
        ).join("")}</div></section>`
          : ""
      }
    </div>`;
}

// ---------- 分析 画面 ----------
VIEWS.analysis = (root) => {
  root.innerHTML = `
    <div class="page-head"><h2>📊 分析</h2>
      <div class="page-actions"><label class="inline-label">期間 ${periodSelectHTML(
        "ana-period",
        ui.anaPeriod
      )}</label><button type="button" class="btn btn-outline" data-act="print-analysis">🖨 分析を印刷</button></div></div>
    <div id="ana-body"></div>`;
  const draw = () => {
    $("#ana-body").innerHTML = classAnalysisHTML(periodRange(ui.anaPeriod));
  };
  $("#ana-period").addEventListener("change", (e) => {
    ui.anaPeriod = e.target.value;
    draw();
  });
  draw();
  ui.refresh = draw;
};

// ============================================================
//  Excel・バックアップ・CSV／新年度の準備／印刷／設定
// ============================================================

// ---------- Excel（ExcelJSを必要なときだけ読み込む） ----------
const EXCELJS_URLS = [
  "https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js",
  "https://unpkg.com/exceljs@4.4.0/dist/exceljs.min.js"
];
function loadExcelJS() {
  if (window.ExcelJS) return Promise.resolve(window.ExcelJS);
  return new Promise((resolve, reject) => {
    let i = 0;
    const next = () => {
      if (i >= EXCELJS_URLS.length) {
        reject(new Error("ExcelJSを読み込めませんでした"));
        return;
      }
      const s = document.createElement("script");
      s.src = EXCELJS_URLS[i++];
      s.async = true;
      s.onload = () => (window.ExcelJS ? resolve(window.ExcelJS) : next());
      s.onerror = () => {
        s.remove();
        next();
      };
      (document.head || document.body).appendChild(s);
    };
    next();
  });
}
const YES = (v) =>
  [
    "○",
    "◯",
    "〇",
    "true",
    "TRUE",
    "1",
    "はい",
    "済",
    "要配慮",
    "★",
    "あり",
    "要"
  ].includes(String(v == null ? "" : v).trim()) || v === true;
const XL = {
  students: {
    sheet: "児童名簿",
    cols: [
      { h: "番号", k: "no", w: 6 },
      { h: "氏名", k: "name", w: 16 },
      { h: "ふりがな", k: "kana", w: 18 },
      { h: "性別", k: "gender", w: 6 },
      { h: "配慮事項", k: "care", w: 40, wrap: true },
      { h: "引き継ぎ事項", k: "handover", w: 50, wrap: true },
      { h: "メモ", k: "memo", w: 28, wrap: true },
      { h: "ID", k: "id", w: 14 }
    ]
  },
  episodes: {
    sheet: "エピソード",
    cols: [
      { h: "記録日", k: "date", w: 12 },
      { h: "番号", k: "_no", w: 6 },
      { h: "児童名", k: "_name", w: 14 },
      { h: "教科", k: "subject", w: 12 },
      { h: "単元・場面", k: "unit", w: 16 },
      { h: "観点・タグ", k: "tags", w: 24, wrap: true },
      { h: "エピソード本文", k: "content", w: 70, wrap: true },
      { h: "要配慮", k: "isGuidance", w: 8, bool: true },
      { h: "所見候補", k: "star", w: 8, bool: true },
      { h: "入力日時", k: "createdAt", w: 17, dt: true },
      { h: "ID", k: "id", w: 14 }
    ]
  },
  shoken: {
    sheet: "所見",
    cols: [
      { h: "学期", k: "term", w: 8 },
      { h: "番号", k: "_no", w: 6 },
      { h: "児童名", k: "_name", w: 14 },
      { h: "種類", k: "type", w: 14 },
      { h: "教科", k: "subject", w: 10 },
      { h: "所見文", k: "text", w: 80, wrap: true },
      { h: "文字数", k: "_chars", w: 7 },
      { h: "状態", k: "status", w: 8 },
      { h: "更新日時", k: "updatedAt", w: 17, dt: true },
      { h: "ID", k: "id", w: 14 }
    ]
  },
  behaviors: {
    sheet: "注意行動",
    cols: [
      { h: "日付", k: "date", w: 12 },
      { h: "時刻", k: "time", w: 7 },
      { h: "番号", k: "_no", w: 6 },
      { h: "児童名", k: "_name", w: 14 },
      { h: "種別", k: "type", w: 16 },
      { h: "程度", k: "_level", w: 6 },
      { h: "場所", k: "place", w: 10 },
      { h: "状況・経緯", k: "situation", w: 50, wrap: true },
      { h: "対応・指導", k: "response", w: 40, wrap: true },
      { h: "関係児童", k: "related", w: 16, wrap: true },
      { h: "経過・その後", k: "followup", w: 36, wrap: true },
      { h: "保護者連絡", k: "parentContacted", w: 9, bool: true },
      { h: "管理職報告", k: "reported", w: 9, bool: true },
      { h: "状況", k: "status", w: 9 },
      { h: "入力日時", k: "createdAt", w: 17, dt: true },
      { h: "ID", k: "id", w: 14 }
    ]
  },
  parents: {
    sheet: "保護者記録",
    cols: [
      { h: "日付", k: "date", w: 12 },
      { h: "時刻", k: "time", w: 7 },
      { h: "番号", k: "_no", w: 6 },
      { h: "児童名", k: "_name", w: 14 },
      { h: "方法", k: "method", w: 12 },
      { h: "相手", k: "partner", w: 8 },
      { h: "発信", k: "direction", w: 10 },
      { h: "件名", k: "topic", w: 24, wrap: true },
      { h: "内容", k: "content", w: 50, wrap: true },
      { h: "学校の対応", k: "response", w: 40, wrap: true },
      { h: "要フォロー", k: "followUp", w: 9, bool: true },
      { h: "フォロー予定日", k: "followUpDate", w: 12 },
      { h: "フォロー完了", k: "followUpDone", w: 9, bool: true },
      { h: "共有", k: "shared", w: 16 },
      { h: "入力日時", k: "createdAt", w: 17, dt: true },
      { h: "ID", k: "id", w: 14 }
    ]
  }
};
function stuNo(id) {
  const s = getStudent(id);
  return s && s.no !== "" ? s.no : "";
}
function toXlRow(def, item) {
  const o = {};
  def.cols.forEach((c) => {
    let v;
    if (c.k === "_no") v = stuNo(item.studentId);
    else if (c.k === "_name") v = realName(item.studentId);
    else if (c.k === "_chars") v = charCount(item.text);
    else if (c.k === "_level") v = levelInfo(item.level).label;
    else if (c.k === "tags") v = item.tags.join("、");
    else v = item[c.k];
    if (c.bool) v = v ? "○" : "";
    if (c.dt) v = fmtDateTime(v);
    o[c.k] = v == null ? "" : v;
  });
  return o;
}
function styleSheet(ws, def, { landscape = true } = {}) {
  const header = ws.getRow(1);
  header.height = 22;
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4361EE" }
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true
    };
  });
  const border = { style: "thin", color: { argb: "FFD0D4DC" } };
  ws.eachRow((row, r) => {
    row.eachCell({ includeEmpty: true }, (cell, c) => {
      cell.border = {
        top: border,
        left: border,
        bottom: border,
        right: border
      };
      if (r > 1) {
        const col = def && def.cols[c - 1];
        cell.alignment = { vertical: "top", wrapText: !!(col && col.wrap) };
      }
    });
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];
  if (ws.columnCount)
    ws.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: ws.columnCount }
    };
  ws.pageSetup = {
    paperSize: 9,
    orientation: landscape ? "landscape" : "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    printTitlesRow: "1:1"
  };
  ws.headerFooter = {
    oddHeader: "&L取扱注意（個人情報）&R&D",
    oddFooter: "&C&P / &N"
  };
}
function addDataSheet(wb, def, items, color) {
  const ws = wb.addWorksheet(def.sheet, {
    properties: { tabColor: { argb: color || "FF4361EE" } }
  });
  ws.columns = def.cols.map((c) => ({ header: c.h, key: c.k, width: c.w }));
  items.forEach((it) => ws.addRow(toXlRow(def, it)));
  styleSheet(ws, def);
  return ws;
}
function sortedBy(list, fn) {
  return list.slice().sort(fn);
}
const byDateNo = (a, b) =>
  a.date.localeCompare(b.date) ||
  (stuNo(a.studentId) || 999) - (stuNo(b.studentId) || 999);

async function exportExcel() {
  let ExcelJS;
  toast("Excelファイルを作成しています…", { duration: 2000 });
  try {
    ExcelJS = await loadExcelJS();
  } catch (e) {
    confirmModal({
      title: "Excelを作成できませんでした",
      message:
        "Excel作成用の部品をインターネットから読み込めませんでした。\nインターネット接続を確認してください。\n\n代わりに、バックアップ（JSON）やCSVで保存できます。",
      okLabel: "バックアップ（JSON）で保存",
      onOk: exportJSON
    });
    return;
  }
  const s = state.settings;
  const wb = new ExcelJS.Workbook();
  wb.creator = "所見・指導要録バインダー";
  wb.created = new Date();
  const students = studentsSorted();

  // 表紙
  const cover = wb.addWorksheet("表紙", {
    properties: { tabColor: { argb: "FF0D366B" } }
  });
  cover.columns = [{ width: 22 }, { width: 60 }];
  const coverRows = [
    ["所見・指導要録バインダー　データ一式", ""],
    ["", ""],
    ["年度", nendoLabel(s.schoolYear)],
    ["学校名", s.schoolName],
    ["学年・組", `${s.grade ? s.grade + "年" : ""}${s.className || ""}`],
    ["担任", s.teacher],
    ["出力日時", fmtDateTime(nowISO())],
    ["", ""],
    ["児童数", `${students.length}人`],
    ["エピソード", `${state.episodes.length}件`],
    ["所見", `${state.shoken.filter((k) => k.text).length}件`],
    ["注意行動", `${state.behaviors.length}件`],
    ["保護者記録", `${state.parents.length}件`],
    ["", ""],
    [
      "⚠ 取扱注意",
      "児童の個人情報を含みます。学校の情報セキュリティ規程に従って保管してください。"
    ],
    [
      "シートの説明",
      "引き継ぎ：次の担任への引き継ぎ用一覧／児童名簿〜保護者記録：全データ／分析_児童別：記録数の集計"
    ],
    [
      "読み込みについて",
      "このファイルはアプリの「設定・データ」→「Excelから読み込む」で、そのまま復元・引き継ぎができます。シート名と1行目の見出しは変えないでください。"
    ]
  ];
  coverRows.forEach((r) => cover.addRow(r));
  cover.getRow(1).font = { bold: true, size: 16, color: { argb: "FF0D366B" } };
  cover.eachRow((row, r) => {
    if (r > 2) {
      row.getCell(1).font = { bold: true };
      row.getCell(2).alignment = { wrapText: true, vertical: "top" };
    }
  });

  // 引き継ぎ
  const latestShoken = (sid) => {
    const ks = state.shoken.filter(
      (k) =>
        k.studentId === sid &&
        k.text &&
        (k.type === "総合所見" || k.type === "指導要録")
    );
    if (!ks.length) return "";
    const order = [...state.settings.terms.map((t) => t.name), YEAR_TERM];
    ks.sort(
      (a, b) =>
        order.indexOf(b.term) - order.indexOf(a.term) ||
        (b.type === "指導要録") - (a.type === "指導要録")
    );
    return `【${ks[0].term}・${shokenType(ks[0].type).label}】${ks[0].text}`;
  };
  const ho = wb.addWorksheet("引き継ぎ", {
    properties: { tabColor: { argb: "FF1BAF7A" } }
  });
  const hoDef = {
    cols: [
      { w: 6 },
      { w: 14 },
      { w: 16 },
      { w: 36, wrap: true },
      { w: 42, wrap: true },
      { w: 60, wrap: true },
      { w: 30, wrap: true },
      { w: 26, wrap: true },
      { w: 8 }
    ]
  };
  ho.columns = [
    { header: "番号", width: 6 },
    { header: "氏名", width: 14 },
    { header: "ふりがな", width: 16 },
    { header: "配慮事項", width: 36 },
    { header: "引き継ぎ事項", width: 42 },
    { header: "最新の所見", width: 60 },
    { header: "注意行動（件数・主な種別）", width: 30 },
    { header: "保護者対応", width: 26 },
    { header: "記録数", width: 8 }
  ];
  students.forEach((st) => {
    const bs = behaviorsOf(st.id),
      ps = parentsOf(st.id);
    const bt = Object.entries(countBy(bs, (b) => b.type))
      .sort((a, b) => b[1] - a[1])
      .map(([t, n]) => `${t}${n}`)
      .join("、");
    ho.addRow([
      st.no,
      st.name,
      st.kana,
      st.care,
      st.handover,
      latestShoken(st.id),
      bs.length
        ? `${bs.length}件（${bt}）${
            bs.some((b) => b.status === "対応中") ? "／対応中あり" : ""
          }`
        : "",
      ps.length
        ? `${ps.length}件${
            ps.some((p) => p.followUp && !p.followUpDone)
              ? "／要フォローあり"
              : ""
          }`
        : "",
      state.episodes.filter((e) => e.studentId === st.id).length
    ]);
  });
  styleSheet(ho, hoDef);

  addDataSheet(wb, XL.students, students);
  addDataSheet(wb, XL.episodes, sortedBy(state.episodes, byDateNo));
  addDataSheet(
    wb,
    XL.shoken,
    state.shoken
      .filter((k) => k.text)
      .sort(
        (a, b) =>
          a.term.localeCompare(b.term, "ja") ||
          a.type.localeCompare(b.type, "ja") ||
          (stuNo(a.studentId) || 999) - (stuNo(b.studentId) || 999)
      ),
    "FF6250D6"
  );
  addDataSheet(
    wb,
    XL.behaviors,
    sortedBy(state.behaviors, byDateNo),
    "FFEB6834"
  );
  addDataSheet(wb, XL.parents, sortedBy(state.parents, byDateNo), "FFEDA100");

  // 分析（児童別集計）
  const an = wb.addWorksheet("分析_児童別", {
    properties: { tabColor: { argb: "FF898781" } }
  });
  const tags = state.tags.map((t) => t.name),
    subjects = subjectList();
  const headers = [
    "番号",
    "氏名",
    "記録数",
    "所見候補★",
    ...tags.map((t) => "観点:" + t),
    ...subjects.map((x) => "教科:" + x),
    "注意行動",
    "保護者対応"
  ];
  an.columns = headers.map((h, i) => ({
    header: h,
    width: i === 1 ? 14 : i < 4 ? 8 : 10
  }));
  students.forEach((st) => {
    const es = state.episodes.filter((e) => e.studentId === st.id);
    an.addRow([
      st.no,
      st.name,
      es.length,
      es.filter((e) => e.star).length,
      ...tags.map((t) => es.filter((e) => e.tags.includes(t)).length),
      ...subjects.map((x) => es.filter((e) => e.subject === x).length),
      behaviorsOf(st.id).length,
      parentsOf(st.id).length
    ]);
  });
  styleSheet(an, null);
  an.getRow(1).height = 60;
  an.getRow(1).eachCell((c) => {
    c.alignment = {
      textRotation: 90,
      vertical: "bottom",
      horizontal: "center",
      wrapText: true
    };
  });
  ["A1", "B1", "C1", "D1"].forEach((a) => {
    an.getCell(a).alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true
    };
  });

  // 復元用の設定（非表示シート）
  const sys = wb.addWorksheet("_system", { state: "veryHidden" });
  const json = JSON.stringify({
    app: "shoken-binder",
    version: 5,
    settings: state.settings,
    subjects: state.subjects,
    tags: state.tags,
    memoPhrases: state.memoPhrases,
    myPhrases: state.myPhrases
  });
  sys.addRow(["shoken-binder-system", 5]);
  for (let i = 0; i < json.length; i += 30000)
    sys.addRow([json.slice(i, i + 30000)]);

  const buf = await wb.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    `所見バインダー_${classFileLabel()}_${fileStamp()}.xlsx`
  );
  state.settings.lastBackupAt = nowISO();
  save();
  updateHeader();
  toast("Excelファイルを保存しました");
}

function cellText(v) {
  if (v == null) return "";
  if (v instanceof Date) return normDate(v);
  if (typeof v === "object") {
    if (Array.isArray(v.richText))
      return v.richText.map((r) => r.text).join("");
    if (v.text != null) return String(v.text);
    if (v.result != null) return cellText(v.result);
    return "";
  }
  return String(v);
}
function parseDateTime(v) {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  const m = String(v).match(
    /^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})[ T](\d{1,2}):(\d{2})/
  );
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).toISOString();
  const t = Date.parse(v);
  return isNaN(t) ? null : new Date(t).toISOString();
}

async function readExcel(file) {
  const ExcelJS = await loadExcelJS();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  const readSheet = (name) => {
    const ws = wb.getWorksheet(name);
    if (!ws) return null;
    const headers = [];
    ws.getRow(1).eachCell({ includeEmpty: true }, (c, col) => {
      headers[col] = cellText(c.value).trim();
    });
    const rows = [];
    ws.eachRow((row, r) => {
      if (r === 1) return;
      const o = {};
      let any = false;
      headers.forEach((h, col) => {
        if (!h) return;
        const v = row.getCell(col).value;
        o[h] = v;
        if (v != null && v !== "") any = true;
      });
      if (any) rows.push(o);
    });
    return rows;
  };
  let system = null;
  const sys = wb.getWorksheet("_system");
  if (sys) {
    let json = "";
    sys.eachRow((row, r) => {
      if (r > 1) json += cellText(row.getCell(1).value);
    });
    try {
      system = JSON.parse(json);
    } catch (e) {
      system = null;
    }
  }
  // 見出し名でデータを組み立てる（列の順番が変わっていても読める）
  const fromDef = (def, rows) =>
    (rows || []).map((row) => {
      const o = {};
      def.cols.forEach((c) => {
        const raw = row[c.h];
        if (c.bool) o[c.k] = YES(cellText(raw));
        else if (c.dt)
          o[c.k] = parseDateTime(raw instanceof Date ? raw : cellText(raw));
        else if (["date", "followUpDate"].includes(c.k))
          o[c.k] =
            normDate(raw instanceof Date ? raw : cellText(raw)) ||
            (typeof raw === "number" ? normDate(raw) : "");
        else o[c.k] = cellText(raw).trim();
      });
      return o;
    });
  const data = {
    system,
    students: fromDef(XL.students, readSheet(XL.students.sheet)).filter(
      (r) => r.name
    ),
    episodes: fromDef(XL.episodes, readSheet(XL.episodes.sheet)).filter(
      (r) => r._name && r.content
    ),
    shoken: fromDef(XL.shoken, readSheet(XL.shoken.sheet)).filter(
      (r) => r._name && r.text
    ),
    behaviors: fromDef(XL.behaviors, readSheet(XL.behaviors.sheet)).filter(
      (r) => r._name
    ),
    parents: fromDef(XL.parents, readSheet(XL.parents.sheet)).filter(
      (r) => r._name
    )
  };
  if (!data.students.length && !data.episodes.length)
    throw new Error(
      "このアプリで出力したExcelファイルではないようです（「児童名簿」「エピソード」シートが見つかりません）"
    );
  return data;
}

// 読み込んだデータ（Excel・JSON共通の形）を取り込む
function applyIncoming(data, mode) {
  try {
    localStorage.setItem(SAFETY_KEY, JSON.stringify(state));
  } catch (e) {
    /* 容量不足のときは退避しない */
  }
  const report = {
    students: 0,
    episodes: 0,
    shoken: 0,
    behaviors: 0,
    parents: 0,
    skipped: 0
  };
  if (mode === "replace") {
    const sys = data.system || {};
    normalizeState({
      settings: Object.assign({}, state.settings, sys.settings || {}, {
        maskNames: state.settings.maskNames,
        lastBackupAt: state.settings.lastBackupAt
      }),
      subjects: sys.subjects || state.subjects,
      tags: sys.tags || state.tags,
      memoPhrases: sys.memoPhrases || state.memoPhrases,
      myPhrases: sys.myPhrases || state.myPhrases,
      students: [],
      episodes: [],
      shoken: [],
      behaviors: [],
      parents: []
    });
  } else if (data.system) {
    const sys = data.system;
    if (sys.subjects)
      Object.entries(sys.subjects).forEach(([k, units]) => {
        if (!state.subjects[k]) state.subjects[k] = units;
        else
          units.forEach((u) => {
            if (!state.subjects[k].includes(u)) state.subjects[k].push(u);
          });
      });
    if (sys.tags)
      sys.tags.forEach((t) => {
        if (!state.tags.some((x) => x.name === t.name)) state.tags.push(t);
      });
    if (sys.myPhrases)
      sys.myPhrases.forEach((p) => {
        if (!state.myPhrases.some((x) => x.text === p.text))
          state.myPhrases.push(p);
      });
  }
  // 名簿
  const idMap = {};
  data.students.forEach((r) => {
    const name = cleanName(r.name);
    if (!name) return;
    let s = findStudentByName(name);
    if (!s) {
      s = normStudent({
        id: r.id && !getStudent(r.id) ? r.id : uid(),
        no: r.no === "" ? nextStudentNo() : r.no,
        name,
        kana: r.kana,
        gender: r.gender,
        care: r.care,
        handover: r.handover,
        memo: r.memo
      });
      state.students.push(s);
      report.students++;
    } else {
      if (r.no !== "" && r.no != null && s.no === "")
        s.no = Number(r.no) || s.no;
      ["kana", "gender"].forEach((k) => {
        if (r[k] && !s[k]) s[k] = r[k];
      });
      ["care", "handover", "memo"].forEach((k) => {
        if (r[k] && !String(s[k]).includes(r[k]))
          s[k] = s[k] ? s[k] + "\n" + r[k] : r[k];
      });
    }
    if (r.id) idMap[r.id] = s.id;
  });
  if (mode === "roster") {
    save();
    return report;
  }
  const sidOf = (r) =>
    (r.studentId && idMap[r.studentId]) ||
    (r.studentId && getStudent(r.studentId) && r.studentId) ||
    ensureStudent(r._name || realName(r.studentId)).id;
  const keyOf = (kind, x) =>
    kind === "episodes"
      ? `${x.studentId}|${x.date}|${x.content}`
      : kind === "behaviors"
      ? `${x.studentId}|${x.date}|${x.situation}`
      : kind === "parents"
      ? `${x.studentId}|${x.date}|${x.content}`
      : `${x.studentId}|${x.term}|${x.type}|${x.subject}`;
  const norm = {
    episodes: normEpisode,
    shoken: normShoken,
    behaviors: normBehavior,
    parents: normParent
  };
  ["episodes", "shoken", "behaviors", "parents"].forEach((kind) => {
    const keys = new Set(state[kind].map((x) => keyOf(kind, x)));
    (data[kind] || []).forEach((r) => {
      const item = norm[kind](
        Object.assign({}, r, {
          studentId: sidOf(r),
          level: r._level ? { 軽: 1, 中: 2, 重: 3 }[r._level] || 1 : r.level
        })
      );
      if (kind === "episodes") {
        item.tags.forEach(ensureTag);
        if (item.subject && !state.subjects[item.subject])
          state.subjects[item.subject] = item.unit ? [item.unit] : ["共通"];
      }
      const byId = r.id ? state[kind].findIndex((x) => x.id === r.id) : -1;
      if (byId >= 0) {
        state[kind][byId] = Object.assign(state[kind][byId], item, {
          id: r.id
        });
        report[kind]++;
        return;
      }
      if (kind === "shoken") {
        const ex = findShoken(
          item.studentId,
          item.term,
          item.type,
          item.subject
        );
        if (ex) {
          if (item.text && item.text !== ex.text) {
            Object.assign(ex, {
              text: item.text,
              status: item.status,
              updatedAt: item.updatedAt
            });
            report.shoken++;
          } else report.skipped++;
          return;
        }
      }
      const k = keyOf(kind, item);
      if (keys.has(k)) {
        report.skipped++;
        return;
      }
      if (!r.id || state[kind].some((x) => x.id === item.id)) item.id = uid();
      state[kind].push(item);
      keys.add(k);
      report[kind]++;
    });
  });
  save();
  return report;
}
function reportText(r) {
  const parts = [
    ["児童", r.students, "人"],
    ["エピソード", r.episodes, "件"],
    ["所見", r.shoken, "件"],
    ["注意行動", r.behaviors, "件"],
    ["保護者記録", r.parents, "件"]
  ]
    .filter((x) => x[1])
    .map((x) => `${x[0]} ${x[1]}${x[2]}`);
  return (
    (parts.length
      ? parts.join("、") + " を取り込みました"
      : "新しく取り込むデータはありませんでした") +
    (r.skipped ? `（重複 ${r.skipped}件はスキップ）` : "")
  );
}

function openImportModal(kind) {
  const isExcel = kind === "excel";
  const m = openModal({
    title: isExcel ? "📗 Excelから読み込む" : "💾 バックアップ（JSON）から復元",
    body: `
      <p>${
        isExcel
          ? "このアプリで出力したExcelファイル（.xlsx）を選んでください。前年度の担任から受け取ったファイルも読み込めます。"
          : "このアプリで保存したバックアップファイル（.json）を選んでください。"
      }</p>
      <input type="file" id="imp-file" accept="${isExcel ? ".xlsx" : ".json"}">
      <fieldset class="radio-list">
        <legend>読み込み方</legend>
        <label><input type="radio" name="imp-mode" value="merge" checked> <b>追加・統合</b>：今のデータに追加します（同じ記録は重複しません）</label>
        <label><input type="radio" name="imp-mode" value="replace"> <b>置き換え（復元）</b>：今のデータを消して、ファイルの内容に置き換えます</label>
        <label><input type="radio" name="imp-mode" value="roster"> <b>名簿と配慮・引き継ぎ事項だけ</b>：新年度に前の担任から引き継ぐとき</label>
      </fieldset>
      <p class="muted small">読み込み直前のデータは自動で退避されるので、「設定・データ」の「直前の状態に戻す」で元に戻せます。</p>`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary" id="imp-ok">読み込む</button>`
  });
  $("#imp-ok", m).addEventListener("click", async () => {
    const file = $("#imp-file", m).files[0];
    if (!file) {
      toast("ファイルを選んでください", { type: "error" });
      return;
    }
    const mode = $$("input[name=imp-mode]", m).find((r) => r.checked).value;
    const btn = $("#imp-ok", m);
    btn.disabled = true;
    btn.textContent = "読み込み中…";
    try {
      const data = isExcel ? await readExcel(file) : await readJSONFile(file);
      const go2 = () => {
        const r = applyIncoming(data, mode);
        closeModal(true);
        render();
        toast(reportText(r), { duration: 6000 });
      };
      if (mode === "replace") {
        closeModal(true);
        confirmModal({
          title: "置き換えの確認",
          danger: true,
          okLabel: "置き換える",
          message: `今のデータ（エピソード${state.episodes.length}件など）を消して、ファイルの内容に置き換えます。よろしいですか？`,
          onOk: go2
        });
      } else go2();
    } catch (e) {
      console.error(e);
      btn.disabled = false;
      btn.textContent = "読み込む";
      toast("読み込めませんでした：" + (e.message || e), {
        type: "error",
        duration: 8000
      });
    }
  });
}
async function readJSONFile(file) {
  const obj = JSON.parse(await file.text());
  let st = obj && obj.state ? obj.state : obj;
  if (Array.isArray(st)) {
    // 旧バージョンのエピソード配列
    return {
      system: null,
      students: [],
      episodes: st.map((e) =>
        Object.assign({}, e, { _name: e.name, tags: e.tag ? [e.tag] : [] })
      ),
      shoken: [],
      behaviors: [],
      parents: []
    };
  }
  if (!st || !Array.isArray(st.students))
    throw new Error("このアプリのバックアップファイルではないようです");
  const nameOf = (id) => {
    const s = st.students.find((x) => x.id === id);
    return s ? s.name : "";
  };
  const withName = (list) =>
    (list || []).map((x) =>
      Object.assign({}, x, { _name: nameOf(x.studentId) })
    );
  return {
    system: {
      settings: st.settings,
      subjects: st.subjects,
      tags: st.tags,
      memoPhrases: st.memoPhrases,
      myPhrases: st.myPhrases
    },
    students: st.students,
    episodes: withName(st.episodes),
    shoken: withName(st.shoken),
    behaviors: withName(st.behaviors),
    parents: withName(st.parents)
  };
}
function exportJSON() {
  const data = {
    app: "shoken-binder",
    version: 5,
    exportedAt: nowISO(),
    state
  };
  downloadBlob(
    new Blob([JSON.stringify(data)], { type: "application/json" }),
    `所見バインダー_バックアップ_${classFileLabel()}_${fileStamp()}.json`
  );
  state.settings.lastBackupAt = nowISO();
  save();
  updateHeader();
  toast("バックアップファイルを保存しました");
}

// ---------- CSV（旧アプリとの互換） ----------
function csvCell(v) {
  return `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
}
function exportCSV() {
  if (!state.episodes.length) {
    toast("出力するエピソードがありません", { type: "error" });
    return;
  }
  let csv =
    "﻿記録日,児童名,要配慮フラグ,教科,単元,評価観点・タグ,エピソード本文,所見候補,番号,ID\n";
  sortedBy(state.episodes, byDateNo).forEach((e) => {
    csv +=
      [
        e.date,
        realName(e.studentId),
        e.isGuidance ? "要配慮" : "",
        e.subject,
        e.unit,
        e.tags.join("、"),
        e.content,
        e.star ? "★" : "",
        stuNo(e.studentId),
        e.id
      ]
        .map(csvCell)
        .join(",") + "\n";
  });
  downloadBlob(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    `エピソード_${classFileLabel()}_${fileStamp()}.csv`
  );
  toast("CSVを出力しました");
}
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const lines = [];
  let line = [],
    cell = "",
    q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i],
      nx = text[i + 1];
    if (q) {
      if (ch === '"' && nx === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      line.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && nx === "\n") i++;
      line.push(cell);
      lines.push(line);
      line = [];
      cell = "";
    } else cell += ch;
  }
  if (cell || line.length) {
    line.push(cell);
    lines.push(line);
  }
  return lines.filter((l) => l.some((c) => c.trim() !== ""));
}
async function importCSVFile(file) {
  const buf = await file.arrayBuffer();
  let text = new TextDecoder("utf-8").decode(buf);
  if (text.includes("�")) {
    try {
      text = new TextDecoder("shift_jis").decode(buf);
    } catch (e) {
      /* noop */
    }
  }
  const rows = parseCSV(text);
  if (rows.length < 2) throw new Error("データが見つかりませんでした");
  const head = rows[0].map((h) => h.trim());
  const idx = (name) => head.indexOf(name);
  const has = idx("記録日") >= 0 && idx("児童名") >= 0;
  const col = (r, name, fallback) => {
    const i = has ? idx(name) : fallback;
    return i >= 0 && i < r.length ? r[i] : "";
  };
  const episodes = rows
    .slice(1)
    .map((r) => ({
      date: normDate(col(r, "記録日", 0)),
      _name: cleanName(col(r, "児童名", 1)),
      isGuidance: col(r, "要配慮フラグ", 2) === "要配慮",
      subject: col(r, "教科", 3),
      unit: col(r, "単元", 4),
      tags: col(r, "評価観点・タグ", 5)
        .split(/[、,，／\/]/)
        .map((t) => t.trim())
        .filter(Boolean),
      content: col(r, "エピソード本文", 6),
      star: YES(col(r, "所見候補", 7)),
      id: has && idx("ID") >= 0 ? col(r, "ID", -1) : ""
    }))
    .filter((e) => e._name && e.content);
  if (!episodes.length)
    throw new Error(
      "読み込めるデータが見つかりませんでした（フォーマットを確認してください）"
    );
  const names = [...new Set(episodes.map((e) => e._name))].sort((a, b) =>
    a.localeCompare(b, "ja")
  );
  return {
    system: null,
    students: names
      .filter((n) => !findStudentByName(n))
      .map((n) => ({ name: n, no: "" })),
    episodes,
    shoken: [],
    behaviors: [],
    parents: []
  };
}

// ---------- 新年度の準備 ----------
ACTIONS["new-year"] = () => {
  const y = Number(state.settings.schoolYear) + 1;
  const m = openModal({
    title: "🌸 新年度の準備",
    wide: true,
    body: `
      <ol class="steps">
        <li><b>まず今年度のデータを保存しましょう</b><div class="btn-row"><button type="button" class="btn btn-sm btn-primary" data-act="export-excel">📗 Excelに保存</button><button type="button" class="btn btn-sm btn-outline" data-act="export-json">💾 バックアップ（JSON）</button></div></li>
        <li><b>新しい年度</b>　<input type="number" id="ny-year" value="${y}" style="width:100px"> 年度（${esc(
      nendoLabel(y)
    )}）</li>
        <li><b>名簿の扱い</b>
          <label class="radio"><input type="radio" name="ny-roster" value="keep" checked> 名簿を残す（持ち上がり）※配慮事項・引き継ぎ事項も残ります</label>
          <label class="radio"><input type="radio" name="ny-roster" value="clear"> 名簿も消す（新しいクラス）</label></li>
        <li><b>消去するもの</b>：エピソード・所見・注意行動・保護者記録（教科・単元・タグ・文例の設定は残ります）</li>
      </ol>
      <label class="check danger"><input type="checkbox" id="ny-ok"> 今年度のデータをExcelまたはバックアップで保存しました</label>`,
    footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-danger" id="ny-go">新年度を始める</button>`
  });
  $("#ny-go", m).addEventListener("click", () => {
    if (!$("#ny-ok", m).checked) {
      toast("保存したことを確認してチェックを入れてください", {
        type: "error"
      });
      return;
    }
    const year = Number($("#ny-year", m).value) || y;
    try {
      localStorage.setItem(SAFETY_KEY, JSON.stringify(state));
    } catch (e) {
      /* noop */
    }
    const keep =
      $$("input[name=ny-roster]", m).find((r) => r.checked).value === "keep";
    state.episodes = [];
    state.shoken = [];
    state.behaviors = [];
    state.parents = [];
    if (!keep) state.students = [];
    state.settings.schoolYear = year;
    state.settings.terms = makeTerms(year, state.settings.termSystem);
    if (
      keep &&
      state.settings.grade &&
      /^\d$/.test(String(state.settings.grade))
    )
      state.settings.grade = String(
        Math.min(6, Number(state.settings.grade) + 1)
      );
    save();
    closeModal(true);
    go("home");
    toast(`${nendoLabel(year)}を始めました`);
  });
};

// ---------- 印刷 ----------
function withRealNames(fn) {
  const m = state.settings.maskNames;
  state.settings.maskNames = false;
  try {
    return fn();
  } finally {
    state.settings.maskNames = m;
  }
}
function pHead(title, sub = "") {
  return `<header class="p-head"><div><h1>${esc(
    title
  )}</h1><div class="p-meta">${esc(classLabel())}${
    sub ? "｜" + esc(sub) : ""
  }</div></div><div class="p-right"><div class="p-secret">取扱注意（個人情報）</div><div>印刷日 ${esc(
    fmtSlash(todayStr())
  )}</div></div></header>`;
}
function doPrint(html) {
  const pa = $("#print-area");
  pa.innerHTML = html;
  document.body.classList.add("printing");
  const cleanup = () => {
    document.body.classList.remove("printing");
    pa.innerHTML = "";
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(() => window.print(), 80);
}
function epTableHTML(eps, { showStudent = true } = {}) {
  if (!eps.length) return `<p class="p-empty">記録はありません</p>`;
  return `<table class="p-table"><thead><tr><th class="w-date">記録日</th>${
    showStudent ? `<th class="w-name">児童</th>` : ""
  }<th class="w-subj">教科・単元</th><th class="w-tag">観点</th><th>内容</th></tr></thead><tbody>
    ${eps
      .map(
        (e) =>
          `<tr><td>${esc(fmtMD(e.date))}</td>${
            showStudent ? `<td>${esc(sLabel(e.studentId))}</td>` : ""
          }<td>${esc(
            e.subject ? e.subject + (e.unit ? "：" + e.unit : "") : ""
          )}</td><td>${esc(e.tags.join("、"))}</td><td>${
            e.isGuidance ? "【要配慮】" : ""
          }${e.star ? "★" : ""}${nl2br(e.content)}</td></tr>`
      )
      .join("")}</tbody></table>`;
}
function behTableHTML(list, { showStudent = true } = {}) {
  if (!list.length) return `<p class="p-empty">記録はありません</p>`;
  return `<table class="p-table"><thead><tr><th class="w-date">日付</th>${
    showStudent ? `<th class="w-name">児童</th>` : ""
  }<th class="w-subj">種別・程度</th><th>状況・経緯</th><th>対応・経過</th><th class="w-tag">状況</th></tr></thead><tbody>
    ${list
      .map(
        (b) =>
          `<tr><td>${esc(fmtMD(b.date))}${
            b.time ? "<br>" + esc(b.time) : ""
          }</td>${
            showStudent ? `<td>${esc(sLabel(b.studentId))}</td>` : ""
          }<td>${esc(b.type)}<br>程度：${esc(levelInfo(b.level).label)}${
            b.place ? "<br>" + esc(b.place) : ""
          }</td><td>${nl2br(b.situation)}${
            b.related ? `<br><small>関係：${esc(b.related)}</small>` : ""
          }</td><td>${nl2br(b.response)}${
            b.followup ? `<br><small>経過：${nl2br(b.followup)}</small>` : ""
          }</td><td>${esc(b.status)}${
            b.parentContacted ? "<br>保護者連絡済" : ""
          }${b.reported ? "<br>報告済" : ""}</td></tr>`
      )
      .join("")}</tbody></table>`;
}
function parTableHTML(list, { showStudent = true } = {}) {
  if (!list.length) return `<p class="p-empty">記録はありません</p>`;
  return `<table class="p-table"><thead><tr><th class="w-date">日付</th>${
    showStudent ? `<th class="w-name">児童</th>` : ""
  }<th class="w-subj">方法・相手</th><th>件名・内容</th><th>学校の対応</th><th class="w-tag">フォロー</th></tr></thead><tbody>
    ${list
      .map(
        (p) =>
          `<tr><td>${esc(fmtMD(p.date))}${
            p.time ? "<br>" + esc(p.time) : ""
          }</td>${
            showStudent ? `<td>${esc(sLabel(p.studentId))}</td>` : ""
          }<td>${esc(p.method)}<br>${esc(p.partner)}（${esc(
            p.direction
          )}）</td><td>${p.topic ? `<b>${esc(p.topic)}</b><br>` : ""}${nl2br(
            p.content
          )}</td><td>${nl2br(p.response)}</td><td>${
            p.followUp
              ? p.followUpDone
                ? "完了"
                : `予定 ${esc(p.followUpDate ? fmtMD(p.followUpDate) : "未定")}`
              : ""
          }${
            p.shared ? `<br><small>共有：${esc(p.shared)}</small>` : ""
          }</td></tr>`
      )
      .join("")}</tbody></table>`;
}
function karteHTML(sid, o) {
  const s = getStudent(sid);
  if (!s) return "";
  const r = periodRange(o.period);
  let eps = episodesOf(sid, r).sort((a, b) => a.date.localeCompare(b.date));
  if (!o.guid) eps = eps.filter((e) => !e.isGuidance);
  const ks = state.shoken.filter((k) => k.studentId === sid && k.text);
  return `<section class="p-page">
    ${pHead("児童カルテ", periodLabel(o.period))}
    <div class="p-student"><span class="p-no">${
      s.no === "" ? "-" : s.no
    }</span><div><div class="p-name">${esc(
    s.name
  )}</div><div class="p-kana">${esc(s.kana)}${
    s.gender ? "　" + esc(s.gender) : ""
  }</div></div>
      <table class="p-mini"><tr><th>エピソード</th><td>${
        episodesOf(sid, r).length
      }件</td><th>注意行動</th><td>${
    behaviorsOf(sid, r).length
  }件</td><th>保護者対応</th><td>${
    parentsOf(sid, r).length
  }件</td></tr></table></div>
    ${
      o.care && (s.care || s.handover)
        ? `<h2>配慮事項・引き継ぎ事項</h2><table class="p-table"><tr><th class="w-subj">配慮事項</th><td>${
            nl2br(s.care) || "—"
          }</td></tr><tr><th>引き継ぎ事項</th><td>${
            nl2br(s.handover) || "—"
          }</td></tr></table>`
        : ""
    }
    ${
      o.analysis
        ? `<h2>分析</h2><div class="p-analysis">${studentAnalysisHTML(sid, r, {
            forPrint: true
          })}</div>`
        : ""
    }
    ${
      o.shoken && ks.length
        ? `<h2>所見</h2><table class="p-table"><thead><tr><th class="w-subj">学期・種類</th><th>所見文</th><th class="w-date">字数</th></tr></thead><tbody>${ks
            .map(
              (k) =>
                `<tr><td>${esc(k.term)}<br>${esc(shokenType(k.type).label)}${
                  k.subject ? "<br>" + esc(k.subject) : ""
                }</td><td>${nl2br(k.text)}</td><td>${charCount(
                  k.text
                )}<br><small>${esc(k.status)}</small></td></tr>`
            )
            .join("")}</tbody></table>`
        : ""
    }
    ${
      o.episodes
        ? `<h2>エピソード（${eps.length}件）</h2>${epTableHTML(eps, {
            showStudent: false
          })}`
        : ""
    }
    ${
      o.behaviors
        ? `<h2>注意行動</h2>${behTableHTML(
            behaviorsOf(sid, r).sort((a, b) => a.date.localeCompare(b.date)),
            { showStudent: false }
          )}`
        : ""
    }
    ${
      o.parents
        ? `<h2>保護者対応</h2>${parTableHTML(
            parentsOf(sid, r).sort((a, b) => a.date.localeCompare(b.date)),
            { showStudent: false }
          )}`
        : ""
    }
  </section>`;
}
const PRINT_KINDS = [
  { k: "records", label: "📝 エピソード一覧（全体）" },
  { k: "karte", label: "👧 児童個人カルテ（1人）" },
  { k: "karte-all", label: "👨‍👩‍👧 全児童のカルテ（1人1ページ）" },
  { k: "shoken", label: "✍️ 所見一覧（確認・回覧用）" },
  { k: "behaviors", label: "⚠️ 注意行動の一覧" },
  { k: "parents", label: "📞 保護者対応の一覧" },
  { k: "analysis", label: "📊 クラスの分析レポート" },
  { k: "handover", label: "📦 引き継ぎ一覧（配慮・引き継ぎ事項）" }
];
function openPrintModal(preset = {}) {
  let kind = preset.kind || "records";
  const m = openModal({
    title: "🖨 印刷",
    wide: true,
    body: `<div class="print-layout"><div class="radio-list print-kinds">${PRINT_KINDS.map(
      (p) =>
        `<label><input type="radio" name="pk" value="${p.k}" ${
          p.k === kind ? "checked" : ""
        }> ${p.label}</label>`
    ).join("")}</div><div class="print-opts" id="print-opts"></div></div>`,
    footer: `<span class="muted small foot-hint">印刷画面で「PDFに保存」を選ぶとPDFにできます</span><button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary" id="print-go">🖨 印刷する</button>`
  });
  const opts = $("#print-opts", m);
  const termSel = `<label>学期 <select id="po-term">${optionsHTML(
    [...state.settings.terms.map((t) => t.name), YEAR_TERM],
    preset.term || currentTerm()
  )}</select></label>`;
  const karteChecks = `<div class="check-col"><label class="check"><input type="checkbox" id="po-analysis" checked> 分析（グラフ・表）</label><label class="check"><input type="checkbox" id="po-shoken" checked> 所見</label><label class="check"><input type="checkbox" id="po-episodes" checked> エピソード</label><label class="check"><input type="checkbox" id="po-behaviors" checked> 注意行動</label><label class="check"><input type="checkbox" id="po-parents" checked> 保護者対応</label><label class="check"><input type="checkbox" id="po-care" checked> 配慮・引き継ぎ事項</label></div>`;
  const guidChk = `<label class="check danger"><input type="checkbox" id="po-guid" checked> 「要配慮」のエピソードも印刷する</label>`;
  const drawOpts = () => {
    const per = `<label>期間 ${periodSelectHTML(
      "po-period",
      preset.period || "all"
    )}</label>`;
    const stu = (blank) =>
      `<label>児童 <select id="po-student">${
        blank
          ? studentOptionsHTML(preset.student || "", "全員")
          : studentsSorted()
              .map(
                (s) =>
                  `<option value="${s.id}" ${
                    s.id === preset.student ? "selected" : ""
                  }>${esc(withRealNames(() => sLabel(s.id)))}</option>`
              )
              .join("")
      }</select></label>`;
    const html = {
      records: `${per}${stu(
        true
      )}<label>並べ方 <select id="po-group">${optionsHTML(
        [
          { value: "date", label: "日付順" },
          { value: "student", label: "児童ごとにまとめる" }
        ],
        preset.group || "date"
      )}</select></label>${guidChk}`,
      karte: `${stu(false)}${per}${karteChecks}${guidChk}`,
      "karte-all": `${per}${karteChecks}${guidChk}<p class="muted small">1人1ページで印刷します（${state.students.length}人）。</p>`,
      shoken: `${termSel}<label>種類 <select id="po-type">${optionsHTML(
        SHOKEN_TYPES.map((t) => ({ value: t.key, label: t.label })),
        preset.type || "総合所見"
      )}</select></label><label class="check"><input type="checkbox" id="po-blank" checked> 未記入の児童も行を出す</label>`,
      behaviors: `${per}${stu(
        true
      )}<label>状況 <select id="po-status">${optionsHTML(
        BEHAVIOR_STATUSES,
        "",
        "すべて"
      )}</select></label>`,
      parents: `${per}${stu(true)}`,
      analysis: `${per}`,
      handover: `<p class="muted small">全児童の配慮事項・引き継ぎ事項・注意行動と保護者対応の件数を一覧にします。</p>`
    }[kind];
    opts.innerHTML = html;
  };
  $$("input[name=pk]", m).forEach((r) =>
    r.addEventListener("change", () => {
      kind = r.value;
      drawOpts();
    })
  );
  drawOpts();
  $("#print-go", m).addEventListener("click", () => {
    const v = (id) => {
      const el = $("#" + id, m);
      return el ? (el.type === "checkbox" ? el.checked : el.value) : undefined;
    };
    const html = withRealNames(() =>
      buildPrint(kind, {
        period: v("po-period") || "all",
        student: v("po-student") || "",
        group: v("po-group"),
        guid: v("po-guid") !== false,
        term: v("po-term"),
        type: v("po-type"),
        blank: v("po-blank"),
        status: v("po-status") || "",
        analysis: v("po-analysis"),
        shoken: v("po-shoken"),
        episodes: v("po-episodes"),
        behaviors: v("po-behaviors"),
        parents: v("po-parents"),
        care: v("po-care")
      })
    );
    closeModal(true);
    doPrint(html);
  });
}
function buildPrint(kind, o) {
  const r = periodRange(o.period);
  if (kind === "records") {
    let eps = state.episodes.filter(
      (e) =>
        inRange(e.date, r) &&
        (!o.student || e.studentId === o.student) &&
        (o.guid || !e.isGuidance)
    );
    if (o.group === "student") {
      return `<section class="p-page">${pHead(
        "エピソード一覧（児童別）",
        periodLabel(o.period)
      )}${studentsSorted()
        .filter((s) => !o.student || s.id === o.student)
        .map((s) => {
          const mine = eps
            .filter((e) => e.studentId === s.id)
            .sort((a, b) => a.date.localeCompare(b.date));
          return `<div class="p-block"><h2>${esc(sLabel(s.id))}（${
            mine.length
          }件）</h2>${epTableHTML(mine, { showStudent: false })}</div>`;
        })
        .join("")}</section>`;
    }
    eps = eps.sort(byDateNo);
    return `<section class="p-page">${pHead(
      "エピソード一覧",
      `${periodLabel(o.period)}${o.student ? "・" + sLabel(o.student) : ""}・${
        eps.length
      }件`
    )}${epTableHTML(eps)}</section>`;
  }
  if (kind === "karte")
    return karteHTML(o.student || (studentsSorted()[0] || {}).id, o);
  if (kind === "karte-all")
    return studentsSorted()
      .map((s) => karteHTML(s.id, o))
      .join("");
  if (kind === "shoken") {
    const t = shokenType(o.type),
      term = t.yearly
        ? YEAR_TERM
        : o.term === YEAR_TERM
        ? currentTerm()
        : o.term;
    let rows = "";
    if (t.needSubject) {
      studentsSorted().forEach((s) => {
        const ks = state.shoken.filter(
          (k) =>
            k.studentId === s.id &&
            k.term === term &&
            k.type === "教科" &&
            k.text
        );
        if (!ks.length && o.blank)
          rows += `<tr><td>${s.no}</td><td>${esc(
            s.name
          )}</td><td></td><td class="p-blank">（未記入）</td><td></td></tr>`;
        ks.forEach((k, i) => {
          rows += `<tr><td>${i ? "" : s.no}</td><td>${
            i ? "" : esc(s.name)
          }</td><td>${esc(k.subject)}</td><td>${nl2br(
            k.text
          )}</td><td>${charCount(k.text)}<br><small>${esc(
            k.status
          )}</small></td></tr>`;
        });
      });
    } else {
      studentsSorted().forEach((s) => {
        const k = findShoken(s.id, term, t.key);
        if (!k || !k.text) {
          if (o.blank)
            rows += `<tr><td>${s.no}</td><td>${esc(
              s.name
            )}</td><td class="p-blank">（未記入）</td><td></td></tr>`;
          return;
        }
        rows += `<tr><td>${s.no}</td><td>${esc(s.name)}</td><td>${nl2br(
          k.text
        )}</td><td>${charCount(k.text)}<br><small>${esc(
          k.status
        )}</small></td></tr>`;
      });
    }
    return `<section class="p-page">${pHead(
      `所見一覧：${t.label}`,
      term
    )}<table class="p-table p-shoken"><thead><tr><th class="w-no">番号</th><th class="w-name">氏名</th>${
      t.needSubject ? `<th class="w-subj">教科</th>` : ""
    }<th>所見文</th><th class="w-date">字数</th></tr></thead><tbody>${rows}</tbody></table><div class="p-sign"><span>担任</span><span>学年主任</span><span>教頭</span><span>校長</span></div></section>`;
  }
  if (kind === "behaviors") {
    const list = state.behaviors
      .filter(
        (b) =>
          inRange(b.date, r) &&
          (!o.student || b.studentId === o.student) &&
          (!o.status || b.status === o.status)
      )
      .sort(byDateNo);
    return `<section class="p-page">${pHead(
      "注意行動の記録",
      `${periodLabel(o.period)}・${list.length}件`
    )}${behTableHTML(list)}</section>`;
  }
  if (kind === "parents") {
    const list = state.parents
      .filter(
        (p) => inRange(p.date, r) && (!o.student || p.studentId === o.student)
      )
      .sort(byDateNo);
    return `<section class="p-page">${pHead(
      "保護者対応の記録",
      `${periodLabel(o.period)}・${list.length}件`
    )}${parTableHTML(list)}</section>`;
  }
  if (kind === "analysis")
    return `<section class="p-page p-analysis">${pHead(
      "クラスの分析レポート",
      periodLabel(o.period)
    )}${classAnalysisHTML(r, { forPrint: true })}</section>`;
  if (kind === "handover") {
    return `<section class="p-page">${pHead(
      "引き継ぎ一覧"
    )}<table class="p-table"><thead><tr><th class="w-no">番号</th><th class="w-name">氏名</th><th>配慮事項</th><th>引き継ぎ事項</th><th class="w-subj">注意行動／保護者対応</th></tr></thead><tbody>${studentsSorted()
      .map((s) => {
        const bs = behaviorsOf(s.id),
          ps = parentsOf(s.id);
        return `<tr><td>${s.no}</td><td>${esc(s.name)}</td><td>${nl2br(
          s.care
        )}</td><td>${nl2br(s.handover)}</td><td>${
          bs.length
            ? `注意行動 ${bs.length}件<br><small>${esc(
                Object.keys(countBy(bs, (b) => b.type)).join("、")
              )}</small>`
            : ""
        }${ps.length ? `<br>保護者対応 ${ps.length}件` : ""}</td></tr>`;
      })
      .join("")}</tbody></table></section>`;
  }
  return "";
}
ACTIONS["print-center"] = () => openPrintModal();
ACTIONS["print-records"] = () =>
  openPrintModal({
    kind: "records",
    period: ui.rec.period,
    student: ui.rec.student
  });
ACTIONS["print-student"] = (el) =>
  openPrintModal({
    kind: "karte",
    student: el.dataset.id,
    period: ui.stuPeriod
  });
ACTIONS["print-all-karte"] = () => openPrintModal({ kind: "karte-all" });
ACTIONS["print-shoken"] = () =>
  openPrintModal({ kind: "shoken", term: ui.sk.term, type: ui.sk.type });
ACTIONS["print-behaviors"] = () =>
  openPrintModal({
    kind: "behaviors",
    period: ui.beh.period,
    student: ui.beh.student
  });
ACTIONS["print-parents"] = () =>
  openPrintModal({
    kind: "parents",
    period: ui.par.period,
    student: ui.par.student
  });
ACTIONS["print-analysis"] = () =>
  openPrintModal({ kind: "analysis", period: ui.anaPeriod });
ACTIONS["export-excel"] = () => exportExcel();
ACTIONS["export-json"] = () => exportJSON();
ACTIONS["export-csv"] = () => exportCSV();
ACTIONS["import-excel"] = () => openImportModal("excel");
ACTIONS["import-json"] = () => openImportModal("json");
ACTIONS["import-csv"] = () => {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.accept = ".csv";
  inp.addEventListener("change", async () => {
    const f = inp.files[0];
    if (!f) return;
    try {
      const data = await importCSVFile(f);
      const r = applyIncoming(data, "merge");
      render();
      toast(reportText(r), { duration: 6000 });
    } catch (e) {
      toast("読み込めませんでした：" + (e.message || e), {
        type: "error",
        duration: 8000
      });
    }
  });
  inp.click();
};
ACTIONS["restore-safety"] = () => {
  let raw = null;
  try {
    raw = localStorage.getItem(SAFETY_KEY);
  } catch (e) {
    raw = null;
  }
  if (!raw) {
    toast("退避されたデータはありません");
    return;
  }
  confirmModal({
    title: "直前の状態に戻す",
    message:
      "最後に読み込み・新年度の準備・置き換えをする直前の状態に戻します。今のデータは上書きされます。よろしいですか？",
    okLabel: "戻す",
    danger: true,
    onOk: () => {
      const cur = JSON.stringify(state);
      try {
        normalizeState(JSON.parse(raw));
        localStorage.setItem(SAFETY_KEY, cur);
        save();
        render();
        toast("直前の状態に戻しました（もう一度押すと元に戻ります）");
      } catch (e) {
        toast("戻せませんでした", { type: "error" });
      }
    }
  });
};
ACTIONS["wipe-all"] = () => {
  confirmModal({
    title: "すべてのデータを削除",
    danger: true,
    okLabel: "すべて削除",
    message:
      "名簿・記録・所見・設定をすべて削除します。\n先にExcelかバックアップで保存してください。本当に削除しますか？",
    onOk: () => {
      try {
        localStorage.setItem(SAFETY_KEY, JSON.stringify(state));
      } catch (e) {
        /* noop */
      }
      normalizeState(null);
      save();
      go("home");
      toast("すべてのデータを削除しました（直前の状態に戻すこともできます）");
    }
  });
};

// ---------- 設定・データ 画面 ----------
VIEWS.settings = (root) => {
  const s = state.settings;
  const size = JSON.stringify(state).length;
  const sizeKB = Math.round(size / 1024),
    pct = Math.min(100, Math.round((size / (5 * 1024 * 1024)) * 100));
  let safety = false;
  try {
    safety = !!localStorage.getItem(SAFETY_KEY);
  } catch (e) {
    safety = false;
  }
  root.innerHTML = `
    <div class="page-head"><h2>⚙️ 設定・データ</h2></div>
    <div class="settings-grid">
      <section class="panel span-2 data-panel">
        <h3>💾 データの保存・引き継ぎ</h3>
        <p class="muted small">データはこのパソコンのブラウザの中だけに保存されています（ブラウザの履歴削除などで消えることがあります）。定期的に保存してください。最終保存：${
          s.lastBackupAt ? esc(fmtDateTime(s.lastBackupAt)) : "まだありません"
        }</p>
        <div class="data-actions">
          <div class="data-card"><h4>📗 Excel</h4><p>全データを1つのExcelファイルに。引き継ぎシート付きで、次の担任にそのまま渡せます。</p><div class="btn-row"><button type="button" class="btn btn-primary" data-act="export-excel">Excelに出力</button><button type="button" class="btn btn-outline" data-act="import-excel">Excelから読み込む</button></div></div>
          <div class="data-card"><h4>💾 バックアップ（JSON）</h4><p>アプリのデータを丸ごと保存。インターネットがなくても使えます。別のパソコンへの移動にも。</p><div class="btn-row"><button type="button" class="btn btn-primary" data-act="export-json">バックアップを保存</button><button type="button" class="btn btn-outline" data-act="import-json">バックアップから復元</button></div></div>
          <div class="data-card"><h4>📄 CSV</h4><p>エピソードだけをCSVで。<b>以前のアプリで保存したCSV</b>もここから読み込めます。</p><div class="btn-row"><button type="button" class="btn btn-outline" data-act="export-csv">CSV出力</button><button type="button" class="btn btn-outline" data-act="import-csv">CSV読込</button></div></div>
          <div class="data-card"><h4>🌸 新年度の準備</h4><p>今年度のデータを保存してから、記録を空にして新しい年度を始めます。</p><div class="btn-row"><button type="button" class="btn btn-outline" data-act="new-year">新年度の準備</button></div></div>
        </div>
        <div class="storage"><span>使用量 約${sizeKB}KB</span><div class="meter sm"><div class="meter-fill ${
    pct > 80 ? "over" : ""
  }" style="width:${pct}%"></div></div><span class="muted small">目安の上限 約5MB</span>
          ${
            safety
              ? `<button type="button" class="btn btn-sm btn-outline" data-act="restore-safety">↩ 直前の状態に戻す</button>`
              : ""
          }
          <button type="button" class="btn btn-sm btn-danger-outline" data-act="wipe-all">すべて削除</button></div>
      </section>

      <section class="panel">
        <h3>🏫 クラスの情報</h3>
        <div class="form-row"><div class="form-group"><label>年度（西暦）</label><input type="number" id="st-year" value="${esc(
          s.schoolYear
        )}"></div><div class="form-group"><label>&nbsp;</label><div class="muted" style="padding-top:10px">${esc(
    nendoLabel(s.schoolYear)
  )}</div></div></div>
        <div class="form-group"><label>学校名</label><input type="text" id="st-school" value="${esc(
          s.schoolName
        )}"></div>
        <div class="form-row"><div class="form-group"><label>学年</label><select id="st-grade">${optionsHTML(
          ["1", "2", "3", "4", "5", "6"].map((g) => ({
            value: g,
            label: g + "年"
          })),
          s.grade,
          "（未設定）"
        )}</select></div><div class="form-group"><label>組</label><input type="text" id="st-class" value="${esc(
    s.className
  )}" placeholder="1組"></div></div>
        <div class="form-group"><label>担任名</label><input type="text" id="st-teacher" value="${esc(
          s.teacher
        )}"></div>
        <label class="check"><input type="checkbox" id="st-mask" ${
          s.maskNames ? "checked" : ""
        }> 画面では名前を隠して出席番号で表示する（のぞき見防止）</label>
        <div class="form-actions"><button type="button" class="btn btn-primary" id="st-save">保存</button></div>
      </section>

      <section class="panel">
        <h3>🗓 学期と所見の文字数</h3>
        <div class="radio-row"><label class="radio"><input type="radio" name="st-terms" value="3" ${
          Number(s.termSystem) !== 2 ? "checked" : ""
        }> 3学期制</label><label class="radio"><input type="radio" name="st-terms" value="2" ${
    Number(s.termSystem) === 2 ? "checked" : ""
  }> 2学期制（前期・後期）</label></div>
        <table class="data-table compact term-table"><thead><tr><th>学期</th><th>開始</th><th>終了</th></tr></thead><tbody>${s.terms
          .map(
            (t, i) =>
              `<tr><td>${esc(
                t.name
              )}</td><td><input type="date" class="term-start" data-i="${i}" value="${esc(
                t.start
              )}"></td><td><input type="date" class="term-end" data-i="${i}" value="${esc(
                t.end
              )}"></td></tr>`
          )
          .join("")}</tbody></table>
        <h4>所見の目標文字数</h4>
        <div class="target-grid">${SHOKEN_TYPES.map(
          (t) =>
            `<label>${esc(
              t.label
            )}<input type="number" class="st-target" data-key="${
              t.key
            }" value="${esc(
              s.targets[t.key] || t.target
            )}" min="20" step="10"></label>`
        ).join("")}</div>
        <div class="form-actions"><button type="button" class="btn btn-primary" id="st-save2">保存</button></div>
      </section>

      <section class="panel span-2">
        <h3>📚 教科・単元</h3>
        <div id="subj-editor"></div>
        <div class="add-inline"><input type="text" id="new-subject" placeholder="新しい教科・領域名（例：家庭）"><button type="button" class="btn btn-sm btn-secondary" id="add-subject">教科を追加</button></div>
      </section>

      <section class="panel">
        <h3>🏷 観点・タグ</h3>
        <div id="tag-editor"></div>
        <div class="add-inline"><input type="text" id="new-tag" placeholder="新しいタグ"><select id="new-tag-group">${TAG_GROUPS.map(
          (g) => `<option value="${g.key}">${esc(g.label)}</option>`
        ).join(
          ""
        )}</select><button type="button" class="btn btn-sm btn-secondary" id="add-tag">追加</button></div>
      </section>

      <section class="panel">
        <h3>⚡ 時短入力フレーズ</h3>
        <ul class="edit-list" id="phrase-editor"></ul>
        <div class="add-inline"><input type="text" id="new-memo-phrase" placeholder="よく使う書き出し・言い回し"><button type="button" class="btn btn-sm btn-secondary" id="add-memo-phrase">追加</button></div>
        <h3 style="margin-top:18px">📝 マイ文例（所見用）</h3>
        <ul class="edit-list" id="myphrase-editor"></ul>
      </section>
    </div>`;

  const saveInfo = () => {
    s.schoolYear = Number($("#st-year").value) || s.schoolYear;
    s.schoolName = $("#st-school").value.trim();
    s.grade = $("#st-grade").value;
    s.className = $("#st-class").value.trim();
    s.teacher = $("#st-teacher").value.trim();
    s.maskNames = $("#st-mask").checked;
    save();
    toast("保存しました");
    render();
  };
  $("#st-save").addEventListener("click", saveInfo);
  $$("input[name=st-terms]").forEach((r) =>
    r.addEventListener("change", () => {
      s.termSystem = Number(r.value);
      s.terms = makeTerms(s.schoolYear, s.termSystem);
      save();
      toast("学期の設定を変更しました");
      render();
    })
  );
  $("#st-save2").addEventListener("click", () => {
    $$(".term-start").forEach((i) => {
      s.terms[i.dataset.i].start = i.value;
    });
    $$(".term-end").forEach((i) => {
      s.terms[i.dataset.i].end = i.value;
    });
    $$(".st-target").forEach((i) => {
      s.targets[i.dataset.key] =
        Number(i.value) || shokenType(i.dataset.key).target;
    });
    save();
    toast("保存しました");
    render();
  });

  // 教科・単元
  const drawSubjects = () => {
    $("#subj-editor").innerHTML = subjectList()
      .map((sub) => {
        const used = state.episodes.filter((e) => e.subject === sub).length;
        return `<div class="subj-row"><div class="subj-name"><b>${esc(
          sub
        )}</b> <span class="muted small">${areaOf(sub)}${
          used ? `・${used}件` : ""
        }</span>
        <button type="button" class="link-btn small" data-subj-rename="${esc(
          sub
        )}">名前変更</button>${
          used
            ? ""
            : `<button type="button" class="link-btn danger small" data-subj-del="${esc(
                sub
              )}">削除</button>`
        }</div>
        <div class="unit-chips">${state.subjects[sub]
          .map(
            (u) =>
              `<span class="unit-chip">${esc(
                u
              )}<button type="button" data-unit-del="${esc(
                sub
              )}" data-unit="${esc(u)}" aria-label="${esc(
                u
              )}を削除">×</button></span>`
          )
          .join("")}
        <input type="text" class="unit-add" data-subj="${esc(
          sub
        )}" placeholder="＋単元（Enter）"></div></div>`;
      })
      .join("");
  };
  drawSubjects();
  $("#subj-editor").addEventListener("click", (e) => {
    const del = e.target.closest("[data-subj-del]"),
      ren = e.target.closest("[data-subj-rename]"),
      ud = e.target.closest("[data-unit-del]");
    if (del) {
      delete state.subjects[del.dataset.subjDel];
      save();
      drawSubjects();
    }
    if (ud) {
      const sub = ud.dataset.unitDel;
      state.subjects[sub] = state.subjects[sub].filter(
        (u) => u !== ud.dataset.unit
      );
      save();
      drawSubjects();
    }
    if (ren) {
      const old = ren.dataset.subjRename;
      const m = openModal({
        title: "教科名の変更",
        body: `<input type="text" id="ren-name" value="${esc(
          old
        )}"><p class="muted small">この教科の記録もすべて新しい名前に変わります。</p>`,
        footer: `<button type="button" class="btn btn-text" data-act="close-modal">キャンセル</button><button type="button" class="btn btn-primary" id="ren-ok">変更</button>`
      });
      $("#ren-ok", m).addEventListener("click", () => {
        const nn = $("#ren-name", m).value.trim();
        if (!nn || nn === old) {
          closeModal(true);
          return;
        }
        if (state.subjects[nn]) {
          toast("同じ名前の教科があります", { type: "error" });
          return;
        }
        const ns = {};
        Object.keys(state.subjects).forEach((k) => {
          ns[k === old ? nn : k] = state.subjects[k];
        });
        state.subjects = ns;
        state.episodes.forEach((x) => {
          if (x.subject === old) x.subject = nn;
        });
        state.shoken.forEach((x) => {
          if (x.subject === old) x.subject = nn;
        });
        save();
        closeModal(true);
        drawSubjects();
        toast("変更しました");
      });
    }
  });
  $("#subj-editor").addEventListener("keydown", (e) => {
    const inp = e.target.closest(".unit-add");
    if (!inp || e.key !== "Enter" || e.isComposing) return;
    const v = inp.value.trim();
    if (!v) return;
    const sub = inp.dataset.subj;
    if (!state.subjects[sub].includes(v)) state.subjects[sub].push(v);
    save();
    drawSubjects();
    const again = $(`.unit-add[data-subj="${CSS.escape(sub)}"]`);
    if (again) again.focus();
  });
  $("#add-subject").addEventListener("click", () => {
    const v = $("#new-subject").value.trim();
    if (!v) return;
    if (state.subjects[v]) {
      toast("すでにあります", { type: "error" });
      return;
    }
    const ns = {};
    Object.keys(state.subjects).forEach((k) => {
      if (k === "その他") ns[v] = ["共通"];
      ns[k] = state.subjects[k];
    });
    if (!ns[v]) ns[v] = ["共通"];
    state.subjects = ns;
    save();
    $("#new-subject").value = "";
    drawSubjects();
    toast(`「${v}」を追加しました`);
  });

  // タグ
  const drawTags = () => {
    $("#tag-editor").innerHTML = TAG_GROUPS.map(
      (g) =>
        `<div class="tag-group"><span class="tag-group-label">${esc(
          g.label
        )}</span><div class="unit-chips">${tagsOfGroup(g.key)
          .map((t) => {
            const n = state.episodes.filter((e) => e.tags.includes(t)).length;
            return `<span class="unit-chip">${esc(t)}${
              n ? `<small class="muted">${n}</small>` : ""
            }<button type="button" data-tag-del="${esc(t)}" aria-label="${esc(
              t
            )}を削除">×</button></span>`;
          })
          .join("")}</div></div>`
    ).join("");
  };
  drawTags();
  $("#tag-editor").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tag-del]");
    if (!b) return;
    const t = b.dataset.tagDel,
      n = state.episodes.filter((x) => x.tags.includes(t)).length;
    const doDel = () => {
      state.tags = state.tags.filter((x) => x.name !== t);
      state.episodes.forEach((x) => {
        x.tags = x.tags.filter((y) => y !== t);
      });
      save();
      drawTags();
      toast(`「${t}」を削除しました`);
    };
    if (n)
      confirmModal({
        title: "タグの削除",
        message: `「${t}」は${n}件の記録で使われています。記録からもこのタグを外して削除しますか？`,
        okLabel: "削除する",
        danger: true,
        onOk: doDel
      });
    else doDel();
  });
  $("#add-tag").addEventListener("click", () => {
    const v = $("#new-tag").value.trim();
    if (!v) return;
    if (state.tags.some((t) => t.name === v)) {
      toast("すでにあります", { type: "error" });
      return;
    }
    state.tags.push({ name: v, group: $("#new-tag-group").value });
    save();
    $("#new-tag").value = "";
    drawTags();
  });

  // フレーズ
  const drawPhrases = () => {
    $("#phrase-editor").innerHTML =
      state.memoPhrases
        .map(
          (p, i) =>
            `<li><span>${esc(
              p
            )}</span><button type="button" class="link-btn danger small" data-mp-del="${i}">削除</button></li>`
        )
        .join("") || `<li class="muted small">ありません</li>`;
    $("#myphrase-editor").innerHTML =
      state.myPhrases
        .map(
          (p) =>
            `<li><span>${esc(
              p.text
            )}</span><button type="button" class="link-btn danger small" data-act="myphrase-del" data-id="${
              p.id
            }">削除</button></li>`
        )
        .join("") ||
      `<li class="muted small">所見づくり画面の「文例」タブから登録できます</li>`;
  };
  drawPhrases();
  $("#phrase-editor").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mp-del]");
    if (!b) return;
    state.memoPhrases.splice(Number(b.dataset.mpDel), 1);
    save();
    drawPhrases();
  });
  $("#add-memo-phrase").addEventListener("click", () => {
    const v = $("#new-memo-phrase").value.trim();
    if (!v) return;
    state.memoPhrases.push(v);
    save();
    $("#new-memo-phrase").value = "";
    drawPhrases();
  });
  ui.refresh = () => drawPhrases();
};

// ---------- 起動 ----------
function init() {
  const res = load();
  buildNav();
  setupGlobalHandlers();
  setupTooltip();
  parseHash();
  render();
  if (res.migrated)
    toast(
      `以前のアプリのデータ（${res.migrated}件）を引き継ぎました。名簿も自動で作成しています。`,
      { duration: 7000 }
    );
  if (res.error)
    toast(
      "データの読み込みに失敗しました。「設定・データ」の「直前の状態に戻す」を試してください。",
      { type: "error", duration: 9000 }
    );
  // 別のタブで変更されたときは読み直す
  window.addEventListener("storage", (e) => {
    if (e.key === STORE_KEY && e.newValue) {
      try {
        normalizeState(JSON.parse(e.newValue));
        render();
      } catch (_) {
        /* noop */
      }
    }
  });
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", init);
else init();