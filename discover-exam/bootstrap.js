(async()=>{'use strict';const p=new URLSearchParams(location.search),course=p.get('course'),number=Number(p.get('test'));
 const host=document.querySelector('#course-map'),script=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.append(s);});
 if(!/^discover-[1-4]$/.test(course)||!Number.isInteger(number)||number<1||number>9){window.FlowBoot?.cancel();host.textContent='Chọn một Progress Test trên bản đồ để bắt đầu.';return;}
 const sessions=[7,15,23,31,39,48,56,64,72],lessonId='lesson-'+sessions[number-1],testId=course+'-test-'+number;
 const test=await fetch('data/'+testId+'.json?v=progress-1').then(r=>{if(!r.ok)throw Error('Test unavailable');return r.json();});
 const items=DiscoverExamCore.items(test,lessonId),back=new URL('../vu-tru/',location.href);back.search=location.search;back.searchParams.delete('test');back.searchParams.delete('play');back.searchParams.delete('startAt');back.searchParams.set('view','map');
 window.GAME_CONFIG={id:'course-'+course,courseId:course,lessonId,storageKey:`mtt-course-${course}-${lessonId}-v1`,title:`Discover ${course.at(-1)} · Progress Test ${number}`,brand:'MS TRANG TRIEU EDUCATION',journeyUrl:back.href};
 window.DISCOVER_TEST_LESSON={id:lessonId,testId,title:test.title||`Progress Test ${number}`};window.ADVENTURE={exam:true,kind:'progress-test',items};host.id='adventure';
 await script('../game-kit/profile.js?v=cloud-1');await script('../vu-tru/lesson-bridge.js?v=world-3');await script('app.js?v=sheet-1');
})().catch(e=>{FlowBoot?.cancel();document.querySelector('main').textContent='Chưa tải được bài kiểm tra. Con tải lại trang nhé.';console.error(e);});
