const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'../..');
const legacy={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'tu-luyen-1/data.js'),'utf8'),legacy);
const source=require('./content.cjs');
const order=[1,2,3,4,13,5,6,7,8,14,9,10,11,12,15];
const clean=s=>String(s||'').replace(/<br\s*\/?\s*>/gi,'. ').replace(/<[^>]+>/g,'');
const sentence=a=>a.join(' ').replace(/ ([?.!])/g,'$1');
function convert(q){
 const base={...q,type:'choice',scene:clean(q.scene),sourceId:q.id};
 const out=(scene,prompt,options,answer,i)=>({...base,id:i===undefined?q.id:q.id+'-'+i,scene,prompt,options,answer});
 if(q.type==='choice')return [base];
 if(q.pairs)return q.pairs.map(([a,b],i)=>out(a,q.id==='w5'?'Which instruction has the opposite meaning?':'Which answer matches the clue?', [...new Set([b,...q.pairs.map(p=>p[1]),'None of these'])].slice(0,4),b,i));
 if(q.cards)return q.cards.map(([a,b],i)=>out(a,q.groups.includes('in')?'Which preposition goes before this time expression?':'Which group does this belong to?', [...q.groups,...(q.groups.length===2?['Both groups','Neither group']:['None of these'])].slice(0,4),b,i));
 if(q.type==='spot'||q.type==='repair')return [out(q.words?sentence(q.words):clean(q.scene),q.error?`Replace the incorrect word “${q.error}”.`:'Replace the incorrect preposition “in”.',[...q.options,...['in','of','None of these'].filter(v=>!q.options.includes(v))].slice(0,4),q.answer)];
 if(q.type==='collect'){const ans=q.answer.join(', '); const extras=q.options.filter(v=>!q.answer.includes(v));return [out(q.scene,'Which list contains exactly the requested items?',[ans,...[0,1,2].map((_,i)=>q.answer.map((v,j)=>j===i%q.answer.length?extras[i%extras.length]:v).join(', '))],ans)];}
 if(q.type==='route'){const names=['Top left','Top centre','Top right','Middle left','Centre','Middle right','Bottom left','Bottom centre','Bottom right'];const ans=names[q.answer[0]*3+q.answer[1]];return [out('Start at the bottom-left square of a 3 by 3 map. '+q.scene,'Where do you finish?',[ans,...names.filter(v=>v!==ans).slice(0,3)],ans)];}
 if(q.type==='sequence'){const ans=q.answer.join(' → ');return [out(q.scene,'Which order matches the story?',[ans,[...q.answer].reverse().join(' → '),[...q.answer.slice(1),q.answer[0]].join(' → '),[q.answer[1],q.answer[0],...q.answer.slice(2)].join(' → ')],ans)];}
 // Sentence completion preserves the entire target sentence without ambiguous word-order distractors.
 const a=[...q.answer];if(q.punct)a.push(q.punct);const targets=['am','visited','plans','opened','have to','would like','takes','is','are','was','were','do','does','Do','Does','can','should','will','goes','playing','reading','to','in','on','at'];let idx=a.findIndex(v=>targets.includes(v));if(idx<0)idx=0;const ans=a[idx];const pools={am:['is','are','be'],visited:['visit','visits','visiting'],plans:['plan','planning','planned'],opened:['open','opens','opening'],'have to':['has to','having to','had to'],'would like':['would likes','would liking','would liked'],takes:['take','taking','taken'],is:['are','am','be'],are:['is','am','be'],was:['were','is','be'],were:['was','are','be'],do:['does','is','are'],does:['do','is','are'],Do:['Does','Is','Are'],Does:['Do','Is','Are'],can:['cans','canning','canned'],should:['shoulds','shoulding','shoulded'],will:['wills','willing','willed'],goes:['go','going','gone'],playing:['play','plays','played'],reading:['read','reads','reader'],to:['at','on','of'],in:['on','at','of'],on:['in','at','of'],at:['in','on','of']};
 const fallback={What:['Where','When','Who'],'How about':['How many','How much','How long']};const wrong=pools[ans]||fallback[ans]||['is','are','does'];a[idx]='___';return [out(clean(q.scene)+'\n'+sentence(a),'Which word or phrase completes the sentence?',[ans,...wrong],ans)];
}
const first={n:1,week:'Tuần 1',theme:'school',icon:'⭐',topics:'Thông tin cá nhân · đồ dùng · từ hỏi · in/on/at',reward:'Word Explorer',items:legacy.window.GAME_DATA.flatMap(s=>s.items)};
const games=[first,...source].map(g=>({...g,name:'Thử thách '+(order.indexOf(g.n)+1),en:'Challenge '+(order.indexOf(g.n)+1),goal:'Nghe câu hỏi, suy nghĩ và chọn đáp án đúng.',items:g.items.flatMap(convert).map(q=>({...q,scene:clean(q.scene),hint:q.hint||q.why,speech:[clean(q.scene),q.prompt].filter(Boolean).join(' ')}))}));
module.exports=games;
