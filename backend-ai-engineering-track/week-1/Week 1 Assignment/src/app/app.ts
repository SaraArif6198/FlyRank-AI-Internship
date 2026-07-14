/**
 * Express Application Factory
 * ───────────────────────────
 * Creates and configures the Express app separately from the
 * server listener, so tests can import the app without binding a port.
 */
import express from "express";
import aiRoutes from "../routes/ai.routes.js";

export function createApp(): express.Application {
  const app = express();

  // Pretty-print JSON responses
  app.set("json spaces", 2);

  // Middleware
  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  app.use("/ai", aiRoutes);

  return app;
}
