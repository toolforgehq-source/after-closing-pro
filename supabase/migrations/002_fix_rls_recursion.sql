-- Fix infinite recursion in RLS policies
-- The profiles policy references profiles, causing infinite recursion.
-- Solution: use a SECURITY DEFINER function to bypass RLS when looking up company_id.

-- Create helper function (runs with table owner privileges, bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_my_company_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid()
$$;

-- Drop all policies that use the recursive subquery pattern
DROP POLICY IF EXISTS "Users can view own company" ON companies;
DROP POLICY IF EXISTS "Admins can update company" ON companies;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Company members can view homes" ON homes;
DROP POLICY IF EXISTS "Company members can create homes" ON homes;
DROP POLICY IF EXISTS "Company members can update homes" ON homes;
DROP POLICY IF EXISTS "Company members can view trades" ON trades;
DROP POLICY IF EXISTS "Company members can create trades" ON trades;
DROP POLICY IF EXISTS "Company members can update trades" ON trades;
DROP POLICY IF EXISTS "Company members can view tickets" ON tickets;
DROP POLICY IF EXISTS "Company members can create tickets" ON tickets;
DROP POLICY IF EXISTS "Company members can update tickets" ON tickets;
DROP POLICY IF EXISTS "Company members can view ticket messages" ON ticket_messages;
DROP POLICY IF EXISTS "Company members can create ticket messages" ON ticket_messages;
DROP POLICY IF EXISTS "Company members can view ticket files" ON ticket_files;
DROP POLICY IF EXISTS "Company members can create ticket files" ON ticket_files;
DROP POLICY IF EXISTS "Company members can view triage sessions" ON ai_triage_sessions;
DROP POLICY IF EXISTS "Company members can view triage messages" ON ai_triage_messages;

-- Recreate policies using the helper function (no recursion)

-- Companies
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  USING (id = public.get_my_company_id());

CREATE POLICY "Admins can update company"
  ON companies FOR UPDATE
  USING (id = public.get_my_company_id());

-- Profiles (the main fix — no self-reference)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR company_id = public.get_my_company_id());

-- Homes
CREATE POLICY "Company members can view homes"
  ON homes FOR SELECT
  USING (company_id = public.get_my_company_id());

CREATE POLICY "Company members can create homes"
  ON homes FOR INSERT
  WITH CHECK (company_id = public.get_my_company_id());

CREATE POLICY "Company members can update homes"
  ON homes FOR UPDATE
  USING (company_id = public.get_my_company_id());

-- Trades
CREATE POLICY "Company members can view trades"
  ON trades FOR SELECT
  USING (company_id = public.get_my_company_id());

CREATE POLICY "Company members can create trades"
  ON trades FOR INSERT
  WITH CHECK (company_id = public.get_my_company_id());

CREATE POLICY "Company members can update trades"
  ON trades FOR UPDATE
  USING (company_id = public.get_my_company_id());

-- Tickets
CREATE POLICY "Company members can view tickets"
  ON tickets FOR SELECT
  USING (company_id = public.get_my_company_id());

CREATE POLICY "Company members can create tickets"
  ON tickets FOR INSERT
  WITH CHECK (company_id = public.get_my_company_id());

CREATE POLICY "Company members can update tickets"
  ON tickets FOR UPDATE
  USING (company_id = public.get_my_company_id());

-- Ticket messages
CREATE POLICY "Company members can view ticket messages"
  ON ticket_messages FOR SELECT
  USING (ticket_id IN (SELECT id FROM tickets WHERE company_id = public.get_my_company_id()));

CREATE POLICY "Company members can create ticket messages"
  ON ticket_messages FOR INSERT
  WITH CHECK (ticket_id IN (SELECT id FROM tickets WHERE company_id = public.get_my_company_id()));

-- Ticket files
CREATE POLICY "Company members can view ticket files"
  ON ticket_files FOR SELECT
  USING (ticket_id IN (SELECT id FROM tickets WHERE company_id = public.get_my_company_id()));

CREATE POLICY "Company members can create ticket files"
  ON ticket_files FOR INSERT
  WITH CHECK (ticket_id IN (SELECT id FROM tickets WHERE company_id = public.get_my_company_id()));

-- Triage sessions (company member read)
CREATE POLICY "Company members can view triage sessions"
  ON ai_triage_sessions FOR SELECT
  USING (company_id = public.get_my_company_id());

-- Triage messages (company member read)
CREATE POLICY "Company members can view triage messages"
  ON ai_triage_messages FOR SELECT
  USING (session_id IN (SELECT id FROM ai_triage_sessions WHERE company_id = public.get_my_company_id()));
