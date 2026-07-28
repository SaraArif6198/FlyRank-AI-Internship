# Timing log

## Observed workflow test

- Five-run artifact generation started: **29 Jul 2026, 00:56:01.070 PKT**
- Five-run artifact generation ended: **29 Jul 2026, 00:58:19.767 PKT**
- Total observed AI generation block: **138.697 seconds (2m 18.7s)**
- Average across five runs: **27.739 seconds**

This was a batch verification inside the build session. It confirms that the configured stages can be applied to five distinct fact briefs; it is not a substitute for timing five separate Claude Project sends.

## Costs that must not be hidden

- Workflow design, prompt writing, test-input preparation, report packaging, and the original audit reading are setup cost.
- The full setup session was not started with a stopwatch, so no false exact setup duration is claimed.
- Human review time has not been supplied by Sara.
- A manual blank-document control has not yet been timed by Sara.

## Required manual benchmark

1. Choose Run 01's input.
2. Start from a blank document with no AI.
3. Write the same four-part technical note and fact-check it.
4. Record `manual_minutes`.
5. In a fresh Claude Project chat, run the same input and record:
   - `model_seconds`
   - `human_review_minutes`
   - `correction_minutes`
6. Calculate:

```text
workflow_minutes = model_seconds / 60 + human_review_minutes + correction_minutes
gross_saved_per_run = manual_minutes - workflow_minutes
break_even_runs = setup_minutes / gross_saved_per_run
```

## Conditional estimate — not a measured claim

If the manual control takes **20 minutes** and human review/correction takes **4 minutes** after a **28-second** model run, the workflow would take about **4.5 minutes** and save about **15.5 minutes per run before setup cost**.

This scenario is included only to make the calculation auditable. It must be replaced with Sara's measured values before claiming “hours saved.”

## Fill after live timing

| Measure | Value |
|---|---:|
| Setup minutes | `{measure}` |
| Manual control minutes | `{measure}` |
| Claude model seconds | `{measure}` |
| Human review minutes | `{measure}` |
| Correction minutes | `{measure}` |
| Gross saved per run | `{calculate}` |
| Break-even runs | `{calculate}` |

