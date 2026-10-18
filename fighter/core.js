(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.FighterCore=api;})(globalThis,()=>{
'use strict';
const norm=s=>String(s||'').trim().toLowerCase();
function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function split(phrase){const p=phrase.trim().split(/\s+/);let n=1;if(/^(a|an|the|be|have|has|had)$/i.test(p[0])&&p.length>2)n=2;return [p.slice(0,n).join(' '),p.slice(n).join(' ')];}
const bankCache=new WeakMap();
function bank(all){if(bankCache.has(all))return bankCache.get(all);const words=all.flatMap(u=>u.words),tails=[...new Set(words.flatMap(w=>w.collocation).map(split).map(p=>p[1]).filter(Boolean))],valid=new Map();for(const w of words)for(const phrase of w.collocation){const [a,b]=split(phrase);if(!valid.has(norm(a)))valid.set(norm(a),new Set());valid.get(norm(a)).add(norm(b));}const out={words,tails,valid};bankCache.set(all,out);return out;}
const headTraps={'make a decision':['do','perform'],'make progress':['do','perform'],'make an effort':['do','carry'],'do homework':['make','create'],'heavy loss':['strong','powerful'],'heavy rain':['strong','weighty']};
const tailTraps={'depend on':['of','into'],'rely on':['about','into'],'contribute to':['into','of'],'vulnerable to':['of','into'],'account for':['into','of'],'cope with':['of','into'],'consist of':['to','into'],'approve of':['into','to'],'suffer from':['into','of'],'specialize in':['of','into']};
function pool(unit,all){const words=unit.words,index=bank(all),other=index.words;let tasks=[];for(const w of words){
 for(const [i,c]of w.collocation.entries()){const [left,right]=split(c),heads=headTraps[norm(c)],tails=tailTraps[norm(c)],validTails=index.valid.get(norm(left))||new Set();const distractors=heads||tails||shuffle(index.tails.filter(p=>!validTails.has(norm(p)))).slice(0,2);if(distractors.length===2)tasks.push({id:w.id+'-clasp-'+i,wordId:w.id,kind:'clasp',left:heads?right:left,slotFirst:!!heads,answer:heads?left:right,choices:shuffle([heads?left:right,...distractors]),word:w,explanation:'Source collocation: '+c+'. '+w.example});}
 if(w.clue)tasks.push({id:w.id+'-clue',wordId:w.id,kind:'clue',answer:w.clue.answer,word:w});
 else{const distractors=shuffle(other.filter(x=>x.id!==w.id&&norm(x.word)!==norm(w.word))).map(x=>x.word);const opts=[...new Set(distractors)].slice(0,2);tasks.push({id:w.id+'-meaning',wordId:w.id,kind:'meaning',answer:w.word,choices:shuffle([w.word,...opts]),word:w});}
 }return tasks.concat(unit.academic||[]);}
function sample(tasks,count,rng=Math.random){const byKind={};for(const t of shuffle(tasks,rng))(byKind[t.kind]??=[]).push(t);const out=[],kinds=Object.keys(byKind);while(out.length<count&&kinds.some(k=>byKind[k].length))for(const k of kinds)if(byKind[k].length&&out.length<count)out.push(byKind[k].pop());return out;}
function start(unit,available,mode,vault={},rng=Math.random){const current=pool(unit,available);let tasks,reviewCount=0;
 if(mode==='arena'){const previous=available.filter(u=>u.track===unit.track&&u.unit<unit.unit&&u.unit>=unit.unit-3);const old=previous.flatMap(u=>pool(u,available));reviewCount=Math.min(3,old.length);tasks=shuffle([...sample(current,10-reviewCount,rng),...sample(old,reviewCount,rng)],rng);}
 else if(mode==='boss'){const kinds=['core','logic','clasp','paraphrase','headline','family'];const chosen=kinds.map(k=>shuffle(current.filter(t=>t.kind===k),rng)[0]);if(chosen.some(t=>!t))throw Error('All six verified skills are required for Boss.');const ids=new Set(chosen.map(t=>t.id));tasks=shuffle([...chosen,...sample(current.filter(t=>!ids.has(t.id)),4,rng)],rng);}
 else if(mode==='rescue')tasks=sample(available.flatMap(u=>pool(u,available)).filter(t=>!['core','logic','headline','paraphrase'].includes(t.kind)&&vault[t.wordId]?.misses>=2),12,rng).filter((t,i,a)=>a.findIndex(x=>x.wordId===t.wordId)===i);
 else{const cycles=[['core','clasp','family','clue'],['logic','clasp','paraphrase','family'],['headline','logic','family','paraphrase']];const kinds=cycles[(unit.unit-1)%cycles.length];tasks=sample(current.filter(t=>kinds.includes(t.kind)),12,rng);}
 if(mode==='boss'&&tasks.length<10)throw Error('This Unit needs more verified word-form/collocation tasks.');
 return {unitId:unit.id,mode,tasks,index:0,answers:[],misses:{},combo:0,points:0,startedAt:Date.now(),deadline:mode==='boss'?Date.now()+60000:null,elapsed:0,reviewCount,finished:false};}
function check(task,value){
 if(task.kind==='core'){const ids=String(value).split(',').filter(Boolean).map(Number).sort((a,b)=>a-b);return ids.length===2&&new Set(ids).size===2&&ids.join(',')===task.answer;}
 if(task.kind==='headline'){try{const v=typeof value==='string'?JSON.parse(value):value;return v.heading===task.heading&&task.evidence.includes(v.evidence);}catch{return false;}}
 if(task.kind==='paraphrase'){const pairs=String(value).split('|');return pairs.length===task.pairs.length&&new Set(pairs).size===pairs.length&&pairs.sort().join('|')===task.answer.split('|').sort().join('|');}
 return norm(value)===norm(task.answer);
}
function answer(run,value,now=Date.now()){if(run.finished||run.index>=run.tasks.length||run.deadline&&now>=run.deadline)return {expired:true};const task=run.tasks[run.index],correct=check(task,value),prior=run.misses[task.id]||0;run.answers.push({taskId:task.id,wordId:task.wordId,value,correct,at:now,first:prior===0});if(correct){run.combo++;run.points+=prior?0:10*(run.combo>=3?2:1);}else{run.combo=0;run.misses[task.id]=prior+1;}const advance=correct||run.mode==='boss'||prior>=1;if(advance)run.index++;return {correct,advance,combo:run.combo,task,first:prior===0};}
function summary(run,now=Date.now()){const first=new Map();for(const a of run.answers)if(!first.has(a.taskId))first.set(a.taskId,a);const correct=[...first.values()].filter(a=>a.correct).length,total=run.tasks.length,accuracy=total?correct/total:0;return {correct,total,accuracy,points:run.points,seconds:Math.max(0,Math.min(run.mode==='boss'?60:Infinity,(now-run.startedAt)/1000)),mastered:run.mode==='boss'&&correct>=8&&total===10,stars:accuracy>=.95?3:accuracy>=.8?2:accuracy>=.5?1:0};}
function updateVault(vault,result){if(['core','logic','headline','paraphrase'].includes(result.task.kind))return vault;const id=result.task.wordId;if(!result.correct){const old=vault[id]||{misses:0};vault[id]={...old,misses:old.misses+1,updatedAt:Date.now()};}return vault;}
return {shuffle,split,pool,start,check,answer,summary,updateVault};
});
