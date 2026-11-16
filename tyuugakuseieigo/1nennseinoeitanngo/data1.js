// 中1の単語 データ1：単元1〜10（各10語）
// 項目：en=英語 / ja=意味 / ex=例文（英語）/ g=まとまり名 / name=単元名
const STAGES = [
{g:"あいさつ・返事", name:"あいさつ", words:[
  {en:"hello", ja:"こんにちは", ex:"Hello, Ken. How are you?"},
  {en:"hi", ja:"やあ", ex:"Hi, Yuki! Nice to see you."},
  {en:"good morning", ja:"おはよう", ex:"Good morning, everyone."},
  {en:"good night", ja:"おやすみ", ex:"Good night, Mom."},
  {en:"goodbye", ja:"さようなら", ex:"Goodbye. See you tomorrow."},
  {en:"thank you", ja:"ありがとう", ex:"Thank you for the card."},
  {en:"please", ja:"お願いします", ex:"Please sit down."},
  {en:"yes", ja:"はい", ex:"Yes, I can do it."},
  {en:"no", ja:"いいえ", ex:"No, I'm not tired."},
  {en:"excuse me", ja:"すみません", ex:"Excuse me, where is the station?"}
]},
{g:"あいさつ・返事", name:"気持ちのことば", words:[
  {en:"sorry", ja:"ごめんなさい", ex:"I'm sorry I'm late."},
  {en:"welcome", ja:"ようこそ", ex:"Welcome to our school!"},
  {en:"sure", ja:"いいですよ", ex:"Sure, I can help you."},
  {en:"really", ja:"本当に", ex:"Really? That's great!"},
  {en:"wait", ja:"待つ", ex:"Please wait for me."},
  {en:"look", ja:"見てごらん", ex:"Look at that bird!"},
  {en:"of course", ja:"もちろん", ex:"Of course, I can come."},
  {en:"maybe", ja:"たぶん", ex:"Maybe it will rain tomorrow."},
  {en:"wow", ja:"わあ", ex:"Wow, this cake is big!"},
  {en:"oh", ja:"あら", ex:"Oh, I forgot my pen."}
]},
{g:"人・家族・体", name:"家族", words:[
  {en:"family", ja:"家族", ex:"My family is very big."},
  {en:"father", ja:"父", ex:"My father is a teacher."},
  {en:"mother", ja:"母", ex:"My mother likes cooking."},
  {en:"parents", ja:"両親", ex:"My parents work hard."},
  {en:"brother", ja:"兄・弟", ex:"My brother plays soccer."},
  {en:"sister", ja:"姉・妹", ex:"My sister is kind."},
  {en:"grandfather", ja:"祖父", ex:"My grandfather lives in Osaka."},
  {en:"grandmother", ja:"祖母", ex:"My grandmother makes good cookies."},
  {en:"uncle", ja:"おじ", ex:"My uncle has a red car."},
  {en:"aunt", ja:"おば", ex:"My aunt is a nurse."}
]},
{g:"人・家族・体", name:"人", words:[
  {en:"man", ja:"男の人", ex:"That man is my teacher."},
  {en:"woman", ja:"女の人", ex:"The woman is very kind."},
  {en:"boy", ja:"男の子", ex:"The boy is my friend."},
  {en:"girl", ja:"女の子", ex:"The girl is singing."},
  {en:"child", ja:"子ども", ex:"There are many children here."},
  {en:"friend", ja:"友だち", ex:"She is my best friend."},
  {en:"baby", ja:"赤ちゃん", ex:"The baby is sleeping."},
  {en:"people", ja:"人々", ex:"Many people came to the park."},
  {en:"person", ja:"人", ex:"He is a good person."},
  {en:"name", ja:"名前", ex:"What is your name?"}
]},
{g:"人・家族・体", name:"体", words:[
  {en:"head", ja:"頭", ex:"Touch your head."},
  {en:"face", ja:"顔", ex:"She has a big smile on her face."},
  {en:"eye", ja:"目", ex:"Please close your eyes."},
  {en:"ear", ja:"耳", ex:"Put your hand on your ear."},
  {en:"nose", ja:"鼻", ex:"The dog has a wet nose."},
  {en:"mouth", ja:"口", ex:"Open your mouth."},
  {en:"hand", ja:"手", ex:"Wash your hands."},
  {en:"arm", ja:"腕", ex:"She raised her arm."},
  {en:"leg", ja:"脚", ex:"My leg hurts."},
  {en:"foot", ja:"足", ex:"My feet are cold."}
]},
{g:"学校・学習", name:"教室のもの", words:[
  {en:"school", ja:"学校", ex:"I go to school by bus."},
  {en:"classroom", ja:"教室", ex:"Our classroom is on the second floor."},
  {en:"desk", ja:"机", ex:"Put your bag under the desk."},
  {en:"chair", ja:"椅子", ex:"Please sit on the chair."},
  {en:"blackboard", ja:"黒板", ex:"Write it on the blackboard."},
  {en:"book", ja:"本", ex:"I read a book every night."},
  {en:"notebook", ja:"ノート", ex:"Open your notebook."},
  {en:"pencil", ja:"鉛筆", ex:"Use your pencil, please."},
  {en:"bag", ja:"かばん", ex:"Where is my bag?"},
  {en:"eraser", ja:"消しゴム", ex:"Can I borrow your eraser?"}
]},
{g:"学校・学習", name:"教科・学校生活", words:[
  {en:"English", ja:"英語", ex:"I like English very much."},
  {en:"math", ja:"数学", ex:"Math is fun for me."},
  {en:"science", ja:"理科", ex:"We do experiments in science class."},
  {en:"music", ja:"音楽", ex:"We sing songs in music class."},
  {en:"art", ja:"美術", ex:"I draw pictures in art class."},
  {en:"gym", ja:"体育館", ex:"We play basketball in the gym."},
  {en:"lunch", ja:"昼ごはん", ex:"We eat lunch in the classroom."},
  {en:"class", ja:"クラス", ex:"Our class is very quiet."},
  {en:"lesson", ja:"授業", ex:"Today's English lesson was fun."},
  {en:"club", ja:"部活動", ex:"I'm in the tennis club."}
]},
{g:"学校・学習", name:"学習の動詞", words:[
  {en:"study", ja:"勉強する", ex:"I study English every day."},
  {en:"learn", ja:"習う", ex:"We learn new words."},
  {en:"teach", ja:"教える", ex:"My teacher teaches math."},
  {en:"read", ja:"読む", ex:"I read a book at night."},
  {en:"write", ja:"書く", ex:"Write your name here."},
  {en:"listen", ja:"聞く", ex:"Listen to the teacher."},
  {en:"speak", ja:"話す", ex:"Can you speak English?"},
  {en:"answer", ja:"答える", ex:"Please answer the question."},
  {en:"ask", ja:"尋ねる", ex:"Ask your friend for help."},
  {en:"practice", ja:"練習する", ex:"We practice speaking every day."}
]},
{g:"動物・自然", name:"身近な動物", words:[
  {en:"dog", ja:"犬", ex:"My dog is very cute."},
  {en:"cat", ja:"猫", ex:"The cat is sleeping on the bed."},
  {en:"bird", ja:"鳥", ex:"A bird is singing in the tree."},
  {en:"rabbit", ja:"ウサギ", ex:"I have a pet rabbit."},
  {en:"horse", ja:"馬", ex:"The horse runs very fast."},
  {en:"cow", ja:"牛", ex:"The cow gives us milk."},
  {en:"pig", ja:"豚", ex:"The pig is in the farm."},
  {en:"sheep", ja:"羊", ex:"The sheep are white."},
  {en:"fish", ja:"魚", ex:"The fish is swimming."},
  {en:"animal", ja:"動物", ex:"What is your favorite animal?"}
]}
];
