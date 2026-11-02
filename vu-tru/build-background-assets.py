"""Browser-sized backgrounds for course worlds and road scenes; originals retained."""
from pathlib import Path
from PIL import Image
base=Path(__file__).resolve().parent
dest=base/'assets/bg';dest.mkdir(exist_ok=True)
jobs=[(p,dest/p.name,1024) for p in sorted((base/'assets').glob('*.webp'))]
jobs+=[(p,dest/p.name.replace('-v1','-v2'),1600) for p in sorted((base/'assets/scenes').glob('*-v1.webp'))]
for src,out,size in jobs:
 im=Image.open(src);im.thumbnail((size,size),Image.Resampling.LANCZOS)
 im.save(out,'WEBP',quality=72,method=6)
 print(f"{src.stat().st_size//1024:5d} KB -> {out.stat().st_size//1024:4d} KB {im.width}x{im.height} {out.name}")
