/* Explicit user activation only. Source recordings first; native English fallback. */
(()=>{'use strict';let player=null,ticket=0;
 function stop(){ticket++;player?.pause();window.speechSynthesis?.cancel();window.EpicBGM?.duck(false);}
 async function play(text,q={}){stop();window.dispatchEvent(new Event('titi-manual-narration'));window.EpicBGM?.duck(true);const turn=ticket,raw=q.sourceAudio||window.VanLangAudio?.[text]||window.DialogueVoice?.resolve(text,q)?.map(x=>x.src)||window.TitiVoice?.lookup(text),clips=(Array.isArray(raw)?raw:[raw]).filter(Boolean);if(clips.length){for(const src of clips){if(turn!==ticket)return;player=new Audio(src);await new Promise(resolve=>{player.onended=resolve;player.onerror=resolve;player.play().catch(resolve);});}if(turn===ticket)window.EpicBGM?.duck(false);return;}
 const voices=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));if(!voices.length){window.EpicBGM?.duck(false);window.dispatchEvent(new CustomEvent('titi-audio-unavailable'));return;}const u=new SpeechSynthesisUtterance(String(text||'').replace(/_{2,}/g,' … '));u.voice=voices.find(v=>/female|samantha|aria|jenny|ana/i.test(v.name))||voices[0];u.lang=u.voice.lang;u.rate=.95;u.onend=u.onerror=()=>{if(turn===ticket)window.EpicBGM?.duck(false);};speechSynthesis.speak(u);}
 window.ManualAudio={play,stop};addEventListener('pagehide',stop);
})();
