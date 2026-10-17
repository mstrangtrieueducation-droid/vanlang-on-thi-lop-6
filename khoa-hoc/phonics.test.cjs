const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const catalog=require('../vu-tru/catalog.json'),map=require('../vu-tru/teaching-map.json'),P=require('../game-kit/classroom-progress'),C=require('../game-kit/student-context'),coach=require('../game-kit/adventures/learning'),rules=require('../game-kit/adventures/rules'),plan=require('./phonics-units.cjs');
for(const n of [1,2,3,4])test('Phonics '+n+': textbook units, 15/45 questions, five formats, pictures and evidence gates',()=>{
 const c=require('./data/phonics-'+n+'.json'),registered=catalog.find(x=>x.id===c.id);assert.equal(c.version,3);assert.equal(c.lessons.length,32);
 const ids=new Set();
 for(let u=0;u<8;u++){
  const block=c.lessons.slice(u*4,u*4+4),review=block[3];assert.deepEqual(review.requiredLevels,block.slice(0,3).map(l=>l.id));
  for(const [i,l]of block.entries()){
   assert.equal(l.unit,u+1);assert.equal(l.items.length,i===3?45:15);assert.deepEqual(coach.plan(l.items).map(x=>x.id).sort(),l.items.map(x=>x.id).sort());
   const kinds=new Set(l.items.map(q=>q.interaction));for(const kind of ['picture','phonics-look','phonics-category','phonics-order','phonics-match'])assert.ok(kinds.has(kind),l.id+' missing '+kind);
   for(const d of ['easy','medium','advanced'])assert.equal(l.items.filter(q=>q.difficulty===d).length,i===3?15:5);
   if(i<3){assert.ok(l.items.every(q=>!q.storyId));const covered=l.items.flatMap(q=>q.answer.split(' → '));for(const w of plan[n][u].levels[i].words)assert.ok(covered.includes(w),l.id+' missing '+w);}
   else assert.equal(l.items.filter(q=>q.storyId).length,6);
   for(const q of l.items){
    assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(q.id.includes('-v3-'));assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options.filter(x=>x===q.answer).length,1);assert.ok(rules.check(q,q.answer));assert.ok(!rules.check(q,q.options.find(x=>x!==q.answer)));
    if(q.storyId){assert.equal(i,3);assert.equal(q.storySource.page,plan[n][u].page);assert.equal(q.storySource.url,plan[n][u].bookURL);assert.ok(q.storyText.includes(q.spokenScene));if(q.interaction==='phonics-story'&&q.scene.includes('___'))assert.equal((q.scene.match(/___/g)||[]).length,1);}
    if(q.orderWords){assert.equal(q.orderWords.length,3);assert.deepEqual([...q.orderWords].sort(),q.answer.split(' → ').sort());if(q.storyId)for(const a of q.orderWords)for(const b of q.orderWords)if(a!==b)assert.ok(!new RegExp('\\b'+a+'\\b','i').test(b),'Overlapping story events: '+a+' / '+b);}
    if(q.matchPictures){assert.equal(q.matchPictures.length,3);assert.deepEqual([...q.matchWords].sort(),q.answer.split(' → ').sort());}
    for(const pic of [...Object.values(q.pictureOptions||{}),...(q.picturePrompt?[q.picturePrompt]:[]),...(q.matchPictures||[])]){assert.ok(pic?.src);assert.ok(fs.existsSync(path.resolve(__dirname,'../vu-tru',pic.src)));}
   }
   const groups=map[c.id][l.id].sourceGroups;
   if(l.pendingTeaching){assert.equal(groups.length,0);assert.ok(n===4&&u>=6);}
   else {assert.ok(groups.length);const rows=groups.map(g=>({url:g[0]}));assert.ok(P.limits([registered],map,rows).allowed[c.id].includes(l.id));for(let j=0;j<groups.length;j++)assert.ok(!P.limits([registered],map,rows.filter((_,i)=>i!==j)).allowed[c.id].includes(l.id));}
  }
 }
 const first=c.lessons.slice(0,4).map(l=>l.id),ctx={...C.normalize({schema:3,student:'A'.repeat(22),course:c.id,className:'KIDS21',parentRoute:'/rge9fi0s/',name:'Test',issuedAt:Date.now(),books:{[c.id]:[]},limits:{[c.id]:4},allowed:{[c.id]:first}}),entered:true};
 const progress={lessons:Object.fromEntries(first.slice(0,2).map(id=>[id,{stars:1}]))};assert.equal(C.status(registered,4,progress,ctx).open,false);progress.lessons[first[2]]={stars:1};assert.equal(C.status(registered,4,progress,ctx).open,true);assert.equal(C.status(registered,5,progress,ctx).open,false);
 assert.equal(c.legacyAliases['game-1'],c.lessons[0].id);assert.equal(ids.size,720);
});
