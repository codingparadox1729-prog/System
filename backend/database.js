// ─────────────────────────────────────────────────────────
//  database.js  —  SQLite setup for SYSTEM: Arise
// ─────────────────────────────────────────────────────────
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './system_arise.db';
const db = new Database(path.resolve(DB_PATH));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Create Tables ──────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT    NOT NULL UNIQUE,
    hunter_name TEXT    NOT NULL,
    password    TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS game_state (
    user_id     INTEGER PRIMARY KEY,
    state_json  TEXT    NOT NULL DEFAULT '{}',
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

console.log('[DB] SQLite database ready at:', DB_PATH);

// ── Prepared Statements ────────────────────────────────────
const stmts = {
  // Users
  createUser: db.prepare(
    `INSERT INTO users (email, hunter_name, password) VALUES (@email, @hunter_name, @password)`
  ),
  findUserByEmail: db.prepare(
    `SELECT * FROM users WHERE email = ?`
  ),
  findUserById: db.prepare(
    `SELECT id, email, hunter_name, created_at FROM users WHERE id = ?`
  ),

  // Game state
  getState: db.prepare(
    `SELECT state_json FROM game_state WHERE user_id = ?`
  ),
  upsertState: db.prepare(
    `INSERT INTO game_state (user_id, state_json, updated_at)
     VALUES (@user_id, @state_json, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       state_json = excluded.state_json,
       updated_at = excluded.updated_at`
  ),
};

module.exports = { db, stmts };
