/* Speaker boundaries checked against Class Book speech-bubble tails.
 * Each panel starts with its speaker; subsequent [speaker, prefix] entries
 * mark a change of speaker inside the existing transcript. No alternation guess.
 * Printed pages: 8,14,20,30,36,42,52,58,64,74,80,86,96,102,108.
 */
const boundaries={1:[
 [['Billy',['Rosy','A train?']],['Rosy',['Billy',"It's a pen."]],['Rosy',['Billy',"It's a rubber."]],['Rosy',['Billy','OK, here']]],
 [['Tim',['Rosy',"But where's"]],['Tim',['Rosy',"No, it isn't."]],['Tim',['Rosy',"No, it isn't."]],['Rosy']],
 [['Rosy',['Billy','These are']],['Rosy',['Billy','This is'],['Rosy',"That's right."]],['Rosy',['Billy','OK, Rosy.']],['Billy',['Rosy','Oh no!']]],
 [['Rosy',['Grandpa','Yes, he is.']],['Rosy',['Billy',"No, she isn't."]],['Grandma',['Rosy','Look!'],['Billy','Oh no!']],['Billy',['Rosy',"No, he isn't."]]],
 [['Tim',['Uncle','Good try']],['Uncle',['Tim',"No, it isn't."]],['Uncle',['Tim','Oh no!']],['Tim']],
 [['Rosy'],['Rosy',['Tim',"And this is Grandma's"]],['Rosy',['Tim',"I don't know."]],['Mum',['Tim and Rosy','Ah, thank you!']]],
 [['Mum',['Dad','Are these'],['Mum','Yes, they are.']],['Dad',['Mum','Yes, it is.']],['Mum'],['Dad']],
 [['Rosy',['Mum','Well done']],['Rosy',['Mum',"No, she isn't."]],['Rosy',['Mum',"No, they aren't."]],['Family',['Grandma','Well done'],['Rosy','Thank you!']]],
 [['Teacher',['Rosy','Oh no!']],['Tim',['Rosy','Thank you']],['Classmate',['Rosy','Thanks.']],['Rosy']],
 [['Rosy',['Tim',"She's got curly hair."]],['Rosy',['Tim','My new friend']],['Tim',['Rosy',"And he's with"]],['Tim',['Alice and Adam',"We're brother"],['Rosy',"We're cousins."]]],
 [['Billy',['Rosy','Look at the elephants'],['Billy','Oh no!']],['Dad',['Billy','Ahh!']],['Mum',['Billy','Look over there!']],['Billy',['Rosy',"Yes. They're funny"]]],
 [['Mum',['Billy',"No, I don't."]],['Mum',['Billy','Yes, I do!'],['Mum','OK.']],['Billy',['Mum','Good boy.'],['Billy','Mmm.']],['Billy']],
 [['Grandma',['Rosy','Sorry.']],['Rosy',['Grandma','Good girl']],['Grandma',['Rosy',"No, it isn't"]],['Billy',['Rosy and Grandma','Oh, Billy!']]],
 [['Billy',['Uncle','Hello.'],['Billy','Look! He can run.']],['Billy',['Tim','Great!'],['Billy','Yes, he can.']],['Billy',['Rosy','You are clever']],['Rosy',['Billy','Silly Rosy!']]],
 [['Tim',['Rosy',"That's a good idea."]],['Billy',['Grandma','Great.'],['Billy','Catch, Grandma!'],['Grandma','Wait, Billy!']],['Tim',['Billy','Sorry.'],['Dad',"It's OK."]],['Billy']]
],2:[
 [['Teacher'],['Teacher',['Tim','Animal pegs!']],['Teacher',['Tim','Wow!']],['Teacher',['Children','Yes, we do.']],['Teacher',['Rosy','No …']],['Rosy']],
 [['Rosy',['Mum',"They're twins"]],['Rosy',['Babies’ mum',"No, they aren't."]],['Tim',['Babies’ mum',"No, they aren't cold."]],['Rosy',['Tim','Can the babies'],['Babies’ mum','Yes.']],['Tim',['Babies’ mum','Yes, they like']],['Tim']],
 [['Tim'],['Tim',['Grandpa','Yes, of course.']],['Tim',['Grandpa','Be brave.']],['Tim',['Grandpa',"Yes, I'm here."]],['Tim',['Grandpa','Tim!']],['Grandpa',['Tim','Wow!']]],
 [['Mum',['Rosy','Yes, I have.']],['Mum',['Rosy',"He's behind"]],['Mum',['Rosy',"No, he hasn't."]],['Rosy',['Billy','Thank you.']],['Mum',['Billy','Well …']],['Billy',['Rosy','Naughty birds!'],['Mum',"Don't worry."]]],
 [['Tim',['Rosy',"We've got English."]],['Tim',['Rosy',"We've got PE"]],['Narrator',['Grandma',"Don't forget"],['Tim','Oh yes.']],['PE teacher'],['Tim'],['PE teacher',['Tim','Thank you']]],
 [['Rosy',['Alice','Good idea!'],['Rosy','Can you play']],['Alice'],['Rosy'],['Alice'],['Rosy'],['Mum',['Rosy','Thanks, Mum!']]],
 [['Mum',['Rosy','He likes trains']],['Tim',['Mum','No. Billy']],['Tim',['Mum','OK.']],['Mum',['Rosy','Good idea']],['Rosy'],['Dad',['Billy','Thank you']]],
 [['Alice',['Rosy',"Sorry, we can't."]],['Alice',['Rosy','Yes.']],['Rosy'],['Dad',['Rosy',"It's seven"]],['Alice',['Rosy',"Sorry, we can't."]],['Mum',['Rosy','Thanks, Mum!']]],
 [['Tim’s friend'],['Tim',['Tim’s friend','He works']],['Tim’s friend',['Tim',"No, she doesn't."]],['Tim’s friend',['Tim','Yes, she does.']],['Tim’s friend',['Tim','Yes, I know.']],['Tim’s mum',['Tim','Oh, thank you.'],['Tim’s friend','Fantastic!']]],
 [['Grandpa',['Grandma',"What's the weather"],['Tim',"It's sunny."]],['Grandma',['Grandpa','Children,']],['Grandpa',['Tim','My hat!'],['Grandma','Catch it!']],['Tim',['Grandma',"And we haven't"]],['Grandma',['Grandpa',"Where's the key?"]],['Rosy',['Tim','Agh!'],['Mum',"Oh no, you're all wet!"]]],
 [['Rosy',['Grandma',"It's four"]],['Tim'],['Grandma',['Aunt',"I'm wearing"]],['Grandma',['Aunt',"He's wearing"]],['Grandma',['Aunt',"She's wearing"]],['Grandma',['Rosy','Hello and welcome!']]],
 [['Dad',['Rosy','Can we watch'],['Mum','OK.']],['Dad',['Mum',"And I'm dancing"]],['Tim',['Mum',"She's eating"]],['Rosy'],['Mum',['Milly',"Oh, I'm so little."]],['Rosy']],
 [['Grandpa'],['Billy',['Rosy',"Yes. It's the mummy"]],['Billy',['Rosy',"That's right."]],['Billy',['Tim',"That's right, Billy."]],['Rosy',['Billy','Is it a daddy']],['Grandpa']],
 [['Rosy'],['Rosy',['Tim',"The babies weren't sad."]],['Rosy',['Tim',"Mum wasn't wet."]],['Tim'],['Rosy'],['Billy',['Rosy',"Yes, you're very good now!"]]],
 [['Grandma',['Rosy','Oh yes.']],['Rosy',['Mum','Hurry up!']],['Rosy',['Tim’s mum',"Where's the prize-giving?"]],['Rosy',['Billy','Look! Lots']],['Rosy',['Head teacher','The prize goes']],['Head teacher',['Rosy','We were the winners!']]]
]};
function extract(book,unit,panels){
 const rows=boundaries[book]?.[unit-1];if(!rows)return null;
 if(rows.length!==panels.length)throw Error(`Speaker panel count ${book}/${unit}`);
 return panels.flatMap((text,panel)=>{
  const [first,...cuts]=rows[panel],out=[];let cursor=0,speaker=first;
  for(const [next,prefix] of cuts){const end=text.indexOf(prefix,cursor);if(end<cursor)throw Error(`Missing speaker boundary ${book}/${unit}/${panel}: ${prefix}`);out.push({speaker,text:text.slice(cursor,end).trim(),panel:panel+1});cursor=end;speaker=next;}
  out.push({speaker,text:text.slice(cursor).trim(),panel:panel+1});return out;
 });
}
module.exports={boundaries,extract};
