const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('./student-context'),P=require('./classroom-progress'),G=require('../vu-tru/galaxy-core'),catalog=require('../vu-tru/catalog.json'),mapping=require('../vu-tru/teaching-map.json');
const student='A'.repeat(22),other='B'.repeat(22),memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
const context=(course=catalog[1],ids=course.lessons.slice(0,3).map(l=>l.id),extra={})=>({...C.normalize({schema:3,books:{[course.id]:[...new Set(course.lessons.filter(l=>ids.includes(l.id)).map(l=>l.track).filter(Boolean))]},student,course:course.id,className:'KIDS 21',parentRoute:'/rge9fi0s/',name:'Luna',issuedAt:Date.now(),limits:{[course.id]:Math.max(0,...ids.map(id=>course.lessons.findIndex(l=>l.id===id)+1))},allowed:{[course.id]:ids},...extra}),entered:true});
test('Only dashboard-issued context grants access; URL limits, student and class cannot expand it',()=>{
 const s=memory(),session=memory(),c=catalog[1],ctx=context(c);C.store(s,ctx);const entry=new URL('https://example.test/?student='+student+'&course='+c.id);assert.ok(C.handoff(s,ctx,entry));const admitted=C.resolve(entry.search,s,session),visit=admitted.visit;
 assert.equal(C.resolve(`?student=${student}&course=${c.id}&limit=999&focus=999&visit=${visit}`,s,session).limit,3);
 assert.equal(C.resolve('?course=fighter&visit='+visit,s,session).limit,0);
 for(const query of [`?student=${other}&course=${c.id}&limit=99`,`?student=${student}&mtt_class=KIDS8`,`?student=${student}&mtt_name=Other`,`?student=bad`,`?student=${student}&student=${other}`])assert.equal(C.resolve(query,s).invalid,true);
 assert.equal(C.resolve('?limit=999',memory()),null);
 const old={student,course:c.id,limit:99,limits:{[c.id]:99}};s.setItem(C.ACTIVE,JSON.stringify(old));s.setItem('vl_student_context_'+student,JSON.stringify(old));assert.equal(C.resolve('?student='+student,s).invalid,true);
});
test('All 43 class return routes are exact, and contexts expire without silently extending their grants',()=>{
 assert.equal(Object.keys(C.ROUTES).length,43);
 for(const [className,parentRoute]of Object.entries(C.ROUTES)){const ctx=context(undefined,undefined,{className,parentRoute});assert.equal(C.dashboard(ctx,'https://example.test/').pathname,parentRoute);assert.equal(C.dashboard(ctx,'https://example.test/').hash,'#p='+student);assert.equal(C.normalize({...ctx,parentRoute:'/rge9fi0s/evil/'}),null);}
 const s=memory(),ctx=context(undefined,undefined,{issuedAt:Date.now()-C.MAX_AGE-1});s.setItem(C.ACTIVE,JSON.stringify(ctx));assert.equal(C.resolve('',s).invalid,true);assert.equal(C.store(s,ctx),false);
});
test('Student/course namespaces and earlier anonymous saves remain independent',()=>{
 const s=memory();G.save(s,'phonics-1',null,{stardust:99,lessons:{}});G.save(s,'phonics-1',{student},{stardust:12,lessons:{one:{stars:2}}});
 assert.equal(G.load(s,'phonics-1',{student:other}).stardust,0);assert.equal(G.load(s,'phonics-2',{student}).stardust,0);assert.equal(G.load(s,'phonics-1',null).stardust,99);assert.equal(C.progressKey('phonics-1',student),G.key('phonics-1',{student}));
});
test('All 12 courses enforce taught IDs and minimum one star, with no anonymous bypass',()=>{
 for(const c of catalog){const ctx=context(c),p={lessons:{}};assert.equal(C.status(c,1,p,ctx).open,true);assert.equal(C.status(c,2,p,ctx).open,false);p.lessons[c.lessons[0].id]={done:999,stars:0};assert.equal(C.status(c,2,p,ctx).open,false);p.lessons[c.lessons[0].id].stars=1;assert.equal(C.status(c,2,p,ctx).open,true);assert.equal(C.status(c,4,p,ctx).open,false);assert.equal(C.focus(c,{...ctx,focus:999}),2);assert.equal(C.status(c,1,p,null).open,false);}
});
test('Fighter books are independently gated; later taught games never imply earlier untaught books',()=>{
 const c=catalog.find(c=>c.id==='fighter'),reading=c.lessons.filter(l=>l.track==='Reading 2').slice(0,2),vocab=c.lessons.find(l=>l.track==='Vocabulary 1'),ctx=context(c,reading.map(l=>l.id)),p={lessons:{}};
 assert.equal(C.status(c,c.lessons.indexOf(reading[0])+1,p,ctx).open,true);assert.equal(C.status(c,c.lessons.indexOf(reading[1])+1,p,ctx).open,false);assert.equal(C.status(c,c.lessons.indexOf(vocab)+1,p,ctx).open,false);
 p.lessons[reading[0].id]={stars:1};assert.equal(C.summary(c,p,ctx).next,c.lessons.indexOf(reading[1])+1);assert.equal(C.summary(c,p,ctx).limit,2);
});
test('Source evidence needs every lesson group; manual ceilings cannot grant untaught lessons',()=>{
 for(const c of catalog){for(const l of c.lessons){const groups=mapping[c.id]?.[l.id]?.sourceGroups;assert.ok(groups?.length,l.id);for(const group of groups)for(const src of group){const u=new URL(src);assert.equal(u.search,'');assert.equal(u.hash,'');}
 const rows=groups.map(g=>({url:g[0]})),r=P.limits([c],mapping,rows);assert.ok(r.allowed[c.id].includes(l.id),l.id);
 }}
 const c=catalog.find(c=>c.id==='phonics-1'),groups=mapping[c.id][c.lessons[0].id].sourceGroups;
 assert.equal(P.limits([c],mapping,[{url:groups[0][0]}]).allowed[c.id].length,2);
 assert.equal(P.limits([c],mapping,[],{[c.id]:999}).limits[c.id],0);
 const rows=groups.map(g=>({url:g[0]}));assert.equal(P.limits([c],mapping,rows,{[c.id]:0}).limits[c.id],0);
});
test('Completed class evidence excludes future, cancelled and self-study, using Bangkok end time',()=>{
 const now=Date.parse('2026-10-17T13:00:00+07:00'),row={id:'a',session:'Buổi 2',lessonDate:'17/10/2026',lessonTime:'12:00–13:00',url:'https://example.test/'};
 assert.equal(P.completedAssignments({assignments:[row]},now-1).length,0);assert.equal(P.completedAssignments({assignments:[row]},now).length,1);
 for(const a of [{...row,lessonDate:'18/10/2026'},{...row,isSelfStudy:true},{...row,cancelled:true},{...row,lessonTime:''},{...row,lessonDate:'31/02/2026'}])assert.equal(P.completedAssignments({assignments:[a]},now).length,0);
 assert.equal(P.completedAssignments({assignments:[row],cancelledLessonEvents:[{date:'17/10/2026'}]},now).length,0);
 assert.equal(P.completedAssignments({assignments:[{...row,lessonTime:''}],lessonEvents:[{date:'17/10/2026',session:'Buổi 2',endTime:'13:00'}]},now).length,1);
});
test('TA does not unlock week one from the read-ahead task; class explanation unlocks it',()=>{
 const c=catalog[0],readAhead='https://mstrangtrieueducation-droid.github.io/vocabulary-reading-web/40e5f655f423d1faebb37947ab1f9806/';
 assert.equal(P.limits([c],mapping,[{url:readAhead}]).limits[c.id],0);
 const first=mapping[c.id]['tu-luyen-1'].sourceGroups[0][0];assert.deepEqual(P.limits([c],mapping,[{url:first}]).allowed[c.id],['tu-luyen-1']);
});
test('Boss action targets the last taught planet; query release and correct dashboard survive navigation',()=>{
 const c=catalog[1],ctx=context(c,c.lessons.slice(0,2).map(l=>l.id)),p={lessons:Object.fromEntries(c.lessons.slice(0,2).map(l=>[l.id,{stars:1}]))},sum=C.summary(c,p,ctx);
 assert.equal(sum.completed,2);assert.match(P.cta(sum),/Hành tinh số 2/);const url=P.link('https://example.test',c.id,2,sum.completed,student);url.searchParams.set('release','keep');C.decorate(url,ctx,c.id,sum.next);assert.equal(url.searchParams.get('focus'),'2');assert.equal(url.searchParams.get('release'),'keep');
});
test('Storage failure and deep links fail closed before gameplay',async()=>{
 const w={location:{search:`?student=${student}&course=phonics-1&limit=999`}};Object.defineProperty(w,'localStorage',{get(){throw Error('blocked');}});vm.runInNewContext(fs.readFileSync(require.resolve('./student-context'),'utf8'),{window:w,URLSearchParams});assert.equal(w.StudentContext.active.invalid,true);
 for(const [lesson,hasContext,allow]of [['sound-a',true,true],['sound-b',true,false],['sound-a',false,false]]){const c=catalog.find(c=>c.id==='phonics-1'),ctx=hasContext?context(c,['sound-a']):null,host={innerHTML:''},window={StudentContext:{...C,active:ctx},GAME_CONFIG:{courseId:c.id,lessonId:lesson},GameProfile:{student}};
 vm.runInNewContext(fs.readFileSync(require.resolve('./student-gate'),'utf8'),{window,GalaxyCore:G,localStorage:memory(),document:{querySelector:()=>host},location:{href:'https://example.test/khoa-hoc/',search:'?release=qa'},URL,URLSearchParams,fetch:async()=>({ok:true,json:async()=>catalog})});assert.equal(await window.StudentGate.enter(),allow);if(!allow)assert.match(host.innerHTML,/release=qa/);
 }
});
test('Direct or copied links cannot start a visit even with cached progress; handoffs are single-use and tab-local',()=>{
 const s=memory(),session=memory(),ctx=context(),u=new URL('https://example.test/?student='+student+'&course='+ctx.course);C.store(s,ctx);
 assert.equal(C.resolve(u.search,s,session).invalid,true);assert.ok(C.handoff(s,ctx,u));
 const entered=C.resolve(u.search,s,session);assert.equal(entered.entered,true);
 assert.equal(C.resolve(u.search,s,memory()).invalid,true);
 const navigation=new URL('https://example.test/?release=kept');C.decorate(navigation,entered,ctx.course,2);
 assert.equal(C.resolve(navigation.search,s,session).entered,true);assert.equal(C.resolve(navigation.search,s,memory()).invalid,true);
 assert.equal(C.resolve('?student='+student+'&course='+ctx.course,s,session).invalid,true);
});

