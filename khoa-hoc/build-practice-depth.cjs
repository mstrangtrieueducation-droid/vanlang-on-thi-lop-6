/* Target only live audited lesson packs; never rebuild source tests or historical scores. */
const fs=require('fs'),path=require('path'),ids=['phonics-1','phonics-2','phonics-3','phonics-4','family-friends-1','family-friends-2'];
const courses=Object.fromEntries(ids.map(id=>[id,JSON.parse(fs.readFileSync(path.join(__dirname,'data',id+'.json')))]));
require('./program/practice-depth.cjs')(courses);
for(const [id,c]of Object.entries(courses)){fs.writeFileSync(path.join(__dirname,'data',id+'.json'),JSON.stringify(c));for(const l of c.lessons)fs.writeFileSync(path.join(__dirname,'data',id,l.id+'.json'),JSON.stringify(l));fs.writeFileSync(path.join(__dirname,'data',id+'.index.json'),JSON.stringify({...c,lessons:c.lessons.map(({items,...l})=>({...l,questionCount:items.length}))}));}
console.log('30-question practice lessons:',Object.values(courses).flatMap(c=>c.lessons).filter(l=>l.items.length===30).length);
