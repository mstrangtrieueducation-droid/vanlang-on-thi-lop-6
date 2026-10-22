const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const T=require('./game-kit/adventures/task-parts'),E=require('./game-kit/adventures/reading-evidence'),L=require('./khoa-hoc/program/grammar-language.cjs');
test('Văn Lang reads short questions but not long references; other courses read question content without repeating directions',()=>{
 for(const q of [{scene:'She ___ kind.'},{storyText:'Reference',scene:'Why did she help?'}]){assert.equal(T.automatic(q,'van-lang'),true);assert.equal(T.instructionOnly(q,'van-lang'),false);}const order={type:'build',scene:'Put these words in order.'};assert.equal(T.automatic(order,'van-lang'),false);assert.equal(T.instructionOnly(order,'van-lang'),true);
 assert.equal(T.automatic({scene:'What does the notice say?'},'van-lang'),true);
 for(const id of ['family-friends-1','family-friends-2','discover-1','discover-2','discover-3','discover-4']){const q={storyText:'Long reference.',scene:'Long reference.',prompt:'Who helps Kim?',partType:'readChoose'};assert(T.automatic(q,id));assert.deepEqual(T.speech(q,{course:id}),['Who helps Kim?']);}
});
test('Every dictation result reveals each source gap once, with bold red-answer markup and numeric labels',()=>{
 const env={window:{}};vm.runInNewContext(fs.readFileSync('game-kit/adventures/dictation-sheet.js','utf8'),env);const D=env.window.DictationSheet;
 let units=0;for(const course of fs.readdirSync('khoa-hoc/dictation'))for(const file of fs.readdirSync('khoa-hoc/dictation/'+course)){const pack=require('./khoa-hoc/dictation/'+course+'/'+file),html=D.answerKey(pack.items);assert.equal((html.match(/class="dictation-answer"/g)||[]).length,pack.items.length);assert(!html.includes('data-sheet-input'));assert(!/<p[^>]*>One\.\s/.test(html));units++;}assert.equal(units,102);
 const ordinary={tokens:[{text:'One'},{text:' apple is red.'}]};assert.equal(D.paragraph(ordinary).number,false);
});
test('All 102 grammar summaries and 2040 explanations have Vietnamese teaching prose and translated examples',()=>{
 for(const course of fs.readdirSync('khoa-hoc/grammar'))for(const file of fs.readdirSync('khoa-hoc/grammar/'+course)){const p=require('./khoa-hoc/grammar/'+course+'/'+file);assert.equal(p.items.length,20);for(const r of p.summary){assert(L.vi(r.tag),r.tag);assert(L.vi(r.usage),r.usage);assert(L.vi(r.note),r.note);assert(L.vi(r.exampleVi),r.example);assert(!/Affirmative|Negative|Interrogative/.test(r.sentenceType));}for(const q of p.items){assert(L.vi(q.why),q.id);if(!q.contextApplication){assert(q.explanationExample.en);assert(L.vi(q.explanationExample.vi),q.id);}}}
});
test('Every Discover reading/listening choice with a visible script has an exact source evidence quotation',()=>{
 let count=0;for(let n=1;n<=4;n++)for(const lesson of require('./khoa-hoc/data/discover-'+n+'.json').lessons)for(const q of lesson.items)if(q.storyText&&q.type==='choice'&&!q.orderWords&&(['readChoose','listenChoose','listenGap'].includes(q.partType||'readChoose')||!!q.resourceTask)){const before=JSON.stringify(q),quotes=E.quotes(q);assert(quotes.length,q.id);assert(quotes.every(quote=>E.norm(q.storyText).includes(E.norm(quote))),q.id);assert.equal(JSON.stringify(q),before);count++;}assert.equal(count,2276);
});
test('Narrators default to Titi; known men, women and grandparents use the corresponding native performance profiles',()=>{
 const {cast}=require('./game-kit/tools/dialogue-cast.cjs');assert.equal(cast('Narrator').voice,cast('Titi').voice);for(const name of ['Dad','Father','Mr. Lombardi','Patrick'])assert.equal(cast(name).role,'man');for(const name of ['Mom','Mother','Mrs. Anderson'])assert.equal(cast(name).role,'woman');assert.equal(cast('Grandpa').role,'grandfather');assert.equal(cast('Grandma').role,'grandmother');assert.deepEqual(cast('Old woman and old man').ensemble.map(p=>p.role),['grandmother','grandfather']);assert.deepEqual(cast('Tim and Rosy').ensemble.map(p=>p.role),['boy','girl']);
});
