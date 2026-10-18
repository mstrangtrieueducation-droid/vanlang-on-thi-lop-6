const {test}=require('node:test'),assert=require('node:assert/strict'),D=require('./data.js'),source=require('./source-snapshot.json'),authored=require('./authored-contexts.json');
test('Primary headword never becomes an unrelated family or antonym entry',()=>{const u=D.units.find(u=>u.track==='Reading 3'&&u.unit===1);assert.equal(u.words[1].word,'establish');assert.equal(u.words[1].pos,'verb');assert.equal(u.words[2].word,'victory');assert.equal(u.words[2].pos,'noun');assert.ok(!u.words[2].forms.some(f=>f.word==='defeat'));});
test('Full source corpus preserved with explicit nullable fields and unique task IDs',()=>{
 assert.equal(D.units.reduce((n,u)=>n+u.words.length,0),1930);const ids=new Set();
 for(const u of D.units){const raw=source.units.find(x=>x.track===u.track&&x.unit===u.unit);assert.equal(raw.entries.length,u.words.length);for(const w of u.words){for(const field of ['unit','word','pos','ipa','meaning','collocation','example','family'])assert.ok(field in w,w.id+' '+field);assert.deepEqual(Object.keys(w.family),['noun','verb','adj','adv']);assert.equal(w.sourceIndex,u.words.indexOf(w));}for(const t of u.tasks){assert.ok(!ids.has(t.id),t.id);ids.add(t.id);assert.equal(t.word,u.words.find(w=>w.id===t.wordId));assert.ok(t.explanation);assert.ok(t.source);}}
});
test('Every cloze reconstructs the exact source example, with distinct valid options',()=>{
 for(const u of D.units)for(const t of u.tasks.filter(t=>t.sentence)){assert.equal(t.sentence.replace('___',t.answer),t.word.example,t.id);assert.equal(new Set(t.choices.map(x=>x.toLowerCase())).size,t.choices.length,t.id);assert.ok(t.choices.includes(t.answer));assert.ok(t.choices.length>=3&&t.choices.length<=4);}
});
test('Word family options are from the same source row and reviewed root, never another word entry',()=>{
 const roots=require('./word-families.cjs');for(const u of D.units)for(const t of u.tasks.filter(t=>t.kind==='family')){assert.ok(roots.some(root=>t.family.every(w=>root.includes(w))),t.id);assert.ok(t.word.forms.length>=3);for(const choice of t.choices.filter(c=>c!==t.answer))assert.ok(t.word.forms.some(f=>f.word===choice),t.id);assert.equal(t.origin,'Ví dụ gốc · Word Family');}
});
test('Reading clues are verifiable source spans; authored contexts are labelled separately',()=>{
 for(const u of D.units){const raw=source.units.find(x=>x.track===u.track&&x.unit===u.unit);for(const t of u.tasks.filter(t=>t.kind==='clue'||t.kind==='context')){assert.equal(t.excerpt.slice(t.start,t.end),t.answer,t.id);assert.ok(t.end>t.start);if(t.kind==='context')assert.equal(t.excerpt,t.word.example);else if(t.authored){assert.match(t.origin,/biên soạn/);assert.ok(authored[u.track+':'+u.unit].some(p=>p.text.includes(t.excerpt)));}else{assert.match(t.origin,/Trích nguyên văn/);const normal=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();assert.ok(Object.values(raw.passages).some(p=>(p.paragraphs||[]).some(p=>normal(p.text).includes(normal(t.excerpt)))),t.id);}}}
});
test('Magnetic reconstruction uses an attested collocation, preserving repeated tiles',()=>{
 for(const u of D.units)for(const t of u.tasks.filter(t=>t.kind==='magnet')){assert.ok(t.word.collocation.includes(t.answer),t.id);assert.equal(t.tiles.join(' '),t.answer);assert.ok(t.tiles.length>=2&&t.tiles.length<=6);}
});
test('Supplemental Guidelines test passages cover all Reading 1 and 2 Units without credentials',()=>{
 for(const u of source.units.filter(u=>['Reading 1','Reading 2'].includes(u.track))){assert.ok(u.passages.test.paragraphs.length>=4);assert.match(u.passages.test.source,/docs.google.com/);}assert.ok(!/access=|token=|api_key=/i.test(JSON.stringify(source)));
});
