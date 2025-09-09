CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  rollout_pct INT NOT NULL DEFAULT 100,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, key)
);

CREATE TABLE IF NOT EXISTS flag_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID NOT NULL REFERENCES flags(id) ON DELETE CASCADE,
  attribute TEXT NOT NULL,
  op TEXT NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exposures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID NOT NULL REFERENCES flags(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  result BOOLEAN NOT NULL,
  user_pct NUMERIC(5,2) NULL
);

-- Basic users for admin (simplified)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_flags_project ON flags(project_id);
CREATE INDEX IF NOT EXISTS idx_flag_rules_flag ON flag_rules(flag_id);
CREATE INDEX IF NOT EXISTS idx_exposures_flag ON exposures(flag_id);
