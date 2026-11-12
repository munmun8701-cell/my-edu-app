// 高校受験：ステージ7〜8（熟語・句動詞、同意文・英作文）
STAGES.push(
  {name:"熟語・句動詞（よく出る表現）",
   p:"熟語は、まとめて一つの意味になる言い方です。まるごと覚えるのがコツです。<br>take care of（〜の世話をする）／look forward to（〜を楽しみにする）／be interested in（〜に興味がある）／give up（あきらめる）／look after（世話をする）／depend on（〜に頼る）／instead of（〜の代わりに）／as well as（〜だけでなく〜も）／such as（例えば）／at least（少なくとも）",
   items:[
    {ja:"私は犬の世話をします。", en:"I will take care of the dog.", b:"care", d:["look","catch"], t:"熟語：take care of（世話をする）", h:"take care of ～ ＝「〜の世話をする」。", lv:1},
    {ja:"私は夏休みを楽しみにしています。", en:"I am looking forward to the summer vacation.", b:"to", d:["in","for"], t:"熟語：look forward to（楽しみにする）", h:"to は前置詞。あとに名詞か ing が続く。", lv:1},
    {ja:"私は英語に興味があります。", en:"I am interested in English.", b:"in", d:["at","on"], t:"熟語：be interested in", h:"「〜に興味がある」は be interested in。", lv:1},
    {ja:"彼は夢をあきらめませんでした。", en:"He did not give up his dream.", b:"give up", d:["take up","get up"], t:"熟語：give up（あきらめる）", h:"give up ＝ あきらめる。", lv:1},
    {ja:"私は、この言葉の意味を調べました。", en:"I found out the meaning of this word.", b:"found out", d:["took off","went out"], t:"熟語：find out（調べて分かる）", h:"find out ＝ 〜を調べて分かる。", lv:1},

    {ja:"私はその計画には賛成ではありません。", en:"I don't agree with the plan.", b:"with", d:["to","for"], t:"熟語：agree with（〜に賛成）", h:"agree with ～ ＝「〜に賛成する」。", lv:2},
    {ja:"彼女は、母親に似ています。", en:"She takes after her mother.", b:"after", d:["up","out"], t:"熟語：take after（似ている）", h:"take after ＝ 〜に似ている。", lv:2},
    {ja:"あなたは彼に頼ることができます。", en:"You can depend on him.", b:"on", d:["for","to"], t:"熟語：depend on（頼る）", h:"depend on ～ ＝「〜に頼る」。", lv:2},
    {ja:"電車は時間通りに到着しました。", en:"The train arrived on time.", b:"on", d:["in","at"], t:"熟語：on time（時間通りに）", h:"on time ＝ 時間通りに。", lv:2},
    {ja:"彼は、私たちの代わりに来ました。", en:"He came instead of us.", b:"instead of", d:["because of","in front of"], t:"熟語：instead of（〜の代わりに）", h:"instead of ～ ＝「〜の代わりに」。", lv:2},

    {ja:"彼女は、ピアノだけでなくギターも上手です。", en:"She is good at the guitar as well as the piano.", b:"as well as", d:["instead of","such as"], t:"熟語：as well as（〜だけでなく）", h:"as well as ＝「〜だけでなく〜も」。", lv:3},
    {ja:"私は駅でバスに乗りました。", en:"I got on the bus at the station.", b:"got on", d:["got off","got up"], t:"熟語：get on（乗る）", h:"get on ＝ 乗る。get off は降りる。", lv:3},
    {ja:"私たちは幼い弟の世話をしなければなりません。", en:"We must look after our little brother.", b:"look after", d:["look for","look at"], t:"熟語：look after（世話をする）", h:"look after ＝ 世話をする。", lv:3},
    {ja:"彼らは中国や韓国などの国々を訪れました。", en:"They visited countries such as China and Korea.", b:"such as", d:["as well as","instead of"], t:"熟語：such as（例えば）", h:"such as ＝「例えば」。", lv:3},
    {ja:"少なくとも1日に1回は、水を飲みましょう。", en:"Drink water at least once a day.", b:"at least", d:["at last","at most"], t:"熟語：at least（少なくとも）", h:"at least ＝「少なくとも」。", lv:3},

    {ja:"私は、この町に住むことに慣れています。", en:"I am used to living in this town.", alt:["I'm used to living in this town."], b:"used", d:["use","uses"], t:"熟語：be used to ＋ ing", h:"be used to ＋ ing ＝「〜に慣れている」。", lv:4},
    {ja:"彼女は、その知らせを聞いて驚きました。", en:"She was surprised at the news.", alt:["She was surprised by the news."], b:"at", d:["by","with"], t:"熟語：be surprised at", h:"be surprised at ～ ＝「〜に驚く」。", lv:4},
    {ja:"彼は、そのイベントに参加するつもりです。", en:"He is going to take part in the event.", alt:["He will take part in the event."], b:"take part in", d:["take part on","take part of"], t:"熟語：take part in（参加する）", h:"take part in ＝「〜に参加する」。", lv:4},
    {ja:"私はすぐにその本を返さなければなりません。", en:"I have to give back the book soon.", alt:["I must give the book back soon."], b:"give back", d:["give up","give out"], t:"熟語：give back（返す）", h:"give back ＝「返す」。", lv:4},
    {ja:"その会議は、来週まで延期されました。", en:"The meeting was put off until next week.", alt:["The meeting was postponed until next week."], b:"put off", d:["put on","put in"], t:"熟語：put off（延期する）", h:"put off ＝「延期する」。", lv:4},

    {ja:"彼女は、いつもあなたのことを心配しています。", en:"She always cares about you.", alt:["She is always worried about you."], b:"cares about", d:["cares for","cares of"], t:"熟語：care about（心配する）", h:"care about ＝「〜を気にかける」。", lv:5},
    {ja:"私は、彼に会うのをとても楽しみにしています。", en:"I am looking forward to meeting him very much.", alt:["I look forward to meeting him very much."], b:"looking forward to", d:["look for","look at"], t:"熟語：look forward to（英作文）", h:"to のあとは ing（meeting）。", lv:5},
    {ja:"私たちは、その問題について話し合う必要があります。", en:"We need to talk about the problem.", alt:["We have to talk about the problem."], b:"talk about", d:["talk to","talk of"], t:"熟語：talk about（〜について話す）", h:"talk about ＝「〜について話す」。", lv:5},
    {ja:"彼は、その事故の原因を調べています。", en:"He is trying to find out the cause of the accident.", alt:["He is trying to find out what caused the accident."], b:"find out", d:["find for","find at"], t:"熟語：find out（英作文）", h:"find out ＝「調べて分かる」。", lv:5},
    {ja:"私は、彼女の代わりにパーティーに行きました。", en:"I went to the party instead of her.", alt:["I went to the party in place of her."], b:"instead of", d:["because of","in front of"], t:"熟語：instead of（英作文）", h:"instead of ＝「〜の代わりに」。", lv:5}
   ]},
  {name:"同意文・英作文（書きかえ）",
   p:"同意文は、意味が同じで書き方がちがう文です。<br>too ～ to … ＝ so ～ that … can't<br>both A and B ＝ AもBも両方<br>neither A nor B ＝ AもBも〜ない<br>not only A but also B ＝ AだけでなくBも<br>like（〜のように）と as（〜として）は意味がちがうので注意しましょう。",
   items:[
    {ja:"彼女は、日本語と英語の両方を話せます。", en:"She can speak both Japanese and English.", b:"both", d:["either","neither"], t:"同意文：both A and B", h:"both A and B ＝ AとBの両方。", lv:1},
    {ja:"私はりんごもバナナも好きではありません。", en:"I like neither apples nor bananas.", b:"neither", d:["both","either"], t:"同意文：neither A nor B", h:"neither A nor B ＝ AもBも〜ない。", lv:1},
    {ja:"彼は、私と同じくらい忙しいです。", en:"He is as busy as I am.", b:"as", d:["than","so"], t:"同意文：as〜as", h:"同じくらいは as ＋ 形容詞 ＋ as。", lv:1},
    {ja:"彼女は私に、駅への道を教えてくれました。", en:"She showed me the way to the station.", b:"showed", d:["shows","showing"], t:"文型：show＋人＋物", h:"過去形は showed。「人に物を見せる・教える」。", lv:1},
    {ja:"私は、英語も数学も勉強しています。", en:"I study both English and math.", b:"both", d:["either","neither"], t:"同意文：both A and B", h:"both A and B ＝ AもBも両方。", lv:1},

    {ja:"この箱は重すぎて、私は持ち上げられません。", en:"This box is so heavy that I can't lift it.", b:"so", d:["too","such"], t:"同意文：so〜that（too〜to の書きかえ）", h:"so ～ that ... can't ＝「とても〜なので…できない」。", lv:2},
    {ja:"時間がないので、私は映画を見に行けません。", en:"Because I have no time, I can't go to the movie.", b:"Because", d:["Though","If"], t:"接続詞：because（理由）", h:"「〜なので」は because。", lv:2},
    {ja:"彼は、英語を話せるだけでなく、フランス語も話せます。", en:"He can speak not only English but also French.", b:"not only", d:["not","neither"], t:"熟語：not only A but also B", h:"not only A but also B ＝ AだけでなくBも。", lv:2},
    {ja:"彼女は、昨日の試合で勝ったので、とても喜んでいます。", en:"She is very glad because she won the game yesterday.", b:"because", d:["so","though"], t:"接続詞：because（〜なので）", h:"「〜なので」の理由は because。", lv:2},
    {ja:"私は、その映画を一度も見たことがありません。", en:"I have never seen the movie.", b:"never", d:["not","ever"], t:"現在完了：経験（never）", h:"「一度も〜ない」は never。", lv:2},

    {ja:"彼は私たちにその本を送ってくれました。", en:"He sent us the book.", b:"sent", d:["send","sends"], t:"文型：send＋人＋物", h:"過去形は sent。", lv:3},
    {ja:"私は、泳ぐことも走ることも好きです。", en:"I like both swimming and running.", b:"both", d:["either","neither"], t:"同意文：both A and B", h:"both A and B ＝ AもBも両方。", lv:3},
    {ja:"私は疲れすぎて、家まで歩けませんでした。", en:"I was too tired to walk home.", b:"too", d:["so","very"], t:"too〜to（過去）", h:"too ＋ 形容詞 ＋ to ＋ 原形。", lv:3},
    {ja:"彼女は、先生と同じくらい上手に歌います。", en:"She sings as well as her teacher.", b:"as well", d:["as much","as big"], t:"比較：as well as（同じくらい上手に）", h:"as well as ＝「〜と同じくらい（上手に）」。", lv:3},
    {ja:"彼はテニスも野球も上手ではありません。", en:"He is neither good at tennis nor good at baseball.", b:"neither", d:["both","either"], t:"同意文：neither A nor B", h:"neither A nor B ＝ AもBも〜ない。", lv:3},

    {ja:"彼女は、その質問に答えることができませんでした。", en:"She could not answer the question.", alt:["She was not able to answer the question."], b:"could not", d:["can","could"], t:"助動詞：could not（できなかった）", h:"could not ＝「できなかった」。", lv:4},
    {ja:"私は、音楽と美術の両方が好きです。", en:"I like both music and art.", alt:["I like music and art both."], b:"both", d:["either","neither"], t:"同意文：both A and B", h:"both A and B ＝ AもBも両方。", lv:4},
    {ja:"彼は、駅まで走らなければなりませんでした。", en:"He had to run to the station.", alt:["He had to run all the way to the station."], b:"had to", d:["has to","have to"], t:"助動詞：had to（〜しなければならなかった）", h:"had to ＝ 過去の「〜しなければならなかった」。", lv:4},
    {ja:"私は、映画もコンサートも見たことがありません。", en:"I have seen neither the movie nor the concert.", alt:["I have not seen the movie or the concert."], b:"neither", d:["both","either"], t:"同意文：neither A nor B（英作文）", h:"neither A nor B ＝ AもBも〜ない。", lv:4},
    {ja:"この箱はとても重いので、私は持ち上げられません。", en:"This box is so heavy that I cannot lift it.", alt:["This box is too heavy for me to lift."], b:"so", d:["too","very"], t:"同意文：so〜that", h:"so ～ that ... cannot ＝ too ～ to ... の書きかえ。", lv:4},

    {ja:"私は若すぎて、運転できません。", en:"I am too young to drive.", alt:["I am so young that I cannot drive."], b:"too", d:["so","very"], t:"同意文：too〜to（英作文）", h:"too ～ to ＝ so ～ that ... can't。", lv:5},
    {ja:"私は、英語も数学も得意です。", en:"I am good at both English and math.", alt:["I am good at English as well as math."], b:"both", d:["either","neither"], t:"同意文：both（英作文）", h:"both A and B ＝ AもBも両方。", lv:5},
    {ja:"彼は私に、その問題を解く方法を教えてくれました。", en:"He showed me how to solve the problem.", alt:["He taught me how to solve the problem."], b:"how", d:["what","when"], t:"間接疑問：how to＋原形（英作文）", h:"how to ＋ 原形で「〜する方法」。", lv:5},
    {ja:"私は、この本をまだ読み終えていません。", en:"I have not finished reading this book yet.", alt:["I haven't finished reading this book yet."], b:"yet", d:["already","just"], t:"現在完了：not yet（英作文）", h:"not ... yet ＝「まだ〜ない」。", lv:5},
    {ja:"彼女は、先生のように英語を話します。", en:"She speaks English like a teacher.", alt:["She speaks English just like a teacher."], b:"like", d:["as","alike"], t:"比較：like（〜のように）", h:"like ＋ 名詞 ＝「〜のように」。as は「〜として」。", lv:5}
   ]}
);
