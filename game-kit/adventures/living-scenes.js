/* Persistent scene presentation. Answers still enter the native quiz ledger. */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const supported=q=>q?.resourceTask?.sceneVersion===3,boards=new Map(),images=new Map();
const url=w=>'../game-kit/adventures/living-scenes-v3/'+w.image;
const position=(el,p)=>Object.assign(el.style,{left:p.x+'%',top:p.y+'%',width:p.w+'%',height:p.h+'%',transform:`translate(-50%,-50%) rotate(${p.angle||0}deg)`});
function warm(t){if(!t?.world)return;const w=t.world;if(!images.has(w.image)){const i=new Image();i.decoding='async';i.src=url(w);images.set(w.image,i);if(images.size>3)images.delete(images.keys().next().value);}}
function render(q){if(window.CommandScene?.supported(q))return CommandScene.render(q);if(!supported(q))return null;return `<section class="living-game"><div class="living-tools"><p>${q.resourceTask.kind==='sceneActions'?'🔊 Nghe rồi kéo vật vào chỗ cất. Có thể chạm vật rồi chạm vị trí.':'🔊 Nghe manh mối rồi chạm vào chi tiết trong tranh.'}</p><button type="button" data-living-hint>💡 Gợi ý</button><button type="button" data-living-zoom>⊕ Phóng to</button></div>${q.resourceTask.kind==='sceneActions'?'<div class="command-collection" data-living-collection role="list" aria-label="Completed objects"></div>':''}<div class="living-pan"><div data-living-host></div></div>${q.resourceTask.kind==='sceneActions'?'<nav class="command-vocabulary" data-living-vocabulary aria-label="Object words"></nav>':''}<p class="living-note">Bài luyện riêng · Tự lưu trên thiết bị này.</p></section>`;}
function make(w,detective){
 const board=document.createElement('div');board.className='living-board '+(detective?'living-crowd':'living-room');board.dataset.world=w.id;
 board.innerHTML=`<img class="living-plate" src="${esc(url(w))}" alt="${detective?'Khung cảnh đông người để quan sát':'Không gian cần sắp xếp'}" decoding="async" fetchpriority="high" draggable="false">`;
 if(detective){for(const o of w.objects){const b=document.createElement('button');b.type='button';b.className='living-hotspot';b.dataset.livingObject=o.id;b.setAttribute('aria-label','Chi tiết trong tranh');const [x,y,width,height]=o.box;Object.assign(b.style,{left:x+'%',top:y+'%',width:width+'%',height:height+'%'});board.append(b);}}
 else{
  for(const t of w.targets){const b=document.createElement('button');b.type='button';b.className='living-target';b.dataset.livingTarget=t.id;b.setAttribute('aria-label',t.relation+' the '+t.label);position(b,t);board.append(b);}
  for(const o of w.objects){const b=document.createElement('button');b.type='button';b.className='living-item';b.dataset.livingObject=o.id;b.setAttribute('aria-label',o.word);b.innerHTML=window.PhonicsActivities.picture(o.picture);position(b,o);board.append(b);}
  for(const poly of w.lips||[]){const lip=document.createElement('div');lip.className='living-lip';lip.style.backgroundImage=`url("${url(w)}")`;lip.style.clipPath=`polygon(${poly})`;board.append(lip);}
 }
 return board;
}
function bind(root,q,api){
 if(window.CommandScene?.supported(q))return CommandScene.bind(root,q,api);if(!supported(q))return;const t=q.resourceTask,w=t.world,detective=t.kind==='detectiveScene',host=root.querySelector('[data-living-host]');if(!host||!w)return;
 let board=boards.get(w.id);if(!board){board=make(w,detective);boards.set(w.id,board);if(boards.size>2)boards.delete(boards.keys().next().value);}host.append(board);requestAnimationFrame(()=>{if(!host.isConnected)return;const tools=root.querySelector('.living-tools'),listen=root.querySelector('#listen'),drawer=root.querySelector('.context-task-drawer');if(listen){listen.innerHTML='🔊 Nghe lại';tools.prepend(listen);}if(drawer)tools.append(drawer);});
 const state=api.sceneState(w.id);state.placements||={};const buttons=[...board.querySelectorAll('[data-living-object]')],targets=[...board.querySelectorAll('[data-living-target]')];let selected=null,drag=null,ignore=false;
 board.classList.remove('living-carrying');buttons.forEach(b=>{b.disabled=false;b.classList.remove('living-selected','living-found','living-hint','is-wrong','is-correct');const o=w.objects.find(o=>o.id===b.dataset.livingObject);if(!detective){position(b,state.placements[o.id]===o.home.target?o.home:o);b.classList.toggle('living-stored',state.placements[o.id]===o.home.target);}});targets.forEach(b=>b.disabled=false);
 function collection(){const el=root.querySelector('[data-living-collection]');if(el)el.innerHTML=w.objects.filter(o=>state.placements[o.id]).map(o=>'<span role="listitem" class="command-medal" aria-label="'+esc(o.word)+'">'+window.PhonicsActivities.picture(o.picture)+'</span>').join('');}collection();
 const vocabulary=root.querySelector('[data-living-vocabulary]');
 const remember=()=>api.save(),choose=id=>{selected=id;board.classList.add('living-carrying');buttons.forEach(b=>b.classList.toggle('living-selected',b.dataset.livingObject===id));api.sound('pop');};
 function place(id,target){if(api.locked())return;const o=w.objects.find(x=>x.id===id),b=buttons.find(x=>x.dataset.livingObject===id),answer=id+'>'+target;
  const completed=api.values().filter(v=>t.steps.some(s=>v===s.object+'>'+s.target)),expected=t.steps[completed.length];if(completed.includes(answer)){position(b,o.home);return;}if(!expected||answer!==expected.object+'>'+expected.target){position(b,state.placements[id]?o.home:o);api.set(completed);api.submit([...completed,answer].join('|'),b);selected=null;board.classList.remove('living-carrying');b.classList.remove('living-selected');return;}
  b.classList.remove('is-wrong');state.placements[id]=target;const moves=[...completed,answer];api.set(moves);collection();position(b,o.home);b.classList.add('living-stored','living-snap');setTimeout(()=>b.classList.remove('living-snap'),600);selected=null;board.classList.remove('living-carrying');remember();api.sound('ding');if(moves.length===t.steps.length)api.submit(moves.join('|'),b);
 }
 function collect(id,b){if(api.locked())return;api.set([id]);api.submit(id,b);if(id===q.answer){b.classList.add('living-found');api.hold?.();const animation=b.animate([{boxShadow:'0 0 0 3px #fff2a8',background:'#fff6b340'},{boxShadow:'0 0 30px 12px #ffd452',background:'#fff6b370'},{boxShadow:'0 0 0 3px #fff2a8',background:'transparent'}],{duration:850});animation.finished.then(()=>api.resume?.(),()=>{});}}
 for(const b of buttons){const id=b.dataset.livingObject,o=w.objects.find(o=>o.id===id);b.onclick=e=>{if(ignore||api.locked())return;if(detective)collect(id,b);else choose(id);};
  b.onpointerdown=e=>{if(detective||api.locked()||e.button!==0)return;e.preventDefault();choose(id);drag={id,b,startX:e.clientX,startY:e.clientY,moved:false};b.setPointerCapture(e.pointerId);};
  b.onpointermove=e=>{if(!drag||drag.b!==b)return;e.preventDefault();if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>4)drag.moved=true;if(!drag.moved)return;const r=board.getBoundingClientRect();position(b,{...o,x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100});};
  b.onpointerup=e=>{if(!drag||drag.b!==b)return;const d=drag;drag=null;if(!d.moved)return;ignore=true;setTimeout(()=>ignore=false,0);const r=board.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;const hit=w.targets.filter(z=>Math.abs(x-z.x)<=z.w/2&&Math.abs(y-z.y)<=z.h/2).sort((a,b)=>Math.hypot((x-a.x)/a.w,(y-a.y)/a.h)-Math.hypot((x-b.x)/b.w,(y-b.y)/b.h))[0];if(hit)place(id,hit.id);else position(b,state.placements[id]?o.home:o);};
  b.onpointercancel=()=>{drag=null;position(b,state.placements[id]?o.home:o);};
 }
 for(const b of targets)b.onclick=()=>{if(selected)place(selected,b.dataset.livingTarget);};if(vocabulary){vocabulary.innerHTML=w.objects.map(o=>'<button type="button" data-living-word="'+o.id+'">'+esc(o.word)+'</button>').join('');vocabulary.querySelectorAll('[data-living-word]').forEach(b=>b.onclick=()=>{if(!api.locked())choose(b.dataset.livingWord);});}
 root.querySelector('[data-living-hint]').onclick=()=>{const id=detective?q.answer:t.steps[Math.min(api.values().filter(v=>v.includes('>')).length,t.steps.length-1)].object,b=buttons.find(b=>b.dataset.livingObject===id);b?.classList.add('living-hint');b?.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});setTimeout(()=>b?.classList.remove('living-hint'),2600);api.sound('pop');};
 root.querySelector('[data-living-zoom]').onclick=e=>{const pan=root.querySelector('.living-pan');pan.classList.toggle('living-zoom');e.currentTarget.textContent=pan.classList.contains('living-zoom')?'⊖ Thu nhỏ':'⊕ Phóng to';};
 if(api.completed?.())buttons.forEach(b=>b.disabled=true);
}
window.LivingScenes={supported:q=>supported(q)||!!window.CommandScene?.supported(q),render,bind,warm:t=>t?.sceneVersion===4?window.CommandScene?.warm(t):warm(t)};
})();
