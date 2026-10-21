const {test}=require('node:test'),assert=require('node:assert/strict');
const view=require('./dialogue.js'),stories=require('../../khoa-hoc/program/family-stories.cjs'),speakers=require('../../khoa-hoc/program/family-speakers.cjs');
test('All 30 source comic transcripts retain every word with explicit speaker boundaries',()=>{
 for(const book of [1,2])for(let unit=1;unit<=15;unit++){
  const panels=stories[book][unit-1][0],turns=speakers.extract(book,unit,panels);
  assert.equal(turns.map(t=>t.text).join(' '),panels.join(' '));
  assert.ok(new Set(turns.map(t=>t.speaker)).size>=2);
  assert.ok(turns.every(t=>t.speaker&&t.text&&t.panel>0));
 }
});
test('Reading parser never invents alternating speakers or misreads a heading',()=>{
 assert.deepEqual(view.parse('Words: apple, ant, ax.'),[]);
 assert.deepEqual(view.parse('What is this? It is a pen.'),[]);
 assert.deepEqual(view.parse('Tim: What is this?\nRosy: It is a pen.'),[{speaker:'Tim',text:'What is this?'},{speaker:'Rosy',text:'It is a pen.'}]);
 assert.deepEqual(view.parse('After class, Tim meets Rosy. Tim: Hello!\nRosy: Hi!').map(t=>t.speaker),['Narrator','Tim','Rosy']);
 assert.equal(view.parse('First speaker: I like apples. Second speaker: I like pears.').length,2);
});
test('Every explicit dialogue renders safe visible speaker names with or without avatars',()=>{
 const html=view.render({dialogue:[{speaker:'Tim',text:'Hello!',avatar:'../avatars/tim.png'},{speaker:'<Rosy>',text:'<img src=x onerror=alert(1)>',avatar:'javascript:alert(1)'}]});
 assert.ok(html.includes('Tim:</strong>'));assert.ok(html.includes('&lt;Rosy&gt;:</strong>'));
 assert.ok(!html.includes('javascript:'));assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('speaker-avatar'));
});
test('Family comic questions, excerpts and whole-story speech all use source speaker metadata',()=>{
 const courses=require('../../khoa-hoc/content.cjs');
 for(const book of [1,2])for(const lesson of courses[`family-friends-${book}`].lessons)for(const q of lesson.items.filter(q=>/-lesson1$/.test(q.storyId||''))){
  assert.ok(q.storyDialogue?.length,q.id);assert.equal(q.storySpeech,view.transcript(q.storyDialogue));
  assert.ok(q.dialogue?.length,q.id);assert.ok(view.render(q).includes('speaker-name'));
  if(q.skill==='listening')assert.ok(q.spokenScene.startsWith(q.dialogue[0].speaker+': '),q.id);
 }
 const q=courses['family-friends-1'].lessons.flatMap(l=>l.items).find(q=>q.storyId==='family-friends-1-u1-lesson1'&&q.skill==='reading');
 assert.equal(q.dialogue[0].speaker,'Billy');assert.equal(q.dialogue[1].speaker,'Rosy');
});
