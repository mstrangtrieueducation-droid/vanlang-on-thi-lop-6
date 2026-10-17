const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),scope={window:{}};
vm.runInNewContext(fs.readFileSync(__dirname+'/native-voice.js','utf8'),scope);
const voice=scope.window.TitiVoice,manifest=JSON.parse(fs.readFileSync(__dirname+'/audio-native/manifest.json'));
test('Every spoken question in all twelve courses uses the same complete native US child voice pack',()=>{
 assert.equal(voice.id,'en-US-AnaNeural');assert.equal(voice.locale,'en-US');assert.equal(manifest.voice,voice.id);
 const questions=[];for(const name of fs.readdirSync(root).filter(n=>/^tu-luyen-\d+$/.test(n))){const s={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,name,'quiz-data.js'),'utf8'),s);questions.push(...s.window.ADVENTURE.items);}
 for(const file of fs.readdirSync(root+'/khoa-hoc/data').filter(n=>n.endsWith('.json'))){for(const lesson of JSON.parse(fs.readFileSync(root+'/khoa-hoc/data/'+file)).lessons)questions.push(...lesson.items);}
 assert.ok(questions.length>=3465);
 for(const q of questions)for(const text of [q.spokenScene||q.scene,q.spokenPrompt||q.prompt].filter(Boolean)){const clips=voice.lookup(text);assert.ok(clips,q.id+': '+text);for(const clip of Array.isArray(clips)?clips:[clips]){assert.ok(fs.existsSync(path.resolve(root,'vu-tru',clip)),clip);}}
 for(const [name,text] of Object.entries(manifest.clips)){const file=__dirname+'/audio-native/'+name;assert.ok(fs.statSync(file).size>1000,name);assert.ok(/[A-Za-z0-9]/.test(text));}
 assert.ok(Array.isArray(voice.lookup('___'))===false);assert.equal(voice.lookup('unknown future question'),null);
});
test('Greeting and live narration never fall back to a device or Vietnamese voice',()=>{
 for(const file of ['game-kit/adventures/engine.js','game-kit/titi-greeting.js','vu-tru/galaxy.js']){const source=fs.readFileSync(root+'/'+file,'utf8');assert.ok(!/SpeechSynthesisUtterance|speechSynthesis\.speak|vi-VN/.test(source),file);}
 const welcome=voice.lookup('Welcome to Ms. Trang Trieu Education!');assert.deepEqual(fs.readFileSync(path.resolve(root,'vu-tru',welcome)),fs.readFileSync(root+'/vu-tru/assets/titi-welcome.mp3'));
 assert.ok(voice.lookup('Excellent!'));assert.ok(voice.lookup('Good try!'));assert.ok(voice.lookup('Read the clue and choose the correct answer.'));
});
