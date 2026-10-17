/* A single 3-second countdown spans roadmap -> lesson loading, without a lobby stop. */
(()=>{'use strict';const p=new URLSearchParams(location.search);if(p.get('play')!=='1')return;const incoming=Number(p.get('startAt')),now=Date.now(),deadline=incoming>now-15000&&incoming<=now+3000?incoming:now+3000;
 const el=document.createElement('div');el.className='flow-boot';el.innerHTML='<div><span>GET READY!</span><strong>3</strong><p>Titi is ready. Let’s go!</p><button>← Bản đồ</button></div>';document.body.append(el);let callback,done=false,finishTimer;
 el.querySelector('button').onclick=()=>{cancel();const u=new URL('../vu-tru/',location.href);u.search=location.search;u.searchParams.delete('play');u.searchParams.delete('startAt');location.assign(u.href);};
 function paint(){const n=Math.max(0,Math.ceil((deadline-Date.now())/1000)),text=n?String(n):'START';if(el.querySelector('strong').textContent!==text)el.querySelector('strong').textContent=text;if(!n&&callback&&!done){done=true;clearInterval(timer);finishTimer=setTimeout(()=>{el.remove();callback();},120);}}
 const timer=setInterval(paint,80);function cancel(){done=true;clearInterval(timer);clearTimeout(finishTimer);el.remove();}window.FlowBoot={get active(){return !done;},ready(fn){callback=fn;paint();},cancel};paint();
})();
