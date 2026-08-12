/* =========================================================================
   English Town Simulator 3D - Ultimate Edition V3 (Stable / Full Visuals)
   - Bug Fix: Restored missing localStorage utility functions
   - Render Engine: Safe guards added for arrays, robust initialization
   - Includes all 700 words, 50 gamification ideas, and beautiful UI
========================================================================= */

// 全700単語データ (省略一切なし)
const VOCABULARY = [
  { en: "year", jp: "年" },
  { en: "month", jp: "月" },
  { en: "week", jp: "週" },
  { en: "day", jp: "日" },
  { en: "today", jp: "今日" },
  { en: "tomorrow", jp: "明日" },
  { en: "date", jp: "日付" },
  { en: "time", jp: "時こく・時間" },
  { en: "hour", jp: "1時間・時こく" },
  { en: "minute", jp: "分" },
  { en: "morning", jp: "朝" },
  { en: "noon", jp: "正午・真昼" },
  { en: "afternoon", jp: "午後" },
  { en: "evening", jp: "晩・夕方" },
  { en: "night", jp: "夜" },
  { en: "a.m.", jp: "午前" },
  { en: "p.m.", jp: "午後" },
  { en: "weekend", jp: "週末" },
  { en: "New Year's Day", jp: "元日・正月" },
  { en: "Dolls' Festival", jp: "ひなまつり" },
  { en: "Children's Day", jp: "こどもの日" },
  { en: "Christmas", jp: "クリスマス" },
  { en: "New Year's Eve", jp: "大みそか" },
  { en: "vacation", jp: "休み・休日" },
  { en: "birthday", jp: "誕生日" },
  { en: "present", jp: "プレゼント" },
  { en: "party", jp: "パーティー" },
  { en: "Monday", jp: "月曜日" },
  { en: "Tuesday", jp: "火曜日" },
  { en: "Wednesday", jp: "水曜日" },
  { en: "Thursday", jp: "木曜日" },
  { en: "Friday", jp: "金曜日" },
  { en: "Saturday", jp: "土曜日" },
  { en: "Sunday", jp: "日曜日" },
  { en: "spring", jp: "春" },
  { en: "summer", jp: "夏" },
  { en: "autumn", jp: "秋" },
  { en: "fall", jp: "秋・落ちる" },
  { en: "winter", jp: "冬" },
  { en: "January", jp: "1月" },
  { en: "February", jp: "2月" },
  { en: "March", jp: "3月" },
  { en: "April", jp: "4月" },
  { en: "May", jp: "5月" },
  { en: "June", jp: "6月" },
  { en: "July", jp: "7月" },
  { en: "August", jp: "8月" },
  { en: "September", jp: "9月" },
  { en: "October", jp: "10月" },
  { en: "November", jp: "11月" },
  { en: "December", jp: "12月" },
  { en: "one", jp: "1" },
  { en: "two", jp: "2" },
  { en: "three", jp: "3" },
  { en: "four", jp: "4" },
  { en: "five", jp: "5" },
  { en: "six", jp: "6" },
  { en: "seven", jp: "7" },
  { en: "eight", jp: "8" },
  { en: "nine", jp: "9" },
  { en: "ten", jp: "10" },
  { en: "eleven", jp: "11" },
  { en: "twelve", jp: "12" },
  { en: "thirteen", jp: "13" },
  { en: "fourteen", jp: "14" },
  { en: "fifteen", jp: "15" },
  { en: "sixteen", jp: "16" },
  { en: "seventeen", jp: "17" },
  { en: "eighteen", jp: "18" },
  { en: "nineteen", jp: "19" },
  { en: "twenty", jp: "20" },
  { en: "thirty", jp: "30" },
  { en: "forty", jp: "40" },
  { en: "fifty", jp: "50" },
  { en: "sixty", jp: "60" },
  { en: "seventy", jp: "70" },
  { en: "eighty", jp: "80" },
  { en: "ninety", jp: "90" },
  { en: "hundred", jp: "100" },
  { en: "thousand", jp: "1000" },
  { en: "zero", jp: "0" },
  { en: "first", jp: "1日・1番目の" },
  { en: "second", jp: "2日・2番目の" },
  { en: "third", jp: "3日・3番目の" },
  { en: "fourth", jp: "4日・4番目の" },
  { en: "fifth", jp: "5日・5番目の" },
  { en: "sixth", jp: "6日・6番目の" },
  { en: "seventh", jp: "7日・7番目の" },
  { en: "eighth", jp: "8日・8番目の" },
  { en: "ninth", jp: "9日・9番目の" },
  { en: "tenth", jp: "10日・10番目の" },
  { en: "eleventh", jp: "11日・11番目の" },
  { en: "twelfth", jp: "12日・12番目の" },
  { en: "thirteenth", jp: "13日・13番目の" },
  { en: "fourteenth", jp: "14日・14番目の" },
  { en: "fifteenth", jp: "15日・15番目の" },
  { en: "sixteenth", jp: "16日・16番目の" },
  { en: "seventeenth", jp: "17日・17番目の" },
  { en: "eighteenth", jp: "18日・18番目の" },
  { en: "nineteenth", jp: "19日・19番目の" },
  { en: "twentieth", jp: "20日・20番目の" },
  { en: "twenty-first", jp: "21日・21番目の" },
  { en: "twenty-second", jp: "22日・22番目の" },
  { en: "twenty-third", jp: "23日・23番目の" },
  { en: "twenty-fourth", jp: "24日・24番目の" },
  { en: "twenty-fifth", jp: "25日・25番目の" },
  { en: "twenty-sixth", jp: "26日・26番目の" },
  { en: "twenty-seventh", jp: "27日・27番目の" },
  { en: "twenty-eighth", jp: "28日・28番目の" },
  { en: "twenty-ninth", jp: "29日・29番目の" },
  { en: "thirtieth", jp: "30日・30番目の" },
  { en: "thirty-first", jp: "31日・31番目の" },
  { en: "breakfast", jp: "朝ご飯" },
  { en: "lunch", jp: "昼ご飯" },
  { en: "snack", jp: "おやつ" },
  { en: "dinner", jp: "晩ご飯" },
  { en: "meal", jp: "食事" },
  { en: "food", jp: "食べ物" },
  { en: "hamburger", jp: "ハンバーガー" },
  { en: "pizza", jp: "ピザ" },
  { en: "spaghetti", jp: "スパゲッティ" },
  { en: "steak", jp: "ステーキ" },
  { en: "salad", jp: "サラダ" },
  { en: "noodle", jp: "麺類" },
  { en: "egg", jp: "卵" },
  { en: "rice ball", jp: "おにぎり" },
  { en: "soup", jp: "スープ" },
  { en: "pie", jp: "パイ" },
  { en: "sandwich", jp: "サンドイッチ" },
  { en: "sausage", jp: "ソーセージ" },
  { en: "omelet", jp: "オムレツ" },
  { en: "curry", jp: "カレー" },
  { en: "rice", jp: "米・ご飯" },
  { en: "bread", jp: "パン" },
  { en: "meat", jp: "肉" },
  { en: "vegetable", jp: "野菜" },
  { en: "cucumber", jp: "きゅうり" },
  { en: "carrot", jp: "にんじん" },
  { en: "lettuce", jp: "レタス" },
  { en: "cabbage", jp: "キャベツ" },
  { en: "corn", jp: "とうもろこし" },
  { en: "radish", jp: "ラディッシュ" },
  { en: "broccoli", jp: "ブロッコリ" },
  { en: "pumpkin", jp: "かぼちゃ" },
  { en: "tomato", jp: "トマト" },
  { en: "onion", jp: "玉ねぎ" },
  { en: "potato", jp: "じゃがいも" },
  { en: "mushroom", jp: "マッシュルーム" },
  { en: "fruit", jp: "果物" },
  { en: "apple", jp: "りんご" },
  { en: "strawberry", jp: "いちご" },
  { en: "grapes", jp: "ぶどう" },
  { en: "pineapple", jp: "パイナップル" },
  { en: "peach", jp: "もも" },
  { en: "melon", jp: "メロン" },
  { en: "banana", jp: "バナナ" },
  { en: "kiwi fruit", jp: "キウィ" },
  { en: "lemon", jp: "レモン" },
  { en: "cherry", jp: "さくらんぼ" },
  { en: "watermelon", jp: "すいか" },
  { en: "dessert", jp: "デザート" },
  { en: "ice cream", jp: "アイスクリーム" },
  { en: "pudding", jp: "プリン" },
  { en: "parfait", jp: "パフェ" },
  { en: "cake", jp: "ケーキ" },
  { en: "donut", jp: "ドーナツ" },
  { en: "candy", jp: "キャンディ" },
  { en: "chocolate", jp: "チョコレート" },
  { en: "jam", jp: "ジャム" },
  { en: "yogurt", jp: "ヨーグルト" },
  { en: "water", jp: "水" },
  { en: "milk", jp: "牛乳" },
  { en: "juice", jp: "ジュース" },
  { en: "coffee", jp: "コーヒー" },
  { en: "tea", jp: "紅茶・茶" },
  { en: "green tea", jp: "緑茶" },
  { en: "plate", jp: "さら" },
  { en: "dish", jp: "さら" },
  { en: "chopsticks", jp: "はし" },
  { en: "spoon", jp: "スプーン" },
  { en: "fork", jp: "フォーク" },
  { en: "glass", jp: "コップ" },
  { en: "cup", jp: "カップ" },
  { en: "animal", jp: "動物" },
  { en: "dog", jp: "犬" },
  { en: "cat", jp: "ネコ" },
  { en: "panda", jp: "パンダ" },
  { en: "mouse", jp: "ネズミ" },
  { en: "bear", jp: "熊" },
  { en: "elephant", jp: "象" },
  { en: "horse", jp: "馬" },
  { en: "cow", jp: "牛" },
  { en: "tiger", jp: "トラ" },
  { en: "sheep", jp: "羊" },
  { en: "chicken", jp: "ニワトリ" },
  { en: "gorilla", jp: "ゴリラ" },
  { en: "monkey", jp: "サル" },
  { en: "pig", jp: "ブタ" },
  { en: "rabbit", jp: "ウサギ" },
  { en: "goat", jp: "ヤギ" },
  { en: "lion", jp: "ライオン" },
  { en: "fox", jp: "キツネ" },
  { en: "zebra", jp: "シマウマ" },
  { en: "wolf", jp: "オオカミ" },
  { en: "koala", jp: "コアラ" },
  { en: "whale", jp: "クジラ" },
  { en: "dolphin", jp: "イルカ" },
  { en: "bird", jp: "鳥" },
  { en: "snake", jp: "ヘビ" },
  { en: "fish", jp: "魚" },
  { en: "spider", jp: "クモ" },
  { en: "ant", jp: "アリ" },
  { en: "dragon", jp: "ドラゴン・龍" },
  { en: "color", jp: "色" },
  { en: "red", jp: "赤" },
  { en: "blue", jp: "青" },
  { en: "green", jp: "緑" },
  { en: "yellow", jp: "黄色" },
  { en: "pink", jp: "ピンク" },
  { en: "black", jp: "黒" },
  { en: "white", jp: "白" },
  { en: "orange", jp: "オレンジ色" },
  { en: "purple", jp: "むらさき色" },
  { en: "brown", jp: "茶色" },
  { en: "circle", jp: "丸" },
  { en: "triangle", jp: "三角" },
  { en: "cross", jp: "十字形・×印" },
  { en: "heart", jp: "ハート・心臓" },
  { en: "square", jp: "四角" },
  { en: "star", jp: "星" },
  { en: "diamond", jp: "ひし形・ダイヤモンド" },
  { en: "line", jp: "線" },
  { en: "dollar", jp: "ドル" },
  { en: "yen", jp: "円" },
  { en: "meter", jp: "メートル" },
  { en: "centimeter", jp: "センチメートル" },
  { en: "kilogram", jp: "キログラム" },
  { en: "sport", jp: "スポーツ" },
  { en: "soccer", jp: "サッカー" },
  { en: "baseball", jp: "野球" },
  { en: "basketball", jp: "バスケットボール" },
  { en: "swimming", jp: "水泳" },
  { en: "volleyball", jp: "バレーボール" },
  { en: "table tennis", jp: "卓球" },
  { en: "badminton", jp: "バドミントン" },
  { en: "football", jp: "フットボール" },
  { en: "tennis", jp: "テニス" },
  { en: "dodgeball", jp: "ドッジボール" },
  { en: "ball", jp: "ボール" },
  { en: "racket", jp: "ラケット" },
  { en: "bat", jp: "バット" },
  { en: "jumprope", jp: "なわとびのなわ" },
  { en: "bicycle", jp: "自転車" },
  { en: "bike", jp: "自転車" },
  { en: "club", jp: "クラブ" },
  { en: "team", jp: "チーム" },
  { en: "member", jp: "メンバー" },
  { en: "fishing", jp: "魚つり" },
  { en: "dancing", jp: "ダンス" },
  { en: "jogging", jp: "ジョギング" },
  { en: "cooking", jp: "料理" },
  { en: "reading", jp: "読書" },
  { en: "shopping", jp: "買い物" },
  { en: "walking", jp: "ウォーキング・散歩" },
  { en: "hiking", jp: "ハイキング" },
  { en: "camping", jp: "キャンプ" },
  { en: "running", jp: "ランニング" },
  { en: "tag", jp: "おにごっこ" },
  { en: "bingo", jp: "ビンゴ" },
  { en: "game", jp: "ゲーム・試合" },
  { en: "card", jp: "カード・トランプ" },
  { en: "king", jp: "キング・王" },
  { en: "queen", jp: "クイーン・女王" },
  { en: "balloon", jp: "風船" },
  { en: "hint", jp: "ヒント" },
  { en: "dice", jp: "サイコロ" },
  { en: "yo-yo", jp: "ヨーヨー" },
  { en: "toy", jp: "おもちゃ" },
  { en: "firework", jp: "花火" },
  { en: "nature", jp: "自然" },
  { en: "sky", jp: "空" },
  { en: "sun", jp: "太陽" },
  { en: "moon", jp: "月" },
  { en: "rainbow", jp: "にじ" },
  { en: "flower", jp: "花" },
  { en: "tree", jp: "木" },
  { en: "mountain", jp: "山" },
  { en: "lake", jp: "湖" },
  { en: "river", jp: "川" },
  { en: "sea", jp: "海" },
  { en: "beach", jp: "海岸" },
  { en: "jungle", jp: "ジャングル" },
  { en: "weather", jp: "天気" },
  { en: "snow", jp: "雪" },
  { en: "rain", jp: "雨" },
  { en: "head", jp: "頭" },
  { en: "eyes", jp: "目" },
  { en: "ears", jp: "耳" },
  { en: "nose", jp: "鼻" },
  { en: "mouth", jp: "口" },
  { en: "teeth", jp: "歯" },
  { en: "shoulders", jp: "肩" },
  { en: "knees", jp: "ひざ" },
  { en: "toes", jp: "つま先" },
  { en: "hand", jp: "手" },
  { en: "leg", jp: "足" },
  { en: "T-shirt", jp: "Tシャツ" },
  { en: "shirt", jp: "シャツ" },
  { en: "shorts", jp: "半ズボン" },
  { en: "sweater", jp: "セーター" },
  { en: "pants", jp: "ズボン" },
  { en: "cap", jp: "帽子(野球帽など)" },
  { en: "hat", jp: "帽子(縁のあるもの)" },
  { en: "shoes", jp: "くつ" },
  { en: "boots", jp: "長ぐつ・ブーツ" },
  { en: "glasses", jp: "めがね" },
  { en: "bag", jp: "かばん・バッグ" },
  { en: "umbrella", jp: "かさ" },
  { en: "house", jp: "家" },
  { en: "home", jp: "家・家庭" },
  { en: "door", jp: "ドア" },
  { en: "window", jp: "窓" },
  { en: "wall", jp: "壁" },
  { en: "room", jp: "部屋" },
  { en: "table", jp: "テーブル" },
  { en: "desk", jp: "机" },
  { en: "chair", jp: "いす" },
  { en: "mat", jp: "マット" },
  { en: "picture", jp: "写真・絵" },
  { en: "TV", jp: "テレビ" },
  { en: "bath", jp: "ふろ" },
  { en: "bed", jp: "ベッド" },
  { en: "clock", jp: "時計" },
  { en: "calendar", jp: "カレンダー" },
  { en: "book", jp: "本" },
  { en: "watch", jp: "うで時計" },
  { en: "box", jp: "箱" },
  { en: "telephone", jp: "電話機" },
  { en: "basket", jp: "かご" },
  { en: "computer", jp: "コンピューター" },
  { en: "newspaper", jp: "新聞" },
  { en: "garbage", jp: "ごみ" },
  { en: "piggy bank", jp: "貯金箱" },
  { en: "pencil", jp: "えんぴつ" },
  { en: "eraser", jp: "消しゴム" },
  { en: "ruler", jp: "定規" },
  { en: "crayon", jp: "クレヨン" },
  { en: "glue stick", jp: "スティックのり" },
  { en: "scissors", jp: "はさみ" },
  { en: "pen", jp: "ペン" },
  { en: "stapler", jp: "ホッチキス" },
  { en: "magnet", jp: "磁石・マグネット" },
  { en: "marker", jp: "マーカー" },
  { en: "pencil sharpener", jp: "えんぴつけずり" },
  { en: "pencil case", jp: "筆箱" },
  { en: "notebook", jp: "ノート" },
  { en: "chalk", jp: "チョーク" },
  { en: "ink", jp: "インク" },
  { en: "map", jp: "地図" },
  { en: "drum", jp: "たいこ・ドラム" },
  { en: "violin", jp: "バイオリン" },
  { en: "recorder", jp: "リコーダー" },
  { en: "piano", jp: "ピアノ" },
  { en: "flute", jp: "フルート" },
  { en: "guitar", jp: "ギター" },
  { en: "school", jp: "学校" },
  { en: "classroom", jp: "教室" },
  { en: "class", jp: "クラス" },
  { en: "playground", jp: "運動場・遊び場" },
  { en: "gym", jp: "体育館" },
  { en: "library", jp: "図書館" },
  { en: "pool", jp: "プール" },
  { en: "name", jp: "名前" },
  { en: "teacher", jp: "先生" },
  { en: "student", jp: "生徒" },
  { en: "subject", jp: "教科" },
  { en: "Japanese", jp: "国語・日本語" },
  { en: "English", jp: "英語" },
  { en: "math", jp: "算数・数学" },
  { en: "science", jp: "理科・科学" },
  { en: "social studies", jp: "社会" },
  { en: "music", jp: "音楽" },
  { en: "arts and crafts", jp: "図工" },
  { en: "P.E.", jp: "体育" },
  { en: "alphabet", jp: "アルファベット" },
  { en: "calligraphy", jp: "習字・書道" },
  { en: "textbook", jp: "教科書" },
  { en: "test", jp: "テスト" },
  { en: "homework", jp: "宿題" },
  { en: "letter", jp: "手紙・文字" },
  { en: "place", jp: "場所" },
  { en: "city", jp: "都市・市" },
  { en: "town", jp: "市・町" },
  { en: "shop", jp: "店" },
  { en: "garden", jp: "庭" },
  { en: "bookstore", jp: "本屋" },
  { en: "gas station", jp: "ガソリンスタンド" },
  { en: "police station", jp: "警察署" },
  { en: "post office", jp: "郵便局" },
  { en: "hospital", jp: "病院" },
  { en: "supermarket", jp: "スーパーマーケット" },
  { en: "restaurant", jp: "レストラン" },
  { en: "amusement park", jp: "遊園地" },
  { en: "aquarium", jp: "水族館" },
  { en: "castle", jp: "城" },
  { en: "park", jp: "公園" },
  { en: "stadium", jp: "競技場" },
  { en: "zoo", jp: "動物園" },
  { en: "station", jp: "駅" },
  { en: "street", jp: "通り" },
  { en: "car", jp: "自動車" },
  { en: "bus", jp: "バス" },
  { en: "taxi", jp: "タクシー" },
  { en: "train", jp: "電車・列車" },
  { en: "ship", jp: "船" },
  { en: "plane", jp: "飛行機" },
  { en: "corner", jp: "交差点・かど" },
  { en: "block", jp: "一区画" },
  { en: "family", jp: "家族" },
  { en: "father", jp: "父" },
  { en: "mother", jp: "母" },
  { en: "sister", jp: "姉・妹" },
  { en: "brother", jp: "兄・弟" },
  { en: "son", jp: "息子" },
  { en: "daughter", jp: "娘" },
  { en: "aunt", jp: "おば" },
  { en: "uncle", jp: "おじ" },
  { en: "grandfather", jp: "祖父" },
  { en: "grandmother", jp: "祖母" },
  { en: "child", jp: "子" },
  { en: "friend", jp: "友達" },
  { en: "man", jp: "男の人" },
  { en: "woman", jp: "女の人" },
  { en: "boy", jp: "男の子" },
  { en: "girl", jp: "女の子" },
  { en: "people", jp: "人々" },
  { en: "baseball player", jp: "野球選手" },
  { en: "doctor", jp: "医者" },
  { en: "fire fighter", jp: "消防士" },
  { en: "police officer", jp: "警察官" },
  { en: "artist", jp: "芸術家" },
  { en: "astronaut", jp: "宇宙飛行士" },
  { en: "baker", jp: "パン職人" },
  { en: "bus driver", jp: "バスの運転手" },
  { en: "farmer", jp: "農場主・農夫" },
  { en: "pianist", jp: "ピアニスト" },
  { en: "pilot", jp: "パイロット" },
  { en: "singer", jp: "歌手" },
  { en: "world", jp: "世界" },
  { en: "America", jp: "アメリカ・米国" },
  { en: "Australia", jp: "オーストラリア" },
  { en: "Belgium", jp: "ベルギー" },
  { en: "Brazil", jp: "ブラジル" },
  { en: "Canada", jp: "カナダ" },
  { en: "China", jp: "中国" },
  { en: "Egypt", jp: "エジプト" },
  { en: "Finland", jp: "フィンランド" },
  { en: "France", jp: "フランス" },
  { en: "Germany", jp: "ドイツ" },
  { en: "India", jp: "インド" },
  { en: "Ireland", jp: "アイルランド" },
  { en: "Italy", jp: "イタリア" },
  { en: "Japan", jp: "日本" },
  { en: "Korea", jp: "韓国・朝鮮" },
  { en: "Peru", jp: "ペルー" },
  { en: "Russia", jp: "ロシア" },
  { en: "Spain", jp: "スペイン" },
  { en: "Thailand", jp: "タイ" },
  { en: "the UK", jp: "英国" },
  { en: "Malaysia", jp: "マレーシア" },
  { en: "Norway", jp: "ノルウェー" },
  { en: "Turkey", jp: "トルコ" },
  { en: "Vietnam", jp: "ベトナム" },
  { en: "big", jp: "大きい" },
  { en: "small", jp: "小さい" },
  { en: "long", jp: "長い" },
  { en: "short", jp: "短い" },
  { en: "new", jp: "新しい" },
  { en: "old", jp: "古い" },
  { en: "soft", jp: "やわらかい" },
  { en: "hard", jp: "かたい" },
  { en: "slow", jp: "おそい" },
  { en: "fast", jp: "速い" },
  { en: "shiny", jp: "光る" },
  { en: "scary", jp: "こわい" },
  { en: "round", jp: "丸い" },
  { en: "beautiful", jp: "美しい" },
  { en: "nice", jp: "素敵な・親切な" },
  { en: "high", jp: "高い" },
  { en: "busy", jp: "いそがしい" },
  { en: "special", jp: "特別な" },
  { en: "fantastic", jp: "素晴らしい" },
  { en: "last", jp: "最後の・この前の" },
  { en: "great", jp: "偉大な・大きな" },
  { en: "wonderful", jp: "素晴らしい" },
  { en: "famous", jp: "有名な" },
  { en: "best", jp: "最高の" },
  { en: "main", jp: "主な" },
  { en: "fun", jp: "楽しい" },
  { en: "exciting", jp: "興奮させる" },
  { en: "favorite", jp: "好きな" },
  { en: "all", jp: "全部の" },
  { en: "many", jp: "多くの・たくさんの" },
  { en: "much", jp: "たくさんの" },
  { en: "good", jp: "良い" },
  { en: "bad", jp: "悪い" },
  { en: "fine", jp: "素晴らしい・元気な" },
  { en: "happy", jp: "幸せな" },
  { en: "sad", jp: "悲しい" },
  { en: "sleepy", jp: "ねむい" },
  { en: "hungry", jp: "空腹な" },
  { en: "tired", jp: "つかれた" },
  { en: "friendly", jp: "親しみのある" },
  { en: "kind", jp: "思いやりのある" },
  { en: "brave", jp: "勇かんな" },
  { en: "funny", jp: "おもしろい" },
  { en: "strong", jp: "強い" },
  { en: "bitter", jp: "苦い" },
  { en: "sour", jp: "すっぱい" },
  { en: "salty", jp: "塩からい" },
  { en: "sweet", jp: "あまい" },
  { en: "delicious", jp: "おいしい" },
  { en: "yummy", jp: "おいしい" },
  { en: "fresh", jp: "新鮮な" },
  { en: "sunny", jp: "晴れた" },
  { en: "rainy", jp: "雨の降る" },
  { en: "cloudy", jp: "曇りの" },
  { en: "snowy", jp: "雪の降る" },
  { en: "hot", jp: "暑い・熱い" },
  { en: "cold", jp: "寒い・冷たい" },
  { en: "cool", jp: "涼しい・冷えた" },
  { en: "warm", jp: "あたたかい" },
  { en: "I", jp: "私は" },
  { en: "my", jp: "私の" },
  { en: "me", jp: "私を(に)" },
  { en: "mine", jp: "私のもの" },
  { en: "you", jp: "あなたは・あなたを" },
  { en: "your", jp: "あなたの" },
  { en: "yours", jp: "あなたのもの" },
  { en: "he", jp: "彼は" },
  { en: "his", jp: "彼の・彼のもの" },
  { en: "him", jp: "彼を(に)" },
  { en: "she", jp: "彼女は" },
  { en: "her", jp: "彼女の" },
  { en: "hers", jp: "彼女のもの" },
  { en: "we", jp: "私たちは" },
  { en: "our", jp: "私たちの" },
  { en: "us", jp: "私たちを(に)" },
  { en: "ours", jp: "私たちのもの" },
  { en: "they", jp: "彼らは" },
  { en: "their", jp: "彼らの" },
  { en: "them", jp: "彼らを(に)" },
  { en: "theirs", jp: "彼らのもの" },
  { en: "it", jp: "それは・それを" },
  { en: "its", jp: "それの" },
  { en: "everyone", jp: "みんな・すべての人" },
  { en: "one", jp: "もの・人" },
  { en: "am", jp: "〜である・いる" },
  { en: "are", jp: "〜である・いる" },
  { en: "is", jp: "〜である・いる" },
  { en: "be", jp: "〜になる" },
  { en: "do", jp: "する" },
  { en: "does", jp: "する" },
  { en: "have", jp: "持っている" },
  { en: "go", jp: "行く" },
  { en: "come", jp: "来る" },
  { en: "sit", jp: "すわる" },
  { en: "stand", jp: "立つ" },
  { en: "walk", jp: "歩く" },
  { en: "run", jp: "走る" },
  { en: "start", jp: "始まる・始める" },
  { en: "stop", jp: "止まる・止める" },
  { en: "jump", jp: "とぶ・はねる" },
  { en: "turn", jp: "回る" },
  { en: "look", jp: "見る" },
  { en: "watch", jp: "見る" },
  { en: "see", jp: "見る・見える" },
  { en: "listen", jp: "聞く" },
  { en: "speak", jp: "話す" },
  { en: "talk", jp: "話す" },
  { en: "eat", jp: "食べる" },
  { en: "drink", jp: "飲む" },
  { en: "wash", jp: "洗う" },
  { en: "brush", jp: "みがく" },
  { en: "sleep", jp: "ねむる" },
  { en: "want", jp: "ほしい・ほしがる" },
  { en: "live", jp: "住む・生きる" },
  { en: "cook", jp: "料理する" },
  { en: "make", jp: "作る" },
  { en: "clean", jp: "そうじする" },
  { en: "study", jp: "勉強する" },
  { en: "read", jp: "読む" },
  { en: "write", jp: "書く" },
  { en: "think", jp: "考える" },
  { en: "know", jp: "知る" },
  { en: "cut", jp: "切る" },
  { en: "try", jp: "やってみる" },
  { en: "check", jp: "確認する" },
  { en: "work", jp: "働く" },
  { en: "teach", jp: "教える" },
  { en: "swim", jp: "泳ぐ" },
  { en: "sing", jp: "歌う" },
  { en: "ski", jp: "スキーをする" },
  { en: "skate", jp: "スケートをする" },
  { en: "ride", jp: "乗る" },
  { en: "dance", jp: "おどる" },
  { en: "practice", jp: "練習する" },
  { en: "fly", jp: "飛ぶ" },
  { en: "find", jp: "見つける" },
  { en: "put", jp: "置く" },
  { en: "touch", jp: "さわる" },
  { en: "buy", jp: "買う" },
  { en: "get", jp: "手にいれる" },
  { en: "use", jp: "使う" },
  { en: "open", jp: "開ける" },
  { en: "close", jp: "閉める" },
  { en: "take", jp: "とる・持っていく" },
  { en: "visit", jp: "おとずれる" },
  { en: "meet", jp: "会う" },
  { en: "join", jp: "参加する" },
  { en: "leave", jp: "出発する・離れる" },
  { en: "call", jp: "呼ぶ・電話する" },
  { en: "enjoy", jp: "楽しむ" },
  { en: "like", jp: "好きである" },
  { en: "love", jp: "大好きである" },
  { en: "play", jp: "遊ぶ・演奏する" },
  { en: "help", jp: "助ける" },
  { en: "this", jp: "これ" },
  { en: "that", jp: "あれ・それ" },
  { en: "these", jp: "これら" },
  { en: "those", jp: "あれら・それら" },
  { en: "everything", jp: "何もかも・すべて" },
  { en: "what", jp: "何・どんな" },
  { en: "who", jp: "だれ" },
  { en: "why", jp: "なぜ" },
  { en: "how", jp: "どうやって" },
  { en: "when", jp: "いつ" },
  { en: "where", jp: "どこで・どこに" },
  { en: "whose", jp: "だれの" },
  { en: "which", jp: "どの・どれ" },
  { en: "a", jp: "1つの・1人の" },
  { en: "the", jp: "その・あの" },
  { en: "again", jp: "もう一度" },
  { en: "not", jp: "〜でない" },
  { en: "yes", jp: "はい" },
  { en: "no", jp: "いいえ" },
  { en: "too", jp: "〜もまた・〜すぎる" },
  { en: "very", jp: "とても" },
  { en: "always", jp: "いつも" },
  { en: "usually", jp: "ふつう" },
  { en: "sometimes", jp: "時々" },
  { en: "never", jp: "決して〜ない" },
  { en: "later", jp: "あとで" },
  { en: "away", jp: "向こうに" },
  { en: "well", jp: "うまく" },
  { en: "often", jp: "たびたび" },
  { en: "now", jp: "今" },
  { en: "here", jp: "ここに・ここで" },
  { en: "there", jp: "そこに・そこで" },
  { en: "o'clock", jp: "〜時" },
  { en: "out", jp: "外に・外へ" },
  { en: "up", jp: "上に・上へ" },
  { en: "down", jp: "下に・下へ" },
  { en: "really", jp: "本当に" },
  { en: "just", jp: "丁度・ほんの" },
  { en: "only", jp: "たった・〜だけ" },
  { en: "around", jp: "〜ころ・およそ" },
  { en: "also", jp: "〜もまた" },
  { en: "then", jp: "その時・それから" },
  { en: "together", jp: "いっしょに" },
  { en: "left", jp: "左(に)" },
  { en: "right", jp: "右(に)・正しい" },
  { en: "straight", jp: "まっすぐに" },
  { en: "for", jp: "〜のために・〜の間" },
  { en: "about", jp: "〜について・およそ" },
  { en: "to", jp: "〜へ・〜まで" },
  { en: "at", jp: "〜に" },
  { en: "in", jp: "〜の中に・〜に" },
  { en: "under", jp: "〜の下に" },
  { en: "by", jp: "〜のそばに" },
  { en: "from", jp: "〜から・〜出身で" },
  { en: "outside", jp: "〜の外に" },
  { en: "inside", jp: "〜の中に" },
  { en: "on", jp: "〜の上に" },
  { en: "with", jp: "〜といっしょに" },
  { en: "of", jp: "〜の" },
  { en: "after", jp: "〜の後に" },
  { en: "before", jp: "〜の前に" },
  { en: "near", jp: "〜のそばに" },
  { en: "and", jp: "〜と〜・そして" },
  { en: "or", jp: "〜か〜・または" },
  { en: "but", jp: "しかし" },
  { en: "so", jp: "だから" },
  { en: "can", jp: "することができる" },
  { en: "Mr.", jp: "〜さん・先生(男性)" },
  { en: "Ms.", jp: "〜さん・先生(女性)" }
];

