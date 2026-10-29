/* The homepage owns the welcome; loading a lesson never starts this recording. */
(()=>{'use strict';
 const src=new URL('../vu-tru/assets/titi-welcome.mp3?v=native-1',document.currentScript.src).href;
 let clip=null,home=false,played=false,pending=false,epoch=0,fallback=null;
 const permitted=()=>window.TitiSpaceAudio?.prefs?.sfx!==false;
 function mood(on){document.body.dataset.titiGreeting=on?'playing':'idle';window.TitiSpaceAudio?.duck?.(on);}
 function clearFallback(){fallback?.remove();fallback=null;}
 function stop(){epoch++;pending=false;clip?.pause();clearFallback();mood(false);}
 function offer(){if(!home||played||fallback||!permitted())return;fallback=document.createElement('button');fallback.type='button';fallback.dataset.welcomeAudio='';fallback.textContent='🔊 Welcome to Ms. Trang Trieu Education';Object.assign(fallback.style,{position:'fixed',bottom:'max(12px, env(safe-area-inset-bottom))',left:'50%',transform:'translateX(-50%)',zIndex:'9999',maxWidth:'calc(100vw - 24px)',padding:'12px 18px',borderRadius:'20px',border:'2px solid #ffe49a',background:'#24366b',color:'#fff',font:'700 14px/1.4 system-ui'});fallback.onclick=()=>play();document.body.append(fallback);}
 async function play(force=false){
  if(!home||pending||played&&!force||document.hidden||!permitted())return false;
  clip||=new Audio(src);const recording=clip;recording.preload='auto';recording.onended=()=>{if(recording===clip)mood(false);};recording.onerror=()=>{if(recording===clip){pending=false;mood(false);offer();}};
  const token=epoch;pending=true;clip.currentTime=0;
  try{await recording.play();if(token!==epoch||!home){recording.pause();return false;}played=true;clearFallback();mood(true);return true;}
  catch{if(token===epoch&&home)offer();return false;}
  finally{if(token===epoch)pending=false;}
 }
 function enterHome(){if(home)return;stop();clip=null;home=true;played=false;play();}
 function leaveHome(){home=false;stop();}
 // If the browser denies audible autoplay, only the explicit welcome button
 // retries it. An unrelated navigation click must never trigger the greeting.
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.addEventListener('pagehide',stop);
 window.addEventListener('pageshow',e=>{if(e.persisted&&home){played=false;play();}});
 window.TitiGreeting=Object.freeze({enterHome,leaveHome,play,stop});
})();
