const test=require('node:test'),assert=require('node:assert/strict'),S=require('./continuous-sheet.js'),P=require('./task-parts.js'),L=require('./learning.js'),C=require('../../khoa-hoc/content.cjs'),F=require('./flow-core.js');
test('FF and Discover sheets include every source item once, keeping source passages separate',()=>{
 for(const id of ['family-friends-1','family-friends-2','discover-1','discover-2','discover-3','discover-4'])for(const l of C[id].lessons){
  const plan=L.plan(l.items),parts=P.sections(plan);assert.deepEqual(parts.flatMap(p=>p.indices).sort((a,b)=>a-b),plan.map((_,i)=>i));
  for(const part of parts)if(S.enabled(id,plan,part,l.exam)){const rows=part.indices.map(i=>plan[i]);assert.ok(new Set(rows.map(q=>P.describe(q).block)).size<=1);assert.ok(rows.every(q=>!q.orderWords&&!q.matchPictures));}
 }
 assert.equal(S.course('fighter'),false);assert.equal(S.course('phonics-1'),false);
});
test('Unfinished typing and empty choices remain drafts, never submitted guesses',()=>{
 const q={id:'q',inputMode:'typing',answer:'cat / dog'},run={answers:{},sheetDrafts:{q:'cat / '}};
 assert.equal(S.ready(q,S.value(q,run,F)),false);assert.equal(S.ready(q,'cat / dog'),true);assert.equal(S.ready({options:['a','b']},''),false);assert.equal(S.ready({options:['a','b']},'a'),true);assert.deepEqual(run.answers,{});
});
test('Existing saved answers survive a sheet transition and all question rows render without a Next-question control',()=>{
 const items=[{id:'a',type:'choice',title:'Q',scene:'I have a ___.',answer:'pen',options:['pen','bag']},{id:'b',type:'choice',title:'Q',scene:'She has a ___.',answer:'bag',options:['bag','pen']}],part={number:1,total:2,count:2,title:'Read & Choose',instruction:'Read and choose.',indices:[0,1]},run={answers:{a:{firstCorrect:false}},responses:{a:{first:'bag',last:'bag'}}};
 assert.equal(S.value(items[0],run,F),'bag');const html=S.render(items,part,run,F,{explanation:()=>''},q=>({options:q.options}),{},null,null,false);assert.equal((html.match(/data-sheet-row=/g)||[]).length,2);assert.match(html,/2 QUESTIONS/);assert.doesNotMatch(html,/id="next"|Câu tiếp/);assert.match(html,/Next Part/);
});
