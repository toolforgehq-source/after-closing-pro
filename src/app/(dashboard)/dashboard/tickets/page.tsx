'use client';

import { Suspense, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Ticket as TicketIcon, Filter } from 'lucide-react';
import Link from 'next/link';
import type { Ticket, TicketStatus } from '@/lib/types';
import {
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  URGENCY_COLORS,
  URGENCY_LABELS,
  CATEGORY_LABELS,
} from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

const STATUS_FILTERS: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'needs_review', label: 'Needs Review' },
  { value: 'ai_triage', label: 'AI Triage' },
  { value: 'assigned_to_trade', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'ai_resolved', label: 'AI Resolved' },
  { value: 'emergency', label: 'Emergency' },
];

function TicketsContent() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');
  const searchParams = useSearchParams();

  useEffect(() => {
    const statusParam = searchParams.get('status') as TicketStatus | null;
    if (statusParam) setFilter(statusParam);
  }, [searchParams]);

  useEffect(() => {
    async function loadTickets() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) {
        setLoading(false);
        return;
      }

      let query = supabase
        .from('tickets')
        .select('*, home:homes(*), trade:trades(*)')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data } = await query;
      setTickets((data as Ticket[]) ?? []);
      setLoading(false);
    }

    loadTickets();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="mt-1 text-sm text-gray-500">All warranty requests from homeowners</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 flex-shrink-0 text-gray-400" />
        {STATUS_FILTERS.map((sf) => (
          <button
            key={sf.value}
            onClick={() => setFilter(sf.value)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === sf.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {sf.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <EmptyState
              icon={TicketIcon}
              title="No tickets found"
              description={
                filter === 'all'
                  ? 'When homeowners submit issues, tickets will appear here.'
                  : `No tickets with status "${TICKET_STATUS_LABELS[filter as TicketStatus]}".`
              }
              action={
                filter !== 'all' ? (
                  <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
                    Clear filter
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="block px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {ticket.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                            TICKET_STATUS_COLORS[ticket.status]
                          }`}
                        >
                          {TICKET_STATUS_LABELS[ticket.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                        {ticket.ai_summary || ticket.description}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                        <span>{ticket.home?.address}</span>
                        <span>&middot;</span>
                        <span>{CATEGORY_LABELS[ticket.category]}</span>
                        <span>&middot;</span>
                        <span>{timeAgo(ticket.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          URGENCY_COLORS[ticket.urgency]
                        }`}
                      >
                        {URGENCY_LABELS[ticket.urgency]}
                      </span>
                      {ticket.trade && (
                        <span className="text-xs text-gray-400">{ticket.trade.name}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <TicketsContent />
    </Suspense>
  );
}
