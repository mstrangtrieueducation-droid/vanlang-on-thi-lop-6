const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),packs=require('../../khoa-hoc/program/scene-continuity.cjs').build(),Rules=require('./rules.js'),Flow=require('./flow-core.js'),Results=require('./results.js');
test('All 102 Unit scenes have 20 unique grounded tasks; original reviews and identity gates remain separate',()=>{
 assert.equal(packs.length,102);const ids=new Set(),clues=new Set();
 for(const p of packs){assert.equal(p.items.length,20);assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'khoa-hoc/context-reviews-v3',p.course,'unit-'+p.unit+'.json'))),p);const w=p.world;assert(fs.existsSync(path.resolve(__dirname,'living-scenes-v3',w.image)));
  for(const q of p.items){assert(!ids.has(q.id));ids.add(q.id);assert(!clues.has(q.spokenScene));clues.add(q.spokenScene);assert.equal(q.resourceTask.worldId,w.id);assert.equal(q.resourceTask.retryOnWrong,true);assert(Rules.check(q,q.answer));assert(q.why);}
  const original=require('../../khoa-hoc/data/'+p.course+'.json').lessons.find(l=>l.unit===p.unit&&l.kind==='unit-review');assert.equal(original.items.length,45);assert(original.items.every(q=>!ids.has(q.id)));
 }
 assert.equal(ids.size,2040);
});
test('Cleanup uses stable permanent slots, safe movable objects, five scene themes and no overlapping shelf/drawer drop centers',()=>{
 const themes=new Set();for(const p of packs.filter(p=>p.kind==='sceneActions')){themes.add(p.world.scene);const w=p.world;assert.equal(w.objects.length,24);assert.equal(new Set(w.objects.map(o=>o.id)).size,24);assert.equal(new Set(p.items.flatMap(q=>q.resourceTask.steps.map(s=>s.object))).size,24);assert(p.items.slice(16).every(q=>q.resourceTask.steps.length===2));
  for(const o of w.objects){assert(w.targets.some(t=>t.id===o.home.target));assert(o.source);assert(o.picture);for(const v of [o.x,o.y,o.home.x,o.home.y])assert(v>0&&v<100);}
  for(const t of w.targets)for(const other of w.targets)if(t.id!==other.id)assert(!(Math.abs(t.x-other.x)<other.w/2&&Math.abs(t.y-other.y)<other.h/2),p.course+p.unit+' ambiguous '+t.id+' / '+other.id);
 }assert.equal(themes.size,5);
});
test('Crowd tasks refer to twenty already-painted actors with measured hit regions and relative visual evidence',()=>{
 const themes=new Set();for(const p of packs.filter(p=>p.kind==='detectiveScene')){const w=p.world;themes.add(w.scene);assert.equal(w.objects.length,20);assert.equal(new Set(p.items.map(q=>q.answer)).size,20);for(const o of w.objects){assert.equal(o.picture,undefined);assert(o.description&&o.reference);const [x,y,a,b]=o.box;assert(x>=0&&y>=0&&a>0&&b>0&&x+a<=100&&y+b<=100);assert(o.x>=x&&o.x<=x+a&&o.y>=y&&o.y<=y+b);}for(const q of p.items){assert(w.objects.some(o=>o.id===q.answer));assert.match(q.spokenScene,/The target is (above|below|to the left of|to the right of)/);}}
 assert.equal(themes.size,3);
});
test('Native answer transport retains a first wrong answer after retry; scene positions do not create marks',()=>{
 const run={id:'scene',total:20,answers:{},elapsedMs:0},q=packs[0].items[0];Flow.response(run,q.id,'wrong');Results.mark(run,q.id,false);run.livingScenes={[packs[0].world.id]:{placements:{[q.resourceTask.steps[0].object]:q.resourceTask.steps[0].target}}};Flow.response(run,q.id,q.answer);Results.mark(run,q.id,true);assert.equal(run.answers[q.id].firstCorrect,false);assert.equal(run.responses[q.id].first,'wrong');assert.equal(run.responses[q.id].last,q.answer);assert.equal(Results.summarize(run).correct,0);
});
test('Every new instruction and encouragement has a real local English recording',()=>{
 const a=require('./living-scenes-v3/audio-manifest.json');assert.equal(a.voice,'en-US-AnaNeural');for(const p of packs)for(const q of p.items)for(const key of [q.partInstruction,q.spokenScene]){assert(a.mapping[key]?.length);for(const url of a.mapping[key])assert(fs.statSync(path.resolve(root,'khoa-hoc',url)).size>1000,url);}for(const key of Object.values(a.feedback).flat())assert(a.mapping[key]);
});
const maps=require('./textbook-maps/manifest.json'),sandbox={window:{TextbookMapData:maps}};vm.runInNewContext(fs.readFileSync(require.resolve('./textbook-maps.js'),'utf8'),sandbox);const M=sandbox.window.TextbookMaps;
function route(m){const nodes=m.required.map(w=>m.nodes[w]);if(m.kind==='listenMap'){const n=nodes[0];return [[n.x-80,n.y-80],[n.x-60,n.y-60],[n.x-30,n.y-30],[n.x,n.y]];}const points=[];for(let i=0;i<nodes.length;i++){const a=nodes[Math.max(0,i-1)],b=nodes[i];for(let j=0;j<=12;j++)points.push([a.x+(b.x-a.x)*j/12,a.y+(b.y-a.y)*j/12]);}return points;}
test('All 92 map questions use exact original pages and keep their existing IDs, target words and canonical answer keys',()=>{
 let count=0;const sources=require('./textbook-maps/sources.json');for(let b=1;b<=4;b++)for(const l of require('../../khoa-hoc/data/phonics-'+b+'.json').lessons)for(const q of l.items)if(['soundPath','listenMap'].includes(q.resourceTask?.kind)){count++;const m=maps.questions[q.id];assert(m);assert.equal(m.unit,l.unit);assert.deepEqual(m.required,q.resourceTask.kind==='soundPath'?q.answer.split(' → ').slice(1,-1):[q.answer]);assert(sources.some(s=>s.file===m.image&&s.operation.startsWith('Full original page')));assert(fs.existsSync(path.join(__dirname,'textbook-maps',m.image)));for(const w of m.required)assert(m.nodes[w]);assert(M.valid(route(m),m),q.id);const bad=route(m);bad[bad.length-1]=[1,1];assert.equal(M.valid(bad,m),false,q.id);assert.equal(M.valid([[1,1]],m),false);}
 assert.equal(count,92);assert.equal(sources.filter(s=>s.operation.startsWith('Full original page')).length,16);
});
