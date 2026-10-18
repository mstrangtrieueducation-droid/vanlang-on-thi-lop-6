/* Mirror progress into a per-course index without replacing existing saves. */
(()=>{'use strict';const c=window.GAME_CONFIG;if(!c?.courseId||!window.GalaxyCore)return;const core=window.GalaxyCore,p=window.GameProfile,storage=window.StudentContext?.browserStorage||{getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)},params=new URLSearchParams(location.search);
 const ui=document.createElement('script');ui.src='../vu-tru/journey-ui.js?v=profile-1';document.body?.append(ui);
 const get=()=>core.load(storage,c.courseId,p);let data=get();
 const incoming=params.get('galaxy');if(core.themes.includes(incoming))data.theme=incoming;
 const theme=data.theme||core.theme({id:c.courseId,name:c.brand});document.documentElement.dataset.galaxy=theme;document.documentElement.dataset.courseWorld=c.courseId;document.documentElement.dataset.courseRoad=window.CourseWorld?.kind({id:c.courseId})||'forest';document.documentElement.style.setProperty('--course-world-art','url("../vu-tru/assets/'+encodeURIComponent(c.courseId)+'.webp")');
 const link=document.createElement('link');link.rel='stylesheet';link.href='../vu-tru/lesson-theme.css?v=flow-1';document.head.append(link);
 function journey(){const u=new URL('../vu-tru/',location.href);for(const key of ['release','mtt_name','mtt_class','mtt_english','track','student','limit','focus'])if(params.has(key))u.searchParams.set(key,params.get(key));u.searchParams.set('course',c.courseId);u.searchParams.set('lesson',c.lessonId||c.id);if(p){u.searchParams.set('mtt_name',p.name);u.searchParams.set('mtt_class',p.className);if(p.displayName!==p.name)u.searchParams.set('mtt_english',p.displayName);}window.StudentContext?.decorate(u,StudentContext.active,c.courseId);return u.href;}
 if(params.get('from')==='universe'||window.StudentContext?.active)c.journeyUrl=journey();
 window.GalaxyBridge={
 record(state,run,finished=false){if(c.supplementalGrammar)return true;data=get();const id=c.lessonId||c.id,old=data.lessons[id]||{},summary=run&&window.GameResults?window.GameResults.summarize(run):null;data.theme=theme;data.lessons[id]={...old,done:state.done.length,total:window.ADVENTURE.items.length,stars:Math.max(Number(old.stars)||0,finished&&!run?.practice&&summary?.answered===window.ADVENTURE.items.length&&summary?.total===window.ADVENTURE.items.length?summary.stars:0),updatedAt:Date.now(),...(finished?{[run?.practice?'lastReview':'lastResult']:summary}:{})};if(window.JourneyCore&&summary)JourneyCore.record(data,c.courseId,id,summary,finished,!!run?.practice);const saved=core.save(storage,c.courseId,p,data);window.dispatchEvent?.(new Event('titi-journey-update'));return saved;},
 reward(id){if(c.supplementalGrammar)return false;return core.reward(storage,c.courseId,p,'bonus-'+(c.lessonId||c.id)+'-'+id,10);},
 getMode(){return get().gameplayMode==='standard'?'standard':'game';},
 setMode(mode){const d=get();d.gameplayMode=mode;core.save(storage,c.courseId,p,d);},journey
 };
})();
