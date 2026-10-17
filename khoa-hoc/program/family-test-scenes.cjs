/* Source exercise transcription for fresh, scan-free test scenes.
 * Original response IDs and answer keys remain in family-test-keys.cjs.
 * Text checked against the centre-supplied Unit tests; drawing specs carry
 * only the visual facts needed to answer, never a hidden answer label.
 */
const K=require('./family-test-keys.cjs');
const icon=(name,label)=>({kind:'icon',name,...(label?{label}:{})});
const person=(props={})=>({kind:'person',...props});
const relation=(object,place,where)=>({kind:'relation',object,place,where});
const cards=(...items)=>({kind:'cards',items:items.flat().map(x=>typeof x==='string'?icon(x):x)});
const clock=(hour,minute=0)=>({kind:'clock',hour,minute});
const section={};
function define(b,u,e,fn){section[`${b}:${u}:${e}`]=fn;}
function result(text='',visual=null,prompt='Read and write.',type='readWrite',extra={}){return {text,visual,prompt,type,...extra};}
function picture(b,u,e,names=null){const choose=['1:2:1','1:9:1','1:12:1','1:15:1','2:9:2'].includes([b,u,e].join(':'));define(b,u,e,(a,i)=>result('',cards(names?names[i]:a),choose?'Look and choose.':'Look and write.',choose?'lookChoose':'lookWrite'));}
function spelling(b,u,e,patterns=null){define(b,u,e,(a,i)=>result(patterns?patterns[i]:a.replace(/[aeiou]/gi,'_'),cards(a),'Complete the word.','lookWrite'));}
function gap(b,u,e,lines,visuals=[],bank){define(b,u,e,(a,i)=>result(lines[i],visuals[i]||null,'Complete the sentence.','readWrite',bank?{bank}:{}));}
function order(b,u,e,lines){define(b,u,e,(a,i)=>result(lines[i],null,'Put the words in order.','build'));}
function matching(b,u,e,left,right){define(b,u,e,(a,i)=>result(left[i],null,'Match the sentences.','matchText',{optionLabels:right}));}
function odd(b,u,e,groups){define(b,u,e,(a,i)=>result('',cards(groups[i]),'Find the odd one out.','lookOdd'));}
// Book 1 · Units 1–3
picture(1,1,1);spelling(1,1,2,['p____l','r___r','r____r','w____w']);
define(1,1,3,(a,i)=>result("What's this?",cards(['pen','rubber','bag'][i]),'Look and write.','lookWrite'));
matching(1,1,4,['It is my bag.','It is my pencil.','It is red.','It is a ruler.'],{a:"It's red.",b:"What's this?",c:"It's my pencil.",d:"It's my bag.",e:"It's a ruler."});
picture(1,2,1);define(1,2,2,(a,i)=>result(['oldl','zzlupe','dtedy','ikeb'][i],cards(a),'Put the letters in order.','lookWrite'));
order(1,2,3,['it / Yes, / is.','my / This / kite. / is','your / Is / this / train?','isn’t. / it / No,']);
gap(1,2,4,['Is this your doll? No, it ___.','Is this your hat? No, ___.','Is this your train? Yes, ___.']);
define(1,3,1,(a)=>result('',{kind:'body',highlight:a},'Look and choose.','lookChoose'));
define(1,3,2,(a,i)=>result(['three ___','two ___','four ___','one ___','five ___'][i],null,'Choose the correct word.','readChoose'));
define(1,3,3,(a,i)=>result('',{kind:'body',highlight:['eyes','fingers','face'][i]},'Choose the correct sentence.','lookChoose',{choices:[a,["This is my eye.","This is my finger.","These are my faces."][i]]}));
// Book 1 · Units 4–6
 gap(1,4,1,['police___','house___','far___','fire___','pu___'],[],['cher','man','man','wife','mer','pil']);
