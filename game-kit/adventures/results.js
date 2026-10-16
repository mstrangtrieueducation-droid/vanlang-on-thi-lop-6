(function(root){
 'use strict';
 const formatTime=ms=>{const s=Math.max(0,Math.floor((Number(ms)||0)/1000));return `${Math.floor(s/60)} phút ${String(s%60).padStart(2,'0')} giây`;};
 function summarize(run){const entries=Object.values(run.answers||{}),correct=entries.filter(x=>x.firstCorrect).length,total=run.total||entries.length,elapsedMs=Math.max(0,Math.round(run.finishedElapsed??run.elapsedMs??0)),accuracy=total?correct/total:0,average=entries.length?elapsedMs/entries.length/1000:Infinity;
  return {id:run.id,total,answered:entries.length,correct,points:correct*10,elapsedMs,stars:accuracy>=.9?3:accuracy>=.65?2:entries.length?1:0,title:accuracy>=.9&&average<=8?'🏆 Kỉ lục gia':accuracy>=.8&&average<=18?'🐇 Thỏ siêu tốc':'🐢 Rùa chăm chỉ'};
 }
 function mark(run,id,correct){const old=run.answers[id];run.answers[id]=old?{...old,attempts:old.attempts+1}:{firstCorrect:!!correct,attempts:1};}
 const api={formatTime,summarize,mark};if(typeof module!=='undefined')module.exports=api;else root.GameResults=api;
})(typeof window==='undefined'?globalThis:window);
