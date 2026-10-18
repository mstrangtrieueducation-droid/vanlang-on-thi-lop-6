const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),D=require('../adventures/dialogue.js'),{cast}=require('./dialogue-cast.cjs');
const out=path.join(root,'game-kit/adventures/dialogue-audio');fs.mkdirSync(out,{recursive:true});
const clips=new Map(),courses={},roles={};
function sequence(lines){const result=[];lines.forEach((t,turn)=>{
 const speaker=t.speaker||t.role||'Narrator',p=cast(speaker);roles[speaker]=p;
 // Blanks are nonverbal cues. Never pronounce underscore or reveal the answer.
 const pieces=String(t.text).split(/(_{2,}|\.{2,}|…)/).filter(Boolean);
 for(const text of pieces){if(/^(_{2,}|\.{2,}|…)$/.test(text)){result.push({src:'../game-kit/adventures/audio/gap-cue.wav',turn,speaker});continue;}
 const clean=text.trim();if(!/[A-Za-z0-9]/.test(clean))continue;const id=crypto.createHash('sha256').update(JSON.stringify([p.voice,p.rate,p.pitch,clean])).digest('hex').slice(0,20);
 clips.set(id,{id,text:clean,...p});result.push({src:'../game-kit/adventures/dialogue-audio/'+id+'.mp3',turn,speaker});
 }
 });return result;}
for(const id of ['family-friends-1','family-friends-2','discover-1','discover-2','discover-3','discover-4']){
 const data=JSON.parse(fs.readFileSync(path.join(root,'khoa-hoc/data',id+'.json'),'utf8')),entries={};
 const add=(text,lines)=>{if(text?.trim()&&lines?.length)entries[text.trim()]=sequence(lines);};
 for(const lesson of data.lessons)for(const q of lesson.items||[]){
  if(q.sourceAudio)continue;
  const lines=D.turns(q),story=q.storyDialogue||D.parse(q.storySpeech)||[];
  const full=story.length?story:q.scene===q.storyText?lines:[];
  add(q.storySpeech,full);add(q.storyText,full);add(q.scene,lines);add(D.transcript(lines),lines);
  if(q.spokenScene){const who=lines.find(t=>q.spokenScene.startsWith(t.speaker+': '));if(who)add(q.spokenScene,[{speaker:who.speaker,text:q.spokenScene.slice(who.speaker.length+2)}]);}
 }
 courses[id]=Object.keys(entries).length;fs.writeFileSync(path.join(out,id+'.json'),JSON.stringify({version:1,entries}));
}
fs.writeFileSync(path.join(out,'source.json'),JSON.stringify({version:1,casting:'Synthetic English performance roles; source speaker names preserved. Original test recordings untouched.',courses,roles,clips:[...clips.values()]},null,2));
console.log({courses,clips:clips.size,roles:Object.keys(roles).length});
