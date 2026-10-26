const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const packs=require('./program/scene-continuity.cjs').build(),out=path.resolve(__dirname,'../game-kit/adventures/living-scenes-v3'),clips={},mapping={};fs.mkdirSync(out,{recursive:true});
const feedback={correct:['Wow!', 'Amazing!', 'Brilliant!', 'Outstanding!', "You've got sharp eyes!"],wrong:['Oh no!', 'Not quite, look closer!', 'Almost there, try again!']};
const texts=[...Object.values(feedback).flat(),...packs.flatMap(p=>p.items.flatMap(q=>[q.partInstruction,q.spokenScene]))];
for(const text of new Set(texts)){mapping[text]=(text.match(/[^.!?]+[.!?]?/g)||[text]).map(s=>s.trim()).filter(Boolean).map(sentence=>{const id=crypto.createHash('sha256').update('en-US-AnaNeural|+0%|'+sentence).digest('hex').slice(0,20),old=path.resolve(out,'../review-scene-audio',id+'.mp3');if(fs.existsSync(old))return '../game-kit/adventures/review-scene-audio/'+id+'.mp3';clips[id]=sentence;return '../game-kit/adventures/living-scenes-v3/audio/'+id+'.mp3';});}
for(const p of packs){const dir=path.join(__dirname,'context-reviews-v3',p.course);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'unit-'+p.unit+'.json'),JSON.stringify(p));}
fs.writeFileSync(path.join(out,'audio-manifest.json'),JSON.stringify({voice:'en-US-AnaNeural',rate:'+0%',clips,mapping,feedback}));
fs.writeFileSync(path.resolve(out,'../living-scene-audio.js'),'/* One native-US child voice. Supplemental scenes only. */\n(()=>{const prior=window.TitiVoice,files='+JSON.stringify(mapping)+';window.TitiVoice={...prior,lookup(text){return files[String(text||" ").trim()]||prior?.lookup(text)||null;}};})();\n');
console.log(JSON.stringify({packs:packs.length,questions:packs.length*20,newClips:Object.keys(clips).length}));
