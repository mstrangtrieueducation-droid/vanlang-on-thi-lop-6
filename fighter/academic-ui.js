/* Interactive academic tasks submit once through FighterCore, using stable source IDs. */
(()=>{'use strict';
const names={core:'S–V Core Extractor',logic:'Logic Bridge Builder',clasp:'Collocation Magnet',paraphrase:'Paraphrase Decoder',headline:'Headline Anchor',family:'Grammar Slot'};
function layout(t,run,C){run.layouts??={};return run.layouts[t.id]??=(t.kind==='headline'?C.shuffle(t.choices.map((_,i)=>i)):t.kind==='paraphrase'?{left:C.shuffle(t.pairs.map(p=>p.id)),right:C.shuffle(t.pairs.map(p=>p.id))}:null);}
function render(t,run,C,e){
 const l=layout(t,run,C),origin=`<small class="academic-origin">${e(t.origin||'Source vocabulary practice')}</small>`;
 if(t.kind==='core')return {question:'<h1>Keep the main clause.</h1><p>Tap the extra clauses to remove them. Keep the complete S–V–O / complement.</p>',body:`<div class="core-chunks">${t.chunks.map((c,i)=>`<button type="button" data-chunk="${i}" aria-pressed="false">${e(c.text)}</button>`).join(' ')}</div><button class="academic-check" id="academic-check">Check the core</button>${origin}`};
 if(t.kind==='logic')return {question:'<h1>Connect the ideas.</h1><p>Drag a logic card into the bridge, or tap it.</p>',body:`<div class="logic-pair"><p>${e(t.pair[0])}</p><div class="slot" id="slot">Build the bridge</div><p>${e(t.pair[1])}</p></div><div class="choices logic-choices">${C.shuffle(t.choices).map(v=>`<button class="option" data-value="${e(v)}" data-drag>${e(v)}</button>`).join('')}</div>${origin}`};
 if(t.kind==='headline')return {question:'<h1>Choose the heading and its evidence.</h1><p>Select a heading, then tap the sentence that supports it.</p>',body:`<div class="headline-grid"><div class="academic-passage">${t.paragraph.map((s,i)=>`<button data-evidence="${i}" aria-pressed="false"><b>${i+1}</b> ${e(s)}</button>`).join('')}</div><div class="heading-options">${l.map((i,n)=>`<button data-heading="${i}" aria-pressed="false"><b>${String.fromCharCode(65+n)}</b> ${e(t.choices[i])}</button>`).join('')}</div></div><button class="academic-check" id="academic-check" disabled>Check heading + evidence</button>${origin}`};
 if(t.kind==='paraphrase'){if(l.left.some((v,i)=>v===l.right[i])){const shift=1+Math.floor(Math.random()*(l.left.length-1));l.right=l.left.slice(shift).concat(l.left.slice(0,shift));}const item=id=>t.pairs.find(p=>p.id===id);return {question:'<h1>Match equivalent meanings.</h1><p>Select a meaning on the left, then its expression from the passage.</p>',body:`<details class="context-drawer"><summary>Read the context</summary><p>${e(t.paragraph.join(' '))}</p></details><div class="paraphrase-grid"><div>${l.left.map((id,i)=>`<button data-pair-left="${id}"><b>${i+1}</b> ${e(item(id).left)}</button>`).join('')}</div><div>${l.right.map(id=>`<button data-pair-right="${id}"><span class="pair-link"></span>${e(item(id).right)}</button>`).join('')}</div></div><button class="academic-check" id="academic-check" disabled>Check all pairs</button>${origin}`};}
 return null;
}
function bind(t,run,respond,save){
 const host=document.querySelector('#adventure'),all=s=>[...host.querySelectorAll(s)],check=host.querySelector('#academic-check');if(!check)return;
 run.drafts??={};const draft=run.drafts[t.id]??={};
 const update=()=>{
  if(t.kind==='core')all('[data-chunk]').forEach(b=>{const on=(draft.removed||[]).includes(Number(b.dataset.chunk));b.classList.toggle('trimmed',on);b.setAttribute('aria-pressed',String(on));});
  if(t.kind==='headline'){all('[data-heading]').forEach(b=>{b.classList.toggle('picked',draft.heading===Number(b.dataset.heading));b.setAttribute('aria-pressed',String(draft.heading===Number(b.dataset.heading)));});all('[data-evidence]').forEach(b=>{b.classList.toggle('picked',draft.evidence===Number(b.dataset.evidence));b.setAttribute('aria-pressed',String(draft.evidence===Number(b.dataset.evidence)));});check.disabled=!(Number.isInteger(draft.heading)&&Number.isInteger(draft.evidence));}
  if(t.kind==='paraphrase'){const pairs=draft.pairs||{};all('[data-pair-left]').forEach(b=>{b.classList.toggle('picked',draft.left===b.dataset.pairLeft);b.classList.toggle('linked',Object.hasOwn(pairs,b.dataset.pairLeft));});all('[data-pair-right]').forEach(b=>{const entry=Object.entries(pairs).find(([,v])=>v===b.dataset.pairRight);b.classList.toggle('linked',!!entry);b.querySelector('.pair-link').textContent=entry?String(run.layouts[t.id].left.indexOf(entry[0])+1)+' ↔ ':'';});check.disabled=Object.keys(pairs).length!==t.pairs.length;}
  save();
 };
 all('[data-chunk]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.chunk);draft.removed=(draft.removed||[]).includes(i)?draft.removed.filter(n=>n!==i):[...(draft.removed||[]),i];update();});
 all('[data-heading]').forEach(b=>b.onclick=()=>{draft.heading=Number(b.dataset.heading);update();});all('[data-evidence]').forEach(b=>b.onclick=()=>{draft.evidence=Number(b.dataset.evidence);update();});
 all('[data-pair-left]').forEach(b=>b.onclick=()=>{draft.left=b.dataset.pairLeft;update();});all('[data-pair-right]').forEach(b=>b.onclick=()=>{if(draft.left===undefined)return;draft.pairs??={};for(const k of Object.keys(draft.pairs))if(draft.pairs[k]===b.dataset.pairRight)delete draft.pairs[k];draft.pairs[draft.left]=b.dataset.pairRight;delete draft.left;update();});
 check.onclick=()=>respond(t.kind==='core'?(draft.removed||[]).join(','):t.kind==='headline'?JSON.stringify({heading:draft.heading,evidence:draft.evidence}):Object.entries(draft.pairs||{}).map(([a,b])=>a+':'+b).join('|'),check);update();
}
window.FighterAcademic={names,render,bind};
})();
