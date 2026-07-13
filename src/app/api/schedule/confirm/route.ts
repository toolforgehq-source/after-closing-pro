import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { appointmentConfirmedEmail } from '@/lib/email';
import { formatSlot } from '@/lib/schedule';

export async function POST(request: Request) {
  try {
    const { ticket_id, token, slot } = await request.json();

    if (!ticket_id || !token || !slot) {
      return NextResponse.json({ error: 'Missing ticket_id, token, or slot' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('id, company_id, schedule_token, schedule_status, proposed_slots, title, home:homes(address, homeowner_name, homeowner_email), trade:trades(name, email)')
      .eq('id', ticket_id)
      .single();

    if (fetchError || !ticket || ticket.schedule_token !== token) {
      return NextResponse.json({ error: 'This scheduling link is invalid or has expired.' }, { status: 403 });
    }

    const proposed: string[] = Array.isArray(ticket.proposed_slots) ? ticket.proposed_slots : [];
    const chosen = new Date(slot).toISOString();
    if (!proposed.includes(chosen)) {
      return NextResponse.json({ error: 'That time is no longer available. Please pick one of the proposed slots.' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('tickets')
      .update({
        scheduled_slot: chosen,
        scheduled_at: nowIso,
        schedule_status: 'confirmed',
        status: 'scheduled',
        updated_at: nowIso,
      })
      .eq('id', ticket_id);

    if (updateError) {
      console.error('Confirm update error:', JSON.stringify(updateError));
      return NextResponse.json({ error: 'Failed to confirm the appointment' }, { status: 500 });
    }

    const home = Array.isArray(ticket.home) ? ticket.home[0] : ticket.home;
    const trade = Array.isArray(ticket.trade) ? ticket.trade[0] : ticket.trade;
    const homeownerName = home?.homeowner_name || 'Homeowner';
    const tradeName = trade?.name || 'Trade';
    const readableSlot = formatSlot(chosen);

    await supabase.from('ticket_messages').insert({
      ticket_id,
      sender_type: 'system',
      sender_name: 'Scheduling',
      message: `Appointment confirmed for ${readableSlot} with ${tradeName}.`,
      is_internal: false,
    });

    // Notify homeowner, trade, and builder(s)
    const { data: builders } = await supabase
      .from('profiles')
      .select('email')
      .eq('company_id', ticket.company_id)
      .in('role', ['builder_admin', 'builder_member', 'warranty_manager']);

    const notify: Array<Promise<unknown>> = [];
    const payload = { title: ticket.title, address: home?.address || 'the home', slot: readableSlot, tradeName, homeownerName };

    if (home?.homeowner_email) {
      notify.push(appointmentConfirmedEmail(home.homeowner_email, { ...payload, audience: 'homeowner' }));
    }
    if (trade?.email) {
      notify.push(appointmentConfirmedEmail(trade.email, { ...payload, audience: 'trade' }));
    }
    for (const b of builders ?? []) {
      if (b.email) notify.push(appointmentConfirmedEmail(b.email, { ...payload, audience: 'builder' }));
    }

    try {
      await Promise.all(notify);
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    return NextResponse.json({ success: true, slot: readableSlot });
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
