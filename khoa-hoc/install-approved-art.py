"""Install owner-approved scene paintings: plates become WebP, the object sheet becomes transparent sprites."""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

SOURCE = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / 'game-kit/adventures/unit-scenes-v4'
PLATES = {
    'phonics-1-unit-1': ('phonics-1-unit-1-sample-v2.png', 'Forest Storehouse v2: hidden targets at three difficulty levels, colour variants, three cats and letters blended into the scenery.'),
    'family-friends-1-unit-1': ('family-friends-1-unit-1-room-sample-v2.png', 'Art Class v2: fully furnished room with teacher, boy and girl with open hands, blank weekday calendar, one basket and one box.'),
}
SPRITES = 'red-book blue-book orange-pencil yellow-pencil pink-pen blue-pen white-rubber pink-rubber yellow-ruler blue-ruler red-bag blue-bag orange-folder purple-folder'.split()


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def plates():
    records = json.loads((OUT / 'art-sources.json').read_text(encoding='utf-8'))
    for name, (file, brief) in PLATES.items():
        source = SOURCE / file
        target = OUT / f'{name}.webp'
        image = Image.open(source).convert('RGB')
        image.save(target, 'WEBP', quality=88, method=6)
        record = next(r for r in records if r['id'] == name)
        record.pop('prompt', None)
        record.pop('webpSha256', None)
        record.update(width=image.width, height=image.height, bytes=target.stat().st_size, sourceSha256=sha(source), webpSha256=sha(target), promptBrief=brief, mode='Built-in imagegen in Codex; owner approved 2026-11-03; reviewed before measuring hotspots')
        print(name, target.stat().st_size)
    (OUT / 'art-sources.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def sprites():
    sheet = Image.open(SOURCE / 'family-friends-1-unit-1-objects-sample.png').convert('RGB')
    width, height = sheet.size
    pixels = np.asarray(sheet).astype(float)
    # Transparency follows how green a pixel is; despill stops edges glowing against the room.
    green = pixels[..., 1] - np.maximum(pixels[..., 0], pixels[..., 2])
    alpha = np.clip((150 - green) / 70, 0, 1)
    pixels[..., 1] = np.minimum(pixels[..., 1], np.maximum(pixels[..., 0], pixels[..., 2]) + 8)
    # The sheet was lit neutrally; warm it towards the sunlit room and soften the saturation.
    pixels *= np.array([1.0, 0.97, 0.9])
    cut = Image.fromarray(np.dstack([np.clip(pixels, 0, 255), alpha * 255]).astype('uint8'), 'RGBA')
    folder = OUT / 'art-class-objects'
    folder.mkdir(exist_ok=True)
    for index, name in enumerate(SPRITES):
        column, row = index % 4, index // 4
        cell = cut.crop((column * width // 4, row * height // 4, (column + 1) * width // 4, (row + 1) * height // 4))
        cell = cell.crop(cell.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox())
        rgb = ImageEnhance.Color(cell.convert('RGB')).enhance(0.9).convert('RGBA')
        rgb.putalpha(cell.getchannel('A'))
        rgb.save(folder / f'{name}.webp', 'WEBP', quality=88, method=6)
    print('sprites', len(SPRITES), sum(p.stat().st_size for p in folder.glob('*.webp')))


if __name__ == '__main__':
    plates()
    sprites()
