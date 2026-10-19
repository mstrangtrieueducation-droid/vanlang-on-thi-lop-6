/* Named turns only where the script identifies a person; A/B for unnamed dialogue. */
const turns={
'family-friends-1:1':[['Speaker A',"1. What's this?"],['Speaker B',"It's a ruler."],['Speaker A',"2. What's this?"],['Speaker B',"It's a rubber."],['Speaker A',"3. What's this?"],['Speaker B',"It's a pen."],['Speaker A',"4. What's this?"],['Speaker B',"It's a bag."]],
'family-friends-1:7':[['Mum','One. This blue coat'],['Girl','Two. But I like'],['Mum','Three. What about'],['Girl','Four. But look'],['Mum','Five. Okay. Well'],['Girl','Yes. I like them too.']],
'family-friends-1:12':[['Speaker A','Are you hungry'],['Jesse','Yes, I am.'],['Speaker A',"Well, let's look"],['Jesse','Well, I like yogurt'],['Speaker A','So, you can have'],['Jesse',"Hmm. I don't like meat."]],
'family-friends-2:1':[['Sally','Hello, my name is Sally.']],
'family-friends-2:2':[['Kate',"My name's Kate."]],
'family-friends-2:5':[['Emily',"Hi. My name's Emily."]],
'family-friends-2:12':[['Letter writer','Dear Hannah,']],
'discover-1:6':[['Jim','My name is Jim.']],
'discover-1:12':[['Adult',"Let's see...what"],['Child 1','I want chips!'],['Child 2','I want chips, too.'],['Adult',"Yes, you're right."],['Emily','Soda?'],['Adult','No, Emily,'],['Emily',"OK. We don't need soda."],['Adult','OK, then.'],['Child','Let\'s have grapes.'],['Adult','Good, we have fruit.'],['Children','We want cookies!'],['Adult',"OK. Let's have cookies."]],
'discover-3:3':[['Narrator','Mina is a talented'],['Mina','My father came'],['Narrator','After high school,'],['Mina','We play many works'],['Narrator','Mina performs'],['Mina',"When I'm in Germany,"]],
'discover-3:6':[['Miguel',"I'm Miguel."],['Isis',"Hello, I'm Isis."],['Shannon','My name is Shannon.'],['Adem',"I'm Adem."]],
'discover-3:10':[['Dina','My name is Dina.'],['Paul','My name is Paul,'],['Talya','Hello. My name is Talya.']],
'discover-3:11':[['Narrator','In classical music'],['Anna',"Hello, I'm Anna."],['Justine',"Hello, I'm Justine."],['Ken',"Hello, I'm Ken."],['Roberto',"Hello, I'm Roberto."],['Thomas',"Hello, I'm Thomas."]],
'discover-3:17':[['Narrator','Sarah is a 19-year-old'],['Sarah','January 10:']],
'discover-3:18':[['Nick','Hey, Diego!'],['Diego','Hi, Nick!'],['Nick','A rocket!'],['Diego',"That's right."],['Nick','Why are you going'],['Diego','Because no one'],['Nick','Hey, Diego - can'],['Diego','Sure, if you help'],['Nick','OK. When do you'],['Diego','if the rocket is ready'],['Nick',"Sounds great."],['Diego','No problem.'],['Nick','OK, and I can'],['Diego','Good idea,'],['Nick',"Wow, I can't wait"],['Diego','Me, too.'],['Nick',"Oh, that's right."]],
'discover-4:3':[['Miss Elliot','Good morning, class.'],['Tanya','Thank you, Miss Elliot.'],['Miss Elliot',"That's true, Tanya."],['Lucas','Well, this town'],['Miss Elliot','Thank you, Lucas.'],['Dina','Yes, Miss Elliot.'],['Miss Elliot',"That's true. Thank you, everyone."]],
'discover-4:5':[['Jan',"Hello! I'm Jan,"]],
'discover-4:7':[['Stella','Hi! My name is Stella,'],['Juan',"Hi! I'm Juan,"],['Neema','Hi My name is Neema,'],['Marko',"Hi! I'm Marko,"]],
'discover-4:12':[['Narrator','And now for a student report'],['Eduardo','Eduardo:'],['Wendy','Wendy:'],['Kaya','Kaya:'],['Subin','Subin:']],
'discover-4:13':[['Tina',"Hi! My name is Tina."]],
'discover-4:14':[['Fran','Welcome to Westview'],['Jae-sung','Hi everyone,'],['Kareena',"Hello, I'm Kareena,"],['Omar',"Hi, I'm Omar,"]],
'discover-4:15':[['Dr. Demir','My name is Dr. Demir,']],
'discover-4:17':[['Jake',"Hi, I'm Jake."],['Mandy',"Hi, I'm Mandy."],['Carlos',"Hello, I'm Carlos."],['Fatima','Hello, everyone!']]
};
function paragraphs(course,unit,text){const spec=turns[course+':'+unit];if(!spec)return null;const positions=spec.map(([speaker,start],i)=>{const from=i?text.indexOf(spec[i-1][1])+spec[i-1][1].length:0,at=text.indexOf(start,from);if(at<0)throw Error(`Unmatched speaker turn ${course}/${unit}: ${start}`);return {speaker,at};});const out=[];if(positions[0].at)out.push({speaker:'Narrator',text:text.slice(0,positions[0].at).trim()});for(let i=0;i<positions.length;i++){const p=positions[i];out.push({speaker:p.speaker,text:text.slice(p.at,positions[i+1]?.at??text.length).trim().replace(new RegExp('^'+p.speaker+':\\s*'),'')});}return out;}
module.exports={paragraphs,turns};
