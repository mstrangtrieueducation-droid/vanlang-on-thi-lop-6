from pathlib import Path
import asyncio, hashlib, json
import edge_tts
root=Path(__file__).resolve().parent
manifest=json.loads((root/'audio-manifest.json').read_text(encoding='utf-8'))
out=root/'audio'; out.mkdir(exist_ok=True)
async def main():
 mapping={}; sem=asyncio.Semaphore(4); done=0
 async def one(item):
  nonlocal done
  text=item['text']; name=hashlib.sha256(('Jenny|-3|'+text).encode()).hexdigest()[:20]+'.mp3'; target=out/name
  async with sem:
   for attempt in range(4):
    try:
     if not target.exists() or target.stat().st_size<1000:
      await asyncio.wait_for(edge_tts.Communicate(text,'en-US-JennyNeural',rate='-3%',pitch='+0Hz').save(str(target)),50)
     if target.stat().st_size<1000: raise ValueError('Empty audio')
     mapping[item['key']]='../game-kit/adventures/audio/'+name
     done+=1
     if done%50==0: print('Recorded',done,'/',len(manifest),flush=True)
     return
    except Exception:
     if attempt==3: raise
     await asyncio.sleep(2+attempt)
 await asyncio.gather(*(one(item) for item in manifest))
 (root/'audio-map.js').write_text('window.ADVENTURE_AUDIO='+json.dumps(mapping,ensure_ascii=False)+';\n',encoding='utf-8')
 legacy_keys=root/'legacy-audio-keys.json'
 if legacy_keys.exists():
  keys=json.loads(legacy_keys.read_text(encoding='utf-8'))
  legacy_map=root.parent.parent/'tu-luyen-1'/'question-audio.js'
  original=legacy_map.read_text(encoding='utf-8-sig').split('\n// Forest ABCD additions')[0]
  extra={k:mapping[k] for k in keys}
  legacy_map.write_text(original+'\n// Forest ABCD additions\nfor(const [key,file] of Object.entries('+json.dumps(extra,ensure_ascii=False)+')){window.GAME_AUDIO_MAP[key]={...window.GAME_AUDIO_MAP[key],enFile:file};}\n',encoding='utf-8')
 print('Complete:',done,flush=True)
asyncio.run(main())
