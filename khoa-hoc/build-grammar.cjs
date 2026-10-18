/* Supplemental grammar practice, traced to the existing classroom sources.
 * Never rewrites the 45-question review banks or their persistent question IDs. */
const fs=require('node:fs'),path=require('node:path');
const family=require('./program/family-units.cjs'),fg=require('./program/family-grammar.cjs'),fr=require('./program/family-grammar-rules.cjs');
const discover=require('./program/discover-resources.json'),dg=require('./program/discover-grammar.cjs');
const summaries=require('./program/grammar-summary-vi.cjs');
const rotate=(a,n)=>a.slice(n%a.length).concat(a.slice(0,n%a.length));
const rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function questions(course,unit,models,variants){const items=[];
 for(let variant=0;variant<variants;variant++)for(const [i,m]of models.entries()){
  const full=m.scene.replace('___',m.answer),context=m.cue?m.cue+'\n':'',options=[m.answer,...m.wrong];
  const common={id:`${course}-grammar-u${unit}-${variant+1}-${i+1}`,type:'choice',unit,skill:'grammar',phonicsSequence:true,source:m.source,focus:m.focus,title:m.focus,answer:m.answer,options:rotate(options,i+variant),hint:m.note,why:`${full}\n${m.note}`,difficulty:variant<1?'easy':variant<3?'medium':'advanced',spokenPrompt:'',spokenScene:''};
  if(variant===0)items.push({...common,scene:context+m.scene,prompt:'Choose the missing words.',partType:'readGap'});
  if(variant===1)items.push({...common,scene:context+m.scene.replace('___','['+m.wrong[0]+']'),prompt:'Replace the words in brackets.',partType:'readChoose',partTitle:'Grammar Detective',partInstruction:'Choose the correction.'});
  if(variant===2)items.push({...common,scene:context+m.scene+'\nWord bank: '+rotate(options,i+variant).join(' · '),prompt:'Write the missing words.',inputMode:'typing',partType:'readWrite',partTitle:'Complete the Sentence',partInstruction:'Use the word bank. Write the missing words.'});
  if(variant===3){const words=full.split(' '),a=Math.max(1,Math.ceil(words.length/3)),b=Math.max(a+1,Math.ceil(words.length*2/3)),chunks=[words.slice(0,a).join(' '),words.slice(a,b).join(' '),words.slice(b).join(' ')].filter(Boolean),answer=chunks.join(' → ');
   items.push({...common,scene:context||'Build a complete sentence.',prompt:'Put the words in order.',partType:'build',answer,orderWords:rotate(chunks,1),options:[answer,rotate(chunks,1).join(' → '),rotate(chunks,2).join(' → '),[...chunks].reverse().join(' → ')]});}
  if(variant===4)items.push({...common,scene:context+`Grammar focus: ${m.focus}`,prompt:'Which sentence follows the rule?',partType:'readChoose',partTitle:'Apply the Rule',partInstruction:'Choose the sentence that follows the rule.',answer:full,options:rotate(options.map(o=>m.scene.replace('___',o)),i+variant)});
 }
 if(items.length!==20)throw Error('Expected 20 grammar questions: '+course+'/'+unit);
 return items;
}
function packs(){const out=[];
 for(const n of [1,2])for(const u of family[n]){const course='family-friends-'+n,source={url:u.bookURL,page:u.page+1,unit:u.unit,kind:'class-book-grammar-aligned-practice'},s=summaries[n][u.unit-1];
  let models=fg[n][u.unit-1];
  // Family relationship vocabulary belongs in the regular review, not Grammar Focus.
  if(n===1&&u.unit===6)models=[models[0],{scene:'The hat belongs to Dad. It is ___ hat.',answer:"Dad's",wrong:['Dad','Dads','Dades']},{scene:'The ball belongs to Tom. It is ___ ball.',answer:"Tom's",wrong:['Tom','Toms','Tomes']},...models.slice(3)];
  models=models.map(m=>({...m,source,focus:s[0],note:s[2]}));
  out.push({course,unit:u.unit,title:`Unit ${u.unit} · ${u.title}`,source,summary:[{tag:s[0],formula:s[1].split('|').map(x=>[x]),note:s[2],example:models[0].scene.replace('___',models[0].answer)},{tag:'Remember',note:fr[n][u.unit-1],example:models[3].scene.replace('___',models[3].answer)}],items:questions(course,u.unit,models,4)});
 }
 for(const book of discover.books)for(const u of book.units){const course='discover-'+book.level,source={url:u.grammar.url,unit:u.unit,kind:'class-grammar-model'},models=u.grammar.rules.slice(0,4).map((m,i)=>{const [answer,wrong,cue]=dg[book.level][u.unit-1][i],pattern=new RegExp('(?<![A-Za-z])'+rx(answer)+'(?![A-Za-z])');if(!pattern.test(m.example))throw Error('Missing source target '+course+'/'+u.unit);return {scene:m.example.replace(pattern,'___'),answer,wrong,cue:cue||(book.level===3&&u.unit===5?'Use the past continuous (yesterday).':''),source,focus:m.tag,note:m.note};});
  out.push({course,unit:u.unit,title:`Unit ${u.unit} · Grammar Focus`,source,summary:u.grammar.rules,items:questions(course,u.unit,models,5)});
 }
 return out;
}
if(require.main===module){let count=0;for(const pack of packs()){const dir=path.join(__dirname,'grammar',pack.course);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,`unit-${pack.unit}.json`),JSON.stringify(pack,null,2)+'\n');count++;}console.log(`${count} Unit grammar packs · ${count*20} questions`);}
module.exports={packs};
