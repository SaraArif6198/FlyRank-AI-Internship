# Workflow diagram

```mermaid
flowchart LR
    A[New fact brief] --> B[1 · Intake]
    B -->|Numbered fact ledger only| C[2 · Draft]
    C -->|Draft with inline fact IDs| D[3 · Adversarial critique]
    D -->|Findings + prescribed changes| E[4 · Revise]
    E -->|Draft 2 + change log| F[5 · Verify & format]
    F -->|Final + human checks + status| G{Human gate}
    G -->|Facts verified| H[Ship]
    G -->|Missing or stale fact| I[Answer with source or cut claim]
    I --> B
```

## Handoff contract

| From | To | Required handoff | What is deliberately excluded |
|---|---|---|---|
| Input | Intake | Audience, purpose, facts, constraints, output format | Unstated background knowledge |
| Intake | Draft | Numbered fact ledger + open questions | Plausible guesses |
| Draft | Critique | Draft with inline `[F#]` citations + ledger | Clean copy that hides provenance |
| Critique | Revise | Unsupported/distorted/unclear/format findings | Vague “make it better” feedback |
| Revise | Verify | Draft 2 + change log + unresolved list | Silent edits |
| Verify | Human | Clean final + human-check list + coverage + status | Automatic publication |

