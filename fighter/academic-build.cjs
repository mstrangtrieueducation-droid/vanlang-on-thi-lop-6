const briefings=require('./briefings.cjs'),families=require('./word-families.cjs');
const clean=s=>String(s||'').replace(/<[^>]+>/g,'').trim();
const sentences=s=>(clean(s).match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).map(x=>x.trim()).filter(Boolean);
const parallels={ 'support':'help maintain','help':'assist','protect':'keep safe','recovery':'return to a healthier state','vulnerable':'at risk of harm','permanent':'lasting indefinitely','efficient':'working without unnecessary waste','damage':'harm','reducing':'making smaller','important':'significant','improve':'make better','consider':'take into account','compare':'examine similarities and differences','understanding':'comprehension','practical constraints':'real-world limitations','uncertain':'not completely known','clear':'easy to understand','responsibilities':'duties','successful':'achieving the intended aim','valuable':'worth a great deal','ordinary':'usual','initial':'first','role':'function','long-term':'continuing over an extended period','fair':'just and impartial','claims':'statements presented as true',
 'requires':'needs','require':'need','supports':'helps maintain','improves':'makes better','influences':'affects','reveals':'makes known','changes':'alters','creates':'produces','provides':'offers','reduces':'decreases','tests':'evaluates','connects':'links','records':'notes down','presents':'shows','affects':'influences','strengthens':'makes stronger','demands':'requires','shapes':'influences','solves':'resolves','preserves':'protects','expands':'increases','offers':'provides','depends on':'relies on','extend':'broaden','contributes to':'helps bring about','combines':'brings together','challenges':'questions','encourages':'motivates','develops':'builds','distinguishes':'shows the difference between',
 'however':'nevertheless','therefore':'as a result','also':'in addition','rather than':'instead of','may':'might','although':'even though','preparation':'getting ready','evidence':'information that supports a conclusion','researchers':'people who investigate systematically','information':'facts and details','accurate':'correct and precise','careful':'done with attention','practical':'concerned with real use','reliable':'able to be trusted','ordinary':'usual rather than exceptional','different':'not the same','shared':'held or used together','unfamiliar':'not previously known','valuable':'of considerable worth','effective':'producing the intended result','repeated':'done more than once','initial':'occurring at the beginning','uncertainty':'lack of complete certainty','cooperation':'working together','suitable':'appropriate for a purpose','selected':'chosen','lasting':'continuing over time','useful':'helpful for a purpose','immediate':'happening without delay'
};
const boundary=w=>new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');
module.exports=function academic(unit,source){
 const row=briefings[unit.track]?.[unit.unit-1];if(!row)throw Error('No reviewed briefing: '+unit.id);
 const [subject,verb,object,support,title,narrow]=row,core=`${subject} ${verb} ${object}.`,paragraph=[core,...sentences(support)];
 const word=unit.words[0],base={wordId:word.id,word,source:unit.source,origin:'Original supplementary practice based on this Unit — not a textbook quotation'};
 const task=(kind,suffix,fields)=>({...base,id:unit.id+'-academic-'+suffix,kind,...fields});
 const intros=['Although individual circumstances can vary considerably and unpredictably from one situation to another,','During a particularly careful investigation that compares evidence from several different sources,','According to a detailed discussion of the complex topic and its wider context,'];
 const phrases=[{text:intros[(unit.unit-1)%3],remove:true},{text:subject,role:'S'},{text:', as the broader context makes clear,',remove:true},{text:verb,role:'V'},{text:object+'.',role:'O / complement'}];
 const explanation=`S = ${subject}; V = ${verb}; O / complement = ${object}. The opening clause and parenthetical comment add context; neither is part of the main clause. Keep the complement after verbs such as “depend”.`;
 const tasks=[task('core','core',{chunks:phrases,answer:'0,2',sentence:phrases.map(p=>p.text).join(' '),simplified:core,explanation})];
 if(unit.track==='Reading 2'&&unit.unit===5){const w=unit.words.find(w=>w.word==='access');tasks.push(task('clasp','access',{word:w,wordId:w.id,left:'access',answer:'to',choices:['to','under','into'],origin:'Source example · access to a site',explanation:w.example}));}
 if(unit.track==='Vocabulary 1'&&unit.unit===13){const w=unit.words.find(w=>w.word==='react');tasks.push(task('clasp','react',{word:w,wordId:w.id,left:'react',answer:'to',choices:['to','into','under'],origin:'Source example · reacted to the news',explanation:w.example}));}
 const choices=['Addition','Contrast','Cause & Effect'];
 const original=Object.values(source.passages||{}).flatMap(p=>(p.paragraphs||[]).map(x=>({title:p.title,lines:sentences(x.text)})));
 let real=[];for(const p of original)for(let i=1;i<p.lines.length;i++){const m=p.lines[i].match(/^(However|Nevertheless|Therefore|Consequently|Moreover|Furthermore)[,\s]/i);if(m)real.push({pair:[p.lines[i-1],p.lines[i].replace(/^(However|Nevertheless|Therefore|Consequently|Moreover|Furthermore)[,\s]+/i,'')],answer:/however|nevertheless/i.test(m[1])?'Contrast':/therefore|consequently/i.test(m[1])?'Cause & Effect':'Addition',connector:m[1],origin:'Reading excerpt · '+p.title});}
 const last=paragraph.at(-1),connector=last.match(/^(However|Therefore)/)?.[1]||'Therefore';
 const bridge=real[0]||{pair:[paragraph.at(-2),last.replace(/^(However|Therefore),?\s*/,'')],answer:connector==='However'?'Contrast':'Cause & Effect',connector};
 tasks.push(task('logic','bridge',{...bridge,choices,explanation:bridge.answer==='Contrast'?'The second statement limits or contrasts with the first; “'+bridge.connector+'” signals the change in direction.':bridge.answer==='Addition'?'The second statement adds a related point in the same direction.':'The second statement gives a consequence or conclusion supported by the first. The original link is “'+bridge.connector+'”.'}));
 tasks.push(task('logic','addition',{pair:paragraph.slice(0,2),answer:'Addition',choices,explanation:'The second sentence develops the same topic with a related detail or example. It does not reverse the first statement.'}));
 const falseHeading='Rejecting the importance of '+subject.charAt(0).toLowerCase()+subject.slice(1);
 tasks.push(task('headline','headline',{paragraph,choices:[title,narrow,falseHeading],answer:JSON.stringify({heading:0,evidence:0}),heading:0,evidence:[0,paragraph.length-1],explanation:`“${title}” covers the main point and the supporting details. “${narrow}” is too narrow. The rejection heading reverses the paragraph's message. Read the opening and conclusion together.`}));
 const pairs=Object.entries(parallels).filter(([a])=>boundary(a).test(paragraph.join(' '))).slice(0,4).map(([a,b],i)=>({id:String(i),left:b,right:paragraph.join(' ').match(boundary(a))[0]}));
 if(pairs.length<2)throw Error(unit.id+': not enough context-specific paraphrases');
 tasks.push(task('paraphrase','paraphrase',{paragraph,pairs,answer:pairs.map(p=>p.id+':'+p.id).join('|'),explanation:pairs.map(p=>`${p.left} → ${p.right}`).join('; ')}));
 let family;
 for(const w of unit.words){
  const f=families.find(f=>w.forms.some(x=>f.includes(x.word.toLowerCase())));if(!f)continue;
  const candidates=[...f.map(form=>({base:form,form})),...f.flatMap(form=>[{base:form,form:form+'s'},{base:form,form:form.endsWith('e')?form+'d':form+'ed'},{base:form,form:form.endsWith('e')?form.slice(0,-1)+'ing':form+'ing'},{base:form,form:form.endsWith('y')?form.slice(0,-1)+'ies':form+'s'}])];
  const found=candidates.map(x=>({...x,m:w.example.match(boundary(x.form))})).find(x=>x.m);if(!found)continue;
  const answer=found.m[0];let sentence=w.example.slice(0,found.m.index)+'___'+w.example.slice(found.m.index+answer.length);
  if(answer==='creative')sentence="The artist's ___ approach made the imaginary animal look real.";
  const hint=answer==='announcement'?'Choose the noun that means a public message.':answer==='announcer'?'Choose the noun for the person introducing a programme.':answer==='immune'?'Choose the adjective before “system”.':answer==='materialism'?'Choose the noun for a belief that possessions matter most.':'Choose the form that fits the grammar and meaning.';
  const completed=sentence.replace('___',answer);
  family=task('family','grammar',{word:w,wordId:w.id,sentence,hint,answer,choices:f.map(v=>v===found.base?answer:v),family:f,explanation:hint+' Complete sentence: '+completed+' All four choices are forms of the same root; the context requires “'+answer+'”.',origin:(answer==='creative'?'Adapted source vocabulary example · ':'Original source example · ')+unit.track+' Unit '+unit.unit});break;
 }
 if(!family)throw Error(unit.id+': no verified four-form family in source example');tasks.push(family);
 // Separate records preserve the original paragraph for review and make attribution explicit.
 return tasks;
};
