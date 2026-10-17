# Shared vocabulary artwork

Twelve original illustrations generated with the built-in image_gen tool, 17 October 2026. Each original PNG is 1254 × 1254 pixels; no upscaling or lossy export was applied. The exact prompts are in `prompts.json`.

`manifest.json` is the single semantic registry. `khoa-hoc/image-library.cjs` resolves matching vocabulary artwork after all course builders run. It updates picture choices, question pictures and matching pictures using source vocabulary identity, without changing question IDs, answer keys or progress. Contextual examination diagrams are excluded: a generic object must not replace a positional, colour or comparison clue.

The first set covers Phonics 1 Unit 1 (A, B, C). Existing corresponding vocabulary in other courses receives the same approved artwork. Other vocabulary keeps its current illustration until an approved replacement is added to the registry. To extend: add a full-resolution illustration, register its exact semantic key, and run `node khoa-hoc/build.cjs`. Do not patch individual generated questions.

Matching presentation uses `activity-layout.js`: independent columns, no correct same-row pairs, stable persisted layouts, and canonical source indices for grading. Selection markers are distinct from correctness markers.
