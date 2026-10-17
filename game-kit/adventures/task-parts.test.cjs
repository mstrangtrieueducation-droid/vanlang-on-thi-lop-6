const {test}=require('node:test'),assert=require('node:assert/strict'),parts=require('./task-parts.js');
const courses=require('../../khoa-hoc/content.cjs'),legacy=require('../../vu-tru/legacy-lessons.json');
test('Every lesson groups stably without changing any source question, ID or answer',()=>{
 for(const lesson of [...Object.values(courses).flatMap(c=>c.lessons),...legacy.lessons]){
  const before=JSON.stringify(lesson.items),g=parts.group(lesson.items);
  assert.deepEqual(g.map(q=>q.id).sort(),lesson.items.map(q=>q.id).sort());
  assert.equal(JSON.stringify(lesson.items),before);assert.ok(g.every(q=>lesson.items.includes(q)));
  assert.deepEqual(parts.group(g),g);
  for(let i=0;i<g.length;i++){const p=parts.at(g,i);assert.ok(p.number>=1&&p.number<=p.total);assert.ok(p.question>=1&&p.question<=p.count);}
 }
});
test('Picture listening, matching, ordering and typing stay distinct; original sections remain separate',()=>{
 const qs=[{id:'a',pictureOptions:{},skill:'listening'},{id:'b',matchPictures:[]},{id:'c',pictureOptions:{},skill:'listening'},{id:'d',orderWords:[],skill:'grammar'},{id:'e',inputMode:'typing',skill:'listening'}];
 assert.deepEqual(parts.group(qs).map(q=>q.id),['a','c','b','d','e']);
 assert.equal(parts.at(parts.group(qs),1).question,2);
 assert.notEqual(parts.describe({partId:'section-a'}).block,parts.describe({partId:'section-b'}).block);
});
test('Per-question narration contains content, never repeated task directions',()=>{
 assert.deepEqual(parts.speech({spokenScene:'cat',spokenPrompt:'Listen and choose the correct picture.'}),['cat']);
 assert.deepEqual(parts.speech({scene:'The girl is in Hanoi.',prompt:'Where does she live?'}),['The girl is in Hanoi.','Where does she live?']);
 assert.deepEqual(parts.speech({scene:'Listen to Titi.',spokenPrompt:'Choose the word.'}),[]);
 assert.deepEqual(parts.speech({scene:'A story.',storyText:'A story.',prompt:'Who is in the story?'}),['Who is in the story?']);
 assert.deepEqual(parts.speech({sourceAudio:'original.mp3',prompt:'Listen and write.'}),[]);
});
test('Dependent question sequences are not reordered',()=>{
 const qs=[{id:'a',picturePrompt:{}},{id:'b',prompt:'Use the previous answer.'},{id:'c',picturePrompt:{}}];assert.deepEqual(parts.group(qs),qs);
});
