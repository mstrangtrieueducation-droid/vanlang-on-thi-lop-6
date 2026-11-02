const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function load(lesson){const store=new Map(),storage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},saved={};
 const fetched=[{id:'course',lessons:[lesson]}],window={addEventListener(){},dispatchEvent(){},StudentContext:{browserStorage:storage,current:()=>true,active:{student:'s',className:'c',entered:true},suffix:()=>':s'},GalaxyCore:{load:()=>saved.g||{lessons:{}},save:(_,__,___,g)=>{saved.g=g;}}};
 const fetch=async url=>{const u=String(url);if(u.includes('catalog.json'))return {ok:true,json:async()=>fetched};return {ok:true,status:200,json:async()=>({token:'t',expires:Date.now()+1e6,rows:[{course:'course',lesson:lesson.id,done:['a','b-old','b-variation31','c-variation31','gone'],stars:2,updated:1}]})};};
 vm.runInNewContext(fs.readFileSync(__dirname+'/cloud.js','utf8'),{window,document:{addEventListener(){},currentScript:{src:'https://example.test/game-kit/cloud.js'},createElement:()=>({}),head:{append(){}}},localStorage:storage,fetch,URL,AbortSignal,Event:class{constructor(t){this.type=t;}},StudentContext:window.StudentContext,GalaxyCore:window.GalaxyCore,JSON,Map,Set,Math,Date,Object,Array,Number,String,Promise,Error});
 return {api:window.TitiCloud,saved,store};}
test('Cloud restore counts renamed questions once and keeps their old answers',async()=>{
 const lesson={id:'one',count:3,storageKey:'k',progressIds:[{id:'a'},{id:'b-variation31',sourceId:'b-old'},{id:'c-variation31',sourceId:'c-old'}]},{api,saved,store}=load(lesson);
 await api.restore({student:'s',className:'c',entered:true});
 assert.equal(saved.g.lessons.one.done,3,'b-old and b-variation31 are one question');assert.equal(saved.g.lessons.one.stars,2);
 const local=JSON.parse(store.get('k:s'));assert.deepEqual([...local.done].sort(),['a','b-old','b-variation31','c-variation31']);assert(!local.done.includes('gone'));
});
