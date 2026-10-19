from pathlib import Path
import os,json,shutil
from PIL import Image
base=Path(__file__).resolve().parent.parent
out=Path(os.environ['TITI_MEDIA_REPO'])/'assets/storybook-v1';(out/'backgrounds').mkdir(exist_ok=True)
private=base/'storybook-backgrounds.private.json'
rows=json.loads(private.read_text(encoding='utf8')) if private.exists() else [{**r,'path':str(out/r['original'])} for r in json.loads((base/'khoa-hoc/storybook-backgrounds.json').read_text(encoding='utf8'))]
saved=[]
for row in rows:
 original='originals/'+row['id']+'-background.png';src=Path(row['path'])
 if src.resolve()!=(out/original).resolve():shutil.copyfile(src,out/original)
 im=Image.open(src).convert('RGB');im.thumbnail((1600,900),Image.Resampling.LANCZOS);target=out/'backgrounds'/(row['id']+'.webp');im.save(target,'WEBP',quality=88,method=4)
 saved.append({'id':row['id'],'prompt':row['prompt'],'original':original,'src':'/titi-game-media/assets/storybook-v1/backgrounds/'+target.name,'width':im.width,'height':im.height,'bytes':target.stat().st_size,'mode':'Built-in image generation'})
(base/'khoa-hoc/storybook-backgrounds.json').write_text(json.dumps(saved,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Ten illustrated 2D backgrounds prepared',flush=True)