const WORDS_PER_STAGE = 7;
const TOTAL_STAGES = 100;
const MAP_SIZE = 28;
const TILE_W = 64;
const TILE_H = 32;
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];
const WEATHER_TYPES = ["Clear", "Rain", "Snow", "Cloudy"];

// 建築物データ
const BUILDINGS = {
  road: {
    id: "road",
    name: "道路",
    desc: "街の基本インフラ",
    cost: 5,
    icon: "🛣️",
    type: "road",
    pop: 0,
    tax: 0,
    reqLevel: 1
  },
  water: {
    id: "water",
    name: "水路",
    desc: "潤いを与える水辺",
    cost: 10,
    icon: "🌊",
    type: "water",
    pop: 0,
    tax: 0,
    reqLevel: 1
  },
  grass: {
    id: "grass",
    name: "花壇",
    desc: "景観を良くする",
    cost: 15,
    icon: "🌷",
    type: "deco",
    pop: 0,
    tax: 0,
    reqLevel: 1
  },
  tree: {
    id: "tree",
    name: "木",
    desc: "自然の豊かさ",
    cost: 20,
    icon: "🌳",
    type: "deco",
    pop: 0,
    tax: 0,
    reqLevel: 1
  },
  park: {
    id: "park",
    name: "公園",
    desc: "住人が挨拶しやすくなる",
    cost: 50,
    icon: "⛲",
    type: "deco",
    pop: 0,
    tax: 0,
    reqLevel: 2
  },
  house1: {
    id: "house1",
    name: "小さな家",
    desc: "人口+2人",
    cost: 100,
    icon: "🏠",
    type: "home",
    pop: 2,
    tax: 0,
    reqLevel: 1
  },
  house2: {
    id: "house2",
    name: "大きな家",
    desc: "人口+5人",
    cost: 250,
    icon: "🏡",
    type: "home",
    pop: 5,
    tax: 0,
    reqLevel: 3
  },
  shop: {
    id: "shop",
    name: "商店",
    desc: "毎日30Gの税収 / コンボ報酬UP",
    cost: 300,
    icon: "🏪",
    type: "work",
    pop: 0,
    tax: 30,
    reqLevel: 3
  },
  cafe: {
    id: "cafe",
    name: "カフェ",
    desc: "毎日50Gの税収 / 住人の歩行速度UP",
    cost: 400,
    icon: "☕",
    type: "work",
    pop: 0,
    tax: 50,
    reqLevel: 4
  },
  office: {
    id: "office",
    name: "オフィス",
    desc: "毎日100Gの税収",
    cost: 600,
    icon: "🏢",
    type: "work",
    pop: 0,
    tax: 100,
    reqLevel: 5
  },
  school: {
    id: "school",
    name: "学校",
    desc: "クイズ正解時の獲得EXP +20%",
    cost: 1000,
    icon: "🏫",
    type: "work",
    pop: 0,
    tax: 0,
    reqLevel: 6
  },
  hospital: {
    id: "hospital",
    name: "病院",
    desc: "悪天候でも税収が減らない",
    cost: 1200,
    icon: "🏥",
    type: "work",
    pop: 0,
    tax: 0,
    reqLevel: 7
  }
};

