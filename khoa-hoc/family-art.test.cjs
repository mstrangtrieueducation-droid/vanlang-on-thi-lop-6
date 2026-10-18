const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const old=require('../game-kit/adventures/pictures/family-cards/manifest.json');
const art=require('../game-kit/adventures/pictures/family-cards/3d-v3/manifest.json');
const courses=require('./content.cjs');
test('Every original FF vocabulary image has a generated semantic replacement',()=>{
 assert.deepEqual(Object.keys(art.items),Object.keys(old));
 for(const [key,p]of Object.entries(art.items)){
  assert.equal(p.artPack,'family-3d-v3');assert.equal(p.semantic,key.split(':').at(-1));
  assert.ok(p.cell>=0&&p.cell<12);assert.equal(p.columns,3);assert.equal(p.rows,4);
  const bytes=fs.readFileSync(path.resolve(__dirname,p.atlas));assert.equal(bytes.toString('ascii',1,4),'PNG');
  assert.equal(bytes.readUInt32BE(16),p.width);assert.equal(bytes.readUInt32BE(20),p.height);
  assert.ok(p.width/3>=350&&p.height/4>=350);assert.ok(Math.abs(p.cellAspect-1)<.01);
 }
});
test('All FF practice picture surfaces use new artwork; answer keys stay intact',()=>{
 let count=0;
 for(const n of [1,2])for(const l of courses[`family-friends-${n}`].lessons)for(const q of l.items){
  const pictures=[...Object.values(q.pictureOptions||{}),...(q.matchPictures||[]),...(q.picturePrompt?[q.picturePrompt]:[])];
  for(const p of pictures){assert.equal(p.artPack,'family-3d-v3',q.id);count++;}
  if(q.pictureOptions)for(const [word,p]of Object.entries(q.pictureOptions))assert.equal(p.semantic,word);
  if(q.matchPictures)assert.deepEqual(q.matchPictures.map(p=>p.semantic),q.answer.split(' → '));
 }
 assert.ok(count>1000);
});
test('All FF test illustrations use generated subjects, with source geometry and answer keys preserved',()=>{
 const scenes=require('../game-kit/adventures/test-scenes.js'),{execFileSync}=require('node:child_process');
 for(const n of [1,2]){
  const before=JSON.parse(execFileSync('git',['show',`HEAD:khoa-hoc/data/family-friends-${n}.json`],{encoding:'utf8',maxBuffer:15e6}));
  const now=courses[`family-friends-${n}`];
  const answers=c=>c.lessons.filter(l=>l.kind==='progress-test').map(l=>({id:l.id,sourceLessons:l.sourceLessons,items:l.items.map(q=>({id:q.id,answer:q.answer,acceptedAnswers:q.acceptedAnswers,options:q.options,inputMode:q.inputMode,visual:q.visual}))}));
  assert.deepEqual(answers(now),answers(before));
  for(const l of now.lessons)for(const q of l.items)if(q.visual){const html=scenes.render(q);assert(!html.includes('[object Object]'));for(const m of html.matchAll(/href="([^"]+)"/g))assert(m[1].includes('/3d-v3/'),q.id);}
 }
});
