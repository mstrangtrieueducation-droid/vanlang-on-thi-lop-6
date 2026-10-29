const fs=require('fs'),path=require('path'),crypto=require('crypto'),Scenes=require('../game-kit/unit-scenes.js'),family=require('./program/family-units.cjs'),discover=require('./program/discover-resources.json'),phonics=require('./phonics-units.cjs');
function write(){
 const root=path.resolve(__dirname,'..'),out=path.join(root,'game-kit/adventures/unit-scenes-v4');fs.mkdirSync(out,{recursive:true});
 const packs=[require('./program/approved-scenes.cjs').artClass(),require('./program/approved-scenes.cjs').newYear()],hunts=require('./program/approved-phonics-scenes.cjs').packs();
 for(const p of packs){const dir=path.join(__dirname,'context-reviews-v3',p.course);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'unit-'+p.unit+'.json'),JSON.stringify(p));}
 for(const hunt of hunts)fs.writeFileSync(path.join(__dirname,'hunt-worlds',hunt.course,'unit-'+hunt.unit+'.json'),JSON.stringify(hunt,null,2)+'\n');
 const approved=new Set([...hunts.map(h=>h.course+'-unit-'+h.unit),...packs.map(p=>p.course+'-unit-'+p.unit)]),production=[];
 for(const [course,titles]of Object.entries(Scenes.titles))for(const [i,title]of titles.entries()){
  const unit=i+1,source=course.startsWith('phonics-')?phonics[+course.at(-1)][i].levels.flatMap(l=>l.words):course.startsWith('family-')?[...family[+course.at(-1)][i].words,...family[+course.at(-1)][i].extra]:discover.books.find(b=>b.level===+course.at(-1)).units[i];
  const words=Array.isArray(source)?source:[...source.words,...source.extra].map(w=>w.word),id=course+'-unit-'+unit;
  production.push({id,course,unit,title,sourceWords:[...new Set(words)],status:approved.has(id)?'illustrated-and-measured':'artwork-pending',rules:{naturalColors:true,supportAndPerspective:true,unitVocabulary:true,fullWordsCoverageRequired:course.startsWith('discover-')},image:approved.has(id)?id+'.webp':null});
 }
 fs.writeFileSync(path.join(out,'production.json'),JSON.stringify({schema:1,approvedAt:'2026-10-30',scenes:production},null,2)+'\n');
 const existing=JSON.parse(fs.readFileSync(path.join(root,'game-kit/adventures/hunt-audio/worlds-v4.json'),'utf8'));
 const spellings=Object.keys(Scenes.titles).filter(c=>c.startsWith('phonics-')).flatMap(c=>Scenes.titles[c].flatMap((_,i)=>JSON.parse(fs.readFileSync(path.join(__dirname,'hunt-worlds',c,'unit-'+(i+1)+'.json'),'utf8')).questions.map(q=>q.audioText).filter(Boolean)));
 const texts=[...packs.flatMap(p=>p.items.flatMap(q=>[q.partInstruction,q.spokenScene])),...hunts.flatMap(h=>h.questions.map(q=>q.audioText).filter(Boolean)),...spellings],mapping={...existing},clips={};
 for(const text of new Set(texts)){const key=crypto.createHash('sha256').update('en-US-AnaNeural|-10%|'+text).digest('hex').slice(0,20);clips[key]=text;mapping[text]='../game-kit/adventures/unit-scenes-v4/audio/'+key+'.mp3';}
 fs.writeFileSync(path.join(out,'audio-manifest.json'),JSON.stringify({voice:'en-US-AnaNeural',rate:'-10%',clips,mapping:Object.fromEntries(texts.map(t=>[t,mapping[t]]))},null,2)+'\n');
 fs.writeFileSync(path.join(out,'hunt-audio.json'),JSON.stringify(mapping));
 fs.writeFileSync(path.join(out,'audio.js'),'(()=>{const old=window.TitiVoice,clips='+JSON.stringify(Object.fromEntries(texts.map(t=>[t,mapping[t]])))+';window.TitiVoice={...old,lookup(t){return clips[t]||old?.lookup(t);}};})();\n');
 console.log(JSON.stringify({settings:production.length,measured:approved.size,remaining:production.length-approved.size,audioClips:Object.keys(clips).length}));
}
if(require.main===module)write();module.exports={write};
