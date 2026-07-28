# Three Roads: Choose Your Stack with AI — Sara Arif

**Track:** General AI Fluency · **Week:** 4 · **Phase:** Build

## My four constraints

1. **Free only.** The builder, repository, hosting, fonts, and deployment must work on free tiers.
2. **Honest skill level.** I am not a beginner developer. I build full-stack systems and can maintain React, Git, package dependencies, and deployment configuration. My risk is over-engineering, not being unable to code.
3. **What the portfolio must do.** It is one scrolling page: Hero → DG Cement proof → Selected Work → How I Work → Scope Builder → Contact. Every CTA leads toward one action: email me a scoped project inquiry.
4. **How the work must be shown.** Large real screenshots, multi-image project galleries, readable case-study copy, GitHub/live-demo links, and space for an embedded demo where the source permits it.

**Dynamic at launch?** Not on the server. The scope builder can assemble a pre-filled email in the browser. There is no account, database, CMS, or stored form submission yet. A real backend belongs only when a later assignment proves it is necessary.

## The three roads

| Road | How I would build | Free host | Backend now? | What it handles well | Real trade-off |
|---|---|---|---|---|---|
| **1 · Plain HTML, CSS, and JavaScript** | One `index.html`, one stylesheet, small JavaScript modules for the gallery and scope builder | GitHub Pages | **No** | Fast, transparent, almost nothing to update, and enough for screenshots, case copy, links, and `mailto:` | Repeated case markup becomes manual. Shared layouts and interactive state get harder to change consistently as seven cases grow. |
| **2 · Astro + Tailwind** | Content-first Astro pages/components, data files for cases, client islands only for the gallery and scope builder | Cloudflare Pages or Vercel | **No** | Strong fit for long-form case studies, fast static output, and little client JavaScript | It introduces a framework I do not already use in this project. Migrating the live shell and learning Astro conventions consumes time without improving the evidence itself. |
| **3 · Vite + React + Tailwind + Framer Motion** | Reusable React components and case data; Tailwind for the locked identity system; restrained Framer Motion; vinext/Nitro only as Vite’s Vercel adapter | Vercel | **No** | Best control over responsive galleries, repeatable case cards, expandable proof, the scope-builder state, and future additions | More packages and build configuration to maintain. The first Vercel attempt returned 404 until Nitro and the correct output path were configured. |

## Pressure-test of the front-runner

### What breaks if I pick the simplest?

Nothing essential breaks on day one. Plain HTML can ship the claim, DG Cement proof, galleries, links, and a `mailto:` inquiry. The cost appears during change: seven project cards repeat the same structure, gallery behavior must be wired by hand, and one design adjustment has to stay consistent across copied markup. The simplest road can finish; it is less forgiving when the portfolio keeps growing.

### What do I maintain if I pick the most powerful?

I maintain React components, case data, Tailwind classes, animation boundaries, npm dependencies, the GitHub repository, and the Vite/vinext/Nitro deployment path. That cost is real. We already saw it when a valid local build produced a Vercel 404 because the host adapter was incomplete. The fix is now documented and the public URL works, but future dependency upgrades need deliberate testing.

### Can I finish in two weeks?

Yes, if I keep the framework on a short leash. The identity kit, eight case narratives, image map, section order, and CTA ladder already exist. The Week 4 shell is live. Build week is component assembly and responsive verification—not a redesign, CMS build, authentication system, or custom backend.

### Does it show my work the way it needs to be shown?

Yes. React fits the repeated case structure and scope-builder interaction. CSS Grid and responsive image containers handle real screenshots. Expanded case panels can hold readable long-form proof, while live demos and repositories remain explicit links or embeds. Framer Motion is limited to orientation and feedback; it does not become the memorable part of the portfolio.

## My decision

I chose **Vite + React + Tailwind CSS + Framer Motion, hosted on Vercel**. Vinext and Nitro are deployment adapters for the current Vite build, not an excuse to add server features.

I did not choose plain HTML because I would be maintaining repeated project markup just as the portfolio expands from one proof case to seven supporting cases. I did not choose Astro because its content-first model is sensible, but changing frameworks now would spend the build window on migration instead of showing the work.

**Can I maintain this?** Yes. React, Git, component state, and deployment configuration are within my current skill set. The honest maintenance cost is dependency and adapter updates, so every update must pass lint, a production build, and a public URL check.

**Does it show my work well?** Yes. It gives the real screenshots, case copy, demo/repository links, and scope-builder interaction a repeatable structure without forcing a backend.

**Backend answer:** not yet. At launch, the site reads local content and builds a pre-filled email in the browser. I will add a backend only when I need to store submissions, protect data, or run a real server-side feature.

## Pass / revise check

- Three genuine options with trade-offs: **yes**.
- Free and matched to the actual display needs: **yes**.
- Decision includes “can I maintain this?”: **yes**.
- Decision includes “does it show my work well?”: **yes**.
- Backend answered honestly: **yes — not yet**.

