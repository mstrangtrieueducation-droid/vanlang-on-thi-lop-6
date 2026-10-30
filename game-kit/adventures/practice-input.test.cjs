const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const Input=require('./practice-input.js'),rules=require('./rules.js');
test('Whole-word spelling uses original keys only after a complete correct input',()=>{
 const q={id:'stable',inputMode:'typing',answer:'ni',letterGap:{word:'pencil',positions:[2,4],mask:'pe_c_l'}};
 assert(rules.check(q,Input.response(q,'Pencil')));assert(!rules.check(q,Input.response(q,'ni')));assert(!rules.check(q,Input.response(q,'pencel')));
 assert.equal(Input.response(q,'pencil'),'ni');assert.equal(Input.display(q,'ni'),'pencil');assert.equal(q.answer,'ni');
 assert.equal(Input.readyForAuto(q,'pen'),false);assert.equal(Input.readyForAuto(q,'pencil'),true);
});
test('Spelling result review displays the whole word without rewriting saved first and last responses',()=>{
 const Flow=require('./flow-core.js'),q={id:'stable',answer:'n',letterGap:{word:'ant'},scene:'a_t'},run={answers:{},responses:{}};Flow.response(run,q.id,Input.response(q,'at'));Flow.response(run,q.id,Input.response(q,'ant'));const before=JSON.stringify(run),view=Flow.review(q,run,{skill:()=> 'phonics',explanation:()=> 'Write ant.',reflect:()=> ''});assert.equal(view.first,'at');assert.equal(view.last,'ant');assert.equal(view.correct,'ant');assert.equal(JSON.stringify(run),before);
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
 assert.equal(s.lower.a[0].match(/\d+ \d+$/)[0],'145 105');assert.equal(s.lower.a[1],'M145 105V185');
});
test('Every Family picture task has visible art and Listen and Complete hides the source script',()=>{
 const tasks=require('./task-parts.js');for(const n of [1,2]){const id='family-friends-'+n,course=require('../../khoa-hoc/data/'+id+'.json');let pictured=0,listening=0;for(const q of course.lessons.flatMap(l=>l.items)){
  if(/look at the picture/i.test([q.prompt,q.partInstruction].join(' '))||/letters complete this word/i.test(q.prompt||'')){pictured++;assert(q.picturePrompt||q.pictureOptions||q.matchPictures,q.id+' missing picture');}
  if(/listen and complete/i.test([q.prompt,q.partInstruction,q.partTitle].join(' '))){listening++;assert(tasks.hiddenStory(q,id),q.id+' reveals the listening script');}
 }assert(pictured>300);assert(listening>150);}
});
test('All depth Blend Letters questions retain a matching picture',()=>{
 for(const n of [1,2,3,4])for(const q of require('../../khoa-hoc/data/phonics-'+n+'.json').lessons.flatMap(l=>l.items))if(q.depth30&&/^Blend the letters\./.test(q.prompt||''))assert(q.picturePrompt,q.id);
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
test('Dictation uses the original whole track, never a Titi fallback, and keeps playback when the active blank changes',()=>{
 let player;class Audio{constructor(){player=this;this.paused=true;this.currentTime=0;}pause(){this.paused=true;}load(){}removeAttribute(){this.src='';}play(){this.paused=false;return Promise.resolve();}}
 const ctx={Audio,URL,location:{href:'https://example.test/khoa-hoc/'},document:{addEventListener(){}},addEventListener(){},window:{GAME_CONFIG:{courseId:'discover-1'},TaskParts:{instructionOnly:()=>false},GameMedia:{url:s=>s}}};vm.runInNewContext(fs.readFileSync(__dirname+'/listening-dock.js','utf8'),ctx);
 const q={id:'q1',dictation:true,dictationSentence:'s1',questionAudio:['titi-fallback.mp3'],sourceAudio:['original.mp3']};assert.deepEqual([...ctx.window.ListeningDock.resolve(q).urls],['original.mp3']);ctx.window.ListeningDock.select(q,false);player.currentTime=11;ctx.window.ListeningDock.select({...q,id:'q2',dictationSentence:'s2'},true);assert.equal(player.currentTime,11);assert.equal(player.src,'original.mp3');
});
