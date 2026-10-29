const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),layout=require('./game-kit/adventures/context-scene-layout.js');
const profiles=require('./game-kit/adventures/panoramas/profiles.json');
test('all 102 source-bounded scene packs have valid visible landing zones and fit inside their world',()=>{
 let count=0;for(const course of ['family-friends-1','family-friends-2','discover-1','discover-2','discover-3','discover-4'])for(const file of fs.readdirSync('khoa-hoc/context-reviews/'+course).filter(f=>f.endsWith('.json'))){
  const pack=JSON.parse(fs.readFileSync('khoa-hoc/context-reviews/'+course+'/'+file));count++;
  for(const q of pack.items){const t=q.resourceTask;assert(fs.existsSync('game-kit/adventures/scene-art-v2/'+layout.art(t)+'.webp'));
   for(const [i,o] of t.objects.entries()){const p=layout.position(t,o,i);assert(p.x-p.w/2>=0&&p.x+p.w/2<=100);assert(p.y-p.h/2>=0&&p.y+p.h/2<=100);if(t.kind==='detectiveScene'){assert.equal(p.x,o.x,'spatial riddles retain the exact source coordinates');assert.equal(p.y,o.y);}}
   for(const s of t.steps||[]){const target=t.targets.find(x=>x.id===s.target),object=t.objects.find(x=>x.id===s.object),zone=layout.slot(t,target),fit=layout.fit(t,object,target,t.objects.indexOf(object));assert(target&&object);assert(zone.w>0&&zone.h>0);for(const value of Object.values(fit).filter(x=>typeof x==='number'))assert(Number.isFinite(value));assert(fit.x-fit.w/2>0&&fit.x+fit.w/2<100);assert(fit.y-fit.h/2>0&&fit.y+fit.h/2<100);}
  }
 }assert.equal(count,102);
});
test('the eight untouched legacy scenes preserve their prompts, sound clips and source references',()=>{
 const content=profiles.filter(p=>p.course==='phonics-1'&&![1,2].includes(p.unit)||p.course==='phonics-4'&&p.unit>6).map(p=>require('./khoa-hoc/hunt-worlds/'+p.course+'/unit-'+p.unit+'.json').questions.map(({objects,world,background,...q})=>q));
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'),'9e117ae7389a67d90c09ba4e4dbece6050e90ccea8c0ba5bd4ab1151451be1e8');
});
test('all 32 Phonics pictures keep clear glyph and peach silhouettes while other targets use varied camouflage',()=>{
 for(const p of profiles){const pack=require('./khoa-hoc/hunt-worlds/'+p.course+'/unit-'+p.unit+'.json');if(pack.artRevision===3)continue;assert.equal(pack.artRevision,2);for(const o of pack.objects){if(['letter','grapheme'].includes(o.kind)||o.word==='peach'){assert(o.protectedSilhouette);assert.equal(o.occlusion,0);}else assert(o.occlusion>=.39&&o.occlusion<=.49);assert(o.w<=(o.kind==='grapheme'?15:8.5));}
  const svg=fs.readFileSync('game-kit/adventures/storybook-v1/scenes/'+p.course+'-unit-'+p.unit+'.svg','utf8');assert(svg.includes('<clipPath'));assert(!svg.includes('peach-skin'),'use the checked storybook peach, not the mismatched substitute');
 }
});
test('generated plates stay local, WebP and smaller than one megabyte apiece',()=>{
 const manifest=require('./game-kit/adventures/scene-art-v2/prompts.json');assert.equal(manifest.assets.length,5);assert.match(manifest.mode,/Built-in/);for(const asset of manifest.assets){const bytes=fs.readFileSync(path.join('game-kit/adventures/scene-art-v2',asset.file));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert(bytes.length<1024*1024);assert(asset.prompt||asset.promptBrief);}
});
