const sqlite3 = require("sqlite3").verbose();
const path = require("path");

let db;

function getDB() {
  if (db) return db;
  
  const dbPath = path.join(__dirname, "../../database.db");
  db = new sqlite3.Database(dbPath);
  
  // إنشاء الجداول إذا لم تكن موجودة
  db.serialize(() => {
    // جدول المستخدمين
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      plan TEXT DEFAULT 'starter',
      sms_quota INTEGER DEFAULT 500,
      whatsapp_enabled INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // جدول المواعيد
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      client_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      client_language TEXT DEFAULT 'de',
      appointment_datetime DATETIME NOT NULL,
      status TEXT DEFAULT 'confirmed',
      reminder_24_sent INTEGER DEFAULT 0,
      reminder_2_sent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
    
    // جدول الرسائل
    db.run(`CREATE TABLE IF NOT EXISTS message_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      appointment_id INTEGER,
      channel TEXT NOT NULL,
      message_type TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      provider_id TEXT,
      error_text TEXT,
      attempts INTEGER DEFAULT 0,
      next_retry_at DATETIME,
      sent_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    )`);
  });
  
  return db;
}

// وظائف مساعدة لمحاكاة MySQL syntax
function runQuery(query, params = {}) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    // تحويل named parameters إلى array parameters لـ SQLite
    let sqliteQuery = query;
    const paramArray = [];
    
    // استبدال :param بـ ?
    sqliteQuery = sqliteQuery.replace(/:(\w+)/g, (match, paramName) => {
      paramArray.push(params[paramName]);
      return '?';
    });
    
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sqliteQuery, paramArray, (err, rows) => {
        if (err) reject(err);
        else resolve([rows]);
      });
    } else {
      db.run(sqliteQuery, paramArray, function(err) {
        if (err) reject(err);
        else resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
      });
    }
  });
}

// إنشاء كائن يحاكي MySQL pool للتوافق مع الخلف
function getPool() {
  return {
    execute: runQuery
  };
}

module.exports = { getDB, runQuery, getPool };
