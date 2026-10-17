/* One unique rendered character per era; hydrate only nearby planets. */
(()=>{
 'use strict';
 const cast=[
  ['van-lang','forest-explorer','look'],
  ['phonics-1','stone-artisan','craft'],
  ['phonics-2','grassland-shepherd','breathe'],
  ['phonics-3','harvest-farmer','breathe'],
  ['phonics-4','ancient-scholar','read'],
  ['family-friends-1','town-baker','breathe'],
  ['family-friends-2','steam-engineer','craft'],
  ['discover-1','city-architect','look'],
  ['discover-2','smart-designer','read'],
  ['discover-3','robot-researcher','breathe'],
  ['discover-4','sky-aviator','hover'],
  ['fighter','space-commander','hover']
 ];
 const pic=file=>'<img data-citizen-src="assets/citizens/'+file+'.png" alt="" width="1024" height="1536" decoding="async" draggable="false">';
 window.CourseCitizens={
  cast:cast.map(([courseId,character,motion],index)=>({courseId,character,motion,index})),
  art(index){
   const row=cast[index];if(!row)return '';
   const [courseId,character,motion]=row;
   const bird=[0,1,2,3,4,5,7].includes(index)?'<span class="era-bird-flight"><span class="era-bird-frame">'+pic('bird')+'</span></span>':'';
   const lamb=index===2||index===3?'<span class="era-companion">'+pic('lamb')+'</span>':'';
   return '<span class="era-life" data-era-cast="'+courseId+'" aria-hidden="true"><span class="era-contact-shadow"></span><span class="era-person era-'+motion+'" data-character="'+character+'">'+pic('citizen-'+index)+'</span>'+lamb+bird+'</span>';
  },
  hydrate(card){
   card.querySelectorAll('[data-citizen-src]').forEach(img=>{
    img.addEventListener('error',()=>{img.hidden=true;},{once:true});
    img.src=img.dataset.citizenSrc;img.removeAttribute('data-citizen-src');
   });
  }
 };
})();
