const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const profiles=require('./game-kit/adventures/panoramas/profiles.json');
test('all Phonics Units have 20 picture-grounded challenges with letters, colour and counting',()=>{
 assert.equal(profiles.length,32);
 for(const profile of profiles){const pack=require('./khoa-hoc/panorama/'+profile.course+'/unit-'+profile.unit+'.json');
 assert.equal(pack.version,2);assert.equal(pack.questions.length,20);assert.equal(pack.course,profile.course);assert.equal(pack.unit,profile.unit);
 assert.equal(new Set(pack.questions.map(q=>q.prompt)).size,20);
 assert.equal(pack.objects.filter(o=>o.kind==='letter').length,6);
 for(const q of pack.questions){assert(q.groups.length);for(const g of q.groups){assert(g.need>0&&g.need<=g.targets.length);for(const id of g.targets)assert(pack.objects.some(o=>o.id===id),q.id+': '+id);}}
 for(const o of pack.objects){assert(o.x>=0&&o.x<=100&&o.y>=0&&o.y<=100);assert(o.w>0&&o.h>0);}
 assert(pack.questions.some(q=>q.groups.reduce((s,g)=>s+g.need,0)>=4));
 assert(pack.questions.some(q=>q.groups.length===2));
 }
});
test('all panorama art and native audio is local and present',()=>{
 const voices=require('./game-kit/adventures/hunt-audio/panorama-v2.json');
 for(const p of profiles){const pack=require('./khoa-hoc/panorama/'+p.course+'/unit-'+p.unit+'.json');const art=path.join('khoa-hoc',pack.image);assert(fs.existsSync(art),art);assert(fs.statSync(art).size>100000);
 for(const q of pack.questions){assert(voices[q.prompt],q.prompt);for(const v of [voices[q.prompt]].flat()){const f=path.join('khoa-hoc',v);assert(fs.existsSync(f),f);assert(fs.statSync(f).size>100);}}}
 assert(voices['Great job!']);assert(voices['Awesome!']);
});
test('panorama uses a persistent illustration and no card renderer; versioned cache in both entrypoints',()=>{
 const js=fs.readFileSync('game-kit/adventures/hidden-listening.js','utf8');
 assert(!js.includes('PhonicsActivities.picture'));assert(!js.includes('data-hunt-object'));
 assert(js.includes('state.complete=true'));assert(js.includes("':hunt-worlds-v4'"));assert(js.includes('visibilitychange'));assert(js.includes('await say('));assert(js.includes('advance()'));
 for(const f of ['khoa-hoc/index.html','discover-preview/index.html'])assert.match(fs.readFileSync(f,'utf8'),/hidden-listening\.js\?v=(?:practice30-1|scene-art-2)/);
});
