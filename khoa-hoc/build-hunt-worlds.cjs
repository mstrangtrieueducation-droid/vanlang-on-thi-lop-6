const fs=require('fs'),path=require('path'),core=require('../game-kit/adventures/hunt-world-core.js'),v2=require('./build-panorama.cjs'),profiles=require('../game-kit/adventures/panoramas/profiles.json'),sources=require('../game-kit/adventures/hunt-worlds/sources.json'),units=require('./phonics-units.cjs');
for(const p of profiles){const art=sources.objects.find(a=>a.course===p.course&&a.unit===p.unit);if(!art)throw Error('Missing atlas '+p.course+p.unit);const pack=core.make(v2.build(p),p,art,sources.scenes,units[+p.course.at(-1)].find(u=>u.unit===p.unit)),dir=path.join(__dirname,'hunt-worlds',p.course);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,`unit-${p.unit}.json`),JSON.stringify(pack,null,2)+'\n');}
// Sound prompts and target groups come from the curriculum, then the presentation
// builder applies the current one-picture-per-Unit storybook specification.
require('./build-storybook.cjs');
console.log('32 Unit packs · 640 challenges · one fixed 2D picture per Unit');
