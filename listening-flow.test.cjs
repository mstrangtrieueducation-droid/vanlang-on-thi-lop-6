const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path'),T=require('./game-kit/adventures/task-parts');
test('Automatic narration follows the course and task, including the Văn Lang exceptions',()=>{
 for(const q of [{scene:'She ___ a student.'},{scene:'Complete … carefully.'},{storyText:Array(80).fill('reading').join(' '),scene:'Why did Sam leave?'},{partType:'readGap',scene:'A sentence'}])assert.equal(T.automatic(q,'van-lang'),false);
 assert.equal(T.automatic({scene:'What does the notice say?'},'van-lang'),true);
 for(let n=1;n<=4;n++)assert.equal(T.automatic({skill:'phonics'},'phonics-'+n),true);
 for(const id of ['family-friends-1','family-friends-2','discover-1','discover-4']){assert.equal(T.automatic({skill:'listening'},id),true);assert.equal(T.automatic({skill:'reading'},id),false);}
});
test('Every Phonics Story question plays one exact sentence and has a dedicated illustration',()=>{
 for(let n=1;n<=4;n++)for(const l of require('./khoa-hoc/data/phonics-'+n+'.json').lessons.filter(l=>l.kind==='unit-review')){
  const qs=l.items.filter(q=>q.storyId);assert.equal(qs.length,6);assert.equal(l.items.length,45);
  for(const q of qs){assert(q.storyText.includes(q.storySentence));assert.deepEqual(T.speech(q,{course:'phonics-'+n}),[q.storySentence]);assert.equal(T.hiddenStory(q,'phonics-'+n),true);assert(fs.existsSync(path.resolve('khoa-hoc',q.storyIllustration)));assert(!q.orderWords);}
 }
});
test('Văn Lang source tests retain canonical answers, original emphasis and explanation',()=>{
 const ids=new Set();for(let n=1;n<=20;n++){const s={window:{}};vm.runInNewContext(fs.readFileSync(`tu-luyen-${n}/quiz-data.js`,'utf8'),s);assert.equal(s.window.ADVENTURE.items.length,40);for(const q of s.window.ADVENTURE.items){assert(!ids.has(q.id));ids.add(q.id);assert(q.source.url.includes('docs.google.com/document/'));assert(q.why);assert(q.options.includes(q.answer));assert(q.keepOrder);assert(q.optionHtml);if(q.picturePrompt)assert(fs.existsSync(path.resolve('tu-luyen-'+n,q.picturePrompt.src)));}}
 assert.equal(ids.size,800);assert.equal(T.markup('<u>ea</u><img src=x onerror=alert(1)>'),'<u>ea</u>');
});
test('Hidden scenes are independently deployable and failed loads are evicted',()=>{
 for(let n=1;n<=4;n++)for(let u=1;u<=8;u++){const pack=require(`./khoa-hoc/hunt-worlds/phonics-${n}/unit-${u}.json`);assert.equal(pack.version,5);const src=pack.questions[0].background.replace('/titi-game-media/assets/','game-kit/adventures/');assert(fs.existsSync(src));}
 assert(fs.readFileSync('game-kit/adventures/hunt-world-renderer.js','utf8').includes('cache.delete(url)'));
});
test('All 36 original Discover tests have a source-audio clip for every listening item',()=>{
 const pack=require('./discover-exam/audio/question-segments.json');assert.equal(pack.parts.length,72);let total=0;
 for(let n=1;n<=4;n++)for(let t=1;t<=9;t++){const test=require(`./discover-exam/data/discover-${n}-test-${t}.json`);for(const [index,s]of test.sections.entries()){if(!s.audio)continue;const p=pack.parts.find(p=>p.test===test.id&&p.sectionIndex===index);assert(p&&!p.error);assert(fs.existsSync(path.resolve('discover-exam',p.instruction)));for(const q of s.questions){const clip=p.questions[q.id];assert(clip);assert(clip.end>clip.start+.3);assert(clip.originalSha256.length===64);assert(clip.text.trim());assert(fs.existsSync(path.resolve('discover-exam',clip.src)));total++;}}}
 assert.equal(total,279);
});
test('A saved run retains valid answers during a bank update without counting removed questions',()=>{
 const F=require('./game-kit/adventures/flow-core');const old={id:'old',elapsedMs:23000,cloud:{id:'old-cloud'},answers:{keep:{firstCorrect:true},removed:{firstCorrect:true}},cloudAnswers:{keep:{first:'a',last:'a'},removed:{first:'b',last:'b'}}};const next=F.reconcile(old,[{id:'keep'},{id:'new'}],'new-run');assert.equal(next.id,'new-run');assert.equal(next.elapsedMs,23000);assert.equal(next.cloud,undefined);assert.deepEqual(Object.keys(next.answers),['keep']);assert.equal(next.answers.keep.firstCorrect,true);assert.equal(next.cloudAnswers.keep.assisted,true);assert(old.answers.removed);
});

test('Continuous dictation sentence mappings keep original answer IDs and identify transcript fallbacks',()=>{
 const manifest=require('./game-kit/adventures/dictation-sentences-v1/manifest.json');assert.equal(manifest.units.length,102);let sentences=0,fallbacks=0;
 for(const unit of manifest.units){assert(!unit.error);const pack=require(`./khoa-hoc/dictation/${unit.course}/unit-${unit.unit}.json`);assert.equal(pack.sentenceAudioVersion,1);assert.equal(Object.keys(unit.items).length,pack.items.length);
  for(const clip of unit.sentences){sentences++;assert(fs.statSync(path.resolve('khoa-hoc',clip.audio)).size>100);if(clip.start===null){fallbacks++;assert.equal(clip.alignmentMethod,'Titi transcript fallback');assert(clip.narrator.includes('Titi'));}else{assert(clip.end>clip.start);assert(clip.coverage>=.8);assert(clip.narrator.includes('Original'));}}
  for(const q of pack.items){assert.deepEqual(q.questionAudio,unit.items[q.id].questionAudio);assert(T.automatic(q,unit.course));assert(q.answer);}
 }assert.equal(sentences,2108);assert.equal(fallbacks,147);
});
