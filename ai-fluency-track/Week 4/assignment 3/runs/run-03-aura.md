# Run 03 — AURA thread-isolation incident note

## Input

**Audience:** a developer maintaining the AURA chat project.

**Purpose:** record the observed state-isolation problem and what is actually known about the response.

**Facts**

- AURA is built on LangGraph StateGraph with persistent SQLite checkpointing.
- Under concurrent access, state bled between conversation threads.
- Sara diagnosed the thread-isolation failure.
- AI helped brainstorm edge cases, but concurrency behavior was verified manually.
- Provider 404 and rate-limit failures trigger a fallback instead of ending the chat.
- The project runs locally, its code is on GitHub, and Sara is the only user.
- It is portfolio depth, not client work.

**Constraints:** 140–180 words; Incident / Response / Current state / Unknowns; do not claim the root cause or fix mechanism unless supplied.

## Step 1 — Fact-ledger result

Seven facts accepted. Main risk: “diagnosed” does not provide the root cause or exact correction. Do not invent locks, connection settings, thread IDs, or transaction behavior.

## Step 2 — Draft 1 excerpt

Concurrent use exposed a thread-isolation failure in AURA: state from one conversation appeared in another while SQLite checkpointing persisted the graph.

## Step 3 — Critique

- **Unsupported:** no invented mechanism appears.
- **Distorted:** “concurrent use” is accurate, but do not imply production load.
- **Unclear:** distinguish manual verification from AI brainstorming.
- **Format:** current-user scope and missing root cause must be explicit.

## Step 4 — Revision change

Added the local/one-user status; stated the division between AI ideation and human verification; moved root cause and repair mechanism into unknowns.

## Step 5 — Final

### Incident

AURA uses LangGraph StateGraph with persistent SQLite checkpointing. Under concurrent access, state bled between conversation threads. This was a thread-isolation failure in a local portfolio project, not a production-client incident.

### Response

Sara diagnosed the isolation problem. AI helped brainstorm edge cases, but she verified the actual concurrency behavior manually. Provider failures are handled separately: a 404 or rate limit triggers a fallback instead of ending the chat.

### Current state

The project runs locally, the code is on GitHub, and Sara is its only user. It is evidence of debugging depth, not evidence of multi-user production scale.

### Unknowns

The fact brief does not name the root cause, the repair mechanism, or a repeatable concurrency test. Those details must come from the code and test evidence before this becomes an implementation runbook.

**Human check:** add the exact reproduction and fix only after checking the repository.  
**Status:** READY as an incident summary; not ready as a runbook.

