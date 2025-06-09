-- 001_init.sql: Initial schema for banks and packages

CREATE TABLE banks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE packages (
  id TEXT PRIMARY KEY,
  bank_id TEXT NOT NULL REFERENCES banks(id),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  conditions TEXT,
  effective_from DATE NOT NULL,
  effective_until DATE,
  tiers_json TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
