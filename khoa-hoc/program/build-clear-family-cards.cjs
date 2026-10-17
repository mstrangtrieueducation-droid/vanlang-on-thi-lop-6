const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),folder=path.join(root,'game-kit/adventures/pictures/family-cards'),out=path.join(folder,'clear-v2');fs.mkdirSync(out,{recursive:true});
const icons=require('../../game-kit/adventures/pictures/test-vectors/manifest.json'),scenes=require('../../game-kit/adventures/test-scenes.js');
const C=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const P=(d,fill,stroke='none',width=5)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const R=(x,y,w,h,fill,r=14)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const defs=`<defs><radialGradient id="skin" cx=".35" cy=".25"><stop stop-color="#ffe2bd"/><stop offset="1" stop-color="#e7a777"/></radialGradient><linearGradient id="shirt" x2=".8" y2="1"><stop stop-color="#76d9d0"/><stop offset="1" stop-color="#248b9d"/></linearGradient><linearGradient id="hair" x2=".8" y2="1"><stop stop-color="#855a3d"/><stop offset="1" stop-color="#3d2b32"/></linearGradient><linearGradient id="coat" x2="1" y2="1"><stop stop-color="#bfa9ff"/><stop offset="1" stop-color="#6459bb"/></linearGradient><radialGradient id="bg"><stop stop-color="#fffdf7"/><stop offset="1" stop-color="#e9f5f5"/></radialGradient></defs>`;
function icon(name){const p=icons[name];if(!p)throw Error('Missing '+name);if(!p.src)return scenes.custom(p.custom);const raw=fs.readFileSync(path.resolve(root,'khoa-hoc',p.src),'utf8');const box=raw.match(/viewBox="([^"]+)"/)?.[1]||'0 0 72 72';return `<svg x="0" y="0" width="100" height="100" viewBox="${box}">${raw.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>[\s\S]*$/,'')}</svg>`;}
function at(name,x,y,w){return `<g transform="translate(${x} ${y}) scale(${w/100})">${icon(name)}</g>`;}
function feeling(mood){
 const cold=mood==='cold',sad=mood==='sad',happy=mood==='happy',hungry=mood==='hungry',hot=mood==='hot';
 let b=`<ellipse cx="244" cy="466" rx="112" ry="14" fill="#53757c22"/>`;
 b+=R(180,376,49,88,'#405b86',19)+R(264,376,49,88,'#405b86',19)+R(169,446,65,26,'#f4a956')+R(260,446,65,26,'#f4a956');
 b+=P('M177 266Q245 242 312 266L327 398Q247 420 163 398Z',cold?'url(#coat)':'url(#shirt)');
 if(happy)b+=P('M175 283Q125 252 114 214M312 283Q360 252 370 214','none','url(#skin)',26);
 else if(hungry||cold)b+=P('M170 283Q126 324 191 350L258 340M313 283Q353 325 296 366L224 356','none','url(#skin)',25);
 else b+=P('M176 283Q150 328 150 370M313 283Q342 327 338 368','none','url(#skin)',25);
 b+=C(150,175,22,'#efba90')+C(335,175,22,'#efba90')+`<ellipse cx="243" cy="168" rx="91" ry="101" fill="url(#skin)"/>`;
 b+=P('M153 164Q124 71 197 63Q248 22 296 69Q358 75 337 162L312 126Q273 134 263 101Q224 145 183 128L170 165Z','url(#hair)');
 if(happy)b+=P('M191 171Q204 153 217 171M269 171Q282 153 295 171','none','#42333b',7);
 else b+=`<ellipse cx="205" cy="175" rx="10" ry="14" fill="#40303a"/><ellipse cx="280" cy="175" rx="10" ry="14" fill="#40303a"/>`+C(208,171,3.5,'white')+C(283,171,3.5,'white');
 if(sad||hungry)b+=P('M190 148L218 140M268 140L296 148','none','#684735',6);
 b+=`<ellipse cx="184" cy="203" rx="16" ry="9" fill="#ef98a0" opacity=".65"/><ellipse cx="302" cy="203" rx="16" ry="9" fill="#ef98a0" opacity=".65"/>`;
 b+=happy?P('M215 211Q244 219 274 211Q270 254 245 254Q220 252 215 211Z','#7d3d4b')+P('M222 214L267 214L261 226L228 226Z','#fff9ee') : sad?P('M221 232Q244 214 266 232','none','#9b595a',6):hungry?`<ellipse cx="245" cy="225" rx="13" ry="10" fill="#90535b"/>`:P('M227 222Q245 236 261 222','none','#9b595a',6);
 if(happy)b+=P('M70 151L77 130L84 151L105 158L84 165L77 186L70 165L49 158Z','#ffc75b')+C(398,173,9,'#ffca67');
 if(sad)b+=P('M199 190Q176 220 197 223Q214 220 199 190Z','#73c9ec')+P('M286 190Q306 219 287 222Q270 219 286 190Z','#73c9ec');
 if(cold){b+=P('M169 257Q245 287 317 257L314 288Q244 317 169 288Z','#ffc970')+R(277,281,28,74,'#ffbb56',7);b+=P('M71 107V169M45 123L97 153M45 153L97 123M386 304V366M360 320L412 350M360 350L412 320','none','#65b9e6',7)+P('M124 293L113 305L124 317M357 271L368 283L357 295','none','#84c5dd',6);}
 if(hot)b+=C(395,94,33,'#ffbf4a')+P('M395 43V28M395 145V160M344 94H329M446 94H461M358 57L346 45M432 131L444 143','none','#ffc04c',8)+P('M316 165Q296 192 316 194Q334 192 316 165Z','#65c5e9')+P('M87 326Q111 310 87 293Q64 276 87 258M111 385Q135 369 111 352','none','#f49e6d',7);
 if(hungry){b+=C(383,171,70,'#fff')+C(330,231,15,'#fff')+C(308,248,8,'#fff');b+=at('sandwich',334,120,100)+P('M200 383Q225 368 245 383M250 321Q268 306 287 320','none','#fff5b0',5);}
 if(mood==='thirsty'){b+=R(350,265,83,104,'#b0e9f3',14)+P('M357 322Q391 310 426 322V357H357Z','#61c5e4')+P('M388 337L409 237L438 230','none','#f1a867',9)+P('M377 200Q349 236 377 240Q402 237 377 200Z','#74cdec');}
 return b;
}
const manifest=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
let count=0;for(const [key,p]of Object.entries(manifest)){
 if(!/^(1|2):[12]:/.test(key))continue;
 const name=key.split(':').slice(2).join(':');let body;
 if(key.startsWith('2:2:'))body=feeling(name);
 else if(name==='classroom')body=R(50,45,412,365,'#fff2c9',20)+R(84,72,343,152,'#b99165',8)+R(94,82,323,132,'#39796b',5)+at('desk',55,226,190)+at('desk',265,226,190)+at('English',190,100,90);
 else if(name==='computer')body=R(66,70,380,258,'#415778',22)+R(82,86,348,220,'#87d7eb',10)+P('M91 287L91 96H365Z','#b9f2f7')+R(227,327,58,60,'#637d9a',3)+R(171,379,170,22,'#415778',8)+P('M91 416H421L447 459H65Z','#7895af')+[0,1,2].map(j=>Array.from({length:10},(_,i)=>R(97+i*31,424+j*10,23,6,'#e5f0fa',2)).join('')).join('');
 else body=`<ellipse cx="256" cy="422" rx="150" ry="19" fill="#6f8c9622"/>`+at(name,76,65,360);
 const file=key.replace(/:/g,'-').replace(/\s+/g,'-').toLowerCase()+'.svg';
 fs.writeFileSync(path.join(out,file),`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>Vocabulary illustration</title>${defs}${R(8,8,496,496,'url(#bg)',38)}${body}</svg>`);
 manifest[key]={...p,src:'../game-kit/adventures/pictures/family-cards/clear-v2/'+file,artwork:'Colour vector; Ms Trang Trieu Education / OpenMoji (CC BY-SA 4.0)'};count++;
}
fs.writeFileSync(path.join(folder,'manifest.json'),JSON.stringify(manifest));
fs.writeFileSync(path.join(out,'CREDITS.md'),'# Illustration credits\n\nFeelings and classroom scenes: original SVG artwork for Ms Trang Trieu Education. Object illustrations incorporate OpenMoji (https://openmoji.org), CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/), with layout, colour background and scale changes. These adaptations are shared under CC BY-SA 4.0. No textbook scans are used in this set.\n');
console.log('Replaced '+count+' source crops with self-contained colour SVG cards.');
