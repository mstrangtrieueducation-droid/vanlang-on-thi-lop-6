# Practice presentation and original reading audio — 29 October 2026

## Changes

- Welcome attempts the existing branded English recording on document entry. A blocked browser autoplay attempt exposes a speaker button; browser autoplay permission cannot be guaranteed by the page.
- Phonics and FF spelling inputs require the complete word, including legacy multiple-choice letter gaps. The input adapter submits the existing canonical key only after the whole word is correct. IDs, original answer keys, scoring transport and historical attempts are unchanged.
- Blend-letter exercises use individually indexed, shuffled letter tiles, including repeated letters. Sound Groups uses three independent pictures and drawn circles, with a specific English sound/spelling rule.
- All 26 uppercase/lowercase Latin stroke guides use consistent numbered, colored directional paths. Existing tracing questions consume the maintained guide set.
- Repeated FF spelling stems within regular lessons/reviews become audio-only whole-word retrieval instead of another shuffled copy. Source passages use explicit evidence order where every question has a reliable anchor. Saved attempt order remains authoritative on resume.
- Number-word tasks say “Write the number word”. Listening writing hides scripts; read/write advances only after an answer is committed. A short unfinished input remains a draft on blur.
- Dictation Play uses the full original Resources track; changing the active blank preserves the same player rather than starting Titi sentence fallbacks.
- Reading Play prioritizes the original Resources recording and cancels secondary question narration. A source Play click starts that source even when Titi was reading a question. Only the current source track loads.

## Original source coverage and limits

- 72 Discover readings, Books 1–4: matched to the disc/track printed beside Read in the supplied Student Books. Original recording performances are retained; mobile delivery is encoded at 128 kbps mono, except one original MP3 retained unchanged to preserve its source timing metadata. Original and delivered SHA-256 hashes are in the source catalog.
- 56 FF Lesson 1/reading recordings: opening content checked against the current lesson, with a separate edition-mismatch audit. Four FF2 readings (Units 3, 11, 13, 14) differ from the available Resources audio and are explicitly unavailable, not replaced by incorrect tracks or a generated reading. The 672 MB iTools Class Book ZIP exceeds the Drive connector's 256 MB raw-download limit.
- Four original Phonics 1 “D Connect, then write” diagrams were extracted without redrawing. Five existing compatible map questions use them without changing their targets or canonical keys. The other 87 questions retain their previous source boards pending the user's choice for sounds whose D section is a different exercise. Not every sound/book contains a D Connect diagram; this release does not claim otherwise.

## Validation and boundary

- 266 automated tests passed, including canonical keys, handwriting, source hashes, map geometry, resume/audio and historical quiz contracts.
- Edge at 390×844: complete-word submission, automatic next, hidden listening transcript, scrambled/repeated letter tiles, drawn circles and original Discover Play passed through normal controls.
- No dashboard receipt readers, Schedule releases, identity/entry protections, canonical homework projections, runtime bindings or dashboard deployment configuration were changed.
- Private source downloads, ASR checks and screenshots remain under private/ and are excluded from publication.
