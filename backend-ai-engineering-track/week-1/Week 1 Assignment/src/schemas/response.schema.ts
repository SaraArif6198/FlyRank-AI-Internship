/**
 * Response Schemas
 * ────────────────
 * Zod schemas that define and validate every response shape
 * leaving the /ai/ask endpoint. Nothing unvalidated leaves this API.
 */
import { z } from "zod";

// ── Individual paper returned by tools ──────────────────────
export const PaperSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  year: z.number(),
  venue: z.string(),
  publisher: z.string(),
  doi: z.string(),
  url: z.string().url(),
  themes: z.array(z.string()),
  method: z.string(),
  platform: z.string(),
  contribution: z.string(),
  limitation: z.string(),
  abstract: z.string(),
});

export type Paper = z.infer<typeof PaperSchema>;

// ── Structured AI response ──────────────────────────────────
export const AiResponseSchema = z.object({
  answer: z.string().min(1, "Answer must not be empty"),
  sources: z
    .array(
      z.object({
        paperId: z.string(),
        title: z.string(),
        relevance: z.string(),
      })
    )
    .default([]),
  confidence: z.enum(["high", "medium", "low"]),
  toolsUsed: z.array(z.string()).default([]),
});

export type AiResponse = z.infer<typeof AiResponseSchema>;

// ── Envelope returned to the client ─────────────────────────
export const ApiEnvelopeSchema = z.object({
  success: z.boolean(),
  data: AiResponseSchema.optional(),
  error: z.string().optional(),
  meta: z.object({
    model: z.string(),
    provider: z.string(),
    gateway: z.string(),
    durationMs: z.number(),
  }),
});

export type ApiEnvelope = z.infer<typeof ApiEnvelopeSchema>;
