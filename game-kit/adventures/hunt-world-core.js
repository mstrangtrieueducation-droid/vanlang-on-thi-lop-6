/* One stable Unit scene and placement; vocabulary and sounds stay curriculum-specific. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.HuntWorldCore=api;})(globalThis,()=>{
 const hash=s=>[...s].reduce((a,c)=>Math.imul(a^c.charCodeAt(0),16777619)>>>0,2166136261);
 function shuffle(a,seed){a=[...a];let s=seed;for(let i=a.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
 function layout(objects,seed){const slots=[];for(let row=0;row<3;row++)for(let col=0;col<6;col++)slots.push({x:9+col*16+(row===1?2:0),base:52+row*22});
  return shuffle(objects,seed).map((o,i)=>{const p=slots[i],h=o.kind==='letter'?(o.case==='upper'?15:11):18,w=o.kind==='letter'?8:12;return {...o,x:p.x,y:p.base-h/2,w,h};});
 }
 const sounds={A:['æ','ae'],B:['b','b'],C:['k','k'],D:['d','d'],E:['ɛ','e'],F:['f','f'],G:['g','g'],H:['h','h'],I:['ɪ','sit'],J:['dʒ','dz'],K:['k','k'],L:['l','l'],M:['m','m'],N:['n','n'],P:['p','p'],R:['r','r'],S:['s','s'],T:['t','t'],U:['ʌ','mud'],V:['v','v'],W:['w','w'],X:['ks','ks'],Y:['j','j'],Z:['z','z']};
 function soundLetters(letters){return letters.filter(l=>sounds[l]).slice(0,2);}
 function soundPlan(profile,unit){const patterns=new Set((unit?.levels||[]).flatMap(l=>l.patterns)),word=profile.words[0].toLowerCase(),base=soundLetters(profile.letters).map(letter=>({letters:[letter],ipa:sounds[letter][0],clip:sounds[letter][1],pattern:'letter-'+letter}));
  const recipes=[['a_e',/a.e$/,['A'],'eɪ','ei'],['i_e',/i.e$/,['I'],'aɪ','ai'],['o_e',/o.e$/,['O'],'oʊ','ou'],['ai',/ai/,['A','I'],'eɪ','ei'],['ee',/ee/,['E','E'],'iː','i'],['ie',/ie/,['I','E'],'aɪ','ai'],['oa',/oa/,['O','A'],'oʊ','ou'],['oo',/oo/,['O','O'],'uː','uu']];
  const focus=recipes.find(([pattern,rx])=>patterns.has(pattern)&&rx.test(word));if(focus){const [pattern,,letters,ipa,clip]=focus,first=base.find(p=>!letters.includes(p.letters[0]))||base[0];return [first,{pattern,letters,ipa,clip}];}
  if(patterns.has('sh')&&word.startsWith('sh'))return [{pattern:'sh',letters:['S','H'],ipa:'ʃ',clip:'sh'},base.find(p=>!['S','H'].includes(p.letters[0]))||{letters:['E'],ipa:'ɛ',clip:'e',pattern:'letter-E'}];
  if(patterns.has('c-soft')&&/^c[ei]/.test(word))return base.map(p=>p.letters[0]==='C'?{...p,ipa:'s',clip:'s',pattern:'c-soft'}:p);
  return base;
 }
 function make(v2,profile,art,scenes,unit){
  const colors=art.cells.slice(0,3).map(s=>s.split(' ')[0]),objects=v2.objects.map(o=>{let cell=o.id.startsWith('first-')?Math.max(0,+o.id.slice(6)-2):o.id.startsWith('second-')?3:o.id.startsWith('main-')?4+Number(o.id.slice(5)):o.case==='upper'?8+Number(o.id.slice(6)):11+Number(o.id.slice(6));return {...o,cell,color:o.id.startsWith('first-')?colors[cell]:o.color};});
  // The v2 prompts use profile colours. This replacement is data-driven from the new atlas.
  const replacements=new Map(profile.colors.map((c,i)=>[c,colors[i]]));
  const sceneOrder=shuffle(scenes,hash(v2.course+v2.unit));
  const unitObjects=layout(objects,hash(v2.course+'/'+v2.unit));
  const questions=v2.questions.map(q=>({...q,id:q.id.replace('v2','v4'),prompt:q.prompt.replace(/\b\w+\b/g,w=>replacements.get(w)||w),world:sceneOrder[0].id,background:'/titi-game-media/assets/hunt-worlds/scenes/'+sceneOrder[0].file,objects:unitObjects}));
  soundPlan(profile,unit).forEach(({letters,ipa,clip,pattern},i)=>{const q=questions[[4,12][i]],counts=new Map();letters.forEach(l=>counts.set(l,(counts.get(l)||0)+1));const groups=[...counts].map(([letter,need])=>({targets:objects.filter(o=>o.kind==='letter'&&o.word.toUpperCase()===letter).map(o=>o.id),need}));if(groups.some(g=>g.targets.length<g.need))throw Error('Missing Unit sound letters '+profile.course+'/'+profile.unit);
   Object.assign(q,{prompt:letters.length===2?`Which two letters make the sound /${ipa}/?`:`What letter makes the sound /${ipa}/?`,sound:{letters,letter:letters.join(''),sourcePattern:pattern,ipa,instruction:letters.length===2?'Find the two letters for this sound.':'What letter makes this sound?',clip:'/titi-game-media/assets/hunt-worlds/phonemes/'+clip+'-isolated.wav',repetitions:2,pauseMs:550},groups});});
  return {...v2,version:4,atlas:'/titi-game-media/assets/hunt-worlds/objects/'+art.file,objects,questions};
 }
 return {hash,shuffle,layout,sounds,soundLetters,soundPlan,make};
});
