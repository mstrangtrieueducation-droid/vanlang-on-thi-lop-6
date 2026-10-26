/* Expand notation alternatives into complete, separately readable formula lines. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.GrammarLayout=api;})(globalThis,()=>{
 function expand(text){text=String(text||'').trim();if(!text)return [];const clauses=text.split(/\s*\/\s*/);if(clauses.length>1&&clauses.every(s=>s.trim().split(/\s+/).length>=3&&/[?!.]|\+/.test(s)))return clauses.flatMap(expand);
  const match=text.match(/[A-Za-z][A-Za-z’'-]*(?:\s*\/\s*[A-Za-z][A-Za-z’'-]*)+/);if(!match)return [text];return match[0].split(/\s*\/\s*/).flatMap(option=>expand(text.slice(0,match.index)+option+text.slice(match.index+match[0].length))).slice(0,64);
 }
 function lines(formula){const input=Array.isArray(formula)?formula.map(row=>Array.isArray(row)?row.join(' '):row):String(formula||'').split(/\n|\|/);return [...new Set(input.flatMap(text=>String(text).split(/;\s+|\n/).flatMap(expand)))];}
 return {lines,expand};
});
