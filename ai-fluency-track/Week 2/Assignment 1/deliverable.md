# Frame It as Cases — Sara Arif

**Track:** General AI Fluency · **Week:** 2 · **Phase:** Foundations
**Author:** Sara Arif · **Date:** 15 July 2026

> One document, as the brief asks: voice card at the top, a framed case for every piece the sitemap calls for, bio + contact/CTA copy, and one before/after against generic AI copy.
> Sitemap reference: Week 1 FL-03 v2 — Hero → **Proof** (DG Cement) → **Work** (six builds) → How I Work → Scope Builder → **Contact**.
> Every case is written for one reader — **an operations manager at an industrial SME** — and points at one action: **email me a scoped project inquiry**.

---

## Voice card

**Direct, plain, specific, honest, no buzzwords.**
Short sentences. Numbers over adjectives. One honest wrinkle stays in every story. Banned: "passionate," "results-driven," "dynamic," "leveraged," "spearheaded." (Added to my Claude Project as a standing instruction — see `voice_card.md`.)

---

## PROOF · Case 1 — DG Cement Payroll & Attendance System *(flagship)*

**The problem.** A cement contractor was paying 50+ construction workers off paper registers. Attendance was written by hand at remote sites, carried back, retyped, and totaled manually. Payroll ate most of the site manager's day every week, and workers disputed totals because nobody trusted the registers.

**What I did.** I built an offline-first PWA — the one decision everything else hung on, because the sites barely have signal. Attendance is recorded on-device and syncs when a connection appears. Behind it: PHP/MySQL, 28 API endpoints, audit logs on every change. The payroll formula I did by hand, not with AI — I sat with the site manager and matched his 26-day manual calculation exactly, because payroll that's off by one rupee starts a labour dispute and kills the system's credibility on day one. My first sync design assumed longer connectivity windows than the sites actually get; I reworked it until a device could go a full shift offline without losing a record.

**What came of it.** The system is in production and I still support it today. 50+ workers logged daily. Weekly payroll processing time down 70%+. Zero data loss during outages. The client's words, paraphrased from what he told me: *"Payroll used to take me the whole day — now it's done in a couple of hours, and there are no more arguments over attendance. And she didn't disappear after delivery."* — Site Manager, DG Cement project (paraphrased; name withheld on request).

*Next time I'd log the before-state formally, so "70% faster" isn't the only number I can defend.*

---

## WORK · Case 2 — The AI Core *(built in this internship — Backend AI Engineering, Week 1)*

**The problem.** Most "AI backends" are a chat wrapper: prompt in, text out, hope for the best. The assignment was to build one that behaves like production software — answering questions over a private database of 14 research papers, where the LLM itself decides which tools to run, including writing its own SQL.

**What I did.** I treated the model as untrusted input, same as any user. Every SQL query it writes passes a guardrail before touching the database: stripped of comments, forced to start with `select`, locked to the `papers` table, checked against 17 blacklisted patterns — no mutations, no `pragma`, no schema introspection, no chained statements. If the model's answer doesn't match the output schema, the API returns an explicit 422 instead of passing garbage downstream. And the whole thing is provider-agnostic through a gateway: Gemini, Groq, or Claude, swapped with one env variable.

**What came of it.** 51 unit tests pass, 22 of them security tests — 16 malicious queries blocked. It's an internship build, not client work, and I label it that way. What it shows is how I'd wire an LLM into a real system: validate in, sanitize the middle, validate out.

*Next time I'd validate the SQL structurally (parse it, not pattern-match it) — keyword filters are a first layer, not a wall.*

---

## WORK · Case 3 — AURA *(LLM chat interface)*

**The problem.** I wanted a chat interface where multiple conversation threads stay truly separate. With LangGraph and a SQLite checkpointer under concurrent access, they didn't — state bled between threads.

**What I did.** Built the interface on LangGraph StateGraph with persistent SQLite checkpointing, then spent the hard part of the project diagnosing the thread-isolation failure — AI helped me brainstorm edge cases, but verifying the actual concurrency behavior was manual work. I also made it survive the real world: when a provider throws a 404 or a rate limit, the chat falls back instead of dying.

**What came of it.** A working multi-threaded chat with persistent, isolated conversations — and a concurrency debugging story I can walk through line by line. It runs locally, the code is on my GitHub, and I'm the only user. No client behind this one; it lives in my portfolio as depth, labeled exactly that.

*Next time I'd load-test the checkpointer before building UI on top of it, not after.*

---

## WORK · Case 4 — DataSage *(multi-agent EDA pipeline)*

**The problem.** Exploratory data analysis is the same loop every time — profile, find what matters, explain, chart. Doing it by hand for every CSV is slow; most automated tools crash the moment the data is dirty.

**What I did.** A three-node LangGraph pipeline — analysis, narrative, visualization — passing structured JSON, validated against the frontend's schema. Two decisions I'd defend: it returns structured error states for empty or corrupted CSVs instead of crashing (I generated hostile test data — nulls, outliers — specifically to attack it), and the whole run finishes in under 15 seconds, because an analysis tool people wait minutes for doesn't get used.

**What came of it.** The pipeline holds both targets on real data, not just my synthetic attacks — I ran it against public Kaggle datasets and it stayed under 15 seconds end-to-end with no crashes. Portfolio-depth build, honestly labeled.

*Next time: a real business's data, where the mess isn't curated. Kaggle data is public and half-cleaned; a client's export is neither.*

---

## WORK · Case 5 — Inventory Management System

**The problem.** Small shops run stock the way the cement contractor ran payroll: counts in a register, sales in someone's head, and nobody notices an item is out until a customer asks for it. I built the system that closes that loop — as a portfolio build, modeled on how a real shop actually operates, and I label it that way.

