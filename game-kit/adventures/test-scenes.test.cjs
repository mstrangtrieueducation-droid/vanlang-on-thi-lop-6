const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const courses=require('../../khoa-hoc/content.cjs'),parts=require('./task-parts.js'),art=require('./test-scenes.js'),rules=require('./rules.js');
const tests=['family-friends-1','family-friends-2'].flatMap(id=>courses[id].lessons.filter(l=>l.kind==='progress-test'));
test('All ten source tests retain 45 scorable response IDs and use scan-free local scenes',()=>{
 assert.equal(tests.length,10);
 for(const t of tests){assert.equal(t.items.length,45);assert.equal(new Set(t.items.map(q=>q.id)).size,45);const grouped=parts.group(t.items),sections=parts.sections(grouped);assert.equal(new Set(sections.map(p=>p.key)).size,sections.length);
  for(const q of t.items){assert.equal(q.sourceImage,undefined);assert.ok(q.source.url.includes('drive.google.com'));assert.ok(rules.check(q,q.answer));assert.ok(!rules.check(q,'impossible-answer'));assert.doesNotThrow(()=>art.render(q));if(q.inputMode!=='typing')assert.ok(q.options.includes(q.answer),q.id);assert.doesNotMatch(art.render(q),/family-tests|\.png|\.jpg|\.webp/);}
 }
 const manifest=require('./pictures/test-vectors/manifest.json');for(const p of Object.values(manifest))if(p.src)assert.ok(fs.existsSync(path.resolve(__dirname,'../../khoa-hoc',p.src)),p.src);
});
test('Source-dependent positions, times and abilities agree with the printed clues',()=>{
 const get=(id)=>tests.flatMap(t=>t.items).find(q=>q.id===id);
 const train=get('family-friends-1-program-test5-u13-e3-q2');assert.equal(train.answer,'train');assert.ok(train.visual.objects.some(o=>o.name==='train'&&o.where==='under'&&o.place==='bed'));
 const under=get('family-friends-1-program-test2-u5-e3-q5');assert.equal(under.answer,'under');assert.deepEqual(under.visual,{kind:'relation',object:'car',place:'seesaw',where:'under'});
 const quarter=get('family-friends-2-program-test4-u11-e2-q2');assert.equal(quarter.answer,'quarter');assert.deepEqual(quarter.visual,{kind:'clock',hour:9,minute:45});
 const can=get('family-friends-2-program-test1-u3-e3-q2');assert.equal(can.answer,'can');assert.ok(can.visual.rows.some(r=>r[0]==='Kim'&&r[1]==='ride a bike'&&r[2]===true));
 const cant=get('family-friends-2-program-test1-u3-e3-q3');assert.equal(cant.answer,"can't");assert.ok(cant.visual.rows.some(r=>r[0]==='Ben'&&r[1]==='skate'&&r[2]===false));
});
test('Spelling fragments and scrambled letters are visual tasks, never mispronounced as words',()=>{
 for(const t of tests)for(const q of t.items)if(/Put the letters|Complete the word/.test(q.prompt)||/[A-Za-z]_+|_+[A-Za-z]/.test(q.scene))assert.equal(parts.speech(q).length,0,q.id);
});
