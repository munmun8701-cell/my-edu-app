// 中1ワールド：ステージ1〜7（be動詞〜疑問詞）
// b=正解にする語句、d=まちがいの選択肢、t=つまずきタグ、h=ヒント
const STAGES = [
  {name:"be動詞（肯定文）",
   p:"「〜は…です」はbe動詞（am・is・are）で表します。主語によって使い分けるのがポイントです。<br>I → am ／ you・we・they・複数 → are ／ he・she・名前・this・that → is",
   items:[
    {ja:"私は生徒です。", en:"I am a student.", b:"am", d:["is","are"], t:"be：主語とのペア", h:"主語が I（私）のときは am を使うよ。"},
    {ja:"あなたは先生です。", en:"You are a teacher.", b:"are", d:["am","is"], t:"be：主語とのペア", h:"主語が you（あなた）のときは are。"},
    {ja:"彼はサッカーの選手です。", en:"He is a soccer player.", b:"is", d:["am","are"], t:"be：主語とのペア", h:"he（彼）・she（彼女）・名前・1つのものには is。"},
    {ja:"私たちは友だちです。", en:"We are friends.", b:"are", d:["is","am"], t:"be：主語とのペア", h:"we（私たち）のときは are。"},
    {ja:"これはペンです。", en:"This is a pen.", b:"is", d:["are","am"], t:"be：主語とのペア", h:"this（これ）は1つなので is。"},
    {ja:"私の名前はさくらです。", en:"My name is Sakura.", b:"is", d:["am","are"], t:"be：主語とのペア", h:"name（名前）は1つなので is。"}
   ]},
  {name:"be動詞（否定文・疑問文）",
   p:"否定文は be動詞のあとに not を入れます（I am not 〜）。<br>疑問文は be動詞を文のはじめに出します（Are you 〜？）。<br>答えるときは Yes, I am. ／ No, I am not. のように答えます。",
   items:[
    {ja:"私は医者ではありません。", en:"I am not a doctor.", b:"not", d:["no","don't"], t:"be：否定文（not）", h:"be動詞のあとに not を入れると「〜ではない」。"},
    {ja:"彼女は忙しくありません。", en:"She is not busy.", b:"not", d:["no","doesn't"], t:"be：否定文（not）", h:"is のあとに not。no は使わないよ。"},
    {ja:"あなたは眠いですか。", en:"Are you sleepy?", b:"Are", d:["Is","Do"], t:"be：疑問文の形", h:"疑問文は be動詞を文のはじめに。you には Are。"},
    {ja:"それはあなたの本ですか。", en:"Is that your book?", b:"Is", d:["Are","Do"], t:"be：疑問文の形", h:"that（それ）は1つなので Is。"},
    {ja:"これはあなたのかばんですか。", en:"Is this your bag?", b:"Is", d:["Are","Do"], t:"be：疑問文の形", h:"this（これ）は1つなので Is を文のはじめに。"},
    {ja:"これはあなたのかさではありません。", en:"This is not your umbrella.", b:"not", d:["no","don't"], t:"be：否定文（not）", h:"be動詞のあとに not を入れるよ。"}
   ]},
  {name:"代名詞（I・you・he・she…）",
   p:"代名詞は、役割によって形が変わります。<br>主語（〜は）：I・you・he・she・it・we・they<br>目的語（〜を・〜に）：me・you・him・her・it・us・them<br>所有（〜の）：my・your・his・her・our・their",
   items:[
    {ja:"私はねこが好きです。", en:"I like cats.", b:"I", d:["Me","My"], t:"代名詞：主語の形", h:"「〜は」は主語の形。I（私は）を使うよ。"},
    {ja:"彼女は私の友だちです。", en:"She is my friend.", b:"She", d:["Her","He"], t:"代名詞：主語の形", h:"「彼女は」は She。"},
    {ja:"私に本をください。", en:"Give me a book.", b:"me", d:["my","I"], t:"代名詞：目的語の形", h:"「〜に・〜を」は目的語の形。me（私に）。"},
    {ja:"これは彼のかばんです。", en:"This is his bag.", b:"his", d:["him","he"], t:"代名詞：所有の形", h:"「彼の〜」は his。him は「彼を・彼に」。"},
    {ja:"私たちは彼女が大好きです。", en:"We love her.", b:"her", d:["she","hers"], t:"代名詞：目的語の形", h:"「彼女を」は her。"},
    {ja:"あなたの名前は何ですか。", en:"What is your name?", b:"your", d:["you","yours"], t:"代名詞：所有の形", h:"「あなたの」は your。you（あなたは）とは形がちがうよ。"}
   ]},
  {name:"一般動詞（肯定文）",
   p:"be動詞以外の動詞を「一般動詞」といいます（play・like・study など）。<br>I・you・we・they のときは、辞書の形（原形）のまま使います。<br>he・she など（三単現）は次のステージで学びます。",
   items:[
    {ja:"私はテニスをします。", en:"I play tennis.", b:"play", d:["plays","playing"], t:"一般動詞：原形で使う", h:"I（私）のときは原形（play）のまま。"},
    {ja:"私たちは毎日英語を勉強します。", en:"We study English every day.", b:"study", d:["studies","studying"], t:"一般動詞：原形で使う", h:"we（私たち）は原形のまま。study（勉強する）。"},
    {ja:"あなたは犬が好きです。", en:"You like dogs.", b:"like", d:["likes","liking"], t:"一般動詞：原形で使う", h:"you（あなた）のときは like（好き）のまま。"},
    {ja:"私たちは学校で昼ごはんを食べます。", en:"We eat lunch at school.", b:"eat", d:["eats","eating"], t:"一般動詞：原形で使う", h:"we のときは原形の eat。"},
    {ja:"あなたは日本語を話します。", en:"You speak Japanese.", b:"speak", d:["speaks","speaking"], t:"一般動詞：原形で使う", h:"you のときは原形の speak。"},
    {ja:"私たちはサッカーが好きです。", en:"We like soccer.", b:"like", d:["likes","liking"], t:"一般動詞：原形で使う", h:"we（私たち）のときは like。"}
   ]},
  {name:"一般動詞（否定文・疑問文）",
   p:"否定文：主語のあとに don't（do not）を入れ、動詞は原形のまま。<br>疑問文：文のはじめに Do を置きます。答えは Yes, I do. ／ No, I don't. <br>※ he・she など（三単現）は doesn't・Does を使います。",
   items:[
    {ja:"私はコーヒーを飲みません。", en:"I don't drink coffee.", b:"don't", d:["not","no"], t:"一般動詞：否定文（don't）", h:"一般動詞の否定は don't（do not）＋原形。"},
    {ja:"あなたは英語を話しますか。", en:"Do you speak English?", b:"Do", d:["Does","Are"], t:"一般動詞：疑問文（Do）", h:"一般動詞の疑問文は Do を文のはじめに。you には Do。"},
    {ja:"彼女は野球が好きではありません。", en:"She doesn't like baseball.", b:"doesn't", d:["don't","isn't"], t:"一般動詞：否定文（doesn't）", h:"she のときは doesn't（does not）。"},
    {ja:"私たちはこの町に住んでいません。", en:"We don't live in this town.", b:"don't", d:["doesn't","not"], t:"一般動詞：否定文（don't）", h:"we のときは don't（do not）。"},
    {ja:"彼は毎日走りますか。", en:"Does he run every day?", b:"Does", d:["Do","Is"], t:"一般動詞：疑問文（Does）", h:"he のときは Does を文のはじめに。"},
    {ja:"あなたはこの歌を知っていますか。", en:"Do you know this song?", b:"know", d:["knows","knowing"], t:"一般動詞：疑問文（Do）", h:"Do のあとは動詞の原形 know。"}
   ]},
  {name:"三単現（sやesをつける）",
   p:"主語が he・she・it・名前など（3人称・単数）で、現在の文のときは動詞に s・es をつけます。<br>例：play → plays ／ watch → watches（ch・sh・s・x・o で終わる語は es）<br>否定文・疑問文では does（doesn't）のあとの動詞は原形に戻します。",
   items:[
    {ja:"彼女は毎朝ピアノを練習します。", en:"She practices the piano every morning.", b:"practices", d:["practice","practiced"], t:"三単現：s・esのつけ方", h:"practice は e で終わるので s だけをつけるよ。"},
    {ja:"ケンジは犬を飼っています。", en:"Kenji has a dog.", b:"has", d:["have","having"], t:"三単現：has（不規則）", h:"has（持っている・飼っている）は三単現の形。"},
    {ja:"お父さんは毎日テレビを見ます。", en:"My father watches TV every day.", b:"watches", d:["watch","watchs"], t:"三単現：s・esのつけ方", h:"watch は ch で終わるので es をつける。"},
    {ja:"彼はバスで学校に行きません。", en:"He doesn't go to school by bus.", b:"go", d:["goes","going"], t:"三単現：否定文・疑問文のあと", h:"doesn't のあとは動詞の原形（go）。"},
    {ja:"あの男の子は速く走ります。", en:"That boy runs fast.", b:"runs", d:["run","ran"], t:"三単現：s・esのつけ方", h:"he・she・名前など1人のときは s をつける。"},
    {ja:"彼女はいつ宿題をしますか。", en:"When does she do her homework?", b:"do", d:["does","did"], t:"三単現：否定文・疑問文のあと", h:"疑問文でも does のあとは原形（do）。"}
   ]},
  {name:"疑問詞（what・where・who…）",
   p:"「何」What、「どこ」Where、「誰」Who、「いつ」When、「どうやって」How などを文のはじめに置きます。<br>What time（何時）のように、疑問詞のあとに名詞が続くこともあります。<br>疑問詞のあとは、疑問文の形（do you 〜 など）が続きます。",
   items:[
    {ja:"これは何ですか。", en:"What is this?", b:"What", d:["Who","Where"], t:"疑問詞：What", h:"「何」は what。"},
    {ja:"あなたはどこに住んでいますか。", en:"Where do you live?", b:"Where", d:["What","When"], t:"疑問詞：Where", h:"「どこ」は where。"},
    {ja:"彼女は誰ですか。", en:"Who is she?", b:"Who", d:["What","Where"], t:"疑問詞：Who", h:"「誰」は who。"},
    {ja:"あなたの誕生日はいつですか。", en:"When is your birthday?", b:"When", d:["How","Who"], t:"疑問詞：When", h:"「いつ」は when。"},
    {ja:"学校へはどうやって行きますか。", en:"How do you go to school?", b:"How", d:["Who","What"], t:"疑問詞：How", h:"「どうやって」は how。"},
    {ja:"あなたは何時に寝ますか。", en:"What time do you go to bed?", b:"What time", d:["What day","What color"], t:"疑問詞：What＋名詞", h:"「何時」は What time。時刻をたずねるよ。"}
   ]}
];
