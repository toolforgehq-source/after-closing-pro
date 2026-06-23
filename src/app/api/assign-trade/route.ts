import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { tradeAssignmentEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { ticket_id, trade_id, assigned_by } = await request.json();

    if (!ticket_id || !trade_id) {
      return NextResponse.json({ error: 'Missing ticket_id or trade_id' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Update the ticket
    const { error: updateError } = await supabase
      .from('tickets')
      .update({
        trade_id,
        status: 'assigned_to_trade',
        assigned_by: assigned_by || null,
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticket_id);

    if (updateError) {
      console.error('Assign trade update error:', JSON.stringify(updateError));
      return NextResponse.json({ error: 'Failed to assign trade', details: updateError.message }, { status: 500 });
    }

    // Fetch ticket with home info for the email
    const { data: ticket } = await supabase
      .from('tickets')
      .select('*, home:homes(*)')
      .eq('id', ticket_id)
      .single();

    // Fetch the trade
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', trade_id)
      .single();

    if (tradeError) {
      console.error('Fetch trade error:', JSON.stringify(tradeError));
      return NextResponse.json({ error: 'Failed to fetch trade', details: tradeError.message }, { status: 500 });
    }

    // Send email to the trade
    if (ticket && trade?.email) {
      try {
        await tradeAssignmentEmail(trade.email, {
          title: ticket.title,
          address: ticket.home?.address || 'N/A',
          summary: ticket.ai_summary || ticket.homeowner_message || ticket.description,
          homeownerName: ticket.home?.homeowner_name || 'Homeowner',
          homeownerEmail: ticket.home?.homeowner_email || undefined,
          homeownerPhone: ticket.home?.homeowner_phone || undefined,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    return NextResponse.json({ success: true, trade });
  } catch (error) {
    console.error('Assign trade error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
