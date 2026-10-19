"""Create browser-sized WebP derivatives; retain all original art and question data."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess,json,hashlib,shutil
from PIL import Image
base=Path(__file__).resolve().parent.parent
import os
media=Path(os.environ.get('TITI_MEDIA_REPO',str(base.parents[2]/'titi-game-media-20261019')))
out=media/'assets/optimized-images';out.mkdir(exist_ok=True)
local=base/'game-kit/image-variants';local.mkdir(exist_ok=True)
files=subprocess.check_output(['git','ls-files','*.png'],cwd=base,text=True).splitlines()
inputs=[(p,base/p) for p in files]
inputs += [('/titi-game-media/assets/'+str(p.relative_to(media/'assets')).replace('\\','/'),p) for p in (media/'assets/hunt-worlds').rglob('*.png')]
inputs += [(str(p.relative_to(base)).replace('\\','/'),p) for p in (base/'game-kit/adventures').glob('teacher*.webp')]
def convert(entry):
 key,p=entry;name=hashlib.sha256(('webp-1:'+key).encode()).hexdigest()[:20]+'.webp';dest=out/name
 with Image.open(p) as src:
  original=src.size;im=src.convert('RGBA') if 'A' in src.getbands() else src.convert('RGB')
  if p.name.startswith('teacher'):
   # Three-frame sheets: each individual pose is at most 500px, never the whole sheet.
   frames=round(im.width/im.height);im.thumbnail((500*frames,500),Image.Resampling.LANCZOS)
  if p.name=='titi-rocket-v1.png':im.thumbnail((500,500),Image.Resampling.LANCZOS)
  if not dest.exists():im.save(dest,'WEBP',quality=93,method=4,exact=True)
  shutil.copyfile(dest,local/name)
  return key,{'url':'/titi-game-media/assets/optimized-images/'+name,'width':im.width,'height':im.height,'originalWidth':original[0],'originalHeight':original[1],'originalBytes':p.stat().st_size,'bytes':dest.stat().st_size}
with ThreadPoolExecutor(max_workers=4) as pool: results=dict(pool.map(convert,inputs))
(base/'game-kit/image-variants.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf8')
runtime="""/* Generated WebP routes; original curriculum and image sources stay intact. */
(()=>{const variants=MAP;
function url(src){if(!src)return src;try{const u=new URL(src,location.href);let key=decodeURIComponent(u.pathname);const marker='/vanlang-on-thi-lop-6/';key=key.includes(marker)?key.split(marker)[1]:key.startsWith('/titi-game-media/')?key:key.replace(/^\\//,'');const v=variants[key];if(!v)return src;return /^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname)?v.url.replace('/titi-game-media/assets/optimized-images/','../game-kit/image-variants/'):v.url;}catch{return src;}}
window.TitiImageVariants={url};})();
""".replace('MAP',json.dumps({k:v['url'] for k,v in results.items()},separators=(',',':')).replace('"','"'))
# Runtime table stores just URL strings.
runtime=runtime.replace('const v=variants[key];','const target=variants[key],v=target?{url:target}:null;')
(base/'game-kit/image-variants.js').write_text(runtime,encoding='utf8')
print(len(results),'WebP derivatives:',sum(v['originalBytes'] for v in results.values()),'to',sum(v['bytes'] for v in results.values()),'bytes',flush=True)
