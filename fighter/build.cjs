/* Questions authored from the lesson corpus. Additional contexts are explicitly labelled. */
const fs=require('fs'),path=require('path'),roots=require('./word-families.cjs'),authored=require('./authored-contexts.json');
const clean=s=>String(s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pos=p=>({n:'noun',v:'verb',a:'adj',adjective:'adj',adverb:'adv'}[p]||p);
const focusedMeaning=w=>String(w.meaning||'').split(/[;~·•#]|><|↔|\s+hoặc\s+/)[0].replace(/\((?:bất|không)\)\s*/g,'').replace(/^[A-Za-z /()-]+:\s*/,'').trim();
const segmenter=new Intl.Segmenter('en',{granularity:'sentence'});
const sentences=s=>[...segmenter.segment(s)].map(x=>x.segment).filter(Boolean);
function forms(text){const out=[];for(const m of text.matchAll(/([a-z][a-z-]*(?:\s*\/\s*[a-z][a-z-]*)*)\s*\((n|v|a|adj|adv)(?:\s*,\s*(n|v|adj|adv))?\)/gi))for(const word of m[1].split(/\s*\/\s*/))for(const p of [m[2],m[3]].filter(Boolean))out.push({word:word.toLowerCase(),pos:pos(p.toLowerCase())});return [...new Map(out.map(f=>[f.word+':'+f.pos,f])).values()];}
function variants(word){if(!/^[a-z-]+$/i.test(word))return [word];const out=[word,word+'s',word+'ed',word+'ing'];if(word.endsWith('e'))out.push(word+'d',word.slice(0,-1)+'ing');if(word.endsWith('y'))out.push(word.slice(0,-1)+'ies',word.slice(0,-1)+'ied');return [...new Set(out)];}
const irregular={be:['is','are','was','were','been'],do:['did','done','doing'],make:['made'],take:['took','taken'],stand:['stood'],fall:['fell','fallen'],leave:['left'],put:['putting'],give:['gave','given'],pay:['paid'],run:['ran'],get:['got','gotten']};
function occurrence(text,word){if(!word)return null;if(/\s/.test(word)){const parts=word.split(/\s+/),head=parts.shift(),tail=parts.map(p=>/^(sb|st|sth|somebody|something)$/.test(p)?"(?:[A-Za-z'-]+\\s+){1,4}":esc(p)+'\\s+').join('').replace(/\\s\+$/,'');return new RegExp('\\b(?:'+[...variants(head),...(irregular[head]||[])].map(esc).join('|')+')\\s+'+tail+'\\b','i').exec(text);}return new RegExp('\\b(?:'+[...variants(word),...(irregular[word]||[])].sort((a,b)=>b.length-a.length).map(esc).join('|')+')\\b','i').exec(text);}
const preps=['on','in','at','to','of','for','with','from','about','by','into','after','up','down','away','out','off'];
const lexical={make:['do','perform'],do:['make','create'],heavy:['strong','powerful'],commit:['do','make'],pay:['spend','give']};
function sourcePhrases(raw){return raw.split(/[·~#><≈;→↔]/).map(s=>s.replace(/\([^)]*\)/g,'').trim().replace(/\s+(?:sb\/st|sb|sth|st|V|doing sth|to do st)$/,'').trim()).filter(s=>/^[a-z][a-z '-]+$/.test(s)&&s.split(/\s+/).length>=2&&s.split(/\s+/).length<=6&&!/\b(sb|st|sth|doing|something|somebody)\b/.test(s));}
function build(source){
 const audit={fetchedAt:source.fetchedAt,missingPassages:[],excludedFamily:[],missingFields:[],units:[]};
 const units=source.units.map(u=>{
  const id='fighter-'+u.track.toLowerCase().replaceAll(' ','-')+'-unit-'+u.unit;
  const passages=Object.values(u.passages||{}).flatMap(p=>(p.paragraphs||[]).map(x=>({title:p.title,text:clean(x.text),source:p.source||u.source,authored:false})));
  for(const p of authored[u.track+':'+u.unit]||[])passages.push({...p,source:u.source,authored:true});
  if(u.track.startsWith('Reading')&&!passages.length)audit.missingPassages.push(id);
  const words=u.entries.map((e,index)=>{
   const raw=clean(e.family||e.sourceTerm||e.term),parsed=forms(raw),word=clean(e.term).replace(/^\((?:It|bank)\)\s*/,'').replace(/\((?:dis|in|un|im|il|ir)\)/g,'').split(/\s*[·~#><≈\/]|\s*\(/)[0].replace(/^be /,'').trim();
   const primary=parsed.find(f=>f.word===word.toLowerCase()),base=word,root=roots.find(g=>g.includes(base.toLowerCase()));
   // The allowlist only filters synonyms out; it cannot supply absent source forms.
   if(!primary&&/^[a-z-]+$/i.test(base)&&['noun','verb','adj','adv'].includes(pos(e.pos||e.type)))parsed.unshift({word:base.toLowerCase(),pos:pos(e.pos||e.type)});
   const related=parsed.filter(f=>f.word===base.toLowerCase()||root?.includes(f.word)),family={noun:null,verb:null,adj:null,adv:null};
   for(const p of Object.keys(family)){const v=[...new Set(related.filter(f=>f.pos===p).map(f=>f.word))];if(v.length)family[p]=v.join(' / ');}
   const extra=u.enhancements?.[e.term]||{},example=clean(e.example),collocation=[...new Set([...(extra.collocations||[]),...(e.collocations||[]),e.collocation,...sourcePhrases(raw)].filter(Boolean).map(clean))];
   const w={id:id+'-w'+(index+1),unit:'Unit '+u.unit,word:base,pos:primary?.pos||pos(clean(e.pos||e.type).split(/[ ·,]/)[0])||null,ipa:clean(extra.ipa||e.ipa).match(/\/[^/]+\//)?.[0]||null,meaning:clean(e.meaning)||null,collocation,example:example||null,family,forms:related,sourceFamily:raw,definition:clean(e.definition),sourceIndex:index,source:u.source,note:clean(e.note),reading:e.reading||''};
   const missing=['pos','ipa','meaning','example'].filter(k=>!w[k]);if(!collocation.length)missing.push('collocation');if(missing.length)audit.missingFields.push({id:w.id,fields:missing});return w;
  });
  const tasks=[];
  for(const w of words){
   const task=(kind,suffix,fields)=>tasks.push({id:w.id+'-'+suffix,wordId:w.id,unitId:id,kind,word:w,source:u.source,sourceIndex:w.sourceIndex,...fields});
   const distinct=[...new Map(w.forms.map(f=>[f.word,f])).values()];
   if(distinct.length>=3){for(const f of distinct){const m=occurrence(w.example||'',f.word);if(!m)continue;const choices=[...new Map([m[0],...distinct.filter(x=>x.word!==f.word&&x.pos!==f.pos).map(x=>x.word)].map(v=>[v.toLowerCase(),v])).values()].slice(0,4);if(choices.length<3)continue;
    task('family','family-'+f.word,{sentence:w.example.slice(0,m.index)+'___'+w.example.slice(m.index+m[0].length),answer:m[0],choices,family:distinct.map(x=>x.word),answerPos:f.pos,origin:'Ví dụ gốc · Word Family',explanation:`Chọn “${m[0]}” (${f.pos}). Câu gốc: ${w.example} Các lựa chọn thuộc cùng họ từ, khác chức năng ngữ pháp.`});
   }}else audit.excludedFamily.push(w.id);
   const patterns=[...w.collocation,w.sourceFamily,w.note].join(' '),example=w.example||'',tokens=[...example.matchAll(/[A-Za-z]+(?:[-'][A-Za-z]+)*/g)];
   for(let j=1;j<tokens.length;j++){const token=tokens[j],answer=token[0].toLowerCase();if(!preps.includes(answer))continue;
    const before=tokens[j-1][0].toLowerCase(),patternTokens=patterns.toLowerCase().replace(/\([^)]*\)/g,'').replace(/[^a-z/ -]/g,' ').replace(/\s+/g,' '),stems=[before,...w.forms.filter(f=>variants(f.word).includes(before)).map(f=>f.word),...patternTokens.split(/\s+/).filter(token=>[...variants(token),...(irregular[token]||[])].includes(before))];
    const matched=stems.map(stem=>new RegExp('\\b'+esc(stem)+'\\s+('+preps.join('|')+')(?:/('+preps.join('|')+'))?\\b','g')).flatMap(re=>[...patternTokens.matchAll(re)]);
    if(!matched.some(m=>m[1]===answer||m[2]===answer))continue;
    const valid=new Set(matched.flatMap(m=>[m[1],m[2]]).filter(Boolean));if(valid.has('on'))valid.add('upon');
    task('clasp','prep-'+token.index,{sentence:example.slice(0,token.index)+'___'+example.slice(token.index+token[0].length),answer:token[0],choices:[token[0],...preps.filter(x=>!valid.has(x)).slice(0,3)],origin:'Ví dụ gốc · Cụm từ/giới từ',explanation:`Dùng “${token[0]}” theo cấu trúc “${before} ${token[0]}” trong bài. ${w.note||''} Câu gốc: ${example}`});
   }
   for(const c of w.collocation){const first=c.split(' ')[0].toLowerCase();if(!lexical[first])continue;const m=occurrence(example,c);if(!m)continue;const answer=m[0].split(/\s/)[0];task('clasp','phrase-'+tasks.length,{sentence:example.slice(0,m.index)+'___'+example.slice(m.index+answer.length),answer,choices:[answer,...lexical[first]],origin:'Collocation gốc',explanation:`Cụm từ trong bài là “${c}”. ${example}`});}
   // Reassemble an attested expression: no arbitrary words are used as distractors.
   const phrase=w.collocation.find(c=>/^[a-zA-Z][a-zA-Z '-]+$/.test(c)&&c.split(' ').length>=2&&c.split(' ').length<=6&&!/\b(sb|sth|something|somebody)\b/.test(c));
   if(phrase)task('magnet','magnet',{answer:phrase,tiles:phrase.split(' '),prompt:focusedMeaning(w),origin:'Collocation trong bài học',explanation:`Cụm từ: “${phrase}”. ${w.example||focusedMeaning(w)}`});
   let excerpt=null;
   for(const p of passages){const ss=sentences(p.text),i=ss.findIndex(s=>occurrence(s,w.word));if(i<0||ss.length<2)continue;const start=Math.max(0,Math.min(i-1,ss.length-2)),text=ss.slice(start,start+3).join('').trim(),m=occurrence(text,w.word);if(m){excerpt={text,title:p.title,source:p.source,authored:p.authored,m};break;}}
   if(excerpt){const {text,title,m}=excerpt;task('clue','reading-clue',{excerpt:text,excerptTitle:title,source:excerpt.source,authored:excerpt.authored,answer:m[0],start:m.index,end:m.index+m[0].length,prompt:focusedMeaning(w),origin:(excerpt.authored?'Bài luyện biên soạn từ từ vựng Unit · ':'Trích nguyên văn · ')+title,explanation:`Bằng chứng là “${m[0]}”: ${focusedMeaning(w)}. Hãy đọc cả câu chứa cụm từ này để xác định nghĩa trong đoạn.`});}
   // Source examples remain explicitly labelled; never masquerade as textbook passages.
   const m=occurrence(example,w.word);if(m&&w.meaning)task('context','example-clue',{excerpt:example,answer:m[0],start:m.index,end:m.index+m[0].length,prompt:focusedMeaning(w),origin:'Câu ví dụ trong bảng từ vựng',explanation:`“${m[0]}” mang nghĩa “${focusedMeaning(w)}” trong câu ví dụ này. ${w.note||''}`});
  }
  const result={id,originalLesson:u.track==='Reading 3'&&u.unit<=3?'game-'+u.unit:id,track:u.track,unit:u.unit,title:u.title,source:u.source,sourceFiles:u.sourceFiles,words,tasks,hasReading:!!passages.length};
  audit.units.push({id,words:words.length,tasks:tasks.length,kinds:Object.fromEntries(['family','clasp','magnet','clue','context'].map(k=>[k,tasks.filter(t=>t.kind===k).length])),checkpointReady:tasks.length>=15});return result;
 });return {version:3,fetchedAt:source.fetchedAt,units,audit};
}
if(require.main===module){const data=build(JSON.parse(fs.readFileSync(process.argv[2]||path.join(__dirname,'source-snapshot.json'),'utf8')));const units=data.units.map(u=>({...u,tasks:u.tasks.map(({word,...t})=>t)}));fs.writeFileSync(path.join(__dirname,'data.js'),'/* Source-only Fighter bank. Null means not supplied by the lesson. */\n(function(r){const data='+JSON.stringify({version:data.version,fetchedAt:data.fetchedAt,units})+';for(const u of data.units){const words=new Map(u.words.map(w=>[w.id,w]));for(const t of u.tasks)t.word=words.get(t.wordId);}if(typeof module===\'object\')module.exports=data;else r.FIGHTER_DATA=data;})(globalThis);\n');fs.writeFileSync(path.join(__dirname,'source-audit.json'),JSON.stringify(data.audit,null,2));console.log(JSON.stringify({units:data.units.length,words:data.units.reduce((n,u)=>n+u.words.length,0),tasks:data.units.reduce((n,u)=>n+u.tasks.length,0),notReady:data.audit.units.filter(u=>!u.checkpointReady),missingPassages:data.audit.missingPassages.length}));}
module.exports=build;
