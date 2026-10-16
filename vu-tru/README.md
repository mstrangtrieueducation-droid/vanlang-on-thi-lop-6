# Learning Universe

12 original transparent planet images generated with the built-in image_gen tool. Prompts are in `art-prompts.json`; final project assets are `assets/*.webp` (768 px, alpha retained). Original PNGs remain outside Git. Planets use CSS perspective, gentle rotation and floating motion, not a WebGL globe renderer.

The carousel sets image sources only for the active planet and its two neighbours. Static assets use no runtime API or backend. Controls support pointer swipe, arrows, Home/End, named course buttons, reduced motion and an explicit animation pause. Returning via browser Back resets the zoom transition. The root page opens this route, while existing lesson URLs keep working.

Van Lang opens the established forest journey; the eleven other planets open course-specific maps with visible curriculum coverage. Explicit student profile parameters are preserved across both transitions. No global course unlocking or leaderboard is implied by the decorative planet order.
