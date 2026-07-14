/**
 * Tool Factory
 * ────────────
 * Creates AI-callable tools with Zod-validated inputs.
 * Each tool receives a shared ToolContext (database, papers array).
 */
import { z } from "zod";
import type Database from "better-sqlite3";
import type { Paper } from "../schemas/response.schema.js";
import { validateDynamicSql } from "../guardrails/sql.guardrail.js";

// ── Tool Context ────────────────────────────────────────────
export interface ToolContext {
  db: Database.Database;
  papers: Paper[];
}

// ── Tool Definition ─────────────────────────────────────────
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  execute: (input: any, ctx: ToolContext) => any;
}

// ── Claude-compatible tool spec ─────────────────────────────
export interface ClaudeToolSpec {
  name: string;
  description: string;
  input_schema: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════
//  TOOL 1: search_papers
// ═══════════════════════════════════════════════════════════
const SearchPapersInput = z.object({
  query: z.string().min(1, "Search query must not be empty"),
  theme: z
    .string()
    .optional()
    .describe("Optional theme filter: performance, security, architecture, scheduling, applications"),
  year_min: z.number().optional().describe("Minimum publication year"),
  year_max: z.number().optional().describe("Maximum publication year"),
});

export const searchPapersTool: ToolDefinition = {
  name: "search_papers",
  description:
    "Search the literature review papers by keyword, theme, or year range. Returns matching papers with titles, authors, year, and key contributions.",
  inputSchema: SearchPapersInput,
  execute: (input: z.infer<typeof SearchPapersInput>, ctx: ToolContext) => {
    const parsed = SearchPapersInput.parse(input);
    let results = ctx.papers;

    // Keyword search across title, abstract, contribution
    const q = parsed.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.contribution.toLowerCase().includes(q) ||
        p.themes.some((t) => t.toLowerCase().includes(q))
    );

    // Theme filter
    if (parsed.theme) {
      const theme = parsed.theme.toLowerCase();
      results = results.filter((p) =>
        p.themes.some((t) => t.toLowerCase() === theme)
      );
    }

    // Year range
    if (parsed.year_min) {
      results = results.filter((p) => p.year >= parsed.year_min!);
    }
    if (parsed.year_max) {
      results = results.filter((p) => p.year <= parsed.year_max!);
    }

    return {
      count: results.length,
      papers: results.map((p) => ({
        id: p.id,
        title: p.title,
        authors: p.authors,
        year: p.year,
        themes: p.themes,
        contribution: p.contribution,
      })),
    };
  },
};

// ═══════════════════════════════════════════════════════════
//  TOOL 2: get_paper_by_id
// ═══════════════════════════════════════════════════════════
const GetPaperByIdInput = z.object({
  id: z.string().min(1, "Paper ID must not be empty"),
});

export const getPaperByIdTool: ToolDefinition = {
  name: "get_paper_by_id",
  description:
    "Retrieve full details of a specific paper by its ID (e.g., 'hassan2021', 'li2022a'). Returns all metadata including abstract, contribution, limitation, and themes.",
  inputSchema: GetPaperByIdInput,
  execute: (input: z.infer<typeof GetPaperByIdInput>, ctx: ToolContext) => {
    const parsed = GetPaperByIdInput.parse(input);
    const paper = ctx.papers.find((p) => p.id === parsed.id);
    if (!paper) {
      return { found: false, error: `No paper found with ID: ${parsed.id}` };
    }
    return { found: true, paper };
  },
};

// ═══════════════════════════════════════════════════════════
//  TOOL 3: query_papers (guarded SQL)
// ═══════════════════════════════════════════════════════════
const QueryPapersInput = z.object({
  sql: z
    .string()
    .min(1, "SQL query must not be empty")
    .describe(
      "A SELECT query against the 'papers' table. Only read-only queries are allowed. Available columns: id, title, authors, year, venue, publisher, doi, url, themes, method, platform, contribution, limitation, abstract."
    ),
});

export const queryPapersTool: ToolDefinition = {
  name: "query_papers",
  description:
    "Run a safe, read-only SQL query against the papers database. Only SELECT statements on the 'papers' table are allowed. The guardrail blocks any mutation, injection, or dangerous SQL patterns.",
  inputSchema: QueryPapersInput,
  execute: (input: z.infer<typeof QueryPapersInput>, ctx: ToolContext) => {
    const parsed = QueryPapersInput.parse(input);

    // ① Guardrail check
    const validation = validateDynamicSql(parsed.sql);
    if (!validation.safe) {
      return {
        blocked: true,
        reason: validation.reason,
        hint: "Only SELECT queries against the papers table are permitted.",
      };
    }

    // ② Execute
    try {
      const rows = ctx.db.prepare(parsed.sql).all();
      return { blocked: false, rowCount: rows.length, rows };
    } catch (err: any) {
      return {
        blocked: false,
        error: `SQL execution error: ${err.message}`,
      };
    }
  },
};

// ═══════════════════════════════════════════════════════════
//  TOOL REGISTRY
// ═══════════════════════════════════════════════════════════
export function createToolRegistry(): ToolDefinition[] {
  return [searchPapersTool, getPaperByIdTool, queryPapersTool];
}

/**
 * Converts our tool definitions into the format Claude expects.
 */
export function toClaudeToolSpecs(tools: ToolDefinition[]): ClaudeToolSpec[] {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: zodToJsonSchema(t.inputSchema),
  }));
}

/**
 * Minimal Zod-to-JSON-Schema converter for Claude tool specs.
 * Handles the subset of Zod types we actually use.
 */
function zodToJsonSchema(schema: z.ZodType<any>): Record<string, any> {
  // Unwrap ZodObject
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: Record<string, any> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      const zodValue = value as z.ZodType<any>;
      properties[key] = zodFieldToJson(zodValue);

      // Check if required (not optional)
      if (!(zodValue instanceof z.ZodOptional)) {
        required.push(key);
      }
    }

    return {
      type: "object",
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  return { type: "object" };
}

function zodFieldToJson(field: z.ZodType<any>): Record<string, any> {
  if (field instanceof z.ZodString) {
    const result: Record<string, any> = { type: "string" };
    if (field.description) result.description = field.description;
    return result;
  }
  if (field instanceof z.ZodNumber) {
    const result: Record<string, any> = { type: "number" };
    if (field.description) result.description = field.description;
    return result;
  }
  if (field instanceof z.ZodOptional) {
    // Zod v4: unwrap() returns internal $ZodType — cast is safe here
    return zodFieldToJson(field.unwrap() as z.ZodType<any>);
  }
  if (field instanceof z.ZodArray) {
    // Zod v4: .element returns internal $ZodType — cast is safe here
    return { type: "array", items: zodFieldToJson(field.element as z.ZodType<any>) };
  }
  return { type: "string" };
}
