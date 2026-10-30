/* Keep GPU-backed artwork alive while a lightweight, inert template updates the quiz. */
(()=>{'use strict';
const states=new WeakMap();
function patch(old,fresh,preserveDock){
 if(old.nodeType!==fresh.nodeType||old.nodeName!==fresh.nodeName){old.replaceWith(fresh);return;}
 if(old.nodeType===3){if(old.data!==fresh.data)old.data=fresh.data;return;}
 if(old.nodeType!==1)return;
 for(const a of ['src','href']){const deferred='data-preload-'+a;if(fresh.hasAttribute(deferred)&&old.getAttribute(a)===fresh.getAttribute(deferred)){fresh.setAttribute(a,old.getAttribute(a));fresh.removeAttribute(deferred);}}
 if(fresh.hasAttribute('data-preload-background')&&old.style.backgroundImage===fresh.getAttribute('data-preload-background')){fresh.style.backgroundImage=old.style.backgroundImage;fresh.removeAttribute('data-preload-background');}
 if(old instanceof HTMLInputElement&&['id','name','data-sheet-input'].some(k=>old.getAttribute(k)!==fresh.getAttribute(k))){old.replaceWith(fresh);return;}
 // The dock owns its audio controls and artwork; mount() updates it only when its source changes.
 if(preserveDock&&old.matches('.scene-panel.listening-dock')&&fresh.matches('.scene-panel'))return;
 for(const a of [...old.attributes])if(!fresh.hasAttribute(a.name))old.removeAttribute(a.name);
 for(const a of fresh.attributes)if(old.getAttribute(a.name)!==a.value)old.setAttribute(a.name,a.value);
 const children=[...fresh.childNodes];children.forEach((next,i)=>{const current=old.childNodes[i];if(!current)old.append(next);else patch(current,next,preserveDock);});
 while(old.childNodes.length>children.length)old.lastChild.remove();
 if(old instanceof HTMLInputElement){old.checked=fresh.checked;if(document.activeElement!==old&&old.value!==fresh.value)old.value=fresh.value;}
}
function init(app){
 let s=states.get(app);if(s)return s;
 const root=document.createElement('div');root.className='quiz-fixed-visuals';
 const background=document.createElement('div');background.className='quiz-fixed-background';background.setAttribute('aria-hidden','true');
 const mascot=document.createElement('div');mascot.className='quiz-fixed-mascot';root.append(background,mascot);app.prepend(root);
 s={root,background,mascot,course:null,slot:null,queued:false};states.set(app,s);
 const position=()=>{s.queued=false;const r=s.slot?.getBoundingClientRect();s.mascot.hidden=!r||!r.width||!r.height;
  if(r){const w=Math.min(500,r.width);Object.assign(s.mascot.style,{left:(r.left+(r.width-w)/2)+'px',top:r.top+'px',width:w+'px',height:r.height+'px'});}
 };
 s.position=()=>{if(!s.queued){s.queued=true;requestAnimationFrame(position);}};
 new ResizeObserver(s.position).observe(app);addEventListener('resize',s.position,{passive:true});document.addEventListener('scroll',s.position,{passive:true,capture:true});window.visualViewport?.addEventListener('resize',s.position,{passive:true});
 return s;
}
function render(app,html,scenery,preserveDock=false){
 const s=init(app),t=document.createElement('template');t.innerHTML=html;window.TitiImages?.scan(t.content);
 const fox=t.content.querySelector('.teacher-fox');
 if(fox){if(!s.mascot.firstChild)s.mascot.append(fox.cloneNode(true));
  fox.classList.remove('mascot');fox.classList.add('quiz-mascot-slot');fox.setAttribute('aria-hidden','true');
  s.mascot.firstChild.className='mascot teacher-fox '+(fox.classList.contains('yay')?'yay':'idle');
 }
 const old=[...app.childNodes].filter(n=>n!==s.root),next=[...t.content.childNodes];next.forEach((n,i)=>old[i]?patch(old[i],n,preserveDock):app.append(n));for(const n of old.slice(next.length))n.remove();
 s.slot=app.querySelector('.quiz-mascot-slot');s.mascot.hidden=!s.slot;
 const course=window.GAME_CONFIG?.courseId||'van-lang';
 if(s.course!==course){s.background.innerHTML=scenery?.()||'';s.course=course;}
 s.root.classList.toggle('visuals-playing',!!app.querySelector('.play'));s.position();
 window.TitiImages?.scan(app);
 window.TitiImages?.observe(app);
}
window.QuizVisualLayers={render};
})();
