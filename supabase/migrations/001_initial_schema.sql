-- After Closing Pro - Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Companies (Builder businesses)
create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  phone text,
  email text,
  website text,
  address text,
  warranty_period_months integer not null default 12,
  emergency_instructions text,
  created_at timestamptz not null default now()
);

-- User profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  role text not null default 'builder_admin'
    check (role in ('builder_admin', 'builder_member', 'warranty_manager', 'trade', 'homeowner')),
  company_id uuid references companies(id) on delete set null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Homes
create table homes (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  address text not null,
  city text not null,
  state text not null,
  zip text not null,
  homeowner_name text not null,
  homeowner_email text not null,
  homeowner_phone text,
  closing_date date not null,
  warranty_start_date timestamptz not null,
  warranty_end_date timestamptz not null,
  model_name text,
  notes text,
  created_at timestamptz not null default now()
);

-- Trades
create table trades (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  company_name text not null,
  email text not null,
  phone text,
  category text not null default 'general',
  notes text,
  created_at timestamptz not null default now()
);

-- Tickets
create table tickets (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  home_id uuid references homes(id) on delete set null,
  trade_id uuid references trades(id) on delete set null,
  status text not null default 'new'
    check (status in (
      'new', 'ai_triage', 'needs_review', 'ai_resolved',
      'assigned_to_trade', 'scheduled', 'in_progress',
      'waiting_on_homeowner', 'completed', 'closed',
      'not_warranty', 'emergency'
    )),
  urgency text not null default 'normal'
    check (urgency in ('low', 'normal', 'high', 'emergency')),
  category text not null default 'general',
  title text not null,
  description text not null default '',
  homeowner_message text not null default '',
  ai_summary text,
  ai_category text,
  ai_urgency text,
  ai_trade_recommendation text,
  ai_warranty_likelihood text,
  ai_resolved boolean not null default false,
  location text,
  assigned_by uuid references auth.users(id),
  assigned_at timestamptz,
  completed_at timestamptz,
  homeowner_signoff boolean not null default false,
  homeowner_signoff_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ticket messages
create table ticket_messages (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  sender_type text not null
    check (sender_type in ('homeowner', 'builder', 'trade', 'ai', 'system')),
  sender_name text not null,
  message text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ticket files
create table ticket_files (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_type text not null default '',
  uploaded_by text not null default '',
  created_at timestamptz not null default now()
);

-- AI Triage Sessions
create table ai_triage_sessions (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  home_id uuid references homes(id) on delete set null,
  homeowner_name text not null,
  homeowner_email text not null default '',
  status text not null default 'active'
    check (status in ('active', 'completed', 'ticket_created')),
  ticket_id uuid references tickets(id) on delete set null,
  created_at timestamptz not null default now()
);

-- AI Triage Messages
create table ai_triage_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references ai_triage_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_profiles_company on profiles(company_id);
create index idx_homes_company on homes(company_id);
create index idx_trades_company on trades(company_id);
create index idx_tickets_company on tickets(company_id);
create index idx_tickets_home on tickets(home_id);
create index idx_tickets_status on tickets(status);
create index idx_tickets_trade on tickets(trade_id);
create index idx_ticket_messages_ticket on ticket_messages(ticket_id);
create index idx_ticket_files_ticket on ticket_files(ticket_id);
create index idx_triage_sessions_company on ai_triage_sessions(company_id);
create index idx_triage_messages_session on ai_triage_messages(session_id);
create index idx_companies_slug on companies(slug);

-- Row Level Security
alter table companies enable row level security;
alter table profiles enable row level security;
alter table homes enable row level security;
alter table trades enable row level security;
alter table tickets enable row level security;
alter table ticket_messages enable row level security;
alter table ticket_files enable row level security;
alter table ai_triage_sessions enable row level security;
alter table ai_triage_messages enable row level security;

-- RLS Policies

-- Companies: members can read their company
create policy "Users can view own company"
  on companies for select
  using (id in (select company_id from profiles where id = auth.uid()));

-- Companies: allow insert for signup flow
create policy "Users can create companies"
  on companies for insert
  with check (true);

-- Companies: admins can update
create policy "Admins can update company"
  on companies for update
  using (id in (select company_id from profiles where id = auth.uid() and role = 'builder_admin'));

-- Profiles: users can read their own and company members
create policy "Users can view own profile"
  on profiles for select
  using (id = auth.uid() or company_id in (select company_id from profiles where id = auth.uid()));

create policy "Users can insert own profile"
  on profiles for insert
  with check (id = auth.uid());

create policy "Users can update own profile"
  on profiles for update
  using (id = auth.uid());

-- Homes: company members can CRUD
create policy "Company members can view homes"
  on homes for select
  using (company_id in (select company_id from profiles where id = auth.uid()));

create policy "Company members can create homes"
  on homes for insert
  with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "Company members can update homes"
  on homes for update
  using (company_id in (select company_id from profiles where id = auth.uid()));

-- Trades: company members can CRUD
create policy "Company members can view trades"
  on trades for select
  using (company_id in (select company_id from profiles where id = auth.uid()));

create policy "Company members can create trades"
  on trades for insert
  with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "Company members can update trades"
  on trades for update
  using (company_id in (select company_id from profiles where id = auth.uid()));

-- Tickets: company members can CRUD
create policy "Company members can view tickets"
  on tickets for select
  using (company_id in (select company_id from profiles where id = auth.uid()));

create policy "Company members can create tickets"
  on tickets for insert
  with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "Company members can update tickets"
  on tickets for update
  using (company_id in (select company_id from profiles where id = auth.uid()));

-- Ticket messages: accessible by company members
create policy "Company members can view ticket messages"
  on ticket_messages for select
  using (ticket_id in (select id from tickets where company_id in (select company_id from profiles where id = auth.uid())));

create policy "Company members can create ticket messages"
  on ticket_messages for insert
  with check (ticket_id in (select id from tickets where company_id in (select company_id from profiles where id = auth.uid())));

-- Ticket files: accessible by company members
create policy "Company members can view ticket files"
  on ticket_files for select
  using (ticket_id in (select id from tickets where company_id in (select company_id from profiles where id = auth.uid())));

create policy "Company members can create ticket files"
  on ticket_files for insert
  with check (ticket_id in (select id from tickets where company_id in (select company_id from profiles where id = auth.uid())));

-- Triage sessions: allow public insert (homeowners), company read
create policy "Anyone can create triage sessions"
  on ai_triage_sessions for insert
  with check (true);

create policy "Company members can view triage sessions"
  on ai_triage_sessions for select
  using (company_id in (select company_id from profiles where id = auth.uid()));

create policy "Anyone can update triage sessions"
  on ai_triage_sessions for update
  using (true);

-- Triage messages: allow public insert, company read
create policy "Anyone can create triage messages"
  on ai_triage_messages for insert
  with check (true);

create policy "Company members can view triage messages"
  on ai_triage_messages for select
  using (session_id in (select id from ai_triage_sessions where company_id in (select company_id from profiles where id = auth.uid())));

-- Public read policy for companies (needed for intake page)
create policy "Public can read companies by slug"
  on companies for select
  using (true);

-- Public read policy for homes (needed for intake page with home_id)
create policy "Public can read homes by id"
  on homes for select
  using (true);

-- Allow service role / API to create tickets (from triage)
create policy "Service can create tickets"
  on tickets for insert
  with check (true);

-- Allow service role to create ticket messages
create policy "Service can create ticket messages"
  on ticket_messages for insert
  with check (true);
