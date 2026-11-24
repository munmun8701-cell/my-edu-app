// 中3の単語 データ1：単元1〜10（各10語）
const STAGES = [
{g:"社会・世界", name:"国際社会", words:[
  {en:"global", ja:"地球規模の", ex:"Climate change is a global problem."},
  {en:"nation", ja:"国家", ex:"Many nations joined the meeting."},
  {en:"citizen", ja:"市民", ex:"Every citizen has the right to vote."},
  {en:"leader", ja:"指導者", ex:"He is a leader who everyone trusts."},
  {en:"president", ja:"大統領", ex:"The president gave a speech on TV."},
  {en:"population", ja:"人口", ex:"The population of Japan is getting smaller."},
  {en:"economy", ja:"経済", ex:"Tourism is important for the local economy."},
  {en:"industry", ja:"産業", ex:"The car industry is big in Aichi."},
  {en:"trade", ja:"貿易", ex:"Japan has trade with many countries."},
  {en:"develop", ja:"発展させる", ex:"The country has developed quickly."}
]},
{g:"社会・世界", name:"平和と人権", words:[
  {en:"human", ja:"人間", ex:"All humans should be treated equally."},
  {en:"rights", ja:"権利", ex:"Children have the rights to learn and play."},
  {en:"freedom", ja:"自由", ex:"Freedom of speech is important."},
  {en:"equal", ja:"平等な", ex:"All people are born equal."},
  {en:"fair", ja:"公平な", ex:"The rule is not fair."},
  {en:"discrimination", ja:"差別", ex:"We must stop discrimination."},
  {en:"refugee", ja:"難民", ex:"Many refugees left their country because of the war."},
  {en:"hunger", ja:"飢え", ex:"Many children suffer from hunger."},
  {en:"poverty", ja:"貧困", ex:"Poverty is one of the world's biggest problems."},
  {en:"survive", ja:"生き残る", ex:"The animals survived the cold winter."}
]},
{g:"社会・世界", name:"環境問題", words:[
  {en:"climate", ja:"気候", ex:"The climate of this area is mild."},
  {en:"global warming", ja:"地球温暖化", ex:"Global warming is making the sea level rise."},
  {en:"carbon dioxide", ja:"二酸化炭素", ex:"Cars produce carbon dioxide."},
  {en:"resource", ja:"資源", ex:"Japan has few natural resources."},
  {en:"reduce", ja:"減らす", ex:"We should reduce plastic waste."},
  {en:"reuse", ja:"再利用する", ex:"I reuse paper bags."},
  {en:"electricity", ja:"電気", ex:"Turn off the lights to save electricity."},
  {en:"solar", ja:"太陽の", ex:"Solar energy is clean."},
  {en:"sustainable", ja:"持続可能な", ex:"We need a sustainable society."},
  {en:"species", ja:"（生物の）種", ex:"Many species are in danger."}
]},
{g:"社会・世界", name:"技術・未来", words:[
  {en:"AI", ja:"人工知能", ex:"AI is used in many smartphones."},
  {en:"device", ja:"装置", ex:"This device can translate languages."},
  {en:"data", ja:"データ", ex:"We collected data about our town."},
  {en:"program", ja:"プログラム", ex:"He wrote a computer program."},
  {en:"digital", ja:"デジタルの", ex:"I use a digital camera."},
  {en:"system", ja:"仕組み", ex:"The new system is easy to use."},
  {en:"improve", ja:"改善する", ex:"I want to improve my English."},
  {en:"invent", ja:"発明する", ex:"Who invented the telephone?"},
  {en:"create", ja:"創造する", ex:"Let's create something new."},
  {en:"battery", ja:"電池", ex:"The battery of my phone is dead."}
]},
{g:"社会・世界", name:"経済・仕事", words:[
  {en:"company", ja:"会社", ex:"My father works for a car company."},
  {en:"business", ja:"商売", ex:"His business is going well."},
  {en:"product", ja:"製品", ex:"This product was made in Japan."},
  {en:"customer", ja:"客（買い物の）", ex:"The shop has many customers."},
  {en:"service", ja:"サービス", ex:"The service at this hotel is good."},
  {en:"staff", ja:"職員", ex:"The staff were very kind."},
  {en:"salary", ja:"給料", ex:"He gets a good salary."},
  {en:"job", ja:"仕事", ex:"What kind of job do you want to do?"},
  {en:"career", ja:"職業経歴", ex:"She started her career as a nurse."},
  {en:"interview", ja:"面接", ex:"I had an interview for high school."}
]},
{g:"社会・世界", name:"政治・ルール", words:[
  {en:"vote", ja:"投票する", ex:"People over eighteen can vote in Japan."},
  {en:"election", ja:"選挙", ex:"The election will be held next month."},
  {en:"decision", ja:"決定", ex:"It was a difficult decision."},
  {en:"opinion", ja:"意見", ex:"What is your opinion?"},
  {en:"discuss", ja:"話し合う", ex:"We discussed the problem in class."},
  {en:"debate", ja:"討論", ex:"We had a debate about school uniforms."},
  {en:"mayor", ja:"市長", ex:"The mayor visited our school."},
  {en:"council", ja:"議会", ex:"The student council made a new rule."},
  {en:"official", ja:"公式の", ex:"English is an official language in India."},
  {en:"public", ja:"公共の", ex:"Don't make noise in public places."}
]},
{g:"社会・世界", name:"医療・福祉", words:[
  {en:"patient", ja:"患者", ex:"The doctor is talking with a patient."},
  {en:"disease", ja:"病気", ex:"This disease can be cured."},
  {en:"treatment", ja:"治療", ex:"She is getting treatment at the hospital."},
  {en:"blood", ja:"血", ex:"Blood is red."},
  {en:"wheelchair", ja:"車いす", ex:"This building is easy to use for people in wheelchairs."},
  {en:"disability", ja:"障害", ex:"People with disabilities should have the same chances."},
  {en:"elderly", ja:"高齢の", ex:"We visited elderly people in the nursing home."},
  {en:"welfare", ja:"福祉", ex:"She wants to work in welfare."},
  {en:"medical", ja:"医療の", ex:"Medical technology has improved a lot."},
  {en:"cure", ja:"治す", ex:"The doctor cured his illness."}
]},
{g:"社会・世界", name:"歴史・伝統", words:[
  {en:"ancient", ja:"古代の", ex:"We learned about ancient Egypt."},
  {en:"period", ja:"時代", ex:"This castle was built in the Edo period."},
  {en:"emperor", ja:"天皇", ex:"The emperor lived in Kyoto long ago."},
  {en:"king", ja:"王", ex:"The king was loved by his people."},
  {en:"queen", ja:"女王", ex:"The queen visited Japan."},
  {en:"prince", ja:"王子", ex:"The prince married a princess."},
  {en:"princess", ja:"王女", ex:"The story is about a brave princess."},
  {en:"palace", ja:"宮殿", ex:"The palace is open to the public."},
  {en:"statue", ja:"像", ex:"The Statue of Liberty is in New York."},
  {en:"heritage", ja:"遺産", ex:"Mt. Fuji is a World Heritage Site."}
]},
{g:"動詞・熟語", name:"伝え合う動詞", words:[
  {en:"describe", ja:"描写する", ex:"Can you describe the picture?"},
  {en:"express", ja:"表現する", ex:"It is hard to express my feelings in English."},
  {en:"communicate", ja:"意思を伝え合う", ex:"We can communicate with people around the world."},
  {en:"translate", ja:"翻訳する", ex:"This book has been translated into many languages."},
  {en:"inform", ja:"知らせる", ex:"Please inform us of the result."},
  {en:"suggest", ja:"提案する", ex:"I suggested a new idea."},
  {en:"mention", ja:"言及する", ex:"He didn't mention the problem."},
  {en:"repeat", ja:"繰り返す", ex:"Please repeat after me."},
  {en:"whisper", ja:"ささやく", ex:"She whispered something to me."},
  {en:"announce", ja:"発表する", ex:"The winner was announced yesterday."}
]},
{g:"動詞・熟語", name:"考える動詞", words:[
  {en:"consider", ja:"よく考える", ex:"Please consider my idea."},
  {en:"realize", ja:"はっきりわかる", ex:"I realized that I was wrong."},
  {en:"notice", ja:"気づく", ex:"Did you notice the change?"},
  {en:"recognize", ja:"見分ける", ex:"I couldn't recognize him at first."},
  {en:"compare", ja:"比べる", ex:"Compare these two pictures."},
  {en:"solve", ja:"解く", ex:"I solved the math problem."},
  {en:"judge", ja:"判断する", ex:"Don't judge people by their looks."},
  {en:"doubt", ja:"疑う", ex:"I don't doubt your words."},
  {en:"expect", ja:"予期する", ex:"I didn't expect to see you here."},
  {en:"suppose", ja:"（〜だろうと）思う", ex:"I suppose he is right."}
]}
];
