/* Deliberately isolated review: never writes a pupil's classroom/cloud progress. */
(async()=>{'use strict';
 const params=new URLSearchParams(location.search),host=document.querySelector('#course-map');
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const id=/^discover-[1-4]$/.test(params.get('course'))?params.get('course'):'discover-1';
 const route=(course,lesson,unit)=>{const u=new URL('./',location.href);u.searchParams.set('course',course);u.searchParams.set('review','1');if(lesson){u.searchParams.set('lesson',lesson);u.searchParams.set('play','1');}if(unit)u.searchParams.set('unit',unit);if(params.has('v'))u.searchParams.set('v',params.get('v'));return u.href;};
 const script=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.append(s);});
 if(params.get('review')!=='1'){window.FlowBoot?.cancel();host.className='preview-home';host.innerHTML=`<h1>Discover · Bản chơi thử cho cô và đội ngũ</h1><p>Kết quả thử không cộng vào bảng xếp hạng học sinh.</p><a class="preview-button" href="${esc(route(id))}">Mở bản chơi thử</a>`;return;}
 try{
  const response=await fetch(`data/${id}.json?v=program-2`);if(!response.ok)throw Error('Course unavailable');const course=await response.json();let lesson=course.lessons.find(l=>l.id===params.get('lesson'));
  if(!lesson){
   window.FlowBoot?.cancel();document.title=`${course.name} · Bản duyệt | MS TRANG TRIEU EDUCATION`;host.className='preview-home';
   const unit=Math.min(18,Math.max(1,Number(params.get('unit'))||1)),shown=course.lessons.filter(l=>l.unit===unit),skills={vocabulary:'Words',grammar:'Grammar',reading:'Reading',listening:'Listening','word-study':'Word Study'};
   host.innerHTML=`<header class="preview-heading"><img src="../ms-trang-trieu-education-logo.64e2382ed4df.png" alt="Ms Trang Trieu Education"><div><small>MS TRANG TRIEU EDUCATION</small><h1>Discover · Adventure Lab</h1><p>18 Units · 62 tiết · 18 Unit Reviews mỗi sách</p></div><a href="../vu-tru/?review=1&course=${id}">Về các hành tinh ↗</a></header>
    <nav class="preview-tabs" aria-label="Chọn giáo trình">${[1,2,3,4].map(n=>`<a href="${esc(route('discover-'+n,null,unit))}" ${id==='discover-'+n?'aria-current="page"':''}>Discover ${n}</a>`).join('')}</nav>
    <p class="preview-note">Bản duyệt toàn bộ nội dung luyện tập · Tiến độ thử lưu riêng trên máy, không cộng điểm học sinh.</p>
    <nav class="preview-units" aria-label="Chọn Unit">${Array.from({length:18},(_,i)=>`<a href="${esc(route(id,null,i+1))}" ${unit===i+1?'aria-current="page"':''}>Unit ${i+1}</a>`).join('')}</nav>
    <section class="preview-levels" aria-label="Các bài của Unit ${unit}">${shown.map(l=>`<a class="preview-level ${l.kind==='unit-review'?'checkpoint':''}" href="${esc(route(id,l.id,unit))}"><span class="preview-number">${l.kind==='unit-review'?'🏆':l.session}</span><div><small>${l.kind==='unit-review'?'UNIT REVIEW':'TIẾT '+l.session} · ${l.questionCount} CÂU</small><h2>${esc(l.title)}</h2><p>${l.skills.map(skill=>skills[skill]||skill).join(' · ')}</p></div><b>Vào thử thách →</b></a>`).join('')}</section>
    <details class="preview-tests"><summary>Đề kiểm tra gốc · 9 bài / sách</summary><p>Mở bản kiểm tra với tranh màu 3D và âm thanh gốc. Giữ nguyên dạng bài và cách tính điểm.</p><nav>${(course.officialTests||[]).map(t=>`<a href="../discover-exam/?review=1&course=${id}&test=${t.test}">Progress Test ${t.test} · Units ${t.test*2-1}–${t.test*2} ↗</a>`).join('')}</nav></details>
    <p class="preview-foot">Nội dung luyện tập do trung tâm biên soạn từ Program, Class Resources và Student Book. Các tiết Word Study có thể giới thiệu từ của Unit kế tiếp theo Program; bài Unit Review chỉ ôn Unit vừa học.</p>`;
   return;
  }
  const lessonResponse=await fetch(`data/${id}/${lesson.id}.json?v=program-2`);if(!lessonResponse.ok)throw Error('Lesson unavailable');lesson=await lessonResponse.json();
  document.title=`${course.name} · ${lesson.title} · Bản chơi thử`;host.id='adventure';
  const key=`titi-discover-preview-v2:${id}:${lesson.id}`;
  window.GAME_CONFIG={id:`preview-${id}-${lesson.id}`,storageKey:key,courseId:id,lessonId:lesson.id,brand:`${course.name} · BẢN DUYỆT`,title:lesson.title,shortTitle:`Unit ${lesson.unit} · ${lesson.kind==='unit-review'?'Unit Review':'Tiết '+lesson.session}`,timeLimitSeconds:lesson.timeLimitSeconds,journeyUrl:route(id,null,lesson.unit)};
  window.GameProfile={review:true,name:'Explorer',displayName:'Explorer',className:'PREVIEW',storageKey:key};
  let mode='game';try{mode=localStorage.getItem('titi-discover-preview-mode')||'game';}catch{}
  window.GalaxyBridge={record:()=>true,reward:()=>false,getMode:()=>mode,setMode:value=>{mode=value==='standard'?'standard':'game';try{localStorage.setItem('titi-discover-preview-mode',mode);}catch{}},journey:()=>route(id,null,lesson.unit)};
  window.ADVENTURE={exam:false,n:course.lessons.findIndex(l=>l.id===lesson.id)+1,week:course.name,name:lesson.title,en:lesson.kind==='unit-review'?'Unit Review':'Session '+lesson.session,theme:'forest',icon:'🌟',reward:'Discover Explorer',goal:'Listen, think and explore with Titi.',topics:'Review · No leaderboard points',kind:lesson.kind,unit:lesson.unit,items:lesson.items};
  document.documentElement.dataset.courseWorld=id;document.documentElement.dataset.courseRoad=window.CourseWorld?.kind({id})||'city';document.documentElement.style.setProperty('--course-world-art',`url("../vu-tru/assets/${id}.webp")`);
  const back=document.querySelector('.flow-boot button');if(back)back.onclick=()=>{window.FlowBoot.cancel();location.assign(route(id,null,lesson.unit));};
  await script('voice.js?v=program-2');await script('../game-kit/adventures/gameplay.js?v=parts-2');await script('../game-kit/adventures/dialogue-voice.js?v=cast-1');await window.DialogueVoice.install(id);await script('../game-kit/adventures/engine.js?v=layers-1');
 }catch(error){window.FlowBoot?.cancel();host.className='preview-home';host.innerHTML=`<h1>Chưa mở được bài thử</h1><p>Tải lại trang để thử lại.</p><a href="${esc(route(id))}">Về danh sách bài</a>`;console.error('Discover preview failed',error);}
})();
