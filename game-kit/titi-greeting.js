/* The homepage owns the welcome; loading a lesson never starts this recording. */
(()=>{'use strict';
 const src=new URL('../vu-tru/assets/titi-welcome.mp3?v=native-1',document.currentScript.src).href;
 const sessionKey='titi-home-welcome-v2';
 const wasPlayed=()=>{try{return sessionStorage.getItem(sessionKey)==='played';}catch{return false;}};
 const gestures=['pointerdown','touchend','click','keydown'];
 let clip=null,home=false,played=wasPlayed(),pending=false,epoch=0,gesture=null;
 const permitted=()=>window.TitiSpaceAudio?.prefs?.sfx!==false;
 function mood(on){document.body.dataset.titiGreeting=on?'playing':'idle';window.TitiSpaceAudio?.duck?.(on);}
 function disarm(){if(!gesture)return;for(const type of gestures)window.removeEventListener?.(type,gesture,true);gesture=null;}
 function stop(){epoch++;pending=false;clip?.pause();disarm();mood(false);}
 function arm(){if(!home||played||gesture||!permitted())return;gesture=()=>{disarm();play();};for(const type of gestures)window.addEventListener(type,gesture,{capture:true,passive:true});}
 async function play(force=false){
  if(!home||pending||played&&!force||!permitted())return false;
  if(document.hidden){arm();return false;}
  clip||=new Audio(src);const recording=clip;recording.preload='auto';recording.onended=()=>{if(recording===clip)mood(false);};recording.onerror=()=>{if(recording===clip){pending=false;mood(false);arm();}};
  const token=epoch;pending=true;clip.currentTime=0;
  try{await recording.play();if(token!==epoch||!home){recording.pause();return false;}played=true;try{sessionStorage.setItem(sessionKey,'played');}catch{}disarm();mood(true);return true;}
  catch{if(token===epoch&&home){pending=false;arm();}return false;}
  finally{if(token===epoch)pending=false;}
 }
 function enterHome(){if(home)return;stop();clip=null;home=true;played=played||wasPlayed();play();}
 function leaveHome(){home=false;stop();}
 // Browsers may deny audible autoplay until the first interaction, so that
 // interaction starts the one greeting of this visit.
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(home&&!played)play();});
 window.addEventListener('pagehide',stop);
 window.addEventListener('pageshow',e=>{if(e.persisted&&home&&!played)play();});
 window.TitiGreeting=Object.freeze({enterHome,leaveHome,play,stop});
})();
