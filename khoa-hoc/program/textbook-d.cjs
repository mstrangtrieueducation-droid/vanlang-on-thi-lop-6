/* Exercise D transcriptions. Page numbers are PDF pages (printed page + 1).
 * These are source tasks, not generated replacement mazes. A digital item may
 * contain several book sub-items; its existing quiz ID/transport key is stable.
 * Source image coordinates are percentages of the exported D crop. */
const books={1:{},2:{},3:{},4:{}};
function add(book,sound,page,kind,instruction,answers=[],extra={}){
 books[book][sound]={book,sound,page,printedPage:page-1,kind,instruction,answers,...extra};
}
const P=(book,sound,page,kind,instruction,answers,extra)=>add(book,sound,page,kind,instruction,answers,extra);
P(1,'a',6,'listenLetter','Listen. Then write Aa or cross it out.',[],{audio:[1,5],letter:'Aa'});
P(1,'b',8,'soundConnect','Connect. Then write Bb.',['Bb'],{targets:['bear','banana','bird','bed'],letter:'Bb'});
P(1,'c',10,'letterMatch','Write Cc. Then match.',['Cc'],{targets:[1,3,5,7],pictures:['car','bird','cat','ax','computer','alligator','cup','banana']});
P(1,'d',14,'pictureCircle','Which one begins with the d sound? Listen and circle.',[],{audio:[1,17],choices:[['computer','ant','doll','bird'],['desk','banana','apple','cup'],['bed','dog','cat','alligator'],['ax','bear','car','duck']],correct:[2,0,1,3]});
P(1,'e',16,'listenLetter','Listen. Then write Ee or cross it out.',[],{audio:[1,21],letter:'Ee'});
P(1,'f',18,'shadowMatch','Match and write.',['Ff','Ff','Ff','Ff'],{pictures:['fan','fish','fork','farm'],matches:[2,3,0,1]});
P(1,'g',26,'pictureCircle','Which one begins with the g sound? Listen and circle.',[],{audio:[1,34],choices:[['envelope','alligator','bed','goat'],['elephant','gorilla','fan','cat'],['girl','bear','desk','farm'],['egg','doll','gift','cup']],correct:[3,1,0,2]});
P(1,'h',28,'listenLetterMatch','Listen and write. Then match.',[],{audio:[1,38],pictures:['hot dog','hat','elbow','horse','goat','house']});
P(1,'i',30,'traceColor','Which ones begin with the i sound? Trace and color.',[],{pictures:['ink','house','igloo','alligator','car','insect'],targets:[1,3,6]});
P(1,'j',34,'soundConnect','Connect. Then write Jj.',['Jj'],{targets:['jam','juice','jacket','jet'],letter:'Jj'});
P(1,'k',36,'listenLetter','Listen. Then write Kk or cross it out.',[],{audio:[1,50],letter:'Kk'});
P(1,'l',38,'letterMatch','Write Ll. Then match.',['Ll'],{pictures:['key','lemon','car','lion','elbow','lamp','king','leaf'],targets:[2,4,6,8]});
P(1,'m',46,'listenLetterMatch','Listen and write. Then match.',[],{audio:[2,4],pictures:['kangaroo','mouse','milk','insect','monkey','money']});
P(1,'n',48,'shadowMatch','Match and write.',['Nn','Nn','Nn','Nn'],{pictures:['net','nut','nest','nose'],matches:[3,1,0,2]});
P(1,'o',50,'traceColor','Which ones begin with the o sound? Trace and color.',[],{pictures:['ox','panda','envelope','ostrich','olive','nose','horse','octopus'],targets:[1,4,5,8]});
P(1,'p',54,'pictureCircle','Which one begins with the p sound? Listen and circle.',[],{audio:[2,16],choices:[['nut','pen','milk','horse'],['panda','king','fish','gift'],['dog','lamp','octopus','peach'],['computer','pineapple','jacket','ink']],correct:[1,0,3,1]});
P(1,'q',56,'shadowMatch','Match and write.',['Qq','Qq','Qq','Qq'],{pictures:['quilt','quiz','queen','question'],matches:[3,0,1,2]});
P(1,'r',58,'soundConnect','Connect. Then write Rr.',['Rr'],{targets:['rabbit','rose','robot','rice'],letter:'Rr'});
P(1,'s',66,'letterMatch','Write Ss. Then match.',['Ss'],{pictures:['soap','seal','kangaroo','sun','olive','socks','pineapple','iguana'],targets:[1,2,4,6]});
P(1,'t',68,'traceColor','Which ones begin with the t sound? Trace and color.',[],{pictures:['tiger','socks','table','turtle','gift','tent'],targets:[1,3,4,6]});
P(1,'u',70,'listenLetterMatch','Listen and write. Then match.',[],{audio:[2,38],pictures:['uncle','juice','umbrella','teacher','umpire','up']});
P(1,'w',76,'listenLetter','Listen. Then write Ww or cross it out.',[],{audio:[2,48],letter:'Ww'});
P(1,'x',78,'shadowMatch','Match. Then write Xx.',['Xx','Xx','Xx','Xx'],{pictures:['box','six','fox','wax'],matches:[3,2,0,1]});
P(1,'y',80,'listenLetterMatch','Listen and write. Then match.',[],{audio:[2,55],pictures:['yak','water','peach','kite','yacht','yogurt']});
P(1,'z',82,'soundConnect','Connect. Then write Zz.',['Zz'],{targets:['zebra','zero','zipper','zoo'],letter:'Zz'});

