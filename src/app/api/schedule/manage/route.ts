import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  tradeAssignmentEmail,
  appointmentConfirmedEmail,
  appointmentCancelledEmail,
} from '@/lib/email';
import { proposeUrl, formatSlot } from '@/lib/schedule';

type Action = 'reschedule' | 'cancel' | 'set_time';

export async function POST(request: Request) {
  try {
    const { ticket_id, action, slot } = (await request.json()) as {
      ticket_id?: string;
      action?: Action;
      slot?: string;
    };

    if (!ticket_id || !action) {
      return NextResponse.json({ error: 'Missing ticket_id or action' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('id, company_id, title, home:homes(address, homeowner_name, homeowner_email), trade:trades(name, email)')
      .eq('id', ticket_id)
      .single();

    if (fetchError || !ticket || !profile?.company_id || ticket.company_id !== profile.company_id) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const home = Array.isArray(ticket.home) ? ticket.home[0] : ticket.home;
    const trade = Array.isArray(ticket.trade) ? ticket.trade[0] : ticket.trade;
    const homeownerName = home?.homeowner_name || 'Homeowner';
    const tradeName = trade?.name || 'Trade';
    const address = home?.address || 'the home';
    const nowIso = new Date().toISOString();

    if (action === 'reschedule') {
      const newToken = randomUUID();
      const { error } = await supabase
        .from('tickets')
        .update({
          schedule_token: newToken,
          schedule_status: 'awaiting_trade',
          proposed_slots: null,
          scheduled_slot: null,
          scheduled_at: null,
          reminder_sent_at: null,
          status: 'assigned_to_trade',
          updated_at: nowIso,
        })
        .eq('id', ticket_id);
      if (error) {
        return NextResponse.json({ error: 'Failed to reschedule' }, { status: 500 });
      }

      await supabase.from('ticket_messages').insert({
        ticket_id,
        sender_type: 'system',
        sender_name: 'Scheduling',
        message: `Builder requested new times. ${tradeName} has been asked to propose availability again.`,
        is_internal: false,
      });

      if (trade?.email) {
        try {
          await tradeAssignmentEmail(trade.email, {
            title: ticket.title,
            address,
            summary: 'The builder has asked you to propose new appointment times.',
            homeownerName,
            homeownerEmail: home?.homeowner_email || undefined,
            proposeUrl: proposeUrl(ticket_id, newToken),
          });
        } catch (e) {
          console.error('Reschedule email error:', e);
        }
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'cancel') {
      const { error } = await supabase
        .from('tickets')
        .update({
          schedule_status: 'cancelled',
          scheduled_slot: null,
          scheduled_at: null,
          reminder_sent_at: null,
          status: 'assigned_to_trade',
          updated_at: nowIso,
        })
        .eq('id', ticket_id);
      if (error) {
        return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 });
      }

      await supabase.from('ticket_messages').insert({
        ticket_id,
        sender_type: 'system',
        sender_name: 'Scheduling',
        message: 'Builder cancelled the scheduled appointment.',
        is_internal: false,
      });

      try {
        const recipients = [home?.homeowner_email, trade?.email].filter(Boolean) as string[];
        await Promise.all(
          recipients.map((to) => appointmentCancelledEmail(to, { title: ticket.title, address }))
        );
      } catch (e) {
        console.error('Cancel email error:', e);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'set_time') {
      if (!slot) {
        return NextResponse.json({ error: 'Missing slot' }, { status: 400 });
      }
      const chosen = new Date(slot);
      if (Number.isNaN(chosen.getTime())) {
        return NextResponse.json({ error: 'Invalid time' }, { status: 400 });
      }
      const iso = chosen.toISOString();
      const { error } = await supabase
        .from('tickets')
        .update({
          scheduled_slot: iso,
          scheduled_at: nowIso,
          schedule_status: 'confirmed',
          status: 'scheduled',
          reminder_sent_at: null,
          updated_at: nowIso,
        })
        .eq('id', ticket_id);
      if (error) {
        return NextResponse.json({ error: 'Failed to set time' }, { status: 500 });
      }

      const readableSlot = formatSlot(iso);
      await supabase.from('ticket_messages').insert({
        ticket_id,
        sender_type: 'system',
        sender_name: 'Scheduling',
        message: `Builder scheduled the appointment for ${readableSlot} with ${tradeName}.`,
        is_internal: false,
      });

      try {
        const payload = { title: ticket.title, address, slot: readableSlot, tradeName, homeownerName };
        const sends: Array<Promise<unknown>> = [];
        if (home?.homeowner_email) sends.push(appointmentConfirmedEmail(home.homeowner_email, { ...payload, audience: 'homeowner' }));
        if (trade?.email) sends.push(appointmentConfirmedEmail(trade.email, { ...payload, audience: 'trade' }));
        await Promise.all(sends);
      } catch (e) {
        console.error('Set-time email error:', e);
      }
      return NextResponse.json({ success: true, slot: readableSlot });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Manage schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
