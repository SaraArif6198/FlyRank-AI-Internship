/**
 * Environment Configuration
 * ─────────────────────────
 * Validates and exports all env vars through Zod.
 * Nothing else in the codebase reads process.env directly.
 */
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  // AI / Model
  AI_MODEL: z.string().default("gemini-2.0-flash"),
  AI_PROVIDER: z.string().default("google"),

  // Portkey Gateway
  PORTKEY_API_KEY: z.string().min(1, "PORTKEY_API_KEY is required"),
  PORTKEY_VIRTUAL_KEY: z.string().min(1, "PORTKEY_VIRTUAL_KEY is required"),
  PORTKEY_GATEWAY_URL: z
    .string()
    .url()
    .default("https://api.portkey.ai/v1"),

  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:\n",
      result.error.flatten().fieldErrors
    );
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
