from pathlib import Path
import asyncio, hashlib, json, re, wave, math, struct
import edge_tts
root=Path(__file__).resolve().parent
manifest=json.loads((root/'audio-manifest.json').read_text(encoding='utf-8'))
out=root/'audio'; out.mkdir(exist_ok=True)
# A soft two-note cue and silence mark a missing word; never pronounce underscores.
gap=out/'gap-cue.wav'
with wave.open(str(gap),'wb') as w:
 w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000)
 samples=[]
 for i in range(18000):
  t=i/24000; local=t if t<.12 else t-.16
  tone=(0<=local<.12) and t<.28
  value=.09*math.sin(math.pi*local/.12)*math.sin(2*math.pi*(660 if t<.12 else 880)*local) if tone else 0
  samples.append(struct.pack('<h',int(32767*value)))
 w.writeframes(b''.join(samples))
# Explicit silent clips preserve pedagogical pauses even when audio is paused/resumed.
for milliseconds in (300,500):
 with wave.open(str(out/f'pause-{milliseconds}.wav'),'wb') as w:
  w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000)
  w.writeframes(bytes(24000*milliseconds//1000*2))
sequences={}; expanded={}
for item in manifest:
 if re.search(r'_{2,}',item['text']):
  parts=re.split(r'(_{2,})',item['text']); sequence=[]
  for part in parts:
   if re.fullmatch(r'_{2,}',part): sequence.append(None)
   elif part.strip():
    part=part.strip(); expanded[part]={'key':part,'text':part}; sequence.append(part)
  sequences[item['key']]=sequence
 else: expanded[item['key']]=item
manifest=list(expanded.values())
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
 for key,parts in sequences.items(): mapping[key]=[mapping[part] if part is not None else '../game-kit/adventures/audio/gap-cue.wav' for part in parts]
 pause500='../game-kit/adventures/audio/pause-500.wav'
 keys=json.loads((root/'narration-keys.json').read_text(encoding='utf-8'))+['Read the clue and choose the correct answer.']
 for key in keys:
  if key in mapping:
   clips=mapping[key] if isinstance(mapping[key],list) else [mapping[key]]
   mapping[key]=clips+[pause500]
 mapping['titi-try-again']=[mapping['Oh no…'],'../game-kit/adventures/audio/pause-300.wav',mapping['Let’s try it again!']]
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
