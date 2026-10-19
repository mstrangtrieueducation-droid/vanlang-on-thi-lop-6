/* Decode alpha components, rather than clipping overflowing atlas cells. All assets local. */
(()=>{'use strict';
 const cache=new Map(),image=url=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=window.GameMedia?.url(url)||url;});
 async function background(url){if(!cache.has(url)){cache.set(url,image(url));if(cache.size>3)cache.delete(cache.keys().next().value);}return cache.get(url);}
 async function decode(url,cells){const img=await image(url),c=document.createElement('canvas');c.width=img.width;c.height=img.height;const cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);const d=cx.getImageData(0,0,c.width,c.height),w=c.width,h=c.height,labels=new Int32Array(w*h),stack=new Int32Array(w*h),parts=[];let id=0;
  for(let p=0;p<w*h;p++){if(labels[p]||d.data[p*4+3]<48)continue;id++;let top=0,count=0,minX=w,maxX=0,minY=h,maxY=0,sumX=0,sumY=0;stack[top++]=p;labels[p]=id;
   while(top){const q=stack[--top],x=q%w,y=Math.floor(q/w);count++;sumX+=x;sumY+=y;minX=Math.min(x,minX);maxX=Math.max(x,maxX);minY=Math.min(y,minY);maxY=Math.max(y,maxY);for(const v of [x?q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(v>=0&&!labels[v]&&d.data[v*4+3]>=48){labels[v]=id;stack[top++]=v;}}
   if(count>=12)parts.push({id,count,minX,maxX,minY,maxY,x:sumX/count,y:sumY/count});
  }
  const nominal=p=>Math.min(3,Math.floor(p.x/(w/4)))+4*Math.min(3,Math.floor(p.y/(h/4))),primary=new Map();for(const p of parts){const cell=nominal(p);if(cells.includes(cell)&&(!primary.has(cell)||primary.get(cell).count<p.count))primary.set(cell,p);}
  const assigned=new Map();for(const p of parts){let best,dist=Infinity;for(const [cell,a]of primary){const dx=Math.max(a.minX-p.x,0,p.x-a.maxX),dy=Math.max(a.minY-p.y,0,p.y-a.maxY),score=dx*dx+dy*dy;if(score<dist){best=cell;dist=score;}}assigned.set(p.id,best);}
  const sprites={};for(const cell of cells){const ps=parts.filter(p=>assigned.get(p.id)===cell);if(!ps.length)throw Error('Missing sprite '+cell);const x=Math.min(...ps.map(p=>p.minX)),y=Math.min(...ps.map(p=>p.minY)),sw=Math.max(...ps.map(p=>p.maxX))-x+1,sh=Math.max(...ps.map(p=>p.maxY))-y+1,out=document.createElement('canvas');out.width=sw;out.height=sh;const ox=out.getContext('2d'),pixels=ox.createImageData(sw,sh);for(let yy=0;yy<sh;yy++)for(let xx=0;xx<sw;xx++){const from=(y+yy)*w+x+xx,to=yy*sw+xx;if(assigned.get(labels[from])===cell)pixels.data.set(d.data.subarray(from*4,from*4+4),to*4);}ox.putImageData(pixels,0,0);sprites[cell]=out;}
  return sprites;
 }
 async function draw(canvas,q,sprites){const bg=await background(q.background),w=1672,h=941;canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.drawImage(bg,0,0,w,h);for(const o of [...q.objects].sort((a,b)=>a.y-b.y)){const s=sprites[o.cell],maxW=o.w*w/100,maxH=o.h*h/100,scale=Math.min(maxW/s.width,maxH/s.height),sw=s.width*scale,sh=s.height*scale,x=o.x*w/100-sw/2,base=(o.y+o.h/2)*h/100;c.fillStyle='rgba(38,40,20,.2)';c.beginPath();c.ellipse(o.x*w/100,base-1,sw*.43,Math.min(8,sh*.055),0,0,Math.PI*2);c.fill();c.drawImage(s,x,base-sh,sw,sh);}return true;}
 window.HuntWorldRenderer={decode,draw,warm:background};
})();
