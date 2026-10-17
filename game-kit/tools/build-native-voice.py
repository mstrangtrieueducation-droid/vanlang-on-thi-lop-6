"""Build one local, monolingual US child voice. Source question files are never changed."""
from pathlib import Path
import asyncio, hashlib, json, re, sys, shutil
# Install edge-tts in the build environment; it is never loaded by the game.
import edge_tts
ROOT=Path(__file__).resolve().parents[2]
FOLDER=ROOT/'game-kit/adventures/audio-native'
FOLDER.mkdir(exist_ok=True)
VOICE='en-US-AnaNeural'
RATE='+3%'
story_texts=set()
if len(sys.argv)>1:
 raw=json.loads(Path(sys.argv[1]).read_text(encoding='utf8'))
else:
 questions=[]
 for file in ROOT.glob('khoa-hoc/data/*.json'):
  for lesson in json.loads(file.read_text(encoding='utf8'))['lessons']:questions+=lesson['items']
 for file in ROOT.glob('tu-luyen-*/quiz-data.js'):
  if not re.fullmatch(r'tu-luyen-\d+',file.parent.name):continue
  source=file.read_text(encoding='utf8').strip()
  data=json.loads(source[source.index('{'):].rstrip(';'))
  questions+=data['items']
 story_texts={q['storyText'] for q in questions if q.get('storyText')}
 raw=[str(q.get(spoken) or q.get(visible) or '') for q in questions for spoken,visible in [('spokenScene','scene'),('spokenPrompt','prompt')] if q.get(spoken) or q.get(visible)]
raw+=['Oh no…',"It's okay, let's try it again!",'Excellent!','Good try!','Amazing! Your adventure is complete!','Read the clue and choose the correct answer.',"Ready for your next challenge? Let's explore!",'Welcome to Ms. Trang Trieu Education!']
raw+=['Listen and choose the correct answer.']
keys=list(dict.fromkeys(text.strip() for text in raw))
GAP='../game-kit/adventures/audio/gap-cue.wav'
PAUSE='../game-kit/adventures/audio/pause-300.wav'
segments={};mapping={}
def clean(s):
 s=s.replace('’',"'").replace('“','"').replace('”','"').replace('—',', ')
 s=re.sub(r'\s+',' ',s).strip()
 return s
for key in keys:
 # A pause in the printed story is punctuation, not a missing-answer cue.
 # Retain the original lookup key so the textbook text stays unchanged.
 parts=[re.sub(r'\.{2,}|…',', ',key)] if key in story_texts else re.split(r'(_{2,}|\.{2,}|…)',key)
 clips=[]
 for part in parts:
  if re.fullmatch(r'_{2,}|\.{2,}|…',part or ''):
   # Ellipsis in regret is punctuation; a sentence gap gets an audible cue.
   if key in ['Oh no…','Oh no...']:continue
   clips.append(GAP);continue
  text=clean(part)
  if not re.search(r'[A-Za-z0-9]',text):continue
  # Give isolated vocabulary a complete utterance cadence instead of a hanging
  # continuation. Keep the lookup key and the child's answer text unchanged.
  if len(parts)==1 and re.fullmatch(r'[A-Za-z]+(?:-[A-Za-z]+)*',text):text+='.'
  name=hashlib.sha256((VOICE+'|'+RATE+'|'+text).encode()).hexdigest()[:20]+'.mp3'
  segments[name]=text;clips.append('../game-kit/adventures/audio-native/'+name)
 mapping[key]=clips[0] if len(clips)==1 else clips
mapping['titi-try-again']=[mapping['Oh no…'],PAUSE,mapping["It's okay, let's try it again!"]]
(FOLDER/'manifest.json').write_text(json.dumps({'voice':VOICE,'locale':'en-US','rate':RATE,'pitch':'+0Hz','clips':segments},ensure_ascii=False,indent=2),encoding='utf8')
print('Preparing',len(mapping),'spoken keys;',len(segments),'unique recordings.',flush=True)
async def main():
 sem=asyncio.Semaphore(12);completed=0;failed=[]
 async def record(name,text):
  nonlocal completed
  target=FOLDER/name
  async with sem:
   if target.exists() and target.stat().st_size>1000:
    completed+=1;return
   for attempt in range(5):
    try:
     await asyncio.wait_for(edge_tts.Communicate(text,VOICE,rate=RATE,pitch='+0Hz').save(str(target)),45)
     if target.stat().st_size<1000:raise RuntimeError('Empty recording')
     completed+=1
     if completed%50==0:print('Recorded',completed,'/',len(segments),flush=True)
     return
    except Exception as e:
     if attempt==4:failed.append({'name':name,'text':text,'error':type(e).__name__});return
     await asyncio.sleep(3*(attempt+1))
 await asyncio.gather(*(record(name,text) for name,text in segments.items()))
 if failed:
  (FOLDER/'failed.json').write_text(json.dumps(failed,ensure_ascii=False,indent=2),encoding='utf8');raise RuntimeError(str(len(failed))+' recordings failed; rerun resumes successful clips.')
 shutil.copyfile(ROOT/'vu-tru'/mapping['Welcome to Ms. Trang Trieu Education!'],ROOT/'vu-tru/assets/titi-welcome.mp3')
 module='/* One recorded native US child voice for every current course. No system-language fallback. */\n(()=>{const files='+json.dumps(mapping,ensure_ascii=False,separators=(',',':'))+';window.TitiVoice=Object.freeze({id:'+json.dumps(VOICE)+',locale:"en-US",lookup(text){return files[String(text||"" ).trim()]||null;}});})();\n'
 (FOLDER.parent/'native-voice.js').write_text(module,encoding='utf8')
 (FOLDER/'README.md').write_text('# Titi native English voice\n\nVoice: en-US-AnaNeural (female, en-US, Cute / Cartoon). All recordings use this one voice at +3% rate and +0Hz pitch. Source questions remain unchanged. Fill-in gaps use the existing nonverbal gap cue. The engine never falls back to a Vietnamese or device-default voice.\n\nRegenerate with `game-kit/tools/build-native-voice.py` and an extracted list of the current spoken scenes/prompts. The manifest records the exact speech text per file. Existing successful clips are resumed. Publish only when every recording succeeds.\n',encoding='utf8')
 print('DONE:',len(mapping),'keys,',len(segments),'recordings.',flush=True)
asyncio.run(main())
