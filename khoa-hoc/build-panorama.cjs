/* Stable, picture-grounded targets. Artwork is a single raster per Unit. */
const fs=require('fs'),path=require('path'),profiles=require('../game-kit/adventures/panoramas/profiles.json'),units=require('./phonics-units.cjs');
const plural=w=>({ax:'axes',ox:'oxen',mouse:'mice',wolf:'wolves',leaf:'leaves',fish:'fish',fruit:'pieces of fruit'}[w]||(/(s|sh|ch|x)$/.test(w)?w+'es':/[^aeiou]y$/.test(w)?w.slice(0,-1)+'ies':w+'s'));
function build(p){const words=p.words,colors=p.colors,objects=[],add=(id,word,color,x,y,w=9,h=16,extra={})=>objects.push({id,word,color,x,y,w,h,...extra});
 const red=[[10,48],[17,51],[24,48]];
 red.forEach(([x,y],i)=>add('first-'+i,words[0],colors[0],x,y,9,16));
 add('first-3',words[0],colors[1],45,80,10,17);add('first-4',words[0],colors[2],87,82,10,17);
 [[37,49],[44,52],[51,49]].forEach(([x,y],i)=>add('second-'+i,words[1],null,x,y,8,21));
 const other=[[65,49],[86,57],[24,79],[70,79]];
 words.slice(2).forEach((w,i)=>add('main-'+i,w,null,...other[i],i===0?12:16,i===0?16:23));
 p.letters.forEach((l,i)=>{add('upper-'+i,l,null,[19.5,49,82.2][i],14,9,13,{kind:'letter',case:'upper'});add('lower-'+i,l.toLowerCase(),null,[19.5,49,82.2][i],26,8,11,{kind:'letter',case:'lower'});});
 // Missing colours are never invented by the exercise generator.
 for(let i=objects.length-1;i>=0;i--)if(p.absent?.includes(objects[i].id))objects.splice(i,1);
 const ids=(word,color)=>objects.filter(o=>o.kind!=='letter'&&o.word===word&&(color===undefined||o.color===color)).map(o=>o.id),group=(targets,need=1)=>({targets,need}),q=(prompt,...groups)=>({prompt,groups});
 const main=objects.filter(o=>o.id.startsWith('main-')),a=words[0],b=words[1],c=colors[0],one=(i,fallback)=>main[i]?[group([main[i].id])]:fallback;
 const questions=[q(`Find the ${main[0]?.word||c+' '+a}!`,...one(0,[group(ids(a,c))])),q(`Where is the ${main[1]?.word||b}?`,...one(1,[group(ids(b))])),q(`Can you see the ${main[2]?.word||colors[1]+' '+a}?`,...one(2,[group(ids(a,colors[1]))])),q(`Touch the ${main[3]?.word||colors[2]+' '+a}!`,...one(3,[group(ids(a,colors[2]))])),q(`Find the capital ${p.letters[0]}!`,group(['upper-0'])),q(`Find the small ${p.letters[0].toLowerCase()}!`,group(['lower-0'])),q(`Find one big ${a}!`,group(ids(a))),q(`Find one ${b}!`,group(ids(b))),q(`Where is the big ${p.letters[1]}?`,group(['upper-1'])),q(`Where is the small ${p.letters[1].toLowerCase()}?`,group(['lower-1'])),q(`Find the ${colors[1]} ${a}!`,group(ids(a,colors[1]))),q(`Find the ${colors[2]} ${a}!`,group(ids(a,colors[2]))),q(`Find the uppercase ${p.letters[2]}!`,group(['upper-2'])),q(`Can you see the small ${p.letters[2].toLowerCase()}?`,group(['lower-2'])),q(`Find 3 big ${c} ${plural(a)}!`,group(ids(a,c),3)),q(`Find all 3 ${plural(b)}!`,group(ids(b),3)),q(`Find all 5 big ${plural(a)}!`,group(ids(a),5)),q(`Find 2 ${c} ${plural(a)}!`,group(ids(a,c),2)),q(`Find 2 ${plural(b)}!`,group(ids(b),2)),q(`Find one ${c} ${a} and the ${colors[1]} ${a}!`,group(ids(a,c)),group(ids(a,colors[1])))];
 for(const o of objects){const override=p.hotspots?.[o.id];if(override)Object.assign(o,override);}
 for(const item of questions){
  if(item.groups.some(g=>!g.targets.length)){item.prompt=`Touch the lowercase ${p.letters[1].toLowerCase()}!`;item.groups=[group(['lower-1'])];}
  for(const g of item.groups)g.need=Math.min(g.need,g.targets.length);
  item.prompt=item.prompt.replace(`all 5 big ${plural(a)}`,`all ${ids(a).length} big ${plural(a)}`);
  if(p.displayNames)item.prompt=item.prompt.replace(/\b[a-z]+\b/g,w=>p.displayNames[w]||w);
 }
 const n=+p.course.at(-1),u=units[n].find(u=>u.unit===p.unit);
 return {version:2,course:p.course,unit:p.unit,image:'../game-kit/adventures/panoramas/'+p.file,imageWidth:1672,imageHeight:941,source:{url:u.bookURL,page:u.page,adaptation:'New panorama composed from this Unit vocabulary; not a reproduced textbook scan.'},objects,questions:questions.map((q,i)=>({id:p.course+'-u'+p.unit+'-hunt-v2-'+(i+1),...q}))};
}
function write(){for(const p of profiles){const pack=build(p),dir=path.join(__dirname,'panorama',p.course);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,`unit-${p.unit}.json`),JSON.stringify(pack,null,2)+'\n');}console.log('32 panoramas · 640 listening challenges');}
if(require.main===module)write();module.exports={build,write};
