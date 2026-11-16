// 中2ワールド：ステージ1〜6（不定詞〜最上級）
// b=正解にする語句、d=まちがいの選択肢、t=つまずきタグ、h=ヒント
const STAGES = [
  {name:"不定詞①（want to・like to）",
   p:"「〜したい」は want to ＋ 動詞の原形、「〜することが好き」は like to ＋ 動詞の原形で表します。<br>to のあとは必ず動詞の原形を使います（to play）。主語が he・she でも、to のあとは原形のままです。",
   items:[
    {ja:"私は東京へ行きたいです。", en:"I want to visit Tokyo.", b:"to", d:["for","too"], t:"不定詞：want to＋原形", h:"want のあとは to ＋ 動詞の原形（visit）。"},
    {ja:"彼女は医者になりたいです。", en:"She wants to be a doctor.", b:"be", d:["is","are"], t:"不定詞：be動詞の原形", h:"to のあとは be の原形。is や are は使わないよ。"},
    {ja:"私はピアノを弾くのが好きです。", en:"I like to play the piano.", b:"like", d:["likes","liking"], t:"不定詞：like to＋原形", h:"like to ＋ 動詞の原形で「〜するのが好き」。"},
    {ja:"私たちは新しい友だちを作りたいです。", en:"We want to make new friends.", b:"make", d:["makes","making"], t:"不定詞：want to＋原形", h:"to のあとは原形（make）。"},
    {ja:"あなたは何を食べたいですか。", en:"What do you want to eat?", b:"eat", d:["eats","eating"], t:"不定詞：疑問文の中で", h:"want to のあとは原形（eat）。"},
    {ja:"彼は毎日ギターを練習したいと思っています。", en:"He wants to practice the guitar every day.", b:"practice", d:["practices","practicing"], t:"不定詞：want to＋原形", h:"he のときも to のあとは原形。三単現の s はつけないよ。"}
   ]},
  {name:"不定詞②（目的・名詞のあとのto）",
   p:"to ＋ 動詞の原形には、「〜するために」（目的）や「〜するための・〜するべき」（名詞のあとに置いて説明）の意味があります。<br>I went to the library to study.（勉強するために図書館へ行った）<br>I have a lot of homework to do.（するべき宿題がたくさんある）",
   items:[
    {ja:"私は勉強するために図書館へ行きました。", en:"I went to the library to study.", b:"to study", d:["studied","studying"], t:"不定詞：目的（〜するために）", h:"「〜するために」は to ＋ 動詞の原形。"},
    {ja:"私はしなければならない宿題がたくさんあります。", en:"I have a lot of homework to do.", b:"to do", d:["does","doing"], t:"不定詞：名詞のあとで「〜するべき」", h:"homework のあとに to do（するべき宿題）。"},
    {ja:"私の夢は医者になることです。", en:"My dream is to become a doctor.", b:"to become", d:["become","becoming"], t:"不定詞：名詞の働き（〜すること）", h:"「〜すること」は to ＋ 原形。"},
    {ja:"私は何か飲むものがほしいです。", en:"I want something to drink.", b:"to drink", d:["drinks","drinking"], t:"不定詞：名詞のあとで「〜するもの」", h:"something のあとに to drink（飲むもの）。"},
    {ja:"彼女は宿題をするために早く起きました。", en:"She got up early to do her homework.", b:"to do", d:["does","doing"], t:"不定詞：目的（〜するために）", h:"「〜するために」の to は原形（do）。"},
    {ja:"私は読む本が1冊ほしいです。", en:"I need a book to read.", b:"to read", d:["reads","reading"], t:"不定詞：名詞のあとで「〜するもの」", h:"a book のあとに to read（読むための本）。"}
   ]},
  {name:"動名詞（〜すること）",
   p:"動詞に ing をつけると「〜すること」の意味になり、名詞と同じ働きをします。<br>例：Playing soccer is fun.（サッカーをすることは楽しい）<br>enjoy ＋ -ing（〜することを楽しむ）、stop ＋ -ing（〜するのをやめる）、finish ＋ -ing（〜し終える）",
   items:[
    {ja:"私は音楽を聞くことが好きです。", en:"I enjoy listening to music.", b:"listening", d:["listen","listens"], t:"動名詞：enjoy＋-ing", h:"enjoy のあとは -ing の形（listening）。"},
    {ja:"泳ぐことは楽しいです。", en:"Swimming is fun.", b:"Swimming", d:["Swim","Swims"], t:"動名詞：主語になる", h:"「〜すること」が主語のときは ing の形。"},
    {ja:"彼はゲームをするのをやめました。", en:"He stopped playing games.", b:"playing", d:["play","played"], t:"動名詞：stop＋-ing", h:"stop のあとは -ing（〜するのをやめる）。"},
    {ja:"私の趣味は写真をとることです。", en:"My hobby is taking pictures.", b:"taking", d:["take","takes"], t:"動名詞：補語になる", h:"「〜すること」は ing の形。take → taking。"},
    {ja:"私は毎日、部屋をそうじし終えます。", en:"I finish cleaning my room every day.", b:"cleaning", d:["clean","cleans"], t:"動名詞：finish＋-ing", h:"finish のあとは -ing（〜し終える）。"},
    {ja:"宿題を終えることは大変です。", en:"Finishing homework is hard.", b:"Finishing", d:["Finish","Finished"], t:"動名詞：主語になる", h:"主語の「〜すること」は ing の形。"}
   ]},
  {name:"助動詞 will（未来・意志）",
   p:"will ＋ 動詞の原形で「〜でしょう」（未来の予想）や「〜するつもり」（その場で決めた意志）を表します。<br>will のあとは主語が変わっても原形。否定文は will not（won't）、疑問文は Will を文のはじめに置きます。<br>答えは Yes, I will. ／ No, I won't.",
   items:[
    {ja:"明日は晴れるでしょう。", en:"It will be sunny tomorrow.", b:"will", d:["is","does"], t:"will：未来（〜でしょう）", h:"未来の予想は will ＋ 原形（be）。"},
    {ja:"私が手伝います。", en:"I will help you.", b:"will", d:["am","do"], t:"will：意志（〜するつもり）", h:"その場で決めたことは will。"},
    {ja:"彼女は明日来ないでしょう。", en:"She will not come tomorrow.", b:"not", d:["no","doesn't"], t:"will：否定文（will not）", h:"will のあとに not を入れるよ。"},
    {ja:"あなたは来年、日本に来ますか。", en:"Will you come to Japan next year?", b:"Will", d:["Do","Are"], t:"will：疑問文", h:"疑問文は Will を文のはじめに出す。"},
    {ja:"明日は雨が降るでしょう。", en:"It will rain tomorrow.", b:"rain", d:["rains","rained"], t:"will：あとは原形", h:"will のあとは主語が変わっても原形（rain）。"},
    {ja:"私は次の夏に富士山に登るつもりです。", en:"I will climb Mount Fuji next summer.", b:"climb", d:["climbs","climbing"], t:"will：意志（〜するつもり）", h:"will のあとは原形（climb）。"}
   ]},
  {name:"比較級（〜より…だ）",
   p:"「AよりBの方が〜だ」は、形容詞に -er（短い語）または more（長い語）をつけ、than（〜より）を使います。<br>例：taller than ／ more interesting than<br>big → bigger（子音を重ねる）、fast → faster、good → better（不規則）",
   items:[
    {ja:"私は兄より背が高いです。", en:"I am taller than my brother.", b:"taller", d:["tall","tallest"], t:"比較級：-er（短い語）", h:"「〜より背が高い」は taller than。"},
    {ja:"この本はあの本より面白いです。", en:"This book is more interesting than that one.", b:"more", d:["most","much"], t:"比較級：more（長い語）", h:"interesting のような長い語は more をつける。"},
    {ja:"今日は昨日より寒いです。", en:"Today is colder than yesterday.", b:"colder", d:["cold","coldest"], t:"比較級：-er（短い語）", h:"cold → colder（-er をつける）。"},
    {ja:"私は英語を数学より好きです。", en:"I like English better than math.", b:"better", d:["good","best"], t:"比較級：不規則（better）", h:"good → better（不規則に変わる）。"},
    {ja:"電車はバスより速いです。", en:"A train is faster than a bus.", b:"faster", d:["fast","fastest"], t:"比較級：-er（短い語）", h:"fast（速い）→ faster。"},
    {ja:"東京は大阪より大きいです。", en:"Tokyo is bigger than Osaka.", b:"bigger", d:["big","biggest"], t:"比較級：子音を重ねる", h:"big は g を重ねて bigger。"}
   ]},
  {name:"最上級（一番〜だ）",
   p:"「〜で一番…」は the ＋ 形容詞の -est（短い語）、または the most ＋ 長い語で表します。<br>例：the tallest in my class ／ the most popular in Japan<br>good → the best、big → the biggest、high → the highest",
   items:[
    {ja:"彼女はクラスで一番背が高いです。", en:"She is the tallest in her class.", b:"tallest", d:["taller","tall"], t:"最上級：-est（短い語）", h:"「一番〜」は the ＋ -est。"},
    {ja:"これは一番わくわくする映画です。", en:"This is the most exciting movie.", b:"most", d:["more","best"], t:"最上級：the most＋長い語", h:"exciting のような長い語は the most。"},
    {ja:"彼は私たちの中で一番速く走ります。", en:"He runs the fastest of us all.", b:"fastest", d:["faster","fast"], t:"最上級：-est（短い語）", h:"fast → the fastest（一番速い）。"},
    {ja:"これは私が今まで食べた中で一番おいしいケーキです。", en:"This is the best cake I have ever eaten.", b:"best", d:["good","better"], t:"最上級：不規則（best）", h:"good → the best（一番よい）。"},
    {ja:"富士山は日本で一番高い山です。", en:"Mount Fuji is the highest mountain in Japan.", b:"highest", d:["higher","high"], t:"最上級：-est（短い語）", h:"high → the highest（一番高い）。"},
    {ja:"私たちの学校で一番大きい体育館です。", en:"This is the biggest gym in our school.", b:"biggest", d:["bigger","big"], t:"最上級：子音を重ねる", h:"big は g を重ねて biggest。"}
   ]}
];
