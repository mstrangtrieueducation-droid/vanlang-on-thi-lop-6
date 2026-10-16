const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const games=require('./content.cjs'),rules=require('./rules.js'),root=path.resolve(__dirname,'../..');
test('14 complete games with unique storage and meaningful variety',()=>{
 assert.deepEqual(games.map(g=>g.n),Array.from({length:14},(_,i)=>i+2));
 const ids=new Set(),keys=new Set();for(const g of games){assert.ok(g.items.length>=10);assert.ok(new Set(g.items.map(q=>q.type)).size>=4);const w={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,`tu-luyen-${g.n}/config.js`),'utf8'),w);assert.ok(!keys.has(w.window.GAME_CONFIG.storageKey));keys.add(w.window.GAME_CONFIG.storageKey);
 for(const q of g.items){assert.ok(!ids.has(q.id));ids.add(q.id);for(const field of ['prompt','why','hint','title'])assert.ok(q[field]?.trim(),`${q.id} missing ${field}`);assert.ok(['memory','sort','collect','build','sequence','route','spot','choice'].includes(q.type));
 if(['choice','spot'].includes(q.type)){assert.ok(q.options.includes(q.answer),q.id);assert.ok(q.options.every(x=>typeof x==='string'&&x.trim()));if(q.type==='choice')assert.equal(q.options.length,4,q.id+' must have ABCD');assert.equal(new Set(q.options).size,q.options.length);assert.ok(rules.check(q,q.answer));for(const bad of q.options.filter(x=>x!==q.answer))assert.equal(rules.check(q,bad),false);}
 if(q.type==='spot')assert.equal(q.words.filter(w=>w===q.error).length,1);
 if(['build','sequence'].includes(q.type)){assert.ok(q.answer.length>=3);assert.ok(rules.check(q,q.answer));assert.equal(rules.check(q,[...q.answer].reverse()),false);}
 if(q.type==='collect'){assert.ok(q.answer.length<q.options.length);assert.ok(q.answer.every(x=>q.options.includes(x)));assert.ok(rules.check(q,[...q.answer].reverse()));assert.equal(rules.check(q,q.options),false);assert.equal(rules.check(q,q.answer.slice(1)),false);}
 if(q.type==='sort'){assert.ok(q.groups.length>=2);assert.ok(q.cards.every(c=>q.groups.includes(c[1])));assert.equal(new Set(q.cards.map(c=>c[0])).size,q.cards.length);}
 if(q.type==='memory'){assert.ok(q.pairs.length>=3);assert.equal(new Set(q.pairs.flat()).size,q.pairs.length*2);}
 if(q.type==='route'){assert.ok(q.answer.every(n=>Number.isInteger(n)&&n>=0&&n<3));assert.ok(rules.check(q,q.answer));assert.equal(rules.check(q,q.start),false);}
 }}
});
test('Sequential unlock and three-star awards preserve earlier progress',()=>{
 const p=[{done:0,total:10},{done:0,total:10},{done:0,total:10}];assert.equal(rules.unlocked(p,0),true);assert.equal(rules.unlocked(p,1),false);p[0].done=10;assert.equal(rules.unlocked(p,1),true);assert.equal(rules.unlocked(p,2),false);p[2].done=1;assert.equal(rules.unlocked(p,2),true);
 assert.equal(rules.stars(9,10,0),0);assert.equal(rules.stars(10,10,0),3);assert.equal(rules.stars(10,10,2),2);assert.equal(rules.stars(10,10,5),1);
});
test('All spoken prompts and cards have real local recordings',()=>{
 const w={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'audio-map.js'),'utf8'),w);
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'audio-manifest.json'),'utf8'));
 for(const a of manifest){const p=w.window.ADVENTURE_AUDIO[a.key];assert.ok(p,'Missing recording '+a.key);for(const clip of Array.isArray(p)?p:[p])assert.ok(fs.statSync(path.resolve(root,'tu-luyen-2',clip)).size>1000);}
 for(const g of games){const x={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,`tu-luyen-${g.n}/quiz-data.js`),'utf8'),x);for(const q of x.window.ADVENTURE.items)for(const text of [q.scene,q.prompt].filter(Boolean))assert.ok(w.window.ADVENTURE_AUDIO[text],q.id+': '+text);}
});
test('Every HTML entry point resolves its scripts, stylesheet and local fonts',()=>{
 for(const folder of [...games.map(g=>`tu-luyen-${g.n}`),'hanh-trinh']){const dir=path.join(root,folder),html=fs.readFileSync(path.join(dir,'index.html'),'utf8');assert.ok(html.includes('charset="utf-8"'));for(const m of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|png)(?:\?[^\"]*)?)"/g)){assert.ok(fs.existsSync(path.resolve(dir,m[1].split('?')[0])),folder+': '+m[1]);}}
});
test('Cumulative checkpoints cover every claimed week and retain valid source mapping',()=>{
 for(const [n,end]of [[13,4],[14,8],[15,12]]){const g=games.find(g=>g.n===n);for(let week=1;week<=end;week++)assert.ok(g.items.some(q=>q.sourceWeek===week),`Game ${n} misses week ${week}`);assert.ok(new Set(g.items.map(q=>q.type)).size>=(n===13?6:8));}
});
