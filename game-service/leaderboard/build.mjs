import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'vu-tru/catalog.json')));
const lessons={};for(const c of catalog){const data=JSON.parse(fs.readFileSync(path.resolve(root,'vu-tru',c.dataURL)));lessons[c.id]=Object.fromEntries(data.lessons.map(l=>[l.id,{id:l.id,title:l.title,track:l.track||'',exam:!!l.exam,items:l.items.map(q=>({id:q.id,answer:q.answer,options:q.options,inputMode:q.inputMode,acceptedAnswers:q.acceptedAnswers,grading:q.grading,combinedParts:q.combinedParts,answerRelations:q.answerRelations,relationKey:q.relationKey,relationOtherKeys:q.relationOtherKeys}))}]));}
fs.writeFileSync(new URL('curriculum.json',import.meta.url),JSON.stringify({catalog:catalog.map(c=>({id:c.id,name:c.name,tracks:c.tracks,lessons:c.lessons.map(l=>({id:l.id,track:l.track||''}))})),map:JSON.parse(fs.readFileSync(path.join(root,'vu-tru/teaching-map.json'))),lessons}));
console.log(JSON.stringify({courses:catalog.length,lessons:Object.values(lessons).reduce((n,x)=>n+Object.keys(x).length,0)}));
