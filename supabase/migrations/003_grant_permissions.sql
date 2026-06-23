-- Grant table permissions to Supabase roles
-- RLS policies handle row-level access control;
-- these grants allow the roles to access tables at all.

-- Authenticated users (builders, trades, etc.)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Anonymous users (homeowners submitting issues via public intake page)
GRANT SELECT ON companies TO anon;
GRANT SELECT ON homes TO anon;
GRANT INSERT, SELECT ON ai_triage_sessions TO anon;
GRANT INSERT, SELECT ON ai_triage_messages TO anon;
GRANT INSERT ON tickets TO anon;
GRANT INSERT ON ticket_messages TO anon;
GRANT INSERT ON ticket_files TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant execute on the helper function
GRANT EXECUTE ON FUNCTION public.get_my_company_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_company_id() TO anon;
