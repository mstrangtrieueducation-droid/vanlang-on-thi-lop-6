const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/engine.js','utf8');
test('Start unlocks audio synchronously before scheduling the countdown',()=>{
 const calls=[],scope={unlockAudio:()=>calls.push('unlock'),window:{GAME_CONFIG:{},TitiCloud:{start:()=>{calls.push('cloud');return new Promise(()=>{});}}},reviewMode:false,countdown:()=>calls.push('countdown'),timed:true,queue:[{}],pos:0,crypto:{randomUUID:()=> 'test-run'}};
 vm.runInNewContext(source.slice(source.indexOf('function start('),source.indexOf('function countdown('))+';start();',scope);
 assert.deepEqual(calls,['unlock','cloud','countdown']);
});
test('Countdown sounds at 3, 2, 1 and Go; cancel prevents entering a question',()=>{
 const calls=[],label={textContent:'3'};let tick,finish,cancel;
 const el={isConnected:true,classList:{add(){}},querySelector:()=>label,remove(){this.isConnected=false}};
 const scope={primeSpeech:()=>{},modal:(title,text,buttons)=>{cancel=buttons[0][1];return el;},sound:kind=>calls.push(kind),setInterval:fn=>(tick=fn,1),clearInterval:()=>{},setTimeout:fn=>{finish=fn;},lobby:()=>{el.isConnected=false;calls.push('lobby');},load:()=>calls.push('load'),startClock:()=>calls.push('clock')};
 vm.runInNewContext(source.slice(source.indexOf('function countdown('),source.indexOf('function startClock('))+';countdown(null);',scope);
 assert.deepEqual(calls,['pop']);tick();assert.equal(label.textContent,2);tick();assert.equal(label.textContent,1);tick();assert.equal(label.textContent,'BẮT ĐẦU');
 assert.deepEqual(calls,['pop','pop','pop','ding']);cancel();finish();assert.ok(!calls.includes('load'));
});
