"""Record the finite, source-checked game scene prompts in the approved manifest."""
import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent / 'game-kit/adventures/unit-scenes-v4'
MANIFEST = json.loads((ROOT / 'audio-manifest.json').read_text(encoding='utf-8'))
OUT = ROOT / 'audio'
OUT.mkdir(exist_ok=True)


async def main():
    semaphore = asyncio.Semaphore(5)
    failures = []

    async def record(key, sentence):
        target = OUT / f'{key}.mp3'
        if target.exists() and target.stat().st_size > 1000:
            return
        async with semaphore:
            for attempt in range(4):
                try:
                    await edge_tts.Communicate(
                        sentence, voice=MANIFEST['voice'], rate=MANIFEST['rate']
                    ).save(str(target))
                    if target.stat().st_size > 1000:
                        return
                except Exception:
                    pass
                target.unlink(missing_ok=True)
                await asyncio.sleep(1 + attempt)
            failures.append(key)

    await asyncio.gather(*(record(k, v) for k, v in MANIFEST['clips'].items()))
    print(json.dumps({'total': len(MANIFEST['clips']), 'failed': failures}))
    if failures:
        raise RuntimeError('Missing approved scene audio')


if __name__ == '__main__':
    asyncio.run(main())
