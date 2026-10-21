/* Localize teaching prose without touching question IDs, answer values or scoring. */
const fs=require('fs'),path=require('path'),language=require('./program/grammar-language.cjs');
const examples={...require('./program/grammar-example-vi.json'),...require('./program/grammar-extra-vi.json')};
const originalRules=require('./program/family-grammar-rules.cjs'),notes=require('./program/grammar-summary-vi.cjs'),help={};
for(const course of ['family-friends-1','family-friends-2']){
 const n=Number(course.at(-1));
 for(const l of require('./data/'+course+'.json').lessons)for(const q of l.items.filter(q=>q.skill==='grammar')){
  let text=q.why||'',rule=notes[n][(q.unit||1)-1]?.[2]||'Đọc cả câu để xác định chủ ngữ, số lượng và cấu trúc cần dùng.';
  for(const [i,note]of originalRules[n].entries())if(text.includes(note)){text=text.slice(0,text.indexOf(note)).trim();rule=notes[n][i][2];break;}
  const normalized=text.replace(/^Unit \d+ · Exercise \d+ · Number \d+:\s*/,'').replace(/\.{2,}$/g,'.');
  help[q.why]={note:language.vi(q.why)?q.why:rule,...(examples[normalized]?{example:normalized,exampleVi:examples[normalized]}:{})};
 }
}
const runtime=`/* Generated from reviewed Vietnamese teaching notes, never answer grading. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.GrammarVietnamese=api;})(globalThis,()=>{
 const notes=${JSON.stringify(help)},pos={noun:'danh từ',verb:'động từ',adj:'tính từ',adjective:'tính từ',adv:'trạng từ',adverb:'trạng từ','verb / noun':'động từ / danh từ',n:'danh từ',v:'động từ',a:'tính từ'};
 function explanation(q){if(q.skill!=='grammar'&&!q.grammarModule)return null;const entry=notes[q.why];if(q.explanationExample)return q.why+'\\n'+q.explanationExample.en+' → '+q.explanationExample.vi;if(!entry)return null;return entry.note+(entry.example?'\\n'+entry.example+' → '+entry.exampleVi:'');}
 function fighter(t){let s=String(t.explanation||'').replace(/\\b(noun|verb|adj|adv|adjective|adverb)\\b/g,w=>pos[w]||w);s=s.replace(/Câu gốc:[\\s\\S]*?(?=Các lựa chọn)/,'');return s;}
 return {explanation,hint:q=>notes[q.why]?.note||null,pos:s=>pos[s]||s,fighter};});
`;
fs.writeFileSync(path.join(__dirname,'../game-kit/adventures/grammar-vietnamese.js'),runtime);
let count=0;for(const c of fs.readdirSync(path.join(__dirname,'grammar')))for(const name of fs.readdirSync(path.join(__dirname,'grammar',c))){const file=path.join(__dirname,'grammar',c,name),pack=JSON.parse(fs.readFileSync(file));language.localize(pack,examples);fs.writeFileSync(file,JSON.stringify(pack,null,2)+'\n');count++;}
console.log('Localized '+count+' grammar packs and '+Object.keys(help).length+' shared explanations.');
