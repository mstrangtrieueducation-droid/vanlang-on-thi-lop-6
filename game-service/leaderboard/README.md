# Titi Games: center results

Worker `titi-games` and D1 `titi-games` belong to the helper1 account pinned in
`wrangler.jsonc`. Static games stay on GitHub Pages. No paid upgrade is required
by this deployment. Credentials are outside this repository.

## Student flow

The existing authorized dashboard hands off the pupil context. The game exchanges
that capability over HTTPS for a one-hour service session. The server independently
reads the existing official class snapshot and computes taught games using the
same classroom source map as the dashboard. It does not accept client `limit`,
score, alias or elapsed time as authority. Current Kids, TA and Fighter sources
are supported; the current catalogue has no IELTS game content.

All 12 current courses / 246 lessons, including 15 Văn Lang games, are generated
from the original public question sources by `node build.mjs`. Rebuild and deploy
this service when adding/changing question content or classroom source mappings.

The client retains original first and last responses. The server recomputes the
score and returns progress to the existing per-student/per-course local saves.
Completed result submissions are idempotent. A disconnected finished submission
is retained in the student's local outbox and retried on their next game opening
or leaderboard visit. A run must start online; results older than two hours cannot
be ranked. Unfinished runs remain on the original device until completed.

Rankings are weekly (Monday, UTC+7), monthly and all-time, taking the best result
per lesson in each period, then elapsed time. Timing uses server wall time from
start, less the 3-second countdown; pauses/network delay are included, unlike the
local practice timer. Hints/power-ups, incomplete rounds and ranked skips do not
enter the board. Local historical results are not silently imported as verified
rankings. Center-wide order is activity recognition by stars, not a comparison of
academic proficiency across different courses. Only English alias and class are
shown, with no parent links, hashes, full names or school grades.

This is practice ranking, not high-stakes anti-cheat: correct answers necessarily
remain available in static game data. No live PVP is implemented by this service.

## Public review

The root site's `/titi-games/` is the owner-requested public staff review entry.
It embeds `/vanlang-on-thi-lop-6/vu-tru/?review=1`. All games are open in that mode,
without login. Anyone possessing the review link can use it. Preview saves use a
separate namespace and cannot submit to the cloud or change pupil records.
Normal dashboard entry continues to enforce the pupil's taught/current textbook.

## Operations

Run `node --test service.test.mjs client.test.mjs` and the shared classroom/game
tests before deployment. Deploy with Wrangler and the dedicated helper1 login;
never replace another account's global configuration. D1 `schema.sql` is additive.
`GET /health` is public; result/profile/board endpoints require a verified session.
CORS permits only the GitHub Pages origin. No per-answer network writes or polling;
boards cache for two minutes. A daily scheduled cleanup removes expired sessions,
runs and rate-limit rows. Back up D1 before any future destructive schema migration.

## Personal journey

`POST /journey` returns only the authenticated pupil's compact run journal.
`journey_runs` is durable and separate from the expiring answer/run table. Apply
`schema.sql`, then `journey-migration.sql` once when upgrading; both are additive
and safe to repeat. The migration retains surviving runs and older best records,
without inventing missing attempts. It never imports local practice into rankings.

The UI deduplicates cloud and local entries using the original client run ID.
Total points sum the highest saved score per lesson across courses; medals use
existing milestone stars. Submitted active practice time is bounded by server
elapsed time and stored only for personal history. Ranking timing and score
verification remain unchanged. Quick reviews and unfinished work stay local.
The staff review has its own journal and never requests pupil cloud history.

## Freely navigable exams

Lesson entry from a milestone starts one three-second countdown. Within a run,
questions can be skipped, revisited and answered in any order. First responses
remain the scoring authority: correcting a mistake never rewrites its first score.
An exam is complete when every question has a nonblank submitted response, even
when some are wrong. Scores still use 10 points per first correct response. A
submission with blanks can be reviewed and saved, but cannot unlock lesson stars
or enter the ranking. Source question files and classroom admission stay unchanged.
