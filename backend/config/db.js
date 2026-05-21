const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {

  if (err) {
    console.log(err.message);
  } else {
    console.log("SQLite Connected");
  }
});

// USERS TABLE
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT,
  department TEXT
)
`);

// ASSET REQUESTS TABLE
db.run(`
CREATE TABLE IF NOT EXISTS asset_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  asset_type TEXT,
  asset_name TEXT,
  reason TEXT,
  duration TEXT,
  department TEXT,
  issue_date TEXT,
  attachment TEXT,
  status TEXT
)
`);

// ASSET HISTORY TABLE
db.run(`
CREATE TABLE IF NOT EXISTS asset_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER,
  action TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// NOTIFICATIONS TABLE
db.run(`
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// REVIEW COMMENTS TABLE
db.run(`
CREATE TABLE IF NOT EXISTS review_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER,
  manager_id INTEGER,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

module.exports = db;