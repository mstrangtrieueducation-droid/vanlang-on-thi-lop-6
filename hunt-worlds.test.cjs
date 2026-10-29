const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),profiles=require('./game-kit/adventures/panoramas/profiles.json');
const media=new Map(require('./game-kit/adventures/media-manifest.json').assets.map(a=>[a.url,a])),exists=url=>media.has(url)||fs.existsSync(path.resolve('khoa-hoc',url));
test('sound models end before the following vocabulary examples, preserving only one phoneme per clip',()=>{
 const source=require('./game-kit/adventures/hunt-worlds/phonemes/sources.json');assert.equal(source.clips.length,28);for(const c of source.clips){assert(c.endSeconds<c.nextUtteranceStarts,c.name);assert(c.endSeconds-c.startSeconds<1.3);assert(media.has('/titi-game-media/assets/hunt-worlds/phonemes/'+c.isolated));}
});
test('each Unit keeps one local setting and valid measured targets across its twenty challenges',()=>{
 for(const p of profiles){const pack=require('./khoa-hoc/hunt-worlds/'+p.course+'/unit-'+p.unit+'.json');assert.equal(pack.questions.length,20);assert.equal(new Set(pack.questions.map(q=>q.world)).size,1);assert(['2D storybook','Soft 3D storybook panorama'].includes(pack.artStyle));assert(exists(pack.scene.background));if(!pack.spellingRevision)assert.equal(pack.questions.filter(q=>q.sound).length,2);
  for(const q of pack.questions){assert(exists(q.background));assert.equal(new Set(q.objects.map(o=>o.id)).size,pack.objects.length);for(const g of q.groups){assert(g.need>0&&g.need<=g.targets.length);for(const id of g.targets)assert(q.objects.some(o=>o.id===id));}if(q.sound){assert.equal(q.sound.repetitions,2);assert.equal(q.sound.pauseMs,550);assert(q.sound.clip.endsWith('-isolated.wav'));assert(exists(q.sound.clip));assert(q.groups.every(g=>g.targets.every(id=>q.sound.letters.includes(q.objects.find(o=>o.id===id).word.toUpperCase()))));}}
 }
});
test('every current question has local native audio, with word spellings pronounced as source words rather than IPA',()=>{
 const voice=require('./game-kit/adventures/unit-scenes-v4/hunt-audio.json');for(const p of profiles){const pack=require('./khoa-hoc/hunt-worlds/'+p.course+'/unit-'+p.unit+'.json');for(const q of pack.questions){const text=q.audioText||(q.sound?q.sound.instruction:q.prompt);assert(voice[text],text);assert(exists(voice[text]));if(q.audioText)assert(!/[æʃðθː]/.test(q.audioText));}}
});
test('the isolated sound source mapping still preserves long vowels, digraphs and soft C',()=>{
 const C=require('./game-kit/adventures/hunt-world-core.js'),units=require('./khoa-hoc/phonics-units.cjs'),expected=[['a_e','eɪ'],['i_e','aɪ'],['o_e','oʊ'],['ai','eɪ'],['ee','iː'],['ie','aɪ'],['oa','oʊ'],['oo','uː']];for(const [i,[pattern,ipa]]of expected.entries()){const p=profiles.find(p=>p.course==='phonics-3'&&p.unit===i+1),plan=C.soundPlan(p,units[3][i]);assert(plan.some(s=>s.pattern===pattern&&s.ipa===ipa));}const p=profiles.find(p=>p.course==='phonics-4'&&p.unit===4);assert(C.soundPlan(p,units[4][3]).some(s=>s.pattern==='sh'&&s.ipa==='ʃ'));const soft=profiles.find(p=>p.course==='phonics-4'&&p.unit===8);assert(C.soundPlan(soft,units[4][7]).some(s=>s.pattern==='c-soft'&&s.ipa==='s'));
});
