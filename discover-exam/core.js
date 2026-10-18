/* The original question groups remain intact; each original mark is graded once. */
(function(root){'use strict';
 const matcher=typeof module!=='undefined'?require('./answer-matcher.js'):root.DiscoverAnswerMatcher;
 function fields(q){
  if(q.type==='pair')return [{key:'question',type:'input',label:'A:',suffix:q.questionSuffix,answers:q.questionAnswers,explanation:q.explanation},{key:'response',type:'input',label:'B:',suffix:q.responseSuffix,answers:q.responseAnswers,explanation:q.explanation}];
  if(q.parts)return q.parts;
  return [{key:'answer',type:q.type,options:q.options,answers:q.answers,explanation:q.explanation,label:''}];
 }
 const key=(q,f)=>q.id+'--'+f.key;
 function gradeQuestion(q,answers){const parts=fields(q).map(f=>({...f,value:String(answers[key(q,f)]??''),correct:matcher.matches(answers[key(q,f)],f.answers)}));return matcher.gradeRelations(q,parts);}
 const combined=q=>(q.points||1)===1&&fields(q).length>1;
 function grade(test,answers){const rows=test.sections.flatMap(s=>s.questions.map(q=>{const parts=gradeQuestion(q,answers);return {id:q.id,parts,points:q.points||1,correct:combined(q)?Number(parts.every(p=>p.correct)):parts.filter(p=>p.correct).length,answered:combined(q)?Number(parts.every(p=>p.value.trim())):parts.filter(p=>p.value.trim()).length};}));return {rows,correct:rows.reduce((n,r)=>n+r.correct,0),total:rows.reduce((n,r)=>n+r.points,0),answered:rows.reduce((n,r)=>n+r.answered,0)};}
 function items(test,lessonId){return test.sections.flatMap(s=>s.questions.flatMap(q=>{const fs=fields(q),base={source:test.source,inputMode:'typing',grading:'discover-original',groupId:q.id};if(combined(q))return [{...base,id:`${test.courseId}-program2-${lessonId}-${q.id}-combined`,combinedParts:fs,sourceKey:q.id+'--combined',answer:JSON.stringify(Object.fromEntries(fs.map(f=>[f.key,f.answers[0]]))),acceptedAnswers:[],options:[]}];return fs.map(f=>({...base,id:`${test.courseId}-program2-${lessonId}-${q.id}-${f.key}`,sourceKey:key(q,f),answer:f.answers[0],acceptedAnswers:f.answers.slice(1),...(q.answerRelations&&f.type==='pictureChoice'?{answerRelations:q.answerRelations,relationKey:f.key,relationOtherKeys:fs.filter(p=>p.key!==f.key).map(p=>p.key)}:{}),options:f.options||[]}));}));}
 function response(q,f,answers){if(!q.answerRelations||f.type!=='pictureChoice')return String(answers[key(q,f)]??'');return JSON.stringify(Object.fromEntries(fields(q).map(p=>[p.key,String(answers[key(q,p)]??'')])));}
 function check(item,value){
  if(item.combinedParts){let parts;try{parts=JSON.parse(value);}catch{return false;}return !!parts&&typeof parts==='object'&&item.combinedParts.every(p=>matcher.matches(parts[p.key],p.answers));}
  if(!item.answerRelations)return matcher.matches(value,[item.answer,...item.acceptedAnswers||[]]);
  let parts;try{parts=JSON.parse(value);}catch{return false;}if(!parts||typeof parts!=='object')return false;
  const compatible=item.answerRelations.filter(r=>item.relationOtherKeys.every(k=>matcher.matches(parts[k],[r[k]])));
  return matcher.matches(parts[item.relationKey],compatible.length?compatible.map(r=>r[item.relationKey]):[item.answer,...item.acceptedAnswers||[]]);
 }
 function validate(test){const ids=new Set(),errors=[];let points=0;for(const s of test.sections){let sectionPoints=0;for(const q of s.questions){if(ids.has(q.id))errors.push('Duplicate '+q.id);ids.add(q.id);const fs=fields(q);if(fs.length!==(q.points||1)&&!combined(q))errors.push('Point mismatch '+q.id);for(const f of fs)if(!f.answers?.length)errors.push('Missing answer '+q.id);sectionPoints+=q.points||1;}if(sectionPoints!==s.points)errors.push('Section points '+(s.letter||s.key));points+=sectionPoints;}if(points!==test.totalPoints)errors.push('Total points');if(errors.length)throw Error(test.id+': '+errors.join(', '));return true;}
 const api={fields,key,combined,gradeQuestion,grade,items,response,check,validate};if(typeof module!=='undefined')module.exports=api;else root.DiscoverExamCore=api;
})(typeof window==='undefined'?globalThis:window);
