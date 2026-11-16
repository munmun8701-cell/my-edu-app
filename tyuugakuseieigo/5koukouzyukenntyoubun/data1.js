// 長文読解：★1・★2の本文と設問（本文はすべて作成したオリジナル）
// qs: type=choice（3択：ok が正解、d が不正解）／eq（英問英答：answers のどれかに一致で正解）
const READ = [
  {lv:1, title:"ケンと犬のポチ",
   passage:"Ken has a dog. Its name is Pochi. Pochi is brown and very cute. Every morning, Ken takes Pochi to the park. They run together. Pochi likes the park very much.",
   qs:[
    {q:"ケンの犬の名前は何ですか。", ok:"ポチ", d:["ケン","公園"], t:"内容一致（名前）", h:"2文目の Its name is Pochi. に書いてあります。"},
    {q:"ケンは毎朝、どこへ行きますか。", ok:"公園", d:["学校","駅"], t:"内容一致（場所）", h:"Every morning, Ken takes Pochi to the park. を読みます。"},
    {q:"ポチはどんな犬ですか。", ok:"茶色でかわいい", d:["白くて大きい","黒くてこわい"], t:"内容一致（様子）", h:"Pochi is brown and very cute. に書いてあります。"}
   ]},
  {lv:1, title:"ユキの通学",
   passage:"Yuki is a student. She goes to school by bike. Her school starts at eight-thirty. She likes math because it is fun.",
   qs:[
    {q:"ユキは何で学校に行きますか。", ok:"自転車", d:["バス","電車"], t:"内容一致（手段）", h:"by bike は「自転車で」という意味です。"},
    {q:"ユキの学校は何時半に始まりますか。", ok:"8時半", d:["7時半","9時半"], t:"内容一致（時刻）", h:"eight-thirty は8時半です。"},
    {eq:true, q:"Why does Yuki like math? （英語で答えなさい）", answers:["Because it is fun.","It is fun."], t:"英問英答（理由）", h:"because it is fun（楽しいから）と答えます。"}
   ]},
  {lv:2, title:"動物園の日",
   passage:"Last Sunday, my family went to the zoo. We saw many animals. The elephants were the biggest. My little brother loved them. He said, “They are so big!” After lunch, we went to the flower garden. It was very beautiful. I took many pictures there.",
   qs:[
    {q:"My little brother loved them. の them が指すものは何ですか。", ok:"ゾウ", d:["動物園","花"], t:"指示語（them）", h:"them は直前の文の The elephants（ゾウ）を指します。"},
    {q:"家族が動物園に行ったのはいつですか。", ok:"先週の日曜日", d:["昨日","今朝"], t:"内容一致（時）", h:"Last Sunday（先週の日曜日）です。"},
    {q:"花の庭園で「私」がしたことは何ですか。", ok:"写真をとった", d:["ゾウを見た","昼ごはんを食べた"], t:"内容一致（出来事）", h:"I took many pictures there. に書いてあります。"}
   ]},
  {lv:2, title:"朝ごはんのこと",
   passage:"Many people think that a good breakfast gives us energy. However, some people skip breakfast because they are busy. This can make them tired in the morning. Eating even a small piece of bread or a banana is a good way to start the day. It helps us to think better at school.",
   qs:[
    {q:"下線の This が指す内容は何ですか。（This can make them tired の This）", ok:"朝ごはんを食べないこと", d:["パンを食べること","学校に行くこと"], t:"指示語（This）", h:"This は直前の「朝ごはんを抜くこと（skip breakfast）」を指します。"},
    {q:"筆者によると、朝に少しでも食べるとどうなりますか。", ok:"一日を良いスタートにできる", d:["眠くなる","お金がかかる"], t:"内容一致（効果）", h:"a good way to start the day（一日を始める良い方法）と書いてあります。"},
    {q:"本文の内容と合うものはどれですか。", ok:"忙しい人は朝食をとらないことがある", d:["ほとんどの人は朝食を食べない","朝食は学校では役立たない"], t:"内容一致（本文全体）", h:"some people skip breakfast because they are busy. と書いてあります。"}
   ]}
];
