/* One local native US child voice recording, shared across home and lesson lobbies. */
(()=>{'use strict';const src=new URL('../vu-tru/assets/titi-welcome.mp3?v=native-1',document.currentScript.src).href,clip=new Audio(src);clip.preload='none';let played=false;
 const key='titi-welcome-native-1:'+(new URLSearchParams(location.search).get('visit')||'preview');try{played=sessionStorage.getItem(key)==='1';}catch{}
 function mood(on){document.body.dataset.titiGreeting=on?'playing':'idle';window.TitiSpaceAudio?.duck?.(on);}
 function stop(){clip.pause();mood(false);}
 function play(force=false){if(played&&!force||document.querySelector('.play,.hidden-hunt')||window.TitiSpaceAudio?.prefs.sfx===false)return;try{if(!window.TitiSpaceAudio&&JSON.parse(window.StudentContext?.browserStorage?.getItem('titi-space-settings-v1')||'{}').sfx===false)return;}catch{}played=true;if(force)clip.currentTime=0;clip.play().then(()=>{mood(true);try{sessionStorage.setItem(key,'1');}catch{}}).catch(()=>{played=false;});}
 clip.onended=()=>mood(false);clip.onerror=()=>{played=false;mood(false);};

 // Try on entry, including a fresh document in the same session. Browser policy
 // can reject audible autoplay; expose an explicit accessible fallback then.
 let fallback=null,stopped=false;const originalPlay=clip.play.bind(clip);clip.preload='auto';
 clip.play=()=>originalPlay().then(v=>{fallback?.remove();fallback=null;return v;}).catch(error=>{if(error.name==='NotAllowedError'&&!stopped&&!fallback){fallback=document.createElement('button');fallback.type='button';fallback.dataset.welcomeAudio='';fallback.textContent='🔊 Welcome to Ms. Trang Trieu Education';Object.assign(fallback.style,{position:'fixed',bottom:'max(12px, env(safe-area-inset-bottom))',left:'50%',transform:'translateX(-50%)',zIndex:'9999',maxWidth:'calc(100vw - 24px)',padding:'12px 18px',borderRadius:'20px',border:'2px solid #ffe49a',background:'#24366b',color:'#fff',font:'700 14px/1.4 system-ui'});fallback.onclick=()=>play(true);document.body.append(fallback);}throw error;});
 document.addEventListener('pointerdown',()=>{if(!stopped)play();});document.addEventListener('keydown',()=>{if(!stopped)play();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);window.TitiGreeting={play,stop(){stopped=true;fallback?.remove();fallback=null;stop();}};played=false;play();
})();
