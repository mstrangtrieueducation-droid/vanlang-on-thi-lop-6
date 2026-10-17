/* Presentation order only. Response indices always refer to the original data. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ActivityLayout=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';
 function shuffle(values,random=Math.random){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const permutation=(a,b)=>Array.isArray(a)&&a.length===b.length&&same([...a].sort(),[...b].sort());
 function create(q,random=Math.random){
  const result={version:1,questionId:q.id};
  if(q.options)result.options=shuffle(q.options,random);
  if(q.matchPictures){
   const correct=String(q.answer).split(' → '),indices=q.matchPictures.map((_,i)=>i);
   result.words=shuffle(q.matchWords,random);result.pictures=shuffle(indices,random);
   const aligned=()=>result.pictures.some((id,row)=>correct[id]===result.words[row]);
   if(indices.length>1&&correct.length===indices.length&&new Set(correct).size===indices.length){
    for(let attempt=0;aligned()&&attempt<24;attempt++)result.pictures=shuffle(indices,random);
    if(aligned()){const shift=1+Math.floor(random()*(indices.length-1));result.pictures=result.words.map((_,i)=>correct.indexOf(result.words[(i+shift)%indices.length]));}
   }
  }
  if(q.orderWords){result.order=shuffle(q.orderWords,random);if(result.order.length>1&&result.order.join(' → ')===q.answer)result.order.push(result.order.shift());}
  if((q.type==='build'||q.type==='sequence')&&Array.isArray(q.answer)){result.build=shuffle(q.answer.map((_,i)=>i),random);if(result.build.length>1&&result.build.every((v,i)=>v===i))result.build.push(result.build.shift());}
  return result;
 }
 function restore(q,saved,random=Math.random){
  const valid=saved?.version===1&&saved.questionId===q.id&&(!q.options||permutation(saved.options,q.options))&&(!q.matchPictures||(permutation(saved.words,q.matchWords)&&permutation(saved.pictures,q.matchPictures.map((_,i)=>i))))&&(!q.orderWords||permutation(saved.order,q.orderWords))&&(!Array.isArray(q.answer)||!['build','sequence'].includes(q.type)||permutation(saved.build,q.answer.map((_,i)=>i)));
  return valid?JSON.parse(JSON.stringify(saved)):create(q,random);
 }
 return {create,restore,shuffle};
});
