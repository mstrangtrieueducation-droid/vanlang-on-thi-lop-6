const fs=require('node:fs'),path=require('node:path');
const plan=require('./phonics-plan.cjs'),stories=require('./phonics-stories.cjs');
const evidence=require('./legacy/teaching-map-before-phonics.json');
const sheets=[
 'apple ball cat dog egg fish goat hat insect jam kite lion moon nest octopus pig',
 'queen rabbit sun tiger umbrella van web box yo-yo zebra bag cap bed hen jet lip',
 'bib kid wig pin pot mop bug mug cup cub gum nut cake gate bike line',
 'home cube rain bee key pie boat snow fruit spoon brush crab drum frog ship duck'
].map(x=>x.split(' '));
const pictures=Object.fromEntries(sheets.flatMap((words,s)=>words.map((word,cell)=>[word,{sheet:s+1,cell}])));
// These illustrations are less specific than the spoken word; use text instead.
for(const word of ['snow','line','kid','moon'])delete pictures[word];
const unique=a=>[...new Set(a)], label=s=>s.key==='y-ee'?'y · /i/':s.key==='y-igh'?'y · /aɪ/':s.key==='th-voiced'?'th · /ð/':s.key==='th-unvoiced'?'th · /θ/':s.key;
const spelling=s=>s.key.split('-')[0];
const optionSet=(answer,pool)=>[answer,...unique(pool).filter(w=>w!==answer).slice(0,3)];
module.exports=function install(courses){
 const map=JSON.parse(JSON.stringify(evidence));
 for(const n of [1,2,3,4]){
  const id='phonics-'+n,old=require('./legacy/'+id+'.json'),source={};
  for(const l of old.lessons)l.sourceLessons.forEach((s,i)=>{source[s]=evidence[id][l.id].sourceGroups[i];});
  const seeds=plan[n].split('\n').map(row=>{const [key,a,b,src]=row.split(' ');return {key,a,b,sources:src.split(',').map(x=>'lesson-'+x)};});
  const lessonId=s=>'sound-'+s.key,groups=s=>[unique(s.sources.flatMap(k=>source[k]))];
  const lessons=[],aliases={};map[id]={};
  const make=(s,suffix,scene,prompt,answer,options,extra={})=>({id:`${id}-${s.key}-${suffix}`,type:'choice',title:label(s),scene,prompt,answer,options,skill:'phonics',interaction:'phonics-choice',phonicsSequence:true,focus:label(s),hint:'Listen again. Say the word slowly and look at the letters.',why:`${s.a} and ${s.b}: practise ${label(s)}.`,sourceLabel:'Original centre practice aligned to classroom sound sequence',...extra});
  function hear(s,suffix='listen'){
   const pic=pictures[s.a],pool=pic?sheets[pic.sheet-1].filter(w=>pictures[w]&&!['hat','cap','insect','bug','mug','cup','boat','ship'].some(x=>x===s.a&&({'hat':'cap',cap:'hat',insect:'bug',bug:'insect',mug:'cup',cup:'mug',boat:'ship',ship:'boat'}[x]===w))):seeds.map(x=>x.a);
   const options=optionSet(s.a,pool);
   return make(s,suffix,'Listen to Titi.',pic?'Listen and choose the correct picture.':'Which word do you hear?',s.a,options,{skill:'listening',spokenScene:s.a,interaction:pic?'picture':'phonics-choice',...(pic?{pictureOptions:Object.fromEntries(options.map(w=>[w,pictures[w]]))}:{}),why:`You heard “${s.a}”. ${s.a} is a practice word for ${label(s)}.`});
  }
  for(let start=0;start<seeds.length;start+=3){
   const unit=start/3+1,chunk=seeds.slice(start,start+3);
   for(const s of chunk){
    const key=spelling(s),position=n===1?(s.key==='x'?'last':'first'):(s.a.endsWith(key)?'end':'beginning');
    const others=seeds.filter(t=>t.key!==s.key&&!t.a.includes(key)&&!t.b.includes(key));
    const spellingOptions=optionSet(key,['a','e','i','o','u','b','d','m','s','t'].concat(seeds.map(spelling)));
    const patternPrompt=n===1?`Which is the ${position} letter?`:'Which letter pattern can you find in this word?';
    // Silent-e patterns need a whole-pattern comparison, not a contiguous substring.
    const pattern=key.includes('_')?key:key;
    const actualSpell=optionSet(pattern,n===3?(pattern.includes('_')?['a_e','i_e','o_e','u_e']:seeds.map(spelling).filter(x=>!x.includes('_')&&!s.a.includes(x))):spellingOptions.slice(1));
    const pairPrompt=n===1?(s.key==='x'?'Which word also ends with x?':'Which word begins with the same letter?'):n===2?'Which word rhymes with this word?':n===3?'Which word has the same vowel sound?':s.key.startsWith('th-')?'Which word has the same first sound?':`Which word also contains the letters “${key}”?`;
    const pairPool=n===3?['cat','hen','pig','dog','cup']:s.key==='th-voiced'?['thin','thick','thank']:s.key==='th-unvoiced'?['this','that','them']:others.map(t=>t.b);
    const missing=n===1?(s.key==='x'?s.a.slice(0,-1)+'___':'___'+s.a.slice(1)):key.includes('_')?s.a.replace(/[aeiou]/,'___').replace(/e$/,'___'):s.a.replace(key,'___');
    const items=[hear(s),make(s,'pattern',s.a,patternPrompt,pattern,actualSpell,{spokenScene:s.a,why:`In “${s.a}”, look for ${label(s)}${key.includes('_')?'; the final e is silent':''}.`}),make(s,'pair',s.a,pairPrompt,s.b,optionSet(s.b,pairPool),{spokenScene:s.a,why:n===1?`${s.a} and ${s.b} have the same ${position} letter, ${key}.`:n===2?`${s.a} and ${s.b} rhyme: both end in -${key}.`:n===3?`${s.a} and ${s.b} share the long vowel sound in this lesson.`:s.key.startsWith('th-')?`${s.a} and ${s.b} both use ${s.key==='th-voiced'?'voiced /ð/ (feel your throat vibrate)':'unvoiced /θ/ (let air pass between tongue and teeth)'}.`:`${s.a} and ${s.b} both contain ${key}.`}),make(s,'listen-partner','Listen to Titi.','Which word do you hear?',s.b,optionSet(s.b,[s.a,...others.map(t=>t.b)]),{skill:'listening',spokenScene:s.b,why:`You heard “${s.b}”, not “${s.a}”. Listen to the whole word, including the ending.`}),make(s,'complete',missing,'Listen and choose the complete word.',s.a,optionSet(s.a,others.map(t=>t.a)),{skill:'listening',spokenScene:s.a,why:`Complete word: ${s.a}. The missing part practises ${label(s)}.`})];
    const l={id:lessonId(s),kind:'sound',unit,focusSounds:[label(s)],title:`Unit ${unit} · ${label(s)}`,description:`${s.a} · ${s.b} — Nghe, nhận diện âm/vần và ghép chữ.`,sourceLessons:s.sources,items};lessons.push(l);
    map[id][l.id]={sourceGroups:groups(s),sessions:s.sources};
    for(const sourceId of s.sources)aliases[sourceId]||=l.id;
   }
   const [storyTitle,marked]=stories[n][unit-1],targets=[...marked.matchAll(/\[([^\]]+)\]/g)].map(m=>m[1]);
   if(targets.length!==chunk.length||targets.some((word,i)=>word!==chunk[i].a))throw Error(`Story alignment ${id} unit ${unit}`);
   const storyText=marked.replace(/\[|\]/g,''),storyId=`${id}-unit-${unit}`,reviewId=`unit-${unit}-review`;
   const retrieval=chunk.map(s=>({...hear(s,'unit-'+unit+'-recall'),title:`Unit ${unit} · Sound check`}));
   const storyItems=chunk.map((s,i)=>{let k=0;const scene=marked.replace(/\[([^\]]+)\]/g,(_,word)=>k++===i?'___':word);return make(s,'story-'+unit,scene,`Listen to the story. Which word fills the gap?`,s.a,optionSet(s.a,[...targets.filter(w=>w!==s.a),...seeds.map(x=>x.a)]),{interaction:'phonics-story',skill:'listening',storyId,storyTitle,storyText,spokenScene:storyText,spokenPrompt:'Which word fills the gap?',why:`In “${storyTitle}”, Titi says: ${storyText} The missing word is “${s.a}”.`,hint:'Listen to the story again. Follow the sentence with the gap.',sourceLabel:'Original centre-authored Phonics listening story; not a textbook recording'});});
   const review={id:reviewId,kind:'unit-review',unit,focusSounds:chunk.map(label),requiredLevels:chunk.map(lessonId),title:`Unit ${unit} · Kho báu ôn tập`,description:`Ôn ${chunk.map(label).join(' · ')} + nghe truyện “${storyTitle}”${chunk.length<3?' (Unit cuối: '+chunk.length+' âm/vần)':''}.`,sourceLessons:unique(chunk.flatMap(s=>s.sources)),items:[...retrieval,...storyItems]};lessons.push(review);
   map[id][reviewId]={sourceGroups:unique(chunk.map(s=>JSON.stringify(groups(s)[0]))).map(x=>JSON.parse(x)),sessions:review.sourceLessons};
  }
  for(const l of old.lessons)aliases[l.id]=aliases[l.sourceLessons[0]];
  courses[id]={...courses[id],version:2,legacyAliases:aliases,scope:'Mỗi chặng tập trung một âm/vần theo thứ tự Guidelines. Sau 3 chặng là Kho báu Unit; Unit cuối ôn số âm còn lại. Truyện nghe do trung tâm tự biên soạn, chỉ có ở chặng ôn tập.',lessons};
 }
 fs.writeFileSync(path.join(__dirname,'../vu-tru/teaching-map.json'),JSON.stringify(map));
};
