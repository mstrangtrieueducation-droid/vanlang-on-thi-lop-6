# World hub and clay illustrations

The opening hub preloads its background and the selected course's three visible worlds directly from the document head. It displays a loading skeleton while images decode. The hidden roadmap is initialized only when needed, avoiding full-resolution landscape downloads behind the carousel. Course queries, classroom limits and progress storage retain their existing behavior.

`vu-tru/build-hub-assets.py` creates 12 WebP globe derivatives at quality 85. Dimensions decrease from 600 pixels until each file is under 80,000 bytes; the current derivatives are 384 or 408 pixels. Original high-resolution artwork is preserved. `vu-tru/hub-assets.json` records exact dimensions and sizes. `vu-tru/install-hub-boot.cjs` installs the initial head configuration.

## Teaching pictures

`clay-art.json` indexes 552 transparent 300×300 WebP teaching pictures. They cover 5,760 existing Phonics and Family and Friends picture references through semantic mappings, without changing question data. `clay-art.js` installs the shared runtime mapping; the existing rolling image buffer still loads only the current and nearby questions.

Artwork uses built-in image generation: 28 newly generated sheets/single assets plus 32 previously generated transparent source sheets. Full prompts and original asset references are saved in `clay-art-sources.json`. Source PNGs and the derived WebP files live in the separate `titi-game-media` repository. They are not textbook scan crops.

Ambiguous vocabulary is checked against its original lesson sense: die is a dice cube, club a clubhouse, bow a fabric ribbon, line a queue, pit a peach stone, and pin a safety pin. Near/far demonstratives and food/live fish have distinct illustrations.

Set `TITI_MEDIA_REPO` to the local media checkout and run `game-kit/build-clay-art.py` with Python, Pillow, NumPy and OpenCV. It reads published provenance when private generation output paths are absent. `game-kit/audit-clay-art.py` verifies the actual decoded dimensions, alpha and file hashes. `clay-hub.test.cjs` checks coverage, semantic sources, preload selection and globe budgets.

The review gallery is `khoa-hoc/ff-art.html`. It loads the same transparent sprites used by lessons, rather than a separate preview-only art set.
