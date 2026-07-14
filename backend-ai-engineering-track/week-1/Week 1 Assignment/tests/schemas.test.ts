/**
 * Schema Validation Tests
 * ───────────────────────
 * Tests that Zod schemas correctly accept valid data
 * and reject invalid data.
 */
import { describe, it, expect } from "vitest";
import { AiResponseSchema, PaperSchema, ApiEnvelopeSchema } from "../src/schemas/response.schema.js";
import { AskRequestSchema } from "../src/schemas/request.schema.js";

// ─────────────────────────────────────────────────────────
//  AskRequest Schema
// ─────────────────────────────────────────────────────────
describe("AskRequestSchema", () => {
  it("accepts a valid question", () => {
    const result = AskRequestSchema.safeParse({
      question: "What is cold start latency?",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty question", () => {
    const result = AskRequestSchema.safeParse({ question: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short question", () => {
    const result = AskRequestSchema.safeParse({ question: "Hi" });
    expect(result.success).toBe(false);
  });

  it("rejects a question exceeding 2000 chars", () => {
    const result = AskRequestSchema.safeParse({
      question: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing question field", () => {
    const result = AskRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
//  AiResponse Schema
// ─────────────────────────────────────────────────────────
describe("AiResponseSchema", () => {
  it("accepts a valid AI response", () => {
    const result = AiResponseSchema.safeParse({
      answer: "Cold start latency ranges from 10ms to several seconds.",
      sources: [
        {
          paperId: "li2022a",
          title: "Serverless computing: state-of-the-art",
          relevance: "Primary source on cold start measurements",
        },
      ],
      confidence: "high",
      toolsUsed: ["search_papers"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty answer (forced error path)", () => {
    const result = AiResponseSchema.safeParse({
      answer: "",
      sources: [],
      confidence: "high",
      toolsUsed: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence level", () => {
    const result = AiResponseSchema.safeParse({
      answer: "Some answer",
      sources: [],
      confidence: "very_high",
      toolsUsed: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing confidence field", () => {
    const result = AiResponseSchema.safeParse({
      answer: "Some answer",
      sources: [],
    });
    expect(result.success).toBe(false);
  });

  it("defaults sources and toolsUsed to empty arrays", () => {
    const result = AiResponseSchema.safeParse({
      answer: "Some answer",
      confidence: "low",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sources).toEqual([]);
      expect(result.data.toolsUsed).toEqual([]);
    }
  });
});

// ─────────────────────────────────────────────────────────
//  Paper Schema
// ─────────────────────────────────────────────────────────
describe("PaperSchema", () => {
  const validPaper = {
    id: "test2024",
    title: "Test Paper",
    authors: ["Author A"],
    year: 2024,
    venue: "Test Conference",
    publisher: "ACM",
    doi: "10.1234/test",
    url: "https://example.com/paper",
    themes: ["performance"],
    method: "Survey",
    platform: "AWS Lambda",
    contribution: "Key finding",
    limitation: "Small sample",
    abstract: "This paper studies...",
  };

  it("accepts a valid paper", () => {
    const result = PaperSchema.safeParse(validPaper);
    expect(result.success).toBe(true);
  });

  it("rejects a paper with invalid URL", () => {
    const result = PaperSchema.safeParse({
      ...validPaper,
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a paper missing required fields", () => {
    const result = PaperSchema.safeParse({
      id: "test",
      title: "Test",
    });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
//  ApiEnvelope Schema
// ─────────────────────────────────────────────────────────
describe("ApiEnvelopeSchema", () => {
  it("accepts a success envelope", () => {
    const result = ApiEnvelopeSchema.safeParse({
      success: true,
      data: {
        answer: "Answer here",
        sources: [],
        confidence: "medium",
        toolsUsed: [],
      },
      meta: {
        model: "claude-sonnet-4-20250514",
        provider: "anthropic",
        gateway: "https://api.portkey.ai/v1",
        durationMs: 1234,
      },
    });
    expect(result.success).toBe(true);
  });

  it("accepts an error envelope", () => {
    const result = ApiEnvelopeSchema.safeParse({
      success: false,
      error: "Something went wrong",
      meta: {
        model: "claude-sonnet-4-20250514",
        provider: "anthropic",
        gateway: "https://api.portkey.ai/v1",
        durationMs: 50,
      },
    });
    expect(result.success).toBe(true);
  });
});
