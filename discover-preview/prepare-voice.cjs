/* Collect exactly the utterances the shared player will request. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const parts=require('../game-kit/adventures/task-parts.js');
const courses=require('./build.cjs'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../game-kit/adventures/native-voice.js'),'utf8'),context);
const keys=new Set(),stories=new Set();
for(const c of courses)for(const l of c.lessons)for(const q of l.items){
 for(const t of parts.speech(q))keys.add(t);
 keys.add(parts.describe(q).instruction);
 if(q.storySpeech||q.storyText){const s=q.storySpeech||q.storyText;keys.add(s);stories.add(s);}
}
const existing={},needed=[];
for(const key of keys){const clips=context.window.TitiVoice.lookup(key);if(clips&&[clips].flat(3).every(p=>fs.existsSync(path.resolve(__dirname,p))))existing[key]=clips;else needed.push(key);}
fs.writeFileSync(path.join(__dirname,'voice-source.json'),JSON.stringify({voice:'en-US-AnaNeural',rate:'+3%',existing,needed,stories:[...stories]},null,2));
console.log(`${keys.size} utterances; ${Object.keys(existing).length} reused; ${needed.length} to record`);
