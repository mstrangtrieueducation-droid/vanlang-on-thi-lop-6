/* Discover migration: new IDs never inherit a previous question's credit. */
const fs=require('node:fs'),path=require('node:path');
const build=require('./discover.cjs'),{plan,assertReady}=require('./program/discover-plan.cjs'),C=require('../discover-exam/core.js'),links=require('./program/discover-session-links.json');
const teachingMap={};
function release(courses){
 build(courses);
 for(let n=1;n<=4;n++){
  const id='discover-'+n,c=courses[id],p=plan(n),lessons=[];teachingMap[id]={};
  const sessionEvidence=session=>({courseId:id,session,title:p.sessions.find(s=>s.session===session).title,urls:links[id][session]||[]});
  for(const s of p.sessions){
   if(s.kind==='oral')continue;
   let l=c.lessons.find(l=>l.id===s.id);
   if(s.kind==='progress-test'){
    const testId=id+'-test-'+s.testNumber,test=require('../discover-exam/data/'+testId+'.json');C.validate(test);
    const review=JSON.parse(fs.readFileSync(path.join(__dirname,'../discover-exam/verification.json')));
    const verified=review.tests.find(t=>t.id===testId);if(!verified?.ready)throw Error(testId+': original test validation incomplete');
    l={...s,testId,exam:true,originalFormatVerified:true,originalPointsVerified:true,visuals3DVerified:true,sourceAudioVerified:true,href:'../discover-exam/?test='+s.testNumber,items:C.items(test,s.id),timeLimitSeconds:1800};
   }
   if(!l)throw Error('Missing '+id+'/'+s.id);lessons.push(l);
   teachingMap[id][l.id]={sourceGroups:[],programGroups:[sessionEvidence(s.session)]};
   const r=c.lessons.find(l=>l.kind==='unit-review'&&l.afterSession===s.session);
   if(r){lessons.push(r);teachingMap[id][r.id]={sourceGroups:[],programGroups:r.sourceLessons.map(l=>sessionEvidence(Number(l.slice(7))))};}
  }
  assertReady(p,lessons);c.lessons=lessons;c.curriculumVersion='discover-program-3';c.scope='Program · 62 tiết × 30 câu · 18 Unit Review × 45 câu · 9 Progress Test giữ dạng bài và audio gốc.';
 }
 return courses;
}
module.exports=release;module.exports.teachingMap=teachingMap;
