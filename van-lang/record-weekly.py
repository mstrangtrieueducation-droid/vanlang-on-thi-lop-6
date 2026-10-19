"""Native US child narration. Exact source question keys, no spoken blank/underscore."""
import asyncio,json,hashlib,os
from pathlib import Path
import edge_tts
base=Path(__file__).resolve().parent.parent
media=Path(os.environ['TITI_MEDIA_REPO'])/'assets/weekly-audio-v1';media.mkdir(parents=True,exist_ok=True)
texts={q['scene'] for f in (base/'van-lang/weekly').glob('*.json') for q in json.loads(f.read_text(encoding='utf8'))['items']}
texts.update(['Oh no! Try again!','Bingo!','Awesome!','Great job!'])
mapping={}
async def main():
 sem=asyncio.Semaphore(5)
 async def job(text):
  name=hashlib.sha256(text.encode()).hexdigest()[:20]+'.mp3';p=media/name
  async with sem:
   for attempt in range(4):
    try:
     if not p.exists() or p.stat().st_size<100:await edge_tts.Communicate(text.replace('___',' … '),'en-US-AnaNeural',rate='-8%').save(str(p))
     mapping[text]='/titi-game-media/assets/weekly-audio-v1/'+name;return
    except Exception:
     if p.exists():p.unlink()
     await asyncio.sleep(attempt+1)
   raise RuntimeError('Audio unavailable: '+text)
 await asyncio.gather(*(job(t) for t in sorted(texts)))
 (base/'van-lang/weekly-audio.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 (base/'van-lang/weekly-audio.js').write_text('window.VanLangAudio='+json.dumps(mapping,ensure_ascii=True,separators=(',',':'))+';\n',encoding='utf8')
 print('Recorded',len(mapping),'native US child clips',flush=True)
asyncio.run(main())
