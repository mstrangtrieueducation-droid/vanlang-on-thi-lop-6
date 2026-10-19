import asyncio,json,hashlib
from pathlib import Path
import edge_tts
base=Path(__file__).resolve().parent.parent
root=base/'game-kit/adventures/hunt-audio';root.mkdir(exist_ok=True)
texts=sorted({q['prompt'] for p in (base/'khoa-hoc/panorama').glob('*/*.json') for q in json.loads(p.read_text(encoding='utf-8'))['questions']}|{'Great job!','Awesome!'})
mapping={}
async def main():
    sem=asyncio.Semaphore(6)
    async def job(text):
        name=hashlib.sha256(text.encode()).hexdigest()[:20]+'.mp3';p=root/name
        async with sem:
            for attempt in range(4):
                try:
                    if not p.exists() or p.stat().st_size<100: await edge_tts.Communicate(text,'en-US-AnaNeural',rate='+2%').save(str(p))
                    mapping[text]='../game-kit/adventures/hunt-audio/'+name;return
                except Exception as e:
                    if p.exists():p.unlink()
                    await asyncio.sleep(2+attempt)
            print('FAILED',text,flush=True)
    await asyncio.gather(*(job(t) for t in texts))
    (root/'panorama-v2.json').write_text(json.dumps(mapping,indent=2)+'\n',encoding='utf-8')
    print('Recorded',len(mapping),'of',len(texts),flush=True)
    if len(mapping)!=len(texts):raise RuntimeError('Missing clips')
asyncio.run(main())
