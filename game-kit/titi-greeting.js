/* One local native US child voice recording, shared across home and lesson lobbies. */
(()=>{'use strict';const src=new URL('../vu-tru/assets/titi-welcome.mp3?v=native-1',document.currentScript.src).href,clip=new Audio(src);clip.preload='none';let played=false;
 const key='titi-welcome-native-1:'+(new URLSearchParams(location.search).get('visit')||'preview');try{played=sessionStorage.getItem(key)==='1';}catch{}
 function mood(on){document.body.dataset.titiGreeting=on?'playing':'idle';window.TitiSpaceAudio?.duck?.(on);}
 function stop(){clip.pause();mood(false);}
 function play(force=false){if(played&&!force||document.querySelector('.play')||window.TitiSpaceAudio?.prefs.sfx===false)return;try{if(!window.TitiSpaceAudio&&JSON.parse(window.StudentContext?.browserStorage?.getItem('titi-space-settings-v1')||'{}').sfx===false)return;}catch{}played=true;if(force)clip.currentTime=0;clip.play().then(()=>{mood(true);try{sessionStorage.setItem(key,'1');}catch{}}).catch(()=>{played=false;});}
 clip.onended=()=>mood(false);clip.onerror=()=>{played=false;mood(false);};

 document.addEventListener('pointerdown',()=>play(),{once:true});document.addEventListener('keydown',()=>play(),{once:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);window.TitiGreeting={play,stop};
})();
