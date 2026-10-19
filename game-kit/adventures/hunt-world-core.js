/* A new setting and placement for every challenge; vocabulary stays Unit-specific. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.HuntWorldCore=api;})(globalThis,()=>{
 const hash=s=>[...s].reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
 function shuffle(a,seed){a=[...a];let s=seed;for(let i=a.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
 function layout(objects,seed){const slots=[];for(let row=0;row<3;row++)for(let col=0;col<6;col++)slots.push({x:9+col*16+(row===1?2:0),base:52+row*22});
  return shuffle(objects,seed).map((o,i)=>{const p=slots[i],h=o.kind==='letter'?(o.case==='upper'?15:11):18,w=o.kind==='letter'?8:12;return {...o,x:p.x,y:p.base-h/2,w,h};});
 }
 const sounds={A:['æ','ae'],B:['b','b'],C:['k','k'],D:['d','d'],E:['ɛ','e'],F:['f','f'],G:['g','g'],H:['h','h'],I:['ɪ','sit'],J:['dʒ','dz'],K:['k','k'],L:['l','l'],M:['m','m'],N:['n','n'],P:['p','p'],R:['r','r'],S:['s','s'],T:['t','t'],U:['ʌ','mud'],V:['v','v'],W:['w','w'],X:['ks','ks'],Y:['j','j'],Z:['z','z']};
 function soundLetters(letters){return letters.filter(l=>sounds[l]).slice(0,2);}
 function make(v2,profile,art,scenes){
  const colors=art.cells.slice(0,3).map(s=>s.split(' ')[0]),objects=v2.objects.map(o=>{let cell=o.id.startsWith('first-')?Math.max(0,+o.id.slice(6)-2):o.id.startsWith('second-')?3:o.id.startsWith('main-')?4+Number(o.id.slice(5)):o.case==='upper'?8+Number(o.id.slice(6)):11+Number(o.id.slice(6));return {...o,cell,color:o.id.startsWith('first-')?colors[cell]:o.color};});
  // The v2 prompts use profile colours. This replacement is data-driven from the new atlas.
  const replacements=new Map(profile.colors.map((c,i)=>[c,colors[i]]));
  const sceneOrder=shuffle(scenes,hash(v2.course+v2.unit));
  const questions=v2.questions.map((q,i)=>({...q,id:q.id.replace('v2','v3'),prompt:q.prompt.replace(/\b\w+\b/g,w=>replacements.get(w)||w),world:sceneOrder[i].id,background:'/titi-game-media/assets/hunt-worlds/scenes/'+sceneOrder[i].file,objects:layout(objects,hash(v2.course+'/'+v2.unit+'/'+i))}));
  soundLetters(profile.letters).forEach((letter,i)=>{const [ipa,clip]=sounds[letter],q=questions[[4,12][i]],targets=objects.filter(o=>o.kind==='letter'&&o.word.toUpperCase()===letter).map(o=>o.id);Object.assign(q,{prompt:`What letter makes the sound /${ipa}/?`,sound:{letter,ipa,clip:'/titi-game-media/assets/hunt-worlds/phonemes/'+clip+'.mp3',repetitions:2,pauseMs:550},groups:[{targets,need:1}]});});
  return {...v2,version:3,atlas:'/titi-game-media/assets/hunt-worlds/objects/'+art.file,objects,questions};
 }
 return {hash,shuffle,layout,sounds,soundLetters,make};
});
