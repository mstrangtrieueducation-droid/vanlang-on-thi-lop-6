/* Persistent, measured scenes. Scene state is local; answers use the quiz's existing ledger. */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const boards=new Map(),images=new Map(),supported=q=>q?.resourceTask?.sceneVersion===4;let resizeWatch=null;
const art=w=>'../game-kit/adventures/unit-scenes-v4/'+w.image;
function warm(t){const w=t?.world;if(!w||images.has(w.id))return;const i=new Image();i.decoding='async';i.src=art(w);images.set(w.id,i);if(images.size>2)images.delete(images.keys().next().value);}
function position(el,p){Object.assign(el.style,{left:p.x+'%',top:p.y+'%',width:p.w+'%',height:p.h+'%',transform:`translate(-50%,-50%) rotate(${p.angle||0}deg)`});}
const picture=o=>o.picture?window.PhonicsActivities.picture(o.picture):'';
function render(q){if(!supported(q))return null;const w=q.resourceTask.world;return `<section class="command-game"><header class="command-heading"><h2>${esc(w.title)}</h2><button data-command-listen>🔊 Nghe lại</button><button data-command-hint>💡 Hint</button><button data-command-zoom>⊕</button></header><div class="command-collection" role="list" aria-label="Completed objects"></div><div class="command-pan"><div data-command-host></div></div>${q.resourceTask.kind==='sceneActions'?'<nav class="command-vocabulary" aria-label="Object words"></nav>':''}<p class="command-status" role="status"></p></section>`;}
function make(w){const board=document.createElement('div');board.className='command-board';board.style.aspectRatio=w.width+'/'+w.height;board.innerHTML=`<img class="command-plate" src="${esc(art(w))}" width="${w.width}" height="${w.height}" alt="${esc(w.title)}" draggable="false" decoding="async" fetchpriority="high">`;
 for(const z of w.zones||[]){const b=document.createElement('button');b.type='button';b.className='command-zone';b.dataset.commandZone=z.id;b.setAttribute('aria-label',z.label);position(b,z);board.append(b);}
 for(const o of w.objects){const b=document.createElement('button');b.type='button';b.className='command-object '+(o.fixed?'command-hotspot':'command-movable');b.dataset.commandObject=o.id;b.setAttribute('aria-label',o.fixed?'Picture detail':o.word);b.innerHTML=o.sun?'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 1L61 22L84 8L81 34L99 43L80 59L89 82L63 81L50 99L38 80L13 89L20 62L1 50L21 38L12 14L38 22Z" fill="white"/><circle cx="50" cy="50" r="28" fill="white"/></svg>':picture(o);position(b,o);board.append(b);}
 for(const poly of w.lips||[]){const lip=document.createElement('div');lip.className='command-lip';lip.style.backgroundImage=`url("${art(w)}")`;lip.style.clipPath=`polygon(${poly})`;board.append(lip);}return board;}
