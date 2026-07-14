/**
 * Database Layer
 * ──────────────
 * Initializes SQLite from the JSON paper data.
 * Provides a safe query interface that goes through the SQL guardrail.
 */
import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";
import type { Paper } from "../schemas/response.schema.js";

const DATA_PATH = join(process.cwd(), "data", "papers.json");
const DB_PATH = join(process.cwd(), "data", "papers.db");

let _db: Database.Database | null = null;

/**
 * Returns a singleton database connection, creating the DB
 * and seeding it from papers.json on first call.
 */
export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");

  // Create table
  _db.exec(`
    CREATE TABLE IF NOT EXISTS papers (
      id            TEXT PRIMARY KEY,
      title         TEXT NOT NULL,
      authors       TEXT NOT NULL,
      year          INTEGER NOT NULL,
      venue         TEXT NOT NULL,
      publisher     TEXT NOT NULL,
      doi           TEXT NOT NULL,
      url           TEXT NOT NULL,
      themes        TEXT NOT NULL,
      method        TEXT NOT NULL,
      platform      TEXT NOT NULL,
      contribution  TEXT NOT NULL,
      limitation    TEXT NOT NULL,
      abstract      TEXT NOT NULL
    );
  `);

  // Seed only if empty
  const count = _db.prepare("SELECT COUNT(*) as cnt FROM papers").get() as {
    cnt: number;
  };

  if (count.cnt === 0) {
    const raw = readFileSync(DATA_PATH, "utf-8");
    const papers: Paper[] = JSON.parse(raw);

    const insert = _db.prepare(`
      INSERT INTO papers (id, title, authors, year, venue, publisher, doi, url, themes, method, platform, contribution, limitation, abstract)
      VALUES (@id, @title, @authors, @year, @venue, @publisher, @doi, @url, @themes, @method, @platform, @contribution, @limitation, @abstract)
    `);

    const seedMany = _db.transaction((papers: Paper[]) => {
      for (const p of papers) {
        insert.run({
          ...p,
          authors: JSON.stringify(p.authors),
          themes: JSON.stringify(p.themes),
        });
      }
    });

    seedMany(papers);
    console.log(`📚 Seeded ${papers.length} papers into SQLite`);
  }

  return _db;
}

/**
 * Close the database connection (useful for tests & graceful shutdown).
 */
export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
