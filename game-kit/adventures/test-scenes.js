/* Fresh vector scenes for source tests. No raster scan or external asset request. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.TestScenes=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const rect=(x,y,w,h,fill='#ffd365',r=10)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
 const line=(x,y,a,b,color='#314258',width=4)=>`<path d="M${x} ${y}L${a} ${b}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
 const circle=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const text=(s,x,y,size=18)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" font-weight="700" fill="#24374d">${esc(s)}</text>`;
 const shape=(d,c)=>`<path d="${d}" fill="${c}" stroke="#304353" stroke-width="2.5" stroke-linejoin="round"/>`;
 const wrap=(body,w=600,h=240)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Question illustration">${body}</svg>`;
 function custom(name){const wood='#eab373',navy='#354665',teal='#64ceb6',pink='#f98eac';
  switch(name){
   case 'peg':return rect(15,18,70,24,wood,5)+circle(50,30,7,'#be8751')+shape('M47 34H56V57Q58 72 75 61L80 68Q54 94 42 66Z','#c88c50');
   case 'fly':return shape('M43 48Q20 36 5 10Q32 17 51 36Q67 18 93 12Q82 38 62 48L71 74L49 63L27 79L35 55Z','#7fbedb')+circle(62,44,12,'#87cbdf')+shape('M72 41L90 47L72 52Z','#f3b658')+circle(65,41,2.5,'#273749');
   case 'shell':return shape('M14 56Q5 20 38 13Q68 6 87 33Q94 48 82 68L54 89L35 85L35 67Z','#f0a7aa')+`<path d="M35 67Q15 46 33 31Q52 15 72 33Q86 52 65 64Q45 75 40 54Q37 40 51 38Q64 36 64 48Q64 57 54 54" fill="none" stroke="#a95767" stroke-width="3"/>`;
   case 'bat':return shape('M39 10H53V42L68 57L58 91L27 80L35 47Z',wood)+rect(39,8,14,28,'#e69e6e',3);
   case 'rubber':return shape('M20 62L47 25Q50 20 57 24L83 45L55 81L20 62Z',pink)+shape('M20 62L36 42L71 62L55 81Z','#97ddf0');
   case 'rectangle':return rect(12,27,76,48,teal,3);
   case 'square':return rect(20,20,60,60,'#88b4fa',3);
   case 'triangle':return shape('M50 13L88 82H12Z','#f8bd64');
   case 'skirt':return shape('M32 18H68L84 81Q50 94 16 81Z','#bc90e3')+line(36,28,29,77,'#e8cbff',3)+line(50,28,50,80,'#e8cbff',3)+line(64,28,71,77,'#e8cbff',3);
   case 'shorts':return shape('M22 20H78L82 76L54 80L50 48L46 80L18 76Z','#61a8db')+line(23,30,77,30,'#dcefff',3)+line(50,25,50,44);
   case 'pencil case':return rect(12,35,76,42,teal,13)+rect(18,38,64,9,'#e9f7d4',5)+line(24,43,75,43,navy,2)+circle(73,47,4,'#ffcd5c');
   case 'pillow':return shape('M10 29Q28 18 50 27Q73 18 90 29Q79 49 90 72Q69 82 50 73Q28 82 10 72Q20 48 10 29Z','#b4d9f5');
   case 'blanket':return rect(15,14,70,75,'#a3d7cc',8)+[24,42,60,78].map(y=>line(17,y,83,y,'#e0f7ec',5)).join('')+line(25,17,25,85,'#e0f7ec',4);
   case 'board':return rect(9,13,82,62,wood,5)+rect(15,19,70,50,'#417f75',1)+line(20,38,63,38,'#eef7d9',3)+line(20,50,53,50,'#eef7d9',3)+rect(43,75,14,13,wood,1);
   case 'English':return rect(18,12,64,78,'#728cdd',8)+rect(24,18,52,66,'#f9f5de',3)+text('ABC',50,49,20)+text('abc',50,70,18);
   case 'table':case 'desk':return shape('M12 36L62 23L91 40L42 54Z',wood)+rect(16,44,8,42,'#af7d4c',2)+rect(77,45,8,41,'#af7d4c',2)+line(43,56,43,88,'#af7d4c',8);
   case 'shelf':return rect(8,53,84,12,wood,3)+shape('M18 65L36 65L18 84Z','#ad7c50')+shape('M64 65L82 65L82 84Z','#ad7c50');
   case 'cupboard':return rect(17,8,66,84,wood,5)+rect(22,14,56,70,'#fff1cc',3)+line(50,15,50,83,'#a87850',3)+circle(44,48,3,'#915c3b')+circle(56,48,3,'#915c3b');
   case 'fridge':return rect(20,7,60,88,'#9bdbe3',7)+line(22,38,78,38,'#468a9d',3)+rect(27,18,5,12,'#f3ffff',2)+rect(27,49,5,22,'#f3ffff',2);
   case 'rug':return `<ellipse cx="50" cy="58" rx="43" ry="25" fill="#f1a7b4"/><ellipse cx="50" cy="58" rx="32" ry="17" fill="#ffe1bf"/>`+[12,24,36,48,60,72,84].map(x=>line(x,78,x,84,'#d28e9a',2)).join('');
   case 'pool':return `<ellipse cx="50" cy="60" rx="45" ry="28" fill="#d2f1e4"/><ellipse cx="50" cy="58" rx="38" ry="21" fill="#61c8ef"/>`+line(24,57,46,57,'white',2)+line(49,65,75,65,'white',2);
   case 'seesaw':return shape('M41 77L50 49L61 77Z',teal)+shape('M6 41L94 61L92 69L5 49Z',wood)+line(17,45,17,29,navy,3)+line(79,60,79,44,navy,3);
   case 'sandcastle':return rect(22,38,56,50,'#edc479',2)+rect(16,23,18,65,'#f5d697',2)+rect(66,23,18,65,'#f5d697',2)+[16,28,66,78].map(x=>rect(x,16,6,16,'#f5d697',0)).join('')+shape('M40 88V65Q50 48 60 65V88Z','#b98f52');
   case 'yogurt':return shape('M25 33H75L67 86H33Z','#b3dbf4')+rect(20,26,60,10,'#f78ba9',4)+circle(50,58,13,'#fff')+shape('M42 56Q50 44 58 56L50 68Z','#e97b95');
   case 'brush':return rect(44,55,12,40,wood,5)+`<ellipse cx="50" cy="36" rx="24" ry="30" fill="${pink}"/>`+[28,39,50].map(y=>[38,50,62].map(x=>circle(x,y,2,navy)).join('')).join('');
   case 'doll':return personSvg({gender:'girl',hairColor:'#b56b39',wear:'dress'});
   case 'wash car':return `<g transform="translate(0 28) scale(.8)">${iconSvg('car')}</g>`+[circle(75,25,10,'#c1eff8'),circle(86,40,7,'#e2fcff'),circle(64,17,6,'#e2fcff')].join('')+rect(68,53,22,14,'#ffd35f',4);
   case 'upstairs':return [0,1,2,3].map(i=>rect(12+i*19,75-i*18,19,18+i*18,wood,1)).join('')+shape('M22 55L57 20L57 38L70 7L39 20L55 20L17 58Z',teal);
   case 'floor':return shape('M8 45L50 20L92 45L50 85Z',wood);
   default:throw Error('Missing custom vector '+name);
  }
 }
 function iconSvg(name){const lib=typeof module==='object'?require('./pictures/test-vectors/manifest.json'):window.TestVectors;const p=lib[name];if(!p)throw Error('Missing visual '+name);return p.src?`<image href="${esc(p.src)}" x="0" y="0" width="100" height="100"/>`:custom(p.custom);}
 function personSvg(p={}){const skin='#efbd92',hair=p.hairColor||(p.age==='elder'?'#b5bbc4':'#67432f'),shirt=p.gender==='girl'?'#ed8eaa':'#69bdb8';let h='';
  if(p.gender==='girl'||p.hair==='long')h+=shape('M24 43Q16 3 50 4Q82 5 77 55L76 69L25 69Z',hair);
  h+=shape(p.wear==='dress'||p.wear==='skirt'?'M32 54H68L80 89H20Z':'M30 54Q50 44 70 54L73 79H27Z',p.wear==='coat'?'#c8a270':shirt)+line(34,80,34,94,'#3e5471',10)+line(65,80,65,94,'#3e5471',10)+line(31,57,19,76,skin,9)+line(68,57,81,73,skin,9)+circle(50,31,23,skin);
  h+=shape('M27 28Q23 0 50 6Q77 1 74 29L64 18L53 23L43 17L32 29Z',hair);
  if(p.hair==='curly')h+=[25,36,49,62,74].map((x,i)=>circle(x,16-(i%2)*5,9,hair)).join('');
  h+=circle(42,32,2.5,'#273a4c')+circle(59,32,2.5,'#273a4c')+`<path d="M43 ${p.mood==='angry'?44:43}Q50 ${p.mood==='angry'?37:49}58 43" fill="none" stroke="#a35c55" stroke-width="2.5"/>`;
  if(p.age==='elder')h+=`<g fill="none" stroke="#465872" stroke-width="2"><circle cx="41" cy="32" r="8"/><circle cx="60" cy="32" r="8"/><path d="M49 32H52"/></g>`;
  if(p.wear==='hat'||p.job==='pilot'||p.job==='policeman'||p.job==='fireman')h+=shape('M23 14Q50 -4 76 14L70 22H28Z',p.job==='fireman'?'#f29861':'#57738e')+rect(25,17,53,8,'#334b68',2);
  if(p.job==='doctor'||p.job==='nurse')h+=rect(31,8,40,14,'#fff',3)+rect(48,9,6,13,'#ed797e',1)+rect(44,13,14,5,'#ed797e',1);
  if(p.wear==='scarf')h+=rect(30,48,40,10,'#f5b74f',3)+rect(56,51,10,25,'#f5b74f',3);
  if(p.mood==='wet')h+=[14,34,59,84].map(x=>line(x,2,x-6,15,'#55abdc',3)).join('');
  if(p.mood==='hot')h+=circle(88,14,10,'#ffc85c')+shape('M20 37Q8 50 20 52Q29 49 20 37Z','#6bc5ef');
  if(p.mood==='thirsty')h+=shape('M75 54H95L91 84H80Z','#81cce1')+line(85,54,90,40,'#5c929e',2);
  if(p.speaking)h+=`<g transform="translate(4 58)">${rect(0,0,29,22,'#fff',7)}${text('I',14,16,15)}</g>`;
  if(p.job==='neighbour')h+=`<g transform="translate(64 61) scale(.35)">${iconSvg('house')}</g>`;
  return h;
 }
 const place=(body,x,y,w=100,h=w)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 100 100">${body}</svg>`;
 function single(p){return p.kind==='person'?personSvg(p):iconSvg(p.name);}
 function smallRoom(name,people=[]){const furnishing={'bedroom':['bed','cupboard'],'bathroom':['bathtub','toilet'],'kitchen':['cooking','fridge'],'living room':['couch and lamp','television'],'dining room':['table','chair'],'upstairs':['upstairs']}[name];if(!furnishing)throw Error('Unknown room '+name);return rect(0,0,260,180,'#e5f5e4',12)+rect(0,135,260,45,'#f4d9ad',5)+furnishing.map((n,i)=>place(iconSvg(n),15+i*120,45,105,100)).join('')+people.map((n,i)=>place(personSvg({gender:/Mum|Grandma|Mia/.test(n)?'girl':'boy',age:/Grand/.test(n)?'elder':'adult'}),25+i*70,65,65,85)+text(n,57+i*70,167,13)).join('');}
 function visual(v){if(!v)return '';let out='';
  if(v.artCards)return `<div class="test-art-cards">${v.artCards.map(p=>`<figure><img src="${esc(p.src)}" alt="" draggable="false">${p.label?`<figcaption>${esc(p.label)}</figcaption>`:''}</figure>`).join('')}</div>`;
  switch(v.kind){
   case 'wordSnake':return wrap(`<path d="M45 130Q120 65 240 122T530 120" stroke="#79cfaa" stroke-width="65" fill="none" stroke-linecap="round"/>${circle(538,106,5,'#28453a')}${circle(555,109,5,'#28453a')}${text('scaredtiredhotangrythirsty',285,132,25)}`);
   case 'crossword':{const words=[[[4,1],[5,1],[6,1]],[[2,3],[3,3],[4,3],[5,3]],[[2,3],[2,4],[2,5],[2,6]],[[0,5],[1,5],[2,5]]],cells=new Map();for(let i=0;i<5;i++)cells.set('5,'+i,{x:5,y:i,letter:'climb'[i]});for(const w of words)for(const[x,y]of w)if(!cells.has(x+','+y))cells.set(x+','+y,{x,y});out=[...cells.values()].map(c=>rect(175+c.x*35,5+c.y*33,34,32,words[v.target].some(([x,y])=>x===c.x&&y===c.y)?'#ffdda4':'#fff',2)+(c.letter?text(c.letter,192+c.x*35,29+c.y*33,21):'')).join('');return wrap(out);}
   case 'icon':case 'person':return wrap(place(single(v),200,0,200,210)+(v.label?text(v.label,300,232):''));
   case 'cards':case 'labelled':{const n=v.items.length,w=Math.min(150,580/n);return wrap(v.items.map((p,i)=>{const x=(600-n*w)/2+i*w;return place(p.kind==='person'?personSvg(p):p.kind==='desk'?custom('desk')+(!p.tidy?`<g transform="rotate(25 50 50)">${iconSvg('notebook')}</g>`:place(iconSvg('book'),35,20,35)):p.kind==='help'?personSvg({gender:'girl'})+place(personSvg({gender:'boy',mood:'angry'}),55,30,45):p.kind==='mischief'?personSvg({gender:'boy'})+place(iconSvg('snowman'),55,0,45):single(p),x,20,w,170)+(p.label?text(p.label,x+w/2,215):'');}).join(''));}
   case 'room':return wrap(`<g transform="translate(100 10) scale(1.5 1.15)">${smallRoom(v.room)}</g>`);
   case 'house':return wrap(v.rooms.map((r,i)=>`<g transform="translate(${25+(i%2)*280} ${Math.floor(i/2)*200})">${smallRoom(r.room,r.people)}</g>`).join(''),600,410);
   case 'clock':{out=circle(300,118,108,'#f4bd60')+circle(300,118,97,'#fffef5');for(let i=1;i<=12;i++){const a=i*Math.PI/6;out+=text(i,300+Math.sin(a)*80,124-Math.cos(a)*80,18);}const a=(v.hour%12+v.minute/60)*Math.PI/6,b=v.minute*Math.PI/30;out+=line(300,118,300+Math.sin(a)*48,118-Math.cos(a)*48,'#38526f',7)+line(300,118,300+Math.sin(b)*69,118-Math.cos(b)*69,'#e87879',5)+circle(300,118,6,'#38526f');return wrap(out);}
   case 'body':{const points={face:[[50,30]],eyes:[[41,31],[59,31]],ears:[[26,32],[74,32]],nose:[[50,37]],legs:[[34,87],[65,87]],arms:[[25,64],[75,64]],hands:[[19,76],[81,73]],fingers:[[18,79],[82,76]]};out=personSvg({gender:'boy'});for(const [x,y]of points[v.highlight]||[])out+=`<circle cx="${x}" cy="${y}" r="${v.highlight==='face'?24:7}" fill="#ffd85c" fill-opacity=".3" stroke="#ef755e" stroke-width="3"/>`;return wrap(place(out,195,0,210,230));}
   case 'relation':{const base=iconSvg(v.place),obj=v.object==='girl'?personSvg({gender:'girl'}):iconSvg(v.object);let b='';if(v.where==='behind'){b=place(obj,245,0,110,170)+place(base,215,70,170,150);}else{b=place(base,180,55,240,170);const y=v.where==='on'?4:v.where==='under'?151:70;b+=place(obj,255,y,85,85);if(v.where==='in')b+=`<path d="M222 141Q300 179 378 141L365 198Q300 220 235 198Z" fill="#71c7bd" fill-opacity=".7"/>`;}return wrap(b);}
   case 'between':return wrap(place(iconSvg(v.left),40,75,180,150)+place(iconSvg(v.name),250,60,100,130)+place(iconSvg(v.right),400,75,130,150));
   case 'bedroom':return wrap(rect(10,5,580,230,'#edf4dd',12)+rect(10,165,580,70,'#e5bf8f',8)+rect(300,20,125,186,'#c39056',5)+rect(310,28,105,166,'#fff0c9',3)+line(315,50,410,50,'#7d644e',4)+[315,348,381].map(x=>place(iconSvg('coat'),x,48,34,90)).join('')+place(iconSvg('car'),329,138,68,60)+place(iconSvg('bed'),30,75,230,130)+place(iconSvg('teddy'),113,65,60,60)+place(iconSvg('train'),102,180,80,50)+place(custom('shelf'),450,80,105,60)+[465,497].map(x=>place(iconSvg('book'),x,55,34,55)).join('')+place(custom('rug'),445,157,120,70)+place(custom('doll'),455,158,42,60)+place(custom('doll'),508,158,42,60));
   case 'preference':return wrap(place(iconSvg(v.name),225,10,150,175)+text(v.label||'',120,180)+circle(430,120,34,v.like?'#a3e3b8':'#f8c0b2')+text(v.like?'✓':'×',430,135,45));
   case 'size':return wrap(v.subjects.map((s,i)=>place(s==='girl'?personSvg({gender:'girl'}):iconSvg(s),100+i*220,v.size==='small'?100:8,v.size==='small'?100:200,v.size==='small'?110:220)).join('')+(v.size==='small'?place(custom('table'),260,30,200,190):''));
   case 'ability':return wrap(place(v.name==='boy'||v.name==='girl'?personSvg({gender:v.name}):iconSvg(v.name),170,15,160,205)+place(iconSvg(v.action),360,10,100,130)+circle(415,178,30,v.can?'#a4dfb4':'#f5b9ad')+text(v.can?'✓':'×',415,191,40));
   case 'abilityTable':case 'schedule':return `<table class="source-fact-table"><tbody>${v.rows.map(([person,action,yes])=>`<tr><th>${esc(person)}</th><td>${esc(action)}</td><td class="${yes?'fact-yes':'fact-no'}">${yes?'✓':'×'}</td></tr>`).join('')}</tbody></table>`;
   case 'distance':{const x=v.near?180:430;return wrap(place(personSvg({gender:'girl'}),20,20,150,210)+line(145,110,x-8,110,'#7b9d9c',3)+Array.from({length:v.count},(_,i)=>place(iconSvg(v.name),x+i*30,85-i*10,95,110)).join(''));}
   case 'ownership':return wrap(place(personSvg({gender:'boy',speaking:v.ours}),45,10,140,220)+place(personSvg({gender:'girl',speaking:v.ours}),420,10,140,220)+place(iconSvg(v.name),235,55,130,140)+(v.ours?'':text('↗',170,90,42)));
   case 'daytime':{const night=v.time==='night',evening=v.time==='evening';return wrap(rect(20,5,560,220,night?'#344367':evening?'#eaa385':'#aee5f2',25)+circle(v.time==='afternoon'?310:480,v.time==='afternoon'?42:130,30,night?'#fff2bb':'#ffcf5c')+rect(20,170,560,55,night?'#648378':'#8dc8a5',20)+place(iconSvg('house'),170,80,190,140)+(night?[70,160,240,390].map(x=>text('✦',x,45,16)).join(''):''));}
   case 'compare':{const leftSize=v.smaller?90:v.short?130:210,rightSize=v.tall?140:210;return wrap(place(single(v.left),100,225-leftSize,leftSize,leftSize)+place(single(v.right),340,225-rightSize,rightSize,rightSize)+(v.left.label?text(v.left.label,160,238,14):'')+(v.right.label?text(v.right.label,430,238,14):''));}
   case 'speed':return wrap(place(iconSvg(v.left),90,30,170,175)+place(iconSvg(v.right),360,30,170,175)+[0,1,2].map(i=>line(v.faster==='left'?25:295,90+i*20,v.faster==='left'?100:370,90+i*20,'#76b6b4',5)).join(''));
   case 'podium':return wrap(v.people.map((n,i)=>rect(25+i*145,150,130,60,'#88c8d9',8)+place(personSvg({gender:/Anna|Ellie/.test(n)?'girl':'boy'}),48+i*145,20,80,120)+text(n,90+i*145,142,17)+text(['1st','2nd','3rd','4th'][i],90+i*145,187,22)).join(''));
   default:throw Error('Unknown test scene '+v.kind);
  }
 }
 function render(q,enlarged=false){if(!q.visual&&!q.wordBank&&!q.responseFormat)return '';return `<section class="test-scene" aria-label="Exercise details">${q.wordBank?'<div class="source-word-bank">'+q.wordBank.map(w=>'<span>'+esc(w)+'</span>').join('')+'</div>':''}${q.visual?'<div class="test-illustration">'+visual(q.visual)+'</div>'+(enlarged?'':'<button type="button" class="enlarge-scene" data-enlarge-scene aria-label="Enlarge the picture">🔍</button>'):''}${q.responseFormat&&!String(q.answer).includes(' / ')?'<p class="source-response-format">'+esc(q.responseFormat)+'</p>':''}${enlarged?'<small class="vector-credits">Colour icons: <a href="https://openmoji.org/" target="_blank" rel="noopener">OpenMoji</a> · CC BY-SA 4.0. Scenes: Ms Trang Trieu Education.</small>':''}</section>`;}
 return {render,visual,custom,iconSvg};
});
