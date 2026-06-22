import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../database');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
let db;

function persist() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

export async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS master (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    )
  `);

  persist();
  return db;
}

export function getAllRecords() {
  const stmt = db.prepare('SELECT id, data, created_at FROM records ORDER BY id DESC');
  const rows = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    rows.push({
      ...JSON.parse(row.data),
      id: row.id,
    });
  }
  stmt.free();
  return rows;
}

export function createRecord(record) {
  const id = record.id || Date.now();
  const data = JSON.stringify({ ...record, id });
  db.run('INSERT INTO records (id, data) VALUES (?, ?)', [id, data]);
  persist();
  return JSON.parse(data);
}

export function bulkCreateRecords(records) {
  for (const record of records) {
    const id = record.id || Date.now();
    const data = JSON.stringify({ ...record, id });
    db.run('INSERT OR REPLACE INTO records (id, data) VALUES (?, ?)', [id, data]);
  }
  persist();
  return getAllRecords();
}

export function deleteRecord(id) {
  db.run('DELETE FROM records WHERE id = ?', [id]);
  const changes = db.getRowsModified();
  if (changes > 0) persist();
  return changes > 0;
}

export function getMaster() {
  const stmt = db.prepare('SELECT data FROM master WHERE id = 1');
  if (!stmt.step()) {
    stmt.free();
    return null;
  }
  const row = stmt.getAsObject();
  stmt.free();
  return JSON.parse(row.data);
}

export function saveMaster(data) {
  const json = JSON.stringify(data);
  db.run(`
    INSERT INTO master (id, data) VALUES (1, ?)
    ON CONFLICT(id) DO UPDATE SET data = excluded.data
  `, [json]);
  persist();
  return data;
}
