const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p)));
test('Phonics 4 stops at Unit 6 in source, delivery, map and active server bank',()=>{
 const units=require('./phonics-units.cjs')[4];assert.equal(units.length,6);
 const full=read('khoa-hoc/data/phonics-4.json'),index=read('khoa-hoc/data/phonics-4.index.json'),catalog=read('vu-tru/catalog.json').find(c=>c.id==='phonics-4'),bank=read('game-service/leaderboard/curriculum.json');
 const ids=full.lessons.map(l=>l.id);assert.equal(ids.length,24);assert.equal(full.lessons.reduce((s,l)=>s+l.items.length,0),810);
 for(const c of [index,catalog,bank.catalog.find(c=>c.id==='phonics-4')])assert.deepEqual(c.lessons.map(l=>l.id),ids);
 assert.deepEqual(Object.keys(bank.lessons['phonics-4']),ids);
 for(const map of [read('vu-tru/teaching-map.json'),bank.map])assert.deepEqual(Object.keys(map['phonics-4']),ids);
 for(const dir of ['data','hidden','panorama','hunt-worlds'])assert.ok(fs.readdirSync(path.join(__dirname,dir,'phonics-4')).every(n=>!/^unit-[78](?:-|\.)/.test(n)));
 assert.ok(Object.entries(full.legacyAliases).every(([k,v])=>!/^unit-[78]-/.test(k)&&!/^unit-[78]-/.test(v)));
 assert.ok(read('game-kit/adventures/panoramas/profiles.json').every(p=>p.course!=='phonics-4'||p.unit<=6));
});
