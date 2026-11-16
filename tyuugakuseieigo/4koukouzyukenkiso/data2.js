// 高校受験：ステージ3〜4（不定詞・動名詞、関係代名詞・分詞）
STAGES.push(
  {name:"不定詞・動名詞（to ＋ 原形 ／ ing）",
   p:"不定詞（to ＋ 原形）は「〜すること」（名詞）、「〜するための」（副詞）、「〜すべき」（名詞のあとで説明）の3つの働きがあります。動名詞（ing）は「〜すること」で、enjoy・finish・stop などの後ろに置きます。<br>want to ／ hope to ／ decide to ／ enjoy ＋ ing ／ stop ＋ ing（〜するのをやめる）",
   items:[
    {ja:"私は将来、医者になりたいです。", en:"I want to be a doctor in the future.", b:"to", d:["for","of"], t:"不定詞：want to＋原形", h:"want のあとは to ＋ 原形。", lv:1},
    {ja:"私は音楽を聞くことが好きです。", en:"I enjoy listening to music.", b:"listening", d:["listen","listens"], t:"動名詞：enjoy＋ing", h:"enjoy のあとは ing の形。", lv:1},
    {ja:"彼は新しい自転車を買うことに決めました。", en:"He decided to buy a new bike.", b:"to", d:["for","of"], t:"不定詞：decide to＋原形", h:"decide のあとは to ＋ 原形。", lv:1},
    {ja:"泳ぐことは楽しいです。", en:"Swimming is fun.", b:"Swimming", d:["Swim","Swims"], t:"動名詞：主語", h:"主語の「〜すること」は ing。", lv:1},
    {ja:"彼女は窓を閉めるのをやめました。", en:"She stopped closing the window.", b:"closing", d:["close","to close"], t:"動名詞：stop＋ing", h:"stop のあとは ing（〜するのをやめる）。", lv:1},

    {ja:"私は勉強するために図書館へ行きました。", en:"I went to the library to study.", b:"to study", d:["studied","studying"], t:"不定詞：目的（〜するために）", h:"「〜するために」は to ＋ 原形。", lv:2},
    {ja:"彼は、いつかアメリカで働くことを希望しています。", en:"He hopes to work in America someday.", b:"to", d:["for","of"], t:"不定詞：hope to＋原形", h:"hope のあとは to ＋ 原形。", lv:2},
    {ja:"私は読む本を1冊探しています。", en:"I am looking for a book to read.", b:"to read", d:["reads","reading"], t:"不定詞：名詞のあと（〜するべき）", h:"a book のあとに to read（読むための本）。", lv:2},
    {ja:"私の夢は世界中を旅することです。", en:"My dream is to travel around the world.", b:"to travel", d:["travels","traveling"], t:"不定詞：名詞の働き（〜すること）", h:"「〜すること」は to ＋ 原形。", lv:2},
    {ja:"彼は、宿題を終えることを忘れました。", en:"He forgot to finish his homework.", b:"to finish", d:["finishing","finished"], t:"不定詞：forget to＋原形", h:"forget to ＋ 原形は「〜するのを忘れる」。", lv:2},

    {ja:"私は英語を話せるようになりたいです。", en:"I want to be able to speak English.", b:"to speak", d:["speaking","spoke"], t:"不定詞：並べかえ（to speak）", h:"be able to ＋ 原形（〜できる）。", lv:3},
    {ja:"私は友だちと映画を見ることを楽しみにしています。", en:"I look forward to seeing a movie with my friends.", b:"seeing", d:["see","to see"], t:"動名詞：look forward to ＋ ing", h:"to は前置詞なので、あとは ing。", lv:3},
    {ja:"彼女は、その本を読み終えました。", en:"She finished reading the book.", b:"reading", d:["read","to read"], t:"動名詞：finish＋ing", h:"finish のあとは ing。", lv:3},
    {ja:"私は、その質問に答える方法を知りません。", en:"I don't know how to answer the question.", b:"how", d:["what","when"], t:"不定詞：疑問詞＋to＋原形", h:"how to ＋ 原形で「〜する方法」。", lv:3},
    {ja:"私は、あなたを手伝うために来ました。", en:"I came here to help you.", b:"to help", d:["helping","helped"], t:"不定詞：目的（〜するために）", h:"「〜するために」は to ＋ 原形。", lv:3},

    {ja:"私は、彼にまた会えることを楽しみにしています。", en:"I am looking forward to seeing him again.", alt:["I look forward to seeing him again."], b:"seeing", d:["see","to see"], t:"動名詞：look forward to ＋ ing", h:"look forward to ＋ ing（〜することを楽しみにする）。", lv:4},
    {ja:"彼は英語を話す機会を得ました。", en:"He had a chance to speak English.", alt:["He got a chance to speak English."], b:"to speak", d:["speaking","speaks"], t:"不定詞：名詞のあと（〜する）", h:"a chance のあとに to ＋ 原形。", lv:4},
    {ja:"私は、その試合を見るのをやめました。", en:"I stopped watching the game.", alt:["I stopped watching the game for a while."], b:"watching", d:["watch","watched"], t:"動名詞：stop＋ing", h:"stop のあとは ing（〜するのをやめる）。", lv:4},
    {ja:"この本は読む価値があります。", en:"This book is worth reading.", alt:["This book is worth reading again."], b:"reading", d:["read","to read"], t:"動名詞：be worth ＋ ing", h:"be worth ＋ ing（〜する価値がある）。", lv:4},
    {ja:"私は、いつ出発するか決めました。", en:"I decided when to leave.", alt:["I have decided when to leave."], b:"when", d:["what","how"], t:"不定詞：疑問詞＋to＋原形", h:"when to ＋ 原形で「いつ〜するか」。", lv:4},

    {ja:"彼は、私に手紙を書くように頼みました。", en:"He asked me to write a letter.", alt:["He asked me to write him a letter."], b:"to write", d:["writing","written"], t:"不定詞：ask＋人＋to＋原形", h:"ask ＋ 人 ＋ to ＋ 原形（〜するように頼む）。", lv:5},
    {ja:"私は、ピアノを弾くことが上手になりたいです。（英語で）", en:"I want to become good at playing the piano.", alt:["I want to be good at playing the piano."], b:"playing", d:["play","to play"], t:"動名詞：be good at ＋ ing", h:"be good at ＋ ing（〜するのが上手だ）。", lv:5},
    {ja:"彼女は、いつ来るか教えてくれました。", en:"She told me when to come.", alt:["She told me when she would come."], b:"when", d:["what","how"], t:"不定詞：tell＋人＋疑問詞＋to", h:"tell ＋ 人 ＋ when to ＋ 原形。", lv:5},
    {ja:"私は、その問題を解くのは難しいと思います。", en:"I think it is difficult to solve the problem.", alt:["I think that it is difficult to solve the problem."], b:"to solve", d:["solving","solved"], t:"不定詞：It is ... to ＋ 原形", h:"It is 〜 to ＋ 原形（〜することは…だ）。", lv:5},
    {ja:"この箱は、私が運ぶには重すぎます。", en:"This box is too heavy for me to carry.", alt:["This box is too heavy for me to lift."], b:"for me", d:["to me","of me"], t:"不定詞：too〜for人＋to", h:"for 人 ＋ to ＋ 原形（人にとって〜する）。", lv:5}
   ]},
  {name:"関係代名詞・分詞（後置修飾）",
   p:"関係代名詞は前の名詞を説明します。人には who、ものには which、どちらにも that。前の名詞が説明文の目的語のときは省略できることがあります。<br>分詞は名詞のあとに置いて説明します。「〜している」は ing 形、「〜された」は過去分詞。<br>the man playing the guitar ／ the book written by him",
   items:[
    {ja:"私には大阪に住んでいる友だちがいます。", en:"I have a friend who lives in Osaka.", b:"who", d:["which","whose"], t:"関係代名詞：主格 who（人）", h:"人には who。", lv:1},
    {ja:"これは駅へ行くバスです。", en:"This is the bus which goes to the station.", b:"which", d:["who","whom"], t:"関係代名詞：主格 which（もの）", h:"ものには which。", lv:1},
    {ja:"これは私が昨日買った本です。", en:"This is the book that I bought yesterday.", b:"that", d:["who","what"], t:"関係代名詞：目的格 that", h:"説明文の中で目的語（book を bought）。that を使う。", lv:1},
    {ja:"ピアノを弾いている女の子は私の妹です。", en:"The girl playing the piano is my sister.", b:"playing", d:["played","play"], t:"分詞：現在分詞（〜している）", h:"「〜している」は ing 形。", lv:1},
    {ja:"英語で書かれた手紙を見せてください。", en:"Please show me the letter written in English.", b:"written", d:["write","wrote"], t:"分詞：過去分詞（〜された）", h:"「〜された」は過去分詞。", lv:1},

    {ja:"彼女が好きな映画は有名です。", en:"The movie which she likes is famous.", b:"which", d:["who","whose"], t:"関係代名詞：目的格 which", h:"映画（もの）には which か that。", lv:2},
    {ja:"窓のそばに立っている男の人は先生です。", en:"The man standing by the window is a teacher.", b:"standing", d:["stood","stand"], t:"分詞：現在分詞（〜している）", h:"stand → standing。", lv:2},
    {ja:"私は、彼が住んでいる家を知っています。", en:"I know the house where he lives.", b:"where", d:["when","which"], t:"関係副詞：where（場所）", h:"場所を説明するときは where。", lv:2},
    {ja:"母が作ったケーキは、とてもおいしかったです。", en:"The cake my mother made was very delicious.", b:"made", d:["make","makes"], t:"関係代名詞の省略：過去形", h:"which（that）が省略されている。made は過去形。", lv:2},
    {ja:"私たちが会った男性は医者です。", en:"The man whom we met is a doctor.", b:"whom", d:["who","which"], t:"関係代名詞：目的格 whom（人）", h:"人の目的格は whom（文章語）。who でも可。", lv:2},

    {ja:"あの店で働いている人は、私の友だちです。", en:"The people working at that shop are my friends.", b:"working", d:["work","worked"], t:"分詞：並べかえ（現在分詞）", h:"「〜している人々」は people ＋ ing。", lv:3},
    {ja:"彼女は、昨日盗まれた自転車を見つけました。", en:"She found the bike stolen yesterday.", b:"stolen", d:["steal","stole"], t:"分詞：過去分詞（不規則）", h:"steal の過去分詞は stolen。", lv:3},
    {ja:"これは私が好きな歌です。", en:"This is the song that I like.", b:"that", d:["who","what"], t:"関係代名詞：目的格 that", h:"song（もの）には that。", lv:3},
    {ja:"ここは、私が生まれた町です。", en:"This is the town where I was born.", b:"where", d:["which","who"], t:"関係副詞：where（場所）", h:"town（場所）には where。", lv:3},
    {ja:"その男の子は、ボールを投げている少年です。", en:"The boy throwing the ball is my brother.", b:"throwing", d:["threw","throw"], t:"分詞：現在分詞（〜している）", h:"throw → throwing。", lv:3},

    {ja:"私は、彼が書いた小説を読みました。", en:"I read the novel which he wrote.", alt:["I read the novel that he wrote."], b:"which", d:["who","whose"], t:"関係代名詞：目的格 which", h:"小説（もの）には which か that。", lv:4},
    {ja:"英語を話せる人を探しています。", en:"I am looking for someone who can speak English.", alt:["I'm looking for someone who can speak English."], b:"who", d:["which","what"], t:"関係代名詞：主格 who（人）", h:"someone（だれか）には who。", lv:4},
    {ja:"窓の近くに座っている女の子は、私の妹です。", en:"The girl sitting near the window is my sister.", alt:["The girl who is sitting near the window is my sister."], b:"sitting", d:["sat","sit"], t:"分詞：現在分詞（〜している）", h:"sit → sitting。", lv:4},
    {ja:"その写真は、彼によって撮られたものです。", en:"The picture taken by him is beautiful.", alt:["The picture which was taken by him is beautiful."], b:"taken", d:["taking","take"], t:"分詞：過去分詞（〜された）", h:"take の過去分詞は taken。", lv:4},
    {ja:"私は、父が働いている会社を知っています。", en:"I know the company where my father works.", alt:["I know the company that my father works for."], b:"where", d:["which","when"], t:"関係副詞：where（場所）", h:"会社（場所）には where。", lv:4},

    {ja:"あなたが昨日話していた人は誰ですか。（英語で）", en:"Who is the person you were talking about yesterday?", alt:["Who was the person you were talking about yesterday?"], b:"you", d:["your","yours"], t:"関係代名詞の省略：目的格", h:"who が省略されていないので、you の形を確認。", lv:5},
    {ja:"彼が書いた本は、10か国語に翻訳されました。", en:"The book written by him was translated into ten languages.", alt:["The book that he wrote was translated into ten languages."], b:"written", d:["write","wrote"], t:"分詞：過去分詞（〜された）", h:"「彼によって書かれた本」は過去分詞。", lv:5},
    {ja:"私たちと一緒に走っている少年は、私の弟です。", en:"The boy running with us is my brother.", alt:["The boy who is running with us is my brother."], b:"running", d:["ran","run"], t:"分詞：現在分詞（〜している）", h:"run → running（ingをつける）。", lv:5},
    {ja:"彼女は、昨日会った男の人について話しています。", en:"She is talking about the man she met yesterday.", alt:["She is talking about the man whom she met yesterday."], b:"she met", d:["met she","met"], t:"関係代名詞の省略：目的格", h:"the man ＋ 主語 ＋ 動詞（she met）で説明できる。", lv:5},
    {ja:"この箱の中にあるものは、私のものです。", en:"What is in this box is mine.", alt:["Whatever is in this box is mine."], b:"What", d:["Which","Who"], t:"関係代名詞：what（〜もの）", h:"「〜するもの」は what。", lv:5}
   ]}
);
