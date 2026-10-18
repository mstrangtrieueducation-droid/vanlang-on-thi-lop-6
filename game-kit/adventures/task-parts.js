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
 const generic=p=>/^(?:listen\b|read\b|look\b|choose\b|select\b|tap\b|click\b|match\b|put\b|build\b|sort\b|write\b|fill\b|complete\b|follow\b|find\b|count\b|which (?:letter|letters|sound|word) (?:is missing|completes?))/i.test(String(p||'').trim());
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
  return {key:type+(q.partInstruction?':'+q.partInstruction:''),block:link,type,title:q.partTitle||tasks[type][0],instruction:q.partInstruction||tasks[type][1]};
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
   if(last?.key===d.key&&last.block===d.block&&last.level===(q.cognitiveLevel||q.difficulty||''))last.indices.push(index);
   else out.push({...d,level:q.cognitiveLevel||q.difficulty||'',id:d.key+':'+q.id,number:out.length+1,indices:[index]});
  }return out;
 }
 function at(items,pos){const all=sections(items),part=all.find(p=>p.indices.includes(pos));return {...part,total:all.length,question:part.indices.indexOf(pos)+1,count:part.indices.length};}
 function questionPrompt(q){return generic(q.prompt)?'':String(q.prompt||'');}
 function speech(q){
  if(q.sourceAudio)return []; // Original listening is controlled by its own player.
  const scene=String(q.spokenScene??q.scene??'').trim(),prompt=String(q.spokenPrompt??q.prompt??'').trim();
  const out=[];
  if(scene&&!generic(scene)&&!(q.storyText&&scene===q.storyText))out.push(scene);
  if(prompt&&!generic(prompt)&&!out.includes(prompt))out.push(prompt);
  return out;
 }
 return {tasks,describe,group,sections,at,generic,questionPrompt,speech};
});
