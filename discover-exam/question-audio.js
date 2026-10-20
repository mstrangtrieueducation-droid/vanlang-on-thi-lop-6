/* Original source audio, one numbered item at a time. Scoring and fields are unchanged. */
(()=>{'use strict';const player=new Audio();player.preload='metadata';let api=null,part=null,abort=null,ticket=0,timer=0,resolveClip=null;
 function stop(){ticket++;clearTimeout(timer);player.pause();player.onended=player.onerror=null;resolveClip?.(false);resolveClip=null;window.EpicBGM?.duck(false);}
 function active(){return !!api&&!!part&&!api.state.submitted&&!api.state.writingStarted;}
 function row(q){return api.host.querySelector('#exam-'+CSS.escape(q.id));}
 function current(){const id=api.state.listeningQuestions?.[api.state.part];return api.section.questions.find(q=>q.id===id)||api.section.questions[0];}
 function filled(q){return api.C.fields(q).every(f=>String(api.state.answers[api.C.key(q,f)]||'').trim());}
 function note(text){api?.host.querySelector('[data-status]')?.replaceChildren(document.createTextNode(text));}
 function progress(){if(!api)return;const p=api.host.querySelector('[data-audio-progress]'),o=api.host.querySelector('[data-audio-time]');if(p){p.max=Number.isFinite(player.duration)?player.duration:1;p.value=player.currentTime||0;}if(o){const t=player.currentTime||0,d=Number.isFinite(player.duration)?player.duration:0;o.textContent=Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')+' / '+Math.floor(d/60)+':'+String(Math.floor(d%60)).padStart(2,'0');}}
 async function clip(src,epoch,onStart){if(epoch!==ticket)return false;window.EpicBGM?.duck(true);player.src=src;return new Promise(resolve=>{let ended=false;const finish=ok=>{if(ended)return;ended=true;resolveClip=null;player.onended=player.onerror=null;window.EpicBGM?.duck(false);resolve(ok);};resolveClip=finish;player.onended=()=>finish(true);player.onerror=()=>{note('Chưa tải được tiếng. Con chạm Listen để thử lại.');finish(false);};player.play().then(()=>{if(epoch===ticket)onStart?.();else finish(false);}).catch(()=>{note('Chạm Listen để bắt đầu nghe.');finish(false);});});}
 async function play(instructionOnly=false){if(!active())return;api.beforePlay();stop();const epoch=ticket,q=current(),id=api.state.part+':'+q.id;api.state.heardListeningParts||={};api.state.questionPlays||={};
  if(instructionOnly||!api.state.heardListeningParts[api.state.part]){const ok=await clip(part.instruction,epoch,()=>{api.state.heardListeningParts[api.state.part]=true;api.save();});if(!ok||epoch!==ticket||instructionOnly)return;}
  if((api.state.questionPlays[id]||0)>=api.maxPlays){note('Con đã nghe đủ số lượt của câu này. Có thể tiếp tục làm bài.');return;}
  const src=part.questions[q.id]?.src;if(!src){note('Đoạn nghe của câu này chưa tải được. Con thử lại nhé.');return;}
  api.host.querySelector('[data-audio]').textContent='Ⅱ Listening';await clip(src,epoch,()=>{api.state.questionPlays[id]=(api.state.questionPlays[id]||0)+1;api.save();const count=api.host.querySelector('[data-plays]');if(count)count.textContent=api.state.questionPlays[id];});
  if(epoch===ticket){const b=api.host.querySelector('[data-audio]');if(b)b.textContent='▶ Listen again';}
 }
 function toggle(){if(!active())return;if(!player.paused){player.pause();window.EpicBGM?.duck(false);api.host.querySelector('[data-audio]').textContent='▶ Continue';return;}if(player.currentTime>0&&!player.ended){player.play().then(()=>{window.EpicBGM?.duck(true);api.host.querySelector('[data-audio]').textContent='Ⅱ Listening';}).catch(()=>note('Chạm Listen để thử lại.'));return;}play();}
 function select(q,scroll=true){if(!active())return;stop();api.state.listeningQuestions||={};api.state.listeningQuestions[api.state.part]=q.id;api.save();for(const x of api.section.questions){const el=row(x);el?.classList.toggle('listening-current',x.id===q.id);el?.setAttribute('aria-current',String(x.id===q.id));}const n=api.host.querySelector('[data-plays]');if(n)n.textContent=api.state.questionPlays?.[api.state.part+':'+q.id]||0;if(scroll)row(q)?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});const i=api.section.questions.indexOf(q);for(const next of api.section.questions.slice(i+1,i+3)){const src=part.questions[next.id]?.src;if(src)fetch(src,{cache:'force-cache'}).catch(()=>{});}play();}
 function complete(q){if(!active()||!filled(q))return;clearTimeout(timer);const epoch=ticket;timer=setTimeout(()=>{if(!active()||epoch!==ticket||current().id!==q.id)return;const all=api.section.questions,i=all.indexOf(q),next=all.slice(i+1).find(x=>!filled(x))||all.slice(0,i).find(x=>!filled(x));if(next)select(next);else api.nextPart();},700);}
 function mount(options){stop();abort?.abort();api=options;part=options.pack?.parts.find(p=>p.test===options.testId&&p.sectionIndex===options.state.part);if(!active())return;abort=new AbortController();const signal=abort.signal;api.section=options.sections[options.state.part];
  const q=api.section.questions.find(q=>q.id===api.state.listeningQuestions?.[api.state.part])||api.section.questions.find(q=>!filled(q))||api.section.questions[0];
  const find=target=>{const el=target.closest?.('.exam-question');return api.section.questions.find(q=>'exam-'+q.id===el?.id);};
  api.host.addEventListener('focusin',e=>{const q=find(e.target);if(q&&q.id!==current().id)select(q,false);},{signal});
  api.host.addEventListener('click',e=>{const q=find(e.target);if(q&&e.target.closest('[data-answer]')){if(q.id!==current().id)select(q,false);complete(q);}},{signal});
  api.host.addEventListener('change',e=>{const q=find(e.target);if(q&&e.target.matches('[data-input]'))complete(q);},{signal});
  api.host.addEventListener('keydown',e=>{const q=find(e.target);if(q&&e.key==='Enter'&&e.target.matches('[data-input]')){e.preventDefault();complete(q);}},{signal});
  const button=document.createElement('button');button.type='button';button.textContent='🔊 Hướng dẫn';button.onclick=()=>play(true);api.host.querySelector('.exam-audio')?.append(button);
  note('Nghe từng câu. Chọn đáp án hoặc nhấn Enter sau khi điền để chuyển tiếp.');select(q,false);
 }
 player.ontimeupdate=progress;player.onloadedmetadata=progress;addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.ExamQuestionAudio={mount,stop,play,toggle,active};
})();
