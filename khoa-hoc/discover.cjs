/* Program-driven Discover practice. Source snapshots are immutable; this layer
 * authors practice and retains a source pointer on every question. */
const resources=require('./program/discover-reading-edit.cjs').apply(require('./program/discover-resources.json')),study=require('./program/discover-study.cjs'),grammar=require('./program/discover-grammar.cjs');
const pilot=require('../discover-preview/curated.cjs'),definitions=require('../discover-preview/definitions.cjs');
const {annotate}=require('./program/discover-dialogue.cjs');
const facts=require('./program/discover-comprehension.cjs');
const art={...require('../game-kit/adventures/pictures/family-cards/3d-v3/manifest.json').icons,...require('../game-kit/adventures/pictures/vocabulary-3d/manifest.json').items};
Object.assign(art,require('./program/discover-art.json'));
const uniq=a=>[...new Set(a)],rotate=(a,n)=>a.slice(n%a.length).concat(a.slice(0,n%a.length)),rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const options=(answer,pool,n=0)=>rotate([answer,...rotate(uniq(pool).filter(w=>w!==answer),n).slice(0,3)],n);
const wordsOf=u=>[...new Map([...u.words,...u.extra].map(w=>[w.word,w])).values()];
function sentences(u){const text=u.reading.practiceText||passage(u);return text.replace(/\b(Mr|Mrs|Ms|Dr|St)\./g,'$1∯').match(/[^.!?]+[.!?]+(?:[”"])?|[^.!?]+$/g)?.map(s=>s.replaceAll('∯','.').trim()).filter(s=>s.length>15)||[];}
function passage(u){return u.reading.correctedText||u.reading.lines.filter(l=>l.kind!=='title'&&!/SOUND\]/.test(l.text)).map(l=>l.text).join(' ').replace(/\s+/g,' ').trim();}
function base(u,skill,scene,prompt,answer,pool,extra={}){return {type:'choice',scene,prompt,spokenScene:scene,spokenPrompt:prompt,answer,options:options(answer,pool),skill,phonicsSequence:true,unit:u.unit,hint:'Look for the evidence. Listen again if you need to.',why:`${answer}.`,source:{url:skill==='grammar'?u.grammar.url:u.reading.url,unit:u.unit,kind:'centre-authored-practice'},...extra};}
function vocab(u,variant=0){
 const ws=wordsOf(u),pool=ws.map(w=>w.word),out=[];
 for(const [i,w] of ws.entries()){
  const common={targetWord:w.word,source:{url:w.source,unit:u.unit,kind:'class-vocabulary'},why:`${w.word}: ${w.meaning}. ${w.example}`,difficulty:'easy'};
  out.push(base(u,'vocabulary',definitions[w.word]||w.meaning,'Which English word matches?',w.word,pool,{...common,partType:'readChoose',spokenScene:definitions[w.word]||'Which English word matches?',spokenPrompt:''}));
  const r=new RegExp('\\b'+rx(w.word)+'\\b','i');
  if(w.example&&r.test(w.example))out.push(base(u,'vocabulary',w.example.replace(r,'___')+'\nMeaning: '+w.meaning,'Choose the missing word.',w.word,pool,{...common,partType:'readGap',difficulty:'medium',spokenScene:w.example.replace(r,'___')}));
  out.push(base(u,'listening','Listen to Titi.',variant%2?'Listen and write.':'Listen and choose.',w.word,pool,{...common,partType:variant%2?'listenWrite':'listenChoose',spokenScene:w.word,spokenPrompt:'',...(variant%2?{inputMode:'typing'}:{})}));
  if(art[w.word])out.push(base(u,'vocabulary','','Which word matches the picture?',w.word,pool,{...common,partType:'lookChoose',picturePrompt:art[w.word],spokenScene:'Look at the picture.'}));
 }
 // Cover every target before adding contextual/aural retrieval of those words.
 return out.sort((a,b)=>(a.partType==='readChoose'?0:1)-(b.partType==='readChoose'?0:1));
}
function balanced(pool){const groups=new Map();for(const q of pool){if(!groups.has(q.partType))groups.set(q.partType,[]);groups.get(q.partType).push(q);}const out=[];for(let row=0;out.length<pool.length;row++)for(const group of groups.values())if(group[row])out.push(group[row]);return out;}
function listening(u){const ws=wordsOf(u),out=[],pictured=ws.filter(w=>art[w.word]);
 for(const [i,w]of pictured.entries()){if(pictured.length<4)break;const opts=options(w.word,pictured.map(x=>x.word),i);out.push(base(u,'listening','Listen to Titi.','Listen and choose a picture.',w.word,opts,{pictureOptions:Object.fromEntries(opts.map(w=>[w,art[w]])),partType:'listenPicture',spokenScene:w.word,spokenPrompt:'',targetWord:w.word,source:{url:w.source,unit:u.unit},why:`You heard “${w.word}”. ${w.meaning}`}));}
 if(pictured.length>=3){for(let i=0;i<Math.min(3,pictured.length);i++){const trio=rotate(pictured,i).slice(0,3),answer=trio.map(w=>w.word).join(' → ');out.push(base(u,'vocabulary','Match the words and pictures.','Match the pairs.',answer,[answer,[trio[1].word,trio[0].word,trio[2].word].join(' → '),[trio[2].word,trio[1].word,trio[0].word].join(' → '),[trio[0].word,trio[2].word,trio[1].word].join(' → ')],{partType:'match',matchWords:rotate(trio.map(w=>w.word),1),matchPictures:trio.map(w=>art[w.word]),spokenScene:'',spokenPrompt:'',source:{url:trio[0].source,unit:u.unit},why:trio.map(w=>`${w.word}: ${w.meaning}`).join(' · ')}));}}
 for(const [i,w]of ws.entries())out.push(base(u,'listening','Listen to Titi.','Listen and write.',w.word,ws.map(w=>w.word),{inputMode:'typing',partType:'listenWrite',spokenScene:w.word,spokenPrompt:'',targetWord:w.word,source:{url:w.source,unit:u.unit},why:`You heard “${w.word}”. ${w.meaning}`}));
 for(let i=0;i<5;i++){const trio=rotate(ws,i).slice(0,3).map(w=>w.word),answer=trio.join(' → ');out.push(base(u,'listening','Listen to the three words.','Put the words in order.',answer,[answer,[trio[1],trio[0],trio[2]].join(' → '),[trio[2],trio[1],trio[0]].join(' → '),[trio[0],trio[2],trio[1]].join(' → ')],{partType:'order',orderWords:rotate(trio,1),spokenScene:trio.join(', ')+'.',spokenPrompt:'',why:`The recording says: ${trio.join(', ')}.`}));}return balanced(out);
}
function grammarTasks(book,u){const out=[],models=u.grammar.rules.slice(0,4),config=grammar[book.level][u.unit-1];
 for(const [i,model]of models.entries()){
  const [target,wrong,cue]=config[i];if(!model.example.includes(target))throw Error(`Grammar target missing ${book.level}/${u.unit}/${i}: ${target}`);
  const targetPattern=new RegExp('(?<![A-Za-z])'+rx(target)+'(?![A-Za-z])');
  if(!targetPattern.test(model.example))throw Error(`Grammar target is not a whole phrase: ${book.level}/${u.unit}/${target}`);
  const common={source:{url:u.grammar.url,unit:u.unit,kind:'class-grammar-model'},focus:model.tag,why:`${model.example} ${model.note}`,hint:model.note,skill:'grammar'},scene=(cue?cue+'\n':book.level===3&&u.unit===5?'Use the past continuous (yesterday).\n':'')+model.example.replace(targetPattern,'___');
  out.push(base(u,'grammar',scene,'Choose the missing words.',target,wrong,{...common,partType:'readGap',difficulty:'medium'}));
  const tokens=model.example.split(' '),a=Math.max(1,Math.ceil(tokens.length/3)),b=Math.max(a+1,Math.ceil(tokens.length*2/3)),chunks=[tokens.slice(0,a).join(' '),tokens.slice(a,b).join(' '),tokens.slice(b).join(' ')].filter(Boolean),answer=chunks.join(' → ');
  out.push(base(u,'grammar','Build the sentence.','Put the words in order.',answer,[answer,rotate(chunks,1).join(' → '),rotate(chunks,2).join(' → '),[...chunks].reverse().join(' → ')],{...common,partType:'build',orderWords:rotate(chunks,1),spokenScene:'Build the sentence.',spokenPrompt:'',difficulty:'medium'}));
  out.push(base(u,'listening','Listen to the complete sentence.','Listen and write.',model.example,[],{...common,skill:'listening',inputMode:'typing',partType:'listenWrite',spokenScene:model.example,spokenPrompt:'',difficulty:'advanced'}));
 }
 // Productive practice from the same classroom page. No guessed new grammar.
 for(const p of u.grammar.practice){if(!p.answer||!p.cues?.length)continue;out.push(base(u,'grammar',p.cues.join(' · '),'Write the sentence.',p.answer,[],{inputMode:'typing',partType:'readWrite',source:{url:u.grammar.url,unit:u.unit},spokenScene:'Use the words to write a sentence.',spokenPrompt:'',hint:p.instruction,why:`${p.answer} ${p.instruction}`}));}
 return out;
}
function readTasks(book,u){
 const dialogue=annotate(book.level,u),plain=dialogue?dialogue.map(t=>t.text).join(' '):passage(u),text=dialogue?dialogue.map(t=>t.speaker+': '+t.text).join('\n\n'):plain;
 u.reading.practiceText=plain;
 const sents=sentences(u),ws=wordsOf(u),out=[],common={storyId:`discover-${book.level}-u${u.unit}-source`,storyTitle:u.reading.title,storyText:text,storySpeech:text,source:{url:u.reading.url,unit:u.unit,kind:'original-class-reading'},difficulty:'medium'};
 const normalize=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
 for(const [prompt,answer,wrong,anchor]of facts[book.level][u.unit]||[]){
  const evidence=sents.find(s=>normalize(s).includes(normalize(anchor)))|| (normalize(plain).includes(normalize(anchor))?anchor:null);
  if(!evidence)throw Error(`Reading evidence missing ${book.level}/${u.unit}: ${anchor}`);
  out.push(base(u,'reading',text,prompt,answer,wrong.split('|'),{...common,...(dialogue?{dialogue}:{}),partType:'readChoose',spokenScene:prompt,spokenPrompt:'',why:`${answer} Evidence: “${evidence}”`,evidence,comprehension:true}));
 }
 // Evidence gaps use the complete source text, not invented story events.
 const targets=[];for(const w of ws){const r=new RegExp('\\b'+rx(w.word)+'\\b','i'),line=sents.find(s=>r.test(s));if(line)targets.push({word:w.word,line});}
 const stop=new Set('this that with have from they their there these those some when then will were into been about would could should which what where while said says your them does only very also every more such other than because after before again just much many'.split(' '));
 for(const line of sents){if(targets.length>=18)break;if(line.length>280)continue;for(const word of (line.match(/\b[a-z]{4,}\b/g)||[])){if(!stop.has(word)&&!targets.some(t=>t.word===word))targets.push({word,line});if(targets.length>=18)break;}}
 const pool=uniq(targets.map(t=>t.word));if(pool.length<10)throw Error(`Reading coverage insufficient ${book.level}/${u.unit}`);
 for(const [i,{word,line}]of targets.entries()){
  const gap=line.replace(new RegExp('\\b'+rx(word)+'\\b','i'),'___');
  out.push(base(u,'reading',text,'According to the text: '+gap,word,pool,{...common,...(dialogue?{dialogue}:{}),partType:'readChoose',spokenScene:gap,spokenPrompt:'',why:`Evidence from the reading: “${line}”`,evidence:line}));
  if(i<8)out.push(base(u,'listening',gap,'Listen and complete.',word,pool,{...common,partType:'listenGap',spokenScene:line,spokenPrompt:'',why:`The original reading says: “${line}”`,evidence:line}));
 }
 for(let i=0;i<5;i++){const lines=sents.slice(i*2,i*2+3);if(lines.length<3||lines.some(l=>l.length>150))continue;const answer=lines.join(' → ');out.push(base(u,'reading',text,'Put these lines in the order they appear in the reading.',answer,[answer,rotate(lines,1).join(' → '),rotate(lines,2).join(' → '),[...lines].reverse().join(' → ')],{...common,...(dialogue?{dialogue}:{}),partType:'sequence',partInstruction:'Put the lines in the order they appear in the reading.',orderWords:rotate(lines,1),spokenScene:'',spokenPrompt:'',why:lines.join(' '),difficulty:'advanced'}));}
 if(u.unit===1)for(const [prompt,answer,wrong,why]of pilot[book.level].facts)out.unshift(base(u,'reading',text,prompt,answer,wrong.split('|'),{...common,...(dialogue?{dialogue}:{}),partType:'readChoose',spokenScene:prompt,spokenPrompt:'',why}));
 return out;
}
function studyTasks(book,u){const rows=study[book.level][u.unit],url=`https://docs.google.com/spreadsheets/d/${book.program.source.spreadsheetId}/edit`,out=[];
 for(const r of rows){const pool=uniq([...(r.pool||[]),...rows.map(x=>x.answer),...(/silent/.test(r.prompt)?['k','n','g','t']:[]),...(/syllables/.test(r.prompt)?['1','2','3','4']:[]),...(/initial c sound/.test(r.prompt)?['/k/','/s/','/t/','/g/']:[])]);const q=base(u,'word-study',r.scene,r.prompt,r.answer,pool,{partType:'readChoose',partInstruction:r.prompt,source:{url,unit:u.unit,page:u.study.page,file:book.book.file,sha256:book.book.sha256,kind:'student-book-word-study'},why:r.why,spokenScene:r.scene,spokenPrompt:'',caseSensitive:!!r.caseSensitive,acceptedAnswers:r.acceptedAnswers||[]});out.push(q);
  // Punctuation/case exercises stay explicit choices; normalization must not
  // make a missing capital or a wrong mark count as correct.
  if(!r.caseSensitive&&!/^[.,!?]$/.test(r.answer)&&!/silent|syllable|sound/i.test(r.prompt))out.push({...q,prompt:r.prompt.replace(/^Choose /,'Write ').replace(/^Use /,'Write using '),partInstruction:r.prompt.replace(/^Choose /,'Write ').replace(/^Use /,'Write using '),partType:'readWrite',inputMode:'typing',options:[],difficulty:'advanced'});
 }
 return out;
}
function take(pool,count,label){const selected=[];const seen=new Set();for(const q of pool){const key=JSON.stringify([q.scene,q.prompt,q.answer,q.partType]);if(seen.has(key))continue;seen.add(key);selected.push(q);if(selected.length===count)return selected;}throw Error(`${label}: ${selected.length}/${count} unique tasks`);}
function course(book,old){
 const id=`discover-${book.level}`,lessons=[],p=book.program,cache=new Map(book.units.map(u=>[u.unit,{v:vocab(u),l:listening(u),g:grammarTasks(book,u),r:readTasks(book,u),s:studyTasks(book,u)}]));
 function attach(s,items){const unit=s.unit||s.units?.[0]||1;lessons.push({...s,unit,sourceLessons:s.sourceLessons||[s.id],programSource:{...p.source,row:s.sourceRow},timeLimitSeconds:s.kind==='unit-review'?1800:1200,items:items.map((q,i)=>({...q,id:`${id}-program2-${s.id}-q${i+1}`,title:`Discover ${book.level} · Unit ${q.unit}`,options:options(q.answer,q.options||[],i)}))});}
 for(const s of p.sessions){
  if(s.kind!=='practice')continue;
  const u=book.units.find(u=>u.grammarSession===s.session)||book.units.find(u=>u.readingSession===s.session)||book.units.find(u=>p.reviews.find(r=>r.unit===u.unit)?.afterSession===s.session)||book.units.find(u=>u.vocabSession===s.session);
  if(!u)throw Error(`No unit for ${id}/${s.id}`);const c=cache.get(u.unit);let items;
  if(u.grammarSession===s.session)items=take([...c.g,...c.l,...c.v],30,s.id);
  else if(p.reviews.find(r=>r.unit===u.unit)?.afterSession===s.session){const next=book.units.find(v=>v.vocabSession===s.session&&v.unit!==u.unit);items=take([...c.s,...(next?cache.get(next.unit).v.slice(0,10):c.r.slice(0,10)),...c.g,...c.v,...c.l],30,s.id);}
  else if(u.readingSession===s.session)items=s.session===1?take([...c.v.filter(q=>q.partType==='readChoose'),...c.r.slice(0,10),...c.l.filter(q=>q.partType==='order').slice(0,3),...c.l,...c.v],30,s.id):take([...take(c.r.filter(q=>q.skill==='reading'),12,'reading retrieval'),...c.r.filter(q=>q.skill==='listening').slice(0,5),...c.r.filter(q=>q.partType==='sequence').slice(0,3),...c.l,...vocab(u,1)],30,s.id);
  else items=take([...c.v.filter(q=>q.partType==='readChoose'),...c.l.slice(0,10),...c.v.filter(q=>q.partType==='lookChoose'),...c.v,...c.l],30,s.id);
  attach({...s,unit:u.unit},items);
  const review=p.reviews.find(r=>r.afterSession===s.session);if(review){const unit=book.units[review.unit-1],c=cache.get(unit.unit);attach(review,take([...take(c.v,wordsOf(unit).length,'review vocabulary'),...take(c.g.filter(q=>q.skill==='grammar'),8,'review grammar'),...take(c.r.filter(q=>q.skill==='reading'),10,'review reading'),...take(c.s,5,'review word study'),...take(c.l,22-wordsOf(unit).length,'review listening')],45,review.id));}
 }
 const aliases=Object.fromEntries((old?.lessons||[]).map(l=>[l.id,`lesson-${book.units[(Number(l.id.match(/game-(\d+)/)?.[1])||1)-1]?.vocabSession||1}`]));
 return {...old,id,name:`Discover ${book.level}`,version:6,curriculumVersion:'discover-program-2',scope:'Program · 62 tiết × 30 câu · 18 Unit Review × 45 câu · bài đọc và ngữ pháp từ tài liệu lớp.',legacyAliases:aliases,oralSessions:p.sessions.filter(s=>s.kind==='oral'),programIssues:p.issues,lessons};
}
function build(courses){for(const b of resources.books)courses[`discover-${b.level}`]=course(b,courses[`discover-${b.level}`]);return courses;}
module.exports=build;module.exports.course=course;module.exports.resources=resources;
