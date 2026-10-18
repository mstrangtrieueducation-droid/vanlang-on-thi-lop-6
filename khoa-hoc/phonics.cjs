const fs=require('node:fs'),path=require('node:path');
const units=require('./phonics-units.cjs'),stories=require('./phonics-book-stories.cjs'),sources=require('./phonics-classroom-sources.json');
const pictures=require('../game-kit/adventures/pictures/book-cards/manifest.json');
const unique=a=>[...new Set(a)],rotate=(a,n)=>a.slice(n%a.length).concat(a.slice(0,n%a.length));
const label=p=>({'th-voiced':'th /ð/','th-unvoiced':'th /θ/','c-soft':'c /s/','g-soft':'g /dʒ/','s-voiced':'s /z/','y-ee':'y /i/','y-igh':'y /aɪ/','u_e-yoo':'u_e /juː/','u_e-oo':'u_e /uː/'}[p]||p);
function belongs(word,p,n){const w=word.toLowerCase(),s=p.split('-')[0];
 if(n===1)return p==='x'?w.includes('x'):w.startsWith(p);
 if(p==='th-voiced')return ['this','that','mother','father'].includes(w);
 if(p==='th-unvoiced')return ['three','teeth','think','bath'].includes(w);
 if(p.includes('-'))return units[n].flatMap(u=>u.levels).some(l=>l.patterns.includes(p)&&l.words.map(x=>x.toLowerCase()).includes(w));
 if(s.includes('_'))return new RegExp(s.replace('_','[b-df-hj-np-tv-z]+')+'$').test(w);
 return n===2&&s.length>1?w.endsWith(s):w.includes(s);
}
const storySessions={1:[2,3,5,6,9,10,12,14],2:[2,3,5,6,9,11,13,15],3:[2,4,6,8,11,13,15,17],4:[1,2,3,4,5,6,null,null]};
const permutations=a=>[[a[0],a[1],a[2]],[a[1],a[0],a[2]],[a[2],a[1],a[0]],[a[0],a[2],a[1]]].map(x=>x.join(' → '));
module.exports=function install(courses){
 const map=JSON.parse(JSON.stringify(require('./legacy/teaching-map-before-phonics.json')));
 for(const n of [1,2,3,4]){
  const id='phonics-'+n,all=unique(units[n].flatMap(u=>u.levels.flatMap(l=>l.words))),lessons=[],aliases={};map[id]={};
  const pic=w=>pictures[n+':'+w];
  function options(answer,pool,seed=0){const others=rotate(unique(pool).filter(w=>w!==answer),seed).slice(0,3);if(others.length!==3)throw Error('Missing distractors '+answer);return rotate([answer,...others],seed);}
  function build(u,l,stage){
   const lessonId=`unit-${u.unit}-stage-${stage}`,focus=l.patterns.map(label).join(' · '),words=l.words,unitWords=unique(u.levels.flatMap(l=>l.words));
   const make=(index,kind,scene,prompt,answer,pool,extra={})=>({id:`${id}-v3-u${u.unit}-s${stage}-q${index+1}`,type:'choice',title:`Unit ${u.unit} · ${focus}`,scene,prompt,spokenScene:scene,spokenPrompt:prompt,answer,options:options(answer,pool,index),skill:'phonics',interaction:kind,phonicsSequence:true,focus,focusSounds:l.patterns,difficulty:['easy','medium','advanced'][Math.floor(index/5)],hint:'Listen again. Look carefully, then choose.',why:`${answer}: practise ${focus}.`,sourceLabel:`Oxford Phonics World ${n} · Unit ${u.unit} · centre practice`,...extra});
   const items=[];
   for(let round=0;round<3;round++){
    const index=round*5,word=words[Math.floor(round*words.length/3)],look=words[(Math.floor(round*words.length/3)+1)%words.length],groupWord=words[(Math.floor(round*words.length/3)+2)%words.length],wordOptions=options(word,unitWords,index);
    items.push(make(index,'picture','Listen to Titi.','Listen and choose the correct picture.',word,wordOptions,{spokenScene:word,skill:'listening',pictureOptions:Object.fromEntries(wordOptions.map(w=>[w,pic(w)])),why:`Titi said “${word}”. Match the whole spoken word to its picture.`}));
    items.push(make(index+1,'phonics-look','','Look at the picture. Choose the correct word.',look,unitWords,{picturePrompt:pic(look),spokenScene:'Look carefully at the picture.',why:`This picture shows “${look}”. Read every letter, including the ending.`}));
    const p=l.patterns.find(p=>belongs(groupWord,p,n))||l.patterns[0];
    let wrong=unitWords.filter(w=>!belongs(w,p,n)),group=label(p);
    // Some units contain one vowel family throughout. Contrast an ending within
    // that unit instead of introducing untaught words as distractors.
    if(wrong.length<3){group=groupWord.slice(-2);wrong=unitWords.filter(w=>!w.endsWith(group));}
    if(wrong.length<3)throw Error('Cannot form an unambiguous in-unit category '+id+' '+u.unit);
    items.push(make(index+2,'phonics-category',`Group: ${group}`,n===1?'Which word belongs to this letter group?':'Which word belongs to this spelling group?',groupWord,wrong,{spokenScene:'Look at the group label.',focusSounds:[p],why:`“${groupWord}” belongs to the ${group} spelling group. The other words do not use this spelling pattern.`}));
    const order=rotate(words,Math.floor(round*words.length/3)).slice(0,3),joined=order.join(' → ');
    items.push(make(index+3,'phonics-order','Listen, then put the cards in order.','Tap the words in the order you hear them.',joined,permutations(order),{orderWords:[...order].sort(),spokenScene:order.join(', ')+'.',skill:'listening',why:`The spoken order is: ${order.join(', ')}.`,hint:'Listen to the first word, then the second and third. Tap a placed card to undo it.'}));
    const match=rotate(words,Math.floor(round*words.length/3)+1).slice(0,3),matchAnswer=match.join(' → ');
    items.push(make(index+4,'phonics-match','Match each word to a picture.','Tap a word, then tap its matching picture.',matchAnswer,permutations(match),{matchWords:[...match].sort(),matchPictures:match.map(pic),spokenScene:'Match all three pairs.',why:`Pictures one, two and three show: ${match.join(', ')}.`,hint:'Choose a word on the left, then its picture on the right. You can change a pair before checking.'}));
   }
   // One meaningful final-sound discrimination task, with taught vocabulary only.
   const endings=require('./program/ending-sounds.cjs');
   const eligible=words.map(target=>({target,answer:unitWords.find(w=>w!==target&&endings[w.toLowerCase()]&&endings[w.toLowerCase()]===endings[target.toLowerCase()]),wrong:unitWords.filter(w=>endings[w.toLowerCase()]&&endings[w.toLowerCase()]!==endings[target.toLowerCase()])})).find(x=>x.answer&&x.wrong.length>=3);
   if(eligible){const {target,answer,wrong}=eligible,phoneme='/'+endings[target.toLowerCase()]+'/';items[7]=make(7,'ending-sound','Listen to the whole word.','Which word has the same last sound?',answer,wrong,{id:id+'-v3-u'+u.unit+'-s'+stage+'-ending-v1',spokenScene:target,spokenPrompt:'Which word has the same last sound?',skill:'listening',partType:'listenChoose',cognitiveLevel:'medium',targetWord:target,endingPhoneme:phoneme,why:'Nghe “'+target+'” và “'+answer+'”: cả hai kết thúc bằng '+phoneme+'. Nghe âm của cả từ; đừng đọc tên chữ cái.',hint:'Listen to the very end of the word.'});}

   return {id:lessonId,kind:'sound',unit:u.unit,stage,focusSounds:l.patterns.map(label),title:`Unit ${u.unit} · ${focus}`,description:`15 câu · ${words.join(' · ')} · Nghe, nhìn tranh, phân loại, xếp thứ tự, nối cặp.`,sourceLessons:l.session?['lesson-'+l.session]:[],pendingTeaching:!l.session,items};
  }
  function attach(l){lessons.push(l);const rows=l.sourceLessons.map(s=>sources.find(r=>r.course===id&&r.session===Number(s.split('-')[1])));map[id][l.id]={sourceGroups:rows.map(r=>r?.urls||[]),sessions:l.sourceLessons,pendingTeaching:!!l.pendingTeaching};}
  for(const u of units[n]){
   const chunk=u.levels.map((l,i)=>build(u,l,i+1));chunk.forEach(attach);
   for(let i=0;i<3;i++){for(const p of u.levels[i].patterns)aliases['sound-'+p]||=chunk[i].id;for(const s of chunk[i].sourceLessons)aliases[s]||=chunk[i].id;}
   const [storyTitle,storyText]=stories[n][u.unit-1],vocabulary=unique(u.levels.flatMap(l=>l.words));
   const rx=w=>new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');
   const targets=vocabulary.filter(w=>rx(w).test(storyText));if(targets.length<3)throw Error('Too few verified story targets '+id+' '+u.unit);
   const storyItems=targets.slice(0,4).map((word,i)=>{const sentence=(storyText.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).find(s=>rx(word).test(s)).trim();return {id:`${id}-v3-u${u.unit}-story-gap-${i+1}`,type:'choice',title:`Unit ${u.unit} · Story`,scene:sentence.replace(rx(word),'___'),prompt:'Listen to the story. Which word fills the gap?',spokenPrompt:'Listen. Which word fills the gap?',spokenScene:sentence,answer:word,options:options(word,vocabulary,i+u.unit),skill:'listening',interaction:'phonics-story',phonicsSequence:true,difficulty:'advanced',focusSounds:unique(u.levels.flatMap(l=>l.patterns)),storyId:`${id}-u${u.unit}`,storyTitle,storyText,storySource:{book:n,page:u.page,url:u.bookURL},why:`In “${storyTitle}”, you hear: ${sentence} The missing word is “${word}”.`,hint:'Listen to this part again, or play the whole story.',sourceLabel:`Oxford Phonics World ${n}, Unit ${u.unit}, p.${u.page} · Titi narration of the supplied textbook text`};});
   // Match longest phrases first: “phone” inside “cell phone” is not a second
   // event for the child to order. Avoid overlapping word/phrase cards entirely.
   const spokenMatches=[...storyText.matchAll(new RegExp('\\b(?:'+targets.slice().sort((a,b)=>b.length-a.length).map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\b','gi'))].map(m=>m[0].toLowerCase());
   const heard=unique(spokenMatches).filter((w,i,a)=>!a.slice(0,i).some(p=>rx(w).test(p)||rx(p).test(w)));
   if(heard.length<3)throw Error('Too few distinct story sequence cards '+id+' '+u.unit);
   if(storyItems.length===3){const answer=targets.reduce((a,b)=>storyText.toLowerCase().lastIndexOf(a.toLowerCase())>storyText.toLowerCase().lastIndexOf(b.toLowerCase())?a:b);storyItems.push({...storyItems[0],id:`${id}-v3-u${u.unit}-story-last`,scene:'Listen to the whole story.',prompt:'Which of these words do you hear last?',spokenPrompt:'Which of these words do you hear last?',spokenScene:storyText,answer,options:options(answer,vocabulary,7),why:`The last of these words in the story is “${answer}”.`});}
   for(let i=0;i<2;i++){const last=i===1&&heard.length===3,order=last?[...heard].sort((a,b)=>storyText.toLowerCase().lastIndexOf(a.toLowerCase())-storyText.toLowerCase().lastIndexOf(b.toLowerCase())):heard.slice(i,i+3),answer=order.join(' → ');storyItems.push({...storyItems[0],id:`${id}-v3-u${u.unit}-story-order-${i+1}`,interaction:'phonics-order',scene:'Listen to the whole story. Follow these three words.',prompt:`Put the words in the order they ${last?'last':'first'} appear in the story.`,spokenPrompt:`Listen to the story. Put the words in the order they ${last?'last':'first'} appear.`,spokenScene:storyText,answer,options:options(answer,permutations(order),i),orderWords:[...order].sort(),why:`In “${storyTitle}”, these words ${last?'last':'first'} appear in this order: ${order.join(', ')}.`,hint:'Listen to the whole story again. Follow only the three words on your cards.'});}
   // 13 tasks per focus + 6 textbook-story tasks = 45 (15 at each difficulty).
   const retrieval=chunk.flatMap(l=>l.items.slice(0,13).map(q=>({...q,id:q.id+'-review'})));
   attach({id:`unit-${u.unit}-checkpoint`,kind:'unit-review',unit:u.unit,focusSounds:chunk.flatMap(l=>l.focusSounds),requiredLevels:chunk.map(l=>l.id),title:`Unit ${u.unit} · Kho báu ôn tập`,description:`45 câu · Ôn trọn Unit ${u.unit} + Story: ${storyTitle}.`,sourceLessons:unique(chunk.flatMap(l=>l.sourceLessons).concat(storySessions[n][u.unit-1]?['lesson-'+storySessions[n][u.unit-1]]:[])),pendingTeaching:chunk.some(l=>l.pendingTeaching),items:[...retrieval,...storyItems]});
   aliases[`unit-${u.unit}-review`]=`unit-${u.unit}-checkpoint`;
  }
  for(const old of require('./legacy/'+id+'.json').lessons)aliases[old.id]=aliases[old.sourceLessons[0]]||lessons[0].id;
  courses[id]={...courses[id],version:3,legacyAliases:aliases,scope:'Oxford Phonics World: 8 Unit. Mỗi Unit gồm 3 chặng × 15 câu và 1 Kho báu ôn tập × 45 câu. Truyện theo trang Story của sách; học sinh chỉ mở nội dung đã học trên lớp.',lessons};
 }
 module.exports.teachingMap=map;
};
