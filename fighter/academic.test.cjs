const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('./core.js'),D=require('./data.js'),families=require('./word-families.cjs');
const skills=['core','logic','clasp','paraphrase','headline','family'];
test('Every Unit offers all six academic skills; Boss covers all six and Unit rotates three or four',()=>{
 for(const u of D.units){
  assert.equal(C.start(u,[u],'boss').tasks.length,10,u.id+' when only this Unit is unlocked');
  const pool=C.pool(u,D.units);for(const k of skills)assert.ok(pool.some(t=>t.kind===k),u.id+' '+k);
  for(let i=0;i<3;i++){const boss=C.start(u,D.units,'boss');assert.equal(boss.tasks.length,10);for(const k of skills)assert.ok(boss.tasks.some(t=>t.kind===k),u.id+' '+k);}
  const kinds=new Set(C.start(u,D.units,'unit').tasks.map(t=>t.kind));assert.ok(kinds.size>=3&&kinds.size<=4,u.id);
 }
});
test('Core tasks retain complete subject, verb and complement; headlines require evidence as well as heading',()=>{
 for(const u of D.units){
  const core=u.academic.find(t=>t.kind==='core'),count=core.sentence.split(/\s+/).length;
  assert.ok(count>=25&&count<=40,u.id+' '+count);assert.equal(core.chunks.filter(t=>!t.remove).map(t=>t.text).join(' ').replace(/\.$/,''),core.simplified.replace(/\.$/,''));
  assert.ok(C.check(core,core.answer.split(',').reverse().join(',')));assert.ok(!C.check(core,core.answer+',1'));assert.ok(!C.check(core,'0,0'));
  const t=u.academic.find(t=>t.kind==='headline');assert.ok(t.paragraph.length>=4&&t.paragraph.length<=6);
  assert.ok(C.check(t,t.answer));assert.ok(!C.check(t,JSON.stringify({heading:t.heading})));assert.ok(!C.check(t,JSON.stringify({heading:1,evidence:0})));
 }
});
test('Four same-root grammar choices and contextual paraphrases retain attributable source information',()=>{
 for(const u of D.units){const t=u.academic.find(t=>t.kind==='family');assert.ok(families.some(f=>JSON.stringify(f)===JSON.stringify(t.family)));assert.equal(new Set(t.choices.map(s=>s.toLowerCase())).size,4);assert.equal(t.choices.filter(v=>v===t.answer).length,1);assert.ok(t.sentence.includes('___'));assert.ok(t.origin);assert.ok(t.source);
  const p=u.academic.find(t=>t.kind==='paraphrase');assert.equal(new Set(p.pairs.map(p=>p.left)).size,p.pairs.length);assert.equal(new Set(p.pairs.map(p=>p.right.toLowerCase())).size,p.pairs.length);for(const pair of p.pairs)assert.ok(p.paragraph.join(' ').includes(pair.right));assert.ok(C.check(p,p.answer.split('|').reverse().join('|')));assert.ok(!C.check(p,'0:0|0:0'));assert.match(p.origin,/not a textbook quotation/);
 }
});
test('Arena restricts review to the latest three taught Units in the same book',()=>{
 const u=D.units.find(u=>u.track==='Reading 5'&&u.unit===12),allowed=D.units.filter(x=>x.track===u.track&&x.unit<=12);
 for(let n=0;n<15;n++){const r=C.start(u,allowed,'arena'),review=r.tasks.filter(t=>!u.words.some(w=>w.id===t.wordId));assert.equal(review.length,3);for(const t of review)assert.ok(allowed.filter(x=>x.unit>=9&&x.unit<12).some(x=>x.words.some(w=>w.id===t.wordId)));}
});
test('Academic errors do not incorrectly rescue an unrelated word; correction does not award first-try points',()=>{
 const u=D.units[0],r=C.start(u,D.units,'unit'),t=u.academic.find(t=>t.kind==='headline');r.tasks=[t];const vault={};C.updateVault(vault,C.answer(r,'wrong'));assert.deepEqual(vault,{});C.answer(r,t.answer);assert.equal(r.index,1);assert.equal(r.points,0);assert.equal(C.summary(r).correct,0);assert.deepEqual(C.summary(JSON.parse(JSON.stringify(r)),r.startedAt+1000),C.summary(r,r.startedAt+1000));
});
