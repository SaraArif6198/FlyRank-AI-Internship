/**
 * Request Schemas
 * ───────────────
 * Zod validation for incoming POST /ai/ask requests.
 */
import { z } from "zod";

export const AskRequestSchema = z.object({
  question: z
    .string()
    .min(3, "Question must be at least 3 characters")
    .max(2000, "Question must be at most 2000 characters"),
});

export type AskRequest = z.infer<typeof AskRequestSchema>;
