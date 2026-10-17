import curriculum from './curriculum.json';import {LeaderboardService} from './service.mjs';
const origin='https://mstrangtrieueducation-droid.github.io';
export default {async fetch(request,env){
 const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST,GET,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
 const reply=(body,status=200)=>Response.json(body,{status,headers});
 if(request.headers.get('Origin')&&request.headers.get('Origin')!==origin)return reply({error:'Origin not allowed'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 const path=new URL(request.url).pathname;if(path==='/health'&&request.method==='GET')return reply({ok:true,service:'titi-games',courses:curriculum.catalog.length,version:1});
 if(request.method!=='POST')return reply({error:'Method not allowed'},405);
 try{if(Number(request.headers.get('Content-Length'))>32768)return reply({error:'Request too large'},413);const raw=await request.text();if(raw.length>32768)return reply({error:'Request too large'},413);let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid JSON'},400);}if(!body||Array.isArray(body)||typeof body!=='object')return reply({error:'Invalid request'},400);
 return reply(await new LeaderboardService(env.DB,curriculum).handle(path,body,(request.headers.get('Authorization')||'').replace(/^Bearer /,''),request.headers.get('CF-Connecting-IP')||'unknown'));
 }catch(e){return reply({error:e.status?e.message:'Chưa kết nối được kho sao. Con thử lại sau nhé.'},e.status||503);}
 },async scheduled(event,env){const now=Date.now();await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE expires<?').bind(now),env.DB.prepare('DELETE FROM runs WHERE expires<?').bind(now-86400000),env.DB.prepare('DELETE FROM rate_limits WHERE window<?').bind(Math.floor(now/60000)-5)]);}};
