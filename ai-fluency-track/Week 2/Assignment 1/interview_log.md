# AI Interview Log — Getting the Cases Out of Me

> The assignment's method: **don't ask AI to "describe my work" — have it interview you, one question at a time, until the problem, the decisions, and the outcome are out of you.** This log records those interviews. Answers are mine, kept messy on purpose; the AI flagged every spot where it had to guess so I could fix it before drafting.
>
> Pieces the sitemap (Week 1, FL-03 v2) calls for: **Proof** (DG Cement, flagship) + **Work** (six: Inventory Management System, Customer Trends ETL, Mobile Expense Tracker, Global Sales Dashboard, and two AI/data builds — AURA and DataSage) + bio + contact/CTA. Per the brief, I started with what I'm making in this internship: **The AI Core** (Backend AI Engineering track, Week 1), which slots into the Work section as an AI/data build.

---

## Interview 1 — DG Cement Payroll & Attendance System (the flagship)

**AI:** What problem did this start from? Not the software — the situation.
**Me:** A cement contractor was running payroll for 50+ construction workers on paper registers. Attendance written by hand at remote sites, carried back, retyped, totaled manually. Payroll took the site manager most of a day every week, and disputes happened because nobody trusted the registers.

**AI:** What did you actually build, and what did you decide along the way?
**Me:** An offline-first PWA — that was the big decision. The sites have bad connectivity, so anything that needed a live connection was dead on arrival. Attendance gets recorded on-device and syncs when there's signal. Backend is PHP/MySQL, 28 API endpoints, audit log tables so every change is traceable.

**AI:** What was the hardest decision, the one you'd defend in an interview?
**Me:** The payroll formula. The contractor pays on a 26-day cycle with his own manual rules. I refused to let AI write that formula — I sat with the site manager and matched his manual calculations exactly, because if payroll is off by one rupee you get a labour dispute, and the whole system loses trust on day one.

**AI:** What did you try that didn't work?
**Me:** My first sync approach was naive — I assumed connectivity windows would be longer than they were. I had to rework around the reality that a device might be offline for a full shift. That's where "zero data loss during outages" comes from; it wasn't free.

**AI:** What came of it?
**Me:** It's in production. 50+ workers logged daily, weekly payroll processing time down 70%+, zero data loss during outages. The site manager told me payroll that used to take his whole day is done in a couple of hours now, that the attendance arguments stopped, and that what he valued was that I didn't disappear after delivery — he asked not to be publicly named, so the site quotes him as a paraphrase, labeled as one. And I still support the system today.

**AI:** What would you do differently?
**Me:** Log the before-state properly. I know payroll took "most of a day" because the site manager told me; I'd measure it formally next time so 70% isn't the only number I can defend.

**AI guesses flagged, fixed by me:** it guessed "100+ workers" from an earlier draft — corrected to 50+, the number that matches my CV.

---

## Interview 2 — The AI Core (this internship, Backend AI Engineering Week 1)

**AI:** What was the assignment problem, in your words?
**Me:** Build a backend AI service that's actually production-shaped — not a chat wrapper. It answers questions over a private literature database (14 peer-reviewed papers on serverless computing), and the LLM decides which tools to run, including writing its own SQL against the database.

**AI:** An LLM writing SQL against your database — what did you decide there?
**Me:** That the model is untrusted input, same as a user. Every query it writes passes through a guardrail before touching SQLite: normalized, comments stripped, must start with `select`, must target the `papers` table, and 17 blacklisted patterns (mutations, `pragma`, `attach`, `load_extension`, schema introspection, chained statements via `;`). 16 malicious queries are blocked in the test suite, 22 security tests total.

**AI:** What else could go wrong, and what did you do about it?
**Me:** The model returning garbage that *looks* like an answer. So the output is validated against a Zod schema, and if it doesn't conform the route returns an explicit 422 instead of letting invalid data slip through or failing silently. I forced that error path deliberately. Also made it provider-agnostic through a Portkey gateway — swap Gemini, Groq, or Claude with an env variable, no code change.

**AI:** What's the honest result?
**Me:** 51 unit tests passing across schemas, guardrails, and tools. It's an internship exercise, not a paying client — I'm not going to inflate it. What it proves is that I treat an LLM like any other untrusted component in a production system: validate in, sanitize the middle, validate out.

