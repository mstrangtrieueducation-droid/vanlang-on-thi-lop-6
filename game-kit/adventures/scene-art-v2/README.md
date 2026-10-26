# Scene art revision 2

Five centre-authored background plates were generated with the built-in image tool, then exported as 1536 × 1024 WebP at quality 93. Generation briefs and the garden prompt are in `prompts.json`. The generated PNG originals remain in the creator's local image library; project runtime assets are the five WebP files here.

The backgrounds contain furniture and architecture. Source-bounded answer objects remain separate interactive elements. `context-scene-layout.js` maps the shelf, drawer, table, basket, chest and character to their visible positions and defines the fitted scale, orientation and foreground lips. It does not change answers or question IDs.

Only the active plate is warmed. A bounded three-plate image cache retains the same DOM image across tasks; the detective foreground masks reuse its URL. Correct objects are graded through the existing quiz ledger before a cancellable collection animation. Automatic navigation waits for that animation and retains the current-question guard. Reduced-motion users receive a short fade.

FF/Discover scene games use the shared Titi-on-Rocket component with answer-completion progress and a text label. Question numbers are in an optional task drawer, not the game status bar. Existing separate local practice storage, first-answer scoring and supplemental reward exclusions remain unchanged.

Phonics revision 2 uses the existing detailed 2D storybook library, the checked peach sprite, smaller varied objects, protected letter/peach silhouettes and irregular foreground overlap. Colour ramps preserve texture; material masks protect foliage, stalks and faces. All 640 question IDs, prompts, answer groups, sound clips and source references are unchanged (canonical content SHA-256 `42f2ec95ec4e0c0f5322eb13dcb2f89605ec735086f843fea4d0d3c6a50e098c`).

Validation: 273 automated tests; desktop, portrait and landscape interaction checks; drag/tap placement; original main-progress retention; resume; Hint; Phonics hotspot selection and audio replay; detective collection animation, wait-for-answer and one network request for the shared plate across questions. Browser checks used Edge device-sized viewports, not a physical-phone 4G benchmark. Audio content was not regenerated in this revision.
