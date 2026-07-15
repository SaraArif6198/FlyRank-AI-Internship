# Prompting Fundamentals on Real Tasks v2 — Sara Arif

**Track:** General AI Fluency · **Week:** 2 · **Assignment:** 3 (Code: FL-02 v2) · **Phase:** Foundations
**Author:** Sara Arif · **Date:** 15 July 2026

> **The real task, from my FL-01 audit (Target Task 1):** *Automating SQL migration scripts for the DG Cement Work Tracker* — classified "Collaborate with AI," with measurable success criteria already defined in FL-01: **(a)** schema changes run without syntax errors, **(b)** all existing production rows are preserved, **(c)** execution completes in under 500 ms on a 10,000-row database. The concrete job: add audit-log capability to a live MySQL database that pays 50+ workers — where an untraceable change to attendance or payroll can become a labour dispute.
>
> Six versions: the naive one-liner, then five iterations, each applying **one named technique** — role assignment → context & motivation → few-shot examples → output structure → step decomposition. Then the final prompt run on both Claude and ChatGPT, compared honestly.

---

## V0 — The naive prompt (what I'd have typed a month ago)

**Prompt:**
```
Write a SQL migration to add an audit log table to my database.
```

**Output (representative excerpt):**
```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(255),
    action VARCHAR(50),
    user_id INTEGER,
    timestamp TIMESTAMP DEFAULT NOW()
);
```
> *"This migration creates a flexible audit log table. You may want to adjust the columns based on your needs…"*

**Note — what the output did:** Wrong database. `SERIAL` and `NOW()` are PostgreSQL — my system is MySQL. Generic columns tied to nothing in my schema, no foreign keys, no rollback, and "adjust based on your needs" hands the actual work back to me. Against my FL-01 criteria it scores 0 of 3 — it wouldn't even parse. **Next:** it doesn't know what kind of engineer should be answering → role assignment.

---

## V1 — Technique: ROLE ASSIGNMENT

**Prompt (change in bold):**
```
**You are a senior MySQL 8 DBA who writes migrations for live production
systems and treats data loss as a career-ending event.**

Write a SQL migration to add an audit log table to my database.
```

**Output (representative excerpt):**
```sql
-- Run inside a transaction where possible; take a backup first.
CREATE TABLE audit_log (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(64) NOT NULL,
    action ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    changed_by VARCHAR(64) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Note — what changed in the output:** The dialect fixed itself without me listing a single syntax rule — `AUTO_INCREMENT`, `ENGINE=InnoDB`, `utf8mb4`, an `ENUM` for the action, and an unprompted "take a backup first." The role carried a whole set of conventions I never spelled out. **Still failed:** it's auditing a database it has never seen — no link to my `workers`, `attendance`, or `payroll` tables, and no old-value/new-value capture, which is the entire point for dispute resolution. **Next:** it needs my schema and my *why* → context & motivation.

---

## V2 — Technique: CONTEXT & MOTIVATION

**Prompt (change in bold):**
```
[V1 prompt, plus:]

**Context — the live schema (excerpts):
  workers(id PK, name, cnic, site_id, daily_rate, created_at)
  attendance(id PK, worker_id FK→workers.id, work_date, status, hours, marked_by)
  payroll_periods(id PK, period_start, period_end, locked)
