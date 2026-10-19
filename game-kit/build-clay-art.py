"""Extract alpha-separated generated icons; retain original PNGs and full prompts."""
from pathlib import Path
import json,os,hashlib,shutil
from PIL import Image
import numpy as np
import cv2
base=Path(__file__).resolve().parent.parent
media=Path(os.environ['TITI_MEDIA_REPO'])
private=base/'clay-output-paths.json'
if private.exists():inputs=json.loads(private.read_text(encoding='utf8'))
else:
 saved=json.loads((base/'game-kit/clay-art-sources.json').read_text(encoding='utf8'))
 inputs={'background':{'path':str(media/'assets/clay-v4'/saved['background']['original']),'prompt':saved['background']['prompt']},'sheets':[{**r,'path':str(media/'assets/clay-v4'/r['original'])} for r in saved['sheets'] if not r['reusedGeneratedArt']]}
profiles=json.loads((base/'game-kit/adventures/panoramas/profiles.json').read_text(encoding='utf8'))
previous=json.loads((base/'game-kit/adventures/hunt-worlds/sources.json').read_text(encoding='utf8'))
for i,p in enumerate(profiles):
 art=next(a for a in previous['objects'] if a['course']==p['course'] and a['unit']==p['unit'])
 items=[p['words'][0],'','',*p['words'][1:]]
 inputs['sheets'].append({'index':100+i,'path':str(media/'assets/hunt-worlds/objects'/art['file']),'items':items,'prompt':art['prompt'],'reuse':True,'original':'../hunt-worlds/objects/'+art['file']})
out=media/'assets/clay-v4';(out/'items').mkdir(parents=True,exist_ok=True);(out/'atlases').mkdir(exist_ok=True)
catalog={};sources={'mode':'Built-in image generation','sheets':[]}
for row in inputs['sheets']:
 src=Path(row['path']);im=Image.open(src).convert('RGBA');w,h=im.size
 alpha=np.asarray(im.getchannel('A'));binary=(alpha>200).astype('uint8')
 for kernel in [1,3,5,9,13,17,21]:
  mask=binary if kernel==1 else cv2.erode(binary,np.ones((kernel,kernel),'uint8'))
  n,labels,stats,centres=cv2.connectedComponentsWithStats(mask,8)
  used={min(3,int(centres[i,1]/(h/4)))*4+min(3,int(centres[i,0]/(w/4))) for i in range(1,n) if stats[i,4]>=30}
  if row.get('single') or not any(s[2]>w/4*1.5 or s[3]>h/4*1.5 for s in stats[1:]) and all(not word or i in used for i,word in enumerate(row['items'])):break
 cells={i:[] for i in range(16)};seed_cells={};seeds=np.zeros(alpha.shape,dtype='uint8')
 for label in range(1,n):
  x,y,cw,ch,area=stats[label];cx,cy=centres[label]
  if area<30:continue
  if not row.get('single') and (cw>w/4*1.5 or ch>h/4*1.5):raise RuntimeError('Connected icons or opaque background: '+str(src))
  col=min(3,int(cx/(w/4)));r=min(3,int(cy/(h/4)));cell=0 if row.get('single') else r*4+col;cells[cell].append((x,y,cw,ch));seed_cells[label]=cell;seeds[labels==label]=1
 distance,nearest=cv2.distanceTransformWithLabels(1-seeds,cv2.DIST_L2,5,labelType=cv2.DIST_LABEL_CCOMP)
 lookup=np.full(int(nearest.max())+1,-1,dtype='int16')
 for label,cell in seed_cells.items():lookup[int(nearest[labels==label][0])]=cell
 owners=lookup[nearest]
 for i,key in enumerate(row['items']):
  if not key or row.get('reuse') and key in catalog:continue
  boxes=cells[i]
  if not boxes:raise RuntimeError('Empty icon '+key)
  x=max(0,min(b[0] for b in boxes)-12);y=max(0,min(b[1] for b in boxes)-12)
  right=min(w,max(b[0]+b[2] for b in boxes)+12);bottom=min(h,max(b[1]+b[3] for b in boxes)+12)
  rgba=np.array(im);rgba[:,:,3]=np.where((owners==i)&(distance<=12),alpha,0);crop=Image.fromarray(rgba).crop((x,y,right,bottom));crop.thumbnail((284,284),Image.Resampling.LANCZOS)
  canvas=Image.new('RGBA',(300,300));canvas.alpha_composite(crop,((300-crop.width)//2,(300-crop.height)//2))
  name=hashlib.sha256(key.encode()).hexdigest()[:16]+'.webp';p=out/'items'/name;canvas.save(p,'WEBP',quality=90,method=4,exact=True)
  catalog[key]={'src':'/titi-game-media/assets/clay-v4/items/'+name,'width':300,'height':300,'semantic':key,'artPack':'clay-v4','transparent':True,'bytes':p.stat().st_size}
 original=row.get('original') or 'atlases/sheet-'+str(row['index'])+'.png'
 if not row.get('reuse') and src.resolve()!=(out/original).resolve():shutil.copyfile(src,out/original)
 sources['sheets'].append({'index':row['index'],'items':row['items'],'prompt':row['prompt'],'original':original,'single':bool(row.get('single')),'reusedGeneratedArt':bool(row.get('reuse'))})
sources['background']={'prompt':inputs['background']['prompt'],'original':'space-original.png'}
if Path(inputs['background']['path']).resolve()!=(out/'space-original.png').resolve():shutil.copyfile(inputs['background']['path'],out/'space-original.png')
bg=Image.open(inputs['background']['path']).convert('RGB');bg.thumbnail((1600,900),Image.Resampling.LANCZOS);bg.save(media/'assets/world-hub/v1/space.webp','WEBP',quality=85,method=4)
(out/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(base/'game-kit/clay-art-sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(base/'game-kit/clay-art.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
alias_file=base/'phonics-art-aliases.json'
if not alias_file.exists():alias_file=base/'game-kit/clay-art-aliases.json'
aliases=json.loads(alias_file.read_text(encoding='utf8'))
(base/'game-kit/clay-art-aliases.json').write_text(json.dumps(aliases,indent=2)+'\n',encoding='utf8')
runtime="""/* Generated transparent 300px clay artwork; no source question records changed. */
(()=>{const items=CATALOG,aliases=ALIASES;window.ClayArtwork={items,source(p){if(!p||p.color||p.quantity)return null;return items[p.semantic||aliases[p.src]]?.src||null;}};const family=window.FamilyArtwork;if(family){for(const [key,p]of Object.entries(family.items)){const art=items[p.semantic||key.split(':').slice(2).join(':')];if(art)family.items[key]={...art};}for(const group of ['icons','people'])for(const key of Object.keys(family[group]))if(items[key])family[group][key]={...items[key]};for(const [key,p]of Object.entries(items))family.icons[key]??={...p};}window.dispatchEvent(new Event('clay-art-ready'));})();
""".replace('CATALOG',json.dumps(catalog,ensure_ascii=True,separators=(',',':'))).replace('ALIASES',json.dumps(aliases,separators=(',',':')))
(base/'game-kit/clay-art.js').write_text(runtime,encoding='utf8')
print('Transparent 300px teaching icons:',len(catalog),'new generated sheets/icons:',sum(not r.get('reuse') for r in inputs['sheets']),'reused generated atlases:',sum(bool(r.get('reuse')) for r in inputs['sheets']),flush=True)
