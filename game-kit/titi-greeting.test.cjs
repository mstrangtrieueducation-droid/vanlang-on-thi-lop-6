const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('Branded native welcome is homepage-owned, supports manual replay and respects mute without device TTS',async()=>{
 let plays=0,clip;const spoken=[],window={TitiSpaceAudio:{prefs:{sfx:true},duck(){}},speechSynthesis:{speak:u=>spoken.push(u)},addEventListener(){}};
 class Audio{constructor(src){this.src=src;clip=this;}play(){plays++;return Promise.resolve();}pause(){}}
 const document={currentScript:{src:'https://example.test/game-kit/titi-greeting.js'},body:{dataset:{}},addEventListener(){}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/titi-greeting.js','utf8'),{window,document,Audio,URL});
 assert.equal(plays,0,'A lesson loading this script must stay quiet');window.TitiGreeting.enterHome();await Promise.resolve();assert.equal(plays,1);assert(clip.src.includes('?v=native-1'));window.TitiGreeting.enterHome();await window.TitiGreeting.play();assert.equal(plays,1);await window.TitiGreeting.play(true);assert.equal(plays,2);
 window.TitiSpaceAudio.prefs.sfx=false;await window.TitiGreeting.play(true);assert.equal(plays,2);window.TitiGreeting.leaveHome();window.TitiSpaceAudio.prefs.sfx=true;await window.TitiGreeting.play(true);assert.equal(plays,2);assert.equal(spoken.length,0);
});
test('Denied autoplay waits for the first interaction, adds no button and greets only once',async()=>{
 const handlers=new Map();let allowed=false,plays=0;const window={TitiSpaceAudio:{prefs:{sfx:true},duck(){}},addEventListener(t,f){handlers.set(t,f);},removeEventListener(t){handlers.delete(t);}};
 class Audio{play(){plays++;return allowed?Promise.resolve():Promise.reject(Error('blocked'));}pause(){}}
 const created=[],store=new Map(),document={currentScript:{src:'https://example.test/game-kit/titi-greeting.js'},body:{dataset:{}},addEventListener(){},createElement(t){created.push(t);return {};}},sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 vm.runInNewContext(fs.readFileSync(__dirname+'/titi-greeting.js','utf8'),{window,document,Audio,URL,sessionStorage});
 window.TitiGreeting.enterHome();await new Promise(r=>setTimeout(r));assert.equal(plays,1);assert.equal(created.length,0,'No fallback button');assert(handlers.has('pointerdown'));
 allowed=true;handlers.get('pointerdown')();await new Promise(r=>setTimeout(r));assert.equal(plays,2);assert(!handlers.has('pointerdown'));
 window.TitiGreeting.leaveHome();window.TitiGreeting.enterHome();await new Promise(r=>setTimeout(r));assert.equal(plays,2,'Coming back from a course stays quiet');
});
