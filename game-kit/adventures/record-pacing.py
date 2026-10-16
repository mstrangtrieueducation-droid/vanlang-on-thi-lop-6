"""Static Jenny narration: natural clauses, explicit 150/200 ms pauses, no runtime service."""
from pathlib import Path
import asyncio, hashlib, json, re, subprocess, os, tempfile
import numpy as np
import edge_tts, imageio_ffmpeg

root = Path(__file__).resolve().parent
manifest = json.loads((root/'pacing-manifest.json').read_text(encoding='utf8'))
out = root/'audio-paced'; out.mkdir(exist_ok=True)
cache = Path(tempfile.gettempdir())/'titi-narration-clauses-v1'; cache.mkdir(exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
feedback = {'Excellent!': ('+9%', '+10Hz'), 'Awesome job!': ('+8%', '+10Hz'), 'Oh no…': ('-2%', '-10Hz'), "It's okay, let's try it again!": ('+2%', '+3Hz')}

def parts(text):
    # Keep punctuation with the clause so the neural voice retains question/exclamation contours.
    # Decimal points and abbreviations within words are not sentence boundaries.
    pattern = r'(_{2,}|,(?=\s|$)|[.!?…]+(?=\s|$)|\n+)'
    result=[]; words=''
    for token in re.split(pattern, text):
        if not token: continue
        if re.fullmatch(r'_{2,}',token):
            if words.strip(): result.append((words.strip(),0))
            result.append((None,0)); words=''
        elif re.fullmatch(r',|[.!?…]+|\n+',token):
            words += token if '\n' not in token else '.'
            if re.search(r'[A-Za-z0-9]',words): result.append((words.strip(),150 if token==',' else 200))
            elif result: result[-1]=(result[-1][0],max(result[-1][1],200))
            words=''
        else: words+=token
    if words.strip(): result.append((words.strip(),200))
    elif result: result[-1]=(result[-1][0],max(result[-1][1],200))
    return result

def trim_pcm(raw):
    a=np.frombuffer(raw,dtype='<i2'); hits=np.flatnonzero(np.abs(a.astype(np.int32))>25)
    if not len(hits): raise ValueError('Silent narration')
    # A tiny edge cushion protects final consonants; inserted pauses are exact PCM sample counts.
    return a[max(0,hits[0]-120):min(len(a),hits[-1]+121)].tobytes()

async def main():
    sem=asyncio.Semaphore(4); jobs={}; done=0; mapping={}; audit=[]
    async def clause(text,rate,pitch):
        name=hashlib.sha256(('Jenny|'+rate+'|'+pitch+'|'+text).encode()).hexdigest()[:20]
        target=cache/(name+'.mp3')
        async with sem:
            for attempt in range(4):
                try:
                    if not target.exists() or target.stat().st_size<1000:
                        await asyncio.wait_for(edge_tts.Communicate(text,'en-US-JennyNeural',rate=rate,pitch=pitch).save(str(target)),50)
                    raw=subprocess.run([ffmpeg,'-v','error','-i',str(target),'-f','s16le','-ar','24000','-ac','1','pipe:1'],capture_output=True,check=True).stdout
                    return trim_pcm(raw)
                except Exception:
                    if attempt==3: raise
                    await asyncio.sleep(2+attempt)
    def get(text,rate,pitch):
        key=(text,rate,pitch)
        if key not in jobs: jobs[key]=asyncio.create_task(clause(*key))
        return jobs[key]
    async def record(item):
        nonlocal done
        rate,pitch=feedback.get(item['key'],('+4%','+0Hz'))
        sequence=parts(item['text']); work=[get(t,rate,pitch) if t else None for t,ms in sequence]
        samples=[]
        for (text,ms),job in zip(sequence,work):
            if job: samples.append(await job)
            else:
                # Retain the established non-verbal missing-word cue.
                cue=subprocess.run([ffmpeg,'-v','error','-i',str(root/'audio/gap-cue.wav'),'-f','s16le','-ar','24000','-ac','1','pipe:1'],capture_output=True,check=True).stdout
                samples.append(cue)
            samples.append(bytes(24*ms*2))
        name=hashlib.sha256(('pacing-v1|'+rate+'|'+pitch+'|'+item['text']).encode()).hexdigest()[:20]+'.mp3'
        subprocess.run([ffmpeg,'-y','-v','error','-f','s16le','-ar','24000','-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a','64k',str(out/name)],input=b''.join(samples),capture_output=True,check=True)
        mapping[item['key']]='../game-kit/adventures/audio-paced/'+name
        audit.append({'key':item['key'],'pausesMs':[ms for t,ms in sequence],'rate':rate,'bytes':(out/name).stat().st_size})
        done+=1
        if done%25==0: print('Narration',done,'/',len(manifest),flush=True)
    await asyncio.gather(*(record(item) for item in manifest))
    mapping['titi-try-again']=[mapping['Oh no…'],mapping["It's okay, let's try it again!"]]
    (root/'pacing-audio.js').write_text('Object.assign(window.ADVENTURE_AUDIO,'+json.dumps(mapping,ensure_ascii=False)+');\n',encoding='utf8')
    (root/'pacing-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
    print('Complete:',done,'texts;',len(jobs),'unique clauses',flush=True)

if __name__=='__main__': asyncio.run(main())
