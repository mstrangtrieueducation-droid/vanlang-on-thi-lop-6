import P from '../../game-kit/classroom-progress.js';
export const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
export const digest=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
const list=x=>Array.isArray(x)?x:[],label=x=>String(x||'').normalize('NFC').replace(/[\u0000-\u001f]/g,'').trim().slice(0,64);
export function endpoint(klass,hash){
 if(!/^[a-f0-9]{64}$/.test(hash))fail('Hồ sơ chưa hợp lệ.',401);
 const m=klass.match(/^(KIDS|TA|FIGHTER|IELTS)(\d+)$/);if(!m)fail('Lớp chưa hỗ trợ.',403);const n=+m[2];let host;
 if(m[1]==='KIDS')host=[7,8,11,14,15,17,18,19,20,33].includes(n)?'kids-dashboard-cluster-one-v1.s--rang--rieu':([21,22,23,25,26,27,28,30].includes(n)?'kids-dashboard-clusters-v1.mstrangtrieuenglishhub':([10,29,31,32,34,35,36,37,38,39].includes(n)?'kids-dashboard-cluster-three-v1.trieuthivantrangk45-kids':null));
 if(m[1]==='TA'&&[6,7].includes(n))host='ta-parent-snapshots.mstrangtrieuenglishhub';
 if(m[1]==='FIGHTER'&&n>=5&&n<=9)host='fighter-parent-snapshots.trangtrieu-chv-pt';
 if(m[1]==='IELTS'&&n>=45&&n<=52)host=`ielts${n}-private-pilot.trangnga2024`;
 if(!host)fail('Lớp chưa hỗ trợ.',403);return `https://${host}.workers.dev/data/${n}/${hash}.json`;
}
const dateOf=x=>x.lessonDate||x.assignedDate||x.dateLabel||x.date||'';
function sameLesson(a,b){if(a.lessonKey&&b.lessonKey)return a.lessonKey===b.lessonKey;if(a.id&&a.id===b.id)return true;const same=P.moment(dateOf(a))===P.moment(dateOf(b))&&P.moment(dateOf(a))>0;return same&&(!a.sessionNumber||!b.sessionNumber||Number(a.sessionNumber)===Number(b.sessionNumber));}
export function unpack(value){if(value?.wireSchema===1&&value.bundle&&value.bootstrap&&value.check)return {...value.bundle,actions:{bootstrap:value.bootstrap,check:value.check}};return value;}
export function extract(packet,klass,curriculum,now=Date.now()){
 packet=unpack(packet);
 if(!packet||packet.schema!==1||String(packet.className).replace(/\s/g,'')!==klass||!Number.isFinite(packet.capturedAt)||packet.capturedAt>now+30000||now-packet.capturedAt>86400000||(!klass.startsWith('KIDS')&&!/^[a-f0-9]{64}$/.test(packet.identity||'')))fail('Hồ sơ đang cập nhật. Con mở lại từ bảng theo dõi nhé.',503);
 const a=packet.actions||{};let alias,rows;
 if(klass.startsWith('KIDS')){
  const d=a.bootstrap?.dashboard,p=a.bootstrap?.profile;
  if(!d||!p||String(d.className).replace(/\s/g,'')!==klass||String(p.className).replace(/\s/g,'')!==klass||!Array.isArray(d.schedule)||!Array.isArray(p.assignments)||label(p.englishName)!==label(packet.alias))fail('Hồ sơ chưa khớp lớp.',403);
  alias=label(p.englishName);const joined=P.moment(p.joinDate,'00:00:00');
  rows=d.schedule.filter(x=>!x.cancelled&&x.status!=='cancelled'&&x.endTime&&P.moment(dateOf(x),x.endTime)>0&&P.moment(dateOf(x),x.endTime)<=now&&(!joined||P.moment(dateOf(x),'00:00:00')>=joined)).map(lesson=>({program:lesson.program,lesson,assignment:p.assignments.find(x=>x.kind==='lesson'&&sameLesson(x,lesson))||{}}));
 }else if(klass.startsWith('FIGHTER')){
  const b=a.bootstrap,d=b?.fullDashboard,s=b?.profile?.student;
  if(!s||s.name!==a.check?.studentName||String(d?.className).replace(/\s/g,'')!==klass||!Array.isArray(d.assignments)||b.fullDashboard.students?.length!==1||b.fullDashboard.students[0].name!==s.name)fail('Hồ sơ chưa được xác nhận.',403);
  alias=label(s.englishName);const joined=P.moment(s.joinDate,'00:00:00');rows=P.completedAssignments(d,now).filter(x=>!joined||P.moment(dateOf(x),'00:00:00')>=joined);
 }else{
  const p=a.portal,d=p?.dashboard,s=p?.student;
  if(p?.found!==true||!s||s.name!==a.check?.name||String(d?.className).replace(/\s/g,'')!==klass||!Array.isArray(d.assignments))fail('Hồ sơ chưa được xác nhận.',403);
  alias=label(s.englishName);const joined=P.moment(s.joinDate,'00:00:00');rows=P.completedAssignments(d,now).filter(x=>!joined||P.moment(dateOf(x),'00:00:00')>=joined);
 }
 const courses=curriculum.catalog.filter(c=>klass.startsWith('KIDS')?/^(phonics-|family-friends-|discover-)/.test(c.id):klass.startsWith('TA')?c.id==='van-lang':klass.startsWith('FIGHTER')?c.id==='fighter':c.id.startsWith('ielts'));
 return {alias:alias||'Nhà thám hiểm',identity:packet.identity,...P.currentBooks(courses,curriculum.map,rows)};
}
export async function verify(klass,hash,curriculum){const r=await fetch(endpoint(klass,hash),{redirect:'error',signal:AbortSignal.timeout(12000),headers:{Accept:'application/json'}});if(!r.ok)fail(r.status===404?'Hồ sơ không còn hiệu lực.':'Chưa xác nhận được hồ sơ. Con thử lại sau nhé.',r.status===404?401:503);const packet=unpack(await r.json()),result=extract(packet,klass,curriculum);if(klass.startsWith('KIDS'))result.identity=await digest('kids:'+hash+':'+result.alias.toUpperCase());return result;}
