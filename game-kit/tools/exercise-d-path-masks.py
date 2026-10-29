"""Walkable corridors measured from the three original D matching diagrams."""
import json,hashlib
from pathlib import Path
from PIL import Image,ImageFilter
root=Path(__file__).resolve().parents[2];folder=root/'game-kit/adventures/textbook-d';out={}
for sound in ['ap','ig','up-ud']:
 boxes={'ap':[[48,491,250,655],[366,329,566,490],[714,243,914,407],[550,705,752,870]],'ig':[[14,444,216,594],[188,694,390,844],[514,644,716,794],[754,522,954,670]],'up-ud':[[202,377,404,543],[557,497,758,662],[48,762,250,930],[750,728,954,895]]}[sound]
 file=folder/f'phonics-2-d-{sound}.webp';im=Image.open(file).convert('RGB').resize((128,128));mask=Image.new('L',(128,128));pix=mask.load()
 for y in range(128):
  for x in range(128):
   r,g,b=im.getpixel((x,y));bright=(r>225 and g>215 and b>170) if sound=='ap' else (r>185 and g>175 and b>135 and r-g<45)
   paper=any(a<=x/127*1000<=c and b<=y/127*1000<=d for a,b,c,d in boxes)
   pix[x,y]=255 if bright and not paper and 2<x<125 and 25<y<118 else 0
 mask=mask.filter(ImageFilter.MaxFilter(5));out['2:'+sound.replace('-',',')]={'w':128,'h':128,'rows':[''.join('1' if mask.getpixel((x,y)) else '0' for x in range(128)) for y in range(128)],'imageSHA256':hashlib.sha256(file.read_bytes()).hexdigest()}
(folder/'path-masks.json').write_text(json.dumps(out),encoding='utf-8');print('Original D corridor masks:',len(out))