**AI:** What would you do differently?
**Me:** The guardrail is lexical — blacklist and whitelist on the query text. Next iteration I'd parse the SQL into an AST and validate structurally, because keyword filters are a losing race in the long run.

**AI guesses flagged, fixed by me:** it called the guardrail "bulletproof" — I changed that; a lexical filter is a good first layer, not bulletproof, and saying so is the point.

---

## Interview 3 — AURA (LLM chat interface)

**AI:** What problem did AURA start from?
**Me:** I wanted a chat interface over LangGraph where multiple conversation threads don't bleed into each other. Sounds trivial; it isn't when your checkpointer is SQLite and threads hit it concurrently.

**AI:** What did you decide and what broke?
**Me:** Built it on LangGraph StateGraph with SQLite checkpointers for persistence. Thread isolation broke first — concurrent access to the checkpointer caused state bleed I had to diagnose by hand; AI helped brainstorm edge cases but the verification was mine. Second real-world problem: providers fail — 404 model-not-found and rate limits — so I added fallback configuration handling instead of letting the chat die.

**AI:** What came of it?
**Me:** A working multi-threaded chat interface with persistent, isolated conversations, and a debugging story I can tell precisely. No client behind it — it's the depth pile, and it's labeled that way.

**AI guesses flagged, fixed by me:** it guessed AURA was deployed with demo users — corrected: it runs locally, code on GitHub, I'm the only user, and the case says so.

---

## Interview 4 — DataSage (multi-agent EDA pipeline)

**AI:** What problem?
**Me:** Exploratory data analysis is the same loop every time: profile the data, find what matters, explain it, chart it. I wanted that loop automated end-to-end — upload a CSV, get analysis, narrative, and visualization without a human driving each step.

**AI:** What did you build and decide?
**Me:** A LangGraph pipeline with three nodes — analysis, narrative, visualization — passing structured JSON state, output validated against the frontend's Pydantic schema. Two decisions I'd defend: it must handle empty or corrupted CSVs by returning structured error states instead of crashing (I generated test datasets with nulls and outliers specifically to attack it), and the full pipeline runs in under 15 seconds, because a "wait a few minutes" analysis tool doesn't get used.

**AI:** Result, honestly?
**Me:** The pipeline executes within the 15-second target and survives corrupt input. It's a portfolio-depth build, not client work.

**AI guesses flagged, fixed by me:** it wanted to name a specific Kaggle dataset I couldn't confirm from memory — cut to "public Kaggle datasets," which is what I can defend.

---

## Interviews 5–8 — the remaining Work builds (run in chat, short-form)

These four ran as rapid-fire structured questions rather than long transcripts. The facts that came out of me, and went into the cases:

**Inventory Management System.** Built in C# (Visual Studio) on SQL Server; a uni/portfolio build, honestly labeled — no shop behind it yet. What it does: POS with automatic stock decrement, low-stock alerts, audit logging on every stock change, reports downloadable as PDF/CSV, an AI chatbot that answers stock questions in plain language and auto-fills inventory when something runs out, and role-based access — cashier sees only the POS, admin sees everything.

**Customer Trends ETL.** Public dataset. The pipeline: cleaning/normalizing (nulls, formats, duplicates), trend analysis over time, load + visualize. The claim is the engineering, not a business outcome — said so in the case.

**Mobile Expense Tracker.** Built for myself. Deliberately offline, on-device storage. Honest status: it's on my phone and I still use it regularly.

**Global Sales Dashboard.** Streamlit + Plotly over public global sales data. Interactive filters (year, region, category) were the design decision; it answers the region/product-mix question and adds time-series forecasting on top.

**AI guesses flagged, fixed by me:** it assumed the inventory system was PHP/MySQL to match DG Cement — wrong, it's C#/SQL Server. It also drafted a specific "one region carried most profit" insight for the dashboard I hadn't verified — cut; the case claims the capability, not an invented finding.

**Rule carried from Week 1:** no case ships with an inflated number or an unverifiable claim. A small honest result ("it's on my phone and I use it") beats an invented one.
