"""Build-time only. Requires edge-tts; takes an audio-manifest.json path. Never loaded by pupils."""
from pathlib import Path
import sys, asyncio, json
ROOT=Path(__file__).resolve().parents[2]
import edge_tts
manifest=Path(sys.argv[1])
data=json.loads(manifest.read_text(encoding='utf8'))
out=manifest.parent/'audio';out.mkdir(exist_ok=True)
async def main():
 sem=asyncio.Semaphore(10);failed=[];done=0
 async def record(key,text):
  nonlocal done
  p=out/(key+'.mp3')
  if p.exists() and p.stat().st_size>1000:return
  async with sem:
   for n in range(5):
    try:
     await asyncio.wait_for(edge_tts.Communicate(text,data['voice'],rate=data['rate']).save(str(p)),55)
     if p.stat().st_size<1000:raise ValueError('empty audio')
     done+=1
     if done%50==0:print('Recorded',done,flush=True)
     return
    except Exception as e:
     if n==4:failed.append([key,str(e)])
     else:await asyncio.sleep(1+n)
 await asyncio.gather(*(record(k,v) for k,v in data['clips'].items()))
 print(json.dumps({'recorded':done,'failed':failed}),flush=True)
 if failed:raise SystemExit(1)
asyncio.run(main())
