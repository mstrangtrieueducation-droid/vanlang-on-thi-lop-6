/* One canonical passage in the dock; question-specific gaps stay in the sheet. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ReadingPassage=api;})(globalThis,()=>{
 'use strict';
 const norm=s=>String(s||'').normalize('NFKC').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
 const transcript=lines=>(lines||[]).map(t=>`${t.speaker||t.role||'Speaker'}: ${t.text}`).join('\n\n');
 const text=q=>q.storyDialogue?.length?transcript(q.storyDialogue):q.storyText||'';
 const plain=s=>norm(String(s||'').replace(/(^|\n|[.!?]\s+)[A-Z][A-Za-z’' -]{0,28}:\s*/g,'$1'));
 function repeated(q,value){const candidate=plain(value);return !!candidate&&[q.storyText,text(q)].some(s=>{const source=plain(s);return source&&(source===candidate||candidate.length>100&&source.includes(candidate));});}
 function question(q){const result={...q};if(repeated(q,q.scene))result.scene='';if(q.dialogue&&repeated(q,transcript(q.dialogue)))delete result.dialogue;return result;}
 function render(q,dialogue){const body=text(q);if(!body||globalThis.PracticeInput?.audioOnly(q))return '';const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const html=q.source?.kind==='centre-original-2027-test'&&q.storyHtml?String(q.storyHtml).replace(/<[^>]*>/g,t=>/^<\/?(?:p|br|b|strong|em|i|u)\s*\/?>$/i.test(t)?t:''):'';return '<div class="shared-passage" role="region" aria-label="Reading passage" tabindex="0">'+(html||dialogue?.render({scene:body,dialogue:q.storyDialogue})||'<p>'+esc(body)+'</p>')+'</div>';}
 return {text,question,render,repeated};
});
