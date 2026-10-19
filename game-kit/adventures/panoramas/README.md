# Phonics Picture Explorer

32 original panoramic illustrations, one for each Unit in Phonics 1–4. The artwork was recreated from the Unit vocabulary; it is not a reproduction of the textbook Review pages. Full-resolution PNG originals are retained. Generation prompts and visual-review notes are in `sources.json`.

`profiles.json` is the content source: vocabulary, letter pairs, visible colours, omitted objects and percentage-based hotspot coordinates. Coordinates must be checked against the final illustration. Missing objects must be marked absent; the generator must never invent an invisible target or an incorrect count.

From the repository root:

```sh
node khoa-hoc/build-panorama.cjs
python khoa-hoc/record-panorama.py
node --test panorama-hunt.test.cjs
```

Audio generation requires `edge-tts` during authoring only. The game uses local MP3 recordings of `en-US-AnaNeural`; no runtime TTS service or image service is required. The audio manifest contains only commands and praise used by this version. Runtime audio is unlocked by the initial Play gesture and automatically sequences praise, then the next command. Other exercise types keep their manual-audio policy.

Each round contains 20 challenges. Matching all target groups completes a challenge; two objects of the wrong colour cannot satisfy a mixed-colour request. The illustration and camera remain mounted between questions. On phones, zoom and pan keep targets usable. Backgrounding pauses audio and the practice clock; a saved completed answer advances once after resuming.

Practice progress uses the existing student/course/lesson storage namespace plus `:hunt-panorama-v2`. It does not overwrite the main Unit Review score, legacy hunt results, lesson stars or cloud rankings. The existing student gate runs before the module opens.
