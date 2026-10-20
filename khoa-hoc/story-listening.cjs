/* One verified textbook sentence per listening question; no whole-story audio. */
module.exports=function({items,book,unit,vocabulary,picture}){
 const gaps=items.filter(q=>q.interaction==='phonics-story'&&q.scene.includes('___'));
 if(gaps.length<3)throw Error('Missing source story sentences');
 return Array.from({length:6},(_,i)=>{
  const source=gaps[i%gaps.length],pictureTask=i>=gaps.length;
  return {...source,id:pictureTask?`phonics-${book}-v4-u${unit}-sentence-picture-${i+1}`:source.id,
   storySentence:source.spokenScene,storyIllustration:`../game-kit/adventures/story-scenes-v1/phonics-${book}-unit-${unit}.webp`,
   storyIllustrationAlt:source.storyTitle+' · Story scene',
   scene:source.scene,prompt:pictureTask?'Listen and choose the picture.':'Listen and choose the word.',spokenPrompt:'',
   ...(pictureTask?{pictureOptions:Object.fromEntries(source.options.map(word=>[word,picture(word)]))}:{}),
   partType:pictureTask?'listenPicture':'listenChoose',partInstruction:pictureTask?'Listen and choose a picture.':'Listen and choose.',
   interaction:'phonics-story',hint:'Listen to this sentence again. Look at the story picture.'};
 });
};
