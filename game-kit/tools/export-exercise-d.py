"""Extract audited exercise-D regions from the supplied Student Book PDFs.
No reconstructed diagrams or added vocabulary. RGB pixels are retained in WebP.
Run with BOOKS_DIRECTORY; metadata records the source hash and exact crop.
"""
import sys,json,hashlib,subprocess,shutil
from pathlib import Path
import pymupdf as fitz
from PIL import Image,ImageDraw
import numpy as np
root=Path(__file__).resolve().parents[2];private=root/'private/exercise-d-20261029'
node=shutil.which('node') or 'node'
catalog=json.loads(subprocess.check_output([node,'-e',"console.log(JSON.stringify(require('./khoa-hoc/program/textbook-d.cjs').books))"],cwd=root))
books=Path(sys.argv[1]);out=root/'game-kit/adventures/textbook-d';out.mkdir(exist_ok=True)
ref=Image.open(private/'b1-p8.png').convert('RGB')
def binary(im):return np.all(np.asarray(im)>220,axis=2)
dt=binary(ref.crop((95,515,155,573)));et=binary(ref.crop((95,1137,155,1195)))
def locate(im,template,lo,hi):
 a=binary(im.crop((95,0,155,im.height)));scores=[np.mean(a[y:y+58]!=template) for y in range(lo,min(hi,im.height-58))];i=int(np.argmin(scores));return lo+i,round(scores[i],4)
cache=json.loads((out/'sources.json').read_text()) if (out/'sources.json').exists() else []
metadata=[]
for b,entries in catalog.items():
 source=books/f'phonics-{b}.pdf';sha=hashlib.sha256(source.read_bytes()).hexdigest();doc=fitz.open(source)
 for sound,d in entries.items():
  old=next((r for r in cache if r['book']==int(b) and r['sound']==sound),None)
  if old and (out/old['file']).exists():metadata.append(old);continue
  p=doc[d['page']-1];pix=p.get_pixmap(matrix=fitz.Matrix(1.6,1.6));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im=im.resize((1180,round(im.height*1180/im.width)),Image.Resampling.LANCZOS)
  dy,ds=locate(im,dt,int(im.height*.28),int(im.height*.82));ey,es=locate(im,et,dy+130,int(im.height*.93))
  if ds>.16:raise ValueError(f'Unverified D header {b}/{sound}: {dy} {ds}')
  # First short-vowel lessons end with D (a chant), not E.
  if d['kind']=='listenRead' or (int(b)==3 and sound in ['ai,ay','oa,ow']):ey=int(im.height*.915);es=None
  if es is not None and es>.17:raise ValueError(f'Unverified E boundary {b}/{sound}: {ey} {es}')
  box=[85,dy-6,1125,ey-12];crop=im.crop(box);name=f"phonics-{b}-d-{sound.replace(',','-')}.webp";crop.save(out/name,'WEBP',lossless=True,method=6)
  small=crop.copy();small.thumbnail((900,1100));small.save(out/name.replace('.webp','-preview.webp'),'WEBP',quality=91,method=6)
  metadata.append({'book':int(b),'sound':sound,'pdfPage':d['page'],'printedPage':d['printedPage'],'sourceSHA256':sha,'renderSize':list(im.size),'crop':box,'file':name,'preview':name.replace('.webp','-preview.webp'),'size':list(crop.size),'headerMatchError':ds,'endMatchError':es,'operation':'Unmodified original exercise D crop'})
(out/'sources.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
for b in range(1,5):
 rows=[r for r in metadata if r['book']==b]
 for k in range(0,len(rows),8):
  canvas=Image.new('RGB',(1600,1200),'#ddd');draw=ImageDraw.Draw(canvas)
  for j,r in enumerate(rows[k:k+8]):
   im=Image.open(out/r['file']);im.thumbnail((395,555));x=j%4*400;y=j//4*600;canvas.paste(im,(x,y+30));draw.text((x+8,y+8),f"B{b} {r['sound']} PDF{r['pdfPage']}",fill='black')
  canvas.save(private/f'extracted-b{b}-{k//8}.jpg')
print('Original D crops:',len(metadata))
