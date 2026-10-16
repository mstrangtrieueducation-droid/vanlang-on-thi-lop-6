# Classroom game content

Source checked 2026-10-16:
- Guidelines_Bài tập trên lớp: https://docs.google.com/spreadsheets/d/1WzwOpp0APmZKWHbRDb5KFc8rg2g92kdmLcLPcGS1N_w/edit
  - Phonics A1:B57: all listed teaching sound groups; interview assessments and Story texts are not recreated.
  - Family & Friends 1 / Family & Friends 2 A1:B12: Starter and Unit 1, using the linked classroom practice below.
  - Discover 1–4 A1:B12: Unit 1 vocabulary and grammar. New short reading passages apply those topics; they are not the book's original Reading texts.
- GUIDELINES_FIGHTER & IELTS, READING INTENSIVE 3-4-5 A1:C25: https://docs.google.com/spreadsheets/d/1QSSK1LxWniA-hgB2RBE02fM0FeXFEdH6IMjtwkt9EBg/edit#gid=1661579442
  - Fighter currently covers Reading Intensive 3 Units 1–3 topics with original short passages and reasoning questions. It does not cover all Fighter strands or the full Reading 3–5 books.

Checked classroom pages:
- FF1 Starter: https://mstrangtrieueducation-droid.github.io/ssyhmy4/
- FF1 Unit 1 words: https://mstrangtrieueducation-droid.github.io/ymrjqdt/r84qgwn/
- FF2 Starter: https://mstrangtrieueducation-droid.github.io/btxn9se/
- FF2 Unit 1 words: https://mstrangtrieueducation-droid.github.io/zrgefmp/
- Discover 1 words / be: efqb5e2 / gxy5mzk on the same GitHub Pages host.
- Discover 2 words / have-has: cvxzpqp / q5n874e.
- Discover 3 words / -ed and -ing adjectives: q7ejk55 / n4h5v4x.
- Discover 4 words / predictions with will: hvf4ah6 / a7xutkj.

36 games, 357 original questions. Phonics combines two consecutive teaching sound lessons per game (7 / 7 / 8 / 3 games). Family & Friends combines Starter plus vocabulary, with grammar in a second game (2 each). Discover combines Unit 1 vocabulary, grammar and reading into one game per level. Fighter keeps one reading topic per game (3). Question IDs are preserved and legacy lesson progress is migrated when a course opens. These are supplementary games based on the above scope, not a replacement for every classroom task. The scope is visible on each course map. No private class messages, student records or access tokens are copied into the public app.

Edit `content.cjs`, keep stable IDs for published questions, run `node khoa-hoc/build.cjs` then `node --test khoa-hoc/content.test.cjs`. Each course is a separately fetched JSON file; the UI, mascot, effects and timer use the shared game engine. Progress keys are isolated by course, lesson and the existing explicit student profile.

New narration uses the device's English speech synthesis when a shared recorded clip does not exist; the chosen voice varies by device. These recognition and comprehension games do not grade a child's pronunciation. Classroom speaking/recording work remains separate.
