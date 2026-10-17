import {digest,fail,verify} from './authority.mjs';
export function periods(at){const d=new Date(at+25200000),month=d.toISOString().slice(0,7);d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return ['all','m:'+month,'w:'+d.toISOString().slice(0,10)];}
const uuid=()=>crypto.randomUUID(),validId=x=>typeof x==='string'&&/^[\w-]{1,100}$/.test(x),boards=new Map();
export class LeaderboardService{
 constructor(db,curriculum,{now=Date.now,authority=verify}={}){this.db=db;this.data=curriculum;this.now=now;this.authority=authority;}
 stmt(sql,...args){return this.db.prepare(sql).bind(...args);}
 async rows(sql,...args){return (await this.stmt(sql,...args).all()).results;}
 one(sql,...args){return this.stmt(sql,...args).first();}
 async limit(key,max){const window=Math.floor(this.now()/60000);const r=await this.stmt('INSERT INTO rate_limits VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET window=excluded.window,count=CASE WHEN rate_limits.window=excluded.window THEN rate_limits.count+1 ELSE 1 END RETURNING count',key,window).first();if(r.count>max)fail('Titi đang nhận nhiều tín hiệu. Con đợi một phút nhé.',429);}
 async login(body,ip){
  await this.limit('login:'+await digest(ip),12);
  if(!/^[A-Za-z0-9_-]{22}$/.test(body.student||''))fail('Con mở game từ hồ sơ riêng nhé.',401);
  const klass=String(body.className||'').replace(/\s/g,'').toUpperCase(),hash=await digest(body.student),a=await this.authority(klass,hash,this.data),student=await digest(klass+':'+a.identity),token=uuid()+uuid(),sessionHash=await digest(token),now=this.now();
  await this.db.batch([this.stmt('INSERT INTO students VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET alias=excluded.alias,class_name=excluded.class_name',student,a.alias,klass,now),this.stmt('INSERT INTO sessions VALUES(?,?,?,?,?,?,?,?)',sessionHash,student,klass,hash,a.identity,JSON.stringify(a),now,now+3600000)]);
  return {token,expires:now+3600000,alias:a.alias,className:klass};
 }
 async session(token,fresh=false){
  if(typeof token!=='string'||token.length!==72)fail('Con mở lại game từ hồ sơ để kết nối nhé.',401);
  const s=await this.one('SELECT * FROM sessions WHERE hash=? AND expires>?',await digest(token),this.now());if(!s)fail('Phiên kết nối đã hết. Con mở lại từ hồ sơ nhé.',401);
  if(fresh||this.now()-s.verified>300000){const a=await this.authority(s.class_name,s.source_hash,this.data);if(a.identity!==s.source_identity)fail('Hồ sơ đã thay đổi. Con mở lại bảng theo dõi nhé.',401);s.grants=JSON.stringify(a);s.verified=this.now();await this.stmt('UPDATE sessions SET grants=?,verified=? WHERE hash=?',s.grants,s.verified,s.hash).run();}
  s.access=JSON.parse(s.grants);return s;
 }
 lesson(s,course,id){const l=this.data.lessons[course]?.[id];if(!l||!s.access.allowed?.[course]?.includes(id))fail('Bài này chưa thuộc phần lớp mình được mở.',403);return l;}
 async start(s,b){
  if(!validId(b.clientId))fail('Lượt chơi chưa hợp lệ.');this.lesson(s,b.course,b.lesson);
  const old=await this.one('SELECT * FROM runs WHERE student=? AND client_id=?',s.student,b.clientId);if(old){if(old.course!==b.course||old.lesson!==b.lesson)fail('Mã lượt chơi đã được sử dụng.',409);return {id:old.id,started:old.started,expires:old.expires};}
  await this.limit('run:'+s.student,12);
  const c=this.data.catalog.find(c=>c.id===b.course),target=c.lessons.find(x=>x.id===b.lesson),prior=c.lessons.slice(0,c.lessons.indexOf(target)).filter(x=>x.track===target.track&&s.access.allowed[b.course].includes(x.id));
  const progress=await this.rows('SELECT lesson,stars FROM progress WHERE student=? AND course=?',s.student,b.course);
  // Existing offline progress may unlock practice, but cannot authorize ranked skips.
  const ranked=prior.every(l=>progress.some(p=>p.lesson===l.id&&p.stars>=1));
  const now=this.now(),run={id:uuid(),started:now,expires:now+7200000};await this.stmt('INSERT INTO runs VALUES(?,?,?,?,?,?,?,NULL)',run.id,s.student,b.course,b.lesson,b.clientId,now,run.expires).run();
  return {...run,ranked};
 }
 async submit(s,b){
  const r=await this.one('SELECT * FROM runs WHERE id=? AND student=?',b.run,s.student);if(!r)fail('Không tìm thấy lượt chơi này.',404);if(r.result)return JSON.parse(r.result);if(this.now()>r.expires)fail('Lượt chơi đã quá thời gian đồng bộ.',410);
  const l=this.lesson(s,r.course,r.lesson);if(!b.answers||Array.isArray(b.answers)||typeof b.answers!=='object'||Object.keys(b.answers).some(id=>!l.items.some(q=>q.id===id)))fail('Câu trả lời không khớp bài.');
  const entries=Object.entries(b.answers);let correct=0,assisted=false;const done=[];
  for(const [id,a] of entries){if(!a||typeof a.first!=='string'||a.first.length>500||typeof a.last!=='string'||a.last.length>500)fail('Đáp án chưa hợp lệ.');const q=l.items.find(x=>x.id===id);if(a.first===q.answer)correct++;if(a.last===q.answer)done.push(id);assisted||=a.assisted===true;}
  const complete=entries.length===l.items.length&&entries.every(([,a])=>a.last.trim().length>0),accuracy=correct/l.items.length,stars=complete?(accuracy>=.9?3:accuracy>=.65?2:1):0;
  const old=await this.one('SELECT done,stars FROM progress WHERE student=? AND course=? AND lesson=?',s.student,r.course,r.lesson),merged=[...new Set([...(old?JSON.parse(old.done):[]),...done])];
  const c=this.data.catalog.find(x=>x.id===r.course),target=c.lessons.find(x=>x.id===r.lesson),prior=c.lessons.slice(0,c.lessons.indexOf(target)).filter(x=>x.track===target.track&&s.access.allowed[r.course].includes(x.id));
  const passed=await this.rows('SELECT lesson FROM progress WHERE student=? AND course=? AND stars>=1',s.student,r.course),ranked=complete&&!assisted&&prior.every(x=>passed.some(p=>p.lesson===x.id));
  const now=this.now(),elapsed=Math.max(0,now-r.started-3000),result={points:correct*10,total:l.items.length,correct,stars,elapsedMs:elapsed,ranked,done:merged,course:r.course,lesson:r.lesson,receivedAt:now};
  // The transaction's conditional INSERTs prevent concurrent/replayed submissions
  // from changing the already accepted first result or improving its timing.
  const batch=[this.stmt('INSERT INTO progress(student,course,lesson,done,stars,updated) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM runs WHERE id=? AND result IS NULL) ON CONFLICT(student,course,lesson) DO UPDATE SET done=(SELECT json_group_array(value) FROM (SELECT value FROM json_each(progress.done) UNION SELECT value FROM json_each(excluded.done))),stars=MAX(progress.stars,excluded.stars),updated=excluded.updated',s.student,r.course,r.lesson,JSON.stringify(merged),stars,now,r.id)];
  if(ranked)for(const period of periods(now))batch.push(this.stmt('INSERT INTO records SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM runs WHERE id=? AND result IS NULL) ON CONFLICT(student,course,lesson,period) DO UPDATE SET points=excluded.points,total=excluded.total,stars=excluded.stars,elapsed=excluded.elapsed,finished=excluded.finished WHERE excluded.points>records.points OR (excluded.points=records.points AND excluded.elapsed<records.elapsed)',s.student,r.course,r.lesson,period,result.points,l.items.length,stars,elapsed,now,r.id));
  const study=Number.isFinite(b.studyMs)&&b.studyMs>=0?Math.min(Math.round(b.studyMs),elapsed):elapsed;
  batch.push(this.stmt('INSERT OR IGNORE INTO journey_runs SELECT ?,?,?,?,?,?,?,?,?,?,?,0 WHERE EXISTS(SELECT 1 FROM runs WHERE id=? AND result IS NULL)',s.student,r.client_id,r.course,r.lesson,result.points,stars,l.items.length,correct,study,now,complete?1:0,r.id));
  batch.push(this.stmt('UPDATE runs SET result=? WHERE id=? AND result IS NULL',JSON.stringify(result),r.id));await this.db.batch(batch);boards.clear();return JSON.parse((await this.one('SELECT result FROM runs WHERE id=?',r.id)).result);
 }
 async progress(s){const rows=await this.rows('SELECT course,lesson,done,stars,updated FROM progress WHERE student=?',s.student);return {rows:rows.map(x=>({...x,done:JSON.parse(x.done)}))};}
 async journey(s){const rows=await this.rows('SELECT run,course,lesson,points,stars,total,correct,study_ms studyMs,finished at,complete,legacy FROM journey_runs WHERE student=? ORDER BY finished DESC',s.student);return {rows,updatedAt:this.now(),note:'Lượt làm bài đã ghi nhận; dữ liệu cũ chỉ khôi phục được những kết quả còn lưu. Thời gian luyện tập không dùng để thay đổi xếp hạng.'};}
 async board(s,b){
  const period=periods(this.now())[b.period==='month'?1:b.period==='all'?0:2],classOnly=b.scope!=='center',course=classOnly?String(b.course||''):'';if(classOnly&&!this.data.lessons[course])fail('Con chọn một khóa học nhé.');
  const key=[period,classOnly?s.class_name:'center',course].join(':'),cached=boards.get(key);let rows;
  if(cached&&this.now()-cached.at<120000)rows=cached.rows;else{
   rows=await this.rows(`SELECT s.id,s.alias,s.class_name className,SUM(r.points) points,SUM(r.stars) stars,SUM(r.elapsed) elapsed,COUNT(*) games FROM records r JOIN students s ON s.id=r.student WHERE r.period=? ${classOnly?'AND s.class_name=? AND r.course=?':''} GROUP BY s.id ORDER BY ${classOnly?'points':'stars'} DESC,elapsed ASC,s.id ASC LIMIT 2000`,period,...(classOnly?[s.class_name,course]:[]));if(boards.size>40)boards.clear();boards.set(key,{at:this.now(),rows});
  }
  const projected=rows.map((r,i)=>({rank:i+1,alias:r.alias,className:r.className,points:r.points,stars:r.stars,elapsed:r.elapsed,games:r.games,mine:r.id===s.student}));
  return {period,scope:classOnly?'class':'center',rows:projected.slice(0,50),mine:projected.find(x=>x.mine)||null,note:classOnly?'Mỗi bài lấy lượt tốt nhất trong kỳ; bằng điểm xét thời gian.':'Vinh danh sao tích lũy từ các bài hoàn thành; đây là bảng hoạt động, không so trình độ giữa các khóa.',updatedAt:this.now()};
 }
 async handle(path,b,token,ip){if(path==='/session')return this.login(b,ip);const s=await this.session(token,path==='/finish');await this.limit('api:'+s.student,40);if(path==='/start')return this.start(s,b);if(path==='/finish')return this.submit(s,b);if(path==='/progress')return this.progress(s);if(path==='/journey')return this.journey(s);if(path==='/leaderboard')return this.board(s,b);fail('Không tìm thấy chức năng.',404);}
}
