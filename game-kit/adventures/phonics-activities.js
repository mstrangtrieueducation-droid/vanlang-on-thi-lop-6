/* Native Phonics interactions. Every submission still uses the shared first-attempt scorer. */
(()=>{'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const standard=()=>window.GalaxyBridge?.getMode()==='standard';
 function picture(p){if(!p)return '';const ready=globalThis.TitiImages?.source(p);if(ready)return `<img class="phonics-card-image" src="${esc(ready)}" alt="" draggable="false" decoding="async" style="aspect-ratio:${p.cellAspect||'1'}">`;if(p.atlas&&p.crop?.length===4&&p.size){const [x,y,w,h]=p.crop;return `<i class="phonics-picture" aria-hidden="true" style="aspect-ratio:${w}/${h};background-image:url('${esc(p.atlas)}');background-size:${p.size/w*100}% ${p.size/h*100}%;background-position:${x/(p.size-w)*100}% ${y/(p.size-h)*100}%"></i>`;}if(p.atlas&&Number.isInteger(p.cell)&&p.columns>1&&p.rows>1)return `<i class="phonics-picture" aria-hidden="true" style="aspect-ratio:${p.cellAspect||p.rows+'/'+p.columns};background-image:url('${esc(p.atlas)}');background-size:${p.columns*100}% ${p.rows*100}%;background-position:${p.cell%p.columns*100/(p.columns-1)}% ${Math.floor(p.cell/p.columns)*100/(p.rows-1)}%"></i>`;return p.src?`<img class="phonics-card-image" src="${esc(p.src)}" alt="" draggable="false">`:`<i class="phonics-picture" aria-hidden="true" style="background-image:url(../game-kit/adventures/pictures/phonics-sheet-${p.sheet}-v1.png);background-position:${p.cell%4*100/3}% ${Math.floor(p.cell/4)*100/3}%"></i>`;}
 function render(q,values,view={}){
  const layout=view.layout||ActivityLayout.create(q);
  if(q.matchPictures){
   
   return `<div class="phonics-pairs"><div class="pair-words">${layout.words.map(w=>`<button data-pair-word="${esc(w)}" aria-pressed="false">${esc(w)}${values.includes(w)?' ✓':''}</button>`).join('')}</div><div class="pair-pictures">${layout.pictures.map((i,row)=>`<button data-pair-picture="${i}" aria-label="Picture ${String.fromCharCode(65+row)}${values[i]?', paired with '+esc(values[i]):''}"><span class="pair-number">●</span>${picture(q.matchPictures[i])}<b class="pair-assignment">${esc(values[i]||'')}</b></button>`).join('')}</div></div><button id="phonics-submit" class="primary" ${q.matchPictures.every((_,i)=>values[i])?'':'disabled'}>✓ Check pairs</button>`;
  }
  if(q.orderWords&&!standard())return `<div class="phonics-order"><div class="phonics-slots" aria-label="Your word order">${q.orderWords.map((_,i)=>`<button data-order-undo="${i}" ${values[i]?'':'disabled'} aria-label="Position ${i+1}${values[i]?', remove '+esc(values[i]):', empty'}"><small>${i+1}</small>${esc(values[i]||'?')}</button>`).join('')}</div><div class="phonics-tiles">${layout.order.map(w=>`<button data-order-word="${esc(w)}" ${values.includes(w)?'disabled':''}>${esc(w)}</button>`).join('')}</div><button id="phonics-submit" class="primary" ${values.length===q.orderWords.length?'':'disabled'}>✓ Check order</button></div>`;
  return null;
 }
 function reference(q,{review=false}={}){return q.picturePrompt?`<div class="phonics-prompt-picture" role="img" aria-label="Question picture">${picture(q.picturePrompt)}</div>`:q.matchPictures&&review?`<div class="phonics-reference">${q.matchPictures.map((p,i)=>`<figure><b>${i+1}</b>${picture(p)}</figure>`).join('')}</div>`:'';}
 function prompt(q){return standard()&&q.matchPictures?'Which answer matches pictures 1, 2 and 3?':standard()&&q.orderWords?q.prompt.replace(/^Tap the words/,'Choose the words'):q.prompt;}
 function bind(root,q,api){
  let selected=null;
  if(!api.locked()){const message=q.matchPictures?'Tap a word → tap a picture → check all three pairs.':q.orderWords?'Listen → tap the cards in order → check.':'';if(message)root.querySelector('#feedback').textContent=message;}
  const update=v=>{api.set(v);api.sound('pop');api.save();api.refresh();};
  root.querySelectorAll('[data-order-word]').forEach(b=>b.onclick=()=>{if(api.locked())return;update([...api.values(),b.dataset.orderWord]);});
  root.querySelectorAll('[data-order-undo]').forEach(b=>b.onclick=()=>{if(api.locked())return;update(api.values().filter((_,i)=>i!==Number(b.dataset.orderUndo)));});
  root.querySelectorAll('[data-pair-word]').forEach(b=>b.onclick=()=>{if(api.locked())return;selected=b.dataset.pairWord;root.querySelectorAll('[data-pair-word]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));api.sound('pop');});
  root.querySelectorAll('[data-pair-picture]').forEach(b=>b.onclick=()=>{if(api.locked())return;const i=Number(b.dataset.pairPicture),next=Array.from({length:q.matchPictures.length},(_,j)=>api.values()[j]||'');if(selected){for(let j=0;j<next.length;j++)if(next[j]===selected)next[j]='';next[i]=selected;}else next[i]='';update(next);});
  if(q.matchPictures){const left=[...root.querySelectorAll('[data-pair-word]')],right=[...root.querySelectorAll('[data-pair-picture]')];window.LaserMatch?.mount(root.querySelector('.phonics-pairs'),left,right,()=>right.flatMap((b,j)=>{const word=api.values()[+b.dataset.pairPicture],i=left.findIndex(x=>x.dataset.pairWord===word);return i<0?[]:[[i,j]];}),(i,j)=>{if(api.locked())return;left[i].click();right[j].click();});}
  root.querySelector('#phonics-submit')?.addEventListener('click',e=>{if(api.locked())return;const v=api.values();if(v.length!==(q.orderWords?.length||q.matchPictures?.length)||v.some(x=>!x))return;api.submit(v.join(' → '),e.currentTarget);});
 }
 window.PhonicsActivities={picture,render,reference,prompt,bind};
})();
