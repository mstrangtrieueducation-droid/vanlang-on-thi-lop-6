/* Run-only navigation and review metadata. Source question objects stay untouched. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.GameFlow=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';const clone=x=>Array.isArray(x)?x.map(clone):x;
 function response(run,id,value){run.responses||={};const old=run.responses[id],legacy=run.cloudAnswers?.[id];run.responses[id]={first:clone(old?old.first:legacy?.first||value),last:clone(value)};}
 function answer(run,id){const r=run.responses?.[id]||run.cloudAnswers?.[id];return {first:r?.first??null,last:r?.last??null};}
 function status(run,id){const a=run?.answers?.[id];return !a?'unanswered':a.firstCorrect?'correct':'wrong';}
 function counts(items,run){const result={correct:0,wrong:0,unanswered:0};for(const q of items)result[status(run,q.id)]++;return result;}
 function next(items,run,pos){if(pos<items.length-1)return pos+1;return items.findIndex(q=>!run.answers?.[q.id]);}
 function label(run,id){const s=status(run,id);return s==='correct'?'Đúng ngay lần đầu':s==='wrong'?'Đã sai hoặc dùng gợi ý':'Chưa làm / bỏ trống';}
 function text(value){return value==null?'Chưa chọn':Array.isArray(value)?value.join(' → '):String(value);}
 function review(q,run,coach){const r=answer(run,q.id),skill=coach.skill(q),scene=String(q.scene||''),gaps=scene.match(/_{2,}|\.{2,}|…/g)||[],pieces=typeof q.answer==='string'?q.answer.split(' / '):[];let completed=null;if(gaps.length&&gaps.length===pieces.length&&!/[A-Za-z]_+|_+[A-Za-z]/.test(scene)){let i=0;completed=scene.replace(/_{2,}|\.{2,}|…/g,()=>pieces[i++]);}
 return {first:r.first,last:r.last,correct:q.answer,why:q.explanation||coach.explanation(q),completed,reflect:coach.reflect(q),strategy:{listening:'Nghe lại từ/câu, chú ý âm đầu và âm cuối rồi đối chiếu với đáp án.',phonics:'Đọc thành tiếng từ và âm đang được hỏi; so sánh phần âm tương ứng.',grammar:'Đọc trọn câu sau khi điền; kiểm tra chủ ngữ, dạng từ và dấu hiệu thời gian.',dialogue:'Xác định người nói đang hỏi thông tin gì, rồi kiểm tra câu đáp có đúng ý không.',reading:'Tìm chi tiết trong đoạn đọc làm căn cứ. Đối chiếu nghĩa cả câu, không chỉ một từ trùng nhau.',vocabulary:'Nối nghĩa của từ với ngữ cảnh, rồi đặt từ đúng trở lại câu để kiểm tra.'}[skill]};}
 return {response,answer,status,counts,next,label,text,review};
});
