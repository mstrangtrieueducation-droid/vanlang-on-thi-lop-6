"""Extract generated flat 2D objects without neighbouring cells; preserve alpha."""
from pathlib import Path
import json,os,hashlib,shutil
from PIL import Image
import numpy as np
import cv2
base=Path(__file__).resolve().parent.parent
media=Path(os.environ['TITI_MEDIA_REPO'])
out=media/'assets/storybook-v1'
(out/'objects').mkdir(parents=True,exist_ok=True);(out/'originals').mkdir(exist_ok=True)
private=base/'storybook-outputs.private.json'
rows=json.loads(private.read_text(encoding='utf8')) if private.exists() else [{**r,'path':str(out/r['original'])} for r in json.loads((base/'khoa-hoc/storybook-art-sources.json').read_text(encoding='utf8'))['sheets']]
catalog={};sources=[]
for row in rows:
 im=Image.open(row['path']).convert('RGBA');w,h=im.size;alpha=np.array(im.getchannel('A'));binary=(alpha>180).astype('uint8')
 for kernel in [1,3,5,9,13,17,21]:
  mask=binary if kernel==1 else cv2.erode(binary,np.ones((kernel,kernel),'uint8'))
  n,labels,stats,centres=cv2.connectedComponentsWithStats(mask,8)
  used={min(3,int(centres[i,1]/(h/4)))*4+min(3,int(centres[i,0]/(w/4))) for i in range(1,n) if stats[i,4]>30}
  if len(row['words'])==1 or not any(s[2]>w/4*1.6 or s[3]>h/4*1.6 for s in stats[1:]) and all(i in used for i in range(len(row['words']))):break
 seeds=np.zeros(alpha.shape,dtype='uint8');seed_cells={};cells={i:[] for i in range(16)}
 for label in range(1,n):
  x,y,cw,ch,area=stats[label];cx,cy=centres[label]
  if area<30:continue
  cell=0 if len(row['words'])==1 else min(3,int(cy/(h/4)))*4+min(3,int(cx/(w/4)))
  cells[cell].append((x,y,cw,ch));seed_cells[label]=cell;seeds[labels==label]=1
 distance,nearest=cv2.distanceTransformWithLabels(1-seeds,cv2.DIST_L2,5,labelType=cv2.DIST_LABEL_CCOMP)
 lookup=np.full(int(nearest.max())+1,-1,dtype='int16')
 for label,cell in seed_cells.items():lookup[int(nearest[labels==label][0])]=cell
 owners=lookup[nearest]
 for i,word in enumerate(row['words']):
  boxes=cells[i]
  if not boxes:raise RuntimeError('Missing '+word)
  rgba=np.array(im);rgba[:,:,3]=np.where((owners==i)&(distance<=10),alpha,0)
  crop=Image.fromarray(rgba).crop((max(0,min(b[0] for b in boxes)-10),max(0,min(b[1] for b in boxes)-10),min(w,max(b[0]+b[2] for b in boxes)+10),min(h,max(b[1]+b[3] for b in boxes)+10)))
  crop.thumbnail((300,300),Image.Resampling.LANCZOS)
  canvas=Image.new('RGBA',(320,320));canvas.alpha_composite(crop,((320-crop.width)//2,(320-crop.height)//2))
  name=hashlib.sha256(word.encode()).hexdigest()[:16]+'.webp';canvas.save(out/'objects'/name,'WEBP',quality=90,method=4,exact=True)
  catalog[word]={'src':'/titi-game-media/assets/storybook-v1/objects/'+name,'width':320,'height':320,'style':'2D storybook','transparent':True}
 original='originals/sheet-'+str(row['index'])+'.png'
 if Path(row['path']).resolve()!=(out/original).resolve():shutil.copyfile(row['path'],out/original)
 sources.append({'index':row['index'],'words':row['words'],'prompt':row['prompt'],'original':original})
(base/'khoa-hoc/storybook-art.json').write_text(json.dumps(catalog,indent=2)+'\n',encoding='utf8')
source={'mode':'Built-in image generation','style':'Flat 2D children’s-book illustration','sheets':sources}
for p in [out/'sources.json',base/'khoa-hoc/storybook-art-sources.json']:p.write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Flat 2D sprites:',len(catalog),flush=True)
