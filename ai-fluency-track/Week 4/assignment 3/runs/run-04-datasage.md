# Run 04 — DataSage pipeline behavior note

## Input

**Audience:** a developer evaluating the DataSage workflow.

**Purpose:** explain the three-node handoff, dirty-input behavior, performance evidence, and evidence boundary.

**Facts**

- DataSage is a three-node LangGraph pipeline: analysis, narrative, visualization.
- Nodes pass structured JSON validated against the frontend schema.
- Empty or corrupted CSVs return structured error states instead of crashing.
- Hostile test data included nulls and outliers.
- End-to-end runs finish in under 15 seconds.
- It was also run on public Kaggle datasets and stayed under 15 seconds with no crashes.
- The specific Kaggle datasets were not recorded.
- It is a portfolio-depth build.

**Constraints:** 150–190 words; Flow / Failure behavior / Evidence / Limitation; do not claim universal CSV support.

## Step 1 — Fact-ledger result

Eight facts accepted. Risk flags: “under 15 seconds” lacks hardware/sample-size context; unnamed Kaggle datasets reduce reproducibility; no universal reliability claim.

## Step 2 — Draft 1 excerpt

DataSage separates exploratory analysis into three LangGraph nodes. Analysis produces structured JSON for the narrative and visualization stages, and the payload is validated against the frontend schema.

## Step 3 — Critique

- **Unsupported:** the input says nodes pass JSON, but not that analysis alone produces it for both later nodes. Generalize the handoff.
- **Distorted:** “failure resistant” would overstate the tested cases; avoid.
- **Unclear:** distinguish synthetic hostile data from public dataset runs.
- **Format:** performance context and dataset-name limitation required.

## Step 4 — Revision change

Changed the handoff to node-to-node structured JSON; separated two evidence sets; scoped the performance number and reproducibility limit.

## Step 5 — Final

### Flow

DataSage divides exploratory data analysis into three LangGraph nodes: analysis, narrative, and visualization. The nodes hand off structured JSON, and the data passed to the frontend is validated against its schema.

### Failure behavior

Empty or corrupted CSVs return structured error states instead of crashing. Testing also used hostile inputs containing nulls and outliers.

### Evidence

Recorded end-to-end runs finish in under 15 seconds. The pipeline was also exercised on public Kaggle datasets and remained under 15 seconds without crashes in those runs.

### Limitation

The benchmark has no recorded hardware, file-size, or row-count context, so it must not be generalized to every CSV. The specific Kaggle datasets were not recorded, which prevents exact reproduction. This is portfolio-depth evidence, not a client deployment.

**Human check:** record dataset names, input sizes, hardware, and fresh timings in the next benchmark.  
**Status:** READY with the stated evidence limits.

