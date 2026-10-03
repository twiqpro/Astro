CREATE TABLE IF NOT EXISTS kundli_leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  birth_time TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  special_focus TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  cashfree_order_id TEXT,
  cashfree_payment_id TEXT,
  amount_paise INTEGER NOT NULL DEFAULT 49900,
  currency TEXT NOT NULL DEFAULT 'INR',
  notified_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS kundli_leads_order_id ON kundli_leads (cashfree_order_id);
