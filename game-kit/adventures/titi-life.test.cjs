const test=require('node:test'),assert=require('node:assert/strict');
const {pose}=require('./titi-life.js');
test('Titi starts thinking after five seconds, then changes waiting movements',()=>{
 assert.equal(pose({quiz:true,elapsed:4999}),'welcome');
 assert.equal(pose({quiz:true,elapsed:5000}),'thinking');
 assert.equal(pose({quiz:true,elapsed:8500}),'stepping');
 assert.equal(pose({quiz:true,elapsed:12000}),'curious');
 assert.equal(pose({quiz:true,elapsed:15500}),'thinking');
});
test('Waiting never overrides reading, reactions, completion, hidden tabs or dialogs',()=>{
 for(const flag of ['hidden','overlay','reacting','solved'])assert.equal(pose({quiz:true,elapsed:99999,[flag]:true}),'rest');
 assert.equal(pose({quiz:true,elapsed:99999,speaking:true}),'speaking');
 assert.equal(pose({quiz:false,elapsed:99999}),'welcome');
 assert.equal(pose({quiz:true,elapsed:0}),'welcome');
});
test('A tap starts an audio source and selects iOS playback when available',()=>{
 const vm=require('node:vm'),fs=require('node:fs');
 for(const supported of [false,true]){
  const calls=[],nav=supported?{audioSession:{type:'auto'}}:{};
  class AudioContext{constructor(){this.sampleRate=48000;}resume(){calls.push('resume');return Promise.resolve();}createBuffer(){return {};}createBufferSource(){return {connect(){},start(){calls.push('start');}};}}
  const scope={window:{AudioContext},navigator:nav,performance:{now:()=>0},matchMedia:()=>({matches:false}),document:{readyState:'loading',addEventListener(){}},addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/titi-life.js','utf8'),scope);
  assert.ok(scope.window.TitiLife.unlock());assert.deepEqual(calls,['resume','start']);
  if(supported)assert.equal(nav.audioSession.type,'playback');
 }
});
