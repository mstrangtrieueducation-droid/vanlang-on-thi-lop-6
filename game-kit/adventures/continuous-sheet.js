/* One source Part, one answer sheet. Drafts are separate from scored attempts. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ContinuousSheet=api;})(globalThis,()=>{
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const course=id=>/^(family-friends-[12]|discover-[1-4])$/.test(id||'');
 function enabled(id,items,part,exam=false){const rows=part.indices.map(i=>items[i]);return course(id)&&rows.every(q=>(q.type==='choice'||q.inputMode==='typing')&&!q.orderWords&&!q.matchPictures);}
 const blanks=q=>q.inputMode==='typing'?String(q.answer).split(' / ').length:0;
 function value(q,run,flow){return run.sheetDrafts?.[q.id]??flow.answer(run,q.id).last??'';}
 function ready(q,v){return q.inputMode==='typing'?String(v||'').split(' / ').length===blanks(q)&&String(v).split(' / ').every(s=>s.trim()):q.options?.includes(v);}
 function media(items,part){const rows=part.indices.map(i=>items[i]),first=rows[0];return {...first,sheetPartId:part.id,sheetAudioItems:rows,storyTitle:first.storyTitle||part.title};}
 function render(items,part,run,flow,coach,layout,pictures,dialogue,testScenes,exam){
  return `<header class="sheet-heading"><div><small>PART ${part.number} / ${part.total} · ${part.count} QUESTIONS</small><h1>${esc(part.title)}</h1></div><button id="part-instruction" aria-label="Replay Part instruction">🔊</button><p>${esc(part.instruction)}</p><span class="sheet-count" role="status"></span></header><div class="sheet-rows">`+part.indices.map((i,row)=>{
   const q=items[i],v=value(q,run,flow),answered=!!run.answers[q.id],correct=run.answers[q.id]?.firstCorrect;
   const view=globalThis.ReadingPassage?.question(q)||q;const scene=dialogue?.render(view)||(view.scene?`<p class="sheet-context">${esc(view.scene)}</p>`:'');
   let input;if(q.inputMode==='typing'){const vals=String(v).split(' / ');input=Array.from({length:blanks(q)},(_,j)=>`<label class="sheet-written">${blanks(q)>1?'Answer '+(j+1):'Your answer'}<input data-sheet-input="${i}" data-blank="${j}" aria-label="Question ${row+1}, answer ${j+1}" value="${esc(vals[j]||'')}" maxlength="400" autocomplete="off" autocapitalize="off" spellcheck="false" ${answered?'disabled':''}></label>`).join('');}
   else input='<div class="sheet-options" role="group" aria-label="Question '+(row+1)+' answers">'+layout(q).options.map((o,j)=>`<button data-sheet-choice="${i}" data-value="${esc(o)}" aria-pressed="${v===o}" ${answered?'disabled':''}><span class="sheet-letter">${String.fromCharCode(65+j)}</span>${q.pictureOptions?.[o]?pictures.picture(q.pictureOptions[o]):'<b>'+esc(q.optionLabels?.[o]||o)+'</b>'}</button>`).join('')+'</div>';
   return `<article class="sheet-question ${answered?(exam?'sheet-saved':correct?'sheet-correct':'sheet-wrong'):''}" id="sheet-question-${i}" data-sheet-row="${i}"><h2><span>${row+1}</span>${esc(q.title||'Question '+(row+1))}</h2>${scene}${q.prompt&&!/^(listen|read|look|choose|write|fill|complete)\b/i.test(q.prompt)?'<p class="sheet-prompt">'+esc(q.prompt)+'</p>':''}${pictures?.reference?.(q)||''}${testScenes?.render(q)||''}${input}<p class="sheet-feedback" role="status">${answered?(exam?'Answer saved.':(correct?'✓ ':'↺ ')+esc(coach.explanation(q))):''}</p></article>`;
  }).join('')+`</div><footer class="sheet-actions"><button data-sheet-prev ${part.number===1?'disabled':''}>← Previous Part</button><button data-sheet-check>✓ ${exam?'Save Part':'Check Part'}</button><button data-sheet-next>${part.number===part.total?'Nộp bài ✓':'Next Part →'}</button></footer>`;
 }
 return {course,enabled,blanks,value,ready,media,render};
});

