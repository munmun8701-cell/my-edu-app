/* =========================================================================
   English Town Simulator 3D - Ultimate Edition V4
   - 描画エンジンを Three.js による本格3Dに刷新（影・昼夜・季節・天候・夜景）
   - 全12種の建物を細部まで作り込み（道路は自動接続・歩道・横断歩道・街灯付き）
   - クイズ・経済・住民AI・セーブデータは従来版と互換（同じセーブを引き継ぎ）
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
const HALF = MAP_SIZE / 2;
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];
const WEATHER_TYPES = ["Clear", "Rain", "Snow", "Cloudy"];
const SAVE_KEY = "EngTown_V3_Fix"; // 既存のセーブデータをそのまま引き継ぐため同じキーを使用

// 建築物データ（価格・解放レベル・効果は従来のまま）
const BUILDINGS = {
  road: {
    id: "road",
    name: "道路",
    en: "Road",
    desc: "街の基本インフラ。ドラッグでまっすぐ引けます",
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
    en: "Canal",
    desc: "潤いを与える水辺。ドラッグで連続配置",
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
    en: "Flower Bed",
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
    en: "Tree",
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
    en: "Park",
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
    en: "Small House",
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
    en: "Big House",
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
    en: "Shop",
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
    en: "Cafe",
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
    en: "Office",
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
    en: "School",
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
    en: "Hospital",
    desc: "悪天候でも税収が減らない",
    cost: 1200,
    icon: "🏥",
    type: "work",
    pop: 0,
    tax: 0,
    reqLevel: 7
  }
};
// ドラッグで直線配置できる安価なアイテム
const LINE_BUILD = { road: true, water: true, grass: true, tree: true };

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
  highQuality: true,
  gameTime: 8 * 60,
  day: 1,
  seasonIdx: 0,
  weather: "Clear",
  achieved: {},
  builtCount: 0,
  timeSpeed: 1
};

let entities = [];
let timeFrame = 0;
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
  audioCtx = null,
  isBGMPlaying = false,
  isGameStarted = false;

function hashPos(x, y) {
  return (Math.abs(Math.sin(x * 12.9898 + y * 78.233)) * 43758.5453) % 1;
}

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

/* --- Boot --- */
const THREE_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
  "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js",
  "https://unpkg.com/three@0.128.0/build/three.min.js"
];
function loadThree(cb) {
  if (window.THREE) return cb(true);
  let i = 0;
  const next = () => {
    if (i >= THREE_URLS.length) return cb(false);
    const s = document.createElement("script");
    s.src = THREE_URLS[i++];
    s.onload = () => (window.THREE ? cb(true) : next());
    s.onerror = () => {
      s.remove();
      next();
    };
    document.head.appendChild(s);
  };
  next();
}

function setStartStatus(text, ready) {
  const st = document.getElementById("start-status");
  if (st) st.innerText = text;
  const btn = document.getElementById("btn-start-game");
  if (btn) btn.disabled = !ready;
}

function boot() {
  canvas = document.getElementById("gameCanvas");
  bindEvents();
  loadSave();
  initBuildMenu();
  renderStageGrid();
  updateUI();
  initFx2D();
  initPanelToggles();
  setStartStatus("3Dグラフィックを読み込み中…", false);
  loadThree((ok) => {
    if (!ok) {
      setStartStatus(
        "⚠️ 3D表示を読み込めませんでした。インターネット接続を確認してページを再読み込みしてください。",
        false
      );
      return;
    }
    const fontsReady =
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(
      () => {
        try {
          init3D();
        } catch (e) {
          console.error(e);
          setStartStatus(
            "⚠️ この端末では3D表示(WebGL)が使えないようです。別のブラウザでお試しください。",
            false
          );
          return;
        }
        try {
          renderBuildThumbnails();
        } catch (e) {
          console.warn(e);
        }
        initBuildMenu();
        rebuildWorld();
        bindCanvasEvents();
        setStartStatus("準備完了！", true);
        requestAnimationFrame(frame);
      }
    );
  });
}

function initPanelToggles() {
  ["build-panel", "quiz-menu"].forEach((pid) => {
    const panel = document.getElementById(pid);
    const header = panel && panel.querySelector(".panel-header");
    if (!header || header.querySelector(".panel-toggle")) return;
    const btn = document.createElement("button");
    btn.className = "panel-toggle";
    btn.title = "折りたたむ / ひらく";
    btn.innerText = "▾";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const c = panel.classList.toggle("collapsed");
      btn.innerText = c ? "▸" : "▾";
    });
    header.insertBefore(btn, header.firstChild);
  });
}

function bindEvents() {
  window.addEventListener("resize", resize);
  const on = (id, ev, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(ev, fn);
  };
  on("btn-start-game", "click", startGame);
  on("btn-pause", "click", () => setTimeSpeed(0));
  on("btn-play", "click", () => setTimeSpeed(1));
  on("btn-fast", "click", () => setTimeSpeed(3));
  on("btn-achieve", "click", () => openModal("achieve-modal"));
  on("btn-dict", "click", () => openModal("dict-modal"));
  on("btn-settings", "click", () => openModal("settings-modal"));
  on("btn-zoom-in", "click", () => zoomCamera(1.25));
  on("btn-zoom-out", "click", () => zoomCamera(0.8));
  on("btn-rotate", "click", rotateCamera);
  on("btn-retire", "click", quitQuiz);
  on("btn-next-stage", "click", showQuizMenu);
  on("demolish-btn", "click", toggleDemolish);
  on("chk-bgm", "change", toggleBGM);
  on("chk-se", "change", toggleSE);
  on("chk-particles", "change", toggleParticles);
  on("chk-hq", "change", toggleQuality);
  on("btn-export", "click", exportSave);
  on("btn-import", "click", importSave);
  on("btn-reset-data", "click", requestReset);
  on("data-copy", "click", copySaveData);
  on("data-load", "click", loadSaveData);
  on("build-hint-cancel", "click", cancelBuildMode);
  document
    .querySelectorAll(".close-modal-btn")
    .forEach((btn) => btn.addEventListener("click", closeModal));
  document.querySelectorAll(".modal-overlay").forEach((m) =>
    m.addEventListener("click", (e) => {
      if (e.target === m) closeModal();
    })
  );
  window.addEventListener("keydown", onKeyDown);
}

function startGame() {
  if (isGameStarted || !ENGINE.ready) return;
  const screen = document.getElementById("start-screen");
  if (screen) {
    screen.style.opacity = "0";
    setTimeout(() => (screen.style.display = "none"), 600);
  }
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      audioCtx = new AC();
      if (state.playBGM) startBGM();
    }
  }
  CAM.taz =
    Math.round((CAM.taz - Math.PI / 4) / (Math.PI / 2)) * (Math.PI / 2) +
    Math.PI / 4;
  CAM.tzoom = 1.7;
  CAM.tx = 0.5;
  CAM.tz = 0.5;
  resize();
  isGameStarted = true;
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
  safeSetItem(SAVE_KEY, JSON.stringify(state));
  if (isAuto) showToast("💾 Auto Saved");
}

function loadSave() {
  const saved = safeGetItem(SAVE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
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
      if (!state.achieved) state.achieved = {};
      if (typeof state.highQuality !== "boolean") state.highQuality = true;
    } catch (e) {
      initMap();
    }
  } else {
    initMap();
  }
  // 存在しない建物IDの掃除（データ破損対策）
  for (let y = 0; y < MAP_SIZE; y++)
    for (let x = 0; x < MAP_SIZE; x++)
      if (state.map[y][x] && !BUILDINGS[state.map[y][x]])
        state.map[y][x] = null;

  entities = [];
  spawnResidents();
  if (saved) changeWeather(true);
  else state.weather = "Clear"; // 初めて遊ぶ人は晴れの日からスタート
  [
    ["bgm", "playBGM"],
    ["se", "playSE"],
    ["particles", "showParticles"],
    ["hq", "highQuality"]
  ].forEach(([id, key]) => {
    const el = document.getElementById(`chk-${id}`);
    if (el) el.checked = state[key];
  });
  if (autoSaveTimer) clearInterval(autoSaveTimer);
  autoSaveTimer = setInterval(() => saveGame(true), 60000);
  if (typeof ENGINE !== "undefined" && ENGINE.ready) {
    applyQuality();
    rebuildWorld();
  }
}

function requestReset() {
  showModal("全データを消去しますか？", () => {
    safeRemoveItem(SAVE_KEY);
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
  saveGame();
}
function toggleQuality() {
  state.highQuality = document.getElementById("chk-hq").checked;
  applyQuality();
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
      osc.type = "triangle";
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.setValueAtTime(495, now + 0.07);
      osc.frequency.setValueAtTime(660, now + 0.14);
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.32);
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
    } else if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
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
    for (let x = 0; x < MAP_SIZE; x++)
      if (state.map[y][x]) p += BUILDINGS[state.map[y][x]]?.pop || 0;
  }
  return p;
}

function hasBuilding(id) {
  for (let y = 0; y < MAP_SIZE; y++) {
    if (!state.map[y]) continue;
    for (let x = 0; x < MAP_SIZE; x++) if (state.map[y][x] === id) return true;
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
    addParticle(
      window.innerWidth / 2,
      window.innerHeight * 0.35,
      "",
      "confetti"
    );
    req = getRequiredExp(state.mayorLevel);
  }
  checkAchievements();
  updateUI();
}

function getTownTitle(pop) {
  if (pop < 10) return "🌱 開拓村";
  if (pop < 30) return "🏘️ 発展する町";
  if (pop < 70) return "🏙️ 活気ある都市";
  if (pop < 150) return "🌆 大都市";
  return "👑 メガロポリス";
}

function updateUI() {
  const setText = (id, t) => {
    const el = document.getElementById(id);
    if (el && el.innerText !== String(t)) el.innerText = t;
  };
  setText("coin-display", state.coins);
  const pop = getPopulation();
  setText("pop-display", pop);
  setText("town-title", getTownTitle(pop));
  setText("mayor-level", `Mayor Lv.${state.mayorLevel}`);
  const expBar = document.getElementById("exp-bar");
  if (expBar)
    expBar.style.width = `${Math.min(
      100,
      (state.exp / getRequiredExp(state.mayorLevel)) * 100
    )}%`;

  const h = Math.floor(state.gameTime / 60) % 24;
  const m = Math.floor(state.gameTime % 60);
  setText(
    "time-display",
    `🕒 Day ${state.day} - ${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}`
  );

  const envDisp = document.getElementById("env-display");
  if (envDisp) {
    const w =
      state.weather === "Clear"
        ? "☀️"
        : state.weather === "Rain"
        ? "🌧️"
        : state.weather === "Snow"
        ? "❄️"
        : "☁️";
    const t = `${["🌸", "🌻", "🍁", "⛄"][state.seasonIdx]} ${
      SEASONS[state.seasonIdx]
    } | ${w} ${state.weather}`;
    if (envDisp.innerText !== t) envDisp.innerText = t;
  }

  document.querySelectorAll(".build-item").forEach((btn) => {
    const item = BUILDINGS[btn.dataset.id];
    if (!item) return;
    const locked = state.mayorLevel < item.reqLevel;
    btn.classList.toggle("locked", locked);
    btn.classList.toggle("disabled", !locked && state.coins < item.cost);
    btn.classList.toggle("selected", selectedBuild === item.id);
  });

  const toggle = (id, on) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active-btn", on);
  };
  toggle("btn-pause", state.timeSpeed === 0);
  toggle("btn-play", state.timeSpeed === 1);
  toggle("btn-fast", state.timeSpeed === 3);
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
        if (state.showParticles) spawnCoinBurst(x, y, 4);
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

/* --- 2D Overlay FX (紙吹雪など画面エフェクト) --- */
let fxCanvas = null,
  fxCtx = null,
  fxParticles = [];
function initFx2D() {
  fxCanvas = document.createElement("canvas");
  fxCanvas.id = "fx-canvas";
  document.body.appendChild(fxCanvas);
  fxCtx = fxCanvas.getContext("2d");
  resizeFx2D();
}
function resizeFx2D() {
  if (!fxCanvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  fxCanvas.width = window.innerWidth * dpr;
  fxCanvas.height = window.innerHeight * dpr;
  fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function addParticle(x, y, color, type = "confetti") {
  if (!state.showParticles || !fxCtx) return;
  const cols = [
    "#ef4444",
    "#3b82f6",
    "#34d399",
    "#fbbf24",
    "#f472b6",
    "#a78bfa"
  ];
  const count = type === "confetti" ? 36 : 8;
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = Math.random() * 7 + 2;
    fxParticles.push({
      x,
      y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 5,
      life: 1,
      decay: 0.012 + Math.random() * 0.008,
      size: Math.random() * 6 + 4,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      color: color || cols[Math.floor(Math.random() * cols.length)]
    });
  }
}
function updateFx2D() {
  if (!fxCtx) return;
  if (fxParticles.length === 0) {
    if (fxCanvas._dirty) {
      fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      fxCanvas._dirty = false;
    }
    return;
  }
  fxCanvas._dirty = true;
  fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = fxParticles.length - 1; i >= 0; i--) {
    const p = fxParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.18;
    p.vx *= 0.99;
    p.rot += p.vr;
    p.life -= p.decay;
    if (p.life <= 0) {
      fxParticles.splice(i, 1);
      continue;
    }
    fxCtx.globalAlpha = Math.min(1, p.life * 1.5);
    fxCtx.fillStyle = p.color;
    fxCtx.save();
    fxCtx.translate(p.x, p.y);
    fxCtx.rotate(p.rot);
    fxCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    fxCtx.restore();
  }
  fxCtx.globalAlpha = 1;
}

/* --- 住人の状態アイコン（3D座標から画面へ投影） --- */
let stateIconPool = [];
function updateStateIcons() {
  const layer = document.getElementById("floating-ui-layer");
  if (!layer || !ENGINE.ready) return;
  let used = 0;
  if (state.showParticles && CAM.zoom >= 0.85 && isGameStarted) {
    const seen = new Set();
    const night = isNightTime();
    const W = canvas.clientWidth,
      H = canvas.clientHeight;
    for (const ent of entities) {
      let emoji = null,
        wx,
        wz,
        wy = 0.6;
      if (ent.state === "AT_HOME" && night) {
        emoji = "💤";
        wx = ent.home.x;
        wz = ent.home.y;
        wy = 1.0;
      } else if (ent.state === "WORKING") {
        emoji =
          ent.workType === "school"
            ? "🏫"
            : ent.workType === "hospital"
            ? "🏥"
            : "💦";
        wx = ent.work.x;
        wz = ent.work.y;
        wy = 1.2;
      } else if (ent.state === "GOING_WORK" || ent.state === "WANDERING") {
        if (!ent._vis) continue;
        emoji = ent.state === "GOING_WORK" ? "💼" : "🚶";
        const key = ent;
        const sc = projectToScreen(
          ent.rx,
          ent.type === "car" ? 0.55 : 0.6,
          ent.rz
        );
        if (!sc || sc.x < -30 || sc.x > W + 30 || sc.y < -30 || sc.y > H + 30)
          continue;
        placeIcon(layer, used++, emoji, sc.x, sc.y);
        continue;
      } else continue;
      const k = wx + "," + wz + emoji;
      if (seen.has(k)) continue;
      seen.add(k);
      const sc = projectToScreen(wx - HALF + 0.5, wy, wz - HALF + 0.5);
      if (!sc || sc.x < -30 || sc.x > W + 30 || sc.y < -30 || sc.y > H + 30)
        continue;
      placeIcon(layer, used++, emoji, sc.x, sc.y);
      if (used > 120) break;
    }
  }
  for (let i = used; i < stateIconPool.length; i++)
    stateIconPool[i].style.display = "none";
}
function placeIcon(layer, i, emoji, x, y) {
  let el = stateIconPool[i];
  if (!el) {
    el = document.createElement("div");
    el.className = "emoji-state";
    layer.appendChild(el);
    stateIconPool[i] = el;
  }
  if (el._e !== emoji) {
    el.innerText = emoji;
    el._e = emoji;
  }
  el.style.display = "block";
  el.style.left = `${Math.round(x - 10)}px`;
  el.style.top = `${Math.round(y - 22)}px`;
}

