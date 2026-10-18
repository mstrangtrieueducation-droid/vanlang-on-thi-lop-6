const fs=require('node:fs'),path=require('node:path'),courses=require('./content.cjs');
fs.writeFileSync(path.join(__dirname,'../vu-tru/teaching-map.json'),JSON.stringify({...require('./family.cjs').teachingMap,...require('./discover-release.cjs').teachingMap}));
const output=path.join(__dirname,'data');fs.mkdirSync(output,{recursive:true});
for(const c of Object.values(courses)){
 fs.writeFileSync(path.join(output,c.id+'.json'),JSON.stringify(c));
 const dir=path.join(output,c.id);fs.mkdirSync(dir,{recursive:true});
 for(const l of c.lessons)fs.writeFileSync(path.join(dir,l.id+'.json'),JSON.stringify(l));
 fs.writeFileSync(path.join(output,c.id+'.index.json'),JSON.stringify({...c,lessons:c.lessons.map(({items,...l})=>({...l,questionCount:items.length}))}));
}
console.log(`${Object.keys(courses).length} courses; ${Object.values(courses).reduce((n,c)=>n+c.lessons.length,0)} lessons; ${Object.values(courses).reduce((n,c)=>n+c.lessons.reduce((n,l)=>n+l.items.length,0),0)} questions.`);
require('../vu-tru/build-catalog.cjs');
require('./build-grammar.cjs').write();
