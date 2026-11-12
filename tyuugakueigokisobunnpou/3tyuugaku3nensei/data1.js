// 中3ワールド：ステージ1〜6（関係代名詞〜間接疑問文）
// b=正解にする語句、d=まちがいの選択肢、t=つまずきタグ、h=ヒント
const STAGES = [
  {name:"関係代名詞（主格：who・which・that）",
   p:"2つの文を1つにまとめ、前の名詞を説明する働きをします。説明する文の主語の代わりになるとき、人には who、ものには which、どちらにも that を使います。<br>I have a friend who lives in Osaka.（大阪に住んでいる友だち）<br>This is the bus which goes to the station.（駅へ行くバス）",
   items:[
    {ja:"私には大阪に住んでいる友だちがいます。", en:"I have a friend who lives in Osaka.", b:"who", d:["which","whom"], t:"関係代名詞：主格 who（人）", h:"人を説明するときは who。"},
    {ja:"これは駅へ行くバスです。", en:"This is the bus which goes to the station.", b:"which", d:["who","whose"], t:"関係代名詞：主格 which（もの）", h:"ものを説明するときは which。"},
    {ja:"そこに立っている男の子は私の弟です。", en:"The boy that is standing there is my brother.", b:"that", d:["who","what"], t:"関係代名詞：主格 that", h:"that は人にもものにも使える。"},
    {ja:"私は英語を話せる人を探しています。", en:"I am looking for someone who can speak English.", b:"who", d:["which","what"], t:"関係代名詞：主格 who（人）", h:"someone（だれか）を説明するときは who。"},
    {ja:"東京に住んでいる人はたくさんいます。", en:"There are many people who live in Tokyo.", b:"who", d:["which","whose"], t:"関係代名詞：主格 who（人）", h:"people（人々）には who を使う。"},
    {ja:"私は走るのがとても速い犬を見ました。", en:"I saw a dog which runs very fast.", b:"which", d:["who","whom"], t:"関係代名詞：主格 which（もの）", h:"dog（動物）には which か that を使う。"}
   ]},
  {name:"関係代名詞（目的格：that・which）",
   p:"前の名詞が、説明する文の中で目的語（〜を）になるときも関係代名詞を使います。この場合、関係代名詞は省略できることが多いです。<br>This is the book (that) I bought yesterday.（私が昨日買った本）<br>目的格：that・which（ものに使う）、whom（人に使う・文章語）",
   items:[
    {ja:"これは私が昨日買った本です。", en:"This is the book that I bought yesterday.", b:"that", d:["who","what"], t:"関係代名詞：目的格 that", h:"「私が買った」と説明するときは that（省略もできる）。"},
    {ja:"母が作ったケーキはおいしかったです。", en:"The cake which my mother made was delicious.", b:"which", d:["who","whose"], t:"関係代名詞：目的格 which", h:"「母が作った」を説明する。which は省略もできる。"},
    {ja:"これは彼が撮った写真です。", en:"This is the picture that he took.", b:"that", d:["who","what"], t:"関係代名詞：目的格 that", h:"「彼が撮った」を説明する。that を入れるよ。"},
    {ja:"私が好きな歌手は日本人です。", en:"The singer that I like is Japanese.", b:"that", d:["who","what"], t:"関係代名詞：目的格 that", h:"人（singer）でも、目的語のときは that も使える。"},
    {ja:"私が買いたかった靴はあの店にあります。", en:"The shoes that I wanted to buy are in that shop.", b:"that", d:["who","whose"], t:"関係代名詞：目的格 that（省略できる）", h:"that は省略できることもある。"},
    {ja:"彼女が好きな映画は、とても有名です。", en:"The movie which she likes is very famous.", b:"which", d:["who","whose"], t:"関係代名詞：目的格 which", h:"映画（もの）には which か that を使う。"}
   ]},
  {name:"分詞（〜している・〜された）",
   p:"動詞の ing 形（現在分詞）や過去分詞を名詞のあとに置き、「〜している〜」「〜された〜」と説明します。<br>the girl playing the piano（ピアノを弾いている女の子）<br>the letter written in English（英語で書かれた手紙）",
   items:[
    {ja:"ピアノを弾いている女の子は私の妹です。", en:"The girl playing the piano is my sister.", b:"playing", d:["played","play"], t:"分詞：現在分詞（〜している）", h:"「〜している」は ing 形（現在分詞）。"},
    {ja:"窓のそばに立っている男の人は先生です。", en:"The man standing by the window is a teacher.", b:"standing", d:["stood","stand"], t:"分詞：現在分詞（〜している）", h:"stand（立つ）→ standing。"},
    {ja:"英語で書かれた手紙を見せてください。", en:"Please show me the letter written in English.", b:"written", d:["write","wrote"], t:"分詞：過去分詞（〜された）", h:"「〜された」は過去分詞（written）。"},
    {ja:"昨日盗まれた自転車を見つけました。", en:"I found the bike stolen yesterday.", b:"stolen", d:["steal","stole"], t:"分詞：過去分詞（不規則）", h:"steal の過去分詞は stolen。"},
    {ja:"教室で走っている生徒たちは元気です。", en:"The students running in the classroom are energetic.", b:"running", d:["ran","run"], t:"分詞：現在分詞（〜している）", h:"run → running（ingをつける）。"},
    {ja:"この町で作られたお皿は有名です。", en:"The dishes made in this town are famous.", b:"made", d:["make","makes"], t:"分詞：過去分詞（〜された）", h:"make の過去分詞は made。"}
   ]},
  {name:"too〜to・enough to（〜すぎて・十分〜だ）",
   p:"too ＋ 形容詞・副詞 ＋ to ＋ 動詞の原形で「〜すぎて…できない」。<br>形容詞・副詞 ＋ enough ＋ to ＋ 動詞の原形で「…するのに十分〜だ」。<br>This box is too heavy to carry.（重すぎて運べない）<br>He is old enough to drive.（運転できる年齢だ）",
   items:[
    {ja:"この箱は重すぎて運べません。", en:"This box is too heavy to carry.", b:"too", d:["very","enough"], t:"too〜to：〜すぎて", h:"too ＋ 形容詞 ＋ to ＋ 原形。「〜すぎて…できない」。"},
    {ja:"彼は運転できる年齢です。", en:"He is old enough to drive.", b:"enough", d:["too","very"], t:"enough to：十分〜だ", h:"enough は形容詞のあと。「〜するのに十分」。"},
    {ja:"その話は難しすぎて、私には理解できません。", en:"The story is too difficult for me to understand.", b:"too", d:["very","enough"], t:"too〜to：〜すぎて", h:"too difficult ... for me to understand で「私には難しすぎる」。"},
    {ja:"私はその問題を解くのに十分賢いです。", en:"I am smart enough to solve the problem.", b:"enough", d:["too","so"], t:"enough to：十分〜だ", h:"smart のあとに enough を置くよ。"},
    {ja:"今日は寒すぎて外で遊べません。", en:"It is too cold to play outside today.", b:"to play", d:["playing","played"], t:"too〜to：〜すぎて", h:"too cold のあとは to ＋ 原形。"},
    {ja:"彼女は十分背が高いので、その棚に手が届きます。", en:"She is tall enough to reach the shelf.", b:"to reach", d:["reaches","reaching"], t:"enough to：十分〜だ", h:"enough のあとは to ＋ 原形（reach）。"}
   ]},
  {name:"仮定法（もし〜なら…するのに）",
   p:"現実とちがうことや、ありえないことを仮定して話すときは「if ＋ 主語 ＋ 過去形 〜, 主語 ＋ would ＋ 動詞の原形」を使います。<br>If I were a bird, I could fly.（もし私が鳥なら、飛べるのに）<br>be動詞は主語に関係なく were を使うことが多いです。",
   items:[
    {ja:"もし私が鳥なら、空を飛べるのに。", en:"If I were a bird, I could fly.", b:"were", d:["was","am"], t:"仮定法：be動詞は were", h:"仮定法の be動詞は、主語が I でも were を使うことが多い。"},
    {ja:"もしお金があれば、新しいパソコンを買うのに。", en:"If I had money, I would buy a new computer.", b:"had", d:["have","has"], t:"仮定法：過去形（had）", h:"「もし〜なら」の動詞は過去形（had）。"},
    {ja:"もし雨が降っていなければ、散歩するのに。", en:"If it were not raining, we would take a walk.", b:"would", d:["will","can"], t:"仮定法：would＋原形", h:"結果の部分は would ＋ 原形。"},
    {ja:"もし私があなただったら、そうしないでしょう。", en:"If I were you, I would not do that.", b:"not", d:["no","don't"], t:"仮定法：would not", h:"「〜しないだろう」は would not。"},
    {ja:"もし時間があれば、あなたを手伝うのに。", en:"If I had time, I would help you.", b:"help", d:["helps","helping"], t:"仮定法：would＋原形", h:"would のあとは原形（help）。"},
    {ja:"もし私が魔法使いなら、世界を変えるのに。", en:"If I were a magician, I would change the world.", b:"change", d:["changes","changed"], t:"仮定法：would＋原形", h:"would のあとは原形（change）。"}
   ]},
  {name:"間接疑問文（〜かどうか・何が〜か）",
   p:"疑問詞のある疑問文が、ほかの文の中に入ると「疑問詞 ＋ 主語 ＋ 動詞」の順になります。<br>Do you know where he lives?（彼がどこに住んでいるか知っていますか）<br>I don't know what she wants.（彼女が何をほしいのか、私は知らない）<br>疑問文の語順（where does he live?）にしないのがポイントです。",
   items:[
    {ja:"彼がどこに住んでいるか知っていますか。", en:"Do you know where he lives?", b:"where", d:["what","who"], t:"間接疑問：疑問詞＋主語＋動詞", h:"間接疑問は「疑問詞＋主語＋動詞」の順。"},
    {ja:"彼女が何をほしいのか、私は知りません。", en:"I don't know what she wants.", b:"wants", d:["want","wanting"], t:"間接疑問：三単現の形", h:"she のときは wants（三単現の s）。"},
    {ja:"駅へ行く方法を教えてくれませんか。", en:"Can you tell me how I can get to the station?", b:"how", d:["what","where"], t:"間接疑問：how（方法）", h:"「どうやって」は how。"},
    {ja:"今、何時か知っていますか。", en:"Do you know what time it is?", b:"what time", d:["what day","what color"], t:"間接疑問：what time", h:"what time（何時）の形を入れる。"},
    {ja:"彼がいつ来るか、私にはわかりません。", en:"I don't know when he will come.", b:"when", d:["what","who"], t:"間接疑問：when（時）", h:"「いつ」は when。文の途中でも when のまま。"},
    {ja:"その人が誰か、知っていますか。", en:"Do you know who that man is?", b:"who", d:["what","whose"], t:"間接疑問：who（人）", h:"who（誰）のあとは「主語＋動詞」の順。"}
   ]}
];
