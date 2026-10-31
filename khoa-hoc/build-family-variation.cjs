const fs=require('node:fs'),path=require('node:path'),variation=require('./program/family-variation.cjs');
function write(){const report=[];for(const book of [1,2]){const id='family-friends-'+book,file=path.join(__dirname,'data',id+'.json'),c=JSON.parse(fs.readFileSync(file));let total=0;
for(let unit=1;unit<=15;unit++){let index=0;const seen=new Set();const replace=q=>{const next=variation.question(q,book,unit,index++),key=JSON.stringify([next.scene,next.prompt,next.answer]);if(seen.has(key))throw Error('Duplicate contextual task '+id+'/'+unit+'/'+next.id);seen.add(key);total++;return next;};
for(const lesson of c.lessons.filter(l=>l.unit===unit&&['practice','unit-review'].includes(l.kind))){lesson.items=lesson.items.map(q=>q.skill==='grammar'&&!q.storyId?replace(q):q);fs.writeFileSync(path.join(__dirname,'data',id,lesson.id+'.json'),JSON.stringify(lesson));}
const grammarPath=path.join(__dirname,'grammar',id,'unit-'+unit+'.json'),grammar=JSON.parse(fs.readFileSync(grammarPath));grammar.items=grammar.items.map(replace);if(grammar.items.length!==20)throw Error('Grammar count');fs.writeFileSync(grammarPath,JSON.stringify(grammar,null,2)+'\n');report.push({course:id,unit,questions:index,distinct:seen.size});}
fs.writeFileSync(file,JSON.stringify(c));fs.writeFileSync(path.join(__dirname,'data',id+'.index.json'),JSON.stringify({...c,lessons:c.lessons.map(({items,...l})=>({...l,questionCount:items.length}))}));console.log(id+': '+total+' contextual grammar tasks');}
return report;}
if(require.main===module)write();module.exports={write};
