# Classroom-bound game entry

The shared adapter in the root Pages repository now covers all 43 current private KIDS, TA, Fighter and IELTS dashboards. `StudentContext.ROUTES` binds each class to its canonical return route. Existing dashboard authentication and official academic scores are unchanged.

The authorized dashboard derives exact `allowed[courseId]` lesson-ID sets from completed classroom sessions and `vu-tru/teaching-map.json`. Every required source group must be present. Grouping follows the actual curriculum (usually two teaching sessions per game), excluding assessments. A later matched lesson never grants all earlier lessons or another Fighter book. Manual numeric ceilings may restrict evidence but cannot grant untaught material.

TA mapping uses the classroom explanation, one session after the read-ahead theory assignment in Guidelines. Cumulative reviews require all their underlying theory weeks. Saturday self-study release dates are not proof that classroom content has been taught. IELTS currently has no corresponding game course and remains closed.

Clicking from the matching dashboard issues a one-use, two-minute `entry` handoff. The game consumes it and replaces it with a tab-local `visit`. Cached context or a copied URL alone cannot start gameplay. A new tab without that visit is locked. In-game navigation/reload work during the admitted visit. Context and visit expire after 24 hours; storage failures and missing identity/evidence fail closed. Query `limit`, `course`, `focus`, or names cannot increase classroom eligibility.

`course`, `release`, `student`, `limit`, and `focus` remain supported navigation parameters. `limit` is the last eligible catalogue ordinal for compatibility; exact IDs are the authoritative classroom restriction. `focus` targets the next unfinished eligible lesson, or the last eligible one for a three-star replay. A one-star prerequisite applies only among taught lessons in the same book track.

Local progress remains `universe_progress_<courseId>:student:<student>` and is mirrored through the original score/reward APIs. The dashboard refreshes on return and shows game rewards separately from school grades. Parent return links use the class-specific dashboard, not a fixed KIDS21 route.

This is browser-local navigation control on static GitHub Pages. It does not provide cryptographic server authorization against edited storage/source, make public question assets confidential, or synchronize scores between devices. Do not publish private profile links. Game entry pages use `no-referrer`.

Validation: `node --test game-kit/student-context.test.cjs` plus the existing learning, galaxy, content, results, quiz and validation suites. The root Pages repo's `student-learning/titi-games/dashboard.test.cjs` compiles all 43 private pages and executes their actual identity callbacks/snapshot hooks with synthetic identities.
