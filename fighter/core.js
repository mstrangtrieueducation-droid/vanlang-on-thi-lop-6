(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.FighterCore=api;})(globalThis,()=>{
'use strict';
const norm=s=>String(s||'').trim().toLowerCase();
function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function split(phrase){const p=phrase.trim().split(/\s+/);let n=1;if(/^(a|an|the|be|have|has|had)$/i.test(p[0])&&p.length>2)n=2;return [p.slice(0,n).join(' '),p.slice(n).join(' ')];}
function pool(unit,all){const words=unit.words,other=all.flatMap(u=>u.words);let tasks=[];for(const w of words){
 for(const [i,c]of w.collocation.entries()){const [left,right]=split(c),validTails=new Set(other.flatMap(x=>x.collocation).map(split).filter(p=>norm(p[0])===norm(left)).map(p=>norm(p[1]))),distractors=shuffle([...new Set(other.flatMap(x=>x.collocation).map(p=>split(p)[1]))].filter(p=>p&&!validTails.has(norm(p)))).slice(0,2);if(distractors.length===2)tasks.push({id:w.id+'-clasp-'+i,wordId:w.id,kind:'clasp',left,answer:right,choices:shuffle([right,...distractors]),word:w});}
 if(w.familyQuestion){const f=w.familyQuestion,forms=[...w.forms,...other.flatMap(x=>x.forms)],alternatives=[...new Set(forms.filter(x=>x.pos&&x.pos!==f.pos&&norm(x.word)!==norm(f.answer)).map(x=>x.word))];if(alternatives.length>=2)tasks.push({id:w.id+'-family',wordId:w.id,kind:'family',sentence:f.sentence,answer:f.answer,pos:f.pos,choices:shuffle([f.answer,...shuffle(alternatives).slice(0,2)]),word:w});}
 if(w.clue)tasks.push({id:w.id+'-clue',wordId:w.id,kind:'clue',answer:w.clue.answer,word:w});
 else{const distractors=shuffle(other.filter(x=>x.id!==w.id&&norm(x.word)!==norm(w.word))).map(x=>x.word);const opts=[...new Set(distractors)].slice(0,2);tasks.push({id:w.id+'-meaning',wordId:w.id,kind:'meaning',answer:w.word,choices:shuffle([w.word,...opts]),word:w});}
 }return tasks;}
function sample(tasks,count,rng=Math.random){const byKind={};for(const t of shuffle(tasks,rng))(byKind[t.kind]??=[]).push(t);const out=[],kinds=Object.keys(byKind);while(out.length<count&&kinds.some(k=>byKind[k].length))for(const k of kinds)if(byKind[k].length&&out.length<count)out.push(byKind[k].pop());return out;}
function start(unit,available,mode,vault={},rng=Math.random){const current=pool(unit,available);let tasks,reviewCount=0;
 if(mode==='arena'){const previous=available.filter(u=>u.track===unit.track&&u.unit<unit.unit);const old=previous.flatMap(u=>pool(u,available));reviewCount=Math.min(3,old.length);tasks=shuffle([...sample(current,10-reviewCount,rng),...sample(old,reviewCount,rng)],rng);}
 else if(mode==='boss')tasks=sample(current.filter(t=>t.kind==='clasp'||t.kind==='family'),10,rng);
 else if(mode==='rescue')tasks=sample(available.flatMap(u=>pool(u,available)).filter(t=>vault[t.wordId]?.misses>=2),12,rng).filter((t,i,a)=>a.findIndex(x=>x.wordId===t.wordId)===i);
 else{tasks=[];for(const w of shuffle(unit.words,rng)){const options=current.filter(t=>t.wordId===w.id);tasks.push(...sample(options,2,rng));}tasks=sample(tasks,tasks.length,rng);}
 if(mode==='boss'&&tasks.length<10)throw Error('This Unit needs more verified word-form/collocation tasks.');
 return {unitId:unit.id,mode,tasks,index:0,answers:[],misses:{},combo:0,points:0,startedAt:Date.now(),deadline:mode==='boss'?Date.now()+60000:null,elapsed:0,reviewCount,finished:false};}
function answer(run,value,now=Date.now()){if(run.finished||run.index>=run.tasks.length||run.deadline&&now>=run.deadline)return {expired:true};const task=run.tasks[run.index],correct=norm(value)===norm(task.answer),prior=run.misses[task.id]||0;run.answers.push({taskId:task.id,wordId:task.wordId,value,correct,at:now,first:prior===0});if(correct){run.combo++;run.points+=prior?0:10*(run.combo>=3?2:1);}else{run.combo=0;run.misses[task.id]=prior+1;}const advance=correct||run.mode==='boss'||prior>=1;if(advance)run.index++;return {correct,advance,combo:run.combo,task,first:prior===0};}
function summary(run,now=Date.now()){const first=new Map();for(const a of run.answers)if(!first.has(a.taskId))first.set(a.taskId,a);const correct=[...first.values()].filter(a=>a.correct).length,total=run.tasks.length,accuracy=total?correct/total:0;return {correct,total,accuracy,points:run.points,seconds:Math.max(0,Math.min(run.mode==='boss'?60:Infinity,(now-run.startedAt)/1000)),mastered:run.mode==='boss'&&correct>=8&&total===10,stars:accuracy>=.95?3:accuracy>=.8?2:accuracy>=.5?1:0};}
function updateVault(vault,result){const id=result.task.wordId;if(!result.correct){const old=vault[id]||{misses:0};vault[id]={...old,misses:old.misses+1,updatedAt:Date.now()};}return vault;}
return {shuffle,split,pool,start,answer,summary,updateVault};
});
