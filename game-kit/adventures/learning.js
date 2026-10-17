/* Learning presentation and review planning. Never mutates source questions. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.LearningCoach=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';
 const DAY=86400000;
 const labels={listening:'LISTEN',phonics:'SOUNDS',grammar:'USE IT',dialogue:'CONVERSATION',reading:'READ & THINK',vocabulary:'WORD POWER'};
 function skill(q){
  const p=String(q.prompt||'').toLowerCase();
  if(q.skill==='listening'||q.spokenScene||/do you hear|listen to/.test(p))return 'listening';
  if(q.skill==='grammar'||/_{2,}|\.{2,}|…/.test(q.scene||''))return 'grammar';
  if(/letter|sound|rhyme|syllable/.test(p))return 'phonics';
  if(/reply|choose the question|respond|conversation/.test(p))return 'dialogue';
  if(q.skill==='reading'||String(q.scene||'').length>160||/according to|main idea|author|infer|mean here|in this sentence/.test(p))return 'reading';
  return 'vocabulary';
 }
 function hint(q){
  if(q.hint&&!/^Read (the clue again|carefully)\./i.test(q.hint))return q.hint;
  return {listening:'Listen again. Say the word quietly, then choose.',phonics:'Say the word slowly. Look at the letter or sound the question asks for.',grammar:'Read the whole sentence. Look at the subject and any time words.',dialogue:'What information does the speaker ask for: a person, a place, an age or a feeling?',reading:'Find the words in the text that support your answer.',vocabulary:'Think about the meaning of the clue. Compare the words before choosing.'}[skill(q)];
 }
 function explanation(q){
  const why=String(q.why||'').trim(),answer=String(q.answer||''),scene=String(q.scene||'');
  if(why&&!/^The answer is /i.test(why))return why;
  if(skill(q)==='listening')return 'You heard: '+(q.spokenScene||answer)+'.';
  if(/_{2,}|\.{2,}|…/.test(scene))return 'Complete sentence: '+scene.replace(/_{2,}|\.{2,}|…/g,answer);
  if(skill(q)==='dialogue'){
   const both=scene+' '+answer;
   const rule=/how old/i.test(both)?'“How old” asks about age.':/what (?:is )?your name/i.test(both)?'“What is your name?” asks for a name.':/who is/i.test(both)?'“Who” asks about a person.':/how are you/i.test(both)?'“How are you?” asks how someone feels.':null;
   if(rule)return rule+' '+scene+' → '+answer;
  }
  return scene?'“'+answer+'” matches this clue: '+scene:'Correct answer: '+answer;
 }
 function instruction(q){if(q.interaction==='sentence')return 'Build the complete sentence from the word tiles.';if(q.interaction==='dictation')return 'Listen, then write the word you hear.';if(q.interaction==='recall')return 'Use the meaning cue to complete the whole sentence.';return skill(q)==='listening'?'Listen to Titi and choose the correct answer.':skill(q)==='grammar'?'Read the whole sentence and complete the gap.':skill(q)==='reading'?'Read the text and find evidence for your answer.':'Read the clue and choose the correct answer.';}
 function reflect(q){return {listening:'Say the word aloud once. Can you hear its ending?',phonics:'Say the sound, then say the whole word.',grammar:'Read the completed sentence aloud.',dialogue:'Say both parts of the conversation aloud.',reading:'Point to the words that helped you decide.',vocabulary:'Cover the answer. Can you remember it from the clue?'}[skill(q)];}
 // Passage-linked questions stay together; other skills are interleaved. Exam order is untouched.
 function plan(items,{standard=false,reviewIds=[]}={}){
  if(standard||items.some(q=>q.type!=='choice'||/previous question|text above|previous answer/i.test(q.prompt||'')))return [...items];
  const blocks=[],used=new Set();
  for(const q of items){if(used.has(q.id))continue;const linked=String(q.scene||'').length>160?items.filter(x=>x.scene===q.scene):[q];linked.forEach(x=>used.add(x.id));blocks.push(linked);}
  const output=[],recent=[],weak=new Set(reviewIds);
  while(blocks.length){let best=0,bestScore=-Infinity;
   blocks.forEach((block,i)=>{const q=block[0],previous=output.at(-1);let score=weak.has(q.id)?3:0;
    if(previous&&skill(previous)!==skill(q))score+=8;
    if(previous&&previous.prompt!==q.prompt)score+=2;
    score-=output.slice(-3).filter(x=>skill(x)===skill(q)).length*4;
    if(recent.includes(String(q.answer).toLowerCase()))score-=12;
    score-=i*.01;
    if(score>bestScore){best=i;bestScore=score;}
   });
   const block=blocks.splice(best,1)[0];output.push(...block);block.forEach(q=>recent.push(String(q.answer).toLowerCase()));while(recent.length>3)recent.shift();
  }
  return output;
 }
 function restore(items,attempt){
  if(!Array.isArray(attempt?.order))return {queue:[...items],pos:Math.max(0,items.findIndex(q=>q.id===attempt?.id)),review:false};
  const byId=new Map(items.map(q=>[q.id,q])),ids=attempt.order;
  if(!ids.length||new Set(ids).size!==ids.length||ids.some(id=>!byId.has(id))||!ids.includes(attempt.id))return restore(items,{id:attempt.id});
  return {queue:ids.map(id=>byId.get(id)),pos:ids.indexOf(attempt.id),review:attempt.reviewMode===true};
 }
 function record(history,id,correct,now=Date.now()){
  const old=history[id]||{},streak=correct?(Number(old.streak)||0)+1:0;
  history[id]={attempts:(Number(old.attempts)||0)+1,misses:(Number(old.misses)||0)+(correct?0:1),streak,seenAt:now,nextAt:now+(correct?[1,3,7,14][Math.min(streak-1,3)]*DAY:0)};
 }
 function review(items,reviewIds=[],history={},now=Date.now(),limit=6){
  const weak=new Set(reviewIds);
  const due=items.filter(q=>weak.has(q.id)||(history[q.id]?.nextAt>0&&history[q.id].nextAt<=now));
  due.sort((a,b)=>Number(weak.has(b.id))-Number(weak.has(a.id))||(history[a.id]?.seenAt||0)-(history[b.id]?.seenAt||0));
  return plan(due.slice(0,limit),{reviewIds});
 }
 return {skill,labels,hint,explanation,instruction,reflect,plan,restore,record,review};
});
