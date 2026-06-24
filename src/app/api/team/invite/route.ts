import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, companyId } = await request.json();

  // Get company name for the email
  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('id', companyId)
    .single();

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  // Get inviter name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const inviterName = profile?.full_name || 'Your team';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.afterclosingpro.com';

  try {
    await resend.emails.send({
      from: 'After Closing Pro <support@afterclosingpro.com>',
      to: email,
      subject: `${inviterName} invited you to ${company.name} on After Closing Pro`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #111827; margin-bottom: 16px;">You're invited to join ${company.name}</h2>
          <p style="color: #4B5563; line-height: 1.6;">
            ${inviterName} invited you to join their team on After Closing Pro — AI-powered warranty management for homebuilders.
          </p>
          <p style="color: #4B5563; line-height: 1.6;">
            Create your account to get started:
          </p>
          <a href="${appUrl}/signup?invite=${companyId}" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
            Accept Invitation
          </a>
          <p style="color: #9CA3AF; font-size: 13px; margin-top: 24px;">
            After Closing Pro — Stop being the warranty department after closing.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send invite email' }, { status: 500 });
  }
}
