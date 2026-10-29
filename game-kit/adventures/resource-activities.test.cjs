const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const Units=require('../../khoa-hoc/phonics-units.cjs'),E=require('./reading-evidence.js');
test('New Phonics tasks retain exact 30/45 counts, taught vocabulary, valid paths and at most one tracing item',()=>{
 const counts={};for(let n=1;n<=4;n++)for(const l of require('../../khoa-hoc/data/phonics-'+n+'.json').lessons){
  assert.equal(l.items.length,l.kind==='unit-review'?45:30);assert(l.items.filter(q=>q.resourceTask?.kind==='trace').length<=1);
  const u=Units[n][l.unit-1],allowed=new Set(u.levels.slice(0,l.kind==='unit-review'?3:l.stage).flatMap(x=>x.words));
  for(const q of l.items){const t=q.resourceTask;if(!t)continue;counts[t.kind]=(counts[t.kind]||0)+1;assert(q.options.includes(q.answer));assert(q.source.url&&q.source.page);assert(!/\bsay\b/i.test(q.prompt));
   const objects=[...(t.cells||[]).filter(c=>c.picture),...(t.cards||[]),...(t.pairs||[]),...(t.groups||[]).flat()];for(const p of objects){assert(allowed.has(p.word),q.id+' introduces '+p.word);assert(p.picture?.src);}
   if(t.kind==='trace'){assert.equal(n,1);assert.equal(t.letters.length,2);assert.equal(t.letters[0].text.toLowerCase(),t.letters[1].text);assert(t.letters.every(l=>l.strokes.length));}
   if(t.kind==='soundPath'){assert(t.cells[t.path[0]].start);assert(t.cells[t.path.at(-1)].finish);for(let i=1;i<t.path.length;i++){let a=t.path[i-1],b=t.path[i];assert.equal(Math.abs(a%4-b%4)+Math.abs(Math.floor(a/4)-Math.floor(b/4)),1);}assert.equal(t.path.map(i=>t.cells[i].word).join(' → '),q.answer);}
   if(t.kind==='circleMatch'){assert.equal(t.cards.length,8);assert(t.correct.every(w=>allowed.has(w)));}
   if(t.kind==='soundGroups'){assert.equal(t.groups.length,3);assert.equal(q.options.length,3);assert.equal(q.answer,'Group '+(t.correctGroup+1));assert(t.correctGroup>=0&&t.correctGroup<3);}
  }
 }for(const kind of ['trace','soundPath','circleMatch','soundGroups','letterChain'])assert(counts[kind]>0,kind);
});
test('FF and Discover thinking activities use exact source passages, preserve speakers, and never include tracing',()=>{
 const counts={};for(const id of ['family-friends-1','family-friends-2','discover-1','discover-2','discover-3','discover-4'])for(const l of require('../../khoa-hoc/data/'+id+'.json').lessons)for(const q of l.items){const t=q.resourceTask;if(!t)continue;counts[t.kind]=(counts[t.kind]||0)+1;assert.equal(l.kind,'unit-review');assert(!['trace','soundPath','letterChain'].includes(t.kind));assert(q.storyText);assert(q.options.includes(q.answer));assert(E.quotes(q).length,q.id);
  if(t.kind==='contextSequence'){assert.equal(new Set(t.events).size,3);assert(t.events.every(s=>E.norm(q.storyText).includes(E.norm(s))));assert.equal(q.answer,t.events.join(' → '));}
  if(t.kind==='readingError'){assert(q.storyText.toLowerCase().includes((t.before+q.answer+t.after).toLowerCase()));assert.notEqual(t.error,q.answer);}
  if(q.storyDialogue)assert(q.storyDialogue.every(t=>t.speaker&&t.text));
 }for(const kind of ['mindMap','contextSequence','readingError'])assert(counts[kind]>=80,kind);
});
test('No runtime plays question-number clips, and each exercise runtime waits for its entry choice',()=>{
 for(const f of ['engine.js','hidden-listening.js','../../discover-exam/question-audio.js']){const s=fs.readFileSync(__dirname+'/'+f,'utf8');assert(!s.includes('QuestionNumbers'));}
 for(const f of ['engine.js','hidden-listening.js','../../discover-exam/app.js','../../fighter/app.js'])assert(fs.readFileSync(__dirname+'/'+f,'utf8').includes('StartNewJourney.choose'),f);
 assert(!fs.readFileSync(__dirname+'/entry.js','utf8').includes('setInterval'));
});

 test('Image warmup preserves direct sources and never rewrites missing paths',()=>{
 const vm=require('node:vm'),ctx={window:{GameMedia:{url:s=>'media/'+s}},navigator:{},Map,WeakMap};vm.runInNewContext(fs.readFileSync(__dirname+'/../image-warmup.js','utf8'),ctx);
 assert.equal(ctx.window.TitiImages.source(null),null);assert.equal(ctx.window.TitiImages.source({}),null);assert.equal(ctx.window.TitiImages.source({src:'x.webp'}),'media/x.webp');assert.equal(ctx.window.TitiImages.source({src:'../van-lang/exams/source/test-1/original-q17.png'}),'../van-lang/exams/source/test-1/original-q17.png');
 });

 test('Verified original recordings retain source track provenance and exact file hashes',()=>{
 const vm=require('node:vm'),crypto=require('node:crypto'),ctx={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/resources-audio/manifest.js','utf8'),ctx);
 for(const [id,record]of Object.entries(ctx.window.ResourcesRecordings)){if(record.unavailable){assert(record.reason.includes('different Class Book edition'));assert(!record.src);continue;}assert(/^(?:family-friends-[12]|discover-[1-4])-u\d+-(?:source|reading|lesson1)$/.test(id));if(record.delivery){assert(record.originalSHA256);assert(record.delivery.includes('no generated speech'));}assert(record.sourceUrl.includes('drive.google.com/file/d/'));const file=__dirname+'/../../'+record.src.slice(3);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),record.sha256);}
 });
