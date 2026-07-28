# AI decision log

## Input given to AI

- Free tools and hosting only.
- Sara is a full-stack developer who can maintain React, Git, npm dependencies, and deployment configuration; the risk is unnecessary complexity.
- Single-page map: Hero → DG Cement Proof → Work → How I Work → Scope Builder → Contact.
- Display needs: large real screenshots, multi-image galleries, readable case narratives, live-demo/repository links, and occasional embeds.
- Dynamic at launch: client-side scope builder and pre-filled email only. No server persistence.

## AI’s three options

AI proposed plain HTML/CSS/JS, Astro + Tailwind, and Vite + React + Tailwind + Framer Motion, ordered from the smallest maintenance surface to the most interactive control. Each was required to name a free host, backend need, display fit, and failure mode.

## Pushback used before deciding

1. What breaks if the simplest road wins?
2. What recurring maintenance does the most powerful road create?
3. Can the front-runner be finished in two weeks using the content already completed?
4. Does it improve how the proof is shown, or only make the stack sound impressive?
5. Is any server-side behavior actually required at launch?

## Sara’s edits and decision

- Kept plain HTML as a credible option rather than dismissing it as “unprofessional.”
- Kept Astro as the content-first middle road, but rejected a mid-build framework migration.
- Chose React because the repeated case structure and scope-builder state justify components.
- Added the real Vercel 404 as evidence of the maintenance cost; the chosen road is not presented as frictionless.
- Rejected a backend at launch. “Possible later” is not the same as “needed now.”

