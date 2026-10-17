/* Classroom evidence -> game boundaries. Question files remain unchanged. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.ClassroomProgress=factory();})(typeof window==='object'?window:globalThis,()=>{
 'use strict';
 const origin='https://mstrangtrieueducation-droid.github.io';
 function source(value,depth=0){try{const u=new URL(value,origin);if(u.origin!==origin||depth>3)return '';for(const k of ['url','src','lesson','target'])if(/^https?:/.test(u.searchParams.get(k)||'')){const inner=source(u.searchParams.get(k),depth+1);if(inner)return inner;}return u.origin+u.pathname.replace(/\/$/,'');}catch{return '';}}
 function urls(value,result=new Set(),depth=0){if(depth>8)return result;if(typeof value==='string'){for(const match of value.matchAll(/https?:\/\/[^\s<>"']+/g)){const u=source(match[0].replace(/[),.;]+$/,''));if(u)result.add(u);}}else if(Array.isArray(value)){for(const v of value)urls(v,result,depth+1);}else if(value&&typeof value==='object'){for(const [key,v]of Object.entries(value))if(!/token|hash|secret|password|student|feedback|comment/i.test(key))urls(v,result,depth+1);}return result;}
 const normalized=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]/g,'');
 function courseId(value,courses){const s=normalized(value);return courses.find(c=>[c.id,c.name,...(c.id.startsWith('family-friends-')?['Family & Friends '+c.id.slice(-1),'FF'+c.id.slice(-1)]:[]),...(c.id.startsWith('phonics-')?['Oxford Phonics '+c.id.slice(-1)]:[])].some(n=>normalized(n)===s))?.id||'';}
 function limits(courses,map,completed,explicit={}){
  const seen=urls(completed),active=new Set(),result={},allowed={};
  for(const row of completed||[]){const id=courseId(row.program||row.courseId,courses);if(id)active.add(id);}
  for(const course of courses){allowed[course.id]=[];let limit=0;course.lessons.forEach((l,i)=>{const groups=map[course.id]?.[l.id]?.sourceGroups||[];if(groups.some(g=>g.some(u=>seen.has(source(u)))))active.add(course.id);if(groups.length&&groups.every(g=>g.some(u=>seen.has(source(u))))){
    // A manual ceiling may restrict classroom evidence, but must never invent it.
    const ceiling=explicit[course.id];if(ceiling!==undefined&&/^(0|[1-9]\d*)$/.test(String(ceiling))&&i>=Number(ceiling))return;
    allowed[course.id].push(l.id);limit=i+1;
   }});
   result[course.id]=limit;
  }
  return {limits:result,allowed,active:[...active]};
 }
 function cta(summary){return summary.limit===0?'🔒 Chờ cô mở bài ôn tập':summary.completed>=summary.limit?`🌟 Đấu Trùm Ôn Tập / Săn đủ 3 Sao Vàng ở Hành tinh số ${summary.last||summary.limit}`:`🚀 Tiếp tục ôn tập · Hành tinh số ${summary.next||summary.completed+1}`;}
 function link(base,course,limit,completed,student){const u=new URL('/vanlang-on-thi-lop-6/vu-tru/',base);u.searchParams.set('course',course);u.searchParams.set('limit',String(limit));u.searchParams.set('focus',String(completed+1));u.searchParams.set('student',student);return u;}
 // Bangkok classroom time, independent of the pupil's phone timezone. A date without
 // a confirmed end time is eligible only after that day ends, never at midnight before class.
 function moment(date,time='23:59:59'){
  const s=String(date||'').trim(),a=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[T ])/),b=s.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})(?:$|\s)/);
  if(!a&&!b)return 0;const [y,m,d]=a?[+a[1],+a[2],+a[3]]:[+b[3],+b[2],+b[1]],t=String(time).match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  const check=new Date(Date.UTC(y,m-1,d));if(!t||+t[1]>23||+t[2]>59||+t[3]>59||check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==d)return 0;
  return Date.UTC(y,m-1,d,+t[1]-7,+t[2],+(t[3]||0));
 }
 function completedAssignments(model,now=Date.now()){
  const list=v=>Array.isArray(v)?v:[],events=list(model?.lessonEvents),cancelled=list(model?.cancelledLessonEvents);
  return list(model?.assignments).filter(a=>{
   if(!a||a.isSelfStudy||a.cancelled||a.status==='cancelled')return false;
   const day=moment(a.lessonDate),start=a.startTime||String(a.lessonTime||'').match(/^\d{1,2}:\d{2}/)?.[0];if(!day)return false;
   if(cancelled.some(e=>moment(e.date)===day&&(!e.startTime||!start||e.startTime===start)))return false;
   const matches=events.filter(e=>moment(e.date)===day&&(!start||!e.startTime||e.startTime===start)&&(!e.session||!a.session||normalized(e.session)===normalized(a.session)));
   if(matches.some(e=>e.cancelled))return false;
   const ends=matches.map(e=>moment(e.date,e.endTime)).filter(Boolean),clock=a.endTime||String(a.lessonTime||'').match(/[-–—]\s*(\d{1,2}:\d{2})/)?.[1];
   const end=ends.length?Math.max(...ends):moment(a.lessonDate,clock||'23:59:59');return end>0&&end<=now;
  });
 }
 return {source,urls,courseId,limits,cta,link,moment,completedAssignments};
});
