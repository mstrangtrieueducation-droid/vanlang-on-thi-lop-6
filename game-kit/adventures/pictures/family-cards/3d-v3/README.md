# Family and Friends · 3D artwork v3

Generated with the built-in imagegen tool for MS TRANG TRIEU EDUCATION. The complete prompt set is in `prompts.json`, `test-prompts.json` and `scene-prompts.json`. Original PNG files are retained without lossy recompression.

23 atlases, each 3 columns × 4 rows: 179 book/unit vocabulary cards plus test objects, character variants and contextual scenes. The last cell of sheet 14 is intentionally empty. Browser cropping preserves the actual PNG cell aspect ratio.

`khoa-hoc/program/build-family-art.cjs` generates the semantic registry and browser bundle. `family-art.cjs` replaces vocabulary pictures by original source identity, including picture choice, picture prompt and matching. Test rendering replaces subjects while retaining source positions, quantities, labels, clock hands and tabular data. No answer key or progression ID is changed.

Keep different meanings separate: weather hot/cold versus feelings; birthday cake versus wedding cake; live fish versus food; table versus desk. Avoid placing semantic answer labels in the pupil-facing image.

Validation: all 179 legacy picture keys covered; image dimensions checked; answer keys and classroom gates unchanged; desktop/mobile and native test rendering checked in Edge. Mathematical diagrams remain programmatic for exactness.
