/* Each interactive region is measured on its final illustration, never on a generic grid. */
const family=require('./family-units.cjs'),source=require('./discover-resources.json'),old=require('./context-reviews.cjs');
const place=(x,y,w=6,h=9,angle=0)=>({x,y,w,h,angle});
function artClass(){
 const u=family[1][0],course='family-friends-1',unit=1;
 const zones=[{id:'table',label:'table',...place(48,46,48,8)},{id:'teacher',label:'teacher’s hand',...place(18,34,8,7)},{id:'drawer',label:'inside the drawer',...place(67,54,9,6)},{id:'under-table',label:'under the table',...place(48,68,34,7)},{id:'shelf',label:'bookcase shelf',...place(89,45,16,6)},{id:'basket',label:'basket',...place(5,68,8,5)},{id:'box',label:'box',...place(95,67,9,5)}];
 const positions={pencil:place(32,88,7,8,-14),pen:place(42,87,7,8,20),rubber:place(53,87,6,7),ruler:place(64,88,8,8,-18),book:place(77,85,8,10),bag:place(25,77,8,12),folder:place(86,89,8,10)};
 const objects=Object.entries(positions).map(([word,p])=>({id:word,word,picture:old.picture(word),...p}));
 objects.push({id:'window',word:'window',fixed:true,...place(32,15,21,28)},{id:'door',word:'door',fixed:true,...place(68,22,14,40)},{id:'bookcase',word:'bookcase',fixed:true,...place(90,32,17,55)},{id:'sun',word:'sun',fixed:true,sun:true,...place(50,24,10,17)});
 const world={id:'family-friends-1-u1-command-v4',title:'Art Class',image:'family-friends-1-unit-1.webp',width:1672,height:941,objects,zones,palette:[{id:'color-yellow',name:'yellow',hex:'#ffd44d'},{id:'color-orange',name:'orange',hex:'#fba24d'},{id:'color-blue',name:'blue',hex:'#6dacf0'}],lips:['60.5% 55%,67% 56.5%,73% 54.5%,73% 61.5%,60.5% 61.5%','0% 69%,5% 71%,10.5% 68%,10.5% 79%,0% 79%','88% 69%,95% 72%,100% 69%,100% 81%,88% 81%']};
 const action=(object,target,phrase,fit)=>({object,target,phrase,position:fit||place(zones.find(z=>z.id===target).x,zones.find(z=>z.id===target).y,5,7)}),point=(object,phrase)=>({object,target:'point',action:'point',phrase}),paint=(color)=>({object:'sun',target:'color-'+color,action:'color',color:{yellow:'#ffd44d',orange:'#fba24d'}[color],phrase:'Color the sun '+color+'.'});
 const rows=[
 [action('pencil','table','Put the pencil on the table.')],
 [action('pen','teacher','Give the pen to the teacher.',place(18,33,4,6,-25))],
 [action('rubber','drawer','Put the rubber inside the desk drawer.',place(66,54,3.5,4))],
 [action('ruler','under-table','Put the ruler under the table.',place(44,68,6,5,-4))],
 [action('book','shelf','Place the book on the bookcase shelf.',place(87,43,5,7))],
 [action('bag','basket','Put the bag in the basket.',place(5,67,6,9))],
 [action('folder','box','Put the folder in the box.',place(95,67,6,8))],
 [point('window','Point to the window behind the children.')],
 [point('door','Point to the door beside the bookcase.')],
 [point('bookcase','Point to the furniture where we keep our books.')],
 [paint('yellow')],
 [action('pencil','teacher','Take the pencil from the table and give it to the teacher.',place(18,33,4,6,-25))],
 [action('pen','drawer','The teacher has finished writing. Put the pen inside the drawer.',place(68,54,3,5))],
 [action('book','table','Bring the book from the shelf to the table.',place(43,46,6,7))],
 [action('rubber','box','Take the rubber out of the drawer and put it in the box.',place(93,68,3.5,4))],
 [action('folder','under-table','Put the folder under the table.',place(56,68,6,6))],
 [action('bag','under-table','Move the bag from the basket to a place under the table.',place(38,65,6,10)),action('ruler','basket','Then put the ruler in the basket.',place(5,66,4,7))],
 [action('book','teacher','Give the book to the teacher.',place(18,33,5,7)),action('pencil','drawer','Then put the pencil inside the drawer.',place(65,54,4,5))],
 [paint('orange'),action('folder','shelf','Then place the folder on the bookcase shelf.',place(92,43,5,7))],
 [action('bag','box','Put the bag in the box.',place(95,66,6,10)),action('rubber','drawer','Then put the rubber back inside the drawer.',place(68,54,3.5,4))]
 ];
 const items=rows.map((steps,i)=>({id:course+'-u1-command-v4-'+(i+1),type:'choice',title:'Art Class',partType:'sceneActions',partInstruction:'Listen and follow the commands. Move, point or color.',prompt:'',scene:'',spokenScene:steps.map(s=>s.phrase).join(' '),skill:'listening',keepOrder:true,phonicsSequence:true,difficulty:i<7?'easy':i<16?'medium':'advanced',options:[],answer:steps.map(s=>s.object+'>'+s.target).join('|'),why:steps.map(s=>s.phrase).join(' '),source:{url:u.bookURL,page:u.page,unit,adaptation:'Centre-authored command practice using verified Unit vocabulary and basic art vocabulary.'},resourceEvidence:steps.map(s=>s.object),resourceTask:{kind:'sceneActions',sceneVersion:4,worldId:world.id,steps,retryOnWrong:true}}));
 return {version:4,storageRevision:4,course,unit,kind:'sceneActions',title:'Art Class · Listen & Follow',sourceWords:[...u.words,...u.extra].map(w=>typeof w==='string'?w:w.word),world,items};
}
function newYear(){
 const course='discover-1',unit=1,u=source.books[0].units[0];
 // Coordinates are installed only after the final painting has been inspected.
 const actors=require('./new-year-actors.json');
 const world={id:'discover-1-u1-detective-v4',title:'New Year Party',image:'discover-1-unit-1.webp',width:1672,height:941,objects:actors.map(o=>({...o,fixed:true})),zones:[]};
 const rows=[
 ['grandmother',['grandma'],'She is a parent of a parent. Her silver hair is tied in a bun, and she is knitting.'],
 ['grandfather',['grandpa'],'He is a parent of a parent. He has white hair and glasses, and he is holding a mug.'],
 ['father',['dad'],'This adult man is a parent. He wears green and is holding a wrapped gift.'],
 ['mother',['mum'],'This adult woman is a parent. She wears yellow and stands beside the snack table.'],
 ['brother',['boy'],'He is the little girl’s male sibling. He is building something on the rug.'],
 ['sister',['girl'],'She is the red-sweater boy’s female sibling. She is writing a card.'],
 ['friend',['friend'],'He is visiting the family, rather than being a relative. He has curly hair and is greeting another child.'],
 ['son',['boy'],'The parents in green and yellow have a male child wearing red. Who is he?'],
 ['daughter',['girl'],'The parents in green and yellow have a female child wearing turquoise. Who is she?'],
 ['aunt',['aunt'],'She is the mother’s sister. She is arranging the flowers.'],
 ['uncle',['uncle'],'He is the father’s brother. He is making music with a small stringed instrument.'],
 ['cousin',['cousin'],'He is the aunt and uncle’s son. He is holding a kite near the doorway.'],
 ['parents',['dad','mum'],'Find both adults who are the mother and father of the two children on the rug.'],
 ['family',['grandma','grandpa','dad','mum','boy','girl','aunt','uncle','cousin'],'Find the relatives at the party. Leave out the visiting friend.'],
 ['grandmother',['grandma'],'She is older than the mother and has a ball of wool.'],
 ['grandfather',['grandpa'],'Find the elderly man whose warm drink is in a mug.'],
 ['aunt',['aunt'],'One adult is helping with the flowers instead of playing music. Find her.'],
 ['uncle',['uncle'],'Find the adult whose hands are busy playing an instrument.'],
 ['sister',['girl'],'Find the child making a written greeting instead of building with blocks.'],
 ['friend',['friend'],'Which visiting child is sharing a friendly greeting with the child holding a kite?']
 ];
 const items=rows.map(([word,targets,clue],i)=>({id:course+'-u1-detective-v4-'+(i+1),type:'choice',title:'New Year Party',partType:'detectiveScene',partInstruction:'Listen to the clues. Tap each person described. The boy in blue is the cousin, and the visitor in white is his friend.',prompt:'',scene:'',spokenScene:clue,skill:'listening',keepOrder:true,phonicsSequence:true,difficulty:i<8?'easy':i<13?'medium':'advanced',options:[],answer:targets.join('|'),why:'Từ vựng trong Unit: '+word+'. '+clue,source:{unit,url:[...u.words,...u.extra].find(w=>w.word===word)?.source||u.words[0].source,adaptation:'Centre-authored family context; the clues establish relationships, the original Unit vocabulary is retained.'},resourceEvidence:[word],resourceTask:{kind:'detectiveScene',sceneVersion:4,worldId:world.id,targets,retryOnWrong:true}}));
 return {version:4,storageRevision:4,course,unit,kind:'detectiveScene',title:'New Year Party · Detective Listening',sourceWords:[...u.words,...u.extra].map(w=>w.word),world,items};
}
module.exports={artClass,newYear};
