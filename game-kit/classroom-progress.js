/* Classroom evidence -> game boundaries. Question files remain unchanged. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.ClassroomProgress=factory();})(typeof window==='object'?window:globalThis,()=>{
 'use strict';
 const origin='https://mstrangtrieueducation-droid.github.io';
 function source(value,depth=0){try{const u=new URL(value,origin);if(u.origin!==origin||depth>3)return '';for(const k of ['url','src','lesson','target'])if(/^https?:/.test(u.searchParams.get(k)||'')){const inner=source(u.searchParams.get(k),depth+1);if(inner)return inner;}return u.origin+u.pathname.replace(/\/$/,'');}catch{return '';}}
 function urls(value,result=new Set(),depth=0){if(depth>8)return result;if(typeof value==='string'){for(const match of value.matchAll(/https?:\/\/[^\s<>"']+/g)){const u=source(match[0].replace(/[),.;]+$/,''));if(u)result.add(u);}}else if(Array.isArray(value)){for(const v of value)urls(v,result,depth+1);}else if(value&&typeof value==='object'){for(const [key,v]of Object.entries(value))if(!/token|hash|secret|password|student|feedback|comment/i.test(key))urls(v,result,depth+1);}return result;}
 const normalized=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]/g,'');
 function courseId(value,courses){const s=normalized(value);return courses.find(c=>[c.id,c.name,...(c.id.startsWith('family-friends-')?['Family & Friends '+c.id.slice(-1),'FF'+c.id.slice(-1)]:[]),...(c.id.startsWith('phonics-')?['Oxford Phonics '+c.id.slice(-1)]:[])].some(n=>normalized(n)===s))?.id||'';}
 function limits(courses,map,completed,explicit={}){
  const seen=urls(completed),active=new Set(),result={};
  for(const row of completed||[]){const id=courseId(row.program||row.courseId,courses);if(id)active.add(id);}
  for(const course of courses){let limit=0;course.lessons.forEach((l,i)=>{const groups=map[course.id]?.[l.id]?.sourceGroups||[];if(groups.some(g=>g.some(u=>seen.has(source(u)))))active.add(course.id);if(groups.length&&groups.every(g=>g.some(u=>seen.has(source(u)))))limit=i+1;});
   // Optional explicit teacher field is a planet count, never a class session count.
   if(Object.prototype.hasOwnProperty.call(explicit,course.id)&&/^(0|[1-9]\d*)$/.test(String(explicit[course.id]))){limit=Math.min(Number(explicit[course.id]),course.lessons.length);active.add(course.id);}
   result[course.id]=limit;
  }
  return {limits:result,active:[...active]};
 }
 function cta(summary){return summary.limit===0?'🔒 Chờ cô mở bài ôn tập':summary.completed>=summary.limit?`🌟 Đấu Trùm Ôn Tập / Săn đủ 3 Sao Vàng ở Hành tinh số ${summary.limit}`:`🚀 Tiếp tục ôn tập · Hành tinh số ${summary.completed+1}`;}
 function link(base,course,limit,completed,student){const u=new URL('/vanlang-on-thi-lop-6/vu-tru/',base);u.searchParams.set('course',course);u.searchParams.set('limit',String(limit));u.searchParams.set('focus',String(completed+1));u.searchParams.set('student',student);return u;}
 return {source,urls,courseId,limits,cta,link};
});
