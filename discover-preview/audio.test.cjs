const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const courses=require('./build.cjs'),parts=require('../game-kit/adventures/task-parts.js');
test('Every Discover clue, Part instruction and whole reading has complete local English audio',()=>{
 const ctx={window:{}};for(const file of ['../game-kit/adventures/native-voice.js','voice.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,file),'utf8'),ctx);
 assert.equal(ctx.window.TitiVoice.id,'en-US-AnaNeural');const checked=new Set();
 for(const c of courses)for(const l of c.lessons)for(const q of l.items)for(const text of [...parts.speech(q),parts.describe(q).instruction,q.storySpeech||q.storyText].filter(Boolean)){
  if(checked.has(text))continue;checked.add(text);const clips=ctx.window.TitiVoice.lookup(text);assert(clips,'Missing speech: '+text.slice(0,90));
  for(const file of [clips].flat(3)){assert(!/^https?:/i.test(file));const absolute=path.resolve(__dirname,file);assert(fs.existsSync(absolute),'Missing audio '+file);assert(fs.statSync(absolute).size>1000,'Empty recording '+file);}
 }
 assert(checked.size>3000);assert(ctx.window.TitiVoice.lookup('Excellent!'),'Existing feedback lookup must remain available');
});
test('Map loads a small catalog and each lesson has its own question payload',()=>{
 for(const c of courses){const file=path.join(__dirname,'data',c.id+'.json'),catalog=JSON.parse(fs.readFileSync(file));assert(fs.statSync(file).size<150000);assert(catalog.lessons.every(l=>l.items.length===0));for(const meta of catalog.lessons){const lesson=JSON.parse(fs.readFileSync(path.join(__dirname,'data',c.id,meta.id+'.json')));assert.equal(lesson.items.length,meta.questionCount);assert.equal(lesson.id,meta.id);assert.equal(lesson.title,meta.title);}}
});
