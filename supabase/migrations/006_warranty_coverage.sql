-- Warranty coverage triage
-- Adds per-builder warranty coverage terms and per-ticket coverage decisions.

-- Company-level coverage configuration
alter table companies
  add column if not exists warranty_workmanship_months integer not null default 12,
  add column if not exists warranty_systems_months integer not null default 24,
  add column if not exists warranty_structural_months integer not null default 120,
  add column if not exists warranty_excluded_items text,
  add column if not exists warranty_coverage_notes text;

-- Ticket-level coverage results
alter table tickets
  add column if not exists ai_coverage_reason text,
  add column if not exists coverage_override text
    check (coverage_override in ('covered', 'not_covered')),
  add column if not exists coverage_override_at timestamptz;
