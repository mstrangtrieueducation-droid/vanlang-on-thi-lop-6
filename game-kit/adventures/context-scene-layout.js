/* Artwork coordinates only. Question IDs, answers and native score records stay in the pack. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ContextSceneLayout=api;})(typeof window==='object'?window:this,function(){
 'use strict';
 const house={
  shelf:{x:80,y:35,w:16,h:27,fit:7.6,angle:0},
  drawer:{x:85,y:46,w:18,h:12,fit:7.2,angle:-7},
  table:{x:49,y:46,w:27,h:13,fit:9,angle:-8},
  'under-table':{x:49,y:60,w:22,h:15,fit:9,angle:0},
  basket:{x:15,y:58,w:19,h:18,fit:8,angle:-9},
  box:{x:89,y:64,w:18,h:19,fit:8,angle:-7},
  'beside-box':{x:74,y:68,w:13,h:13,fit:10,angle:0},
  grandpa:{x:33,y:52,w:17,h:32,fit:8,angle:-5}
 };
 const garden={
  shelf:{x:82,y:30,w:18,h:24,fit:8,angle:0},
  drawer:{x:80,y:37,w:18,h:13,fit:7.5,angle:-6},
  table:{x:51,y:48,w:24,h:14,fit:9,angle:-8},
  'under-table':{x:51,y:63,w:21,h:14,fit:9,angle:0},
  basket:{x:19,y:67,w:18,h:17,fit:8,angle:-8},
  box:{x:86,y:61,w:19,h:19,fit:8,angle:-7},
  'beside-box':{x:70,y:71,w:13,h:13,fit:9,angle:0},
  'near-tree':{x:13,y:38,w:17,h:17,fit:12,angle:0},
  meadow:{x:57,y:35,w:21,h:17,fit:12,angle:0},
  'by-fence':{x:67,y:29,w:19,h:16,fit:12,angle:0},
  'pond-edge':{x:25,y:53,w:20,h:18,fit:12,angle:0},
  'forest-path':{x:48,y:70,w:20,h:15,fit:12,angle:0},
  ice:{x:51,y:28,w:22,h:17,fit:12,angle:0},
  grandpa:{x:36,y:53,w:17,h:32,fit:8,angle:-5}
 };
 function art(task){return task.kind==='sceneActions'?['garden','beach'].includes(task.scene)?'cleanup-garden':'cozy-house':task.scene==='space'?'detective-observatory':['beach','street'].includes(task.scene)?'detective-harbour':'detective-treehouse';}
 function slot(task,target){return {...target,...(art(task)==='cozy-house'?house:garden)[target.id]};}
 function position(task,object,index){
  if(task.kind==='detectiveScene')return {x:object.x,y:object.y,w:8.3+(index%3)*.7,h:13+(index%3),angle:(index%3-1)*3};
  if(object.word==='apple'&&task.scene==='garden'&&object.id.startsWith('o'))return {x:12,y:28,w:9,h:13,angle:-8};
  if(object.id.startsWith('o')){const scattered=[{x:31,y:73,angle:-13},{x:56,y:65,angle:11},{x:73,y:75,angle:-8}][Math.max(0,task.objects.filter(o=>o.id.startsWith('o')).indexOf(object))%3];return {...scattered,w:10.5,h:16};}
  const tray=task.objects.filter(o=>!o.id.startsWith('o')),i=tray.indexOf(object);
  return {x:12+i*76/Math.max(1,tray.length-1),y:88,w:10,h:16,angle:(i%3-1)*7};
 }
 function fit(task,object,target,index){const s=slot(task,target);return {x:s.x+(index%2?1.5:-1.5),y:target.id==='grandpa'?s.y-s.h*.24:['under-table','beside-box','near-tree','meadow','by-fence','pond-edge','forest-path','ice'].includes(target.id)?s.y:s.y-s.fit*1.5*(['drawer','basket','box'].includes(target.id)?.28:.4),w:s.fit,h:s.fit*1.5,angle:s.angle,depth:['drawer','basket','box'].includes(target.id)?'inside':'surface'};}
 function cover(task,o,index){const p=position(task,o,index),x=p.x,y=p.y,w=p.w,h=p.h;return `${x-w*.53}% ${y+h*.17}%, ${x-w*.2}% ${y+h*.10}%, ${x+w*.13}% ${y+h*.21}%, ${x+w*.53}% ${y+h*.14}%, ${x+w*.53}% ${y+h*.55}%, ${x-w*.53}% ${y+h*.55}%`;}
 function lips(task){return art(task)==='cozy-house'?[
  '6% 60%, 14% 62%, 24% 60%, 24% 76%, 6% 76%',
  '78.5% 44%, 87.5% 47.5%, 90% 46.5%, 90% 53%, 78.5% 53%',
  '80% 64%, 89% 66%, 99.9% 64%, 99.9% 78%, 80% 78%'
 ]:[
  '9% 64%, 19% 66%, 31% 64%, 31% 76%, 9% 76%',
  '72% 36%, 82% 38%, 85% 37%, 85% 44%, 72% 44%',
  '75% 59%, 87% 64%, 99% 61%, 99% 77%, 75% 77%'
 ];}
 return {art,slot,position,fit,cover,lips};
});
