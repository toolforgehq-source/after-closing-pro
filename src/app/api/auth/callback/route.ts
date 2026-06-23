import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if this user needs company/profile setup (email confirmation flow)
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        // No profile yet — create company and profile from signup metadata
        if (!existingProfile && user.user_metadata?.company_name) {
          const meta = user.user_metadata;

          const { data: company } = await supabase
            .from('companies')
            .insert({
              name: meta.company_name,
              slug: meta.company_slug || meta.company_name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36),
              phone: meta.company_phone || null,
              warranty_period_months: 12,
            })
            .select('id')
            .single();

          if (company) {
            await supabase.from('profiles').insert({
              id: user.id,
              email: user.email,
              full_name: meta.full_name || '',
              role: 'builder_admin',
              company_id: company.id,
            });
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
