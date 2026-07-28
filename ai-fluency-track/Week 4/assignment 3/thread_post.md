# Week 4 · FL-04 — Ship an Automation Workflow v2

I turned a Week 1 audit task—drafting technical documentation—into a no-code Claude Project workflow:

**Intake → Draft → Adversarial critique → Revise → Verify/format → Human gate**

The key handoff is a numbered fact ledger. Draft 1 must cite a fact ID after every factual sentence. The critique then checks four fixed failure types: unsupported, distorted, unclear, and format. Revision includes a change log, and the final output cannot hide unresolved questions.

I tested it on five real inputs from my work:

1. DG Cement offline sync
2. The AI Core SQL guardrail
3. AURA thread isolation
4. DataSage error/performance behavior
5. Inventory role boundaries — held back as the new-input acceptance test

The critique caught real problems: implied algorithms that were not in the brief, security wording broader than the tests, an invented UI handoff, and benchmarks missing dataset/hardware context.

Observed AI generation block: **2m 18.7s for five run artifacts (27.7s/run average)**. I am not calling that “hours saved.” It excludes human review, and I did not time the full setup or a manual blank-document control. The workflow includes a stopwatch sheet so those values replace the conditional estimate before I make a savings claim.

Human review remains mandatory for numbers, permissions, confidentiality, test recency, code-level explanations, and final approval.

I also configured the workflow in Claude and completed a fresh end-to-end run. It preserved all five handoffs and stopped at the human verification gate as designed.
