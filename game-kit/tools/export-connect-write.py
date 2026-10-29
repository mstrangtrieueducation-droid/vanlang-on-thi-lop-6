"""Verified original D Connect, then write diagrams (not Review game boards)."""
from pathlib import Path
import pymupdf as fitz,json,hashlib,sys
from PIL import Image
R=Path(__file__).resolve().parents[2];book=Path(sys.argv[1]);out=R/'game-kit/adventures/textbook-maps';doc=fitz.open(book)
regions={
 'b':(8,[75,565,1255,1245],{'bear':[900,815],'bird':[630,950],'bed':[1090,930],'banana':[410,1085],'apple':[650,1135],'ax':[610,755],'ant':[430,850],'alligator':[855,1075]}),
 'j':(34,[75,565,1255,1240],{'jet':[180,1020],'jam':[380,750],'juice':[650,845],'jacket':[950,890],'girl':[750,1000],'dog':[530,1100],'egg':[660,750],'computer':[980,720]}),
 'r':(58,[75,565,1255,1245],{'rabbit':[210,880],'rose':[925,830],'rice':[410,1050],'robot':[660,940],'net':[660,725],'pen':[410,825],'elbow':[930,1060],'gift':[680,1165]}),
 'z':(82,[75,565,1255,1245],{'zebra':[490,750],'zero':[720,880],'zipper':[320,960],'zoo':[1130,1070],'yo-yo':[870,740],'web':[510,950],'pineapple':[775,1050],'leaf':[580,1090]})
}
sources=[];maps={}
for letter,(page,box,nodes) in regions.items():
 p=doc[page-1];pix=p.get_pixmap(matrix=fitz.Matrix(1.8,1.8));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples).crop(box);file=f'phonics-1-connect-write-{letter}.webp';im.save(out/file,lossless=True,method=6);preview=im.copy();preview.thumbnail((1000,1000));pr=file.replace('.webp','-preview.webp');preview.save(out/pr,quality=96,method=6)
 w,h=im.size;maps[letter]={'image':file,'preview':pr,'book':1,'page':page-1,'height':1000*h/w,'total':1000*h/w,'extra':[],'nodes':{word:{'x':(x-box[0])*1000/w,'y':(y-box[1])*1000/w,'rx':48,'ry':44} for word,(x,y) in nodes.items()},'exercise':'D Connect, then write','strictRule':True}
 sources.append({'file':file,'preview':pr,'pdfPage':page,'printedPage':page-1,'sourceSHA256':hashlib.sha256(book.read_bytes()).hexdigest(),'cropAtRenderScale1_8':box,'size':im.size,'operation':'Unedited crop of the original D Connect, then write exercise.'})
(out/'connect-write-sources.json').write_text(json.dumps(sources,indent=2),encoding='utf-8')
(out/'connect-write-regions.json').write_text(json.dumps(maps,indent=2),encoding='utf-8')
print('Exported four verified D diagrams')
