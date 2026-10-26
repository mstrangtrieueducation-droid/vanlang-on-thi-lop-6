const fs=require('fs'),path=require('path'),{themes,anchors}=require('./storybook-scene.cjs');
const base=path.resolve(__dirname,'..'),media=process.env.TITI_MEDIA_REPO;if(!media)throw Error('Set TITI_MEDIA_REPO');
const art=require('./storybook-art.json'),profiles=require('../game-kit/adventures/panoramas/profiles.json'),backgrounds=require('./storybook-backgrounds.json');
const {materialMask,paintedUse}=require('./storybook-materials.cjs');
const out=path.join(base,'game-kit/adventures/storybook-v1/scenes');fs.mkdirSync(out,{recursive:true});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hues={red:0,blue:210,green:120,black:0,yellow:55,purple:280,orange:30};
const manifest=[];
for(const [index,p]of profiles.entries()){
 const file=path.join(__dirname,'hunt-worlds',p.course,`unit-${p.unit}.json`),old=JSON.parse(fs.readFileSync(file)),theme=themes[index%themes.length],indoor=['classroom','kitchen','bedroom','restaurant'].includes(theme[0]);
 const objects=old.objects.map((o,i)=>{const a=anchors[(i*7+index*3)%anchors.length],letter=o.kind==='letter',w=letter?4.8+(i%2)*.6:6.5+(i%4)*.65,h=letter?8.7+(o.case==='upper'?1:0):w*16/9;return {...o,x:a[0]+(index%3-1)*1.1,y:a[1],w,h,cover:indoor?i%2?'shelf':'basket':theme[0]==='ocean'?'rock':letter||i%3?'leaves':'rock',occlusion:letter||o.word==='peach'?0:.39+(i%3)*.045,protectedSilhouette:letter||o.word==='peach',concealment:letter?'scenery-framed glyph':'partial scenery overlap'};});
 // Deterministically place all eighteen targets once; every prompt uses this exact picture.
 let defs='',draw='';const used=new Set();for(const o of objects){
  const x=o.x*16,y=o.y*9,w=o.w*16,h=o.h*9;
  if(o.kind==='letter')draw+=`<g transform="translate(${x} ${y}) rotate(0)"><text text-anchor="middle" dominant-baseline="central" font-family="Verdana,Arial,sans-serif" font-variant="normal" font-weight="bold" font-size="${h}" fill="${indoor?['#b4814f','#bd9560','#c2a67d'][index%3]:['#aac38b','#c8b590','#b5c6a2'][index%3]}" stroke="#33574d" stroke-width="1.5">${esc(o.word)}</text></g>`;
  else{const noun=p.displayNames?.[o.word]||o.word,sprite=art[noun]||art[o.word];if(!sprite)throw Error('No 2D object '+o.word);const symbol=o.word.replace(/[^a-z0-9]/gi,'-');if(!used.has(symbol)){used.add(symbol);const bytes=fs.readFileSync(path.join(media,sprite.src.replace('/titi-game-media/','')));defs+=materialMask(symbol,noun)+`<image id="${symbol}" width="320" height="320" href="data:image/webp;base64,${bytes.toString('base64')}"/>`;}
   const natural={apple:'red',dog:'brown',monkey:'brown',peach:'red',cat:'brown',fox:'brown',jug:'blue',cape:'red',boat:'red',duck:'yellow'};const color=o.id.startsWith('first-')&&natural[noun]!==o.color?o.color:null;draw+=`<g transform="translate(${x-w/2} ${y-h/2}) scale(${w/320} ${h/320})">${color?paintedUse(symbol,color):`<use href="#${symbol}"/>`}</g>`;
  }
  // Restore the actual scenery in front of the lower portion of each target.
  // The covering leaves, shelf texture or rocks are part of this same picture,
  // rather than identical loose props pasted beside every target.
  const left=x-w*.55,right=x+w*.55,edge=y+h*(o.protectedSilhouette?.65:.5-o.occlusion),bottom=y+h*.58,id='hide-'+o.id;
  const crest=indoor?`M${left} ${edge}Q${x} ${edge+5} ${right} ${edge}`:`M${left} ${edge+8}Q${left+w*.18} ${edge-h*.16} ${left+w*.4} ${edge+5}Q${x+w*.1} ${edge-h*.12} ${right} ${edge+10}`;
  defs+=`<clipPath id="${id}"><path d="${crest}V${bottom}H${left}Z"/></clipPath>`;draw+=`<use href="#setting" clip-path="url(#${id})"/>`;
 }
 const colors=[...new Set(objects.filter(o=>o.id.startsWith('first-')).map(o=>o.color).filter(Boolean))];
 const filters=colors.map(c=>{const rgb={red:[.88,.2,.17],blue:[.2,.43,.84],green:[.25,.63,.32],yellow:[.91,.73,.18],purple:[.6,.3,.71],orange:[.95,.48,.18],black:[.13,.15,.17],brown:[.52,.33,.19],white:[.88,.88,.82],pink:[.94,.49,.64],grey:[.52,.56,.57]}[c];if(!rgb)throw Error('Unknown colour '+c);return `<filter id="paint-${c}" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${['R','G','B'].map((channel,i)=>`<feFunc${channel} type="table" tableValues=".015 ${rgb[i]*.24} ${rgb[i]*.64} ${rgb[i]} ${Math.min(.99,rgb[i]+(1-rgb[i])*.5)}"/>`).join('')}</feComponentTransfer></filter>`;}).join('');
 const bg=backgrounds.find(b=>b.id===theme[0]);if(!bg)throw Error('Missing illustrated setting '+theme[0]);const bgBytes=fs.readFileSync(path.join(media,bg.src.replace('/titi-game-media/','')));
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><image id="setting" width="1600" height="900" preserveAspectRatio="xMidYMid slice" href="data:image/webp;base64,${bgBytes.toString('base64')}"/>${defs}${filters}</defs><use href="#setting"/>${draw}</svg>`;
 const name=p.course+'-unit-'+p.unit+'.svg';fs.writeFileSync(path.join(out,name),svg);const background='/titi-game-media/assets/storybook-v1/scenes/'+name;
 const qObjects=objects.map(o=>({...o}));const pack={...old,version:5,imageWidth:1600,imageHeight:900,artStyle:'2D storybook',artRevision:2,scene:{id:theme[0],title:theme[1],background},objects:qObjects,questions:old.questions.map(q=>({...q,world:theme[0],background,objects:qObjects}))};
 delete pack.atlas;fs.writeFileSync(file,JSON.stringify(pack,null,2)+'\n');manifest.push({course:p.course,unit:p.unit,theme:theme[0],title:theme[1],background,objects:objects.length,bytes:Buffer.byteLength(svg)});
}
fs.writeFileSync(path.join(__dirname,'storybook-scenes.json'),JSON.stringify(manifest,null,2)+'\n');console.log('32 fixed Unit illustrations · 640 questions · ten themed settings · partial occlusion');
