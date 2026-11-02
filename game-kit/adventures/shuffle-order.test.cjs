const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('./difficulty.js'),P=require('./task-parts.js');
const sample=()=>JSON.parse(fs.readFileSync(__dirname+'/../../khoa-hoc/data/discover-1.json','utf8')).lessons.find(l=>l.kind==='practice').items;
test('Practice order changes between runs but keeps every question exactly once',()=>{
 const items=sample(),orders=new Set();for(let i=0;i<8;i++){const o=D.plan(items,P);assert.deepEqual([...o.map(q=>q.id)].sort(),[...items.map(q=>q.id)].sort());orders.add(o.map(q=>q.id).join());}assert(orders.size>1);
});
test('Original exams keep their source order',()=>{
 const items=JSON.parse(fs.readFileSync(__dirname+'/../../khoa-hoc/data/family-friends-1.json','utf8')).lessons.find(l=>l.kind==='progress-test').items;
 assert.deepEqual(D.plan(items,P).map(q=>q.id),items.map(q=>q.id));
});
test('Passages and story questions stay in sequence inside a shuffled lesson',()=>{
 const items=JSON.parse(fs.readFileSync(__dirname+'/../../khoa-hoc/data/family-friends-1.json','utf8')).lessons.flatMap(l=>l.kind==='unit-review'?l.items:[]).filter(q=>!q.exam).slice(0,45);
 const o=D.plan(items,P);for(const id of new Set(items.filter(q=>q.storyId).map(q=>q.storyId))){assert.deepEqual(o.filter(q=>q.storyId===id).map(q=>q.id),P.group(items).filter(q=>q.storyId===id).map(q=>q.id));}
});
test('Hidden-object rounds save a random order and old saves keep the questions already answered',()=>{
 const js=fs.readFileSync(__dirname+'/hidden-listening.js','utf8');assert(js.includes('order:randomOrder()'));assert(js.includes('pack.questions[state.order[state.index]]'));assert(js.includes('.slice(0,state.index)'));
});
test('Scene commands are shuffled and Discover shows a short direction until Hint is pressed',()=>{
 const menu=fs.readFileSync(__dirname+'/unit-review-menu.js','utf8'),scene=fs.readFileSync(__dirname+'/command-scene.js','utf8');assert(menu.includes("q.partInstruction='Listen and find.'"));assert(/\[pack\.items\[i\],pack\.items\[j\]\]/.test(menu));assert(scene.includes("if(detective)status.textContent=q.spokenScene"));assert(scene.includes('command-hint-soft'));
});
test('The short Discover direction keeps the recorded instruction voice',()=>{
 const audio=fs.readFileSync(__dirname+'/unit-scenes-v4/audio.js','utf8');assert(audio.includes('"Listen and find.":'),'Rerun of the audio build must keep this alias');
});
test('A new run always opens on the first question of its shuffled order',()=>{
 const js=fs.readFileSync(__dirname+'/engine.js','utf8');assert(js.includes('queue=PracticeDifficulty.plan(queue,TaskParts);pos=0;'));
});
