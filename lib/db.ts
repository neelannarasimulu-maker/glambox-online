import path from "path";
import sqlite3 from "sqlite3";

const databasePath = path.join(process.cwd(), "glambox.db");
const db = new sqlite3.Database(databasePath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      full_name TEXT NOT NULL,
      phone TEXT,
      date_of_birth TEXT,
      address TEXT,
      city TEXT,
      country TEXT,
      bio TEXT,
      auth_provider TEXT NOT NULL DEFAULT 'email',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
});

export function run(query: string, params: unknown[] = []) {
  return new Promise<{ lastID: number; changes: number }>((resolve, reject) => {
    db.run(query, params, function callback(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get<T>(query: string, params: unknown[] = []) {
  return new Promise<T | undefined>((resolve, reject) => {
    db.get(query, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row as T | undefined);
    });
  });
}
