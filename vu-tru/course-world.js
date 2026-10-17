/* One visual world per course, shared by lesson maps and close views. */
(()=>{'use strict';const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));window.CourseWorld={
 trail(points){return points.map((p,i)=>{const y=p.y-35;if(!i)return 'M '+p.x+' '+y;const a=points[i-1],ay=a.y-35,dx=p.x-a.x;return 'C '+(a.x+(dx?dx*.35:55))+' '+(ay+(dx?22:(y-ay)/2))+', '+(p.x-(dx?dx*.35:55))+' '+(y-(dx?22:(y-ay)/2))+', '+p.x+' '+y;}).join(' ');},
 metadata(course){return (window.COURSE_PLANETS||[]).find(c=>c.id===course.id)||{id:course.id,name:course.name,era:course.name,description:course.description};},
 label(course,n){return (course.id==='van-lang'?'Thử thách ':'Nhiệm vụ ')+n;},
 art(course,n){const id=encodeURIComponent(course.id),meta=this.metadata(course);return '<span class="lesson-world-art"><img src="assets/'+id+'.webp" alt="'+esc(meta.era)+'" draggable="false" decoding="async"><span class="world-node-badge">'+n+'</span></span>';},
 apply(course){document.body.dataset.world=course.id;document.body.style.setProperty('--course-world-image','url("assets/'+encodeURIComponent(course.id)+'.webp")');document.body.dataset.worldLight||='day';}
};})();
