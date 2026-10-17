/* Build classroom-aligned practice; source tests are installed separately. */
const fs=require('node:fs'),path=require('node:path');
const units=require('./program/family-units.cjs'),readings=require('./program/family-readings.cjs'),grammar=require('./program/family-grammar.cjs'),sounds=require('./program/family-sounds.cjs');
const grammarRules=require('./program/family-grammar-rules.cjs');
const stories=require('./program/family-stories.cjs');
const program=require('./program/parse.cjs').family(),pictures=require('../game-kit/adventures/pictures/family-cards/manifest.json');
const uniq=a=>[...new Set(a)],rotate=(a,n=0)=>a.slice(n%a.length).concat(a.slice(0,n%a.length));
function opts(answer,pool,seed){const wrong=rotate(uniq(pool).filter(x=>x!==answer),seed).slice(0,3);if(wrong.length!==3)throw Error('FF distractors: '+answer);return rotate([answer,...wrong],seed);}
const perms=a=>[a,[a[1],a[0],a[2]],[a[2],a[1],a[0]],[a[0],a[2],a[1]]].map(x=>x.join(' → '));
module.exports=function(courses){
 const map=JSON.parse(JSON.stringify(require('./phonics.cjs').teachingMap)),legacy=require('./legacy/teaching-map-before-phonics.json');
 for(const n of [1,2]){
  const id=`family-friends-${n}`,old=courses[id],lessons=[],aliases={},sessions={};
  for(const entry of Object.values(legacy[id]))(entry.sessions||[]).forEach((s,i)=>{const number=Number(String(s).match(/\d+/)?.[0]);if(number)sessions[number]=uniq([...(sessions[number]||[]),...(entry.sourceGroups?.[i]||[])]);});
  map[id]={};
  function attach(l){lessons.push(l);map[id][l.id]={sessions:l.sourceLessons,sourceGroups:l.sourceLessons.map(s=>sessions[Number(s.replace('lesson-',''))]||[]),pendingTeaching:!!l.pendingTeaching};}
  function build(u,stage,variant=0){
   const items=[],pic=w=>pictures[`${n}:${u.unit}:${w}`],words=u.words,all=uniq([...words,...u.extra]),source=program.units[u.unit-1].stages[stage-1];
   function add(interaction,scene,prompt,answer,pool,extra={}){const k=items.length;items.push({id:`${id}-program-u${u.unit}-s${stage}-v${variant}-q${k+1}`,type:'choice',title:`Unit ${u.unit} · ${u.title}`,scene,prompt,spokenScene:scene,spokenPrompt:prompt,answer,options:opts(answer,pool,k+variant),interaction,phonicsSequence:true,skill:'vocabulary',difficulty:['easy','medium','advanced'][Math.floor(k/5)],hint:'Look carefully. Listen again, then check your answer.',why:`The answer is “${answer}”.`,sourceLabel:`Family and Friends ${n} · Unit ${u.unit} · centre-authored practice`,source:{url:u.bookURL,page:u.page+(stage-1)*2,programRow:source.sourceRow},...extra});}
   if(stage===1){for(let i=0;i<5;i++){
    const w=words[(i+variant)%words.length],look=words[(i+1+variant)%words.length],o=opts(w,words,i);
    add('picture','Listen to Titi.','Listen and choose the correct picture.',w,o,{spokenScene:w,skill:'listening',pictureOptions:Object.fromEntries(o.map(x=>[x,pic(x)])),why:`Titi says “${w}”. Match its sound to the picture.`});
    add('phonics-look','','Look at the picture. Choose the correct word.',look,words,{picturePrompt:pic(look),spokenScene:'Look at the picture.',why:`The picture shows “${look}”. Check the whole word.`});
    const g=grammar[n][u.unit-1][(i+variant)%5];add('grammar',g.scene,'Choose the words that complete the sentence.',g.answer,g.wrong,{skill:'grammar',spokenScene:g.scene.replace('___','…'),why:`${g.scene.replace('___',g.answer)} ${grammarRules[n][u.unit-1]}`});
   }}else if(stage===2){for(let i=0;i<5;i++){
    const w=u.extra[(i+variant*5)%u.extra.length],cut=Math.max(1,Math.floor(w.length/2)),letter=w[cut],wrong=['a','e','i','o','u','r','s','t'].filter(c=>c!==letter).map(c=>w.slice(0,cut)+c+w.slice(cut+1));
    add('spelling','Listen, then read each spelling.','Choose the correctly spelt word.',w,wrong,{spokenScene:w,skill:'listening',why:`The correct spelling is “${w}”. Listen and check each letter.`});
    const g=grammar[n][u.unit-1][(i+variant)%5],sentence=g.scene.replace('___',g.answer),tokens=sentence.split(' '),a=Math.max(1,Math.floor(tokens.length/3)),b=Math.max(a+1,Math.floor(tokens.length*2/3)),chunks=[tokens.slice(0,a).join(' '),tokens.slice(a,b).join(' '),tokens.slice(b).join(' ')];
    add('phonics-order','Build the sentence.','Put the three parts in the correct order.',chunks.join(' → '),perms(chunks),{orderWords:rotate(chunks,1),spokenScene:'Put the sentence parts in order.',skill:'grammar',why:sentence+' '+grammarRules[n][u.unit-1]});
    const groups=sounds[n][u.unit-1].split(';').map(x=>{const [pattern,words]=x.split(':');return {pattern,words:words.split(',')};});
    if(groups[0].pattern==='alphabet'){const start=(i*4+variant)%23,alphabet='abcdefghijklmnopqrstuvwxyz',answer=alphabet[start+1];add('phonics-category',`${alphabet[start]} · ___ · ${alphabet[start+2]}`,'Which letter is missing?',answer,alphabet.split(''),{spokenScene:'Look at the alphabet order.',skill:'phonics',why:`The alphabet order is ${alphabet[start]}, ${answer}, ${alphabet[start+2]}.`});}
    else {const group=groups[(i+variant)%groups.length],w=group.words[Math.floor((i+variant)/groups.length)%group.words.length],p=group.pattern.replace(/^initial-/,'').replace(/^short-/,''),letters=p.replace('_',''),isSplit=p.includes('_');let scene,answer;
     if(isSplit){scene=w.replace(p[0],'_').replace(/e$/,'_');answer=p;}
     else{scene=w.replace(p,'___');answer=p;}
     const pool=uniq([...groups.map(x=>x.pattern.replace(/^initial-/,'').replace(/^short-/,'')),...['a','e','i','o','u','sh','ch','th','ng','nk']]);
     add('phonics-category',scene,'Listen. Which letters complete this word?',answer,pool,{spokenScene:w,skill:'phonics',why:`“${w}” uses ${answer}. ${isSplit?'The final e changes the vowel sound.':'Look at the letters in the gap.'}`});
    }
   }}else{
    const [title,text,facts]=readings[n][u.unit-1],story={storyId:`${id}-u${u.unit}-reading`,storyTitle:title,storyText:text,storySource:{url:u.bookURL,page:u.readingPage,book:n}};
    for(const row of rotate(facts,variant)){const [prompt,answer,...wrong]=row;add('reading',text,prompt,answer,wrong,{...story,skill:'reading',spokenScene:prompt,spokenPrompt:'Read the passage and choose.',why:`${prompt} ${answer}. Check the detail in “${title}”.`});}
    let targets=all.filter(w=>new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(text));
    const stop=new Set('the and this that these those with have has got are was were she him her his its can our you your my for too then now from into not yes'.split(' '));targets=uniq([...targets,...facts.map(f=>f[1]).filter(w=>text.toLowerCase().includes(w.toLowerCase())),...(text.match(/[A-Za-z]{3,}/g)||[]).filter(w=>!stop.has(w.toLowerCase()))]);
    const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text]; targets=targets.filter(w=>sentences.some(s=>new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(s))); targets=[...new Map(targets.map(w=>[w.toLowerCase(),w])).values()];
    for(let i=0;i<5;i++){
     // Use an actual sentence from the reading. If a text has little target
     // vocabulary, listen for the factual answer instead of inventing a story.
     const word=targets[(i+variant)%targets.length];
     if(word){const rx=new RegExp('\\b'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),sentence=sentences.find(s=>rx.test(s)).trim();add('phonics-story',sentence.replace(rx,'___'),'Listen and complete this part of the reading.',word,uniq([...all,...targets]),{...story,spokenScene:sentence,skill:'listening',why:`The text says: ${sentence}`});}
     else {const [prompt,answer,...wrong]=facts[(i+variant)%facts.length];add('listening','Listen to the passage.',prompt,answer,wrong,{...story,spokenScene:text,skill:'listening',why:`In “${title}”, the answer is ${answer}.`});}
    }
    for(let i=0;i<5;i++){const trio=rotate(words,i+variant).slice(0,3),answer=trio.join(' → ');if(i%2===0)add('phonics-match','Match the words to the pictures.','Choose a word, then its matching picture.',answer,perms(trio),{matchWords:rotate(trio,1),matchPictures:trio.map(pic),spokenScene:'Match all three pairs.',why:`Pictures 1, 2 and 3 show ${trio.join(', ')}.`});else add('phonics-order','Listen to the three words.','Tap the words in the order you hear them.',answer,perms(trio),{orderWords:rotate(trio,1),spokenScene:trio.join(', ')+'.',skill:'listening',why:`The order you hear is ${trio.join(', ')}.`});}
   }
   return {id:`unit-${u.unit}-stage-${stage}`,unit:u.unit,stage,kind:'practice',title:`Unit ${u.unit} - Lesson ${source.bookLessons.join(' & ')}`,description:'15 câu · '+u.title,sourceLessons:['lesson-'+source.session],programSource:{url:program.source,row:source.sourceRow},items};
  }
  // Keep the familiar Starter questions; extend from the supplied starter
  // vocabulary with explicit number/colour/alphabet tasks, never copy a Unit.
  const starter=require('./program/family-starter.cjs')[n].map(([scene,prompt,answer,...wrong],i)=>({id:`${id}-program-starter-${i+1}`,type:'choice',title:'Starter',scene:prompt.startsWith('Listen')?'Listen to Titi.':scene,prompt,spokenScene:prompt.startsWith('Listen')?answer:scene,answer,options:opts(answer,wrong,i),skill:prompt.startsWith('Listen')?'listening':scene.includes('___')?'grammar':'dialogue',why:scene.includes('___')?scene.replace('___',answer):`${scene} → ${answer}`,source:{url:units[n][0].bookURL,page:4},sourceLabel:`Family and Friends ${n} · Starter pp. 4–7 · centre practice`}));
  attach({id:'starter',kind:'practice',title:n===1?'Starter - Hello!':'Starter - Welcome back!',sourceLessons:['lesson-1'],items:starter});
  for(const u of units[n]){
   const stages=[1,2,3].map(s=>build(u,s));stages.forEach(attach);
   const reviewItems=[1,2,3].flatMap(s=>build(u,s,1).items);
   const [panels,targets,facts]=stories[n][u.unit-1],storyText=panels.join('\n\n'),storySource={url:u.bookURL,page:u.page,book:n,lesson:1};
   const common={type:'choice',title:`Unit ${u.unit} · Lesson 1 story`,phonicsSequence:true,storyId:`${id}-u${u.unit}-lesson1`,storyTitle:u.title,storyText,storySource,source:storySource,sourceLabel:`Family and Friends ${n} · Lesson 1 transcript · Titi narration; centre-authored questions`,hint:'Listen again. Find the detail in the story.'};
   const storyItems=targets.map((answer,i)=>{
    const rx=new RegExp('\\b'+answer.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');
    const sentence=panels.flatMap(p=>p.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).find(s=>rx.test(s))?.trim();
    if(!sentence)throw Error(`Missing Lesson 1 story target ${id}/${u.unit}/${answer}`);
    return {...common,id:`${id}-program-u${u.unit}-story1-${i+1}`,scene:sentence.replace(rx,'___'),prompt:'Listen and complete the story sentence.',spokenScene:sentence,spokenPrompt:'Choose the missing word.',answer,options:opts(answer,uniq([...targets,...u.words,...u.extra]),i),interaction:'phonics-story',skill:'listening',difficulty:i?'medium':'easy',why:`The story says: ${sentence}`};
   }).concat(facts.map(([prompt,answer,...wrong],i)=>({...common,id:`${id}-program-u${u.unit}-story1-${i+4}`,scene:storyText,prompt,spokenScene:prompt,spokenPrompt:'Read the story and choose.',answer,options:opts(answer,wrong,i),interaction:'reading',skill:'reading',difficulty:i?'advanced':'medium',why:`${prompt} ${answer} Read the Lesson 1 story again to check the detail.`})));
   // Replace five repeated vocabulary tasks, retaining all five grammar tasks,
   // Lesson 5 reading/listening and the exact 45-question checkpoint length.
   [0,1,3,4,6].forEach((slot,i)=>{reviewItems[slot]=storyItems[i];});
   attach({id:`unit-${u.unit}-checkpoint`,unit:u.unit,kind:'unit-review',title:`Unit ${u.unit} - Unit Review`,description:'45 câu · '+u.title,requiredLevels:stages.map(l=>l.id),sourceLessons:stages.flatMap(l=>l.sourceLessons),timeLimitSeconds:1800,items:reviewItems});
   if(u.unit%3===0){const test=require('./program/family-tests.cjs')(n,u.unit/3);attach({...test,sourceLessons:program.units.slice(u.unit-3,u.unit).flatMap(x=>x.stages.map(s=>'lesson-'+s.session)),requiredLevels:lessons.filter(l=>l.kind==='unit-review'&&l.unit>u.unit-3&&l.unit<=u.unit).map(l=>l.id)});}
  }
  for(const l of old.lessons){const source=l.sourceLessons||[];aliases[l.id]=lessons.find(x=>x.sourceLessons.some(s=>source.includes(s)))?.id||'starter';}
  courses[id]={...old,version:4,legacyAliases:aliases,scope:'Theo Program: 15 Unit; mỗi Unit 3 bài luyện × 15 câu và 1 bài ôn tập × 45 câu. Sau mỗi 3 Unit có bài kiểm tra từ đề gốc. Không thay phần phỏng vấn trên lớp.',lessons};
 }
 module.exports.teachingMap=map;
};
