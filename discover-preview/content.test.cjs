const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const courses=require('./build.cjs'),{plan}=require('../khoa-hoc/program/discover-plan.cjs'),parts=require('../game-kit/adventures/task-parts.js'),rules=require('../game-kit/adventures/rules.js');
test('Discover preview: exact Program session names, 30/30/30/45, unique ids and all skills',()=>{
 const ids=new Set();for(const c of courses){assert.deepEqual(c.lessons.map(l=>l.items.length),[30,30,30,45]);const p=plan(Number(c.id.at(-1)));assert.deepEqual(c.lessons.slice(0,3).map(l=>l.title),p.sessions.slice(0,3).map(s=>s.title));
  for(const l of c.lessons){for(const q of l.items){assert(!ids.has(q.id));ids.add(q.id);assert.equal(new Set(q.options).size,4);assert(q.options.includes(q.answer));assert(q.source.url.startsWith('https://'));assert(!q.source.url.includes('accessToken'));assert(q.why.length>12);if(q.inputMode==='typing')assert(rules.check(q,' '+q.answer.toUpperCase()+' '));if(q.orderWords)assert.deepEqual(new Set(q.orderWords),new Set(q.answer.split(' → ')));}
   const grouped=parts.group(l.items);assert.deepEqual(new Set(grouped.map(q=>q.id)),new Set(l.items.map(q=>q.id)));assert(parts.sections(grouped).length>=3);
  }
  const review=c.lessons[3];assert(review.items.every(q=>q.source.unit===1),'Unit 2 vocabulary leaked into Unit 1 review');for(const s of ['grammar','reading','listening','vocabulary','word-study'])assert(review.items.some(q=>q.skill===s));assert(c.lessons[2].items.some(q=>q.source.unit===2));
 }assert.equal(ids.size,540);
});
test('Source reading, named caption speakers and no scan/photo placeholders',()=>{
 const d1=courses[0].lessons[0].items.find(q=>q.storyText).storyText;for(const name of ["Seb's family:","Mandy's family:","Kim's family:",'Friends:'])assert(d1.includes(name));
 for(const c of courses)for(const l of c.lessons)for(const q of l.items){assert(!q.sourceImage);const pics=[q.picturePrompt,...Object.values(q.pictureOptions||{}),...(q.matchPictures||[])].filter(Boolean);for(const p of pics){assert(p.atlas);assert(fs.existsSync(path.resolve(__dirname,p.atlas)));assert(p.cell>=0&&p.cell<p.columns*p.rows);}}
});
test('Atlas rendering preserves original picture rendering and rectangular sprite bounds',()=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../game-kit/adventures/phonics-activities.js'),'utf8'),ctx);const f=ctx.window.PhonicsActivities.picture;
 assert(f({src:'sample.webp'}).includes('src="sample.webp"'));assert(f({sheet:1,cell:15}).includes('100% 100%'));const html=f({atlas:'../discover-preview/art/space.png',columns:4,rows:3,cell:11});assert(html.includes('400% 300%'));assert(html.includes('100% 100%'));assert(html.includes('aspect-ratio:3/4'));
});
