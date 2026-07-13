-- Trade scheduling loop
-- Adds appointment scheduling to tickets: trade proposes time slots, homeowner confirms one.

alter table tickets
  add column if not exists schedule_token uuid,
  add column if not exists schedule_status text
    check (schedule_status in ('awaiting_trade', 'proposed', 'confirmed', 'cancelled')),
  add column if not exists proposed_slots jsonb,
  add column if not exists scheduled_slot timestamptz,
  add column if not exists scheduled_at timestamptz,
  add column if not exists reminder_sent_at timestamptz;

create index if not exists idx_tickets_schedule_token on tickets(schedule_token);
create index if not exists idx_tickets_scheduled_slot on tickets(scheduled_slot);
