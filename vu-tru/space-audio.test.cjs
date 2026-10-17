const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('Music waits for interaction, settings stay independent and hiding the page stops its scheduler',async()=>{
 const events={},docEvents={},intervals=new Map(),saved=new Map();let created=0,notes=0,id=0;
 const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
 class AudioContext{constructor(){created++;this.currentTime=0;this.destination={};}createGain(){return {gain:param(),connect(){return this;}};}createOscillator(){return {frequency:param(),connect(node){return node;},start(){notes++;},stop(){}};}resume(){return Promise.resolve();}suspend(){return Promise.resolve();}}
 const document={hidden:false,body:{dataset:{}},addEventListener(k,fn){docEvents[k]=fn;}},window={AudioContext,StudentContext:{browserStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)}},addEventListener(k,fn){events[k]=fn;},dispatchEvent(){}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/space-audio.js','utf8'),{document,window,Event:class{},setInterval(fn){intervals.set(++id,fn);return id;},clearInterval(i){intervals.delete(i);}});
 const audio=window.TitiSpaceAudio;audio.fx('fly');assert.equal(created,0);assert.equal(intervals.size,0);
 docEvents.pointerdown();await Promise.resolve();assert.equal(created,1);assert.equal(intervals.size,1);assert.ok(notes>0);
 audio.toggle('sfx');await Promise.resolve();const count=notes;audio.fx('reward');assert.equal(notes,count);assert.equal(audio.prefs.bgm,true);
 audio.toggle('bgm');await Promise.resolve();assert.equal(intervals.size,0);audio.toggle('sfx');await Promise.resolve();audio.fx('reward');await Promise.resolve();assert.ok(notes>count);assert.equal(audio.prefs.bgm,false);
 audio.toggle('bgm');await Promise.resolve();assert.equal(intervals.size,1);document.hidden=true;docEvents.visibilitychange();assert.equal(intervals.size,0);document.hidden=false;docEvents.visibilitychange();await Promise.resolve();assert.equal(intervals.size,1);
 audio.light();assert.equal(document.body.dataset.worldLight,'night');assert.equal(JSON.parse(saved.get('titi-space-settings-v1')).light,'night');events.pagehide();assert.equal(intervals.size,0);
});

