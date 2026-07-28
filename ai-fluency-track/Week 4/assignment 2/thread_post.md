# Week 4 — Three Roads: Choose Your Stack with AI

I gave AI four constraints: free only; my honest skill level; the six-section content map; and the need to show real screenshots, readable case studies, repository/demo links, and a small scope-builder interaction.

I compared three roads:

1. **Plain HTML/CSS/JS + GitHub Pages** — smallest maintenance surface, but repeated case markup and gallery state become manual as the portfolio grows.
2. **Astro + Tailwind + Cloudflare Pages/Vercel** — strong for content and static performance, but switching frameworks now spends build time on migration rather than proof.
3. **Vite + React + Tailwind + Framer Motion + Vercel** — more dependencies and deployment configuration, but the best fit for repeatable case components, responsive galleries, and the scope builder.

I chose road 3.

**Can I maintain this?** Yes. React, Git, component state, and deployment configuration are within my current skill set. The honest wrinkle is maintenance: our first Vercel attempt returned 404 until the Nitro adapter and output configuration were corrected. Future dependency changes need lint, a production build, and a public URL check.

**Does it show my work well?** Yes. It gives real screenshots, long-form proof, and demo/repository links a consistent structure while keeping animation restrained.

**Backend? Not yet.** The launch version reads local content and builds a pre-filled email in the browser. No database, account, CMS, or stored form submission is needed.

Live shell: https://sara-flyrank-portfolio.vercel.app/

