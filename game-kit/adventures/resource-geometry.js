/* Display geometry only: selected nodes and answer validation remain canonical. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ResourceGeometry=api;})(globalThis,()=>{
 function smoothPath(points,radius=22){if(!points.length)return '';const fmt=p=>p.map(x=>Math.round(x*100)/100).join(' ');let d='M'+fmt(points[0]);for(let i=1;i<points.length-1;i++){const a=points[i-1],b=points[i],c=points[i+1],ab=Math.hypot(b[0]-a[0],b[1]-a[1]),bc=Math.hypot(c[0]-b[0],c[1]-b[1]);if(!ab||!bc)continue;const r=Math.min(radius,ab/2,bc/2),before=[b[0]+(a[0]-b[0])*r/ab,b[1]+(a[1]-b[1])*r/ab],after=[b[0]+(c[0]-b[0])*r/bc,b[1]+(c[1]-b[1])*r/bc];d+='L'+fmt(before)+'Q'+fmt(b)+' '+fmt(after);}return points.length===1?d:d+'L'+fmt(points.at(-1));}
 function inside([x,y],polygon){let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [a,b]=polygon[i],[c,d]=polygon[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)yes=!yes;}return yes;}
 function enclosed(polygon,groups){if(polygon.length<5)return [];return groups.flatMap((points,i)=>points.length&&points.every(p=>inside(p,polygon))?[i]:[]);}
 return {smoothPath,inside,enclosed};
});
