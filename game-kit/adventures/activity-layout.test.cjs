const {test}=require('node:test'),assert=require('node:assert/strict');
const layout=require('./activity-layout.js'),courses=require('../../khoa-hoc/content.cjs');
const all=Object.values(courses).flatMap(c=>c.lessons.flatMap(l=>l.items));
function seeded(seed){return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}
test('All course picture matching uses independent rows and preserves canonical response indices',()=>{
 const questions=all.filter(q=>q.matchPictures);assert.ok(questions.length>=660);
 for(const q of questions){const before=JSON.stringify(q),correct=q.answer.split(' → ');
  for(let seed=1;seed<=20;seed++){const a=layout.create(q,seeded(seed));assert.equal(a.pictures.length,correct.length);assert.equal(new Set(a.pictures).size,correct.length);a.pictures.forEach((id,row)=>assert.notEqual(correct[id],a.words[row],q.id));const submission=[];for(const id of a.pictures)submission[id]=correct[id];assert.equal(submission.join(' → '),q.answer);assert.deepEqual(layout.restore(q,JSON.parse(JSON.stringify(a)),()=>{throw Error('Must not reshuffle');}),a);}
  assert.equal(JSON.stringify(q),before);
 }
});
test('Order, build, and choice cards stay stable on refresh and invalid saved layouts are repaired',()=>{
 const q={id:'x',answer:'a → b → c',matchWords:['a','b','c'],matchPictures:[{},{},{}],options:['a','b','c','d']};
 const a=layout.create(q,()=>0);a.pictures.forEach((id,row)=>assert.notEqual(q.answer.split(' → ')[id],a.words[row]));
 assert.notDeepEqual(layout.restore(q,{...a,pictures:[0,0,1]},()=>0).pictures,[0,0,1]);
 for(const item of all.filter(q=>q.orderWords||q.options).slice(0,250)){const saved=layout.create(item,seeded(44));assert.deepEqual(layout.restore(item,saved,()=>{throw Error('Must stay fixed');}),saved);if(item.orderWords)assert.notEqual(saved.order.join(' → '),item.answer);}
});
test('Shared image library replaces known vocabulary across courses but keeps contextual tests intact',()=>{
 const fs=require('node:fs'),path=require('node:path'),lib=require('../../khoa-hoc/image-library.cjs'),manifest=require('./pictures/vocabulary-3d/manifest.json');
 assert.ok(Object.keys(manifest.items).length>=18);
 for(const art of Object.values(manifest.items)){assert.ok(art.width>=1024&&art.height>=1024);assert.ok(fs.existsSync(path.resolve(__dirname,'../../khoa-hoc',art.src)));}
 const images=all.flatMap(q=>[q.picturePrompt,...Object.values(q.pictureOptions||{}),...(q.matchPictures||[])]).filter(Boolean);
 assert.ok(images.filter(p=>p.semantic==='bed').every(p=>p.src.includes('vocabulary-3d/bed.png')));
 const p={src:'unknown.png'},test={exam:true,picturePrompt:{src:'../game-kit/adventures/pictures/book-cards/p1-007.png'}};assert.equal(lib.resolve(p),p);lib({any:{lessons:[{items:[test]}]}});assert.ok(test.picturePrompt.src.includes('book-cards'));
});
