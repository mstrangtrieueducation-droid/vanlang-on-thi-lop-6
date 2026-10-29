/* Upgrade code-native glyphs to the Unit's actual spellings. Raster artwork is not repainted. */
const fs=require('fs'),path=require('path'),crypto=require('crypto'),units=require('./phonics-units.cjs');
const root=path.resolve(__dirname,'..'),profiles=require('../game-kit/adventures/panoramas/profiles.json');
const spelling=p=>p.replace(/-(?:voiced|unvoiced|soft|ee|igh|yoo|oo)$/,'');
function write(){let count=0;const audio=new Set();fs.mkdirSync(path.join(root,'private/scene-spec-20261030'),{recursive:true});
 for(const p of profiles.filter(p=>p.course!=='phonics-1'&&!(p.course==='phonics-4'&&p.unit>6))){
  const u=units[+p.course.at(-1)][p.unit-1],file=path.join(__dirname,'hunt-worlds',p.course,'unit-'+p.unit+'.json'),pack=JSON.parse(fs.readFileSync(file,'utf8')),patterns=[...new Set(u.levels.flatMap(l=>l.patterns))],glyphs=pack.objects.filter(o=>o.kind==='letter'||o.kind==='grapheme');
  let svg=fs.readFileSync(path.join(root,'game-kit/adventures/storybook-v1/scenes',p.course+'-unit-'+p.unit+'.svg'),'utf8'),index=0;
  const assignments=glyphs.map((o,i)=>{const pattern=patterns[i%patterns.length],text=spelling(pattern),lesson=u.levels.find(l=>l.patterns.includes(pattern)),example=lesson.words.find(w=>text.includes('_')?new RegExp(text.replace('_','.+')).test(w):w.includes(text))||lesson.words[0];return {o,pattern,text,example};});
  svg=svg.replace(/<text\b[^>]*>[^<]*<\/text>/g,tag=>{const a=assignments[index++];if(!a)throw Error('Unexpected text');const size=Math.min(72,170/(a.text.length*.7));return tag.replace(/font-size="[^"]*"/,'font-size="'+size+'"').replace(/>[^<]*<\/text>/,'>'+a.text+'</text>');});
  if(index!==assignments.length)throw Error('Missing source glyphs '+p.course+p.unit);
  for(const a of assignments)Object.assign(a.o,{word:a.text,kind:'grapheme',sourcePattern:a.pattern,case:undefined,w:Math.min(15,Math.max(5,a.text.length*4.5)),h:9,protectedSilhouette:true,occlusion:0});
  const letterQuestions=pack.questions.filter(q=>q.sound||q.groups.some(g=>g.targets.some(id=>glyphs.some(o=>o.id===id))));
  letterQuestions.forEach((q,i)=>{const a=assignments[i%assignments.length];delete q.sound;q.prompt='Find the spelling in "'+a.example+'".';q.audioText=a.example;q.repeatAudio=2;q.sourcePattern=a.pattern;q.groups=[{targets:assignments.filter(b=>b.text===a.text).map(b=>b.o.id),need:1}];audio.add(a.example);});
  const background='../game-kit/adventures/unit-scenes-v4/'+p.course+'-unit-'+p.unit+'-spelling.webp';
  pack.storageRevision=6;pack.spellingRevision=1;pack.renderSourceSha256=crypto.createHash('sha256').update(svg).digest('hex');pack.scene.background=background;pack.objects.forEach(o=>{if(o.kind==='grapheme')o.box=[o.x-o.w/2,o.y-o.h/2,o.w,o.h];});
  pack.questions.forEach(q=>{q.background=background;q.objects=pack.objects;});
  fs.writeFileSync(path.join(root,'private/scene-spec-20261030',p.course+'-unit-'+p.unit+'-spelling.svg'),svg);fs.writeFileSync(file,JSON.stringify(pack,null,2)+'\n');count++;
 }
 fs.writeFileSync(path.join(root,'private/scene-spec-20261030/spelling-audio.json'),JSON.stringify([...audio]));console.log(JSON.stringify({spellingScenes:count,newWords:audio.size}));
}
if(require.main===module)write();module.exports={write};
