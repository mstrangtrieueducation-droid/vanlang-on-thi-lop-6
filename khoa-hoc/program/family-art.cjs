/* Semantic replacement of the complete FF vocabulary picture bank.
 * Keep book/unit identity: cake and hot mean different things in different Units. */
const old=require('../../game-kit/adventures/pictures/family-cards/manifest.json');
const manifest=require('../../game-kit/adventures/pictures/family-cards/3d-v3/manifest.json');
const bySource=new Map(Object.entries(old).map(([key,p])=>[p.src,manifest.items[key]]));
function resolve(p){
 if(!p)return p;
 const art=bySource.get(p.src);
 return art?{...p,...art}:p;
}
function install(courses){
 for(const n of [1,2])for(const l of courses[`family-friends-${n}`].lessons)for(const q of l.items){
  if(q.picturePrompt)q.picturePrompt=resolve(q.picturePrompt);
  if(q.pictureOptions)q.pictureOptions=Object.fromEntries(Object.entries(q.pictureOptions).map(([w,p])=>[w,resolve(p)]));
  if(q.matchPictures)q.matchPictures=q.matchPictures.map(resolve);
 }
}
module.exports=install;module.exports.resolve=resolve;
