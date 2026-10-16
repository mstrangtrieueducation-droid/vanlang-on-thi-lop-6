const {test}=require('node:test'),assert=require('node:assert/strict');
const coach=require('./learning.js'),courses=require('../../khoa-hoc/content.cjs'),legacy=require('../../vu-tru/legacy-lessons.json');
const all=[...Object.values(courses).flatMap(c=>c.lessons),...legacy.lessons];
test('All 246 lessons retain every question, exact values and exam order; planned rounds resume exactly',()=>{
 assert.equal(all.length,246);
 for(const l of all){const before=JSON.stringify(l.items);const planned=coach.plan(l.items),standard=coach.plan(l.items,{standard:true});
  assert.deepEqual(standard,l.items);assert.equal(new Set(planned.map(q=>q.id)).size,l.items.length);
  assert.deepEqual([...planned].map(q=>q.id).sort(),l.items.map(q=>q.id).sort());assert.ok(planned.every(q=>l.items.includes(q)));assert.equal(JSON.stringify(l.items),before);
  for(const pos of [0,Math.floor(planned.length/2),planned.length-1]){const r=coach.restore(l.items,{id:planned[pos].id,order:planned.map(q=>q.id)});assert.equal(r.pos,pos);assert.deepEqual(r.queue,planned);}
 }
});
test('Interleaving breaks vocabulary blocks with listening and grammar, without repeating the same answer immediately',()=>{
 const items=courses['discover-1'].lessons[9].items,planned=coach.plan(items);
 assert.equal(coach.skill(planned[0]),'vocabulary');assert.equal(coach.skill(planned[1]),'listening');
 assert.notEqual(planned[0].answer,planned[1].answer);assert.ok(planned.slice(0,5).some(q=>coach.skill(q)==='grammar'));
});
test('Related reading questions stay together and legacy or invalid saves fall back safely',()=>{
 const text='An original reading passage. '.repeat(10),items=[{id:'a',type:'choice',scene:text},{id:'b',type:'choice',scene:'word'},{id:'c',type:'choice',scene:text}];
 const plan=coach.plan(items);assert.equal(plan.findIndex(q=>q.id==='c'),plan.findIndex(q=>q.id==='a')+1);
 assert.deepEqual(coach.restore(items,{id:'b'}),{queue:items,pos:1,review:false});
 assert.deepEqual(coach.restore(items,{id:'b',order:['b','b','missing']}),{queue:items,pos:1,review:false});
 assert.deepEqual(coach.restore(items,{id:'c',order:['a','c'],reviewMode:true}),{queue:[items[0],items[2]],pos:1,review:true});
});
test('Short reviews cap at six, prioritize weak questions and schedule clean recall after 1, 3, 7 and 14 days',()=>{
 const items=courses['discover-1'].lessons[0].items,history={},now=1000000000,day=86400000;
 coach.record(history,items[0].id,true,now);assert.equal(history[items[0].id].nextAt,now+day);
 assert.equal(coach.review(items,[],history,now).length,0);assert.equal(coach.review(items,[],history,now+day).length,1);
 for(const days of [3,7,14,14]){coach.record(history,items[0].id,true,now);assert.equal(history[items[0].id].nextAt,now+days*day);}
 coach.record(history,items[0].id,false,now);assert.equal(history[items[0].id].streak,0);assert.equal(history[items[0].id].misses,1);
 const weak=items.slice(1,9).map(q=>q.id),review=coach.review(items,weak,history,now);assert.equal(review.length,6);assert.ok(review.every(q=>weak.includes(q.id)));
});
test('Feedback uses source evidence and hints support the skill without giving away a listening answer',()=>{
 const q=courses['family-friends-1'].lessons[0].items[1];assert.match(coach.explanation(q),/asks about age/);assert.doesNotMatch(coach.explanation(q),/The answer is/);
 const listen={type:'choice',scene:'Listen to Titi.',spokenScene:'bathroom',answer:'bathroom',hint:'Read carefully. Listen again if you need to.'};assert.equal(coach.skill(listen),'listening');assert.doesNotMatch(coach.hint(listen),/bathroom/);
 const grammar={scene:'She … happy.',answer:'is',why:'The answer is is.'};assert.equal(coach.explanation(grammar),'Complete sentence: She is happy.');
 const original={why:'Use are with a plural subject.'};assert.equal(coach.explanation(original),original.why);
});
