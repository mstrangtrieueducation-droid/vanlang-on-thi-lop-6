"""Add Discover recordings without altering the other courses' voice registry."""
from pathlib import Path
import asyncio, hashlib, json, re
import edge_tts
ROOT=Path(__file__).resolve().parent
source=json.loads((ROOT/'voice-source.json').read_text(encoding='utf8'))
out=ROOT/'audio';out.mkdir(exist_ok=True)
voice=source['voice'];rate=source['rate'];stories=set(source['stories'])
segments={};mapping=dict(source['existing'])
for key in source['needed']:
    parts=[re.sub(r'\.{2,}|…',', ',key)] if key in stories else re.split(r'(_{2,}|\.{2,}|…)',key)
    clips=[]
    for part in parts:
        if re.fullmatch(r'_{2,}|\.{2,}|…',part or ''):
            clips.append('../game-kit/adventures/audio/gap-cue.wav');continue
        text=re.sub(r'\s+',' ',part.replace('’',"'").replace('“','"').replace('”','"')).strip()
        if not re.search('[A-Za-z0-9]',text):continue
        if len(parts)==1 and re.fullmatch(r'[A-Za-z]+(?:-[A-Za-z]+)*',text):text+='.'
        name=hashlib.sha256((voice+'|'+rate+'|'+text).encode()).hexdigest()[:20]+'.mp3'
        common=ROOT.parent/'game-kit/adventures/audio-native'/name
        if common.exists() and common.stat().st_size>1000:clips.append('../game-kit/adventures/audio-native/'+name)
        else:segments[name]=text;clips.append('../discover-preview/audio/'+name)
    if not clips:continue
    mapping[key]=clips[0] if len(clips)==1 else clips
async def main():
    sem=asyncio.Semaphore(10);fail=[];done=0
    async def record(name,text):
        nonlocal done
        async with sem:
            target=out/name
            if target.exists() and target.stat().st_size>1000:done+=1;return
            for attempt in range(4):
                try:
                    tmp=out/(name+'.part')
                    await asyncio.wait_for(edge_tts.Communicate(text,voice,rate=rate,pitch='+0Hz').save(str(tmp)),60)
                    if tmp.stat().st_size<1000:raise ValueError('Empty recording')
                    tmp.replace(target);done+=1
                    if done%100==0:print('Recorded',done,'/',len(segments),flush=True)
                    return
                except Exception as e:
                    if attempt==3:fail.append({'name':name,'error':str(e)[:150]})
                    else:await asyncio.sleep(2*(attempt+1))
    print('Need',len(segments),'local clips',flush=True)
    await asyncio.gather(*(record(n,t) for n,t in segments.items()))
    if fail:
        (ROOT/'voice-failed.json').write_text(json.dumps(fail,indent=2),encoding='utf8')
        raise RuntimeError(f'{len(fail)} clips failed; registry unchanged')
    code='/* Discover-only native child voice extension. Other courses stay unchanged. */\n(()=>{const previous=window.TitiVoice;const files='+json.dumps(mapping,ensure_ascii=False,separators=(',',':'))+';window.TitiVoice=Object.freeze({id:'+json.dumps(voice)+',locale:"en-US",lookup(text){return files[String(text||" ").trim()]||previous?.lookup(text)||null;}});})();\n'
    (ROOT/'voice.js').write_text(code,encoding='utf8')
    (out/'manifest.json').write_text(json.dumps({'voice':voice,'rate':rate,'clips':segments},ensure_ascii=False,indent=2),encoding='utf8')
    print('DONE',len(mapping),'utterances',flush=True)
asyncio.run(main())
