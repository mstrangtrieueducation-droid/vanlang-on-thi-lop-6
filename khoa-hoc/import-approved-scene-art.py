"""Import inspected built-in imagegen outputs; delivery conversion only, no retouching."""
from pathlib import Path
import sys,json,re,hashlib
from PIL import Image
root=Path(__file__).resolve().parent.parent
out=root/'game-kit/adventures/unit-scenes-v4'
manifest=out/'art-sources.json'
records=json.loads(manifest.read_text(encoding='utf-8'))
for job in json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')):
 name=job['id']
 if not re.fullmatch(r'(phonics-[1-4]|family-friends-[12]|discover-[1-4])-unit-\d+',name):raise ValueError('Invalid asset id')
 src=Path(job['path']).resolve()
 if src.suffix.lower()!='.png' or '.codex/generated_images/' not in src.as_posix():raise ValueError('Not a built-in generation output')
 im=Image.open(src).convert('RGB')
 if abs(im.width/im.height-16/9)>.025:raise ValueError('Landscape composition needs review: '+name)
 im.thumbnail((1920,1080),Image.Resampling.LANCZOS)
 target=out/(name+'.webp');im.save(target,'WEBP',quality=92,method=6)
 record={'id':name,'file':target.name,'width':im.width,'height':im.height,'bytes':target.stat().st_size,'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'webpSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'prompt':job['prompt'],'mode':'Built-in imagegen; inspected before measuring interactive regions'}
 records=[r for r in records if r['id']!=name]+[record]
 print(json.dumps({k:record[k] for k in ['id','width','height','bytes']}),flush=True)
manifest.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
