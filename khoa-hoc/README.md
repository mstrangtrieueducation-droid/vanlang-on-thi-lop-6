# Classroom games and adaptive galaxy

Source checked 2026-10-17:
- [Guidelines_Bài tập trên lớp](https://docs.google.com/spreadsheets/d/1WzwOpp0APmZKWHbRDb5KFc8rg2g92kdmLcLPcGS1N_w/edit): Phonics; Family & Friends 1–2; Discover 1–4.
- [GUIDELINES_FIGHTER & IELTS](https://docs.google.com/spreadsheets/d/1QSSK1LxWniA-hgB2RBE02fM0FeXFEdH6IMjtwkt9EBg/edit): Vocabulary Foundation 1–2, Reading Intensive 1–2, Reading Intensive 3–4–5.
- `coverage.json` maps continuation games to the linked classroom vocabulary/grammar pages. Private source downloads, access tokens and textbook passages are not included.

## Coverage

231 classroom games / 2,600 questions, plus the existing 15 Văn Lang games. The 357 previously published classroom questions retain their IDs and exact content.

| Course | Scope | Games |
|---|---|---:|
| Phonics 1 / 2 / 3 / 4 | All teaching sound groups listed in Guidelines; about two sound lessons per game | 7 / 7 / 8 / 3 |
| Family & Friends 1 / 2 | Starter, Units 1–15; consecutive pairs of teaching sessions | 23 / 23 |
| Discover 1 / 2 / 3 / 4 | Units 1–18; vocabulary + grammar sessions within each unit | 18 each |
| Fighter Vocabulary 1 / 2 | Units 1–14 in each book | 14 each |
| Fighter Reading 1 / 2 | Units 1–12 in each book, primary tracks | 12 each |
| Fighter Reading 3 / 4 / 5 | Units 1–12 in each book, optional advanced tracks | 12 each |

These are short supplementary recognition games, not full replicas of every classroom exercise. New units sample key vocabulary, listening recognition, word meaning in short contexts and grammar patterns from the linked classroom work. Vietnamese meanings are used where appropriate, without voicing them as English. Long reading passages, speaking, interview assessments and written compositions remain classroom activities. Reading 3 Units 1–3 retain their earlier original short reading passages and reasoning questions. Device speech synthesis supplies narration when no local recording exists; voices vary by device.

## Build and validation

Edit `content.cjs` / `extension.json`, preserving published question IDs, then run:

```
node khoa-hoc/build.cjs
node --test khoa-hoc/content.test.cjs vu-tru/galaxy.test.cjs game-kit/adventures/learning.test.cjs game-kit/adventures/quiz.test.cjs game-kit/adventures/results.test.cjs game-kit/adventures/validate.test.cjs
```

`build.cjs` also builds the universe registry from the existing course configurations and legacy adventure data. UI supports any number of courses/lessons; no fixed carousel length. To add a course, add its configuration and course JSON, then rebuild the registry.

## Runtime

- `/vu-tru/` reads `course`, `release`, optional `lesson`, `track`, `view=map` and explicit student profile parameters. Navigation preserves release and profile; legacy lesson URLs remain valid.
- The shared portal is branded **Titi Learning Universe · Ms Trang Trieu Education**. Its document title stays consistent when changing courses; the selected course and lesson remain separate headings.
- Three course-selected themes with per-course overrides; SVG archetypes are inferred from lesson titles/index, with a boss at the end. Course menus and constellation positions derive from data. Only the selected course question bank is fetched for UFO bonuses.
- `universe_progress_<courseId>` (plus explicit profile suffix) stores the galaxy progress index, stars, theme, game mode and Stardust. Existing per-lesson saves are retained and read for migration. No central leaderboard or cross-device sync is implied.
- `lesson-bridge.js` mirrors successful question progress and completed-run stars. Stars keep the best completed run. Partial runs do not earn completion stars.
- `gameplay-core.js` chooses energy slots, meteors, letter cipher or signal cards without modifying data. Standard mode is one click away. Both modes call the same `submitAnswer` -> rules -> win/fail -> results path.
- After five completed questions, an optional four-pair circuit bonus uses four already learned questions with distinct answers. It never reveals future answers or affects exam scoring, and pauses the exam timer while open. Closing it resumes the timer. A complete bonus awards 10 course-specific Stardust once per run/checkpoint.
- 50/50: twice/run; Radar: twice/run; Shield: once/run. Counters persist with the attempt. Shield protects Combo once but never erases an incorrect first attempt. Results flag use of power-up assistance. Standard mode hides power-ups, while preserving the existing attempt and elapsed time.
- Keyboard, tap, pointer drag and HTML drag/drop share submission logic. Reduced-motion and motion pause options are supported. Sound requires a user gesture and uses local Web Audio; no new external runtime dependencies.
- `learning.js` interleaves existing vocabulary, listening, grammar, dialogue and reading questions in game mode. Passage-linked questions stay together. No source question, answer, option or ID is changed. A fresh standard run follows source order; switching presentation during a run keeps its current sequence. Attempts save their exact question order and resume position, including short review runs. Legacy attempts still resume in source order.
- Quick review selects at most six weak/due questions within the same lesson and student save. Clean, unassisted recall schedules the next review after 1, 3, 7, then 14 days; mistakes/assistance return the question to the weak queue. This is a local practice reminder, not a notification or cross-device service. Quick review preserves an unfinished main attempt and stores its own `lastReview` result; it cannot overwrite `lastResult` or full-lesson stars.
- Hints target the current skill. After success, **Why?** uses the existing explanation or the original clue/completed sentence, plus a short recall prompt. No generated factual rationale is inferred. UFO questions now stay within the selected track and selected/already-started lessons.

On very small screens, long reading text and the multi-row constellation map scroll within their own panels; the main game controls stay inside the viewport. Native iPhone/Zalo behavior still requires a real-device check.
