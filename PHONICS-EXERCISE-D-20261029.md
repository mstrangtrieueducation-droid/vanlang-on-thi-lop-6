# Phonics: original exercise D

The 92 questions that previously reused generic Review boards now bind to the
actual exercise D for their textbook sound/lesson. There are 72 distinct source
exercises across Oxford Phonics World 1–4. The source bank, quiz IDs, canonical
answer transport keys, 30-question lessons and 45-question reviews are retained.

## Source fidelity and interaction

- Use the original D illustration and task type: listen/write/cross out,
  circle, match, trace/color, unscramble, read/number, draw/write, word search,
  or the actual connect-and-write diagram. No new maze replaces a non-map D.
- Combined `ai/ay` and `oa/ow` lessons use their own D exercises, rather than
  duplicating the preceding single-spelling lesson.
- When an exercise occupies more than one existing quiz slot, allocate its
  original sub-items without overlap. The J diagram's connect and write phases
  occupy separate slots. Visible `Items` labels retain the book sub-item numbers;
  the top question number retains the global quiz number.
- Listen/read chants remain listen/read activities. Reading is explicitly
  self-confirmed after the recording ends; this is completion, not speech
  recognition or a pronunciation assessment. Drawing checks completion/regions
  and written identification, not the artistic quality of the drawing.
- The three Book 2 matching diagrams validate the drawn source/destination pairs
  and their original corridors. Matching uses pointer/touch lines and can be
  changed directly. Writing requires the whole answer, including both cases
  where the source asks for `Aa`, `Cc`, etc.

## Audio and assets

29 original Student Book recordings were selected by the printed disc/track and
checked against their numbered exercise content. `audio-sources.json` retains
Drive source links plus source/delivery hashes. These original recordings are
not replaced by Titi dubbing. 41 short US-English Ana recordings supply the
digital instructions only.

`sources.json` records the source PDF hashes, page numbers and precise image
crops. Full crops are lossless WebP; separate previews and on-demand zoom avoid
downloading every full-resolution illustration on entry. The image buffer only
considers the current question and the next three, retaining at most five
decoded previews. The common background and mascot layers are unchanged.

## Progress and compatibility

Source-D inputs, selections, ink, connections and audio position use a versioned
draft inside the existing question view. Old generic-map ink is not accepted as
a new D response. A corrected retry preserves the original first-wrong score.
Old completed attempts keep their original stored responses and result labels;
they are not retrospectively relabelled as newly performed D exercises.

Missing D runtime assets fail the Phonics entry with the existing retry screen,
rather than silently returning to the old Review-board format. No dashboard
receipt/status, identity, entry-grant or class runtime configuration is changed.

## Verification

Automated coverage includes all 92 bindings, all 72 source exercises, every
projected sub-item allocation, asset hashes, instruction files, complete and
invalid responses, incompatible old drafts, first-wrong retention and legacy
result labels. Browser checks use the actual entry menu, pointer drawing,
typing, reload/resume, original MP3 Play/Pause/progress, zoom and portrait/
landscape phone layouts. Private recordings, renders and diagnostic logs are
excluded from the publication.

This release does not change the four previously documented Family & Friends 2
reading-recording edition exceptions.