define(1,4,2,(a,i)=>result(['dcotor','plupi','nusre','lotpi'][i],cards(a),'Put the letters in order.','lookWrite'));
order(1,4,3,['a / she / nurse? / Is','housewife? / a / Is / she',"a / She's / teacher."]);
gap(1,4,4,['Is ___ a fireman? Yes, ___ is.','Is ___ a teacher? Yes, ___ is.','Is ___ a policeman? Yes, ___ is.'],[cards(person({gender:'boy',job:'fireman'})),cards(person({gender:'girl',job:'teacher'})),cards(person({gender:'boy',job:'policeman'}))]);
define(1,5,1,(a,i)=>result(['tree','frisbee','sofa','ice cream'][i],cards(['tree','frisbee','seesaw','ice cream'][i]),'Write yes or no.','lookWrite'));
spelling(1,5,2,['s_i_e','p__l','n_t','s_e_a_']);
gap(1,5,3,['The umbrella is ___ the seesaw.','The teddy is ___ the pool.','The girl is ___ the slide.','The car is ___ the seesaw.'],[relation('umbrella','seesaw','on'),relation('teddy','pool','in'),relation('girl','slide','on'),relation('car','seesaw','under')],['in','on','under']);
gap(1,5,4,['___ the book? ___ in the bag.','___ the doll? ___ in the pool.','___ the apple? ___ in the bag.'],[relation('book','bag','in'),relation('doll','pool','in'),relation('apple','bag','in')]);
define(1,6,1,(a,i)=>result('',cards(person([{gender:'girl',age:'adult'},{gender:'girl',age:'child'},{gender:'boy',age:'elder'}][i])),'Choose the correct word.','lookChoose',{choices:[a,['uncle','mum','grandma'][i]]}));
gap(1,6,2,['grand___','cou___','sis___','bro___','a___']);
define(1,6,3,(a,i)=>result('',cards(person([{gender:'girl',age:'child',label:'Sister'},{gender:'girl',age:'elder',label:'Grandma'},{gender:'boy',age:'adult',label:'Uncle'}][i]),['bike','umbrella','hat'][i]),'Choose the correct sentence.','lookChoose',{choices:[a,["This is my brother’s bike.","It's Grandpa’s umbrella.","This is my aunt’s hat."][i]]}));
gap(1,6,4,["It's ___ frisbee.","It’s ___ ball.","It’s ___ pen.","It’s ___ kite."],[['Jenny','frisbee'],['Frank','ball'],['Bob','pen'],['Tom','kite']].map(([label,n])=>cards(person({label}),n)));
// Book 1 · Units 7–9
spelling(1,7,1,['T-s_i_t','s_o_s','t_o_s_r_','c_a_']);
odd(1,7,2,[['socks','shoes','sandals','boots','shoes'],['skirt','skirt','dress','skirt','skirt'],['trousers','shorts','shorts','shorts','shorts']]);
gap(1,7,3,['This is ___ hat.','This is ___ coat.','These are ___ shorts.'],[cards(person({gender:'boy'}),'hat'),cards(person({gender:'girl'}),'coat'),cards(person({gender:'boy'}),'shorts')],['his','her']);
order(1,7,4,['they / Yes, / are.','her / Are / socks? / these','this / Is / hat? / her',"aren’t. / No, / they",'coat? / Is / this / his']);
define(1,8,1,(a,i)=>result(['upstairs','bedroom','bathroom'][i],{kind:'room',room:['upstairs','bedroom','kitchen'][i]},'Write yes or no.','lookWrite'));
define(1,8,2,(a,i)=>result(['roomthba','chekitn','nindig moor','ivlign omro'][i],{kind:'room',room:a},'Put the letters in order.','lookWrite'));
gap(1,8,3,['___ Grandpa?','___ Billy?','___ my mum and dad?','___ my cousins?'],[],["Where’s",'Where are']);
define(1,8,4,(a,i)=>result(['Are Mum and Dad in the living room? ___, they ___.','Is Mia upstairs? ___, she ___.','___ Rob in the bathroom? ___, he ___.','___ Grandpa and Grandma in the living room? ___, they ___.'][i],{kind:'house',rooms:[{room:'bedroom',people:[]},{room:'bathroom',people:['Rob']},{room:'living room',people:['Mum','Dad']},{room:'kitchen',people:['Grandpa','Mia','Grandma']}]},'Complete the answers.','lookWrite'));
picture(1,9,1);spelling(1,9,2,['g_a_e_','p_a_','b_n_n_','a_p_e']);
gap(1,9,3,['___ egg','___ lion','___ ice cream','___ kite','___ banana'],[],['a','an']);
order(1,9,4,["I / got / haven’t / sandwich. / a","lunch / haven’t / got / a / box. / I","got / I’ve / a / biscuit."]);
// Book 1 · Units 10–12
 define(1,10,1,(a,i)=>result(['straight hair','long hair','blond hair','short hair'][i],cards(person([{gender:'boy',hair:'curly',hairColor:'#e5b75b'},{gender:'girl',hair:'long',hairColor:'#7d4526'},{gender:'boy',hairColor:'#292831'},{gender:'boy',hairColor:'#69472e'}][i])),'Write yes or no.','lookWrite'));
