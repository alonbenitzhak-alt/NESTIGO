-- ============================================================
-- Migration: Finance payments table + extended property fields
-- Run this in your Supabase SQL editor
-- ============================================================

-- 1. Extended property fields
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS neighborhood   TEXT,
  ADD COLUMN IF NOT EXISTS bathrooms      INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS area_sqm       INTEGER,
  ADD COLUMN IF NOT EXISTS floor          INTEGER,
  ADD COLUMN IF NOT EXISTS year_built     INTEGER,
  ADD COLUMN IF NOT EXISTS amenities      TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS furnished      BOOLEAN DEFAULT FALSE;

-- 2. Payments / commissions table
CREATE TABLE IF NOT EXISTS payments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id      UUID        REFERENCES leads(id) ON DELETE SET NULL,
  property_id  UUID        REFERENCES properties(id) ON DELETE SET NULL,
  amount       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  type         TEXT        NOT NULL DEFAULT 'lead_fee'
                           CHECK (type IN ('lead_fee', 'commission', 'bonus')),
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'paid')),
  notes        TEXT,
  paid_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Only admins can manage payments; agents can only read their own
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Agents can view own payments"
  ON payments FOR SELECT
  USING (agent_id = auth.uid());
