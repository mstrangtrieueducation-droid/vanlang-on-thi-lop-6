/* Observed targets in the finished, complete illustrations. Coordinates are percentages.
 * No numbered markers or newly drawn vocabulary stickers are added by the renderer. */
const base=[
 ['reader','the elderly man wearing a blue hat and reading a newspaper','the man with the blue hat'],
 ['icecream','the woman in red who is eating an ice cream','the woman eating an ice cream'],
 ['writer','the child in yellow who is writing in a notebook','the child writing in a notebook'],
 ['chess','the two older people who are playing chess together','the two chess players'],
 ['snail','the small animal with a spiral shell that is sleeping on a flowerpot','the sleeping animal on the flowerpot'],
 ['cyclist','the child with a red helmet who is riding a blue bicycle','the child riding a bicycle'],
 ['knitter','the grandmother in purple who is knitting','the grandmother who is knitting'],
 ['waterer','the girl in green who is watering flowers','the girl watering flowers'],
 ['mother','the mother who is holding a baby','the mother holding a baby'],
 ['umbrella','the woman who is holding an orange umbrella','the woman with the orange umbrella'],
 ['balloon','the girl in white who is holding a red balloon','the girl with the red balloon'],
 ['dogwalker','the child in blue stripes who is walking a brown dog','the child walking a brown dog'],
 ['shoelace','the child who is crouching to tie a shoelace','the child tying a shoelace'],
 ['carrots','the worker in a green apron who is carrying a basket of carrots','the worker carrying carrots'],
 ['violin','the girl in purple who is playing a violin','the girl playing a violin'],
 ['painter','the painter in a yellow cap who is working at an easel','the painter with the yellow cap'],
 ['notice','the man with a red tie who is pointing at a noticeboard','the man pointing at the noticeboard'],
 ['cat','the black and white animal that is sleeping under a bench','the sleeping animal under the bench']
];
const specs={
 town:{boxes:[[12,45,20,43],[1,31,13,28],[38,63,14,20],[28,42,25,29],[40,83,10,8],[82,42,14,27],[0,51,17,40],[66,61,17,22],[67,27,11,29],[58,20,12,25],[51,27,10,27],[55,41,15,29],[76,52,7,12],[35,21,10,20],[77,28,10,23],[18,31,13,24],[84,24,13,29],[2,82,12,9],[5,15,8,18],[94,31,6,25]],extra:[['baker','the baker in a white hat who is standing inside the bakery','the baker inside the bakery'],['backpack','the person in a straw hat who is carrying a blue backpack','the person with the blue backpack']]},
 park:{boxes:[[0,39,20,38],[1,20,11,22],[45,52,12,27],[37,37,23,24],[11,83,10,7],[65,39,14,30],[24,43,11,33],[28,62,17,26],[69,22,10,27],[79,16,10,21],[77,30,10,24],[85,39,15,26],[69,69,13,19],[87,21,11,26],[27,20,12,23],[14,29,13,20],[46,22,11,26],[15,59,11,7],[14,7,5,10],[8,14,6,11]],extra:[['guitar','the musician who is playing a guitar inside the wooden pavilion','the guitarist in the pavilion'],['bench','the man in a dark hat who is sitting alone on a bench near the pavilion','the man sitting near the pavilion']]},
 beach:{boxes:[[0,35,17,27],[20,37,10,26],[2,68,18,30],[10,53,27,22],[30,79,8,8],[41,52,12,31],[65,52,15,31],[77,66,17,24],[34,29,10,31],[42,25,13,28],[47,43,8,18],[55,34,12,24],[30,41,6,11],[73,29,11,32],[12,24,11,20],[26,18,10,21],[86,28,10,19],[62,76,10,6],[81,46,14,28],[92,38,7,20]],extra:[['sweeper','the worker in blue overalls who is sweeping the path','the worker sweeping the path'],['recycler','the child in red who is putting a bottle into the recycling bin','the child using the recycling bin']]}
};
module.exports=Object.fromEntries(Object.entries(specs).map(([id,s])=>[id,{id,asset:id+'.webp',objects:[...base,...s.extra].map(([key,description,reference],i)=>({id:key,description,reference,box:s.boxes[i],x:s.boxes[i][0]+s.boxes[i][2]/2,y:s.boxes[i][1]+s.boxes[i][3]/2})),source:'Centre-authored natural crowd illustration; descriptors checked against the final visible artwork.'}]));
