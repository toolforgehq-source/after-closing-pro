import { NextResponse } from 'next/server';
import { runTriage } from '@/lib/ai/triage';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getWarrantyCoverage, buildCoverageContext } from '@/lib/warranty';
import type { TicketCategory, TicketUrgency } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company_id, home_id, homeowner_name, homeowner_email, messages, session_id, photo_urls } = body;

    if (!company_id || !messages || messages.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Get company context
    const { data: company } = await supabase
      .from('companies')
      .select(
        'name, warranty_period_months, emergency_instructions, warranty_workmanship_months, warranty_systems_months, warranty_structural_months, warranty_excluded_items, warranty_coverage_notes'
      )
      .eq('id', company_id)
      .single();

    // Run AI triage
    const result = await runTriage(messages, company ? {
      name: company.name,
      warrantyPeriodMonths: company.warranty_period_months,
      emergencyInstructions: company.emergency_instructions ?? undefined,
      coverageContext: buildCoverageContext(getWarrantyCoverage(company)),
    } : undefined);

    // Create or update triage session
    let currentSessionId = session_id;
    if (!currentSessionId) {
      const { data: session } = await supabase
        .from('ai_triage_sessions')
        .insert({
          company_id,
          home_id: home_id || null,
          homeowner_name: homeowner_name || 'Unknown',
          homeowner_email: homeowner_email || '',
          status: 'active',
        })
        .select('id')
        .single();

      currentSessionId = session?.id;
    }

    // Save messages
    if (currentSessionId) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg) {
        await supabase.from('ai_triage_messages').insert({
          session_id: currentSessionId,
          role: 'user',
          content: lastUserMsg.content,
        });
      }

      await supabase.from('ai_triage_messages').insert({
        session_id: currentSessionId,
        role: 'assistant',
        content: result.message,
        metadata: result.metadata,
      });
    }

    // If action is create_ticket or escalate, create the ticket
    if (
      result.metadata &&
      (result.metadata.recommended_action === 'create_ticket' ||
        result.metadata.recommended_action === 'escalate')
    ) {
      const isEmergency = result.metadata.safety_escalation || result.metadata.urgency === 'emergency';

      const ticketData = {
        company_id,
        home_id: home_id || null,
        status: isEmergency ? 'emergency' : 'needs_review',
        urgency: (result.metadata.urgency || 'normal') as TicketUrgency,
        category: (result.metadata.category || 'general') as TicketCategory,
        title: generateTitle(messages[0]?.content || 'New Issue'),
        description: messages[0]?.content || '',
        homeowner_message: messages[0]?.content || '',
        ai_summary: result.metadata.builder_summary || null,
        ai_category: result.metadata.category || null,
        ai_urgency: result.metadata.urgency || null,
        ai_trade_recommendation: result.metadata.trade || null,
        ai_warranty_likelihood: result.metadata.warranty_likelihood || null,
        ai_coverage_reason: result.metadata.coverage_reason || null,
        ai_resolved: false,
      };

      const { data: ticket } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select('id')
        .single();

      // Update triage session
      if (currentSessionId) {
        await supabase
          .from('ai_triage_sessions')
          .update({
            status: 'ticket_created',
            ticket_id: ticket?.id,
          })
          .eq('id', currentSessionId);
      }

      // Add AI triage conversation as ticket messages
      if (ticket) {
        const ticketMessages = messages.map((m: { role: string; content: string }) => ({
          ticket_id: ticket.id,
          sender_type: m.role === 'user' ? 'homeowner' : 'ai',
          sender_name: m.role === 'user' ? (homeowner_name || 'Homeowner') : 'AI Assistant',
          message: m.content,
          is_internal: false,
        }));

        // Add the final AI message
        ticketMessages.push({
          ticket_id: ticket.id,
          sender_type: 'ai',
          sender_name: 'AI Assistant',
          message: result.message,
          is_internal: false,
        });

        await supabase.from('ticket_messages').insert(ticketMessages);
      }

      // Save photo files to the ticket
      if (ticket && photo_urls && photo_urls.length > 0) {
        const fileRecords = photo_urls.map((url: string, i: number) => ({
          ticket_id: ticket.id,
          file_url: url,
          file_name: `photo_${i + 1}.jpg`,
          file_type: 'image/jpeg',
          uploaded_by: homeowner_name || 'Homeowner',
        }));
        await supabase.from('ticket_files').insert(fileRecords);
      }

      // TODO: Send email notification to builder
    }

    // If resolved
    if (result.metadata?.recommended_action === 'resolve' && currentSessionId) {
      await supabase
        .from('ai_triage_sessions')
        .update({ status: 'completed' })
        .eq('id', currentSessionId);

      // Optionally create a record of the AI-resolved issue
      if (home_id) {
        await supabase.from('tickets').insert({
          company_id,
          home_id,
          status: 'ai_resolved',
          urgency: 'low',
          category: (result.metadata.category || 'general') as TicketCategory,
          title: generateTitle(messages[0]?.content || 'Resolved Issue'),
          description: messages[0]?.content || '',
          homeowner_message: messages[0]?.content || '',
          ai_summary: result.metadata.builder_summary || 'Issue resolved through AI troubleshooting',
          ai_category: result.metadata.category || null,
          ai_urgency: 'low',
          ai_trade_recommendation: null,
          ai_warranty_likelihood: result.metadata.warranty_likelihood || null,
          ai_coverage_reason: result.metadata.coverage_reason || null,
          ai_resolved: true,
        });
      }
    }

    return NextResponse.json({
      message: result.message,
      metadata: result.metadata,
      session_id: currentSessionId,
    });
  } catch (error) {
    console.error('Triage error:', error);
    return NextResponse.json(
      { error: 'Failed to process triage' },
      { status: 500 }
    );
  }
}

function generateTitle(description: string): string {
  const words = description.split(/\s+/).slice(0, 8).join(' ');
  return words.length < description.length ? words + '...' : words;
}
