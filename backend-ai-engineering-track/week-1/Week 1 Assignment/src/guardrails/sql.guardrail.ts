/**
 * SQL Guardrails
 * ──────────────
 * Validates model-generated SQL to ensure safety.
 * This is the single security gate between the AI model and the database.
 */

// ── Blocked keywords (case-insensitive) ─────────────────────
const BLOCKED_KEYWORDS = [
  "DROP",
  "DELETE",
  "INSERT",
  "UPDATE",
  "ALTER",
  "CREATE",
  "REPLACE",
  "TRUNCATE",
  "EXEC",
  "EXECUTE",
  "ATTACH",
  "DETACH",
  "PRAGMA",
  "GRANT",
  "REVOKE",
  "VACUUM",
  "REINDEX",
  ";--",        // comment-based injection
  "UNION ALL",  // injection pattern
];

// ── Blocked patterns (regex) ────────────────────────────────
const BLOCKED_PATTERNS: RegExp[] = [
  /;\s*$/,                        // trailing semicolons (chained statements)
  /;\s*\w/,                       // multiple statements
  /--/,                           // SQL comments
  /\/\*/,                         // block comments
  /\bload_extension\b/i,         // SQLite extension loading
  /\brandomblob\b/i,             // resource exhaustion
  /\bzeroblob\b/i,               // resource exhaustion
  /\bsqlite_master\b/i,          // schema introspection
  /\bsqlite_temp_master\b/i,     // schema introspection
  /\bwritefile\b/i,              // file system access
  /\breadfile\b/i,               // file system access
];

export interface SqlValidationResult {
  safe: boolean;
  reason?: string;
}

/**
 * Validates a SQL query for safety. Only SELECT statements
 * against the papers table are allowed.
 */
export function validateDynamicSql(sql: string): SqlValidationResult {
  if (!sql || typeof sql !== "string") {
    return { safe: false, reason: "SQL query is empty or not a string" };
  }

  const trimmed = sql.trim();
  const upper = trimmed.toUpperCase();

  // ① Must start with SELECT
  if (!upper.startsWith("SELECT")) {
    return {
      safe: false,
      reason: `Only SELECT statements are allowed. Got: "${upper.slice(0, 20)}..."`,
    };
  }

  // ② Must reference the papers table
  if (!upper.includes("PAPERS")) {
    return {
      safe: false,
      reason: "Query must reference the 'papers' table",
    };
  }

  // ③ Check blocked keywords
  for (const keyword of BLOCKED_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(trimmed)) {
      return {
        safe: false,
        reason: `Blocked keyword detected: "${keyword}"`,
      };
    }
  }

  // ④ Check blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        safe: false,
        reason: `Blocked pattern detected: ${pattern.source}`,
      };
    }
  }

  return { safe: true };
}
