/* Run-only navigation and review metadata. Source question objects stay untouched. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.GameFlow=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';const clone=x=>Array.isArray(x)?x.map(clone):x;
 function response(run,id,value){run.responses||={};const old=run.responses[id],legacy=run.cloudAnswers?.[id];run.responses[id]={first:clone(old?old.first:legacy?.first||value),last:clone(value)};}
 function answer(run,id){const r=run.responses?.[id]||run.cloudAnswers?.[id];return {first:r?.first??null,last:r?.last??null};}
 function status(run,id){const a=run?.answers?.[id];return !a&&run?.examSaved?.[id]?'saved':!a?'unanswered':a.firstCorrect?'correct':'wrong';}
 function counts(items,run){const result={correct:0,wrong:0,unanswered:0};for(const q of items){const s=status(run,q.id);if(s==='saved')result.saved=(result.saved||0)+1;else result[s]++;}return result;}
 function complete(q,run,options={}){if(run?.examSaved?.[q.id])return true;if(!run?.answers?.[q.id]){const draft=run?.sheetDrafts?.[q.id];return !!q.dictation&&String(draft??'').trim().length>0;}if(!options.exam&&(options.retry||q.type!=='choice'))return run.views?.[q.id]?.solved??!!run.answers[q.id].firstCorrect;return true;}
 function firstUnfinished(items,run,options={}){return items.findIndex(q=>!complete(q,run,options));}
 function next(items,run,pos){if(pos<items.length-1)return pos+1;return items.findIndex(q=>!run.answers?.[q.id]&&!run.examSaved?.[q.id]);}
 function label(run,id){const s=status(run,id);return s==='saved'?'Đã lưu, chưa chấm':s==='correct'?'Đúng ngay lần đầu':s==='wrong'?'Đã sai hoặc dùng gợi ý':'Chưa làm / bỏ trống';}
 function text(value){return value==null?'Chưa chọn':Array.isArray(value)?value.join(' → '):String(value);}
 function sceneText(q,value,sourceD=false){if(q.textbookD&&typeof value==='string'){if(value.startsWith('[source-d] '))return value.slice(11);if(sourceD&&value===q.answer)return globalThis.TextbookDCore?.summary(q.textbookD)||value;}if(q.letterGap&&typeof value==='string')return value===q.answer?q.letterGap.word:value.replace(/^\[whole-word\] /,'');const t=q.resourceTask,w=t?.sceneVersion===3&&t.world;if(!w||typeof value!=='string')return value;if(t.kind==='detectiveScene')return w.objects.find(o=>o.id===value)?.description||value;if(t.kind!=='sceneActions')return value;return value.split('|').map(part=>{const [id,destination]=part.split('>'),o=w.objects.find(o=>o.id===id),target=w.targets?.find(z=>z.id===destination);return o&&target?'Put the '+o.word+' '+target.relation+' the '+target.label+'.':part;}).join(' ');}
 function review(q,run,coach){const r=answer(run,q.id),skill=coach.skill(q),scene=String(q.scene||''),gaps=scene.match(/_{2,}|\.{2,}|…/g)||[],pieces=typeof q.answer==='string'?q.answer.split(' / '):[];let completed=null;if(gaps.length&&gaps.length===pieces.length&&!/[A-Za-z]_+|_+[A-Za-z]/.test(scene)){let i=0;completed=scene.replace(/_{2,}|\.{2,}|…/g,()=>pieces[i++]);}
 const sourceD=!!run.views?.[q.id]?.picked?.some(v=>String(v).startsWith('source-d:v1:'));return {first:sceneText(q,r.first,sourceD),last:sceneText(q,r.last,sourceD),correct:sceneText(q,q.answer,sourceD),why:q.explanation||coach.explanation(q),completed,reflect:coach.reflect(q),strategy:{listening:'Nghe lại từ/câu, chú ý âm đầu và âm cuối rồi đối chiếu với đáp án.',phonics:'Quan sát chữ, nghe từ và so sánh phần âm đang được hỏi.',grammar:'Đọc trọn câu sau khi điền; kiểm tra chủ ngữ, dạng từ và dấu hiệu thời gian.',dialogue:'Xác định người nói đang hỏi thông tin gì, rồi kiểm tra câu đáp có đúng ý không.',reading:'Tìm chi tiết trong đoạn đọc làm căn cứ. Đối chiếu nghĩa cả câu, không chỉ một từ trùng nhau.',vocabulary:'Nối nghĩa của từ với ngữ cảnh, rồi đặt từ đúng trở lại câu để kiểm tra.'}[skill]};}
 function reconcile(run,items,newId){
  if(!run)return null;const allowed=new Set(items.map(q=>q.id));
  if(!Object.keys(run.answers||{}).some(id=>!allowed.has(id))&&!Object.keys(run.cloudAnswers||{}).some(id=>!allowed.has(id)))return run;
  const migrated={...run,id:newId,combo:0,total:items.length};
  for(const key of ['answers','responses','cloudAnswers','views','sheetDrafts','examSaved'])migrated[key]=Object.fromEntries(Object.entries(run[key]||{}).filter(([id])=>allowed.has(id)));
  for(const key of ['cloud','cloudOwner','cloudError','resultSent'])delete migrated[key];
  // Retain valid work, but imported responses must never create a speed record.
  migrated.gameplay={...run.gameplay,assisted:[...new Set([...(run.gameplay?.assisted||[]),...Object.keys(migrated.answers)])]};
  for(const a of Object.values(migrated.cloudAnswers))a.assisted=true;
  return migrated;
 }
 return {response,answer,status,counts,next,complete,firstUnfinished,label,text,review,reconcile};
});