P(2,'a',6,'listenRead','Listen and chant. Then read.',[],{audio:[1,6]});
P(2,'am',8,'write','Read and write.',['ram','dam','yam','jam']);
P(2,'an',10,'checkWrite','Read, check, and write.',['man','pan','can','fan'],{choices:[['yak','man','pan'],['pan','dam','fan'],['man','jam','can'],['can','fan','cat']]});
P(2,'ad,ag',14,'circleWrite','Circle and write.',['bag','rag','dad','pad'],{choices:[['b','a','g'],['b','r','a','g'],['d','p','a','d'],['p','a','b','d']],correct:[[0,1,2],[1,2,3],[0,2,3],[0,1,3]]});
P(2,'ap',16,'routeMatchWrite','Read and match. Then write.',['tap','cap','nap','map']);
P(2,'at',18,'listenBlend','Listen, match, and write.',[],{audio:[1,28],choices:[['r','m','b'],['h','r','b'],['c','r','m'],['m','b','h']],suffix:'at'});
P(2,'e',26,'listenRead','Listen and chant. Then read.',[],{audio:[1,38]});
P(2,'et',28,'checkWrite','Read, check, and write.',['wet','pet','jet','net'],{choices:[['wet','net','vet'],['egg','pet','jet'],['jet','wet','web'],['pet','ten','net']]});
P(2,'en,ed',30,'pairCircleWrite','Circle and write.',['red','red','hen','bed'],{choices:[['hen','red'],['pen','red'],['bed','hen'],['red','bed']]});
P(2,'i',34,'listenRead','Listen and chant. Then read.',[],{audio:[1,52]});
P(2,'ip',36,'write','Read and write.',['lip','sip','rip','tip']);
P(2,'in',46,'listenBlend','Listen, match, and write.',[],{audio:[2,5],choices:[['w','b','p'],['f','w','p'],['b','f','w'],['f','p','b']],suffix:'in'});
P(2,'ig',48,'routeMatchWrite','Read and match. Then write.',['fig','wig','dig','big']);
P(2,'o',54,'listenRead','Listen and chant. Then read.',[],{audio:[2,20]});
P(2,'ot',56,'circleWrite','Circle and write.',['cot','hot','dot','pot'],{choices:[['c','h','o','t'],['h','o','x','t'],['d','o','t','p'],['p','t','o','t']],correct:[[0,2,3],[0,1,3],[0,1,2],[0,2,3]]});
P(2,'op',58,'checkWrite','Read, check, and write.',['mop','pop','top','hop'],{choices:[['top','log','mop'],['hop','pop','cot'],['pop','hot','top'],['hop','mop','rod']]});
P(2,'ug',68,'write','Read and write.',['bug','mug','rug']);
P(2,'up,ud',70,'routeMatchWrite','Read and match. Then write.',['cup','bud','mud','pup']);
P(2,'ut',74,'listenBlend','Listen, match, and write.',[],{audio:[2,51],choices:[['n','h','c'],['n','c','h'],['c','h','n']],suffix:'ut'});
P(2,'un',78,'circleWrite','Circle and write.',['run','bun','fun'],{choices:[['r','b','u','n'],['b','u','p','n'],['f','u','n','r']],correct:[[0,2,3],[0,1,3],[0,1,2]]});

