/* Program-derived conversion contract. This is NOT a published question bank.
 * A new course cannot replace live progress until its content passes assertReady.
 */
const source=require('./discover-source.json');
function plan(level){
 if(![1,2,3,4].includes(level))throw Error('Unknown Discover book');
 const sheet=level<3?'DISCOVER 1, 2':'DISCOVER 3,4',rows=source.sheets[sheet].values;
 const sessions=[],reviews=[],issues=[];
 for(const [index,row] of rows.entries()){
  if(!/^\d+\.?$/.test(String(row[0])))continue;
  const session=parseInt(row[0],10),rawTitle=String(row[1]),title=rawTitle.trim().replace(/\s+/g,' ');
  const test=title.match(/WRITTEN TEST\s+(\d+)\s*:/i),oral=/^INTERVIEW\b/i.test(title),kind=oral?'oral':test?'progress-test':'practice';
  const units=[...title.matchAll(/UNIT\s+(\d+)(?:\s*\+\s*(\d+))?/gi)].flatMap(m=>m.slice(1).filter(Boolean).map(Number));
  sessions.push({id:'lesson-'+session,session,kind,title,rawTitle,units:[...new Set(units)],sourceRow:index+1,sourceSheet:sheet,questionCount:kind==='practice'?30:null,...(test?{testNumber:+test[1],maxListeningPlays:2,writingSeconds:1800}:{}),...(oral?{teacherAssessed:true,secondsPerStudent:300}:{}),notes:String(row[3]||'')});
  if(kind==='practice'&&/WORD\s+STUDY|WRITING STUDY/i.test(title)){
   const unit=units[0];if(!unit)throw Error('Missing review boundary at session '+session);
   reviews.push({id:`unit-${unit}-checkpoint`,kind:'unit-review',unit,title:`Unit ${unit} - Unit Review`,afterSession:session,sourceLessons:sessions.filter(s=>s.kind==='practice'&&s.units.includes(unit)).map(s=>s.id),questionCount:45,requiredCoverage:['vocabulary','grammar','reading']});
  }
  if(level>=3&&session===22)issues.push({session,field:'title',sourceValue:rawTitle,issue:'The Program says UNIT 3+4 WRAP-UP inside Unit 6. Keep the source title; coverage is Unit 6. Do not silently change the Program.'});
 }
 if(sessions.length!==73||sessions.some((s,i)=>s.session!==i+1))throw Error('Program session sequence changed');
 if(reviews.length!==18||reviews.some((r,i)=>r.unit!==i+1))throw Error('Unit review sequence changed');
 const tests=sessions.filter(s=>s.kind==='progress-test');if(tests.length!==9||tests.some((s,i)=>s.testNumber!==i+1))throw Error('Written test schedule changed');
 return {courseId:'discover-'+level,source:{spreadsheetId:source.spreadsheetId,fetchedAt:source.fetchedAt,sheet},status:'conversion-in-progress',sessions,reviews,issues};
}
function assertReady(p,lessons){
 const byId=new Map(lessons.map(l=>[l.id,l])),errors=[];
 for(const expected of [...p.sessions.filter(s=>s.kind!=='oral'),...p.reviews]){
  const l=byId.get(expected.id);
  if(!l){errors.push(`${expected.id}: missing`);continue;}
  if(l.title!==expected.title)errors.push(`${l.id}: Program title mismatch`);
  if(expected.questionCount&&l.items?.length!==expected.questionCount)errors.push(`${l.id}: expected ${expected.questionCount} questions`);
  if(expected.kind==='unit-review')for(const skill of expected.requiredCoverage)if(!l.items?.some(q=>q.skill===skill))errors.push(`${l.id}: missing ${skill}`);
  if(expected.kind==='progress-test'&&(!l.originalFormatVerified||!l.originalPointsVerified||!l.visuals3DVerified||!l.sourceAudioVerified))errors.push(`${l.id}: source-format/audio/art/score review incomplete`);
  for(const q of l.items||[]){
   if(!q.source?.url)errors.push(`${q.id}: missing source`);
   if(q.dialogue?.some(t=>!t.speaker&&!t.role))errors.push(`${q.id}: unnamed speaker`);
   if(q.sourceImage||/scan|extracted\/page/i.test(JSON.stringify(q.picturePrompt||{})))errors.push(`${q.id}: raw source scan`);
  }
 }
 if(errors.length)throw Error(errors.join('\n'));
 return true;
}
module.exports={plan,assertReady};
