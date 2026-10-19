from pathlib import Path
from PIL import Image
import os,json,hashlib
base=Path(__file__).resolve().parent.parent;media=Path(os.environ['TITI_MEDIA_REPO'])
catalog=json.loads((base/'game-kit/clay-art.json').read_text(encoding='utf8'));rows=[]
for word,p in catalog.items():
 file=media/'assets'/p['src'].split('/assets/')[1];im=Image.open(file)
 assert im.size==(300,300),(word,im.size)
 assert im.mode=='RGBA',word
 low,high=im.getchannel('A').getextrema();assert low==0 and high>200,word
 rows.append({'word':word,'url':p['src'],'width':300,'height':300,'alphaMin':low,'alphaMax':high,'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()})
(base/'game-kit/clay-art-audit.json').write_text(json.dumps({'count':len(rows),'assets':rows},indent=2)+'\n',encoding='utf8')
print(len(rows),'decoded WebP sprites checked: 300 x 300 with transparent alpha; total',sum(r['bytes'] for r in rows),'bytes')
