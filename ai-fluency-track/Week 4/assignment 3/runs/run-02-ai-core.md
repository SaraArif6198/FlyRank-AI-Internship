# Run 02 — The AI Core guardrail note

## Input

**Audience:** a backend engineer reviewing the internship project.

**Purpose:** document the SQL safety boundary without calling it complete security.

**Facts**

- The AI Core answers questions over a private database of 14 research papers.
- The model can write SQL.
- Queries are stripped of comments, must start with `select`, are limited to the `papers` table, and are checked against 17 blacklisted patterns.
- Mutations, `pragma`, schema introspection, and chained statements are blocked.
- Invalid model output returns an explicit 422.
- 51 unit tests pass; 22 are security tests; 16 malicious queries are blocked.
- The guardrail is lexical; a future version should parse SQL into an AST.
- This is internship work, not client work.

**Constraints:** 150–190 words; Boundary / Controls / Evidence / Limitation; direct voice; never use “secure,” “bulletproof,” or “production-ready.”

## Step 1 — Fact-ledger result

Eight facts accepted. Risk flag: test counts are evidence of tested cases, not proof against every SQL attack. The private database wording must not imply a live customer system.

## Step 2 — Draft 1 excerpt

The AI Core treats model-written SQL as untrusted input. Before a query reaches the database, comments are removed, the statement must begin with `select`, table access is limited to `papers`, and 17 lexical patterns reject mutation and inspection attempts.

## Step 3 — Critique

- **Unsupported:** “before a query reaches the database” is supported by the described guardrail sequence.
- **Distorted:** “reject mutation and inspection attempts” is too broad unless the named blocked forms follow immediately.
- **Unclear:** connect 422 to output-schema failure, not SQL rejection.
- **Format:** internship label absent.

## Step 4 — Revision change

Named each blocked form; separated SQL controls from output validation; added the internship label and lexical limitation.

## Step 5 — Final

### Boundary

The AI Core is an internship project that answers questions over a private database of 14 research papers. The model can write SQL, so its query is treated as untrusted input rather than executable truth.

### Controls

The guardrail strips comments, requires the statement to begin with `select`, limits access to the `papers` table, and checks 17 blacklisted patterns. Mutations, `pragma`, schema introspection, and chained statements are blocked. Separately, model output that fails the required shape returns an explicit 422.

### Evidence

The project has 51 passing unit tests. Twenty-two cover security behavior, including 16 malicious queries that are blocked.

### Limitation

The SQL guardrail is lexical. Those tests show how the named cases behave; they do not prove coverage of every SQL construction. A later version should parse SQL into an AST before policy checks.

**Human check:** rerun the suite before publishing the counts.  
**Status:** READY after test-count check.