const ACHIEVEMENTS = [
  { id: "pop10", desc: "人口10人達成", reward: 100 },
  { id: "pop50", desc: "人口50人達成", reward: 500 },
  { id: "stage10", desc: "ステージ10クリア", reward: 500 },
  { id: "mayor5", desc: "市長Lv5到達", reward: 1000 },
  { id: "build100", desc: "建物を100個建てる", reward: 1000 }
];

let state = {
  coins: 500,
  exp: 0,
  mayorLevel: 1,
  unlockedStage: 1,
  map: [],
  playBGM: true,
  playSE: true,
  showParticles: true,
  gameTime: 8 * 60,
  day: 1,
  seasonIdx: 0,
  weather: "Clear",
  achieved: {},
  builtCount: 0,
  timeSpeed: 1
};

let entities = [],
  particles = [],
  stateIcons = [];
let timeFrame = 0,
  viewAngle = 0;
let camera = { x: 0, y: 0, targetX: 0, targetY: 0, zoom: 1, vx: 0, vy: 0 };
let isDragging = false,
  dragStart = { x: 0, y: 0 },
  lastMouse = { x: 0, y: 0 };
let hoverTile = null;

let quizState = {
  active: false,
  stage: 1,
  questions: [],
  currentIndex: 0,
  score: 0,
  combo: 0,
  isExam: false
};
let currentWord = null,
  isAnswering = false,
  selectedBuild = null,
  isDemolish = false,
  autoSaveTimer = null;
