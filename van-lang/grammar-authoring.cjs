/* Centre-authored applications of the twelve linked Resources theory documents. */
const rules=[
[['Information questions','Where + be + S + from? / What nationality + be + S?','Phân biệt nơi xuất thân, nơi ở và quốc tịch.','Where is Mai from? — She is from Vietnam.','Mai đến từ đâu? — Bạn ấy đến từ Việt Nam.'],['Time prepositions','at + time / on + day / in + month or year','Chọn giới từ theo đơn vị thời gian.','Our club meets on Monday at six.','Câu lạc bộ gặp nhau vào thứ Hai lúc sáu giờ.'],['Question words','How many + plural noun / How much + uncountable noun','Đếm số lượng dùng how many; lượng không đếm được hoặc giá dùng how much.','How many notebooks do you need?','Bạn cần bao nhiêu quyển vở?']],
[['Present simple','I/You/We/They + V / He/She/It + V-s/es','Diễn tả thói quen hoặc sự thật.','Lan walks to school every day.','Lan đi bộ đến trường mỗi ngày.'],['Questions and negatives','Do/Does + S + V? / S + do not/does not + V','Sau do/does dùng động từ nguyên mẫu.','Does Nam study science on Tuesday?','Nam có học khoa học vào thứ Ba không?'],['Preferences','like/enjoy + V-ing / be interested in + noun or V-ing','Nói về sở thích; không bỏ giới từ in.','We are interested in making models.','Chúng tôi thích làm mô hình.']],
[['Likes and ability','enjoy + V-ing / can + V','Sau enjoy dùng V-ing; sau can dùng nguyên mẫu.','Mai can swim, and she enjoys swimming.','Mai biết bơi và thích bơi.'],['Suggestions','Let’s + V / What about + V-ing? / Would you like to + V?','Chọn dạng động từ theo mẫu lời mời.','What about playing chess after class?','Sau giờ học chơi cờ vua nhé?'],['Agreement','So + auxiliary + S / Neither + auxiliary + S','So đồng tình khẳng định; neither đồng tình phủ định, không thêm not.','I do not like noisy games. — Neither do I.','Tôi không thích trò ồn ào. — Tôi cũng không.']],
[['Existence and possession','There is + singular / There are + plural / S + has','There is/are giới thiệu sự tồn tại; has diễn tả sở hữu.','There are two windows in our room.','Phòng chúng tôi có hai cửa sổ.'],['Owners and position','Whose + noun? / belong to + owner / between A and B','Whose hỏi người sở hữu; between cần hai mốc.','Whose bag is this? — It belongs to Mai.','Túi này của ai? — Của Mai.'],['Exclamations and adjectives','What + a/an + adjective + singular noun!','Tính chất/kích cỡ thường đứng trước màu sắc và chất liệu.','What a beautiful old wooden chair!','Chiếc ghế gỗ cũ thật đẹp!']],
[['Quantifiers','many/a few + plural countable noun / much/a little + uncountable noun','Phân biệt danh từ đếm được và không đếm được.','We have a few apples and a little milk.','Chúng ta có vài quả táo và một ít sữa.'],['Some and lots of','some / a lot of + countable or uncountable noun','Some thường dùng trong câu khẳng định và lời mời.','Would you like some orange juice?','Bạn muốn một ít nước cam không?'],['Prices','How much + be + noun? / How much + do/does + noun + cost?','Sau does dùng cost, không dùng costs.','How much does this jacket cost?','Chiếc áo khoác này giá bao nhiêu?']],
[['Advice and ability','should/should not + V / can + V','Should đưa lời khuyên; can nói khả năng.','You should tell an adult if you feel ill.','Bạn nên báo người lớn nếu thấy mệt.'],['Obligation','have to/has to + V','Diễn tả việc bắt buộc theo nội quy hoặc hoàn cảnh.','We have to arrive before the school bus leaves.','Chúng tôi phải đến trước khi xe buýt trường rời đi.'],['Safety instructions','Do not + V / It is a good idea to + V','Mệnh lệnh ngăn cấm dùng do not và nguyên mẫu.','Do not touch an unfamiliar animal.','Đừng chạm vào một con vật lạ.']],
[['Travel time','It takes + person + time + to V','Sau takes và khoảng thời gian dùng to V.','It takes me ten minutes to walk to school.','Tôi mất mười phút đi bộ đến trường.'],['Time spent','S + spend(s) + time + V-ing','Sau spend và khoảng thời gian dùng V-ing.','We spend twenty minutes cycling to the park.','Chúng tôi dành hai mươi phút đạp xe đến công viên.'],['Directions','Go/Turn + direction / A and B / A or B','And nối các bước; or đưa ra lựa chọn.','Go straight and turn left at the library.','Đi thẳng rồi rẽ trái ở thư viện.']],
[['Future decisions','S + will/will not + V','Dùng cho quyết định lúc nói, lời hứa hoặc dự đoán.','I will help you carry those books.','Tôi sẽ giúp bạn mang những quyển sách đó.'],['Plans','S + am/is/are + going to + V','Dùng cho kế hoạch đã định trước.','We are going to visit Hue next month.','Chúng tôi dự định thăm Huế tháng tới.'],['Logical connectors','but = contrast / or = choice or warning / because = reason','Đọc quan hệ giữa hai ý trước khi chọn liên từ.','We stayed indoors because the storm was strong.','Chúng tôi ở trong nhà vì bão mạnh.']],
[['Present continuous','S + am/is/are + V-ing','Hành động đang diễn ra; cần cả be và V-ing.','Look! The children are feeding the rabbits.','Nhìn kìa! Các em đang cho thỏ ăn.'],['Comparatives','short adjective + -er + than / more + long adjective + than','So sánh hai người hoặc vật; không dùng more cùng đuôi -er.','This turtle is smaller than that one.','Con rùa này nhỏ hơn con kia.']],
[['Past simple','S + V-ed/irregular past / did not + V','Diễn tả sự việc đã kết thúc trong quá khứ.','We visited the museum yesterday.','Chúng tôi đã thăm bảo tàng hôm qua.'],['Past be and questions','was/were / Did + S + V?','Sau did dùng nguyên mẫu; we/you/they đi với were.','Were the pupils at the campsite last night?','Tối qua học sinh có ở khu cắm trại không?'],['Past endings','/t/: watched / /d/: played / /ɪd/: wanted','Phân loại theo âm cuối trước -ed; /t/ và /d/ thêm một âm tiết /ɪd/.','We wanted to play, so we finished our work first.','Chúng tôi muốn chơi nên đã làm xong việc trước.']],
[['Wishes','would like to + V / want to + V','Would like lịch sự hơn want; cả hai có to trước động từ.','I would like to become an engineer.','Tôi muốn trở thành kỹ sư.'],['Future intentions','plan to + V / be going to + V','Phân biệt plan to và be going to, không trộn hai mẫu.','Lan plans to design safer houses.','Lan dự định thiết kế những ngôi nhà an toàn hơn.']],
[['Nouns','article/determiner + (adjective) + noun','Danh từ gọi tên người, vật hoặc sự việc.','The waterfall is a popular tourist attraction.','Thác nước là một điểm du lịch nổi tiếng.'],['Adjectives and adverbs','adjective + noun / verb + adverb','Tính từ bổ nghĩa danh từ; trạng từ bổ nghĩa cách hành động.','The guide speaks clearly about this attractive city.','Hướng dẫn viên nói rõ ràng về thành phố hấp dẫn này.'],['Verbs','subject + verb','Chủ ngữ số ít thường dùng V-s ở hiện tại đơn.','The show attracts many visitors.','Buổi biểu diễn thu hút nhiều du khách.']]
];
// Each row: complete context with gap | correct answer | three distractors | concise reasoning.
const rows=[
`Mai has moved from Hue to Hanoi. Her new teacher asks, "___ do you live now?"|Where|When/Who/Why|Live hỏi nơi đang ở, nên dùng Where; Hue là nơi trước đây.
The new pupil is from Japan. "What ___ are you?" asks Ben.|nationality|address/hometown/name|Nationality hỏi quốc tịch; address là địa chỉ và hometown là quê hương.
The art club starts ___ 4:30 p.m. Please arrive before it begins.|at|on/in/by|At đi với giờ cụ thể. On đi với ngày, in đi với tháng hoặc năm.
We visit the library ___ Saturdays after breakfast.|on|at/in/to|Saturdays là ngày trong tuần nên dùng on.
Our new school year begins ___ September, after the summer holiday.|in|on/at/of|In đi với tháng September.
The ticket is twelve thousand dong. "___ is one ticket?" asks Mai.|How much|How many/How often/How long|How much hỏi giá tiền; how many hỏi số lượng vật đếm được.
Lan needs three notebooks. "___ notebooks do you need?" asks the shopkeeper.|How many|How much/How old/How often|Notebooks là danh từ đếm được số nhiều nên dùng How many.
The bus journey takes twenty minutes. "___ does the journey take?"|How long|How far/Whose/Who|How long hỏi khoảng thời gian; câu trả lời là twenty minutes.
Nam practises the piano every evening. "___ do you practise?" asks his friend.|How often|How old/How much/Whose|Every evening diễn tả tần suất, phù hợp How often.
The notebook has Lan's name on it. "___ notebook is this?"|Whose|Who/Where/When|Whose hỏi sự sở hữu và đứng trước notebook.
Two colours are available. "___ do you prefer, red or blue?"|Which|Who/When/Whose|Which dùng khi chọn trong các phương án đã nêu.
Lan missed the bus because she got up late. "___ were you late?"|Why|Whose/How many/Where|Why hỏi nguyên nhân; câu trả lời có because.`,
`Lan ___ to school every morning because her house is nearby.|walks|walk/walking/is walk|Lan là chủ ngữ số ít; every morning chỉ thói quen nên walks.
My classmates ___ science on Tuesdays and Thursdays.|study|studies/studying/is study|My classmates số nhiều, hiện tại đơn dùng study nguyên mẫu.
The sun ___ in the east, even when clouds hide it.|rises|rise/rising/is rise|Sự thật hiển nhiên dùng hiện tại đơn; the sun số ít nên rises.
Our teacher ___ not set homework on the first day of the holiday.|does|do/is/has|Teacher số ít nên dùng does not; set giữ nguyên.
___ your brother enjoy making models after school?|Does|Do/Is/Has|Câu hỏi hiện tại đơn có động từ enjoy dùng Does với your brother.
Nam does not ___ television before he finishes his homework.|watch|watches/watching/watched|Sau does not dùng động từ nguyên mẫu watch.
I am interested ___ learning about animals in science lessons.|in|on/at/to|Cụm cố định be interested in; sau in có thể dùng V-ing.
Mai likes ___ stories to her little sister at bedtime.|reading|read/reads/to reading|Sau likes có thể dùng V-ing; reading đúng trong bốn lựa chọn này.
My favourite ___ is history because I enjoy learning about the past.|subject|nationality/address/facility|History là một môn học; subject phù hợp nghĩa và cấu trúc.
Our classroom ___ bright and tidy every morning.|is|are/be/am|Our classroom số ít; to be hiện tại là is.
"Thanks for helping me find the library." "___."|You are welcome|Good luck/What a pity/See you tomorrow|You are welcome đáp lại lời cảm ơn; các câu còn lại không đáp đúng ý.
Our music lesson ___ at nine every Friday, according to the timetable.|starts|start/starting/is start|Timetable nói lịch thường lệ; lesson số ít nên starts.`,
`After finishing her homework, Mai enjoys ___ the guitar.|playing|play/plays/to play|Sau enjoy bắt buộc dùng V-ing: enjoys playing.
Nam can ___ across the pool, but he still follows the safety rules.|swim|swims/swimming/to swim|Sau động từ khuyết thiếu can dùng nguyên mẫu swim.
We are keen ___ collecting old stamps from different countries.|on|in/at/for|Kết hợp cố định be keen on + V-ing.
The weather is pleasant. Let's ___ for a walk after lunch.|go|going/goes/to go|Let's đi với động từ nguyên mẫu go.
We have a free afternoon. What about ___ badminton in the park?|playing|play/to play/plays|What about đi với V-ing, nên playing.
Would you like ___ the chess club with us next week?|to join|joining/join/joins|Would you like to + V là mẫu lời mời lịch sự.
Why don't we ___ photos of the flowers instead of picking them?|take|taking/to take/takes|Sau Why don't we dùng nguyên mẫu take.
"I like quiet board games." "So ___ I."|do|am/does/can|Like là động từ hiện tại đơn; I dùng trợ động từ do.
"I don't enjoy noisy games." "Neither ___ I."|do|don't/am/does|Neither đã mang nghĩa phủ định, nên dùng do, không dùng don't.
"I can play the piano." "So ___ I."|can|do/am/does|Đồng tình với can phải giữ đúng trợ động từ can.
"I don't like swimming in cold water." "I don't, ___."|either|too/so/neither|Either đứng cuối câu phủ định; too dùng cho câu khẳng định.
"I enjoy making models." "I do, ___."|too|either/neither/so|Too đứng cuối câu đồng tình khẳng định.`,
`There ___ two windows in our classroom, so it is bright.|are|is/has/am|Two windows số nhiều nên dùng there are.
There ___ a clean towel beside the sink.|is|are/have/be|A clean towel số ít nên dùng there is.
This room ___ a desk near the window, where Lan does her homework.|has|have/is/are|This room là chủ ngữ số ít; has diễn tả sở hữu.
The library is ___ the bank and the museum on this map.|between|under/behind/above|Giữa hai mốc có and dùng between A and B.
"Whose bag is this?" "It belongs ___ Mai."|to|for/at/with|Belong to là kết hợp cố định chỉ sở hữu.
___ a beautiful house your grandparents have!|What|How/Where/Whose|What + a + adjective + singular noun là câu cảm thán.
___ peaceful this village is in the early morning!|How|What/Who/When|How + adjective + S + be, không có danh từ ngay sau peaceful.
The puppy is sleeping ___ the table, beneath its wooden top.|under|above/between/opposite|Beneath diễn đạt vị trí phía dưới, tương ứng under.
Choose the natural phrase for a chair made of wood.|a beautiful old wooden chair|a wooden beautiful old chair/an old wooden beautiful chair/a chair wooden beautiful old|Opinion beautiful đứng trước age old, rồi material wooden.
The picture hangs ___ the sofa, higher on the same wall.|above|under/between/inside|Higher trên cùng bức tường chỉ vị trí above.
"___ is the owner of this house?" "My uncle is."|Who|Whose/Where/How|Who hỏi người làm chủ; sau Whose cần danh từ hoặc cấu trúc sở hữu khác.
There ___ any chairs in the empty room, so we must bring some.|are not|is not/does not/has not|Chairs số nhiều dùng are not trong there are not.`,
`We need ___ apples for the fruit salad; four will be enough.|a few|a little/much/a bit|Apples đếm được số nhiều; a few chỉ một vài.
There is ___ milk left in the jug, enough for one cup.|a little|a few/many/several|Milk không đếm được nên dùng a little.
How ___ water should we bring for the walk?|much|many/few/several|Water là danh từ không đếm được, dùng How much.
How ___ eggs do we need to make the cake?|many|much/little/any|Eggs đếm được số nhiều, dùng How many.
Would you like ___ juice while you wait for lunch?|some|many/a few/an|Some tự nhiên trong lời mời với juice không đếm được.
The shop has ___ fresh bread, so everyone can buy a loaf.|a lot of|many/a few/an|A lot of dùng được với bread không đếm được.
How much does this school bag ___?|cost|costs/costing/to cost|Sau trợ động từ does, động từ chính giữ nguyên cost.
How much ___ these two notebooks together?|are|is/does/has|These two notebooks số nhiều; hỏi giá dùng How much are.
What is the ___ of this blue jacket?|price|costs/much/many|The price of + đồ vật là cấu trúc hỏi mức giá.
Lan buys a ___ of bread to share with her family.|loaf|bottle/bowl/cup|Danh từ đơn vị phù hợp với bread là loaf.
We do not have ___ time before the bus leaves, so let's finish eating.|much|many/a few/several|Time không đếm được; phủ định dùng much tự nhiên.
There are only ___ clean plates, but they are enough for our small group.|a few|a little/much/a loaf|Plates đếm được số nhiều; a few là một vài và đủ dùng.`,
`Your friend has a high temperature. You ___ tell an adult.|should|shouldn't/mustn't/can't|Should đưa lời khuyên an toàn: báo người lớn khi sốt cao.
You should not ___ an unfamiliar dog in the street.|touch|touches/touching/to touch|Sau should not dùng nguyên mẫu touch.
The school bus leaves at seven. We ___ arrive before then.|have to|has to/having to/are have to|We đi với have to; đây là yêu cầu bắt buộc vì giờ xe chạy.
Mai ___ wear a helmet when she rides her bike, according to the school rules.|has to|have to/having to/is have to|Mai số ít nên has to, rồi động từ nguyên mẫu wear.
___ run across the road when the light is red.|Don't|Doesn't/Not/No|Mệnh lệnh ngăn cấm dùng Don't + V.
It is a good idea ___ water after exercising.|to drink|drinking/drink/drinks|It is a good idea to + động từ nguyên mẫu.
You should ___ your hands before eating to keep them clean.|wash|washes/washing/washed|Sau should dùng nguyên mẫu wash.
"What is the matter ___ you?" "I have a headache."|with|on/for/at|Mẫu hỏi sức khỏe: What is the matter with you?
My sister can ___ a bike, but she does not ride on busy roads.|ride|rides/riding/to ride|Sau can dùng nguyên mẫu; cả câu vẫn thể hiện kỹ năng an toàn.
It is wrong of you ___ rubbish into the stream.|to throw|throwing/throw/throws|It is wrong of somebody to + V đánh giá hành vi không đúng.
When you have a toothache, you should visit a ___.|dentist|pilot/farmer/chef|Dentist là nha sĩ, người giúp xử lý vấn đề răng.
The medicine is for adults only. Children ___ take it without an adult's advice.|should not|should/can/have to|Nhãn thuốc chỉ cho người lớn; lời khuyên an toàn là should not.`,
`It takes Mai fifteen minutes ___ to school from home.|to walk|walking/walk/walks|It takes + người + thời gian + to V.
Mai spends fifteen minutes ___ to school every morning.|walking|to walk/walk/walks|Spend + khoảng thời gian + V-ing.
"How ___ does it take to reach the museum?" "About ten minutes."|long|many/much/old|How long hỏi khoảng thời gian; ten minutes là khoảng thời gian.
Go straight ___ turn left at the library; both steps are necessary.|and|or/because/but|And nối hai bước liên tiếp cùng phải thực hiện.
You can travel by bus ___ by train; choose whichever suits you.|or|and/because/so|Or đưa ra hai phương tiện để lựa chọn.
The hotel is between the bank ___ the bookshop.|and|or/to/with|Cấu trúc cố định between A and B.
"How do you go to school?" "I usually go ___ bike."|by|on/in/at|By bike nói về phương tiện, không có mạo từ giữa by và bike.
The map says, "___ right at the cinema, then cross at the lights."|Turn|Turns/Turning/To turning|Mệnh lệnh chỉ đường dùng động từ nguyên mẫu Turn.
It ___ us twenty minutes to get to the swimming pool.|takes|take/taking/spend|It là chủ ngữ số ít của mẫu It takes somebody time to V.
My parents spend half an hour ___ to work each day.|driving|to drive/drive/drives|Spend + time + V-ing, nên driving.
"___ is the museum?" "It is opposite the bank."|Where|When/Who/Why|Opposite the bank là vị trí nên dùng Where.
The bus stop is next ___ the library entrance.|to|at/with/from|Cụm giới từ cố định next to.`,
`"Those books look heavy." "I ___ help you carry them."|will|am/am going/was|Quyết định giúp ngay lúc nói dùng will + V.
We have bought the tickets. We ___ going to visit Hue next week.|are|is/am/will|We dùng are trong mẫu be going to + V; có kế hoạch trước.
Lan ___ going to decorate the classroom tomorrow; she has already bought paper.|is|are/am/will|Lan số ít nên is going to; kế hoạch đã chuẩn bị.
I promise I ___ return your book tomorrow.|will|am/am going/was|Lời hứa dùng will + động từ nguyên mẫu return.
We stayed indoors ___ the storm made the roads dangerous.|because|but/or/and|Vế sau giải thích lý do, dùng because.
The puppy is small, ___ it can run very fast.|but|because/or/so|Hai ý trái với điều thường dự đoán, dùng but.
Hurry up, ___ you will miss the school bus.|or|because/and/but|Or trong mệnh lệnh có nghĩa nếu không thì.
Would you like water ___ milk? Please choose one.|or|and/because/so|Câu yêu cầu chọn một trong hai đồ uống, dùng or.
What ___ the weather be like tomorrow?|will|is/does/has|Dạng câu hỏi tương lai: What will the weather be like?
We are going to ___ lanterns for the festival after lunch.|make|making/makes/made|Sau going to dùng nguyên mẫu make.
"I think the weather ___ be sunny tomorrow," says Mai.|will|is/does/has|Dự đoán có I think dùng will be.
Because the path was wet, we ___ carefully instead of running.|walked|ran/rushed/hurried|Quan hệ nguyên nhân cho thấy đi cẩn thận là hợp lý; ba từ còn lại đều đi nhanh.`,
`Look! The children ___ feeding the rabbits at the moment.|are|is/do/was|Children số nhiều; hành động đang diễn ra dùng are + V-ing.
Listen! The little bird is ___ near the open window.|singing|sing/sings/sang|Hiện tại tiếp diễn cần be + V-ing, nên is singing.
The zookeeper ___ cleaning the elephant's pool right now.|is|are/does/do|The zookeeper số ít nên is cleaning.
This turtle is ___ than the one beside it; it fits in a smaller box.|smaller|more small/smallest/small|Tính từ ngắn small thêm -er khi so sánh hai vật.
The elephant is ___ than the rabbit.|bigger|more big/biggest/big|Big thành bigger, gấp đôi g; có than là so sánh hơn.
This documentary is ___ interesting than the short advert.|more|most/very/much|Tính từ dài interesting dùng more ... than.
The guide is speaking ___ now, so please listen.|quietly|quiet/quieter/quietest|Speaking là động từ; quietly bổ nghĩa cách nói.
The children are ___ the animals from a safe distance.|watching|watch/watches/watched|Sau are ở hiện tại tiếp diễn cần watching.
A rabbit is usually ___ than an elephant.|lighter|lightest/more light/light|Light là tính từ ngắn; dùng lighter than.
This cage is ___ than the old one, so the birds have more space.|larger|largest/more large/large|So sánh hai chiếc lồng dùng larger than.
The pupils ___ drawing animals now; they are listening to the guide.|are not|is not/do not/does not|The pupils số nhiều; phủ định tiếp diễn dùng are not + V-ing.
Which sentence describes an action happening now?|The vet is checking the puppy.|The vet checks pets every day./The vet checked it yesterday./The vet will check it tomorrow.|Is checking diễn tả hành động đang diễn ra; ba câu kia là thói quen, quá khứ và tương lai.`,
`We ___ the museum yesterday and wrote about it afterwards.|visited|visit/visits/visiting|Yesterday chỉ quá khứ đã kết thúc, nên visited.
The children ___ at the campsite last night.|were|was/are/is|Children số nhiều; to be quá khứ dùng were.
Mai ___ tired after the long walk yesterday.|was|were/is/are|Mai số ít; to be quá khứ là was.
Did you ___ photos during the trip last Saturday?|take|took/taking/takes|Sau Did dùng nguyên mẫu take, không dùng took.
We did not ___ a campfire because the ground was too dry.|build|built/building/builds|Sau did not dùng nguyên mẫu build.
Nam ___ his grandmother two days ago.|visited|visits/visit/is visiting|Two days ago là dấu hiệu quá khứ, chọn visited.
The children ___ to the aquarium last Sunday.|went|go/goes/going|Go là động từ bất quy tắc; quá khứ là went.
Mai ___ a postcard at the gift shop yesterday.|bought|buy/buys/buying|Buy có quá khứ bất quy tắc bought.
We ___ the coach arrive, so we packed our bags.|saw|see/sees/seeing|Mạch câu quá khứ; see đổi thành saw.
The pupils ___ the classroom after the trip; it is tidy now.|cleaned|cleans/cleaning/are clean|Sự việc dọn lớp đã hoàn thành; cleaned phù hợp.
Which past-tense ending adds a separate syllable?|wanted|walked/washed/played|Wanted có -ed /ɪd/ vì want kết thúc bằng /t/; các từ kia không thêm âm tiết.
"___ you at the campsite yesterday?" "Yes, we were."|Were|Was/Are/Did|Câu hỏi to be quá khứ với you dùng Were, khớp we were.`,
`Mai would like ___ an engineer so she can design safer bridges.|to become|becoming/become/becomes|Would like to + V; to become diễn tả nguyện vọng.
Nam wants ___ a doctor and help people in his town.|to be|being/be/is|Want to + động từ nguyên mẫu.
Our class plans ___ the science museum next month.|to visit|visiting/visit/visits|Plan to + V là cấu trúc diễn tả dự định.
Lan is going to ___ her grandparents this summer.|visit|visits/visiting/visited|Be going to + nguyên mẫu visit.
My brother ___ to become a pilot when he grows up.|wants|want/wanting/is want|Brother số ít; hiện tại đơn dùng wants to become.
We are going ___ a poster about helpful jobs.|to design|designing/design/designs|Are going to + V; không bỏ to.
"What would you like ___ in the future?" asks the teacher.|to do|doing/do/does|Would like to + V, nên to do.
Mai ___ going to interview a farmer for her school project.|is|are/am/will|Mai số ít dùng is going to + interview.
The children plan ___ their neighbours clean the park.|to help|helping/help/helps|Plan to + V; phần sau help somebody + V.
I would like to ___ an honest person who helps others.|be|am/being/been|Sau would like to là động từ nguyên mẫu be.
Which sentence expresses a plan already arranged?|We are going to visit the farm on Friday.|We visited the farm yesterday./We visit it every month./We are visiting animals now.|Be going to diễn tả kế hoạch; ba câu kia chỉ quá khứ, thói quen và hành động hiện tại.
Lan ___ to design a new playground, so she is drawing ideas.|plans|plan/planning/is plan|Lan là chủ ngữ số ít nên plans to design.`,
`The waterfall is a popular tourist ___ in our province.|attraction|attract/attractive/attractively|Sau a popular tourist cần danh từ attraction; ba đáp án kia là động từ, tính từ, trạng từ.
The town has an ___ old bridge that visitors love to photograph.|attractive|attract/attraction/attractively|Trước cụm danh từ old bridge cần tính từ attractive.
The guide speaks ___ so every pupil can follow the instructions.|clearly|clear/clearness/cleared|Trạng từ clearly bổ nghĩa động từ speaks, diễn tả cách nói.
The puppet show ___ many children every weekend.|attracts|attractive/attraction/attractively|Sau chủ ngữ the puppet show cần động từ; chủ ngữ số ít nên attracts.
Mai is a ___ pupil who always returns things she finds.|helpful|help/helpfully/helped|Trước pupil cần tính từ helpful; hành động trong mệnh đề làm rõ phẩm chất.
The children listened ___ when the teacher explained the safety rules.|carefully|careful/care/cared|Listened cần trạng từ chỉ cách nghe, nên carefully.
We thanked the guide for her useful ___.|information|inform/informative/informatively|Sau her useful cần danh từ information; không dùng động từ hoặc tính từ.
The storyteller told an ___ tale about a brave tortoise.|interesting|interest/interestingly/interests|Trước danh từ tale cần tính từ interesting mô tả câu chuyện.
The pupils worked ___ to finish the project before Friday.|quickly|quick/quickness/quicker|Quickly là trạng từ bổ nghĩa worked.
Our school ___ a story competition every year.|organises|organisation/organising/organiser|Sau chủ ngữ our school cần động từ hiện tại đơn số ít organises.
The new bridge is safe because the engineers ___ it carefully before construction.|designed|design/designer/designing|Before construction đặt việc thiết kế trước khi xây; designed là động từ quá khứ phù hợp, designer là danh từ.
Which word describes how the girl speaks in "She speaks politely"?|politely|She/speaks/girl|Politely là trạng từ bổ nghĩa cách nói; She là đại từ và speaks là động từ.`
];
module.exports={rules,rows};
