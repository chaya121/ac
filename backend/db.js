import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../database');
const databaseType = process.env.DATABASE_TYPE || 'sqlite';
const databaseUrl = process.env.DATABASE_URL;

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
let db;
let mongoConnection;

function persist() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

export async function initDb() {
  if (databaseType === 'mongodb' && databaseUrl) {
    // MongoDB setup with SSL/TLS options for Atlas
    mongoConnection = await mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      ssl: true,
      retryWrites: true,
      w: 'majority'
    });
    
    // Define schemas
    const recordSchema = new mongoose.Schema({
      id: { type: Number, required: true, unique: true },
      data: { type: Object, required: true },
      created_at: { type: Date, default: Date.now }
    });
    
    const masterSchema = new mongoose.Schema({
      id: { type: Number, required: true, unique: true, default: 1 },
      data: { type: Object, required: true }
    });
    
    // Create models (will create collections if they don't exist)
    mongoose.model('Record', recordSchema);
    mongoose.model('Master', masterSchema);
    
    return mongoConnection;
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
  if (databaseType === 'mongodb' && mongoConnection) {
    const Record = mongoose.model('Record');
    const records = await Record.find().sort({ id: -1 });
    return records.map(record => ({
      ...record.data,
      id: record.id,
      created_at: record.created_at
    }));
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
  const data = { ...record, id };
  
  if (databaseType === 'mongodb' && mongoConnection) {
    const Record = mongoose.model('Record');
    const newRecord = await Record.create({ id, data });
    return { ...newRecord.data, id: newRecord.id };
  } else {
    const jsonData = JSON.stringify(data);
    db.run('INSERT INTO records (id, data) VALUES (?, ?)', [id, jsonData]);
    persist();
    return data;
  }
}

export async function bulkCreateRecords(records) {
  if (databaseType === 'mongodb' && mongoConnection) {
    const Record = mongoose.model('Record');
    for (const record of records) {
      const id = record.id || Date.now();
      const data = { ...record, id };
      await Record.findOneAndUpdate({ id }, { id, data }, { upsert: true, new: true });
    }
    return getAllRecords();
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
  if (databaseType === 'mongodb' && mongoConnection) {
    const Record = mongoose.model('Record');
    const result = await Record.deleteOne({ id });
    return result.deletedCount > 0;
  } else {
    db.run('DELETE FROM records WHERE id = ?', [id]);
    const changes = db.getRowsModified();
    if (changes > 0) persist();
    return changes > 0;
  }
}

export async function getMaster() {
  if (databaseType === 'mongodb' && mongoConnection) {
    const Master = mongoose.model('Master');
    const master = await Master.findOne({ id: 1 });
    return master ? master.data : null;
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
  if (databaseType === 'mongodb' && mongoConnection) {
    const Master = mongoose.model('Master');
    await Master.findOneAndUpdate({ id: 1 }, { id: 1, data }, { upsert: true, new: true });
    return data;
  } else {
    const json = JSON.stringify(data);
    db.run(`
      INSERT INTO master (id, data) VALUES (1, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data
    `, [json]);
    persist();
    return data;
  }
}

export async function clearAllData() {
  if (databaseType === 'mongodb' && mongoConnection) {
    const Record = mongoose.model('Record');
    const Master = mongoose.model('Master');
    
    const recordCount = await Record.countDocuments();
    const masterCount = await Master.countDocuments();
    
    await Record.deleteMany({});
    await Master.deleteMany({});
    
    return {
      recordsDeleted: recordCount,
      masterDeleted: masterCount
    };
  } else {
    const recordStmt = db.prepare('SELECT COUNT(*) as count FROM records');
    recordStmt.step();
    const recordCount = recordStmt.getAsObject().count;
    recordStmt.free();
    
    const masterStmt = db.prepare('SELECT COUNT(*) as count FROM master');
    masterStmt.step();
    const masterCount = masterStmt.getAsObject().count;
    masterStmt.free();
    
    db.run('DELETE FROM records');
    db.run('DELETE FROM master');
    persist();
    
    return {
      recordsDeleted: recordCount,
      masterDeleted: masterCount
    };
  }
}
