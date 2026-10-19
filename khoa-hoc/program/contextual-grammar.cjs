const life=require('./life-contexts.cjs');
const cap=s=>s==='i'?'I':s.charAt(0).toUpperCase()+s.slice(1).toLowerCase();
function enrich(model,course,unit,index){
 const m={...model},applied=life.get(course,unit),short=m.scene.match(/^(?:(.*?)\?\s*)?(?:Yes|No),\s*(I|you|he|she|it|we|they)\s+___[.!]?$/i);
 if(short){const subject=cap(short[2]),pronoun=short[2].toLowerCase(),a=m.answer.toLowerCase(),question=short[1]||'';
  if(/^(do|does)$/.test(a))m.scene=/^(do|does)\s/i.test(question)?question.replace(/^(do|does)\s/i,'Why ___ ')+'?':`Why ___ ${pronoun} have extra supplies for the class project?`;
  else if(/^(don't|doesn't)$/.test(a))m.scene=`${subject} ___ take other pupils' things without asking.`;
  else if(/^(is|are|am)$/.test(a))m.scene=`${subject} ___ ready to help a friend with the class activity.`;
  else if(/^(isn't|aren't|am not)$/.test(a))m.scene=pronoun==='it'?`It ___ a real animal; it is a toy.`:`${subject} ___ late; the class register shows an early arrival.`;
  else if(a==='can'){const verb=question.replace(/^can\s+\w+\s+/i,'');m.scene=`${subject} ___ ${verb||'help with the class activity'}, and the teacher has checked this skill.`;}
  else if(a==="can't"){const verb=question.replace(/^can\s+\w+\s+/i,'');m.scene=pronoun==='it'?`A fish lives in water. It ___ fly over the trees.`:`${subject} ___ ${verb||'do this activity'} yet, so an instructor is helping.`;}
  else if(a==='have'||a==='has')m.scene=`${subject} ___ got a spare pencil to lend to a classmate.`;
  else if(a==="hasn't"||a==="haven't")m.scene=`${subject} ___ got the missing helmet, so an adult is helping to find it.`;
  else if(a==='was'||a==='were')m.scene=`${subject} ___ at school yesterday; the attendance record confirms it.`;
  else if(a==="wasn't"||a==="weren't")m.scene=`${subject} ___ late yesterday; the record shows an early arrival.`;
  else throw Error('Unresolved short grammar answer: '+course+'/'+unit+' '+m.scene);
 }
 if(/^___ in the nest\./i.test(m.scene))m.scene='The chicks are safe. ___ in the nest, so we watch quietly from the path.';
 if(/^She can ___\.$/.test(m.scene)&&m.answer==='swim')m.scene='She can ___ in the pool during her supervised lesson.';
 m.cue=[applied.context,m.cue].filter(Boolean).join('\n');
 m.source={...m.source,adaptation:'Authored contextual practice based on this Unit grammar; not a verbatim source-test item.'};
 return m;
}
function application(base,course,unit){const c=life.get(course,unit),{orderWords,inputMode,...q}=base;
 return {...q,id:base.id+'-life',scene:c.context,prompt:'What is the best choice?',title:'Use English in Real Life',answer:c.answer,options:[c.wrong[1],c.answer,c.wrong[0],c.wrong[2]],why:c.why,hint:'Read the situation. Think about its effect on other people.',partId:'grammar-life-application',partType:'readChoose',partTitle:'Think and Choose',partInstruction:'Read and choose the best response.',difficulty:'advanced',cognitiveLevel:'advanced',contextApplication:true,source:{...base.source,kind:'authored-life-application-aligned-to-unit'}};
}
module.exports={enrich,application};
