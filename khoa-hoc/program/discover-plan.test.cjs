const{test}=require('node:test'),assert=require('node:assert/strict'),{plan,assertReady}=require('./discover-plan.cjs');
test('All Discover books map 73 original sessions, 18 Unit reviews and 9 source tests',()=>{
 for(let n=1;n<=4;n++){const p=plan(n);assert.equal(p.sessions.filter(s=>s.kind==='practice').length,62);assert.equal(p.sessions.filter(s=>s.kind==='oral').length,2);assert.deepEqual(p.reviews.map(r=>r.unit),Array.from({length:18},(_,i)=>i+1));assert.deepEqual(p.sessions.filter(s=>s.kind==='progress-test').map(s=>s.session),[7,15,23,31,39,48,56,64,72]);for(const r of p.reviews)assert.ok(r.sourceLessons.length>=3);assert.ok(p.sessions.filter(s=>s.kind==='practice').every(s=>s.questionCount===30));assert.ok(p.reviews.every(s=>s.questionCount===45));}
});
test('Test-return lessons stay lessons; oral interviews are never invented automatic tests',()=>{
 const p=plan(3);assert.equal(p.sessions[7].kind,'practice');assert.equal(p.sessions[39].teacherAssessed,true);assert.equal(p.sessions[72].questionCount,null);assert.equal(p.issues[0].session,22);assert.equal(p.reviews[5].afterSession,22);
});
test('Incomplete content cannot be mistaken for a completed migration',()=>{
 assert.throws(()=>assertReady(plan(1),[]),/lesson-1: missing/);
 assert.throws(()=>assertReady(plan(1),[{id:'lesson-1',title:'invented title',items:[]}]),/Program title mismatch/);
});
