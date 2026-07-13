import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

/**
 * Service-role Supabase client for server-side routes that act on behalf of
 * unauthenticated visitors (e.g. a trade or homeowner following a tokenized
 * email link). Bypasses RLS, so callers MUST validate access themselves
 * (typically by matching a per-ticket schedule token).
 */
export function createAdminClient(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return adminClient;
}
