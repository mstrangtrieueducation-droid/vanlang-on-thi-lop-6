const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),dir=path.join(root,'game-kit/adventures/pictures/family-cards/3d-v3');
const old=require('../../game-kit/adventures/pictures/family-cards/manifest.json');
const items={};
for(const [i,key] of Object.keys(old).entries()){
 const sheet=Math.floor(i/12),file=path.join(dir,`sheet-${sheet}.png`);
 if(!fs.existsSync(file))throw Error(`Missing generated artwork sheet ${sheet}`);
 const png=fs.readFileSync(file),width=png.readUInt32BE(16),height=png.readUInt32BE(20);
 const src=`../game-kit/adventures/pictures/family-cards/3d-v3/sheet-${sheet}.png`;
 items[key]={src,atlas:src,columns:3,rows:4,cell:i%12,cellAspect:(width/3)/(height/4),width,height,semantic:key.split(':').at(-1),artPack:'family-3d-v3',artwork:'Original generated 3D illustration · MS TRANG TRIEU EDUCATION'};
}
const extra=require('../../game-kit/adventures/pictures/family-cards/3d-v3/test-prompts.json');
const icons={},people={};
for(const p of Object.values(items))if(!icons[p.semantic])icons[p.semantic]=p;
function card(sheet,cell,semantic){const file=path.join(dir,`sheet-${sheet}.png`),png=fs.readFileSync(file),width=png.readUInt32BE(16),height=png.readUInt32BE(20),src=`../game-kit/adventures/pictures/family-cards/3d-v3/sheet-${sheet}.png`;return {src,atlas:src,columns:3,rows:4,cell,cellAspect:width/3/(height/4),width,height,semantic,artPack:'family-3d-v3'};}
extra.extraKeys.forEach((row,i)=>row.forEach((word,j)=>icons[word]=card(15+i,j,word)));
extra.peopleKeys.forEach((row,i)=>row.forEach((word,j)=>people[word]=card(20+i,j,word)));
require('../../game-kit/adventures/pictures/family-cards/3d-v3/scene-prompts.json').keys.forEach((word,j)=>icons[word]=card(22,j,word));
icons.television=icons.TV;icons.shelf=icons['shelf-only'];
icons.table=icons['table-only'];icons.fish=icons['fish-live'];
// The classroom table card should show only the table, not a second answer (chair).
items['2:1:table']={...icons.table,semantic:'table'};
const manifest={version:3,items,icons,people};
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(root,'game-kit/adventures/family-art-data.js'),'window.FamilyArtwork='+JSON.stringify(manifest)+';\n');
console.log(`Family artwork: ${Object.keys(items).length} semantic cards`);
