// Class Book Lessons 1 and 3, verified against the supplied books.
// A semicolon separates the first and second vocabulary lesson.
const vocabulary={1:[
'pen,rubber,pencil,ruler,book;bag,folder,door,window,bookcase',
'doll,ball,teddy,puzzle,car;kite,bike,train,game,scooter',
'arms,nose,face,legs,ears;fingers,hands,eyes,eyebrows,shoulders',
'teacher,pupil,housewife,fireman,pilot;doctor,policeman,farmer,postman,zookeeper',
'seesaw,slide,net,swing,tree;pool,armbands,ice cream,frisbee,climbing frame',
'mum,dad,sister,brother,grandma,grandpa;aunt,uncle,cousin',
'dress,socks,T-shirt,trousers,shorts;shoes,coat,hat,cardigan,tracksuit',
'kitchen,living room,dining room,bedroom,bathroom,garden;upstairs,downstairs,house,flat,front door',
'lunch box,sandwich,drinks,apple,banana,biscuit;tomato,pear,grapes,pineapple,cherries',
'long,short,blond,brown,curly,straight;square,circle,triangle,rectangle,diamond',
'elephant,giraffe,monkey,big,tall,little;tiger,snake,parrot,polar bear,seal',
'rice,meat,carrots,yogurt,fish,bread;milk,juice,water,hot chocolate,tea',
'rug,bed,cupboard,shelf,pillow,blanket;eleven,twelve,thirteen,fourteen,fifteen,sixteen,seventeen,eighteen,nineteen,twenty',
'run,fly,walk,talk,swim,climb;write,draw,sing,dance,cook',
'sandcastle,beach,crab,the sea,boat,shell;sun cream,bat,ice lolly,bucket,spade'
],2:[
'classroom,table,computer,peg,pencil case,board;poster,picture,drawers,cupboard,CD player',
'hot,cold,hungry,thirsty,happy,sad;tired,angry,scared,brave,nervous',
'ride a bike,ride a horse,skate,skateboard,play tennis,play football;behind,in front of,next to,between',
'salad,fries,pizza,milkshake,cheese sandwich,chicken;ten,twenty,thirty,forty,fifty,sixty,seventy,eighty,ninety,one hundred',
'art,maths,English,science,PE,music;playground,sports field,art room,computer room,gym',
'help my mum,do my homework,visit my grandma,go swimming,have a music lesson,watch TV;listen to music,play with friends,read a book,write an email',
'chocolate,sweets,balloon,present,cake,card;neighbour,pastries,nuts,tie,buy',
'get up,have breakfast,go to school,go home,have dinner,go to bed;in the morning,in the afternoon,in the evening,at night',
'hospital,school,airport,police station,fire station,shop;station,zoo,supermarket,bank,garage',
'raining,windy,hot,cold,snowing,sunny;fly a kite,make a snowman,wear coats,go outside,go ice skating',
'skirt,scarf,gloves,jeans,boots,shirt;o’clock,quarter past,half past,quarter to',
'wedding,guests,cake,bride,band,invitation;make a cake,wash the car,brush my hair,take photos,choose a dress',
'cow,goat,horse,sheep,donkey,goose;loud,quiet,fast,slow',
'kind,naughty,wet,dry,fridge,photo;tidy,untidy,floor,rubbish,dirty',
'man,men,woman,women,child,children;first,second,third,fourth,finish line'
]};
const starts=[8,14,20,30,36,42,52,58,64,74,80,86,96,102,108];
const titles={1:["What's this?","Playtime!","This is my nose!","He's a hero!","Where's the ball?","Billy's teddy!","Are these his trousers?","Where's Grandma?","Lunchtime!","A new friend!","I like monkeys!","Dinnertime!","Tidy up!","Action Boy can run!","Let's play ball!"],2:["Our new things","They're happy now!","I can ride a bike!","Have you got a milkshake?","We've got English!","Let's play after school!","Let's buy presents!","What's the time?","Where does she work?","It's hot today!","What are you wearing?","You're sleeping!","Look at all the animals!","Look at the photos!","Well done!"]};
const books={1:'1oxGnxH7BvnqMNK92sbHx15ANI92ufMGM',2:'1mUlE3tIqjpno2_YNNLk4auNy5U3sV_ce'};
module.exports=Object.fromEntries([1,2].map(n=>[n,vocabulary[n].map((s,i)=>({unit:i+1,title:titles[n][i],page:starts[i],readingPage:starts[i]+4,bookURL:'https://drive.google.com/file/d/'+books[n]+'/view',words:s.split(';')[0].split(','),extra:s.split(';')[1].split(',')}))]));