let canvas = null,
  ctx = null,
  audioCtx = null,
  isBGMPlaying = false,
  isGameStarted = false;

function hashPos(x, y) {
  return (Math.abs(Math.sin(x * 12.9898 + y * 78.233)) * 43758.5453) % 1;
}

// ⚠️【重要バグ修正】localStorage関数を復元
function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}
function safeSetItem(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch (e) {}
}
function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}

/* --- Init & Events --- */
window.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("gameCanvas");
  if (canvas) ctx = canvas.getContext("2d", { alpha: false });

  bindEvents();
  loadSave(); // ⚠️ 先にロード処理で state.map を構築する
  initBuildMenu();
  renderStageGrid();
  updateUI();
});

function bindEvents() {
  window.addEventListener("resize", resize);
  window.addEventListener(
    "wheel",
    (e) => {
      if (e.target === canvas) zoomCamera(e.deltaY > 0 ? -0.15 : 0.15);
    },
    { passive: true }
  );

  let initialPinchDist = null;
  if (canvas) {
    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mouseup", onPointerUp);

    canvas.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 2) {
          initialPinchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        } else {
          onPointerDown(e);
        }
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 2 && initialPinchDist) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          zoomCamera((dist - initialPinchDist) * 0.005);
          initialPinchDist = dist;
        } else if (isDragging) {
          onPointerMove(e);
        }
      },
      { passive: true }
    );

    window.addEventListener("touchend", (e) => {
      initialPinchDist = null;
      onPointerUp(e);
    });
  }

  document
    .getElementById("btn-start-game")
    ?.addEventListener("click", startGame);
  document
    .getElementById("btn-pause")
    ?.addEventListener("click", () => setTimeSpeed(0));
  document
    .getElementById("btn-play")
    ?.addEventListener("click", () => setTimeSpeed(1));
  document
    .getElementById("btn-fast")
    ?.addEventListener("click", () => setTimeSpeed(3));

  document
    .getElementById("btn-achieve")
    ?.addEventListener("click", () => openModal("achieve-modal"));
  document
    .getElementById("btn-dict")
    ?.addEventListener("click", () => openModal("dict-modal"));
  document
    .getElementById("btn-settings")
    ?.addEventListener("click", () => openModal("settings-modal"));

  document
    .getElementById("btn-zoom-in")
    ?.addEventListener("click", () => zoomCamera(0.2));
  document
    .getElementById("btn-zoom-out")
    ?.addEventListener("click", () => zoomCamera(-0.2));
  document
    .getElementById("btn-rotate")
    ?.addEventListener("click", rotateCamera);

  document.getElementById("btn-retire")?.addEventListener("click", quitQuiz);
  document
    .getElementById("btn-next-stage")
    ?.addEventListener("click", showQuizMenu);
  document
    .getElementById("demolish-btn")
    ?.addEventListener("click", toggleDemolish);

  document.getElementById("chk-bgm")?.addEventListener("change", toggleBGM);
  document.getElementById("chk-se")?.addEventListener("change", toggleSE);
  document
    .getElementById("chk-particles")
    ?.addEventListener("change", toggleParticles);
  document.getElementById("btn-export")?.addEventListener("click", exportSave);
  document.getElementById("btn-import")?.addEventListener("click", importSave);
  document
    .getElementById("btn-reset-data")
    ?.addEventListener("click", requestReset);

  document
    .querySelectorAll(".close-modal-btn")
    .forEach((btn) => btn.addEventListener("click", closeModal));
}

function startGame() {
  if (isGameStarted) return;
  const screen = document.getElementById("start-screen");
  if (screen) {
    screen.style.opacity = "0";
    setTimeout(() => (screen.style.display = "none"), 500);
  }

  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
      if (state.playBGM) startBGM();
    }
  }
  resize();
  isGameStarted = true;
  requestAnimationFrame(gameLoop);
}

function initMap() {
  state.map = Array.from({ length: MAP_SIZE }, () =>
    Array(MAP_SIZE).fill(null)
  );
  for (let i = 8; i < 20; i++) {
    state.map[14][i] = "road";
    state.map[i][14] = "road";
  }
  state.map[13][15] = "house1";
  state.map[15][13] = "shop";
  state.map[13][13] = "park";
  state.map[15][15] = "grass";
  state.map[13][16] = "house1";
  state.map[16][13] = "cafe";
}

function saveGame(isAuto = false) {
  safeSetItem("EngTown_V3_Fix", JSON.stringify(state));
  if (isAuto) showToast("💾 Auto Saved");
}

function loadSave() {
  const saved = safeGetItem("EngTown_V3_Fix");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
      // ⚠️安全チェック
      if (
        !state.map ||
        !Array.isArray(state.map) ||
        state.map.length !== MAP_SIZE ||
        !Array.isArray(state.map[0]) ||
        state.map[0].length !== MAP_SIZE
      ) {
        initMap();
      }
      if (!state.weather) state.weather = "Clear";
    } catch (e) {
      initMap();
    }
  } else {
    initMap();
  }

  spawnResidents();
  changeWeather(true);
  ["bgm", "se", "particles"].forEach((id) => {
    const el = document.getElementById(`chk-${id}`);
    if (el)
      el.checked =
        state[
          id === "bgm" ? "playBGM" : id === "se" ? "playSE" : "showParticles"
        ];
  });
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(() => saveGame(true), 60000);
}

function requestReset() {
  showModal("全データを消去しますか？", () => {
    safeRemoveItem("EngTown_V3_Fix");
    location.reload();
  });
}

/* --- Dynamic Audio --- */
function toggleBGM() {
  state.playBGM = document.getElementById("chk-bgm").checked;
  if (state.playBGM) startBGM();
  else stopBGM();
  saveGame();
}
function toggleSE() {
  state.playSE = document.getElementById("chk-se").checked;
  saveGame();
}
function toggleParticles() {
  state.showParticles = document.getElementById("chk-particles").checked;
  particles = [];
  saveGame();
}

function startBGM() {
  if (!audioCtx || !state.playBGM || isBGMPlaying) return;
  isBGMPlaying = true;
  playNextBGMNote();
}
function stopBGM() {
  isBGMPlaying = false;
}

function playNextBGMNote() {
  if (!isBGMPlaying || !audioCtx) return;
  const isNight = isNightTime();
  const pop = getPopulation();
  const baseDay = [261.63, 329.63, 392.0, 523.25];
  if (pop > 10) baseDay.push(349.23);
  if (pop > 50) baseDay.push(440.0);
  const scale = isNight ? [196.0, 261.63, 311.13, 392.0] : baseDay;
  const note = scale[Math.floor(Math.random() * scale.length)];

  try {
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = isNight ? 800 : 1500 + pop * 10;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = isNight ? "sine" : pop > 30 ? "sawtooth" : "triangle";
    osc.frequency.value = note;

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(isNight ? 0.03 : 0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isNight ? 3.0 : 1.5));
    osc.start(now);
    osc.stop(now + (isNight ? 3.0 : 1.5));
  } catch (e) {}
  setTimeout(
    playNextBGMNote,
    isNight ? 1500 + Math.random() * 1000 : 700 + Math.random() * 600
  );
}

function playSE(type, params = 0) {
  if (!state.playSE || !audioCtx) return;
  try {
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === "coin") {
      osc.type = "sine";
      const pitch = 1 + Math.min(params * 0.05, 1.0);
      osc.frequency.setValueAtTime(987.77 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(1318.51 * pitch, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "wrong") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "build") {
      osc.type = "square";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "demolish") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "hello") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {}
}