P(3,'a_e',6,'listenCircle','Listen, read, and circle.',[],{audio:[1,6],choices:[['can','cane'],['cape','cap'],['mane','man'],['tap','tape']],pictures:[['cape','cane','can'],['candy cane','cap','cape'],['cane','mane','man'],['tape','cape','tap']]});
P(3,'i_e',14,'soundWrite','Look. Then circle and write.',['kite','pin','fin','ripe'],{choices:[['i','i_e'],['i','i_e'],['i','i_e'],['i','i_e']],correct:[1,0,0,1]});
P(3,'o_e',26,'listenWrite','Listen and write.',[],{audio:[1,39]});
P(3,'ai',34,'write','Write and read.',['wait','nail','rain','tail']);
P(3,'ay',36,'listenWrite','Listen and write.',['say','day','pay','bay'],{audio:[1,58]});
P(3,'ee',46,'drawWrite',"What's missing? Draw and write.",['bee','jeep','feet','seed']);
P(3,'ea',48,'listenWrite','Listen and write.',['eat','leaf','sea','meat'],{audio:[2,9]});
P(3,'igh',54,'listenWrite','Listen, write, and read.',[],{audio:[2,20]});
P(3,'ie',56,'number','Which is on the right? Read and number.',['1','4','2','3']);
P(3,'oa',66,'listenPuzzle','Listen and write. Then work out the answer.',['coat','soap','road','boat','boat'],{audio:[2,37]});
P(3,'ow',68,'listenWrite','Listen and write.',['yellow','pillow','bow','elbow','soap','yellow','row','boat'],{audio:[2,42]});
P(3,'ue',74,'check','Read and check.',['My coat is blue.','The glue is in the bag.','I see a blue cube.','It is Tuesday.'],{choices:[['My coat is glue.','My coat is blue.'],['The clue is in the bag.','The glue is in the bag.'],['I see a blue cube.','I see a blue clue.'],['It is Tuesday.','It is May.']]});
P(3,'oo',78,'listenWrite','Listen and write.',['food','boot','moon','zoo'],{audio:[2,60]});

