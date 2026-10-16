/* Authored against theory2–12. This module is also used by validation/build tools. */
const C=(title,scene,prompt,options,answer,why)=>({type:'choice',title,scene,prompt,options,answer,why});
const B=(title,scene,answer,why)=>({type:'build',title,scene,prompt:'Build the sentence. Tap the words in order.',answer,why});
const M=(title,pairs,why)=>({type:'memory',title,prompt:'Find the matching pairs. Turn over two cards.',pairs,why});
const S=(title,groups,cards,why)=>({type:'sort',title,prompt:'Put each card in the correct group.',groups,cards,why});
const K=(title,scene,options,answer,why)=>({type:'collect',title,scene,prompt:'Collect all the things you need. Then check your basket.',options,answer,why});
const O=(title,scene,answer,why)=>({type:'sequence',title,scene,prompt:'Put the events in order.',answer,why});
const E=(title,words,error,options,answer,why)=>({type:'spot',title,prompt:'Find the wrong word. Then choose its replacement.',words,error,options,answer,why});
const R=(title,scene,answer,why)=>({type:'route',title,scene,prompt:'Move Titi. Follow the directions, then tap Arrived!',answer,why,start:[2,0]});
const games=[
{n:2,week:'Tuần 2',name:'Học viện bí mật',en:'School Quest',theme:'school',icon:'🏫',goal:'Khám phá các phòng học, ghép lịch và sửa robot trực nhật.',reward:'School Explorer',topics:'Trường học · môn học · hiện tại đơn · sở thích',items:[
M('School rooms',[['Read books','library'],['Do experiments','science lab'],['Play basketball','gym'],['Eat lunch','canteen']],'Library: thư viện; science lab: phòng thí nghiệm; gym: nhà thể chất; canteen: căng tin.'),
S('Daily routine',['Morning','Evening'],[['Have breakfast','Morning'],['Go to school at seven a.m.','Morning'],['Have dinner','Evening'],['Go to bed at nine p.m.','Evening']],'a.m. chỉ buổi trước trưa; p.m. chỉ buổi sau trưa.'),
C('Choose a lesson','We learn about numbers and shapes in this lesson.','Which subject is it?',['Maths','Music','History'],'Maths','Maths học về số và hình; Music là âm nhạc; History là lịch sử.'),
B('The school bus','Tell Titi about Ben’s routine.',['Ben','goes','to school','by bus','.'],'He/She/Ben + goes trong hiện tại đơn.'),
E('Fix the helper robot',['Mia','play','chess','every','Monday','.'],'play',['plays','playing','played'],'plays','Mia là ngôi thứ ba số ít: plays. Every Monday diễn tả thói quen.'),
B('Ask about a routine','Ask your friend about Saturday.',['Do','you','study','on Saturdays','?'],'Câu hỏi hiện tại đơn: Do + you + động từ nguyên mẫu.'),
C('Club card','Titi is interested ___ science.','Which word completes the sentence?',['in','on','at'],'in','Cụm đúng: be interested in + danh từ/V-ing.'),
K('Art class delivery','Bring only the things for drawing and painting: a pencil, paper and a paintbrush.',['a pencil','paper','a paintbrush','a football','a spoon'],['a pencil','paper','a paintbrush'],'Chọn đúng ba đồ dùng theo yêu cầu của lớp mỹ thuật.'),
C('Listen to the ending','Listen: books, bags, pens.','Which word ends with the sound /s/?',['books','bags','pens'],'books','books kết thúc bằng /s/; bags và pens kết thúc bằng /z/.'),
C('The missing pupil','Anna has English on Monday and Thursday. Today is Thursday. She is in the English classroom.','Which lesson does Anna have today?',['English','PE','Art'],'English','Thursday là thứ Năm. Anna học English vào Monday và Thursday.') ]},
{n:3,week:'Tuần 3',name:'Đảo câu lạc bộ',en:'Club Island',theme:'island',icon:'🏝️',goal:'Ghép bạn cùng sở thích và tổ chức một ngày vui trên đảo.',reward:'Club Captain',topics:'Sở thích · khả năng · lời mời · so/too/either/neither',items:[
M('Find a club',[['swimming','pool'],['reading','books'],['painting','colours'],['playing chess','chessboard']],'Ghép hoạt động với đồ dùng hoặc nơi phù hợp.'),
K('A music afternoon','We need a guitar, a drum and a piano for our music club.',['a guitar','a drum','a piano','a tennis racket','a kite'],['a guitar','a drum','a piano'],'Guitar, drum và piano là nhạc cụ.'),
B('Invite a friend','Suggest a game of chess.',['How about','playing','chess','?'],'How about + V-ing: How about playing chess?'),
C('Accept the invitation','Mia says, “Let’s go swimming!” You want to go.','What do you say?',['Great idea!','I cannot find my pen.','It is under the table.'],'Great idea!','Great idea! là lời hưởng ứng một đề nghị.'),
E('Club poster',['Titi','can','swims','very','well','.'],'swims',['swim','swimming','swam'],'swim','Sau can dùng động từ nguyên mẫu: can swim.'),
B('Your favourite hobby','Tell Titi what you like.',['I','am','fond of','reading','stories','.'],'Be fond of + V-ing: thích làm việc gì.'),
S('Agree with your friend',['Positive agreement','Negative agreement'],[['So do I.','Positive agreement'],['I do, too.','Positive agreement'],['Neither do I.','Negative agreement'],['I do not, either.','Negative agreement']],'So/too dùng để đồng tình với câu khẳng định; neither/either dùng với câu phủ định.'),
C('Two swimmers','Ben says, “I can swim.” Mia can swim as well.','What can Mia say?',['So can I.','So do I.','Neither can I.'],'So can I.','Lặp đúng trợ động từ can: So can I.'),
C('Word stress','Listen: hobby, enjoy, tennis.','Which word has stress on the second syllable?',['hobby','enjoy','tennis'],'enjoy','enJOY nhấn âm tiết hai; HOBby và TENnis nhấn âm tiết một.'),
C('Choose the right club','Sam likes moving to music. He does not like board games. The dance club meets on Friday.','Which club is best for Sam?',['The dance club','The chess club','The reading club'],'The dance club','Moving to music phù hợp với khiêu vũ: dance.') ]},
{n:4,week:'Tuần 4',name:'Nhà thiết kế nhí',en:'Dream House',theme:'house',icon:'🏡',goal:'Phân đồ về đúng phòng và xây ngôi nhà mơ ước.',reward:'Home Designer',topics:'Nhà cửa · vị trí · there is/are · sở hữu',items:[
S('Furnish the house',['Kitchen','Bedroom','Bathroom'],[['a cooker','Kitchen'],['a fridge','Kitchen'],['a bed','Bedroom'],['a wardrobe','Bedroom'],['a shower','Bathroom'],['a bathtub','Bathroom']],'Cooker/fridge ở bếp; bed/wardrobe ở phòng ngủ; shower/bathtub ở phòng tắm.'),
M('Home vocabulary',[['sofa','a comfortable seat'],['wardrobe','a place for clothes'],['fridge','keeps food cold'],['lamp','gives light']],'Ghép đồ vật với công dụng của nó.'),
B('Count the chairs','Describe four chairs in the kitchen.',['There','are','four chairs','in the kitchen','.'],'There are + danh từ số nhiều.'),
E('Repair the room sign',['There','are','a','sofa','in','the','room','.'],'are',['is','am','be'],'is','A sofa là số ít: There is a sofa.'),
C('Whose room?','This room belongs to Ben.','Which phrase is correct?',['Ben’s room','Bens room','Ben room'],'Ben’s room','Thêm ’s sau tên người để chỉ sở hữu.'),
K('Bedroom delivery','Put a bed, a pillow and a blanket in the bedroom.',['a bed','a pillow','a blanket','a cooker','a shower'],['a bed','a pillow','a blanket'],'Pillow là gối; blanket là chăn. Chọn đủ ba món được yêu cầu.'),
B('A lovely house','Make an exclamation.',['What','a','beautiful','house','!'],'What + a/an + tính từ + danh từ số ít!'),
C('Adjective blocks','Titi sees a ball. It is small and red.','Which phrase is correct?',['a small red ball','a red small ball','a ball small red'],'a small red ball','Tính từ kích thước thường đứng trước màu sắc.'),
C('Find the cat','The cat is below the table. It is not on a chair.','Where is the cat?',['Under the table.','On the table.','Behind the door.'],'Under the table.','Below/under ở đây cùng diễn tả vị trí bên dưới bàn.'),
C('Word stress','Listen: kitchen, bedroom, between.','Which word has stress on the second syllable?',['kitchen','bedroom','between'],'between','beTWEEN nhấn âm hai; KITCHen và BEDroom nhấn âm một.') ]},
{n:5,week:'Tuần 5',name:'Quán ăn cầu vồng',en:'Rainbow Café',theme:'cafe',icon:'🍓',goal:'Nhớ đơn hàng, chọn nguyên liệu và tính tiền cho khách.',reward:'Rainbow Chef',topics:'Đồ ăn · đồ uống · mua sắm · lượng từ · giá tiền',items:[
M('At the counter',[['a loaf of','bread'],['a bottle of','water'],['a bowl of','rice'],['a cup of','tea']],'a loaf of bread; a bottle of water; a bowl of rice; a cup of tea.'),
K('Order number one','The customer wants an apple, a sandwich and a bottle of water.',['an apple','a sandwich','a bottle of water','a cake','a cup of tea'],['an apple','a sandwich','a bottle of water'],'Đọc đủ đơn hàng trước khi chọn; không thêm món khách không yêu cầu.'),
S('Sort the ingredients',['Countable','Uncountable'],[['apple','Countable'],['egg','Countable'],['banana','Countable'],['rice','Uncountable'],['milk','Uncountable'],['water','Uncountable']],'Apple, egg, banana đếm được; rice, milk, water thường không đếm được.'),
B('Ask the price','Ask the price of these shoes.',['How much','are','these shoes','?'],'These shoes là số nhiều nên dùng are.'),
E('Fix the recipe',['How','many','milk','do','we','need','?'],'many',['much','any','a'],'much','Milk không đếm được: How much milk...?'),
C('The empty fridge','There is not ___ juice in the fridge.','Which word fits?',['any','some','many'],'any','Trong câu phủ định này dùng any juice.'),
K('Fruit salad','Use only the three fruits: a banana, an apple and an orange.',['a banana','an apple','an orange','an onion','a potato'],['a banana','an apple','an orange'],'Onion là hành và potato là khoai tây; không thuộc ba loại quả của công thức.'),
C('Pay the bill','A sandwich costs 20,000 dong. Water costs 10,000 dong. Titi buys one of each.','How much does he pay?',['30,000 dong','20,000 dong','40,000 dong'],'30,000 dong','20,000 + 10,000 = 30,000 đồng.'),
C('In the clothes shop','The jacket looks nice, but Mia needs to check its size.','What does she ask?',['Can I try it on?','Can I turn it off?','Can I look it up?'],'Can I try it on?','Try on = mặc thử.'),
C('Hear the ending','Listen: cups, apples, bananas.','Which word ends with /s/?',['cups','apples','bananas'],'cups','Cups có âm cuối /s/; apples và bananas có âm cuối /z/.') ]},
{n:6,week:'Tuần 6',name:'Biệt đội sức khỏe',en:'Healthy Heroes',theme:'health',icon:'🩺',goal:'Chuẩn bị túi cứu hộ và tìm lời khuyên đúng cho từng bạn.',reward:'Health Hero',topics:'Cơ thể · sức khỏe · should/can/have to · mệnh lệnh',items:[
M('Five senses',[['eyes','see'],['ears','hear'],['nose','smell'],['tongue','taste']],'Eyes để nhìn, ears để nghe, nose để ngửi, tongue để nếm.'),
S('Healthy choices',['Healthy habit','Unhealthy habit'],[['Wash your hands.','Healthy habit'],['Drink enough water.','Healthy habit'],['Stay up very late every night.','Unhealthy habit'],['Eat too many sweets.','Unhealthy habit']],'Rửa tay và uống đủ nước là thói quen tốt; thức quá khuya và ăn quá nhiều kẹo không tốt.'),
B('Give advice','Ben has a toothache.',['He','should','see','a dentist','.'],'Should + động từ nguyên mẫu; dentist là nha sĩ.'),
E('Check the advice',['You','should','drinks','water','.'],'drinks',['drink','drinking','drank'],'drink','Sau should dùng drink, không thêm s.'),
K('The hygiene kit','Pack soap, a toothbrush and toothpaste.',['soap','a toothbrush','toothpaste','a toy car','a paintbrush'],['soap','a toothbrush','toothpaste'],'Soap: xà phòng; toothbrush: bàn chải; toothpaste: kem đánh răng.'),
C('Safety first','The traffic light is red.','What should you do?',['Stop and wait.','Run across the road.','Play on the road.'],'Stop and wait.','Đèn đỏ: dừng lại và chờ.'),
B('A school rule','Tell Titi about the uniform rule.',['We','have to','wear','a uniform','at school','.'],'Have to + động từ: phải làm theo quy định.'),
C('Ask about health','Mia looks unwell. You want to ask about her problem.','What do you say?',['What’s the matter?','What colour is it?','How many pencils?'],'What’s the matter?','What’s the matter? dùng để hỏi có chuyện gì không ổn.'),
C('A good idea','It is a good idea for you ___ your hands before eating.','Which word fits?',['to wash','washing','washed'],'to wash','It is a good idea for somebody to + động từ.'),
C('Read the note','Ben has a cold. His mum tells him to rest and drink warm water. He cancels his football game.','What will Ben do now?',['Rest at home.','Play football.','Go swimming.'],'Rest at home.','Rest là nghỉ ngơi. Ben đã hủy buổi bóng đá.') ]},
{n:7,week:'Tuần 7',name:'Thành phố tìm đường',en:'Titi City',theme:'city',icon:'🧭',goal:'Điều khiển Titi trên bản đồ và giao thư đúng địa chỉ.',reward:'City Navigator',topics:'Địa điểm · phương tiện · chỉ đường · thời gian di chuyển',items:[
R('Deliver the first letter','Start at the flag. Go up two squares. Then go right two squares.',[0,2],'Đi lên hai ô rồi sang phải hai ô để đến góc trên bên phải.'),
M('Where do you go?',[['buy medicine','pharmacy'],['send a letter','post office'],['borrow books','library'],['see a doctor','hospital']],'Pharmacy: hiệu thuốc; post office: bưu điện; library: thư viện; hospital: bệnh viện.'),
R('The short route','Start at the flag. Go right one square. Then go up one square.',[1,1],'Sang phải một ô rồi đi lên một ô: ô giữa bản đồ.'),
B('Ask the way','You want to find the museum.',['How','can','I','get to','the museum','?'],'How can I get to...? dùng để hỏi đường.'),
E('Transport ticket',['Mia','goes','to','school','on','bus','.'],'on',['by','at','with'],'by','By bus = bằng xe buýt; on foot = đi bộ.'),
S('Travel phrases',['by','on'],[['bus','by'],['train','by'],['bike','by'],['foot','on']],'By + phương tiện không có mạo từ; on foot là cụm cố định.'),
B('Journey time','The walk to school takes ten minutes.',['It','takes','me','ten minutes','to walk','to school','.'],'It takes + người + thời gian + to V.'),
C('Time spent','I spend twenty minutes ___ to school.','Which word fits?',['walking','walk','to walk'],'walking','Spend + thời gian + V-ing.'),
C('At the crossroads','The library is opposite the park. The bank is next to the library.','What is opposite the park?',['The library.','The station.','The cinema.'],'The library.','Opposite là đối diện. Chọn đúng nơi được mô tả.'),
C('Choose your transport','The island has no road or bridge to the mainland. There is a boat service.','How can Titi get there?',['By boat.','By train.','On foot.'],'By boat.','Boat là thuyền; không có đường hay cầu tới đảo.') ]},
{n:8,week:'Tuần 8',name:'Trạm thời tiết lễ hội',en:'Festival Forecast',theme:'festival',icon:'🎈',goal:'Dự báo thời tiết và chuẩn bị lễ hội không thiếu đồ.',reward:'Festival Star',topics:'Thời tiết · lễ hội · will · be going to · liên từ',items:[
M('Weather station',[['rainy','take an umbrella'],['sunny','wear a sun hat'],['cold','wear a coat'],['windy','fly a kite']],'Ghép thời tiết với hành động hoặc đồ dùng phù hợp.'),
K('Rainy festival kit','It will rain. Pack a raincoat, an umbrella and waterproof boots.',['a raincoat','an umbrella','waterproof boots','a paper hat','a beach ball'],['a raincoat','an umbrella','waterproof boots'],'Raincoat: áo mưa; umbrella: ô; waterproof boots: ủng chống nước.'),
B('Plans for tomorrow','Tell Titi about your plan.',['I','am going to','visit','my grandparents','tomorrow','.'],'Be going to + động từ diễn tả dự định.'),
E('The forecast screen',['It','will','rains','tomorrow','.'],'rains',['rain','raining','rained'],'rain','Sau will dùng động từ nguyên mẫu.'),
C('Look at the clouds','We take umbrellas ___ it is going to rain.','Which word fits?',['because','but','or'],'because','Because nối với lý do: mang ô vì trời sắp mưa.'),
O('Festival timetable','The parade is at nine. Lunch is at twelve. Fireworks are at eight in the evening.',['Watch the parade.','Have lunch.','Watch the fireworks.'],'9 giờ sáng → 12 giờ trưa → 8 giờ tối.'),
B('Ask about weather','Ask about today’s weather.',['What','is','the weather','like','today','?'],'What is the weather like...? hỏi thời tiết.'),
C('A promise','Your friend cannot carry a heavy box. You decide to help now.','What do you say?',['I’ll help you.','I helped you yesterday.','I am a box.'],'I’ll help you.','Will dùng cho quyết định giúp ngay lúc nói.'),
C('Festival calendar','At Tet, Lan visits relatives and wishes them a happy new year.','What does Lan do at Tet?',['Visits relatives.','Takes a school exam.','Goes to a weekly chess lesson.'],'Visits relatives.','Relatives là người thân; đáp án dựa vào thông tin trong câu.'),
C('Word stress','Listen: sunny, rainy, tomorrow.','Which word has stress on the second syllable?',['sunny','rainy','tomorrow'],'tomorrow','toMORrow nhấn âm hai; SUNny và RAINy nhấn âm một.') ]},
{n:9,week:'Tuần 9',name:'Safari cứu hộ',en:'Animal Rescue',theme:'safari',icon:'🦒',goal:'Tìm môi trường sống và theo dấu những con vật đang hoạt động.',reward:'Safari Ranger',topics:'Động vật · hành động · hiện tại tiếp diễn · so sánh hơn',items:[
M('Animal clues',[['a long neck','giraffe'],['a trunk','elephant'],['black and white stripes','zebra'],['a hard shell','turtle']],'Neck: cổ; trunk: vòi; stripes: sọc; shell: mai.'),
S('Animal groups',['Bird','Mammal'],[['parrot','Bird'],['eagle','Bird'],['dolphin','Mammal'],['elephant','Mammal']],'Parrot/eagle là chim; dolphin/elephant là động vật có vú.'),
B('At the pond','Describe the ducks now.',['The ducks','are','swimming','in the pond','.'],'Are + V-ing cho hành động đang diễn ra của chủ ngữ số nhiều.'),
E('Ranger report',['The','monkey','is','climb','a','tree','.'],'climb',['climbing','climbs','climbed'],'climbing','Hiện tại tiếp diễn: is climbing.'),
C('Compare two animals','An elephant is ___ than a mouse.','Which word fits?',['bigger','big','biggest'],'bigger','So sánh hơn: big → bigger; có than.'),
K('Rescue the pets','The shelter asks for cat food, dog food and clean water.',['cat food','dog food','clean water','paint','glue'],['cat food','dog food','clean water'],'Chỉ mang đủ ba món được trạm cứu hộ yêu cầu.'),
B('Ask about the tiger','Ask what the tiger is doing now.',['What','is','the tiger','doing','?'],'What + is + chủ ngữ số ít + doing?'),
C('A longer adjective','This butterfly is more ___ than that moth.','Which word fits?',['colourful','colourfully','colour'],'colourful','More + tính từ dài: more colourful.'),
C('Follow the footprints','The zebra is drinking. The lion is sleeping. The monkeys are playing.','Which animal is asleep?',['The lion.','The zebra.','The monkeys.'],'The lion.','Sleeping nghĩa là đang ngủ; asleep là ở trạng thái ngủ.'),
C('Hear the ending','Listen: cats, dogs, birds.','Which word ends with /s/?',['cats','dogs','birds'],'cats','Cats có âm cuối /s/; dogs và birds có âm cuối /z/.') ]},
{n:10,week:'Tuần 10',name:'Cỗ máy thời gian',en:'Time Travellers',theme:'time',icon:'⏳',goal:'Khôi phục nhật ký chuyến đi và đưa cỗ máy về đúng thời điểm.',reward:'Time Traveller',topics:'Du lịch · cắm trại · quá khứ đơn · âm cuối -ed',items:[
M('Past tense portal',[['go','went'],['see','saw'],['take','took'],['buy','bought']],'Đây là các động từ bất quy tắc; không thêm -ed.'),
O('The camp diary','At seven, we packed. At eight, we left home. At ten, we arrived at the campsite.',['Pack our bags.','Leave home.','Arrive at the campsite.'],'Dựa vào thời gian 7 → 8 → 10 để xếp sự kiện.'),
B('Yesterday’s trip','Tell Titi about yesterday.',['We','visited','the museum','yesterday','.'],'Yesterday là dấu hiệu quá khứ; visit → visited.'),
E('Repair the diary',['Did','you','went','camping','last','week','?'],'went',['go','goes','going'],'go','Sau did dùng động từ nguyên mẫu go.'),
S('The sound of -ed',['/t/','/d/','/ɪd/'],[['walked','/t/'],['watched','/t/'],['played','/d/'],['cleaned','/d/'],['wanted','/ɪd/'],['visited','/ɪd/']],'Phân loại theo âm cuối của động từ gốc: /t,d/ → /ɪd/; âm vô thanh khác → /t/; còn lại → /d/.'),
K('Camp packing list','Bring a tent, a torch and a sleeping bag.',['a tent','a torch','a sleeping bag','a fridge','a sofa'],['a tent','a torch','a sleeping bag'],'Tent: lều; torch: đèn pin; sleeping bag: túi ngủ.'),
B('A negative sentence','Say that Ben stayed home yesterday.',['Ben','did not','go','to school','yesterday','.'],'Did not + động từ nguyên mẫu; Ben không đi học hôm qua.'),
C('Past form of be','Mia and Ben ___ at the beach yesterday.','Which word fits?',['were','was','are'],'were','Mia and Ben là số nhiều; quá khứ của are là were.'),
C('Lost photo','Last Sunday, Anna went to the zoo. She saw elephants and took photos. She did not buy any toys.','Which statement is true?',['She did not buy any toys.','She bought a toy elephant.','She bought a camera.'],'She did not buy any toys.','Câu phủ định nói rõ Anna không mua đồ chơi nào.'),
C('Word stress','Listen: holiday, travel, arrive.','Which word has stress on the second syllable?',['holiday','travel','arrive'],'arrive','arRIVE nhấn âm hai; HOLiday và TRAVel nhấn âm một.') ]},
{n:11,week:'Tuần 11',name:'Thành phố nghề nghiệp',en:'Future Makers',theme:'future',icon:'🚀',goal:'Ghép nhiệm vụ nghề nghiệp và xây kế hoạch tương lai.',reward:'Future Maker',topics:'Ngoại hình · tính cách · nghề nghiệp · mong muốn và dự định',items:[
M('Who does the job?',[['teaches children','teacher'],['flies a plane','pilot'],['cooks in a restaurant','chef'],['looks after patients','nurse']],'Teacher: giáo viên; pilot: phi công; chef: đầu bếp; nurse: điều dưỡng.'),
S('Describe a person',['Appearance','Personality'],[['tall','Appearance'],['curly hair','Appearance'],['short hair','Appearance'],['kind','Personality'],['friendly','Personality'],['hard-working','Personality']],'Appearance là ngoại hình; personality là tính cách.'),
B('A dream job','Tell Titi your dream.',['I','would like','to be','a pilot','.'],'Would like + to V: mong muốn làm gì.'),
E('Career board',['Mia','wants','be','a','doctor','.'],'be',['to be','being','is'],'to be','Want + to V: wants to be a doctor.'),
K('The chef’s toolkit','The chef needs a pan, a spoon and a knife.',['a pan','a spoon','a knife','a stethoscope','a paintbrush'],['a pan','a spoon','a knife'],'Pan: chảo; spoon: thìa; knife: dao; đây là đồ dùng của đầu bếp.'),
B('Make a plan','Titi plans to learn more about space.',['Titi','plans','to visit','the space museum','.'],'Plan + to V; Titi là số ít nên plans.'),
C('Future plan','Ben ___ going to study art.','Which word fits?',['is','are','am'],'is','Ben + is going to + động từ.'),
C('Ask about personality','Mia is kind and patient.','Which question asks about her personality?',['What is Mia like?','What does Mia look like?','Where is Mia?'],'What is Mia like?','What is ... like? hỏi tính cách trong ngữ cảnh này; look like hỏi ngoại hình.'),
C('Meet the firefighter','Sam helps people during fires. He wears protective clothes and works with a team.','What is his job?',['A firefighter.','A singer.','A farmer.'],'A firefighter.','Firefighter là lính cứu hỏa; protective clothes là quần áo bảo hộ.'),
C('Word stress','Listen: teacher, doctor, police.','Which word has stress on the second syllable?',['teacher','doctor','police'],'police','poLICE nhấn âm hai; TEACHer và DOCtor nhấn âm một.') ]},
{n:12,week:'Tuần 12',name:'Xưởng phim cổ tích',en:'Story Studio',theme:'story',icon:'🎬',goal:'Sắp cảnh phim, phân vai cho từ và hoàn thành câu chuyện.',reward:'Story Director',topics:'Truyện · dự án · danh từ · động từ · tính từ · trạng từ',items:[
M('Story words',[['the person in a story','character'],['where a story happens','setting'],['the last part','ending'],['a story with magic','fairy tale']],'Character: nhân vật; setting: bối cảnh; ending: kết thúc; fairy tale: truyện cổ tích.'),
O('Three film scenes','First, Titi finds a map. Next, he follows the path. Finally, he opens the treasure chest.',['Find a map.','Follow the path.','Open the chest.'],'First → next → finally giúp xác định trình tự.'),
S('Word jobs',['Noun','Verb','Adjective','Adverb'],[['The rabbit sleeps. → rabbit','Noun'],['The rabbit sleeps. → sleeps','Verb'],['It is a brave rabbit. → brave','Adjective'],['It runs quickly. → quickly','Adverb']],'Xác định từ loại trong câu: danh từ chỉ vật; động từ chỉ hành động; tính từ tả danh từ; trạng từ bổ nghĩa động từ.'),
B('A brave character','Describe the princess.',['The brave princess','opened','the small door','carefully','.'],'Brave/small là tính từ; carefully là trạng từ bổ nghĩa opened.'),
E('Fix the narrator',['The','rabbit','runs','quick','.'],'quick',['quickly','quicker','quickness'],'quickly','Runs cần trạng từ chỉ cách thức: quickly.'),
K('Choose the props','For the forest scene, bring a map, a lantern and a basket.',['a map','a lantern','a basket','a washing machine','a traffic light'],['a map','a lantern','a basket'],'Props là đạo cụ; chọn đúng ba đạo cụ được kịch bản yêu cầu.'),
C('A word with two jobs','In the sentence “I drink water”, look at the word “drink”.','What is its word class here?',['Verb','Noun','Adjective'],'Verb','Drink ở câu này chỉ hành động uống nên là động từ.'),
C('Describe an action','The children listened ___ to the story.','Which word fits?',['carefully','careful','care'],'carefully','Listen carefully: lắng nghe chăm chú. Dùng trạng từ bổ nghĩa listened.'),
C('The honest child','Lily found a purse on the path. She took it to the police station. Its owner thanked her.','What did Lily do with the purse?',['Returned it through the police.','Kept it at home.','Threw it away.'],'Returned it through the police.','Lily đem ví đến đồn cảnh sát để trả cho chủ; không giữ ví.'),
C('The story ending','Titi helped a lost bird find its family. The bird sang happily.','How did the bird feel at the end?',['Happy.','Angry.','Lonely.'],'Happy.','Happily cho biết chim vui vẻ khi tìm lại gia đình.') ]}
];
games.find(g=>g.n===6).items.push(C('Word stress','Listen: healthy, dentist, prevent.','Which word has stress on the second syllable?',['healthy','dentist','prevent'],'prevent','preVENT nhấn âm tiết hai; HEALTHy và DENtist nhấn âm tiết một.'));
games.find(g=>g.n===7).items.push(C('Word stress','Listen: station, airport, hotel.','Which word has stress on the second syllable?',['station','airport','hotel'],'hotel','hoTEL nhấn âm tiết hai; STAtion và AIRport nhấn âm tiết một.'));
games.find(g=>g.n===12).items.push(C('A silent letter','Look at the word listen. Say it aloud.','Which letter is silent?',['t','s','n'],'t','Chữ t trong listen không được phát âm.'));
// Four reviewed alternatives for each ABCD question; avoid generic filler options.
const fourthChoices={
2:['Science','to','toys','Maths'],
3:['Sorry, I cannot come.','Neither do I.','music','The science club'],
4:['Ben room’s','a small ball red','In the cupboard.','sofa'],
5:['a','50,000 dong','Can I throw it away?','eggs'],
6:['Ride through the red light.','Where is your bag?','wash','Go camping.','doctor'],
7:['walks','The supermarket.','By car.','city'],
8:['although','I helped you last week.','Decorates a Christmas tree.','winter'],
9:['bigly','colouring','The elephant.','cows'],
10:['is','She bought a kite.','camping'],
11:['be','How old is Mia?','A pilot.','farmer'],
12:['Adverb','careless','Gave it to a friend to keep.','Afraid.','i']};
for(const g of games){let i=0;for(const q of g.items)if(q.type==='choice')q.options.push(fourthChoices[g.n][i++]);}
// Checkpoints revisit different activities from earlier weeks, with a final mixed quest.
const checkpointPlans={
13:[[2,0],[3,1],[4,0],[2,3],[3,4],[4,4],[2,2],[3,5],[4,5],[2,4],[3,7]],
14:[[2,7],[3,0],[4,3],[5,2],[6,2],[7,0],[8,5],[5,7],[6,1],[7,3],[8,3]],
15:[[2,7],[3,0],[4,0],[5,7],[6,3],[7,0],[8,5],[9,2],[10,4],[11,8],[12,1]]};
for(const [n,end,name,en,theme,icon] of [[13,4,'Kho báu khởi hành','First Treasure','treasure','💎'],[14,8,'Đại hội nhà thám hiểm','Explorer Games','arena','🏆'],[15,12,'Lâu đài Văn Lang','Van Lang Castle','castle','🏰']]){
 const items=[{...C('The first clue','Titi is from Australia. He lives in Hanoi now.','Where is Titi from?',['Australia','Hanoi','The library','Hue'],'Australia','From chỉ nơi xuất thân; lives in chỉ nơi đang sống.'),sourceWeek:1}];
 for(const [week,idx]of checkpointPlans[n])items.push({...games.find(g=>g.n===week).items[idx],sourceWeek:week});
 games.push({n,week:`Tổng ôn tuần 1–${end}`,name,en,theme,icon,goal:'Vận dụng kiến thức đã học để chinh phục thử thách tổng hợp.',reward:n===15?'Van Lang Champion':'Treasure Champion',topics:`Ôn phối hợp từ vựng, ngữ pháp và đọc hiểu tuần 1–${end}`,items});
}
for(const g of games)g.items=g.items.map((q,i)=>({...q,id:`g${g.n}q${i+1}`,hint:q.why}));
module.exports=games;
