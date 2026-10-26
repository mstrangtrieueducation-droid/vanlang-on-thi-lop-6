const fs=require('node:fs'),path=require('node:path'),regions=require('./program/textbook-map-regions.cjs');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'game-kit/adventures/textbook-maps'),sources=JSON.parse(fs.readFileSync(path.join(folder,'sources.json'))),questions={};
regions['3-2'].nodes.seed=[63,60];
for(let book=1;book<=4;book++){
 const c=JSON.parse(fs.readFileSync(path.join(__dirname,`data/phonics-${book}.json`)));
 for(const l of c.lessons)for(const q of l.items){if(!['soundPath','listenMap'].includes(q.resourceTask?.kind))continue;
  const key=book+'-'+Math.floor((l.unit-1)/2),r=regions[key],source=sources.find(s=>s.file===`phonics-${book}-review-${Math.floor((l.unit-1)/2)+1}.webp`),required=q.resourceTask.kind==='soundPath'?q.answer.split(' → ').slice(1,-1):[q.answer];
  const extra=required.filter(w=>!r.nodes[w]);for(const w of extra)if(!sources.some(s=>s.file===`phonics-${book}-${w}.webp`))throw Error('Missing original illustration '+book+' '+w);
  const h=source.size[1]/source.size[0]*1000,total=h+(extra.length?180:0),nodes=Object.fromEntries(Object.entries(r.nodes).map(([word,[x,y]])=>[word,{x:x*10,y:y*h/100,rx:48,ry:42}]));
  extra.forEach((word,i)=>nodes[word]={x:(i+1)*1000/(extra.length+1),y:h+90,rx:65,ry:65,extra:`phonics-${book}-${word}.webp`});
  questions[q.id]={book,unit:l.unit,image:source.file,preview:source.preview,page:source.printedPage,height:h,total,nodes,required,extra,sourceURL:l.source?.url||c.source?.url||'',kind:q.resourceTask.kind};
 }
}
fs.writeFileSync(path.join(folder,'manifest.json'),JSON.stringify({version:1,questions}));
fs.writeFileSync(path.join(folder,'manifest.js'),'window.TextbookMapData='+JSON.stringify({version:1,questions})+';\n');
console.log('Original textbook maps:',Object.keys(questions).length,'questions; supplemental source crops:',Object.values(questions).filter(q=>q.extra.length).length);
