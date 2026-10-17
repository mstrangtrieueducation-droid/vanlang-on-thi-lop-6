const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const catalog=require('../vu-tru/catalog.json'),map=require('../vu-tru/teaching-map.json'),P=require('../game-kit/classroom-progress'),C=require('../game-kit/student-context'),mode=require('../game-kit/adventures/gameplay-core').mode,coach=require('../game-kit/adventures/learning');
for(const [n,sounds,reviews] of [[1,26,9],[2,25,9],[3,26,9],[4,32,11]])test('Phonics '+n+': curriculum, stories, pictures, scoring IDs and classroom gates',()=>{
 const c=require('./data/phonics-'+n+'.json'),registered=catalog.find(x=>x.id===c.id),single=c.lessons.filter(l=>l.kind==='sound');assert.equal(single.length,sounds);assert.equal(c.lessons.filter(l=>l.kind==='unit-review').length,reviews);
 const ids=new Set();let block=[];
 for(const l of c.lessons){
  assert.ok(l.sourceLessons.length);assert.deepEqual(coach.plan(l.items).map(x=>x.id),l.items.map(x=>x.id));
  if(l.kind==='sound'){block.push(l);assert.equal(l.focusSounds.length,1);assert.equal(l.items.length,5);assert.ok(l.items.every(q=>!q.storyId));}
  else{assert.deepEqual(l.requiredLevels,block.map(x=>x.id));assert.ok(block.length<=3&&block.length>=1);assert.equal(l.items.filter(q=>q.storyId).length,block.length);assert.deepEqual(l.focusSounds,block.flatMap(x=>x.focusSounds));block=[];}
  for(const q of l.items){assert.ok(!ids.has(q.id));ids.add(q.id);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options.filter(x=>x===q.answer).length,1);assert.equal(mode(q,2),'standard');if(q.storyId){assert.equal(l.kind,'unit-review');assert.equal((q.scene.match(/___/g)||[]).length,1);assert.ok(q.storyText.includes(q.answer));assert.equal(q.spokenScene,q.storyText);}
   for(const pic of Object.values(q.pictureOptions||{})){assert.ok(pic.sheet>=1&&pic.sheet<=4&&pic.cell>=0&&pic.cell<16);assert.ok(fs.existsSync('game-kit/adventures/pictures/phonics-sheet-'+pic.sheet+'-v1.png'));}
  }
 }
 const firstReview=c.lessons[3],allGroups=map[c.id][firstReview.id].sourceGroups,rows=allGroups.map(g=>({url:g[0]}));assert.ok(P.limits([registered],map,rows).allowed[c.id].includes(firstReview.id));
 if(allGroups.length>1)assert.ok(!P.limits([registered],map,rows.slice(0,-1)).allowed[c.id].includes(firstReview.id));
 const allowed=c.lessons.slice(0,4).map(l=>l.id),ctx={...C.normalize({schema:3,student:'A'.repeat(22),course:c.id,className:'KIDS21',parentRoute:'/rge9fi0s/',name:'Test',issuedAt:Date.now(),books:{[c.id]:[]},limits:{[c.id]:4},allowed:{[c.id]:allowed}}),entered:true};
 const progress={lessons:Object.fromEntries(allowed.slice(0,2).map(id=>[id,{stars:1}]))};assert.equal(C.status(registered,4,progress,ctx).open,false);progress.lessons[allowed[2]]={stars:1};assert.equal(C.status(registered,4,progress,ctx).open,true);assert.equal(C.status(registered,5,progress,ctx).open,false);
 assert.equal(c.legacyAliases['game-1'],single[0].id);
});
