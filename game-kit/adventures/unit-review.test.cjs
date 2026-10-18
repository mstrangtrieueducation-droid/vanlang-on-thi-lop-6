const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const packs=require('../../khoa-hoc/build-grammar.cjs').packs(),R=require('./reading-passage.js'),D=require('./dialogue.js'),Rules=require('./rules.js');
const courses=['family-friends-1','family-friends-2','discover-1','discover-2','discover-3','discover-4'];
test('Every FF/Discover Unit Review has exactly 20 source-linked grammar tasks and a summary; original 45 stay intact',()=>{
 assert.equal(packs.length,102);const ids=new Set();
 for(const c of courses){const data=require('../../khoa-hoc/data/'+c+'.json');const reviews=data.lessons.filter(l=>l.kind==='unit-review');assert.equal(packs.filter(p=>p.course===c).length,reviews.length);
  for(const l of reviews){const pack=packs.find(p=>p.course===c&&p.unit===l.unit);assert.equal(l.items.length,45);assert.equal(pack.items.length,20);assert.ok(pack.summary.length>=2);assert.ok(pack.summary.every(r=>r.note&&r.example));
   assert.deepEqual(require('../../khoa-hoc/grammar/'+c+'/unit-'+l.unit+'.json'),pack);
   assert.ok(new Set(pack.items.map(q=>q.partType)).size>=3);
   for(const q of pack.items){assert.ok(!ids.has(q.id));ids.add(q.id);assert.equal(q.source.url,pack.source.url);assert.ok(q.why.length>20);assert.ok(Rules.check(q,q.answer));assert.ok(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length,q.id);assert.ok(!l.items.some(x=>x.id===q.id));}
  }
 }
});
test('All FF/Discover source passages have exactly one reference rendering; gaps and speaker labels survive',()=>{
 let count=0,gaps=0;for(const c of courses){const d=require('../../khoa-hoc/data/'+c+'.json');for(const l of d.lessons)for(const q of l.items||[]){if(!q.storyText)continue;const original=JSON.stringify(q),view=R.question(q);assert.ok(R.render(q,D).includes('shared-passage'));
  if(R.repeated(q,q.scene)){assert.equal(view.scene,'');count++;}else if(/___/.test(q.scene||'')){assert.equal(view.scene,q.scene);gaps++;}
  assert.equal(JSON.stringify(q),original);if(view.dialogue)assert.ok(!R.repeated(q,D.transcript(view.dialogue)));
 }}assert.ok(count>500);assert.ok(gaps>200);
 const q={storyText:'Tim: Hello!\nRosy: Hi, Tim!',scene:'Tim: Hello!\nRosy: Hi, Tim!',dialogue:[{speaker:'Tim',text:'Hello!'},{speaker:'Rosy',text:'Hi, Tim!'}]};assert.equal(R.question(q).scene,'');assert.equal(R.question(q).dialogue,undefined);assert.match(R.render(q,D),/Tim:/);assert.match(R.render(q,D),/Rosy:/);
});
test('Grammar practice cannot overwrite parent Unit Review progress, stars or rewards',()=>{
 const config={courseId:'discover-1',lessonId:'unit-1-checkpoint',supplementalGrammar:true};let writes=0;const sandbox={window:{GAME_CONFIG:config,GameProfile:{},GalaxyCore:{load:()=>({lessons:{},theme:'tech'}),themes:[],save:()=>writes++,reward:()=>writes++},CourseWorld:{kind:()=>''}},localStorage:{},location:{search:''},URLSearchParams,document:{createElement:()=>({}),body:{append(){}},head:{append(){}},documentElement:{dataset:{},style:{setProperty(){}}}}};sandbox.window.window=sandbox.window;vm.runInNewContext(fs.readFileSync(require.resolve('../../vu-tru/lesson-bridge.js'),'utf8'),sandbox);
 assert.equal(sandbox.window.GalaxyBridge.record({done:['grammar']},{},true),true);assert.equal(sandbox.window.GalaxyBridge.reward('grammar'),false);assert.equal(writes,0);
 const engine=fs.readFileSync(require.resolve('./engine.js'),'utf8');assert.match(engine,/run.practice=reviewMode\|\|!!window.ADVENTURE/);assert.ok(engine.indexOf('StudentGate.enter()')<engine.indexOf('UnitReviewMenu.prepare()'));
});
