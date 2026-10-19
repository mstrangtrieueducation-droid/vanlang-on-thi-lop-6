/* Deterministic cloze construction from a verified transcript; never invent listening text. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.DictationCore=api;})(globalThis,()=>{
 'use strict';
 const anchors=new Set('a an the and or but of to in on at by for as is am are was were be been i you he she it we they my your his her our their this that these those yes no oh ok okay hmm mmm erm um ah wow one two three four five six seven eight nine ten hello hi bye goodbye'.split(' '));
 const letters=word=>(String(word).normalize('NFC').match(/\p{L}/gu)||[]).length;
 function build(source){
  if(!source.verified||!source.audio?.length||!source.paragraphs?.length)throw Error('Dictation requires a verified original recording and transcript');
  const keywords=new Set((source.keywords||[]).flatMap(w=>String(w).toLowerCase().split(/\s+/)));
  const fixedNames=new Set(source.paragraphs.flatMap(p=>String(p.speaker||'').split(/\W+/)).filter(w=>!['Speaker','Narrator','Adult','Child','Children','Letter','writer','Mum','Dad','Girl','Dr','Miss'].includes(w)).map(w=>w.toLowerCase()));
  const items=[],paragraphs=source.paragraphs.map((p,paragraph)=>{if(!p.text?.trim())throw Error('Empty transcript paragraph');
   const words=p.text.match(/\p{L}+(?:['’\-]\p{L}+)*|[^\p{L}]+/gu)||[];
   return {speaker:p.speaker||'',tokens:words.map((text,position)=>{
    const n=letters(text),word=text.toLowerCase().replace(/’/g,"'"),blank=n>0&&!fixedNames.has(word)&&(keywords.has(word)||n>=3&&!anchors.has(word));
    if(!blank)return {text};
    const id=`${source.course}-dictation-u${source.unit}-${paragraph+1}-${position+1}`,index=items.length;
    items.push({id,type:'choice',inputMode:'typing',answer:text,options:[text],unit:source.unit,skill:'listening',dictation:true,dictationIndex:index,letters:n,partId:source.course+'-u'+source.unit+'-dictation',partType:'listenWrite',partTitle:'Listening Dictation',partInstruction:'Listen and complete the passage.',prompt:'Listen and write.',scene:'',spokenPrompt:'',spokenScene:'',storyId:source.course+'-u'+source.unit+'-dictation',storyTitle:source.title,sourceAudio:source.audio,source:source.source,hint:`Listen for ${n} letters.`,why:`Từ trong bản ghi: ${text}. Nghe lại để kiểm tra âm đầu, âm cuối và cách viết.`,difficulty:index<8?'easy':index<20?'medium':'advanced'});
    const q=items[items.length-1],plain=text.replace(/['’]/g,'');q.acceptedAnswers=[...new Set([plain,text.normalize('NFD').replace(/\p{M}/gu,''),...(source.variants?.[text.toLowerCase()]||[])])].filter(w=>w!==text);q.keepOrder=true;
    const before=words.slice(0,position).join(''),after=words.slice(position+1).join('');q.reviewScene=before.slice(Math.max(before.lastIndexOf('.'),before.lastIndexOf('!'),before.lastIndexOf('?'))+1).trimStart()+'___'+after.split(/(?<=[.!?])\s/)[0];
    return {text,id,index,letters:n};
   })};
  });
  if(!items.length)throw Error('Transcript produced no blanks');
  items[0].dictationDocument={title:source.title,paragraphs};
  if(source.picture)items[0].picturePrompt=source.picture;
  return {version:1,course:source.course,unit:source.unit,title:source.title,source:source.source,wordCount:paragraphs.reduce((n,p)=>n+p.tokens.filter(t=>/[a-z]/i.test(t.text)).length,0),blankCount:items.length,items};
 }
 return {build,letters};
});
