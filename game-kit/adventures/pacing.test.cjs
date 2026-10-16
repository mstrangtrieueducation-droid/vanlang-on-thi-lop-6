const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const games=require('./quiz-content.cjs'),manifest=require('./pacing-manifest.json'),audit=require('./pacing-audit.json');
const context={window:{}};
for(const file of ['audio-map.js','pacing-audio.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,file),'utf8'),context);
const map=context.window.ADVENTURE_AUDIO;
test('All current question narration uses the new static recordings',()=>{
 for(const game of games)for(const q of game.items)for(const text of [q.spokenScene||q.scene,q.prompt].filter(Boolean)){
  assert.match(map[text],/audio-cute\/.+\.mp3$/,q.id+': '+text);
 }
 for(const item of manifest){const filename=path.resolve(__dirname,'../..',map[item.key].replace('../',''));assert.ok(fs.statSync(filename).size>1000,item.key);}
});
test('Every recorded item has audited punctuation pauses and faster default narration',()=>{
 assert.equal(audit.length,manifest.length);
 for(const item of manifest){const record=audit.find(a=>a.key===item.key);assert.ok(record,item.key);assert.equal(record.voice,'en-US-AnaNeural');assert.equal(record.pausesMs.at(-1),200,item.key);assert.ok(record.pausesMs.every(ms=>[0,150,200].includes(ms)),item.key);}
 assert.ok(audit.some(a=>a.pausesMs.includes(150)));
 assert.equal(audit.find(a=>a.key==='Read the clue and choose the correct answer.').rate,'+4%');
 assert.deepEqual(audit.find(a=>a.key==="It's okay, let's try it again!").pausesMs,[150,200]);
});
test('Feedback is a distinct regret then reassurance sequence with no old 300ms clip',()=>{
 assert.deepEqual(Array.from(map['titi-try-again']),[map['Oh no…'],map["It's okay, let's try it again!"]]);
 assert.notEqual(map['Excellent!'],map['Oh no…']);
});
test('All fifteen entry points load the pacing overlay after the base map',()=>{
 for(let n=1;n<=15;n++){const html=fs.readFileSync(path.join(__dirname,`../../tu-luyen-${n}/index.html`),'utf8');assert.ok(html.indexOf('audio-map.js')<html.indexOf('pacing-audio.js'));assert.ok(html.indexOf('pacing-audio.js')<html.indexOf('engine.js'));assert.match(html,/chibi\.css/);assert.match(html,/living-forest\.css/);assert.ok(html.indexOf('titi-life.js')<html.indexOf('engine.js'));}
});
