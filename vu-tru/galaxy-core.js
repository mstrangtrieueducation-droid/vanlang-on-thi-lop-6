(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.GalaxyCore=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';
 const themes=['candy','tech','nova'];
 function theme(course){if(themes.includes(course.theme))return course.theme;const text=(course.id+' '+(course.level||'')+' '+(course.name||'')).toLowerCase();return /fighter|ielts|advanced|nâng cao/.test(text)?'nova':/phonics|family|kids|basic|cơ bản/.test(text)?'candy':'tech';}
 function archetype(title,index,total){const t=String(title).toLowerCase();if(/test|review|boss|kiểm tra|ôn tập/.test(t)||index===total-1)return 'boss';if(/ice|snow|winter|băng|lạnh/.test(t))return 'ice';if(/robot|machine|technology|station|công nghệ/.test(t))return 'mecha';if(/forest|plant|animal|rừng|family/.test(t))return 'forest';if(/sun|fire|energy|solar|năng lượng/.test(t))return 'solar';return ['ice','mecha','forest','solar','boss'][index%5];}
 function positions(n,cols=4){cols=Math.max(1,Math.floor(cols));return Array.from({length:n},(_,i)=>{const row=Math.floor(i/cols),slot=i%cols,col=row%2?cols-1-slot:slot;return {x:(col+.5)/cols*1000,y:90+row*180};});}
 function key(courseId,profile){return 'universe_progress_'+encodeURIComponent(courseId)+(profile?.student?':student:'+profile.student:profile?':profile:'+encodeURIComponent(JSON.stringify([profile.className,profile.name])):'');}
 function load(storage,courseId,profile){try{const data=JSON.parse(storage.getItem(key(courseId,profile))||'{}');return {journal:Array.isArray(data.journal)?data.journal:[],stardust:Math.max(0,Number(data.stardust)||0),lessons:data.lessons&&typeof data.lessons==='object'?data.lessons:{},theme:themes.includes(data.theme)?data.theme:null,gameplayMode:data.gameplayMode==='standard'?'standard':'game',claimed:Array.isArray(data.claimed)?data.claimed:[]};}catch{return {stardust:0,lessons:{},theme:null,claimed:[]};}}
 function save(storage,id,profile,data){try{storage.setItem(key(id,profile),JSON.stringify(data));return true;}catch{return false;}}
 function reward(storage,id,profile,eventId,points=10){const d=load(storage,id,profile);if(d.claimed.includes(eventId))return d;d.claimed=d.claimed.slice(-99).concat(eventId);d.stardust+=points;save(storage,id,profile,d);return d;}
 return {themes,theme,archetype,positions,key,load,save,reward};
});
