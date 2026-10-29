const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const Input=require('./practice-input.js'),rules=require('./rules.js');
test('Whole-word spelling uses original keys only after a complete correct input',()=>{
 const q={id:'stable',inputMode:'typing',answer:'ni',letterGap:{word:'pencil',positions:[2,4],mask:'pe_c_l'}};
 assert(rules.check(q,Input.response(q,'Pencil')));assert(!rules.check(q,Input.response(q,'ni')));assert(!rules.check(q,Input.response(q,'pencel')));
 assert.equal(Input.response(q,'pencil'),'ni');assert.equal(Input.display(q,'ni'),'pencil');assert.equal(q.answer,'ni');
 assert.equal(Input.readyForAuto(q,'pen'),false);assert.equal(Input.readyForAuto(q,'pencil'),true);
});
test('Presentation preparation keeps source answer keys and makes blend letters interactive',()=>{
 const g={items:[{id:'b',prompt:'Blend the letters. Choose the word.',scene:'a · p · p · l · e',answer:'apple'},{id:'n',prompt:'Write the number in words.',answer:'three'}]};
 Input.prepare(g,'family-friends-1');assert.deepEqual(g.items[0].blendLetters,['a','p','p','l','e']);assert.equal(g.items[0].scene,'');assert.equal(g.items[0].answer,'apple');assert.equal(g.items[1].partTitle,'Write the number word');
});
test('Listening writing hides scripts but pictured spelling and dictation are distinct',()=>{
 assert(Input.audioOnly({partType:'listenWrite',storyText:'Secret'}));assert(!Input.audioOnly({partType:'lookWrite',picturePrompt:{},letterGap:{word:'apple'}}));assert(!Input.audioOnly({dictation:{},partType:'listenWrite'}));
});
test('Latin handwriting has 26 uppercase/lowercase guides and downward stems',()=>{
 const s=require('../../khoa-hoc/program/letter-strokes.cjs');for(const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){const letters=s.letters(c);assert.equal(letters.length,2);assert(letters.every(l=>l.strokes.length&&l.strokes.every(p=>p.startsWith('M'))));}assert.equal(s.upper.B[0],'M45 35V185');assert.equal(s.lower.n[0],'M45 90V185');
});
test('Passage question order follows explicit source evidence without crossing Parts',()=>{
 const storyText='Emma has a green bag. Tom has a blue pen.',base={storyText,storyId:'story',partType:'readChoose'};
 const later={...base,id:'later',evidence:'Tom has a blue pen.'},first={...base,id:'first',evidence:'Emma has a green bag.'},other={...base,id:'other',partType:'listenWrite',evidence:'Emma has a green bag.'};
 assert.deepEqual(Input.readingOrder([later,first,other]).map(q=>q.id),['first','later','other']);
});
test('Sound groups show three standalone pictures and no group answer labels',()=>{
 const context={window:{PhonicsActivities:{picture:p=>'<img src="'+p.src+'">'}},ActivityLayout:{shuffle:a=>a}};vm.runInNewContext(fs.readFileSync(__dirname+'/resource-activities.js','utf8'),context);
 const p=w=>({word:w,picture:{src:w+'.webp'}}),q={resourceTask:{kind:'soundGroups',groups:[['bear','bird','bed'].map(p),['cat','bird','car'].map(p)],correctGroup:0,rule:'Which word begins with letter B?'}};
 const html=context.window.ResourceActivities.render(q,[],{});assert.equal((html.match(/data-sound-picture=/g)||[]).length,3);assert(!html.includes('data-resource-group'));assert(!html.includes('Nhóm'));assert(html.includes('begin with letter B'));
});
test('All FF practice and reviews have distinct presented tasks, stable IDs and canonical keys',()=>{
 for(const n of [1,2])for(const l of require('../../khoa-hoc/data/family-friends-'+n+'.json').lessons){if(l.kind==='progress-test')continue;const before=l.items.map(q=>[q.id,q.answer]),g=Input.prepare({items:structuredClone(l.items)},'family-friends-'+n),seen=new Set();assert.deepEqual(g.items.map(q=>[q.id,q.answer]).sort(),before.sort());for(const q of g.items){const signature=JSON.stringify([q.scene,q.prompt,q.answer,q.spokenScene,q.letterGap?.word,q.picturePrompt?.semantic,q.visual,q.resourceTask,q.inputMode,q.partType]);assert(!seen.has(signature),q.id);seen.add(signature);}}
});
