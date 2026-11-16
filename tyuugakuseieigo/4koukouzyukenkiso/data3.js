// 高校受験：ステージ5〜6（仮定法・間接疑問・接続詞、比較・感嘆文・間接話法）
STAGES.push(
  {name:"仮定法・間接疑問・接続詞",
   p:"仮定法：If ＋ 主語 ＋ 過去形 〜, 主語 ＋ would ＋ 原形（現実とちがうこと）。be動詞は were。<br>間接疑問：Do you know where he lives?（疑問詞 ＋ 主語 ＋ 動詞）。<br>接続詞：when（〜のとき）、if（もし〜なら）、because（〜なので）、though（〜だけれども）、so that（〜するために）。",
   items:[
    {ja:"もし私が鳥なら、空を飛べるのに。", en:"If I were a bird, I could fly.", b:"were", d:["was","am"], t:"仮定法：be動詞は were", h:"仮定法の be動詞は were を使う。", lv:1},
    {ja:"彼がどこに住んでいるか知っていますか。", en:"Do you know where he lives?", b:"where", d:["what","who"], t:"間接疑問：疑問詞＋主語＋動詞", h:"間接疑問は「疑問詞＋主語＋動詞」の順。", lv:1},
    {ja:"彼は疲れていたので、早く寝ました。", en:"He went to bed early because he was tired.", b:"because", d:["if","though"], t:"接続詞：because（〜なので）", h:"「〜なので」は because。", lv:1},
    {ja:"雨が降っていましたが、私たちは出かけました。", en:"Though it was raining, we went out.", b:"Though", d:["If","When"], t:"接続詞：though（〜だけれども）", h:"「〜だけれども」は though。", lv:1},
    {ja:"もし時間があれば、あなたを手伝うのに。", en:"If I had time, I would help you.", b:"had", d:["have","has"], t:"仮定法：過去形（had）", h:"「もし〜なら」は過去形（had）。", lv:1},

    {ja:"もしお金があれば、新しいパソコンを買うのに。", en:"If I had money, I would buy a new computer.", b:"would", d:["will","can"], t:"仮定法：would＋原形", h:"結果の部分は would ＋ 原形。", lv:2},
    {ja:"私は、彼女がいつ来るか知りません。", en:"I don't know when she will come.", b:"when", d:["what","how"], t:"間接疑問：when（時）", h:"「いつ」は when。文の途中でも when。", lv:2},
    {ja:"私は、その駅への行き方を知りたいです。", en:"I want to know how to get to the station.", b:"how", d:["what","when"], t:"間接疑問：how to＋原形", h:"how to ＋ 原形で「〜する方法」。", lv:2},
    {ja:"彼女は、私が誰か知っています。", en:"She knows who I am.", b:"who", d:["what","whose"], t:"間接疑問：who（人）", h:"who（誰）のあとは「主語＋動詞」。", lv:2},
    {ja:"雨が降ったら、試合は中止になります。", en:"If it rains, the game will be canceled.", b:"If", d:["When","Though"], t:"接続詞：if（もし〜なら）", h:"「もし〜なら」は if。未来の文でも現在形で書く。", lv:2},

    {ja:"もし私があなただったら、そうしないでしょう。", en:"If I were you, I would not do that.", b:"were", d:["was","am"], t:"仮定法：be動詞は were", h:"仮定法の be動詞は were。", lv:3},
    {ja:"私は、このパーティーがいつ始まるか知りたいです。", en:"I would like to know when this party will start.", b:"when", d:["what","how"], t:"間接疑問：when", h:"when ＋ 主語 ＋ 動詞の順。", lv:3},
    {ja:"彼は英語を一生懸命勉強したので、試験に合格しました。", en:"He studied English hard, so he passed the exam.", b:"so", d:["because","though"], t:"接続詞：so（だから）", h:"「だから」は so。", lv:3},
    {ja:"彼女は、もっと練習すれば上手になれるのに。", en:"She would be better if she practiced more.", b:"if", d:["when","though"], t:"仮定法：if（もし〜なら）", h:"仮定法の if を使う。", lv:3},
    {ja:"私は、どこでその本を買えるか知っています。", en:"I know where I can buy the book.", b:"where", d:["when","how"], t:"間接疑問：where（場所）", h:"「どこで」は where。", lv:3},

    {ja:"もし明日晴れたら、私たちは山に登るでしょう。", en:"If it is sunny tomorrow, we will climb the mountain.", alt:["If it is fine tomorrow, we will climb the mountain."], b:"is", d:["will be","was"], t:"接続詞：if（未来は現在形）", h:"if の中は未来のことも現在形で書く。", lv:4},
    {ja:"私は、彼がなぜ遅れたのか分かりません。", en:"I don't know why he was late.", alt:["I do not know why he was late."], b:"why", d:["when","how"], t:"間接疑問：why（理由）", h:"「なぜ」は why。", lv:4},
    {ja:"彼はとても疲れていましたが、仕事を続けました。", en:"He was very tired, but he kept working.", alt:["He was very tired, yet he kept working."], b:"but", d:["so","because"], t:"接続詞：but（しかし）", h:"「しかし」は but。", lv:4},
    {ja:"もし私が王様なら、貧しい人を助けるのに。", en:"If I were a king, I would help poor people.", alt:["If I were the king, I would help the poor."], b:"were", d:["was","am"], t:"仮定法：be動詞は were", h:"仮定法は were。", lv:4},
    {ja:"私は、いつ駅に着くか彼に伝えました。", en:"I told him when I would arrive at the station.", alt:["I told him when I would get to the station."], b:"when", d:["what","how"], t:"間接疑問：when（時）", h:"tell ＋ 人 ＋ 疑問詞 ＋ 主語 ＋ 動詞。", lv:4},

    {ja:"もし私が彼の立場なら、その仕事を引き受けないでしょう。", en:"If I were in his position, I would not take the job.", alt:["If I were in his shoes, I would not take the job."], b:"were", d:["was","am"], t:"仮定法：英作文", h:"仮定法過去：If ＋ 主語 ＋ were ～, 主語 ＋ would not ＋ 原形。", lv:5},
    {ja:"私は、彼女がなぜ泣いているのか知りたいです。", en:"I want to know why she is crying.", alt:["I would like to know why she is crying."], b:"why", d:["when","how"], t:"間接疑問：英作文（why）", h:"間接疑問は「疑問詞＋主語＋動詞」。", lv:5},
    {ja:"雨が降っていたので、遠足は中止になりました。", en:"The trip was canceled because it was raining.", alt:["The trip was canceled since it was raining."], b:"because", d:["so","though"], t:"接続詞：英作文（because）", h:"「〜なので」は because。", lv:5},
    {ja:"もし速く走れたら、その大会で優勝できるのに。", en:"If I could run fast, I could win the race.", alt:["If I could run fast, I would be able to win the race."], b:"could", d:["can","would"], t:"仮定法：could（英作文）", h:"仮定法では can の過去形 could を使う。", lv:5},
    {ja:"彼女は、とても忙しかったけれど、私を手伝ってくれました。", en:"Though she was very busy, she helped me.", alt:["Although she was very busy, she helped me."], b:"Though", d:["If","Because"], t:"接続詞：though（英作文）", h:"「〜だけれども」は though（Although も同じ）。", lv:5}
   ]},
  {name:"比較・感嘆文・間接話法",
   p:"比較：as ＋ 形容詞 ＋ as（同じくらい）、比較級 ＋ than（〜より）、the 最上級 ＋ in / of（〜で一番）。感嘆文：How ＋ 形容詞！ ／ What a ＋ 形容詞 ＋ 名詞！<br>間接話法：He said (that) he was tired.（時制は一つ過去にずらす）",
   items:[
    {ja:"私は兄と同じくらい背が高いです。", en:"I am as tall as my brother.", b:"as", d:["than","so"], t:"比較：as〜as", h:"同じくらいは as ＋ 形容詞 ＋ as。", lv:1},
    {ja:"この箱は、あの箱より重いです。", en:"This box is heavier than that one.", b:"heavier", d:["heavy","heaviest"], t:"比較：比較級＋than", h:"「〜より重い」は heavier than。", lv:1},
    {ja:"彼女はクラスで一番速く走ります。", en:"She runs the fastest in her class.", b:"fastest", d:["faster","fast"], t:"最上級：the ＋ -est", h:"「一番〜」は the ＋ -est。", lv:1},
    {ja:"なんて美しい花なのでしょう！", en:"What a beautiful flower it is!", b:"What", d:["How","Who"], t:"感嘆文：What a＋形容詞＋名詞", h:"名詞（flower）があるときは What a。", lv:1},
    {ja:"彼は疲れていると言いました。", en:"He said that he was tired.", b:"was", d:["is","were"], t:"間接話法：時制を過去に", h:"言ったのが過去なので am → was。", lv:1},

    {ja:"この問題は、あの問題よりも難しいです。", en:"This question is more difficult than that one.", b:"more", d:["most","much"], t:"比較：more＋than（長い語）", h:"difficult は長い語なので more。", lv:2},
    {ja:"私は、その映画ほど面白い本を読んだことがありません。", en:"I have never read a book as interesting as that movie.", b:"as", d:["than","so"], t:"比較：as〜as（否定の文脈）", h:"as interesting as ～ で「〜と同じくらい面白い」。", lv:2},
    {ja:"この町は、東京ほど大きくありません。", en:"This town is not as big as Tokyo.", b:"as", d:["than","so"], t:"比較：not as〜as", h:"「〜ほどではない」は not as ... as。", lv:2},
    {ja:"彼女は、私が今まで会った中で最も親切な人です。", en:"She is the kindest person I have ever met.", b:"kindest", d:["kinder","kind"], t:"最上級：the ＋ -est（ever）", h:"「今まで会った中で一番」は the ＋ 最上級 ＋ ever。", lv:2},
    {ja:"なんて面白い話なのでしょう！", en:"What an interesting story it is!", b:"What an", d:["How a","What a"], t:"感嘆文：What an（母音の前）", h:"interesting は母音の音で始まるので an。", lv:2},

    {ja:"彼は、私に明日来るように言いました。", en:"He told me to come tomorrow.", b:"to", d:["for","of"], t:"間接話法：tell＋人＋to", h:"「〜するように言う」は tell ＋ 人 ＋ to ＋ 原形。", lv:3},
    {ja:"彼女は、私がその本を読んだかどうか尋ねました。", en:"She asked me if I had read the book.", b:"if", d:["that","what"], t:"間接話法：if（〜かどうか）", h:"「〜かどうか」は if。", lv:3},
    {ja:"私は、この映画が今まで見た中で一番面白いと思います。", en:"I think this is the most interesting movie I have ever seen.", b:"most", d:["more","much"], t:"最上級：the most＋長い語", h:"interesting は長い語なので the most。", lv:3},
    {ja:"なんて速い車なのでしょう！", en:"What a fast car it is!", b:"fast", d:["faster","fastest"], t:"感嘆文：What a＋形容詞＋名詞", h:"形容詞は原級（fast）。", lv:3},
    {ja:"彼女は、私が来たとき寝ていたと言いました。", en:"She said that she had been sleeping when I came.", b:"had", d:["has","was"], t:"間接話法：過去完了", h:"言った時点より前のことは had。", lv:3},

    {ja:"彼は、私より2歳年上です。", en:"He is two years older than I am.", alt:["He is two years older than me."], b:"older", d:["old","oldest"], t:"比較：比較級（年上）", h:"「〜より年上」は older than。", lv:4},
    {ja:"なんてすばらしい景色なのでしょう！", en:"How wonderful the view is!", alt:["What a wonderful view it is!"], b:"wonderful", d:["wonderfully","wonder"], t:"感嘆文：How＋形容詞", h:"How ＋ 形容詞 ＋ 主語 ＋ 動詞！", lv:4},
    {ja:"彼女は、彼は正直だと言いました。", en:"She said that he was honest.", alt:["She said he was honest."], b:"was", d:["is","were"], t:"間接話法：時制を過去に", h:"said（過去）のあとは was。", lv:4},
    {ja:"この本は、どの本よりも役に立ちます。", en:"This book is more useful than any other book.", alt:["This book is more useful than any other."], b:"more", d:["most","much"], t:"比較：more＋than（長い語）", h:"「どの〜よりも」は more ... than any other。", lv:4},
    {ja:"私は、彼がもう家に帰ったと言いました。", en:"I said that he had already gone home.", alt:["I said he had already gone home."], b:"had", d:["has","was"], t:"間接話法：過去完了", h:"already（もう）は had と過去分詞の間。", lv:4},

    {ja:"私の家は、学校の次に大きな建物です。", en:"My house is the second biggest building after the school.", alt:["My house is the second largest building after the school."], b:"biggest", d:["bigger","big"], t:"最上級：英作文（second）", h:"「2番目に大きい」は the second ＋ 最上級。", lv:5},
    {ja:"なんて暑い日なのでしょう！", en:"What a hot day it is!", alt:["How hot the day is!"], b:"hot", d:["hotter","hottest"], t:"感嘆文：英作文", h:"What a ＋ 形容詞 ＋ 名詞（day）！", lv:5},
    {ja:"彼は、私に「明日は雨が降る」と言いました。（英語で）", en:"He said that it would rain the next day.", alt:["He said it would rain the next day."], b:"would", d:["will","can"], t:"間接話法：will→would（英作文）", h:"tomorrow は the next day に、will は would に変わる。", lv:5},
    {ja:"この問題は、私が思っていたより簡単でした。", en:"This question was easier than I thought.", alt:["This question was easier than I had thought."], b:"easier", d:["easy","easiest"], t:"比較：英作文（-er）", h:"easy → easier（y を i に変えて er）。", lv:5},
    {ja:"彼女は、この町で一番古いお寺に行ったと言いました。", en:"She said that she had visited the oldest temple in this town.", alt:["She said she had visited the oldest temple in this town."], b:"oldest", d:["older","old"], t:"最上級＋間接話法（英作文）", h:"過去完了（had visited）と最上級（the oldest）を組み合わせる。", lv:5}
   ]}
);
