"""Record only the short digital controls/instructions, never replace book audio."""
import sys,json,hashlib,subprocess,asyncio,shutil
from pathlib import Path
import edge_tts
root=Path(__file__).resolve().parents[2]
node=shutil.which('node') or 'node'
books=json.loads(subprocess.check_output([node,'-e',"console.log(JSON.stringify(require('./khoa-hoc/program/textbook-d.cjs').books))"],cwd=root))
out=root/'game-kit/adventures/textbook-d/instructions';out.mkdir(exist_ok=True)
lines=sorted(set(d['instruction'] for b in books.values() for d in b.values())|{'Connect the pictures beginning with J.','Write Jj.'});mapping={}
async def main():
 gate=asyncio.Semaphore(3)
 async def record(text):
  name=hashlib.sha256(text.encode()).hexdigest()[:20]+'.mp3';target=out/name
  if not target.exists():
   async with gate:await edge_tts.Communicate(text,voice='en-US-AnaNeural',rate='-10%').save(str(target))
  mapping[text]='../game-kit/adventures/textbook-d/instructions/'+name
 await asyncio.gather(*(record(t) for t in lines))
 (out/'manifest.json').write_text(json.dumps({'voice':'en-US-AnaNeural','mapping':mapping},indent=2),encoding='utf-8')
 (out.parent/'instructions.js').write_text('(()=>{const old=window.TitiVoice,clips='+json.dumps(mapping)+';window.TitiVoice={...old,lookup(t){return clips[t]||old?.lookup(t);}};})();\n',encoding='utf-8')
 print('Instruction recordings:',len(mapping))
asyncio.run(main())