P(4,'bl,cl',6,'check','Read and check.',['The bee on the bud is yellow and black.','The kids are in a club.','Can you see the blue clock?','I have a black blanket.'],{choices:[['The bee on the bud is yellow and blue.','The bee on the bud is yellow and black.'],['The kids are in a club.','The kids are in a cave.'],['Can you see the blue clock?','Can you see the blue clue?'],['I have a black coat.','I have a black blanket.']]});
P(4,'fr,gr',14,'wordPictureWrite','Match and write.',['green','Friday','grass','frog'],{words:['frog','grass','green','Friday'],pictureWords:['green','Friday','frog','grass'],matches:[2,3,0,1]});
P(4,'sm,sn',26,'write','Write.',['smoke','clock','smile','snow','crab','snake']);
P(4,'st',30,'check','Read and check.',['That yellow jeep is fast.','Mike takes a ride on Friday.','We stop the game in the rain.','She puts a stamp on the mail.'],{choices:[['That yellow jeep is fast.','That yellow jeep is sad.'],['Mike takes a ride on Friday.','Mike takes a fast on Friday.'],['We stop the game in the rain.','We play the game in the rain.'],['She puts a spot on the mail.','She puts a stamp on the mail.']]});
P(4,'sh',34,'listenBlendParts','Listen and match. Then write.',[],{audio:[1,52]});
P(4,'ch,tch',36,'unscramble','Unscramble and write.',['catch','chick','lunch','watch'],{scrambled:['thcca','hickc','lchnu','acwht']});
P(4,'th-voiced',46,'check','Read and check.',['This is my father.','This is my mother.','That is my father.','That is my mother.'],{choices:[['This is my mother.','This is my father.'],['This is my mother.','That is my mother.'],['That is my father.','This is my father.'],['That is my mother.','That is my father.']]});
P(4,'ng,nk',54,'write','Write.',['long','bath','pink','king','duck','bank']);
P(4,'sk,sc',66,'write','Read and write.',['desk','scale','skunk','school']);
P(4,'g-soft',76,'wordSearch','Circle and write.',['cage','giant','giraffe','orange'],{strings:['gerasirgor cage','afeogiantlobar','regigiraffeob','ncaorangeenar'].map(s=>s.replace(/ /g,''))});
P(1,'v',72,'pictureCircle','Which one begins with the v sound? Listen and circle.',[],{audio:[2,42],choices:[['money','sun','hot dog','vest'],['tent','violin','bed','lemon'],['van','envelope','umpire','leaf'],['girl','vet','jet','seal']],correct:[3,1,0,1]});
P(2,'u',66,'listenRead','Listen and chant. Then read.',[],{audio:[2,37]});
P(3,'ai,ay',38,'soundWrite','Look. Then circle and write.',['bay','nail','mail','pay','wait','May'],{choices:Array.from({length:6},()=>['ai','ay']),correct:[1,0,0,1,0,1]});
P(3,'oa,ow',70,'soundWrite','Look. Then circle and write.',['goat','bow','elbow','toad','window','road'],{choices:Array.from({length:6},()=>['oa','ow']),correct:[0,1,1,0,1,0]});
// Corrections checked against the original images and the actual numbered audio.
books[1].n.matches=[3,2,1,0];books[1].q.matches=[3,0,2,1];books[1].i.pictures[3]='iguana';books[1].i.targets=[1,3,4,6];
books[1].a.answers=['Aa','×','Aa','Aa','×','Aa'];
books[1].e.answers=['×','Ee','Ee','×','Ee','×','×','Ee'];
books[1].k.answers=['×','Kk','Kk','×','Kk','×','×','Kk'];
books[1].w.answers=['Ww','×','Ww','Ww','×','Ww'];
books[1].h.answers=['Hh','Gg','Hh','Ee','Hh','Hh'];books[1].h.matches=[1,4,5,2,0,3];
books[1].m.answers=['Mm','Mm','Ii','Kk','Mm','Mm'];books[1].m.matches=[4,2,3,0,5,1];
books[1].u.answers=['Uu','Uu','Uu','Jj','Uu','Tt'];books[1].u.matches=[0,4,5,1,2,3];
books[1].y.pictures[2]='yo-yo';books[1].y.answers=['Kk','Yy','Ww','Yy','Yy','Yy'];books[1].y.matches=[3,5,1,0,4,2];
books[2].at.answers=['rat','hat','mat','bat'];books[2].in.answers=['pin','win','fin','bin'];books[2].ut.answers=['cut','nut','hut'];books[2]['en,ed'].answers=['red','pen','hen','bed'];books[2]['en,ed'].choices[3]=['pen','bed'];books[2]['ad,ag'].choices[0]=['b','a','r','g'];books[2]['ad,ag'].correct[0]=[0,1,3];
books[3].a_e.answers=['cane','cape','mane','tape'];books[3].a_e.correct=[1,0,0,1];books[3].a_e.correctPictures=[1,2,1,0];
books[3].o_e.answers=['bone','rope','home','cone'];books[3].igh.answers=['night','high','right','light'];books[3].oa.answers[4]='coat';
books[3].ow.answers=['yellow','pillow','bow','coat','soap','yellow','row','boat'];books[3].oo.answers=['food','boot','zoo','moon'];
books[4]['fr,gr'].answers=['frog','grass','green','Friday'];
books[4].sh.answers=['brush','stop','ship','shell','fast','fish'];
books[4].sh.parts=Array.from({length:6},(_,i)=>[1,4].includes(i)?['fa','te','st','op','amp']:['fi','bru','sh','ip','ell']);
books[3]['ai,ay'].choices=[['ai','ay'],['ay','ai'],['ay','ai'],['ai','ay'],['ai','ay'],['ay','ai']];books[3]['ai,ay'].correct=[1,1,1,1,0,0];
module.exports={books};
