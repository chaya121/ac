import express from 'express';
import cors from 'cors';
import {
  initDb,
  getAllRecords,
  createRecord,
  bulkCreateRecords,
  deleteRecord,
  updateRecord,
  getMaster,
  saveMaster,
  clearAllData,
} from '../backend/db.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/records', async (_req, res) => {
  try {
    res.json(await getAllRecords());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

app.post('/records', async (req, res) => {
  try {
    const record = await createRecord(req.body);
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

app.post('/records/bulk', async (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'records must be an array' });
    }
    res.json(await bulkCreateRecords(records));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to import records' });
  }
});

app.delete('/records/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const deleted = await deleteRecord(id);
    if (!deleted) return res.status(404).json({ error: 'Record not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

app.put('/records/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const updated = await updateRecord(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err.message === 'Record not found') {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.status(500).json({ error: 'Failed to update record' });
    }
  }
});

app.get('/master', async (_req, res) => {
  try {
    res.json(await getMaster());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch master data' });
  }
});

app.put('/master', async (req, res) => {
  try {
    const data = await saveMaster(req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save master data' });
  }
});

app.delete('/clear', async (_req, res) => {
  try {
    const result = await clearAllData();
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

// Initialize database connection
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

export default async function handler(req, res) {
  await ensureDbInitialized();
  return app(req, res);
}
