const fs=require('node:fs'),path=require('node:path');
const source=require('./source.json'),curated=require('./curated.cjs'),definitions=require('./definitions.cjs'),{plan}=require('../khoa-hoc/program/discover-plan.cjs');
const root=__dirname,uniq=a=>[...new Set(a)],rotate=(a,n)=>a.slice(n%a.length).concat(a.slice(0,n%a.length));
const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const atlasWords={animals:['feathers','wings','eggs','fur','scales','gills','amphibians','mammals','ear','eye','mouth','leg'],space:['asteroid','comet','meteorite','solar system','stars','moon','galaxy','universe','spacecraft','telescope','observatory']};
// Inspected sprite bounds: keep adjacent objects outside the displayed card.
const crops={animals:[[16,15,295,390],[320,20,305,355],[640,65,290,295],[945,30,305,370],[0,425,312,380],[317,460,313,310],[635,450,300,350],[950,438,300,350],[0,818,314,415],[321,819,306,330],[635,819,302,406],[956,815,292,425]],space:[[0,65,314,320],[315,55,310,340],[635,170,245,195],[922,50,330,330],[0,430,310,340],[325,460,275,280],[630,435,307,300],[940,420,310,335],[0,840,315,300],[330,780,295,415],[630,790,310,380]]};
const art=Object.fromEntries(Object.entries(atlasWords).flatMap(([atlas,words])=>words.map((w,cell)=>[w,{atlas:`../discover-preview/art/${atlas}.png`,columns:4,rows:3,cell,size:1254,crop:crops[atlas][cell]}])));
function options(answer,pool,seed){const wrong=rotate(uniq(pool).filter(x=>x!==answer),seed).slice(0,3);if(wrong.length!==3)throw Error('Not enough distractors: '+answer);return rotate([answer,...wrong],seed);}
function reading(book){
 // Join source audio fragments into sentences; never assign an entire narrative
 // to a character just because it mentions that character's name.
 const lines=book.reading.filter(x=>x.kind!=='title');
 if(book.level!==1)return lines.map(x=>x.text).join(' ');
 const turns=[];
 for(const l of lines){let speaker='Narrator';
  if(l.image==='seb-family'&&/^We /.test(l.text))speaker="Seb's family";
  if(l.image==='mandy-family'&&/^We /.test(l.text))speaker="Mandy's family";
  if(l.image==='kim-family'&&/^We /.test(l.text))speaker="Kim's family";
  if(l.image==='friends'&&/^We /.test(l.text))speaker='Friends';
  if(turns.at(-1)?.speaker===speaker)turns.at(-1).text+=' '+l.text;else turns.push({speaker,text:l.text});
 }
 return turns.map(x=>x.speaker+': '+x.text).join('\n\n');
}
const courses=[];
for(const book of source.books){
 const n=book.level,id=`discover-${n}`,c=curated[n],p=plan(n),storyText=reading(book),lessons=[];
 const baseSource={url:book.source,unit:1,kind:'class-resource'},grammarSource={url:book.grammarSource,unit:1,kind:'class-grammar-resource'},studySource={url:`https://docs.google.com/spreadsheets/d/${p.source.spreadsheetId}/edit`,unit:1,...book.bookSource,kind:'supplied-student-book-word-study'};
 function make(lessonId){const items=[];
  const add=(scene,prompt,answer,pool,extra={})=>{const index=items.length;const q={id:`${id}-pilot-${lessonId}-${index+1}`,type:'choice',scene,prompt,spokenScene:scene,spokenPrompt:prompt,answer,options:options(answer,pool,index+n),skill:'vocabulary',phonicsSequence:true,source:baseSource,sourceLabel:`Discover ${n} · centre-authored practice from Program and class resources`,why:`The answer is ${answer}.`,hint:'Listen again, or find the matching detail in the text.',...extra};items.push(q);return q;};
  function vocab(words,count=10){for(let i=0;i<count;i++){const w=words[i%words.length];if(!definitions[w.word])throw Error('Missing definition '+w.word);add(definitions[w.word],'Which word fits this meaning?',w.word,words.map(w=>w.word),{source:{url:w.source,unit:words===book.sessions['3']?2:1},targetWord:w.word,why:`${w.word}: ${definitions[w.word]} Nghĩa: ${w.meaning}.`,...(i>=words.length?{scene:w.meaning,spokenScene:'Which word matches this meaning?',prompt:'Which English word matches?'}:{}),...(i%3===1&&art[w.word]?{picturePrompt:art[w.word],scene:'',spokenScene:'Look at the picture.',prompt:'Which word matches the picture?',partType:'lookChoose'}:{})});}}
  function listening(words,count=5){const available=words.filter(w=>art[w.word]);for(let i=0;i<count;i++){const w=available.length>=4?available[i%available.length]:words[i%words.length],pool=available.length>=4?available:words,opts=options(w.word,pool.map(w=>w.word),i),write=lessonId==='lesson-2'&&i>2;add('Listen to Titi.',write?'Listen and write.':'Listen and choose.',w.word,opts,{spokenScene:w.word,skill:'listening',partType:write?'listenWrite':available.length>=4?'listenPicture':'listenChoose',...(write?{inputMode:'typing'}:available.length>=4?{pictureOptions:Object.fromEntries(opts.map(w=>[w,art[w]]))}:{}),targetWord:w.word,source:{url:w.source,unit:words===book.sessions['3']?2:1},why:`You heard “${w.word}”. ${definitions[w.word]}`});}}
  function order(words,count=5){for(let i=0;i<count;i++){const trio=rotate(words.map(w=>w.word),i).slice(0,3),ans=trio.join(' → '),match=i>2&&trio.every(w=>art[w]);add(match?'Match the words and pictures.':'Listen to the three words.',match?'Match the pairs.':'Put the words in order.',ans,[ans,[trio[1],trio[0],trio[2]].join(' → '),[trio[2],trio[1],trio[0]].join(' → '),[trio[0],trio[2],trio[1]].join(' → ')],{...(match?{matchWords:rotate(trio,1),matchPictures:trio.map(w=>art[w])}:{orderWords:rotate(trio,1)}),spokenScene:match?'Match the words and pictures.':trio.join(', ')+'.',skill:match?'vocabulary':'listening',partType:match?'match':'order',source:{...baseSource,unit:words===book.sessions['3']?2:1},why:match?`The pictures match these words: ${trio.join(', ')}.`:`The recording says: ${trio.join(', ')}.`});}}
  function grammar(count=10){c.grammar.slice(0,count).forEach(([scene,answer,wrong,why])=>add(scene,'Choose the missing words.',answer,wrong.split('|'),{skill:'grammar',why,partType:'readGap',source:grammarSource}));}
  function grammarWrite(){c.grammar.slice(0,5).forEach(([scene,answer,wrong,why])=>add(scene,'Write the missing words.',answer,wrong.split('|'),{inputMode:'typing',skill:'grammar',why,partType:'readWrite',source:grammarSource}));}
  function buildSentences(){c.grammar.slice(0,5).forEach(([scene,answer,,why])=>{let sentence=scene.replace('___',answer).replace(/ \(negative\)/,'');if(sentence.startsWith('Replace '))sentence=sentence.slice(sentence.indexOf(': ')+2);const words=sentence.split(' '),a=Math.ceil(words.length/3),b=Math.ceil(words.length*2/3),chunks=[words.slice(0,a).join(' '),words.slice(a,b).join(' '),words.slice(b).join(' ')],ans=chunks.join(' → ');add('Build the sentence.','Put the words in order.',ans,[ans,[chunks[1],chunks[0],chunks[2]].join(' → '),[chunks[2],chunks[1],chunks[0]].join(' → '),[chunks[0],chunks[2],chunks[1]].join(' → ')],{orderWords:rotate(chunks,1),spokenScene:sentence,skill:'grammar',partType:'build',source:grammarSource,why:sentence+' '+why});});}
  function facts(){c.facts.forEach(([prompt,answer,wrong,why],i)=>add(storyText,prompt,answer,wrong.split('|'),{skill:'reading',partType:'readChoose',storyId:`${id}-unit1-original`,storyTitle:c.readingTitle,storyText,storySpeech:storyText,spokenScene:prompt,spokenPrompt:'',difficulty:i<7?'medium':'advanced',why,source:baseSource}));}
  function study(count=10){c.study.slice(0,count).forEach(([scene,answer,wrong,why])=>add(scene,wrong?'Choose the correct answer.':'Write your answer.',answer,wrong?.split('|')||['not this word','check the sentence','listen again'],{skill:'word-study',partType:wrong?'readChoose':'readWrite',...(wrong?{}:{inputMode:'typing'}),source:studySource,why:why||`${scene} → ${answer}. Check the Word Study rule.`}));}
  function storyGaps(){const words=book.sessions['1'].filter(w=>new RegExp('\\b'+escapeRE(w.word)+'\\b','i').test(storyText));const plain=book.reading.filter(l=>l.kind!=='title').map(l=>l.text).join(' '),sentences=plain.match(/[^.!?]+[.!?]+/g)||[];const gaps=[];for(const w of words){const rx=new RegExp('\\b'+escapeRE(w.word)+'\\b','i');const sentence=sentences.find(s=>rx.test(s));if(sentence)gaps.push({w,sentence:sentence.trim()});}
   // A short text such as Families has few exact target nouns. Use additional
   // actual content words, never invented story sentences.
   const stop=new Set('this that with have from they their there these those some when then will were into been about people families'.split(' '));
   for(const sentence of sentences){if(gaps.length>=5)break;const candidates=sentence.match(/\b[a-z]{4,}\b/g)||[];const word=candidates.find(w=>!stop.has(w)&&!gaps.some(g=>g.w.word===w));if(word)gaps.push({w:{word},sentence:sentence.trim()});}
   if(gaps.length<5)throw Error('Insufficient source listening gaps');
   gaps.slice(0,5).forEach(({w,sentence})=>add(sentence.replace(new RegExp('\\b'+escapeRE(w.word)+'\\b','i'),'___'),'Listen and complete.',w.word,uniq([...words.map(w=>w.word),...gaps.map(g=>g.w.word)]),{skill:'listening',partType:'listenGap',spokenScene:sentence,storyId:`${id}-unit1-original`,storyTitle:c.readingTitle,storyText,why:`The source reading says: ${sentence}`}));
  }
  if(lessonId==='lesson-1'){vocab(book.sessions['1']);facts();listening(book.sessions['1']);order(book.sessions['1']);}
  else if(lessonId==='lesson-2'){grammar();grammarWrite();buildSentences();listening(book.sessions['2'].length?book.sessions['2']:book.sessions['1']);order(book.sessions['2'].length?book.sessions['2']:book.sessions['1']);}
  else if(lessonId==='lesson-3'){study();vocab(book.sessions['3']);order(book.sessions['3']);buildSentences();}
  else {vocab(book.sessions['1']);grammar();facts();study(5);storyGaps();order(book.sessions['1']);}
  return items;
 }
 for(const s of p.sessions.slice(0,3))lessons.push({id:s.id,title:s.title,unit:1,kind:'practice',sourceLessons:[s.id],programSource:{...p.source,row:s.sourceRow},timeLimitSeconds:1200,items:make(s.id)});
 const r=p.reviews[0];lessons.push({...r,sourceLessons:r.sourceLessons,timeLimitSeconds:1800,items:make(r.id)});
 courses.push({id,name:`Discover ${n}`,status:'staff-preview',version:1,scope:'Unit 1: first three Program sessions and Unit Review; official tests are not included in this preview.',lessons});
}
fs.mkdirSync(path.join(root,'data'),{recursive:true});for(const c of courses)fs.writeFileSync(path.join(root,'data',c.id+'.json'),JSON.stringify(c));
console.log(courses.map(c=>`${c.id}: ${c.lessons.map(l=>l.items.length).join('/')} questions`).join('\n'));
module.exports=courses;
