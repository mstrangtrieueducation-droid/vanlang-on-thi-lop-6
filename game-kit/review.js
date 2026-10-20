/* Public staff preview, explicitly separate from pupil admission and cloud records. */
(()=>{'use strict';if(new URLSearchParams(location.search).get('review')!=='1')return;
 const C=window.StudentContext,ctx={review:true,entered:true,course:new URLSearchParams(location.search).get('course')||'van-lang',focus:1,name:'Cô và đội ngũ',displayName:'Cô và đội ngũ',className:'REVIEW',student:'',books:{},allowed:{},limits:{}};
 const original={...C};C.active=ctx;C.current=c=>c?.review===true||original.current(c);C.resolve=()=>ctx;C.visible=course=>course.lessons;C.taught=course=>course.lessons;C.status=()=>({open:true,reason:'',kind:'review'});C.focus=()=>0;C.dashboard=()=>null;C.store=()=>false;C.suffix=()=>':review';
 C.decorate=(u,c,course)=>{for(const k of ['student','limit','focus','visit','entry','mtt_name','mtt_class','mtt_english'])u.searchParams.delete(k);u.searchParams.set('review','1');if(course)u.searchParams.set('course',course);return u;};
 C.summary=(course,p)=>{const completed=course.lessons.filter(l=>(p?.lessons?.[l.id]?.stars||0)>=1).length,next=course.lessons.findIndex(l=>!(p?.lessons?.[l.id]?.stars>=1));return {completed,limit:course.lessons.length,last:course.lessons.length,next:next<0?1:next+1,stardust:0,stars:0};};
 const ready=fetch(new URL('../vu-tru/catalog.json?v=listening-3',document.currentScript.src)).then(r=>{if(!r.ok)throw Error();return r.json();}).then(courses=>{for(const c of courses){ctx.books[c.id]=c.tracks.map(t=>t.name);ctx.allowed[c.id]=c.lessons.map(l=>l.id);ctx.limits[c.id]=c.lessons.length;}return ctx;});
 window.TitiReview={active:true,ready};ready.catch(()=>{});
})();
