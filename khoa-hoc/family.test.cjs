const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const courses=require('./content.cjs'),rules=require('../game-kit/adventures/rules.js'),coach=require('../game-kit/adventures/learning.js'),P=require('../game-kit/classroom-progress.js'),catalog=require('../vu-tru/catalog.json'),mapping=require('../vu-tru/teaching-map.json'),program=require('./program/parse.cjs').family();
for(const n of [1,2])test(`FF${n}: all Program units, 15/45 counts, test sources and classroom gates`,()=>{
 const c=courses[`family-friends-${n}`],reg=catalog.find(x=>x.id===c.id);assert.equal(c.lessons.length,66);
 assert.equal(c.lessons.filter(l=>l.kind==='practice').length,46);assert.equal(c.lessons.filter(l=>l.kind==='unit-review').length,15);assert.equal(c.lessons.filter(l=>l.kind==='progress-test').length,5);
 for(let u=1;u<=15;u++){
  const stages=c.lessons.filter(l=>l.unit===u&&l.stage),review=c.lessons.find(l=>l.unit===u&&l.kind==='unit-review');assert.equal(stages.length,3);assert.equal(review.items.length,45);assert.deepEqual(review.requiredLevels,stages.map(l=>l.id));
  assert.deepEqual(stages.map(l=>l.sourceLessons[0]),program.units[u-1].stages.map(s=>'lesson-'+s.session));
  for(const l of stages){assert.equal(l.items.length,15);assert.equal(l.title,`Unit ${u} - Lesson ${program.units[u-1].stages[l.stage-1].bookLessons.join(' & ')}`);}
  assert.equal(review.items.filter(q=>q.storySource?.lesson===1).length,5);
  assert.ok(review.items.some(q=>q.storySource&&q.storySource.lesson!==1));
  assert.equal(review.items.filter(q=>q.interaction==='grammar').length,5);
  const all=[...stages.flatMap(l=>l.items),...review.items];for(const kind of ['picture','phonics-look','grammar','spelling','phonics-order','phonics-category','reading','phonics-match'])assert.ok(all.some(q=>q.interaction===kind),kind);
  for(const q of all){assert.equal(coach.skill(q),q.skill);assert.ok(rules.check(q,q.answer));assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);if(q.orderWords)assert.equal(new Set(q.orderWords).size,3);if(q.interaction==='phonics-story'){assert.equal(q.storyText.includes(q.spokenScene),true);assert.equal(q.scene.replace('___',q.answer).toLowerCase(),q.spokenScene.toLowerCase());}}
  const groups=mapping[c.id][review.id].sourceGroups;assert.equal(groups.length,3);assert.ok(!P.limits([reg],mapping,groups.slice(0,2).map(g=>({url:g[0]}))).allowed[c.id].includes(review.id));assert.ok(P.limits([reg],mapping,groups.map(g=>({url:g[0]}))).allowed[c.id].includes(review.id));
 }
 for(const l of c.lessons){for(const q of l.items){for(const p of [...Object.values(q.pictureOptions||{}),...(q.matchPictures||[]),...(q.picturePrompt?[q.picturePrompt]:[])])assert.ok(p?.src&&fs.existsSync(path.resolve(__dirname,p.src)),q.id);if(q.sourceImage)assert.ok(fs.existsSync(path.resolve(__dirname,q.sourceImage)));}
  if(l.kind==='progress-test'){assert.equal(l.items.length,45);assert.deepEqual(coach.plan(l.items),l.items);assert.ok(l.items.every(q=>q.exam&&q.source.url.includes('drive.google.com')));assert.ok(l.items.some(q=>q.inputMode==='typing'));assert.ok(l.items.some(q=>q.options.length===4));for(const q of l.items){assert.ok(rules.check(q,q.answer));assert.ok(!rules.check(q,'not a possible answer'));}const previous=c.lessons[c.lessons.indexOf(l)-1];assert.equal(previous.kind,'unit-review');assert.equal(previous.unit,l.units.at(-1));}
 }
});
test('Typed scoring tolerates spacing, case, terminal punctuation and approved contractions only',()=>{
 const q={inputMode:'typing',answer:"Yes, it is.",acceptedAnswers:[]};assert.ok(rules.check(q,' YES it is! '));assert.ok(!rules.check(q,'Yes it'));assert.ok(rules.check({inputMode:'typing',answer:'Do / do'},'do/do'));const bank=courses['family-friends-1'].lessons.find(l=>l.id==='progress-test-1').items;const negative=bank.find(q=>q.answer==="No, it isn't.");assert.ok(rules.check(negative,'No, it is not.'));assert.ok(!rules.check(negative,'No, it is.'));
});
test('Generation does not rewrite classroom mappings just by importing content',()=>{
 const file=path.join(__dirname,'../vu-tru/teaching-map.json'),before=fs.statSync(file).mtimeMs;delete require.cache[require.resolve('./content.cjs')];require('./content.cjs');assert.equal(fs.statSync(file).mtimeMs,before);
});
