/* One semantic artwork registry for all course builders. Never replace a test's contextual diagram. */
const library=require('../game-kit/adventures/pictures/vocabulary-3d/manifest.json');
const sources=[require('../game-kit/adventures/pictures/book-cards/manifest.json'),require('../game-kit/adventures/pictures/family-cards/manifest.json')];
const sourceWords=new Map();
for(const source of sources)for(const [key,picture] of Object.entries(source))sourceWords.set(picture.src,key.split(':').at(-1).trim().toLowerCase());
function resolve(picture){
 if(!picture)return picture;
 const semantic=String(picture.semantic||sourceWords.get(picture.src)||'').trim().toLowerCase();
 const art=library.items[semantic];
 return art?{...picture,...art,artwork:'Original generated 3D vocabulary illustration'}:picture;
}
module.exports=function(courses){
 for(const course of Object.values(courses))for(const lesson of course.lessons)for(const q of lesson.items){
  if(q.exam)continue;
  if(q.picturePrompt)q.picturePrompt=resolve(q.picturePrompt);
  if(q.pictureOptions)q.pictureOptions=Object.fromEntries(Object.entries(q.pictureOptions).map(([word,p])=>[word,resolve(p)]));
  if(q.matchPictures)q.matchPictures=q.matchPictures.map(resolve);
 }
};
module.exports.resolve=resolve;
