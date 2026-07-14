/**
 * Server Entry Point
 * ──────────────────
 * Starts the Express server. This is the only file that
 * calls app.listen().
 */
import { createApp } from "./app/app.js";
import { env } from "./config/env.js";
import { getDb } from "./db/database.js";

const app = createApp();

// Initialize database on startup
getDb();

app.listen(env.PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║           🧠 The AI Core is running              ║
╠══════════════════════════════════════════════════╣
║  Port:     ${String(env.PORT).padEnd(37)}║
║  Model:    ${env.AI_MODEL.padEnd(37)}║
║  Provider: ${env.AI_PROVIDER.padEnd(37)}║
║  Gateway:  ${env.PORTKEY_GATEWAY_URL.slice(0, 37).padEnd(37)}║
║  Mode:     ${env.NODE_ENV.padEnd(37)}║
╚══════════════════════════════════════════════════╝
  `);
});
