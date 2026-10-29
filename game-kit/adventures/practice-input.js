/* UI input adapter. Existing question IDs, answer keys and score transport stay intact. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.PracticeInput=api;})(globalThis,()=>{
 'use strict';
 const rootStrokes=q=>globalThis.LatinStrokeGuides?.[q.resourceTask?.letters?.[0]?.text];
 const norm=s=>String(s??'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
 function response(q,value){
  if(!q.letterGap)return value;
  // Never accept the old single-letter response at the input boundary.
  return norm(value)===norm(q.letterGap.word)?q.answer:'[whole-word] '+String(value??'');
 }
 function display(q,value){return q.letterGap&&value===q.answer?q.letterGap.word:String(value??'').replace(/^\[whole-word\] /,'');}
 const isBlend=q=>/^Blend the letters\./i.test(q.prompt||'')&&typeof q.answer==='string'&&/^[a-z]+$/i.test(q.answer);
 const flat=s=>norm(String(s||'').replace(/[‘’]/g,"'").replace(/[“”]/g,'"'));
 function sourcePosition(q){const text=flat(q.storyText),evidence=(Array.isArray(q.evidence)?q.evidence:[q.evidence]).filter(Boolean),completed=String(q.scene||'').replace(/_{2,}/,q.answer);for(const quote of [...evidence,completed]){const needle=flat(quote),at=text.indexOf(needle);if(needle.length>3&&at>=0)return at;}const answer=flat(q.answer),at=text.indexOf(answer);return answer.length>2&&at>=0&&text.indexOf(answer,at+answer.length)<0?at:null;}
 function readingOrder(items){const out=[...items];let start=0;while(start<out.length){const first=out[start];if(!first.storyId||first.resourceTask){start++;continue;}let end=start+1;while(end<out.length&&out[end].storyId===first.storyId&&out[end].partType===first.partType&&!out[end].resourceTask)end++;const rows=out.slice(start,end),positions=rows.map(sourcePosition);if(rows.length>1&&positions.every(p=>p!==null))out.splice(start,rows.length,...rows.map((q,i)=>({q,i,p:positions[i]})).sort((a,b)=>a.p-b.p||a.i-b.i).map(r=>r.q));start=end;}return out;}
 function prepare(g,course){
  globalThis.TextbookDCore?.prepare(g,globalThis.TextbookDData);
  const seen=new Set();
  for(const q of g.items||[]){
   const signature=JSON.stringify([q.scene,q.prompt,q.answer,q.picturePrompt?.semantic,q.resourceTask,q.visual]);const duplicate=seen.has(signature);seen.add(signature);
   if(!q.letterGap&&/letters complete this word/i.test(q.prompt||'')&&/^[A-Za-z-]+$/.test(q.spokenScene||'')&&/_/.test(q.scene||'')){q.letterGap={word:q.spokenScene,mask:q.scene};q.inputMode='typing';q.partType='lookWrite';q.partTitle='Missing Letters';q.spokenPrompt='';}
   if(q.resourceTask?.kind==='soundGroups'){q.partInstruction='Circle the pictures of words with the same sound.';q.prompt=String(q.resourceTask.rule||q.partInstruction).replace(/^Which word /,'Circle the pictures of words that ').replace('words that begins','words that begin').replace('words that ends','words that end').replace('words that contains','words that contain').replace(/\?$/,'.');}
   if(q.resourceTask?.kind==='trace'&&rootStrokes(q))q.resourceTask.letters=rootStrokes(q);
   if(q.letterGap){q.prompt='Write the whole word.';q.partInstruction='Look at the picture. Write the whole word.';q.why='Từ đầy đủ là “'+q.letterGap.word+'”. Viết lại toàn bộ từ, gồm cả những chữ đã cho.';}
   // A repeated spelling stem becomes audio-only retrieval, not another copy
   // with shuffled choices. Canonical keys and historical attempts stay intact.
   if(duplicate&&!g.exam&&/^family-friends-/.test(course)&&(q.letterGap||q.interaction==='spelling')){q.inputMode='typing';q.partType='listenWrite';q.partTitle='Listen & Write';q.partInstruction='Listen and write the whole word.';q.prompt=q.partInstruction;q.scene='';q.spokenPrompt='';q.skill='listening';q.spellingRecall=true;}
   if(isBlend(q)){q.blendLetters=[...q.answer];q.scene='';q.partType='build';q.partTitle='Blend Letters';q.partInstruction='Put the letters in order. Write the word.';}
   if(/^family-friends-/.test(course)&&/(?:write|choose) the number (?:in words|word)/i.test(q.prompt||'')){q.inputMode='typing';q.partType='readWrite';q.partTitle='Write the number word';q.partInstruction='Write the number word.';q.prompt='Write the number word.';}
  }
  if(/^family-friends-/.test(course)&&!g.exam)g.items=readingOrder(g.items||[]);
  return g;
 }
 const audioOnly=q=>!q.dictation&&(q.partType==='listenWrite'||q.partType==='listenGap'||q.listeningStatement||q.skill==='listening'&&q.inputMode==='typing'&&!q.letterGap&&!q.picturePrompt);
 const readyForAuto=(q,value)=>{const target=String(q.letterGap?.word||q.answer).split(' / '),parts=String(value||'').split(' / ');return parts.length===target.length&&parts.every((part,i)=>norm(part).length>=norm(target[i]).length);};
 return {response,display,isBlend,prepare,audioOnly,readingOrder,sourcePosition,readyForAuto};
});
