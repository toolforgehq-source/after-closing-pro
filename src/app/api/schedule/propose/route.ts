import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { homeownerProposedTimesEmail } from '@/lib/email';
import { confirmUrl, formatSlot, normalizeSlots } from '@/lib/schedule';

export async function POST(request: Request) {
  try {
    const { ticket_id, token, slots } = await request.json();

    if (!ticket_id || !token) {
      return NextResponse.json({ error: 'Missing ticket_id or token' }, { status: 400 });
    }

    const normalized = normalizeSlots(slots);
    if (normalized.length === 0) {
      return NextResponse.json({ error: 'Please provide at least one valid time slot' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('id, schedule_token, schedule_status, title, home:homes(address, homeowner_name, homeowner_email), trade:trades(name)')
      .eq('id', ticket_id)
      .single();

    if (fetchError || !ticket || ticket.schedule_token !== token) {
      return NextResponse.json({ error: 'This scheduling link is invalid or has expired.' }, { status: 403 });
    }
    if (ticket.schedule_status === 'confirmed') {
      return NextResponse.json({ error: 'This appointment is already confirmed.' }, { status: 409 });
    }

    const { error: updateError } = await supabase
      .from('tickets')
      .update({
        proposed_slots: normalized,
        schedule_status: 'proposed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticket_id);

    if (updateError) {
      console.error('Propose update error:', JSON.stringify(updateError));
      return NextResponse.json({ error: 'Failed to save proposed times' }, { status: 500 });
    }

    const home = Array.isArray(ticket.home) ? ticket.home[0] : ticket.home;
    const trade = Array.isArray(ticket.trade) ? ticket.trade[0] : ticket.trade;
    const tradeName = trade?.name || 'Your trade';
    const readable = normalized.map(formatSlot);

    await supabase.from('ticket_messages').insert({
      ticket_id,
      sender_type: 'trade',
      sender_name: tradeName,
      message: `Proposed ${normalized.length} appointment time${normalized.length > 1 ? 's' : ''}: ${readable.join(', ')}. Waiting for homeowner to confirm.`,
      is_internal: false,
    });

    if (home?.homeowner_email) {
      try {
        await homeownerProposedTimesEmail(home.homeowner_email, {
          title: ticket.title,
          address: home.address || 'your home',
          tradeName,
          slots: readable,
          confirmUrl: confirmUrl(ticket_id, token),
        });
      } catch (emailError) {
        console.error('Homeowner propose email error:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Propose error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