**What I did.** A desktop system in C# (Visual Studio) on SQL Server. The cashier gets exactly one screen — the POS; every sale decrements stock automatically. The admin gets everything else: low-stock alerts, reports downloadable as PDF or CSV, and an audit log on every stock change — who touched it and when — because in a shop, unexplained stock movement is the whole problem. Two decisions I'd defend: role-based access (a cashier who can edit inventory is an audit hole, so they can't), and an AI chatbot that answers "what's in stock, what's out?" in plain language and triggers automatic restock entries when something runs out — the shopkeeper shouldn't need to learn my screens to ask a question.

**What came of it.** A complete working system: POS, alerts, audit trail, reports, chatbot. No paying shop behind it yet — it's the depth pile, and it's the build I'd point an ops manager to when they ask "can you do inventory, not just payroll?"

*Next time I'd put it in one real shop for a month before calling it done — the register it replaces will teach me things my test data can't.*

---

## WORK · Case 6 — Customer Trends ETL

**The problem.** Raw customer data doesn't answer questions — it's nulls, inconsistent formats, and duplicates pretending to be a dataset. I wanted the pipeline that turns that mess into a trend you can act on, end to end.

**What I did.** Built an extract-transform-load pipeline over a public customer dataset: cleaned and standardized the raw data (nulls handled explicitly, formats normalized, duplicates resolved — the unglamorous 80%), loaded it into a queryable store, and ran trend analysis over time with visualizations on top. The decision that mattered: treat cleaning as its own auditable stage, not something smeared through the analysis code — when a number looks wrong downstream, I can point to exactly what the transform did to it.

**What came of it.** A working pipeline from raw file to trend charts. It's public data, so I claim the engineering, not a business outcome: the same pipeline pointed at a client's sales export is how "which customers are slipping away?" gets answered.

*Next time I'd run it on data someone actually needs an answer from — the trends only matter when a decision hangs on them.*

---

## WORK · Case 7 — Mobile Expense Tracker

**The problem.** My own money was leaking the way most students' does — small expenses, untracked, remembered wrong. Notes apps don't add up columns, and every tracker app I tried wanted an account and a connection.

**What I did.** Built my own: fully offline, data stored on-device. That was the deliberate decision, and it's the same instinct as DG Cement — if the tool needs a connection to record a 50-rupee entry, it won't get used, and expense data is nobody's business but mine anyway.

**What came of it.** It's on my phone and I log expenses in it regularly. That's the honest result: one real daily user — me — which is one more than most portfolio apps get. It's also the smallest demonstration of the pattern I sell: offline-first, on-device, built around how the person actually behaves.

*Next time I'd add an export, because my own data is now locked on one device — the exact problem I build my way out of for clients.*

---

## WORK · Case 8 — Global Sales Dashboard

**The problem.** A global sales spreadsheet can tell you the total. It can't tell you at a glance which region is carrying the profit, which product line is dragging, or where the numbers are heading next quarter — you'd be pivot-tabling for an hour per question.

**What I did.** A Streamlit dashboard with Plotly charts over a public global sales dataset. The design decision that mattered: interactive filters — year, region, category — so the reader interrogates the data instead of scrolling a report. And I went one step past describing the past: time-series forecasting, so the dashboard doesn't just show what sold, it projects where sales are heading.

**What came of it.** One screen that answers the region/product-mix question the spreadsheet couldn't, with a forecast attached. Public data, so the claim is the capability: this is the dashboard an ops manager gets pointed at when they ask what "reports" means beyond a PDF.

*Next time I'd validate the forecast against a held-out period and show the error honestly on the chart — a projection without its error bar is a guess in a suit.*

---

## Bio (for the site — three options, mine to pick)

1. **I build the software that replaces paper.** Payroll, attendance, inventory — systems that run offline in the field and are still running after I hand them over.
2. I turn manual business processes into working software — like the payroll system 50+ construction workers use every day at remote sites with no signal. If your process lives in a register or a spreadsheet, I've probably replaced one like it.
3. I'm a software architect who ships to production while finishing a CS degree. My proof isn't a certificate — it's a payroll system a cement contractor has trusted with real wages, every week, since launch.

**Picked: option 2** — it names the reader's pain ("register or a spreadsheet") and carries the proof in the same breath.

## Contact / CTA copy

**Section heading:** What process do you want to replace?
**Body line:** Tell me the process that's eating your week — the Scope Builder above will shape it into a brief, or just email me directly. I reply within two working days.
**Button:** Email me a project inquiry

---

## Before / After — generic AI line vs. mine

**Before (what the AI first drafted):**
> "I'm a passionate, results-driven software engineer who leverages cutting-edge technologies to deliver innovative, scalable solutions that exceed client expectations."

**After (my edit, per the voice card):**
> "I build the software that replaces paper. The proof: a payroll system 50+ construction workers use daily at sites with no signal — zero data lost, payroll day cut by 70%, still running."

The before could hang on ten thousand portfolios. The after could only be mine — it has a number, a place, and a wrinkle-free claim I can defend line by line.

---

## Pass / revise self-check

| Criterion | Check |
|---|---|
| A framed case for each piece the sitemap calls for | ✅ Proof (1) + all six Work builds + this internship's build (2–8) — all fully framed, none a bare screenshot or title |
| Each case has the three beats and could only describe my project | ✅ Problem → decisions → outcome in every complete case; "26-day payroll formula matched by hand" and "16 malicious queries blocked" describe nobody else's work |
| Sounds like a specific person; before/after shows the gap | ✅ Voice card enforced; before/after above is the same claim in generic vs. mine |
| One audience, one action, no filler | ✅ Every case ends facing the ops manager; CTA is the single scoped-inquiry email; banned-word list applied |
