const {extract}=require('./program/family-speakers.cjs');
const stories=require('./program/family-stories.cjs');
const View=require('../game-kit/adventures/dialogue.js');
// Lesson 5 speech-bubble / first-person boundaries, checked on pp. 34,42,56.
const readingCuts={
 'family-friends-1-u7-reading':['Mum',['Max','I like these trousers'],['Mum','Oh Max.'],['Max','But I like orange'],['Mum',"They're orange too!"],['Max','And this T-shirt.'],['Mum','Max, try on'],['Max','But Mum,']],
 'family-friends-2-u4-reading':['Customer',['Café owner',"We haven't got much"],['Customer','Have you got tomatoes?'],['Café owner','No, sorry.'],['Customer','Have you got chicken?'],['Café owner',"No, we haven't"],['Customer','Oh no!'],['Café owner',"Yes, we've got"],['Customer','Oh good!'],['Café owner','A banana pizza?!'],['Customer','Yes, please.']],
 'family-friends-2-u6-reading':['Max',['Julia',"I'm Julia."],['Luke',"I'm Luke."],['Sara',"My name's Sara."]]
};
function split(text,cuts){const [first,...rest]=cuts;let start=0,speaker=first;const out=[];for(const [next,prefix] of rest){const end=text.indexOf(prefix,start);if(end<start)throw Error('Reading speaker boundary: '+prefix);out.push({speaker,text:text.slice(start,end).trim()});start=end;speaker=next;}out.push({speaker,text:text.slice(start).trim()});return out;}
module.exports=function(courses){
 const cache=new Map();
 for(const course of Object.values(courses))for(const lesson of course.lessons)for(const q of lesson.items){
  let lines;
  if(q.storyId){
   if(!cache.has(q.storyId)){
    const m=q.storyId.match(/^family-friends-([12])-u(\d+)-lesson1$/);
    lines=m?extract(+m[1],+m[2],stories[+m[1]][+m[2]-1][0]):readingCuts[q.storyId]?split(q.storyText,readingCuts[q.storyId]):View.parse(q.storyText);
    cache.set(q.storyId,lines||[]);
   }
   lines=cache.get(q.storyId);
   if(lines.length){
    q.storyDialogue=lines;q.storySpeech=View.transcript(lines);
    if(q.scene===q.storyText)q.dialogue=lines;
    else if(q.spokenScene){
     // Attribute the exact selected excerpt only. Never alternate speakers or
     // infer a name from the person being addressed in the sentence.
     const candidates=lines.filter(t=>t.text.includes(q.spokenScene));
     if(candidates.length===1){q.dialogue=[{speaker:candidates[0].speaker,text:q.scene}];q.spokenScene=candidates[0].speaker+': '+q.spokenScene;}
    }
   }
  }
  if(!q.dialogue){const explicit=View.parse(q.scene);if(explicit.length)q.dialogue=explicit;}
 }
};
