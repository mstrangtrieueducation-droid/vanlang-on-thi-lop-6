"""Record an inspected audio-manifest.json. Requires edge-tts==7.3.1."""
from pathlib import Path
import asyncio, hashlib, json, sys
import edge_tts
folder=Path(sys.argv[1]).resolve()
manifest=json.loads((folder/'audio-manifest.json').read_text(encoding='utf-8-sig'))
out=folder/'audio-female-v1';out.mkdir(exist_ok=True)
async def main():
 mapping={};sem=asyncio.Semaphore(3)
 async def record(item):
  text=item['text'];name=hashlib.sha256(('Jenny|-5|'+text).encode()).hexdigest()[:16]+'.mp3';target=out/name
  async with sem:
   for attempt in range(3):
    try:
     if not target.exists() or target.stat().st_size<1000:
      await asyncio.wait_for(edge_tts.Communicate(text,'en-US-JennyNeural',rate='-5%',pitch='+0Hz').save(str(target)),45)
     if target.stat().st_size<1000:raise RuntimeError('Empty recording')
     mapping[item['key']]={'enFile':'audio-female-v1/'+name};return
    except Exception:
     if attempt==2:raise
     await asyncio.sleep(2)
 await asyncio.gather(*(record(item) for item in manifest))
 (folder/'question-audio.js').write_text('Object.assign(window.GAME_AUDIO_MAP,'+json.dumps(mapping,ensure_ascii=False,separators=(',',':'))+');\n',encoding='utf-8')
 print('Recorded',len(mapping),'clips. Listen to ambiguous pronunciations before publishing.')
asyncio.run(main())
