const fs=require('node:fs'),path=require('node:path');
const games=require('./quiz-content.cjs'),root=path.resolve(__dirname,'../..');
const title=n=>`ÔN THI VĂN LANG - TIẾNG ANH - GAME TỰ LUYỆN ${n}`;
const speech=q=>[q.scene||(q.words?q.words.join(' ').replace(/ ([?.!])/g,'$1'):''),q.prompt].filter(Boolean).join(' ').replace(/___/g,' blank ').replace(/\/ɪd\//g,'id').replace(/\/s\//g,'the S sound');
for(const g of games){
 const dir=path.join(root,`tu-luyen-${g.n}`);fs.mkdirSync(dir,{recursive:true});
 const data={...g,items:g.items.map(q=>({...q,speech:speech(q)}))};
 fs.writeFileSync(path.join(dir,'quiz-data.js'),'window.ADVENTURE='+JSON.stringify(data,null,2)+';\n');
 fs.writeFileSync(path.join(dir,'config.js'),'window.GAME_CONFIG='+JSON.stringify({id:`tu-luyen-${g.n}`,storageKey:`mtt-tu-luyen-${g.n}-v1`,title:title(g.n)})+';\n');
 fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#422ac4"><title>${title(g.n)}</title><link rel="stylesheet" href="../game-kit/adventures/style.css?v=forest-3"><link rel="stylesheet" href="../game-kit/adventures/forest.css?v=forest-3"></head><body><main id="adventure"></main><div id="announce" class="sr" role="status" aria-live="polite"></div><script src="config.js?v=forest-3"></script><script src="../game-kit/profile.js"></script><script src="quiz-data.js?v=forest-3"></script><script src="../game-kit/adventures/audio-map.js?v=forest-3"></script><script src="../game-kit/confetti.min.js"></script><script src="../game-kit/adventures/rules.js?v=forest-3"></script><script src="../game-kit/adventures/day-night.js?v=forest-3"></script><script src="../game-kit/adventures/engine.js?v=forest-3"></script></body></html>`);
}
fs.writeFileSync(path.join(__dirname,'catalog.js'),'window.ADVENTURE_CATALOG='+JSON.stringify([...games.map(({items,...g})=>({...g,count:items.length,progressIds:items.map(({id,sourceId})=>({id,sourceId}))}))])+';\n');
const audio=new Map();
const legacy={window:{}};require('node:vm').runInNewContext(fs.readFileSync(path.join(root,'tu-luyen-1/data.js'),'utf8'),legacy);for(const stage of legacy.window.GAME_DATA)for(const q of stage.items)if(q.type==='choice')for(const v of q.options)audio.set(v,v);
fs.writeFileSync(path.join(__dirname,'legacy-audio-keys.json'),JSON.stringify([...audio.keys()]));
for(const g of games)for(const q of g.items){audio.set(speech(q),speech(q));if(q.spokenScene)audio.set(q.spokenScene,q.spokenScene);if(q.type==='choice'){audio.set(q.scene,q.scene.replace(/___/g,' blank '));audio.set(q.prompt,q.prompt.replace(/the sound \/s\//g,'the S sound').replace(/\/s\//g,'the S sound'));}for(const text of [...(q.options||[]),...(q.pairs||[]).flat(),...(q.cards||[]).map(c=>c[0]),...(Array.isArray(q.answer)?q.answer:[])])if(typeof text==='string'&&!['.','!','?'].includes(text))audio.set(text,text);}
for(const t of ['Read the clue and choose the correct answer.','Great job!','Try again. You can do it!','Amazing! Your adventure is complete!','Find the matching pairs.','Ready? Let’s go!'])audio.set(t,t);
fs.writeFileSync(path.join(__dirname,'audio-manifest.json'),JSON.stringify([...audio].map(([key,text])=>({key,text})),null,2));
console.log(`${games.length} games, ${games.reduce((s,g)=>s+g.items.length,0)} activities, ${audio.size} audio clips`);
module.exports={speech};


