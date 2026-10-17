(()=>{'use strict';
 const C=window.StudentContext,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 window.StudentGate={async enter(){if(window.TitiReview?.active){await TitiReview.ready;return true;}const config=window.GAME_CONFIG,context=C?.forCourse(C.active,config.courseId);
  let reason='Chưa kiểm tra được bài đã mở. Con quay về bản đồ rồi thử lại nhé.';
  try{const response=await fetch('../vu-tru/catalog.json?v=phonics-3');if(!response.ok)throw Error();const courses=await response.json(),course=courses.find(c=>c.id===config.courseId),number=course?.lessons.findIndex(l=>l.id===(config.lessonId||config.id))+1;if(!course||!number)throw Error();const saved=GalaxyCore.load((window.StudentContext?.browserStorage||localStorage),course.id,window.GameProfile),result=C.status(course,number,saved,context);if(result.open)return true;reason=result.reason;}catch{}
  const url=C.decorate(new URL('../vu-tru/',location.href),context,config.courseId);const release=new URLSearchParams(location.search).get('release');if(release)url.searchParams.set('release',release);const back=C.dashboard(context,location.href);const host=document.querySelector('#adventure');host.innerHTML=`<section class="student-lesson-gate"><h1>Cô giáo Titi nhắn con</h1><p>${esc(reason)}</p><a href="${esc(url.href)}">🪐 Về bản đồ bài học</a>${back?`<a href="${esc(back.href)}">🏠 Về bảng theo dõi</a>`:""}</section>`;return false;
 }};
})();
