/**
 * SQL Guardrail Tests
 * ───────────────────
 * Tests that the SQL guardrail correctly allows safe
 * queries and blocks malicious SQL.
 */
import { describe, it, expect } from "vitest";
import { validateDynamicSql } from "../src/guardrails/sql.guardrail.js";

// ─────────────────────────────────────────────────────────
//  SAFE SQL — should pass
// ─────────────────────────────────────────────────────────
describe("validateDynamicSql — safe queries", () => {
  it("allows a simple SELECT from papers", () => {
    const result = validateDynamicSql(
      "SELECT id, title FROM papers WHERE year > 2020"
    );
    expect(result.safe).toBe(true);
  });

  it("allows SELECT * from papers", () => {
    const result = validateDynamicSql("SELECT * FROM papers");
    expect(result.safe).toBe(true);
  });

  it("allows SELECT with LIKE on papers", () => {
    const result = validateDynamicSql(
      "SELECT title FROM papers WHERE title LIKE '%serverless%'"
    );
    expect(result.safe).toBe(true);
  });

  it("allows SELECT with ORDER BY", () => {
    const result = validateDynamicSql(
      "SELECT id, year FROM papers ORDER BY year DESC"
    );
    expect(result.safe).toBe(true);
  });

  it("allows SELECT with COUNT aggregate", () => {
    const result = validateDynamicSql(
      "SELECT COUNT(*) as total FROM papers WHERE year >= 2022"
    );
    expect(result.safe).toBe(true);
  });

  it("allows SELECT with GROUP BY", () => {
    const result = validateDynamicSql(
      "SELECT year, COUNT(*) FROM papers GROUP BY year"
    );
    expect(result.safe).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
//  MALICIOUS SQL — should be blocked
// ─────────────────────────────────────────────────────────
describe("validateDynamicSql — malicious queries", () => {
  it("blocks DROP TABLE", () => {
    const result = validateDynamicSql("DROP TABLE papers");
    expect(result.safe).toBe(false);
    expect(result.reason).toContain("Only SELECT");
  });

  it("blocks DELETE FROM", () => {
    const result = validateDynamicSql("DELETE FROM papers WHERE id = 'test'");
    expect(result.safe).toBe(false);
    expect(result.reason).toContain("Only SELECT");
  });

  it("blocks INSERT INTO", () => {
    const result = validateDynamicSql(
      "INSERT INTO papers (id) VALUES ('hack')"
    );
    expect(result.safe).toBe(false);
    expect(result.reason).toContain("Only SELECT");
  });

  it("blocks UPDATE", () => {
    const result = validateDynamicSql(
      "UPDATE papers SET title = 'hacked' WHERE id = 'test'"
    );
    expect(result.safe).toBe(false);
    expect(result.reason).toContain("Only SELECT");
  });

  it("blocks SQL injection via semicolon chaining", () => {
    const result = validateDynamicSql(
      "SELECT * FROM papers; DROP TABLE papers"
    );
    expect(result.safe).toBe(false);
  });

  it("blocks SQL comments (--)", () => {
    const result = validateDynamicSql(
      "SELECT * FROM papers WHERE id = 'test' -- AND admin = 1"
    );
    expect(result.safe).toBe(false);
    expect(result.reason).toContain("Blocked pattern");
  });

  it("blocks block comments (/* */)", () => {
    const result = validateDynamicSql(
      "SELECT * FROM papers WHERE /* bypass */ 1=1"
    );
    expect(result.safe).toBe(false);
    expect(result.reason).toContain("Blocked pattern");
  });

  it("blocks ATTACH DATABASE", () => {
    const result = validateDynamicSql("ATTACH DATABASE '/etc/passwd' AS pwn");
    expect(result.safe).toBe(false);
  });

  it("blocks PRAGMA", () => {
    const result = validateDynamicSql("PRAGMA table_info(papers)");
    expect(result.safe).toBe(false);
  });

  it("blocks load_extension", () => {
    const result = validateDynamicSql(
      "SELECT load_extension('/tmp/evil.so') FROM papers"
    );
    expect(result.safe).toBe(false);
  });

  it("blocks sqlite_master access", () => {
    const result = validateDynamicSql(
      "SELECT * FROM sqlite_master"
    );
    expect(result.safe).toBe(false);
    expect(result.reason).toContain("papers");
  });

  it("blocks queries not targeting papers table", () => {
    const result = validateDynamicSql("SELECT * FROM users");
    expect(result.safe).toBe(false);
    expect(result.reason).toContain("papers");
  });

  it("blocks empty input", () => {
    const result = validateDynamicSql("");
    expect(result.safe).toBe(false);
  });

  it("blocks non-string input", () => {
    const result = validateDynamicSql(null as any);
    expect(result.safe).toBe(false);
  });

  it("blocks EXEC keyword", () => {
    const result = validateDynamicSql(
      "SELECT * FROM papers WHERE EXEC('malicious')"
    );
    expect(result.safe).toBe(false);
  });

  it("blocks trailing semicolon", () => {
    const result = validateDynamicSql("SELECT * FROM papers;");
    expect(result.safe).toBe(false);
  });
});
