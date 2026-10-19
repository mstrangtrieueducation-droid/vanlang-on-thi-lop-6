"""Browser-sized globe derivatives: fixed q85 and <=600px / <80KB, originals retained."""
from pathlib import Path
import json,os,shutil
from PIL import Image
base=Path(__file__).resolve().parent
media=Path(os.environ.get('TITI_MEDIA_REPO',str(base.parents[3]/'titi-game-media-20261019')))
# Most developer checkouts place the media repository beside the project parent.
if not media.exists():raise RuntimeError('Set TITI_MEDIA_REPO to the media checkout')
dest=media/'assets/world-hub/v1';dest.mkdir(parents=True,exist_ok=True)
catalog=json.loads((base/'catalog.json').read_text(encoding='utf8'))
manifest={'version':1,'quality':85,'background':'/titi-game-media/assets/world-hub/v1/space.webp','courses':[]}
for c in catalog:
 src=base/'assets'/f"{c['id']}.webp"
 if not src.exists():continue
 size=600
 while True:
  im=Image.open(src).convert('RGBA');im.thumbnail((size,size),Image.Resampling.LANCZOS)
  out=dest/f"{c['id']}.webp";im.save(out,'WEBP',quality=85,method=4,exact=True)
  if out.stat().st_size<80000:break
  size-=24
  if size<300:raise RuntimeError('Cannot satisfy globe size budget')
 manifest['courses'].append({'id':c['id'],'name':c['name'],'url':'/titi-game-media/assets/world-hub/v1/'+out.name,'width':im.width,'height':im.height,'bytes':out.stat().st_size})
(base/'hub-assets.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Globe derivatives:',len(manifest['courses']),'largest:',max(c['bytes'] for c in manifest['courses']),'bytes')
