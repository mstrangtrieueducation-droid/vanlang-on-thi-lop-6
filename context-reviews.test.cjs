const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const author=require('./khoa-hoc/program/context-reviews.cjs'),family=require('./khoa-hoc/program/family-units.cjs'),resources=require('./khoa-hoc/program/discover-resources.json'),rules=require('./game-kit/adventures/rules.js'),parts=require('./game-kit/adventures/task-parts.js');
const courses=Object.fromEntries([1,2,3,4].map(n=>['discover-'+n,require('./khoa-hoc/data/discover-'+n+'.json')])),packs=author.build(courses);
test('Every FF and Discover Unit has a separate, sourced 20-task branch without changing the teaching map',()=>{
 assert.equal(packs.length,102);assert.equal(packs.filter(p=>p.kind==='sceneActions').length,30);assert.equal(packs.filter(p=>p.kind==='detectiveScene').length,72);
 const ids=new Set(),content=new Set();for(const p of packs){assert.equal(p.items.length,20);assert.deepEqual(JSON.parse(fs.readFileSync(path.join('khoa-hoc/context-reviews',p.course,'unit-'+p.unit+'.json'))),p);
  const sourceUnits=p.course.startsWith('family-')?family[+p.course.at(-1)]:resources.books.find(b=>b.level===+p.course.at(-1)).units;
  const allowed=new Set(sourceUnits.filter(u=>u.unit<=p.unit).flatMap(u=>[...u.words,...(u.extra||[])].map(w=>typeof w==='string'?w:w.word)));
  for(const [i,q]of p.items.entries()){assert(!ids.has(q.id));ids.add(q.id);assert(q.source.url);assert(!q.source.unit||q.source.unit<=p.unit);for(const evidence of q.resourceEvidence||[])assert(evidence.unit<=p.unit);assert(q.source.adaptation.includes('Centre-authored'));assert.equal(q.difficulty,i<6?'easy':i<13?'medium':'advanced');for(const w of q.resourceTask.sourceWords)assert(allowed.has(w),p.course+' '+p.unit+' '+w);const identity=q.spokenScene+'|'+(q.resourceTask.sourceWord||'');assert(!content.has(identity),'Repeated scene question: '+q.id);content.add(identity);assert(rules.check(q,q.answer));assert(!rules.check(q,'foreign-answer'));}
 }
});
test('Actions need the right objects, destinations and sequence; moving an extra object never scores correct',()=>{
 for(const p of packs.filter(p=>p.kind==='sceneActions'))for(const q of p.items){const t=q.resourceTask;assert.equal(t.steps.length,q.difficulty==='easy'?1:q.difficulty==='medium'?2:3);assert.equal(new Set(t.steps.map(s=>s.target)).size,t.steps.length);
  assert(t.steps.every(s=>t.objects.some(o=>o.id===s.object)&&t.targets.some(d=>d.id===s.target)));assert(t.objects.length>t.steps.length);
  if(t.steps.length>1)assert(!rules.check(q,q.answer.split('|').reverse().join('|')));
  assert(!rules.check(q,q.answer+'|d0>shelf'));const wrong=q.answer.replace(/>[^|]+/, '>missing-zone');assert(!rules.check(q,wrong));
  assert(t.objects.every(o=>o.picture));
 }
 const hat=packs.flatMap(p=>p.items).find(q=>q.resourceTask.steps?.some(s=>s.text.includes('Grandpa')));assert(hat,'The requested hat-on-Grandpa action is available after the clothes Unit');
 const animals=new Set(['elephant','giraffe','monkey','tiger','snake','parrot','polar bear','seal','cow','goat','horse','sheep','donkey','goose']);let animalSteps=0;
 for(const p of packs.filter(p=>p.kind==='sceneActions'))for(const q of p.items)for(const s of q.resourceTask.steps){const o=q.resourceTask.objects.find(o=>o.id===s.object);if(animals.has(o.word)){animalSteps++;assert(['near-tree','meadow','by-fence','forest-path','pond-edge','ice'].includes(s.target),'An animal must not be placed in a drawer or on a desk');}}
 assert(animalSteps>20);
});
test('Detective clues hide the object name and combine true visible spatial/colour evidence',()=>{
 const modes=new Set();for(const p of packs.filter(p=>p.kind==='detectiveScene'))for(const q of p.items){const t=q.resourceTask,target=t.objects.find(o=>o.id===t.target);assert(target);assert.equal(q.answer,target.id);assert.equal(t.objects.filter(o=>o.id===target.id).length,1);assert(!new RegExp('(?<![a-z])'+t.sourceWord.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![a-z])','i').test(q.spokenScene),'Riddle reveals '+t.sourceWord);assert(t.sourceDefinition.split(/\s+/).length>=4);assert(!/[\u0300-\u036fđ]/i.test(q.spokenScene.normalize("NFD")));assert(t.objects.length>=4);modes.add(t.clueTier);for(const o of t.objects){assert(o.x>0&&o.x<100&&o.y>0&&o.y<100);assert(o.picture);}}
 assert.deepEqual([...modes],['meaning-and-location','two-attributes','elimination-and-inference']);
});
test('Scene audio uses one shared Part instruction and only the current clue/action; levels remain in difficulty order',()=>{
 for(const p of packs){const sections=parts.sections(p.items);assert.equal(sections.length,1);assert.deepEqual(parts.group(p.items).map(q=>q.id),p.items.map(q=>q.id));for(const q of p.items){assert(parts.automatic(q,p.course));assert.deepEqual(parts.speech(q,{course:p.course}),[q.spokenScene]);assert.equal(parts.audioInstruction(q),q.partInstruction);}}
});
test('All generated native-English audio keys exist; the branch cannot overwrite main Unit stars or join the ranked cloud run',()=>{
 const manifest=require('./game-kit/adventures/review-scene-audio/manifest.json');for(const p of packs)for(const q of p.items)for(const text of [q.spokenScene,q.partInstruction])assert(manifest.mapping[text]?.length);
 for(const key of Object.keys(manifest.clips))assert(fs.statSync('game-kit/adventures/review-scene-audio/'+key+'.mp3').size>800,'Incomplete scene recording '+key);
 const oldVoices=require('./game-kit/adventures/context-audio/manifest.json');assert.equal(typeof oldVoices['Listen and complete the passage.'],'string','Existing grammar context narration remains intact');
 const bridge=fs.readFileSync('vu-tru/lesson-bridge.js','utf8'),menu=fs.readFileSync('game-kit/adventures/unit-review-menu.js','utf8'),engine=fs.readFileSync('game-kit/adventures/engine.js','utf8');assert(bridge.includes('c.supplementalGrammar||c.supplementalContext'));assert(menu.includes("c.storageKey+=':'+section+'-v3'"));assert(menu.includes('supplemental:true'));assert(engine.includes('run.practice=reviewMode||!!window.ADVENTURE?.supplemental'));
});
