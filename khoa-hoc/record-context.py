import asyncio,json,hashlib
from pathlib import Path
import edge_tts
base=Path(__file__).resolve().parent.parent;root=base/'game-kit/adventures/context-audio';root.mkdir(exist_ok=True);texts=json.loads((base/'context-voice-texts.json').read_text(encoding='utf-8'));mapping={}
async def main():
 sem=asyncio.Semaphore(5)
 async def job(text):
  name=hashlib.sha256(text.encode()).hexdigest()[:20]+'.mp3';p=root/name
  async with sem:
   for attempt in range(4):
    try:
     if not p.exists():await edge_tts.Communicate(text,'en-US-AnaNeural',rate='+2%').save(str(p))
     mapping[text]='../game-kit/adventures/context-audio/'+name;return
    except Exception:
     if p.exists():p.unlink()
     await asyncio.sleep(2+attempt)
   raise RuntimeError('Audio failed')
 await asyncio.gather(*(job(t) for t in texts));(root/'manifest.json').write_text(json.dumps(mapping,indent=2)+'\n',encoding='utf-8');print('Recorded',len(mapping),flush=True)
asyncio.run(main())
