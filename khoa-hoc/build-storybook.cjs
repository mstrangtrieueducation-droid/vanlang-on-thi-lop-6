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
 const objects=old.objects.map((o,i)=>{const a=anchors[(i*7+index*3)%anchors.length],letter=o.kind==='letter',w=letter?5.5+(i%2):8.5+(i%3),h=letter?10+(o.case==='upper'?2:0):w*16/9;return {...o,x:a[0]+(index%3-1)*1.1,y:a[1],w,h,cover:indoor?i%2?'shelf':'basket':theme[0]==='ocean'?'rock':letter||i%3?'leaves':'rock',occlusion:letter||o.word==='peach'?0:.35};});
 // Deterministically place all eighteen targets once; every prompt uses this exact picture.
 let defs='',draw='';const used=new Set();for(const o of objects){
  const x=o.x*16,y=o.y*9,w=o.w*16,h=o.h*9;
  if(o.kind==='letter')draw+=`<g transform="translate(${x} ${y}) rotate(0)"><text text-anchor="middle" dominant-baseline="central" font-family="Verdana,Arial,sans-serif" font-variant="normal" font-weight="bold" font-size="${h}" fill="${['#edb85e','#e79b83','#fff2b5'][index%3]}" stroke="#345b52" stroke-width="2.5">${esc(o.word)}</text></g>`;
  else{const noun=p.displayNames?.[o.word]||o.word,sprite=art[noun]||art[o.word];if(!sprite)throw Error('No 2D object '+o.word);const symbol=o.word.replace(/[^a-z0-9]/gi,'-');if(!used.has(symbol)){used.add(symbol);const bytes=fs.readFileSync(path.join(media,sprite.src.replace('/titi-game-media/','')));defs+=materialMask(symbol,noun)+(noun==='peach'?`<g id="${symbol}"><defs><radialGradient id="peach-skin" cx="32%" cy="30%" r="75%"><stop stop-color="#ffe3a6"/><stop offset=".55" stop-color="#ffb077"/><stop offset="1" stop-color="#ec6f81"/></radialGradient></defs><path d="M158 102C114 62 48 84 45 151C41 217 101 270 161 293C217 268 279 213 275 150C271 84 207 62 158 102Z" fill="url(#peach-skin)" stroke="#b75856" stroke-width="6"/><path d="M160 102C183 157 176 225 161 282" fill="none" stroke="#d97972" stroke-width="7" stroke-linecap="round"/><path d="M157 93Q146 59 162 40" fill="none" stroke="#765031" stroke-width="11" stroke-linecap="round"/><path d="M164 67Q215 8 287 38Q238 79 164 67Z" fill="#5c9d4e" stroke="#3f733d" stroke-width="5"/><path d="M174 66L246 49" stroke="#b2ca74" stroke-width="4"/></g>`:`<image id="${symbol}" width="320" height="320" href="data:image/webp;base64,${bytes.toString('base64')}"/>`);}
   const color=o.id.startsWith('first-')?o.color:null;draw+=`<g transform="translate(${x-w/2} ${y-h/2}) scale(${w/320} ${h/320})">${color?paintedUse(symbol,color):`<use href="#${symbol}"/>`}</g>`;
  }
  // Restore the actual scenery in front of the lower portion of each target.
  // The covering leaves, shelf texture or rocks are part of this same picture,
  // rather than identical loose props pasted beside every target.
  const left=x-w*.55,right=x+w*.55,edge=y+h*(o.kind==='letter'||o.word==='peach'?.65:.14),bottom=y+h*.58,id='hide-'+o.id;
  const crest=indoor?`M${left} ${edge}Q${x} ${edge+5} ${right} ${edge}`:`M${left} ${edge+8}Q${left+w*.18} ${edge-h*.16} ${left+w*.4} ${edge+5}Q${x+w*.1} ${edge-h*.12} ${right} ${edge+10}`;
  defs+=`<clipPath id="${id}"><path d="${crest}V${bottom}H${left}Z"/></clipPath>`;draw+=`<use href="#setting" clip-path="url(#${id})"/>`;
 }
 const colors=[...new Set(objects.filter(o=>o.id.startsWith('first-')).map(o=>o.color).filter(Boolean))];
 const filters=colors.map(c=>{const rgb={red:[.95,.17,.17],blue:[.12,.38,.95],green:[.18,.72,.27],yellow:[1,.82,.08],purple:[.72,.22,.85],orange:[1,.43,.12],black:[.19,.2,.22],brown:[.6,.32,.14],white:[1,1,.96],pink:[1,.48,.68],grey:[.65,.67,.7]}[c];if(!rgb)throw Error('Unknown colour '+c);return `<filter id="paint-${c}" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${['R','G','B'].map((channel,i)=>`<feFunc${channel} type="linear" slope="${rgb[i]*.95}" intercept="${rgb[i]*.18}"/>`).join('')}</feComponentTransfer></filter>`;}).join('');
 const bg=backgrounds.find(b=>b.id===theme[0]);if(!bg)throw Error('Missing illustrated setting '+theme[0]);const bgBytes=fs.readFileSync(path.join(media,bg.src.replace('/titi-game-media/','')));
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><image id="setting" width="1600" height="900" preserveAspectRatio="xMidYMid slice" href="data:image/webp;base64,${bgBytes.toString('base64')}"/>${defs}${filters}</defs><use href="#setting"/>${draw}</svg>`;
 const name=p.course+'-unit-'+p.unit+'.svg';fs.writeFileSync(path.join(out,name),svg);const background='/titi-game-media/assets/storybook-v1/scenes/'+name;
 const qObjects=objects.map(o=>({...o}));const pack={...old,version:5,imageWidth:1600,imageHeight:900,artStyle:'2D storybook',scene:{id:theme[0],title:theme[1],background},objects:qObjects,questions:old.questions.map(q=>({...q,world:theme[0],background,objects:qObjects}))};
 delete pack.atlas;fs.writeFileSync(file,JSON.stringify(pack,null,2)+'\n');manifest.push({course:p.course,unit:p.unit,theme:theme[0],title:theme[1],background,objects:objects.length,bytes:Buffer.byteLength(svg)});
}
fs.writeFileSync(path.join(__dirname,'storybook-scenes.json'),JSON.stringify(manifest,null,2)+'\n');console.log('32 fixed Unit illustrations · 640 questions · ten themed settings · partial occlusion');
