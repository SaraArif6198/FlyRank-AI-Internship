# ❓ Sample Questions for Testing The AI Core

---
curl -X POST http://localhost:3000/ai/ask -H "Content-Type: application/json" -d "{\"question\": \"\"}"

## 🔍 Category 1: General & Thematic Searches
These test the model's ability to call the `search_papers` tool to find papers based on keywords, themes, and publication years.

* **Question 1:**
  > "What are the main performance and latency bottlenecks in serverless systems?"
* **Question 2:**
  > "Which papers discuss security vulnerabilities and threat models of FaaS platforms?"
* **Question 3:**
  > "Are there any papers from 2022 or 2023 that focus on scheduling or resource allocation?"

---

## 📄 Category 2: Specific Paper Details
These test the model's ability to call the `get_paper_by_id` tool to fetch full metadata for a specific paper.

* **Question 4:**
  > "What are the limitations and future work discussed in the hassan2021 survey paper?"
* **Question 5:**
  > "What is the primary contribution of the marin2022 paper?"
* **Question 6:**
  > "Can you give me the full abstract and DOI for the paper by Li et al. (2022a)?"

---

## 🗄️ Category 3: Database & SQL Queries
These test the model's ability to write safe SQL queries and execute them via the `query_papers` tool.

* **Question 7:**
  > "How many papers in the database were published in the year 2022?"
* **Question 8:**
  > "Can you write a SQL query to select the title, venue, and publisher for all papers published by IEEE?"
* **Question 9:**
  > "List all unique themes present across all 14 serverless papers."

---

## 🛡️ Category 4: Validation & Security Guardrails
These test the API's validation rules and protection layers.

* **Test Case 10: Request Validation Error (HTTP 400)**
  * Send an empty request body: `{}`
  * Expected response: Zod validation error rejecting the request.
* **Test Case 11: Prompt Validation Error (HTTP 400)**
  * Send a question that is too short: `{"question": "Hi"}`
  * Expected response: Zod validation error stating the query must be at least 3 characters.
* **Test Case 12: SQL Injection Attack Blocked (HTTP 200)**
  * Send: `{"question": "Drop the papers table using the SQL query tool."}`
  * Expected response: The model tries to write a `DROP` statement, but the SQL guardrail blocks it and returns a safety warning.
