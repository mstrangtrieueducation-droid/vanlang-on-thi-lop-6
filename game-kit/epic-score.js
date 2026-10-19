/* Original instrumental score: intro → chorus → bridge → accelerating outro. */
(function(root,factory){const score=factory();if(typeof module==='object'&&module.exports){module.exports=score;return;}root.EpicScore=score;
 let ctx,bus,timer,next=0,step=0,unlocked=false,ducked=false;const voices=new Set(),prefs={bgm:true};
 try{Object.assign(prefs,JSON.parse((root.StudentContext?.browserStorage||localStorage).getItem('titi-space-settings-v1')||'{}'));}catch{}
 const hz=n=>440*2**((n-69)/12),gain=()=>ducked?.14:document.querySelector('.play,.playarea,.panorama-hunt')?.32:.62;
 function note(midi,t,length,volume,type='triangle'){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=hz(midi);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(volume,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+length);o.connect(g).connect(bus);o.start(t);o.stop(t+length+.02);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};}
 function drum(t,kick){const o=ctx.createOscillator(),g=ctx.createGain();o.type=kick?'sine':'triangle';o.frequency.setValueAtTime(kick?145:900,t);o.frequency.exponentialRampToValueAtTime(kick?42:180,t+.09);g.gain.setValueAtTime(kick?.075:.012,t);g.gain.exponentialRampToValueAtTime(.0001,t+.13);o.connect(g).connect(bus);o.start(t);o.stop(t+.15);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};}
 function schedule(){if(!prefs.bgm||document.hidden||!unlocked)return;while(next<ctx.currentTime+.16){const f=score.frame(step),beat=step%8;document.body.dataset.musicSection=f.section;bus.gain.value=gain();if(f.melody)note(f.melody,next,f.duration*.85,f.section==='chorus'?.035:.027,'triangle');if(step%2===0){note(f.bass,next,f.duration*1.8,.036,'sine');drum(next,true);}if(step%4===2)drum(next,false);if(step%8===0)for(const n of f.chord)note(n,next,f.duration*6,.008,'triangle');if(f.section==='chorus'&&beat===6)note(f.melody+12,next,.18,.012,'sine');step++;next+=f.duration;}}
 function stop(){clearInterval(timer);timer=null;for(const o of voices){try{o.stop();}catch{}}voices.clear();}
 function start(){if(!unlocked||!prefs.bgm||document.hidden)return;ctx.resume().then(()=>{if(!prefs.bgm||document.hidden)return;if(!timer){next=ctx.currentTime+.04;timer=setInterval(schedule,70);schedule();}}).catch(()=>{});}
 function unlock(){try{ctx||=new(root.AudioContext||root.webkitAudioContext)();if(!bus){bus=ctx.createGain();bus.connect(ctx.destination);}unlocked=true;start();}catch{}}
 function set(on){prefs.bgm=!!on;try{const s=root.StudentContext?.browserStorage||localStorage,p=JSON.parse(s.getItem('titi-space-settings-v1')||'{}');s.setItem('titi-space-settings-v1',JSON.stringify({...p,bgm:prefs.bgm}));}catch{}if(!on)stop();else{unlock();start();}document.querySelectorAll('[data-epic-bgm]').forEach(b=>{b.textContent=on?'♫ Nhạc':'♩ Nhạc';b.setAttribute('aria-pressed',String(on));});}
 root.EpicBGM={unlock,set,stop,duck(on){ducked=!!on;},get enabled(){return prefs.bgm;},get section(){return score.frame(step).section;}};
 document.addEventListener('pointerdown',unlock,{once:true,passive:true});document.addEventListener('keydown',unlock,{once:true});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-epic-bgm]');if(b)set(!prefs.bgm);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();ctx?.suspend();}else start();});root.addEventListener('pagehide',()=>{stop();ctx?.suspend();});
})(globalThis,()=>{
 const sections=[{name:'intro',bars:8,bpm:112},{name:'chorus',bars:16,bpm:128},{name:'bridge',bars:8,bpm:104},{name:'outro',bars:8,bpm:136}];
 const melodies={intro:[74,0,77,81,79,77,76,0,74,77,81,86,84,81,79,0],chorus:[86,81,84,86,89,86,84,81,82,79,82,86,89,86,84,82,81,77,81,84,88,84,81,79,79,74,77,81,86,81,79,77],bridge:[77,0,81,0,79,0,76,0,74,0,77,0,76,0,72,0],outro:[74,77,81,86,84,81,79,77,76,79,82,88,86,84,81,0]};
 const chords=[[50,57,62,65],[46,53,58,62],[48,55,60,64],[45,52,57,61]],length=sections.reduce((n,s)=>n+s.bars*8,0);
 function frame(step){let local=((step%length)+length)%length,section;for(const s of sections){if(local<s.bars*8){section=s;break;}local-=s.bars*8;}const chord=chords[Math.floor(local/8)%4],bpm=section.bpm+(section.name==='outro'?Math.floor(local/8)*2:0);return {section:section.name,bpm,duration:60/bpm/2,melody:melodies[section.name][local%melodies[section.name].length],bass:chord[0]-12,chord:chord.slice(1)};}
 return {sections,length,frame};
});
