/* Classroom evidence -> game boundaries. Question files remain unchanged. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.ClassroomProgress=factory();})(typeof window==='object'?window:globalThis,()=>{
 'use strict';
 const origin='https://mstrangtrieueducation-droid.github.io';
 function source(value,depth=0){try{const u=new URL(value,origin);if(u.origin!==origin||depth>3)return '';for(const k of ['url','src','lesson','target'])if(/^https?:/.test(u.searchParams.get(k)||'')){const inner=source(u.searchParams.get(k),depth+1);if(inner)return inner;}return u.origin+u.pathname.replace(/\/$/,'');}catch{return '';}}
 function urls(value,result=new Set(),depth=0){if(depth>8)return result;if(typeof value==='string'){for(const match of value.matchAll(/https?:\/\/[^\s<>"']+/g)){const u=source(match[0].replace(/[),.;]+$/,''));if(u)result.add(u);}}else if(Array.isArray(value)){for(const v of value)urls(v,result,depth+1);}else if(value&&typeof value==='object'){for(const [key,v]of Object.entries(value))if(!/token|hash|secret|password|student|feedback|comment/i.test(key))urls(v,result,depth+1);}return result;}
 const normalized=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]/g,'');
 function courseId(value,courses){const s=normalized(value);return courses.find(c=>[c.id,c.name,...(c.id.startsWith('family-friends-')?['Family & Friends '+c.id.slice(-1),'FF'+c.id.slice(-1)]:[]),...(c.id.startsWith('phonics-')?['Oxford Phonics '+c.id.slice(-1),'Oxford Phonics World '+c.id.slice(-1)]:[]),...(c.id.startsWith('discover-')?['Oxford Discover '+c.id.slice(-1)]:[])].some(n=>normalized(n)===s))?.id||'';}
 // Select current books from dated classroom evidence, not catalogue order or
 // the highest level ever studied. Reading and Vocabulary run independently.
 function currentBooks(courses,map,completed){
  const lanes=new Map(),evidence=[];
  for(const row of completed||[]){
   const lesson=row.lesson||row,assignment=row.assignment||{},program=String(row.program||lesson.program||assignment.program||row.courseId||'').trim();
   const date=lesson.lessonDate||lesson.dateLabel||lesson.date||row.lessonDate||assignment.lessonDate;
   const at=moment(date,lesson.endTime||row.endTime||'23:59:59');if(!at||at>Date.now())continue;
   const seen=urls(row),named=courseId(program,courses),matches=[];
   for(const c of courses){for(const l of c.lessons){if([...(map[c.id]?.[l.id]?.sourceGroups||[]),...(map[c.id]?.[l.id]?.programGroups||[]).map(g=>g.urls||[])].some(g=>g.some(u=>seen.has(source(u)))))matches.push({course:c.id,track:l.track||''});}}
   let selected=[];
   if(named&&!(courses.find(c=>c.id===named)?.tracks||[]).length)selected=[{course:named,track:''}];
   else{
    for(const c of courses)for(const t of c.tracks||[])if([t.name,c.name+' '+t.name,t.name.replace('Reading ','Reading Intensive '),t.name.replace('Vocabulary ','Vocabulary Foundation ')].some(n=>normalized(n)===normalized(program)))selected.push({course:c.id,track:t.name});
    if(!selected.length)selected=matches;
   }
   // An explicitly named, unsupported book must not revive a previous book.
   const numbered=program.match(/(?:phonics(?:\s+world)?|discover|family(?:\s+and|\s*&)?\s+friends|ff|reading(?:\s+intensive)?|vocab(?:ulary)?(?:\s+foundation)?)\s*(\d+)/i);
   const unsupported=numbered&&!named&&!selected.some(x=>String((x.track||x.course).match(/\d+$/)?.[0])===numbered[1]);
   if(unsupported)selected=[];
   const lanesFor=selected.length?selected.map(x=>({...x,lane:x.track?normalized(x.track.replace(/\d+/g,'')):'main'})):[{course:'',track:'',lane:/vocab/i.test(program)?'vocabulary':/reading/i.test(program)?'reading':'main'}];
   for(const x of lanesFor){const key=x.lane,previous=lanes.get(key);if(!previous||at>previous.at)lanes.set(key,{at,books:[x]});else if(at===previous.at&&!previous.books.some(b=>b.course===x.course&&b.track===x.track))previous.books.push(x);}
   evidence.push({row,selected});
  }
  const books={};for(const lane of lanes.values())for(const x of lane.books)if(x.course){books[x.course]||=[];if(x.track&&!books[x.course].includes(x.track))books[x.course].push(x.track);}
  const rows=evidence.filter(x=>x.selected.some(b=>Object.hasOwn(books,b.course)&&(!b.track||books[b.course].includes(b.track)))).map(x=>x.row);
  const selectedCourses=courses.filter(c=>Object.hasOwn(books,c.id)),fresh=limits(selectedCourses,map,rows);
  // Old links retained in a current homework row cannot grant retired tracks.
  for(const c of selectedCourses){const ids=new Set(c.lessons.filter(l=>!l.track||books[c.id].includes(l.track)).map(l=>l.id));fresh.allowed[c.id]=fresh.allowed[c.id].filter(id=>ids.has(id));fresh.limits[c.id]=Math.max(0,...fresh.allowed[c.id].map(id=>c.lessons.findIndex(l=>l.id===id)+1));}
  return {...fresh,active:selectedCourses.map(c=>c.id),books};
 }
 function limits(courses,map,completed,explicit={}){
  const seen=urls(completed),active=new Set(),result={},allowed={};
  for(const row of completed||[]){const id=courseId(row.program||row.courseId,courses);if(id)active.add(id);}
   for(const course of courses){allowed[course.id]=[];let limit=0;course.lessons.forEach((l,i)=>{const entry=map[course.id]?.[l.id]||{},groups=entry.sourceGroups||[],program=entry.programGroups||[];const programMatch=program.length>0&&program.every(g=>(g.urls||[]).some(u=>seen.has(source(u)))||(completed||[]).some(row=>{const a={...row,...row.lesson,...row.assignment};const book=courseId(row.program||a.program||row.courseId,courses);if(book!==g.courseId)return false;const title=String(a.title||a.lessonTitle||a.lesson||a.session||'');const session=String(a.session||title).match(/^(?:Tiết|Session|Lesson)\s*0*(\d+)$/i);return normalized(title)===normalized(g.title)||!!session&&Number(session[1])===g.session;}));if(groups.some(g=>g.some(u=>seen.has(source(u))))||programMatch)active.add(course.id);if(groups.length&&groups.every(g=>g.some(u=>seen.has(source(u))))||programMatch){
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
 return {source,urls,courseId,limits,currentBooks,cta,link,moment,completedAssignments};
});
