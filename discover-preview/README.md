# Discover 1–4 — complete practice review build

This is the staff review route. It does not replace pupil classroom permissions or write trial scores to the centre leaderboard.

Open `discover-preview/?review=1&course=discover-1` and switch between Discover 1–4. Each book now contains all 18 Units: 62 Program sessions × 30 questions, plus 18 Unit Reviews × 45 questions. Total: 320 practice levels and 10,680 question instances. The two oral interviews per book remain teacher-assessed.

## Content and source boundaries

- `khoa-hoc/program/discover-resources.json` retains the supplied Program, vocabulary, grammar, reading and Word Study source snapshot for all four books. Source URLs, Unit numbers, Student Book page numbers and book checksums remain attached to the corresponding material.
- `khoa-hoc/discover.cjs` is the common builder. Program titles and session order are preserved. Review checkpoints cover every target word of their Unit, grammar, reading comprehension, listening and Word Study. Vocabulary introduced for the following Unit in a mixed Program session never leaks into the previous Unit's review.
- The question mix includes listen-and-choose pictures, dictation, contextual vocabulary gaps, word/picture matching, sentence building, text order, grammar and reading comprehension. Questions are grouped into Parts by the existing shared engine; an instruction plays once per Part.
- `discover-comprehension.cjs` contains authored comprehension prompts with source evidence. `discover-reading-edit.cjs` restores transcript punctuation and verified transcription errors. `discover-dialogue.cjs` and `discover-transcript-turns.cjs` explicitly identify speakers and narration.
- Case and punctuation exercises use exact choice marking. Typing uses the existing answer normalizer; additional valid answers are declared explicitly (for example, **to / too** as homophones of **two**).
- All practice illustrations come from the inspected local 3D image libraries. No raw PDF page or source scan is embedded in practice.

## Loading, audio and state

The menu downloads a small course catalog. Question payloads load only for the selected lesson from `data/<course>/<lesson>.json`. The remaining 79 lessons are not downloaded to enter one lesson.

`voice.js` extends the existing voice lookup only on the Discover preview page. All instructions, question cues and complete readings have local recordings in one voice, **en-US-AnaNeural**, rate **+3%**. Original pronunciation is retained at normal pitch. Questions remain answerable during playback. The build is resumable and does not publish an incomplete voice registry.

Trial progress is separated by `titi-discover-preview-v2:<course>:<lesson>`. No pupil records are migrated, inferred or unlocked by playing the review version.

## Verification

- `node discover-preview/build.cjs`
- `node --test discover-preview/content.test.cjs discover-preview/audio.test.cjs`
- `node discover-preview/prepare-voice.cjs` then `python discover-preview/build-voice.py` (requires `edge-tts==7.3.1` in the build environment only).
- Browser checks cover all four book menus, first and final Unit levels, 30/45 question counts, matching, dictation, named dialogue, saving/reloading, mobile landscape layout, missing assets and separation from pupil storage.
- The full tracked repository test suite also passes. Desktop browser checks do not certify physical iPhone/Zalo speaker behaviour.

## Original Progress Tests — still separate

Nine original Progress Tests per book are linked from the review menu. Their source data and answer-matcher scripts were compared against the currently published source; the substantive content matches the previous audit. They have not been replaced by generated MCQ approximations.

The new in-game conversion of all 36 tests is **not complete**. It still requires all original input types, original audio/attempt limits, partial-credit grading and inspected replacement artwork (including exact counts, colors and positions). The Program's `assertReady` gate must remain in place until this is complete. No readiness flags are set merely because the practice bank is complete.

Student Dashboard rollout of the session-by-session version is also pending the complete test conversion and teaching-limit/progress migration. Existing pupil routes stay on their current curriculum.
