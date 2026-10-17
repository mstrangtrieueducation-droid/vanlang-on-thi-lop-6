(function(root){
 'use strict';
 const sameSet=(a,b)=>a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x));
 const sameOrder=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
 const normalizeWritten=value=>String(value??'').normalize('NFKC').trim().toLowerCase().replace(/[‘’]/g,"'").replace(/[.!?]+$/,'').replace(/,/g,'').replace(/\s*\/\s*/g,' / ').replace(/\s+/g,' ');
 function check(q,response){
  if(q.inputMode==='typing')return [q.answer,...(q.acceptedAnswers||[])].some(a=>normalizeWritten(a)===normalizeWritten(response));
  if(['build','sequence','route'].includes(q.type))return sameOrder(response,q.answer);
  if(q.type==='collect')return sameSet(response,q.answer);
  return response===q.answer;
 }
 const stars=(done,total,review)=>done<total?0:review===0?3:review<=Math.ceil(total/4)?2:1;
 const unlocked=(progress,index)=>index===0||progress[index].done>0||progress[index-1].done>=progress[index-1].total;
 const api={sameSet,sameOrder,normalizeWritten,check,stars,unlocked};
 if(typeof module!=='undefined')module.exports=api;else root.AdventureRules=api;
})(typeof window==='undefined'?globalThis:window);
