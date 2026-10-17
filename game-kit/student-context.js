/* Classroom access comes from the authorized dashboard, never from URL limits.
   Browser-local curriculum guidance; not a substitute for server authorization. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else{root.StudentContext=api;const storage={getItem:k=>root.localStorage.getItem(k),setItem:(k,v)=>root.localStorage.setItem(k,v),removeItem:k=>root.localStorage.removeItem(k)};api.active=api.resolve(root.location.search,storage);if(api.active?.entered&&new URLSearchParams(root.location.search).has('entry')){const u=new URL(root.location.href);u.searchParams.delete('entry');u.searchParams.set('visit',api.active.visit);root.history.replaceState(root.history.state,'',u);}}})(typeof window==='object'?window:globalThis,()=>{
 'use strict';
 const ROUTES={"KIDS39":"/1t5tlkn7/","KIDS30":"/31wagboo/","KIDS23":"/3lu0698p/","KIDS35":"/63habmwz/","TA6":"/6shx6heb/","IELTS45":"/7rsn6kbh/","KIDS29":"/9fpwzhnz/","IELTS49":"/9k6a4bxe/","IELTS47":"/bhg37bsz/","KIDS8":"/byogxkvy/","FIGHTER8":"/cecccjpg/","KIDS14":"/chaq17fk/","KIDS37":"/d5f9almb/","FIGHTER7":"/dgpu6c9h/","IELTS48":"/e73wgva4/","KIDS33":"/firegh4f/","KIDS17":"/gu159u7j/","FIGHTER6":"/hwz7zw86/","KIDS26":"/i8a0r77q/","KIDS10":"/iw6h6bmb/","IELTS50":"/jbjdsuj7/","KIDS31":"/juzwewi0/","KIDS20":"/l8tzmx20/","KIDS22":"/muqt11rj/","KIDS25":"/myude9i0/","IELTS51":"/np93vg0b/","KIDS36":"/odwhkat1/","KIDS38":"/p8qdzsoa/","FIGHTER9":"/p8w8wz4f/","TA7":"/qhaj55f2/","KIDS27":"/qo7alz0y/","KIDS11":"/r60hdc1i/","KIDS21":"/rge9fi0s/","IELTS52":"/t2n2eyyu/","KIDS34":"/u1g9ay98/","KIDS7":"/u90k1f5e/","KIDS18":"/uee89ho9/","KIDS32":"/wfyjrm4m/","KIDS28":"/xcxhducu/","IELTS46":"/xpe6dd4j/","KIDS15":"/y31ibppw/","KIDS19":"/ywxrw9yp/","FIGHTER5":"/zredv9ef/"};
 const ACTIVE='vl_active_student_context',MAX_AGE=24*60*60*1000;
 const validStudent=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{22}$/.test(s),validCourse=s=>typeof s==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
 const integer=v=>/^(0|[1-9]\d*)$/.test(String(v))&&Number.isSafeInteger(Number(v))?Number(v):null;
 const label=v=>typeof v==='string'?v.normalize('NFC').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,80):'';
 const classKey=s=>label(s).toUpperCase().replace(/\s/g,'');
 function read(storage,key){try{return JSON.parse(storage.getItem(key)||'null');}catch{return null;}}
 function normalize(raw){
  if(!raw||raw.schema!==2||!validStudent(raw.student)||!validCourse(raw.course))return null;
  const className=label(raw.className),parentRoute=ROUTES[classKey(className)];
  if(!parentRoute||parentRoute!==raw.parentRoute||!Number.isFinite(raw.issuedAt)||raw.issuedAt<=0)return null;
  const limits={},allowed={};for(const [k,ids]of Object.entries(raw.allowed||{}))if(validCourse(k)&&Array.isArray(ids)){
   allowed[k]=[...new Set(ids.filter(validCourse))];limits[k]=integer(raw.limits?.[k])??0;
  }
  const course=raw.course;return {schema:2,student:raw.student,course,limit:limits[course]||0,focus:Math.max(1,integer(raw.focus)||1),name:label(raw.name),className,displayName:label(raw.displayName||raw.name),parentRoute,issuedAt:raw.issuedAt,limits,allowed};
 }
 function current(c,now=Date.now()){return Boolean(c&&!c.invalid&&c.schema===2&&now>=c.issuedAt&&now-c.issuedAt<MAX_AGE);}
 function browserSession(){try{return typeof window==='object'?window.sessionStorage:null;}catch{return null;}}
 function resolve(search,storage,session=browserSession()){
  const p=new URLSearchParams(search),saved=normalize(read(storage,ACTIVE)),student=p.get('student')||saved?.student;
  if(!student&&!p.has('student'))return null;
  const blocked={invalid:true,student:validStudent(student)?student:'',course:p.get('course')||'',limit:0,focus:1,limits:{},allowed:{}};
  if(!validStudent(student)||p.getAll('student').length>1)return blocked;
  const own=normalize(read(storage,'vl_student_context_'+student))||(saved?.student===student?saved:null);
  if(!own)return blocked;
  const course=p.get('course')||own.course;
  if(!current(own)||!validCourse(course)||(p.has('mtt_name')&&label(p.get('mtt_name'))!==own.name)||(p.has('mtt_class')&&classKey(p.get('mtt_class'))!==classKey(own.className)))return {...own,...blocked};
  // A one-use, two-minute handoff begins a tab-local visit. Saved progress alone is not admission.
  let visit=read(session,'vl_game_visit'),entry=p.get('entry');
  if(entry&&/^[a-f0-9]{32}$/.test(entry)){
   const key='vl_game_entry_'+entry,ticket=read(storage,key);
   try{storage.removeItem(key);}catch{}
   if(ticket&&ticket.student===student&&ticket.className===own.className&&ticket.parentRoute===own.parentRoute&&Date.now()>=ticket.at&&Date.now()-ticket.at<120000){
    visit={id:entry,student,className:own.className,parentRoute:own.parentRoute,at:Date.now()};
    try{session.setItem('vl_game_visit',JSON.stringify(visit));}catch{visit=null;}
   }else visit=null;
  }
  const entered=visit&&visit.student===student&&visit.className===own.className&&visit.parentRoute===own.parentRoute&&Date.now()>=visit.at&&Date.now()-visit.at<MAX_AGE&&(entry===visit.id||p.get('visit')===visit.id);
  if(!entered)return {...own,...blocked};
  return {...own,entered:true,visit:visit.id,course,limit:own.limits[course]||0,focus:p.has('focus')?Math.max(1,integer(p.get('focus'))||1):course===own.course?own.focus:1};
 }
 function store(storage,context){const c=normalize(context);if(!current(c))return false;try{storage.setItem(ACTIVE,JSON.stringify(c));storage.setItem('vl_student_context_'+c.student,JSON.stringify(c));return true;}catch{return false;}}
 function forCourse(context,course){return context?{...context,course,limit:context.limits?.[course]??0,focus:context.course===course?context.focus:1}:null;}
 function suffix(profile){return validStudent(profile?.student)?':student:'+profile.student:profile?':profile:'+encodeURIComponent(JSON.stringify([profile.className,profile.name])):'';}
 function progressKey(course,student){return 'universe_progress_'+encodeURIComponent(course)+':student:'+student;}
 function taught(course,context){return current(context)?course.lessons.filter(l=>(context.allowed?.[course.id]||[]).includes(l.id)):[];}
 function status(course,number,progress,context){
  if(!current(context)||!context.entered)return {open:false,reason:'🔒 Con cần bấm mở game từ bảng theo dõi riêng của mình. Link game mở trực tiếp chưa được vào chơi nhé!',kind:'profile'};
  const lesson=course.lessons[number-1],eligible=taught(course,context);
  if(!lesson||!eligible.some(l=>l.id===lesson.id))return {open:false,reason:'🔒 Bài này lớp mình chưa học tới! Con chờ cô Trang mở khóa trên bảng theo dõi lớp nhé!',kind:'classroom'};
  // Independent books do not require completing unrelated, untaught books.
  for(const previous of eligible){if(previous.id===lesson.id)break;if((previous.track||'')===(lesson.track||'')&&!(Number(progress?.lessons?.[previous.id]?.stars)>=1))return {open:false,reason:`🔒 Con hãy giành ít nhất 1 Sao ở Hành tinh số ${course.lessons.indexOf(previous)+1} trước nhé!`,kind:'stars'};}
  return {open:true,reason:'',kind:'open'};
 }
 function summary(course,progress,context){
  const eligible=taught(course,context),passed=l=>Number(progress?.lessons?.[l.id]?.stars)>=1,last=eligible.length?course.lessons.indexOf(eligible.at(-1))+1:0;
  const next=eligible.find(l=>!passed(l));return {completed:eligible.filter(passed).length,limit:eligible.length,last,next:next?course.lessons.indexOf(next)+1:last,stardust:Math.max(0,Number(progress?.stardust)||0),stars:eligible.reduce((n,l)=>n+Math.max(0,Math.min(3,Number(progress?.lessons?.[l.id]?.stars)||0)),0)};
 }
 function focus(course,context){const eligible=taught(course,context),requested=(context?.focus||1)-1;if(!eligible.length)return 0;const target=course.lessons[requested];if(eligible.includes(target))return requested;return course.lessons.indexOf(eligible.find(l=>course.lessons.indexOf(l)>=requested)||eligible.at(-1));}
 function decorate(url,context,course,number){if(!context||!validStudent(context.student))return url;const c=forCourse(context,course);url.searchParams.set('course',course);url.searchParams.set('student',c.student);url.searchParams.set('limit',String(c.limit));url.searchParams.set('focus',String(number||c.focus));if(c.entered&&c.visit)url.searchParams.set('visit',c.visit);if(c.name&&c.className){url.searchParams.set('mtt_name',c.name);url.searchParams.set('mtt_class',c.className);if(c.displayName&&c.displayName!==c.name)url.searchParams.set('mtt_english',c.displayName);}return url;}
 function handoff(storage,context,url){
  const c=normalize(context);if(!current(c))return false;
  try{const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);const entry=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
   const previous=read(storage,'vl_game_last_entry');if(previous?.id)storage.removeItem('vl_game_entry_'+previous.id);
   storage.setItem('vl_game_entry_'+entry,JSON.stringify({student:c.student,className:c.className,parentRoute:c.parentRoute,at:Date.now()}));storage.setItem('vl_game_last_entry',JSON.stringify({id:entry}));
   url.searchParams.delete('visit');url.searchParams.set('entry',entry);return true;
  }catch{return false;}
 }
 function dashboard(context,base){const path=ROUTES[classKey(context?.className)];if(!path||!validStudent(context?.student))return null;const u=new URL(path,base);u.hash='p='+context.student;return u;}
 return {ACTIVE,ROUTES,MAX_AGE,validStudent,normalize,resolve,store,current,forCourse,suffix,progressKey,taught,status,summary,focus,decorate,dashboard,handoff,active:null};
});
