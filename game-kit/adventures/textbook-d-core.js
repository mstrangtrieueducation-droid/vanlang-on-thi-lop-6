/* Source-D validation is independent of the old quiz transport key. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.TextbookDCore=api;})(globalThis,()=>{
 'use strict';const tag='source-d:v1:';
 const norm=v=>String(v??'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
 function read(values){try{const raw=(values||[]).find(v=>String(v).startsWith(tag)),s=JSON.parse(raw?.slice(tag.length)||'{}');return {inputs:{},selections:{},edges:{},paths:[],ink:[],...s};}catch{return {inputs:{},selections:{},edges:{},paths:[],ink:[]};}}
 const encode=s=>[tag+JSON.stringify(s)];
 const equal=(a,b)=>JSON.stringify([...a].sort((a,b)=>a-b))===JSON.stringify([...b].sort((a,b)=>a-b));
 const near=(a,b,r=90)=>!!a&&!!b&&Math.hypot(a[0]-b[0],a[1]-b[1])<=r;
 function inside(point,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
 function selected(e,s){return (e.points||[]).map((p,i)=>s.ink.some(path=>inside(p,path))?i+1:null).filter(Boolean);}
 function completePath(points,e,index){if(points.length<4||!near(points[0],e.left[index],95)||!near(points.at(-1),e.right[index],100)||!points.some(p=>Math.hypot(p[0]-points[0][0],p[1]-points[0][1])>100))return false;const m=e.pathMask;if(!m)return true;let total=0,okay=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],n=Math.max(1,Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/7));for(let j=0;j<=n;j++){const p=[a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n],x=Math.max(0,Math.min(m.w-1,Math.round(p[0]/1000*(m.w-1)))),y=Math.max(0,Math.min(m.h-1,Math.round(p[1]/1000*(m.h-1))));total++;if(near(p,e.left[index],65)||near(p,e.right[index],65)||m.rows[y][x]==='1')okay++;}}return okay/total>=.88;}
 function validate(e,s){
  if(!new Set(['listenLetter','soundConnect','letterMatch','pictureCircle','shadowMatch','listenLetterMatch','traceColor','listenRead','write','checkWrite','circleWrite','routeMatchWrite','listenBlend','pairCircleWrite','listenCircle','soundWrite','listenWrite','drawWrite','number','listenPuzzle','check','wordPictureWrite','unscramble','wordSearch','listenBlendParts']).has(e.kind))return {correct:false,failures:['unsupported-source-task']};
  const failures=[];const mark=(id,okay)=>{if(!okay)failures.push(id);};
  e.answers.forEach((answer,i)=>{if(e.kind==='listenCircle'||e.kind==='check')return;const value=s.inputs[i]??'';mark('input:'+i,e.book===1&&/^[A-Z][a-z]$/.test(answer)?String(value).replace(/\s/g,'')===answer:norm(value)===norm(answer)||answer==='×'&&/^[x×✕]$/i.test(String(value).trim()));});
  if(['check','checkWrite','soundWrite','listenCircle'].includes(e.kind))e.answers.forEach((answer,i)=>mark('choice:'+i,e.kind==='check'||e.kind==='checkWrite'?e.choices[i]?.[s.selections[i]]===answer:s.selections[i]===e.correct[i]));
  if(e.kind==='listenCircle')e.answers.forEach((_,i)=>mark('picture:'+i,s.selections['picture'+i]===e.correctPictures[i]));
  if(e.kind==='pictureCircle')e.correct.forEach((c,i)=>mark('circle:'+i,selected(e,s).filter(n=>Math.floor((n-1)/4)===i).join(',')===String(i*4+c+1)));
  if(e.kind==='letterMatch')mark('matches',equal(Object.keys(s.edges).filter(k=>s.edges[k]).map(Number),e.targets));
  if(e.kind==='shadowMatch'||e.kind==='listenLetterMatch'||e.kind==='wordPictureWrite')e.matches.forEach((m,i)=>mark('edge:'+i,s.edges[i]===m));
  if(e.kind==='circleWrite')e.correct.forEach((correct,i)=>mark('choice:'+i,equal(s.selections[i]||[],correct)));
  if(e.kind==='pairCircleWrite')e.answers.forEach((a,i)=>mark('choice:'+i,e.choices[i]?.[s.selections[i]]===a));
  if(e.kind==='listenBlend')e.answers.forEach((a,i)=>mark('blend:'+i,e.choices[i]?.[s.selections[i]]+e.suffix===a));
  if(e.kind==='listenBlendParts')e.answers.forEach((a,i)=>mark('parts:'+i,(s.selections[i]||[]).map(n=>e.parts[i][n]).join('')===a));
  if(e.kind==='unscramble')e.answers.forEach((a,i)=>mark('letters:'+i,(s.selections[i]||[]).map(n=>e.scrambled[i][n]).join('')===a));
  if(e.kind==='wordSearch')e.answers.forEach((a,i)=>{const indices=[...(s.selections[i]||[])].sort((a,b)=>a-b);mark('search:'+i,indices.length>0&&indices.every((n,j)=>!j||n===indices[j-1]+1)&&indices.map(n=>e.strings[i][n]).join('')===a);});
  if(e.kind==='traceColor'){const painted=e.points.map((point,i)=>{const points=s.ink.flat().filter(p=>near(p,point,e.radii?.[0]||100));return points.length>=8&&points.some(p=>Math.hypot(p[0]-points[0][0],p[1]-points[0][1])>35)?i+1:null;}).filter(Boolean);mark('colored-pictures',equal(painted,e.targets));}
  if(e.kind==='drawWrite')e.drawingBoxes.forEach((box,i)=>mark('drawing:'+i,s.ink.some(p=>p.filter(([x,y])=>x>=box[0]&&x<=box[2]&&y>=box[1]&&y<=box[3]).length>=8)));
  if(e.kind==='routeMatchWrite')e.answers.forEach((_,i)=>mark('route:'+i,s.paths.some(p=>completePath(p,e,i))));
  if(e.kind==='soundConnect'){
   const nodes=Object.entries(e.nodes),hit=point=>nodes.filter(([,p])=>near(point,p,85)).sort((a,b)=>Math.hypot(a[1][0]-point[0],a[1][1]-point[1])-Math.hypot(b[1][0]-point[0],b[1][1]-point[1]))[0]?.[0];
   mark('sound-route',s.paths.some(p=>p.length>=8&&e.targets.every(w=>p.some(pt=>near(pt,e.nodes[w],85)))&&p.every(pt=>!hit(pt)||e.targets.includes(hit(pt)))));
  }
  if(e.kind==='listenRead')mark('readalong',!!s.played&&!!s.read);
  return {correct:!failures.length,failures};
 }
 function ready(e,s){if(e.kind==='listenRead')return !!s.played&&!!s.read;if(!['listenCircle','check'].includes(e.kind)&&e.answers.some((_,i)=>!String(s.inputs[i]??'').trim()))return false;if(['pictureCircle','traceColor','drawWrite'].includes(e.kind))return s.ink.length>0;if(e.kind==='soundConnect'||e.kind==='routeMatchWrite')return s.paths.length>0;return true;}
 function summary(e,s){if(e.kind==='listenRead')return 'Đã nghe và đọc theo bài D (tự xác nhận phần đọc).';const words=s?e.answers.map((_,i)=>s.inputs[i]||e.choices?.[i]?.[s.selections[i]]||'…'):e.answers;return words.map((a,i)=>(e.rowNumbers?.[i]||i+1)+'. '+a).join(' · ')+(e.matches?' · Nối: '+(s?Object.entries(s.edges).map(([i,j])=>(+i+1)+' → '+(j+1)):e.matches.map((j,i)=>(i+1)+' → '+(j+1))).join(', '):e.targets?' · Tranh cần nối/khoanh: '+e.targets.join(', '):e.kind==='pictureCircle'?' · Tranh: '+(s?selected(e,s).join(', '):e.correct.map((j,i)=>(i+1)+'.'+(j+1)).join(', ')):'');}
 function project(source,binding){const e={...source},count=e.answers.length||e.correct?.length||0;e.rowNumbers=Array.from({length:count},(_,i)=>i+1);if(binding.items){const [a,b]=binding.items;for(const key of ['answers','choices','correct','correctPictures','parts','scrambled','strings','drawingBoxes','matches','left','rowNumbers'])if(Array.isArray(e[key]))e[key]=e[key].slice(a,b);if(e.kind==='pictureCircle')e.points=e.points.slice(a*4,b*4);if(e.kind==='routeMatchWrite')e.right=e.right.slice(a,b);e.scope='Items '+(a+1)+'–'+b;}if(binding.phase==='connect'){e.answers=[];e.rowNumbers=[];e.instruction='Connect the pictures beginning with '+e.sound.toUpperCase()+'.';e.scope='Connect';}if(binding.phase==='write'){e.kind='write';e.instruction='Write '+e.answers[0]+'.';e.scope='Write';delete e.targets;delete e.nodes;}return e;}
 function prepare(g,data){for(const q of g.items||[]){const binding=data?.questions?.[q.id];if(!binding)continue;const e=project(data.exercises[binding.exercise],binding);q.textbookD=e;q.resourceTask={kind:'textbookD'};q.prompt=e.instruction;q.partInstruction=e.instruction;q.partTitle='Textbook D · '+e.instruction;q.scene='';q.spokenScene='';q.spokenPrompt='';q.visualOnly=true;delete q.picturePrompt;delete q.sourceImage;delete q.questionAudio;delete q.sourceAudio;q.why='Bài D nguyên bản, Phonics '+e.book+', trang '+e.printedPage+'. '+summary(e);q.explanation=q.why;}return g;}
 return {tag,norm,read,encode,near,inside,selected,completePath,ready,validate,summary,project,prepare};
});
