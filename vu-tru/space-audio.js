/* Original, synthesized adventure music. No downloads or autoplay workaround. */
(()=>{'use strict';const store=window.StudentContext?.browserStorage;let ctx,bus,timer,next=0,beat=0,unlocked=false;
 const prefs={bgm:true,sfx:true,light:'day'};try{Object.assign(prefs,JSON.parse(store?.getItem('titi-space-settings-v1')||'{}'));}catch{}
 function save(){try{store?.setItem('titi-space-settings-v1',JSON.stringify(prefs));}catch{}document.body.dataset.worldLight=prefs.light;window.dispatchEvent(new Event('titi-space-settings'));}
 function note(freq,time,duration,volume=.04,type='sine'){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.015);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g).connect(bus);o.start(time);o.stop(time+duration+.02);}
 // Four playful phrases, a walking bass and soft bell accents at 112 BPM.
 const tune=[72,76,79,76,81,79,76,74,72,74,76,79,74,0,67,0,69,72,76,72,77,76,72,71,69,71,72,76,71,0,67,0,65,69,72,76,77,76,72,69,67,71,74,79,77,74,71,67,72,76,79,84,81,79,76,74,72,0,79,0,76,74,72,0];
 const hz=n=>440*Math.pow(2,(n-69)/12);
 function schedule(){if(!prefs.bgm||document.hidden||!unlocked)return;while(next<ctx.currentTime+.18){const n=tune[beat%tune.length];if(n)note(hz(n),next,.22,.027,'triangle');if(beat%4===0){const bass=[48,45,53,55][Math.floor(beat/16)%4];note(hz(bass),next,.38,.035,'sine');note(hz(bass+12),next+.13,.18,.015,'sine');}if(beat%8===6)note(hz(91),next,.12,.009);beat++;next+=60/112/2;}}
 function stop(){clearInterval(timer);timer=null;ctx?.suspend();}
 function start(){if(!unlocked||document.hidden)return;ctx.resume().then(()=>{if(!prefs.bgm||document.hidden)return;if(!timer){next=ctx.currentTime+.04;timer=setInterval(schedule,80);schedule();}}).catch(()=>{});}
 function unlock(){try{if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();bus=ctx.createGain();bus.gain.value=.8;bus.connect(ctx.destination);}unlocked=true;start();}catch{}}
 window.TitiSpaceAudio={prefs,unlock,duck(on){if(bus)bus.gain.value=on ? .22 : .8;},toggle(kind){prefs[kind]=!prefs[kind];if(kind==='sfx'&&!prefs.sfx)window.TitiGreeting?.stop();save();unlock();if(kind==='bgm'&&!prefs.bgm){clearInterval(timer);timer=null;}},light(){prefs.light=prefs.light==='day'?'night':'day';save();},fx(kind){if(!prefs.sfx||!unlocked)return;unlock();if(!ctx)return;ctx.resume().then(()=>{const seq=kind==='warp'?[110,220,440,880]:kind==='reward'?[523,659,784,1046]:[440,660];seq.forEach((f,i)=>note(f,ctx.currentTime+i*.065,.16,.045,'sine'));}).catch(()=>{});}};
 document.body.dataset.worldLight=prefs.light;
 document.addEventListener('pointerdown',unlock,{once:true});document.addEventListener('keydown',unlock,{once:true});document.addEventListener('visibilitychange',()=>document.hidden?stop():start());window.addEventListener('pagehide',stop);
})();