define(1,10,2,(a,i)=>result(['qsuaer','tanregcle','trnlgaie'][i],cards(a),'Put the letters in order.','lookWrite'));
gap(1,10,3,['It ___ two sides. ___ three sides.','He ___ blond hair. ___ black hair.','It ___ three sides. ___ four sides.'],[cards('triangle'),cards(person({gender:'boy',hairColor:'#292831'})),cards('square')]);
matching(1,10,4,['She has got blue eyes.','He has not got straight hair.','It has got three sides.','He has not got blue eyes.','She has not got brown hair.'],{a:"He hasn't got straight hair.",b:"He hasn't got blue eyes.",c:"She's got brown hair.",d:"She's got blue eyes.",e:"She hasn't got brown hair.",f:"It's got three sides."});
define(1,11,1,(a,i)=>result(['rrotpa','nilo','abrze','oagt'][i],cards(a),'Put the letters in order.','lookWrite'));
odd(1,11,2,[['lion','lion','tiger','lion','lion'],['goat','giraffe','goat','goat','goat'],['fish','fish','snake','fish','fish']]);
define(1,11,3,(a,i)=>result('',{kind:'size',subjects:i===0?['elephant','elephant']:i===1?['lion']:['girl'],size:i===2?'small':'big'},'Choose the correct sentence.','lookChoose',{choices:[a,["He's big.","It's tall.","She's tall."][i]]}));
gap(1,11,4,['I ___ eggs.','I ___ snakes.','I ___ parrots.','I ___ goats.','I ___ lions.'],['eggs','snake','parrot','goat','lion'].map((name,i)=>({kind:'preference',name,like:[false,false,true,false,true][i]})),['like',"don't like"]);
picture(1,12,1);spelling(1,12,2,['y_g_rt','m_lk','r_ce','j_i_e','f_sh']);
order(1,12,3,['Do / you / like / milk?','What / do / you / like?','like / yogurt. / I',"don’t / I / grapes. / like"]);
gap(1,12,4,['___ you like fish? No, I ___.','___ you like tomatoes? No, I ___.','___ you like carrots? Yes, I ___.']);
// Book 1 · Units 13–15
spelling(1,13,1,['bl_nk_t','p_ll_w','d_s_','c_pb_a_d']);
define(1,13,2,(a,i)=>result(['wtleve','teenffi','entytw','fteenour'][i],null,'Write the word and number.','readWrite',{format:'word / number'}));
const bedroom={kind:'bedroom',objects:[{name:'books',where:'on',place:'shelf',count:2},{name:'train',where:'under',place:'bed',count:1},{name:'doll',where:'on',place:'rug',count:2},{name:'coat',where:'in',place:'cupboard',count:3},{name:'teddy',where:'on',place:'bed',count:1},{name:'car',where:'in',place:'cupboard',count:1}]};
gap(1,13,3,["There’s a ___ under the bed.",'There are ___ on the rug.','There are three ___ in the cupboard.'],[bedroom,bedroom,bedroom]);
gap(1,13,4,["There’s a teddy ___ the bed.",'There are three coats ___ the cupboard.','There are two books ___ the shelf.',"There’s a car ___ the cupboard."],[bedroom,bedroom,bedroom,bedroom],['in','on','under']);
define(1,14,1,(a,i)=>result('',i<4?cards(a):{kind:'crossword',target:i-4},i<4?'Look and write.':'Complete the crossword.','lookWrite'));
order(1,14,2,["can’t / sing. / He",'climb? / Can / it','fly? / Can / he','swim. / She / can']);
gap(1,14,3,['Can he run?','Can it fly?','Can she sing?'],[{kind:'ability',name:'boy',action:'run',can:true},{kind:'ability',name:'elephant',action:'fly',can:false},{kind:'ability',name:'girl',action:'sing',can:true}]);
picture(1,15,1);spelling(1,15,2,['s_ndc_st_e','b_t','b_l_','s_n cr_a_']);
order(1,15,3,["find / shells. / Let’s","good / idea. / That’s / a","forget / Don’t / hat. / your","sandcastles! / Let’s / make"]);
gap(1,15,4,["Let’s ___ in the sea.","Don’t ___ your sun cream.","Let’s ___ on the beach."],[],['find','forget','run','swim']);
// Book 2 · Units 1–3
 gap(2,1,1,['dra___','pos___','cup___'],[],['wers','ter','puter','board']);
