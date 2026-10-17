(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.GameplayCore=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';const isChoice=q=>q?.type==='choice'&&Array.isArray(q.options)&&q.options.length===4&&typeof q.answer==='string'&&q.options.includes(q.answer);
 function mode(q,index,standard=false){if(standard||q.phonicsSequence||!isChoice(q))return 'standard';if(['recall','dictation','sentence'].includes(q.interaction))return q.interaction;if(/_{2,}|\.{2,}|…/.test((q.scene||'')+' '+q.prompt))return 'energy';if(/^[a-z]{4,10}$/i.test(q.answer)&&index%3===2)return 'cipher';if(q.options.every(x=>typeof x==='string'&&x.length<25))return 'meteor';return 'signal';}
 function pairs(items){const found=[],answers=new Set(),clues=new Set();for(const q of items){const clue=[q.scene,q.prompt].filter(Boolean).join(' ');if(q.phonicsSequence||!isChoice(q)||clue.length>220||q.answer.length>90||answers.has(q.answer)||clues.has(clue)||/^Listen to Titi/i.test(q.scene||''))continue;found.push({id:q.id,clue,answer:q.answer});answers.add(q.answer);clues.add(clue);}return found.length===4?found:[];}
 function powers(run){return run.gameplay ||= {half:2,radar:2,shield:1,armed:false,protectedId:null,protectedCombo:0,eliminated:{},bonus:[],assisted:[]};}
 function eliminate(q,existing,count){return q.options.filter(x=>x!==q.answer&&!existing.includes(x)).slice(0,count);}
 function wrongCombo(run,id,combo){const p=powers(run);if(p.armed){p.armed=false;p.protectedId=id;p.protectedCombo=combo;return combo;}p.protectedId=null;return 0;}
 function correctCombo(run,id,combo,wrong){const p=powers(run),next=wrong?(p.protectedId===id?p.protectedCombo:0):combo+1;p.protectedId=null;return next;}
 return {mode,pairs,powers,eliminate,isChoice,wrongCombo,correctCombo};
});
