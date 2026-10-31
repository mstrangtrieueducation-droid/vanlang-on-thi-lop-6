/* Authored task families, constrained to the actual Unit grammar objective.
 * Vocabulary, speaker, sentence purpose and response format vary together. */
const units=require('./family-units.cjs'),notes=require('./grammar-summary-vi.cjs');
const banks={1:[
`{name} points to one {thing}. What ___ this?|is|are|am|do
{name} opens the school bag. It is ___ {thing}.|a|an|are|am
{name} cannot name the object. ___ is this? It is a {thing}.|What|Who|Where|How old
{friend} asks about one {thing}. ___ a {thing}.|It's|They're|I'm|You're`,
`{name} checks the toy label. It has {name}'s name. Is this {name}'s {thing}? Yes, it ___.|is|isn't|are|am
This {thing} belongs to {friend}, not {name}. Is it {name}'s? No, it ___.|isn't|is|aren't|am
{name} says, "This {thing} belongs to me. It is ___ {thing}."|my|your|he|she
{friend} asks {name}, "___ this your {thing}?"|Is|Are|Am|Do`,
`{name} points to two hands. These ___ my hands.|are|is|am|do
{friend} points to one nose. This ___ my nose.|is|are|am|do
{name} washes both hands before lunch. These are my ___.|hands|hand|nose|face
{friend} touches one ear. This is my ___.|ear|ears|hands|legs`,
`{name}'s dad flies a plane. ___ is a pilot.|He|She|It|They
{friend}'s mum works as a doctor. ___ is a doctor.|She|He|It|They
{name} sees one child in the classroom. She is ___ pupil.|a|an|are|am
{friend}'s sister teaches a class. ___ she a teacher?|Is|Are|Am|Do`,
`{name} puts a ball inside a box. It is ___ the box.|in|on|under|behind
{friend} puts a toy on the top of a table. It is ___ the table.|on|in|under|behind
{name}'s teddy is below a chair. It is ___ the chair.|under|in|on|between
{friend} is looking for the ball. ___ is the ball?|Where|Who|What|How old`,
`The kite belongs to {name}. It is ___ kite.|{name}'s|{name}|{name}s|{name}es
The bag belongs to {friend}. It is ___ bag.|{friend}'s|{friend}|{friend}s|{friend}es
The hat belongs to Dad. {name} brings ___ hat to him.|Dad's|Dad|Dads|Dades
The book belongs to Mum. {friend} puts ___ book on the shelf.|Mum's|Mum|Mums|Mumes`,
`{name}'s brother has a new hat. This is ___ hat.|his|her|he|she
{friend}'s sister has a red coat. This is ___ coat.|her|his|he|she
{name} checks two shoes. Are these his shoes? Yes, they ___.|are|is|am|isn't
These socks belong to Dad, not Mum. {friend} asks, "Are these her socks?" No, they ___.|aren't|isn't|are|am`,
`{name} is looking for one person. Where ___ Grandma?|is|are|am|do
{friend} is looking for two people. Where ___ Mum and Dad?|are|is|am|does
{name} looks in every room. ___ is Grandpa? He is in the kitchen.|Where|What|Who|How old
{friend} can see both cousins outside. They ___ in the garden.|are|is|am|does`,
`{name} opens the lunch box. I have got ___ apple.|an|a|is|are
{friend} opens the lunch bag. I have got ___ sandwich.|a|an|is|are
{name}'s lunch box is still at home. I ___ got my lunch box.|haven't|hasn't|isn't|aren't
{friend} checks the picnic bag. I have ___ two sandwiches.|got|get|has|is`,
`{name}'s sister ___ got curly hair.|has|have|is|are
{friend}'s brother has short hair. He ___ got long hair.|hasn't|haven't|isn't|aren't
{name} draws a triangle. It has got three ___.|sides|side|eye|hair
{friend} draws a girl with two blue ___. She uses them to see.|eyes|eye|hair|hairs`,
`{name} says, "Monkeys are my favourite animals. I ___ monkeys."|like|likes|liking|am
{friend} says, "Snakes frighten me. I ___ like snakes."|don't|doesn't|isn't|aren't
{name} watches two elephants. ___ very big.|They're|He's|She's|It's
{friend} sees one tall giraffe. ___ tall.|It's|They're|We're|You're`,
`{name} asks about a friend's favourite food. What ___ you like?|do|does|is|are
{friend} asks, "___ you like milk?"|Do|Does|Is|Are
{name} enjoys carrots. Do you like carrots? Yes, I ___.|do|does|don't|am
{friend} dislikes fish. Do you like fish? No, I ___.|don't|doesn't|do|am`,
`{name} counts one bed in the bedroom. There ___ one bed.|is|are|am|do
{friend} counts three books on the shelf. There ___ three books.|are|is|am|does
{name} puts two ___ on the bed.|pillows|pillow|a pillow|an pillow
{friend} sees a blue rug beside the bed. There is ___ blue rug.|a|an|are|am`,
`{name}'s sister can ___ in the swimming pool.|swim|swims|swimming|swam
{friend}'s brother can ___ a tree during the activity.|climb|climbs|climbing|climbed
{name} watches a fish in a tank. It ___ fly.|can't|can|is|does
{friend}'s sister sings well. ___ she sing?|Can|Does|Is|Has`,
`{name} suggests a beach game. Let's ___ ball!|play|plays|playing|played
{friend} has a bucket and a spade. Let's ___ sandcastles!|make|makes|making|made
{name} reminds a friend before the trip. Don't ___ your hat.|forget|forgets|forgetting|forgot
{friend} agrees with the picnic plan. That is ___ good idea.|a|an|are|am`
],2:[
`{name} points to one table nearby. This ___ my table.|is|are|am|do
{friend} holds two books. These ___ my books.|are|is|am|does
{name} points to several tables far away. ___ are our tables.|Those|This|That|It
{friend} points to one pencil nearby. ___ is my pencil.|This|Those|These|They`,
`{name} and {friend} smile after the game. They ___ happy.|are|is|am|be
{name}'s brother needs a drink. He ___ thirsty.|is|are|am|be
{friend} says, "I need some food. I ___ hungry."|am|is|are|be
{name} and {friend} still have lots of energy. They ___ tired.|aren't|isn't|am not|doesn't`,
`{name}'s sister can ___ a bike.|ride|rides|riding|rode
{friend}'s brother is learning to skate. He ___ skate yet.|can't|can|is|does
{name} puts a chair between the bed ___ the table.|and|or|but|to
{friend}'s sister plays tennis well. ___ she play tennis?|Can|Does|Is|Has`,
`{name} asks about one boy's lunch. ___ he got a pizza?|Has|Have|Is|Are
{friend} asks two friends about lunch. ___ you got a salad?|Have|Has|Is|Are
{name}'s sister has a sandwich. She ___ got a sandwich.|has|have|is|are
{friend}'s brother has no fries. He ___ got any fries.|hasn't|haven't|isn't|aren't`,
`{name} and {friend} check their timetable. What ___ we got on Monday?|have|has|is|are
{name} says, "These books belong to us. They are ___ books."|our|their|we|they
{friend} points to another class's toys. They are ___ toys.|their|our|they|we
{name} checks the PE lesson. ___ have we got PE? On Friday.|When|Who|Where|How old`,
`{name} says, "I ___ my homework after school."|do|does|doing|am
{friend} says, "I don't ___ TV on Monday."|watch|watches|watching|watched
{name} says, "We ___ swimming on Saturday."|go|goes|going|am
{friend} says, "I listen ___ music after school."|to|on|in|at`,
`{name} asks about one boy's favourite food. What ___ he like?|does|do|is|are
{friend}'s brother ___ chocolate.|likes|like|liking|is
{name}'s sister doesn't ___ nuts.|like|likes|liking|liked
{friend}'s brother dislikes pastries. He ___ like pastries.|doesn't|don't|isn't|aren't`,
`{name}'s brother gets up ___ seven o'clock.|at|in|on|to
{friend}'s sister ___ to school at eight.|goes|go|going|is
{name} says, "I ___ breakfast in the morning."|have|has|having|am
{friend}'s brother ___ dinner at six.|has|have|having|is`,
`{name} asks about one woman's job. Where does she ___?|work|works|working|worked
{friend}'s dad ___ in a hospital.|works|work|working|is
{name}'s mum works in a bank. ___ she work in a bank?|Does|Do|Is|Are
{friend}'s dad works at a school, not an airport. He ___ work at an airport.|doesn't|don't|does|is`,
`{name} checks the sky before going out. What is the weather ___?|like|likes|liking|liked
{friend} sees water falling from the clouds. It ___ raining.|is|are|am|be
{name} feels cold. Put ___ your coat.|on|in|under|between
{friend} sees snow outside. Let's ___ a snowman.|make|makes|making|made`,
`{name} asks about clothes now. What are you ___?|wearing|wear|wears|wore
{friend}'s brother ___ wearing jeans.|is|are|am|be
{name} says, "I ___ wearing a scarf."|am|is|are|be
{friend} reads 2:30 on the clock. It is ___ past two.|half|quarter|o'clock|to`,
`{name} and {friend} ___ dancing at the party now.|are|is|am|be
{name}'s sister is ___ photos now.|taking|take|takes|took
{friend}'s brother is ___ a cake now.|making|make|makes|made
{name} asks about one girl's activity. What ___ she doing?|is|are|am|does`,
`{name} compares two animals. This horse is bigger ___ that donkey.|than|that|then|and
{friend} compares a car with a bike. The car is ___.|faster|fast|fastest|more fast
{name} compares a sheep with a cow. The sheep is ___.|smaller|small|smallest|more small
{friend}'s brother is 150 cm tall; his friend is 140 cm. He is ___ than his friend.|taller|tall|tallest|more tall`,
`{name} says, "Yesterday I ___ tired after the game."|was|were|am|are
{friend} says, "Yesterday we ___ outside after lunch."|were|was|is|am
{name}'s sister stayed dry yesterday. She ___ wet.|wasn't|weren't|isn't|aren't
{friend} and the other children behaved well yesterday. They ___ naughty.|weren't|wasn't|isn't|doesn't`,
`{name} remembers one woman at the park yesterday. There ___ one woman.|was|were|are|am
{friend} remembers four ducks yesterday. There ___ four ducks.|were|was|is|am
{name} saw no men at the park. There weren't ___ men.|any|some|a|an
{friend} saw several children at the park. There were some ___.|children|child|childs|a child`
]};
const names=['Mia','Ben','Anna','Sam','Lucy','Tom','Lily','Jack','Emma','Dan','Amy','Leo','Eva','Max','Nina','Alex','Zoe','Adam','Ruby','Luke','Ivy','Ryan','Alice','Noah'];
function model(book,unit,n){const lines=banks[book][unit-1].split('\n'),index=n%lines.length,cycle=Math.floor(n/lines.length),u=units[book][unit-1];const words=u.words.filter(w=>/^[a-z ]+$/.test(w));const thing=words[(cycle+index)%words.length]||'book';const vars={name:names[cycle%names.length],friend:names[(cycle+5)%names.length],thing};const line=lines[index].replace(/\{(\w+)\}/g,(_,key)=>vars[key]);const [scene,answer,...wrong]=line.split('|');return {scene,answer,wrong,note:notes[book][unit-1][2],focus:notes[book][unit-1][0]};}
function question(original,book,unit,n){const m=model(book,unit,n),kind=Math.floor(n/4)%4,full=m.scene.replace('___',m.answer),q={...original,id:original.id.replace(/-variation31$/,'')+'-variation31',variation31:true,scene:m.scene,prompt:'Choose the missing words.',answer:m.answer,options:[m.answer,...m.wrong],partType:'readGap',partTitle:'Read & Choose',partInstruction:'Read and choose.',spokenScene:m.scene.replace('___','…'),spokenPrompt:'',why:'Câu đúng: '+full+'\n'+m.note,hint:m.note};
for(const key of ['visualOnly','inputMode','orderWords','optionLabels','acceptedAnswers','grading','combinedParts','answerRelations','relationKey','relationOtherKeys','questionAudio','sourceAudio','picturePrompt','pictureOptions','letterGap','storyText','storyId','storyDialogue','dialogue'])delete q[key];
if(kind===1){q.scene=m.scene.replace('___','['+m.wrong[0]+']');q.prompt='Choose the corrected sentence.';q.partType='readChoose';q.partTitle='Grammar Detective';q.partInstruction='Choose the corrected sentence.';q.answer=full;q.options=[m.answer,...m.wrong].map(w=>m.scene.replace('___',w));}
if(kind===2){q.prompt='Write the missing words.';q.inputMode='typing';q.partType='readWrite';q.partTitle='Complete the Sentence';q.partInstruction='Read and write.';}
if(kind===3){q.scene='Read each sentence carefully.';q.prompt='Which sentence is correct?';q.partType='readChoose';q.partTitle='Sentence Detective';q.partInstruction='Choose the correct sentence.';q.answer=full;q.options=[m.answer,...m.wrong].map(w=>m.scene.replace('___',w));q.spokenScene='';q.visualOnly=true;}
const shift=(n+unit)%4;q.options=q.options.slice(shift).concat(q.options.slice(0,shift));q.source={...q.source,adaptation:'Centre-authored contextual variation of the verified Unit grammar objective.'};return q;}
module.exports={model,question,banks};