function playWordSound() {
  if (!state.playSE || !currentWord || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentWord.en);
    u.lang = "en-US";
    u.rate = 0.9;
    u.pitch = 1.0 + Math.min(quizState.combo * 0.05, 0.5);
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

/* --- Gameplay Logic & Synergies --- */
function getPopulation() {
  let p = 0;
  for (let y = 0; y < MAP_SIZE; y++) {
    if (!state.map[y]) continue;
    for (let x = 0; x < MAP_SIZE; x++) {
      if (state.map[y][x]) p += BUILDINGS[state.map[y][x]]?.pop || 0;
    }
  }
  return p;
}

function hasBuilding(id) {
  for (let y = 0; y < MAP_SIZE; y++) {
    if (!state.map[y]) continue;
    for (let x = 0; x < MAP_SIZE; x++) {
      if (state.map[y][x] === id) return true;
    }
  }
  return false;
}

function getRequiredExp(level) {
  return level * level * 100;
}
function addExp(amount) {
  if (hasBuilding("school")) amount = Math.floor(amount * 1.2);
  state.exp += amount;
  let req = getRequiredExp(state.mayorLevel);
  while (state.exp >= req) {
    state.exp -= req;
    state.mayorLevel++;
    showToast(`🎉 Level UP! 市長Lv.${state.mayorLevel}`);
    playSE("coin", 10);
    triggerScreenFx("levelup");
    req = getRequiredExp(state.mayorLevel);
  }
  checkAchievements();
  updateUI();
  initBuildMenu();
}

function getTownTitle(pop) {
  if (pop < 10) return "🌱 開拓村";
  if (pop < 30) return "🏘️ 発展する町";
  if (pop < 70) return "🏙️ 活気ある都市";
  if (pop < 150) return "🌆 大都市";
  return "👑 メガロポリス";
}

function updateUI() {
  const coinDisp = document.getElementById("coin-display");
  if (coinDisp) coinDisp.innerText = state.coins;

  const pop = getPopulation();
  const popDisp = document.getElementById("pop-display");
  if (popDisp) popDisp.innerText = pop;

  const townTitle = document.getElementById("town-title");
  if (townTitle) townTitle.innerText = getTownTitle(pop);

  const mayorLevel = document.getElementById("mayor-level");
  if (mayorLevel) mayorLevel.innerText = `Mayor Lv.${state.mayorLevel}`;

  const expBar = document.getElementById("exp-bar");
  if (expBar)
    expBar.style.width = `${
      (state.exp / getRequiredExp(state.mayorLevel)) * 100
    }%`;

  const h = Math.floor(state.gameTime / 60) % 24;
  const m = Math.floor(state.gameTime % 60);
  const timeDisp = document.getElementById("time-display");
  if (timeDisp)
    timeDisp.innerText = `🕒 Day ${state.day} - ${String(h).padStart(
      2,
      "0"
    )}:${String(m).padStart(2, "0")}`;

  const envDisp = document.getElementById("env-display");
  if (envDisp) {
    envDisp.innerHTML = `${["🌸", "🌻", "🍁", "⛄"][state.seasonIdx]} ${
      SEASONS[state.seasonIdx]
    } | ${
      state.weather === "Clear"
        ? "☀️"
        : state.weather === "Rain"
        ? "🌧️"
        : state.weather === "Snow"
        ? "❄️"
        : "☁️"
    } ${state.weather}`;
  }

  document.querySelectorAll(".build-item").forEach((btn) => {
    const item = BUILDINGS[btn.dataset.id];
    if (!item) return;
    const locked = state.mayorLevel < item.reqLevel;
    btn.classList.toggle("locked", locked);
    btn.classList.toggle("disabled", !locked && state.coins < item.cost);
  });

  const btnPause = document.getElementById("btn-pause");
  if (btnPause) btnPause.classList.toggle("active-btn", state.timeSpeed === 0);

  const btnPlay = document.getElementById("btn-play");
  if (btnPlay) btnPlay.classList.toggle("active-btn", state.timeSpeed === 1);

  const btnFast = document.getElementById("btn-fast");
  if (btnFast) btnFast.classList.toggle("active-btn", state.timeSpeed === 3);
}

function setTimeSpeed(s) {
  state.timeSpeed = s;
  updateUI();
}

function collectTaxes() {
  let tax = 0;
  const pop = getPopulation();
  const isBadWeather = state.weather === "Rain" || state.weather === "Snow";
  const hasHospital = hasBuilding("hospital");

  for (let y = 0; y < MAP_SIZE; y++) {
    if (!state.map[y]) continue;
    for (let x = 0; x < MAP_SIZE; x++) {
      if (!state.map[y][x]) continue;
      const b = BUILDINGS[state.map[y][x]];
      if (b && b.tax > 0) {
        let t = b.tax;
        t += Math.floor(t * Math.floor(pop / 10) * 0.05);
        if (isBadWeather && !hasHospital) t = Math.floor(t * 0.7);

        tax += t;
        if (state.showParticles) {
          const sc = toScreen(x, y);
          if (!isNaN(sc.x) && !isNaN(sc.y))
            addParticle(sc.x, sc.y, "#fde047", "taxcoin");
        }
      }
    }
  }
  if (tax > 0) {
    state.coins += tax;
    showToast(`💰 昨日の税収: +${tax}G`);
    playSE("coin");
    updateUI();
    saveGame();
  }
}

function changeWeather(force = false) {
  if (!force && Math.random() > 0.3) return;
  state.weather =
    WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
  updateUI();
}

function triggerScreenFx(type) {
  const fx = document.getElementById("screen-fx-layer");
  if (!fx) return;
  if (type === "levelup") {
    fx.style.background =
      "radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 80%)";
    setTimeout(() => (fx.style.background = "transparent"), 800);
  }
}

/* --- Optimized Particles & HUD --- */
function addParticle(x, y, color, type = "dust") {
  if (!state.showParticles) return;
  const count = type === "confetti" ? 30 : type === "dust" ? 4 : 1;
  for (let i = 0; i < count; i++) {
    let vx = 0,
      vy = 0,
      life = 1.0,
      decay = 0.03,
      size = 3;
    if (type === "confetti") {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 6 + 2;
      vx = Math.cos(ang) * spd;
      vy = Math.sin(ang) * spd - 4;
      decay = 0.015;
      size = Math.random() * 5 + 3;
      color = ["#ef4444", "#3b82f6", "#34d399", "#fbbf24"][
        Math.floor(Math.random() * 4)
      ];
    } else if (type === "rain") {
      vx = 1;
      vy = Math.random() * 4 + 6;
      decay = 0.05;
      size = 1.5;
      color = "rgba(255,255,255,0.5)";
    } else if (type === "snow") {
      vx = Math.sin(timeFrame * 0.01 + i);
      vy = Math.random() * 1 + 1;
      decay = 0.01;
      size = Math.random() * 2 + 1;
      color = "#fff";
    } else if (type === "taxcoin") {
      vx = -2 - Math.random() * 2;
      vy = -3 - Math.random() * 2;
      decay = 0.02;
      size = 4;
    } else {
      vx = (Math.random() - 0.5) * 3;
      vy = (Math.random() - 1) * 3;
      decay = 0.03 + Math.random() * 0.02;
      size = Math.random() * 3 + 2;
    }
    particles.push({ x, y, vx, vy, life, decay, color, type, size });
  }
}

function updateAndDrawParticles() {
  if (!ctx) return;
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === "confetti" || p.type === "taxcoin") p.vy += 0.15;
    if (p.type === "snow") p.x += Math.sin(timeFrame * 0.05) * 0.5;
    p.life -= p.decay;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    if (p.type === "confetti") {
      ctx.fillRect(p.x, p.y, p.size, p.size);
    } else if (p.type === "rain") {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1.0;
}

function updateStateIcons() {
  const layer = document.getElementById("floating-ui-layer");
  if (!layer) return;

  stateIcons.forEach((icon) => {
    if (icon.el && icon.el.parentNode === layer) layer.removeChild(icon.el);
  });
  stateIcons = [];

  if (camera.zoom < 0.6) return;
  entities.forEach((ent) => {
    let emoji = null;
    if (ent.state === "AT_HOME" && isNightTime()) emoji = "💤";
    else if (ent.state === "WORKING")
      emoji =
        ent.workType === "school"
          ? "🏫"
          : ent.workType === "hospital"
          ? "🏥"
          : "💦";
    else if (ent.state === "GOING_WORK") emoji = "💼";
    else if (ent.state === "WANDERING") emoji = "🚶";

    if (emoji) {
      const sc = toScreen(ent.x, ent.y);
      if (isNaN(sc.x) || isNaN(sc.y)) return;
      if (
        sc.x < -50 ||
        sc.x > canvas.width + 50 ||
        sc.y < -50 ||
        sc.y > canvas.height + 50
      )
        return;
      const el = document.createElement("div");
      el.className = "emoji-state";
      el.innerText = emoji;
      el.style.left = `${sc.x - 8}px`;
      el.style.top = `${sc.y - 35}px`;
      layer.appendChild(el);
      stateIcons.push({ el, ent });
    }
  });
}

function addFloatingText(text, gx, gy, color, isBubble = false) {
  const layer = document.getElementById("floating-ui-layer");
  if (!layer) return;
  const sc = toScreen(gx, gy);
  if (isNaN(sc.x) || isNaN(sc.y)) return;
  const el = document.createElement("div");
  el.className = isBubble ? "talk-bubble" : "floating-text";
  el.style.left = `${sc.x - (isBubble ? 20 : 10)}px`;
  el.style.top = `${sc.y - 30}px`;
  if (!isBubble) {
    el.style.color = color;
    el.style.webkitTextStroke = "1px #000";
  }
  el.innerText = text;
  layer.appendChild(el);
  setTimeout(
    () => {
      if (el.parentNode === layer) layer.removeChild(el);
    },
    isBubble ? 2000 : 1500
  );
}

/* --- Modals & Systems --- */
function openModal(id) {
  if (id === "dict-modal") renderDictionary();
  if (id === "achieve-modal") renderAchievements();
  document.getElementById(id).style.display = "flex";
}
function closeModal() {
  document
    .querySelectorAll(".modal-overlay")
    .forEach((m) => (m.style.display = "none"));
}
function showModal(text, onYes) {
  document.getElementById("modal-text").innerText = text;
  const yesBtn = document.getElementById("modal-yes");
  if (yesBtn)
    yesBtn.onclick = () => {
      onYes();
      closeModal();
    };
  openModal("custom-modal");
}
function showToast(msg) {
  const area = document.getElementById("toast-area");
  if (!area) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.innerText = msg;
  area.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function renderDictionary() {
  const list = document.getElementById("dict-list");
  if (!list) return;
  list.innerHTML = "";
  const maxIdx = (state.unlockedStage - 1) * WORDS_PER_STAGE;
  document.getElementById("dict-progress").innerText = Math.min(
    maxIdx,
    VOCABULARY.length
  );
  for (let i = 0; i < Math.min(maxIdx, VOCABULARY.length); i++) {
    list.innerHTML += `<div class="word-row"><strong>${VOCABULARY[i].en}</strong><span>${VOCABULARY[i].jp}</span></div>`;
  }
}
function checkAchievements() {
  const pop = getPopulation();
  ACHIEVEMENTS.forEach((a) => {
    if (!state.achieved[a.id]) {
      let d = false;
      if (a.id === "pop10" && pop >= 10) d = true;
      if (a.id === "pop50" && pop >= 50) d = true;
      if (a.id === "stage10" && state.unlockedStage > 10) d = true;
      if (a.id === "mayor5" && state.mayorLevel >= 5) d = true;
      if (a.id === "build100" && state.builtCount >= 100) d = true;
      if (d) {
        state.achieved[a.id] = true;
        state.coins += a.reward;
        showToast(`🏆 実績解除: ${a.desc} (+${a.reward}G)`);
        playSE("coin", 5);
      }
    }
  });
}
function renderAchievements() {
  const list = document.getElementById("achieve-list");
  if (!list) return;
  list.innerHTML = "";
  ACHIEVEMENTS.forEach((a) => {
    const d = state.achieved[a.id];
    list.innerHTML += `<div class="achievement-row ${
      d ? "ach-done" : ""
    }"><span>${a.desc}</span> <span style="color:${
      d ? "#34d399" : "#fbbf24"
    }">${d ? "✅済" : `🎁${a.reward}G`}</span></div>`;
  });
}
function exportSave() {
  prompt(
    "以下のデータをコピー:",
    btoa(encodeURIComponent(JSON.stringify(state)))
  );
}
function importSave() {
  const d = prompt("データをペースト:");
  if (d) {
    try {
      state = JSON.parse(decodeURIComponent(atob(d)));
      saveGame();
      loadSave();
      showToast("✅ ロード成功");
    } catch (e) {
      showToast("❌ データ無効");
    }
  }
}

/* --- Quiz System --- */
function getWordsForStage(stg) {
  if (stg % 10 === 0) {
    const pool = [
      ...VOCABULARY.slice(
        Math.max(0, stg * WORDS_PER_STAGE - 70),
        stg * WORDS_PER_STAGE
      )
    ];
    return pool.sort(() => 0.5 - Math.random()).slice(0, 10);
  }
  return VOCABULARY.slice(
    (stg - 1) * WORDS_PER_STAGE,
    stg * WORDS_PER_STAGE
  ).filter(Boolean);
}
function renderStageGrid() {
  const grid = document.getElementById("stage-grid");
  if (!grid) return;
  grid.innerHTML = "";
  for (let i = 1; i <= TOTAL_STAGES; i++) {
    const btn = document.createElement("button");
    const isExam = i % 10 === 0;
    btn.className = `stage-btn ${isExam ? "exam" : ""}`;
    btn.innerText = isExam ? `Exam ${i / 10}` : `St ${i}`;
    if (i > state.unlockedStage) btn.disabled = true;
    btn.addEventListener("click", () => startQuizSession(i, isExam));
    grid.appendChild(btn);
  }
}
function startQuizSession(stage, isExam) {
  quizState = {
    active: true,
    stage,
    isExam,
    questions: getWordsForStage(stage),
    currentIndex: 0,
    score: 0,
    combo: 0
  };
  if (quizState.questions.length === 0) return;
  document.getElementById("quiz-menu").style.display = "none";
  document.getElementById("quiz-result").style.display = "none";
  document.getElementById("quiz-active").style.display = "block";
  showNextQuestion();
}
function showNextQuestion() {
  if (quizState.currentIndex >= quizState.questions.length) {
    finishQuizSession();
    return;
  }
  isAnswering = false;
  document.getElementById("quiz-progress").innerText = `${
    quizState.isExam ? "📝 試験" : "✏️ St." + quizState.stage
  }: Q ${quizState.currentIndex + 1} / ${quizState.questions.length}`;
  currentWord = quizState.questions[quizState.currentIndex];

  let opts = [currentWord];
  while (opts.length < 4) {
    const r = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    if (!opts.find((o) => o.en === r.en)) opts.push(r);
  }
  opts.sort(() => Math.random() - 0.5);

  document.getElementById("word-display").innerText = currentWord.en;
  document.getElementById("word-display-container").onclick = playWordSound;

  const grid = document.getElementById("answers-grid");
  grid.innerHTML = "";
  opts.forEach((opt) => {
    const b = document.createElement("button");
    b.className = "answer-btn";
    b.innerText = opt.jp;
    b.addEventListener("click", () =>
      checkAnswer(b, opt.en === currentWord.en)
    );
    grid.appendChild(b);
  });
  setTimeout(playWordSound, 100);
}
function checkAnswer(btn, isCorrect) {
  if (isAnswering) return;
  isAnswering = true;
  if (isCorrect) {
    btn.classList.add("correct");
    quizState.score++;
    quizState.combo++;
    playSE("coin", quizState.combo);
    let shopBonus = hasBuilding("shop") ? 0.2 : 0;
    let mult = 1 + Math.floor(quizState.combo / 3) * (0.5 + shopBonus);
    const coinsEarned = Math.floor(15 * mult);
    state.coins += coinsEarned;
    addExp(5);

    const cd = document.getElementById("combo-display");
    cd.innerText =
      quizState.combo > 1
        ? `${quizState.combo} Combo! (x${mult.toFixed(1)})`
        : "";
    cd.style.opacity = "1";
    addParticle(
      window.innerWidth * 0.15,
      window.innerHeight * 0.7,
      "",
      "confetti"
    );
    showToast(`+${coinsEarned}G`);
  } else {
    btn.classList.add("wrong");
    playSE("wrong");
    quizState.combo = 0;
    document.getElementById("combo-display").style.opacity = "0";
    document.querySelectorAll(".answer-btn").forEach((b) => {
      if (b.innerText === currentWord.jp) b.classList.add("correct");
    });
  }
  updateUI();
  saveGame();
  quizState.currentIndex++;
  setTimeout(showNextQuestion, isCorrect ? 600 : 1200);
}
function finishQuizSession() {
  quizState.active = false;
  document.getElementById("quiz-active").style.display = "none";
  document.getElementById("quiz-result").style.display = "block";
  document.getElementById(
    "result-score"
  ).innerText = `${quizState.score} / ${quizState.questions.length}`;

  const reqScore = quizState.isExam
    ? quizState.questions.length
    : Math.ceil(quizState.questions.length * 0.7);
  if (quizState.score >= reqScore) {
    let bonusC = quizState.isExam ? 300 : 50;
    let bonusE = quizState.isExam ? 150 : 25;
    state.coins += bonusC;
    addExp(bonusE);
    document.getElementById(
      "result-reward"
    ).innerText = `✨報酬: +${bonusC}G / +${bonusE} EXP`;
    document.getElementById("result-reward").style.color = "var(--warning)";
    if (quizState.stage === state.unlockedStage) {
      state.unlockedStage++;
      renderStageGrid();
      checkAchievements();
    }
    playSE("coin", 8);
    addParticle(
      window.innerWidth * 0.2,
      window.innerHeight * 0.8,
      "",
      "confetti"
    );
  } else {
    document.getElementById(
      "result-reward"
    ).innerText = `失敗 (規定スコア: ${reqScore})`;
    document.getElementById("result-reward").style.color = "var(--danger)";
    playSE("wrong");
  }
  updateUI();
  saveGame();
}
function showQuizMenu() {
  document.getElementById("quiz-result").style.display = "none";
  document.getElementById("quiz-active").style.display = "none";
  document.getElementById("quiz-menu").style.display = "block";
}
function quitQuiz() {
  quizState.active = false;
  showQuizMenu();
}

/* --- Building Menu --- */
function initBuildMenu() {
  const container = document.getElementById("build-items");
  if (!container) return;
  container.innerHTML = "";
  Object.values(BUILDINGS).forEach((b) => {
    const el = document.createElement("div");
    el.className = "build-item";
    el.dataset.id = b.id;
    el.dataset.cost = b.cost;
    if (state.mayorLevel < b.reqLevel) el.classList.add("locked");
    el.innerHTML = `<div class="item-icon">${b.icon}</div><div class="item-name">${b.name}</div><div class="item-cost">${b.cost}G</div>`;
    el.addEventListener("click", () => selectBuild(b.id, el));
    container.appendChild(el);
  });
  updateUI();
}
function selectBuild(id, el) {
  if (state.mayorLevel < BUILDINGS[id].reqLevel) {
    showToast(`⚠️ 市長Lv.${BUILDINGS[id].reqLevel}が必要です`);
    return;
  }
  if (state.coins < BUILDINGS[id].cost) return;
  isDemolish = false;
  document.getElementById("demolish-btn").classList.remove("selected");
  if (selectedBuild === id) {
    selectedBuild = null;
    el.classList.remove("selected");
  } else {
    selectedBuild = id;
    document
      .querySelectorAll(".build-item")
      .forEach((b) => b.classList.remove("selected"));
    el.classList.add("selected");
  }
}
function toggleDemolish() {
  selectedBuild = null;
  document
    .querySelectorAll(".build-item")
    .forEach((b) => b.classList.remove("selected"));
  isDemolish = !isDemolish;
  document
    .getElementById("demolish-btn")
    .classList.toggle("selected", isDemolish);
}
function checkRoadAutoTile(x, y) {
  let n = y > 0 && state.map[y - 1] && state.map[y - 1][x] === "road" ? 1 : 0;
  let s =
    y < MAP_SIZE - 1 && state.map[y + 1] && state.map[y + 1][x] === "road"
      ? 1
      : 0;
  let w = x > 0 && state.map[y] && state.map[y][x - 1] === "road" ? 1 : 0;
  let e =
    x < MAP_SIZE - 1 && state.map[y] && state.map[y][x + 1] === "road" ? 1 : 0;
  return { n, s, w, e, sum: n + s + w + e };
}

/* --- V3 Isometric Engine --- */
function drawPrism(
  cx,
  cy,
  cw,
  ch,
  depth,
  topCol,
  rightCol,
  leftCol,
  shadow = false,
  stroke = true
) {
  if (!ctx) return;
  const ty = cy - depth;
  if (shadow) {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.moveTo(cx, cy + 2 - ch / 2);
    ctx.lineTo(cx + cw / 2 + 2, cy + 2);
    ctx.lineTo(cx, cy + 2 + ch / 2);
    ctx.lineTo(cx - cw / 2 - 2, cy + 2);
    ctx.fill();
  }
  ctx.fillStyle = rightCol;
  ctx.beginPath();
  ctx.moveTo(cx, ty);
  ctx.lineTo(cx + cw / 2, ty + ch / 2);
  ctx.lineTo(cx + cw / 2, cy + ch / 2);
  ctx.lineTo(cx, cy);
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.fillStyle = leftCol;
  ctx.beginPath();
  ctx.moveTo(cx, ty);
  ctx.lineTo(cx - cw / 2, ty + ch / 2);
  ctx.lineTo(cx - cw / 2, cy + ch / 2);
  ctx.lineTo(cx, cy);
  ctx.fill();
  if (stroke) ctx.stroke();
  ctx.fillStyle = topCol;
  ctx.beginPath();
  ctx.moveTo(cx, ty);
  ctx.lineTo(cx + cw / 2, ty + ch / 2);
  ctx.lineTo(cx, ty + ch);
  ctx.lineTo(cx - cw / 2, ty + ch / 2);
  ctx.fill();
  if (stroke) ctx.stroke();
}
function drawFlatTile(cx, cy, color, stroke = true) {
  if (!ctx) return;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - TILE_H / 2);
  ctx.lineTo(cx + TILE_W / 2, cy);
  ctx.lineTo(cx, cy + TILE_H / 2);
  ctx.lineTo(cx - TILE_W / 2, cy);
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
function getWinCol(night, badWeather) {
  if (night) return Math.random() > 0.2 ? "#fef08a" : "#475569";
  if (badWeather) return Math.random() > 0.5 ? "#fef08a" : "#bae6fd";
  return "#bae6fd";
}

function drawStructure(x, y, sc, type) {
  if (!ctx) return;
  const cx = Math.floor(sc.x),
    cy = Math.floor(sc.y);
  const night = isNightTime(),
    isDarkDay =
      !night && (state.weather === "Rain" || state.weather === "Snow");
  const winCol = getWinCol(night, isDarkDay);

  if (type === "road") {
    drawFlatTile(cx, cy, "#64748b", false);
    const conn = checkRoadAutoTile(x, y);
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    if (conn.sum === 0 || (conn.w && conn.e && !conn.n && !conn.s)) {
      ctx.moveTo(cx - 12, cy - 1);
      ctx.lineTo(cx + 12, cy + 5);
      ctx.lineTo(cx + 12, cy + 3);
      ctx.lineTo(cx - 12, cy - 3);
    } else if (conn.n && conn.s && !conn.w && !conn.e) {
      ctx.moveTo(cx - 2, cy - 10);
      ctx.lineTo(cx + 2, cy - 7);
      ctx.lineTo(cx - 2, cy + 9);
      ctx.lineTo(cx - 6, cy + 6);
    } else {
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    }
    ctx.fill();

    if ((conn.sum >= 3 || (x % 3 === 0 && y % 3 === 0)) && (conn.w || conn.n)) {
      const lx = cx - 18,
        ly = cy - 8;
      drawPrism(
        lx,
        ly,
        2,
        1,
        30,
        "#94a3b8",
        "#64748b",
        "#475569",
        false,
        false
      );
      drawPrism(
        lx + 4,
        ly - 30,
        8,
        4,
        3,
        "#334155",
        "#1e293b",
        "#0f172a",
        false,
        false
      );
      ctx.fillStyle = night ? "#fef08a" : "#f8fafc";
      ctx.beginPath();
      ctx.arc(lx + 6, ly - 31, 2, 0, Math.PI * 2);
      ctx.fill();
      if (night) {
        ctx.fillStyle = "rgba(254,240,138,0.2)";
        ctx.beginPath();
        ctx.moveTo(lx + 6, ly - 30);
        ctx.lineTo(lx - 10, ly + 15);
        ctx.lineTo(lx + 20, ly + 15);
        ctx.fill();
      }
    }
  } else if (type === "water") {
    const wave = Math.floor(Math.sin(timeFrame * 0.05 + x + y) * 2);
    drawPrism(
      cx,
      cy + 2,
      TILE_W,
      TILE_H,
      10,
      "#0284c7",
      "#0369a1",
      "#075985",
      false,
      false
    );
    ctx.fillStyle = "rgba(186,230,253,0.4)";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 10 + wave);
    ctx.lineTo(cx + TILE_W / 2 - 2, cy - TILE_H / 2 + wave);
    ctx.lineTo(cx, cy + wave);
    ctx.lineTo(cx - TILE_W / 2 + 2, cy - TILE_H / 2 + wave);
    ctx.fill();
  } else if (type === "grass") {
    drawFlatTile(cx, cy, "#a3e635");
    drawPrism(cx, cy, 14, 7, 3, "#ef4444", "#b91c1c", "#991b1b", true);
    for (let i = 0; i < 3; i++) {
      drawPrism(
        cx + (i - 1) * 5,
        cy - 4 + (i % 2) * 3,
        4,
        2,
        3,
        "#fbbf24",
        "#d97706",
        "#b45309",
        false,
        false
      );
    }
  } else if (type === "tree") {
    const sway = Math.floor(
      Math.sin(timeFrame * 0.02 + hashPos(x, y) * 10) * 2
    );
    let cT, cR, cL;
    if (state.seasonIdx === 0) {
      cT = "#fbcfe8";
      cR = "#f472b6";
      cL = "#db2777";
    } else if (state.seasonIdx === 1) {
      cT = "#86efac";
      cR = "#22c55e";
      cL = "#16a34a";
    } else if (state.seasonIdx === 2) {
      cT = "#fdba74";
      cR = "#f97316";
      cL = "#ea580c";
    } else {
      cT = "#f8fafc";
      cR = "#e2e8f0";
      cL = "#cbd5e1";
    }

    drawPrism(
      cx,
      cy - 2,
      6,
      3,
      15,
      "#78350f",
      "#522204",
      "#451a03",
      true,
      false
    );
    if (state.seasonIdx !== 3 || hashPos(x, y) > 0.5) {
      drawPrism(cx + sway * 0.5, cy - 12, 24, 12, 12, cT, cR, cL);
      drawPrism(cx + sway, cy - 20, 16, 8, 10, cT, cR, cL);
    }
  } else if (type === "park") {
    drawFlatTile(cx, cy, "#bbf7d0");
    drawPrism(cx, cy, 24, 12, 4, "#e2e8f0", "#94a3b8", "#64748b", true);
    drawPrism(cx, cy - 4, 12, 6, 12, "#bae6fd", "#3b82f6", "#2563eb");
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(
      cx,
      cy - 16 - Math.abs(Math.sin(timeFrame * 0.2)) * 4,
      2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      cx - 4,
      cy - 14 - Math.abs(Math.cos(timeFrame * 0.2)) * 3,
      1.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      cx + 4,
      cy - 14 - Math.abs(Math.sin(timeFrame * 0.2 + 1)) * 3,
      1.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  } else if (type === "house1") {
    drawPrism(cx, cy, 30, 15, 18, "#f8fafc", "#cbd5e1", "#94a3b8", true);
    drawPrism(cx, cy - 18, 36, 18, 14, "#ef4444", "#b91c1c", "#991b1b");
    ctx.fillStyle = "#78350f";
    ctx.fillRect(cx - 3, cy - 10, 3, 7);
    ctx.fillStyle = winCol;
    ctx.fillRect(cx + 6, cy - 10, 5, 5);
  } else if (type === "house2") {
    drawPrism(cx, cy, 40, 20, 22, "#fef3c7", "#fde68a", "#d97706", true);
    drawPrism(cx, cy - 22, 46, 23, 16, "#64748b", "#475569", "#334155");
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 4);
    ctx.lineTo(cx - 5, cy);
    ctx.lineTo(cx - 5, cy - 10);
    ctx.lineTo(cx, cy - 14);
    ctx.fill();
    ctx.fillStyle = winCol;
    ctx.fillRect(cx - 12, cy - 14, 4, 7);
    ctx.fillRect(cx + 8, cy - 14, 4, 7);
  } else if (type === "shop") {
    drawPrism(cx, cy, 44, 22, 20, "#fff", "#e2e8f0", "#cbd5e1", true);
    drawPrism(cx, cy - 20, 48, 24, 4, "#3b82f6", "#2563eb", "#1d4ed8");
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 24);
    ctx.lineTo(cx + 8, cy - 20);
    ctx.lineTo(cx + 4, cy - 20);
    ctx.lineTo(cx - 4, cy - 24);
    ctx.fill();
    ctx.fillStyle = night ? "#fef08a" : "#bfdbfe";
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - 6);
    ctx.lineTo(cx - 2, cy);
    ctx.lineTo(cx - 2, cy - 15);
    ctx.lineTo(cx - 16, cy - 21);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy - 2);
    ctx.lineTo(cx + 16, cy - 9);
    ctx.lineTo(cx + 16, cy - 20);
    ctx.lineTo(cx + 2, cy - 13);
    ctx.fill();
  } else if (type === "cafe") {
    drawPrism(cx, cy, 40, 20, 18, "#ffedd5", "#fed7aa", "#fdba74", true);
    drawPrism(cx, cy - 18, 44, 22, 6, "#78350f", "#522204", "#451a03");
    drawPrism(
      cx - 12,
      cy + 6,
      5,
      2.5,
      4,
      "#fcd34d",
      "#d97706",
      "#b45309",
      false,
      false
    );
    drawPrism(
      cx - 4,
      cy + 10,
      5,
      2.5,
      4,
      "#fcd34d",
      "#d97706",
      "#b45309",
      false,
      false
    );
  } else if (type === "office") {
    drawPrism(cx, cy, 38, 19, 60, "#e0f2fe", "#bae6fd", "#7dd3fc", true);
    ctx.fillStyle = "#fff";
    ctx.font = "8px sans-serif";
    ctx.fillText("H", cx - 3, cy - 62);
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 2; j++) {
        ctx.fillStyle = getWinCol(night, isDarkDay);
        ctx.beginPath();
        ctx.moveTo(cx + 4 + j * 8, cy - 10 - i * 12 - j * 4);
        ctx.lineTo(cx + 10 + j * 8, cy - 7 - i * 12 - j * 4);
        ctx.lineTo(cx + 10 + j * 8, cy - 4 - i * 12 - j * 4);
        ctx.lineTo(cx + 4 + j * 8, cy - 7 - i * 12 - j * 4);
        ctx.fill();
      }
  } else if (type === "school") {
    drawPrism(cx, cy, 50, 25, 22, "#fecdd3", "#fda4af", "#f43f5e", true);
    drawPrism(cx, cy - 22, 14, 7, 20, "#fff", "#e2e8f0", "#cbd5e1");
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(cx + 3, cy - 34, 3, 0, Math.PI * 2);
    ctx.fill();
    drawPrism(cx, cy - 42, 18, 9, 8, "#b91c1c", "#991b1b", "#7f1d1d");
  } else if (type === "hospital") {
    drawPrism(cx, cy, 46, 23, 35, "#fff", "#f8fafc", "#e2e8f0", true);
    drawPrism(cx, cy - 35, 18, 9, 2, "#475569", "#334155", "#1e293b");
    drawPrism(
      cx,
      cy - 18,
      8,
      4,
      16,
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      false,
      false
    );
    drawPrism(
      cx,
      cy - 18,
      16,
      8,
      8,
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      false,
      false
    );
  }
}

