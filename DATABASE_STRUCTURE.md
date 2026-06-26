# Database Structure

## Overview
The application supports two database types: **SQLite** (default) and **PostgreSQL** (for production on Supabase/Render).

---

## SQLite Structure

### Tables

#### 1. `records`
Stores all apparel production records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER (PRIMARY KEY) | Unique record identifier |
| `data` | TEXT (NOT NULL) | JSON string containing record data |
| `created_at` | TEXT | Timestamp (ISO format) |

#### 2. `master`
Stores master data configuration.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER (PRIMARY KEY) | Always `1` (single row) |
| `data` | TEXT (NOT NULL) | JSON string containing master configuration |

---

## PostgreSQL Structure (Supabase)

### Tables

#### 1. `records`
Stores all apparel production records.

**Schema:**
```sql
CREATE TABLE records (
  id BIGINT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Data Object Structure (JSONB):**
```javascript
{
  date: String,
  merText: String,
  brand: String,
  customer: String,
  model: String,
  clothingType: String,
  qty: Number,
  size: String,
  colors: Number,
  sampleReal: Boolean,
  samplePic: Boolean,
  detail: String,
  chk: {
    pak: Boolean,
    pak_n: String,
    print: Boolean,
    print_n: String,
    tag: Boolean,
    big: Boolean,
    big_n: String,
    rib: Boolean,
    send: Boolean,
    send_n: String,
    small: Boolean,
    small_n: String
  },
  noteProd: String,
  noteSales: String,
  supervisor: String,
  sewers: Number,
  rate: Number,
  estWage: Number,
  confirmed: String,
  warning: String,
  solution: String,
  actual: {
    start: String,
    end: String,
    sewers: Number,
    days: Number,
    rate: Number,
    wage: Number,
    total: Number,
    remark: String
  },
  steps: Array,
  imgs: Array,
  perColor: String
}
```

#### 2. `master`
Stores master data configuration.

**Schema:**
```sql
CREATE TABLE master (
  id INTEGER PRIMARY CHECK (id = 1),
  data JSONB NOT NULL
)
```

**Data Object Structure (JSONB):**
```javascript
{
  brands: Array of Strings,
  customers: Array of Strings,
  models: Array of Strings,
  sizes: Array of Strings,
  clothingTypes: Array of Strings
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/records` | Get all records |
| POST | `/api/records` | Create new record |
| POST | `/api/records/bulk` | Bulk import records |
| DELETE | `/api/records/:id` | Delete specific record |
| GET | `/api/master` | Get master data |
| PUT | `/api/master` | Save master data |
| DELETE | `/api/clear` | Clear all data (temporary) |

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_TYPE` | Database type (`sqlite` or `postgresql`) | `postgresql` |
| `DATABASE_URL` | PostgreSQL connection string (for Supabase) | `postgresql://...` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://apparel01.vercel.app` |
| `PORT` | Server port | `3001` |
