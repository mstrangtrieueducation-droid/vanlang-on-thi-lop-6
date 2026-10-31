# Unit scene release — 30 October 2026

This is a partial content release, not certification that all 114 requested paintings are complete.

## Shipped behavior

- The welcome recording is owned by the world-selection homepage. Entering that homepage starts one playback attempt; selecting another planet does not repeat it. Closing it stops the recording and removes its fallback control. A lesson, Unit menu or roadmap does not start a welcome. Browsers that deny audible autoplay get an explicit welcome control only on the homepage.
- Phonics 4's active roadmap and lesson selection stop at Unit 6. Historical Unit 7–8 data and saved results are retained; other course scopes and the existing identity/gate code remain unchanged.
- All FF command scenes have an external vocabulary strip and a circular completed-object strip. Correctly placed props remain in their recorded positions.
- The new command renderer supports dragging or tap-select/place, pointing to a painted object, coloring only the specified paper cutout, and two-step commands. A fixed scene DOM survives question changes. Touch capture, small-drop tolerance, zoom, viewport fitting and edge scrolling are supported.
- A detective clue can require multiple people. It waits for all requested people before recording completion. Current source coverage is explicit rather than inferred from a scene's title.
- In 22 active Phonics 2–4 Unit scenes, unrelated alphabet glyphs have been replaced by the Unit's actual spellings, including `um`, split digraphs and consonant clusters. The corresponding source word plays twice with a 550 ms pause. The original isolated sound recordings remain available and unchanged.
- Hidden-object narration finishes before praise and automatic advance. The first instruction locks input until it finishes; a failed recording pauses safely. Shared backgrounds stay fixed and only the next few short recordings are warmed.

## Artwork actually completed and measured

| Course / Unit | Scene | Source coverage | Activities |
| --- | --- | --- | --- |
| Phonics 1 / 1 | Forest Storehouse | All 12 Unit words; A/a, B/b, C/c | 20 challenges, including two isolated sound questions |
| Phonics 1 / 2 | Stream Treehouse | All 12 Unit words; D/d, E/e, F/f | 20 challenges; elbow is part of a child leaning on a desk |
| FF1 / 1 | Art Class | All 10 Unit words, with declared primary art vocabulary | 20 commands, including give/place/point/color and compound commands |
| Discover 1 / 1 | New Year Party | All 14 main and additional Unit words | 20 contextual relationship clues, including parents and family groups |

The expanded artwork pass now covers every Phonics 1 and Phonics 2 Unit, Phonics 3 Units 1–7, FF1 Unit 1 and Discover 1 Unit 1: **25 measured scenes** in total. The new illustrations are original built-in imagegen outputs, reviewed before their regions were measured. Delivery files are WebP. Native SVG spelling edits were rasterized separately and retain source hashes in `spelling-sources.json`.

`game-kit/unit-scenes.js` records the exact 114 requested English settings. `game-kit/adventures/unit-scenes-v4/production.json` distinguishes the **25 illustrated-and-measured** settings from the **89 artwork-pending** settings. Existing activities remain available for those pending settings. Their older pictures must not be represented as having passed the new physical-placement, natural-color or complete Discover vocabulary audit. Discover 4 retains its existing configuration because no replacement title list was supplied.

## Maintained files and rebuilding

- Illustration prompts and provenance: `game-kit/adventures/unit-scenes-v4/PROMPTS.md`, `art-sources.json`.
- Measured scene data: `khoa-hoc/program/approved-scenes.cjs`, `approved-hunt-regions.json`, `approved-phonics-scenes.cjs`, `new-year-actors.json`.
- Build approved JSON/audio maps: `node khoa-hoc/build-approved-scenes.cjs`.
- Build native spelling SVGs/data: `node khoa-hoc/build-spelling-scenes.cjs`.
- Rasterize those SVGs using Node, Playwright and Edge: `node game-kit/tools/render-spelling-scenes.cjs http://127.0.0.1:8800`. Intermediate SVGs stay under `private/`; only rendered WebP and hashes are published.
- Record short native-US instructions/words with edge-tts: `python game-kit/tools/record-scene-audio.py game-kit/adventures/unit-scenes-v4/audio-manifest.json`.
- Private browser fixtures/screenshots/logs stay under `private/scene-spec-20261030/`.

No native dashboard receipt reader, Schedule, status/count projection, identity/entry module or dashboard runtime configuration was edited. Main lesson/test banks and their original scoring keys were not regenerated. New scene practice retains its existing unranked/local status; the new scene revisions use separate draft namespaces so older attempts are not overwritten.

## Verification

The release checks cover all 25 measured scenes and the original Phonics exercise-D interactions. Edge browser checks covered homepage entry/return, child-page silence, the 24-level active Phonics 4 map, native touch drag and snap, saved object placement after reload, paper-sun coloring, multi-person clue completion, portrait and landscape layouts, and six rapid correct taps in Stream Treehouse. Those six taps neither skipped a question nor interrupted a word; the shared background was requested once. These are representative browser checks, not certification of the 89 pending scene illustrations.


## 31 October follow-up (scope remains partial)

- Welcome is attempted once per tab session, including same-tab page reload. Browser autoplay policy remains enforced; blocked audio exposes an explicit home-only control.
- Four actual sound-connect maps B/J/R/Z now use new 3D illustrations. Separate pointer strokes snap to straight segments and survive draft serialization; connectivity rejects incomplete/wrong-object routes. No writing inputs appear on these maps. Other exercise-D formats retain their original source format.
- All 52 Latin letter guides were visually checked; lowercase a/d/g/q bowls now join their stems without the previous protruding endpoint.
- Family and Friends has 2,077 rewritten contextual grammar tasks across practice, Unit review and the 30 grammar modules. Exact rendered question/answer sets are unique across this replacement set. This does not certify global uniqueness of every older question in every course.
- All 30 active Phonics Unit panoramas are now illustrated, measured and source-vocabulary checked: Phonics 1–3 Units 1–8 and Phonics 4 Units 1–6. Seven additional WebP panoramas and 66 short voice clips were added in this follow-up.
- Production inventory is now 32/114 measured scenes; 29 FF and 53 Discover illustrations remain pending. The previous generic playable packs are not represented as finished artwork.
- Worker bank updated on helper1, version dba9090c-58a4-4f8d-96f7-599e56e8aff7. A bounded previous-bank archive accepts previously started attempts, without changing identity, score, or rank rules.
- Browser checks: 3D map drawn in separate segments at 390×844, 844×390 and 1366×768; FF pictured exercise and pure listening on phone; Phonics picture-assisted blending; latest cloud-camp panorama in landscape. No page errors in these samples.
- Dashboard native receipt/status/identity modules were not changed.

### Additional illustrated scenes

FF1 Unit 2 Toy Supermarket (20 move-and-place commands), FF1 Unit 3 PE Class (20 body-part instructions), and Discover 1 Unit 2 Pet Shop (20 animal, action and emotion clues) are now measured. The inventory is 35/114; 27 Family and 52 Discover illustrations remain pending. Landscape command scenes place the vocabulary strip beside the scene to preserve usable picture height. A missing scooter now has a dedicated transparent WebP.
