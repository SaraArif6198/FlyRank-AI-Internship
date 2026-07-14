/**
 * Tool Validation Tests
 * ─────────────────────
 * Tests that each tool validates its inputs with Zod
 * and returns correct results.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import {
  searchPapersTool,
  getPaperByIdTool,
  queryPapersTool,
  createToolRegistry,
  toClaudeToolSpecs,
  type ToolContext,
} from "../src/tools/tool.factory.js";
import { getDb, closeDb } from "../src/db/database.js";
import type { Paper } from "../src/schemas/response.schema.js";

let ctx: ToolContext;

beforeAll(() => {
  const raw = readFileSync(join(process.cwd(), "data", "papers.json"), "utf-8");
  const papers: Paper[] = JSON.parse(raw);
  const db = getDb();
  ctx = { db, papers };
});

afterAll(() => {
  closeDb();
});

// ─────────────────────────────────────────────────────────
//  search_papers
// ─────────────────────────────────────────────────────────
describe("search_papers tool", () => {
  it("finds papers matching a keyword", () => {
    const result = searchPapersTool.execute(
      { query: "cold start" },
      ctx
    );
    expect(result.count).toBeGreaterThan(0);
    expect(result.papers[0]).toHaveProperty("id");
    expect(result.papers[0]).toHaveProperty("title");
  });

  it("filters by theme", () => {
    const result = searchPapersTool.execute(
      { query: "serverless", theme: "security" },
      ctx
    );
    expect(result.count).toBeGreaterThan(0);
    for (const p of result.papers) {
      expect(p.themes).toContain("security");
    }
  });

  it("filters by year range", () => {
    const result = searchPapersTool.execute(
      { query: "serverless", year_min: 2022, year_max: 2023 },
      ctx
    );
    for (const p of result.papers) {
      expect(p.year).toBeGreaterThanOrEqual(2022);
      expect(p.year).toBeLessThanOrEqual(2023);
    }
  });

  it("returns empty results for nonexistent keywords", () => {
    const result = searchPapersTool.execute(
      { query: "quantum_blockchain_ai_buzzword" },
      ctx
    );
    expect(result.count).toBe(0);
    expect(result.papers).toHaveLength(0);
  });

  it("rejects empty query (Zod validation)", () => {
    expect(() =>
      searchPapersTool.execute({ query: "" }, ctx)
    ).toThrow();
  });
});

// ─────────────────────────────────────────────────────────
//  get_paper_by_id
// ─────────────────────────────────────────────────────────
describe("get_paper_by_id tool", () => {
  it("returns a paper for valid ID", () => {
    const result = getPaperByIdTool.execute({ id: "hassan2021" }, ctx);
    expect(result.found).toBe(true);
    expect(result.paper.title).toContain("Survey on serverless");
  });

  it("returns not found for invalid ID", () => {
    const result = getPaperByIdTool.execute({ id: "nonexistent99" }, ctx);
    expect(result.found).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects empty ID (Zod validation)", () => {
    expect(() =>
      getPaperByIdTool.execute({ id: "" }, ctx)
    ).toThrow();
  });
});

// ─────────────────────────────────────────────────────────
//  query_papers (SQL tool)
// ─────────────────────────────────────────────────────────
describe("query_papers tool", () => {
  it("executes a safe SELECT query", () => {
    const result = queryPapersTool.execute(
      { sql: "SELECT id, title FROM papers WHERE year > 2020" },
      ctx
    );
    expect(result.blocked).toBe(false);
    expect(result.rowCount).toBeGreaterThan(0);
  });

  it("blocks a DROP TABLE attempt", () => {
    const result = queryPapersTool.execute(
      { sql: "DROP TABLE papers" },
      ctx
    );
    expect(result.blocked).toBe(true);
    expect(result.reason).toBeDefined();
  });

  it("blocks DELETE via tool input", () => {
    const result = queryPapersTool.execute(
      { sql: "DELETE FROM papers WHERE id = 'test'" },
      ctx
    );
    expect(result.blocked).toBe(true);
  });

  it("rejects empty SQL (Zod validation)", () => {
    expect(() =>
      queryPapersTool.execute({ sql: "" }, ctx)
    ).toThrow();
  });
});

// ─────────────────────────────────────────────────────────
//  Tool Registry & Claude Specs
// ─────────────────────────────────────────────────────────
describe("Tool Registry", () => {
  it("creates a registry with 3 tools", () => {
    const tools = createToolRegistry();
    expect(tools).toHaveLength(3);
    expect(tools.map((t) => t.name)).toEqual([
      "search_papers",
      "get_paper_by_id",
      "query_papers",
    ]);
  });

  it("converts to Claude tool specs with correct shape", () => {
    const tools = createToolRegistry();
    const specs = toClaudeToolSpecs(tools);
    expect(specs).toHaveLength(3);
    for (const spec of specs) {
      expect(spec).toHaveProperty("name");
      expect(spec).toHaveProperty("description");
      expect(spec).toHaveProperty("input_schema");
      expect(spec.input_schema.type).toBe("object");
    }
  });
});
