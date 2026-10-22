const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Scenes=require('./test-scenes'),T=require('./task-parts'),D=require('./dialogue'),{cast,castTurns}=require('../tools/dialogue-cast.cjs');
const root=path.resolve(__dirname,'../..');
test('VL reads the short question and blank number, never the reference or options',()=>{
 const passage=Array(100).fill('A long source passage.').join(' '),options=['is','are','am','be'];
 assert(T.instructionOnly({scene:'',prompt:'',partInstruction:'Choose the word with a different sound.'},'van-lang'));
 const gap={scene:'The children ___ helping their neighbours.',partInstruction:'Read and complete.',options,answer:'are'};
 assert.equal(T.automatic(gap,'van-lang'),true);assert.deepEqual(T.speech(gap,{course:'van-lang'}),[gap.scene]);
 assert.deepEqual(T.speech({scene:'Blank (27)',storyText:passage,passageKind:'cloze'},{course:'van-lang'}),['Choose the word for blank 27.']);
 assert.deepEqual(T.speech({scene:passage,storyText:passage,prompt:'Why do the children help their neighbours?'},{course:'van-lang'}),['Why do the children help their neighbours?']);
 assert.deepEqual(T.speech({scene:'',spokenScene:options.join(', '),options},{course:'van-lang'}),[]);
 assert(T.instructionOnly({type:'sequence',scene:'Put the events in order.'},'van-lang'));
});
test('VL dialogue manifests preserve named turns and use distinct role performances',()=>{
 const manifest=require('./dialogue-audio/van-lang.json'),source=require('./dialogue-audio/source.json'),clips=new Map(source.clips.map(c=>[c.id,c]));let dialogues=0;
 for(let n=1;n<=20;n++){const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,`tu-luyen-${n}/quiz-data.js`),'utf8'),c);for(const q of c.window.ADVENTURE.items){const turns=D.turns(q);if(!turns.length)continue;dialogues++;const seq=manifest.entries[q.scene];assert(seq?.length,q.id);assert.deepEqual([...new Set(seq.map(c=>c.speaker))],[...new Set(turns.filter(t=>/[A-Za-z0-9]|___/.test(t.text)).map(t=>t.speaker))]);const voices=new Set(seq.map(c=>clips.get(path.basename(c.src,'.mp3'))?.voice).filter(Boolean));if(turns.filter(t=>/[A-Za-z]/.test(t.text)).length>=2)assert(voices.size>=2,q.id);assert(seq.every(c=>!q.options.includes(clips.get(path.basename(c.src,'.mp3'))?.text)));}}
 assert(dialogues>5);assert.equal(cast('Billy').role,'littleBoy');assert.equal(cast('Teacher').role,'woman');assert.equal(cast('Student').role,'boy');assert.equal(cast('Mum').role,'woman');assert.equal(cast('Narrator').voice,cast('Titi').voice);
 assert.notEqual(castTurns([{speaker:'Tung'},{speaker:'Phong'}]).get('Tung').voice,castTurns([{speaker:'Tung'},{speaker:'Phong'}]).get('Phong').voice);
});
test('VL picture questions retain the original resource image and bypass art replacements',()=>{
 const c={window:{TitiImageVariants:{url:()=>'/wrong.webp'},GameMedia:{url:()=>'/wrong.webp'},ClayArtwork:{source:()=>'/wrong.webp'}}};vm.runInNewContext(fs.readFileSync(path.join(root,'game-kit/image-warmup.js'),'utf8'),c);let pictures=0;
 for(let n=1;n<=20;n++){const scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,`tu-luyen-${n}/quiz-data.js`),'utf8'),scope);for(const q of scope.window.ADVENTURE.items){if(!q.picturePrompt)continue;pictures++;const testNumber=+q.id.match(/test-(\d+)-q/)[1],bank=require(path.join(root,`van-lang/exams/source/test-${testNumber}.json`)),original=bank.questions.find(x=>x.id===q.source.question),src=`../van-lang/exams/source/test-${testNumber}/${bank.images[original.imageId].src}`;assert.equal(q.picturePrompt.src,src);const html=Scenes.render(q);assert(html.includes('<img src="'+src+'"'));assert(!html.includes(q.why));assert.equal(c.window.TitiImages.url(src),src);assert.equal(c.window.TitiImages.source(q.picturePrompt),src);assert(fs.statSync(path.resolve(root,'khoa-hoc',src)).size>0);}}
 assert.equal(pictures,40);
});
test('reset supports scoped storage wrappers and leaves other lessons and history intact',()=>{
 const values=new Map([['lesson-a','old'],['lesson-a:dictation-v1','old'],['lesson-b','keep'],['universe_progress_phonics-1','keep']]);const storage={removeItem:k=>values.delete(k)},window={},document={createElement:()=>({}),head:{append(){}}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'start-new-journey.js'),'utf8'),{window,document});window.StartNewJourney.clearLevel(storage,'lesson-a');assert(!values.has('lesson-a'));assert(!values.has('lesson-a:dictation-v1'));assert.equal(values.get('lesson-b'),'keep');assert.equal(values.get('universe_progress_phonics-1'),'keep');
});