function addFloatingText(text, gx, gy, color, isBubble = false) {
  const layer = document.getElementById("floating-ui-layer");
  if (!layer || !ENGINE.ready) return;
  const sc = projectToScreen(
    gx - HALF + 0.5,
    isBubble ? 0.75 : 1.0,
    gy - HALF + 0.5
  );
  if (!sc) return;
  const el = document.createElement("div");
  el.className = isBubble ? "talk-bubble" : "floating-text";
  el.style.left = `${sc.x - (isBubble ? 30 : 16)}px`;
  el.style.top = `${sc.y - 40}px`;
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
  while (area.children.length > 4) area.removeChild(area.firstChild);
  const el = document.createElement("div");
  el.className = "toast";
  el.innerText = msg;
  area.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function renderDictionary() {
  const list = document.getElementById("dict-list");
  if (!list) return;
  const maxIdx = Math.min(
    (state.unlockedStage - 1) * WORDS_PER_STAGE,
    VOCABULARY.length
  );
  document.getElementById("dict-progress").innerText = maxIdx;
  let html = "";
  for (let i = 0; i < maxIdx; i++)
    html += `<div class="word-row"><strong>${VOCABULARY[i].en}</strong><span>${VOCABULARY[i].jp}</span></div>`;
  list.innerHTML =
    html ||
    `<div class="word-row" style="grid-column:1/-1;justify-content:center;">ステージをクリアすると単語が増えていきます</div>`;
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
  list.innerHTML = ACHIEVEMENTS.map((a) => {
    const d = state.achieved[a.id];
    return `<div class="achievement-row ${d ? "ach-done" : ""}"><span>${
      a.desc
    }</span> <span style="color:${d ? "#34d399" : "#fbbf24"}">${
      d ? "✅済" : `🎁${a.reward}G`
    }</span></div>`;
  }).join("");
}
function openDataModal(mode) {
  const title = document.getElementById("data-modal-title");
  const desc = document.getElementById("data-modal-desc");
  const ta = document.getElementById("data-text");
  const copyBtn = document.getElementById("data-copy");
  const loadBtn = document.getElementById("data-load");
  if (!ta) return;
  closeModal();
  if (mode === "export") {
    title.innerText = "💾 データ書き出し";
    desc.innerText =
      "下の文字列をコピーして保存しておくと、別の端末やブラウザで続きから遊べます。";
    ta.value = btoa(encodeURIComponent(JSON.stringify(state)));
    ta.readOnly = true;
    copyBtn.style.display = "";
    loadBtn.style.display = "none";
  } else {
    title.innerText = "📥 データ読み込み";
    desc.innerText =
      "書き出したデータを貼り付けて「このデータを読み込む」を押してください。今の街は上書きされます。";
    ta.value = "";
    ta.readOnly = false;
    copyBtn.style.display = "none";
    loadBtn.style.display = "";
  }
  openModal("data-modal");
  setTimeout(() => {
    try {
      ta.focus();
      if (mode === "export") ta.select();
    } catch (e) {}
  }, 50);
}
function exportSave() {
  openDataModal("export");
}
function importSave() {
  openDataModal("import");
}
function copySaveData() {
  const ta = document.getElementById("data-text");
  const fallback = () => {
    ta.focus();
    ta.select();
    showToast("📋 選択しました。コピーしてください");
  };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(ta.value)
        .then(() => showToast("📋 コピーしました"), fallback);
    } else fallback();
  } catch (e) {
    fallback();
  }
}
function loadSaveData() {
  const d = (document.getElementById("data-text").value || "").trim();
  if (!d) {
    showToast("⚠️ データを貼り付けてください");
    return;
  }
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(d)));
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.map))
      throw new Error("bad");
    state = { ...state, ...parsed };
    saveGame();
    loadSave();
    renderStageGrid();
    updateUI();
    closeModal();
    showToast("✅ ロード成功");
  } catch (e) {
    showToast("❌ データが正しくありません。もう一度コピーし直してください");
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
    btn.className = `stage-btn ${isExam ? "exam" : ""} ${
      i < state.unlockedStage ? "cleared" : ""
    } ${i === state.unlockedStage ? "current" : ""}`;
    btn.innerText = isExam ? `Exam ${i / 10}` : `St ${i}`;
    if (i > state.unlockedStage) btn.disabled = true;
    btn.addEventListener("click", () => startQuizSession(i, isExam));
    grid.appendChild(btn);
  }
  const cur = grid.querySelector(".current");
  if (cur)
    setTimeout(() => {
      try {
        grid.scrollTop = cur.offsetTop - grid.offsetTop - 60;
      } catch (e) {}
    }, 0);
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

  // 同じ日本語訳の選択肢が並ばないようにする（例: afternoon と p.m. はどちらも「午後」）
  let opts = [currentWord];
  let guard = 0;
  while (opts.length < 4 && guard++ < 1000) {
    const r = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    if (!opts.find((o) => o.en === r.en || o.jp === r.jp)) opts.push(r);
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
    if (opt.en === currentWord.en) b.dataset.correct = "1";
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
    const r = btn.getBoundingClientRect();
    addParticle(r.left + r.width / 2, r.top + r.height / 2, "", "confetti");
    showToast(`+${coinsEarned}G`);
  } else {
    btn.classList.add("wrong");
    playSE("wrong");
    quizState.combo = 0;
    document.getElementById("combo-display").style.opacity = "0";
    document.querySelectorAll(".answer-btn").forEach((b) => {
      if (b.dataset.correct) b.classList.add("correct");
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
    const r = document.getElementById("quiz-result").getBoundingClientRect();
    addParticle(r.left + r.width / 2, r.top + 40, "", "confetti");
    addParticle(r.left + r.width / 2, r.top + 40, "", "confetti");
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
let BUILD_THUMBS = {};
function initBuildMenu() {
  const container = document.getElementById("build-items");
  if (!container) return;
  container.innerHTML = "";
  Object.values(BUILDINGS).forEach((b) => {
    const el = document.createElement("div");
    el.className = "build-item";
    el.dataset.id = b.id;
    el.dataset.cost = b.cost;
    el.title = `${b.name} (${b.en})\n${b.desc}`;
    const thumb = BUILD_THUMBS[b.id];
    el.innerHTML =
      (thumb
        ? `<img class="item-thumb" src="${thumb}" alt="" draggable="false">`
        : `<div class="item-icon">${b.icon}</div>`) +
      `<div class="item-name">${b.name}</div><div class="item-cost">${b.cost}G</div>` +
      `<div class="lock-badge">🔒 Lv.${b.reqLevel}</div>`;
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
  if (state.coins < BUILDINGS[id].cost) {
    showToast("⚠️ 資金が足りません。クイズでコインを稼ごう！");
    return;
  }
  playSE("click");
  isDemolish = false;
  document.getElementById("demolish-btn").classList.remove("selected");
  selectedBuild = selectedBuild === id ? null : id;
  updateUI();
  updateBuildHint();
  onBuildToolChanged();
}
function toggleDemolish() {
  selectedBuild = null;
  isDemolish = !isDemolish;
  document
    .getElementById("demolish-btn")
    .classList.toggle("selected", isDemolish);
  updateUI();
  updateBuildHint();
  onBuildToolChanged();
}
function cancelBuildMode() {
  if (!selectedBuild && !isDemolish) return;
  selectedBuild = null;
  isDemolish = false;
  const db = document.getElementById("demolish-btn");
  if (db) db.classList.remove("selected");
  updateUI();
  updateBuildHint();
  onBuildToolChanged();
}
function updateBuildHint(extra) {
  const hint = document.getElementById("build-hint");
  const txt = document.getElementById("build-hint-text");
  if (!hint || !txt) return;
  if (isDemolish) {
    txt.innerText =
      extra || "🚜 取壊しモード：壊したい建物をタップ（費用の半額が戻ります）";
    hint.classList.add("show", "danger");
  } else if (selectedBuild) {
    const b = BUILDINGS[selectedBuild];
    txt.innerText =
      extra ||
      (LINE_BUILD[selectedBuild]
        ? `${b.icon} ${b.name}：タップで配置／ドラッグでまっすぐ連続配置`
        : `${b.icon} ${b.name}：置きたい場所をタップ`);
    hint.classList.add("show");
    hint.classList.remove("danger");
  } else {
    hint.classList.remove("show", "danger");
  }
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

function isNightTime() {
  const h = (state.gameTime / 60) % 24;
  return h < 6 || h >= 18;
}

/* --- AI（住民の行動ロジックは従来のまま） --- */
const CAR_COLORS = [
  0xef4444, 0x3b82f6, 0xf8fafc, 0x1f2937, 0xfacc15, 0x10b981, 0x94a3b8,
  0xf97316, 0x8b5cf6
];
const SKIN_COLORS = [0xffe0bd, 0xf1c27d, 0xe0ac69, 0xc68642, 0xffdbac];
const HAIR_COLORS = [
  0x2b1b10, 0x4a2f1b, 0x111111, 0x8d5524, 0xd6a756, 0x5b3a29
];
const UMB_COLORS = [
  0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e, 0xec4899, 0xf8fafc, 0x8b5cf6
];
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
  entities = entities.filter(
    (e) =>
      e.home &&
      state.map[e.home.y] &&
      state.map[e.home.y][e.home.x] &&
      BUILDINGS[state.map[e.home.y][e.home.x]]?.type === "home"
  );
  // 職場が無くなった住人は自宅待機に
  entities.forEach((e) => {
    if (
      e.work &&
      e.work.type !== "none" &&
      state.map[e.work.y]?.[e.work.x] !== e.work.type
    ) {
      e.work = { x: e.home.x, y: e.home.y, type: "none" };
      e.workType = "none";
    }
  });
  while (entities.length > pop) entities.pop();
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
    if (work.type === "shop") c = ["#60a5fa", "#2563eb"];
    if (work.type === "cafe") c = ["#fb923c", "#c2410c"];
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
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
      carCol: pick(CAR_COLORS),
      skin: pick(SKIN_COLORS),
      hair: pick(HAIR_COLORS),
      umb: pick(UMB_COLORS),
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
      if (
        hour > 7 &&
        hour < 9 &&
        ent.failDay !== state.day &&
        (ent.work.x !== ent.home.x || ent.work.y !== ent.home.y)
      ) {
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
    // 経路が見つからない場合はその場の状態に戻す（従来版で歩き続けて止まらない不具合の修正）
    if (
      (ent.state === "GOING_WORK" || ent.state === "GOING_HOME") &&
      !ent.path
    ) {
      if (ent.state === "GOING_WORK") {
        ent.state = "AT_HOME";
        ent.failDay = state.day;
      } else {
        ent.x = ent.home.x + 0.5;
        ent.y = ent.home.y + 0.5;
        ent.state = "AT_HOME";
      }
      ent.path = [];
      return;
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
        if (conn.sum >= 3 && Math.random() < 0.1) return;
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
  let iter = 0;
  while (open.length > 0 && iter++ < 4000) {
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

/* =========================================================================
   3D ENGINE (Three.js r128)
   - 島・海・砂浜・灯台・雲・昼夜・季節・天候・影・夜の窓明かり
========================================================================= */
const ENGINE = { ready: false };
const DEG = Math.PI / 180;
const ZMIN = 0.5,
  ZMAX = 3.6,
  BASE_DIST = 34;
const CAM = {
  tx: 0.5,
  tz: 0.5,
  x: 0.5,
  z: 0.5,
  zoom: 1.45,
  tzoom: 1.45,
  az: Math.PI / 4,
  taz: Math.PI / 4,
  vx: 0,
  vz: 0,
  dist: BASE_DIST
};
const U = { night: { value: 0 }, time: { value: 0 } };
const EMI_WIN = [1.0, 0.74, 0.36];
const EMI_WIN2 = [0.85, 0.85, 0.7];
const EMI_LAMP = [1.7, 1.45, 0.95];

let renderer, scene, camera3, hemi, sun, raycaster, plane0;
let matWorld,
  matWater,
  matSea,
  matGhostOk,
  matGhostBad,
  matShadowOnly,
  matBlink;
let tileObjs = [];
let groundMesh = null,
  tuftMesh = null,
  gridLines = null;
let lampPoints = null,
  lampPools = null,
  headPoints = null;
let highlight = null,
  highlightEdge = null,
  lineMarks = null,
  ghost = null,
  ghostKey = "",
  demoBox = null;
let rainLines = null,
  snowPts = null,
  seasonPts = null,
  fountainPts = null;
let dustMesh = null,
  coinMesh = null;
let personParts = {},
  carMesh = null;
let clouds = [],
  sailboat = null,
  beamMesh = null,
  lighthouseLamp = null;
let tileAnims = [],
  tweens = [];
let fountainList = [];
let _v, _v2, _m4, _m4b, _q, _e, _s, _c, _c2, _n3, _obj;
let envState = { night: 0, lastSky: -1 };
let frameCount = 0;

function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function smooth(t) {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function tileW(x) {
  return x - HALF + 0.5;
}

/* ---------- Geometry builder: 部品を1つの頂点カラー付きジオメトリに結合 ---------- */
const UNIT = {};
function prepGeo(g) {
  if (g.index) g = g.toNonIndexed();
  if (g.attributes.uv) g.deleteAttribute("uv");
  if (g.attributes.uv2) g.deleteAttribute("uv2");
  g.computeVertexNormals();
  return g;
}
function unitBox() {
  return UNIT.box || (UNIT.box = prepGeo(new THREE.BoxGeometry(1, 1, 1)));
}
function unitCyl(seg, ratio) {
  const k = "c" + seg + "_" + ratio.toFixed(2);
  return (
    UNIT[k] ||
    (UNIT[k] = prepGeo(new THREE.CylinderGeometry(ratio, 1, 1, seg, 1)))
  );
}
function unitSphere(detail) {
  const k = "s" + detail;
  return (
    UNIT[k] || (UNIT[k] = prepGeo(new THREE.IcosahedronGeometry(1, detail)))
  );
}

class GeoBuilder {
  constructor() {
    this.P = [];
    this.N = [];
    this.C = [];
    this.E = [];
  }
  add(geo, m, color, emi, ao = true) {
    const pa = geo.attributes.position.array,
      na = geo.attributes.normal.array;
    const e = m.elements;
    _n3.getNormalMatrix(m);
    const ne = _n3.elements;
    _c.set(color);
    const er = emi ? emi[0] : 0,
      eg = emi ? emi[1] : 0,
      eb = emi ? emi[2] : 0;
    for (let i = 0; i < pa.length; i += 3) {
      const x = pa[i],
        y = pa[i + 1],
        z = pa[i + 2];
      const wx = e[0] * x + e[4] * y + e[8] * z + e[12];
      const wy = e[1] * x + e[5] * y + e[9] * z + e[13];
      const wz = e[2] * x + e[6] * y + e[10] * z + e[14];
      let nx = ne[0] * na[i] + ne[3] * na[i + 1] + ne[6] * na[i + 2];
      let ny = ne[1] * na[i] + ne[4] * na[i + 1] + ne[7] * na[i + 2];
      let nz = ne[2] * na[i] + ne[5] * na[i + 1] + ne[8] * na[i + 2];
      const nl = Math.hypot(nx, ny, nz) || 1;
      nx /= nl;
      ny /= nl;
      nz /= nl;
      this.P.push(wx, wy, wz);
      this.N.push(nx, ny, nz);
      let k = 1;
      if (ao && ny < 0.6 && wy < 0.2) k = 0.68 + (0.32 * Math.max(0, wy)) / 0.2;
      this.C.push(_c.r * k, _c.g * k, _c.b * k);
      this.E.push(er, eg, eb);
    }
    return this;
  }
  _mat(cx, cy, cz, sx, sy, sz, o) {
    _e.set(o.rx || 0, o.ry || 0, o.rz || 0, o.order || "YXZ");
    _q.setFromEuler(_e);
    _v.set(cx, cy, cz);
    _s.set(sx, sy, sz);
    return _m4.compose(_v, _q, _s);
  }
  // 底面基準の箱
  box(w, h, d, x, y, z, color, o = {}) {
    return this.add(
      unitBox(),
      this._mat(x, y + h / 2, z, w, h, d, o),
      color,
      o.emi,
      o.ao !== false
    );
  }
  // 中心基準の箱
  boxC(w, h, d, x, y, z, color, o = {}) {
    return this.add(
      unitBox(),
      this._mat(x, y, z, w, h, d, o),
      color,
      o.emi,
      o.ao !== false
    );
  }
  cyl(rt, rb, h, seg, x, y, z, color, o = {}) {
    const ratio = rb > 0 ? rt / rb : 1;
    const r = rb > 0 ? rb : rt;
    return this.add(
      unitCyl(seg, ratio),
      this._mat(x, y + h / 2, z, r * (o.sx || 1), h, r * (o.sz || 1), o),
      color,
      o.emi,
      o.ao !== false
    );
  }
  cone(r, h, seg, x, y, z, color, o = {}) {
    return this.cyl(0, r, h, seg, x, y, z, color, o);
  }
  sphere(r, detail, x, y, z, color, o = {}) {
    return this.add(
      unitSphere(detail),
      this._mat(x, y, z, r * (o.sx || 1), r * (o.sy || 1), r * (o.sz || 1), o),
      color,
      o.emi,
      o.ao !== false
    );
  }
  // 凸多面体（面の向きは自動補正）
  poly(pts, faces, color, o = {}) {
    let cx = 0,
      cy = 0,
      cz = 0;
    pts.forEach((p) => {
      cx += p[0];
      cy += p[1];
      cz += p[2];
    });
    cx /= pts.length;
    cy /= pts.length;
    cz /= pts.length;
    _c.set(color);
    const emi = o.emi;
    for (const f of faces) {
      let idx = f.slice();
      const a = pts[idx[0]],
        b = pts[idx[1]],
        c = pts[idx[2]];
      let nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]);
      let ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
      let nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
      let fx = 0,
        fy = 0,
        fz = 0;
      idx.forEach((i) => {
        fx += pts[i][0];
        fy += pts[i][1];
        fz += pts[i][2];
      });
      fx /= idx.length;
      fy /= idx.length;
      fz /= idx.length;
      if (nx * (fx - cx) + ny * (fy - cy) + nz * (fz - cz) < 0) {
        idx.reverse();
        nx = -nx;
        ny = -ny;
        nz = -nz;
      }
      const nl = Math.hypot(nx, ny, nz) || 1;
      nx /= nl;
      ny /= nl;
      nz /= nl;
      for (let i = 1; i < idx.length - 1; i++) {
        for (const j of [idx[0], idx[i], idx[i + 1]]) {
          const p = pts[j];
          this.P.push(p[0], p[1], p[2]);
          this.N.push(nx, ny, nz);
          let k = 1;
          if (o.ao !== false && ny < 0.6 && p[1] < 0.2)
            k = 0.68 + (0.32 * Math.max(0, p[1])) / 0.2;
          this.C.push(_c.r * k, _c.g * k, _c.b * k);
          this.E.push(emi ? emi[0] : 0, emi ? emi[1] : 0, emi ? emi[2] : 0);
        }
      }
    }
    return this;
  }
  // 切妻屋根の三角柱（棟はX方向）
  prism(cx, cz, y0, w, d, h, color, o = {}) {
    const x0 = cx - w / 2,
      x1 = cx + w / 2,
      z0 = cz - d / 2,
      z1 = cz + d / 2;
    const pts = [
      [x0, y0, z0],
      [x0, y0, z1],
      [x0, y0 + h, cz],
      [x1, y0, z0],
      [x1, y0, z1],
      [x1, y0 + h, cz]
    ];
    return this.poly(
      pts,
      [
        [0, 1, 2],
        [3, 5, 4],
        [1, 4, 5, 2],
        [0, 2, 5, 3],
        [0, 3, 4, 1]
      ],
      color,
      o
    );
  }
  // 寄棟屋根
  hip(cx, cz, y0, W, D, h, color, o = {}) {
    const r = Math.max(0.002, (W - D) / 2);
    const x0 = cx - W / 2,
      x1 = cx + W / 2,
      z0 = cz - D / 2,
      z1 = cz + D / 2,
      yt = y0 + h;
    const pts = [
      [x0, y0, z0],
      [x1, y0, z0],
      [x1, y0, z1],
      [x0, y0, z1],
      [cx - r, yt, cz],
      [cx + r, yt, cz]
    ];
    return this.poly(
      pts,
      [
        [0, 1, 2, 3],
        [3, 2, 5, 4],
        [0, 4, 5, 1],
        [0, 3, 4],
        [1, 5, 2]
      ],
      color,
      o
    );
  }
  frustum(cx, cz, y0, w0, d0, y1, w1, d1, color, o = {}) {
    const p = (w, d, y) => [
      [cx - w / 2, y, cz - d / 2],
      [cx + w / 2, y, cz - d / 2],
      [cx + w / 2, y, cz + d / 2],
      [cx - w / 2, y, cz + d / 2]
    ];
    const pts = [...p(w0, d0, y0), ...p(w1, d1, y1)];
    return this.poly(
      pts,
      [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7]
      ],
      color,
      o
    );
  }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.P, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(this.N, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(this.C, 3));
    g.setAttribute("aEmi", new THREE.Float32BufferAttribute(this.E, 3));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }
  get empty() {
    return this.P.length === 0;
  }
}

/* ---------- Materials ---------- */
function makeWorldMaterial(extra = {}) {
  const m = new THREE.MeshStandardMaterial(
    Object.assign(
      {
        vertexColors: true,
        flatShading: true,
        roughness: 0.82,
        metalness: 0.0
      },
      extra
    )
  );
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uNight = U.night;
    sh.vertexShader = sh.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute vec3 aEmi;\nvarying vec3 vEmi;"
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvEmi = aEmi;"
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float uNight;\nvarying vec3 vEmi;"
      )
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance += vEmi * uNight;"
      );
  };
  return m;
}
function addWaves(mat, amp, freq) {
  const f = (v) => v.toFixed(3);
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = U.time;
    sh.vertexShader =
      "uniform float uTime;\n" +
      sh.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
       vec4 wpW = modelMatrix * vec4(transformed, 1.0);
       transformed.y += (sin(wpW.x * ${f(
         freq
       )} + uTime * 1.3) * 0.6 + sin(wpW.z * ${f(
          freq * 1.37
        )} - uTime * 1.1) * 0.45 + sin((wpW.x + wpW.z) * ${f(
          freq * 2.3
        )} + uTime * 2.1) * 0.22) * ${f(amp)};`
      );
  };
}

const TEX_CACHE = {};
function glowTexture() {
  if (TEX_CACHE.glow) return TEX_CACHE.glow;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.25, "rgba(255,240,200,0.75)");
  gr.addColorStop(0.6, "rgba(255,210,140,0.18)");
  gr.addColorStop(1, "rgba(255,200,120,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return (TEX_CACHE.glow = new THREE.CanvasTexture(c));
}
function dotTexture() {
  if (TEX_CACHE.dot) return TEX_CACHE.dot;
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.5, "rgba(255,255,255,0.8)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 32, 32);
  return (TEX_CACHE.dot = new THREE.CanvasTexture(c));
}
// 看板テクスチャ（英語の看板）
const SIGN_MATS = {};
function signMaterial(text, bg, fg, opt = {}) {
  const key = text + bg + fg + (opt.icon || "");
  if (SIGN_MATS[key]) return SIGN_MATS[key];
  const c = document.createElement("canvas");
  const H = 96;
  const g0 = c.getContext("2d");
  g0.font = `900 64px "Nunito", "Arial Rounded MT Bold", "Helvetica Neue", Arial, sans-serif`;
  const tw = g0.measureText(text).width;
  const iconW = opt.icon ? 80 : 0;
  c.width = Math.ceil(tw + 60 + iconW);
  c.height = H;
  const g = c.getContext("2d");
  const r = 18;
  g.fillStyle = bg;
  g.beginPath();
  g.moveTo(r, 0);
  g.lineTo(c.width - r, 0);
  g.quadraticCurveTo(c.width, 0, c.width, r);
  g.lineTo(c.width, H - r);
  g.quadraticCurveTo(c.width, H, c.width - r, H);
  g.lineTo(r, H);
  g.quadraticCurveTo(0, H, 0, H - r);
  g.lineTo(0, r);
  g.quadraticCurveTo(0, 0, r, 0);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.35)";
  g.lineWidth = 5;
  g.stroke();
  if (opt.icon === "cup") {
    g.fillStyle = fg;
    g.fillRect(34, 34, 34, 34);
    g.beginPath();
    g.arc(70, 50, 10, -Math.PI / 2, Math.PI / 2);
    g.lineWidth = 6;
    g.strokeStyle = fg;
    g.stroke();
    g.fillRect(28, 70, 46, 6);
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(44, 28);
    g.quadraticCurveTo(38, 18, 46, 10);
    g.moveTo(56, 28);
    g.quadraticCurveTo(50, 18, 58, 10);
    g.stroke();
  } else if (opt.icon === "cross") {
    g.fillStyle = fg;
    g.fillRect(44, 22, 18, 52);
    g.fillRect(27, 39, 52, 18);
  }
  g.fillStyle = fg;
  g.font = `900 64px "Nunito", "Arial Rounded MT Bold", "Helvetica Neue", Arial, sans-serif`;
  g.textBaseline = "middle";
  g.fillText(text, 30 + iconW, H / 2 + 3);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  m.userData.aspect = c.width / H;
  return (SIGN_MATS[key] = m);
}
function makeSign(text, bg, fg, height, opt = {}) {
  const m = signMaterial(text, bg, fg, opt);
  const w = height * m.userData.aspect;
  const geo = new THREE.PlaneGeometry(w, height);
  const mesh = new THREE.Mesh(geo, m);
  mesh.userData.signW = w;
  return mesh;
}
function clockMaterial() {
  if (SIGN_MATS.__clock) return SIGN_MATS.__clock;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = "#1e3a8a";
  g.beginPath();
  g.arc(64, 64, 63, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fffbeb";
  g.beginPath();
  g.arc(64, 64, 56, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1f2937";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r1 = i % 3 === 0 ? 40 : 46;
    g.save();
    g.translate(64, 64);
    g.rotate(a);
    g.fillRect(-2.5, -52, 5, 52 - r1);
    g.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  return (SIGN_MATS.__clock = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true
  }));
}

/* ---------- Init ---------- */
function init3D() {
  _v = new THREE.Vector3();
  _v2 = new THREE.Vector3();
  _m4 = new THREE.Matrix4();
  _m4b = new THREE.Matrix4();
  _q = new THREE.Quaternion();
  _e = new THREE.Euler();
  _s = new THREE.Vector3();
  _c = new THREE.Color();
  _c2 = new THREE.Color();
  _n3 = new THREE.Matrix3();
  _obj = new THREE.Object3D();

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xa9d8f5, 60, 160);
  camera3 = new THREE.PerspectiveCamera(32, 1, 0.5, 700);
  raycaster = new THREE.Raycaster();
  plane0 = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  hemi = new THREE.HemisphereLight(0xdff1ff, 0x76884f, 0.66);
  scene.add(hemi);
  sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.castShadow = true;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 140;
  scene.add(sun);
  scene.add(sun.target);

  matWorld = makeWorldMaterial();
  matBlink = new THREE.MeshBasicMaterial({ color: 0xff2222 });
  matWater = new THREE.MeshStandardMaterial({
    color: 0x2a9bd6,
    transparent: true,
    opacity: 0.82,
    roughness: 0.15,
    metalness: 0.1,
    flatShading: true
  });
  addWaves(matWater, 0.012, 2.2);
  matSea = new THREE.MeshStandardMaterial({
    color: 0x1b88c4,
    transparent: true,
    opacity: 0.88,
    roughness: 0.22,
    metalness: 0.08,
    flatShading: true
  });
  addWaves(matSea, 0.07, 0.55);
  matGhostOk = new THREE.MeshStandardMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.62,
    emissive: 0x22c55e,
    emissiveIntensity: 0.35,
    flatShading: true,
    depthWrite: false
  });
  matGhostBad = new THREE.MeshStandardMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    emissive: 0xef4444,
    emissiveIntensity: 0.6,
    flatShading: true,
    depthWrite: false
  });
  matShadowOnly = new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: false
  });

  tileObjs = new Array(MAP_SIZE * MAP_SIZE).fill(null);
  buildEnvironment();
  buildOverlays();
  buildParticles();
  buildEntityMeshes();
  applyQuality();
  resize();
  applyCamera();
  ENGINE.ready = true;
}

function applyQuality() {
  if (!renderer) return;
  const hq = state.highQuality;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, hq ? 2 : 1));
  renderer.shadowMap.type = hq ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
  const size = hq ? 2048 : 1024;
  if (sun.shadow.mapSize.x !== size) {
    sun.shadow.mapSize.set(size, size);
    if (sun.shadow.map) {
      sun.shadow.map.dispose();
      sun.shadow.map = null;
    }
  }
  resize();
}

/* ---------- Environment (島・海・砂浜・飾り) ---------- */
function buildEnvironment() {
  // 海
  const seaGeo = new THREE.PlaneGeometry(420, 420, 140, 140);
  seaGeo.rotateX(-Math.PI / 2);
  const sea = new THREE.Mesh(seaGeo, matSea);
  sea.position.y = -0.5;
  sea.receiveShadow = true;
  sea.renderOrder = 1;
  scene.add(sea);
  ENGINE.sea = sea;
  // 海底
  const bedGeo = new THREE.PlaneGeometry(420, 420, 1, 1);
  bedGeo.rotateX(-Math.PI / 2);
  const bed = new THREE.Mesh(
    bedGeo,
    new THREE.MeshLambertMaterial({ color: 0x0e5a7e })
  );
  bed.position.y = -2.6;
  scene.add(bed);
  ENGINE.seabed = bed;

  // 砂浜と崖（島の土台）
  const G = new GeoBuilder();
  G.frustum(
    0,
    0,
    -0.29,
    HALF * 2 + 8,
    HALF * 2 + 8,
    -2.4,
    HALF * 2 + 16,
    HALF * 2 + 16,
    0xf2dca4,
    { ao: false }
  );
  const S = HALF * 2;
  const cliff = 0x9a6b3f,
    lip = 0x5fae46;
  G.box(S + 0.06, 0.29, 0.03, 0, -0.29, HALF + 0.015, cliff, { ao: false });
  G.box(S + 0.06, 0.29, 0.03, 0, -0.29, -HALF - 0.015, cliff, { ao: false });
  G.box(0.03, 0.29, S, HALF + 0.015, -0.29, 0, cliff, { ao: false });
  G.box(0.03, 0.29, S, -HALF - 0.015, -0.29, 0, cliff, { ao: false });
  // 崖の地層ライン
  for (const yy of [-0.2, -0.12]) {
    const col = yy < -0.15 ? 0x7c5232 : 0x8a5d37;
    G.box(S + 0.08, 0.035, 0.035, 0, yy, HALF + 0.02, col, { ao: false });
    G.box(S + 0.08, 0.035, 0.035, 0, yy, -HALF - 0.02, col, { ao: false });
    G.box(0.035, 0.035, S + 0.08, HALF + 0.02, yy, 0, col, { ao: false });
    G.box(0.035, 0.035, S + 0.08, -HALF - 0.02, yy, 0, col, { ao: false });
  }
  ENGINE.lipColor = lip;
  const rnd = mulberry32(42);
  // 岩
  for (let i = 0; i < 26; i++) {
    const side = Math.floor(rnd() * 4),
      t = (rnd() - 0.5) * (S + 6),
      off = HALF + 0.8 + rnd() * 3.2;
    const px = side === 0 ? t : side === 1 ? t : side === 2 ? off : -off;
    const pz = side === 0 ? off : side === 1 ? -off : t;
    const r = 0.18 + rnd() * 0.35;
    G.sphere(
      r,
      0,
      px,
      -0.29 + r * 0.35,
      pz,
      rnd() < 0.5 ? 0x9ca3af : 0x78716c,
      { sy: 0.65, ry: rnd() * 3, ao: false }
    );
  }
  // ヤシの木
  const palms = [
    [HALF + 1.6, HALF - 3],
    [HALF + 2.4, -6],
    [-6, HALF + 2.2],
    [6, HALF + 1.5],
    [-HALF - 2, 5],
    [3, -HALF - 2.5],
    [HALF + 1.4, 9]
  ];
  palms.forEach(([px, pz], i) => {
    const lean = (rnd() - 0.5) * 0.5;
    let x = px,
      y = -0.3,
      z = pz;
    for (let k = 0; k < 5; k++) {
      G.cyl(0.07, 0.09, 0.32, 6, x, y, z, k % 2 ? 0x8b6a43 : 0x9f7c50, {
        ao: false
      });
      x += lean * 0.12;
      y += 0.3;
    }
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + i;
      G.boxC(
        0.16,
        0.03,
        0.9,
        x + Math.sin(a) * 0.38,
        y - 0.12,
        z + Math.cos(a) * 0.38,
        k % 2 ? 0x16a34a : 0x22c55e,
        { ry: a, rx: 0.5, ao: false }
      );
    }
    G.sphere(0.07, 0, x + 0.06, y - 0.08, z, 0x7c4a1e, { ao: false });
  });
  // 桟橋
  const pz = 3.5;
  for (let k = 0; k < 7; k++) {
    G.box(
      0.7,
      0.06,
      1.0,
      HALF + 3 + k * 1.0,
      -0.22,
      pz,
      k % 2 ? 0xa16207 : 0xb7791f,
      { ao: false }
    );
    G.cyl(0.06, 0.06, 1.3, 6, HALF + 3 + k, -1.4, pz + 0.38, 0x6b4423, {
      ao: false
    });
    G.cyl(0.06, 0.06, 1.3, 6, HALF + 3 + k, -1.4, pz - 0.38, 0x6b4423, {
      ao: false
    });
  }
  // 灯台
  const lx = -HALF - 2.6,
    lz = -HALF - 2.6;
  G.cyl(1.0, 1.15, 0.4, 10, lx, -0.32, lz, 0x9ca3af, { ao: false });
  for (let k = 0; k < 6; k++) {
    const rb = 0.7 - k * 0.07,
      rt = rb - 0.07;
    G.cyl(
      rt,
      rb,
      0.55,
      12,
      lx,
      0.08 + k * 0.55,
      lz,
      k % 2 ? 0xdc2626 : 0xf8fafc,
      { ao: false }
    );
  }
  const topY = 0.08 + 6 * 0.55;
  G.cyl(0.52, 0.52, 0.06, 12, lx, topY, lz, 0x1f2937, { ao: false });
  G.cyl(0.3, 0.3, 0.42, 10, lx, topY + 0.06, lz, 0xfef9c3, {
    emi: [1.8, 1.6, 0.9],
    ao: false
  });
  G.cone(0.4, 0.38, 10, lx, topY + 0.48, lz, 0xb91c1c, { ao: false });
  G.sphere(0.06, 0, lx, topY + 0.9, lz, 0xfbbf24, { ao: false });
  const env = new THREE.Mesh(G.build(), matWorld);
  env.castShadow = true;
  env.receiveShadow = true;
  scene.add(env);
  ENGINE.env = env;
  lighthouseLamp = new THREE.Vector3(lx, topY + 0.27, lz);
  // 灯台の光線
  const BL = 13;
  const beamGeo = new THREE.CylinderGeometry(0.05, 1.3, BL, 12, 4, true);
  beamGeo.translate(0, BL / 2, 0);
  beamGeo.rotateZ(-Math.PI / 2);
  const bp = beamGeo.attributes.position,
    bcol = [];
  for (let i = 0; i < bp.count; i++) {
    const k = Math.pow(1 - clamp(bp.getX(i) / BL, 0, 1), 1.6);
    bcol.push(k, k, k);
  }
  beamGeo.setAttribute("color", new THREE.Float32BufferAttribute(bcol, 3));
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfff3c4,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: false
  });
  beamMesh = new THREE.Group();
  const b1 = new THREE.Mesh(beamGeo, beamMat),
    b2 = new THREE.Mesh(beamGeo, beamMat);
  b2.rotation.y = Math.PI;
  beamMesh.add(b1, b2);
  beamMesh.position.copy(lighthouseLamp);
  beamMesh.userData.mat = beamMat;
  scene.add(beamMesh);

  // 停泊中のボート
  const B = new GeoBuilder();
  boatParts(B, 0, 0, 0, 0xffffff, 0x2563eb);
  const moored = new THREE.Mesh(B.build(), matWorld);
  moored.position.set(HALF + 6.5, -0.45, pz + 1.25);
  moored.rotation.y = Math.PI / 2;
  moored.castShadow = true;
  scene.add(moored);
  ENGINE.moored = moored;
  // 帆船（島の周りを回る）
  const SB = new GeoBuilder();
  boatParts(SB, 0, 0, 0, 0xf8fafc, 0x0ea5e9, true);
  sailboat = new THREE.Mesh(SB.build(), matWorld);
  sailboat.castShadow = true;
  scene.add(sailboat);

  // 遠くの島々
  const H = new GeoBuilder();
  const hr = mulberry32(7);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + hr() * 0.4;
    const r = 95 + hr() * 50;
    const s = 8 + hr() * 14;
    H.sphere(
      s,
      1,
      Math.cos(a) * r,
      -s * 0.55,
      Math.sin(a) * r,
      hr() < 0.5 ? 0x4d7c4a : 0x5b8a55,
      { sy: 0.55 + hr() * 0.3, ao: false }
    );
    H.sphere(
      s * 0.6,
      1,
      Math.cos(a) * r + s * 0.5,
      -s * 0.3,
      Math.sin(a) * r + s * 0.3,
      0x6b9a5e,
      { sy: 0.6, ao: false }
    );
  }
  const hills = new THREE.Mesh(H.build(), matWorld);
  scene.add(hills);

  // 雲
  const cr = mulberry32(99);
  const cloudMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.92
  });
  ENGINE.cloudMat = cloudMat;
  for (let i = 0; i < 12; i++) {
    const C = new GeoBuilder();
    const n = 3 + Math.floor(cr() * 4);
    for (let k = 0; k < n; k++)
      C.sphere(
        1.2 + cr() * 1.4,
        1,
        (k - n / 2) * 1.5 + cr(),
        cr() * 0.6,
        (cr() - 0.5) * 1.6,
        0xffffff,
        { sy: 0.7, ao: false }
      );
    const m = new THREE.Mesh(C.build(), cloudMat);
    m.userData = {
      a: cr() * Math.PI * 2,
      r: 42 + cr() * 40,
      y: 7 + cr() * 6,
      sp: 0.004 + cr() * 0.006
    };
    m.scale.setScalar(0.9 + cr() * 0.9);
    scene.add(m);
    clouds.push(m);
  }
}

function boatParts(G, x, z, ry, hull, accent, sail) {
  const o = { ao: false };
  // 船体（台形）
  G.frustum(x, z, -0.1, 0.42, 1.3, 0.3, 0.8, 1.9, hull, o);
  G.box(0.84, 0.06, 1.94, x, 0.3, z, accent, o);
  G.boxC(0.3, 0.08, 0.05, x, 0.2, z + 0.97, accent, o);
  if (sail) {
    G.cyl(0.035, 0.04, 2.4, 6, x, 0.3, z, 0x7c4a1e, o);
    const tri = (z0, z1, top, col) =>
      G.poly(
        [
          [x - 0.012, 0.55, z0],
          [x - 0.012, top, z0],
          [x - 0.012, 0.55, z1],
          [x + 0.012, 0.55, z0],
          [x + 0.012, top, z0],
          [x + 0.012, 0.55, z1]
        ],
        [
          [0, 1, 2],
          [3, 5, 4],
          [0, 3, 4, 1],
          [1, 4, 5, 2],
          [0, 2, 5, 3]
        ],
        col,
        o
      );
    tri(z - 0.06, z - 1.0, 2.6, 0xffffff);
    tri(z + 0.06, z + 0.85, 2.2, 0xfde68a);
  } else {
    G.box(0.5, 0.3, 0.6, x, 0.36, z - 0.2, 0xf8fafc, o);
    G.box(0.52, 0.12, 0.4, x, 0.48, z - 0.18, 0x7dd3fc, o);
    G.box(0.56, 0.04, 0.68, x, 0.66, z - 0.2, accent, o);
  }
}

/* ---------- Overlays: ハイライト・グリッド・ゴースト ---------- */
function buildOverlays() {
  const hlGeo = new THREE.PlaneGeometry(0.96, 0.96);
  hlGeo.rotateX(-Math.PI / 2);
  highlight = new THREE.Mesh(
    hlGeo,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    })
  );
  highlight.position.y = 0.075;
  highlight.renderOrder = 5;
  highlight.visible = false;
  scene.add(highlight);
  const eg = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.98, 0.001, 0.98));
  highlightEdge = new THREE.LineSegments(
    eg,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    })
  );
  highlightEdge.position.y = 0.08;
  highlightEdge.visible = false;
  scene.add(highlightEdge);

  lineMarks = new THREE.InstancedMesh(
    hlGeo,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    }),
    64
  );
  lineMarks.count = 0;
  lineMarks.frustumCulled = false;
  lineMarks.renderOrder = 5;
  scene.add(lineMarks);

  const pts = [];
  for (let i = 0; i <= MAP_SIZE; i++) {
    pts.push(-HALF, 0.012, i - HALF, HALF, 0.012, i - HALF);
    pts.push(i - HALF, 0.012, -HALF, i - HALF, 0.012, HALF);
  }
  const gg = new THREE.BufferGeometry();
  gg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  gridLines = new THREE.LineSegments(
    gg,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    })
  );
  gridLines.visible = false;
  scene.add(gridLines);

  const dbGeo = new THREE.BoxGeometry(1, 1, 1);
  demoBox = new THREE.Mesh(
    dbGeo,
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    })
  );
  demoBox.visible = false;
  scene.add(demoBox);
}

/* ---------- Particles ---------- */
function makePoints(count, size, color, opts = {}) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(new Float32Array(count * 3), 3)
  );
  if (opts.colors)
    geo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(new Float32Array(count * 3), 3)
    );
  const mat = new THREE.PointsMaterial({
    size,
    color,
    map: opts.map || dotTexture(),
    transparent: true,
    depthWrite: false,
    vertexColors: !!opts.colors,
    blending: opts.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    opacity: opts.opacity ?? 1,
    fog: opts.fog !== false
  });
  const p = new THREE.Points(geo, mat);
  p.frustumCulled = false;
  p.userData.data = [];
  scene.add(p);
  return p;
}
function buildParticles() {
  // 雨
  const RN = 900;
  const rg = new THREE.BufferGeometry();
  rg.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(new Float32Array(RN * 6), 3)
  );
  rainLines = new THREE.LineSegments(
    rg,
    new THREE.LineBasicMaterial({
      color: 0xc7d7ea,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    })
  );
  rainLines.frustumCulled = false;
  rainLines.visible = false;
  rainLines.userData.drops = Array.from({ length: RN }, () => ({
    x: (Math.random() - 0.5) * 50,
    y: Math.random() * 22,
    z: (Math.random() - 0.5) * 50,
    s: 0.55 + Math.random() * 0.3
  }));
  scene.add(rainLines);
  // 雪
  snowPts = makePoints(900, 0.13, 0xffffff, {});
  snowPts.userData.data = Array.from({ length: 900 }, () => ({
    x: (Math.random() - 0.5) * 50,
    y: Math.random() * 20,
    z: (Math.random() - 0.5) * 50,
    p: Math.random() * 6
  }));
  snowPts.visible = false;
  // 季節の舞うもの（花びら・落ち葉・ホタル）
  seasonPts = makePoints(160, 0.16, 0xffffff, { colors: true });
  seasonPts.userData.data = Array.from({ length: 160 }, () => ({
    x: (Math.random() - 0.5) * 30,
    y: Math.random() * 5,
    z: (Math.random() - 0.5) * 30,
    p: Math.random() * 6
  }));
  // 噴水の水しぶき
  fountainPts = makePoints(700, 0.07, 0xd7f2ff, { opacity: 0.9 });
  fountainPts.userData.data = [];
  // 街灯の光
  lampPoints = makePoints(1, 1.25, 0xffd58a, {
    map: glowTexture(),
    additive: true,
    opacity: 0,
    fog: false
  });
  headPoints = makePoints(400, 0.55, 0xfff3c4, {
    map: glowTexture(),
    additive: true,
    opacity: 0,
    fog: false
  });
  // 地面の光だまり
  const poolGeo = new THREE.PlaneGeometry(1.5, 1.5);
  poolGeo.rotateX(-Math.PI / 2);
  lampPools = new THREE.InstancedMesh(
    poolGeo,
    new THREE.MeshBasicMaterial({
      map: glowTexture(),
      color: 0xffcf7a,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }),
    800
  );
  lampPools.count = 0;
  lampPools.frustumCulled = false;
  lampPools.renderOrder = 3;
  scene.add(lampPools);
  // 建設時の砂ぼこり・キラキラ
  const DG = new GeoBuilder();
  DG.sphere(1, 0, 0, 0, 0, 0xffffff, { ao: false });
  dustMesh = new THREE.InstancedMesh(
    DG.build(),
    makeWorldMaterial({ roughness: 1 }),
    400
  );
  dustMesh.count = 0;
  dustMesh.frustumCulled = false;
  dustMesh.userData.parts = [];
  dustMesh.instanceColor = new THREE.InstancedBufferAttribute(
    new Float32Array(400 * 3),
    3
  );
  scene.add(dustMesh);
  // 税収コイン
  const CG = new GeoBuilder();
  CG.cyl(1, 1, 0.22, 14, 0, -0.11, 0, 0xfbbf24, {
    rx: Math.PI / 2,
    ao: false,
    emi: [0.25, 0.18, 0]
  });
  CG.cyl(0.7, 0.7, 0.24, 14, 0, -0.12, 0, 0xfde68a, {
    rx: Math.PI / 2,
    ao: false,
    emi: [0.3, 0.25, 0.05]
  });
  coinMesh = new THREE.InstancedMesh(
    CG.build(),
    makeWorldMaterial({ metalness: 0.5, roughness: 0.35 }),
    300
  );
  coinMesh.count = 0;
  coinMesh.frustumCulled = false;
  coinMesh.userData.parts = [];
  scene.add(coinMesh);
}

function spawnDust(gx, gy, count = 18, kind = "build") {
  if (!state.showParticles || !dustMesh) return;
  const wx = tileW(gx),
    wz = tileW(gy);
  const parts = dustMesh.userData.parts;
  for (let i = 0; i < count && parts.length < 400; i++) {
    const a = Math.random() * Math.PI * 2,
      sp = 0.6 + Math.random() * 1.4;
    const sparkle = kind === "build" && i % 3 === 0;
    parts.push({
      x: wx + Math.cos(a) * 0.3,
      y: 0.1 + Math.random() * 0.2,
      z: wz + Math.sin(a) * 0.3,
      vx: Math.cos(a) * sp,
      vy: sparkle ? 2.5 + Math.random() * 2 : 0.8 + Math.random() * 1.2,
      vz: Math.sin(a) * sp,
      life: 1,
      decay: 0.9 + Math.random() * 0.8,
      s: sparkle ? 0.045 : 0.06 + Math.random() * 0.07,
      col: sparkle
        ? [1, 0.85, 0.3]
        : kind === "demolish"
        ? [0.55, 0.5, 0.45]
        : [0.88, 0.84, 0.76],
      g: sparkle ? 4 : 1.2
    });
  }
}
function spawnCoinBurst(gx, gy, n = 4) {
  if (!coinMesh) return;
  const parts = coinMesh.userData.parts;
  const wx = tileW(gx),
    wz = tileW(gy);
  for (let i = 0; i < n && parts.length < 300; i++) {
    parts.push({
      x: wx + (Math.random() - 0.5) * 0.4,
      y: 0.9 + Math.random() * 0.3,
      z: wz + (Math.random() - 0.5) * 0.4,
      vy: 2.2 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.8,
      vz: (Math.random() - 0.5) * 0.8,
      rot: Math.random() * 6,
      life: 1,
      delay: i * 0.12
    });
  }
}

/* ---------- 地面（季節で色が変わる芝生） ---------- */
const SEASON_GROUND = [
  [0x7fc95a, 0x76bf53],
  [0x63b346, 0x5aa93f],
  [0xb5bd55, 0xa8b24b],
  [0xf1f5f9, 0xe6edf4]
];
function buildGround() {
  if (groundMesh) {
    scene.remove(groundMesh);
    groundMesh.geometry.dispose();
  }
  const P = [],
    N = [],
    C = [],
    E = [];
  const [c1, c2] = SEASON_GROUND[state.seasonIdx];
  const ca = new THREE.Color(c1),
    cb = new THREE.Color(c2);
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (state.map[y][x] === "water") continue;
      const base = (x + y) % 2 ? ca : cb;
      const k = 0.95 + hashPos(x * 3 + 1, y * 7 + 2) * 0.08;
      const x0 = x - HALF,
        x1 = x0 + 1,
        z0 = y - HALF,
        z1 = z0 + 1;
      const quad = [
        [x0, z0],
        [x0, z1],
        [x1, z1],
        [x0, z0],
        [x1, z1],
        [x1, z0]
      ];
      for (const [qx, qz] of quad) {
        P.push(qx, 0, qz);
        N.push(0, 1, 0);
        C.push(base.r * k, base.g * k, base.b * k);
        E.push(0, 0, 0);
      }
    }
  }
  // 島のふち（芝のへり）
  const lip = new THREE.Color(
    state.seasonIdx === 3 ? 0xf8fafc : SEASON_GROUND[state.seasonIdx][1]
  ).multiplyScalar(0.9);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(C, 3));
  g.setAttribute("aEmi", new THREE.Float32BufferAttribute(E, 3));
  const L = new GeoBuilder();
  const S = HALF * 2;
  L.box(S + 0.1, 0.06, 0.08, 0, -0.04, HALF + 0.02, lip, { ao: false });
  L.box(S + 0.1, 0.06, 0.08, 0, -0.04, -HALF - 0.02, lip, { ao: false });
  L.box(0.08, 0.06, S + 0.1, HALF + 0.02, -0.04, 0, lip, { ao: false });
  L.box(0.08, 0.06, S + 0.1, -HALF - 0.02, -0.04, 0, lip, { ao: false });
  const lg = L.build();
  // 結合
  const merged = new THREE.BufferGeometry();
  for (const name of ["position", "normal", "color", "aEmi"]) {
    const a = g.attributes[name].array,
      b = lg.attributes[name].array;
    const arr = new Float32Array(a.length + b.length);
    arr.set(a, 0);
    arr.set(b, a.length);
    merged.setAttribute(name, new THREE.BufferAttribute(arr, 3));
  }
  merged.computeBoundingSphere();
  g.dispose();
  lg.dispose();
  groundMesh = new THREE.Mesh(merged, matWorld);
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);
}

// 空き地の草・野の花
let flowerMesh = null;
function buildTufts() {
  if (!tuftMesh) {
    const G = new GeoBuilder();
    G.cone(0.025, 0.12, 4, 0, 0, 0, 0xffffff, { rz: 0.25, ao: false });
    G.cone(0.025, 0.1, 4, 0.03, 0, 0.02, 0xffffff, { rz: -0.3, ao: false });
    G.cone(0.022, 0.09, 4, -0.02, 0, -0.03, 0xffffff, { rx: 0.3, ao: false });
    tuftMesh = new THREE.InstancedMesh(
      G.build(),
      matWorld,
      MAP_SIZE * MAP_SIZE * 3
    );
    tuftMesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(MAP_SIZE * MAP_SIZE * 3 * 3),
      3
    );
    tuftMesh.frustumCulled = false;
    tuftMesh.receiveShadow = true;
    scene.add(tuftMesh);
    const F = new GeoBuilder();
    F.sphere(0.03, 0, 0, 0.02, 0, 0x4d8a2f, { sy: 0.5, ao: false });
    F.sphere(0.016, 0, 0.012, 0.04, 0.008, 0xffffff, { ao: false });
    F.sphere(0.014, 0, -0.014, 0.036, -0.006, 0xffffff, { ao: false });
    flowerMesh = new THREE.InstancedMesh(
      F.build(),
      matWorld,
      MAP_SIZE * MAP_SIZE * 2
    );
    flowerMesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(MAP_SIZE * MAP_SIZE * 2 * 3),
      3
    );
    flowerMesh.frustumCulled = false;
    scene.add(flowerMesh);
  }
  const season = state.seasonIdx;
  const greens = [
    [0x5cb841, 0x4e9f35, 0x6cc24a],
    [0x3f9a2e, 0x358a27, 0x4caf3a],
    [0xa19a3c, 0x8f7f2c, 0x9aa83e],
    [0xdfe6ee, 0xd3dce6, 0xeef2f6]
  ][season];
  const fcols = [
    [0xf472b6, 0xfde047, 0xffffff, 0xc084fc],
    [0xfacc15, 0x60a5fa, 0xffffff, 0xf87171],
    [0xfb923c, 0xdc2626, 0xfde047],
    []
  ][season];
  let n = 0,
    f = 0;
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (state.map[y][x]) continue;
      const h = hashPos(x + 0.31, y + 0.77);
      const cnt = h < 0.55 ? 0 : h < 0.88 ? 1 : 2;
      for (let k = 0; k < cnt; k++) {
        const r1 = hashPos(x * 5 + k, y * 3 + k * 7),
          r2 = hashPos(x * 7 + k * 3, y * 11 + k);
        _obj.position.set(
          tileW(x) + (r1 - 0.5) * 0.8,
          0,
          tileW(y) + (r2 - 0.5) * 0.8
        );
        _obj.rotation.set(0, r1 * 6.28, 0);
        const sc = 0.55 + r2 * 0.45;
        _obj.scale.set(sc, sc * (season === 3 ? 0.5 : 1), sc);
        _obj.updateMatrix();
        tuftMesh.setMatrixAt(n, _obj.matrix);
        _c.set(greens[Math.floor(r1 * greens.length) % greens.length]);
        tuftMesh.setColorAt(n, _c);
        n++;
      }
      if (fcols.length && h > 0.9) {
        const r1 = hashPos(x * 13, y * 17),
          r2 = hashPos(x * 19, y * 5);
        for (let k = 0; k < 2; k++) {
          _obj.position.set(
            tileW(x) + (r1 - 0.5) * 0.7 + k * 0.12,
            0,
            tileW(y) + (r2 - 0.5) * 0.7 - k * 0.08
          );
          _obj.rotation.set(0, 0, 0);
          _obj.scale.setScalar(0.75 + r2 * 0.3);
          _obj.updateMatrix();
          flowerMesh.setMatrixAt(f, _obj.matrix);
          _c.set(fcols[(Math.floor(r1 * 10) + k) % fcols.length]);
          flowerMesh.setColorAt(f, _c);
          f++;
        }
      }
    }
  }
  tuftMesh.count = n;
  flowerMesh.count = f;
  tuftMesh.instanceMatrix.needsUpdate = true;
  tuftMesh.instanceColor.needsUpdate = true;
  flowerMesh.instanceMatrix.needsUpdate = true;
  flowerMesh.instanceColor.needsUpdate = true;
}

/* ---------- タイル（建物）管理 ---------- */
function typeSeed(t) {
  let h = 7;
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
  return h;
}
function mapAt(x, y) {
  return x >= 0 && y >= 0 && x < MAP_SIZE && y < MAP_SIZE
    ? state.map[y][x]
    : null;
}
function makeCtx(x, y, type, overrides) {
  const same = type === "water" ? "water" : "road";
  const t = mapAt;
  const ctx = {
    x,
    y,
    type,
    season: state.seasonIdx,
    rnd: mulberry32(
      ((x + 3) * 73856093) ^ ((y + 5) * 19349663) ^ typeSeed(type)
    ),
    n: t(x, y - 1) === same,
    s: t(x, y + 1) === same,
    e: t(x + 1, y) === same,
    w: t(x - 1, y) === same,
    ne: t(x + 1, y - 1) === same,
    nw: t(x - 1, y - 1) === same,
    se: t(x + 1, y + 1) === same,
    sw: t(x - 1, y + 1) === same,
    yaw: 0
  };
  // 建物は道路のある方向を向く
  const order = [
    ["s", 0, 1, 0],
    ["e", 1, 0, Math.PI / 2],
    ["n", 0, -1, Math.PI],
    ["w", -1, 0, -Math.PI / 2]
  ];
  let yaw = null;
  for (const [, dx, dy, a] of order)
    if (t(x + dx, y + dy) === "road") {
      yaw = a;
      break;
    }
  if (yaw === null) yaw = hashPos(x, y) < 0.5 ? 0 : Math.PI / 2;
  ctx.yaw = yaw;
  if (overrides) Object.assign(ctx, overrides);
  return ctx;
}

function createTileObject(x, y, type, ctxOverride) {
  const fn = BUILDERS[type];
  if (!fn) return null;
  const ctx = makeCtx(x, y, type, ctxOverride);
  const G = new GeoBuilder();
  const group = new THREE.Group();
  const out = { group, lamps: [], fountains: [], anims: [], ctx };
  fn(G, ctx, out);
  if (!G.empty) {
    const mesh = new THREE.Mesh(G.build(), matWorld);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    out.main = mesh;
  }
  if (!out.noYaw) group.rotation.y = ctx.yaw;
  return out;
}
function disposeGroup(g) {
  g.traverse((c) => {
    if ((c.isMesh || c.isLineSegments) && c.geometry && !c.userData.sharedGeo)
      c.geometry.dispose();
  });
}
function refreshTile(x, y, animate = false) {
  const i = y * MAP_SIZE + x;
  const old = tileObjs[i];
  if (old) {
    scene.remove(old.group);
    disposeGroup(old.group);
  }
  tileObjs[i] = null;
  const type = state.map[y][x];
  if (!type) return;
  const o = createTileObject(x, y, type);
  if (!o) return;
  o.group.position.set(tileW(x), 0, tileW(y));
  o.group.traverse((c) => (c.userData.tile = { x, y }));
  scene.add(o.group);
  o.group.updateMatrixWorld(true);
  o.lampsW = o.lamps.map((v) => v.clone().applyMatrix4(o.group.matrixWorld));
  o.fountainsW = o.fountains.map((v) =>
    v.clone().applyMatrix4(o.group.matrixWorld)
  );
  tileObjs[i] = o;
  if (animate) {
    o.group.scale.set(0.7, 0.02, 0.7);
    tweens.push({ g: o.group, t: 0, dur: 0.6 });
  }
}
function collectDynamic() {
  tileAnims = [];
  fountainList = [];
  const lamps = [];
  for (const o of tileObjs) {
    if (!o) continue;
    o.anims.forEach((a) => tileAnims.push(a));
    o.fountainsW.forEach((v) => fountainList.push(v));
    o.lampsW.forEach((v) => lamps.push(v));
  }
  // 街灯の光
  const arr = new Float32Array(Math.max(1, lamps.length) * 3);
  lamps.forEach((v, i) => {
    arr[i * 3] = v.x;
    arr[i * 3 + 1] = v.y;
    arr[i * 3 + 2] = v.z;
  });
  lampPoints.geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(arr, 3)
  );
  lampPoints.geometry.setDrawRange(0, lamps.length);
  const cnt = Math.min(lamps.length, 800);
  for (let i = 0; i < cnt; i++) {
    _obj.position.set(lamps[i].x, 0.066, lamps[i].z);
    _obj.rotation.set(0, 0, 0);
    _obj.scale.setScalar(1);
    _obj.updateMatrix();
    lampPools.setMatrixAt(i, _obj.matrix);
  }
  lampPools.count = cnt;
  lampPools.instanceMatrix.needsUpdate = true;
}
function onTileChanged(x, y, animate = false, groundToo = false) {
  refreshTile(x, y, animate);
  [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ].forEach(([dx, dy]) => {
    const nx = x + dx,
      ny = y + dy;
    if (
      nx >= 0 &&
      ny >= 0 &&
      nx < MAP_SIZE &&
      ny < MAP_SIZE &&
      state.map[ny][nx]
    )
      refreshTile(nx, ny, false);
  });
  if (groundToo) buildGround();
  buildTufts();
  collectDynamic();
}
function rebuildWorld() {
  if (!ENGINE.ready) return;
  for (let y = 0; y < MAP_SIZE; y++)
    for (let x = 0; x < MAP_SIZE; x++) refreshTile(x, y, false);
  buildGround();
  buildTufts();
  collectDynamic();
  ghostKey = "";
}

/* ---------- 住人・車（インスタンス描画） ---------- */
function carParts(G, x, z, ry, col) {
  const cs = Math.cos(ry),
    sn = Math.sin(ry);
  const P = (lx, lz) => [x + lx * cs + lz * sn, z - lx * sn + lz * cs];
  let p;
  const o = (extra) => Object.assign({ ry, ao: false }, extra || {});
  p = P(0, 0);
  G.box(0.2, 0.075, 0.42, p[0], 0.032, p[1], col, o());
  p = P(0, -0.03);
  G.box(0.176, 0.072, 0.22, p[0], 0.107, p[1], 0x1f2d3d, o());
  p = P(0, -0.03);
  G.box(0.18, 0.016, 0.2, p[0], 0.178, p[1], col, o());
  p = P(0, 0.17);
  G.box(0.19, 0.012, 0.08, p[0], 0.107, p[1], col, o());
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      p = P(sx * 0.098, sz * 0.135);
      G.cyl(
        0.043,
        0.043,
        0.032,
        8,
        p[0],
        0.043 - 0.016,
        p[1],
        0x111827,
        o({ rz: Math.PI / 2 })
      );
    }
  for (const sx of [-1, 1]) {
    p = P(sx * 0.062, 0.211);
    G.box(
      0.045,
      0.022,
      0.012,
      p[0],
      0.052,
      p[1],
      0xfffbe6,
      o({ emi: [1.6, 1.5, 1.1] })
    );
    p = P(sx * 0.07, -0.211);
    G.box(
      0.04,
      0.022,
      0.012,
      p[0],
      0.052,
      p[1],
      0xdc2626,
      o({ emi: [1.3, 0.12, 0.08] })
    );
  }
}
function buildEntityMeshes() {
  const MAXP = 800,
    MAXC = 300;
  const mk = (G, max) => {
    const m = new THREE.InstancedMesh(G.build(), matWorld, max);
    m.count = 0;
    m.frustumCulled = false;
    m.castShadow = true;
    m.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(max * 3),
      3
    );
    scene.add(m);
    return m;
  };
  let G = new GeoBuilder();
  G.box(0.1, 0.12, 0.068, 0, 0.088, 0, 0xffffff, { ao: false });
  G.box(0.026, 0.1, 0.034, 0.064, 0.098, 0, 0xffffff, { ao: false, rz: 0.08 });
  G.box(0.026, 0.1, 0.034, -0.064, 0.098, 0, 0xffffff, {
    ao: false,
    rz: -0.08
  });
  personParts.body = mk(G, MAXP);
  G = new GeoBuilder();
  G.sphere(0.054, 1, 0, 0.262, 0, 0xffffff, { ao: false });
  personParts.head = mk(G, MAXP);
  G = new GeoBuilder();
  G.sphere(0.058, 1, 0, 0.28, -0.01, 0xffffff, { sy: 0.72, ao: false });
  personParts.hair = mk(G, MAXP);
  G = new GeoBuilder();
  G.box(0.036, 0.09, 0.04, 0, -0.09, 0, 0x334155, { ao: false });
  personParts.leg = mk(G, MAXP * 2);
  G = new GeoBuilder();
  G.cone(0.16, 0.07, 8, 0, 0.35, 0, 0xffffff, { ao: false });
  G.cyl(0.006, 0.006, 0.16, 4, 0, 0.2, 0, 0x777777, { ao: false });
  personParts.umb = mk(G, MAXP);
  G = new GeoBuilder();
  carParts(G, 0, 0, 0, 0xffffff);
  carMesh = mk(G, MAXC);
}
function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}
const _legM = [];
function updateEntityVisuals(dt, t) {
  let pi = 0,
    ci = 0,
    li = 0,
    ui = 0,
    hi = 0;
  const raining = state.weather === "Rain";
  const night = envState.night;
  const hp = headPoints.geometry.attributes.position.array;
  const k = Math.min(1, dt * 9);
  for (const ent of entities) {
    const moving =
      ent.state === "GOING_WORK" ||
      ent.state === "GOING_HOME" ||
      ent.state === "WANDERING";
    if (!moving) {
      ent._vis = false;
      ent._px = undefined;
      continue;
    }
    if (ent._px === undefined) {
      ent._px = ent.x;
      ent._py = ent.y;
      ent.hx = ent.hx || 0;
      ent.hz = ent.hz || 1;
    }
    const dx = ent.x - ent._px,
      dy = ent.y - ent._py;
    const dl = Math.hypot(dx, dy);
    ent._px = ent.x;
    ent._py = ent.y;
    if (dl > 1e-4) {
      ent.hx = dx / dl;
      ent.hz = dy / dl;
      ent.walk = (ent.walk || 0) + dl * 38;
    }
    const isCar = ent.type === "car";
    const off = isCar ? 0.17 : 0.36;
    const tx = ent.x - HALF + ent.hz * off,
      tz = ent.y - HALF - ent.hx * off;
    if (!ent._vis) {
      ent.rx = tx;
      ent.rz = tz;
      ent.yaw = Math.atan2(ent.hx, ent.hz);
    }
    ent._vis = true;
    ent.rx += (tx - ent.rx) * k;
    ent.rz += (tz - ent.rz) * k;
    ent.yaw = lerpAngle(
      ent.yaw,
      Math.atan2(ent.hx, ent.hz),
      Math.min(1, dt * 10)
    );
    const onRoad = state.map[Math.floor(ent.y)]?.[Math.floor(ent.x)] === "road";
    if (isCar) {
      if (ci >= carMesh.instanceMatrix.count) continue;
      _obj.position.set(ent.rx, 0.03, ent.rz);
      _obj.rotation.set(0, ent.yaw, 0);
      _obj.scale.setScalar(1);
      _obj.updateMatrix();
      carMesh.setMatrixAt(ci, _obj.matrix);
      _c.set(ent.carCol || 0xef4444);
      carMesh.setColorAt(ci, _c);
      ci++;
      if (night > 0.05 && hi < 400) {
        hp[hi * 3] = ent.rx + Math.sin(ent.yaw) * 0.3;
        hp[hi * 3 + 1] = 0.08;
        hp[hi * 3 + 2] = ent.rz + Math.cos(ent.yaw) * 0.3;
        hi++;
      }
    } else {
      if (pi >= personParts.body.instanceMatrix.count) continue;
      const bob = Math.abs(Math.sin(ent.walk || 0)) * 0.018;
      const baseY = (onRoad ? 0.055 : 0.02) + bob;
      _obj.position.set(ent.rx, baseY, ent.rz);
      _obj.rotation.set(0, ent.yaw, 0);
      _obj.scale.setScalar(1.15);
      _obj.updateMatrix();
      const M = _obj.matrix;
      personParts.body.setMatrixAt(pi, M);
      personParts.head.setMatrixAt(pi, M);
      personParts.hair.setMatrixAt(pi, M);
      _c.set(ent.c || "#f472b6");
      personParts.body.setColorAt(pi, _c);
      _c.set(ent.skin || 0xffe0bd);
      personParts.head.setColorAt(pi, _c);
      _c.set(ent.hair || 0x2b1b10);
      personParts.hair.setColorAt(pi, _c);
      const sw = Math.sin(ent.walk || 0) * 0.6;
      for (const side of [-1, 1]) {
        _m4b.makeRotationX(sw * side);
        _m4b.setPosition(side * 0.024, 0.03, 0);
        _m4.multiplyMatrices(M, _m4b);
        personParts.leg.setMatrixAt(li, _m4);
        _c.set(0xffffff);
        personParts.leg.setColorAt(li, _c);
        li++;
      }
      if (raining) {
        personParts.umb.setMatrixAt(ui, M);
        _c.set(ent.umb || 0x3b82f6);
        personParts.umb.setColorAt(ui, _c);
        ui++;
      }
      pi++;
    }
  }
  const finish = (m, n) => {
    m.count = n;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  };
  finish(personParts.body, pi);
  finish(personParts.head, pi);
  finish(personParts.hair, pi);
  finish(personParts.leg, li);
  finish(personParts.umb, ui);
  finish(carMesh, ci);
  headPoints.geometry.attributes.position.needsUpdate = true;
  headPoints.geometry.setDrawRange(0, hi);
  headPoints.material.opacity = night * 0.9;
}

/* ---------- 昼夜・天候のライティング ---------- */
// [時刻, 太陽色, 太陽強さ, 空の色, 地面の照り返し, 環境光強さ, 霧/背景色, 海の色]
const SKY_KEYS = [
  [0, 0x9fb3ff, 0.32, 0x3a4a8c, 0x10153a, 0.6, 0x0f1a3a, 0x0b2a55],
  [4.6, 0x9fb3ff, 0.32, 0x3a4a8c, 0x10153a, 0.6, 0x0f1a3a, 0x0b2a55],
  [6.0, 0xffa071, 0.55, 0xf5b49a, 0x3b3f5c, 0.55, 0xe9a98f, 0x3d7fb0],
  [8.0, 0xfff1d6, 0.84, 0xd6ecff, 0x6b7f4a, 0.52, 0xbfe0f7, 0x1f8cc6],
  [12, 0xffffff, 0.94, 0xdff1ff, 0x76884f, 0.54, 0xa9d8f5, 0x1b88c4],
  [16, 0xfff0d0, 0.88, 0xd8e8ff, 0x6f7a4a, 0.52, 0xb8d6ee, 0x1d86bd],
  [17.6, 0xff9c5c, 0.78, 0xffc49a, 0x5a4a5c, 0.5, 0xf0a47c, 0x3a86b8],
  [19.0, 0xa48cff, 0.4, 0x5b4f9a, 0x1a1636, 0.54, 0x3a3466, 0x163d70],
  [20.5, 0x9fb3ff, 0.32, 0x3a4a8c, 0x10153a, 0.6, 0x0f1a3a, 0x0b2a55],
  [24, 0x9fb3ff, 0.32, 0x3a4a8c, 0x10153a, 0.6, 0x0f1a3a, 0x0b2a55]
];
const _ca = [],
  _cb = [];
function updateLighting() {
  const h = (state.gameTime / 60) % 24;
  let i = 0;
  while (i < SKY_KEYS.length - 2 && SKY_KEYS[i + 1][0] <= h) i++;
  const A = SKY_KEYS[i],
    B = SKY_KEYS[i + 1];
  const t = smooth((h - A[0]) / (B[0] - A[0] || 1));
  const col = (idx, out) => out.set(A[idx]).lerp(_c2.set(B[idx]), t);
  const weather = state.weather;
  const bad = weather === "Rain" || weather === "Snow";
  const cloudy = weather === "Cloudy";
  const wk = bad ? 0.55 : cloudy ? 0.3 : 0;
  const gray = new THREE.Color(0x9aa6b6);

  col(1, sun.color);
  let sunI = lerp(A[2], B[2], t) * (bad ? 0.42 : cloudy ? 0.68 : 1);
  col(3, hemi.color).lerp(gray, wk);
  col(4, hemi.groundColor);
  hemi.intensity = lerp(A[5], B[5], t) + (bad ? 0.12 : 0);
  const fogC = col(6, new THREE.Color());
  const dayness = clamp((sunI - 0.3) / 0.6, 0, 1);
  fogC.lerp(
    new THREE.Color(0x8d99a8).multiplyScalar(0.35 + dayness * 0.65),
    wk
  );
  scene.fog.color.copy(fogC);
  renderer.setClearColor(fogC);
  col(7, matSea.color).lerp(
    new THREE.Color(0x4f6f86).multiplyScalar(0.4 + dayness * 0.6),
    wk * 0.8
  );
  ENGINE.seabed.material.color.copy(matSea.color).multiplyScalar(0.55);
  sun.intensity = sunI;

  // 太陽（月）の位置
  let phi, elev;
  if (h >= 5.6 && h <= 18.4) {
    const a = clamp((h - 6) / 12, -0.05, 1.05) * Math.PI;
    elev = 0.2 + Math.sin(clamp(a, 0, Math.PI)) * 0.92;
    phi = -Math.PI / 4 + (a - Math.PI / 2) * 0.9;
  } else {
    elev = 0.95;
    phi = -0.6;
  }
  _v.set(
    Math.sin(phi) * Math.cos(elev),
    Math.sin(elev),
    Math.cos(phi) * Math.cos(elev)
  );
  const S = clamp(CAM.dist * 0.62, 9, 26);
  const texel = (2 * S) / sun.shadow.mapSize.x;
  const tx = Math.round(CAM.x / texel) * texel,
    tz = Math.round(CAM.z / texel) * texel;
  sun.target.position.set(tx, 0, tz);
  sun.position.set(tx + _v.x * 60, _v.y * 60, tz + _v.z * 60);
  const sc = sun.shadow.camera;
  if (Math.abs(sc.right - S) > 0.01) {
    sc.left = -S;
    sc.right = S;
    sc.top = S;
    sc.bottom = -S;
    sc.updateProjectionMatrix();
  }

  // 夜の明かり
  let nf;
  if (h >= 17.4) nf = smooth((h - 17.4) / 1.9);
  else if (h < 5) nf = 1;
  else nf = 1 - smooth((h - 4.8) / 1.8);
  envState.timeNight = nf;
  if (bad) nf = Math.max(nf, 0.4);
  else if (cloudy) nf = Math.max(nf, 0.12);
  envState.night = nf;
  U.night.value = nf;
  lampPoints.material.opacity = nf * 0.95;
  lampPools.material.opacity = nf * 0.55;
  beamMesh.userData.mat.opacity = envState.timeNight * 0.16;
  beamMesh.visible = envState.timeNight > 0.05;
  // 雲の色
  ENGINE.cloudMat.color
    .set(0xffffff)
    .lerp(new THREE.Color(0x7b8696), bad ? 0.7 : cloudy ? 0.35 : 0)
    .multiplyScalar(0.55 + dayness * 0.45);
}

function updateEnvironmentMotion(dt, t) {
  const bad =
    state.weather === "Rain" ||
    state.weather === "Snow" ||
    state.weather === "Cloudy";
  clouds.forEach((c, i) => {
    const u = c.userData;
    u.a += u.sp * dt * 3;
    c.position.set(Math.cos(u.a) * u.r, u.y, Math.sin(u.a) * u.r);
    c.visible = bad || i % 2 === 0;
  });
  const a = t * 0.025;
  sailboat.position.set(
    Math.cos(a) * 27,
    -0.45 + Math.sin(t * 1.3) * 0.04,
    Math.sin(a) * 27
  );
  sailboat.rotation.set(Math.sin(t * 1.1) * 0.04, -a, Math.sin(t * 0.9) * 0.05);
  ENGINE.moored.position.y = -0.45 + Math.sin(t * 1.2) * 0.03;
  ENGINE.moored.rotation.z = Math.sin(t * 0.8) * 0.03;
  beamMesh.rotation.y = t * 0.7;
}

/* ---------- 天候・季節のパーティクル ---------- */
function updateWeatherFx(dt) {
  const showRain = state.showParticles && state.weather === "Rain";
  const showSnow = state.showParticles && state.weather === "Snow";
  const cx = CAM.x,
    cz = CAM.z,
    R = clamp(CAM.dist * 0.75, 12, 30);
  rainLines.visible = showRain;
  if (showRain) {
    const arr = rainLines.geometry.attributes.position.array;
    const drops = rainLines.userData.drops;
    const sp = state.timeSpeed === 0 ? 0.25 : 1;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.y -= 26 * dt * d.s * sp;
      d.x += 2 * dt * sp;
      if (d.y < 0 || Math.abs(d.x - cx) > R || Math.abs(d.z - cz) > R) {
        d.y = 10 + Math.random() * 12;
        d.x = cx + (Math.random() - 0.5) * 2 * R;
        d.z = cz + (Math.random() - 0.5) * 2 * R;
      }
      const j = i * 6;
      arr[j] = d.x;
      arr[j + 1] = d.y;
      arr[j + 2] = d.z;
      arr[j + 3] = d.x - 0.08;
      arr[j + 4] = d.y + 0.55;
      arr[j + 5] = d.z;
    }
    rainLines.geometry.attributes.position.needsUpdate = true;
  }
  snowPts.visible = showSnow;
  if (showSnow) {
    const arr = snowPts.geometry.attributes.position.array;
    const data = snowPts.userData.data;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      d.p += dt;
      d.y -= 1.3 * dt;
      d.x += Math.sin(d.p * 1.3) * 0.4 * dt;
      if (d.y < 0 || Math.abs(d.x - cx) > R || Math.abs(d.z - cz) > R) {
        d.y = 6 + Math.random() * 12;
        d.x = cx + (Math.random() - 0.5) * 2 * R;
        d.z = cz + (Math.random() - 0.5) * 2 * R;
      }
      arr[i * 3] = d.x;
      arr[i * 3 + 1] = d.y;
      arr[i * 3 + 2] = d.z;
    }
    snowPts.geometry.attributes.position.needsUpdate = true;
  }
}
function updateSeasonFx(dt, t) {
  const s = state.seasonIdx;
  const night = envState.night;
  let mode = null;
  if (state.showParticles) {
    if (s === 0 && night < 0.6 && state.weather !== "Rain") mode = "petal";
    else if (s === 2 && night < 0.6 && state.weather !== "Rain") mode = "leaf";
    else if (s === 1 && night > 0.6 && state.weather === "Clear")
      mode = "firefly";
  }
  seasonPts.visible = !!mode;
  if (!mode) return;
  const arr = seasonPts.geometry.attributes.position.array;
  const col = seasonPts.geometry.attributes.color.array;
  const data = seasonPts.userData.data;
  const cx = CAM.x,
    cz = CAM.z,
    R = clamp(CAM.dist * 0.6, 8, 20);
  seasonPts.material.blending =
    mode === "firefly" ? THREE.AdditiveBlending : THREE.NormalBlending;
  seasonPts.material.size = mode === "firefly" ? 0.22 : 0.15;
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    d.p += dt;
    if (mode === "firefly") {
      d.x += Math.sin(d.p * 0.7 + i) * 0.5 * dt;
      d.z += Math.cos(d.p * 0.6 + i * 2) * 0.5 * dt;
      d.y = 0.25 + Math.sin(d.p * 0.9 + i) * 0.2 + (i % 5) * 0.12;
    } else {
      d.y -= 0.45 * dt;
      d.x += (0.5 + Math.sin(d.p * 1.7 + i) * 0.6) * dt;
      d.z += Math.cos(d.p * 1.3 + i) * 0.3 * dt;
    }
    if (d.y < 0 || Math.abs(d.x - cx) > R || Math.abs(d.z - cz) > R) {
      d.x = cx + (Math.random() - 0.5) * 2 * R;
      d.z = cz + (Math.random() - 0.5) * 2 * R;
      d.y = mode === "firefly" ? 0.3 : 2 + Math.random() * 4;
    }
    arr[i * 3] = d.x;
    arr[i * 3 + 1] = d.y;
    arr[i * 3 + 2] = d.z;
    if (mode === "petal") {
      col[i * 3] = 1;
      col[i * 3 + 1] = 0.72 + (i % 3) * 0.06;
      col[i * 3 + 2] = 0.84;
    } else if (mode === "leaf") {
      const k = i % 3;
      col[i * 3] = 0.95;
      col[i * 3 + 1] = [0.45, 0.3, 0.75][k];
      col[i * 3 + 2] = 0.1;
    } else {
      const b = 0.5 + 0.5 * Math.sin(d.p * 3 + i);
      col[i * 3] = 0.8 * b;
      col[i * 3 + 1] = 1 * b;
      col[i * 3 + 2] = 0.35 * b;
    }
  }
  seasonPts.geometry.attributes.position.needsUpdate = true;
  seasonPts.geometry.attributes.color.needsUpdate = true;
}
function updateFountains(dt) {
  const data = fountainPts.userData.data;
  if (state.showParticles) {
    for (const f of fountainList) {
      for (let k = 0; k < 2 && data.length < 700; k++) {
        const a = Math.random() * Math.PI * 2,
          r = 0.25 + Math.random() * 0.35;
        data.push({
          x: f.x,
          y: f.y,
          z: f.z,
          vx: Math.cos(a) * r,
          vy: 1.3 + Math.random() * 0.5,
          vz: Math.sin(a) * r,
          life: 1
        });
      }
    }
  }
  const arr = fountainPts.geometry.attributes.position.array;
  let n = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    const d = data[i];
    d.vy -= 4.2 * dt;
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    d.z += d.vz * dt;
    if (d.y < 0.12) {
      data.splice(i, 1);
      continue;
    }
    arr[n * 3] = d.x;
    arr[n * 3 + 1] = d.y;
    arr[n * 3 + 2] = d.z;
    n++;
  }
  fountainPts.geometry.attributes.position.needsUpdate = true;
  fountainPts.geometry.setDrawRange(0, n);
}
function updateFx3D(dt) {
  // 砂ぼこり・キラキラ
  const parts = dustMesh.userData.parts;
  let n = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life -= p.decay * dt;
    if (p.life <= 0) {
      parts.splice(i, 1);
      continue;
    }
    p.vy -= p.g * dt;
    p.x += p.vx * dt;
    p.y = Math.max(0.03, p.y + p.vy * dt);
    p.z += p.vz * dt;
    p.vx *= 0.96;
    p.vz *= 0.96;
    _obj.position.set(p.x, p.y, p.z);
    _obj.rotation.set(p.life * 4, p.life * 3, 0);
    _obj.scale.setScalar(p.s * (0.4 + p.life * 0.8));
    _obj.updateMatrix();
    dustMesh.setMatrixAt(n, _obj.matrix);
    _c.setRGB(p.col[0], p.col[1], p.col[2]);
    dustMesh.setColorAt(n, _c);
    n++;
  }
  dustMesh.count = n;
  dustMesh.instanceMatrix.needsUpdate = true;
  dustMesh.instanceColor.needsUpdate = true;
  // コイン
  const cp = coinMesh.userData.parts;
  n = 0;
  for (let i = cp.length - 1; i >= 0; i--) {
    const p = cp[i];
    if (p.delay > 0) {
      p.delay -= dt;
      continue;
    }
    p.life -= dt * 0.8;
    if (p.life <= 0) {
      cp.splice(i, 1);
      continue;
    }
    p.vy -= 3.2 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;
    p.rot += dt * 9;
    _obj.position.set(p.x, p.y, p.z);
    _obj.rotation.set(0, p.rot, 0);
    _obj.scale.setScalar(0.09 * Math.min(1, p.life * 3));
    _obj.updateMatrix();
    coinMesh.setMatrixAt(n++, _obj.matrix);
  }
  coinMesh.count = n;
  coinMesh.instanceMatrix.needsUpdate = true;
}
function updateTweens(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i];
    tw.t += dt;
    const x = clamp(tw.t / tw.dur, 0, 1);
    // easeOutBack 風のバウンド
    const c1 = 1.9,
      c3 = c1 + 1;
    const e = 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    const ex = lerp(0.7, 1, Math.min(1, x * 1.6));
    tw.g.scale.set(ex, Math.max(0.02, e), ex);
    if (x >= 1) {
      tw.g.scale.set(1, 1, 1);
      tweens.splice(i, 1);
    }
  }
}

/* ---------- 配置プレビュー（ゴースト）・ハイライト ---------- */
let lineState = null;
function canPlace(id, x, y) {
  const item = BUILDINGS[id];
  if (!item || state.mayorLevel < item.reqLevel) return false;
  const cur = state.map[y]?.[x];
  if (cur === id) return false;
  if (cur && !["road", "water", "grass"].includes(cur)) return false;
  return state.coins >= item.cost;
}
function lineTiles(a, b) {
  const tiles = [];
  if (!a || !b) return tiles;
  if (Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)) {
    const st = Math.sign(b.x - a.x) || 1;
    for (let x = a.x; x !== b.x + st; x += st) tiles.push({ x, y: a.y });
  } else {
    const st = Math.sign(b.y - a.y) || 1;
    for (let y = a.y; y !== b.y + st; y += st) tiles.push({ x: a.x, y });
  }
  return tiles.slice(0, 64);
}
function updateLinePreview() {
  if (!lineState || !selectedBuild) {
    lineMarks.count = 0;
    return;
  }
  const tiles = lineTiles(lineState.start, lineState.end || lineState.start);
  const item = BUILDINGS[selectedBuild];
  let budget = state.coins,
    n = 0,
    cnt = 0;
  for (const t of tiles) {
    const cur = state.map[t.y][t.x];
    let ok =
      cur !== selectedBuild &&
      (!cur || ["road", "water", "grass"].includes(cur));
    if (ok) {
      if (budget >= item.cost) {
        budget -= item.cost;
        cnt++;
      } else ok = false;
    }
    _obj.position.set(tileW(t.x), 0.085, tileW(t.y));
    _obj.rotation.set(0, 0, 0);
    _obj.scale.setScalar(1);
    _obj.updateMatrix();
    lineMarks.setMatrixAt(n, _obj.matrix);
    _c.set(ok ? 0x34d399 : cur === selectedBuild ? 0x94a3b8 : 0xef4444);
    lineMarks.setColorAt(n, _c);
    n++;
  }
  lineMarks.count = n;
  lineMarks.instanceMatrix.needsUpdate = true;
  if (lineMarks.instanceColor) lineMarks.instanceColor.needsUpdate = true;
  updateBuildHint(
    `${item.icon} ${item.name} × ${cnt}  =  ${
      cnt * item.cost
    }G（指を離すと建設）`
  );
}
function onBuildToolChanged() {
  ghostKey = "";
  lineState = null;
  if (lineMarks) lineMarks.count = 0;
  if (canvas)
    canvas.classList.toggle("tool-active", !!(selectedBuild || isDemolish));
  const info = document.getElementById("info-panel");
  if (info && (selectedBuild || isDemolish)) info.style.display = "none";
}
function updateHoverVisuals(t) {
  const tool = selectedBuild || isDemolish;
  // グリッド線（建築モード中のみ）
  const ga = tool ? 0.22 : 0;
  gridLines.material.opacity += (ga - gridLines.material.opacity) * 0.15;
  gridLines.visible = gridLines.material.opacity > 0.01;

  const ht = hoverTile;
  let showHL = !!ht && !lineState;
  demoBox.visible = false;
  if (showHL) {
    highlight.position.x = highlightEdge.position.x = tileW(ht.x);
    highlight.position.z = highlightEdge.position.z = tileW(ht.y);
    let color = 0xffffff,
      op = 0.18;
    if (selectedBuild) {
      const ok = canPlace(selectedBuild, ht.x, ht.y);
      color = ok ? 0x34d399 : 0xef4444;
      op = 0.35;
    } else if (isDemolish) {
      color = 0xef4444;
      op = 0.35;
      const o = tileObjs[ht.y * MAP_SIZE + ht.x];
      if (o) {
        const box = new THREE.Box3().setFromObject(o.group);
        box.getSize(_v);
        box.getCenter(_v2);
        demoBox.scale.set(_v.x + 0.06, _v.y + 0.06, _v.z + 0.06);
        demoBox.position.copy(_v2);
        demoBox.material.opacity = 0.18 + Math.sin(t * 8) * 0.06;
        demoBox.visible = true;
      }
    }
    highlight.material.color.set(color);
    highlight.material.opacity = op + Math.sin(t * 5) * 0.06;
    highlightEdge.material.color.set(color);
  }
  highlight.visible = highlightEdge.visible =
    showHL && (!!tool || ENGINE.pointerType === "mouse");

  // ゴースト（配置プレビュー）
  if (selectedBuild && ht && !lineState) {
    const ok = canPlace(selectedBuild, ht.x, ht.y);
    const key =
      selectedBuild +
      "@" +
      ht.x +
      "," +
      ht.y +
      ":" +
      ok +
      ":" +
      state.seasonIdx;
    if (key !== ghostKey) {
      if (ghost) {
        scene.remove(ghost);
        disposeGroup(ghost);
        ghost = null;
      }
      ghostKey = key;
      const o = createTileObject(ht.x, ht.y, selectedBuild);
      if (o) {
        ghost = o.group;
        ghost.traverse((c) => {
          if (c.isMesh) {
            c.material =
              c === o.main ? (ok ? matGhostOk : matGhostBad) : c.material;
            c.castShadow = false;
            c.renderOrder = 6;
          }
        });
        ghost.position.set(tileW(ht.x), 0, tileW(ht.y));
        scene.add(ghost);
      }
    }
    if (ghost) {
      ghost.visible = true;
      ghost.position.y = 0.03 + Math.abs(Math.sin(t * 3)) * 0.05;
    }
  } else if (ghost) {
    ghost.visible = false;
  }
}

/* ---------- カメラ ---------- */
function applyCamera() {
  const dist = BASE_DIST / CAM.zoom;
  CAM.dist = dist;
  const tt = clamp(
    (Math.log(CAM.zoom) - Math.log(ZMIN)) / (Math.log(ZMAX) - Math.log(ZMIN)),
    0,
    1
  );
  const elev = lerp(60, 31, tt) * DEG;
  const hd = Math.cos(elev) * dist;
  camera3.position.set(
    CAM.x + Math.sin(CAM.az) * hd,
    Math.sin(elev) * dist,
    CAM.z + Math.cos(CAM.az) * hd
  );
  camera3.lookAt(CAM.x, 0, CAM.z);
  camera3.updateMatrixWorld();
  scene.fog.near = dist * 1.05 + 6;
  scene.fog.far = dist * 2.6 + 70;
}
function clampCam() {
  const L = HALF + 3;
  CAM.tx = clamp(CAM.tx, -L, L);
  CAM.tz = clamp(CAM.tz, -L, L);
}
function updateCamera(dt) {
  const k = 1 - Math.pow(0.0005, dt);
  if (!ENGINE.dragging) {
    CAM.tx += CAM.vx;
    CAM.tz += CAM.vz;
    const damp = Math.pow(0.006, dt);
    CAM.vx *= damp;
    CAM.vz *= damp;
    if (Math.abs(CAM.vx) < 1e-4) CAM.vx = 0;
    if (Math.abs(CAM.vz) < 1e-4) CAM.vz = 0;
  }
  // キーボード移動
  if (ENGINE.keys) {
    const K = ENGINE.keys,
      sp = (dt * 14) / Math.sqrt(CAM.zoom);
    let fx = 0,
      fz = 0;
    if (K.ArrowUp || K.w) fz -= 1;
    if (K.ArrowDown || K.s) fz += 1;
    if (K.ArrowLeft || K.a) fx -= 1;
    if (K.ArrowRight || K.d) fx += 1;
    if (fx || fz) {
      const cs = Math.cos(CAM.az),
        sn = Math.sin(CAM.az);
      CAM.tx += (fx * cs + fz * sn) * sp;
      CAM.tz += (-fx * sn + fz * cs) * sp;
    }
  }
  clampCam();
  CAM.x += (CAM.tx - CAM.x) * k;
  CAM.z += (CAM.tz - CAM.z) * k;
  CAM.zoom += (CAM.tzoom - CAM.zoom) * k;
  CAM.az += (CAM.taz - CAM.az) * Math.min(1, k * 0.9);
  applyCamera();
}
function zoomCamera(f) {
  CAM.tzoom = clamp(CAM.tzoom * f, ZMIN, ZMAX);
}
function rotateCamera() {
  CAM.taz += Math.PI / 2;
  showToast("🔄 視点回転");
}

/* ---------- 入力（マウス・タッチ・ペン共通） ---------- */
let _ndc = null;
function groundPointAt(cx, cy) {
  const r = canvas.getBoundingClientRect();
  if (!_ndc) _ndc = new THREE.Vector2();
  _ndc.set(
    ((cx - r.left) / r.width) * 2 - 1,
    -((cy - r.top) / r.height) * 2 + 1
  );
  raycaster.setFromCamera(_ndc, camera3);
  const p = new THREE.Vector3();
  return raycaster.ray.intersectPlane(plane0, p);
}
function tileFromClient(cx, cy) {
  const p = groundPointAt(cx, cy);
  if (!p) return null;
  const x = Math.floor(p.x + HALF),
    y = Math.floor(p.z + HALF);
  if (x < 0 || y < 0 || x >= MAP_SIZE || y >= MAP_SIZE) return null;
  return { x, y };
}
function pickBuildingTile(cx, cy) {
  groundPointAt(cx, cy);
  const meshes = [];
  for (const o of tileObjs)
    if (o && o.main && !["road", "water"].includes(o.ctx.type))
      meshes.push(o.main);
  const hit = raycaster.intersectObjects(meshes, false)[0];
  return hit ? hit.object.userData.tile : null;
}
const ptrs = new Map();
let gesture = null;
function bindCanvasEvents() {
  canvas.addEventListener("pointerdown", onPtrDown);
  canvas.addEventListener("pointermove", onPtrMove);
  canvas.addEventListener("pointerup", onPtrUp);
  canvas.addEventListener("pointercancel", onPtrCancel);
  canvas.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse" && !gesture) {
      hoverTile = null;
      hideInfo();
    }
  });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      zoomCamera(e.deltaY > 0 ? 0.88 : 1.14);
    },
    { passive: false }
  );
  window.addEventListener("keyup", (e) => {
    if (ENGINE.keys)
      ENGINE.keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = false;
  });
  window.addEventListener("blur", () => (ENGINE.keys = {}));
}
function onKeyDown(e) {
  if (!ENGINE.ready || !isGameStarted) return;
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "TEXTAREA" || (tag === "INPUT" && e.target.type !== "checkbox"))
    return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  ENGINE.keys = ENGINE.keys || {};
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "w",
      "a",
      "s",
      "d"
    ].includes(k)
  ) {
    ENGINE.keys[k] = true;
    e.preventDefault();
  } else if (k === "Escape") {
    cancelBuildMode();
    closeModal();
  } else if (k === "q") CAM.taz -= Math.PI / 2;
  else if (k === "e") CAM.taz += Math.PI / 2;
  else if (k === "+" || k === "=") zoomCamera(1.2);
  else if (k === "-") zoomCamera(0.83);
}
function onPtrDown(e) {
  if (!ENGINE.ready) return;
  ENGINE.pointerType = e.pointerType;
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch (err) {}
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  CAM.vx = CAM.vz = 0;
  if (e.pointerType === "mouse" && (e.button === 2 || e.button === 1)) {
    gesture = {
      type: "rotate",
      lastX: e.clientX,
      sx: e.clientX,
      sy: e.clientY,
      button: e.button
    };
    return;
  }
  if (ptrs.size === 1) {
    const tile = tileFromClient(e.clientX, e.clientY);
    const line = !!(
      selectedBuild &&
      LINE_BUILD[selectedBuild] &&
      tile &&
      isGameStarted
    );
    gesture = {
      type: "pending",
      sx: e.clientX,
      sy: e.clientY,
      line,
      startTile: tile,
      grab: groundPointAt(e.clientX, e.clientY)
    };
    if (e.pointerType !== "mouse") hoverTile = tile;
  } else if (ptrs.size === 2) {
    lineState = null;
    lineMarks.count = 0;
    updateBuildHint();
    const [a, b] = [...ptrs.values()];
    const mx = (a.x + b.x) / 2,
      my = (a.y + b.y) / 2;
    gesture = {
      type: "pinch",
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      grab: groundPointAt(mx, my)
    };
    ENGINE.dragging = true;
  }
}
function onPtrMove(e) {
  if (!ENGINE.ready) return;
  ENGINE.pointerType = e.pointerType;
  if (ptrs.has(e.pointerId))
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (!gesture) {
    if (e.pointerType === "mouse") ENGINE.hoverReq = [e.clientX, e.clientY];
    return;
  }
  if (gesture.type === "rotate") {
    CAM.taz -= (e.clientX - gesture.lastX) * 0.008;
    CAM.az = CAM.taz;
    gesture.lastX = e.clientX;
    return;
  }
  if (gesture.type === "pinch") {
    if (ptrs.size < 2) return;
    const [a, b] = [...ptrs.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (gesture.dist > 0) {
      CAM.tzoom = clamp(CAM.tzoom * (d / gesture.dist), ZMIN, ZMAX);
      CAM.zoom = CAM.tzoom;
    }
    gesture.dist = d;
    applyCamera();
    const p = groundPointAt((a.x + b.x) / 2, (a.y + b.y) / 2);
    if (p && gesture.grab) {
      CAM.tx += gesture.grab.x - p.x;
      CAM.tz += gesture.grab.z - p.z;
      clampCam();
      CAM.x = CAM.tx;
      CAM.z = CAM.tz;
      applyCamera();
    }
    return;
  }
  if (gesture.type === "dead") return;
  const moved = Math.hypot(e.clientX - gesture.sx, e.clientY - gesture.sy);
  if (
    gesture.type === "pending" &&
    moved > (e.pointerType === "mouse" ? 5 : 10)
  ) {
    gesture.type = gesture.line ? "line" : "pan";
    if (gesture.type === "line")
      lineState = { start: gesture.startTile, end: gesture.startTile };
    ENGINE.dragging = gesture.type === "pan";
    hideInfo();
  }
  if (gesture.type === "pan") {
    const p = groundPointAt(e.clientX, e.clientY);
    if (p && gesture.grab) {
      const dx = gesture.grab.x - p.x,
        dz = gesture.grab.z - p.z;
      CAM.tx += dx;
      CAM.tz += dz;
      clampCam();
      CAM.x = CAM.tx;
      CAM.z = CAM.tz;
      applyCamera();
      CAM.vx = clamp(dx, -0.6, 0.6) * 0.8;
      CAM.vz = clamp(dz, -0.6, 0.6) * 0.8;
      gesture.lastMove = performance.now();
    }
  } else if (gesture.type === "line") {
    const t = tileFromClient(e.clientX, e.clientY);
    if (t) {
      lineState.end = t;
      hoverTile = t;
    }
    updateLinePreview();
  }
}
function onPtrUp(e) {
  ptrs.delete(e.pointerId);
  if (!gesture) return;
  const g = gesture;
  if (g.type === "pinch" || g.type === "dead") {
    gesture = ptrs.size > 0 ? { type: "dead" } : null;
    if (!gesture) ENGINE.dragging = false;
    return;
  }
  gesture = null;
  ENGINE.dragging = false;
  if (g.type === "rotate") {
    if (Math.hypot(e.clientX - g.sx, e.clientY - g.sy) < 5 && g.button === 2)
      cancelBuildMode();
    return;
  }
  if (g.type === "pending") {
    const tile = tileFromClient(e.clientX, e.clientY);
    hoverTile = tile;
    if (isGameStarted) handleGridClick(tile, e.clientX, e.clientY);
  } else if (g.type === "line") {
    const ls = lineState;
    lineState = null;
    lineMarks.count = 0;
    if (ls) commitLine(ls.start, ls.end || ls.start);
    updateBuildHint();
  } else if (g.type === "pan") {
    if (performance.now() - (g.lastMove || 0) > 80) {
      CAM.vx = 0;
      CAM.vz = 0;
    }
  }
}
function onPtrCancel(e) {
  ptrs.delete(e.pointerId);
  if (ptrs.size === 0) {
    gesture = null;
    ENGINE.dragging = false;
    lineState = null;
    if (lineMarks) lineMarks.count = 0;
  }
}
function updateHover(cx, cy) {
  let t = null;
  if (!selectedBuild && !isDemolish) t = pickBuildingTile(cx, cy);
  if (!t) t = tileFromClient(cx, cy);
  hoverTile = t;
  if (!t || selectedBuild || isDemolish || !isGameStarted) {
    hideInfo();
    return;
  }
  showTileInfo(t.x, t.y, false);
}
let infoTimer = null;
function showTileInfo(x, y, autoHide) {
  const info = document.getElementById("info-panel");
  const id = state.map[y]?.[x];
  if (!info) return;
  if (!id || !BUILDINGS[id]) {
    hideInfo();
    return;
  }
  const b = BUILDINGS[id];
  document.getElementById(
    "info-title"
  ).innerText = `${b.icon} ${b.name}  (${b.en})`;
  document.getElementById("info-desc").innerText = b.desc;
  document.getElementById("info-req").style.display = "none";
  info.style.display = "block";
  if (infoTimer) clearTimeout(infoTimer);
  if (autoHide) infoTimer = setTimeout(hideInfo, 2500);
}
function hideInfo() {
  const info = document.getElementById("info-panel");
  if (info) info.style.display = "none";
}

/* ---------- 建設・取壊し ---------- */
function placeBuilding(id, gx, gy, single) {
  const item = BUILDINGS[id];
  if (state.mayorLevel < item.reqLevel) {
    if (single) showToast("⚠️ レベルが足りません");
    return "level";
  }
  const cur = state.map[gy][gx];
  if (cur === id) return "same";
  if (cur && !["road", "water", "grass"].includes(cur)) {
    if (single)
      showToast("⚠️ ここには建てられません（取壊しモードで撤去できます）");
    return "blocked";
  }
  if (state.coins < item.cost) {
    if (single) showToast("⚠️ 資金が足りません。クイズでコインを稼ごう！");
    return "money";
  }
  const wasWater = cur === "water";
  state.coins -= item.cost;
  state.map[gy][gx] = id;
  state.builtCount++;
  return wasWater || id === "water" ? "ok-water" : "ok";
}
function handleGridClick(tile) {
  if (!tile) return;
  const { x: gx, y: gy } = tile;
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
    const cur = state.map[gy] && state.map[gy][gx];
    if (cur) {
      const cost = BUILDINGS[cur]?.cost || 0;
      state.map[gy][gx] = null;
      state.coins += Math.floor(cost * 0.5);
      playSE("demolish");
      spawnDust(gx, gy, 26, "demolish");
      onTileChanged(gx, gy, false, cur === "water");
      saveGame();
      spawnResidents();
      updateUI();
      ghostKey = "";
    }
    return;
  }
  if (!selectedBuild) {
    showTileInfo(gx, gy, true);
    return;
  }
  const item = BUILDINGS[selectedBuild];
  const r = placeBuilding(selectedBuild, gx, gy, true);
  if (r === "ok" || r === "ok-water") {
    addExp(Math.max(5, Math.floor(item.cost / 10)));
    checkAchievements();
    playSE("build");
    spawnDust(gx, gy, 20, "build");
    onTileChanged(gx, gy, true, r === "ok-water");
    updateUI();
    spawnResidents();
    saveGame();
    ghostKey = "";
  }
}
function commitLine(a, b) {
  if (!selectedBuild) return;
  const id = selectedBuild,
    item = BUILDINGS[id];
  const tiles = lineTiles(a, b);
  const changed = [];
  let exp = 0,
    water = false,
    noMoney = false;
  for (const t of tiles) {
    const r = placeBuilding(id, t.x, t.y, tiles.length === 1);
    if (r === "ok" || r === "ok-water") {
      changed.push(t);
      exp += Math.max(5, Math.floor(item.cost / 10));
      if (r === "ok-water") water = true;
    } else if (r === "money") {
      noMoney = true;
      break;
    }
  }
  if (noMoney && tiles.length > 1)
    showToast("⚠️ 資金が足りなくなったので途中まで建設しました");
  if (!changed.length) return;
  const set = new Set();
  changed.forEach((t) => {
    set.add(t.x + "," + t.y);
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ].forEach(([dx, dy]) => set.add(t.x + dx + "," + (t.y + dy)));
  });
  const changedKeys = new Set(changed.map((t) => t.x + "," + t.y));
  set.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    if (x < 0 || y < 0 || x >= MAP_SIZE || y >= MAP_SIZE) return;
    refreshTile(x, y, changedKeys.has(k));
  });
  changed.forEach((t, i) =>
    setTimeout(() => spawnDust(t.x, t.y, 8, "build"), i * 25)
  );
  if (water) buildGround();
  buildTufts();
  collectDynamic();
  addExp(exp);
  checkAchievements();
  playSE("build");
  updateUI();
  spawnResidents();
  saveGame();
  ghostKey = "";
  if (changed.length > 1)
    showToast(`🔨 ${item.name} × ${changed.length} を建設しました`);
}

/* ---------- 投影 ---------- */
function projectToScreen(x, y, z) {
  _v.set(x, y, z).project(camera3);
  if (_v.z > 1 || _v.z < -1) return null;
  return {
    x: ((_v.x + 1) / 2) * canvas.clientWidth,
    y: ((1 - _v.y) / 2) * canvas.clientHeight
  };
}

/* ---------- 建築メニューのサムネイル（3Dで描画） ---------- */
function renderBuildThumbnails() {
  const SZ = 160;
  const c = document.createElement("canvas");
  c.width = c.height = SZ;
  const r = new THREE.WebGLRenderer({
    canvas: c,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  r.setPixelRatio(1);
  r.setSize(SZ, SZ, false);
  r.setClearColor(0x000000, 0);
  const sc = new THREE.Scene();
  sc.add(new THREE.HemisphereLight(0xeef6ff, 0x6b7f4a, 0.75));
  const dl = new THREE.DirectionalLight(0xffffff, 0.95);
  dl.position.set(-4, 8, 5);
  sc.add(dl);
  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const saveNight = U.night.value;
  U.night.value = 0;
  const baseG = new GeoBuilder();
  baseG.box(1.04, 0.1, 1.04, 0, -0.1, 0, 0x7bc957, { ao: false });
  baseG.box(1.04, 0.14, 1.04, 0, -0.24, 0, 0x9a6b3f, { ao: false });
  const base = new THREE.Mesh(baseG.build(), matWorld);
  sc.add(base);
  for (const id of Object.keys(BUILDINGS)) {
    const over = {
      n: true,
      s: true,
      e: false,
      w: false,
      ne: false,
      nw: false,
      se: false,
      sw: false,
      yaw: 0,
      season:
        id === "tree" || id === "grass"
          ? Math.min(state.seasonIdx, 1)
          : state.seasonIdx
    };
    if (id === "tree") over.rnd = mulberry32(12345);
    const o = createTileObject(-50, -50, id, over);
    if (!o) continue;
    base.position.y = id === "water" ? -0.31 : 0;
    sc.add(o.group);
    const box = new THREE.Box3()
      .setFromObject(o.group)
      .union(
        new THREE.Box3(
          new THREE.Vector3(-0.5, -0.1, -0.5),
          new THREE.Vector3(0.5, 0, 0.5)
        )
      );
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const rad = Math.max(size.x, size.z) * 0.62 + size.y * 0.42;
    const dist = (rad / Math.sin((28 / 2) * DEG)) * 0.86;
    const el = 32 * DEG,
      az = Math.PI / 4;
    cam.position.set(
      center.x + Math.sin(az) * Math.cos(el) * dist,
      center.y + Math.sin(el) * dist,
      center.z + Math.cos(az) * Math.cos(el) * dist
    );
    cam.lookAt(center);
    r.render(sc, cam);
    try {
      BUILD_THUMBS[id] = c.toDataURL("image/png");
    } catch (err) {}
    sc.remove(o.group);
    disposeGroup(o.group);
  }
  U.night.value = saveNight;
  r.dispose();
  try {
    r.forceContextLoss();
  } catch (err) {}
}

/* ---------- メインループ ---------- */
let lastT = 0,
  acc = 0;
function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - lastT) / 1000;
  lastT = now;
  const rawDt = dt;
  if (!(dt > 0)) dt = 1 / 60;
  if (dt > 0.1) dt = 0.1;
  frameCount++;
  autoQualityCheck(rawDt);
  if (ENGINE.hoverReq && !gesture) {
    updateHover(ENGINE.hoverReq[0], ENGINE.hoverReq[1]);
    ENGINE.hoverReq = null;
  }
  if (isGameStarted) {
    acc += dt;
    let n = 0;
    while (acc >= 1 / 60 && n < 4) {
      simTick();
      acc -= 1 / 60;
      n++;
    }
    if (n >= 4) acc = 0;
  } else {
    // タイトル画面：街を画面の上半分に映しながらゆっくり回る
    CAM.taz += dt * 0.07;
    CAM.tx = 0.5 + Math.sin(CAM.az) * 3.2;
    CAM.tz = 0.5 + Math.cos(CAM.az) * 3.2;
  }
  try {
    updateCamera(dt);
    const t = now / 1000;
    U.time.value = t;
    updateLighting();
    updateEnvironmentMotion(dt, t);
    for (const a of tileAnims) a(t, dt);
    updateTweens(dt);
    updateFountains(dt);
    updateWeatherFx(dt);
    updateSeasonFx(dt, t);
    updateEntityVisuals(dt, t);
    updateFx3D(dt);
    updateHoverVisuals(t);
    renderer.render(scene, camera3);
  } catch (e) {
    console.error(e);
  }
  updateFx2D();
  if (frameCount % 3 === 0) updateStateIcons();
}
// 重い端末では自動で高画質モードをOFFにする（1回だけ）
function autoQualityCheck(rawDt) {
  if (!isGameStarted || ENGINE.autoQ || !state.highQuality || document.hidden)
    return;
  if (!(rawDt > 0) || rawDt > 0.5) return;
  ENGINE.fpsT = (ENGINE.fpsT || 0) + rawDt;
  ENGINE.fpsN = (ENGINE.fpsN || 0) + 1;
  if (ENGINE.fpsT < 5) return;
  const fps = ENGINE.fpsN / ENGINE.fpsT;
  ENGINE.fpsT = 0;
  ENGINE.fpsN = 0;
  ENGINE.fpsChecks = (ENGINE.fpsChecks || 0) + 1;
  if (fps < 24) {
    state.highQuality = false;
    applyQuality();
    const el = document.getElementById("chk-hq");
    if (el) el.checked = false;
    showToast(
      "⚙️ 動作を軽くするため高画質モードをOFFにしました（設定で戻せます）"
    );
    saveGame();
    ENGINE.autoQ = true;
  } else if (ENGINE.fpsChecks >= 3) ENGINE.autoQ = true;
}

function simTick() {
  timeFrame++;
  const prevDay = state.day,
    prevSeason = state.seasonIdx;
  state.gameTime += 0.25 * state.timeSpeed;
  if (state.gameTime >= 24 * 60) {
    state.gameTime -= 24 * 60;
    state.day++;
    if (state.day % 30 === 0) {
      state.seasonIdx = (state.seasonIdx + 1) % 4;
      showToast(
        `${["🌸", "🌻", "🍁", "⛄"][state.seasonIdx]} 季節が ${
          SEASONS[state.seasonIdx]
        } に変わりました`
      );
    }
    changeWeather();
  }
  if (prevDay !== state.day) collectTaxes();
  if (prevSeason !== state.seasonIdx) rebuildWorld();
  if (timeFrame % 2 === 0) updateAI();
  if (timeFrame % 30 === 0) updateUI();
}

function resize() {
  const container = document.getElementById("game-container");
  if (!container || !canvas) return;
  const w = container.clientWidth || window.innerWidth || 800;
  const h = container.clientHeight || window.innerHeight || 600;
  if (renderer) {
    renderer.setSize(w, h, false);
    camera3.aspect = w / h;
    camera3.updateProjectionMatrix();
  }
  resizeFx2D();
}

/* =========================================================================
   BUILDINGS (各建物の3Dモデル)
   - 正面は +Z。道路がある方向へ自動で向きを変える
========================================================================= */
function pick(r, arr) {
  return arr[Math.floor(r() * arr.length) % arr.length];
}
function darker(hex, k = 0.75) {
  _c2.set(hex).multiplyScalar(k);
  return _c2.getHex();
}
const BUSH = [0x4d9f3a, 0x2f8a2f, 0x8f8a2a, 0xe8eef5];
const SNOW = 0xf8fafc;

function facePos(b, side, u, off) {
  switch (side) {
    case "F":
      return [b.x + u, b.z + b.d / 2 + off, 0];
    case "B":
      return [b.x - u, b.z - b.d / 2 - off, Math.PI];
    case "R":
      return [b.x + b.w / 2 + off, b.z - u, Math.PI / 2];
    default:
      return [b.x - b.w / 2 - off, b.z + u, -Math.PI / 2];
  }
}
function win(G, b, side, u, y, w, h, o = {}) {
  let [x, z, ry] = facePos(b, side, u, 0.006);
  G.box(w + 0.03, h + 0.03, 0.014, x, y - 0.015, z, o.frame ?? 0xf8fafc, {
    ry,
    ao: false
  });
  [x, z] = facePos(b, side, u, 0.012);
  G.box(w, h, 0.014, x, y, z, o.glass ?? 0x8fc3ec, {
    ry,
    ao: false,
    emi: o.lit ? o.emi || EMI_WIN : null
  });
  if (o.cross) {
    [x, z] = facePos(b, side, u, 0.02);
    G.box(0.01, h, 0.006, x, y, z, o.frame ?? 0xf8fafc, { ry, ao: false });
    G.box(w, 0.01, 0.006, x, y + h / 2 - 0.005, z, o.frame ?? 0xf8fafc, {
      ry,
      ao: false
    });
  }
  if (o.sill) {
    [x, z] = facePos(b, side, u, 0.02);
    G.box(w + 0.05, 0.016, 0.04, x, y - 0.03, z, o.sillC ?? 0xe5e7eb, {
      ry,
      ao: false
    });
  }
  if (o.shutter) {
    for (const s of [-1, 1]) {
      [x, z] = facePos(b, side, u + s * (w / 2 + 0.03), 0.01);
      G.box(0.04, h + 0.01, 0.012, x, y - 0.005, z, o.shutter, {
        ry,
        ao: false
      });
    }
  }
}
function door(G, b, side, u, y, w, h, color, o = {}) {
  let [x, z, ry] = facePos(b, side, u, 0.006);
  G.box(w + 0.03, h + 0.015, 0.014, x, y, z, o.frame ?? 0xf1f5f9, {
    ry,
    ao: false
  });
  [x, z] = facePos(b, side, u, 0.012);
  G.box(w, h, 0.014, x, y, z, color, {
    ry,
    ao: false,
    emi: o.glass ? EMI_WIN2 : null
  });
  [x, z] = facePos(b, side, u + w * 0.32, 0.022);
  G.box(0.014, 0.014, 0.012, x, y + h * 0.45, z, 0xfbbf24, { ry, ao: false });
  if (o.step !== false) {
    [x, z] = facePos(b, side, u, 0.045);
    G.box(w + 0.08, Math.max(0.02, y), 0.08, x, 0, z, 0xd1d5db, { ry });
  }
}
function lampAt(G, out, x, baseY, z, dirx, dirz, h = 0.56) {
  G.box(0.045, 0.03, 0.045, x, baseY, z, 0x374151);
  G.cyl(0.014, 0.02, h, 6, x, baseY, z, 0x374151);
  G.boxC(
    0.016,
    0.016,
    0.13,
    x + dirx * 0.06,
    baseY + h - 0.01,
    z + dirz * 0.06,
    0x374151,
    { ry: Math.atan2(dirx, dirz) }
  );
  const bx = x + dirx * 0.12,
    bz = z + dirz * 0.12;
  G.box(0.075, 0.022, 0.06, bx, baseY + h - 0.035, bz, 0xfef9c3, {
    emi: EMI_LAMP,
    ry: Math.atan2(dirx, dirz),
    ao: false
  });
  out.lamps.push(new THREE.Vector3(bx, baseY + h - 0.04, bz));
}
function gableRoof(G, cx, cz, y0, w, d, h, roofC, wallC, season, o = {}) {
  const ov = o.ov ?? 0.06,
    t = o.t ?? 0.035;
  if (wallC != null) G.prism(cx, cz, y0, w - 0.004, d - 0.004, h, wallC);
  const half = d / 2,
    ang = Math.atan2(h, half),
    L = Math.hypot(h, half);
  const len = L + ov + 0.03;
  for (const s of [-1, 1]) {
    const Dz = s * Math.cos(ang),
      Dy = -Math.sin(ang);
    const Nz = s * Math.sin(ang),
      Ny = Math.cos(ang);
    const cZ = cz + Dz * (len / 2 - 0.03) + Nz * (t / 2);
    const cY = y0 + h + Dy * (len / 2 - 0.03) + Ny * (t / 2);
    G.boxC(w + ov * 2, t, len, cx, cY, cZ, roofC, { rx: s * ang, ao: false });
    if (season === 3) {
      G.boxC(
        w + ov * 2 - 0.03,
        0.028,
        len - 0.04,
        cx,
        cY + Ny * (t / 2 + 0.014) - Dy * 0.01,
        cZ + Nz * (t / 2 + 0.014) - Dz * 0.01,
        SNOW,
        { rx: s * ang, ao: false }
      );
    }
  }
  G.boxC(
    w + ov * 2 + 0.01,
    0.03,
    0.05,
    cx,
    y0 + h + t * 0.7,
    cz,
    season === 3 ? SNOW : darker(roofC, 0.8),
    { ao: false }
  );
}
function hipRoof(G, cx, cz, y0, W, D, h, roofC, season) {
  G.hip(cx, cz, y0, W, D, h, roofC, { ao: false });
  if (season === 3)
    G.hip(cx, cz, y0 + 0.026, W - 0.05, D - 0.05, h, SNOW, { ao: false });
}
function flatRoof(G, b, y, col, parapetC, season, ph = 0.045) {
  const top = season === 3 ? 0xeef2f7 : col;
  G.box(b.w + 0.02, 0.03, b.d + 0.02, b.x, y, b.z, top, { ao: false });
  const T = 0.03,
    yy = y + 0.03;
  G.box(b.w + 0.02, ph, T, b.x, yy, b.z + b.d / 2 + 0.01 - T / 2, parapetC, {
    ao: false
  });
  G.box(b.w + 0.02, ph, T, b.x, yy, b.z - b.d / 2 - 0.01 + T / 2, parapetC, {
    ao: false
  });
  G.box(T, ph, b.d - 0.04, b.x + b.w / 2 + 0.01 - T / 2, yy, b.z, parapetC, {
    ao: false
  });
  G.box(T, ph, b.d - 0.04, b.x - b.w / 2 - 0.01 + T / 2, yy, b.z, parapetC, {
    ao: false
  });
}
function addSign(out, b, side, u, y, text, bg, fg, h, opt = {}) {
  const m = makeSign(text, bg, fg, h, opt);
  const [x, z, ry] = facePos(b, side, u, opt.off ?? 0.024);
  m.position.set(x, y, z);
  m.rotation.y = ry;
  out.group.add(m);
  return m;
}
function smallTree(G, x, z, s, season, rnd) {
  G.cyl(0.02 * s, 0.03 * s, 0.16 * s, 5, x, 0, z, 0x7c4a24);
  const cols =
    season === 0
      ? [0xf9a8d4, 0xfbcfe8]
      : season === 1
      ? [0x22c55e, 0x16a34a]
      : season === 2
      ? [0xf97316, 0xfacc15]
      : [0xf1f5f9, 0xe2e8f0];
  G.sphere(0.12 * s, 1, x, 0.24 * s, z, cols[0]);
  G.sphere(0.08 * s, 1, x + 0.05 * s, 0.31 * s, z + 0.02 * s, cols[1]);
}

/* ---------- 道路（自動接続・歩道・横断歩道・街灯） ---------- */
function buildRoad(G, ctx, out) {
  out.noYaw = true;
  const r = ctx.rnd,
    winter = ctx.season === 3;
  const { n, s, e, w } = ctx;
  const sum = n + s + e + w;
  G.box(1, 0.03, 1, 0, 0, 0, r() < 0.5 ? 0x4b5563 : 0x505968, { ao: false });
  const SW = 0.17,
    SH = 0.055;
  const side = winter ? 0xe8eef5 : 0xcfd5de,
    curb = winter ? 0xd2dae5 : 0x9aa3b0;
  const x0 = w ? -0.5 : -0.5 + SW,
    x1 = e ? 0.5 : 0.5 - SW;
  const z0 = n ? -0.5 : -0.5 + SW,
    z1 = s ? 0.5 : 0.5 - SW;
  if (!n) {
    G.box(1, SH, SW, 0, 0, -0.5 + SW / 2, side);
    G.box(
      x1 - x0,
      SH + 0.008,
      0.024,
      (x0 + x1) / 2,
      0,
      -0.5 + SW - 0.012,
      curb,
      { ao: false }
    );
  }
  if (!s) {
    G.box(1, SH, SW, 0, 0, 0.5 - SW / 2, side);
    G.box(
      x1 - x0,
      SH + 0.008,
      0.024,
      (x0 + x1) / 2,
      0,
      0.5 - SW + 0.012,
      curb,
      { ao: false }
    );
  }
  if (!e) {
    G.box(SW, SH, z1 - z0, 0.5 - SW / 2, 0, (z0 + z1) / 2, side);
    G.box(
      0.024,
      SH + 0.008,
      z1 - z0,
      0.5 - SW + 0.012,
      0,
      (z0 + z1) / 2,
      curb,
      { ao: false }
    );
  }
  if (!w) {
    G.box(SW, SH, z1 - z0, -0.5 + SW / 2, 0, (z0 + z1) / 2, side);
    G.box(
      0.024,
      SH + 0.008,
      z1 - z0,
      -0.5 + SW - 0.012,
      0,
      (z0 + z1) / 2,
      curb,
      { ao: false }
    );
  }
  const corner = (cx, cz) => G.box(SW, SH, SW, cx, 0, cz, side);
  if (n && e && !ctx.ne) corner(0.5 - SW / 2, -0.5 + SW / 2);
  if (n && w && !ctx.nw) corner(-0.5 + SW / 2, -0.5 + SW / 2);
  if (s && e && !ctx.se) corner(0.5 - SW / 2, 0.5 - SW / 2);
  if (s && w && !ctx.sw) corner(-0.5 + SW / 2, 0.5 - SW / 2);

  const mark = (x, z, mw, md, col = 0xf8fafc) =>
    G.box(mw, 0.005, md, x, 0.03, z, col, { ao: false });
  if (sum >= 3) {
    const stripes = (axis, sg) => {
      for (let i = -2; i <= 2; i++) {
        if (axis === "z") mark(i * 0.125, sg * 0.38, 0.07, 0.16);
        else mark(sg * 0.38, i * 0.125, 0.16, 0.07);
      }
    };
    if (n) stripes("z", -1);
    if (s) stripes("z", 1);
    if (e) stripes("x", 1);
    if (w) stripes("x", -1);
  } else if (sum > 0) {
    const D = 0.13;
    if (n) {
      mark(0, -0.38, 0.028, D);
      mark(0, -0.14, 0.028, D);
    }
    if (s) {
      mark(0, 0.14, 0.028, D);
      mark(0, 0.38, 0.028, D);
    }
    if (e) {
      mark(0.14, 0, D, 0.028);
      mark(0.38, 0, D, 0.028);
    }
    if (w) {
      mark(-0.38, 0, D, 0.028);
      mark(-0.14, 0, D, 0.028);
    }
    if (sum === 2 && ((n && s) || (e && w)) && r() < 0.3) {
      const mx = n ? 0.22 : 0.3,
        mz = n ? 0.3 : 0.22;
      G.cyl(0.055, 0.055, 0.006, 10, mx, 0.03, mz, 0x374151, { ao: false });
    }
  }
  // 雪の名残
  if (winter && sum < 4) {
    for (let k = 0; k < 3; k++)
      G.sphere(
        0.04 + r() * 0.03,
        0,
        (r() - 0.5) * 0.8,
        SH,
        (r() - 0.5) * 0.8,
        SNOW,
        { sy: 0.4, ao: false }
      );
  }
  // 街灯
  const sides = [];
  if (!s) sides.push([0.3, 0.5 - SW / 2, 0, -1]);
  if (!e) sides.push([0.5 - SW / 2, -0.3, -1, 0]);
  if (!n) sides.push([-0.3, -0.5 + SW / 2, 0, 1]);
  if (!w) sides.push([-0.5 + SW / 2, 0.3, 1, 0]);
  if (sides.length && (ctx.x * 7 + ctx.y * 5) % 3 === 0) {
    const [lx, lz, dx, dz] = sides[0];
    lampAt(G, out, lx, SH, lz, dx, dz);
  }
  // 信号機（十字路）
  if (sum === 4 && !ctx.nw) {
    const px = -0.5 + SW / 2,
      pz = -0.5 + SW / 2;
    G.cyl(0.013, 0.016, 0.5, 6, px, SH, pz, 0x4b5563);
    G.box(0.05, 0.13, 0.045, px + 0.035, SH + 0.38, pz + 0.035, 0x1f2937, {
      ry: Math.PI / 4
    });
    const cols = [
      [0xef4444, [0.2, 0.02, 0.02]],
      [0xfbbf24, [0.2, 0.15, 0.02]],
      [0x22c55e, [0.1, 1.4, 0.4]]
    ];
    cols.forEach(([c, em], i) =>
      G.box(
        0.026,
        0.026,
        0.01,
        px + 0.055,
        SH + 0.475 - i * 0.04,
        pz + 0.055,
        c,
        { ry: Math.PI / 4, emi: em, ao: false }
      )
    );
  }
}

/* ---------- 水路 ---------- */
function buildWater(G, ctx, out) {
  out.noYaw = true;
  const r = ctx.rnd;
  const { n, s, e, w } = ctx;
  G.box(1, 0.02, 1, 0, -0.3, 0, 0x2f7f86, { ao: false });
  const WT = 0.1,
    H = 0.35,
    wallC = 0xb8b2a7,
    capC = ctx.season === 3 ? SNOW : 0xd6d3d1;
  const z0 = n ? -0.5 : -0.5 + WT,
    z1 = s ? 0.5 : 0.5 - WT;
  if (!n) {
    G.box(1, H, WT, 0, -0.3, -0.5 + WT / 2, wallC);
    G.box(1, 0.03, WT + 0.02, 0, 0.05, -0.5 + WT / 2 + 0.01, capC, {
      ao: false
    });
  }
  if (!s) {
    G.box(1, H, WT, 0, -0.3, 0.5 - WT / 2, wallC);
    G.box(1, 0.03, WT + 0.02, 0, 0.05, 0.5 - WT / 2 - 0.01, capC, {
      ao: false
    });
  }
  const cz0 = n ? -0.5 : -0.5 + WT + 0.02,
    cz1 = s ? 0.5 : 0.5 - WT - 0.02;
  if (!e) {
    G.box(WT, H, z1 - z0, 0.5 - WT / 2, -0.3, (z0 + z1) / 2, wallC);
    G.box(
      WT + 0.02,
      0.03,
      cz1 - cz0,
      0.5 - WT / 2 - 0.01,
      0.05,
      (cz0 + cz1) / 2,
      capC,
      { ao: false }
    );
  }
  if (!w) {
    G.box(WT, H, z1 - z0, -0.5 + WT / 2, -0.3, (z0 + z1) / 2, wallC);
    G.box(
      WT + 0.02,
      0.03,
      cz1 - cz0,
      -0.5 + WT / 2 + 0.01,
      0.05,
      (cz0 + cz1) / 2,
      capC,
      { ao: false }
    );
  }
  const post = (cx, cz) => {
    G.box(WT, H, WT, cx, -0.3, cz, wallC);
    G.box(WT + 0.02, 0.03, WT + 0.02, cx, 0.05, cz, capC, { ao: false });
  };
  if (n && e && !ctx.ne) post(0.5 - WT / 2, -0.5 + WT / 2);
  if (n && w && !ctx.nw) post(-0.5 + WT / 2, -0.5 + WT / 2);
  if (s && e && !ctx.se) post(0.5 - WT / 2, 0.5 - WT / 2);
  if (s && w && !ctx.sw) post(-0.5 + WT / 2, 0.5 - WT / 2);
  // 石垣の目地
  if (!n)
    for (let i = 0; i < 4; i++)
      G.box(
        0.006,
        0.3,
        0.004,
        -0.375 + i * 0.25,
        -0.28,
        -0.5 + WT + 0.001,
        0x8f897f,
        { ao: false }
      );
  if (!s)
    for (let i = 0; i < 4; i++)
      G.box(
        0.006,
        0.3,
        0.004,
        -0.375 + i * 0.25,
        -0.28,
        0.5 - WT - 0.001,
        0x8f897f,
        { ao: false }
      );
  // 水面
  if (!UNIT.waterPlane) {
    UNIT.waterPlane = new THREE.PlaneGeometry(1, 1, 4, 4);
    UNIT.waterPlane.rotateX(-Math.PI / 2);
  }
  const surf = new THREE.Mesh(UNIT.waterPlane, matWater);
  surf.position.y = -0.07;
  surf.userData.sharedGeo = true;
  surf.receiveShadow = true;
  surf.renderOrder = 2;
  out.group.add(surf);
  // 睡蓮
  if (ctx.season !== 3 && r() < 0.5) {
    const k = 1 + Math.floor(r() * 3);
    for (let i = 0; i < k; i++) {
      const px = (r() - 0.5) * 0.55,
        pz = (r() - 0.5) * 0.55;
      G.cyl(0.065, 0.065, 0.006, 9, px, -0.052, pz, 0x4d7c0f, { ao: false });
      if (r() < 0.5)
        G.sphere(0.022, 0, px + 0.02, -0.035, pz, 0xf9a8d4, { ao: false });
    }
  }
  // アヒル
  if (r() < 0.15) {
    const D = new GeoBuilder();
    const col = r() < 0.5 ? 0xffffff : 0xfde047;
    D.sphere(0.06, 1, 0, 0.03, 0, col, {
      sx: 0.8,
      sy: 0.65,
      sz: 1.1,
      ao: false
    });
    D.sphere(0.035, 1, 0, 0.09, 0.05, col, { ao: false });
    D.box(0.022, 0.012, 0.03, 0, 0.08, 0.09, 0xf97316, { ao: false });
    D.sphere(0.006, 0, 0.018, 0.1, 0.07, 0x111111, { ao: false });
    D.sphere(0.006, 0, -0.018, 0.1, 0.07, 0x111111, { ao: false });
    const duck = new THREE.Mesh(D.build(), matWorld);
    duck.castShadow = true;
    out.group.add(duck);
    const ph = r() * 6;
    out.anims.push((t) => {
      const a = t * 0.35 + ph;
      duck.position.set(
        Math.cos(a) * 0.2,
        -0.075 + Math.sin(t * 2.2 + ph) * 0.008,
        Math.sin(a) * 0.2
      );
      duck.rotation.y = -a;
    });
  }
}

/* ---------- 花壇 ---------- */
function buildFlowerBed(G, ctx, out) {
  out.noYaw = true;
  const r = ctx.rnd,
    season = ctx.season;
  const bc = r() < 0.5 ? 0xb45309 : 0xa8a29e;
  G.box(0.86, 0.1, 0.07, 0, 0, 0.395, bc);
  G.box(0.86, 0.1, 0.07, 0, 0, -0.395, bc);
  G.box(0.07, 0.1, 0.72, 0.395, 0, 0, bc);
  G.box(0.07, 0.1, 0.72, -0.395, 0, 0, bc);
  G.box(0.86, 0.012, 0.07, 0, 0.1, 0.395, darker(bc, 1.15), { ao: false });
  G.box(0.86, 0.012, 0.07, 0, 0.1, -0.395, darker(bc, 1.15), { ao: false });
  G.box(0.72, 0.075, 0.72, 0, 0, 0, 0x5b3b24, { ao: false });
  if (season === 3) {
    G.box(0.7, 0.03, 0.7, 0, 0.075, 0, SNOW, { ao: false });
    for (let i = 0; i < 4; i++) {
      const px = -0.18 + (i % 2) * 0.36,
        pz = -0.18 + Math.floor(i / 2) * 0.36;
      G.sphere(0.11, 0, px, 0.15, pz, 0x166534);
      G.sphere(0.08, 0, px, 0.22, pz, SNOW, { sy: 0.6 });
    }
    return;
  }
  const pal = [
    [0xef4444, 0xfacc15, 0xf472b6, 0xffffff, 0xa855f7],
    [0xfacc15, 0x60a5fa, 0xf43f5e, 0xfb923c],
    [0xf97316, 0xdc2626, 0xfde047, 0xc2410c]
  ][season];
  const off = Math.floor(r() * 5);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const px = -0.24 + i * 0.16 + (r() - 0.5) * 0.03,
        pz = -0.24 + j * 0.16 + (r() - 0.5) * 0.03;
      const col = pal[(j + off) % pal.length];
      const h = (season === 1 && col === 0xfacc15 ? 0.17 : 0.09) + r() * 0.03;
      G.box(0.014, h, 0.014, px, 0.075, pz, 0x3f7d20, { ao: false });
      G.boxC(0.06, 0.008, 0.022, px + 0.02, 0.075 + h * 0.4, pz, 0x4d7c0f, {
        ry: r() * 3,
        rz: 0.4,
        ao: false
      });
      if (season === 1 && col === 0xfacc15) {
        G.cyl(0.05, 0.05, 0.014, 8, px, 0.075 + h, pz, 0xfacc15, {
          rx: 0.5,
          ao: false
        });
        G.cyl(0.024, 0.024, 0.018, 8, px, 0.078 + h, pz + 0.005, 0x78350f, {
          rx: 0.5,
          ao: false
        });
      } else if (season === 0) {
        G.cyl(0.03, 0.018, 0.055, 6, px, 0.075 + h, pz, col, { ao: false });
      } else {
        G.sphere(0.034, 0, px, 0.075 + h + 0.02, pz, col, { ao: false });
      }
    }
  }
}

/* ---------- 木 ---------- */
function buildTree(G, ctx, out) {
  const r = ctx.rnd,
    season = ctx.season;
  ctx.yaw = r() * Math.PI * 2;
  const conifer = r() < 0.3;
  const sc = 0.85 + r() * 0.35;
  G.cyl(
    0.26 * sc,
    0.3 * sc,
    0.012,
    9,
    0,
    0,
    0,
    season === 3 ? 0xe2e8f0 : season === 2 ? 0x8a7a2a : 0x4f8a2a,
    { ao: false }
  );
  if (conifer) {
    G.cyl(0.045, 0.065, 0.25 * sc, 6, 0, 0.01, 0, 0x6b4423);
    const greens = [0x166534, 0x15803d, 0x1a7a3c];
    const tiers = [
      [0.34, 0.36, 0.18],
      [0.27, 0.32, 0.38],
      [0.19, 0.28, 0.56]
    ];
    tiers.forEach(([rr, hh, yy], i) => {
      G.cone(rr * sc, hh * sc, 7, 0, yy * sc, 0, greens[i]);
      if (season === 3)
        G.cone(
          rr * sc * 0.72,
          hh * sc * 0.5,
          7,
          0,
          (yy + hh * 0.5) * sc,
          0,
          SNOW
        );
    });
  } else {
    G.cyl(0.042, 0.068, 0.36 * sc, 6, 0, 0.01, 0, 0x7c4a24);
    G.boxC(0.03, 0.14, 0.03, 0.06 * sc, 0.36 * sc, 0, 0x7c4a24, { rz: -0.7 });
    let cols;
    if (season === 0)
      cols =
        r() < 0.55
          ? [0xfbcfe8, 0xf9a8d4, 0xf472b6]
          : [0x86efac, 0x4ade80, 0x65d36e];
    else if (season === 1) cols = [0x22c55e, 0x16a34a, 0x15803d];
    else if (season === 2)
      cols = pick(r, [
        [0xf97316, 0xea580c, 0xfb923c],
        [0xfacc15, 0xeab308, 0xf59e0b],
        [0xdc2626, 0xef4444, 0xf97316]
      ]);
    else cols = [0xf1f5f9, 0xe2e8f0, 0xffffff];
    G.sphere(0.27 * sc, 1, 0, 0.55 * sc, 0, cols[0]);
    G.sphere(0.2 * sc, 1, 0.14 * sc, 0.68 * sc, 0.05 * sc, cols[1]);
    G.sphere(0.19 * sc, 1, -0.13 * sc, 0.63 * sc, -0.08 * sc, cols[2]);
    G.sphere(0.15 * sc, 1, 0.02 * sc, 0.82 * sc, -0.05 * sc, cols[1]);
    if (season === 2)
      for (let i = 0; i < 7; i++)
        G.boxC(
          0.035,
          0.006,
          0.025,
          (r() - 0.5) * 0.6,
          0.016,
          (r() - 0.5) * 0.6,
          cols[i % 3],
          { ry: r() * 3, ao: false }
        );
  }
  const ph = r() * 6,
    grp = out.group;
  out.anims.push((t) => {
    grp.rotation.z = Math.sin(t * 1.3 + ph) * 0.022;
    grp.rotation.x = Math.cos(t * 1.07 + ph) * 0.016;
  });
}

/* ---------- 公園 ---------- */
function buildPark(G, ctx, out) {
  out.noYaw = true;
  const r = ctx.rnd,
    season = ctx.season;
  const lawn = [0x8fdc6c, 0x6cc34f, 0xc2c35c, 0xf1f5f9][season];
  const pathC = season === 3 ? 0xe2e8f0 : 0xe7d7b5;
  G.box(0.98, 0.02, 0.98, 0, 0, 0, lawn, { ao: false });
  G.box(0.98, 0.025, 0.16, 0, 0, 0, pathC, { ao: false });
  G.box(0.16, 0.025, 0.41, 0, 0, 0.285, pathC, { ao: false });
  G.box(0.16, 0.025, 0.41, 0, 0, -0.285, pathC, { ao: false });
  G.cyl(0.3, 0.3, 0.032, 16, 0, 0, 0, 0xe5e7eb, { ao: false });
  // 噴水
  G.cyl(0.2, 0.21, 0.09, 16, 0, 0.032, 0, 0xcbd5e1);
  G.cyl(
    0.175,
    0.175,
    0.006,
    16,
    0,
    0.11,
    0,
    season === 3 ? 0xdbeafe : 0x7dd3fc,
    { ao: false, emi: [0.05, 0.12, 0.2] }
  );
  G.cyl(0.035, 0.045, 0.17, 8, 0, 0.11, 0, 0xcbd5e1);
  G.cyl(0.085, 0.05, 0.04, 12, 0, 0.27, 0, 0xcbd5e1);
  G.cyl(0.07, 0.07, 0.004, 12, 0, 0.31, 0, 0x7dd3fc, { ao: false });
  if (season !== 3) out.fountains.push(new THREE.Vector3(0, 0.33, 0));
  // ベンチ
  const bench = (x, z, ry) => {
    const cs = Math.cos(ry),
      sn = Math.sin(ry);
    const P = (lx, lz) => [x + lx * cs + lz * sn, z - lx * sn + lz * cs];
    let p = P(0, 0);
    G.box(0.2, 0.018, 0.065, p[0], 0.06, p[1], 0xa16207, { ry });
    p = P(0, -0.03);
    G.box(0.2, 0.06, 0.014, p[0], 0.078, p[1], 0xa16207, { ry });
    for (const s of [-1, 1]) {
      p = P(s * 0.085, 0);
      G.box(0.016, 0.06, 0.06, p[0], 0, p[1], 0x374151, { ry });
    }
  };
  bench(-0.3, 0.17, 0);
  bench(0.3, -0.17, Math.PI);
  // 木
  for (const [x, z] of [
    [-0.36, -0.36],
    [0.36, -0.36],
    [-0.36, 0.36],
    [0.36, 0.36]
  ])
    smallTree(G, x, z, 0.95 + r() * 0.3, season, r);
  // 花
  if (season !== 3) {
    const fc = [
      [0xf472b6, 0xfde047],
      [0xf43f5e, 0x60a5fa],
      [0xf97316, 0xfde047]
    ][season];
    for (let i = 0; i < 10; i++) {
      const qx = (i % 2 ? 1 : -1) * (0.17 + r() * 0.1),
        qz = (i % 4 < 2 ? 1 : -1) * (0.13 + r() * 0.09);
      G.sphere(0.022, 0, qx, 0.035, qz, fc[i % 2], { ao: false });
    }
  }
  lampAt(G, out, 0.2, 0.02, 0.36, 0, -1, 0.42);
  lampAt(G, out, -0.2, 0.02, -0.36, 0, 1, 0.42);
}

/* ---------- 小さな家 ---------- */
function buildHouse1(G, ctx, out) {
  const r = ctx.rnd,
    season = ctx.season;
  const walls = pick(
    r,
    [0xfffbeb, 0xf8fafc, 0xe0f2fe, 0xfce7f3, 0xecfccb, 0xfef3c7]
  );
  const roof = pick(
    r,
    [0xdc2626, 0x2563eb, 0x0f766e, 0xc2410c, 0x7c3aed, 0xe11d48]
  );
  const doorC = pick(r, [0x7c2d12, 0x1e3a8a, 0x166534, 0x9f1239]);
  const shutter = darker(roof, 0.8);
  for (let k = 0; k < 3; k++)
    G.box(0.1, 0.012, 0.065, -0.14, 0, 0.255 + k * 0.08, 0xd6d3d1, {
      ao: false
    });
  const b = { x: 0, z: -0.07, w: 0.62, d: 0.5 };
  G.box(b.w + 0.05, 0.05, b.d + 0.05, b.x, 0, b.z, 0x9ca3af);
  G.box(b.w, 0.36, b.d, b.x, 0.05, b.z, walls);
  for (const sx of [-1, 1])
    for (const sz of [-1, 1])
      G.box(
        0.028,
        0.36,
        0.028,
        b.x + sx * (b.w / 2),
        0.05,
        b.z + sz * (b.d / 2),
        0xffffff
      );
  gableRoof(G, b.x, b.z, 0.41, b.w, b.d, 0.26, roof, walls, season, {
    ov: 0.07
  });
  G.box(0.08, 0.27, 0.08, 0.17, 0.5, b.z - 0.11, 0x9a3412);
  G.box(0.1, 0.03, 0.1, 0.17, 0.77, b.z - 0.11, season === 3 ? SNOW : 0x7c2d12);
  door(G, b, "F", -0.14, 0.05, 0.12, 0.2, doorC);
  let [px, pz, ry] = facePos(b, "F", -0.05, 0.015);
  G.box(0.022, 0.032, 0.02, px, 0.21, pz, 0xfef3c7, {
    ry,
    emi: [1.4, 1.1, 0.6],
    ao: false
  });
  win(G, b, "F", 0.13, 0.16, 0.15, 0.13, {
    lit: r() < 0.75,
    cross: true,
    shutter,
    sill: true
  });
  [px, pz] = facePos(b, "F", 0.13, 0.03);
  G.box(0.17, 0.035, 0.035, px, 0.11, pz, 0x92400e);
  if (season !== 3)
    for (let i = 0; i < 4; i++)
      G.sphere(
        0.018,
        0,
        px - 0.06 + i * 0.04,
        0.155,
        pz,
        [0xef4444, 0xfde047, 0xf472b6, 0xffffff][i],
        { ao: false }
      );
  win(G, b, "L", 0, 0.16, 0.14, 0.12, { lit: r() < 0.6, cross: true, shutter });
  win(G, b, "R", 0, 0.16, 0.14, 0.12, { lit: r() < 0.6, cross: true, shutter });
  win(G, b, "B", 0.13, 0.16, 0.14, 0.12, { lit: r() < 0.5, cross: true });
  win(G, b, "B", -0.13, 0.16, 0.14, 0.12, { lit: r() < 0.5, cross: true });
  // 柵
  const fc = 0xffffff,
    fz = 0.455;
  for (let x = -0.44; x <= 0.45; x += 0.066)
    if (Math.abs(x + 0.14) > 0.08) G.box(0.02, 0.085, 0.015, x, 0, fz, fc);
  G.box(0.24, 0.014, 0.012, -0.335, 0.05, fz, fc);
  G.box(0.51, 0.014, 0.012, 0.195, 0.05, fz, fc);
  const bc = BUSH[season];
  G.sphere(0.075, 0, 0.32, 0.06, 0.34, bc);
  G.sphere(0.06, 0, 0.41, 0.05, 0.27, darker(bc, 0.9));
  G.sphere(0.065, 0, -0.39, 0.06, 0.32, bc);
  G.box(0.015, 0.09, 0.015, -0.32, 0, 0.4, 0x6b7280);
  G.box(0.05, 0.035, 0.035, -0.32, 0.09, 0.4, 0xdc2626);
  if (r() < 0.5) smallTree(G, 0.38, -0.4, 0.8, season, r);
}

/* ---------- 大きな家 ---------- */
function buildHouse2(G, ctx, out) {
  const r = ctx.rnd,
    season = ctx.season;
  const walls = pick(r, [0xfef3c7, 0xf5f5f4, 0xdbeafe, 0xfde68a, 0xffedd5]);
  const roof = pick(r, [0x334155, 0x7c2d12, 0x065f46, 0x1e3a8a, 0x881337]);
  const b = { x: -0.1, z: -0.06, w: 0.56, d: 0.52 };
  G.box(b.w + 0.04, 0.05, b.d + 0.04, b.x, 0, b.z, 0x9ca3af);
  G.box(b.w, 0.62, b.d, b.x, 0.05, b.z, walls);
  G.box(b.w + 0.02, 0.025, b.d + 0.02, b.x, 0.345, b.z, 0xffffff, {
    ao: false
  });
  hipRoof(G, b.x, b.z, 0.67, b.w + 0.12, b.d + 0.12, 0.22, roof, season);
  G.box(b.w + 0.13, 0.02, b.d + 0.13, b.x, 0.655, b.z, darker(roof, 0.85), {
    ao: false
  });
  // ガレージ
  const g = { x: 0.31, z: -0.13, w: 0.26, d: 0.36 };
  G.box(g.w, 0.3, g.d, g.x, 0.03, g.z, darker(walls, 0.93));
  flatRoof(G, g, 0.33, roof, darker(walls, 0.85), season, 0.03);
  let [x, z, ry] = facePos(g, "F", 0, 0.008);
  G.box(0.2, 0.2, 0.014, x, 0.03, z, 0xe5e7eb, { ry, ao: false });
  [x, z] = facePos(g, "F", 0, 0.017);
  for (const yy of [0.08, 0.13, 0.18])
    G.box(0.2, 0.008, 0.006, x, yy, z, 0xa3a3a3, { ry, ao: false });
  G.box(0.24, 0.012, 0.45, g.x, 0, 0.275, 0xd1d5db, { ao: false });
  if (r() < 0.65) carParts(G, g.x, 0.285, 0, pick(r, CAR_COLORS));
  // 玄関
  door(
    G,
    b,
    "F",
    -0.12,
    0.05,
    0.12,
    0.21,
    pick(r, [0x7c2d12, 0x1f2937, 0x1e3a8a])
  );
  [x, z] = facePos(b, "F", -0.12, 0.045);
  G.box(0.2, 0.02, 0.09, x, 0.29, z, darker(roof, 1.1), { ao: false });
  // 窓
  win(G, b, "F", 0.11, 0.13, 0.15, 0.15, { lit: r() < 0.7, cross: true });
  win(G, b, "F", -0.13, 0.42, 0.13, 0.17, { lit: r() < 0.7 });
  win(G, b, "F", 0.11, 0.42, 0.15, 0.15, { lit: r() < 0.7, cross: true });
  for (const yy of [0.13, 0.42]) {
    win(G, b, "L", -0.12, yy, 0.14, 0.14, { lit: r() < 0.6, cross: true });
    win(G, b, "L", 0.12, yy, 0.14, 0.14, { lit: r() < 0.6, cross: true });
    win(G, b, "B", -0.12, yy, 0.14, 0.14, { lit: r() < 0.5, cross: true });
    win(G, b, "B", 0.12, yy, 0.14, 0.14, { lit: r() < 0.5, cross: true });
  }
  win(G, b, "R", 0.1, 0.43, 0.14, 0.14, { lit: r() < 0.6, cross: true });
  // バルコニー
  const bz = b.z + b.d / 2;
  G.box(0.32, 0.025, 0.11, b.x - 0.01, 0.345, bz + 0.055, 0xe5e7eb, {
    ao: false
  });
  for (let i = 0; i <= 6; i++)
    G.box(
      0.012,
      0.075,
      0.012,
      b.x - 0.16 + i * 0.05,
      0.37,
      bz + 0.104,
      0xffffff,
      { ao: false }
    );
  G.box(0.32, 0.012, 0.016, b.x - 0.01, 0.445, bz + 0.104, 0xffffff, {
    ao: false
  });
  for (const s of [-1, 1])
    G.box(
      0.012,
      0.012,
      0.1,
      b.x - 0.01 + s * 0.155,
      0.445,
      bz + 0.055,
      0xffffff,
      { ao: false }
    );
  // 生け垣
  const hc = BUSH[season];
  G.box(0.94, 0.09, 0.07, 0, 0, -0.45, hc);
  G.box(0.07, 0.09, 0.62, -0.45, 0, -0.1, hc);
  smallTree(G, -0.38, 0.38, 1.0, season, r);
  G.sphere(0.06, 0, -0.04, 0.05, 0.38, darker(hc, 0.9));
}

/* ---------- 商店 ---------- */
function buildShop(G, ctx, out) {
  const r = ctx.rnd,
    season = ctx.season;
  const theme = pick(r, [
    [0xef4444, 0xffffff, "#dc2626"],
    [0x16a34a, 0xffffff, "#15803d"],
    [0x2563eb, 0xffffff, "#1d4ed8"],
    [0xf59e0b, 0xffffff, "#d97706"]
  ]);
  G.box(0.98, 0.02, 0.98, 0, 0, 0, 0xe7e5e4, { ao: false });
  const b = { x: 0, z: -0.09, w: 0.8, d: 0.58 };
  G.box(b.w, 0.46, b.d, b.x, 0.02, b.z, 0xfefce8);
  G.box(b.w + 0.01, 0.06, b.d + 0.01, b.x, 0.02, b.z, 0x78716c);
  flatRoof(G, b, 0.48, 0x9ca3af, 0xe7e5e4, season, 0.05);
  // ショーウィンドウ
  let [x, z, ry] = facePos(b, "F", 0, 0.006);
  G.box(0.66, 0.27, 0.014, x, 0.08, z, 0x334155, { ry, ao: false });
  [x, z] = facePos(b, "F", 0, 0.012);
  G.box(0.62, 0.24, 0.014, x, 0.095, z, 0xbfe3fb, {
    ry,
    ao: false,
    emi: EMI_WIN2
  });
  for (const u of [-0.2, 0.2]) {
    [x, z] = facePos(b, "F", u, 0.02);
    G.box(0.014, 0.24, 0.008, x, 0.095, z, 0x334155, { ry, ao: false });
  }
  // 店内の棚
  for (const u of [-0.28, -0.1, 0.1, 0.28]) {
    [x, z] = facePos(b, "F", u, -0.05);
    G.box(
      0.12,
      0.14,
      0.04,
      x,
      0.1,
      z,
      pick(r, [0xfca5a5, 0xfde68a, 0xa7f3d0, 0xbfdbfe]),
      { ry }
    );
  }
  // 看板帯
  [x, z] = facePos(b, "F", 0, 0.01);
  G.box(0.8, 0.09, 0.02, x, 0.38, z, theme[0], { ry, ao: false });
  addSign(out, b, "F", 0, 0.425, "SHOP", theme[2], "#ffffff", 0.075, {
    off: 0.023
  });
  // しましまオーニング
  const N = 8,
    aw = 0.68 / N;
  for (let i = 0; i < N; i++) {
    const u = -0.34 + aw / 2 + i * aw;
    [x, z] = facePos(b, "F", u, 0.085);
    G.boxC(aw + 0.002, 0.012, 0.18, x, 0.33, z, i % 2 ? theme[1] : theme[0], {
      ry,
      rx: 0.42,
      ao: false
    });
  }
  [x, z] = facePos(b, "F", 0, 0.165);
  for (let i = 0; i < N; i++)
    G.box(
      aw * 0.98,
      0.03,
      0.006,
      x - 0.34 + aw / 2 + i * aw,
      0.27,
      z,
      i % 2 ? theme[1] : theme[0],
      { ry, ao: false }
    );
  // 果物スタンド
  for (const s of [-1, 1]) {
    const cx = s * 0.33,
      cz = 0.31;
    G.box(0.16, 0.07, 0.12, cx, 0.02, cz, 0xa16207);
    G.box(0.16, 0.01, 0.12, cx, 0.09, cz, 0x854d0e, { ao: false });
    const fc = s < 0 ? [0xef4444, 0xdc2626] : [0xf97316, 0x84cc16];
    for (let i = 0; i < 6; i++)
      G.sphere(
        0.022,
        0,
        cx - 0.05 + (i % 3) * 0.05,
        0.115,
        cz - 0.025 + Math.floor(i / 3) * 0.05,
        fc[i % 2],
        { ao: false }
      );
  }
  // 室外機・自販機
  G.box(0.14, 0.08, 0.1, 0.2, 0.53, -0.25, 0xd1d5db);
  G.cyl(0.03, 0.03, 0.006, 10, 0.2, 0.61, -0.25, 0x6b7280, { ao: false });
  G.box(0.1, 0.08, 0.08, -0.2, 0.53, -0.2, 0xd1d5db);
  G.box(0.09, 0.2, 0.08, 0.44, 0.02, 0.0, 0xdc2626);
  G.box(0.07, 0.08, 0.005, 0.44, 0.11, 0.041, 0xfef9c3, {
    emi: [1.2, 1.2, 1.0],
    ao: false
  });
  // ゴミ箱
  G.cyl(0.03, 0.03, 0.07, 8, -0.44, 0.02, 0.05, 0x22c55e);
}

/* ---------- カフェ ---------- */
function buildCafe(G, ctx, out) {
  const r = ctx.rnd,
    season = ctx.season;
  const awC = pick(r, [
    [0x15803d, 0xfef3c7],
    [0x7c2d12, 0xfef3c7],
    [0x1e3a8a, 0xffffff]
  ]);
  const roofC = pick(r, [0x5b2c16, 0x14532d, 0x7f1d1d]);
  G.box(0.98, 0.025, 0.42, 0, 0, 0.28, 0xc08a5a, { ao: false });
  for (let i = 0; i < 6; i++)
    G.box(0.98, 0.003, 0.006, 0, 0.025, 0.1 + i * 0.07, 0x9a6b42, {
      ao: false
    });
  const b = { x: 0, z: -0.17, w: 0.7, d: 0.54 };
  G.box(b.w + 0.03, 0.05, b.d + 0.03, b.x, 0, b.z, 0x78716c);
  G.box(b.w, 0.4, b.d, b.x, 0.05, b.z, 0xfde9d1);
  G.box(b.w + 0.005, 0.12, b.d + 0.005, b.x, 0.05, b.z, 0xb45309);
  for (const sx of [-1, 1])
    for (const sz of [-1, 1])
      G.box(
        0.035,
        0.4,
        0.035,
        b.x + (sx * b.w) / 2,
        0.05,
        b.z + (sz * b.d) / 2,
        0x5b3a1e
      );
  gableRoof(G, b.x, b.z, 0.45, b.w, b.d, 0.24, roofC, 0xfde9d1, season, {
    ov: 0.06
  });
  win(G, b, "F", 0.15, 0.15, 0.26, 0.2, {
    lit: true,
    emi: EMI_WIN2,
    frame: 0x5b3a1e,
    glass: 0xfde8c8
  });
  door(G, b, "F", -0.17, 0.05, 0.13, 0.23, 0x5b3a1e, {
    glass: true,
    frame: 0x3f2a16
  });
  win(G, b, "L", 0, 0.2, 0.18, 0.14, {
    lit: true,
    frame: 0x5b3a1e,
    cross: true
  });
  win(G, b, "R", 0, 0.2, 0.18, 0.14, {
    lit: true,
    frame: 0x5b3a1e,
    cross: true
  });
  // 看板
  let [x, z, ry] = facePos(b, "F", 0, 0.01);
  G.box(0.36, 0.08, 0.02, x, 0.38, z, 0x3f2a16, { ry, ao: false });
  addSign(out, b, "F", 0, 0.42, "CAFE", "#3f2a16", "#fde68a", 0.07, {
    icon: "cup",
    off: 0.023
  });
  // オーニング
  const N = 7,
    aw = 0.62 / N;
  for (let i = 0; i < N; i++) {
    [x, z] = facePos(b, "F", -0.31 + aw / 2 + i * aw, 0.07);
    G.boxC(aw + 0.002, 0.012, 0.15, x, 0.335, z, i % 2 ? awC[1] : awC[0], {
      ry,
      rx: 0.45,
      ao: false
    });
  }
  // テラス席
  const umb = pick(r, [0xef4444, 0x0ea5e9, 0xf59e0b, 0x10b981]);
  for (const [tx, tz] of [
    [-0.22, 0.3],
    [0.2, 0.32]
  ]) {
    G.cyl(0.012, 0.012, 0.09, 5, tx, 0.025, tz, 0x374151);
    G.cyl(0.07, 0.07, 0.012, 12, tx, 0.115, tz, 0xf8fafc);
    for (const s of [-1, 1]) {
      G.box(0.055, 0.012, 0.05, tx + s * 0.1, 0.075, tz, 0x7c2d12);
      G.box(0.012, 0.05, 0.05, tx + s * 0.125, 0.087, tz, 0x7c2d12);
      G.box(0.01, 0.05, 0.01, tx + s * 0.1, 0.025, tz, 0x374151);
    }
    G.cyl(0.006, 0.006, 0.22, 4, tx, 0.127, tz, 0xe5e7eb);
    G.cone(0.15, 0.07, 8, tx, 0.33, tz, umb, { ao: false });
    G.sphere(0.012, 0, tx, 0.41, tz, 0xf8fafc, { ao: false });
  }
  // 植木鉢
  const bc = BUSH[season];
  for (const s of [-1, 1]) {
    G.cyl(0.035, 0.028, 0.06, 8, s * 0.42, 0.025, 0.1, 0xb45309);
    G.sphere(0.05, 0, s * 0.42, 0.11, 0.1, bc);
  }
  // 黒板メニュー
  G.boxC(0.07, 0.11, 0.008, 0.36, 0.08, 0.42, 0x1f2937, { rx: -0.2 });
  G.boxC(0.07, 0.11, 0.008, 0.36, 0.08, 0.44, 0x1f2937, { rx: 0.2 });
  // ガーランドライト
  for (const px of [-0.45, 0.45])
    G.cyl(0.008, 0.008, 0.36, 4, px, 0.025, 0.47, 0x374151);
  for (let i = 0; i < 9; i++) {
    const xx = -0.45 + i * 0.1125;
    const sag = Math.sin((i / 8) * Math.PI) * 0.035;
    G.sphere(0.012, 0, xx, 0.37 - sag, 0.47, 0xfef3c7, {
      emi: [1.6, 1.3, 0.7],
      ao: false
    });
  }
}

/* ---------- オフィス ---------- */
function buildOffice(G, ctx, out) {
  const r = ctx.rnd,
    season = ctx.season;
  const glass = pick(r, [0x7cc4ee, 0x5fd4c4, 0x9fb4f5, 0x8fb8d6]);
  const frame = pick(r, [0xe2e8f0, 0x475569, 0xcbd5e1]);
  const floors = 7 + Math.floor(r() * 4);
  const FH = 0.19;
  G.box(0.98, 0.02, 0.98, 0, 0, 0, 0xd6d3d1, { ao: false });
  for (let i = 0; i < 4; i++)
    G.box(0.98, 0.003, 0.005, 0, 0.02, -0.36 + i * 0.24, 0xb8b2a7, {
      ao: false
    });
  // ロビー
  const lb = { x: 0, z: -0.04, w: 0.64, d: 0.62 };
  G.box(lb.w, 0.25, lb.d, lb.x, 0.02, lb.z, 0x334155);
  let [x, z, ry] = facePos(lb, "F", 0, 0.004);
  G.box(0.5, 0.2, 0.012, x, 0.03, z, 0xbfe3fb, {
    ry,
    emi: EMI_WIN2,
    ao: false
  });
  [x, z] = facePos(lb, "F", 0, 0.1);
  G.box(0.34, 0.025, 0.2, x, 0.24, z, frame, { ao: false });
  for (const s of [-1, 1]) {
    [x, z] = facePos(lb, "F", s * 0.15, 0.18);
    G.box(0.02, 0.22, 0.02, x, 0.02, z, frame);
  }
  addSign(out, lb, "F", 0, 0.29, "OFFICE", "#1e293b", "#e0f2fe", 0.06, {
    off: 0.205
  });
  // タワー
  const tb = { x: 0, z: -0.04, w: 0.56, d: 0.56 };
  const y0 = 0.27,
    H = floors * FH;
  G.box(tb.w - 0.02, H, tb.d - 0.02, tb.x, y0, tb.z, darker(glass, 0.45), {
    ao: false
  });
  for (let f = 0; f < floors; f++) {
    const fy = y0 + f * FH;
    G.box(tb.w + 0.02, 0.035, tb.d + 0.02, tb.x, fy, tb.z, frame, {
      ao: false
    });
    for (const side of ["F", "B", "L", "R"]) {
      const lit = r() < 0.65;
      [x, z, ry] = facePos(tb, side, 0, 0.003);
      _c.set(glass).multiplyScalar(0.92 + (f / floors) * 0.16);
      G.box(tb.w - 0.06, FH - 0.04, 0.012, x, fy + 0.037, z, _c.getHex(), {
        ry,
        ao: false,
        emi: lit ? (r() < 0.5 ? EMI_WIN : EMI_WIN2) : null
      });
      for (const u of [-0.13, 0, 0.13]) {
        [x, z] = facePos(tb, side, u, 0.013);
        G.box(0.012, FH - 0.04, 0.008, x, fy + 0.037, z, frame, {
          ry,
          ao: false
        });
      }
    }
  }
  for (const sx of [-1, 1])
    for (const sz of [-1, 1])
      G.box(
        0.04,
        H,
        0.04,
        tb.x + sx * (tb.w / 2 - 0.005),
        y0,
        tb.z + sz * (tb.d / 2 - 0.005),
        frame,
        { ao: false }
      );
  const top = y0 + H;
  G.box(tb.w + 0.04, 0.05, tb.d + 0.04, tb.x, top, tb.z, frame, { ao: false });
  G.box(
    tb.w,
    0.01,
    tb.d,
    tb.x,
    top + 0.05,
    tb.z,
    season === 3 ? SNOW : 0x6b7280,
    { ao: false }
  );
  if (r() < 0.5) {
    G.cyl(0.21, 0.21, 0.015, 20, tb.x, top + 0.06, tb.z, 0x374151, {
      ao: false
    });
    G.cyl(0.19, 0.19, 0.004, 20, tb.x, top + 0.075, tb.z, 0xfacc15, {
      ao: false
    });
    G.cyl(0.175, 0.175, 0.005, 20, tb.x, top + 0.077, tb.z, 0x374151, {
      ao: false
    });
    G.box(0.025, 0.004, 0.16, tb.x - 0.05, top + 0.082, tb.z, 0xffffff, {
      ao: false
    });
    G.box(0.025, 0.004, 0.16, tb.x + 0.05, top + 0.082, tb.z, 0xffffff, {
      ao: false
    });
    G.box(0.1, 0.004, 0.025, tb.x, top + 0.082, tb.z, 0xffffff, { ao: false });
  } else {
    G.box(0.22, 0.12, 0.18, tb.x - 0.08, top + 0.06, tb.z - 0.06, 0x9ca3af);
    G.box(0.1, 0.06, 0.1, tb.x + 0.14, top + 0.06, tb.z + 0.12, 0xd1d5db);
  }
  // アンテナ（赤く点滅）
  G.cyl(0.008, 0.012, 0.35, 5, tb.x + 0.2, top + 0.06, tb.z - 0.2, 0x9ca3af);
  const bl = new THREE.Mesh(unitSphere(0), matBlink);
  bl.userData.sharedGeo = true;
  bl.scale.setScalar(0.022);
  bl.position.set(tb.x + 0.2, top + 0.42, tb.z - 0.2);
  out.group.add(bl);
  const ph = r() * 2;
  out.anims.push((t) => {
    bl.visible = (t + ph) % 1.6 < 0.5;
  });
  // 植え込み
  const bc = BUSH[season];
  for (const s of [-1, 1]) {
    G.box(0.14, 0.06, 0.14, s * 0.38, 0.02, 0.38, 0x9ca3af);
    G.sphere(0.07, 0, s * 0.38, 0.11, 0.38, bc);
  }
}

/* ---------- 学校 ---------- */
function buildSchool(G, ctx, out) {
  const r = ctx.rnd,
    season = ctx.season;
  const walls = pick(r, [0xfef3c7, 0xf8fafc, 0xfde7c7]);
  // 校庭
  G.box(0.98, 0.016, 0.5, 0, 0, 0.24, season === 3 ? 0xeef2f7 : 0xd9b77e, {
    ao: false
  });
  G.box(0.5, 0.004, 0.012, 0.0, 0.016, 0.24, 0xffffff, { ao: false });
  G.cyl(0.08, 0.08, 0.004, 14, 0, 0.016, 0.24, 0xffffff, { ao: false });
  G.cyl(
    0.07,
    0.07,
    0.005,
    14,
    0,
    0.017,
    0.24,
    season === 3 ? 0xeef2f7 : 0xd9b77e,
    { ao: false }
  );
  for (const s of [-1, 1]) {
    const gx = s * 0.4;
    G.box(0.012, 0.09, 0.012, gx, 0.016, 0.16, 0xffffff, { ao: false });
    G.box(0.012, 0.09, 0.012, gx, 0.016, 0.32, 0xffffff, { ao: false });
    G.box(0.012, 0.012, 0.17, gx, 0.1, 0.24, 0xffffff, { ao: false });
  }
  // 校舎
  const b = { x: 0, z: -0.27, w: 0.92, d: 0.38 };
  G.box(b.w + 0.02, 0.04, b.d + 0.02, b.x, 0, b.z, 0x9ca3af);
  G.box(b.w, 0.68, b.d, b.x, 0.04, b.z, walls);
  for (let f = 0; f < 3; f++) {
    const fy = 0.08 + f * 0.21;
    G.box(b.w + 0.012, 0.02, b.d + 0.012, b.x, fy - 0.035, b.z, 0xcbd5e1, {
      ao: false
    });
    for (let i = 0; i < 6; i++) {
      const u = -0.38 + i * 0.152;
      if (Math.abs(u) < 0.12 && f < 2) continue;
      win(G, b, "F", u, fy, 0.1, 0.12, {
        lit: r() < 0.45,
        frame: 0xd1d5db,
        glass: 0x9cc9f0
      });
      win(G, b, "B", u, fy, 0.1, 0.12, {
        lit: r() < 0.4,
        frame: 0xd1d5db,
        glass: 0x9cc9f0
      });
    }
    win(G, b, "L", 0, fy, 0.12, 0.12, { lit: r() < 0.4, frame: 0xd1d5db });
    win(G, b, "R", 0, fy, 0.12, 0.12, { lit: r() < 0.4, frame: 0xd1d5db });
  }
  flatRoof(G, b, 0.72, 0x9ca3af, 0xe5e7eb, season, 0.04);
  for (let i = 0; i <= 12; i++)
    G.box(
      0.008,
      0.06,
      0.008,
      -0.45 + i * 0.075,
      0.79,
      b.z + b.d / 2 - 0.02,
      0x16a34a,
      { ao: false }
    );
  G.box(0.9, 0.008, 0.008, 0, 0.845, b.z + b.d / 2 - 0.02, 0x16a34a, {
    ao: false
  });
  // 玄関
  let [x, z, ry] = facePos(b, "F", 0, 0.006);
  G.box(0.18, 0.3, 0.014, x, 0.04, z, 0x334155, { ry, ao: false });
  [x, z] = facePos(b, "F", 0, 0.012);
  G.box(0.15, 0.26, 0.014, x, 0.04, z, 0xbfe3fb, {
    ry,
    emi: EMI_WIN2,
    ao: false
  });
  [x, z] = facePos(b, "F", 0, 0.07);
  G.box(0.26, 0.025, 0.14, x, 0.33, z, 0xe5e7eb, { ao: false });
  // 時計塔
  const tw = { x: 0, z: b.z + 0.02, w: 0.22, d: 0.2 };
  G.box(tw.w, 0.3, tw.d, tw.x, 0.72, tw.z, walls);
  G.box(tw.w + 0.02, 0.02, tw.d + 0.02, tw.x, 1.02, tw.z, 0xcbd5e1, {
    ao: false
  });
  hipRoof(
    G,
    tw.x,
    tw.z,
    1.04,
    tw.w + 0.06,
    tw.d + 0.06,
    0.16,
    0xb91c1c,
    season
  );
  const clock = new THREE.Mesh(
    new THREE.CircleGeometry(0.075, 24),
    clockMaterial()
  );
  const [cx, cz] = facePos(tw, "F", 0, 0.004);
  clock.position.set(cx, 0.87, cz);
  out.group.add(clock);
  const handMat =
    SIGN_MATS.__hand ||
    (SIGN_MATS.__hand = new THREE.MeshBasicMaterial({ color: 0x111827 }));
  const mkHand = (len, wd) => {
    const g = new THREE.PlaneGeometry(wd, len);
    g.translate(0, len / 2 - 0.008, 0);
    const m = new THREE.Mesh(g, handMat);
    m.position.set(cx, 0.87, cz + 0.004);
    out.group.add(m);
    return m;
  };
  const hh = mkHand(0.042, 0.011),
    mh = mkHand(0.06, 0.008);
  out.anims.push(() => {
    const gt = state.gameTime;
    mh.rotation.z = -((gt % 60) / 60) * Math.PI * 2;
    hh.rotation.z = -(((gt / 60) % 12) / 12) * Math.PI * 2;
  });
  // 看板（校門）
  G.box(0.03, 0.16, 0.03, -0.34, 0.016, 0.47, 0x9ca3af);
  G.box(0.03, 0.16, 0.03, -0.14, 0.016, 0.47, 0x9ca3af);
  const sb = { x: -0.24, z: 0.47, w: 0.22, d: 0.02 };
  G.box(0.22, 0.07, 0.02, sb.x, 0.11, sb.z, 0x14532d);
  addSign(out, sb, "F", 0, 0.145, "SCHOOL", "#14532d", "#ffffff", 0.055, {
    off: 0.003
  });
  // 旗
  G.cyl(0.008, 0.01, 0.62, 5, 0.42, 0.016, 0.45, 0xe5e7eb);
  const fg = new THREE.PlaneGeometry(0.15, 0.1);
  fg.translate(0.075, 0, 0);
  const flagMat =
    SIGN_MATS.__flag ||
    (SIGN_MATS.__flag = (() => {
      const c = document.createElement("canvas");
      c.width = 96;
      c.height = 64;
      const g = c.getContext("2d");
      g.fillStyle = "#ffffff";
      g.fillRect(0, 0, 96, 64);
      g.fillStyle = "#2563eb";
      g.beginPath();
      g.arc(48, 32, 18, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#facc15";
      g.beginPath();
      g.moveTo(48, 18);
      for (let i = 1; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5,
          rr = i % 2 ? 7 : 15;
        g.lineTo(48 + Math.cos(a) * rr, 32 + Math.sin(a) * rr);
      }
      g.fill();
      return new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(c),
        side: THREE.DoubleSide
      });
    })());
  const flag = new THREE.Mesh(fg, flagMat);
  flag.position.set(0.42, 0.57, 0.45);
  out.group.add(flag);
  out.anims.push((t) => {
    flag.rotation.y = Math.sin(t * 2.6) * 0.35 - 0.3;
    flag.scale.x = 0.92 + Math.sin(t * 5.3) * 0.08;
  });
  // 桜の木
  smallTree(G, 0.42, 0.04, 1.1, season, r);
  smallTree(G, -0.43, 0.04, 1.1, season, r);
}

/* ---------- 病院 ---------- */
function buildHospital(G, ctx, out) {
  const r = ctx.rnd,
    season = ctx.season;
  G.box(0.98, 0.02, 0.98, 0, 0, 0, 0xe5e7eb, { ao: false });
  const b = { x: -0.02, z: -0.12, w: 0.8, d: 0.6 };
  G.box(b.w + 0.02, 0.04, b.d + 0.02, b.x, 0.02, b.z, 0x94a3b8);
  G.box(b.w, 0.9, b.d, b.x, 0.06, b.z, 0xf8fafc);
  // 縦の青緑ライン
  for (const s of [-1, 1]) {
    const [x, z, ry] = facePos(b, "F", s * 0.2, 0.004);
    G.box(0.03, 0.9, 0.012, x, 0.06, z, 0x14b8a6, { ry, ao: false });
  }
  for (let f = 0; f < 4; f++) {
    const fy = 0.11 + f * 0.2;
    for (const u of [-0.32, -0.1, 0.1, 0.32]) {
      if (f === 0 && Math.abs(u) < 0.2) continue;
      if (f >= 2 && Math.abs(u) < 0.2) continue;
      win(G, b, "F", u, fy, 0.11, 0.12, {
        lit: r() < 0.65,
        frame: 0xccfbf1,
        glass: 0xa5f3fc,
        emi: EMI_WIN2
      });
    }
    for (const u of [-0.32, -0.1, 0.1, 0.32])
      win(G, b, "B", u, fy, 0.11, 0.12, {
        lit: r() < 0.6,
        frame: 0xccfbf1,
        glass: 0xa5f3fc,
        emi: EMI_WIN2
      });
    for (const u of [-0.15, 0.15]) {
      win(G, b, "L", u, fy, 0.11, 0.12, {
        lit: r() < 0.6,
        frame: 0xccfbf1,
        glass: 0xa5f3fc,
        emi: EMI_WIN2
      });
      win(G, b, "R", u, fy, 0.11, 0.12, {
        lit: r() < 0.6,
        frame: 0xccfbf1,
        glass: 0xa5f3fc,
        emi: EMI_WIN2
      });
    }
  }
  flatRoof(G, b, 0.96, 0xa3aab5, 0xe2e8f0, season, 0.05);
  // 赤十字（夜は光る）
  let [x, z, ry] = facePos(b, "F", 0, 0.006);
  G.box(0.22, 0.22, 0.016, x, 0.53, z, 0xffffff, { ry, ao: false });
  [x, z] = facePos(b, "F", 0, 0.014);
  G.box(0.06, 0.17, 0.014, x, 0.555, z, 0xdc2626, {
    ry,
    ao: false,
    emi: [1.5, 0.12, 0.12]
  });
  G.box(0.17, 0.06, 0.014, x, 0.61, z, 0xdc2626, {
    ry,
    ao: false,
    emi: [1.5, 0.12, 0.12]
  });
  // 入口・ひさし
  [x, z] = facePos(b, "F", 0, 0.006);
  G.box(0.28, 0.22, 0.012, x, 0.06, z, 0xbfe3fb, {
    ry,
    emi: EMI_WIN2,
    ao: false
  });
  [x, z] = facePos(b, "F", 0, 0.11);
  G.box(0.4, 0.03, 0.22, x, 0.3, z, 0x0f766e, { ao: false });
  for (const s of [-1, 1]) {
    [x, z] = facePos(b, "F", s * 0.18, 0.2);
    G.box(0.022, 0.28, 0.022, x, 0.02, z, 0xe5e7eb);
  }
  addSign(out, b, "F", 0, 0.36, "HOSPITAL", "#0f766e", "#ffffff", 0.06, {
    off: 0.222,
    icon: "cross"
  });
  // 屋上ヘリポート
  G.cyl(0.2, 0.2, 0.012, 20, b.x, 0.99, b.z, 0x475569, { ao: false });
  G.cyl(0.18, 0.18, 0.004, 20, b.x, 1.002, b.z, 0xffffff, { ao: false });
  G.cyl(0.165, 0.165, 0.005, 20, b.x, 1.004, b.z, 0x475569, { ao: false });
  G.box(0.022, 0.004, 0.14, b.x - 0.045, 1.008, b.z, 0xffffff, { ao: false });
  G.box(0.022, 0.004, 0.14, b.x + 0.045, 1.008, b.z, 0xffffff, { ao: false });
  G.box(0.09, 0.004, 0.022, b.x, 1.008, b.z, 0xffffff, { ao: false });
  // 救急車
  const ax = 0.33,
    az = 0.36;
  G.box(0.17, 0.13, 0.3, ax, 0.035, az, 0xffffff);
  G.box(0.172, 0.025, 0.302, ax, 0.09, az, 0xdc2626, { ao: false });
  G.box(0.15, 0.06, 0.05, ax, 0.09, az + 0.15, 0x1f2d3d, { ao: false });
  G.box(0.05, 0.022, 0.03, ax - 0.03, 0.165, az + 0.06, 0xef4444, {
    emi: [1.5, 0.1, 0.1],
    ao: false
  });
  G.box(0.05, 0.022, 0.03, ax + 0.03, 0.165, az + 0.06, 0x3b82f6, {
    emi: [0.1, 0.4, 1.6],
    ao: false
  });
  for (const sx of [-1, 1])
    for (const sz of [-1, 1])
      G.cyl(
        0.035,
        0.035,
        0.026,
        8,
        ax + sx * 0.085,
        0.035 - 0.013,
        az + sz * 0.1,
        0x111827,
        { rz: Math.PI / 2, ao: false }
      );
  // 植え込み
  const bc = BUSH[season];
  G.box(0.2, 0.06, 0.08, -0.33, 0.02, 0.36, bc);
  G.sphere(0.05, 0, -0.42, 0.08, 0.42, bc);
}

const BUILDERS = {
  road: buildRoad,
  water: buildWater,
  grass: buildFlowerBed,
  tree: buildTree,
  park: buildPark,
  house1: buildHouse1,
  house2: buildHouse2,
  shop: buildShop,
  cafe: buildCafe,
  office: buildOffice,
  school: buildSchool,
  hospital: buildHospital
};

/* --- 起動 --- */
if (document.readyState === "loading")
  window.addEventListener("DOMContentLoaded", boot);
else boot();