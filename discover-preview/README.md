# Discover classroom preview

This is an explicitly isolated staff preview, not a replacement of the active pupil curriculum.

Open `discover-preview/?review=1&course=discover-1` and select Discover 1–4.
Each book includes the first three Program sessions (30 questions each) and the Unit 1 checkpoint (45 questions): 16 lessons, 540 question instances.

## Coverage and evidence

- Session titles come verbatim, after whitespace normalization, from `khoa-hoc/program/discover-plan.cjs`.
- `source.json` contains the extracted classroom vocabulary, examples, grammar and reading transcripts. `curated.cjs` contains centre-authored comprehension, grammar and Word Study practice. It does not claim these are official test questions.
- Session 3 includes Unit 2 vocabulary because the Program explicitly introduces it there. The Unit 1 checkpoint excludes that new vocabulary.
- Reading sources: Families, Animal Groups, Having Fun, Bella's Home. The Families captions are attributed to the corresponding families, not invented individual speakers. Bella's quoted thoughts retain their explicit attribution in the narrative.
- The supplied Oxford Discover Student Books, printed page 15, inform Word Study and Writing Study. No PDF or scanned page is served.
- The quiz uses the shared first-attempt scorer, question navigation, review explanations, grouped Parts and single-instruction audio. Dictation accepts case and punctuation normalization.
- Preview saves use `titi-discover-preview-v1:<course>:<lesson>`. There is no cloud script or pupil progress mirroring. Switching books cannot mix saved answers.

## Artwork

Original PNG atlases in `art/animals.png` and `art/space.png`, generated with the built-in image generation tool. Native 1254 × 1254 pixels retained without recompression. CSS cropping uses inspected bounds to prevent adjacent illustrations leaking into an answer. The old downloaded source photographs are not part of the published preview.

Final prompt set: two white-background, four-column/three-row educational sprite atlases with sharp, colorful volumetric 3D rendering, no labels or scans. Animals: feather, wings, eggs, fur, scales, gills, amphibians, mammals, ear, eye, mouth, leg. Space: asteroid, comet, meteorite on the ground, solar system, stars, moon, galaxy, universe, spacecraft, telescope, observatory, astronomer. Astronomer art is not used because the generated costume is an astronaut costume; the singular feather is not used to teach a numerical distinction.

## Rebuild and verify

`node discover-preview/build.cjs`

`node --test discover-preview/content.test.cjs`

`game-kit/tools/build-native-voice.py` includes this preview alongside every existing course. The recordings use the same native English voice as the shared player.

## Still pending

- Unit 2–18 conversion and their review checkpoints across all four books.
- The 36 original Progress Tests: original input types, audio limits, partial scoring and newly rendered artwork must all pass the existing Program readiness contract before activation.
- Pupil teaching-limit/progress migration from the existing grouped lessons to session-by-session levels. The preview must not be used as a substitute for that migration.
- Final teacher content review and real-device audio checks, especially iPhone/Zalo. Automated browser checks cannot certify a physical device's speaker or network playback quality.
