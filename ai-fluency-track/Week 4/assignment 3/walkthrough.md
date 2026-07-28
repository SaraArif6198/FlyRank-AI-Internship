# Ship an Automation Workflow v2 — Walkthrough

**Code:** FL-04 · **Track:** General AI Fluency · **Week:** 4 · **Phase:** Build (core)

## 1. Workflow picked from the audit

Week 1 Task 4 was **“Drafting narrative text or documentation for research papers,”** classified as **Collaborate with AI** because AI can structure and refine text while Sara remains responsible for technical accuracy.

The shipped workflow is **DCR: Draft → Critique → Revise**, implemented as structured instructions in a Claude Project. It is no-code: the operator pastes one bounded fact brief, and the Project executes five explicit stages.

## 2. What it produces

Input:

- one audience;
- one purpose;
- a closed fact list;
- constraints;
- one output format.

Output:

- numbered fact ledger and missing questions;
- Draft 1 with inline fact IDs;
- adversarial critique under four fixed categories;
- Draft 2 with a change log;
- clean final copy, human-check list, fact coverage, and `READY / NEEDS HUMAN FACT / NEEDS REWRITE`.

## 3. Flow and handoffs

```text
FACT BRIEF
   ↓
1 INTAKE ── numbered facts + open questions
   ↓
2 DRAFT ── every factual sentence carries [F#]
   ↓
3 CRITIQUE ── unsupported / distorted / unclear / format
   ↓
4 REVISE ── Draft 2 + explicit change log
   ↓
5 VERIFY & FORMAT ── final + human checks + coverage + status
   ↓
HUMAN GATE ── verify, correct, or cut; never auto-publish
```

The detailed diagram and handoff table are in `workflow-diagram.md`.

## 4. Configuration and prompts

Everything required to rebuild the workflow is included:

- `workflow/CLAUDE_PROJECT_INSTRUCTIONS.md` — complete Project configuration and all five step prompts.
- `workflow/INPUT_TEMPLATE.md` — reusable trigger/input contract.
- `workflow/RUN_CHECKLIST.md` — operator procedure, timing steps, and review gate.

No hidden prompt, API key, code node, or paid custom GPT is required.

## 5. Five real runs

| Run | Real input | Main failure caught by critique | Human check | Disposition |
|---|---|---|---|---|
| 01 | DG Cement offline sync | Draft implied an unspecified sync algorithm | Recency of zero-loss claim | Ready after recency check |
| 02 | The AI Core SQL guardrail | Test evidence could sound like complete security | Rerun current test counts | Ready after count check |
| 03 | AURA thread isolation | “Diagnosed” invited an invented root cause/fix | Add reproduction from repo | Incident summary ready; runbook not ready |
| 04 | DataSage EDA pipeline | Analysis-node handoff and <15s result could be overgeneralized | Record datasets, sizes, hardware | Ready with limitations |
| 05 | Inventory role boundary | Draft inferred a UI data flow and risked implying adoption | Decide human approval for restock | Portfolio note ready |

Full inputs, intermediate outputs, critiques, revisions, and finals live under `runs/`. Run 05 was withheld as the new-input acceptance test; the same instruction file handled it without a workflow rewrite.

## 6. Time accounting

The observed five-run generation block took **2m 18.7s total**, or **27.7s per run average**. That measurement excludes human review and does not pretend to be five independently timed Claude sends.

Setup cost is real: audit selection, workflow design, prompt/configuration writing, input preparation, testing, and documentation. The full setup was not started with a stopwatch, so this report does not invent an exact setup duration.

A manual blank-document control and Sara's human-review time remain required before a final savings claim. `timing_log.md` provides the stopwatch procedure and formula.

Conditional illustration only: a 20-minute manual note versus 28 seconds of generation plus 4 minutes of review/correction would save roughly 15.5 minutes before setup. This is **not** reported as a measured result.

## 7. Where it breaks

1. **The source brief can be wrong.** The workflow prevents unsupported additions; it cannot prove that supplied facts are true or current.
2. **Self-critique is not independent verification.** The same model can miss its own unsupported phrase.
3. **Context can leak between runs.** Use a fresh Project chat for every acceptance test.
4. **Fact IDs can create false confidence.** A citation proves a sentence points to a supplied fact, not that the fact is externally verified.
5. **Quotes and permissions remain human-only.** The model cannot authorize publication or confirm a paraphrase with the speaker.
6. **Benchmarks decay.** Test counts, latency, links, and production status must be rerun or rechecked.
7. **Format pressure can hide uncertainty.** Word caps never justify deleting the limitation or human-check section.

## 8. Required human review

Sara must still:

- compare every number and named technology with the source;
- rerun test/benchmark claims that can change;
- verify client confidentiality and quote permission;
- inspect code before accepting a root-cause or implementation explanation;
- decide whether unresolved questions are answered with evidence or removed;
- approve the final copy. `READY` means ready for this gate, never ready to auto-publish.

## 9. New-input acceptance test

Run 05 used an Inventory brief not used to write the earlier outputs. The workflow:

- built the fact ledger;
- drafted with fact IDs;
- caught an inferred UI flow;
- revised it out;
- preserved the “portfolio build, no paying shop” label;
- surfaced the chatbot-triggered restock decision for human review.

That is an end-to-end pass on a new input. Sara subsequently confirmed that she configured the workflow in Claude and completed the live end-to-end rerun.

## 10. Pass / revise

- Three-plus distinct steps: **yes — five**.
- Defined handoffs: **yes**.
- Five real runs with outputs: **yes**.
- New-input end-to-end test: **yes — Run 05**.
- Live Claude Project rerun: **yes — completed and confirmed by Sara**.
- Setup cost included honestly: **yes; exact full setup time explicitly not claimed**.
- Time-saved estimate: **conditional and labeled, pending manual benchmark**.
- Failure points and human review: **yes**.
