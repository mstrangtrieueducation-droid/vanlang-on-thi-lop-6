const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('./core.js'),D=require('./data.js');
test('All 88 Units can run a unique 15-question checkpoint without future content',()=>{
 assert.equal(D.units.length,88);
 for(const u of D.units){const r=C.start(u,[u],'boss');assert.equal(r.tasks.length,15,u.id);assert.equal(new Set(r.tasks.map(t=>t.id)).size,15);assert.ok(r.tasks.every(t=>t.unitId===u.id));assert.equal(r.timeLimit,180);}
});
test('Arena selects exactly six current and four earlier tasks in the same taught book',()=>{
 for(const track of new Set(D.units.map(u=>u.track))){const u=D.units.find(u=>u.track===track&&u.unit===4),r=C.start(u,D.units,'arena');assert.equal(r.tasks.length,10);assert.equal(r.tasks.filter(t=>t.unitId===u.id).length,6);assert.equal(r.reviewCount,4);for(const t of r.tasks)assert.ok(D.units.some(x=>x.id===t.unitId&&x.track===track&&x.unit<=4));}
 const u=D.units[0],first=C.start(u,[u],'arena');assert.equal(first.tasks.length,10);assert.equal(first.reviewCount,0);
});
test('Mistakes are prioritised; recovering on a later first try clears their priority',()=>{
 const u=D.units[0],task=u.tasks.at(-1),history={[task.id]:{wrong:2,recovered:0}},r=C.start(u,[u],'unit',{},()=>.31,history);assert.ok(r.tasks.some(t=>t.id===task.id));r.tasks=[task];r.index=0;const result=C.answer(r,task.answer);C.updateHistory(history,result);assert.equal(history[task.id].recovered,2);
});
test('Retry earns no first-try points, and two mistakes enter Word Vault',()=>{
 const u=D.units[0],r=C.start(u,[u],'unit'),vault={};r.tasks=u.tasks.slice(0,7);const id=r.tasks[0].wordId;
 C.updateVault(vault,C.answer(r,'wrong'));assert.equal(r.index,0);C.updateVault(vault,C.answer(r,'wrong again'));assert.equal(r.index,1);assert.equal(vault[id].misses,2);
 for(let n=0;n<5;n++)C.answer(r,r.tasks[r.index].answer);assert.equal(r.combo,5);assert.equal(r.points,80);assert.equal(C.summary(r).correct,5);
 const rescue=C.start(u,[u],'rescue',vault);assert.ok(rescue.tasks.every(t=>t.wordId===id));
 const retry=C.start(u,[u],'unit');C.answer(retry,'wrong');C.answer(retry,retry.tasks[0].answer);assert.equal(retry.points,0);assert.equal(C.summary(retry).correct,0);
});
test('Checkpoint 12/15 threshold, expiry, unanswered items and reload preserve scoring',()=>{
 const r=C.start(D.units[0],D.units,'boss');for(let n=0;n<12;n++)C.answer(r,r.tasks[r.index].answer,r.startedAt+100+n);
 C.answer(r,'wrong',r.startedAt+200);assert.ok(C.answer(r,r.tasks[r.index].answer,r.deadline).expired);const s=C.summary(r,r.deadline);assert.equal(s.mastered,true);assert.equal(s.seconds,180);assert.equal(s.total,15);assert.equal(C.summary({...r,answers:r.answers.slice(0,11)},r.deadline).mastered,false);assert.deepEqual(C.summary(JSON.parse(JSON.stringify(r)),r.deadline),s);
});
test('Only taught predecessors with a passed current checkpoint unlock; teacher preview independent',()=>{
 const a=D.units.filter(u=>u.track==='Reading 1').slice(0,3),records={};assert.ok(C.unlocked(a[0],a,records));assert.ok(!C.unlocked(a[1],a,records));records[a[0].id]={stars:3,mastered:true};assert.ok(!C.unlocked(a[1],a,records));records[a[0].id].checkpointV3=true;assert.ok(C.unlocked(a[1],a,records));assert.ok(!C.unlocked(a[2],a,records));assert.ok(C.unlocked(a[2],a,records,true));assert.ok(C.unlocked(a[2],[a[2]],{}),'class starting mid-book');
});
test('Evidence requires the exact span; substring guesses and wrong locations fail',()=>{
 const t=D.units.flatMap(u=>u.tasks).find(t=>t.kind==='clue');assert.ok(C.check(t,{start:t.start,end:t.end}));assert.ok(!C.check(t,{start:t.start,end:t.end-1}));assert.ok(!C.check(t,{start:t.start+1,end:t.end}));
});
