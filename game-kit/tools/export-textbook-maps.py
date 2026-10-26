from pathlib import Path
import fitz,hashlib,json,sys
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
if len(sys.argv)!=2:raise SystemExit('Usage: python game-kit/tools/export-textbook-maps.py PATH_TO_ORIGINAL_BOOKS')
BOOKS=Path(sys.argv[1])
OUT=ROOT/'game-kit/adventures/textbook-maps';OUT.mkdir(exist_ok=True)
provenance=[]
for book in range(1,5):
 path=BOOKS/f'phonics-{book}.pdf';doc=fitz.open(path);sha=hashlib.sha256(path.read_bytes()).hexdigest()
 for pair,page in enumerate([24,44,64,88 if book==1 else 84]):
  pix=doc[page-1].get_pixmap(matrix=fitz.Matrix(1.8,1.8));img=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);file=f'phonics-{book}-review-{pair+1}.webp';img.save(OUT/file,lossless=True,method=6)
  preview=img.copy();preview.thumbnail((900,1400),Image.Resampling.LANCZOS);previewFile=file.replace('.webp','-preview.webp');preview.save(OUT/previewFile,quality=95,method=6)
  provenance.append({'file':file,'book':f'Oxford Phonics World {book} Student Book','pdfPage':page,'printedPage':page-1,'sourceSHA256':sha,'pixelSHA256':hashlib.sha256(img.tobytes()).hexdigest(),'size':img.size,'preview':previewFile,'previewSize':preview.size,'previewSHA256':hashlib.sha256((OUT/previewFile).read_bytes()).hexdigest(),'operation':'Full original page rendered without illustration edits; lossless WebP.'})
# The original game boards do not contain every word in the existing quiz bank.
# Authentic dictionary crops extend those boards without replacing the original map or its answer key.
extras={2:{'hen':(86,51,26,65,35.5),'vet':(89,14,70,26,79.5),'net':(87,51,69,65,77),'fig':(86,12,61,26,69),'bin':(85,12,78,26,86),'top':(89,12,43,26,51)},3:{'kite':(87,13,44,27,51),'home':(87,13,10,27,17),'eat':(86,13,53,27,60),'sea':(88,54,78,68,86),'night':(88,13,35,27,42),'high':(86,54,79,68,86),'row':(88,54,43,68,51),'soap':(89,13,26,27,34),'food':(86,54,10,68,17),'glue':(86,54,44,68,51)}}
for book,words in extras.items():
 path=BOOKS/f'phonics-{book}.pdf';doc=fitz.open(path);sha=hashlib.sha256(path.read_bytes()).hexdigest()
 for word,(page,l,t,r,b) in words.items():
  p=doc[page-1];clip=fitz.Rect(p.rect.width*l/100,p.rect.height*t/100,p.rect.width*r/100,p.rect.height*b/100);pix=p.get_pixmap(matrix=fitz.Matrix(3,3),clip=clip);im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);file=f'phonics-{book}-{word}.webp';im.save(OUT/file,lossless=True,method=6)
  provenance.append({'file':file,'book':f'Oxford Phonics World {book} Student Book','pdfPage':page,'printedPage':page-1,'sourceSHA256':sha,'cropPercent':[l,t,r,b],'pixelSHA256':hashlib.sha256(im.tobytes()).hexdigest(),'size':im.size,'operation':'Unedited original dictionary illustration crop, supplemental to the complete original game map.'})
(OUT/'sources.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2),encoding='utf8')
print('Exported',len(provenance),'original map/illustration assets')
