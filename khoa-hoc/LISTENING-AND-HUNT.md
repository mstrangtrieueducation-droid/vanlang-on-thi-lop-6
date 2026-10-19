# Classroom listening and Phonics discovery

## What is published

- **102 Unit dictations**: FF1–2 Lesson 6 (15 each), Discover 1–4 Listening (18 each). Original classroom recordings, continuous inline fields, letter-count hints, manual playback, saved drafts and first-attempt scoring.
- **102 Grammar Focus packs**, 20 questions each. Complete contextual sentences, Vietnamese feedback and a progression from controlled practice to reasoning. Discover 3–4 application choices include plausible but unsupported conclusions, rather than obviously silly answers.
- **32 Phonics discovery packs**, 20 challenges each. Every round visits all 20 different settings once. Unit objects and letters are composited directly into the scenery; there are no white picture cards. The same setting collection is reused across Units with different objects and placements.
- Two sound-recognition challenges per Phonics round. A recorded isolated English phoneme plays **twice**, with a 550 ms gap. IPA is never read by TTS. Answers remain responsive; a correct answer waits for both sound models before the praise/next sequence.

## Source and editorial checks

`program/dictation-sources.json` contains the checked transcripts, original Drive audio links, disc/track metadata and SHA-256 of each original recording. FF2 Class Book and Resources use different track numbering after Unit 3; the mapping follows the actual Resources recording and Teacher's Book, not a numerical offset guessed from the other edition. Discover 3 Unit 17 uses the journal recording, not the separate date drill.

Scan/OCR and recognition errors were corrected before creating cloze fields. Names supplied as speaker labels stay visible. Named and unambiguous dialogue turns have explicit labels; unnamed turns use neutral roles. No paper scans are rendered on the exercise screen. The listening guide is Titi; it does not pretend to illustrate a particular scene that has not been redrawn and checked.

The dictation generator blanks content words and Unit keywords while keeping basic sentence anchors, numbering, filler sounds and labelled names visible. The number of fields follows the actual recording, rather than padding it with repeated questions. Contractions count letters without the apostrophe; accented names count real letters and accept an unaccented keyboard form.

## Media and image generation

Original MP3s and full-resolution PNGs are in [titi-game-media](https://github.com/mstrangtrieueducation-droid/titi-game-media), served on the same GitHub Pages origin. `game-kit/adventures/media-manifest.json` records every asset's size and digest. Keeping media separate avoids adding hundreds of MB to the game source site; [GitHub's site-size limit](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) applies separately to each site. Images and classroom recordings were not blurred, resized or re-encoded for this release.

**Image generation mode: Built-in.** The 20 scene plates and 32 transparent object atlases, together with every generation prompt and cell specification, are recorded in [`hunt-worlds/sources.json`](../game-kit/adventures/hunt-worlds/sources.json). The PNG assets are under `assets/hunt-worlds/scenes/` and `assets/hunt-worlds/objects/` in the media repository. The Canvas decoder separates alpha components to prevent atlas-cell overflow from clipping an object or showing a neighbouring object.

Phoneme recordings are credited to [University of Hamburg · English Explorations](https://englishexplorations.check.uni-hamburg.de/basic-concepts-of-english-phonetics-and-pronunciation/); individual sources and crop boundaries are recorded in `hunt-worlds/phonemes/sources.json`. Each demonstration's first isolated sound is extracted **before** the vocabulary examples, at its original sample rate and pitch, into a lossless PCM WAV. Titi's instructions use the existing native `en-US-AnaNeural` voice. There are no paid runtime APIs, new third-party game libraries or browser-side AI generation.

## Build and progress safety

Run `node khoa-hoc/build-grammar.cjs`, `node khoa-hoc/build-dictation.cjs`, `node khoa-hoc/build-hunt-worlds.cjs` and `node khoa-hoc/build-context-view.cjs` after editing reviewed source records. The TTS recording scripts are build tools; generated audio must also be committed to the media repository before publishing URLs in the main repository.

The shared scorer handles dictation fields. Checking a partially completed sheet skips untouched fields. Drafts are saved separately from scored answers. Grammar and dictation are supplemental practice and do not replace the Unit Review's official stars or inflate the centre leaderboard. Storage suffixes are `:grammar-context-v2`, `:dictation-v1` and `:hunt-worlds-v3`; old records are not deleted. The context view enriches 29 known short-form models without changing their source IDs, options or answer keys. Original exam records stay intact.

Local media working copies may be placed under `game-kit/adventures/`; `GameMedia.url` maps the production media paths there for localhost QA. The main repository stores the small manifests and data packs; the media repository stores the image/audio bytes.
