// 高校受験：ステージ1〜2（現在完了・受け身と助動詞）
// lv: 1=基礎（3択）／2=標準（文脈で選ぶ）／3=応用（並べかえ）／4=発展（和文英訳）／5=実戦（英作文・書きかえ）
// alt: 入力問題で、ほかに正解とする英文
const STAGES = [
  {name:"時制・現在完了（経験・完了・継続）",
   p:"現在完了は have（has）＋ 過去分詞。経験（〜したことがある）、完了（ちょうど・もう・まだ）、継続（ずっと〜している）の3つの意味があります。<br>継続は for（期間）・since（始まった時点）。「行ったことがある」は have been to、「行ってしまった」は have gone to。",
   items:[
    {ja:"私は5年間この町に住んでいます。", en:"I have lived in this town for five years.", b:"for", d:["since","during"], t:"現在完了：継続（for）", h:"five years は期間なので for。", lv:1},
    {ja:"彼は北海道に2回行ったことがあります。", en:"He has been to Hokkaido twice.", b:"been", d:["gone","went"], t:"現在完了：経験（been to）", h:"「行ったことがある」は have been to。gone は「行ってしまった」。", lv:1},
    {ja:"彼女はちょうど宿題を終えました。", en:"She has just finished her homework.", b:"just", d:["already","yet"], t:"現在完了：完了（just）", h:"just は「ちょうど」。", lv:1},
    {ja:"私は先月から彼に会っていません。", en:"I have not seen him since last month.", b:"since", d:["for","from"], t:"現在完了：継続（since）", h:"since ＋ 始まった時点（last month）。", lv:1},
    {ja:"私は子どものころから彼女を知っています。", en:"I have known her since I was a child.", b:"known", d:["know","knew"], t:"現在完了：過去分詞（不規則）", h:"know の過去分詞は known。", lv:1},

    {ja:"彼は3年前からこの町に住んでいます。", en:"He has lived in this town for three years.", b:"for", d:["since","from"], t:"現在完了：継続（for）", h:"three years は期間なので for。", lv:2},
    {ja:"私は昨日からずっと忙しいです。", en:"I have been busy since yesterday.", b:"since", d:["for","from"], t:"現在完了：継続（since）", h:"yesterday は始まった時点なので since。", lv:2},
    {ja:"バスはちょうど出発したところです。", en:"The bus has just left.", b:"left", d:["leaves","leaving"], t:"現在完了：過去分詞（不規則）", h:"leave の過去分詞は left。", lv:2},
    {ja:"あなたは今までに富士山に登ったことがありますか。", en:"Have you ever climbed Mount Fuji?", b:"ever", d:["never","just"], t:"現在完了：経験（ever）", h:"「今までに」は ever。疑問文でよく使う。", lv:2},
    {ja:"私はまだ夕食を食べていません。", en:"I have not had dinner yet.", b:"had", d:["ate","eaten"], t:"現在完了：否定文（not yet）", h:"have not ＋ 過去分詞（had）。yet は「まだ」。", lv:2},

    {ja:"私は2015年から彼女を知っています。", en:"I have known her since 2015.", b:"since", d:["for","from"], t:"現在完了：並べかえ（since）", h:"「〜から」で始まった時点は since。", lv:3},
    {ja:"彼女はもう宿題を終えました。", en:"She has already finished her homework.", b:"already", d:["yet","just"], t:"現在完了：完了（already）", h:"already は肯定文で「もう」。have と過去分詞の間に入れる。", lv:3},
    {ja:"あなたは京都に行ったことがありますか。", en:"Have you ever been to Kyoto?", b:"been", d:["gone","went"], t:"現在完了：経験（been to）", h:"「行ったことがある」は been to。", lv:3},
    {ja:"彼は東京へ行ってしまいました。", en:"He has gone to Tokyo.", b:"gone", d:["been","went"], t:"現在完了：完了（gone to）", h:"「行ってしまった（今ここにいない）」は have gone to。", lv:3},
    {ja:"私たちは長い間会っていません。", en:"We have not seen each other for a long time.", b:"for", d:["since","during"], t:"現在完了：継続（for）", h:"「長い間」は期間なので for。", lv:3},

    {ja:"彼女はちょうど駅に着いたところです。", en:"She has just arrived at the station.", b:"just", d:["already","yet"], t:"現在完了：完了（just）", h:"「ちょうど〜したところ」は just。", lv:4},
    {ja:"私は一度もアメリカに行ったことがありません。", en:"I have never been to America.", b:"never", d:["ever","not"], t:"現在完了：経験（never）", h:"「一度も〜ない」は never。", lv:4},
    {ja:"雨はまだやんでいません。", en:"It has not stopped raining yet.", b:"yet", d:["already","still"], t:"現在完了：否定文（not yet）", h:"「まだ〜ない」は not ... yet。", lv:4},
    {ja:"彼は2時間ずっと待っています。", en:"He has been waiting for two hours.", alt:["He has waited for two hours."], b:"waiting", d:["waited","wait"], t:"現在完了進行形：ing", h:"「ずっと〜している」は have been ＋ ing。", lv:4},
    {ja:"私は10年間ピアノを習っています。", en:"I have taken piano lessons for ten years.", alt:["I have been taking piano lessons for ten years."], b:"taken", d:["taking","take"], t:"現在完了：過去分詞（不規則）", h:"take の過去分詞は taken。", lv:4},

    {ja:"私が彼に最後に会ったのは昨日です。（「昨日から会っていない」と現在完了で書きかえなさい）", en:"I have not seen him since yesterday.", alt:["I haven't seen him since yesterday."], b:"not", d:["no","never"], t:"現在完了：書きかえ（否定文）", h:"「昨日から会っていない」は have not ＋ 過去分詞 ＋ since。", lv:5},
    {ja:"彼女は今までに二度アメリカへ行ったことがあります。", en:"She has been to America twice.", alt:["She has been to the United States twice."], b:"been", d:["gone","went"], t:"現在完了：英作文（経験）", h:"経験は have been to。", lv:5},
    {ja:"これは私が今までに読んだ中で一番面白い本です。", en:"This is the most interesting book I have ever read.", alt:["This is the most interesting book that I have ever read."], b:"read", d:["reading","reads"], t:"現在完了：英作文（経験＋最上級）", h:"「今までに読んだ」は have ever read。", lv:5},
    {ja:"私は10年前に彼に初めて会いました。（「10年間知っている」と現在完了で書きかえなさい）", en:"I have known him for ten years.", alt:["I have known him for 10 years."], b:"known", d:["knew","know"], t:"現在完了：書きかえ（継続）", h:"「〜年間知っている」は have known ＋ for。", lv:5},
    {ja:"彼らは2時間ずっとサッカーをしています。", en:"They have been playing soccer for two hours.", alt:["They have played soccer for two hours."], b:"been", d:["being","be"], t:"現在完了進行形：英作文", h:"ずっと続く動作は have been ＋ ing。", lv:5}
   ]},
  {name:"受け身と助動詞（must・should・may）",
   p:"受け身は be ＋ 過去分詞（行為者は by）。助動詞の受け身は「助動詞 ＋ be ＋ 過去分詞」。<br>must（〜しなければならない）、should（〜すべき）、may（〜かもしれない）、must not（〜してはいけない）。",
   items:[
    {ja:"この手紙は英語で書かれています。", en:"This letter is written in English.", b:"written", d:["write","wrote"], t:"受け身：過去分詞", h:"write の過去分詞は written。", lv:1},
    {ja:"その店は日曜日に閉められます。", en:"The shop is closed on Sundays.", b:"closed", d:["close","closing"], t:"受け身：過去分詞（規則）", h:"受け身は be ＋ 過去分詞。", lv:1},
    {ja:"この写真は私の父によって撮られました。", en:"This photo was taken by my father.", b:"taken", d:["take","took"], t:"受け身：過去分詞（不規則）", h:"take の過去分詞は taken。", lv:1},
    {ja:"私たちは毎日、英語を話すべきです。", en:"We should speak English every day.", b:"should", d:["must","may"], t:"助動詞：should（〜すべき）", h:"should は「〜すべき」。", lv:1},
    {ja:"彼は今日来ないかもしれません。", en:"He may not come today.", b:"may", d:["must","should"], t:"助動詞：may（かもしれない）", h:"may は「〜かもしれない」。", lv:1},

    {ja:"このかばんは私の母によって作られました。", en:"This bag was made by my mother.", b:"by", d:["to","with"], t:"受け身：by（行為者）", h:"「〜によって」は by。with は道具を表す。", lv:2},
    {ja:"ここでは写真をとってはいけません。", en:"You must not take pictures here.", b:"not", d:["no","don't"], t:"助動詞：must not（禁止）", h:"must not ＝「〜してはいけない」。", lv:2},
    {ja:"あの鳥は英語で何と呼ばれていますか。", en:"What is that bird called in English?", b:"called", d:["calls","call"], t:"受け身：be called（呼ばれる）", h:"「〜と呼ばれる」は be called。", lv:2},
    {ja:"この問題は、明日までに解かれるべきです。", en:"This problem should be solved by tomorrow.", b:"solved", d:["solve","solves"], t:"助動詞の受け身：should be", h:"should be ＋ 過去分詞。solve → solved。", lv:2},
    {ja:"その仕事は明日までに終わるでしょう。", en:"The work will be finished by tomorrow.", b:"be", d:["is","being"], t:"助動詞の受け身：will be", h:"will のあとは be ＋ 過去分詞。", lv:2},

    {ja:"この部屋は毎日そうじされなければなりません。", en:"This room must be cleaned every day.", b:"be", d:["is","been"], t:"助動詞の受け身：must be", h:"must のあとは be ＋ 過去分詞。", lv:3},
    {ja:"その歌は多くの人に歌われています。", en:"The song is sung by many people.", b:"sung", d:["sing","sang"], t:"受け身：過去分詞（不規則）", h:"sing の過去分詞は sung。", lv:3},
    {ja:"ドアは彼によって閉められました。", en:"The door was closed by him.", b:"by", d:["to","with"], t:"受け身：by（行為者）", h:"「〜によって」は by。", lv:3},
    {ja:"あなたは宿題をするべきです。", en:"You should do your homework.", b:"should", d:["must","can"], t:"助動詞：should（〜すべき）", h:"should ＋ 動詞の原形。", lv:3},
    {ja:"この写真は昨日撮られたものです。", en:"This picture was taken yesterday.", b:"taken", d:["take","took"], t:"受け身：過去分詞（不規則）", h:"take の過去分詞は taken。", lv:3},

    {ja:"その本は英語で書かれています。", en:"The book was written in English.", b:"written", d:["write","wrote"], t:"受け身：過去分詞（不規則）", h:"過去の受け身は was ＋ 過去分詞。", lv:4},
    {ja:"私の自転車は昨日、盗まれました。", en:"My bike was stolen yesterday.", alt:["My bicycle was stolen yesterday."], b:"stolen", d:["steal","stole"], t:"受け身：過去分詞（不規則）", h:"steal の過去分詞は stolen。", lv:4},
    {ja:"私たちは夜9時までにこの仕事を終えなければなりません。", en:"We must finish this work by nine o'clock.", alt:["We have to finish this work by nine o'clock."], b:"finish", d:["finished","finishes"], t:"助動詞：must＋原形", h:"must のあとは原形（finish）。", lv:4},
    {ja:"この写真は多くの人に見られています。", en:"This picture is seen by many people.", b:"seen", d:["see","saw"], t:"受け身：過去分詞（不規則）", h:"see の過去分詞は seen。", lv:4},
    {ja:"あなたは今日、家にいるべきです。", en:"You should stay at home today.", b:"stay", d:["stays","stayed"], t:"助動詞：should＋原形", h:"should のあとは原形（stay）。", lv:4},

    {ja:"「彼はこの絵をかいた」を受け身の文にしなさい。（英語で、この絵を主語にして）", en:"This picture was painted by him.", alt:["This painting was painted by him.","This picture was drawn by him."], b:"painted", d:["paint","paints"], t:"受け身：英作文（書きかえ）", h:"was ＋ 過去分詞。by him（彼によって）を後ろに。", lv:5},
    {ja:"人々はこの町をとても愛しています。（受け身で「愛されている」と書きなさい）", en:"This town is loved by many people.", alt:["This town is loved by people."], b:"loved", d:["love","loving"], t:"受け身：英作文（現在）", h:"is ＋ 過去分詞（loved）。", lv:5},
    {ja:"この部屋は今すぐそうじされるべきです。", en:"This room should be cleaned now.", alt:["This room should be cleaned right now."], b:"cleaned", d:["clean","cleaning"], t:"助動詞の受け身：英作文", h:"should be ＋ 過去分詞（cleaned）。", lv:5},
    {ja:"その城は1600年に建てられました。", en:"The castle was built in 1600.", alt:["The castle was built in the year 1600."], b:"built", d:["build","builds"], t:"受け身：英作文（過去）", h:"build の過去分詞は built。", lv:5},
    {ja:"この本は子どもたちに読まれるべきです。", en:"This book should be read by children.", alt:["This book should be read by kids."], b:"read", d:["reads","reading"], t:"助動詞の受け身：英作文", h:"should be ＋ 過去分詞（read）。", lv:5}
   ]}
];
