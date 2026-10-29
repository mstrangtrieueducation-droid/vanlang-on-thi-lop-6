/* Approved settings. This catalogue does not grant entry or classify homework. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.UnitScenes=api;})(globalThis,()=>{
 const titles={
 'phonics-1':['Forest Storehouse','Stream Treehouse','In the Zoo','In the Classroom','In the Kitchen','On the Farm','On the Beach','In the Souvenir Shop'],
 'phonics-2':['The Park','In the Library','On the Farm','In the Restaurant','Ocean Floor Swimming Race','Fishing by the Pond','In the Flower Garden','Race to the Cupcake Finish Line'],
 'phonics-3':['Ice Rink Birthday Party','Fairyland','Desert Fossil Adventure','Lost on Desert Island','Lost in Candy House Jungle','In the Police Station','In the Bathroom','Beautiful Life on the Moon'],
 'phonics-4':['Palace Wedding','Amusement Park','International Sports Games','Ocean Floor Fun','First Day of School','Camping on the Clouds'],
 'family-friends-1':['Art Class','Toy Supermarket','PE Class','Job Roleplay Show','Pet Training Camp','The Fair','Clothes Shop','Building Construction','In the Kitchen','Overseas Travel','Rainforest Castle','Fast Food Restaurant',"Tidying Baby's Room",'School Sports Day','Island Beach'],
 'family-friends-2':['In the Classroom','Idol Music Concert','Sports Training Field','Cooking Lunch Together','School Supplies Shop','After School Time','Gift Shop','World of Clocks','Neighborhood Map','Weather Forecast','Bedroom','Royal Princess & Prince Wedding','Cloud Farm','Art Gallery','English Contest'],
 'discover-1':['New Year Party','Pet Shop','Sky World','Street Wall Painting Contest','Mountain Climbing Exploration','In the Nature Reserve','Four Seasons','Seasonal Activity Plan','Math Class','Cooking Together','Farm Produce Fair','Future Jobs','My Neighborhood','City and Countryside','Music Class','Christmas Eve Music Performance','Backyard Birthday Party','Gingerbread Boy Comic World'],
 'discover-2':['Animal Kingdom','Jungle Battle','Arctic Life','Junior Chef Contest','Then and Now','Suburban Picnic','Cashier at the Grocery Store','Busy Village','Following Rules',"Animals' New Year Party",'Protecting the Environment','Milk Carton Adventure','Musical Dream','Night Sky Flute Contest','Speed Race','Goats Encounter on the Bridge','Art & Craft Class','Paper Crane Adventure'],
 'discover-3':['New Year Festival','The Red Rubber Ball Game','Writing Letters Around the World','Traveling Around the World','Lost in the Poetry Book','Adventure in Words World','Observing Time','Junior Doctor','Young Scientist','Future Inventor','Musical Conquest Dream','World Musical Instruments','A Day as a Mechanical Engineer','Internship in Glass Village','Farmer and Fruit Garden','Helping Farmers Harvest','Majestic Island Exploration','Antarctic Fishing Village']
 };
 Object.values(titles).forEach(Object.freeze);Object.freeze(titles);
 function setting(course,unit){const title=titles[course]?.[unit-1];return title?{course,unit,title,id:course+'-unit-'+unit,floatingAllowed:/Moon|Clouds|Sky World/.test(title)}:null;}
 const activeLesson=(course,lesson)=>course!=='phonics-4'||Number(lesson.unit)<=6;
 function scope(course){return {...course,lessons:course.lessons.filter(l=>activeLesson(course.id,l))};}
 return Object.freeze({titles,setting,activeLesson,scope});
});
