/* Performance casting, not claims about the age of a synthetic voice actor.
 * Speaker identities come from the annotated classroom transcripts. */
const profiles = {
  titi: {voice:'en-US-AnaNeural', rate:'+3%', pitch:'+0Hz'},
  girl: {voice:'en-GB-MaisieNeural', rate:'+2%', pitch:'+5Hz'},
  boy: {voice:'en-US-EricNeural', rate:'+4%', pitch:'+18Hz'},
  woman: {voice:'en-US-JennyNeural', rate:'+0%', pitch:'+0Hz'},
  man: {voice:'en-US-GuyNeural', rate:'+0%', pitch:'+0Hz'},
  grandmother: {voice:'en-US-AriaNeural', rate:'-6%', pitch:'-12Hz'},
  grandfather: {voice:'en-US-RogerNeural', rate:'-7%', pitch:'-16Hz'},
  narrator: {voice:'en-US-AriaNeural', rate:'+0%', pitch:'+0Hz'},
  character: {voice:'en-US-RogerNeural', rate:'+3%', pitch:'+5Hz'}
};
const boys = new Set(['Billy','Tim','Max','Luke','Elliot','Arnold','Hans','Henry','Son','Student A','Hector','Marco','Javier','Pepe','Fernando','Luis','Theo','Kieron Williamson','Tim’s friend']);
const girls = new Set(['Rosy','Milly','Alice','Sally','Emma','Julia','Sara','Tuti','Dian','Olga','Maddie','Akiko','Ashanti','Hyo','Maria','Molly','Lisa','Clara','Marisol','Marcy','Camila','Elsa']);
function cast(speaker){
 const s=String(speaker||'Narrator'),name=s.replace(/\s*\([^)]*\)/g,'').trim();
 let role='narrator';
 if(s==='Titi')role='titi';
 else if(/Grandpa|Grandfather|Old man/.test(s)&&!s.includes('woman'))role='grandfather';
 else if(/Grandma|Grandmother|Old woman/.test(s))role='grandmother';
 else if(/^(?:Mum|Mom|Aunt|Woman|Teacher|Head teacher)$|(?:’s|'s) mum|^Mrs\.|Babies’ mum|Meghan Michaels|Farmer Lena|Farmer Sabine|Hilda Hanson/.test(s))role='woman';
 else if(/^(?:Dad|Uncle|Man|Husband|PE teacher|Farmer Flores|Farmer Ray|Farmer François|Antonio Rossi|Edgar Mueller|Zayan Kahn|Mayor Wilson)$|^Mr\.|^Dr\./.test(s))role='man';
 else if(boys.has(name))role='boy';
 else if(girls.has(name)||/^Sati /.test(s))role='girl';
 else if(/Children|Child narrator|Tim and Rosy|Alice and Adam|Friends|Classmate|Student B|Lisa and Marco/.test(s))role='girl';
 else if(/Mouse|Goat|Cranes|Seal|Chicken|Cow|Horse|Fox|Gingerbread/.test(s))role='character';
 return {role,...profiles[role]};
}
module.exports={profiles,cast};
