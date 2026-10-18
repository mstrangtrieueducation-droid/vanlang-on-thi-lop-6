/* One local, pre-rendered voice per annotated role; Titi's voice stays intact. */
(()=>{'use strict';let entries={};
 window.DialogueVoice={
  async install(courseId){
   if(!/^(family-friends-[12]|discover-[1-4])$/.test(courseId))return;
   try{const r=await fetch('../game-kit/adventures/dialogue-audio/'+courseId+'.json?v=cast-1');if(!r.ok)throw Error('Dialogue voices unavailable');entries=(await r.json()).entries;}
   catch(e){console.warn(e.message);}
  },
  resolve(text,item){const value=String(text||'').trim();if(!item||![item.storySpeech,item.storyText,item.scene,item.spokenScene].some(s=>String(s||'').trim()===value))return null;return entries[value]||null;},
  highlight(turn,speaker=''){let label=document.querySelector('.current-speaker');if(speaker&&!label){label=document.createElement('span');label.className='current-speaker';label.setAttribute('role','status');document.querySelector('.question-top')?.append(label);}if(label){label.textContent=speaker?('Speaking: '+speaker):'';label.hidden=!speaker;}document.querySelectorAll('.reading-dialogue .dialogue-turn').forEach(el=>{const active=turn!==null&&Number(el.dataset.turn)===turn&&el.querySelector('.speaker-name')?.textContent===speaker+':';el.classList.toggle('is-speaking',active);if(active)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current');});}
 };
})();
