/* Targeted release: preserve audited readings, audio, images and lesson metadata. */
const fs=require('node:fs'),path=require('node:path'),root=__dirname;
const ids=['phonics-1','phonics-2','phonics-3','phonics-4','family-friends-1','family-friends-2','discover-1','discover-2','discover-3','discover-4'];
const courses=Object.fromEntries(ids.map(id=>[id,JSON.parse(fs.readFileSync(path.join(root,'data',id+'.json')))]));
require('./program/resource-activities.cjs')(courses);
const counts={};for(const [id,c]of Object.entries(courses)){fs.writeFileSync(path.join(root,'data',id+'.json'),JSON.stringify(c));for(const lesson of c.lessons){fs.writeFileSync(path.join(root,'data',id,lesson.id+'.json'),JSON.stringify(lesson));for(const q of lesson.items)if(q.resourceTask)counts[q.resourceTask.kind]=(counts[q.resourceTask.kind]||0)+1;}}
console.log(JSON.stringify(counts));
