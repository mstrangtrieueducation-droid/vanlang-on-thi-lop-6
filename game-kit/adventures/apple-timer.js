/* Rocket clock. AppleTimer remains a compatibility alias for saved/legacy pages. */
(function(root,factory){const script=typeof document!=='undefined'?document.currentScript?.src:null;const api=factory(script);if(typeof module==='object')module.exports=api;else{root.RocketTimer=root.AppleTimer=api;const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('rocket-timer.css?v=sheet-1',script).href;document.head.append(css);}})(globalThis,(script)=>{
'use strict';let serial=0;const asset=script?new URL('titi-rocket-v1.png',script).href:'../game-kit/adventures/titi-rocket-v1.png';
const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));
const progress=(remaining,total)=>total>0?clamp((1-remaining/total)*100):0;
// Preserve stage API for callers; visuals are exclusively the rocket.
const stage=p=>p>=100?'harvest':p>=50?'fruit':p>=40?'flower':p>=25?'sapling':'sprout';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function markup(value,label='Titi · Time flight'){const p=clamp(value);return `<span id="rocket-clock-${++serial}" class="apple-timer rocket-timer ${stage(p)}" style="--elapsed:${p}%" role="progressbar" aria-label="${escape(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p)}"><span class="rocket-lane" aria-hidden="true"><span class="rocket-rail"></span><span class="rocket-route"><span class="rocket-travel"><span class="rocket-exhaust"><i>✦</i><i>✧</i><i>✦</i></span><img src="${asset}" alt="" width="1536" height="1024" decoding="async"></span></span><span class="rocket-finish">★</span></span><span class="rocket-label">${escape(label)}</span></span>`;}
function update(el,value){if(!el)return;const p=clamp(value);el.style.setProperty('--elapsed',p+'%');el.classList.remove('sprout','sapling','flower','fruit','harvest');el.classList.add(stage(p));el.setAttribute('aria-valuenow',String(Math.round(p)));}
return {progress,stage,markup,update};
});
