import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { appointmentReminderEmail } from '@/lib/email';
import { formatSlot } from '@/lib/schedule';

export const dynamic = 'force-dynamic';

/**
 * Cron endpoint: emails a 24h reminder to the trade and homeowner for
 * appointments happening in the next ~24 hours. Runs daily via Vercel cron.
 * Guarded by CRON_SECRET (Vercel sends it as a Bearer token).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const supabase = createAdminClient();
  const now = new Date();
  const windowStart = now.toISOString();
  const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('id, title, scheduled_slot, home:homes(address, homeowner_email), trade:trades(email)')
    .eq('schedule_status', 'confirmed')
    .is('reminder_sent_at', null)
    .gte('scheduled_slot', windowStart)
    .lte('scheduled_slot', windowEnd);

  if (error) {
    console.error('Reminder query error:', JSON.stringify(error));
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }

  let sent = 0;
  for (const ticket of tickets ?? []) {
    if (!ticket.scheduled_slot) continue;
    const home = Array.isArray(ticket.home) ? ticket.home[0] : ticket.home;
    const trade = Array.isArray(ticket.trade) ? ticket.trade[0] : ticket.trade;
    const payload = {
      title: ticket.title,
      address: home?.address || 'the home',
      slot: formatSlot(ticket.scheduled_slot),
    };
    try {
      const sends: Array<Promise<unknown>> = [];
      if (home?.homeowner_email) sends.push(appointmentReminderEmail(home.homeowner_email, { ...payload, audience: 'homeowner' }));
      if (trade?.email) sends.push(appointmentReminderEmail(trade.email, { ...payload, audience: 'trade' }));
      await Promise.all(sends);
      await supabase
        .from('tickets')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', ticket.id);
      sent += 1;
    } catch (e) {
      console.error('Reminder send error for ticket', ticket.id, e);
    }
  }

  return NextResponse.json({ success: true, reminded: sent });
}
