/* Stable, source-aware difficulty. Original exams retain their source sequence. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.PracticeDifficulty=api;})(globalThis,()=>{
 const ranks={easy:1,medium:2,advanced:3};
 function rank(q){if(q.cognitiveLevel)return ranks[q.cognitiveLevel]||2;if(q.exam||q.keepOrder)return 0;if(/infer|why |best (?:title|main)|main idea|feel|lesson .*suggest|conclude|author|purpose|evidence|except|not given/i.test(q.prompt||''))return 3;if(q.skill==='grammar'||q.inputMode==='typing'||q.orderWords||q.storyId)return 2;return ranks[q.difficulty]||1;}
 function plan(items,parts){if(items.some(q=>q.exam||q.keepOrder||/previous (?:question|answer)|text above/i.test(q.prompt||'')))return [...items];if(/^(family-friends-|discover-)/.test(items[0]?.id||''))return parts.group([...items].sort((a,b)=>rank(a)-rank(b)));return [1,2,3].flatMap(n=>parts.group(items.filter(q=>rank(q)===n)));}
 return {rank,plan};
});
