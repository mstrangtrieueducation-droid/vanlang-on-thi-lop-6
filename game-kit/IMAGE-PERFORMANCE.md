# Image delivery and stable quiz layers

- `visual-layers.js` keeps one fixed scenery container and one fixed Titi container for an open lesson. Question templates are inert and patched into the existing scaffold. Image nodes and their unchanged URLs survive navigation. The listening dock also survives checks/navigation within the same source passage.
- `image-variants.json` routes every tracked PNG, the 52 discovery plates/atlases and teacher sheets to 849 WebP derivatives in the media repository. Original bytes total 428,659,991; derivatives total 84,871,970 (80.2% less). This is the **whole library**, never a download bundle. Original source art is retained. Question illustration dimensions are unchanged; each teacher pose is at most 500 × 500, preserving three-frame sheets. The timer cutout is also browser-sized.
- `image-warmup.js` loads the current question plus an idle buffer: at question 1, images for 1–3; at question 3, new images for 4–5. It never walks the whole course. Fast jumps cancel obsolete idle work. Save-Data disables future-question warming. Images farther down a continuous sheet have their sources deferred until nearby rows enter the viewport; the shared listening illustration stays mounted.
- A shared promise cache reuses in-flight image loads and caps retained decoded images at 24 entries / 32 MiB. Canvas discovery also retains its small scene LRU. Browser HTTP/GPU caches are browser-managed; `will-change` is limited to the shared visual layers rather than all answer buttons.
- Drafts, first-attempt scoring, question IDs and storage keys are unchanged. Dictation keyboard handlers are replaced rather than accumulated when the same form nodes are updated. The normal Listen button explicitly reads the current question; question navigation does not autoplay it.

## Build

Set `TITI_MEDIA_REPO` to the separate media checkout, then run `python game-kit/build-image-variants.py`. Publish `assets/optimized-images` there before deploying game URLs. Local QA uses `game-kit/image-variants/` working copies. CSS routes use the same-origin media site. No additional game library or paid runtime service is used.

## Validation

208 Node tests pass, including route coverage, image dimensions, cache eviction and the exact 1–3 / 4–5 preload boundary. Browser checks cover ten consecutive question changes with identical scenery/Titi nodes, zero scenery child mutations, portrait/desktop overflow, four scored Fighter transitions and FF–Discover audio/draft/reload flows. Simulated 4G and 4× CPU checks exercise manual Listen and saved answers. First playback can still wait for network/audio buffering; cached playback is faster. These checks do not promise zero latency on every physical phone or network.
