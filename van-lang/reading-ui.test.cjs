const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),T=require('../game-kit/adventures/task-parts'),R=require('../game-kit/adventures/reading-passage');
test('Văn Lang never narrates option fallback text; a reading question is separate from its passage',()=>{
 assert.deepEqual(T.speech({scene:'',spokenScene:'red, blue, green, white.',options:['red','blue','green','white'],prompt:''},{course:'van-lang'}),[]);
 const q={scene:'Why did the boys enter the cave?',spokenScene:'wrong cached option fallback',storyText:Array(100).fill('passage').join(' '),partType:'readChoose',options:['To swim','To play','To sleep','To eat']};
 assert.deepEqual(T.speech(q,{course:'van-lang'}),[q.scene]);assert.equal(T.automatic(q,'van-lang'),false);assert.equal(T.instructionOnly(q,'van-lang'),true);
 for(const item of [{scene:'Blank (24)',partType:'readGap'},{scene:'She ___ at home.'},{scene:q.storyText}])assert.equal(T.automatic(item,'van-lang'),false);
});
test('Every cloze and comprehension question keeps the entire canonical source passage and answer',()=>{
 let references=0;const sources=new Map(Array.from({length:17},(_,i)=>[i+1,require('./exams/source/test-'+(i+1)+'.json')]));
 for(let n=1;n<=20;n++){const html=fs.readFileSync(path.join(root,`tu-luyen-${n}/index.html`),'utf8');for(const asset of ['reading-passage.js','listening-dock.js','listening-dock.css'])assert(html.includes(asset),`Level ${n} is missing ${asset}`);assert(html.indexOf('listening-dock.js')<html.indexOf('/engine.js'));const scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,`tu-luyen-${n}/quiz-data.js`),'utf8'),scope);
  for(const q of scope.window.ADVENTURE.items){const number=Number(q.id.match(/test-(\d+)-q/)[1]),bank=sources.get(number),original=bank.questions.find(x=>x.id===q.source.question);assert(original);assert.equal(q.answer,q.options[original.options.findIndex(o=>o.key===original.answer)]);if(!original.passageId)continue;references++;const passage=bank.passages[original.passageId];assert(passage?.textHtml);assert.equal(q.storyHtml,passage.textHtml);assert.equal(R.text(q),q.storyText);assert(R.render(q).includes(passage.textHtml));assert(q.passageKind==='cloze'||q.passageKind==='reading');}
 }assert(references>=170);
});
test('Every weekly structure heading is Vietnamese while formulae and examples stay intact',()=>{
 const {rules}=require('./grammar-authoring.cjs'),{vietnameseTag}=require('./grammar-headings.cjs');
 for(let week=1;week<=12;week++){const pack=require('./weekly/week-'+week+'.json');for(const [i,r]of pack.summary.entries()){const [old,formula,usage,example,exampleVi]=rules[week-1][i];assert.equal(r.tag,vietnameseTag(old));assert.deepEqual([r.usage,r.example,r.exampleVi],[usage,example,exampleVi]);assert(!/\bS\b|\bV\b|\bowner\b|\btime\b|\bcountable\b/.test(r.formula),r.formula);assert(r.usage.length>=90,r.tag);}}
 assert.equal(vietnameseTag('Suggestions'),'Cấu trúc Lời mời / Lời đề nghị');assert.equal(vietnameseTag('Passive Voice'),'Câu Bị động');assert.equal(vietnameseTag('Reported Speech'),'Câu Tường thuật / Gián tiếp');assert.equal(vietnameseTag('Comparisons'),'Cấu trúc So sánh');
});
test('Phonics Treasure map navigation goes directly to the same course and retains the guarded context',async()=>{
 const host={innerHTML:'',className:''},course={courseId:'phonics-3',journeyUrl:'https://example.test/vanlang-on-thi-lop-6/khoa-hoc/?course=phonics-3&student='+('A'.repeat(22))+'&limit=12&visit=checked&release=qa'},game={kind:'unit-review',unit:3,n:12,items:Array(45).fill({})},C={active:{student:'A'.repeat(22)},decorate(u,c,id){u.searchParams.set('student',c.student);u.searchParams.set('course',id);}};
 const env={URL,URLSearchParams,location:{href:'https://example.test/vanlang-on-thi-lop-6/khoa-hoc/?course=phonics-3&lesson=unit-3-checkpoint&section=grammar&play=1'},document:{querySelector:()=>host},StudentContext:C,window:{ADVENTURE:game,GAME_CONFIG:course,StudentContext:C,FlowBoot:{cancel(){}}}};vm.runInNewContext(fs.readFileSync(path.join(root,'game-kit/adventures/unit-review-menu.js'),'utf8'),env);
 const u=new URL(env.window.UnitReviewMenu.mapUrl());assert.equal(u.pathname,'/vanlang-on-thi-lop-6/vu-tru/');for(const [k,v]of Object.entries({course:'phonics-3',student:'A'.repeat(22),limit:'12',focus:'12',visit:'checked',release:'qa',view:'map'}))assert.equal(u.searchParams.get(k),v);for(const k of ['lesson','section','play','startAt'])assert(!u.searchParams.has(k));
 assert.equal(await env.window.UnitReviewMenu.prepare(),false);assert(host.innerHTML.includes('data-review-map'));assert(host.innerHTML.includes('Bản đồ hành tinh'));
});
