const fs=require('fs'),path=require('path'),{rules,rows}=require('./grammar-authoring.cjs'),{vietnameseTag}=require('./grammar-headings.cjs');
for(let i=0;i<12;i++){
 const source=JSON.parse(fs.readFileSync(path.join(__dirname,'sources/week-'+(i+1)+'.json')));
 const summary=rules[i].map(([tag,formula,usage,example,exampleVi])=>({tag:vietnameseTag(tag),formula,usage,example,exampleVi}));
 const items=rows[i].split('\n').map((row,n)=>{const [scene,answer,wrong,why]=row.split('|'),options=[answer,...wrong.split('/')];if(options.length!==4||new Set(options).size!==4||!why)throw Error('Invalid week '+(i+1)+' row '+n);return {id:`vl-w${i+1}-grammar-${n+1}`,type:'choice',title:'Week '+(i+1)+' · Grammar',scene,prompt:'Choose the best answer.',options,answer,why,skill:'grammar',difficulty:n<4?'easy':n<8?'medium':'advanced',source:{url:source.url,section:'C. CẤU TRÚC',adaptation:'Centre-authored application of the linked weekly theory.'}};});
 fs.mkdirSync(path.join(__dirname,'weekly'),{recursive:true});fs.writeFileSync(path.join(__dirname,'weekly/week-'+(i+1)+'.json'),JSON.stringify({week:i+1,source:{url:source.url,title:source.title,modified:source.modified},summary,items},null,2)+'\n');
}
console.log('12 source-linked grammar summaries · 144 contextual grammar questions');