const taughtRows=(course,id,date,program=course.name)=>mapping[course.id][id].sourceGroups.map(g=>({program,lessonDate:date,endTime:'20:00',url:g[0]}));
test('Current book follows classroom dates in either order; old course progress is retained but cannot grant access',()=>{
 const old=catalog.find(c=>c.id==='phonics-4'),now=catalog.find(c=>c.id==='family-friends-1'),rows=[...taughtRows(old,old.lessons[0].id,'01/10/2026'),...taughtRows(now,'game-1','10/10/2026','Family & Friends 1')];
 for(const input of [rows,[...rows].reverse()]){const fresh=P.currentBooks(catalog,mapping,input);assert.deepEqual(fresh.books,{[now.id]:[]});assert.deepEqual(fresh.allowed[now.id],['game-1']);assert.equal(fresh.allowed[old.id],undefined);const ctx=context(now,fresh.allowed[now.id],{books:fresh.books});assert.equal(C.visible(old,ctx).length,0);assert.equal(C.status(old,1,{lessons:{'game-1':{stars:3}}},ctx).open,false);}
});
test('Moving books on the first session never revives a completed old textbook or invents a full two-session game',()=>{
 const old=catalog.find(c=>c.id==='phonics-1'),now=catalog.find(c=>c.id==='discover-2'),rows=[...taughtRows(old,old.lessons[0].id,'01/10/2026'),{program:'Oxford Discover 2',lesson:{dateLabel:'10/10/2026',endTime:'20:00'},assignment:{url:mapping[now.id]['game-1'].sourceGroups[0][0]}}];
 const fresh=P.currentBooks(catalog,mapping,rows);assert.deepEqual(fresh.books,{'discover-2':[]});assert.equal(fresh.allowed[now.id].length,0);
 rows.push({program:'Discover 5',lessonDate:'11/10/2026'});assert.deepEqual(P.currentBooks(catalog,mapping,rows).books,{});
});
test('Fighter selects current Reading and Vocabulary independently, hiding retired and future books',()=>{
 const c=catalog.find(c=>c.id==='fighter'),rows=[...taughtRows(c,'fighter-reading-1-unit-1','01/10/2026','Fighter Reading 1'),...taughtRows(c,'fighter-vocabulary-1-unit-1','02/10/2026','Fighter Vocabulary 1'),...taughtRows(c,'fighter-reading-2-unit-1','10/10/2026','Fighter Reading 2'),...taughtRows(c,'fighter-vocabulary-2-unit-1','11/10/2026','Fighter Vocabulary 2')],fresh=P.currentBooks([c],mapping,rows);
 assert.deepEqual(new Set(fresh.books.fighter),new Set(['Reading 2','Vocabulary 2']));assert.deepEqual(new Set(fresh.allowed.fighter),new Set(['fighter-reading-2-unit-1','fighter-vocabulary-2-unit-1']));
 const ctx=context(c,fresh.allowed.fighter,{books:fresh.books});assert.deepEqual(new Set(C.visible(c,ctx).map(l=>l.track)),new Set(['Reading 2','Vocabulary 2']));
});
test('Missing dates, future sessions and unsupported new books cannot authorize historical fallback',()=>{
 const c=catalog[1],rows=taughtRows(c,c.lessons[0].id,'01/10/2026');assert.deepEqual(P.currentBooks(catalog,mapping,rows.map(r=>({...r,lessonDate:''}))).books,{});
 assert.deepEqual(P.currentBooks(catalog,mapping,taughtRows(c,c.lessons[0].id,'01/01/2099')).books,{});
 assert.deepEqual(P.currentBooks(catalog,mapping,[...rows,{program:'Phonics 5',lessonDate:'12/10/2026'}]).books,{});
 assert.equal(C.normalize({...context(),schema:2}),null);
});
test('Generic subject labels use exact source URLs; named Reading books take priority over old reference links',()=>{
 const c=catalog.find(c=>c.id==='fighter');
 const rows=taughtRows(c,'fighter-reading-2-unit-1','10/10/2026','Reading');
 assert.deepEqual(P.currentBooks([c],mapping,rows).books,{fighter:['Reading 2']});
 const next={program:'Reading Intensive 3',lessonDate:'12/10/2026',url:rows[0].url};
 const fresh=P.currentBooks([c],mapping,[...rows,next]);assert.deepEqual(fresh.books,{fighter:['Reading 3']});assert.deepEqual(fresh.allowed.fighter,[]);
});
test('Full persistent storage still admits the dashboard pupil through a one-use tab handoff and retains progress',()=>{
 const persistent=memory(),session=memory();persistent.setItem('untouched-class-cache','keep');persistent.setItem(C.progressKey('discover-1',student),JSON.stringify({stardust:5,lessons:{}}));const full={getItem:persistent.getItem,removeItem:persistent.removeItem,setItem(){throw Object.assign(Error('full'),{name:'QuotaExceededError'});}};
 let storage=C.createStorage(full,session),c=catalog.find(c=>c.id==='discover-1'),ctx=context(c,c.lessons.slice(10,12).map(l=>l.id)),u=new URL('https://example.test/?student='+student+'&course='+c.id);assert.equal(C.store(storage,ctx),true);assert.equal(storage.temporary,true);assert.ok(C.handoff(storage,ctx,u));
 storage=C.createStorage(full,session);const admitted=C.resolve(u.search,storage,session);assert.equal(admitted.entered,true);assert.equal(C.status(c,11,{},admitted).open,true);assert.equal(C.status(c,13,{},admitted).open,false);
 assert.ok(G.save(storage,c.id,{student},{stardust:15,lessons:{'game-11':{stars:2}}}));assert.equal(G.load(C.createStorage(full,session),c.id,{student}).stardust,15);assert.equal(persistent.getItem('untouched-class-cache'),'keep');
 assert.equal(C.resolve(u.search,C.createStorage(full,memory()),memory()).invalid,true);assert.equal(C.resolve(u.search,storage,session).invalid,true);
});
test('Blocked persistent storage falls back to this tab; both blocked stores never authorize entry',()=>{
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
 const storage=C.createStorage(blocked,memory());assert.ok(C.store(storage,context()));assert.equal(C.store(C.createStorage(blocked,blocked),context()),false);
});
