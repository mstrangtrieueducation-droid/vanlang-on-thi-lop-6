const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),core=require('./galaxy-core.js');
const scope={window:{}};vm.createContext(scope);vm.runInContext(fs.readFileSync(__dirname+'/planets.js','utf8'),scope);vm.runInContext(fs.readFileSync(__dirname+'/course-world.js','utf8'),scope);const world=scope.window.CourseWorld,courses=JSON.parse(fs.readFileSync(__dirname+'/catalog.json'));
test('Every current course retains the same world from course selection into each lesson',()=>{for(const c of courses){const meta=world.metadata(c);assert.ok(meta.era,c.id);for(let i=0;i<c.lessons.length;i++){const art=world.art(c,i+1);assert.ok(art.includes('assets/'+c.id+'.webp'));assert.ok(!/Băng tinh thể|Trạm cơ khí|Rừng phát quang|Năng lượng mặt trời/.test(art));assert.equal(world.label(c,i+1),(c.id==='van-lang'?'Thử thách ':'Nhiệm vụ ')+(i+1));}}});
test('Winding path supports empty, single and arbitrary lesson counts without invalid coordinates',()=>{for(const n of [0,1,2,15,88,137]){const p=world.trail(core.positions(n));assert.ok(!/undefined|NaN/.test(p));assert.equal((p.match(/C /g)||[]).length,Math.max(0,n-1));if(n)assert.ok(p.startsWith('M '));}});
test('Roadmap scenery follows course eras while milestone numbers scale to every lesson',()=>{const expected=['forest','village','village','village','village','village','steam','city','city','city','future','future'];courses.forEach((c,i)=>{assert.equal(world.kind(c),expected[i],c.id);assert.ok(world.scenery(c).includes('road-scenery'));for(let n=1;n<=c.lessons.length;n++)assert.ok(world.milestone(c,n).includes('<span>'+n+'</span>'));});assert.equal(world.kind({id:'future-added-course'}),'village');});

test('Vertical snake grows for arbitrary lesson counts, with lesson one below every later lesson',()=>{
 for(const n of [0,1,2,15,88,137])for(const viewport of [220,650]){
  const {height,points}=world.roadmap(n,viewport);assert.equal(points.length,n);assert.ok(height>=viewport);
  for(let i=0;i<n;i++){assert.ok(points[i].x>=270&&points[i].x<=730);assert.ok(points[i].y>=100&&points[i].y<=height-100);if(i)assert.equal(points[i-1].y-points[i].y,156);}
  assert.ok(!/NaN|undefined/.test(world.trail(points)));
 }
});
test('All twelve course biomes have local layered scenery and distinct period details',()=>{
 assert.equal(new Set(courses.map(c=>world.biome(c))).size,12);
 const required={'phonics-1':'scene-flame','phonics-2':'scene-grazer','phonics-3':'scene-windmill','phonics-4':'scene-person-arm','family-friends-2':'scene-train','discover-3':'scene-hologram',fighter:'scene-portal'};
 for(const c of courses){const scene=world.scenery(c);assert.ok(scene.includes('world-environment'));assert.ok(scene.includes('world-firefly'));assert.ok(scene.includes('world-moon'));assert.ok(!/https?:|<script|onload=/.test(scene));if(required[c.id])assert.ok(scene.includes(required[c.id]),c.id);}
});
