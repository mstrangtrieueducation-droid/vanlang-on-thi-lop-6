const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('Branded native welcome is homepage-owned, supports manual replay and respects mute without device TTS',async()=>{
 let plays=0,clip;const spoken=[],window={TitiSpaceAudio:{prefs:{sfx:true},duck(){}},speechSynthesis:{speak:u=>spoken.push(u)},addEventListener(){}};
 class Audio{constructor(src){this.src=src;clip=this;}play(){plays++;return Promise.resolve();}pause(){}}
 const document={currentScript:{src:'https://example.test/game-kit/titi-greeting.js'},body:{dataset:{}},addEventListener(){}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/titi-greeting.js','utf8'),{window,document,Audio,URL});
 assert.equal(plays,0,'A lesson loading this script must stay quiet');window.TitiGreeting.enterHome();await Promise.resolve();assert.equal(plays,1);assert(clip.src.includes('?v=native-1'));window.TitiGreeting.enterHome();await window.TitiGreeting.play();assert.equal(plays,1);await window.TitiGreeting.play(true);assert.equal(plays,2);
 window.TitiSpaceAudio.prefs.sfx=false;await window.TitiGreeting.play(true);assert.equal(plays,2);window.TitiGreeting.leaveHome();window.TitiSpaceAudio.prefs.sfx=true;await window.TitiGreeting.play(true);assert.equal(plays,2);assert.equal(spoken.length,0);
});
