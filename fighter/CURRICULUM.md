# Fighter question bank

`source-snapshot.json` contains the lesson data fetched from the 88 Guidelines-linked web Units (Vocabulary Foundation 1–2 and Reading 1–5). `guidelines-audit.json` records the five Guidelines tabs and 24 supplementary test-document URLs. Supplementary test passages are labelled as test passages, not as the textbook's main Reading A/B.

Run `node fighter/build.cjs` from the repository root to rebuild `data.js` and `source-audit.json`. The browser only loads `data.js`; it does not fetch the source archive or contact Google Docs. Repeated word objects are referenced by ID in the shipped bank and hydrated once on load.

## Question authoring rules

- Word Family: blank a source example, use at least three distinct same-root forms actually present in that source row. The reviewed root allowlist filters synonyms/antonyms out; it never supplies missing forms.
- Collocation cloze: blank an attested particle/preposition or a reviewed lexical collocation. Exclude alternative prepositions declared in the source pattern.
- Collocation Magnet: assemble a source collocation from individual tiles, including distinct tile IDs when a word occurs twice. Source patterns such as `seem (v) to V` may supply `seem to`.
- Reading Clue Hunter: select the exact character span in a two/three-sentence source excerpt. Preserve natural inline sentences and source attribution.
- Vocabulary in Context: select the target word in its original example, explicitly labelled as an example rather than a reading passage.
- `authored-contexts.json` contains separately labelled practice contexts composed from a Unit's vocabulary when no original passage was extracted. These are not presented as quotations from the textbook.

Fields absent from the original source remain `null`/empty and are listed in `source-audit.json`. In particular, do not invent IPA or word families just to reach a fixed option count. A row may support some task types but not others. All source rows remain available in Word Vault.

## Learning and scoring

Unit Training samples 15 tasks, varying eligible mechanisms and avoiding repeated words where possible. Arena has six current-Unit tasks and four earlier tasks from the same taught book; the first available Unit uses ten current tasks. Previously missed task IDs take priority. No future Unit enters either pool.

Checkpoint has 15 tasks and a three-minute deadline. Twelve correct first attempts earn Mastered and unlock the next taught Unit; a training score alone does not unlock it. Classroom eligibility is evaluated before this progression rule. Staff preview has its own storage and never admits a pupil to an untaught lesson.

One mistake allows a practice retry, but a corrected answer does not receive first-try points. Two mistakes on a word enter Word Vault. A successful first attempt during rescue removes that word from the rescue list. Review explanations remain visible until Next in practice; Checkpoint advances automatically while its clock continues.

Stored run schema is version 3. Old unfinished runs are not resumed with new task schemas; existing total points and historical records are preserved. The new checkpoint flag is separate from historical stars.

## Validation

`node --test fighter/core.test.cjs fighter/academic.test.cjs`

Tests cover source row count, original cloze reconstruction, same-root options, exact excerpt spans/provenance, collocation tiles, 60/40 sampling, mistake priority, scoring, checkpoint expiry, and classroom-limited unlocking. Browser QA covers touch-size layouts at 390×844 and 844×390 plus desktop, tapping/selection, all task types, feedback, and result review.
