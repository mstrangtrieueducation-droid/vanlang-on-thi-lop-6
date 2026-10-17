const keys=require('./family-test-keys.cjs'),program=require('./parse.cjs').family();
const files={1:['1096nHQ4qxEnqyiazclgG4JlwT5eHAvbf','1wk8WifWpXeDSPTp9rQ0MYV2uv2iFswFG','1x7gArd1IApC9cTCYnsw8CdIWJCJWOOtA','1KQlNRJTaOLcCUjzsiQATSU7iPCObAIir','1FKUs-7GKKnK38TMnxsHkYYiF9Z7W5Nma'],2:['1wHLBAL__U_-evdNA9tws8YxNwW3S-4k_','1I1xXBAYKsgYybqxPLMzeeyEmHvmcFMDy','1vMCj_7gSRQRC3OUcImvv0UsUQHdOeTjc','1SafLBO82Ej9h3YHQu7lpAYwOW6PK338v','133kvvmleQ2iGENrKMCwZFcucV5TQhIt7']};
// A written answer may use either standard English contraction form.
function accepted(answer){const a=new Set([answer]);for(const [short,long] of [["isn't","is not"],["aren't","are not"],["can't","cannot"],["don't","do not"],["doesn't","does not"],["hasn't","has not"],["haven't","have not"],["wasn't","was not"],["weren't","were not"],["It's","It is"],["She's","She is"],["He's","He is"],["I'm","I am"],["They're","They are"],["I've","I have"],["Where's","Where is"],["Let's","Let us"]])for(const s of [...a])if(s.includes(short))a.add(s.replaceAll(short,long));if(answer.includes('neighbour'))a.add(answer.replace('neighbour','neighbor'));return [...a];}
module.exports=function(book,number){
 const p=program.tests[number-1],items=[];
 for(const unit of p.units)keys[book][unit-1].forEach((section,si)=>section.split('|').forEach((answer,index)=>{
  const ex=si+1,part=index+2,matching=/^[a-f]$/.test(answer),fullSentence=/[.!?]$/.test(answer),pair=answer.includes(' / ');
  let target=`Unit ${unit} · Exercise ${ex} · Number ${part}`,prompt=matching?'Choose the matching letter from the original exercise.':fullSentence?'Write the complete answer or sentence for this number.':pair?'Fill every blank for this number, in order. Separate your answers with / .':'Write the missing word or words for this number.';
  if(book===1&&unit===1&&ex===2)prompt='Complete the word. Write the whole word, including the printed letters.';
  if(book===1&&unit===4&&ex===1)prompt='Write only the missing letters for this number.';
  if(book===1&&unit===13&&ex===2)prompt='Write the number in words, then / and its digits.';
  if(book===2&&unit===2&&ex===2){target=`Unit 2 · Exercise 2 · Word ${part}`;prompt='Find the words in the snake, from left to right. The first word is the example. Type this word.';}
  if(book===1&&unit===14&&ex===1){target=`Unit 14 · Exercise 1 · ${index<4?'Picture':'Crossword'} ${index%4+2}`;prompt='Write the complete word for this picture or crossword number.';}
  if(book===2&&unit===4&&ex===3){target=`Unit 4 · Exercise 3 · Blank ${part}`;prompt='Count the blanks from left to right, including the example as blank 1. Write the word for this blank.';}
  if((book===2&&unit===5&&ex===2)||(book===2&&unit===7&&ex===2))prompt='Write the complete word or words, then / and the matching picture letter.';
  const sourceImage=`../game-kit/adventures/pictures/family-tests/ff${book}-u${unit}-e${ex}.png`,sourceURL='https://drive.google.com/file/d/'+files[book][number-1]+'/view';
  const q={id:`family-friends-${book}-program-test${number}-u${unit}-e${ex}-q${part}`,type:'choice',exam:true,title:target,scene:target,prompt,spokenScene:target,spokenPrompt:prompt,answer,skill:ex<=2?'vocabulary':'grammar',sourceImage,sourceCaption:`Family and Friends ${book} · original Unit ${unit} test · Exercise ${ex} · Tap to enlarge`,source:{url:sourceURL,page:(unit-1)%3+1,exercise:ex,item:part,adaptation:'Digital response to the original printed exercise'},sourceLabel:`Centre-supplied Family and Friends ${book} Unit test`,why:`${target}: ${answer}. Compare this with the words and picture in the original exercise.`};
  if(matching){const pool=['a','b','c','d','e','f'].filter(x=>x!==answer).slice(0,3);q.options=[answer,...pool];}
  else{q.inputMode='typing';q.acceptedAnswers=accepted(answer);q.options=[];}
  // A line-matching body-parts task is converted to picture recognition;
  // the labelled word in the original must not give away the typed answer.
  if(book===1&&unit===3&&ex===1){const pic=require('../../game-kit/adventures/pictures/family-cards/manifest.json');q.picturePrompt=pic[`1:3:${answer}`];delete q.sourceImage;delete q.inputMode;delete q.acceptedAnswers;q.scene='Look at the highlighted body part.';q.prompt='Which body part is highlighted?';q.options=[answer,...['eyes','ears','nose','legs','arms','hands','fingers'].filter(w=>w!==answer).slice(0,3)];q.source.adaptation='Original body-part matching knowledge, adapted to four picture-recognition choices.';}
  if(book===2&&unit===8&&ex===1){const noun=['bed','home','dinner','breakfast'][index];q.scene=`___ ${noun==='bed'?'to bed':noun}`;q.prompt='Choose the verb that goes with these words.';q.answer=index<2?'go':'have';q.options=['go','have','play','wear'];delete q.inputMode;delete q.acceptedAnswers;delete q.sourceImage;q.why=`${q.answer} ${noun==='bed'?'to bed':noun}`;q.source.adaptation='Original word classification adapted to an explicit verb choice; unordered printed blanks are not graded by position.';}
  if(['1:1:2','1:5:2','1:7:1','1:9:2','1:12:2','1:13:1','1:15:2','2:1:2','2:3:1','2:5:1','2:8:2','2:9:1','2:10:1','2:13:1','2:14:2'].includes(`${book}:${unit}:${ex}`))q.prompt='Complete the word or phrase for this number. Write the whole answer, including any printed letters.';
  if(['1:5:1','1:8:1','1:10:1'].includes(`${book}:${unit}:${ex}`))q.prompt='Does the picture match the word? Type yes for a tick, or no for a cross.';
  if(['1:2:1','1:3:2','1:6:1','1:7:2','1:9:1','1:11:2','1:12:1','1:15:1'].includes(`${book}:${unit}:${ex}`)){const u=require('./family-units.cjs')[book][unit-1],pool=[...new Set([...section.split('|'),...u.words,...u.extra])].filter(w=>w!==answer);q.options=[answer,...pool.slice(0,3)];delete q.inputMode;delete q.acceptedAnswers;q.prompt='Follow the original instruction for this number. Choose the correct word.';q.source.adaptation='Original circle-the-word exercise converted to four choices from the same Unit vocabulary.';}
  if(ex>=3)q.why+=' '+require('./family-grammar-rules.cjs')[book][unit-1];
  q.spokenPrompt=q.prompt;
  items.push(q);
 }));
 return {id:`progress-test-${number}`,kind:'progress-test',title:`Progress Test ${number} · Units ${p.units.join(', ')}`,description:`${items.length} câu · Theo đề kiểm tra gốc · Xem lời giải sau khi nộp bài`,units:p.units,timeLimitSeconds:p.durationSeconds||900,timeLimitSource:p.durationSeconds?'Program':'Centre default; Program does not specify a duration',programSource:{url:program.source,row:p.sourceRow,session:p.session},items};
};
