# Phonics sound journey — version 2

| Course | Sound/spelling stops | Unit reviews | Total stops |
|---|---:|---:|---:|
| Phonics 1 | 26 | 9 | 35 |
| Phonics 2 | 25 | 9 | 34 |
| Phonics 3 | 26 | 9 | 35 |
| Phonics 4 | 32 | 11 | 43 |

`phonics-plan.cjs` follows the existing classroom Guidelines sequence. Each row
has one spelling focus, two example words, and the original classroom source
lesson number. A spelling family may share a vowel sound with another family.
Phonics 4 separates voiced and unvoiced th. Whole words are recorded; letter
names from a generic synthesizer are never presented as isolated phoneme audio.

Each sound stop has five short tasks: listening identification (pictures where
unambiguous art exists), letter-pattern recognition, a matching sound/rhyme/letter
word, listening to the second example, and completing a word. Review follows
every three stops. A final group of one or two sounds has its own shorter review;
no invented classroom sounds are added merely to fill a group.

Each review retrieves all its sounds before a linked listening story. The 38
stories in `phonics-stories.cjs` are original centre-authored supplements, **not
textbook quotations or official textbook recordings**. Brackets identify cloze
targets in the source; the UI shows one gap per question, with four options.
Listen replays the complete story. Answers are available while audio plays.
All questions keep the existing choice scoring/first-answer/review pipeline.

Pictures are four local transparent 4×4 sprite sheets; CSS selects one cell without
lossy recompression or separate image downloads for each option. Written answers
are hidden until review. Each card retains a descriptive accessible name.
The native `en-US-AnaNeural` pack covers every story, word and question prompt.

## Access and historical progress

`legacy/` retains the previous four course data files and exact teaching evidence.
The builder derives the new teaching map from those source sessions. If two
classroom sessions practise the same pattern, either matching session supplies
that pattern; a review needs evidence for **every** pattern in its group.
Normal minimum-one-star prerequisites still apply. New sound IDs do not inherit
unearned completion from the older, much shorter grouped quizzes. Old storage and
cloud history are retained; old `game-N` and source-lesson links resolve through
explicit `legacyAliases`. Fresh dashboard entry grants only the current book's
taught sound stops. Public staff review remains separate from student ranking.

Build: `node khoa-hoc/build.cjs`, then `node game-service/leaderboard/build.mjs`.
Rebuild the native voice pack before publishing new spoken text. Deploy the Worker
curriculum as well as GitHub Pages. `phonics.test.cjs` verifies grouping, evidence,
checkpoint prerequisites, unique grading values, story-only reviews and pictures.
