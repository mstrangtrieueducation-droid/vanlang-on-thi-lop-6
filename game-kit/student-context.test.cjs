const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('./student-context'),P=require('./classroom-progress'),G=require('../vu-tru/galaxy-core'),catalog=require('../vu-tru/catalog.json'),mapping=require('../vu-tru/teaching-map.json');
const student='A'.repeat(22),other='B'.repeat(22),memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};};
test('URL context wins, limits and names stay with the right student/course, zero is a real limit',()=>{
 const s=memory();C.store(s,{student,course:'phonics-1',limit:3,name:'Luna',limits:{'discover-1':2}});
 assert.equal(C.resolve('?course=discover-1',s).limit,2);assert.equal(C.resolve('?course=fighter',s).limit,0);
 assert.equal(C.resolve(`?student=${student}&course=phonics-1&limit=0`,s).limit,0);
 assert.equal(C.resolve(`?student=${other}&course=phonics-1`,s).name,'');
 assert.equal(C.resolve(`?student=${other}&course=phonics-1`,s).limit,0);
 assert.equal(C.resolve('?student=bad&course=phonics-1',s).invalid,true);
 assert.equal(C.resolve(`?student=${student}&course=phonics-1&limit=NaN`,s).limit,0);
});
test('Student and course progress never mix, and old anonymous/name saves are untouched',()=>{
 const s=memory();G.save(s,'phonics-1',null,{stardust:99,lessons:{}});G.save(s,'phonics-1',{student},{stardust:12,lessons:{one:{stars:2}}});
 assert.equal(G.load(s,'phonics-1',{student:other}).stardust,0);assert.equal(G.load(s,'phonics-2',{student}).stardust,0);assert.equal(G.load(s,'phonics-1',null).stardust,99);
 assert.equal(C.progressKey('phonics-1',student),G.key('phonics-1',{student}));assert.equal(C.suffix({student,name:'New name'}),':student:'+student);
});
test('Every course gates its full dynamic lesson list, requires stars, and clamps boss focus',()=>{
 for(const c of catalog){const ctx={student,course:c.id,limit:Math.min(3,c.lessons.length),focus:4,limits:{[c.id]:3}},p={lessons:{}};
  assert.equal(C.status(c,1,p,ctx).open,true);assert.equal(C.status(c,2,p,ctx).open,false);p.lessons[c.lessons[0].id]={done:999,stars:0};assert.equal(C.status(c,2,p,ctx).open,false);
  p.lessons[c.lessons[0].id].stars=1;assert.equal(C.status(c,2,p,ctx).open,true);assert.equal(C.status(c,ctx.limit+1,p,ctx).open,false);
  assert.equal(C.focus(c,ctx),ctx.limit-1);assert.equal(C.status(c,1,p,{invalid:true}).open,false);
 }
});
test('Dashboard boss link keeps X+1, while portal selects the last open planet',()=>{
 const c=catalog[0],p={stardust:20,lessons:Object.fromEntries(c.lessons.slice(0,2).map(l=>[l.id,{stars:1}]))},summary=C.summary(c,p,2);
 assert.equal(summary.completed,2);assert.match(P.cta(summary),/Hành tinh số 2/);
 const url=P.link('https://example.test',c.id,2,summary.completed,student);assert.equal(url.searchParams.get('focus'),'3');assert.equal(url.searchParams.get('limit'),'2');
 const ctx=C.resolve(url.search,memory());assert.equal(C.focus(c,ctx),1);assert.equal(C.dashboard(ctx,url.href).href,`https://example.test/rge9fi0s/#p=${student}`);
 url.searchParams.set('release','keep');C.decorate(url,ctx,c.id,2);assert.equal(url.searchParams.get('release'),'keep');
});
test('Classroom limits use source groups, not elapsed class counts; Phonics tests do not unlock games',()=>{
 const c=catalog.find(c=>c.id==='phonics-1'),groups=mapping[c.id][c.lessons[0].id].sourceGroups;
 assert.equal(P.limits(catalog,mapping,[{program:'Phonics 1',url:groups[0][0]}]).limits[c.id],0);
 const finished=groups.map(g=>({program:'Phonics 1',tasks:[{url:g[0]+'?mtt_name=example'}]}));assert.equal(P.limits(catalog,mapping,finished).limits[c.id],1);
 assert.equal(P.limits(catalog,mapping,[{program:'Phonics 1',sessionNumber:100,topic:'Kiểm tra phỏng vấn'}]).limits[c.id],0);
 assert.equal(P.limits(catalog,mapping,finished,{'phonics-1':0}).limits[c.id],0);
 assert.equal(P.limits(catalog,mapping,[],{'phonics-1':999}).limits[c.id],c.lessons.length);
 assert.equal(P.limits(catalog,mapping,finished).limits['phonics-2'],0);
});
test('All 231 classroom games have public, query-free source mappings; original data unchanged',()=>{
 for(const c of catalog.filter(c=>c.id!=='van-lang'))for(const l of c.lessons){const m=mapping[c.id][l.id];assert.ok(m?.sourceGroups.length,l.id);for(const group of m.sourceGroups)for(const source of group){const u=new URL(source);assert.equal(u.origin,'https://mstrangtrieueducation-droid.github.io');assert.equal(u.search,'');assert.equal(u.hash,'');}}
});
test('Storage denial does not crash context bootstrap or bypass a lock',()=>{
 const window={location:{search:`?course=phonics-1&student=${student}&limit=1`}};Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}});
 vm.runInNewContext(fs.readFileSync(require.resolve('./student-context'),'utf8'),{window,URLSearchParams});assert.equal(window.StudentContext.active.limit,1);
 assert.equal(C.status(catalog[0],2,{},window.StudentContext.active).open,false);
});
test('Deep lesson guard allows only an eligible lesson before starting the engine',async()=>{
 for(const [lesson,allow]of [['game-1',true],['game-2',false]]){const c=catalog.find(c=>c.id==='phonics-1'),s=memory(),context=C.normalize({student,course:c.id,limit:1}),host={innerHTML:''};const window={StudentContext:{...C,active:context},GAME_CONFIG:{courseId:c.id,lessonId:lesson},GameProfile:{student}};
  vm.runInNewContext(fs.readFileSync(require.resolve('./student-gate'),'utf8'),{window,GalaxyCore:G,localStorage:s,document:{querySelector:()=>host},location:{href:'https://example.test/khoa-hoc/',search:'?release=qa'},URL,URLSearchParams,fetch:async()=>({ok:true,json:async()=>catalog})});
  assert.equal(await window.StudentGate.enter(),allow);if(!allow){assert.match(host.innerHTML,/lớp mình chưa học tới/);assert.match(host.innerHTML,/release=qa/);}
 }
});
