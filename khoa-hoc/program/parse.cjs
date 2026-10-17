// Parse the centre's Program, not a guessed sequence of school-book pages.
const source=require('./source.json');
function family(rows=source.sheets['FAMILY AND FRIENDS 1,2']){
 const units=Array.from({length:15},(_,i)=>({unit:i+1,stages:[]})),tests=[];
 for(const [offset,row] of rows.entries()){
  const session=Number(row[0]),text=String(row[1]||'');if(!Number.isInteger(session)||session<1)continue;
  const m=text.match(/UNIT\s+(\d+)\s*[–-]?\s*LESSON\s+(\d+)\s*,\s*(\d+)/i);
  if(m){const u=units[Number(m[1])-1];if(!u)throw Error('Unknown Program unit '+m[1]);u.stages.push({stage:u.stages.length+1,session,bookLessons:[+m[2],+m[3]],sourceRow:offset+1});}
  const t=text.match(/WRITTEN TEST\s+(\d+)\b/);
  if(t){const number=+t[1],span=text.match(/U(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/),duration=text.match(/\((\d+)m\)/);if(!span)throw Error('Missing test unit range at Program row '+(offset+1));tests.push({number,units:span.slice(1).map(Number),session,sourceRow:offset+1,durationSeconds:duration?+duration[1]*60:null});}
 }
 for(const u of units)if(u.stages.length!==3||u.stages.flatMap(s=>s.bookLessons).join(',')!=='1,2,3,4,5,6')throw Error('Program needs reviewed mapping: Unit '+u.unit);
 if(tests.length!==5)throw Error('Program test schedule changed: review source tests before building.');
 return {source:source.url,fetchedAt:source.fetchedAt,starterSession:1,units,tests};
}
module.exports={family,source};
