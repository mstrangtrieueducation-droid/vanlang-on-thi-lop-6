/* Each interactive region is measured on its final illustration, never on a generic grid. */
const family=require('./family-units.cjs'),source=require('./discover-resources.json'),old=require('./context-reviews.cjs');
const place=(x,y,w=6,h=9,angle=0)=>({x,y,w,h,angle});
function artClass(){
 const u=family[1][0],course='family-friends-1',unit=1;
 // Pixel boxes [left,top,right,bottom] are measured on the final 1672 x 941 painting.
 const box=(l,t,r,b,angle=0)=>place(Math.round((l+r)/2/1672*1000)/10,Math.round((t+b)/2/941*1000)/10,Math.round((r-l)/1672*1000)/10,Math.round((b-t)/941*1000)/10,angle);
 const zones=[{id:'under-table',label:'under the table',...box(480,640,910,775)},{id:'table',label:'table',...box(430,487,1190,622)},{id:'teacher',label:'teacher',...box(205,100,488,610)},{id:'boy',label:'boy',...box(570,265,750,515)},{id:'girl',label:'girl',...box(935,275,1190,510)},{id:'drawer',label:'inside the drawer',...box(915,625,1168,725)},{id:'shelf',label:'bookcase shelf',...box(1478,352,1660,445)},{id:'basket',label:'basket',...box(398,760,608,940)},{id:'box',label:'box',...box(1388,678,1635,892)}];
 // Movable supplies rest on real surfaces, and never begin inside a place a command names.
 const start={'red-book':box(1276,364,1364,424,-4),'blue-book':box(1240,624,1312,672),'orange-pencil':box(82,478,158,526),'yellow-pencil':box(662,882,740,932),'pink-pen':box(974,826,1046,866),'blue-pen':box(1372,408,1432,442),'white-rubber':box(1258,292,1302,320),'pink-rubber':box(482,342,530,366),'yellow-ruler':box(1222,892,1322,938),'blue-ruler':box(70,560,154,600),'red-bag':box(1252,480,1348,576),'blue-bag':box(270,820,370,920),'orange-folder':box(1190,460,1260,520),'purple-folder':box(862,830,944,896,-5)};
 const objects=Object.entries(start).map(([id,p])=>{const [colour,noun]=id.split('-');return {id,word:colour+' '+noun,noun,picture:{src:'../game-kit/adventures/unit-scenes-v4/art-class-objects/'+id+'.webp',artwork:'Centre-authored educational illustration'},...p};});
 objects.push({id:'window',word:'window',fixed:true,...box(1265,0,1480,320)},{id:'door',word:'door',fixed:true,...box(20,20,222,455)},{id:'bookcase',word:'bookcase',fixed:true,...box(1465,105,1672,600)},{id:'sun',word:'sun',fixed:true,sun:true,sunPath:'M90.8 50.4L94.2 52.7L99.0 55.4L94.9 57.3L91.3 59.0L87.1 60.1L84.0 61.2L81.8 62.3L81.4 64.1L82.1 66.4L83.8 69.5L85.6 73.0L87.9 77.3L90.2 82.2L85.4 81.6L80.0 79.8L75.4 78.1L71.8 77.0L70.4 78.1L69.0 79.3L68.6 82.2L68.7 86.6L68.6 91.7L68.6 98.4L65.4 97.4L61.1 92.1L57.9 88.3L55.3 85.6L53.2 83.8L51.4 83.7L49.6 83.7L47.6 86.5L45.3 90.0L42.5 93.4L39.1 97.9L36.1 99.0L35.4 92.6L34.9 87.3L34.5 83.2L34.0 79.9L32.5 79.0L31.3 77.6L28.8 78.1L25.5 79.2L21.0 81.1L15.7 83.2L10.9 84.0L13.9 78.3L16.7 73.5L18.4 69.9L20.2 66.8L19.6 65.2L19.1 63.5L17.4 62.3L14.0 61.6L10.3 60.6L5.8 59.4L0.8 57.9L2.2 55.2L6.4 52.6L10.4 50.4L13.4 48.6L16.1 47.0L16.4 45.3L15.5 43.4L12.9 40.9L9.8 37.9L7.0 34.6L3.4 30.5L6.3 29.1L12.6 29.8L16.7 29.8L20.2 29.8L22.5 29.2L23.7 27.9L23.7 25.4L22.0 20.8L20.9 16.2L19.1 10.0L21.2 8.2L26.5 11.7L30.6 14.4L34.3 17.4L37.1 19.0L38.8 18.4L40.6 17.9L41.8 15.3L43.0 10.5L44.7 6.0L46.9 1.0L49.6 2.1L51.9 7.2L53.7 12.2L55.2 15.8L56.7 17.8L58.4 18.5L60.1 19.0L62.9 16.9L66.1 14.5L70.0 11.6L74.7 8.3L77.4 8.9L75.7 15.7L74.4 20.8L73.2 25.0L73.8 27.0L74.6 28.7L76.6 29.2L79.8 29.1L84.4 28.6L89.6 28.1L94.9 28.1L91.5 32.4L88.3 36.0L85.4 39.1L83.2 41.7L82.7 43.6L83.1 45.3L85.0 46.8L87.8 48.5Z',...box(700,193,871,370)},{id:'calendar',word:'calendar',fixed:true,calendar:{days:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],left:4.7,top:10.5,width:91,height:16.5},...box(345,35,622,262)});
 const world={id:'family-friends-1-u1-command-v5',title:'Art Class',image:'family-friends-1-unit-1.webp',width:1672,height:941,hideWordBank:true,objects,zones,palette:[{id:'color-yellow',name:'yellow',hex:'#ffd44d'},{id:'color-orange',name:'orange',hex:'#f07c1e'},{id:'color-blue',name:'blue',hex:'#6dacf0'}],lips:['54.8% 72.2%,69.9% 72.2%,69.9% 77%,54.8% 77%','23.8% 88.2%,30% 92.2%,36.4% 88.2%,36.4% 100%,23.8% 100%','83% 80.8%,97.8% 84%,97.8% 94.8%,83% 94.8%']};
 const action=(object,target,phrase)=>{const z=zones.find(z=>z.id===target);return {object,target,phrase,position:place(z.x,z.y,5,7)};},point=(object,phrase)=>({object,target:'point',action:'point',phrase}),paint=(color)=>({object:'sun',target:'color-'+color,action:'color',color:{yellow:'#ffd44d',orange:'#f07c1e'}[color],phrase:'Color the sun '+color+'.'}),day=(name,phrase)=>({object:'calendar',target:'day-'+name.toLowerCase(),action:'day',day:name,phrase:phrase||'Tap '+name+' on the calendar.'});
 const rows=[
 [action('red-book','shelf','Put the red book on the shelf.')],
 [action('blue-book','teacher','Give the blue book to the teacher.')],
 [action('orange-pencil','boy','Give the orange pencil to the boy.')],
 [action('pink-pen','girl','Give the pink pen to the girl.')],
 [day('Tuesday')],
 [action('white-rubber','drawer','Put the white rubber in the drawer.')],
 [action('red-bag','basket','Put the red bag in the basket.')],
 [point('window','Point to the window behind the girl.')],
 [point('door','Point to the door behind the teacher.')],
 [point('bookcase','Point to the furniture where we keep our books.')],
 [paint('yellow')],
 [action('orange-folder','box','Put the orange folder in the box.')],
 [action('blue-ruler','under-table','Put the blue ruler under the table.')],
 [action('yellow-ruler','table','Put the yellow ruler on the table.')],
 [day('Friday')],
 [action('blue-pen','teacher','Give the blue pen to the teacher.')],
 [action('yellow-pencil','girl','Give the yellow pencil to the girl.'),action('blue-bag','box','Then put the blue bag in the box.')],
 [action('pink-rubber','table','Put the pink rubber on the table.'),action('purple-folder','boy','Then give the purple folder to the boy.')],
 [paint('orange'),action('blue-book','shelf','Then put the blue book on the shelf.')],
 [day('Monday'),action('red-book','basket','Then put the red book in the basket.')]
 ];
 const evidence=id=>objects.find(o=>o.id===id).noun||id;
 const items=rows.map((steps,i)=>({id:course+'-u1-command-v5-'+(i+1),type:'choice',title:'Art Class',partType:'sceneActions',partInstruction:'Listen and follow the commands. Move, point or color.',prompt:'',scene:'',spokenScene:steps.map(s=>s.phrase).join(' '),skill:'listening',keepOrder:true,phonicsSequence:true,difficulty:i<7?'easy':i<16?'medium':'advanced',options:[],answer:steps.map(s=>s.object+'>'+s.target).join('|'),why:steps.map(s=>s.phrase).join(' '),source:{url:u.bookURL,page:u.page,unit,adaptation:'Centre-authored command practice using verified Unit vocabulary, colours and days taught in the Starter Unit, and basic art vocabulary.'},resourceEvidence:steps.map(s=>evidence(s.object)),resourceTask:{kind:'sceneActions',sceneVersion:4,worldId:world.id,steps,retryOnWrong:true}}));
 return {version:4,storageRevision:5,course,unit,kind:'sceneActions',title:'Art Class · Listen & Follow',sourceWords:[...u.words,...u.extra].map(w=>typeof w==='string'?w:w.word),world,items};
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
