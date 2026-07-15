# The Prompt Ladder — Sara Arif

**Track:** General AI Fluency · **Week:** 2 · **Assignment:** 2 · **Phase:** Foundations
**Author:** Sara Arif · **Date:** 15 July 2026

> The discipline: one weak prompt, five versions, **exactly one new layer per version**, outputs compared side by side at every step. The note that matters is what changed in the *output*, not the prompt.
>
> **My weak prompt comes from my own track.** Before Assignment 1 taught me the interview method, this is exactly what I would have typed to get portfolio copy: *"Write a case study about my payroll project."* The ladder climbs from there — and one rung genuinely made things worse.

---

## Rung 0 — The baseline (a little embarrassing)

**Prompt:**
```
Write a case study about my payroll project.
```

**Output (representative excerpt):**
> **Streamlining Payroll: A Digital Transformation Success Story**
> In today's fast-paced business environment, organizations need efficient payroll solutions. This case study explores how a cutting-edge payroll management system transformed operations for a mid-sized company, reducing processing time by 85% and improving employee satisfaction across 200+ staff members. By leveraging modern web technologies, the solution delivered seamless integration and a scalable, user-friendly experience…

**The four notes:**
| | |
|---|---|
| What changed in the prompt | Nothing — this is the baseline. |
| What the output did | **Invented everything.** A fictional "mid-sized company," a fabricated 85%, "200+ staff" (it's 50+), zero mention of paper, offline, or cement. Reads like every case study on the internet. |
| What failed | All of it. No real facts, no reader, no shape, buzzwords ("cutting-edge," "seamless," "leveraging") — two of which are on my banned list. |
| What to try next | It can't know facts I never gave it. Biggest weakness = invention → add **real context** first. |

---

## Rung 1 — Layer added: REAL CONTEXT

**Prompt (change in bold):**
```
Write a case study about my payroll project.

**The facts — use only these: DG Cement payroll & attendance system, built solo
by me (Sara Arif). Before: 50+ construction workers paid off handwritten paper
registers at remote sites; payroll took the site manager most of a day every
week; workers disputed totals. What I built: offline-first PWA (sites barely
have signal), PHP/MySQL, 28 API endpoints, audit logs; I matched the 26-day
payroll formula to the site manager's manual calculation by hand. Result: in
production, weekly payroll time down 70%+, zero data loss during outages,
I still support it today.**
```

**Output (representative excerpt):**
> **Case Study: DG Cement Payroll & Attendance System**
> DG Cement's construction sites relied on handwritten paper registers to track attendance for over 50 workers, resulting in payroll processes that consumed most of a day each week. Sara Arif architected a comprehensive offline-first Progressive Web Application solution leveraging PHP/MySQL with 28 API endpoints. A Progressive Web App (PWA) is a type of application that combines web and native app features, enabling offline functionality… The implementation delivered a 70%+ reduction in weekly payroll processing time and has proven its robustness with zero data loss…

**The four notes:**
| | |
|---|---|
| What changed in the prompt | Added one layer: **real context** — the verified fact list, with "use only these." |
| What improved in the output | **The invention stopped.** Every number is now mine — 50+, 28, 70%, 26-day formula. "Paper registers" and "offline" finally appear. This is the single biggest jump on the whole ladder. |
| What still failed | It's written for nobody: it paused to explain what a PWA is mid-story, and the tone is a press release ("comprehensive," "leveraging" — banned word again). Who is this for? |
| What to try next | The explaining-basics problem is an audience problem → add a **defined audience**. |

---

## Rung 2 — Layer added: DEFINED AUDIENCE

**Prompt (change in bold):**
```
[Rung 1 prompt, plus:]

**The reader is one person: an operations manager at an industrial SME in
Pakistan. She is drowning in paper registers and spreadsheets. She does not
know or care what a PWA, an API, or PHP is — she cares whether it works in
the field, what it costs her week, and whether I disappear after delivery.**
```

**Output (representative excerpt):**
> If your sites still run attendance on paper registers, this will sound familiar. At DG Cement, attendance for 50+ workers was written by hand at remote sites, carried back, and retyped — payroll ate most of the site manager's day every week, and workers argued the totals. I built them a system that works where there's no signal: attendance is recorded on the spot and syncs when a connection appears. Nothing gets lost — not one record, even through outages. Payroll that took a day now takes hours, and I still look after the system today…

**The four notes:**
| | |
|---|---|
| What changed in the prompt | Added one layer: **defined audience** — the one ops manager, with what she does/doesn't care about. |
| What improved in the output | **It stopped explaining basics my reader already skips.** The PWA lecture vanished; "PHP/MySQL, 28 endpoints" got translated into "works where there's no signal." It opens with *her* pain (paper registers), not my tech. It even used "I still look after it" — the disappearing-freelancer fear, unprompted. |
| What still failed | Shapeless — one long river of paragraphs, no scannable structure, ran ~450 words, and trailed off without an ending. A busy manager won't read a wall. |
| What to try next | The wall-of-text problem is a structure problem → specify the **output format**. |

---

## Rung 3 — Layer added: OUTPUT FORMAT

**Prompt (change in bold):**
```
[Rung 2 prompt, plus:]

**Format: exactly three beats with these headings — "The problem", "What I
did", "What came of it" — then one italic line starting "Next time" naming
one thing I'd do differently. 150–180 words total. No introduction, no
conclusion, no headline puns.**
```

**Output (representative excerpt):**
> **The problem.** Attendance for 50+ construction workers lived in handwritten registers at remote sites. Payroll consumed most of the site manager's day every week, and workers disputed the totals.
> **What I did.** I built a seamless system that works with no signal: attendance recorded on the spot, synced when a connection appears. I matched the 26-day payroll formula to the manager's manual calculation by hand — payroll can't be off by a rupee.
> **What came of it.** A transformative outcome: payroll time down 70%+, zero records lost through outages, and I still support the system today.
> *Next time: measure the "before" properly so 70% isn't the only number I can defend.*

**The four notes:**
| | |
|---|---|
| What changed in the prompt | Added one layer: **output format** — three named beats + wrinkle line + hard word count. |
| What improved in the output | **Scannable in ten seconds.** The three beats forced a story arc; the word cap killed the rambling; the "Next time" line produced an honest wrinkle I actually believe. Side by side with Rung 2, this is half the length saying more. |
| What still failed | The voice. "Seamless" and "transformative" crept back — generic AI polish smeared over my facts. It sounds like a good copywriter, not like me. |
| What to try next | Show it what good sounds like → paste an **example** of a case done right. |

---

## Rung 4 — Layer added: EXAMPLE — ⚠ this one made it WORSE

**Prompt (change in bold):**
```
[Rung 3 prompt, plus:]

**Here is an example of the quality and voice I want (from my course material —
Iris's museum signage case): "The problem. Museum visitors constantly stopped
staff to ask where the bathrooms and exit were. The map on the wall was pretty
and unhelpful. What I did. I rebuilt the map around the three questions people
actually asked, cut the decoration, and tested paper versions for a week before
anything was printed. What came of it. Staff noticed far fewer 'where is X'
interruptions…" Match this quality.**
```

**Output (representative excerpt):**
> **The problem.** Site managers were constantly stopped by workers asking about their pay. The paper register on the desk was **tidy and unhelpful**. **What I did.** I rebuilt payroll around the **three questions workers actually asked**, cut the paperwork, and **tested paper versions for a week** before anything went live. **What came of it.** The site manager noticed **far fewer "where is my pay" interruptions**…

**The four notes:**
| | |
|---|---|
| What changed in the prompt | Added one layer: **an example** of a good case (Iris's museum signage, from the course). |
| What improved in the output | Honestly? The rhythm, slightly. That's it. |
| **What went WRONG** | **It photocopied the example instead of learning from it.** "Pretty and unhelpful" became "tidy and unhelpful." Iris's "three questions people actually asked" got transplanted into my payroll story where it isn't even true. "Tested paper versions for a week" — that's *her* project, not mine; I never did that. The case stopped passing Assignment 1's core test: it no longer *could only describe my project*. **This rung made the output worse than Rung 3, and it fabricated — the exact failure the context layer had fixed.** |
| What to try next | Remove the example entirely. Don't show it a voice to imitate — **give it rules and forbid the failure modes** (constraints). |

---

## Rung 5 — Layer added: CONSTRAINTS (example removed)

**Prompt (change in bold — Rung 4's example deleted):**
```
[Rung 3 prompt — example REMOVED — plus:]

**Constraints: short sentences; numbers over adjectives. Banned words:
seamless, transformative, passionate, results-driven, leveraged, spearheaded,
cutting-edge, comprehensive. Use only the facts I gave — if a sentence states
something not in my fact list, cut the sentence. Keep my phrasings where they
exist: "offline-first," "replace paper," "it still runs today."**
```

**Output (representative excerpt):**
> **The problem.** A cement contractor paid 50+ construction workers off paper registers. Attendance was handwritten at remote sites and retyped. Payroll took the site manager most of a day, every week. Workers disputed the totals.
> **What I did.** I built an offline-first system for sites with almost no signal. Attendance is recorded on-device and syncs when a connection appears. I matched the 26-day payroll formula to the manager's manual calculation by hand — one rupee off starts a dispute.
> **What came of it.** Payroll time down 70%+. Zero records lost through outages. It still runs today, and I still support it.
> *Next time: log the before-state formally, so 70% isn't the only number I can defend.*

**The four notes:**
| | |
|---|---|
| What changed in the prompt | Added one layer: **constraints** — banned-word list, numbers-over-adjectives, the cut-rule for unsupported sentences, my own phrases kept. (And Rung 4's example deleted.) |
| What improved in the output | **The generic polish is gone and nothing fabricated came back.** Every banned word absent. Short declaratives that sound like me talking. The cut-rule worked as a fabrication guard — this draft contains no sentence I can't defend. It's the first output I'd put on my site without editing every line. |
| What still failed | Small: it can't know facts I forgot to give (the testimonial, launch date). It renders exactly what's in the fact list — which is the point, but means the fact list is now the quality ceiling. |
| What to try next | A **verification requirement** — "list every place you needed a fact I didn't supply, as questions." That's the doorway to the interview method I used in Assignment 1; it goes in the next experiment, not smuggled untested into this ladder. |

---

## The final reusable prompt

Cleaned up for anyone on the track — replace the `{braces}`, nothing else needed. Every layer in it earned its rung; the example layer is deliberately absent (see Rung 4).

```
Write one project as a short case study.

THE FACTS — use only these; if a sentence states something not on this list,
cut the sentence:
{your verified facts: what existed before, what you built, the decisions you
made, real numbers, current status}

THE READER — one person: {who they are, what they're drowning in}. They do not
know or care about {jargon they'd skip}; they care about {what they actually
weigh: does it work, what does it cost them, will you disappear}.

FORMAT — exactly three beats with these headings: "The problem", "What I did",
"What came of it". Then one italic line starting "Next time" naming one thing
you'd do differently. 150–180 words. No introduction, no conclusion.

CONSTRAINTS — short sentences; numbers over adjectives. Banned words:
{your banned list — start with: seamless, transformative, passionate,
results-driven, leveraged, cutting-edge}. Keep these phrasings of mine where
they fit: {2–3 phrases that sound like you}.
```

**Why no example slot:** on this ladder, pasting a model case made the output *worse* — the AI transplanted the example's phrases and even its facts into my project (Rung 4). Rules constrained; the example contaminated.

---

## Pass / revise self-check

| Criterion | Check |
|---|---|
| Six runs total, each version tied to exactly one named layer | ✅ Baseline + 5: real context → defined audience → output format → example → constraints. One layer per rung, named in the heading. |
| Notes describe changes in the **output**, not just the prompt | ✅ "It stopped explaining basics my reader skips" (R2), "half the length saying more" (R3), "'pretty and unhelpful' became 'tidy and unhelpful'" (R4) — all output observations. |
| At least one honest "this made it worse" moment | ✅ Rung 4: the example was photocopied, fabricated facts returned ("tested paper versions" — Iris's project, not mine), and the layer was removed at Rung 5. |
| The final prompt works for a stranger | ✅ Fully parameterized with `{braces}`, self-contained rules, and a warning about the layer that failed. |
