import asyncio,hashlib,json,re,subprocess
from pathlib import Path
import edge_tts
base=Path(__file__).resolve().parent.parent
script="const fs=require('fs'),vm=require('vm');let w={window:{}};vm.runInNewContext(fs.readFileSync('game-kit/adventures/native-voice.js','utf8'),w);let all=[];for(let n=1;n<=20;n++){let s={window:{}};vm.runInNewContext(fs.readFileSync('tu-luyen-'+n+'/quiz-data.js','utf8'),s);all.push(...s.window.ADVENTURE.items)}for(let n=1;n<=4;n++)all.push(...require('./khoa-hoc/data/phonics-'+n+'.json').lessons.flatMap(l=>l.items));const T=require('./game-kit/adventures/task-parts');console.log(JSON.stringify([...new Set(all.flatMap(q=>[q.scene,q.prompt,q.spokenScene,q.spokenPrompt,q.storySentence,T.describe(q).instruction]).filter(t=>t&&!w.window.TitiVoice.lookup(t)))]));"
texts=json.loads(subprocess.check_output(['node','-e',script],cwd=base,text=True,encoding='utf8'))
texts.append('Listen and complete the passage.')
texts=[t for t in texts if re.search(r'[A-Za-z0-9]',t)]
out=base/'game-kit/adventures/flow-audio';out.mkdir(parents=True,exist_ok=True);mapping={};failures=[]
async def main():
 sem=asyncio.Semaphore(5)
 async def job(text):
  name=hashlib.sha256(text.encode()).hexdigest()[:20]+'.mp3';p=out/name
  async with sem:
   for attempt in range(5):
    try:
     if not p.exists() or p.stat().st_size<100:await edge_tts.Communicate(re.sub(r'_{2,}',' … ',text),'en-US-AnaNeural',rate='-8%').save(str(p))
     mapping[text]='../game-kit/adventures/flow-audio/'+name;return
    except Exception:
     if p.exists():p.unlink()
     await asyncio.sleep(attempt+1)
   failures.append(text)
 await asyncio.gather(*(job(t) for t in texts))
 (out/'manifest.json').write_text(json.dumps({'voice':'en-US-AnaNeural','locale':'en-US','clips':mapping},ensure_ascii=False,indent=2),encoding='utf8')
 (out.parent/'flow-audio.js').write_text('window.FlowAudio='+json.dumps(mapping,ensure_ascii=True,separators=(',',':'))+';\n',encoding='utf8')
 print('Native sentence recordings',len(mapping),'requested',len(texts),'failures',len(failures),flush=True)
 if failures:raise RuntimeError(str(failures[:3]))
asyncio.run(main())
