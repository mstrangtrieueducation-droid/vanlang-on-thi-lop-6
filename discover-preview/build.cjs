/* Staff review build. Publishing this does not migrate pupil permissions. */
const fs=require('node:fs'),path=require('node:path');
const build=require('../khoa-hoc/discover.cjs');
const links=require('../khoa-hoc/program/discover-test-links.json');
const courses=Object.values(build({})).map(c=>({...c,status:'staff-preview',version:2,officialTests:links.filter(t=>t.level===Number(c.id.at(-1))).map(({test,url})=>({test,url}))}));
if(require.main===module){
fs.mkdirSync(path.join(__dirname,'data'),{recursive:true});
for(const course of courses){
 const dir=path.join(__dirname,'data',course.id);fs.mkdirSync(dir,{recursive:true});
 for(const lesson of course.lessons)fs.writeFileSync(path.join(dir,lesson.id+'.json'),JSON.stringify(lesson)+'\n');
 const catalog={...course,lessons:course.lessons.map(({items,...lesson})=>({...lesson,questionCount:items.length,skills:[...new Set(items.map(q=>q.skill))],items:[]}))};
 fs.writeFileSync(path.join(__dirname,'data',course.id+'.json'),JSON.stringify(catalog)+'\n');
}
console.log(courses.map(c=>`${c.id}: ${c.lessons.length} lessons, ${c.lessons.reduce((n,l)=>n+l.items.length,0)} questions`).join('\n'));
}
module.exports=courses;
