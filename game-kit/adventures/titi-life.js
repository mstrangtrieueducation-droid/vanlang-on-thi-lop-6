(function(root){
 'use strict';
 // Pure decision rule, shared by the browser and the idle-state tests.
 function pose(s){
  if(s.hidden||s.overlay||s.reacting||s.solved)return 'rest';
  if(s.speaking)return 'speaking';
  if(!s.quiz||s.elapsed<5000)return 'welcome';
  return ['thinking','stepping','curious'][Math.floor((s.elapsed-5000)/3500)%3];
 }
 if(typeof module==='object'&&module.exports){module.exports={pose};return;}
 let context,unlocked=false,enabled=false,lastInput=performance.now(),lastMascot=null,nextTune=0;
 let notes=[];
 const classes=['life-thinking','life-stepping','life-curious','life-speaking'];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function stopMusic(){for(const n of notes){try{n.stop();}catch{}}notes=[];nextTune=0;document.body.classList.remove('titi-humming');}
 function unlock(){
  // WebKit #237322: iOS 17+ can route Web Audio through the media playback channel.
  try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
  try{
   context||=new(window.AudioContext||window.webkitAudioContext)();
   const resume=context.resume();resume?.catch(()=>{});
   // iOS requires starting a source during the actual tap, before any countdown timeout.
   const buffer=context.createBuffer(1,1,context.sampleRate),source=context.createBufferSource();
   source.buffer=buffer;source.connect(context.destination);source.start(0);
   unlocked=true;return context;
  }catch{return null;}
 }
 function tune(humming){
  if(!context||context.state!=='running')return;
  const song=[392,494,587,659,587,494,440,392];
  song.forEach((hz,i)=>{
   const t=context.currentTime+i*.48,o=context.createOscillator(),g=context.createGain();
   o.type=humming?'sine':'triangle';o.frequency.value=humming?hz/2:hz;
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(humming?.024:.011,t+.09);g.gain.exponentialRampToValueAtTime(.0001,t+.46);
   o.connect(g);g.connect(context.destination);o.start(t);o.stop(t+.48);notes.push(o);
   o.onended=()=>{o.disconnect();g.disconnect();notes=notes.filter(n=>n!==o);};
  });
  document.body.classList.toggle('titi-humming',humming);
 }
 let tuneCount=0;
 function tick(){
  const mascot=document.querySelector('.teacher-fox'),quiz=!!document.querySelector('.play');
  if(mascot!==lastMascot){lastMascot=mascot;lastInput=performance.now();}
  const overlay=!!document.querySelector('.overlay'),hidden=document.hidden;
  const sound=document.querySelector('#sound');
  const muted=sound?sound.getAttribute('aria-pressed')==='false':!enabled;
  const s={hidden,overlay,quiz,reacting:!!mascot?.classList.contains('reacting'),solved:quiz&&document.querySelector('#next')?.disabled===false,speaking:document.body.dataset.titiSpeaking==='true',elapsed:performance.now()-lastInput};
  const next=pose(s);
  if(mascot){
   const className='life-'+next;
   for(const c of classes)mascot.classList.toggle(c,c===className&&!reduced.matches);
   mascot.dataset.idleState=next;
  }
  const waiting=!!document.querySelector('.pre-game,.journey');
  if(hidden||overlay||quiz||muted||!waiting){if(notes.length)stopMusic();return;}
  if(unlocked&&performance.now()>=nextTune){nextTune=performance.now()+12000;tune(++tuneCount%3===0);}
 }
 function activity(){lastInput=performance.now();unlock();}
 document.addEventListener('pointerdown',activity,{passive:true});
 document.addEventListener('keydown',activity);
 document.addEventListener('visibilitychange',()=>{lastInput=performance.now();if(document.hidden)stopMusic();tick();});
 addEventListener('pagehide',()=>{stopMusic();try{if(navigator.audioSession)navigator.audioSession.type='auto';}catch{}});
 function init(){
  const b=document.querySelector('#journey-sound');
  if(b)b.onclick=()=>{enabled=!enabled;b.setAttribute('aria-pressed',String(enabled));b.textContent=enabled?'♫ Nhạc chờ':'♩ Tắt nhạc';if(enabled)unlock();else stopMusic();};
  tick();setInterval(tick,250);
 }
 root.TitiLife={unlock,stopMusic,pose};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(typeof window==='object'?window:globalThis);
