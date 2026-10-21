"""Build time recordings only. Browsers load static MP3, never an external TTS API."""
import asyncio,json,pathlib,edge_tts
folder=pathlib.Path(__file__).resolve().parents[1]/'adventures'/'classroom-audio'
manifest=json.loads((folder/'manifest.json').read_text(encoding='utf8'))
async def main():
    sem=asyncio.Semaphore(8)
    failures=[]
    done=0
    async def record(key,text):
        nonlocal done
        target=folder/(key+'.mp3')
        if target.exists() and target.stat().st_size>800:return
        async with sem:
            for attempt in range(5):
                try:
                    temporary=target.with_suffix('.part')
                    await asyncio.wait_for(edge_tts.Communicate(text,manifest['voice'],rate=manifest['rate']).save(str(temporary)),70)
                    if temporary.stat().st_size<800:raise ValueError('Incomplete recording')
                    temporary.replace(target)
                    done+=1
                    if done%100==0:print('Recorded',done,flush=True)
                    return
                except Exception as error:
                    if attempt==4:failures.append({'id':key,'error':str(error)})
                    else:await asyncio.sleep(attempt*2+2)
    await asyncio.gather(*(record(k,t) for k,t in manifest['clips'].items()))
    report={'expected':len(manifest['clips']),'present':sum((folder/(k+'.mp3')).exists() for k in manifest['clips']),'failures':failures}
    (folder/'verification.json').write_text(json.dumps(report,indent=2),encoding='utf8')
    print(json.dumps(report),flush=True)
    if failures:raise RuntimeError('Question recording incomplete')
asyncio.run(main())
