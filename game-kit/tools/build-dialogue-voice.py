"""Resumable, local recordings. No runtime TTS service or paid API credentials."""
import asyncio, json, pathlib, edge_tts, subprocess, shutil
ROOT = pathlib.Path(__file__).resolve().parents[1] / 'adventures' / 'dialogue-audio'
SOURCE = json.loads((ROOT / 'source.json').read_text(encoding='utf-8'))
async def main():
    sem = asyncio.Semaphore(10)
    failures, completed = [], 0
    async def one(c):
        nonlocal completed
        dest = ROOT / (c['id'] + '.mp3')
        if dest.exists() and dest.stat().st_size > 800: return
        async with sem:
            for attempt in range(5):
                try:
                    temporary = dest.with_suffix('.part')
                    if c.get('ensemble'):
                        import imageio_ffmpeg
                        inputs=[]
                        for i, profile in enumerate(c['ensemble']):
                            track=ROOT/(c['id']+'-voice-'+str(i)+'.tmp.mp3')
                            if not track.exists():
                                await asyncio.wait_for(edge_tts.Communicate(c['text'],profile['voice'],rate=profile['rate'],pitch=profile['pitch']).save(str(track)),70)
                            inputs.extend(['-i',str(track)])
                        process=await asyncio.create_subprocess_exec(imageio_ffmpeg.get_ffmpeg_exe(),'-y','-loglevel','error',*inputs,'-filter_complex','amix=inputs='+str(len(c['ensemble']))+':duration=longest:normalize=1','-f','mp3',str(temporary),stdout=asyncio.subprocess.DEVNULL,stderr=asyncio.subprocess.PIPE)
                        _,err=await process.communicate()
                        if process.returncode: raise RuntimeError(err.decode())
                    else:
                        await asyncio.wait_for(edge_tts.Communicate(c['text'], c['voice'], rate=c['rate'], pitch=c['pitch']).save(str(temporary)), 70)
                    if temporary.stat().st_size < 800: raise ValueError('Empty voice recording')
                    temporary.replace(dest)
                    completed += 1
                    if completed % 40 == 0: print('Recorded', completed, flush=True)
                    return
                except Exception as error:
                    if attempt == 4: failures.append({'id':c['id'],'error':str(error)})
                    else: await asyncio.sleep(2 + attempt * 2)
    await asyncio.gather(*(one(c) for c in SOURCE['clips']))
    report={'expected':len(SOURCE['clips']), 'present':sum((ROOT/(c['id']+'.mp3')).exists() for c in SOURCE['clips']), 'failures':failures}
    (ROOT/'verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report),flush=True)
    if failures: raise SystemExit(1)
asyncio.run(main())
