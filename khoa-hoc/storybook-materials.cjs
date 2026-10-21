/* Colour the main material only. Preserve the original artwork underneath:
 * fruit foliage/stalks, faces, eyes, noses, mouths, hands and small fittings. */
const protectedDetails={
 apple:'<path d="M163 99Q165 28 273 24Q276 87 163 99Z M130 44L155 34Q177 56 171 121L150 119Q154 77 130 58Z"/>',peach:'<path d="M144 76Q165 12 232 28Q290 39 309 124L286 117Q224 83 144 76Z M128 94Q134 51 154 30L176 36Q155 57 150 83Z"/>',
 dog:'<ellipse cx="204" cy="106" rx="61" ry="58"/>',
 cat:'<ellipse cx="174" cy="113" rx="64" ry="52"/>',
 gorilla:'<ellipse cx="173" cy="92" rx="65" ry="57"/>',
 monkey:'<ellipse cx="174" cy="100" rx="69" ry="60"/>',
 seal:'<ellipse cx="185" cy="105" rx="78" ry="64"/>',
 wolf:'<ellipse cx="104" cy="106" rx="47" ry="38"/>',
 fox:'<ellipse cx="196" cy="100" rx="78" ry="64"/>',
 frog:'<ellipse cx="109" cy="83" rx="35" ry="39"/><ellipse cx="211" cy="83" rx="35" ry="39"/><ellipse cx="159" cy="154" rx="70" ry="31"/>',
 snake:'<ellipse cx="190" cy="87" rx="71" ry="60"/>',
 duck:'<ellipse cx="205" cy="91" rx="76" ry="57"/>',
 skunk:'<ellipse cx="81" cy="141" rx="64" ry="58"/>',
 bee:'<ellipse cx="205" cy="118" rx="66" ry="63"/><path d="M55 0H275V75H55Z"/>',
 king:'<path d="M0 0H320V155H0Z"/><ellipse cx="70" cy="194" rx="37" ry="53"/><ellipse cx="254" cy="194" rx="37" ry="53"/>',
 nut:'<path d="M0 0H320V95H0Z"/>',home:'<path d="M50 40H270V115H50Z"/>',
 'cell phone':'<rect x="90" y="70" width="140" height="170" rx="10"/>',
 jet:'<path d="M80 60H245V140H80Z"/>',boat:'<path d="M0 0H320V160H0Z"/>',
 jug:'<ellipse cx="158" cy="72" rx="74" ry="21"/>',
};
function materialMask(symbol,noun){return `<mask id="material-${symbol}" maskUnits="userSpaceOnUse" x="0" y="0" width="320" height="320"><rect width="320" height="320" fill="white"/><g fill="black">${protectedDetails[noun]||''}</g></mask>`;}
function paintedUse(symbol,color){return `<use href="#${symbol}"/><use href="#${symbol}" filter="url(#paint-${color})" mask="url(#material-${symbol})"/>`;}
module.exports={materialMask,paintedUse,protectedDetails};
