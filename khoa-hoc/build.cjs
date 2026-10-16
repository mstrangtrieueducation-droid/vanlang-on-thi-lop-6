const fs=require('node:fs'),path=require('node:path'),courses=require('./content.cjs');
const output=path.join(__dirname,'data');fs.mkdirSync(output,{recursive:true});
for(const c of Object.values(courses))fs.writeFileSync(path.join(output,c.id+'.json'),JSON.stringify(c));
console.log(`${Object.keys(courses).length} courses; ${Object.values(courses).reduce((n,c)=>n+c.lessons.length,0)} lessons; ${Object.values(courses).reduce((n,c)=>n+c.lessons.reduce((n,l)=>n+l.items.length,0),0)} questions.`);