spelling(2,1,2,['p_g','p_ct_re','t_bl_','b_a_d']);
gap(2,1,3,['Those ___ my pencils.','These ___ my books.','Those ___ my pens.','This ___ my ruler.','Those ___ new tables.'],[],['is','are']);
gap(2,1,4,['___ is my pencil case.','___ is my table.','___ are my books.'],[{kind:'distance',name:'pencil case',near:true,count:1},{kind:'distance',name:'table',near:false,count:1},{kind:'distance',name:'book',near:false,count:3}],['This','That','These','Those']);
define(2,2,1,(a,i)=>result(["They’re oldc ___","She’s vbrae ___","We’re gryhun ___","I’m aphpy ___","He’s das ___"][i],null,'Put the letters in order.','readWrite'));
define(2,2,2,()=>result('',{kind:'wordSnake'},'Find and write the words.','readWrite',{format:'Example 1: scared. Write the word for this number.'}));
gap(2,2,3,['___ hot.','___ angry.','___ thirsty.'],[cards(person({gender:'girl',mood:'hot'})),cards(person({gender:'boy',mood:'angry',speaking:true})),cards(person({gender:'girl',mood:'thirsty'}),person({gender:'boy',mood:'thirsty'}),person({gender:'boy',mood:'thirsty'}))]);
gap(2,2,4,['Are you tired? No, we ___.','Are they scared? No, they ___.','Are you happy? Yes, we ___.'],[],['are',"aren’t"]);
spelling(2,3,1,['p___ f_______','r___ a b___','s____','r___ a h____','p___ t_____']);
gap(2,3,2,['The kite is ___ the bed and the chair.','The train is ___ the bed.','The poster is ___ the chair.'],[{kind:'between',name:'kite',left:'bed',right:'chair'},relation('train','bed','on'),relation('poster','chair','behind')]);
const ability={kind:'abilityTable',rows:[['Ben','play football',true],['Kim','ride a bike',true],['Ben','skate',false],['Kim','play tennis',false],['Kim','skateboard',true],['Ben','play tennis',true],['Kim','skate',false],['Ben','ride a bike',false]]};
gap(2,3,3,['Kim ___ ride a bike.','Ben ___ skate.','Kim ___ play tennis.','Kim ___ skateboard.'],[ability,ability,ability,ability],['can',"can’t"]);
define(2,3,4,(a,i)=>result(['Can Ben play tennis?','Can Kim skate?','Can Ben ride a bike?'][i],ability,'Match the answers.','matchText',{optionLabels:{a:"No, he can't.",b:'Yes, he can.',c:'Yes, she can.',d:"No, she can't."}}));
// Book 2 · Units 4–6
odd(2,4,1,[['salad','salad','salad','fries'],['pizza','pizza','chicken'],['banana','banana','banana','milkshake']]);
matching(2,4,2,['70','40','90','20'],{a:'forty',b:'twenty',c:'thirty',d:'seventy',e:'ninety'});
gap(2,4,3,["Have you got a pizza? No, I ___.",'___ she got fries?','Yes, she ___.','___ you got salad?','Yes, I ___.']);
gap(2,4,4,['Have you got a sandwich? ___, I have.','Has Erica ___ a milkshake?',"No, she ___."],[],['Have',"hasn’t",'got','Yes']);
picture(2,5,1);define(2,5,2,(a,i)=>result(['a_t r__m','c_mp_ter room','sp_rts f_e_d'][i],{kind:'labelled',items:[icon('art room','a'),icon('sports field','b'),icon('playground','c'),icon('computer room','d')]},'Complete and match.','lookWrite',{format:'word / picture letter'}));
gap(2,5,3,['These are ___ pencil cases.','These are ___ toys.','These are ___ sandwiches.'],[{kind:'ownership',name:'pencil case',ours:false},{kind:'ownership',name:'teddy',ours:false},{kind:'ownership',name:'sandwich',ours:true}],['our','their']);
matching(2,5,4,["Today we’ve got","When have we","We’ve got English","What have","I haven’t"],{a:'music.',b:'got on Tuesday?',c:'on Friday.',d:'you got on Monday?',e:'got maths?',f:'got art today.'});
gap(2,6,1,['w___ TV','r___ a book','p___ with friends','w___ an email','l___ to music'],['TV','book','play with friends','email','music'].map(x=>cards(x)));
matching(2,6,2,['go','have','do'],{a:'swimming',b:'my dad',c:'my homework',d:'a music lesson'});
const schedule={kind:'schedule',rows:[['Monday','go swimming',true],['Monday','have a music lesson',false],['Wednesday','do homework',true],['Wednesday','play with friends',false],['Saturday','visit grandma',true],['Saturday','watch TV',false]]};
define(2,6,3,(a,i)=>result(['On Monday I go swimming. I ___ (3) a music lesson.','On Monday I go swimming. I (2) ___ a music lesson.','On Wednesday I do my homework. I ___ (5) with my friends.','On Wednesday I do my homework. I (4) ___ with my friends.','On Saturday I ___ my grandma.','On Saturday I visit my grandma. I ___ (8) TV.','On Saturday I visit my grandma. I (7) ___ TV.'][i],schedule,'Complete the text.','readWrite',{otherBlanks:{2:"don't",3:'have',4:"don't",5:'play',7:"don't",8:'watch'}}));
// Book 2 · Units 7–9
odd(2,7,1,[['cake','sweet','sweet','sweet'],['card','card','present','card'],['balloon','ball','ball','ball']]);
define(2,7,2,(a,i)=>result(['pstaries','bourneghi','cochlatoe','wteess','dacr'][i],{kind:'labelled',items:[icon('sweets','a'),icon('pastries','b'),person({label:'c',age:'adult',gender:'boy',job:'neighbour'}),icon('chocolate','d'),icon('nuts','e'),icon('card','f')]},'Put the letters in order and match.','lookWrite',{format:'word / picture letter'}));
gap(2,7,3,['He ___ sweets.','Mary ___ bananas.','She ___ chocolate.'],[{kind:'preference',name:'sweets',like:false,label:'Tom'},{kind:'preference',name:'banana',like:false,label:'Mary'},{kind:'preference',name:'chocolate',like:true,label:'Mary'}],['likes',"doesn’t like"]);
gap(2,7,4,['What does ___ like?','He ___ chocolate.','What ___ she like?','She ___ like nuts.']);
define(2,8,1,(a,i)=>result(['___ to bed','___ home','___ dinner','___ breakfast'][i],null,'Choose the correct group.','readChoose',{choices:['go','have']}));
define(2,8,2,(a)=>result('',{kind:'daytime',time:a},'Look and write.','lookWrite',{bank:['morning','evening','night','afternoon']}));
define(2,8,3,(a,i)=>result("It’s ___.",clock([12,3,10][i]),'Write the time.','lookWrite'));
gap(2,8,4,['My dad ___ at six o’clock.','Sarah ___ to school at nine o’clock.','Sarah ___ dinner at seven o’clock.','I ___ home at four o’clock.','I ___ dinner at six o’clock.'],[],['get up','has','go','goes','gets up','have']);
spelling(2,9,1);picture(2,9,2);gap(2,9,3,['___ in a school.','___ at the airport.','___ in a hospital.'],[cards(person({gender:'girl',job:'teacher'})),cards(person({gender:'boy',job:'pilot'})),cards(person({gender:'girl',job:'nurse'}))]);
gap(2,9,4,['Where does your dad work? He ___ in a bank.','___ your mum work in a zoo?','No, she ___.','Does your brother work at an airport? ___, he does.']);
// Book 2 · Units 10–12
picture(2,10,1);gap(2,10,2,['play a kite → ___ a kite','go on your hat → ___ on your hat','do outside → ___ outside'],[],['make','put','go','fly']);
gap(2,10,3,['___ on your sun cream.','___ the window.','___ your coat.'],[cards('sunny','sun cream'),cards('hot','window'),cards('cold','coat')]);
matching(2,10,4,['Put on',"Don’t go","Don’t fly","Let’s make"],{a:'outside.',b:'your kite.',c:'the door.',d:'a snowman.',e:'your hat.'});
odd(2,11,1,[['dress','skirt','dress'],['shorts','shorts','shorts','jeans'],['scarf','scarf','scarf','shirt']]);
gap(2,11,2,["It’s ___ to ten.","It’s ___ past eleven.","It’s ___ to five.","It’s ___ past three.","It’s ___ past twelve."],[clock(9,45),clock(11,30),clock(4,45),clock(3,30),clock(12,15)],['quarter','half']);
define(2,11,3,(a,i)=>result('___ wearing '+['shorts','boots','a skirt','a scarf','gloves','a coat','a hat'][i]+'.',cards(person({gender:[0,1,3,4,5].includes(i)?'boy':'girl',wear:['shorts','boots','skirt','scarf','gloves','coat','hat'][i],speaking:[1,4,6].includes(i)})),'Complete the sentence.','lookWrite'));
picture(2,12,1);gap(2,12,2,['___ your hair','___ the car'],[cards('brush'),cards('wash car')]);
gap(2,12,3,['She’s ___ photos.','He’s ___ a cake.','They’re ___ the car.','We’re ___ a video.','They’re ___.'],['take photos','make cake','wash car','watch TV','dance'].map(x=>cards(x)));
matching(2,12,4,['We are eating.','They are writing.','He is singing.','I am dancing.'],{a:"He’s singing.",b:"She’s talking.",c:"I’m dancing.",d:"They’re writing.",e:"We’re eating."});
// Book 2 · Units 13–15
picture(2,13,1);gap(2,13,2,['loud / ___','fast / ___','happy / ___','big / ___','tall / ___'],[],['quiet','cold','short','slow','sad','small']);
gap(2,13,3,['Sally is ___ than Jo.','This car is ___ than that bike.','The rubber is ___ than the pencil case.','The goat is ___ than the horse.','Dan is ___ than Luke.'],[{kind:'compare',left:person({gender:'girl',label:'Sally'}),right:person({gender:'girl',label:'Jo'}),tall:true},{kind:'speed',left:'car',right:'bike',faster:'left'},{kind:'compare',left:icon('rubber'),right:icon('pencil case'),smaller:true},{kind:'speed',left:'goat',right:'horse',faster:'right'},{kind:'compare',left:person({gender:'boy',label:'Dan'}),right:person({gender:'boy',label:'Luke'}),short:true}],['bigger','slower','faster','shorter','taller','smaller']);
define(2,14,1,(a,i)=>result(['untidy','wet','naughty','tidy'][i],{kind:'labelled',items:[{kind:'desk',tidy:true,label:'a'},{kind:'desk',tidy:false,label:'b'},person({mood:'wet',label:'c'}),{kind:'help',label:'d'},{kind:'mischief',label:'e'}]},'Match the word and picture.','match',{optionLabels:{a:'Picture a',b:'Picture b',c:'Picture c',d:'Picture d',e:'Picture e'}}));
spelling(2,14,2);gap(2,14,3,['Jay ___ wet.','Beth and Celia ___ very cold.','The ducks ___ happy.','Mum ___ angry!'],[],['was','were']);
gap(2,14,4,['You ___ naughty.','They ___ wet.','He ___ cold.','We ___ scared.'],[],["wasn’t","weren’t"]);
gap(2,15,1,['There were three ___.','There were four ___.','There was one ___.','There were four ___.','There was one ___.'],[],null);
define(2,15,1,(a,i)=>result(['There were three ___.','There were four ___.','There was one ___.','There were four ___.','There was one ___.'][i],null,'Choose the correct word.','readChoose',{choices:[a,['child','teddy','men','woman','ducks'][i]]}));
define(2,15,2,(a,i)=>result(['Jim was ___.','Charlie was ___.','Ellie was ___.'][i],{kind:'podium',people:['Charlie','Anna','Ellie','Jim']},'Complete the sentence.','lookWrite'));
gap(2,15,3,["There weren’t ___ men.",'There were ___ ducks.',"There weren’t ___ boys at the park.",'There were ___ girls flying a big kite.'],[],['some','any']);
matching(2,15,4,['How many horses',"There weren’t",'There were three'],{a:'any goats.',b:'donkeys.',c:'some ducks.',d:'were there?'});

