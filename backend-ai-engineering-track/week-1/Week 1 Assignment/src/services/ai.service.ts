/**
 * AI Service
 * ──────────
 * Orchestrates model calls through Portkey gateway using OpenAI SDK format.
 * Portkey translates requests to the target provider (Google Gemini).
 * Handles the tool-use loop and validates model output with Zod.
 */
import OpenAI from "openai";
import { env } from "../config/env.js";
import {
  createToolRegistry,
  toClaudeToolSpecs,
  type ToolContext,
} from "../tools/tool.factory.js";
import { AiResponseSchema, type AiResponse } from "../schemas/response.schema.js";

// ── System prompt ───────────────────────────────────────────
const SYSTEM_PROMPT = `You are a research assistant specializing in serverless computing literature.
You have access to a database of 14 peer-reviewed papers from a literature review on serverless computing.

When answering questions:
1. Use the available tools to search and retrieve paper data. You can make multiple tool calls if needed.
2. Always cite specific papers by ID when making claims.
3. Be precise about what the evidence supports vs. what is speculative.

Only when you are ready to return your final answer (after all tool calls are complete), your response MUST be a valid JSON matching this exact schema:
{
  "answer": "Your detailed answer here",
  "sources": [{"paperId": "e.g. hassan2021", "title": "Paper title", "relevance": "Why this paper is relevant"}],
  "confidence": "high" | "medium" | "low",
  "toolsUsed": ["tool_name_1", "tool_name_2"]
}

Return ONLY the JSON object for your final answer, no markdown fences, no extra text.`;

// ── Client factory ──────────────────────────────────────────
function createClient(): OpenAI {
  return new OpenAI({
    apiKey: env.PORTKEY_API_KEY,
    baseURL: env.PORTKEY_GATEWAY_URL,
    defaultHeaders: {
      "x-portkey-api-key": env.PORTKEY_API_KEY,
      "x-portkey-virtual-key": env.PORTKEY_VIRTUAL_KEY,
      "x-portkey-provider": env.AI_PROVIDER,
      "x-portkey-metadata": JSON.stringify({
        environment: env.NODE_ENV,
        user_id: "student-assignment-1",
        assignment: "AI-Core-Week-1"
      }),
    },
  });
}

// ── Convert our tool specs to OpenAI function format ────────
function toOpenAiTools(tools: ReturnType<typeof createToolRegistry>): OpenAI.Chat.Completions.ChatCompletionTool[] {
  const specs = toClaudeToolSpecs(tools);
  return specs.map((spec) => ({
    type: "function" as const,
    function: {
      name: spec.name,
      description: spec.description,
      parameters: spec.input_schema,
    },
  }));
}

// ── Main ask function ───────────────────────────────────────
export async function askAi(
  question: string,
  ctx: ToolContext
): Promise<AiResponse> {
  const client = createClient();
  const tools = createToolRegistry();
  const openAiTools = toOpenAiTools(tools);
  const toolsUsed: string[] = [];

  // Build initial messages
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: question },
  ];

  // ── Tool-use loop (max 5 iterations) ────────────────────
  let iterations = 0;
  const MAX_ITERATIONS = 5;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await client.chat.completions.create({
      model: env.AI_MODEL,
      max_tokens: 4096,
      tools: openAiTools,
      messages,
    });

    const choice = response.choices[0];
    if (!choice) {
      throw new AiOutputError("Model returned no choices");
    }

    const assistantMessage = choice.message;

    // Check if the model wants to use tools
    if (choice.finish_reason === "tool_calls" && assistantMessage.tool_calls?.length) {
      // Add assistant's message to conversation
      messages.push(assistantMessage);

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        // Narrow to function-type tool calls (OpenAI SDK union type)
        if (toolCall.type !== "function") continue;
        const tool = tools.find((t) => t.name === toolCall.function.name);
        if (!tool) {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: `Unknown tool: ${toolCall.function.name}` }),
          });
          continue;
        }

        try {
          const input = JSON.parse(toolCall.function.arguments);
          const result = tool.execute(input, ctx);
          toolsUsed.push(tool.name);
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        } catch (err: any) {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: `Tool execution failed: ${err.message}` }),
          });
        }
      }

      continue;
    }

    // ── Model returned final text ─────────────────────────
    if (choice.finish_reason === "stop") {
      const text = assistantMessage.content;

      if (!text) {
        throw new AiOutputError("Model returned no text content");
      }

      // Strip markdown code fences if the model wraps the JSON
      let cleanText = text.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      }

      // Parse and validate the JSON response
      let parsed: unknown;
      try {
        parsed = JSON.parse(cleanText);
      } catch {
        throw new AiOutputError(
          `Model returned invalid JSON: ${cleanText.slice(0, 200)}`
        );
      }

      // ── FORCED ERROR PATH: Zod validation ───────────────
      const validation = AiResponseSchema.safeParse(parsed);
      if (!validation.success) {
        throw new AiOutputError(
          `Model output failed schema validation: ${JSON.stringify(
            validation.error.flatten().fieldErrors
          )}`
        );
      }

      // Inject the tools we actually called
      validation.data.toolsUsed = [...new Set(toolsUsed)];
      return validation.data;
    }

    // Unexpected finish reason
    throw new AiOutputError(
      `Unexpected finish_reason: ${choice.finish_reason}`
    );
  }

  throw new AiOutputError("Tool-use loop exceeded maximum iterations");
}

// ── Custom error class for invalid model output ─────────────
export class AiOutputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiOutputError";
  }
}