function bind(root,q,api){if(!supported(q))return;const t=q.resourceTask,w=t.world,detective=t.kind==='detectiveScene',host=root.querySelector('[data-command-host]');if(!host||!w)return;
 let board=boards.get(w.id);if(!board){board=make(w);boards.set(w.id,board);if(boards.size>2)boards.delete(boards.keys().next().value);}host.append(board);
 const state=api.sceneState(w.id);state.placements||={};state.colors||={};state.collected||=[];
 const buttons=[...board.querySelectorAll('[data-command-object]')],zones=[...board.querySelectorAll('[data-command-zone]')],status=root.querySelector('.command-status');let selected=null,drag=null,ignore=false;
 const byId=id=>buttons.find(b=>b.dataset.commandObject===id),object=id=>w.objects.find(o=>o.id===id),values=()=>api.values();
 const remaining=()=>detective?(t.targets||[t.target]).filter(id=>!values().includes(id)):t.steps.slice(values().filter(v=>v.includes('>')).length);
 function sync(){for(const b of buttons){const id=b.dataset.commandObject,o=object(id);position(b,state.placements[id]?.position||o);b.classList.remove('command-selected','command-found','command-hint');b.disabled=!!api.completed?.();if(o.sun)b.querySelectorAll('path,circle').forEach(el=>el.setAttribute('fill',state.colors[id]||'white'));b.classList.toggle('command-placed',!!state.placements[id]);}
  board.classList.remove('command-carrying');root.querySelector('.command-collection').innerHTML=state.collected.map(id=>{const o=object(id);return `<span role="listitem" class="command-medal" aria-label="${esc(o.word||o.description)}">${picture(o)||'✓'}</span>`;}).join('');
 }
 function remember(id){if(!state.collected.includes(id))state.collected.push(id);api.save();}
 function reject(answer,b){api.submit(answer,b);status.textContent='Not quite. Listen and try again!';}
 function move(id,zone){if(api.locked())return;const done=values().filter(v=>v.includes('>')),step=remaining()[0],b=byId(id);if(!step||step.object!==id||step.target!==zone){reject([...done,id+'>'+zone].join('|'),b);sync();return;}
  if(step.action==='color'){state.colors[id]=step.color;}else if(step.action!=='point'){state.placements[id]={target:zone,position:step.position};}
  const next=[...done,id+'>'+zone];api.set(next);remember(id);sync();b.classList.add('command-snap');setTimeout(()=>b.classList.remove('command-snap'),450);api.sound('ding');if(next.length===t.steps.length)api.submit(q.answer,b);else status.textContent='Great! Listen for the next action.';selected=null;
 }
 function collect(id,b){if(api.locked())return;const todo=remaining();if(!todo.includes(id)){reject(id,b);return;}const next=[...new Set([...values(),id])];api.set(next);b.classList.add('command-found');api.sound('ding');if((t.targets||[t.target]).every(x=>next.includes(x))){remember(id);api.submit(q.answer,b);api.hold?.();setTimeout(()=>api.resume?.(),650);}else{api.save();status.textContent='Keep looking for the other person.';}}
 function choose(id){const step=remaining()[0];if(step?.action==='point'){move(id,step.target);return;}selected=id;board.classList.add('command-carrying');buttons.forEach(b=>b.classList.toggle('command-selected',b.dataset.commandObject===id));api.sound('pop');}
 sync();
 for(const b of buttons){const id=b.dataset.commandObject,o=object(id);b.onclick=()=>{if(ignore||api.locked())return;if(detective)collect(id,b);else choose(id);};
  b.onpointerdown=e=>{if(detective||o.fixed||api.locked()||e.button!==0)return;e.preventDefault();choose(id);drag={id,b,x:e.clientX,y:e.clientY,moved:false};b.setPointerCapture(e.pointerId);};
  b.onpointermove=e=>{if(!drag||drag.b!==b)return;e.preventDefault();if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<4&&!drag.moved)return;drag.moved=true;const edge=pan.getBoundingClientRect();if(e.clientX<edge.left+24)pan.scrollLeft-=14;else if(e.clientX>edge.right-24)pan.scrollLeft+=14;if(e.clientY<edge.top+20)pan.scrollTop-=10;else if(e.clientY>edge.bottom-20)pan.scrollTop+=10;const r=board.getBoundingClientRect();position(b,{...o,x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100});};
  b.onpointerup=e=>{if(!drag||drag.b!==b)return;const d=drag;drag=null;if(!d.moved)return;ignore=true;setTimeout(()=>ignore=false,0);const r=board.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;const inside=w.zones.filter(z=>Math.abs(x-z.x)<=z.w/2&&Math.abs(y-z.y)<=z.h/2),near=inside.length?inside:w.zones.filter(z=>Math.abs(x-z.x)<=z.w/2+12/r.width*100&&Math.abs(y-z.y)<=z.h/2+12/r.height*100),hit=near.sort((a,b)=>inside.length?a.w*a.h-b.w*b.h:Math.hypot(x-a.x,y-a.y)-Math.hypot(x-b.x,y-b.y))[0];if(hit)move(id,hit.id);else{sync();status.textContent='Drop onto a place in the picture.';}};
  b.onpointercancel=()=>{drag=null;sync();};
 }
 zones.forEach(b=>b.onclick=()=>{if(selected)move(selected,b.dataset.commandZone);});
 const vocab=root.querySelector('.command-vocabulary');if(vocab){vocab.innerHTML=w.objects.filter(o=>!o.fixed).map(o=>`<button data-command-word="${o.id}">${esc(o.word)}</button>`).join('')+(w.palette||[]).map(p=>`<button data-command-color="${p.id}" style="--paint:${p.hex}" aria-label="${p.name}"><i></i>${p.name}</button>`).join('');vocab.querySelectorAll('[data-command-word]').forEach(b=>b.onclick=()=>{if(!api.locked())choose(b.dataset.commandWord);});vocab.querySelectorAll('[data-command-color]').forEach(b=>b.onclick=()=>{if(!api.locked())move(selected||'sun',b.dataset.commandColor);});}
 root.querySelector('[data-command-listen]').onclick=()=>document.querySelector('#listen')?.click();
 root.querySelector('[data-command-hint]').onclick=()=>{const id=detective?remaining()[0]:remaining()[0]?.object,b=byId(id);b?.classList.add('command-hint');setTimeout(()=>b?.classList.remove('command-hint'),3000);};
 const pan=root.querySelector('.command-pan'),heading=root.querySelector('.command-heading');requestAnimationFrame(()=>{if(!host.isConnected)return;const drawer=root.querySelector('.context-task-drawer');if(drawer){heading.append(drawer);const summary=drawer.querySelector('summary');summary.setAttribute('aria-label','Bản đồ nhiệm vụ');summary.textContent='☷';}});
 let zoom=1;const fit=()=>{const width=Math.min(pan.clientWidth,pan.clientHeight*w.width/w.height)*zoom;Object.assign(host.style,{width:width+'px',height:width*w.height/w.width+'px'});Object.assign(board.style,{width:width+'px',height:width*w.height/w.width+'px'});};resizeWatch?.disconnect();resizeWatch=new ResizeObserver(fit);resizeWatch.observe(pan);requestAnimationFrame(fit);
 root.querySelector('[data-command-zoom]').onclick=e=>{zoom=zoom===1?1.8:1;e.currentTarget.textContent=zoom===1?'⊕':'⊖';fit();};
}
window.CommandScene={supported,render,bind,warm};
})();