This is a production database paying 50+ construction workers; ~10,000 rows
in attendance. Why this matters: wages are calculated from attendance on a
26-day cycle — if a record changes and nobody can prove who changed it and
what it was before, that's a labour dispute. Every change to attendance and
payroll_periods must be traceable: who, when, old value, new value.
Constraints: all existing rows must be preserved; the migration must run in
under 500 ms on 10k rows.**
```

**Output (representative excerpt):**
```sql
CREATE TABLE audit_log (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    table_name ENUM('attendance','payroll_periods') NOT NULL,
    record_id BIGINT UNSIGNED NOT NULL,
    action ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    changed_by VARCHAR(64) NOT NULL,
    changed_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_audit_record (table_name, record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
> *"…old_values/new_values as JSON capture the full before/after state, so a disputed attendance edit can be reconstructed exactly…"*

**Note — what changed in the output:** It designed for *my* problem: the table enum locks auditing to exactly the two dispute-sensitive tables, `old_values`/`new_values` JSON appeared because I explained the labour-dispute motivation — I never asked for those columns, the *why* produced them. The index on `(table_name, record_id)` anticipates the lookup pattern ("show me this record's history"). **Still failed:** the answer is a SQL blob wrapped in chatty prose — no rollback script, no house file format, nothing I can drop into my `migrations/` folder. **Next:** show it what my migration files actually look like → few-shot examples.

---

## V3 — Technique: FEW-SHOT EXAMPLES

**Prompt (change in bold):**
```
[V2 prompt, plus:]

**Match the house format of my existing migrations. Example (a real file
from the project):**

<example>
-- Migration: 014_add_site_id_to_workers
-- Author: Sara Arif | Date: 2026-03-02
-- Purpose: workers move between sites; payroll must know where hours accrued

-- ==== UP ====
ALTER TABLE workers
    ADD COLUMN site_id INT UNSIGNED NULL AFTER cnic;

-- ==== DOWN ====
ALTER TABLE workers
    DROP COLUMN site_id;
</example>
```

**Output (representative excerpt):**
```sql
-- Migration: 015_add_audit_log
-- Author: Sara Arif | Date: 2026-07-15
-- Purpose: attendance/payroll changes must be traceable (who, when,
--          old→new) to prevent labour disputes

-- ==== UP ====
CREATE TABLE audit_log ( … as V2 … );

-- ==== DOWN ====
DROP TABLE IF EXISTS audit_log;
```

**Note — what changed in the output:** House style, adopted exactly — the numbered filename continues my sequence (015 after 014), the header block matches field-for-field, and the UP/DOWN split appeared, giving me a rollback for free because the example demonstrated one. **Worth recording:** in my FL-05 ladder (Assignment 2), an example made prose output *worse* — the model photocopied the example's facts into my story. Here the same technique was the cleanest win of the ladder. The difference: this example carries **format** (file layout, sections), and the *facts* still come from the schema in V2 — there's nothing in a migration header to contaminate. Examples steer structure safely; they steer content dangerously. **Still failed:** nothing verifies the FL-01 criteria — no check that rows survived, no timing evidence. **Next:** demand the missing artifacts explicitly → output structure.

---

## V4 — Technique: OUTPUT STRUCTURE

**Prompt (change in bold):**
```
[V3 prompt, plus:]

**Structure the response in exactly four sections, using these XML tags:
<migration> the UP/DOWN file, house format </migration>
<verification> SQL I run before and after: row counts on every existing
  table, and how to time the migration </verification>
<risks> what could go wrong on a live 10k-row database, each with its
  mitigation </risks>
<assumptions> anything you assumed that I should confirm </assumptions>
No text outside these tags.**
```

**Output (representative excerpt):**
```xml
<verification>
-- BEFORE and AFTER — must match exactly:
SELECT COUNT(*) FROM workers;
SELECT COUNT(*) FROM attendance;
SELECT COUNT(*) FROM payroll_periods;
-- Timing: SET profiling = 1; … SHOW PROFILES;
</verification>
<risks>
1. CREATE TABLE takes a metadata lock — brief, but avoid running during
   payroll processing hours.
2. JSON columns grow: plan a retention/archival policy for audit_log.
</risks>
<assumptions>
- changed_by comes from the PHP session user, passed by application code.
- Trigger-based capture is a separate, later migration.
</assumptions>
```

**Note — what changed in the output:** The deliverable became complete and checkable — verification queries directly test FL-01 criterion (b) (row counts must match before/after), the timing method addresses criterion (c), and the assumptions section surfaced two decisions I hadn't made consciously (where `changed_by` comes from; triggers deferred). The prose disappeared because the tags left it nowhere to live. **Still failed:** the *reasoning* is shallow — the risks list is generic and the model jumped straight to SQL. It documented risks; it didn't let them shape the migration. **Next:** force the thinking to happen before the SQL → step decomposition.

---

## V5 — Technique: STEP DECOMPOSITION

**Prompt (change in bold):**
```
[V4 prompt, plus:]

**Work through these steps in order, showing each:
1. Restate the schema delta you are about to make.
2. List everything that could break on a LIVE 10k-row MySQL 8 database
   (locks, FK violations on existing rows, defaults, replication) — before
   writing any SQL.
3. Only then write the migration, mitigating each risk from step 2.
4. Write the rollback.
5. Write the verification.
6. Self-check: state pass/fail against my three criteria — no syntax
   errors, all rows preserved, under 500 ms on 10k rows — and say what
   you cannot verify from here.**
```

**Output (representative excerpt):**
```
Step 2 — what could break:
- CREATE TABLE acquires only a brief metadata lock: safe.
- BUT any future ALTER adding an FK column to `attendance` (10k rows) must
  be NULLable or backfilled — a NOT NULL addition without DEFAULT would
  fail on existing rows. This migration deliberately avoids touching
  existing tables at all: audit_log references records logically
  (table_name + record_id), not by FK, so no existing table is altered
  and criterion (b) cannot be violated by design.
…
Step 6 — self-check:
  (a) syntax: valid MySQL 8 — verifiable by --dry-run on a copy.  PASS
  (b) rows preserved: no existing table is touched.               PASS by design
  (c) <500 ms: CREATE TABLE on empty table is O(1), expected ~10–50 ms —
      but I cannot measure your hardware from here. Run the timing in
      <verification> to confirm.                                  EXPECTED PASS — measure
```

**Note — what changed in the output:** The design itself improved, not just the wrapping. Step 2 caught the FK-on-live-rows trap and *redesigned around it* — audit_log references records logically instead of by foreign key, so no existing table gets altered and criterion (b) becomes unbreakable by construction. In V4 that risk didn't even appear; enumerating hazards before writing SQL is what surfaced it. And the self-check refused to overclaim: "I cannot measure your hardware from here" is exactly the honesty my FL-01 criteria need. **Remaining limit:** the model can reason about 500 ms; only my machine can prove it. That's the correct division of labour — this is a "Collaborate with AI" task in FL-01 for precisely this reason.

---

## Cross-model comparison — final V5 prompt on Claude and ChatGPT

Same final prompt, both models, outputs side by side. Not "both were fine" — they diverged in four specific ways:

| Dimension | Claude | ChatGPT |
|---|---|---|
| **Tone** | Terse, spec-like; each step a labeled block, no filler between sections | Friendlier and chattier — added encouragement ("Great, let's make this production-safe!") and prose transitions between the tagged sections, despite "no text outside these tags" |
| **Structure** | Followed the 6 steps and 4 XML tags exactly; self-check rendered as a criterion-by-criterion table | Merged steps 1–2 into one narrative block and put half the verification inside `<risks>`; the structure was *mostly* there but needed re-sorting before I could file it |
| **Accuracy** | Stuck to scope: exactly the table specified, logical-reference design, correct MySQL 8 throughout | Also correct MySQL 8 — but added an unrequested index on `changed_at` and an extra `session_id` column "for good measure": useful ideas, but scope creep on a payroll database is how surprises happen |
| **Failure points** | Hedged honestly on the 500 ms criterion: "expected 10–50 ms; measure on your hardware" | Overclaimed: "this will comfortably run in under 500 ms ✅" stated as fact — it cannot know that; on a criterion that exists because payroll can't be wrong, unearned certainty is the worse failure |

**One thing ChatGPT did better:** it volunteered a trigger-based capture design (AFTER UPDATE triggers on `attendance` writing to `audit_log` automatically) as a follow-up option — a genuinely good architectural suggestion Claude never raised because Claude stayed strictly inside the spec. It's off-spec, so it didn't belong in this migration, but it earned a place in my backlog as migration 016.

**Verdict for this task:** Claude's output went into the project as-is; ChatGPT's needed ten minutes of re-sorting and de-scoping first. For production SQL where discipline beats creativity, the literal instruction-follower wins. For the "what should I build next" conversation, ChatGPT's tangent was the most valuable single paragraph either model produced.

---

## The final reusable template

For any schema-change task on a live database. Replace the `{braces}`; nothing personal to me remains.

```
You are a senior {DIALECT + VERSION} DBA who writes migrations for live
production systems and treats data loss as a career-ending event.

CONTEXT — the live schema (excerpts):
{paste the CREATE TABLE lines or column lists for every table involved}
This is a production database: {scale — rows, users}. Why this matters:
{the business consequence of getting it wrong — one sentence}.
Constraints: {your hard criteria, e.g. all rows preserved; runs under N ms}.

HOUSE FORMAT — match this example from my project:
<example>
{paste ONE real migration file — header comment, UP/DOWN sections,
naming convention}
</example>

STRUCTURE — respond in exactly these sections, no text outside them:
<migration> the UP/DOWN file, house format </migration>
<verification> SQL to run before and after: row counts on every existing
table, plus how to time the migration </verification>
<risks> what could go wrong live, each with its mitigation </risks>
<assumptions> anything you assumed that I should confirm </assumptions>

PROCESS — work through these steps in order, showing each:
1. Restate the schema delta.
2. List everything that could break on the live database (locks, FK
   violations on existing rows, defaults, replication) — BEFORE any SQL.
3. Write the migration, mitigating each risk from step 2.
4. Write the rollback.
5. Write the verification.
6. Self-check against my constraints — and say explicitly what you
   cannot verify from where you sit.
```

**Usage notes for a stranger:**
- The example must be a **format** example (file layout), never a content example — format examples anchor structure; content examples leak their facts into your output.
- Keep step 6's "say what you cannot verify" — it converts the model's overconfidence into a to-do list for you.
- Run `<verification>` yourself. The model reasons about your constraints; only your hardware proves them.

---

## Pass / revise self-check

| Criterion | Check |
|---|---|
| Five+ iterations beyond naive, each tied to a named technique | ✅ V1 role assignment · V2 context & motivation · V3 few-shot examples · V4 output structure · V5 step decomposition |
| Each note explains the observed output difference | ✅ "The dialect fixed itself without me listing a syntax rule" (V1), "old/new-value columns appeared because I explained the dispute motivation" (V2), "redesigned around the FK trap — criterion (b) unbreakable by construction" (V5) |
| Cross-model comparison says something specific | ✅ Four dimensions with concrete evidence: ChatGPT's unearned "✅ under 500 ms," scope-creep columns, merged steps; Claude's honest hedge; plus the one thing ChatGPT did better |
| Final template reusable without my personal context | ✅ Fully `{brace}`-parameterized — dialect, schema, stakes, house example all swappable |
| Work is on a real task from my FL-01 audit | ✅ FL-01 Target Task 1 verbatim, including its three measurable success criteria |