// Original underline/circle choices are kept as choices, not invented distractors.
const choiceSections={
 '1:3:2':[['three ___','two ___','four ___','one ___','five ___'],[['lion','lions'],['eye','eyes'],['kite','kites'],['faces','face'],['leg','legs']]],
 '1:8:3':[['___ Grandpa?','___ Billy?','___ my mum and dad?','___ my cousins?'],Array(4).fill(["Where's",'Where are'])],
 '2:4:3':[["Have you got a pizza? No, I ___.",'___ she got fries?','Yes, she ___.','___ you got salad?','Yes, I ___.'],[["hasn't",'have',"haven't"],['Are','Has','Have'],['has',"hasn't",'have'],['Is','Has','Have'],['has','have',"haven't"]]],
 '2:7:4':[['What does ___ like?','He ___ chocolate.','What ___ she like?','She ___ like nuts.'],[['I','they','he'],['like','likes',"doesn't"],['do','does',"don't"],["don't","hasn't","doesn't"]]],
 '2:10:3':[['___ on your sun cream.','___ the window.','___ your coat.'],[['Put',"Don't put"],['Open',"Don't open"],['Wear',"Don't wear"]]],
 '2:12:2':[['___ your hair','___ the car'],[['make','brush'],['brush','wash']]],
 '2:14:4':[['You ___ naughty.','They ___ wet.','He ___ cold.','We ___ scared.'],Array(4).fill(["wasn't","weren't"])]
};
for(const [k,[lines,choices]]of Object.entries(choiceSections)){const previous=section[k];section[k]=(a,i)=>{const v=previous(a,i);return {...v,text:lines[i],type:v.visual?'lookChoose':'readChoose',prompt:'Choose the correct word.',choices:choices[i]};};}

