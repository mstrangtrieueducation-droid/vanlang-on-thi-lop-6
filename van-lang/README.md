# Weekly review branches and narration

Weeks 1–12 have two branches: Grammar Focus and Practice. Grammar has a short formula/usage summary, translated examples and twelve contextual applications per week. `sources/week-N.json` contains the readable text and metadata fetched from the centre's actual linked Resources document; `weekly/week-N.json` is built by `node van-lang/build-weekly.cjs`. Questions are centre-authored applications, not falsely attributed as verbatim source exercises.

Routing uses the source week (`tu-luyen-1` through `tu-luyen-12`), rather than roadmap position: the existing map interleaves three cumulative review milestones. Those review milestones (`tu-luyen-13` through `tu-luyen-15`) and future source weeks after 12 go straight into practice. A stale `section=grammar` URL cannot restore a hidden grammar branch. Classroom admission is checked before either branch.

Grammar attempts use a separate `:vl-grammar-v1` save suffix and are supplemental. They cannot overwrite the existing lesson's stars or enter the class leaderboard as a main test. Practice retains the existing question bank, answer keys, first-attempt scoring, local/cloud progress and question-by-question result review.

Only Văn Lang restores automatic question narration. The shared task classifier treats recurring generic question directions as a Part instruction. Directions play once per task key in a run; subsequent questions narrate content only. Replay is explicit. Other programmes retain their manual question speakers, with the intentional Hidden Object Listening exception. Narration never locks answer buttons.

`record-weekly.py` records the newly authored grammar sentences with native US Ana voice at -8%; gaps are silent pauses, not spoken “blank” or “underscore”. Source keys are unchanged. Generated MP3s live in the separate media repository, and the browser only requests played clips.

# Phonics storybook scenes

`khoa-hoc/build-hunt-worlds.cjs` preserves curriculum sound mappings and target groups, then invokes `build-storybook.cjs`. All twenty prompts in a Unit share the exact same scene URL and object coordinates. There are 32 Unit illustrations and ten distinct settings, with Unit-specific object/letter composition.

Artwork uses built-in image generation: eleven transparent sheets covering 161 2D illustrated nouns, plus ten illustrated backgrounds. `khoa-hoc/storybook-art-sources.json` and `storybook-backgrounds.json` preserve the complete prompts and original file references. The original PNGs and derived assets are saved under `assets/storybook-v1/` in the media checkout. `build-storybook-art.py` and `build-storybook-backgrounds.py` reproduce the optimised assets from those saved originals; set `TITI_MEDIA_REPO` to that checkout.

Each final scene is a self-contained SVG: illustrated background and noun images are embedded once; letters remain exact vector text. Foreground masks restore the actual scenery over part of each target. Hotspots cover the remaining visible portion. No white cards, separately fetched object tiles or changing per-question backgrounds are used. The canvas is painted once and stays mounted while prompts change. Existing `:hunt-worlds-v4` saves are retained because question IDs, targets and scoring are unchanged by the visual update.

Native US hidden-object prompts play at 90% speed with pitch preserved. Sound-recognition tasks still play the isolated curriculum phoneme twice. Correct answers produce chimes and spoken praise before the next prompt; incorrect answers receive a spoken retry and retain first-attempt error accounting.

# Music

`game-kit/epic-score.js` contains an original Web Audio instrumental score: Intro (8 bars), Chorus (16), Bridge (8), Outro (8, accelerating). Melody, bass, harmony and light percussion vary by section. It starts after a user gesture, has a separate music toggle, ducks under narration, and stops its scheduler and active voices when hidden. No external audio files or heavyweight library are required. Mobile controls use a compact header without squeezing the brand into a vertical column.
