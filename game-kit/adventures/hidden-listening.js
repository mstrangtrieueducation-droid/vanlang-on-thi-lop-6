/* One fixed 2D storybook panorama per Unit; narrated prompts and direct visible hotspots. */
(()=>{'use strict';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function open(){
  const c=GAME_CONFIG,g=ADVENTURE,host=document.querySelector('#adventure'),back=new URL(location.href);
  back.searchParams.delete('section');back.searchParams.delete('play');window.FlowBoot?.cancel();
  const [pack,voices]=await Promise.all([
   fetch(`../khoa-hoc/hunt-worlds/${c.courseId}/unit-${g.unit}.json?v=storybook-1`).then(r=>{if(!r.ok)throw Error('Panorama unavailable');return r.json();}),
   fetch('../game-kit/adventures/hunt-audio/worlds-v4.json?v=unit-sounds-5').then(r=>{if(!r.ok)throw Error('Hunt audio unavailable');return r.json();})
  ]);
  if(pack.version!==5||pack.course!==c.courseId||pack.unit!==g.unit||pack.questions.length!==20)throw Error('Invalid panorama pack');
  const sprites=null;let paintedBackground=null;
  const storage=window.StudentContext?.browserStorage||localStorage,key=GameProfile.storageKey+':hunt-worlds-v4',fresh=()=>({version:4,index:0,answers:[],collected:[],missed:false,complete:false,elapsedMs:0,sound:true});
  let state;try{state=JSON.parse(storage.getItem(key));}catch{}
  if(!state||state.version!==4||!Number.isInteger(state.index)||state.index<0||state.index>20)state=fresh();
  state.answers=Array.isArray(state.answers)?state.answers.slice(0,20):[];
  state.collected=Array.isArray(state.collected)?[...new Set(state.collected)].filter(id=>pack.objects.some(o=>o.id===id)):[];
  state.elapsedMs=Math.max(0,Number(state.elapsedMs)||0);
  let active=false,locked=false,epoch=0,lastTick=performance.now(),zoom=1,loaded=false,audioContext,voiceTicket=0,cancelClip,narration=Promise.resolve(true);
  const player=new Audio();player.preload='auto';player.playbackRate=.9;player.preservesPitch=true;
  const save=()=>{try{storage.setItem(key,JSON.stringify(state));}catch{}};
  const current=()=>pack.questions[state.index];
  function stopVoice(){voiceTicket++;player.pause();if(cancelClip){const f=cancelClip;cancelClip=null;f(false);}host.querySelector('#hunt-listen')?.classList.remove('speaking');window.EpicBGM?.duck(false);}
  async function say(text){
   stopVoice();if(!state.sound)return true;window.EpicBGM?.duck(true);
   const ticket=voiceTicket,question=typeof text==='object'?text:null,prompt=question?.sound?(question.sound.instruction||'What letter makes this sound?'):question?.prompt||text,clips=question?.sound?[voices[prompt],{src:question.sound.clip,pauseAfterMs:question.sound.pauseMs},{src:question.sound.clip}]:[voices[prompt]].flat().filter(Boolean);if(!clips.length){status('Chưa tải được tiếng. Chạm loa để thử lại.');return false;}
   host.querySelector('#hunt-listen')?.classList.add('speaking');
   for(const clip of clips){if(ticket!==voiceTicket)return false;const ok=await new Promise(resolve=>{
    let finished=false;const timer=setTimeout(()=>done(false),20000);
    const done=value=>{if(finished)return;finished=true;clearTimeout(timer);player.onended=player.onerror=null;cancelClip=null;resolve(value);};
    cancelClip=done;player.onended=()=>done(true);player.onerror=()=>done(false);const src=typeof clip==='string'?clip:clip.src;player.src=window.GameMedia?.url(src)||src;player.play().catch(()=>done(false));
   });if(!ok||ticket!==voiceTicket){if(ticket===voiceTicket)host.querySelector('#hunt-listen')?.classList.remove('speaking');return false;}if(clip.pauseAfterMs){await new Promise(r=>setTimeout(r,clip.pauseAfterMs));if(ticket!==voiceTicket)return false;}}
   host.querySelector('#hunt-listen')?.classList.remove('speaking');window.EpicBGM?.duck(false);return true;
  }
  function sound(){if(!state.sound)return;try{audioContext||=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();[784,1047,1319].forEach((f,i)=>{const o=audioContext.createOscillator(),v=audioContext.createGain(),t=audioContext.currentTime+i*.07;o.frequency.value=f;o.type='sine';v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(.12,t+.015);v.gain.exponentialRampToValueAtTime(.0001,t+.2);o.connect(v);v.connect(audioContext.destination);o.start(t);o.stop(t+.22);});}catch{}}
  function readQuestion(){narration=say(current());return narration;}
  function status(text){const el=host.querySelector('#hunt-feedback');if(el)el.textContent=text;}
  function settle(){const now=performance.now();if(active)state.elapsedMs+=now-lastTick;lastTick=now;}
  function valid(id){return current().groups.some(group=>group.targets.includes(id)&&state.collected.filter(x=>group.targets.includes(x)).length<group.need);}
  function enough(){return current().groups.every(group=>state.collected.filter(id=>group.targets.includes(id)).length>=group.need);}
  function update(){
   if(state.index>=20){result();return;}
   host.querySelector('#hunt-number').textContent=`${state.index+1}/20`;
   host.querySelector('#hunt-clue').textContent=current().prompt;host.querySelector('#hunt-clue').hidden=true;
   host.querySelector('#hunt-count').textContent=state.collected.length+'/'+current().groups.reduce((n,g)=>n+g.need,0);
   host.querySelectorAll('[data-hotspot]').forEach(b=>{b.classList.toggle('found',state.collected.includes(b.dataset.hotspot));b.setAttribute('aria-pressed',String(state.collected.includes(b.dataset.hotspot)));});
   status('Nghe Titi và chạm vào tranh. Có thể phóng to để tìm kỹ hơn.');
   // Warm only the next few short local clips, rather than the entire audio bank.
   for(const text of [current().prompt,pack.questions[state.index+1]?.prompt,'Great job!','Awesome!'])for(const clip of [voices[text]].flat().filter(Boolean))fetch(window.GameMedia?.url(clip)||clip,{cache:'force-cache'}).catch(()=>{});
  }
  async function paint(){const q=current(),i=state.index;locked=true;if(paintedBackground!==q.background){await HuntWorldRenderer.draw(host.querySelector('.panorama-image'),q,sprites);paintedBackground=q.background;}if(i!==state.index)return;host.querySelectorAll('[data-hotspot]').forEach(b=>{const o=q.objects.find(o=>o.id===b.dataset.hotspot);b.style.cssText=`left:${o.x}%;top:${o.y-o.h*.2}%;width:${o.w}%;height:${o.h*.58}%`;});locked=false;window.TitiImages?.near(pack.questions,i);}
  async function advance(){if(!active||!state.complete)return;state.index++;state.collected=[];state.missed=false;state.complete=false;locked=true;epoch++;save();if(state.index<20){status('Cùng tìm tiếp trong tranh nhé…');try{await paint();update();if(active)readQuestion();}catch(e){pause();status('Chưa tải được cảnh. Chạm Chơi tiếp để thử lại.');}}else result();}
  async function celebrate(){
   locked=true;const token=epoch;status('Great job! ✨');await new Promise(r=>setTimeout(r,450));
   if(current().sound&&!await narration){if(token!==epoch||!active||document.hidden)return;if(!await readQuestion()){if(token===epoch&&active)pause();return;}}
   if(current().sound)sound();
   if(token!==epoch||!active||document.hidden)return;
   sound();const ok=await say(['Great job!','Awesome!','Bingo!'][state.index%3]);
   if(token!==epoch||!active||document.hidden)return;
   // An interrupted clip waits for a user gesture; it never skips a saved answer.
   if(!ok){pause();return;}advance();
  }
  function wrong(b){state.missed=true;save();status('Try again! Chạm loa để nghe lại.');const question=state.index;say('Oh no! Try again!').then(ok=>{if(ok&&active&&!state.complete&&state.index===question)readQuestion();});if(b){b.classList.add('hunt-wrong');setTimeout(()=>b.classList.remove('hunt-wrong'),400);}}
  function choose(b){
   if(!active||locked)return;const id=b.dataset.hotspot;if(state.collected.includes(id))return;
   if(!valid(id)){wrong(b);return;}
   state.collected.push(id);b.classList.add('found');b.setAttribute('aria-pressed','true');if(!current().sound)sound();
   host.querySelector('#hunt-count').textContent=state.collected.length+'/'+current().groups.reduce((n,g)=>n+g.need,0);
   if(enough()){state.answers[state.index]=!state.missed;state.complete=true;save();celebrate();}else{save();status('Keep looking! ✨');}
  }
  function resize(fit=false){
   const camera=host.querySelector('.panorama-camera'),canvas=host.querySelector('.panorama-canvas');if(!camera||!canvas)return;
   const ratio=pack.imageWidth/pack.imageHeight,base=Math.max(280,Math.min(camera.clientWidth,camera.clientHeight*ratio));
   if(fit)zoom=1;else if(!loaded&&innerWidth<700)zoom=Math.max(1,Math.max(900,camera.clientHeight*ratio)/base);
   const width=Math.min(2800,Math.max(280,base*zoom));canvas.style.width=width+'px';canvas.style.marginTop=Math.max(0,(camera.clientHeight-width/ratio)/2)+'px';
  }
  function pause(){settle();active=false;epoch++;stopVoice();save();const layer=host.querySelector('.hunt-start-layer');if(layer){layer.hidden=false;layer.querySelector('button').textContent='▶ Chơi tiếp';}locked=false;}
  function begin(){if(!loaded||locked)return;lastTick=performance.now();active=true;host.querySelector('.hunt-start-layer').hidden=true;sound();if(state.complete)advance();else readQuestion();}
  function result(){settle();active=false;epoch++;stopVoice();save();const seconds=Math.round(state.elapsedMs/1000);
   host.className='hidden-hunt panorama-result';host.innerHTML=`<section class="hunt-result"><h1>Treasure found! 🏆</h1><p>${state.answers.filter(Boolean).length}/20 · ${Math.floor(seconds/60)} phút ${seconds%60} giây</p><p>Con đã tìm đồ vật, màu sắc, số lượng, chữ cái và âm trong tranh!</p><a href="${esc(back.href)}">← Unit Review</a><button id="hunt-again">Chơi lại</button></section>`;
   host.querySelector('#hunt-again').onclick=()=>{storage.removeItem(key);location.reload();};
  }
  if(state.index>=20){result();return false;}
  host.className='hidden-hunt panorama-hunt';
  host.innerHTML=`<header class="hunt-top"><a href="${esc(back.href)}">← Unit Review</a><h1>Picture Explorer · Unit ${pack.unit} · ${esc(pack.scene.title)}</h1><b id="hunt-number"></b><button data-epic-bgm aria-label="Toggle music" aria-pressed="${window.EpicBGM?.enabled!==false}">♫</button><button id="hunt-sound" aria-label="Toggle sound">${state.sound?'🔊':'🔇'}</button></header><div class="time-track">${RocketTimer.markup(Math.min(99,state.elapsedMs/6000),'Listening adventure').replace('rocket-timer ','rocket-timer rocket-tracker ')}</div><div class="hunt-instruction"><button id="hunt-listen" aria-label="Replay the challenge">🔊 Nghe lại</button><span id="hunt-feedback" role="status"></span><button id="hunt-reveal">Gợi ý chữ</button><p id="hunt-clue" hidden></p></div><div class="hunt-view-tools"><span>Chạm đồ vật trong tranh · Phóng to và vuốt để quan sát</span><button id="hunt-smaller" aria-label="Zoom out">−</button><button id="hunt-fit">Toàn tranh</button><button id="hunt-bigger" aria-label="Zoom in">+</button></div><div class="panorama-camera" aria-label="Panoramic hidden-object scene"><div class="panorama-canvas"><canvas class="panorama-image" width="1672" height="941" role="img" aria-label="Khung cảnh tìm đồ vật Unit ${pack.unit}"></canvas>${pack.objects.map((o,i)=>`<button type="button" class="panorama-hotspot" data-hotspot="${esc(o.id)}" aria-label="Vùng tranh ${i+1}" aria-pressed="false" style="left:${o.x}%;top:${o.y}%;width:${o.w}%;height:${o.h}%"><span aria-hidden="true">✓</span></button>`).join('')}</div><div class="hunt-start-layer"><button disabled>Đang mở tranh…</button></div></div><footer>Đã tìm <b id="hunt-count"></b> · Tiến độ luyện nghe lưu riêng trên thiết bị.</footer>`;
  host.querySelectorAll('[data-hotspot]').forEach(b=>b.onclick=()=>choose(b));
  try{await paint();resize();loaded=true;const start=host.querySelector('.hunt-start-layer button');start.disabled=false;start.textContent=state.index||state.collected.length?'▶ Chơi tiếp':'▶ Bắt đầu khám phá';}catch(e){status('Chưa tải được tranh. Con tải lại trang nhé.');throw e;}
  host.querySelector('.hunt-start-layer button').onclick=begin;
  host.querySelector('.panorama-canvas').onclick=e=>{if(e.target.classList.contains('panorama-canvas')){if(active&&!locked)wrong();}};
  host.querySelector('#hunt-listen').onclick=()=>{if(!active){begin();return;}if(state.complete){if(current().sound&&locked)return;stopVoice();epoch++;advance();}else readQuestion();};
  host.querySelector('#hunt-sound').onclick=e=>{state.sound=!state.sound;e.currentTarget.textContent=state.sound?'🔊':'🔇';if(!state.sound)stopVoice();save();if(active){if(state.complete){epoch++;advance();}else if(state.sound)readQuestion();}};
  host.querySelector('#hunt-reveal').onclick=()=>host.querySelector('#hunt-clue').hidden=false;
  host.querySelector('#hunt-smaller').onclick=()=>{zoom=Math.max(.5,zoom/1.25);resize();};host.querySelector('#hunt-bigger').onclick=()=>{zoom=Math.min(8,zoom*1.25);resize();};host.querySelector('#hunt-fit').onclick=()=>resize(true);
  const onResize=()=>resize(),onVisibility=()=>{if(document.hidden&&active)pause();},onHide=()=>{if(active)pause();};
  window.addEventListener('resize',onResize);document.addEventListener('visibilitychange',onVisibility);window.addEventListener('pagehide',onHide);
  update();resize();
  const clock=setInterval(()=>{if(!host.isConnected||!host.classList.contains('panorama-hunt')){clearInterval(clock);window.removeEventListener('resize',onResize);document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('pagehide',onHide);stopVoice();audioContext?.close();return;}settle();host.querySelectorAll('.rocket-timer').forEach(el=>RocketTimer.update(el,Math.min(99,state.elapsedMs/6000)));},250);
  return false;
 }
 window.HiddenListening={open};
})();
