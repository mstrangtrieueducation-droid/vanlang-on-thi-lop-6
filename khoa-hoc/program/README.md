# Program source and publication gate

`source.json` is the read-only snapshot of the centre's **PROGRAM** spreadsheet,
not a newly invented syllabus. `parse.cjs` reads its actual classroom sessions.
Family and Friends 1 and 2 share this schedule: Starter, three classroom sessions
per Unit (book lessons 1–2, 3–4 and 5–6), then the Unit review. Written tests follow
Units 1–3, 4–6, 7–9, 10–12 and 13–15, on sessions 12, 23, 35, 46 and 57.

Only the first three written-test rows explicitly specify 15 minutes. A duration
for tests 4 and 5 must be marked as a centre configuration, not quoted as a fact
from this Program. Interviews and projects remain classroom activities.

The source snapshot includes all populated rows of the five relevant tabs.
It is not a live browser connection or an automatic scheduled monitor. Re-read
the original sheet with the connected Drive/Sheets reader before replacing it.
Do not commit credentials, signed download URLs, full answer-key PDFs or student
records. Source PDFs are held outside the public repository.

Every published question must have a verified book/test page reference. OCR is
an extraction aid, not an answer key: check ambiguous words and picture-dependent
answers visually. Never fill a missing source test with invented questions and
label it as the original. The parser rejects a changed Unit/test structure so a
new source cannot silently be attached to the wrong student unlock schedule.

## Family and Friends implementation

Each book has 66 playable entries and 1,590 scored responses:

- Starter: 15 questions on the book's Starter objectives.
- Units 1–15: three lessons of 15 questions, then a 45-question Unit checkpoint.
- Five Progress Tests: 45 source-test responses each, following every three Units.

`family-units`, `family-sounds` and `family-readings` preserve book vocabulary,
Lesson 4 patterns and Lesson 5 reading content. `family-stories` transcribes all
30 Lesson 1 comics in numbered-panel order. Each Unit review includes three
listening gaps and two comprehension questions from that comic, retaining the
Lesson 5 tasks and all five grammar tasks within its 45-question total.
Regular map labels use the Program's paired lessons (1 & 2, 3 & 4, 5 & 6).
Practice prompts and grammar
explanations are authored for the centre, rather than presented as verbatim
publisher questions. Listening uses Titi's narration of the supplied text; it is
not labelled as the publisher's original audio. Pictures come from the supplied
Class Books and retain their original illustration style inside the game cards.

`family-tests` uses clean exercise scans and the supplied centre answer keys.
Each question records its source PDF, page, exercise and item. Matching and
circle-the-word items are adapted to four choices; written items use typing.
Unordered classification blanks are converted to explicit classification tasks
so a valid alternative order cannot be marked wrong. Body-part line matching
uses a highlighted source picture instead of showing the labelled answer.
Tests 4 and 5 use a clearly recorded 15-minute centre default.

Test attempts keep neutral saved/unanswered colours, disable game power-ups and
answer hints, and show correctness and explanations only after submission.
Typing tolerates case, whitespace, commas and final punctuation, plus explicitly
listed contraction alternatives; it does not silently accept spelling errors.
The Worker uses the same checker as the browser. Class access requires all of
the relevant classroom source groups. Test access uses the preceding three
Units' taught sessions, without requiring that a classroom test was already sat.

Build with `node khoa-hoc/build.cjs`, then
`node game-service/leaderboard/build.mjs`. Importing content is read-only; only
the build writes the completed teaching map. Prior FF course data is archived
under `khoa-hoc/legacy/` and old links resolve through aliases. Old results are
not represented as completion of new, larger exercises.
