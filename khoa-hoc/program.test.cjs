const {test}=require('node:test'),assert=require('node:assert/strict');
const {family,source}=require('./program/parse.cjs');
test('Family and Friends uses actual Program sessions and book lesson boundaries',()=>{
 const p=family();assert.equal(p.units.length,15);
 assert.deepEqual(p.units[0].stages.map(s=>s.session),[2,3,4]);
 assert.deepEqual(p.units[6].stages.map(s=>s.session),[25,26,27]);
 assert.deepEqual(p.units[14].stages.map(s=>s.session),[53,54,55]);
 assert.deepEqual(p.tests.map(t=>t.session),[12,23,35,46,57]);
 assert.deepEqual(p.tests.map(t=>t.units),[[1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15]]);
 assert.deepEqual(p.tests.map(t=>t.durationSeconds),[900,900,900,null,null]);
});
test('Incomplete or changed Program cannot silently produce new unlocks',()=>{
 const rows=structuredClone(source.sheets['FAMILY AND FRIENDS 1,2']);
 assert.throws(()=>family(rows.filter(r=>Number(r[0])!==3)),/reviewed mapping/);
 assert.throws(()=>family(rows.filter(r=>Number(r[0])!==23)),/schedule changed/);
});
test('Phonics distractors stay inside the current textbook Unit',()=>{
 const courses=require('./content.cjs'),units=require('./phonics-units.cjs');
 for(const n of [1,2,3,4])for(const l of courses['phonics-'+n].lessons){
  const words=new Set(units[n][l.unit-1].levels.flatMap(x=>x.words).map(w=>w.toLowerCase()));
  for(const q of l.items.filter(q=>!q.resourceTask))for(const option of q.options)for(const w of option.split(' → '))assert.ok(words.has(w.toLowerCase()),q.id+' introduces '+w);
 }
});
