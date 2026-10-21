/* Presentation-only grouping. Question IDs, answers and source data are unchanged. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.TaskParts=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';
 const tasks={
  listenPicture:['Listen & Choose','Listen and choose a picture.'],
  lookChoose:['Look & Choose','Look and choose.'],
  listenChoose:['Listen & Choose','Listen and choose.'],
  listenWrite:['Listen & Write','Listen and write.'],
  lookWrite:['Look & Write','Look and write.'],
  readWrite:['Read & Write','Read and write.'],
  listenGap:['Listen & Complete','Listen and complete.'],
  readChoose:['Read & Choose','Read and choose.'],
  readGap:['Read & Complete','Read and complete.'],
  matchText:['Read & Match','Match the sentences.'],
  lookOdd:['Look & Compare','Find the odd one out.'],
  match:['Read & Match','Match the words and pictures.'],
  build:['Build a Sentence','Put the words in order.'],
  order:['Listen & Order','Listen and put the cards in order.'],
  sequence:['Read & Order','Put the events in order.'],
  sort:['Sort into Groups','Sort the words into groups.'],
  memory:['Find the Pairs','Find the matching pairs.'],
  collect:['Choose & Collect','Choose all the items you need.'],
  route:['Follow the Route','Follow the directions.'],
  spot:['Find & Fix','Find and fix the mistake.']
 };
 const taskQuestion=p=>/^(?:Which answer matches the clue\?|Which group does this belong to\?|Which word(?: or phrase)? (?:completes the sentence|fits)\?|Which word (?:matches the picture|belongs to this (?:letter|spelling) group|has the same (?:first|last) sound)\?|Which list contains exactly the requested items\?|Which preposition goes before this time expression\?|Which order matches the story\?|Which word (?:has stress on the second syllable|ends with (?:the sound )?\/s\/)\?|Which instruction has the opposite meaning\?)$/i.test(String(p||'').trim());
 const generic=p=>taskQuestion(p)||/^(?:listen\b|read\b|look\b|choose\b|select\b|tap\b|click\b|match\b|put\b|build\b|sort\b|write\b|fill\b|complete\b|follow\b|find\b|count\b|which (?:letter|letters|sound|word) (?:is missing|completes?))/i.test(String(p||'').trim());
 function describe(q){
  let type='readChoose';
  if(q.partType&&tasks[q.partType])type=q.partType;
  else if(q.matchPictures)type='match';
  else if(q.orderWords)type=q.skill==='grammar'?'build':'order';
  else if(tasks[q.type])type=q.type;
  else if(q.inputMode==='typing'||q.interaction==='dictation'||q.interaction==='recall')type=q.skill==='listening'||q.sourceAudio||q.interaction==='dictation'?'listenWrite':q.picturePrompt||q.sourceImage?'lookWrite':'readWrite';
  else if(q.interaction==='sentence')type='build';
  else if(q.pictureOptions)type=q.skill==='listening'||q.interaction==='picture'?'listenPicture':'lookChoose';
  else if(q.picturePrompt)type='lookChoose';
  else if(q.storyId&&q.skill==='listening')type='listenGap';
  else if(q.skill==='listening'||q.spokenScene&&q.spokenScene!==q.scene)type='listenChoose';
  else if(/_{2,}|\.{2,}|…/.test(q.scene||''))type='readGap';
  // Keep source sections and passage-linked tasks together. Explicit section
  // identifiers take precedence for original tests with similar task wording.
  const link=q.partId||q.sourceSection||q.storyId||(q.exam&&q.source?.exercise?'source-'+q.source.url+'-'+q.source.page+'-'+q.source.exercise:'')||(String(q.scene||'').length>160?q.scene:'');
  const instruction=q.partInstruction||(taskQuestion(q.prompt)?q.prompt:tasks[type][1]);
  return {key:type+':'+instruction,block:link,type,title:q.partTitle||tasks[type][0],instruction};
 }
 function group(items){
  // Questions explicitly dependent on a previous answer cannot be reordered.
  if(items.some(q=>q.keepOrder||/previous (?:question|answer)|text above/i.test(q.prompt||'')))return [...items];
  const buckets=new Map();for(const q of items){const d=describe(q);if(!buckets.has(d.key))buckets.set(d.key,new Map());const blocks=buckets.get(d.key);if(!blocks.has(d.block))blocks.set(d.block,[]);blocks.get(d.block).push(q);}
  return [...buckets.values()].flatMap(blocks=>[...blocks.values()].flat());
 }
 function sections(items){
  const out=[];for(const [index,q] of items.entries()){
   const d=describe(q),last=out.at(-1);
   if(last?.key===d.key&&last.block===d.block)last.indices.push(index);
   else out.push({...d,level:q.cognitiveLevel||q.difficulty||'',id:d.key+':'+q.id,number:out.length+1,indices:[index]});
  }return out;
 }
 function at(items,pos){const all=sections(items),part=all.find(p=>p.indices.includes(pos));return {...part,total:all.length,question:part.indices.indexOf(pos)+1,count:part.indices.length};}
 function questionPrompt(q){return generic(q.prompt)?'':String(q.prompt||'');}
 const phonics=id=>/^phonics-[1-4]$/.test(id||'');
 const listening=q=>q.skill==='listening'||!!q.sourceAudio||q.interaction==='dictation';
 const stream=(q,id)=>!q.dictation&&(phonics(id)||/^(family-friends-[12]|discover-[1-4])$/.test(id||'')&&listening(q));
 const instructionOnly=(q,id)=>id==='van-lang'&&(!!q.storyText||!!q.storyId||q.passageKind==='cloze'||['build','sequence','order'].includes(q.type)||!!q.orderWords||/Gap|Write|build|sequence|order/.test(describe(q).type)||/_{2,}|\.{2,}|…/.test(q.scene||'')||/^blank\s*\(/i.test(q.scene||'')||/điền|sắp xếp|reading|cloze|arrang|reorder|put .+order/i.test([q.sourceSection,q.partInstruction,q.prompt].filter(Boolean).join(' ')));
 function automatic(q,id){
  if(q.dictation)return !!q.questionAudio;
  if(id==='van-lang'){
   const d=describe(q),gap=q.passageKind==='cloze'||/^blank\s*\(/i.test(q.scene||'')||/_{2,}|\.{2,}|…/.test(q.scene||'')||/Gap|Write/.test(d.type)||/fill|cloze|điền/i.test(q.sourceSection||q.section||'');
   // The passage is a reading reference, never an automatic narration source.
   const question=String(q.scene||'').trim();
   return !instructionOnly(q,id)&&!gap&&!!question&&question.split(/\s+/).length<55;
  }
  if(/^(family-friends-[12]|discover-[1-4])$/.test(id||''))return true;
  return stream(q,id);
 }
 const hiddenStory=(q,id)=>phonics(id)&&!!q.storyId;
 function speech(q,options={}){
  if(q.sourceAudio)return []; // Original listening is controlled by its own player.
  if(hiddenStory(q,options.course))return [q.storySentence||q.spokenScene].filter(Boolean);
  if(/^(family-friends-[12]|discover-[1-4])$/.test(options.course||'')){
   const reference=!!q.storyText&&String(q.scene||'').trim()===String(q.storyText).trim(),direction=describe(q).instruction;
   const out=[reference?'':q.spokenScene||q.scene,q.spokenPrompt||q.prompt].map(s=>String(s||'').trim()).filter(s=>s&&s!==q.storyText&&s!==direction&&!Object.values(tasks).some(t=>s===t[1]));
   return [...new Set(out.map(s=>s.split('\n').filter(line=>!/^Word bank:|^Grammar focus:/.test(line)&&!/[\u0300-\u036f]|đ/i.test(line.normalize('NFD'))).join('\n')).filter(Boolean))].filter(s=>!/^Choose the (?:missing words|correction)[.!]?$/i.test(s));
  }
  // Some older banks used the four options as spokenScene when the prompt was
  // empty. Văn Lang must always use the actual question, including cached banks.
  const scene=String((options.course==='van-lang'?q.scene:q.spokenScene??q.scene)??'').trim(),prompt=String((options.course==='van-lang'?q.prompt:q.spokenPrompt??q.prompt)??'').trim();
  if(options.course==='van-lang'&&/^blank\s*\(/i.test(scene))return [];
  const out=[];
  // An imperative can be the actual clue ("Read books", "Look! The bus is
  // coming"). Only exact direction placeholders are omitted from scene audio.
  const pairedClue=Array.isArray(q.pairs)&&q.pairs.some(pair=>pair[0]===scene);
  const sceneDirection=!q.spokenScene&&!pairedClue&&(/^Listen to Titi[.!]?$/i.test(scene)||/^(?:Listen|Read|Look|Write|Build|Match|Choose|Sort)[.!]?$/i.test(scene)||/^(?:Build|Put|Match|Sort|Choose|Select|Tap|Click|Follow|Count|Complete|Fill|Find|Write|Read|Listen|Look)\s+(?:the|each|all|a|an|and|at|carefully)\b/i.test(scene)||scene===prompt||scene===describe(q).instruction||Object.values(tasks).some(t=>scene===t[1]));
  if(scene&&!(options.course==='van-lang'?sceneDirection:generic(scene))&&!(q.storyText&&scene===q.storyText))out.push(scene);
  if(prompt&&!generic(prompt)&&!out.includes(prompt))out.push(prompt);
  return out;
 }
 const markup=s=>String(s||'').replace(/<[^>]*>/g,t=>/^<\/?(?:u|b|strong|em|i|br|p)\s*\/?>$/i.test(t)?t:'');
 return {tasks,describe,group,sections,at,generic,questionPrompt,speech,stream,automatic,instructionOnly,hiddenStory,markup};
});
