/* =====================================================================
   むんずかん（コレクション図鑑）のデータと集計
   ・単元カード：アプリをひらくとカードが増える（ひらいた回数でレアリティが上がる）
   ・人物カード：歴史アプリをひらくと、その時代の人物に会える
   ・雑学カード：雑学カードで集めたもの（生きもの・ことばなど）
   記録は、この端末の中だけに保存されます。
===================================================================== */
(function () {
  'use strict';
  // [時代アプリのid, 名前, ふりがな, アイコン, 説明]
  const P = [
    ['app-history-1', 'ハンムラビ王', 'はんむらびおう', 'fa-scale-balanced', 'バビロニア王国の王。「ハンムラビ法典」という法律をつくった。'],
    ['app-history-1', 'ツタンカーメン', 'つたんかーめん', 'fa-mask', 'エジプトの若い王。黄金のマスクで世界じゅうに知られている。'],
    ['app-history-1', 'クフ王', 'くふおう', 'fa-mountain', 'エジプトの王。いちばん大きなピラミッドをつくらせた。'],
    ['app-history-2', '卑弥呼', 'ひみこ', 'fa-crown', '邪馬台国の女王。中国に使いを送り、国をおさめた。'],
    ['app-history-3', '聖徳太子', 'しょうとくたいし', 'fa-scroll', '十七条の憲法や冠位十二階で、天皇中心の国づくりを進めた。'],
    ['app-history-3', '小野妹子', 'おののいもこ', 'fa-ship', '遣隋使として、海をこえて中国（隋）に行った。'],
    ['app-history-3', '中大兄皇子', 'なかのおおえのおうじ', 'fa-landmark', '中臣鎌足とともに大化の改新を進めた。のちの天智天皇。'],
    ['app-history-3', '中臣鎌足', 'なかとみのかまたり', 'fa-handshake', '中大兄皇子とともに蘇我氏をたおした。のちに藤原の姓をもらった。'],
    ['app-history-4', '紫式部', 'むらさきしきぶ', 'fa-book-open', '長い物語「源氏物語」を書いた。'],
    ['app-history-4', '清少納言', 'せいしょうなごん', 'fa-feather-pointed', '随筆「枕草子」を書いた。'],
    ['app-history-4', '藤原道長', 'ふじわらのみちなが', 'fa-chess-king', '娘を天皇のきさきにして、大きな力をもった貴族。'],
    ['app-history-5', '源頼朝', 'みなもとのよりとも', 'fa-shield-halved', '鎌倉幕府を開いた、はじめての将軍。'],
    ['app-history-5', '北条政子', 'ほうじょうまさこ', 'fa-person-dress', '頼朝の妻。承久の乱で武士たちをはげました。'],
    ['app-history-5', '北条時宗', 'ほうじょうときむね', 'fa-wind', '元の大軍（元寇）をしりぞけた執権。'],
    ['app-history-5', '運慶', 'うんけい', 'fa-hammer', '東大寺の金剛力士像などをつくった仏師。'],
    ['app-history-6', '足利義満', 'あしかがよしみつ', 'fa-gopuram', '室町幕府の3代将軍。金閣を建てた。'],
    ['app-history-6', '足利義政', 'あしかがよしまさ', 'fa-vihara', '室町幕府の8代将軍。銀閣を建てた。'],
    ['app-history-6', '雪舟', 'せっしゅう', 'fa-paintbrush', '水墨画を大きく発展させた画家。'],
    ['app-history-6', '世阿弥', 'ぜあみ', 'fa-masks-theater', '父の観阿弥とともに、能を大成させた。'],
    ['app-history-7', '織田信長', 'おだのぶなが', 'fa-fire', '桶狭間の戦いで勝ち、楽市・楽座で城下町をにぎわせた。'],
    ['app-history-7', '豊臣秀吉', 'とよとみひでよし', 'fa-sun', '天下を統一し、太閤検地や刀狩を行った。'],
    ['app-history-7', '千利休', 'せんのりきゅう', 'fa-mug-hot', '「わび茶」を完成させた茶人。'],
    ['app-history-8', '徳川家康', 'とくがわいえやす', 'fa-chess-rook', '江戸幕府を開いた、はじめての将軍。'],
    ['app-history-8', '徳川家光', 'とくがわいえみつ', 'fa-route', '3代将軍。参勤交代を制度にし、鎖国の体制をかためた。'],
    ['app-history-9', '歌川広重', 'うたがわひろしげ', 'fa-image', '「東海道五十三次」をえがいた浮世絵師。'],
    ['app-history-9', '葛飾北斎', 'かつしかほくさい', 'fa-water', '「富嶽三十六景」をえがいた浮世絵師。'],
    ['app-history-9', '杉田玄白', 'すぎたげんぱく', 'fa-book-medical', '前野良沢らと「解体新書」を出版した蘭学者。'],
    ['app-history-9', '本居宣長', 'もとおりのりなが', 'fa-book', '「古事記伝」を書き、国学を大成させた。'],
    ['app-history-10', 'ペリー', 'ぺりー', 'fa-anchor', '黒船をひきいて来航し、日本に開国をせまったアメリカ人。'],
    ['app-history-10', '西郷隆盛', 'さいごうたかもり', 'fa-chess-knight', '薩摩藩出身。明治維新の中心になった人物。'],
    ['app-history-10', '福沢諭吉', 'ふくざわゆきち', 'fa-graduation-cap', '「学問のすゝめ」を書き、新しい学問を広めた。'],
    ['app-history-11', '板垣退助', 'いたがきたいすけ', 'fa-bullhorn', '自由民権運動をリードし、国会を開くことをうったえた。'],
    ['app-history-11', '伊藤博文', 'いとうひろぶみ', 'fa-file-signature', '初代内閣総理大臣。大日本帝国憲法づくりを進めた。'],
    ['app-history-11', '陸奥宗光', 'むつむねみつ', 'fa-gavel', '領事裁判権をなくす条約改正に成功した外務大臣。'],
    ['app-history-11', '小村寿太郎', 'こむらじゅたろう', 'fa-coins', '関税自主権を取りもどす条約改正に成功した外務大臣。']
  ];
  const LEARN = /^(math|kokugo|social|history|eigo|game|grade)/;
  const RAR = [['normal', 'ノーマル', '#94a3b8'], ['silver', 'シルバー', '#cbd5e1'], ['gold', 'ゴールド', '#fbbf24'], ['platinum', 'プラチナ', '#67e8f9']];
  const rarOf = n => n >= 30 ? 3 : n >= 10 ? 2 : n >= 3 ? 1 : 0;

  function all() {
    const vis = LAB.load('mun_visits', {}), lab = LAB.get(), out = [];
    const cards = window.LAB_CARDS || [], byId = {};
    cards.forEach(c => { byId[c.id] = c; });
    cards.filter(c => LEARN.test(c.cat)).forEach(c => {
      const n = (vis[c.id] || {}).n || 0;
      out.push({ key: 'u:' + c.id, kind: 'unit', shelf: '単元', sub: c.label, title: c.title, ic: (c.icon || 'fa-solid fa-star').replace('fa-solid ', ''), desc: c.desc || '', href: c.href, got: n > 0, n, rar: n > 0 ? rarOf(n) : -1, hint: `「${c.title}」をひらくと、このカードが手に入るよ。` });
    });
    P.forEach(p => {
      const app = byId[p[0]], n = app ? ((vis[p[0]] || {}).n || 0) : 0;
      out.push({ key: 'p:' + p[1], kind: 'person', shelf: '人物', sub: app ? app.title : '歴史', title: p[1], read: p[2], ic: p[3], desc: p[4], href: app ? app.href : '', got: n > 0, n, rar: n > 0 ? rarOf(n) : -1, hint: app ? `歴史アプリ「${app.title}」をひらくと会えるよ。` : '' });
    });
    const Z = (window.LAB_DATA && window.LAB_DATA.ZATSU) || [], seen = new Set((lab.zatsu && lab.zatsu.seen) || []);
    Z.forEach(z => {
      const g = seen.has(z.id);
      out.push({ key: 'z:' + z.id, kind: 'zatsu', shelf: z.cat, sub: '雑学カード No.' + z.id, title: z.t, ic: z.ic, desc: z.d, href: '', got: g, n: g ? 1 : 0, rar: g ? 0 : -1, hint: '「今日の雑学カード」で集めよう。' });
    });
    return out;
  }
  function stats() {
    const a = all(), r = { total: a.length, got: 0, unit: [0, 0], person: [0, 0], zatsu: [0, 0] };
    a.forEach(x => { r[x.kind][1]++; if (x.got) { r.got++; r[x.kind][0]++; } });
    return r;
  }
  function count() { try { return stats().got; } catch (e) { return 0; } }
  window.LAB_ZK = { all, stats, count, RAR, rarOf, PEOPLE: P };
})();
