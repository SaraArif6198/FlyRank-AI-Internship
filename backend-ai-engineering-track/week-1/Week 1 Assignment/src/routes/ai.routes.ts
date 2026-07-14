/**
 * AI Routes
 * ─────────
 * POST /ai/ask — the single endpoint for this service.
 */
import { Router, type Request, type Response } from "express";
import { AskRequestSchema } from "../schemas/request.schema.js";
import { ApiEnvelopeSchema, type ApiEnvelope } from "../schemas/response.schema.js";
import { askAi, AiOutputError } from "../services/ai.service.js";
import { getDb } from "../db/database.js";
import { readFileSync } from "fs";
import { join } from "path";
import type { Paper } from "../schemas/response.schema.js";
import { env } from "../config/env.js";

const router = Router();

// Load papers for tool context
function loadPapers(): Paper[] {
  const raw = readFileSync(
    join(process.cwd(), "data", "papers.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

router.post("/ask", async (req: Request, res: Response): Promise<void> => {
  const start = Date.now();

  // ① Validate request body
  const bodyResult = AskRequestSchema.safeParse(req.body);
  if (!bodyResult.success) {
    const envelope: ApiEnvelope = {
      success: false,
      error: `Invalid request: ${JSON.stringify(
        bodyResult.error.flatten().fieldErrors
      )}`,
      meta: {
        model: env.AI_MODEL,
        provider: env.AI_PROVIDER,
        gateway: env.PORTKEY_GATEWAY_URL,
        durationMs: Date.now() - start,
      },
    };
    res.status(400).json(envelope);
    return;
  }

  try {
    // ② Build tool context
    const db = getDb();
    const papers = loadPapers();
    const ctx = { db, papers };

    // ③ Call AI
    const result = await askAi(bodyResult.data.question, ctx);

    // ④ Build and validate response envelope
    const envelope: ApiEnvelope = {
      success: true,
      data: result,
      meta: {
        model: env.AI_MODEL,
        provider: env.AI_PROVIDER,
        gateway: env.PORTKEY_GATEWAY_URL,
        durationMs: Date.now() - start,
      },
    };

    // Final validation before sending
    const validated = ApiEnvelopeSchema.parse(envelope);
    res.status(200).json(validated);
  } catch (err: any) {
    // ⑤ Forced error path — AiOutputError
    const status = err instanceof AiOutputError ? 422 : 500;
    const envelope: ApiEnvelope = {
      success: false,
      error: err.message,
      meta: {
        model: env.AI_MODEL,
        provider: env.AI_PROVIDER,
        gateway: env.PORTKEY_GATEWAY_URL,
        durationMs: Date.now() - start,
      },
    };
    res.status(status).json(envelope);
  }
});

export default router;
