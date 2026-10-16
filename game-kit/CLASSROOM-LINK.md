# Dashboard classroom handoff

`/rge9fi0s/` supplies `course`, `limit` (planet count), `focus` (one-based), and `student` (the dashboard's existing 22-character token). `release` survives navigation. Context is retained in `vl_active_student_context` and `vl_student_context_<student>`; limits are stored separately for each course.

Game state uses the existing key plus `:student:<student>`. The cross-page index is `universe_progress_<course>:student:<student>`. Existing anonymous/name-based records remain untouched. A different student never inherits them automatically. A student's first handoff therefore starts a separate, identified game record.

The dashboard reads only its currently authorized profile and completed classroom sessions. `classroom-progress.js` matches their published teaching links against `vu-tru/teaching-map.json` (Phonics, Family and Friends, Discover and Fighter). Every required source group must be represented before its game counts as taught. Interview/test sessions do not become extra Phonics games. The public mapping contains curriculum URLs only, no student records. Update this mapping when curriculum routes or game grouping change.

An optional authoritative dashboard field `gameUnlocks: {"course-id": 3}` overrides automatic mapping for a course, including explicit zero. This is a planet count, not a raw class-session count. Unmapped content stays closed; no schedule counters are guessed. Van Lang can use this explicit boundary or the supplied URL boundary.

The portal and direct lesson entry both enforce the boundary and one-star prerequisites. At `completed == limit`, the dashboard sends `focus=completed+1` as specified; the portal clamps that target to the last open planet for a three-star replay. Completion and Stardust still come from the original scoring/reward APIs.

The dashboard refreshes on return, focus, profile changes and storage events. This is browser-local synchronization on the shared GitHub Pages origin, not cross-device storage or server-enforced access control. Clearing browser data resets local game progress. These gates guide classroom practice; they are not an authorization boundary. Dashboard authentication is unchanged. URLs containing the profile token must not be posted publicly; game entry pages use `no-referrer`.

Validation: `node --test game-kit/student-context.test.cjs`; existing game tests verify scoring, original question values and all 246 lesson routes. Dashboard adapter tests live beside `/rge9fi0s/` in the root GitHub Pages repository.
