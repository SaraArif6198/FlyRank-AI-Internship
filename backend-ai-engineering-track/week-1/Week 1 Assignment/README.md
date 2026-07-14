# The AI Core: Calling the Model Like an Engineer

A production-grade backend AI service designed for the FlyRank Backend AI Engineering assignment (Week 1). This service implements a modular, validated, tool-augmented API that routes model calls (Google Gemini, Groq, or Anthropic Claude) through the Portkey gateway, operating over an academic literature database.

## Dataset

The service operates over a custom dataset of 14 peer-reviewed research papers from a literature review database, covering technical evaluations, security analysis, architectural reviews, and applications. Note that the raw data source file (data/papers.json) is gitignored for privacy and copyright reasons.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| Validation | Zod (request, response, tool inputs, env) |
| AI Model | Swappable: Anthropic Claude, Google Gemini, or Groq (via Portkey gateway using OpenAI SDK format) |
| Database | SQLite (via better-sqlite3) |
| Data | Local JSON (data/papers.json) auto-seeded to SQLite |
| Tests | Vitest |

## Architecture

```
POST /ai/ask
    |
    +-- Zod validates request body
    |
    +-- Builds ToolContext { db, papers[] }
    |
    +-- Calls LLM via Portkey gateway (using OpenAI SDK)
    |   +-- Tool-use loop (max 5 iterations)
    |   |   +-- search_papers  -> keyword/theme/year search over papers
    |   |   +-- get_paper_by_id -> full paper details by ID
    |   |   +-- query_papers   -> guardrailed SQL against papers table
    |   |       +-- validateDynamicSql()
    |   +-- Final text response
    |
    +-- Zod validates model output (AiResponseSchema)
    |   +-- Invalid output -> AiOutputError (forced error path, HTTP 422)
    |
    +-- Zod validates API envelope before sending
```

## How This Satisfies Each Requirement

### 1. POST /ai/ask Endpoint
- File: src/routes/ai.routes.ts
- Exposes a single endpoint at POST /ai/ask that accepts a JSON body with a question and returns a structured, validated JSON envelope.

### 2. Provider-Agnostic LLM Routing via Portkey
- File: src/services/ai.service.ts
- Uses the OpenAI SDK formatted for Portkey's gateway. The client passes custom metadata headers (x-portkey-metadata) on every request, tracking details like the environment and assignment name. It is fully model-agnostic, supporting one-line swaps between Google Gemini, Anthropic Claude, and Groq by simply updating the environment variables.

### 3. Environment Configuration
- File: src/config/env.ts
- All configurations (PORTKEY_API_KEY, PORTKEY_VIRTUAL_KEY, AI_MODEL, AI_PROVIDER, PORTKEY_GATEWAY_URL, PORT, NODE_ENV) are loaded via a Zod-validated loader. There are no hardcoded secrets in the codebase. Swapping models is done by updating the configuration values.

### 4. Structured JSON Output Validated with Zod
- File: src/schemas/response.schema.ts
- AiResponseSchema validates the fields: answer, sources (containing paperId, title, and relevance), confidence, and toolsUsed. The API response envelope is validated through ApiEnvelopeSchema before leaving the server.

### 5. Tool Factory with ToolContext
- File: src/tools/tool.factory.ts
- ToolContext interface provides the database connection and papers array to every tool. The createToolRegistry function returns all tools bound to the active context.

### 6. Three Tools Over Local Data
- search_papers: Keyword, theme, and year-range search across the literature review database.
- get_paper_by_id: Retrieves full metadata for a specific academic paper.
- query_papers: Executes guardrailed read-only SQL against the papers SQLite database table.

### 7. Every Tool Input Validated with Zod
- Each tool has a Zod schema (SearchPapersInput, GetPaperByIdInput, QueryPapersInput) that parses inputs before execution. Invalid inputs throw ZodError.

### 8. SQL Guardrail (validateDynamicSql)
- File: src/guardrails/sql.guardrail.ts
- Whitelist rule: only SELECT queries against the papers table are allowed.
- Blacklist rule: blocks queries containing DROP, DELETE, INSERT, UPDATE, ALTER, EXEC, PRAGMA, ATTACH, load_extension, SQL comments, semicolon chaining, sqlite_master, readfile, or writefile.
- Returns an object indicating if the query is safe along with any blocking reasons.

### 9. Forced Error Path
- File: src/services/ai.service.ts
- If the model returns non-JSON or JSON that fails validation against AiResponseSchema, the service throws an AiOutputError. The Express route handler catches this and returns an HTTP 422 response.

### 10. Tests
- 51 tests across 3 test files, all passing:
  - tests/schemas.test.ts: 15 tests for request, response, paper, and envelope schema validation.
  - tests/sql-guardrail.test.ts: 22 tests (6 safe, 16 malicious SQL patterns).
  - tests/tools.test.ts: 14 tests for tool execution, Zod input validation, registry, and specs generation.

## Setup & Usage

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Windows
copy .env.example .env
# Linux/macOS
cp .env.example .env

# Edit .env with your actual API keys
```

### 3. Run Tests
```bash
npm test
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Make a Request
```bash
curl -X POST http://localhost:3000/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the main security challenges?"}'
```

### Example Response
```json
{
  "success": true,
  "data": {
    "answer": "The main security challenges include...",
    "sources": [
      {
        "paperId": "citation-id-1",
        "title": "Security Analysis of Distributed Environments",
        "relevance": "Primary source on threat taxonomy"
      }
    ],
    "confidence": "high",
    "toolsUsed": ["search_papers", "get_paper_by_id"]
  },
  "meta": {
    "model": "gemini-2.0-flash",
    "provider": "google",
    "gateway": "https://api.portkey.ai/v1",
    "durationMs": 1421
  }
}
```

## Design Decisions

1. App factory pattern: Express app creation is separated from the server port listener so tests can import the app without port conflicts.
2. Singleton database: SQLite is initialized once and reused, with a closeDb function for clean test teardown.
3. Defense-in-depth SQL guardrail: Combined whitelist and blacklist rules to ensure maximum security against SQL injection.
4. Zod everywhere: Input validation at the environment, request, tool, model, and response envelope boundaries.
5. ToolContext injection: Tools receive database and papers context as parameters instead of importing global state, facilitating modular testing.
6. AiOutputError: Custom error class representing model schema mismatch, mapped to HTTP 422 in the Express router.

## Test Results

```
tests/sql-guardrail.test.ts  (22 tests) 
tests/schemas.test.ts        (15 tests)
tests/tools.test.ts          (14 tests)

Test Files  3 passed (3)
     Tests  51 passed (51)
```
