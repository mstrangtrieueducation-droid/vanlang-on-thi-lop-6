# Living scenes and original Phonics maps

Release: `living-scenes-3` / `book-maps-1`.

## Family and Friends

All 30 Unit Review cleanup branches use one persistent world per Unit: 24 movable objects across 20 tasks. The final four tasks each require two ordered actions. Correctly placed objects remain at stable storage positions, including after navigation or resuming a partial task. Five soft 3D environments rotate across the Units: living room, bedroom, kitchen, forest picnic clearing and beach hut.

There are no visible object/destination labels or clue transcripts on the scene. Storage fronts are layered over placed objects to retain depth. Tap placement and pointer drag use the same answer path.

## Discover

All 72 Unit Review detective branches use complete illustrated crowd scenes. Three natural settings contain 20 identifiable actors/activities each. Actors are part of the actual picture; no numbered markers or floating vocabulary stickers are added. Clues combine appearance, activity and a checked relative position. A wrong answer stays on the same task; completing it advances after the native encouragement audio.

Rebuild scene packs/audio indexes with `node khoa-hoc/build-living-scenes.cjs`, then record missing clips with `python game-kit/tools/record-scene-audio.py game-kit/adventures/living-scenes-v3/audio-manifest.json` (build dependency: `edge-tts`).

These are centre-authored supplemental listening/reasoning activities. They are not presented as copied publisher questions or replacements for the original Unit reading practice.

## Phonics 1–4

All 92 existing `soundPath` / `listenMap` questions use 16 complete original Student Book game pages with a drawing overlay. IDs, required words and canonical answer keys remain unchanged. Where an existing question needs a word absent from its Review board, an unedited dictionary illustration from the same book is shown separately below the complete map. These extensions are explicitly identified in the source caption.

Maps open in a dedicated canvas with the existing Titi rocket timer, native question navigation, audio replay and save action. Drawing supports mouse/touch, rounded vector paths, tap-assisted connections, zoom/pan and saved ink. The first view uses a 900px high-quality preview (222–376 KiB); zoom loads the lossless original render. Only the active map is requested.

Source provenance: `game-kit/adventures/textbook-maps/sources.json`. Rebuild with `python game-kit/tools/export-textbook-maps.py PATH_TO_ORIGINAL_BOOKS`, then `node khoa-hoc/build-textbook-maps.cjs`.

## Audio, progress and verification

Scene narration and varied encouragement use local recordings in the same native US child voice, `en-US-AnaNeural`. Part instructions play once; narration waits for an answer. Correct feedback finishes before the next clue. Wrong-answer retries retain the native first-attempt result.

The new worlds use separate `actions-v3` / `detective-v3` practice namespaces. Previous namespaces remain untouched. Main 30-question lessons, 45-question reviews, original tests, student/class gates, dashboard links, cloud ranking rules and native receipt readers are unchanged. Scene placements are presentation state inside the existing saved run, not a second score classifier.

Validation: 256 automated tests; Edge desktop, phone and landscape viewport checks; real touch-event drag; persistent image-node identity; partial two-step resume; wrong-answer resume/retry; original-map drawing, zoom/pan and first-attempt scoring; real MP3 playback/ended events and manual replay. These are browser/device-emulation checks, not a physical-phone or real-4G benchmark. Private QA artifacts are not published.

Image-generation prompts: `game-kit/adventures/living-scenes-v3/creation-prompts.json`. Generated scene plates and crowd illustrations were inspected against their target regions. Source maps and dictionary illustrations were rendered/cropped directly from the provided books, not regenerated.
