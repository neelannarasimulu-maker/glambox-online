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


  db.run(`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT UNIQUE NOT NULL,
      provider TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  db.run("CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id)");
  db.run("CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token_hash)");

  db.run(`
    CREATE TABLE IF NOT EXISTS auth_login_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      occurred_at TEXT NOT NULL
    )
  `);
  db.run("CREATE INDEX IF NOT EXISTS idx_auth_login_events_user_time ON auth_login_events(user_id, occurred_at)");

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      popup_key TEXT NOT NULL,
      popup_name TEXT NOT NULL,
      service_id TEXT NOT NULL,
      service_title TEXT NOT NULL,
      consultant_id TEXT NOT NULL,
      consultant_name TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      notes TEXT,
      source TEXT NOT NULL DEFAULT 'web',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON bookings(user_id, booking_date, booking_time)"
  );

  // Lightweight migrations for existing local databases.
  db.run("ALTER TABLE users ADD COLUMN preferences TEXT", (error) => {
    if (error && !error.message.includes("duplicate column name")) {
      // eslint-disable-next-line no-console
      console.error("Failed to add users.preferences column:", error.message);
    }
  });
  db.run("ALTER TABLE users ADD COLUMN dislikes TEXT", (error) => {
    if (error && !error.message.includes("duplicate column name")) {
      // eslint-disable-next-line no-console
      console.error("Failed to add users.dislikes column:", error.message);
    }
  });
  db.run("ALTER TABLE users ADD COLUMN medical_info TEXT", (error) => {
    if (error && !error.message.includes("duplicate column name")) {
      // eslint-disable-next-line no-console
      console.error("Failed to add users.medical_info column:", error.message);
    }
  });
  db.run("ALTER TABLE users ADD COLUMN hair_preferences TEXT", (error) => {
    if (error && !error.message.includes("duplicate column name")) {
      // eslint-disable-next-line no-console
      console.error("Failed to add users.hair_preferences column:", error.message);
    }
  });
  db.run("ALTER TABLE users ADD COLUMN nail_preferences TEXT", (error) => {
    if (error && !error.message.includes("duplicate column name")) {
      // eslint-disable-next-line no-console
      console.error("Failed to add users.nail_preferences column:", error.message);
    }
  });
  db.run("ALTER TABLE users ADD COLUMN food_preferences TEXT", (error) => {
    if (error && !error.message.includes("duplicate column name")) {
      // eslint-disable-next-line no-console
      console.error("Failed to add users.food_preferences column:", error.message);
    }
  });
  db.run("ALTER TABLE users ADD COLUMN onboarding_completed INTEGER DEFAULT 0", (error) => {
    if (error && !error.message.includes("duplicate column name")) {
      // eslint-disable-next-line no-console
      console.error("Failed to add users.onboarding_completed column:", error.message);
    }
  });
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

export function all<T>(query: string, params: unknown[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows as T[]);
    });
  });
}
