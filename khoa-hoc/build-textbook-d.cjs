/* Bind the source D by actual lesson/sound, not by a nearby Review picture. */
const fs=require('fs'),path=require('path'),{books}=require('./program/textbook-d.cjs'),geometry=require('./program/textbook-d-geometry.cjs');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'game-kit/adventures/textbook-d'),sources=JSON.parse(fs.readFileSync(path.join(folder,'sources.json'))),audio=JSON.parse(fs.readFileSync(path.join(folder,'audio-sources.json'))),units=require('./phonics-units.cjs');
const questions={},exercises={},masks=JSON.parse(fs.readFileSync(path.join(folder,'path-masks.json')));
const match=(word,s)=>s.words.includes(word)||s.words.includes(word==='hotdog'?'hot dog':word);
for(let book=1;book<=4;book++){
 const c=JSON.parse(fs.readFileSync(path.join(__dirname,`data/phonics-${book}.json`)));
 for(const lesson of c.lessons)for(const q of lesson.items){if(!['soundPath','listenMap'].includes(q.resourceTask?.kind))continue;
  const levels=units[book].find(u=>u.unit===lesson.unit).levels,words=q.resourceTask.kind==='soundPath'?q.answer.split(' → ').slice(1,-1):[q.answer];
  let sound;
  if(q.resourceTask.kind==='soundPath')sound=q.answer.split(' → ')[0].toLowerCase();
  else{const s=levels.find(s=>match(words[0],s));if(!s)throw Error('Unbound source word '+q.id);sound=s.patterns.join(',');}
  if(book===1&&sound.includes(','))sound=words[0]==='van'?'v':words[0]==='zero'?'z':sound[0];
  if(book===2&&sound==='en')sound='en,ed';if(book===2&&sound==='up')sound='up,ud';
  if(book===3&&lesson.id==='unit-4-stage-3')sound='ai,ay';if(book===3&&lesson.id==='unit-7-stage-3')sound='oa,ow';
  if(!books[book][sound])sound=Object.keys(books[book]).find(k=>k.split(',').includes(sound))||sound;
  const id=book+':'+sound,d=books[book][sound];if(!d)throw Error('Missing actual D '+id+' '+q.id);
  const source=sources.find(s=>s.book===book&&s.sound===sound);if(!source)throw Error('Missing source crop '+id);
  const recording=d.audio&&audio.find(a=>a.book===book&&a.disc===d.audio[0]&&a.track===d.audio[1]);if(d.audio&&!recording)throw Error('Missing source recording '+id);
  exercises[id]={...d,...geometry[id],...(masks[id]?{pathMask:masks[id]}:{}),image:source.file,preview:source.preview,size:source.size,sourceSHA256:source.sourceSHA256,sourceURL:units[book][0].bookURL,audio:recording?'audio/'+recording.file:null};
  questions[q.id]={exercise:id,unit:lesson.unit,legacyAnswer:q.answer};
 }
}
// Convert the already audited D-diagram picture coordinates to this crop.
const oldRegions=require('../game-kit/adventures/textbook-maps/connect-write-regions.json'),oldSources=require('../game-kit/adventures/textbook-maps/connect-write-sources.json');
for(const sound of ['b','j','r','z']){const e=exercises['1:'+sound];if(!e)continue;const old=oldRegions[sound],a=oldSources.find(s=>s.file===old.image),b=sources.find(s=>s.file===e.image),scale=1.6/1.8,crop=a.cropAtRenderScale1_8;
 e.nodes=Object.fromEntries(Object.entries(old.nodes).map(([w,n])=>{const fullX=(crop[0]+n.x*(crop[2]-crop[0])/1000)*scale,fullY=(crop[1]+n.y*(crop[2]-crop[0])/1000)*scale;return [w,[(fullX-b.crop[0])/e.size[0]*1000,(fullY-b.crop[1])/e.size[1]*1000]];}));
}
// Allocate original sub-items once across existing slots. Reviews do not repeat
// the complete D exercise already used by an earlier slot.
for(const id of Object.keys(exercises)){
 const bindings=Object.values(questions).filter(b=>b.exercise===id),e=exercises[id];if(bindings.length<2)continue;
 if(e.kind==='soundConnect'){if(bindings.length!==2)throw Error('Unallocated source phases '+id);bindings[0].phase='connect';bindings[1].phase='write';continue;}
 const total=e.answers.length||e.correct?.length;if(!total||total<bindings.length)throw Error('Not enough original sub-items '+id);
 bindings.forEach((binding,i)=>binding.items=[Math.floor(i*total/bindings.length),Math.floor((i+1)*total/bindings.length)]);
}
const manifest={version:1,questions,exercises};fs.writeFileSync(path.join(folder,'manifest.json'),JSON.stringify(manifest));fs.writeFileSync(path.join(folder,'manifest.js'),'window.TextbookDData='+JSON.stringify(manifest)+';\n');
console.log('Source D:',Object.keys(questions).length,'question bindings,',Object.keys(exercises).length,'original exercises.');
