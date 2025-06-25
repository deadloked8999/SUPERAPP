import sqlite3 from "sqlite3";
const db = new sqlite3.Database("auth.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      phone_number TEXT,
      role TEXT,
      telegram_chat_id TEXT,
      auth_code TEXT,
      auth_expires TEXT
    )
  `);

  const stmt = db.prepare("INSERT OR IGNORE INTO users (username, phone_number, role) VALUES (?, ?, ?)");

  stmt.run("@needls1", "+79267166906", "admin");
  stmt.run("@Ninth_God", "+79252491340", "admin");
  stmt.run("@testbesttest1", null, "hostess");

  stmt.finalize();
});

db.close(); 