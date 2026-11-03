const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const hunt=require(root+'/khoa-hoc/hunt-worlds/phonics-1/unit-1.json'),room=require(root+'/khoa-hoc/context-reviews-v3/family-friends-1/unit-1.json');
const inside=(a,b)=>a.x>=b.x-b.w/2&&a.x<=b.x+b.w/2&&a.y>=b.y-b.h/2&&a.y<=b.y+b.h/2;
test('Phonics asks about colours and counts that are really painted, and keeps every Unit word and letter',()=>{
 const byText=Object.fromEntries(hunt.questions.filter(q=>q.audioText).map(q=>[q.audioText,q])),object=id=>hunt.objects.find(o=>o.id===id);
 for(const [text,word,color]of [['red apple','apple','red'],['green apple','apple','green'],['blue bird','bird','blue'],['red bird','bird','red'],['yellow banana','banana','yellow'],['green banana','banana','green'],['blue cup','cup','blue'],['white cup','cup','white'],['yellow cat','cat','yellow'],['black and white cat','cat','black and white']]){const o=object(byText[text].groups[0].targets[0]);assert.equal(o.word,word);assert.equal(o.color,color);}
 const three=byText['three cats'].groups[0];assert.equal(three.need,3);assert.equal(three.targets.length,3);assert(three.targets.every(id=>object(id).word==='cat'));assert.equal(hunt.objects.filter(o=>o.word==='cat').length,3);
 for(const word of hunt.sourceWords)assert(hunt.objects.some(o=>o.word===word),word);
 for(const letter of ['A','a','B','b','C','c'])assert(byText[(letter===letter.toUpperCase()?'capital ':'small ')+letter],letter);
 const used=new Set(hunt.questions.flatMap(q=>q.groups.flatMap(g=>g.targets)));for(const o of hunt.objects)assert(used.has(o.id),o.id);
 assert.equal(new Set(hunt.questions.map(q=>q.id)).size,hunt.questions.length);
 for(const o of hunt.objects)assert(o.box[2]*16.72>=40,o.id+' is too narrow to tap');
});
test('C and c share one painted surface, because only their size tells them apart',()=>{
 const big=hunt.objects.find(o=>o.id==='forest-C'),small=hunt.objects.find(o=>o.id==='forest-c');assert(Math.abs(big.y-small.y)<3);assert(Math.abs(big.x-small.x)<10);
});
test('Art Class commands use each colour once per object and name only supplies and places that exist',()=>{
 const w=room.world,movable=w.objects.filter(o=>!o.fixed),zones=new Set(w.zones.map(z=>z.id));assert.equal(movable.length,14);assert.equal(new Set(movable.map(o=>o.word)).size,14);
 for(const o of movable){const file=path.join(root,'khoa-hoc',o.picture.src);assert(fs.statSync(file).size>500,o.id);assert(!w.zones.some(z=>z.id!=='teacher'&&z.id!=='girl'&&z.id!=='boy'&&inside(o,z)),o.id+' starts inside a named place');}
 for(const q of room.items){let spoken=q.spokenScene;for(const s of q.resourceTask.steps){if(s.action==='day'){assert(spoken.includes(s.day));continue;}if(s.action==='color'||s.action==='point')continue;assert(zones.has(s.target));const o=w.objects.find(x=>x.id===s.object);assert(spoken.includes(o.word),q.id+' must say '+o.word);}}
 for(const word of room.sourceWords)assert(room.items.some(q=>q.resourceEvidence.includes(word)),word);
});
test('A wrong day is rejected and the calendar opens large buttons, because painted cells are too small to tap',()=>{
 const js=fs.readFileSync(__dirname+'/command-scene.js','utf8');assert(js.includes("step.action!=='day'"));assert(js.includes('data-command-day'));assert(js.includes("move('calendar','day-'+"));
 const days=room.items.flatMap(q=>q.resourceTask.steps).filter(s=>s.action==='day').map(s=>s.day);assert.deepEqual(days,['Tuesday','Friday','Monday']);
 assert.match(fs.readFileSync(path.join(root,'khoa-hoc/data/family-friends-1/starter.json'),'utf8'),/Tuesday/);
});
test('Hunt length follows the pack, so a longer Unit still ends and scores correctly',()=>{
 const js=fs.readFileSync(__dirname+'/hidden-listening.js','utf8');for(const fixed of ['state.index>=20','state.index<20','state.index+1}/20'])assert(!js.includes(fixed),fixed);assert(js.includes('state.index>=pack.questions.length'));
});
test('Drop places reopen on every new question, because the shared board keeps its buttons between questions',()=>{
 const js=fs.readFileSync(__dirname+'/command-scene.js','utf8');assert(js.includes('for(const z of zones)z.disabled=!!api.completed?.();'));
});
