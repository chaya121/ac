import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../database');
const databaseType = process.env.DATABASE_TYPE || 'sqlite';
const databaseUrl = process.env.DATABASE_URL;

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
let db;
let pgPool;

function persist() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

export async function initDb() {
  if (databaseType === 'postgresql' && databaseUrl) {
    // PostgreSQL setup
    pgPool = new pg.Pool({ connectionString: databaseUrl });
    
    // Create tables if they don't exist
    const client = await pgPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS records (
          id INTEGER PRIMARY KEY,
          data TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS master (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          data TEXT NOT NULL
        )
      `);
    } finally {
      client.release();
    }
    return pgPool;
  } else {
    // SQLite setup
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
}

export async function getAllRecords() {
  if (databaseType === 'postgresql' && pgPool) {
    const client = await pgPool.connect();
    try {
      const result = await client.query('SELECT id, data, created_at FROM records ORDER BY id DESC');
      return result.rows.map(row => ({
        ...JSON.parse(row.data),
        id: row.id,
      }));
    } finally {
      client.release();
    }
  } else {
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
}

export async function createRecord(record) {
  const id = record.id || Date.now();
  const data = JSON.stringify({ ...record, id });
  
  if (databaseType === 'postgresql' && pgPool) {
    const client = await pgPool.connect();
    try {
      await client.query('INSERT INTO records (id, data) VALUES ($1, $2)', [id, data]);
      return JSON.parse(data);
    } finally {
      client.release();
    }
  } else {
    db.run('INSERT INTO records (id, data) VALUES (?, ?)', [id, data]);
    persist();
    return JSON.parse(data);
  }
}

export async function bulkCreateRecords(records) {
  if (databaseType === 'postgresql' && pgPool) {
    const client = await pgPool.connect();
    try {
      for (const record of records) {
        const id = record.id || Date.now();
        const data = JSON.stringify({ ...record, id });
        await client.query('INSERT INTO records (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2', [id, data]);
      }
      return getAllRecords();
    } finally {
      client.release();
    }
  } else {
    for (const record of records) {
      const id = record.id || Date.now();
      const data = JSON.stringify({ ...record, id });
      db.run('INSERT OR REPLACE INTO records (id, data) VALUES (?, ?)', [id, data]);
    }
    persist();
    return getAllRecords();
  }
}

export async function deleteRecord(id) {
  if (databaseType === 'postgresql' && pgPool) {
    const client = await pgPool.connect();
    try {
      const result = await client.query('DELETE FROM records WHERE id = $1', [id]);
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  } else {
    db.run('DELETE FROM records WHERE id = ?', [id]);
    const changes = db.getRowsModified();
    if (changes > 0) persist();
    return changes > 0;
  }
}

export async function getMaster() {
  if (databaseType === 'postgresql' && pgPool) {
    const client = await pgPool.connect();
    try {
      const result = await client.query('SELECT data FROM master WHERE id = 1');
      if (result.rows.length === 0) return null;
      return JSON.parse(result.rows[0].data);
    } finally {
      client.release();
    }
  } else {
    const stmt = db.prepare('SELECT data FROM master WHERE id = 1');
    if (!stmt.step()) {
      stmt.free();
      return null;
    }
    const row = stmt.getAsObject();
    stmt.free();
    return JSON.parse(row.data);
  }
}

export async function saveMaster(data) {
  const json = JSON.stringify(data);
  
  if (databaseType === 'postgresql' && pgPool) {
    const client = await pgPool.connect();
    try {
      await client.query(`
        INSERT INTO master (id, data) VALUES (1, $1)
        ON CONFLICT(id) DO UPDATE SET data = $1
      `, [json]);
      return data;
    } finally {
      client.release();
    }
  } else {
    db.run(`
      INSERT INTO master (id, data) VALUES (1, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data
    `, [json]);
    persist();
    return data;
  }
}
