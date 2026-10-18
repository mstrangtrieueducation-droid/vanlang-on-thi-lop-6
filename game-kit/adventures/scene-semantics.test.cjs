const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const Scenes=require('./test-scenes.js');
test('near/far subjects remain separate, countable and inside the illustration',()=>{
 for(const near of [true,false])for(const count of [1,2,3,4]){
  const html=Scenes.visual({kind:'distance',name:'book',near,count});
  assert.equal((html.match(/data-counted-object=/g)||[]).length,count);
  const bounds=[...html.matchAll(/data-counted-object="\d+"><svg x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/g)].map(m=>({x:+m[1],y:+m[2],w:+m[3]}));
  assert.equal(bounds.length,count);bounds.forEach((b,i)=>{assert(b.x+b.w<=600);if(i)assert(b.x>bounds[i-1].x+bounds[i-1].w);});
  assert(near?bounds[0].x<200:bounds[0].x>350);
 }
});
test('source distance questions retain grammatical number and reference distance',()=>{
 const d=JSON.parse(fs.readFileSync(require.resolve('../../khoa-hoc/data/family-friends-2.json')));
 for(const q of d.lessons.flatMap(l=>l.items||[]).filter(q=>q.visual?.kind==='distance')){
  const v=q.visual;assert.equal(q.answer,v.near?(v.count===1?'This':'These'):(v.count===1?'That':'Those'));
 }
});
test('family house renders children as children and grandparents as elders',()=>{
 const html=Scenes.render({id:'family-friends-1-test-u8-1',visual:{kind:'house',rooms:[{room:'kitchen',people:['Grandpa','Mia','Grandma']},{room:'bathroom',people:['Rob']}]}});
 const a=require('./pictures/family-cards/3d-v3/manifest.json');
 // The selected atlas rectangles must include both child and elder portraits.
 for(const key of ['grandpa','grandma','girl','boy']){
  const p=a.people[key],w=p.width/p.columns,h=p.height/p.rows;
  assert(html.includes(`viewBox="${p.cell%p.columns*w} ${Math.floor(p.cell/p.columns)*h} ${w} ${h}"`),key);
 }
});
