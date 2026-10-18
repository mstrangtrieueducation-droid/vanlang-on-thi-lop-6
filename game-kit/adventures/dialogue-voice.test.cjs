const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {cast}=require('../tools/dialogue-cast.cjs'),source=require('./dialogue-audio/source.json');
test('family roles have separate native English profiles; Titi keeps Ana',()=>{
 assert.equal(cast('Titi').voice,'en-US-AnaNeural');
 const roles=['Tim','Rosy','Mum','Dad','Grandpa','Grandma'].map(n=>cast(n));
 assert.equal(new Set(roles.map(r=>r.voice)).size,6);assert.equal(cast('Grandpa').role,'grandfather');assert.equal(cast('Mum').role,'woman');
 assert(roles.every(r=>/^en-(US|GB)-/.test(r.voice)));
});
test('every per-course dialogue clip exists, has source speaker and complete audio',()=>{
 for(const course of Object.keys(source.courses)){
  const {entries}=require('./dialogue-audio/'+course+'.json');assert.equal(Object.keys(entries).length,source.courses[course]);
  for(const [text,seq] of Object.entries(entries)){assert(text.trim());assert(seq.length);for(const c of seq){assert(c.speaker);assert(Number.isInteger(c.turn));const file=path.resolve(__dirname,'../../khoa-hoc',c.src);assert(fs.existsSync(file),file);assert(fs.statSync(file).size>800);}}
 }
 assert(source.clips.every(c=>/[A-Za-z0-9]/.test(c.text)));
});
test('an entire FF story uses its annotated speakers without reading the labels',()=>{
 const d=require('../../khoa-hoc/data/family-friends-1.json');const q=d.lessons.flatMap(l=>l.items||[]).find(q=>q.storyDialogue?.length>2);
 const seq=require('./dialogue-audio/family-friends-1.json').entries[q.storySpeech];
 assert.deepEqual([...new Set(seq.map(c=>c.speaker))],[...new Set(q.storyDialogue.map(t=>t.speaker))]);
 const clips=seq.map(c=>source.clips.find(s=>c.src.endsWith(s.id+'.mp3'))).filter(Boolean);
 assert(clips.every(c=>!c.text.startsWith('Billy:')&&!c.text.startsWith('Rosy:')));
 assert(new Set(clips.map(c=>c.voice)).size>=2);
});
