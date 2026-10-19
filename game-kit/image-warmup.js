/* Bounded decoded-image cache; never preload the whole course. */
(()=>{'use strict';const cache=new Map(),limit=32*1024*1024;let bytes=0;
const url=s=>window.TitiImageVariants?.url(s)||s;
const source=p=>p&&url(window.TitiImageSources?.[[p.atlas,p.columns,p.rows,p.cell].join('|')]);
function load(src){src=url(src);if(!src)return Promise.reject(Error('Missing image'));
 const previous=cache.get(src);if(previous){cache.delete(src);cache.set(src,previous);return previous.promise;}
 const image=new Image();image.decoding='async';image.fetchPriority='low';const entry={image,bytes:0,promise:null};
 entry.promise=new Promise((resolve,reject)=>{image.onload=async()=>{try{await image.decode?.();}catch{}if(cache.get(src)!==entry){resolve(image);return;}entry.bytes=image.naturalWidth*image.naturalHeight*4;bytes+=entry.bytes;
  while(cache.size>24||bytes>limit){const key=cache.keys().next().value;if(!key)break;const old=cache.get(key);cache.delete(key);bytes-=old.bytes;}
  resolve(image);};image.onerror=()=>{if(cache.get(src)===entry)cache.delete(src);reject(Error('Image unavailable: '+src));};image.src=src;});cache.set(src,entry);return entry.promise;
}
async function warm(q){if(!q)return;const pictures=[q.background?{src:q.background}:null,q.picturePrompt,...Object.values(q.pictureOptions||{}),...(q.matchPictures||[]).map(p=>p.picture||p)];for(const p of pictures){if(!p)continue;const src=source(p)||p.src||p.atlas||(p.sheet!==undefined?'../game-kit/adventures/pictures/phonics-sheet-'+p.sheet+'-v1.png':'');if(src)try{await load(src);}catch{}}}
const windows=new WeakMap();let scheduled=0,observer;
function near(items,index){const end=Math.min(items.length,index%2===0?index+3:index+2);windows.set(items,{start:index,end});warm(items[index]);if(navigator.connection?.saveData)return;
 const ticket=++scheduled,work=()=>{if(ticket!==scheduled)return;for(let i=index+1;i<end;i++)warm(items[i]);};(window.requestIdleCallback||((f)=>setTimeout(f,80)))(work,{timeout:600});}
function scan(root){const rows=[...root.querySelectorAll('.sheet-question')];for(const el of root.querySelectorAll('img,image,[style]')){
 for(const attr of ['src','href'])if(el.hasAttribute(attr)){const old=el.getAttribute(attr),next=url(old);if(old!==next)el.setAttribute(attr,next);}
 const style=el.getAttribute('style');if(style?.includes('url(')){const next=style.replace(/url\((['"]?)([^)'" ]+)\1\)/g,(m,q,s)=>'url("'+url(s)+'")');if(next!==style)el.setAttribute('style',next);}
 if(el.tagName==='IMG'){el.decoding='async';if(!el.closest('.quiz-fixed-visuals,.atlas-stage,.time-track'))el.loading='lazy';}
 const row=el.closest('.sheet-question');if(root.nodeType===11&&rows.indexOf(row)>2){for(const a of ['src','href'])if(el.hasAttribute(a)){el.dataset['preload'+a[0].toUpperCase()+a.slice(1)]=el.getAttribute(a);el.removeAttribute(a);}if(el.style.backgroundImage){el.dataset.preloadBackground=el.style.backgroundImage;el.style.backgroundImage='none';}}
}}
function reveal(row){for(const el of row.querySelectorAll('[data-preload-src],[data-preload-href],[data-preload-background]')){for(const a of ['src','href']){const key='preload'+a[0].toUpperCase()+a.slice(1);if(el.dataset[key]){el.setAttribute(a,el.dataset[key]);delete el.dataset[key];}}if(el.dataset.preloadBackground){el.style.backgroundImage=el.dataset.preloadBackground;delete el.dataset.preloadBackground;}}}
function observe(root){observer?.disconnect();const sheet=root.querySelector('.continuous-sheet');if(!sheet)return;const rows=[...sheet.querySelectorAll('.sheet-question')];rows.slice(0,3).forEach(reveal);if(!window.IntersectionObserver){rows.forEach(reveal);return;}observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const i=rows.indexOf(e.target);rows.slice(i,i+3).forEach(reveal);}},{root:sheet,rootMargin:'0px',threshold:.01});rows.forEach(r=>observer.observe(r));}
window.TitiImages={source,url,load,scan,warm,near,observe,stats:()=>({entries:cache.size,decodedBytes:bytes})};
})();
