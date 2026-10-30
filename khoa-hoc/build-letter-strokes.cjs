const fs=require('fs'),path=require('path');
const guides=require('./program/letter-strokes.cjs');
const data=Object.fromEntries([... 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(letter=>[letter,guides.letters(letter)]));
fs.writeFileSync(path.resolve(__dirname,'../game-kit/adventures/latin-stroke-guides.js'),'window.LatinStrokeGuides='+JSON.stringify(data)+';\n');
console.log('Built Latin tracing guides:',Object.keys(data).length);
