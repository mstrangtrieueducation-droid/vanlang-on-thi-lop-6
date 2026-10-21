/* Reviewed quotations for the introductory readings; later Units carry evidence in data. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ReadingEvidence=api;})(globalThis,()=>{
 const reviewed={
 'What is the main idea?':['People in families help each other. They love each other, too. Not all families are the same.'],
 'Are all the families in the reading the same?':['Not all families are the same. There are many kinds of families.'],
 'How often do the friends play together?':['They play together every day.'],
 'Where do the three friends go together?':['Seb, Mandy, and Kim are good friends. They go to school together.'],
 'Whose family is described as big?':["Seb's family is big."],
 'Who lives with Kim?':["This is Kim. She's six years old. Her family is small. She lives with her mother."],
 'How many brothers does Mandy have?':["This is Mandy. She's eight years old. She has one brother."],
 'Who lives with Mandy?':['They live with their grandmother and grandfather.'],
 'How many brothers does Seb have?':['He lives with his mother, father, three brothers, and two sisters.'],
 'How old is Seb?':["Meet Seb. He's seven years old."],
 'What is the main purpose of this reading?':["All animals can breathe and move, but they're different in many amazing ways. Here we look at how they are the same and how they are different. This helps us put them into groups."],
 'Which comparison is supported by the reading?':['All birds have two legs, two wings, and feathers, and most birds can fly.',"Hair or fur covers most land mammals' bodies, and this helps keep them warm."],
 'Which mammal in the reading lives in water?':['Whales are water mammals, and cats, rabbits, and lions are land mammals.'],
 'What do baby mammals drink?':['Their babies drink milk from their mothers.'],
 'Where can amphibians live?':['Amphibians are very interesting because they can live on land and in water.'],
 'What kind of skin do amphibians have?':['Amphibians need to have wet skin, so they live in wet places.'],
 'What keeps birds warm?':['The wings and feathers help them fly, and the feathers help keep them warm.'],
 'What helps fish move through water?':["They don't have legs, but their fins and tails help them swim."],
 'What protects a fish’s body?':['Scales all over their bodies help keep them safe from dangerous fish that want to bite them.'],
 'What do fish use to breathe in water?':['Fish have gills to help them breathe in water.'],
 'What connects all the sections?':["It's important to have fun if you want a happy and healthy life. Here are some ways people enjoy life all over the world."],
 'Where does the text describe colorful costumes for folk dancing?':['In Turkey, folk dancers wear colorful costumes and dance at weddings and festivals.'],
 'Who might meet at a family reunion?':['Aunts, uncles, cousins, and grandparents join the family to eat and have fun.'],
 'What happens before the meal at the Egyptian wedding described?':['In Egypt, dancers and musicians gather around the married couple and dance for up to one hour. Then, people eat a special dinner.'],
 'Which birthday is important in the places described in Mexico and Central and South America?':['When a girl turns 15 years old in Mexico, her family and friends often celebrate with food and dancing. This also happens in many parts of Central and South America.'],
 'Where can volleyball be played, according to the text?':['You can play volleyball inside or on the beach.'],
 'How often is the World Cup held?':['Every four years, people watch their favorite players at the World Cup Soccer Championships.'],
 'Which celebration is called the festival of lights?':['In India, families enjoy Diwali, the festival of lights.'],
 'When is Children’s Day in Korea and Japan in the reading?':["In Korea and Japan, Children's Day is on May 5th."],
 'What do children receive in red envelopes at Chinese New Year?':['Children often get money in red paper envelopes.'],
 'How is the imagined journey organized?':['Bella lived in a white wooden house, on a street in the city of Nome.','What Bella observed was the vast universe her spacecraft had taken her far.','Suddenly Bella was back in her room, in her white wooden house in Nome.'],
 'Where does Bella return at the end?':['Suddenly Bella was back in her room, in her white wooden house in Nome.'],
 'Which is larger: the solar system or the Milky Way?':["Bella's spacecraft flew higher and higher, now the sun was a speck of bright light. In the Milky Way galaxy shaped like a disk"],
 'Which galaxy contains our solar system?':['In the Milky Way galaxy shaped like a disk'],
 'How many planets are in the solar system described?':['She noticed the Earth was not alone, with seven more planets it dwelled.'],
 'What makes the Moon look bright?':['a shining moon that circled the Earth with the light of the sun on its face.'],
 'Where does Bella start her imagined journey?':['Bella lived in a white wooden house, on a street in the city of Nome.'],
 'Why does Charles write the poem?':['Charles decided that the best way to show Bella was not through numbers and charts, but through a poem.'],
 'Where does Charles live?':['Charles Kunayak was a high school science teacher who lived with his family in a quiet neighborhood in Nome, Alaska.'],
 'What subject does Charles Kunayak teach?':['Charles Kunayak was a high school science teacher who lived with his family in a quiet neighborhood in Nome, Alaska.']
 };
 const norm=s=>String(s||'').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g,' ').trim();
 function quotes(q){const raw=q.evidence||reviewed[q.prompt]||[],list=Array.isArray(raw)?raw:[raw],source=norm(q.storyText);return list.filter(s=>source.includes(norm(s)));}
 const original=new WeakMap(),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function highlight(host,rows){if(!host)return;for(const p of host.querySelectorAll('.shared-passage p')){if(!original.has(p))original.set(p,p.textContent);const text=original.get(p),flat=norm(text),spans=[];for(const {q,number}of rows)for(const quote of quotes(q)){const value=norm(quote);let start=flat.indexOf(value);if(start>=0)spans.push({start,end:start+value.length,number});}if(!spans.length){p.textContent=text;continue;}const points=[...new Set([0,flat.length,...spans.flatMap(s=>[s.start,s.end])])].sort((a,b)=>a-b);p.innerHTML=points.slice(0,-1).map((a,i)=>{const b=points[i+1],ids=[...new Set(spans.filter(s=>s.start<=a&&s.end>=b).map(s=>s.number))],part=esc(flat.slice(a,b));return ids.length?'<mark class="reading-evidence">'+part+'<sup class="evidence-question">'+ids.map(n=>'[Q'+n+']').join(' ')+'</sup></mark>':part;}).join('');}}
 return {quotes,highlight,norm};
});
