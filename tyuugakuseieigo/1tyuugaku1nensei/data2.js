// 中1ワールド：ステージ8〜13（命令文〜be going to）
STAGES.push(
  {name:"命令文・Let's",
   p:"「〜しなさい・〜してください」は動詞の原形で文をはじめます（Sit down.）。<br>「〜しないで」は Don't ＋ 原形。<br>「〜しましょう」は Let's ＋ 原形（Let's go.）。",
   items:[
    {ja:"座りなさい。", en:"Sit down.", b:"Sit", d:["Sits","Sitting"], t:"命令文：原形ではじめる", h:"命令文は動詞の原形ではじめるよ。sit（座る）。"},
    {ja:"静かにしなさい。", en:"Be quiet.", b:"Be", d:["Is","Are"], t:"命令文：Be", h:"「〜でいなさい」は Be で始める。"},
    {ja:"ドアを開けてください。", en:"Open the door.", b:"Open", d:["Opens","Opened"], t:"命令文：原形ではじめる", h:"open（開ける）の原形で始める。"},
    {ja:"ここで走らないでください。", en:"Don't run here.", b:"Don't", d:["Not","No"], t:"命令文：Don't", h:"「〜しないで」は Don't ＋ 原形。"},
    {ja:"いっしょに歌いましょう。", en:"Let's sing together.", b:"Let's", d:["Let","Lets"], t:"命令文：Let's", h:"Let's ＝ Let us（〜しましょう）。"},
    {ja:"テレビを消してください。", en:"Turn off the TV.", b:"Turn off", d:["Turns off","Turning off"], t:"命令文：原形ではじめる", h:"turn off（消す）の原形で始める。"}
   ]},
  {name:"a/an・some・複数形",
   p:"数えられる名詞（1つ・2つと数えるもの）には a・an をつけます。母音（a・i・u・e・o の音）で始まる語は an。<br>2つ以上は複数形。sをつける（dog → dogs）、esをつける（bus → buses）、不規則（child → children）があります。<br>some は「いくつかの」の意味で、複数形の前に使います。",
   items:[
    {ja:"私はりんごを1つ持っています。", en:"I have an apple.", b:"an", d:["a","the"], t:"a/an：母音の前", h:"apple は母音で始まるので an。"},
    {ja:"私は一冊の本を持っています。", en:"I have a book.", b:"a", d:["an","some"], t:"a/an：子音の前", h:"book は子音で始まるので a。"},
    {ja:"私は犬を3匹飼っています。", en:"I have three dogs.", b:"dogs", d:["dog","dogses"], t:"複数形：sをつける", h:"2つ以上は dog → dogs（sをつける）。"},
    {ja:"箱の中にバスが2台あります。", en:"There are two buses in the box.", b:"buses", d:["bus","buss"], t:"複数形：esをつける", h:"bus は s で終わるので es（buses）。"},
    {ja:"私はいくつかのクッキーがほしいです。", en:"I want some cookies.", b:"some", d:["a","an"], t:"some（いくつかの）", h:"some は「いくつかの」。複数形の前に使う。"},
    {ja:"私は子どもが好きです。", en:"I like children.", b:"children", d:["childs","childrens"], t:"複数形：不規則", h:"child（子ども）の複数形は不規則に children。"}
   ]},
  {name:"現在進行形（be＋ing）",
   p:"「今〜している」は be動詞（am・is・are）＋動詞ing で表します。<br>ingのつけ方：read → reading ／ eat → eating ／ run → running（最後の字を重ねる）<br>否定文は be動詞のあとに not、疑問文は be動詞を主語の前に出します。",
   items:[
    {ja:"私は今、宿題をしています。", en:"I am doing my homework now.", b:"doing", d:["do","does"], t:"進行形：be＋ing", h:"今〜している＝be動詞＋ing。do → doing。"},
    {ja:"彼女は今、本を読んでいます。", en:"She is reading a book.", b:"reading", d:["read","reads"], t:"進行形：ingのつけ方", h:"read → reading（ingをつける）。"},
    {ja:"私たちは今、ご飯を食べています。", en:"We are eating dinner.", b:"eating", d:["eat","eats"], t:"進行形：ingのつけ方", h:"eat → eating（ingをつける）。"},
    {ja:"あなたは何をしていますか。", en:"What are you doing?", b:"are", d:["is","do"], t:"進行形：疑問文", h:"疑問文は be動詞を主語の前に。you には are。"},
    {ja:"彼は泳いでいません。", en:"He is not swimming.", b:"not", d:["no","don't"], t:"進行形：否定文", h:"進行形の否定文は be動詞のあとに not。"},
    {ja:"彼らは走っています。", en:"They are running.", b:"running", d:["run","runs"], t:"進行形：ingのつけ方", h:"run は文字を重ねて running。"}
   ]},
  {name:"can（〜できる）",
   p:"「〜できる」は can で表します。<br>can のあとは動詞の原形。主語が変わっても形は変えません（She can play）。<br>否定文は cannot（can't）、疑問文は Can を文のはじめに置きます。答えは Yes, I can. ／ No, I can't.",
   items:[
    {ja:"私は泳ぐことができます。", en:"I can swim.", b:"can", d:["is","do"], t:"can：原形", h:"can（〜できる）のあとは動詞の原形。"},
    {ja:"彼女はピアノを弾くことができます。", en:"She can play the piano.", b:"play", d:["plays","playing"], t:"can：原形", h:"can のあとは主語が変わっても原形（play）。"},
    {ja:"あなたは英語を話せますか。", en:"Can you speak English?", b:"Can", d:["Do","Are"], t:"can：疑問文", h:"疑問文は Can を文のはじめに。"},
    {ja:"私はこの漢字を読めません。", en:"I cannot read this kanji.", b:"cannot", d:["don't","can"], t:"can：否定文（cannot）", h:"can の否定は cannot（can't）。"},
    {ja:"私は料理がじょうずです。", en:"I can cook well.", b:"well", d:["good","fast"], t:"can：副詞（well）", h:"well（じょうずに）は動詞のあとに置くよ。"},
    {ja:"あなたは何ができますか。", en:"What can you do?", b:"can", d:["do","is"], t:"can：疑問詞＋can", h:"can（〜できる）は疑問詞のあとに置くよ。"}
   ]},
  {name:"過去形（was/were・-ed）",
   p:"昨日・去年など過去のことは、動詞を過去の形にします。<br>be動詞：am・is → was ／ are → were<br>一般動詞：規則動詞は ed（play → played）。不規則動詞は形をおぼえよう（go → went、eat → ate、see → saw）。",
   items:[
    {ja:"昨日は晴れでした。", en:"It was sunny yesterday.", b:"was", d:["is","were"], t:"過去：be動詞（was）", h:"昨日など過去のことは be動詞を was に。"},
    {ja:"私たちは去年、東京にいました。", en:"We were in Tokyo last year.", b:"were", d:["was","are"], t:"過去：be動詞（were）", h:"we（私たち）の過去は were。"},
    {ja:"私は昨日、宿題を終えました。", en:"I finished my homework yesterday.", b:"finished", d:["finish","finishes"], t:"過去：ed（規則動詞）", h:"finish → finished（規則動詞はedをつける）。"},
    {ja:"私は昨日、映画を見ました。", en:"I watched a movie yesterday.", b:"watched", d:["watch","watching"], t:"過去：ed（規則動詞）", h:"watch → watched（edをつける）。"},
    {ja:"私は今朝、朝ごはんを食べました。", en:"I ate breakfast this morning.", b:"ate", d:["eated","eat"], t:"過去：不規則動詞", h:"eat（食べる）の過去は不規則に ate。"},
    {ja:"彼は先週、東京へ行きました。", en:"He went to Tokyo last week.", b:"went", d:["goed","goes"], t:"過去：不規則動詞", h:"go（行く）の過去は不規則に went。"}
   ]},
  {name:"be going to（未来）",
   p:"「〜するつもり・〜する予定」は be going to ＋ 動詞の原形で表します。<br>I am going to 〜（私は〜するつもりです）。She is going to 〜（彼女は〜する予定です）。<br>否定文は be動詞のあとに not、疑問文は be動詞を主語の前に出します。",
   items:[
    {ja:"私は明日、友だちと遊ぶつもりです。", en:"I am going to play with my friend tomorrow.", b:"going to", d:["will","goes to"], t:"未来：be going to の形", h:"be going to ＋ 動詞の原形で「〜するつもり」。"},
    {ja:"彼女は来週、日本を訪れる予定です。", en:"She is going to visit Japan next week.", b:"visit", d:["visits","visiting"], t:"未来：be going to の形", h:"be going to のあとは原形の visit。"},
    {ja:"明日は雨が降るでしょう。", en:"It is going to rain tomorrow.", b:"going to", d:["will","goes to"], t:"未来：be going to の形", h:"It is going to rain.（雨が降るでしょう）。will は be動詞と一緒に使わないよ。"},
    {ja:"私たちは来年、英語を勉強するつもりです。", en:"We are going to study English next year.", b:"study", d:["studied","studying"], t:"未来：be going to の形", h:"be going to のあとは原形の study。"},
    {ja:"あなたは今週末、何をするつもりですか。", en:"What are you going to do this weekend?", b:"are", d:["do","will"], t:"未来：疑問文", h:"疑問文は be動詞（Are）を主語の前に出す。"},
    {ja:"彼は今夜、勉強しないつもりです。", en:"He is not going to study tonight.", b:"not", d:["no","doesn't"], t:"未来：否定文", h:"否定文は be動詞のあとに not。"}
   ]}
);