function drawEntities(gx, gy) {
  if (!ctx) return;
  entities.forEach((ent) => {
    if (
      Math.floor(ent.x) === gx &&
      Math.floor(ent.y) === gy &&
      ["GOING_WORK", "GOING_HOME", "WANDERING"].includes(ent.state)
    ) {
      const sc = toScreen(ent.x, ent.y);
      if (isNaN(sc.x) || isNaN(sc.y)) return;
      const ex = Math.floor(sc.x),
        ey = Math.floor(sc.y);
      const night = isNightTime();

      if (ent.type === "person") {
        const bounce = Math.floor(Math.abs(Math.sin(timeFrame * 0.5)) * 3);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.ellipse(ex, ey, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        drawPrism(
          ex,
          ey - bounce,
          5,
          3,
          8,
          ent.c,
          ent.cD,
          ent.cD,
          false,
          false
        );
        drawPrism(
          ex,
          ey - 8 - bounce,
          5,
          3,
          5,
          "#fef08a",
          "#fde047",
          "#eab308",
          false,
          false
        );
      } else {
        const bounce = Math.floor(Math.abs(Math.sin(timeFrame * 0.8)));
        let cw = 16,
          ch = 8;
        if (ent.dir === "sw" || ent.dir === "ne") {
          cw = 8;
          ch = 16;
        }
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.ellipse(ex, ey, cw / 1.5, ch / 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        drawPrism(
          ex,
          ey - bounce,
          cw,
          ch,
          6,
          ent.c,
          ent.cD,
          ent.cD,
          false,
          false
        );
        drawPrism(
          ex,
          ey - 6 - bounce,
          Math.floor(cw * 0.6),
          Math.floor(ch * 0.6),
          5,
          "#bae6fd",
          "#7dd3fc",
          "#38bdf8",
          false,
          false
        );

        if (night || state.weather === "Rain") {
          ctx.fillStyle = "rgba(253, 224, 71, 0.9)";
          let lx = ex,
            ly = ey - bounce;
          if (ent.dir === "se") {
            lx += cw / 2;
            ly += ch / 2 - 2;
          } else if (ent.dir === "sw") {
            lx -= cw / 2;
            ly += ch / 2 - 2;
          } else if (ent.dir === "ne") {
            lx += cw / 2;
            ly -= ch / 2 - 2;
          } else {
            lx -= cw / 2;
            ly -= ch / 2 - 2;
          }
          ctx.beginPath();
          ctx.arc(lx, ly, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  });
}

function isNightTime() {
  const h = (state.gameTime / 60) % 24;
  return h < 6 || h >= 18;
}

function render() {
  if (!ctx || !canvas || canvas.width === 0 || canvas.height === 0) return;
  try {
    const h = (state.gameTime / 60) % 24;
    let skyTop, skyBot;
    if (state.weather === "Rain" || state.weather === "Snow") {
      skyTop = "#1e293b";
      skyBot = "#475569";
    } else if (h >= 5 && h < 9) {
      skyTop = "#38bdf8";
      skyBot = "#fbcfe8";
    } else if (h >= 9 && h < 16) {
      skyTop = "#0ea5e9";
      skyBot = "#7dd3fc";
    } else if (h >= 16 && h < 19) {
      skyTop = "#f97316";
      skyBot = "#fef08a";
    } else {
      skyTop = "#020617";
      skyBot = "#1e1b4b";
    }

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, skyTop);
    grad.addColorStop(1, skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isNightTime() && state.weather === "Clear") {
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 30; i++) {
        if (Math.random() < 0.1) continue;
        ctx.fillRect(
          Math.floor(hashPos(i, 1) * canvas.width),
          Math.floor(hashPos(1, i) * canvas.height * 0.5),
          2,
          2
        );
      }
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    let startX = 0,
      endX = MAP_SIZE,
      stepX = 1,
      startY = 0,
      endY = MAP_SIZE,
      stepY = 1;
    if (viewAngle === 1) {
      startX = MAP_SIZE - 1;
      endX = -1;
      stepX = -1;
    } else if (viewAngle === 2) {
      startX = MAP_SIZE - 1;
      endX = -1;
      stepX = -1;
      startY = MAP_SIZE - 1;
      endY = -1;
      stepY = -1;
    } else if (viewAngle === 3) {
      startY = MAP_SIZE - 1;
      endY = -1;
      stepY = -1;
    }

    const cullW = (canvas.width / camera.zoom) * 1.2;
    const cullH = (canvas.height / camera.zoom) * 1.2;
    const cx = canvas.width / 2 + camera.x - canvas.width / 2;
    const cy = canvas.height / 2 + camera.y - canvas.height / 2;

    for (let y = startY; y !== endY; y += stepY) {
      for (let x = startX; x !== endX; x += stepX) {
        // ⚠️安全チェック
        if (y < 0 || y >= MAP_SIZE || x < 0 || x >= MAP_SIZE || !state.map[y])
          continue;

        const sc = toScreen(x, y);
        if (isNaN(sc.x) || isNaN(sc.y)) continue;
        if (Math.abs(sc.x - cx) > cullW || Math.abs(sc.y - cy) > cullH)
          continue;

        const type = state.map[y][x];

        if (type !== "water") {
          let groundColor =
            (x + y) % 2 === 0
              ? state.seasonIdx === 3
                ? "#f1f5f9"
                : "#84cc16"
              : state.seasonIdx === 3
              ? "#e2e8f0"
              : "#65a30d";
          drawPrism(
            sc.x,
            sc.y + 5,
            TILE_W,
            TILE_H,
            5,
            groundColor,
            "#4d7c0f",
            "#3f6212",
            false,
            false
          );
        }
        if (type) drawStructure(x, y, sc, type);
        drawEntities(x, y);

        if (hoverTile && hoverTile.x === x && hoverTile.y === y) {
          drawFlatTile(
            sc.x,
            sc.y,
            isDemolish ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.3)",
            false
          );
        }
      }
    }
    updateAndDrawParticles();
    ctx.restore();

    if (isNightTime()) {
      ctx.fillStyle = "rgba(2, 6, 23, 0.5)";
      ctx.globalCompositeOperation = "multiply";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    } else if (state.weather === "Rain" || state.weather === "Snow") {
      ctx.fillStyle = "rgba(71, 85, 105, 0.2)";
      ctx.globalCompositeOperation = "multiply";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    }
  } catch (e) {
    console.error(e);
  }
}

/* --- AI --- */
function spawnResidents() {
  let pop = 0,
    homes = [],
    works = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    if (!state.map[y]) continue;
    for (let x = 0; x < MAP_SIZE; x++) {
      const b = BUILDINGS[state.map[y][x]];
      if (b) {
        pop += b.pop;
        if (b.type === "home") homes.push({ x, y });
        if (b.type === "work") works.push({ x, y, type: b.id });
      }
    }
  }

  // ⚠️安全チェック
  entities = entities.filter(
    (e) =>
      e.home &&
      state.map[e.home.y] &&
      state.map[e.home.y][e.home.x] &&
      BUILDINGS[state.map[e.home.y][e.home.x]]?.type === "home"
  );

  while (entities.length < pop && homes.length > 0) {
    const home = homes[Math.floor(Math.random() * homes.length)];
    const work =
      works.length > 0
        ? works[Math.floor(Math.random() * works.length)]
        : { x: home.x, y: home.y, type: "none" };
    const isCar = Math.random() < 0.15;
    let c = ["#f472b6", "#db2777"];
    if (work.type === "school") c = ["#fde047", "#ca8a04"];
    if (work.type === "hospital") c = ["#f8fafc", "#cbd5e1"];
    if (work.type === "office") c = ["#94a3b8", "#475569"];

    entities.push({
      type: isCar ? "car" : "person",
      x: home.x + 0.5,
      y: home.y + 0.5,
      home,
      work,
      workType: work.type,
      path: [],
      state: "AT_HOME",
      speed: isCar ? 0.1 : 0.04,
      c: c[0],
      cD: c[1],
      actionTimer: Math.random() * 60,
      dir: "se"
    });
  }
}

function updateAI() {
  if (state.timeSpeed === 0) return;
  const hour = (state.gameTime / 60) % 24;
  const speedMult = hasBuilding("cafe") ? 1.3 : 1.0;

  entities.forEach((ent) => {
    const currentSpeed =
      ent.speed * state.timeSpeed * (ent.type === "person" ? speedMult : 1);
    if (ent.state === "AT_HOME") {
      if (hour > 7 && hour < 9 && ent.work.x !== ent.home.x) {
        ent.state = "GOING_WORK";
        ent.path = findPath(
          Math.floor(ent.x),
          Math.floor(ent.y),
          ent.work.x,
          ent.work.y
        );
        ent.targetNode = null;
      } else if (hour > 10 && hour < 17 && Math.random() < 0.005) {
        ent.state = "WANDERING";
        ent.actionTimer = 200;
      }
    } else if (ent.state === "WORKING") {
      if (hour > 17 && hour < 19) {
        ent.state = "GOING_HOME";
        ent.path = findPath(
          Math.floor(ent.x),
          Math.floor(ent.y),
          ent.home.x,
          ent.home.y
        );
        ent.targetNode = null;
      }
    } else if (ent.state === "WANDERING") {
      ent.actionTimer -= state.timeSpeed;
      if (ent.actionTimer <= 0) {
        ent.state = "GOING_HOME";
        ent.path = findPath(
          Math.floor(ent.x),
          Math.floor(ent.y),
          ent.home.x,
          ent.home.y
        );
        ent.targetNode = null;
      }
    }

    if (ent.path && ent.path.length > 0) {
      if (!ent.targetNode) {
        ent.targetNode = ent.path.shift();
        ent.tx = ent.targetNode.x + 0.5;
        ent.ty = ent.targetNode.y + 0.5;
      }
      const dx = ent.tx - ent.x,
        dy = ent.ty - ent.y,
        dist = Math.sqrt(dx * dx + dy * dy);

      if (
        dist < 0.2 &&
        ent.type === "car" &&
        state.map[Math.floor(ent.y)]?.[Math.floor(ent.x)] === "road"
      ) {
        const conn = checkRoadAutoTile(Math.floor(ent.x), Math.floor(ent.y));
        if (conn.sum >= 3 && Math.random() < 0.1) {
          return;
        }
      }

      if (dist < currentSpeed) {
        ent.x = ent.tx;
        ent.y = ent.ty;
        ent.targetNode = null;
        if (ent.path.length === 0) {
          ent.state =
            ent.state === "GOING_WORK"
              ? "WORKING"
              : ent.state === "GOING_HOME"
              ? "AT_HOME"
              : ent.state;
        }
      } else if (dist > 0) {
        ent.x += (dx / dist) * currentSpeed;
        ent.y += (dy / dist) * currentSpeed;
        ent.dir =
          Math.abs(dx) > Math.abs(dy)
            ? dx > 0
              ? "se"
              : "nw"
            : dy > 0
            ? "sw"
            : "ne";
      }
    } else if (ent.state === "WANDERING" && Math.random() < 0.02) {
      const dirs = [
          [0, -1],
          [0, 1],
          [-1, 0],
          [1, 0]
        ],
        valid = [];
      dirs.forEach((d) => {
        const nx = Math.floor(ent.x) + d[0],
          ny = Math.floor(ent.y) + d[1];
        if (
          nx >= 0 &&
          nx < MAP_SIZE &&
          ny >= 0 &&
          ny < MAP_SIZE &&
          state.map[ny] &&
          state.map[ny][nx] === "road"
        )
          valid.push({ x: nx, y: ny });
      });
      if (valid.length > 0)
        ent.path = [valid[Math.floor(Math.random() * valid.length)]];
    }
  });
}

function findPath(sx, sy, gx, gy) {
  const h = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  let open = [{ x: sx, y: sy, f: 0, g: 0, parent: null }],
    closed = new Set();
  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    let cur = open.shift();
    if (cur.x === gx && cur.y === gy) {
      let p = [];
      while (cur) {
        p.unshift({ x: cur.x, y: cur.y });
        cur = cur.parent;
      }
      return p;
    }
    closed.add(`${cur.x},${cur.y}`);
    [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0]
    ].forEach((d) => {
      let nx = cur.x + d[0],
        ny = cur.y + d[1];
      if (
        nx >= 0 &&
        nx < MAP_SIZE &&
        ny >= 0 &&
        ny < MAP_SIZE &&
        state.map[ny] &&
        (state.map[ny][nx] === "road" || (nx === gx && ny === gy)) &&
        !closed.has(`${nx},${ny}`)
      ) {
        let g = cur.g + 1,
          ex = open.find((n) => n.x === nx && n.y === ny);
        if (!ex)
          open.push({
            x: nx,
            y: ny,
            g,
            f: g + h({ x: nx, y: ny }, { x: gx, y: gy }),
            parent: cur
          });
        else if (g < ex.g) {
          ex.g = g;
          ex.f = g + h({ x: nx, y: ny }, { x: gx, y: gy });
          ex.parent = cur;
        }
      }
    });
  }
  return null;
}

/* --- Input & Camera --- */
function getEventPos(e) {
  const r = canvas.getBoundingClientRect();
  return e.touches
    ? { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top }
    : { x: e.clientX - r.left, y: e.clientY - r.top };
}
function onPointerDown(e) {
  if (e.target !== canvas) return;
  const p = getEventPos(e);
  isDragging = true;
  dragStart = p;
  lastMouse = p;
  cameraStart = { x: camera.targetX, y: camera.targetY };
  camera.vx = 0;
  camera.vy = 0;
}
function onPointerMove(e) {
  const p = getEventPos(e);
  if (isDragging) {
    camera.targetX = cameraStart.x + (p.x - dragStart.x) / camera.zoom;
    camera.targetY = cameraStart.y + (p.y - dragStart.y) / camera.zoom;
    camera.vx = p.x - lastMouse.x;
    camera.vy = p.y - lastMouse.y;
    lastMouse = p;
  }
  hoverTile = toGrid(p.x, p.y);

  const info = document.getElementById("info-panel");
  if (hoverTile && !isDragging && !selectedBuild && !isDemolish) {
    if (state.map[hoverTile.y]) {
      const id = state.map[hoverTile.y][hoverTile.x];
      if (id && BUILDINGS[id]) {
        document.getElementById("info-title").innerText =
          BUILDINGS[id].icon + " " + BUILDINGS[id].name;
        document.getElementById("info-desc").innerText = BUILDINGS[id].desc;
        const req = document.getElementById("info-req");
        if (state.mayorLevel < BUILDINGS[id].reqLevel) {
          req.innerText = `⚠️ 市長Lv.${BUILDINGS[id].reqLevel}が必要`;
          req.style.display = "block";
        } else {
          req.style.display = "none";
        }
        info.style.display = "block";
        return;
      }
    }
  }
  if (info) info.style.display = "none";
}
function onPointerUp(e) {
  if (!isDragging) return;
  const p = getEventPos(e);
  const move = Math.abs(p.x - dragStart.x) + Math.abs(p.y - dragStart.y);
  isDragging = false;
  if (move > 5) {
    camera.targetX += (camera.vx * 4) / camera.zoom;
    camera.targetY += (camera.vy * 4) / camera.zoom;
  } else handleGridClick(p);
}
function zoomCamera(delta) {
  camera.zoom = Math.max(0.4, Math.min(3.0, camera.zoom + delta));
}
function rotateCamera() {
  viewAngle = (viewAngle + 1) % 4;
  showToast("🔄 視点回転");
}

function toScreen(x, y) {
  let rx = x,
    ry = y;
  if (viewAngle === 1) {
    rx = MAP_SIZE - 1 - y;
    ry = x;
  } else if (viewAngle === 2) {
    rx = MAP_SIZE - 1 - x;
    ry = MAP_SIZE - 1 - y;
  } else if (viewAngle === 3) {
    rx = y;
    ry = MAP_SIZE - 1 - x;
  }
  return {
    x: (rx - ry) * (TILE_W / 2) + camera.x,
    y: (rx + ry) * (TILE_H / 2) + camera.y
  };
}
function toGrid(sx, sy) {
  if (!canvas) return null;
  const cx = (sx - canvas.width / 2) / camera.zoom + canvas.width / 2;
  const cy = (sy - canvas.height / 2) / camera.zoom + canvas.height / 2;
  const dx = cx - camera.x;
  const dy = cy - camera.y;
  const rx = Math.floor((dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2);
  const ry = Math.floor((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2);
  if (rx < 0 || rx >= MAP_SIZE || ry < 0 || ry >= MAP_SIZE) return null;
  if (viewAngle === 0) return { x: rx, y: ry };
  if (viewAngle === 1) return { x: ry, y: MAP_SIZE - 1 - rx };
  if (viewAngle === 2) return { x: MAP_SIZE - 1 - rx, y: MAP_SIZE - 1 - ry };
  return { x: MAP_SIZE - 1 - ry, y: rx };
}

function handleGridClick(screenPos) {
  if (!hoverTile) return;
  const { x: gx, y: gy } = hoverTile;
  const ent = entities.find(
    (e) =>
      Math.floor(e.x) === gx && Math.floor(e.y) === gy && e.type === "person"
  );
  if (ent && !selectedBuild && !isDemolish) {
    const isHappy = hasBuilding("park") || state.weather === "Clear";
    const words = isHappy
      ? ["Nice day!", "Hello!", "Good job!"]
      : ["Hmm...", "Busy...", "Hi."];
    addFloatingText(
      words[Math.floor(Math.random() * words.length)],
      gx,
      gy,
      "#000",
      true
    );
    playSE("hello");
    return;
  }
  if (isDemolish) {
    if (state.map[gy] && state.map[gy][gx]) {
      const cost = BUILDINGS[state.map[gy][gx]]?.cost || 0;
      state.map[gy][gx] = null;
      state.coins += Math.floor(cost * 0.5);
      playSE("demolish");
      saveGame();
      spawnResidents();
      updateUI();
      addParticle(screenPos.x, screenPos.y, "#94a3b8", "dust");
    }
    return;
  }
  if (!selectedBuild) return;
  const item = BUILDINGS[selectedBuild];
  if (state.mayorLevel < item.reqLevel) {
    showToast("⚠️ レベルが足りません");
    return;
  }
  if (state.coins >= item.cost) {
    if (
      state.map[gy][gx] &&
      !["road", "water", "grass"].includes(state.map[gy][gx])
    )
      return;
    state.coins -= item.cost;
    state.map[gy][gx] = selectedBuild;
    state.builtCount++;
    addExp(Math.max(5, Math.floor(item.cost / 10)));
    checkAchievements();
    playSE("build");
    addParticle(screenPos.x, screenPos.y, "#34d399", "dust");
    updateUI();
    spawnResidents();
    saveGame();
  } else showToast("⚠️ 資金が足りません");
}

/* --- Main Loop --- */
function gameLoop() {
  try {
    if (!isGameStarted) {
      requestAnimationFrame(gameLoop);
      return;
    }
    timeFrame++;

    camera.x += (camera.targetX - camera.x) * 0.15;
    camera.y += (camera.targetY - camera.y) * 0.15;

    const prevDay = state.day;
    state.gameTime += 0.25 * state.timeSpeed;
    if (state.gameTime >= 24 * 60) {
      state.gameTime = 0;
      state.day++;
      if (state.day % 30 === 0) {
        state.seasonIdx = (state.seasonIdx + 1) % 4;
        showToast(`🌸 季節が ${SEASONS[state.seasonIdx]} に変わりました`);
      }
      changeWeather();
    }
    if (prevDay !== state.day) collectTaxes();
    if (timeFrame % 2 === 0) updateAI();

    if (
      state.showParticles &&
      state.timeSpeed > 0 &&
      (state.weather === "Rain" || state.weather === "Snow")
    ) {
      const w = canvas.width / camera.zoom,
        h = canvas.height / camera.zoom;
      if (state.weather === "Rain" && Math.random() < 0.6) {
        for (let i = 0; i < 2; i++)
          addParticle(
            camera.x + (Math.random() - 0.5) * w * 1.5,
            camera.y - h / 2 - 100 + Math.random() * 50,
            "",
            "rain"
          );
      }
      if (state.weather === "Snow" && Math.random() < 0.3) {
        addParticle(
          camera.x + (Math.random() - 0.5) * w * 1.5,
          camera.y - h / 2 - 50,
          "#fff",
          "snow"
        );
      }
    }

    if (timeFrame % 30 === 0) updateUI();
    if (timeFrame % 10 === 0 && state.showParticles) updateStateIcons();

    render();
  } catch (e) {
    console.error(e);
  }
  requestAnimationFrame(gameLoop);
}

function resize() {
  const container = document.getElementById("game-container");
  if (!container || !canvas) return;
  canvas.width = container.clientWidth || window.innerWidth || 800;
  canvas.height = container.clientHeight || window.innerHeight || 600;
  if (camera.targetX === 0 && camera.targetY === 0) {
    camera.targetX = canvas.width / 2;
    camera.targetY = canvas.height / 3;
    camera.x = camera.targetX;
    camera.y = camera.targetY;
  }
}