const pictureChoicePairs={
 '1:2:1':[['bike','kite'],['car','hat'],['doll','ball'],['train','puzzle']],
 '1:9:1':[['biscuit','drinks'],['egg','tomato'],['sandwich','fig']],
 '1:12:1':[['meat','sandwich'],['tomatoes','carrots'],['bread','biscuit']],
 '1:15:1':[['shell','sea'],['cat','crab'],['ball','boat'],['ice cream','bat']],
 '2:9:2':[['police station','hospital'],['bank','station'],['school','fire station']],
 '2:2:3':[["He's","She's","We're"],["I'm","We're","They're"],["I'm","He's","They're"]]
};
for(const [k,choices]of Object.entries(pictureChoicePairs)){const previous=section[k];section[k]=(a,i)=>({...previous(a,i),type:'lookChoose',prompt:'Look and choose.',choices:choices[i]});}
for(const k of ['1:5:1','1:8:1','1:10:1']){const previous=section[k];section[k]=(a,i)=>({...previous(a,i),type:'lookChoose',prompt:'Choose yes or no.',choices:['yes','no']});}

module.exports=function(q,b,u,e,i){
 const fn=section[`${b}:${u}:${e}`];if(!fn)throw Error('Missing source transcription '+[b,u,e]);const v=fn(q.answer,i);
 if(!v||typeof v.text!=='string')throw Error('Missing source item '+q.id);
 if(['readWrite','lookWrite','build','lookOdd'].includes(v.type)){q.inputMode='typing';q.acceptedAnswers||=[q.answer];q.options=[];}
 delete q.sourceImage;delete q.sourceImageAlt;delete q.sourceCaption;delete q.picturePrompt;
 q.scene=v.text;q.prompt=v.prompt;q.spokenScene=v.text;q.spokenPrompt=v.prompt;q.visual=v.visual;q.partType=v.type;q.partInstruction=v.prompt;q.partTitle=v.prompt.replace(/\.$/,'');q.wordBank=v.bank;q.responseFormat=v.format||(q.answer.includes(' / ')?'Write each answer in order. Separate answers with / .':undefined);q.optionLabels=v.optionLabels;
 // Retain each source matching letter; show its full target in the button.
 if(v.optionLabels){q.options=Object.keys(v.optionLabels);delete q.inputMode;delete q.acceptedAnswers;}
 if(v.choices){q.options=v.choices;delete q.inputMode;delete q.acceptedAnswers;}
 if(/Put the letters|Complete the word/.test(v.prompt)||/[A-Za-z]_+|_+[A-Za-z]/.test(v.text))q.spokenScene='';
 q.source.presentation='Retyped source exercise with new colour vector illustration';
 q.why=`${q.title}: ${q.optionLabels?.[q.answer]||q.answer}.`+(e>=3?' '+require('./family-grammar-rules.cjs')[b][u-1]:'');
 if(v.otherBlanks)q.scene=q.spokenScene='On Monday I go swimming. I (2) ___ (3) ___ a music lesson.\nOn Wednesday I do my homework. I (4) ___ (5) ___ with my friends.\nOn Saturday I (6) ___ my grandma. I (7) ___ (8) ___ TV.';
 return q;
};
