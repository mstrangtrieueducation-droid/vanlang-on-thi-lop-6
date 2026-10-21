/* A shared reading view. Only explicit source labels create speaker turns. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.DialogueView=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function parse(text){
  text=String(text||'');
  const labels=[...text.matchAll(/(?:^|\n|(?<=[.!?])\s+)([A-Z][A-Za-z’' -]{0,28}):\s+/g)];
  if(new Set(labels.map(m=>m[1])).size<2||labels.some(m=>/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|WEATHER FORECAST)$/.test(m[1])))return [];
  const introduction=text.slice(0,labels[0].index).trim();
  return [...(introduction?[{speaker:'Narrator',text:introduction}]:[]),...labels.map((m,i)=>({speaker:m[1],text:text.slice(m.index+m[0].length,labels[i+1]?.index??text.length).trim()}))];
 }
 function turns(q){if(q.orderWords||/sắp xếp|arrang|reorder|put .+order/i.test([q.sourceSection,q.partInstruction].filter(Boolean).join(' ')))return [];return Array.isArray(q.dialogue)?q.dialogue:parse(q.scene);}
 function render(q,{review=false}={}){
  const lines=turns(q);if(!lines.length)return '';
  const cast=[...new Set(lines.map(t=>t.speaker))];
  return `<div class="reading-dialogue ${review?'review-dialogue':''}" role="region" aria-label="Dialogue" tabindex="0">${lines.map((t,i)=>{
   // Text remains the primary identity even if an optional avatar fails to load.
   const src=t.avatar&&/^(?:\.\.\/|\.\/|\/)[^<>"']+\.(?:png|webp|jpg)$/i.test(t.avatar)?t.avatar:null;
   const who=String(t.speaker||t.role||'Speaker');
   return `<div class="dialogue-turn" data-turn="${i}" style="--speaker-color:var(--speaker-${cast.indexOf(t.speaker)%4})">${src?`<img class="speaker-avatar" src="${esc(src)}" alt="" loading="lazy">`:''}<div class="dialogue-bubble"><strong class="speaker-name">${esc(who)}:</strong><p>${esc(t.text)}</p></div></div>`;
  }).join('')}</div>`;
 }
 function transcript(lines){return lines.map(t=>`${t.speaker||t.role||'Speaker'}: ${t.text}`).join('\n\n');}
 return {parse,turns,render,transcript};
});
